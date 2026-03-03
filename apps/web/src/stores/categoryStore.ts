// === FILE: stores/categoryStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { Category, CategoryTreeNode, FoodSummary } from "../api";
import { setTagKindsRef } from "../components/shared";

export type CategorySort = "recent" | "score_desc" | "score_asc";

type PaginatedFoods = {
  foods: FoodSummary[];
  total: number;
  hasMore: boolean;
};

type CategoryState = {
  categories: Category[];
  categoriesLoaded: boolean;
  tree: CategoryTreeNode[] | null;
  treeLoaded: boolean;
  /** Paginated food lists keyed by "slug:sort" */
  categoryFoods: Record<string, PaginatedFoods>;
  /** All foods for stats (score bar, top 3) — separate from paginated list */
  categoryAllFoods: Record<string, FoodSummary[]>;
  catCounts: Record<string, number>;
  tagKinds: Record<string, string>;

  fetchCategories: () => Promise<void>;
  fetchTree: () => Promise<void>;
  fetchCategoryFoods: (slug: string, sort: CategorySort) => Promise<PaginatedFoods>;
  fetchMoreCategoryFoods: (slug: string, sort: CategorySort) => Promise<void>;
  fetchCategoryAllFoods: (slug: string) => Promise<FoodSummary[]>;
  getCatCounts: () => Promise<Record<string, number>>;
};

const PAGE_SIZE = 100;

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  categoriesLoaded: false,
  tree: null,
  treeLoaded: false,
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

  fetchTree: async () => {
    if (get().treeLoaded) return;
    const { tree } = await api.getCategoryTree();
    set({ tree, treeLoaded: true });
  },

  fetchCategoryFoods: async (slug: string, sort: CategorySort) => {
    const key = `${slug}:${sort}`;
    const cached = get().categoryFoods[key];
    if (cached) return cached;
    const { foods, total } = await api.searchFoodsByCategory(slug, sort, PAGE_SIZE, 0);
    const page: PaginatedFoods = { foods, total, hasMore: foods.length < total };
    set((s) => ({ categoryFoods: { ...s.categoryFoods, [key]: page } }));
    return page;
  },

  fetchMoreCategoryFoods: async (slug: string, sort: CategorySort) => {
    const key = `${slug}:${sort}`;
    const current = get().categoryFoods[key];
    if (!current || !current.hasMore) return;
    const offset = current.foods.length;
    const { foods, total } = await api.searchFoodsByCategory(slug, sort, PAGE_SIZE, offset);
    const merged = [...current.foods, ...foods];
    set((s) => ({
      categoryFoods: {
        ...s.categoryFoods,
        [key]: { foods: merged, total, hasMore: merged.length < total }
      }
    }));
  },

  fetchCategoryAllFoods: async (slug: string) => {
    const cached = get().categoryAllFoods[slug];
    if (cached) return cached;
    const { foods } = await api.searchFoodsByCategory(slug, undefined, 200, 0);
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
