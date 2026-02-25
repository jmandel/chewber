import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { getLlm } from "./llm/client";

const prompt = readFileSync(resolve(import.meta.dir, "./prompts/report_to_json.md"), "utf-8");
const absSchema = JSON.parse(readFileSync(resolve(import.meta.dir, "../schemas/food_abstraction.schema.json"), "utf-8"));

import { toGeminiSchema } from "./llm/schemaTransform";

const cleanSchema = toGeminiSchema(absSchema);

const MAX_RETRIES = 2;

export async function reportToJson(reportMd: string): Promise<any> {
  const llm = getLlm("json_extract");

  const messages: { role: string; content: string }[] = [
    { role: "system", content: prompt },
    {
      role: "user",
      content: JSON.stringify(
        {
          json_schema: absSchema,
          report_markdown: reportMd
        },
        null,
        2
      )
    }
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { text } = await llm.chat({
      messages: messages as any,
      temperature: 0.1,
      jsonSchema: { name: "food_abstraction", schema: cleanSchema }
    });

    let parsed: any;
    try {
      let cleaned = text.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      }
      parsed = JSON.parse(cleaned);
    } catch (e: any) {
      lastError = new Error(`JSON extractor returned non-JSON output: ${text.slice(0, 300)}`);
      if (attempt < MAX_RETRIES) {
        messages.push(
          { role: "assistant", content: text },
          { role: "user", content: `ERROR: Your response was not valid JSON. Parse error: ${String(e?.message ?? e)}. Please return ONLY a valid JSON object matching the schema. Try again.` }
        );
        continue;
      }
      throw lastError;
    }

    return parsed;
  }

  throw lastError ?? new Error("JSON extraction failed after retries");
}
