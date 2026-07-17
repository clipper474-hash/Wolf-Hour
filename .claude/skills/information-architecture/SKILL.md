---
name: information-architecture
description: Structures pages, navigation, and content hierarchy based on the grill summary and design brief. Use this after docs/grill-summary.md and docs/design-brief.md exist, before any UI or design tokens are built. Especially important for multi-page apps, flows with several steps, or any navigation redesign — ask additional clarifying questions in those cases before finalizing.
---

# Information Architecture

Turns confirmed requirements + design brief into a concrete structure: what pages exist, how they connect, what's on each one.

## Prerequisite check

Requires `docs/grill-summary.md` and `docs/design-brief.md`. If either is missing, tell the user and stop.

## Process

1. **Read both docs fully** before proposing structure.

2. **Draft the page/navigation structure** based on the core entities and key flows already captured. Don't ask the user to invent this from scratch — propose a first draft, since you already have the inputs needed.

3. **Ask clarifying questions only if the structure is non-trivial** — i.e., more than a couple of pages, or if there's an existing navigation the user wants changed. Good questions:
   - Primary navigation: sidebar, top bar, or both?
   - Is there a dashboard/landing page, or does the app open straight into a list view?
   - How deep does the hierarchy go (e.g. list → detail → sub-detail)?
   - Any pages that need different access levels (admin-only, etc.)?

4. **Write the IA document** to `docs/information-architecture.md`:

```markdown
# Information Architecture — [Project Name]

## Navigation Pattern
[Sidebar / top nav / both, and why]

## Page Map
- **/dashboard** — [purpose, key content]
- **/assets** — [purpose, key content]
  - **/assets/:id** — [purpose, key content]
- **/reports** — [purpose, key content]
- ...

## Content Hierarchy per Page
[For each major page: what's above the fold, what's secondary, what's in overflow/menus]

## Cross-Page Patterns
[Things repeated everywhere: header, breadcrumbs, filters, search — note them once here so they're consistent]
```

Confirm with the user, then move to design-tokens (if needed per the design brief) or straight to brief-to-tasks.
