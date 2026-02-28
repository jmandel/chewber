import { Hono } from "hono";
import { getJob, updateJob } from "../jobs/queue";
import { sseHeaders, formatSseEvent } from "../utils/sse";
import { nowIso } from "../utils/id";

export const jobsRoutes = new Hono();

jobsRoutes.get("/jobs/queue/recent", (c) => {
  const db = c.get("db");
  const rows = db
    .query(
      `SELECT j.id, j.type, j.status, j.progress, j.payload_json, j.error, j.created_at, j.finished_at, j.result_food_id,
              f.canonical_name, f.brand, f.slug as food_slug
       FROM jobs j
       LEFT JOIN foods f ON f.id = j.result_food_id
       WHERE j.status IN ('queued','running')
          OR j.created_at >= datetime('now','-7 days')
       ORDER BY
         CASE WHEN j.status IN ('queued','running') THEN 0 ELSE 1 END,
         j.created_at DESC
       LIMIT 500`
    )
    .all() as any[];

  return c.json({
    jobs: rows.map((r: any) => {
      let label: string | undefined;
      try {
        const p = JSON.parse(r.payload_json);
        const sq = p.structured_query;
        if (sq?.name) label = sq.name + (sq.brand ? ` by ${sq.brand}` : "");
      } catch {}
      return {
        id: r.id, status: r.status, progress: r.progress, error: r.error,
        created_at: r.created_at, finished_at: r.finished_at,
        label,
        result_food_id: r.result_food_id,
        food_name: r.canonical_name,
        food_brand: r.brand,
        food_slug: r.food_slug
      };
    })
  });
});

jobsRoutes.get("/jobs/queue/status", (c) => {
  const db = c.get("db");
  const rows = db
    .query(
      `SELECT status, COUNT(*) as count FROM jobs WHERE status IN ('queued', 'running') GROUP BY status`
    )
    .all() as { status: string; count: number }[];

  const result: Record<string, number> = { queued: 0, running: 0 };
  for (const row of rows) {
    result[row.status] = row.count;
  }

  return c.json(result);
});

jobsRoutes.get("/jobs/:id", (c) => {
  const id = c.req.param("id");
  const job = getJob(id);
  if (!job) return c.json({ error: "Not found" }, 404);

  // Extract a human-readable label from the payload
  let label: string | undefined;
  try {
    const payload = JSON.parse(job.payload_json);
    const sq = payload.structured_query;
    if (sq?.name) label = sq.name + (sq.brand ? ` by ${sq.brand}` : "");
  } catch {}

  return c.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    result_food_id: job.result_food_id,
    error: job.error,
    label
  });
});

jobsRoutes.get("/jobs/by-food/:foodId", (c) => {
  const db = c.get("db");
  const foodId = c.req.param("foodId");

  // Find the most recent job for this food
  const job = db.query(
    `SELECT id, type, status, progress, error, created_at, finished_at
     FROM jobs WHERE result_food_id = ? ORDER BY created_at DESC LIMIT 1`
  ).get(foodId) as any;

  if (!job) return c.json({ job: null, events: [] });

  const events = db.query(
    `SELECT id, ts, level, message, data_json FROM job_events WHERE job_id = ? ORDER BY id`
  ).all(job.id) as any[];

  return c.json({
    job: { id: job.id, type: job.type, status: job.status, progress: job.progress, error: job.error, created_at: job.created_at, finished_at: job.finished_at },
    events: events.map((e: any) => ({
      id: e.id, ts: e.ts, level: e.level, message: e.message,
      data: e.data_json ? JSON.parse(e.data_json) : undefined
    }))
  });
});

jobsRoutes.get("/jobs/:id/stream", (c) => {
  const db = c.get("db");
  const jobId = c.req.param("id");

  const encoder = new TextEncoder();
  let cancelled = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (evt: string) => controller.enqueue(encoder.encode(evt));

      const jobRow = getJob(jobId);
      if (!jobRow) {
        send(formatSseEvent({ event: "error", data: { error: "Not found" } }));
        controller.close();
        return;
      }

      // initial status
      send(formatSseEvent({ event: "job_status", data: { id: jobRow.id, status: jobRow.status, progress: jobRow.progress, result_food_id: jobRow.result_food_id, error: jobRow.error } }));

      let lastEventId = 0;
      let lastStatus = jobRow.status;
      let lastProgress = jobRow.progress;

      while (!cancelled) {
        const events = db
          .query(
            `SELECT id, ts, level, message, data_json
             FROM job_events
             WHERE job_id = ? AND id > ?
             ORDER BY id ASC
             LIMIT 50`
          )
          .all(jobId, lastEventId) as any[];

        for (const ev of events) {
          lastEventId = ev.id;
          send(
            formatSseEvent({
              event: "job_event",
              id: ev.id,
              data: {
                id: ev.id,
                ts: ev.ts,
                level: ev.level,
                message: ev.message,
                data: ev.data_json ? JSON.parse(ev.data_json) : undefined
              }
            })
          );
        }

        const job = getJob(jobId);
        if (job) {
          if (job.status !== lastStatus || job.progress !== lastProgress) {
            lastStatus = job.status;
            lastProgress = job.progress;
            send(
              formatSseEvent({
                event: "job_status",
                data: { id: job.id, status: job.status, progress: job.progress, result_food_id: job.result_food_id, error: job.error }
              })
            );
          }

          // terminal state: close once no more events arrive
          if (["succeeded", "failed", "canceled"].includes(job.status)) {
            // one extra small wait to flush any last events
            await new Promise((r) => setTimeout(r, 300));
            const more = db
              .query(`SELECT id FROM job_events WHERE job_id=? AND id>? LIMIT 1`)
              .get(jobId, lastEventId) as any;
            if (!more) break;
          }
        }

        // keepalive
        send(": keepalive\n\n");
        await new Promise((r) => setTimeout(r, 800));
      }

      controller.close();
    },
    cancel() {
      cancelled = true;
    }
  });

  return new Response(stream, { headers: sseHeaders() });
});

jobsRoutes.post("/jobs/:id/retry", (c) => {
  const env = c.get("env");
  const adminKey = env.CHEWBER_ADMIN_KEY;
  const headerKey = c.req.header("X-Admin-Key");
  if (!adminKey || headerKey !== adminKey) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const id = c.req.param("id");
  const job = getJob(id);
  if (!job) return c.json({ error: "Not found" }, 404);
  if (job.status !== "failed") return c.json({ error: "Only failed jobs can be retried" }, 400);

  // Reset to queued so the worker picks it up again
  updateJob(id, {
    status: "queued",
    progress: 0,
    error: null,
    started_at: null,
    finished_at: null
  });

  // Clear old events
  const db = c.get("db");
  db.query("DELETE FROM job_events WHERE job_id = ?").run(id);

  return c.json({ ok: true, id });
});
