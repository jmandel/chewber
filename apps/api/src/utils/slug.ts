/**
 * Generate a URL-friendly slug from food name + brand + food ID.
 *
 * Examples:
 *   "Cheerios", "General Mills", "food_722886bf-..." → "cheerios-general-mills-722886bf"
 *   "Avocado, raw", "Generic / Various", "food_0796a2db-..." → "avocado-raw-0796a2db"
 *   "Banana", null, "food_2993f4d8-..." → "banana-2993f4d8"
 */

const GENERIC_BRANDS = new Set([
  "generic", "various", "unbranded", "generic / various",
  "generic / unbranded", "store brand", "n/a", "none", ""
]);

const GENERIC_PATTERNS = /^(generic|various|unbranded|store brand|n\/a|none)\b/i;

const MAX_SLUG_BODY = 110;

export function makeSlug(name: string, brand: string | null, foodId: string, isOrganic?: string | null): string {
  // Extract 8-char hex segment from food ID (first UUID segment after prefix)
  const idSuffix = foodId.replace(/^food_/, "").replace(/-/g, "").slice(0, 8);

  // Decide whether to include brand
  const brandClean = (brand ?? "").trim();
  const brandLower = brandClean.toLowerCase();
  const includeBrand = brandClean && !GENERIC_BRANDS.has(brandLower) && !GENERIC_PATTERNS.test(brandClean);

  // For brand, only take the primary name (before parenthetical)
  const brandShort = includeBrand ? brandClean.replace(/\s*\(.*\)\s*$/, "").trim() : "";

  // Build slug body: name + brand + organic suffix
  let body = name;
  if (brandShort) {
    body = `${body} ${brandShort}`;
  }
  if (isOrganic === "yes") {
    body = `${body} organic`;
  }

  // Kebab-case transform
  let slug = body
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // strip accents
    .replace(/['']/g, "")                                // remove apostrophes
    .replace(/[^a-z0-9]+/g, "-")                         // non-alphanum → dash
    .replace(/^-+|-+$/g, "");                             // trim leading/trailing dashes

  // Truncate to max length (at word boundary)
  if (slug.length > MAX_SLUG_BODY) {
    slug = slug.slice(0, MAX_SLUG_BODY);
    const lastDash = slug.lastIndexOf("-");
    if (lastDash > MAX_SLUG_BODY * 0.5) {
      slug = slug.slice(0, lastDash);
    }
    slug = slug.replace(/-+$/, "");
  }

  return `${slug}-${idSuffix}`;
}
