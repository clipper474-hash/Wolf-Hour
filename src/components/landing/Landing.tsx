"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Download, Share2 } from "lucide-react";
import { SmoothCursor } from "@/components/landing/SmoothCursor";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Reveal } from "./Reveal";
import "./landing.css";

/** Alternate filmstrip rows left/right. `lp-flip`, not `flip` — globals.css
 *  owns `.flip` for the split-flap clock (inline-block, em-sized). */
const cnRow = (i: number) => (i % 2 ? "lp-strip-row lp-flip" : "lp-strip-row");

// Filmstrip frames: real screenshots, one hook + two proof bullets each.
// Flagship frames link out via a crawlable <a href> — depth lives on the page.
const FRAMES: {
  num: string;
  title: string;
  body: string;
  bullets: [string, string];
  img: string;
  alt: string;
  href?: string;
}[] = [
  {
    num: "01 · SCENES",
    title: "Pick your world",
    body: "Eleven live cinematic scenes — misty torii, lake cabins, golden hours, neon rain. Each one breathes behind your clock instead of sitting frozen.",
    bullets: ["Real video, not a wallpaper", "Your scene follows you across every mode"],
    img: "/showcase/scene-switcher.jpg",
    alt: "The Wolfhour scene switcher — a row of live cinematic scenes over a misty forest shrine",
  },
  {
    num: "02 · TIMER",
    title: "A timer that feels like a ritual",
    body: "25 on, 5 off, world muted. Focus blocks, short and long breaks, and a count-up stopwatch — one tap apart, ending in a soft two-note chime instead of an alarm.",
    bullets: ["Classic 25/5/15 pomodoro rhythm", "Stopwatch for open-ended sessions"],
    img: "/showcase/pomodoro-timer-ui.jpg",
    alt: "The Wolfhour pomodoro timer in Focus mode over a cinematic scene",
    href: "/pomodoro-timer",
  },
  {
    num: "03 · ASPIRANT MODE",
    title: "See where your hours really go",
    body: "Study tracking for people with an exam date. Per-subject stopwatches feed daily trend charts, so a flatlining subject is visible — not hidden inside one reassuring total.",
    bullets: ["Goals, streaks & exam countdown", "Today / week / month analytics per subject"],
    img: "/showcase/aspirant-mode-analytics.jpg",
    alt: "Aspirant Mode analytics in Wolfhour — per-subject breakdown with a daily trend chart",
    href: "/aspirant-mode",
  },
  {
    num: "04 · SOUNDS",
    title: "Mix your own quiet",
    body: "Rain, ocean, café hum, fireplace — 22 sounds across five groups, layered with independent volumes. Generated live in your browser, so there's no loop seam to catch your ear.",
    bullets: ["Nature · Places · Instrumental · Lo-Fi · Noise", "Your blend keeps playing in every mode"],
    img: "/showcase/study-sounds-mixer.jpg",
    alt: "The Wolfhour soundscape mixer — layered study sounds with independent volume sliders",
    href: "/study-sounds",
  },
  {
    num: "05 · TASKS",
    title: "A quiet list, not a second job",
    body: "Jot the day's three things, check them off, clear the done pile in one tap. No projects, no labels, no productivity homework.",
    bullets: ["Lives one tap away in the dock", "Daily quotes & badges ride along"],
    img: "/showcase/tasks-panel.jpg",
    alt: "The Wolfhour tasks panel — a short study to-do list over a live scene",
  },
  {
    num: "06 · HOME",
    title: "A clock worth staring at",
    body: "Between sessions the dashboard rests: a greeting, a quote, and a big beautiful clock in your pick of faces — flip, LED, LCD, glitch, ember.",
    bullets: ["Clock & font styles to match your scene", "Fullscreen one tap away"],
    img: "/showcase/home-dashboard.jpg",
    alt: "The Wolfhour home dashboard — a large clock and greeting over a misty forest scene",
  },
];

const FAQS = [
  { q: "Is Wolfhour free?", a: "Yes — the core experience is free to use. Every scene, sound, and timer is included; start focusing in seconds." },
  {
    q: "Do I need an account?",
    a: "No — jump straight in, no signup. Create a free account whenever you want your setup and study stats synced across your devices.",
  },
  {
    q: "Where is my data stored?",
    a: "On your device first. Your settings also sync to a private cloud row that only your account can read. See the Privacy Policy for details.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Add it to your home screen like an app and everything keeps working; sync resumes when you're back online.",
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
  const [shared, setShared] = useState(false);
  const zenRef = useInView<HTMLElement>();
  const instRef = useInView<HTMLElement>();

  // Try-first: the app is fully usable without an account (local-first stores);
  // sign-in lives in Settings and gates only sync + Aspirant mode.
  const enter = () => router.push("/app");

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
            <span className="lp-rise" style={{ animationDelay: "0.1s" }}>A</span>{" "}
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.18s" }}>beautiful</span>{" "}
            <span className="lp-warm lp-rise" style={{ animationDelay: "0.26s" }}>place</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.34s" }}>to</span>{" "}
            <span className="lp-rise" style={{ animationDelay: "0.42s" }}>study.</span>
            <br />
            <span className="lp-rise" style={{ animationDelay: "0.6s" }}>Free study timer with ambient sounds &amp; living scenes.</span>
          </h1>
          <p className="lp-sub">
            Live cinematic backgrounds, calming soundscapes, and gentle timers —
            everything you need to slip into deep, distraction-free focus.
          </p>
          <div className="mt-7">
            <PrimaryCTA onClick={enter}>Open Wolfhour</PrimaryCTA>
          </div>
          <p className="lp-trust">Free · No signup to start · Works offline</p>
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
              <span>Free — start focusing in seconds, no signup</span>
              <span>Works like an app, even offline</span>
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
          and ambient sound mixer that tracks your study hours per subject,
          works offline, and syncs across your devices. No signup needed to
          start.
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
          <p className="lp-sub">Scroll through the hour, frame by frame.</p>
        </Reveal>
        <div className="lp-strip">
          {FRAMES.map((f, i) => (
            <Reveal key={f.num}>
              <div className={cnRow(i)}>
                <div className="lp-strip-shot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.alt} width={1440} height={900} loading={i === 0 ? "eager" : "lazy"} />
                </div>
                <div>
                  <span className="lp-strip-num">{f.num}</span>
                  <h3 className="font-display">{f.title}</h3>
                  <p>{f.body}</p>
                  <ul>
                    {f.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                  {f.href && (
                    <p className="mt-3 text-[14px]">
                      <Link href={f.href} className="text-cyan-300 underline-offset-2 hover:underline">
                        Learn more →
                      </Link>
                    </p>
                  )}
                </div>
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
            <span className="dot" /> <LiveClock /> — the city sleeps. you study.
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
            No clutter, no noise — just you, a calm scene, and the work in
            front of you.
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
            <span>FREE TO USE</span><span>NO SIGNUP TO START</span><span>WORKS OFFLINE</span><span>SYNCS ACROSS DEVICES</span>
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
            <Link href="/pomodoro-timer">Pomodoro Timer</Link>
            <Link href="/study-sounds">Study Sounds</Link>
            <Link href="/aspirant-mode">Aspirant Mode</Link>
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
    </div>
  );
}
