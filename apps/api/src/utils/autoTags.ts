/**
 * Tags that describe attributes/traits rather than WHAT a food IS.
 * Includes:
 *  - Nutrition-level tags (computed by nutritionTraitTags)
 *  - Broad dietary-lifestyle labels (assigned by LLM but too generic for similarity)
 *  - Processing-level descriptors
 *
 * These should NOT be used for semantic similarity matching because they don't
 * distinguish food types — "plant-based" applies to both cookies and carrots.
 */
export const TRAIT_TAG_SLUGS = new Set([
  // ── Computed nutrition traits ──
  "high-protein", "good-protein", "low-protein",
  "high-fiber", "good-fiber",
  "low-sugar", "high-sugar",
  "low-sat-fat", "high-sat-fat",
  "high-fat", "low-fat",
  "low-sodium", "high-sodium",
  "low-calorie", "calorie-dense",
  "no-additives", "many-additives",
  "contains-trans-fat",
  // ── Broad dietary / lifestyle attributes ──
  "plant-based", "vegan", "vegetarian",
  "gluten-free", "dairy-free", "sugar-free", "grain-free",
  "keto", "keto-friendly", "paleo", "low-carb",
  "organic", "non-gmo",
  // ── Processing descriptors ──
  "ultra-processed", "minimally-processed", "whole-food",
]);

/**
 * Compute objective nutrition-trait tags from abstraction data.
 * These supplement the semantic category tags assigned by the LLM.
 */
function nutritionTraitTags(abs: any): string[] {
  const tags: string[] = [];
  const nutr = abs?.nutrition_per_100;
  if (!nutr) return tags;

  // Protein
  if (nutr.protein_g != null) {
    if (nutr.protein_g >= 20) tags.push("high-protein");
    else if (nutr.protein_g >= 10) tags.push("good-protein");
    if (nutr.protein_g < 2) tags.push("low-protein");
  }

  // Fiber
  if (nutr.fiber_g != null) {
    if (nutr.fiber_g >= 6) tags.push("high-fiber");
    else if (nutr.fiber_g >= 3) tags.push("good-fiber");
  }

  // Sugar
  if (nutr.sugars_g != null) {
    if (nutr.sugars_g <= 1) tags.push("low-sugar");
    else if (nutr.sugars_g >= 22.5) tags.push("high-sugar");
  }

  // Saturated fat
  if (nutr.saturated_fat_g != null) {
    if (nutr.saturated_fat_g <= 0.5) tags.push("low-sat-fat");
    else if (nutr.saturated_fat_g >= 5) tags.push("high-sat-fat");
  }

  // Total fat
  if (nutr.total_fat_g != null) {
    if (nutr.total_fat_g >= 17) tags.push("high-fat");
    else if (nutr.total_fat_g <= 1.5) tags.push("low-fat");
  }

  // Sodium
  if (nutr.sodium_mg != null) {
    if (nutr.sodium_mg <= 40) tags.push("low-sodium");
    else if (nutr.sodium_mg >= 600) tags.push("high-sodium");
  }

  // Calorie density
  const kcal = nutr.energy_kcal ?? (nutr.energy_kj != null ? nutr.energy_kj / 4.184 : null);
  if (kcal != null) {
    if (kcal <= 40) tags.push("low-calorie");
    else if (kcal >= 400) tags.push("calorie-dense");
  }

  // Additives
  const additives = abs?.additives;
  if (additives) {
    if (additives.length === 0) tags.push("no-additives");
    else if (additives.length >= 5) tags.push("many-additives");
  }

  // Trans fat flag
  if (abs?.flags?.contains_partially_hydrogenated_oils === "yes") tags.push("contains-trans-fat");

  return tags;
}

/**
 * Merge LLM-assigned categories with computed nutrition-trait tags.
 * Deduplicates and sorts.
 */
export function generateTags(abs: any): string[] {
  const llmCategories: string[] = Array.isArray(abs?.categories) ? abs.categories : [];
  const traitTags = nutritionTraitTags(abs);
  const merged = new Set<string>();
  for (const t of llmCategories) merged.add(t);
  for (const t of traitTags) merged.add(t);
  return Array.from(merged).sort();
}
