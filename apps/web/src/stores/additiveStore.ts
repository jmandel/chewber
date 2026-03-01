// === FILE: stores/additiveStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { AdditiveListItem, AdditiveDetail, FoodSummary } from "../api";

type AdditiveState = {
  allAdditives: AdditiveListItem[] | null;
  listLoaded: boolean;
  details: Record<string, AdditiveDetail>;
  additiveFoods: Record<string, FoodSummary[]>;
  loadingDetails: Set<string>;

  fetchAllAdditives: () => Promise<void>;
  fetchAdditiveDetail: (code: string) => Promise<AdditiveDetail>;
  prefetchAdditiveDetail: (code: string) => void;
  fetchAdditiveFoods: (code: string) => Promise<void>;
};

export const useAdditiveStore = create<AdditiveState>()((set, get) => {
  const _inflight = new Map<string, Promise<AdditiveDetail>>();

  return {
    allAdditives: null,
    listLoaded: false,
    details: {},
    additiveFoods: {},
    loadingDetails: new Set(),

    fetchAllAdditives: async () => {
      if (get().listLoaded) return;
      const { additives } = await api.getAdditives();
      set({ allAdditives: additives, listLoaded: true });
    },

    fetchAdditiveDetail: async (code: string) => {
      const cached = get().details[code];
      if (cached) return cached;

      const existing = _inflight.get(code);
      if (existing) return existing;

      const promise = (async () => {
        set((s) => {
          const next = new Set(s.loadingDetails);
          next.add(code);
          return { loadingDetails: next };
        });
        try {
          const detail = await api.getAdditive(code);
          set((s) => ({ details: { ...s.details, [code]: detail } }));
          return detail;
        } finally {
          _inflight.delete(code);
          set((s) => {
            const next = new Set(s.loadingDetails);
            next.delete(code);
            return { loadingDetails: next };
          });
        }
      })();

      _inflight.set(code, promise);
      return promise;
    },

    prefetchAdditiveDetail: (code: string) => {
      const { details, loadingDetails } = get();
      if (details[code] || loadingDetails.has(code)) return;
      get().fetchAdditiveDetail(code).catch(() => {});
    },

    fetchAdditiveFoods: async (code: string) => {
      if (get().additiveFoods[code]) return;
      const { foods } = await api.getAdditiveFoods(code);
      set((s) => ({ additiveFoods: { ...s.additiveFoods, [code]: foods } }));
    },
  };
});
