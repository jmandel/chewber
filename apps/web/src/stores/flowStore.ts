import { create } from "zustand";
import { api } from "../api";
import type {
  AssistResponse,
  PriorAnswer,
  StructuredFoodQuery,
} from "../api";
import { useFoodStore } from "./foodStore";

export type FlowStep =
  | { kind: "idle" }
  | { kind: "thinking"; label: string }
  | { kind: "clarify"; assist: AssistResponse; rawText: string; priorAnswers: PriorAnswer[] }
  | { kind: "resolving"; query: StructuredFoodQuery }
  | { kind: "error"; message: string };

type FlowState = {
  flow: FlowStep;
  imageIds: string[];
  _navigate: ((path: string, opts?: { replace?: boolean }) => void) | null;

  setFlow: (flow: FlowStep) => void;
  setNavigate: (fn: (path: string, opts?: { replace?: boolean }) => void) => void;
  setImageIds: (ids: string[]) => void;
  search: (rawText: string) => Promise<void>;
  lookupBarcode: (barcode: string) => Promise<void>;
  submitClarification: (answers: PriorAnswer[], rawText: string, allPriorAnswers: PriorAnswer[]) => Promise<void>;
  skipClarification: () => void;
  resolve: (query: StructuredFoodQuery, rawText?: string) => Promise<void>;
  reset: () => void;
};

export const useFlowStore = create<FlowState>()((set, get) => {
  const nav = (path: string, opts?: { replace?: boolean }) => {
    const fn = get()._navigate;
    if (fn) fn(path, opts);
  };

  return {
    flow: { kind: "idle" },
    imageIds: [],
    _navigate: null,

    setFlow: (flow) => set({ flow }),
    setNavigate: (fn) => set({ _navigate: fn }),
    setImageIds: (ids) => set({ imageIds: ids }),
    reset: () => set({ flow: { kind: "idle" }, imageIds: [] }),

    search: async (rawText) => {
      set({ flow: { kind: "thinking", label: rawText } });
      try {
        const res = await api.assist(rawText, get().imageIds);
        if (res.rejected) {
          set({ imageIds: [], flow: { kind: "error", message: res.rejection_reason || "That doesn\u2019t appear to be a food or beverage." } });
          return;
        }
        if (res.needs_followup && res.questions.length > 0) {
          set({ flow: { kind: "clarify", assist: res, rawText, priorAnswers: [] } });
          // Note: imageIds kept alive during clarification — they may still be needed
        } else {
          await get().resolve(res.structured_query, rawText);
        }
      } catch (e: any) {
        set({ imageIds: [], flow: { kind: "error", message: String(e?.message ?? e) } });
      }
    },

    lookupBarcode: async (barcode) => {
      set({ flow: { kind: "resolving", query: { name: `Barcode ${barcode}`, barcode } } });
      try {
        const query = { name: barcode, barcode, kind: "unknown" as const };
        const r = await api.resolve({ structured_query: query, rawText: `barcode: ${barcode}`, imageIds: get().imageIds });
        set({ imageIds: [] });
        if (r.kind === "found") {
          useFoodStore.getState().setFood(r.food);
          nav(`/food/${encodeURIComponent(r.food.slug || r.food.id)}`, { replace: true });
        } else if (r.kind === "queued") {
          nav(`/job/${encodeURIComponent(r.job_id)}`, { replace: true });
          set({ flow: { kind: "idle" } });
        } else {
          set({ flow: { kind: "error", message: r.reason || "Barcode lookup failed." } });
        }
      } catch (e: any) {
        set({ flow: { kind: "error", message: `Barcode lookup failed: ${e?.message ?? e}` } });
      }
    },

    submitClarification: async (answers, rawText, allPriorAnswers) => {
      const accumulated = [...allPriorAnswers, ...answers];
      set({ flow: { kind: "thinking", label: rawText } });
      try {
        const res = await api.assist(rawText, get().imageIds, undefined, accumulated);
        if (res.rejected) {
          set({ imageIds: [], flow: { kind: "error", message: res.rejection_reason || "That doesn\u2019t appear to be a food or beverage." } });
          return;
        }
        if (res.needs_followup && res.questions.length > 0) {
          set({ flow: { kind: "clarify", assist: res, rawText, priorAnswers: accumulated } });
        } else {
          await get().resolve(res.structured_query, rawText);
        }
      } catch (e: any) {
        set({ imageIds: [], flow: { kind: "error", message: String(e?.message ?? e) } });
      }
    },

    skipClarification: () => {
      const { flow } = get();
      if (flow.kind === "clarify") {
        get().resolve(flow.assist.structured_query, flow.rawText);
      }
    },

    resolve: async (query, rawText) => {
      set({ flow: { kind: "resolving", query } });
      try {
        const r = await api.resolve({ structured_query: query, rawText, imageIds: get().imageIds });
        // Clear image attachments after resolve so they don't leak into the next search
        set({ imageIds: [] });
        if (r.kind === "rejected") {
          set({ flow: { kind: "error", message: r.reason || "That doesn\u2019t appear to be a food or beverage." } });
        } else if (r.kind === "found") {
          useFoodStore.getState().setFood(r.food);
          nav(`/food/${encodeURIComponent(r.food.slug || r.food.id)}`, { replace: true });
        } else {
          nav(`/job/${encodeURIComponent(r.job_id)}`, { replace: true });
          set({ flow: { kind: "idle" } });
        }
      } catch (e: any) {
        set({ imageIds: [] });
        set({ flow: { kind: "error", message: String(e?.message ?? e) } });
      }
    },
  };
});
