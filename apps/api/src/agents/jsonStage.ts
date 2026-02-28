import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getLlm } from "./llm/client";
import { getDb } from "../db";
import { FoodAbstractionSchema } from "../scoring/abstraction";
import { toGeminiSchema } from "./llm/schemaTransform";

const prompt = readFileSync(resolve(import.meta.dir, "./prompts/report_to_json.md"), "utf-8");

// Single source of truth: derive JSON Schema from the Zod schema used for validation.
const absSchema = zodToJsonSchema(FoodAbstractionSchema, { target: "jsonSchema7" });
const cleanSchema = toGeminiSchema(absSchema);

const MAX_RETRIES = 2;

/** Build a category hint block to inject into the system prompt. */
function buildCategoryHint(): string {
  const db = getDb();
  const all = db.query(
    `SELECT slug, display_name, description FROM categories ORDER BY slug`
  ).all() as { slug: string; display_name: string; description: string }[];

  if (all.length === 0) return "";

  const SAMPLE_MAX = 50;
  const sampled = all.slice(0, SAMPLE_MAX);
  const lines = sampled.map(c =>
    `  - \`${c.slug}\` — ${c.display_name}${c.description ? `: ${c.description}` : ""}`
  );
  const remaining = all.length - sampled.length;
  const suffix = remaining > 0 ? `\n  - … and ${remaining} more` : "";

  return [
    "",
    "## Existing categories (reuse when they fit)",
    ...lines,
    suffix,
    ""
  ].join("\n");
}

/** Register any new category slugs. Returns the list of newly created slugs. */
function findNewCategories(categories: string[]): string[] {
  const db = getDb();
  const existing = new Set(
    (db.query(`SELECT slug FROM categories`).all() as { slug: string }[]).map(r => r.slug)
  );
  return categories.filter(slug => !existing.has(slug));
}

/** Ask the LLM to generate display names + descriptions for new category slugs. */
async function describeNewCategories(
  slugs: string[],
  foodContext: string
): Promise<{ slug: string; display_name: string; description: string }[]> {
  if (slugs.length === 0) return [];

  const llm = getLlm("json_extract");
  const { text } = await llm.chat({
    messages: [
      {
        role: "system",
        content: [
          "You generate human-readable metadata for food category slugs.",
          "For each slug, provide a display_name (Title Case, 1-4 words) and a description (1 sentence, under 100 chars).",
          "Return a JSON array of objects: [{ \"slug\": \"...\", \"display_name\": \"...\", \"description\": \"...\" }]",
          "Output ONLY valid JSON. No markdown fences."
        ].join("\n")
      },
      {
        role: "user",
        content: JSON.stringify({
          new_slugs: slugs,
          food_context: foodContext
        })
      }
    ] as any,
    temperature: 0.2
  });

  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    const arr = JSON.parse(cleaned);
    if (!Array.isArray(arr)) return slugs.map(s => ({ slug: s, display_name: slugToTitle(s), description: "" }));
    return arr;
  } catch {
    // Fallback: auto-generate from slug
    return slugs.map(s => ({ slug: s, display_name: slugToTitle(s), description: "" }));
  }
}

function slugToTitle(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function registerCategories(items: { slug: string; display_name: string; description: string }[]) {
  const db = getDb();
  const now = new Date().toISOString();
  const upsert = db.prepare(
    `INSERT INTO categories (slug, display_name, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       display_name = CASE WHEN excluded.display_name != '' THEN excluded.display_name ELSE categories.display_name END,
       description  = CASE WHEN excluded.description  != '' THEN excluded.description  ELSE categories.description  END,
       updated_at   = excluded.updated_at`
  );
  for (const item of items) {
    upsert.run(item.slug, item.display_name, item.description || "", now, now);
  }
}

export async function reportToJson(reportMd: string): Promise<any> {
  const llm = getLlm("json_extract");
  const categoryHint = buildCategoryHint();
  const fullPrompt = prompt + categoryHint;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: fullPrompt },
    {
      role: "user",
      content: JSON.stringify(
        {
          json_schema: absSchema,
          report_markdown: reportMd
        },
        null,
        2
      )
    }
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { text } = await llm.chat({
      messages: messages as any,
      temperature: 0.1,
      jsonSchema: { name: "food_abstraction", schema: cleanSchema }
    });

    let parsed: any;
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }
      parsed = JSON.parse(cleaned);
    } catch (e: any) {
      lastError = new Error(`JSON extractor returned non-JSON output: ${text.slice(0, 300)}`);
      if (attempt < MAX_RETRIES) {
        messages.push(
          { role: "assistant", content: text },
          { role: "user", content: `ERROR: Your response was not valid JSON. Parse error: ${String(e?.message ?? e)}. Please return ONLY a valid JSON object matching the schema. Try again.` }
        );
        continue;
      }
      throw lastError;
    }

    // Auto-register any new categories the LLM invented
    const categories: string[] = Array.isArray(parsed?.categories) ? parsed.categories : [];
    const newSlugs = findNewCategories(categories);
    if (newSlugs.length > 0) {
      const foodName = parsed?.identification?.canonical_name ?? "unknown food";
      const described = await describeNewCategories(newSlugs, foodName);
      registerCategories(described);
    }

    return parsed;
  }

  throw lastError ?? new Error("JSON extraction failed after retries");
}
