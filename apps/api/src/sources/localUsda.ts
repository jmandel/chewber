import { getReferenceDb } from "../db/referenceDb";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LocalUsdaProduct {
  fdc_id: number;
  data_type: string;
  description: string;
  brand_owner: string | null;
  brand_name: string | null;
  gtin_upc: string | null;
  ingredients: string | null;
  food_category: string | null;
  nutriments: Record<string, number> | null;
}

function rowToProduct(row: any): LocalUsdaProduct {
  return {
    fdc_id: row.fdc_id,
    data_type: row.data_type,
    description: row.description ?? "",
    brand_owner: row.brand_owner || null,
    brand_name: row.brand_name || null,
    gtin_upc: row.gtin_upc || null,
    ingredients: row.ingredients || null,
    food_category: row.food_category || null,
    nutriments: row.nutriments_json ? JSON.parse(row.nutriments_json) : null,
  };
}

// ---------------------------------------------------------------------------
// Barcode normalization (shared logic)
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

/**
 * Look up products by barcode (GTIN/UPC) in local USDA dataset.
 * Returns all matches (there can be multiple sizes/variants).
 * Tries zero-padded variants for UPC-A / EAN-13 / GTIN-14 flexibility.
 */
export function localUsdaBarcodeLookup(barcode: string): LocalUsdaProduct[] {
  const db = getReferenceDb();
  const variants = barcodeVariants(barcode);
  if (variants.length === 0) return [];

  const placeholders = variants.map(() => "?").join(", ");
  const rows = db
    .query(
      `SELECT fdc_id, data_type, description, brand_owner, brand_name, gtin_upc,
              ingredients, food_category, nutriments_json
       FROM dataset_usda_products
       WHERE gtin_upc IN (${placeholders})
       ORDER BY fdc_id DESC
       LIMIT 10`
    )
    .all(...variants) as any[];
  return rows.map(rowToProduct);
}

// ---------------------------------------------------------------------------
// FTS text search
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
 * Full-text search across USDA products by description, brand.
 * Multi-strategy: AND → progressive relaxation → brand-boosted → NEAR.
 * Prefers results WITH nutrition data.
 */
export function localUsdaSearchText(
  query: string,
  limit: number = 10
): LocalUsdaProduct[] {
  const db = getReferenceDb();
  const tokens = ftsTokenize(query);
  if (tokens.length === 0) return [];

  // Prefer results with nutrition data (ORDER BY nutriments_json not null)
  const baseSql = `
    SELECT p.fdc_id, p.data_type, p.description, p.brand_owner, p.brand_name,
           p.gtin_upc, p.ingredients, p.food_category, p.nutriments_json
    FROM dataset_usda_products_fts fts
    JOIN dataset_usda_products p ON fts.rowid = p.fdc_id
    WHERE dataset_usda_products_fts MATCH ?
    ORDER BY (CASE WHEN p.nutriments_json IS NOT NULL THEN 0 ELSE 1 END), rank
    LIMIT ?`;

  const run = (matchExpr: string): LocalUsdaProduct[] => {
    try {
      return (db.query(baseSql).all(matchExpr, limit) as any[]).map(rowToProduct);
    } catch {
      return [];
    }
  };

  const andExpr = (toks: string[]) => toks.map((t) => `"${t}"*`).join(" ");

  // Strategy 1: AND (all tokens)
  let results = run(andExpr(tokens));
  if (results.length > 0) return results;

  // Strategy 2: Brand-boosted AND
  if (tokens.length >= 2) {
    const boosted = `{brand_owner brand_name}: "${tokens[0]}"* ${tokens.slice(1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted);
    if (results.length > 0) return results;
    const boosted2 = `{brand_owner brand_name}: "${tokens[tokens.length - 1]}"* ${tokens.slice(0, -1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted2);
    if (results.length > 0) return results;
  }

  // Strategy 3: Progressive relaxation — drop one token at a time (least
  // important first, i.e. from the end) until we get results. This avoids
  // the full OR which matches any single token and returns garbage.
  if (tokens.length > 2) {
    for (let drop = 1; drop < tokens.length - 1; drop++) {
      const subset = tokens.slice(0, tokens.length - drop);
      results = run(andExpr(subset));
      if (results.length > 0) return results;
    }
  }

  // Strategy 4: Pairwise NEAR — try the most-specific consecutive pairs
  if (tokens.length >= 2) {
    const seen = new Set<number>();
    const merged: LocalUsdaProduct[] = [];
    for (let i = tokens.length - 1; i >= 1; i--) {
      const nearExpr = `NEAR("${tokens[i - 1]}"* "${tokens[i]}"*, 3)`;
      for (const p of run(nearExpr)) {
        if (!seen.has(p.fdc_id)) {
          seen.add(p.fdc_id);
          merged.push(p);
          if (merged.length >= limit) return merged;
        }
      }
    }
    if (merged.length > 0) return merged;
  }

  // Strategy 5: OR as last resort
  results = run(tokens.map((t) => `"${t}"*`).join(" OR "));
  return results;
}
