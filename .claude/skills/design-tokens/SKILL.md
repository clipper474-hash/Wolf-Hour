---
name: design-tokens
description: Generates a complete design token system (colors, typography, spacing, elevation, border radius) as CSS custom properties, saved to a theme file. Use only when the design-brief skill found no existing design system in the codebase. If the project already has a component library or existing tokens, skip this skill entirely and go straight to brief-to-tasks.
---

# Design Tokens

Generates the visual foundation — a single source of truth for colors, type, spacing, and other primitives — so the frontend-design skill has something consistent to build from.

## Skip condition — check this first

Look at `docs/design-brief.md`, specifically the "Existing Design System Findings" section. If it says a design system or token set already exists, **do not run this skill** — tell the user it's being skipped because tokens already exist, and move to brief-to-tasks.

## Process

1. Read `docs/design-brief.md` for tone, density, and any brand constraints already captured.

2. Generate a full token set:
   - **Color**: primary, secondary, neutral scale (at least 9 steps, e.g. 50–900), semantic colors (success, warning, danger, info), background/surface levels, border colors. Provide both light mode and dark mode values if dark mode was requested in the brief.
   - **Typography**: font family (pick something that matches the tone — e.g. a grotesque sans for dense/enterprise, a friendlier rounded sans for consumer), a type scale (at least 6 sizes), font weights, line heights.
   - **Spacing**: a consistent scale (e.g. 4px base: 4, 8, 12, 16, 24, 32, 48, 64).
   - **Elevation**: shadow levels (e.g. sm/md/lg/xl) appropriate to the tone (flat/minimal for dense enterprise tools, more pronounced for consumer apps).
   - **Border radius**: a small scale (e.g. none, sm, md, lg, full) consistent with the tone.

3. Write these as CSS custom properties to a theme file — default to `src/styles/theme.css` unless the project structure suggests a different convention (check for existing `styles/`, `theme/`, or similar folders first).

```css
:root {
  /* Color */
  --color-primary-500: #...;
  ...
  /* Typography */
  --font-family-base: ...;
  --font-size-sm: ...;
  ...
  /* Spacing */
  --space-1: 4px;
  ...
  /* Elevation */
  --shadow-sm: ...;
  ...
  /* Radius */
  --radius-md: ...;
}

[data-theme="dark"] {
  /* dark mode overrides if applicable */
}
```

4. Briefly show the user the palette/type choices and reasoning tied back to the design brief's tone (e.g. "Used a cooler neutral gray scale since the brief called for a 'calm, dense' enterprise feel"). Don't over-explain — a couple of sentences is enough.

5. Note in your response that this file will be consumed directly by the frontend-design skill later — no need for the user to do anything with it manually.
