"use client";

import { usePrefsStore } from "@/lib/prefs-store";

export const HOME_QUOTES = [
  "The key to success is action.",
  "Turn obstacles into opportunities.",
  "Small steps, every single day.",
  "Focus is a quiet superpower.",
  "Begin, and the mind grows heated.",
  "Stillness is where clarity lives.",
];

export function Quote() {
  const quoteIdx = usePrefsStore((s) => s.quoteIdx);
  const showQuote = usePrefsStore((s) => s.showQuote);

  if (!showQuote) return null;

  return (
    <p
      className="font-body"
      style={{
        fontSize: "clamp(1rem, 2vw, 1.375rem)",
        color: "var(--text-muted)",
        letterSpacing: "-0.02em",
      }}
    >
      {`“${HOME_QUOTES[quoteIdx % HOME_QUOTES.length]}”`}
    </p>
  );
}
