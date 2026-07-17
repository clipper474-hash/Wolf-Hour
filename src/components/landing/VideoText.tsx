"use client";

import { useId } from "react";

/**
 * Video-through-text (magicui style) via inline SVG mask, so the mask text
 * inherits the page webfonts. An invisible ghost span sizes the element to the
 * real rendered text; a gradient fallback sits beneath while the video loads.
 */
export function VideoText({
  src,
  children,
  className,
}: {
  src: string;
  children: string;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <span className={`relative inline-block align-baseline ${className ?? ""}`}>
      {/* ghost: sizes the box in the real font, invisible */}
      <span aria-hidden className="invisible">{children}</span>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id={`vt-${id}`} maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fill="white"
              style={{ font: "inherit" }}
            >
              {children}
            </text>
          </mask>
          <linearGradient id={`vtg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <g mask={`url(#vt-${id})`}>
          {/* gradient fallback under the video */}
          <rect width="100%" height="100%" fill={`url(#vtg-${id})`} />
          <foreignObject width="100%" height="100%">
            <video
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src={src}
            />
          </foreignObject>
        </g>
      </svg>
    </span>
  );
}
