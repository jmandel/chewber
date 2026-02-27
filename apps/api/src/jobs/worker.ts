import { getDb } from "../db";
import { dequeueJob } from "./queue";
import { appendJobEvent } from "./events";
import { processResearchFoodJob } from "./processors/researchFood";

getDb();

const CONCURRENCY = Number(process.env.CHEWBER_WORKER_CONCURRENCY ?? 3);
const POLL_MS = 400;

console.log(`[worker] started (concurrency=${CONCURRENCY})`);

let active = 0;

async function runJob(job: { id: string; type: string; payload_json: string }) {
  active++;
  try {
    appendJobEvent(job.id, "info", `Dequeued job ${job.id} (${job.type})`);
    switch (job.type) {
      case "research_food":
        await processResearchFoodJob({ id: job.id, payload_json: job.payload_json });
        break;
      default:
        appendJobEvent(job.id, "error", `Unknown job type: ${job.type}`);
        break;
    }
  } catch (e: any) {
    console.error(`[worker] job ${job.id} uncaught:`, e?.message ?? e);
  } finally {
    active--;
  }
}

async function main() {
  while (true) {
    // Fill up to CONCURRENCY slots
    while (active < CONCURRENCY) {
      const job = dequeueJob();
      if (!job) break;
      // Fire and forget — runs concurrently
      runJob(job);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

main().catch((e) => {
  console.error("[worker] fatal:", e);
  process.exit(1);
});
