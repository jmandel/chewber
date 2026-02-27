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

let cachedBundle: { code: string; hash: string; builtAt: number } | null = null;

async function getBundle(): Promise<{ code: string; hash: string }> {
  const now = Date.now();
  if (cachedBundle && now - cachedBundle.builtAt < 30_000) return cachedBundle;
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
  const hasher = new Bun.CryptoHasher("md5");
  hasher.update(out);
  const hash = hasher.digest("hex").slice(0, 10);
  cachedBundle = { code: out, hash, builtAt: now };
  return cachedBundle;
}

async function indexHtml(): Promise<string> {
  const { hash } = await getBundle();
  return readFileSync(INDEX_PATH, "utf-8")
    .replace("%CHEWBER_API_BASE%", "")
    .replace("app.js", `app.${hash}.js`);
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

// Serve JS bundle — any /assets/app*.js URL (hashed or plain)
app.get("/assets/:file", async (c) => {
  const file = c.req.param("file");
  if (!file.startsWith("app") || !file.endsWith(".js")) return c.notFound();
  try {
    const { code, hash } = await getBundle();
    const isHashed = file.includes(hash);
    return new Response(code, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": isHashed ? "public, max-age=31536000, immutable" : "no-cache",
      }
    });
  } catch (err: any) {
    return new Response(String(err?.stack ?? err), { status: 500 });
  }
});

// SPA fallback — everything that isn't /api or /assets
app.get("*", async (c) => {
  return new Response(await indexHtml(), {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
});

const port = env.CHEWBER_PORT;
Bun.serve({ port, fetch: app.fetch });
console.log(`[chewber] http://localhost:${port}  (API + web)`);
