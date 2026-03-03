import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getLlm } from "./llm/client";
import { getDb } from "../db";
import { FoodAbstractionSchema } from "../scoring/abstraction";
import { toGeminiSchema } from "./llm/schemaTransform";

const prompt = readFileSync(resolve(import.meta.dir, "./prompts/report_to_json.md"), "utf-8");

// The annotated schema source doubles as LLM documentation — comments
// teach the extractor how to populate each field.
const schemaSourceText = readFileSync(
  resolve(import.meta.dir, "../scoring/abstraction.schema.ts"), "utf-8"
);

// Derive JSON Schema from Zod for structured output constraint.
const absSchema = zodToJsonSchema(FoodAbstractionSchema, { target: "jsonSchema7" });
const cleanSchema = toGeminiSchema(absSchema);

const MAX_RETRIES = 2;

/** Build the full category taxonomy block for the system prompt. */
function buildCategoryHint(): string {
  const db = getDb();
  const all = db.query(
    `SELECT slug, kind, parent_slug, display_name, description FROM categories ORDER BY kind, slug`
  ).all() as { slug: string; kind: string; parent_slug: string | null; display_name: string; description: string }[];

  if (all.length === 0) return "";

  const categories = all.filter(c => c.kind === "category");
  const traits = all.filter(c => c.kind === "trait");

  const fmtLine = (c: { slug: string; parent_slug: string | null; description: string }) => {
    let line = `  ${c.slug}`;
    if (c.parent_slug) line += ` (→ ${c.parent_slug})`;
    if (c.description) line += ` — ${c.description}`;
    return line;
  };

  return [
    "",
    "## Existing tag taxonomy (REUSE these — do NOT invent synonyms)",
    "",
    "### Food-type categories (kind=\"category\" — describes WHAT the food IS):",
    ...categories.map(fmtLine),
    "",
    "### Attribute/trait tags (kind=\"trait\" — describes a property/modifier):",
    ...traits.map(fmtLine),
    "",
    "If you need a slug not listed above, you MUST add it to `new_categories`",
    "with kind, parent_slug, display_name, and description so it gets registered.",
    "EVERY new slug in `categories` MUST have a matching `new_categories` entry.",
    ""
  ].join("\n");
}

type NewCategory = {
  slug: string;
  kind: "category" | "trait";
  parent_slug: string | null;
  display_name: string;
  description: string;
};

/** Find category slugs used in the abstraction that don't exist in the DB. */
function findUnregisteredSlugs(categories: string[]): string[] {
  const db = getDb();
  const existing = new Set(
    (db.query(`SELECT slug FROM categories`).all() as { slug: string }[]).map(r => r.slug)
  );
  return categories.filter(slug => !existing.has(slug));
}

/**
 * Register new categories declared by the LLM via `new_categories`.
 * Also catches any undeclared new slugs as a safety net (kind='unclassified').
 */
function registerNewCategories(
  declaredNew: NewCategory[],
  allUsedSlugs: string[]
) {
  const db = getDb();
  const now = new Date().toISOString();

  // Load existing slugs for parent_slug validation
  const existingSlugs = new Set(
    (db.query(`SELECT slug FROM categories`).all() as { slug: string }[]).map(r => r.slug)
  );

  const upsert = db.prepare(
    `INSERT INTO categories (slug, display_name, description, kind, parent_slug, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       display_name = CASE WHEN categories.display_name = '' OR categories.display_name = categories.slug
                           THEN excluded.display_name ELSE categories.display_name END,
       description  = CASE WHEN categories.description = '' THEN excluded.description ELSE categories.description END,
       kind         = CASE WHEN categories.kind = 'unclassified' THEN excluded.kind ELSE categories.kind END,
       parent_slug  = CASE WHEN categories.parent_slug IS NULL THEN excluded.parent_slug ELSE categories.parent_slug END,
       updated_at   = excluded.updated_at`
  );

  // Register explicitly declared new categories (with full metadata)
  const declaredSlugs = new Set<string>();
  for (const nc of declaredNew) {
    declaredSlugs.add(nc.slug);
    // Validate parent_slug exists (or is another new category being declared)
    const parentValid = !nc.parent_slug || existingSlugs.has(nc.parent_slug) || declaredSlugs.has(nc.parent_slug);
    if (nc.parent_slug && !parentValid) {
      console.warn(`[jsonStage] new category '${nc.slug}' references unknown parent '${nc.parent_slug}', setting to null`);
    }
    upsert.run(
      nc.slug,
      nc.display_name || slugToTitle(nc.slug),
      nc.description || "",
      nc.kind,
      parentValid ? (nc.parent_slug ?? null) : null,
      now, now
    );
    existingSlugs.add(nc.slug); // so subsequent entries can reference it as parent
  }

  // Safety net: catch any slugs the LLM used but didn't declare as new
  const undeclared = findUnregisteredSlugs(allUsedSlugs)
    .filter(s => !declaredSlugs.has(s));
  if (undeclared.length > 0) {
    console.warn(`[jsonStage] LLM used ${undeclared.length} undeclared new slug(s): ${undeclared.join(", ")}`);
    for (const slug of undeclared) {
      upsert.run(slug, slugToTitle(slug), "", "unclassified", null, now, now);
    }
  }

  return { declared: declaredNew.length, undeclared: undeclared.length };
}

function slugToTitle(slug: string): string {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function reportToJson(reportMd: string): Promise<any> {
  const llm = getLlm("json_extract");
  const categoryHint = buildCategoryHint();
  const fullPrompt = prompt + categoryHint;

  const messages: { role: string; content: string }[] = [
    { role: "system", content: fullPrompt },
    {
      role: "user",
      content: [
        "## Schema definition (annotated TypeScript — read comments for field instructions)",
        "```typescript",
        schemaSourceText,
        "```",
        "",
        "## Report to extract",
        reportMd
      ].join("\n")
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

    // Register new categories: use explicit new_categories declarations + safety net
    const categories: string[] = Array.isArray(parsed?.categories) ? parsed.categories : [];
    const declaredNew: NewCategory[] = Array.isArray(parsed?.new_categories) ? parsed.new_categories : [];
    const { declared, undeclared } = registerNewCategories(declaredNew, categories);
    if (declared > 0) console.log(`[jsonStage] registered ${declared} new category/ies: ${declaredNew.map(c => c.slug).join(", ")}`);
    if (undeclared > 0) console.warn(`[jsonStage] ${undeclared} undeclared slug(s) registered as 'unclassified'`);

    return parsed;
  }

  throw lastError ?? new Error("JSON extraction failed after retries");
}
