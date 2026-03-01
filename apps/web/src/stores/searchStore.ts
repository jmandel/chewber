// === FILE: stores/searchStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { FoodSummary } from "../api";

type SearchState = {
  query: string;
  hits: FoodSummary[];
  _timer: ReturnType<typeof setTimeout> | null;

  setQuery: (q: string) => void;
  clearSearch: () => void;
};

export const useSearchStore = create<SearchState>()((set, get) => ({
  query: "",
  hits: [],
  _timer: null,

  setQuery: (q: string) => {
    const prev = get()._timer;
    if (prev) clearTimeout(prev);

    if (!q.trim()) {
      set({ query: q, hits: [], _timer: null });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { foods } = await api.searchFoods(q.trim());
        // Only apply if query hasn't changed since we fired
        if (get().query === q) {
          set({ hits: foods });
        }
      } catch {
        // swallow search errors
      }
    }, 200);

    set({ query: q, _timer: timer });
  },

  clearSearch: () => {
    const prev = get()._timer;
    if (prev) clearTimeout(prev);
    set({ query: "", hits: [], _timer: null });
  },
}));
