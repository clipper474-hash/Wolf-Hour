"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { CalendarClock, Pencil, Check } from "lucide-react";
import { useAspirantStore } from "@/lib/aspirant-store";
import { daysUntil, fromISO, prettyDate, todayISO } from "@/lib/date-utils";
import { spring } from "@/lib/motion";

/** Live remaining time to the local-midnight start of the exam day. */
function breakdown(iso: string) {
  const target = fromISO(iso).getTime();
  const ms = target - Date.now();
  const arrived = ms <= 0;
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    arrived,
    ms,
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    mins: Math.floor((total % 3_600) / 60),
    secs: total % 60,
  };
}

/** Re-render once per second so the seconds visibly flow. */
function useSecondTick(active: boolean) {
  const [, set] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = window.setInterval(() => set((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [active]);
}

export function ExamCountdown() {
  const examName = useAspirantStore((s) => s.examName);
  const examDate = useAspirantStore((s) => s.examDate);
  const setExam = useAspirantStore((s) => s.setExam);

  const [editing, setEditing] = useState(false);
  // Avoid SSR/first-paint hydration drift for the ticking numbers.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const configured = !!examDate && !editing;
  const live = configured && mounted && daysUntil(examDate!) >= 0;
  useSecondTick(live);

  if (configured) {
    const days = daysUntil(examDate!);
    const past = days < 0;
    const b = mounted ? breakdown(examDate!) : null;
    const counting = !!b && !b.arrived; // future — show D/H/M/S

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="glass glass-strong relative overflow-hidden p-6"
        style={{ borderRadius: 24 }}
      >
        {/* alive: a slow warm breath behind the numbers */}
        {counting && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(251,191,113,0.16), transparent 70%)",
            }}
            animate={{ opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
            <CalendarClock size={14} /> Next exam
          </span>
          <button
            onClick={() => setEditing(true)}
            aria-label="Edit exam"
            className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Pencil size={14} />
          </button>
        </div>

        {counting ? (
          <>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <Unit value={b!.days} label="days" big />
              <Unit value={b!.hours} label="hours" pad />
              <Unit value={b!.mins} label="min" pad />
              <Unit value={b!.secs} label="sec" pad live />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-white/90">
              {examName || "Your exam"}
              <span className="font-normal text-white/45"> · {prettyDate(examDate!)}</span>
            </p>
            {/* the emotional beat */}
            <p className="mt-1 text-[13px] font-medium tracking-tight text-amber-200/85">
              If not now — then never.
            </p>
            <p className="text-[12px] text-white/45">
              Every second you can still see is a second you can still use.
            </p>
          </>
        ) : (
          <>
            <div className="mt-3 flex items-end gap-3">
              <div className="tabular text-[64px] font-semibold leading-none text-white">
                <NumberFlow value={Math.abs(days)} />
              </div>
              <div className="pb-2 text-sm text-white/70">
                {past ? "days since" : "today"}
              </div>
            </div>
            <p className="mt-2 text-[15px] font-medium text-white/90">
              {days === 0 ? "Today is the day — " : ""}
              {examName || "Your exam"}
            </p>
            <p className="text-[12px] text-white/45">{prettyDate(examDate!)}</p>
          </>
        )}

        {/* progress hairline: subtle warmth as it nears */}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-300/60 to-white/80"
            initial={{ width: 0 }}
            animate={{ width: past ? "100%" : `${Math.max(6, 100 - Math.min(days, 100))}%` }}
            transition={{ ...spring, delay: 0.15 }}
          />
        </div>
      </motion.div>
    );
  }

  return <ExamForm initialName={examName} initialDate={examDate} onDone={() => setEditing(false)} onSave={setExam} />;
}

/** One glass cell of the countdown — smooth NumberFlow digits. */
function Unit({
  value,
  label,
  big = false,
  pad = false,
  live = false,
}: {
  value: number;
  label: string;
  big?: boolean;
  pad?: boolean;
  live?: boolean;
}) {
  return (
    <div className="relative grid place-items-center rounded-2xl bg-white/[0.05] px-1 py-3 ring-1 ring-white/10">
      {live && (
        <motion.span
          aria-hidden
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-300"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className={`tabular font-semibold leading-none text-white ${big ? "text-[40px]" : "text-[34px]"}`}
      >
        <NumberFlow value={value} format={pad ? { minimumIntegerDigits: 2 } : undefined} />
      </div>
      <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/45">
        {label}
      </span>
    </div>
  );
}

function ExamForm({
  initialName,
  initialDate,
  onSave,
  onDone,
}: {
  initialName: string;
  initialDate: string | null;
  onSave: (name: string, date: string) => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [date, setDate] = useState(initialDate ?? "");

  const save = () => {
    if (!date) return;
    onSave(name, date);
    onDone();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="glass glass-strong p-6"
      style={{ borderRadius: 24 }}
    >
      <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
        <CalendarClock size={14} /> Set your exam
      </span>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Exam name (e.g. UPSC Prelims)"
          className="flex-1 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/35 focus:ring-white/30"
        />
        <input
          type="date"
          value={date}
          min={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/12 [color-scheme:dark] focus:ring-white/30"
        />
        <button
          onClick={save}
          disabled={!date}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-white/90 px-4 py-2.5 text-[14px] font-semibold text-black transition hover:bg-white disabled:pointer-events-none disabled:opacity-40"
        >
          <Check size={16} /> Set
        </button>
      </div>
    </motion.div>
  );
}
