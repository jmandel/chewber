/**
 * Accessor hooks — components call these to get store data.
 * Each hook triggers a fetch if the data isn't cached.
 * No useEffect in consuming components.
 */
import { useEffect, useRef } from "react";
import { useFoodStore } from "../stores/foodStore";
import { useCategoryStore, type CategorySort } from "../stores/categoryStore";
import { useAdditiveStore } from "../stores/additiveStore";
import { useQueueStore } from "../stores/queueStore";
import type { FoodDetail, FoodSummary, RelatedFood, AlternativeFood, Category, AdditiveDetail, AdditiveListItem, QueueJob, JobEvent } from "../api";

// ── Food ──

export function useFoodDetail(idOrSlug: string | undefined): { food: FoodDetail | null; loading: boolean } {
  const food = useFoodStore(s => idOrSlug ? s.foods[idOrSlug] ?? null : null);
  const loading = useFoodStore(s => idOrSlug ? s.loadingFoods.has(idOrSlug) : false);
  const fetchFood = useFoodStore.getState().fetchFood;
  const triggered = useRef<string>();
  if (idOrSlug && !food && triggered.current !== idOrSlug) {
    triggered.current = idOrSlug;
    fetchFood(idOrSlug);
  }
  return { food, loading: !food && (loading || triggered.current === idOrSlug) };
}

export function useRecentFoods(): FoodSummary[] {
  const recent = useFoodStore(s => s.recentFoods);
  const triggered = useRef(false);
  if (!recent && !triggered.current) {
    triggered.current = true;
    useFoodStore.getState().fetchRecent();
  }
  return recent ?? [];
}

export function useTopRated(): FoodSummary[] {
  const topRated = useFoodStore(s => s.topRated);
  const triggered = useRef(false);
  if (!topRated && !triggered.current) {
    triggered.current = true;
    useFoodStore.getState().fetchTopRated();
  }
  return topRated ?? [];
}

export function useAlternatives(food: FoodDetail): AlternativeFood[] {
  const alts = useFoodStore(s => s.alternatives[food.id]);
  const triggered = useRef<string>();
  if (!alts && food.score != null && food.score < 75 && triggered.current !== food.id) {
    triggered.current = food.id;
    useFoodStore.getState().fetchAlternatives(food);
  }
  return alts ?? [];
}

export function useRelatedFoods(foodId: string): RelatedFood[] {
  const related = useFoodStore(s => s.related[foodId]);
  const triggered = useRef<string>();
  if (!related && triggered.current !== foodId) {
    triggered.current = foodId;
    useFoodStore.getState().fetchRelated(foodId);
  }
  return related ?? [];
}

// ── Categories ──

export function useCategories(): { categories: Category[]; loaded: boolean } {
  const categories = useCategoryStore(s => s.categories);
  const loaded = useCategoryStore(s => s.categoriesLoaded);
  const triggered = useRef(false);
  if (!loaded && !triggered.current) {
    triggered.current = true;
    useCategoryStore.getState().fetchCategories();
  }
  return { categories, loaded };
}

export function useCatCounts(): Record<string, number> {
  const counts = useCategoryStore(s => s.catCounts);
  const loaded = useCategoryStore(s => s.categoriesLoaded);
  const triggered = useRef(false);
  if (!loaded && !triggered.current) {
    triggered.current = true;
    useCategoryStore.getState().fetchCategories();
  }
  return counts;
}

export function useTagKinds(): Record<string, string> {
  const kinds = useCategoryStore(s => s.tagKinds);
  const loaded = useCategoryStore(s => s.categoriesLoaded);
  const triggered = useRef(false);
  if (!loaded && !triggered.current) {
    triggered.current = true;
    useCategoryStore.getState().fetchCategories();
  }
  return kinds;
}

export function useCategoryFoods(slug: string | undefined, sort: CategorySort): FoodSummary[] | null {
  const key = slug ? `${slug}:${sort}` : "";
  const foods = useCategoryStore(s => key ? s.categoryFoods[key] ?? null : null);
  const triggered = useRef<string>();
  if (slug && !foods && triggered.current !== key) {
    triggered.current = key;
    useCategoryStore.getState().fetchCategoryFoods(slug, sort);
  }
  return foods;
}

export function useCategoryAllFoods(slug: string | undefined): FoodSummary[] | null {
  const foods = useCategoryStore(s => slug ? s.categoryAllFoods[slug] ?? null : null);
  const triggered = useRef<string>();
  if (slug && !foods && triggered.current !== slug) {
    triggered.current = slug;
    useCategoryStore.getState().fetchCategoryAllFoods(slug);
  }
  return foods;
}

// ── Additives ──

export function useAdditivesList(): { additives: AdditiveListItem[] | null; loaded: boolean } {
  const additives = useAdditiveStore(s => s.allAdditives);
  const loaded = useAdditiveStore(s => s.listLoaded);
  const triggered = useRef(false);
  if (!loaded && !triggered.current) {
    triggered.current = true;
    useAdditiveStore.getState().fetchAllAdditives();
  }
  return { additives, loaded };
}

export function useAdditiveDetail(code: string | undefined): { detail: AdditiveDetail | null; loading: boolean } {
  const detail = useAdditiveStore(s => code ? s.details[code] ?? null : null);
  const loading = useAdditiveStore(s => code ? s.loadingDetails.has(code) : false);
  const triggered = useRef<string>();
  if (code && !detail && triggered.current !== code) {
    triggered.current = code;
    useAdditiveStore.getState().fetchAdditiveDetail(code);
  }
  return { detail, loading: !detail && (loading || triggered.current === code) };
}

export function useAdditiveFoods(code: string): FoodSummary[] | null {
  const foods = useAdditiveStore(s => s.additiveFoods[code] ?? null);
  const triggered = useRef<string>();
  if (!foods && triggered.current !== code) {
    triggered.current = code;
    useAdditiveStore.getState().fetchAdditiveFoods(code);
  }
  return foods;
}

// ── Queue ──

export function useQueueJobs(): { jobs: QueueJob[]; loaded: boolean } {
  const jobs = useQueueStore(s => s.jobs);
  const loaded = useQueueStore(s => s.jobsLoaded);
  const triggered = useRef(false);
  if (!loaded && !triggered.current) {
    triggered.current = true;
    useQueueStore.getState().fetchJobs();
  }
  return { jobs, loaded };
}

export function useResearchLog(foodId: string): { job: any; events: JobEvent[] } | null {
  const log = useQueueStore(s => s.researchLogs[foodId] ?? null);
  const triggered = useRef<string>();
  if (!log && triggered.current !== foodId) {
    triggered.current = foodId;
    useQueueStore.getState().fetchResearchLog(foodId);
  }
  return log;
}
