# README Audit — Environment Variables & Scripts Discrepancies

## 1. Port default mismatch

- **README** says: "Open the app at http://localhost:8000"
- **.env.example** says: `CHEWBER_PORT=8000`
- **Code** (`env.ts` line 43): Zod schema default is `8787`, NOT `8000`
- **Impact**: If user has NO `.env` file and NO `CHEWBER_PORT` env var, the server starts on **8787**, not 8000. The `.env.example` masks this but the code default disagrees with the README.

## 2. Env vars documented in README but MISSING from `.env.example`

These 4 vars are listed in the README "Key vars" section but do NOT appear in `apps/api/.env.example`:

| Variable | Where it's used in code | .env.example? |
|---|---|---|
| `CHEWBER_REF_DB_PATH` | `db/referenceDb.ts`, `scripts/seedAdditiveRisks.ts`, `scripts/importUsda.ts`, `scripts/syncAdditiveResearch.ts` | ❌ Missing |
| `OFF_PARQUET_PATH` | `sources/localOff.ts` | ❌ Missing |
| `OFF_INDEX_PATH` | `sources/localOff.ts` | ❌ Missing |
| `CHEWBER_WORKER_CONCURRENCY` | `jobs/worker.ts` | ❌ Missing |

User who follows the README instructions (`cp .env.example .env`) will never see these vars to configure.

## 3. Env vars used in code but MISSING from BOTH README and `.env.example`

| Variable | Where it's used | Notes |
|---|---|---|
| `CHEWBER_RESEARCH_PATH` | `sources/additiveResearch.ts:22` | Not documented anywhere |
| `CHEWBER_ADMIN_KEY` | `env.ts` (in Zod schema + getEnv) | Not documented anywhere |
| `OPENROUTER_BASE_URL` | `env.ts`, `agents/llm/openrouter.ts`, `agents/vision.ts` | In `.env.example` implicitly (not shown), but not in README |

## 4. Env vars in `.env.example` but NOT in README "Key vars" section

These are configurable and documented in `.env.example` but omitted from the README's key vars list:

- `CHEWBER_PORT` (mentioned only as "port 8000" in prose)
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`
- `USDA_API_KEY`
- `BRAVE_SEARCH_API_KEY`
- `CHEWBER_WEB_ORIGIN`

## 5. Scripts: `bun run dev` and `bun run worker` — ✅ Correct

- `package.json` defines `"dev": "bun --hot -C apps/api src/index.ts"` — ✅
- `package.json` defines `"worker": "bun --hot -C apps/api src/jobs/worker.ts"` — ✅
- README claims are accurate for these scripts.

## 6. Build scripts — ✅ All exist

- `scripts/build-off-parquet.sh` — ✅ exists
- `scripts/build-off-index.sh` — ✅ exists  
- `scripts/build-usda-db.sh` — ✅ exists
- `scripts/setup.sh` — ✅ exists

## 7. `CHEWBER_WEB_ORIGIN` default mismatch

- **.env.example** says: `CHEWBER_WEB_ORIGIN=*`
- **Code** (`env.ts` line 60): Zod default is `http://localhost:5173`
- **Impact**: Without `.env`, CORS would only allow `localhost:5173`. The `.env.example` default of `*` is more permissive and appropriate for dev, but the code default is different.

## Summary of required fixes

1. **Fix port default**: Either change Zod default in `env.ts` from `8787` to `8000`, or update README to say 8787, or at minimum note the discrepancy.
2. **Add missing vars to `.env.example`**: `CHEWBER_REF_DB_PATH`, `OFF_PARQUET_PATH`, `OFF_INDEX_PATH`, `CHEWBER_WORKER_CONCURRENCY`.
3. **Add undocumented vars to README**: `CHEWBER_RESEARCH_PATH`, `CHEWBER_ADMIN_KEY`, `CHEWBER_PORT`, and the OpenRouter/USDA/Brave vars.
4. **Fix `CHEWBER_WEB_ORIGIN` default mismatch** between code and `.env.example`.
