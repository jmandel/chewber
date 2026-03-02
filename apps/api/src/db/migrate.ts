import type { Database } from "bun:sqlite";

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
}
