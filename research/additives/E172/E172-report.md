# E172 (Iron oxides and hydroxides) - Research Report

## Data Extraction Log (Step 1)
| Source | URL visited | Specific data extracted |
|---|---|---|
| EFSA opinion page (access attempt + indexed abstract snippet) | https://www.efsa.europa.eu/en/efsajournal/pub/4317 | Latest EFSA re-evaluation year 2015; additive is re-evaluated as food additive; indexed snippet reports no numerical ADI could be allocated and that an adequate safety assessment could not be carried out due data gaps (especially reproductive/developmental). Direct full-text access from this environment was blocked by EFSA/Wiley anti-bot controls. |
| eCFR section page (access attempt) | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-73/subpart-A/section-73.200 | Human-readable section page blocked by anti-bot access page in this environment. |
| eCFR API (Title 21 XML) | https://www.ecfr.gov/api/versioner/v1/full/2025-12-30/title-21.xml | 21 CFR 73.200 "Synthetic iron oxide": approved color additive uses and limits (sausage casings <=0.10%; candy/mints/chewing gum at GMP; dietary supplement tablets/capsules with <=5 mg elemental iron/day; pet food <=0.25%); exempt from certification. |
| eCFR API (same XML, GRAS section) | https://www.ecfr.gov/api/versioner/v1/full/2025-12-30/title-21.xml | 21 CFR 186.1300 "Ferric oxide": affirmed GRAS as an indirect human food ingredient (paper/paperboard packaging) under GMP. |
| WHO/JECFA database (iron oxides entry) | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1541 | Iron oxides INS 172(i), 172(ii), 172(iii); ADI 0-0.5 mg/kg bw; evaluation year listed as 1999. |
| WHO/JECFA database (ferroso ferric oxide entry) | https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4080 | Synonym/cas details for iron oxide black: CAS 1317-61-9; ADI shown as 0-0.5 mg/kg bw with references to prior JECFA meetings. |
| IARC classification list page | https://monographs.iarc.who.int/list-of-classifications/ | Official IARC classification list endpoint used for verification. |
| IARC classification dataset script used by the list page | https://webapi.iarc.who.int/loc/loc.app.js | Dataset contains entry `Ferric oxide` with Group 3 and evaluation year 1987; `Saccharated iron oxide` also Group 3. |
| PubMed study (rat microbiota) | https://pubmed.ncbi.nlm.nih.gov/38188661/ | 2024 rat repeated oral exposure to food-grade iron(III) oxide nanoparticles: high dose (200 mg/kg bw) altered microbiota composition and SCFA profile. |
| PubMed study (acute oral rat toxicology, explicitly mentions E172) | https://pubmed.ncbi.nlm.nih.gov/30878530/ | 2019 acute oral rat study on IONPs/E172: low overall toxicity signs, but liver inflammatory effects with iron deposits in hepatocytes/Kupffer cells. |
| PubMed review (nano-additives including E172) | https://pubmed.ncbi.nlm.nih.gov/33068655/ | 2020 review: evidence of gastrotoxicity/hepatotoxicity and oxidative-stress-related mechanisms across nanoparticle food additives including E172. |
| PubMed characterization study | https://pubmed.ncbi.nlm.nih.gov/36305852/ | 2022 study: E172-containing pearlescent pigments have nanoscale iron oxide structures in coatings (minimum Feret diameter ~37-64 nm). |

## Identity
- **E-number:** E172
- **Name:** Iron oxides and hydroxides
- **CAS number(s) found from visited sources:**
- `1309-37-1` (ferric oxide; listed in 21 CFR 186.1300 and IARC classification dataset context) [S4][S8]
- `1317-61-9` (ferroso ferric oxide / iron oxide black) [S6]
- **Chemical class:** Inorganic iron oxide/hydroxide pigments (food colourants) [S3][S5]
- **Common synonyms:** Ferric oxide; Ferroso ferric oxide; Iron (II,III) oxide; C.I. Pigment Black 11 [S6][S8]
- **Natural vs synthetic:** For direct food coloring in the US, regulated as **synthetically prepared iron oxides (including hydrated forms)** under 21 CFR 73.200. Natural analogs exist (e.g., hematite) but the food-color additive listing is synthetic. [S3][S4]

## Function in Food
- **Mechanism of action:** Insoluble mineral pigments provide red/yellow/black/brown coloration via light absorption/scattering of iron oxide particles.
- **Common food categories (documented in CFR):**
- sausage casings intended for human consumption (up to 0.10% by weight),
- soft/hard candy, mints, chewing gum (GMP),
- dietary supplement tablets/capsules including coatings and inks (<=5 mg elemental iron/day from labeled dosage),
- dog/cat food coloring (<=0.25% by weight). [S3]

## Regulatory Status
### EFSA (EU)
- **Status:** Re-evaluated as an authorised food additive, but EFSA reported unresolved uncertainty.
- **Latest evaluation year found:** **2015**. [S1]
- **ADI:** **No numerical ADI allocated** in the EFSA re-evaluation (indexed abstract text indicates EFSA could not perform an adequate safety assessment due insufficient toxicological data). [S1]
- **Key conclusions (indexed EFSA abstract summary):** low oral absorption; no clear genotoxicity/carcinogenicity concern in the reviewed data; major data gaps remained, especially reproductive/developmental toxicity. [S1]

### FDA / CFR (US)
- **Direct food-color status:** **Approved color additive** under **21 CFR 73.200** (synthetic iron oxide), with explicit use limits listed above. [S3]
- **GRAS status:**
- For direct color-additive use (21 CFR 73.200): regulated as color additive approval, not GRAS listing.
- A related entry, **21 CFR 186.1300 Ferric oxide**, is affirmed GRAS only as an **indirect** food ingredient (paper/paperboard packaging) under GMP. [S4]

### JECFA / WHO
- **ADI:** **0-0.5 mg/kg bw**. [S5]
- **Last evaluation year found for iron oxides entry:** **1999** (WHO/JECFA DB record for iron oxides INS 172(i)-(iii)); older component-level entries show the same ADI basis. [S5][S6]

### IARC
- **Classification relevant to E172 components:** **Ferric oxide: Group 3** (not classifiable as to carcinogenicity to humans). `Saccharated iron oxide` is also listed as Group 3 in the same IARC dataset. [S8]

### Notable bans
- No major-jurisdiction full ban for E172 was identified from the visited regulatory sources.

## Key Safety Evidence
### Animal studies
- **Rat repeated oral study (2024, PMID 38188661):** doses 50/100/200 mg/kg bw of food-grade iron(III) oxide nanoparticles altered gut microbiota; high dose changed mucosa-associated microbiota and SCFA profile; authors called for further confirmation. [S9]
- **Rat acute oral study (2019, PMID 30878530):** explicitly references food additive E172 context; reports low overall toxicity signs but liver inflammatory findings and iron deposits in hepatocytes/Kupffer cells. [S10]

### Epidemiological data
- No robust human epidemiological evidence specific to dietary E172 safety was identified in the visited regulatory records and PubMed items.

### Mechanistic concerns
- **Gut microbiome perturbation** at higher doses in animal work. [S9]
- **Hepatic inflammatory/iron-deposit signal** in acute rat exposure study. [S10]
- **Oxidative stress pathway hypothesis** across nanoparticle additives including E172 in review literature. [S11]
- **Nanostructure context:** some E172-containing pearlescent pigment coatings include nanoscale iron oxide particles, relevant for nano-risk framing. [S12]

## Exposure Assessment
- **Typical dietary intake:** No robust current population intake estimate for E172 was identified in the visited EFSA/JECFA/FDA records.
- **Regulatory benchmark available:** JECFA ADI 0-0.5 mg/kg bw/day. [S5]
- **ADI exceedance risk:** Cannot be quantified confidently from the visited sources because recent population exposure distributions were not found in those records.
- **Potentially vulnerable groups:** children/high consumers of confectionery-colored foods and consumers with high cumulative intake from multiple colored products may warrant conservative attention, but this remains an inference due exposure-data gaps.

## Risk Assessment
### 1. Tier-by-tier analysis

#### `risk_free`
- **Evidence supporting this tier:** longstanding approvals in major jurisdictions; JECFA numeric ADI exists; IARC ferric oxide classification is Group 3 (not classifiable). [S3][S5][S8]
- **Evidence arguing against this tier:** EFSA re-evaluation indicates unresolved database gaps and no numerical ADI allocation in that review; recent animal/mechanistic findings show plausible biological effects at moderate/high experimental doses. [S1][S9][S10][S11]

#### `limited`
- **Evidence supporting this tier:** additive remains approved/allowed with defined use conditions (FDA/CFR) and JECFA ADI; no major bans found in visited sources. [S3][S5]
- **Evidence arguing against this tier:** EFSA uncertainty is stronger than a minor caveat because adequacy of safety assessment was questioned; animal evidence is not uniformly null. [S1][S9][S10]

#### `moderate`
- **Evidence supporting this tier:** approved status is accompanied by notable caveats (EFSA uncertainty, incomplete toxicological database signals, and nontrivial animal/mechanistic findings). This matches the "approved but with caveats" definition.
- **Evidence arguing against this tier:** absence of major-jurisdiction bans and presence of a JECFA ADI can be interpreted as support for a lower tier. [S3][S5]

#### `high`
- **Evidence supporting this tier:** recent studies report mechanistic concerns (microbiome shifts, hepatic inflammatory signals). [S9][S10][S11]
- **Evidence arguing against this tier:** no IARC Group 2A/2B/1 classification for ferric oxide from IARC list data (Group 3), and no major bans identified; FDA/JECFA still permit/assess the additive. [S3][S5][S8]

### 2. Rationale
Primary decision factors are: (1) continued regulatory approvals (FDA/JECFA), (2) EFSA uncertainty and lack of a numerical ADI in its 2015 re-evaluation, and (3) supportive but not definitive animal/mechanistic toxicity signals. The combination indicates non-negligible uncertainty without strong evidence for high-tier regulatory hazard.

### 3. Recommended tier
**`moderate`**

## Sources
- **[S1]** EFSA (2015). *Scientific Opinion on the re-evaluation of iron oxides and hydroxides (E 172) as food additives* (publication page; direct full-text blocked in this environment). URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/4317
- **[S2]** eCFR section page access attempt. URL visited: https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-73/subpart-A/section-73.200
- **[S3]** eCFR API Title 21 XML (contains 21 CFR 73.200 text). URL visited: https://www.ecfr.gov/api/versioner/v1/full/2025-12-30/title-21.xml
- **[S4]** eCFR API Title 21 XML (contains 21 CFR 186.1300 text). URL visited: https://www.ecfr.gov/api/versioner/v1/full/2025-12-30/title-21.xml
- **[S5]** WHO/JECFA database. *IRON OXIDES* entry. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1541
- **[S6]** WHO/JECFA database. *IRON OXIDE BLACK* entry. URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/4080
- **[S7]** IARC Monographs. *List of Classifications* page. URL visited: https://monographs.iarc.who.int/list-of-classifications/
- **[S8]** IARC classification dataset script used by list page. URL visited: https://webapi.iarc.who.int/loc/loc.app.js
- **[S9]** Shi J et al. (2024). *Effects of food-grade iron(III) oxide nanoparticles on cecal digesta- and mucosa-associated microbiota and short-chain fatty acids in rats* (PMID 38188661). URL visited: https://pubmed.ncbi.nlm.nih.gov/38188661/
- **[S10]** Askri D et al. (2019). *Nanoparticles in foods?... iron oxide nanoparticle effects on rats after acute oral exposure* (PMID 30878530). URL visited: https://pubmed.ncbi.nlm.nih.gov/30878530/
- **[S11]** Medina-Reyes EI et al. (2020). *Food additives containing nanoparticles induce gastrotoxicity, hepatotoxicity and alterations in animal behavior* (PMID 33068655). URL visited: https://pubmed.ncbi.nlm.nih.gov/33068655/
- **[S12]** Hetzer B et al. (2022). *Characterisation of iron oxide-containing pearlescent pigments used as food colourants* (PMID 36305852). URL visited: https://pubmed.ncbi.nlm.nih.gov/36305852/
