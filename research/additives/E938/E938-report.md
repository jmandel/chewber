# E938 (Argon) — Research Report

## Identity
- **E-number / INS**: E938 / INS 938.
- **Name**: Argon.
- **CAS number(s)**: Primary CAS **7440-37-1** (PubChem lists additional registry identifiers in cross-references).
- **Chemical class**: Noble gas (inert monoatomic gas).
- **Synonyms**: Argon, Ar, INS 938, E938.
- **Natural vs synthetic**: **Natural-origin** element.

## Function in Food
- **Technological function**: Packaging gas / propellant.
- **Mechanism of action**: Chemically inert gas that displaces oxygen in headspace, reducing oxidation and helping preserve product quality; can also serve as a propellant gas.
- **Common food categories**:
  - Modified-atmosphere packaged foods (e.g., meat products in mixed gas systems).
  - Products using gas propellant functionality.

## Regulatory Status

### EFSA (EU)
- EFSA FAF Panel re-evaluated argon (E938) in **2024** and concluded its use as a food additive **does not raise a safety concern**.
- EFSA states argon is highly chemically inert and considered of low toxicological concern on physicochemical grounds.
- **ADI**: No numerical ADI established in the EFSA opinion (effectively no mg/kg bw/day value set).
- Additional EFSA notes:
  - Limited industry data were submitted (one operator reported E938 use as packaging gas in one food category).
  - No impurity dataset was available, though current specs require minimum purity (99.0%).

### FDA / eCFR (US)
- eCFR Title 21 search for "argon" returned entries in medical-device regulations (e.g., **21 CFR 868.1075**) rather than food-additive/GRAS sections.
- In food-additive GRAS subpart context, Title 21 Part 184 contains entries for gases like carbon dioxide, helium, and nitrogen (e.g., **21 CFR 184.1540 Nitrogen**, GRAS under GMP), but no specific current Part 184 section naming argon as a direct human food ingredient was identified in the queried eCFR results.
- **GRAS status for argon in current queried eCFR food sections**: not explicitly codified/found.

### JECFA / WHO
- WHO JECFA database chemical page for Argon (INS 938) identifies it as a food additive with functional class **propellant**.
- In the queried current page/API output, explicit ADI text and dated evaluation entries for argon were not populated.
- WHO meeting URLs returned by search snippets (e.g., `/meetings/17`, `/meetings/53`) resolved to WHO 404 pages during this research session; therefore, current JECFA database/API endpoints were used as the primary WHO source for E938.
- **ADI**: not available from the queried current JECFA database output for this chemical.
- **Last evaluation year**: not retrievable from the current argon detail output queried.

### IARC
- Argon was not found as a classified agent in IARC Monographs "List of Classifications" page.
- **IARC carcinogenicity group**: no listing identified.

### Notable bans
- No notable jurisdiction-wide bans identified in the reviewed sources.

## Key Safety Evidence
- **EFSA re-evaluation (2024)**: Core current food-safety assessment; concludes no safety concern for E938 at food-additive use, primarily based on inertness and low toxicological concern profile.
- **Data-gap caveat**: EFSA explicitly notes limited submitted use/manufacturing impurity data.
- **Food-system study evidence**: A modified-atmosphere packaging study (dry-cured ham, argon + CO2 atmosphere) reported no microbial safety problems during storage; this supports technological use but is not a full toxicology program.
- **Overall evidence quality for oral toxicology**: Limited direct chronic oral toxicity dataset specific to E938 identified in the queried sources.

## Exposure Assessment
- E938 is used mainly as a packaging/process gas, so direct systemic dietary exposure is expected to be low compared with conventional ingestible additives.
- EFSA reported very limited submitted use-level data (one reported packaging-gas use), which constrains refined quantitative exposure modeling.
- **ADI exceedance risk**: Cannot be quantitatively benchmarked due absence of numerical ADI; practical dietary exceedance concern appears low given inert-gas function and low expected intake from use pattern.
- **Potentially vulnerable populations**: No specific dietary subgroup risk signal identified in the reviewed food-additive sources; primary concern would be non-dietary high-concentration inhalation settings, not normal dietary use.

## Risk Assessment

### 1. Tier-by-tier analysis

**risk_free**
- Evidence supporting placement:
  - EFSA 2024 conclusion: no safety concern for food-additive use.
  - Argon is a chemically inert noble gas with low toxicological concern rationale.
  - No IARC carcinogenic classification found.
- Evidence arguing against placement:
  - Limited submitted impurity/use data in EFSA re-evaluation.
  - Sparse direct oral toxicology dataset specific to additive-grade E938.

**limited**
- Evidence supporting placement:
  - Approved/accepted in EU with favorable contemporary EFSA opinion.
  - No major safety signals in reviewed food-use literature.
- Evidence arguing against placement:
  - The available evidence profile is more consistent with "very low concern" than with active caution.

**moderate**
- Evidence supporting placement:
  - Data gaps (impurity data; limited exposure-use submissions) could justify conservative caution.
- Evidence arguing against placement:
  - No EFSA safety alarm, no ADI reduction event, no clear hazard signal in food-use context.

**high**
- Evidence supporting placement:
  - No strong supporting evidence found.
- Evidence arguing against placement:
  - No major-jurisdiction ban identified, no IARC 2A/2B signal, no regulatory conclusion of unresolved unacceptable risk.

### 2. Rationale
The balance of current regulatory evidence is dominated by EFSA's recent favorable re-evaluation and the intrinsic chemical inertness of argon. Key uncertainty is not a demonstrated hazard signal, but rather sparse modern toxicology/use-detail datasets.

### 3. Recommended tier
**Recommended tier: risk_free** (with moderate confidence due data sparsity, not hazard signal).

## Sources
1. **Re-evaluation of argon (E 938) and helium (E 939) as food additives** (EFSA Journal, **2024**) — https://www.efsa.europa.eu/en/efsajournal/pub/9048
2. **PubMed record: Re-evaluation of argon (E 938) and helium (E 939) as food additives** (PubMed, **2024**) — https://pubmed.ncbi.nlm.nih.gov/39469433/
3. **eCFR API search results for `argon`** (eCFR API, **accessed 2026-02-27**) — https://www.ecfr.gov/api/search/v1/results?query=argon&per_page=100&page=1
4. **Title 21 Part 184 content versions** (eCFR Versioner API, **accessed 2026-02-27**) — https://www.ecfr.gov/api/versioner/v1/versions/title-21.json?part=184
5. **Title 21 Part 184 full XML (includes §184.1540 text)** (eCFR Versioner API snapshot date **2025-12-22**) — https://www.ecfr.gov/api/versioner/v1/full/2025-12-22/title-21.xml?part=184
6. **ARGON (INS 938) chemical page** (WHO JECFA database, **accessed 2026-02-27**) — https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1861
7. **SearchChemical API: partial name `argon`** (WHO JECFA API, **accessed 2026-02-27**) — https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/argon
8. **ChemicalData API: `GetBy/par/argon`** (WHO JECFA API, **accessed 2026-02-27**) — https://apps.who.int/food-additives-contaminants-jecfa-database/api/ChemicalData/GetBy/par/argon
9. **List of Classifications** (IARC Monographs, **accessed 2026-02-27**) — https://monographs.iarc.who.int/list-of-classifications
10. **Argon (CID 23968)** (PubChem, **accessed 2026-02-27**) — https://pubchem.ncbi.nlm.nih.gov/compound/Argon
11. **Argon registry number cross-references** (PubChem PUG-REST, **accessed 2026-02-27**) — https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/23968/xrefs/RN/JSON
12. **Modified atmosphere packaging and vacuum packaging for long period chilled storage of dry-cured Iberian ham** (Meat Science, **2010**) — https://pubmed.ncbi.nlm.nih.gov/20374854/
