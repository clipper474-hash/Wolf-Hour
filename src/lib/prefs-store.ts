import { create } from "zustand";
import { persist } from "zustand/middleware";

type Prefs = {
  /** Personalises the greeting ("" → falls back to "there"). */
  name: string;
  /** Custom liquid cursor on/off (off → native cursor returns). */
  cursor: boolean;
  /** Home quote index (mod list length) + visibility. */
  quoteIdx: number;
  showQuote: boolean;
  /** Site-wide colour theme (landing + app). Additive — old visitors default to dark. */
  theme: "dark" | "light";
  setName: (v: string) => void;
  setCursor: (v: boolean) => void;
  nextQuote: () => void;
  setShowQuote: (v: boolean) => void;
  setTheme: (v: "dark" | "light") => void;
};

export const usePrefsStore = create<Prefs>()(
  persist(
    (set) => ({
      name: "",
      cursor: true,
      quoteIdx: 0,
      showQuote: true,
      theme: "dark",
      setName: (name) => set({ name }),
      setCursor: (cursor) => set({ cursor }),
      nextQuote: () => set((s) => ({ quoteIdx: s.quoteIdx + 1 })),
      setShowQuote: (showQuote) => set({ showQuote }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "af-prefs" }
  )
);
