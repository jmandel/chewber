import { DuckDBInstance, DuckDBConnection } from "@duckdb/node-api";
import { Database } from "bun:sqlite";
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
  labels: string[] | null;
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(import.meta.dir, "../../../../data");

const PARQUET_PATH =
  process.env.OFF_PARQUET_PATH ?? path.join(DATA_DIR, "off-food.parquet");

const INDEX_PATH =
  process.env.OFF_INDEX_PATH ?? path.join(DATA_DIR, "off-index.sqlite");

// ---------------------------------------------------------------------------
// SQLite index (singleton)
// ---------------------------------------------------------------------------

let _indexDb: Database | null = null;

function getIndex(): Database {
  if (_indexDb) return _indexDb;
  _indexDb = new Database(INDEX_PATH, { readonly: true });
  _indexDb.exec("PRAGMA mmap_size = 268435456;"); // 256 MB mmap
  return _indexDb;
}

// ---------------------------------------------------------------------------
// DuckDB connection for full-record fetches (singleton, lazy-init)
// ---------------------------------------------------------------------------

let _instance: DuckDBInstance | null = null;
let _conn: DuckDBConnection | null = null;
let _initPromise: Promise<DuckDBConnection> | null = null;
let _hasLabelsColumn = false;

async function getConn(): Promise<DuckDBConnection> {
  if (_conn) return _conn;
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    _instance = await DuckDBInstance.create();
    _conn = await _instance.connect();
    await _conn.run("SET memory_limit='256MB'");
    await _conn.run("SET threads=2");
    // Warm parquet metadata and detect available columns
    await _conn.runAndReadAll(
      `SELECT 1 FROM '${PARQUET_PATH}' LIMIT 1`
    );
    try {
      await _conn.runAndReadAll(`SELECT labels_tags FROM '${PARQUET_PATH}' LIMIT 1`);
      _hasLabelsColumn = true;
    } catch {
      _hasLabelsColumn = false; // Parquet was built without labels_tags; rebuild to enable
    }
    return _conn;
  })();
  return _initPromise;
}

// ---------------------------------------------------------------------------
// DuckDB full-record fetch
// ---------------------------------------------------------------------------

function buildSelectProduct(): string {
  const labelsExpr = _hasLabelsColumn
    ? `CASE WHEN len(labels_tags) > 0 THEN array_to_string(labels_tags, ',') ELSE NULL END`
    : `NULL`;
  return `
    code AS barcode,
    product_name[1]."text" AS product_name,
    brands,
    categories,
    CASE WHEN len(ingredients_text) > 0 THEN ingredients_text[1]."text" ELSE NULL END AS ingredients_text,
    CASE WHEN len(additives_tags) > 0 THEN array_to_string(additives_tags, ',') ELSE NULL END AS additives,
    ${labelsExpr} AS labels,
    CASE WHEN len(nutriments) > 0
      THEN '{' || array_to_string(
        [concat('"', n.name, '_100g":', CAST(n."100g" AS VARCHAR))
         FOR n IN nutriments IF n."100g" IS NOT NULL], ','
      ) || '}'
      ELSE NULL
    END AS nutriments_json
  `;
}

function rowToProduct(row: any): LocalOffProduct {
  return {
    barcode: row.barcode ?? "",
    product_name: row.product_name ?? null,
    brands: row.brands ?? null,
    categories: row.categories ?? null,
    nutriments: row.nutriments_json ? JSON.parse(row.nutriments_json) : null,
    ingredients_text: row.ingredients_text ?? null,
    additives: row.additives ? row.additives.split(",").filter(Boolean) : null,
    labels: row.labels ? row.labels.split(",").filter(Boolean) : null,
  };
}

/** Fetch full product record from parquet by barcode. */
async function fetchFullRecord(code: string): Promise<LocalOffProduct | null> {
  const conn = await getConn();
  const result = await conn.runAndReadAll(`
    SELECT ${buildSelectProduct()}
    FROM '${PARQUET_PATH}'
    WHERE code = '${code.replace(/'/g, "''")}'
    LIMIT 1
  `);
  const rows = result.getRowObjects();
  return rows.length > 0 ? rowToProduct(rows[0]) : null;
}

/** Fetch full product records from parquet for multiple barcodes. */
async function fetchFullRecords(codes: string[]): Promise<LocalOffProduct[]> {
  if (codes.length === 0) return [];
  const conn = await getConn();
  const inList = codes.map((c) => `'${c.replace(/'/g, "''")}'`).join(",");
  const result = await conn.runAndReadAll(`
    SELECT ${buildSelectProduct()}
    FROM '${PARQUET_PATH}'
    WHERE code IN (${inList})
  `);
  return result.getRowObjects().map(rowToProduct);
}

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
// FTS tokenization (matches FTS5 unicode61 behavior)
// ---------------------------------------------------------------------------

function ftsTokenize(query: string): string[] {
  const raw = query.split(/[^\w]+/).filter((t) => t.length > 1);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of raw) {
    const low = t.toLowerCase();
    if (!seen.has(low)) {
      seen.add(low);
      out.push(t);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Barcode lookup  (SQLite index → DuckDB full record)
// ---------------------------------------------------------------------------

export async function localOffBarcodeLookup(
  barcode: string
): Promise<LocalOffProduct | null> {
  const variants = barcodeVariants(barcode);
  if (variants.length === 0) return null;

  const db = getIndex();
  const placeholders = variants.map(() => "?").join(",");
  const hit = db
    .query(`SELECT code FROM off_products WHERE code IN (${placeholders}) LIMIT 1`)
    .get(...variants) as { code: string } | null;

  if (!hit) return null;
  return fetchFullRecord(hit.code);
}

// ---------------------------------------------------------------------------
// Text search  (SQLite FTS5 → DuckDB full records)
// ---------------------------------------------------------------------------

export async function localOffSearchText(
  query: string,
  limit: number = 20
): Promise<LocalOffProduct[]> {
  const tokens = ftsTokenize(query);
  if (tokens.length === 0) return [];

  const db = getIndex();

  // Strategy 1: AND all tokens
  const andExpr = tokens.join(" ");
  let codes = searchFts(db, andExpr, limit);

  // Strategy 2: Progressive relaxation — drop tokens from end
  if (codes.length === 0 && tokens.length > 2) {
    for (let drop = 1; drop < tokens.length - 1; drop++) {
      codes = searchFts(db, tokens.slice(0, tokens.length - drop).join(" "), limit);
      if (codes.length > 0) break;
    }
  }

  // Strategy 3: OR any token
  if (codes.length === 0) {
    const orExpr = tokens.join(" OR ");
    codes = searchFts(db, orExpr, limit);
  }

  return fetchFullRecords(codes);
}

function searchFts(db: Database, matchExpr: string, limit: number): string[] {
  try {
    const rows = db
      .query(
        `SELECT p.code FROM off_fts f
         JOIN off_products p ON p.id = f.rowid
         WHERE off_fts MATCH ?
         ORDER BY rank
         LIMIT ?`
      )
      .all(matchExpr, limit) as { code: string }[];
    return rows.map((r) => r.code);
  } catch {
    return [];
  }
}
