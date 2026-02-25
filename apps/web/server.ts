import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PORT = Number(process.env.CHEWBER_WEB_PORT ?? 8000);
const API_UPSTREAM = process.env.CHEWBER_API_UPSTREAM ?? "http://localhost:8787";

const INDEX_PATH = resolve(import.meta.dir, "./index.html");
const CSS_PATH = resolve(import.meta.dir, "./src/styles.css");
const ENTRY_PATH = resolve(import.meta.dir, "./src/main.tsx");

let cachedBundle: { code: string; builtAt: number } | null = null;

async function getBundle(): Promise<string> {
  const now = Date.now();
  if (cachedBundle && now - cachedBundle.builtAt < 1000) return cachedBundle.code;

  const result = await Bun.build({
    entrypoints: [ENTRY_PATH],
    target: "browser",
    format: "esm",
    sourcemap: "inline",
    minify: false
  });

  if (!result.success) {
    const msg = result.logs.map((l) => l.message).join("\n");
    throw new Error("Bundle failed:\n" + msg);
  }

  const out = await result.outputs[0].text();
  cachedBundle = { code: out, builtAt: now };
  return out;
}

function indexHtml(): string {
  const html = readFileSync(INDEX_PATH, "utf-8");
  // API is same-origin via proxy, so base is empty
  return html.replace("%CHEWBER_API_BASE%", "");
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Proxy /api/* requests to the API server
    if (url.pathname.startsWith("/api/") || url.pathname === "/api") {
      const upstream = API_UPSTREAM.replace(/\/$/, "") + url.pathname + url.search;
      try {
        const headers = new Headers(req.headers);
        headers.delete("host");

        const proxyReq = new Request(upstream, {
          method: req.method,
          headers,
          body: req.body,
          // @ts-ignore - duplex needed for streaming body
          duplex: req.body ? "half" : undefined
        });

        const proxyRes = await fetch(proxyReq);

        // For SSE, stream the response through
        const resHeaders = new Headers(proxyRes.headers);
        resHeaders.set("Access-Control-Allow-Origin", "*");

        return new Response(proxyRes.body, {
          status: proxyRes.status,
          statusText: proxyRes.statusText,
          headers: resHeaders
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: "API proxy error", detail: String(e?.message ?? e) }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    if (url.pathname === "/assets/styles.css") {
      return new Response(Bun.file(CSS_PATH), {
        headers: { "Content-Type": "text/css; charset=utf-8" }
      });
    }

    if (url.pathname === "/assets/app.js") {
      try {
        const code = await getBundle();
        return new Response(code, {
          headers: { "Content-Type": "application/javascript; charset=utf-8" }
        });
      } catch (err: any) {
        return new Response(String(err?.stack ?? err), { status: 500 });
      }
    }

    // SPA fallback
    return new Response(indexHtml(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
});

console.log(`[web] Chewber web server on http://localhost:${PORT}`);
console.log(`[web] Proxying /api/* → ${API_UPSTREAM}`);
