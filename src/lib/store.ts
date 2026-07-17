import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SCENES, DEFAULT_SCENE, type Scene } from "./scenes";

type SceneState = {
  sceneId: string;
  setScene: (id: string) => void;
};

/** Current ambient scene (persisted to localStorage). Seeds the theme engine. */
export const useSceneStore = create<SceneState>()(
  persist(
    (set) => ({
      sceneId: DEFAULT_SCENE.id,
      setScene: (id) => set({ sceneId: id }),
    }),
    { name: "polaris-scene" }
  )
);

export const sceneById = (id: string): Scene =>
  SCENES.find((s) => s.id === id) ?? DEFAULT_SCENE;

/** Clock & font style + 12/24h + seconds (persisted). */
type ClockPrefs = {
  presetId: string;
  hour12: boolean;
  showSeconds: boolean;
  setPreset: (id: string) => void;
  setHour12: (v: boolean) => void;
  setShowSeconds: (v: boolean) => void;
};

export const useClockStore = create<ClockPrefs>()(
  persist(
    (set) => ({
      presetId: "standard",
      hour12: false,
      showSeconds: false,
      setPreset: (presetId) => set({ presetId }),
      setHour12: (hour12) => set({ hour12 }),
      setShowSeconds: (showSeconds) => set({ showSeconds }),
    }),
    { name: "polaris-clock" }
  )
);
