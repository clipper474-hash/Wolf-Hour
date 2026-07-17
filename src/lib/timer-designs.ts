/** Full-screen study-timer face designs (selectable). Popular styles — shares
 *  the gradient/glow treatment vocabulary with the home clock skins. */
import type { CSSProperties } from "react";

export type TimerRender = "plain" | "outline" | "neon" | "flip" | "gradient";

export type TimerDesign = {
  id: string;
  label: string;
  render: TimerRender;
  font: string; // CSS font-family value
  weight: number;
  letterSpacing?: string;
  /** neon/glow color (render: "neon") */
  glow?: string;
  /** gradient text fill (render: "gradient") */
  gradient?: string;
  /** animate the gradient position for a living shimmer */
  shimmer?: boolean;
};

export const TIMER_DESIGNS: TimerDesign[] = [
  { id: "minimal", label: "Minimal", render: "plain", font: "var(--font-hanken)", weight: 300, letterSpacing: "-0.03em" },
  { id: "bold", label: "Bold", render: "plain", font: "var(--font-hanken)", weight: 800, letterSpacing: "-0.04em" },
  { id: "mono", label: "Mono", render: "plain", font: "var(--font-mono-geist)", weight: 500, letterSpacing: "0" },
  { id: "neon", label: "Neon", render: "neon", font: "var(--font-space)", weight: 700, letterSpacing: "0.01em", glow: "rgba(125,211,252,0.85)" },
  { id: "outline", label: "Outline", render: "outline", font: "var(--font-hanken)", weight: 800, letterSpacing: "-0.02em" },
  { id: "flip", label: "Flip", render: "flip", font: "var(--font-hanken)", weight: 700 },
  // popular / premium skins (shared with the home clock)
  { id: "aurora", label: "Aurora", render: "gradient", font: "var(--font-space)", weight: 700, letterSpacing: "-0.01em", gradient: "linear-gradient(100deg,#a5f3fc,#a78bfa,#f0abfc,#a5f3fc)", shimmer: true },
  { id: "sunset", label: "Sunset", render: "gradient", font: "var(--font-hanken)", weight: 800, letterSpacing: "-0.03em", gradient: "linear-gradient(180deg,#fed7aa,#fca5a5 55%,#f9a8d4)" },
  { id: "chrome", label: "Chrome", render: "gradient", font: "var(--font-archivo)", weight: 800, letterSpacing: "-0.02em", gradient: "linear-gradient(180deg,#ffffff,#e2e8f0 42%,#94a3b8 56%,#f1f5f9)" },
  { id: "led", label: "LED", render: "neon", font: "var(--font-mono-geist)", weight: 600, letterSpacing: "0.02em", glow: "rgba(134,239,172,0.9)" },
];

export const timerDesignById = (id: string): TimerDesign =>
  TIMER_DESIGNS.find((d) => d.id === id) ?? TIMER_DESIGNS[0];

/** Face treatment (color / stroke / gradient / glow) for a timer design. */
export function timerFaceStyle(d: TimerDesign): CSSProperties {
  if (d.render === "outline") {
    return { color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.92)" };
  }
  if (d.render === "gradient" && d.gradient) {
    return {
      backgroundImage: d.gradient,
      backgroundSize: d.shimmer ? "220% auto" : "100% auto",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    };
  }
  if (d.render === "neon") {
    const g = d.glow ?? "rgba(125,249,255,0.75)";
    return {
      color: "#eafff9",
      textShadow: `0 0 8px ${g}, 0 0 24px ${g}, 0 0 48px ${g}`,
    };
  }
  return { color: "#fff", textShadow: "0 2px 30px rgba(0,0,0,0.5)" };
}
