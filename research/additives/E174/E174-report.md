# E174 (Silver) Research Report

## Identity
- **E-number:** E174
- **Name:** Silver (elemental/metallic silver)
- **CAS number(s):** 7440-22-4
- **Chemical class:** Elemental metal food colour (inorganic metallic pigment)
- **Common synonyms:** Silver, metallic silver, Argentum, INS 174, CI 77820
- **Natural vs synthetic:** Silver is a naturally occurring element, but food additive E174 is manufactured to specification (processed metallic silver used as decorative colour).

Evidence:
- PubChem synonym/CAS record for silver (CID 23954) lists CAS `7440-22-4` and common synonyms (PubChem, accessed 2026-02-27: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/23954/synonyms/JSON).
- JECFA silver entry identifies INS 174 and CAS 7440-22-4 (WHO JECFA database: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3411).
- FDA identity text for silver in CFR describes manufactured silver crystals from silver nitrate reduction (21 CFR 73.2500 via eCFR API: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=A&part=73&section=73.2500).

## Function in Food
- **Mechanism of action:** Metallic flakes/particles provide a reflective metallic appearance for surface decoration.
- **Common food categories (EU context):** external coating/decorative uses (e.g., confectionery/chocolate decoration and some liqueur decoration uses cited in EFSA re-evaluation text).

Evidence:
- EFSA re-evaluation text references use as external coating/decorative applications and discusses exposure implications from these limited uses (EFSA Journal page for 2016 opinion: https://www.efsa.europa.eu/en/efsajournal/pub/4364).
- Studies on E174-containing confectionery show silver flakes with nanoparticle fractions in additive/products, consistent with decorative particulate use (De Vos et al., 2020: https://pubmed.ncbi.nlm.nih.gov/32946346/).

## Regulatory Status
### EFSA (EU)
- **Status:** Approved in the EU list as a food colour but with major scientific uncertainty in recent reassessment.
- **Latest EFSA outputs located:**
  - Re-evaluation (2016): EFSA reported it was **not possible to establish a numerical ADI** because of insufficient data (including particle-size characterization and toxicology gaps).
  - Follow-up (2025): EFSA FAF concluded submitted data were inadequate and it **could not conclude on safety** of E174; EFSA stated nanoscale risk assessment is needed.
- **ADI:** No numerical ADI established.
- **Evaluation years:** 2016 (re-evaluation), 2025 (follow-up).

Evidence:
- EFSA Journal page 2016 re-evaluation (E174): https://www.efsa.europa.eu/en/efsajournal/pub/4364
- EFSA Journal page 2025 follow-up (E174): https://www.efsa.europa.eu/en/efsajournal/pub/9316
- PubMed indexed abstract for 2025 EFSA follow-up (states data inadequacy and inability to conclude safety): https://pubmed.ncbi.nlm.nih.gov/40270597/

Note on access:
- Direct `curl` access to EFSA Wiley full-text endpoints in this environment returned a Cloudflare challenge page. I used EFSA landing pages plus PubMed-indexed EFSA abstract for extractable conclusions.

### FDA / CFR (United States)
- **GRAS status for food use:** No GRAS listing for silver as a direct food substance found in 21 CFR Parts 182 or 184.
- **Specific CFR citation found for silver:** **21 CFR 73.2500** (Silver), under **Part 73 Subpart C (Cosmetics)**.
- **Conditions of use in CFR section found:** silver may be used for coloring fingernail polish up to 1% of final product; exempt from certification under that section.
- **Food-use implication:** the located silver listing is cosmetic, not a food GRAS approval.

Evidence:
- eCFR API section text for 21 CFR 73.2500: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=A&part=73&section=73.2500
- eCFR API Part 73 structure showing Subpart A (Foods) and Subpart C (Cosmetics), with silver at 73.2500 in Subpart C: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=A&part=73
- eCFR API GRAS parts checked (no silver entries found):
  - https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=B&part=182
  - https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=B&part=184

Note on access:
- Direct HTML browsing to `ecfr.gov/current/...` returned anti-bot blocking. I used official eCFR developer API endpoints.

### JECFA / WHO
- **ADI:** No numeric ADI allocated for silver in the JECFA record; historical entry shows **"Decision postponed"** (1977).
- **Last evaluation year shown in database:** 2018 entry notes silver was not re-evaluated by JECFA and that provisions were withdrawn at CCFA50.

Evidence:
- WHO JECFA chemical page for SILVER (ID 3411): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3411
- WHO JECFA search API query used to resolve silver entry ID: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/silver

### IARC
- **IARC classification for silver (as food additive E174):** No specific silver agent entry was identified in the IARC classifications dataset queried.
- This indicates no explicit IARC Group classification was found for silver/E174 in the retrieved IARC Monographs list dataset.

Evidence:
- IARC classification pages:
  - https://monographs.iarc.who.int/agents-classified-by-the-iarc/
  - https://monographs.iarc.who.int/list-of-classifications
- IARC data bundle used by classification table (searched for "silver"; no entry found): https://webapi.iarc.who.int/loc/loc.app.js

### Notable bans
- No clear major-jurisdiction blanket ban was confirmed from the sources above.
- Regulatory posture appears fragmented: EU authorization with unresolved EFSA safety uncertainties; no U.S. food GRAS listing identified in CFR search.

## Key Safety Evidence
### Animal studies / toxicology
- EFSA 2025 follow-up states additional genotoxicity and subchronic data provided were inadequate, and EFSA could not conclude on safety (EFSA FAF, 2025: https://pubmed.ncbi.nlm.nih.gov/40270597/).
- Review evidence covering nanoparticle-containing additives including E174 reports associations with gastrotoxicity/hepatotoxicity patterns and oxidative stress hypotheses after oral exposure models (Medina-Reyes et al., 2020: https://pubmed.ncbi.nlm.nih.gov/33068655/).

### Exposure/material characterization evidence
- Commercial E174 and E174-containing confectionery were shown to include nanoparticle fractions; in one study, nano-sized particles represented >97% by number while most mass remained in flakes (De Vos et al., 2020: https://pubmed.ncbi.nlm.nih.gov/32946346/).
- Earlier work showed release of silver nanoparticles from pastry decoration products in simple water treatment conditions (Verleysen et al., 2015: https://pubmed.ncbi.nlm.nih.gov/25768118/).

### Mechanistic concerns
- Oral nanoparticle-intestine interaction literature highlights gut barrier/microbiota interaction concerns and identifies E174 among additives needing consideration for accidental/uncontrolled exposure concerns (Vitulo et al., 2022: https://pubmed.ncbi.nlm.nih.gov/35457155/).

### Epidemiological data
- I did not identify strong human epidemiological studies directly linking dietary E174 exposure to clinical outcomes in the retrieved set. The evidence base is dominated by characterization, mechanistic, and toxicology/review literature.

## Exposure Assessment
- **Typical dietary intake:** robust current quantitative intake estimates specific to E174 were not identified from the retrieved primary regulatory records.
- **ADI exceedance risk:** not directly quantifiable because EFSA did not establish a numerical ADI and later could not conclude on safety.
- **At-risk populations:** children/high consumers of decorated confectionery are a plausible concern subgroup because of higher intake per body weight and unresolved nanoparticle-related uncertainties noted by EFSA.
- **Key uncertainty driver:** inadequate characterization of market-representative E174 particle morphology/size distribution and insufficient toxicity package for current specifications.

## Risk Assessment
1. **Tier-by-tier analysis**
- **risk_free**
  - Evidence supporting this tier: historically limited/decorative use context and no formal major-jurisdiction blanket ban confirmed.
  - Evidence against this tier: EFSA (2016) could not derive ADI; EFSA (2025) could not conclude safety; nanoparticle-related uncertainties remain central.
- **limited**
  - Evidence supporting this tier: additive remains listed/used in EU context and U.S. CFR does not classify it as outright banned.
  - Evidence against this tier: multiple authoritative assessments identify insufficient data and unresolved nanoscale risk questions, stronger than “minor concerns only at high doses.”
- **moderate**
  - Evidence supporting this tier: additive is used/authorized in some contexts but with caveats; credible mechanistic/animal concern signals and major data gaps exist.
  - Evidence against this tier: EFSA’s 2025 inability to conclude safety may indicate risk-management uncertainty beyond a typical moderate profile.
- **high**
  - Evidence supporting this tier: EFSA explicitly unable to conclude safety in latest follow-up; JECFA record does not provide a positive ADI determination and notes withdrawn provisions context.
  - Evidence against this tier: absence of direct IARC 2A/2B classification and lack of a clearly documented global ban for E174.

2. **Rationale**
- The deciding factors are (a) no established ADI from EFSA, (b) latest EFSA follow-up unable to conclude safety due inadequate data, and (c) persistent nanoparticle characterization/toxicology uncertainty in real-use materials. These outweigh the fact that E174 still appears in some regulatory use lists.

3. **Recommended tier**
- **high**

## Sources
- EFSA Panel on Food Additives and Nutrient Sources added to Food (ANS), *Re-evaluation of silver (E 174) as food additive*, 2016, EFSA Journal page: https://www.efsa.europa.eu/en/efsajournal/pub/4364
- EFSA Panel on Food Additives and Flavourings (FAF), *Follow-up of the re-evaluation of silver (E 174) as a food additive (EFSA-Q-2023-00169)*, 2025, EFSA Journal page: https://www.efsa.europa.eu/en/efsajournal/pub/9316
- EFSA FAF (PubMed indexed record for same 2025 opinion, PMID 40270597): https://pubmed.ncbi.nlm.nih.gov/40270597/
- eCFR developer docs (API used due anti-bot blocking on HTML): https://www.ecfr.gov/developers/documentation/api/v1
- eCFR API Title 21 section 73.2500 (Silver): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=A&part=73&section=73.2500
- eCFR API Title 21 Part 73 (subparts and section placement): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=A&part=73
- eCFR API Title 21 Part 182 (GRAS substances): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=B&part=182
- eCFR API Title 21 Part 184 (direct food substances affirmed as GRAS): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?chapter=I&subchapter=B&part=184
- WHO JECFA database home: https://apps.who.int/food-additives-contaminants-jecfa-database/
- WHO JECFA SILVER record (ID 3411): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3411
- WHO JECFA API search used to resolve silver entry: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/silver
- IARC Monographs home: https://monographs.iarc.who.int/
- IARC agents classified page: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
- IARC list-of-classifications page: https://monographs.iarc.who.int/list-of-classifications
- IARC list data bundle: https://webapi.iarc.who.int/loc/loc.app.js
- Medina-Reyes EI et al., *Food additives containing nanoparticles induce gastrotoxicity...*, 2020, Food Chem Toxicol, PMID 33068655: https://pubmed.ncbi.nlm.nih.gov/33068655/
- De Vos S et al., *Physico-chemical characterisation of the fraction of silver (nano)particles...*, 2020, Food Addit Contam A, PMID 32946346: https://pubmed.ncbi.nlm.nih.gov/32946346/
- Verleysen E et al., *TEM and SP-ICP-MS analysis of the release of silver nanoparticles from decoration of pastry*, 2015, J Agric Food Chem, PMID 25768118: https://pubmed.ncbi.nlm.nih.gov/25768118/
- Vitulo M et al., *Interactions between Nanoparticles and Intestine*, 2022, Int J Mol Sci, PMID 35457155: https://pubmed.ncbi.nlm.nih.gov/35457155/
- PubChem PUG REST Silver synonyms/CAS (CID 23954): https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/23954/synonyms/JSON
