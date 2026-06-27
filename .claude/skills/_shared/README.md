# Shared skill tooling

Reusable building blocks for the **Claude Code skills** of this game engine
(`.claude/skills/<name>/SKILL.md`). The scripts are plain Node / Python / bash,
run by Claude Code through the **Bash** tool.

| File | Role |
| --- | --- |
| `serve.sh` | Serve the game statically: `bash .claude/skills/_shared/serve.sh [port]` (def. 8099). |
| `bump-version.mjs` | Bump the cache version `vN` in **both places** (`assetVersion` in game.config.js + every `?v=` in index.html). `node .claude/skills/_shared/bump-version.mjs`. |
| `playtest.cjs` | Headless Playwright harness: starts a game, takes zone screenshots (`--shots`), checks trail-loop walkability (`--walk`), evaluates expressions (`--eval`), runs assertions (`--probe`), and **reports page errors**. |

## Requirements
- `python3` (static server), `node` + **Playwright** (Chromium); for asset skills:
  `Pillow`/`numpy` (image slicing/generation).
- Playwright is found via `require("playwright")` then `/opt/node22/lib/node_modules/playwright`.
- The harness loads the game over a static server; if outbound HTTPS goes through a
  proxy it points Chromium at `HTTPS_PROXY` automatically. Phaser is **vendored
  locally** (`vendor/phaser.min.js`), so tests don't depend on a CDN.

## Engine globals exposed to `page.evaluate`
`GAME` (the config), `state`, `player`, `COLLISIONS`, `WORLD`, `PATHS`, `LOOP_SEG`,
`OPENINGS`, `LOGS`, `sc`, `onPointer`, `creatureAction`, …

## Full example
```bash
bash .claude/skills/_shared/serve.sh 8099
node .claude/skills/_shared/playtest.cjs --walk \
  --shots "spawn:560:860:0.9,pen:1210:300:0.8,arena:2010:760:0.8"
```
The JSON report lists screenshots, walkability and `pageErrors` (exit code ≠ 0 on a page error).
