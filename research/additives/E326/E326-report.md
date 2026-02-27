# E326 (Potassium lactate) - Research Report

## Identity
- **E-number:** E326
- **Name:** Potassium lactate
- **CAS:** 996-31-6
- **Chemical class:** Lactate salt (potassium salt of lactic acid); organic acid salt used as food additive
- **Common synonyms:** Potassium 2-hydroxypropanoate; Potassium-L-lactate; Potassium salt of lactic acid; INS 326
- **Natural vs synthetic:** Typically produced industrially by neutralizing lactic acid with potassium hydroxide (commercially manufactured; often fermentation-derived lactic acid + chemical neutralization).

Evidence:
- OpenEFSA substance record lists CAS 996-31-6, IUPAC "potassium 2-hydroxypropanoate", common name "[E 326]". (OpenEFSA API, 2026 update, https://open.efsa.europa.eu/api/substance/get?termExtendedName=Potassium%20lactate)
- US CFR defines it as potassium salt of lactic acid and says it is prepared commercially by neutralization of lactic acid with potassium hydroxide. (21 CFR 184.1639, https://www.ecfr.gov/api/versioner/v1/full/2025-01-01/title-21.xml?part=184&section=184.1639)

## Function in Food
- **Primary roles:** acidity/pH control, humectancy, flavor enhancement, preservative-support effects (especially in processed meats).
- **Mechanism:** lactate salts reduce water activity and influence pH/ionic environment, which suppresses growth of spoilage/pathogenic bacteria in many meat systems.
- **Common food categories reported:** cured/processed meats (salami, ham, sausages, turkey products), marinated meats/fish products.

Evidence:
- FDA permitted technical functions: flavor enhancer, flavoring agent/adjuvant, humectant, pH control agent. (21 CFR 184.1639, https://www.ecfr.gov/api/versioner/v1/full/2025-01-01/title-21.xml?part=184&section=184.1639)
- Recent food studies involving potassium lactate in meat systems: low-sodium marinated beef (2024), salami sodium-reduction strategy (2021), ready-to-eat pastirma quality/microbial effects (2022), Listeria/Clostridium control studies in RTE meats (PubMed records: https://pubmed.ncbi.nlm.nih.gov/38254592/, https://pubmed.ncbi.nlm.nih.gov/33430446/, https://pubmed.ncbi.nlm.nih.gov/35250054/, https://pubmed.ncbi.nlm.nih.gov/24215704/).

## Regulatory Status
### EFSA (EU)
- **Status:** Already authorized in EU food additive framework, but **current EFSA re-evaluation is ongoing**.
- **Latest EFSA dossier state found:** OpenEFSA question EFSA-Q-2011-00601 (E326) is in **"Ongoing Risk Assessment"** with a January 19, 2026 update.
- **ADI (EFSA):** No current EFSA ADI value was found in the active OpenEFSA E326 dossier (no final output/opinion attached yet).
- **Evaluation year (latest status update):** 2026 status update; expected completion date shown as 2027-12-31.
- **Key conclusion from EFSA status note:** EFSA notes additive is already authorized; re-evaluation delayed by workload; new call for data planned in 2026; one combined output foreseen for E270/E325/E326/E327/E585 questions.

Sources:
- E326 question page/API: https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00601
- E326 linked questions endpoint: https://open.efsa.europa.eu/api/substance/getQuestions?termExtendedName=Potassium%20lactate
- Related combined re-evaluation questions (same EFSA note):
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00596
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00600
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00602
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00690

### FDA / CFR (US)
- **Status:** GRAS (affirmed as generally recognized as safe) direct human food ingredient.
- **Citation:** **21 CFR 184.1639 (Potassium lactate)**.
- **Conditions of use:** GMP-limited use as flavor enhancer, flavoring agent/adjuvant, humectant, pH control agent; **not authorized in infant foods and infant formulas**.

Source:
- https://www.ecfr.gov/api/versioner/v1/full/2025-01-01/title-21.xml?part=184&section=184.1639

### JECFA / WHO
- **Record found:** Potassium lactate (solution), INS 326, CAS 996-31-6.
- **ADI:** **NOT LIMITED**.
- **Last evaluation year shown:** **1974** (with previous year references including 1973).
- **Important caveat:** JECFA page comment states D(-)-lactic acid or DL-lactic acid should not be used in infant foods.

Sources:
- Chemical page: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2777
- Search endpoint used to locate record: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/potassium%20lactate

### IARC
- No IARC monograph classification entry for potassium lactate was identified from the IARC Monographs classification resources checked.

Sources checked:
- https://monographs.iarc.who.int/list-of-classifications
- https://monographs.iarc.who.int/?s=potassium+lactate (returned IARC page-not-found template)
- https://monographs.iarc.who.int/?s=lactic+acid (returned IARC page-not-found template)

### Notable bans
- No notable bans in major jurisdictions were identified from the regulatory sources reviewed above.

## Key Safety Evidence
- **Regulatory toxicology baseline:**
  - JECFA: ADI not limited for potassium lactate (solution), suggesting low concern at current intended uses.
  - FDA: GRAS affirmation under GMP conditions, with infant-food exclusion.
- **Human epidemiology specific to E326 oral intake:**
  - No clear modern epidemiological dataset specifically linking dietary potassium lactate (E326) to major chronic disease outcomes was identified in the searched PubMed set.
- **Mechanistic/indirect concerns:**
  - Infant metabolism caveat (JECFA infant-food note + FDA infant-food restriction).
  - Food microbiology studies suggest microbial adaptation/cross-protection effects after exposure to organic acid salts in Listeria (process-control concern more than direct consumer toxicity).

Selected study sources:
- Listeria cross-protection to organic acid salts: https://pubmed.ncbi.nlm.nih.gov/25911485/
- Potassium lactate in low-sodium salami systems: https://pubmed.ncbi.nlm.nih.gov/33430446/
- Potassium lactate in marinated beef formulation studies: https://pubmed.ncbi.nlm.nih.gov/38254592/
- Inhibition studies in RTE meat systems: https://pubmed.ncbi.nlm.nih.gov/24215704/
- Query endpoint used for reproducible literature pull: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=%22potassium%20lactate%22%5BTitle%5D&retmax=50&retmode=json

## Exposure Assessment
- **Typical dietary intake:** Quantitative EU-wide intake distribution for E326 was not found in the currently active EFSA dossier (no final EFSA output yet).
- **ADI exceedance risk:**
  - EFSA: no currently published final ADI in the active re-evaluation dossier.
  - JECFA: ADI "NOT LIMITED" (for assessed use context), so numerical exceedance calculation is not provided.
- **Vulnerable populations:**
  - Infants are the clearest regulatory caution group (FDA infant-food restriction; JECFA infant-food comment).
  - High consumers of processed meats using potassium-based salt substitutes may have relatively higher additive exposure; quantitative exceedance benchmarks are not available from current EFSA dossier output.

## Risk Assessment
### 1. Tier-by-tier analysis
- **risk_free**
  - Evidence supporting: JECFA ADI "NOT LIMITED"; substance is a lactate salt related to endogenous lactate metabolism; no IARC classification found.
  - Evidence against: EFSA re-evaluation is still ongoing with no finalized output/ADI in current dossier; infant-use caveats exist.

- **limited**
  - Evidence supporting: FDA GRAS affirmation under GMP; JECFA "NOT LIMITED" ADI; no major carcinogenic classification found; available modern literature mostly shows technological/antimicrobial function rather than direct toxicity signal.
  - Evidence against: incomplete current EFSA re-evaluation leaves residual uncertainty.

- **moderate**
  - Evidence supporting: unresolved EFSA reassessment timeline and explicit infant caveats could justify a cautious interpretation.
  - Evidence against: no strong evidence of systemic toxicity, no major jurisdictional bans, no established ADI-exceedance signal in populations.

- **high**
  - Evidence supporting: none found (no major bans; no IARC 2A/2B classification found; no strong corroborated human harm signal).
  - Evidence against: core regulatory bodies continue to allow use under defined conditions.

### 2. Rationale
The strongest evidence points to a **generally permitted additive with low demonstrated toxicity at intended uses**, but with **important caveats**: infant-use restrictions and an EFSA re-evaluation that is still active and not finalized.

### 3. Recommended tier
**limited**

## Sources
- OpenEFSA API - Substance: Potassium lactate (2026). https://open.efsa.europa.eu/api/substance/get?termExtendedName=Potassium%20lactate
- OpenEFSA API - Questions for substance (2026). https://open.efsa.europa.eu/api/substance/getQuestions?termExtendedName=Potassium%20lactate
- OpenEFSA API - Question EFSA-Q-2011-00601 (E326) (2026). https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00601
- OpenEFSA API - Related re-evaluation questions (2026):
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00596
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00600
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00602
  - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00690
- eCFR API - 21 CFR 184.1639 Potassium lactate (current XML endpoint). https://www.ecfr.gov/api/versioner/v1/full/2025-01-01/title-21.xml?part=184&section=184.1639
- WHO/JECFA Database - Potassium lactate (solution), Chemical 2777. https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2777
- WHO/JECFA Database API search endpoint used. https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/potassium%20lactate
- IARC list-of-classifications page. https://monographs.iarc.who.int/list-of-classifications
- IARC search URL attempts: https://monographs.iarc.who.int/?s=potassium+lactate ; https://monographs.iarc.who.int/?s=lactic+acid
- PubMed search page. https://pubmed.ncbi.nlm.nih.gov/?term=potassium+lactate+food+additive+safety
- NCBI E-utilities search (title-focused query). https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=%22potassium%20lactate%22%5BTitle%5D&retmax=50&retmode=json
- Selected PubMed studies:
  - https://pubmed.ncbi.nlm.nih.gov/38254592/
  - https://pubmed.ncbi.nlm.nih.gov/33430446/
  - https://pubmed.ncbi.nlm.nih.gov/35250054/
  - https://pubmed.ncbi.nlm.nih.gov/24215704/
  - https://pubmed.ncbi.nlm.nih.gov/25911485/
