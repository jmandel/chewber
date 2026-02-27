# E232 Research Report - Sodium orthophenyl phenol (Sodium o-phenylphenate)

## Identity
- **E-number:** E232 (INS 232)
- **Primary name:** Sodium o-phenylphenol / Sodium o-phenylphenate
- **CAS number:** 132-27-4
- **Chemical class:** Aromatic phenolic preservative (sodium salt of o-phenylphenol / 2-phenylphenol)
- **Common synonyms:** Sodium orthophenylphenol, Sodium o-phenylphenate, Sodium o-phenylphenolate, Sodium (1,1'-biphenyl)-2-olate
- **Origin:** Synthetic

## Function in Food
- **Primary function:** Antimicrobial preservative/fungicide (post-harvest).
- **Mechanism of action (inferred from phenolic chemistry + regulatory use):** Phenolic biocidal action against microorganisms/fungi, used to suppress post-harvest spoilage organisms.
- **Common food categories:**
  - Post-harvest treatment of citrus fruits (surface/peel use context in EFSA evaluation).
  - In U.S. CFR context, listed for indirect use in paper/paperboard process chemicals (defoaming-agent formulations), not a broad GRAS direct-addition ingredient.

## Regulatory Status
### EFSA (EU)
- **Latest EFSA scientific re-evaluation found:** EFSA Journal **2015**;13(6):4143 (re-evaluation of E230, E231, E232).
- **ADI:** **0.15 mg/kg bw/day** (for orthophenylphenol and sodium orthophenylphenol).
- **Key conclusions from EFSA opinion:**
  - No genotoxicity concern.
  - Critical effects included nephrotoxicity/body-weight effects in toxicology dataset used for ADI derivation.
  - Reported use scenario at authorized levels for citrus post-harvest treatment was not a safety concern **if peel is not consumed**.
  - Conservative combined exposure scenarios could exceed ADI when whole citrus/peel-related consumption assumptions are used.
- **Interpretation:** **Restricted** approval context (not unrestricted use across foods).

### FDA / eCFR (Title 21)
- **Searched source:** eCFR API Title 21 full text and current section page.
- **Found citation:** **21 CFR 176.210** (defoaming agents used in manufacture of paper and paperboard), where **sodium orthophenylphenate** is listed in paragraph (d)(3) substance list.
- **Conditions of use (section-level):**
  - Use is in manufacture of paper/paperboard intended for food packaging/holding.
  - Quantity must not exceed amount necessary for technical effect.
- **GRAS status:** No direct GRAS listing for "sodium orthophenylphenate" was identified in the Title 21 text search performed; regulatory position from retrieved CFR evidence is best represented as **approved for specific indirect-use conditions**, not a general GRAS direct food additive.

### JECFA / WHO database
- **Entry:** WHO JECFA database chemical page for **SODIUM o-PHENYLPHENOL**.
- **ADI:** **0-0.2 mg/kg bw**.
- **Evaluation year shown:** **1964**.
- **Database comment:** Notes later JMPR work on 2-phenylphenol and dissociation context for sodium salt.

### IARC
- **Classification source:** IARC list of classifications app dataset.
- **Entry found:** "Sodium *ortho*-phenylphenate".
- **Classification:** **Group 2B** (possibly carcinogenic to humans).
- **IARC dataset fields in source:** volume Sup 7/73; publication year 1999; evaluation year 1998.

### Notable bans/restrictions
- From the sources reviewed here, the signal is **restriction/conditioned authorization** rather than a broad global ban record specific to E232.

## Key Safety Evidence
### Animal/mechanistic evidence
- EFSA re-evaluation considered chronic and multi-endpoint toxicology dataset and set ADI at 0.15 mg/kg bw/day; nephrotoxicity/body-weight effects were key drivers.
- Recent PubMed mechanistic studies (zebrafish models):
  - **2023:** OPP associated with developmental craniofacial toxicity via ROS/oxidative-stress pathways.
  - **2026 (online/dated):** OPP associated with developmental cardiotoxicity and altered cardiac progenitor-cell migration/signaling in zebrafish.

### Human/epidemiological evidence
- No strong modern human dietary epidemiology specifically isolating E232 exposure was identified in the retrieved set.
- A 2021 human reconstructed skin/airway model study of biocides including 2-phenylphenol reported airway-model viability reductions with several biocides, supporting irritation/toxicity concern in non-dietary exposure contexts.

### Mechanistic concerns
- Oxidative stress (ROS), developmental signaling interference, and tissue toxicity signals appear in non-human model systems.
- Carcinogenic hazard classification signal exists via IARC Group 2B for sodium *ortho*-phenylphenate.

## Exposure Assessment
- EFSA exposure modeling indicates a split scenario:
  - **Not a safety concern** under use assumptions where treated citrus peel is not consumed.
  - **Potential ADI exceedance** in conservative assumptions that include whole-citrus/peel consumption patterns.
- **At-risk groups:** high consumers of citrus peel-containing products; children/toddlers can be more exposed on body-weight basis in conservative scenarios.
- **Practical implication:** risk is use-pattern dependent; exposure management (especially peel-related) is central.

## Risk Assessment
### 1. Tier-by-tier analysis
#### `risk_free`
- **Evidence supporting this tier:**
  - EFSA did not identify genotoxic concern.
  - Authorized use scenarios can be within safety margin.
- **Evidence against this tier:**
  - Numeric ADIs exist (not "ADI not specified").
  - IARC Group 2B classification exists.
  - Conservative exposure scenarios may exceed ADI.

#### `limited`
- **Evidence supporting this tier:**
  - EFSA and JECFA both provide ADIs and structured risk management context.
  - U.S. CFR includes specific approved use conditions.
- **Evidence against this tier:**
  - Regulatory use is constrained rather than broad.
  - IARC 2B hazard signal and recent mechanistic developmental toxicity studies add non-trivial concern.

#### `moderate`
- **Evidence supporting this tier:**
  - Approved/restricted with explicit ADIs and conditional safe-use assumptions.
  - Exposure can exceed ADI under conservative/high-peel-consumption scenarios.
  - Credible animal/mechanistic toxicity signals (oxidative stress/developmental and cardiotoxic findings in zebrafish).
  - IARC Group 2B classification adds carcinogenic-hazard caution.
- **Evidence against this tier:**
  - EFSA concluded no genotoxic concern and identified non-concern under controlled use patterns.

#### `high`
- **Evidence supporting this tier:**
  - IARC Group 2B is a hazard flag.
- **Evidence against this tier:**
  - No clear major-jurisdiction blanket ban identified in retrieved sources.
  - EFSA/JECFA did not conclude inability to set safe intake; instead they established ADIs.
  - Current evidence better supports controlled-use risk rather than uniformly high risk.

### 2. Rationale
The evidence base supports a **conditioned-risk** profile: not risk-free, not clearly high across normal regulated use, but with meaningful caveats (ADI-based management, peel-consumption sensitivity, IARC 2B hazard classification, and ongoing mechanistic toxicity signals).

### 3. Recommended tier
**Recommended tier: `moderate`**

## Sources
1. **EFSA Journal (2015) - Re-evaluation of biphenyl (E 230), orthophenylphenol (E 231) and sodium orthophenylphenol (E 232) as food additives.**
   - URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4143
2. **EFSA search endpoint attempt (access issue in this environment).**
   - URL visited: https://www.efsa.europa.eu/en/search?search_api_fulltext=orthophenylphenol
   - Note: returned "403 - Disallowed by robots.txt" in shell access.
3. **eCFR current section page - 21 CFR 176.210.**
   - URL visited: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-176/section-176.210
4. **eCFR API full Title 21 XML (searched for sodium orthophenylphenate in Title 21 text).**
   - URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
5. **WHO JECFA database - SODIUM o-PHENYLPHENOL (chemical page).**
   - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/5232
6. **WHO JECFA database API search endpoint used to locate the chemical entry.**
   - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/phenylphenol
7. **IARC Monographs - List of classifications (app host page).**
   - URL visited: https://monographs.iarc.who.int/list-of-classifications
8. **IARC classifications dataset script (contains sodium ortho-phenylphenate Group 2B entry).**
   - URL visited: https://webapi.iarc.who.int/loc/loc.app.js
9. **PubMed (PMID: 41365378) - O-phenylphenol induces cardiac injury in zebrafish.**
   - URL visited: https://pubmed.ncbi.nlm.nih.gov/41365378/
10. **PubMed (PMID: 37268146) - Craniofacial toxicity via ROS/oxidative stress in zebrafish embryos.**
   - URL visited: https://pubmed.ncbi.nlm.nih.gov/37268146/
11. **PubMed (PMID: 33596452) - Skin irritation and inhalation toxicity of biocides including 2-phenylphenol in reconstructed human models.**
   - URL visited: https://pubmed.ncbi.nlm.nih.gov/33596452/
