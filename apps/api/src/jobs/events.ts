import { getDb } from "../db";
import { nowIso } from "../utils/id";

export type JobEventLevel = "debug" | "info" | "tool" | "warn" | "error";

export function appendJobEvent(jobId: string, level: JobEventLevel, message: string, data?: any) {
  const db = getDb();
  db.query(
    `INSERT INTO job_events (job_id, ts, level, message, data_json) VALUES (?, ?, ?, ?, ?)`
  ).run(jobId, nowIso(), level, message, data ? JSON.stringify(data) : null);
}
