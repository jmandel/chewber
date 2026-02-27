# E170 (Calcium carbonate) - Research Report

## Data Extraction Log (Step 1)
| Source | URL visited | Specific data extracted |
|---|---|---|
| EFSA latest follow-up opinion | https://www.efsa.europa.eu/en/efsajournal/pub/8106 | 2023 follow-up; no numerical ADI needed for calcium carbonate per se; no safety concern per se at reported uses (including infants <16 weeks); aluminium impurity concern/spec update need. |
| EFSA prior re-evaluation | https://www.efsa.europa.eu/en/efsajournal/pub/2318 | 2011 re-evaluation context; no numerical ADI approach and low concern for calcium carbonate itself; exposure discussion and high total-calcium caveat. |
| EFSA access attempt (search endpoint) | https://www.efsa.europa.eu/en/search?search_api_fulltext=calcium%20carbonate%20E170 | In this environment, blocked by robots/anti-bot page; conclusions were cross-checked with PubMed EFSA records. |
| eCFR (GRAS section) | https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?section=184.1191 | Calcium carbonate listed in 21 CFR 184.1191; cGMP condition: no limitation other than current good manufacturing practice. |
| eCFR (GRAS part heading) | https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?part=184 | Part heading confirms “Direct food substances affirmed as generally recognized as safe”. |
| eCFR (color additive section) | https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?section=73.70 | Food color use restrictions and exemption from certification for calcium carbonate. |
| eCFR web UI access attempt | https://www.ecfr.gov/current/title-21/section-184.1191 | Blocked by anti-bot/captcha page; API used as official fallback. |
| JECFA/WHO record | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/457 | ADI “NOT LIMITED”; evaluation year 1965; CAS 471-34-1; synonym “Chalk”; INS 170(i). |
| IARC classifications page | https://monographs.iarc.who.int/list-of-classifications/ | Classification portal checked; used with app dataset query for agent presence. |
| IARC classification dataset | https://webapi.iarc.who.int/loc/loc.app.js | No “calcium carbonate” entry found in current IARC classification dataset. |
| PubMed EFSA 2023 record | https://pubmed.ncbi.nlm.nih.gov/37522100/ | Confirms EFSA 2023 conclusions (no numerical ADI for calcium carbonate per se, aluminium impurity concern). |
| PubMed EFSA nano-PCC record | https://pubmed.ncbi.nlm.nih.gov/35228849/ | Nano precipitated calcium carbonate safety context and caveats in food-contact applications. |
| PubMed CVD meta-analysis (2023) | https://pubmed.ncbi.nlm.nih.gov/37181938/ | No significant excess CHD/stroke risk for calcium supplementation in pooled RCT analysis. |
| PubMed CVD meta-analysis (2021) | https://pubmed.ncbi.nlm.nih.gov/33530332/ | Reported increased CVD/CHD risk signal in healthy postmenopausal women in included RCTs. |

## Identity
- **E-number:** E170 (specifically INS 170(i) in JECFA).
- **Primary name:** Calcium carbonate.
- **CAS number(s):** 471-34-1.
- **Chemical class:** Inorganic carbonate salt (alkaline earth metal carbonate).
- **Common synonyms:** Chalk; limestone (ground); precipitated calcium carbonate; INS 170(i).
- **Natural vs synthetic:** Both natural and synthetic manufacturing routes are described in regulation (ground limestone or precipitation processes).

Evidence:
- JECFA chemical record lists **Calcium carbonate**, **CAS 471-34-1**, **synonym: Chalk**, **INS 170(i)**, functional class including **ANTICAKING_AGENT**. [S6]
- 21 CFR 184.1191 and 21 CFR 73.70 describe production via precipitation and naturally occurring limestone grinding. [S3][S5]

## Function in Food
- **Primary functional role:** Anticaking agent. [S6]
- **Additional role:** White color additive in specified foods/supplements in the US. [S5]
- **Mechanistic basis (inference):**
  - As an anticaking agent, inert mineral particles reduce clumping/flow problems in powders.
  - As a color additive, white mineral pigment increases opacity/whiteness.
- **Common food categories (from CFR):** dietary supplement tablets/capsules (incl. coatings/printing inks), soft/hard candies and mints, and chewing gum surface inks (with specified restriction for chocolate standards). [S5]

## Regulatory Status
### EFSA (EU)
- **Status:** Approved/authorised in the EU; latest follow-up opinion indicates continued authorised use with specification updates needed. [S1][S2]
- **Latest EFSA evaluation year:** 2023 (follow-up + infant <16 weeks assessment). [S1][S2]
- **ADI:** No numerical ADI required (historically consistent with "ADI not specified" approach for calcium carbonate itself). [S1][S7]
- **Key EFSA conclusions:**
  - No safety concern for calcium carbonate **per se** at reported uses/levels, including infants below 16 weeks.
  - Additive contributes a small part of overall calcium exposure.
  - **Unavoidable aluminium impurity in E170 is a concern** and specifications should be amended. [S1][S2]

Notes on access:
- Direct EFSA pages were reachable by URL but full page content was blocked from this environment (EFSA/Wiley anti-bot/robots restrictions), so key conclusions were cross-checked with PubMed record of the EFSA publication. [S1][S8][S9]

### FDA / CFR (US)
- **GRAS status:** Calcium carbonate is in **21 CFR Part 184 (Direct food substances affirmed as generally recognized as safe)** and specifically **21 CFR 184.1191**. [S3][S4]
- **CFR citation:** 21 CFR 184.1191.
- **Conditions of use:** In accordance with 21 CFR 184.1(b)(1), use is permitted with no limitation other than current good manufacturing practice (cGMP). [S3]
- **Additional food-color framework:** 21 CFR 73.70 allows calcium carbonate as a color additive in specific foods/supplements, exempt from certification, with cGMP-based use restrictions. [S5]

### JECFA / WHO
- **ADI:** **NOT LIMITED**.
- **Last evaluation year:** **1965** (record also lists previous years).
- **Key comment:** No restriction for food-additive use provided total dietary calcium contribution is acceptable. [S6]

### IARC
- No specific IARC monograph classification for **calcium carbonate** was found in the IARC classification app dataset (latest app update timestamp captured), i.e., no Group 1/2A/2B/3 entry identified for this exact agent name. [S10][S11]

### Notable bans
- No major-jurisdiction ban identified in sources reviewed (EU/US/JECFA all indicate continued permitted use under conditions). [S1][S3][S6]

## Key Safety Evidence
### Animal / toxicology evidence
- EFSA re-evaluation history indicates no genotoxicity concern and no carcinogenicity signal for calcium carbonate itself in available data; developmental effects were linked to high-dose calcium load conditions. [S7]
- EFSA 2023 follow-up again found no safety concern for calcium carbonate itself at current uses. [S1]

### Epidemiological / clinical evidence
- Human cardiovascular risk literature on **calcium supplements** (not E170-specific intake) is mixed:
  - 2021 meta-analysis reported increased CVD/CHD risk in healthy postmenopausal women at supplemental intakes in included RCTs. [S14]
  - 2023 meta-analysis of randomized trials did **not** find significant excess risk for MI/CHD/stroke/all-cause mortality. [S13]

### Mechanistic / specification concerns
- EFSA 2023: concern is not calcium carbonate toxicity per se but **aluminium impurity** in additive specifications and need for tighter spec amendments. [S1]
- EFSA 2022 FCM nano-precipitated calcium carbonate assessment found no consumer safety concern in intended FCM uses except caveats (infant formula context and potential overall migration exceedance in acidic foods). [S12]

## Exposure Assessment
- **Typical dietary exposure from additive use:** Earlier EFSA re-evaluation summary reports broad intake ranges from additive uses alone, with higher intakes in children/high consumers; when fortification and supplements are included, total calcium exposure can exceed nutritional upper levels in some groups. [S7]
- **Current EFSA view (2023):** E170 contributes only a small part of overall calcium dietary exposure. [S1]
- **ADI exceedance risk:** Not applicable as a numeric ADI threshold because EFSA/JECFA do not set a numerical ADI for calcium carbonate itself; risk management focus shifts to total calcium load and impurities. [S1][S6]
- **Potentially vulnerable populations:** infants under 16 weeks (explicitly assessed by EFSA), high calcium supplement users, and groups with high total calcium intake from multiple sources. [S1][S13][S14]

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Evidence supporting this tier:**
  - Natural mineral/endogenous ion source (calcium) and long regulatory history.
  - EFSA and JECFA do not require a numerical ADI for calcium carbonate itself.
  - EFSA 2023 reports no safety concern for calcium carbonate per se at current uses. [S1][S6]
- **Evidence against this tier:**
  - EFSA flags aluminium impurity concern in E170 specifications.
  - Total calcium exposure can still be high when multiple sources (fortification/supplements) are combined; this is not fully "risk-free" in practical intake scenarios. [S1][S7]

#### `limited`
- **Evidence supporting this tier:**
  - Clear US GRAS framework and cGMP condition in 21 CFR 184.1191.
  - JECFA ADI "NOT LIMITED" with qualification to consider total dietary calcium load.
  - No robust carcinogenic/genotoxic signal for calcium carbonate itself in reviewed regulatory conclusions. [S3][S6][S7]
- **Evidence against this tier:**
  - EFSA impurity concern (aluminium) adds a meaningful caveat.
  - Conflicting supplement-related cardiovascular meta-analyses create residual uncertainty for high-dose calcium contexts. [S1][S13][S14]

#### `moderate`
- **Evidence supporting this tier:**
  - Presence of regulatory caveats (impurity control; total calcium burden; infant-specific review).
  - Some human trial syntheses suggest elevated CVD risk in specific populations with supplemental calcium. [S1][S14]
- **Evidence against this tier:**
  - No numerical ADI requirement and repeated regulator conclusions of no safety concern at reported additive uses.
  - No major-jurisdiction bans or withdrawals identified. [S1][S3][S6]

#### `high`
- **Evidence supporting this tier:**
  - Limited support: concern exists for impurities/overexposure contexts.
- **Evidence against this tier:**
  - No IARC carcinogen classification found for calcium carbonate.
  - No EFSA/FDA/JECFA ban-level actions; additive remains authorised/GRAS-permitted under conditions. [S1][S3][S10][S11]

### 2. Rationale
Primary hazard profile for **calcium carbonate itself** appears low under authorized food-additive uses, but risk is not strictly zero due to (a) impurity-specification concerns (notably aluminium) and (b) potential high total calcium exposure from combined dietary sources outside additive-only intake.

### 3. Recommended tier
**`limited`**.

## Sources
- **[S1]** EFSA Journal (2023). *Re-evaluation of calcium carbonate (E 170) ...* URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/8106 (redirects to Wiley in this environment).
- **[S2]** EFSA site search result/snippet for publication 8106 (captured via web search tool). URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/8106
- **[S3]** eCFR API (official). *21 CFR 184.1191 Calcium carbonate*. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?section=184.1191
- **[S4]** eCFR API (official). *21 CFR Part 184 — Direct food substances affirmed as GRAS*. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?part=184
- **[S5]** eCFR API (official). *21 CFR 73.70 Calcium carbonate (color additive)*. URL visited: https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml?section=73.70
- **[S6]** WHO/JECFA database. *Calcium carbonate (Chemical ID 457)*. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/457
- **[S7]** EFSA Journal (2011). *Scientific Opinion on re-evaluation of calcium carbonate (E 170) as a food additive*. URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/2318 (redirects to Wiley in this environment).
- **[S8]** EFSA search URL attempt (blocked/robots from this environment). URL visited: https://www.efsa.europa.eu/en/search?search_api_fulltext=calcium%20carbonate%20E170
- **[S9]** PubMed record for EFSA 2023 opinion (cross-check of abstract conclusions). URL visited: https://pubmed.ncbi.nlm.nih.gov/37522100/
- **[S10]** IARC classifications landing page. URL visited: https://monographs.iarc.who.int/list-of-classifications/
- **[S11]** IARC classification app dataset script (queried for "calcium carbonate", not found). URL visited: https://webapi.iarc.who.int/loc/loc.app.js
- **[S12]** PubMed/EFSA (2022). *Safety assessment of nano precipitated calcium carbonate for plastic FCM*. URL visited: https://pubmed.ncbi.nlm.nih.gov/35228849/
- **[S13]** PubMed (2023). *Calcium Supplements and Risk of CVD: A Meta-Analysis of Randomized Trials.* URL visited: https://pubmed.ncbi.nlm.nih.gov/37181938/
- **[S14]** PubMed (2021). *Calcium Supplements and Risk of Cardiovascular Disease: A Meta-Analysis of Clinical Trials.* URL visited: https://pubmed.ncbi.nlm.nih.gov/33530332/
- **[S15]** eCFR public page URL (access blocked by CAPTCHA in this environment). URL visited: https://www.ecfr.gov/current/title-21/section-184.1191
