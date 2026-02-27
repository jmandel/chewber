# E160c (Paprika extract) - Research Report

## Step 1 - Data Collection Log (real web data)
| Source | URL visited | Data extracted |
|---|---|---|
| EFSA (primary page) | https://www.efsa.europa.eu/en/efsajournal/pub/4320 | Page identified as the relevant EFSA opinion endpoint for E160c; direct full content was blocked by anti-bot checks in this VM. |
| EFSA (DOI metadata fallback) | https://doi.org/10.2903/j.efsa.2015.4320 | EFSA 2015 re-evaluation abstract text: ADI 24 mg/kg bw/day (also 1.7 mg carotenoids/kg bw/day equivalent), no genotoxic concern, not carcinogenic at tested doses, refined scenarios below ADI. |
| FDA/eCFR (Paprika oleoresin) | https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.345 | `21 CFR 73.345`: color additive permitted for foods generally under GMP, restrictions for standards of identity, exempt from certification. |
| FDA/eCFR (Paprika) | https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.340 | `21 CFR 73.340`: similar color additive permission/restrictions and certification exemption language. |
| FDA/eCFR (GRAS list) | https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=182.20 | `21 CFR 182.20`: paprika/capsicum listed among GRAS essential oils/oleoresins (solvent-free)/natural extractives for intended uses. |
| JECFA/WHO database | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866 | ADI 0-1.5 mg/kg bw, last evaluation year 2014, intake estimate 0.1-0.2 mg/kg bw/day at 95th percentile and no health concern conclusion; historical 2008 note also visible. |
| IARC classifications page | https://monographs.iarc.who.int/list-of-classifications/ | Classification interface located. |
| IARC data feed used by page | https://webapi.iarc.who.int/loc/loc.app.js | No entries found for paprika extract/capsanthin/capsorubin/capsicum terms in current list dataset. |
| PubMed search page | https://pubmed.ncbi.nlm.nih.gov/?term=%28paprika+extract%29+AND+%28toxicity+OR+safety%29&sort=date | Recent literature search run for paprika extract safety/toxicity. |
| PubMed study page | https://pubmed.ncbi.nlm.nih.gov/35284242/ | 2022 90-day rat oral toxicity study; NOAEL > 2000 mg/kg bw/day. |
| PubMed study page | https://pubmed.ncbi.nlm.nih.gov/29367485/ | 2018 human 12-week supplementation study; no adverse events at 20/100 mg/day. |
| PubMed study page | https://pubmed.ncbi.nlm.nih.gov/40198579/ | 2025 cohort study: additive mixtures including paprika extract associated with increased T2D incidence (observational, mixture-level). |

## Identity
- E-number: E160c.
- Primary name: Paprika extract (capsanthin, capsorubin).
- Chemical class: Natural carotenoid/xanthophyll-rich extract from *Capsicum annuum* fruits.
- Common synonyms: Paprika extract, paprika oleoresin, capsanthin, capsorubin.
- CAS numbers: E160c is a mixture and no single CAS was clearly provided in the consulted regulatory entries; principal carotenoids include capsanthin (CAS 465-42-9) and capsorubin (CAS 470-38-2) from PubChem.
- Natural vs synthetic: Natural extract (solvent extraction of paprika).

Sources:
- Commission Regulation (EU) No 231/2012 (consolidated): https://eur-lex.europa.eu/eli/reg/2012/231/2025-01-01/eng
- JECFA additive entry (PAPRIKA extract): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866
- PubChem capsanthin/capsorubin records (via PUG REST):
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/capsanthin/cids/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5281228/synonyms/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/capsorubin/cids/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5281229/synonyms/TXT

## Function in Food
- Mechanism of action: E160c supplies red-orange carotenoid pigments (mainly capsanthin/capsorubin) that absorb shorter wavelengths and impart color to foods.
- Common food categories: Processed foods using natural red/orange coloring (e.g., sauces, snacks, seasonings, processed meats, beverages, confectionery), depending on jurisdictional permissions and category limits.
- U.S. functional framing: FDA treats paprika/paprika oleoresin as color additives exempt from certification for food coloring uses under GMP constraints.

Sources:
- 21 CFR 73.340 (Paprika): https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.340
- 21 CFR 73.345 (Paprika oleoresin): https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.345

## Regulatory Status

### EFSA (EU)
- Latest scientific re-evaluation identified: EFSA Journal opinion (2015), DOI `10.2903/j.efsa.2015.4320`.
- Approval status: Approved in EU food additive legislation (E160c listed in Regulation (EC) No 1333/2008 consolidated text).
- ADI: 24 mg/kg bw/day for paprika extract; EFSA also expressed this as 1.7 mg carotenoids/kg bw/day.
- Key conclusions (from DOI metadata abstract): no genotoxic concern; not carcinogenic at tested doses; refined exposure scenarios below ADI.
- Access note: direct EFSA/Wiley full page was blocked by anti-bot checks from this VM, but DOI metadata returned EFSA abstract and key values.

Sources:
- EFSA journal page (blocked during direct access): https://www.efsa.europa.eu/en/efsajournal/pub/4320
- DOI metadata query used: https://doi.org/10.2903/j.efsa.2015.4320
- EU authorization list (E160c present): https://eur-lex.europa.eu/eli/reg/2008/1333/2025-09-26/eng

### FDA / CFR (U.S.)
- Color additive status: Approved/exempt from certification for coloring foods.
- CFR citation and use conditions:
  - `21 CFR 73.345` (Paprika oleoresin): may be used for coloring foods generally in amounts consistent with GMP; not permitted in foods with a standard of identity unless authorized by that standard; exempt from batch certification.
  - `21 CFR 73.340` (Paprika): similar color-use language and exemption from certification.
- GRAS context:
  - `21 CFR 182.20` lists paprika/capsicum among essential oils, oleoresins (solvent-free), and natural extractives generally recognized as safe for intended use (flavor-type context).

Sources:
- https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.345
- https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.340
- https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=182.20

### JECFA / WHO
- Additive record: PAPRIKA extract (INS 160c).
- ADI: 0-1.5 mg/kg bw (as total carotenoids basis in the JECFA entry).
- Last evaluation year: 2014.
- Intake conclusion in record: 95th percentile estimate 0.1-0.2 mg/kg bw/day (based on 60 kg) and concluded no health concern at assessed intakes.
- Historical note: 2008 entry showed "NO ADI ALLOCATED" pending representativeness/specification concerns; 2014 evaluation superseded this.

Source:
- https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866

### IARC
- No explicit IARC Group classification entry for paprika extract / capsanthin / capsorubin was found in the IARC "List of classifications" dataset.
- Checked both the classifications page and its JS data feed.

Sources:
- https://monographs.iarc.who.int/list-of-classifications/
- https://webapi.iarc.who.int/loc/loc.app.js

### Notable bans
- No major-jurisdiction ban identified in the checked EU/U.S./JECFA/IARC sources.

## Key Safety Evidence
- Regulatory toxicology core:
  - EFSA re-evaluation reported no genotoxic concern and no carcinogenicity at tested doses; ADI established (2015).
  - JECFA (2014) reported pivotal rat studies (90-day and chronic/carcinogenicity) without adverse effects at tested levels and set ADI 0-1.5 mg/kg bw.
- Recent animal data:
  - 2022 rat 90-day oral study of capsanthin-rich saponified *Capsicum annuum* extract found NOAEL > 2000 mg/kg bw/day.
- Human data:
  - 2018 double-blind placebo-controlled supplementation study (20 or 100 mg/day paprika oleoresin for 12 weeks) reported no adverse events in healthy adults.
- Emerging epidemiology signal (non-specific to E160c alone):
  - 2025 NutriNet-Sante cohort reported higher type 2 diabetes incidence with some additive mixtures including paprika extract; observational, mixture-level, and non-causal.

Sources:
- EFSA DOI metadata abstract: https://doi.org/10.2903/j.efsa.2015.4320
- JECFA record: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866
- PubMed 2022 toxicity study: https://pubmed.ncbi.nlm.nih.gov/35284242/
- PubMed 2018 human supplementation study: https://pubmed.ncbi.nlm.nih.gov/29367485/
- PubMed 2025 additive-mixtures cohort study: https://pubmed.ncbi.nlm.nih.gov/40198579/

## Exposure Assessment
- JECFA record reports high-percentile dietary exposure estimate of 0.1-0.2 mg/kg bw/day, below JECFA ADI (0-1.5 mg/kg bw/day).
- EFSA abstract reports refined exposure scenarios below EFSA ADI.
- ADI exceedance risk from consulted sources: not indicated for refined scenarios.
- Potentially vulnerable populations: high consumers of heavily colored ultra-processed products remain the practical subgroup to monitor, but direct exceedance evidence was not found in the gathered primary assessments.

Sources:
- https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866
- https://doi.org/10.2903/j.efsa.2015.4320

## Risk Assessment

### 1. Tier-by-tier analysis

#### risk_free
- Evidence supporting `risk_free`:
  - Natural food-derived carotenoid extract.
  - EFSA/JECFA did not identify genotoxic/carcinogenic concern at assessed conditions.
  - Refined/intended-use exposure estimates were below ADIs.
- Evidence arguing against `risk_free`:
  - ADI is finite (not "ADI not specified").
  - Extract composition can vary; solvent/process specifications are important.
  - Some toxicology endpoints used read-across historically (not a perfect full dataset).

#### limited
- Evidence supporting `limited`:
  - Explicit regulatory acceptance in EU and U.S. frameworks.
  - ADIs set by EFSA and JECFA with exposure estimates generally below those limits.
  - No strong direct human or animal hazard signal at realistic intakes in reviewed sources.
- Evidence arguing against `limited`:
  - Mixture-level epidemiology suggests additive combinations could still be relevant for chronic disease risk, though non-causal and non-specific.

#### moderate
- Evidence supporting `moderate`:
  - Observational mixture study (2025) includes paprika extract in a mixture associated with higher type 2 diabetes incidence.
  - Dataset gaps remain versus ideal modern toxicology package for all extract variants.
- Evidence arguing against `moderate`:
  - No direct regulatory downgrading/ADI reduction signal found.
  - EFSA/JECFA conclusions remain favorable at assessed uses.
  - No IARC carcinogenic group assignment found for paprika extract.

#### high
- Evidence supporting `high`:
  - No strong supporting evidence identified.
- Evidence arguing against `high`:
  - Not banned in checked major frameworks.
  - No IARC Group 1/2A/2B listing identified for paprika extract.
  - Regulatory bodies did not conclude inability to establish safe intake under current assessments.

### 2. Rationale
The weight of evidence is regulatory-positive with established ADIs, favorable refined exposure estimates, and no consistent direct hazard signal for paprika extract at intended food additive use levels. Residual uncertainty remains around additive-mixture effects and product heterogeneity, but current evidence does not justify escalation beyond a limited-risk category.

### 3. Recommended tier
`limited`

## Sources
- EFSA Journal page: Scientific Opinion on the re-evaluation of paprika extract (E 160c), 2015, https://www.efsa.europa.eu/en/efsajournal/pub/4320
- DOI metadata for EFSA opinion (contains abstract with ADI/conclusions), 2015, https://doi.org/10.2903/j.efsa.2015.4320
- Regulation (EC) No 1333/2008 (consolidated), EU list includes E160c, 2008 (consolidated text accessed 2026), https://eur-lex.europa.eu/eli/reg/2008/1333/2025-09-26/eng
- Regulation (EU) No 231/2012 specifications (consolidated), identity/specification text for paprika extract, 2012 (consolidated text accessed 2026), https://eur-lex.europa.eu/eli/reg/2012/231/2025-01-01/eng
- eCFR `21 CFR 73.345` Paprika oleoresin, accessed 2026, https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.345
- eCFR `21 CFR 73.340` Paprika, accessed 2026, https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=73.340
- eCFR `21 CFR 182.20` GRAS natural extractives list, accessed 2026, https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-21?section=182.20
- JECFA database entry: PAPRIKA extract (INS 160c), last eval 2014, https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5866
- IARC classifications page, accessed 2026, https://monographs.iarc.who.int/list-of-classifications/
- IARC classifications data bundle, last update visible in file, accessed 2026, https://webapi.iarc.who.int/loc/loc.app.js
- PubMed: 90-day toxicity study (PMID 35284242), 2022, https://pubmed.ncbi.nlm.nih.gov/35284242/
- PubMed: paprika oleoresin supplementation safety (PMID 29367485), 2018, https://pubmed.ncbi.nlm.nih.gov/29367485/
- PubMed: food additive mixtures and type 2 diabetes (PMID 40198579), 2025, https://pubmed.ncbi.nlm.nih.gov/40198579/
- PubChem capsanthin/capsorubin identifiers, accessed 2026:
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/capsanthin/cids/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5281228/synonyms/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/capsorubin/cids/TXT
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5281229/synonyms/TXT
