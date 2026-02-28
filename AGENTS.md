# Agent Notes — Chewber

## Database Locations

### App database (operational — user-created data)
- **Path**: `data/chewber.sqlite` (relative to repo root)
- **Resolved at runtime from**: `CHEWBER_DB_PATH=../../data/chewber.sqlite` in `apps/api/.env`, resolved relative to `apps/api/` via `import.meta.dir` (works from any cwd)
- **Absolute**: `/home/exedev/chewber/data/chewber.sqlite`
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

## Worker concurrency
- Default: 3 parallel research jobs (`CHEWBER_WORKER_CONCURRENCY=3`)
- Each job takes ~30-60s (LLM calls), so throughput is ~4-6 foods/min at concurrency 3
- Safe to increase — `dequeueJob` uses a SQLite transaction to prevent double-claiming
- Set in `apps/api/.env` or as an environment variable

## Architecture

- **Single server process** on port 8000 serves both the API (`/api/*`) and the SPA (with Bun.build bundling on the fly)
- Entry: `apps/api/src/index.ts` — Hono app with SPA fallback
- **Worker process** polls the `jobs` table and runs research pipelines
- Both use the same DB; `dequeueJob` uses a SQLite transaction to prevent double-claiming

## Key file paths
- Server entry: `apps/api/src/index.ts`
- Server .env: `apps/api/.env`
- Systemd services: `/etc/systemd/system/chewber.service`, `/etc/systemd/system/chewber-worker.service` (not in repo)
- Research output: `research/additives/{CODE}/{CODE}-report.md` and `{CODE}-abstraction.json`
- Research scripts: `scripts/research-additive.sh`, `scripts/research-all-additives.sh`
- Prompt template: `scripts/prompts/research-additive.prompt.md`
- Sync script: `apps/api/src/scripts/syncAdditiveResearch.ts`
- Rescore script: `apps/api/src/scripts/rescore.ts`

## Pipeline: research → scores

All scripts can be run from the **repo root** — they resolve DB paths and
`.env` relative to `apps/api/` via `import.meta.dir`, not `process.cwd()`.

```bash
# From repo root (or any directory):
bun run apps/api/src/scripts/syncAdditiveResearch.ts
#   → updates additive_risks in data/usda.sqlite
#   → automatically chains rescore.ts if any risk levels changed
#     → updates food scores in data/chewber.sqlite
sudo systemctl restart chewber   # reload caches
```

Flags:
- `--dry-run` — preview changes without writing
- `--no-rescore` — skip the automatic rescore step

You can also run rescore independently:
```bash
bun run apps/api/src/scripts/rescore.ts          # all foods
bun run apps/api/src/scripts/rescore.ts --dry-run # preview
```
