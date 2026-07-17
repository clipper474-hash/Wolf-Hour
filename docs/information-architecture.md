# Information Architecture — Polaris

## Navigation Pattern
**Floating glass dock (primary) + offcanvas drawers (secondary) + minimal top chrome.** No sidebar, no full-width header bar — that would break the full-bleed immersive canvas. This mirrors Flocus and suits the "one focal element per screen" principle.

- **App shell:** every app route renders the same full-bleed background stack (theme render → overlay → content → dock) so switching modes never reflows layout — only the center content + background morph (the signature Apple-caliber shared-element transition).
- **Primary nav = floating dock** (bottom-center, liquid glass): switches the three modes (Home / Focus / Ambient) + opens tool drawers (Tasks, Sounds, Notepad, Themes) + Settings. Active mode = solid purple squircle; others = flat glass icons.
- **Secondary nav = offcanvas drawers** (right-anchored, liquid glass, slide-in with spring): Settings, Tasks, Sounds mixer, Notepad, Theme picker, Quotes. Opened from the dock; dismiss via backdrop or close.
- **Landing page** is a separate marketing surface (Fora-style), NOT part of the app shell — standard scrolling page with its own top nav pill.
- **Command palette (cmdk)** — global quick-switch (⌘K) for modes, themes, sounds, settings sections. (Enhancement; Apple-Spotlight-like.)

## Page Map

### Marketing (public)
- **/** (when logged-out / marketing) — **Landing page** (Fora-style): hero + atmosphere, feature sections, soundscape/theme preview, pricing (placeholder, no paywall v1), FAQ, CTA → launches app. *Route strategy below.*
- **/login**, **/signup**, **/reset** — auth screens (email + Google via Supabase); glass cards over atmosphere.

### App (the dashboard — full-bleed shell)
- **/app** (Home) — live clock + time-aware greeting + rotating quote over the active Home theme. Default landing after auth/onboarding.
- **/app/focus** — Focus mode: timer (5 modes) + transport + streak, over the Focus theme.
- **/app/ambient** — Ambient mode: full-bleed scene + minimal frosted focus card, over the Ambient theme.
- **Drawers (not routes — overlay state, deep-linkable via `?panel=`):**
  - `?panel=settings` — Settings (tabs: Themes · Clock · Timer · Tasks · Sounds · Quotes · Extras · Account)
  - `?panel=tasks` — Tasks drawer
  - `?panel=sounds` — Soundscape mixer
  - `?panel=notepad` — Notepad
  - `?panel=themes` — Theme picker (per active slot)

> **Route strategy:** `/` serves the **landing** for logged-out visitors and can redirect authed users to `/app` (or a "launch app" CTA). App modes are real routes (`/app`, `/app/focus`, `/app/ambient`) so they're deep-linkable and the shared-element morph animates between them; drawers are overlay state via query param so they layer over any mode without a full navigation.

## Content Hierarchy per Page

### Landing (/)
- **Above fold:** floating nav pill (logo · About/Features/Pricing · Get started), hero headline + subhead + primary CTA over dusk atmosphere, live mini-preview of the app.
- **Secondary:** feature sections (themes, soundscapes, focus modes, ambient), social proof, pricing placeholder, FAQ.
- **Footer:** links, closing CTA over `#000→#1b2228` gradient.

### Home (/app)
- **Focal:** giant live clock (center).
- **Above:** dismissible promo/announcement bar (top); wordmark; rotating quote; time-aware greeting.
- **Persistent:** floating dock (bottom).
- **Overflow:** all tools/settings via dock → drawers.

### Focus (/app/focus)
- **Focal:** large timer + mode segmented control (Focus / Short / Long) + transport (Start/pause · reset · PiP).
- **Above:** wordmark; focus-quote; "What do you want to focus on?" prompt; timer-preset dots.
- **Persistent:** dock with streak counter.
- **Drawers:** Tasks, Sounds, Notepad, Themes.

### Ambient (/app/ambient)
- **Focal:** the scene itself (full-bleed living background).
- **Overlay:** minimal frosted focus card (label + time + Start); dock.
- **Intentionally sparse** — the art is the content.

### Settings drawer
- **Tabs (order):** Themes (3 slots: Home/Focus/Ambient) · Clock (format, timezone, seconds, **Clock & Font Style picker**, greetings) · Timer (modes, lengths, tallies, toggles) · Tasks · Sounds · Quotes · Extras (disable-animation, clear mode, prevent-sleep, share, streak) · Account (sign in/out, sync).
- **Per Theme slot:** Custom Background · Video Background · Theme Library (filters: Type·Category·Mode·Color) · Gradients & Colors · Ambient Worlds. Live preview on select.

## Cross-Page Patterns
- **Background stack** (identical every app route): black base → theme render (CSS gradient / static Ken-Burns / looping video / WebGL shader) → overlay dim → grain/vignette → content → dock. Only the render + center content change between modes.
- **Liquid-glass surface** — dock, drawers, cards, chips, buttons all share the one `.glass` primitive (frost + specular edge + faint noise + Apple-vibrancy).
- **Floating dock** — persistent across all app modes; contents context-aware (e.g. streak shows in Focus).
- **Offcanvas drawer** — one shared right-anchored glass drawer component; spring slide-in + backdrop dim; hosts all panels.
- **Motion governor** — every animated surface reads the global `data-motion` tier; reduced → static fallback.
- **Command palette (⌘K)** + keyboard shortcuts — consistent across app.
- **Toasts (sonner)** — bottom, glass, for sync/save/theme-applied feedback.
- **Onboarding** — first-run overlay (name, goals) writing initial settings; skippable.

## Decisions (confirmed — "as you prefer for the best")
1. ✅ **`/` routing:** logged-out visitors see the landing; authenticated users are redirected to `/app`. App modes live under `/app/*`.
2. ✅ **Drawers = `?panel=` overlays** (deep-linkable, layer over any mode) — not full routes. Enables layering + the shared-element morph.
3. ✅ **Onboarding:** minimal first-run flow in v1 (name + goals → seeds initial settings), skippable.
