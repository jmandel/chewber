# Audit: Organic Status & Eligibility/Scoring Track

Date: 2025-01-XX
Scope: `research_report.md` §0 (Eligibility) and §5 (Organic status)

---

## Part A: Organic Status

### Finding 1: "no" vs "unknown" boundary is undefined — the LLM is guessing

**Problem:** The prompt says to keep "unknown" unless there's concrete evidence for "yes", but says *nothing* about when to report "no" vs "unknown". The current data shows this inconsistency:

| Product | organic | Why? |
|---|---|---|
| Prego Traditional | no | How does the LLM *know* it's not organic? |
| Rao's Homemade Marinara | unknown | Why doesn't the LLM *know* this one? |
| Avocado | unknown | Generic produce, fair |
| Clif Bar Chocolate Chip | no | Reasonable — well-known conventional brand |

The LLM is using its training knowledge ("Prego is a mass-market brand, probably not organic") to assert "no" for some products while hedging with "unknown" for others. There's no principled distinction.

**Impact:** "no" and "unknown" are scored identically (0 bonus points), so this inconsistency doesn't affect scores *today*. But it's a data quality landmine — if you ever differentiate them (e.g., "unknown" triggers a follow-up question), the inconsistent data will bite.

**Recommendation:** Add an explicit decision tree to §5:

```markdown
## 5) Organic status
- Certified organic? yes / no / unknown
- Evidence:

**Decision rules (follow in order):**
1. If the input query specifies isOrganic: "yes" or "no" → trust it. Carry it forward.
2. If isOrganic: "unknown" (or not specified), check tool results:
   a. **"yes"** — requires concrete evidence: USDA organic certification, OFF labels_tags
      containing "en:organic", product name includes "Organic", or label photo shows
      USDA Organic / EU organic seal.
   b. **"no"** — requires concrete counter-evidence: OFF labels_tags exist but do NOT
      include any organic tag, OR the product's official website / packaging explicitly
      shows no organic certification, OR the specific branded product is well-documented
      in databases as conventional.
   c. **"unknown"** — use when: no database labels data is available, OR the product
      is generic/unbranded (e.g. "avocado", "chicken breast") where organic status
      varies by purchase, OR tool results are ambiguous.

**Key principle:** "no" means "we have evidence this specific product is NOT certified
 organic." "unknown" means "we don't have enough data to say either way."
```

### Finding 2: OFF database has organic labels — but the prompt doesn't tell the LLM to look for them

**Problem:** Open Food Facts products include `labels_tags` (e.g., `["en:organic", "en:usda-organic"]`) which is *exactly* the structured evidence the prompt calls for. But:
1. The `localOff.ts` `SELECT_PRODUCT` query **does not select `labels` or `labels_tags`** from the parquet file.
2. Even if it did, the research prompt never tells the LLM "check the OFF labels_tags field for organic markers."

The LLM is forced to infer organic status from the product name or its training data — no wonder it's inconsistent.

**Recommendation (two parts):**

**(a) Expose OFF labels in the tool result.** Add `labels_tags` to the `SELECT_PRODUCT` query in `localOff.ts`:
```sql
CASE WHEN len(labels_tags) > 0
  THEN array_to_string(labels_tags, ',')
  ELSE NULL
END AS labels_tags
```
And include it in `LocalOffProduct`.

**(b) Update the prompt §5** to reference this field:
```markdown
- Check OFF tool results for `labels_tags` containing "organic", "en:organic",
  "en:usda-organic", "en:eu-organic", or similar. This is concrete evidence.
- Check USDA tool results: USDA branded products don't have an organic flag,
  but product descriptions sometimes include "ORGANIC" in the name.
```

### Finding 3: Natural/unbranded produce should default to "unknown" — and the prompt should say so explicitly

**Problem:** "Avocado" correctly gets "unknown", but only by luck. The prompt doesn't explicitly address the case of generic produce where organic status is inherently per-purchase.

**Recommendation:** Add to §5:
```markdown
- For generic/unbranded natural foods (fruits, vegetables, grains, meat, eggs, etc.),
  organic status is inherently per-purchase — always report "unknown" unless the user
  specified isOrganic in the query.
```

This aligns with the helper agent's behavior (it asks "Organic?" for generic produce and passes the answer through `isOrganic`).

### Finding 4: Mid-Day Squares organic="yes" — where's the evidence?

**Problem:** The data shows `Mid-Day Squares Brownie Batter: organic=yes` but Mid-Day Squares are NOT certified organic. Some ingredients may be organic, but the product itself doesn't carry USDA Organic certification. This looks like the LLM hallucinated based on the brand's "clean label" marketing.

**Recommendation:** The evidence field should be mandatory when organic="yes". Add:
```markdown
- When reporting organic: "yes", the evidence field MUST contain a specific citation
  (e.g., "OFF labels_tags: en:usda-organic" or "product name contains 'Organic'" or
  "user confirmed isOrganic: yes"). If you cannot cite specific evidence, report "unknown".
```

---

## Part B: Eligibility / Scoring Track

### Finding 5: The not_rated categories have ambiguous boundaries

The current list:
```
- Alcohol → NOT RATED
- Pure sugar, honey, agave syrup, coconut sugar, maple syrup, sweeteners → NOT RATED
- Infant food / baby milk (0-2 years) → NOT RATED
- Protein supplements (whey, creatine, etc.) → NOT RATED
- Everything else → STANDARD
```

**Specific ambiguities the LLM will encounter:**

#### 5a. "Alcohol" is too vague
- **Clear not_rated:** Beer, wine, spirits, hard seltzer, cocktails
- **Ambiguous:** Cooking wine (12-17% ABV but sold as cooking ingredient), vanilla extract (~35% ABV but used in tiny amounts as flavoring), wine vinegar (trace alcohol), kombucha (<0.5% ABV), alcohol-free beer (0.0-0.5%)

**Recommendation:** Replace with:
```markdown
- Alcoholic beverages (beer, wine, spirits, hard seltzer, cocktails, liqueurs) → NOT RATED
- Cooking wines and extracts (vanilla extract, almond extract) → STANDARD
  (these are cooking ingredients, not beverages; score their nutrition normally)
- Kombucha and "alcohol-free" beverages (<0.5% ABV) → STANDARD
- Vinegar → STANDARD (it's a condiment, not an alcoholic beverage)
```

#### 5b. "Sweeteners" is ambiguous — stevia and monk fruit are edge cases
- **Clear not_rated:** A bag of white sugar, a jar of honey, a bottle of maple syrup, a bag of coconut sugar
- **Ambiguous:** Stevia drops, monk fruit sweetener packets, erythritol bags, sugar-free syrup (e.g., Torani), molasses

The issue: stevia and monk fruit are sold as standalone sweetener products ("Pure Stevia Extract") but also appear as *ingredients* in other products. The not_rated rule should apply to the **product**, not the ingredient.

**Recommendation:** Clarify:
```markdown
- Pure sweetener products sold as a standalone sweetener (sugar, honey, maple syrup,
  agave, coconut sugar, stevia packets, monk fruit sweetener, erythritol, xylitol,
  artificial sweetener packets like Splenda/Equal) → NOT RATED
- Sweetened syrups with other ingredients (e.g., chocolate syrup, flavored coffee syrup,
  pancake syrup) → STANDARD (these are condiments/toppings, not pure sweeteners)
- Molasses → STANDARD (it's a baking/cooking ingredient with meaningful nutrition)
```

#### 5c. "Protein supplements" boundary is unclear — what about protein bars?
- **Clear not_rated:** Whey protein powder, casein powder, creatine, BCAA supplements, mass gainer powder
- **Clear standard:** High-protein yogurt, protein-enriched cereal, eggs
- **Ambiguous:** Protein bars (Quest, Clif Builder's), collagen peptide powder, meal replacement shakes (Soylent, Huel)

The key distinction should be: is this a **food** or a **supplement**? Protein bars are sold as food (they have a Nutrition Facts panel, not a Supplement Facts panel). Whey powder is sold as a dietary supplement.

**Recommendation:**
```markdown
- Dietary/protein supplements (whey protein powder, casein, creatine, BCAAs, collagen
  peptides, pre-workout powders — products with a Supplement Facts panel) → NOT RATED
- Protein bars, meal replacement bars, and meal replacement shakes (products with a
  Nutrition Facts panel that happen to be high in protein) → STANDARD
- High-protein variants of normal foods (Greek yogurt, protein cereal) → STANDARD
```

### Finding 6: Missing not_rated categories that should be considered

#### 6a. Dietary supplements (non-protein)
**Problem:** The list covers protein supplements but not multivitamins, fish oil capsules, vitamin D drops, or other dietary supplements. These have Supplement Facts panels and aren't "food" in any meaningful sense.

**Recommendation:** Add:
```markdown
- Dietary supplements (vitamins, minerals, fish oil, probiotics — products with a
  Supplement Facts panel rather than Nutrition Facts) → NOT RATED
```

#### 6b. Pure baking/cooking ingredients with no standalone nutritional value
**Problem:** Should baking soda, baking powder, food coloring, or pectin be scored? They're consumed in negligible quantities.

**Recommendation:** These are edge cases that rarely come up. Keep them STANDARD — the scoring system handles them fine (they'll get reasonable scores based on their actual nutrition). Adding a "negligible consumption" category adds complexity without value. However, you could add a note:
```markdown
- Baking ingredients (flour, baking soda, cornstarch, yeast, etc.) → STANDARD
  (score based on nutrition as-sold; these are legitimate food ingredients)
```

#### 6c. Pet food
**Probably never queried, but:** Pet food appears in OFF/USDA databases and could be returned as a match. Add:
```markdown
- Pet food / animal feed → NOT RATED
```

### Finding 7: The prompt should provide a decision framework, not just a list

The current list-based approach will always have gaps. The LLM needs a **principle** to reason about edge cases.

**Recommendation:** Add a decision framework before the list:
```markdown
## 0) Eligibility check

**Principle:** Chewber scores FOODS — products meant to be eaten/drunk by humans
as a meaningful part of their diet. Products that are not foods, are regulated
differently than foods, or where nutritional scoring is meaningless are NOT RATED.

**Decision framework:**
1. Is this a food or beverage meant for human consumption? If no → NOT RATED
2. Does it have a Supplement Facts panel (not Nutrition Facts)? → NOT RATED
3. Is it an alcoholic beverage (≥0.5% ABV, sold for its alcohol content)? → NOT RATED
4. Is it a pure sweetener sold as a standalone product? → NOT RATED
5. Is it infant formula or baby food for 0-2 years? → NOT RATED
6. Otherwise → STANDARD

**Specific rulings for common edge cases:**
- Cooking wine, vanilla extract, vinegar → STANDARD (cooking ingredients)
- Kombucha, alcohol-free beer → STANDARD (beverages)
- Protein bars, meal replacement shakes → STANDARD (foods)
- Protein powders, creatine, BCAAs → NOT RATED (supplements)
- Vitamins, fish oil, probiotics → NOT RATED (supplements)
- Stevia packets, Splenda, sugar bags → NOT RATED (pure sweeteners)
- Chocolate syrup, pancake syrup → STANDARD (condiments)
- Flour, baking soda, yeast → STANDARD (baking ingredients)
- Molasses → STANDARD (baking ingredient with nutrition)
```

---

## Summary of All Recommendations

### Organic (§5) — 4 changes:
1. **Add explicit no/unknown decision tree** — "no" requires counter-evidence from databases; "unknown" is the default when data is absent
2. **Expose OFF `labels_tags`** in tool results and tell the LLM to check them
3. **Explicitly state** that generic produce defaults to "unknown"
4. **Require evidence citation** when reporting organic="yes"

### Eligibility (§0) — 3 changes:
1. **Add a principles-based decision framework** above the specific list
2. **Clarify boundaries** for alcohol (cooking wine, extracts, kombucha), sweeteners (stevia, monk fruit, syrups), and protein (bars vs powders vs supplements)
3. **Add missing categories:** non-protein dietary supplements (vitamins, fish oil), and pet food

### Data quality flag:
- **Mid-Day Squares organic=yes is likely incorrect** — should be audited and corrected
