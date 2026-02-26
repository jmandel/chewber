import { getReferenceDb } from "../db/referenceDb";

export type RiskLevel = "risk_free" | "limited" | "moderate" | "high";

export type AdditiveItem = {
  code: string | null;
  name: string | null;
  detection: "label" | "database" | "inferred" | "unknown";
};

export type AdditiveScoreBreakdown = {
  starting_points: number; // 30
  deductions: { code: string | null; name: string | null; risk_level: RiskLevel; penalty: number }[];
  flags: {
    partially_hydrogenated_oils: "yes" | "no" | "unknown";
    fully_hydrogenated_oils: "yes" | "no" | "unknown";
  };
  total_points: number; // 0..30
  has_high_risk: boolean;
};

/**
 * Map risk levels to point deductions (from a 30-point starting budget).
 * NOTE: This is a scaffold; tune these penalties to match your chosen policy.
 */
export const RISK_PENALTY: Record<RiskLevel, number> = {
  risk_free: 0,
  limited: 6,
  moderate: 15,
  high: 30
};

/**
 * Normalize additive codes from various formats to DB format (e.g. "E322").
 * Handles: "en:e322-lecithins" → "E322", "e322i" → "E322I" → fallback "E322"
 */
export function normalizeAdditiveCode(raw: string): string {
  let code = raw.trim();
  // Strip OFF tag prefix: "en:e322-lecithins" → "e322"
  if (code.startsWith("en:")) code = code.slice(3).split("-")[0];
  // Uppercase: "e322" → "E322"
  code = code.toUpperCase();
  // Remove any remaining non-alphanumeric (except leading E)
  code = code.replace(/[^A-Z0-9]/g, "");
  // Ensure starts with E
  if (!code.startsWith("E")) return code;
  return code;
}

export function lookupAdditiveRisk(rawCode: string): { risk_level: RiskLevel; name?: string | null; matched_code?: string } {
  const db = getReferenceDb();
  const code = normalizeAdditiveCode(rawCode);
  
  // Try exact match first (case-insensitive because DB has mixed case: E150a vs E322I)
  const row = db
    .query(`SELECT code, risk_level, name FROM additive_risks WHERE code = ? COLLATE NOCASE LIMIT 1`)
    .get(code) as any;
  if (row) return { risk_level: row.risk_level as RiskLevel, name: row.name ?? null, matched_code: row.code };
  
  // Try base code (strip trailing letter for variants like E322I → E322, E150D → E150)
  const baseMatch = code.match(/^(E\d+)[A-Z]$/);
  if (baseMatch) {
    const baseCode = baseMatch[1];
    const baseRow = db
      .query(`SELECT code, risk_level, name FROM additive_risks WHERE code = ? COLLATE NOCASE LIMIT 1`)
      .get(baseCode) as any;
    if (baseRow) return { risk_level: baseRow.risk_level as RiskLevel, name: baseRow.name ?? null, matched_code: baseRow.code };
  }
  
  // Not found — return risk_free (unknown additive, don't penalize)
  return { risk_level: "risk_free", name: null };
}

const HYDRO_MARKETS = new Set(["US", "CA", "AU", "USA", "CAN", "AUS", "UNITED STATES", "CANADA", "AUSTRALIA"]);

export function scoreAdditives(opts: {
  additives: AdditiveItem[];
  contains_partially_hydrogenated_oils: "yes" | "no" | "unknown";
  contains_fully_hydrogenated_oils: "yes" | "no" | "unknown";
  market_country?: string | null;
}): AdditiveScoreBreakdown {
  let points = 30;
  const deductions: AdditiveScoreBreakdown["deductions"] = [];

  let hasHigh = false;

  const seen = new Set<string>();
  for (const a of opts.additives) {
    if (!a.code) continue;
    const normalized = normalizeAdditiveCode(a.code);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    const risk = lookupAdditiveRisk(a.code);
    const penalty = RISK_PENALTY[risk.risk_level];
    if (penalty > 0) {
      points -= penalty;
      deductions.push({ code: a.code, name: a.name ?? risk.name ?? null, risk_level: risk.risk_level, penalty });
    }
    if (risk.risk_level === "high") hasHigh = true;
  }

  // Hydrogenated oils handling — only for US, CA, AU markets (Spec Section 8.5).
  const applyHydro = opts.market_country ? HYDRO_MARKETS.has(opts.market_country.toUpperCase()) : false;
  if (applyHydro) {
    if (opts.contains_partially_hydrogenated_oils === "yes") {
      points -= RISK_PENALTY.high;
      deductions.push({ code: "PARTIALLY_HYDROGENATED_OILS", name: "Partially hydrogenated oils", risk_level: "high", penalty: RISK_PENALTY.high });
      hasHigh = true;
    } else if (opts.contains_fully_hydrogenated_oils === "yes") {
      points -= RISK_PENALTY.moderate;
      deductions.push({ code: "FULLY_HYDROGENATED_OILS", name: "Fully hydrogenated oils", risk_level: "moderate", penalty: RISK_PENALTY.moderate });
    }
  }

  points = Math.max(0, Math.min(30, points));

  return {
    starting_points: 30,
    deductions,
    flags: {
      partially_hydrogenated_oils: opts.contains_partially_hydrogenated_oils,
      fully_hydrogenated_oils: opts.contains_fully_hydrogenated_oils
    },
    total_points: points,
    has_high_risk: hasHigh
  };
}
