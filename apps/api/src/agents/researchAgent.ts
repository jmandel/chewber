import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { getLlm } from "./llm/client";
import { localOffBarcodeLookup, localOffSearchText } from "../sources/localOff";
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
      emit({ level: "tool", message: `${tc.tool}`, data: { args: tc.args } });
      totalToolCalls++;

      try {
        const r = await runTool(tc.tool, tc.args);
        const truncated = truncate(r);
        toolResults.push({ tool: tc.tool, ok: true, result: truncated });
        emit({ level: "tool", message: `${tc.tool} → ok`, data: { result: truncated } });
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

async function runTool(tool: string, args: any): Promise<any> {
  switch (tool) {
    case "local.barcode_lookup": {
      const result = localOffBarcodeLookup(String(args.barcode));
      return result ?? { found: false };
    }
    case "local.search": {
      const results = localOffSearchText(String(args.query ?? ""), args.limit ?? 10);
      return { count: results.length, results };
    }
    case "web.search":
      return webSearch(String(args.query ?? ""));
    case "web.open":
      return webOpen(String(args.url ?? ""));
    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}
