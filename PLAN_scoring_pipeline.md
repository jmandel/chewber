# Scoring Pipeline Fix Plan

Created: 2026-02-26
Status: COMPLETE — all phases done

## Problem Summary

The scoring pipeline had several critical gaps between the documented methodology and what was actually running. The most impactful: **additive scoring was completely non-functional** — every product got a perfect 30/30 on additives regardless of content, making the 228-entry risk database dead code.

All issues have been resolved.

## Scoring Formula

```
score = (nutrition_score × 0.6) + additive_points + organic_bonus
         0–60                    0–30              0 or 10
```

This uses a 60/30/10 allocation for nutrition/additives/organic.

- `nutrition_score`: Nutri-Score points → 0–100 via smooth linear formula → ×0.6 = 0–60
- `additive_points`: 30 minus penalties (limited: −3, moderate: −10, high: −30)
- `organic_bonus`: 10 if certified organic AND nutrition_score ≥ 40, else 0
- `high_risk_cap`: if any HIGH risk additive, total capped at 49

---

## Completed Issues

### P0: Additive Code Normalization — ✅ DONE

`normalizeAdditiveCode()` in `additives.ts` handles all formats:
- OFF tags: `en:e322-lecithins` → `E322`
- Variant codes: `E322I` → try exact, fallback to `E322`
- Case normalization: `e330` → `E330`

### P0: LLM Additive Detection — ✅ DONE

- OFF `additives_tags` surfaced as `detected_additives` in tool responses
- Research prompt §4 has US-name → E-number reference table (50+ entries)
- JSON extraction prompt enforces bare E-number format
- Natural flavors policy: `code: null`, not scored

### P0: Additive Variant Code Lookup — ✅ DONE

Base-code fallback in `lookupAdditiveRisk()`. Missing variants added to DB (E150b/c/d, E319, E306–E309).

### P1: Additive Penalty Scale Tuning — ✅ DONE

Penalties tuned to 3/10/30 (limited/moderate/high). See `RISK_PENALTY` in `additives.ts`.

### P1: Natural Flavors / Ambiguous Additives Policy — ✅ DONE

- Natural flavors → `code: null`, not scored (scorer skips null codes via `if (!a.code) continue;`)
- Artificial flavors → `code: null`, tracked but not scored
- Vitamins → report with E-number, risk_free

### P1: Nutri-Score → Score Mapping Cliff Effects — ✅ DONE

Replaced lookup table with smooth linear formulas:
- Solids: `clamp(0, 100, round(80 − 4 × NS))` — max 4-pt step between adjacent NS values
- Beverages: `clamp(0, 80, round(60 − 6 × NS))` — capped at 80, max 6-pt step

### P2: Organic Bonus Calibration — ✅ DONE (kept at 10, added gate)

Kept at 10 points for the 60/30/10 split. Added nutrition ≥ 40 gate (organic bonus requires decent nutrition baseline).

### P2: Organic Evidence from OFF — ✅ DONE

`labels_tags` selected from parquet via DuckDB and surfaced in tool responses.

### P2: USDA Online API Energy Unit Bug — ✅ DONE

Nutrient ID 2047 correctly mapped to `energy_kcal`, with `energy_kj` derived via × 4.184.

### P3: Score Label Thresholds — ✅ DONE

Updated to: 85+ Excellent, 65–84 Good, 40–64 Mediocre, 0–39 Poor.

---

## Implementation Order — ALL COMPLETE

```
Phase 1 — Get additives working (P0) ✅
  1. ✅ normalizeAdditiveCode() in additives.ts
  2. ✅ Surface OFF additive tags in researchAgent.ts tool responses
  3. ✅ Add US-name → E-number table to research prompt
  4. ✅ Update JSON extraction prompt with code format rules
  5. ✅ Add missing DB entries (E150b/c/d, E319, etc.)
  6. ⊘ Re-score existing products — skipped (DB too small/biased for validation)

Phase 2 — Tune penalties and mapping (P1) ✅
  7. ✅ Penalty scale tuned to 3/10/30
  8. ✅ Smooth linear mapping (no cliffs)
  9. ✅ Natural flavors policy (null code → not scored)

Phase 3 — Polish (P2/P3) ✅
  10. ✅ OFF organic labels surfaced via labels_tags
  11. ✅ USDA energy unit bug fixed
  12. ✅ Organic bonus: kept 10pts + nutrition≥40 gate
  13. ✅ Score label thresholds: 85/65/40/0
```

## Validation Approach

When the product database grows to a meaningful size, validate Chewber scores against:
- Products with known additive profiles (BHT, caramel color, etc.)
- Products spanning the full Nutri-Score range (A through E)
- Organic vs. conventional variants of the same product

Target: scores should be intuitive and consistent across comparable products.
