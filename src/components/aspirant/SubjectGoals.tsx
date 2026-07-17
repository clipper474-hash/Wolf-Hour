"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, Check, BookOpen } from "lucide-react";
import {
  useAspirantStore,
  type GoalPeriod,
  type Subject,
} from "@/lib/aspirant-store";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PERIODS: { key: GoalPeriod; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export function SubjectGoals() {
  const subjects = useAspirantStore((s) => s.subjects);
  const addSubject = useAspirantStore((s) => s.addSubject);
  const [name, setName] = useState("");

  const add = () => {
    if (!name.trim()) return;
    addSubject(name);
    setName("");
  };

  return (
    <div className="glass glass-strong p-5" style={{ borderRadius: 24 }}>
      <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
        <BookOpen size={14} /> Subjects &amp; goals
      </span>

      <div className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a subject (e.g. Polity)"
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

      <div className="mt-3 space-y-2.5">
        <AnimatePresence initial={false}>
          {subjects.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3 text-center text-[13px] text-white/40"
            >
              Name a subject and set daily · weekly · monthly targets.
            </motion.p>
          )}
          {subjects.map((sub) => (
            <SubjectCard key={sub.id} subject={sub} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SubjectCard({ subject }: { subject: Subject }) {
  const setGoal = useAspirantStore((s) => s.setGoal);
  const toggleDone = useAspirantStore((s) => s.toggleDone);
  const removeSubject = useAspirantStore((s) => s.removeSubject);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={spring}
      className="rounded-2xl bg-white/[0.05] p-3.5 ring-1 ring-white/10"
    >
      <div className="mb-2.5 flex items-center justify-between">
        <h4 className="text-[14px] font-semibold text-white">{subject.name}</h4>
        <button
          onClick={() => removeSubject(subject.id)}
          aria-label={`Remove ${subject.name}`}
          className="grid h-7 w-7 place-items-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="space-y-2">
        {PERIODS.map(({ key, label }) => {
          const done = subject.done[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <button
                onClick={() => toggleDone(subject.id, key)}
                aria-label={`Mark ${label} goal ${done ? "incomplete" : "complete"}`}
                aria-pressed={done}
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-lg ring-1 transition-colors",
                  done
                    ? "bg-emerald-400/90 text-black ring-emerald-300/40"
                    : "bg-white/5 text-transparent ring-white/15 hover:bg-white/10"
                )}
              >
                <Check size={13} strokeWidth={3} />
              </button>
              <span className="w-14 shrink-0 text-[11px] font-medium uppercase tracking-wide text-white/40">
                {label}
              </span>
              <input
                value={subject.goals[key]}
                onChange={(e) => setGoal(subject.id, key, e.target.value)}
                placeholder={`${label} target…`}
                className={cn(
                  "flex-1 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-white/90 outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-white/25",
                  done && "text-white/45 line-through"
                )}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
