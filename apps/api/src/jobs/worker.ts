import { getDb } from "../db";
import { dequeueJob } from "./queue";
import { appendJobEvent } from "./events";
import { processResearchFoodJob } from "./processors/researchFood";

getDb();
console.log("[worker] started");

async function main() {
  while (true) {
    const job = dequeueJob();
    if (!job) {
      await new Promise((r) => setTimeout(r, 800));
      continue;
    }

    appendJobEvent(job.id, "info", `Dequeued job ${job.id} (${job.type})`);

    switch (job.type) {
      case "research_food":
        await processResearchFoodJob({ id: job.id, payload_json: job.payload_json });
        break;
      default:
        appendJobEvent(job.id, "error", `Unknown job type: ${job.type}`);
        break;
    }
  }
}

main().catch((e) => {
  console.error("[worker] fatal:", e);
  process.exit(1);
});
