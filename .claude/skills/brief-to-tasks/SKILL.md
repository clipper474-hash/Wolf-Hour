---
name: brief-to-tasks
description: Breaks the design brief and information architecture down into a sequenced, dependency-aware task list tracked in a markdown file. Use this after docs/design-brief.md and docs/information-architecture.md (and docs/theme.css if applicable) exist, right before any frontend code gets written. This is the step that turns documentation into an executable plan.
---

# Brief to Tasks

Converts everything decided so far into a concrete, ordered task list that the frontend-design skill will execute against.

## Prerequisite check

Requires `docs/grill-summary.md`, `docs/design-brief.md`, and `docs/information-architecture.md`. If design-tokens ran, also check for the theme file. If any required doc is missing, tell the user and stop.

## Process

1. **Read all existing docs fully.**

2. **Identify dependencies.** Some tasks must happen before others — e.g., a shared layout/nav component must exist before individual pages that use it; data models/types should exist before components that consume them; design tokens (if generated) must exist before any styled component.

3. **Sequence into phases**, in this order:
   - **Foundation**: routing setup, layout shell, navigation, data models/types, API/mock data layer, theme/token wiring
   - **Core UI**: the main pages and flows identified as highest-priority in the grill summary
   - **Secondary UI**: less-critical pages, edge cases, empty/error/loading states
   - **Responsive & polish**: mobile breakpoints, animations/transitions, accessibility pass, final visual QA

4. **Write tasks** to `docs/tasks.md`. Each task should be scoped small enough to complete and verify independently:

```markdown
# Tasks — [Project Name]

## Phase 1: Foundation
- [ ] Set up routing structure per information-architecture.md
- [ ] Build layout shell (nav + content area)
- [ ] Define data models/types for [entities]
- [ ] Wire up theme tokens (if applicable)

## Phase 2: Core UI
- [ ] Build [Page A] — depends on: layout shell, data models
- [ ] Build [Page B] — depends on: [Page A component if shared]
...

## Phase 3: Secondary UI & States
- [ ] Empty states for [list views]
- [ ] Error states for [async operations]
- [ ] Loading states

## Phase 4: Responsive & Polish
- [ ] Mobile breakpoints for [pages]
- [ ] Accessibility pass (focus states, aria labels, contrast)
- [ ] Final visual review (see design-review skill)
```

5. Each unchecked box is a unit of work the frontend-design skill will pick up in order. As work progresses, tasks should be checked off — if you (Claude) are the one implementing, update this file as you complete each task rather than leaving it stale.

6. Confirm the plan with the user before starting implementation — this is their last checkpoint before code gets written.
