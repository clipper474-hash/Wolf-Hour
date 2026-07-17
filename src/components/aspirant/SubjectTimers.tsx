"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Pause, Plus, Trash2 } from "lucide-react";
import { useAspirantStore, formatHMS, type Subject } from "@/lib/aspirant-store";
import { useUIStore } from "@/lib/ui-store";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Re-render every second while a timer is running (for the live clock). */
function useTick(active: boolean) {
  const [, set] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => set((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [active]);
}

export function SubjectTimers() {
  const subjects = useAspirantStore((s) => s.subjects);
  const addSubject = useAspirantStore((s) => s.addSubject);
  const running = useAspirantStore((s) => s.running);
  const [name, setName] = useState("");

  useTick(!!running);

  const add = () => {
    if (!name.trim()) return;
    addSubject(name);
    setName("");
  };

  // Live total across all subjects today (accumulated + current running span).
  const liveExtra =
    running ? Math.round((Date.now() - running.startedAt) / 1000) : 0;
  const grandTotal =
    subjects.reduce((a, s) => a + s.totalSeconds, 0) + liveExtra;

  return (
    <div className="space-y-3">
      <div className="glass glass-strong flex items-center justify-between p-4" style={{ borderRadius: 20 }}>
        <span className="text-[12px] font-medium uppercase tracking-widest text-white/50">
          Total studied
        </span>
        <span className="tabular text-[22px] font-semibold text-white">
          {formatHMS(grandTotal)}
        </span>
      </div>

      <div className="glass glass-strong p-4" style={{ borderRadius: 22 }}>
        <div className="mb-3 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a subject to time (e.g. Costing)"
            className="flex-1 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/35 focus:ring-white/30"
          />
          <button
            onClick={add}
            disabled={!name.trim()}
            aria-label="Add subject"
            className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-white/90 text-black transition hover:bg-white disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {subjects.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center text-[13px] text-white/40"
              >
                Add a subject, then hit play to start its stopwatch.
              </motion.p>
            )}
            {subjects.map((sub) => (
              <TimerRow key={sub.id} subject={sub} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TimerRow({ subject }: { subject: Subject }) {
  const running = useAspirantStore((s) => s.running);
  const startTimer = useAspirantStore((s) => s.startTimer);
  const stopTimer = useAspirantStore((s) => s.stopTimer);
  const removeSubject = useAspirantStore((s) => s.removeSubject);
  const setTimerFullscreen = useUIStore((s) => s.setTimerFullscreen);

  const isRunning = running?.subjectId === subject.id;
  const live =
    subject.totalSeconds +
    (isRunning ? Math.round((Date.now() - running!.startedAt) / 1000) : 0);

  const start = () => {
    startTimer(subject.id);
    setTimerFullscreen(true); // go immersive full-screen on start
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={spring}
      className={cn(
        "flex items-center gap-3 rounded-2xl p-2.5 pr-3 ring-1 transition-colors",
        isRunning ? "bg-white/[0.1] ring-white/25" : "bg-white/[0.04] ring-white/10"
      )}
    >
      <motion.button
        onClick={() => (isRunning ? stopTimer() : start())}
        whileTap={{ scale: 0.9 }}
        transition={spring}
        aria-label={isRunning ? `Pause ${subject.name}` : `Start ${subject.name}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-lg"
        style={{ background: subject.color }}
      >
        {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </motion.button>

      {isRunning ? (
        <button
          onClick={() => setTimerFullscreen(true)}
          className="flex-1 truncate text-left text-[15px] font-medium text-white/90 hover:text-white"
          title="Open full screen"
        >
          {subject.name}
        </button>
      ) : (
        <span className="flex-1 truncate text-[15px] font-medium text-white/90">
          {subject.name}
        </span>
      )}

      {isRunning && (
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        />
      )}
      <span className={cn("tabular text-[15px] tracking-tight", isRunning ? "text-white" : "text-white/60")}>
        {formatHMS(live)}
      </span>

      <button
        onClick={() => removeSubject(subject.id)}
        aria-label={`Remove ${subject.name}`}
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-red-300"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
