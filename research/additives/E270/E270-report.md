# E270 (Lactic acid) Research Report

## Identity
- **E-number:** E270
- **Name:** Lactic acid
- **Primary CAS numbers found:** 50-21-5 (general lactic acid), 598-82-3 (DL mixture), 79-33-4 (L-isomer), 10326-41-7 (D-isomer)
- **Chemical class:** Organic acid / acidity regulator
- **Common synonyms:** 2-hydroxypropanoic acid; 2-hydroxypropionic acid; DL-lactic acid
- **Natural vs synthetic:** Naturally occurs in foods and in metabolism; commercial material can be produced by carbohydrate fermentation or chemical synthesis.

Evidence:
- EFSA OpenEFSA substance record lists lactic acid as E270 with CAS 50-21-5 and IUPAC 2-hydroxypropanoic acid. [S1]
- 21 CFR 184.1061 lists additional CAS numbers for DL, L, and D forms and states natural occurrence plus fermentation/synthetic production routes. [S3]
- JECFA chemical page (INS 270) lists CAS 50-21-5 and chemical name 2-hydroxypropanoic acid. [S6]

## Function in Food
- **Primary technological role:** Acidity regulator / pH control.
- **Other functions:** Antimicrobial agent, curing/pickling agent, flavor enhancer, flavoring adjuvant, solvent/vehicle.
- **Mechanism:** Lowers pH and increases the proportion of undissociated acid, which inhibits growth of many microorganisms; also contributes sour taste and flavor balance.
- **Common food categories:** Broad use under GMP conditions across foods (with U.S. exception for infant foods/formulas), including acidified/fermented foods and products requiring pH control.

Evidence:
- 21 CFR 184.1061(c)(1) explicitly lists functional classes (antimicrobial, pH control, flavoring-related and others). [S3]
- 21 CFR 184.1061(c)(2) allows use in foods under GMP, except infant foods/formulas. [S3]

## Regulatory Status
### EFSA (EU)
- **Status:** Existing additive is authorised in the EU, but EFSA re-evaluation of E270 is still not finalized.
- **Latest EFSA re-evaluation status identified:** EFSA question EFSA-Q-2011-00596 is in **Ongoing Risk Assessment** with **Planned** internal status; last modified **2026-01-19**.
- **ADI:** No EFSA numerical ADI for E270 was identified from the current EFSA re-evaluation record (no final output published yet).
- **Key EFSA conclusion/status note:** EFSA record states E270 is already authorised, re-evaluation has been delayed, and a new call for data is planned in 2026.

Evidence:
- OpenEFSA question API record for EFSA-Q-2011-00596 shows `output: null`, status metadata, and the 2026 comment text. [S2]

### FDA / eCFR (U.S.)
- **Status:** Affirmed **GRAS** as a direct human food substance.
- **Citation:** **21 CFR 184.1061** (Lactic acid), with general GRAS framework in **21 CFR 184.1**.
- **Conditions of use:** GMP-limited use in foods; functional classes listed in regulation; use in food **except infant foods and infant formulas** at levels not exceeding GMP.

Evidence:
- eCFR API full Title 21 Part 184 text includes sections 184.1 and 184.1061 with these conditions. [S3]

### JECFA / WHO
- **ADI:** **NOT LIMITED (1973)** (qualitative ADI basis; no numeric mg/kg bw/day value).
- **Last evaluation year shown on JECFA chemical page:** **2001** (while ADI basis references 1973).
- **Comment on page:** “No safety concern at current levels of intake when used as a flavouring agent.”

Evidence:
- WHO JECFA chemical page for ID 3367 (LACTIC ACID, INS 270) lists evaluation year, ADI statement, and comments. [S6]
- WHO search API also returns LACTIC ACID with ADI “NOT LIMITED (1973)”. [S5]

### IARC
- **Classification:** No IARC monograph classification entry for lactic acid (CAS 50-21-5) was identified in the current IARC list dataset.

Evidence:
- IARC list-of-classifications page loads data from `loc.app.js`; no `lactic acid` or `50-21-5` entry was found in that dataset snapshot. [S7][S8]

### Notable bans
- No major-jurisdiction ban found from the reviewed EFSA/FDA/JECFA/IARC sources.

## Key Safety Evidence
- **General toxicology/regulatory signal:** Strong regulatory consensus for low concern at normal food use levels (FDA GRAS under GMP; JECFA ADI not limited).
- **Mechanistic/regulatory context:** EFSA’s 2020 E472a-f re-evaluation (which includes lactic-acid-containing esters) reported no human-relevant adverse effects from available toxicology for those esters and no need for a numerical ADI for E472a-c, consistent with low concern for normal hydrolysis products such as lactic acid. This is supportive but indirect for E270 itself. [S12]
- **Human clinical concern area:** Recent PubMed literature flags **D-lactic acidosis** mainly in vulnerable groups (short bowel syndrome / intestinal failure), with neurologic symptoms and metabolic acidosis linked to altered carbohydrate fermentation and D-lactate accumulation, not typical exposure in healthy populations. [S9][S10][S11]

## Exposure Assessment
- **Typical intake quantification:** A robust current EFSA exposure estimate specific to E270 was not identified because the EFSA re-evaluation output is still pending.
- **ADI exceedance risk:** Numeric ADI exceedance cannot be calculated (no EFSA numeric ADI; JECFA ADI is qualitative “NOT LIMITED”).
- **Practical risk framing:**
  - For general populations, current regulatory framing indicates low concern at normal use.
  - For vulnerable populations (especially short bowel syndrome/intestinal failure), D-lactate-related complications are plausible and documented clinically.
  - U.S. regulation already excludes infant foods/formulas under 21 CFR 184.1061(c)(2), reflecting a conservative boundary for sensitive groups.

## Risk Assessment
### 1. Tier-by-tier analysis
**risk_free**
- Supporting evidence:
  - JECFA ADI is “NOT LIMITED (1973)”.
  - Lactic acid is a normal dietary/metabolic constituent.
  - FDA affirms broad GRAS use under GMP.
- Evidence against:
  - EFSA’s dedicated E270 re-evaluation is not finalized (current status planned/ongoing), so an up-to-date EFSA conclusion is missing.
  - Susceptible subgroups can develop D-lactic acidosis under specific clinical conditions.

**limited**
- Supporting evidence:
  - FDA GRAS status with explicit use conditions.
  - JECFA low-concern ADI framing and comment of no safety concern at current flavouring intake.
  - No IARC carcinogenic classification found.
- Evidence against:
  - Lack of finalized modern EFSA E270 re-evaluation introduces uncertainty in EU-specific contemporary risk characterization.

**moderate**
- Supporting evidence:
  - There are clinically relevant case reports and case-control findings for D-lactic acidosis in vulnerable populations.
  - EFSA E270 re-evaluation delay means current EFSA exposure/ADI refinement is incomplete.
- Evidence against:
  - No major regulator among reviewed sources indicates broad population-level hazard at authorized food use.
  - No major-jurisdiction ban found.

**high**
- Supporting evidence:
  - None identified from reviewed regulatory/scientific sources.
- Evidence against:
  - No IARC Group 2A/2B/1 listing found for lactic acid.
  - No EFSA/FDA/JECFA signal of broad severe risk at standard food uses.

### 2. Rationale
The strongest evidence supports low baseline concern for general consumers (FDA GRAS + JECFA not-limited ADI), but not enough to classify as fully `risk_free` because EFSA’s specific E270 re-evaluation is still pending and vulnerable groups (short bowel syndrome/intestinal failure) have documented D-lactate complications.

### 3. Recommended tier
**limited**

## Sources
S1. EFSA OpenEFSA API, substance record “Lactic acid” (accessed 2026-02-27)  
https://open.efsa.europa.eu/api/substance/get?termExtendedName=lactic%20acid

S2. EFSA OpenEFSA API, question EFSA-Q-2011-00596 “Re-evaluation of E270…” (accessed 2026-02-27)  
https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00596

S3. eCFR API, Title 21 Part 184 XML (including 21 CFR 184.1 and 184.1061), issue/amendment date stream current to 2026-02-19 (accessed 2026-02-27)  
https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml?subtitle=B&chapter=I&subchapter=B&part=184

S4. eCFR API metadata for Title 21 versions (latest issue/amendment date) (accessed 2026-02-27)  
https://www.ecfr.gov/api/versioner/v1/versions/title-21.json

S5. WHO JECFA search API endpoint showing LACTIC ACID ADI string (accessed 2026-02-27)  
https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/lactic%20acid

S6. WHO JECFA chemical page for LACTIC ACID (ID 3367) with ADI/evaluation-year details (accessed 2026-02-27)  
https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3367

S7. IARC Monographs “List of Classifications” page (accessed 2026-02-27)  
https://monographs.iarc.who.int/list-of-classifications

S8. IARC classifications data bundle used by the list page (accessed 2026-02-27)  
https://webapi.iarc.who.int/loc/loc.app.js

S9. PubMed: “Factors associated with D-lactic acidosis in pediatric intestinal failure: A case-control study.” (2024)  
https://pubmed.ncbi.nlm.nih.gov/38374557/

S10. PubMed: “Metabolic acidosis due to d-lactate in a patient with intestinal resection...” (2025)  
https://pubmed.ncbi.nlm.nih.gov/39740424/

S11. PubMed: “D-lactic acidosis in short bowel syndrome: are probiotics friend or foe? A case report.” (2025)  
https://pubmed.ncbi.nlm.nih.gov/40673340/

S12. PubMed/EFSA Journal: “Re-evaluation of acetic acid, lactic acid... E472a-f...” (2020)  
https://pubmed.ncbi.nlm.nih.gov/32874250/

### Access notes
- Direct crawling of some human-facing EFSA/eCFR pages returned bot-protection responses during this session; official API endpoints above were used as authoritative alternatives.
