// === FILE: stores/foodStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { FoodDetail, FoodSummary, RelatedFood, AlternativeFood } from "../api";

type FoodState = {
  foods: Record<string, FoodDetail>;
  recentFoods: FoodSummary[] | null;
  topRated: FoodSummary[] | null;
  alternatives: Record<string, AlternativeFood[]>;
  related: Record<string, RelatedFood[]>;
  loadingFoods: Set<string>;

  fetchFood: (idOrSlug: string) => Promise<FoodDetail>;
  prefetchFood: (idOrSlug: string) => void;
  fetchRecent: () => Promise<void>;
  fetchTopRated: () => Promise<void>;
  fetchAlternatives: (food: FoodDetail) => Promise<void>;
  fetchRelated: (foodId: string) => Promise<void>;
  invalidateFood: (id: string) => void;
  setFood: (food: FoodDetail) => void;
};

export const useFoodStore = create<FoodState>()((set, get) => {
  const _inflight = new Map<string, Promise<FoodDetail>>();

  function cacheFood(food: FoodDetail) {
    set((s) => {
      const next = { ...s.foods };
      next[food.id] = food;
      if (food.slug) next[food.slug] = food;
      return { foods: next };
    });
  }

  return {
    foods: {},
    recentFoods: null,
    topRated: null,
    alternatives: {},
    related: {},
    loadingFoods: new Set(),

    fetchFood: async (idOrSlug: string) => {
      const cached = get().foods[idOrSlug];
      if (cached) return cached;

      const existing = _inflight.get(idOrSlug);
      if (existing) return existing;

      const promise = (async () => {
        set((s) => {
          const next = new Set(s.loadingFoods);
          next.add(idOrSlug);
          return { loadingFoods: next };
        });
        try {
          const food = await api.getFood(idOrSlug);
          cacheFood(food);
          return food;
        } finally {
          _inflight.delete(idOrSlug);
          set((s) => {
            const next = new Set(s.loadingFoods);
            next.delete(idOrSlug);
            return { loadingFoods: next };
          });
        }
      })();

      _inflight.set(idOrSlug, promise);
      return promise;
    },

    prefetchFood: (idOrSlug: string) => {
      const { foods, loadingFoods } = get();
      if (foods[idOrSlug] || loadingFoods.has(idOrSlug)) return;
      get().fetchFood(idOrSlug).catch(() => {});
    },

    fetchRecent: async () => {
      if (get().recentFoods !== null) return;
      const { foods } = await api.getRecentFoods();
      set({ recentFoods: foods });
    },

    fetchTopRated: async () => {
      if (get().topRated !== null) return;
      const { foods } = await api.getTopRatedFoods();
      set({ topRated: foods });
    },

    fetchAlternatives: async (food: FoodDetail) => {
      if (food.score === null || food.score === undefined || food.score >= 75) return;
      if (get().alternatives[food.id]) return;
      const { alternatives } = await api.getBetterAlternatives(food.id);
      set((s) => ({ alternatives: { ...s.alternatives, [food.id]: alternatives } }));
    },

    fetchRelated: async (foodId: string) => {
      if (get().related[foodId]) return;
      const { related } = await api.getRelatedFoods(foodId);
      set((s) => ({ related: { ...s.related, [foodId]: related } }));
    },

    invalidateFood: (id: string) => {
      set((s) => {
        const next = { ...s.foods };
        const food = next[id];
        if (food) {
          delete next[food.id];
          if (food.slug) delete next[food.slug];
        } else {
          delete next[id];
        }
        const alts = { ...s.alternatives };
        delete alts[id];
        const rel = { ...s.related };
        delete rel[id];
        return { foods: next, alternatives: alts, related: rel };
      });
    },

    setFood: (food: FoodDetail) => {
      cacheFood(food);
    },
  };
});
