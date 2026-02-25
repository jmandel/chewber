import { readFileSync } from "node:fs";
import { getDb } from "../db";
import { getEnv } from "../env";

type ImageRow = { id: string; path: string; mime: string };

const VISION_PROMPT = [
  "You are an expert food-product analyst. Examine the provided image(s) of a food product.",
  "Extract and return ALL of the following that are visible:",
  "- Product name",
  "- Brand",
  "- Full ingredients list (transcribe exactly)",
  "- Nutrition facts (per serving and/or per 100 g)",
  "- Any additive codes (E-numbers) visible",
  "- Barcode number if readable",
  "- Country of origin or language on packaging",
  "- Any health/quality labels (organic, non-GMO, etc.)",
  "",
  "If something is not visible or legible, omit it. Be concise but thorough.",
  "Return plain text, NOT JSON."
].join("\n");

/**
 * Analyse uploaded images via the LLM vision/multimodal API.
 * Returns a textual description of visible product information,
 * or an empty string if no images / on failure.
 */
export async function analyseImages(imageIds: string[]): Promise<string> {
  if (!imageIds || imageIds.length === 0) return "";

  const env = getEnv();

  // In stub/demo mode, skip the real call.
  if (env.CHEWBER_LLM_PROVIDER === "stub") {
    return "\u26a0\ufe0f DEMO MODE \u2014 no vision analysis performed";
  }

  try {
    const db = getDb();
    const stmt = db.query<ImageRow, [string]>(
      "SELECT id, path, mime FROM food_images WHERE id = ?"
    );

    const contentParts: Array<
      | { type: "text"; text: string }
      | { type: "image_url"; image_url: { url: string } }
    > = [{ type: "text", text: VISION_PROMPT }];

    for (const imgId of imageIds) {
      const row = stmt.get(imgId);
      if (!row) continue;

      let bytes: Buffer;
      try {
        bytes = readFileSync(row.path) as Buffer;
      } catch {
        // File missing on disk — skip silently.
        continue;
      }

      const mime = row.mime || "image/jpeg";
      const b64 = bytes.toString("base64");
      contentParts.push({
        type: "image_url",
        image_url: { url: `data:${mime};base64,${b64}` }
      });
    }

    // If we ended up with no actual images, nothing to do.
    if (contentParts.length <= 1) return "";

    const url = `${env.OPENROUTER_BASE_URL.replace(/\/$/, "")}/chat/completions`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chewber.exe.xyz",
        "X-Title": "Chewber"
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL,
        messages: [
          { role: "user", content: contentParts }
        ],
        temperature: 0.1,
        max_tokens: 2048
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`[vision] OpenRouter error ${res.status}: ${errBody}`);
      return "";
    }

    const json = await res.json();
    const text = json?.choices?.[0]?.message?.content;
    if (typeof text !== "string" || text.trim().length === 0) {
      console.error("[vision] Empty response from model");
      return "";
    }

    return text.trim();
  } catch (err) {
    console.error("[vision] Failed to analyse images:", err);
    return "";
  }
}
