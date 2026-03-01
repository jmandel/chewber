// === FILE: stores/uiStore.ts ===
import { create } from "zustand";

const ADMIN_KEY_STORAGE = "chewber_admin_key";

type UIState = {
  menuOpen: boolean;
  showAbout: boolean;
  adminKey: string;

  toggleMenu: () => void;
  closeMenu: () => void;
  openAbout: () => void;
  closeAbout: () => void;
  setAdminKey: (key: string) => void;
  clearAdmin: () => void;
  isAdmin: () => boolean;
  getAdminKey: () => string;
};

export const useUIStore = create<UIState>()((set, get) => ({
  menuOpen: false,
  showAbout: false,
  adminKey: typeof localStorage !== "undefined"
    ? localStorage.getItem(ADMIN_KEY_STORAGE) ?? ""
    : "",

  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  openAbout: () => set({ showAbout: true }),
  closeAbout: () => set({ showAbout: false }),

  setAdminKey: (key: string) => {
    localStorage.setItem(ADMIN_KEY_STORAGE, key);
    set({ adminKey: key });
  },

  clearAdmin: () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    set({ adminKey: "" });
  },

  isAdmin: () => get().adminKey.length > 0,
  getAdminKey: () => get().adminKey,
}));
