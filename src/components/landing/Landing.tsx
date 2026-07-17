"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { AuthModal } from "./AuthModal";
import {
  ArrowRight,
  Film,
  Timer,
  GraduationCap,
  AudioLines,
  Clock3,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";
import { SmoothCursor } from "@/components/landing/SmoothCursor";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Reveal } from "./Reveal";
import "./landing.css";

const FEATURES = [
  {
    icon: Film,
    color: "#2dd4bf",
    title: "Live cinematic scenes",
    body: "Hand-picked scenes that loop seamlessly and cross-dissolve like film — misty shrines, golden hours, still water.",
  },
  {
    icon: Timer,
    color: "#38bdf8",
    title: "Focus & study timers",
    body: "Pomodoro, deep-work sessions, and a fullscreen timer that quietly melts the rest of the world away.",
  },
  {
    icon: GraduationCap,
    color: "#818cf8",
    title: "Aspirant study mode",
    body: "Per-subject timers, streaks, badges, and a live study-trend chart that turns effort into momentum.",
  },
  {
    icon: AudioLines,
    color: "#10b981",
    title: "Calming soundscapes",
    body: "Layer rain, waves, and gentle ambience into your own perfect mix — free to start in seconds.",
  },
  {
    icon: Clock3,
    color: "#22d3ee",
    title: "Clock & font styles",
    body: "Beautiful, switchable clock faces — flip, LED, LCD, glitch, ember — and typefaces to match.",
  },
  {
    icon: Sparkles,
    color: "#a78bfa",
    title: "Tasks, quotes & rewards",
    body: "Gentle structure — a quiet to-do list, a daily word to steady you, and badges you actually earn.",
  },
];

const FAQS = [
  { q: "Is Wolfhour free?", a: "Yes — the core experience is free to use. Every scene, sound, and timer is included; start focusing in seconds." },
  {
    q: "Do I need an account?",
    a: "Yes — a free account signs you in and keeps your setup (scenes, sounds, timers, tasks, study stats) synced across your devices.",
  },
  {
    q: "Where is my data stored?",
    a: "On your device first. Your settings also sync to a private cloud row that only your account can read. See the Privacy Policy for details.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Install it as a PWA and everything keeps working; sync resumes when you're back online.",
  },
  {
    q: "I forgot my password — what now?",
    a: "Use “Forgot password?” on the sign-in screen and we’ll email you a reset link to set a new one.",
  },
  { q: "Are the scenes and sounds licensed?", a: "Yes — all backgrounds and sounds are royalty-free." },
];

/* Fixed rain layout — deterministic so SSR and client HTML match. */
const DROPS = [
  { left: "8%", dur: "1.3s", delay: "0s" },
  { left: "16%", dur: "1.7s", delay: "-0.6s" },
  { left: "27%", dur: "1.2s", delay: "-1s" },
  { left: "38%", dur: "1.9s", delay: "-0.2s" },
  { left: "52%", dur: "1.4s", delay: "-1.2s" },
  { left: "63%", dur: "1.6s", delay: "-0.8s" },
  { left: "74%", dur: "1.25s", delay: "-0.4s" },
  { left: "86%", dur: "1.8s", delay: "-1.5s" },
];
const STREAKS = [
  { left: "22%", h: 60, delay: "-1s" },
  { left: "58%", h: 80, delay: "-3.2s" },
  { left: "81%", h: 50, delay: "-2s" },
];

/** Live HH:MM clock — renders a placeholder until mounted (hydration-safe). */
function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setNow(`${p(d.getHours())}:${p(d.getMinutes())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className={className}>{now ?? "--:--"}</span>;
}

/** JS-generated night skyline with flickering windows (client-only). */
function Skyline() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sky = ref.current;
    if (!sky || sky.childElementCount) return;
    let x = 0;
    while (x < 100) {
      const w = 4 + Math.random() * 7;
      const h = 18 + Math.random() * 68;
      const b = document.createElement("div");
      b.className = "lp-bld";
      b.style.cssText = `left:${x}%;width:${w}%;height:${h}%;`;
      const cols = Math.max(1, Math.floor(w * 1.4));
      const rows = Math.max(2, Math.floor(h / 9));
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++)
          if (Math.random() < 0.42) {
            const win = document.createElement("i");
            win.className = "lp-win";
            win.style.cssText = `left:${8 + c * (86 / cols)}%;top:${6 + r * (88 / rows)}%;animation-duration:${3 + Math.random() * 9}s;animation-delay:${-Math.random() * 8}s;opacity:${0.4 + Math.random() * 0.5}`;
            b.appendChild(win);
          }
      sky.appendChild(b);
      x += w + 0.8;
    }
  }, []);
  return <div ref={ref} aria-hidden className="lp-sky" />;
}

/** Adds .lp-inview once the section scrolls into view (draw-on-scroll SVGs). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("lp-inview")),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function PrimaryCTA({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="lp-btn group">
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}

export function Landing() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [authOpen, setAuthOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const zenRef = useInView<HTMLElement>();
  const instRef = useInView<HTMLElement>();

  const enter = () => (user ? router.push("/app") : setAuthOpen(true));

  const share = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Wolfhour",
          text: "A beautiful place to focus — scenes, sounds & gentle timers.",
          url,
        });
      } catch {} // user closed the sheet — not an error
      return;
    }
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="landing relative w-full overflow-x-clip font-body">
      <SmoothCursor />

      {/* ─── NAV ──────────────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <span className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.png" alt="Wolfhour" width={388} height={420} className="lp-logo-img h-5 w-auto opacity-85" />
          <span className="text-[13px] font-extrabold tracking-[0.16em]">WOLFHOUR</span>
        </span>
        <span className="lp-navlinks">
          <a href="#features" className="hidden sm:inline">Features</a>
          <a href="#faq" className="hidden sm:inline">FAQ</a>
          <button onClick={enter} className="hover:text-[inherit]">Open app</button>
          <ThemeToggle />
        </span>
      </nav>

      {/* ─── HERO · rain on glass ─────────────────────────────────────── */}
      <section className="lp-hero">
        <div aria-hidden>
          <div className="lp-bokeh lp-bk1" /><div className="lp-bokeh lp-bk2" />
          <div className="lp-bokeh lp-bk3" /><div className="lp-bokeh lp-bk4" />
          <div className="lp-fog" />
          {DROPS.map((d, i) => (
            <div key={i} className="lp-drop" style={{ left: d.left, animationDuration: d.dur, animationDelay: d.delay }} />
          ))}
          {STREAKS.map((s, i) => (
            <div key={i} className="lp-streak" style={{ left: s.left, height: s.h, animationDelay: s.delay }} />
          ))}
        </div>
        <div className="lp-hero-inner">
          <span className="lp-chip">
            <span className="lp-eq" aria-hidden><i /><i /><i /><i /></span>
            rain.mix — playing
          </span>
          <h1 className="font-display">
            <span className="lp-rise" style={{ animationDelay: "0.1s" }}>Let</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.18s" }}>it</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.26s" }}>pour</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.34s" }}>outside.</span>
            <br />
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.5s" }}>Stay</span>{" "}
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.6s" }}>focused</span>{" "}
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.7s" }}>in</span>{" "}
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.8s" }}>here</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.9s" }}>— your study timer &amp; ambience dashboard.</span>
          </h1>
          <p className="lp-sub">
            Live cinematic backgrounds, calming soundscapes, and gentle timers —
            everything you need to slip into deep, distraction-free focus.
          </p>
          <div className="mt-7">
            <PrimaryCTA onClick={enter}>Open Wolfhour</PrimaryCTA>
          </div>
          <p className="lp-trust">Free · Works offline · Syncs across devices</p>
        </div>
      </section>

      {/* ─── SHOWCASE · split screen with live device mock ────────────── */}
      <section className="lp-show">
        <div className="lp-show-wrap">
          <Reveal>
            <h2 className="font-display">
              Your calmest,<br />most <span className="lp-hl">productive</span> hour.
            </h2>
            <p className="lp-sub">
              One dashboard: a living scene, your clock, your sounds, your timers.
              Nothing else. That&rsquo;s the point.
            </p>
            <div className="lp-checks">
              <span>Free core experience — start focusing in seconds</span>
              <span>Works offline as a PWA</span>
              <span>Syncs across all your devices</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative">
              <div className="lp-device">
                <div className="lp-device-scene" aria-hidden />
                <div className="lp-device-clk">
                  <span className="g">Good evening, wanderer</span>
                  <LiveClock className="t font-display" />
                </div>
                <div className="lp-device-dock" aria-hidden><i /><i /><i /><i /><i /></div>
              </div>
              <div className="lp-floaty lp-f1"><b>▲ 2h 40m</b> studied today</div>
              <div className="lp-floaty lp-f2"><b>🌊 Ocean + rain</b> mix playing</div>
            </div>
          </Reveal>
        </div>
        {/* Plain crawlable copy (never animation-hidden): brand + category keywords. */}
        <p className="mx-auto mt-16 max-w-3xl text-center text-[15px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
          Wolfhour is a free online focus app — a study timer, pomodoro timer,
          and ambient soundscape dashboard that works offline and syncs across
          your devices.
        </p>
      </section>

      {/* ─── FEATURES · orbit rings ───────────────────────────────────── */}
      <section id="features" className="lp-feat">
        <div className="lp-rings" aria-hidden>
          <div className="lp-ring lp-r1" /><div className="lp-ring lp-r2" /><div className="lp-ring lp-r3" />
          <div className="lp-sat" /><div className="lp-sat lp-sat2" />
        </div>
        <Reveal>
          <h2 className="font-display">
            Everything orbits<br /><span className="lp-thin">around your focus.</span>
          </h2>
          <p className="lp-sub">Six quiet tools, one calm dashboard.</p>
        </Reveal>
        <div className="lp-cards">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="lp-card">
                <span
                  className="lp-ico"
                  style={{ color: f.color, borderColor: `${f.color}55`, background: `${f.color}1f` }}
                >
                  <f.icon className="size-5" />
                </span>
                <h3 className="font-display">{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── AMBIENCE · city window (dark) / golden hour (light) ─────── */}
      <section className="lp-band">
        <div className="lp-sun" aria-hidden />
        <div className="lp-plane" aria-hidden />
        <Skyline />
        <Reveal>
          <span className="lp-band-chip">
            <span className="dot" /> <LiveClock /> — the city sleeps. you build.
          </span>
          <h2 className="font-display">
            For everyone whose<br /><span className="lp-lit">light is still on.</span>
          </h2>
          <p className="lp-sub">
            Late-night scenes, low-key soundscapes, and timers that keep you
            company while the rest of the city dreams.
          </p>
        </Reveal>
      </section>

      {/* ─── ZEN · ink & mist quote ───────────────────────────────────── */}
      <section ref={zenRef} className="lp-zen">
        <div className="lp-mist lp-mi1" aria-hidden /><div className="lp-mist lp-mi2" aria-hidden />
        <svg className="lp-enso" viewBox="0 0 300 300" aria-hidden>
          <circle cx="150" cy="150" r="120" transform="rotate(-80 150 150)" />
        </svg>
        <Reveal>
          <span className="lp-kanji">静 · STILLNESS · 集中</span>
          <h2 className="font-serif">
            Empty the cup.<br />Fill <em>the hour.</em>
          </h2>
          <p className="lp-sub">
            Every animation is tuned to be buttery-smooth and quiet. No clutter,
            no noise — just you, a calm scene, and the work in front of you.
          </p>
        </Reveal>
      </section>

      {/* ─── INSTALL · blobs + drawn circle ───────────────────────────── */}
      <section ref={instRef} className="lp-inst">
        <div className="lp-blob lp-b1" aria-hidden /><div className="lp-blob lp-b2" aria-hidden />
        <span className="lp-scrib" style={{ right: "12%", top: "14%" }}>works offline!</span>
        <span className="lp-scrib" style={{ left: "10%", bottom: "12%", animationDelay: "-2s" }}>free to use!</span>
        <div className="lp-inst-wrap">
          <Reveal>
            <h2 className="font-display">
              Installs like an app.<br />Feels like a{" "}
              <span className="lp-circ">
                ritual
                <svg viewBox="0 0 120 60" aria-hidden>
                  <path d="M8,32 C10,12 96,4 112,22 C122,36 84,54 40,52 C18,50 6,44 10,30" />
                </svg>
              </span>
              .
            </h2>
            <p className="lp-sub">
              Add Wolfhour to your home screen and it runs fullscreen and offline
              — a distraction-free window that&rsquo;s always one tap away.
            </p>
            <div className="mt-7">
              <PrimaryCTA onClick={enter}>Launch the app</PrimaryCTA>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lp-inst-card">
              <div className="ph"><Download className="size-8" /></div>
              <h3 className="font-display">Add to Home Screen</h3>
              <p>
                Open the app, then choose &ldquo;Add to Home Screen&rdquo; from
                your browser menu. Done — it&rsquo;s yours, even offline.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FINAL CTA · gradient mesh ────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-mesh" aria-hidden />
        <Reveal className="lp-frame">
          <span className="lp-eyebrow">Focus · Ambience · Free to use</span>
          <h2 className="font-display">
            Ready to <span className="lp-flow">lock in?</span>
          </h2>
          <p className="lp-sub">Open Wolfhour and slip into your calmest, most productive hour.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <PrimaryCTA onClick={enter}>Start focusing</PrimaryCTA>
            <a href="#faq" className="lp-ghost">See FAQ</a>
          </div>
          <div className="lp-logos">
            <span>PWA</span><span>OFFLINE-FIRST</span><span>FREE TO USE</span><span>CROSS-DEVICE SYNC</span>
          </div>
        </Reveal>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="lp-faq relative px-6 pb-28 pt-6 sm:pb-36">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Questions, answered
            </h2>
          </Reveal>
          <div className="mt-12 space-y-3">
            {FAQS.map((f) => (
              <Reveal key={f.q}>
                {/* native <details> — accessible, zero JS */}
                <details>
                  <summary className="font-display">
                    {f.q}
                    <span aria-hidden className="mark">+</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="lp-foot relative px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-white.png" alt="Wolfhour" width={388} height={420} loading="lazy" className="lp-logo-img h-6 w-auto opacity-85" />
            <span className="text-[13px] font-semibold tracking-[0.14em]">WOLFHOUR</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px]">
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <button onClick={share} className="inline-flex items-center gap-1.5">
              <Share2 className="size-3.5" />
              {shared ? "Link copied!" : "Share"}
            </button>
            <button onClick={enter}>Open app</button>
          </nav>
        </div>
        <div className="mx-auto mt-8 max-w-6xl pt-6 text-center text-[12.5px]" style={{ borderTop: "1px solid var(--line)", color: "var(--ink-3)" }}>
          © 2026 Wolfhour · All backgrounds &amp; sounds are royalty-free.
        </div>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignedIn={() => router.push("/app")} />
    </div>
  );
}
