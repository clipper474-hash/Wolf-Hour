# Grill Summary — Polaris (Flocus-style focus dashboard)
Date: 2026-07-07

## Purpose
Polaris is a calm, premium, richly-animated focus & ambience dashboard — a 95–99% faithful reconstruction of Flocus (app.flocus.com) in *function and feel*, rebuilt as an original, legally-clean product with richer graphics, smoother animation, and a clean liquid-glass UI. It gives users a full-screen space to focus (timers), relax (ambient scenes + soundscapes), and stay organized (tasks, notepad), over live animated backgrounds.

## Locked Decisions (confirmed with user)
- **Target:** new project `C:\Users\clipp\Polaris` — ✅ scaffolded, deps installed, dev server verified.
- **Stack:** Next.js 16 + React 19 (App Router) · Tailwind 4 · shadcn/ui · TypeScript · Turbopack.
- **Animation:** GSAP + Motion. **WebGL:** three + @react-three/fiber + @react-three/drei.
- **Audio:** Howler.js + native Web Audio (binaural/noise).
- **Data/Auth:** Supabase (Postgres + Auth + Realtime), `@supabase/ssr`.
- **Landing reference:** **Fora** (fora.so) — dark/calm/cinematic; tokens extracted to `docs/reference/`. Restyled to Polaris accent purple `#7432ff`. (Adora ref removed.)
- **Surface language:** **clean liquid glass** (subtle) — system-wide: nav, dock, cards, drawers, pickers. Tasteful frost + specular edge + faint noise; reduced-motion/low-power fallback to solid translucent.
- **Theme scope v1:** curated **~30-slot starter set** covering every category × mode × color cell — start here, expand to full library (~93 photos + ~60 worlds) in parallel after progress.
- **Aesthetic goal:** parity + a restrained "richer" layer (living shader backgrounds, magnetic dock, shared-element mode morphs, subtle audio-reactivity) governed by a global motion kill-switch. Never sacrifices calm/legibility.

## In Scope (v1)
- **Three core surfaces:** Home (live clock + greeting + rotating quote), Focus (timer with modes), Ambient (scene backgrounds).
- **Theme engine:** 3 slots (Home/Focus/Ambient), 4 Types (World/Gradient/Solid/Animated), full filter taxonomy (Type·Category·Mode·Color), ~30 starter themes, live preview, animated→static fallback.
- **Timer:** 5 modes (Pomodoro, Countdown, Stopwatch, Animedoro, 52/17), segment lengths, breaks, auto-start, progress bar, session tallies.
- **Soundscape mixer:** layered simultaneous sounds w/ per-sound volume; binaural beats + white/pink/brown noise (Web Audio generated); curated free set to start.
- **Tasks:** add/priority/checkbox/reorder/delete, progress + count.
- **Notepad:** scratchpad w/ word·char count.
- **Clock:** 12/24h, timezone, seconds, dynamic greetings.
- **Clock & Font Style picker (user-facing):** switch the clock *display style* AND the *display font* from a curated set of unique, interesting varieties. Persisted per user, live preview.
  - **Clock display styles (proposed):** Standard (clean digital) · Flip (animated flip-card) · Minimal (hairline/thin) · Mono (terminal/tabular) · Segment (LED 7-seg) · Serif (elegant editorial) · Handwritten (script) · Outline (stroked). Optional: analog dial later.
  - **Display font varieties (proposed, all free):** Hanken Grotesk (default, warm geometric) · Onest (rounded) · General Sans (neutral premium) · Satoshi (crisp techy) · Space Grotesk (quirky editorial) · a serif (Lora) · a handwritten (Caveat) · a condensed (Archivo). Fonts already installed.
  - Style + font are independent axes (any font × any clock style).
- **Quotes:** categories + show-in-Home/Focus toggles.
- **Settings:** offcanvas drawer covering all above (Themes/Clock/Timer/Tasks/Sounds/Quotes/Extras).
- **Extras:** disable-animated-themes, clear mode, prevent sleep (Wake Lock), PiP task, streak counter.
- **Landing page:** Fora-style dark marketing page linking into the app.
- **Auth:** email + Google sign-in (Supabase). Settings/tasks/notes persist locally, sync when signed in.

## Out of Scope (later / parallel)
- Full theme library (~93 photos + ~60 worlds) — added in parallel after v1 starter set.
- Full 45-sound library + custom playlists (Spotify/YouTube) — start with curated free set.
- Focus Stats / Focus Score analytics dashboard, Cloud Sync polish — later phase.
- Rich-text notepad (TipTap), reorderable task ETAs, color tags/emoji — MVP is simpler.
- Monetization / real paywall — see assumptions.
- Installable PWA + offline theme precache — see assumptions.

## Core Entities
- **Theme**: id, title, type, category, mode, colorFamily, render{technique, asset/shader, fallback}, overlay, dominantColor, provenance(source/license). Assigned per slot (home/focus/ambient).
- **Sound**: id, label, emoji, category, src/loop, tier; runtime: volume, playing.
- **TimerConfig**: mode, focusLen, breakLen, longBreakLen, autoStart, tallies.
- **Task**: id, text, done, order, (later: eta, tags).
- **Note**: id, body, updatedAt.
- **Settings**: theme slots, clock opts, quote opts, extras toggles, motion tier.
- **User** (Supabase): id, email, provider; owns settings/tasks/notes/stats.

## Key User Flows
1. Land on Home → see live clock/greeting/quote over an animated theme → open dock.
2. Start a focus session → pick timer mode → run timer → (optional) mix ambient sounds → track streak.
3. Enter Ambient mode → pick a scene → relax with looping background + soundscape.
4. Open Settings drawer → change theme per slot (live preview) / adjust timer / toggle extras.
5. Sign in → settings/tasks/notes sync across devices.

## Constraints
- **AGENTS.md:** "This is NOT the Next.js you know" — read `node_modules/next/dist/docs/` before writing Next code; heed deprecation notices. (Next 16 has breaking changes vs training data.)
- **Copyright:** reuse ZERO Flocus assets. Gradients/shaders original; photos/video from royalty-free APIs (Unsplash/Pexels/Coverr) matched by mood; store provenance. Degular font → free substitutes (Hanken Grotesk/Onest). App accent purple `#7432ff` retained (not copyrightable).
- **Performance:** liquid glass + WebGL gated by motion/perf kill-switch (detect-gpu tiering, DPR clamp, visibility pause, reduced-motion). Clock is HTML/SVG, never blocked on WebGL.
- **Windows / Node 24 / npm 11** dev environment.

## Open Questions / Assumptions (DEFAULTS — confirm or override)
1. **Monetization:** *Assumption →* v1 has NO paywall; build everything unlocked (skip Flocus's Free/Plus gating). Real billing = later. 
2. **Analytics:** *Assumption →* none for MVP (add PostHog later if wanted). Not replicating Flocus's 5 trackers.
3. **PWA/offline:** *Assumption →* not in v1; add `@ducanh2912/next-pwa` in a later phase.
4. **Notepad fidelity:** *Assumption →* plain `<textarea>` + counts for v1; TipTap later.
5. **Auth at launch:** *Assumption →* email + Google; local-first, sync on sign-in. Others (Apple/GitHub/magic-link) later.
6. **Font for display/clock:** ✅ *Decided →* Hanken Grotesk = default app clock/display; Inter = body; Fora landing = Inter/Inter Display. **PLUS a user-facing "Clock & Font Style" picker** (in scope, see below) — the clock face and display font are changeable from a curated set of unique, interesting varieties.
7. **First build target:** *Assumption →* start the build with the **design system + liquid-glass primitives + Home screen (clock/greeting/quote over one shader gradient theme)** as the first vertical slice, then expand.

## Success Criteria
- Side-by-side, Polaris reads as the same *kind* of product as Flocus at 95–99% fidelity, but visibly richer and smoother, with a cohesive clean liquid-glass system.
- All v1 in-scope features functional; theme engine fully data-driven with ~30 starter themes and working fallbacks.
- Zero Flocus assets used; all imagery original or royalty-free with provenance.
- Smooth on mid-tier hardware (60fps target; graceful degradation via kill-switch).
- Clean, legally-distinct, deployable Next 16 app.
