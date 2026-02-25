/**
 * Transform a standard JSON Schema into one compatible with Gemini structured output.
 *
 * Gemini structured output constraints:
 * 1. No `type: ["string", "null"]` — use `anyOf: [{type: "string"}, {type: "null"}]`
 * 2. No `$schema`, `$id`, `title`, `description`, `minimum`, `maximum`, `const`, `default`
 *    as schema-level keywords (Gemini rejects them)
 * 3. But property names inside `properties` objects must be preserved
 */

const SCHEMA_META_KEYS = new Set(["$schema", "$id", "title", "description", "minimum", "maximum", "const", "default"]);

export function toGeminiSchema(schema: any): any {
  return transformNode(schema, false);
}

function transformNode(node: any, insidePropertiesMap: boolean): any {
  if (Array.isArray(node)) return node.map(item => transformNode(item, false));
  if (node === null || typeof node !== "object") return node;

  const out: any = {};

  for (const [k, v] of Object.entries(node)) {
    // Only strip meta keys when NOT inside a "properties" map
    // Inside "properties", keys are user-defined property names, not schema keywords
    if (!insidePropertiesMap && SCHEMA_META_KEYS.has(k)) continue;

    // Convert type arrays to anyOf (e.g. type: ["string", "null"])
    if (k === "type" && Array.isArray(v)) {
      out.anyOf = (v as string[]).map(t => ({ type: t }));
      continue;
    }

    // When entering a "properties" object, child keys are property names
    // and their values are schema nodes
    if (k === "properties" && typeof v === "object" && v !== null && !Array.isArray(v)) {
      const propsOut: any = {};
      for (const [propName, propSchema] of Object.entries(v)) {
        propsOut[propName] = transformNode(propSchema, false);
      }
      out[k] = propsOut;
      continue;
    }

    out[k] = transformNode(v, false);
  }

  return out;
}
