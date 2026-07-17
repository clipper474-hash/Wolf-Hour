---
name: design-brief
description: Generates a design brief document after requirements gathering (grill-me) is complete. Use this once docs/grill-summary.md exists and the user is ready to move from "what are we building" to "what should it look and feel like". Investigates the existing codebase for design systems, components, and patterns before asking design-specific questions. Do not use this before a grill summary exists — run grill-me first if it doesn't.
---

# Design Brief

This skill turns a confirmed grill summary into a design brief: a document that captures not just what the product does, but how it should feel and look, grounded in what already exists in the codebase.

## Prerequisite check

Before starting, look for `docs/grill-summary.md`. If it doesn't exist, tell the user you need to run the grill-me skill first and stop.

## Process

### 1. Investigate the codebase first

Before asking the user anything about design, actually look:
- Is there an existing design system or component library (check `package.json` for things like Tailwind, MUI, Chakra, shadcn/ui, a custom `/components/ui` folder)?
- Are there existing pages/screens whose visual style should be matched?
- Is there an existing color palette, font choice, or spacing scale anywhere (CSS files, theme config, tailwind.config)?
- Note findings — this determines whether the design-tokens skill will be needed later (skip it if a real design system already exists).

### 2. Ask design-specific questions

These are different from the grill-me questions — grill-me was about function, this is about feel. Ask things like:

- **Emotional tone**: Should this feel serious/enterprise, playful, minimal, dense/information-rich, spacious? Give 2-4 concrete options rather than an open question.
- **Visual inspiration**: Any apps/sites they already like the look of? If they don't have one, proactively suggest 2-3 references suited to the domain (e.g. for internal tools: Linear, Google Admin Console, Notion; for consumer apps: Stripe, Airbnb; for data-heavy dashboards: Vercel, Retool).
- **Density**: Information-dense (lots on screen, power-user tool) or spacious (fewer things, more breathing room)?
- **Brand constraints**: Any existing brand colors, logo, or style guide that must be respected?
- **Dark mode**: Needed now, later, or not at all?

### 3. Write the brief

Save to `docs/design-brief.md`:

```markdown
# Design Brief — [Project Name]
Date: [today's date]

## Existing Design System Findings
[What was found in the codebase: component libraries, existing tokens, patterns to reuse or respect. State explicitly whether a design-tokens step is needed.]

## Emotional Tone & Feel
[Description, e.g. "Dense but calm — power-user tool, not consumer-flashy"]

## Visual Inspiration
- [Reference 1]: [what to borrow from it]
- [Reference 2]: [what to borrow from it]

## Density & Layout Philosophy
[...]

## Brand Constraints
[...]

## Dark Mode
[Now / Later / No]

## Design Principles for This Project
[3-5 short, concrete principles that should guide every screen, e.g. "Every table has a filter and an empty state", "Primary actions are always top-right"]
```

Confirm with the user before moving to the information-architecture skill.
