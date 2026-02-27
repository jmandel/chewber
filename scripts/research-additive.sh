#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# research-additive.sh — Send a research prompt to an LLM backend and split
#                         the response into a markdown report + JSON abstraction
###############################################################################

# ── Defaults ─────────────────────────────────────────────────────────────────
CODE=""
NAME=""
FUNCTION=""
OUTPUT_DIR=""
BACKEND=""

# ── Usage ────────────────────────────────────────────────────────────────────
usage() {
  cat <<'EOF'
Usage: scripts/research-additive.sh \
  --code E341 \
  --name "Calcium phosphates" \
  --function "Texturizing agent" \
  --output-dir research/additives/E341 \
  --backend shelley

Required: --code, --output-dir, --backend
Optional: --name, --function

Backends: shelley | codex | claude
EOF
  exit 1
}

# ── Parse CLI args ───────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --code)       CODE="$2";       shift 2 ;;
    --name)       NAME="$2";       shift 2 ;;
    --function)   FUNCTION="$2";   shift 2 ;;
    --output-dir) OUTPUT_DIR="$2"; shift 2 ;;
    --backend)    BACKEND="$2";    shift 2 ;;
    -h|--help)    usage ;;
    *)            echo "Unknown arg: $1" >&2; usage ;;
  esac
done

# ── Validate required args ───────────────────────────────────────────────────
[[ -z "$CODE" ]]       && { echo "ERROR: --code is required" >&2; usage; }
[[ -z "$OUTPUT_DIR" ]] && { echo "ERROR: --output-dir is required" >&2; usage; }
[[ -z "$BACKEND" ]]    && { echo "ERROR: --backend is required" >&2; usage; }

case "$BACKEND" in
  shelley|codex|claude) ;;
  *) echo "ERROR: --backend must be shelley, codex, or claude (got: $BACKEND)" >&2; exit 1 ;;
esac

# ── Build the prompt ─────────────────────────────────────────────────────────
build_prompt() {
  local extra_context=""
  [[ -n "$NAME" ]]     && extra_context+="Common name: ${NAME}. "
  [[ -n "$FUNCTION" ]] && extra_context+="Primary function: ${FUNCTION}. "

  cat <<PROMPT_EOF
You are a food-safety research analyst. Conduct a thorough investigation of food additive ${CODE}. ${extra_context}

Use these authoritative sources (cite every factual claim):
  • EFSA scientific opinions and re-evaluations (efsa.europa.eu)
  • FDA GRAS determinations and 21 CFR regulations
  • JECFA / WHO evaluations and ADIs
  • IARC monograph classifications
  • NTP Report on Carcinogens
  • Published peer-reviewed studies

Produce TWO outputs separated by exact delimiters (described below).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — MARKDOWN RESEARCH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Write a detailed markdown report with these sections:

## Identity
E-number, CAS number(s), chemical class, common synonyms, natural vs synthetic.

## Function in Food
What it does, mechanism of action, common food categories where it appears.

## Regulatory Status
- EFSA opinion + ADI
- FDA GRAS status + CFR citation
- JECFA ADI
- IARC classification
- Notable bans or restrictions in any jurisdiction

## Key Safety Evidence
Animal studies, human epidemiological data, mechanistic concerns.

## Exposure Assessment
Typical dietary intake estimates, ADI exceedance risk, vulnerable populations.

## Risk Assessment
Recommended Chewber tier (one of: risk_free, limited, moderate, high) with detailed rationale.

Use the following tier definitions:
  • risk_free — No credible evidence of harm. EFSA/JECFA "ADI not specified" or very
    high ADI. Naturally occurring or identical to endogenous substances.
  • limited — GRAS/approved with established ADI. No serious safety signals but
    presence signals processing. Minor concerns only at high doses.
  • moderate — Approved but with caveats: EFSA reduced ADI, ADI exceeded in some
    populations (especially children), credible animal studies, or allergenicity >0.5%.
  • high — Banned in major jurisdictions, IARC 2A/2B with corroborating regulatory
    action, EFSA unable to confirm safety, bioaccumulation with TWI exceedance, or
    strong mechanistic evidence of harm.

## Sources
Every claim must be attributed to a specific source with title, year, and URL if available.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — JSON ABSTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After the markdown report, output the following exact delimiter on its own line:

---JSON_ABSTRACTION---

Then output a single valid JSON object matching this exact schema (no extra keys, no markdown fences, just raw JSON):

{
  "schema_version": 1,
  "research_metadata": {
    "date": "<ISO-8601 timestamp>",
    "prompt_version": "1.0"
  },
  "identity": {
    "e_number": "${CODE}",
    "name": "<full name>",
    "cas_numbers": ["<CAS-1>"],
    "synonyms": ["<syn1>", "<syn2>"],
    "chemical_class": "<class>",
    "origin": "<synthetic | natural | semi-synthetic>"
  },
  "function": {
    "primary_category": "<category>",
    "secondary_categories": ["<cat2>"],
    "mechanism": "<brief explanation>",
    "common_food_categories": ["<food1>", "<food2>"]
  },
  "regulatory": {
    "efsa": {
      "status": "<approved | restricted | withdrawn | not_evaluated>",
      "adi": { "value": null, "unit": "mg/kg bw/day", "basis": "<description>" },
      "last_evaluation_year": null,
      "key_finding": "<one sentence>"
    },
    "fda": {
      "status": "<gras | approved | banned | not_evaluated>",
      "cfr_citation": "<21 CFR ...>",
      "notes": null
    },
    "jecfa": {
      "adi": { "value": null, "unit": "mg/kg bw/day", "basis": "<description>" },
      "last_evaluation_year": null
    },
    "iarc_classification": "<null | Group 1 | Group 2A | Group 2B | Group 3>",
    "notable_bans": []
  },
  "safety_evidence": {
    "concerns": [
      {
        "category": "<cardiovascular | carcinogenic | genotoxic | endocrine | gut_microbiome | allergenic | neurotoxic | renal | other>",
        "summary": "<brief description>",
        "evidence_strength": "<strong | moderate | weak | theoretical>",
        "key_references": ["<Ref1>", "<Ref2>"]
      }
    ],
    "no_concern_confirmed": ["<area1>"],
    "adi_exceedance": {
      "at_risk": false,
      "populations": [],
      "notes": "<one sentence>"
    }
  },
  "risk_assessment": {
    "recommended_level": "<risk_free | limited | moderate | high>",
    "confidence": 0.0,
    "rationale": "<2-3 sentence justification>",
    "key_factors": ["<factor1>", "<factor2>"]
  },
  "sources": [
    { "title": "<source title>", "url": "<URL or null>", "type": "<regulatory | study | review | database>" }
  ]
}

Then output this closing delimiter on its own line:

---END_JSON_ABSTRACTION---

IMPORTANT:
- The JSON must be raw — no markdown code fences, no commentary.
- Fill in every field with real data from your research. Use null for genuinely unknown values.
- The markdown report comes FIRST, then the delimiter, then the JSON, then the closing delimiter.
PROMPT_EOF
}

# ── Logging helper ───────────────────────────────────────────────────────────
log() { echo "[research-additive] $*" >&2; }

# ── Assemble prompt (backend-aware) ──────────────────────────────────────────
BASE_PROMPT="$(build_prompt)"

# Shelley gets a different prompt (see run_shelley — it writes files directly).
# Other backends get the full inline-output prompt.
PROMPT="${BASE_PROMPT}"

# Write prompt to a temp file to avoid shell argument-length issues
PROMPT_FILE=$(mktemp /tmp/research-prompt-XXXXXX.txt)
trap 'rm -f "$PROMPT_FILE"' EXIT
printf '%s' "$PROMPT" > "$PROMPT_FILE"
log "Prompt written to $PROMPT_FILE ($(wc -c < "$PROMPT_FILE") bytes)"

# ── Backend dispatch ─────────────────────────────────────────────────────────
run_shelley() {
  # Strategy: Instead of parsing shelley's stdout (which leaks raw tool-call
  # tokens), we tell shelley to write the output files directly, then check
  # if the files exist after it finishes.
  log "Sending prompt to shelley (file-output strategy)..."

  mkdir -p "$OUTPUT_DIR"
  local report_file="${OUTPUT_DIR}/${CODE}-report.md"
  local json_file="${OUTPUT_DIR}/${CODE}-abstraction.json"

  # Remove any stale output so we can detect fresh creation
  rm -f "$report_file" "$json_file"

  # Build a shelley-specific prompt that instructs it to write files
  local shelley_prompt
  shelley_prompt=$(cat <<SHELLEY_EOF
Research food additive ${CODE}${NAME:+ (${NAME})}${FUNCTION:+, used as: ${FUNCTION}} and write the results to two files.

You MUST write both files using your tools (bash cat/heredoc or patch). Do NOT just print the content.

File 1: ${report_file}
  A detailed markdown research report covering:
  - Identity (E-number, CAS, chemical class, synonyms, natural vs synthetic)
  - Function in Food (mechanism, common food categories)
  - Regulatory Status (EFSA ADI, FDA GRAS, JECFA, IARC, notable bans)
  - Key Safety Evidence (animal studies, epidemiological data, mechanistic concerns)
  - Exposure Assessment (typical intake, ADI exceedance risk, vulnerable populations)
  - Risk Assessment: recommend a Chewber tier (risk_free | limited | moderate | high) with rationale
    * risk_free — No credible evidence of harm, ADI not specified or very high
    * limited — GRAS/approved with established ADI, minor concerns only at high doses
    * moderate — Approved with caveats: reduced ADI, exceedance in some populations, credible animal studies
    * high — Banned in major jurisdictions, IARC 2A/2B, EFSA unable to confirm safety, bioaccumulation
  - Sources (every claim attributed with title, year, URL)

File 2: ${json_file}
  A valid JSON object (no markdown fences) matching this schema:
  {
    "schema_version": 1,
    "identity": { "e_number": "${CODE}", "name": "...", "cas_numbers": [...], "synonyms": [...], "chemical_class": "...", "origin": "synthetic|natural|semi-synthetic" },
    "function": { "primary_category": "...", "mechanism": "...", "common_food_categories": [...] },
    "regulatory": {
      "efsa": { "status": "...", "adi": { "value": null, "unit": "mg/kg bw/day" }, "last_evaluation_year": null, "key_finding": "..." },
      "fda": { "status": "...", "cfr_citation": "...", "notes": null },
      "jecfa": { "adi": { "value": null, "unit": "mg/kg bw/day" }, "last_evaluation_year": null },
      "iarc_classification": null,
      "notable_bans": []
    },
    "safety_evidence": {
      "concerns": [{ "category": "...", "summary": "...", "evidence_strength": "strong|moderate|weak|theoretical" }],
      "adi_exceedance": { "at_risk": false, "populations": [], "notes": "..." }
    },
    "risk_assessment": { "recommended_level": "risk_free|limited|moderate|high", "confidence": 0.0, "rationale": "...", "key_factors": [...] },
    "sources": [{ "title": "...", "url": null, "type": "regulatory|study|review|database" }]
  }

IMPORTANT:
- Write BOTH files. Use bash heredocs, printf, or the patch tool.
- The JSON must be valid (parseable by jq).
- Fill every field with real data from your knowledge. Use null for genuinely unknown values.
- After writing both files, confirm with a brief summary of what you wrote.
SHELLEY_EOF
)

  local chat_json cid
  chat_json=$(shelley client chat -p "$shelley_prompt" -cwd /home/exedev/chewber)
  cid=$(echo "$chat_json" | jq -r '.conversation_id')
  if [[ -z "$cid" || "$cid" == "null" ]]; then
    log "ERROR: Failed to get conversation_id: $chat_json"
    return 1
  fi
  log "Conversation ID: $cid — waiting for shelley to write files..."

  # Wait for the conversation to finish (we don't care about the text output)
  shelley client read -wait "$cid" > /dev/null 2>&1

  # Check if files were created
  if [[ -f "$report_file" && -s "$report_file" ]]; then
    log "✓ Report written: $report_file ($(wc -c < "$report_file") bytes)"
  else
    log "ERROR: shelley did not create report file: $report_file"
    return 1
  fi

  if [[ -f "$json_file" && -s "$json_file" ]]; then
    if jq . "$json_file" > /dev/null 2>&1; then
      log "✓ JSON abstraction written and valid: $json_file"
    else
      log "WARNING: JSON file exists but is not valid JSON: $json_file"
    fi
  else
    log "WARNING: shelley did not create JSON file: $json_file"
  fi

  # Signal to the caller that files are already written (skip the split step)
  echo "__FILES_WRITTEN__"
}

run_codex() {
  log "Sending prompt to codex..."
  local prompt_text
  prompt_text=$(cat "$PROMPT_FILE")
  codex exec "$prompt_text" --full-auto 2>/dev/null
}

run_claude() {
  log "Sending prompt to claude..."
  local prompt_text
  prompt_text=$(cat "$PROMPT_FILE")
  claude -p "$prompt_text" --output-format text 2>/dev/null
}

# ── Run the chosen backend ───────────────────────────────────────────────────
log "Researching additive ${CODE} via ${BACKEND}..."
case "$BACKEND" in
  shelley) RESPONSE=$(run_shelley) ;;
  codex)   RESPONSE=$(run_codex)   ;;
  claude)  RESPONSE=$(run_claude)  ;;
esac

if [[ -z "${RESPONSE:-}" ]]; then
  log "ERROR: Empty response from ${BACKEND}"
  exit 1
fi

# ── Handle output ─────────────────────────────────────────────────────────────

# Shelley backend writes files directly — skip the text-splitting step
if [[ "$RESPONSE" == "__FILES_WRITTEN__" ]]; then
  log "Done (shelley wrote files directly). Output in ${OUTPUT_DIR}/"
  exit 0
fi

log "Got response (${#RESPONSE} chars). Splitting output..."

# ── Split response into report + JSON (codex/claude backends) ────────────────
mkdir -p "$OUTPUT_DIR"

REPORT_FILE="${OUTPUT_DIR}/${CODE}-report.md"
JSON_FILE="${OUTPUT_DIR}/${CODE}-abstraction.json"

if echo "$RESPONSE" | grep -qF -- '---JSON_ABSTRACTION---'; then
  # Split on the delimiter
  REPORT=$(echo "$RESPONSE" | awk '/^---JSON_ABSTRACTION---$/{found=1; next} !found')
  JSON_RAW=$(echo "$RESPONSE" | awk '/^---JSON_ABSTRACTION---$/{found=1; next} /^---END_JSON_ABSTRACTION---$/{found=0; next} found')

  # Write markdown report
  echo "$REPORT" > "$REPORT_FILE"
  log "Wrote report: $REPORT_FILE"

  # Validate and write JSON
  if echo "$JSON_RAW" | jq . > /dev/null 2>&1; then
    echo "$JSON_RAW" | jq . > "$JSON_FILE"
    log "Wrote JSON abstraction: $JSON_FILE"
  else
    log "WARNING: JSON abstraction failed validation, saving raw content"
    echo "$JSON_RAW" > "$JSON_FILE"
  fi
else
  log "WARNING: Response did not contain ---JSON_ABSTRACTION--- delimiter"
  log "Saving entire response as report only"
  echo "$RESPONSE" > "$REPORT_FILE"
  log "Wrote report: $REPORT_FILE"
fi

log "Done. Output in ${OUTPUT_DIR}/"
exit 0
