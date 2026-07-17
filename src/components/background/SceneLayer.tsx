"use client";

import { useEffect, useRef, useState } from "react";

/** Crossfade seam length (seconds) for the internal seamless loop. */
const FADE = 1.2;
const ease = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

/** Genuinely low-power devices — a real touch device (coarse pointer) that
 *  also has few cores — skip the dual-video crossfade, since decoding two
 *  1080p clips is the main mobile jank source. Desktops/laptops (fine pointer)
 *  always get the seamless loop, even with 4 cores.
 *  ponytail: heuristic; if a weak touch device with many cores still janks,
 *  add a detect-gpu tier check here. */
const isLite = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches &&
  (navigator.hardwareConcurrency ?? 8) <= 4;

/**
 * One scene rendered as a seamless forward loop: two stacked copies of the clip,
 * both natively looping, offset by half, eased-crossfaded across each seam.
 * On low-power devices, a single native-loop video (accepts the loop seam).
 * Fills its parent; the parent handles scene-to-scene cross-dissolves.
 */
export function SceneLayer({ src }: { src: string }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  // Start with the SSR value (dual-video) so hydration matches, then drop to a
  // single video after mount on low-power devices.
  const [lite, setLite] = useState(false);
  useEffect(() => setLite(isLite()), []);

  useEffect(() => {
    if (lite) return;
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    let raf = 0;
    let offsetSet = false;
    a.play().catch(() => {});
    b.play().catch(() => {});

    const tick = () => {
      const dur = a.duration;
      if (dur && !Number.isNaN(dur)) {
        if (!offsetSet && b.readyState >= 1) {
          b.currentTime = (a.currentTime + dur / 2) % dur;
          offsetSet = true;
        }
        const t = a.currentTime;
        let lin = 1;
        if (t > dur - FADE) lin = (dur - t) / FADE;
        else if (t < FADE) lin = t / FADE;
        const oa = ease(lin);
        a.style.opacity = String(oa);
        b.style.opacity = String(1 - oa);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [src, lite]);

  const base = "absolute inset-0 h-full w-full object-cover";
  if (lite) {
    return <video className={base} src={src} autoPlay muted loop playsInline preload="auto" />;
  }
  return (
    <>
      <video ref={aRef} className={base} style={{ opacity: 1 }} src={src} autoPlay muted loop playsInline preload="auto" />
      {/* Distinct URL (query) so the browser fetches a second, independent
          decode instead of colliding on the identical media request — which
          leaves this copy stuck at readyState 0 and breaks the seam crossfade.
          ponytail: costs one extra download per scene on desktop; mobile uses
          the single-video path above and never hits this. */}
      <video ref={bRef} className={base} style={{ opacity: 0 }} src={`${src}?b`} autoPlay muted loop playsInline preload="auto" />
    </>
  );
}
