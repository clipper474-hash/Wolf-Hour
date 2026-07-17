# Design Brief — Polaris
Date: 2026-07-07

## Existing Design System Findings
- **Framework/UI:** Next 16 + React 19 + **Tailwind 4** + **shadcn/ui** (Radix under it) already installed. `components.json`-ready.
- **Tokens already present:** `docs/reference/` holds a full **Fora-derived token system** (DESIGN.md, tokens.json, variables.css, theme.css) — dark palette, Inter type scale, radii, glass effects, atmosphere gradient — with the Polaris accent `#7432ff` already swapped in.
- **App palette (from Flocus analysis):** brand purple `#7432ff`/`#8b5cff`, Home dusk gradient hues (indigo→magenta→coral), forest greens for Ambient — documented in `docs/REPLICATION-BRIEF.md`.
- **Fonts installed:** Inter (via Google), Hanken Grotesk, Onest, Lora, Caveat, Archivo. (General Sans, Satoshi, Space Grotesk to add for the font picker.)
- **Animation/graphics libs:** GSAP, Motion, three + R3F + drei, lenis, detect-gpu — installed.
- **Design-tokens step:** **Mostly done.** We have landing tokens (Fora) + app palette (Flocus). The design-tokens step will be *light* — consolidate both into a single canonical `globals.css` `@theme` + a `.glass` primitive, not a from-scratch token build.

## Emotional Tone & Feel
**Calm, premium, cinematic, alive.** Polaris should feel like a quiet luxury product — a dark, spacious sanctuary you *want* to leave open all day. Not flashy, not busy: restraint with one or two moments of quiet delight (living background, a satisfying mode transition). The mood is **"focused stillness with a pulse"** — mostly serene, with subtle continuous motion (breathing gradients, drifting particles) that signals it's live without demanding attention. Every element earns its place; negative space is a feature.

## Visual Inspiration
- **Fora (fora.so)** — *primary landing reference.* Borrow: pure-black canvas, warm snow `#fff3f0` text, light-weight Inter with tight −0.04em tracking, stadium-pill glass buttons, dark 16px cards, dusk-gradient atmosphere.
- **Flocus (app.flocus.com)** — *app functional/structural reference.* Borrow: full-bleed hero layout, giant centered clock, floating glass dock, offcanvas settings, per-slot theme engine. (Re-created originally, zero assets reused.)
- **Linear / Vercel** — borrow: single-accent discipline on near-monochrome, glass surfaces, depth from layering not shadow, crisp motion.
- **Apple "Liquid Glass"** — borrow: the clean liquid-glass surface treatment (frost + specular edge + faint refraction), applied with restraint.

## Density & Layout Philosophy
**Spacious, single-focal-point.** The opposite of a dashboard grid. Each screen has one dominant element (the clock, the timer, the scene) centered on a full-bleed animated background, with all controls collapsed into a floating glass dock + on-demand offcanvas drawers. Settings/pickers are where density is allowed (lists of sounds, themes, toggles) — but even there, grouped and calm. Generous vertical rhythm; content breathes.

## Brand Constraints
- **Accent:** purple `#7432ff` (hover `#8b5cff`) — one saturated action color per view, rationed. Everything else achromatic/atmospheric.
- **Text on dark:** warm snow `#fff3f0`, never pure white for body; muted `rgba(255,255,255,0.6)`; `#5e5e5e` metadata.
- **Surfaces:** black `#000` canvas; panels `#242424`/`#2a2a2a`; **clean liquid glass** as the system surface language (nav, dock, cards, drawers, pickers).
- **Type:** Inter (body/UI, tight tracking); Hanken Grotesk default display/clock; user-switchable clock+font picker.
- **Radius:** stadium pills (9999px) for buttons/chips; 16px cards; 15px media.
- **Copyright:** zero Flocus assets; original/royalty-free only.
- **No heavy shadows** — depth via border + glass + subtle elevation.

## Dark Mode
**Dark-first and dark-primary** (the product *is* dark). Light mode is NOT a v1 requirement — the Flocus/Fora aesthetic is inherently dark. Themes can be tagged Light/Dark (a background-brightness attribute), but the UI chrome stays dark-glass throughout. (A true light UI theme = later, optional.)

## Motion Principles — ASMR-grade, Apple-caliber
**North star: every animation and effect is ASMR-like — flawless, clean, soft, tactile, and satisfying — executed to Apple's UI standard.** ASMR is the *feeling*; **Apple's motion language is the engineering bar** that produces it. "Smooth" is a hard requirement, not a nice-to-have: one stutter breaks the spell.

**Apple-caliber specifics (the reference standard):**
- **Interruptible springs, not fixed durations** — physics-based motion that can be grabbed/reversed mid-flight; use Motion springs for interactive elements, never rigid CSS keyframe durations.
- **Spatial continuity** — elements move *from where they were*: panels grow out of the control that opened them; shared-element transitions everywhere (mode-morph is the hero case). Never fade-swap what should move.
- **Momentum & rubber-banding** — scroll/drag carry inertia and gently resist at bounds (lenis + spring clamps).
- **Materials & depth** — translucent vibrancy sampling what's behind, layered blur, subtle parallax = the liquid glass done Apple-correctly.
- **Consistent curve family** — one shared spring config across the whole app; consistency (not variety) is what reads as "Apple."
- **Depth-aware light/shadow** — soft, wide, low-opacity elevation that responds to layer order; never hard drop-shadows.

**Concretely:**
- **Buttery, never janky:** locked 60fps (120 where available); animate only `transform`/`opacity`/filters (GPU), never layout-triggering props.
- **Soft, weighted motion:** spring physics with gentle overshoot & settle (stiffness ~260, damping ~26); nothing snaps, pops, or moves linearly — everything decelerates as if it has mass.
- **Tactile feedback:** press-scale (~0.96), magnetic hover pull, pointer-tracked glow/sheen, soft ripple — every interactive element responds physically.
- **Micro-detail:** staggered reveals (40–60ms), per-character text blur-up, rolling (not cutting) digits, seamless zero-seam loops.
- **Seamless transitions:** shared-element morphs + crossfades between modes; never hard cuts.
- **Optional literal ASMR sound design:** subtle soft UI ticks/taps on toggles, a gentle *thunk* on timer start — toggleable, OFF by default, routed through the existing audio engine.
- **Restraint is the trick:** ASMR = *fewer effects, each perfect*, gentle and low-amplitude — never busy or energetic. Over-animating breaks it.
- **Flawless includes the fallback:** on weak hardware / reduced-motion it stays smooth by simplifying, never by stuttering.

- **Calm is the prime directive.** All motion slow, low-amplitude, easily killable.
- **Global kill-switch** (`data-motion="full|reduced"`) mirrors Flocus's "disable animated themes"; seeded from `prefers-reduced-motion`; reduced → static gradient, no WebGL, native scroll.
- **Performance-gated:** detect-gpu tiering, DPR clamp, visibility pause, FPS governor. Clock is HTML/SVG, never blocked on WebGL.
- **Signature moment:** shared-element morph of the central clock/card between Home/Focus/Ambient, with the background shader palette cross-dissolving.
- **Micro-interactions:** spring physics (stiffness ~260, damping ~26), magnetic dock, staggered reveals, tactile button press — felt, not seen.

## Design Principles for This Project
1. **One focal element per screen** — the clock, the timer, or the scene. Everything else recedes into glass.
2. **Glass is the surface, black is the void, purple is the only shout** — never break the achromatic + single-accent discipline.
3. **Everything animated has a static twin** — every motion/WebGL effect ships a reduced-mode fallback; nothing breaks calm or perf.
4. **ASMR-grade or it doesn't ship** — every animation/effect is flawless, soft, tactile, 60fps; one stutter breaks the spell. Fewer effects, each perfect.
5. **Legibility over spectacle** — glass and gradients never compromise text contrast; the clock is always instantly readable.
6. **Data-driven, not hard-coded** — themes, sounds, clock styles, fonts are config sets, so the library scales without touching layout.
7. **Original by construction** — every visual is procedural or royalty-free with provenance; no asset is a Flocus derivative.

## Standing Design Rules (user directives — always apply)
1. **Color harmony first.** Before adding ANY color, verify it blends with the active video scene (forest/lake/nature). Purple `#7432ff` can clash over green — prefer neutral/white glass for UI, ration saturated color, consider theme-aware accents.
2. **Big-font timer layout.** When the clock/timer font is large, the mode selector (Pomodoro/Stopwatch/etc. menu bar) moves to the TOP of the page — controls frame the screen, the time stays the centered focal element.
3. **Clock & font variety is core.** Build the timer/clock with MANY selectable styles (flip clock, etc.) and multiple display fonts from the start — never a single hardcoded style. (Circular progress-ring stopwatch was rejected — use flip-clock / distinct typographic styles instead.)
