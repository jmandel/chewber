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
 * Piecewise lookup tables with separate curves for solid foods vs beverages.
 */
function nutritionScoreFromNutriScore(points: number, isBeverage: boolean): number {
  const p = Math.round(points);

  if (!isBeverage) {
    // Solid foods
    if (p <= -3) return 100;
    const map: Record<number, number> = {
      [-3]: 100,
      [-2]: 100,
      [-1]: 90,
      0: 80,
      1: 75,
      2: 70,
      3: 65,
      4: 60,
      5: 55,
      6: 50,
      7: 45,
      8: 40,
      9: 35,
      10: 30,
      11: 15,
      12: 13,
      13: 11,
      14: 9,
      15: 7,
      16: 5,
      17: 3,
      18: 1
    };
    if (p >= 19) return 0;
    return map[p] ?? 0;
  }

  // Beverages
  if (p <= -4) return 80;
  const map: Record<number, number> = {
    [-3]: 77,
    [-2]: 74,
    [-1]: 71,
    0: 68,
    1: 65,
    2: 57,
    3: 49,
    4: 41,
    5: 33,
    6: 15,
    7: 11,
    8: 7,
    9: 3
  };
  if (p >= 10) return 0;
  return map[p] ?? 0;
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

  const organicPoints = opts.is_certified_organic === "yes" ? 10 : 0;

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
      organic: { is_certified_organic: opts.is_certified_organic, points: organicPoints },
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
