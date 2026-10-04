---
name: validate-dafim
description: Validate Daf Yomi data produced by @hebcal/learning against known invariants (consecutive dates, no duplicate dates/dapim, consistent cycle number, ~2711 dapim per cycle as a sanity check). Use after touching any Daf Yomi data-access code, before trusting a new DailyLearning call, or whenever daf/date output looks suspicious.
---

# validate-dafim

Validates that `@hebcal/learning`'s `DailyLearning.lookup('dafYomi', hdate, true)`
output is internally consistent, per [CLAUDE.md](../../../CLAUDE.md)'s data-source
requirements. This is a correctness check on the library's output as consumed
by this project — never a place to invent or adjust daf data.

## When to use
- After adding or changing any code that reads Daf Yomi data.
- Before relying on a new `DailyLearning` call pattern in application code.
- Any time a daf, date, or cycle number looks wrong.
- As part of `verify-project`'s broader sweep.

## What to do
1. Pick (or reuse) a date range to check — default to at least one full cycle
   if the task doesn't specify a narrower range. [firstCheck/test-full-cycle.js](../../../firstCheck/test-full-cycle.js)
   shows the pattern for walking a cycle from its start date.
2. Run the check, either by executing an existing script in `firstCheck/` or
   by writing a new small, throwaway script in that same style if the
   existing ones don't cover the case at hand.
3. Verify these invariants over the collected records:
   - Dates are consecutive (no gaps, no overlaps).
   - No duplicate dates.
   - No duplicate `tractate-daf` pairs.
   - Cycle number is consistent across the range (unless intentionally
     crossing a cycle boundary).
   - A full cycle totals ~2711 dapim. This number is a sanity-check
     expectation, not the source of truth — `@hebcal/learning`'s output is
     the source of truth. If the real total differs, report the discrepancy
     as a finding; do not treat 2711 as something the data must be forced to
     match.
4. Report pass/fail per invariant, and for any failure or discrepancy, show
   the specific records/dates involved — don't just say "it failed."

## Allowed to modify
- Only new scratch/validation scripts it creates itself, placed in
  `firstCheck/` or a dedicated `validation/` folder.

## Must never
- Never hardcode, guess, or "patch in" daf/date/cycle values to make a check
  pass — Daf Yomi data must only ever come from `@hebcal/learning`.
- Never modify application or data-access source code (or the ~2711 check
  itself) to force the dapim count, or any other invariant, to match the
  expected value. `@hebcal/learning` is the source of truth — a mismatch is a
  finding to report, never something to correct the data toward.
- Never touch `CLAUDE.md` or `package.json`.
