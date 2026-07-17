"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PRESETS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 } as const;
type TMode = "focus" | "short" | "long" | "stopwatch";
const MODES: { key: TMode; label: string }[] = [
  { key: "focus", label: "Focus" },
  { key: "short", label: "Short Break" },
  { key: "long", label: "Long Break" },
  { key: "stopwatch", label: "Stopwatch" },
];

/**
 * Focus timer. The mode selector sits at the TOP of the page (framing the big
 * time), the giant time is centered, transport below. Neutral glass only — no
 * saturated color so it blends over any scene. Stopwatch counts up (clean, no
 * ring); distinct clock styles come later via the Clock & Font picker.
 */
export function FocusTimer() {
  const [tmode, setTmode] = useState<TMode>("focus");
  const [left, setLeft] = useState<number>(PRESETS.focus);
  const [elapsed, setElapsed] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const isStopwatch = tmode === "stopwatch";

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (isStopwatch) setElapsed((e) => e + 1);
      else setLeft((l) => (l <= 1 ? 0 : l - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running, isStopwatch]);

  useEffect(() => {
    if (!isStopwatch && left === 0) setRunning(false);
  }, [left, isStopwatch]);

  const pick = (m: TMode) => {
    setTmode(m);
    setRunning(false);
    if (m === "stopwatch") setElapsed(0);
    else setLeft(PRESETS[m]);
  };
  const reset = () => {
    setRunning(false);
    if (isStopwatch) setElapsed(0);
    else setLeft(PRESETS[tmode]);
  };
  const canRun = isStopwatch || left > 0;

  const value = isStopwatch ? elapsed : left;
  const hrs = Math.floor(value / 3600);
  const mm = Math.floor((value % 3600) / 60);
  const ss = value % 60;

  return (
    <>
      {/* Mode selector — pinned to the TOP of the page, framing the big time. */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        className="glass fixed left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-1 p-1"
        style={{ borderRadius: 9999 }}
      >
        {MODES.map((m) => {
          const active = m.key === tmode;
          return (
            <button
              key={m.key}
              onClick={() => pick(m.key)}
              aria-pressed={active}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              {active && (
                <motion.span
                  layoutId="timer-mode-pill"
                  className="dock-active absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{m.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Centered time + transport */}
      <div
        className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        style={{ textShadow: "0 2px 28px rgba(0,0,0,0.42)" }}
      >
        <time
          aria-label={`${hrs ? String(hrs) + ":" : ""}${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`}
          className="font-display tabular flex items-center leading-none text-snow"
          style={{ fontSize: "clamp(4.5rem, 15vw, 10rem)", letterSpacing: "-0.03em" }}
        >
          {hrs > 0 && (
            <>
              <NumberFlow value={hrs} />
              <span className="px-[0.06em] opacity-60">:</span>
            </>
          )}
          <NumberFlow value={mm} format={{ minimumIntegerDigits: 2 }} />
          <span className="px-[0.06em] opacity-60">:</span>
          <NumberFlow value={ss} format={{ minimumIntegerDigits: 2 }} />
        </time>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => canRun && setRunning((r) => !r)}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            className="glass flex items-center gap-2 px-7 py-3 text-base font-medium text-white"
            style={{ borderRadius: 9999 }}
            aria-label={running ? "Pause" : "Start"}
          >
            {running ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
            {running ? "Pause" : "Start"}
          </motion.button>
          <motion.button
            onClick={reset}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            className="grid h-12 w-12 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Reset"
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>
      </div>
    </>
  );
}
