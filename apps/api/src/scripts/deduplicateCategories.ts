/**
 * Merge duplicate category slugs.
 *
 * For each pair, the first slug is the canonical one to keep;
 * the second is retired (tags rewritten, children retargeted, row deleted).
 *
 * Usage:
 *   bun run apps/api/src/scripts/deduplicateCategories.ts [--dry-run]
 *
 * See prompts/deduplicate-categories.md for the full procedure.
 */
import { getDb } from "../db";

const dryRun = process.argv.includes("--dry-run");
const db = getDb();

// ── Define merges: [canonical, retired] ─────────────────────
// Prefer: singular form, more food references, has parent_slug
const MERGES: [keep: string, retire: string][] = [
  ["biscuits",           "biscuit"],          // biscuits has 3 foods + children
  ["snacks",             "snack"],             // snacks has children (salty-snacks etc)
  ["sweet-snacks",       "sweet-snack"],       // sweet-snacks has children
  ["chocolate-biscuits", "chocolate-biscuit"], // same display name
  ["chocolate-cookies",  "chocolate-cookie"],  // same display name
  ["sandwich-cookies",   "sandwich-cookie"],   // same display name
  ["fruits",             "fruit"],             // fruits has food refs
  ["chinese-cuisine",    "chinese-food"],      // chinese-cuisine is more standard
  ["keto",               "keto-friendly"],     // keto is shorter/canonical
  ["processed-grains",   "processed-grain"],   // plural consistent
  ["prepared-food",      "prepared-foods"],    // singular has food refs
];

function parseTags(json: string): string[] {
  try { const v = JSON.parse(json); return Array.isArray(v) ? v : []; }
  catch { return []; }
}

let totalRetargeted = 0;
let totalRetagged = 0;
let totalDeleted = 0;

if (!dryRun) db.exec("BEGIN");

for (const [keep, retire] of MERGES) {
  // Verify both exist
  const keepRow = db.query(`SELECT slug FROM categories WHERE slug = ?`).get(keep) as any;
  const retireRow = db.query(`SELECT slug FROM categories WHERE slug = ?`).get(retire) as any;
  if (!keepRow) { console.log(`  skip: canonical '${keep}' not found`); continue; }
  if (!retireRow) { console.log(`  skip: retired '${retire}' not found`); continue; }

  console.log(`\n${retire} → ${keep}`);

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
    // If canonical has empty description but retired has one, copy it
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

console.log(`\n[dedup] ${dryRun ? "DRY RUN — " : ""}${totalDeleted} merged, ${totalRetargeted} children retargeted, ${totalRetagged} foods retagged`);

if (!dryRun) {
  const counts = db.query(`SELECT kind, COUNT(*) as cnt FROM categories GROUP BY kind`).all() as any[];
  console.log("[dedup] final:", counts.map((c: any) => `${c.kind}=${c.cnt}`).join(", "));
}
