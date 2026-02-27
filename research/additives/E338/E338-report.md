# E338 (Phosphoric acid) — Research Report

## Identity
- **E-number:** E338 (INS 338). [JECFA-1]
- **Name:** Phosphoric acid (orthophosphoric acid). [JECFA-1]
- **CAS number(s):** 7664-38-2. [JECFA-1][PUBCHEM-1]
- **Chemical class:** Inorganic mineral acid (phosphorus oxyacid).
- **Common synonyms:** phosphoric acid, orthophosphoric acid, o-phosphoric acid. [JECFA-1][PUBCHEM-1]
- **Natural vs synthetic:** As a food additive, E338 is an industrially manufactured acid used as an ingredient in processed foods and beverages (treated here as **synthetic** in additive context).

## Function in Food
- **Mechanism of action:** Acidifies foods/beverages (pH reduction), contributes tartness, and can act as a sequestrant/synergist in formulations. [JECFA-1]
- **Functional classes reported by JECFA:** acid, antioxidant synergist, sequestrant, synergist. [JECFA-1]
- **Common food categories:** especially acidic beverages (including cola-type soft drinks) and many processed categories where pH control is needed; EFSA’s re-evaluation considered broad use across food categories. [EFSA-1]

## Regulatory Status
### EFSA (EU)
- **Approval status:** Approved/authorised in the EU (re-evaluated in 2019 as part of phosphate additives). [EFSA-1]
- **ADI:** Group ADI **40 mg phosphorus/kg bw/day** (for phosphates including E338). [EFSA-1]
- **Evaluation year:** 2019. [EFSA-1]
- **Key conclusions:**
  - Exposure was below the group ADI in most mean scenarios.
  - At high exposure, **infants and high-level toddlers** exceeded the ADI; in one brand-loyal scenario, toddlers/children/adolescents could exceed it. [EFSA-1]

### FDA / eCFR (US)
- **Status:** GRAS.
- **Specific CFR citation:** **21 CFR 182.1073** (Phosphoric acid). [FDA-2]
- **Conditions of use:** “Generally recognized as safe when used in accordance with good manufacturing practice.” [FDA-2]
- **Additional note:** 21 CFR 582.1073 sets analogous GRAS language for animal feed context (“good manufacturing or feeding practice”). [FDA-2]
- **Accessibility note:** Standard `ecfr.gov/current/...` page URLs redirected to unblock flow from this VM; extraction was done from official eCFR API endpoints. [FDA-1][FDA-2][FDA-3]

### JECFA / WHO
- **Tolerable intake:** **MTDI 70 mg/kg bw (as phosphorus)**; comment indicates this is a group MTDI for phosphorus from all sources. [JECFA-1]
- **Last evaluation year shown:** 1982 (with prior years listed on the same record). [JECFA-1]

### IARC
- No phosphoric acid listing found in the IARC Monographs current classification dataset reviewed; therefore no IARC Group 1/2A/2B/3 assignment was identified for phosphoric acid as an agent entry. [IARC-1][IARC-2]

### Notable bans
- No major-jurisdiction outright ban identified in the EFSA/FDA/JECFA/IARC sources reviewed in this run.

## Key Safety Evidence
### Animal/toxicology and mechanistic signals
- EFSA’s re-evaluation identifies renal mineralization/nephrocalcinosis in animal data as a critical toxicological effect used in deriving the group ADI framework for phosphates. [EFSA-1]

### Human and epidemiological evidence
- **Randomized cross-over study (2024, healthy adults):** meals containing inorganic phosphate additives (lower Ca:P ratio) produced higher postprandial phosphate and altered calcium-homeostasis markers versus comparator meals; short-term loading also changed acute responses. [PUBMED-1]
- **Cross-sectional study (2009, healthy premenopausal women):** higher habitual phosphorus intake and phosphate-additive food use were associated with higher PTH and lower ionized calcium indicators. [PUBMED-2]
- **Case-control study (2007):** consuming >=2 colas/day was associated with higher odds of CKD (OR ~2.3), while non-cola carbonated beverages were not associated. This is observational and not definitive causality for E338 itself. [PUBMED-3]
- **Recent review context (2025, CKD/ESKD):** emphasizes higher intestinal absorption of inorganic phosphate from additive-containing processed foods and potential cardiovascular/renal relevance in CKD populations. [PUBMED-4]

### Overall evidence strength
- Strongest direct regulatory evidence remains EFSA/JECFA/FDA assessments.
- Human observational literature suggests potential risk signals at higher intakes/patterns, but causal attribution specifically to E338 (independent of overall dietary pattern) remains limited.

## Exposure Assessment
- **Typical dietary intake vs ADI:** EFSA found most mean exposures below the 40 mg/kg bw/day group ADI, but exceedance risk at upper-end intake for some young groups. [EFSA-1]
- **ADI exceedance risk:** Present for high consumers in infants/toddlers and in specific brand-loyal scenarios (toddlers/children/adolescents) per EFSA modelling. [EFSA-1]
- **Vulnerable populations:**
  - infants/toddlers/children with high processed-food or soft-drink intake patterns. [EFSA-1]
  - people with CKD or impaired phosphate handling (clinical relevance highlighted in nephrology literature). [PUBMED-4]

## Risk Assessment
### 1. Tier-by-tier analysis
#### risk_free
- **Evidence supporting this tier:** E338 is authorised by major regulators (EFSA/FDA/JECFA), and phosphorus is an essential nutrient.
- **Evidence arguing against this tier:** EFSA set a finite group ADI (not “ADI not specified”) and identified exceedance scenarios in young high consumers. [EFSA-1]

#### limited
- **Evidence supporting this tier:** Clear legal authorisation, GRAS status in the US, and established intake limits from EFSA/JECFA. [FDA-2][JECFA-1][EFSA-1]
- **Evidence arguing against this tier:** EFSA exposure assessment flagged exceedance in vulnerable younger groups, and human studies show plausible endocrine/mineral-balance effects at higher inorganic phosphate exposures. [EFSA-1][PUBMED-1][PUBMED-2]

#### moderate
- **Evidence supporting this tier:**
  - Approved additive but with a defined ADI.
  - ADI exceedance identified in some populations (especially infants/toddlers/high consumers).
  - Credible mechanistic and human data indicate potential renal/mineral metabolism concerns at higher inorganic phosphate intakes. [EFSA-1][PUBMED-1][PUBMED-2][PUBMED-4]
- **Evidence arguing against this tier:** No widespread ban, no IARC carcinogenic classification for phosphoric acid, and regulatory bodies continue to allow use under established limits/conditions. [FDA-2][IARC-2]

#### high
- **Evidence supporting this tier:** Some observational risk signals (e.g., high cola intake and CKD association) and CKD-focused concerns around phosphate burden. [PUBMED-3][PUBMED-4]
- **Evidence arguing against this tier:** No major-jurisdiction ban, no IARC Group 1/2A/2B listing for phosphoric acid, and existing regulatory consensus supports controlled use. [EFSA-1][FDA-2][JECFA-1][IARC-2]

### 2. Rationale
The dominant regulatory picture is “approved with quantified limits,” not unrestricted safety. EFSA’s 2019 group ADI and its exceedance findings in certain younger/high-intake groups are the main drivers away from `risk_free/limited` and toward `moderate`.

### 3. Recommended tier
**moderate**

## Sources
### EFSA
- **[EFSA-1]** Re-evaluation of phosphates (E 338-341, E 343, E 450-452) as food additives, EFSA Journal 2019;17(6):5674 — publication record/abstract accessed via OpenEFSA (URL visited: https://open.efsa.europa.eu/publications/17577)
- **[EFSA-2]** EFSA journal shortlink page (redirect target), URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/5674
- **[EFSA-3]** Wiley EFSA article URL visited (access blocked in this environment): https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2019.5674

### FDA / eCFR
- **[FDA-1]** eCFR API title metadata (Title 21 latest issue/up-to-date fields), URL visited: https://www.ecfr.gov/api/versioner/v1/titles.json
- **[FDA-2]** eCFR API full Title 21 XML (contains PART 182 and §182.1073 text), URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
- **[FDA-3]** Direct eCFR human-readable section URL attempted (redirected to unblock flow): https://www.ecfr.gov/current/title-21/section-182.1073

### JECFA / WHO
- **[JECFA-1]** JECFA database chemical page: PHOSPHORIC ACID (ID 2530), evaluation year 1982, MTDI 70 mg/kg bw (as P), INS 338, CAS 7664-38-2 — URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2530
- **[JECFA-2]** JECFA database chemical page: ORTHOPHOSPHORIC ACID (ID 1777), URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1777
- **[JECFA-3]** JECFA API partial-name search (used to locate active records), URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/phosphoric%20acid

### IARC
- **[IARC-1]** IARC Monographs list of classifications page, URL visited: https://monographs.iarc.who.int/list-of-classifications/
- **[IARC-2]** IARC classifications dataset script searched for phosphoric acid terms (no hit), URL visited: https://webapi.iarc.who.int/loc/loc.app.js

### PubMed safety studies
- **[PUBMED-1]** Inorganic phosphate additives in meals and adaptations to 5-days of dietary inorganic phosphate loading alter acute calcium homeostasis in two randomized cross-over studies in healthy adults (2024), URL visited: https://pubmed.ncbi.nlm.nih.gov/39238566/
- **[PUBMED-2]** Habitual high phosphorus intakes and foods with phosphate additives negatively affect serum parathyroid hormone concentration (2009), URL visited: https://pubmed.ncbi.nlm.nih.gov/19216809/
- **[PUBMED-3]** Carbonated beverages and chronic kidney disease (2007), URL visited: https://pubmed.ncbi.nlm.nih.gov/17525693/
- **[PUBMED-4]** Dietary Phosphorus and Metabolic Health in CKD and ESKD (2025), URL visited: https://pubmed.ncbi.nlm.nih.gov/40111420/
- **[PUBMED-5]** Common Dietary Sources of Natural and Artificial Phosphate in Food (2022), URL visited: https://pubmed.ncbi.nlm.nih.gov/35288876/

### Identity supplemental source
- **[PUBCHEM-1]** PubChem synonym/CAS endpoint for phosphoric acid (CID 1004), URL visited: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/1004/synonyms/JSON
