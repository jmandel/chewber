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
- `scripts` — dataset import / maintenance scripts (Open Food Facts / USDA etc.)

---

## Quick start (dev)

### 1) Install deps
From repo root:

```bash
bun install
```

### 2) Start the server
```bash
bun run dev
```

In another terminal, run the worker:

```bash
bun run worker
```

Open the app at:
- http://localhost:8000

The single server handles both the API (`/api/*`) and the frontend (static files + SPA fallback).

---

## Environment variables

Copy and edit:

```bash
cp apps/api/.env.example apps/api/.env
```

Key vars:
- `CHEWBER_DB_PATH` (default: `./chewber.sqlite`)
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


### Seed example additive risk table

```bash
bun -C apps/api src/scripts/seedAdditiveRisks.ts
```

### Import Open Food Facts JSONL dump (optional)

```bash
bun -C apps/api src/scripts/importOpenFoodFactsJsonl.ts /path/to/openfoodfacts-products.jsonl
```
