#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Build the USDA reference database (data/usda.sqlite).
#
# Downloads USDA FoodData Central CSVs, imports them into SQLite,
# builds FTS5 search index, and seeds the additive risk table.
#
# Prerequisites:
#   - bun
#   - curl, unzip
#
# Output: data/usda.sqlite (~1.2 GB)
#
# Usage:
#   ./scripts/build-usda-db.sh
# ─────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT_DIR/data"
API_DIR="$ROOT_DIR/apps/api"
OUTPUT="$DATA_DIR/usda.sqlite"

USDA_URL="https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_csv_2024-10-31.zip"
USDA_ZIP="$DATA_DIR/_usda-fdc.zip"
USDA_EXTRACT="$DATA_DIR/_usda-fdc"

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RESET="\033[0m"
info()  { echo -e "${GREEN}✓${RESET} $1"; }
warn()  { echo -e "${YELLOW}⚠${RESET} $1"; }
step()  { echo -e "\n${BOLD}── $1${RESET}"; }

# ── Preflight ────────────────────────────────────────────────
if ! command -v bun &>/dev/null; then
  echo "Error: bun not found."; exit 1
fi

mkdir -p "$DATA_DIR"

# ── Download USDA data ──────────────────────────────────────
step "Downloading USDA FoodData Central"

if [ -d "$USDA_EXTRACT" ] && [ "$(ls -A "$USDA_EXTRACT" 2>/dev/null)" ]; then
  info "Already extracted, skipping download"
else
  if [ ! -f "$USDA_ZIP" ]; then
    echo "  Source: $USDA_URL"
    echo "  This is ~300 MB."
    curl -L --progress-bar -o "$USDA_ZIP" "$USDA_URL"
    info "Download complete"
  else
    info "ZIP already downloaded"
  fi

  echo "  Extracting..."
  mkdir -p "$USDA_EXTRACT"
  unzip -o -q "$USDA_ZIP" -d "$USDA_EXTRACT"
  info "Extracted"
fi

# ── Import into SQLite ──────────────────────────────────────
step "Importing USDA data into SQLite"

rm -f "$OUTPUT" "${OUTPUT}-wal" "${OUTPUT}-shm"

cd "$API_DIR"
bun src/scripts/importUsda.ts "$USDA_EXTRACT"
info "USDA import complete"

# ── Seed additive risks ─────────────────────────────────────
step "Seeding additive risk table"

bun src/scripts/seedAdditiveRisks.ts
info "Additive risks seeded"

# ── Cleanup ──────────────────────────────────────────────────
step "Cleanup"
rm -rf "$USDA_ZIP" "$USDA_EXTRACT"
info "Removed download artifacts"

# ── Verify ───────────────────────────────────────────────────
step "Verify"

USDA_COUNT=$(sqlite3 "$OUTPUT" "SELECT COUNT(*) FROM dataset_usda_products;")
ADD_COUNT=$(sqlite3 "$OUTPUT" "SELECT COUNT(*) FROM additive_risks;")
SIZE=$(du -h "$OUTPUT" | cut -f1)

info "USDA products: $USDA_COUNT"
info "Additive risks: $ADD_COUNT"
info "File size: $SIZE"

echo ""
info "Done. Reference database ready at $OUTPUT"
