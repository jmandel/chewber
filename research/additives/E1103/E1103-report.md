OpenAI Codex v0.105.0 (research preview)
--------
workdir: /home/exedev/chewber
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: high
reasoning summaries: auto
session id: 019c9cfb-5052-7ce3-bed1-42443d4f2528
--------
user
Research food additive E1103 (Invertase).

## STEP 1 — GATHER REAL DATA (mandatory)

You MUST use your web search and shell tools to visit authoritative sources and extract real data.
Do NOT skip this step. Do NOT rely on memory alone — actually search and read real pages.

1. **EFSA**: Search for "E1103" or "Invertase" on efsa.europa.eu to find the
   latest scientific opinion or re-evaluation. Extract: approval status, ADI (value + unit),
   evaluation year, key conclusions.

2. **FDA/CFR**: Search ecfr.gov for the additive name in Title 21 (Food and Drugs).
   Extract: GRAS status, specific CFR section citation, any conditions of use.

3. **JECFA/WHO**: Search apps.who.int/food-additives-contaminants-jecfa-database/
   or who.int for the additive. Extract: ADI, last evaluation year.

4. **IARC**: Check monographs.iarc.who.int for any classification.

5. **PubMed**: Search pubmed.ncbi.nlm.nih.gov for recent safety studies on this additive.

For each source, record the actual URL you visited and the specific data you found.
If a page is inaccessible, note that and try alternative search queries.

## STEP 2 — WRITE OUTPUT FILES

After gathering data, write BOTH files.

File 1: /home/exedev/chewber/research/additives/E1103/E1103-report.md
  A detailed markdown research report with these sections:
  - **Identity**: E-number, CAS number(s), chemical class, common synonyms, natural vs synthetic
  - **Function in Food**: mechanism of action, common food categories
  - **Regulatory Status**: EFSA opinion + ADI, FDA GRAS + CFR citation, JECFA ADI, IARC, notable bans
  - **Key Safety Evidence**: animal studies, epidemiological data, mechanistic concerns
  - **Exposure Assessment**: typical dietary intake, ADI exceedance risk, vulnerable populations
  - **Risk Assessment**: recommend a Chewber tier with rationale:
    * risk_free — No credible evidence of harm, ADI not specified or very high, naturally occurring
    * limited — GRAS/approved with established ADI, minor concerns only at high doses
    * moderate — Approved with caveats: reduced ADI, exceedance in some populations, credible animal studies
    * high — Banned in major jurisdictions, IARC 2A/2B, EFSA unable to confirm safety, bioaccumulation
  - **Sources**: every claim attributed with title, year, and the actual URL you visited

File 2: /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json
  A single valid JSON object (no markdown fences, no commentary) matching this schema:
  {
    "schema_version": 1,
    "research_metadata": { "date": "<ISO-8601>", "prompt_version": "1.0" },
    "identity": { "e_number": "E1103", "name": "...", "cas_numbers": [...], "synonyms": [...], "chemical_class": "...", "origin": "synthetic|natural|semi-synthetic" },
    "function": { "primary_category": "...", "secondary_categories": [...], "mechanism": "...", "common_food_categories": [...] },
    "regulatory": {
      "efsa": { "status": "approved|restricted|withdrawn|not_evaluated", "adi": { "value": <number|null>, "unit": "mg/kg bw/day", "basis": "..." }, "last_evaluation_year": <number|null>, "key_finding": "..." },
      "fda": { "status": "gras|approved|banned|not_evaluated", "cfr_citation": "21 CFR ...", "notes": null },
      "jecfa": { "adi": { "value": <number|null>, "unit": "mg/kg bw/day", "basis": "..." }, "last_evaluation_year": <number|null> },
      "iarc_classification": "<null|Group 1|Group 2A|Group 2B|Group 3>",
      "notable_bans": []
    },
    "safety_evidence": {
      "concerns": [{ "category": "cardiovascular|carcinogenic|genotoxic|endocrine|gut_microbiome|allergenic|neurotoxic|renal|other", "summary": "...", "evidence_strength": "strong|moderate|weak|theoretical", "key_references": [...] }],
      "no_concern_confirmed": [...],
      "adi_exceedance": { "at_risk": <bool>, "populations": [...], "notes": "..." }
    },
    "risk_assessment": { "recommended_level": "risk_free|limited|moderate|high", "confidence": <0.0-1.0>, "rationale": "...", "key_factors": [...] },
    "sources": [{ "title": "...", "url": "<actual URL you visited or null>", "type": "regulatory|study|review|database" }]
  }

## RULES
- You MUST search the web first. Do not write files until you have gathered real data.
- The JSON must be valid (parseable by jq). Verify with: jq . /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json
- Use null for values you genuinely could not find after searching.
- Every URL in sources should be a real URL you actually visited, not a guessed one.
- After writing both files, confirm with a brief summary.
mcp startup: no servers

thinking
**Planning research approach**
codex
I’ll gather live regulatory and study data first, then write both output files. I’m starting by searching EFSA, eCFR, JECFA/WHO, IARC, and PubMed and capturing exact URLs plus extracted values.

thinking
**Planning combined web queries**
🌐 Searching the web...
🌐 Searched: EFSA E1103 invertase scientific opinion ADI

thinking
**Planning domain-restricted searches**
🌐 Searching the web...
🌐 Searched: site:efsa.europa.eu invertase E 1103 EFSA Journal

thinking
**Clarifying EFSA status for E1103**
codex
I’ve found a reliable JECFA record already (INS 1103, ADI “not specified,” 2001). Next I’m drilling into EFSA and eCFR primary pages to pin down the exact EU/FDA status and citations.
🌐 Searching the web...
🌐 Searched: site:ecfr.gov "invertase" "21 CFR 184"

thinking
**Testing ECFR search approach**
exec
/bin/bash -lc "cd /home/exedev/chewber && curl -L -s 'https://www.ecfr.gov/search?query=invertase' | head -n 80" in /home/exedev/chewber succeeded in 440ms:
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <title>Federal Register :: Request Access</title>

    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="xM0ixEY30T9RMPriWfGdYuQu1RXjEJcknEIRYn2gVRJDF8ty1pH7gSQXLS90iKhamrYo4CurLuPJDZU_Kz2a3w" />
    <meta name="csp-nonce" content="H1EiX0CMANlyrl1Nrv4+Vg==" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&family=Bitter:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
rel="preload"

thinking
**Planning alternative eCFR access**
🌐 Searching the web...
🌐 Searched: ecfr API invertase 21 CFR

thinking
**Testing ECFR API accessibility**
exec
/bin/bash -lc "curl -sL 'https://www.ecfr.gov/api/versioner/v1/titles.json' | head -c 500" in /home/exedev/chewber succeeded in 180ms:
{"titles":[{"number":1,"name":"General Provisions","latest_amended_on":"2022-12-29","latest_issue_date":"2024-05-17","up_to_date_as_of":"2026-02-25","reserved":false},{"number":2,"name":"Federal Financial Assistance","latest_amended_on":"2026-01-27","latest_issue_date":"2026-01-27","up_to_date_as_of":"2026-02-25","reserved":false},{"number":3,"name":"The President","latest_amended_on":"2015-03-17","latest_issue_date":"2024-05-17","up_to_date_as_of":"2026-02-25","reserved":false},{"number":4,"nam

thinking
**Checking API search capabilities**
exec
/bin/bash -lc "curl -sL 'https://www.ecfr.gov/developers/documentation/api/v1' | head -n 120" in /home/exedev/chewber succeeded in 430ms:
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <title>Federal Register :: Request Access</title>

    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token" content="5JNcC6JhENpuVKHJ3T_2mDttNvN2k3CLirwMrhJfmUkiFKSCVA9nBB_qg4xCqR27ZBkQtVwDpjKxNdD2R6kxZw" />
    <meta name="csp-nonce" content="6lGnlMbXxVGDCzFD1INJIA==" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&family=Bitter:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
rel="preload"

thinking
**Exploring API endpoints list**
exec
/bin/bash -lc "curl -sL 'https://www.ecfr.gov/api/versioner/v1/titles.json' | jq '.titles[] | select(.number==21)'" in /home/exedev/chewber succeeded in 181ms:
{
  "number": 21,
  "name": "Food and Drugs",
  "latest_amended_on": "2026-02-19",
  "latest_issue_date": "2026-02-19",
  "up_to_date_as_of": "2026-02-25",
  "reserved": false
}

thinking
**Testing full XML fetch endpoint**
codex
eCFR blocks normal page views from this VM, but its official API is reachable. I’m now pulling Title 21 XML via the API and searching it directly for “invertase” to get the exact CFR citation and conditions.
exec
/bin/bash -lc "curl -sI 'https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml' | head" in /home/exedev/chewber succeeded in 485ms:
HTTP/2 200 
date: Fri, 27 Feb 2026 02:44:51 GMT
content-type: application/octet-stream
status: 200 OK
cache-control: max-age=0, private, must-revalidate
vary: Origin
referrer-policy: strict-origin-when-cross-origin
x-permitted-cross-domain-policies: none
x-xss-protection: 0
x-request-id: Root1-69a10523-505390617b18c66d054bda39
exec
/bin/bash -lc "cd /home/exedev/chewber && curl -sL 'https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml' -o /tmp/title21.xml && rg -n -i 'invertase' /tmp/title21.xml | head -n 20" in /home/exedev/chewber succeeded in 3.61s:


thinking
**Searching enzyme synonyms**
exec
/bin/bash -lc "rg -n -i 'fructofuranosidase|saccharase|invert sugar|yeast|enzyme preparation|GRAS|invert' /tmp/title21.xml | head -n 80" in /home/exedev/chewber succeeded in 51ms:
2558:<P><I>Microorganisms</I> means yeasts, molds, bacteria, viruses, protozoa, and microscopic parasites and includes species that are pathogens.
8355:<FP1-2>Division of Biotechnology and GRAS Notice Review.
10467:<FP1-2>Resident Post Sweetgrass, MT.
18113:<P>(46) Generally recognized as safe (GRAS) notices, in part 170, subpart E and part 570, subpart E of this chapter.
19250:<P>(9) GRAS—Generally recognized as safe.
19352:<P>(k) Establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, or establishment or amendment of a regulation for a prior-sanctioned food ingredient, as defined in §§ 170.3(l) and 181.5(a) of this chapter, unless categorically excluded in § 25.32(f), (i), (j), (k), or (r).
19497:<P>(f) Establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, and establishment or amendment of a regulation for a prior-sanctioned food ingredient, as defined in §§ 170.3(l) and 181.5(a) of this chapter, if the substance or food ingredient is already marketed in the United States for the proposed use.
19503:<P>(i) Approval of a food additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, the granting of a request for exemption from regulation as a food additive under § 170.39 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective, when the substance is present in finished food-packaging material at not greater than 5 percent-by-weight and is expected to remain with finished food-packaging material through use by consumers or when the substance is a component of a coating of a finished food-packaging material.
19505:<P>(j) Approval of a food additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, the granting of a request for exemption from regulation as a food additive under § 170.39 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective, when the substance is to be used as a component of a food-contact surface of permanent or semipermanent equipment or of another food-contact article intended for repeated use.
19507:<P>(k) Approval of a food additive petition or color additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective, for substances added directly to food that are intended to remain in food through ingestion by consumers and that are not intended to replace macronutrients in food.
19521:<P>(r) Approval of a food additive petition or color additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective for a substance that occurs naturally in the environment, when the action does not alter significantly the concentration or distribution of the substance, its metabolites, or degradation products in the environment.
28209:<FP-1>Invert sugar.
28893:<P>(a) <I>Identity.</I> (1) The color additive myoglobin is a stabilized product of controlled fermentation of a non-pathogenic and non-toxicogenic strain of the yeast, <I>Komagataella phaffii,</I> genetically engineered to express the myoglobin protein from <I>Bos taurus.</I> Myoglobin protein is the principal coloring component of the color additive and imparts a red color.
29105:<HEAD>§ 73.355   Phaffia yeast.</HEAD>
29106:<P>(a) <I>Identity.</I> (1) The color additive phaffia yeast consists of the killed, dried cells of a nonpathogenic and nontoxicogenic strain of the yeast <I>Phaffia rhodozyma.</I>
29108:<P>(2) Phaffia yeast may be added to the fish feed only as a component of a stabilized color additive mixture. Color additive mixtures for fish feed use made with phaffia yeast may contain only those diluents that are suitable and are listed in this subpart as safe for use in color additive mixtures for coloring foods.
29110:<P>(b) <I>Specifications.</I> Phaffia yeast shall conform to the following specifications and shall be free from impurities other than those named to the extent that such impurities may be avoided by good manufacturing practice:
29124:<P>(c) <I>Uses and restrictions.</I> Phaffia yeast may be safely used in the feed of salmonid fish in accordance with the following prescribed conditions:
29128:<P>(2) The quantity of astaxanthin in finished feed, from phaffia yeast when used alone or in combination with other astaxanthin color additive sources listed in this part 73, shall not exceed 80 milligrams per kilogram (72 grams per ton) of finished feed.
29134:<P>(3) The presence of the color additive in salmonid fish that have been fed feeds containing phaffia yeast shall be declared in accordance with §§ 101.22(b), (c), and (k)(2) and 101.100(a)(2) of this chapter.

thinking
**Searching enzyme classification**
exec
/bin/bash -lc "rg -n -i 'fructofuranosidase|invertase|beta-fructo|saccharomyces cerevisiae|enzymes can be safely used|enzymes are used' /tmp/title21.xml | head -n 120" in /home/exedev/chewber succeeded in 51ms:
66058:<P>(2) <I>Yeast procedure.</I> The pH of the liquid eggs is adjusted to the range of 6.0 to 7.0, if necessary, by the addition of dilute, chemically pure hydrochloric acid, and controlled fermentation is maintained by adding food-grade baker's yeast (<I>Saccharomyces cerevisiae</I>). The quantity of yeast used and the time of reaction are sufficient to substantially reduce the glucose content of the liquid eggs.
66128:<P>(2) <I>Controlled fermentation procedures</I>—(i) <I>Yeast procedure.</I> Food-grade baker's yeast (<I>Saccharomyces cerevisiae</I>) is added to the liquid egg whites and controlled fermentation is maintained. The quantity of yeast used and the time of reaction are sufficient to substantially reduce the glucose content.
66185:<P>(2) <I>Yeast procedure.</I> The pH of the liquid egg yolks is adjusted to the range of 6.0 to 7.0, if necessary, by the addition of dilute, chemically pure hydrochloric acid, and controlled fermentation is maintained by adding food-grade baker's yeast (<I>Saccharomyces cerevisiae</I>). The quantity of yeast used and the time of reaction are sufficient to substantially reduce the glucose content of the liquid egg yolks.
72455:<P>(a) Bakers yeast protein is the insoluble proteinaceous material remaining after the mechanical rupture of yeast cells of <I>Saccharomyces cerevisiae</I> and removal of whole cell walls by centrifugation and separation of soluble cellular materials.
72769:<P>(a) Vitamin D<E T="52">2</E> bakers yeast is the substance produced by exposing bakers yeast (<I>Saccharomyces cerevisiae</I>) to ultraviolet light, resulting in the photochemical conversion of endogenous ergosterol in bakers yeast to vitamin D<E T="52">2</E> (also known as ergocalciferol or (9,10-seco(5Z,7E,22E)-5,7,10(19),22-ergostatetraen-3-ol)).
79111:<P>Dried yeast (<I>Saccharomyces cerevisiae</I> and <I>Saccharomyces fragilis</I>) and dried torula yeast (<I>Candida utilis</I>) may be safely used in food provided the total folic acid content of the yeast does not exceed 0.04 milligram per gram of yeast (approximately 0.008 milligram of pteroyglutamic acid per gram of yeast).
79122:<P>(a) Bakers yeast glycan is the comminuted, washed, pasteurized, and dried cell walls of the yeast, <I>Saccharomyces cerevisiae.</I> It is composed principally of long chain carbohydrates, not less than 85 percent on a dry solids basis. The carbohydrate is composed of glycan and mannan units in approximately a 2:1 ratio.
111712:<P>(a) Bakers yeast extract is the food ingredient resulting from concentration of the solubles of mechanically ruptured cells of a selected strain of yeast, <I>Saccharomyces cerevisiae.</I> It may be concentrated or dried.
181926:<P>(g) Selenium yeast is a dried, non-viable yeast (<I>Saccharomyces cerevisiae</I>) cultivated in a fed-batch fermentation which provides incremental amounts of cane molasses and selenium salts in a manner which minimizes the detrimental effects of selenium salts on the growth rate of the yeast and allows for optimal incorporation of inorganic selenium into cellular organic material. Residual inorganic selenium is eliminated in a rigorous washing process and must not exceed 2 percent of the total selenium content in the final selenium yeast product.
205969:<P>(a) <I>Identification.</I> An alkaline phosphatase or isoenzymes test system is a device intended to measure alkaline phosphatase or its isoenzymes (a group of enzymes with similar biological activity) in serum or plasma. Measurements of alkaline phosphatase or its isoenzymes are used in the diagnosis and treatment of liver, bone, parathyroid, and intestinal diseases.
206492:<P>(a) <I>Identification.</I> A creatine phosphokinase/creatine kinase or isoenzymes test system is a device intended to measure the activity of the enzyme creatine phosphokinase or its isoenzymes (a group of enzymes with similar biological activity) in plasma and serum. Measurements of creatine phosphokinase and its isoenzymes are used in the diagnosis and treatment of myocardial infarction and muscle diseases such as progressive, Duchenne-type muscular dystrophy. 
207310:<P>(a) <I>Identification.</I> A lactate dehydrogenase isoenzymes test system is a device intended to measure the activity of lactate dehydrogenase isoenzymes (a group of enzymes with similar biological activity) in serum. Measurements of lactate dehydrogenase isoenzymes are used in the diagnosis and treatment of liver diseases, such as viral hepatitis, and myocardial infarction.
217918:<TD class="left border-right-single"><E T="03">Saccharomyces cerevisiae</E></TD>
217919:<TD class="left"><E T="03">Saccharomyces cerevisiae.</E></TD>
218640:<TD class="left"><E T="03">Saccharomyces cerevisiae.</E></TD>
219560:<TD class="left"><E T="03">Saccharomyces cerevisiae.</E></TD>
220277:<HEAD>§ 866.5785   Anti-<E T="7462">Saccharomyces cerevisiae</E> (<E T="7462">S. cerevisiae</E>) antibody (ASCA) test systems.</HEAD>
220278:<P>(a) <I>Identification.</I> The Anti-<I>Saccharomyces cerevisiae</I> (<I>S. cerevisiae</I>) antibody (ASCA) test system is an in vitro diagnostic device that consists of the reagents used to measure, by immunochemical techniques, antibodies to <I>S. cerevisiae</I> (baker's or brewer's yeast) in human serum or plasma. Detection of <I>S. cerevisiae</I> antibodies may aid in the diagnosis of Crohn's disease. 
220280:<P>(b) <I>Classification.</I> Class II (special controls). The special control is FDA's “Guidance for Industry and FDA Reviewers: Class II Special Control Guidance Document for Anti-<I>Saccharomyces cerevisiae</I> (<I>S. cerevisiae</I>) Antibody (ASCA) Premarket Notifications.” 

thinking
**Searching enzyme-related CFR sections**
exec
/bin/bash -lc "rg -n '<HEAD>§ 184\\.[0-9]+["'^<]*</HEAD>'"' /tmp/title21.xml | head -n 240" in /home/exedev/chewber succeeded in 51ms:
106185:<HEAD>§ 184.1   Substances added directly to human food affirmed as generally recognized as safe (GRAS).</HEAD>
106232:<HEAD>§ 184.1005   Acetic acid.</HEAD>
106251:<HEAD>§ 184.1007   Aconitic acid.</HEAD>
106284:<HEAD>§ 184.1009   Adipic acid.</HEAD>
106307:<HEAD>§ 184.1011   Alginic acid.</HEAD>
106342:<HEAD>§ 184.1012   α-Amylase enzyme preparation from Bacillus stearothermophilus.</HEAD>
106361:<HEAD>§ 184.1021   Benzoic acid.</HEAD>
106380:<HEAD>§ 184.1024   Bromelain.</HEAD>
106399:<HEAD>§ 184.1025   Caprylic acid.</HEAD>
106418:<HEAD>§ 184.1027   Mixed carbohydrase and protease enzyme product.</HEAD>
106437:<HEAD>§ 184.1033   Citric acid.</HEAD>
106454:<HEAD>§ 184.1034   Catalase (bovine liver).</HEAD>
106473:<HEAD>§ 184.1061   Lactic acid.</HEAD>
106494:<HEAD>§ 184.1063   Enzyme-modified lecithin.</HEAD>
106529:<HEAD>§ 184.1065   Linoleic acid.</HEAD>
106550:<HEAD>§ 184.1069   Malic acid.</HEAD>
106569:<HEAD>§ 184.1077   Potassium acid tartrate.</HEAD>
106590:<HEAD>§ 184.1081   Propionic acid.</HEAD>
106611:<HEAD>§ 184.1090   Stearic acid.</HEAD>
106632:<HEAD>§ 184.1091   Succinic acid.</HEAD>

thinking
**Investigating enzyme regulation references**
exec
/bin/bash -lc "rg -n '<HEAD>§ 173\\.130' /tmp/title21.xml" in /home/exedev/chewber succeeded in 51ms:
79668:<HEAD>§ 173.130   Carbohydrase derived from <E T="7462">Rhizopus oryzae.</E></HEAD>

thinking
**Planning enzyme section scan**
exec
/bin/bash -lc "rg -n '<HEAD>§ 173\\.[0-9]+["'^<]*(enzyme|enzymes|yeast|invert|sugar|carbohydrase|saccharase|fructofuranosidase)'"' /tmp/title21.xml | head -n 200" in /home/exedev/chewber succeeded in 51ms:
79624:<HEAD>§ 173.115   Alpha-acetolactate decarboxylase (α-ALDC) enzyme preparation derived from a recombinant Bacillus subtilis.</HEAD>
79761:<HEAD>§ 173.150   Milk-clotting enzymes, microbial.</HEAD>
80600:<HEAD>§ 173.320   Chemicals for controlling microorganisms in cane-sugar and beet-sugar mills.</HEAD>
81202:<HEAD>§ 173.357   Materials used as fixing agents in the immobilization of enzyme preparations.</HEAD>

thinking
**Searching CFR for invertase**
codex
I confirmed eCFR API access and scanned all of Title 21 text; there is no direct “invertase” entry string hit. I’m now checking nearby enzyme/GRAS framework sections and FDA GRAS notices to report status accurately with citations.
exec
/bin/bash -lc "rg -n -i 'inver["'^<]{0,40}tase|invertase|beta[''^<]{0,30}fructofuranosidase|saccharase'"' /tmp/title21.xml | head -n 50" in /home/exedev/chewber succeeded in 51ms:


thinking
**Examining FDA CFR enzyme listings**
exec
/bin/bash -lc "rg -n 'Subpart D.*Enzymes|Subpart B.*Essential Oils|PART 182|§ 182\\.' /tmp/title21.xml | head -n 200" in /home/exedev/chewber succeeded in 51ms:
40035:<P>(2) The term <I>spice</I> means any aromatic vegetable substance in the whole, broken, or ground form, except for those substances which have been traditionally regarded as foods, such as onions, garlic and celery; whose significant function in food is seasoning rather than nutritional; that is true to name; and from which no portion of any volatile oil or other flavoring principle has been removed. Spices include the spices listed in § 182.10 and part 184 of this chapter, such as the following:
40041:<P>(3) The term <I>natural flavor</I> or <I>natural flavoring</I> means the essential oil, oleoresin, essence or extractive, protein hydrolysate, distillate, or any product of roasting, heating or enzymolysis, which contains the flavoring constituents derived from a spice, fruit or fruit juice, vegetable or vegetable juice, edible yeast, herb, bark, bud, root, leaf or similar plant material, meat, seafood, poultry, eggs, dairy products, or fermentation products thereof, whose significant function in food is flavoring rather than nutritional. Natural flavors include the natural essence or extractives obtained from plants listed in §§ 182.10, 182.20, 182.40, and 182.50 and part 184 of this chapter, and the substances listed in § 172.510 of this chapter.
103896:<HEAD>PART 182—SUBSTANCES GENERALLY RECOGNIZED AS SAFE
103912:<HEAD>§ 182.1   Substances that are generally recognized as safe.</HEAD>
103935:<HEAD>§ 182.10   Spices and other natural seasonings and flavorings.</HEAD>
104291:<HEAD>§ 182.20   Essential oils, oleoresins (solvent-free), and natural extractives (including distillates).</HEAD>
104955:<HEAD>§ 182.40   Natural extractives (solvent-free) used in conjunction with spices, seasonings, and flavorings.</HEAD>
104999:<HEAD>§ 182.50   Certain other spices, seasonings, essential oils, oleoresins, and natural extracts.</HEAD>
105038:<HEAD>§ 182.60   Synthetic flavoring substances and adjuvants.</HEAD>
105091:<HEAD>§ 182.70   Substances migrating from cotton and cotton fabrics used in dry food packaging.</HEAD>
105146:<HEAD>§ 182.90   Substances migrating to food from paper and paperboard products.</HEAD>
105214:<HED>Editorial Note:</HED><PSPACE>For <E T="04">Federal Register</E> citations affecting § 182.90, see the List of CFR Sections Affected, which appears in the Finding Aids section of the printed volume and at <I>www.govinfo.gov.</I></PSPACE></EDNOTE>
105219:<HEAD>§ 182.99   Adjuvants for pesticide chemicals.</HEAD>
105236:<HEAD>§ 182.1045   Glutamic acid.</HEAD>
105249:<HEAD>§ 182.1047   Glutamic acid hydrochloride.</HEAD>
105262:<HEAD>§ 182.1057   Hydrochloric acid.</HEAD>
105275:<HEAD>§ 182.1073   Phosphoric acid.</HEAD>
105286:<HEAD>§ 182.1087   Sodium acid pyrophosphate.</HEAD>
105297:<HEAD>§ 182.1125   Aluminum sulfate.</HEAD>
105308:<HEAD>§ 182.1127   Aluminum ammonium sulfate.</HEAD>

thinking
**Investigating invertase enzyme regulation**
🌐 Searching the web...
🌐 Searched: site:fda.gov invertase GRAS 21 CFR

thinking
**Assessing CFR citations for invertase**
exec
/bin/bash -lc "rg -n '<HEAD>§ 173\\.3[0-9]+' /tmp/title21.xml | head -n 80" in /home/exedev/chewber succeeded in 50ms:
80183:<HEAD>§ 173.300   Chlorine dioxide.</HEAD>
80208:<HEAD>§ 173.310   Boiler water additives.</HEAD>
80443:<HEAD>§ 173.315   Chemicals used in washing or to assist in the peeling of fruits and vegetables.</HEAD>
80600:<HEAD>§ 173.320   Chemicals for controlling microorganisms in cane-sugar and beet-sugar mills.</HEAD>
80775:<HEAD>§ 173.322   Chemicals used in delinting cottonseed.</HEAD>
80812:<HEAD>§ 173.325   Acidified sodium chlorite solutions.</HEAD>
80855:<HEAD>§ 173.340   Defoaming agents.</HEAD>
81082:<HEAD>§ 173.342   Chlorofluorocarbon 113 and perfluorohexane.</HEAD>
81097:<HEAD>§ 173.345   Chloropentafluoroethane.</HEAD>
81124:<HEAD>§ 173.350   Combustion product gas.</HEAD>
81162:<HEAD>§ 173.355   Dichlorodifluoromethane.</HEAD>
81185:<HEAD>§ 173.356   Hydrogen peroxide.</HEAD>
81202:<HEAD>§ 173.357   Materials used as fixing agents in the immobilization of enzyme preparations.</HEAD>
81261:<HEAD>§ 173.360   Octafluorocyclobutane.</HEAD>
81290:<HEAD>§ 173.368   Ozone.</HEAD>
81311:<HEAD>§ 173.370   Peroxyacids.</HEAD>
81330:<HEAD>§ 173.375   Cetylpyridinium chloride.</HEAD>
81351:<HEAD>§ 173.385   Sodium methyl sulfate.</HEAD>
81364:<HEAD>§ 173.395   Trifluoromethane sulfonic acid.</HEAD>


thinking
**Investigating EFSA invertase data**
thinking
**Adjusting search strategy**
🌐 Searching the web...
🌐 Searched: site:efsa.europa.eu invertase food enzyme Saccharomyces cerevisiae EFSA Journal

thinking
**Planning EU approval status check**
🌐 Searching the web...
🌐 Searched: EUR-Lex E 1103 invertase Annex II 1333/2008

thinking
**Clarifying enzyme authorization status**
🌐 Searching the web...
🌐 Searched: apps.who.int food-additives-contaminants-jecfa database invertase

thinking
**Searching IARC monographs**
🌐 Searching the web...
🌐 Searched: site:monographs.iarc.who.int invertase

thinking
**Checking IARC monographs for invertase**
exec
/bin/bash -lc "curl -sL 'https://monographs.iarc.who.int/list-of-classifications' | rg -n -i 'invertase|fructofuranosidase|saccharase' | head" in /home/exedev/chewber succeeded in 1.06s:


thinking
**Confirming absence of classification**
exec
/bin/bash -lc "curl -sL 'https://monographs.iarc.who.int/list-of-classifications' | head -n 30" in /home/exedev/chewber succeeded in 371ms:
<!DOCTYPE html>
<html lang="en-US">
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-WG6CVZS');</script>
  <!-- End Google Tag Manager -->

    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-R0EWEY776X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-R0EWEY776X');
</script>

thinking
**Testing text extraction methods**
codex
IARC pages are reachable; I’m validating classification data now by checking the official “List of Classifications” page content and whether invertase appears in it. After this I’ll collect PubMed recent studies and then draft the files.
exec
/bin/bash -lc "curl -sL 'https://monographs.iarc.who.int/list-of-classifications' | rg -n -i 'benzene|asbestos|formaldehyde|glyphosate|classification' | head -n 20" in /home/exedev/chewber succeeded in 500ms:
25:		<meta property="og:url" content="https://monographs.iarc.who.int/list-of-classifications" />
26:		    <meta property="og:title" content="<h2>List of Classifications</h2>" />
29:	<title>List of Classifications &#8211; IARC Monographs on the Identification of Carcinogenic Hazards to Humans</title>
30:<link rel="alternate" hreflang="en" href="https://monographs.iarc.who.int/list-of-classifications/" />
164:<body class="page-template-default page page-id-6403 long-read iarc-site-monographs vertical-scroll-theme list-of-classifications" >
181:<li id="menu-item-5206" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-5206"><a href="https://monographs.iarc.who.int/agents-classified-by-the-iarc/">Classifications</a><a href="#" class="sign" aria-label="Toggle submenu"></a></li>
231:				            <a href="https://monographs.iarc.who.int/list-of-classifications/" class="btn btn-primary">EN</a>
307:<div class="menu-item menu-item-type-post_type menu-item-object-page current-menu-item"><a href="https://monographs.iarc.who.int/agents-classified-by-the-iarc/"title="Classifications">Classifications</a></div></li>
387:        <h1 class="entry-title"><h2>List of Classifications</h2></h1>    </header><!-- .entry-header -->
391:        <!-- The List of Classifications App -->
401:  .iarc-site-monographs.list-of-classifications main#main .container.inner {
484:<div id="list-of-classifications">Loading&#8230;</div>
487:Some IARC websites and applications are currently under maintenance and will be unavailable during the period between 8am CET to 12am CET Wednesday, November 22. Please try accessing the “List of classifications” after that date. Thank you for your understanding.
489:Certains des sites web et applications du CIRC sont en cours de maintenance et seront indisponibles le mercredi 22 novembre entre 8:00 (HEC) et 12:00. Vous pourrez accéder à notre liste des classifications après cette date. Merci pour votre compréhension. 
498:                                        <p>Published in section: Classifications</p>
500:            <p>Direct link: https://monographs.iarc.who.int/list-of-classifications/</p>
556:<div class="menu-item menu-item-type-post_type menu-item-object-page"><a href="https://monographs.iarc.who.int/agents-classified-by-the-iarc/"title="Classifications">Classifications</a></div></li>

thinking
**Checking source for classification data**
exec
/bin/bash -lc "curl -sL 'https://monographs.iarc.who.int/agents-classified-by-the-iarc/' | rg -n -i 'Group 1|Group 2A|Group 2B|invertase|download|csv|json|application|list' | head -n 40" in /home/exedev/chewber succeeded in 1.18s:
122:			!function(e,a,t){var n,r,o,i=a.createElement("canvas"),p=i.getContext&&i.getContext("2d");function s(e,t){var a=String.fromCharCode;p.clearRect(0,0,i.width,i.height),p.fillText(a.apply(this,e),0,0);e=i.toDataURL();return p.clearRect(0,0,i.width,i.height),p.fillText(a.apply(this,t),0,0),e===i.toDataURL()}function c(e){var t=a.createElement("script");t.src=e,t.defer=t.type="text/javascript",a.getElementsByTagName("head")[0].appendChild(t)}for(o=Array("flag","emoji"),t.supports={everything:!0,everythingExceptFlag:!0},r=0;r<o.length;r++)t.supports[o[r]]=function(e){if(!p||!p.fillText)return!1;switch(p.textBaseline="top",p.font="600 32px Arial",e){case"flag":return s([127987,65039,8205,9895,65039],[127987,65039,8203,9895,65039])?!1:!s([55356,56826,55356,56819],[55356,56826,8203,55356,56819])&&!s([55356,57332,56128,56423,56128,56418,56128,56421,56128,56430,56128,56423,56128,56447],[55356,57332,8203,56128,56423,8203,56128,56418,8203,56128,56421,8203,56128,56430,8203,56128,56423,8203,56128,56447]);case"emoji":return!s([55357,56424,55356,57342,8205,55358,56605,8205,55357,56424,55356,57340],[55357,56424,55356,57342,8203,55358,56605,8203,55357,56424,55356,57340])}return!1}(o[r]),t.supports.everything=t.supports.everything&&t.supports[o[r]],"flag"!==o[r]&&(t.supports.everythingExceptFlag=t.supports.everythingExceptFlag&&t.supports[o[r]]);t.supports.everythingExceptFlag=t.supports.everythingExceptFlag&&!t.supports.flag,t.DOMReady=!1,t.readyCallback=function(){t.DOMReady=!0},t.supports.everything||(n=function(){t.readyCallback()},a.addEventListener?(a.addEventListener("DOMContentLoaded",n,!1),e.addEventListener("load",n,!1)):(e.attachEvent("onload",n),a.attachEvent("onreadystatechange",function(){"complete"===a.readyState&&t.readyCallback()})),(n=t.source||{}).concatemoji?c(n.concatemoji):n.wpemoji&&n.twemoji&&(c(n.twemoji),c(n.wpemoji)))}(window,document,window._wpemojiSettings);
151:var exactmetrics_frontend = {"js_events_tracking":"true","download_extensions":"zip,mp3,mpeg,pdf,docx,pptx,xlsx,rar","inbound_paths":"[{\"path\":\"\\\/go\\\/\",\"label\":\"affiliate\"},{\"path\":\"\\\/recommend\\\/\",\"label\":\"affiliate\"}]","home_url":"https:\/\/monographs.iarc.who.int","hash_tracking":"false"};
157:<link rel='https://api.w.org/' href='https://monographs.iarc.who.int/wp-json/' />
160:		window.tile_rest_url = "https:\/\/monographs.iarc.who.int\/wp-json\/tile\/v1\/posts";
190:	<li id="menu-item-4843" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-4843"><a target="_blank" href="/wp-content/uploads/2018/07/List-of-Volumes.pdf">List of Volumes</a><a href="#" class="sign" aria-label="Toggle submenu"></a></li>
450:<p><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"></span><img class="img-responsive" src="/wp-content/uploads/2019/06/banner-listofclassifications.jpg" alt="" width="100%"/></p>
473:<th scope="row">Group 1</th>
478:<th scope="row">Group 2A</th>
483:<th scope="row">Group 2B</th>
496:<p>It is strongly recommended to consult the complete <em>Monographs</em> on these agents, the publication date, and the list of studies considered.  Significant new information might support a different classification.<br />
498:<ul class="list-group">
499:	<li class="list-group-item "><a href="/list-of-classifications">List of Classifications</a> (optimized for the latest versions of the browsers Chrome and Mozilla Firefox)</li>
500:	<li class="list-group-item"><a href="/wp-content/uploads/2019/07/Classifications_by_cancer_site.pdf" target="_blank" rel="noopener noreferrer">List of Classifications by cancer site</a> (PDF file)</li>
501:	<li class="list-group-item"><a href="https://www.cancer-environnement.fr/fiches/publications-du-circ/classification-du-circ-par-localisations-cancereuses/" target="_blank" rel="noopener noreferrer">French version</a> of the List of classifications by cancer site, as hosted by Centre Léon Bérard</li>
521:<div class="list-group"><button class="list-group-item list-group-item-action active" type="button"> </button> <a class="list-group-item list-group-item-action" href="/list-of-classifications">List of classifications</a> <a class="list-group-item list-group-item-action" href="/wp-content/uploads/2019/07/Classifications_by_cancer_site.pdf" target="_blank" rel="noopener noreferrer">List of classifications by cancer site</a> <a class="list-group-item list-group-item-action" href="http://www.cancer-environnement.fr/325-Classifications-par-localisations-cancereuses.ce.aspx" target="_blank" rel="noopener noreferrer">French version of the List of classifications by cancer site, as hosted by Centre Léon Bérard</a></div>
542:<p>Note: In September 2022, four additional individual Group 1 agents were created by splitting up some existing agent groupings because not all agents in the groups had the same cancer sites with <em>sufficient</em> and <em>limited</em> evidence for cancer in humans. Three strains of human papillomavirus (HPV) were split from a larger grouping of HPV strains. Ultraviolet (UV) radiation from welding was split from a broader category of UV radiation.</p>
543:<p>Note 2: In July 2023, an additional Group 1 agent was generated by creating an individual listing for uranium, which was previously listed without being named specifically as a member of the family, Radionuclides, alpha-particle-emitting, internally deposited (Group 1).</p>
544:<p>Although care was taken in preparing these lists, mistakes may be present.</p>
702:                floatingEl[0].classList.remove("cc-floating");
703:                floatingEl[0].element.classList.add("cc-banner");

thinking
**Exploring classification data sources**
exec
/bin/bash -lc "curl -sL 'https://monographs.iarc.who.int/list-of-classifications/' -o /tmp/iarc_list.html && rg -n 'list-of-classifications|wp-json|api|json|classifications' /tmp/iarc_list.html | head -n 80" in /home/exedev/chewber succeeded in 1.48s:
25:		<meta property="og:url" content="https://monographs.iarc.who.int/list-of-classifications" />
30:<link rel="alternate" hreflang="en" href="https://monographs.iarc.who.int/list-of-classifications/" />
156:<link rel='https://api.w.org/' href='https://monographs.iarc.who.int/wp-json/' />
159:		window.tile_rest_url = "https:\/\/monographs.iarc.who.int\/wp-json\/tile\/v1\/posts";
164:<body class="page-template-default page page-id-6403 long-read iarc-site-monographs vertical-scroll-theme list-of-classifications" >
231:				            <a href="https://monographs.iarc.who.int/list-of-classifications/" class="btn btn-primary">EN</a>
401:  .iarc-site-monographs.list-of-classifications main#main .container.inner {
481:<script src="https://webapi.iarc.who.int/loc/loc.app.js"></script>
484:<div id="list-of-classifications">Loading&#8230;</div>
487:Some IARC websites and applications are currently under maintenance and will be unavailable during the period between 8am CET to 12am CET Wednesday, November 22. Please try accessing the “List of classifications” after that date. Thank you for your understanding.
489:Certains des sites web et applications du CIRC sont en cours de maintenance et seront indisponibles le mercredi 22 novembre entre 8:00 (HEC) et 12:00. Vous pourrez accéder à notre liste des classifications après cette date. Merci pour votre compréhension. 
500:            <p>Direct link: https://monographs.iarc.who.int/list-of-classifications/</p>

thinking
**Inspecting web API script**
exec
/bin/bash -lc "curl -sL 'https://webapi.iarc.who.int/loc/loc.app.js' -o /tmp/loc.app.js && rg -n 'http|api|json|classif|agents|webapi|monographs|loc' /tmp/loc.app.js | head -n 80" in /home/exedev/chewber succeeded in 1.06s:
1:!function(e){var a={};function r(o){if(a[o])return a[o].exports;var l=a[o]={i:o,l:!1,exports:{}};return e[o].call(l.exports,l,l.exports,r),l.l=!0,l.exports}r.m=e,r.c=a,r.d=function(e,a,o){r.o(e,a)||Object.defineProperty(e,a,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,a){if(1&a&&(e=r(e)),8&a)return e;if(4&a&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&a&&"string"!=typeof e)for(var l in e)r.d(o,l,function(a){return e[a]}.bind(null,l));return o},r.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(a,"a",a),a},r.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},r.p="",r(r.s=0)}([function(e,a,r){"use strict";var o=i(r(1)),l=i(r(2)),n=i(r(3)),u=i(r(4));function i(e){return e&&e.__esModule?e:{default:e}}(0,o.default)(document).ready((function(){var e=document.getElementById("list-of-classifications");if(!e)throw new Error('FATAL: could not find container element "#list-of-classifications".');var a,r=(a=n.default,Object.assign({},a,{agents:a.agents.map((function(e){return[(e.cas||[]).join(",<br>\n"),e.name||"",e.group||"",(e.volume||[]).join(", "),e.in_prep?"<i>In prep.</i>":e.year||"",e.yeareval||"",e.comment||""]}))})),i=r.agents,m=function(e,a){var r={};for(var o in e)a.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(r[o]=e[o]);return r}(r,["agents"]),y=u.default;Object.keys(m).map((function(e){return y=y.replace("${"+e+"}",m[e])})),e.innerHTML=y,(0,o.default)(e).find("#table").DataTable(Object.assign({},(0,l.default)(m),{data:i}))}))},function(e,a){e.exports=jQuery},function(e,a,r){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default=function(e){return{dom:"Bfrtip",buttons:["copy",{extend:"csv",charset:"UTF-8",bom:!0},{extend:"excel",charset:"UTF-8",title:"Agents Classified by the IARC Monographs, Volumes 1–"+e.last_volume,messageBottom:"Last updated: "+e.last_update},{extend:"pdf",title:"Agents Classified by the IARC Monographs, Volumes 1–"+e.last_volume,messageBottom:"\n\nLast updated: "+e.last_update},{extend:"print",exportOptions:{stripHtml:!1}}],columns:[{title:"CAS No.",class:"nowrap"},{title:"Agent"},{title:"Group"},{title:"Volume"},{title:"Volume publication year"},{title:"Evaluation year"},{title:"Additional information"}]}}},function(e,a){e.exports={last_volume:"140",last_update:"2026-02-25 16:34 (CET)",agents:[{name:"1,1,1,2-Tetrachloroethane",group:"2B",cas:["630-20-6"],volume:["41","Sup 7","71","106"],year:2014,yeareval:2012},{name:"1,1,1-Trichloroethane",group:"2A",cas:["71-55-6"],volume:["20","Sup 7","71","130"],year:"2022 online",yeareval:2021},{name:"1,1,2,2-Tetrachloroethane",group:"2B",cas:["79-34-5"],volume:["20","Sup 7","71","106"],year:2014,yeareval:2012},{name:"1,1,2-Trichloroethane",group:"3",cas:["79-00-5"],volume:["52","71"],year:1999,yeareval:1998},{name:"1,1-Dimethylhydrazine",group:"2B",cas:["57-14-7"],volume:["4","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2,3-Trichloropropane",group:"2A",cas:["96-18-4"],volume:["63"],year:1995,yeareval:1995},{name:"1,2,3-Tris(chloromethoxy)propane",group:"3",cas:["38571-73-2"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2-Bis(chloromethoxy)ethane",group:"3",cas:["13483-18-6"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2-Diamino-4-nitrobenzene",group:"3",cas:["99-56-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"1,2-Dibromo-3-chloropropane",group:"2B",cas:["96-12-8"],volume:["20","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2-Dichloroethane",group:"2B",cas:["107-06-2"],volume:["20","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2-Dichloropropane",group:"1",cas:["78-87-5"],volume:["41","Sup 7","71","110"],year:"2017",yeareval:2014},{name:"1,2-Diethylhydrazine",group:"2B",cas:["1615-80-1"],volume:["4","Sup 7","71"],year:1999,yeareval:1998},{name:"1,2-Dimethylhydrazine",group:"2A",cas:["540-73-8"],volume:["4","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"1,2-Epoxybutane",group:"2B",cas:["106-88-7"],volume:["47","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"1,2:3,4-Diepoxybutane (see 1,3-Butadiene)",cas:["1464-53-5"],volume:["11","Sup 7"]},{name:"1,3-Butadiene",group:"1",cas:["106-99-0"],volume:["Sup 7","54","71","97","100F"],year:2012,yeareval:2009},{name:"1,3-Dichloro-2-propanol",group:"2B",cas:["96-23-1"],volume:["101"],year:2013,yeareval:2011},{name:"1,3-Dichloropropene (technical-grade)",group:"2B",cas:["542-75-6"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"1,3-Dinitropyrene",group:"2B",cas:["75321-20-9"],volume:["46","105"],year:"2014",yeareval:2012},{name:"1,3-Propane sultone",group:"2A",cas:["1120-71-4"],volume:["4","Sup 7","71","110"],year:"2017",yeareval:2014,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"1,4-Bis(chloromethoxymethyl)benzene",group:"3",cas:["56894-91-8"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"1,4-Butanediol dimethanesulfonate (see Busulfan)",cas:["55-98-1"]},{name:"1,4-Diamino-2-nitrobenzene",group:"3",cas:["5307-14-2"],volume:["Sup 7","57"],year:1993,yeareval:1992},{name:"1,4-Dichloro-2-nitrobenzene",group:"2B",cas:["89-61-2"],volume:["65","123"],year:"2020 online",yeareval:2018},{name:"1,4-Dimethylphenanthrene",group:"3",cas:["22349-59-3"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"1,4-Dioxane",group:"2B",cas:["123-91-1"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"1,5-Naphthalene diisocyanate",group:"3",cas:["3173-72-6"],volume:["19","Sup 7","71"],year:1999,yeareval:1998},{name:"1,5-Naphthalenediamine",group:"3",cas:["2243-62-1"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"1,6-Dinitropyrene",group:"2B",cas:["42397-64-8"],volume:["46","105"],year:"2014",yeareval:2012},{name:"1,8-Dinitropyrene",group:"2B",cas:["42397-65-9"],volume:["Sup 7","46","105"],year:"2014",yeareval:2012},{name:"1-(2-Chloroethyl)-3-cyclohexyl-1-nitrosourea (CCNU) (Lomustine)",group:"2A",cas:["13010-47-4"],volume:["26","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"1-<i>tert</i>-Butoxypropan-2-ol",group:"2B",cas:["57018-52-7"],volume:["88","119"],year:2019,yeareval:2017},{name:"1-Amino-2,4-dibromoanthraquinone",group:"2B",cas:["81-49-2"],volume:["101"],year:2013,yeareval:2011},{name:"1-Amino-2-methylanthraquinone",group:"3",cas:["82-28-0"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"1-Bromopropane",group:"2B",cas:["106-94-5"],volume:["115"],year:"2018",yeareval:2016},{name:"1-Bromo-3-chloropropane",group:"2B",cas:["109-70-6"],volume:["125"],year:"2020 online",yeareval:2019},{name:"1-Butyl glycidyl ether",group:"2B",cas:["2426-08-6"],volume:["125"],year:"2020 online",yeareval:2019},{name:"1-Chloro-2-methylpropene",group:"2B",cas:["513-37-1"],volume:["63"],year:1995,yeareval:1995},{name:"1-Hydroxyanthraquinone",group:"2B",cas:["129-43-1"],volume:["82"],year:2002,yeareval:2002},{name:"1-Methylchrysene",group:"3",cas:["3351-28-8"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"1-Methylphenanthrene",group:"3",cas:["832-69-9"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"1-Naphthylamine",group:"3",cas:["134-32-7"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"1-Naphthylthiourea (ANTU)",group:"3",cas:["86-88-4"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"1-Nitronaphthalene",group:"3",cas:["86-57-7"],volume:["46"],year:1989,yeareval:1988},{name:"1-Nitropyrene",group:"2A",cas:["5522-43-0"],volume:["Sup 7","46","105"],year:"2014",yeareval:2012,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"1-[(5-Nitrofurfurylidene)amino]-2-imidazolidinone",group:"2B",cas:["555-84-0"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"11-Aminoundecanoic acid",group:"3",cas:["2432-99-7"],volume:["39","Sup 7"],year:1987,yeareval:1987},{name:"11H-Benz[<i>bc</i>]aceanthrylene",group:"3",cas:["202-94-8"],volume:["92"],year:2010,yeareval:2005},{name:"13H-Dibenzo[<i>a</i>,<i>g</i>]fluorene",group:"3",cas:["207-83-0"],volume:["92"],year:2010,yeareval:2005},{name:"2,2',5,5'-Tetrachlorobenzidine",group:"3",cas:["15721-02-5"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"2,2-Bis(bromomethyl)propane-1,3-diol",group:"2B",cas:["3296-90-0"],volume:["77"],year:2e3,yeareval:2e3},{name:"2,3,4,7,8-Pentachlorodibenzofuran",group:"1",cas:["57117-31-4"],volume:["100F"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"2,3,7,8-Tetrachlorodibenzo-<i>para</i>-dioxin",group:"1",cas:["1746-01-6"],volume:["Sup 7","69","100F"],year:2012,yeareval:2009},{name:"2,3-Dibromopropan-1-ol",group:"2B",cas:["96-13-9"],volume:["77"],year:2e3,yeareval:2e3},{name:"Diphenylamine",group:"2B",cas:["122-39-4"],volume:["130"],year:"2022 online",yeareval:2021},{name:"2,4'-Diphenyldiamine",group:"3",cas:["492-17-1"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"1,2-Diphenylhydrazine",group:"2B",cas:["122-66-7"],volume:["130"],year:"2022 online",yeareval:2021},{name:"2,4,5-Trimethylaniline",group:"3",cas:["137-17-7"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"2,4,6-Trichlorophenol (see also Polychlorophenols)",group:"2B",cas:["88-06-2"],volume:["117"],year:"2019",yeareval:2016},{name:"2,4,6-Trimethylaniline",group:"3",cas:["88-05-1"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"2,4,6-Trinitrotoluene",group:"3",cas:["118-96-7"],volume:["65"],year:1996,yeareval:1995},{name:"2,4,6-Tris(1-aziridinyl)-<i>s</i>-triazine",group:"3",cas:["51-18-3"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"2,4-D (2,4-dichlorophenoxyacetic acid) (See also Chlorophenoxy herbicides)",group:"2B",cas:["94-75-7"],volume:["113"],year:"2018",yeareval:2015},{name:"2,4-Diaminoanisole",group:"2B",cas:["615-05-4"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"2,4-Diaminotoluene",group:"2B",cas:["95-80-7"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"2,4-Dichloro-1-nitrobenzene",group:"2B",cas:["611-06-3"],volume:["123"],year:"2020 online",yeareval:2018},{name:"2,4-Dinitrotoluene",group:"2B",cas:["121-14-2"],volume:["65"],year:1996,yeareval:1995},{name:"2,4-Hexadienal",group:"2B",cas:["142-83-6"],volume:["101"],year:2013,yeareval:2011},{name:"2,4-Xylidine",group:"3",cas:["95-68-1"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"2,5-Diaminotoluene",group:"3",cas:["95-70-5"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"2,5-Xylidine",group:"3",cas:["95-78-3"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"2,6-Dichloro-<i>para</i>-phenylenediamine",group:"3",cas:["609-20-1"],volume:["39","Sup 7"],year:1987,yeareval:1987},{name:"2,6-Dimethylaniline (2,6-Xylidine)",group:"2B",cas:["87-62-7"],volume:["57"],year:1993,yeareval:1992},{name:"2,6-Dinitrotoluene",group:"2B",cas:["606-20-2"],volume:["65"],year:1996,yeareval:1995},{name:"2-(1-Aziridinyl)ethanol",group:"3",cas:["1072-52-2"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"2-(2-Formylhydrazino)-4-(5-nitro-2-furyl)thiazole",group:"2B",cas:["3570-75-0"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"2-Amino-4-chlorophenol",group:"2B",cas:["95-85-2"],volume:["123"],year:"2020 online",yeareval:2018},{name:"2-Amino-4-nitrophenol",group:"3",cas:["99-57-0"],volume:["57"],year:1993,yeareval:1992},{name:"2-Amino-5-(5-nitro-2-furyl)-1,3,4-thiadiazole",group:"2B",cas:["712-68-5"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"2-Amino-5-nitrophenol",group:"3",cas:["121-88-0"],volume:["57"],year:1993,yeareval:1992},{name:"2-Amino-5-nitrothiazole",group:"3",cas:["121-66-4"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"2-Aminoanthraquinone",group:"3",cas:["117-79-3"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"2-Bromopropane",group:"2A",cas:["75-26-3"],volume:["133"],year:"2024 online",yeareval:2023},{name:"2-Butoxyethanol",group:"3",cas:["111-76-2"],volume:["88"],year:2006,yeareval:2004},{name:"2-Chloro-1,1,1-trifluoroethane",group:"3",cas:["75-88-7"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"2-Chloronitrobenzene",group:"2B",cas:["88-73-3"],volume:["65","123"],year:"2020 online",yeareval:2018},{name:"2-Ethylhexyl acrylate",group:"2B",cas:["103-11-7"],volume:["60","122"],year:2019,yeareval:2018},{name:"2-Mercaptobenzothiazole",group:"2A",cas:["149-30-4"],volume:["115"],year:"2018 ",yeareval:2016},{name:"2-Methyl-1-nitroanthraquinone (uncertain purity)",group:"2B",cas:["129-15-7"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"2-Methylaziridine (Propyleneimine)",group:"2B",cas:["75-55-8"],volume:["9","Sup 7","71"],year:1999,yeareval:1998},{name:"2-Methylchrysene",group:"3",cas:["3351-32-4"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"2-Methylfluoranthene",group:"3",cas:["33543-31-6"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"2-Methylimidazole",group:"2B",cas:["693-98-1"],volume:["101"],year:2013,yeareval:2011},{name:"2-Naphthylamine",group:"1",cas:["91-59-8"],volume:["4","Sup 7","99","100F"],year:2012,yeareval:2009},{name:"<i>ortho</i>-Nitroanisole",group:"2A",cas:["91-23-6"],volume:["65","127"],year:"2021 online",yeareval:2020,comment:"NB Originally evaluated as 2-Nitroanisole"},{name:"2-Nitrofluorene",group:"2B",cas:["607-57-8"],volume:["46","105"],year:"2014",yeareval:2012},{name:"2-Nitronaphthalene",group:"3",cas:["581-89-5"],volume:["46"],year:1989,yeareval:1988},{name:"2-Nitropropane",group:"2B",cas:["79-46-9"],volume:["29","Sup 7","71"],year:1999,yeareval:1998},{name:"2-Nitropyrene",group:"3",cas:["789-07-1"],volume:["46"],year:1989,yeareval:1988},{name:"2-Nitrotoluene",group:"2A",cas:["88-72-2"],volume:["101"],year:2013,yeareval:2011,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"3,3'-Dichloro-4,4'-diaminodiphenyl ether",group:"2B",cas:["28434-86-8"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"3,3'-Dichlorobenzidine",group:"2B",cas:["91-94-1"],volume:["29","Sup 7"],year:1987,yeareval:1987},{name:"3,3'-Dimethoxybenzidine (<i>ortho</i>-Dianisidine)",group:"2B",cas:["119-90-4"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"3,3'-Dimethoxybenzidine-4,4'-diisocyanate",group:"3",cas:["91-93-0"],volume:["39","Sup 7"],year:1987,yeareval:1987},{name:"3,3'-Dimethylbenzidine (<i>ortho</i>-Tolidine)",group:"2B",cas:["119-93-7"],volume:["1","Sup 7"],year:1987,yeareval:1987},{name:"3,3′,4,4′-Tetrachloroazobenzene",group:"2A",cas:["14047-09-7"],volume:["117"],year:"2019",yeareval:2016,comment:"NB Overall evaluation upgraded to Group 2A"},{name:"3,3’,4,4’,5-Pentachlorobiphenyl (PCB-126)",group:"1",cas:["57465-28-8"],volume:["100F"],year:2012,yeareval:2009,comment:"See Polychlorinated biphenyls, dioxin-like, with a TEF according to WHO"},{name:"3,4-Epoxy-6-methylcyclohexylmethyl-3,4-epoxy-6-methylcyclo-hexanecarboxylate",group:"3",cas:["141-37-7"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"3,5-Dinitrotoluene",group:"3",cas:["618-85-9"],volume:["65"],year:1996,yeareval:1995},{name:"3,7-Dinitrofluoranthene",group:"2B",cas:["105735-71-5"],volume:["46","65","105"],year:"2014",yeareval:2012},{name:"3,9-Dinitrofluoranthene",group:"2B",cas:["22506-53-2"],volume:["46","65","105"],year:"2014",yeareval:2012},{name:"3-(<i>N</i>-Nitrosomethylamino)propionaldehyde",group:"3",cas:["85502-23-4"],volume:["Sup 7","85"],year:2004,yeareval:2003},{name:"3-(<i>N</i>-Nitrosomethylamino)propionitrile",group:"2B",cas:["60153-49-3"],volume:["Sup 7","85"],year:2004,yeareval:2003},{name:"3-Carbethoxypsoralen",group:"3",cas:["20073-24-9"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"3-Chloro-2-methylpropene, technical grade",group:"2B",cas:["563-47-3"],volume:["63","115"],year:"2018 ",yeareval:2016},{name:"3-Chloro-4-(dichloromethyl)-5-hydroxy-2(5<i>H</i>)-furanone",group:"2B",cas:["77439-76-0"],volume:["84"],year:2004,yeareval:2002},{name:"3-Methylchrysene",group:"3",cas:["3351-31-3"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"3-Methylfluoranthene",group:"3",cas:["1706-01-0"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"3-Monochloro-1,2-propanediol",group:"2B",cas:["96-24-2"],volume:["101"],year:2013,yeareval:2011},{name:"3-Nitrobenzanthrone",group:"2B",cas:["17117-34-9"],volume:["105"],year:"2014",yeareval:2012,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"3-Nitrofluoranthene",group:"3",cas:["892-21-7"],volume:["33","Sup 7"],year:1987,yeareval:1987},{name:"3-Nitroperylene",group:"3",cas:["20589-63-3"],volume:["46"],year:1989,yeareval:1988},{name:"4,4',6-Trimethylangelicin plus ultraviolet A radiation",group:"3",cas:["90370-29-9"],volume:["Sup 7"],year:1987,yeareval:1987},{name:"4,4'-Diaminodiphenyl ether",group:"2B",cas:["101-80-4"],volume:["29","Sup 7"],year:1987,yeareval:1987},{name:"4,4'-Dimethylangelicin plus ultraviolet A radiation",group:"3",cas:["22975-76-4"],volume:["Sup 7"],year:1987,yeareval:1987},{name:"4,4'-Methylene bis(2-methylaniline)",group:"2B",cas:["838-88-0"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"4,4'-Methylenebis(2-chloroaniline) (MOCA)",group:"1",cas:["101-14-4"],volume:["Sup 7","57","99","100F"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"4,4'-Methylenedianiline",group:"2B",cas:["101-77-9"],volume:["39","Sup 7"],year:1987,yeareval:1987},{name:"4,4'-Methylenediphenyl diisocyanate",group:"3",cas:["101-68-8"],volume:["19","Sup 7","71"],year:1999,yeareval:1998},{name:"4,4'-Thiodianiline",group:"2B",cas:["139-65-1"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"4,5',8-Trimethylpsoralen",group:"3",cas:["3902-71-4"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"4,5'-Dimethylangelicin plus ultraviolet A radiation",group:"3",cas:["4063-41-6"],volume:["Sup 7"],year:1987,yeareval:1987},{name:"4-Amino-2-nitrophenol",group:"3",cas:["119-34-6"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"4-Aminobiphenyl",group:"1",cas:["92-67-1"],volume:["1","Sup 7","99","100F"],year:2012,yeareval:2009},{name:"4-Chlorobenzotrifluoride",group:"2B",cas:["98-56-6"],volume:["125"],year:"2020 online",yeareval:2019},{name:"4-Chloro-<i>meta</i>-phenylenediamine",group:"3",cas:["5131-60-2"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"4-Chloro-<i>ortho</i>-phenylenediamine",group:"2B",cas:["95-83-0"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"4-Chloro-<i>ortho</i>-toluidine",group:"2A",cas:["95-69-2"],volume:["77","99"],year:2010,yeareval:2008},{name:"3-Chloronitrobenzene",group:"3",cas:["121-73-3"],volume:["65"],year:1996,yeareval:1995},{name:"4-Chloronitrobenzene",group:"2B",cas:["100-00-5"],volume:["65","123"],year:"2020 online",yeareval:2018},{name:"4-Hydroxyazobenzene",group:"3",cas:["1689-82-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"4-Methylchrysene",group:"3",cas:["3351-30-2"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"4-Methylimidazole",group:"2B",cas:["822-36-6"],volume:["101"],year:2013,yeareval:2011},{name:"4-Nitrobiphenyl",group:"3",cas:["92-93-3"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"4-Nitropyrene",group:"2B",cas:["57835-92-4"],volume:["46","105"],year:"2014",yeareval:2012},{name:"4-Vinylcyclohexene",group:"2B",cas:["100-40-3"],volume:["Sup 7","60"],year:1994,yeareval:1994},{name:"4-Vinylcyclohexene diepoxide",group:"2B",cas:["106-87-6"],volume:["Sup 7","60"],year:1994,yeareval:1994},{name:"4H-Cyclopenta[<i>def</i>]chrysene",group:"3",cas:["202-98-2"],volume:["92"],year:2010,yeareval:2005},{name:"5,6-Cyclopenteno-1,2-benzanthracene",group:"3",cas:["7099-43-6"],volume:["92"],year:2010,yeareval:2005},{name:"5-(Morpholinomethyl)-3-[(5-nitrofurfurylidene)­amino]-2-oxazolidinone",group:"2B",cas:["3795-88-8"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"5-Aminoacenaphthene",group:"3",cas:["4657-93-6"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"5-Chloro-<i>ortho</i>-toluidine",group:"3",cas:["95-79-4"],volume:["77"],year:2e3,yeareval:2e3},{name:"5-Fluorouracil",group:"3",cas:["51-21-8"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"5-Methoxypsoralen",group:"2A",cas:["484-20-8"],volume:["40","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"5-Methylangelicin plus ultraviolet A radiation",group:"3",cas:["73459-03-7"],volume:["Sup 7"],year:1987,yeareval:1987},{name:"5-Methylchrysene",group:"2B",cas:["3697-24-3"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"5-Nitro-<i>ortho</i>-anisidine",group:"3",cas:["99-59-2"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"5-Nitro-<i>ortho</i>-toluidine",group:"3",cas:["99-55-8"],volume:["48"],year:1990,yeareval:1989},{name:"5-Nitroacenaphthene",group:"2B",cas:["602-87-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"6-Mercaptopurine",group:"3",cas:["50-44-2"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"6-Methylchrysene",group:"3",cas:["1705-85-7"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"6-Nitrobenzo[<i>a</i>]pyrene",group:"3",cas:["63041-90-7"],volume:["Sup 7","46"],year:1989,yeareval:1988},{name:"6-Nitrochrysene",group:"2A",cas:["7496-02-8"],volume:["Sup 7","46","105"],year:"2014",yeareval:2012,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"7-Methylpyrido[3,4-<i>c</i>]psoralen",group:"3",cas:["85878-63-3"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"7-Nitrobenz[<i>a</i>]anthracene",group:"3",cas:["20268-51-3"],volume:["46"],year:1989,yeareval:1988},{name:"7H-Dibenzo[<i>c</i>,<i>g</i>]carbazole",group:"2B",cas:["194-59-2"],volume:["32","Sup 7","103"],year:2013,yeareval:2011},{name:"8-Hydroxyquinoline",group:"3",cas:["148-24-3"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"9-Nitroanthracene",group:"3",cas:["602-60-8"],volume:["33","Sup 7"],year:1987,yeareval:1987},{name:"<i>Aloe vera</i>, whole leaf extract",group:"2B",volume:["108"],year:2016,yeareval:2013},{name:"<i>Clonorchis sinensis</i> (infection with)",group:"1",volume:["61","100B"],year:2012,yeareval:2009},{name:"<i>Fusarium graminearum</i>, <i>F. culmorum</i>, and <i>F. crookwellense</i>, toxins derived from (zearalenone, deoxynivalenol, nivalenol, and fusarenone X)",group:"3",volume:["Sup 7","56"],year:1993,yeareval:1992},{name:"<i>Fusarium moniliforme</i>, toxins derived from (fumonisin B<sub>1</sub>, fumonisin B<sub>2</sub>, and fusarin C)",group:"2B",cas:["116355-83-0"],volume:["56"],year:1993,yeareval:1992},{name:"<i>Fusarium sporotrichioides</i>, toxins derived from (T-2 toxin)",group:"3",volume:["56"],year:1993,yeareval:1992},{name:"<i>Ginkgo biloba</i> extract",group:"2B",cas:["90045-36-6"],volume:["108"],year:"2016",yeareval:2013},{name:"<i>Helicobacter pylori</i> (infection with)",group:"1",volume:["61","100B"],year:2012,yeareval:2009},{name:"<i>Microcystis</i> extracts",group:"3",volume:["94"],year:2010,yeareval:2006},{name:"<i>N</i>'-Nitrosoanabasine (NAB)",group:"3",cas:["37620-20-5"],volume:["37","Sup 7","89"],year:2007,yeareval:2004},{name:"<i>N</i>'-Nitrosoanatabine (NAT)",group:"3",cas:["71267-22-6"],volume:["37","Sup 7","89"],year:2007,yeareval:2004},{name:"<i>N</i>'-Nitrosonornicotine (NNN) and 4-(<i>N</i>-Nitrosomethylamino)-1-(3-pyridyl)-1-butanone (NNK)",group:"1",cas:["16543-55-8","64091-91-4"],volume:["Sup 7","89","100E"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"<i>N</i>,<i>N</i>'-Diacetylbenzidine",group:"2B",cas:["613-35-4"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>,<i>N</i>'-Diethylthiourea",group:"3",cas:["105-55-5"],volume:["79"],year:2001,yeareval:2e3},{name:"<i>N</i>,<i>N</i>-Bis(2-chloroethyl)-2-naphthylamine (see Chlornaphazine)",cas:["494-03-1"]},{name:"<i>N</i>,<i>N</i>-Dimethyl-<i>p</i>-toluidine",group:"2B",cas:["99-97-8"],volume:["115"],year:"2018 ",yeareval:2016},{name:"<i>N</i>,<i>N</i>-Dimethylacetamide",group:"2B",cas:["127-19-5"],volume:["123"],year:"2020 online",yeareval:2018},{name:"<i>N</i>,<i>N</i>-Dimethylaniline",group:"3",cas:["121-69-7"],volume:["57"],year:1993,yeareval:1992},{name:"<i>N</i>,<i>N</i>-Dimethylformamide",group:"2A",cas:["68-12-2"],volume:["47","71","115"],year:"2018 ",yeareval:2016},{name:"<i>N</i>-Ethyl-<i>N</i>-nitrosourea",group:"2A",cas:["759-73-9"],volume:["17","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"<i>N</i>-Methyl-<i>N</i>,4-dinitrosoaniline",group:"3",cas:["99-80-9"],volume:["1","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Methyl-<i>N</i>-nitrosourea",group:"2A",cas:["684-93-5"],volume:["17","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"<i>N</i>-Methyl-<i>N</i>-nitrosourethane",group:"2B",cas:["615-53-2"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Methyl-<i>N</i>´-nitro-<i>N</i>-nitrosoguanidine (MNNG)",group:"2A",cas:["70-25-7"],volume:["4","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"<i>N</i>-Methylolacrylamide",group:"2B",cas:["924-42-5"],volume:["60","130"],year:"2022 online",yeareval:2021},{name:"<i>N</i>-Nitrosodi-<i>n</i>-butylamine",group:"2B",cas:["924-16-3"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosodi-<i>n</i>-propylamine",group:"2B",cas:["621-64-7"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosodiethanolamine",group:"2B",cas:["1116-54-7"],volume:["17","Sup 7","77"],year:2e3,yeareval:2e3},{name:"<i>N</i>-Nitrosodiethylamine",group:"2A",cas:["55-18-5"],volume:["17","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"<i>N</i>-Nitrosodimethylamine",group:"2A",cas:["62-75-9"],volume:["17","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"<i>N</i>-Nitrosodiphenylamine",group:"3",cas:["86-30-6"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosofolic acid",group:"3",cas:["29291-35-8"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosoguvacine",group:"3",cas:["55557-01-2"],volume:["Sup 7","85"],year:2004,yeareval:2003},{name:"<i>N</i>-Nitrosoguvacoline",group:"3",cas:["55557-02-3"],volume:["Sup 7","85"],year:2004,yeareval:2003},{name:"<i>N</i>-Nitrosohydroxyproline",group:"3",cas:["30310-80-6"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosomethylethylamine",group:"2B",cas:["10595-95-6"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosomethylvinylamine",group:"2B",cas:["4549-40-0"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosomorpholine",group:"2B",cas:["59-89-2"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosopiperidine",group:"2B",cas:["100-75-4"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosoproline",group:"3",cas:["7519-36-0"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrosopyrrolidine",group:"2B",cas:["930-55-2"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Nitrososarcosine",group:"2B",cas:["13256-22-9"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Phenyl-2-naphthylamine",group:"3",cas:["135-88-6"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"<i>N</i>-Vinyl-2-pyrrolidone",group:"3",cas:["88-12-0"],volume:["19","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>N</i>-[4-(5-Nitro-2-furyl)-2-thiazolyl]acetamide",group:"2B",cas:["531-82-8"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"<i>Opisthorchis felineus</i> (infection with)",group:"3",volume:["61"],year:1994,yeareval:1994},{name:"<i>Opisthorchis viverrini</i> (infection with)",group:"1",volume:["61","100B"],year:2012,yeareval:2009},{name:"<i>Schistosoma haematobium</i> (infection with)",group:"1",volume:["61","100B"],year:2012,yeareval:2009},{name:"<i>Schistosoma japonicum</i> (infection with)",group:"2B",volume:["61"],year:1994,yeareval:1994},{name:"<i>Schistosoma mansoni</i> (infection with)",group:"3",volume:["61"],year:1994,yeareval:1994},{name:"<i>cis</i>-9,10-Epoxystearic acid",group:"3",cas:["24560-98-3"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>d</i>-Limonene",group:"3",cas:["5989-27-5"],volume:["56","73"],year:1999,yeareval:1998,comment:"NB Overall evaluation downgraded to Group 3 with supporting evidence from other relevant data"},{name:"<i>meta</i>-Cresidine",group:"3",cas:["102-50-1"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"<i>meta</i>-Dichlorobenzene",group:"3",cas:["541-73-1"],volume:["73"],year:1999,yeareval:1998},{name:"<i>meta</i>-Phenylenediamine",group:"3",cas:["108-45-2"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"<i>n</i>-Butyl acrylate",group:"3",cas:["141-32-2"],volume:["39","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>n</i>-Propyl carbamate",group:"3",cas:["627-12-3"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"<i>ortho</i>-Aminoazotoluene",group:"2B",cas:["97-56-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"<i>ortho</i>-Anisidine (see also <i>ortho</i>-Anisidine hydrochloride)",group:"2A",cas:["90-04-0"],volume:["Sup 7","73","127"],year:"2021 online",yeareval:2020},{name:"<i>ortho</i>-Anisidine hydrochloride (see also <i>ortho</i>-Anisidine)",group:"2A",cas:["134-29-2"],volume:["127"],year:"2021 online",yeareval:2020},{name:"<i>ortho</i>-Dichlorobenzene",group:"3",cas:["95-50-1"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"<i>ortho</i>-Phenylenediamine",group:"2B",cas:["95-54-5"],volume:["123"],year:"2020 online",yeareval:2018},{name:"<i>ortho</i>-Phenylenediamine dihydrochloride",group:"2B",cas:["615-28-1"],volume:["123"],year:"2020 online",yeareval:2018},{name:"<i>ortho</i>-Phenylphenol",group:"3",cas:["90-43-7"],volume:["73"],year:1999,yeareval:1998},{name:"<i>ortho</i>-Toluidine",group:"1",cas:["95-53-4"],volume:["Sup 7","77","99","100F"],year:2012,yeareval:2009},{name:"<i>para</i>-Aminoazobenzene",group:"2B",cas:["60-09-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Aminobenzoic acid",group:"3",cas:["150-13-0"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Anisidine",group:"3",cas:["104-94-9"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Aramid fibrils",group:"3",cas:["24938-64-5"],volume:["68"],year:1997,yeareval:1996},{name:"<i>para</i>-Benzoquinone dioxime",group:"3",cas:["105-11-3"],volume:["29","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>para</i>-Chloroaniline",group:"2B",cas:["106-47-8"],volume:["57"],year:1993,yeareval:1992},{name:"<i>para</i>-Cresidine",group:"2B",cas:["120-71-8"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Dichlorobenzene",group:"2B",cas:["106-46-7"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"<i>para</i>-Dimethylaminoazobenzene",group:"2B",cas:["60-11-7"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Dimethylaminoazobenzenediazo sodium sulfonate",group:"3",cas:["140-56-7"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Nitroanisole",group:"2B",cas:["100-17-4"],volume:["123"],year:"2020 online",yeareval:2018},{name:"<i>para</i>-Nitrosodiphenylamine",group:"3",cas:["156-10-5"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Phenylenediamine",group:"3",cas:["106-50-3"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"<i>para</i>-Quinone",group:"3",cas:["106-51-4"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>trans</i>-1,4-Dichlorobutene",group:"3",cas:["110-57-6"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"<i>trans</i>-2-[(Dimethylamino)methylimino]-5-[2-(5-nitro-2-furyl)-vinyl]-1,3,4-oxadiazole",group:"2B",cas:["25962-77-0"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"A-alpha-C (2-Amino-9<i>H</i>-pyrido[2,3-<i>b</i>]indole)",group:"2B",cas:["26148-68-5"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"AF-2 [2-(2-Furyl)-3-(5-nitro-2-furyl)acrylamide]",group:"2B",cas:["3688-53-7"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Acenaphthene",group:"3",cas:["83-32-9"],volume:["92"],year:2010,yeareval:2005},{name:"Acepyrene (3,4-dihydrocyclopenta[<i>cd</i>]pyrene)",group:"3",cas:["25732-74-5"],volume:["92"],year:2010,yeareval:2005},{name:"Acetaldehyde",group:"2B",cas:["75-07-0"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Acetaldehyde associated with consumption of alcoholic beverages",group:"1",cas:["75-07-0"],volume:["100E"],year:2012,yeareval:2009},{name:"Acetamide",group:"2B",cas:["60-35-5"],volume:["7","Sup 7","71"],year:1999,yeareval:1998},{name:"Acetaminophen (see Paracetamol)",cas:["103-90-2"]},{name:"Acheson process, occupational exposure associated with",group:"1",volume:["111"],year:"2017",yeareval:2014},{name:"Aciclovir",group:"3",cas:["59277-89-3"],volume:["76"],year:2e3,yeareval:1999},{name:"Acid mists, strong inorganic",group:"1",volume:["54","100F"],year:2012,yeareval:2009},{name:"Acridine orange",group:"3",cas:["494-38-2"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Acriflavinium chloride",group:"3",cas:["8018-07-3"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Acrolein",group:"2A",cas:["107-02-8"],volume:["63","Sup 7","128"],year:"2021 online",yeareval:2020},{name:"Acrylamide",group:"2A",cas:["79-06-1"],volume:["60","Sup 7"],year:1994,yeareval:1994,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Acrylic acid",group:"3",cas:["79-10-7"],volume:["19","Sup 7","71"],year:1999,yeareval:1998},{name:"Acrylic fibres",group:"3",volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Acrylonitrile",group:"1",cas:["107-13-1"],volume:["19","Sup 7","71","136"],year:"2025 online",yeareval:2024},{name:"Acrylonitrile-butadiene-styrene copolymers",group:"3",volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Actinomycin D",group:"3",cas:["50-76-0"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Adriamycin (Doxorubicin)",group:"2A",cas:["23214-92-8"],volume:["10","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Aflatoxins",group:"1",cas:["1402-68-2"],volume:["Sup 7","56","82","100F"],year:2012,yeareval:2009},{name:"Agaritine",group:"3",cas:["2757-90-6"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Alachlor",group:"2A",cas:["15972-60-8"],volume:["140"],in_prep:!0,yeareval:2025},{name:"Alcoholic beverages in humans",group:"1",volume:["44","96","100E"],year:2012,yeareval:2009,comment:'NB There is "evidence suggesting lack of carcinogenicity" in humans of alcoholic beverages for non-Hodgkin lymphoma and kidney  cancer.'},{name:"Aldicarb",group:"3",cas:["116-06-3"],volume:["53"],year:1991,yeareval:1990},{name:"Aldrin (see Dieldrin, and aldrin metabolized to dieldrin)",cas:["309-00-2"]},{name:"Allyl chloride",group:"3",cas:["107-05-1"],volume:["36","Sup 7","71","125"],year:"2020 online",yeareval:2019},{name:"Allyl isothiocyanate",group:"3",cas:["57-06-7"],volume:["73","Sup 7"],year:1999,yeareval:1998},{name:"Allyl isovalerate",group:"3",cas:["2835-39-4"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Alpha particles (see Radionuclides)"},{name:"Aluminium production",group:"1",volume:["34","Sup 7","92","100F"],year:2012,yeareval:2009},{name:"Amaranth",group:"3",cas:["915-67-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Amitrole",group:"3",cas:["61-82-5"],volume:["79","Sup 7"],year:2001,yeareval:2e3,comment:"NB Overall evaluation downgraded to Group 3 with supporting evidence from other relevant data"},{name:"Ampicillin",group:"3",cas:["69-53-4"],volume:["50"],year:1990,yeareval:1989},{name:"Amsacrine",group:"2B",cas:["51264-14-3"],volume:["76"],year:2e3,yeareval:1999},{name:"<i>tert</i>-Amyl methyl ether",group:"3",cas:["994-05-8"],volume:["138"],in_prep:!0,yeareval:2025},{name:"Anaesthetics, volatile",group:"3",volume:["11","Sup 7"],year:1987,yeareval:1987},{name:"Androgenic (anabolic) steroids",group:"2A",volume:["Sup 7"],year:1987,yeareval:1987},{name:"Angelicin plus ultraviolet A radiation",group:"3",cas:["523-50-2"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Aniline (see also Aniline hydrochloride)",group:"2A",cas:["62-53-3"],volume:["27","Sup 7","127"],year:"2021 online",yeareval:2020},{name:"Aniline hydrochloride (see also Aniline)",group:"2A",cas:["142-04-1"],volume:["127"],year:"2021 online",yeareval:2020},{name:"Anthanthrene",group:"3",cas:["191-26-4"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Anthracene",group:"2B",cas:["120-12-7"],volume:["92","Sup 7","133"],year:"2024 online",yeareval:2023},{name:"Anthranilic acid",group:"3",cas:["118-92-3"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Anthraquinone",group:"2B",cas:["84-65-1"],volume:["101"],year:2013,yeareval:2011},{name:"Antimony trioxide, see Trivalent antimony",cas:["1309-64-4"]},{name:"Antimony trisulfide, see Trivalent antimony",cas:["1345-04-6"]},{name:"Apholate",group:"3",cas:["52-46-0"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Aramite®",group:"2B",cas:["140-57-8"],volume:["5","Sup 7"],year:1987,yeareval:1987},{name:"Areca nut",group:"1",volume:["85","100E"],year:2012,yeareval:2009},{name:"Arecoline",group:"2B",volume:["128"],year:"2021 online",yeareval:2020},{name:"Aristolochic acid",group:"1",cas:["313-67-7"],volume:["82","100A"],year:2012,yeareval:2008,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Aristolochic acid, plants containing",group:"1",cas:["313-67-7"],volume:["82","100A"],year:2012,yeareval:2008},{name:"Arsenic and inorganic arsenic compounds",group:"1",cas:["7440-38-2"],volume:["23","Sup 7","100C"],year:2012,yeareval:2009},{name:"Arsenobetaine and other organic arsenic compounds that are not metabolized in humans",group:"3",cas:["64436-13-1"],volume:["100C"],year:2012,yeareval:2009},{name:"Art glass, glass containers and pressed ware (manufacture of)",group:"2A",volume:["58"],year:1993,yeareval:1993},{name:"Asbestos (all forms, including actinolite, amosite, anthophyllite, chrysotile, crocidolite, tremolite)",group:"1",cas:["1332-21-4","12172-73-5","12001-29-5","12001-28-4"],volume:["14","Sup 7","100C"],year:2012,yeareval:2009,comment:"NB Mineral substances (e.g. talc or vermiculite) that contain asbestos should also be regarded as carcinogenic to humans<br/>\nNB2 These CAS Nos are for substances that CAS does not treat in its regular CA index"},{name:"Aspartame",group:"2B",cas:["22839-47-0"],volume:["134"],year:"2024 online",yeareval:2023},{name:"Atrazine",group:"2A",cas:["1912-24-9"],volume:["53","73","140"],in_prep:!0,yeareval:2025},{name:"Attapulgite (see Palygorskite)",cas:["12174-11-7"]},{name:"Auramine",group:"2B",cas:["492-80-8"],volume:["1","Sup 7","99","100F"],year:2012,yeareval:2009},{name:"Auramine production",group:"1",volume:["Sup 7","99","100F"],year:2012,yeareval:2009},{name:"Aurothioglucose",group:"3",cas:["12192-57-3"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Automotive gasoline (see also Gasoline engine exhaust, and Aviation gasoline)",group:"1",volume:["45","138"],in_prep:!0,yeareval:2025},{name:"Azacitidine",group:"2A",cas:["320-67-2"],volume:["50"],year:1990,yeareval:1989,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Azaserine",group:"2B",cas:["115-02-6"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Azathioprine",group:"1",cas:["446-86-6"],volume:["26","Sup 7","100A"],year:2012,yeareval:2008},{name:"Aziridine",group:"2B",cas:["151-56-4"],volume:["9","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Aziridyl benzoquinone",group:"3",cas:["800-24-8"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Azobenzene",group:"3",cas:["103-33-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"BK polyomavirus (BKV)",group:"2B",volume:["104"],year:"2014",yeareval:2012},{name:"Benz[<i>a</i>]acridine",group:"3",cas:["225-11-6"],volume:["32","Sup 7","103"],year:2013,yeareval:2011},{name:"Benz[<i>a</i>]anthracene",group:"2B",cas:["56-55-3"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benz[<i>c</i>]acridine",group:"3",cas:["225-51-4"],volume:["32","Sup 7","103"],year:2013,yeareval:2011},{name:"Benz[<i>j</i>]aceanthrylene",group:"2B",cas:["202-33-5"],volume:["92"],year:2010,yeareval:2005,comment:"NB Overall evaluation upgraded to Group 2B with supporting mechanistic and other relevant data"},{name:"Benz[<i>l</i>]aceanthrylene",group:"3",cas:["211-91-6"],volume:["92"],year:2010,yeareval:2005},{name:"Benzene",group:"1",cas:["71-43-2"],volume:["29","Sup 7","100F","120"],year:"2018",yeareval:2017},{name:"Benzidine",group:"1",cas:["92-87-5"],volume:["29","Sup 7","99","100F"],year:2012,yeareval:2009},{name:"Benzidine, dyes metabolized to",group:"1",volume:["99","100F"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Benzo[<i>a</i>]fluoranthene",group:"3",cas:["203-33-8"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Benzo[<i>a</i>]fluorene",group:"3",cas:["238-84-6"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Benzo[<i>a</i>]pyrene",group:"1",cas:["50-32-8"],volume:["Sup 7","92","100F"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Benzo[<i>b</i>]chrysene",group:"3",cas:["214-17-5"],volume:["92"],year:2010,yeareval:2005},{name:"Benzo[<i>b</i>]fluoranthene",group:"2B",cas:["205-99-2"],volume:["92"],year:2010,yeareval:2005},{name:"Benzo[<i>b</i>]fluorene",group:"3",cas:["243-17-4"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benzo[<i>b</i>]naphtho[2,1-d]thiophene",group:"3",cas:["239-35-0"],volume:["103"],year:2013,yeareval:2011},{name:"Benzo[<i>c</i>]fluorene",group:"3",cas:["205-12-9"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benzo[<i>c</i>]phenanthrene",group:"2B",cas:["195-19-7"],volume:["92","Sup 7"],year:2010,yeareval:2005,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Benzo[<i>e</i>]pyrene",group:"3",cas:["192-97-2"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benzo[<i>g</i>]chrysene",group:"3",cas:["196-78-1"],volume:["92"],year:2010,yeareval:2005},{name:"Benzo[<i>ghi</i>]fluoranthene",group:"3",cas:["203-12-3"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benzo[<i>ghi</i>]perylene",group:"3",cas:["191-24-2"],volume:["92","Sup 7"],year:2010,yeareval:2005},{name:"Benzo[<i>j</i>]fluoranthene",group:"2B",cas:["205-82-3"],volume:["92"],year:2010,yeareval:2005},{name:"Benzo[<i>k</i>]fluoranthene",group:"2B",cas:["207-08-9"],volume:["92"],year:2010,yeareval:2005},{name:"Benzofuran",group:"2B",cas:["271-89-6"],volume:["63"],year:1995,yeareval:1995},{name:"Benzophenone",group:"2B",cas:["119-61-9"],volume:["101"],year:2013,yeareval:2011},{name:"Benzoyl peroxide",group:"3",cas:["94-36-0"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Benzyl acetate",group:"3",cas:["140-11-4"],volume:["40","Sup 7","71"],year:1999,yeareval:1998},{name:"Benzyl violet 4B",group:"2B",cas:["1694-09-3"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Beryllium and beryllium compounds",group:"1",cas:["7440-41-7"],volume:["Sup 7","58","100C"],year:2012,yeareval:2009},{name:"Beta particles (see Radionuclides)"},{name:"Betel quid with tobacco",group:"1",volume:["Sup 7","85","100E"],year:2012,yeareval:2009},{name:"Betel quid without tobacco",group:"1",volume:["Sup 7","85","100E"],year:2012,yeareval:2009},{name:"Biomass fuel (primarily wood), indoor emissions from household combustion of",group:"2A",volume:["95"],year:2010,yeareval:2006},{name:"Bis(1-aziridinyl)morpholinophosphine sulfide",group:"3",cas:["2168-68-5"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Bis(2,3-epoxycyclopentyl)ether ",group:"3",cas:["2386-90-5"],volume:["47","71"],year:1999,yeareval:1998},{name:"Bis(2-chloro-1-methylethyl)ether",group:"3",cas:["108-60-1"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Bis(2-chloroethyl)ether",group:"3",cas:["111-44-4"],volume:["9","Sup 7","71"],year:1999,yeareval:1998},{name:"Bis(2-ethylhexyl) phthalate (see Di(2-ethylhexyl) phthalate)",cas:["117-81-7"]},{name:"Bis(chloromethyl)ether; chloromethyl methyl ether (technical-grade)",group:"1",cas:["542-88-1","107-30-2"],volume:["4","Sup 7","100F"],year:2012,yeareval:2009},{name:"Bischloroethyl nitrosourea (BCNU) (Carmustine)",group:"2A",cas:["154-93-8"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Bisphenol A diglycidyl ether (Araldite)",group:"3",cas:["1675-54-3"],volume:["47","71"],year:1999,yeareval:1998},{name:"Bisulfites",group:"3",volume:["54"],year:1992,yeareval:1991},{name:"Bitumens, extracts of steam-refined and air-refined; steam-refined, cracking-residue and air-refined bitumens (see Bitumens, occupational exposures)",cas:["8052-42-4"]},{name:"Bitumens, occupational exposure to hard bitumens and their emissions during mastic asphalt work",group:"2B",volume:["103"],year:2013,yeareval:2011},{name:"Bitumens, occupational exposure to oxidized bitumens and their emissions during roofing",group:"2A",cas:["64742-93-4"],volume:["103"],year:2013,yeareval:2011},{name:"Bitumens, occupational exposure to straight-run bitumens and their emissions during road paving",group:"2B",cas:["8052-42-4","64741-56-6"],volume:["103"],year:2013,yeareval:2011},{name:"Bleomycins",group:"2B",cas:["11056-06-7"],volume:["26","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Blue VRS",group:"3",cas:["129-17-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Boot and shoe manufacture and repair (see Leather dust, Benzene)",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Bracken fern",group:"2B",volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Brilliant Blue FCF, disodium salt",group:"3",cas:["3844-45-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Bromochloroacetic acid",group:"2B",cas:["5589-96-8"],volume:["101"],year:"2013",yeareval:2011},{name:"Bromochloroacetonitrile",group:"3",cas:["83463-62-1"],volume:["52","71"],year:1999,yeareval:1998},{name:"Bromodichloromethane",group:"2B",cas:["75-27-4"],volume:["52","71"],year:1999,yeareval:1998},{name:"Bromoethane",group:"3",cas:["74-96-4"],volume:["52","71"],year:1999,yeareval:1998},{name:"Bromoform",group:"3",cas:["75-25-2"],volume:["52","71"],year:1999,yeareval:1998},{name:"Busulfan",group:"1",cas:["55-98-1"],volume:["4","Sup 7","100A"],year:2012,yeareval:2008},{name:"<i>tert</i>-Butyl alcohol",group:"3",cas:["75-65-0"],volume:["138"],in_prep:!0,yeareval:2025},{name:"Butyl benzyl phthalate",group:"3",cas:["85-68-7"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Butylated hydroxyanisole (BHA)",group:"2B",cas:["25013-16-5"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Butylated hydroxytoluene (BHT)",group:"3",cas:["128-37-0"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Butyl methacrylate",group:"2B",cas:["97-88-1"],volume:["133"],year:"2024 online",yeareval:2023},{name:"CI Acid Orange 20",group:"3",cas:["523-44-4"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"CI Acid Orange 3",group:"3",cas:["6373-74-6"],volume:["57"],year:1993,yeareval:1992},{name:"CI Acid Red 114",group:"2B",cas:["6459-94-5"],volume:["57"],year:1993,yeareval:1992},{name:"CI Basic Red 9",group:"2B",cas:["569-61-9"],volume:["57","99"],year:2010,yeareval:2008},{name:"CI Direct Black 38 (see Benzidine, dyes metabolized to)",cas:["1937-37-7"]},{name:"CI Direct Blue 15",group:"2B",cas:["2429-74-5"],volume:["57"],year:1993,yeareval:1992},{name:"CI Direct Blue 6 (see Benzidine, dyes metabolized to)",cas:["2602-46-2"]},{name:"CI Direct Brown 95 (see Benzidine, dyes metabolized to)",cas:["16071-86-6"]},{name:"CI Orange G",group:"3",cas:["1936-15-8"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"CI Pigment Red 3",group:"3",cas:["2425-85-6"],volume:["57"],year:1993,yeareval:1992},{name:"Cadmium and cadmium compounds",group:"1",cas:["7440-43-9"],volume:["58","100C"],year:2012,yeareval:2009},{name:"Caffeic acid",group:"2B",cas:["331-39-5"],volume:["56"],year:1993,yeareval:1992},{name:"Caffeine",group:"3",cas:["58-08-2"],volume:["51"],year:1991,yeareval:1990},{name:"Calcium carbide production",group:"3",volume:["92"],year:2010,yeareval:2005},{name:"Cantharidin",group:"3",cas:["56-25-7"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Caprolactam",group:"3",cas:["105-60-2"],volume:["39","Sup 7","71"],year:1999,yeareval:1998,comment:"Moved to Group 3 following 2019 update to the IARC Monographs Preamble"},{name:"Captafol",group:"2A",cas:["2425-06-1"],volume:["53"],year:1991,yeareval:1990,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Captan",group:"3",cas:["133-06-2"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Carbaryl",group:"3",cas:["63-25-2"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Carbazole",group:"2B",cas:["86-74-8"],volume:["32","Sup 7","71","103"],year:2013,yeareval:2011},{name:"Carbon black",group:"2B",cas:["1333-86-4"],volume:["Sup 7","65","93"],year:2010,yeareval:2006},{name:"Carbon electrode manufacture",group:"2A",volume:["92"],year:2010,yeareval:2005},{name:"Carbon nanotubes, multiwalled MWCNT-7",group:"2B",cas:["308068-56-6"],volume:["111"],year:"2017",yeareval:2014},{name:"Carbon nanotubes, multiwalled, other than MWCNT-7",group:"3",cas:["308068-56-6"],volume:["111"],year:"2017",yeareval:2014},{name:"Carbon nanotubes, single-walled",group:"3",cas:["308068-56-6"],volume:["111"],year:"2017",yeareval:2014},{name:"Carbon tetrachloride",group:"2B",cas:["56-23-5"],volume:["20","Sup 7","71"],year:1999,yeareval:1998},{name:"Carmoisine",group:"3",cas:["3567-69-9"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Carpentry and joinery",group:"2B",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Carrageenan, degraded (Poligeenan)",group:"2B",cas:["53973-98-1"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Carrageenan, native",group:"3",cas:["9000-07-1"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Catechol",group:"2B",cas:["120-80-9"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"Ceramic implants",group:"3",volume:["74"],year:"1999",yeareval:1999},{name:"Chimney sweeping (see Soot)",volume:["92"],year:2010,yeareval:2005},{name:"Chloral",group:"2A",cas:["75-87-6"],volume:["63","84","106"],year:2014,yeareval:2012},{name:"Chloral hydrate",group:"2A",cas:["302-17-0"],volume:["63","84","106"],year:2014,yeareval:2012},{name:"Chlorambucil",group:"1",cas:["305-03-3"],volume:["26","Sup 7","100A"],year:2012,yeareval:2008},{name:"Chloramine",group:"3",cas:["10599-90-3"],volume:["84"],year:2004,yeareval:2002},{name:"Chloramphenicol",group:"2A",cas:["56-75-7"],volume:["Sup 7","50"],year:1990,yeareval:1989,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Chlordane",group:"2B",cas:["57-74-9"],volume:["Sup 7","53","79"],year:2001,yeareval:2e3},{name:"Chlordecone (Kepone)",group:"2B",cas:["143-50-0"],volume:["20","Sup 7"],year:1987,yeareval:1987},{name:"Chlordimeform",group:"3",cas:["6164-98-3"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Chlorendic acid",group:"2B",cas:["115-28-6"],volume:["48"],year:1990,yeareval:1989},{name:"Chlorinated drinking-water",group:"3",volume:["52"],year:1991,yeareval:1990},{name:"Chlorinated paraffins of average carbon chain length C12 and average degree of chlorination approximately 60%",group:"2B",volume:["48"],year:1990,yeareval:1989},{name:"Chlornaphazine",group:"1",cas:["494-03-1"],volume:["4","Sup 7","100A"],year:2012,yeareval:2008},{name:"Chloroacetonitrile",group:"3",cas:["107-14-2"],volume:["52","71"],year:1999,yeareval:1998},{name:"Chlorobenzilate",group:"3",cas:["510-15-6"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Chlorodibromomethane",group:"3",cas:["124-48-1"],volume:["52","71"],year:1999,yeareval:1998},{name:"Chlorodifluoromethane",group:"3",cas:["75-45-6"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Chloroethane",group:"3",cas:["75-00-3"],volume:["52","71"],year:1999,yeareval:1998},{name:"Chlorofluoromethane",group:"3",cas:["593-70-4"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Chloroform",group:"2B",cas:["67-66-3"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Chloromethyl methyl ether (see Bis(chloromethyl)ether; chloromethyl methyl ether)",cas:["107-30-2"]},{name:"Chloronitrobenzenes (see 2-Chloronitrobenzene, 3-Chloronitrobenzene, 4-Chloronitrobenzene)",cas:["88-73-3","121-73-3","100-00-5"]},{name:"Chlorophenols (see Polychlorophenols)"},{name:"Chlorophenoxy herbicides",group:"2B",volume:["41","Sup 7"],year:1987,yeareval:1987},{name:"Chloroprene",group:"2B",cas:["126-99-8"],volume:["Sup 7","71"],year:1999,yeareval:1998},{name:"Chloropropham",group:"3",cas:["101-21-3"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Chloroquine",group:"3",cas:["54-05-7"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Chlorothalonil",group:"2B",cas:["1897-45-6"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Chlorozotocin",group:"2A",cas:["54749-90-5"],volume:["50"],year:1990,yeareval:1989,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Cholesterol",group:"3",cas:["57-88-5"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Chromium (III) compounds",group:"3",cas:["16065-83-1"],volume:["49"],year:1990,yeareval:1989},{name:"Chromium (VI) compounds",group:"1",cas:["18540-29-9"],volume:["Sup 7","49","100C"],year:2012,yeareval:2009},{name:"Chromium, metallic",group:"3",cas:["7440-47-3"],volume:["Sup 7","49"],year:1990,yeareval:1989},{name:"Chrysene",group:"2B",cas:["218-01-9"],volume:["92"],year:2010,yeareval:2005},{name:"Chrysoidine",group:"3",cas:["532-82-1"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"CI Direct Blue 218",group:"2B",cas:["28407-37-6"],volume:["129"],year:"2022 online",yeareval:2021},{name:"Ciclosporin",group:"1",cas:["59865-13-3","79217-60-0"],volume:["50","100A"],year:2012,yeareval:2008},{name:"Cimetidine",group:"3",cas:["51481-61-9"],volume:["50"],year:1990,yeareval:1989},{name:"Cinnamyl anthranilate",group:"3",cas:["87-29-6"],volume:["Sup 7","77"],year:2e3,yeareval:2e3},{name:"Cisplatin",group:"2A",cas:["15663-27-1"],volume:["26","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Citrinin",group:"3",cas:["518-75-2"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Citrus Red No. 2",group:"2B",cas:["6358-53-8"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Clofibrate",group:"3",cas:["637-07-0"],volume:["Sup 7","66"],year:1996,yeareval:1996},{name:"Clomiphene citrate",group:"3",cas:["50-41-9"],volume:["21","Sup 7"],year:1987,yeareval:1987},{name:"Coal dust",group:"3",volume:["68"],year:1997,yeareval:1996},{name:"Coal gasification",group:"1",volume:["Sup 7","92","100F"],year:2012,yeareval:2009},{name:"Coal tars (see Coal-tar distillation)",cas:["8007-45-2"],volume:["35","Sup 7"],year:1987,yeareval:1987},{name:"Coal, indoor emissions from household combustion of",group:"1",volume:["95","100E"],year:2012,yeareval:2009},{name:"Coal-tar distillation",group:"1",cas:["8007-45-2"],volume:["92","100F"],year:2012,yeareval:2009},{name:"Coal-tar pitch",group:"1",cas:["65996-93-2"],volume:["35","Sup 7","100F"],year:2012,yeareval:2009},{name:"Cobalt and cobalt compounds, see Soluble cobalt(II) salts, Cobalt metal (without tungsten carbide or other metal alloys), Cobalt(II) oxide, Cobalt(II,III) oxide, Cobalt(II) sulfide, and Other cobalt(II) compounds (not including Soluble cobalt(II) salts, Cobalt(II) oxide, Cobalt(II,III) oxide, or Cobalt(II) sulfide)"},{name:"Cobalt metal with tungsten carbide",group:"2A",cas:["7440-48-4","12070-12-1"],volume:["86"],year:2006,yeareval:2003},{name:"Cobalt metal (without tungsten carbide or other metal alloys)",group:"2A",cas:["7440-48-4"],volume:["52","86","131"],year:"2023 online",yeareval:2022},{name:"Cobalt metal without tungsten carbide, see Cobalt metal (without tungsten carbide or other metal alloys)"},{name:"Cobalt(II) oxide",group:"2B",cas:["1307-96-6"],volume:["52","131"],year:"2023 online",yeareval:2022},{name:"Cobalt(II,III) oxide",group:"3",cas:["1308-06-1"],volume:["52","131"],year:"2023 online",yeareval:2022},{name:"Cobalt sulfate and other soluble cobalt(II) salts, see Soluble cobalt(II) salts"},{name:"Cobalt(II) sulfide",group:"3",cas:["1317-42-6"],volume:["52","131"],year:"2023 online",yeareval:2022},{name:"Coconut oil diethanolamine condensate",group:"2B",cas:["68603-42-9"],volume:["101"],year:2013,yeareval:2011},{name:"Coffee, drinking",group:"3",volume:["51","116"],year:"2018 online",yeareval:2016,comment:'NB There is "evidence suggesting lack of carcinogenicity" in humans of coffee drinking for cancers of the pancreas, liver, female breast, uterine endometrium, and prostate.  Inverse associations with coffee drinking have been observed with cancers of the liver and uterine endometrium.'},{name:"Coke production",group:"1",volume:["Sup 7","92","100F"],year:2012,yeareval:2009},{name:"Continuous glass filament (see Glass filament)"},{name:"Copper 8-hydroxyquinoline",group:"3",cas:["10380-28-6"],volume:["15","Sup 7"],year:1987,yeareval:1987},{name:"Coronene",group:"3",cas:["191-07-1"],volume:["32","Sup 7","92"],year:2010,yeareval:2005},{name:"Coumarin",group:"3",cas:["91-64-5"],volume:["Sup 7","77"],year:2e3,yeareval:2e3},{name:"Creosotes",group:"2A",cas:["8001-58-9"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Crotonaldehyde",group:"2B",cas:["4170-30-3"],volume:["63","128"],year:"2021 online",yeareval:2020},{name:"Crude oil",group:"3",cas:["8002-05-9"],volume:["45"],year:1989,yeareval:1988},{name:"Cumene",group:"2B",cas:["98-82-8"],volume:["101"],year:2013,yeareval:2011},{name:"Cupferron",group:"2B",cas:["135-20-6"],volume:["127"],year:"2021 online",yeareval:2020},{name:"Cycasin",group:"2B",cas:["14901-08-7"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Cyclamates (sodium cyclamate)",group:"3",cas:["139-05-9"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Cyclochlorotine",group:"3",cas:["12663-46-6"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Cyclohexanone",group:"3",cas:["108-94-1"],volume:["47","71"],year:1999,yeareval:1998},{name:"Cyclopenta[<i>cd</i>]pyrene",group:"2A",cas:["27208-37-3"],volume:["Sup 7","92"],year:2010,yeareval:2005,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Cyclophosphamide",group:"1",cas:["50-18-0","6055-19-2"],volume:["26","Sup 7","100A"],year:2012,yeareval:2008},{name:"D & C Red No. 9",group:"3",cas:["5160-02-1"],volume:["Sup 7","57"],year:1993,yeareval:1992},{name:"DDT (4,4'-dichlorodiphenyltrichloroethane)",group:"2A",cas:["50-29-3"],volume:["Sup 7","53","113"],year:"2018",yeareval:2015},{name:"Dacarbazine",group:"2B",cas:["4342-03-4"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Dantron (Chrysazin; 1,8-Dihydroxyanthraquinone)",group:"2B",cas:["117-10-2"],volume:["50"],year:1990,yeareval:1989},{name:"Dapsone",group:"3",cas:["80-08-0"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Daunomycin (Daunorubicin)",group:"2B",cas:["20830-81-3"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Decabromodiphenyl oxide",group:"3",cas:["1163-19-5"],volume:["48","71"],year:1999,yeareval:1998},{name:"Deltamethrin",group:"3",cas:["52918-63-5"],volume:["53"],year:1991,yeareval:1990},{name:"Dental materials",group:"3",volume:["74"],year:"1999",yeareval:1999},{name:"Depleted uranium (see Radionuclides, alpha-particle-emitting, internally deposited)"},{name:"Di(2-ethylhexyl) adipate",group:"3",cas:["103-23-1"],volume:["Sup 7","77"],year:2e3,yeareval:2e3},{name:"Di(2-ethylhexyl)phthalate",group:"2B",cas:["117-81-7"],volume:["Sup 7","77","101"],year:2013,yeareval:2011},{name:"Diacetylaminoazotoluene",group:"3",cas:["83-63-6"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Diallate",group:"3",cas:["2303-16-4"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Diazepam",group:"3",cas:["439-14-5"],volume:["Sup 7","66"],year:1996,yeareval:1996},{name:"Diazinon",group:"2A",cas:["333-41-5"],volume:["112"],year:"2017",yeareval:2015,comment:"NB Overall evaluation upgraded to Group 2A based on mechanistic evidence"},{name:"Diazomethane",group:"3",cas:["334-88-3"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"Dibenz[<i>a</i>,<i>c</i>]anthracene",group:"3",cas:["215-58-7"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenz[<i>a</i>,<i>h</i>]acridine",group:"2B",cas:["226-36-8"],volume:["32","Sup 7","103"],year:2013,yeareval:2011},{name:"Dibenz[<i>a</i>,<i>h</i>]anthracene",group:"2A",cas:["53-70-3"],volume:["Sup 7","92"],year:2010,yeareval:2005,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Dibenz[<i>a</i>,<i>j</i>]acridine",group:"2A",cas:["224-42-0"],volume:["32","Sup 7","103"],year:2013,yeareval:2011,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Dibenz[<i>a</i>,<i>j</i>]anthracene",group:"3",cas:["224-41-9"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenz[<i>c</i>,<i>h</i>]acridine",group:"2B",cas:["224-53-3"],volume:["103"],year:2013,yeareval:2011,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Dibenzo-<i>para</i>-dioxin",group:"3",cas:["262-12-4"],volume:["69"],year:1997,yeareval:1997},{name:"Dibenzo[<i>a</i>,<i>e</i>]fluoranthene",group:"3",cas:["5385-75-1"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenzo[<i>a</i>,<i>e</i>]pyrene",group:"3",cas:["192-65-4"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenzo[<i>a</i>,<i>h</i>]pyrene",group:"2B",cas:["189-64-0"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenzo[<i>a</i>,<i>i</i>]pyrene",group:"2B",cas:["189-55-9"],volume:["92"],year:2010,yeareval:2005},{name:"Dibenzo[<i>a</i>,<i>l</i>]pyrene",group:"2A",cas:["191-30-0"],volume:["Sup 7","92"],year:2010,yeareval:2005,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Dibenzo[<i>e</i>,<i>l</i>]pyrene",group:"3",cas:["192-51-8"],volume:["92"],year:2010,yeareval:2005},{name:"Dibenzo[<i>h</i>,<i>rst</i>]pentaphene",group:"3",cas:["192-47-2"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Dibenzothiophene",group:"3",cas:["132-65-0"],volume:["103"],year:2013,yeareval:2011},{name:"Dibromoacetic acid",group:"2B",cas:["631-64-1"],volume:["101"],year:2013,yeareval:2011},{name:"Dibromoacetonitrile",group:"2B",cas:["3252-43-5"],volume:["52","71","101"],year:2013,yeareval:2011},{name:"Dichloroacetic acid",group:"2B",cas:["79-43-6"],volume:["63","84","106"],year:2014,yeareval:2012},{name:"Dichloroacetonitrile",group:"3",cas:["3018-12-0"],volume:["52","71"],year:1999,yeareval:1998},{name:"Dichloroacetylene",group:"3",cas:["7572-29-4"],volume:["39","Sup 7","71"],year:1999,yeareval:1998},{name:"Dichloromethane (Methylene chloride)",group:"2A",cas:["75-09-2"],volume:["Sup 7","71","110"],year:"2017",yeareval:2014},{name:"Dichlorvos",group:"2B",cas:["62-73-7"],volume:["Sup 7","53"],year:1991,yeareval:1990},{name:"Dicofol",group:"3",cas:["115-32-2"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Didanosine",group:"3",cas:["69655-05-6"],volume:["76"],year:2e3,yeareval:1999},{name:"Dieldrin (see Dieldrin, and aldrin metabolized to dieldrin)",cas:["60-57-1"]},{name:"Dieldrin, and aldrin metabolized to dieldrin",group:"2A",cas:["60-57-1","309-00-2"],volume:["5","Sup 7","117"],year:2019,yeareval:2016},{name:"Diesel engine exhaust (see Engine exhaust, diesel)"},{name:"Diesel fuel, marine",group:"2B",volume:["45"],year:1989,yeareval:1988,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Diesel fuels, distillate (light)",group:"3",volume:["45"],year:1989,yeareval:1988},{name:"Diethanolamine",group:"2B",cas:["111-42-2"],volume:["77","101"],year:2013,yeareval:2011},{name:"Diethyl sulfate",group:"2A",cas:["64-67-5"],volume:["54","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Diethylstilbestrol",group:"1",cas:["56-53-1"],volume:["21","Sup 7","100A"],year:2012,yeareval:2008},{name:"Diglycidyl resorcinol ether",group:"2B",cas:["101-90-6"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Digoxin",group:"2B",cas:["20830-75-5"],volume:["108"],year:"2016",yeareval:2013},{name:"1,2-Dihydroaceanthrylene",group:"3",cas:["641-48-5"],volume:["92"],year:2010,yeareval:2005},{name:"Dihydrosafrole",group:"2B",cas:["94-58-6"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Dihydroxymethylfuratrizine (see also Panfuran S)",group:"3",cas:["794-93-4"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Diisopropyl ether",group:"3",cas:["108-20-3"],volume:["138"],in_prep:!0,yeareval:2025},{name:"Diisopropyl sulfate",group:"2B",cas:["2973-10-6"],volume:["54","71"],year:1999,yeareval:1998},{name:"Dimethoxane",group:"3",cas:["828-00-2"],volume:["15","Sup 7"],year:1987,yeareval:1987},{name:"Dimethyl hydrogen phosphite",group:"2B",cas:["868-85-9"],volume:["48","71","133"],year:"2024 online",yeareval:2023},{name:"Dimethyl sulfate",group:"2A",cas:["77-78-1"],volume:["4","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Dimethylarsinic acid",group:"2B",cas:["75-60-5"],volume:["100C"],year:2012,yeareval:2009},{name:"Dimethylcarbamoyl chloride",group:"2A",cas:["79-44-7"],volume:["12","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Dinitrosopentamethylenetetramine",group:"3",cas:["101-25-7"],volume:["11","Sup 7"],year:1987,yeareval:1987},{name:"Disperse Blue 1",group:"2B",cas:["2475-45-8"],volume:["48"],year:1990,yeareval:1989},{name:"Disperse Yellow 3",group:"3",cas:["2832-40-8"],volume:["48"],year:1990,yeareval:1989},{name:"Disulfiram",group:"3",cas:["97-77-8"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Dithranol",group:"3",cas:["1143-38-0"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Doxefazepam",group:"3",cas:["40762-15-0"],volume:["66"],year:1996,yeareval:1996},{name:"Doxylamine succinate",group:"3",cas:["562-10-7"],volume:["79"],year:2001,yeareval:2e3},{name:"Droloxifene",group:"3",cas:["82413-20-5"],volume:["66"],year:1996,yeareval:1996},{name:"Dry cleaning (occupational exposures in)",group:"2B",volume:["63"],year:1995,yeareval:1995},{name:"Dulcin",group:"3",cas:["150-69-6"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Dyes metabolized to benzidine (see Benzidine, dyes metabolized to)"},{name:"Electric fields, extremely low-frequency",group:"3",volume:["80"],year:2002,yeareval:2001},{name:"Electric fields, static",group:"3",volume:["80"],year:2002,yeareval:2001},{name:"Endrin",group:"3",cas:["72-20-8"],volume:["5","Sup 7"],year:1987,yeareval:1987},{name:"Engine exhaust, diesel",group:"1",volume:["46","105"],year:"2014",yeareval:2012},{name:"Engine exhaust, gasoline",group:"2B",volume:["46","105"],year:"2014",yeareval:2012},{name:"Eosin",group:"3",cas:["15086-94-9"],volume:["15","Sup 7"],year:1987,yeareval:1987},{name:"Epichlorohydrin",group:"2A",cas:["106-89-8"],volume:["11","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Epstein-Barr virus",group:"1",volume:["70","100B"],year:2012,yeareval:2009},{name:"Erionite",group:"1",cas:["66733-21-9"],volume:["42","Sup 7","100C"],year:2012,yeareval:2009},{name:"Estazolam",group:"3",cas:["29975-16-4"],volume:["66"],year:1996,yeareval:1996},{name:"Estrogen therapy, postmenopausal",group:"1",volume:["72","100A"],year:2012,yeareval:2008,comment:'NB There is "evidence suggesting lack of carcinogenicity" for estrogen-only menopausal therapy in humans and  cancer of the  colorectum. An inverse association has been observed between estrogen-only menopausal therapy and cancer  of the colorectum.'},{name:"Estrogen-progestogen menopausal therapy (combined)",group:"1",volume:["72","91","100A"],year:2012,yeareval:2008},{name:"Estrogen-progestogen oral contraceptives (combined)",group:"1",volume:["72","91","100A"],year:2012,yeareval:2008,comment:'NB There is "evidence suggesting lack of carcinogenicity" for combined estrogen-progestogen oral  contraceptives in humans and cancers of the endometrium, ovary, and colorectum. An inverse association has been  observed between combined estrogen-progestogen oral contraceptives and cancers of the endometrium, ovary, and colorectum.'},{name:"Ethanol in alcoholic beverages",group:"1",cas:["64-17-5"],volume:["96","100E"],year:2012,yeareval:2009},{name:"Ethionamide",group:"3",cas:["536-33-4"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Ethyl acrylate",group:"2B",cas:["140-88-5"],volume:["39","Sup 7","71","122"],year:2019,yeareval:2018},{name:"Ethyl carbamate (Urethane)",group:"2A",cas:["51-79-6"],volume:["7","Sup 7","96"],year:2010,yeareval:2007},{name:"Ethyl methanesulfonate",group:"2B",cas:["62-50-0"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"Ethyl selenac",group:"3",cas:["5456-28-0"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Ethyl tellurac",group:"3",cas:["20941-65-5"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Ethylbenzene",group:"2B",cas:["100-41-4"],volume:["77"],year:2e3,yeareval:2e3},{name:"Ethylene",group:"3",cas:["74-85-1"],volume:["Sup 7","60"],year:1994,yeareval:1998},{name:"Ethylene dibromide",group:"2A",cas:["106-93-4"],volume:["15","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Ethylene oxide",group:"1",cas:["75-21-8"],volume:["Sup 7","60","97","100F"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Ethylene sulfide",group:"3",cas:["420-12-2"],volume:["11","Sup 7"],year:1987,yeareval:1987},{name:"Ethylenethiourea",group:"3",cas:["96-45-7"],volume:["Sup 7","79"],year:2001,yeareval:2e3,comment:"NB Overall evaluation downgraded to Group 3 with supporting evidence from other relevant data"},{name:"Ethyl <i>tert</i>-butyl ether",group:"2B",cas:["637-92-3"],volume:["138"],in_prep:!0,yeareval:2025},{name:"Etoposide",group:"1",cas:["33419-42-0"],volume:["76","100A"],year:2012,yeareval:2008,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Etoposide in combination with cisplatin and bleomycin",group:"1",cas:["33419-42-0","15663-27-1","11056-06-7"],volume:["76","100A"],year:2012,yeareval:2008},{name:"Eugenol",group:"3",cas:["97-53-0"],volume:["36","Sup 7"],year:1987,yeareval:1987},{name:"Evans blue",group:"3",cas:["314-13-6"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Fast Green FCF",group:"3",cas:["2353-45-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Fenvalerate",group:"3",cas:["51630-58-1"],volume:["53"],year:1991,yeareval:1990},{name:"Ferbam",group:"3",cas:["14484-64-1"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Ferric oxide",group:"3",cas:["1309-37-1"],volume:["1","Sup 7"],year:1987,yeareval:1987},{name:"Firefighter (occupational exposure as a)",group:"1",volume:["98","132"],year:"2023 online",yeareval:2022},{name:"Fission products, including strontium-90",group:"1",volume:["100D"],year:2012,yeareval:2009},{name:"Flat-glass and specialty glass (manufacture of)",group:"3",volume:["58"],year:1993,yeareval:1993},{name:"Fluometuron",group:"3",cas:["2164-17-2"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Fluoranthene",group:"3",cas:["206-44-0"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Fluorene",group:"3",cas:["86-73-7"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Fluorescent lighting",group:"3",volume:["55"],year:1992,yeareval:1992},{name:"Fluorides (inorganic, used in drinking-water)",group:"3",cas:["16984-48-8"],volume:["27","Sup 7"],year:1987,yeareval:1987},{name:"Fluoro-edenite fibrous amphibole",group:"1",volume:["111"],year:"2017 ",yeareval:2014},{name:"Foreign  bodies (see Ceramic implants, Dental materials, Implanted foreign bodies, Metallic implants, Organic polymeric materials, Orthopaedic implants, Polymeric implants, Silicone breast implants)"},{name:"Formaldehyde",group:"1",cas:["50-00-0"],volume:["Sup 7","62","88","100F"],year:2012,yeareval:2009},{name:"Frying, emissions from high-temperature",group:"2A",volume:["95"],year:2010,yeareval:2006},{name:"Fuel oils, distillate (light)",group:"3",volume:["45"],year:1989,yeareval:1988},{name:"Fuel oils, residual (heavy)",group:"2B",volume:["45"],year:1989,yeareval:1988},{name:"Fumonisin B<sub>1</sub>",group:"2B",cas:["116355-83-0"],volume:["82"],year:2002,yeareval:2002},{name:"Furan",group:"2B",cas:["110-00-9"],volume:["63"],year:1995,yeareval:1995},{name:"Furazolidone",group:"3",cas:["67-45-8"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Furfural",group:"3",cas:["98-01-1"],volume:["63"],year:1995,yeareval:1995},{name:"Furfuryl alcohol ",group:"2B",cas:["98-00-0"],volume:["119"],year:"2019",yeareval:2017},{name:"Furniture and cabinet making (see Wood dust)",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Furosemide (Frusemide)",group:"3",cas:["54-31-9"],volume:["50"],year:1990,yeareval:1989},{name:"Gallium arsenide (see Arsenic and inorganic arsenic compounds)",cas:["1303-00-0"],volume:["86","100C"],year:2012,yeareval:2009},{name:"Gamma-Radiation (see X- and Gamma-Radiation)"},{name:"Aviation gasoline (see also Automotive gasoline, and Gasoline engine exhaust)",group:"2B",volume:["45"],year:1989,yeareval:1988,comment:"NB Overall evaluation upgraded to Group 2B with supporting evidence from other relevant data"},{name:"Gasoline engine exhaust (see Engine exhaust, gasoline)"},{name:"Gemfibrozil",group:"3",cas:["25812-30-0"],volume:["66"],year:1996,yeareval:1996},{name:"Gentian violet (see also Leucogentian violet)",group:"2B",cas:["548-62-9"],volume:["129"],year:"2022 online",yeareval:2021},{name:"Glass filament, continuous",group:"3",volume:["43","81"],year:2002,yeareval:2001},{name:"Glu-P-1 (2-Amino-6-methyldipyrido[1,2-<i>a</i>:3',2'-<i>d</i>]imidazole)",group:"2B",cas:["67730-11-4"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Glu-P-2 (2-Aminodipyrido[1,2-<i>a</i>:3',2'-<i>d</i>]imidazole)",group:"2B",cas:["67730-10-3"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Glycidaldehyde",group:"2B",cas:["765-34-4"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"Glycidol",group:"2A",cas:["556-52-5"],volume:["77"],year:2e3,yeareval:2e3,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Glycidyl methacrylate",group:"2A",cas:["106-91-2"],volume:["125"],year:"2020 online",yeareval:2019},{name:"Glycidyl oleate",group:"3",cas:["5431-33-4"],volume:["11","Sup 7"],year:1987,yeareval:1987},{name:"Glycidyl stearate",group:"3",cas:["7460-84-6"],volume:["11","Sup 7"],year:1987,yeareval:1987},{name:"Glyphosate",group:"2A",cas:["1071-83-6"],volume:["112"],year:"2017",yeareval:2015},{name:"Goldenseal root powder",group:"2B",volume:["108"],year:"2016",yeareval:2013},{name:"Griseofulvin",group:"2B",cas:["126-07-8"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Guinea Green B",group:"3",cas:["4680-78-8"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Gyromitrin",group:"3",cas:["16568-02-8"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"HC Blue No. 1",group:"2B",cas:["2784-94-3"],volume:["57"],year:1993,yeareval:1992},{name:"HC Blue No. 2",group:"3",cas:["33229-34-4"],volume:["57"],year:1993,yeareval:1992},{name:"HC Red No. 3",group:"3",cas:["2871-01-4"],volume:["57"],year:1993,yeareval:1992},{name:"HC Yellow No. 4",group:"3",cas:["59820-43-8"],volume:["57"],year:1993,yeareval:1992},{name:"Haematite",group:"3",cas:["1317-60-8"],volume:["1","Sup 7"],year:1987,yeareval:1987},{name:"Haematite mining (underground)",group:"1",volume:["1","Sup 7","100D"],year:2012,yeareval:2009},{name:"Hair colouring products (personal use of)",group:"3",volume:["57","99"],year:2010,yeareval:2008},{name:"Hairdresser or barber (occupational exposure as a)",group:"2A",volume:["57","99"],year:2010,yeareval:2008},{name:"Hepatitis B virus (chronic infection with)",group:"1",volume:["59","100B"],year:2012,yeareval:2009},{name:"Hepatitis C virus (chronic infection with)",group:"1",volume:["59","100B"],year:2012,yeareval:2009},{name:"Hepatitis D virus (HDV)",group:"1",volume:["59","139"],in_prep:!0,yeareval:2025},{name:"Heptachlor",group:"2B",cas:["76-44-8"],volume:["Sup 7","53","79"],year:2001,yeareval:2e3},{name:"Hexachlorobenzene",group:"2B",cas:["118-74-1"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Hexachlorobutadiene",group:"3",cas:["87-68-3"],volume:["73"],year:1999,yeareval:1998},{name:"Hexachlorocyclohexanes",group:"2B",volume:["20","Sup 7"],year:1987,yeareval:1987},{name:"Hexachloroethane",group:"2B",cas:["67-72-1"],volume:["73"],year:1999,yeareval:1998},{name:"Hexachlorophene",group:"3",cas:["70-30-4"],volume:["20","Sup 7"],year:1987,yeareval:1987},{name:"Hexamethylphosphoramide",group:"2B",cas:["680-31-9"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"High-temperature frying (see Frying)"},{name:"Household combustion of biomass fuel (see Biomass fuel, indoor emissions from household combustion of)"},{name:"Household combustion of coal (see Coal, indoor emissions from household combustion)"},{name:"Human cytomegalovirus (HCMV)",group:"2B",volume:["139"],in_prep:!0,yeareval:2025},{name:"Human T-cell lymphotropic virus type I",group:"1",volume:["67","100B"],year:2012,yeareval:2009},{name:"Human T-cell lymphotropic virus type II",group:"3",volume:["67"],year:1996,yeareval:1996},{name:"Human herpesvirus type 4 (see Epstein-Barr virus)"},{name:"Human herpesvirus type 8 (see Kaposi sarcoma herpesvirus)"},{name:"Human immunodeficiency virus type 1 (infection with)",group:"1",volume:["67","100B"],year:2012,yeareval:2009},{name:"Human immunodeficiency virus type 2 (infection with)",group:"2B",volume:["67"],year:1996,yeareval:1996},{name:"Human papillomavirus (HPV) genus beta (except types 5 and 8) and genus gamma",group:"3",volume:["90","100B"],year:2012,yeareval:2009},{name:"Human papillomavirus (HPV) type 16",group:"1",volume:["64","90","100B"],year:2012,yeareval:2009,comment:"NB The HPV types that have been classified as carcinogenic to humans can differ by an order of  magnitude in risk for cervical cancer"},{name:"Human papillomavirus (HPV) type 18",group:"1",volume:["64","90","100B"],year:2012,yeareval:2009,comment:"NB The HPV types that have been classified as carcinogenic to humans can differ by an order of  magnitude in risk for cervical cancer"},{name:"Human papillomavirus (HPV) type 33",group:"1",volume:["64","90","100B"],year:2012,yeareval:2009,comment:"NB The HPV types that have been classified as carcinogenic to humans can differ by an order of  magnitude in risk for cervical cancer"},{name:"Human papillomavirus (HPV) type 68",group:"2A",volume:["100B"],year:2012,yeareval:2009},{name:"Human papillomavirus (HPV) types 31, 35, 39, 45, 51, 52, 56, 58, 59",group:"1",volume:["64","90","100B"],year:2012,yeareval:2009,comment:"NB The HPV types that have been classified as carcinogenic to humans can differ by an order of magnitude in risk for cervical cancer"},{name:"Human papillomavirus (HPV) types 26, 53, 66, 67, 70, 73, 82",group:"2B",volume:["100B"],year:2012,yeareval:2009},{name:"Human papillomavirus (HPV) types 30, 34, 69, 85, 97",group:"2B",volume:["100B"],year:2012,yeareval:2009,comment:"NB Classified by phylogenetic analogy to the HPV genus alpha types classified in Group 1"},{name:"Human papillomavirus (HPV) types 5 and 8 (in patients with epidermodysplasia verruciformis)",group:"2B",volume:["100B"],year:2012,yeareval:2009},{name:"Human papillomavirus (HPV) types 6 and 11",group:"3",volume:["90","100B"],year:2012,yeareval:2009},{name:"Hycanthone mesylate",group:"3",cas:["23255-93-8"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Hydralazine",group:"3",cas:["86-54-4"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Hydrazine",group:"2A",cas:["302-01-2"],volume:["4","Sup 7","71","115"],year:"2018 ",yeareval:2016},{name:"Hydrochloric acid",group:"3",cas:["7647-01-0"],volume:["54"],year:1992,yeareval:1991},{name:"Hydrochlorothiazide",group:"1",cas:["58-93-5"],volume:["50","108","137"],year:"2026 online",yeareval:2024},{name:"Hydrogen peroxide",group:"3",cas:["7722-84-1"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Hydroquinone",group:"3",cas:["123-31-9"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"Hydroxysenkirkine",group:"3",cas:["26782-43-4"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Hydroxyurea",group:"3",cas:["127-07-1"],volume:["76"],year:2e3,yeareval:1999},{name:"Hypochlorite salts",group:"3",volume:["52"],year:1991,yeareval:1990},{name:"IQ (2-Amino-3-methylimidazo[4,5-<i>f</i>]quinoline)",group:"2A",cas:["76180-96-6"],volume:["Sup 7","56"],year:1993,yeareval:1992,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Implanted foreign bodies of metallic chromium or titanium and of cobalt-based, chromium-based, and titanium-based alloys, and stainless steel",group:"3",volume:["74"],year:"1999",yeareval:1999},{name:"Implanted foreign bodies of metallic cobalt, metallic nickel and an alloy powder containing 66-67% nickel, 13-16% chromium, and 7% iron",group:"2B",volume:["74"],year:"1999",yeareval:1999},{name:"Indeno[1,2,3-<i>cd</i>]pyrene",group:"2B",cas:["193-39-5"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Indium phosphide",group:"2A",cas:["22398-80-7"],volume:["86"],year:2006,yeareval:2003,comment:"NB Overall evaluation upgraded to Group 2A"},{name:"Indium tin oxide",group:"2B",cas:["50926-11-9"],volume:["118"],year:"2018 online",yeareval:2017},{name:"Insulation glass wool",group:"3",volume:["43","81"],year:2002,yeareval:2001},{name:"Involuntary smoking (see Tobacco smoke, secondhand)"},{name:"Iodine-131 (see Radioiodines)",cas:["10043-66-0"]},{name:"Ionizing radiation (all types)",group:"1",volume:["100D"],year:2012,yeareval:2009},{name:"Iron and steel founding (occupational exposure during)",group:"1",volume:["34","Sup 7","100F"],year:2012,yeareval:2009},{name:"Iron sorbitol-citric acid complex",group:"3",cas:["1338-16-5"],volume:["2","Sup 7"],year:1987,yeareval:1987},{name:"Iron-dextran complex",group:"2B",cas:["9004-66-4"],volume:["2","Sup 7"],year:1987,yeareval:1987},{name:"Iron-dextrin complex",group:"3",cas:["9004-51-7"],volume:["2","Sup 7"],year:1987,yeareval:1987},{name:"Isatidine",group:"3",cas:["15503-86-3"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Isobutyl nitrite",group:"2B",cas:["542-56-3"],volume:["122"],year:2019,yeareval:2018},{name:"Isoeugenol",group:"2B",cas:["97-54-1"],volume:["134"],year:"2024 online",yeareval:2023},{name:"Isonicotinic acid hydrazide (Isoniazid)",group:"3",cas:["54-85-3"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"Isophorone",group:"2B",cas:["78-59-1"],volume:["130"],year:"2022 online",yeareval:2021},{name:"Isophosphamide",group:"3",cas:["3778-73-2"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Isoprene",group:"2B",cas:["78-79-5"],volume:["60","71"],year:1999,yeareval:1998},{name:"Isopropyl alcohol",group:"3",cas:["67-63-0"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"Isopropyl alcohol manufacture using strong acids",group:"1",volume:["Sup 7","100F"],year:2012,yeareval:2009},{name:"Isopropyl oils",group:"3",volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"Isosafrole",group:"3",cas:["120-58-1"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"JC polyomavirus (JCV)",group:"2B",volume:["104"],year:"2014",yeareval:2012},{name:"Jacobine",group:"3",cas:["6870-67-3"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Jet fuel",group:"3",volume:["45"],year:1989,yeareval:1988},{name:"Kaempferol",group:"3",cas:["520-18-3"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Kaposi sarcoma herpesvirus",group:"1",volume:["70","100B"],year:2012,yeareval:2009},{name:"Kava extract",group:"2B",cas:["9000-38-8"],volume:["108"],year:"2016",yeareval:2013},{name:"Kojic acid",group:"3",cas:["501-30-4"],volume:["79"],year:2001,yeareval:2e3},{name:"Lasiocarpine",group:"2B",cas:["303-34-4"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Lauroyl peroxide",group:"3",cas:["105-74-8"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Lead",group:"2B",cas:["7439-92-1"],volume:["23","Sup 7"],year:1987,yeareval:1987},{name:"Lead compounds, inorganic",group:"2A",volume:["Sup 7","87"],year:2006,yeareval:2004},{name:"Lead compounds, organic",group:"3",volume:["23","Sup 7","87"],year:2006,yeareval:2004,comment:"NB Organic lead compounds are metabolized at least in part, to ionic lead both in humans and animals. To the extent that ionic lead, generated from organic lead, is present in the body, it will be expected to exert the toxicities associated with inorganic lead"},{name:"Leather dust",group:"1",volume:["100C"],year:2012,yeareval:2009},{name:"Leather goods manufacture (see also Leather dust)",group:"3",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Leather tanning and processing",group:"3",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Leucogentian violet (see also Gentian violet)",group:"3",cas:["603-48-5"],volume:["129"],year:"2022 online",yeareval:2021},{name:"Leucomalachite green (see also Malachite green)",group:"2B",cas:["129-73-7"],volume:["129"],year:"2022 online",yeareval:2021},{name:"Light Green SF",group:"3",cas:["5141-20-8"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Lindane (see also Hexachlorocyclohexanes)",group:"1",cas:["58-89-9"],volume:["113"],year:"2018",yeareval:2015},{name:"Lumber and sawmill industries (including logging)",group:"3",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Luteoskyrin",group:"3",cas:["21884-44-6"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"MOPP and other combined chemotherapy including alkylating agents",group:"1",volume:["Sup 7","100A"],year:2012,yeareval:2008},{name:"Madder root (<i>Rubia tinctorum</i>)",group:"3",volume:["82"],year:2002,yeareval:2002},{name:"Magenta",group:"2B",cas:["632-99-5"],volume:["Sup 7","57","99","100F"],year:2012,yeareval:2009},{name:"Magenta production",group:"1",volume:["Sup 7","57","99","100F"],year:2012,yeareval:2009},{name:"Magnetic fields, extremely low-frequency",group:"2B",volume:["80"],year:2002,yeareval:2001},{name:"Magnetic fields, static",group:"3",volume:["80"],year:2002,yeareval:2001},{name:"Malachite green (see also Leucomalachite green)",group:"3",cas:["569-64-2","14426-28-9","2437-29-8"],volume:["129"],year:"2022 online",yeareval:2021},{name:"Malaria (caused by infection with <i>Plasmodium falciparum</i> in holoendemic areas)",group:"2A",volume:["104"],year:2014,yeareval:2012},{name:"Malathion",group:"2A",cas:["121-75-5"],volume:["30","Sup 7","112"],year:"2017",yeareval:2015},{name:"Maleic hydrazide",group:"3",cas:["123-33-1"],volume:["4","Sup 7"],year:1987,yeareval:1987},{name:"Malonaldehyde",group:"3",cas:["542-78-9"],volume:["36","Sup 7","71"],year:1999,yeareval:1998},{name:"Maneb",group:"3",cas:["12427-38-2"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Mannomustine dihydrochloride",group:"3",cas:["551-74-6"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Mate, hot (see Very hot beverages)"},{name:"Mate, not very hot (drinking)",group:"3",volume:["51","116"],year:"2018 online",yeareval:2016},{name:"MeA-alpha-C (2-Amino-3-methyl-9<i>H</i>-pyrido[2,3-<i>b</i>]indole)",group:"2B",cas:["68006-83-7"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"MeIQ (2-Amino-3,4-dimethylimidazo[4,5-<i>f</i>]quinoline)",group:"2B",cas:["77094-11-2"],volume:["Sup 7","56"],year:1993,yeareval:1992},{name:"MeIQx (2-Amino-3,8-dimethylimidazo[4,5-<i>f</i>]quinoxaline)",group:"2B",cas:["77500-04-0"],volume:["Sup 7","56"],year:1993,yeareval:1992},{name:"Medphalan",group:"3",cas:["13045-94-8"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Medroxyprogesterone acetate",group:"2B",cas:["71-58-9"],volume:["21","Sup 7"],year:1987,yeareval:1998},{name:"Melamine",group:"2B",cas:["108-78-1"],volume:["Sup 7","73","119"],year:"2019",yeareval:2017},{name:"Melphalan",group:"1",cas:["148-82-3"],volume:["9","Sup 7","100A"],year:2012,yeareval:2008},{name:"Mercury and inorganic mercury compounds",group:"3",cas:["7439-97-6"],volume:["58"],year:1993,yeareval:1993},{name:"Merkel cell polyomavirus (MCPyV)",group:"1",volume:["104","139"],in_prep:!0,yeareval:2025},{name:"Merphalan",group:"2B",cas:["531-76-0"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Metabisulfites",group:"3",volume:["54"],year:1992,yeareval:1991},{name:"Metallic implants prepared as thin smooth films",group:"2B",volume:["74"],year:"1999",yeareval:1999},{name:"Methimazole",group:"3",cas:["60-56-0"],volume:["79"],year:2001,yeareval:2e3},{name:"Methotrexate",group:"3",cas:["59-05-2"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Methoxsalen (8-methoxypsoralen) plus ultraviolet A radiation",group:"1",cas:["298-81-7"],volume:["24","Sup 7","100A"],year:2012,yeareval:2008},{name:"Methoxychlor",group:"3",cas:["72-43-5"],volume:["20","Sup 7"],year:1987,yeareval:1987},{name:"Methyl <i>tert</i>-butyl ether",group:"2B",cas:["1634-04-4"],volume:["73","138"],in_prep:!0,yeareval:2025},{name:"Methyl acrylate",group:"2B",cas:["96-33-3"],volume:["39","Sup 7","71","122"],year:2019,yeareval:2018},{name:"Methyl bromide",group:"3",cas:["74-83-9"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Methyl carbamate",group:"3",cas:["598-55-0"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Methyl chloride",group:"3",cas:["74-87-3"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Methyl iodide",group:"3",cas:["74-88-4"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Methyl isobutyl ketone",group:"2B",cas:["108-10-1"],volume:["101"],year:2013,yeareval:2011},{name:"Methyl methacrylate",group:"3",cas:["80-62-6"],volume:["Sup 7","60"],year:1994,yeareval:1994},{name:"Methyl methanesulfonate",group:"2A",cas:["66-27-3"],volume:["7","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Methyl parathion",group:"3",cas:["298-00-0"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Methyl red",group:"3",cas:["493-52-7"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Methyl selenac",group:"3",cas:["144-34-3"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Methylarsonic acid",group:"2B",cas:["124-58-3"],volume:["100C"],year:2012,yeareval:2009},{name:"Methylazoxymethanol acetate",group:"2B",cas:["592-62-1"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Methylene blue",group:"3",cas:["7220-79-3"],volume:["108"],year:"2016",yeareval:2013},{name:"Methyleugenol",group:"2A",cas:["93-15-2"],volume:["101","134"],year:"2024 online",yeareval:2023},{name:"Methylglyoxal",group:"3",cas:["78-98-8"],volume:["51"],year:1991,yeareval:1990},{name:"Methylmercury compounds",group:"2B",volume:["58"],year:1993,yeareval:1993,comment:"NB Evaluated as a group"},{name:"Methylthiouracil",group:"2B",cas:["56-04-2"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Metronidazole",group:"2B",cas:["443-48-1"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Michler’s base [4,4´-methylenebis(<i>N</i>,<i>N</i>-dimethyl)­benzenamine]",group:"2B",cas:["101-61-1"],volume:["27","Sup 7","99"],year:2010,yeareval:2008},{name:"Michler’s ketone [4,4´-Bis(dimethylamino)­benzophenone]",group:"2B",cas:["90-94-8"],volume:["99"],year:2010,yeareval:2008},{name:"Microcystin-LR",group:"2B",cas:["101043-37-2"],volume:["94"],year:2010,yeareval:2006},{name:"Mineral oils, highly-refined",group:"3",volume:["33","Sup 7"],year:1987,yeareval:2009},{name:"Mineral oils, untreated or mildly treated",group:"1",volume:["33","Sup 7","100F"],year:2012,yeareval:2009},{name:"Mirex",group:"2B",cas:["2385-85-5"],volume:["20","Sup 7"],year:1987,yeareval:1987},{name:"Mitomycin C",group:"2B",cas:["50-07-7"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Mitoxantrone",group:"2B",cas:["65271-80-9"],volume:["76"],year:2e3,yeareval:1999},{name:"Modacrylic fibres",group:"3",volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Molybdenum trioxide",group:"2B",cas:["1313-27-5"],volume:["118"],year:"2018 online",yeareval:2017},{name:"Monocrotaline",group:"2B",cas:["315-22-0"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Monomethylarsonic acid (see Methylarsonic acid)",cas:["124-58-3"]},{name:"Monuron",group:"3",cas:["150-68-5"],volume:["Sup 7","53"],year:1991,yeareval:1990},{name:"Morpholine",group:"3",cas:["110-91-8"],volume:["47","71"],year:1999,yeareval:1998},{name:"Multiwalled carbon nanotubes MWCNT-7 (see Carbon nanotubes, multiwalled MWCNT-7)",cas:["308068-56-6"]},{name:"Multiwalled carbon nanotubes other than MWCNT-7 (see Carbon nanotubes, multiwalled, other than MWCNT-7)",cas:["308068-56-6"]},{name:"Musk ambrette",group:"3",cas:["83-66-9"],volume:["65"],year:1996,yeareval:1995},{name:"Musk xylene",group:"3",cas:["81-15-2"],volume:["65"],year:1996,yeareval:1995},{name:"Mustard gas (see Sulfur mustard)",cas:["505-60-2"]},{name:"Myleran (see Busulfan)",cas:["55-98-1"]},{name:"Nafenopin",group:"2B",cas:["3771-19-5"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Naphthalene",group:"2B",cas:["91-20-3"],volume:["82"],year:2002,yeareval:2002},{name:"Naphtho[1,2-<i>b</i>]fluoranthene",group:"3",cas:["111189-32-3"],volume:["92"],year:2010,yeareval:2005},{name:"Naphtho[2,1-<i>a</i>]fluoranthene",group:"3",cas:["203-20-3"],volume:["92"],year:2010,yeareval:2005},{name:"Naphtho[2,3-<i>e</i>]pyrene",group:"3",cas:["193-09-9"],volume:["92"],year:2010,yeareval:2005},{name:"Neutron radiation",group:"1",volume:["75","100D"],year:2012,yeareval:2009,comment:"NB Overall evaluation upgraded to Group 1 with supporting evidence from other relevant data"},{name:"Nickel compounds",group:"1",volume:["Sup 7","49","100C"],year:2012,yeareval:2009},{name:"Nickel refining (see Nickel compounds)",volume:["11"],year:1976,yeareval:1976},{name:"Nickel, metallic",group:"2B",cas:["7440-02-0"],volume:["Sup 7","49"],year:1990,yeareval:1989},{name:"Night shift work",group:"2A",volume:["98","124"],year:"2020 online",yeareval:2019,comment:"NB Volume 98 evaluated shiftwork that involves circadian disruption"},{name:"Niridazole",group:"2B",cas:["61-57-4"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Nithiazide",group:"3",cas:["139-94-6"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Nitrate or nitrite (ingested) under conditions that result in endogenous nitrosation",group:"2A",volume:["94"],year:2010,yeareval:2006},{name:"Nitrilotriacetic acid and its salts",group:"2B",cas:["139-13-9"],volume:["48","73"],year:1999,yeareval:1998,comment:"NB Evaluated as a group"},{name:"Nitrobenzene",group:"2B",cas:["98-95-3"],volume:["65"],year:1996,yeareval:1995},{name:"Nitrofen (technical-grade)",group:"2B",cas:["1836-75-5"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Nitrofural (Nitrofurazone)",group:"3",cas:["59-87-0"],volume:["50"],year:1990,yeareval:1989},{name:"Nitrofurantoin",group:"3",cas:["67-20-9"],volume:["50"],year:1990,yeareval:1989},{name:"Nitrogen mustard",group:"2A",cas:["51-75-2"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Nitrogen mustard <i>N</i>-oxide",group:"2B",cas:["126-85-2"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Nitromethane",group:"2B",cas:["75-52-5"],volume:["77"],year:2e3,yeareval:2e3},{name:"Nitrotoluenes",group:"3",cas:["99-08-1","99-99-0"],volume:["65"],year:1996,yeareval:1995},{name:"Nitrovin",group:"3",cas:["804-36-4"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Nodularins",group:"3",cas:["118399-22-7"],volume:["94"],year:2010,yeareval:2006},{name:"Non-arsenical insecticides (occupational exposures in spraying and application of)",group:"2A",volume:["53"],year:1991,yeareval:1990},{name:"Nylon 6",group:"3",cas:["25038-54-4"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Ochratoxin A",group:"2B",cas:["303-47-9"],volume:["Sup 7","56"],year:1993,yeareval:1992},{name:"Oestradiol mustard",group:"3",cas:["22966-79-6"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Oestrogen (see Estrogen)"},{name:"Oil Orange SS",group:"2B",cas:["2646-17-5"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Opium consumption",group:"1",volume:["126"],year:"2021 online",yeareval:2020},{name:"Oral contraceptives, combined estrogen-progestogen (see Estrogen-progestogen oral contraceptives)"},{name:"Orange G (see CI Orange G)",cas:["1936-15-8"]},{name:"Orange I (see CI Acid Orange 20)",cas:["523-44-4"]},{name:"Organic polymeric materials",group:"3",volume:["74"],year:"1999",yeareval:1999},{name:"Orthopaedic implants of complex composition and cardiac pacemakers",group:"3",volume:["74"],year:"1999",yeareval:1999},{name:"Other cobalt(II) compounds (not including Soluble cobalt(II) salts, Cobalt(II) oxide, Cobalt(II,III) oxide, and Cobalt(II) sulfide)",group:"3",volume:["52","86","131"],year:"2023 online",yeareval:2022},{name:"Outdoor air pollution",group:"1",volume:["109"],year:"2016",yeareval:2013},{name:"Outdoor air pollution, particulate matter in",group:"1",volume:["109"],year:"2016",yeareval:2013},{name:"Oxazepam",group:"2B",cas:["604-75-1"],volume:["Sup 7","66"],year:1996,yeareval:1996},{name:"Oxymetholone (see Androgenic (anabolic) steroids)"},{name:"Oxyphenbutazone",group:"3",cas:["129-20-4"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Paint manufacture (occupational exposure in)",group:"3",volume:["47"],year:1989,yeareval:2009},{name:"Painter (occupational exposure as a)",group:"1",volume:["47","98","100F"],year:2012,yeareval:2009},{name:"Palygorskite (Attapulgite) (long fibres, > 5 micrometres)",group:"2B",cas:["12174-11-7"],volume:["68"],year:1997,yeareval:1996},{name:"Palygorskite (Attapulgite)(short fibres, < 5 micrometres)",group:"3",cas:["12174-11-7"],volume:["68"],year:1997,yeareval:1996},{name:"Panfuran S (containing dihydroxymethylfuratrizine)",group:"2B",cas:["794-93-4"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Paracetamol (Acetaminophen)",group:"3",cas:["103-90-2"],volume:["50","73"],year:1999,yeareval:1998},{name:"Parasorbic acid",group:"3",cas:["10048-32-5"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Parathion",group:"2B",cas:["56-38-2"],volume:["30","Sup 7","112"],year:"2017",yeareval:2015},{name:"Particulate matter in outdoor air pollution (see Outdoor air pollution, particulate matter in)"},{name:"Patulin",group:"3",cas:["149-29-1"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Paving and roofing with coal-tar pitch (see Coal-tar pitch)",volume:["35","Sup 7","92","100F"]},{name:"Penicillic acid",group:"3",cas:["90-65-3"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Pentachloroethane",group:"3",cas:["76-01-7"],volume:["41","Sup 7","71"],year:1999,yeareval:1998},{name:"Pentachlorophenol (see also Polychlorophenols)",group:"1",cas:["87-86-5"],volume:["53","71","117"],year:"2019",yeareval:2016},{name:"Pentavalent antimony",group:"3",volume:["131"],year:"2023 online",yeareval:2022},{name:"Pentosan polysulfate sodium",group:"2B",cas:["37319-17-8"],volume:["108"],year:"2016",yeareval:2013},{name:"Perfluorooctanoic acid (PFOA)",group:"1",cas:["335-67-1"],volume:["110","135"],year:"2025 online",yeareval:2023},{name:"Perfluorooctanesulfonic acid (PFOS)",group:"2B",cas:["1763-23-1"],volume:["135"],year:"2025 online",yeareval:2023},{name:"Permethrin",group:"3",cas:["52645-53-1"],volume:["53"],year:1991,yeareval:1990},{name:"Perylene",group:"3",cas:["198-55-0"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Petasitenine",group:"3",cas:["60102-37-6"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Petroleum refining (occupational exposures in)",group:"2A",volume:["45"],year:1989,yeareval:1988},{name:"Petroleum solvents",group:"3",volume:["47"],year:1989,yeareval:1988},{name:"PhIP (2-Amino-1-methyl-6-phenylimidazo[4,5-<i>b</i>]pyridine)",group:"2B",cas:["105650-23-5"],volume:["56"],year:1993,yeareval:1992},{name:"Phenacetin",group:"1",cas:["62-44-2"],volume:["24","Sup 7","100A"],year:2012,yeareval:2008,comment:"NB Overall evaluation upgraded to Group 1 with supporting evidence from other relevant data"},{name:"Phenacetin, analgesic mixtures containing",group:"1",volume:["Sup 7","100A"],year:2012,yeareval:2008},{name:"Phenanthrene",group:"3",cas:["85-01-8"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Phenazopyridine hydrochloride",group:"2B",cas:["136-40-3"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Phenelzine sulfate",group:"3",cas:["156-51-4"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Phenicarbazide",group:"3",cas:["103-03-7"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Phenobarbital",group:"2B",cas:["50-06-6"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Phenol",group:"3",cas:["108-95-2"],volume:["47","71"],year:1999,yeareval:1998},{name:"Phenolphthalein",group:"2B",cas:["77-09-8"],volume:["76"],year:2e3,yeareval:1999},{name:"Phenoxybenzamine hydrochloride",group:"2B",cas:["63-92-3"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Phenyl glycidyl ether",group:"2B",cas:["122-60-1"],volume:["47","71"],year:1999,yeareval:1998},{name:"Phenylbutazone",group:"3",cas:["50-33-9"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Phenytoin",group:"2B",cas:["57-41-0"],volume:["Sup 7","66"],year:1996,yeareval:1996},{name:"Phosphorus-32, as phosphate",group:"1",cas:["14596-37-3"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Picene",group:"3",cas:["213-46-7"],volume:["92"],year:2010,yeareval:2005},{name:"Pickled vegetables (traditional Asian)",group:"2B",volume:["56"],year:1993,yeareval:1992},{name:"Picloram",group:"3",cas:["1918-02-1"],volume:["53"],year:1991,yeareval:1990},{name:"Pioglitazone",group:"2A",cas:["111025-46-8"],volume:["108"],year:"2016",yeareval:2013},{name:"Piperonyl butoxide",group:"3",cas:["51-03-6"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Plutonium",group:"1",cas:["7440-07-5"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Poligeenan (see Carrageenan, degraded)",cas:["53973-98-1"]},{name:"Polyacrylic acid",group:"3",cas:["9003-01-4"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polybrominated biphenyls",group:"2A",cas:["59536-65-1"],volume:["41","Sup 7","107"],year:"2016",yeareval:2013,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data, namely mechanistic similarity with polychlorinated biphenyls classified in Group 1"},{name:"Polychlorinated biphenyls",group:"1",cas:["1336-36-3"],volume:["18","Sup 7","107"],year:"2016",yeareval:2013},{name:"Polychlorinated biphenyls, dioxin-like, with a Toxicity Equivalency Factor (TEF) according to WHO (PCBs 77, 81, 105, 114, 118, 123, 126, 156, 157, 167, 169, 189)",group:"1",volume:["107"],year:"2016",yeareval:2013,comment:"NB Overall evaluation upgraded to Group 1 with strong supporting evidence from other relevant data"},{name:"Polychlorinated dibenzo-<i>para</i>-dioxins (other than 2,3,7,8-tetrachlorodibenzo-<i>para</i>-dioxin)",group:"3",volume:["69"],year:1997,yeareval:1997},{name:"Polychlorinated dibenzofurans (see 2,3,4,7,8-Pentachlorodibenzofuran)",group:"3",volume:["69"],year:1997,yeareval:1997},{name:"Polychlorophenols and their sodium salts (mixed exposures) (see Pentachlorophenol; 2,4,6-Trichlorophenol)",group:"2B",volume:["53","71"],year:1999,yeareval:1998},{name:"Polychloroprene",group:"3",cas:["9010-98-4"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polyethylene",group:"3",cas:["9002-88-4"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polymeric implant prepared as thin smooth films (with the exception of poly-glycolic acid)",group:"2B",volume:["74"],year:"1999",yeareval:1999},{name:"Polymethyl methacrylate",group:"3",cas:["9011-14-7"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polymethylene polyphenyl isocyanate",group:"3",cas:["9016-87-9"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polypropylene",group:"3",cas:["9003-07-0"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polystyrene",group:"3",cas:["9003-53-6"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polytetrafluoroethylene",group:"3",cas:["9002-84-0"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polyurethane foams",group:"3",cas:["9009-54-5"],volume:["19","Sup 7"],year:1987,yeareval:1987,comment:"NB This CAS No. has been deleted."},{name:"Polyvinyl acetate",group:"3",cas:["9003-20-7"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polyvinyl alcohol",group:"3",cas:["9002-89-5"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polyvinyl chloride",group:"3",cas:["9002-86-2"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Polyvinyl pyrrolidone",group:"3",cas:["9003-39-8"],volume:["19","Sup 7","71"],year:1999,yeareval:1998},{name:"Ponceau 3R",group:"2B",cas:["3564-09-8"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Ponceau MX",group:"2B",cas:["3761-53-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Ponceau SX",group:"3",cas:["4548-53-2"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Potassium bis(2-hydroxyethyl)dithiocarbamate",group:"3",cas:["23746-34-1"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Potassium bromate",group:"2B",cas:["7758-01-2"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Prazepam",group:"3",cas:["2955-38-6"],volume:["66"],year:1996,yeareval:1996},{name:"Prednimustine",group:"3",cas:["29069-24-7"],volume:["50"],year:1990,yeareval:1989},{name:"Prednisone",group:"3",cas:["53-03-2"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Primidone",group:"2B",cas:["125-33-7"],volume:["108"],year:"2016",yeareval:2013},{name:"Printing inks",group:"3",volume:["65"],year:1996,yeareval:1995},{name:"Printing processes (occupational exposures in)",group:"2B",volume:["65"],year:1996,yeareval:1995},{name:"Procarbazine hydrochloride",group:"2A",cas:["366-70-1"],volume:["26","Sup 7"],year:1987,yeareval:1987,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Processed meat (consumption of)",group:"1",volume:["114"],year:2018,yeareval:2015},{name:"Proflavine salts",group:"3",volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Progestins (see also Progestogen-only contraceptives)",group:"2B",volume:["Sup 7"],year:1987,yeareval:1987},{name:"Progestogen-only contraceptives",group:"2B",volume:["72"],year:1999,yeareval:1998},{name:"Pronetalol hydrochloride",group:"3",cas:["51-02-5"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Propham",group:"3",cas:["122-42-9"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Propylene",group:"3",cas:["115-07-1"],volume:["Sup 7","60"],year:1994,yeareval:1994},{name:"Propylene oxide",group:"2B",cas:["75-56-9"],volume:["Sup 7","60"],year:1994,yeareval:1994},{name:"Propylthiouracil",group:"2B",cas:["51-52-5"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Ptaquiloside",group:"3",cas:["87625-62-5"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Pulegone",group:"2B",cas:["89-82-7"],volume:["108"],year:"2016",yeareval:2013},{name:"Pulp and paper manufacture",group:"3",volume:["25","Sup 7"],year:1987,yeareval:1987},{name:"Pyrene",group:"3",cas:["129-00-0"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Pyridine",group:"2B",cas:["110-86-1"],volume:["77","119"],year:"2019",yeareval:2017},{name:"Pyrido[3,4-<i>c</i>]psoralen",group:"3",cas:["85878-62-2"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Pyrimethamine",group:"3",cas:["58-14-0"],volume:["13","Sup 7"],year:1987,yeareval:1987},{name:"Quercetin",group:"3",cas:["117-39-5"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Quinoline",group:"2B",cas:["91-22-5"],volume:["121"],year:2019,yeareval:2018},{name:"Quintozene (Pentachloronitrobenzene)",group:"3",cas:["82-68-8"],volume:["5","Sup 7"],year:1987,yeareval:1987},{name:"Radiofrequency electromagnetic fields",group:"2B",volume:["102"],year:2013,yeareval:2011},{name:"Radioiodines, including iodine-131",group:"1",volume:["78","100D"],year:2012,yeareval:2009},{name:"Radionuclides, alpha-particle-emitting, internally deposited",group:"1",volume:["78","100D"],year:2012,yeareval:2009,comment:"NB Specific radionuclides for which there is sufficient or limited evidence in humans are also listed individually as Group 1 agents"},{name:"Radionuclides, beta-particle-emitting, internally deposited",group:"1",volume:["78","100D"],year:2012,yeareval:2009,comment:"NB Specific radionuclides for which there is sufficient evidence in humans are also listed individually as Group 1 agents"},{name:"Radium-224 and its decay products",group:"1",cas:["13233-32-4"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Radium-226 and its decay products",group:"1",cas:["13982-63-3"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Radium-228 and its decay products",group:"1",cas:["15262-20-1"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Radon-222 and its decay products",group:"1",cas:["10043-92-2"],volume:["43","78","100D"],year:2012,yeareval:2009},{name:"Red meat (consumption of)",group:"2A",volume:["114"],year:"2018 ",yeareval:2015},{name:"Refractory ceramic fibres",group:"2B",volume:["43","81"],year:2002,yeareval:2001},{name:"Reserpine",group:"3",cas:["50-55-5"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Resorcinol",group:"3",cas:["108-46-3"],volume:["15","Sup 7","71"],year:1999,yeareval:1998},{name:"Retrorsine",group:"3",cas:["480-54-6"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Rhodamine 6G",group:"3",cas:["989-38-8"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Rhodamine B",group:"3",cas:["81-88-9"],volume:["16","Sup 7"],year:1987,yeareval:1987},{name:"Riddelliine",group:"2B",cas:["23246-96-0"],volume:["10","Sup 7","82"],year:2002,yeareval:2002},{name:"Rifampicin",group:"3",cas:["13292-46-1"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Ripazepam",group:"3",cas:["26308-28-1"],volume:["66"],year:1996,yeareval:1996},{name:"Rock (stone) wool",group:"3",volume:["43","81"],year:2002,yeareval:2001},{name:"Rosiglitazone",group:"3",cas:["122320-73-4"],volume:["108"],year:"2016",yeareval:2013},{name:"Rubber manufacturing industry",group:"1",volume:["28","Sup 7","100F"],year:2012,yeareval:2009},{name:"Rugulosin",group:"3",cas:["23537-16-8"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"SV40 polyomavirus ",group:"3",volume:["104"],year:"2014",yeareval:2012},{name:"Saccharated iron oxide",group:"3",cas:["8047-67-4"],volume:["2","Sup 7"],year:1987,yeareval:1987},{name:"Saccharin and its salts",group:"3",cas:["81-07-2"],volume:["Sup 7","73"],year:1999,yeareval:1998,comment:"NB Overall evaluation downgraded to Group 3 with supporting evidence from other relevant data"},{name:"Safrole",group:"2B",cas:["94-59-7"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Salted fish, Chinese-style",group:"1",volume:["56","100E"],year:2012,yeareval:2009},{name:"Scarlet Red",group:"3",cas:["85-83-6"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Selenium and selenium compounds",group:"3",cas:["7782-49-2"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Semicarbazide hydrochloride",group:"3",cas:["563-41-7"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"1-(2-Chloroethyl)-3-(4-methylcyclohexyl)-1-nitrosourea (Methyl-CCNU) (Semustine)",group:"1",cas:["13909-09-6"],volume:["Sup 7","100A"],year:2012,yeareval:2008},{name:"Seneciphylline",group:"3",cas:["480-81-9"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Senkirkine",group:"3",cas:["2318-18-5"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Sepiolite",group:"3",cas:["15501-74-3"],volume:["Sup 7","68"],year:1997,yeareval:1996},{name:"Shale oils",group:"1",cas:["68308-34-9"],volume:["35","Sup 7","100F"],year:2012,yeareval:2009},{name:"Shikimic acid",group:"3",cas:["138-59-0"],volume:["40","Sup 7"],year:1987,yeareval:1987},{name:"Silica dust, crystalline, in the form of quartz or cristobalite",group:"1",cas:["14808-60-7"],volume:["Sup 7","68","100C"],year:2012,yeareval:2009},{name:"Silica, amorphous",group:"3",cas:["7631-86-9"],volume:["Sup 7","68"],year:1997,yeareval:1996},{name:"Silicon carbide whiskers",group:"2A",cas:["409-21-2"],volume:["111"],year:"2017",yeareval:2014},{name:"Silicon carbide, fibrous",group:"2B",cas:["308076-74-6"],volume:["111"],year:"2017",yeareval:2014},{name:"Silicone breast implants",group:"3",volume:["74"],year:"1999",yeareval:1999,comment:'NB There is "evidence suggesting lack of carcinogenicity" in humans of silicone breast implants for female breast carcinoma.'},{name:"Simazine",group:"3",cas:["122-34-9"],volume:["53","73"],year:1999,yeareval:1998},{name:"Single-walled carbon nanotubes (see Carbon nanotubes, single-walled)",cas:["308068-56-6"]},{name:"Slag wool",group:"3",volume:["43","81"],year:2002,yeareval:2001},{name:"Sodium <i>ortho</i>-phenylphenate",group:"2B",cas:["132-27-4"],volume:["Sup 7","73"],year:1999,yeareval:1998},{name:"Sodium chlorite",group:"3",cas:["7758-19-2"],volume:["52"],year:1991,yeareval:1990},{name:"Sodium diethyldithiocarbamate",group:"3",cas:["148-18-5"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Solar radiation (see Ultraviolet radiation (wavelengths 100–400 nm, encompassing UVA, UVB, and UVC); Ultraviolet radiation from welding; and Ultraviolet-emitting tanning devices)",group:"1",volume:["55","100D"],year:2012,yeareval:2009},{name:"Soluble cobalt(II) salts",group:"2A",volume:["52","86","131"],year:"2023 online",yeareval:2022},{name:"Soot (as found in occupational exposure of chimney sweeps)",group:"1",volume:["35","Sup 7","92","100F"],year:2012,yeareval:2009},{name:"Special-purpose fibres such as E-glass and '475' glass fibres",group:"2B",volume:["81"],year:2002,yeareval:2001},{name:"Spironolactone",group:"3",cas:["52-01-7"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Sterigmatocystin",group:"2B",cas:["10048-13-2"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Streptozotocin",group:"2B",cas:["18883-66-4"],volume:["17","Sup 7"],year:1987,yeareval:1987},{name:"Strong-inorganic-acid mists containing sulfuric acid (see Acid mists)",cas:["7664-93-9"]},{name:"Strontium-90 (see Fission products)",cas:["10098-97-2"]},{name:"Styrene",group:"2A",cas:["100-42-5"],volume:["60","82","121"],year:2019,yeareval:2018},{name:"Styrene-7,8-oxide",group:"2A",cas:["96-09-3"],volume:["Sup 7","60","121"],year:2019,yeareval:2018,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Styrene-acrylonitrile copolymers",group:"3",cas:["9003-54-7"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Styrene-butadiene copolymers",group:"3",cas:["9003-55-8"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Succinic anhydride",group:"3",cas:["108-30-5"],volume:["15","Sup 7"],year:1987,yeareval:1987},{name:"Sudan Brown RR",group:"3",cas:["6416-57-5"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Sudan I",group:"3",cas:["842-07-9"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Sudan II",group:"3",cas:["3118-97-6"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Sudan III",group:"3",cas:["85-86-9"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Sudan Red 7B",group:"3",cas:["6368-72-5"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Sulfafurazole (Sulfisoxazole)",group:"3",cas:["127-69-5"],volume:["24","Sup 7"],year:1987,yeareval:1987},{name:"Sulfallate",group:"2B",cas:["95-06-7"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Sulfamethazine",group:"3",cas:["57-68-1"],volume:["79"],year:2001,yeareval:2e3,comment:"NB Overall evaluation downgraded to Group 3 with supporting evidence from other relevant data"},{name:"Sulfamethoxazole",group:"3",cas:["723-46-6"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Sulfasalazine",group:"2B",cas:["599-79-1"],volume:["108"],year:"2016",yeareval:2013},{name:"Sulfites",group:"3",volume:["54"],year:1992,yeareval:1991},{name:"Sulfur dioxide",group:"3",cas:["7446-09-5"],volume:["54"],year:1992,yeareval:1991},{name:"Sulfur mustard",group:"1",cas:["505-60-2"],volume:["9","Sup 7","100F"],year:2012,yeareval:2009},{name:"Sunlamps and sunbeds (see Ultraviolet-emitting tanning devices)"},{name:"Sunset Yellow FCF",group:"3",cas:["2783-94-0"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Surgical implants (see Ceramic implants, Dental materials, Implanted foreign bodies, Metallic implants, Organic polymeric materials, Orthopaedic implants, Polymeric implants, Silicone breast implants)"},{name:"Symphytine",group:"3",cas:["22571-95-5"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"T2-Trichothecene",group:"3",cas:["21259-20-1"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Tacrolimus",group:"1",cas:["104987-11-3"],volume:["137"],year:"2026 online",yeareval:2024},{name:"Talc",group:"2A",cas:["14807-96-6"],volume:["42","Sup 7","93","136"],year:"2025 online",yeareval:2024,comment:'The term "Talc" includes "Talc containing asbestiform fibres other than asbestos" and "Talc not containing asbestiform       fibres", which were evaluated separately in Volume 93. For "Talc containing asbestos", see "Asbestos".'},{name:"Talc containing asbestos (see Asbestos)",cas:["14807-96-6"],volume:["93","Sup 7","100C"],year:2012,yeareval:2009},{name:"Talc-based body powder (perineal use of) (see Talc)",cas:["14807-96-6"],volume:["93"],year:2010,yeareval:2006},{name:"Tamoxifen",group:"1",cas:["10540-29-1"],volume:["66","100A"],year:2012,yeareval:2008,comment:'NB There is "evidence suggesting lack of carcinogenicity" for tamoxifen in humans and  cancer of the female breast. An inverse association has been observed between tamoxifen and  cancer of the female breast.'},{name:"Tannic acid and tannins",group:"3",cas:["1401-55-4"],volume:["10","Sup 7"],year:1987,yeareval:1987},{name:"Tea",group:"3",volume:["51"],year:1991,yeareval:1990},{name:"Temazepam",group:"3",cas:["846-50-4"],volume:["66"],year:1996,yeareval:1996},{name:"Teniposide",group:"2A",cas:["29767-20-2"],volume:["76"],year:2e3,yeareval:1999,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Terpene polychlorinates (Strobane®)",group:"3",cas:["8001-50-1"],volume:["5","Sup 7"],year:1987,yeareval:1987},{name:"Tetrabromobisphenol A",group:"2A",cas:["79-94-7"],volume:["115"],year:"2018 ",yeareval:2016,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from mechanistic data"},{name:"Testosterone (see Androgenic (anabolic) steroids)"},{name:"Tetrachloroethylene (Perchloroethylene)",group:"2A",cas:["127-18-4"],volume:["Sup 7","63","106"],year:2014,yeareval:2012},{name:"Tetrachlorvinphos",group:"2B",cas:["22248-79-9"],volume:["30","Sup 7","112"],year:"2017",yeareval:2015},{name:"Tetrafluoroethylene",group:"2A",cas:["116-14-3"],volume:["19","Sup 7","71","110"],year:"2017",yeareval:2014,comment:"NB Overall evaluation upgraded to Group 2A on the basis of sufficient evidence in experimental animals with a striking and atypical pattern of tumours"},{name:"Tetrahydrofuran",group:"2B",cas:["109-99-9"],volume:["119"],year:"2019",yeareval:2017},{name:"Tetrakis(hydroxymethyl)phosphonium salts",group:"3",volume:["48","71"],year:1999,yeareval:1998},{name:"Tetranitromethane",group:"2B",cas:["509-14-8"],volume:["65"],year:1996,yeareval:1995},{name:"Textile manufacturing industry (work in)",group:"2B",volume:["48"],year:1990,yeareval:1989},{name:"Theobromine",group:"3",cas:["83-67-0"],volume:["51"],year:1991,yeareval:1990},{name:"Theophylline",group:"3",cas:["58-55-9"],volume:["51"],year:1991,yeareval:1990},{name:"Thioacetamide",group:"2B",cas:["62-55-5"],volume:["7","Sup 7"],year:1987,yeareval:1987},{name:"Thiotepa",group:"1",cas:["52-24-4"],volume:["Sup 7","50","100A"],year:2012,yeareval:2008},{name:"Thiouracil",group:"2B",cas:["141-90-2"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Thiourea",group:"3",cas:["62-56-6"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Thiram",group:"3",cas:["137-26-8"],volume:["Sup 7","53"],year:1991,yeareval:1990},{name:"Thorium-232 and its decay products",group:"1",cas:["7440-29-1"],volume:["78","100D"],year:2012,yeareval:2009},{name:"Titanium dioxide",group:"2B",cas:["13463-67-7"],volume:["47","93"],year:2010,yeareval:2006},{name:"Tobacco smoke, secondhand",group:"1",volume:["83","100E"],year:2012,yeareval:2009},{name:"Tobacco smoking",group:"1",volume:["83","100E"],year:2012,yeareval:2009,comment:'NB There is "evidence suggesting lack of carcinogenicity" in humans of tobacco smoking for cancers of the endometrium  (postmenopausal) and thyroid gland.'},{name:"Tobacco, smokeless",group:"1",volume:["Sup 7","89","100E"],year:2012,yeareval:2009},{name:"Toluene",group:"3",cas:["108-88-3"],volume:["47","71"],year:1999,yeareval:1998},{name:"Toluene diisocyanates",group:"2B",cas:["26471-62-5"],volume:["39","Sup 7","71"],year:1999,yeareval:1998},{name:"Toremifene",group:"3",cas:["89778-26-7"],volume:["66"],year:1996,yeareval:1996},{name:"Toxaphene (Polychlorinated camphenes)",group:"2B",cas:["8001-35-2"],volume:["Sup 7","79"],year:2001,yeareval:2e3},{name:"Toxins derived from certain <i>Fusarium</i> species (see <i>Fusarium</i>)"},{name:"Treosulfan",group:"1",cas:["299-75-2"],volume:["26","Sup 7","100A"],year:2012,yeareval:2008},{name:"Triamterene",group:"2B",cas:["396-01-0"],volume:["108"],year:"2016",yeareval:2013},{name:"Trichlorfon",group:"3",cas:["52-68-6"],volume:["30","Sup 7"],year:1987,yeareval:1987},{name:"Trichlormethine (Trimustine hydrochloride)",group:"2B",cas:["817-09-4"],volume:["Sup 7","50"],year:1990,yeareval:1989},{name:"Trichloroacetic acid",group:"2B",cas:["76-03-9"],volume:["63","84","106"],year:2014,yeareval:2012},{name:"Trichloroacetonitrile",group:"3",cas:["545-06-2"],volume:["52","71"],year:1999,yeareval:1998},{name:"Trichloroethylene",group:"1",cas:["79-01-6"],volume:["Sup 7","63","106"],year:2014,yeareval:2012},{name:"Triethanolamine",group:"3",cas:["102-71-6"],volume:["77"],year:2e3,yeareval:2e3},{name:"Triethylene glycol diglycidyl ether",group:"3",cas:["1954-28-5"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"Trifluralin",group:"3",cas:["1582-09-8"],volume:["53"],year:1991,yeareval:1990},{name:"Trimethylolpropane triacrylate, technical grade",group:"2B",cas:["15625-89-5"],volume:["122"],year:2019,yeareval:2018},{name:"Triphenylene",group:"3",cas:["217-59-4"],volume:["Sup 7","92"],year:2010,yeareval:2005},{name:"Tris(1-aziridinyl)phosphine oxide",group:"3",cas:["545-55-1"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Tris(2,3-dibromopropyl) phosphate",group:"2A",cas:["126-72-7"],volume:["20","Sup 7","71"],year:1999,yeareval:1998,comment:"NB Overall evaluation upgraded to Group 2A with supporting evidence from other relevant data"},{name:"Tris(2-chloroethyl) phosphate",group:"3",cas:["115-96-8"],volume:["48","71"],year:1999,yeareval:1998},{name:"Tris(2-methyl-1-aziridinyl)phosphine oxide",group:"3",cas:["57-39-6"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Tris(aziridinyl)-<i>para</i>-benzoquinone (Triaziquone)",group:"3",cas:["68-76-8"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Trivalent antimony",group:"2A",volume:["47","131"],year:"2023 online",yeareval:2022},{name:"Trp-P-1 (3-Amino-1,4-dimethyl-5<i>H</i>-pyrido[4,3-<i>b</i>]indole)",group:"2B",cas:["62450-06-0"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Trp-P-2 (3-Amino-1-methyl-5<i>H</i>-pyrido[4,3-<i>b</i>]indole)",group:"2B",cas:["62450-07-1"],volume:["31","Sup 7"],year:1987,yeareval:1987},{name:"Trypan blue",group:"2B",cas:["72-57-1"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Tungsten carbide with cobalt metal (see Cobalt metal with tungsten carbide)",cas:["12070-12-1","7440-48-4"]},{name:"Ultraviolet radiation from welding (see Ultraviolet radiation (wavelengths 100–400 nm, encompassing UVA, UVB, and UVC); Ultraviolet-emitting tanning devices; and Solar radiation)",group:"1",volume:["100D*","118**"],year:"2018 online",yeareval:2017,comment:"*Volume 100D concluded that there is sufficient evidence for ocular melanoma in welders; **Volume  118 concluded that ultraviolet emissions from welding are carcinogenic to humans (Group 1; there is  <i>sufficient evidence</i> in humans for the carcinogenicity of ultraviolet radiation from welding)"},{name:"Ultraviolet radiation (wavelengths 100–400 nm, encompassing UVA, UVB, and UVC) (see Ultraviolet radiation from welding; Ultraviolet-emitting tanning devices; and Solar radiation)",group:"1",volume:["55","100D"],year:2012,yeareval:2017,comment:"NB Overall evaluation upgraded to Group 1 based on mechanistic and other relevant data"},{name:"Ultraviolet-emitting tanning devices (see Ultraviolet radiation (wavelengths 100–400 nm, encompassing UVA, UVB, and UVC); Ultraviolet radiation from welding; and Solar radiation)",group:"1",volume:["100D"],year:2012,yeareval:2009},{name:"Uracil mustard",group:"2B",cas:["66-75-1"],volume:["9","Sup 7"],year:1987,yeareval:1987},{name:"Uranium, mixture of isotopes (see Radionuclides, alpha-particle-emitting, internally deposited)",group:"1",cas:["7440-61-1"],volume:["78","100D"],year:2012,yeareval:2009,comment:"NB Uranium was listed as a Group 1 agent as a member of the family, Radionuclides, alpha-particle-emitting, internally deposited. There was limited evidence for the carcinogenicity of mixtures of uranium isotopes, with positive associations for lung cancer"},{name:"Urethane (see Ethyl carbamate)"},{name:"Vanadium pentoxide",group:"2B",cas:["1314-62-1"],volume:["86"],year:2006,yeareval:2003},{name:"Vat Yellow 4",group:"3",cas:["128-66-5"],volume:["48"],year:1990,yeareval:1989},{name:"Very hot beverages at above 65 °C (drinking)",group:"2A",volume:["116"],year:"2018 online",yeareval:2016},{name:"Vinblastine sulfate",group:"3",cas:["143-67-9"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Vinclozolin",group:"2B",cas:["50471-44-8"],volume:["140"],in_prep:!0,yeareval:2025},{name:"Vincristine sulfate",group:"3",cas:["2068-78-2"],volume:["26","Sup 7"],year:1987,yeareval:1987},{name:"Vinyl acetate",group:"2B",cas:["108-05-4"],volume:["Sup 7","63"],year:1995,yeareval:1995},{name:"Vinyl bromide",group:"2A",cas:["593-60-2"],volume:["39","Sup 7","71","97"],year:2008,yeareval:2007,comment:"NB (1) Overall evaluation upgraded to Group 2A based on mechanistic and other relevant data;\n(2) For practical purposes, vinyl bromide should be considered to act similarly to the human carcinogen vinyl chloride"},{name:"Vinyl chloride",group:"1",cas:["75-01-4"],volume:["Sup 7","97","100F"],year:2012,yeareval:2009},{name:"Vinyl chloride-vinyl acetate copolymers",group:"3",cas:["9003-22-9"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Vinyl fluoride",group:"2A",cas:["75-02-5"],volume:["Sup 7","63","97"],year:2008,yeareval:2007,comment:"NB (1) Overall evaluation upgraded to Group 2A based on mechanistic and other relevant data;\n(2) For practical purposes, vinyl fluoride should be considered to act similarly to the human carcinogen vinyl chloride"},{name:"Vinyl toluene",group:"3",cas:["25013-15-4"],volume:["60"],year:1994,yeareval:1994},{name:"Vinylidene chloride",group:"2B",cas:["75-35-4"],volume:["39","Sup 7","71","119"],year:"2019",yeareval:2017},{name:"Vinylidene chloride-vinyl chloride copolymers",group:"3",cas:["9011-06-7"],volume:["19","Sup 7"],year:1987,yeareval:1987},{name:"Vinylidene fluoride",group:"3",cas:["75-38-7"],volume:["39","Sup 7","71"],year:1999,yeareval:1998},{name:"Vitamin K substances",group:"3",cas:["12001-79-5"],volume:["76"],year:2e3,yeareval:1999},{name:"Voriconazole",group:"1",cas:["137234-62-9"],volume:["137"],year:"2026 online",yeareval:2024},{name:"Weapons-grade tungsten (with nickel and cobalt) alloy",group:"2B",volume:["131"],year:"2023 online",yeareval:2022},{name:"Welding fumes",group:"1",volume:["49","118"],year:"2018 online",yeareval:2017},{name:"Wollastonite",group:"3",cas:["13983-17-0"],volume:["Sup 7","68"],year:1997,yeareval:1996},{name:"Wood dust",group:"1",volume:["62","100C"],year:2012,yeareval:2009},{name:"Wood smoke (see Biomass fuel, indoor emissions from household combustion)"},{name:"X- and Gamma-Radiation",group:"1",volume:["75","100D"],year:2012,yeareval:2009},{name:"Xylenes",group:"3",cas:["1330-20-7"],volume:["47","71"],year:1999,yeareval:1998},{name:"Yellow AB",group:"3",cas:["85-84-7"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Yellow OB",group:"3",cas:["131-79-3"],volume:["8","Sup 7"],year:1987,yeareval:1987},{name:"Zalcitabine",group:"2B",cas:["7481-89-2"],volume:["76"],year:2e3,yeareval:1999},{name:"Zectran",group:"3",cas:["315-18-4"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Zeolites other than erionite (clinoptilolite, phillipsite,mordenite, non-fibrous Japanese zeolite, synthetic zeolites)",group:"3",cas:["1318-02-1"],volume:["68"],year:1997,yeareval:1996},{name:"Zidovudine (AZT)",group:"2B",cas:["30516-87-1"],volume:["76"],year:2e3,yeareval:1999},{name:"Zineb",group:"3",cas:["12122-67-7"],volume:["12","Sup 7"],year:1987,yeareval:1987},{name:"Ziram",group:"3",cas:["137-30-4"],volume:["Sup 7","53"],year:1991,yeareval:1990},{name:"α-Methylstyrene",group:"2B",cas:["98-83-9"],volume:["101"],year:2013,yeareval:2011},{name:"alpha-Chlorinated toluenes (benzal chloride, benzotrichloride, benzyl chloride) and benzoyl chloride (combined exposures)",group:"2A",cas:["98-87-3","98-07-7","100-44-7","98-88-4"],volume:["29","Sup 7","71"],year:1999,yeareval:1998},{name:"beta-Butyrolactone",group:"2B",cas:["3068-88-0"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"beta-Propiolactone",group:"2B",cas:["57-57-8"],volume:["4","Sup 7","71"],year:1999,yeareval:1998},{name:"gamma-Butyrolactone",group:"3",cas:["96-48-0"],volume:["11","Sup 7","71"],year:1999,yeareval:1998},{name:"β-Myrcene",group:"2B",cas:["123-35-3"],volume:["119"],year:2019,yeareval:2017},{name:"β-Picoline ",group:"3",cas:["108-99-6"],volume:["122"],year:2019,yeareval:2018}]}},function(e,a){e.exports='<style type="">td.nowrap{white-space:nowrap}</style> <h3>Agents classified by the IARC Monographs, Volumes 1–${last_volume}</h3> <table id=table class="display stripe cell-border" width=100%></table> <p>Last updated: <em>${last_update}</em></p>'}]);

thinking
**Preparing to search for specific module**
exec
/bin/bash -lc "rg -n -i 'invertase|fructofuranosidase|saccharase' /tmp/loc.app.js | head -n 20" in /home/exedev/chewber succeeded in 51ms:



thinking
**Planning safety literature search**
thinking
**Planning targeted PubMed search**
codex
I located the IARC classification dataset endpoint and confirmed no “invertase” entry is present there. I’m now querying PubMed directly for recent toxicology/safety literature and extracting concrete studies or noting gaps if evidence is sparse.
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=20&sort=date&term=invertase%20food%20enzyme%20safety%20toxicology'" in /home/exedev/chewber succeeded in 377ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD esearch 20060628//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20060628/esearch.dtd">
<eSearchResult><Count>0</Count><RetMax>0</RetMax><RetStart>0</RetStart><IdList/><TranslationSet><Translation>     <From>invertase</From>     <To>"beta-fructofuranosidase"[Supplementary Concept] OR "beta-fructofuranosidase"[All Fields] OR "invertase"[All Fields] OR "beta-fructofuranosidase"[MeSH Terms] OR "invertases"[All Fields]</To>    </Translation><Translation>     <From>food</From>     <To>"food"[MeSH Terms] OR "food"[All Fields]</To>    </Translation><Translation>     <From>enzyme</From>     <To>"enzyme's"[All Fields] OR "enzymes"[Supplementary Concept] OR "enzymes"[All Fields] OR "enzyme"[All Fields] OR "enzymes"[MeSH Terms] OR "enzymic"[All Fields] OR "enzymically"[All Fields] OR "enzymology"[Subheading] OR "enzymology"[All Fields]</To>    </Translation><Translation>     <From>safety</From>     <To>"safety"[MeSH Terms] OR "safety"[All Fields] OR "safeties"[All Fields]</To>    </Translation><Translation>     <From>toxicology</From>     <To>"toxicologies"[All Fields] OR "toxicology"[MeSH Terms] OR "toxicology"[All Fields]</To>    </Translation></TranslationSet><QueryTranslation>("beta fructofuranosidase"[Supplementary Concept] OR "beta fructofuranosidase"[All Fields] OR "invertase"[All Fields] OR "beta fructofuranosidase"[MeSH Terms] OR "invertases"[All Fields]) AND ("food"[MeSH Terms] OR "food"[All Fields]) AND ("enzyme s"[All Fields] OR "enzymes"[Supplementary Concept] OR "enzymes"[All Fields] OR "enzyme"[All Fields] OR "enzymes"[MeSH Terms] OR "enzymic"[All Fields] OR "enzymically"[All Fields] OR "enzymology"[MeSH Subheading] OR "enzymology"[All Fields]) AND ("safety"[MeSH Terms] OR "safety"[All Fields] OR "safeties"[All Fields]) AND ("toxicologies"[All Fields] OR "toxicology"[MeSH Terms] OR "toxicology"[All Fields])</QueryTranslation><WarningList><OutputMessage>Unknown sort schema 'date' ignored</OutputMessage><OutputMessage>No items found.</OutputMessage></WarningList></eSearchResult>

thinking
**Refining safety literature query**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=50&term=(invertase%20OR%20beta-fructofuranosidase)%20AND%20(toxicity%20OR%20safety%20OR%20allergy%20OR%20allergenic)'}" in /home/exedev/chewber exited 3 in 51ms:


thinking
**Fixing command quoting for URL**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=50&term=(invertase%20OR%20beta-fructofuranosidase)%20AND%20(toxicity%20OR%20safety%20OR%20allergy%20OR%20allergenic)'" in /home/exedev/chewber succeeded in 404ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD esearch 20060628//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20060628/esearch.dtd">
<eSearchResult><Count>313</Count><RetMax>50</RetMax><RetStart>0</RetStart><IdList>
<Id>41531465</Id>
<Id>41326113</Id>
<Id>41238936</Id>
<Id>41103772</Id>
<Id>41037721</Id>
<Id>40969906</Id>
<Id>40946480</Id>
<Id>40783448</Id>
<Id>40686618</Id>
<Id>40632792</Id>
<Id>40488911</Id>
<Id>40434596</Id>
<Id>40388856</Id>
<Id>40372547</Id>
<Id>40364418</Id>
<Id>40320587</Id>
<Id>40129709</Id>


thinking
**Refining search for additive safety**
thinking
**Searching external resources**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=20&term=invertase%20AND%20(allergy%20OR%20allergic%20OR%20hypersensitivity)%20AND%20(food%20OR%20oral)'" in /home/exedev/chewber succeeded in 247ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD esearch 20060628//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20060628/esearch.dtd">
<eSearchResult><Count>13</Count><RetMax>13</RetMax><RetStart>0</RetStart><IdList>
<Id>41531465</Id>
<Id>41103772</Id>
<Id>41037721</Id>
<Id>40071032</Id>
<Id>39698587</Id>
<Id>38415018</Id>
<Id>36824679</Id>
<Id>35453329</Id>
<Id>20843643</Id>
<Id>16717426</Id>
<Id>15685855</Id>
<Id>12704374</Id>
<Id>11815736</Id>
</IdList><TranslationSet><Translation>     <From>invertase</From>     <To>"beta-fructofuranosidase"[Supplementary Concept] OR "beta-fructofuranosidase"[All Fields] OR "invertase"[All Fields] OR "beta-fructofuranosidase"[MeSH Terms] OR "invertases"[All Fields]</To>    </Translation><Translation>     <From>allergy</From>     <To>"allergie"[All Fields] OR "hypersensitivity"[MeSH Terms] OR "hypersensitivity"[All Fields] OR "allergies"[All Fields] OR "allergy"[All Fields] OR "allergy and immunology"[MeSH Terms] OR ("allergy"[All Fields] AND "immunology"[All Fields]) OR "allergy and immunology"[All Fields]</To>    </Translation><Translation>     <From>allergic</From>     <To>"allergic"[All Fields] OR "allergical"[All Fields] OR "allergically"[All Fields] OR "allergics"[All Fields] OR "allergization"[All Fields] OR "allergizing"[All Fields]</To>    </Translation><Translation>     <From>hypersensitivity</From>     <To>"hypersensitiveness"[All Fields] OR "hypersensitivity"[MeSH Terms] OR "hypersensitivity"[All Fields] OR "hypersensitive"[All Fields] OR "hypersensitivities"[All Fields] OR "hypersensitization"[All Fields] OR "hypersensitize"[All Fields]</To>    </Translation><Translation>     <From>food</From>     <To>"food"[MeSH Terms] OR "food"[All Fields]</To>    </Translation><Translation>     <From>oral</From>     <To>"mouth"[MeSH Terms] OR "mouth"[All Fields] OR "oral"[All Fields]</To>    </Translation></TranslationSet><QueryTranslation>("beta fructofuranosidase"[Supplementary Concept] OR "beta fructofuranosidase"[All Fields] OR "invertase"[All Fields] OR "beta fructofuranosidase"[MeSH Terms] OR "invertases"[All Fields]) AND ("allergie"[All Fields] OR "hypersensitivity"[MeSH Terms] OR "hypersensitivity"[All Fields] OR "allergies"[All Fields] OR "allergy"[All Fields] OR "allergy and immunology"[MeSH Terms] OR ("allergy"[All Fields] AND "immunology"[All Fields]) OR "allergy and immunology"[All Fields] OR ("allergic"[All Fields] OR "allergical"[All Fields] OR "allergically"[All Fields] OR "allergics"[All Fields] OR "allergization"[All Fields] OR "allergizing"[All Fields]) OR ("hypersensitiveness"[All Fields] OR "hypersensitivity"[MeSH Terms] OR "hypersensitivity"[All Fields] OR "hypersensitive"[All Fields] OR "hypersensitivities"[All Fields] OR "hypersensitization"[All Fields] OR "hypersensitize"[All Fields])) AND ("food"[MeSH Terms] OR "food"[All Fields] OR ("mouth"[MeSH Terms] OR "mouth"[All Fields] OR "oral"[All Fields]))</QueryTranslation></eSearchResult>

thinking
**Fetching XML summaries for IDs**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=41531465,41103772,41037721,40071032,39698587,38415018,36824679,35453329,20843643,16717426,15685855,12704374,11815736' | sed -n '1,240p'" in /home/exedev/chewber succeeded in 327ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSummaryResult PUBLIC "-//NLM//DTD esummary v1 20041029//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20041029/esummary-v1.dtd">
<eSummaryResult>
<DocSum>
	<Id>41531465</Id>
	<Item Name="PubDate" Type="Date">2026 Jan</Item>
	<Item Name="EPubDate" Type="Date">2026 Jan 12</Item>
	<Item Name="Source" Type="String">EFSA J</Item>
	<Item Name="AuthorList" Type="List">
		<Item Name="CollectiveName" Type="String">EFSA Food Enzymes Panel (FEZ)</Item>
		<Item Name="Author" Type="String">Zorn H</Item>
		<Item Name="Author" Type="String">Barat Baviera JM</Item>
		<Item Name="Author" Type="String">Bolognesi C</Item>
		<Item Name="Author" Type="String">Catania F</Item>
		<Item Name="Author" Type="String">Gadermaier G</Item>
		<Item Name="Author" Type="String">Greiner R</Item>
		<Item Name="Author" Type="String">Mayo B</Item>
		<Item Name="Author" Type="String">Mortensen A</Item>
		<Item Name="Author" Type="String">Roos YH</Item>
		<Item Name="Author" Type="String">Solano MLM</Item>

thinking
**Planning EFSA study gathering**
🌐 Searching the web...
🌐 Searched: EFSA Journal 2023 safety evaluation food enzyme invertase Saccharomyces cerevisiae INV

thinking
**Planning CFR and FDA source gathering**
🌐 Searching the web...
🌐 Searched: "invertase" "21 CFR"

thinking
**Confirming regulatory citations**
🌐 Searching the web...
🌐 Searched the web

thinking
**Planning EFSA data fetching**
codex
I now have a reliable FDA source that explicitly lists invertase as GRAS via historical FDA opinion letters, plus CFR framework references. I’m extracting exact EFSA/JECFA values with direct page fetches next so the report can cite concrete numbers and dates.
exec
/bin/bash -lc "curl -sL 'https://www.efsa.europa.eu/en/efsajournal/pub/9128' | rg -n -i 'Published|Adopted|Abstract|ADI|does not give rise to safety concerns|dietary exposure|tomato allergen|QPS|intended to be used' | head -n 80" in /home/exedev/chewber succeeded in 1.07s:
1:<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%;color:#313131;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}body{display:flex;flex-direction:column;height:100vh;min-height:100vh}.main-content{margin:8rem auto;padding-left:1.5rem;max-width:60rem}@media (width <= 720px){.main-content{margin-top:4rem}}.h2{line-height:2.25rem;font-size:1.5rem;font-weight:500}@media (width <= 720px){.h2{line-height:1.5rem;font-size:1.25rem}}#challenge-error-text{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0IyMEYwMyIgZD0iTTE2IDNhMTMgMTMgMCAxIDAgMTMgMTNBMTMuMDE1IDEzLjAxNSAwIDAgMCAxNiAzbTAgMjRhMTEgMTEgMCAxIDEgMTEtMTEgMTEuMDEgMTEuMDEgMCAwIDEtMTEgMTEiLz48cGF0aCBmaWxsPSIjQjIwRjAzIiBkPSJNMTcuMDM4IDE4LjYxNUgxNC44N0wxNC41NjMgOS41aDIuNzgzem0tMS4wODQgMS40MjdxLjY2IDAgMS4wNTcuMzg4LjQwNy4zODkuNDA3Ljk5NCAwIC41OTYtLjQwNy45ODQtLjM5Ny4zOS0xLjA1Ny4zODktLjY1IDAtMS4wNTYtLjM4OS0uMzk4LS4zODktLjM5OC0uOTg0IDAtLjU5Ny4zOTgtLjk4NS40MDYtLjM5NyAxLjA1Ni0uMzk3Ii8+PC9zdmc+");background-repeat:no-repeat;background-size:contain;padding-left:34px}@media (prefers-color-scheme: dark){body{background-color:#222;color:#d9d9d9}}</style><meta http-equiv="refresh" content="360"></head><body><div class="main-wrapper" role="main"><div class="main-content"><noscript><div class="h2"><span id="challenge-error-text">Enable JavaScript and cookies to continue</span></div></noscript></div></div><script>(function(){window._cf_chl_opt = {cvId: '3',cZone: 'efsa.onlinelibrary.wiley.com',cType: 'managed',cRay: '9d445b80c9678736',cH: 'snfs6RhgB0a0oZLiD55IfcEOysUxQx4BLQJwbflXJZE-1772160445-1.2.1.1-h8j.TCu6.EMF8QwSpqVYkSkk9IbRjdVIbzf3a97r9Y3O1bQrmpFoINgMu5BvdQk3',cUPMDTk:"\/doi\/10.2903\/j.efsa.2024.9128?__cf_chl_tk=HJW_GyJUdY_IMvBkD.WiOLISUVAWQdyDz24eqxZYGBg-1772160445-1.0.1.1-BzAaOZdRPHVfao0__UDSHatxDBKl_MdCQ9825Kud4MU",cFPWv: 'b',cITimeS: '1772160445',cTplC:0,cTplV:5,cTplB: '0',fa:"\/doi\/10.2903\/j.efsa.2024.9128?__cf_chl_f_tk=HJW_GyJUdY_IMvBkD.WiOLISUVAWQdyDz24eqxZYGBg-1772160445-1.0.1.1-BzAaOZdRPHVfao0__UDSHatxDBKl_MdCQ9825Kud4MU",md: '4ZVwHnoWQwF3EC5SJiKwz9tU5anwWaB.GbccaTJtNNA-1772160445-1.2.1.1-DfbfE937t4HjHc4StQ3td1M8UMy_HQHaxnZSpsz5ootThGWJhNNQ.DpUJIIDW1HcUs6zDGBSIpnZZ4VSfka9FlqRhwaoxzjlNq1uKeWvR4LvRyKcxjlcrNc0Jqzayon7ars3sWp0oknCbsZeBoN0ryWaWX8od.w6epNOf8hM0gUfzWPZ10tKk1oYJMfbXg_IrFYSbDyqsEigZryrvCOYREF37RjE451zq7YFt3i0bW5098f7j87p4j2cXnidgbA6ioemEumq.l0.8owtvVlsUSfltvg8etF5rn54HaNOUqeRfTZRWKOLhtw.IM4fylyouoDBjcBdf6ssX0QGMGTlNt5ISXteKUxsC9mLoj_Zeuks74H4g6Io.6V1jorf9YFiBNoAZbOovA26nkxKB6EeOZ.3MCLrMoTXITZ8Ma_akWAPWIkcR7G7RGHZ2T37pLzkR3Y9sTNun_VFoBQP7HCwoFEV4NRvlm35ms6DAEWtEC_ae3GAfBUeai0_0lILDuQm0mHGrluO5oNCdzJVbXXUDB5vq170qUIuuv4J8EGtcqCYaWJIjog8q9SJnDjvWv9aP_crQrpVnTXxsdcLxgqx8bv.dTzfQo_i6MmnnZp3I2QjseTXES3xYPIYVfglAGECb3X2MBvpT.90V7YSfgIH0ioOYPKdbBtYGF1qTMl5WZgX0Qa5ebWj0l2AVnlaFqpZtItOMfmgjF1Iee_bzk2TVygvE0dSzJ7PHoxBywhUSyYnJliShoe3_komZryYraXMo4mR9ebwlu7reYK7N8Ozka98Ao6oESBZXV.LjPxwOVqfOPk_iI9aA6C3jazufoPOPLYHTc9iw83dpcn4yn_gFAvuaNziwem21fAbL18h83LCAg6sIC9nqnXXCvugdBupOHuxp2UvtXEIlMdmPxv7kixD.oxQhHlF4tVstLziaO.sUr9OQpoiXB9CPue0cyTCHPO3oD0b11Dyl_.pTLCRcJD2vg2pe4mITG6u2zBlZsU2s2_UpB_6aw..vltRkqjH',mdrd: 'Rup_sxF0Z5b9Fsq87L6NWC._Gkt1cqnGYen76LyUOAw-1772160445-1.2.1.1-KppRFucK7U7EpdTX3gZ4WoevNEgGnCIk6spDvhdDdsdp.6da06XFS5Qf915medU1ljy47X7ExB8m7tVBCbGm2LjGFeEL4AmV7XQY8dWky0aA_kQR0IsmFUclLkIEiiPgSqhDr2sVGvi.sr.rjxifLruZ_H3KQLJMnM_EGh6uABaSBV3CUDDbefc_aSE6Sc1ubDGcGtS4dZkS43T4CLJvKVKYKmc1NvF31TRFkkue7fxC2lc.vsIp0ksdZ29r0g6OfYAqE690OTZ5TIVNmxTmNWwkapRKizZUOGdFfLIlnF_vJdXitl6vKHcl8kokA9vF4vOrCzdeymc7VLTBjtAQDY9p2NMz2Z.x7JlfbyCTsgXl.QQQe8sa6ACSjmuZfoeYqzmI22QQGt0rXlABCdB9rlp8YhYF1zA66t2Oojqc0u6W869yO7sh2WXqjJxSbnk9ba5.8_0dOC7BmjK4.yvV7MSHcMePpHbyJtLZ20PdqI9TGPXnY83Csce1onrJxZxrExgh2NtaHSif_bxt5Rds1Y1HiSgnChm_7wvTmbLORUDehVCtExAt2_oo38PCDIeeHE8gPawr_pdJEJv6dJATxd7edsZZA5Wn6.YPktQ.aEb0iAHDPGzmmMuWCETpXdDolDWmlIsMjHmy8H2lLYCJFKImK_CVJIlDcV_3tsypyMC58sIIM5RCHZgKxWRqKjn6_bd2FzB.HJ7OwFMz50ikP3pNKDS.pOMIjbbo1aKOMCC40ugA3Pt2Cb6KWSsgESO2pqVlkPVXcANck1vKCAOuv28FrEb4ZKACkW6g8yu3nS44kPu5PSnUR1UPeNMBPLXmy9t9F.KOJEQDtF8Ro3_79F2jqMhfogAwEvvqdldjbs1hPet7pOtT5lKFXYIkV4qnYQk52aq0.21xKUBYMCsyJkkAMZhelUqSzH9q19RuaLk2oUBSfIIjYTVi3HvqAZMDyTNr5EOavnbHDSD0zn8S.oX_dGTRzEEndW.1spVGsdj1VvHUdiA8sdKcmBzFyDGwbOjBIUTtoiudA.zIKCFkO6liYPLzhlg9yvhj2dt7wohnliv3nJ9RwDwShMHhFqCI3lXqvKiDehVcdsUlbldcZcqsTQIjsMwMLxTVWnR6JDDmBpsEJjIG1TwNbI5TPglfFsM2uDv_dpEb5F9jwdx3dJRjf2uE9Bv4PyYYn.N68fZQ_yAl8tYUgX6qiBYDod9aB8d8NtDaw8DQ7uc9InL_15wUwFLr6zDvkspWNMRkzRCMrrR5uPeobERP8ExpODW2yd2cClsg7BAJhP3pBZQw4BAVlnJV32jre3HBQHofHjN3TqXi9MN4hUVh7wfk9H2dE8CEbMBob9IgDEVFqQ_nrGnGBeBrQ5429SWnJ9OGQtsTcNTlM5KAfTbFvDKwQ9XQCVIdvH6G0DSK2UArb60DzuqDoNeUG_WhsO4KAdcMXNKRvXSjBkJmBbNIUKpnZ9uXMuCzkbe_fxMlVkNl907YowOe46bf5gh7JdaNP6ow0DdZY.VODOr_Mo_Nz9R0IUr8EvubX7VOgoX8Muy3L3APTCIdoq0yW5ZA0_ndpnT2hFb29yGs_KNbzUslkYxVPnH.R5FIERLMwm1cB3vEJkhhmJBaG2Mujnd_NsmWITxNGiqhLTA85rcWWHT2.k50KfLlICA1f3sgRTAG2KXHgLhTw5e0QF8lbUv0SwO8CcBtB.ZhYZxAuspWQtSy4nhRw6mbG6PV6iap.xYhGJ07bYqMKs.ZnViApjJSlkyEsovWHQMRNMdRtsJQ6WGXt_IYkjm3xvcw1oWpLzJXfZWdIvdZiyfg8siaoxzjBnEPrOCXVYBN1jcO5k8QHWHUawJ3m4RnVbivbO1GrrDwYKg64zltN_92buUC9dkhlRPMmIPYEKy7emgw_fkE.n7WJsywZG_XXKqzYDeWrZURim4VPTcHrSfNClj.4ta.ZKj51kbxZDdIMAQbojJTyNIUb1CkhN4ebMOoeiTmT44Yd8YPv9T4WWrmDlHPudExbBYk5TZzwL5D.a8xvyN0qizFs_wDoZLxy5C3NxgRWCve5jswkZrwwFj1sB3jag_iTsXCTYYLnm5PJMFYoZ_AGZcXRCf9QAU3iUWwIFnUrSpALSPd3O9E3jkreo_17wHgeuEa10LIJVtV5qPcdciwR0LZEk4paQqh5MQPruiMM30ukTkCHvF0fnvU0_6pwCyOA3IE_Np6WfQj6uxRbzugFWRMMnDNRpVOwLCoG2AOyyGwfO9W9OTMTA98YC_eXEaTtzXCpUZLAoH5y85MzCbSM514siSGCbBHsvCb9aZS4hzcU2hSeCS09ie.i1IFSN_IvJNagBu1tzvC7rT1tChf53ohOo0PC_Ymu2NhM1w.eijNyHmPf3.BWXcs5Etli5hSyKdQMejfZHtuXJx83PU79.5DOrTd4m.xo5EF1CrCnw6YON8thshmu8Xx_yGCVM1aVfhnIAsAn2cUXywY.wJzpJp1mGsEoUrtb7NfPeeCI6jv2C3BljZyWA',};var a = document.createElement('script');a.src = '/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page/v1?ray=9d445b80c9678736';window._cf_chl_opt.cOgUHash = location.hash === '' && location.href.indexOf('#') !== -1 ? '#' : location.hash;window._cf_chl_opt.cOgUQuery = location.search === '' && location.href.slice(0, location.href.length - window._cf_chl_opt.cOgUHash.length).indexOf('?') !== -1 ? '?' : location.search;if (window.history && window.history.replaceState) {var ogU = location.pathname + window._cf_chl_opt.cOgUQuery + window._cf_chl_opt.cOgUHash;history.replaceState(null, null,"\/doi\/10.2903\/j.efsa.2024.9128?__cf_chl_rt_tk=HJW_GyJUdY_IMvBkD.WiOLISUVAWQdyDz24eqxZYGBg-1772160445-1.0.1.1-BzAaOZdRPHVfao0__UDSHatxDBKl_MdCQ9825Kud4MU"+ window._cf_chl_opt.cOgUHash);a.onload = function() {history.replaceState(null, null, ogU);}}document.getElementsByTagName('head')[0].appendChild(a);}());</script></body></html>

thinking
**Exploring alternative EFSA access**
🌐 Searching the web...
🌐 Searched: efsa 9128 β-fructofuranosidase Saccharomyces cerevisiae CNCM I-3399

thinking
**Correcting query structure usage**
🌐 Searching the web...
🌐 Searched: efsa 9128 β-fructofuranosidase Saccharomyces cerevisiae CNCM I-3399

thinking
**Accessing FDA GRAS data**
🌐 Searching the web...
🌐 Searched the web

thinking
**Recognizing need for FDA search**
🌐 Searching the web...
🌐 Searched: FDA Inventory of Effective Food Contact Substance notifications and food additive status list 4 invertase opinion letters

thinking
**Planning dataset web scraping**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm' | rg -n 'Substances Added to Food|set=|EAFUS|GRAS|FDCC' | head -n 80" in /home/exedev/chewber succeeded in 598ms:
9:  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
318:						<td scope="col"><a href="?set=CEDI">Cumulative Estimated Daily Intake (CEDI)</a></td>
323:						<td scope="col"><a href="?set=FinalRules">Final Rules: Food Additives and Color Additives</a></td>
328:						<td scope="col"><a href="?set=FAP-CAP">Food Additive and Color Additive Petitions Under Review or Held in Abeyance</a></td>
333:						<td scope="col"><a href="?set=FCN-no-longer-effective">Food Contact Substance (FCS) Notifications that are No Longer Effective</a></td>
338:						<td scope="col"><a href="?set=GRASNotices">GRAS Notices</a></td>
343:						<td scope="col"><a href="?set=AnimalCellCultureFoods">Human Food Made with Cultured Animal Cells Inventory</a></td>
348:						<td scope="col"><a href="?set=FCN">Inventory of Effective Food Contact Substance (FCS) Notifications</a></td>
353:						<td scope="col"><a href="?set=ENV-FCN">Inventory of Environmental Impact Decisions for Food Contact Substance Notifications</a></td>
358:						<td scope="col"><a href="?set=IndirectAdditives">Inventory of Food Contact Substances Listed in 21 CFR</a></td>
363:						<td scope="col"><a href="?set=NewPlantVarietyConsultations">New Plant Variety Consultations</a></td>
368:						<td scope="col"><a href="?set=NewProteinConsultations">New Protein Consultations </a></td>
373:						<td scope="col"><a href="?set=Postmarket">Post-market Determinations that the Use of a Substance is not GRAS</a></td>
378:						<td scope="col"><a href="?set=GenomeEditedPlants">Premarket Meetings Regarding Food from Genome Edited Plants</a></td>
383:						<td scope="col"><a href="?set=ColorAdditives">Regulatory Status of Color Additives</a></td>
388:						<td scope="col"><a href="?set=SCOGS">SCOGS (Select Committee on GRAS Substances)</a></td>
393:						<td scope="col"><a href="?set=RecycledPlastics">Submissions on Post-Consumer Recycled (PCR) Plastics for Food-Contact Articles</a></td>
398:						<td scope="col"><a href="?set=FoodSubstances">Substances Added to Food <em>(formerly EAFUS)</em></a></td>
403:						<td scope="col"><a href="?set=TOR">Threshold of Regulation (TOR) Exemptions</a></td>
414:						<td scope="col"><a href="?set=contaminant-levels">Chemical Contaminants Transparency Tool </a></td>

thinking
**Inspecting form fields for queries**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances' | head -n 220" in /home/exedev/chewber succeeded in 920ms:

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3c.org/TR/1999/REC-html401-19991224/loose.dtd">
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml" xmlns:addthis="http://www.addthis.com/help/api-spec">
<head>
<!-- Google tag (gtag.js) --> <script async src=https://www.googletagmanager.com/gtag/js?id=G-TN15K4JY3W></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-TN15K4JY3W'); </script> 

  

  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<script src=https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=HHS&amp;subagency=FDA language="javascript" id="_fed_an_ua_tag"></script> 

  <script type="text/javascript" src="/scripts/includes/js/wcm.toggle.js"></script>
  <script type="text/javascript" src="/scripts/includes/js/ssajax_2012.js"></script>



  


thinking
**Locating search form inputs**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances' | rg -n 'form|input|name=\"|search|FoodSubstances|Submit|term|txt|query' | head -n 160" in /home/exedev/chewber succeeded in 1.09s:
21:  <title>Substances Added to Food <em>(formerly EAFUS)</em></title>
40:  <script type="text/javascript" src="/scripts/includes/js/js_jquery_142.js" language="JavaScript"></script>
75:      var usasearch_config = { siteHandle:"fda1" };
79:      script.src = "//search.usa.gov/javascripts/remote.loader.js";
93:  <meta name="dc.title" content="Substances Added to Food <em>(formerly EAFUS)</em>" />
94:  <meta name="dc.type" content="" />
95:  <meta name="dc.description" content="" />
96:  <meta name="dc.language" content="" />
97:  <meta name="posted" content="" />
98:  <meta name="Keywords" content="" />
99:  <meta name="Description" content="" />
100:  <meta name="dc.subject" content="" />
101:  <meta name="dc.publisher" content="" />
102:  <meta name="dc.audience" content="" />
103:  <meta name="dc.creator" content="" />
104:  <meta name="search_topic" content=""/>
105:  <meta name="google-site-verification" content="wxQkNTrqmvYnwVcNzA2mspBp7EDErzIhAzyX-YvvRWI" />
109:	<link rel="stylesheet" href="css/jquery-ui.css" />
111:	<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
112:	<script type="text/javascript" src="js/jquery-ui.js"></script>

thinking
**Testing URL query parameters**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&type=basic&search=invertase' | rg -n -i 'INVERTASE|No records|set=FoodSubstances&id=|GRAS|21 CFR|Type of Regulation|Search returned' | head -n 120" in /home/exedev/chewber succeeded in 1.13s:
288:        <li><a href="https://www.fda.gov/food/food-ingredients-packaging">Ingredients and Packaging</a></li><li><a href="https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-inventories">Food Ingredient and Packaging Inventories</a></li><li><a href="index.cfm?set=FoodSubstances">Substances Added to Food <em>(formerly EAFUS)</em></a></li><li><a href="?order=ASC&set=FoodSubstances&search=invertase&cat=&sort=Sortterm%5FID&startRow=1&type=basic">Original Search Results</a></li>
315:			window.location = "?set=FoodSubstances&sort="+colID+"&order="+sortOrder+"&type=basic&search=invertase";
373:<li>Food additives and color additives that are listed in FDA regulations (21 CFR Parts 172, 173 and Parts 73, 74, 82 respectively), and flavoring substances evaluated by FEMA* and JECFA*. 
375:Note that for a substance to be used as a color additive in the US, it must be authorized by a regulation in 21 CFR Part 73, 74, or 82.</li></ul></li>
376:<li>Generally Recognized as Safe (“GRAS”) substances that are listed in FDA regulations (21 CFR Parts 182 and 184).</li> 
377:<li>Substances approved for specific uses in foods prior to September 6, 1958, known as prior-sanctioned substances (21 CFR Part 181). </li>
380:<li>Prohibited substances that are listed in FDA regulations (21 CFR Part 189) as prohibited from use in food (labeled as "PROHIBITED" or "PROHIBITED WITH EXCEPTIONS").</li>
381:<li>Delisted color additives in FDA regulations (21 CFR 81.10 and/or 81.30) (labeled as "DELISTED").</li>
382:<li> Some substances "no longer FEMA GRAS"</li></ul></li>
392:<li>Most substances listed in the inventory of <a href="https://www.accessdata.fda.gov/scripts/fdcc/?set=GRASNotices">GRAS Notices</a>.</li>
558:				if (formObj.refineSearch.checked) formObj.action='?set=FoodSubstances&sort=Sortterm_ID&order=ASC&'+display+'&type=basic&type2='+type+'&search=invertase&search2='+search;
719:			<input type="text" name="searchFor" id="searchForBas" size="50" value="invertase" title="Enter search keywords here." onKeyPress="return submitEnter(this.form,event);"/>
761:						<option value="21 CFR¤VARCHAR" >21 CFR </option>
769:						<option value="21 CFR¤VARCHAR" >21 CFR *</option>
771:						<option value="FEMA GRAS Pub. No.¤VARCHAR" >FEMA GRAS Pub. No. *</option>
816:										window.location = '/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE';
820:										window.location = '/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE';
824:										window.location = '/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=';
828:										window.location = '/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=';
832:										window.location = '/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=';

thinking
**Planning detail page parsing**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE' | rg -n -i 'INVERTASE|Regulatory Status|Type of Regulation|GRAS|21 CFR|Opinion Letter|Code|Used for|effective|Conditions|Saccharomyces cerevisiae|technical effect|Year' | head -n 120" in /home/exedev/chewber succeeded in 885ms:
56:  <!-- ## ADDED submenus Javascript reference to import code to handle displaying sub-menus when hovered over ## -->
65:  <!-- ## ADDED resize Javascript to handle text resize (ultimtely calls the FDA resize code) ## -->
248:                  script.src=location.protocol+'//'+MP.Domains[lang]+'/'+MP.SrcLang+lang+'/?1023749632;'+encodeURIComponent(MP.SrcUrl);
252:                  script.src=location.protocol+'//'+MP.Domains[MP.UrlLang]+'/'+MP.SrcLang+MP.UrlLang+'/?1023749634;'+encodeURIComponent(location.href);
285:        <li><a href="https://www.fda.gov/food/food-ingredients-packaging">Ingredients and Packaging</a></li><li><a href="https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-inventories">Food Ingredient and Packaging Inventories</a></li><li><a href="index.cfm?set=FoodSubstances">Substances Added to Food <em>(formerly EAFUS)</em></a></li><li><a href="?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE">INVERTASE FROM SACCHAROMYCES CEREVISIAE</a></li>
313:					 INVERTASE FROM SACCHAROMYCES CEREVISIAE 
342:												INVERTASE FROM SACCHAROMYCES CEREVISIAE
352:												&diams; INVERTASE, SACCHAROMYCES CEREVISIAE
359:											<th nowrap="nowrap">Used for*<sup>&dagger;</sup> (Technical Effect):</th>
374:<ul><li><strong>CAS Reg. No. (or other ID)</strong>: Chemical Abstract Service (CAS) Registry Number&reg; for the substance or a numerical code assigned by HFP to those substances that do not have a CAS Registry Number (977nnn-nn-n series).</li>
377:<li><strong>Used for<sup>&dagger;</sup> (Technical Effect)</strong>: The physical or technical effect(s) the substance has in or on food; see <a href="https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfCFR/CFRSearch.cfm?fr=170.3">21 CFR 170.3(o)</a> for definitions. </li>
379:<li><strong>21 CFR</strong>: Title 21 of the Code of Federal Regulations.</li>
380:<li><strong>FEMA No.</strong>: The trade association, Flavor and Extract Manufacturers Association (FEMA), has established expert panels to evaluate and make independent determinations on the GRAS status of flavoring substances.  The FEMA number is provided here as a reference to FEMA’s GRAS assessments. 
381:<ul><li>The <strong>GRAS Pub. No.</strong> is the FEMA GRAS&trade; publication number.</li>
383:<li> <strong>NLFG</strong> is no longer FEMA GRAS&trade;.</li>
384:<li> For more information about FEMA GRAS, see <a href="http://femaflavor.org/gras">About the FEMA GRAS&trade; Program</a> <a title="Disclaimer Icon" href="https://www.fda.gov/about-fda/website-policies/website-disclaimer">&lt;<span aria-hidden="true" class="fa fa-external-link"><span class="sr-only">External Link Disclaimer</span></span>&gt;
391:<ul><li>For a substance to be used as a color additive in the US, it must be authorized by a regulation in 21 CFR Part 73, 74, or 82.</li></ul>

thinking
**Investigating uncaptured table fields**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE' | sed -n '330,372p'" in /home/exedev/chewber succeeded in 932ms:
											<td>
												
												977122-97-6
											</td>
										</tr>
										
										
										
										<tr valign="top" class="none">
											<th nowrap="nowrap">Substance*:</th>
											<td>
												
												INVERTASE FROM SACCHAROMYCES CEREVISIAE
											</td>
										</tr>
										
										
										
										<tr valign="top" class="none">
											<th nowrap="nowrap">Other Names:</th>

thinking
**Evaluating field placement**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE' | sed -n '300,340p'" in /home/exedev/chewber succeeded in 883ms:
<!--==== END Topic Page Title ==== -->
<!--==== BEGIN Breadcrumbs ==== -->
<!--==== END Breadcrumbs ==== -->
<!--==== BEGIN LEFT-COLUMN PAGE CONTENT ==== -->


<span id="user_provided"> 
<div id="PageContent">
	<div id="detailContent">
		

			<div id="detailTitle">
				<h1 class="h1">
					 INVERTASE FROM SACCHAROMYCES CEREVISIAE 
				</h1>
				
			</div>

			<div class="prePostText">
				

thinking
**Planning regulatory data extraction**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/cfc/XMLService.cfm?method=downloadxls&set=FoodSubstances' -o /tmp/fda_foodsubstances.xls && rg -n -i 'INVERTASE FROM SACCHAROMYCES CEREVISIAE|INVERTASE' /tmp/fda_foodsubstances.xls | head -n 20" in /home/exedev/chewber succeeded in 3.77s:
1686:" 977122-97-6"," INVERTASE FROM SACCHAROMYCES CEREVISIAE"," &diams; INVERTASE, SACCHAROMYCES CEREVISIAE"," ENZYME,<br /> PROCESSING AID,<br /> STABILIZER OR THICKENER",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

thinking
**Inspecting dataset header for clarity**
codex
I confirmed the FDA “Substances Added to Food” record for invertase and extracted its CAS and technical effects. I’m now checking the downloadable FDA table headers/columns to determine whether a CFR citation exists for this specific entry or if CFR fields are blank.
exec
/bin/bash -lc "sed -n '1,35p' /tmp/fda_foodsubstances.xls" in /home/exedev/chewber succeeded in 51ms:
Downloaded from FDA Substances Added to Food <em>(formerly EAFUS)</em>; http://hfpappexternal.fda.gov/scripts/fdcc/?set=FoodSubstances; Last updated 2/24/2026; downloaded 2/26/2026.

"It is important to note that the inventory is only a partial list of food ingredients. Inclusion in this inventory of information from non-FDA entities does not indicate an FDA approval or evaluation of this use.  Always check the FDA regulations."

CAS Reg No (or other ID),Substance,Other Names,Used for (Technical Effect),Reg col01,Reg col02,Reg col03,Reg col04,Reg col05,Reg col06,Reg add01,Reg add02,Reg add03,Reg add04,Reg add05,Reg add06,Reg add07,Reg add08,Reg add09,Reg add10,Reg add11,Reg add12,Reg add13,Reg add14,Reg add16,Reg add17,Reg add18,Reg add19,Reg add20,Reg prohibited189,Reg Administrative,regs Labeling & Standards ,FEMA No,GRAS Pub No,Most Recent GRAS Pub Update,FEMA status,JECFA Flavor Number
" 879496-95-4"," ACAI BERRY EXTRACT"," &diams; ACAI BERRY EXTRACT<br />&diams; euterpe oleracea, ext."," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4547"),=T("24"),,,
" 55589-62-3"," ACESULFAME POTASSIUM"," &diams; POTASSIUM ACESULFAME<br />&diams; ACESULFAME K<br />&diams; POTASSIUM 6-METHYL-1,2,3-OXATHIAZIN-4(3H)-ONE 2,2-DIOXIDE<br />&diams; ACESULFAME POTASSIUM<br />&diams; 1,2,3-OXATHIAZIN-4(3H)-ONE, 6-METHYL-, 2,2-DIOXIDE, POTASSIUM SALT<br />&diams; ACESULFAME-K<br />&diams; ACESULFAM-K"," NON-NUTRITIVE SWEETENER",,,,,,,=T("172.800"),,,,,,,,,,,,,,,,,,,,,,,,,,
" 105-57-7"," ACETAL"," &diams; ACETAL<br />&diams; 1,1-DIETHOXYETHANE<br />&diams; DIETHYL ACETAL ACETALDEHYDE<br />&diams; ACETALDEHYDE DIETHYL ACETAL<br />&diams; ETHYLIDENE DIETHYL ETHER<br />&diams; ETHANE, 1,1-DIETHOXY-<br />&diams; ACETALDEHYDE, DIETHYL ACETAL"," FLAVOR ENHANCER,<br /> FLAVORING AGENT OR ADJUVANT",,,,,,,=T("172.515"),,,,,,,,,,,,,,,,,,,,,,=T("2002"),=T("3"),,,=T("941")
" 75-07-0"," ACETALDEHYDE"," &diams; ACETALDEHYDE<br />&diams; ACETIC ALDEHYDE<br />&diams; ETHANAL<br />&diams; ACETIC ETHANOL<br />&diams; ETHYL ALDEHYDE"," FLAVORING AGENT OR ADJUVANT",,,,,,,=T("177.2410"),=T("182.60"),,,,,,,,,,,,,,,,,,,,,=T("2003"),=T("3"),=T("25"),,=T("80")
" 64577-91-9"," ACETALDEHYDE, BUTYL PHENETHYL ACETAL"," &diams; ACETALDEHYDE BUTYL PHENETHYL ACETAL<br />&diams; BENZENE, (2-(1-BUTOXYETHOXY)ETHYL)-<br />&diams; (2-(1-BUTOXYETHOXY)ETHYL)BENZENE<br />&diams; 2-BUTOXY-2-PHENYLETHOXYETHANE"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("3125"),=T("4"),,,=T("1001")
" 63449-64-9"," ACETALDEHYDE DI-CIS-3-HEXENYL ACETAL"," &diams; ACETALDEHYDE DI-CIS-3-HEXENYL ACETAL<br />&diams; 3-hexene, 1,1'-(ethylidenebis(oxy))bis-, (3Z,3'Z)-<br />&diams; 1,1'-(ethylidenebis(oxy))bis(3-hexene), (3Z,3'Z)-<br />&diams; 1,1'-(ethylidenebis(oxy))bis(3-hexene), (Z,Z)-<br />&diams; InChI=1S/C14H26O2/c1-4-6-8-10-12-15-14(3)16-13-11-9-7-5-2/h6-9,14H,4-5,10-13H2,1-3H3/b8-6-,9-7-<br />&diams; InChIKey: KCPFRJBAXWUXIG-VRHVFUOLSA-N"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4381"),=T("23"),,,=T("1747")
" 13002-09-0"," ACETALDEHYDE DIISOAMYL ACETAL"," &diams; ACETALDEHYDE DIISOAMYL ACETAL<br />&diams; butane, 1,1'-(ethylidenebis(oxy))bis(3-methyl-<br />&diams; acetaldehyde, diisopentyl acetal<br />&diams; 1,1-bis(isopentyloxy)ethane<br />&diams; 3-methyl-1-(1-(3-methylbutoxy)ethoxy)butane"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4024"),=T("21"),,,=T("1729")
" 5669-09-0"," ACETALDEHYDE DI-ISOBUTYLACETAL"," &diams; ACETALDEHYDE DI-ISOBUTYLACETAL<br />&diams; propane,1,1'-(ethylidenebis(oxy))bis(2-methyl-<br />&diams; 1,1'-(ethylidenebis(oxy))bis(2-methylpropane)<br />&diams; acetaldehyde, diisobutyl acetal<br />&diams; ethane,1,1-diisobutoxy-<br />&diams; 1,1-diisobutoxyethane<br />&diams; InChI=1S/C10H22O2/c1-8(2)6-11-10(5)12-7-9(3)4/h8-10H,6-7H2,1-5H3<br />&diams; InChIKey: KIELJSVPUISYCI-UHFFFAOYSA-N"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4527"),=T("24"),,,
" 28069-74-1"," ACETALDEHYDE ETHYL CIS-3-HEXENYL ACETAL"," &diams; ACETALDEHYDE ETHYL CIS-3-HEXENYL ACETAL<br />&diams; ACETALDEHYDE, ETHYL 3-HEXENYL ACETAL, (Z)-<br />&diams; ETHYL CIS-3-HEXENYL ACETAL<br />&diams; ETHANE, 1-ETHOXY-1-(3-HEXENYLOXY)-, (Z)-<br />&diams; 3-HEXENE, 1-(1-ETHOXYETHOXY)-, (Z)-<br />&diams; 1-(1-ETHOXYETHOXY)-3-HEXENE, (Z)-<br />&diams; 1-ETHOXY-1-(3-HEXENYLOXY)ETHANE, (Z)-"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("3775"),=T("16"),,,=T("943")
" 6986-51-2"," ACETALDEHYDE ETHYL ISOBUTYL ACETAL"," &diams; ACETALDEHYDE ETHYL ISOBUTYL ACETAL<br />&diams; propane, 1-(1-ethoxyethoxy)-2-methyl-<br />&diams; 1-(1-ethoxyethoxy)-2-methylpropane<br />&diams; acetaldehyde, ethyl isobutyl acetal<br />&diams; ethane, 1-ethoxy-1-isobutoxy-<br />&diams; 1-ethoxy-1-isobutoxyethane<br />&diams; InChI=1S/C8H18O2/c1-5-9-8(4)10-6-7(2)3/h7-8H,5-6H2,1-4H3<br />&diams; InChIKey: YEKSEJHZJGHKBN-UHFFFAOYSA-N"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4528"),=T("24"),,,
" 25334-93-4"," (+/-)-ACETALDEHYDE ETHYL ISOPROPYL ACETAL"," &diams; 2-(1-ETHOXY)ETHOXYPROPANE<br />&diams; propane, 2-(1-ethoxyethoxy)-<br />&diams; 2-(1-ethoxyethoxy)propane<br />&diams; acetaldehyde, ethyl isopropyl acetal<br />&diams; ethyl isopropyl acetal acetaldehyde<br />&diams; ethane, 1-ethoxy-1-isopropoxy<br />&diams; 1-ethoxy-1-isopropoxyethane<br />&diams; acetaldehyde ethyl isopropyl acetal"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4432"),=T("24"),,,
" 233665-90-2"," ACETALDEHYDE HEXYL ISOAMYL ACETAL"," &diams; ACETALDEHYDE HEXYL ISOAMYL ACETAL<br />&diams; hexane, 1-(1-(3-methylbutoxy)ethoxy)-<br />&diams; 1-(1-(3-methoxybutoxy)ethoxy)hexane"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4365"),=T("23"),,,=T("1727")
" 202188-43-0"," ACETALDEHYDE 1,3-OCTANEDIOL ACETAL"," &diams; ACETALDEHYDE 1,3-OCTANEDIOL ACETAL<br />&diams; InChI=1S/C10H20O2/c1-3-4-5-6-10-7-8-11-9(2)12-10/h9-10H,3-8H2,1-2H3<br />&diams; InChIKey: NZTUUEJEMACERX-UHFFFAOYSA-N<br />&diams; 1,3-dioxolane, 2-methyl-4-pentyl-<br />&diams; 2-methyl-4-pentyl-1,3-dioxolane"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,,=T("4376"),=T("23"),,,=T("1749")
" 7493-57-4"," ACETALDEHYDE PHENETHYL PROPYL ACETAL"," &diams; ACETALDEHYDE PHENETHYL PROPYL ACETAL<br />&diams; ACETAL R<br />&diams; (2-(1-PROPOXYETHOXY)ETHYL)BENZENE<br />&diams; BENZENE, (2-(1-PROPOXYETHOXY)ETHYL)-<br />&diams; ACETALDEHYDE, PHENETHYL PROPYL ACETAL<br />&diams; PEPITAL<br />&diams; PROPYL PHENETHYL ACETAL<br />&diams; PHENETHYL PROPYL ACETAL<br />&diams; 1-PHENETHOXY-1-PROPOXYETHANE"," FLAVOR ENHANCER,<br /> FLAVORING AGENT OR ADJUVANT",,,,,,,=T("172.515"),,,,,,,,,,,,,,,,,,,,,,=T("2004"),=T("3"),=T("25"),,=T("1000")
" 60-35-5"," ACETAMIDE--NLFG"," &diams; ACETAMIDE<br />&diams; ETHANAMIDE<br />&diams; InChI=1S/C2H5NO/c1-2(3)4/h1H3,(H2,3,4)<br />&diams; InChIKey: DLFVBJFMPXGRIB-UHFFFAOYSA-N"," FLAVORING AGENT OR ADJUVANT",,,,,,,,,,,,,,,,,,,,,,,,,,,,," NLFG-4251",=T("22"),=T("24")," No longer FEMA GRAS (GRAS Pub. 24, 2009)",

thinking
**Parsing FDA data and FDA page for invertase status**
exec
/bin/bash -lc "curl -sL 'https://www.fda.gov/food/food-additives-petitions/partial-list-food-additives-status-pending-further-study' -o /tmp/fda_partial_list.html && rg -n -i 'invertase|table 4|opinion letter|GRAS|without corresponding regulations|saccharomyces' /tmp/fda_partial_list.html | head -n 120" in /home/exedev/chewber succeeded in 207ms:


thinking
**Checking page head for issues**
exec
/bin/bash -lc "curl -sL 'https://www.fda.gov/food/food-additives-petitions/partial-list-food-additives-status-pending-further-study' | head -n 40" in /home/exedev/chewber succeeded in 499ms:
<!DOCTYPE html><html lang="en"><head><title>Page Not Found | FDA</title><link rel="stylesheet" href="/themes/custom/preview/css/style.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script type="text/javascript" src="/core/misc/drupal.js"></script><script type="text/javascript" src="/themes/custom/preview/js/bootstrap/collapse.js"></script><script type="text/javascript" src="/themes/custom/preview/js/custom.js"></script><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1"><style></style></head><body><header class="lcds-header container-fluid" role="header"><div class="row us-masthead"><div class="usa-banner col-xs-12"><img class="usa-banner__us-flag" src="/themes/custom/preview/assets/images/US_Flag.png" alt="U.S. flag"><span>An official website of the United States government</span><a id="USMenuButton" class="collapsed" data-toggle="collapse" data-target="#USABannerMenu" aria-expanded="false" aria-controls="USABannerMenu">Here’s how you know<span class="toggle-indicator"></span></a><div class="col-xs-12 collapse usa-banner__menu" id="USABannerMenu" aria-labelledby="USMenuButton"><div id="gov-banner" class="row usa-banner-content usa-grid usa-accordion-content" aria-hidden="true"><div class="col-xs-12 col-sm-6 col-md-3"><img class="usa-banner-icon usa-media_block-img" src="/themes/custom/preview/assets/images/icon-dot-gov.svg" alt="Dot gov" style="width:3em"><div class="usa-media_block-body"><p><strong>The .gov means it’s official.</strong><br>Federal government websites often end in .gov or .mil. Before sharing sensitive information, make sure you're on a federal government site.</p></div></div><div class="col-xs-12 col-sm-6 col-md-3"><img class="usa-banner-icon usa-media_block-img" src="/themes/custom/preview/assets/images/icon-https.svg" alt="SSL" style="width:3em"><div class="usa-media_block-body"><p><strong>The site is secure.</strong><br>The<strong>https://</strong>ensures that you are connecting to the official website and that any information you provide is encrypted and transmitted securely.</p></div></div></div></div></div></div><div class="row fda-masthead"><div class="col-xs-4 col-md-8 fda-masthead__fda-logo"><a href="/" title="FDA Homepage"><picture><source media="(min-width:992px)" srcset="/themes/custom/preview/assets/images/gov-fda-new-white.svg"><img src="/themes/custom/preview/assets/images/FDA_Logo_Icon_White.svg" height="40px" alt="Food and Drug Administration Logo"></picture></a></div><div class="col-xs-8 col-md-4"><ul class="fda-masthead__item-list"><li><button title="" id="btn-search" class="btn btn-default btn-sm fda-masthead__btn-search" data-toggle="collapse"><span class="fa fa-search" aria-hidden="true">&nbsp;</span><span class="fda-masthead__btn-label">Search</span></button></li><li><button id="menu-btn" class="btn btn-default btn-sm fda-masthead__btn-menu collapsed" href="#primary-nav" data-toggle="collapse" aria-expanded="true"><span class="fa fa-bars" aria-hidden="true">&nbsp;</span><span class="fda-masthead__btn-label">Menu</span></button></li></ul></div><form class="fda-masthead__search sr-only" role="search" action="/search" method="GET" name="searchForm" id="search-form" accept-charset="UTF-8"><div class="search-popover" id="search-popover"><div class="input-group pull-right" id="search-group"><label class="sr-only" for="search-query">Search FDA</label><input class="form-control search-input" id="search-query" name="s" aria-autocomplete="list" aria-haspopup="true" title="Enter the terms you wish to search for." placeholder="Search FDA" type="text"><span class="input-group-btn" id="input-group-btn"><button type="submit" class="btn btn-danger search-btn" id="search-btn" title="Search"><span class="fa fa-search" aria-hidden="true"><span class="sr-only">Submit search</span></span></button></span></div></div></form></div><nav id="primary-nav" class="lcds-primary-nav row collapse"><div class="col-md-5 col-lg-4"><section class="lcds-primary-nav__group lcds-primary-nav__group--bordered"><h2 class="lcds-primary-nav__group-heading">Featured</h2><ul class="lcds-primary-nav__list lcds-primary-nav__list--featured"><li class="lcds-primary-nav__list-item"><a href="/about-fda/contact-fda">Contact FDA</a></li><li class="lcds-primary-nav__list-item"><a href="/regulatory-information/search-fda-guidance-documents">FDA Guidance Documents</a></li><li class="lcds-primary-nav__list-item"><a href="/safety/recalls-market-withdrawals-safety-alerts">Recalls, Market Withdrawals and Safety Alerts</a></li><li class="lcds-primary-nav__list-item"><a href="/news-events/newsroom/press-announcements">Press Announcements</a></li><li class="lcds-primary-nav__list-item"><a href="/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters">Warning Letters</a></li><li class="lcds-primary-nav__list-item"><a href="/advisory-committees">Advisory Committees</a></li><li class="lcds-primary-nav__list-item"><a href="/about-fda/en-espanol">En Español</a></li></ul></section></div><div class="col-md-7 col-lg-8"><section class="lcds-primary-nav__group lcds-primary-nav__group--bordered"><h2 class="lcds-primary-nav__group-heading">Products</h2><ul class="lcds-primary-nav__list"><li class="lcds-primary-nav__list-item"><a href="/food">Food</a></li><li class="lcds-primary-nav__list-item"><a href="/drugs">Drugs</a></li><li class="lcds-primary-nav__list-item"><a href="/medical-devices">Medical Devices</a></li><li class="lcds-primary-nav__list-item"><a href="/radiation-emitting-products">Radiation-Emitting Products</a></li><li class="lcds-primary-nav__list-item"><a href="/vaccines-blood-biologics">Vaccines, Blood, and Biologics</a></li><li class="lcds-primary-nav__list-item"><a href="/animal-veterinary">Animal and Veterinary</a></li><li class="lcds-primary-nav__list-item"><a href="/cosmetics">Cosmetics</a></li><li class="lcds-primary-nav__list-item"><a href="/tobacco-products">Tobacco Products</a></li></ul></section><section class="lcds-primary-nav__group lcds-primary-nav__group--bordered"><h2 class="lcds-primary-nav__group-heading">Topics</h2><ul class="lcds-primary-nav__list"><li class="lcds-primary-nav__list-item"><a href="/about-fda">About FDA</a></li><li class="lcds-primary-nav__list-item"><a href="/combination-products">Combination Products</a></li><li class="lcds-primary-nav__list-item"><a href="/regulatory-information">Regulatory Information</a></li><li class="lcds-primary-nav__list-item"><a href="/safety">Safety</a></li><li class="lcds-primary-nav__list-item"><a href="/emergency-preparedness-and-response">Emergency Preparedness</a></li><li class="lcds-primary-nav__list-item"><a href="/international-programs">International Programs</a></li><li class="lcds-primary-nav__list-item"><a href="/news-events">News and Events</a></li><li class="lcds-primary-nav__list-item"><a href="/training-and-continuing-education">Training and Continuing Education</a></li><li class="lcds-primary-nav__list-item"><a href="/inspections-compliance-enforcement-and-criminal-investigations">Inspections and Compliance</a></li><li class="lcds-primary-nav__list-item"><a href="/science-research">Science and Research</a></li></ul></section><section class="lcds-primary-nav__group lcds-primary-nav__group--bordered"><h2 class="lcds-primary-nav__group-heading">Information For</h2><ul class="lcds-primary-nav__list"><li class="lcds-primary-nav__list-item"><a href="/consumers">Consumers</a></li><li class="lcds-primary-nav__list-item"><a href="/patients">Patients</a></li><li class="lcds-primary-nav__list-item"><a href="/industry">Industry</a></li><li class="lcds-primary-nav__list-item"><a href="/health-professionals">Health Professionals</a></li><li class="lcds-primary-nav__list-item"><a href="/federal-state-local-tribal-and-territorial-officials">Federal, State and Local Officials</a></li></ul></section></div></nav></header><main><article id="main-content" class="article main-content container-fluid" role="article"><header class="row content-header" role="heading"><section id="block-entityviewcontent-2" class="contextual-region block block-ctools block-entity-viewnode clearfix" data-block-plugin-id="entity_view:node"><div class="col-sm-12 col-md-8 col-md-offset-2"><h1 class="content-title text-center">Page Not Found</h1></div></section></header><div class="col-md-8 col-md-push-2" role="main"><p>We’re sorry. The page you are looking for is not available for one of the following reasons.</p><ul><li>The link to this page may not be correct or is out-of-date.</li><li>You have bookmarked a page that has moved.</li></ul><p>Try one of these options:</p><p><a class="btn btn-primary bottom-margin" href="/search" role="button">Search FDA.gov</a>&nbsp;<a class="btn btn-primary bottom-margin" href="/about-fda/about-website/fdagov-archive" role="button">Check the FDA Archive</a>&nbsp;<a class="btn btn-primary bottom-margin" href="/about-fda/contact-fda" role="button">Contact FDA</a></p><hr><p>Or try one of these helpful links to FDA topics:</p><div class="inset-column"><div class="row"><div class="col-sm-6"><ul style="margin-bottom:.5rem"><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="96b51152-5d6e-440f-ab97-fdd7c8d60fa5" href="/home" title="U.S. Food and Drug Administration">FDA.gov Homepage</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="27682501-ce57-46f6-bdcc-ed03ab7edfac" href="/food" title="Food">Food</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="fa2ee775-8209-43d2-8376-3afcbc455f15" href="/drugs" title="Drugs">Human Drugs</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="ee788d26-dc06-4edf-93cc-e9c219f3f170" href="/medical-devices" title="Medical Devices">Medical Devices</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="c6685181-def7-416a-b475-6185aa07ad1c" href="/radiation-emitting-products" title="Radiation-Emitting Products">Radiation-Emitting Products</a></li></ul></div><div class="col-sm-6"><ul><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="5b7a634d-387f-42ab-b882-955e64ae93d7" href="/vaccines-blood-biologics" title="Vaccines, Blood &amp; Biologics">Vaccines, Blood, and Biologics</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="01791ea7-9acc-4811-9a6b-47fc24b35c19" href="/animal-veterinary" title="Animal &amp; Veterinary">Animal and Veterinary</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="c725151b-4a47-47f7-ab63-6598893922f5" href="/cosmetics" title="Cosmetics">Cosmetics</a></li><li><a data-entity-substitution="canonical" data-entity-type="node" data-entity-uuid="4d36e2ba-1dcb-421b-a1b5-a09969a2aaba" href="/tobacco-products" title="Tobacco Products">Tobacco Products</a></li></ul></div></div></div></div></article></main><footer class="lcds-footer container-fluid"><div class="row lcds-footer__primary"><h2 id="footer-heading" class="sr-only">Footer Links</h2><nav class="text-center"><div class="col-sm-4"><ul class="nav"><li><a href="/about-fda/about-website/fdagov-archive">FDA Archive</a></li><li><a href="/about-fda">About FDA</a></li><li><a href="/about-fda/about-website/internet-accessibility">Accessibility</a></li></ul></div><div class="col-sm-4"><ul class="nav"><li><a href="/about-fda/visitor-information">Visitor Information</a></li><li><a href="/about-fda/about-website/website-policies">Website Policies / Privacy</a></li><li><a href="/about-fda/jobs-and-training-fda/no-fear-act">No FEAR Act</a></li><li><a href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html">Vulnerability Disclosure Policy</a></li></ul></div><div class="col-sm-4"><ul class="nav"><li><a href="/regulatory-information/freedom-information" title="Freedom of Information Act">FOIA</a></li><li><a href="https://www.hhs.gov/" title="Health and Human Services" target="_blank">HHS.gov</a></li><li><a href="https://www.usa.gov/" target="_blank">USA.gov</a></li></ul></div></nav></div><div class="row lcds-footer__secondary"><div class="col-sm-12 col-md-6 col-lg-4 lcds-footer__social-links"><a href="/about-fda/contact-fda" class="btn btn-default btn-md">Contact FDA</a><a href="https://www.facebook.com/FDA" title="Follow FDA on Facebook" class="no-disclaimer"><span class="fa fa-facebook fa-2x" aria-hidden="true"><span class="sr-only">Follow FDA on Facebook</span></span></a><a href="https://x.com/US_FDA" title="Follow FDA on X" class="no-disclaimer"><svg class="icon-svg-inline fa-2x" aria-hidden="true"><use href="/themes/custom/preview/assets/images/fa-icons.svg#icon-x-twitter"></use></svg><span class="sr-only">Follow FDA on X</span></a><a href="https://instagram.com/FDA" title="Follow FDA on Instagram" class="no-disclaimer"><span class="fa fa-instagram fa-2x" aria-hidden="true"><span class="sr-only">Follow FDA on Instagram</span></span></a><br class="visible-xs-inline"><a href="https://www.linkedin.com/company/fda/" title="Follow FDA on LinkedIn" class="no-disclaimer"><span class="fa fa-linkedin fa-2x" aria-hidden="true"><span class="sr-only">Follow FDA on LinkedIn</span></span></a><a href="https://youtube.com/@US_FDA" title="View FDA videos on YouTube" class="no-disclaimer"><span class="fa fa-youtube fa-2x" aria-hidden="true"><span class="sr-only">View FDA videos on YouTube</span></span></a><a href="/about-fda/contact-fda/subscribe-podcasts-and-news-feeds" title="Subscribe to FDA RSS feeds"><span class="fa fa-rss fa-2x" aria-hidden="true"><span class="sr-only">Subscribe to FDA RSS feeds</span></span></a></div><a href="/" title="FDA Homepage"><div class="visible-lg-block col-lg-4 text-center lcds-footer__logo"><img src="/themes/custom/preview/assets/images/FDA_Logo_Icon_White.svg" height="50px" alt="Food and Drug Administration Logo"></div></a><div class="col-sm-12 col-md-6 col-lg-4 text-center lcds-footer__contact-number"><span class="fa fa-phone" aria-hidden="true"></span><span class="sr-only">Contact Number</span>1-888-INFO-FDA (1-888-463-6332)</div></div></footer><a href="" id="btn-top" class="btn btn-primary btn-top show"><span class="sr-only">Back to</span>Top</a><script type="text/javascript"  src="/-443SdM2e_KQnRDVlQ/w9awDwhVXrV2wG/PQEuH2M/HgFuB/CFYB0QB"></script></body></html>

thinking
**Planning GRAS status extraction**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=GRASNotices&type=basic&search=invertase' | rg -n -i 'invertase|GRN|No questions|View details|set=GRASNotices&id=' | head -n 120" in /home/exedev/chewber succeeded in 983ms:
288:        <li><a href="https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras">Generally Recognized as Safe </a></li><li><a href="https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-inventories">Food Ingredient & Packaging Inventories</a></li><li><a href="index.cfm?set=GRASNotices">GRAS Notices</a></li><li><a href="?order=DESC&set=GRASNotices&search=invertase&cat=&sort=GRN%5FNo&startRow=1&type=basic">Original Search Results</a></li>
314:			sortOrder = (colID == 'GRN_No' && 'DESC' == 'ASC' ? 'DESC' : 'ASC' );
315:			window.location = "?set=GRASNotices&sort="+colID+"&order="+sortOrder+"&type=basic&search=invertase";
372:<p>The inventory notes what type of response letter the FDA sent in response to the notice. Notifiers often resubmit notices that FDA previously ceased to evaluate at the notifier’s request, and resubmitted notices commonly receive a letter indicating FDA has no questions, after addressing deficiencies. In the inventory, entries for notices that were later resubmitted link to the newer entry in the final column. Newer entries for notices that were resubmitted include a link to the previous submission below the substance name. </p>
374:<p>Some GRNs that FDA previously ceased to evaluate at the notifier’s request were later resubmitted as a food additive petition. For each of these cases, the GRN detail page links to the food additive petition.</p>
394:<li>Select the specific GRN number below to view additional details about any GRAS Notice.</li>
585:				if (formObj.refineSearch.checked) formObj.action='?set=GRASNotices&sort=GRN_No&order=DESC&'+display+'&type=basic&type2='+type+'&search=invertase&search2='+search;
586:				else formObj.action='?set=GRASNotices&sort=GRN_No&order=DESC&'+display+'&type='+type+'&search='+search;
746:			<input type="text" name="searchFor" id="searchForBas" size="50" value="invertase" title="Enter search keywords here." onKeyPress="return submitEnter(this.form,event);"/>
790:						<option value="GRN No.¤DECIMAL" >GRN No. </option>
802:						<option value="Related GRN¤DECIMAL" >Related GRN *</option>
855:										<a href="javascript:void(0);" onclick="sortCols('GRN_No');return false;" title="Click to sort by GRN No.">GRN No.</a>
880:										<a href="javascript:void(0);" onclick="sortCols('Resubmitted');return false;" title="Click to sort by Resubmitted as GRN No.">Resubmitted as GRN No.</a>
900:												<a href="?set=GRASNotices&id=1173&sort=GRN_No&order=DESC&startrow=1&type=basic&search=invertase">Invertase enzyme preparation produced by <i>Trichoderma reesei</i> expressing a gene for invertase from <i>Aspergillus niger</i></a><br /> &nbsp;&nbsp;&nbsp;<span style="font-size:85%;">(Resubmission of GRN         <a aria-label="New Window" href="https://www.cfsanappsexternal.fda.gov/scripts/fdcc/index.cfm?set=GRASNotices&id=1102" target="_blank">1102</a>)</span> 
912:												<a aria-label="New Window" href="https://www.fda.gov/media/187491/download" target="_blank">FDA has no questions (in PDF)</a> (159 kB) 
940:												<a href="?set=GRASNotices&id=1102&sort=GRN_No&order=DESC&startrow=1&type=basic&search=invertase">Invertase enzyme preparation produced by <i>Trichoderma reesei</i> expressing a gene for invertase from <i>Aspergillus niger</i></a> 
964:												<div style="text-align: left;">&nbsp;&nbsp;<a aria-label="New Window" href="https://www.cfsanappsexternal.fda.gov/scripts/fdcc/index.cfm?set=GRASNotices&id=1173" target="_blank">1173</a></div> 
980:												<a href="?set=GRASNotices&id=88&sort=GRN_No&order=DESC&startrow=1&type=basic&search=invertase">Invertase enzyme preparation from <i>Saccharomyces cerevisiae</i> and lactase enzyme preparation from <i>Kluyveromyces marxianus</i></a> 
992:												<a aria-label="New Window" href="https://wayback.archive-it.org/7993/20171031035213/https://www.fda.gov/Food/IngredientsPackagingLabeling/GRAS/NoticeInventory/ucm154609.htm" target="_blank">FDA has no questions</a> 
1022:								<a href="javascript:void(0);" onclick="sortCols('GRN_No');return false;" title="Click to sort by GRN No.">GRN No.</a>

thinking
**Exploring GRAS notice details**
codex
I found direct FDA GRAS Notice records for invertase (including GRN 88 and a recent GRN 1173 with “FDA has no questions”). I’m extracting the exact intended-use conditions from those records now so the FDA section is concrete even where no specific CFR monograph exists.
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=GRASNotices&id=88' | rg -n -i 'GRN No|Substance|Intended use|FDA has no questions|Date|invertase|Saccharomyces|use level|food categories|Regulation|CFR|basis|notifier' | head -n 200" in /home/exedev/chewber succeeded in 665ms:
5:<!-- Google tag (gtag.js) --> <script async src=https://www.googletagmanager.com/gtag/js?id=G-TN15K4JY3W></script> <script> window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-TN15K4JY3W'); </script> 
240:                var now=new Date();
285:        <li><a href="https://www.fda.gov/food/food-ingredients-packaging/generally-recognized-safe-gras">Generally Recognized as Safe </a></li><li><a href="https://www.fda.gov/food/food-ingredients-packaging/food-ingredient-and-packaging-inventories">Food Ingredient & Packaging Inventories</a></li><li><a href="index.cfm?set=GRASNotices">GRAS Notices</a></li><li><a href="?set=GRASNotices&id=88">GRN No. 88 </a></li>
313:					GRN No. 88 
316:						<h2 class="h2">Invertase enzyme preparation from <i>Saccharomyces cerevisiae</i> and lactase enzyme preparation from <i>Kluyveromyces marxianus</i></h2>
331:											<th nowrap="nowrap">Intended Use:</th>
341:											<th nowrap="nowrap">Basis:</th>
351:											<th nowrap="nowrap">Notifier:</th>
361:											<th nowrap="nowrap">Notifier Address:</th>
371:											<th nowrap="nowrap">Date of filing:</th>
391:											<th nowrap="nowrap">Date of closure:</th>
404:												<a href="https://wayback.archive-it.org/7993/20171031035213/https://www.fda.gov/Food/IngredientsPackagingLabeling/GRAS/NoticeInventory/ucm154609.htm" target="_blank">FDA has no questions</a>
438:<p>This website has been translated to Spanish from English, and is updated often. It is possible that some links will connect you to content only
465:      <p>Page Last Updated: 02/24/2026</p>
516:                <li><a href="https://www.fda.gov/about-fda/contact-fda/get-email-updates" title="Subscribe to E-mails"><img src="/scripts/includes/images/img_fdagov_footer_icon_email.png" alt="E-mail" title="Subscribe to E-mails"/></a></li>

thinking
**Planning table formatting changes**
exec
/bin/bash -lc "curl -sL 'https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=GRASNotices&id=88' | sed -n '320,410p'" in /home/exedev/chewber succeeded in 637ms:
			<div class="prePostText">
				
			</div>

			
				<div id="detailTableDiv">
					<table id="detailTable" cellspacing="0">
						
						
										
										<tr valign="top" class="none">
											<th nowrap="nowrap">Intended Use:</th>
											<td>
												
												Use in foods in general as an enzyme in accordance with current good manufacturing practices
											</td>
										</tr>
										
										
										

thinking
**Planning extraction of GRAS conditions**
exec
/bin/bash -lc "sed -n '106180,106250p' /tmp/title21.xml" in /home/exedev/chewber succeeded in 51ms:
<DIV6 N="A" TYPE="SUBPART">
<HEAD>Subpart A—General Provisions</HEAD>


<DIV8 N="184.1" TYPE="SECTION" VOLUME="3">
<HEAD>§ 184.1   Substances added directly to human food affirmed as generally recognized as safe (GRAS).</HEAD>
<P>(a) The direct human food ingredients listed in this part have been reviewed by the Food and Drug Administration and affirmed to be generally recognized as safe (GRAS) for the purposes and under the conditions prescribed. The regulations in this part shall sufficiently describe each ingredient to identify the characteristics of the ingredient that has been affirmed as GRAS and to differentiate it from other possible versions of the ingredient that have not been affirmed as GRAS. Ingredients affirmed as GRAS in this part are also GRAS as indirect human food ingredients, subject to any limitations prescribed in parts 174, 175, 176, 177, 178 or § 179.45 of this chapter or in part 186 of this chapter. The purity specifications in this part do not apply when the ingredient is used in indirect applications. However, when used in indirect applications, the ingredient must be of a purity suitable for its intended use in accordance with § 170.30(h)(1) of this chapter.
</P>
<P>(b) Any ingredient affirmed as GRAS in this part shall be used in accordance with current good manufacturing practice. For the purpose of this part, current good manufacturing practice includes the requirements that a direct human food ingredient be of appropriate food grade; that it be prepared and handled as a food ingredient; and that the quantity of the ingredient added to food does not exceed the amount reasonably required to accomplish the intended physical, nutritional, or other technical effect in food.


</P>
<P>(1) If the ingredient is affirmed as GRAS with no limitations on its conditions of use other than current good manufacturing practice, it shall be regarded as GRAS if its conditions of use are consistent with the requirements of paragraph (b), (c), and (d) of this section. When the Food and Drug Administration (FDA) determines that it is appropriate, the agency will describe one or more current good manufacturing practice conditions of use in the regulation that affirms the GRAS status of the ingredient. 

For example, when the safety of an ingredient has been evaluated on the basis of limited conditions of use, the agency will describe in the regulation that affirms the GRAS status of the ingredient, one or more of these limited conditions of use, which may include the category of food(s), the technical effect(s) or functional use(s) of the ingredient, and the level(s) of use. If the ingredient is used under conditions that are significantly different from those described in the regulation, that use of the ingredient may not be GRAS. 

In such a case, a manufacturer may not rely on the regulation as authorizing that use but shall have a basis to conclude that that use is GRAS or shall use the ingredient in accordance with a food additive regulation.


</P>


thinking
**Gathering JECFA invertase data**
thinking
**Exploring WHO API endpoints**
exec
/bin/bash -lc "curl -sL 'https://apps.who.int/food-additives-contaminants-jecfa-database/' | head -n 120" in /home/exedev/chewber succeeded in 1.15s:
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- head to scrape:on -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
        WHO | JECFA
    </title>
    <link rel="shortcut icon" href="/favicon.ico">
    
    <link href="//use.fontawesome.com/releases/v5.0.10/css/all.css" rel="stylesheet" type="text/css" />
    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/grid.min.css?v=12.1.7126.15119'>
    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/origin.min.css?v=12.1.7126.15119'> <!-- head to scrape:off -->
    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/main.min.css?v=12.1.7126.15119'>
    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/print.min.css?v=12.1.7126.15119' media='print'>

    <style type="text/css" media="all">
        a.nomenu::after {

thinking
**Searching API endpoints for keyword**
exec
/bin/bash -lc "curl -sL 'https://apps.who.int/food-additives-contaminants-jecfa-database/' | rg -n -i 'Chemical|api|Search|autocomplete|Home/Chemical|food-additives-contaminants-jecfa-database/Home|Filter|data-url|endpoint|/api/' | head -n 120" in /home/exedev/chewber succeeded in 1.15s:
28:        .filter-widget__wrapper .main-filter {
38:        .filter-widget__wrapper .main-filter {
511:                read: "~/api/ChemicalData/GetLatest"
546:This searchable database contains the summaries of all the evaluations of flavours, food additives, contaminants, toxicants and veterinary drugs JECFA has performed. Each summary contains basic chemical information, ADIs/TDIs, links to the most recent reports and monographs as well as to the specification database, and a history of JECFA evaluations. The database is searchable by partial name or CAS number, by first character (letter or symbol), or by functional class.
563:                                <div class="filter-widget__wrapper">
566:                                            <div class="main-filter">
571:                                                        <input id="Multi-field-healthtopics" class="autocomplete"  data-data="[{Id,Name}]" data-placeholder="Health Topic" data-type="Taxonomy" placeholder="Partial name or CAS number" data-taxon=healthtopics />
579:                                                        <input id="Multi-field-fema" class="autocomplete" data-data="[{Id,Name}]" data-placeholder="FEMA or JECFA number " data-type="Taxonomy" placeholder="FEMA or JECFA number " data-taxon="fema" />
589:                                                        <select id="Single-field-first" class="combobox " data-placeholder="First Character" data-autocomplete="true" data-type="Taxonomy" placeholder="First Character" data-taxon=first style="width: 100%;">
597:                                                        <select id="Single-field-publishingoffices" class="combobox" data-placeholder="Functional Classes" data-autocomplete="true" data-type="Taxonomy" placeholder="Functional Class" data-taxon="functionalclasses" style="width: 100%;">
606:                                <div id="search-result-header" class="col-md-12" style="display:none;">List of chemicals <span id="search-result-header-details"></span>:</div>
608:                                <script type='text/javascript' src='Frontend-Assembly/SitefinityWebApp/Mvc/Scripts/FilterWidget/filter-widget.js?v=12.1.7126.15119'></script>
612:                                        $(".filter-widget__wrapper").css("opacity", "1");
614:                                        $(".advanced-filter__btn span").on('click', function (e) {
615:                                            $('.advanced-filter__content').toggleClass("show");
617:                                            if ($('.advanced-filter__content').hasClass("show")) {
634:                                                                <a href="Home/Chemical/#: Id#">
668:<script src="/food-additives-contaminants-jecfa-database/Frontend-Assembly/Telerik.Sitefinity.Frontend.Search/Mvc/Scripts/SearchBox/Search-box.min.js?package=WHO&amp;amp;v=MTM1MDcwMjg5OQ%3d%3d" type="text/javascript"></script>
691:    function filter_select(e, n, v) {
692:        $("#search-result-header").hide();

thinking
**Testing chemical search API**
exec
/bin/bash -lc "curl -sL 'https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/invertase'" in /home/exedev/chewber succeeded in 1.06s:
[{"ADI":"NOT SPECIFIED","Name":"INVERTASE from SACCHAROMYCES CEREVISIAE","Id":1726,"CAS_NO":null,"FEMA_NO":null,"JECFA_NO":null,"FunctionalClass":null}]

thinking
**Checking evaluation year source**
codex
I identified WHO/JECFA API endpoints and got a direct machine-readable hit for invertase (`ADI: NOT SPECIFIED`, chemical ID 1726). I’m pulling the chemical detail endpoint now to extract the evaluation year and status cleanly.
exec
/bin/bash -lc "curl -sL 'https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1726' | rg -n -i 'Status|Evaluations|Evaluation year|ADI|Acceptable daily intake|Last|Year|INS|invertase|Chemical and synonyms|Functional class|No safety concern|JECFA' | head -n 140" in /home/exedev/chewber succeeded in 768ms:
9:        WHO | JECFA
14:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/grid.min.css?v=12.1.7126.15119'>
15:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/origin.min.css?v=12.1.7126.15119'> <!-- head to scrape:off -->
16:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/main.min.css?v=12.1.7126.15119'>
17:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/print.min.css?v=12.1.7126.15119' media='print'>
413:    <script src="/food-additives-contaminants-jecfa-database/Scripts/jquery-3.4.1.min.js"></script>
414:    <script src="/food-additives-contaminants-jecfa-database/Mvc/Scripts/axd/jquery-migrate.js"></script>
415:    <script src="/food-additives-contaminants-jecfa-database/Mvc/Scripts/axd/jquery-ui.js"></script>
425:                        <div class="header-logo logos-container"> <a href="/food-additives-contaminants-jecfa-database/" title="Home" class="primary-logo"><img src="/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/images/logos/en/h-logo-blue.svg" alt="Home" class="logo svg" /> </a> </div>
454:                                    <li class=""><a href="/food-additives-contaminants-jecfa-database/" target="_self">Home</a></li>
474:                                    <li><a class="nomenu">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Evaluations of the Joint FAO/WHO Expert Committee on Food Additives (JECFA)</a></li>
553:                        <div class="dynamic-content__heading__wrapper">
554:                            <div class="dynamic-content__heading">
555:                                <h1>INVERTASE from SACCHAROMYCES CEREVISIAE</h1>
591:                                                        <div class="label">INS</div>
595:                            <div class="label">Functional Class</div>
599:                            <div class="label">INS matches</div>
608:                                            <h3>Evaluations</h3>
614:    <h4 style="margin:0;line-height: .5em;">Evaluation year: 2001</h4>
615:    <h4 style="margin-bottom: 0; line-height: .5em;"><div class="row"><div class="col-sm-2" style="white-space:nowrap;">ADI:</div><div class="col-sm-8" style="line-height:normal;">NOT SPECIFIED</div></div></h4>

thinking
**Exploring EFSA search API for data**
exec
/bin/bash -lc "curl -sL 'https://search.efsa.europa.eu/?q=Invertase' | rg -n -i 'Invertase|9128|8861|Safety evaluation|Published|adopted|food enzyme|does not give rise to safety concerns|ADI|year' | head -n 120" in /home/exedev/chewber succeeded in 156ms:


thinking
**Investigating data loading method**
exec
/bin/bash -lc "curl -sL 'https://search.efsa.europa.eu/?q=Invertase' | head -n 80" in /home/exedev/chewber succeeded in 135ms:


thinking
**Checking response headers**
exec
/bin/bash -lc "curl -sI 'https://search.efsa.europa.eu/?q=Invertase' | head -n 40" in /home/exedev/chewber succeeded in 131ms:


thinking
**Attempting web snippet retrieval**
🌐 Searching the web...
🌐 Searched the web

thinking
**Planning targeted web search and open**
🌐 Searching the web...
🌐 Searched: EFSA 9128 invertase Saccharomyces cerevisiae CNCM I-3399

thinking
**Clarifying EFSA opinion versus approval**
exec
/bin/bash -lc "curl -sL 'https://eur-lex.europa.eu/eli/reg/2008/1333/2023-10-31/eng' -o /tmp/eu1333.html && rg -n -i 'E 1103|1103|invertase|authorisations.*repealed|food enzymes|Annex II|Part C|from the date of application of the Community list' /tmp/eu1333.html | head -n 80" in /home/exedev/chewber succeeded in 3.25s:
9116:                     <p class="norm">conditions of use of food additives in foods, including in food additives and in food enzymes as covered by Regulation (EC) No 1332/2008 [on food enzymes], and in food flavourings as covered by Regulation (EC) No 1334/2008 of the European Parliament and of the Council of 16 December 2008 on flavourings and certain food ingredients with flavouring properties for use in and on foods (<a href="#E0001" id="src.E0001">
9189:                  <div class="norm inline-element">This Regulation shall not apply to food enzymes falling within the scope of Regulation (EC) No 1332/2008 [on food enzymes], with effect from the date of adoption of the Community list of food enzymes in accordance with Article 17 of that Regulation.</div>
9434:                  <div class="norm inline-element">Only food additives included in the Community list in Annex II may be placed on the market as such and used in foods under the conditions of use specified therein.</div>
9438:                  <div class="norm inline-element">Only food additives included in the Community list in Annex III may be used in food additives, in food enzymes and in food flavourings under the conditions of use specified therein.</div>
9442:                  <div class="norm inline-element">Food additives in Annex II shall be listed on the basis of the categories of food to which they may be added.</div>
9446:                  <div class="norm inline-element">Food additives in Annex III shall be listed on the basis of the food additives, food enzymes, food flavourings and nutrients or categories thereof to which they may be added.</div>
9528:                           <p class="norm">aiding in the manufacture, processing, preparation, treatment, packing, transport or storage of food, including food additives, food enzymes and food flavourings, provided that the food additive is not used to disguise the effects of the use of faulty raw materials or of any undesirable practices or techniques, including unhygienic practices or techniques, during the course of any such activities.</p>
9536:                     <p class="norm inline-element">By way of derogation from paragraph 2(a), a food additive which reduces the nutritional quality of a food may be included in the Community list in Annex II provided that:</p>
9561:               <p class="norm">A food additive may be included in the Community list in Annex II for the functional class of sweetener only if, in addition to serving one or more of the purposes set out in Article 6(2), it serves one or more of the following purposes:</p>
9592:               <p class="norm">A food additive may be included in the Community list in Annex II for the functional class of colour only if, in addition to serving one or more of the purposes set out in Article 6(2), it serves one of the following purposes:</p>
9643:                     <p class="norm inline-element">A food additive which complies with the conditions set out in Articles 6, 7 and 8 may, in accordance with the procedure referred to in Regulation (EC) No 1331/2008 [establishing a common authorisation procedure for food additives, food enzymes and food flavourings] be included in:</p>
9649:                           <p class="norm">the Community list in Annex II to this Regulation; and/or</p>
9657:                           <p class="norm">the Community list in Annex III to this Regulation.</p>
9702:                  <div class="norm inline-element">The Community lists in Annexes II and III shall be amended in accordance with the procedure referred to in Regulation (EC) No 1331/2008 [establishing a common authorisation procedure for food additives, food enzymes and food flavourings].</div>
9754:                  <div class="norm inline-element">The maximum levels of food additives set out in Annex II shall apply to the food as marketed, unless otherwise stated. By way of derogation from this principle, for dried and/or concentrated foods which need to be reconstituted the maximum levels shall apply to the food as reconstituted according to the instructions on the label taking into account the minimum dilution factor.</div>
9758:                  <div class="norm inline-element">The maximum levels for colours set out in Annex II shall apply to the quantities of colouring principle contained in the colouring preparation unless otherwise stated.</div>
9787:               <p class="norm">The specifications of food additives relating, in particular, to origin, purity criteria and any other necessary information, shall be adopted when the food additive is included in the Community lists in Annexes II and III for the first time, in accordance with the procedure referred to in Regulation (EC) No 1331/2008 [establishing a common authorisation procedure for food additives, food enzymes and food flavourings].</p>
9798:               <p class="norm">Food additives shall not be used in unprocessed foods, except where such use is specifically provided for in Annex II.</p>
9805:               <p class="norm">Food additives shall not be used in foods for infants and young children as referred to in Directive 89/398/EEC, including dietary foods for infants and young children for special medical purposes, except where specifically provided for in Annex II to this Regulation.</p>
9812:               <p class="norm">Only food colours listed in Annex II to this Regulation may be used for the purpose of health marking as provided for in Council Directive 91/497/EEC of 29 July 1991 amending and consolidating Directive 64/433/EEC on health problems affecting intra-Community trade in fresh meat to extend it to the production and marketing of fresh meat (<a href="#E0003" id="src.E0003">

thinking
**Analyzing quantum satis context**
exec
/bin/bash -lc "sed -n '14550,14590p' /tmp/eu1333.html" in /home/exedev/chewber succeeded in 51ms:
                     <td valign="top">
                        <p class="tbl-norm">E 949</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">Hydrogen</p>
                     </td>
                  </tr>
                  <tr>
                     <td valign="top">
                        <p class="tbl-norm">E 999</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">Quillaia extract</p>
                     </td>
                  </tr>
                  <tr>
                     <td valign="top">
                        <p class="tbl-norm">E 1103</p>
                     </td>
                     <td valign="top">

thinking
**Locating condition for additive**
exec
/bin/bash -lc "sed -n '16330,16370p' /tmp/eu1333.html" in /home/exedev/chewber succeeded in 51ms:
                        <p class="tbl-left">
                           <span class="italics">quantum satis</span>
                        </p>
                     </td>
                  </tr>
                  <tr>
                     <td valign="top">
                        <p class="tbl-norm">E 949</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">Hydrogen</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-left">
                           <span class="italics">quantum satis</span>
                        </p>
                     </td>
                  </tr>
                  <tr>
                     <td valign="top">

thinking
**Identifying additive approval status**
exec
/bin/bash -lc "sed -n '93290,93330p' /tmp/eu1333.html" in /home/exedev/chewber succeeded in 51ms:
                     <td valign="top">
                        <p class="tbl-norm">E 968</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">Erythritol</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-left">
                           <span class="italics">quantum satis</span>
                        </p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">All nutrients</p>
                     </td>
                     <td valign="top">
                        <p class="tbl-norm">Yes, only as a carrier</p>
                     </td>
                  </tr>
                  <tr>
                     <td valign="top">


thinking
**Assessing CAS number sources**
thinking
**Querying PubChem for identifiers**
exec
/bin/bash -lc "curl -s 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/invertase/JSON' | head -c 600" in /home/exedev/chewber succeeded in 399ms:
{
  "Fault": {
    "Code": "PUGREST.NotFound",
    "Message": "No CID found",
    "Details": [
      "No CID found that matches the given name"
    ]
  }
}

thinking
**Exploring compound ID sources**
exec
/bin/bash -lc "curl -s 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/9001-57-4/property/Title/JSON'" in /home/exedev/chewber succeeded in 200ms:
{
  "Fault": {
    "Code": "PUGREST.NotFound",
    "Message": "No CID found",
    "Details": [
      "No CID found that matches the given name"
    ]
  }
}


thinking
**Planning enzyme data sourcing**
thinking
**Gathering EFSA status and safety studies**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=40071032,40364418,40488911,40686618,41103772,41531465' | rg -n '<Id>|<Item Name=\"PubDate\"|<Item Name=\"Title\"|<Item Name=\"Source\"|<Item Name=\"DOI\"|<Item Name=\"SO\"'" in /home/exedev/chewber succeeded in 313ms:
5:	<Id>40071032</Id>
6:	<Item Name="PubDate" Type="Date">2025 Mar</Item>
8:	<Item Name="Source" Type="String">EFSA J</Item>
34:	<Item Name="Title" Type="String">Safety evaluation of the food enzyme β-fructofuranosidase from the genetically modified Trichoderma reesei strain AR-996.</Item>
56:	<Item Name="DOI" Type="String">10.2903/j.efsa.2025.9287</Item>
68:	<Item Name="SO" Type="String">2025 Mar;23(3):e9287</Item>
72:	<Id>40364418</Id>
73:	<Item Name="PubDate" Type="Date">2025 May 5</Item>
75:	<Item Name="Source" Type="String">Plants (Basel)</Item>
87:	<Item Name="Title" Type="String">Bacillus Bio-Organic Fertilizer Altered Soil Microorganisms and Improved Yield and Quality of Radish (Raphanus sativus L.).</Item>
109:	<Item Name="DOI" Type="String">10.3390/plants14091389</Item>
124:	<Item Name="SO" Type="String">2025 May 5;14(9)</Item>
128:	<Id>40488911</Id>
129:	<Item Name="PubDate" Type="Date">2025 Jun 9</Item>
131:	<Item Name="Source" Type="String">Acta Parasitol</Item>
144:	<Item Name="Title" Type="String">Efficacy of Hot Capsicum annuum Extracts Against the Biological Activity of Culex pipiens and Musca domestica Larvae with their Phytochemical Profiles.</Item>
164:	<Item Name="DOI" Type="String">10.1007/s11686-025-01066-3</Item>
177:	<Item Name="SO" Type="String">2025 Jun 9;70(3):129</Item>
181:	<Id>40686618</Id>
182:	<Item Name="PubDate" Type="Date">2025 Aug 15</Item>

thinking
**Planning targeted safety evidence gathering**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40071032,41103772,41531465&rettype=abstract&retmode=text'" in /home/exedev/chewber succeeded in 262ms:
1. EFSA J. 2025 Mar 11;23(3):e9287. doi: 10.2903/j.efsa.2025.9287. eCollection
2025  Mar.

Safety evaluation of the food enzyme β-fructofuranosidase from the genetically 
modified Trichoderma reesei strain AR-996.

EFSA Panel on Food Enzymes (FEZ); Zorn H, Barat Baviera JM, Bolognesi C, Catania 
F, Gadermaier G, Greiner R, Mayo B, Mortensen A, Roos YH, Solano MLM, Sramkova 
M, Van Loveren H, Vernis L, Criado A, Aguilera J, Andryszkiewicz M, Cavanna D, 
di Piazza G, Fernández-Fraguas C, Marini E, Liu Y.

The food enzyme β-fructofuranosidase (β-d-fructofuranoside fructohydrolase; EC 
3.2.1.26) is produced with the genetically modified Trichoderma reesei strain 
AR-996 by AB Enzymes GmbH. The genetic modifications do not give rise to safety 
concerns. The food enzyme is free from viable cells of the production organism 
and its DNA. The food enzyme is intended to be used in three food manufacturing 
processes. Dietary exposure was estimated to be up to 0.605 mg total organic 
solids (TOS)/kg body weight per day in European populations. Genotoxicity tests 
did not indicate a safety concern. The systemic toxicity was assessed by means 
of a repeated dose 90-day oral toxicity study in rats. The Panel identified a no 

thinking
**Verifying dataset update and presence**
exec
/bin/bash -lc "rg -o 'last_update:\"["'^"]+"|last_volume:"[''^"]+"'"' /tmp/loc.app.js | head -n 4" in /home/exedev/chewber succeeded in 51ms:
last_volume:"140"
last_update:"2026-02-25 16:34 (CET)"

thinking
**Planning EFSA source retrieval**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=10.2903%2Fj.efsa.2024.9128%5Bdoi%5D'" in /home/exedev/chewber succeeded in 508ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD esearch 20060628//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20060628/esearch.dtd">
<eSearchResult><Count>1</Count><RetMax>1</RetMax><RetStart>0</RetStart><IdList>
<Id>39698587</Id>
</IdList><TranslationSet/><QueryTranslation>"10 2903 j efsa 2024 9128"[Publisher ID]</QueryTranslation></eSearchResult>

thinking
**Fetching publication abstract**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39698587&rettype=abstract&retmode=text'" in /home/exedev/chewber succeeded in 313ms:
1. EFSA J. 2024 Dec 18;22(12):e9128. doi: 10.2903/j.efsa.2024.9128. eCollection 
2024 Dec.

Safety evaluation of the food enzyme β-fructofuranosidase from the 
non-genetically modified Saccharomyces cerevisiae strain CNCM I-3399.

EFSA Panel on Food Enzymes (FEZ); Zorn H, Barat Baviera JM, Bolognesi C, Catania 
F, Gadermaier G, Greiner R, Mayo B, Mortensen A, Roos YH, Solano MLM, Sramkova 
M, Van Loveren H, Vernis L, Chesson A, Herman L, Aguilera J, Andryszkiewicz M, 
Cavanna D, di Piazza G, Liu Y.

The food enzyme β-fructofuranosidase (β-d-fructofuranoside fructohydrolase; EC 
3.2.1.26) is produced with the non-genetically modified Saccharomyces cerevisiae 
strain CNCM I-3399 by Kerry Ingredients & Flavours Ltd. The production strain 
qualifies for the qualified presumption of safety (QPS) approach for risk 
assessment. The food enzyme is intended to be used in four food manufacturing 
processes. Exposure was estimated to be up to 2.485 mg total organic solids/kg 
body weight (bw) per day in European populations. As the production strain 
qualifies for QPS, and in the absence of other concerns, the Panel considered 
that toxicological studies were not needed for the safety assessment of this 

thinking
**Confirming regulatory data gaps**
exec
/bin/bash -lc "rg -i -c 'invertase' /tmp/title21.xml" in /home/exedev/chewber exited 1 in 51ms:


thinking
**Adjusting command to capture output despite no matches**
exec
/bin/bash -lc "(rg -i -c 'invertase' /tmp/title21.xml || true)" in /home/exedev/chewber succeeded in 51ms:


thinking
**Switching to grep for counting**
exec
/bin/bash -lc "grep -i -c 'invertase' /tmp/title21.xml" in /home/exedev/chewber exited 1 in 51ms:
0

thinking
**Planning comprehensive invertase report**
codex
I’ve gathered enough primary data and can move to writing.  
Plan for file generation:

1. Compile regulatory facts with explicit uncertainty handling:
- EFSA: latest invertase safety opinion details (year, conclusions, exposure) and whether a numeric ADI exists.
- FDA/eCFR: GRAS notice evidence for invertase, eCFR citation context, and explicit note that no invertase-specific Title 21 section string match was found.
- JECFA/WHO: ADI and evaluation year from the WHO database entry.
- IARC: classification lookup result (no listed agent match).
- PubMed: recent safety evaluations with concrete outcomes.

2. Write `/home/exedev/chewber/research/additives/E1103/E1103-report.md`:
- Fill all requested sections and include precise URLs actually visited.
- Attribute key claims to the exact source in-text and in the Sources section.
- Flag inaccessible endpoints (e.g., EFSA/Wiley Cloudflare) and note fallback source used.

3. Write `/home/exedev/chewber/research/additives/E1103/E1103-abstraction.json`:
- Conform exactly to the schema.
- Use `null` where data are genuinely unavailable.
- Keep source list restricted to URLs I actually visited.

4. Validate JSON:
- Run `jq . /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json` and fix any issues.

thinking
**Confirming visited URLs**
exec
/bin/bash -lc "curl -sI 'https://www.efsa.europa.eu/en/efsajournal/pub/8861' | head -n 20" in /home/exedev/chewber succeeded in 1.02s:
HTTP/2 301 
content-type: text/html; charset=utf-8
content-length: 0
location: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2024.8861
date: Fri, 27 Feb 2026 02:51:19 GMT
x-age: 0
content-language: en
x-content-type-options: nosniff
expires: Sun, 19 Nov 1978 05:00:00 GMT
content-security-policy: default-src 'self' *.europa.eu europa.eu blob: inno-ecl.s3.amazonaws.com; script-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com; script-src-elem 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com  https://cdn.ckeditor.com/ https://kit.fontawesome.com/b99e675b6e.js https://cdn.jsdelivr.net/npm/@vidstack/ https://cdn.vidstack.io/captions; style-src 'self' *.europa.eu europa.eu efsa.containers.piwik.pro  'unsafe-inline' cdnjs.cloudflare.com/ajax/libs/chosen/ cdnjs.cloudflare.com/ajax/libs/font-awesome/ translate.googleapis.com fonts.googleapis.com/css; img-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro data: blob: cdnjs.cloudflare.com/ajax/libs/font-awesome/ cdnjs.cloudflare.com/ajax/libs/chosen/ *.ytimg.com www.gstatic.com translate.google.com picsum.photos fastly.picsum.photos images.unsplash.com placeimg.com; frame-src 'self' *.europa.eu europa.eu *.youtube.com *.powerbi.com efsa.containers.piwik.pro efsa.piwik.pro login.microsoftonline.com player.vimeo.com vimeo.com demo.hypertech.gr hypertech.gr tokenprovider.termsofuse.identitygovernance.azure.com app.fabric.microsoft.com; frame-ancestors 'self' *.europa.eu europa.eu efsa.maps.arcgis.com storymaps.arcgis.com; child-src 'self'; font-src 'self' efsa.containers.piwik.pro cdnjs.cloudflare.com/ajax/libs/font-awesome/ fonts.gstatic.com ka-f.fontawesome.com; connect-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro dwh.efsa.europa.eu translate.googleapis.com https://ka-f.fontawesome.com; report-uri /report-csp-violation; upgrade-insecure-requests
x-content-security-policy: default-src 'self' *.europa.eu europa.eu blob: inno-ecl.s3.amazonaws.com; script-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com; script-src-elem 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com  https://cdn.ckeditor.com/ https://kit.fontawesome.com/b99e675b6e.js https://cdn.jsdelivr.net/npm/@vidstack/ https://cdn.vidstack.io/captions; style-src 'self' *.europa.eu europa.eu efsa.containers.piwik.pro  'unsafe-inline' cdnjs.cloudflare.com/ajax/libs/chosen/ cdnjs.cloudflare.com/ajax/libs/font-awesome/ translate.googleapis.com fonts.googleapis.com/css; img-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro data: blob: cdnjs.cloudflare.com/ajax/libs/font-awesome/ cdnjs.cloudflare.com/ajax/libs/chosen/ *.ytimg.com www.gstatic.com translate.google.com picsum.photos fastly.picsum.photos images.unsplash.com placeimg.com; frame-src 'self' *.europa.eu europa.eu *.youtube.com *.powerbi.com efsa.containers.piwik.pro efsa.piwik.pro login.microsoftonline.com player.vimeo.com vimeo.com demo.hypertech.gr hypertech.gr tokenprovider.termsofuse.identitygovernance.azure.com app.fabric.microsoft.com; frame-ancestors 'self' *.europa.eu europa.eu efsa.maps.arcgis.com storymaps.arcgis.com; child-src 'self'; font-src 'self' efsa.containers.piwik.pro cdnjs.cloudflare.com/ajax/libs/font-awesome/ fonts.gstatic.com ka-f.fontawesome.com; connect-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro dwh.efsa.europa.eu translate.googleapis.com https://ka-f.fontawesome.com; report-uri /report-csp-violation; upgrade-insecure-requests
x-webkit-csp: default-src 'self' *.europa.eu europa.eu blob: inno-ecl.s3.amazonaws.com; script-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com; script-src-elem 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com/ajax/libs/chosen/ *.googleapis.com www.youtube.com  https://cdn.ckeditor.com/ https://kit.fontawesome.com/b99e675b6e.js https://cdn.jsdelivr.net/npm/@vidstack/ https://cdn.vidstack.io/captions; style-src 'self' *.europa.eu europa.eu efsa.containers.piwik.pro  'unsafe-inline' cdnjs.cloudflare.com/ajax/libs/chosen/ cdnjs.cloudflare.com/ajax/libs/font-awesome/ translate.googleapis.com fonts.googleapis.com/css; img-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro data: blob: cdnjs.cloudflare.com/ajax/libs/font-awesome/ cdnjs.cloudflare.com/ajax/libs/chosen/ *.ytimg.com www.gstatic.com translate.google.com picsum.photos fastly.picsum.photos images.unsplash.com placeimg.com; frame-src 'self' *.europa.eu europa.eu *.youtube.com *.powerbi.com efsa.containers.piwik.pro efsa.piwik.pro login.microsoftonline.com player.vimeo.com vimeo.com demo.hypertech.gr hypertech.gr tokenprovider.termsofuse.identitygovernance.azure.com app.fabric.microsoft.com; frame-ancestors 'self' *.europa.eu europa.eu efsa.maps.arcgis.com storymaps.arcgis.com; child-src 'self'; font-src 'self' efsa.containers.piwik.pro cdnjs.cloudflare.com/ajax/libs/font-awesome/ fonts.gstatic.com ka-f.fontawesome.com; connect-src 'self' *.europa.eu europa.eu efsa.piwik.pro efsa.containers.piwik.pro dwh.efsa.europa.eu translate.googleapis.com https://ka-f.fontawesome.com; report-uri /report-csp-violation; upgrade-insecure-requests
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
feature-policy: autoplay 'self'; camera 'self'; encrypted-media 'self'; fullscreen 'self'; geolocation 'self'; microphone 'self'; midi 'self'; payment 'self';
last-modified: Fri, 27 Feb 2026 02:51:19 GMT
etag: "1772160679"
x-fpfis: 1018135
strict-transport-security: max-age=31536000; includeSubDomains; preload;
cache-control: public, max-age=300, s-maxage=300

thinking
**Planning abstract retrieval**
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=10.2903%2Fj.efsa.2024.8861%5Bdoi%5D'" in /home/exedev/chewber succeeded in 214ms:
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE eSearchResult PUBLIC "-//NLM//DTD esearch 20060628//EN" "https://eutils.ncbi.nlm.nih.gov/eutils/dtd/20060628/esearch.dtd">
<eSearchResult><Count>1</Count><RetMax>1</RetMax><RetStart>0</RetStart><IdList>
<Id>38966137</Id>
</IdList><TranslationSet/><QueryTranslation>"10 2903 j efsa 2024 8861"[Publisher ID]</QueryTranslation></eSearchResult>
exec
/bin/bash -lc "curl -s 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=38966137&rettype=abstract&retmode=text'" in /home/exedev/chewber succeeded in 263ms:
1. EFSA J. 2024 Jul 4;22(7):e8861. doi: 10.2903/j.efsa.2024.8861. eCollection
2024  Jul.

'Citicoline' and support of the memory function: Evaluation of a health claim 
pursuant to Article 13(5) of Regulation (EC) No 1924/2006.

EFSA Panel on Nutrition, Novel Foods and Food allergens (NDA); Turck D, Bohn T, 
Castenmiller J, De Henauw S, Hirsch-Ernst KI, Knutsen HK, Maciuk A, Mangelsdorf 
I, McArdle HJ, Naska A, Pentieva K, Thies F, Tsabouri S, Vinceti M, Bresson JL, 
Fiolet T, Siani A.

Following an application from Egde Pharma Sp. z o.o, submitted for authorisation 
of a health claim pursuant to Article 13(5) of Regulation (EC) No 1924/2006 via 
the Competent Authority of Poland, the EFSA Panel on Nutrition, Novel Foods and 
Food Allergens (NDA) was asked to deliver an opinion on the scientific 
substantiation of a health claim related to citicoline and memory. The Panel 
considers that the food, citicoline (cytidine 5-diphosphocholine, CDP-Choline) 
inner salt, is sufficiently characterised. Improvement, maintenance or reduced 
loss of memory is a beneficial physiological effect for middle-aged or elderly 
adults encountering age-associated subjective memory impairment. The applicant 

thinking
**Clarifying invertase references**
exec
/bin/bash -lc "rg -o -i 'Saccharin and its salts|Sunset Yellow FCF' /tmp/loc.app.js | head -n 5" in /home/exedev/chewber succeeded in 50ms:
Saccharin and its salts
Sunset Yellow FCF

thinking
**Planning data compilation and JSON schema**
codex
I’m starting the file writes now. I’ll include a short “access limitations” note for the EFSA/Wiley page and eCFR web UI, then cite the exact fallback URLs (EFSA/PubMed metadata, eCFR API, FDA inventory, WHO API, IARC dataset, PubMed abstracts).

thinking
**Creating report with heredoc**
exec
/bin/bash -lc 'mkdir -p /home/exedev/chewber/research/additives/E1103' in /home/exedev/chewber succeeded in 51ms:


thinking
**Outlining detailed enzyme report**
exec
/bin/bash -lc "cat > /home/exedev/chewber/research/additives/E1103/E1103-report.md <<'EOF'
# E1103 (Invertase) Research Report

## Identity
- **E-number:** E1103
- **Name:** Invertase (enzyme activity name: **beta-fructofuranosidase**, EC 3.2.1.26)
- **CAS number(s):** 977122-97-6 (FDA food-substances entry: “Invertase from *Saccharomyces cerevisiae”)
- **Common synonyms:** Invertase, beta-fructofuranosidase, invertase from *Saccharomyces cerevisiae*
- **Chemical class:** Enzyme (glycoside hydrolase used as a food-processing enzyme)
- **Natural vs synthetic:** Predominantly **natural/biotechnological** origin (produced by microbial fermentation from yeast/fungi, including non-GM and GM production strains in modern dossiers)

**Evidence:** FDA Food Substances record for invertase and EFSA/PubMed enzyme identity fields (EFSA Journal 2024/2025/2026 records).

## Function in Food
- **Mechanism of action:** Catalyzes sucrose hydrolysis into glucose + fructose (i.e., “invert sugar”).
- **Common food categories/processes:** Sugar syrup/invert syrup production and confectionery processes; broader enzyme processing uses in food manufacturing.
- **Technical effects used by FDA inventory:** enzyme, processing aid, stabilizer/thickener.

**Evidence:** WHO/JECFA chemical page (invertase comments and GMP-limited use), EFSA food-enzyme opinions (intended manufacturing processes), FDA food-substances technical-effect field.

## Regulatory Status
### EFSA / EU
- **Latest EFSA scientific evaluation found for invertase:** EFSA Journal 2024 (e9128), published **18 Dec 2024**, for beta-fructofuranosidase from non-GM *S. cerevisiae* CNCM I-3399.
- **Key conclusion:** “does not give rise to safety concerns, under the intended conditions of use,” with low but non-zero allergenicity concern (tomato-allergen sequence match).
- **ADI:** **No numerical ADI established** in the EFSA food-enzyme opinion (enzyme dossier uses exposure, toxicology/QPS, and margin-of-exposure logic rather than setting a classic additive ADI).
- **EU legal status context for E1103:** E1103 (Invertase) appears in the EU additive lists with **quantum satis** entries; Regulation (EC) No 1333/2008 also states authorisations for E1103/E1105 from Directive 95/2/EC are repealed from the date of application of the Community list on food enzymes.

**Access note:** direct full-text access from the EFSA Wiley host was Cloudflare-blocked in this VM; data were taken from EFSA URL metadata and PubMed-indexed EFSA abstract text.

### FDA / CFR
- **FDA status evidence:** FDA GRAS Notice **GRN 88** (invertase from *S. cerevisiae* + lactase) closed with **“FDA has no questions”** (Apr 3, 2002).
- **Conditions of use in GRN 88:** “Use in foods in general as an enzyme in accordance with current good manufacturing practices.”
- **eCFR finding:** In current Title 21 XML (issue date 2026-02-19), no explicit string match for “invertase” was found; there is no invertase-specific monograph section identified by name.
- **Relevant CFR framework citations used:**
  - **21 CFR 184.1(b)** (cGMP framework for affirmed GRAS direct food ingredients)
  - **21 CFR 170.3(o)** (technical-effect definitions referenced by FDA inventory)
- **FDA food-substances inventory entry:** “INVERTASE FROM SACCHAROMYCES CEREVISIAE” with technical effects listed; CFR columns are blank in the downloadable FDA inventory row.

### JECFA / WHO
- WHO/JECFA database entry for invertase (chemical ID 1726):
  - **ADI:** **NOT SPECIFIED**
  - **Evaluation year:** **2001**
  - **Comment:** acceptable when meeting specs; use limited by GMP.

### IARC
- No IARC Monographs agent entry for “invertase” was found in the current published classifications dataset (script used by IARC list page; last update string in dataset: 2026-02-25 16:34 CET).
- **Classification outcome for invertase:** no IARC group classification identified (null).

### Notable bans
- No major-jurisdiction ban for E1103/invertase was identified in the sources reviewed.

## Key Safety Evidence
### Animal/toxicology evidence
- EFSA food-enzyme assessments (2024–2026 PubMed-indexed EFSA Journal records) consistently report:
  - no genotoxicity signal,
  - high NOAELs in 90-day rat studies where required (e.g., 1000, 1067, 920 mg TOS/kg bw/day depending on enzyme preparation),
  - conclusions of no safety concern under intended uses.

### Epidemiological evidence
- No robust human epidemiology directly linking dietary invertase exposure to adverse outcomes was identified in the PubMed searches used here.

### Mechanistic concerns
- Allergenicity remains the main recurring caveat in EFSA records (sequence homology matches in some dossiers). Risk is described as not excludable but generally low likelihood.

## Exposure Assessment
- EFSA-estimated dietary exposure in representative dossiers:
  - up to **2.485 mg TOS/kg bw/day** (2024 EFSA invertase from *S. cerevisiae*),
  - up to **1.832 mg TOS/kg bw/day** (2025 mixed enzyme dossier with invertase activity),
  - up to **0.605 mg TOS/kg bw/day** (2025 GM *T. reesei* invertase dossier).
- In some processes (e.g., specific syrup/FOS processing), residual enzyme TOS is removed and exposure may be negligible/not calculated.
- Since EFSA/JECFA did not set a numeric ADI for invertase, classical “ADI exceedance” calculations are not directly applicable.
- **Potentially vulnerable group:** individuals with relevant food allergies (e.g., tomato-allergen homology noted in one EFSA dossier).

## Risk Assessment
- **Recommended Chewber tier: "'`risk_free`**
- **Rationale:**
  - consistent “no safety concern under intended use” conclusions across recent EFSA invertase-related evaluations,
  - JECFA ADI “not specified” with GMP limitation,
  - no IARC carcinogenic classification,
  - no major bans identified.
- **Residual caution:** possible low-probability allergenic reactions in sensitive individuals; this is the main uncertainty driver.

## Sources
1. **EFSA Journal entry page (2024, e9128)** — URL visited: https://www.efsa.europa.eu/en/efsajournal/pub/9128  
   (redirects to Wiley DOI host in this environment)
2. **PubMed abstract for EFSA 2024 invertase opinion (PMID 39698587)** — URL visited: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39698587&rettype=abstract&retmode=text
3. **PubMed abstracts for recent invertase safety evaluations (PMIDs 40071032, 41103772, 41531465)** — URL visited: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40071032,41103772,41531465&rettype=abstract&retmode=text
4. **EU additives regulation (consolidated): Regulation (EC) No 1333/2008** — URL visited: https://eur-lex.europa.eu/eli/reg/2008/1333/2023-10-31/eng
5. **FDA Food Substances search (“invertase”)** — URL visited: https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&type=basic&search=invertase
6. **FDA Food Substances detail record: INVERTASE FROM SACCHAROMYCES CEREVISIAE** — URL visited: https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE
7. **FDA GRAS Notice GRN 88 detail** — URL visited: https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=GRASNotices&id=88
8. **eCFR API Title 21 full XML (issue date 2026-02-19)** — URL visited: https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml
9. **WHO/JECFA API search by partial name (“invertase”)** — URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/invertase
10. **WHO/JECFA invertase chemical page (ID 1726)** — URL visited: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1726
11. **IARC list page** — URL visited: https://monographs.iarc.who.int/list-of-classifications/
12. **IARC classifications data script used by list page** — URL visited: https://webapi.iarc.who.int/loc/loc.app.js
EOF' in /home/exedev/chewber succeeded in 51ms:


thinking
**Ensuring JSON schema compliance**
exec
/bin/bash -lc 'date -u +%Y-%m-%dT%H:%M:%SZ' in /home/exedev/chewber succeeded in 51ms:
2026-02-27T02:52:40Z

thinking
**Constructing regulatory JSON structure**
exec
/bin/bash -lc "cat > /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json <<'EOF'
{
  \"schema_version\": 1,
  \"research_metadata\": {
    \"date\": \"2026-02-27T02:52:40Z\",
    \"prompt_version\": \"1.0\"
  },
  \"identity\": {
    \"e_number\": \"E1103\",
    \"name\": \"Invertase (beta-fructofuranosidase)\",
    \"cas_numbers\": [
      \"977122-97-6\"
    ],
    \"synonyms\": [
      \"beta-fructofuranosidase\",
      \"beta-d-fructofuranoside fructohydrolase\",
      \"Invertase from Saccharomyces cerevisiae\"
    ],
    \"chemical_class\": \"Food-processing enzyme (glycoside hydrolase)\",
    \"origin\": \"natural\"
  },
  \"function\": {
    \"primary_category\": \"enzyme (processing aid)\",
    \"secondary_categories\": [
      \"stabilizer or thickener\"
    ],
    \"mechanism\": \"Hydrolyzes sucrose into glucose and fructose (invert sugar).\",
    \"common_food_categories\": [
      \"confectionery processes\",
      \"sugar syrup/invert syrup manufacturing\",
      \"general food manufacturing enzyme uses under cGMP\"
    ]
  },
  \"regulatory\": {
    \"efsa\": {
      \"status\": \"approved\",
      \"adi\": {
        \"value\": null,
        \"unit\": \"mg/kg bw/day\",
        \"basis\": \"No numerical ADI was set in the latest EFSA invertase food-enzyme opinion (2024); conclusion was no safety concern under intended use.\"
      },
      \"last_evaluation_year\": 2024,
      \"key_finding\": \"EFSA FEZ (2024, e9128) concluded beta-fructofuranosidase from Saccharomyces cerevisiae does not give rise to safety concerns under intended conditions of use.\"
    },
    \"fda\": {
      \"status\": \"gras\",
      \"cfr_citation\": \"21 CFR 184.1(b) (cGMP framework for affirmed GRAS direct food ingredients); 21 CFR 170.3(o) (technical effects). No invertase-specific named section was found in current eCFR Title 21 XML.\",
      \"notes\": null
    },
    \"jecfa\": {
      \"adi\": {
        \"value\": null,
        \"unit\": \"mg/kg bw/day\",
        \"basis\": \"WHO/JECFA database lists ADI as 'NOT SPECIFIED' for invertase from Saccharomyces cerevisiae (ID 1726).\"
      },
      \"last_evaluation_year\": 2001
    },
    \"iarc_classification\": null,
    \"notable_bans\": []
  },
  \"safety_evidence\": {
    \"concerns\": [
      {
        \"category\": \"allergenic\",
        \"summary\": \"EFSA evaluations note that dietary allergic reactions cannot be excluded; one dossier found sequence homology with a tomato allergen, but overall likelihood was described as low.\",
        \"evidence_strength\": \"weak\",
        \"key_references\": [
          \"EFSA Journal 2024;22(12):e9128 (PMID 39698587)\",
          \"EFSA Journal 2025;23(10):e9674 (PMID 41103772)\"
        ]
      }
    ],
    \"no_concern_confirmed\": [
      \"EFSA 2024 invertase opinion concluded no safety concern under intended conditions of use.\",
      \"Recent EFSA 2025/2026 beta-fructofuranosidase evaluations reported no genotoxicity concern and high NOAEL values in 90-day studies where required.\",
      \"JECFA assigned ADI 'not specified' with GMP-limited use.\"
    ],
    \"adi_exceedance\": {
      \"at_risk\": false,
      \"populations\": [
        \"tomato-allergic individuals (potential low-likelihood sensitivity flagged in one EFSA dossier)\"
      ],
      \"notes\": \"No numeric ADI was established by EFSA/JECFA for invertase, so standard ADI exceedance analysis is not directly applicable.\"
    }
  },
  \"risk_assessment\": {
    \"recommended_level\": \"risk_free\",
    \"confidence\": 0.75,
    \"rationale\": \"Regulatory evaluations are consistently favorable (EFSA no-safety-concern conclusions; JECFA ADI not specified with GMP controls; FDA GRAS notice with no-questions outcome). No IARC carcinogenic classification was identified. Main residual uncertainty is low-probability allergenicity in sensitive individuals.\",
    \"key_factors\": [
      \"EFSA 2024 conclusion of no safety concern under intended use\",
      \"JECFA ADI not specified (2001) with GMP limitation\",
      \"FDA GRAS notice GRN 88 closed with 'FDA has no questions'\",
      \"No IARC listing/classification found for invertase\"
    ]
  },
  \"sources\": [
    {
      \"title\": \"EFSA Journal publication page for e9128\",
      \"url\": \"https://www.efsa.europa.eu/en/efsajournal/pub/9128\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"PubMed EFSA abstract fetch for PMID 39698587\",
      \"url\": \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39698587&rettype=abstract&retmode=text\",
      \"type\": \"study\"
    },
    {
      \"title\": \"PubMed EFSA abstract fetch for PMIDs 40071032, 41103772, 41531465\",
      \"url\": \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40071032,41103772,41531465&rettype=abstract&retmode=text\",
      \"type\": \"study\"
    },
    {
      \"title\": \"Regulation (EC) No 1333/2008 consolidated text\",
      \"url\": \"https://eur-lex.europa.eu/eli/reg/2008/1333/2023-10-31/eng\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"FDA Substances Added to Food search (invertase)\",
      \"url\": \"https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&type=basic&search=invertase\",
      \"type\": \"database\"
    },
    {
      \"title\": \"FDA Substances Added to Food detail: INVERTASE FROM SACCHAROMYCES CEREVISIAE\",
      \"url\": \"https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=FoodSubstances&id=INVERTASEFROMSACCHAROMYCESCEREVISIAE\",
      \"type\": \"database\"
    },
    {
      \"title\": \"FDA GRAS Notice GRN 88 detail page\",
      \"url\": \"https://hfpappexternal.fda.gov/Scripts/Fdcc/index.cfm?set=GRASNotices&id=88\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"eCFR API Title 21 full XML (2026-02-19 issue date)\",
      \"url\": \"https://www.ecfr.gov/api/versioner/v1/full/2026-02-19/title-21.xml\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"WHO/JECFA API search by partial name: invertase\",
      \"url\": \"https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/invertase\",
      \"type\": \"database\"
    },
    {
      \"title\": \"WHO/JECFA chemical page for INVERTASE from SACCHAROMYCES CEREVISIAE (ID 1726)\",
      \"url\": \"https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1726\",
      \"type\": \"database\"
    },
    {
      \"title\": \"IARC List of Classifications page\",
      \"url\": \"https://monographs.iarc.who.int/list-of-classifications/\",
      \"type\": \"database\"
    },
    {
      \"title\": \"IARC classifications dataset script used by list page\",
      \"url\": \"https://webapi.iarc.who.int/loc/loc.app.js\",
      \"type\": \"database\"
    }
  ]
}
EOF" in /home/exedev/chewber succeeded in 51ms:

exec
/bin/bash -lc "jq . /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json > /tmp/e1103_jq_check.json && echo 'jq validation: OK'" in /home/exedev/chewber succeeded in 51ms:
jq validation: OK

thinking
**Checking file content details**
exec
/bin/bash -lc 'ls -l /home/exedev/chewber/research/additives/E1103 && wc -l /home/exedev/chewber/research/additives/E1103/E1103-report.md /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json' in /home/exedev/chewber succeeded in 51ms:
total 16
-rw-r--r-- 1 exedev exedev 6422 Feb 27 02:53 E1103-abstraction.json
-rw-r--r-- 1 exedev exedev 7871 Feb 27 02:52 E1103-report.md
   95 /home/exedev/chewber/research/additives/E1103/E1103-report.md
  158 /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json
  253 total

thinking
**Summarizing research outcomes**
codex
Completed. I researched live sources (web + shell), then wrote both files:

- [E1103-report.md](/home/exedev/chewber/research/additives/E1103/E1103-report.md)
- [E1103-abstraction.json](/home/exedev/chewber/research/additives/E1103/E1103-abstraction.json)

`jq` validation succeeded:
- `jq . /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json` → OK

Brief findings summary:
- EFSA: latest invertase opinion found was 2024 (e9128), no numerical ADI set, conclusion was no safety concern under intended use.
- FDA/CFR: FDA GRN 88 shows “FDA has no questions” with cGMP use; no invertase-specific named section string was found in current Title 21 eCFR XML, so CFR context was documented via framework sections.
- JECFA/WHO: ADI “NOT SPECIFIED,” last evaluation year 2001.
- IARC: no invertase listing/classification found.
- PubMed: recent EFSA safety evaluations (2025–2026) were included and are consistent with low concern under intended use.
tokens used
231,191
Completed. I researched live sources (web + shell), then wrote both files:

- [E1103-report.md](/home/exedev/chewber/research/additives/E1103/E1103-report.md)
- [E1103-abstraction.json](/home/exedev/chewber/research/additives/E1103/E1103-abstraction.json)

`jq` validation succeeded:
- `jq . /home/exedev/chewber/research/additives/E1103/E1103-abstraction.json` → OK

Brief findings summary:
- EFSA: latest invertase opinion found was 2024 (e9128), no numerical ADI set, conclusion was no safety concern under intended use.
- FDA/CFR: FDA GRN 88 shows “FDA has no questions” with cGMP use; no invertase-specific named section string was found in current Title 21 eCFR XML, so CFR context was documented via framework sections.
- JECFA/WHO: ADI “NOT SPECIFIED,” last evaluation year 2001.
- IARC: no invertase listing/classification found.
- PubMed: recent EFSA safety evaluations (2025–2026) were included and are consistent with low concern under intended use.
__FILES_WRITTEN__
