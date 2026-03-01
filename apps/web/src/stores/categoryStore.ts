// === FILE: stores/categoryStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { Category, FoodSummary } from "../api";

export type CategorySort = "recent" | "score_desc" | "score_asc";

type CategoryState = {
  categories: Category[];
  categoriesLoaded: boolean;
  categoryFoods: Record<string, FoodSummary[]>;
  categoryAllFoods: Record<string, FoodSummary[]>;
  catCounts: Record<string, number>;

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

  fetchCategories: async () => {
    if (get().categoriesLoaded) return;
    const { categories } = await api.getCategories();
    const counts: Record<string, number> = {};
    for (const c of categories) counts[c.slug] = c.food_count;
    set({ categories, categoriesLoaded: true, catCounts: counts });
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
