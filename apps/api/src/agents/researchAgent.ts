import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { getLlm } from "./llm/client";
import { localOffBarcodeLookup, localOffSearchText } from "../sources/localOff";
import { localUsdaBarcodeLookup, localUsdaSearchText } from "../sources/localUsda";
import { webSearch, webOpen } from "../sources/web";


import { toGeminiSchema } from "./llm/schemaTransform";

const prompt = readFileSync(resolve(import.meta.dir, "./prompts/research_report.md"), "utf-8");
const stepSchemaRaw = JSON.parse(readFileSync(resolve(import.meta.dir, "../schemas/research_step.schema.json"), "utf-8"));
const stepSchema = toGeminiSchema(stepSchemaRaw);

const ToolCallSchema = z.object({
  tool: z.string(),
  args: z.record(z.any())
});

const StepSchema = z.object({
  tool_calls: z.array(ToolCallSchema),
  final_markdown: z.string().nullable(),
  not_found_reason: z.string().nullable().optional(),
  data_conflict_reason: z.string().nullable().optional(),
  notes: z.string()
});

export type ResearchInput = {
  structured_query: any;
  rawText?: string | null;
  imageNotes?: string | null;
};

export type EmitFn = (evt: { level: "debug" | "info" | "tool" | "warn" | "error"; message: string; data?: any }) => void;

/**
 * Structured observations accumulated from tool calls during research.
 * Passed to post-LLM enrichment so we don't need to re-fetch anything.
 */
/** Per-100g nutrition values keyed by field name (e.g. "protein_g", "total_fat_g"). */
export type NutritionRecord = Partial<Record<string, number>>;

/** Nutrition values grouped by source (tool + identifier). */
export type NutritionBySource = Map<string, NutritionRecord>;

export type ToolObservations = {
  /** Raw OFF additive tags seen across all tool calls (e.g. ["en:e330", "en:e322i"]) */
  offAdditiveTags: string[];
  /** All ingredient texts encountered (from OFF, USDA, web — whatever the agent found) */
  ingredientTexts: string[];
  /** Organic-related label tags from OFF (e.g. ["en:organic", "en:usda-organic"]) */
  organicLabels: string[];
  /** Nutrition values per source for cross-source consistency checking */
  nutritionBySource: NutritionBySource;
};

export type ResearchResult = {
  markdown: string;
  observations: ToolObservations;
  not_found_reason?: string;
  data_conflict_reason?: string;
};

// ── Circuit-breaker constants ──────────────────────────────────────
const MAX_STEPS = 10;
const MAX_CONSECUTIVE_ERRORS = 3;
const MAX_TOTAL_TOOL_CALLS = 30;

/**
 * Try to parse JSON, with repair for common LLM truncation patterns.
 */
function tryParseJson(text: string): any {
  try { return JSON.parse(text); } catch {}

  if (text.startsWith("{")) {
    // Extract tool_calls array even from truncated response
    const toolCallsMatch = text.match(/"tool_calls"\s*:\s*(\[.*?\])/s);
    if (toolCallsMatch) {
      try {
        const toolCalls = JSON.parse(toolCallsMatch[1]);
        return {
          tool_calls: toolCalls,
          final_markdown: null,
          notes: "(response was truncated, extracted tool_calls)"
        };
      } catch {}
    }

    // Extract final_markdown from truncated response
    const finalMdMatch = text.match(/"final_markdown"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (finalMdMatch) {
      try {
        const md = JSON.parse('"' + finalMdMatch[1] + '"');
        if (md.length > 100) {
          return { tool_calls: [], final_markdown: md, notes: "(extracted from truncated response)" };
        }
      } catch {}
    }
  }

  throw new Error(`Invalid JSON (${text.length} chars)`);
}

function truncate(val: any, maxChars = 12000): any {
  const s = JSON.stringify(val);
  if (s.length <= maxChars) return val;
  return { truncated: true, preview: s.slice(0, maxChars) + "…", size: s.length };
}

/** Format the key argument of a tool call for inline display */
function formatToolQuery(tool: string, args: Record<string, any>): string {
  switch (tool) {
    case "web.search":
    case "local.search":
    case "local.usda_search":
      return args.query ? `: "${args.query}"` : "";
    case "web.open":
      return args.url ? `: ${args.url}` : "";
    case "local.barcode_lookup":
    case "local.usda_barcode":
      return args.barcode ? `: ${args.barcode}` : "";
    default:
      return "";
  }
}

/** Format a short result summary for inline display */
function formatToolResult(tool: string, result: any): string {
  if (!result) return "ok";
  switch (tool) {
    case "web.search":
      if (Array.isArray(result?.results)) return `${result.results.length} results`;
      if (typeof result?.count === "number") return `${result.count} results`;
      return "ok";
    case "local.search":
    case "local.usda_search":
      if (typeof result?.count === "number") return `${result.count} match${result.count === 1 ? "" : "es"}`;
      return "ok";
    case "local.usda_barcode":
      if (result?.found === false) return "not found";
      if (typeof result?.count === "number") return `${result.count} match${result.count === 1 ? "" : "es"}`;
      return result?.description ? `found: ${result.description}` : "found";
    case "local.barcode_lookup":
      if (result?.found === false) return "not found";
      return result?.product_name ? `found: ${result.product_name}` : "found";
    case "web.open":
      if (typeof result === "string") return `${result.length} chars`;
      if (result?.text) return `${result.text.length} chars`;
      return "ok";
    default:
      return "ok";
  }
}

export async function runResearchAgent(input: ResearchInput, emit: EmitFn): Promise<ResearchResult> {
  const llm = getLlm("research");
  const observations: ToolObservations = { offAdditiveTags: [], ingredientTexts: [], organicLabels: [], nutritionBySource: new Map() };

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: prompt },
    {
      role: "user",
      content: JSON.stringify(
        {
          query: input.structured_query,
          rawText: input.rawText ?? null,
          imageNotes: input.imageNotes ?? null
        },
        null,
        2
      )
    }
  ];

  let consecutiveErrors = 0;
  let totalToolCalls = 0;

  for (let step = 0; step < MAX_STEPS; step++) {
    emit({ level: "info", message: `Research step ${step + 1}/${MAX_STEPS} (tools: ${totalToolCalls})` });

    let text: string;
    try {
      const resp = await llm.chat({
        messages,
        temperature: 0.2,
        jsonSchema: { name: "research_step", schema: stepSchema },
        maxTokens: 4096
      });
      text = resp.text;
    } catch (llmErr: any) {
      consecutiveErrors++;
      emit({ level: "error", message: `LLM call failed (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS})`, data: { error: String(llmErr?.message ?? llmErr) } });
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        emit({ level: "error", message: "Max consecutive LLM errors reached, aborting." });
        return { markdown: makeErrorReport("LLM call failures", consecutiveErrors), observations };
      }
      // Add a hint to the conversation so the LLM knows to try again
      messages.push({ role: "user", content: JSON.stringify({ error: "LLM call failed, please try again with a simpler response." }) });
      continue;
    }

    let parsed: any;
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }
      parsed = tryParseJson(cleaned);
    } catch (parseErr: any) {
      consecutiveErrors++;
      emit({ level: "error", message: `Non-JSON response (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS})`, data: {
        error: String(parseErr?.message ?? parseErr),
        textLength: text.length,
        textStart: text.slice(0, 300),
        textEnd: text.slice(-200)
      }});

      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        emit({ level: "error", message: "Max consecutive parse errors reached, aborting." });
        return { markdown: makeErrorReport("JSON parse failures", consecutiveErrors), observations };
      }

      // Push the bad response + error hint so the model can self-correct
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: JSON.stringify({
        error: "Your response was not valid JSON. You MUST respond with a single JSON object: {\"tool_calls\": [...], \"final_markdown\": null} or {\"tool_calls\": [], \"final_markdown\": \"...\"}. No markdown fences, no commentary."
      }) });
      continue;
    }

    // Successful parse resets consecutive error counter
    consecutiveErrors = 0;

    let obj: z.infer<typeof StepSchema>;
    try {
      obj = StepSchema.parse(parsed);
    } catch (schemaErr: any) {
      emit({ level: "warn", message: "Response parsed as JSON but failed schema validation; treating as error step.", data: { parsed } });
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: JSON.stringify({
        error: "Your JSON was valid but did not match the required schema. Required: {tool_calls: [{tool, args}], final_markdown: string|null}"
      }) });
      consecutiveErrors++;
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        return { markdown: makeErrorReport("schema validation failures", consecutiveErrors), observations };
      }
      continue;
    }

    if (obj.not_found_reason) {
      emit({ level: "warn", message: `Product not found: ${obj.not_found_reason}` });
      return { markdown: "", observations, not_found_reason: obj.not_found_reason };
    }

    if (obj.data_conflict_reason) {
      emit({ level: "warn", message: `Data conflict: ${obj.data_conflict_reason}` });
      return { markdown: "", observations, data_conflict_reason: obj.data_conflict_reason };
    }

    if (obj.final_markdown) {
      emit({ level: "info", message: "Research agent produced final report." });
      return { markdown: obj.final_markdown, observations };
    }

    if (!obj.tool_calls.length) {
      emit({ level: "warn", message: "No tools and no final report; asking agent to finish." });
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: JSON.stringify({
        error: "You returned no tool calls and no final_markdown. You MUST either call tools or produce the final report. Please produce your final_markdown now with whatever data you have."
      }) });
      continue;
    }

    // Check tool call budget
    if (totalToolCalls + obj.tool_calls.length > MAX_TOTAL_TOOL_CALLS) {
      emit({ level: "warn", message: `Tool call budget exceeded (${totalToolCalls}+${obj.tool_calls.length} > ${MAX_TOTAL_TOOL_CALLS}); forcing report.` });
      messages.push({ role: "assistant", content: text });
      messages.push({ role: "user", content: JSON.stringify({
        error: `Tool call budget exhausted (${MAX_TOTAL_TOOL_CALLS} max). Produce your final_markdown report NOW with whatever data you have gathered.`
      }) });
      continue;
    }

    // Execute tool calls
    const toolResults: any[] = [];
    for (const tc of obj.tool_calls) {
      const queryHint = formatToolQuery(tc.tool, tc.args);
      emit({ level: "tool", message: `${tc.tool}${queryHint}`, data: { args: tc.args } });
      totalToolCalls++;

      try {
        const r = await runTool(tc.tool, tc.args);
        // Accumulate structured observations from raw (un-truncated) result
        collectObservations(observations, tc.tool, r);
        const truncated = truncate(r);
        toolResults.push({ tool: tc.tool, ok: true, result: truncated });
        const resultHint = formatToolResult(tc.tool, truncated);
        emit({ level: "tool", message: `${tc.tool} → ${resultHint}`, data: { result: truncated } });
      } catch (e: any) {
        const err = String(e?.message ?? e);
        toolResults.push({ tool: tc.tool, ok: false, error: err });
        emit({ level: "warn", message: `${tc.tool} → error: ${err}` });
      }
    }

    messages.push({ role: "assistant", content: text });

    // Check cross-source nutrition consistency after each tool batch
    const crossSourceWarning = checkCrossSourceConsistency(observations.nutritionBySource);
    const userPayload: any = { tool_results: toolResults };
    if (crossSourceWarning) {
      userPayload.cross_source_warning = crossSourceWarning;
      emit({ level: "warn", message: "Cross-source nutrition discrepancy detected", data: { warning: crossSourceWarning } });
    }
    messages.push({ role: "user", content: JSON.stringify(userPayload, null, 2) });
  }

  emit({ level: "warn", message: "Max steps reached; returning partial report." });
  return { markdown: makeErrorReport("max steps reached", MAX_STEPS), observations };
}

function makeErrorReport(reason: string, count: number): string {
  return `# ⚠️ Incomplete Research Report

> **Research was cut short** due to ${reason} (count: ${count}).
> Some data may be missing or incomplete.

## 7) Uncertainties & follow-ups
- Missing fields: research was truncated
- Reason: ${reason}
- This result should not be treated as a complete food analysis
`;
}

/**
 * Extract FVPN estimates from OFF nutriments and return as a structured object.
 * OFF computes these algorithmically from ingredient lists — they're consistent
 * and should be used as the baseline for FVPN% estimation.
 */
function extractOffFvpn(nutriments: Record<string, number> | null): {
  fruits_vegetables_nuts_percent: number | null;
  fruits_vegetables_legumes_percent: number | null;
} | null {
  if (!nutriments) return null;
  const fvn = nutriments["fruits-vegetables-nuts-estimate-from-ingredients_100g"];
  const fvl = nutriments["fruits-vegetables-legumes-estimate-from-ingredients_100g"];
  if (fvn == null && fvl == null) return null;
  return {
    fruits_vegetables_nuts_percent: fvn != null ? Math.round(fvn * 10) / 10 : null,
    fruits_vegetables_legumes_percent: fvl != null ? Math.round(fvl * 10) / 10 : null,
  };
}

/**
 * Extract organic-related labels from OFF labels_tags.
 * Input: ["en:organic", "en:usda-organic", "en:no-preservatives"]
 * Output: ["en:organic", "en:usda-organic"]  (only organic-related ones)
 */
function extractOrganicLabels(labels: string[] | null): string[] | null {
  if (!labels || labels.length === 0) return null;
  const organicTags = labels.filter(l =>
    l.includes("organic") || l.includes("bio") || l.includes("usda-organic") || l.includes("eu-organic")
  );
  return organicTags.length > 0 ? organicTags : null;
}

/**
 * Extract and normalize OFF additive tags for the LLM.
 * Input: ["en:e330", "en:e322i-soy-lecithin"]
 * Output: [{ code: "E330", tag: "en:e330" }, { code: "E322I", tag: "en:e322i-soy-lecithin" }]
 */
function extractOffAdditives(tags: string[] | null): { code: string; tag: string }[] | null {
  if (!tags || tags.length === 0) return null;
  return tags.map(tag => {
    let code = tag.trim();
    if (code.startsWith("en:")) code = code.slice(3).split("-")[0];
    code = code.toUpperCase();
    return { code, tag };
  });
}

/**
 * Extract structured observations from a tool result into the accumulator.
 * Runs on the raw (un-truncated) result so no data is lost.
 */
function collectObservations(obs: ToolObservations, tool: string, result: any) {
  if (!result || typeof result !== "object") return;

  // OFF additive tags (from barcode lookup or search results)
  if (result.product?.additives && Array.isArray(result.product.additives)) {
    for (const tag of result.product.additives) {
      if (typeof tag === "string" && !obs.offAdditiveTags.includes(tag)) obs.offAdditiveTags.push(tag);
    }
  }
  if (Array.isArray(result.results)) {
    for (const r of result.results) {
      if (r?.additives && Array.isArray(r.additives)) {
        for (const tag of r.additives) {
          if (typeof tag === "string" && !obs.offAdditiveTags.includes(tag)) obs.offAdditiveTags.push(tag);
        }
      }
      // Ingredient texts from search results
      if (typeof r?.ingredients_text === "string" && r.ingredients_text) {
        if (!obs.ingredientTexts.includes(r.ingredients_text)) obs.ingredientTexts.push(r.ingredients_text);
      }
    }
  }

  // Ingredient text from single product results
  if (typeof result.product?.ingredients_text === "string" && result.product.ingredients_text) {
    if (!obs.ingredientTexts.includes(result.product.ingredients_text)) obs.ingredientTexts.push(result.product.ingredients_text);
  }
  // USDA ingredient text
  if (typeof result.best_match?.ingredients === "string" && result.best_match.ingredients) {
    if (!obs.ingredientTexts.includes(result.best_match.ingredients)) obs.ingredientTexts.push(result.best_match.ingredients);
  }
  if (Array.isArray(result.all_matches)) {
    for (const m of result.all_matches) {
      if (typeof m?.ingredients === "string" && m.ingredients) {
        if (!obs.ingredientTexts.includes(m.ingredients)) obs.ingredientTexts.push(m.ingredients);
      }
    }
  }
  // USDA search results
  if (Array.isArray(result.results)) {
    for (const r of result.results) {
      if (typeof r?.ingredients === "string" && r.ingredients) {
        if (!obs.ingredientTexts.includes(r.ingredients)) obs.ingredientTexts.push(r.ingredients);
      }
    }
  }

  // Organic labels from OFF
  if (result.product?.labels && Array.isArray(result.product.labels)) {
    for (const label of result.product.labels) {
      if (typeof label === "string" && (label.includes("organic") || label.includes("bio"))) {
        if (!obs.organicLabels.includes(label)) obs.organicLabels.push(label);
      }
    }
  }
  if (Array.isArray(result.results)) {
    for (const r of result.results) {
      if (r?.labels && Array.isArray(r.labels)) {
        for (const label of r.labels) {
          if (typeof label === "string" && (label.includes("organic") || label.includes("bio"))) {
            if (!obs.organicLabels.includes(label)) obs.organicLabels.push(label);
          }
        }
      }
    }
  }

  // ── Nutrition by source (for cross-source consistency checking) ──
  const isOff = tool === "local.barcode_lookup" || tool === "local.search";
  const isUsda = tool === "local.usda_barcode" || tool === "local.usda_search";
  const sourceLabel = isOff ? "OFF" : isUsda ? "USDA" : tool;

  // Single-product results (barcode lookups)
  if (result.product?.nutriments && typeof result.product.nutriments === "object") {
    const id = `${sourceLabel}:${result.product.barcode || "unknown"}`;
    const normalized = normalizeNutrition(result.product.nutriments, sourceLabel);
    if (Object.keys(normalized).length > 0 && !obs.nutritionBySource.has(id)) {
      obs.nutritionBySource.set(id, normalized);
    }
  }
  if (result.best_match?.nutriments && typeof result.best_match.nutriments === "object") {
    const id = `${sourceLabel}:${result.best_match.gtin_upc || result.best_match.fdc_id || "unknown"}`;
    const normalized = normalizeNutrition(result.best_match.nutriments, sourceLabel);
    if (Object.keys(normalized).length > 0 && !obs.nutritionBySource.has(id)) {
      obs.nutritionBySource.set(id, normalized);
    }
  }
  // Search results — only take the top/best match to avoid noise
  if (Array.isArray(result.results) && result.results.length > 0) {
    const best = result.results[0];
    if (best?.nutriments && typeof best.nutriments === "object") {
      const id = `${sourceLabel}:${best.barcode || best.gtin_upc || best.fdc_id || "search-0"}`;
      const normalized = normalizeNutrition(best.nutriments, sourceLabel);
      if (Object.keys(normalized).length > 0 && !obs.nutritionBySource.has(id)) {
        obs.nutritionBySource.set(id, normalized);
      }
    }
  }
}

// Fields the research report template lists as REQUIRED in Section 3.
// Used to detect gaps in tool results and hint the agent to fill them.
const REQUIRED_NUTRITION_FIELDS = [
  "energy_kcal", "total_fat_g", "saturated_fat_g", "carbohydrates_g",
  "sugars_g", "fiber_g", "protein_g", "sodium_mg",
];

function findMissingNutrition(nutriments: Record<string, number>): string[] {
  // OFF uses "_100g" suffix; USDA uses bare names. Check both.
  return REQUIRED_NUTRITION_FIELDS.filter(f =>
    nutriments[f] == null && nutriments[`${f}_100g`] == null
  );
}

// ── Cross-source nutrition consistency ─────────────────────────────

/** Canonical field names for cross-source comparison. */
const CANONICAL_NUTRITION_FIELDS = [
  "energy_kcal", "total_fat_g", "saturated_fat_g", "carbohydrates_g",
  "sugars_g", "fiber_g", "protein_g", "sodium_mg",
];

/**
 * OFF nutriment keys use suffixes like "_100g"; USDA uses our canonical names.
 * Map from OFF-style key → canonical field name.
 */
const OFF_KEY_MAP: Record<string, string> = {
  "energy-kcal_100g": "energy_kcal",
  "energy_100g": "energy_kcal",  // sometimes stored as kJ — handle below
  "fat_100g": "total_fat_g",
  "saturated-fat_100g": "saturated_fat_g",
  "carbohydrates_100g": "carbohydrates_g",
  "sugars_100g": "sugars_g",
  "fiber_100g": "fiber_g",
  "proteins_100g": "protein_g",
  "sodium_100g": "sodium_mg",  // OFF stores sodium in g; we convert to mg
  // USDA keys (already canonical)
  "energy_kcal": "energy_kcal",
  "total_fat_g": "total_fat_g",
  "saturated_fat_g": "saturated_fat_g",
  "carbohydrates_g": "carbohydrates_g",
  "sugars_g": "sugars_g",
  "fiber_g": "fiber_g",
  "protein_g": "protein_g",
  "sodium_mg": "sodium_mg",
};

/**
 * Normalize a raw nutriments object (OFF or USDA) to canonical field names.
 * Returns only fields in CANONICAL_NUTRITION_FIELDS with non-null values.
 */
function normalizeNutrition(raw: Record<string, number>, source: string): NutritionRecord {
  const out: NutritionRecord = {};
  for (const [rawKey, value] of Object.entries(raw)) {
    if (value == null) continue;
    const canon = OFF_KEY_MAP[rawKey];
    if (!canon) continue;

    let v = value;
    // OFF stores sodium in grams; convert to mg
    if (rawKey === "sodium_100g") v = value * 1000;
    // OFF "energy_100g" is kJ, not kcal — skip it (we use energy-kcal_100g)
    if (rawKey === "energy_100g" && source.includes("OFF")) continue;

    out[canon] = v;
  }
  return out;
}

/**
 * Compare nutrition values across all sources and return warnings for
 * fields where sources disagree significantly.
 *
 * A field is flagged when BOTH:
 *   - absolute difference exceeds a small noise floor (to ignore rounding)
 *   - relative difference exceeds 40%
 *
 * Returns null if no significant divergence, or a factual summary string.
 */
function checkCrossSourceConsistency(nutritionBySource: NutritionBySource): string | null {
  const sources = Array.from(nutritionBySource.entries());
  if (sources.length < 2) return null;

  const divergent: string[] = [];

  for (const field of CANONICAL_NUTRITION_FIELDS) {
    const valuesWithSource: { source: string; value: number }[] = [];
    for (const [src, nutr] of sources) {
      const v = nutr[field];
      if (v != null && v >= 0) valuesWithSource.push({ source: src, value: v });
    }
    if (valuesWithSource.length < 2) continue;

    for (let i = 0; i < valuesWithSource.length; i++) {
      for (let j = i + 1; j < valuesWithSource.length; j++) {
        const a = valuesWithSource[i];
        const b = valuesWithSource[j];
        const absDiff = Math.abs(a.value - b.value);
        const avg = (a.value + b.value) / 2;
        const relDiff = avg > 0 ? absDiff / avg : 0;

        // Noise floor: skip trivially small absolute differences
        const absThreshold = field === "sodium_mg" ? 200 : field === "energy_kcal" ? 30 : 2;
        if (absDiff <= absThreshold) continue;
        if (relDiff <= 0.40) continue;

        divergent.push(
          `  - ${field}: ${a.source}=${a.value}, ${b.source}=${b.value} ` +
          `(Δ ${absDiff.toFixed(1)}, ${(relDiff * 100).toFixed(0)}%)`
        );
      }
    }
  }

  if (divergent.length === 0) return null;

  return [
    "⚠️ CROSS-SOURCE NUTRITION DISCREPANCY:",
    "These fields differ significantly between sources on overlapping data:",
    "",
    ...divergent,
  ].join("\n");
}

async function runTool(tool: string, args: any): Promise<any> {
  switch (tool) {
    // ── Local Open Food Facts ──────────────────────────────────
    case "local.barcode_lookup": {
      const barcode = String(args.barcode);
      const result = await localOffBarcodeLookup(barcode);
      if (!result) {
        return {
          found: false,
          source: "Open Food Facts (local, 4M products)",
          barcode_queried: barcode,
          hint: "Barcode not found in OFF. Try local.usda_barcode for USDA lookup (has ~2M branded products with UPC codes and authoritative nutrition data). If that also fails, try web.search."
        };
      }
      const hasNutrition = result.nutriments && Object.keys(result.nutriments).length > 0;
      const nutriCount = hasNutrition ? Object.keys(result.nutriments!).length : 0;
      const missing = hasNutrition ? findMissingNutrition(result.nutriments!) : REQUIRED_NUTRITION_FIELDS;
      const fvpn = extractOffFvpn(result.nutriments);
      const detectedAdditives = extractOffAdditives(result.additives);
      const organicLabels = extractOrganicLabels(result.labels);

      let hint: string;
      if (!hasNutrition) {
        hint = "Product found but MISSING nutrition data. Use local.usda_barcode or local.usda_search to find per-100g nutrition for this product.";
      } else if (!result.ingredients_text) {
        hint = "Product found with nutrition but no ingredients. Try local.usda_barcode or web.search for ingredient list.";
      } else if (missing.length > 0) {
        hint = `Product found with nutrition + ingredients but missing: ${missing.join(", ")}. Try local.usda_search by product name to fill gaps.`;
      } else {
        hint = "Product found with complete nutrition + ingredients. This data is sufficient — only cross-reference if values look suspicious.";
      }

      return {
        found: true,
        source: "Open Food Facts (local)",
        has_nutrition: hasNutrition,
        nutrition_fields: nutriCount,
        missing_nutrition: missing.length > 0 ? missing : undefined,
        has_ingredients: !!result.ingredients_text,
        fvpn_estimate: fvpn,
        detected_additives: detectedAdditives,
        organic_labels: organicLabels,
        product: result,
        hint,
      };
    }

    case "local.search": {
      const query = String(args.query ?? "");
      const results = await localOffSearchText(query, args.limit ?? 10);
      const withNutrition = results.filter(r => r.nutriments && Object.keys(r.nutriments).length > 0);
      // Attach FVPN estimates to each result for visibility
      const resultsWithFvpn = results.map(r => ({
        ...r,
        fvpn_estimate: extractOffFvpn(r.nutriments),
        detected_additives: extractOffAdditives(r.additives),
        organic_labels: extractOrganicLabels(r.labels),
      }));
      return {
        count: results.length,
        with_nutrition: withNutrition.length,
        source: "Open Food Facts (local FTS)",
        results: resultsWithFvpn,
        hint: results.length === 0
          ? "No matches in OFF. Try local.usda_search (USDA database) or broaden your search terms."
          : withNutrition.length === 0
            ? `Found ${results.length} matches but NONE have nutrition data. Use local.usda_search to find nutrition for these products.`
            : (() => {
                const best = results.find(r => r.nutriments && Object.keys(r.nutriments).length >= 8 && r.ingredients_text);
                return best
                  ? `Found ${withNutrition.length}/${results.length} with nutrition. Best match has comprehensive data — sufficient for the report unless values look suspicious. Only go to web if brand match is uncertain.`
                  : `Found ${withNutrition.length}/${results.length} with nutrition. Consider local.usda_search to fill gaps or verify.`;
              })()
      };
    }

    // ── Local USDA FoodData Central ────────────────────────────
    case "local.usda_barcode": {
      const barcode = String(args.barcode);
      const results = localUsdaBarcodeLookup(barcode);
      if (results.length === 0) {
        return {
          found: false,
          count: 0,
          source: "USDA FoodData Central (local, ~2M branded + 8K SR Legacy)",
          barcode_queried: barcode,
          hint: "Barcode not found in local USDA. Try local.usda_search with the product name, or web.search as last resort."
        };
      }
      const best = results.find(r => r.nutriments) ?? results[0];
      const missing = best.nutriments ? findMissingNutrition(best.nutriments) : REQUIRED_NUTRITION_FIELDS;
      return {
        found: true,
        count: results.length,
        source: "USDA FoodData Central (local)",
        has_nutrition: !!best.nutriments,
        missing_nutrition: missing.length > 0 ? missing : undefined,
        best_match: best,
        all_matches: results.length > 1 ? results : undefined,
        hint: best.nutriments
          ? missing.length > 0
            ? `Authoritative USDA nutrition data found but missing: ${missing.join(", ")}. Try web.search for the missing fields.`
            : "Authoritative USDA nutrition data found. This is high-quality per-100g data."
          : "Product found in USDA but nutrition data missing. Try web.search as last resort."
      };
    }

    case "local.usda_search": {
      const query = String(args.query ?? "");
      const results = localUsdaSearchText(query, args.limit ?? 10);
      const withNutrition = results.filter(r => r.nutriments);
      return {
        count: results.length,
        with_nutrition: withNutrition.length,
        source: "USDA FoodData Central (local FTS)",
        results: results.slice(0, args.limit ?? 10),
        hint: results.length === 0
          ? "No matches in local USDA. The brand may not be in USDA’s database. If OFF already has good data, that’s sufficient. Otherwise try web.search."
          : (() => {
                // Check if any result actually matches the queried brand
                const queryLower = query.toLowerCase();
                const brandMatch = results.some(r =>
                  (r.brand_owner && queryLower.includes(r.brand_owner.toLowerCase().split(/[,]/).map(s => s.trim())[0])) ||
                  (r.brand_name && queryLower.includes(r.brand_name.toLowerCase()))
                );
                if (!brandMatch && withNutrition.length > 0)
                  return `Found ${results.length} results but NONE match the queried brand. These are different products — do NOT use their nutrition. If OFF already has the correct product with nutrition, use that instead.`;
                return withNutrition.length === 0
                  ? `Found ${results.length} matches but none with nutrition. Try web.search as last resort.`
                  : `Found ${withNutrition.length}/${results.length} with nutrition. USDA data is authoritative per-100g.`;
              })()
      };
    }

    // ── Web search + page fetch ────────────────────────────────
    case "web.search": {
      const results = await webSearch(String(args.query ?? ""));
      return {
        count: results.length,
        source: "Web search",
        results,
        hint: results.length === 0
          ? "Web search returned no results. Try different search terms, or check if Brave Search API key is configured."
          : `Found ${results.length} web results. Use web.open to fetch detailed nutrition/ingredient data from the best URL.`
      };
    }

    case "web.open":
      return webOpen(String(args.url ?? ""));

    default:
      throw new Error(`Unknown tool: ${tool}. Available: local.barcode_lookup, local.search, local.usda_barcode, local.usda_search, web.search, web.open`);
  }
}
