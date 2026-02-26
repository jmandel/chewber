-- Chewber SQLite schema (idempotent)

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Foods: canonical entry. barcode can be NULL for natural foods.
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  barcode TEXT UNIQUE,
  canonical_name TEXT NOT NULL,
  brand TEXT,
  kind TEXT NOT NULL DEFAULT 'prepared' CHECK (kind IN ('prepared','natural')),
  category_path TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  source_hint TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS foods_fts USING fts5(
  canonical_name,
  brand,
  category_path,
  tags_text,
  content='foods',
  content_rowid='rowid'
);

CREATE TRIGGER IF NOT EXISTS foods_ai AFTER INSERT ON foods BEGIN
  INSERT INTO foods_fts(rowid, canonical_name, brand, category_path, tags_text)
  VALUES (new.rowid, new.canonical_name, coalesce(new.brand,''), coalesce(new.category_path,''), coalesce(new.tags_json,'[]'));
END;

CREATE TRIGGER IF NOT EXISTS foods_ad AFTER DELETE ON foods BEGIN
  INSERT INTO foods_fts(foods_fts, rowid, canonical_name, brand, category_path, tags_text)
  VALUES ('delete', old.rowid, old.canonical_name, coalesce(old.brand,''), coalesce(old.category_path,''), coalesce(old.tags_json,'[]'));
END;

CREATE TRIGGER IF NOT EXISTS foods_au AFTER UPDATE ON foods BEGIN
  INSERT INTO foods_fts(foods_fts, rowid, canonical_name, brand, category_path, tags_text)
  VALUES ('delete', old.rowid, old.canonical_name, coalesce(old.brand,''), coalesce(old.category_path,''), coalesce(old.tags_json,'[]'));
  INSERT INTO foods_fts(rowid, canonical_name, brand, category_path, tags_text)
  VALUES (new.rowid, new.canonical_name, coalesce(new.brand,''), coalesce(new.category_path,''), coalesce(new.tags_json,'[]'));
END;

-- Queries: user requests + structured query result
CREATE TABLE IF NOT EXISTS queries (
  id TEXT PRIMARY KEY,
  raw_text TEXT,
  structured_query_json TEXT NOT NULL,
  fingerprint TEXT NOT NULL UNIQUE,
  food_id TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','matched','queued','completed','failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
);

-- Food abstractions: markdown report + strict JSON + computed score.
CREATE TABLE IF NOT EXISTS food_abstractions (
  id TEXT PRIMARY KEY,
  food_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  query_payload_json TEXT NOT NULL,
  report_md TEXT,
  abstraction_json TEXT,
  score INTEGER,
  score_breakdown_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE,
  UNIQUE (food_id, version)
);

CREATE INDEX IF NOT EXISTS idx_food_abstractions_food ON food_abstractions(food_id);
CREATE INDEX IF NOT EXISTS idx_food_abstractions_status ON food_abstractions(status);

-- Images (optional)
CREATE TABLE IF NOT EXISTS food_images (
  id TEXT PRIMARY KEY,
  food_id TEXT,
  query_id TEXT,
  path TEXT NOT NULL,
  mime TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
  FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE SET NULL
);

-- Job queue
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','running','succeeded','failed','canceled')),
  payload_json TEXT NOT NULL,
  progress REAL NOT NULL DEFAULT 0,
  result_food_id TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  FOREIGN KEY (result_food_id) REFERENCES foods(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);

CREATE TABLE IF NOT EXISTS job_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id TEXT NOT NULL,
  ts TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('debug','info','tool','warn','error')),
  message TEXT NOT NULL,
  data_json TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_job_events_job_id ON job_events(job_id);

-- Additive risks + USDA data are in the reference database (data/usda.sqlite).
-- See db/referenceDb.ts.

-- Category registry: human-readable names + descriptions for food categories
CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

-- Cache of raw source lookups (optional)
CREATE TABLE IF NOT EXISTS source_cache (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  key TEXT NOT NULL,
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (provider, key)
);


-- Open Food Facts data is served from DuckDB + Parquet (see sources/localOff.ts).
-- No OFF tables in SQLite.
