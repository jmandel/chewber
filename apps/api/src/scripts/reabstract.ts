import { getDb } from "../db/index";
import { reportToJson } from "../agents/jsonStage";
import { FoodAbstractionSchema, toScoreInputs } from "../scoring/abstraction";
import { scoreFood } from "../scoring/score";
import { nowIso } from "../utils/id";

const db = getDb();

async function reabstractOne(foodId: string) {
  const row = db.query(
    `SELECT id, report_md, query_payload_json FROM food_abstractions WHERE food_id=? AND status='active' ORDER BY version DESC LIMIT 1`
  ).get(foodId) as any;

  if (!row?.report_md) { console.error("  No report found for", foodId); return false; }

  console.log("  Re-running JSON extraction...");
  const absRaw = await reportToJson(row.report_md);

  if (!absRaw.zagat_line || typeof absRaw.zagat_line !== "string" || absRaw.zagat_line.length < 1) {
    const name = absRaw?.identification?.canonical_name ?? "This food";
    absRaw.zagat_line = `${name} — analysis complete, see full report for details.`;
  }

  const abs = FoodAbstractionSchema.parse(absRaw);
  console.log("  Schema OK | carbs:", abs.nutrition_per_100.carbohydrates_g ?? "null");

  const scoreInputs = toScoreInputs(abs);
  const { score, breakdown } = scoreFood({
    ...scoreInputs,
    is_certified_organic: abs.organic.is_certified_organic
  });
  console.log("  Score:", score);

  db.query(
    `UPDATE food_abstractions SET abstraction_json=?, score=?, score_breakdown_json=?, updated_at=? WHERE id=?`
  ).run(JSON.stringify(abs), score, JSON.stringify(breakdown), nowIso(), row.id);

  return true;
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

if (args.includes("--all-missing-carbs")) {
  // Find all active abstractions where carbohydrates_g is missing
  const rows = db.query(
    `SELECT fa.food_id, f.canonical_name, f.brand
     FROM food_abstractions fa
     JOIN foods f ON f.id = fa.food_id
     WHERE fa.status = 'active'
       AND json_extract(fa.abstraction_json, '$.nutrition_per_100.carbohydrates_g') IS NULL
     ORDER BY fa.created_at`
  ).all() as any[];

  console.log(`Found ${rows.length} foods missing carbohydrates_g`);
  if (dryRun) {
    for (const r of rows) console.log(" ", r.food_id, r.canonical_name, r.brand ?? "");
    process.exit(0);
  }

  let ok = 0, fail = 0;
  for (const r of rows) {
    console.log(`\n[${ok + fail + 1}/${rows.length}] ${r.canonical_name} (${r.food_id})`);
    try {
      const success = await reabstractOne(r.food_id);
      if (success) ok++; else fail++;
    } catch (e: any) {
      console.error("  FAILED:", e.message);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} updated, ${fail} failed`);
} else {
  // Single food mode
  const foodId = args.find(a => !a.startsWith("--")) ?? "food_78e23cc7-e33b-447b-94b1-6741abfdf79b";
  console.log("Re-abstracting", foodId);
  await reabstractOne(foodId);
  console.log("Done ✓");
}
