# Alpha Focus — Landing Page: CURRENT STATE (handoff)

> Landing page is BUILT and verified. This is the continue-in-new-session brief.
> For deep theme/token reference see `docs/LANDING-PAGE-BRIEF.md` (original spec).
> Verified against repo on 2026-07-13.

---

## Status: DONE ✓ (open to polish)

Landing page is live at `/`. The immersive app moved to `/app`. Both compile 200, no
real console errors, typecheck clean (only the 2 known `bento-grid`/`video-text` errors).

---

## Routing (Option A — shipped)

- `/`      → marketing landing (`src/app/page.tsx`)
- `/app`   → immersive dashboard (`src/app/app/page.tsx`)
- `manifest.ts` `start_url` = `/app` (installed PWA/TWA opens the app)

---

## Files (all created/edited this build)

- `src/app/page.tsx` — landing route. Server component, full SEO metadata
  (title/description/keywords/canonical/openGraph/twitter). Wraps `<Landing/>` in a
  `h-dvh overflow-y-auto scroll-smooth` container (global `body{overflow:hidden}` means the
  landing scrolls inside its own element).
- `src/components/landing/Landing.tsx` — the whole page ("use client").
- `src/components/landing/Reveal.tsx` — scroll-reveal wrapper (motion `whileInView`, once).
- `src/app/app/page.tsx` — the moved dashboard.
- `public/showcase/dashboard.png` — real dashboard screenshot (azure-beach scene, on-palette).

---

## Palette — PREMIUM TEAL, NO PURPLE (hard rule)

User rejected purple. Everything uses teal → cyan → blue. Do NOT reintroduce
purple/violet/pink/magenta anywhere on the landing.

- Aurora headline colors (`AURORA` const): `#2dd4bf, #22d3ee, #38bdf8, #3b82f6`
- Feature icon spectrum (`MAGIC` const): `#2dd4bf, #22d3ee, #38bdf8, #3b82f6, #10b981, #06b6d4`
- CTA pill: `bg-gradient-to-b from-[#22d3ee] to-[#2563eb]`, glow `rgba(56,189,248,0.45)`
- Section glows: teal `rgba(45,212,191,…)` + blue `rgba(59,130,246,…)` + cyan `rgba(6,182,212,…)`
- Uses Magic UI `AuroraText` (`src/components/ui/aurora-text.tsx`) for "focus" + "lock in"
  — pass `colors={AURORA}` (its default palette is purple; always override).
- The app itself (`/app`) still uses its purple `--color-accent-*` tokens — that's the app, not
  the landing. Leave it unless asked.

---

## Sections (top → bottom, in Landing.tsx)

1. Hero — living `golden-hour` scene (warm dusk) + scrims; eyebrow pill; `AuroraText` "focus";
   subhead; CTA "Open Alpha Focus" (→ /app) + ghost "See what's inside" (→ #features);
   "Free · No account · Works offline". Reduced-motion → poster still.
2. Features — 6 glass cards, each icon in its own teal-family hue + glow.
3. Showcase — `public/showcase/dashboard.png` framed, teal/blue glow behind.
4. Ambience band — `still-water` scene, "Made to feel good".
5. PWA/install — teal download card + checklist + CTA "Launch the app".
6. Final CTA — "Ready to <AuroraText>lock in</AuroraText>?" + teal/blue glow.
7. Footer — wordmark, Features/Open app nav, "© 2026 Alpha Focus · royalty-free" line.

---

## Theme / reuse (unchanged from app)

- Dark-first; `.glass` / `.glass-strong` utility classes for frosted panels.
- Headings `font-display` (Hanken Grotesk); body Inter. Global tokens in `src/app/globals.css`.
- Motion springs in `src/lib/motion.ts`; ease `cubic-bezier(0.22,1,0.36,1)`.
- Backgrounds reuse `SceneLayer` (`src/components/background/SceneLayer.tsx`) — now seamless-loops
  on desktop (dual-video crossfade; copy B uses `?b` distinct URL; lite single-video only on real
  touch devices with ≤4 cores). Scenes list: `src/lib/scenes.ts`, files in `public/scenes/`.

---

## Hard rules (still apply)

1. Next 16 ≠ old Next → read `node_modules/next/dist/docs/` before Next-specific code (AGENTS.md).
2. Ponytail: laziest working solution, shortest diff, reuse before add.
3. Caveman: terse chat; code/docs/commits normal.
4. Legal: no copyrighted/watermarked/game-IP assets. Scenes are clean self-hosted clips.
5. NO PURPLE on the landing.

---

## Verify (every change)

```bash
cd "C:\Users\clipp\Alpha Focus"
npm run dev
npx tsc --noEmit 2>&1 | grep -viE "bento-grid|video-text"   # must be clean
```
Then Playwright: navigate `/`, screenshot desktop (1440) + mobile (390), zero console errors.
Landing scrolls inside `main.overflow-y-auto` — reset scroll via `document.querySelector('main').scrollTop=0`.

---

## Possible polish (not required — ask user first)

- Hero scene is warm `golden-hour`; could swap to a cool scene for all-teal cohesion (user liked warm).
- OG/social share image (`opengraph-image.png` 1200×630) — Pillow now available; belongs to SEO pass.
- Real "study with me" copy variants / testimonials (keep honest, no fake logos).
- Deep SEO (sitemap.ts, robots.ts, JSON-LD, Lighthouse) = the dedicated SEO endgame task, not here.
