# E321 (Butylated hydroxytoluene, BHT) — Research Report

## Identity
- **E-number:** E321.
- **Primary name:** Butylated hydroxytoluene (BHT).
- **CAS number(s):** 128-37-0.
- **Chemical class:** Synthetic phenolic antioxidant.
- **Common synonyms:** 2,6-di-tert-butyl-4-methylphenol, DBPC, BHT.
- **Natural vs synthetic:** Predominantly **synthetic** in food/additive use contexts.

Evidence:
- PubChem CID 31404 returns IUPAC name `2,6-ditert-butyl-4-methylphenol` and synonyms including `BHT`, `DBPC`, and `128-37-0` [S9, S10].
- Recent toxicology literature describes BHT among "synthetic phenolic antioxidants (SPAs)" [S13].

## Function in Food
- **Technological function:** Antioxidant/preservative to slow oxidative rancidity.
- **Mechanism of action (functional):** Chain-breaking antioxidant behavior in lipid systems (inferred from its regulatory use limits tied to fat/oil content and antioxidant class).
- **Common food categories:** Fat- and oil-containing foods (including foods containing essential oils); broader use is constrained by regulatory concentration limits.

Evidence:
- FDA/eCFR places BHT under "Synthetic antioxidants" with a concentration ceiling based on food fat/oil content [S4].
- FDA/eCFR GRAS section defines use as an antioxidant in food under GMP [S3].

## Regulatory Status
### EFSA (EU)
- **Latest located EFSA food-additive re-evaluation/opinion:** 2012 (EFSA ANS Panel; EFSA Journal 2012;10(3):2588) [S1].
- **ADI:** Temporary ADI of **0.25 mg/kg bw/day** [S1].
- **Key conclusion:** EFSA concluded no safety concern at currently permitted uses/use levels, while noting that if all foods in all categories contained BHT at maximum permitted levels, exposure could exceed the ADI [S1].
- **Approval status interpretation:** **Approved/authorised with restrictions and ADI-based caveats** (inferred from EFSA "currently permitted uses" wording plus ongoing authorised-use framework).

Accessibility note:
- Direct DOI page (`https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2588`) was inaccessible via Cloudflare challenge during this run; data were extracted from the EFSA Science Media Centre page summarizing the same opinion [S2, S1].

### FDA / eCFR (US)
- **GRAS status:** `21 CFR 182.3173` states BHT is affirmed as generally recognized as safe (GRAS) when used as an antioxidant in food consistent with GMP [S3].
- **Specific CFR citation and conditions:** `21 CFR 172.115` allows use as a synthetic antioxidant in food with total antioxidant content not exceeding **0.02% of fat/oil content** (including essential oils), including cumulative limits with BHA, propyl gallate, and TBHQ [S4].

### JECFA / WHO
- **ADI:** **0–0.3 mg/kg bw** [S6, S5].
- **Last evaluation year (latest shown):** **1995** [S6].
- **Historical context:** Earlier temporary ADIs (e.g., 0–0.125 mg/kg bw) are listed in prior years [S6].

### IARC
- **Classification:** **Group 3** (not classifiable as to carcinogenicity to humans) for "Butylated hydroxytoluene (BHT)" in IARC Monographs listing [S8].
- **Evaluation metadata in list:** Volume 40/Supplement 7; evaluation year shown as 1987 [S8].

### Notable bans
- No major jurisdiction-wide food-use ban was identified in the regulatory sources reviewed here (EFSA/FDA/JECFA/IARC set) [S1, S3, S4, S6, S8].

## Key Safety Evidence
### Animal / experimental evidence
- **Zebrafish metabolite toxicity (2025):** Multiple BHT metabolites produced developmental toxicity endpoints (morphological abnormalities, heart-rate and locomotor changes; metabolite-specific LC50 estimates reported) [S12].
- **Zebrafish mechanism study (2025):** BHT exposure induced spinal malformations/scoliosis; authors report Hedgehog pathway suppression and rescue with pathway activation [S14].
- **Human stem-cell model data (2025):** SPAs and BHT transformation products altered differentiation-associated gene expression and suggested skin sensitization potential in in vitro differentiation models [S13].

### Human/epidemiological evidence
- **Human biomonitoring (Germany, 2025):** BHT metabolite (BHT acid) detected in the vast majority of sampled populations; interpretation uncertainties remain (notably metabolism variability and reverse-dosimetry uncertainty, especially in children) [S15].
- **Epidemiological disease-outcome data:** No robust prospective epidemiological outcome dataset was identified in this targeted run; current recent human evidence retrieved was primarily biomonitoring/exposure characterization [S12, S16].

### Mechanistic concerns
- Developmental/neurodevelopmental and pathway-level concerns are being reported in newer model systems (zebrafish, hESC differentiation), but translation to real-world human dietary risk at regulated intakes remains uncertain [S13, S14, S15].

## Exposure Assessment
- **EFSA estimated exposure (brand-loyal scenario):**
  - Mean exposure: **0.01–0.31 mg/kg bw/day** (highest in toddlers/children/adolescents).
  - High exposure: **0.03–1.29 mg/kg bw/day** (highest in toddlers/children/adolescents).
  - At maximum permitted levels across all foods, ADI exceedance would occur in all age groups [S1].
- **JECFA intake context:** JECFA reports historical intake estimates that exceeded the ADI in some datasets/populations, though not uniformly across all reporting countries [S6].
- **Vulnerable populations:** Young children/toddlers are the most likely subgroups for higher bodyweight-adjusted intake; uncertainty in metabolism also complicates child risk interpretation in biomonitoring frameworks [S1, S16].

## Risk Assessment
### 1. Tier-by-tier analysis
#### risk_free
- **Evidence supporting this tier:** BHT remains authorized in major frameworks; IARC does not classify it as a human carcinogen hazard (Group 3) [S8].
- **Evidence against this tier:** EFSA set a **temporary** ADI with exposure exceedance scenarios, and newer experimental studies show developmental/mechanistic toxicity signals [S1, S12, S13, S14].

#### limited
- **Evidence supporting this tier:** FDA GRAS affirmation with explicit GMP and concentration limits; EFSA concluded no safety concern at currently permitted uses/use levels; JECFA has a numeric ADI [S1, S3, S4, S6].
- **Evidence against this tier:** EFSA and JECFA both describe contexts where ADIs may be exceeded in subsets/scenarios; emerging mechanistic/developmental evidence argues against a minimal-concern interpretation [S1, S6, S12, S13, S14].

#### moderate
- **Evidence supporting this tier:** Additive is approved but with clear caveats: temporary ADI (EFSA), modeled exceedances especially in younger groups, and credible animal/mechanistic concerns in recent literature [S1, S12, S13, S14].
- **Evidence against this tier:** Regulatory bodies still permit use with controls, and no strong human causal epidemiology signal was identified in this run [S1, S3, S4, S15].

#### high
- **Evidence supporting this tier:** Some modern studies report developmental toxicity/mechanistic disruption in model organisms/cells [S12, S13, S14].
- **Evidence against this tier:** No major-jurisdiction food-use ban found; IARC Group 3 status; continuing FDA GRAS and EFSA/JECFA ADI frameworks are inconsistent with a high-tier designation at regulated use [S1, S3, S4, S6, S8].

### 2. Rationale
The evidence base supports a **regulated-but-caveated** profile: major authorities still authorize BHT, but they pair this with quantitative intake limits and acknowledge exceedance risk under certain exposure patterns. Recent mechanistic/developmental findings strengthen concern for higher-dose or susceptible-population contexts, without yet constituting broad human-outcome proof at permitted dietary levels.

### 3. Recommended tier
**moderate**.

## Sources
- **[S1] EFSA Science Media Centre (2012).** "Butylated hydroxytoluene (BHT)"; includes ADI, exposure ranges, and key conclusion.  
  URL: https://www.efsa.europa.eu/en/news/butylated-hydroxytoluene-bht
- **[S2] EFSA Journal DOI landing page (access attempt).** Cloudflare challenge encountered during this run.  
  URL: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2012.2588
- **[S3] eCFR Title 21, §182.3173.** Butylated hydroxytoluene; affirmed as GRAS when used as antioxidant under GMP.  
  URL: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-182/subpart-D/section-182.3173
- **[S4] eCFR Title 21, §172.115.** BHT synthetic antioxidant use condition including 0.02% fat/oil-based limit and cumulative antioxidant rule.  
  URL: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-172/subpart-B/section-172.115
- **[S5] WHO JECFA API search endpoint (BHT).** Returns ADI and chemical ID.  
  URL: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/BUTYLATED%20HYDROXYTOLUENE
- **[S6] WHO JECFA chemical detail page (ID 2142).** Evaluation year, ADI, intake note, historical evaluations.  
  URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2142
- **[S7] IARC list of classifications page (container page).**  
  URL: https://monographs.iarc.who.int/list-of-classifications/
- **[S8] IARC LOC dataset bundle (`loc.app.js`).** Contains BHT row with Group 3 and evaluation metadata.  
  URL: https://webapi.iarc.who.int/loc/loc.app.js
- **[S9] PubChem CID lookup by name (CID 31404).**  
  URL: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/2%2C6-di-tert-butyl-4-methylphenol/cids/JSON
- **[S10] PubChem synonyms endpoint (CID 31404).** Includes BHT/DBPC/CAS synonym records.  
  URL: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/31404/synonyms/JSON
- **[S11] PubMed search query page used for recent safety studies.**  
  URL: https://pubmed.ncbi.nlm.nih.gov/?term=butylated+hydroxytoluene+toxicity
- **[S12] PubMed record (PMID 40050344).** Developmental and toxicological effects of BHT metabolites on zebrafish larvae (2025).  
  URL: https://pubmed.ncbi.nlm.nih.gov/40050344/
- **[S13] PubMed record (PMID 40250273).** Developmental toxicity/skin sensitization potential in hESC models (2025).  
  URL: https://pubmed.ncbi.nlm.nih.gov/40250273/
- **[S14] PubMed record (PMID 40775025).** BHT-induced zebrafish spinal defects via Hedgehog pathway inhibition (2025).  
  URL: https://pubmed.ncbi.nlm.nih.gov/40775025/
- **[S15] PubMed record (PMID 41399998).** Human biomonitoring of BHT in Germany (2025).  
  URL: https://pubmed.ncbi.nlm.nih.gov/41399998/
- **[S16] NCBI E-utilities efetch (used to extract abstracts for PMIDs above).**  
  URL: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40050344,40250273,40775025,41399998&retmode=xml
