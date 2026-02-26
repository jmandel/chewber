import { Database } from "bun:sqlite";
import path from "node:path";
import { existsSync } from "node:fs";

/**
 * Read-only reference database containing imported datasets:
 *   - dataset_usda_products + FTS index (~2M branded/SR Legacy products)
 *   - additive_risks (~230 curated entries)
 *
 * Located at data/usda.sqlite, built by scripts/build-usda-db.sh.
 * Separate from the operational app DB (chewber.sqlite) so that
 * reference data can be rebuilt independently and the app DB stays small.
 */

const REF_DB_PATH =
  process.env.CHEWBER_REF_DB_PATH ??
  path.resolve(import.meta.dir, "../../../../data/usda.sqlite");

let _refDb: Database | null = null;

export function getReferenceDb(): Database {
  if (_refDb) return _refDb;

  if (!existsSync(REF_DB_PATH)) {
    throw new Error(
      `Reference database not found at ${REF_DB_PATH}. ` +
      `Run ./scripts/build-usda-db.sh to build it.`
    );
  }

  const db = new Database(REF_DB_PATH, { readonly: true });
  db.exec("PRAGMA mmap_size = 268435456;"); // 256 MB mmap
  _refDb = db;
  return db;
}
