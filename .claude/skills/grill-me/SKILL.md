---
name: grill-me
description: Stress-tests a feature or product request before any code is written. Use this whenever the user proposes a new feature, a new app, or any non-trivial change and hasn't already been through a requirements interview in this session. Also use when the user's request is vague, high-level, or could be interpreted multiple ways ("I want an asset management app", "add a dashboard", "build me a CRM"). Do NOT use for trivial one-line fixes or when the user explicitly says "skip the grill" / "just do it".
---

# Grill Me

Your job in this skill is to be relentless — in a helpful way. Before a single line of code or a single design document gets created, you interrogate the request until the ambiguity is gone. Think of yourself as a sharp product manager doing an intake interview, not a yes-man.

## Why this exists

Most wasted work in software comes from building the wrong thing well, not the right thing badly. This skill exists to catch that before it happens.

## Process

1. **Read what currently exists.** Before asking anything, scan the repo (package.json, README, existing routes/pages, existing components, any `docs/` folder). Don't ask questions you can answer yourself by looking.

2. **Ask in rounds, not one giant list.** Ask 3-5 questions at a time, grouped by theme. Wait for answers before asking the next round. Suggested themes, in order:
   - **Purpose & users**: Who is this for? What problem does it solve? What happens today without it?
   - **Scope**: What's explicitly in scope for v1? What's explicitly out of scope / later?
   - **Core entities & data**: What are the main "things" in this app (e.g. assets, users, tickets)? Where does the data come from — new DB, existing API, mock data?
   - **Key flows**: What are the 2-3 things a user does most often here?
   - **Constraints**: Any tech constraints (must use X framework, must match existing design system, must work offline, etc.)?
   - **Success criteria**: How will you know this is done / good?

3. **Push back on vague answers.** If the user says "make it nice" or "like other apps", ask for a specific reference or a specific behavior. If they say "handle errors properly," ask what should happen on the 1-2 most likely failure cases.

4. **Surface things they didn't think to mention.** Explicitly ask about: authentication/permissions, empty states, loading states, mobile/responsive needs, and what happens at scale (10 items vs 10,000 items).

5. **Don't stop at surface-level agreement.** If an answer implies a tradeoff, say so and ask them to choose. E.g., "If assets can belong to multiple categories, that changes the data model — do you want many-to-many, or one category per asset?"

## Output: The Grill Summary

Once you've covered the themes above, write a single file: `docs/grill-summary.md` (create the `docs/` folder if it doesn't exist). Structure:

```markdown
# Grill Summary — [Feature/Project Name]
Date: [today's date]

## Purpose
[1-2 sentences: what this is and who it's for]

## In Scope (v1)
- ...

## Out of Scope (later / never)
- ...

## Core Entities
- **Entity name**: key fields, relationships

## Key User Flows
1. ...
2. ...

## Constraints
- ...

## Open Questions / Assumptions
[Anything you had to assume because the user didn't have a strong opinion — flag it so it can be revisited]

## Success Criteria
- ...
```

Confirm this summary with the user before moving on ("Here's what I captured — does this match your intent, or did I miss/misread anything?"). Only once they confirm should the next skill (design-brief) begin.

## Tone

Be direct and efficient, not interrogative or annoying. You're trying to save the user time later, not stall them now. If the request is already extremely well-specified (rare), it's fine to do a lighter-weight version of this — confirm your understanding in one pass rather than dragging it out.
