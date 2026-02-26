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

/**
 * Tokenize a query the way FTS5's default (unicode61) tokenizer does:
 * split on non-alphanumeric chars (apostrophes, hyphens, etc.) and drop
 * fragments ≤1 char (the leftover "s" from "Joe's", etc.).
 * Also deduplicates tokens (case-insensitive).
 */
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

/**
 * Full-text search by product name / brand / category / ingredients.
 * Uses the FTS5 index for fast matching.
 *
 * Strategy:
 *  1. AND query (all tokens, prefix-matched)
 *  2. Brand-boosted AND
 *  3. Progressive relaxation (drop tokens from end)
 *  4. Pairwise NEAR
 *  5. OR as last resort
 */
export function localOffSearchText(
  query: string,
  limit: number = 20
): LocalOffProduct[] {
  const db = getDb();

  const tokens = ftsTokenize(query);
  if (tokens.length === 0) return [];

  const baseSql = `
    SELECT p.barcode, p.product_name, p.brands, p.categories,
           p.nutriments_json, p.ingredients_text, p.additives_json
    FROM dataset_off_products_fts fts
    JOIN dataset_off_products p ON p.id = fts.rowid
    WHERE dataset_off_products_fts MATCH ?
    ORDER BY rank
    LIMIT ?`;

  const run = (matchExpr: string): LocalOffProduct[] => {
    try {
      const rows = db.query(baseSql).all(matchExpr, limit) as any[];
      return rows.map(rowToProduct);
    } catch {
      return [];
    }
  };

  const andExpr = (toks: string[]) => toks.map((t) => `"${t}"*`).join(" ");

  // --- Strategy 1: AND query (all tokens, prefix-matched) ---
  let results = run(andExpr(tokens));
  if (results.length > 0) return results;

  // --- Strategy 2: Brand-boosted AND ---
  if (tokens.length >= 2) {
    const boosted = `{brands}: "${tokens[0]}"* ${tokens.slice(1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted);
    if (results.length > 0) return results;
    const boosted2 = `{brands}: "${tokens[tokens.length - 1]}"* ${tokens.slice(0, -1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted2);
    if (results.length > 0) return results;
  }

  // --- Strategy 3: Progressive relaxation ---
  if (tokens.length > 2) {
    for (let drop = 1; drop < tokens.length - 1; drop++) {
      const subset = tokens.slice(0, tokens.length - drop);
      results = run(andExpr(subset));
      if (results.length > 0) return results;
    }
  }

  // --- Strategy 4: Pairwise NEAR ---
  if (tokens.length >= 2) {
    const seen = new Set<string>();
    const merged: LocalOffProduct[] = [];
    for (let i = tokens.length - 1; i >= 1; i--) {
      const nearExpr = `NEAR("${tokens[i - 1]}"* "${tokens[i]}"*, 3)`;
      for (const p of run(nearExpr)) {
        if (!seen.has(p.barcode)) {
          seen.add(p.barcode);
          merged.push(p);
          if (merged.length >= limit) return merged;
        }
      }
    }
    if (merged.length > 0) return merged;
  }

  // --- Strategy 5: OR as last resort ---
  results = run(tokens.map((t) => `"${t}"*`).join(" OR "));
  return results;
}
