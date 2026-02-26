import { getDb } from "../db";

export interface LocalOffProduct {
  barcode: string;
  product_name: string | null;
  brands: string | null;
  categories: string | null;
  nutriments: Record<string, number> | null;
  ingredients_text: string | null;
  additives: string[] | null;
}

function rowToProduct(row: any): LocalOffProduct {
  return {
    barcode: row.barcode,
    product_name: row.product_name ?? null,
    brands: row.brands ?? null,
    categories: row.categories ?? null,
    nutriments: row.nutriments_json ? JSON.parse(row.nutriments_json) : null,
    ingredients_text: row.ingredients_text ?? null,
    additives: row.additives_json ? JSON.parse(row.additives_json) : null,
  };
}

// ---------------------------------------------------------------------------
// Barcode normalization
// ---------------------------------------------------------------------------

/**
 * Generate all plausible barcode variants for a given input.
 *
 * Real-world barcodes come in several lengths:
 *   - UPC-A:  12 digits
 *   - EAN-13: 13 digits (most common in Open Food Facts)
 *   - EAN-14 / GTIN-14: 14 digits (sometimes used by LLMs / scanning APIs)
 *
 * The DB may store any of these. We strip leading zeros to get a canonical
 * "core", then generate 12-, 13-, and 14-digit zero-padded variants plus
 * the raw input itself, deduped.
 */
function barcodeVariants(raw: string): string[] {
  // Keep only digits
  const digits = raw.replace(/\D/g, "");
  if (!digits) return [];

  // Core = stripped of all leading zeros (but keep at least 1 char)
  const core = digits.replace(/^0+/, "") || "0";

  const variants = new Set<string>();

  // Always try the raw input as-is
  variants.add(digits);

  // Pad to standard lengths
  if (core.length <= 12) variants.add(core.padStart(12, "0")); // UPC-A
  if (core.length <= 13) variants.add(core.padStart(13, "0")); // EAN-13
  if (core.length <= 14) variants.add(core.padStart(14, "0")); // GTIN-14

  // Also try the bare core (no padding)
  variants.add(core);

  return [...variants];
}

/**
 * Look up a product by barcode — instant SQLite lookup.
 * Tries multiple zero-padded barcode variants to handle UPC-A / EAN-13 / GTIN-14 mismatches.
 */
export function localOffBarcodeLookup(barcode: string): LocalOffProduct | null {
  const db = getDb();
  const variants = barcodeVariants(barcode);
  if (variants.length === 0) return null;

  const placeholders = variants.map(() => "?").join(", ");
  const row = db
    .query(
      `SELECT barcode, product_name, brands, categories, nutriments_json, ingredients_text, additives_json
       FROM dataset_off_products
       WHERE barcode IN (${placeholders})
       LIMIT 1`
    )
    .get(...variants) as any;
  if (!row) return null;
  return rowToProduct(row);
}

// ---------------------------------------------------------------------------
// Text search
// ---------------------------------------------------------------------------

/** Escape FTS5 special characters from a raw token */
function ftsEscapeToken(t: string): string {
  // FTS5 special chars: " * ^ ( ) : + -   OR AND NOT NEAR
  // Safest: keep only word characters and whitespace
  return t.replace(/[^\w]/g, "");
}

/**
 * Full-text search by product name / brand / category / ingredients.
 * Uses the FTS5 index for fast matching.
 *
 * Strategy:
 *  1. Try an AND query with all tokens (prefix-matched via *).
 *  2. If that yields no results, fall back to an OR query so partial
 *     matches (e.g. brand-only) still surface products.
 *  3. If the query contains 2+ words, also try a column-weighted search
 *     boosting brand matches.
 */
export function localOffSearchText(
  query: string,
  limit: number = 20
): LocalOffProduct[] {
  const db = getDb();

  const tokens = query
    .split(/\s+/)
    .map(ftsEscapeToken)
    .filter((t) => t.length > 0);

  if (tokens.length === 0) return [];

  const baseSql = `
    SELECT p.barcode, p.product_name, p.brands, p.categories,
           p.nutriments_json, p.ingredients_text, p.additives_json
    FROM dataset_off_products_fts fts
    JOIN dataset_off_products p ON p.id = fts.rowid
    WHERE dataset_off_products_fts MATCH ?
    ORDER BY rank
    LIMIT ?`;

  // Helper: run a query and return results
  const run = (matchExpr: string): LocalOffProduct[] => {
    try {
      const rows = db.query(baseSql).all(matchExpr, limit) as any[];
      return rows.map(rowToProduct);
    } catch {
      return [];
    }
  };

  // --- Strategy 1: AND query (all tokens, prefix-matched) ---
  // e.g. "Special K cereal" -> '"Special"* "K"* "cereal"*'
  const andExpr = tokens.map((t) => `"${t}"*`).join(" ");
  let results = run(andExpr);
  if (results.length > 0) return results;

  // --- Strategy 2: Column-boosted search (brand + product_name) ---
  // Try matching individual tokens against the brands column specifically
  // FTS5 column filters: {brands}: token
  if (tokens.length >= 2) {
    // Try: first token in brands, rest in any field
    const brandToken = tokens[0];
    const rest = tokens.slice(1);
    const boostedExpr = `{brands}: "${brandToken}"* ${rest.map((t) => `"${t}"*`).join(" ")}`;
    results = run(boostedExpr);
    if (results.length > 0) return results;

    // Try the reverse: last token as brand
    const brandTokenLast = tokens[tokens.length - 1];
    const restFront = tokens.slice(0, -1);
    const boostedExpr2 = `{brands}: "${brandTokenLast}"* ${restFront.map((t) => `"${t}"*`).join(" ")}`;
    results = run(boostedExpr2);
    if (results.length > 0) return results;
  }

  // --- Strategy 3: OR query (any token matches) ---
  const orExpr = tokens.map((t) => `"${t}"*`).join(" OR ");
  results = run(orExpr);
  if (results.length > 0) return results;

  // --- Strategy 4: Individual token search (most lenient) ---
  // Try each token alone, merge results (useful when combined query confuses FTS)
  const seen = new Set<string>();
  const merged: LocalOffProduct[] = [];
  for (const t of tokens) {
    if (merged.length >= limit) break;
    const single = run(`"${t}"*`);
    for (const p of single) {
      if (!seen.has(p.barcode)) {
        seen.add(p.barcode);
        merged.push(p);
        if (merged.length >= limit) break;
      }
    }
  }

  return merged;
}
