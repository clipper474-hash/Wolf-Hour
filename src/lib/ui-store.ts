import { create } from "zustand";

export type Mode = "home" | "focus" | "ambient" | "aspirant";
export type AspirantPanel = "timer" | "goals" | "calendar" | "stats";

type UIState = {
  mode: Mode;
  setMode: (m: Mode) => void;
  clockPickerOpen: boolean;
  setClockPickerOpen: (v: boolean) => void;
  aspirantPanel: AspirantPanel;
  setAspirantPanel: (p: AspirantPanel) => void;
  timerFullscreen: boolean;
  setTimerFullscreen: (v: boolean) => void;
};

/** Current app mode + transient UI flags (not persisted). */
export const useUIStore = create<UIState>((set) => ({
  mode: "home",
  setMode: (mode) => set({ mode }),
  clockPickerOpen: false,
  setClockPickerOpen: (clockPickerOpen) => set({ clockPickerOpen }),
  aspirantPanel: "timer",
  setAspirantPanel: (aspirantPanel) => set({ aspirantPanel }),
  timerFullscreen: false,
  setTimerFullscreen: (timerFullscreen) => set({ timerFullscreen }),
}));
