# E1422 (Acetylated distarch adipate) Research Report

## Step 1 Data Extraction Log (authoritative-source pass)
- **EFSA**
  - URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4911
  - Result: page reachable but redirected to Wiley DOI endpoint with 403 challenge in this environment.
  - Alternate authoritative URL used for extraction: https://pmc.ncbi.nlm.nih.gov/articles/PMC7009865/
  - Data extracted: 2017 re-evaluation year; no safety concern at reported uses for general population; no need for numerical ADI; 95th percentile combined exposure up to 3,053 mg/kg bw/day; kidney-mineralization findings in rats interpreted as diet-mineral-imbalance related and not directly relevant for human risk at current uses.
- **FDA/CFR (Title 21)**
  - URL visited: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-172/section-172.892
  - Result: anti-bot challenge blocked human-readable section in this VM.
  - Alternate official eCFR API URL used for extraction: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
  - Corroboration URL: https://www.govinfo.gov/content/pkg/CFR-2015-title21-vol3/pdf/CFR-2015-title21-vol3-sec172-892.pdf
  - Data extracted: food starch-modified may be safely used; relevant esterification route uses adipic anhydride (<=0.12%) and acetic anhydride; acetyl groups in finished food starch-modified <=2.5%; use quantity limited to reasonably required technical effect.
- **JECFA/WHO**
  - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/379
  - Supporting URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Search?searchType=additives&name=acetylated%20distarch%20adipate
  - Data extracted: ADI not specified; evaluation-year entries include 2016 (ADI not specified) and 2018 (specification only).
- **IARC**
  - URLs visited: https://monographs.iarc.who.int/list-of-classifications/ and https://webapi.iarc.who.int/loc/loc.app.js
  - Data extracted: no listing hit for “acetylated distarch adipate”, “E1422”, or CAS 68130-14-3 in current IARC classification dataset checked.
- **PubMed**
  - Search URL visited: https://pubmed.ncbi.nlm.nih.gov/?term=acetylated+distarch+adipate
  - Data extracted:
    - Regulatory/safety anchor: EFSA opinion record (PMID 32625282): https://pubmed.ncbi.nlm.nih.gov/32625282/
    - Older toxicology signals: PMID 6890017 and PMID 2578187.
    - Recent records are mainly functionality papers (e.g., PMID 40684562) rather than new long-term human safety studies.

## Identity
- **E-number**: E1422 (INS 1422).
- **Name**: Acetylated distarch adipate.
- **CAS number(s)**: 68130-14-3.
- **Chemical class**: Chemically modified starch (cross-linked and acetylated starch derivative).
- **Common synonyms**: Acetylated adipate crosslinked starch; modified starch (INS 1422).
- **Origin**: **Semi-synthetic** (produced by chemically treating edible starch).

Evidence:
- WHO/JECFA entry for modified starches lists INS 1422 with CAS 68130-14-3 and synonym “Acetylated adipate crosslinked starch”.
- FAO/JECFA specification defines the additive as esterified adipic/acetic mixed anhydride derivative of edible starch.

## Function in Food
- **Primary technological role**: Thickener/stabilizer (also emulsifier in JECFA classification).
- **Mechanism**:
  - Cross-linking and acetyl substitution increase process tolerance (heat/shear/acid), reduce retrogradation, and improve freeze-thaw stability.
  - EFSA notes modified starches are not absorbed intact; they are hydrolyzed by intestinal enzymes and then fermented by gut microbiota.
- **Common food categories**:
  - Broadly authorized in the EU at quantum satis for many foods, with specific limits in infant/young-child categories.
  - Recent literature focuses on bakery/frozen dough and protein systems (technological functionality studies).

## Regulatory Status
### EFSA (EU)
- **Status**: Approved/authorized in the EU (within the modified starch group under Regulation (EC) No 1333/2008).
- **Latest re-evaluation**: 2017 (EFSA Journal 15(10):4911).
- **ADI**: No numerical ADI required (consistent with prior “ADI not specified” approach for the group).
- **Key conclusion**: No safety concern for reported uses/use levels in the general population.
- **Important caveat in same opinion**: EFSA identified data gaps for certain modified starch uses in specific FSMP infant/young-child categories (not a blanket ban of modified starches).

Access note:
- `https://www.efsa.europa.eu/en/efsajournal/pub/4911` was reached but redirects to a Wiley page that returned a 403 challenge from this environment. Data were extracted from the same EFSA opinion via PubMed/PMC open text.

### FDA / U.S. CFR
- **Status**: Regulated as an **approved food additive category** (“food starch-modified”), not as a standalone GRAS listing by additive name.
- **CFR citation**: **21 CFR 172.892** (Food starch-modified).
- **Conditions of use (relevant to E1422 chemistry)**:
  - Food starch-modified may be safely used in food.
  - For esterification route corresponding to acetylated distarch adipate: adipic anhydride (≤0.12%) with acetic anhydride; acetyl groups in finished food starch-modified not to exceed 2.5%.
  - Quantity used must not exceed that reasonably required for technical effect.

Access note:
- Human-readable eCFR section page was blocked by anti-bot challenge in this VM session; data were pulled from eCFR API XML and corroborated against the U.S. govinfo CFR PDF section.

### JECFA / WHO
- **Status**: Evaluated as a food additive (INS 1422).
- **ADI**: “Not specified”.
- **Evaluation year(s)**:
  - WHO/JECFA chemical page reports ADI entries with year 2016 (and older 1982), plus a 2018 specification-only entry.
  - FAO JECFA detailed page also lists Committee references/specification history.

### IARC
- **Classification**: No IARC monograph classification found for acetylated distarch adipate / CAS 68130-14-3 in the current IARC classifications dataset checked.

### Notable bans
- No major jurisdiction-wide ban identified in the reviewed EFSA/FDA/JECFA/IARC sources.

## Key Safety Evidence
### Animal studies
- Rat studies reported renal/pelvic mineralization (nephrocalcinosis-related findings) at high dietary modified-starch loads; EFSA interpreted these findings as linked to calcium/phosphorus/magnesium imbalance in rat diet models and not directly predictive of human risk at current uses.
- Reproductive toxicity datasets (group read-across including E1422) did not show adverse reproductive/developmental effects at very high dietary levels in the reviewed studies.

### Human and epidemiological data
- No strong E1422-specific epidemiological signal identified in PubMed.
- Recent PubMed records (2020–2025) are mostly **food technology/functionality** papers rather than chronic human safety outcome studies.

### Mechanistic concerns
- Genotoxicity concern: EFSA read-across/in silico assessment did not identify genotoxic concern for the modified starch group.
- Gastrointestinal tolerance: high-dose GI symptoms reported in some infant formula contexts in EFSA’s broader modified-starch discussion are largely centered on E1450 contexts, not a specific carcinogenic signal for E1422.

## Exposure Assessment
- **General population (EFSA group exposure for E1404–E1451)**: 95th percentile refined brand-loyal scenario up to **3,053 mg/kg bw/day** (toddlers) in EFSA’s 2017 assessment.
- **Special medical purpose infant scenarios (group-level modified starch context)**: higher modeled intakes were reported in specific FSMP scenarios; EFSA highlighted uncertainty/data gaps for some uses in vulnerable infant/young-child subgroups.
- **ADI exceedance risk for E1422 specifically**:
  - Because ADI is “not specified” / no numerical ADI, numeric exceedance framing is not directly applicable.
  - Available regulatory conclusions do not indicate a general-population safety concern at reported use levels.

## Risk Assessment
### 1. Tier-by-tier analysis
#### `risk_free`
- **Evidence supporting this tier**:
  - EFSA 2017: no safety concern at reported uses; no need for numerical ADI.
  - JECFA: ADI not specified.
  - No IARC carcinogenic classification found.
- **Evidence against this tier**:
  - Additive is a chemically modified ingredient (not an endogenous compound in its consumed form).
  - Historical high-dose animal findings (renal mineralization-related effects) require contextual interpretation.

#### `limited`
- **Evidence supporting this tier**:
  - EU and U.S. regulatory frameworks permit use with defined constraints/specifications.
  - JECFA/EFSA outcomes are broadly reassuring for intended uses.
  - PubMed search shows little indication of new serious hazard signals.
- **Evidence against this tier**:
  - Dedicated modern long-term human safety data specific to E1422 are sparse.

#### `moderate`
- **Evidence supporting this tier**:
  - Historical animal findings at high doses exist.
  - Some exposure-model uncertainty remains for vulnerable pediatric/medical-diet contexts within the broader modified starch group.
- **Evidence against this tier**:
  - Regulators did not reduce to a restrictive numeric ADI, and did not conclude general-population risk at current use levels.
  - No corroborating carcinogenic classification or major regulatory withdrawal.

#### `high`
- **Evidence supporting this tier**:
  - None identified from EFSA/JECFA/FDA/IARC sources reviewed.
- **Evidence against this tier**:
  - No major bans identified.
  - No IARC Group 2A/2B/1 classification for this additive.
  - Regulatory conclusions are permissive with conditions, not prohibition.

### 2. Rationale
The weight of evidence from current regulatory assessments is that E1422 belongs to a low-concern, regulated-use profile: approved/permitted with specification limits, ADI not specified/no numerical ADI, and no carcinogenic classification signal. The main caution is evidence depth (older toxicology backbone and limited new human outcome data specific to E1422).

### 3. Recommended tier
**`limited`**

## Sources
1. **EFSA Journal entry (2017), Re-evaluation of modified starches incl. E1422**. URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4911  
2. **PubMed/PMC full text of EFSA opinion (2017, PMID 32625282, PMCID PMC7009865)**. URL visited: https://pmc.ncbi.nlm.nih.gov/articles/PMC7009865/  
3. **PubMed record (EFSA opinion, PMID 32625282)**. URL visited: https://pubmed.ncbi.nlm.nih.gov/32625282/  
4. **eCFR API Title 21 full XML (up-to-date snapshot includes §172.892 text)**. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml  
5. **eCFR human-readable section page (§172.892; anti-bot challenge encountered in VM)**. URL visited: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-172/section-172.892  
6. **U.S. govinfo CFR PDF for 21 CFR 172.892**. URL visited: https://www.govinfo.gov/content/pkg/CFR-2015-title21-vol3/pdf/CFR-2015-title21-vol3-sec172-892.pdf  
7. **WHO/JECFA chemical page for acetylated distarch adipate (INS 1422)**. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/379  
8. **WHO/JECFA search result (shows ADI/evaluation-year entries for this additive)**. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Search?searchType=additives&name=acetylated%20distarch%20adipate  
9. **WHO/JECFA modified starches page (contains CAS/synonym context including INS 1422)**. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3409  
10. **FAO/JECFA additive details (INS 1422)**. URL visited: https://www.fao.org/food/food-safety-quality/scientific-advice/jecfa/jecfa-additives/details/en/c/379/  
11. **IARC Monographs list of classifications**. URL visited: https://monographs.iarc.who.int/list-of-classifications/  
12. **IARC classifications data bundle script (searched for E1422/CAS, no hit)**. URL visited: https://webapi.iarc.who.int/loc/loc.app.js  
13. **PubMed search (acetylated distarch adipate)**. URL visited: https://pubmed.ncbi.nlm.nih.gov/?term=acetylated+distarch+adipate  
14. **PubMed toxicology study (1982, PMID 6890017)**. URL visited: https://pubmed.ncbi.nlm.nih.gov/6890017/  
15. **PubMed digestibility study (1985, PMID 2578187)**. URL visited: https://pubmed.ncbi.nlm.nih.gov/2578187/  
16. **PubMed recent functionality study (2025, PMID 40684562)**. URL visited: https://pubmed.ncbi.nlm.nih.gov/40684562/
