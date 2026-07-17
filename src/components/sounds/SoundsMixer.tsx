"use client";

import { useEffect, useReducer, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { SOUNDS, SOUND_CATEGORIES } from "@/lib/sounds";
import { useSoundStore, channelOf } from "@/lib/sound-store";
import { onSoundError, isUnavailable, unlockAudio } from "@/lib/audio-engine";
import { VolumeSlider } from "./VolumeSlider";
import { cn } from "@/lib/utils";

export function SoundsMixer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const master = useSoundStore((s) => s.master);
  const setMaster = useSoundStore((s) => s.setMaster);
  const channels = useSoundStore((s) => s.channels);
  const toggle = useSoundStore((s) => s.toggle);
  const setVolume = useSoundStore((s) => s.setVolume);
  const stopAll = useSoundStore((s) => s.stopAll);

  const [, force] = useReducer((n: number) => n + 1, 0);
  const [isFs, setIsFs] = useState(false);

  // Re-render when a file sound reports it failed to load (greys the tile out).
  useEffect(() => onSoundError(force), []);

  // Track fullscreen state.
  useEffect(() => {
    const on = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen?.();
    }
  };

  const activeCount = Object.values(channels).filter(
    (c) => c.active && c.volume > 0
  ).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close sounds mixer"
            className="fixed inset-0 z-30 cursor-default"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Soundscape mixer"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed",
              left: "50%",
              bottom: 92,
              transformOrigin: "bottom center",
              borderRadius: 24,
              width: "min(94vw, 540px)",
              // Deeper frost so every option stays legible over bright scenes,
              // with a lighter blur radius than .glass to cut GPU cost.
              background: "rgba(15, 13, 20, 0.74)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            className="glass z-40 -translate-x-1/2 p-4"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h2 className="text-[15px] font-semibold text-white">Sounds</h2>
                <span className="text-[11px] text-white/50">
                  {activeCount > 0 ? `${activeCount} playing` : "mix your ambience"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IconBtn
                  label={isFs ? "Exit fullscreen" : "Fullscreen"}
                  onClick={toggleFullscreen}
                >
                  {isFs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </IconBtn>
                <IconBtn
                  label="Stop all"
                  onClick={stopAll}
                  disabled={activeCount === 0}
                >
                  <VolumeX size={16} />
                </IconBtn>
                <IconBtn label="Close" onClick={onClose}>
                  <X size={16} />
                </IconBtn>
              </div>
            </div>

            {/* Master */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3 py-2.5">
              <Volume2 size={16} className="shrink-0 text-white/70" />
              <div className="flex-1">
                <VolumeSlider
                  label="Master"
                  value={master}
                  onChange={setMaster}
                  accent="rgba(255,255,255,0.92)"
                />
              </div>
              <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-white/50">
                {Math.round(master * 100)}
              </span>
            </div>

            {/* Sound tiles by category */}
            <div className="max-h-[46vh] space-y-3 overflow-y-auto pr-1">
              {SOUND_CATEGORIES.map((cat) => (
                <section key={cat}>
                  <h3 className="mb-1.5 px-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {SOUNDS.filter((s) => s.category === cat).map((s) => {
                      const ch = channelOf(channels, s.id);
                      const on = ch.active && ch.volume > 0;
                      const dead = isUnavailable(s.id);
                      const Icon = s.icon;
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            "rounded-2xl p-2.5 ring-1 transition-colors",
                            on
                              ? "bg-white/[0.12] ring-white/25"
                              : "bg-white/[0.04] ring-white/10",
                            dead && "opacity-40"
                          )}
                        >
                          <button
                            onClick={() => {
                              if (dead) return;
                              unlockAudio();
                              toggle(s.id);
                            }}
                            disabled={dead}
                            aria-pressed={on}
                            title={dead ? "Add /public/sounds/" + s.id + ".mp3" : s.label}
                            className="flex w-full items-center gap-2"
                          >
                            <span
                              className={cn(
                                "grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors",
                                on ? "bg-white/20 text-white" : "bg-white/8 text-white/70"
                              )}
                            >
                              <Icon size={15} strokeWidth={1.9} />
                            </span>
                            <span className="text-[12px] font-medium text-white/90">
                              {s.label}
                            </span>
                          </button>
                          <div
                            className={cn(
                              "grid transition-all duration-300",
                              on
                                ? "mt-2 grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            )}
                          >
                            <div className="overflow-hidden">
                              <VolumeSlider
                                label={s.label}
                                value={ch.volume}
                                onChange={(v) => {
                                  unlockAudio();
                                  setVolume(s.id, v);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
