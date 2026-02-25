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

/**
 * Look up a product by barcode — instant SQLite lookup.
 */
export function localOffBarcodeLookup(barcode: string): LocalOffProduct | null {
  const db = getDb();
  const row = db
    .query(
      `SELECT barcode, product_name, brands, categories, nutriments_json, ingredients_text, additives_json
       FROM dataset_off_products
       WHERE barcode = ?`
    )
    .get(barcode) as any;
  if (!row) return null;
  return rowToProduct(row);
}

/**
 * Full-text search by product name / brand / category / ingredients.
 * Uses the FTS5 index for fast matching.
 */
export function localOffSearchText(
  query: string,
  limit: number = 20
): LocalOffProduct[] {
  const db = getDb();

  // Sanitize the query for FTS5: remove special chars, wrap tokens with *
  const sanitized = query
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `"${t}"*`)
    .join(" ");

  if (!sanitized) return [];

  const rows = db
    .query(
      `SELECT p.barcode, p.product_name, p.brands, p.categories,
              p.nutriments_json, p.ingredients_text, p.additives_json
       FROM dataset_off_products_fts fts
       JOIN dataset_off_products p ON p.id = fts.rowid
       WHERE dataset_off_products_fts MATCH ?
       ORDER BY rank
       LIMIT ?`
    )
    .all(sanitized, limit) as any[];

  return rows.map(rowToProduct);
}
