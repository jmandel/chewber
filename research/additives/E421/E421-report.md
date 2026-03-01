# E421 Research Report: Mannitol

## Identity
- **E-number:** E421 (Mannitol)
  - Source: EFSA sweeteners topic table (shows E 421 Mannitol), 2026, https://www.efsa.europa.eu/en/topics/topic/sweeteners
- **CAS number(s):** 69-65-8
  - Source: WHO JECFA chemical entry "MANNITOL", 2026 access, https://apps.who.int/food-additives-contaminants-jecfa-database/chemical.aspx?chemID=5119
- **Chemical class:** Polyol (sugar alcohol; hexahydric alcohol)
  - Source: 21 CFR §180.25 (describes mannitol as 1,2,3,4,5,6-hexanehexol), 2026 eCFR issue date, https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25
- **Common synonyms:** D-mannitol, Mannite, INS 421
  - Source: WHO JECFA chemical entry and JECFA evaluation summary, https://apps.who.int/food-additives-contaminants-jecfa-database/chemical.aspx?chemID=5119 and http://www.inchem.org/documents/jecfa/jeceval/jec_1321.htm
- **Natural vs synthetic:** Semi-synthetic (industrial food-additive mannitol is produced by hydrogenation/reduction of sugars or by fermentation)
  - Source: 21 CFR §180.25(a)(1)-(3), https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25

## Function in Food
- **Mechanism of action:** Polyol that provides sweetness and bulking while contributing low water activity/humectancy and processing functionality.
  - Source: WHO JECFA functional classes (sweetener, bulking agent, humectant, stabilizer, texturizer), https://apps.who.int/food-additives-contaminants-jecfa-database/chemical.aspx?chemID=5119
- **Common food categories (explicit CFR uses):** Pressed mints/hard candy/cough drops, chewing gum, soft candy, confections/frostings, non-standardized jams/jellies, and other foods under specified limits.
  - Source: 21 CFR §180.25(d), https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25

## Regulatory Status

### EFSA (EU)
- **Approval status:** Authorised in the EU; EFSA re-evaluation is still ongoing.
  - EFSA topic table shows "E 421 Mannitol - Re-evaluation ongoing" (2026): https://www.efsa.europa.eu/en/topics/topic/sweeteners
  - OpenEFSA question records state: "already authorised" and re-evaluation delayed/ongoing for EFSA-Q-2011-00646 and EFSA-Q-2011-00647:
    - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00646
    - https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00647
- **ADI (value + unit):** No final EFSA ADI value published in the current re-evaluation record (output is null).
  - Source: OpenEFSA question JSON for EFSA-Q-2011-00646/00647 (output: null), URLs above.
- **Evaluation year:** No final EFSA scientific opinion year yet; dossier timelines show received 28-04-2011 / valid 12-05-2011 and expected completion 31-12-2027.
  - Sources:
    - https://open.efsa.europa.eu/api/question/getTimeline?questionNumber=EFSA-Q-2011-00646
    - https://open.efsa.europa.eu/api/question/getTimeline?questionNumber=EFSA-Q-2011-00647
- **Key conclusion from latest EFSA records:** Re-evaluation ongoing; scientific output still in preparation.

### FDA / CFR (US)
- **GRAS status:**
  - **Human food use:** Mannitol is listed in **21 CFR 180.25** (Part 180 = interim food additive permitted pending additional study), not as a Part 184 human-food GRAS affirmation.
  - **Animal feed:** Mannitol is GRAS under **21 CFR 582.5470** when used per good manufacturing or feeding practice.
- **Specific CFR citation(s):**
  - 21 CFR 180.25: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25
  - 21 CFR Part 180 heading (interim basis): https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?part=180
  - 21 CFR 582.5470: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=582.5470
- **Conditions of use (human food, 21 CFR 180.25):**
  - Maximum levels by category (e.g., 98% in pressed mints; 31% chewing gum; 40% soft candy; <2.5% all other foods).
  - Label warning required when foreseeable consumption may result in **20 g/day** ingestion: "Excess consumption may have a laxative effect."

### JECFA / WHO
- **ADI:** NOT SPECIFIED.
- **Last evaluation year:** 1986.
- **Key conclusions:** JECFA notes poor absorption and laxative effects at high doses; ADI remained "not specified" with caution on laxative effects at high intake.
- Sources:
  - WHO database page: https://apps.who.int/food-additives-contaminants-jecfa-database/chemical.aspx?chemID=5119
  - JECFA summary page: http://www.inchem.org/documents/jecfa/jeceval/jec_1321.htm
  - WHO Food Additives Series 21 monograph: http://www.inchem.org/documents/jecfa/jecmono/v21je10.htm

### IARC
- **Classification:** No mannitol entry found in IARC "List of Classifications" dataset.
- Sources:
  - List page: https://monographs.iarc.who.int/list-of-classifications/
  - Dataset script used by the page (searched for "mannitol", "mannite", "69-65-8"; no hit): https://webapi.iarc.who.int/loc/loc.app.js
- **Access note:** Site search URL `https://monographs.iarc.who.int/?s=mannitol` returned a "Page not found" template during this session; classification list dataset was used as fallback.

### Notable bans
- No major jurisdiction-wide ban identified in the EFSA/FDA/eCFR/JECFA/IARC sources reviewed above.

## Key Safety Evidence

### Animal studies
- JECFA monograph reports long-term rat studies (including dietary 1%, 5%, 10%) without clear treatment-related systemic toxicity/carcinogenic concern driving restriction; ADI set as "not specified."
  - Source: WHO Food Additives Series 21 (Mannitol), http://www.inchem.org/documents/jecfa/jecmono/v21je10.htm

### Epidemiological data
- A 2025 nested case-control analysis in women (Nurses' Health Study) found higher plasma mannitol/sorbitol associated with higher incident CHD risk after multivariable adjustment.
- Important limitation: biomarker association is not direct proof that food-additive intake of mannitol causes CHD.
  - Source: Heianza et al., 2025, PubMed PMID 39230875, https://pubmed.ncbi.nlm.nih.gov/39230875/

### Mechanistic concerns
- JECFA and CFR both identify a dose-related **osmotic laxative effect** as the principal practical safety concern at high intake.
  - Sources:
    - JECFA monograph (laxative threshold in humans 10-20 g single dose): http://www.inchem.org/documents/jecfa/jecmono/v21je10.htm
    - 21 CFR 180.25(e) warning at foreseeable 20 g/day: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25
- A 2023 in-vitro study in human lymphocytes reported no significant genotoxic signal (CA/MN) for tested mannitol concentrations, though mitotic index decreased at higher concentrations.
  - Source: Eker-Kartal & Avuloglu-Yilmaz, 2023, PubMed PMID 38060281, https://pubmed.ncbi.nlm.nih.gov/38060281/

## Exposure Assessment
- **Typical intake context:** CFR permits substantial category-specific use levels in confectionery/gum categories; this creates realistic potential for high single-day polyol intake in heavy consumers.
  - Source: 21 CFR 180.25(d), https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25
- **ADI exceedance risk:**
  - Numeric ADI exceedance cannot be calculated from EFSA (no final EFSA ADI yet) and JECFA (ADI "not specified").
  - Practical threshold concern is gastrointestinal intolerance/laxative effect, not systemic toxicity at regulatory use.
- **Potentially vulnerable populations:**
  - High consumers of sugar-free confectionery/chewing gum.
  - Individuals sensitive to osmotic laxative effects.
  - Children with high per-body-weight intake in polyol-rich products.
  - Sources: JECFA monograph + 21 CFR 180.25 warning threshold.

## Risk Assessment

### 1. Tier-by-tier analysis

#### risk_free
- **Evidence supporting risk_free:**
  - JECFA ADI is "not specified" and historical toxicology review did not indicate major systemic hazard at permitted uses.
  - IARC classification list shows no mannitol classification entry.
  - Recent in-vitro genotoxicity study did not find significant CA/MN genotoxic signal.
- **Evidence against risk_free:**
  - EFSA re-evaluation is still not finalized (ongoing; no current EFSA output/ADI value).
  - Clear dose-related laxative effects are acknowledged in both JECFA and CFR labeling requirements.
  - Recent epidemiology reported an association between higher plasma mannitol/sorbitol and CHD risk (causality unresolved).

#### limited
- **Evidence supporting limited:**
  - Regulatory acceptance remains in place (EU authorized and under re-evaluation; US human-food section with explicit use conditions).
  - Main recurring concern is high-dose GI/laxative tolerance rather than strong systemic toxicity signal.
  - JECFA ADI "not specified" with long-standing risk-management history.
- **Evidence against limited:**
  - EFSA has not yet completed the current re-evaluation.
  - New cardiovascular biomarker association literature introduces uncertainty requiring ongoing surveillance.

#### moderate
- **Evidence supporting moderate:**
  - EFSA re-evaluation remains unresolved.
  - Human epidemiology has a non-trivial association signal (plasma mannitol/sorbitol and CHD risk).
- **Evidence against moderate:**
  - No major regulator has moved to ban/withdraw mannitol from authorized food use in the sources reviewed.
  - JECFA and historical toxicology evidence do not indicate robust carcinogenic/genotoxic hazard at typical regulatory use.

#### high
- **Evidence supporting high:**
  - None found in reviewed authoritative sources.
- **Evidence against high:**
  - No IARC carcinogen classification entry identified.
  - No major-jurisdiction ban or comparable severe regulatory action identified.
  - Primary known hazard remains dose-related laxation/tolerance.

### 2. Rationale
The strongest consistent evidence supports a low-to-moderate risk profile centered on gastrointestinal tolerance at higher intakes, while systemic hazard evidence remains limited. EFSA re-evaluation not being finalized and newer observational cardiometabolic signals prevent a "risk_free" classification, but current regulatory evidence does not justify "moderate" or "high".

### 3. Recommended tier
**limited**

## Sources
1. **EFSA, Sweeteners topic page** (2026 access): https://www.efsa.europa.eu/en/topics/topic/sweeteners
2. **EFSA call for sweetener data** (2017): https://www.efsa.europa.eu/en/data/call/170621
3. **OpenEFSA question EFSA-Q-2011-00646** (2026 access): https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00646
4. **OpenEFSA question EFSA-Q-2011-00647** (2026 access): https://open.efsa.europa.eu/api/question/get?questionNumber=EFSA-Q-2011-00647
5. **OpenEFSA timeline EFSA-Q-2011-00646** (2026 access): https://open.efsa.europa.eu/api/question/getTimeline?questionNumber=EFSA-Q-2011-00646
6. **OpenEFSA timeline EFSA-Q-2011-00647** (2026 access): https://open.efsa.europa.eu/api/question/getTimeline?questionNumber=EFSA-Q-2011-00647
7. **eCFR 21 CFR Part 180** (issue date 2026-02-25): https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?part=180
8. **eCFR 21 CFR §180.25 Mannitol** (issue date 2026-02-25): https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=180.25
9. **eCFR 21 CFR §582.5470 Mannitol** (issue date 2026-02-25): https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml?section=582.5470
10. **WHO JECFA chemical entry (MANNITOL, chemID 5119)**: https://apps.who.int/food-additives-contaminants-jecfa-database/chemical.aspx?chemID=5119
11. **JECFA evaluation summary (MANNITOL)**: http://www.inchem.org/documents/jecfa/jeceval/jec_1321.htm
12. **WHO Food Additives Series 21 monograph (MANNITOL)**: http://www.inchem.org/documents/jecfa/jecmono/v21je10.htm
13. **IARC List of classifications page**: https://monographs.iarc.who.int/list-of-classifications/
14. **IARC classifications dataset script (loc.app.js)**: https://webapi.iarc.who.int/loc/loc.app.js
15. **IARC site search URL attempted (returned page-not-found template)**: https://monographs.iarc.who.int/?s=mannitol
16. **PubMed search query used**: https://pubmed.ncbi.nlm.nih.gov/?term=mannitol+food+additive+safety
17. **PubMed PMID 38060281** (Determination of the genotoxic effects of sweeteners, mannitol and lactitol, 2023): https://pubmed.ncbi.nlm.nih.gov/38060281/
18. **PubMed PMID 39230875** (Plasma levels of polyols erythritol, mannitol, and sorbitol..., 2025): https://pubmed.ncbi.nlm.nih.gov/39230875/
19. **PubMed PMID 36705477** (Low-calorie bulk sweeteners review, 2024 issue / 2023 e-pub): https://pubmed.ncbi.nlm.nih.gov/36705477/
