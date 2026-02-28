import { getDb } from "./index";

const db = getDb();

// Add new migrations below this line.
// Each migration should be idempotent (safe to re-run).

console.log("[migrate] done");
