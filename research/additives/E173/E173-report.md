# E173 (Aluminium) Research Report

## Identity
- **E-number:** E173
- **Name:** Aluminium (metallic aluminum powder)
- **CAS number(s):** 7429-90-5
- **Chemical class:** Elemental metal color additive (inorganic metallic pigment)
- **Common synonyms:** Aluminum, aluminum powder, metallic aluminum, aluminium flake
- **Natural vs synthetic:** Aluminium is naturally occurring as an element, but food-grade additive material is manufactured as finely divided powder from virgin aluminum (industrial/synthetic preparation for additive use).

Evidence:
- PubChem synonym record lists `7429-90-5`, `Aluminum powder`, and `Metallic aluminum` (PubChem PUG REST, accessed 2026-02-27: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5359268/synonyms/JSON).
- U.S. CFR identity text states aluminum powder is made from virgin aluminum and finely divided particles (21 CFR §73.1645 via eCFR API: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml).

## Function in Food
- **Primary function:** Colour/decorative surface coating (metallic appearance).
- **Mechanism of action:** Reflective metallic particles create a silver/metallic visual effect on product surfaces.
- **Common food categories (EU):** Restricted use as external coating of sugar confectionery for decoration of cakes and pastries (Food Category 05.4), at quantum satis.

Evidence:
- EU Annex II listing shows E173 Aluminium and the condition: "only external coating of sugar confectionery for the decoration of cakes and pastries" at quantum satis (Commission Regulation (EU) No 1129/2011: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1129).
- JECFA (aluminium powder record) describes use as silvering decoration for certain confectionery items (WHO JECFA database: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1756).

## Regulatory Status
### EFSA (EU risk assessment context)
- **Latest EFSA scientific basis located:** 2008 EFSA AFC scientific opinion on aluminium in food (including additive contribution context), with **TWI = 1 mg/kg bw/week** (not an ADI).
- **Key EFSA conclusion:** Estimated intake in parts of the population could exceed the tolerable weekly intake, particularly in some children.
- **E173 approval status in EU law:** Authorized but **restricted** to specific decorative external coating uses (not broad general coloring use).

Evidence:
- EFSA press communication summarizing the 2008 AFC opinion and TWI (1 mg/kg bw/week), plus concern for high consumers/children: https://www.efsa.europa.eu/en/press/news/afc070628.
- EFSA journal article metadata (Scientific Opinion on Safety of aluminium from dietary intake; publication date 22 May 2008): https://efsa.onlinelibrary.wiley.com/doi/full/10.2903/j.efsa.2008.754.
- EU legal authorization and restrictions for E173 in Annex II: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1129.

### FDA / CFR (United States)
- **GRAS status for metallic aluminium powder as a food additive:** Not GRAS-listed for food use as "aluminum powder".
- **Where aluminum powder is explicitly listed:**
  - **21 CFR §73.1645**: safe for coloring **externally applied drugs** (GMP).
  - **21 CFR §73.2645**: safe for coloring **externally applied cosmetics** (GMP).
- **Related but different entries:** Several aluminum salts (not metallic aluminum powder/E173) are in GRAS Part 182.

Evidence:
- eCFR API Title 21 full text, sections §73.1645 and §73.2645 conditions of use, and GRAS Part 182 entries (e.g., §182.1125-§182.1131): https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml.
- eCFR search results for "aluminum powder" in Title 21 return drugs/cosmetics sections (not food subpart entries): https://www.ecfr.gov/api/search/v1/results?query=%22aluminum%20powder%22&per_page=20&order=relevance.
- Note on access: direct HTML endpoint `https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-73` returned "Federal Register :: Request Access" from this environment; API fallback was used.

### JECFA / WHO
- **Additive-specific record (ALUMINIUM POWDER, ID 1756):**
  - **ADI:** NO ADI ALLOCATED
  - **Evaluation year:** 1977
  - **Comment:** use as silvering decoration in confectionery is very limited and was not considered a hazard.
- **Broader aluminium toxicology record (ALUMINIUM, ID 298):**
  - later PTWI framework for aluminium compounds; 2011 entry reports PTWI 2 mg/kg bw/week and notes child dietary exposure can exceed PTWI.

Evidence:
- Additive-specific JECFA page: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1756.
- Broader aluminium JECFA page: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/298.

### IARC
- IARC list currently contains **"Aluminium production" (Group 1)** as an occupational exposure entry.
- No separate IARC agent entry for metallic aluminium/aluminum powder itself was identified in the list data queried.

Evidence:
- IARC list of classifications page and app data bundle used by the page:
  - https://monographs.iarc.who.int/list-of-classifications/
  - https://webapi.iarc.who.int/loc/loc.app.js

### Notable bans / market restrictions
- No global "ban" record was established from the reviewed primary sources for E173 itself.
- Regulatory pattern from reviewed sources: EU allows restricted decorative use; U.S. CFR does not list metallic aluminum powder for food coloring use (drug/cosmetic external use only).

## Key Safety Evidence
### Animal/mechanistic studies
- **Gut-visceral effects (rodents):** low-dose oral aluminum induced persistent colorectal hypersensitivity; female rodents were more sensitive; mast cells/PAR2 implicated (PMID 30534582).
- **Genotoxicity signal (rats, acute oral):** Al2O3 nanomaterials showed DNA damage in bone marrow in comet assay, without chromosomal mutation increase in micronucleus assay (PMID 32053952).
- **Hepatotoxicity + microbiome interaction (rats, 28-day oral exposure):** phase-dependent toxicity differences between alpha- and gamma-Al2O3 nanoparticles, with stronger liver toxicity in gamma phase (PMID 40139036).

### Epidemiological / exposure studies
- **Aggregated exposure assessment:** adult average dietary aluminium around half EFSA TWI; infants/young children can reach or slightly exceed TWI in some scenarios (PMID 31659427).
- **Dietary surveys:** some cohorts report children at risk of PTWI exceedance (e.g., Taiwan probabilistic analysis, PMID 33530648); other recent total-diet studies report aluminium intake not of concern in their sampled population (Sweden, PMID 40921320).

### Mechanistic concerns recurring across evidence
- Potential neurodevelopmental/reproductive and renal endpoints were central in JECFA's PTWI derivation history for aluminium compounds (WHO/JECFA record ID 298).
- Current direct E173-specific toxicology dataset is limited; much evidence is extrapolated from broader aluminium exposure literature and particle-form studies.

## Exposure Assessment
- **Direct E173 intake likely low** where use is restricted to decorative outer coatings (EU category 05.4 only).
- **Aggregate aluminium intake** (all sources, including multiple additives and background food/environment) remains the dominant risk driver in EFSA/JECFA frameworks.
- **ADI/TWI exceedance risk:**
  - EFSA (2008): high consumers, especially some children, may exceed TWI.
  - JECFA (2011 aluminium-compounds entry): children can exceed PTWI by up to ~2-fold in high dietary exposure scenarios.
- **Vulnerable populations:** children, infants (especially high-consumption or specialized diets such as soy-based formula in JECFA commentary), and potentially high-consumer subgroups.

## Risk Assessment
### 1. Tier-by-tier analysis
**risk_free**
- Evidence supporting: JECFA additive-specific entry for aluminium powder allocated no ADI in 1977 and described very limited use not considered hazardous.
- Evidence against: later EFSA/JECFA aluminium-wide assessments identify exceedance risk in children for aluminium exposure overall; direct E173-specific modern dataset is sparse.

**limited**
- Evidence supporting: EU authorization exists with narrow decorative-use restrictions; no direct IARC carcinogenic classification for metallic aluminium additive entry.
- Evidence against: toxicological concern signals exist for aluminium exposure generally (neurodevelopmental/reproductive/renal concerns in PTWI history), plus animal mechanistic findings for oral aluminum forms.

**moderate**
- Evidence supporting: approved but restricted use, with broader aluminium exposure guidance values that may be exceeded in some child populations; credible animal/mechanistic evidence suggests potential hazard at relevant oral exposures depending on form/dose.
- Evidence against: direct E173 exposure is often low and limited by use pattern; some recent population datasets do not indicate aluminium concern.

**high**
- Evidence supporting: U.S. CFR does not authorize metallic aluminum powder as a food color additive; aggregate-exposure exceedance risk exists for some groups.
- Evidence against: no direct IARC Group 2A/2B/1 classification for E173 itself; no EFSA/JECFA statement that E173-specific use is unsafe under current narrow decorative conditions.

### 2. Rationale
The strongest concern is not isolated E173 decorative use in itself, but cumulative aluminium exposure from multiple sources and forms. Regulatory bodies continue to use tolerable-intake frameworks with child exceedance concerns in some contexts. Because E173 is permitted only under narrow uses in the EU and has additive-specific historical "no ADI allocated" from JECFA, evidence does not justify a "high" tier for E173 alone; however, aggregate exposure concerns prevent a "limited" or "risk_free" placement.

### 3. Recommended tier
**moderate**

## Sources
- EFSA, *Safety of aluminium from dietary intake* (AFC Panel communication), 2008 summary page. URL: https://www.efsa.europa.eu/en/press/news/afc070628
- EFSA Journal, *Scientific Opinion of the Panel on Food Additives, Flavourings, Processing Aids and Food Contact Materials on a request from European Commission on Safety of aluminium from dietary intake*, 2008. URL: https://efsa.onlinelibrary.wiley.com/doi/full/10.2903/j.efsa.2008.754
- European Commission, *Commission Regulation (EU) No 1129/2011* (Annex II entries incl. E173 restrictions), 2011. URL: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1129
- eCFR API, Title 21 full text (Food and Drugs), up to date as of 2026-02-25. URL: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml
- eCFR API search results for "aluminum powder". URL: https://www.ecfr.gov/api/search/v1/results?query=%22aluminum%20powder%22&per_page=20&order=relevance
- WHO JECFA Database, *ALUMINIUM POWDER* (ID 1756), evaluation year 1977, NO ADI ALLOCATED. URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1756
- WHO JECFA Database, *ALUMINIUM* (ID 298), including 2006/2011 PTWI history. URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/298
- IARC Monographs, *List of Classifications* page. URL: https://monographs.iarc.who.int/list-of-classifications/
- IARC list data bundle used by classifications app. URL: https://webapi.iarc.who.int/loc/loc.app.js
- PubChem PUG REST, aluminium CID lookup and synonym list (CAS/synonyms). URLs:
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aluminium/cids/JSON
  - https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5359268/synonyms/JSON
- PubMed, *Aluminum Ingestion Promotes Colorectal Hypersensitivity in Rodents*, 2019. URL: https://pubmed.ncbi.nlm.nih.gov/30534582/
- PubMed, *Genotoxicity of Aluminum and Aluminum Oxide Nanomaterials in Rats Following Oral Exposure*, 2020. URL: https://pubmed.ncbi.nlm.nih.gov/32053952/
- PubMed, *Aggregated aluminium exposure: risk assessment for the general population*, 2019. URL: https://pubmed.ncbi.nlm.nih.gov/31659427/
- PubMed, *Probabilistic Risk Analysis to Assess Dietary Exposure to Aluminum in the Taiwanese Population*, 2021. URL: https://pubmed.ncbi.nlm.nih.gov/33530648/
- PubMed, *Pediatric Health Risk Assessment for Exposure to Aluminum from Infant Formulas...*, 2022. URL: https://pubmed.ncbi.nlm.nih.gov/36010503/
- PubMed, *Phase-dependent hepatotoxicity of Aluminum oxide nanoparticles...*, 2025. URL: https://pubmed.ncbi.nlm.nih.gov/40139036/
- PubMed, *Exposure to silver, aluminium... from food in Swedish children, adolescents and adults*, 2025. URL: https://pubmed.ncbi.nlm.nih.gov/40921320/
