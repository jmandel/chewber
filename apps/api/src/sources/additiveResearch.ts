import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

export interface AdditiveResearch {
  reportMd: string;
  abstraction: Record<string, unknown> | null;
}

/**
 * In-memory cache of additive research reports.
 *
 * On startup we scan research/additives/ for per-additive directories.
 * Each directory is named by E-code (e.g. E341/) and may contain:
 *   - {CODE}-report.md      — full research report in Markdown
 *   - {CODE}-abstraction.json — structured abstraction data
 *
 * Both files are optional; if the directory exists with at least the
 * report, we cache it. Codes are normalized to uppercase.
 */

const RESEARCH_ROOT =
  process.env.CHEWBER_RESEARCH_PATH ??
  resolve(import.meta.dir, "../../../../research/additives");

const cache = new Map<string, AdditiveResearch>();
let loaded = false;

/** Scan the research directory and populate the cache. */
export function loadAdditiveResearch(): void {
  cache.clear();

  if (!existsSync(RESEARCH_ROOT)) {
    console.log(`[additive-research] No research directory at ${RESEARCH_ROOT} — skipping`);
    loaded = true;
    return;
  }

  const entries = readdirSync(RESEARCH_ROOT);
  let count = 0;

  for (const entry of entries) {
    const dirPath = join(RESEARCH_ROOT, entry);
    if (!statSync(dirPath).isDirectory()) continue;

    // Directory name is the E-code (e.g. "E341")
    const code = entry.toUpperCase();

    const reportPath = join(dirPath, `${entry}-report.md`);
    const abstractionPath = join(dirPath, `${entry}-abstraction.json`);

    // Must have at least the report to be useful
    if (!existsSync(reportPath)) {
      // Try uppercase variant too
      const reportPathUpper = join(dirPath, `${code}-report.md`);
      if (!existsSync(reportPathUpper)) continue;
    }

    const actualReportPath = existsSync(reportPath)
      ? reportPath
      : join(dirPath, `${code}-report.md`);

    let reportMd: string;
    try {
      reportMd = readFileSync(actualReportPath, "utf-8");
    } catch {
      continue;
    }

    let abstraction: Record<string, unknown> | null = null;
    const actualAbstractionPath = existsSync(abstractionPath)
      ? abstractionPath
      : join(dirPath, `${code}-abstraction.json`);

    if (existsSync(actualAbstractionPath)) {
      try {
        abstraction = JSON.parse(readFileSync(actualAbstractionPath, "utf-8"));
      } catch (err) {
        console.warn(`[additive-research] Failed to parse ${actualAbstractionPath}:`, err);
      }
    }

    cache.set(code, { reportMd, abstraction });
    count++;
  }

  loaded = true;
  console.log(`[additive-research] Loaded ${count} research report(s) from ${RESEARCH_ROOT}`);
}

/** Get research data for a given additive code. Returns null if none exists. */
export function getAdditiveResearch(code: string): AdditiveResearch | null {
  if (!loaded) loadAdditiveResearch();
  return cache.get(code.toUpperCase()) ?? null;
}

/** Get all loaded additive codes that have research. */
export function getResearchCodes(): string[] {
  if (!loaded) loadAdditiveResearch();
  return Array.from(cache.keys());
}
