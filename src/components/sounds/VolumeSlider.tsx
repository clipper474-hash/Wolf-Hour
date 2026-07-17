"use client";

import { useRef, useState } from "react";

/**
 * Lightweight volume slider. GPU-cheap: the fill scales on the X axis and the
 * thumb translates — both transform-only (no layout thrash), no per-frame spring
 * loops. A short transition gives a soft feel on discrete changes; it's disabled
 * mid-drag so dragging stays 1:1 with the pointer. Keyboard-accessible.
 */
export function VolumeSlider({
  value,
  onChange,
  label,
  accent = "rgba(255,255,255,0.92)",
}: {
  value: number; // 0..1
  onChange: (v: number) => void;
  label: string;
  accent?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = (clientX: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };

  const onDown = (e: React.PointerEvent) => {
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging) setFromClientX(e.clientX);
  };
  const onUp = () => setDragging(false);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.05;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(1, value + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(0, value - step));
    }
  };

  const pct = Math.round(value * 100);
  const ease = dragging ? "none" : "transform 120ms cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      ref={track}
      role="slider"
      aria-label={`${label} volume`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      tabIndex={0}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      className="relative h-2 w-full cursor-pointer touch-none select-none rounded-full bg-white/12 outline-none ring-white/40 focus-visible:ring-2"
    >
      <div
        className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
        style={{
          background: accent,
          transform: `scaleX(${value})`,
          transition: ease,
          willChange: "transform",
        }}
      />
      <div
        className="absolute top-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        style={{
          left: `${pct}%`,
          transform: `translate(-50%, -50%) scale(${dragging ? 1.15 : 1})`,
          transition: dragging ? "none" : "left 120ms cubic-bezier(0.22,1,0.36,1)",
          willChange: "left, transform",
        }}
      />
    </div>
  );
}
