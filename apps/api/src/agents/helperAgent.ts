import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import { getLlm } from "./llm/client";
import { analyseImages } from "./vision";

const prompt = readFileSync(resolve(import.meta.dir, "./prompts/helper_query.md"), "utf-8");

const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(["select", "multiselect", "yesno"]),
  options: z.array(z.object({ label: z.string(), value: z.string() })).nullable().optional().transform(v => v ?? []),
  field: z.string().nullable().optional().default(null),
  required: z.boolean().optional(),
  reason: z.string().optional()
}).transform((q) => {
  if ((q.type === "select" || q.type === "multiselect") && (!q.options || q.options.length === 0)) {
    return { ...q, type: "yesno" as const, options: [] };
  }
  if (q.type === "yesno") {
    return { ...q, options: [] };
  }
  return q;
});

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
  imageIds: z.array(z.string()).nullable().optional()
});

const AssistSchema = z.object({
  rejected: z.boolean().optional().default(false),
  rejection_reason: z.string().nullable().optional().default(null),
  structured_query: StructuredQuerySchema,
  needs_followup: z.boolean(),
  has_more_rounds: z.boolean().optional().default(false),
  questions: z.array(QuestionSchema),
  confidence: z.number().min(0).max(1),
  why_questions: z.string().optional()
});

export type AssistResult = z.infer<typeof AssistSchema>;

export type PriorAnswer = { question_id: string; answer: string };

export type AssistInput = {
  rawText: string;
  barcode?: string | null;
  imageIds?: string[];
  imageNotes?: string | null;
  priorAnswers?: PriorAnswer[];
};

export async function assistQuery(input: AssistInput): Promise<AssistResult> {
  const llm = getLlm("helper");

  // Analyse uploaded images via vision model (if any).
  let imageNotes = input.imageNotes ?? "";
  if (!imageNotes && input.imageIds && input.imageIds.length > 0) {
    imageNotes = await analyseImages(input.imageIds);
  }

  const priorAnswersStr = input.priorAnswers?.length
    ? JSON.stringify(input.priorAnswers)
    : "[]";

  const user = [
    `rawText: ${input.rawText ?? ""}`,
    `barcode: ${input.barcode ?? ""}`,
    `imageNotes: ${imageNotes}`,
    `prior_answers: ${priorAnswersStr}`
  ].join("\n");

  const { text } = await llm.chat({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: user }
    ],
    temperature: 0.2,
    jsonOnly: true
  });

  let parsed: any;
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Helper agent returned non-JSON: ${text.slice(0, 300)}`);
  }
  return AssistSchema.parse(parsed);
}
