# E511 (Magnesium chloride) Research Report

## Identity
- **E-number:** E511
- **Name:** Magnesium chloride
- **CAS numbers identified in regulatory databases:** 7786-30-3 (listed for magnesium chloride hexahydrate in both eCFR and WHO JECFA entries)
- **Chemical class:** Inorganic chloride salt (alkaline-earth metal chloride)
- **Common synonyms:** Magnesium chloride hexahydrate, magnesium dichloride, MgCl2, INS 511 / E511, bischofite (natural mineral form)
- **Natural vs synthetic:** **Semi-synthetic / mixed origin**. eCFR states magnesium chloride occurs naturally as bischofite and is also prepared by reaction of magnesium oxide/hydroxide/carbonate with hydrochloric acid, followed by crystallization.

Evidence: [S4][S5]

## Function in Food
- **Primary technological role:** Firming agent (JECFA functional class)
- **Additional roles:** Colour retention agent (JECFA), flavoring agent/adjuvant and nutrient supplement (U.S. CFR)
- **Mechanism of action (inferred from ionic chemistry + regulatory function labels):** Dissociates to Mg2+ and Cl- ions; Mg2+ can support protein coagulation/firming effects (e.g., tofu coagulation systems), while chloride contributes to ionic strength.
- **Common food categories identified from sources:**
  - General foods under CGMP in the U.S. (no fixed maximum except good manufacturing practice)
  - Infant formula use is explicitly allowed under section 412 conditions in U.S. law
  - Bittern (magnesium chloride-rich) is described in a PubMed case report as a main ingredient of tofu coagulant

Evidence: [S4][S5][S12]

## Regulatory Status
### EFSA (EU)
- **Latest scientific re-evaluation found:** 2019 EFSA FAF opinion on chlorides (E507, E508, E509, E511).
- **Approval status:** EFSA abstract states chlorides are authorised in the EU under Annex II and III to Regulation (EC) No 1333/2008.
- **ADI / health-based guidance value:** No numerical ADI was set in the EFSA abstract; EFSA identified a **reference value of 40 mg chloride/kg bw/day**.
- **Evaluation year:** 2019
- **Key conclusions from EFSA abstract:**
  - Low acute oral toxicity for chlorides
  - No concern for genotoxicity/carcinogenicity
  - No developmental effects reported in rats at 800 mg/kg bw/day magnesium chloride hexahydrate
  - Mean exposure estimates were at/below 40 mg chloride/kg bw/day
  - 95th percentile estimates were slightly above this value in toddlers/children/adolescents
  - Overall conclusion: exposure from E507/E508/E509/E511 at reported uses does not raise a safety concern

Access note:
- Direct EFSA page and Wiley DOI landing URL were visited; Wiley content was bot-protected in this VM session, so EFSA details were extracted from the EFSA-linked PubMed record and EFSA publication page metadata.

Evidence: [S1][S2][S3]

### FDA / eCFR (U.S.)
- **GRAS status:** Yes. Magnesium chloride is listed in **21 CFR 184.1426** within Part 184 (direct food substances affirmed as GRAS).
- **CFR citation:** **21 CFR 184.1426**
- **Conditions of use (from section text):**
  - Use is permitted with no limitation other than current good manufacturing practice (CGMP)
  - Functional uses include flavoring agent/adjuvant and nutrient supplement
  - May be used in infant formula in accordance with section 412 of the Federal Food, Drug, and Cosmetic Act

Access note:
- Human-facing `ecfr.gov` pages were CAPTCHA-protected in this session; official eCFR API endpoints on `ecfr.gov` were used to retrieve the current legal text.

Evidence: [S4]

### JECFA / WHO
- **ADI:** **NOT LIMITED**
- **Last evaluation year shown:** **1979**
- **Comment:** Included in the ADI group for hydrochloric acid and bases.

Evidence: [S5]

### IARC
- **Classification found for magnesium chloride:** None identified.
- IARC’s "Agents classified" pages were checked, and the official list application bundle data (`loc.app.js`, last update shown as 2026-02-25 16:34 CET) was searched; no magnesium chloride entry was found.

Evidence: [S6][S7][S8]

### Notable bans
- No major-jurisdiction bans were identified from EFSA/FDA/JECFA/IARC sources reviewed in this session.

## Key Safety Evidence
### Animal studies
- **Long-term carcinogenicity (B6C3F1 mice, 1989):** No carcinogenicity signal for magnesium chloride hexahydrate in the reported long-term feeding study.
- **13-week oral toxicity (B6C3F1 mice, 1994):** At high dietary concentrations (>=2.5%), kidney tubular vacuolation and body-weight decreases were observed; study authors described 2.5% diet as minimal toxic dose.
- **EFSA-reviewed developmental data:** No developmental effects in rats at 800 mg/kg bw/day magnesium chloride hexahydrate.

Evidence: [S3][S10][S11]

### Human data / case evidence
- **Fatal hypermagnesemia case (2013):** 75-year-old woman died after ingesting magnesium chloride as a folk remedy; reported postmortem serum magnesium 10.2 mg/dL.
- **Bittern intoxication case (2015):** Bittern (major component magnesium chloride) associated with hypermagnesemia (7.8 mEq/L), hypernatremia, and QT prolongation; patient recovered with treatment.

Evidence: [S12][S13]

### Mechanistic concerns
- Magnesium chloride itself is not flagged by EFSA for genotoxicity/carcinogenicity at food-use exposure context, but very high oral doses can produce clinically significant hypermagnesemia/electrolyte disturbances (case-report context).

Evidence: [S3][S12][S13]

## Exposure Assessment
- **EFSA chloride-group dietary exposure (E507/E508/E509/E511):**
  - Mean: 2 mg/kg bw/day (elderly) to 42 mg/kg bw/day (toddlers)
  - 95th percentile: 5 mg/kg bw/day (elderly) to 71 mg/kg bw/day (toddlers)
- **Reference value used by EFSA:** 40 mg chloride/kg bw/day.
- **ADI/reference exceedance risk:**
  - Mean estimates were at/below reference value.
  - High-percentile exposure was slightly above reference value in toddlers/children/adolescents.
- **Vulnerable populations from available data:**
  - Higher-exposure child age groups (for total chloride from food additives)
  - Individuals consuming concentrated magnesium chloride-containing products (poisoning-case context)

Evidence: [S3][S12][S13]

## Risk Assessment
### 1. Tier-by-tier analysis
**risk_free**
- Evidence supporting this tier:
  - JECFA ADI is "NOT LIMITED".
  - EFSA found no genotoxicity/carcinogenicity concern and concluded no safety concern at reported use levels.
  - Magnesium/chloride are normal dietary ions.
- Evidence arguing against this tier:
  - EFSA 95th-percentile chloride exposure exceeded reference value in some children.
  - High-dose animal toxicity findings (13-week study) and severe human poisoning cases at excessive intake.

**limited**
- Evidence supporting this tier:
  - FDA GRAS status with defined legal conditions of use.
  - EFSA overall no-safety-concern conclusion at reported uses.
  - JECFA ADI not limited.
  - No IARC classification identified.
- Evidence arguing against this tier:
  - Exceedance of EFSA chloride reference value at high percentiles in younger age groups.
  - High-dose case reports demonstrate real toxicity outside normal food-use conditions.

**moderate**
- Evidence supporting this tier:
  - High-percentile exposure above EFSA reference value in toddlers/children/adolescents.
  - Credible animal toxicity at sufficiently high dietary concentrations.
  - Human intoxication cases with serious outcomes.
- Evidence arguing against this tier:
  - Signals are linked to high/concentrated intake, not normal regulated food additive use.
  - Regulatory bodies reviewed here did not identify safety failure under authorized use conditions.

**high**
- Evidence supporting this tier:
  - Severe toxicity is possible in overdose/poisoning scenarios.
- Evidence arguing against this tier:
  - No major-jurisdiction ban found.
  - No IARC Group 1/2A/2B listing identified.
  - EFSA/FDA/JECFA positions remain permissive under regulated conditions.

### 2. Rationale
The strongest evidence indicates low concern under normal regulated food-use conditions, with toxicity signals primarily appearing at high or abnormal exposures (overdose/poisoning or very high-dose animal diets). EFSA exposure context does show high-percentile exceedance of its chloride reference value in some younger groups, which argues against a "risk_free" categorization.

### 3. Recommended tier
**limited**

## Sources
- **S1 (EFSA page, accessed 2026-02-27):** EFSA Journal publication page for opinion 5751
  URL: https://www.efsa.europa.eu/en/efsajournal/pub/5751
- **S2 (Wiley/EFSA DOI landing, accessed 2026-02-27):** DOI page for EFSA opinion (access challenge encountered)
  URL: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2019.5751
- **S3 (PubMed, 2019):** PMID 32626371 - EFSA chloride re-evaluation abstract with exposure/reference conclusions
  URL: https://pubmed.ncbi.nlm.nih.gov/32626371/
- **S4 (eCFR API, accessed 2026-02-27):** Title 21 Part 184 XML including §184.1426 magnesium chloride
  URL: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?part=184
- **S5 (WHO JECFA database, accessed 2026-02-27):** MAGNESIUM CHLORIDE chemical page (ID 3331)
  URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3331
- **S6 (IARC, accessed 2026-02-27):** Agents classified by the IARC Monographs page
  URL: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
- **S7 (IARC, accessed 2026-02-27):** List of Classifications page
  URL: https://monographs.iarc.who.int/list-of-classifications/
- **S8 (IARC data bundle, accessed 2026-02-27):** LOC application bundle used for classifications table
  URL: https://webapi.iarc.who.int/loc/loc.app.js
- **S9 (PubMed search, accessed 2026-02-27):** PubMed query URL used for magnesium chloride safety/toxicity search
  URL: https://pubmed.ncbi.nlm.nih.gov/?term=%22magnesium+chloride%22%5BTitle%5D+AND+%28safety+OR+toxicity+OR+hypermagnesemia+OR+adverse+OR+poisoning%29
- **S10 (PubMed, 1989):** PMID 2807100 - Lack of carcinogenicity in long-term feeding study
  URL: https://pubmed.ncbi.nlm.nih.gov/2807100/
- **S11 (PubMed, 1994):** PMID 8042199 - 13-week oral toxicity study in mice
  URL: https://pubmed.ncbi.nlm.nih.gov/8042199/
- **S12 (PubMed, 2013):** PMID 24020515 - Fatal hypermagnesemia case from magnesium chloride ingestion
  URL: https://pubmed.ncbi.nlm.nih.gov/24020515/
- **S13 (PubMed, 2015):** PMID 25949041 - Bittern intoxication case report (magnesium chloride-major component)
  URL: https://pubmed.ncbi.nlm.nih.gov/25949041/
