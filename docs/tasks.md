# Tasks — Polaris

Sequenced, dependency-aware build plan. Derived from grill-summary, design-brief, information-architecture, design-tokens. Checkboxes are updated as work completes. **No task starts until the user says "build."**

> ⚠️ Per `AGENTS.md`: this is Next 16 with breaking changes — read `node_modules/next/dist/docs/` before writing Next code.

---

## Phase 0: Design system wiring (foundation)
- [ ] Wire `docs/design-tokens.css` into `src/app/globals.css` (Tailwind v4 `@theme` + `:root` runtime vars + `.glass` primitive)
- [ ] Install remaining picker fonts (General Sans, Satoshi via Fontshare; Space Grotesk via Google) + load all via `next/font` / `@fontsource`
- [ ] Add `/public/noise.png` (procedural grain) for glass + background dither
- [ ] `cn()` util + init shadcn/ui (`components.json`), add base primitives (button, slider, switch, dialog, tabs, select, popover, tooltip)
- [ ] Global providers: theme/motion provider (`data-motion` kill-switch, detect-gpu tiering), React Query, Supabase client
- [ ] Build the **motion system**: shared spring config, `<Magnetic>`, `<Reveal>` (stagger), `<Pressable>` (press-scale), `useReducedMotion` wiring

## Phase 1: App shell & navigation
- [ ] Route scaffold: `/app`, `/app/focus`, `/app/ambient`; `?panel=` overlay handling; landing at `/`; `/login` `/signup` `/reset`
- [ ] **Background compositor** — layered stack (base → theme render → overlay dim → grain/vignette → content), one component driving all modes
- [ ] **Floating glass dock** — mode switch + tool triggers, magnetic + press feedback, active purple squircle, context-aware slots
- [ ] **Offcanvas drawer** — shared right-anchored liquid-glass drawer, spring slide-in + backdrop, hosts all panels
- [ ] **Shared-element mode morph** — clock/card `layoutId` morph + background palette cross-dissolve between Home/Focus/Ambient (signature moment)
- [ ] Command palette (`cmdk`, ⌘K) + keyboard shortcuts; sonner toasts

## Phase 2: Data models & state
- [ ] TypeScript types: Theme, Sound, TimerConfig, Task, Note, Settings, User
- [ ] Zustand stores (+ immer + persist): settings, timer, sound-mixer, tasks, notes, theme-slots
- [ ] `localStorage` persistence + `idb-keyval` for blobs (custom bg); Supabase sync layer stub

## Phase 3: Theme engine (v1 — curated ~30 starter set)
- [ ] `themes.json` schema + data model (type, category, mode, colorFamily, render, overlay, provenance)
- [ ] Renderers: `css_gradient`, `solid_fill`, `static_kenburns`, `looping_video`, **`webgl_shader`** (R3F) + animated→static fallback
- [ ] Home **shader gradient** (domain-warped fbm aurora, breathing, grain) — the first live background
- [ ] 3–5 procedural **shader worlds** (starfield, fog, waves, mesh, aurora)
- [ ] Gradients & solids set (exact-fidelity, zero-risk) covering `abstract`/color families
- [ ] Small royalty-free photo/video set (Unsplash/Pexels/Coverr) w/ provenance to fill `World` type
- [ ] Theme picker UI (per slot: filters Type·Category·Mode·Color, live preview) + 3-slot assignment (Home/Focus/Ambient)

## Phase 4: Core screens
- [ ] **Home** — giant live clock (`@number-flow`, tabular), time-aware greeting, rotating quote, promo bar
- [ ] **Clock & Font Style picker** — clock styles (Standard/Flip/Minimal/Mono/Segment/Serif/Handwritten/Outline) × 8 fonts; flip animation (GSAP + CSS 3D)
- [ ] **Focus** — timer (5 modes: Pomodoro/Countdown/Stopwatch/Animedoro/52-17), mode segmented control, transport (start/pause/reset), presets, streak, PiP
- [ ] **Ambient** — full-bleed scene + minimal frosted focus card; particle/parallax depth
- [ ] Quotes system (categories, show-in-Home/Focus)

## Phase 5: Audio
- [ ] Howler mixer — layered simultaneous sounds, per-sound volume, loops, master gain
- [ ] Web Audio generators — binaural beats (2 oscillators, L/R detune) + white/pink/brown noise (AudioWorklet)
- [ ] Sounds drawer UI (curated free set to start; categories; per-sound sliders); MediaSession lock-screen controls
- [ ] Optional ASMR UI sound design (soft ticks/thunk, toggleable, off by default)

## Phase 6: Secondary UI (drawers & settings)
- [ ] Tasks drawer (add/priority/checkbox/reorder/delete, progress + count)
- [ ] Notepad drawer (textarea + word·char count)
- [ ] Settings drawer — tabs: Themes · Clock · Timer · Tasks · Sounds · Quotes · Extras · Account
- [ ] Extras: disable-animated-themes, clear mode, prevent-sleep (Wake Lock), share button, streak toggle
- [ ] Empty/loading/error states for all lists and async ops

## Phase 7: Auth & persistence
- [ ] Supabase schema + RLS (settings/tasks/notes/stats per user)
- [ ] Auth screens (email + Google), `@supabase/ssr` middleware sessions
- [ ] Local-first → cloud sync on sign-in; sync status + toasts
- [ ] Minimal first-run onboarding (name + goals → seed settings), skippable

## Phase 8: Landing page (Fora-style)
- [ ] Landing shell + floating nav pill + dusk atmosphere hero
- [ ] Feature sections (themes, soundscapes, focus modes, ambient) + live app mini-preview
- [ ] Pricing placeholder (no paywall v1), FAQ, closing CTA + footer
- [ ] Logged-out → landing; authed → redirect `/app`

## Phase 9: Responsive & polish (ASMR-grade / Apple-caliber pass)
- [ ] Mobile/tablet breakpoints for all screens + dock/drawers; touch targets
- [ ] Motion QA: 60fps audit, GPU-only props, interruptible springs, seamless loops, magnetic/press/parallax tuning
- [ ] Liquid-glass QA: vibrancy, specular edge, legibility contrast, reduced-motion fallback
- [ ] Performance: lazy WebGL, DPR clamp, visibility pause, FPS governor, device tiering
- [ ] Accessibility: focus states, aria, contrast, keyboard nav, `prefers-reduced-motion`
- [ ] Final design-review pass (design-review skill + Playwright screenshots) vs Flocus parity + richness goals

## Deferred / keep-in-mind (not now, but planned)
- [x] **Spotify account connect** — done 2026-07-10. `lib/spotify.ts` (Auth Code + PKCE, no secret) + `/spotify/callback` page + connect/disconnect in the mixer. Gated on `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`; button explains setup when unset. Next step (deferred): Web Playback SDK to actually stream inside the app.
- [x] **Fullscreen mode** — done 2026-07-10. Fullscreen API toggle in the Sounds mixer header (Maximize2/Minimize2, tracks `fullscreenchange`).

## iOS liquid-glass pointer (done 2026-07-10)
- `components/cursor/LiquidCursor.tsx` — glass lens spring-follows the cursor (rAF 0.22 lerp), `backdrop-filter` blur/brightness/saturate + specular rim, grows over interactive targets, press-scale on pointerdown. `(pointer: fine)` only; hidden on touch + reduced-motion (native cursor returns). CSS `.liquid-cursor`/`__dot` in globals.css. Mounted once in `layout.tsx` inside ThemeProvider.

## Sounds mixer (done 2026-07-10)
- `lib/sounds.ts` — 20-sound catalog across 5 categories. **17 are synthesised live** in Web Audio (original, seamless, zero-asset, legally clean) → mixer is fully playable with no files:
  - Nature: Rain, Ocean, Wind, Stream (synth) · Thunder, Forest, Birds, Night (file drop-in)
  - Places: Fireplace, Café, Keyboard (synth) · Train (file)
  - Instrumental: Warm Pad, Deep Drone, Chimes, Dream Piano (synth)
  - Lo-Fi: Vinyl, Tape Hiss, Lo-Fi Keys (synth)
  - Noise: White, Pink, Brown (synth)
- `lib/audio-engine.ts` — imperative singleton. Synth voices = filtered noise buffers + biquads + LFOs; schedulers for fireplace crackle, vinyl pops, keyboard typing, and tonal notes (chimes/piano/lo-fi keys). File sounds via Howler (420ms fades); 404 → tile greys out. `unlockAudio()` on first gesture. Dev-only debug hooks `window.__polarisCtx` / `__polarisSynth`.
- `lib/sound-store.ts` — zustand+persist (`polaris-sounds`): master, per-channel {volume,active}, spotify {connected,displayName}, stopAll. Headless `SoundEngine.tsx` (mounted in Dock) reconciles store→engine so audio persists while the panel is closed.
- `components/sounds/SoundsMixer.tsx` — frosted glass popover (rgba(15,13,20,0.74) + 20px blur for legibility over bright scenes): Spotify connect row, master slider, category tiles with a GPU-light `VolumeSlider` (scaleX fill, transform thumb — no motion-spring loops → no lag), Fullscreen/Stop-all/Close.
- Verified via Playwright analyser taps: all 17 synth sounds produce real signal (peak RMS 0.01–0.19). File sounds grey out gracefully.

## Aspirant Mode — study "dimension" (v2 done 2026-07-10)
- Its own full-bleed liquid-glass world with **its own dock where every feature is a separate icon**: Back · **Timer · Goals · Calendar · Statistics** · Sounds · Scenes. Panel state in `ui-store.aspirantPanel`. Entered via GraduationCap in the normal dock.
- `lib/aspirant-store.ts` (persist `polaris-aspirant`): exam{name,date}; subjects[{name,color,totalSeconds,goals,done}]; **sessions[]** (per study block); **running{subjectId,startedAt}** (survives reload); studiedDays[]. `formatHMS`/`formatShort` helpers.
- Panels (`components/aspirant/`):
  - **Timer** — `ExamCountdown` (NumberFlow days-to-go) + `SubjectTimers`: per-subject **stopwatch** (YPT-style), live HH:MM:SS ticking, start/pause (one active at a time, auto-commits), grand total. Committing a session auto-marks the day studied.
  - **Goals** — `SubjectGoals`: per-subject daily/weekly/monthly targets + check-off.
  - **Calendar** — `StudyCalendar`: iOS month grid, tap-to-mark, 🔥 streak.
  - **Statistics** — `Analytics`: Today/Week/Month/All tabs, Total + Daily-average, **subject-ratio SVG donut** + legend (time·%), **month heatmap** (intensity by daily seconds). Modeled on YPT screenshots in `gift/example images/`.
  - `MotivationBanner` (rotating original driven/confidence quotes — no copyright), `lib/aspirant-quotes.ts`, `lib/date-utils.ts`.
- Verified via Playwright: entered mode, timed subject 3s → subject.totalSeconds=3 + 1 session, Statistics shows Total 0:00:03, donut Costing 100%, heatmap, per-feature dock switches panels. HTTP 200, typecheck clean.
- TODO later: notifications, richer viz, subject-linked calendar days, Settings entry, deeper Aspirant theming (separate clock design).

## Sounds — now 21/24 synthesised (2026-07-10)
- Added synth for the last recording-dependent set so all Nature works: **Thunder** (rain bed + scheduled low rumbles), **Forest** (wind bed + birdsong), **Birds** (pitched chirp scheduler), **Night** (low pad + trilled cricket chorus). Only Train remains file-drop-in. All verified audible via analyser taps.

### Sounds — pending (blocked on user input)
- [ ] **Spotify streaming** — PKCE connect is built but inert until `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is set (+ redirect URI registered). Needs the user's Spotify Developer app Client ID. Then add Web Playback SDK to actually play.
- [ ] **"Playlists" small feature** — a compact entry in the mixer opening two folders: **Hindi Lo-Fi** + **English Lo-Fi** instrumental tracks. MUST stay legal — no ripping Spotify audio. Legal paths: (a) local `public/playlists/{hindi,english}/` filled with user-owned tracks; (b) stream curated Spotify playlists via the connected account. Awaiting user's choice + assets/credentials.
- [ ] **Aspirant Mode** — special Settings feature, spec to be discussed later (placeholder for now).

## Build progress notes
- Home background: pivoted from a procedural WebGL aurora shader (rendered too dark / ScreenQuad not painting reliably) to a **cinematic video background** ("Golden Hour"), applied globally first per the phased plan. Shader code retained in `src/components/background/AuroraBackground.tsx` for later Gradient/Animated theme types. Scene set seeded in `src/lib/scenes.ts` (Golden Hour, Still Water, Deep Woods, Quiet Dawn).
- Seamless loop: tried a **boomerang** (forward+reverse) bake — rejected: the reverse motion was visibly obvious. Final approach = **forward-only originals, self-hosted** in `public/scenes/` + a **dual-video eased crossfade** (`SceneLayer.tsx`, FADE=1.2s smoothstep, both native-loop, half-offset). Smooth dissolve, no reverse.
- Video optimization: source clips varied 11–19 Mbps (heavy ones stuttered when 2 played for the crossfade). Re-encoded all 4 to CRF23 / maxrate 9M / 1080p24 → 3.8–8.5 Mbps, uniform. Total /public/scenes now ~33MB. Poster thumbnails in `public/scenes/posters/`.
- Scene switcher (`SceneSwitcher.tsx` + `store.ts` zustand+persist): glass popover anchored above the Scenes dock icon, poster chips, auto-closes on pick, cross-dissolves the background (`VideoBackground.tsx` manager, SWITCH_MS=1600 eased). Dock uses a shared `layoutId` sliding indicator (buttery).
- Final scene set (5): Misty Torii (default), Lake Cabin, Lofi Study, Golden Hour, Still Water. User-supplied 720p clips (`Polaris/vids/`) upscaled to 1080p (lanczos+unsharp), AI watermark removed via feathered radial-alpha gaussian blur (no crop/zoom), uniform CRF23/9M encode. ~27MB total in `public/scenes/`. NOTE: revisit hosting (git-lfs/CDN) before production/commit.

## Phase 10 (parallel/after v1): Expansion
- [ ] Full theme library (~93 photos + ~60 worlds) sourced + provenance
- [ ] Full ~45-sound library + custom playlists (Spotify/YouTube)
- [ ] Focus Stats / Focus Score dashboard; Cloud Sync polish
- [ ] PWA (installable + offline theme precache); TipTap notepad; task ETAs/tags/emoji
- [ ] Monetization/paywall (if decided)

---

### Suggested first build slice (when you say "build")
**Phase 0 + Phase 1 shell + Phase 3 Home shader gradient + Phase 4 Home clock** → a live, animated, liquid-glass Home screen you can *see and feel* end-to-end. Everything else builds outward from that vertical slice.

## Gift assets + component library (received 2026-07-09)
- `gift/` contains: iOS-26 liquid-glass (SVG displacement refraction — upgrade path for `.glass`), plain liquid-glass, Skiper components (skiper37 = NumberFlow clock digits → clock-style variant seed; +theme toggle, typography reveal, animated icons).
- Installed MagicUI: video-text, shine-border, aurora-text, bento-grid (`src/components/ui/`). Use aurora-text sparingly (color-harmony rule).
- React Bits components to integrate (save in `src/components/reactbits/`):
  - **FlowingMenu** (gsap) — marquee hover menu → candidate for Settings/nav sections.
  - **ElasticSlider** (motion) — springy slider → USE for sound-mixer volume + settings sliders.
  - **Lightfall** / **SideRays** (ogl) — WebGL light FX → optional ambient overlays (respect motion kill-switch + color harmony).
  - **TargetCursor** (gsap) — custom cursor; user prefers a true iOS-style pointer first, this is the fallback.
  - **FallingText** (matter-js) — physics text; save for later, use where a playful reveal fits (NOT core calm screens).

## Theme system
- next-themes wired (`theme-provider.tsx`), dark default, light available. Immersive body stays `--color-void` in all themes; shadcn semantic tokens flip on components. `suppressHydrationWarning` on <html>.

## Clock & Font Style picker (done 2026-07-09)
- 9 presets (`lib/clock-styles.ts`): Standard(rolling), Flip(split-flap), Minimal(Onest), Mono(Geist Mono), Serif(Lora), Script(Caveat), Condensed(Archivo), Space(Space Grotesk), Outline(stroked). Fonts via next/font.
- Render modes: rolling (NumberFlow), flip (FlipDigit split-flap CSS, motion-kill-switch aware), plain.
- Store: `useClockStore` (persist) — presetId + hour12 + showSeconds.
- Picker (`ClockStylePicker.tsx`): glass popover, 3-col live-preview grid + 12/24h + seconds segmented toggles. Opened by clicking the clock. Rendered at page ROOT (in Dock) — NOT inside HeroContent, because a position:fixed child of a transformed ancestor mis-positions. Sits near dock so clock stays visible.
