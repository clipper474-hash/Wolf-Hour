"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionTier } from "@/lib/useMotionTier";
import { useSceneStore, sceneById } from "@/lib/store";
import { SceneLayer } from "./SceneLayer";

type Layer = { key: number; src: string };

/** Time for a scene-to-scene cross-dissolve (ms). Long + eased = buttery. */
const SWITCH_MS = 1600;
/** Soft, gentle dissolve curve (slow in, slow out — no hard edges). */
const SWITCH_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

/**
 * Fullscreen cinematic background manager.
 * Renders the current scene (SceneLayer = seamless loop). On scene change it
 * mounts the new scene on top and cross-dissolves, then prunes the old layer.
 * Reduced-motion → static gradient.
 */
export function VideoBackground() {
  const { reduced } = useMotionTier();
  const sceneId = useSceneStore((s) => s.sceneId);
  const src = sceneById(sceneId).src;
  const keyRef = useRef(0);
  const [layers, setLayers] = useState<Layer[]>(() => [{ key: 0, src }]);

  // Push a new layer whenever the scene changes (it fades in over the old one).
  useEffect(() => {
    setLayers((prev) => {
      if (prev[prev.length - 1].src === src) return prev;
      return [...prev, { key: ++keyRef.current, src }];
    });
  }, [src]);

  // Once the top layer has finished fading in, drop everything beneath it.
  useEffect(() => {
    if (layers.length <= 1) return;
    const id = window.setTimeout(
      () => setLayers((prev) => prev.slice(-1)),
      SWITCH_MS + 200
    );
    return () => clearTimeout(id);
  }, [layers]);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-[#241633]">
      {reduced ? (
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, #4b2e8a 0%, #7b3f8f 45%, #b56b86 78%, #d9a7b0 100%)",
          }}
        />
      ) : (
        layers.map((l) => (
          <FadeLayer key={l.key} instant={l.key === 0}>
            <SceneLayer src={l.src} />
          </FadeLayer>
        ))
      )}

      {/* legibility scrim */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 44%, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.30) 58%, rgba(0,0,0,0.46) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
      />
    </div>
  );
}

/** Wraps a scene layer; fades in on mount (unless `instant`), stays visible. */
function FadeLayer({
  children,
  instant,
}: {
  children: React.ReactNode;
  instant?: boolean;
}) {
  const [on, setOn] = useState(!!instant);
  useEffect(() => {
    if (instant) return;
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, [instant]);
  return (
    <div
      className="absolute inset-0"
      style={{ opacity: on ? 1 : 0, transition: `opacity ${SWITCH_MS}ms ${SWITCH_EASE}` }}
    >
      {children}
    </div>
  );
}
