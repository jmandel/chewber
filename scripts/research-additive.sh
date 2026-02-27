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

REPORT_FILE="${OUTPUT_DIR}/${CODE}-report.md"
JSON_FILE="${OUTPUT_DIR}/${CODE}-abstraction.json"

# ── Load prompt template and substitute variables ───────────────────────────
PROMPT_TEMPLATE="${SCRIPT_DIR}/prompts/research-additive.prompt.md"
[[ -f "$PROMPT_TEMPLATE" ]] || { log "ERROR: prompt template not found: $PROMPT_TEMPLATE"; exit 1; }

NAME_CLAUSE=""; [[ -n "$NAME" ]]     && NAME_CLAUSE=" (${NAME})"
FUNCTION_CLAUSE=""; [[ -n "$FUNCTION" ]] && FUNCTION_CLAUSE=", used as: ${FUNCTION}"

PROMPT=$(sed \
  -e "s|{{CODE}}|${CODE}|g" \
  -e "s|{{NAME}}|${NAME:-}|g" \
  -e "s|{{NAME_CLAUSE}}|${NAME_CLAUSE}|g" \
  -e "s|{{FUNCTION_CLAUSE}}|${FUNCTION_CLAUSE}|g" \
  -e "s|{{REPORT_FILE}}|${REPORT_FILE}|g" \
  -e "s|{{JSON_FILE}}|${JSON_FILE}|g" \
  "$PROMPT_TEMPLATE")

log "Researching additive ${CODE} via ${BACKEND}..."

# ── Run backend ──────────────────────────────────────────────────────────────
mkdir -p "$OUTPUT_DIR"
rm -f "$REPORT_FILE" "$JSON_FILE"

case "$BACKEND" in
  shelley)
    chat_json=$(shelley client chat -model "$SHELLEY_MODEL" -p "$PROMPT" -cwd "$REPO_ROOT")
    cid=$(echo "$chat_json" | jq -r '.conversation_id')
    [[ -z "$cid" || "$cid" == "null" ]] && { log "ERROR: no conversation_id: $chat_json"; exit 1; }
    log "Conversation $cid — waiting..."
    shelley client read -wait "$cid" &
    CHILD_PIDS+=($!); wait $! || true
    ;;
  codex)
    codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' \
      --dangerously-bypass-approvals-and-sandbox -C "$REPO_ROOT" "$PROMPT" 2>&1 &
    CHILD_PIDS+=($!); wait $! || true
    ;;
  claude)
    claude -p "$PROMPT" --output-format text &
    CHILD_PIDS+=($!); wait $! || true
    ;;
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
