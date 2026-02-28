/**
 * Re-exports the schema and provides scoring utilities.
 * The schema itself lives in abstraction.schema.ts (single source of truth
 * for validation, LLM structured output, and LLM prompt documentation).
 */
export { FoodAbstractionSchema, type FoodAbstraction } from "./abstraction.schema";

import type { FoodAbstraction } from "./abstraction.schema";
import type { NutriCategory, NutritionPer100 } from "./nutriscore";
import type { AdditiveItem } from "./additives";

export function toScoreInputs(abs: FoodAbstraction): {
  nutri_category: NutriCategory;
  is_water: boolean;
  fvp_percent: number | null;
  nutrition: NutritionPer100;
  additives: AdditiveItem[];
  contains_partially_hydrogenated_oils: "yes" | "no" | "unknown";
  contains_fully_hydrogenated_oils: "yes" | "no" | "unknown";
  is_certified_organic: "yes" | "no" | "unknown";
  scoring_track: "standard" | "not_rated";
  market_country: string | null;
  is_reconstituted: boolean;
  prepared_basis: "as_sold" | "as_prepared" | "unknown";
} {
  const nutri_category = abs.classification.nutri_score_category as NutriCategory;

  const nutrition: NutritionPer100 = {
    energy_kj: abs.nutrition_per_100.energy_kj
      ?? (abs.nutrition_per_100.energy_kcal != null ? Math.round(abs.nutrition_per_100.energy_kcal * 4.184) : null),
    sugars_g: abs.nutrition_per_100.sugars_g,
    saturated_fat_g: abs.nutrition_per_100.saturated_fat_g,
    total_fat_g: abs.nutrition_per_100.total_fat_g,
    sodium_mg: abs.nutrition_per_100.sodium_mg,
    salt_g: abs.nutrition_per_100.salt_g,
    protein_g: abs.nutrition_per_100.protein_g,
    fiber_g: abs.nutrition_per_100.fiber_g
  };

  return {
    nutri_category,
    is_water: abs.classification.is_water,
    fvp_percent: abs.classification.fvp_percent,
    nutrition,
    additives: abs.additives,
    contains_partially_hydrogenated_oils: abs.flags.contains_partially_hydrogenated_oils,
    contains_fully_hydrogenated_oils: abs.flags.contains_fully_hydrogenated_oils,
    is_certified_organic: abs.organic.is_certified_organic,
    scoring_track: abs.eligibility.scoring_track,
    market_country: abs.identification.market_country,
    is_reconstituted: abs.classification.is_reconstituted,
    prepared_basis: abs.classification.prepared_basis
  };
}
