import { getDb } from "./index";
import { makeSlug } from "../utils/slug";
import { generateTags } from "../utils/autoTags";

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
  `SELECT f.id, f.canonical_name, f.brand, a.abstraction_json
   FROM foods f
   LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
   WHERE f.slug IS NULL`
).all() as { id: string; canonical_name: string; brand: string | null; abstraction_json: string | null }[];

if (foodsWithoutSlug.length > 0) {
  const updateSlug = db.prepare(`UPDATE foods SET slug = ? WHERE id = ?`);
  for (const f of foodsWithoutSlug) {
    let organic: string | null = null;
    try { organic = JSON.parse(f.abstraction_json ?? "{}")?.organic?.is_certified_organic ?? null; } catch {}
    const slug = makeSlug(f.canonical_name, f.brand, f.id, organic);
    updateSlug.run(slug, f.id);
  }
  console.log(`[migrate] backfilled slugs for ${foodsWithoutSlug.length} food(s)`);
} else {
  console.log("[migrate] all foods have slugs");
}

// Migration: backfill tags_json from abstractions for foods with empty tags
const foodsEmptyTags = db.query(
  `SELECT f.id, f.tags_json, a.abstraction_json
   FROM foods f
   LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
   WHERE (f.tags_json IS NULL OR f.tags_json = '[]') AND a.abstraction_json IS NOT NULL`
).all() as { id: string; tags_json: string; abstraction_json: string }[];

if (foodsEmptyTags.length > 0) {
  const updateTags = db.prepare(`UPDATE foods SET tags_json = ?, updated_at = ? WHERE id = ?`);
  const now = new Date().toISOString();
  for (const f of foodsEmptyTags) {
    try {
      const abs = JSON.parse(f.abstraction_json);
      const tags = generateTags(abs);
      if (tags.length > 0) {
        updateTags.run(JSON.stringify(tags), now, f.id);
      }
    } catch {}
  }
  console.log(`[migrate] backfilled tags for ${foodsEmptyTags.length} food(s)`);
} else {
  console.log("[migrate] all foods have tags (or no abstractions yet)");
}

console.log("[migrate] done");
