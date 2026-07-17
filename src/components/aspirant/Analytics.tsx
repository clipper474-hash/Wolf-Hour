"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";
import {
  useAspirantStore,
  formatHMS,
  formatShort,
} from "@/lib/aspirant-store";
import { todayISO, toISO, fromISO, prettyDate, monthGrid, monthLabel, WEEKDAYS } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

type Period = "today" | "week" | "month" | "all";
const PERIODS: { key: Period; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "all", label: "All" },
];

function inRange(date: string, period: Period): boolean {
  if (period === "all") return true;
  const d = fromISO(date).getTime();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (period === "today") return date === todayISO();
  const span = period === "week" ? 7 : 30;
  return d > today - span * 86_400_000 && d <= today;
}

export function Analytics() {
  const sessions = useAspirantStore((s) => s.sessions);
  const subjects = useAspirantStore((s) => s.subjects);
  const [period, setPeriod] = useState<Period>("week");

  const stats = useMemo(() => {
    const scoped = sessions.filter((s) => inRange(s.date, period));
    const total = scoped.reduce((a, s) => a + s.seconds, 0);
    const days = new Set(scoped.map((s) => s.date));
    const avg = days.size ? Math.round(total / days.size) : 0;

    const bySubject = new Map<string, number>();
    for (const s of scoped) bySubject.set(s.subjectId, (bySubject.get(s.subjectId) ?? 0) + s.seconds);
    const ratio = subjects
      .map((sub) => ({ sub, secs: bySubject.get(sub.id) ?? 0 }))
      .filter((r) => r.secs > 0)
      .sort((a, b) => b.secs - a.secs);

    const perDay = new Map<string, number>();
    for (const s of scoped) perDay.set(s.date, (perDay.get(s.date) ?? 0) + s.seconds);

    // Continuous day series for the trading chart (zero-filled, oldest→newest).
    let span = period === "today" ? 1 : period === "week" ? 7 : period === "month" ? 30 : 7;
    if (period === "all" && perDay.size) {
      const first = fromISO([...perDay.keys()].sort()[0]).getTime();
      span = Math.min(90, Math.max(7, Math.round((Date.now() - first) / 86_400_000) + 1));
    }
    const series = Array.from({ length: span }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (span - 1 - i));
      const iso = toISO(d);
      return { date: iso, secs: perDay.get(iso) ?? 0 };
    });

    return { total, avg, ratio, perDay, series, activeDays: days.size };
  }, [sessions, subjects, period]);

  const now = new Date();
  const grid = useMemo(() => monthGrid(now.getFullYear(), now.getMonth()), [now]);

  return (
    <div className="space-y-3">
      {/* Period tabs */}
      <div className="glass glass-strong flex gap-1 p-1.5" style={{ borderRadius: 9999 }}>
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className="relative flex-1 rounded-full px-3 py-1.5 text-[13px] font-medium text-white/70 transition-colors"
          >
            {period === p.key && (
              <motion.span
                layoutId="stat-period-pill"
                className="absolute inset-0 rounded-full bg-white/15 ring-1 ring-white/20"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className={cn("relative", period === p.key && "text-white")}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Total + average */}
      <div className="glass glass-strong grid grid-cols-2 gap-2 p-5" style={{ borderRadius: 22 }}>
        <div className="text-center">
          <p className="text-[12px] font-medium text-sky-300/80">Total time</p>
          <p className="tabular mt-1 text-[28px] font-semibold text-white">{formatHMS(stats.total)}</p>
        </div>
        <div className="text-center">
          <p className="text-[12px] font-medium text-sky-300/80">Daily average</p>
          <p className="tabular mt-1 text-[28px] font-semibold text-white">{formatHMS(stats.avg)}</p>
        </div>
      </div>

      {/* Study trend — trading-chart view */}
      <div className="glass glass-strong p-5" style={{ borderRadius: 22 }}>
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/50">
          <BarChart3 size={14} /> Study trend
        </span>
        {stats.ratio.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-white/40">
            Start a subject timer to build your stats.
          </p>
        ) : (
          <>
            <TradingChart series={stats.series} />
            <ul className="mt-4 space-y-1.5">
              {stats.ratio.map((r) => {
                const pct = stats.total ? Math.round((r.secs / stats.total) * 100) : 0;
                return (
                  <li key={r.sub.id} className="flex items-center gap-2 text-[13px]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: r.sub.color }} />
                    <span className="flex-1 truncate text-white/85">{r.sub.name}</span>
                    <span className="tabular text-white/55">{formatShort(r.secs)}</span>
                    <span className="tabular w-9 text-right text-white/45">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Month heatmap */}
      <div className="glass glass-strong p-5" style={{ borderRadius: 22 }}>
        <h3 className="mb-3 text-[13px] font-semibold text-white/85">
          {monthLabel(now.getFullYear(), now.getMonth())}
        </h3>
        <div className="mb-1.5 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((w, i) => (
            <div key={i} className="text-center text-[10px] text-white/30">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((c) => {
            const secs = stats.perDay.get(c.iso) ?? 0;
            const tier = hourTier(secs);
            return (
              <div
                key={c.iso}
                title={secs ? `${c.iso}: ${formatShort(secs)}` : c.iso}
                className={cn(
                  "aspect-square rounded-md transition-colors duration-500",
                  !c.inMonth && "opacity-30"
                )}
                style={tier}
              />
            );
          })}
        </div>
        {/* tier legend */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-white/35">
          <span>2h</span>
          {HOUR_TIERS.map((t) => (
            <span key={t.h} className="h-3 w-3 rounded-[4px]" style={t.style} />
          ))}
          <span>12h+</span>
        </div>
      </div>
    </div>
  );
}

/** Hour-tier heat scale: 2h light blue → 8h full dark blue → 10h gold → 12h+ luxe gold. */
const HOUR_TIERS: { h: number; style: React.CSSProperties }[] = [
  { h: 2, style: { background: "rgba(147,197,253,0.35)" } },
  { h: 4, style: { background: "rgba(96,165,250,0.55)" } },
  { h: 6, style: { background: "rgba(59,130,246,0.75)" } },
  { h: 8, style: { background: "rgba(29,78,216,0.95)" } },
  { h: 10, style: { background: "linear-gradient(135deg,#f5c04a,#d99b1f)", boxShadow: "0 0 6px rgba(245,192,74,0.45)" } },
  {
    h: 12,
    style: {
      background: "linear-gradient(135deg,#ffe9a3,#f6c14b 45%,#c98a12)",
      boxShadow: "0 0 10px rgba(246,193,75,0.7), inset 0 0 4px rgba(255,240,190,0.8)",
    },
  },
];

function hourTier(secs: number): React.CSSProperties {
  const hrs = secs / 3600;
  let style: React.CSSProperties = { background: "rgba(255,255,255,0.05)" };
  for (const t of HOUR_TIERS) if (hrs >= t.h) style = t.style;
  return style;
}

/** Study time per day as a trading-style area chart (grid + glowing line +
 *  gradient fill, green when trending up, red when down). Plain SVG, no deps. */
function TradingChart({ series }: { series: { date: string; secs: number }[] }) {
  const W = 300, H = 120, pad = 8;
  const s = series.length === 1 ? [series[0], series[0]] : series;
  const n = s.length;
  const max = Math.max(1, ...s.map((p) => p.secs));
  const x = (i: number) => pad + (i / (n - 1)) * (W - 2 * pad);
  const y = (v: number) => H - pad - (v / max) * (H - 2 * pad);
  const pts = s.map((p, i) => [x(i), y(p.secs)] as const);
  // Smooth Catmull-Rom → cubic-bézier through the points (soft, no overshoot spikes).
  const line = pts.reduce((d, p, i) => {
    if (i === 0) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const p0 = pts[i - 2] ?? pts[i - 1];
    const p1 = pts[i - 1];
    const p3 = pts[i + 1] ?? p;
    const c1x = p1[0] + (p[0] - p0[0]) / 6;
    const c1y = p1[1] + (p[1] - p0[1]) / 6;
    const c2x = p[0] - (p3[0] - p1[0]) / 6;
    const c2y = p[1] - (p3[1] - p1[1]) / 6;
    return `${d} C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  }, "");
  const area = `${line} L${x(n - 1).toFixed(1)} ${H - pad} L${pad} ${H - pad} Z`;
  const up = s[n - 1].secs >= s[0].secs;
  const col = up ? "#34d399" : "#f87171";
  const last = pts[n - 1];

  const [hover, setHover] = useState<number | null>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const frac = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(frac * (n - 1)))));
  };
  const hp = hover != null ? pts[hover] : null;

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "auto", touchAction: "none" }}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="tc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={col} stopOpacity="0.28" />
            <stop offset="100%" stopColor={col} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={pad} x2={W - pad} y1={pad + f * (H - 2 * pad)} y2={pad + f * (H - 2 * pad)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        ))}
        {/* key={line} remounts on data change so the sweep re-runs per period. */}
        <motion.path
          key={`a${line}`}
          d={area}
          fill="url(#tc-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
        />
        <motion.path
          key={`l${line}`}
          d={line}
          fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${col}aa)` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {hp && (
          <motion.line
            y1={pad}
            y2={H - pad}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="1"
            initial={{ x1: hp[0], x2: hp[0], opacity: 0 }}
            animate={{ x1: hp[0], x2: hp[0], opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        )}
        <circle cx={last[0]} cy={last[1]} r="3.2" fill={col} style={{ filter: `drop-shadow(0 0 6px ${col})` }} />
        {hp && (
          <motion.circle
            r="4"
            fill="#fff"
            stroke={col}
            strokeWidth="1.5"
            initial={{ cx: hp[0], cy: hp[1], opacity: 0 }}
            animate={{ cx: hp[0], cy: hp[1], opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          />
        )}
      </svg>

      {hp && (
        <motion.div
          className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-1"
          initial={{ left: `${(hp[0] / W) * 100}%`, opacity: 0 }}
          animate={{ left: `${(hp[0] / W) * 100}%`, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        >
          <div className="whitespace-nowrap rounded-lg bg-black/85 px-2 py-1 text-center ring-1 ring-white/15">
            <div className="text-[10px] text-white/55">{prettyDate(s[hover!].date)}</div>
            <div className="tabular text-[12px] font-semibold text-white">
              {s[hover!].secs > 0 ? formatShort(s[hover!].secs) : "No study"}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
