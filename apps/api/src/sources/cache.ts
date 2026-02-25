import { getDb } from "../db";
import { newId, nowIso } from "../utils/id";

export async function cacheGet(provider: string, key: string): Promise<any | null> {
  const db = getDb();
  const row = db
    .query(`SELECT response_json FROM source_cache WHERE provider = ? AND key = ? LIMIT 1`)
    .get(provider, key) as any;
  if (!row) return null;
  try {
    return JSON.parse(row.response_json);
  } catch {
    return null;
  }
}

export async function cacheSet(provider: string, key: string, value: any): Promise<void> {
  const db = getDb();
  const id = newId("cache");
  const response_json = JSON.stringify(value);
  try {
    db.query(
      `INSERT OR REPLACE INTO source_cache (id, provider, key, response_json, created_at) VALUES (?, ?, ?, ?, ?)`
    ).run(id, provider, key, response_json, nowIso());
  } catch {
    // ignore cache errors
  }
}
