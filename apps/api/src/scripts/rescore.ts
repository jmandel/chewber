/**
 * Rescore all foods from their stored abstraction JSON.
 *
 * Purely deterministic — no LLM calls. Re-runs the scoring engine
 * against the current additive_risks table, so score changes propagate
 * after additive risk level updates.
 *
 * Usage:
 *   bun run apps/api/src/scripts/rescore.ts            # all active abstractions
 *   bun run apps/api/src/scripts/rescore.ts --dry-run   # preview without writing
 *   bun run apps/api/src/scripts/rescore.ts <food_id>   # single food
 */
import { getDb } from "../db/index";
import { FoodAbstractionSchema, toScoreInputs } from "../scoring/abstraction";
import { scoreFood } from "../scoring/score";
import { nowIso } from "../utils/id";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const foodId = args.find(a => !a.startsWith("--")) ?? null;

const db = getDb();

let rows: any[];
if (foodId) {
  rows = db.query(
    `SELECT id, food_id, score, abstraction_json FROM food_abstractions WHERE food_id = ? AND status = 'active' ORDER BY version DESC LIMIT 1`
  ).all(foodId) as any[];
} else {
  rows = db.query(
    `SELECT id, food_id, score, abstraction_json FROM food_abstractions WHERE status = 'active'`
  ).all() as any[];
}

console.log(`[rescore] Found ${rows.length} active abstraction(s)${dryRun ? " (dry run)" : ""}`);

let changed = 0;
let errors = 0;

const update = db.prepare(
  `UPDATE food_abstractions SET score = ?, score_breakdown_json = ?, updated_at = ? WHERE id = ?`
);

for (const row of rows) {
  try {
    const absRaw = JSON.parse(row.abstraction_json);
    const abs = FoodAbstractionSchema.parse(absRaw);
    const scoreInputs = toScoreInputs(abs);
    const { score, breakdown } = scoreFood({
      ...scoreInputs,
      is_certified_organic: abs.organic.is_certified_organic
    });

    const oldScore = row.score;
    const newScore = score;

    if (oldScore !== newScore) {
      changed++;
      const name = abs.identification.canonical_name;
      console.log(`  ${name}: ${oldScore} → ${newScore}`);

      if (!dryRun) {
        update.run(newScore, JSON.stringify(breakdown), nowIso(), row.id);
      }
    }
  } catch (e: any) {
    errors++;
    console.error(`  ERROR on abstraction ${row.id} (food ${row.food_id}): ${e.message}`);
  }
}

console.log(`[rescore] Done. ${changed} score(s) changed, ${errors} error(s)${dryRun ? " (dry run — no writes)" : ""}.`);
