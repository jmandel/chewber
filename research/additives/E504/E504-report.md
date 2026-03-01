# E504 (Magnesium carbonates) - Research Report

## Data Extraction Log (Step 1)
| Source | URL visited | Specific data extracted |
|---|---|---|
| EFSA search attempt | https://www.efsa.europa.eu/en/search?search_api_fulltext=E504 | Returned EFSA error page (`403 - Disallowed by robots.txt`) in this environment. |
| EFSA data-call URL attempt | https://www.efsa.europa.eu/en/data/call/180508 | Returns EFSA "Page not found" (archived/moved notice). |
| OpenEFSA substance record (EFSA) | https://open.efsa.europa.eu/api/substance/get?termExtendedName=Magnesium%20carbonate | Substance record includes `commonNames: [E 504(i), Hydromagnesite]`, CAS `546-93-0`, EC number `208-915-9`. |
| OpenEFSA linked questions (EFSA) | https://open.efsa.europa.eu/api/substance/getQuestions?termExtendedName=Magnesium%20carbonate | Returned one ongoing **feed additive** question (EFSA-Q-2025-00415); no food-additive E504 re-evaluation output retrieved. |
| FDA/eCFR official text | https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml | 21 CFR **184.1425** Magnesium carbonate in Part 184 (direct food substances affirmed as GRAS): cGMP-only use limit and listed functional uses. |
| JECFA/WHO database search API | https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/magnesium%20carbonate | Returned INS 504(i) and 504(ii)-related records and ADI labels (`NOT LIMITED`, `NOT SPECIFIED`). |
| JECFA INS 504(i) | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4697 | Magnesium carbonate, CAS `546-93-0`, INS `504i`, ADI `NOT LIMITED`, evaluation year `1965`. |
| JECFA INS 504(ii) | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4113 | Magnesium carbonate hydroxide hydrated, CAS `39409-82-0`, INS `504ii`, ADI `NOT SPECIFIED`, evaluation year `1979` (comment: included in ADI for other hydrogen carbonates). |
| IARC monograph classification list | https://monographs.iarc.who.int/agents-classified-by-the-iarc/ | No magnesium carbonate-specific entry identified on the IARC agents-classified page. |
| PubMed | https://pubmed.ncbi.nlm.nih.gov/39081255/ | 2024 study with heavy magnesium carbonate-containing aspirin combination in healthy adults: mild AEs, no serious AEs. |
| PubMed | https://pubmed.ncbi.nlm.nih.gov/27900961/ | Dialysis study: effective phosphate control; moderate hypermagnesemia episodes occurred and dose adjustment was needed. |
| PubMed | https://pubmed.ncbi.nlm.nih.gov/18193489/ | Randomized dialysis trial of magnesium carbonate: generally effective/tolerable; discontinuations included diarrhea and recurrent hypermagnesemia. |
| NIH ODS (context on high-dose magnesium salts) | https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/ | High supplemental/medicinal magnesium can cause diarrhea; very high intakes can cause toxicity, with higher risk in renal impairment; magnesium carbonate specifically listed among forms associated with diarrhea. |

## Identity
- **E-number:** E504 (commonly split into E504(i) magnesium carbonate and E504(ii) magnesium carbonate hydroxide/basic magnesium carbonate). [S3][S7][S8]
- **CAS number(s):** 546-93-0 (magnesium carbonate), 39409-82-0 (magnesium carbonate hydroxide hydrated/basic magnesium carbonate). [S3][S7][S8]
- **Chemical class:** Inorganic magnesium carbonate salts/hydroxycarbonates.
- **Common synonyms:** Magnesium carbonate; heavy magnesium carbonate; magnesium carbonate hydroxide hydrated; hydrated basic magnesium carbonate; magnesium subcarbonate; INS 504(i)/504(ii). [S7][S8]
- **Natural vs synthetic:** Occurs naturally (e.g., hydromagnesite/magnesite context) but food-grade material is commonly manufactured by precipitation/carbonation processes. [S3][S5]

## Function in Food
- **Mechanism of action:**
  - Anticaking/free-flow aid by reducing moisture-related clumping in powders.
  - Acidity regulator/pH buffer by neutralizing acids.
  - Also used as carrier/processing aid and color-retention-related functional aid in some systems. [S5][S7][S8]
- **Common food categories (from regulatory use descriptors):** powdered foods and mixes, flour-related applications, products requiring flow/processing stabilization, and other cGMP-limited direct food uses. [S5]

## Regulatory Status
### EFSA (EU)
- **Latest EFSA scientific-opinion retrieval status:** no dedicated current EFSA food-additive scientific opinion page for E504 could be retrieved from accessible EFSA endpoints in this environment.
- **What was found on EFSA systems:**
  - EFSA site search endpoint returned a robots/access block (`403`). [S1]
  - Historical EFSA data-call URL for carbonates now returns EFSA "Page not found" (archived/moved). [S2]
  - OpenEFSA has a magnesium carbonate substance record (including E504(i) alias) and linked questioning, but retrieved question output was feed-additive workflow, not a food-additive E504 re-evaluation opinion. [S3][S4]
- **ADI (EFSA):** not identified from an accessible, dedicated EFSA E504 opinion in this run.
- **Evaluation year (EFSA):** not identified from an accessible, dedicated EFSA E504 opinion in this run.
- **Key conclusion for this report:** EFSA-origin online evidence was partially inaccessible/archived for E504-specific food-additive re-evaluation; therefore JECFA and FDA records were used as the primary accessible regulatory toxicology anchors.

### FDA / eCFR (US)
- **Status:** GRAS as a direct human food ingredient.
- **CFR citation:** **21 CFR 184.1425** (Magnesium carbonate), within **Part 184 - Direct food substances affirmed as generally recognized as safe**. [S5]
- **Conditions of use:** no limitation other than current good manufacturing practice (cGMP); uses listed include anticaking/free-flow agent, flour treating agent, lubricant/release agent, nutrient supplement, pH control agent, processing aid, and synergist. [S5]

### JECFA / WHO
- **INS 504(i) Magnesium carbonate:** ADI **NOT LIMITED**, evaluation year **1965**. [S7]
- **INS 504(ii) Magnesium carbonate hydroxide/basic magnesium carbonate:** ADI **NOT SPECIFIED**, evaluation year **1979**, with comment "included in the ADI for other hydrogen carbonates." [S8]
- **Overall JECFA interpretation for E504 family:** no numeric mg/kg bw/day ADI assigned; low-concern ADI framing under intended food additive use.

### IARC
- **Classification result:** no magnesium carbonate-specific IARC group classification entry was identified on the IARC agents-classified list page reviewed. [S9]

### Notable bans
- No major-jurisdiction ban identified from sources reviewed here (FDA GRAS listing and JECFA permissive ADI framing are in place). [S5][S7][S8]

## Key Safety Evidence
- **Regulatory toxicology baseline:** JECFA ADI designations (NOT LIMITED / NOT SPECIFIED) and FDA GRAS-cGMP framework support low hazard at typical food-additive uses. [S5][S7][S8]
- **Human clinical data (non-additive-dose contexts):**
  - 2024 healthy-volunteer PK/bioequivalence study including heavy magnesium carbonate reported only mild adverse events and no serious adverse events. [S10]
  - Dialysis studies show magnesium carbonate-containing regimens can be effective but may produce hypermagnesemia requiring dose adjustment in renal-risk populations. [S11][S12]
- **Mechanistic concern at high exposures:** magnesium salts (including magnesium carbonate) can cause osmotic diarrhea; very high supplemental/medicinal magnesium exposures can produce magnesium toxicity, especially with impaired renal function. [S13]
- **Carcinogenicity/genotoxicity signal in reviewed sources:** no IARC carcinogenic classification identified for magnesium carbonate. [S9]

## Exposure Assessment
- **Typical dietary intake from additive use:** direct, additive-specific population intake estimates for E504 were not retrieved from accessible EFSA pages in this run.
- **Practical exposure framing:** FDA permits use under cGMP only; JECFA does not assign a numeric ADI for INS 504(i)/(ii), consistent with low concern at standard additive exposure levels. [S5][S7][S8]
- **ADI exceedance risk:** not directly quantifiable because no numeric ADI (mg/kg bw/day) was identified for E504; risk management is usage control (cGMP) and avoidance of excessive total magnesium intakes from supplements/medications. [S5][S7][S8][S13]
- **Potentially vulnerable populations:** people with renal impairment, dialysis populations, and individuals consuming high-dose magnesium-containing medicinal products/supplements. [S11][S12][S13]

## Risk Assessment
### 1. Tier-by-tier analysis
#### `risk_free`
- **Evidence supporting this tier:**
  - JECFA ADI framing is highly permissive (NOT LIMITED / NOT SPECIFIED).
  - FDA GRAS status with long-standing cGMP-limited use.
  - Magnesium is an essential nutrient ion.
- **Evidence arguing against this tier:**
  - Credible high-dose adverse effects exist (GI intolerance, hypermagnesemia/toxicity), particularly in renal impairment.
  - Available human safety data for E504 are mostly non-food-additive-dose contexts, not fully eliminating uncertainty.

#### `limited`
- **Evidence supporting this tier:**
  - Consistent regulatory permissive status (FDA GRAS; JECFA non-numeric ADI outcomes).
  - No IARC carcinogenic classification identified.
  - Safety signals are mainly at higher medicinal exposures or vulnerable clinical populations.
- **Evidence arguing against this tier:**
  - EFSA food-additive-specific re-evaluation output was not retrievable here, lowering completeness of EU-side evidence.

#### `moderate`
- **Evidence supporting this tier:**
  - Hypermagnesemia events in dialysis studies and known high-dose magnesium toxicity suggest meaningful caveats for certain populations.
- **Evidence arguing against this tier:**
  - These concerns mostly occur at pharmacological/high exposures, not typical cGMP food-additive use.
  - JECFA and FDA positions remain permissive.

#### `high`
- **Evidence supporting this tier:**
  - Limited support only (high-dose toxicity exists in vulnerable groups).
- **Evidence arguing against this tier:**
  - No major bans identified.
  - No IARC carcinogenic classification identified.
  - Regulatory baseline remains broadly permissive for food use.

### 2. Rationale
The strongest available regulatory evidence (FDA and JECFA) indicates low risk at typical food-additive uses. The main safety concerns are dose-dependent and population-specific (renal impairment, pharmacologic magnesium intake), rather than a broad intrinsic toxicity signal at standard food-use levels.

### 3. Recommended tier
**`limited`**.

## Sources
- **[S1]** EFSA search endpoint (access blocked in this environment), 2026. URL: https://www.efsa.europa.eu/en/search?search_api_fulltext=E504
- **[S2]** EFSA data call URL (archived/moved page), 2026. URL: https://www.efsa.europa.eu/en/data/call/180508
- **[S3]** OpenEFSA API (EFSA), substance record for magnesium carbonate, 2026. URL: https://open.efsa.europa.eu/api/substance/get?termExtendedName=Magnesium%20carbonate
- **[S4]** OpenEFSA API (EFSA), questions linked to magnesium carbonate, 2026. URL: https://open.efsa.europa.eu/api/substance/getQuestions?termExtendedName=Magnesium%20carbonate
- **[S5]** eCFR API (Title 21 full XML, used to extract Part 184 and §184.1425), 2026. URL: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
- **[S6]** WHO/JECFA search API response for magnesium carbonate, 2026. URL: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/magnesium%20carbonate
- **[S7]** WHO/JECFA record: Magnesium carbonate (INS 504i), 2026 access. URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4697
- **[S8]** WHO/JECFA record: Magnesium carbonate hydroxide hydrated (INS 504ii), 2026 access. URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4113
- **[S9]** IARC Monographs agents-classified page, 2026 access. URL: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
- **[S10]** PubMed PMID 39081255 (2024), accessed 2026. URL: https://pubmed.ncbi.nlm.nih.gov/39081255/
- **[S11]** PubMed PMID 27900961 (2016), accessed 2026. URL: https://pubmed.ncbi.nlm.nih.gov/27900961/
- **[S12]** PubMed PMID 18193489 (2008), accessed 2026. URL: https://pubmed.ncbi.nlm.nih.gov/18193489/
- **[S13]** NIH Office of Dietary Supplements, Magnesium Fact Sheet for Health Professionals (living page), accessed 2026. URL: https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/
