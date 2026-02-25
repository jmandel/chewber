import { cacheGet, cacheSet } from "./cache";

const PROVIDER = "web";
const UA = "Chewber/1.0 (food research; +https://chewber.exe.xyz)";

/**
 * Web search via DuckDuckGo HTML lite. Returns {title, url, snippet}[].
 */
export async function webSearch(query: string): Promise<any> {
  const key = `search:${query}`;
  const cached = await cacheGet(PROVIDER, key);
  if (cached) return cached;

  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`web.search failed: ${res.status}`);

  const html = await res.text();
  const results = parseDdgResults(html);
  await cacheSet(PROVIDER, key, results);
  return results;
}

function parseDdgResults(html: string): Array<{ title: string; url: string; snippet: string }> {
  const results: Array<{ title: string; url: string; snippet: string }> = [];

  // DuckDuckGo HTML lite wraps each result in <div class="result ...">
  // Each contains: <a class="result__a" href="...">title</a>
  //                <a class="result__snippet" ...>snippet</a>
  const resultBlocks = html.split(/class="result\s/);

  for (let i = 1; i < resultBlocks.length && results.length < 8; i++) {
    const block = resultBlocks[i];

    // Extract link
    const linkMatch = block.match(/class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!linkMatch) continue;

    let href = linkMatch[1];
    // DuckDuckGo wraps URLs in a redirect
    const uddg = href.match(/[?&]uddg=([^&]+)/);
    if (uddg) href = decodeURIComponent(uddg[1]);
    if (!href.startsWith("http")) continue;

    const title = linkMatch[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    // Extract snippet
    const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
    const snippet = snippetMatch
      ? snippetMatch[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
      : "";

    results.push({ title, url: href, snippet });
  }

  return results;
}

/**
 * Fetch a URL. Returns JSON directly if Content-Type is JSON,
 * otherwise strips HTML and returns text.
 */
export async function webOpen(url: string): Promise<any> {
  const key = `open:${url}`;
  const cached = await cacheGet(PROVIDER, key);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept": "text/html,application/json,*/*" },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`web.open failed: ${res.status} for ${url}`);

  const contentType = res.headers.get("content-type") ?? "";

  let result: any;

  if (contentType.includes("application/json")) {
    const json = await res.json();
    result = { url, title: "", content_type: "json", data: json };
  } else {
    const html = await res.text();
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "").trim();
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
