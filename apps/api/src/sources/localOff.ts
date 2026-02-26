import { DuckDBInstance, DuckDBConnection } from "@duckdb/node-api";
import path from "node:path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocalOffProduct {
  barcode: string;
  product_name: string | null;
  brands: string | null;
  categories: string | null;
  nutriments: Record<string, number> | null;
  ingredients_text: string | null;
  additives: string[] | null;
}

// ---------------------------------------------------------------------------
// DuckDB connection (singleton, lazy-init)
// ---------------------------------------------------------------------------

const PARQUET_PATH =
  process.env.OFF_PARQUET_PATH ??
  path.resolve(import.meta.dir, "../../../../data/off-food.parquet");

let _instance: DuckDBInstance | null = null;
let _conn: DuckDBConnection | null = null;
let _initPromise: Promise<DuckDBConnection> | null = null;

async function getConn(): Promise<DuckDBConnection> {
  if (_conn) return _conn;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    _instance = await DuckDBInstance.create();
    _conn = await _instance.connect();
    await _conn.run("SET memory_limit='256MB'");
    await _conn.run("SET threads=2");
    // Warm parquet metadata
    await _conn.runAndReadAll(
      `SELECT 1 FROM '${PARQUET_PATH}' LIMIT 1`
    );
    return _conn;
  })();
  return _initPromise;
}

// ---------------------------------------------------------------------------
// Row conversion
// ---------------------------------------------------------------------------

function rowToProduct(row: any): LocalOffProduct {
  return {
    barcode: row.barcode ?? "",
    product_name: row.product_name ?? null,
    brands: row.brands ?? null,
    categories: row.categories ?? null,
    nutriments: row.nutriments_json ? JSON.parse(row.nutriments_json) : null,
    ingredients_text: row.ingredients_text ?? null,
    additives: row.additives ? row.additives.split(",").filter(Boolean) : null,
  };
}

// ---------------------------------------------------------------------------
// Shared SQL fragments
// ---------------------------------------------------------------------------

const SELECT_PRODUCT = `
  code AS barcode,
  product_name[1]."text" AS product_name,
  brands,
  categories,
  CASE WHEN len(ingredients_text) > 0 THEN ingredients_text[1]."text" ELSE NULL END AS ingredients_text,
  CASE WHEN len(additives_tags) > 0 THEN array_to_string(additives_tags, ',') ELSE NULL END AS additives,
  CASE WHEN len(nutriments) > 0
    THEN '{' || array_to_string(
      [concat('"', n.name, '_100g":', CAST(n."100g" AS VARCHAR))
       FOR n IN nutriments IF n."100g" IS NOT NULL], ','
    ) || '}'
    ELSE NULL
  END AS nutriments_json
`;

// ---------------------------------------------------------------------------
// Barcode normalization
// ---------------------------------------------------------------------------

function barcodeVariants(raw: string): string[] {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return [];
  const core = digits.replace(/^0+/, "") || "0";
  const variants = new Set<string>();
  variants.add(digits);
  if (core.length <= 12) variants.add(core.padStart(12, "0"));
  if (core.length <= 13) variants.add(core.padStart(13, "0"));
  if (core.length <= 14) variants.add(core.padStart(14, "0"));
  variants.add(core);
  return [...variants];
}

// ---------------------------------------------------------------------------
// Barcode lookup
// ---------------------------------------------------------------------------

export async function localOffBarcodeLookup(
  barcode: string
): Promise<LocalOffProduct | null> {
  const conn = await getConn();
  const variants = barcodeVariants(barcode);
  if (variants.length === 0) return null;

  const inList = variants.map((v) => `'${v}'`).join(",");
  const result = await conn.runAndReadAll(`
    SELECT ${SELECT_PRODUCT}
    FROM '${PARQUET_PATH}'
    WHERE code IN (${inList})
    LIMIT 1
  `);

  const rows = result.getRowObjects();
  if (rows.length === 0) return null;
  return rowToProduct(rows[0]);
}

// ---------------------------------------------------------------------------
// Text search
// ---------------------------------------------------------------------------

/**
 * Text search across OFF products using DuckDB's contains().
 * The parquet is sorted by code, so column scans are efficient.
 * Strategy: try progressively looser matching.
 */
export async function localOffSearchText(
  query: string,
  limit: number = 20
): Promise<LocalOffProduct[]> {
  const conn = await getConn();
  const tokens = query
    .split(/[^\w]+/)
    .filter((t) => t.length > 1)
    .map((t) => t.toLowerCase());
  if (tokens.length === 0) return [];

  const run = async (whereClause: string): Promise<LocalOffProduct[]> => {
    try {
      const r = await conn.runAndReadAll(`
        SELECT ${SELECT_PRODUCT}
        FROM '${PARQUET_PATH}'
        WHERE ${whereClause}
        LIMIT ${limit}
      `);
      return r.getRowObjects().map(rowToProduct);
    } catch {
      return [];
    }
  };

  // Build a contains() expression for a set of tokens against combined fields
  const allContains = (toks: string[]) =>
    toks
      .map(
        (t) =>
          `(contains(lower(coalesce(product_name[1]."text",'')), '${t}') OR contains(lower(coalesce(brands,'')), '${t}'))`
      )
      .join(" AND ");

  // Strategy 1: AND all tokens
  let results = await run(allContains(tokens));
  if (results.length > 0) return results;

  // Strategy 2: Progressive relaxation — drop tokens from end
  if (tokens.length > 2) {
    for (let drop = 1; drop < tokens.length - 1; drop++) {
      results = await run(allContains(tokens.slice(0, tokens.length - drop)));
      if (results.length > 0) return results;
    }
  }

  // Strategy 3: OR any token (in product_name only to avoid noise)
  const orContains = tokens
    .map((t) => `contains(lower(coalesce(product_name[1]."text",'')), '${t}')`)
    .join(" OR ");
  results = await run(orContains);
  return results;
}
