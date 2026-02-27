#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# research-all-additives.sh — Run research for every additive in the DB
#
# Usage:
#   scripts/research-all-additives.sh [--dry-run] [--skip-existing] [--backend codex]
#
# Reads additive_risks from data/usda.sqlite and runs research-additive.sh
# for each one, sequentially (one at a time to respect rate limits).
###############################################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESEARCH_SCRIPT="$SCRIPT_DIR/research-additive.sh"
DB="$REPO_ROOT/data/usda.sqlite"

BACKEND="codex"
DRY_RUN=false
SKIP_EXISTING=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)       DRY_RUN=true;       shift ;;
    --skip-existing) SKIP_EXISTING=true; shift ;;
    --backend)       BACKEND="$2";       shift 2 ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--skip-existing] [--backend codex|shelley|claude]"
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
echo "=== Research all additives ($TOTAL total) via $BACKEND ==="
echo ""

DONE=0
SKIPPED=0
FAILED=0

for row in "${ROWS[@]}"; do
  CODE="${row%%|*}"
  NAME="${row#*|}"
  OUTDIR="research/additives/$CODE"
  ABS_OUTDIR="$REPO_ROOT/$OUTDIR"

  # Skip if output already exists
  if $SKIP_EXISTING; then
    if [[ -f "$ABS_OUTDIR/${CODE}-report.md" && -f "$ABS_OUTDIR/${CODE}-abstraction.json" ]]; then
      echo "SKIP $CODE ($NAME) — already exists"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  if $DRY_RUN; then
    echo "DRY-RUN: $RESEARCH_SCRIPT --code $CODE --name \"$NAME\" --output-dir $OUTDIR --backend $BACKEND"
    continue
  fi

  echo ""
  echo "━━━ [$((DONE + SKIPPED + FAILED + 1))/$TOTAL] $CODE — $NAME ━━━"

  if bash "$RESEARCH_SCRIPT" \
    --code "$CODE" \
    --name "$NAME" \
    --output-dir "$OUTDIR" \
    --backend "$BACKEND"; then
    DONE=$((DONE + 1))
    echo "✓ $CODE done"
  else
    FAILED=$((FAILED + 1))
    echo "✗ $CODE FAILED"
  fi
done

echo ""
echo "=== Complete ==="
echo "  Done:    $DONE"
echo "  Skipped: $SKIPPED"
echo "  Failed:  $FAILED"
echo "  Total:   $TOTAL"
