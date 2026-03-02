/**
 * Classify unclassified tags in the categories table.
 *
 * Phase 1: Apply known classifications from data/tag_classifications.json
 * Phase 2: Use LLM to classify any remaining 'unclassified' tags,
 *          given the existing taxonomy as context.
 *
 * Safe to re-run — only touches tags with kind='unclassified'.
 * Usage: bun run apps/api/src/scripts/classifyTags.ts [--dry-run]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDb } from "../db";
import { getLlm } from "../agents/llm/client";

const dryRun = process.argv.includes("--dry-run");
const db = getDb();

type Classification = { slug: string; kind: "category" | "trait"; parent_slug: string | null };

// ── Phase 1: Apply static seed data ──────────────────────────────
const seedPath = resolve(import.meta.dir, "tag_classifications.json");
let seedData: Classification[] = [];
try {
  seedData = JSON.parse(readFileSync(seedPath, "utf-8"));
} catch {
  console.log("[classifyTags] no seed file found, skipping phase 1");
}

if (seedData.length > 0) {
  const update = db.prepare(
    `UPDATE categories SET kind = ?, parent_slug = ?, updated_at = ? WHERE slug = ? AND kind = 'unclassified'`
  );
  const now = new Date().toISOString();
  let applied = 0;

  db.exec("BEGIN");
  for (const c of seedData) {
    if (dryRun) {
      const row = db.query(`SELECT slug FROM categories WHERE slug = ? AND kind = 'unclassified'`).get(c.slug) as any;
      if (row) {
        console.log(`  [seed] ${c.slug} → ${c.kind}${c.parent_slug ? ` (parent: ${c.parent_slug})` : ""}`);
        applied++;
      }
    } else {
      const result = update.run(c.kind, c.parent_slug ?? null, now, c.slug);
      if ((result as any).changes > 0) applied++;
    }
  }
  if (!dryRun) db.exec("COMMIT");
  else db.exec("ROLLBACK");
  console.log(`[classifyTags] phase 1: ${applied} tags classified from seed data${dryRun ? " (dry-run)" : ""}`);
}

// ── Phase 2: LLM classification of remaining unclassified tags ───
const unclassified = db.query(
  `SELECT slug FROM categories WHERE kind = 'unclassified' ORDER BY slug`
).all() as { slug: string }[];

if (unclassified.length === 0) {
  console.log("[classifyTags] no unclassified tags remaining");
  process.exit(0);
}

console.log(`[classifyTags] phase 2: ${unclassified.length} unclassified tags to classify via LLM`);

// Build context: existing classified tags + hierarchy
const classified = db.query(
  `SELECT slug, kind, parent_slug FROM categories WHERE kind != 'unclassified' ORDER BY kind, slug`
).all() as { slug: string; kind: string; parent_slug: string | null }[];

const categoryExamples = classified
  .filter(c => c.kind === "category")
  .slice(0, 60)
  .map(c => `  ${c.slug}${c.parent_slug ? " → " + c.parent_slug : ""}`);

const traitExamples = classified
  .filter(c => c.kind === "trait")
  .slice(0, 40)
  .map(c => `  ${c.slug}`);

const allSlugs = new Set([
  ...classified.map(c => c.slug),
  ...unclassified.map(c => c.slug)
]);

const llm = getLlm("json_extract");
const { text } = await llm.chat({
  messages: [
    {
      role: "system",
      content: [
        "Classify food tags as 'category' or 'trait' and assign parent_slug.",
        "",
        "category = what kind of food it IS (would be a grocery aisle/section):",
        ...categoryExamples,
        "",
        "trait = property/attribute/modifier (diet, cuisine, processing, sensory):",
        ...traitExamples,
        "",
        "For parent_slug, pick the most direct parent from ALL known slugs (classified + unclassified).",
        "Set null if root-level or no clear parent.",
        "",
        "Return a JSON array: [{\"slug\":\"...\",\"kind\":\"category\"|\"trait\",\"parent_slug\":\"...\"|null}, ...]",
        "Output ONLY valid JSON."
      ].join("\n")
    },
    {
      role: "user",
      content: "Classify these tags:\n" + unclassified.map(c => c.slug).join("\n")
    }
  ] as any,
  temperature: 0.1
});

let results: Classification[];
try {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  results = JSON.parse(cleaned);
  if (!Array.isArray(results)) throw new Error("not an array");
} catch (e) {
  console.error("[classifyTags] LLM returned invalid JSON:", text.slice(0, 500));
  process.exit(1);
}

// Validate and apply
const update = db.prepare(
  `UPDATE categories SET kind = ?, parent_slug = ?, updated_at = ? WHERE slug = ? AND kind = 'unclassified'`
);
const now = new Date().toISOString();
let applied = 0;

if (!dryRun) db.exec("BEGIN");
for (const r of results) {
  if (!r.slug || !r.kind || (r.kind !== "category" && r.kind !== "trait")) continue;
  // Validate parent exists
  const parentOk = !r.parent_slug || allSlugs.has(r.parent_slug);
  const parent = parentOk ? (r.parent_slug ?? null) : null;

  if (dryRun) {
    console.log(`  [llm] ${r.slug} → ${r.kind}${parent ? " (parent: " + parent + ")" : ""}`);
  } else {
    const result = update.run(r.kind, parent, now, r.slug);
    if ((result as any).changes > 0) applied++;
  }
}
if (!dryRun) db.exec("COMMIT");

console.log(`[classifyTags] phase 2: ${dryRun ? results.length + " would be" : applied} classified via LLM${dryRun ? " (dry-run)" : ""}`);

// Summary
const counts = db.query(
  `SELECT kind, COUNT(*) as cnt FROM categories GROUP BY kind ORDER BY kind`
).all() as { kind: string; cnt: number }[];
console.log("[classifyTags] final counts:", counts.map(c => `${c.kind}=${c.cnt}`).join(", "));
