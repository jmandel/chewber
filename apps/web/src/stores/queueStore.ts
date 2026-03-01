// === FILE: stores/queueStore.ts ===
import { create } from "zustand";
import { api } from "../api";
import type { QueueJob, JobEvent } from "../api";

type QueueState = {
  queueStatus: { queued: number; running: number } | null;
  statusPolling: boolean;
  jobs: QueueJob[];
  jobsLoaded: boolean;
  researchLogs: Record<string, { job: any; events: JobEvent[] }>;

  startStatusPolling: () => () => void;
  fetchJobs: () => Promise<void>;
  fetchResearchLog: (foodId: string) => Promise<void>;
  retryJob: (jobId: string, adminKey: string) => Promise<void>;
};

export const useQueueStore = create<QueueState>()((set, get) => ({
  queueStatus: null,
  statusPolling: false,
  jobs: [],
  jobsLoaded: false,
  researchLogs: {},

  startStatusPolling: () => {
    if (get().statusPolling) return () => {};
    set({ statusPolling: true });

    let cancelled = false;

    const poll = async () => {
      while (!cancelled) {
        try {
          const status = await api.getQueueStatus();
          if (cancelled) break;
          set({ queueStatus: status });
        } catch {
          // swallow polling errors
        }
        await new Promise((r) => setTimeout(r, 5000));
      }
    };

    poll();

    return () => {
      cancelled = true;
      set({ statusPolling: false });
    };
  },

  fetchJobs: async () => {
    const { jobs } = await api.getQueueRecent();
    set({ jobs, jobsLoaded: true });
  },

  fetchResearchLog: async (foodId: string) => {
    if (get().researchLogs[foodId]) return;
    const data = await api.getJobByFood(foodId);
    set((s) => ({
      researchLogs: { ...s.researchLogs, [foodId]: data },
    }));
  },

  retryJob: async (jobId: string, adminKey: string) => {
    await api.retryJob(jobId, adminKey);
    await get().fetchJobs();
  },
}));
