---
name: code-review
description: Review recent code changes in this project for correctness bugs, adherence to CLAUDE.md conventions, and accidental Daf Yomi data invention. Use after implementing or changing any code, before committing or moving to the next step. Report-only by default.
---

# code-review (project-specific)

Reviews a diff or recently-changed files in this project against
[CLAUDE.md](../../../CLAUDE.md)'s conventions. This is narrower and project-aware
compared to a generic review — it specifically watches for violations of this
project's data-integrity rules.

## When to use
- After implementing or changing any code, before the user commits or moves
  on to the next step.

## What to check
- Correctness bugs in the changed code.
- Adherence to CLAUDE.md conventions: ES modules, small single-purpose
  functions, no "what" comments (only "why" ones for genuinely non-obvious
  constraints), no speculative abstractions or unneeded error handling.
- Whether any Daf Yomi data was hand-entered or hardcoded instead of sourced
  live from `@hebcal/learning` — this is a hard violation, call it out
  explicitly if found.
- Unnecessary complexity or logic that duplicates existing helpers (e.g.
  `firstCheck/`'s `createDate`, `formatDate`, `addDays`, `getDaf` patterns).
- Any architectural decision (data flow, state, structure) introduced in code
  without having been discussed first — flag it, per CLAUDE.md's working
  process.

## Allowed to modify
- Nothing, by default — this is a report-only review.
- Only when explicitly run in a "fix" mode: the specific files under review,
  and nothing outside that set.

## Must never
- Never commit, stage, or push changes.
- Never modify `CLAUDE.md`.
- Never silently rewrite flagged logic instead of surfacing the finding to
  the user first.
