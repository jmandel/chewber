import type { Database } from "bun:sqlite";

/** Check whether a column exists on a table. */
function hasColumn(db: Database, table: string, column: string): boolean {
  // PRAGMA doesn't support ? params — interpolate table name (safe: controlled input)
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  return cols.some(c => c.name === column);
}

/**
 * Run all migrations against the given database.
 * Each migration is idempotent (safe to re-run).
 * Called automatically from getDb() after schema.sql is applied.
 */
export function runMigrations(db: Database): void {
  // -----------------------------------------------------------------------
  // Migration 1: Add 'not_found' to queries.status CHECK constraint
  // -----------------------------------------------------------------------
  {
    const row = db
      .query<{ sql: string }, []>(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='queries'",
      )
      .get();

    if (row && !row.sql.includes("not_found")) {
      console.log("[migrate] queries: adding 'not_found' to status CHECK constraint");
      db.exec("PRAGMA foreign_keys = OFF;");
      db.transaction(() => {
        db.exec(`
          CREATE TABLE queries_new (
            id TEXT PRIMARY KEY,
            raw_text TEXT,
            structured_query_json TEXT NOT NULL,
            fingerprint TEXT NOT NULL UNIQUE,
            food_id TEXT,
            status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','matched','queued','completed','failed','not_found')),
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL
          );
        `);
        db.exec(`
          INSERT INTO queries_new (id, raw_text, structured_query_json, fingerprint, food_id, status, created_at, updated_at)
          SELECT id, raw_text, structured_query_json, fingerprint, food_id, status, created_at, updated_at
          FROM queries;
        `);
        db.exec("DROP TABLE queries;");
        db.exec("ALTER TABLE queries_new RENAME TO queries;");
      })();
      db.exec("PRAGMA foreign_keys = ON;");
      console.log("[migrate] queries: done");
    }
  }

  // -----------------------------------------------------------------------
  // Migration 2: Add kind + parent_slug to categories for tag taxonomy
  // -----------------------------------------------------------------------
  {
    if (!hasColumn(db, "categories", "kind")) {
      console.log("[migrate] categories: adding kind + parent_slug columns");
      db.exec(`ALTER TABLE categories ADD COLUMN kind TEXT NOT NULL DEFAULT 'unclassified' CHECK (kind IN ('category','trait','unclassified'))`);
      db.exec(`ALTER TABLE categories ADD COLUMN parent_slug TEXT REFERENCES categories(slug) ON DELETE SET NULL`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_kind ON categories(kind)`);
      db.exec(`CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_slug)`);
      console.log("[migrate] categories: done");
    }
  }
}
