import { Hono } from "hono";
import { z } from "zod";
import { lookupAdditiveRisk } from "../scoring/additives";

export const foodsRoutes = new Hono();

/** Resolve tags to only those in the categories registry, with display names. */
function resolveCategories(db: any, tags: string[]): { slug: string; display_name: string }[] {
  if (tags.length === 0) return [];
  const placeholders = tags.map(() => "?").join(",");
  return db.query(
    `SELECT slug, display_name FROM categories WHERE slug IN (${placeholders}) ORDER BY display_name`
  ).all(...tags) as { slug: string; display_name: string }[];
}

function extractOrganic(abstractionJson: string): string | null {
  try {
    const abs = JSON.parse(abstractionJson);
    return abs?.organic?.is_certified_organic ?? null;
  } catch { return null; }
}

/**
 * Build the food detail JSON, enriching additives with authoritative risk_level
 * from the reference DB. This is the single source of truth — the frontend
 * never derives risk levels.
 */
function buildFoodDetail(row: any, abs: any) {
  const abstraction = abs?.abstraction_json ? JSON.parse(abs.abstraction_json) : null;

  if (abstraction?.additives && Array.isArray(abstraction.additives)) {
    for (const a of abstraction.additives) {
      const { risk_level } = a.code ? lookupAdditiveRisk(a.code) : { risk_level: "risk_free" };
      a.risk_level = risk_level;
    }
  }

  // Infer missing nutrition values where logically certain
  if (abstraction?.nutrition_per_100) {
    const n = abstraction.nutrition_per_100;
    if (n.saturated_fat_g == null && n.total_fat_g === 0) n.saturated_fat_g = 0;
  }

  return {
    id: row.id,
    slug: row.slug ?? row.id,
    barcode: row.barcode,
    canonical_name: row.canonical_name,
    brand: row.brand,
    category_path: row.category_path,
    tags: parseTags(row.tags_json),
    score: abs?.score ?? null,
    abstraction,
    report_md: abs?.report_md ?? null,
    score_breakdown: abs?.score_breakdown_json ? JSON.parse(abs.score_breakdown_json) : null,
    updated_at: row.updated_at
  };
}

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

// Better alternatives — higher-scoring foods sharing at least one tag
foodsRoutes.get("/foods/:idOrSlug/better-alternatives", (c) => {
  const db = c.get("db");
  const param = c.req.param("idOrSlug");
  const limit = Math.min(Number(c.req.query("limit") ?? 5), 20);

  // Find the food
  let row = db.query(`SELECT id, tags_json FROM foods WHERE id = ? LIMIT 1`).get(param) as any;
  if (!row) row = db.query(`SELECT id, tags_json FROM foods WHERE slug = ? LIMIT 1`).get(param) as any;
  if (!row) return c.json({ alternatives: [] });

  const tags = parseTags(row.tags_json);
  if (tags.length === 0) return c.json({ alternatives: [] });

  // Get current food's score
  const absRow = db.query(
    `SELECT score FROM food_abstractions WHERE food_id = ? AND status = 'active' ORDER BY version DESC LIMIT 1`
  ).get(row.id) as any;
  const currentScore = absRow?.score ?? null;
  if (currentScore == null) return c.json({ alternatives: [] });

  // Find foods sharing at least one tag with a higher score, ordered by score DESC
  const alternatives = db.query(`
    WITH my_tags(tag) AS (
      SELECT value FROM json_each(?)
    ),
    matches AS (
      SELECT f.id, f.slug, f.canonical_name, f.brand, f.tags_json,
             COUNT(DISTINCT mt.tag) AS shared_count
      FROM foods f, json_each(f.tags_json) jt
      JOIN my_tags mt ON mt.tag = jt.value
      WHERE f.id != ?
      GROUP BY f.id
    )
    SELECT m.*, a.score, a.abstraction_json
    FROM matches m
    JOIN food_abstractions a ON a.food_id = m.id AND a.status = 'active'
    WHERE a.score > ?
    ORDER BY a.score DESC, m.shared_count DESC
    LIMIT ?
  `).all(JSON.stringify(tags), row.id, currentScore, limit) as any[];

  return c.json({
    alternatives: alternatives.map((r: any) => ({
      id: r.id,
      slug: r.slug ?? r.id,
      canonical_name: r.canonical_name,
      brand: r.brand,
      tags: parseTags(r.tags_json),
      score: r.score ?? null,
      organic: r.abstraction_json ? extractOrganic(r.abstraction_json) : null,
    }))
  });
});

// Top rated foods — highest scoring foods across all categories
foodsRoutes.get("/foods/top-rated", (c) => {
  const db = c.get("db");
  const limit = Math.min(Number(c.req.query("limit") ?? 6), 20);

  const rows = db.query(`
    SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at,
           a.score, a.abstraction_json
    FROM foods f
    JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
    WHERE a.score IS NOT NULL
    ORDER BY a.score DESC
    LIMIT ?
  `).all(limit) as any[];

  return c.json({
    foods: rows.map((r: any) => {
      const tags = parseTags(r.tags_json);
      return {
        id: r.id,
        slug: r.slug ?? r.id,
        barcode: r.barcode,
        canonical_name: r.canonical_name,
        brand: r.brand,
        category_path: r.category_path,
        tags,
        categories: resolveCategories(db, tags),
        score: r.score ?? null,
        organic: r.abstraction_json ? extractOrganic(r.abstraction_json) : null,
        updated_at: r.updated_at
      };
    })
  });
});

// Related foods — find others sharing the most tags
foodsRoutes.get("/foods/:idOrSlug/related", (c) => {
  const db = c.get("db");
  const param = c.req.param("idOrSlug");
  const limit = Math.min(Number(c.req.query("limit") ?? 8), 20);

  // Find the food
  let row = db.query(`SELECT id, tags_json FROM foods WHERE id = ? LIMIT 1`).get(param) as any;
  if (!row) row = db.query(`SELECT id, tags_json FROM foods WHERE slug = ? LIMIT 1`).get(param) as any;
  if (!row) return c.json({ related: [] });

  const tags = parseTags(row.tags_json);
  if (tags.length === 0) return c.json({ related: [] });

  // Find all other foods that share at least one tag, rank by overlap count
  // Uses json_each to unnest tags, then counts matches
  const related = db.query(`
    WITH my_tags(tag) AS (
      SELECT value FROM json_each(?)
    ),
    matches AS (
      SELECT f.id, f.slug, f.canonical_name, f.brand, f.tags_json,
             COUNT(DISTINCT mt.tag) AS shared_count
      FROM foods f, json_each(f.tags_json) jt
      JOIN my_tags mt ON mt.tag = jt.value
      WHERE f.id != ?
      GROUP BY f.id
      ORDER BY shared_count DESC, f.updated_at DESC
      LIMIT ?
    )
    SELECT m.*, a.score, a.abstraction_json
    FROM matches m
    LEFT JOIN food_abstractions a ON a.food_id = m.id AND a.status = 'active'
    ORDER BY m.shared_count DESC
  `).all(JSON.stringify(tags), row.id, limit) as any[];

  return c.json({
    related: related.map((r: any) => {
      const foodTags = parseTags(r.tags_json);
      const shared = tags.filter(t => foodTags.includes(t));
      return {
        id: r.id,
        slug: r.slug ?? r.id,
        canonical_name: r.canonical_name,
        brand: r.brand,
        tags: foodTags,
        shared_tags: shared,
        score: r.score ?? null,
        organic: r.abstraction_json ? extractOrganic(r.abstraction_json) : null,
      };
    })
  });
});

foodsRoutes.get("/foods/recent", (c) => {
  const db = c.get("db");
  const limit = Math.min(Number(c.req.query("limit") ?? 10), 50);
  const rows = db.query(
    `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at,
            a.score, a.abstraction_json
     FROM foods f
     LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
     ORDER BY f.updated_at DESC
     LIMIT ?`
  ).all(limit) as any[];

  return c.json({
    foods: rows.map((r: any) => {
      const tags = parseTags(r.tags_json);
      return {
        id: r.id,
        slug: r.slug ?? r.id,
        barcode: r.barcode,
        canonical_name: r.canonical_name,
        brand: r.brand,
        category_path: r.category_path,
        tags,
        categories: resolveCategories(db, tags),
        score: r.score ?? null,
        organic: r.abstraction_json ? extractOrganic(r.abstraction_json) : null,
        updated_at: r.updated_at
      };
    })
  });
});

foodsRoutes.get("/foods/search", (c) => {
  const db = c.get("db");
  const q = (c.req.query("q") ?? "").trim();
  const category = (c.req.query("category") ?? "").trim();
  const tag = (c.req.query("tag") ?? "").trim();
  const sort = (c.req.query("sort") ?? "recent").trim(); // recent | score_desc | score_asc

  const sortByScore = sort === "score_desc" || sort === "score_asc";
  const scoreOrder = sort === "score_asc" ? "ASC" : "DESC";

  let rows: any[] = [];

  if (tag) {
    if (sortByScore) {
      rows = db
        .query(
          `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at
           FROM foods f
           LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
           WHERE EXISTS (SELECT 1 FROM json_each(f.tags_json) WHERE value = ?)
           ORDER BY CASE WHEN a.score IS NULL THEN 1 ELSE 0 END, a.score ${scoreOrder}, f.updated_at DESC
           LIMIT 50`
        )
        .all(tag) as any[];
    } else {
      rows = db
        .query(
          `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
           FROM foods
           WHERE EXISTS (SELECT 1 FROM json_each(foods.tags_json) WHERE value = ?)
           ORDER BY updated_at DESC
           LIMIT 50`
        )
        .all(tag) as any[];
    }
  } else if (category) {
    if (sortByScore) {
      rows = db
        .query(
          `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at
           FROM foods f
           LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
           WHERE f.category_path = ?
           ORDER BY CASE WHEN a.score IS NULL THEN 1 ELSE 0 END, a.score ${scoreOrder}, f.updated_at DESC
           LIMIT 50`
        )
        .all(category) as any[];
    } else {
      rows = db
        .query(
          `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
           FROM foods
           WHERE category_path = ?
           ORDER BY updated_at DESC
           LIMIT 50`
        )
        .all(category) as any[];
    }
  } else if (!q) {
    if (sortByScore) {
      rows = db
        .query(
          `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at
           FROM foods f
           LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
           ORDER BY CASE WHEN a.score IS NULL THEN 1 ELSE 0 END, a.score ${scoreOrder}, f.updated_at DESC
           LIMIT 50`
        )
        .all() as any[];
    } else {
      rows = db
        .query(
          `SELECT id, slug, barcode, canonical_name, brand, category_path, tags_json, updated_at
           FROM foods
           ORDER BY updated_at DESC
           LIMIT 50`
        )
        .all() as any[];
    }
  } else {
    // Simple token prefix search for FTS5.
    const tokens = q
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => t.replace(/[^\p{L}\p{N}_-]/gu, "")) // letters + numbers
      .filter(Boolean)
      .map((t) => `${t}*`);
    const fts = tokens.join(" ");

    if (sortByScore) {
      rows = db
        .query(
          `SELECT f.id, f.slug, f.barcode, f.canonical_name, f.brand, f.category_path, f.tags_json, f.updated_at
           FROM foods_fts
           JOIN foods f ON foods_fts.rowid = f.rowid
           LEFT JOIN food_abstractions a ON a.food_id = f.id AND a.status = 'active'
           WHERE foods_fts MATCH ?
           ORDER BY CASE WHEN a.score IS NULL THEN 1 ELSE 0 END, a.score ${scoreOrder}, f.updated_at DESC
           LIMIT 50`
        )
        .all(fts) as any[];
    } else {
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
  }

  // Attach score if available
  const stmtAbs = db.query(
    `SELECT score, abstraction_json FROM food_abstractions WHERE food_id = ? AND status='active' ORDER BY version DESC LIMIT 1`
  );

  const foods = rows.map((r) => {
    const absRow = stmtAbs.get(r.id) as any;
    const organic = absRow?.abstraction_json ? extractOrganic(absRow.abstraction_json) : null;
    const tags = parseTags(r.tags_json);
    return {
      id: r.id,
      slug: r.slug ?? r.id,
      barcode: r.barcode,
      canonical_name: r.canonical_name,
      brand: r.brand,
      category_path: r.category_path,
      tags,
      categories: resolveCategories(db, tags),
      score: absRow?.score ?? null,
      organic
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

  return c.json(buildFoodDetail(row, abs));
});

foodsRoutes.delete("/foods/:idOrSlug", (c) => {
  const env = c.get("env");
  const adminKey = env.CHEWBER_ADMIN_KEY;
  const headerKey = c.req.header("X-Admin-Key");
  if (!adminKey || headerKey !== adminKey) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const db = c.get("db");
  const param = c.req.param("idOrSlug");

  let row = db.query(`SELECT id FROM foods WHERE id = ? LIMIT 1`).get(param) as any;
  if (!row) row = db.query(`SELECT id FROM foods WHERE slug = ? LIMIT 1`).get(param) as any;
  if (!row) return c.json({ error: "Not found" }, 404);

  const foodId = row.id;
  db.query(`DELETE FROM food_abstractions WHERE food_id = ?`).run(foodId);
  db.query(`DELETE FROM jobs WHERE result_food_id = ?`).run(foodId);
  db.query(`DELETE FROM foods WHERE id = ?`).run(foodId);

  return c.json({ ok: true });
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

  return c.json(buildFoodDetail(row, abs));
});

foodsRoutes.get("/categories", (c) => {
  const db = c.get("db");
  // Return from the categories registry, with usage counts
  const rows = db.query(`
    SELECT c.slug, c.display_name, c.description,
           COUNT(DISTINCT f.id) AS food_count
    FROM categories c
    LEFT JOIN foods f ON EXISTS (
      SELECT 1 FROM json_each(f.tags_json) WHERE value = c.slug
    )
    GROUP BY c.slug
    ORDER BY food_count DESC, c.display_name ASC
  `).all() as any[];
  return c.json({
    categories: rows.map((r: any) => ({
      slug: r.slug,
      display_name: r.display_name,
      description: r.description,
      food_count: r.food_count
    }))
  });
});

foodsRoutes.get("/tags", (c) => {
  const db = c.get("db");
  // All tags currently in use across foods
  const rows = db.query(`SELECT tags_json FROM foods`).all() as any[];
  const counts = new Map<string, number>();
  for (const r of rows) {
    for (const t of parseTags((r as any).tags_json)) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  // Enrich with display names from category registry
  const catRows = db.query(`SELECT slug, display_name FROM categories`).all() as any[];
  const catMap = new Map(catRows.map((r: any) => [r.slug, r.display_name]));

  const tags = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([slug, count]) => ({
      slug,
      display_name: catMap.get(slug) ?? slug,
      count
    }));

  return c.json({ tags });
});
