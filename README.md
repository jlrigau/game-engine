# 🎮 Generic 2D Game Engine

A small, **data-driven** top-down 2D game engine (Phaser 3, 100% static, no build).
The engine (`engine.js`) contains **no game content**: an entire game is described by a
single config file (`game.config.js`) plus its assets. Swap the config + assets — or run
the **`new-game`** skill — to generate a completely different game from the same engine
and the same skills.

It ships with a small neutral demo, **Nebula Nursery**: a keeper robot looks after a few
glowing alien critters in a space nursery. The demo is **deliberately minimal** — you
grow a game by **iterating** (adding variants, a shop, riding, breeding, objectives…),
which the engine fully supports.

---

## Table of contents
1. [Quick start](#-quick-start)
2. [How it works](#-how-it-works)
3. [Anatomy of a game (`game.config.js`)](#-anatomy-of-a-game-gameconfigjs)
4. [Engine capabilities](#-engine-capabilities)
5. [Make a new game](#-make-a-new-game)
6. [Iterating: adding features](#-iterating-adding-features)
7. [Skills](#-skills-claude-code)
8. [Testing & verifying](#-testing--verifying)
9. [Deploy (GitHub Pages)](#-deploy-github-pages)
10. [Project layout & conventions](#-project-layout--conventions)

---

## ▶ Quick start

No installation. Either open `index.html` directly in a browser, or serve the folder:

```bash
bash .claude/skills/_shared/serve.sh 8099   # then open http://localhost:8099/
```

Phaser is **vendored locally** (`vendor/phaser.min.js`) — no CDN, no dependency, works
offline.

**Play the demo:** name your nursery → pick a keeper → move with tap/click (or
arrows / WASD / ZQSD) → walk up to a critter → **Feed** / **Play** → rest at the
**Recharge Pod** to reach the next cycle. Saves automatically (localStorage).

---

## 🧩 How it works

The engine is **one generic program** parameterised by a global object. At load time
`index.html` runs three scripts **in order**:

```
vendor/phaser.min.js   →   game.config.js   →   engine.js
                            (window.GAME)        (reads window.GAME)
```

- `engine.js` implements every **system** (movement, rendering, collisions, UI, save…)
  but knows nothing about your game.
- `game.config.js` is your **game**: all data, strings, geometry, entities, actions,
  economy, objectives, and references to assets.
- `style.css` is the **theme** (CSS variables at the top).

A game therefore = **engine + config + assets**. To make a different game you never edit
`engine.js`; you write a new `game.config.js` and provide its assets.

---

## 🧱 Anatomy of a game (`game.config.js`)

`game.config.js` sets `window.GAME = { … }`. The full schema (every field, with types)
is in **[ENGINE.md](ENGINE.md)** — keep it open while editing. Here is the shape, and a
tiny excerpt from the demo:

```js
window.GAME = {
  meta,            // title, icons, save key, theme colours, audience, UI strings
  world, camera,   // size, ground tile, background, zoom
  assets, fence,   // images + spritesheets to load
  player, characters,   // avatar(s) and the create screen
  creature,        // the creature system (needs, actions, variants, ride, breeding…)
  zones, stations, // the pen; buildings (rest / shop / custom)
  economy, shop, decor,      // coins, shop, placeable decorations
  environment, scenery,      // arena + trail loop + scattered props
  objectives, help,          // gamification levels; help screen
};
```

```js
// minimal creature: 2 needs, 2 care actions (from the demo)
creature: {
  label: "critters", sheet: "critter", scale: 1.0, origin: { x: 0.5, y: 0.78 },
  walk: { start: 0, end: 3, frameRate: 6 },
  moodNeed: "joy", moodFrom: ["fuel", "joy"],
  needs: [ { id: "fuel", icon: "🔋", start: 70, perDay: -22 }, { id: "joy", icon: "😊", start: 80 } ],
  actions: [
    { id: "feed", label: "Feed", icon: "🔋", effects: { fuel: 35, joy: 8 }, anim: "eat",  stat: "feed", message: "{name} recharged happily! 🔋" },
    { id: "play", label: "Play", icon: "🎮", effects: { joy: 22, fuel: -6 }, anim: "cheer", stat: "play", message: "{name} had fun! 🎮" },
  ],
  names: ["Zib", "Lumi", "Pulse"], startCount: 3,
},
```

Notable conveniences:
- **Every UI string** has an engine fallback, so override only what you want in `meta`.
- Strings interpolate `{name}`, `{day}`, `{names}`, `{item}`.
- `objectives.levels[].goals[].check` is a **function** receiving the whole `state`
  (`state.coins`, `state.day`, `state.creatures`, `state.stats`, …).
- Creature **variants** can be a colour **tint** of one base sheet (no extra art) or a
  dedicated spritesheet.
- Turn whole systems off by **omitting** them (`ride`, `breeding`, `aging`, `shop`,
  `decor`, `environment`, `objectives`). `meta.showCoins:false` hides the economy.

---

## ✨ Engine capabilities

All optional and config-gated (see ENGINE.md):

- Tiled world, camera follow, adaptive zoom.
- Player avatar: 4-direction walkcycle, tap/click-to-move + keyboard, run on double-tap;
  multiple selectable characters + create/change-look screen.
- Creatures: autonomous wandering, **needs**, mood heart, **actions**
  (effects/costs/rewards/animations), **variants** (tint or sheet), **customization**
  (rename + restyle), **aging/growth**, **breeding**, a **mount** system (ride + fatigue)
  and **hop/jump** over obstacles.
- Buildings (**stations**): next-day rest, shop, or custom handlers.
- **Economy + shop**: coins, buyable resources, capacity upgrades, buy creatures,
  buyable **decorations** placed via a ghost-follow system.
- **Collisions** (AABB, with a `jumpable` flag).
- **Environment**: fenced **arena** with obstacles + a **trail loop** in a forest band,
  scattered by a single declarative rule (no bare edges/corners).
- **Day/night** cycle with rest-gating; **objectives/levels** gamification.
- **Save** to localStorage with backward-compatible loading; **PWA/iOS** support.

---

## 🆕 Make a new game

### Keep the engine, spin each game into its own repo (recommended)

This repo is the **engine** (+ a demo). Don't build your game *in* it — give each game
its **own repository** so the engine stays clean and reusable. The simplest way is a
GitHub **template repository** (not a fork — a fork stays linked upstream and you can
only fork once per account; a template gives clean, independent copies, as many as you
want).

1. **One-time — mark the engine as a template:** on this repo, **Settings → General →**
   tick **“Template repository”** (saves instantly). A green **“Use this template”**
   button now appears on the repo home.
2. **For each new game:** **“Use this template” → “Create a new repository”**, name it
   (e.g. `my-space-game`). You get a fresh, independent repo with the whole engine + demo.
3. **Make it your game:** open the new repo in Claude Code and run **`/new-game`** (or
   *“create a game about …”*) — it rewrites `game.config.js` + assets + theme **without
   touching `engine.js`**.
4. **Publish it:** in the new repo, **Settings → Pages → Source: “GitHub Actions”**.
   Because `main` is the default branch from creation, the first deploy succeeds right
   away (no environment quirk to fix).

You keep evolving the engine repo freely afterward — the template flag changes nothing
else. Note that “Use this template” copies the engine **at that moment**: later engine
improvements don't auto-flow into already-created game repos. To pull an update into a
game, copy the newer `engine.js` over (it's a single generic file — that's the point of
the engine/config split), or use a **fork** instead of a template if you want
`git pull`-able updates.

### Inside a game repo

**The easy way — the `new-game` skill.** In Claude Code, ask to *“create a new game”*
(or `/new-game`). It interviews you for the **theme, target audience/age, art style,
language and core loop**, then writes a fresh `game.config.js`, sources/generates the
assets, themes the shell, tests it headlessly, and (optionally) deploys — **without ever
editing `engine.js`**.

> **Start minimal.** A new game should ship small (one zone, one creature, 1–2 needs,
> 2 actions, maybe a tiny goal). Add features later by iterating — that's the workflow.

**The manual way:**
1. Copy `game.config.js` and rewrite each section per [ENGINE.md](ENGINE.md). Use a fresh
   `meta.saveKey`.
2. Provide assets in `assets/` (`img/` single images, `sheet/` spritesheets, `ui/`
   thumbnails) and register them under `GAME.assets`. Generate them (Pillow) or fetch
   them (the **asset-search** / **asset-add** skills) — see [credits](assets/CREDITS.md).
3. Restyle `style.css` (CSS variables at the top) and update `index.html` +
   `manifest.webmanifest` titles/colours.
4. Verify with the harness (below), then deploy.

---

## 🔁 Iterating: adding features

The intended workflow is to **grow** a game. Each of these is a small config edit, often
with a dedicated skill:

| Want to add… | Do this |
| --- | --- |
| A new critter colour | `creature.variants` (tint) — skill **add-creature-variant** |
| Let players rename/restyle | `creature.customize` |
| A shop & coins | `economy` + `shop`, set `meta.showCoins` back on |
| Buyable decorations | `GAME.decor` — skill **add-decor-item** |
| Riding + obstacles | `creature.ride` (+ `environment.arena`) |
| Babies | `creature.breeding`, `creature.aging` |
| A scattered forest / trail loop | `GAME.environment` — skill **place-scatter** |
| More goals / levels | `GAME.objectives.levels` |
| A new playable character | `GAME.characters` — skill **add-character** |
| New art | skills **asset-search** → **asset-add** |

For non-technical iteration, the **feedback-session** skill lets a child/client/playtester
drive changes in plain language while all the technical work happens silently.

---

## 🛠️ Skills (Claude Code)

Reusable, game-agnostic skills in `.claude/skills/` that operate on the config and
assets. Shared tooling in `_shared/` (`serve.sh`, `bump-version.mjs`, `playtest.cjs`).

| Skill | Purpose |
| --- | --- |
| **new-game** | Scaffold a brand-new game from the engine (interactive, starts minimal). |
| **feedback-session** | Non-technical "playtester" mode — changes from plain-language feedback. |
| add-character | Add a playable avatar (`GAME.characters`). |
| add-creature-variant | Add a creature colour/skin (tint or sheet). |
| add-decor-item | Add a buyable, placeable decoration (`GAME.decor`). |
| add-collision | Add/tune an AABB collision (with `jumpable`). |
| place-scatter | Edit the trail forest via the single declarative rule. |
| asset-search / asset-add | Find (content-policy + license checks) and integrate assets. |
| state-migration | Evolve the saved state backward-compatibly. |
| test-debug / map-verify | Prove a feature works / validate map placement (headless, with proof). |
| ios-pwa-check | Keep the iPhone/PWA layout clean. |
| release-deploy | Cache-bust, push to `main`, verify the Pages deploy. |

---

## 🧪 Testing & verifying

A headless Playwright harness drives the real game and reports page errors:

```bash
bash .claude/skills/_shared/serve.sh 8099
# read state, capture zones, check trail walkability:
node .claude/skills/_shared/playtest.cjs --eval "state.creatures.length" \
  --shots "view:760:560:0.8,pen:900:620:0.85" --walk
# run a full scenario (a .cjs module exporting async (page) => {…}):
node .claude/skills/_shared/playtest.cjs --probe ./scenario.cjs
```

Globals exposed to `page.evaluate`: `GAME`, `state`, `player`, `COLLISIONS`, `WORLD`,
`PATHS`, `LOOP_SEG`, `OPENINGS`, `sc`, `creatureAction`, … The JSON report includes
screenshots, walkability and `pageErrors` (exit ≠ 0 on a page error). Chromium uses
`HTTPS_PROXY` automatically when set. See the **test-debug** / **map-verify** skills.

---

## 🌐 Deploy (GitHub Pages)

The site is static and deployed from `main`. Pushing to `main` runs
`.github/workflows/deploy.yml`, which publishes to GitHub Pages.

**Enable once:** repo **Settings → Pages → Build and deployment → Source → GitHub
Actions**. The site then lives at `https://<user>.github.io/<repo>/`.

**Cache-busting:** whenever JS/CSS/images change, bump the version `vN` in **both**
`game.config.js` (`assetVersion`) and every `?v=` in `index.html`:

```bash
node .claude/skills/_shared/bump-version.mjs
```

The **release-deploy** skill does the bump + commit + push + verifies the Actions run.

---

## 📁 Project layout & conventions

```
index.html            page shell (loads phaser → game.config.js → engine.js)
style.css             theme (CSS variables at the top)
engine.js             the generic engine — never holds game content
game.config.js        THE GAME: data + asset references (window.GAME)
ENGINE.md             full GAME config schema + capabilities reference
CLAUDE.md             notes for Claude Code sessions
vendor/phaser.min.js  vendored engine dependency (MIT)
assets/               img/ (single sprites) · sheet/ (spritesheets) · ui/ (thumbnails) · CREDITS.md
.claude/skills/       reusable Claude Code skills + _shared/ tooling
.github/workflows/    GitHub Pages deploy
```

- **`engine.js` stays generic.** If it truly lacks a capability, add it there as a
  generic, config-gated feature (document it in ENGINE.md) — never hard-code game content.
- `game.config.js` is the single source of game content.
- Engine, config and skills are in **English**.
- Set `GAME.meta.audience` honestly — the asset skills use it for content suitability.

## 🎨 Credits

Demo textures and icons are **generated** (CC0) and specific to the demo's universe.
Phaser 3 is MIT. See [`assets/CREDITS.md`](assets/CREDITS.md).
