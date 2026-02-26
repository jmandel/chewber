import { cacheGet, cacheSet } from "./cache";
import { getEnv } from "../env";

const PROVIDER = "web";
const UA = "Chewber/1.0 (food research; +https://chewber.exe.xyz)";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// ---------------------------------------------------------------------------
// Web search — tries Brave first, falls back to DDG
// ---------------------------------------------------------------------------

/**
 * Web search. Uses Brave Search API if BRAVE_SEARCH_API_KEY is set,
 * otherwise falls back to DuckDuckGo HTML (which may be CAPTCHA-blocked).
 */
export async function webSearch(query: string): Promise<SearchResult[]> {
  const key = `search:${query}`;
  const cached = await cacheGet(PROVIDER, key);
  if (cached) return cached as SearchResult[];

  let results: SearchResult[];

  const braveKey = getEnv().BRAVE_SEARCH_API_KEY;
  if (braveKey) {
    results = await braveSearch(query, braveKey);
  } else {
    results = await ddgSearch(query);
  }

  await cacheSet(PROVIDER, key, results);
  return results;
}

// ---------------------------------------------------------------------------
// Brave Search API
// ---------------------------------------------------------------------------

async function braveSearch(query: string, apiKey: string): Promise<SearchResult[]> {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", "8");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Subscription-Token": apiKey,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Brave search failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as any;
  return (data.web?.results || []).slice(0, 8).map((r: any) => ({
    title: r.title ?? "",
    url: r.url,
    snippet: r.description ?? "",
  }));
}

// ---------------------------------------------------------------------------
// DuckDuckGo HTML fallback (may be CAPTCHA-blocked)
// ---------------------------------------------------------------------------

async function ddgSearch(query: string): Promise<SearchResult[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`DDG search failed: ${res.status}`);

  const html = await res.text();

  // Detect CAPTCHA / bot challenge pages
  if (
    html.includes("Please click to continue") ||
    html.includes("blocked") ||
    html.includes("unusual traffic") ||
    html.includes("bot") && html.includes("challenge") ||
    !html.includes('class="result ')
  ) {
    throw new Error(
      "DDG returned a CAPTCHA/bot-challenge page. Set BRAVE_SEARCH_API_KEY for reliable web search."
    );
  }

  return parseDdgResults(html);
}

function parseDdgResults(html: string): SearchResult[] {
  const results: SearchResult[] = [];
  const resultBlocks = html.split(/class="result\s/);

  for (let i = 1; i < resultBlocks.length && results.length < 8; i++) {
    const block = resultBlocks[i];

    const linkMatch = block.match(
      /class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/
    );
    if (!linkMatch) continue;

    let href = linkMatch[1];
    const uddg = href.match(/[?&]uddg=([^&]+)/);
    if (uddg) href = decodeURIComponent(uddg[1]);
    if (!href.startsWith("http")) continue;

    const title = linkMatch[2]
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const snippetMatch = block.match(
      /class="result__snippet"[^>]*>([\s\S]*?)<\/a>/
    );
    const snippet = snippetMatch
      ? snippetMatch[1]
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";

    results.push({ title, url: href, snippet });
  }

  return results;
}

// ---------------------------------------------------------------------------
// web.open — fetch a URL
// ---------------------------------------------------------------------------

/**
 * Fetch a URL. Returns JSON directly if Content-Type is JSON,
 * otherwise strips HTML and returns text.
 */
export async function webOpen(url: string): Promise<any> {
  const key = `open:${url}`;
  const cached = await cacheGet(PROVIDER, key);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/json,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`web.open failed: ${res.status} for ${url}`);

  const contentType = res.headers.get("content-type") ?? "";

  let result: any;

  if (contentType.includes("application/json")) {
    const json = await res.json();
    result = { url, title: "", content_type: "json", data: json };
  } else {
    const html = await res.text();
    const title = (
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? ""
    ).trim();
    const text = stripHtml(html);
    result = { url, title, content_type: "html", text: text.slice(0, 12000) };
  }

  await cacheSet(PROVIDER, key, result);
  return result;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
