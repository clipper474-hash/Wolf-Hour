"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** The "alive" element: the big polaroid slowly cycles through real scene
 *  posters — eleven worlds, one photo frame. CSS crossfade, 5s cadence,
 *  paused for prefers-reduced-motion. */

const SCENES = [
  { id: "misty-torii", name: "misty torii — tonight" },
  { id: "lake-cabin", name: "lake cabin — for calm" },
  { id: "golden-hour", name: "golden hour — for warmth" },
  { id: "neon-rain-stop", name: "neon rain — for night owls" },
  { id: "lofi-study", name: "lofi study — for long hauls" },
  { id: "meteor-dusk", name: "meteor dusk — for wonder" },
];

export function ScenePolaroid() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SCENES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <span className="pvp-slides">
        {SCENES.map((sc, i) => (
          <Image
            key={sc.id}
            src={`/scenes/posters/${sc.id}.jpg`}
            alt={i === idx ? `${sc.name} — a live scene in Wolfhour` : ""}
            width={860}
            height={540}
            sizes="(min-width: 960px) 420px, 90vw"
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            className={i === idx ? "on" : ""}
          />
        ))}
      </span>
      <span className="cap">{SCENES[idx].name}</span>
    </>
  );
}
