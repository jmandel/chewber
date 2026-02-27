import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getEnv } from "./env";
import { getDb } from "./db";

import { healthRoutes } from "./routes/health";
import { foodsRoutes } from "./routes/foods";
import { jobsRoutes } from "./routes/jobs";
import { uploadRoutes } from "./routes/upload";
import { queryRoutes } from "./routes/query";
import { resolveRoutes } from "./routes/resolve";
import { additivesRoutes } from "./routes/additives";
import { loadAdditiveResearch } from "./sources/additiveResearch";

const env = getEnv();
const db = getDb();

// Pre-load additive research reports into memory
loadAdditiveResearch();

const app = new Hono();

// ---------- middleware ----------
app.use("*", logger());
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400
  })
);

app.use("/api/*", async (c, next) => {
  c.set("db", db);
  c.set("env", env);
  await next();
});

// ---------- error handler ----------
app.onError((err, c) => {
  console.error("[error]", err);
  const status = (err as any).status ?? 500;
  return c.json(
    { error: err.message ?? "Internal Server Error", details: String(err) },
    status
  );
});

// ---------- API routes ----------
app.route("/api", healthRoutes);
app.route("/api", foodsRoutes);
app.route("/api", jobsRoutes);
app.route("/api", uploadRoutes);
app.route("/api", queryRoutes);
app.route("/api", resolveRoutes);
app.route("/api", additivesRoutes);

// ---------- static / web ----------
const WEB_DIR = resolve(import.meta.dir, "../../web");
const PUBLIC_DIR = resolve(WEB_DIR, "public");
const INDEX_PATH = resolve(WEB_DIR, "index.html");
const CSS_PATH = resolve(WEB_DIR, "src/styles.css");
const ENTRY_PATH = resolve(WEB_DIR, "src/main.tsx");

let cachedBundle: { code: string; builtAt: number } | null = null;

async function getBundle(): Promise<string> {
  const now = Date.now();
  if (cachedBundle && now - cachedBundle.builtAt < 1000) return cachedBundle.code;
  const result = await Bun.build({
    entrypoints: [ENTRY_PATH],
    target: "browser",
    format: "esm",
    sourcemap: "none",
    minify: true
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
  return readFileSync(INDEX_PATH, "utf-8").replace("%CHEWBER_API_BASE%", "");
}

// Static public files (favicon, manifest, og-image, etc.)
const MIME_MAP: Record<string, string> = {
  svg: "image/svg+xml", json: "application/json", png: "image/png",
  ico: "image/x-icon", webp: "image/webp", jpg: "image/jpeg",
};
// Serve all static files from public/ by matching known extensions
app.get("/*", async (c, next) => {
  const urlPath = new URL(c.req.url).pathname;
  const ext = urlPath.split(".").pop() ?? "";
  if (MIME_MAP[ext]) {
    const filePath = resolve(PUBLIC_DIR, urlPath.slice(1));
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, {
        headers: { "Content-Type": MIME_MAP[ext], "Cache-Control": "public, max-age=3600" }
      });
    }
  }
  await next();
});

app.get("/assets/styles.css", (c) => {
  return new Response(Bun.file(CSS_PATH), {
    headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "no-cache" }
  });
});

app.get("/assets/app.js", async (c) => {
  try {
    const code = await getBundle();
    return new Response(code, {
      headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-cache" }
    });
  } catch (err: any) {
    return new Response(String(err?.stack ?? err), { status: 500 });
  }
});

// SPA fallback — everything that isn't /api or /assets
app.get("*", (c) => {
  return new Response(indexHtml(), {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
});

const port = env.CHEWBER_PORT;
Bun.serve({ port, fetch: app.fetch });
console.log(`[chewber] http://localhost:${port}  (API + web)`);
