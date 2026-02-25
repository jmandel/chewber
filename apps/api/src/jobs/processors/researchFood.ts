import { z } from "zod";
import { getDb } from "../../db";
import { appendJobEvent } from "../events";
import { updateJob } from "../queue";
import { nowIso, newId } from "../../utils/id";
import { runResearchAgent } from "../../agents/researchAgent";
import { reportToJson } from "../../agents/jsonStage";
import { FoodAbstractionSchema, type FoodAbstraction, toScoreInputs } from "../../scoring/abstraction";
import { scoreFood } from "../../scoring/score";

const PayloadSchema = z.object({
  query_id: z.string(),
  rawText: z.string().nullable().optional(),
  structured_query: z.record(z.any())
});

export async function processResearchFoodJob(job: { id: string; payload_json: string }) {
  const db = getDb();

  const payload = PayloadSchema.parse(JSON.parse(job.payload_json));

  const emit = (evt: { level: "debug" | "info" | "tool" | "warn" | "error"; message: string; data?: any }) => {
    appendJobEvent(job.id, evt.level, evt.message, evt.data);
  };

  try {
    emit({ level: "info", message: "Starting research pipeline…" });
    updateJob(job.id, { progress: 5 });

    // Stage A: research report
    const reportMd = await runResearchAgent(
      {
        structured_query: payload.structured_query,
        rawText: payload.rawText ?? null,
        imageNotes: null
      },
      emit
    );

    updateJob(job.id, { progress: 55 });
    emit({ level: "info", message: "Converting report to structured JSON…" });

    // Stage B: report -> JSON
    const absRaw = await reportToJson(reportMd);

    let abs: FoodAbstraction;
    try {
      abs = FoodAbstractionSchema.parse(absRaw);
    } catch (e: any) {
      emit({ level: "error", message: "Abstraction JSON failed schema validation", data: { error: String(e?.message ?? e) } });
      throw new Error("Abstraction JSON failed validation");
    }

    updateJob(job.id, { progress: 75 });
    emit({ level: "info", message: "Computing score…" });

    // Stage C: deterministic scoring
    const scoreInputs = toScoreInputs(abs);
    const { score, breakdown } = scoreFood({
      ...scoreInputs,
      is_certified_organic: abs.organic.is_certified_organic
    });

    updateJob(job.id, { progress: 85 });

    // Persist
    const foodId = upsertFood(abs, payload.structured_query);
    upsertAbstraction(foodId, payload, reportMd, abs, score, breakdown);

    // Link query -> food
    db.query(`UPDATE queries SET food_id=?, status='completed', updated_at=? WHERE id=?`).run(foodId, nowIso(), payload.query_id);

    updateJob(job.id, { status: "succeeded", progress: 100, result_food_id: foodId, finished_at: nowIso() });
    emit({ level: "info", message: "Done.", data: { food_id: foodId, score } });
  } catch (e: any) {
    const err = String(e?.message ?? e);
    updateJob(job.id, { status: "failed", error: err, finished_at: nowIso(), progress: 100 });
    appendJobEvent(job.id, "error", "Job failed", { error: err });
  }
}

function upsertFood(abs: FoodAbstraction, structured_query: any): string {
  const db = getDb();
  const barcode = (abs.identification.barcode ?? structured_query?.barcode ?? null)?.toString().trim() || null;

  // Try barcode match first
  if (barcode) {
    const row = db.query(`SELECT id FROM foods WHERE barcode = ? LIMIT 1`).get(barcode) as any;
    if (row?.id) {
      // update basic fields
      db.query(
        `UPDATE foods SET canonical_name=?, brand=?, kind=?, updated_at=? WHERE id=?`
      ).run(
        abs.identification.canonical_name,
        abs.identification.brand,
        abs.identification.kind === "unknown" ? (structured_query?.kind ?? "unknown") : abs.identification.kind,
        nowIso(),
        row.id
      );
      return row.id as string;
    }
  }

  const id = newId("food");
  const ts = nowIso();

  db.query(
    `INSERT INTO foods (id, barcode, canonical_name, brand, kind, category_path, tags_json, source_hint, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    barcode,
    abs.identification.canonical_name,
    abs.identification.brand,
    abs.identification.kind === "unknown" ? (structured_query?.kind ?? "unknown") : abs.identification.kind,
    null,
    "[]",
    "agent",
    ts,
    ts
  );

  return id;
}

function upsertAbstraction(
  foodId: string,
  payload: any,
  reportMd: string,
  abs: FoodAbstraction,
  score: number | null,
  breakdown: any
) {
  const db = getDb();

  // Archive previous active abstractions
  db.query(`UPDATE food_abstractions SET status='archived', updated_at=? WHERE food_id=? AND status='active'`).run(
    nowIso(),
    foodId
  );

  const maxRow = db.query(`SELECT MAX(version) as v FROM food_abstractions WHERE food_id=?`).get(foodId) as any;
  const nextVersion = (maxRow?.v ?? 0) + 1;

  db.query(
    `INSERT INTO food_abstractions
      (id, food_id, version, status, query_payload_json, report_md, abstraction_json, score, score_breakdown_json, created_at, updated_at)
     VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    newId("abs"),
    foodId,
    nextVersion,
    JSON.stringify(payload),
    reportMd,
    JSON.stringify(abs),
    score,
    JSON.stringify(breakdown),
    nowIso(),
    nowIso()
  );

  // Also update foods.updated_at for easy sorting
  db.query(`UPDATE foods SET updated_at=? WHERE id=?`).run(nowIso(), foodId);
}
