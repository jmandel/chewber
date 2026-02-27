# E351 (Potassium malate) — Research Report

## Identity
- **E-number:** E351
- **Name:** Potassium malate (OpenEFSA substance entry uses this name)
- **CAS number(s):** 585-09-1 (OpenEFSA entry for potassium malate)
- **EC number:** 209-549-2
- **Chemical class:** Potassium salt of malic acid (hydroxy-dicarboxylic acid salt)
- **Common synonyms:** Potassium salt of malic acid; dipotassium malate; INS 351(i) (JECFA); OpenEFSA common name list includes "E 351"
- **Natural vs synthetic:** Typically produced industrially by neutralizing malic acid with potassium base; malate itself is naturally present in foods and endogenous metabolism.

## Function in Food
- **Primary role:** Acidity regulator / pH adjuster.
- **Mechanism:** Provides malate anion buffering/acidification behavior to control pH and taste profile.
- **Typical categories:** For the closely related U.S. CFR malic acid entry, use is at GMP in many foods (e.g., beverages, confectionery, jams/jellies), excluding baby food.

## Regulatory Status
### EFSA
- **What was found (latest accessible EFSA records):**
  - OpenEFSA identifies potassium malate as a substance linked to E351 nomenclature and shows a published EFSA opinion record (`EFSA-Q-2008-025`, output `ON-1088`, publication date 2009-06-03) for nutritional use in food supplements.
  - Direct access to the underlying EFSA Journal full text (Wiley) was blocked in this environment by Cloudflare challenge pages.
  - EFSA call-for-data page URLs found in search results for additive re-evaluation now return 404 from EFSA site in this environment; one EFSA search result snippet indicates re-evaluation work on E296/E350/E351/E352 and states no data were submitted in the 2010 call.
- **Approval status (EFSA scientific-opinion lens):** No accessible finalized EFSA additive re-evaluation opinion text specifically establishing an EFSA ADI for E351 was retrievable here.
- **ADI:** Not identified from accessible EFSA records (value not found).
- **Evaluation year (accessible EFSA opinion metadata):** 2009 (nutrient-source opinion context).
- **Key conclusion (from accessible EFSA metadata/snippets):** potassium malate has an EFSA-published opinion history, but the additive re-evaluation conclusion text/ADI was not accessible in full from this environment.

### FDA / CFR (Title 21)
- **eCFR access status:** Direct `ecfr.gov` search requests returned a "Request Access" block in this environment.
- **Fallback CFR source used:** Official U.S. GovInfo XML CFR text.
- **GRAS/CFR finding:** `21 CFR 184.1069` affirms **malic acid** as GRAS, used in food (except baby food) at GMP with listed maximum served-use levels.
- **Potassium malate-specific finding:** No explicit "potassium malate" entry found in downloaded 2024 Title 21 CFR volumes searched by text match (`potassium malate` not found; only malic acid and other malate mentions such as diethyl malate).
- **Conditions of use (from 21 CFR 184.1069):** GMP; excludes baby food; includes category maxima (e.g., 3.4% nonalcoholic beverages, 0.7% all other food categories).

### JECFA / WHO
- **INS 351(i):** JECFA entry reports **ADI: NOT SPECIFIED**, evaluation year **1982**, with comment that it is included in group ADI for DL-malic acid and sodium/potassium/calcium salts.
- **INS 351(ii):** Search results to JECFA database indicate evaluation year **2015** note stating not re-evaluated and provisions withdrawn at CCFA47 (page intermittently returned server error when directly fetched from this VM).

### IARC
- **Result:** No evidence of a dedicated IARC monograph classification entry for potassium malate/malic acid as an agent in the IARC "List of Classifications" dataset used by the current IARC classifications app payload.

### Notable bans
- No major-jurisdiction ban identified from the sources accessed in this run.

## Key Safety Evidence
- **Regulatory toxicology baseline:** JECFA group ADI for malic acid salts is "not specified," generally interpreted as low concern at intended use levels.
- **Mechanistic context:** Malate is a normal intermediate in central metabolism (TCA cycle), supporting low intrinsic hazard expectations.
- **Animal/human evidence identified in PubMed search:**
  - Direct potassium-malate food-additive-specific modern toxicology studies were sparse.
  - A rat nutrition paper involving potassium organic salts (including malate as part of plant-organic-anion context) focused on acid-base/fermentation physiology, not severe toxicity outcomes.
  - A safety assessment paper on malic acid and sodium malate (cosmetic context) concluded safety in the assessed-use context; relevance to food-additive oral exposure is indirect.
- **Potential concern signal:** Potassium load could be relevant for susceptible populations (e.g., severe renal impairment/hyperkalemia risk) depending on cumulative intake from all potassium sources.

## Exposure Assessment
- **Typical dietary intake:** A dedicated current EFSA dietary exposure estimate for E351 was not retrieved from accessible sources in this run.
- **ADI exceedance risk:**
  - For JECFA, ADI is "not specified" (group), so classic numeric ADI exceedance comparison is not applicable.
  - Practical risk still depends on total potassium exposure for sensitive groups.
- **Vulnerable populations:** Individuals with impaired renal potassium handling, patients on potassium-retaining medications, and medically managed low-potassium diets.

## Risk Assessment
### 1. Tier-by-tier analysis
- **risk_free**
  - Evidence supporting: JECFA group ADI "not specified"; malate is endogenous/naturally present; no IARC carcinogenic classification found.
  - Evidence against: EFSA additive re-evaluation conclusion text/ADI not directly retrievable here; FDA CFR lacks explicit potassium-malate-specific listing.
- **limited**
  - Evidence supporting: Longstanding international use context, JECFA low-concern framing, absence of strong hazard signals in retrieved literature, and no IARC listing.
  - Evidence against: Data-access gaps (EFSA full opinion text inaccessible; eCFR blocked; sparse modern potassium-malate-specific oral toxicology papers).
- **moderate**
  - Evidence supporting: Regulatory ambiguity for U.S. explicit listing and incomplete modern exposure/toxicology retrieval could justify caution.
  - Evidence against: No strong animal/human harm signal, no major regulatory downgrades, no carcinogenic classification.
- **high**
  - Evidence supporting: None identified.
  - Evidence against: No major bans found, no IARC 2A/2B/1 signal for this substance, and JECFA ADI framework does not indicate high concern.

### 2. Rationale
The strongest direct evidence available is JECFA's "ADI not specified" group assessment and absence of IARC carcinogenic classification. The main limiting factors are retrieval/access constraints and lack of potassium-malate-specific modern oral safety datasets in PubMed.

### 3. Recommended tier
- **Recommended tier: `limited`**

## Sources
1. **OpenEFSA API — Substance: Potassium malate** (accessed 2026)  
   URL: https://open.efsa.europa.eu/api/substance/get?termExtendedName=Potassium%20malate
2. **OpenEFSA API — Questions linked to Potassium malate** (accessed 2026)  
   URL: https://open.efsa.europa.eu/api/substance/getQuestions?termExtendedName=Potassium%20malate
3. **OpenEFSA API — Question EFSA-Q-2008-025 metadata** (accessed 2026)  
   URL: https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2008-025
4. **EFSA call page URL (currently 404 in this environment)** (accessed 2026)  
   URL: https://www.efsa.europa.eu/en/calls/call-data-additives-2024
5. **JECFA database — Chemical 2287 (INS 351i)** (accessed 2026)  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2287
6. **JECFA database — Chemical 8728 (INS 351ii) (intermittent server error in VM)** (accessed 2026)  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/8728
7. **eCFR search URL (blocked by request-access page in this environment)** (accessed 2026)  
   URL: https://www.ecfr.gov/search?query=malic%20acid&title=21
8. **GovInfo CFR XML — 21 CFR 184.1069 (Malic acid)** (2024 edition, accessed 2026)  
   URL: https://www.govinfo.gov/content/pkg/CFR-2024-title21-vol3/xml/CFR-2024-title21-vol3-sec184-1069.xml
9. **IARC Monographs — List of Classifications page** (accessed 2026)  
   URL: https://monographs.iarc.who.int/list-of-classifications/
10. **IARC classifications app dataset payload** (accessed 2026)  
    URL: https://webapi.iarc.who.int/loc/loc.app.js
11. **PubMed search — potassium malate** (accessed 2026)  
    URL: https://pubmed.ncbi.nlm.nih.gov/?term=potassium+malate
12. **PubMed PMID 11358110 — Final report on safety assessment of Malic Acid and Sodium Malate** (2001)  
    URL: https://pubmed.ncbi.nlm.nih.gov/11358110/
13. **PubMed PMID 17381878 — Effects of plant food potassium salts ... in rats** (2007)  
    URL: https://pubmed.ncbi.nlm.nih.gov/17381878/
14. **Crossref DOI metadata for EFSA 2009 opinion record** (accessed 2026)  
    URL: https://api.crossref.org/works/10.2903/j.efsa.2009.1088
