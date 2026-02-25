import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { getDb } from "../db";

/**
 * Import an Open Food Facts JSONL dump into the local SQLite dataset table.
 *
 * Usage (from apps/api):
 *   bun src/scripts/importOpenFoodFactsJsonl.ts /path/to/openfoodfacts-products.jsonl
 *
 * Notes:
 * - OFF dumps can be huge; start with a small subset to test.
 * - This script is intentionally minimal and safe.
 *
 * Optional enhancements:
 * - Add progress output, batching, and resume checkpoints for large dumps.
 * - Store additional fields (images, detailed nutrition, etc.).
 */

const filePath = process.argv[2];
if (!filePath) {
  console.error("Missing path argument: /path/to/products.jsonl");
  process.exit(1);
}

const db = getDb();
db.exec("PRAGMA synchronous = NORMAL;");
db.exec("PRAGMA journal_mode = WAL;");

const insert = db.query(
  `INSERT OR REPLACE INTO dataset_off_products
   (barcode, product_name, brands, categories, nutriments_json, ingredients_text, additives_json, raw_json, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
);

let count = 0;

const rl = createInterface({
  input: createReadStream(filePath, { encoding: "utf-8" }),
  crlfDelay: Infinity
});

console.log("[import] starting...");

for await (const line of rl) {
  if (!line.trim()) continue;
  try {
    const obj = JSON.parse(line);

    const barcode = (obj.code ?? obj._id ?? null)?.toString() ?? null;
    if (!barcode) continue;

    const productName = obj.product_name ?? obj.product_name_en ?? null;
    const brands = obj.brands ?? null;
    const categories = obj.categories ?? null;
    const ingredients = obj.ingredients_text ?? obj.ingredients_text_en ?? null;

    const nutriments = obj.nutriments ?? null;
    const additives = obj.additives_tags ?? obj.additives_original_tags ?? null;

    insert.run(
      barcode,
      productName,
      brands,
      categories,
      nutriments ? JSON.stringify(nutriments) : null,
      ingredients,
      additives ? JSON.stringify(additives) : null,
      JSON.stringify(obj),
      new Date().toISOString()
    );

    count++;
    if (count % 5000 === 0) console.log(`[import] ${count} lines...`);
  } catch {
    // skip bad lines
  }
}

console.log("[import] done:", count);
