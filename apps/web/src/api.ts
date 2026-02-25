export type RiskLevel = "risk_free" | "limited" | "moderate" | "high";

export type HelperQuestion = {
  id: string;
  question: string;
  type: "select" | "yesno" | "multiselect";
  options?: { label: string; value: string }[];
  field?: string | null;
  required?: boolean;
  reason?: string;
};

export type StructuredFoodQuery = {
  barcode?: string | null;
  name: string;
  brand?: string | null;
  kind?: "prepared" | "natural" | "unknown";
  country?: string | null;
  language?: string | null;

  // disambiguation fields
  variant?: string | null; // e.g. "red onion", "2% fat"
  isOrganic?: "yes" | "no" | "unknown";

  // for scoring
  expectedCategory?: "general_food" | "beverage" | "added_fat" | "cheese" | "unknown";

  // optional
  notes?: string | null;
  imageIds?: string[];
};

export type AssistResponse = {
  structured_query: StructuredFoodQuery;
  needs_followup: boolean;
  questions: HelperQuestion[];
  confidence: number;
  why_questions?: string;
};

export type ResolveResponse =
  | { kind: "found"; food: FoodDetail }
  | { kind: "queued"; job_id: string; query_id: string };

export type FoodSummary = {
  id: string;
  barcode?: string | null;
  canonical_name: string;
  brand?: string | null;
  category_path?: string | null;
  tags: string[];
  score?: number | null;
};

export type FoodDetail = FoodSummary & {
  abstraction?: any;
  report_md?: string | null;
  score_breakdown?: any;
  updated_at?: string;
};

export type JobStatus = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed" | "canceled";
  progress: number;
  result_food_id?: string | null;
  error?: string | null;
};

export type JobEvent = {
  id: number;
  ts: string;
  level: "debug" | "info" | "tool" | "warn" | "error";
  message: string;
  data?: any;
};

declare global {
  interface Window {
    __CHEWBER_API_BASE__?: string;
  }
}

export const API_BASE = window.__CHEWBER_API_BASE__ ?? "";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = API_BASE + path;
  let res: Response;
  try {
    const headers: Record<string, string> = { ...(init?.headers as any ?? {}) };
    if (init?.body) headers["Content-Type"] = "application/json";
    res = await fetch(url, { ...init, headers });
  } catch (e: any) {
    throw new Error(`Network error calling ${init?.method ?? "GET"} ${path}: ${e?.message ?? e}`);
  }
  if (!res.ok) {
    let detail: string;
    try { detail = await res.text(); } catch { detail = "(no body)"; }
    throw new Error(`${init?.method ?? "GET"} ${path} → ${res.status}: ${detail}`);
  }
  return (await res.json()) as T;
}

export const api = {
  assist: (rawText: string, imageIds: string[] = [], barcode?: string) =>
    http<AssistResponse>("/api/query/assist", {
      method: "POST",
      body: JSON.stringify({ rawText, imageIds, barcode })
    }),

  resolve: (payload: { rawText?: string; structured_query: StructuredFoodQuery; imageIds?: string[] }) =>
    http<ResolveResponse>("/api/resolve", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  searchFoods: (q: string) => http<{ foods: FoodSummary[] }>("/api/foods/search?q=" + encodeURIComponent(q)),
  searchFoodsByTag: (tag: string) => http<{ foods: FoodSummary[] }>("/api/foods/search?tag=" + encodeURIComponent(tag)),
  searchFoodsByCategory: (category: string) => http<{ foods: FoodSummary[] }>("/api/foods/search?category=" + encodeURIComponent(category)),
  getFood: (id: string) => http<FoodDetail>("/api/foods/" + encodeURIComponent(id)),
  getRecentFoods: (limit = 10) => http<{ foods: FoodSummary[] }>("/api/foods/recent?limit=" + limit),
  getCategories: () => http<{ categories: string[] }>("/api/categories"),
  getTags: () => http<{ tags: string[] }>("/api/tags"),

  getJob: (id: string) => http<JobStatus>("/api/jobs/" + encodeURIComponent(id)),
  getJobByFood: (foodId: string) => http<{ job: any; events: JobEvent[] }>("/api/jobs/by-food/" + encodeURIComponent(foodId))
};
