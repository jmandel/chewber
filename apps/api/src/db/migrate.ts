import { getDb } from "./index";
import { makeSlug } from "../utils/slug";

const db = getDb();
console.log("[migrate] schema applied");

// Migration: rename legacy_nutrition_score -> nutrition_score in stored JSON
const rows = db.query(
  `SELECT id, score_breakdown_json FROM food_abstractions WHERE score_breakdown_json LIKE '%legacy_nutrition_score%'`
).all() as { id: string; score_breakdown_json: string }[];

if (rows.length > 0) {
  const update = db.prepare(`UPDATE food_abstractions SET score_breakdown_json = ? WHERE id = ?`);
  for (const row of rows) {
    const patched = row.score_breakdown_json.replace(/"legacy_nutrition_score"/g, '"nutrition_score"');
    update.run(patched, row.id);
  }
  console.log(`[migrate] patched ${rows.length} breakdown(s): legacy_nutrition_score -> nutrition_score`);
} else {
  console.log("[migrate] no legacy JSON to patch");
}

// Migration: add slug column to foods if missing, and backfill
try {
  db.exec(`ALTER TABLE foods ADD COLUMN slug TEXT UNIQUE`);
  console.log("[migrate] added slug column to foods");
} catch {
  // column already exists
}

const foodsWithoutSlug = db.query(
  `SELECT id, canonical_name, brand FROM foods WHERE slug IS NULL`
).all() as { id: string; canonical_name: string; brand: string | null }[];

if (foodsWithoutSlug.length > 0) {
  const updateSlug = db.prepare(`UPDATE foods SET slug = ? WHERE id = ?`);
  for (const f of foodsWithoutSlug) {
    const slug = makeSlug(f.canonical_name, f.brand, f.id);
    updateSlug.run(slug, f.id);
  }
  console.log(`[migrate] backfilled slugs for ${foodsWithoutSlug.length} food(s)`);
} else {
  console.log("[migrate] all foods have slugs");
}

console.log("[migrate] done");
