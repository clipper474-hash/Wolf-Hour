/** Clock & font style presets. Each combines a render MODE (how digits animate)
 *  with a display FONT + weight, plus an optional SKIN (glow / gradient) that
 *  gives the popular, premium looks. The picker exposes these; the Clock renders them. */
import type { CSSProperties } from "react";

export type ClockMode = "rolling" | "flip" | "plain" | "swap";

/** Per-digit swap animation skin (mode: "swap"). */
export type SwapVariant = "led" | "lcd" | "glitch" | "ember";

export type ClockPreset = {
  id: string;
  label: string;
  mode: ClockMode;
  /** CSS font-family value (uses next/font variables registered on <html>). */
  font: string;
  weight: number;
  tracking: string;
  /** outline-only text (stroked, transparent fill) */
  outline?: boolean;
  /** neon/tube glow — a CSS color used to build a layered text-shadow */
  glow?: string;
  /** gradient text fill (background-clip: text). Forces a solid transparent fill. */
  gradient?: string;
  /** animate the gradient position for a living shimmer (aurora) */
  shimmer?: boolean;
  /** solid text color override (default --color-snow) */
  color?: string;
  /** swap-mode animation skin — the digit colors/glow live in CSS (.swap-*) */
  variant?: SwapVariant;
};

export const CLOCK_PRESETS: ClockPreset[] = [
  // — the essentials —
  { id: "standard", label: "Standard", mode: "rolling", font: "var(--font-hanken)", weight: 600, tracking: "-0.03em" },
  { id: "flip", label: "Flip", mode: "flip", font: "var(--font-hanken)", weight: 700, tracking: "-0.02em" },
  { id: "minimal", label: "Minimal", mode: "plain", font: "var(--font-onest)", weight: 300, tracking: "-0.02em" },
  { id: "serif", label: "Serif", mode: "plain", font: "var(--font-lora)", weight: 500, tracking: "-0.02em" },
  { id: "script", label: "Script", mode: "plain", font: "var(--font-caveat)", weight: 700, tracking: "0em" },
  { id: "space", label: "Space", mode: "rolling", font: "var(--font-space)", weight: 600, tracking: "-0.03em" },
  { id: "outline", label: "Outline", mode: "plain", font: "var(--font-hanken)", weight: 700, tracking: "-0.02em", outline: true },

  // — popular / premium skins —
  { id: "aurora", label: "Aurora", mode: "plain", font: "var(--font-space)", weight: 600, tracking: "-0.02em", gradient: "linear-gradient(100deg,#a5f3fc,#a78bfa,#f0abfc,#a5f3fc)", shimmer: true },
  { id: "sunset", label: "Sunset", mode: "plain", font: "var(--font-hanken)", weight: 700, tracking: "-0.03em", gradient: "linear-gradient(180deg,#fed7aa,#fca5a5 55%,#f9a8d4)" },
  { id: "chrome", label: "Chrome", mode: "plain", font: "var(--font-archivo)", weight: 800, tracking: "-0.02em", gradient: "linear-gradient(180deg,#ffffff,#e2e8f0 42%,#94a3b8 56%,#f1f5f9)" },

  // — swap-mode faces (per-digit change animation, skins in globals.css) —
  { id: "led", label: "LED Matrix", mode: "swap", font: "var(--font-doto)", weight: 700, tracking: "0em", variant: "led", color: "#7dffa9", glow: "rgba(60,255,140,0.6)" },
  { id: "lcd", label: "LCD", mode: "swap", font: "var(--font-lcd)", weight: 400, tracking: "0em", variant: "lcd", color: "#9be5ff", glow: "rgba(90,200,255,0.55)" },
  { id: "glitch", label: "Glitch", mode: "swap", font: "var(--font-orbitron)", weight: 600, tracking: "0em", variant: "glitch", color: "#e6f6ff", glow: "rgba(120,220,255,0.35)" },
  { id: "ember", label: "Ember", mode: "swap", font: "var(--font-hanken)", weight: 700, tracking: "-0.01em", variant: "ember", gradient: "linear-gradient(180deg,#fff7e0,#ffc26e 45%,#ff7a3c 80%,#e8481f)" },
];

export const DEFAULT_PRESET = CLOCK_PRESETS[0];

export const presetById = (id: string): ClockPreset =>
  CLOCK_PRESETS.find((p) => p.id === id) ?? DEFAULT_PRESET;

/**
 * The visual skin (color / stroke / gradient / glow) for a preset, independent
 * of font sizing. `scale` tunes stroke width + glow blur so previews (small)
 * and the hero clock (huge) both read correctly.
 */
export function clockFaceStyle(p: ClockPreset, scale = 1): CSSProperties {
  if (p.outline) {
    return { color: "transparent", WebkitTextStroke: `${Math.max(1, 2 * scale)}px var(--color-snow)` };
  }
  if (p.gradient) {
    return {
      backgroundImage: p.gradient,
      backgroundSize: p.shimmer ? "220% auto" : "100% auto",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    };
  }
  const style: CSSProperties = { color: p.color ?? "var(--color-snow)" };
  if (p.glow) {
    style.textShadow = `0 0 ${8 * scale}px ${p.glow}, 0 0 ${22 * scale}px ${p.glow}`;
  }
  return style;
}
