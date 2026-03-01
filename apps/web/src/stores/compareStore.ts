// === FILE: stores/compareStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { FoodDetail, FoodSummary } from "../api";

type CompareState = {
  foods: FoodDetail[];
  suggestions: FoodSummary[];
  searchQ: string;
  searchHits: FoodSummary[];
  _timer: ReturnType<typeof setTimeout> | null;

  loadInitialFoods: (ids: string[]) => Promise<void>;
  addFood: (id: string) => Promise<void>;
  removeFood: (id: string) => void;
  setSearchQ: (q: string) => void;
  _refreshSuggestions: () => Promise<void>;
};

export const useCompareStore = create<CompareState>()((set, get) => {
  const refreshSuggestions = async () => {
    const { foods } = get();
    if (foods.length === 0) {
      set({ suggestions: [] });
      return;
    }

    const first = foods[0];
    const existingIds = new Set(foods.map((f) => f.id));

    try {
      // Try category-based suggestions from first food's category
      let candidates: FoodSummary[] = [];
      const categoryPath = first.category_path;
      if (categoryPath) {
        const slug = categoryPath.split("/").pop() ?? categoryPath;
        const { foods: catFoods } = await api.searchFoodsByCategory(slug, "score_desc");
        candidates = catFoods;
      }

      // Fallback to recent if no category results
      if (candidates.length === 0) {
        const { foods: recent } = await api.getRecentFoods(20);
        candidates = recent;
      }

      const filtered = candidates.filter((f) => !existingIds.has(f.id)).slice(0, 6);
      set({ suggestions: filtered });
    } catch {
      set({ suggestions: [] });
    }
  };

  return {
    foods: [],
    suggestions: [],
    searchQ: "",
    searchHits: [],
    _timer: null,

    loadInitialFoods: async (ids: string[]) => {
      const results = await Promise.all(ids.map((id) => api.getFood(id).catch(() => null)));
      const loaded = results.filter(Boolean) as FoodDetail[];
      set({ foods: loaded });
      refreshSuggestions();
    },

    addFood: async (id: string) => {
      const existing = get().foods;
      if (existing.some((f) => f.id === id)) return;

      try {
        const food = await api.getFood(id);
        set((s) => ({
          foods: [...s.foods, food],
          searchQ: "",
          searchHits: [],
        }));
        refreshSuggestions();
      } catch {
        // ignore fetch errors
      }
    },

    removeFood: (id: string) => {
      set((s) => ({ foods: s.foods.filter((f) => f.id !== id) }));
      refreshSuggestions();
    },

    setSearchQ: (q: string) => {
      const prev = get()._timer;
      if (prev) clearTimeout(prev);

      if (!q.trim()) {
        set({ searchQ: q, searchHits: [], _timer: null });
        return;
      }

      const timer = setTimeout(async () => {
        try {
          const { foods } = await api.searchFoods(q.trim());
          if (get().searchQ === q) {
            const existingIds = new Set(get().foods.map((f) => f.id));
            set({ searchHits: foods.filter((f) => !existingIds.has(f.id)) });
          }
        } catch {
          // swallow
        }
      }, 200);

      set({ searchQ: q, _timer: timer });
    },

    _refreshSuggestions: refreshSuggestions,
  };
});
