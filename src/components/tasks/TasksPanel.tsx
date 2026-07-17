"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Check, Trash2, ListTodo } from "lucide-react";
import { useTasksStore } from "@/lib/tasks-store";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** General check-off to-do list — frosted glass popover above the dock.
 *  Freeform, non-study tasks (distinct from Aspirant study goals). Autosaves. */
export function TasksPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tasks = useTasksStore((s) => s.tasks);
  const add = useTasksStore((s) => s.add);
  const toggle = useTasksStore((s) => s.toggle);
  const remove = useTasksStore((s) => s.remove);
  const clearCompleted = useTasksStore((s) => s.clearCompleted);

  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open]);

  const remaining = tasks.filter((t) => !t.done).length;
  const doneCount = tasks.length - remaining;

  const submit = () => {
    if (!draft.trim()) return;
    add(draft);
    setDraft("");
    // keep focus for rapid entry
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <button
            aria-label="Close tasks"
            className="fixed inset-0 z-30 cursor-default"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Tasks"
            initial={{ opacity: 0, y: 24, scale: 0.94, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 20, scale: 0.94, x: "-50%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed",
              left: "50%",
              bottom: 92,
              transformOrigin: "bottom center",
              borderRadius: 24,
              width: "min(94vw, 460px)",
              background: "rgba(15, 13, 20, 0.74)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }}
            className="glass z-40 p-4"
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTodo size={16} className="text-white/70" />
                <h2 className="text-[15px] font-semibold text-white">Tasks</h2>
                <span className="text-[11px] text-white/45">
                  {tasks.length === 0
                    ? "nothing yet"
                    : remaining === 0
                      ? "all done"
                      : `${remaining} left`}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Add row */}
            <div className="mb-3 flex items-center gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Add a task…"
                className="flex-1 rounded-xl bg-white/[0.06] px-3.5 py-2.5 text-[14px] text-white outline-none ring-1 ring-white/12 placeholder:text-white/35 focus:ring-white/30"
              />
              <button
                onClick={submit}
                disabled={!draft.trim()}
                aria-label="Add task"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/90 text-black transition hover:bg-white disabled:pointer-events-none disabled:opacity-40"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[42vh] space-y-1.5 overflow-y-auto pr-1">
              {tasks.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-white/35">
                  Your list is clear. Add something to get going.
                </p>
              ) : (
                <AnimatePresence initial={false}>
                  {tasks.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={spring}
                      className="group flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-2.5 py-2"
                    >
                      <button
                        onClick={() => toggle(t.id)}
                        aria-pressed={t.done}
                        aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors",
                          t.done
                            ? "border-emerald-400/70 bg-emerald-400/90 text-black"
                            : "border-white/30 text-transparent hover:border-white/60"
                        )}
                      >
                        <Check size={13} strokeWidth={3} />
                      </button>
                      <span
                        className={cn(
                          "flex-1 text-[14px] transition-colors",
                          t.done ? "text-white/40 line-through" : "text-white/90"
                        )}
                      >
                        {t.text}
                      </span>
                      <button
                        onClick={() => remove(t.id)}
                        aria-label="Delete task"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/35 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {doneCount > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={clearCompleted}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  <Trash2 size={13} /> Clear {doneCount} done
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
