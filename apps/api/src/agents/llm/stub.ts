import type { Env } from "../../env";
import type { ChatOptions, LlmClient } from "./client";

/**
 * Stub LLM provider.
 * Active when CHEWBER_LLM_PROVIDER=stub (the default if no keys are configured).
 * All outputs are clearly marked as demo/placeholder data.
 */
export class StubLLM implements LlmClient {
  constructor(private env: Env) {}

  async chat(opts: ChatOptions): Promise<{ text: string }> {
    const joined = opts.messages.map((m) => m.content).join("\n\n");

    if (joined.includes("Query Helper Agent")) {
      return { text: JSON.stringify(this.helperStub(joined), null, 2) };
    }

    if (joined.includes("Food Research Agent")) {
      return {
        text: JSON.stringify({
          tool_calls: [],
          final_markdown: this.reportStub(),
          notes: "\u26a0\ufe0f DEMO MODE \u2014 stub provider, no external research performed"
        }, null, 2)
      };
    }

    if (joined.includes("Report \u2192 JSON Extractor Agent")) {
      return { text: JSON.stringify(this.abstractionStub(), null, 2) };
    }

    return { text: opts.jsonOnly ? "{}" : "stub" };
  }

  private helperStub(joined: string) {
    const rawMatch = joined.match(/rawText:\s*(.*)/i);
    const rawText = rawMatch ? rawMatch[1].trim() : "";
    const bcMatch = joined.match(/barcode:\s*(.*)/i);
    const barcode = bcMatch ? bcMatch[1].trim() : null;

    return {
      structured_query: {
        barcode: barcode || null,
        name: rawText || (barcode ? `Barcode ${barcode}` : "Unknown food"),
        brand: null,
        kind: "unknown",
        country: null,
        language: null,
        variant: null,
        isOrganic: "unknown",
        expectedCategory: "unknown",
        notes: "\u26a0\ufe0f DEMO MODE \u2014 no LLM configured. This is placeholder data, not real analysis.",
        imageIds: null
      },
      needs_followup: false,
      questions: [],
      confidence: 0,
      why_questions: "\u26a0\ufe0f DEMO MODE \u2014 no LLM configured."
    };
  }

  private reportStub(): string {
    return `# \u26a0\ufe0f DEMO MODE \u2014 Stub Report (No LLM Configured)

> **This is placeholder data.** No real research was performed.
> Configure a real LLM provider (set CHEWBER_LLM_PROVIDER=openai or openrouter) for actual food analysis.

## 1) Identification
- Canonical name: Unknown (\u26a0\ufe0f stub)
- Brand: null
- Barcode: null
- Kind: unknown
- Market/country: null
- Confidence: 0.0 (stub provider \u2014 no real analysis)

## 2) Classification for scoring
- Nutri-Score category: unknown
- Is water?: no
- Reconstituted?: no
- FVPN%: null

## 3) Nutrition facts (per 100 g or per 100 mL)
All values: null (no data gathered)

## 4) Ingredients & additives
- Ingredients: null
- Additives: none detected
- Hydrogenated oils: unknown

## 5) Organic status
- Certified organic?: unknown

## 6) Sources
- (none \u2014 stub provider)

## 7) Uncertainties & follow-ups
- Missing fields: ALL (this is a stub, not real data)
- To get real results, set CHEWBER_LLM_PROVIDER to openai or openrouter
`;
  }

  private abstractionStub() {
    return {
      schema_version: 1,
      identification: {
        canonical_name: "\u26a0\ufe0f Unknown (DEMO MODE)",
        brand: null,
        barcode: null,
        kind: "unknown",
        market_country: null,
        language: null
      },
      classification: {
        nutri_score_category: "unknown",
        is_water: false,
        is_reconstituted: false,
        prepared_basis: "unknown",
        fvp_percent: null
      },
      nutrition_per_100: {
        unit_basis: "unknown",
        energy_kj: null,
        energy_kcal: null,
        sugars_g: null,
        saturated_fat_g: null,
        total_fat_g: null,
        sodium_mg: null,
        salt_g: null,
        protein_g: null,
        fiber_g: null
      },
      ingredients: { ingredients_text: null },
      additives: [],
      flags: {
        contains_partially_hydrogenated_oils: "unknown",
        contains_fully_hydrogenated_oils: "unknown"
      },
      organic: { is_certified_organic: "unknown", evidence: null },
      sources: [],
      notes: { confidence: 0, rationale: "\u26a0\ufe0f DEMO MODE \u2014 stub provider, no real analysis performed", missing_fields: ["all"] }
    };
  }
}
