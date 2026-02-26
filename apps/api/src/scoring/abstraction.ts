import { z } from "zod";
import type { NutriCategory, NutritionPer100 } from "./nutriscore";
import type { AdditiveItem } from "./additives";

export const FoodAbstractionSchema = z.object({
  schema_version: z.literal(1),
  zagat_line: z.string().nullable().optional(),
  identification: z.object({
    canonical_name: z.string(),
    brand: z.string().nullable(),
    barcode: z.string().nullable(),
    kind: z.enum(["prepared", "natural", "unknown"]),
    market_country: z.string().nullable(),
    language: z.string().nullable()
  }),
  classification: z.object({
    nutri_score_category: z.enum(["general_food", "beverage", "added_fat", "cheese", "unknown"]),
    is_water: z.boolean(),
    is_reconstituted: z.boolean(),
    prepared_basis: z.enum(["as_sold", "as_prepared", "unknown"]),
    fvp_percent: z.number().min(0).max(100).nullable()
  }),
  nutrition_per_100: z.object({
    unit_basis: z.enum(["per_100g", "per_100ml", "unknown"]),
    energy_kj: z.number().min(0).nullable(),
    energy_kcal: z.number().min(0).nullable().optional(),
    sugars_g: z.number().min(0).nullable(),
    saturated_fat_g: z.number().min(0).nullable(),
    total_fat_g: z.number().min(0).nullable(),
    sodium_mg: z.number().min(0).nullable(),
    salt_g: z.number().min(0).nullable(),
    protein_g: z.number().min(0).nullable(),
    fiber_g: z.number().min(0).nullable()
  }),
  ingredients: z.object({
    ingredients_text: z.string().nullable()
  }),
  additives: z.array(
    z.object({
      code: z.string().nullable(),
      name: z.string().nullable(),
      detection: z.enum(["label", "database", "inferred", "unknown"])
    })
  ),
  flags: z.object({
    contains_partially_hydrogenated_oils: z.enum(["yes", "no", "unknown"]),
    contains_fully_hydrogenated_oils: z.enum(["yes", "no", "unknown"])
  }),
  organic: z.object({
    is_certified_organic: z.enum(["yes", "no", "unknown"]),
    evidence: z.string().nullable()
  }),
  sources: z.array(
    z.object({
      url: z.string(),
      title: z.string().nullable()
    })
  ),
  notes: z.object({
    confidence: z.number().min(0).max(1),
    rationale: z.string().nullable(),
    missing_fields: z.array(z.string())
  }),
  eligibility: z.object({
    scoring_track: z.enum(["standard", "not_rated"]),
    not_rated_reason: z.string().nullable()
  }),
});

export type FoodAbstraction = z.infer<typeof FoodAbstractionSchema>;

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
