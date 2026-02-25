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

# ── Database setup (schema + migrations) ─────────────────────
step "Setting up database"
cd "$API_DIR"

# Just starting the DB module applies schema.sql automatically
bun -e "require('./src/db').getDb(); console.log('Schema applied');"
info "SQLite database ready"

# ── Seed additive risks ──────────────────────────────────────
step "Seeding additive risk table"
cd "$API_DIR"
bun src/scripts/seedAdditiveRisks.ts
info "Additive risks seeded (~230 entries)"

# ── Open Food Facts download & import ────────────────────────
OFF_CSV="$DATA_DIR/en.openfoodfacts.org.products.csv.gz"
OFF_URL="https://static.openfoodfacts.org/data/en.openfoodfacts.org.products.csv.gz"

if [ "$QUICK" = true ]; then
  warn "Skipping Open Food Facts download (--quick mode)"
  warn "Run without --quick to download the ~7 GB product database"
else
  step "Open Food Facts product database"

  # Check if already imported
  OFF_COUNT=$(cd "$API_DIR" && bun -e "
    const { getDb } = require('./src/db');
    const db = getDb();
    const r = db.query('SELECT COUNT(*) as c FROM dataset_off_products').get();
    console.log(r.c);
  " 2>/dev/null || echo "0")

  if [ "$OFF_COUNT" -gt 1000000 ]; then
    info "Already imported ($OFF_COUNT products) — skipping download"
  else
    if [ -f "$OFF_CSV" ]; then
      info "CSV already downloaded: $OFF_CSV"
    else
      echo "  Downloading Open Food Facts CSV dump (~7 GB compressed)..."
      echo "  Source: $OFF_URL"
      echo "  This will take a while on the first run."
      echo ""
      curl -L --progress-bar -o "$OFF_CSV" "$OFF_URL"
      info "Download complete"
    fi

    step "Importing Open Food Facts into SQLite"
    echo "  This imports ~3-4 million products and takes 5-15 minutes."
    cd "$API_DIR"
    bun src/scripts/importOffCsv.ts "$OFF_CSV"
    info "Open Food Facts import complete"
  fi
fi

# ── Summary ──────────────────────────────────────────────────
step "Setup complete!"
echo ""

# Show database stats
cd "$API_DIR"
bun -e "
  const { getDb } = require('./src/db');
  const db = getDb();
  const off = db.query('SELECT COUNT(*) as c FROM dataset_off_products').get();
  const adds = db.query('SELECT COUNT(*) as c FROM additive_risks').get();
  const foods = db.query('SELECT COUNT(*) as c FROM foods').get();
  console.log('  Database stats:');
  console.log('    OFF products:   ' + off.c.toLocaleString());
  console.log('    Additive risks: ' + adds.c);
  console.log('    Scored foods:   ' + foods.c);
" 2>/dev/null || true

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
