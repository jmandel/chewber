#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Build a lightweight SQLite index over the OFF parquet file
# for fast barcode lookups and full-text search.
#
# The index contains only (code, product_name, brands) — just
# enough for search. Full records (ingredients, nutriments, etc)
# are fetched from the parquet via DuckDB on demand.
#
# Prerequisites:
#   - duckdb CLI (v1.4+)
#   - sqlite3
#   - data/off-food.parquet (built by build-off-parquet.sh)
#
# Output: data/off-index.sqlite (~200-400 MB)
#
# Usage:
#   ./scripts/build-off-index.sh
# ─────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$ROOT_DIR/data"
PARQUET="$DATA_DIR/off-food.parquet"
OUTPUT="$DATA_DIR/off-index.sqlite"

BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RESET="\033[0m"
info()  { echo -e "${GREEN}✓${RESET} $1"; }
warn()  { echo -e "${YELLOW}⚠${RESET} $1"; }
step()  { echo -e "\n${BOLD}── $1${RESET}"; }

# ── Preflight ────────────────────────────────────────────────
if ! command -v duckdb &>/dev/null; then
  echo "Error: duckdb CLI not found."; exit 1
fi
if ! command -v sqlite3 &>/dev/null; then
  echo "Error: sqlite3 not found."; exit 1
fi
if [ ! -f "$PARQUET" ]; then
  echo "Error: $PARQUET not found. Run build-off-parquet.sh first."
  exit 1
fi

# ── Build SQLite directly via DuckDB's sqlite extension ──────
step "Building SQLite index from parquet"

rm -f "$OUTPUT" "${OUTPUT}-wal" "${OUTPUT}-shm"

# DuckDB can write directly to SQLite via the sqlite extension
duckdb -c "
INSTALL sqlite;
LOAD sqlite;
ATTACH '$OUTPUT' AS idx (TYPE sqlite);

CREATE TABLE idx.off_products AS
  SELECT
    row_number() OVER (ORDER BY code) AS id,
    code,
    COALESCE(product_name[1].\"text\", '') AS product_name,
    COALESCE(brands, '') AS brands
  FROM '$PARQUET'
  WHERE code IS NOT NULL AND code != '';

DETACH idx;
"

echo "  Creating indexes..."
sqlite3 "$OUTPUT" <<'SQL'
CREATE UNIQUE INDEX idx_off_id ON off_products(id);
CREATE INDEX idx_off_code ON off_products(code);
SQL

COUNT=$(sqlite3 "$OUTPUT" "SELECT COUNT(*) FROM off_products;")
info "Loaded $COUNT products into SQLite"

# ── Build FTS5 index (must use sqlite3 — DuckDB can't create virtual tables) ──
step "Building FTS5 full-text index"

sqlite3 "$OUTPUT" <<'SQL'
CREATE VIRTUAL TABLE off_fts USING fts5(
  product_name,
  brands,
  content='off_products',
  content_rowid='id'
);

INSERT INTO off_fts(rowid, product_name, brands)
  SELECT id, product_name, brands FROM off_products;
SQL

info "FTS5 index built"

# ── Verify ───────────────────────────────────────────────────
step "Verify"

SIZE=$(du -h "$OUTPUT" | cut -f1)
FTS_COUNT=$(sqlite3 "$OUTPUT" "SELECT COUNT(*) FROM off_fts;")

info "off_products: $COUNT rows"
info "off_fts: $FTS_COUNT rows"
info "File size: $SIZE"

echo ""
echo "  Sample barcode lookup:"
sqlite3 -header -column "$OUTPUT" "
  SELECT code, substr(product_name,1,40) as product_name, substr(brands,1,20) as brands
  FROM off_products WHERE code = '00488754' LIMIT 1;
"
echo "  Sample FTS search 'pound plus':"
sqlite3 -header -column "$OUTPUT" "
  SELECT p.code, substr(p.product_name,1,40) as product_name, substr(p.brands,1,20) as brands
  FROM off_fts f JOIN off_products p ON p.id = f.rowid
  WHERE off_fts MATCH 'pound plus'
  LIMIT 5;
"

echo ""
info "Done. Index ready at $OUTPUT"
