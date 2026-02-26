#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Chewber — Full setup script
#
# Downloads offline databases, seeds reference data, installs
# dependencies, and validates the environment.
#
# Usage:
#   ./scripts/setup.sh          # full setup (downloads + seed + install)
#   ./scripts/setup.sh --quick  # skip large downloads (deps + seed only)
# ─────────────────────────────────────────────────────────────

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$ROOT_DIR/apps/api"
DATA_DIR="$ROOT_DIR/data"
QUICK=false

for arg in "$@"; do
  case "$arg" in
    --quick) QUICK=true ;;
  esac
done

# ── Colors ───────────────────────────────────────────────────
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

info()  { echo -e "${GREEN}✓${RESET} $1"; }
warn()  { echo -e "${YELLOW}⚠${RESET} $1"; }
err()   { echo -e "${RED}✗${RESET} $1"; }
step()  { echo -e "\n${BOLD}── $1${RESET}"; }

# ── Prerequisites ────────────────────────────────────────────
step "Checking prerequisites"

if ! command -v bun &>/dev/null; then
  err "bun not found. Install from https://bun.sh"
  exit 1
fi
info "bun $(bun --version)"

if ! command -v curl &>/dev/null; then
  err "curl not found. Please install curl."
  exit 1
fi
info "curl available"

if ! command -v duckdb &>/dev/null; then
  warn "duckdb CLI not found — OFF parquet build will fail"
  warn "Install from https://duckdb.org/docs/installation/"
else
  info "duckdb $(duckdb -version 2>/dev/null | head -1)"
fi

if ! command -v gunzip &>/dev/null && ! command -v gzip &>/dev/null; then
  warn "gzip/gunzip not found — CSV import may fail for .gz files"
fi

# ── Install dependencies ─────────────────────────────────────
step "Installing dependencies"
cd "$ROOT_DIR"
bun install
info "Dependencies installed"

# ── Environment file ─────────────────────────────────────────
step "Checking environment"

if [ ! -f "$API_DIR/.env" ]; then
  cp "$API_DIR/.env.example" "$API_DIR/.env"
  warn "Created apps/api/.env from .env.example"
  warn "Edit apps/api/.env to add your API keys (see README)"
else
  info "apps/api/.env exists"
fi

# ── Create data directory ────────────────────────────────────
mkdir -p "$DATA_DIR"
mkdir -p "$API_DIR/uploads"

# ── App database (schema + migrations) ─────────────────────
step "Setting up app database"
cd "$API_DIR"

# Just starting the DB module applies schema.sql automatically
bun -e "require('./src/db').getDb(); console.log('Schema applied');"
info "App database ready"

# ── USDA reference database ─────────────────────────────────
USDA_DB="$DATA_DIR/usda.sqlite"

if [ "$QUICK" = true ]; then
  warn "Skipping USDA download (--quick mode)"
else
  step "USDA reference database"

  if [ -f "$USDA_DB" ]; then
    USDA_SIZE=$(du -h "$USDA_DB" | cut -f1)
    info "USDA reference DB already exists ($USDA_SIZE) — skipping build"
    info "To rebuild: rm $USDA_DB && ./scripts/build-usda-db.sh"
  else
    "$ROOT_DIR/scripts/build-usda-db.sh"
  fi
fi

# ── Open Food Facts (Parquet via DuckDB) ─────────────────────
OFF_PARQUET="$DATA_DIR/off-food.parquet"

if [ "$QUICK" = true ]; then
  warn "Skipping Open Food Facts download (--quick mode)"
  warn "Run without --quick to download the ~4.4 GB source and build the slim parquet"
else
  step "Open Food Facts product database"

  if [ -f "$OFF_PARQUET" ]; then
    OFF_SIZE=$(du -h "$OFF_PARQUET" | cut -f1)
    info "OFF parquet already exists ($OFF_SIZE) — skipping build"
    info "To rebuild: rm $OFF_PARQUET && ./scripts/build-off-parquet.sh"
  else
    "$ROOT_DIR/scripts/build-off-parquet.sh"
    info "Open Food Facts parquet ready"
  fi

  # Build SQLite search index over parquet
  OFF_INDEX="$DATA_DIR/off-index.sqlite"
  if [ -f "$OFF_INDEX" ]; then
    info "OFF search index already exists — skipping"
    info "To rebuild: rm $OFF_INDEX && ./scripts/build-off-index.sh"
  else
    "$ROOT_DIR/scripts/build-off-index.sh"
  fi
fi

# ── Summary ──────────────────────────────────────────────────
step "Setup complete!"
echo ""

# Show database stats
echo "  Database stats:"

cd "$API_DIR"
FOOD_COUNT=$(bun -e "const{getDb}=require('./src/db');console.log(getDb().query('SELECT COUNT(*)as c FROM foods').get().c)" 2>/dev/null || echo "?")
echo "    Scored foods:   $FOOD_COUNT (app DB)"

if [ -f "$DATA_DIR/usda.sqlite" ]; then
  USDA_COUNT=$(sqlite3 "$DATA_DIR/usda.sqlite" "SELECT COUNT(*) FROM dataset_usda_products;" 2>/dev/null || echo "?")
  ADD_COUNT=$(sqlite3 "$DATA_DIR/usda.sqlite" "SELECT COUNT(*) FROM additive_risks;" 2>/dev/null || echo "?")
  echo "    USDA products:  $USDA_COUNT (reference DB)"
  echo "    Additive risks: $ADD_COUNT (reference DB)"
fi

if [ -f "$DATA_DIR/off-food.parquet" ] && command -v duckdb &>/dev/null; then
  OFF_COUNT=$(duckdb -noheader -csv -c "SELECT COUNT(*) FROM '$DATA_DIR/off-food.parquet';" 2>/dev/null || echo "?")
  echo "    OFF products:   $OFF_COUNT (parquet)"
fi

echo ""

# Check if LLM is configured
LLM_PROVIDER=$(grep -E '^CHEWBER_LLM_PROVIDER=' "$API_DIR/.env" 2>/dev/null | cut -d= -f2 || echo "stub")
if [ "$LLM_PROVIDER" = "stub" ] || [ -z "$LLM_PROVIDER" ]; then
  warn "LLM provider is 'stub' — searches return placeholder data"
  echo "  Set CHEWBER_LLM_PROVIDER=openrouter (or openai) in apps/api/.env"
  echo "  and add your API key to get real food analysis."
else
  info "LLM provider: $LLM_PROVIDER"
fi

echo ""
echo "  To start the app:"
echo "    Terminal 1:  bun run api:dev"
echo "    Terminal 2:  bun run api:worker"
echo "    Open:        http://localhost:8000"
echo ""
