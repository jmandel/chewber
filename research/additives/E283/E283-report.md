# E283 Research Report: Potassium propionate

## Identity
- **E-number:** E283 (INS 283)
- **Primary name:** Potassium propionate (potassium propanoate)
- **CAS number(s):** 327-62-8 (potassium propionate); related parent acid CAS 79-09-4 (propionic acid)
- **Chemical class:** Short-chain carboxylate salt (propionate preservative)
- **Common synonyms:** Potassium propionate, potassium propanoate, propanoic acid potassium salt
- **Natural vs synthetic:** Primarily **synthetic** for food-use additive production (neutralization of propionic acid), while propionic acid itself is also naturally produced by bacterial fermentation and occurs endogenously.

**Evidence used:** PubChem compound entry and synonyms; FDA CFR text on propionic acid manufacture by synthesis or bacterial fermentation.  
Sources: [PubChem](https://pubchem.ncbi.nlm.nih.gov/compound/Potassium-propionate), [PubChem PUG synonyms endpoint](https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/potassium%20propionate/synonyms/JSON), [eCFR API Title 21 XML](https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml).

## Function in Food
- **Primary technological role:** Preservative/antimicrobial (inhibits molds and some bacteria; propionate system lowers intracellular pH and disrupts microbial metabolism).
- **Regulatory functional descriptors found in CFR:** Antimicrobial agent and flavoring agent for propionic acid under GRAS conditions (direct ingredient context).
- **Common food categories:** Bakery and related preservative uses are the classic commercial context; GSFA listing places INS 283 in Table 3 (GMP-permitted contexts across many food categories).

**Evidence used:** FDA CFR antimicrobial/flavoring language for propionic acid; GSFA additive details page for INS 283 Table 3 GMP status.  
Sources: [21 CFR 184.1081 via eCFR API](https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml), [GSFA Potassium propionate details](https://www.fao.org/gsfaonline/additives/results.html?ins=283&searchBy=ins&lang=en).

## Regulatory Status
### EFSA (EU)
- **Latest EFSA opinion found:** *Scientific Opinion on the re-evaluation of propionic acid (E 280), sodium propionate (E 281), calcium propionate (E 282) and potassium propionate (E 283) as food additives* (EFSA Journal, 2014; 12(7):3779).
- **Approval status:** Re-evaluated as permitted additive group (E280-E283) with no safety concern at reported uses/levels.
- **ADI:** EFSA conclusion indicates **no need for a numerical ADI** for the group.
- **Evaluation year:** 2014.
- **Key conclusion:** No safety concern at reported uses and use levels; no numerical ADI required.

**Access note:** Direct EFSA/Wiley full-text endpoints returned `403` (bot challenge) in this environment; metadata and conclusion text were extracted from EFSA publication page discovery plus DOI metadata/search index record.

Sources: [EFSA publication page](https://www.efsa.europa.eu/en/efsajournal/pub/3779), [DOI record](https://doi.org/10.2903/j.efsa.2014.3779), [Crossref metadata](https://api.crossref.org/works/10.2903/j.efsa.2014.3779).

### FDA / CFR (U.S.)
- **Direct standalone GRAS listing for potassium propionate as direct human food ingredient:** Not found in Title 21 Part 184/582 section headers.
- **Specific Title 21 citation for potassium propionate by name:** **21 CFR 177.1210** (closures with sealing gaskets for food containers), where potassium propionate appears in optional gasket substances at **2% by weight** limitation.
- **Related GRAS context for parent acid:** **21 CFR 184.1081 (Propionic acid)** is affirmed GRAS for direct human food use under cGMP as antimicrobial/flavoring.

**Interpretation:** Potassium propionate is explicitly listed for an **indirect food-contact** use condition in 21 CFR 177.1210; direct-food GRAS affirmation is explicit for propionic acid (and separately sodium/calcium propionates in other sections), not a dedicated 184.xx section titled potassium propionate.

Sources: [eCFR API titles endpoint](https://www.ecfr.gov/api/versioner/v1/titles.json), [Title 21 XML snapshot (2026-02-25)](https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml).

### JECFA / WHO
- **WHO/JECFA entry found:** Potassium propionate chemical entry and related propionic acid group entry.
- **ADI:** **Not limited** (group ADI for sum of propionic acid and calcium, potassium, and sodium salts, expressed as propionic acid).
- **Evaluation timeline:** Year of meeting shown as 1973; prior/previous evaluations include 1997 update context.
- **Last evaluation year used for this report:** **1997** (latest listed previous evaluation), with original ADI decision at 1973 meeting.

Sources: [WHO JECFA potassium propionate page](https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3004), [WHO JECFA propionic acid page](https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3438), [GSFA detail page linking WHO/FAO JECFA lookup](https://www.fao.org/gsfaonline/additives/results.html?ins=283&searchBy=ins&lang=en).

### IARC
- **IARC monographs classification status:** No listing found for “propionic acid,” “propionate,” or “potassium propionate” in the current IARC list-of-classifications dataset.
- **Classification conclusion:** **No IARC group classification identified for potassium propionate** in the current published list.

Sources: [IARC list-of-classifications page](https://monographs.iarc.who.int/list-of-classifications/), [IARC list data script](https://webapi.iarc.who.int/loc/loc.app.js).

### Notable bans
- No major jurisdiction-wide ban identified in the reviewed EFSA/FDA/JECFA/IARC set.

## Key Safety Evidence
### Human and translational evidence
1. **Acute metabolic signaling effects in humans (2021, randomized crossover, n=28):** Oral calcium propionate challenge increased counter-regulatory hormones (glucagon/catecholamines) and endogenous glucose production signals vs placebo; authors describe potential metabolic-disruptor concern in acute setting.
2. **Earlier translational human/mouse work (2019):** Propionate exposure increased glucagon/FABP4/catecholamine signaling with insulin-resistance-related responses; chronic mouse exposure linked to weight gain in that model.

Sources: [PMID 34312159](https://pubmed.ncbi.nlm.nih.gov/34312159/), [PMID 31019023](https://pubmed.ncbi.nlm.nih.gov/31019023/).

### Experimental toxicology signals (non-regulatory endpoint studies)
1. **Drosophila model (2023):** Concentration-dependent oxidative stress, gut damage, and DNA damage signals at higher tested concentrations.
2. **In vitro human lymphocyte study (2024):** Reported cytotoxic/genotoxic markers at tested concentrations; external validity to dietary exposure remains uncertain.
3. **Allium cepa assay (2008):** Plant-cell genotoxicity signals for sodium/calcium/potassium propionates under test conditions.

Sources: [PMID 36253933](https://pubmed.ncbi.nlm.nih.gov/36253933/), [PMID 39262268](https://pubmed.ncbi.nlm.nih.gov/39262268/), [PMID 18328610](https://pubmed.ncbi.nlm.nih.gov/18328610/).

### Weight of evidence context
- Regulatory bodies (EFSA/JECFA) concluded no safety concern at permitted use levels and did not set a numerical ADI (group approach).
- Recent mechanistic/metabolic literature indicates potential effect pathways worth continued monitoring, but these have not yet translated into broad regulatory withdrawal for E283.

## Exposure Assessment
- **Numerical ADI framework:** Not applicable in the usual way because EFSA/JECFA use non-numerical ADI language for this group.
- **Practical exceedance assessment:** Traditional “ADI exceedance” calculation is not central for this additive group under current regulatory framing.
- **Potentially higher-exposure groups:** People with high intake of preservative-containing processed foods (especially bakery-style patterns), and populations with metabolic vulnerability may warrant more conservative interpretation pending stronger long-term human dose-response evidence.

## Risk Assessment
### 1. Tier-by-tier analysis
#### risk_free
- **Supports:** Long-standing regulatory acceptance; EFSA/JECFA non-numerical ADI conclusions; no IARC carcinogenic classification listing.
- **Argues against:** Emerging human/metabolic signaling findings and experimental genotoxicity studies suggest biologic activity, so “risk-free” is too strong.

#### limited
- **Supports:** Approved/allowed in major jurisdictions; no major bans found; EFSA/JECFA did not identify safety concern at authorized uses.
- **Argues against:** Some recent studies raise mechanistic concerns that could become relevant if future chronic-dose human evidence strengthens.

#### moderate
- **Supports:** Credible mechanistic studies (hormonal/metabolic and oxidative/genotoxic endpoints) exist.
- **Argues against:** Regulatory re-evaluations still conclude acceptable safety at current uses; no ADI reduction or widespread restriction trend found.

#### high
- **Supports:** Very limited support only from isolated high-dose/non-human or model-specific findings.
- **Argues against:** No major-jurisdiction ban pattern; no IARC 2A/2B classification for this agent; no regulatory finding that safety cannot be confirmed at permitted uses.

### 2. Rationale
The strongest anchor is current regulatory consensus (EFSA/JECFA/FDA framework) supporting continued permitted use, while the strongest counterweight is a set of newer mechanistic and experimental studies suggesting possible metabolic and genotoxic concerns under certain conditions. Evidence is mixed, with regulatory conclusions still clearly on the “no current safety concern at authorized use” side.

### 3. Recommended tier
**limited**

## Sources
1. EFSA Journal publication page (2014): *Re-evaluation of propionic acid (E280), sodium propionate (E281), calcium propionate (E282), potassium propionate (E283)*  
   URL: https://www.efsa.europa.eu/en/efsajournal/pub/3779
2. DOI record (2014): *EFSA Journal 12(7):3779*  
   URL: https://doi.org/10.2903/j.efsa.2014.3779
3. Crossref metadata for DOI 10.2903/j.efsa.2014.3779  
   URL: https://api.crossref.org/works/10.2903/j.efsa.2014.3779
4. eCFR API (Title listing; up-to-date metadata)  
   URL: https://www.ecfr.gov/api/versioner/v1/titles.json
5. eCFR API full Title 21 XML snapshot (contains sections 177.1210, 184.1081, 582.3081 etc.)  
   URL: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
6. WHO/JECFA potassium propionate entry (chemical 3004)  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3004
7. WHO/JECFA propionic acid entry (chemical 3438)  
   URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/3438
8. Codex GSFA additive details for INS 283  
   URL: https://www.fao.org/gsfaonline/additives/results.html?ins=283&searchBy=ins&lang=en
9. IARC list of classifications page  
   URL: https://monographs.iarc.who.int/list-of-classifications/
10. IARC list dataset script (includes agent table and last update metadata)  
    URL: https://webapi.iarc.who.int/loc/loc.app.js
11. PubChem Potassium propionate entry  
    URL: https://pubchem.ncbi.nlm.nih.gov/compound/Potassium-propionate
12. PubChem PUG synonyms endpoint (CAS/synonyms extraction)  
    URL: https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/potassium%20propionate/synonyms/JSON
13. PubMed safety studies (recent + classic): 34312159, 31019023, 36253933, 39262268, 18328610  
    URLs:  
    - https://pubmed.ncbi.nlm.nih.gov/34312159/  
    - https://pubmed.ncbi.nlm.nih.gov/31019023/  
    - https://pubmed.ncbi.nlm.nih.gov/36253933/  
    - https://pubmed.ncbi.nlm.nih.gov/39262268/  
    - https://pubmed.ncbi.nlm.nih.gov/18328610/
