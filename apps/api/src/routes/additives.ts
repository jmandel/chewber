import { Hono } from "hono";
import { getReferenceDb } from "../db/referenceDb";
import { getDb } from "../db";
import { getAdditiveResearch, getResearchCodes } from "../sources/additiveResearch";
import { normalizeAdditiveCode } from "../scoring/additives";

export const additivesRoutes = new Hono();

type AdditiveRiskRow = {
  code: string;
  name: string | null;
  risk_level: string;
  updated_at: string;
  function_category: string | null;
  description: string | null;
  justification: string | null;
};

/**
 * GET /api/additives
 *
 * List all known additives with risk levels from the reference DB.
 * Optionally filter by risk_level query param.
 * Also indicates which additives have research reports available.
 */
additivesRoutes.get("/additives", (c) => {
  const db = getReferenceDb();
  const riskFilter = c.req.query("risk_level");

  let rows: AdditiveRiskRow[];
  if (riskFilter) {
    rows = db
      .query(
        `SELECT code, name, risk_level, updated_at, function_category, description, justification
         FROM additive_risks
         WHERE risk_level = ?
         ORDER BY code`
      )
      .all(riskFilter) as AdditiveRiskRow[];
  } else {
    rows = db
      .query(
        `SELECT code, name, risk_level, updated_at, function_category, description, justification
         FROM additive_risks
         ORDER BY code`
      )
      .all() as AdditiveRiskRow[];
  }

  const researchCodes = new Set(getResearchCodes());

  const body = {
    count: rows.length,
    additives: rows.map((r) => ({
      code: r.code,
      name: r.name,
      risk_level: r.risk_level,
      function_category: r.function_category ?? null,
      description: r.description ?? null,
      has_research: researchCodes.has(r.code.toUpperCase()),
      updated_at: r.updated_at,
    })),
  };

  const etag = `"${Bun.hash(JSON.stringify(body)).toString(36)}"`;
  if (c.req.header("If-None-Match") === etag) {
    return c.body(null, 304);
  }
  c.header("ETag", etag);
  c.header("Cache-Control", "no-cache");
  return c.json(body);
});

/**
 * GET /api/additives/:code
 *
 * Returns full detail for a single additive:
 *   - risk_level, name, description, justification from DB
 *   - research report markdown (if available)
 *   - research abstraction JSON (if available)
 */
additivesRoutes.get("/additives/:code", (c) => {
  const rawCode = c.req.param("code");
  const code = normalizeAdditiveCode(rawCode);

  const db = getReferenceDb();

  // Look up in additive_risks (exact, then base-code fallback)
  let row = db
    .query(
      `SELECT code, name, risk_level, updated_at, function_category, description, justification
       FROM additive_risks
       WHERE code = ? COLLATE NOCASE
       LIMIT 1`
    )
    .get(code) as AdditiveRiskRow | null;

  // Base-code fallback (E150D → E150)
  if (!row) {
    const baseMatch = code.match(/^(E\d+)[A-Z]$/i);
    if (baseMatch) {
      row = db
        .query(
          `SELECT code, name, risk_level, updated_at, function_category, description, justification
           FROM additive_risks
           WHERE code = ? COLLATE NOCASE
           LIMIT 1`
        )
        .get(baseMatch[1]) as AdditiveRiskRow | null;
    }
  }

  // Look up research (keyed by the normalized code)
  const research = getAdditiveResearch(code);

  // If we have neither DB entry nor research, 404
  if (!row && !research) {
    return c.json({ error: `Additive ${code} not found` }, 404);
  }

  return c.json({
    code: row?.code ?? code,
    name: row?.name ?? null,
    risk_level: row?.risk_level ?? null,
    function_category: row?.function_category ?? null,
    description: row?.description ?? null,
    justification: row?.justification ?? null,
    updated_at: row?.updated_at ?? null,
    research: research
      ? {
          report_md: research.reportMd,
          abstraction: research.abstraction,
        }
      : null,
  });
});

/**
 * GET /api/additives/:code/foods
 *
 * Returns foods whose abstraction JSON contains this additive.
 * Searches the `additives` array in abstraction_json for matching codes.
 * Returns up to 20 most recently updated foods.
 */
additivesRoutes.get("/additives/:code/foods", (c) => {
  const rawCode = c.req.param("code");
  const code = normalizeAdditiveCode(rawCode);

  // Also compute base code for variant matching (E150D → E150)
  const baseMatch = code.match(/^(E\d+)[A-Z]$/i);
  const baseCode = baseMatch ? baseMatch[1] : null;

  const db = getDb();

  // Use json_each to search through the additives array in abstraction_json.
  // We normalize the stored codes (which may be "en:e322-lecithins" format)
  // by stripping the "en:" prefix and splitting on "-", then uppercasing.
  const rows = db
    .query(
      `SELECT DISTINCT f.id, f.slug, f.canonical_name, f.brand, f.category_path,
              f.tags_json, fa.score, fa.updated_at
       FROM food_abstractions fa
       JOIN foods f ON f.id = fa.food_id
       JOIN json_each(json_extract(fa.abstraction_json, '$.additives')) AS je
       WHERE fa.status = 'active'
         AND fa.abstraction_json IS NOT NULL
         AND (
           UPPER(REPLACE(REPLACE(
             CASE WHEN json_extract(je.value, '$.code') LIKE 'en:%'
               THEN SUBSTR(json_extract(je.value, '$.code'), 4)
               ELSE json_extract(je.value, '$.code')
             END, '-', ''), ' ', '')) LIKE ?
           OR UPPER(REPLACE(REPLACE(
             CASE WHEN json_extract(je.value, '$.code') LIKE 'en:%'
               THEN SUBSTR(json_extract(je.value, '$.code'), 4)
               ELSE json_extract(je.value, '$.code')
             END, '-', ''), ' ', '')) LIKE ?
         )
       ORDER BY fa.updated_at DESC
       LIMIT 20`
    )
    .all(code + "%", (baseCode ?? code) + "%") as any[];

  return c.json({
    code,
    count: rows.length,
    foods: rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      canonical_name: r.canonical_name,
      brand: r.brand ?? null,
      category_path: r.category_path ?? null,
      tags: JSON.parse(r.tags_json || "[]"),
      score: r.score ?? null,
      updated_at: r.updated_at,
    })),
  });
});
