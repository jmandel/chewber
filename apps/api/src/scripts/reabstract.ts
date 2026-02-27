import { getDb } from "../db/index";
import { reportToJson } from "../agents/jsonStage";
import { FoodAbstractionSchema, toScoreInputs } from "../scoring/abstraction";
import { scoreFood } from "../scoring/score";
import { nowIso } from "../utils/id";

const FOOD_ID = process.argv[2] ?? "food_78e23cc7-e33b-447b-94b1-6741abfdf79b";
const db = getDb();

const row = db.query(
  `SELECT id, report_md, query_payload_json FROM food_abstractions WHERE food_id=? AND status='active' ORDER BY version DESC LIMIT 1`
).get(FOOD_ID) as any;

if (!row?.report_md) { console.error("No report found for", FOOD_ID); process.exit(1); }

console.log("Re-running JSON extraction for", FOOD_ID, "...");
const absRaw = await reportToJson(row.report_md);

if (!absRaw.zagat_line || typeof absRaw.zagat_line !== "string" || absRaw.zagat_line.length < 1) {
  const name = absRaw?.identification?.canonical_name ?? "This food";
  absRaw.zagat_line = `${name} — analysis complete, see full report for details.`;
}

console.log("zagat_line:", absRaw.zagat_line);

const abs = FoodAbstractionSchema.parse(absRaw);
console.log("Schema validation passed");

const scoreInputs = toScoreInputs(abs);
const { score, breakdown } = scoreFood({
  ...scoreInputs,
  is_certified_organic: abs.organic.is_certified_organic
});
console.log("Score:", score);

db.query(
  `UPDATE food_abstractions SET abstraction_json=?, score=?, score_breakdown_json=?, updated_at=? WHERE id=?`
).run(JSON.stringify(abs), score, JSON.stringify(breakdown), nowIso(), row.id);

console.log("Done ✓");
