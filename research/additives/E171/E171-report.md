# E171 (Titanium dioxide) - Research Report

## Data Extraction Log (Step 1)
| Source | URL visited | Specific data extracted |
|---|---|---|
| EFSA news summary (latest assessment communication) | https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive | Published date 2021-05-06; EFSA concludes E171 can no longer be considered safe as food additive; genotoxicity concern cannot be ruled out; ADI cannot be established; mentions prior 2016 re-evaluation and accumulation after low absorption. |
| EFSA opinion page (access attempt) | https://www.efsa.europa.eu/en/efsajournal/pub/6585 | URL resolves to EFSA/Wiley page but content is blocked in this environment by anti-bot challenge; no additional primary-text extraction possible from this endpoint here. |
| FDA titanium dioxide page | https://www.fda.gov/industry/color-additives/titanium-dioxide-color-additive-foods | FDA regulates TiO2 as a color additive; cites 21 CFR 73.575; quantity in food cannot exceed 1% by weight; explicitly states no GRAS provision for color additives. |
| eCFR direct section (access attempt) | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-73/section-73.575 | URL reachable but redirected to federalregister.gov "Request Access" anti-bot page in this environment; direct extraction from ecfr.gov page unavailable. |
| eCFR developer docs (access attempt) | https://www.ecfr.gov/developer/documentation/api/v1 | Also redirected to access-blocked page in this environment. |
| CFR mirror used as fallback for exact section text | https://www.ecfr.io/Title-21/Section-73.575 | Section text for 21 CFR 73.575: synthetically prepared TiO2; safe use restriction <=1% by weight of food; limits for lead/arsenic/antimony/mercury; exempt from certification. |
| WHO/JECFA database | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5576 | Chemical: Titanium dioxide; CAS 13463-67-7; synonyms include C.I. Pigment white 6 and Titania; evaluation year 2023; ADI "NOT LIMITED (not specified)" reaffirmed; P95 exposure estimate 10 mg/kg bw/day used in evaluation. |
| IARC monograph landing (volume 93) | http://monographs.iarc.who.int/ENG/Monographs/vol93/index.php | Points to IARC Monographs Volume 93 (Carbon Black, Titanium Dioxide, and Talc), focused on inhalation carcinogenic hazard context. |
| IARC Monograph Volume 93 PDF | https://publications.iarc.who.int/_publications/media/download/2856/mono93.pdf | "Titanium dioxide is possibly carcinogenic to humans (Group 2B)"; inadequate evidence in humans and sufficient evidence in experimental animals (carcinogenicity evaluation section). |
| EU legal action (notable ban) | https://eur-lex.europa.eu/eli/reg/2022/63/oj/eng | Commission Regulation (EU) 2022/63 removed food authorization for E171 following EFSA 2021 opinion; transitional market dates include 7 Feb 2022 and 7 Aug 2022. |
| PubMed exposure meta-analysis | https://pubmed.ncbi.nlm.nih.gov/39980420/?format=pubmed | 2025 meta-analysis reports mean oral TiO2 intake 0.045-10.5 mg/kg bw/day; lifelong weighted average 1.43 mg/kg bw/day; children have higher exposure than adults. |
| PubMed reproductive toxicity study | https://pubmed.ncbi.nlm.nih.gov/39173974/?format=pubmed | 2024 extended one-generation rat study reports no reproductive/systemic/developmental neurotoxicity at tested levels; NOAEL 1000 mg/kg bw/day for several endpoints (immunotoxicity NOAEL not determined due study limitations). |
| PubMed animal carcinogenesis-related study | https://pubmed.ncbi.nlm.nih.gov/41708253/?format=pubmed | 2026 mouse study: dietary E171 promoted colitis-associated colorectal cancer progression via macrophage/NLRP3-caspase1-GSDMD and S100A8/S100A9 signaling. |
| PubMed mechanistic in vitro study | https://pubmed.ncbi.nlm.nih.gov/40651618/?format=pubmed | 2025 human iPSC colon organoid model: E171 increased ROS and DNA damage, with transcriptomic pathway changes. |
| PubMed gut microbiome model | https://pubmed.ncbi.nlm.nih.gov/41665880/?format=pubmed | 2026 TIM-2 in vitro colon model: E171 altered microbial composition and metabolic activity, including butyrate changes. |

## Identity
- **E-number:** E171
- **Name:** Titanium dioxide (TiO2)
- **CAS number(s):** 13463-67-7
- **Chemical class:** Inorganic metal oxide pigment (food colorant)
- **Common synonyms:** C.I. Pigment White 6; Titania; titanium(IV) oxide
- **Natural vs synthetic:** Used as a **synthetically produced** food color additive (manufactured from naturally occurring ores)

Evidence:
- JECFA record provides chemical name, CAS number, and synonyms. [S6]
- FDA describes TiO2 used in foods as a synthetically produced white pigment. [S2]

## Function in Food
- **Primary function:** White color additive / opacifier.
- **Mechanism of action:** Insoluble TiO2 particles act as a white pigment and opacity-enhancing colorant (light-scattering appearance effect).
- **Common food categories:** Bakery products and candy (FDA examples); EFSA also lists strong exposure contribution from fine bakery wares and certain soups/sauces categories.

Evidence:
- FDA states use as color additive in foods such as bakery products and candy. [S2]
- EFSA FAQ on the 2021 page states E171 is a food color used to improve visual appearance and identifies main contributing food categories in dietary exposure. [S1]

## Regulatory Status
### EFSA / EU
- **Latest EFSA evaluation year:** 2021 (published 6 May 2021).
- **EFSA conclusion:** Titanium dioxide (E171) can no longer be considered safe as a food additive because a genotoxicity concern could not be ruled out.
- **ADI:** **Not established** (cannot be established).
- **Regulatory outcome in EU:** EU removed food authorization for E171 via Commission Regulation (EU) 2022/63, with transition dates tied to 7 February 2022 and 7 August 2022.

### FDA / CFR (Title 21)
- **GRAS status:** Not GRAS (FDA states there is no GRAS provision for color additives).
- **Status:** Approved as a color additive under specific CFR conditions.
- **CFR citation:** **21 CFR 73.575** (Titanium dioxide).
- **Conditions of use (section text):**
  - Quantity of TiO2 in food must not exceed **1% by weight**.
  - Cannot color foods with standards of identity unless color is authorized by that standard.
  - Exempt from batch certification.

Note on access: direct extraction from `ecfr.gov` was blocked by access controls in this environment; section text was extracted from an eCFR mirror after recording failed `ecfr.gov` attempts. [S3][S4][S5]

### JECFA / WHO
- **Latest evaluation year:** 2023.
- **ADI:** **NOT LIMITED (not specified)**, reaffirmed.
- **Key points:** JECFA considered representative INS 171 datasets, noted very low oral absorption, no convincing evidence of genotoxicity for INS 171 in its assessment framework, and used a high P95 exposure estimate of 10 mg/kg bw/day in the evaluation narrative.

### IARC
- **Classification:** **Group 2B** (possibly carcinogenic to humans).
- **Context from monograph:** Inadequate human evidence, sufficient experimental animal evidence; the volume addresses inhalation carcinogenic hazard context.

### Notable bans/restrictions
- **EU foods:** Authorization withdrawn (Regulation (EU) 2022/63).
- **US foods:** Still permitted as a color additive under 21 CFR 73.575 conditions.

## Key Safety Evidence
### Animal studies
- **Signal of concern:**
  - 2026 mouse model (colitis-associated CRC) reported promotion of tumor-related pathways after dietary E171 exposure. [S12]
- **Counter-evidence / no-effect findings in specific endpoints:**
  - 2024 extended one-generation rat study reported no reproductive/systemic/developmental neurotoxicity at tested doses; NOAEL for many endpoints was 1000 mg/kg bw/day (with limitations for immunotoxicity endpoint interpretation). [S11]

### Epidemiological data
- JECFA 2023 comments state current epidemiological evidence does not allow conclusions on associations between dietary INS 171 exposure and human health effects. [S6]
- IARC monograph reports limited human evidence in occupational/inhalation literature for carcinogenicity assessment. [S8]

### Mechanistic concerns
- EFSA 2021: genotoxicity concern could not be ruled out, leading to inability to set ADI. [S1]
- 2025 colon organoid study: E171-associated ROS increase and DNA damage signals. [S13]
- 2026 gut microbiome TIM-2 model: altered microbial metabolic activity/composition with butyrate effects. [S14]

## Exposure Assessment
- **Typical intake estimates (recent synthesis):** 2025 meta-analysis reports mean oral TiO2 intakes of **0.045-10.5 mg/kg bw/day**, with a lifelong weighted average of **1.43 mg/kg bw/day**. [S10]
- **Regulatory exposure benchmark from JECFA narrative:** high P95 estimate **10 mg/kg bw/day** used in 2023 evaluation. [S6]
- **ADI exceedance risk:**
  - Under EFSA framework: not quantifiable against an ADI because ADI was not established.
  - Under JECFA framework: ADI is "not specified," so classical exceedance framing is not used.
- **Vulnerable populations:** children show higher exposure than adults in meta-analysis; EFSA communication identifies age-related exposure-category differences in dietary contributors. [S1][S10]

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Evidence supporting this tier:**
  - JECFA reaffirmed ADI "not specified" in 2023 and considered oral absorption very low. [S6]
  - FDA continues to allow controlled food use under CFR limits. [S2][S5]
- **Evidence arguing against this tier:**
  - EFSA could not rule out genotoxicity and did not establish an ADI. [S1]
  - EU withdrew food authorization after EFSA’s 2021 conclusion. [S9]
  - IARC classifies TiO2 as Group 2B (route/context caveat applies). [S8]

#### `limited`
- **Evidence supporting this tier:**
  - US approval with explicit use cap (<=1% by weight) and longstanding use history. [S2][S5]
  - JECFA’s 2023 reaffirmation did not identify a dietary hazard requiring numeric ADI. [S6]
- **Evidence arguing against this tier:**
  - Major-jurisdiction ban in EU foods and unresolved EFSA genotoxicity concern exceed a "minor caveat" profile. [S1][S9]
  - Recent mechanistic/animal studies continue to show potential biological effects. [S12][S13][S14]

#### `moderate`
- **Evidence supporting this tier:**
  - Regulatory divergence (EU negative vs US/JECFA permissive) and child-higher exposure patterns. [S1][S2][S6][S10]
  - Mixed but credible mechanistic concerns from recent models. [S12][S13][S14]
- **Evidence arguing against this tier:**
  - EFSA’s explicit inability to confirm safety and subsequent EU withdrawal push severity beyond a standard "approved with caveats" profile. [S1][S9]

#### `high`
- **Evidence supporting this tier:**
  - EFSA 2021: no longer considered safe as food additive; ADI cannot be established due genotoxicity concern. [S1]
  - EU removed food authorization (Regulation (EU) 2022/63). [S9]
  - IARC Group 2B classification provides additional carcinogenic-hazard concern context (primarily inhalation-based evidence). [S8]
- **Evidence arguing against this tier:**
  - FDA and JECFA continue to permit/affirm under their own evidence evaluations. [S2][S6]
  - Some recent high-dose guideline studies report null findings for selected endpoints (e.g., reproductive toxicity). [S11]

### 2. Rationale
The dominant decision factors are: (1) EFSA’s formal conclusion that safety could not be confirmed due unresolved genotoxicity concerns; (2) direct regulatory consequence of EU food-use withdrawal; and (3) persistent mechanistic signals in newer studies. Countervailing FDA/JECFA conclusions reduce certainty but do not outweigh the EU regulatory action tied to unresolved hazard uncertainty.

### 3. Recommended tier
**`high`**

## Sources
- **[S1]** EFSA (2021). *Titanium dioxide: E171 no longer considered safe when used as a food additive.* URL visited: https://www.efsa.europa.eu/en/news/titanium-dioxide-e171-no-longer-considered-safe-when-used-food-additive
- **[S2]** FDA (updated page). *Titanium Dioxide as a Color Additive in Foods.* URL visited: https://www.fda.gov/industry/color-additives/titanium-dioxide-color-additive-foods
- **[S3]** eCFR URL attempt (blocked in this environment). *21 CFR 73.575 section page.* URL visited: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-73/section-73.575
- **[S4]** eCFR developer docs URL attempt (blocked in this environment). URL visited: https://www.ecfr.gov/developer/documentation/api/v1
- **[S5]** eCFR mirror text. *21 CFR 73.575 Titanium dioxide.* URL visited: https://www.ecfr.io/Title-21/Section-73.575
- **[S6]** WHO/JECFA database (2023 entry). *Titanium dioxide (Chemical ID 5576).* URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5576
- **[S7]** IARC monograph landing. *Volume 93 page.* URL visited: http://monographs.iarc.who.int/ENG/Monographs/vol93/index.php
- **[S8]** IARC (2010). *IARC Monographs Volume 93 PDF (Carbon Black, Titanium Dioxide, and Talc).* URL visited: https://publications.iarc.who.int/_publications/media/download/2856/mono93.pdf
- **[S9]** European Commission (2022). *Commission Regulation (EU) 2022/63 (E171).* URL visited: https://eur-lex.europa.eu/eli/reg/2022/63/oj/eng
- **[S10]** Bischoff et al. (2025). *Food-grade titanium dioxide exposure between age groups and in global regions: systematic review/meta-analysis.* URL visited: https://pubmed.ncbi.nlm.nih.gov/39980420/?format=pubmed
- **[S11]** Tassinari et al. (2024). *Extended one-generation reproductive toxicity study of food-grade titanium dioxide E171.* URL visited: https://pubmed.ncbi.nlm.nih.gov/39173974/?format=pubmed
- **[S12]** Gao et al. (2026). *Dietary E171 and colitis-associated colorectal cancer in mice.* URL visited: https://pubmed.ncbi.nlm.nih.gov/41708253/?format=pubmed
- **[S13]** Zaharia et al. (2025). *E171-induced toxicity in human iPSC-derived colon organoids.* URL visited: https://pubmed.ncbi.nlm.nih.gov/40651618/?format=pubmed
- **[S14]** Goldin et al. (2026). *E171 alters gut microbial metabolic activity and butyrate in TIM-2 model.* URL visited: https://pubmed.ncbi.nlm.nih.gov/41665880/?format=pubmed
- **[S15]** EFSA opinion URL attempt (blocked in this environment). *EFSA Journal publication 6585 page.* URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/6585
