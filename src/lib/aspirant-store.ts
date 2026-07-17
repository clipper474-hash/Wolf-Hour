import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayISO } from "./date-utils";

export type GoalPeriod = "daily" | "weekly" | "monthly";

export type Subject = {
  id: string;
  name: string;
  color: string;
  totalSeconds: number; // lifetime accumulated study time
  goals: Record<GoalPeriod, string>;
  done: Record<GoalPeriod, boolean>;
};

/** One committed study block (for analytics). */
export type Session = { id: string; subjectId: string; date: string; seconds: number };

type Running = { subjectId: string; startedAt: number } | null;

type AspirantState = {
  examName: string;
  examDate: string | null;
  subjects: Subject[];
  sessions: Session[];
  studiedDays: string[];
  running: Running;
  timerDesign: string;

  setTimerDesign: (id: string) => void;
  setExam: (name: string, date: string) => void;
  clearExam: () => void;

  addSubject: (name: string) => void;
  renameSubject: (id: string, name: string) => void;
  removeSubject: (id: string) => void;
  setGoal: (id: string, period: GoalPeriod, text: string) => void;
  toggleDone: (id: string, period: GoalPeriod) => void;

  startTimer: (subjectId: string) => void;
  stopTimer: () => void;

  toggleStudied: (iso: string) => void;
};

const PALETTE = [
  "#6366f1", "#22c55e", "#3b82f6", "#f97316",
  "#a1a1aa", "#06b6d4", "#ec4899", "#eab308",
];

function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `s_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}
const emptyGoals = (): Record<GoalPeriod, string> => ({ daily: "", weekly: "", monthly: "" });
const emptyDone = (): Record<GoalPeriod, boolean> => ({ daily: false, weekly: false, monthly: false });

/** Aspirant Mode state (persisted): exam, subjects + per-subject stopwatch time,
 *  study sessions for analytics, goals, and the study calendar. */
export const useAspirantStore = create<AspirantState>()(
  persist(
    (set, get) => ({
      examName: "",
      examDate: null,
      subjects: [],
      sessions: [],
      studiedDays: [],
      running: null,
      timerDesign: "minimal",

      setTimerDesign: (timerDesign) => set({ timerDesign }),
      setExam: (examName, examDate) => set({ examName: examName.trim(), examDate }),
      clearExam: () => set({ examName: "", examDate: null }),

      addSubject: (name) =>
        set((s) => {
          const trimmed = name.trim();
          if (!trimmed) return s;
          return {
            subjects: [
              ...s.subjects,
              {
                id: uid(),
                name: trimmed,
                color: PALETTE[s.subjects.length % PALETTE.length],
                totalSeconds: 0,
                goals: emptyGoals(),
                done: emptyDone(),
              },
            ],
          };
        }),

      renameSubject: (id, name) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === id ? { ...sub, name: name.trim() || sub.name } : sub
          ),
        })),

      removeSubject: (id) =>
        set((s) => ({
          subjects: s.subjects.filter((sub) => sub.id !== id),
          sessions: s.sessions.filter((se) => se.subjectId !== id),
          running: s.running?.subjectId === id ? null : s.running,
        })),

      setGoal: (id, period, text) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === id ? { ...sub, goals: { ...sub.goals, [period]: text } } : sub
          ),
        })),

      toggleDone: (id, period) =>
        set((s) => ({
          subjects: s.subjects.map((sub) =>
            sub.id === id ? { ...sub, done: { ...sub.done, [period]: !sub.done[period] } } : sub
          ),
        })),

      startTimer: (subjectId) => {
        // Commit any currently-running subject first, then start the new one.
        get().stopTimer();
        set({ running: { subjectId, startedAt: Date.now() } });
      },

      stopTimer: () =>
        set((s) => {
          if (!s.running) return s;
          const elapsed = Math.max(0, Math.round((Date.now() - s.running.startedAt) / 1000));
          if (elapsed < 1) return { running: null };
          const id = s.running.subjectId;
          const date = todayISO();
          return {
            running: null,
            subjects: s.subjects.map((sub) =>
              sub.id === id ? { ...sub, totalSeconds: sub.totalSeconds + elapsed } : sub
            ),
            sessions: [...s.sessions, { id: uid(), subjectId: id, date, seconds: elapsed }],
            studiedDays: s.studiedDays.includes(date) ? s.studiedDays : [...s.studiedDays, date],
          };
        }),

      toggleStudied: (iso) =>
        set((s) => ({
          studiedDays: s.studiedDays.includes(iso)
            ? s.studiedDays.filter((d) => d !== iso)
            : [...s.studiedDays, iso],
        })),
    }),
    { name: "polaris-aspirant" }
  )
);

/** HH:MM:SS. */
export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Compact "2h 14m" / "13m" / "45s". */
export function formatShort(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}
