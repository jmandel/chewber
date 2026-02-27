# E301 (Sodium ascorbate) — Research Report

## Data Collection Log (Step 1)

### 1) EFSA (efsa.europa.eu)
- URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4087
- Result: page was reachable but only returned a redirect to Wiley (`https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2015.4087`), which was blocked by anti-bot controls in this environment.
- Backup URL visited for the same EFSA opinion metadata: https://doi.org/10.2903/j.efsa.2015.4087 (queried with CSL JSON accept header).
- Data extracted:
  - EFSA food-additive re-evaluation title: *Scientific Opinion on the re-evaluation of ascorbic acid (E 300), sodium ascorbate (E 301) and calcium ascorbate (E 302) as food additives*.
  - Evaluation year: 2015.
  - Key conclusion: no safety concern at reported uses/use levels.
  - ADI conclusion: no need for a numerical ADI for ascorbic acid and its salts.

### 2) FDA / eCFR (Title 21)
- Direct web page URLs were blocked, so official eCFR API endpoints were used.
- URLs visited:
  - https://www.ecfr.gov/api/versioner/v1/full/2025-09-25/title-21.xml?chapter=I&part=182
  - https://www.ecfr.gov/api/versioner/v1/full/2025-09-25/title-21.xml?chapter=I&part=582
- Data extracted:
  - `21 CFR 182.3731` (human food): Sodium ascorbate is listed under substances generally recognized as safe (GRAS) when used in accordance with good manufacturing practice.
  - `21 CFR 582.3731` (animal food/feed): Sodium ascorbate is GRAS when used in accordance with good manufacturing or feeding practice.

### 3) JECFA / WHO
- URLs visited:
  - https://apps.who.int/food-additives-contaminants-jecfa-database/
  - https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/sodium%20ascorbate
  - https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2372
- Data extracted:
  - Substance record: SODIUM ASCORBATE, INS 301, CAS 134-03-2.
  - ADI: NOT SPECIFIED.
  - Evaluation year shown: 1981.
  - Comment: group ADI for ascorbic acid and sodium/potassium/calcium salts.

### 4) IARC
- URLs visited:
  - https://monographs.iarc.who.int/agents-classified-by-the-iarc/
  - https://monographs.iarc.who.int/list-of-classifications
  - https://webapi.iarc.who.int/loc/loc.app.js
- Data extracted:
  - No listing found for “sodium ascorbate”, “ascorbate”, or CAS 134-03-2 in the IARC classification dataset loaded by the official list page.
  - Practical interpretation: no IARC group classification identified for sodium ascorbate.

### 5) PubMed (recent safety studies)
- URLs visited:
  - https://pubmed.ncbi.nlm.nih.gov/41501013/
  - https://pubmed.ncbi.nlm.nih.gov/29471778/
  - https://pubmed.ncbi.nlm.nih.gov/30902302/
  - (plus NCBI E-utilities fetch/search endpoints)
- Data extracted:
  - 2026 cohort study (NutriNet-Santé) reported higher type 2 diabetes incidence associations for several preservatives including sodium ascorbate (observational design).
  - 2018 rat bladder-promotion model found sodium ascorbate did **not** increase bladder papillomas/TCC in initiated rats; hyperplasia incidence decreased versus vehicle.
  - 2019 meat study found sodium ascorbate reduced residual nitrite and influenced nitrosamine formation patterns.

## Identity
- **E-number**: E301
- **Name**: Sodium ascorbate
- **CAS number(s)**: 134-03-2 (primary; additional registry numbers appear in PubChem cross-references)
- **Chemical class**: Sodium salt of L-ascorbic acid (vitamin C derivative); antioxidant/reducing agent
- **Common synonyms**: Sodium L-ascorbate, L-ascorbic acid sodium salt, vitamin C sodium salt, INS 301
- **Natural vs synthetic**: **Semi-synthetic / industrially manufactured salt form** of a naturally occurring vitamin (ascorbic acid).

## Function in Food
- **Primary role**: Antioxidant/reducing agent.
- **Mechanism**:
  - Scavenges oxidants and helps limit oxidative deterioration.
  - In cured-meat contexts, lowers residual nitrite and can reduce formation of some nitrosamines under certain formulations/process conditions.
- **Common food categories**:
  - Processed/cured meats (well-documented in the literature).
  - Broader direct food use is permitted in the U.S. under GMP (no single narrow category in `21 CFR 182.3731`).

## Regulatory Status
- **EFSA (EU)**:
  - Status: Approved food additive (re-evaluated).
  - Opinion/year: EFSA ANS Panel re-evaluation published in 2015.
  - ADI: No numerical ADI considered necessary.
  - Key conclusion: No safety concern at reported uses and use levels.
  - Note: A newer 2025 EFSA FEEDAP opinion concerns animal feed additive renewal (not the core E-number food-additive re-evaluation).
- **FDA / eCFR (U.S.)**:
  - Status: GRAS.
  - Citation: `21 CFR 182.3731` (food), `21 CFR 582.3731` (animal feed).
  - Conditions of use: In accordance with good manufacturing practice (and feeding practice for feed).
- **JECFA/WHO**:
  - ADI: NOT SPECIFIED (group ADI context for ascorbic acid and relevant salts).
  - Last evaluation year shown in the WHO JECFA record: 1981.
- **IARC**:
  - No IARC Group 1/2A/2B/3 listing identified for sodium ascorbate.
- **Notable bans/restrictions**:
  - No major jurisdictional ban identified in EU/US/JECFA sources reviewed.

## Key Safety Evidence
- **Regulatory toxicology (EFSA 2015)**:
  - No genotoxicity concern.
  - Long-term data did not indicate carcinogenicity concern.
  - No adverse developmental effects highlighted in reviewed data.
- **Animal evidence (2018, rat model)**:
  - In a two-stage bladder carcinogenesis model, sodium ascorbate (5% dietary) did not promote papillomas/TCC and reduced urothelial hyperplasia incidence versus control.
- **Mechanistic/process evidence (2019 food system)**:
  - Sodium ascorbate decreased residual nitrite and modulated nitrosamine outcomes in fermented sausage experiments.
- **Recent epidemiology signal (2026 cohort)**:
  - Sodium ascorbate exposure (within preservative analyses) associated with higher type 2 diabetes incidence in one large observational cohort.
  - Important caveat: observational association is not proof of causality; co-exposures and dietary pattern confounding remain plausible.

## Exposure Assessment
- EFSA evaluated combined exposure to ascorbic acid and salts and still concluded no safety concern at reported uses/use levels.
- Because EFSA and JECFA do not require a numerical ADI for this group, classic “ADI exceedance” calculations are generally not applied in the same way as for additives with numeric ADIs.
- Current uncertainty is driven more by emerging observational epidemiology (diet-pattern linked) than by established toxicological threshold exceedance.
- **Potentially more relevant populations for follow-up**:
  - High consumers of preservative-rich ultra-processed foods (for epidemiologic signal tracking), rather than populations identified for toxicological ADI exceedance.

## Risk Assessment
### 1. Tier-by-tier analysis
- **risk_free**
  - Supporting evidence:
    - EFSA concluded no need for numerical ADI and no safety concern at reported uses.
    - JECFA ADI is “not specified”.
    - No IARC carcinogenic classification found.
  - Evidence against:
    - A recent large cohort reported a positive association with type 2 diabetes incidence for sodium ascorbate exposure.
- **limited**
  - Supporting evidence:
    - FDA GRAS status under GMP.
    - EFSA/JECFA positions are broadly reassuring.
    - Animal study did not show tumor-promotion signal.
  - Evidence against:
    - Epidemiological signal warrants monitoring and replication.
- **moderate**
  - Supporting evidence:
    - Human observational association suggests potential concern in real-world additive mixtures/diets.
  - Evidence against:
    - No aligned regulatory downgrade, no ADI reduction, no consistent mechanistic hazard package indicating material risk at permitted uses.
- **high**
  - Supporting evidence:
    - None identified.
  - Evidence against:
    - No major bans found, no IARC Group 2A/2B signal for sodium ascorbate, and no EFSA/JECFA finding of unresolved major safety concern.

### 2. Rationale
The strongest regulatory datasets (EFSA, JECFA, FDA/eCFR) remain reassuring for permitted use conditions, including absence of a need for a numerical ADI and GRAS status under GMP. However, newer observational epidemiology (2026 cohort) introduces a non-trivial but not yet causal signal that argues against calling the additive fully “risk_free” without qualification.

### 3. Recommended tier
- **Recommended tier: limited**

## Sources
1. **EFSA Journal opinion metadata (2015)** — *Scientific Opinion on the re-evaluation of ascorbic acid (E 300), sodium ascorbate (E 301) and calcium ascorbate (E 302) as food additives* (EFSA Journal, 2015). URL visited: https://doi.org/10.2903/j.efsa.2015.4087
2. **EFSA landing page** — EFSA Journal publication page for article 4087. URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4087
3. **eCFR API (Title 21, Part 182)** — includes `21 CFR 182.3731 Sodium ascorbate`. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2025-09-25/title-21.xml?chapter=I&part=182
4. **eCFR API (Title 21, Part 582)** — includes `21 CFR 582.3731 Sodium ascorbate`. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2025-09-25/title-21.xml?chapter=I&part=582
5. **WHO JECFA database chemical page** — Sodium ascorbate (ID 2372), ADI and evaluation year. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2372
6. **WHO JECFA API search endpoint** — Sodium ascorbate record and ADI “NOT SPECIFIED”. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/sodium%20ascorbate
7. **IARC classifications landing** — Agents classified by IARC Monographs. URL visited: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
8. **IARC list of classifications page** — front-end classification interface. URL visited: https://monographs.iarc.who.int/list-of-classifications
9. **IARC classification dataset script** — includes full agent list used by the classification page. URL visited: https://webapi.iarc.who.int/loc/loc.app.js
10. **PubMed (2026 cohort)** — Hasenböhler et al., *Nat Commun* 2026;16:11199. URL visited: https://pubmed.ncbi.nlm.nih.gov/41501013/
11. **PubMed (2018 rat model)** — Tirmenstein et al., *Toxicol Pathol* 2018;46(2):147-157. URL visited: https://pubmed.ncbi.nlm.nih.gov/29471778/
12. **PubMed (2019 food-system study)** — Sallan et al., *Food Chem* 2019;288:341-346. URL visited: https://pubmed.ncbi.nlm.nih.gov/30902302/
13. **PubChem compound record** — Sodium ascorbate identity/synonyms/CAS cross-references. URL visited: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/sodium%20ascorbate/property/Title,MolecularFormula,MolecularWeight,IUPACName/JSON
14. **PubChem synonyms endpoint** — synonym list including INS 301 terms. URL visited: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/sodium%20ascorbate/synonyms/JSON
