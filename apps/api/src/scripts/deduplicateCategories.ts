/**
 * Merge duplicate category slugs.
 *
 * Reads merge pairs from a JSON file: [["keep", "retire"], ...]
 *
 * Usage:
 *   bun run apps/api/src/scripts/deduplicateCategories.ts <merges.json> [--dry-run]
 *
 * Example merges.json:
 *   [["biscuits", "biscuit"], ["snacks", "snack"]]
 *
 * See prompts/deduplicate-categories.md for the full procedure.
 */
import { readFileSync } from "node:fs";
import { getDb } from "../db";

const args = process.argv.slice(2).filter(a => !a.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");

if (args.length === 0) {
  console.error("Usage: bun run deduplicateCategories.ts <merges.json> [--dry-run]");
  console.error("  merges.json: [[\"keep\", \"retire\"], ...]");
  process.exit(1);
}

const mergesPath = args[0];
let merges: [string, string][];
try {
  merges = JSON.parse(readFileSync(mergesPath, "utf-8"));
  if (!Array.isArray(merges) || !merges.every(m => Array.isArray(m) && m.length === 2)) {
    throw new Error("expected array of [keep, retire] pairs");
  }
} catch (e: any) {
  console.error(`Failed to read merges from ${mergesPath}: ${e.message}`);
  process.exit(1);
}

console.log(`[dedup] ${merges.length} merge(s) from ${mergesPath}${dryRun ? " (dry-run)" : ""}`);

const db = getDb();

function parseTags(json: string): string[] {
  try { const v = JSON.parse(json); return Array.isArray(v) ? v : []; }
  catch { return []; }
}

let totalRetargeted = 0;
let totalRetagged = 0;
let totalDeleted = 0;

if (!dryRun) db.exec("BEGIN");

for (const [keep, retire] of merges) {
  const keepRow = db.query(`SELECT slug FROM categories WHERE slug = ?`).get(keep) as any;
  const retireRow = db.query(`SELECT slug FROM categories WHERE slug = ?`).get(retire) as any;
  if (!keepRow) { console.log(`  skip: canonical '${keep}' not found`); continue; }
  if (!retireRow) { console.log(`  skip: retired '${retire}' not found`); continue; }

  console.log(`\n${retire} \u2192 ${keep}`);

  // 1. Retarget children
  const children = db.query(
    `SELECT slug FROM categories WHERE parent_slug = ?`
  ).all(retire) as { slug: string }[];
  if (children.length > 0) {
    console.log(`  retarget ${children.length} children: ${children.map(c => c.slug).join(", ")}`);
    if (!dryRun) {
      db.query(`UPDATE categories SET parent_slug = ?, updated_at = ? WHERE parent_slug = ?`)
        .run(keep, new Date().toISOString(), retire);
    }
    totalRetargeted += children.length;
  }

  // 2. Rewrite food tags
  const foods = db.query(
    `SELECT id, tags_json FROM foods WHERE EXISTS (SELECT 1 FROM json_each(foods.tags_json) WHERE value = ?)`
  ).all(retire) as { id: string; tags_json: string }[];
  if (foods.length > 0) {
    console.log(`  retag ${foods.length} food(s)`);
    const now = new Date().toISOString();
    for (const f of foods) {
      const tags = parseTags(f.tags_json);
      const hasKeep = tags.includes(keep);
      const newTags = tags.filter(t => t !== retire);
      if (!hasKeep) newTags.push(keep);
      newTags.sort();
      if (!dryRun) {
        db.query(`UPDATE foods SET tags_json = ?, updated_at = ? WHERE id = ?`)
          .run(JSON.stringify(newTags), now, f.id);
      }
    }
    totalRetagged += foods.length;
  }

  // 3. Copy over any better metadata from the retired row before deleting
  if (!dryRun) {
    db.query(`
      UPDATE categories SET
        description = CASE WHEN description = '' THEN
          (SELECT description FROM categories WHERE slug = ?)
        ELSE description END,
        updated_at = ?
      WHERE slug = ?
    `).run(retire, new Date().toISOString(), keep);
  }

  // 4. Delete retired slug
  console.log(`  delete '${retire}'`);
  if (!dryRun) {
    db.query(`DELETE FROM categories WHERE slug = ?`).run(retire);
  }
  totalDeleted++;
}

if (!dryRun) db.exec("COMMIT");

console.log(`\n[dedup] ${dryRun ? "DRY RUN \u2014 " : ""}${totalDeleted} merged, ${totalRetargeted} children retargeted, ${totalRetagged} foods retagged`);

if (!dryRun) {
  const counts = db.query(`SELECT kind, COUNT(*) as cnt FROM categories GROUP BY kind`).all() as any[];
  console.log("[dedup] final:", counts.map((c: any) => `${c.kind}=${c.cnt}`).join(", "));
}
