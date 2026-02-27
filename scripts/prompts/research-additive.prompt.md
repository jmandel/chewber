Research food additive {{CODE}}{{NAME_CLAUSE}}{{FUNCTION_CLAUSE}}.

## STEP 1 — GATHER REAL DATA (mandatory)

You MUST use your tools (web search, browser, curl, shell) to visit authoritative
sources and extract real data. Do NOT skip this step. Do NOT rely on memory alone.

1. **EFSA**: Search for "{{CODE}}" or "{{NAME}}" on efsa.europa.eu to find the
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

File 1: {{REPORT_FILE}}
  A detailed markdown research report with these sections:
  - **Identity**: E-number, CAS number(s), chemical class, common synonyms, natural vs synthetic
  - **Function in Food**: mechanism of action, common food categories
  - **Regulatory Status**: EFSA opinion + ADI, FDA GRAS + CFR citation, JECFA ADI, IARC, notable bans
  - **Key Safety Evidence**: animal studies, epidemiological data, mechanistic concerns
  - **Exposure Assessment**: typical dietary intake, ADI exceedance risk, vulnerable populations
  - **Risk Assessment**: use the structured tier analysis described below
  - **Sources**: every claim attributed with title, year, and the actual URL you visited

  ### Risk Assessment Instructions

  Tier definitions:
    * risk_free — No credible evidence of harm, EFSA/JECFA "ADI not specified" or very high ADI, naturally occurring or identical to endogenous substances
    * limited — GRAS/approved with established ADI, no serious safety signals, minor concerns only at high doses
    * moderate — Approved but with caveats: EFSA reduced ADI, ADI exceeded in some populations (especially children), credible animal studies, or allergenicity >0.5%
    * high — Banned in major jurisdictions, IARC 2A/2B with corroborating regulatory action, EFSA unable to confirm safety, bioaccumulation with TWI exceedance, or strong mechanistic evidence of harm

  You MUST use this structure in the Risk Assessment section:
    1. **Tier-by-tier analysis**: For EACH of the four tiers (risk_free, limited, moderate, high),
       state what evidence supports placing this additive in that tier and what evidence argues against it.
    2. **Rationale**: Summarize the key factors driving the tier choice.
    3. **Recommended tier**: State the single chosen tier.

File 2: {{JSON_FILE}}
  A single valid JSON object (no markdown fences, no commentary) matching this schema:
  {
    "schema_version": 1,
    "research_metadata": { "date": "<ISO-8601>", "prompt_version": "2.0" },
    "identity": { "e_number": "{{CODE}}", "name": "...", "cas_numbers": [...], "synonyms": [...], "chemical_class": "...", "origin": "synthetic|natural|semi-synthetic" },
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
- The JSON must be valid (parseable by jq). Verify with: jq . {{JSON_FILE}}
- Use null for values you genuinely could not find after searching.
- Every URL in sources should be a real URL you actually visited, not a guessed one.
- After writing both files, confirm with a brief summary.
