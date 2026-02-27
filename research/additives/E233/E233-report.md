# E233 Research Report - Thiabendazole

## Identity
- **E-number:** E233
- **Name:** Thiabendazole (also written Tiabendazole)
- **CAS number(s):** 148-79-8
- **Chemical class:** Benzimidazole derivative (fungicide/anthelmintic)
- **Common synonyms:** TBZ; 2-(4-thiazolyl)-1H-benzimidazole; 4-(2-benzimidazolyl)thiazole; Mintezol; Mertect; Omnizole
- **Natural vs synthetic:** Synthetic

## Function in Food
- **Primary function:** Post-harvest antifungal preservative (historically used on fruit peel/surface, especially citrus).
- **Mechanism of action:** Benzimidazole-class antimicrobials act by binding fungal/helminth tubulin and disrupting microtubule-dependent processes.
- **Common food categories:** Citrus and other produce surface treatment contexts (post-harvest). Current evidence reviewed here is mainly in pesticide-residue/MRL frameworks rather than modern direct-additive use.

## Regulatory Status
### EFSA / EU
- **Latest EFSA scientific opinion found:** 2022 EFSA Journal article (e07539), "Evaluation of confirmatory data following the Article 12 MRL review for thiabendazole".
- **ADI:** 0.1 mg/kg bw/day (ARfD also 0.1 mg/kg bw), as used by EFSA in the 2022 assessment (values derived in EU pesticides peer review, cited there as European Commission 2016).
- **Evaluation year:** 2022 (latest EFSA opinion found for thiabendazole).
- **Key conclusions:**
  - EFSA reported no consumer risk identified for the assessed uses in that confirmatory-data review.
  - EFSA also noted endocrine-disruption criteria were met for humans (thyroid modality) in peer-review confirmatory work, but considered existing TRVs (including the ADI) protective pending risk-management decisions.
  - EFSA reported long-term intake up to 35% of ADI (NL toddler diet) and highlighted narrow acute safety margins for some scenarios (including papaya ARfD exceedance in model outputs).
- **Food-additive legal status in EU (not EFSA opinion itself):** Commission Directive 2009/10/EC states that E233 was "no longer permitted" as a food additive and therefore specifications for E233 were withdrawn from additive-purity legislation.

### FDA / eCFR (Title 21)
- **GRAS status (Title 21 check):** No Thiabendazole listing found in key direct-food-additive/GRAS parts searched (21 CFR parts 172, 173, 180, 181, 182, 184, 186).
- **What is present in Title 21:** Thiabendazole appears in **new animal drug** sections, not as a direct human food additive.
- **CFR citations and conditions:**
  - **21 CFR 520.2382** (Thiabendazole and triclorfon): labeled veterinary use in horses; limitation includes "Do not use in horses intended for human consumption.";
  - **21 CFR 524.1484g** (Neomycin, thiabendazole, dexamethasone solution): topical/otic veterinary use in dogs/cats; veterinarian-restricted use.
- **Access note:** normal ecfr.gov pages were CAPTCHA-gated in this environment; data were extracted via official eCFR API endpoints.

### JECFA / WHO
- **Database entry found:** WHO JECFA database (Home/Chemical/2464 and synonym entry 513).
- **ADI:** 0-0.1 mg/kg bw.
- **Last evaluation year shown:** 2002 (with previous years listed: 1997 and 1992).

### IARC
- **IARC monographs classification:** Group 3 ("not classifiable as to its carcinogenicity to humans") in IARC summary source for Tiabendazole.
- **Current-list note:** the current IARC list-of-classifications app dataset search by name/CAS in this session did not return a Thiabendazole record; the explicit Group 3 statement came from the IARC summary page indexed via INCHEM.

### Notable bans/restrictions
- **EU food-additive withdrawal:** E233 no longer permitted as a food additive (Directive 2009/10/EC recital text).

## Key Safety Evidence
- **Regulatory toxicology (EFSA, 2022):** ADI/ARfD used at 0.1 mg/kg bw; no overall consumer risk identified for assessed uses, but unresolved uncertainty remained for benzimidazole metabolite in some Codex/veterinary-linked animal-commodity contexts.
- **Developmental and mechanistic toxicity (PubMed 37196567, 2023):** Zebrafish study reported developmental defects, apoptosis, oxidative stress, inflammatory responses, and PI3K/Akt/MAPK pathway disruption, with organ-level toxicity signals.
- **Genotoxicity signal (PubMed 40238500, 2025):** Post-harvest fungicide study (including thiabendazole and mixtures) reported mutagenicity/DNA-damage findings in Ames/comet assays.
- **Residue transfer relevance (PubMed 38493880, 2024):** Experimental transporter work indicates ABCG2-mediated transport can increase milk appearance of a major thiabendazole metabolite (5-hydroxythiabendazole), relevant to residue-exposure pathways.
- **Network toxicology (PubMed 38964723, 2024):** Computational/mechanistic paper predicted potential links to cell-cycle/p53-pathway mediated toxicity (hypothesis-generating, not definitive causal proof alone).

## Exposure Assessment
- **EFSA dietary modeling (2022 opinion):** estimated long-term intake up to 35% of ADI (highest reported for NL toddlers), i.e., below ADI in that model.
- **Acute concerns in model scenarios:** EFSA noted ARfD exceedance for papaya in updated model context and narrow margins for some high-residue/high-portion scenarios.
- **Current practical exposure context:** because E233 is withdrawn as an EU food additive, consumer exposure discussion is primarily residue-driven (post-harvest/pesticide pathways), not routine direct-additive use.
- **Vulnerable populations:** children/toddlers and high consumers of specific produce can be higher-exposure subgroups in dietary models.

## Risk Assessment
### 1. Tier-by-tier analysis
#### `risk_free`
- **Evidence supporting:** EFSA did not identify consumer risk for assessed uses; chronic modeled intake below ADI in its 2022 assessment.
- **Evidence against:** Numeric ADI/ARfD required; endocrine-disruption concern flagged (thyroid modality); additive withdrawn in EU.

#### `limited`
- **Evidence supporting:** JECFA and EFSA both provide ADI-based frameworks; some assessments conclude no risk under modeled/authorized conditions.
- **Evidence against:** EU additive withdrawal plus newer toxicology/genotoxicity signals and endocrine concern move beyond "minor concerns only" framing.

#### `moderate`
- **Evidence supporting:** Approved/managed residue frameworks exist with caveats; mechanistic and experimental toxicity signals exist; acute-margin concerns appear in some scenarios.
- **Evidence against:** For the additive use-case specifically, EU status is stronger than a mere caveat (withdrawn/not permitted).

#### `high`
- **Evidence supporting:** E233 no longer permitted as EU food additive (major-jurisdiction regulatory withdrawal), plus continuing toxicological concern signals (endocrine-disruption criterion met in EFSA peer-review context; recent genotoxic/mechanistic studies).
- **Evidence against:** JECFA/EFSA still maintain ADI-based risk frameworks for residue contexts, and EFSA 2022 did not conclude general consumer risk for assessed uses.

### 2. Rationale
The central driver is regulatory reality for **E233 as a food additive**: EU withdrawal/no longer permitted, reinforced by persistent toxicology caveats (endocrine and newer mechanistic/genotoxic findings). At the same time, ADI-based residue frameworks still indicate controlled-use scenarios can remain below reference values. This combination supports a high concern tier for additive use, with acknowledgment that residue-risk management remains possible under strict limits.

### 3. Recommended tier
**Recommended tier: `high`**

## Sources
1. **EFSA Journal (2022)**, *Evaluation of confirmatory data following the Article 12 MRL review for thiabendazole*.
   - URL visited: https://pmc.ncbi.nlm.nih.gov/articles/PMC9405511/
2. **Europe PMC record for DOI 10.2903/j.efsa.2022.7539** (metadata linking to EFSA article/PMCID).
   - URL visited: https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.2903/j.efsa.2022.7539&format=json
3. **EFSA Journal landing page (direct access attempt; Cloudflare challenge encountered in shell session).**
   - URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/7539
4. **EFSA search endpoint attempt (robots/disallow response in shell session).**
   - URL visited: https://www.efsa.europa.eu/en/search?search_api_fulltext=thiabendazole
5. **Commission Directive 2009/10/EC** (recital text: E233 no longer permitted; specifications withdrawn).
   - URL visited: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32009L0010
6. **eCFR API search (Title 21 query for thiabendazole).**
   - URL visited: https://www.ecfr.gov/api/search/v1/results?query=thiabendazole&per_page=500
7. **eCFR API full section - 21 CFR 520.2382.**
   - URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=520.2382
8. **eCFR API full section - 21 CFR 524.1484g.**
   - URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=524.1484g
9. **eCFR API full part checks (no thiabendazole found in parts 172, 173, 180, 181, 182, 184, 186).**
   - Example URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?part=172
10. **WHO JECFA database - THIABENDAZOLE (chemical page).**
    - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2464
11. **WHO JECFA database API search by partial name.**
    - URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/thiabendazole
12. **IARC/INCHEM summary page (Tiabendazole, Group 3) via monographs indexing.**
    - URL visited: https://inchem.org/documents/iarc/suppl7/tiabendazole.html
13. **IARC Monographs list-of-classifications app page.**
    - URL visited: https://monographs.iarc.who.int/list-of-classifications
14. **IARC classifications dataset script (current list backend).**
    - URL visited: https://webapi.iarc.who.int/loc/loc.app.js
15. **PubMed (2023)**, *Developmental defects induced by thiabendazole... in zebrafish*.
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/37196567/
16. **PubMed (2025)**, *Possible Genotoxic Effects of Post-Harvest Fungicides...*.
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/40238500/
17. **PubMed (2024)**, *ABCG2 transports thiabendazole metabolite and increases milk residues*.
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/38493880/
18. **PubMed (2024)**, *Network toxicological and molecular docking... Thiabendazole*.
    - URL visited: https://pubmed.ncbi.nlm.nih.gov/38964723/
