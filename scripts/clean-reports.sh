#!/usr/bin/env bash
set -uo pipefail
#
# clean-reports.sh — Strip codex stdout noise (prompt echo, thinking, tool
# calls) from report markdown files, keeping only the actual report.
#
# Idempotent: skips files that already start with "# ".
#
# Usage: scripts/clean-reports.sh [research/additives]

DIR="${1:-research/additives}"
fixed=0; skipped=0; failed=0

for d in "$DIR"/E*/; do
  code=$(basename "$d")
  f="$d/${code}-report.md"
  [[ -f "$f" ]] || continue

  # Idempotent: already clean if first line is a markdown heading
  first=$(head -1 "$f")
  if [[ "$first" == "# "* ]]; then
    ((skipped++))
    continue
  fi

  # Find the first line that looks like the report h1: "# E{CODE}..."
  start=$(grep -n "^# ${code}\b" "$f" | head -1 | cut -d: -f1)
  if [[ -z "$start" ]]; then
    # Fallback: any h1 heading
    start=$(grep -n '^# ' "$f" | tail -1 | cut -d: -f1)
  fi
  if [[ -z "$start" ]]; then
    echo "SKIP $code: no heading found" >&2
    ((failed++))
    continue
  fi

  # Strip trailing __FILES_WRITTEN__ marker and any blank lines after report
  tmp=$(mktemp)
  sed -n "${start},\$p" "$f" | sed '/^__FILES_WRITTEN__$/,$d' > "$tmp"

  # Safety: don't replace if result is tiny (< 500 bytes)
  size=$(wc -c < "$tmp")
  if [[ $size -lt 500 ]]; then
    echo "SKIP $code: extracted content too small (${size}b)" >&2
    rm -f "$tmp"
    ((failed++))
    continue
  fi

  mv "$tmp" "$f"
  echo "FIXED $code: line $start onwards (${size}b)"
  ((fixed++))
done

echo "--- Done: $fixed fixed, $skipped already clean, $failed failed ---"
