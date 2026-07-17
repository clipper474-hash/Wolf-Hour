"use client";

import { useEffect } from "react";
import { useSoundStore } from "@/lib/sound-store";
import { reconcile, unlockAudio } from "@/lib/audio-engine";

/**
 * Headless. Mounted once at the app root; keeps the audio engine in sync with
 * the mixer store so soundscapes keep playing while the panel is closed.
 */
export function SoundEngine() {
  const master = useSoundStore((s) => s.master);
  const channels = useSoundStore((s) => s.channels);

  // Autoplay policy: resume the AudioContext on the first user gesture.
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    reconcile(master, channels);
  }, [master, channels]);

  return null;
}
