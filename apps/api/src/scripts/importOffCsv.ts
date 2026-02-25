import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { createGunzip } from "node:zlib";
import { getDb } from "../db";

/**
 * Import an Open Food Facts CSV (tab-separated) dump into dataset_off_products.
 *
 * Supports both plain .csv and .csv.gz files (auto-detected by extension).
 *
 * Usage (from apps/api):
 *   bun src/scripts/importOffCsv.ts /path/to/off-products.csv.gz
 *   bun src/scripts/importOffCsv.ts /path/to/off-products.csv
 */

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: bun src/scripts/importOffCsv.ts /path/to/off-products.csv[.gz]");
  process.exit(1);
}

const BATCH_SIZE = 5000;
const PROGRESS_EVERY = 50000;

// Nutrition columns to extract
const NUTRIMENT_COLS = [
  "energy-kj_100g",
  "energy-kcal_100g",
  "sugars_100g",
  "saturated-fat_100g",
  "fat_100g",
  "sodium_100g",
  "salt_100g",
  "proteins_100g",
  "fiber_100g",
] as const;

const db = getDb();

// Speed pragmas
db.exec("PRAGMA synchronous = OFF;");
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA cache_size = -64000;"); // 64MB cache

const insertStmt = db.prepare(
  `INSERT OR IGNORE INTO dataset_off_products
   (barcode, product_name, brands, categories, nutriments_json, ingredients_text, additives_json, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
);

const beginTxn = db.prepare("BEGIN");
const commitTxn = db.prepare("COMMIT");

// Build readable stream: decompress if .gz
let inputStream: NodeJS.ReadableStream;
if (filePath.endsWith(".gz")) {
  const raw = createReadStream(filePath);
  const gunzip = createGunzip();
  inputStream = raw.pipe(gunzip);
} else {
  inputStream = createReadStream(filePath, { encoding: "utf-8" });
}

const rl = createInterface({
  input: inputStream,
  crlfDelay: Infinity,
});

let headerParsed = false;
let colIndex: Record<string, number> = {};
let totalRows = 0;
let insertedRows = 0;
let skippedRows = 0;
let batchCount = 0;
const now = new Date().toISOString();

function getCol(fields: string[], name: string): string {
  const idx = colIndex[name];
  if (idx === undefined || idx >= fields.length) return "";
  return fields[idx] ?? "";
}

function flushMsg() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const rate = totalRows > 0 ? (totalRows / ((Date.now() - startTime) / 1000)).toFixed(0) : "0";
  console.log(
    `[import] ${totalRows} rows read, ${insertedRows} inserted, ${skippedRows} skipped (${elapsed}s, ${rate} rows/s)`
  );
}

const startTime = Date.now();
console.log("[import] Starting CSV import...");
console.log(`[import] File: ${filePath}`);

beginTxn.run();

for await (const line of rl) {
  // Parse header
  if (!headerParsed) {
    const headers = line.split("\t");
    for (let i = 0; i < headers.length; i++) {
      colIndex[headers[i].trim()] = i;
    }
    headerParsed = true;

    // Verify essential columns exist
    if (colIndex["code"] === undefined) {
      console.error(
        "[import] ERROR: 'code' column not found in header. Columns:",
        Object.keys(colIndex).slice(0, 20).join(", ")
      );
      process.exit(1);
    }
    console.log(`[import] Header parsed: ${headers.length} columns`);
    continue;
  }

  totalRows++;

  const fields = line.split("\t");

  const barcode = getCol(fields, "code").trim();
  const productName = getCol(fields, "product_name").trim();

  // Skip rows with no barcode or no product_name
  if (!barcode || !productName) {
    skippedRows++;
    continue;
  }

  const brands = getCol(fields, "brands").trim() || null;
  const categories = getCol(fields, "categories").trim() || null;
  const ingredientsText = getCol(fields, "ingredients_text").trim() || null;

  // Additives: comma-separated → JSON array
  const additivesRaw = getCol(fields, "additives_tags").trim();
  const additivesJson = additivesRaw
    ? JSON.stringify(
        additivesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    : null;

  // Nutriments: gather available values
  const nutriments: Record<string, number> = {};
  for (const col of NUTRIMENT_COLS) {
    const val = getCol(fields, col).trim();
    if (val !== "") {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        nutriments[col] = num;
      }
    }
  }
  const nutrimentsJson =
    Object.keys(nutriments).length > 0 ? JSON.stringify(nutriments) : null;

  try {
    insertStmt.run(
      barcode,
      productName,
      brands,
      categories,
      nutrimentsJson,
      ingredientsText,
      additivesJson,
      now
    );
    insertedRows++;
  } catch {
    skippedRows++;
  }

  batchCount++;
  if (batchCount >= BATCH_SIZE) {
    commitTxn.run();
    beginTxn.run();
    batchCount = 0;
  }

  if (totalRows % PROGRESS_EVERY === 0) {
    flushMsg();
  }
}

// Commit remaining batch
if (batchCount > 0) {
  commitTxn.run();
}

flushMsg();
console.log("[import] Done!");

// Reset pragmas
db.exec("PRAGMA synchronous = NORMAL;");
