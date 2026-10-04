# DafHayomi

## Purpose
An app for tracking and displaying Daf Yomi (the daily Talmud page cycle) —
showing the current daf, navigating dates, and/or browsing the full cycle.
(Exact user-facing scope to be refined as the UI is designed.)

## Technology stack (current)
- Node.js (v22), ES modules (`"type": "module"` in `package.json`)
- `@hebcal/core` ^6.11.1 — Hebrew calendar engine (HDate, etc.)
- `@hebcal/learning` ^6.11.4 — provides `DailyLearning.lookup('dafYomi', hdate, true)`
- No UI framework, bundler, test runner, or TypeScript is installed yet.
  Do not add one speculatively — introduce a dependency only when a concrete
  step in the plan needs it, and name the need explicitly before installing.
- `firstCheck/` holds exploratory/validation scripts (not application code):
  `test.js`, `test-sequence.js`, `test-full-cycle.js` — these probe and
  sanity-check the hebcal Daf Yomi data and are useful references for the
  `DailyLearning` API shape.

## Data-source requirements
- **Daf Yomi data must never be manually invented, hardcoded, or guessed.**
  All daf/date/cycle data must come from `@hebcal/learning`'s `DailyLearning`
  API (or another explicitly-approved authoritative library/API). If the
  library doesn't expose something we need, say so — don't fill the gap with
  assumed data.
- Any date arithmetic must account for the Hebrew calendar correctly (via
  `HDate`), not naive Gregorian-only assumptions — Daf Yomi is Hebrew-calendar
  driven.
- Treat `firstCheck/test-full-cycle.js`'s validations (consecutive dates, no
  duplicate dates, no duplicate dapim, correct cycle number, expected total
  dapim per cycle = 2711) as the baseline sanity checks any new data-access
  code should also satisfy.

## Reliable, validated data
- Before relying on any new hebcal API call in application code, validate its
  output the way `firstCheck/` does (spot checks + consistency checks), not
  just a single manual example.
- Prefer deriving values from the library's returned objects (e.g.
  `event.daf.name`, `.blatt`, `.cycle`) over recomputing them independently.
- Flag any discrepancy between expected and actual data (e.g. total dapim
  count) instead of silently "fixing" it to match assumptions.

## Coding conventions
- ES modules, `import`/`export` syntax (matches existing `package.json`).
- Keep functions small and single-purpose (see `firstCheck` helpers like
  `createDate`, `formatDate`, `addDays`, `getDaf` as the style baseline).
- No comments explaining *what* code does — only *why*, for non-obvious
  constraints (e.g. timezone/UTC pitfalls in date handling).
- No speculative abstractions, feature flags, or error handling for cases
  that can't occur. Build for the current, concrete requirement only.

## Testing requirements
- New data-access or date-logic code must be verified against real hebcal
  output, not mocked/fabricated data.
- When adding a real test runner is warranted, propose it explicitly before
  installing — don't add one silently as a side effect of another task.
- Until then, small standalone verification scripts (in the style of
  `firstCheck/`) are an acceptable way to validate behavior.

## Working process
- Prefer small, verifiable steps over large speculative changes. Land one
  working, checked piece before building the next on top of it.
- Explain important architectural decisions (data flow, state management,
  framework choice, folder structure, etc.) **before** implementing them, and
  get agreement first — don't surprise-introduce architecture via code.
- Do not start building the UI until explicitly asked to.
