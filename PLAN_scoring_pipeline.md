# Scoring Pipeline Fix Plan

Created: 2026-02-26
Status: PLANNED

## Problem Summary

The scoring pipeline has several critical gaps between the documented methodology and what's actually running. The most impactful: **additive scoring is completely non-functional** — every product gets a perfect 30/30 on additives regardless of content, making the 228-entry risk database dead code.

## Current Scoring Formula

```
score = (nutrition_score × 0.6) + additive_points + organic_bonus
         0–60                    0–30              0 or 10
```

- `nutrition_score`: Nutri-Score points → 0–100 via lookup table → ×0.6 = 0–60
- `additive_points`: 30 minus penalties (limited: −6, moderate: −15, high: −30)
- `organic_bonus`: 10 if certified organic, else 0
- `high_risk_cap`: if any HIGH risk additive, total capped at 49

## Issues by Priority

---

### P0: Additive Code Normalization (CRITICAL — all products affected)

**Bug**: `lookupAdditiveRisk()` does exact string match against the `additive_risks` table, but codes arrive in 3 incompatible formats:

| Source | Format | Example | Matches DB? |
|---|---|---|---|
| OFF `additives_tags` | `en:e330` | Citric acid | ❌ No |
| LLM (from OFF) | `en:e322` | Soy Lecithin | ❌ No |
| LLM (from label) | `E322` or `null` | Lecithins | ✅/❌ |
| DB `additive_risks` | `E322` | — | — |

**Fix**: Add `normalizeAdditiveCode()` in `scoring/additives.ts`:
```ts
function normalizeAdditiveCode(raw: string): string {
  let code = raw.trim();
  // Strip OFF tag prefix: "en:e322-lecithins" → "e322"
  if (code.startsWith("en:")) code = code.slice(3).split("-")[0];
  // Uppercase: "e322" → "E322"
  code = code.toUpperCase();
  // Strip variant suffix: "E322I" → "E322", "E150A" → "E150A" (keep if in DB)
  // Try exact match first, then strip trailing letter
  return code;
}
```
Apply before every `lookupAdditiveRisk()` call. Also handle variant codes (E322i → E322, E307c → E307) by falling back to base code if variant not in DB.

**Files**: `apps/api/src/scoring/additives.ts`

---

### P0: LLM Additive Detection — Use OFF Tags as Primary Source (CRITICAL)

**Bug**: The LLM parses ingredient lists by hand to find additives, often missing them or outputting `code: null`. Meanwhile, OFF's pre-parsed `additives_tags` field is available in tool results but never highlighted.

**Fix — three changes**:

1. **Surface OFF additive tags explicitly in tool responses** (`researchAgent.ts`)
   - Extract `additives` array from OFF results
   - Present as a top-level `detected_additives` field alongside the product data
   - Format: `[{"code": "E322", "tag": "en:e322-lecithins"}]` (pre-normalized)

2. **Update research prompt** (`research_report.md` §4)
   - "For additives, use the OFF `detected_additives` field as your PRIMARY source — these are algorithmically parsed and reliable."
   - "Supplement with any additives visible in the ingredient list that OFF missed."
   - "Every additive MUST have an E-number code. Use the reference table below."
   - Add common US-name → E-number mapping table (25–30 entries)

3. **Update JSON extraction prompt** (`report_to_json.md`)
   - "Additive codes MUST be in bare E-number format: `E322`, not `en:e322` or `e322-lecithins`."
   - "If the research report has a name but no code, look up the E-number from the mapping table."

**Common US-name → E-number table** (for the prompt):
```
Citric Acid → E330          Ascorbic Acid (Vit C) → E300
Soy Lecithin → E322         Mono/Diglycerides → E471  
Xanthan Gum → E415          Guar Gum → E412
Carrageenan → E407          Cellulose Gum → E466
Calcium Phosphate → E341    Sodium Phosphate → E339
Potassium Sorbate → E202    Sodium Benzoate → E211
BHA → E320                  BHT → E321
TBHQ → E319                 Caramel Color → E150d
Annatto → E160b             Beta-Carotene → E160a
Mixed Tocopherols → E306    Sodium Nitrite → E250
Sodium Nitrate → E251       Polysorbate 80 → E433
Maltodextrin → E1400        Modified Corn Starch → E1404
Rosemary Extract → E392     Sucralose → E955
Acesulfame K → E950         Aspartame → E951
Stevia (Reb A) → E960       Titanium Dioxide → E171
```

**Files**: `apps/api/src/agents/researchAgent.ts`, `apps/api/src/agents/prompts/research_report.md`, `apps/api/src/agents/prompts/report_to_json.md`

---

### P0: Additive Variant Code Lookup (BROKEN)

**Bug**: DB has `E307` but LLM outputs `E307c` (a valid variant). DB has `E322` but OFF tags include `E322i`. DB has `E150a` but US "caramel color" is usually `E150d` (not in DB).

**Fix**:
1. In `normalizeAdditiveCode()`: if exact match fails, strip trailing lowercase letter and retry
2. Add missing variant entries to `additive_risks`:
   - `E150b` (Caustic sulphite caramel) → limited
   - `E150c` (Ammonia caramel) → moderate  
   - `E150d` (Sulphite ammonia caramel) → moderate (this is US "caramel color")
   - `E319` (TBHQ) → high
   - `E306`–`E309` variants (tocopherols) → risk_free

**Files**: `apps/api/src/scoring/additives.ts`, `scripts/build-usda-db.sh` or seed script

---

### P1: Additive Penalty Scale Tuning

**Issue**: Current penalties may be too harsh once the system actually works:
- `limited: −6` (e.g., soy lecithin, modified starch — very common, generally safe)
- `moderate: −15` (e.g., calcium phosphate — fortification mineral)
- `high: −30` (e.g., BHT, sodium nitrite — legitimate concerns)

With working additive scoring, a product with 2 limited additives loses 12 points (12% of max score). A product with 1 moderate additive loses 15 points. This seems aggressive compared to industry benchmarks.

**Proposed revised scale** (evaluate after P0 fixes, with real data):
```
risk_free:  0    (no change)
limited:    3    (was 6 — halved; most products have 1–3 limited additives)
moderate:  10    (was 15 — common fortification minerals shouldn't kill score)
high:      30    (unchanged — these are genuinely concerning)
```

**Approach**: Fix P0 first, re-score all existing products, compare against industry benchmarks ratings for the same products, then tune.

**Files**: `apps/api/src/scoring/additives.ts` (RISK_PENALTY constant)

---

### P1: "Natural Flavors" / Ambiguous Additives Policy

**Issue**: "Natural flavors" appears in a huge fraction of US products, has no single E-number, and OFF doesn't flag it. No current policy.

**Proposed policy**:
- `Natural flavors` → report with `code: null`, `detection: "label"` — tracked but **not scored** (no penalty)
- `Artificial flavors` → report with `code: null`, `detection: "label"` — **limited** penalty
- Vitamins added for fortification (Ascorbic Acid as preservative, Riboflavin for color) → report with E-number, risk_free

**Files**: `apps/api/src/agents/prompts/research_report.md` (§4 guidance)

---

### P1: Nutri-Score → Score Mapping Cliff Effects

**Issue**: The `nutritionScoreFromNutriScore()` lookup table has sharp cliffs:
- Score 0 (B) → 80, Score -1 (A) → 90: **10-point jump** for 1 NS point
- Score 10 (C) → 30, Score 11 (D) → 15: **15-point cliff**
- The FVPN >80% threshold feeds into FVP points (5 vs 2), which can swing 3 NS points, which can cross these cliffs → **FVPN estimation errors amplified by up to 30 score points**

**Proposed fix**: Smooth the mapping to a continuous function:
```
nutrition_score = max(0, min(100, 50 - (nutri_score_points × 5)))
```
This gives: NS=-10→100, NS=-6→80, NS=0→50, NS=5→25, NS=10→0.
Or keep lookup table but smooth the cliffs (no >5 point jumps between adjacent NS points).

**Approach**: Model this after P0/P1 fixes to see how score distribution looks with working additives. The cliffs may be less problematic once additive scoring provides more granularity.

**Files**: `apps/api/src/scoring/score.ts`

---

### P2: Organic Bonus Calibration

**Issue**: 10 points (10% of max) for organic certification is generous. An organic Oreo would score 10 points higher than a regular Oreo.

**Proposed**: Reduce to 5 points, or make it conditional (only applies if nutrition score is above a threshold — organic junk food doesn't deserve a bonus).

**Files**: `apps/api/src/scoring/score.ts`

---

### P2: Organic Evidence from OFF

**Issue**: OFF products include `labels_tags` (e.g., `["en:organic", "en:usda-organic"]`) but this field is not selected from the parquet file. The LLM guesses organic status from training knowledge.

**Fix**: Add `labels_tags` to the DuckDB SELECT in `localOff.ts`, surface as `organic_labels` in tool response, update research prompt §5.

**Files**: `apps/api/src/sources/localOff.ts`, `apps/api/src/agents/researchAgent.ts`

---

### P2: USDA Online API Energy Unit Bug

**Issue** (from audit): In `sources/usda.ts`, USDA nutrient ID 2047 ("Energy Atwater General Factors") is in kcal but mapped to `energy_kj`. If the online USDA API is used and the local DB doesn't have the product, energy would be ~4× inflated for Nutri-Score.

**Impact**: Low — the online API is rarely hit now that local DBs have 6M+ products. But should be fixed.

**Files**: `apps/api/src/sources/usda.ts`

---

### P3: Score Label Thresholds

**Issue**: 75+ = "Excellent" may be too generous. After additive fixes, review the distribution and consider:
- 85+ = Excellent
- 65–84 = Good  
- 40–64 = Mediocre
- 0–39 = Poor

Or align with industry benchmarks thresholds for user familiarity.

**Files**: `apps/web/src/app.tsx`

---

## Implementation Order

```
Phase 1 — Get additives working (P0)
  1. normalizeAdditiveCode() in additives.ts
  2. Surface OFF additive tags in researchAgent.ts tool responses  
  3. Add US-name → E-number table to research prompt
  4. Update JSON extraction prompt with code format rules
  5. Add missing DB entries (E150b/c/d, E319, etc.)
  6. Re-score all existing products, verify against industry benchmarks

Phase 2 — Tune penalties and mapping (P1)
  7. Evaluate penalty scale with real additive data
  8. Smooth Nutri-Score → score mapping cliffs
  9. Establish natural flavors / vitamins policy

Phase 3 — Polish (P2/P3)
  10. Surface OFF organic labels
  11. Fix USDA online API energy unit
  12. Calibrate organic bonus
  13. Review score label thresholds
```

## Validation Approach

After Phase 1, re-research these products and compare against industry benchmarks:
- Crunchmaster Multi-Seed Crackers (industry benchmarks: Good)
- Clif Bar Chocolate Chip (has soy lecithin + dicalcium phosphate)
- Special K Original (has BHT — should trigger high-risk cap)
- Prego Traditional (has citric acid)
- A product with many additives (e.g., a frozen pizza or packaged cookies)

Target: Chewber scores within ±10 points of industry benchmarks for mainstream products.
