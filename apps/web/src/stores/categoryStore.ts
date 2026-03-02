// === FILE: stores/categoryStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { Category, FoodSummary } from "../api";
import { setTagKindsRef } from "../components/shared";

export type CategorySort = "recent" | "score_desc" | "score_asc";

type CategoryState = {
  categories: Category[];
  categoriesLoaded: boolean;
  categoryFoods: Record<string, FoodSummary[]>;
  categoryAllFoods: Record<string, FoodSummary[]>;
  catCounts: Record<string, number>;
  /** Maps slug → kind for all known tags. Used by isCategory(). */
  tagKinds: Record<string, string>;

  fetchCategories: () => Promise<void>;
  fetchCategoryFoods: (slug: string, sort: CategorySort) => Promise<FoodSummary[]>;
  fetchCategoryAllFoods: (slug: string) => Promise<FoodSummary[]>;
  getCatCounts: () => Promise<Record<string, number>>;
};

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  categoriesLoaded: false,
  categoryFoods: {},
  categoryAllFoods: {},
  catCounts: {},
  tagKinds: {},

  fetchCategories: async () => {
    if (get().categoriesLoaded) return;
    const { categories } = await api.getCategories();
    const counts: Record<string, number> = {};
    const kinds: Record<string, string> = {};
    for (const c of categories) {
      counts[c.slug] = c.food_count;
      kinds[c.slug] = c.kind;
    }
    setTagKindsRef(kinds);
    set({ categories, categoriesLoaded: true, catCounts: counts, tagKinds: kinds });
  },

  fetchCategoryFoods: async (slug: string, sort: CategorySort) => {
    const key = `${slug}:${sort}`;
    const cached = get().categoryFoods[key];
    if (cached) return cached;
    const { foods } = await api.searchFoodsByCategory(slug, sort);
    set((s) => ({ categoryFoods: { ...s.categoryFoods, [key]: foods } }));
    return foods;
  },

  fetchCategoryAllFoods: async (slug: string) => {
    const cached = get().categoryAllFoods[slug];
    if (cached) return cached;
    const { foods } = await api.searchFoodsByCategory(slug);
    set((s) => ({ categoryAllFoods: { ...s.categoryAllFoods, [slug]: foods } }));
    return foods;
  },

  getCatCounts: async () => {
    const state = get();
    if (!state.categoriesLoaded) {
      await state.fetchCategories();
    }
    return get().catCounts;
  },
}));
