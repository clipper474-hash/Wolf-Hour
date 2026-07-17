# Flocus Clone — Final Replication Brief

*Analysis-only architecture brief. No code written yet. Target: a calm, glassmorphic focus dashboard at parity with Flocus (app.flocus.com v1.9.3), plus a restrained enhancement layer.*

---

## 1. Executive Summary

**What Flocus is.** A "calm/zen" ambient focus dashboard — a full-viewport hero canvas (no sidebars, no cards, generous negative space) built around three surfaces: **Home** (giant live clock + time-aware greeting + rotating quote over an ambient gradient), **Focus** (Pomodoro/countdown timer with mode selector, PiP, streaks), and **Ambient** (painterly scene backgrounds). A single frosted-glass floating dock is the only navigation. Monetized via a **Plus** tier.

**Stack Flocus actually uses.** Webpack client SPA (no SSR), **Howler.js** audio mixer, **one WebGL2 canvas** for animated backgrounds, lazy `<video>` for living scenes, Bootstrap `offcanvas` drawers (`z-1045`), paid **Degular** + **Inter** fonts, brand purple `#7432FF`, Google GSI sign-in. Backgrounds composite: black base → JPG poster → WebGL2 → lazy video → UI.

**Our target.** Faithful, legally-clean replica on **Next.js 16 + React 19 + Tailwind 4 + shadcn/ui + Supabase**, reproducing taxonomy/filters/moods/UX exactly, **reusing zero Flocus assets** (every visual re-sourced or procedural), Degular swapped for a free look-alike, plus a disciplined richness layer governed by a motion kill-switch.

---

## 2. Tech Stack Decision

**Next.js 16 + React 19 (App Router).** Reuses libs you already own. SSR/RSC buys server-auth (`@supabase/ssr` cookie sessions), PWA, static asset serving. Skip Vite.

| Your lib | Role |
|---|---|
| Next 16 / React 19 | App shell, routing, RSC, PWA |
| Tailwind 4 | Utility styling + tokens |
| shadcn/ui (+Radix) | Dialogs, tabs, 47 sliders, ~27 switches, selects, popovers |
| GSAP | Flip clock/timer, SplitText reveals |
| Motion | Drawer/tab/PiP transitions, springs, shared-element morphs |
| Supabase | Cloud DB + Auth (settings, tasks, notepad, stats, streaks) |

**Native over libraries:** Web Audio (binaural + noise), MediaSession, Wake Lock, PiP, Fullscreen, Notifications, IntersectionObserver, rAF, HTML5 video. No axios, no moment, no flip-clock/wake-lock/PiP wrappers.

---

## 3. The Dependency List (key deliverable)

```bash
# Core runtime deps
npm install \
  zustand immer \
  vaul cmdk sonner next-themes \
  gsap motion \
  three @react-three/fiber @react-three/drei \
  howler \
  @number-flow/react lucide-react \
  date-fns @date-fns/tz clsx tailwind-merge usehooks-ts nanoid \
  detect-gpu lenis \
  @supabase/supabase-js @supabase/ssr @tanstack/react-query idb-keyval \
  @fontsource-variable/hanken-grotesk @fontsource-variable/onest @fontsource/lora @fontsource/caveat @fontsource/archivo

# Dev / types
npm install -D typescript @types/howler

# Fonts: Inter via next/font/google. Degular is PAID — do NOT use.

# Optional-later (install when you build the feature)
# npm install recharts @tiptap/react @tiptap/starter-kit @dnd-kit/core @dnd-kit/sortable posthog-js @sentry/nextjs react-youtube workbox-window
```

> Not deps: shadcn/ui (CLI-copied) and @radix-ui/* (transitive). Emoji icons need no package.

| Group | Packages | Powers |
|---|---|---|
| State | zustand, immer | Timer, 45-sound mixer, 3 theme slots, ~27 toggles, localStorage mirror |
| UI/styling | tailwind, shadcn, vaul, cmdk, sonner, next-themes | Drawer (z-1045), searchable pickers, toasts, dark/light |
| Animation | gsap, motion | Flip clock/timer, SplitText, transitions, springs, morphs |
| Audio | howler + Web Audio + MediaSession | 45-sound mixer, binaural (2 oscillators L/R detune), white/pink/brown noise (AudioWorklet) |
| WebGL/bg | three + R3F + drei (or ogl) + native video | Animated themes, Ambient Worlds, shaders, lazy video |
| Text FX | GSAP SplitText, @number-flow/react | Quote/greeting reveals, rolling digits, streak counter |
| Icons | lucide-react + native emoji | UI chrome, sound labels |
| Fonts | Inter (next/font); Hanken Grotesk/Onest (Degular sub); Lora/Caveat/Archivo (timer-font set) | Body + display + custom timer font |
| Utilities | date-fns, @date-fns/tz, clsx, tailwind-merge, usehooks-ts, nanoid + native Wake Lock/PiP/Fullscreen/Notifications | Timezone clock, 12/24h, cn(), IDs, prevent-sleep, PiP |
| Enhancement | detect-gpu, lenis | Device tiering, inertial smooth-scroll |
| Data | @supabase/supabase-js, @supabase/ssr, @tanstack/react-query, idb-keyval + Google GSI | Cloud sync, auth gating, caching, local blobs |

**NOT needed (native):** binaural/noise packages, flip-clock package, wake-lock/PiP/fullscreen wrappers, axios, moment. Pick one WebGL lib and one framework.

---

## 4. Feature Inventory (condensed)

Tabs: **Themes → Clock → Timer → Tasks → Sounds → Playlists → Stats → Sync → Customizations → Notepad**, plus ⚡ Upgrade to Plus, and Account / Extras / Quotes / Support.

| Area | What | Tier |
|---|---|---|
| Themes | 3 slots (Home/Focus/Ambient); sub-panels: Custom BG, Video BG, Theme Library (90+), Gradients & Colors, Ambient Worlds (~60). Ambient omits Gradients. | Browse Free; upload/video/premium Plus |
| Clock | 12/24h + IANA timezone; style presets; flip clock; seconds; dynamic greetings | Mixed |
| Timer | 5 modes: Pomodoro, Countdown, Stopwatch, Animedoro, 52/17. Lengths, auto-start, ETA mode, flip, progress, notification, custom font, session tallies | Core Free; ETA/flip/font Plus |
| Tasks | Add/priority/checkbox/drag-reorder/delete; progress/count/PiP toggles; 3 free rows | Plus (limited free) |
| Sounds | Layered mixer; ~43 sounds + white/pink/brown noise + 5-band binaural; per-sound 0-100 volume. Free 5: Rain, Ocean, Café, Airplane, Exam Hall | 5 Free, 38 Plus |
| Playlists | My Music, Playlist Library, Favorites | Plus |
| Stats | Focus Stats, Recent Productivity, Focus Score, streak counter | Plus |
| Sync | Cross-device cloud sync; Download Synced / Reset | Plus |
| Customizations | Disable animated themes, Clear mode, Prevent sleep, Show Share (all Free); styles/fonts Plus | Mixed |
| Notepad | Scratchpad w/ live word·char count | Plus |
| Account | Register/Sign in/Reset; Google sign-in; onboarding | Free |
| Quotes | All/Motivational/Inspirational/Self Care/Gratitude; show-in-Focus/Home | Free |

---

## 5. Theme System — Taxonomy, Rendering, Copyright-Safe Assets

### Filter taxonomy (per slot)
- **Type:** World · Gradient · Solid Color · Animated
- **Category:** Scenic · Urban · Nature · Interior · Abstract
- **Mode:** Dark · Light
- **Color:** Blue · Green · Pink · Purple · Orange/Yellow · Monochrome
- **Upload categories (uploads only):** Focus · Interior · Lifestyle · Nature · Niche · Weather

### Rendering technique per Type
| Type | Technique | Implementation |
|---|---|---|
| Solid Color | solid_fill | CSS background-color, var-driven |
| Gradient | css_gradient | Pure CSS linear/radial/conic; animated = keyframes or light aurora shader. **Gradients = math = not copyrightable → reproduce exactly, legally** |
| World (photo) | static_kenburns | Full-bleed WebP/AVIF + slow 30-45s Ken-Burns + overlay dim |
| World (living) | looping_video | Seamless 8-15s MP4/WebM, muted autoplay loop, poster + IntersectionObserver |
| Animated | webgl_shader | GLSL fragment shader (aurora/starfield/fog/waves), fallback → static on reduce-motion/low-power. **Procedural = original work you own** |

### Copyright-safe strategy (the legitimate approach)
**Clone the taxonomy/filters/moods/UX** (uncopyrightable systems) but **re-source every asset:**
- **World photos** → Unsplash / Pexels / Pixabay APIs (commercial-free), queried by *mood* to hit the same emotional targets — not the same files.
- **Video loops** → Coverr / Mixkit / Pexels Video / Pixabay Video.
- **Gradients / Solids** → self-generated (100% original).
- **Animated worlds** → procedural WebGL shaders you author.
- **Coverage:** map ~30-40 concept slots (category × mode × colorFamily) → fill each with licensed candidates → reproduces the *breadth* without matching any single image.
- **Guardrails:** no scraping Flocus's `/resources/images/themes/*`; start every asset from a clean-licensed or self-generated base (never edit-launder a copyrighted file); store full provenance (provider, author, license, URL) on every theme record; respect each API's ToS.

### Build sequence
1. Gradients + Solids (exact fidelity, zero risk) → 2. 3-5 WebGL shader worlds → 3. Photo library via APIs + regrade → 4. Video loops + YouTube input → 5. Fallback wiring (Animated→static).

---

## 6. Per-Screen Build Notes

**Shared shell:** full-bleed composite (black base → theme render → overlay dim → grain/vignette → centered content → floating glass dock bottom-center → top promo bar → offcanvas drawers z-1045). Strict center-axis, generous space, `#7432FF` sole accent. Active dock item = filled purple squircle; inactive = flat icons on frosted-glass pill (backdrop-blur).

- **Home (`/`):** promo bar → wordmark → quote → greeting → **giant live clock (~120-160px, focal anchor)** → dock (8 icons). BG: soft diagonal indigo/violet→magenta→coral gradient on WebGL canvas. Minute-tick digit fade, quote/greeting cross-fades, dock hover, toasts.
- **Focus (`/focus`):** wordmark → quote → "What do you want to focus on?" → mode segmented pill (Focus/Short/Long) → 4 carousel dots → **25:00 timer** → transport (Start/reset/PiP) → dock w/ streak. Drawers: Tasks, Sounds (~45 rows), Notepad, Theme picker. Mode-pill slide, Start↔Pause morph, streak pulse.
- **Ambient (`/ambient`):** full-bleed painterly scene → frosted-glass focus timer card → bottom glass dock (7 icons). Stack: black → JPG → WebGL2 particles (fireflies) → lazy video (foliage sway) → UI. Particle drift, JPG→video crossfade, live backdrop-blur.
- **Settings (`/settings`):** right offcanvas (~640-680px, z-1045) over dimmed dashboard. Home/Focus/Ambient theme sections → Custom BG (dropzone + overlay slider) → Video BG → Theme Library (3 filter selects) → Gradients & Colors → Ambient Worlds grid. Badges: PLUS/NEW/animated. Near-black cards, 1px borders.

### Design tokens
- **Type:** display/clock = Hanken Grotesk / Onest (Degular sub); body = Inter. Clock ~120-160px ≫ greeting ~36-40px > quote ~30px > headings ~28-32px > pills ~18-20px > body ~14-15px.
- **Color:** accent `#7432FF` (+`#8B5CFF` hover); Home gradient indigo `#3A2A6B`→`#4B2E8A`, magenta `#C13B8F`/`#D8477E`, coral `#FF6B7A`→`#F98A86`, pink `#FBB8B0`; forest greens `#1E3320`-`#93B36B`; red `~#C0392B`; NEW green `~#2FBF71`; text `#FFF`/muted `rgba(255,255,255,.6-.7)`.
- **Radius:** pills full; dock squircles ~12-14px; cards ~16px; inputs ~8-12px.
- **Glass:** frosted dark + `backdrop-filter: blur(16-24px)` + saturate + 1px inner white border; active items solid purple.

---

## 7. Enhancements — Richer Than Original

**Prime directive: calm.** All motion slow, low-amplitude, killable. Never makes the clock harder to read.

### 7.0 Motion & Performance Contract (guardrail)
- **Kill-switch:** `data-motion="full|reduced"` on `<html>` (mirrors Flocus "Disable animated themes"); reduced kills WebGL, swaps static poster; seeded from `prefers-reduced-motion`.
- **Lazy WebGL:** dynamic import + IntersectionObserver; clock is HTML/SVG, never blocked.
- **DPR clamp** `min(dpr,1.5)`; **visibility pause** (rAF halts when hidden); **FPS governor** (auto-drop tier); **device tiering** via detect-gpu.

### 7.1-7.4 Enhancements
- **Home shader gradient:** domain-warped simplex fbm, breathing light, chromatic bloom behind clock, in-shader grain. Reduced → CSS radial-gradient.
- **Ambient forest depth:** 3-5 parallax layers (2-4px pointer offset) + volumetric god-ray + drifting fog.
- **Particles:** instanced Points (~150-300, tier-scaled) fireflies/dust.
- **Magnetic dock:** icons translate toward cursor (~6px), macOS falloff, glow ring.
- **Staggered reveals:** greeting→clock→dock 40ms; per-char blur-up on digits.
- **Shared-element mode morph:** `layoutId`/View Transitions morphs central clock/card between modes; shader palette cross-dissolve ~800ms. **Signature moment.**
- **Glass refinement:** blur+saturate, specular top-edge, pointer-tracked sheen, palette-tinted shadows.
- **Smooth scroll:** lenis for panels, synced to WebGL clock.
- **Audio-reactive:** native AnalyserNode on Howler ctx, one smoothed low-band → eased uAudio uniform, capped ±8%.

**Priority:** (1) Motion contract → (2) Home shader + grain → (3) Magnetic dock + spring buttons → (4) Glass + Lenis → (5) Mode morph (signature) → (6) Ambient forest depth → (7) Audio-reactive. Each independently shippable + disable-able.

---

## 8. Open Questions Before Building

1. **Framework:** Confirm Next 16 (SSR/auth/PWA) over Vite SPA (truer 1:1)?
2. **WebGL lib:** three+R3F+drei (richer, heavier) vs ogl (~10kb, lean)?
3. **Plus tier:** visual parity only (badges/upsells) or real paywall (billing)?
4. **Auth:** Google + email confirmed — any others (Apple/GitHub/magic-link)?
5. **Assets:** sourcing budget/timeline for ~45 sounds + ~30-40 video loops; binaural/noise 100% Web-Audio-generated (recommended)?
6. **Font sub:** Hanken Grotesk vs Onest/General Sans/Satoshi for display/clock — want a side-by-side?
7. **Analytics:** consolidate to one (PostHog/GA4) or none for MVP?
8. **Notepad:** plain textarea MVP vs TipTap rich editor?
9. **PWA/offline:** in scope for v1?
10. **Theme depth v1:** full ~93-photo + ~60-world, or curated ~30-slot starter?
