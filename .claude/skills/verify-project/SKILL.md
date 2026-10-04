---
name: verify-project
description: Project-wide health check for DafHayomi -- dependency drift, Daf Yomi data validation, and CLAUDE.md accuracy. Use periodically, before a milestone, or whenever a general project sanity check is wanted (not tied to one specific code change). Read-only; proposes CLAUDE.md edits rather than applying them.
---

# verify-project

A broader, read-only sweep of project health, separate from reviewing a
specific change. Checks that the project matches what [CLAUDE.md](../../../CLAUDE.md)
claims about it, and that Daf Yomi data still holds up.

## When to use
- Periodically, or before a milestone.
- Whenever the user wants a general sanity check not tied to one diff.

## What to do
1. **Dependency check** — compare `package.json` dependencies against what's
   actually installed in `node_modules`. Flag anything extra, missing, or
   mismatched in version.
2. **Data validation** — run the same checks as `validate-dafim` (consecutive
   dates, no duplicate dates/dapim, consistent cycle number, ~2711 dapim per
   cycle as a sanity check, not a source of truth) as part of the sweep.
3. **CLAUDE.md accuracy** — check whether CLAUDE.md's description of the
   stack, file layout, and testing setup still matches reality (e.g. a test
   runner got installed but CLAUDE.md still says none exists). List specific
   drift found.
4. **Stray files/deps** — note any files or dependencies that appear unused
   or have accumulated without a clear purpose.

## Allowed to modify
- Nothing. This is a read-only report.
- If CLAUDE.md drift is found, propose the exact edit as text for the user to
  review — do not apply it.

## Must never
- Never install, remove, or upgrade dependencies on its own.
- Never edit application code.
- Never edit `CLAUDE.md` directly, even to "just fix" a small drift — surface
  it and wait for approval.
