"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X, Flame, Trophy, Clock, Zap, CalendarClock, CalendarCheck, Sparkles,
  Target, BookOpen, Crown,
  type LucideIcon,
} from "lucide-react";
import { useAspirantStore } from "@/lib/aspirant-store";
import { toISO } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const H = 3600;

/** Current consecutive-day streak ending today (or yesterday, still alive). */
function computeStreak(studied: string[]): number {
  const set = new Set(studied);
  const d = new Date();
  // If today isn't marked yet, an ongoing streak can still count from yesterday.
  if (!set.has(toISO(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(toISO(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

type Badge = { id: string; label: string; need: string; icon: LucideIcon; done: boolean };

export function RewardsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sessions = useAspirantStore((s) => s.sessions);
  const subjects = useAspirantStore((s) => s.subjects);
  const studiedDays = useAspirantStore((s) => s.studiedDays);
  const examDate = useAspirantStore((s) => s.examDate);

  const { streak, badges, unlocked } = useMemo(() => {
    const total = sessions.reduce((a, s) => a + s.seconds, 0);
    const perDay = new Map<string, number>();
    for (const s of sessions) perDay.set(s.date, (perDay.get(s.date) ?? 0) + s.seconds);
    const maxDay = Math.max(0, ...perDay.values());
    const activeDays = studiedDays.length;
    const streak = computeStreak(studiedDays);

    const badges: Badge[] = [
      { id: "first", label: "First Focus", need: "Time 1 session", icon: Sparkles, done: sessions.length >= 1 },
      { id: "exam", label: "On the Clock", need: "Set your exam", icon: CalendarClock, done: !!examDate },
      // Streaks
      ...[3, 7, 14, 30, 60, 100].map((n) => ({
        id: `s${n}`, label: `${n}-Day Streak`, need: `${n} days in a row`,
        icon: n >= 60 ? Crown : Flame, done: streak >= n,
      })),
      // Total hours
      ...[1, 5, 10, 25, 50, 100, 250, 500, 1000].map((n) => ({
        id: `h${n}`, label: n >= 1000 ? "Legend" : `${n}h Studied`, need: `${n}h total`,
        icon: n >= 1000 ? Crown : n >= 100 ? Trophy : Clock, done: total >= n * H,
      })),
      // Active days
      ...[5, 15, 30, 60, 100].map((n) => ({
        id: `d${n}`, label: `${n} Active Days`, need: `${n} days studied`,
        icon: CalendarCheck, done: activeDays >= n,
      })),
      // Sessions logged
      ...[10, 50, 100, 500].map((n) => ({
        id: `n${n}`, label: `${n} Sessions`, need: `Time ${n} sessions`,
        icon: Target, done: sessions.length >= n,
      })),
      // Deep single days
      ...[2, 4, 8, 12].map((n) => ({
        id: `deep${n}`, label: `${n}h in a Day`, need: `${n}h in one day`,
        icon: Zap, done: maxDay >= n * H,
      })),
      // Subjects tracked
      ...[3, 5, 8].map((n) => ({
        id: `sub${n}`, label: `${n} Subjects`, need: `Track ${n} subjects`,
        icon: BookOpen, done: subjects.length >= n,
      })),
    ];
    return { streak, badges, unlocked: badges.filter((b) => b.done).length };
  }, [sessions, subjects, studiedDays, examDate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <button aria-label="Close rewards" className="fixed inset-0 z-30 cursor-default" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Rewards"
            initial={{ opacity: 0, y: 24, scale: 0.94, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.94, x: "-50%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed", left: "50%", bottom: 92, transformOrigin: "bottom center",
              borderRadius: 24, width: "min(94vw, 460px)",
              background: "rgba(15, 13, 20, 0.74)",
              backdropFilter: "blur(20px) saturate(150%)", WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            className="glass z-40 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-white/70" />
                <h2 className="text-[15px] font-semibold text-white">Rewards</h2>
                <span className="text-[11px] text-white/45">{unlocked}/{badges.length} badges</span>
              </div>
              <button onClick={onClose} aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Streak */}
            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-transparent px-4 py-3 ring-1 ring-amber-400/20">
              <Flame size={26} className={streak > 0 ? "text-amber-400" : "text-white/30"} />
              <div>
                <p className="tabular text-[22px] font-bold leading-none text-white">
                  {streak} <span className="text-[14px] font-medium text-white/60">day{streak === 1 ? "" : "s"}</span>
                </p>
                <p className="text-[11px] text-white/50">
                  {streak > 0 ? "Current streak — keep it alive." : "Study today to start a streak."}
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="grid max-h-[46vh] grid-cols-3 gap-2 overflow-y-auto pr-1">
              {badges.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.id}
                    title={b.done ? b.label : b.need}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center ring-1 transition",
                      b.done
                        ? "bg-white/[0.08] ring-white/15"
                        : "bg-white/[0.02] ring-white/8 opacity-55"
                    )}
                  >
                    <Icon size={22} className={b.done ? "text-amber-300" : "text-white/40"} strokeWidth={1.75} />
                    <span className={cn("text-[11px] font-medium leading-tight", b.done ? "text-white/90" : "text-white/45")}>
                      {b.label}
                    </span>
                    <span className="text-[9.5px] leading-tight text-white/35">{b.done ? "Unlocked" : b.need}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
