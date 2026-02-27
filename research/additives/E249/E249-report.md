# E249 Research Report: Potassium Nitrite

## Identity
- **E-number:** E249 (INS 249)
- **Name:** Potassium nitrite
- **CAS number(s):** 7758-09-0 (primary), 92937-66-1 (alternate registry listed in PubChem)
- **Chemical class:** Inorganic nitrite salt (alkali metal nitrite)
- **Common synonyms:** Potassium nitrite; nitrous acid, potassium salt; potassium nitrite (1:1); E-249
- **Natural vs synthetic:** Primarily **synthetic** as a food additive; nitrite can also arise endogenously and from natural dietary nitrate conversion.

**Sources:**
- WHO JECFA chemical page (CAS, INS, name): https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842
- PubChem compound record and synonyms: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/potassium%20nitrite/property/Title,MolecularFormula,CanonicalSMILES,IUPACName/JSON and https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/potassium%20nitrite/synonyms/JSON

## Function in Food
- **Primary technological role:** Preservative and colour-retention/fixative agent in cured meats.
- **Mechanism of action:** Nitrite inhibits growth of pathogens (notably *Clostridium botulinum* risk control in cured meats), stabilizes cured-meat pink/red colour via nitrosylation of meat pigments, and affects flavor chemistry in cured products.
- **Common food categories:** Cured red meat and poultry products; processed meat products.

**Sources:**
- 21 CFR 181.34 (color fixative and preservative in curing red meat and poultry): https://www.ecfr.gov/api/versioner/v1/full/2023-03-30/title-21.xml?chapter=I&subchapter=B&part=181
- WHO JECFA functional class: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842
- EFSA news summary on authorized uses in meat/fish/cheese and preservation rationale: https://www.efsa.europa.eu/en/press/news/170615

## Regulatory Status
### EFSA (EU)
- **Status:** Approved (with exposure caveats).
- **Latest re-evaluation year:** 2017 (EFSA re-evaluation of E249/E250).
- **ADI:** **0.07 mg/kg bw/day** (as nitrite ion), re-established.
- **Key EFSA conclusions:**
  - Existing safe levels for nitrites/nitrates added to food were considered sufficiently protective.
  - Exposure to nitrite from additives was generally within ADI, with slight exceedance possible in highly exposed children.
  - Considering all dietary nitrite sources, ADI exceedance may occur in multiple age groups.
  - Nitrosamine contribution from nitrite used at approved levels was considered of low concern, but uncertainty remains for other nitrite sources.
- **Access note:** The EFSA journal DOI target (`efsa.onlinelibrary.wiley.com`) returned a bot-protection challenge from this VM; EFSA's own press and journal-entry pages were used for extraction.

**Sources:**
- EFSA press/news summary (2017): https://www.efsa.europa.eu/en/press/news/170615
- EFSA scientific opinion link (journal page reference): https://www.efsa.europa.eu/en/efsajournal/pub/4786

### FDA / CFR (United States)
- **GRAS status:** Not listed as GRAS in 21 CFR Part 184; regulated as a **prior-sanctioned** use.
- **CFR citation:** **21 CFR 181.34** (Sodium nitrite and potassium nitrite).
- **Conditions of use (Title 21):** Subject to USDA prior sanctions for use as color fixatives and preservative agents, with or without sodium/potassium nitrate, in curing red meat and poultry products.
- **Access note:** Direct eCFR web page access returned a CAPTCHA-style \"Request Access\" page from this VM; data were extracted via official eCFR API endpoints.

**Sources:**
- eCFR API search result identifying 21 CFR 181.34: https://www.ecfr.gov/api/search/v1/results?query=potassium%20nitrite
- eCFR full Title 21 Part 181 text: https://www.ecfr.gov/api/versioner/v1/full/2023-03-30/title-21.xml?chapter=I&subchapter=B&part=181
- eCFR Part 184 check (no potassium nitrite listing in GRAS part): https://www.ecfr.gov/api/versioner/v1/full/2023-03-30/title-21.xml?chapter=I&subchapter=B&part=184

### JECFA / WHO
- **ADI:** **0-0.07 mg/kg bw** (expressed as nitrite ion).
- **Last evaluation year:** **2002** (59th meeting on the WHO JECFA page for potassium nitrite).
- **Key note:** ADI applies to all sources of intake but not to infants below 3 months.

**Source:**
- WHO JECFA chemical evaluation page: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842

### IARC
- **Classification relevant to nitrite exposure:** **Group 2A** for "Nitrate or nitrite (ingested) under conditions that result in endogenous nitrosation" (Volume 94; listed with publication year 2010, evaluation year 2006).
- **Important nuance:** This is not a standalone "potassium nitrite only" classification; it is a conditional exposure scenario involving endogenous nitrosation.

**Sources:**
- IARC classifications page: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
- IARC list data script (contains the specific Group 2A entry): https://webapi.iarc.who.int/loc/loc.app.js

### Notable bans
- No major jurisdiction-wide outright ban identified in the consulted EFSA/FDA/JECFA/IARC sources; use is generally **authorized but controlled/restricted by conditions and exposure limits**.

## Key Safety Evidence
### Animal studies
- JECFA reports ADI derivation referencing a 2-year rat study (NOEL 6.7 mg/kg bw/day; heart/lung effects endpoint context), with safety factor application to set 0-0.07 mg/kg bw.

**Source:** https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842

### Epidemiological and human-relevant evidence
- IARC classification supports carcinogenic concern in the specific context of ingested nitrate/nitrite with endogenous nitrosation (Group 2A).
- A 2026 scoping review (prenatal context) reported associations between higher processed-meat nitrite exposure and adverse outcomes in some human studies, while vegetable-source nitrate/nitrite tended to neutral/positive outcomes.
- A UK population study (2026) observed that higher vegetable-source nitrate/nitrite intake associated with more favorable cardiovascular risk markers, while higher processed-meat nitrate intake did not show the same profile and was associated with higher systolic BP in the highest intake quartile.

**Sources:**
- IARC data: https://webapi.iarc.who.int/loc/loc.app.js
- PubMed PMID 41248583: https://pubmed.ncbi.nlm.nih.gov/41248583/
- PubMed PMID 41297631: https://pubmed.ncbi.nlm.nih.gov/41297631/

### Mechanistic concerns
- Nitrite can drive endogenous and food-matrix nitrosamine formation under relevant conditions; recent analytical work in meat systems showed nitrosamine levels increasing with added nitrite/nitrate and especially during digestion models.
- EFSA also highlights nitrosamine formation as a key uncertainty area beyond additive-only exposure context.

**Sources:**
- PubMed PMID 41157123: https://pubmed.ncbi.nlm.nih.gov/41157123/
- EFSA news summary: https://www.efsa.europa.eu/en/press/news/170615

### Market-level residue/exposure data (recent)
- Turkey market study (2026): processed meats measured below EU 150 mg/kg nitrite legal limit; modeled intake approached substantial fractions of ADI at high consumption scenarios but non-carcinogenic hazard threshold not exceeded.
- Poland hot-dog study (2025): some samples high enough that modeled frequent intake could exceed nitrite ADI in very young children.

**Sources:**
- PubMed PMID 41652726: https://pubmed.ncbi.nlm.nih.gov/41652726/
- PubMed PMID 40707635: https://pubmed.ncbi.nlm.nih.gov/40707635/

## Exposure Assessment
- **EFSA refined exposure:** additive-only nitrite exposure generally within ADI, with slight exceedance for highly exposed children.
- **Total dietary nitrite perspective:** when all sources are combined, ADI exceedance risk broadens (infants/toddlers/children and high-exposure groups).
- **Vulnerable populations:** infants (especially very young infants per JECFA note), toddlers/children with high intake of processed meats, and potentially prenatal exposure scenarios where co-exposures are present.

**Sources:**
- EFSA: https://www.efsa.europa.eu/en/press/news/170615
- JECFA: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842
- PubMed: https://pubmed.ncbi.nlm.nih.gov/40707635/ and https://pubmed.ncbi.nlm.nih.gov/41248583/

## Risk Assessment
### 1. Tier-by-tier analysis
#### risk_free
- **Evidence supporting this tier:** Regulatory approvals exist in major jurisdictions.
- **Evidence against this tier:** Fixed ADIs are required (not "ADI not specified"), IARC has a Group 2A classification for relevant nitrate/nitrite ingestion conditions, and exposure exceedance can occur in some populations.

#### limited
- **Evidence supporting this tier:** EFSA and JECFA maintain ADIs and do not conclude immediate need for outright prohibition at regulated use levels; U.S. CFR allows specified prior-sanctioned use.
- **Evidence against this tier:** Multiple sources indicate caveats (children/high consumers, nitrosamine formation concerns, conditional carcinogenicity signal), which goes beyond "minor concerns only at high doses" in a strict sense.

#### moderate
- **Evidence supporting this tier:**
  - Approved but with clear caveats and ADI management.
  - EFSA indicates potential ADI exceedance in some subgroups.
  - Credible mechanistic and hazard signals (nitrosamines; IARC conditional Group 2A context).
  - Recent market and dietary studies continue to show subgroup-specific intake pressure.
- **Evidence against this tier:** Major authorities still allow controlled use and do not classify E249 itself as banned or universally unsafe at permitted levels.

#### high
- **Evidence supporting this tier:** Carcinogenic concern exists in specific exposure scenarios (IARC Group 2A entry for nitrate/nitrite ingestion under endogenous nitrosation).
- **Evidence against this tier:** No broad ban in major jurisdictions identified; EFSA/JECFA did not conclude inability to confirm safety at authorized levels.

### 2. Rationale
The best fit is **moderate** because E249 is still authorized but sits in a risk-managed regime with explicit ADIs, subgroup exceedance potential (especially children/high consumers), and biologically plausible nitrosamine-related concern. The evidence profile is stronger than "limited" but does not meet "high" tier triggers (e.g., broad bans or formal regulatory failure to establish safe conditions of use).

### 3. Recommended tier
**moderate**

## Sources
1. EFSA confirms safe levels for nitrites and nitrates added to food (2017)  
   URL: https://www.efsa.europa.eu/en/press/news/170615
2. EFSA Journal entry: Re-evaluation of potassium nitrite (E 249) and sodium nitrite (E 250) (2017)  
   URL: https://www.efsa.europa.eu/en/efsajournal/pub/4786
3. eCFR API search results for "potassium nitrite" (Title 21 includes 181.34)  
   URL: https://www.ecfr.gov/api/search/v1/results?query=potassium%20nitrite
4. eCFR Title 21 Part 181 full text (includes §181.34)  
   URL: https://www.ecfr.gov/api/versioner/v1/full/2023-03-30/title-21.xml?chapter=I&subchapter=B&part=181
5. eCFR Title 21 Part 184 full text (checked for GRAS listing context)  
   URL: https://www.ecfr.gov/api/versioner/v1/full/2023-03-30/title-21.xml?chapter=I&subchapter=B&part=184
6. WHO JECFA database chemical page: POTASSIUM NITRITE (accessed 2026)  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2842
7. IARC agents classified by the IARC (overview page, updated 2026)  
   URL: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
8. IARC list-of-classifications data script (contains Group entries, incl. nitrate/nitrite ingestion under endogenous nitrosation)  
   URL: https://webapi.iarc.who.int/loc/loc.app.js
9. PubMed PMID 41652726 (Food Research International, 2026)  
   URL: https://pubmed.ncbi.nlm.nih.gov/41652726/
10. PubMed PMID 40707635 (Scientific Reports, 2025)  
    URL: https://pubmed.ncbi.nlm.nih.gov/40707635/
11. PubMed PMID 41297631 (The Journal of Nutrition, 2026)  
    URL: https://pubmed.ncbi.nlm.nih.gov/41297631/
12. PubMed PMID 41248583 (Int J Hyg Environ Health, 2026)  
    URL: https://pubmed.ncbi.nlm.nih.gov/41248583/
13. PubMed PMID 41157123 (Molecules, 2025)  
    URL: https://pubmed.ncbi.nlm.nih.gov/41157123/
14. PubChem potassium nitrite record and metadata  
    URL: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/potassium%20nitrite/property/Title,MolecularFormula,CanonicalSMILES,IUPACName/JSON
15. eCFR browser route for §181.34 (inaccessible from VM without CAPTCHA)  
    URL: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-181/section-181.34?toc=1
16. EFSA journal DOI target (Wiley route blocked by challenge from VM)  
    URL: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2017.4786
