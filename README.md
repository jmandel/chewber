# Chewber 🥕📱 — Friends & Family Food Scoring + Abstraction App (Bun + Hono + React + SQLite)

Chewber is a web-first app that lets friends & family:
- Scan a **barcode**
- Type **free text** (e.g. “red onion”, “Trader Joe’s Greek yogurt”)
- Upload a **photo** (label / nutrition facts / ingredient list)
- Browse an organized **category + tags** database of foods (prepared + natural)

If a food already exists in the local SQLite database, Chewber shows:
- Score (0–100)
- Score breakdown
- A detailed markdown analysis report (abstraction template output)

If not, Chewber queues a **research pipeline job**:
1) Research agent: gathers public facts (Open Food Facts, USDA/FDC, web pages) and writes a **Markdown abstraction report**
2) JSON agent: converts that report into **structured JSON** matching a schema
3) Deterministic scorer: computes a 0–100 health score from the JSON inputs

The app supports streaming progress updates (SSE) while the research runs.

---

## Repo layout

- `apps/api` — Bun + Hono API, SQLite, scoring engine, job queue, worker, prompts
- `apps/web` — Bun + React frontend served by a tiny Bun dev server (bundles on demand)
- `scripts` — reproducible build scripts for offline datasets
- `data/` — (gitignored) offline databases, built by scripts

### Data architecture

Chewber separates **operational data** (user-created) from **reference data** (imported datasets):

| File | Purpose | Size | Writable | Built by |
|---|---|---|---|---|
| `apps/api/chewber.sqlite` | App data: scored foods, abstractions, jobs, queries | ~400 KB | Read-write | Auto-created on startup |
| `data/usda.sqlite` | USDA FoodData Central (~2M products) + additive risks (228) | ~1.6 GB | Read-only | `scripts/build-usda-db.sh` |
| `data/off-food.parquet` | Open Food Facts (~4.3M products, full records) | ~450 MB | Read-only | `scripts/build-off-parquet.sh` |
| `data/off-index.sqlite` | OFF search index (barcode + FTS5 on name/brand) | ~490 MB | Read-only | `scripts/build-off-index.sh` |

Reference databases are reproducible from public sources and can be rebuilt independently.
The app DB is the only file that needs backup.

---

## Quick start (dev)

### 1) Install deps

```bash
bun install
```

### 2) Build reference databases

Requires `duckdb` CLI (v1.4+), `sqlite3`, `curl`, `unzip`.

```bash
./scripts/build-off-parquet.sh   # OFF: ~4.4 GB download → 450 MB parquet
./scripts/build-off-index.sh     # OFF: FTS5 search index from parquet
./scripts/build-usda-db.sh       # USDA: ~300 MB download → 1.6 GB SQLite
```

Or run everything at once:

```bash
./scripts/setup.sh
```

### 3) Start the server

```bash
bun run dev
```

In another terminal, run the worker:

```bash
bun run worker
```

Open the app at http://localhost:8000.
The single server handles both the API (`/api/*`) and the frontend (static files + SPA fallback).

---

## Environment variables

Copy and edit:

```bash
cp apps/api/.env.example apps/api/.env
```

Key vars:
- `CHEWBER_DB_PATH` (default: `./chewber.sqlite`) — operational app database
- `CHEWBER_REF_DB_PATH` (default: `data/usda.sqlite`) — USDA + additive risks reference DB
- `OFF_PARQUET_PATH` (default: `data/off-food.parquet`) — OFF product data
- `OFF_INDEX_PATH` (default: `data/off-index.sqlite`) — OFF search index
- `CHEWBER_UPLOAD_DIR` (default: `./uploads`)
- `CHEWBER_LLM_PROVIDER` (`stub` by default)
- `OPENAI_API_KEY` (optional; required if you enable OpenAI provider)

> Note: the LLM provider is intentionally pluggable. The default stub lets the project compile/run without keys.

---

## TODO markers

This scaffold uses grep-friendly TODO tags:

- `TODO_CHEWBER_LLM` — connect real LLM provider / tool calls
- `TODO_CHEWBER_SOURCES` — implement Open Food Facts / USDA / web scraping adapters
- `TODO_CHEWBER_ADD_RISK` — populate additive risk table (policy + curation)
- `TODO_CHEWBER_VISION` — wire image-to-text extraction / vision model
- `TODO_CHEWBER_AUTH` — add auth if you want it (friends & family)

---

## Disclaimer

This repo is a *scaffold* and contains structured TODOs where production details vary by jurisdiction, data source terms, and the exact additive risk taxonomy you choose to adopt.


### Build scripts (reference databases)

All reference data lives in `data/` (gitignored) and is reproducible from public sources.

| Script | Source | Output | Size |
|---|---|---|---|
| `scripts/build-off-parquet.sh` | HuggingFace OFF parquet (~4.4 GB) | `data/off-food.parquet` | ~450 MB |
| `scripts/build-off-index.sh` | Reads `off-food.parquet` | `data/off-index.sqlite` | ~490 MB |
| `scripts/build-usda-db.sh` | USDA FoodData Central CSV (~300 MB) | `data/usda.sqlite` | ~1.6 GB |

To rebuild any dataset, delete the output file and re-run the script. The OFF index depends on the OFF parquet, so rebuild the parquet first if needed.
