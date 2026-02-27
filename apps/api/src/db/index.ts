import { Database } from "bun:sqlite";
import { dirname, resolve } from "node:path";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { getEnv } from "../env";

/** apps/api/ directory — anchor for resolving relative DB paths */
const API_DIR = resolve(import.meta.dir, "..", "..");

let _db: Database | null = null;

export function getDb(): Database {
  if (_db) return _db;
  const env = getEnv();
  // Resolve relative to apps/api/ so scripts work from any cwd
  const dbPath = resolve(API_DIR, env.CHEWBER_DB_PATH);
  // Ensure parent dir exists
  const parent = dirname(dbPath);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });

  const db = new Database(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA journal_mode = WAL;");

  // Apply schema (idempotent)
  const schemaPath = resolve(import.meta.dir, "./schema.sql");
  const schemaSql = readFileSync(schemaPath, "utf-8");
  db.exec(schemaSql);

  _db = db;
  return db;
}
