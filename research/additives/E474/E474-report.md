# E474 (Sucroglycerides) - Research Report

## Identity
- **E-number:** E474  
- **Primary name:** Sucroglycerides  
- **INS number:** 474 (JECFA)  
- **Chemical class:** Mixed sucrose esters/glyceride-related fatty acid esters used as non-ionic emulsifiers (mixture, not a single pure compound).  
- **Common synonyms:** Sucrose glycerides; sucrose esters/glycerides mixtures; INS 474.  
- **CAS number(s):** No single CAS was clearly provided in the consulted EFSA/JECFA/FDA legal-summary pages for E474 specifically (mixture-type additive).  
- **Origin:** **Semi-synthetic** (industrial esterification/interesterification of sucrose with edible fatty acid sources).

## Function in Food
- **Mechanism:** Amphiphilic ester molecules lower oil-water interfacial tension and stabilize emulsions/foams; some preparations also affect mouthfeel and texture.
- **Common food roles:** Emulsifier and stabilizer.
- **Typical food categories (from related FDA sucrose ester framework):** baked goods, chewing gum, confections/frostings, dairy analogues, frozen dairy desserts, beverage systems with dairy ingredients, and some protective fruit coatings.

## Regulatory Status
### EFSA (EU)
- **What was found:** EFSA page for E474 (`/en/efsajournal/pub/106`) is reachable but redirects to Wiley-hosted content that is anti-bot protected from this VM.  
  - URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/106  
  - Redirect target visited: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2004.106 (Cloudflare challenge page in this VM)
- **Most usable EFSA-accessible evidence gathered:** EFSA 2018 PubMed-indexed abstract states that EFSA had established a **group ADI of 40 mg/kg bw/day** in 2004 for **E473 + E474**, and later exposure assessments reported exceedance in multiple groups (especially children/toddlers) under some scenarios.  
  - URL visited: https://pubmed.ncbi.nlm.nih.gov/32625657/
- **Interpretation:** E474 remains part of the authorised EU additive system, with group-ADI context and follow-up exposure caveats.

### FDA / CFR (US)
- **Direct eCFR access status:** blocked by anti-bot "Request Access / unblock.federalregister.gov" from this VM when trying to query Title 21 directly.  
  - URLs visited:  
    - https://www.ecfr.gov/search?search%5Bquery%5D=sucrose+fatty+acid+esters&search%5Bhierarchy%5D%5Btitle%5D=21  
    - https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-172/subpart-I/section-172.859
- **Fallback official CFR text used:** `govinfo.gov` XML for **21 CFR Sec.172.859 (Sucrose fatty acid esters)**.  
  - URL visited: https://www.govinfo.gov/content/pkg/CFR-2024-title21-vol3/xml/CFR-2024-title21-vol3-sec172-859.xml
- **Findings from CFR text:**  
  - Sucrose fatty acid esters are permitted as direct food additives under defined specs and uses.  
  - Use condition is GMP and not more than needed for intended effect.  
  - Permitted functions include emulsifier/stabilizer/texturizer roles in specified categories.
- **GRAS status (requested):** no explicit standalone GRAS listing for "sucroglycerides" was identified in the consulted Title 21 corpus; the nearest clear federal listing is food-additive permission for sucrose fatty acid esters under Sec.172.859.

### JECFA / WHO
- **Primary JECFA chemical entry:**  
  - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2341  
- **Detailed evaluation summary page:**  
  - URL visited: http://www.inchem.org/documents/jecfa/jeceval/jec_2207.htm
- **Extracted values:**  
  - **Latest evaluation year:** 1997  
  - **ADI:** **0-30 mg/kg bw**  
  - **Comment:** group ADI for sucrose esters of fatty acids and sucroglycerides

### IARC
- **IARC list page visited:** https://monographs.iarc.who.int/list-of-classifications/  
- **Underlying classification dataset script visited:** https://webapi.iarc.who.int/loc/loc.app.js  
- **Result:** no explicit "sucroglycerides" or "sucrose fatty acid esters" entry found in the IARC classification list dataset reviewed.

### Notable bans
- No major jurisdiction-wide ban was identified in the sources reviewed for E474.

## Key Safety Evidence
- **JECFA toxicology basis:** WHO Food Additives Series 40 (sucrose esters + sucroglycerides) describes a long-term rat NOEL of 2000 mg/kg bw/day and allocation of a **group ADI 0-30 mg/kg bw** due unresolved upper-dose GI/laxative concerns in humans.  
  - URL visited: http://www.inchem.org/documents/jecfa/jecmono/v040je04.htm
- **Chronic/carcinogenicity rat studies on sucrose ester preparations (supportive, not always E474-only):**  
  - 2-year study in F344 rats reported no treatment-related carcinogenic signal up to 5% diet (PMID 15019192).  
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/15019192/  
  - Chronic toxicity/carcinogenicity in Fischer rats reported no related tumor/survival effects up to 5% diet (PMID 12052001).  
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/12052001/  
  - Older subchronic sucroacetoglyceride study reported effects at high dietary level (10%), with NOAEL at 5% diet (PMID 1787849).  
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/1787849/
- **Recent PubMed landscape:** recent records are sparse for direct E474 human safety endpoints; many newer papers concern formulation/material science rather than direct dietary toxicology.

## Exposure Assessment
- EFSA 2018 refined exposure abstract (group context E473/E474) states modeled exposures exceeded the **40 mg/kg bw/day group ADI** in many populations, especially toddlers/children, while also noting likely overestimation in scenarios with missing use-level data.
  - URL visited: https://pubmed.ncbi.nlm.nih.gov/32625657/
- E474-specific contemporary intake datasets were not clearly isolated in the gathered open sources; most quantified exposure discussion is at group-additive level (E473/E474).
- **Vulnerable populations:** children/toddlers and high consumers are the main populations flagged in group-ADI exceedance scenarios.

## Risk Assessment
### 1. Tier-by-tier analysis
#### risk_free
- **Evidence supporting risk_free:**  
  - Long-term rodent studies on related sucrose ester preparations did not show carcinogenicity at tested dietary levels.  
  - No IARC carcinogenic classification found.
- **Evidence against risk_free:**  
  - JECFA retained a numeric group ADI (not "ADI not specified").  
  - EFSA group-exposure assessments reported potential ADI exceedance in some populations.

#### limited
- **Evidence supporting limited:**  
  - Approved/authorised in major systems (EU context with EFSA history; US related CFR permission; JECFA group ADI).  
  - Severe hazard signals (e.g., robust carcinogenic/genotoxic classification) were not identified.
- **Evidence against limited:**  
  - Repeated regulatory exposure caveats for high consumers (especially children/toddlers) argue that risk characterization is not uniformly low for all scenarios.

#### moderate
- **Evidence supporting moderate:**  
  - Clear group-ADI framework exists (EFSA 40 mg/kg bw/day; JECFA 0-30 mg/kg bw).  
  - Group-ADI exceedance has been reported in refined regulatory exposure scenarios for susceptible subgroups.  
  - Human tolerance uncertainty at higher doses historically influenced ADI conservatism.
- **Evidence against moderate:**  
  - Evidence is partly group-level (E473+E474), and direct contemporary E474-only exposure/safety data are limited.

#### high
- **Evidence supporting high:**  
  - Very limited.
- **Evidence against high:**  
  - No major-benchmark bans identified.  
  - No IARC Group 1/2A/2B listing found for sucroglycerides in the reviewed classification dataset.  
  - Available animal data do not show strong high-hazard signal under tested conditions.

### 2. Rationale
E474 sits in a regulated/authorised category with longstanding toxicology history and a numerical group ADI, but the recurring exposure-exceedance concern in children/toddlers under regulatory modeling prevents a "risk_free" or clearly "limited" placement without qualification. At the same time, absence of strong carcinogenic classification or broad regulatory prohibition argues against "high."

### 3. Recommended tier
**moderate**

## Sources
1. **EFSA Journal page: Opinion on sucroglycerides (E474)** (EFSA, 2004 page record; page updated later)  
   URL: https://www.efsa.europa.eu/en/efsajournal/pub/106
2. **Wiley-hosted EFSA article target for DOI 10.2903/j.efsa.2004.106** (access blocked by Cloudflare in this VM)  
   URL: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2004.106
3. **Refined exposure assessment of sucrose esters of fatty acids (E473) from its use as a food additive** (EFSA J, 2018; PMID 32625657)  
   URL: https://pubmed.ncbi.nlm.nih.gov/32625657/
4. **eCFR search/query endpoints attempted (Title 21)** (access blocked/challenge)  
   URL: https://www.ecfr.gov/search?search%5Bquery%5D=sucrose+fatty+acid+esters&search%5Bhierarchy%5D%5Btitle%5D=21  
   URL: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-172/subpart-I/section-172.859
5. **CFR-2024 Title 21 Vol 3 XML, Sec.172.859 Sucrose fatty acid esters** (US GovInfo/FDA legal text)  
   URL: https://www.govinfo.gov/content/pkg/CFR-2024-title21-vol3/xml/CFR-2024-title21-vol3-sec172-859.xml
6. **JECFA database chemical page: SUCROGLYCERIDES (INS 474)**  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2341
7. **JECFA evaluation summary: SUCROGLYCERIDES**  
   URL: http://www.inchem.org/documents/jecfa/jeceval/jec_2207.htm
8. **WHO Food Additives Series 40: Sucrose esters of fatty acids and sucroglycerides**  
   URL: http://www.inchem.org/documents/jecfa/jecmono/v040je04.htm
9. **IARC List of Classifications page**  
   URL: https://monographs.iarc.who.int/list-of-classifications/
10. **IARC list data script (contains the current agent list payload used by the page)**  
    URL: https://webapi.iarc.who.int/loc/loc.app.js
11. **Lack of toxicity or carcinogenicity of S-170, a sucrose fatty acid ester, in F344 rats** (Food Chem Toxicol, 2004; PMID 15019192)  
    URL: https://pubmed.ncbi.nlm.nih.gov/15019192/
12. **Chronic toxicity and carcinogenicity of sucrose fatty acid esters in Fischer rats** (Regul Toxicol Pharmacol, 2002; PMID 12052001)  
    URL: https://pubmed.ncbi.nlm.nih.gov/12052001/
13. **Subchronic sucroacetoglycerides rat study** (Nahrung, 1991; PMID 1787849)  
    URL: https://pubmed.ncbi.nlm.nih.gov/1787849/
