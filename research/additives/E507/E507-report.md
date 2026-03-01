# E507 (Hydrochloric acid) - Research Report

## Identity
- **E-number:** E507
- **Name:** Hydrochloric acid
- **CAS:** 7647-01-0
- **Chemical class:** Strong inorganic acid (aqueous hydrogen chloride)
- **Common synonyms:** Muriatic acid; hydrogen chloride solution
- **Natural vs synthetic:** Endogenous chloride is physiologic in humans, but food-grade hydrochloric acid used as additive is industrially manufactured (synthetic origin).

**Evidence:**
- JECFA chemical record lists name, CAS, synonym (Muriatic acid), INS 507, and functional class acid ([WHO JECFA database, accessed 2026](https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2799)).

## Function in Food
- **Primary role:** Acidity regulator / pH control agent
- **Mechanism:** Donates protons (H+) to lower pH; used for buffering/neutralization control in formulation and processing.
- **Regulatory use description (US CFR):** "buffer and neutralizing agent" under GRAS use conditions.
- **EU use breadth:** EFSA re-evaluation abstract states chlorides (including E507) are authorized in the EU and assessed across many categories.

**Evidence:**
- 21 CFR API text for 21 CFR 182.1057: GRAS as buffer and neutralizing agent under GMP ([eCFR API full Title 21 XML snapshot](https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml)).
- EFSA re-evaluation abstract (PubMed mirror) describing authorization and exposure assessment ([PubMed PMID 32626371](https://pubmed.ncbi.nlm.nih.gov/32626371/)).

## Regulatory Status
### EFSA (EU)
- **Status:** Approved/authorized (as part of chlorides E507/E508/E509/E511).
- **Latest scientific re-evaluation identified:** 2019 (EFSA Journal 17(7):5751; DOI 10.2903/j.efsa.2019.5751).
- **ADI/reference:** The EFSA panel text (as mirrored in PubMed abstract) does **not** present a classical ADI; instead it identifies a **human reference value of 40 mg chloride/kg bw/day** for assessment.
- **Key conclusion:** Exposure from E507/E508/E509/E511 at reported use levels "does not raise a safety concern"; mean exposures were below/at reference value, while some high-percentile estimates in younger groups were slightly above.

**Access note:** direct EFSA Journal pages on `efsa.europa.eu`/Wiley were Cloudflare-blocked from this VM during retrieval; data were taken from the PubMed record of the same EFSA paper.

### FDA/CFR (US)
- **Status:** GRAS.
- **Primary citation:** **21 CFR 182.1057** (Hydrochloric acid).
- **Condition of use:** GRAS when used as a **buffer and neutralizing agent** in accordance with good manufacturing practice.
- **Additional feed-use citation:** 21 CFR 582.1057 (good manufacturing or feeding practice language in the feed GRAS subpart).

**Access note:** standard `ecfr.gov/current/...` pages returned anti-bot "Request Access"; section text was extracted from eCFR's official API XML snapshot.

### JECFA/WHO
- **ADI:** **Not limited**.
- **Evaluation year shown on record:** 1965.
- **Record also shows later specification history entries (including 1976 and 1996) in "Previous Years" field.**

### IARC
- **Classification:** **Group 3** (not classifiable as to its carcinogenicity to humans) for "Hydrochloric acid" in the current IARC list dataset.
- **Entry fields extracted:** CAS 7647-01-0, volume 54, publication year 1992, evaluation year 1991.

### Notable bans
- No major jurisdictional ban identified in the retrieved EFSA/FDA/JECFA/IARC regulatory sources for food-additive use under regulated conditions.

## Key Safety Evidence
### Animal and mechanistic evidence
- EFSA summary reports chlorides as low acute oral toxicity and no concern for genotoxicity/carcinogenicity in the evaluated dataset.
- Developmental study note in EFSA abstract: no reported effects for magnesium chloride hexahydrate at 800 mg/kg bw/day in rats.
- EFSA also notes some animal findings suggesting chloride may contribute to increased blood pressure, but human data were considered more appropriate for setting the reference value.

### Human clinical/epidemiological context
- Severe harm is documented for **high-concentration corrosive ingestion** (not representative of additive-level dietary exposure).
- Recent PubMed case report (2024): 500 mL of 37% hydrochloric acid associated with severe corrosive injury, acidosis, acute tubular necrosis, and fatal outcome.
- A large emergency-department study (chemical ingestion overall) reports high admission severity for hydrochloric acid cases in intentional ingestion context.

### Interpretation for additive safety
- Available evidence separates into two exposure regimes:
  1. **Regulated additive-level exposure:** no major safety signal in EFSA/JECFA/FDA evaluations.
  2. **Poisoning-level corrosive exposure:** clear acute toxicity and potentially fatal outcomes.

## Exposure Assessment
- EFSA abstract (2019 re-evaluation) reports estimated exposure to chlorides from E507/E508/E509/E511:
  - Mean: from 2 mg/kg bw/day (elderly) to 42 mg/kg bw/day (toddlers)
  - 95th percentile: from 5 mg/kg bw/day (elderly) to 71 mg/kg bw/day (toddlers)
- EFSA reference value: 40 mg chloride/kg bw/day.
- EFSA finding: means were below/at reference value; high-percentile estimates in toddlers/children/adolescents were slightly above.

**Vulnerable populations:** high-consuming younger groups (toddlers, children, adolescents) in modeled high-percentile scenarios.

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Evidence supporting this tier:**
  - JECFA ADI is "not limited".
  - IARC Group 3 (no carcinogenic classification signal).
  - EFSA found no genotoxicity/carcinogenicity concern and no safety concern at reported use levels.
  - Chloride is physiologic/endogenous.
- **Evidence arguing against this tier:**
  - EFSA high-percentile intake estimates in younger groups were slightly above the 40 mg/kg bw/day reference value.
  - Blood-pressure-related concern was considered in the EFSA reasoning.

#### `limited`
- **Evidence supporting this tier:**
  - Approved in EU assessment context and GRAS in US CFR.
  - No major chronic toxicity signal in regulatory reviews at intended food use levels.
  - Severe harm evidence primarily reflects misuse/poisoning concentrations, not normal additive exposure.
- **Evidence arguing against this tier:**
  - High-consumer youth percentiles can exceed EFSA reference value.

#### `moderate`
- **Evidence supporting this tier:**
  - EFSA modeled slight high-percentile exceedance of the reference value in toddlers/children/adolescents.
  - Some biological plausibility around chloride and blood pressure effects.
- **Evidence arguing against this tier:**
  - EFSA still concluded no safety concern at reported use/use levels.
  - JECFA position remains ADI not limited.
  - No major carcinogenic/genotoxic concern in the retrieved regulatory data.

#### `high`
- **Evidence supporting this tier:**
  - Concentrated hydrochloric acid ingestion can cause severe/fatal corrosive injury.
- **Evidence arguing against this tier:**
  - This reflects poisoning exposure, not food-additive exposure.
  - No major regulatory bans identified for additive use under GMP.
  - IARC is Group 3 (not 2A/2B/1 trigger context from your rubric).

### 2. Rationale
The strongest weight comes from regulatory consensus for intended food use (EFSA/FDA/JECFA), which consistently indicates low concern when used as regulated. The main cautionary signal is EFSA's high-percentile modeled intake in younger groups relative to a chloride reference value, but this did not overturn EFSA's overall no-safety-concern conclusion. Acute corrosive toxicity evidence is robust but exposure-mismatched to additive use.

### 3. Recommended tier
**`limited`**

## Sources
- EFSA Panel on Food Additives and Flavourings (FAF). *Re-evaluation of hydrochloric acid (E 507), potassium chloride (E 508), calcium chloride (E 509) and magnesium chloride (E 511) as food additives* (2019). URL visited: https://pubmed.ncbi.nlm.nih.gov/32626371/
- EFSA Journal entry URL (attempted; blocked by Cloudflare in this VM): https://www.efsa.europa.eu/en/efsajournal/pub/5751
- EFSA search URL used during retrieval: https://www.efsa.europa.eu/en/search?s=E507
- eCFR API (Title 21 XML snapshot; used to extract 21 CFR 182.1057 and 582.1057 text): https://www.ecfr.gov/api/versioner/v1/full/2024-01-01/title-21.xml
- eCFR human-facing section URL attempted (blocked by anti-bot page): https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-582/subpart-B/section-582.1057
- WHO/JECFA additive database, Chemical 2799 (Hydrochloric acid): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2799
- IARC list of classifications page: https://monographs.iarc.who.int/list-of-classifications/
- IARC data script containing classification dataset (Hydrochloric acid entry extracted): https://webapi.iarc.who.int/loc/loc.app.js
- Yu CH et al. *Fatal Zargar grade 3b corrosive injury after hydrochloric acid ingestion: A case report* (2024). URL visited: https://pubmed.ncbi.nlm.nih.gov/39465708/
- Lee JH et al. *Types and clinical outcomes of chemical ingestion in emergency departments in South Korea (2011-2016)* (2020). URL visited: https://pubmed.ncbi.nlm.nih.gov/32130274/
- Sabzé A et al. *Hydrochloric acid ingestion in adults: presentation and outcomes in a 10-year retrospective cohort study* (2024, record type: Letter on PubMed). URL visited: https://pubmed.ncbi.nlm.nih.gov/39304469/
