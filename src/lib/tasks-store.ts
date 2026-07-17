import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};

type TasksState = {
  tasks: Task[];
  add: (text: string) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
};

/**
 * A general check-off to-do list (persisted) — distinct from Aspirant Mode's
 * structured per-subject study goals. Freeform, non-study tasks for the main
 * dashboard. New items append; completed can be cleared in one tap.
 */
export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      add: (text) =>
        set((s) => {
          const t = text.trim();
          if (!t) return s;
          return {
            tasks: [
              ...s.tasks,
              { id: crypto.randomUUID(), text: t, done: false, createdAt: Date.now() },
            ],
          };
        }),
      toggle: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      remove: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      clearCompleted: () =>
        set((s) => ({ tasks: s.tasks.filter((t) => !t.done) })),
    }),
    { name: "polaris-tasks" }
  )
);
