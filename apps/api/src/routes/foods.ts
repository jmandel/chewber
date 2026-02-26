import { Hono } from "hono";
import { z } from "zod";

export const foodsRoutes = new Hono();

function parseTags(tagsJson: string | null): string[] {
  if (!tagsJson) return [];
  try {
    const v = JSON.parse(tagsJson);
    if (Array.isArray(v)) return v.map(String);
  } catch {
    // ignore
  }
  return [];
}

// NOTE: literal routes MUST be registered BEFORE /foods/:id

foodsRoutes.get("/foods/recent", (c) => {
  const db = c.get("db");
  const limit = Math.min(Number(c.req.query("limit") ?? 10), 50);
  const rows = db.query(
    `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at,
            a.score
     FROM foods f
     LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
     ORDER BY f.updated_at DESC
     LIMIT ?`
  ).all(limit) as any[];

  return c.json({
    foods: rows.map((r: any) => ({
      id: r.id,
      slug: r.slug ?? r.id,
      barcode: r.barcode,
      canonical_name: r.canonical_name,
      brand: r.brand,
      category_path: r.category_path,
      tags: parseTags(r.tags_json),
      score: r.score ?? null,
      updated_at: r.updated_at
    }))
  });
});

foodsRoutes.get("/foods/search", (c) => {
  const db = c.get("db");
  const q = (c.req.query("q") ?? "").trim();
  const category = (c.req.query("category") ?? "").trim();
  const tag = (c.req.query("tag") ?? "").trim();

  let rows: any[] = [];

  if (tag) {
    rows = db
      .query(
        `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
         FROM foods
         WHERE EXISTS (SELECT 1 FROM json_each(foods.tags_json) WHERE value = ?)
         ORDER BY updated_at DESC
         LIMIT 50`
      )
      .all(tag) as any[];
  } else if (category) {
    rows = db
      .query(
        `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
         FROM foods
         WHERE category_path = ?
         ORDER BY updated_at DESC
         LIMIT 50`
      )
      .all(category) as any[];
  } else if (!q) {
    rows = db
      .query(
        `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
         FROM foods
         ORDER BY updated_at DESC
         LIMIT 50`
      )
      .all() as any[];
  } else {
    // Simple token prefix search for FTS5.
    const tokens = q
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[^\p{L}\p{N}_-]/gu, "")) // letters + numbers
      .filter(Boolean)
      .map((t) => `${t}*`);
    const fts = tokens.join(" ");

    rows = db
      .query(
        `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at
         FROM foods_fts
         JOIN foods f ON foods_fts.rowid = f.rowid
         WHERE foods_fts MATCH ?
         ORDER BY bm25(foods_fts)
         LIMIT 50`
      )
      .all(fts) as any[];
  }

  // Attach score if available
  const stmtScore = db.query(
    `SELECT score FROM food_abstractions WHERE food_id = ? AND status='active' ORDER BY version DESC LIMIT 1`
  );

  const foods = rows.map((r) => {
    const scoreRow = stmtScore.get(r.id) as any;
    return {
      id: r.id,
      slug: r.slug ?? r.id,
      barcode: r.barcode,
      canonical_name: r.canonical_name,
      brand: r.brand,
      category_path: r.category_path,
      tags: parseTags(r.tags_json),
      score: scoreRow?.score ?? null
    };
  });

  return c.json({ foods });
});

foodsRoutes.get("/foods/by-barcode/:barcode", (c) => {
  const db = c.get("db");
  const barcode = c.req.param("barcode");
  const row = db
    .query(
      `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
       FROM foods WHERE barcode = ? LIMIT 1`
    )
    .get(barcode) as any;

  if (!row) return c.json({ error: "Not found" }, 404);

  const abs = db
    .query(
      `SELECT score, abstraction_json, report_md, score_breakdown_json
       FROM food_abstractions WHERE food_id = ? AND status='active'
       ORDER BY version DESC LIMIT 1`
    )
    .get(row.id) as any;

  return c.json({
    id: row.id,
    slug: row.slug ?? row.id,
    barcode: row.barcode,
    canonical_name: row.canonical_name,
    brand: row.brand,
    category_path: row.category_path,
    tags: parseTags(row.tags_json),
    score: abs?.score ?? null,
    abstraction: abs?.abstraction_json ? JSON.parse(abs.abstraction_json) : null,
    report_md: abs?.report_md ?? null,
    score_breakdown: abs?.score_breakdown_json ? JSON.parse(abs.score_breakdown_json) : null,
    updated_at: row.updated_at
  });
});

foodsRoutes.get("/foods/:idOrSlug", (c) => {
  const db = c.get("db");
  const param = c.req.param("idOrSlug");

  // Try by ID first, then by slug
  let row = db
    .query(
      `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
       FROM foods WHERE id = ? LIMIT 1`
    )
    .get(param) as any;

  if (!row) {
    row = db
      .query(
        `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
         FROM foods WHERE slug = ? LIMIT 1`
      )
      .get(param) as any;
  }

  if (!row) return c.json({ error: "Not found" }, 404);

  const abs = db
    .query(
      `SELECT score, abstraction_json, report_md, score_breakdown_json
       FROM food_abstractions WHERE food_id = ? AND status='active'
       ORDER BY version DESC LIMIT 1`
    )
    .get(row.id) as any;

  return c.json({
    id: row.id,
    slug: row.slug ?? row.id,
    barcode: row.barcode,
    canonical_name: row.canonical_name,
    brand: row.brand,
    category_path: row.category_path,
    tags: parseTags(row.tags_json),
    score: abs?.score ?? null,
    abstraction: abs?.abstraction_json ? JSON.parse(abs.abstraction_json) : null,
    report_md: abs?.report_md ?? null,
    score_breakdown: abs?.score_breakdown_json ? JSON.parse(abs.score_breakdown_json) : null,
    updated_at: row.updated_at
  });
});

foodsRoutes.get("/categories", (c) => {
  const db = c.get("db");
  const rows = db
    .query(`SELECT DISTINCT category_path FROM foods WHERE category_path IS NOT NULL AND category_path != '' ORDER BY category_path ASC`)
    .all() as any[];
  return c.json({ categories: rows.map((r: any) => r.category_path) });
});

foodsRoutes.get("/tags", (c) => {
  const db = c.get("db");
  const rows = db.query(`SELECT tags_json FROM foods`).all() as any[];
  const set = new Set<string>();
  for (const r of rows) {
    for (const t of parseTags((r as any).tags_json)) set.add(t);
  }
  return c.json({ tags: Array.from(set).sort() });
});
