# Chewber 🥕📱 — Friends & Family Food Scoring + Abstraction App (Bun + Hono + React + SQLite)

Chewber is a web-first app that lets friends & family:
- Scan a **barcode**
- Type **free text** (e.g. "red onion", "Trader Joe's Greek yogurt")
- Upload a **photo** (label / nutrition facts / ingredient list)
- Browse an organized **category + tags** database of foods (prepared + natural)

If a food already exists in the local SQLite database, Chewber shows:
- Score (0–100)
- Score breakdown
- A detailed markdown analysis report (abstraction template output)

If not, Chewber queues a **research pipeline job**:
1) Research agent: gathers public facts (Open Food Facts, USDA/FDC, web pages via Brave Search or DuckDuckGo) and writes a **Markdown abstraction report**
2) JSON agent: converts that report into **structured JSON** matching a schema
3) Deterministic scorer: computes a 0–100 health score from the JSON inputs

The app supports streaming progress updates (SSE) while the research runs.

---

## Repo layout

- `apps/api` — Bun + Hono API, SQLite, scoring engine, job queue, worker, LLM agents, prompts
- `apps/web` — Bun + React frontend (bundled on demand)
- `scripts` — build scripts for reference databases + additive research pipeline
- `data/` — (gitignored) offline reference databases, built by scripts
- `research/` — additive research output (reports + abstraction JSON per additive code)
- `docs/` — design docs, brand guidelines, audit notes
- `brand/` — brand assets (logos, originals)

### Data architecture

Chewber separates **operational data** (user-created) from **reference data** (imported datasets):

| File | Purpose | Size | Writable | Built by |
|---|---|---|---|---|
| `data/chewber.sqlite` | App data: scored foods, abstractions, jobs, queries | ~650 KB | Read-write | Auto-created on startup |
| `data/usda.sqlite` | USDA FoodData Central (~2M products) + additive risks (~243) | ~1.6 GB | Read-only¹ | `scripts/build-usda-db.sh` |
| `data/off-food.parquet` | Open Food Facts (~4.3M products, full records) | ~450 MB | Read-only | `scripts/build-off-parquet.sh` |
| `data/off-index.sqlite` | OFF search index (barcode + FTS5 on name/brand) | ~490 MB | Read-only | `scripts/build-off-index.sh` |

¹ Read-only at runtime; `syncAdditiveResearch.ts` writes to `additive_risks` during the research pipeline.

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

The worker processes up to 3 research jobs concurrently (configurable via `CHEWBER_WORKER_CONCURRENCY`).

Open the app at http://localhost:8000.
The single server handles both the API (`/api/*`) and the frontend (static files + SPA fallback).

---

## Environment variables

Copy and edit:

```bash
cp apps/api/.env.example apps/api/.env
```

All variables have sensible defaults — the app runs out of the box with no keys (using the `stub` LLM provider).

### Server

| Variable | Default | Description |
|---|---|---|
| `CHEWBER_PORT` | `8787` (schema) / `8000` (.env.example) | HTTP listen port |
| `CHEWBER_DB_PATH` | `../../data/chewber.sqlite` | Operational app database |
| `CHEWBER_UPLOAD_DIR` | `./uploads` | Photo upload directory |
| `CHEWBER_WEB_ORIGIN` | `http://localhost:5173` | Allowed CORS origin (`*` for dev) |
| `CHEWBER_ADMIN_KEY` | *(unset)* | If set, required via `X-Admin-Key` header to delete foods |

### Reference data paths

These default to `../../data/` relative to `apps/api/`, so they work without being set if you use the standard repo layout.

| Variable | Default | Description |
|---|---|---|
| `CHEWBER_REF_DB_PATH` | `data/usda.sqlite` | USDA + additive risks reference DB |
| `OFF_PARQUET_PATH` | `data/off-food.parquet` | OFF product data (parquet) |
| `OFF_INDEX_PATH` | `data/off-index.sqlite` | OFF FTS5 search index |
| `CHEWBER_RESEARCH_PATH` | `research/additives` | Additive research output directory |

### LLM providers

| Variable | Default | Description |
|---|---|---|
| `CHEWBER_LLM_PROVIDER` | `stub` | `stub`, `openai`, or `openrouter` |
| `OPENAI_API_KEY` | | Required when provider is `openai` |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible base URL |
| `OPENAI_MODEL` | `gpt-4.1-mini` | Model name for OpenAI provider |
| `OPENROUTER_API_KEY` | | Required when provider is `openrouter` |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | OpenRouter base URL |
| `OPENROUTER_MODEL` | `google/gemini-3-flash-preview` | Model name for OpenRouter provider |

### External APIs

| Variable | Default | Description |
|---|---|---|
| `USDA_API_KEY` | *(falls back to DEMO_KEY)* | USDA FoodData Central API key ([free](https://api.nal.usda.gov)) |
| `BRAVE_SEARCH_API_KEY` | *(falls back to DuckDuckGo)* | Brave Search API key ([free tier](https://brave.com/search/api/)) |

### Worker

| Variable | Default | Description |
|---|---|---|
| `CHEWBER_WORKER_CONCURRENCY` | `3` | Max parallel research jobs per worker |

> Note: the LLM provider is intentionally pluggable. The default `stub` lets the project compile and run without any API keys.

---

## Additive research pipeline

Chewber maintains per-additive research in `research/additives/{CODE}/`. The pipeline:

```
scripts/research-additive.sh {CODE}          # LLM-powered research → report + abstraction JSON
scripts/research-all-additives.sh            # batch-run all known additives
  ↓
bun run apps/api/src/scripts/syncAdditiveResearch.ts
  → updates additive_risks in data/usda.sqlite
    ↓
bun run apps/api/src/scripts/rescore.ts      # (chained automatically)
  → updates food scores in data/chewber.sqlite
    ↓
sudo systemctl restart chewber               # reload caches
```

Other utility scripts:
- `scripts/seed-additive-gaps.sh` — seed research stubs for additives missing reports
- `scripts/clean-reports.sh` — remove generated report artifacts

---

## Build scripts (reference databases)

All reference data lives in `data/` (gitignored) and is reproducible from public sources.

| Script | Source | Output | Size |
|---|---|---|---|
| `scripts/build-off-parquet.sh` | HuggingFace OFF parquet (~4.4 GB) | `data/off-food.parquet` | ~450 MB |
| `scripts/build-off-index.sh` | Reads `off-food.parquet` | `data/off-index.sqlite` | ~490 MB |
| `scripts/build-usda-db.sh` | USDA FoodData Central CSV (~300 MB) | `data/usda.sqlite` | ~1.6 GB |
| `scripts/setup.sh` | Runs all three above | All of the above | |

To rebuild any dataset, delete the output file and re-run the script. The OFF index depends on the OFF parquet, so rebuild the parquet first if needed.
