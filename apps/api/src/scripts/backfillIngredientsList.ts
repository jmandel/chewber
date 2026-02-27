/**
 * Backfill ingredients_list from ingredients_text for existing abstractions.
 * Splits on top-level commas only (respects parentheses/brackets nesting).
 *
 * Usage:
 *   bun run apps/api/src/scripts/backfillIngredientsList.ts
 *   bun run apps/api/src/scripts/backfillIngredientsList.ts --dry-run
 */
import { Database } from "bun:sqlite";
import { resolve } from "node:path";

const API_DIR = resolve(import.meta.dir, "..", "..");

// Load .env
const envPath = resolve(API_DIR, ".env");
const { existsSync, readFileSync } = await import("node:fs");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

const dbPath = resolve(API_DIR, process.env.CHEWBER_DB_PATH ?? "../../data/chewber.sqlite");
const dryRun = process.argv.includes("--dry-run");

function splitTopLevelCommas(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let depth = 0;
  for (const ch of text) {
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function toTitleCase(s: string): string {
  // Remove trailing period
  s = s.replace(/\.$/, "").trim();
  if (!s) return s;
  // If it's ALL CAPS, convert to title case
  if (s === s.toUpperCase() && s.length > 2) {
    return s.replace(/\b(\w)(\w*)/g, (_, first, rest) => {
      // Preserve parenthetical content casing too
      return first.toUpperCase() + rest.toLowerCase();
    });
  }
  // Already mixed case — just capitalize first letter
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const db = new Database(dbPath);
const rows = db.query(
  `SELECT id, abstraction_json FROM food_abstractions WHERE status = 'active'`
).all() as { id: string; abstraction_json: string }[];

console.log(`Found ${rows.length} active abstractions${dryRun ? " (dry run)" : ""}`);

const update = db.prepare(
  `UPDATE food_abstractions SET abstraction_json = ? WHERE id = ?`
);

let updated = 0;
let skipped = 0;

for (const row of rows) {
  const abs = JSON.parse(row.abstraction_json);
  const text = abs.ingredients?.ingredients_text;
  const existing = abs.ingredients?.ingredients_list;

  if (existing?.length > 0) {
    skipped++;
    continue;
  }

  if (!text) {
    skipped++;
    continue;
  }

  const list = splitTopLevelCommas(text).map(toTitleCase).filter(Boolean);
  if (list.length === 0) {
    skipped++;
    continue;
  }

  abs.ingredients.ingredients_list = list;
  updated++;

  const name = abs.identification?.canonical_name ?? row.id;
  console.log(`  ${name}: ${list.length} ingredients`);

  if (!dryRun) {
    update.run(JSON.stringify(abs), row.id);
  }
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped${dryRun ? " (dry run)" : ""}.`);
