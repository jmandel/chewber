import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { getLlm } from "./llm/client";
import { localOffBarcodeLookup, localOffSearchText } from "../sources/localOff";
import { localUsdaBarcodeLookup, localUsdaSearchText } from "../sources/localUsda";
import { webSearch, webOpen } from "../sources/web";
import { usdaSearch } from "../sources/usda";

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
  notes: z.string()
});

export type ResearchInput = {
  structured_query: any;
  rawText?: string | null;
  imageNotes?: string | null;
};

export type EmitFn = (evt: { level: "debug" | "info" | "tool" | "warn" | "error"; message: string; data?: any }) => void;

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
    case "usda.search":
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
    case "usda.search":
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

export async function runResearchAgent(input: ResearchInput, emit: EmitFn): Promise<string> {
  const llm = getLlm("research");

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
        return makeErrorReport("LLM call failures", consecutiveErrors);
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
        return makeErrorReport("JSON parse failures", consecutiveErrors);
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
        return makeErrorReport("schema validation failures", consecutiveErrors);
      }
      continue;
    }

    if (obj.final_markdown) {
      emit({ level: "info", message: "Research agent produced final report." });
      return obj.final_markdown;
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
    messages.push({ role: "user", content: JSON.stringify({ tool_results: toolResults }, null, 2) });
  }

  emit({ level: "warn", message: "Max steps reached; returning partial report." });
  return makeErrorReport("max steps reached", MAX_STEPS);
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
      const fvpn = extractOffFvpn(result.nutriments);
      return {
        found: true,
        source: "Open Food Facts (local)",
        has_nutrition: hasNutrition,
        nutrition_fields: nutriCount,
        has_ingredients: !!result.ingredients_text,
        fvpn_estimate: fvpn,
        product: result,
        hint: !hasNutrition
          ? "Product found but MISSING nutrition data. Use local.usda_barcode or local.usda_search to find per-100g nutrition for this product."
          : !result.ingredients_text
            ? "Product found with nutrition but no ingredients. Try local.usda_barcode or web.search for ingredient list."
            : nutriCount >= 8
              ? "Product found with comprehensive nutrition + ingredients. This data is sufficient — only cross-reference if values look suspicious."
              : "Product found with partial nutrition + ingredients. Consider local.usda_search to fill gaps."
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
          hint: "Barcode not found in local USDA. Try usda.search (online API) with the product name, or web.search as last resort."
        };
      }
      const best = results.find(r => r.nutriments) ?? results[0];
      return {
        found: true,
        count: results.length,
        source: "USDA FoodData Central (local)",
        has_nutrition: !!best.nutriments,
        best_match: best,
        all_matches: results.length > 1 ? results : undefined,
        hint: best.nutriments
          ? "Authoritative USDA nutrition data found. This is high-quality per-100g data."
          : "Product found in USDA but nutrition data missing. Try usda.search (online API) for this specific fdc_id."
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
                  ? `Found ${results.length} matches but none with nutrition. Try usda.search (online API) for better coverage.`
                  : `Found ${withNutrition.length}/${results.length} with nutrition. USDA data is authoritative per-100g.`;
              })()
      };
    }

    // ── USDA online API ────────────────────────────────────────
    case "usda.search": {
      const results = await usdaSearch(String(args.query ?? ""), args.limit ?? 5);
      return {
        ...results,
        source: "USDA FoodData Central (online API)",
        hint: results.count === 0
          ? "No results from USDA API. Try different search terms (simpler/shorter), or web.search as fallback."
          : `Found ${results.results.length} results with structured per-100g nutrition.`
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
      throw new Error(`Unknown tool: ${tool}. Available: local.barcode_lookup, local.search, local.usda_barcode, local.usda_search, usda.search, web.search, web.open`);
  }
}
