"use client";

import { Moon, Sun } from "lucide-react";
import { usePrefsStore } from "@/lib/prefs-store";
import { cn } from "@/lib/utils";

/** Round dark/light switch — used in the landing nav (app uses SettingsPanel row). */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = usePrefsStore((s) => s.theme);
  const setTheme = usePrefsStore((s) => s.setTheme);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border transition-colors",
        "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
        "[html[data-theme=light]_&]:border-black/15 [html[data-theme=light]_&]:bg-black/5",
        "[html[data-theme=light]_&]:text-black/70 [html[data-theme=light]_&]:hover:bg-black/10",
        className
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
