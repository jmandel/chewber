# E901 (Beeswax) Research Report

## Identity
- **E-number:** E901
- **Name:** Beeswax (white and yellow)
- **CAS number(s):** 8012-89-3 (confirmed in EFSA OpenEFSA substance record and 21 CFR 184.1973)
- **Chemical class:** Natural wax mixture (mainly long-chain esters, hydrocarbons, free fatty acids/alcohols)
- **Common synonyms:** White wax, Yellow wax, Cera alba/Cera flava, INS 901
- **Natural vs synthetic:** **Natural** (secretory product of honey bees)

**Evidence:** OpenEFSA substance record and FDA 21 CFR text show identity and CAS; CFR describes beeswax as a honey bee secretory product. JECFA chemical page identifies INS 901 and beeswax functional classes. [S1, S7, S10]

## Function in Food
- **Primary technological function:** Glazing/surface-finishing agent (protective coating and shine).
- **Other functions in regulatory texts:** Carrier, carrier solvent, release agent, stabilizer/thickener-related classes (JECFA functional class listing), flavoring adjuvant/lubricant (FDA).
- **Common food categories:** Fruit surface treatment, nuts, confectionery/hard and soft candy, chewing gum, coffee beans, and other categories where glazing is permitted.

**Mechanistic note:** The functional mechanism is primarily physical (hydrophobic surface film), inferred from EU/FDA "glazing/surface-finishing" definitions and use patterns. [S6, S7, S10]

## Regulatory Status
### EFSA / EU
- **Latest EFSA opinion located:** OpenEFSA shows **EFSA-Q-2006-021** ("Beeswax as food additive"), output **ON-615**, type **Opinion**, publication date **2007-12-20**, publisher link DOI `10.2903/j.efsa.2007.615`. [S2, S3]
- **Re-evaluation track:** OpenEFSA shows **EFSA-Q-2011-00756** ("Re-evaluation of E901 Beeswax, white and yellow") with phase **Application Withdrawn** and no output. Timeline shows withdrawal on **2012-11-29**. [S4, S5]
- **Approval status:** E901 appears in EU food additive legislation (Regulation (EC) No 1333/2008 consolidated text) across multiple authorised glazing uses.
- **ADI:**
  - **Could not be reliably extracted from accessible official EFSA pages in this VM** because the EFSA journal publisher page is behind anti-bot/Cloudflare challenge from this environment.
  - In this report, EFSA ADI is treated as **not retrievable from accessible EFSA source text** (null in abstraction JSON).

### FDA / CFR (Title 21)
- **Status:** GRAS (direct food substance affirmed as GRAS under Part 184 framework).
- **CFR citation:** **21 CFR 184.1973** (Beeswax, yellow and white).
- **Conditions of use (cGMP, max as served):**
  - 0.065% chewing gum
  - 0.005% confections/frostings
  - 0.04% hard candy
  - 0.1% soft candy
  - 0.002% or less for all other food categories
- **Additional Title 21 references found:** Part 582 includes beeswax/bleached beeswax entries tied to good manufacturing or feeding practice.

**Evidence:** eCFR API title metadata and full XML text for issue date 2026-02-19. [S9, S10]

### JECFA / WHO
- **Chemical:** BEESWAX (ID 168; INS 901)
- **ADI:** **NOT SPECIFIED**
- **Latest evaluation year shown:** **2005**
- **Key JECFA comment:** No safety concern at predicted exposure (<650 mg/person/day), based on long use history and lack of toxicity in major components.

**Evidence:** WHO/JECFA database chemical page and search API. [S7, S8]

### IARC
- **Classification result:** No beeswax-specific entry found in IARC "List of Classifications" dataset used by IARC’s own page (last update string in dataset: 2026-02-25).
- **Interpretation:** **No IARC Group 1/2A/2B/3 classification identified for beeswax**.

**Evidence:** IARC list page and the `loc.app.js` dataset it references. [S11, S12]

### Notable bans
- No major-jurisdiction ban of food additive E901 was identified in the reviewed sources.

## Key Safety Evidence
### 1) Core regulatory toxicology signal
- JECFA’s 2005 evaluation states ADI "not specified" and no safety concern at predicted dietary exposure (<650 mg/person/day), citing history of use and lack of toxicity in major components. [S7]

### 2) Recent PubMed evidence (mostly contaminant-focused rather than intrinsic E901 toxicity)
- Recent PubMed hits for "beeswax food additive safety" are limited (4 results in this query).
- 2023 reviews report that pesticide/trace element residues can accumulate in beehive products including beeswax; one review flags potential consumer risk scenarios for comb honey when specific residues (e.g., coumaphos/chlorfenvinphos) are high. [S14, S15]
- A 2020 Belgian residue study reported beeswax-related consumer exposure estimates for glyphosate/AMPA as very low fractions of ADI/ARfD in that dataset. [S16]

### 3) Data gaps
- Direct modern toxicology studies on purified food-grade E901 itself are limited in recent PubMed results; much of newer literature concerns contamination of hive matrices rather than intrinsic toxicity of the additive.

## Exposure Assessment
- **JECFA reference point:** predicted dietary exposure reported as **<650 mg/person/day** with no safety concern. [S7]
- **FDA use-level constraints:** specific low percentage maxima in foods under cGMP limit contribution from intentional use in many categories. [S10]
- **Vulnerable populations (contaminant context):** consumers of comb honey or poorly controlled hive-product sources may have higher exposure to pesticide/trace-element residues in wax matrices (not necessarily due to food-grade additive itself). [S15, S16]
- **ADI exceedance risk:**
  - For **JECFA** framework: ADI is "not specified".
  - For **EFSA**: numeric ADI could not be extracted from accessible official EFSA pages in this environment.

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Evidence supporting this tier:**
  - Natural origin and long history of use.
  - JECFA ADI "not specified" with explicit "no safety concern" language at predicted exposure.
  - No IARC carcinogenic classification identified.
- **Evidence against this tier:**
  - EFSA full opinion text/ADI details were not retrievable from accessible official pages in this VM.
  - Recent literature highlights possible residue-related concerns in wax-containing hive products.

#### `limited`
- **Evidence supporting this tier:**
  - FDA GRAS with explicit conditions and low cGMP maxima.
  - JECFA ADI "not specified" and no safety concern at predicted intake.
  - No major bans and no IARC classification.
- **Evidence against this tier:**
  - Contaminant carryover in beeswax matrices can create context-dependent risk outside well-controlled food-grade additive supply chains.

#### `moderate`
- **Evidence supporting this tier:**
  - Credible literature indicates some pesticide residue scenarios in wax matrices could pose risk to specific consumers (e.g., comb honey scenarios).
  - EFSA data-access limitations create uncertainty in this review.
- **Evidence against this tier:**
  - No broad regulatory downgrading or bans.
  - Core international evaluations remain permissive (JECFA ADI not specified; FDA GRAS).

#### `high`
- **Evidence supporting this tier:**
  - No strong supporting evidence found.
- **Evidence against this tier:**
  - Not banned in major jurisdictions reviewed.
  - No IARC Group 1/2A/2B listing for beeswax identified.
  - JECFA and FDA frameworks remain favorable.

### 2. Rationale
The weight of evidence supports a generally low-risk profile for **food-grade E901 used as authorised**, while acknowledging that **contaminant residues in wax/hive products** are a separate, real risk-management issue. The main uncertainty in this run is inability to retrieve full EFSA opinion text behind the publisher challenge.

### 3. Recommended tier
**`limited`**

## Sources
- **[S1]** OpenEFSA substance record, *Beeswax, white and yellow* (accessed 2026): https://open.efsa.europa.eu/api/substance/get?termExtendedName=Beeswax,%20white%20and%20yellow
- **[S2]** OpenEFSA question record, *EFSA-Q-2006-021 Beeswax as food additive* (accessed 2026): https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2006-021
- **[S3]** EFSA Journal publisher link for ON-615/DOI (access attempted; publisher page blocked in VM): https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2007.615
- **[S4]** OpenEFSA question record, *EFSA-Q-2011-00756 Re-evaluation of E901* (accessed 2026): https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00756
- **[S5]** OpenEFSA timeline endpoint for E901 re-evaluation question (accessed 2026): https://open.efsa.europa.eu/api/question/getTimeline?questionNumber=EFSA-Q-2011-00756
- **[S6]** EU Regulation (EC) No 1333/2008 (consolidated text), E901 entries (accessed 2026): https://eur-lex.europa.eu/eli/reg/2008/1333/2023-10-31/eng
- **[S7]** WHO/JECFA chemical page, *BEESWAX (ID 168)* (evaluation year 2005; ADI not specified): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/168
- **[S8]** WHO/JECFA search API for beeswax: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/beeswax
- **[S9]** eCFR titles API (latest issue date for Title 21): https://www.ecfr.gov/api/versioner/v1/titles.json
- **[S10]** eCFR full Title 21 XML (used to extract 21 CFR 184.1973 text and limits): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml
- **[S11]** IARC list page: https://monographs.iarc.who.int/list-of-classifications/
- **[S12]** IARC dataset script referenced by the list page (searched for beeswax entry): https://webapi.iarc.who.int/loc/loc.app.js
- **[S13]** PubMed search page, *beeswax food additive safety*: https://pubmed.ncbi.nlm.nih.gov/?term=beeswax+food+additive+safety
- **[S14]** PubMed 2023 trace elements review (PMID 37474035): https://pubmed.ncbi.nlm.nih.gov/37474035/
- **[S15]** PubMed 2023 pesticide residue review (PMID 37121430): https://pubmed.ncbi.nlm.nih.gov/37121430/
- **[S16]** PubMed 2020 glyphosate residues study (PMID 31780165): https://pubmed.ncbi.nlm.nih.gov/31780165/
