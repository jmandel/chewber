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
// Deduplication: merge multiple USDA entries for the same product
// ---------------------------------------------------------------------------

// US nutrition labels legally round: fiber <1g → 0g, fat <0.5g → 0g, etc.
// USDA often has multiple submissions for the same product where older entries
// have rounded-to-zero values and newer entries have precise values.
// We group by (description, brand_owner), keep the newest entry as base,
// and for rounding-susceptible nutrients, prefer non-zero values from the group.
const ROUNDING_SUSCEPTIBLE = ["fiber_g", "saturated_fat_g", "total_fat_g", "protein_g"];

/**
 * Merge a group of USDA entries that represent the same product.
 * Takes the newest entry (highest fdc_id) as base, then fills in
 * rounding-susceptible nutrients and missing fields from older entries.
 */
function mergeGroup(group: LocalUsdaProduct[]): LocalUsdaProduct {
  if (group.length === 1) return group[0];

  // Sort by fdc_id descending (newest first)
  group.sort((a, b) => b.fdc_id - a.fdc_id);
  const best = { ...group[0] };

  // Merge nutriments: for rounding-susceptible fields, prefer non-zero
  if (best.nutriments) {
    best.nutriments = { ...best.nutriments };
    for (const key of ROUNDING_SUSCEPTIBLE) {
      if (best.nutriments[key] === 0 || best.nutriments[key] === undefined) {
        for (const other of group.slice(1)) {
          const val = other.nutriments?.[key];
          if (val != null && val > 0) {
            best.nutriments[key] = val;
            break;
          }
        }
      }
    }
  } else {
    // Base has no nutriments — find one that does
    for (const other of group.slice(1)) {
      if (other.nutriments) {
        best.nutriments = { ...other.nutriments };
        break;
      }
    }
  }

  // Prefer non-null ingredients
  if (!best.ingredients) {
    for (const other of group.slice(1)) {
      if (other.ingredients) {
        best.ingredients = other.ingredients;
        break;
      }
    }
  }

  return best;
}

/**
 * For barcode lookups: all results are the same physical product (same UPC),
 * just submitted at different times. Group by normalized barcode and merge.
 */
function deduplicateProductsByBarcode(products: LocalUsdaProduct[]): LocalUsdaProduct[] {
  if (products.length <= 1) return products;

  const groups = new Map<string, LocalUsdaProduct[]>();
  for (const p of products) {
    const key = (p.gtin_upc || "").replace(/^0+/, "") || p.gtin_upc || "unknown";
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(p);
  }

  const results: LocalUsdaProduct[] = [];
  for (const group of groups.values()) {
    results.push(mergeGroup(group));
  }
  return results;
}

/**
 * For text search: results may be different products, so group by
 * (description, brand_name) to merge duplicate submissions of the same item.
 */
function deduplicateProducts(products: LocalUsdaProduct[]): LocalUsdaProduct[] {
  if (products.length <= 1) return products;

  // Group by normalized (description, brand_key).
  // Brand ownership changes over time (e.g. "RAO'S HOMEMADE" → "Sovos Brands"),
  // so prefer brand_name for grouping (the consumer-facing name stays stable).
  const groups = new Map<string, LocalUsdaProduct[]>();
  for (const p of products) {
    const brandKey = (p.brand_name || p.brand_owner || "").toUpperCase();
    const key = `${(p.description || "").toUpperCase()}||${brandKey}`;
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(p);
  }

  const results: LocalUsdaProduct[] = [];
  for (const group of groups.values()) {
    results.push(mergeGroup(group));
  }
  return results;
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
  // Fetch all rows for this barcode — they’re all the same physical product
  // submitted at different times with potentially varying label data.
  const rows = db
    .query(
      `SELECT fdc_id, data_type, description, brand_owner, brand_name, gtin_upc,
              ingredients, food_category, nutriments_json
       FROM dataset_usda_products
       WHERE gtin_upc IN (${placeholders})
       ORDER BY fdc_id DESC
       LIMIT 50`
    )
    .all(...variants) as any[];

  // For barcode lookups, group by barcode (all results share the same product)
  // rather than description, since USDA descriptions change over time.
  const products = rows.map(rowToProduct);
  return deduplicateProductsByBarcode(products).slice(0, 10);
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
 * Merge runs of consecutive short tokens into a single concatenated token.
 * "Lao Gan Ma Spicy Chili Crisp" → ["LaoGanMa", "Spicy", "Chili", "Crisp"]
 * Only joins runs of 2+ tokens where each is ≤4 chars.
 */
function addConcatenatedVariants(tokens: string[]): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < tokens.length) {
    // Find a run of consecutive short tokens (≤4 chars each)
    if (tokens[i].length <= 4) {
      let j = i + 1;
      while (j < tokens.length && tokens[j].length <= 4) j++;
      if (j - i >= 2) {
        // Concatenate the run into one token
        out.push(tokens.slice(i, j).join(""));
        i = j;
        continue;
      }
    }
    out.push(tokens[i]);
    i++;
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

  // Fetch extra rows so deduplication has enough to merge rounding variants.
  // We ask for 5x the limit, deduplicate, then trim.
  const fetchLimit = limit * 5;

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
      const rows = (db.query(baseSql).all(matchExpr, fetchLimit) as any[]).map(rowToProduct);
      return deduplicateProducts(rows);
    } catch {
      return [];
    }
  };

  const andExpr = (toks: string[]) => toks.map((t) => `"${t}"*`).join(" ");

  // Strategy 1: AND (all tokens)
  let results = run(andExpr(tokens));
  if (results.length > 0) return results.slice(0, limit);

  // Strategy 2: Brand-boosted AND
  if (tokens.length >= 2) {
    const boosted = `{brand_owner brand_name}: "${tokens[0]}"* ${tokens.slice(1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted);
    if (results.length > 0) return results.slice(0, limit);
    const boosted2 = `{brand_owner brand_name}: "${tokens[tokens.length - 1]}"* ${tokens.slice(0, -1).map((t) => `"${t}"*`).join(" ")}`;
    results = run(boosted2);
    if (results.length > 0) return results.slice(0, limit);
  }

  // Strategy 3: Concatenated token variants.
  // Brand names like "Lao Gan Ma" are stored as "LAOGANMA" in USDA.
  // Tried before relaxation (which would discard the brand tokens) but
  // after normal AND/brand-boosted (which handle "Old El Paso" correctly).
  const withConcats = addConcatenatedVariants(tokens);
  if (withConcats.join(" ") !== tokens.join(" ")) {
    results = run(andExpr(withConcats));
    if (results.length > 0) return results.slice(0, limit);
  }

  // Strategy 4: Progressive relaxation — drop one token at a time (least
  // important first, i.e. from the end) until we get results. This avoids
  // the full OR which matches any single token and returns garbage.
  if (tokens.length > 2) {
    for (let drop = 1; drop < tokens.length - 1; drop++) {
      const subset = tokens.slice(0, tokens.length - drop);
      results = run(andExpr(subset));
      if (results.length > 0) return results.slice(0, limit);
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
  return results.slice(0, limit);
}
