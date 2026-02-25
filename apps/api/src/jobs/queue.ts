import { getDb } from "../db";
import { newId, nowIso } from "../utils/id";

export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "canceled";

export type JobRow = {
  id: string;
  type: string;
  status: JobStatus;
  payload_json: string;
  progress: number;
  result_food_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  finished_at: string | null;
};

export function enqueueJob(type: string, payload: any): string {
  const db = getDb();
  const id = newId("job");
  const ts = nowIso();
  db.query(
    `INSERT INTO jobs (id, type, status, payload_json, progress, created_at, updated_at) VALUES (?, ?, 'queued', ?, 0, ?, ?)`
  ).run(id, type, JSON.stringify(payload), ts, ts);
  return id;
}

export function getJob(id: string): JobRow | null {
  const db = getDb();
  const row = db.query(`SELECT * FROM jobs WHERE id = ? LIMIT 1`).get(id) as any;
  return row ?? null;
}

export function updateJob(id: string, patch: Partial<{ status: JobStatus; progress: number; result_food_id: string | null; error: string | null; started_at: string | null; finished_at: string | null }>) {
  const db = getDb();
  const fields: string[] = [];
  const params: any[] = [];
  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = ?`);
    params.push(v);
  }
  fields.push("updated_at = ?");
  params.push(nowIso());
  params.push(id);

  db.query(`UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`).run(...params);
}

export function dequeueJob(type?: string): JobRow | null {
  const db = getDb();

  const tx = db.transaction(() => {
    const row = (type
      ? db.query(`SELECT * FROM jobs WHERE status='queued' AND type = ? ORDER BY created_at ASC LIMIT 1`).get(type)
      : db.query(`SELECT * FROM jobs WHERE status='queued' ORDER BY created_at ASC LIMIT 1`).get()) as any;

    if (!row) return null;

    db.query(`UPDATE jobs SET status='running', started_at=?, updated_at=? WHERE id=?`).run(nowIso(), nowIso(), row.id);
    const next = db.query(`SELECT * FROM jobs WHERE id=?`).get(row.id) as any;
    return next as JobRow;
  });

  return tx() as any;
}
