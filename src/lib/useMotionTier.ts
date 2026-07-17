"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    mq.removeEventListener("change", cb);
    obs.disconnect();
  };
}

function getSnapshot(): boolean {
  const attr = document.documentElement.getAttribute("data-motion");
  if (attr === "reduced") return true;
  if (attr === "full") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads the global motion kill-switch (`data-motion`) + OS reduced-motion. */
export function useMotionTier() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return { reduced };
}
