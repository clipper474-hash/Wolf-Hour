# Alpha Focus — Landing Page Build Brief

> Self-contained handoff. Paste this whole file (or point to it) at the start of a fresh session.
> Everything below is verified against the real repo on 2026-07-13.

---

## 0. What this is

Build a **beautiful marketing landing page** for **Alpha Focus** — a calm, premium, ASMR-grade
focus & ambience dashboard (a legally-clean, richer replica of Flocus). The app itself is DONE.
This is the second-to-last endgame task. Order: **landing page → security hardening → SEO.**

The landing page must feel like the product: cinematic, dark-first, liquid-glass, buttery
Apple-smooth motion. It is the first thing a visitor sees and the page that gets indexed / linked
from the Google Play (TWA) listing, so it carries the SEO weight later.

---

## 1. Project location, stack, how to run

- **Root:** `C:\Users\clipp\Alpha Focus`
- **Framework:** Next.js **16.2.10** (App Router, Turbopack), React **19.2.4**, TypeScript, Tailwind **v4**
- **Motion:** `motion` v12 (`import { motion } from "motion/react"`)
- **State:** `zustand` v5 (+ `persist` for anything saved)
- **Icons:** `lucide-react`
- **Numbers:** `@number-flow/react`
- Also available (already installed — use only if genuinely needed): `gsap`, `lenis` (smooth
  scroll), `@react-three/fiber` + `three` + `@react-three/drei`, `detect-gpu`, `sonner` (toasts),
  `vaul` (drawers), `cmdk`, `@base-ui/react`, `class-variance-authority`, `clsx` + `tailwind-merge`.

**Run / verify (do this every time before claiming done):**
```bash
cd "C:\Users\clipp\Alpha Focus"
npm run dev                       # http://localhost:3000
# typecheck — filter the TWO known-unrelated pre-existing errors:
npx tsc --noEmit 2>&1 | grep -viE "bento-grid|video-text"
```
Then verify visually with the Playwright MCP tools (`mcp__plugin_playwright_playwright__*`):
navigate → screenshot → check console has no errors. Do NOT declare done without a screenshot.

---

## 2. HARD RULES (do not violate)

1. **Next 16 is not the Next you know.** Before writing any Next-specific code (metadata, routes,
   `next/font`, `next/image`, dynamic APIs), read the relevant guide in
   `node_modules/next/dist/docs/`. Heed deprecation notices. (This is enforced by `AGENTS.md`.)
2. **Ponytail mode (lazy/minimal):** laziest working solution, native/stdlib first, shortest diff,
   fewest new deps. Reuse what's already in the repo (below) before adding anything.
3. **Legal / zero-copyright:** NO ripped Spotify/copyrighted audio, NO Pinterest content, NO
   watermarked or game-IP assets. Video/imagery only from Pexels / Pixabay / Coverr / Mixkit, and
   only watermark-clean clips. The app already ships clean self-hosted scenes — reuse those.
4. **Design language is fixed:** dark-first, cinematic live background, liquid-glass surfaces,
   Apple/ASMR-smooth motion, color harmony, no jank. Respect `prefers-reduced-motion`.
5. **Custom cursor + non-select shell is global** (see globals.css). Don't fight it; landing
   inherits it. Text inside inputs stays selectable automatically.

---

## 3. FIRST DECISION — where the landing lives (pick before building)

Currently `/` (`src/app/page.tsx`) **is the app dashboard**, and the PWA manifest `start_url` is `/`.

- **Option A (SEO-correct, recommended):** landing becomes the root `/`; move the current
  dashboard to `/app`. Update `src/app/manifest.ts` `start_url` to `"/app"`. Root is the most-linked,
  most-indexed URL → best for the Play listing + SEO endgame. Slightly bigger diff (one file move +
  one manifest line).
- **Option B (smallest diff):** leave the app at `/`; put the landing at `/welcome` (or `/about`).
  Zero risk to the app, but the marketing page isn't the root — weaker SEO.

**Recommendation: Option A.** It's a tiny move and SEO is an explicit remaining goal. Confirm with
the user which they want before restructuring routes.

Whichever is chosen, the landing is its own route segment with its own `page.tsx` and should be
mostly a **Server Component** (static, fast, indexable) with small `"use client"` islands only for
the animated/interactive bits.

---

## 4. Theme tokens (verified from `src/app/globals.css`)

Use these exact values so the landing matches the app.

**Palette**
- `--color-void: #000000` (page base) · `--color-snow: #fff3f0` (primary text) · `--color-pure: #ffffff`
- Panels: `--color-panel: #242424`, `--color-panel-2: #2a2a2a`
- **Accent ramp (purple):** `--color-accent-400: #8b5cff`, `--color-accent-500: #7432ff`, `--color-accent-600: #5f24db`
- Semantic: `--color-success: #2fbf71`, `--color-danger: #c0392b`
- Accent glow: `rgba(116, 50, 255, 0.45)` · manifest theme color `#14101a`, bg `#0d0b12`

**Text roles**
- primary `--color-snow` · muted `rgba(255,243,240,0.6)` · faint `#5e5e5e`

**Liquid glass** — use the existing `.glass` / `.glass-strong` utility classes (do NOT re-roll):
- `.glass` = frosted panel with masked gradient specular rim (blur 28px, saturate 180%, brightness 1.12)
- `.glass-strong` = darker fill `rgba(18,16,26,0.55)` for text-heavy cards
- radius: `--radius-card: 16px`, pill `9999px`
- shadows: `--shadow-md`, `--shadow-dock: 0 12px 40px rgba(0,0,0,0.5)`

**Fonts** (all wired in `layout.tsx` via `next/font`, exposed as CSS vars):
- Display/headings: `--font-hanken` (Hanken Grotesk) → `font-display`
- Body: `--font-inter` → `font-body` (default `--font-sans` = Geist)
- Also available: Onest, Lora, Caveat (handwritten), Archivo, Space Grotesk, Geist Mono
- Global letter-spacing is tight: `-0.02em`.

**Motion** (reuse `src/lib/motion.ts` — don't invent new springs):
- `spring` (stiffness 260 / damping 26) — standard
- `softSpring` (180 / 24) — large surfaces / hero
- `reveal` + `staggerParent` — staggered entrance (opacity + y:14 + blur 6→0)
- Global ease: `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`, `--dur-base: 260ms`
- Reduced-motion tier: `:root[data-motion="reduced"]` degrades glass to near-solid; honor it.

---

## 5. Reusable building blocks (REUSE, don't rebuild)

**Background / atmosphere**
- `src/components/background/VideoBackground.tsx` — fullscreen cinematic scene manager with
  crossfade + legibility scrim + reduced-motion gradient fallback. Drop this in for a living hero bg.
- `src/components/background/SceneLayer.tsx` — single seamless-loop video layer (lite-detects weak devices).
- `src/components/background/AuroraBackground.tsx` + `auroraShader.ts` — animated aurora (GPU).
- `src/lib/scenes.ts` — `SCENES[]` (11 clean self-hosted clips) + `DEFAULT_SCENE`. Files live in
  `public/scenes/*.mp4` with posters in `public/scenes/posters/*.jpg`.

**Brand**
- `src/components/brand/BrandMark.tsx` — top-left wordmark + white logo (already global via layout).
- Logos: `public/brand/logo-white.png`, `logo-dark.png`, `icon-192-maskable.png`,
  `icon-512-maskable.png`; app icons `src/app/icon.png`, `src/app/apple-icon.png`.

**UI primitives already in repo** (`src/components/ui/`) — great for landing:
- `aurora-text.tsx` — animated gradient headline text (`<AuroraText>`), default colors pink→purple→blue.
- `bento-grid.tsx` — `BentoGrid` + `BentoCard` (name/description/Icon/background/href/cta) — ideal for a features grid.
- `shine-border.tsx` — animated shining border wrapper for cards/CTAs.
- `video-text.tsx` — text masked with a playing video (`<VideoText src=…>`) — striking hero word.
- `button.tsx` — `Button` (base-ui + cva variants: default/outline/secondary/ghost/destructive/link).
- ⚠️ `bento-grid.tsx` and `video-text.tsx` are the two files with the pre-existing tsc errors that
  the verify command filters — they still render fine; just keep the filter in your typecheck.

**Helpers**
- `src/lib/utils.ts` → `cn()` (clsx + tailwind-merge).
- `src/lib/motion.ts` → springs/variants above.
- `src/lib/ui-store.ts` → `useUIStore` (`mode`, `timerFullscreen`, etc.) if the landing needs to
  hand off into the app.

---

## 6. Landing page — section-by-section spec

Single long, smooth-scrolling page (dark). Consider `lenis` for buttery scroll (already installed),
but only if it doesn't fight the custom cursor. Sections top→bottom:

1. **Hero (above the fold)**
   - Living cinematic background (reuse `VideoBackground` or a single `SceneLayer`) + legibility scrim.
   - Big display headline (Hanken Grotesk) — consider `AuroraText` or `VideoText` for one keyword.
     Copy angle: calm, focus, "your beautiful place to lock in." Keep it short + emotional.
   - One-line subhead (muted snow text).
   - Primary CTA button → "Open Alpha Focus" (routes into the app: `/app` or `/`).
   - Optional secondary ghost CTA → scroll to features.
   - Staggered entrance via `staggerParent`/`reveal` + `softSpring`.
   - Top-left BrandMark already renders globally; make sure it reads on the hero.

2. **Social-proof / trust strip (optional, subtle)** — "free · no account · works offline (PWA)",
   or a thin row of the value props. No fake logos/testimonials (legal + honest).

3. **Features (bento grid)** — reuse `BentoGrid` + `BentoCard`. Cover the real features:
   - Live animated backgrounds (show a scene thumbnail/poster from `public/scenes/posters`).
   - Focus & study timers (incl. fullscreen timer).
   - Aspirant / study mode: per-subject timers, streaks, badges, trend chart, analytics.
   - Ambient soundscapes / mixer.
   - Clock & font styles (customization).
   - Tasks, quotes, rewards.
   - Each card: lucide icon + name + one-line description; `glass` styling; hover lift.

4. **Showcase / preview** — a framed screenshot or short looping preview of the actual dashboard.
   (Capture real screenshots with Playwright from the running app; store under `public/`.)

5. **Ambience / "why it feels good"** — short emotional section on calm, ASMR-smoothness,
   distraction-free. Use a scene video band + `VideoText` or `AuroraText` accent.

6. **PWA / install** — "Add to home screen / installable, works offline." Ties into manifest.

7. **Final CTA** — big centered "Start focusing" button → app. Repeat the primary action.

8. **Footer** — wordmark, tiny nav (features / privacy / the app), copyright line
   "© 2026 Alpha Focus", and an honest note that all media is royalty-free.

**Design guardrails:** dark-first; glass surfaces; purple accent (`#7432ff`) used sparingly for
CTAs/glows; generous spacing; big soft type; every animation eased with `--ease-out-soft`;
scroll-reveal with blur→sharp; nothing that stutters; full reduced-motion fallback. Mobile-first
responsive (the app targets a Play Store TWA — must look perfect on phone widths).

---

## 7. SEO / metadata already in place (extend, don't duplicate)

- `src/app/layout.tsx` already sets root `metadata` (title "Alpha Focus — Focus & Ambience",
  description, applicationName, appleWebApp) and `viewport` (themeColor `#14101a`).
- `src/app/manifest.ts` = full PWA manifest (name, icons, standalone, colors). If you move the app
  under `/app`, update `start_url`.
- The landing route should export its own `metadata` (title/description/openGraph/twitter). Deep SEO
  (sitemap.ts, robots.ts, JSON-LD, OG images, Lighthouse 98–100) is the **next** endgame task — set
  the landing up cleanly so that pass is easy, but don't rabbit-hole on it now.

---

## 8. Security (already partially done — don't regress)

- `next.config.ts` sets baseline security headers (X-Frame-Options, nosniff, Referrer-Policy,
  HSTS, Permissions-Policy) + `poweredByHeader:false`. Strict CSP + nonces is the dedicated
  hardening pass AFTER the landing page. If you add third-party embeds/scripts to the landing,
  note them so the CSP pass can allowlist them (prefer self-hosted to avoid this).

---

## 9. Acceptance checklist (definition of done for the landing page)

- [ ] Routing decision made (Option A/B) and app still fully works.
- [ ] Landing renders at the chosen route, dark cinematic hero with living background.
- [ ] All sections present (hero → features bento → showcase → ambience → PWA → final CTA → footer).
- [ ] CTAs correctly route into the app.
- [ ] Reuses existing tokens/components (`.glass`, `motion.ts` springs, ui primitives, scenes).
- [ ] Fully responsive (phone → desktop); looks perfect at ~390px width.
- [ ] `prefers-reduced-motion` respected; no console errors.
- [ ] `npx tsc --noEmit 2>&1 | grep -viE "bento-grid|video-text"` is clean.
- [ ] Verified with a Playwright screenshot (desktop + mobile viewport).
- [ ] No copyrighted/watermarked assets introduced.

---

## 10. Extra reference docs in-repo (skim if useful)

`docs/design-brief.md`, `docs/design-tokens.css`, `docs/REPLICATION-BRIEF.md`,
`docs/information-architecture.md`, `docs/tasks.md`, `docs/reference/`.
