import { Hono } from "hono";
import { z } from "zod";
import { newId, nowIso } from "../utils/id";
import { fingerprintStructuredQuery } from "../utils/fingerprint";
import { enqueueJob } from "../jobs/queue";

export const resolveRoutes = new Hono();

function loadFoodDetail(db: any, foodId: string) {
  const food = db.query(
    `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at FROM foods WHERE id=?`
  ).get(foodId) as any;
  if (!food) return null;
  const abs = db.query(
    `SELECT score, abstraction_json, report_md, score_breakdown_json FROM food_abstractions WHERE food_id=? AND status='active' ORDER BY version DESC LIMIT 1`
  ).get(foodId) as any;
  return {
    id: food.id,
    slug: food.slug ?? food.id,
    barcode: food.barcode,
    canonical_name: food.canonical_name,
    brand: food.brand,
    category_path: food.category_path,
    tags: JSON.parse(food.tags_json ?? "[]"),
    score: abs?.score ?? null,
    abstraction: abs?.abstraction_json ? JSON.parse(abs.abstraction_json) : null,
    report_md: abs?.report_md ?? null,
    score_breakdown: abs?.score_breakdown_json ? JSON.parse(abs.score_breakdown_json) : null,
    updated_at: food.updated_at
  };
}

const StructuredQuerySchema = z.object({
  barcode: z.string().nullable().optional(),
  name: z.string(),
  brand: z.string().nullable().optional(),
  kind: z.enum(["prepared", "natural", "unknown"]).optional(),
  country: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  isOrganic: z.enum(["yes", "no", "unknown"]).optional(),
  expectedCategory: z.enum(["general_food", "beverage", "added_fat", "cheese", "unknown"]).optional(),
  notes: z.string().nullable().optional(),
  imageIds: z.array(z.string()).optional()
});

const BodySchema = z.object({
  rawText: z.string().optional(),
  imageIds: z.array(z.string()).optional(),
  structured_query: StructuredQuerySchema
});

resolveRoutes.post("/resolve", async (c) => {
  const db = c.get("db");
  const body = BodySchema.parse(await c.req.json());

  const q = body.structured_query;
  const barcode = (q.barcode ?? "").trim();

  // 1) Resolve by barcode first
  if (barcode) {
    const row = db.query(`SELECT id FROM foods WHERE barcode = ? LIMIT 1`).get(barcode) as any;
    if (row?.id) {
      const food = loadFoodDetail(db, row.id);
      if (food) return c.json({ kind: "found", food });
    }
  }

  // 2) Resolve by fingerprint
  const fingerprint = await fingerprintStructuredQuery(q);
  const existingQuery = db
    .query(`SELECT id, food_id, status FROM queries WHERE fingerprint = ? LIMIT 1`)
    .get(fingerprint) as any;

  if (existingQuery?.food_id) {
    db.query(`UPDATE queries SET status='matched', updated_at=? WHERE id=?`).run(nowIso(), existingQuery.id);
    const food = loadFoodDetail(db, existingQuery.food_id);
    if (food) return c.json({ kind: "found", food });
  }

  // 3) Fuzzy match against existing foods by name
  const nameQuery = (q.name ?? "").trim();
  const brandQuery = (q.brand ?? "").trim();
  if (nameQuery) {
    // Try FTS — use OR so partial matches work (e.g. "Nutella Hazelnut Spread" matches "Nutella")
    const allTokens = [...nameQuery.split(/\s+/), ...brandQuery.split(/\s+/)]
      .filter(Boolean)
      .map((t) => t.replace(/[^\p{L}\p{N}_-]/gu, ""))
      .filter((t) => t.length >= 2);
    const fts = allTokens.map((t) => `"${t}"`).join(" OR ");
    if (fts) {
      const candidates = db.query(
        `SELECT f.id, f.canonical_name, f.brand
         FROM foods_fts
         JOIN foods f ON foods_fts.rowid = f.rowid
         WHERE foods_fts MATCH ?
         ORDER BY bm25(foods_fts)
         LIMIT 5`
      ).all(fts) as any[];

      // Score candidates: exact name match (case-insensitive) is best
      const nameLower = nameQuery.toLowerCase();
      const brandLower = brandQuery.toLowerCase();
      for (const cand of candidates) {
        const candName = (cand.canonical_name ?? "").toLowerCase();
        const candBrand = (cand.brand ?? "").toLowerCase();
        const nameMatch = candName === nameLower || candName.includes(nameLower) || nameLower.includes(candName);
        const brandMatch = !brandLower || candBrand.includes(brandLower) || brandLower.includes(candBrand);
        if (nameMatch && brandMatch) {
          // Check it has an active abstraction
          const abs = db.query(
            `SELECT score, abstraction_json, report_md, score_breakdown_json
             FROM food_abstractions WHERE food_id=? AND status='active'
             ORDER BY version DESC LIMIT 1`
          ).get(cand.id) as any;
          if (abs) {
            const food = loadFoodDetail(db, cand.id);
            if (food) return c.json({ kind: "found", food });
          }
        }
      }
    }
  }

  // 4) Otherwise queue a research job (with duplicate-job prevention)
  const queryId = existingQuery?.id ?? newId("qry");
  const ts = nowIso();

  if (!existingQuery) {
    try {
      db.query(
        `INSERT INTO queries (id, raw_text, structured_query_json, fingerprint, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'queued', ?, ?)`
      ).run(
        queryId,
        body.rawText ?? null,
        JSON.stringify({ ...q, imageIds: body.imageIds ?? q.imageIds ?? [] }),
        fingerprint,
        ts,
        ts
      );
    } catch (e: any) {
      // Likely UNIQUE constraint race; fetch the existing row
      const row = db.query(`SELECT id FROM queries WHERE fingerprint = ? LIMIT 1`).get(fingerprint) as any;
      if (row?.id) {
        // Check for an existing active job before enqueuing a new one
        const activeJob = db.query(
          `SELECT id FROM jobs WHERE status IN ('queued','running') AND json_extract(payload_json, '$.query_id') = ? ORDER BY created_at DESC LIMIT 1`
        ).get(row.id) as any;
        if (activeJob?.id) {
          return c.json({ kind: "queued", job_id: activeJob.id, query_id: row.id });
        }
        return c.json({ kind: "queued", job_id: enqueueJob("research_food", { query_id: row.id }), query_id: row.id });
      }
      throw e;
    }
  } else {
    // Check for an existing active job for this query
    const activeJob = db.query(
      `SELECT id FROM jobs WHERE status IN ('queued','running') AND json_extract(payload_json, '$.query_id') = ? ORDER BY created_at DESC LIMIT 1`
    ).get(queryId) as any;
    if (activeJob?.id) {
      return c.json({ kind: "queued", job_id: activeJob.id, query_id: queryId });
    }

    // ensure status is queued
    db.query(`UPDATE queries SET status='queued', updated_at=? WHERE id=?`).run(ts, queryId);
  }

  const jobId = enqueueJob("research_food", {
    query_id: queryId,
    rawText: body.rawText ?? null,
    structured_query: { ...q, imageIds: body.imageIds ?? q.imageIds ?? [] }
  });

  return c.json({ kind: "queued", job_id: jobId, query_id: queryId });
});
