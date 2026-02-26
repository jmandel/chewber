import { cacheGet, cacheSet } from "./cache";
import { getEnv } from "../env";

const PROVIDER = "usda";

// USDA nutrient ID → our field name
const NUTRIENT_MAP: Record<number, string> = {
  1008: "energy_kcal",
  2047: "energy_kj",
  2000: "sugars_g",
  1258: "saturated_fat_g",
  1004: "total_fat_g",
  1093: "sodium_mg",
  1003: "protein_g",
  1079: "fiber_g",
};

function extractNutrients(raw: any[]): Record<string, number | null> {
  const out: Record<string, number | null> = {};
  for (const n of raw) {
    const id = n.nutrientId ?? n.nutrient?.id;
    const field = NUTRIENT_MAP[id];
    if (field) {
      out[field] = n.value ?? n.amount ?? null;
    }
  }
  return out;
}

export interface UsdaSearchResult {
  fdcId: number;
  description: string;
  brand: string | null;
  dataType: string;
  category: string | null;
  nutrients: Record<string, number | null>;
}

/**
 * Search USDA FoodData Central. Returns structured per-100g nutrition.
 * Works with DEMO_KEY (1000 req/hr) or a free registered key.
 */
export async function usdaSearch(
  query: string,
  pageSize = 5
): Promise<{ count: number; results: UsdaSearchResult[] }> {
  const key = `search:${query}:${pageSize}`;
  const cached = await cacheGet(PROVIDER, key);
  if (cached) return cached as any;

  const apiKey = getEnv().USDA_API_KEY || "DEMO_KEY";
  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("api_key", apiKey);
  // Prefer SR Legacy (standard reference, per 100g) and Branded
  url.searchParams.set("dataType", "SR Legacy,Branded,Foundation");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`USDA search failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as any;
  const results: UsdaSearchResult[] = (data.foods || []).map((f: any) => ({
    fdcId: f.fdcId,
    description: f.description,
    brand: f.brandOwner ?? f.brandName ?? null,
    dataType: f.dataType,
    category: f.foodCategory ?? null,
    nutrients: extractNutrients(f.foodNutrients || []),
  }));

  const result = { count: data.totalHits ?? results.length, results };
  await cacheSet(PROVIDER, key, result);
  return result;
}
