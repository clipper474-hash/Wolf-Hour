---
name: frontend-design-build
description: Builds the actual frontend application — components, pages, layouts — using the design brief, information architecture, design tokens, and task list produced by earlier skills. Use this once docs/tasks.md exists and the user is ready to actually generate code. This is the implementation phase, not the planning phase.
---

# Frontend Design (Build Phase)

This is where documentation becomes a working application. Every decision made in the previous steps should be visible in the code you write — this is not a place to improvise new direction.

## Prerequisite check

Requires `docs/grill-summary.md`, `docs/design-brief.md`, `docs/information-architecture.md`, and `docs/tasks.md`. If design-tokens ran, also requires the theme file. If any are missing, tell the user and stop — don't start building from partial context.

## Process

1. **Read all docs before writing any code.** Hold the whole picture — purpose, tone, structure, and task order — before touching the first file.

2. **Work through `docs/tasks.md` in order, phase by phase.** Don't skip ahead to a page in "Core UI" if a "Foundation" task it depends on isn't done. Check off tasks in the file as you complete them.

3. **Every piece of UI should trace back to a decision already made:**
   - Colors/spacing/type → from the theme file or existing design system
   - Page structure/navigation → from information-architecture.md
   - Tone/density (e.g. how much whitespace, how prominent buttons are) → from design-brief.md
   - What the feature actually needs to do → from grill-summary.md

   If you find yourself inventing something not covered by any doc, make a reasonable decision, but note it out loud so the user can correct it.

4. **Build states, not just happy paths.** Every list view needs an empty state. Every async action needs a loading state. Every form needs validation/error states. These aren't optional polish — they're part of "Core UI" or "Secondary UI" per the task list, so don't skip them to move faster.

5. **Reuse before creating.** Before writing a new component, check whether something similar already exists in the codebase (from the design-brief's codebase investigation) or was already built earlier in this same session for a different page. Consistency matters more than novelty.

6. **Prefer small, composable components** over large monolithic page files — this makes the design-review skill's job easier later, and makes future edits safer.

7. When a phase is complete, briefly summarize what was built and what's next, rather than silently continuing through the whole task list — give the user natural checkpoints to redirect if something's off.

## When this skill is done

Once all tasks in `docs/tasks.md` are checked off, tell the user the build is complete and suggest running the design-review skill next — ideally with a Playwright MCP connection if one is available, so screenshots can be reviewed automatically instead of manually.
