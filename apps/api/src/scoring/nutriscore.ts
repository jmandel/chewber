export type NutriCategory = "general_food" | "beverage" | "added_fat" | "cheese" | "unknown";

export type NutritionPer100 = {
  // per 100g or 100mL basis (already normalized)
  energy_kj: number | null;
  sugars_g: number | null;
  saturated_fat_g: number | null;
  total_fat_g: number | null; // needed for added fat ratio
  sodium_mg: number | null;
  salt_g: number | null; // optional
  protein_g: number | null;
  fiber_g: number | null;
};

export type NutriScoreBreakdown = {
  category: NutriCategory;
  N: number;
  P: number;
  points: {
    energy: number;
    sugars: number;
    sat_fat_or_ratio: number;
    sodium: number;
    fiber: number;
    protein: number;
    fvp: number;
  };
  rule: "N<11_or_cheese" | "N>=11_fvp_max" | "N>=11_no_protein";
  score: number; // lower is better
  letter: "A" | "B" | "C" | "D" | "E";
};

function byThresholdsGt(value: number, thresholds: number[]): number {
  let pts = 0;
  for (const t of thresholds) if (value > t) pts++;
  return pts;
}

function clampNumber(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function ratioSatFatPoints(satFatG: number, totalFatG: number): number {
  if (totalFatG <= 0) return 0;
  const ratio = (satFatG / totalFatG) * 100;
  // Table 3 thresholds: <10 ->0, <16 ->1, ... <64 ->9, >=64 ->10
  const bounds = [10, 16, 22, 28, 34, 40, 46, 52, 58, 64];
  for (let i = 0; i < bounds.length; i++) {
    if (ratio < bounds[i]) return i;
  }
  return 10;
}

// Threshold tables (original Nutri-Score, Annex 1 style)
const FOOD_ENERGY_KJ = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
const FOOD_SUGARS_G = [4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45];
const SAT_FAT_G = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SODIUM_MG = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900];

const BEV_ENERGY_KJ = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270];
const BEV_SUGARS_G = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5];

const PROTEIN_G = [1.6, 3.2, 4.8, 6.4, 8.0];
const FIBER_G = [0.9, 1.9, 2.8, 3.7, 4.7];

function fvpPointsFood(fvpPercent: number): number {
  // 0: <=40, 1: >40, 2: >60, 5: >80
  if (fvpPercent > 80) return 5;
  if (fvpPercent > 60) return 2;
  if (fvpPercent > 40) return 1;
  return 0;
}

function fvpPointsBeverage(fvpPercent: number): number {
  // 0: <=40, 2: >40, 4: >60, 10: >80
  if (fvpPercent > 80) return 10;
  if (fvpPercent > 60) return 4;
  if (fvpPercent > 40) return 2;
  return 0;
}

export function nutriScoreLetter(score: number, category: NutriCategory, isWater: boolean): "A" | "B" | "C" | "D" | "E" {
  if (category === "beverage") {
    if (isWater) return "A";
    if (score <= 1) return "B";
    if (score <= 5) return "C";
    if (score <= 9) return "D";
    return "E";
  }

  // General foods
  if (score <= -1) return "A";
  if (score <= 2) return "B";
  if (score <= 10) return "C";
  if (score <= 18) return "D";
  return "E";
}

/**
 * Compute Nutri-Score points (original algorithm style).
 * - Lower score is better.
 */
export function computeNutriScore(opts: {
  category: NutriCategory;
  nutrition: NutritionPer100;
  fvp_percent: number | null;
  is_water?: boolean;
}): NutriScoreBreakdown {
  const cat = opts.category;
  const n = opts.nutrition;
  const isWater = Boolean(opts.is_water);

  const energy = n.energy_kj ?? 0;
  const sugars = n.sugars_g ?? 0;
  const satFat = n.saturated_fat_g ?? 0;

  // Sodium: prefer sodium_mg; if missing but salt_g present, convert.
  let sodiumMg = n.sodium_mg ?? null;
  if (sodiumMg == null && n.salt_g != null) sodiumMg = (n.salt_g / 2.5) * 1000;
  sodiumMg = sodiumMg ?? 0;

  const protein = n.protein_g ?? 0;
  const fiber = n.fiber_g ?? 0;

  const fvpPct = clampNumber(opts.fvp_percent ?? 0, 0, 100);

  const pointsEnergy =
    cat === "beverage" ? byThresholdsGt(energy, BEV_ENERGY_KJ) : byThresholdsGt(energy, FOOD_ENERGY_KJ);

  const pointsSugars =
    cat === "beverage" ? byThresholdsGt(sugars, BEV_SUGARS_G) : byThresholdsGt(sugars, FOOD_SUGARS_G);

  const pointsSodium = byThresholdsGt(sodiumMg, SODIUM_MG);

  const pointsSatFatOrRatio =
    cat === "added_fat"
      ? ratioSatFatPoints(satFat, n.total_fat_g ?? 0)
      : byThresholdsGt(satFat, SAT_FAT_G);

  const N = pointsEnergy + pointsSugars + pointsSodium + pointsSatFatOrRatio;

  const pointsProtein = byThresholdsGt(protein, PROTEIN_G);
  const pointsFiber = byThresholdsGt(fiber, FIBER_G);
  const pointsFvp = cat === "beverage" ? fvpPointsBeverage(fvpPct) : fvpPointsFood(fvpPct);

  const P = pointsProtein + pointsFiber + pointsFvp;

  const fvpMax = cat === "beverage" ? 10 : 5;

  let rule: NutriScoreBreakdown["rule"];
  let score: number;

  if (N < 11 || cat === "cheese") {
    rule = "N<11_or_cheese";
    score = N - P;
  } else if (pointsFvp === fvpMax) {
    rule = "N>=11_fvp_max";
    score = N - P;
  } else {
    rule = "N>=11_no_protein";
    score = N - (pointsFiber + pointsFvp);
  }

  const letter = nutriScoreLetter(score, cat, isWater);

  return {
    category: cat,
    N,
    P,
    points: {
      energy: pointsEnergy,
      sugars: pointsSugars,
      sat_fat_or_ratio: pointsSatFatOrRatio,
      sodium: pointsSodium,
      fiber: pointsFiber,
      protein: pointsProtein,
      fvp: pointsFvp
    },
    rule,
    score,
    letter
  };
}
