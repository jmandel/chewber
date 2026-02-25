import type { Env } from "../../env";
import type { ChatOptions, LlmClient } from "./client";

export class OpenAiLLM implements LlmClient {
  constructor(private env: Env) {}

  async chat(opts: ChatOptions): Promise<{ text: string }> {
    if (!this.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is required when CHEWBER_LLM_PROVIDER=openai");
    }

    const url = `${this.env.OPENAI_BASE_URL.replace(/\/$/, "")}/chat/completions`;

    const payload: any = {
      model: this.env.OPENAI_MODEL,
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
        Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string") throw new Error("OpenAI: missing response text");
    return { text };
  }
}
