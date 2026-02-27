import { computeNutriScore, type NutriCategory, type NutriScoreBreakdown, type NutritionPer100 } from "./nutriscore";
import { scoreAdditives, type AdditiveItem, type AdditiveScoreBreakdown } from "./additives";

export type ChewberScoreBreakdown = {
  nutrition: {
    algo_version: "original";
    missing_required_fields: string[];
    nutri_score: NutriScoreBreakdown | null;
    nutrition_score: number | null; // 0..100
    weighted_points: number; // 0..60 (0 if missing)
  };
  additives: AdditiveScoreBreakdown & {
    weighted_points: number; // 0..30
  };
  organic: {
    is_certified_organic: "yes" | "no" | "unknown";
    points: number; // 0 or 10
  };
  caps: {
    high_risk_additive_cap_applied: boolean;
    max_score_if_applied: number; // 49
  };
  total_before_caps: number | null;
  total_final: number | null;
  warnings?: string[];
};

/**
 * Map Nutri-Score points → nutrition score (0–100).
 * Smooth linear formulas (no lookup tables) so a 1-point Nutri-Score error
 * never causes more than a 4–6 point swing in the mapped score.
 *
 * Solid foods:  score = clamp(0, 100, round(80 − 4 × NS))
 *   NS ≤ -5 → 100,  NS 0 → 80,  NS 10 → 40,  NS 20 → 0
 *   Max adjacent Δ = 4  (after ×0.6 weight = 2.4 Chewber points per NS point)
 *
 * Beverages:    score = clamp(0, 80, round(60 − 6 × NS))
 *   NS ≤ -4 → 80 (cap; drinks inherently score lower),
 *   NS 0 → 60,  NS 6 → 24,  NS 10 → 0
 *   Max adjacent Δ = 6  (after ×0.6 weight = 3.6 Chewber points per NS point)
 */
function nutritionScoreFromNutriScore(points: number, isBeverage: boolean): number {
  if (isBeverage) {
    // Beverages: linear, capped at 80 (drinks inherently score lower)
    // NS=-4→80, NS=0→60, NS=6→24, NS=10→0
    return Math.max(0, Math.min(80, Math.round(60 - 6 * points)));
  }
  // Solid foods: linear, smooth (max 4-point step between adjacent NS values)
  // NS=-5→100, NS=0→80, NS=10→40, NS=20→0
  return Math.max(0, Math.min(100, Math.round(80 - 4 * points)));
}

/** Round half-up: 0.5 rounds away from zero. */
function roundHalfUp(v: number): number {
  return Math.floor(v + 0.5);
}

function requiredNutritionMissing(opts: {
  nutri_category: NutriCategory;
  nutrition: NutritionPer100;
}): string[] {
  const missing: string[] = [];
  if (opts.nutri_category === "unknown") missing.push("classification.nutri_score_category");

  const n = opts.nutrition;

  if (n.energy_kj == null) missing.push("nutrition.energy_kj");
  if (n.sugars_g == null) missing.push("nutrition.sugars_g");
  if (opts.nutri_category === "added_fat") {
    if (n.saturated_fat_g == null) missing.push("nutrition.saturated_fat_g");
    if (n.total_fat_g == null) missing.push("nutrition.total_fat_g");
  } else {
    if (n.saturated_fat_g == null) missing.push("nutrition.saturated_fat_g");
  }

  const hasSodium = n.sodium_mg != null || n.salt_g != null;
  if (!hasSodium) missing.push("nutrition.sodium_mg_or_salt_g");

  return missing;
}

export function scoreFood(opts: {
  nutri_category: NutriCategory;
  is_water: boolean;
  fvp_percent: number | null;
  nutrition: NutritionPer100;
  additives: AdditiveItem[];
  contains_partially_hydrogenated_oils: "yes" | "no" | "unknown";
  contains_fully_hydrogenated_oils: "yes" | "no" | "unknown";
  is_certified_organic: "yes" | "no" | "unknown";
  scoring_track?: "standard" | "not_rated";
  market_country?: string | null;
  is_reconstituted?: boolean;
  prepared_basis?: "as_sold" | "as_prepared" | "unknown";
}): { score: number | null; breakdown: ChewberScoreBreakdown } {
  // Early return for not-rated products
  if (opts.scoring_track === "not_rated") {
    const emptyBreakdown: ChewberScoreBreakdown = {
      nutrition: {
        algo_version: "original" as const,
        missing_required_fields: [],
        nutri_score: null,
        nutrition_score: null,
        weighted_points: 0
      },
      additives: {
        starting_points: 30,
        deductions: [],
        flags: {
          partially_hydrogenated_oils: opts.contains_partially_hydrogenated_oils,
          fully_hydrogenated_oils: opts.contains_fully_hydrogenated_oils
        },
        total_points: 0,
        has_high_risk: false,
        weighted_points: 0
      },
      organic: { is_certified_organic: opts.is_certified_organic, points: 0 },
      caps: { high_risk_additive_cap_applied: false, max_score_if_applied: 49 },
      total_before_caps: null,
      total_final: null
    };
    return { score: null, breakdown: emptyBreakdown };
  }

  // Collect warnings
  const warnings: string[] = [];
  if (opts.is_reconstituted && opts.prepared_basis === "as_sold") {
    warnings.push("Product is reconstituted but nutrition is reported as_sold — score may be based on dry weight, not as consumed.");
  }

  const additive = scoreAdditives({
    additives: opts.additives,
    contains_partially_hydrogenated_oils: opts.contains_partially_hydrogenated_oils,
    contains_fully_hydrogenated_oils: opts.contains_fully_hydrogenated_oils,
    market_country: opts.market_country
  });

  const organicEligible = opts.is_certified_organic === "yes";

  const missingReq = requiredNutritionMissing({ nutri_category: opts.nutri_category, nutrition: opts.nutrition });

  if (missingReq.length) {
    const breakdown: ChewberScoreBreakdown = {
      nutrition: {
        algo_version: "original" as const,
        missing_required_fields: missingReq,
        nutri_score: null,
        nutrition_score: null,
        weighted_points: 0
      },
      additives: { ...additive, weighted_points: additive.total_points },
      organic: { is_certified_organic: opts.is_certified_organic, points: 0 },
      caps: { high_risk_additive_cap_applied: false, max_score_if_applied: 49 },
      total_before_caps: null,
      total_final: null,
      ...(warnings.length ? { warnings } : {})
    };
    return { score: null, breakdown };
  }

  const nutri = computeNutriScore({
    category: opts.nutri_category,
    nutrition: opts.nutrition,
    fvp_percent: opts.fvp_percent,
    is_water: opts.is_water
  });

  const isBeverage = opts.nutri_category === "beverage";
  const nutritionScore = nutritionScoreFromNutriScore(nutri.score, isBeverage);
  const nutritionWeighted = nutritionScore * 0.6;

  // Organic bonus: 10 points if certified organic AND nutrition score >= 40.
  // An organic avocado gets the full 10; an organic Oreo (poor nutrition) gets 0.
  // This prevents the organic label from meaningfully boosting junk food.
  const organicPoints = organicEligible ? (nutritionScore >= 40 ? 10 : 0) : 0;

  const totalBeforeCaps = nutritionWeighted + additive.total_points + organicPoints;

  // High-risk additive cap logic (cap final score at 49)
  const capMax = 49;
  const capApplied = additive.has_high_risk;
  const totalFinal = capApplied ? Math.min(totalBeforeCaps, capMax) : totalBeforeCaps;

  const breakdown: ChewberScoreBreakdown = {
    nutrition: {
      algo_version: "original" as const,
      missing_required_fields: [],
      nutri_score: nutri,
      nutrition_score: nutritionScore,
      weighted_points: nutritionWeighted
    },
    additives: {
      ...additive,
      weighted_points: additive.total_points
    },
    organic: {
      is_certified_organic: opts.is_certified_organic,
      points: organicPoints
    },
    caps: {
      high_risk_additive_cap_applied: capApplied,
      max_score_if_applied: capMax
    },
    total_before_caps: totalBeforeCaps,
    total_final: totalFinal,
    ...(warnings.length ? { warnings } : {})
  };

  return { score: roundHalfUp(totalFinal), breakdown };
}
