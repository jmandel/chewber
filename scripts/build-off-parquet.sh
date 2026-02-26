#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Download the Open Food Facts dataset from HuggingFace and
# produce a slim, sorted, ZSTD-compressed Parquet file for
# local barcode/text lookups via DuckDB.
#
# Source:  HuggingFace openfoodfacts/product-database (food split)
# Output:  data/off-food.parquet  (~450 MB, ~4.3M products)
#
# Prerequisites:
#   - duckdb CLI on PATH (v1.4+)
#   - curl
#   - ~6 GB free disk during build (source + output)
#
# Usage:
#   ./scripts/build-off-parquet.sh
# ─────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT_DIR/data"
OUTPUT="$DATA_DIR/off-food.parquet"
TMP_RAW="$DATA_DIR/_off-raw.parquet"

SOURCE_URL="https://huggingface.co/api/datasets/openfoodfacts/product-database/parquet/default/food/0.parquet"

# ── Colors ───────────────────────────────────────────────────
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RESET="\033[0m"
info()  { echo -e "${GREEN}✓${RESET} $1"; }
warn()  { echo -e "${YELLOW}⚠${RESET} $1"; }
step()  { echo -e "\n${BOLD}── $1${RESET}"; }

# ── Preflight ────────────────────────────────────────────────
if ! command -v duckdb &>/dev/null; then
  echo "Error: duckdb CLI not found. Install from https://duckdb.org/docs/installation/"
  exit 1
fi

if ! command -v curl &>/dev/null; then
  echo "Error: curl not found."
  exit 1
fi

mkdir -p "$DATA_DIR"

# ── Download ─────────────────────────────────────────────────
step "Downloading OFF parquet from HuggingFace"

if [ -f "$TMP_RAW" ]; then
  RAW_SIZE=$(stat -c%s "$TMP_RAW" 2>/dev/null || stat -f%z "$TMP_RAW")
  if [ "$RAW_SIZE" -gt 1000000000 ]; then
    info "Raw parquet already downloaded ($(du -h "$TMP_RAW" | cut -f1)), skipping"
  else
    warn "Partial download detected, re-downloading"
    rm -f "$TMP_RAW"
  fi
fi

if [ ! -f "$TMP_RAW" ]; then
  echo "  Source: $SOURCE_URL"
  echo "  This is ~4.4 GB and may take a while."
  echo ""
  curl -L --progress-bar -o "$TMP_RAW" "$SOURCE_URL"
  info "Download complete ($(du -h "$TMP_RAW" | cut -f1))"
fi

# ── Transform ────────────────────────────────────────────────
step "Building slim sorted parquet"

echo "  Selecting 10 columns, sorting by barcode, compressing with ZSTD..."

duckdb -c "
COPY (
  SELECT
    code,
    product_name,
    brands,
    categories,
    ingredients_text,
    additives_tags,
    allergens_tags,
    nutriscore_grade,
    serving_size,
    nutriments
  FROM '$TMP_RAW'
  ORDER BY code
)
TO '$OUTPUT'
(FORMAT PARQUET, COMPRESSION ZSTD, ROW_GROUP_SIZE 51200);
"

info "Output: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"

# ── Verify ───────────────────────────────────────────────────
step "Verifying"

duckdb -c "
SELECT
  COUNT(*) AS total_products,
  COUNT(*) FILTER (WHERE len(nutriments) > 0) AS with_nutriments,
  COUNT(*) FILTER (WHERE len(ingredients_text) > 0) AS with_ingredients,
  COUNT(*) FILTER (WHERE brands IS NOT NULL AND brands != '') AS with_brands
FROM '$OUTPUT';
"

# ── Cleanup ──────────────────────────────────────────────────
step "Cleanup"
rm -f "$TMP_RAW"
info "Removed raw download"

echo ""
info "Done. OFF parquet ready at $OUTPUT"
