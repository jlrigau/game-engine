---
name: test-debug
description: Test and debug what was implemented in a game built on this engine, with proof, before publishing. Use to validate a new feature end-to-end, or to reproduce/fix a described bug (e.g. "this action does nothing", "this letter won't type"). Combines static checks, headless execution (Playwright), assertions on game state, and a repro→cause→fix→regression loop. Triggers: "test", "debug", "check it works", "it doesn't work", "reproduce the bug".
---

# test-debug

Prove a feature **really works**, or reproduce+fix a bug — never "it should work".
Requirements: `python3`, `node` + Playwright.

## Procedure (Claude Code tools)

1. **Static check** — Bash: `node --check engine.js && node --check game.config.js`
   (+ JSON validity of the manifest if it changed).

2. **Serve** — Bash: `bash .claude/skills/_shared/serve.sh 8099`.

3. **Runtime + assertions** — Bash, via the `playtest.cjs` harness:
   ```bash
   # read a state value
   node .claude/skills/_shared/playtest.cjs --eval "state.creatures.length"
   # capture a zone
   node .claude/skills/_shared/playtest.cjs --shots "spawn:560:860:0.9"
   # full feature scenario (free assertions)
   node .claude/skills/_shared/playtest.cjs --probe ./scenario.cjs
   ```
   A *probe* = a `.cjs` module exporting `async (page) => {…}` that drives the page
   (clicks, `page.keyboard.type`, `page.evaluate`) and returns an assertions object.
   The harness **always reports `pageErrors`** (exit ≠ 0 if any).
   - Globals in `page.evaluate`: `GAME`, `state`, `player`, `COLLISIONS`, `WORLD`,
     `PATHS`, `LOOP_SEG`, `OPENINGS`, `sc`, `onPointer`, `creatureAction`, …
   - **Real keyboard test**: `page.focus("#field")` then `page.keyboard.type("abc…")`
     (NOT `page.fill`, which bypasses the event and wouldn't exercise the bug).

4. **Look at the screenshots** — **Read** the PNGs (`/tmp/engine-shots/*.png`) to
   validate visually (Claude Code renders images).

5. **For a BUG — loop**: reproduce (failing probe) → isolate the cause
   (`file:line`, via Grep/Read) → fix (Edit) → re-run until it passes **and** nothing
   else breaks. Not a single attempt.

6. **Report**: what works / what breaks (exact output & error), the cause, the fix —
   with screenshots + assertion values as **proof**.

## Guard-rails
- **Never say "it works" without proof** (screenshot + assertions + 0 pageError).
- Test the **real player scenario**, not just the absence of a JS error.
- If a functional choice is ambiguous, ask via **AskUserQuestion**.

## Chaining
Before **map-verify** (map visuals) and **release-deploy** (publish).
Called by the **feedback-session** orchestrator for each item.
