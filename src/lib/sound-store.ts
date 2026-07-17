import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Channel = { volume: number; active: boolean };

type SoundState = {
  master: number;
  channels: Record<string, Channel>;
  toggle: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  setMaster: (v: number) => void;
  stopAll: () => void;
  activeCount: () => number;
};

const DEFAULT_VOLUME = 0.6;

/**
 * Soundscape mixer state (persisted). Each channel keeps its own volume even
 * when muted, so re-enabling restores the previous level. The audio engine
 * (`SoundEngine`) reconciles this state into live Howl / Web Audio nodes.
 */
export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      master: 0.8,
      channels: {},

      toggle: (id) =>
        set((s) => {
          const prev = s.channels[id] ?? { volume: DEFAULT_VOLUME, active: false };
          return {
            channels: { ...s.channels, [id]: { ...prev, active: !prev.active } },
          };
        }),

      setVolume: (id, volume) =>
        set((s) => {
          const prev = s.channels[id] ?? { volume: DEFAULT_VOLUME, active: false };
          // Dragging the slider up from zero implicitly activates the channel.
          const active = volume > 0 ? true : prev.active;
          return {
            channels: { ...s.channels, [id]: { volume, active } },
          };
        }),

      setMaster: (master) => set({ master }),

      stopAll: () =>
        set((s) => {
          const channels: Record<string, Channel> = {};
          for (const [id, c] of Object.entries(s.channels)) {
            channels[id] = { ...c, active: false };
          }
          return { channels };
        }),

      activeCount: () =>
        Object.values(get().channels).filter((c) => c.active && c.volume > 0)
          .length,
    }),
    { name: "polaris-sounds" }
  )
);

export const channelOf = (
  channels: Record<string, Channel>,
  id: string
): Channel => channels[id] ?? { volume: DEFAULT_VOLUME, active: false };
