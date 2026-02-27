#!/usr/bin/env bash
set -uo pipefail
# NOTE: no -e — we want to continue on individual job failures

###############################################################################
# research-all-additives.sh — Run research for every additive in the DB
#
# Usage:
#   scripts/research-all-additives.sh [--dry-run] [--skip-existing] [--backend codex]
#
# Reads additive_risks from data/usda.sqlite and runs research-additive.sh
# for each one. Supports --parallel N to run multiple jobs concurrently.
###############################################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESEARCH_SCRIPT="$SCRIPT_DIR/research-additive.sh"
DB="$REPO_ROOT/data/usda.sqlite"

BACKEND="codex"
DRY_RUN=false
SKIP_EXISTING=false
PARALLEL=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)       DRY_RUN=true;       shift ;;
    --skip-existing) SKIP_EXISTING=true; shift ;;
    --backend)       BACKEND="$2";       shift 2 ;;
    --parallel|-j)   PARALLEL="$2";      shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--skip-existing] [--parallel N] [--backend codex|shelley|claude]"
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -f "$DB" ]]; then
  echo "ERROR: Reference DB not found: $DB" >&2
  exit 1
fi

# Pull all additives from the DB
mapfile -t ROWS < <(sqlite3 "$DB" "SELECT code || '|' || name FROM additive_risks ORDER BY code")

TOTAL=${#ROWS[@]}
echo "=== Research all additives ($TOTAL total) via $BACKEND, parallelism $PARALLEL ==="
echo ""

# Counters (use a temp dir for parallel-safe counting)
COUNT_DIR=$(mktemp -d)
trap 'rm -rf "$COUNT_DIR"' EXIT
mkdir -p "$COUNT_DIR"/{done,skipped,failed}

run_one() {
  local row="$1" idx="$2"
  local CODE="${row%%|*}"
  local NAME="${row#*|}"
  local OUTDIR="research/additives/$CODE"
  local ABS_OUTDIR="$REPO_ROOT/$OUTDIR"

  # Skip if output already exists
  if $SKIP_EXISTING; then
    if [[ -f "$ABS_OUTDIR/${CODE}-report.md" && -f "$ABS_OUTDIR/${CODE}-abstraction.json" ]] \
       && jq . "$ABS_OUTDIR/${CODE}-abstraction.json" > /dev/null 2>&1; then
      echo "SKIP $CODE ($NAME) — already exists with valid JSON"
      touch "$COUNT_DIR/skipped/$CODE"
      return 0
    fi
  fi

  if $DRY_RUN; then
    echo "DRY-RUN: $RESEARCH_SCRIPT --code $CODE --name \"$NAME\" --output-dir $OUTDIR --backend $BACKEND"
    return 0
  fi

  echo ""
  echo "━━━ [$idx/$TOTAL] $CODE — $NAME ━━━"

  local rc=0
  bash "$RESEARCH_SCRIPT" \
    --code "$CODE" \
    --name "$NAME" \
    --output-dir "$OUTDIR" \
    --backend "$BACKEND" || rc=$?

  if [[ $rc -eq 0 ]]; then
    touch "$COUNT_DIR/done/$CODE"
    echo "✓ $CODE done"
  else
    touch "$COUNT_DIR/failed/$CODE"
    echo "✗ $CODE FAILED (exit $rc)"
    # Don't let a single failure kill the batch
  fi
}

export -f run_one
export SKIP_EXISTING DRY_RUN RESEARCH_SCRIPT REPO_ROOT BACKEND TOTAL COUNT_DIR

IDX=0
ACTIVE=0

for row in "${ROWS[@]}"; do
  IDX=$((IDX + 1))
  run_one "$row" "$IDX" &
  ACTIVE=$((ACTIVE + 1))

  if [[ $ACTIVE -ge $PARALLEL ]]; then
    wait -n 2>/dev/null || true
    ACTIVE=$((ACTIVE - 1))
  fi
done

wait

DONE=$(find "$COUNT_DIR/done" -type f 2>/dev/null | wc -l)
SKIPPED=$(find "$COUNT_DIR/skipped" -type f 2>/dev/null | wc -l)
FAILED=$(find "$COUNT_DIR/failed" -type f 2>/dev/null | wc -l)

echo ""
echo "=== Complete ==="
echo "  Done:    $DONE"
echo "  Skipped: $SKIPPED"
echo "  Failed:  $FAILED"
echo "  Total:   $TOTAL"
