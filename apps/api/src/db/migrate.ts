import { getDb } from "./index";

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

console.log("[migrate] done");
