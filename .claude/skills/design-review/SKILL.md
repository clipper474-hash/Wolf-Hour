---
name: design-review
description: Reviews the generated frontend for design quality — sparse layouts, incorrect ordering/hierarchy, missing dark mode handling, accessibility gaps — and proposes or applies fixes. Use this after the frontend-design-build skill has produced pages, or whenever the user pastes in screenshots and asks for design feedback. If a Playwright MCP server is connected, use it to autonomously screenshot every page instead of asking the user for manual screenshots.
---

# Design Review

Closes the loop: reviews what was actually built against the standards set earlier, and either flags or fixes issues.

## Step 1: Get screenshots

**If a Playwright MCP connector is available:**
- Launch a headless browser session against the running app.
- Navigate to every page listed in `docs/information-architecture.md`.
- Take a full-page screenshot of each.
- If dark mode was in scope (per design-brief.md), also screenshot each page in dark mode.
- If key interactive states are easy to trigger (e.g. an empty list, an open dialog), capture those too.

**If no Playwright MCP is available:**
- Ask the user to paste in screenshots of the key pages, ideally including at least one list view, one detail/form view, and any dialogs or empty states.
- Don't block on getting every single page — review what's provided and note which pages weren't checked.

## Step 2: Review against a checklist

For each screenshot, check:

- **Layout density**: Does it match the tone set in design-brief.md? Flag sparse layouts (too much empty space, weak visual hierarchy) or overcrowded ones inconsistent with the intended feel.
- **Visual hierarchy**: Is the primary action/most important info the most visually prominent thing on the page? Check heading sizes, button prominence, ordering of elements (e.g. charts/tables in a sensible order, not arbitrary).
- **Consistency**: Do spacing, colors, and component styles match the theme tokens? Do similar elements (buttons, cards, table headers) look the same across pages?
- **States**: Are empty states, loading states, and error states actually implemented and do they look intentional (not just blank/broken)?
- **Dark mode**: If in scope, does it actually work, or does it just invert without checking contrast?
- **Accessibility**: Color contrast on text, visible focus states on interactive elements, sensible heading structure, alt text on meaningful images, adequate touch target sizes.
- **Responsiveness**: If breakpoints were in scope per tasks.md, check narrow-viewport screenshots for broken layouts or overflow.

## Step 3: Report findings

Group findings by severity:

```markdown
## Design Review — [date]

### Must Fix
- [Page]: [issue] — [why it matters]

### Should Fix
- [Page]: [issue]

### Nice to Have
- [Page]: [issue]
```

## Step 4: Propose or apply fixes

For each "Must Fix" and "Should Fix" item, propose a specific code change (not just "improve the spacing" — say what should change and to what). If the user gives the go-ahead, apply the fixes directly and re-screenshot the affected pages to confirm the fix worked (if Playwright is available).

## Notes

- This skill can be re-run after fixes are applied — treat it as a loop, not a one-time gate.
- If recurring issues show up across many pages (e.g. every empty state is missing), consider whether it's faster to fix the shared component once rather than page-by-page.
