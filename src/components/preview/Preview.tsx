import Image from "next/image";
import Link from "next/link";
import { DeskClock } from "./DeskClock";
import { ScenePolaroid } from "./ScenePolaroid";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FAQS } from "@/lib/faqs";
import "./preview.css";

/** Redesign candidate — "the study desk". Warm paper, ink serif, handwritten
 *  margin notes; app screenshots taped down like photos. One client island
 *  (DeskClock). Lives at /preview until approved. */

const CARDS: { tab: string; title: string; body: string; href?: string }[] = [
  {
    tab: "scenes ✦",
    title: "Eleven living backdrops",
    body: "Misty torii, lake cabins, golden hours, neon rain — real video that breathes behind your clock, not a frozen wallpaper.",
  },
  {
    tab: "sounds ♪",
    title: "Mix your own quiet",
    body: "22 ambient sounds across five groups, layered with independent volumes and synthesised live — no loop seams, no downloads.",
    href: "/study-sounds",
  },
  {
    tab: "timer ○",
    title: "25 on, 5 off, world muted",
    body: "Classic pomodoro blocks and a count-up stopwatch, ending in a soft two-note chime instead of an alarm.",
    href: "/pomodoro-timer",
  },
  {
    tab: "aspirant ✎",
    title: "Hours that add up",
    body: "Per-subject stopwatches feed daily trend charts — a flatlining subject is visible, not hidden inside one reassuring total.",
    href: "/aspirant-mode",
  },
];

export function Preview() {
  return (
    <div className="pvp">
      {/* ── NAV ── */}
      <nav className="pvp-nav">
        <span className="pvp-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.png" alt="Wolfhour" width={388} height={420} className="h-5 w-auto" />
          WOLFHOUR
        </span>
        <span className="pvp-navlinks">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <Link href="/app" className="pvp-open">Open app →</Link>
          <ThemeToggle />
        </span>
      </nav>

      {/* ── HERO · the open planner ── */}
      <header className="pvp-hero">
        <div className="pvp-hero-grid">
          <div>
            <span className="pvp-date">A QUIET PAGE FOR A LOUD WEEK</span>
            <h1>
              Study like the <span className="pvp-hi">hour belongs to you</span>.
            </h1>
            <p className="pvp-hero-sub">
              Wolfhour is a free study timer with living cinematic scenes and
              layered ambient sound — a calm desk in your browser, ready
              before your coffee is.
            </p>
            <DeskClock />
            <div className="pvp-cta-row">
              <Link href="/app" className="pvp-btn">Open Wolfhour</Link>
              <a href="#features" className="pvp-ghost">What&rsquo;s inside</a>
            </div>
            <p className="pvp-trust">FREE · NO SIGNUP TO START · WORKS OFFLINE</p>
          </div>

          <div className="pvp-stack" aria-label="Screenshots of the Wolfhour app">
            <figure className="pvp-photo pvp-ph1">
              <ScenePolaroid />
            </figure>
            <figure className="pvp-photo pvp-ph2">
              <Image src="/showcase/pomodoro-timer-ui.jpg" alt="The Wolfhour pomodoro timer in Focus mode" width={1440} height={900} sizes="(min-width: 960px) 340px, 90vw" />
              <figcaption className="cap">25:00 — go</figcaption>
            </figure>
            <figure className="pvp-photo pvp-ph3">
              <Image src="/showcase/study-sounds-mixer.jpg" alt="The Wolfhour soundscape mixer with layered study sounds" width={1440} height={900} sizes="(min-width: 960px) 300px, 90vw" />
              <figcaption className="cap">rain + fire, low</figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* ── TONIGHT'S PLAN · the signature ── */}
      <section className="pvp-plan">
        <div className="pvp-plan-sheet pvp-reveal">
          <div className="pvp-plan-title">tonight&rsquo;s plan <em>(realistic version)</em></div>
          <div className="pvp-task done">
            <span className="t">21:00</span><span className="box" />
            <span className="what">pick a scene — <Link href="/app">misty torii</Link> again, obviously</span>
          </div>
          <div className="pvp-task done">
            <span className="t">21:02</span><span className="box" />
            <span className="what">rain + fireplace, volumes just right</span>
          </div>
          <div className="pvp-task done">
            <span className="t">21:05</span><span className="box" />
            <span className="what">start the <Link href="/pomodoro-timer">pomodoro</Link> — 25 on, 5 off</span>
          </div>
          <div className="pvp-task">
            <span className="t">23:30</span><span className="box" />
            <span className="what">check <Link href="/aspirant-mode">where the hours went</Link> <span className="note">(the chart knows)</span></span>
          </div>
          <div className="pvp-task">
            <span className="t">00:00</span><span className="box" />
            <span className="what">one more block. the quiet ones count double</span>
          </div>
          <div className="pvp-plan-foot">— no signup, no bill, it just works. even offline ✓</div>
        </div>
      </section>

      {/* ── FEATURES · index cards ── */}
      <section id="features" className="pvp-sec">
        <div className="pvp-sec-inner">
          <div className="pvp-reveal">
            <span className="pvp-kicker">What&rsquo;s inside</span>
            <h2 className="pvp-h2">Everything on the desk, nothing in the way.</h2>
            <p className="pvp-lead">
              A living scene, your clock, your sounds, your timers. One
              dashboard — that&rsquo;s the point.
            </p>
          </div>
          <div className="pvp-cards">
            {CARDS.map((c) => (
              <div key={c.tab} className="pvp-card pvp-reveal">
                <span className="tab">{c.tab}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
                {c.href && <Link href={c.href} className="go">Read the full page →</Link>}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-14 max-w-3xl text-center text-[15px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
            Wolfhour is a free online focus app — a study timer, pomodoro
            timer, and ambient sound mixer that tracks your study hours per
            subject, works offline, and syncs across your devices. No signup
            needed to start.
          </p>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="pvp-quote pvp-reveal">
        <blockquote>
          &ldquo;Empty the cup. Fill the hour.&rdquo;
        </blockquote>
        <span className="who">— the note taped to every desk</span>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="pvp-sec" style={{ paddingTop: 0 }}>
        <div className="pvp-sec-inner">
          <div className="pvp-reveal" style={{ textAlign: "center" }}>
            <h2 className="pvp-h2">Questions, answered</h2>
          </div>
          <div className="pvp-faq-wrap">
            {FAQS.map((f) => (
              <details key={f.q} className="pvp-faq pvp-reveal">
                <summary>
                  {f.q}
                  <span aria-hidden className="mark">+</span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL ── */}
      <section className="pvp-final">
        <div className="pvp-reveal">
          <h2>Ready when <span className="pvp-hi">you are</span>.</h2>
          <p className="pvp-lead">
            Open Wolfhour and slip into your calmest, most productive hour.
            Installs like an app, works offline.
          </p>
          <div className="pvp-cta-row">
            <Link href="/app" className="pvp-btn">Start focusing</Link>
            <a href="#faq" className="pvp-ghost">See FAQ</a>
          </div>
          <span className="pvp-scrib">your future self says thanks ✎</span>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pvp-foot">
        <div className="pvp-foot-inner">
          <span className="pvp-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-white.png" alt="Wolfhour" width={388} height={420} loading="lazy" className="h-6 w-auto" />
            WOLFHOUR
          </span>
          <nav>
            <Link href="/pomodoro-timer">Pomodoro Timer</Link>
            <Link href="/study-sounds">Study Sounds</Link>
            <Link href="/aspirant-mode">Aspirant Mode</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="pvp-copy">© 2026 Wolfhour · All backgrounds &amp; sounds are royalty-free.</div>
      </footer>
    </div>
  );
}
