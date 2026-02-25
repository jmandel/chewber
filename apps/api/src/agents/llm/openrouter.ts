import type { Env } from "../../env";
import type { ChatOptions, LlmClient } from "./client";

export class OpenRouterLLM implements LlmClient {
  private model: string;

  constructor(private env: Env, modelOverride?: string) {
    this.model = modelOverride ?? env.OPENROUTER_MODEL;
  }

  async chat(opts: ChatOptions): Promise<{ text: string }> {
    if (!this.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is required when CHEWBER_LLM_PROVIDER=openrouter");
    }

    const url = `${this.env.OPENROUTER_BASE_URL.replace(/\/$/, "")}/chat/completions`;

    const payload: any = {
      model: this.model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.2
    };

    if (opts.maxTokens != null) payload.max_tokens = opts.maxTokens;

    if (opts.jsonSchema) {
      payload.response_format = {
        type: "json_schema",
        json_schema: {
          name: opts.jsonSchema.name,
          strict: true,
          schema: opts.jsonSchema.schema
        }
      };
    } else if (opts.jsonOnly) {
      payload.response_format = { type: "json_object" };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chewber.exe.xyz",
        "X-Title": "Chewber"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string") {
      throw new Error(`OpenRouter: missing response text, got: ${JSON.stringify(json).slice(0, 300)}`);
    }
    return { text };
  }
}
