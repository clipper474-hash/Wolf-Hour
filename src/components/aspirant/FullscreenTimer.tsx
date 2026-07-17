"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Square, ChevronDown, Palette } from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import { useAspirantStore, formatHMS } from "@/lib/aspirant-store";
import { TIMER_DESIGNS, timerDesignById, timerFaceStyle } from "@/lib/timer-designs";
import { FlipDigit } from "@/components/clock/FlipDigit";
import { softSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Immersive full-screen study timer — appears when a subject stopwatch starts
 * (like the home theme screen). Big elapsed time over the live scene, with a
 * selectable face design, minimise, and stop.
 */
export function FullscreenTimer() {
  const open = useUIStore((s) => s.timerFullscreen);
  const setOpen = useUIStore((s) => s.setTimerFullscreen);
  const running = useAspirantStore((s) => s.running);
  const subjects = useAspirantStore((s) => s.subjects);
  const stopTimer = useAspirantStore((s) => s.stopTimer);
  const designId = useAspirantStore((s) => s.timerDesign);
  const setDesign = useAspirantStore((s) => s.setTimerDesign);

  const [, tick] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  const visible = open && !!running;

  // 1 Hz tick while visible.
  useEffect(() => {
    if (!visible) return;
    const t = window.setInterval(() => tick((n) => n + 1), 250);
    return () => window.clearInterval(t);
  }, [visible]);

  const subject = subjects.find((s) => s.id === running?.subjectId);
  const elapsed = running ? Math.floor((Date.now() - running.startedAt) / 1000) : 0;
  const design = timerDesignById(designId);

  const stop = () => {
    stopTimer();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center"
        >
          {/* soft legibility scrim; the scene stays visible */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.28),rgba(0,0,0,0.62))]" />

          <div className="relative flex flex-col items-center gap-6 px-6 text-center">
            {/* back / minimise — sits just above the clock */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Minimise timer"
              className="glass grid h-11 w-11 place-items-center rounded-full text-white/80 hover:text-white"
            >
              <ChevronDown size={20} />
            </button>

            {subject && (
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ background: subject.color }} />
                <span className="text-[17px] font-medium text-white/85">{subject.name}</span>
              </div>
            )}

            <TimerFace seconds={elapsed} design={design} />

            <p className="text-[13px] uppercase tracking-[0.3em] text-white/40">focusing</p>

            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={stop}
                className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 text-[15px] font-semibold text-black transition hover:bg-white"
              >
                <Square size={16} fill="currentColor" /> Stop
              </button>
              <button
                onClick={() => setPickerOpen((v) => !v)}
                aria-label="Timer design"
                className={cn(
                  "glass grid h-12 w-12 place-items-center rounded-full text-white/85 hover:text-white",
                  pickerOpen && "ring-1 ring-white/40"
                )}
              >
                <Palette size={19} />
              </button>
            </div>
          </div>

          {/* design picker */}
          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={softSpring}
                className="glass absolute bottom-8 left-1/2 flex max-w-[92vw] -translate-x-1/2 gap-2 overflow-x-auto p-2"
                style={{ borderRadius: 9999 }}
              >
                {TIMER_DESIGNS.map((d) => {
                  const selected = d.id === designId;
                  // preview the face treatment on the label itself (unless selected pill)
                  const previewStyle: React.CSSProperties = selected
                    ? {}
                    : {
                        fontFamily: d.font,
                        fontWeight: d.weight,
                        ...timerFaceStyle(d),
                      };
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDesign(d.id);
                        setPickerOpen(false);
                      }}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                        selected ? "bg-white text-black" : "hover:bg-white/10",
                        !selected && d.shimmer && "clock-shimmer"
                      )}
                      style={previewStyle}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimerFace({
  seconds,
  design,
}: {
  seconds: number;
  design: ReturnType<typeof timerDesignById>;
}) {
  const text = formatHMS(seconds);
  const size = "clamp(56px, 16vw, 200px)";
  const base: React.CSSProperties = {
    fontFamily: design.font,
    fontWeight: design.weight,
    letterSpacing: design.letterSpacing,
    fontSize: size,
    lineHeight: 1,
  };

  if (design.render === "flip") {
    return (
      <div className="flex items-center gap-1" style={{ fontFamily: design.font, fontWeight: design.weight }}>
        {text.split("").map((ch, i) =>
          ch === ":" ? (
            <span key={i} className="px-1 text-white/70" style={{ fontSize: "clamp(40px,11vw,140px)" }}>
              :
            </span>
          ) : (
            <span key={i} style={{ fontSize: "clamp(48px,13vw,170px)" }}>
              <FlipDigit value={ch} />
            </span>
          )
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("tabular", design.shimmer && "clock-shimmer")}
      style={{ ...base, ...timerFaceStyle(design) }}
    >
      {text}
    </div>
  );
}
