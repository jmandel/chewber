import { Hono } from "hono";
import { getJob } from "../jobs/queue";
import { sseHeaders, formatSseEvent } from "../utils/sse";

export const jobsRoutes = new Hono();

jobsRoutes.get("/jobs/:id", (c) => {
  const id = c.req.param("id");
  const job = getJob(id);
  if (!job) return c.json({ error: "Not found" }, 404);

  return c.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    result_food_id: job.result_food_id,
    error: job.error
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
