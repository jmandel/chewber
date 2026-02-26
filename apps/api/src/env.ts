import { z } from "zod";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function parseDotEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    // remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/**
 * Loads apps/api/.env if present.
 * This keeps the repo runnable without requiring bun --env-file.
 */
export function loadEnvFileIfPresent() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  const txt = readFileSync(envPath, "utf-8");
  const parsed = parseDotEnv(txt);
  for (const [k, v] of Object.entries(parsed)) {
    if (process.env[k] == null || process.env[k] === "") {
      process.env[k] = v;
    }
  }
}

const EnvSchema = z.object({
  CHEWBER_PORT: z.coerce.number().default(8787),
  CHEWBER_DB_PATH: z.string().default("./chewber.sqlite"),
  CHEWBER_UPLOAD_DIR: z.string().default("./uploads"),

  CHEWBER_LLM_PROVIDER: z.enum(["stub", "openai", "openrouter"]).default("stub"),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().default("https://api.openai.com/v1"),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),

  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_BASE_URL: z.string().default("https://openrouter.ai/api/v1"),
  OPENROUTER_MODEL: z.string().default("google/gemini-3-flash-preview"),

  USDA_API_KEY: z.string().optional(),
  BRAVE_SEARCH_API_KEY: z.string().optional(),

  CHEWBER_WEB_ORIGIN: z.string().default("http://localhost:5173"),
  CHEWBER_ADMIN_KEY: z.string().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export function getEnv(): Env {
  loadEnvFileIfPresent();
  const raw = {
    CHEWBER_PORT: process.env.CHEWBER_PORT,
    CHEWBER_DB_PATH: process.env.CHEWBER_DB_PATH,
    CHEWBER_UPLOAD_DIR: process.env.CHEWBER_UPLOAD_DIR,

    CHEWBER_LLM_PROVIDER: process.env.CHEWBER_LLM_PROVIDER as any,

    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,

    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL: process.env.OPENROUTER_BASE_URL,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,

    USDA_API_KEY: process.env.USDA_API_KEY,
    BRAVE_SEARCH_API_KEY: process.env.BRAVE_SEARCH_API_KEY,

    CHEWBER_WEB_ORIGIN: process.env.CHEWBER_WEB_ORIGIN,
    CHEWBER_ADMIN_KEY: process.env.CHEWBER_ADMIN_KEY
  };
  return EnvSchema.parse(raw);
}
