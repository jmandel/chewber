/**
 * Sync additive research results into the additive_risks reference table.
 *
 * Reads each {CODE}-abstraction.json from research/additives/ and updates:
 *   - risk_level        (from risk_assessment.recommended_level)
 *   - function_category (from function.primary_category)
 *   - description       (chemical_class + mechanism)
 *   - justification     (from risk_assessment.rationale)
 *   - updated_at
 *
 * Then optionally re-scores all foods via the existing rescore script.
 *
 * Usage:
 *   bun run apps/api/src/scripts/syncAdditiveResearch.ts
 *   bun run apps/api/src/scripts/syncAdditiveResearch.ts --dry-run
 *   bun run apps/api/src/scripts/syncAdditiveResearch.ts --no-rescore
 */
import { Database } from "bun:sqlite";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const REPO_ROOT = resolve(import.meta.dir, "../../../..");
const RESEARCH_DIR = join(REPO_ROOT, "research", "additives");
const DB_PATH = process.env.CHEWBER_REF_DB_PATH ?? join(REPO_ROOT, "data", "usda.sqlite");

const VALID_LEVELS = new Set(["risk_free", "limited", "moderate", "high"]);

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const noRescore = args.has("--no-rescore");

if (!existsSync(DB_PATH)) {
  console.error(`ERROR: Reference DB not found at ${DB_PATH}`);
  process.exit(1);
}
if (!existsSync(RESEARCH_DIR)) {
  console.error(`ERROR: Research directory not found at ${RESEARCH_DIR}`);
  process.exit(1);
}

console.log("=== Sync additive research \u2192 additive_risks ===");
console.log(`DB: ${DB_PATH}`);
console.log(`Research: ${RESEARCH_DIR}`);
if (dryRun) console.log("MODE: dry-run (no writes)");
console.log();

// Open DB read-write for updates
const db = new Database(DB_PATH);

const getCurrent = db.prepare(
  `SELECT risk_level, function_category FROM additive_risks WHERE code = ? COLLATE NOCASE LIMIT 1`
);
const updateRow = db.prepare(
  `UPDATE additive_risks
   SET risk_level = ?, function_category = ?, description = ?,
       justification = ?, updated_at = ?
   WHERE code = ? COLLATE NOCASE`
);

let updated = 0;
let unchanged = 0;
let skipped = 0;
let errors = 0;

const entries = readdirSync(RESEARCH_DIR).sort();

for (const entry of entries) {
  const dirPath = join(RESEARCH_DIR, entry);
  if (!statSync(dirPath).isDirectory()) continue;

  const code = entry;
  const jsonFile = join(dirPath, `${code}-abstraction.json`);
  if (!existsSync(jsonFile)) {
    skipped++;
    continue;
  }

  // Parse
  let data: any;
  try {
    data = JSON.parse(readFileSync(jsonFile, "utf-8"));
  } catch (e: any) {
    console.log(`  ERROR parsing ${jsonFile}: ${e.message}`);
    errors++;
    continue;
  }

  const ra = data?.risk_assessment ?? {};
  const fn = data?.function ?? {};
  const ident = data?.identity ?? {};

  const newLevel: string = ra.recommended_level ?? "";
  const funcCat: string = (fn.primary_category ?? "").slice(0, 200);
  const chemClass: string = ident.chemical_class ?? "";
  const mechanism: string = fn.mechanism ?? "";
  const rationale: string = (ra.rationale ?? "").slice(0, 1000);

  // Build description from chemical class + mechanism
  let desc = chemClass;
  if (mechanism) {
    desc = desc ? `${desc}. ${mechanism}` : mechanism;
  }
  desc = desc.slice(0, 500);

  if (!VALID_LEVELS.has(newLevel)) {
    console.log(`  SKIP ${code}: invalid level '${newLevel}'`);
    skipped++;
    continue;
  }

  // Current DB values
  const row = getCurrent.get(code) as { risk_level: string; function_category: string | null } | null;
  if (!row) {
    console.log(`  SKIP ${code}: not in additive_risks table`);
    skipped++;
    continue;
  }

  if (row.risk_level === newLevel && row.function_category) {
    unchanged++;
    continue;
  }

  if (row.risk_level !== newLevel) {
    console.log(`  ${code}: ${row.risk_level} \u2192 ${newLevel}`);
  } else {
    console.log(`  ${code}: enriching metadata (level unchanged: ${newLevel})`);
  }

  if (!dryRun) {
    const now = new Date().toISOString();
    updateRow.run(newLevel, funcCat, desc, rationale, now, code);
  }

  updated++;
}

console.log();
console.log("=== Summary ===");
console.log(`  Updated:   ${updated}`);
console.log(`  Unchanged: ${unchanged}`);
console.log(`  Skipped:   ${skipped}`);
console.log(`  Errors:    ${errors}`);

// Distribution
console.log();
console.log("=== Risk level distribution ===");
const dist = db.prepare("SELECT risk_level, count(*) as n FROM additive_risks GROUP BY risk_level ORDER BY n DESC").all() as any[];
for (const r of dist) {
  console.log(`  ${r.risk_level}: ${r.n}`);
}

db.close();

// Rescore
if (!noRescore && !dryRun && updated > 0) {
  console.log();
  console.log("=== Re-scoring foods ===");
  const result = Bun.spawnSync({
    cmd: ["bun", "run", "apps/api/src/scripts/rescore.ts"],
    cwd: REPO_ROOT,
    stdout: "inherit",
    stderr: "inherit",
  });
  if (result.exitCode !== 0) {
    console.error("Rescore failed");
  }
}

console.log();
console.log("Done. Restart the API server to pick up changes:");
console.log("  sudo systemctl restart chewber");
