/**
 * Deterministic additive enrichment.
 *
 * Runs AFTER the LLM produces its additive list. Scans the ingredient text
 * against a known name→E-number mapping and merges any additives the LLM
 * missed. Also merges OFF additive tags when provided.
 *
 * This is a safety net — the LLM usually gets it right, but sometimes misses
 * additives that are clearly in the ingredient text (e.g. "BHT for freshness"
 * at the end, or USDA not listing packaging additives).
 */

import { normalizeAdditiveCode } from "./additives";
import type { AdditiveItem } from "./additives";

// ── Name → E-number mapping ──────────────────────────────────────
// Sorted longest-first so "sodium acid pyrophosphate" matches before "sodium".
// Each entry: [regex pattern for ingredient text, E-code, canonical name]

const ADDITIVE_PATTERNS: [RegExp, string, string][] = [
  // Preservatives
  [/\bsodium benzoate\b/i, "E211", "Sodium Benzoate"],
  [/\bpotassium sorbate\b/i, "E202", "Potassium Sorbate"],
  [/\bsorbic acid\b/i, "E200", "Sorbic Acid"],
  [/\bsodium nitrite\b/i, "E250", "Sodium Nitrite"],
  [/\bsodium nitrate\b/i, "E251", "Sodium Nitrate"],
  [/\bpropionic acid\b/i, "E280", "Propionic Acid"],
  [/\bcalcium propionate\b/i, "E282", "Calcium Propionate"],
  [/\bsodium propionate\b/i, "E281", "Sodium Propionate"],

  // Antioxidants
  [/\bbutylated hydroxytoluene\b|\bBHT\b/i, "E321", "BHT"],
  [/\bbutylated hydroxyanisole\b|\bBHA\b/i, "E320", "BHA"],
  [/\bTBHQ\b|\btert[- ]?butylhydroquinone\b/i, "E319", "TBHQ"],
  [/\bmixed tocopherols\b/i, "E306", "Mixed Tocopherols"],
  [/\balpha[- ]?tocopherol\b/i, "E307", "Alpha-Tocopherol"],
  [/\bascorbic acid\b/i, "E300", "Ascorbic Acid"],
  [/\bsodium ascorbate\b/i, "E301", "Sodium Ascorbate"],
  [/\bsodium erythorbate\b/i, "E316", "Sodium Erythorbate"],
  [/\bcalcium disodium EDTA\b/i, "E385", "Calcium Disodium EDTA"],
  [/\brosemary extract\b/i, "E392", "Rosemary Extract"],

  // Emulsifiers
  [/\bsoy lecithin\b|\blecithin\b/i, "E322", "Lecithin"],
  [/\bmono[- ]?and diglycerides\b|\bmono[- ]?& diglycerides\b/i, "E471", "Mono- and Diglycerides"],
  [/\bpolysorbate 80\b/i, "E433", "Polysorbate 80"],
  [/\bpolysorbate 60\b/i, "E435", "Polysorbate 60"],
  [/\bDAT[EA]M\b/i, "E472e", "DATEM"],
  [/\bsodium stearoyl lactylate\b/i, "E481", "Sodium Stearoyl Lactylate"],
  [/\bcalcium stearoyl lactylate\b/i, "E482", "Calcium Stearoyl Lactylate"],

  // Thickeners / stabilizers
  [/\bxanthan gum\b/i, "E415", "Xanthan Gum"],
  [/\bguar gum\b/i, "E412", "Guar Gum"],
  [/\bcarrageenan\b/i, "E407", "Carrageenan"],
  [/\bcellulose gum\b|\bcarboxymethylcellulose\b/i, "E466", "Cellulose Gum"],
  [/\bmicrocrystalline cellulose\b/i, "E460", "Microcrystalline Cellulose"],
  [/\blocust bean gum\b/i, "E410", "Locust Bean Gum"],
  [/\bgellan gum\b/i, "E418", "Gellan Gum"],
  [/\bpectin\b/i, "E440", "Pectin"],
  [/\bsodium alginate\b/i, "E401", "Sodium Alginate"],
  [/\bagar\b/i, "E406", "Agar"],

  // Acids
  [/\bcitric acid\b/i, "E330", "Citric Acid"],
  [/\bsodium citrate\b/i, "E331", "Sodium Citrate"],
  [/\bmalic acid\b/i, "E296", "Malic Acid"],
  [/\btartaric acid\b/i, "E334", "Tartaric Acid"],
  [/\blactic acid\b(?!\s+starter)/i, "E270", "Lactic Acid"],
  [/\bphosphoric acid\b/i, "E338", "Phosphoric Acid"],
  [/\bfumaric acid\b/i, "E297", "Fumaric Acid"],

  // Phosphates
  [/\bsodium acid pyrophosphate\b|\bSAPP\b/i, "E450", "Sodium Acid Pyrophosphate"],
  [/\bsodium aluminum phosphate\b/i, "E541", "Sodium Aluminum Phosphate"],
  [/\btricalcium phosphate\b/i, "E341", "Tricalcium Phosphate"],
  [/\bdicalcium phosphate\b/i, "E341", "Dicalcium Phosphate"],
  [/\bmonocalcium phosphate\b/i, "E341", "Monocalcium Phosphate"],
  [/\bcalcium phosphate\b/i, "E341", "Calcium Phosphate"],
  [/\btripotassium phosphate\b/i, "E340", "Tripotassium Phosphate"],
  [/\bsodium phosphate\b|\btrisodium phosphate\b/i, "E339", "Sodium Phosphate"],

  // Colors
  [/\bcaramel color\b/i, "E150d", "Caramel Color"],
  [/\bannatto\b/i, "E160b", "Annatto"],
  [/\bbeta[- ]?carotene\b/i, "E160a", "Beta-Carotene"],
  [/\bpaprika extract\b|\boleoresin of paprika\b/i, "E160c", "Paprika Extract"],
  [/\btitanium dioxide\b/i, "E171", "Titanium Dioxide"],

  // Modified starches
  [/\bmaltodextrin\b/i, "E1400", "Maltodextrin"],
  [/\bmodified (?:corn |food |tapioca |potato )?starch\b/i, "E1404", "Modified Starch"],

  // Sweeteners
  [/\bsucralose\b/i, "E955", "Sucralose"],
  [/\bacesulfame[- ]?(?:potassium|k)\b|\bace[- ]?k\b/i, "E950", "Acesulfame Potassium"],
  [/\baspartame\b/i, "E951", "Aspartame"],

  // Leavening
  [/\bbaking soda\b|\bsodium bicarbonate\b/i, "E500", "Sodium Bicarbonate"],

  // Misc
  [/\bcalcium chloride\b/i, "E509", "Calcium Chloride"],
  [/\bpotassium chloride\b/i, "E508", "Potassium Chloride"],
  [/\bcalcium carbonate\b/i, "E170", "Calcium Carbonate"],
];

/**
 * Scan ingredient text and return detected additives.
 */
export function scanIngredientsForAdditives(ingredientText: string): AdditiveItem[] {
  if (!ingredientText) return [];
  const found: AdditiveItem[] = [];
  const seen = new Set<string>();

  for (const [pattern, code, name] of ADDITIVE_PATTERNS) {
    if (pattern.test(ingredientText)) {
      const norm = normalizeAdditiveCode(code);
      if (!seen.has(norm)) {
        seen.add(norm);
        found.push({ code, name, detection: "inferred" });
      }
    }
  }
  return found;
}

/**
 * Parse OFF additive tags into AdditiveItem array.
 * Input tags like ["en:e330", "en:e322i-soy-lecithin"]
 */
export function parseOffAdditiveTags(tags: string[]): AdditiveItem[] {
  if (!tags || tags.length === 0) return [];
  return tags.map(tag => {
    let code = tag.trim();
    // Extract name hint from tag: "en:e322i-soy-lecithin" → "soy lecithin"
    let nameHint: string | null = null;
    if (code.startsWith("en:")) {
      const parts = code.slice(3).split("-");
      const codepart = parts[0];
      if (parts.length > 1) nameHint = parts.slice(1).join(" ").replace(/^\s+/, "");
      code = codepart;
    }
    code = code.toUpperCase();
    return { code, name: nameHint, detection: "database" as const };
  });
}

/**
 * Merge additive lists, deduplicating by normalized code.
 * Priority: existing LLM items > OFF tags > ingredient scan.
 * Items with null code are kept as-is (e.g. "Natural Flavors").
 */
export function mergeAdditives(
  llmAdditives: AdditiveItem[],
  offTags: string[] | null,
  ingredientText: string | null
): AdditiveItem[] {
  const result: AdditiveItem[] = [];
  const seenCodes = new Set<string>();
  // Track base codes (E150 from E150A) to prevent variant collisions
  const seenBaseCodes = new Set<string>();

  function trackCode(norm: string) {
    seenCodes.add(norm);
    const baseMatch = norm.match(/^(E\d+)[A-Z]+$/i);
    if (baseMatch) seenBaseCodes.add(baseMatch[1]);
    else seenBaseCodes.add(norm); // E322 is its own base
  }

  // Helper to add if not duplicate
  function addIfNew(item: AdditiveItem, isLowPriority = false) {
    if (!item.code) {
      // null-code items (e.g. Natural Flavors) — dedup by name
      const nameKey = (item.name ?? "").toLowerCase().trim();
      if (nameKey && result.some(r => (r.name ?? "").toLowerCase().trim() === nameKey)) return;
      result.push(item);
      return;
    }
    const norm = normalizeAdditiveCode(item.code);
    if (seenCodes.has(norm)) return;
    // For low-priority sources (ingredient scan), also skip if a variant of the
    // same base code exists (e.g. LLM said E150A, scanner says E150D — trust LLM)
    if (isLowPriority) {
      const baseMatch = norm.match(/^(E\d+)[A-Z]+$/i);
      const base = baseMatch ? baseMatch[1] : norm;
      if (seenBaseCodes.has(base)) return;
    }
    trackCode(norm);
    result.push(item);
  }

  // 1. LLM-detected (highest priority — has best names)
  for (const a of llmAdditives) addIfNew(a);

  // 2. OFF tags
  if (offTags && offTags.length > 0) {
    for (const a of parseOffAdditiveTags(offTags)) addIfNew(a);
  }

  // 3. Ingredient text scan (lowest priority — skip if LLM already has a variant)
  if (ingredientText) {
    for (const a of scanIngredientsForAdditives(ingredientText)) addIfNew(a, true);
  }

  return result;
}
