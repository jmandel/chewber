import { Hono } from "hono";
import { newId, nowIso } from "../utils/id";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export const uploadRoutes = new Hono();

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function extForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

uploadRoutes.post("/upload", async (c) => {
  const db = c.get("db");
  const env = c.get("env");

  const uploadDir = resolve(process.cwd(), env.CHEWBER_UPLOAD_DIR);
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  const body = await c.req.parseBody();
  const filesRaw = body["images"];
  const files = Array.isArray(filesRaw) ? filesRaw : filesRaw ? [filesRaw] : [];

  const imageIds: string[] = [];

  for (const f of files) {
    if (!(f instanceof File)) continue;

    const buf = await f.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const sha = toHex(digest);
    const ext = extForMime(f.type);

    const fileNameSafe = f.name.replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 64);
    const rel = `${sha}_${fileNameSafe || "upload"}.${ext}`;
    const path = resolve(uploadDir, rel);

    await Bun.write(path, buf);

    const id = newId("img");
    db.query(
      `INSERT INTO food_images (id, path, mime, sha256, created_at) VALUES (?, ?, ?, ?, ?)`
    ).run(id, path, f.type || "image/jpeg", sha, nowIso());

    imageIds.push(id);
  }

  return c.json({ image_ids: imageIds });
});
