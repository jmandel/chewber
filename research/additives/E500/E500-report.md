# E500 (Sodium carbonates / Baking soda) - Research Report

## Data Extraction Log (Step 1)
| Source | URL visited | Specific data extracted |
|---|---|---|
| EFSA main website search (access attempt) | https://www.efsa.europa.eu/en/search?text=E500 | Returned `403 - Disallowed by robots.txt` in this environment; direct efsa.europa.eu search page content could not be extracted. |
| Open EFSA question record (E500(i)) | https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00648 | Subject: "Re-evaluation of E500 (i) Sodium carbonate"; status/phase: `Ongoing Risk Assessment`; last modified date: `2026-01-19`; comment says additive is already authorised in EU and re-evaluation is delayed, with new call for data likely in 2026/2027. |
| Open EFSA question record (E500(ii)) | https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00649 | Subject: "Re-evaluation of E500 (ii) Sodium hydrogen carbonate"; status/phase: `Ongoing Risk Assessment`; same delay/comment text; last modified date `2026-01-19`. |
| Open EFSA question record (E500(iii)) | https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00650 | Subject: "Re-evaluation of E500 (iii) Sodium sesquicarbonate"; status/phase: `Ongoing Risk Assessment`; same delay/comment text; last modified date `2026-01-19`. |
| Open EFSA substance record | https://open.efsa.europa.eu/api/substance/get?termExtendedName=sodium%20carbonates | Entry includes common name `E 500`, CAS `497-19-8`, EC `207-838-8`, IUPAC disodium carbonate. |
| Open EFSA substance record | https://open.efsa.europa.eu/api/substance/get?termExtendedName=sodium%20bicarbonate | Entry includes common names `E 500(ii)`, `Baking soda`; CAS `144-55-8`; EC `205-633-8`. |
| eCFR API section | https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1742 | `21 CFR 184.1742 Sodium carbonate`: affirmed GRAS direct food ingredient; no limitation other than current GMP; functions include antioxidant, curing/pickling agent, flavoring agent/adjuvant, pH control agent, processing aid. |
| eCFR API section | https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1736 | `21 CFR 184.1736 Sodium bicarbonate`: affirmed GRAS direct food ingredient; no limitation other than current GMP. |
| eCFR API section | https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1792 | `21 CFR 184.1792 Sodium sesquicarbonate`: affirmed GRAS direct food ingredient; pH control use; specific GMP use note for cream processing. |
| WHO/JECFA chemical page | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3252 | `SODIUM CARBONATE` (INS 500i), CAS `497-19-8`, ADI `NOT LIMITED`, evaluation year `1965`, previous year entry `1975`. |
| WHO/JECFA chemical page | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1099 | `SODIUM BICARBONATE` (INS 500ii), ADI `NOT LIMITED`, evaluation year `1965`, previous year entry `1975`. |
| WHO/JECFA chemical page | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4004 | `SODIUM SESQUICARBONATE` (INS 500iii), CAS `533-96-0`, ADI `NOT SPECIFIED`, evaluation year `1981`. |
| IARC monographs search page | https://monographs.iarc.who.int/search | Search interface available. |
| IARC monographs search API bootstrap | https://monographs.iarc.who.int/wp-json/tile/v1/search-data/?language=en | Returned site search endpoint configuration for monographs search. |
| IARC monographs search backend (queried terms: sodium carbonate, sodium bicarbonate, sodium sesquicarbonate, E500) | https://f5spbhgv4xkqlj5vgs5nbvhfyi0aisga.lambda-url.eu-central-1.on.aws/ | `hits.found = 0` for each queried term in monographs site scope; no matching monograph entry/classification found for E500 compounds. |
| Codex GSFA additive index | https://codex.sitefinity.cloud/codex-text/dbs/general-standard-for-food-additives-%28gsfa%29/food-additives-index/d/200 | Sodium hydrogen carbonate (INS 500(ii)) listed with functional classes including acidity regulator, anti-caking agent, raising agent; GSFA provisions include category examples (e.g., butter, coffee products). |
| Codex GSFA additive index | https://codex.sitefinity.cloud/codex-text/dbs/general-standard-for-food-additives-%28gsfa%29/food-additives-index/d/201 | Sodium sesquicarbonate (INS 500(iii)) listed with functional class acidity regulator and GSFA category provisions. |
| PubMed study | https://pubmed.ncbi.nlm.nih.gov/41416636/ | 2025 systematic review/meta-analysis: oral sodium bicarbonate in running trials; GI symptoms more frequent vs placebo (29.5% vs 2.6%); negligible overall performance effect in mixed-sex analysis. |
| PubMed study | https://pubmed.ncbi.nlm.nih.gov/39253380/ | 2024 systematic review/meta-analysis in CKD populations: no significant overall serious adverse events, but increased diastolic pressure and higher risk of worsening hypertension/edema reported. |
| PubMed study | https://pubmed.ncbi.nlm.nih.gov/40134641/ | 2025 CKD meta-analysis: favorable acid-base correction; no significant increase in death/prolonged hospitalization; no significant GI or edema signal in pooled primary safety outcomes. |
| PubMed study | https://pubmed.ncbi.nlm.nih.gov/41650758/ | 2026 case report + literature review: severe metabolic alkalosis/hypernatremia after excessive ingestion; review identified 78 toxicity cases, with serious outcomes linked to misuse/high doses. |
| FDA sodium context page | https://www.fda.gov/food/nutrition-education-resources-materials/sodium-your-diet | Notes sodium-containing additives (including sodium bicarbonate) contribute to total sodium intake; average U.S. intake about 3,400 mg/day; recommends <2,300 mg/day DV target. |
| CDC sodium context page | https://www.cdc.gov/salt/about/index.html | Reports U.S. average sodium intake >3,300 mg/day and links high sodium intake to higher blood pressure/cardiovascular risk. |

## Identity
- **E-number:** E500 (subtypes E500(i), E500(ii), E500(iii))
- **Primary name:** Sodium carbonates (includes sodium carbonate, sodium hydrogen carbonate/bicarbonate, sodium sesquicarbonate)
- **CAS number(s):** 497-19-8 (sodium carbonate), 144-55-8 (sodium bicarbonate), 533-96-0 (sodium sesquicarbonate)
- **Chemical class:** Inorganic alkali carbonates / buffering salts
- **Common synonyms:** Soda ash, sodium bicarbonate, sodium hydrogen carbonate, baking soda
- **Natural vs synthetic:** Both occur naturally (e.g., trona-derived forms) and are also industrially manufactured (e.g., Solvay process)

## Function in Food
- **Mechanism of action:** Primarily buffering/pH control (neutralizes acids). In baking applications, bicarbonate-based forms release CO2 in acid/heat conditions, contributing to leavening.
- **Common functional classes (Codex + CFR):** acidity regulator, raising agent, anti-caking agent, processing aid; CFR also lists antioxidant/flavor-adjuvant/curing-pickling uses for sodium carbonate.
- **Common food categories:** bakery-type uses (via baking soda), butter/cream processing and other processed foods where pH buffering is needed, and selected beverage/coffee-product categories in GSFA provisions.

## Regulatory Status
### EFSA
- **Current status:** EU-authorised additive, but EFSA food-additive re-evaluation for E500(i)/(ii)/(iii) is still **ongoing** (`EFSA-Q-2011-00648/649/650`), last updated `2026-01-19`.
- **Latest EFSA scientific output / year:** no final published re-evaluation output yet (ongoing risk assessment; grouped output planned).
- **ADI:** no current EFSA numeric ADI extractable from the ongoing-question records.
- **Key EFSA conclusion from latest records:** additive already authorised in EU; re-evaluation delayed due workload; new data call expected in 2026/2027.

### FDA / CFR (Title 21)
- **GRAS status:** affirmed GRAS as direct human food ingredients for sodium carbonate, sodium bicarbonate, and sodium sesquicarbonate.
- **CFR citations:** 21 CFR 184.1742, 21 CFR 184.1736, 21 CFR 184.1792.
- **Conditions of use:** generally no limitation other than current good manufacturing practice (GMP); sodium sesquicarbonate section includes specific GMP context for cream processing and pH control.

### JECFA / WHO
- **Sodium carbonate (INS 500i):** ADI `NOT LIMITED`; evaluation year `1965`.
- **Sodium bicarbonate (INS 500ii):** ADI `NOT LIMITED`; evaluation year `1965`.
- **Sodium sesquicarbonate (INS 500iii):** ADI `NOT SPECIFIED`; evaluation year `1981`.
- **Overall for E500 group:** no numeric mg/kg bw/day ADI; JECFA uses descriptor-style ADIs (not limited / not specified) for these components.

### IARC
- **Classification found:** no monograph classification entry found for sodium carbonate/bicarbonate/sesquicarbonate in IARC monographs search endpoints queried (zero hits).

### Notable bans
- No major-jurisdiction food-use ban identified in the sources reviewed for E500.

## Key Safety Evidence
### Animal studies
- Recent PubMed returns were dominated by human supplementation/clinical studies and toxicity case reports; no strong new additive-specific oral carcinogenicity signal for E500 compounds was identified in this search pass.
- Historic toxicology evidence is embedded in legacy JECFA evaluations supporting `NOT LIMITED`/`NOT SPECIFIED` descriptors.

### Epidemiological / clinical human data
- 2024 and 2025 CKD-focused meta-analyses report mixed but generally manageable safety profiles at therapeutic oral dosing, with concern signals in some analyses for increased diastolic pressure, worsening hypertension, and edema.
- 2025 sports meta-analysis found frequent GI adverse symptoms versus placebo with acute oral bicarbonate loading.

### Mechanistic / high-dose concerns
- 2026 case report and literature review documented severe toxicity (metabolic alkalosis/hypernatremia) with excessive, non-food-pattern ingestion; review identified 78 misuse/toxicity cases.
- Risk profile appears strongly dose-pattern dependent: approved food-use context (GMP) vs concentrated self-medication/misuse.

## Exposure Assessment
- No numeric EFSA ADI is currently available from the ongoing E500 re-evaluation records, so EFSA-style ADI exceedance quantification is not currently possible.
- JECFA descriptors (`NOT LIMITED` / `NOT SPECIFIED`) indicate low concern at typical regulated food-use conditions for these compounds.
- Population sodium context remains relevant: U.S. average sodium intake is reported around 3,300-3,400 mg/day (CDC/FDA), above recommended limits (<2,300 mg/day for adults). Sodium from E500 contributes to total sodium burden but is typically one component among many sodium sources.
- **Vulnerable groups:** people with sodium-sensitive hypertension, edema-prone states, advanced CKD, or individuals using high-dose bicarbonate supplements/self-treatment outside normal food exposure patterns.

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Supports placement:** longstanding FDA GRAS affirmation; JECFA descriptor ADIs of not limited/not specified; no IARC monograph hit for these agents.
- **Argues against placement:** reproducible high-dose adverse effects exist (GI intolerance, hypertension/edema signals in some clinical contexts, severe toxicity in misuse cases), so this is not strictly "no credible evidence of harm".

#### `limited`
- **Supports placement:** approved in major jurisdictions reviewed (FDA GRAS), no major food-use bans identified, JECFA low-concern descriptor ADIs, adverse effects mainly at high supplemental/misuse levels rather than typical food use.
- **Argues against placement:** EFSA re-evaluation remains incomplete, leaving uncertainty in EU risk-assessment finalization.

#### `moderate`
- **Supports placement:** ongoing EFSA re-evaluation and documented clinical side-effect signals in selected populations (blood pressure/edema, GI intolerance).
- **Argues against placement:** no established evidence of major-population harm at normal food-use levels and no major-jurisdiction ban in the sources reviewed.

#### `high`
- **Supports placement:** severe acute toxicity is possible with extreme ingestion.
- **Argues against placement:** high-tier criteria (major food-use bans, IARC 2A/2B agent classification for this additive, EFSA safety failure conclusion) were not met in retrieved evidence.

### 2. Rationale
The weight of evidence supports low-to-limited concern under regulated food-use conditions, with risk primarily emerging when intake is concentrated (supplement-like doses or misuse). Regulatory status (FDA GRAS + JECFA low-concern descriptors) is consistent with this, while the EFSA re-evaluation being still open lowers certainty but does not currently indicate withdrawal or restriction.

### 3. Recommended tier
**`limited`**

## Sources
- European Food Safety Authority (Open EFSA question records, updated 2026):
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00648
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00649
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00650
- EFSA site access attempt:
  - https://www.efsa.europa.eu/en/search?text=E500
- Open EFSA substance records:
  - https://open.efsa.europa.eu/api/substance/get?termExtendedName=sodium%20carbonates
  - https://open.efsa.europa.eu/api/substance/get?termExtendedName=sodium%20bicarbonate
- eCFR API, Title 21 Food and Drugs:
  - https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1742
  - https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1736
  - https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?section=184.1792
- WHO/JECFA database:
  - https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3252
  - https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1099
  - https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4004
- IARC monographs search resources:
  - https://monographs.iarc.who.int/search
  - https://monographs.iarc.who.int/wp-json/tile/v1/search-data/?language=en
  - https://f5spbhgv4xkqlj5vgs5nbvhfyi0aisga.lambda-url.eu-central-1.on.aws/
- Codex GSFA additive entries:
  - https://codex.sitefinity.cloud/codex-text/dbs/general-standard-for-food-additives-%28gsfa%29/food-additives-index/d/200
  - https://codex.sitefinity.cloud/codex-text/dbs/general-standard-for-food-additives-%28gsfa%29/food-additives-index/d/201
- PubMed studies:
  - https://pubmed.ncbi.nlm.nih.gov/41416636/
  - https://pubmed.ncbi.nlm.nih.gov/39253380/
  - https://pubmed.ncbi.nlm.nih.gov/40134641/
  - https://pubmed.ncbi.nlm.nih.gov/41650758/
- Sodium intake context:
  - https://www.fda.gov/food/nutrition-education-resources-materials/sodium-your-diet
  - https://www.cdc.gov/salt/about/index.html
