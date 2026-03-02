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

export type PriorAnswer = { question_id: string; answer: string };

export type AssistResponse = {
  rejected?: boolean;
  rejection_reason?: string | null;
  structured_query: StructuredFoodQuery;
  needs_followup: boolean;
  has_more_rounds: boolean;
  questions: HelperQuestion[];
  confidence: number;
  why_questions?: string;
};

export type ResolveResponse =
  | { kind: "found"; food: FoodDetail }
  | { kind: "queued"; job_id: string; query_id: string }
  | { kind: "rejected"; reason: string };

export type FoodSummary = {
  id: string;
  slug: string;
  barcode?: string | null;
  canonical_name: string;
  brand?: string | null;
  category_path?: string | null;
  tags: string[];
  score?: number | null;
  organic?: string | null;
};

export type RelatedFood = FoodSummary & {
  shared_tags: string[];
};

export type Category = {
  slug: string;
  display_name: string;
  description: string;
  food_count: number;
};

export type TagInfo = {
  slug: string;
  display_name: string;
  count: number;
};

export type FoodDetail = FoodSummary & {
  abstraction?: any;
  report_md?: string | null;
  score_breakdown?: any;
  updated_at?: string;
};

export type QueueJob = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed" | "canceled";
  progress: number;
  error?: string | null;
  created_at: string;
  finished_at?: string | null;
  label?: string;
  query_status?: string | null;
  result_food_id?: string | null;
  food_name?: string | null;
  food_brand?: string | null;
  food_slug?: string | null;
};

export type JobStatus = {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed" | "canceled";
  progress: number;
  result_food_id?: string | null;
  error?: string | null;
  label?: string;
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

export type AdditiveListItem = {
  code: string;
  name: string | null;
  risk_level: string;
  function_category: string | null;
  description: string | null;
  has_research: boolean;
  updated_at: string;
};

export type AdditiveResearchData = {
  report_md: string;
  abstraction: Record<string, any> | null;
};

export type AdditiveDetail = {
  code: string;
  name: string | null;
  risk_level: string | null;
  function_category: string | null;
  description: string | null;
  justification: string | null;
  updated_at: string | null;
  research: AdditiveResearchData | null;
};

export const api = {
  assist: (rawText: string, imageIds: string[] = [], barcode?: string, priorAnswers?: PriorAnswer[]) =>
    http<AssistResponse>("/api/query/assist", {
      method: "POST",
      body: JSON.stringify({ rawText, imageIds, barcode, priorAnswers })
    }),

  resolve: (payload: { rawText?: string; structured_query: StructuredFoodQuery; imageIds?: string[] }) =>
    http<ResolveResponse>("/api/resolve", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  searchFoods: (q: string) => http<{ foods: FoodSummary[] }>("/api/foods/search?q=" + encodeURIComponent(q)),
  searchFoodsByTag: (tag: string, sort?: "recent" | "score_desc" | "score_asc") =>
    http<{ foods: FoodSummary[] }>("/api/foods/search?tag=" + encodeURIComponent(tag) + (sort ? "&sort=" + sort : "")),
  searchFoodsByCategory: (category: string, sort?: "recent" | "score_desc" | "score_asc") =>
    http<{ foods: FoodSummary[] }>("/api/foods/search?category=" + encodeURIComponent(category) + (sort ? "&sort=" + sort : "")),
  getFood: (idOrSlug: string) => http<FoodDetail>("/api/foods/" + encodeURIComponent(idOrSlug)),
  getRecentFoods: (limit = 10) => http<{ foods: FoodSummary[] }>("/api/foods/recent?limit=" + limit),
  getCategories: () => http<{ categories: Category[] }>("/api/categories"),
  getTags: () => http<{ tags: TagInfo[] }>("/api/tags"),

  getJob: (id: string) => http<JobStatus>("/api/jobs/" + encodeURIComponent(id)),
  getQueueStatus: () => http<{ queued: number; running: number }>("/api/jobs/queue/status"),
  getQueueRecent: () => http<{ jobs: QueueJob[] }>("/api/jobs/queue/recent"),
  getJobByFood: (foodId: string) => http<{ job: any; events: JobEvent[] }>("/api/jobs/by-food/" + encodeURIComponent(foodId)),
  getRelatedFoods: (idOrSlug: string, limit = 8) => http<{ related: RelatedFood[] }>(`/api/foods/${encodeURIComponent(idOrSlug)}/related?limit=${limit}`),
  getBetterAlternatives: (idOrSlug: string, limit = 5) => http<{ alternatives: FoodSummary[] }>(`/api/foods/${encodeURIComponent(idOrSlug)}/better-alternatives?limit=${limit}`),
  getTopRatedFoods: (limit = 6) => http<{ foods: FoodSummary[] }>(`/api/foods/top-rated?limit=${limit}`),

  retryJob: (id: string, adminKey: string) =>
    fetch(`${API_BASE}/api/jobs/${encodeURIComponent(id)}/retry`, {
      method: "POST",
      headers: { "X-Admin-Key": adminKey },
    }).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),

  deleteFood: (idOrSlug: string, adminKey: string) =>
    fetch(`${API_BASE}/api/foods/${encodeURIComponent(idOrSlug)}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey },
    }).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),

  getAdditives: () => http<{ count: number; additives: AdditiveListItem[] }>("/api/additives"),
  getAdditive: (code: string) => http<AdditiveDetail>("/api/additives/" + encodeURIComponent(code)),
  getAdditiveFoods: (code: string) => http<{ code: string; count: number; foods: FoodSummary[] }>("/api/additives/" + encodeURIComponent(code) + "/foods"),
};
