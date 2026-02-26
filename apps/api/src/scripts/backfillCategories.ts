/**
 * Backfill categories for existing foods that have abstractions but no categories.
 * Makes a single LLM call for all foods at once.
 */
import { getDb } from "../db";
import { getLlm } from "../agents/llm/client";
import { generateTags } from "../utils/autoTags";

const db = getDb();

// Get all foods with abstractions missing categories
const rows = db.query(`
  SELECT f.id, f.canonical_name, f.brand, f.tags_json,
         a.id as abs_id, a.abstraction_json
  FROM foods f
  JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
  WHERE json_extract(a.abstraction_json, '$.categories') IS NULL
`).all() as any[];

if (rows.length === 0) {
  console.log("[backfill] all foods already have categories");
  process.exit(0);
}

console.log(`[backfill] ${rows.length} food(s) need categories`);

// Load existing categories for context
const existingCats = db.query(`SELECT slug, display_name, description FROM categories ORDER BY slug`).all() as any[];
const catList = existingCats.map((c: any) => `  - ${c.slug}: ${c.display_name} — ${c.description}`).join("\n");

// Build the prompt
const foodDescriptions = rows.map((r: any, i: number) => {
  const abs = JSON.parse(r.abstraction_json);
  return `${i + 1}. "${r.canonical_name}"${r.brand ? ` by ${r.brand}` : ""} — kind: ${abs.identification?.kind ?? "unknown"}, ingredients: ${(abs.ingredients?.ingredients_text ?? "n/a").slice(0, 120)}`;
}).join("\n");

const llm = getLlm("json_extract");

const { text } = await llm.chat({
  messages: [
    {
      role: "system",
      content: [
        "You assign food category slugs. For each food, pick 2-8 categories from the existing list. Invent new kebab-case slugs only when nothing fits.",
        "Do NOT include nutrition-level tags (high-protein, low-sugar, etc.).",
        "Do NOT include organic/conventional.",
        "",
        "Existing categories:",
        catList,
        "",
        'Return JSON array: [{"index": 1, "categories": ["slug1", "slug2", ...]}, ...]',
        "Output ONLY valid JSON."
      ].join("\n")
    },
    { role: "user", content: foodDescriptions }
  ] as any,
  temperature: 0.1
});

let assignments: { index: number; categories: string[] }[];
try {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  assignments = JSON.parse(cleaned);
} catch (e) {
  console.error("[backfill] LLM returned invalid JSON:", text.slice(0, 500));
  process.exit(1);
}

console.log("[backfill] LLM assigned categories:");

const updateAbs = db.prepare(`UPDATE food_abstractions SET abstraction_json = ?, updated_at = ? WHERE id = ?`);
const updateTags = db.prepare(`UPDATE foods SET tags_json = ?, updated_at = ? WHERE id = ?`);
const insertCat = db.prepare(`INSERT OR IGNORE INTO categories (slug, display_name, description, created_at) VALUES (?, ?, ?, ?)`);
const now = new Date().toISOString();
const existingSlugs = new Set(existingCats.map((c: any) => c.slug));

for (const a of assignments) {
  const row = rows[a.index - 1];
  if (!row) continue;

  const cats = a.categories;
  console.log(`  ${row.canonical_name}: ${cats.join(", ")}`);

  // Register any new categories
  for (const slug of cats) {
    if (!existingSlugs.has(slug)) {
      const displayName = slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      insertCat.run(slug, displayName, "", now);
      existingSlugs.add(slug);
      console.log(`    [new category] ${slug}`);
    }
  }

  // Update abstraction JSON
  const abs = JSON.parse(row.abstraction_json);
  abs.categories = cats;
  updateAbs.run(JSON.stringify(abs), now, row.abs_id);

  // Recompute merged tags
  const allTags = generateTags(abs);
  updateTags.run(JSON.stringify(allTags), now, row.id);
}

console.log("[backfill] done");
