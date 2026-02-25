# Chewber abstraction guidelines (expert abstractors)

This is the human-friendly version of the template used by the Research Agent.

## Goal

Given *any food anywhere* (barcode product or natural food), produce a consistent abstraction that enables:
- deterministic scoring
- reproducibility (auditable sources)
- future updates (new evidence can replace old)

## Required outputs

1) A **Markdown research report** following the template below
2) A **JSON abstraction** matching `apps/api/src/schemas/food_abstraction.schema.json`

---

## Markdown report template (copy/paste)

# Chewber Food Research Report

## 1) Identification
- Canonical name:
- Brand:
- Barcode (EAN/UPC):
- Kind: prepared | natural
- Market/country:
- Language:
- Candidate product URLs:
- Confidence (0..1) and rationale:

## 2) Classification for scoring
- Nutri-Score category: general_food | beverage | added_fat | cheese
- Is water? (beverage-only): yes/no
- Reconstituted product? yes/no
  - If yes: describe preparation instructions and whether nutrition is "as prepared" vs "as sold"
- Fruits/vegetables/legumes/nuts + specific oils percentage (FVPN%):
  - value:
  - evidence/derivation:

## 3) Nutrition facts (per 100 g or per 100 mL)
Provide numeric values with units; use null if unknown.
- energy_kj:
- energy_kcal (optional):
- sugars_g:
- saturated_fat_g:
- total_fat_g:
- sodium_mg:
- salt_g (optional, if label provides salt):
- protein_g:
- fiber_g:

## 4) Ingredients & additives
- Ingredients (verbatim if available):
- Additives (list):
  - code:
  - name:
  - how detected (label / database / other):
- Contains partially hydrogenated oils? yes/no/unknown
- Contains fully hydrogenated oils? yes/no/unknown

## 5) Organic status
- Certified organic? yes/no/unknown
- Evidence (label, database field, etc.):

## 6) Sources
List all sources as bullet points with URLs.

## 7) Uncertainties & follow-ups
- Missing fields:
- Suggested next lookups:

---

## Notes for abstractors

- Prefer primary sources: label photos, official brand pages, Open Food Facts, USDA/FDC.
- If nutrition values are “as prepared”, document the preparation instructions clearly.
- If only salt is given, compute sodium_mg using sodium = salt / 2.5.
- Additives:
  - Include E-numbers when known.
  - If the label lists names but not E-numbers, include names and set code=null.
- Confidence should reflect data reliability and completeness.
