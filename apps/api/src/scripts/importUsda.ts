#!/usr/bin/env bun
/**
 * Import USDA FoodData Central CSVs into local SQLite.
 *
 * Usage: bun apps/api/src/scripts/importUsda.ts <path-to-usda-data-dir>
 *
 * Strategy: shell out to grep for pre-filtering the giant nutrient file,
 * use sqlite3 CLI for bulk CSV import where possible, and Bun for the
 * glue/pivot logic. Avoids holding millions of rows in JS memory.
 */

import { Database } from "bun:sqlite";
import { existsSync, readdirSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";


const DATA_DIR = process.argv[2];
if (!DATA_DIR) {
  console.error("Usage: bun importUsda.ts <path-to-usda-data-dir>");
  process.exit(1);
}

const NUTRIENT_IDS = ["1008", "2047", "2000", "1258", "1004", "1093", "1003", "1079"];
const GREP_PATTERN = NUTRIENT_IDS.map(id => `"${id}"`).join("|");

function findSubDir(base: string): string {
  if (!existsSync(base)) return base;
  const sub = readdirSync(base).find(e => e.startsWith("FoodData_Central"));
  return sub ? join(base, sub) : base;
}

function $(cmd: string[]): string {
  const result = Bun.spawnSync(cmd, { stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 0) {
    throw new Error(`Command failed: ${cmd.join(" ")}\n${result.stderr.toString()}`);
  }
  return result.stdout.toString();
}

async function sh(cmd: string): Promise<string> {
  const proc = Bun.spawn(["bash", "-c", cmd], { stdout: "pipe", stderr: "pipe" });
  const out = await new Response(proc.stdout).text();
  const err = await new Response(proc.stderr).text();
  const code = await proc.exited;
  if (code !== 0) throw new Error(`Shell failed: ${cmd}\n${err}`);
  return out;
}

async function main() {
  const dbPath = process.env.CHEWBER_REF_DB_PATH ??
    resolve(import.meta.dir, "../../../../data/usda.sqlite");
  console.log(`Database: ${dbPath}`);
  console.log(`Data dir: ${DATA_DIR}\n`);

  const db = new Database(dbPath);
  db.exec("PRAGMA journal_mode=WAL");
  db.exec("PRAGMA synchronous=OFF");
  db.exec("PRAGMA cache_size=-200000");

  // ── Clean slate ──────────────────────────────────────────────
  db.exec(`DROP TABLE IF EXISTS dataset_usda_products_fts`);
  db.exec(`DROP TABLE IF EXISTS dataset_usda_products`);
  db.exec(`DROP TABLE IF EXISTS _usda_nut_raw`);
  db.exec(`DROP TABLE IF EXISTS _usda_nut_json`);
  db.exec(`DROP TABLE IF EXISTS _usda_branded`);

  // ── Phase 1: Pre-filter + import nutrient rows ──────────────
  // grep is 100x faster than JS streaming for a 1.4GB file
  console.log("Phase 1: Filtering & importing nutrient rows...");

  db.exec(`
    CREATE TABLE _usda_nut_raw (
      id INTEGER, fdc_id INTEGER, nutrient_id TEXT, amount REAL,
      dp TEXT, deriv TEXT, mn TEXT, mx TEXT, med TEXT, fn TEXT, mya TEXT
    );
  `);

  const tmpNut = "/tmp/usda_nutrients_filtered.csv";
  const datasets = ["branded", "sr_legacy", "foundation"];

  for (const ds of datasets) {
    const dir = findSubDir(join(DATA_DIR, ds));
    const path = join(dir, "food_nutrient.csv");
    if (!existsSync(path)) { console.log(`  Skip ${ds} (no file)`); continue; }

    console.time(`  ${ds} nutrients`);
    // grep pre-filter, then sqlite3 .import
    await sh(`grep -E '${GREP_PATTERN}' "${path}" > "${tmpNut}"`);
    const lines = (await sh(`wc -l < "${tmpNut}"`)).trim();
    console.log(`  ${ds}: ${lines} nutrient rows after filtering`);

    await sh(`sqlite3 "${dbPath}" <<'EOF'
.mode csv
.import ${tmpNut} _usda_nut_raw
EOF`);
    console.timeEnd(`  ${ds} nutrients`);
  }
  try { unlinkSync(tmpNut); } catch {}

  const nutCount = (db.query(`SELECT count(*) as c FROM _usda_nut_raw`).get() as any).c;
  console.log(`  Total nutrient rows: ${nutCount}`);

  // ── Phase 1b: Pivot to JSON ─────────────────────────────────
  console.log("\nPivoting nutrients to JSON...");
  console.time("  pivot");
  db.exec(`CREATE INDEX _idx_nut_fdc ON _usda_nut_raw(fdc_id)`);
  db.exec(`
    CREATE TABLE _usda_nut_json AS
    SELECT fdc_id,
      '{' || GROUP_CONCAT('"' || field || '":' || val) || '}' AS nutriments_json
    FROM (
      SELECT fdc_id,
        CASE WHEN nutrient_id IN ('1008','2047') THEN 'energy_kcal'
             WHEN nutrient_id = '2000' THEN 'sugars_g'
             WHEN nutrient_id = '1258' THEN 'saturated_fat_g'
             WHEN nutrient_id = '1004' THEN 'total_fat_g'
             WHEN nutrient_id = '1093' THEN 'sodium_mg'
             WHEN nutrient_id = '1003' THEN 'protein_g'
             WHEN nutrient_id = '1079' THEN 'fiber_g'
        END AS field,
        MAX(amount) AS val
      FROM _usda_nut_raw
      GROUP BY fdc_id, field
    )
    WHERE field IS NOT NULL
    GROUP BY fdc_id;
  `);
  db.exec(`CREATE UNIQUE INDEX _idx_nj ON _usda_nut_json(fdc_id)`);
  console.timeEnd("  pivot");
  const njCount = (db.query(`SELECT count(*) as c FROM _usda_nut_json`).get() as any).c;
  console.log(`  ${njCount} foods with nutrient JSON`);

  // ── Phase 2: Import branded_food metadata ───────────────────
  console.log("\nPhase 2: Importing branded food metadata...");
  db.exec(`
    CREATE TABLE _usda_branded (
      fdc_id INTEGER PRIMARY KEY,
      brand_owner TEXT, brand_name TEXT, sub TEXT, gtin_upc TEXT,
      ingredients TEXT, nsso TEXT, ss TEXT, ssu TEXT, hsf TEXT,
      food_category TEXT, datasrc TEXT, pw TEXT, md TEXT, ad TEXT,
      mc TEXT, dd TEXT, psc TEXT, tc TEXT, sd TEXT, matc TEXT
    );
  `);

  const brandedDir = findSubDir(join(DATA_DIR, "branded"));
  const brandedPath = join(brandedDir, "branded_food.csv");
  if (existsSync(brandedPath)) {
    console.time("  branded import");
    await sh(`sqlite3 "${dbPath}" <<'EOF'
.mode csv
.import ${brandedPath} _usda_branded
EOF`);
    console.timeEnd("  branded import");
    // The .import includes the header row — delete it
    db.exec(`DELETE FROM _usda_branded WHERE fdc_id = 0 OR typeof(fdc_id) = 'text'`);
    const bCount = (db.query(`SELECT count(*) as c FROM _usda_branded`).get() as any).c;
    console.log(`  ${bCount} branded rows`);
  }

  // ── Phase 3: Build final products table ─────────────────────
  console.log("\nPhase 3: Building products table...");
  db.exec(`
    CREATE TABLE dataset_usda_products (
      fdc_id INTEGER PRIMARY KEY,
      data_type TEXT NOT NULL,
      description TEXT NOT NULL,
      brand_owner TEXT,
      brand_name TEXT,
      gtin_upc TEXT,
      ingredients TEXT,
      food_category TEXT,
      nutriments_json TEXT
    );
  `);

  for (const ds of datasets) {
    const dir = findSubDir(join(DATA_DIR, ds));
    const foodPath = join(dir, "food.csv");
    if (!existsSync(foodPath)) { console.log(`  Skip ${ds}`); continue; }

    console.time(`  ${ds} foods`);

    // Import food.csv into a temp table
    db.exec(`DROP TABLE IF EXISTS _usda_food_tmp`);
    if (ds === "branded") {
      // branded food.csv has 8 columns
      db.exec(`CREATE TABLE _usda_food_tmp (
        fdc_id INTEGER, data_type TEXT, description TEXT,
        food_category_id TEXT, publication_date TEXT,
        market_country TEXT, trade_channel TEXT, microbe_data TEXT
      )`);
    } else {
      // sr_legacy/foundation have 5 columns
      db.exec(`CREATE TABLE _usda_food_tmp (
        fdc_id INTEGER, data_type TEXT, description TEXT,
        food_category_id TEXT, publication_date TEXT
      )`);
    }
    await sh(`sqlite3 "${dbPath}" <<'EOF'
.mode csv
.import ${foodPath} _usda_food_tmp
EOF`);
    // Delete header row
    db.exec(`DELETE FROM _usda_food_tmp WHERE typeof(fdc_id) = 'text' OR fdc_id = 0`);

    // Insert-select with joins
    db.exec(`
      INSERT OR REPLACE INTO dataset_usda_products
        (fdc_id, data_type, description, brand_owner, brand_name, gtin_upc, ingredients, food_category, nutriments_json)
      SELECT
        f.fdc_id,
        f.data_type,
        f.description,
        b.brand_owner,
        b.brand_name,
        b.gtin_upc,
        b.ingredients,
        COALESCE(b.food_category, f.food_category_id),
        n.nutriments_json
      FROM _usda_food_tmp f
      LEFT JOIN _usda_branded b ON b.fdc_id = f.fdc_id
      LEFT JOIN _usda_nut_json n ON n.fdc_id = f.fdc_id;
    `);
    db.exec(`DROP TABLE _usda_food_tmp`);
    console.timeEnd(`  ${ds} foods`);
  }

  // ── Phase 4: Indexes ────────────────────────────────────────
  console.log("\nPhase 4: Building indexes...");
  console.time("  gtin index");
  db.exec(`CREATE INDEX idx_usda_gtin ON dataset_usda_products(gtin_upc) WHERE gtin_upc IS NOT NULL AND gtin_upc != ''`);
  console.timeEnd("  gtin index");

  console.time("  FTS index");
  db.exec(`
    CREATE VIRTUAL TABLE dataset_usda_products_fts USING fts5(
      description, brand_owner, brand_name,
      content=dataset_usda_products,
      content_rowid=fdc_id
    );
    INSERT INTO dataset_usda_products_fts(rowid, description, brand_owner, brand_name)
    SELECT fdc_id, description, COALESCE(brand_owner, ''), COALESCE(brand_name, '')
    FROM dataset_usda_products;
  `);
  console.timeEnd("  FTS index");

  // ── Cleanup ─────────────────────────────────────────────────
  db.exec(`DROP TABLE IF EXISTS _usda_nut_raw`);
  db.exec(`DROP TABLE IF EXISTS _usda_nut_json`);
  db.exec(`DROP TABLE IF EXISTS _usda_branded`);

  // ── Stats ───────────────────────────────────────────────────
  const stats = db.query(`
    SELECT
      count(*) as total,
      sum(nutriments_json IS NOT NULL) as with_nutrition,
      sum(gtin_upc IS NOT NULL AND gtin_upc != '') as with_upc,
      sum(ingredients IS NOT NULL AND ingredients != '') as with_ingredients
    FROM dataset_usda_products
  `).get() as any;

  console.log(`\n✅ Done!`);
  console.log(`  Total:          ${stats.total}`);
  console.log(`  With nutrition:  ${stats.with_nutrition}`);
  console.log(`  With UPC:        ${stats.with_upc}`);
  console.log(`  With ingredients: ${stats.with_ingredients}`);

  db.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
