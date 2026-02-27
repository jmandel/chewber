# Agent Notes — Chewber

## Database Locations

### App database (operational — user-created data)
- **Path**: `apps/api/chewber.sqlite` (relative to repo root)
- **Resolved at runtime from**: `WorkingDirectory=/home/exedev/chewber/apps/api` in systemd + `CHEWBER_DB_PATH=./chewber.sqlite` in `.env`
- **Absolute**: `/home/exedev/chewber/apps/api/chewber.sqlite`
- **Contains**: foods, food_abstractions, jobs, job_events, queries, categories, source_cache
- **Read-write** by the API server and worker

### Reference database (imported datasets — read-only at runtime)
- **Path**: `data/usda.sqlite` (relative to repo root)
- **Absolute**: `/home/exedev/chewber/data/usda.sqlite`
- **Contains**: `dataset_usda_products` (~2M products), `additive_risks` (~243 entries)
- **Opened read-only** by the API server via `referenceDb.ts`
- **Written to** by build scripts and `syncAdditiveResearch.ts` (which opens it read-write separately)
- The `additive_risks` table is the source of truth for additive risk levels used in food scoring

### OFF search index
- **Path**: `data/off-index.sqlite`
- FTS5 index over Open Food Facts products (barcode + name/brand search)

### Stale / empty files to ignore
- `data/chewber.sqlite` — empty 0-byte file, not used by anything

## Worker concurrency
- Default: 3 parallel research jobs (`CHEWBER_WORKER_CONCURRENCY=3`)
- Each job takes ~30-60s (LLM calls), so throughput is ~4-6 foods/min at concurrency 3
- Safe to increase — `dequeueJob` uses a SQLite transaction to prevent double-claiming
- Set in `apps/api/.env` or as an environment variable

## Key file paths
- Server entry: `apps/api/src/index.ts`
- Server .env: `apps/api/.env`
- Systemd services: `chewber.service`, `chewber-worker.service`
- Research output: `research/additives/{CODE}/{CODE}-report.md` and `{CODE}-abstraction.json`
- Research scripts: `scripts/research-additive.sh`, `scripts/research-all-additives.sh`
- Prompt template: `scripts/prompts/research-additive.prompt.md`
- Sync script: `apps/api/src/scripts/syncAdditiveResearch.ts`
- Rescore script: `apps/api/src/scripts/rescore.ts`

## Pipeline: research → scores
```
research/additives/{CODE}-abstraction.json
  → bun run apps/api/src/scripts/syncAdditiveResearch.ts
    → updates additive_risks in data/usda.sqlite
      → bun run apps/api/src/scripts/rescore.ts (chained automatically)
        → updates food scores in apps/api/chewber.sqlite
          → sudo systemctl restart chewber (reload caches)
```
