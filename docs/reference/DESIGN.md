# Fora — Style Reference (Polaris landing)
> cinematic dusk calm on pure black

**Theme:** dark
**Source:** https://fora.so/ (extracted 2026-07-06). Adora reference archived in `_adora-archive/`.

Fora is a dark, cinematic, restrained SaaS landing aesthetic — the spiritual match for a Flocus-style focus app. A pure-black `#000` canvas carries a soft **dusk-gradient photographic atmosphere** (muted mauve / dusty-rose fading to charcoal) behind the hero and closing sections. Text is a warm near-white (`#fff3f0`, "snow") rather than pure white, giving everything a soft, low-glare warmth. Typography is **Inter / Inter Display at light-to-medium weights** (never heavy/architectural) with **aggressive negative letter-spacing (−0.04em)** that pulls it tight and modern. Interactive elements are **fully-round stadium pills** with translucent fills and `backdrop-filter: blur`, floating over the dark. Cards are dark panels at 16px radius with hairline borders; depth comes from subtle elevation and glass, never heavy shadow. Small **monospace (Fragment Mono) kicker labels** and stadium "chip" section-tags (`Intro`, `Core Features`, `What you get`) add an editorial, product-y rhythm. The whole system reads calm, premium, and quietly confident — atmosphere over decoration.

> **How to use for Polaris:** this is the LANDING PAGE reference — restyle its tokens into the Polaris brand. Keep Fora's dark/calm/glass DNA; swap Fora's warm-dusk hue story for Polaris's own accent (carried over from the Flocus app: purple `#7432FF`) so the landing and the app feel like one product. Fora's dusk-gradient hero doubles as a reusable WebGL gradient theme.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Void Black | `#000000` | `--color-void-black` | Page canvas, base of every section, the dominant surface |
| Snow | `#fff3f0` | `--color-snow` | Primary text on dark, headline color — warm off-white, never pure `#fff` for body |
| Pure White | `#ffffff` | `--color-pure-white` | Secondary headings, high-emphasis text, button text on dark fills |
| Ash | `#5e5e5e` | `--color-ash` | Muted helper copy, captions, metadata, disabled text |
| Panel 24 | `#242424` | `--color-panel-24` | Dark card/panel surface fill (elevated on black) |
| Panel 2A | `#2a2a2a` | `--color-panel-2a` | Slightly lifted panel / hover surface, borders on dark cards |
| Soft Concrete | `#eeeeee` | `--color-soft-concrete` | Light-chip / inverted pill fills (e.g. "Join now" light button) |
| Dusk Charcoal | `#1b2228` | `--color-dusk-charcoal` | Bottom stop of the closing atmospheric gradient (`#000 → #1b2228`) |
| — Accent (Polaris) — | `#7432ff` | `--color-accent` | **Polaris brand accent** (from the Flocus app) — primary CTA fill, active states, focus rings. Replaces Fora's default-link blue. |
| Accent Hover | `#8b5cff` | `--color-accent-hover` | Hover/lighter accent state |

> **Atmosphere hues** (dusk hero gradient, decorative only): warm mauve `#c9a9b8` → dusty rose `#a97f86` → charcoal `#2a2320` → black. Reproduce as a CSS/WebGL gradient, not a copied photo.

## Tokens — Typography

### Inter — Body, UI, and headings — the workhorse. Light-to-medium weights (400–500), NOT heavy. Universal tight tracking (~-0.04em) is the signature move. · `--font-inter`
- **Substitute:** Inter (Google) via `next/font` — exact match, no substitute needed
- **Weights:** 400, 500, 600
- **Sizes:** 12px, 14px, 16px, 18px, 22px, 32px, 36px
- **Line height:** 1.3 (headings ~1.3, body ~1.5)
- **Letter spacing:** -0.04em (headings), -0.02em (body)

### Inter Display — Large display / hero headline optical variant — used for the biggest headings and pricing numerals. · `--font-inter-display`
- **Substitute:** Inter Display / Inter tight
- **Weights:** 400, 500
- **Sizes:** 28px, 36px+
- **Letter spacing:** -0.03em to -0.04em

### Fragment Mono — Monospace kicker/label accent — tiny uppercase eyebrow labels and code-y metadata. Editorial punctuation only. · `--font-fragment-mono`
- **Substitute:** `Geist Mono` or `JetBrains Mono` (free)
- **Weights:** 400
- **Sizes:** 11px, 12px
- **Role:** section kickers, small labels, timestamps

### Type Scale (extracted)

| Role | Size | Weight | Line Height | Letter Spacing | Token |
|------|------|--------|-------------|----------------|-------|
| mono-kicker | 12px | 400 | 1.3 | 0 (mono) | `--text-kicker` |
| caption | 14px | 400 | 1.5 | -0.02em | `--text-caption` |
| body | 16px | 400 | 1.5 | -0.02em | `--text-body` |
| body-lg | 18px | 400 | 1.5 | -0.02em | `--text-body-lg` |
| subheading | 22px | 400–500 | 1.4 | -0.03em | `--text-subheading` |
| heading | 32px | 500 | 1.35 (43.2px) | -0.04em (-1.28px) | `--text-heading` |
| display-sm | 36px | 400 | 1.3 (46.8px) | -0.04em (-1.44px) | `--text-display-sm` |

> Note: Fora's hero H1 is only 36px/400 — deliberately understated. Polaris can scale the hero larger (56–72px) for more presence while keeping the light weight + tight tracking.

## Tokens — Spacing & Shapes

**Base unit:** 4px · **Density:** comfortable · **Section padding:** `0 24px` horizontal gutter

### Border Radius (extracted)

| Element | Value | Token |
|---------|-------|-------|
| pills / CTA buttons | full (768–880px → use `9999px`) | `--radius-pill` |
| section chips / tags | full (215–393px → `9999px`) | `--radius-chip` |
| cards / panels | 16px | `--radius-card` |
| media / product frames | 15–24px | `--radius-media` |
| small controls | 8–10px | `--radius-control` |
| micro (inputs, insets) | 2–4px | `--radius-xs` |

### Layout
- **Horizontal gutter:** 24px
- **Content:** centered column, generous vertical section rhythm
- **8 sections:** nav → hero (dusk gradient) → feature intro → product showcases → pricing → FAQ → blog/updates → closing CTA (gradient `#000 → #1b2228`) → footer

## Components

### Floating Nav
Transparent/glass top nav on black. Left logo lockup, center text links in `rgba(255,255,255,0.8)` at 12–14px Inter, right-side stadium **Get started** pill (`backdrop-filter: blur(5px)`, full radius, translucent fill). Never a solid bar — floats over the atmosphere.

### Primary CTA Pill
Fully-round stadium (`9999px`), Polaris accent `#7432ff` fill, white text, ~14–16px Inter 500, padding `~12px 36px`. The single saturated action per view. (Fora uses translucent white; Polaris swaps in the purple accent to tie to the app.)

### Ghost / Glass Pill
Transparent fill, 1px `rgba(255,255,255,0.2)` border, snow text, `backdrop-filter: blur(5px)`, full radius. Secondary actions ("Get started free", nav CTA).

### Section Chip (kicker tag)
Small stadium pill (`9999px`, padding `4px 16px`), light or translucent fill, label at 12–14px. Sits above each section heading as an editorial tag (`Intro`, `Core Features`, `What you get`, `Your front door`).

### Dark Product Card
`#242424` panel, 16px radius, 1px `#2a2a2a` hairline border, holds a product screenshot at 15px radius. Roomy padding, image-led. Depth from border + faint elevation, no heavy shadow.

### Mono Kicker Label
Tiny `Fragment Mono` 11–12px uppercase label in `#5e5e5e` / snow — eyebrow above headings, metadata under cards.

### Atmospheric Hero
Full-bleed dusk gradient (mauve→rose→charcoal→black) behind a centered text stack. Decorative only, never behind reading blocks. In Polaris this is a live CSS/WebGL gradient (reuses the app's theme engine).

## Do's and Don'ts

### Do
- Use warm snow `#fff3f0` for body text on black, not pure `#ffffff` — the warmth is the whole mood
- Apply tight −0.04em tracking on headings, −0.02em on body — Fora's unifying typographic move
- Keep buttons fully-round stadium pills; keep cards at 16px — the pill/card radius split is the system
- Use `backdrop-filter: blur` glass on floating pills over the atmosphere
- Ration one saturated accent (`#7432ff`) per viewport for the primary CTA and active states
- Use tiny mono kickers + stadium section chips as editorial punctuation above headings
- Let the dusk gradient breathe — atmosphere behind hero + closing only

### Don't
- Do not use heavy/bold display weights — Fora is light (400–500), understated, not architectural
- Do not put pure `#000` text on things or use pure white for body — warm snow instead
- Do not extend the atmospheric gradient behind dense reading content
- Do not add heavy multi-stop drop shadows — depth is border + glass + subtle elevation
- Do not mix sharp corners with the pill system — round controls, 16px cards, nothing boxy
- Do not carry over Fora's default-link blue (`#0000ee`) — that's unstyled anchor default, not brand

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Void Canvas | `#000000` | Page background, base of all sections |
| 1 | Panel | `#242424` | Cards, product frames, elevated panels |
| 2 | Lifted Panel | `#2a2a2a` | Hover surfaces, card borders |
| 3 | Atmosphere | dusk gradient | Decorative hero/closing wash (mauve→rose→charcoal→black) |

## Imagery
Dark product-screenshot crops inside 15–16px rounded frames on dark panels — the UI is the hero. A single photographic **dusk-gradient atmosphere** (warm mauve/rose → charcoal) bleeds behind the hero and the closing CTA only. No lifestyle photography, no bright stock, no confetti. Reproduce the gradient procedurally (CSS/WebGL) rather than copying Fora's photo. Icons: thin-stroke line icons in snow/ash.

## Quick Color Reference
- text: `#fff3f0` (snow body/headline), `#ffffff` (emphasis), `#5e5e5e` (muted)
- background: `#000000` (canvas), `#242424` / `#2a2a2a` (panels)
- accent: `#7432ff` (Polaris action) / `#8b5cff` (hover)
- atmosphere: mauve `#c9a9b8` → rose `#a97f86` → charcoal `#2a2320` → black
- closing gradient: `#000000 → #1b2228`

## Similar Brands
- **Linear** — same tight tracking, single accent on near-monochrome, glass/pill controls
- **Vercel / Resend** — same pure-black canvas, warm-white text, restrained Inter type
- **Raycast** — same dark panels, 16px card radius, depth from layering not shadow
- **Arc** — single vivid accent against black, atmosphere as the only "color"
