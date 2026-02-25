# Chewber system design

## 1) Product goals

Chewber is a friends & family food knowledge and scoring app.

Users can:
- Scan a product barcode
- Describe a food in free text (e.g., “white onion”, “Greek yogurt 2%”)
- Upload a photo (front label, nutrition facts panel, ingredient list)
- Browse a categorized and tagged database of prepared and natural foods

Chewber returns:
- A 0–100 “Chewber Score” (Nutri-Score-based composite scoring model)
- A transparent score breakdown
- A detailed, structured analysis report (Markdown) and a machine-readable abstraction (JSON)

If the food is not in the database, Chewber runs a research pipeline to create a new entry.

---

## 2) Non-goals (for this scaffold)

- Payments
- Social feed / likes / comments
- Full user authentication & multi-tenant privacy controls (left as TODO)
- Full computer-vision OCR pipeline (left as TODO)
- Fully curated additive-risk taxonomy (left as TODO; scaffold provides the structure)

---

## 3) Architecture overview

**Runtime**
- Backend API: Bun + TypeScript + Hono
- Worker: Bun + TypeScript (polls queue, runs agent pipeline)
- Frontend: Bun + React (bundled on-demand by a Bun dev server)
- Database: SQLite (single file)

**Key subsystems**
1) **Food database**
   - Canonical food entries (barcode or canonical query fingerprint)
   - Tags & category browsing
   - Full text search (FTS5)

2) **Agentic research pipeline**
   - Job queue (SQLite tables)
   - Research stage → Markdown report
   - JSON stage → validated abstraction JSON
   - Deterministic scoring engine → score + breakdown
   - Streaming progress events via SSE

3) **Navigation + disambiguation helper**
   - Minimal follow-up questions only when required to resolve ambiguity
   - Structured mobile-friendly question UI (select/dropdown, yes/no, etc.)

---

## 4) Data flow

### 4.1 Existing product lookup (barcode or text)
1. User submits barcode/text/photo
2. API searches SQLite:
   - By barcode, OR
   - By canonical query fingerprint (name+brand+variant+type)
3. If found:
   - Return: score, breakdown, markdown report, JSON abstraction

### 4.2 New product research
1. User submits query (text/photo/barcode) that is not in DB
2. API calls **Helper Agent**:
   - Extracts any structure possible
   - Asks only 0–3 follow-ups when needed (e.g., onion color, organic yes/no)
3. User answers
4. API enqueues `research_food` job
5. Worker processes job:
   - Stage A: Research → markdown abstraction report
   - Stage B: Convert report → JSON abstraction
   - Stage C: Score deterministically from JSON abstraction
   - Persist everything in SQLite
6. User watches progress (SSE) and sees final result

---

## 5) SQLite schema (high level)

### 5.1 Core tables
- `foods`
  - canonical entry for food/product
  - supports barcode + free-text entries (natural foods)

- `food_abstractions`
  - latest abstraction JSON + markdown report + computed score
  - may store multiple versions; we keep “active” pointer

- `food_images`
  - stored file references for uploaded photos (optional)

### 5.2 Search & browsing
- `foods_fts` (FTS5)
- category extraction is derived from `foods.category_path`
- tags stored as JSON arrays; index via generated columns (TODO if needed)

### 5.3 Research pipeline
- `jobs`
- `job_events` (append-only log for SSE streaming)

---

## 6) API surface

### 6.1 Foods
- `GET /api/foods/by-barcode/:barcode`
- `GET /api/foods/:id`
- `GET /api/foods/search?q=...`
- `GET /api/categories`
- `GET /api/tags`

### 6.2 Query helper + research
- `POST /api/query/assist`
  - input: free text, optional image IDs
  - output: structured query + minimal follow-up questions

- `POST /api/research/enqueue`
  - input: structured query
  - output: job id

### 6.3 Jobs + streaming
- `GET /api/jobs/:id`
- `GET /api/jobs/:id/stream` (SSE)

---

## 7) Scoring model

This scaffold includes a deterministic scoring engine based on Nutri-Score, additive risk assessment, and organic certification:

- Nutrition (Nutri-Score original algorithm) → mapped to a 0–100 scale → weighted at 60%
- Additives → starts at 30 points and subtracts based on risk level
- Organic → bonus +10
- High-risk additive cap → final score is capped at 49 when high-risk additive present

Special categories:
- Salt products (special scoring track)
- Chocolate products (special scoring track — incomplete public details; scaffold provides TODO hooks)

> The scoring engine is intentionally deterministic (code), not LLM-derived.

---

## 8) Agent prompts and contract

Agents should be treated as **untrusted**:
- All outputs must be validated (JSON schema / Zod)
- Sources must be cited in the markdown report
- Values must be normalized to per-100g/per-100mL where required

### 8.1 Helper Agent
Goal: Convert messy user input into a structured query with the **fewest** follow-up questions.

Output: JSON:
- `structured_query`
- `questions[]` (0–3)
- `confidence` + `why_questions`

### 8.2 Research Agent
Goal: Produce a Markdown report that captures everything required for scoring and for future re-checking.

It should:
- Try Open Food Facts first for barcoded packaged foods
- Use USDA/FDC or other public DBs for generic foods
- Use web pages only when needed (and cite URLs)

### 8.3 JSON Extraction Agent
Goal: Convert the markdown report into strict JSON matching schema.

---

## 9) Streaming progress

Worker writes `job_events` rows:
- `info` progress messages
- `tool` events (source lookups)
- `warn` for missing fields
- `error` on failure

SSE endpoint tails events from SQLite and pushes them to the browser.

---

## 10) Deployment notes

SQLite is single-file; for a small friends-and-family app:
- Works well on a single VPS or home server
- Consider daily backup + WAL mode for safety
- For multi-instance deployments, migrate to Postgres or Litestream-style replication (TODO)

---

## 11) Open-source DB strategy

Recommended sources and strategy (scaffold provides adapters + import scripts):

- Open Food Facts (barcode packaged foods)
- USDA FoodData Central (generic foods; sometimes branded)
- Local curated “natural foods” table for produce etc.
- Optional: incorporate national datasets depending on region

A local SQLite “source cache” table can store raw JSON responses to avoid repeated network calls.

---

## 12) Security & privacy

- Uploaded images are stored on disk under `CHEWBER_UPLOAD_DIR`
- No auth in scaffold (friends & family deployments should add auth)
- Rate-limit job creation to prevent runaway LLM costs (TODO)
- Store minimal user data; avoid storing personal identifiers

---

## 13) Structured TODO roadmap

- TODO_CHEWBER_LLM: wire real LLM provider (OpenAI / Anthropic / local)
- TODO_CHEWBER_SOURCES: implement Open Food Facts + USDA adapters
- TODO_CHEWBER_ADD_RISK: additive risk table ingestion + updates
- TODO_CHEWBER_VISION: image OCR/vision pipeline
- TODO_CHEWBER_AUTH: auth + user sessions
- TODO_CHEWBER_TESTS: add integration tests for scoring + pipeline
