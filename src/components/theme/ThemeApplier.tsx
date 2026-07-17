"use client";

import { useEffect } from "react";
import { usePrefsStore } from "@/lib/prefs-store";

/**
 * Mirrors the persisted theme pref onto <html data-theme="…"> so plain CSS
 * (globals.css `html[data-theme="light"]` overrides) can restyle everything.
 * A tiny inline script in layout.tsx sets the attribute pre-paint to avoid a
 * dark→light flash; this keeps it in sync after hydration / toggle clicks.
 */
export function ThemeApplier() {
  const theme = usePrefsStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return null;
}
