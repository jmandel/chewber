OpenAI Codex v0.105.0 (research preview)
--------
workdir: /home/exedev/chewber
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: danger-full-access
reasoning effort: high
reasoning summaries: auto
session id: 019c9cf4-6d70-79f2-bbe5-fb97e47bdfe7
--------
user
Research food additive E110 (Sunset Yellow FCF).

## STEP 1 — GATHER REAL DATA (mandatory)

You MUST use your web search and shell tools to visit authoritative sources and extract real data.
Do NOT skip this step. Do NOT rely on memory alone — actually search and read real pages.

1. **EFSA**: Search for "E110" or "Sunset Yellow FCF" on efsa.europa.eu to find the
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

File 1: /home/exedev/chewber/research/additives/E110/E110-report.md
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

File 2: /home/exedev/chewber/research/additives/E110/E110-abstraction.json
  A single valid JSON object (no markdown fences, no commentary) matching this schema:
  {
    "schema_version": 1,
    "research_metadata": { "date": "<ISO-8601>", "prompt_version": "1.0" },
    "identity": { "e_number": "E110", "name": "...", "cas_numbers": [...], "synonyms": [...], "chemical_class": "...", "origin": "synthetic|natural|semi-synthetic" },
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
- The JSON must be valid (parseable by jq). Verify with: jq . /home/exedev/chewber/research/additives/E110/E110-abstraction.json
- Use null for values you genuinely could not find after searching.
- Every URL in sources should be a real URL you actually visited, not a guessed one.
- After writing both files, confirm with a brief summary.
mcp startup: no servers

thinking
**Planning data gathering strategy**
codex
I’m starting with source collection from EFSA, eCFR/FDA, JECFA/WHO, IARC, and PubMed, then I’ll extract only data I can verify from pages I actually open. After that I’ll write the markdown report and JSON and validate the JSON with `jq`.
🌐 Searching the web...
🌐 Searched: EFSA Sunset Yellow FCF E110 re-evaluation ADI

thinking
**Planning authoritative source review**
🌐 Searching the web...
🌐 Searched: ecfr 21 CFR 74.706 FD&C Yellow No. 6

thinking
**Correcting domain placement and updating commentary**
codex
I found the key EFSA re-evaluation entry and now I’m drilling into eCFR directly to capture exact CFR citations and conditions for FD&C Yellow No. 6 (the U.S. name for Sunset Yellow FCF).
🌐 Searching the web...
🌐 Searched: 21 CFR 74.706 FD&C Yellow No. 6 ecfr.gov

thinking
**Assessing eCFR API access alternative**
codex
eCFR HTML is CAPTCHA-blocked in this environment, so I’m switching to the official eCFR API endpoints on `ecfr.gov` to extract the same Title 21 section text and citations.
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/titles/21.xml' | head -n 40" in /home/exedev/chewber succeeded in 174ms:
<?xml version="1.0" encoding="UTF-8"?>
<hash>
  <status type="integer">404</status>
  <error>Not Found</error>
</hash>

thinking
**Searching ECFR API endpoints**
🌐 Searching the web...
🌐 Searched: eCFR API title 21 json endpoint

thinking
**Testing direct API search**
codex
I’ve confirmed the HTML search path is unreliable here, so I’m querying eCFR’s official search API directly for Title 21 matches and then opening the returned section URLs.
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/search/v1/results?query=sunset%20yellow%20fcf&per_page=10&page=1' | jq '.results[] | {title,subtitle,display_hierarchy,score}' | head -n 120" in /home/exedev/chewber succeeded in 240ms:


thinking
**Inspecting raw endpoint response**
exec
/bin/bash -lc "curl -i -sS 'https://www.ecfr.gov/api/search/v1/results?query=yellow%20no.%206&per_page=5&page=1' | head -n 80" in /home/exedev/chewber succeeded in 240ms:
HTTP/2 200 
date: Fri, 27 Feb 2026 02:36:59 GMT
content-type: application/json; charset=utf-8
content-length: 7860
status: 200 OK
referrer-policy: strict-origin-when-cross-origin
x-permitted-cross-domain-policies: none
x-xss-protection: 0
x-request-id: Root1-69a1034b-324059ca4ac862881b2f8e5e
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
vary: Origin, Accept-Encoding
age: 0
accept-ranges: bytes
cache-control: no-store, no-cache, must-revalidate, private
pragma: no-cache
strict-transport-security: max-age=31536000; includeSubDomains; preload

{"results":[{"starts_on":"2016-12-29","ends_on":null,"type":"Section","hierarchy":{"title":"21","subtitle":null,"chapter":"I","subchapter":"A","part":"74","subpart":"C","subject_group":null,"section":"74.2706","appendix":null},"hierarchy_headings":{"title":"Title 21","subtitle":null,"chapter":" Chapter I","subchapter":"Subchapter A","part":"Part 74","subpart":"Subpart C","subject_group":null,"section":"§ 74.2706","appendix":null},"headings":{"title":"Food and Drugs","subtitle":null,"chapter":"Food and Drug Administration, Department of Health and Human Services","subchapter":"General","part":"Listing of Color Additives Subject to Certification","subpart":"Cosmetics","subject_group":null,"section":"FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e.","appendix":null},"full_text_excerpt":"specifications. The color additive FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e shall conform in identity and specifications\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003e(b). (b) Uses and restrictions. FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e may be safely used for coloring cosmetics\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003e(d) Certification. All batches of FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e shall be certified in accordance with","score":26.0233,"structure_index":10928,"reserved":false,"removed":false,"change_types":["effective","initial"]},{"starts_on":"2016-12-29","ends_on":null,"type":"Section","hierarchy":{"title":"21","subtitle":null,"chapter":"I","subchapter":"A","part":"74","subpart":"B","subject_group":null,"section":"74.1706","appendix":null},"hierarchy_headings":{"title":"Title 21","subtitle":null,"chapter":" Chapter I","subchapter":"Subchapter A","part":"Part 74","subpart":"Subpart B","subject_group":null,"section":"§ 74.1706","appendix":null},"headings":{"title":"Food and Drugs","subtitle":null,"chapter":"Food and Drug Administration, Department of Health and Human Services","subchapter":"General","part":"Listing of Color Additives Subject to Certification","subpart":"Drugs","subject_group":null,"section":"FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e.","appendix":null},"full_text_excerpt":"specifications. (1) The color additive FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e shall conform in identity and specifications\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003emixtures for drug use made with FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e may contain only those diluents that\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003edrugs. (b) Uses and restrictions. FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e may be safely used for coloring drugs","score":25.885012,"structure_index":10892,"reserved":false,"removed":false,"change_types":["effective","initial"]},{"starts_on":"2016-12-29","ends_on":null,"type":"Section","hierarchy":{"title":"21","subtitle":null,"chapter":"I","subchapter":"A","part":"82","subpart":"B","subject_group":null,"section":"82.706","appendix":null},"hierarchy_headings":{"title":"Title 21","subtitle":null,"chapter":" Chapter I","subchapter":"Subchapter A","part":"Part 82","subpart":"Subpart B","subject_group":null,"section":"§ 82.706","appendix":null},"headings":{"title":"Food and Drugs","subtitle":null,"chapter":"Food and Drug Administration, Department of Health and Human Services","subchapter":"General","part":"Listing of Certified Provisionally Listed Colors and Specifications","subpart":"Foods, Drugs, and Cosmetics","subject_group":null,"section":"FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e.","appendix":null},"full_text_excerpt":"(a) The color additive FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e shall conform in identity and specifications\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003ecurrent D\u0026C external and D\u0026C lakes of FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e shall be manufactured from previously","score":25.776274,"structure_index":10965,"reserved":false,"removed":false,"change_types":["effective","initial"]},{"starts_on":"2016-12-29","ends_on":null,"type":"Section","hierarchy":{"title":"21","subtitle":null,"chapter":"I","subchapter":"A","part":"74","subpart":"A","subject_group":null,"section":"74.706","appendix":null},"hierarchy_headings":{"title":"Title 21","subtitle":null,"chapter":" Chapter I","subchapter":"Subchapter A","part":"Part 74","subpart":"Subpart A","subject_group":null,"section":"§ 74.706","appendix":null},"headings":{"title":"Food and Drugs","subtitle":null,"chapter":"Food and Drug Administration, Department of Health and Human Services","subchapter":"General","part":"Listing of Color Additives Subject to Certification","subpart":"Foods","subject_group":null,"section":"FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e.","appendix":null},"full_text_excerpt":"color additive FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e is principally the disodium salt of \u003cstrong\u003e6\u003c/strong\u003e-hydroxy-5-[(4-sul\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003enitrite. The diazo compound is coupled with \u003cstrong\u003e6\u003c/strong\u003e-hydroxy-2-naphthalene-sulfonic acid. The dye\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003emixtures for food use made with FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e may contain only those diluents that","score":25.40425,"structure_index":10861,"reserved":false,"removed":false,"change_types":["effective","initial"]},{"starts_on":"2016-11-29","ends_on":null,"type":"Section","hierarchy":{"title":"21","subtitle":null,"chapter":"I","subchapter":"C","part":"201","subpart":"A","subject_group":null,"section":"201.20","appendix":null},"hierarchy_headings":{"title":"Title 21","subtitle":null,"chapter":" Chapter I","subchapter":"Subchapter C","part":"Part 201","subpart":"Subpart A","subject_group":null,"section":"§ 201.20","appendix":null},"headings":{"title":"Food and Drugs","subtitle":null,"chapter":"Food and Drug Administration, Department of Health and Human Services","subchapter":"Drugs: General","part":"Labeling","subpart":"General Labeling Provisions","subject_group":null,"section":"Declaration of presence of FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. 5 and/or FD\u0026amp;C \u003cstrong\u003eYellow\u003c/strong\u003e No. \u003cstrong\u003e6\u003c/strong\u003e in certain drugs for human use.","appendix":null},"full_text_excerpt":"containing FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. 5 as a color additive using the names FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. 5 and tartrazine\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003ebear a statement such as “Contains FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. 5 (tartrazine) as a color additive”\u003cspan class=\"elipsis\"\u003e…\u003c/span\u003e“Contains color additives including FD\u0026C \u003cstrong\u003eYellow\u003c/strong\u003e No. 5 (tartrazine)”. The labels of certain","score":20.131723,"structure_index":40019,"reserved":false,"removed":false,"change_types":["effective","initial"]}],"meta":{"current_page":1,"total_pages":395,"total_count":1974,"max_score":26.0233,"description":"Changes to sections matching 'yellow no. 6'"}}

thinking
**Exploring API endpoints for section extraction**
🌐 Searching the web...
🌐 Searched the web

thinking
**Considering URL access options**
🌐 Searching the web...
🌐 Searched the web

thinking
**Verifying reference availability**
🌐 Searching the web...
🌐 Searched the web

thinking
**Planning data source gathering**
🌐 Searching the web...
🌐 Searched the web

thinking
**Deciding search-then-open flow**
🌐 Searching the web...
🌐 Searched: EFSA Sunset Yellow FCF E110 re-evaluation scientific opinion

thinking
**Searching for 2014 EFSA re-evaluation**
🌐 Searching the web...
🌐 Searched: EFSA 2014 Sunset Yellow FCF temporary ADI reconsidered 2014

thinking
**Visiting source page for confirmation**
codex
I found the 2014 EFSA reconsideration (more recent than 2009), and I’m now opening it plus WHO/JECFA and IARC records to lock down ADI values and last evaluation years.
🌐 Searching the web...
🌐 Searched the web

thinking
**Testing alternative access via DOI**
codex
The EFSA pages themselves return 403 in this environment, so I’m using the DOI/EFSA metadata endpoints and cached snippets to capture the same official conclusions while documenting the access limitation.
exec
/bin/bash -lc "set -euo pipefail
for u in 'https://www.efsa.europa.eu/en/efsajournal/pub/3765' 'https://www.efsa.europa.eu/en/efsajournal/pub/1330' ; do
  echo \"URL: "'$u";
  curl -I -sS "$u" | head -n 5;
  echo;
done' in /home/exedev/chewber succeeded in 1.64s:
HTTP/2 301 
content-type: text/html; charset=utf-8
content-length: 0
location: https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2014.3765
date: Fri, 27 Feb 2026 02:37:25 GMT

URL: https://www.efsa.europa.eu/en/efsajournal/pub/1330
HTTP/2 429 
content-length: 40644
date: Fri, 27 Feb 2026 02:37:25 GMT
retry-after: 10.000
x-fpfis: 1410530


thinking
**Planning DOI access via curl**
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://efsa.onlinelibrary.wiley.com/doi/10.2903/j.efsa.2014.3765' | rg -i 'ADI|acceptable daily intake|Sunset Yellow|E 110|concluded|mg/kg' -n | head -n 40" in /home/exedev/chewber succeeded in 51ms:
1:<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box;margin:0;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%;color:#313131;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}body{display:flex;flex-direction:column;height:100vh;min-height:100vh}.main-content{margin:8rem auto;padding-left:1.5rem;max-width:60rem}@media (width <= 720px){.main-content{margin-top:4rem}}.h2{line-height:2.25rem;font-size:1.5rem;font-weight:500}@media (width <= 720px){.h2{line-height:1.5rem;font-size:1.25rem}}#challenge-error-text{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0IyMEYwMyIgZD0iTTE2IDNhMTMgMTMgMCAxIDAgMTMgMTNBMTMuMDE1IDEzLjAxNSAwIDAgMCAxNiAzbTAgMjRhMTEgMTEgMCAxIDEgMTEtMTEgMTEuMDEgMTEuMDEgMCAwIDEtMTEgMTEiLz48cGF0aCBmaWxsPSIjQjIwRjAzIiBkPSJNMTcuMDM4IDE4LjYxNUgxNC44N0wxNC41NjMgOS41aDIuNzgzem0tMS4wODQgMS40MjdxLjY2IDAgMS4wNTcuMzg4LjQwNy4zODkuNDA3Ljk5NCAwIC41OTYtLjQwNy45ODQtLjM5Ny4zOS0xLjA1Ny4zODktLjY1IDAtMS4wNTYtLjM4OS0uMzk4LS4zODktLjM5OC0uOTg0IDAtLjU5Ny4zOTgtLjk4NS40MDYtLjM5NyAxLjA1Ni0uMzk3Ii8+PC9zdmc+");background-repeat:no-repeat;background-size:contain;padding-left:34px}@media (prefers-color-scheme: dark){body{background-color:#222;color:#d9d9d9}}</style><meta http-equiv="refresh" content="360"></head><body><div class="main-wrapper" role="main"><div class="main-content"><noscript><div class="h2"><span id="challenge-error-text">Enable JavaScript and cookies to continue</span></div></noscript></div></div><script>(function(){window._cf_chl_opt = {cvId: '3',cZone: 'efsa.onlinelibrary.wiley.com',cType: 'managed',cRay: '9d444cef1fed0ccf',cH: 'xy6l76AoUyFUHQadsV5ofE8pYgJHd0mAjmM7T0tq96E-1772159848-1.2.1.1-Xuv5ov1MgqQ_JGkfn6w6gnq25BqQU7UMEmXqV_Koqdus5EcBcfPqk.accBqTH62h',cUPMDTk:"\/doi\/10.2903\/j.efsa.2014.3765?__cf_chl_tk=7gU9IwPFGWjkXxHNcKaV8xYeEa1S4pzi998Ks66pkhY-1772159848-1.0.1.1-oSWW3l977PGyc0VWAZczrTxtilc9a42raDLPFdrGjBE",cFPWv: 'b',cITimeS: '1772159848',cTplC:0,cTplV:5,cTplB: '0',fa:"\/doi\/10.2903\/j.efsa.2014.3765?__cf_chl_f_tk=7gU9IwPFGWjkXxHNcKaV8xYeEa1S4pzi998Ks66pkhY-1772159848-1.0.1.1-oSWW3l977PGyc0VWAZczrTxtilc9a42raDLPFdrGjBE",md: 'VvmQSLMIKfNMVHJ1LZ9omGB4RDeRLiScZoF.NFB_cV8-1772159848-1.2.1.1-5e1yHcEE8nz5C2_j4vUorEeuVjP4V33LahtZiejxqoTXfoxiktX_Gq5CTaNnBcfRsslzqgL6dJULnwNVK9lgKo9clR1FPRy4lnnvBsWFr300T_7JCbtknJzZUmK4QEm9e7LMPezl_Wgj7RMejryGYg8AKx97vsI28s.KWwlYUyU0uv1x_fTib357QfPo23BeC8__kDxtF6nASg9Afo0wEtVdsxaQWNadhdUHb48PNnQWbpAqwOA8Xw5Mj.mTEVH0X9DAgkDmhTf7dPtROx29htFNwz6tIqQ7RIoAWsK.OSvzbxnTBYiqEFy6RKCjMGC5oUBVoAJBTCpk44L3nS9Qc1elQaDBOB9RKmkrGrRUpXo8HZbPoH1c6cxKZWj9HszMzz9wGd1SriIrcIvWuhctWw8FipeisalQS2ZNeHzrwGgcD2tLREQEgXHH1gtdOcP1_iY.eL3cOFEUgeuPcbB8C23UrlxgcZ9R6pj1aVtF7YVb3W.WIsmj6puZ8Ga3FXZ5tFYQ48YIUGnSUKyJdekObyHN6Op.Pt_AuiRnOdpUWawkeZ8cQLpJ46tOrPpLUUhEVKVa4g_D7JITSa3STjLGvDCdeZv63qiRlsdNQ46Fae19vTYEbAZ6Ra9iFIOnonnghL14e4.8mVOc9flJ.7BeHy6rrRo4iDMiRXeELKolqV2it4Fis8WRS7xsOaSt5NRHYgu7A2Zmpk4H0UicZO2Wy7MAMeeNUP5mqLHBCu_y5hFhfBAV_iqD6FyhzW3e9lAkRDfu8znjgQTE3IBdH2oVqzqUfMrRRtMTb9upgMDxeky72gE6gOyF7k7A00KFvPmurWGVd.Upb9eQMBYSVPWNvH4Ypl3KNr8gbQPxcVVs0MNKMYCyIfMQqHXASo034vKcu8fUpmPDVFvMdnXttur9LWan5rw0D48PaPGOqRJK.i9R7PbMgquOmsJn1n27U3JfD_CI83tCEiMo8msYIRMs8LkCc63b2Lz17e.mwT7mzFbAEoojaOezzGMkjxTj9ilc',mdrd: 'ThTOIPx3a.aBwJRC_nWox.7hvwXNUAHYn8Gou9JkArM-1772159848-1.2.1.1-Z9Ks9K5dEkne7gD_F.jCxwIAt7eA3Yt96sqXdVfCK7uECwr2C6emqBTtP1mSPdro7S3I1CL4SIuwfzO.GFtD6piUrg0ffZOiPvGO_QDWjJ7.g48bBnTGtqIkJLWkq8YCr1lWLPRsODVTf53uZN.0L1zjVtjSt8S3qEvRX3FA5b3sAFUHUI0vKKApNgr8.Y84kPWJ5l2ivcsm.3GP3ctSh4YYpr_DkDilzM7_ehyKtn6Oc5Noexa3d8KrcALk3w.wsYWHJOdx2c19WPi7WcUu3zg0dFH.UsCCOjQyaMdTMd03JFFOTjK92AJiJv7RIpMQ8chEsFTMtijmxkvxLf1sWsrBuTZXlY7xIfCb08CqWouXKQnRRSgOZrqTD5BLXtACWCn8YPk43sMjNHuJpjckvXe0WT0_tFTGKcvUkPUZL9VaeSk_OOJBfh0a.ZFYOHMp_mLDw5Sj8aOpj2l7DF_ODW_pjvBbhGnlBoOavIsmDcpSHDO5grwRWAjeMy_gN7EmvCfwWLnm3Wt0EYXTE5Uzc5o5uI9sNeCH7XS88mO4VMXApNoIwXDhVMWf02kDdt9NNptNLHjjg9A.vRns7zTVOMB0HZAaRY0azvobeDDHkMAHLQFTu2Gi5CUopmuuWhDnqgaJc5nW0UklSNscLI6ewPHDlJFl788unB52l4qtXUsrbvj83rLvQJdNJjggBNc8ZDagqxULR.SQqEUf4AvTwcjASYg7CnRQa3n1DFwGmAbv_HZtnk1AJdORYEM8qt.VidXE7wWH.hQBQs9IWFD.KIPg4FF1A0F1OcRT5gN3NNRhGOfw9rKu.DD8.WxxLlnYkIXsj_0WvVwJpDLbMdrYN46iB77ZwyQsaPaLg2hitRNAAdGcSXAdXv89tDL97vuN9cFN9pwY7E1pKhrhqmhrtyy2fSzFx0Rn8wjRG6vxbY6NewaRrghHcBh2IWzDCT4Z4k8QulQtI21E08sO6jeX.8GDBuMsPuhrZ8mBcXH1w_RL4DWkG9YrlCp4ydq5sIKZnt4BTP4gBmM.gme3nuHLZgAG8FhJarWzNc5aiXAtnhmT8oAjUO6znnwXqUC8M87c.v_OdSMakYMXa7L8zWSdCjfcRBOk5oO6sY.Qvzew9I5wepouUFZ46XXmoDOsjwOvFrFGvjSD62TDnD6UtFrbC.ssPqPcizF0iXp4fk1ULaATByeW1JRvSwSUSzrYar6tWmpdd9Wl.z.Ia3Cgzi4Dh.VMutzpVtii6GcVpQEvZf_yZA93pLcMI7ZjOmju2rgTNaD91pe8SjFgxcpkuFttne9zgG_oHZZD.zaszF_vBwq7Hc_0SvGkfoc._F3_udg5Vs_tVaDVjy3UkqXFGL7fdScGKQgz0Nvma4cNfNdmDyRRP2HLuBoDa0q3mFtJ1x46Lq3i972Ri3QXTloLrZEVWKHw0b3UT86tBHVlSUaszvsmK0FRrVGb0jQrE.HenjQlfVpD7Lj83kUhEQcZnUYuQ9NP2YJgvEoR3UAt9SvSwxdK3AgHSvTdcZtf5vE62Q2OiBR75fzS68Cs8em79CfOj_9RZoWSRHm7mLYo0oxZ4zNPHrDgfOpNaACztpcmccF6pn3nbcvOKT0NsI_f0jwIiekLTwO89qFSVL6sSahTEx4AbyzTgFmd8pYt7MMBKnSGZ8oN1.7vu0p8N6jUA2i6OdmIHZZJpC3btrSc_w1V_.BiovxswQb0zxze8w3DmXgv4sz1YzOHMl399dAQdAlmGRhpz.y42RCuHTfvDP2._WigIrsqZtZzxHzv6d4XQ1BqW8yLNSegZcu__n6AosFQXTwmaX_Vvi0vbC9eLZyPfZEu6eB5Y2ipTft1KwpSetGmLPI5i.kFA50n1wp2B04tnzkRun7kOVrkzH48UoZFOKOAeGgR_M94yVCJ5ywiv4Yfjf_Vnm3JHBOnZ0S1oQN5ruTSz76k1k3nW8tprKVEQ.hoq9QxQtqJXXgvIkHSpPkKxqNHCenpK5R6JGNVUQFEsv2Fz3h_f_XwOCOPCQs5GEi6MqWlB0EhFtkHk3iyrxvBq.CRlmprOmsncGV_NY0XMojatoawlyi1APwNjhy7hgNSGk9unQP7rzFVlgYcpXOR1QrzJAIR1zuwDqS1tTcDn_2nC27WyKYClBAcMQgYAQbOmmYtyxvMWPkAnUBlYd8ikYSpAwP3wg0lXHyTGApaKtmX21FRcoOarpVZ7q7Gh70Sk423u1GiGSPxKVPfZ5HTA7gr2FeQvrbwwAw674uqVFe3DDtLH.BfS0l9BsIw9YD1wT9Fr9XD3jyT7B1WuU0eo18VGzlWXCvQjt4tq6lvgNPSza35tKpjfvWJ2I5.E_xoI1L8tCmqUin0mpJ6ZQCnyWDeUI8mQFykJCEnVrKQmwNAjMXGKwCq0huQk7S1S4nHhOP7OC9czVWlc0qbMwPP516mX2WuJffDXPtXyEcBgAwOJjCmxvtHGa4tY6ib48foXy20l.fH61n9xR7GVdM.PJj57b4POm4orCphRG_fww',};var a = document.createElement('script');a.src = '/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page/v1?ray=9d444cef1fed0ccf';window._cf_chl_opt.cOgUHash = location.hash === '' && location.href.indexOf('#') !== -1 ? '#' : location.hash;window._cf_chl_opt.cOgUQuery = location.search === '' && location.href.slice(0, location.href.length - window._cf_chl_opt.cOgUHash.length).indexOf('?') !== -1 ? '?' : location.search;if (window.history && window.history.replaceState) {var ogU = location.pathname + window._cf_chl_opt.cOgUQuery + window._cf_chl_opt.cOgUHash;history.replaceState(null, null,"\/doi\/10.2903\/j.efsa.2014.3765?__cf_chl_rt_tk=7gU9IwPFGWjkXxHNcKaV8xYeEa1S4pzi998Ks66pkhY-1772159848-1.0.1.1-oSWW3l977PGyc0VWAZczrTxtilc9a42raDLPFdrGjBE"+ window._cf_chl_opt.cOgUHash);a.onload = function() {history.replaceState(null, null, ogU);}}document.getElementsByTagName('head')[0].appendChild(a);}());</script></body></html>







thinking
**Assessing alternative EFSA sources**
thinking
**Considering WHO database for records**
thinking
**Confirming last evaluation year**
thinking
**Planning year extraction strategy**
thinking
**Testing line-opening behavior**
thinking
**Verifying latest evaluation year**
thinking
**Exploring alternative data fetching strategies**
codex
I’ve opened the FAO/WHO JECFA additive page and confirmed the ADI entry; next I’m querying the WHO JECFA database endpoints to pin down the latest evaluation year precisely.
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/search.aspx' | head -n 120" in /home/exedev/chewber exited 23 in 791ms:
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
**Planning query search approach**
🌐 Searching the web...
🌐 Searched: site:apps.who.int/food-additives-contaminants-jecfa-database Sunset Yellow FCF JECFA database








thinking
**Planning chemical ID lookup**
thinking
**Accessing detailed evaluation data**
thinking
**Planning IARC classification search**
thinking
**Planning chemical synonym search**
thinking
**Verifying additive classification sources**
thinking
**Searching for pattern occurrence**
thinking
**Testing search approach with identifier**
thinking
**Exploring eCFR API endpoints**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/' | rg -o '/api/["'^"]+'"' | head -n 80" in /home/exedev/chewber exited 1 in 161ms:


thinking
**Inspecting static JS versioning**
exec
/bin/bash -lc "curl -sS 'https://www.ecfr.gov/' | rg -i 'api|versioner|search/v1' | head -n 120" in /home/exedev/chewber succeeded in 162ms:


thinking
**Inspecting page header for scripts**
exec
/bin/bash -lc "curl -sS 'https://www.ecfr.gov/' | head -n 120" in /home/exedev/chewber succeeded in 178ms:


thinking
**Adding user-agent header**
exec
/bin/bash -lc "curl -i -sS 'https://www.ecfr.gov/' | head -n 40" in /home/exedev/chewber succeeded in 174ms:
HTTP/2 302 
date: Fri, 27 Feb 2026 02:38:06 GMT
content-length: 0
location: https://unblock.federalregister.gov
strict-transport-security: max-age=31536000; includeSubDomains; preload



thinking
**Planning API endpoint exploration**
thinking
**Investigating API endpoints**
codex
I can access eCFR’s API but not the browser UI; I’m now using the documented API routes to pull the actual text of `21 CFR 74.706` for exact use restrictions.
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/versions/title-21.json' | jq 'keys'" in /home/exedev/chewber succeeded in 605ms:
[
  "content_versions",
  "meta"
]
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/versions/title-21.json' | jq '.content_versions[0:5]'" in /home/exedev/chewber succeeded in 596ms:
[
  {
    "date": "2016-12-29",
    "amendment_date": "2016-12-29",
    "issue_date": "2016-12-31",
    "identifier": "1.1",
    "name": "§ 1.1   General.",
    "part": "1",
    "substantive": true,
    "removed": false,
    "subpart": "A",
    "title": "21",
    "type": "section"
  },
  {
    "date": "2016-12-29",
    "amendment_date": "2016-12-29",
    "issue_date": "2016-12-31",
    "identifier": "1.3",
    "name": "§ 1.3   Definitions.",

thinking
**Checking identifier filtering**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/versions/title-21.json' | jq -r '.content_versions[] | select(.identifier==\"74.706\") | @json' | head -n 20" in /home/exedev/chewber succeeded in 599ms:
{"date":"2016-12-29","amendment_date":"2016-12-29","issue_date":"2016-12-31","identifier":"74.706","name":"§ 74.706   FD&C Yellow No. 6.","part":"74","substantive":true,"removed":false,"subpart":"A","title":"21","type":"section"}

thinking
**Testing full text endpoint**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/full/2016-12-29/title-21.xml' | head -n 20" in /home/exedev/chewber succeeded in 177ms:
{"error":"No matching content found."}



thinking
**Checking API path format**
thinking
**Confirming API docs availability**
thinking
**Assessing API version and endpoint issues**
exec
/bin/bash -lc "curl -sS 'https://www.ecfr.gov/api/versioner/v1/full/2020-04-01/title-7.xml' | head -n 5" in /home/exedev/chewber
thinking
**Handling long-running command output**

thinking
**Handling incomplete output due to buffering**



thinking
**Assessing API endpoint patterns**
thinking
**Planning document lookup by ID**
thinking
**Testing eCFR API accessibility**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/developers/documentation/api/v1' | head -n 120" in /home/exedev/chewber succeeded in 171ms:

exec
/bin/bash -lc "curl -i -sS 'https://www.ecfr.gov/developers/documentation/api/v1' | head -n 60" in /home/exedev/chewber succeeded in 160ms:
HTTP/2 302 
date: Fri, 27 Feb 2026 02:38:59 GMT
content-length: 0
location: https://unblock.federalregister.gov
strict-transport-security: max-age=31536000; includeSubDomains; preload


thinking
**Investigating API endpoints**
exec
/bin/bash -lc "set -euo pipefail
for u in \\
'https://www.ecfr.gov/api/versioner/v1/openapi.json' \\
'https://www.ecfr.gov/api/versioner/v1/swagger.json' \\
'https://www.ecfr.gov/api/versioner/v1/openapi.yaml' \\
'https://www.ecfr.gov/api/versioner/v1/'; do
  echo \"=== "'$u";
  curl -i -sS "$u" | head -n 20;
  echo;
done' in /home/exedev/chewber succeeded in 1.01s:
HTTP/2 404 
date: Fri, 27 Feb 2026 02:39:06 GMT
content-type: application/json; charset=UTF-8
content-length: 34
status: 404 Not Found
vary: Origin
x-request-id: Root1-69a103ca-50622ed27a3f05284f93aeaa
age: 0
cache-control: no-store, no-cache, must-revalidate, private
pragma: no-cache
strict-transport-security: max-age=31536000; includeSubDomains; preload

{"status":404,"error":"Not Found"}
=== https://www.ecfr.gov/api/versioner/v1/swagger.json
HTTP/2 404 
date: Fri, 27 Feb 2026 02:39:06 GMT
content-type: application/json; charset=UTF-8
content-length: 34
status: 404 Not Found
vary: Origin

thinking
**Testing endpoint date parameter**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/versions/title-21.json' | jq -r '.content_versions[] | select(.type==\"title\") | [.date,.identifier,.name] | @tsv' | tail -n 20" in /home/exedev/chewber succeeded in 613ms:

 succeeded in 50.24s:
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>504 Gateway Time-out</title>

thinking
**Exploring versions endpoint**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/versions.json' | jq '. | keys'" in /home/exedev/chewber succeeded in 174ms:
[
  "error"
]

thinking
**Testing titles and amendments endpoint**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/titles.json' | jq 'keys'" in /home/exedev/chewber succeeded in 189ms:
[
  "meta",
  "titles"
]

thinking
**Inspecting title21 for reserved date**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/titles.json' | jq '.titles[] | select(.number==21)'" in /home/exedev/chewber succeeded in 170ms:
{
  "number": 21,
  "name": "Food and Drugs",
  "latest_amended_on": "2026-02-19",
  "latest_issue_date": "2026-02-19",
  "up_to_date_as_of": "2026-02-25",
  "reserved": false
}

thinking
**Testing date parameter usage**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' | head -n 15" in /home/exedev/chewber exited 23 in 462ms:
<?xml version="1.0" encoding="UTF-8"?>
<ECFR>



<DIV1 N="21" TYPE="TITLE">

<HEAD>Title 21—Food and Drugs</HEAD>


<DIV3 N="I" TYPE="CHAPTER">

<HEAD> CHAPTER I—FOOD AND DRUG ADMINISTRATION, DEPARTMENT OF HEALTH AND HUMAN SERVICES</HEAD>

<DIV4 N="A" TYPE="SUBCHAP">
curl: (23) Failure writing output to destination

thinking
**Extracting specific XML section**
codex
I located the correct eCFR full-content API date (`2026-02-25`) and can now extract exact `21 CFR 74.706` language from Title 21 XML.
exec
/bin/bash -lc 'set -euo pipefail
TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
# show section header and key provisions around 74.706
rg -n '"'74\\.706|FD&C Yellow No\\. 6|Uses and restrictions|Certification' \""'$TMP" | head -n 40
# extract small window around the first 74.706 match
line=$(rg -n '"'74\\.706' \""'$TMP" | head -n1 | cut -d: -f1)
if [ -n "$line" ]; then
  start=$((line-20)); [ $start -lt 1 ] && start=1
  end=$((line+220))
  sed -n "${start},${end}p" "$TMP" | sed -n '"'1,220p'
fi" in /home/exedev/chewber exited 1 in 1.21s:
3134:<HEAD>Subpart M—Accreditation of Third-Party Certification Bodies To Conduct Food Safety Audits and To Issue Certifications</HEAD>
3698:<HEAD>Accreditation of Third-Party Certification Bodies Under This Subpart</HEAD>
3794:<HEAD>Requirements for Third-Party Certification Bodies That Have Been Accredited Under This Subpart</HEAD>
4111:<HEAD>Procedures for Accreditation of Third-Party Certification Bodies Under This Subpart</HEAD>
4266:<HEAD>Additional Procedures for Direct Accreditation of Third-Party Certification Bodies Under This Subpart</HEAD>
8327:<FP1-2>Division of Color Certification and Technology.
11442:<HD2>E. Certification
11542:<P>(c) <I>Certification.</I> (1) FDA will not consider for review a petition that is subject to this section unless the petition is in writing and contains the following certification:
15388:<P>(c) All deposits and fees required by this section are to be paid by money order, bank draft, or certified check drawn to the order of the Food and Drug Administration, collectible at par in Washington, DC. All deposits and fees are to be forwarded to the Associate Commissioner for Management and Operations, Food and Drug Administration, 5600 Fishers Lane, Rockville, MD 20857, and after appropriate record of them is made, they will be transmitted to the Treasurer of the United States for deposit in the special account “Salaries and Expenses, Certification, Inspection, and Other Services, Food and Drug Administration.”
16992:<HEAD>§ 20.3   Certification and authentication of Food and Drug Administration records.</HEAD>
19983:<P>(c) In the European Community (EC), the qualified person will be relieved of responsibility for carrying the controls laid down in Article 22 paragraph 1(b) of Council Directive 75/319/EEC (see appendix A of this subpart) provided that these controls have been carried out in the United States and that each batch/lot is accompanied by a batch certificate (in accordance with the World Health Organization Certification Scheme on the Quality of Medicinal Products) issued by the manufacturer certifying that the product complies with requirements of the marketing authorization and signed by the person responsible for releasing the batch/lot.
25208:<HEAD>§ 54.4   Certification and disclosure requirements.</HEAD>
25213:<P>(1) Certification: The applicant covered by this section shall submit for all clinical investigators (as defined in § 54.2(d)), to whom the certification applies, a completed Form FDA 3454 attesting to the absence of financial interests and arrangements described in paragraph (a)(3) of this section. The form shall be dated and signed by the chief financial officer or other responsible corporate official or representative.
26991:<P>(e) <I>Color Certification Branch</I> means the unit established within the Food and Drug Administration located in the Center for Food Safety and Applied Nutrition, charged with the responsibility for the mechanics of the certification procedure hereinafter described, and including the examination of samples of color additives subject to certification.
27115:<P>(p) All deposits and fees required by the regulations in this section shall be paid by money order, bank draft or certified check drawn to the order of the Food and Drug Administration, collectible at par at Washington, DC All deposits and fees shall be forwarded to the Center for Food Safety and Applied Nutrition (HFS-200), Food and Drug Administration, 5001 Campus Dr., College Park, MD 20740, whereupon after making appropriate record thereof they will be transmitted to the Treasurer of the United States for deposit in the special account “Salaries and Expenses, Certification, Inspection, and Other Services, Food and Drug Administration.”
27159:<P>(d) <I>Special labeling for color additives not exempt from certification.</I> Color additives not exempt from the certification procedures shall in addition include in the labeling the lot number assigned by the Color Certification Branch, except that in the case of any mixture for household use which contains not more than 15 percent of pure color and which is in packages containing not more than 3 ounces there appears on the label, a code number which the manufacturer has identified with the lot number by giving to the Food and Drug Administration written notice that such code number will be used in lieu of the lot number.
27818:<P>(c) <I>Uses and restrictions.</I> Annatto extract may be safely used for coloring foods generally, in amounts consistent with good manufacturing practice, except that it may not be used to color foods for which standards of identity have been promulgated under section 401 of the act unless added color is authorized by such standards.
27822:<P>(e) <I>Exemption from certification.</I> Certification of this color additive is not necessary for the protection of the public health and therefore batches thereof are exempt from the certification requirements of section 721(c) of the act.
27855:<P>(c) <I>Uses and restrictions.</I> Antarctic krill meal may be safely used in salmonid feed in accordance with the following prescribed conditions:
27871:<P>(e) <I>Exemption from certification.</I> Certification of this color additive is not necessary for the protection of the public health, and therefore batches thereof are exempt from the certification requirements of section 721(c) of the Federal Food, Drug, and Cosmetic Act.


thinking
**Refining search strategy for exact matches**
thinking
**Adjusting command to prevent exit**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
rg -n '"'74\\.706|74\\.1706|74\\.2706|FD&amp;C Yellow No\\. 6|Yellow No\\. 6|FD&C Yellow No\\. 6|N=\"74\\.706\"' \""'$TMP" | head -n 100 || true
' in /home/exedev/chewber succeeded in 1.17s:
31958:<DIV8 N="74.706" TYPE="SECTION" VOLUME="1">
31959:<HEAD>§ 74.706   FD&amp;C Yellow No. 6.</HEAD>
31960:<P>(a) <I>Identity.</I> (1) The color additive FD&amp;C Yellow No. 6 is principally the disodium salt of 6-hydroxy-5-[(4-sulfophenyl)azo]-2-naphthalenesulfonic acid (CAS Reg. No. 2783-94-0). The trisodium salt of 3-hydroxy-4-[(4-sulfophenyl)azo]-2,7-naphthalenedisulfonic acid (CAS Reg. No. 50880-65-4) may be added in small amounts. The color additive is manufactured by diazotizing 4-aminobenzenesulfonic acid using hydrochloric acid and sodium nitrite or sulfuric acid and sodium nitrite. The diazo compound is coupled with 6-hydroxy-2-naphthalene-sulfonic acid. The dye is isolated as the sodium salt and dried. The trisodium salt of 3-hydroxy-4-[(4-sulfophenyl)azo]-2,7-naphthalenedisulfonic acid which may be blended with the principal color is prepared in the same manner except the diazo benzenesulfonic acid is coupled with 3-hydroxy-2,7-naphthalenedisulfonic acid.
31962:<P>(2) Color additive mixtures for food use made with FD&amp;C Yellow No. 6 may contain only those diluents that are suitable and that are listed in part 73 of this chapter as safe for use in color additive mixtures for coloring foods.
31964:<P>(b) <I>Specifications.</I> The color additive FD&amp;C Yellow No. 6 shall conform to the following specifications and shall be free from impurities other than those named to the extent that such other impurities may be avoided by current good manufacturing practice:
32004:<P>(c) <I>Uses and restrictions.</I> The color additive FD&amp;C Yellow No. 6 may be safely used for coloring foods (including dietary supplements) generally in amounts consistent with current good manufacturing practice, except that it may not be used to color foods for which standards of identity have been promulgated under section 401 of the act unless added color is authorized by such standards.
32010:<P>(e) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
33199:<DIV8 N="74.1706" TYPE="SECTION" VOLUME="1">
33200:<HEAD>§ 74.1706   FD&amp;C Yellow No. 6.</HEAD>
33201:<P>(a) <I>Identity and specifications.</I> (1) The color additive FD&amp;C Yellow No. 6 shall conform in identity and specifications to the requirements of § 74.706(a)(1) and (b).
33203:<P>(2) Color additive mixtures for drug use made with FD&amp;C Yellow No. 6 may contain only those diluents that are suitable and that are listed in part 73 of this chapter as safe for use in color additive mixtures for coloring drugs.
33205:<P>(b) <I>Uses and restrictions.</I> FD&amp;C Yellow No. 6 may be safely used for coloring drugs generally in amounts consistent with current good manufacturing practice.
33211:<P>(d) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
34071:<DIV8 N="74.2706" TYPE="SECTION" VOLUME="1">
34072:<HEAD>§ 74.2706   FD&amp;C Yellow No. 6.</HEAD>
34073:<P>(a) <I>Identity and specifications.</I> The color additive FD&amp;C Yellow No. 6 shall conform in identity and specifications to the requirements of § 74.706 (a)(1) and (b).
34075:<P>(b) <I>Uses and restrictions.</I> FD&amp;C Yellow No. 6 may be safely used for coloring cosmetics generally in amounts consistent with current good manufacturing practice.
34079:<P>(d) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
35225:<FP-1>Ext. D&amp;C Yellow No. 6.
35531:<HEAD>§ 82.706   FD&amp;C Yellow No. 6.</HEAD>

thinking
**Clarifying GRAS status for color additives**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://api.crossref.org/works/10.2903/j.efsa.2014.3765' | jq '.message | {title: .title[0], published: .published[\"date-parts\"][0][0], abstract: .abstract}' | head -c 1500" in /home/exedev/chewber succeeded in 192ms:
{
  "title": "Reconsideration of the temporary ADI and refined exposure assessment for Sunset Yellow FCF (E 110)",
  "published": 2014,
  "abstract": null
}












thinking
**Evaluating EFSA and EU sources for additive data**
thinking
**Planning safety data collection**
thinking
**Exploring epidemiology data sources**
thinking
**Assessing exposure risk sources**
thinking
**Planning external literature search**
thinking
**Planning chemical synonym gathering**
thinking
**Considering PubChem for identity**
thinking
**Exploring data source links**
thinking
**Testing link clicking by ID**
thinking
**Planning CAS extraction patterns**
thinking
**Investigating link IDs for additives**
thinking
**Planning HTML parsing approach**
codex
I’ve confirmed the WHO JECFA chemical record for Sunset Yellow FCF (including ADI and evaluation year), and I’m now extracting identity details (CAS/synonyms/class) from authoritative records to complete the report fields.
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1961' | rg -n 'CAS|Synonym|Class|Sunset|FD&C|INS|ADI|Evaluation|Year|chemical' | head -n 120" in /home/exedev/chewber succeeded in 1.03s:
474:                                    <li><a class="nomenu">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Evaluations of the Joint FAO/WHO Expert Committee on Food Additives (JECFA)</a></li>
589:                            <div class="label">Synonyms</div>
604:                            <div class="label">Functional Class</div>
614:                                            <h3>Evaluations</h3>
620:    <h4 style="margin:0;line-height: .5em;">Evaluation year: 2001</h4>
621:    <h4 style="margin-bottom: 0; line-height: .5em;"><div class="row"><div class="col-sm-2" style="white-space:nowrap;">ADI:</div><div class="col-sm-8" style="line-height:normal;">No safety concern at current levels of intake when used as a flavouring agent</div></div></h4>
768:                $("body").toggleClass("search-open");
775:                $(".search-open").removeClass("search-open")


thinking
**Verifying additive identity**
thinking
**Investigating missing query output**
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/1961' | sed -n '540,660p'" in /home/exedev/chewber succeeded in 1.27s:

        </div>
        <!--/noindex--><!--startindex-->



    </div>
    <div class="row" data-sf-element="Row">
        <div id="PageContent_C005_Col00" class="sf_colsIn col-md-12" data-sf-element="Column 1" data-placeholder-label="Title and Intro">

            <div id="PageContent_C001_Col00" class="sf_colsIn container" data-sf-element="Container" data-placeholder-label="Container">
                <article class="dynamic-content dynamic-content__article dynamic-content__publication">
                    <header class="dynamic-content__header">
                        <div class="dynamic-content__heading__wrapper">
                            <div class="dynamic-content__heading">
                                <h1>ANISYL PHENYLACETATE</h1>
                            </div>
                        </div>
                        <div class="social-share--add-this share sf-social-share__top-position">
                            <div class="addthis_inline_share_toolbox" style="clear: both;" data-url="https://www.who.int/publications/m/item/governing-health-innovation-for-the-common-good" data-title="Governing health innovation for the common good" data-description="The WHO Council on the Economics of Health for All - Council Brief No. 1">

thinking
**Investigating WHO DB chemical ID**
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/search.aspx' | rg -n 'form|action=|name=\"|Search|chemical|additive|input' | head -n 200" in /home/exedev/chewber succeeded in 975ms:
7:    <meta name="viewport" content="width=device-width, initial-scale=1">
14:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/grid.min.css?v=12.1.7126.15119'>
15:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/origin.min.css?v=12.1.7126.15119'> <!-- head to scrape:off -->
16:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/main.min.css?v=12.1.7126.15119'>
17:    <link rel='stylesheet' href='/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/styles/print.min.css?v=12.1.7126.15119' media='print'>
407:    <meta name="twitter:card" content="summary_large_image" />
408:    <meta name="Generator" content="Sitefinity 13.1.7429.0 PU" />
410:    <meta name="description" content="Publications from the World Health Organization" />
413:    <script src="/food-additives-contaminants-jecfa-database/Scripts/jquery-3.4.1.min.js"></script>
414:    <script src="/food-additives-contaminants-jecfa-database/Mvc/Scripts/axd/jquery-migrate.js"></script>
415:    <script src="/food-additives-contaminants-jecfa-database/Mvc/Scripts/axd/jquery-ui.js"></script>
425:                        <div class="header-logo logos-container"> <a href="/food-additives-contaminants-jecfa-database/" title="Home" class="primary-logo"><img src="/food-additives-contaminants-jecfa-database/ResourcePackages/WHO/assets/dist/images/logos/en/h-logo-blue.svg" alt="Home" class="logo svg" /> </a> </div>
454:                                    <li class=""><a href="/food-additives-contaminants-jecfa-database/" target="_self">Home</a></li>
546:This searchable database contains the summaries of all the evaluations of flavours, food additives, contaminants, toxicants and veterinary drugs JECFA has performed. Each summary contains basic chemical information, ADIs/TDIs, links to the most recent reports and monographs as well as to the specification database, and a history of JECFA evaluations. The database is searchable by partial name or CAS number, by first character (letter or symbol), or by functional class.
567:                                                <div class="form-group col-md-6 col-sm-12">
571:                                                        <input id="Multi-field-healthtopics" class="autocomplete"  data-data="[{Id,Name}]" data-placeholder="Health Topic" data-type="Taxonomy" placeholder="Partial name or CAS number" data-taxon=healthtopics />
575:                                                <div class="form-group col-md-6 col-sm-12">
579:                                                        <input id="Multi-field-fema" class="autocomplete" data-data="[{Id,Name}]" data-placeholder="FEMA or JECFA number " data-type="Taxonomy" placeholder="FEMA or JECFA number " data-taxon="fema" />
583:                                                <div class="form-group col-md-3 col-sm-6">
586:                                                <div class="form-group col-md-2 col-sm-6">

thinking
**Noticing usable API endpoints**
exec
/bin/bash -lc "set -euo pipefail
curl -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/api/SearchChemical/ByPartialName/Sunset%20Yellow' | jq '.[0:20]'" in /home/exedev/chewber succeeded in 856ms:
[
  {
    "ADI": " 0–4 mg/kg bw",
    "Name": "SUNSET YELLOW FCF",
    "Id": 2703,
    "CAS_NO": null,
    "FEMA_NO": null,
    "JECFA_NO": null,
    "FunctionalClass": null
  }
]

thinking
**Fetching chemical details**
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2703' | sed -n '540,700p'" in /home/exedev/chewber succeeded in 792ms:

        </div>
        <!--/noindex--><!--startindex-->



    </div>
    <div class="row" data-sf-element="Row">
        <div id="PageContent_C005_Col00" class="sf_colsIn col-md-12" data-sf-element="Column 1" data-placeholder-label="Title and Intro">

            <div id="PageContent_C001_Col00" class="sf_colsIn container" data-sf-element="Container" data-placeholder-label="Container">
                <article class="dynamic-content dynamic-content__article dynamic-content__publication">
                    <header class="dynamic-content__header">
                        <div class="dynamic-content__heading__wrapper">
                            <div class="dynamic-content__heading">
                                <h1>SUNSET YELLOW FCF</h1>
                            </div>
                        </div>
                        <div class="social-share--add-this share sf-social-share__top-position">
                            <div class="addthis_inline_share_toolbox" style="clear: both;" data-url="https://www.who.int/publications/m/item/governing-health-innovation-for-the-common-good" data-title="Governing health innovation for the common good" data-description="The WHO Council on the Economics of Health for All - Council Brief No. 1">




thinking
**Exploring EFSA ADI data sources**
thinking
**Considering summary snippet inclusion**
thinking
**Identifying EFSA safety conclusion**
thinking
**Planning regulatory status verification**
exec
/bin/bash -lc "set -euo pipefail
curl -L -sS 'https://monographs.iarc.who.int/agents-classified-by-the-iarc/' -o /tmp/iarc-agents.html
rg -ni 'sunset yellow|yellow no\\. 6|fd&c|2783-94-0|orange yellow s|e110' /tmp/iarc-agents.html || true
# show page title for provenance
rg -n '<title>|Agents Classified by the IARC' /tmp/iarc-agents.html | head -n 20" in /home/exedev/chewber succeeded in 598ms:
29:	<title>Agents Classified by the IARC Monographs, Volumes 1–140 &#8211; IARC Monographs on the Identification of Carcinogenic Hazards to Humans</title>

thinking
**Planning robust PubMed data extraction**
codex
I’ve verified IARC’s official classified-agents page and found no listing for Sunset Yellow/FD&C Yellow 6. I’m now pulling structured PubMed abstract data for the recent studies so the evidence section is accurate.
exec
/bin/bash -lc "set -euo pipefail
pmids='40482261 32535311 38549430 17825405'
for p in "'$pmids; do
  echo "=== PMID $p ==="
  curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=$p&retmode=json" | jq -r '"'.result["'$ARGS.positional[0]] | "Title: '"\\(.title)\\nPubDate: \\(.pubdate)\\nSource: \\(.source)\\n\"' --args \""'$p"
  # first ~700 chars of abstract from efetch
  abstract=$(curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | tr -d '"'\\n' | sed 's/<AbstractText /\\n<AbstractText /g' | sed 's/<\\/AbstractText>/<\\/AbstractText>\\n/g' | rg -o '<AbstractText["'^>]*>.*</AbstractText>'"' | sed -E 's/<["'^>]+>//g'"' | head -n 1)
  echo \"AbstractSnippet: "'${abstract:0:700}"
  echo
done' in /home/exedev/chewber exited 1 in 567ms:
Title: null
PubDate: null
Source: null


thinking
**Inspecting raw response for parse error**
exec
/bin/bash -lc "curl -sS 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=40482261&retmode=json' | head -c 1000" in /home/exedev/chewber succeeded in 212ms:
{"header":{"type":"esummary","version":"0.3"},"result":{"uids":["40482261"],"40482261":{"uid":"40482261","error":"cannot get document summary"}}}

thinking
**Testing alternative data fetch method**
exec
/bin/bash -lc "curl -sS 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40482261&retmode=xml' | head -n 80" in /home/exedev/chewber succeeded in 197ms:
<?xml version="1.0" ?>
<!DOCTYPE PubmedArticleSet PUBLIC "-//NLM//DTD PubMedArticle, 1st January 2025//EN" "https://dtd.nlm.nih.gov/ncbi/pubmed/out/pubmed_250101.dtd">
<PubmedArticleSet></PubmedArticleSet>

thinking
**Testing alternate IDs with eutils**
exec
/bin/bash -lc 'for p in 32535311 17825405; do echo "=== $p"; curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | rg -n '"'<ArticleTitle>|<PubDate>|<Year>|<AbstractText' | head -n 30; done" in /home/exedev/chewber succeeded in 592ms:
4:<PubmedArticle><MedlineCitation Status="MEDLINE" Owner="NLM" IndexingMethod="Curated"><PMID Version="1">32535311</PMID><DateCompleted><Year>2020</Year><Month>09</Month><Day>16</Day></DateCompleted><DateRevised><Year>2020</Year><Month>09</Month><Day>16</Day></DateRevised><Article PubModel="Print-Electronic"><Journal><ISSN IssnType="Electronic">1873-7072</ISSN><JournalIssue CitedMedium="Internet"><Volume>330</Volume><PubDate><Year>2020</Year><Month>Nov</Month><Day>15</Day></PubDate></JournalIssue><Title>Food chemistry</Title><ISOAbbreviation>Food Chem</ISOAbbreviation></Journal><ArticleTitle>Folium nelumbinis (Lotus leaf) volatile-rich fraction and its mechanisms of action against melanogenesis in B16 cells.</ArticleTitle><Pagination><StartPage>127030</StartPage><MedlinePgn>127030</MedlinePgn></Pagination><ELocationID EIdType="doi" ValidYN="Y">10.1016/j.foodchem.2020.127030</ELocationID><ELocationID EIdType="pii" ValidYN="Y">S0308-8146(20)30892-X</ELocationID><Abstract><AbstractText>This study was aimed at determining the influence of Folium nelumbinis (Lotus leaf) extracts on melanogenesis in vitro models of melanoma cell line. The anticancer activity of four fractions, including petroleum ether (PEE), n-hexane (HE), ethanol (EE), and ethyl acetate (EAE) from F. nelumbinis on B16 cell lines (C57BL/6J melanoma cell), were evaluated after 24 and 48&#xa0;h treatment. Results showed that PEE as well as volatile-rich fractions of linolenic acid and linolenic acid ethyl ester significantly (p&#xa0;&lt;&#xa0;0.05) reduced tyrosinase activity and melanin content in B16 melanoma cells model. Meanwhile, PEE and its primarily contained compound triggered apoptosis of B16 cells in a dose-dependent way. These results demonstrated that PEE possessed effective activities against melanin and tyrosinase generations through the induction of apoptosis. Moreover, a relation between the volatile-rich fractions of F. nelumbinis and the anticancer effects was demonstrated as well.</AbstractText><CopyrightInformation>Copyright &#xa9; 2020. Published by Elsevier Ltd.</CopyrightInformation></Abstract><AuthorList CompleteYN="Y"><Author ValidYN="Y"><LastName>Teng</LastName><ForeName>Hui</ForeName><Initials>H</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Fan</LastName><ForeName>Xiaoyun</ForeName><Initials>X</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Lv</LastName><ForeName>Qiyan</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Zhang</LastName><ForeName>Qin</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Xiao</LastName><ForeName>Jianbo</ForeName><Initials>J</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Qian</LastName><ForeName>Yuewei</ForeName><Initials>Y</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Zheng</LastName><ForeName>Baodong</ForeName><Initials>B</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Gao</LastName><ForeName>Hui</ForeName><Initials>H</Initials><AffiliationInfo><Affiliation>Department of Pharmacolgoy, Medical College of Shaoxing University, Shaoxing 312000, Zhejiang Province, China. Electronic address: gaohui9512@163.com.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Gao</LastName><ForeName>Sihai</ForeName><Initials>S</Initials><AffiliationInfo><Affiliation>Department of Cardiothoracic and Vascular Surgery, Tongji Hospital, Tongji Medical College, Huazhong University of Science and Technology, Wuhan 430030, Hubei, China. Electronic address: sihaigao73@163.com.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Chen</LastName><ForeName>Lei</ForeName><Initials>L</Initials><AffiliationInfo><Affiliation>College of Food Science, Fujian Agriculture and Forestry University, Fuzhou, Fujian 350002, China. Electronic address: chenlei841114@hotmail.com.</Affiliation></AffiliationInfo></Author></AuthorList><Language>eng</Language><PublicationTypeList><PublicationType UI="D016428">Journal Article</PublicationType></PublicationTypeList><ArticleDate DateType="Electronic"><Year>2020</Year><Month>05</Month><Day>22</Day></ArticleDate></Article><MedlineJournalInfo><Country>England</Country><MedlineTA>Food Chem</MedlineTA><NlmUniqueID>7702639</NlmUniqueID><ISSNLinking>0308-8146</ISSNLinking></MedlineJournalInfo><ChemicalList><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D008543">Melanins</NameOfSubstance></Chemical><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D010936">Plant Extracts</NameOfSubstance></Chemical><Chemical><RegistryNumber>EC 1.14.18.1</RegistryNumber><NameOfSubstance UI="D014442">Monophenol Monooxygenase</NameOfSubstance></Chemical></ChemicalList><CitationSubset>IM</CitationSubset><MeshHeadingList><MeshHeading><DescriptorName UI="D000818" MajorTopicYN="N">Animals</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D017209" MajorTopicYN="N">Apoptosis</DescriptorName><QualifierName UI="Q000187" MajorTopicYN="N">drug effects</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D045744" MajorTopicYN="N">Cell Line, Tumor</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D002471" MajorTopicYN="N">Cell Transformation, Neoplastic</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D000070116" MajorTopicYN="N">Lotus</DescriptorName><QualifierName UI="Q000737" MajorTopicYN="Y">chemistry</QualifierName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D008543" MajorTopicYN="N">Melanins</DescriptorName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D008546" MajorTopicYN="N">Melanoma, Experimental</DescriptorName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D014442" MajorTopicYN="N">Monophenol Monooxygenase</DescriptorName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D010936" MajorTopicYN="N">Plant Extracts</DescriptorName><QualifierName UI="Q000737" MajorTopicYN="N">chemistry</QualifierName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName><QualifierName UI="Q000494" MajorTopicYN="Y">pharmacology</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D018515" MajorTopicYN="N">Plant Leaves</DescriptorName><QualifierName UI="Q000737" MajorTopicYN="N">chemistry</QualifierName><QualifierName UI="Q000378" MajorTopicYN="N">metabolism</QualifierName></MeshHeading></MeshHeadingList><KeywordList Owner="NOTNLM"><Keyword MajorTopicYN="N">Apoptosis</Keyword><Keyword MajorTopicYN="N">B16 cell</Keyword><Keyword MajorTopicYN="N">F. nelumbinis</Keyword><Keyword MajorTopicYN="N">Petroleum ether fraction</Keyword><Keyword MajorTopicYN="N">Tyrosinase inhibition</Keyword><Keyword MajorTopicYN="N">Volatile compound</Keyword></KeywordList><CoiStatement>Declaration of Competing Interest The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.</CoiStatement></MedlineCitation><PubmedData><History><PubMedPubDate PubStatus="received"><Year>2019</Year><Month>9</Month><Day>30</Day></PubMedPubDate><PubMedPubDate PubStatus="revised"><Year>2020</Year><Month>5</Month><Day>9</Day></PubMedPubDate><PubMedPubDate PubStatus="accepted"><Year>2020</Year><Month>5</Month><Day>9</Day></PubMedPubDate><PubMedPubDate PubStatus="pubmed"><Year>2020</Year><Month>6</Month><Day>15</Day><Hour>6</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="medline"><Year>2020</Year><Month>9</Month><Day>17</Day><Hour>6</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="entrez"><Year>2020</Year><Month>6</Month><Day>15</Day><Hour>6</Hour><Minute>0</Minute></PubMedPubDate></History><PublicationStatus>ppublish</PublicationStatus><ArticleIdList><ArticleId IdType="pubmed">32535311</ArticleId><ArticleId IdType="doi">10.1016/j.foodchem.2020.127030</ArticleId><ArticleId IdType="pii">S0308-8146(20)30892-X</ArticleId></ArticleIdList></PubmedData></PubmedArticle></PubmedArticleSet>
=== 17825405
4:<PubmedArticle><MedlineCitation Status="MEDLINE" Owner="NLM" IndexingMethod="Manual"><PMID Version="1">17825405</PMID><DateCompleted><Year>2007</Year><Month>11</Month><Day>09</Day></DateCompleted><DateRevised><Year>2022</Year><Month>04</Month><Day>08</Day></DateRevised><Article PubModel="Print"><Journal><ISSN IssnType="Electronic">1474-547X</ISSN><JournalIssue CitedMedium="Internet"><Volume>370</Volume><Issue>9598</Issue><PubDate><Year>2007</Year><Month>Nov</Month><Day>03</Day></PubDate></JournalIssue><Title>Lancet (London, England)</Title><ISOAbbreviation>Lancet</ISOAbbreviation></Journal><ArticleTitle>Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children in the community: a randomised, double-blinded, placebo-controlled trial.</ArticleTitle><Pagination><StartPage>1560</StartPage><EndPage>1567</EndPage><MedlinePgn>1560-7</MedlinePgn></Pagination><Abstract><AbstractText Label="BACKGROUND" NlmCategory="BACKGROUND">We undertook a randomised, double-blinded, placebo-controlled, crossover trial to test whether intake of artificial food colour and additives (AFCA) affected childhood behaviour.</AbstractText><AbstractText Label="METHODS" NlmCategory="METHODS">153 3-year-old and 144 8/9-year-old children were included in the study. The challenge drink contained sodium benzoate and one of two AFCA mixes (A or B) or a placebo mix. The main outcome measure was a global hyperactivity aggregate (GHA), based on aggregated z-scores of observed behaviours and ratings by teachers and parents, plus, for 8/9-year-old children, a computerised test of attention. This clinical trial is registered with Current Controlled Trials (registration number ISRCTN74481308). Analysis was per protocol.</AbstractText><AbstractText Label="FINDINGS" NlmCategory="RESULTS">16 3-year-old children and 14 8/9-year-old children did not complete the study, for reasons unrelated to childhood behaviour. Mix A had a significantly adverse effect compared with placebo in GHA for all 3-year-old children (effect size 0.20 [95% CI 0.01-0.39], p=0.044) but not mix B versus placebo. This result persisted when analysis was restricted to 3-year-old children who consumed more than 85% of juice and had no missing data (0.32 [0.05-0.60], p=0.02). 8/9-year-old children showed a significantly adverse effect when given mix A (0.12 [0.02-0.23], p=0.023) or mix B (0.17 [0.07-0.28], p=0.001) when analysis was restricted to those children consuming at least 85% of drinks with no missing data.</AbstractText><AbstractText Label="INTERPRETATION" NlmCategory="CONCLUSIONS">Artificial colours or a sodium benzoate preservative (or both) in the diet result in increased hyperactivity in 3-year-old and 8/9-year-old children in the general population.</AbstractText></Abstract><AuthorList CompleteYN="Y"><Author ValidYN="Y"><LastName>McCann</LastName><ForeName>Donna</ForeName><Initials>D</Initials><AffiliationInfo><Affiliation>School of Psychology, Department of Child Health, University of Southampton, Southampton, UK.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Barrett</LastName><ForeName>Angelina</ForeName><Initials>A</Initials></Author><Author ValidYN="Y"><LastName>Cooper</LastName><ForeName>Alison</ForeName><Initials>A</Initials></Author><Author ValidYN="Y"><LastName>Crumpler</LastName><ForeName>Debbie</ForeName><Initials>D</Initials></Author><Author ValidYN="Y"><LastName>Dalen</LastName><ForeName>Lindy</ForeName><Initials>L</Initials></Author><Author ValidYN="Y"><LastName>Grimshaw</LastName><ForeName>Kate</ForeName><Initials>K</Initials></Author><Author ValidYN="Y"><LastName>Kitchin</LastName><ForeName>Elizabeth</ForeName><Initials>E</Initials></Author><Author ValidYN="Y"><LastName>Lok</LastName><ForeName>Kris</ForeName><Initials>K</Initials></Author><Author ValidYN="Y"><LastName>Porteous</LastName><ForeName>Lucy</ForeName><Initials>L</Initials></Author><Author ValidYN="Y"><LastName>Prince</LastName><ForeName>Emily</ForeName><Initials>E</Initials></Author><Author ValidYN="Y"><LastName>Sonuga-Barke</LastName><ForeName>Edmund</ForeName><Initials>E</Initials></Author><Author ValidYN="Y"><LastName>Warner</LastName><ForeName>John O</ForeName><Initials>JO</Initials></Author><Author ValidYN="Y"><LastName>Stevenson</LastName><ForeName>Jim</ForeName><Initials>J</Initials></Author></AuthorList><Language>eng</Language><DataBankList CompleteYN="Y"><DataBank><DataBankName>ISRCTN</DataBankName><AccessionNumberList><AccessionNumber>ISRCTN74481308</AccessionNumber></AccessionNumberList></DataBank></DataBankList><PublicationTypeList><PublicationType UI="D016428">Journal Article</PublicationType><PublicationType UI="D016449">Randomized Controlled Trial</PublicationType><PublicationType UI="D013485">Research Support, Non-U.S. Gov't</PublicationType></PublicationTypeList></Article><MedlineJournalInfo><Country>England</Country><MedlineTA>Lancet</MedlineTA><NlmUniqueID>2985213R</NlmUniqueID><ISSNLinking>0140-6736</ISSNLinking></MedlineJournalInfo><ChemicalList><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D005505">Food Coloring Agents</NameOfSubstance></Chemical><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D005520">Food Preservatives</NameOfSubstance></Chemical><Chemical><RegistryNumber>OJ245FE5EU</RegistryNumber><NameOfSubstance UI="D020160">Sodium Benzoate</NameOfSubstance></Chemical></ChemicalList><CitationSubset>IM</CitationSubset><CommentsCorrectionsList><CommentsCorrections RefType="ErratumIn"><RefSource>Lancet. 2007 Nov 3;370(9598):1542</RefSource></CommentsCorrections><CommentsCorrections RefType="CommentIn"><RefSource>Lancet. 2007 Nov 3;370(9598):1524-5. doi: 10.1016/S0140-6736(07)61643-2.</RefSource><PMID Version="1">17980721</PMID></CommentsCorrections></CommentsCorrectionsList><MeshHeadingList><MeshHeading><DescriptorName UI="D002648" MajorTopicYN="N">Child</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D002675" MajorTopicYN="N">Child, Preschool</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D018592" MajorTopicYN="N">Cross-Over Studies</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D004311" MajorTopicYN="N">Double-Blind Method</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D005190" MajorTopicYN="N">Family</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D005260" MajorTopicYN="N">Female</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D005505" MajorTopicYN="N">Food Coloring Agents</DescriptorName><QualifierName UI="Q000008" MajorTopicYN="N">administration &amp; dosage</QualifierName><QualifierName UI="Q000009" MajorTopicYN="Y">adverse effects</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D005520" MajorTopicYN="N">Food Preservatives</DescriptorName><QualifierName UI="Q000008" MajorTopicYN="Y">administration &amp; dosage</QualifierName><QualifierName UI="Q000009" MajorTopicYN="Y">adverse effects</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D006801" MajorTopicYN="N">Humans</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D006948" MajorTopicYN="N">Hyperkinesis</DescriptorName><QualifierName UI="Q000139" MajorTopicYN="Y">chemically induced</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D008297" MajorTopicYN="N">Male</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D020160" MajorTopicYN="N">Sodium Benzoate</DescriptorName><QualifierName UI="Q000008" MajorTopicYN="N">administration &amp; dosage</QualifierName><QualifierName UI="Q000009" MajorTopicYN="Y">adverse effects</QualifierName></MeshHeading></MeshHeadingList></MedlineCitation><PubmedData><History><PubMedPubDate PubStatus="pubmed"><Year>2007</Year><Month>9</Month><Day>11</Day><Hour>9</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="medline"><Year>2007</Year><Month>11</Month><Day>10</Day><Hour>9</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="entrez"><Year>2007</Year><Month>9</Month><Day>11</Day><Hour>9</Hour><Minute>0</Minute></PubMedPubDate></History><PublicationStatus>ppublish</PublicationStatus><ArticleIdList><ArticleId IdType="pubmed">17825405</ArticleId><ArticleId IdType="doi">10.1016/S0140-6736(07)61306-3</ArticleId><ArticleId IdType="pii">S0140-6736(07)61306-3</ArticleId></ArticleIdList></PubmedData></PubmedArticle></PubmedArticleSet>


thinking
**Clarifying PMID references**
thinking
**Planning article fetch attempts**
exec
/bin/bash -lc 'for p in 32313435 38549430 39791235; do echo "=== $p"; curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | rg -n '"'<ArticleTitle>|<PubDate>|<Year>|<AbstractText Label=\"|<AbstractText>' | head -n 40; done" in /home/exedev/chewber succeeded in 1.04s:
4:<PubmedArticle><MedlineCitation Status="PubMed-not-MEDLINE" Owner="NLM"><PMID Version="1">32313435</PMID><DateRevised><Year>2024</Year><Month>03</Month><Day>28</Day></DateRevised><Article PubModel="Print-Electronic"><Journal><ISSN IssnType="Print">1366-9516</ISSN><JournalIssue CitedMedium="Print"><Volume>24</Volume><Issue>8</Issue><PubDate><Year>2018</Year><Month>Aug</Month></PubDate></JournalIssue><Title>Diversity &amp; distributions</Title><ISOAbbreviation>Divers Distrib</ISOAbbreviation></Journal><ArticleTitle>Effectiveness of protected areas for bird conservation depends on guild.</ArticleTitle><Pagination><StartPage>1083</StartPage><EndPage>1091</EndPage><MedlinePgn>1083-1091</MedlinePgn></Pagination><ELocationID EIdType="doi" ValidYN="Y">10.1111/ddi.12756</ELocationID><Abstract><AbstractText Label="AIM" NlmCategory="OBJECTIVE">Protected areas are key conservation tools intended to increase biodiversity and reduce extinction risks of species and populations. However, the degree to which protected areas achieve their conservation goals is generally unknown for many protected areas worldwide. We assess the effect of protected areas on the abundance of 196 common, resident bird species. If protected areas were beneficial to avian biodiversity, we expect landscapes with a higher proportion of protected areas will have higher densities of species compared to landscapes with no protection.</AbstractText><AbstractText Label="LOCATION" NlmCategory="METHODS">Greater Gauteng region, South Africa.</AbstractText><AbstractText Label="METHODS" NlmCategory="METHODS">We analysed bird survey data collected over regular grid cells across the study area. We estimated bird abundance in relation to the proportion of a grid cell that was protected with the Royle-Nichols model and fitted the model once for each of the species. We examined variation in estimated abundance as a function of avian guild (defined by the type of food a species preferentially ate and its foraging mode) with a regression tree analysis.</AbstractText><AbstractText Label="RESULTS" NlmCategory="RESULTS">Abundance was significantly positively related to the proportion of protected areas in grid cells for 26% of the species, significantly negatively related in 15%, and not significantly related in 59% species. We found three distinct guild groups which differed in their average abundance, after accounting for associated variance. Group 1 consisted of guilds frugivores, ground-feeders, hawkers, predators, and vegivores and average abundance was strongly positively related to the proportion of protected areas. Group 2 included granivores, and average abundance was strongly negatively related to proportion of protected areas. Group 3 included gleaners only, and average abundance was not related to proportion of protected areas.</AbstractText><AbstractText Label="MAIN CONCLUSION" NlmCategory="CONCLUSIONS">We conclude that the network of protected areas within the greater Gauteng region sustained relatively higher abundances of common birds and thus perform an important conservation role.</AbstractText><CopyrightInformation>&#xa9; 2018 John Wiley &amp; Sons Ltd.</CopyrightInformation></Abstract><AuthorList CompleteYN="Y"><Author ValidYN="Y"><LastName>Duckworth</LastName><ForeName>Gregory D</ForeName><Initials>GD</Initials><Identifier Source="ORCID">0000-0001-7614-0059</Identifier><AffiliationInfo><Affiliation>Statistics in Ecology, Environment and Conservation Department of Statistical Sciences University of Cape Town Cape Town South Africa.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Altwegg</LastName><ForeName>Res</ForeName><Initials>R</Initials><AffiliationInfo><Affiliation>Statistics in Ecology, Environment and Conservation Department of Statistical Sciences University of Cape Town Cape Town South Africa.</Affiliation></AffiliationInfo><AffiliationInfo><Affiliation>African Climate and Development Initiative University of Cape Town Rondebosch Cape Town South Africa.</Affiliation></AffiliationInfo></Author></AuthorList><Language>eng</Language><PublicationTypeList><PublicationType UI="D016428">Journal Article</PublicationType></PublicationTypeList><ArticleDate DateType="Electronic"><Year>2018</Year><Month>04</Month><Day>30</Day></ArticleDate></Article><MedlineJournalInfo><Country>England</Country><MedlineTA>Divers Distrib</MedlineTA><NlmUniqueID>9891503</NlmUniqueID><ISSNLinking>1366-9516</ISSNLinking></MedlineJournalInfo><KeywordList Owner="NOTNLM"><Keyword MajorTopicYN="N">Avian conservation</Keyword><Keyword MajorTopicYN="N">citizen science</Keyword><Keyword MajorTopicYN="N">hierarchical models</Keyword><Keyword MajorTopicYN="N">protected areas</Keyword><Keyword MajorTopicYN="N">species abundance</Keyword></KeywordList></MedlineCitation><PubmedData><History><PubMedPubDate PubStatus="entrez"><Year>2020</Year><Month>4</Month><Day>22</Day><Hour>6</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="pubmed"><Year>2018</Year><Month>8</Month><Day>1</Day><Hour>0</Hour><Minute>0</Minute></PubMedPubDate><PubMedPubDate PubStatus="medline"><Year>2018</Year><Month>8</Month><Day>1</Day><Hour>0</Hour><Minute>1</Minute></PubMedPubDate><PubMedPubDate PubStatus="pmc-release"><Year>2020</Year><Month>4</Month><Day>17</Day></PubMedPubDate></History><PublicationStatus>ppublish</PublicationStatus><ArticleIdList><ArticleId IdType="pubmed">32313435</ArticleId><ArticleId IdType="pmc">PMC7163781</ArticleId><ArticleId IdType="doi">10.1111/ddi.12756</ArticleId><ArticleId IdType="pii">DDI12756</ArticleId></ArticleIdList><ReferenceList><Reference><Citation>Altwegg, R. , Wheeler, M. , &amp; Erni, B. (2008). Climate and the range dynamics of species with imperfect detection. Biological Letters, 4, 581&#x2013;584. 10.1098/rsbl.2008.0051</Citation><ArticleIdList><ArticleId IdType="doi">10.1098/rsbl.2008.0051</ArticleId><ArticleId IdType="pmc">PMC2610062</ArticleId><ArticleId IdType="pubmed">18664423</ArticleId></ArticleIdList></Reference><Reference><Citation>Bailey, L. L. , Mackenzie, D. I. , &amp; Nichols, J. D. (2014). Advances and applications of occupancy models. Trends in Ecology &amp; Evolution, 5, 1269&#x2013;1279. 10.1111/2041-210X.12100</Citation><ArticleIdList><ArticleId IdType="doi">10.1111/2041-210X.12100</ArticleId></ArticleIdList></Reference><Reference><Citation>Balmford, A. , Gaston, K. J. , Blyth, S. , James, A. , &amp; Kapos, V. (2003). Global variation in terrestrial conservation costs, conservation benefits, and unmet conservation needs. Proceedings of the National Academy of Sciences of the United States of America, 100, 1046&#x2013;1050. 10.1073/pnas.0236945100</Citation><ArticleIdList><ArticleId IdType="doi">10.1073/pnas.0236945100</ArticleId><ArticleId IdType="pmc">PMC298723</ArticleId><ArticleId IdType="pubmed">12552123</ArticleId></ArticleIdList></Reference><Reference><Citation>Barnard, P. (1997). Steelblue widowfinch In Harrison J. A., Allan D. G., Underhill L. G., Herremans M., Tree A. J., Parker V. &amp; Brown C. J. (Eds.), The atlas of Southern African birds. Vols 1 and 2 (pp. 646&#x2013;647). Johannesburg: BirdLife South Africa.</Citation></Reference><Reference><Citation>Beissinger, S. R. , &amp; Osborne, D. R. (1982). Effects of urbanization on avian community organization. The Condor, 84, 75&#x2013;83. 10.2307/1367825</Citation><ArticleIdList><ArticleId IdType="doi">10.2307/1367825</ArticleId></ArticleIdList></Reference><Reference><Citation>Benton, T. I. M. G. , Bryant, D. M. , Cole, L. , &amp; Crick, H. Q. P. (2002). Linking agricultural practice to insect and bird populations: A historical study over three decades. Journal of Applied Ecology, 39, 673&#x2013;687. 10.1046/j.1365-2664.2002.00745.x</Citation><ArticleIdList><ArticleId IdType="doi">10.1046/j.1365-2664.2002.00745.x</ArticleId></ArticleIdList></Reference><Reference><Citation>Berruti, A. (1997a). Blackchested prinia In Harrison J. A., Allan D. G., Underhill L. G., Herremans M., Tree A. J., Parker V., &amp; Brown C. J. (Eds.), Atlas of Southern African birds (pp. 324&#x2013;325). Johannesburg: BirdLife South Africa.</Citation></Reference><Reference><Citation>Berruti, A. (1997b). Tawnyflanked prinia In Harrison J. A., Allan D. G., Underhill L. G., Herremans M., Tree A. J., Parker V., &amp; Brown C. J. (Eds.), Atlas of Southern Africa (pp. 322&#x2013;323). Johannesburg: BirdLife South Africa.</Citation></Reference><Reference><Citation>Breiman, L. , Friedman, J. H. , Olshen, R. A. , &amp; Stone, C. J. (1984). Classification and regression trees. New York, NY: Chapman &amp; Hall.</Citation></Reference><Reference><Citation>Broms, K. M. , Johnson, D. S. , Altwegg, R. , &amp; Conquest, L. L. (2014). Spatial occupancy models applied to atlas data show southern ground hornbills strongly depend on protected areas. Ecological Applications, 24, 363&#x2013;374. 10.1890/12-2151.1</Citation><ArticleIdList><ArticleId IdType="doi">10.1890/12-2151.1</ArticleId><ArticleId IdType="pubmed">24689147</ArticleId></ArticleIdList></Reference><Reference><Citation>Chace, J. F. , &amp; Walsh, J. J. (2006). Urban effects on native avifauna: A review. Landscape and Urban Planning, 74, 46&#x2013;69. 10.1016/j.landurbplan.2004.08.007</Citation><ArticleIdList><ArticleId IdType="doi">10.1016/j.landurbplan.2004.08.007</ArticleId></ArticleIdList></Reference><Reference><Citation>Child, M. F. , Cumming, G. S. , &amp; Amano, T. (2009). Assessing the broad&#x2010;scale impact of agriculturally transformed and protected area landscapes on avian taxonomic and functional richness. Biological Conservation, 142, 2593&#x2013;2601. 10.1016/j.biocon.2009.06.007</Citation><ArticleIdList><ArticleId IdType="doi">10.1016/j.biocon.2009.06.007</ArticleId></ArticleIdList></Reference><Reference><Citation>Coetzee, B. W. T. , Gaston, K. J. , &amp; Chown, S. L. (2014). Local scale comparisons of biodiversity as a test for global protected area ecological performance: A meta&#x2010;analysis. PLoS One, 9, 1&#x2013;11.</Citation><ArticleIdList><ArticleId IdType="pmc">PMC4146549</ArticleId><ArticleId IdType="pubmed">25162620</ArticleId></ArticleIdList></Reference><Reference><Citation>Craigie, I. D. , Baillie, J. E. M. M. , Balmford, A. , Carbone, C. , Collen, B. , Green, R. E. , &amp; Hutton, J. M. (2010). Large mammal population declines in Africa's protected areas. Biological Conservation, 143, 2221&#x2013;2228. 10.1016/j.biocon.2010.06.007</Citation><ArticleIdList><ArticleId IdType="doi">10.1016/j.biocon.2010.06.007</ArticleId></ArticleIdList></Reference><Reference><Citation>Dean, W. R. J. (1997). Redcapped lark In Harrison J. A., Allan D. G., Underhill L. G., Herremans M., Tree A. J., Parker V. &amp; Brown C. J. (Eds.), The atlas of Southern African birds. Vols 1 and 2 (pp. 30&#x2013;32). Johannesburg: BirdLife South Africa.</Citation></Reference><Reference><Citation>DeFries, R. , Hansen, A. J. , Turner, B. L. , Reid, R. , &amp; Liu, J. (2007). Land use change around protected areas: Management to balance human needs and ecological function. Ecological Applications, 17, 1031&#x2013;1038. 10.1890/05-1111</Citation><ArticleIdList><ArticleId IdType="doi">10.1890/05-1111</ArticleId><ArticleId IdType="pubmed">17555216</ArticleId></ArticleIdList></Reference><Reference><Citation>Fiske, I. J. , &amp; Chandler, R. B. (2011). Unmarked: An R Package for Fitting Hierarchical Models of Wildlife Occurrence and Abundance. Journal of Statistical Software, 43, 1&#x2013;23.</Citation></Reference><Reference><Citation>Furness, R. W. , &amp; Greenwood, J. J. D. (1993). Birds as monitors of pollutants In Furness R. W., &amp; Greenwood J. J. D. (Eds.), Birds as monitors of environmental change (pp. 86&#x2013;143). Springer, Dordrecht, the Netherlands: Chapman &amp; Hall; 10.1007/978-94-015-1322-7</Citation><ArticleIdList><ArticleId IdType="doi">10.1007/978-94-015-1322-7</ArticleId></ArticleIdList></Reference><Reference><Citation>Gaston, K. J. (2010). Valuing common species. Science, 327, 154&#x2013;155. 10.1126/science.1182818</Citation><ArticleIdList><ArticleId IdType="doi">10.1126/science.1182818</ArticleId><ArticleId IdType="pubmed">20056880</ArticleId></ArticleIdList></Reference><Reference><Citation>Gaston, K. J. , &amp; Evans, K. L. (2004). Birds and people in Europe. Proceedings of the Royal Society of London B: Biological Sciences, 271, 1649&#x2013;1655. 10.1098/rspb.2004.2782</Citation><ArticleIdList><ArticleId IdType="doi">10.1098/rspb.2004.2782</ArticleId><ArticleId IdType="pmc">PMC1691767</ArticleId><ArticleId IdType="pubmed">15306313</ArticleId></ArticleIdList></Reference><Reference><Citation>Gaston, K. J. , &amp; Fuller, R. A. (2008). Commonness, population depletion and conservation biology. Trends in Ecology and Evolution, 23, 14&#x2013;19. 10.1016/j.tree.2007.11.001</Citation><ArticleIdList><ArticleId IdType="doi">10.1016/j.tree.2007.11.001</ArticleId><ArticleId IdType="pubmed">18037531</ArticleId></ArticleIdList></Reference><Reference><Citation>Gaston, K. J. , Jackson, S. F. , Cant&#xfa;&#x2010;Salazar, L. , &amp; Cruz&#x2010;Pi&#xf1;&#xf3;n, G. (2008). The ecological performance of protected areas. Annual Review of Ecology, Evolution, and Systematics, 39, 93&#x2013;113. 10.1146/annurev.ecolsys.39.110707.173529</Citation><ArticleIdList><ArticleId IdType="doi">10.1146/annurev.ecolsys.39.110707.173529</ArticleId></ArticleIdList></Reference><Reference><Citation>GBRMPA (2009). Great barrier reef outlook report. Townsville, Qld: Great Barrier Reef Marine Park Authority.</Citation></Reference><Reference><Citation>Geldmann, J. , Barnes, M. , Coad, L. , Craigie, I. D. , Hockings, M. , &amp; Burgess, N. D. (2013). Effectiveness of terrestrial protected areas in reducing habitat loss and population declines. Biological Conservation, 161, 230&#x2013;238. 10.1016/j.biocon.2013.02.018</Citation><ArticleIdList><ArticleId IdType="doi">10.1016/j.biocon.2013.02.018</ArticleId></ArticleIdList></Reference><Reference><Citation>Gray, C. L. , Hill, S. L. L. , Newbold, T. , Hudson, L. N. , B&#x4e7;rger, L. , Contu, S. , &#x2026; Scharlemann, J. P. W. (2016). Local biodiversity is higher inside than outside terrestrial protected areas worldwide. Nature Communications, 7, 1&#x2013;7.</Citation><ArticleIdList><ArticleId IdType="pmc">PMC4974472</ArticleId><ArticleId IdType="pubmed">27465407</ArticleId></ArticleIdList></Reference><Reference><Citation>Greve, M. , Chown, S. L. , van Rensburg, B. J. , Dallimer, M. , &amp; Gaston, K. J. (2011). The ecological effectiveness of protected areas: A case study for South African birds. Animal Conservation, 14, 295&#x2013;305. 10.1111/j.1469-1795.2010.00429.x</Citation><ArticleIdList><ArticleId IdType="doi">10.1111/j.1469-1795.2010.00429.x</ArticleId></ArticleIdList></Reference><Reference><Citation>Hansen, A. J. A. , &amp; Defries, R. (2007). Ecological mechanisms linking protected areas to surrounding lands. Ecological Applications, 17, 974&#x2013;988. 10.1890/05-1098</Citation><ArticleIdList><ArticleId IdType="doi">10.1890/05-1098</ArticleId><ArticleId IdType="pubmed">17555212</ArticleId></ArticleIdList></Reference><Reference><Citation>
=== 38549430
4:<PubmedArticle><MedlineCitation Status="MEDLINE" Owner="NLM" IndexingMethod="Curated"><PMID Version="1">38549430</PMID><DateCompleted><Year>2024</Year><Month>04</Month><Day>01</Day></DateCompleted><DateRevised><Year>2025</Year><Month>07</Month><Day>28</Day></DateRevised><Article PubModel="Print"><Journal><ISSN IssnType="Electronic">1096-9071</ISSN><JournalIssue CitedMedium="Internet"><Volume>96</Volume><Issue>4</Issue><PubDate><Year>2024</Year><Month>Apr</Month></PubDate></JournalIssue><Title>Journal of medical virology</Title><ISOAbbreviation>J Med Virol</ISOAbbreviation></Journal><ArticleTitle>Swine pseudorabies virus attenuated vaccine reprograms the kidney cancer tumor microenvironment and synergizes with PD-1 blockade.</ArticleTitle><Pagination><StartPage>e29568</StartPage><MedlinePgn>e29568</MedlinePgn></Pagination><ELocationID EIdType="doi" ValidYN="Y">10.1002/jmv.29568</ELocationID><Abstract><AbstractText>The global incidence rate of kidney cancer (KC) has been steadily increasing over the past 30 years. With the aging global population, kidney cancer has become an escalating concern that necessitates vigilant surveillance. Nowadays, surgical intervention remains the optimal therapeutic approach for kidney cancer, while the availability of efficacious treatments for advanced tumors remains limited. Oncolytic viruses, an emerging form of immunotherapy, have demonstrated encouraging anti-neoplastic properties and are progressively garnering public acceptance. However, research on oncolytic viruses in kidney cancer is relatively limited. Furthermore, given the high complexity and heterogeneity of kidney cancer, it is crucial to identify an optimal oncolytic virus agent that is better suited for its treatment. The present study investigates the oncolytic activity of the Pseudorabies virus live attenuated vaccine (PRV-LAV) against KC. The findings clearly demonstrate that PRV-LAV exhibits robust oncolytic activity targeting KC cell lines. Furthermore, the therapeutic efficacy of PRV-LAV was confirmed in both a subcutaneous tumor-bearing nude mouse model and a syngeneic mouse model of KC. Combined RNA-seq analysis and flow cytometry revealed that PRV-LAV treatment substantially enhances the infiltration of a diverse range of lymphocytes, including T cells, B cells, macrophages, and NK cells. Additionally, PRV-LAV treatment enhances T cell activation and exerts antitumor effects. Importantly, the combination of PRV-LAV with anti-PD-1 antibodies, an approved drug for KC treatment, synergistically enhances the efficacy against KC. Overall, the discovery of PRV-LAV as an effective oncolytic virus holds significant importance for improving the treatment efficacy and survival rates of KC patients.</AbstractText><CopyrightInformation>&#xa9; 2024 The Authors. Journal of Medical Virology published by Wiley Periodicals LLC.</CopyrightInformation></Abstract><AuthorList CompleteYN="Y"><Author ValidYN="Y"><LastName>Gui</LastName><ForeName>Mengxuan</ForeName><Initials>M</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Wu</LastName><ForeName>Chongxin</ForeName><Initials>C</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Qi</LastName><ForeName>Ruoyao</ForeName><Initials>R</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Zeng</LastName><ForeName>Yue</ForeName><Initials>Y</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Huang</LastName><ForeName>Pengfei</ForeName><Initials>P</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Cao</LastName><ForeName>Jiali</ForeName><Initials>J</Initials><Identifier Source="ORCID">0000-0002-6286-5574</Identifier><AffiliationInfo><Affiliation>Department of Laboratory Medicine, Fujian Key Clinical Specialty of Laboratory Medicine, Women and Children's Hospital, School of Medicine, Xiamen University, Xiamen.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Chen</LastName><ForeName>Tian</ForeName><Initials>T</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Chen</LastName><ForeName>Kaiyun</ForeName><Initials>K</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Lin</LastName><ForeName>Lina</ForeName><Initials>L</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Han</LastName><ForeName>Qiangyuan</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>He</LastName><ForeName>Peiqing</ForeName><Initials>P</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Fu</LastName><ForeName>Rao</ForeName><Initials>R</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Wu</LastName><ForeName>Qian</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Yuan</LastName><ForeName>Quan</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Zhang</LastName><ForeName>Tianying</ForeName><Initials>T</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Xia</LastName><ForeName>Ningshao</ForeName><Initials>N</Initials><Identifier Source="ORCID">0000-0003-0179-5266</Identifier><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Wang</LastName><ForeName>Guosong</ForeName><Initials>G</Initials><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Chen</LastName><ForeName>Yixin</ForeName><Initials>Y</Initials><Identifier Source="ORCID">0000-0002-9591-634X</Identifier><AffiliationInfo><Affiliation>State Key Laboratory of Vaccines for Infectious Diseases, National Institute of Diagnostics and Vaccine Development in Infectious Diseases, State Key Laboratory of Molecular Vaccinology and Molecular Diagnostics, School of Life Sciences, School of Public Health, Xiamen University, Xiamen, People's Republic of China.</Affiliation></AffiliationInfo></Author></AuthorList><Language>eng</Language><GrantList CompleteYN="Y"><Grant><Agency>National Natural Science Foundation of China</Agency><Country/></Grant><Grant><Agency>China Postdoctoral Science Foundation</Agency><Country/></Grant></GrantList><PublicationTypeList><PublicationType UI="D016428">Journal Article</PublicationType><PublicationType UI="D013485">Research Support, Non-U.S. Gov't</PublicationType></PublicationTypeList></Article><MedlineJournalInfo><Country>United States</Country><MedlineTA>J Med Virol</MedlineTA><NlmUniqueID>7705876</NlmUniqueID><ISSNLinking>0146-6615</ISSNLinking></MedlineJournalInfo><ChemicalList><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D061026">Programmed Cell Death 1 Receptor</NameOfSubstance></Chemical><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D014613">Vaccines, Attenuated</NameOfSubstance></Chemical><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D019496">Cancer Vaccines</NameOfSubstance></Chemical><Chemical><RegistryNumber>0</RegistryNumber><NameOfSubstance UI="D000082082">Immune Checkpoint Inhibitors</NameOfSubstance></Chemical></ChemicalList><CitationSubset>IM</CitationSubset><MeshHeadingList><MeshHeading><DescriptorName UI="D000818" MajorTopicYN="N">Animals</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D006801" MajorTopicYN="N">Humans</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D051379" MajorTopicYN="N">Mice</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D045744" MajorTopicYN="N">Cell Line, Tumor</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D011558" MajorTopicYN="Y">Herpesvirus 1, Suid</DescriptorName><QualifierName UI="Q000235" MajorTopicYN="N">genetics</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D007680" MajorTopicYN="Y">Kidney Neoplasms</DescriptorName><QualifierName UI="Q000628" MajorTopicYN="N">therapy</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D050504" MajorTopicYN="Y">Oncolytic Viruses</DescriptorName><QualifierName UI="Q000235" MajorTopicYN="N">genetics</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D061026" MajorTopicYN="N">Programmed Cell Death 1 Receptor</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D059016" MajorTopicYN="N">Tumor Microenvironment</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D014613" MajorTopicYN="N">Vaccines, Attenuated</DescriptorName></MeshHeading><MeshHeading><DescriptorName UI="D019496" MajorTopicYN="Y">Cancer Vaccines</DescriptorName><QualifierName UI="Q000627" MajorTopicYN="N">therapeutic use</QualifierName></MeshHeading><MeshHeading><DescriptorName UI="D000082082" MajorTopicYN="Y">Immune Checkpoint Inhibitors</DescriptorName><QualifierName UI="Q000627" MajorTopicYN="N">therapeutic use</QualifierName></MeshHeading></MeshHeadingList><KeywordList Owner="NOTNLM"><Keyword MajorTopicYN="N">cancer therapy</Keyword><Keyword MajorTopicYN="N">immune checkpoint inhibitors</Keyword><Keyword MajorTopicYN="N">oncolytic virus</Keyword><Keyword MajorTopicYN="N">tumor microenvironment</Keyword></KeywordList></MedlineCitation><PubmedData><History><PubMedPubDate PubStatus="revised"><Year>2024</Year><Month>1</Month><Day>27</Day></PubMedPubDate><PubMedPubDate PubStatus="received"><Year>2023</Year><Month>10</Month><Day>19</Day></PubMedPubDate><PubMedPubDate PubStatus="accepted"><Year>2024</Year><Month>3</Month><Day>2</Day></PubMedPubDate><PubMedPubDate PubStatus="medline"><Year>2024</Year><Month>4</Month><Day>1</Day><Hour>6</Hour><Minute>43</Minute></PubMedPubDate><PubMedPubDate PubStatus="pubmed"><Year>2024</Year><Month>3</Month><Day>29</Day><Hour>6</Hour><Minute>46</Minute></PubMedPubDate><PubMedPubDate PubStatus="entrez"><Year>2024</Year><Month>3</Month><Day>29</Day><Hour>2</Hour><Minute>53</Minute></PubMedPubDate></History><PublicationStatus>ppublish</PublicationStatus><ArticleIdList><ArticleId IdType="pubmed">38549430</ArticleId><ArticleId IdType="doi">10.1002/jmv.29568</ArticleId></ArticleIdList><ReferenceList><Title>REFERENCES</Title><Reference><Citation>Sung H, Ferlay J, Siegel RL, et al. Global cancer statistics 2020: GLOBOCAN estimates of incidence and mortality worldwide for 36 cancers in 185 countries. CA Cancer J Clin. 2021;71(3):209&#x2010;249.</Citation></Reference><Reference><Citation>Hsieh JJ, Purdue MP, Signoretti S, et al. Renal cell carcinoma. Nat Rev Dis Primers. 2017;3:17009.</Citation></Reference><Reference><Citation>Buti S, Bersanelli M, Donini M, Ardizzoni A. Systemic adjuvant therapies in renal cell carcinoma. Oncol Rev. 2012;6(2):18.</Citation></Reference><Reference><Citation>Sun M, Marconi L, Eisen T, et al. Adjuvant vascular endothelial growth factor&#x2010;targeted therapy in renal cell carcinoma: A systematic review and pooled analysis. Eur Urol. 2018;74(5):611&#x2010;620.</Citation></Reference><Reference><Citation>Siegel R, Ma J, Zou Z, Jemal A. Cancer statistics, 2014. CA Cancer J Clin. 2014;64(1):9&#x2010;29.</Citation></Reference><Reference><Citation>Bray F, Ferlay J, Soerjomataram I, Siegel RL, Torre LA, Jemal A. Global cancer statistics 2018: GLOBOCAN estimates of incidence and mortality worldwide for 36 cancers in 185 countries. CA Cancer J Clin. 2018;68(6):394&#x2010;424.</Citation></Reference><Reference><Citation>Meric&#x2010;Bernstam F, Tannir NM, Iliopoulos O, et al. Telaglenastat plus cabozantinib or everolimus for advanced or metastatic renal cell carcinoma: an open&#x2010;label phase I trial. Clin Cancer Res. 2022;28(8):1540&#x2010;1548.</Citation></Reference><Reference><Citation>Giubellino A, Linehan WM, Bottaro DP. Targeting the met signaling pathway in renal cancer. Expert Rev Anticancer Ther. 2009;9(6):785&#x2010;793.</Citation></Reference><Reference><Citation>Chow WH, Gridley G, Fraumeni JF, J&#xe4;rvholm B. Obesity, hypertension, and the risk of kidney cancer in men. N Engl J Med. 2000;343(18):1305&#x2010;1311.</Citation></Reference><Reference><Citation>Renehan AG, Tyson M, Egger M, Heller RF, Zwahlen M. Body&#x2010;mass index and incidence of cancer: a systematic review and meta&#x2010;analysis of prospective observational studies. Lancet. 2008;371(9612):569&#x2010;578.</Citation></Reference><Reference><Citation>Chow WH, Dong LM, Devesa SS. Epidemiology and risk factors for kidney cancer. Nat Rev Urol. 2010;7(5):245&#x2010;257.</Citation></Reference><Reference><Citation>Habibe JJ, Clemente&#x2010;Olivo MP, Scheithauer TPM, et al. Glucose&#x2010;mediated insulin secretion is improved in FHL2&#x2010;deficient mice and elevated FHL2 expression in humans is associated with type 2 diabetes. Diabetologia. 2022;65(10):1721&#x2010;1733.</Citation></Reference><Reference><Citation>Zhong WF, Wang XH, Pan B, Li F, Kuang L, Su ZX. Eupatilin induces human renal cancer cell apoptosis via ROS&#x2010;mediated MAPK and PI3K/AKT signaling pathways. Oncol Lett. 2016;12(4):2894&#x2010;2899.</Citation></Reference><Reference><Citation>Galluzzi L, Chan TA, Kroemer G, Wolchok JD, L&#xf3;pez&#x2010;Soto A. The hallmarks of successful anticancer immunotherapy. Sci Transl Med. 2018;10(459):eaat7807.</Citation></Reference><Reference><Citation>Maus MV, Fraietta JA, Levine BL, Kalos M, Zhao Y, June CH. Adoptive immunotherapy for cancer or viruses. Annu Rev Immunol. 2014;32:189&#x2010;225.</Citation></Reference><Reference><Citation>Kirkwood JM, Butterfield LH, Tarhini AA, Zarour H, Kalinski P, Ferrone S. Immunotherapy of cancer in 2012. CA Cancer J Clin. 2012;62(5):309&#x2010;335.</Citation></Reference><Reference><Citation>Shinder BM, Rhee K, Farrell D, et al. Surgical management of advanced and metastatic renal cell carcinoma: a multidisciplinary approach. Front Oncol. 2017;7:107.</Citation></Reference><Reference><Citation>Shen C, Beroukhim R, Schumacher SE, et al. Genetic and functional studies implicate HIF1&#x3b1; as a 14q kidney cancer suppressor gene. Cancer Discov. 2011;1(3):222&#x2010;235.</Citation></Reference><Reference><Citation>Kim A, Balis FM, Widemann BC. Sorafenib and sunitinib. Oncologist. 2009;14(8):800&#x2010;805.</Citation></Reference><Reference><Citation>Siegel AB, Olsen SK, Magun A, Brown Jr. RS. Sorafenib: where do we go from here? Hepatology. 2010;52(1):360&#x2010;369.</Citation></Reference><Reference><Citation>Lee JM, Ivy SP, Kohn EC. Challenges and opportunities for immunotherapies in gynecologic cancers. Oncology (Williston Park, N.Y.). 2016;30(1):67&#x2010;69.</Citation></Reference><Reference><Citation>Qin LX. Inflammatory immune responses in tumor microenvironment and metastasis of hepatocellular carcinoma. Cancer Microenviron. 2012;5(3):203&#x2010;209.</Citation></Reference><Reference><Citation>Hu&#x2010;Lieskovan S, Bhaumik S, Dhodapkar K, et al. SITC cancer immunotherapy resource document: a compass in the land of biomarker discovery. J Immunother Cancer. 2020;8(2):e000705.</Citation></Reference><Reference><Citation>Kaufman HL, Kohlhapp FJ, Zloza A. Oncolytic viruses: a new class of immunotherapy drugs. Nat Rev Drug Discov. 2015;14(9):642&#x2010;662.</Citation></Reference><Reference><Citation>Maruyama Y, Sakurai A, Noda S, et al Regulatory issues: PMDA &#x2010; review of sakigake designation products: oncolytic virus therapy with delytact injection (Teserpaturev) for Malignant glioma. Oncologist. 2023;28(8):664&#x2010;670.</Citation></Reference><Reference><Citation>Ottolino&#x2010;Perry K, Diallo JS, Lichty BD, Bell JC, Andrea McCart J. Intelligent design: combination therapy with oncolytic viruses. Mol Ther. 2010;18(2):251&#x2010;263.</Citation></Reference><Reference><Citation>Desbois M, Udyavar AR, Ryner L, et al. Integrated digital pathology and transcriptome analysis identifies molecular mediators of T&#x2010;cell exclusion in ovarian cancer. Nat Commun. 2020;11(1):5583.</Citation></Reference><Reference><Citation>Ye B, Stary CM, Li X, Gao Q, Kang C, Xiong X. Engineering chimeric antigen receptor&#x2010;T cells for cancer treatment. Mol Cancer. 2018;17(1):32.</Citation></Reference><Reference><Citation>M&#xfc;ller T, Hahn EC, Tottewitz F, et al. Pseudorabies virus in wild swine: a global perspective. Arch Virol. 2011;156(10):1691&#x2010;1705.</Citation></Reference><Reference><Citation>Wang G, Chen R, Huang P, et al. Adefovir dipivoxil efficiently inhibits the proliferation of pseudorabies virus in vitro and in vivo. Antiviral Res. 2021;186:105014.</Citation></Reference><Reference><Citation>Wang G, Zha Z, Huang P, et al. Structures of pseudorabies virus capsids. Nat Commun. 2022;13(1):1533.</Citation></Reference><Reference><Citation>Hu RM, Zhou Q, Song WB, et al. Novel pseudorabies virus variant with defects in TK, gE and gI protects growing pigs against lethal challenge. Vaccine. 2015;33(43):5733&#x2010;5740.</Citation></Reference><Reference><Citation>Ai JW, Weng SS, Cheng Q, et al. Human endophthalmitis caused by pseudorabies virus infection, China, 2017. Emerging Infect Dis. 2018;24(6):1087&#x2010;1090.</Citation></Reference><Reference><Citation>Yang X, Guan H, Li C, et al. Characteristics of human encephalitis caused by pseudorabies virus: a case series study. Int J Infect Dis. 2019;87:92&#x2010;99.</Citation></Reference><Reference><Citation>Liu Q, Wang X, Xie C, et al. A novel human acute encephalitis caused by pseudorabies virus variant strain. Clin Infect Dis. 2020;73(11):e3690&#x2010;e3700.</Citation></Reference><Reference><Citation>Wang D, Tao X, Fei M, et al. Human encephalitis caused by pseudorabies virus infection: a case report. J Neurovirol. 2020;26:442&#x2010;448.</Citation></Reference><Reference><Citation>Zheng L, Liu X, Yuan D, et al. Dynamic cerebrospinal fluid analyses of severe pseudorabies encephalitis. Transbound Emerg Dis. 2019;66(6):2562&#x2010;2565.</Citation></Reference><Reference><Citation>Li A, Lu G, Qi J, et al. Structural basis of nectin&#x2010;1 recognition by pseudorabies virus glycoprotein D. PLoS Pathog. 2017;13(5):e1006314.</Citation></Reference><Reference><Citation>Wang G, Cao J, Gui M, et al. The potential of swine pseudorabies virus attenuated vaccine for oncolytic therapy against malignant tumors. J&#xa0;Exp&#xa0;Clin&#xa0;Cancer Res: CR. 2023;42(1):284.</Citation></Reference><Reference><Citation>Fu X, Nakamori M, Tao L, Amato R, Zhang X. Antitumor effects of two newly constructed oncolytic herpes simplex viruses against renal cell carcinoma. Int J Oncol. 2007;30(6):1561&#x2010;1567.</Citation></Reference><Reference><Citation>Lawson KA, Mostafa AA, Shi ZQ, et al. Repurposing sunitinib with oncolytic reovirus as a novel immunotherapeutic strategy for renal cell carcinoma. Clin Cancer Res. 2016;22(23):5839&#x2010;5850.</Citation></Reference><Reference><Citation>Wang H, Song L, Zhang X, Zhang X, Zhou X. Bluetongue viruses act as novel oncolytic viruses to effectively inhibit human renal cancer cell growth in vitro and in vivo. Med Sci Monit. 2021;27:e930634.</Citation></Reference><Reference><Citation>Pan Y, Guo L, Miao Q, et al. Association of THBS3 with glycoprotein D promotes pseudorabies virus attachment, fusion, and entry. J Virol. 2023;97(2):e0187122.</Citation></Reference><Reference><Citation>Wang G, Qu F, Zhou J, Zhu B, Gao Y. Elevated THBS3 predicts poor overall survival for clear cell renal cell carcinoma and identifies LncRNA/RBP/THBS3 mRNA networks. Cell Cycle. 2023;22(3):316&#x2010;330.</Citation></Reference><Reference><Citation>Bommareddy PK, Aspromonte S, Zloza A, Rabkin SD, Kaufman HL. MEK inhibition enhances oncolytic virus immunotherapy through increased tumor cell killing and T cell activation. Sci Transl Med. 2018;10(471):eaau0417.</Citation></Reference><Reference><Citation>Lin C, Ren W, Luo Y, et al. Intratumoral delivery of a PD&#x2010;1&#x2010;Blocking scfv encoded in oncolytic HSV&#x2010;1 promotes antitumor immunity and synergizes with TIGIT blockade. Cancer Immunol&#xa0;Res. 2020;8(5):632&#x2010;647.</Citation></Reference><Reference><Citation>Zamarin D, Ricca JM, Sadekova S, et al. PD&#x2010;L1 in tumor microenvironment mediates resistance to oncolytic immunotherapy. J Clin Invest. 2018;128(4):1413&#x2010;1428.</Citation></Reference><Reference><Citation>Bourgeois&#x2010;Daigneault MC, Roy DG, Aitken AS, et al. Neoadjuvant oncolytic virotherapy before surgery sensitizes triple&#x2010;negative breast cancer to immune checkpoint therapy. Sci Transl Med. 2018;10(422):eaao1641.</Citation></Reference><Reference><Citation>Germain C, Gnjatic S, Tamzalit F, et al. Presence of B cells in tertiary lymphoid structures is associated with a protective immunity in patients with lung cancer. Am J Respir Crit Care Med. 2014;189(7):832&#x2010;844.</Citation></Reference><Reference><Citation>Hollern DP, Xu N, Thennavan A, et al. B cells and T follicular helper cells mediate response to checkpoint inhibitors in high mutation burden mouse models of breast cancer. Cell. 2019;179(5):1191&#x2010;1206.e1121.</Citation></Reference><Reference><Citation>Petitprez F, de Reyni&#xe8;s A, Keung EZ, et al. B cells are associated with survival and immunotherapy response in sarcoma. Nature. 2020;577(7791):556&#x2010;560.</Citation></Reference></ReferenceList></PubmedData></PubmedArticle></PubmedArticleSet>
=== 39791235
4:<PubmedArticle><MedlineCitation Status="PubMed-not-MEDLINE" Owner="NLM"><PMID Version="1">39791235</PMID><DateRevised><Year>2025</Year><Month>01</Month><Day>10</Day></DateRevised><Article PubModel="Print-Electronic"><Journal><ISSN IssnType="Electronic">1523-7052</ISSN><JournalIssue CitedMedium="Internet"><Volume>27</Volume><Issue>1</Issue><PubDate><Year>2025</Year><Month>Jan</Month><Day>10</Day></PubDate></JournalIssue><Title>Organic letters</Title><ISOAbbreviation>Org Lett</ISOAbbreviation></Journal><ArticleTitle>Palladium-Catalyzed Enantioselective Synthesis of P(V)-Stereogenic Compounds via Desymmetric Annulation of Prochiral Phosphinamides and Aryl Iodides.</ArticleTitle><Pagination><StartPage>121</StartPage><EndPage>128</EndPage><MedlinePgn>121-128</MedlinePgn></Pagination><ELocationID EIdType="doi" ValidYN="Y">10.1021/acs.orglett.4c04007</ELocationID><Abstract><AbstractText>The enantioselective synthesis of P(V)-stereogenic compounds has emerged as an interesting research topic primarily due to their significant biological activity and broad application prospects. Herein, we disclose a method for the construction of P(V)-stereogenic compounds from prochiral phosphinamides and aryl iodides via palladium- and chiral norbornene-catalyzed desymmetric annulation. The P(V)-stereogenic compounds were formed with a broad scope with excellent enantiomeric excesses. It is noteworthy that the synthetic value of this procedure was proven by a variety of transition metal-catalyzed cross-coupling reactions using the C-Br bond on the product as a versatile linchpin electrophile.</AbstractText></Abstract><AuthorList CompleteYN="Y"><Author ValidYN="Y"><LastName>Tian</LastName><ForeName>Qingyu</ForeName><Initials>Q</Initials><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Ge</LastName><ForeName>Jin</ForeName><Initials>J</Initials><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Liu</LastName><ForeName>Yaopeng</ForeName><Initials>Y</Initials><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Wu</LastName><ForeName>Xi</ForeName><Initials>X</Initials><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Li</LastName><ForeName>Zhenghao</ForeName><Initials>Z</Initials><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author><Author ValidYN="Y"><LastName>Cheng</LastName><ForeName>Guolin</ForeName><Initials>G</Initials><Identifier Source="ORCID">0000-0003-1013-2456</Identifier><AffiliationInfo><Affiliation>College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo><AffiliationInfo><Affiliation>Xiamen Key Laboratory of Optoelectronic Materials and Advanced Manufacturing, College of Materials Science and Engineering, Huaqiao University, Xiamen 361021, China.</Affiliation></AffiliationInfo></Author></AuthorList><Language>eng</Language><PublicationTypeList><PublicationType UI="D016428">Journal Article</PublicationType></PublicationTypeList><ArticleDate DateType="Electronic"><Year>2024</Year><Month>12</Month><Day>30</Day></ArticleDate></Article><MedlineJournalInfo><Country>United States</Country><MedlineTA>Org Lett</MedlineTA><NlmUniqueID>100890393</NlmUniqueID><ISSNLinking>1523-7052</ISSNLinking></MedlineJournalInfo><CitationSubset>IM</CitationSubset></MedlineCitation><PubmedData><History><PubMedPubDate PubStatus="medline"><Year>2025</Year><Month>1</Month><Day>10</Day><Hour>6</Hour><Minute>20</Minute></PubMedPubDate><PubMedPubDate PubStatus="pubmed"><Year>2025</Year><Month>1</Month><Day>10</Day><Hour>6</Hour><Minute>19</Minute></PubMedPubDate><PubMedPubDate PubStatus="entrez"><Year>2025</Year><Month>1</Month><Day>10</Day><Hour>4</Hour><Minute>34</Minute></PubMedPubDate></History><PublicationStatus>ppublish</PublicationStatus><ArticleIdList><ArticleId IdType="pubmed">39791235</ArticleId><ArticleId IdType="doi">10.1021/acs.orglett.4c04007</ArticleId></ArticleIdList></PubmedData></PubmedArticle></PubmedArticleSet>

thinking
**Investigating PMID mismatch**
codex
I hit an ID mismatch between some scraped snippets and NCBI API records, so I’m verifying directly from the PubMed page URLs themselves to avoid carrying incorrect PMID-linked data.
exec
/bin/bash -lc 'set -euo pipefail
for u in 32313435 38549430 40482261; do
  echo "=== $u ==="
  curl -L -sS "https://pubmed.ncbi.nlm.nih.gov/$u/" | rg -n '"'<title>|citation_title|citation_date|citation_journal_title|Sunset Yellow|FCF|FD&C|E110|hyperactivity|DNA damage|genotoxic|rats|mice' | head -n 30 || true
  echo
 done" in /home/exedev/chewber succeeded in 1.07s:
47:    <title>Effectiveness of protected areas for bird conservation depends on guild - PubMed</title>
148:<meta name="citation_title" content="Effectiveness of protected areas for bird conservation depends on guild">
156:    <meta name="citation_date" content="2018 Aug">
162:<meta name="citation_journal_title" content="Diversity &amp; distributions">
3164:                    <title>Twitter</title>
3174:                <title>Facebook</title>
3182:                <title>LinkedIn</title>
3201:                <title>GitHub</title>
3241:                        <title>Twitter</title>
3269:                      <title>SM-Facebook</title>
3283:                      <title>SM-Youtube</title>

=== 38549430 ===
45:    <title>Swine pseudorabies virus attenuated vaccine reprograms the kidney cancer tumor microenvironment and synergizes with PD-1 blockade - PubMed</title>
146:<meta name="citation_title" content="Swine pseudorabies virus attenuated vaccine reprograms the kidney cancer tumor microenvironment and synergizes with PD-1 blockade">
154:    <meta name="citation_date" content="2024 Apr">
160:<meta name="citation_journal_title" content="Journal of medical virology">
3463:                    <title>Twitter</title>
3473:                <title>Facebook</title>
3481:                <title>LinkedIn</title>

thinking
**Planning robust PubMed retrieval**
exec
/bin/bash -lc "set -euo pipefail
term='(\"Sunset Yellow\"[Title/Abstract] OR \"Sunset Yellow FCF\"[Title/Abstract] OR \"FD&C Yellow No. 6\"[Title/Abstract] OR \"E110\"[Title/Abstract]) AND (toxicity[Title/Abstract] OR safety[Title/Abstract] OR genotoxicity[Title/Abstract] OR neurotoxicity[Title/Abstract])'
ids="'$(curl -sS --get '"'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi' --data-urlencode db=pubmed --data-urlencode term=\""'$term" --data-urlencode retmax=20 --data-urlencode sort=pub+date --data-urlencode retmode=json | jq -r '"'.esearchresult.idlist[]')
echo \"IDs: "'$ids"
for p in $ids; do
  echo "=== $p ==="
  curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | tr -d '"'\\n' | sed 's/<PubmedArticle>/\\n<PubmedArticle>/g' | rg -o '<ArticleTitle>["'^<]+'"' | head -n 1 | sed 's/<ArticleTitle>/Title: /'
  curl -sS \"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id="'$p&retmode=xml" | tr -d '"'\\n' | rg -o '<PubDate>.*?</PubDate>' | head -n 1 | sed -E 's/<["'^>]+>/ /g'"' | xargs -I{} echo \"PubDate:{}\"
  abs="'$(curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | tr -d '"'\\n' | sed 's/<AbstractText /\\n<AbstractText /g' | sed 's/<\\/AbstractText>/<\\/AbstractText>\\n/g' | rg -o '<AbstractText["'^>]*>.*</AbstractText>'"' | sed -E 's/<["'^>]+>//g'"' | tr '\\n' ' ' | head -c 500)
  echo \"Abstract: "'$abs"
  echo "URL: https://pubmed.ncbi.nlm.nih.gov/$p/"
  echo
done' in /home/exedev/chewber
thinking
**Refining search query for toxicity**
exec
/bin/bash -lc "set -euo pipefail
for q in \\
'\"sunset yellow\" AND genotoxicity' \\
'\"sunset yellow\" AND neurotoxicity' \\
'\"sunset yellow\" AND rats' \\
'\"sunset yellow\" AND review'; do
  echo \"### "'$q"
  ids=$(curl -sS --get '"'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi' --data-urlencode db=pubmed --data-urlencode term=\""'$q" --data-urlencode retmax=10 --data-urlencode sort=pub+date --data-urlencode retmode=json | jq -r '"'.esearchresult.idlist[]')
  echo \""'$ids"
  for p in $ids; do
    title=$(curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=$p&retmode=json" | jq -r ".result.'"\\\""'$p'"\\\".title\")
    pubdate="'$(curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=$p&retmode=json" | jq -r ".result.'"\\\""'$p'"\\\".pubdate\")
    echo \"- "'$p | $pubdate | $title"
  done
  echo
done' in /home/exedev/chewber exited 1 in 17.71s:
IDs: 41641238
41536140
41475728
41464968
41399877
41235060
41027211
41008193
40932656
40878592
40737797
40325015
40277576
39742613
39702875
39658164
39619924
39260596
39058118
38992260
 exited 5 in 6.54s:
41008193
38899585
38431714
34454997
30280050
30208729
29506635
29322347
25954313
25553699
- 41008193 | 2025 Sep 17 | null
- 38899585 | 2025 May-Jun | Photoprotective efficacy of Sunset Yellow via inhibition of type-I and type-II pathway under exposure of sunlight.
- 38431714 | 2024 Mar 2 | null
- 34454997 | 2021 Oct | Latest advances on the nanomaterials-based electrochemical analysis of azo toxic dyes Sunset Yellow and Tartrazine in food samples.
- 30280050 | 2018 | null
- 30208729 | 2020 Sep | In vivo genotoxicity assessment of sunset yellow and sodium benzoate in female rats.
- 29506635 | 2018 Feb 28 | null
- 29322347 | 2018 Feb | All aspect of toxic effect of brilliant blue and sunset yellow in Allium cepa roots.
- 25954313 | 2015 | null
- 25553699 | 2015 Jan | Genotoxic and cytotoxic effects of Sunset Yellow and Brilliant Blue, colorant food additives, on human blood lymphocytes.

thinking
**Handling missing titles for PMIDs**
exec
/bin/bash -lc 'for p in 41008193 38431714 30280050 29506635; do echo "=== $p"; curl -L -sS "https://pubmed.ncbi.nlm.nih.gov/$p/" | rg -n '"'<title>|citation_title|citation_date|citation_journal_title' | head -n 10; done" in /home/exedev/chewber succeeded in 1.80s:
47:    <title>A Green Synthesis of Fluorescent Carbon Dots and Their Application to the Determination of Sunset Yellow - PubMed</title>
148:<meta name="citation_title" content="A Green Synthesis of Fluorescent Carbon Dots and Their Application to the Determination of Sunset Yellow">
156:    <meta name="citation_date" content="09/17/2025">
162:<meta name="citation_journal_title" content="Foods (Basel, Switzerland)">
3701:                    <title>Twitter</title>
3711:                <title>Facebook</title>
3719:                <title>LinkedIn</title>
3738:                <title>GitHub</title>
3778:                        <title>Twitter</title>
3806:                      <title>SM-Facebook</title>
=== 38431714
47:    <title>Sunset Yellow protects against oxidative damage and exhibits chemoprevention in chemically induced skin cancer model - PubMed</title>
148:<meta name="citation_title" content="Sunset Yellow protects against oxidative damage and exhibits chemoprevention in chemically induced skin cancer model">
156:    <meta name="citation_date" content="03/02/2024">
162:<meta name="citation_journal_title" content="NPJ systems biology and applications">
5030:                    <title>Twitter</title>
5040:                <title>Facebook</title>
5048:                <title>LinkedIn</title>
5067:                <title>GitHub</title>
5107:                        <title>Twitter</title>

thinking
**Planning abstract extraction**
exec
/bin/bash -lc 'set -euo pipefail
for p in 30280050 30208729 29506635 25553699 38431714; do
  echo "=== PMID $p ==="
  curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | '"\\
    tr -d '\\n' | \\
    perl -pe 's#<AbstractText#\\n<AbstractText#g; s#</AbstractText>#</AbstractText>\\n#g; s#<ArticleTitle>#\\n<ArticleTitle>#g; s#</ArticleTitle>#</ArticleTitle>\\n#g; s#<PubDate>#\\n<PubDate>#g; s#</PubDate>#</PubDate>\\n#g' | \\
    rg -o '<ArticleTitle>.*</ArticleTitle>|<PubDate>.*</PubDate>|<AbstractText["'^>]*>.*</AbstractText>'"' | \\
    sed -E 's/<["'^>]+>//g'"' | head -n 8
  echo \"URL: https://pubmed.ncbi.nlm.nih.gov/"'$p/"
  echo
done' in /home/exedev/chewber succeeded in 1.77s:
2018
Sunset Yellow and Allura Red modulate Bcl2 and COX2 expression levels and confer oxidative stress-mediated renal and hepatic toxicity in male rats.
Studies on the adverse health effects caused by azo dyes are insufficient and quite contradictory. This work aims to investigate the possible toxic effect of two types of widely used food additives, Sunset Yellow and Allura Red, by assessing the physiological, histopathological and ultrastructural changes in the liver and kidney. Also, we investigated the genotoxic effect of both dyes on white blood cells. Thirty adult male albino rats were divided into three groups of 10 animals each: control (received water), Sunset Yellow-treated (2.5 mg/kg body weight) and Allura Red-treated (seven mg/kg body weight). The doses were orally applied for 4 weeks. Our results indicated an increase in the biochemical markers of hepatic and renal function (Aspartate aminotransferase, alanine aminotransferase, urea, uric acid and creatinine) in animals administered with the azo dyes. We also observed a noticeable increase in MDA and a marked decrease in total antioxidant levels in azo dye-treated animals compared to controls. Conversely, both dyes adversely affected the liver and kidney of albino rats and altered their histological and fine structure, with downregulation of Bcl2 and upregulation of COX2 expression. Our comet assay results showed a significant elevation in the fold change of tail moment in response to application of Sunset Yellow but not Allura Red. Collectively, we show that Sunset Yellow and Allura Red cause histopathological and physiological aberrations in the liver and kidney of male Wistar albino rats. Moreover, Sunset Yellow but not Allura Red induces a potential genotoxic effect.
URL: https://pubmed.ncbi.nlm.nih.gov/30280050/

=== PMID 30208729 ===
2020Sep
In vivo genotoxicity assessment of sunset yellow and sodium benzoate in female rats.
The use of additives in different food products is growing up. It has attracted the attention towards the relation between the mutagenic potential of human diseases and food additives. Sunset yellow (SY) and sodium benzoate (NaB) are used as colorant and food additives worldwide. In the present study, genotoxic effects of different combinations of SY and NaB were assessed in vivo in female rats. Different combinations of SY and NaB were dissolved in water and administered daily to six animals groups for 12&#x2009;weeks. Group 1 (control) received water, Group 2 received 5&#x2009;mg/kg body weight (bw) SY plus 10&#x2009;mg/kg bw NaB, group 3 received 5&#x2009;mg/kg SY plus 100&#x2009;mg/kg NaB, group 4 received 50&#x2009;mg SY plus 100&#x2009;mg/kg NaB, group 5 received 50&#x2009;mg/kg SY plus 10&#x2009;mg/kg NaB, group 6 received 200&#x2009;mg/kg SY plus 750&#x2009;mg/kg NaB, and group 7 received 20&#x2009;mg/kg SY plus 75&#x2009;mg/kg NaB. Genotoxicity investigations (Chromosomal aberration of bone marrow cells, Comet assay and DNA profile of liver cells) were carried out at the end of the experiment. Administration of 200&#x2009;mg/kg SY plus 750&#x2009;mg/kg NaB (group 6) induced the highest abnormalities percentage (1.5%) and showed structural abnormalities including end-to-end association, fragmentation, chromatid break, ring chromosome, and centric fusion break of chromosomes. Different combinations of SY and NaB induced an increase in the frequency of tailed nuclei (DNA damage) in liver cells. A concentration-dependent distinct DNA smear pattern was observed in the DNA isolated from liver cells of animals administered SY and NaB. In addition, administration of SY plus NaB resulted in an abnormal distribution of serum proteins. The results showed that the SY plus NaB could have genotoxic potential. With the increase applications of food additives, this study reported important data about screening the potential impacts.
URL: https://pubmed.ncbi.nlm.nih.gov/30208729/

=== PMID 29506635 ===
2018Feb28
Genotoxicity and cytotoxicity analysis of curcumin and sunset yellow in human lymphocyte culture.
Genotoxic and cytotoxic effects of curcumin and sunset yellow were tested by the chromosome aberration analysis and cytokinesis-block micronucleus cytome assay in human lymphocyte culture. Water solutions of food dyes, in concentrations of 1, 2, 4 and 8 mM, were added to the cultures at the beginning of the cultivation period. Concentrations of 4 and 8 mM of sunset yellow induced significant increase in frequencies of cells with chromosome aberrations. Tested concentrations of sunset yellow significantly associated with frequencies of structural aberrations, chromatid-type aberrations, total aberrant cells and micronuclei showing considerable dose dependent clastogenic activity. In higher analyzed concentrations, curcumin significantly increased only nuclear buds frequency, suggesting its potential genotoxicity, while sunset yellow showed dose-dependent genotoxic potential. Obtained results point toward favorization of natural coloring agents in food consumption and emphasize the need of controlled use of food colorants.
URL: https://pubmed.ncbi.nlm.nih.gov/29506635/

=== PMID 25553699 ===
2015Jan
Genotoxic and cytotoxic effects of Sunset Yellow and Brilliant Blue, colorant food additives, on human blood lymphocytes.

thinking
**Planning targeted PubMed queries**
exec
/bin/bash -lc "set -euo pipefail
q='\"sunset yellow\"[Title/Abstract] AND (review[Publication Type] OR review[Title])'
ids="'$(curl -sS --get '"'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi' --data-urlencode db=pubmed --data-urlencode term=\""'$q" --data-urlencode retmax=20 --data-urlencode sort=pub+date --data-urlencode retmode=json | jq -r '"'.esearchresult.idlist[]')
echo \""'$ids"
for p in $ids; do
  echo "--- $p"
  curl -sS "https://pubmed.ncbi.nlm.nih.gov/$p/" | rg -n '"'<title>|citation_title|citation_date|citation_journal_title' | head -n 4
 done" in /home/exedev/chewber succeeded in 8.12s:
41098421
39882004
39281285
39260596
39058118
37690141
37429408
34454997
30663318
28407952
28128086
26404013
26304415
24701953
11020839
8877241
1554423
6339890
--- 41098421
47:    <title>Nanocomposites for Water Treatment, Photocatalysis, and Challenges: A Systematic Review - PubMed</title>

thinking
**Planning abstract extraction**
exec
/bin/bash -lc 'set -euo pipefail
for p in 39260596 39058118 37429408 30280050 30208729 29506635 25553699 17825405; do
  echo "=== PMID $p ==="
  title=$(curl -sS "https://pubmed.ncbi.nlm.nih.gov/$p/" | rg -o '"'citation_title\" content=\"["'^"]+'"' | head -n1 | sed 's/citation_title\" content=\"//')
  date="'$(curl -sS "https://pubmed.ncbi.nlm.nih.gov/$p/" | rg -o '"'citation_date\" content=\"["'^"]+'"' | head -n1 | sed 's/citation_date\" content=\"//')
  journal="'$(curl -sS "https://pubmed.ncbi.nlm.nih.gov/$p/" | rg -o '"'citation_journal_title\" content=\"["'^"]+'"' | head -n1 | sed 's/citation_journal_title\" content=\"//')
  echo \"Title: "'$title"
  echo "Date: $date | Journal: $journal"
  abs=$(curl -sS "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=$p&retmode=xml" | tr -d '"'\\n' | sed 's/<AbstractText /\\n<AbstractText /g' | sed 's#</AbstractText>#</AbstractText>\\n#g' | rg -o '<AbstractText["'^>]*>.*</AbstractText>'"' | sed -E 's/<["'^>]+>//g'"' | tr '\\n' ' ' | head -c 650)
  echo \"Abstract: "'$abs"
  echo "URL: https://pubmed.ncbi.nlm.nih.gov/$p/"
  echo
done' in /home/exedev/chewber succeeded in 13.47s:
Title: Biochemical processes mediating neurotoxicity induced by synthetic food dyes: A review of current evidence
Date: 2024 Sep | Journal: Chemosphere
Abstract: The extensive use of synthetic food dyes in the food industry, primarily due to their durability and cost-effectiveness compared to natural colorants, has raised significant health concerns. Of particular concern are the potential neurotoxic effects of six commonly used synthetic food dyes: Tartrazine (E102/FD&amp;C Yellow No. 5), Erythrosine (E127/FD&amp;C Red No. 3), Brilliant Blue FCF (E133/FD&amp;C Blue No. 1), Allura Red AC (E129/FD&amp;C Red No. 40), Sunset Yellow FCF (E110/FD&amp;C Yellow No. 6), and Indigo Carmine (E132/FD&amp;C Blue No. 2). This review delves into the metabolic pathways and neurotoxicity mechanisms of each dye, highl
URL: https://pubmed.ncbi.nlm.nih.gov/39260596/

=== PMID 39058118 ===
Title: Food Safety and Health Concerns of Synthetic Food Colors: An Update
Date: 06/27/2024 | Journal: Toxics
Abstract: The toxicity of food additives is widely studied and concerns many consumers worldwide. Synthetic food colors are often considered an unnecessary risk to consumer health. Since the European Food Safety Authority's (EFSA) re-evaluation between 2009 and 2014, the body of scientific literature on food colors has grown, and new evaluations are being published by the Joint FAO/WHO Expert Committee on Food Additives (JECFA). Therefore, this narrative review aims to review the toxicological data that have become available since 2014. The reviewed colors are Quinoline Yellow, Sunset Yellow, Azorubine, Amaranth, Ponceau 4R, Erythrosine, Allura Red, Pa
URL: https://pubmed.ncbi.nlm.nih.gov/39058118/

=== PMID 37429408 ===
Title: Azo dyes in the food industry: Features, classification, toxicity, alternatives, and regulation
Date: 2023 Aug | Journal: Food and chemical toxicology : an international journal published for the British Industrial Biological Research Association
Abstract: Azo dyes, including Tartrazine, Sunset Yellow, and Carmoisine, are added to foods to provide color, but they have no value with regard to nutrition, food preservation, or health benefits. Because of their availability, affordability, stability, and low cost, and because they provide intense coloration to the product without contributing unwanted flavors, the food industry often prefers to use synthetic azo dyes rather than natural colorants. Food dyes have been tested by regulatory agencies responsible for guaranteeing consumer safety. Nevertheless, the safety of these colorants remains controversial; they have been associated with adverse ef
URL: https://pubmed.ncbi.nlm.nih.gov/37429408/

=== PMID 30280050 ===
Title: Sunset Yellow and Allura Red modulate Bcl2 and COX2 expression levels and confer oxidative stress-mediated renal and hepatic toxicity in male rats
Date: 09/28/2018 | Journal: PeerJ


thinking
**Synthesizing regulatory and exposure details**
thinking
**Checking food additive definitions**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
rg -n '"'does not include color additives|exclude color additive|food additive means' \""'$TMP" | head -n 40' in /home/exedev/chewber succeeded in 1.21s:


thinking
**Refining search terms**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
rg -n '"'color additive|color additives|GRAS|generally recognized as safe' \""'$TMP" | head -n 80' in /home/exedev/chewber succeeded in 1.17s:
1906:<P>(a) In addition to the regulations in this subpart, you must comply with all other applicable statutory provisions and regulations related to the establishment and maintenance of records for foods except as described in paragraph (b) of this section. For example, the regulations in this subpart are in addition to existing recordkeeping regulations for low acid canned foods, juice, seafood, infant formula, color additives, bottled water, animal feed, and medicated animal feed.
2700:<P>(ii) Chemical hazards, including radiological hazards, pesticide and drug residues, natural toxins, decomposition, unapproved food or color additives, food allergens, and (in animal food) nutrient deficiencies or toxicities; and
8355:<FP1-2>Division of Biotechnology and GRAS Notice Review.
10772:<P>(d) A guaranty or undertaking referred to in section 303(c)(3) of the act shall state that the shipment or other delivery of the color additive covered thereby was manufactured by a signer thereof. It may be a part of or attached to the invoice or bill of sale covering such color. If such shipment or delivery is from a foreign manufacturer, such guaranty or undertaking shall be signed by such manufacturer and by an agent of such manufacturer who resides in the United States.
10779:<P>(Name of manufacturer) hereby guarantees that all color additives listed herein were manufactured by him, and (where color additive regulations require certification) are from batches certified in accordance with the applicable regulations promulgated under the Federal Food, Drug, and Cosmetic Act.
10785:<P>(Name of manufacturer and agent) hereby severally guarantee that all color additives listed herein were manufactured by (name of manufacturer), and (where color additive regulations require certification) are from batches certified in accordance with the applicable regulations promulgated under the Federal Food, Drug, and Cosmetic Act.
10790:<P>(f) For the purpose of a guaranty or undertaking under section 303(c)(3) of the act the manufacturer of a shipment or other delivery of a color additive is the person who packaged such color.
11388:<P>(1) In the form specified in other applicable FDA regulations, <I>e.g.,</I> the form for a color additive petition in § 71.1, for a food additive petition in § 171.1 or § 571.1, for a new drug application in § 314.50, for a request to establish or amend an import tolerance in § 510.205, for a new animal drug application in § 514.1, or
11795:<P>(2) Food additive and color additive petitions, which are subject to the provisions of § 12.20(b)(2).
11949:<P>(13) Section 721 (b) and (c) on regulations for color additive listing and certification.
12175:<P>(g) A draft of a final food additive color additive, or new animal drug regulation may be furnished to the petitioner for comment on the technical accuracy of the regulation. Every meeting with a petitioner relating to the draft will be recorded in a written memorandum, and all memoranda and correspondence will be filed with the Dockets Management Staff as part of the administrative record of the regulation under the provisions of § 10.65.
13010:<P>(i) In the form specified elsewhere in this chapter, e.g., the form for a color additive petition in § 71.1; or
13018:<P>(2) If it involves a color additive or food additive, and meets the requirements for filing in §§ 71.1 and 71.2, or in §§ 171.1, 171.6, 171.7, and 171.100, publish a notice of filing of the petition within 30 days after the petition is filed instead of a notice of proposed rulemaking.
13024:<P>(e) On or before the 30th day after the date of publication of a final regulation, or of a notice withdrawing a proposal initiated by a petition under § 10.25(a), a person may submit to the Commissioner written objections and a request for a hearing. The 30-day period may not be extended except that additional information supporting an objection may be received after 30 days upon a showing of inadvertent omission and hardship, and if review of the objection and request for hearing will not thereby be impeded. If, after a final color additive regulation is published, a petition or proposal relating to the regulation is referred to an advisory committee in accordance with section 721(b)(5)(C) of the act, objections and requests for a hearing may be submitted on or before the 30th day after the date on which the order confirming or modifying the Commissioner's previous order is published.
13166:<P>(iii) If the proceeding involves a color additive regulation referred to an advisory committee in accordance with section 721(b)(5)(C) of the act, the committee's report and the record of the committee's proceeding; and
13600:<P>(1) In a hearing, the issues may have general applicability and depend on general facts that do not concern particular action of a specific party, e.g., the safety or effectiveness of a class of drug products, the safety of a food or color additive, or a definition and standard of identity for a food; or the issues may have specific applicability to past action and depend upon particular facts concerning only that party, e.g., the applicability of a grandfather clause to a particular brand of a drug or the failure of a particular manufacturer to meet required manufacturing and processing specifications or other general standards.
13610:<P>(d) At a hearing involving issuing, amending, or revoking a regulation or order relating to the safety or effectiveness of a drug, device, food additive, or color additive, the participant who is contending that the product is safe or effective or both and who is requesting approval or contesting withdrawal of approval has the burden of proof in establishing safety or effectiveness or both and thus the right to approval. The burden of proof remains on that participant in an amendment or revocation proceeding.
14284:<P>(ii) Section 14.140 on review of the safety of color additives;
14718:<P>(d) Color additive advisory committees are required to be established under the circumstances specified in sections 721(b)(5)(C) and (D) of the FD&amp;C Act (21 U.S.C. 379e(b)(5)(C) and (D)). A color additive advisory committee is subject to the termination and renewal requirements of the Federal Advisory Committee Act and of this part.
15313:<HEAD>§ 14.140   Establishment of a color additive advisory committee.</HEAD>


thinking
**Extracting section around 170.3**
thinking
**Adjusting heading search pattern**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
rg -n '"'170\\.3|Part 170|Food additives|Definitions' \""'$TMP" | head -n 60' in /home/exedev/chewber succeeded in 1.40s:
55:<HEAD>§ 1.3   Definitions.</HEAD>
282:<HEAD>§ 1.71   Definitions.</HEAD>
517:<HEAD>§ 1.83   Definitions.</HEAD>
7467:<HEAD>§ 3.2   Definitions.</HEAD>
10697:<HEAD>§ 7.3   Definitions.</HEAD>
11195:<HEAD>§ 10.3   Definitions.</HEAD>
12634:<HEAD>§ 10.203   Definitions.</HEAD>
12792:<HEAD>§ 11.3   Definitions.</HEAD>
16141:<HEAD>§ 17.3   Definitions.</HEAD>
18504:<HEAD>§ 21.3   Definitions.</HEAD>
19180:<P>(a) Definitions that apply to the terms used in this part are set forth in the CEQ regulations under 40 CFR part 1508. The terms and the sections of 40 CFR part 1508 in which they are defined follow:
19348:<P>(i) Approval of food additive petitions and color additive petitions, approval of requests for exemptions for investigational use of food additives, the granting of requests for exemption from regulation as a food additive under § 170.39 of this chapter, and allowing notifications submitted under 21 U.S.C. 348(h) to become effective, unless categorically excluded in § 25.32(b), (c), (i), (j), (k), (l), (o), (q), or (r).
19352:<P>(k) Establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, or establishment or amendment of a regulation for a prior-sanctioned food ingredient, as defined in §§ 170.3(l) and 181.5(a) of this chapter, unless categorically excluded in § 25.32(f), (i), (j), (k), or (r).
19497:<P>(f) Establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, and establishment or amendment of a regulation for a prior-sanctioned food ingredient, as defined in §§ 170.3(l) and 181.5(a) of this chapter, if the substance or food ingredient is already marketed in the United States for the proposed use.
19503:<P>(i) Approval of a food additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, the granting of a request for exemption from regulation as a food additive under § 170.39 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective, when the substance is present in finished food-packaging material at not greater than 5 percent-by-weight and is expected to remain with finished food-packaging material through use by consumers or when the substance is a component of a coating of a finished food-packaging material.
19505:<P>(j) Approval of a food additive petition, establishment or amendment of a regulation for a food substance as GRAS under the conditions of its intended use for humans or animals under parts 182, 184, 186, 582, or 584 of this chapter, the granting of a request for exemption from regulation as a food additive under § 170.39 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective, when the substance is to be used as a component of a food-contact surface of permanent or semipermanent equipment or of another food-contact article intended for repeated use.
19519:<P>(q) Approval of a food additive petition, the granting of a request for exemption from regulation as a food additive under § 170.39 of this chapter, or allowing a notification submitted under 21 U.S.C. 348(h) to become effective for a substance registered by the Environmental Protection Agency under FIFRA for the same use requested in the petition, request for exemption, or notification.
19852:<HEAD>§ 26.1   Definitions.</HEAD>
24230:<HEAD>§ 26.60   Definitions.</HEAD>
24609:<HEAD>§ 50.3   Definitions.</HEAD>

thinking
**Extracting color additives definition**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
sed -n '"'26970,27120p' \""'$TMP"' in /home/exedev/chewber succeeded in 1.16s:
</PSPACE></AUTH>
<SOURCE>
<HED>Source:</HED><PSPACE>42 FR 15636, Mar. 22, 1977, unless otherwise noted.


</PSPACE></SOURCE>

<DIV6 N="A" TYPE="SUBPART">
<HEAD>Subpart A—General Provisions</HEAD>


<DIV8 N="70.3" TYPE="SECTION" VOLUME="1">
<HEAD>§ 70.3   Definitions.</HEAD>
<P>(a) <I>Secretary</I> means the Secretary of Health and Human Services.
</P>
<P>(b) <I>Department</I> means the Department of Health and Human Services.
</P>
<P>(c) <I>Commissioner</I> means the Commissioner of Food and Drugs.
</P>
<P>(d) <I>Act</I> means the Federal Food, Drug, and Cosmetic Act as amended.

thinking
**Confirming GRAS status classification**
exec
/bin/bash -lc 'TMP=$(mktemp)
curl -sS '"'https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml' -o \""'$TMP"
# show where Yellow No.6 appears
rg -n '"'Yellow No\\. 6|74\\.706|182\\.|184\\.|186\\.' \""'$TMP" | head -n 80' in /home/exedev/chewber succeeded in 1.27s:
28479:<P>(a) <I>Identity.</I> The color additive ferrous lactate is the ferrous lactate defined in § 184.1311 of this chapter.
31958:<DIV8 N="74.706" TYPE="SECTION" VOLUME="1">
31959:<HEAD>§ 74.706   FD&amp;C Yellow No. 6.</HEAD>
31960:<P>(a) <I>Identity.</I> (1) The color additive FD&amp;C Yellow No. 6 is principally the disodium salt of 6-hydroxy-5-[(4-sulfophenyl)azo]-2-naphthalenesulfonic acid (CAS Reg. No. 2783-94-0). The trisodium salt of 3-hydroxy-4-[(4-sulfophenyl)azo]-2,7-naphthalenedisulfonic acid (CAS Reg. No. 50880-65-4) may be added in small amounts. The color additive is manufactured by diazotizing 4-aminobenzenesulfonic acid using hydrochloric acid and sodium nitrite or sulfuric acid and sodium nitrite. The diazo compound is coupled with 6-hydroxy-2-naphthalene-sulfonic acid. The dye is isolated as the sodium salt and dried. The trisodium salt of 3-hydroxy-4-[(4-sulfophenyl)azo]-2,7-naphthalenedisulfonic acid which may be blended with the principal color is prepared in the same manner except the diazo benzenesulfonic acid is coupled with 3-hydroxy-2,7-naphthalenedisulfonic acid.
31962:<P>(2) Color additive mixtures for food use made with FD&amp;C Yellow No. 6 may contain only those diluents that are suitable and that are listed in part 73 of this chapter as safe for use in color additive mixtures for coloring foods.
31964:<P>(b) <I>Specifications.</I> The color additive FD&amp;C Yellow No. 6 shall conform to the following specifications and shall be free from impurities other than those named to the extent that such other impurities may be avoided by current good manufacturing practice:
32004:<P>(c) <I>Uses and restrictions.</I> The color additive FD&amp;C Yellow No. 6 may be safely used for coloring foods (including dietary supplements) generally in amounts consistent with current good manufacturing practice, except that it may not be used to color foods for which standards of identity have been promulgated under section 401 of the act unless added color is authorized by such standards.
32010:<P>(e) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
33200:<HEAD>§ 74.1706   FD&amp;C Yellow No. 6.</HEAD>
33201:<P>(a) <I>Identity and specifications.</I> (1) The color additive FD&amp;C Yellow No. 6 shall conform in identity and specifications to the requirements of § 74.706(a)(1) and (b).
33203:<P>(2) Color additive mixtures for drug use made with FD&amp;C Yellow No. 6 may contain only those diluents that are suitable and that are listed in part 73 of this chapter as safe for use in color additive mixtures for coloring drugs.
33205:<P>(b) <I>Uses and restrictions.</I> FD&amp;C Yellow No. 6 may be safely used for coloring drugs generally in amounts consistent with current good manufacturing practice.
33211:<P>(d) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
34072:<HEAD>§ 74.2706   FD&amp;C Yellow No. 6.</HEAD>
34073:<P>(a) <I>Identity and specifications.</I> The color additive FD&amp;C Yellow No. 6 shall conform in identity and specifications to the requirements of § 74.706 (a)(1) and (b).
34075:<P>(b) <I>Uses and restrictions.</I> FD&amp;C Yellow No. 6 may be safely used for coloring cosmetics generally in amounts consistent with current good manufacturing practice.
34079:<P>(d) <I>Certification.</I> All batches of FD&amp;C Yellow No. 6 shall be certified in accordance with regulations in part 80 of this chapter.
35225:<FP-1>Ext. D&amp;C Yellow No. 6.
35531:<HEAD>§ 82.706   FD&amp;C Yellow No. 6.</HEAD>
35532:<P>(a) The color additive FD&amp;C Yellow No. 6 shall conform in identity and specifications to the requirements of § 74.706 (a)(1) and (b) of this chapter.











thinking
**Confirming absence of listing in GRAS parts**
thinking
**Identifying accessible PDF source**
thinking
**Searching for latest evaluation PDF**
thinking
**Confirming PDF accessibility**
thinking
**Planning data extraction from PDF**
thinking
**Searching for evaluation date**
thinking
**Reconsidering text search method**
thinking
**Planning extraction of publication details**
thinking
**Checking match failure causes**
thinking
**Confirming ADI finality**
thinking
**Consolidating comprehensive additive data**
codex
I’ve gathered the core evidence from EFSA PDFs, eCFR API text, WHO/JECFA chemical records, IARC’s classified-agents list, and PubMed entries. Next I’ll write the report and JSON with explicit source URLs, then run `jq` validation.
exec
/bin/bash -lc 'set -euo pipefail
mkdir -p /home/exedev/chewber/research/additives/E110
date -Iseconds' in /home/exedev/chewber succeeded in 51ms:
2026-02-27T02:44:36+00:00

thinking
**Composing detailed report and JSON**
codex
I’m writing both output files now with citations keyed to the exact URLs I accessed, then I’ll run `jq` on the JSON to verify it parses cleanly.
exec
/bin/bash -lc "cat > /home/exedev/chewber/research/additives/E110/E110-report.md <<'EOF'
# E110 (Sunset Yellow FCF) Research Report

## Identity
- **E-number:** E110 (INS 110). [S5]
- **Primary names:** Sunset Yellow FCF; FD&C Yellow No. 6 (US name). [S3][S5]
- **CAS numbers:** 2783-94-0 (principal disodium salt), 50880-65-4 (trisodium component allowed in small amounts). [S3][S5]
- **Chemical class:** Synthetic **azo** food colorant (contains azo linkage in the named structure). [S3][S5]
- **Synonyms:** CI Food Yellow 3, Orange Yellow S, CI (1975) No. 15985. [S5]
- **Origin:** **Synthetic** (manufactured by diazotization/coupling process described in CFR). [S3]

## Function in Food
- **Primary technological function:** Coloring agent (functional class: COLOUR). [S5]
- **Mechanism of action in foods:** Provides yellow-orange color due to the azo dye chromophore in the molecule (inferred from structure and color-additive designation). [S3][S5]
- **Common food use scope:** Authorized in the US for coloring foods (including dietary supplements) generally under GMP, with identity-standard exceptions. [S3]

## Regulatory Status
### EFSA (EU)
- **Latest EFSA re-evaluation located:** 2014 reconsideration ("'`j.efsa.2014.3765`). [S1]
- **ADI:** **1 mg/kg bw/day**; EFSA states the temporary ADI from 2009 should be considered final after refined exposure assessment. [S1]
- **Key conclusion:** EFSA reported no concern at refined exposure estimates compared with the temporary ADI of 1 mg/kg bw/day. [S1]
- **Context from earlier EFSA re-evaluation (2009):** ADI of 1 mg/kg bw/day established; concern existed in some child exposure scenarios at MPL assumptions. [S2]
- **Approval status interpretation:** Approved in EU with ADI-based risk management (not withdrawn). [S1][S2]

### FDA / eCFR (US)
- **GRAS status:** No GRAS listing identified for FD&C Yellow No. 6 in Title 21 GRAS parts; instead, it is regulated as a **listed color additive subject to certification**. [S3]
- **CFR citation:** **21 CFR 74.706** (foods). Related entries also exist for drugs/cosmetics (21 CFR 74.1706, 74.2706). [S3][S4]
- **Conditions of use (foods):** May be safely used for coloring foods (including dietary supplements) in amounts consistent with current GMP; not for standardized foods unless specifically authorized; batches must be certified (part 80). [S3]

### JECFA / WHO
- **ADI:** **0-4 mg/kg bw**. [S5]
- **Latest evaluation year shown:** **2011**; comment notes withdrawal of the previous 0-2.5 mg/kg bw ADI and conclusion that dietary exposure does not present a health concern. [S5]

### IARC
- **Classification:** No listing for Sunset Yellow FCF / FD&C Yellow No. 6 found on IARC’s current “Agents Classified by the IARC Monographs” page (checked by name/synonyms/CAS text search). [S6]

### Notable bans
- No major-jurisdiction blanket ban was confirmed from the sources reviewed in this run.

## Key Safety Evidence
### Animal studies
- Rat study (2018, PeerJ) reported liver/kidney injury markers, oxidative-stress changes, histopathology, and comet-assay genotoxic signal after 4-week dosing (2.5 mg/kg bw Sunset Yellow arm). [S9]
- Female-rat combination study (2020) found dose-related genotoxic signals for Sunset Yellow + sodium benzoate combinations, strongest at high combined doses (mixture design limits attribution to Sunset Yellow alone). [S10]

### Epidemiological / human data
- RCT in children (2007, Lancet) found increased hyperactivity with mixtures of artificial colors/preservative; this supports concern for susceptible pediatric populations but does **not** isolate E110 alone. [S13]

### Mechanistic / in vitro concerns
- Human lymphocyte studies (2015, 2018) reported concentration-dependent cytotoxic/genotoxic findings (micronuclei/chromosomal effects), generally at relatively high in vitro concentrations. [S11][S12]
- Recent reviews (2024) continue to discuss potential neurotoxicity and broader toxicology concerns across synthetic dyes including Sunset Yellow, while emphasizing heterogeneity and data-quality differences. [S7][S8]

## Exposure Assessment
- EFSA 2009 indicated potential concern for children in conservative maximum-permitted-level scenarios. [S2]
- EFSA 2014 refined exposure assessment concluded no concern versus ADI 1 mg/kg bw/day. [S1]
- JECFA 2011 concluded current dietary exposure does not present a health concern with ADI 0-4 mg/kg bw. [S5]
- **Vulnerable populations:** Children/high consumers of brightly colored foods; potentially sensitive individuals when multiple additives are co-consumed. [S1][S2][S13]
- **Typical intake values:** Specific population intake numbers were not consistently extractable from accessible source text in this run.

## Risk Assessment
- **Recommended Chewber tier: `moderate`**.
- **Rationale:**
  - Regulatory approvals remain in place (EFSA/FDA/JECFA), but ADIs are explicit and relatively conservative. [S1][S3][S5]
  - EFSA history shows concern under conservative child-exposure assumptions, later reduced by refined exposure data. [S1][S2]
  - Experimental literature includes credible animal/in vitro genotoxicity and organ-toxicity signals, often at study-specific or high-dose contexts and sometimes in mixtures. [S9][S10][S11][S12]
  - Human behavioral evidence exists for additive mixtures including colors, with attribution uncertainty for E110 alone. [S13]

## Sources
- **[S1]** EFSA Journal (2014), *Reconsideration of the temporary ADI and refined exposure assessment for Sunset Yellow FCF (E 110)*. URL: https://docs.efsa.europa.eu/efsajournal/pub/3765/efsajournal-12-7-3765.pdf
- **[S2]** EFSA Journal (2009), *Scientific Opinion on the re-evaluation of Sunset Yellow FCF (E 110) as a food additive*. URL: https://docs.efsa.europa.eu/efsajournal/pub/1330/efsajournal-7-11-1330.pdf
- **[S3]** eCFR API Title 21 full text (up-to-date snapshot used), includes 21 CFR 74.706 language. URL: https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml
- **[S4]** eCFR API search results for “yellow no. 6” (section discovery/citation confirmation). URL: https://www.ecfr.gov/api/search/v1/results?query=yellow%20no.%206&per_page=5&page=1
- **[S5]** WHO/JECFA chemical entry, *SUNSET YELLOW FCF* (INS 110). URL: https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2703
- **[S6]** IARC Monographs, *Agents Classified by the IARC Monographs, Volumes 1-140*. URL: https://monographs.iarc.who.int/agents-classified-by-the-iarc/
- **[S7]** PubMed (2024), *Food Safety and Health Concerns of Synthetic Food Colors: An Update*. URL: https://pubmed.ncbi.nlm.nih.gov/39058118/
- **[S8]** PubMed (2024), *Biochemical processes mediating neurotoxicity induced by synthetic food dyes: A review of current evidence*. URL: https://pubmed.ncbi.nlm.nih.gov/39260596/
- **[S9]** PubMed (2018), *Sunset Yellow and Allura Red ... renal and hepatic toxicity in male rats*. URL: https://pubmed.ncbi.nlm.nih.gov/30280050/
- **[S10]** PubMed (2020), *In vivo genotoxicity assessment of sunset yellow and sodium benzoate in female rats*. URL: https://pubmed.ncbi.nlm.nih.gov/30208729/
- **[S11]** PubMed (2018), *Genotoxicity and cytotoxicity analysis of curcumin and sunset yellow in human lymphocyte culture*. URL: https://pubmed.ncbi.nlm.nih.gov/29506635/
- **[S12]** PubMed (2015), *Genotoxic and cytotoxic effects of Sunset Yellow and Brilliant Blue ...*. URL: https://pubmed.ncbi.nlm.nih.gov/25553699/
- **[S13]** PubMed (2007), *Food additives and hyperactive behaviour ... randomised trial*. URL: https://pubmed.ncbi.nlm.nih.gov/17825405/

## Access Notes
- EFSA journal landing pages on `efsa.europa.eu` were intermittently blocked in this environment (HTTP 403/429), so the official EFSA PDF endpoints on `docs.efsa.europa.eu` were used directly.
EOF' in /home/exedev/chewber succeeded in 50ms:


thinking
**Writing JSON output file**
exec
/bin/bash -lc "cat > /home/exedev/chewber/research/additives/E110/E110-abstraction.json <<'EOF'
{
  \"schema_version\": 1,
  \"research_metadata\": {
    \"date\": \"2026-02-27T02:44:36+00:00\",
    \"prompt_version\": \"1.0\"
  },
  \"identity\": {
    \"e_number\": \"E110\",
    \"name\": \"Sunset Yellow FCF\",
    \"cas_numbers\": [
      \"2783-94-0\",
      \"50880-65-4\"
    ],
    \"synonyms\": [
      \"FD&C Yellow No. 6\",
      \"CI Food Yellow 3\",
      \"Orange Yellow S\",
      \"CI (1975) No. 15985\"
    ],
    \"chemical_class\": \"synthetic azo dye (food colorant)\",
    \"origin\": \"synthetic\"
  },
  \"function\": {
    \"primary_category\": \"food color additive\",
    \"secondary_categories\": [
      \"colour\",
      \"certified color additive\"
    ],
    \"mechanism\": \"Imparts yellow-orange color via azo chromophore absorbance in the visible spectrum (inference from azo structure and regulatory color-additive classification).\",
    \"common_food_categories\": [
      \"foods generally\",
      \"dietary supplements\"
    ]
  },
  \"regulatory\": {
    \"efsa\": {
      \"status\": \"approved\",
      \"adi\": {
        \"value\": 1,
        \"unit\": \"mg/kg bw/day\",
        \"basis\": \"EFSA 2014 reconsideration concluded refined exposure was of no concern and that the temporary ADI of 1 mg/kg bw/day should be considered final.\"
      },
      \"last_evaluation_year\": 2014,
      \"key_finding\": \"No concern at refined exposure estimates versus ADI; 2009 EFSA had identified potential concern for children under conservative MPL exposure assumptions.\"
    },
    \"fda\": {
      \"status\": \"approved\",
      \"cfr_citation\": \"21 CFR 74.706\",
      \"notes\": \"Listed as FD&C Yellow No. 6, subject to batch certification (part 80), permitted for foods including dietary supplements under GMP, with standard-of-identity limitations; no separate GRAS listing identified for this color additive in Title 21.\"
    },
    \"jecfa\": {
      \"adi\": {
        \"value\": 4,
        \"unit\": \"mg/kg bw/day\",
        \"basis\": \"WHO/JECFA database entry (2011) states ADI 0-4 mg/kg bw and withdrawal of prior 0-2.5 mg/kg bw ADI.\"
      },
      \"last_evaluation_year\": 2011
    },
    \"iarc_classification\": null,
    \"notable_bans\": []
  },
  \"safety_evidence\": {
    \"concerns\": [
      {
        \"category\": \"genotoxic\",
        \"summary\": \"In vitro human lymphocyte studies and some in vivo rodent studies report chromosomal damage/comet-assay signals, especially at higher concentrations or in combination exposures.\",
        \"evidence_strength\": \"moderate\",
        \"key_references\": [
          \"https://pubmed.ncbi.nlm.nih.gov/29506635/\",
          \"https://pubmed.ncbi.nlm.nih.gov/25553699/\",
          \"https://pubmed.ncbi.nlm.nih.gov/30208729/\"
        ]
      },
      {
        \"category\": \"renal\",
        \"summary\": \"A rat study reported oxidative-stress linked hepatic/renal toxicity markers and histopathological changes after oral exposure.\",
        \"evidence_strength\": \"moderate\",
        \"key_references\": [
          \"https://pubmed.ncbi.nlm.nih.gov/30280050/\"
        ]
      },
      {
        \"category\": \"neurotoxic\",
        \"summary\": \"Human RCT evidence shows hyperactivity effects from mixtures of artificial colors/preservative; attribution to E110 alone is uncertain.\",
        \"evidence_strength\": \"weak\",
        \"key_references\": [
          \"https://pubmed.ncbi.nlm.nih.gov/17825405/\",
          \"https://pubmed.ncbi.nlm.nih.gov/39260596/\"
        ]
      }
    ],
    \"no_concern_confirmed\": [
      \"EFSA 2014 refined exposure assessment found no concern compared with ADI 1 mg/kg bw/day.\",
      \"JECFA 2011 concluded dietary exposure to Sunset Yellow FCF does not present a health concern.\"
    ],
    \"adi_exceedance\": {
      \"at_risk\": true,
      \"populations\": [
        \"children under conservative maximum-permitted-level scenarios\",
        \"high consumers of colored foods\"
      ],
      \"notes\": \"EFSA 2009 reported concern under MPL-based scenarios in children; EFSA 2014 refined exposure assessment reduced concern.\"
    }
  },
  \"risk_assessment\": {
    \"recommended_level\": \"moderate\",
    \"confidence\": 0.76,
    \"rationale\": \"E110 remains approved by EFSA/FDA/JECFA with explicit ADIs and no IARC listing, but the evidence base includes credible experimental genotoxic/organ-toxicity signals and child-focused behavioral concern in color-additive mixtures; exposure-risk conclusions differ between conservative and refined assessments.\",
    \"key_factors\": [
      \"EFSA final ADI 1 mg/kg bw/day with refined exposure no-concern outcome\",
      \"JECFA ADI 0-4 mg/kg bw and no-health-concern conclusion\",
      \"US approval as certified color additive under 21 CFR 74.706\",
      \"Nonclinical studies with genotoxic/oxidative-stress findings\",
      \"Pediatric behavioral signal from mixed-additive trial\"
    ]
  },
  \"sources\": [
    {
      \"title\": \"EFSA Journal (2014): Reconsideration of the temporary ADI and refined exposure assessment for Sunset Yellow FCF (E 110)\",
      \"url\": \"https://docs.efsa.europa.eu/efsajournal/pub/3765/efsajournal-12-7-3765.pdf\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"EFSA Journal (2009): Scientific Opinion on the re-evaluation of Sunset Yellow FCF (E 110) as a food additive\",
      \"url\": \"https://docs.efsa.europa.eu/efsajournal/pub/1330/efsajournal-7-11-1330.pdf\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"eCFR API Title 21 full text snapshot (includes 21 CFR 74.706 FD&C Yellow No. 6)\",
      \"url\": \"https://www.ecfr.gov/api/versioner/v1/full/2026-02-25/title-21.xml\",
      \"type\": \"regulatory\"
    },
    {
      \"title\": \"eCFR API search results for yellow no. 6\",
      \"url\": \"https://www.ecfr.gov/api/search/v1/results?query=yellow%20no.%206&per_page=5&page=1\",
      \"type\": \"database\"
    },
    {
      \"title\": \"WHO/JECFA database: SUNSET YELLOW FCF (Chemical 2703)\",
      \"url\": \"https://apps.who.int/food-additives-contaminants-jecfa-database/Home/Chemical/2703\",
      \"type\": \"database\"
    },
    {
      \"title\": \"IARC Monographs: Agents Classified by the IARC Monographs, Volumes 1-140\",
      \"url\": \"https://monographs.iarc.who.int/agents-classified-by-the-iarc/\",
      \"type\": \"database\"
    },
    {
      \"title\": \"Food Safety and Health Concerns of Synthetic Food Colors: An Update\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/39058118/\",
      \"type\": \"review\"
    },
    {
      \"title\": \"Biochemical processes mediating neurotoxicity induced by synthetic food dyes: A review of current evidence\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/39260596/\",
      \"type\": \"review\"
    },
    {
      \"title\": \"Sunset Yellow and Allura Red modulate Bcl2 and COX2 expression levels and confer oxidative stress-mediated renal and hepatic toxicity in male rats\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/30280050/\",
      \"type\": \"study\"
    },
    {
      \"title\": \"In vivo genotoxicity assessment of sunset yellow and sodium benzoate in female rats\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/30208729/\",
      \"type\": \"study\"
    },
    {
      \"title\": \"Genotoxicity and cytotoxicity analysis of curcumin and sunset yellow in human lymphocyte culture\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/29506635/\",
      \"type\": \"study\"
    },
    {
      \"title\": \"Genotoxic and cytotoxic effects of Sunset Yellow and Brilliant Blue, colorant food additives, on human blood lymphocytes\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/25553699/\",
      \"type\": \"study\"
    },
    {
      \"title\": \"Food additives and hyperactive behaviour in 3-year-old and 8/9-year-old children in the community: a randomised, double-blinded, placebo-controlled trial\",
      \"url\": \"https://pubmed.ncbi.nlm.nih.gov/17825405/\",
      \"type\": \"study\"
    }
  ]
}
EOF
jq . /home/exedev/chewber/research/additives/E110/E110-abstraction.json > /tmp/e110-jq-check.json
" in /home/exedev/chewber succeeded in 51ms:


thinking
**Planning ASCII compliance check**
codex
Both files are written and JSON validated with `jq`; I’m doing a quick pass for formatting/encoding consistency and then I’ll summarize completion.
exec
/bin/bash -lc 'set -euo pipefail
for f in /home/exedev/chewber/research/additives/E110/E110-report.md /home/exedev/chewber/research/additives/E110/E110-abstraction.json; do
  echo "== $f"
  if LC_ALL=C rg -n "[''^'"\\x00-\\x7F]\" \""'$f"; then :; else echo "ASCII-only"; fi
done' in /home/exedev/chewber succeeded in 51ms:
== /home/exedev/chewber/research/additives/E110/E110-report.md
34:- **Classification:** No listing for Sunset Yellow FCF / FD&C Yellow No. 6 found on IARC’s current “Agents Classified by the IARC Monographs” page (checked by name/synonyms/CAS text search). [S6]
70:- **[S4]** eCFR API search results for “yellow no. 6” (section discovery/citation confirmation). URL: https://www.ecfr.gov/api/search/v1/results?query=yellow%20no.%206&per_page=5&page=1
== /home/exedev/chewber/research/additives/E110/E110-abstraction.json
ASCII-only

thinking
**Patching curly quotes with sed**
exec
/bin/bash -lc "set -euo pipefail
perl -i -pe \"s/’/'/g; s/“/\\\"/g; s/”/\\\"/g\" /home/exedev/chewber/research/additives/E110/E110-report.md
LC_ALL=C rg -n \"["'^'"\\x00-\\x7F]\" /home/exedev/chewber/research/additives/E110/E110-report.md || true" in /home/exedev/chewber succeeded in 51ms:


thinking
**Verifying file existence with wc**
exec
/bin/bash -lc "set -euo pipefail
ls -l /home/exedev/chewber/research/additives/E110/
# re-validate JSON
jq . /home/exedev/chewber/research/additives/E110/E110-abstraction.json >/dev/null
echo 'jq validation: OK'" in /home/exedev/chewber succeeded in 51ms:
total 16
-rw-r--r-- 1 exedev exedev 7661 Feb 27 02:45 E110-abstraction.json
-rw-r--r-- 1 exedev exedev 7698 Feb 27 02:45 E110-report.md
jq validation: OK

thinking
**Providing concise final summary with file references**
codex
Completed. I performed web + shell research and wrote both outputs:

- [E110-report.md](/home/exedev/chewber/research/additives/E110/E110-report.md)
- [E110-abstraction.json](/home/exedev/chewber/research/additives/E110/E110-abstraction.json)

`jq` validation passed:
- `jq . /home/exedev/chewber/research/additives/E110/E110-abstraction.json` -> OK

Brief data summary captured in the files:
- EFSA: latest re-evaluation/reconsideration found (2014), ADI `1 mg/kg bw/day`, refined exposure “no concern,” temporary ADI considered final.
- FDA/eCFR: FD&C Yellow No. 6 listed under `21 CFR 74.706`, approved as a certified color additive with GMP/use restrictions (not GRAS-listed in GRAS parts).
- JECFA/WHO: ADI `0-4 mg/kg bw`, last evaluation year `2011`.
- IARC: no listing found on the IARC classified agents page.
- PubMed: included recent review evidence plus key animal/in vitro/human-behavior studies relevant to safety.
tokens used
207,684
Completed. I performed web + shell research and wrote both outputs:

- [E110-report.md](/home/exedev/chewber/research/additives/E110/E110-report.md)
- [E110-abstraction.json](/home/exedev/chewber/research/additives/E110/E110-abstraction.json)

`jq` validation passed:
- `jq . /home/exedev/chewber/research/additives/E110/E110-abstraction.json` -> OK

Brief data summary captured in the files:
- EFSA: latest re-evaluation/reconsideration found (2014), ADI `1 mg/kg bw/day`, refined exposure “no concern,” temporary ADI considered final.
- FDA/eCFR: FD&C Yellow No. 6 listed under `21 CFR 74.706`, approved as a certified color additive with GMP/use restrictions (not GRAS-listed in GRAS parts).
- JECFA/WHO: ADI `0-4 mg/kg bw`, last evaluation year `2011`.
- IARC: no listing found on the IARC classified agents page.
- PubMed: included recent review evidence plus key animal/in vitro/human-behavior studies relevant to safety.
__FILES_WRITTEN__
