import type { Env } from "../../env";
import { getEnv } from "../../env";
import { StubLLM } from "./stub";
import { OpenAiLLM } from "./openai";
import { OpenRouterLLM } from "./openrouter";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatOptions = {
  messages: ChatMessage[];
  temperature?: number;
  // If true, the model is expected to output JSON only (response_format: json_object).
  jsonOnly?: boolean;
  // If set, use structured output with a JSON Schema (response_format: json_schema).
  // Takes precedence over jsonOnly.
  jsonSchema?: { name: string; schema: Record<string, any> };
  // Max tokens is provider-specific; optional.
  maxTokens?: number;
};

export type LlmClient = {
  chat(opts: ChatOptions): Promise<{ text: string }>;
};

/**
 * Agent purpose — allows routing different agents to different models.
 * Currently all use the same model, but the abstraction is here for future use.
 */
export type AgentPurpose = "helper" | "research" | "json_extract" | "default";

/**
 * Get an LLM client, optionally specifying the agent purpose.
 * This lets you configure different models per purpose in the future.
 */
export function getLlm(purposeOrEnv?: AgentPurpose | Env, env?: Env): LlmClient {
  let purpose: AgentPurpose = "default";
  let resolvedEnv: Env;

  if (typeof purposeOrEnv === "string") {
    purpose = purposeOrEnv;
    resolvedEnv = env ?? getEnv();
  } else {
    resolvedEnv = purposeOrEnv ?? getEnv();
  }

  const provider = resolvedEnv.CHEWBER_LLM_PROVIDER;

  if (provider === "openrouter") {
    // Future: map purpose -> model override
    // e.g. const modelForPurpose = PURPOSE_MODELS[purpose] ?? resolvedEnv.OPENROUTER_MODEL;
    return new OpenRouterLLM(resolvedEnv);
  }
  if (provider === "openai") return new OpenAiLLM(resolvedEnv);
  return new StubLLM(resolvedEnv);
}
