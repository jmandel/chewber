#!/usr/bin/env bash
set -uo pipefail
# NOTE: no -e — individual step failures are handled explicitly

###############################################################################
# research-additive.sh — Send a research prompt to an LLM backend and split
#                         the response into a markdown report + JSON abstraction
###############################################################################

# ── Repo root (so we can resolve relative paths & pass -cwd to shelley) ──────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# ── Ensure ALL child processes (codex, shelley, etc.) die when we exit ────────
CHILD_PIDS=()

kill_tree() {
  local sig="$1" pid="$2"
  local children
  children=$(pgrep -P "$pid" 2>/dev/null) || true
  for child in $children; do
    kill_tree "$sig" "$child"
  done
  kill -"$sig" "$pid" 2>/dev/null || true
}

cleanup_children() {
  for pid in "${CHILD_PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill_tree TERM "$pid"
    fi
  done
  sleep 1
  for pid in "${CHILD_PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill_tree 9 "$pid"
    fi
  done
}
trap cleanup_children EXIT INT TERM HUP

# ── Defaults ─────────────────────────────────────────────────────────────────
CODE=""
NAME=""
FUNCTION=""
OUTPUT_DIR=""
BACKEND=""
SHELLEY_MODEL="claude-opus-4.6"

# ── Usage ────────────────────────────────────────────────────────────────────
usage() {
  cat <<'EOF'
Usage: scripts/research-additive.sh \
  --code E341 \
  --name "Calcium phosphates" \
  --function "Texturizing agent" \
  --output-dir research/additives/E341 \
  --backend codex \
  --shelley-model claude-opus-4.6

Required: --code, --output-dir, --backend
Optional: --name, --function, --shelley-model (default: claude-opus-4.6)

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
    --backend)        BACKEND="$2";        shift 2 ;;
    --shelley-model)  SHELLEY_MODEL="$2";  shift 2 ;;
    -h|--help)        usage ;;
    *)            echo "Unknown arg: $1" >&2; usage ;;
  esac
done

[[ -z "$CODE" ]]       && { echo "ERROR: --code is required" >&2; usage; }
[[ -z "$OUTPUT_DIR" ]] && { echo "ERROR: --output-dir is required" >&2; usage; }
[[ -z "$BACKEND" ]]    && { echo "ERROR: --backend is required" >&2; usage; }

case "$BACKEND" in
  shelley|codex|claude) ;;
  *) echo "ERROR: --backend must be shelley, codex, or claude (got: $BACKEND)" >&2; exit 1 ;;
esac

if [[ "$OUTPUT_DIR" != /* ]]; then
  OUTPUT_DIR="${REPO_ROOT}/${OUTPUT_DIR}"
fi

# ── Logging helper ───────────────────────────────────────────────────────────
log() { echo "[research-additive] $*" >&2; }

# ── Build the prompt (single version for all backends) ───────────────────────
#
# All backends (codex, shelley, claude) can search the web and write files.
# The prompt instructs them to: (1) gather real data, (2) write two output files.

REPORT_FILE="${OUTPUT_DIR}/${CODE}-report.md"
JSON_FILE="${OUTPUT_DIR}/${CODE}-abstraction.json"

build_prompt() {
  cat <<PROMPT_EOF
Research food additive ${CODE}${NAME:+ (${NAME})}${FUNCTION:+, used as: ${FUNCTION}}.

## STEP 1 — GATHER REAL DATA (mandatory)

You MUST use your tools (web search, browser, curl, shell) to visit authoritative
sources and extract real data. Do NOT skip this step. Do NOT rely on memory alone.

1. **EFSA**: Search for "${CODE}" or "${NAME:-}" on efsa.europa.eu to find the
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

File 1: ${REPORT_FILE}
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

File 2: ${JSON_FILE}
  A single valid JSON object (no markdown fences, no commentary) matching this schema:
  {
    "schema_version": 1,
    "research_metadata": { "date": "<ISO-8601>", "prompt_version": "2.0" },
    "identity": { "e_number": "${CODE}", "name": "...", "cas_numbers": [...], "synonyms": [...], "chemical_class": "...", "origin": "synthetic|natural|semi-synthetic" },
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
- The JSON must be valid (parseable by jq). Verify with: jq . ${JSON_FILE}
- Use null for values you genuinely could not find after searching.
- Every URL in sources should be a real URL you actually visited, not a guessed one.
- After writing both files, confirm with a brief summary.
PROMPT_EOF
}

PROMPT="$(build_prompt)"
log "Researching additive ${CODE} via ${BACKEND}..."

# ── Backend dispatch ─────────────────────────────────────────────────────────
#
# All backends receive the same prompt. The only difference is how we invoke
# the tool and pass the prompt to it.

run_shelley() {
  log "Sending prompt to shelley (model=${SHELLEY_MODEL})..."
  mkdir -p "$OUTPUT_DIR"
  rm -f "$REPORT_FILE" "$JSON_FILE"

  local chat_json cid
  chat_json=$(shelley client chat -model "$SHELLEY_MODEL" -p "$PROMPT" -cwd "$REPO_ROOT")
  cid=$(echo "$chat_json" | jq -r '.conversation_id')
  if [[ -z "$cid" || "$cid" == "null" ]]; then
    log "ERROR: Failed to get conversation_id: $chat_json"
    return 1
  fi
  log "Conversation ID: $cid — waiting for shelley to finish..."

  local shelley_rc=0
  shelley client read -wait "$cid" > /dev/null &
  local shelley_pid=$!
  CHILD_PIDS+=("$shelley_pid")
  wait "$shelley_pid" || shelley_rc=$?
  if [[ $shelley_rc -ne 0 ]]; then
    log "WARNING: shelley read exited with code $shelley_rc — checking if files were written anyway"
  fi
}

run_codex() {
  log "Sending prompt to codex (gpt-5.3-codex, reasoning=high, yolo mode)..."
  mkdir -p "$OUTPUT_DIR"
  rm -f "$REPORT_FILE" "$JSON_FILE"

  local codex_rc=0
  codex exec \
    -m gpt-5.3-codex \
    -c 'model_reasoning_effort="high"' \
    --dangerously-bypass-approvals-and-sandbox \
    -C "$REPO_ROOT" \
    "$PROMPT" 2>&1 &
  local codex_pid=$!
  CHILD_PIDS+=("$codex_pid")
  wait "$codex_pid" || codex_rc=$?
  if [[ $codex_rc -ne 0 ]]; then
    log "WARNING: codex exited with code $codex_rc — checking if files were written anyway"
  fi
}

run_claude() {
  log "Sending prompt to claude..."
  mkdir -p "$OUTPUT_DIR"
  rm -f "$REPORT_FILE" "$JSON_FILE"

  local claude_rc=0
  claude -p "$PROMPT" --output-format text 2>/dev/null &
  local claude_pid=$!
  CHILD_PIDS+=("$claude_pid")
  wait "$claude_pid" || claude_rc=$?
  if [[ $claude_rc -ne 0 ]]; then
    log "WARNING: claude exited with code $claude_rc — checking if files were written anyway"
  fi
}

# ── Run the chosen backend ───────────────────────────────────────────────────
case "$BACKEND" in
  shelley) run_shelley ;;
  codex)   run_codex   ;;
  claude)  run_claude  ;;
esac

# ── Verify output files ──────────────────────────────────────────────────────
if [[ -f "$REPORT_FILE" && -s "$REPORT_FILE" ]]; then
  log "✓ Report written: $REPORT_FILE ($(wc -c < "$REPORT_FILE") bytes)"
else
  log "ERROR: report file not created: $REPORT_FILE"
  exit 1
fi

if [[ -f "$JSON_FILE" && -s "$JSON_FILE" ]]; then
  if jq . "$JSON_FILE" > /dev/null 2>&1; then
    log "✓ JSON abstraction written and valid: $JSON_FILE"
  else
    log "WARNING: JSON file exists but is not valid JSON: $JSON_FILE"
  fi
else
  log "WARNING: JSON file not created: $JSON_FILE"
fi

log "Done. Output in ${OUTPUT_DIR}/"
exit 0
