---
name: new-game
description: Scaffold a BRAND-NEW game from this generic engine. Use when the user wants to create a different game on top of the engine ("create a new game", "start a new game from the engine", "scaffold a game", "init a game", "make a game about X"). Interactively asks the theme, target age/audience, art style, language and core loop, then generates a fresh game.config.js + assets + theming, wires it up, tests it, and (optionally) deploys. The engine code (engine.js) is never modified.
---

# new-game ⭐ (initializer / scaffolder)

Turn the engine into a specific game **without touching `engine.js`**. A game =
`game.config.js` (the whole definition) + assets + CSS theme. This skill authors them
from a short interview.

## ⭐ Start MINIMAL
A new game should ship **small**: the core loop and little else. Features get added by
**iterating** afterwards (that's the whole point). A good seed is roughly: one world
zone, one or two characters, a creature with **1–2 needs** and **2 care actions**, maybe
one station and a tiny objectives set — and **nothing more**. Leave variants, shop,
riding/obstacles, breeding, decorations, trail loops OFF until the user asks. Use
`meta.showCoins:false` when there's no economy; omit `objectives` to hide goals. The
engine stays fully capable — you're choosing what to enable, not removing anything.

## Step 1 — Interview (AskUserQuestion)
Ask only what changes the output. Bundle into 1–2 `AskUserQuestion` calls:
- **Theme / subject**: what is the game about? (e.g. space pets, plant garden, robot
  workshop, monster ranch). Free text encouraged.
- **Target audience / age**: e.g. "young kids (6–8)", "kids (9–11)", "teens", "all
  ages", "adults". → sets `GAME.meta.audience` and the content-suitability bar used by
  **asset-search** (`references/content-policy.md`).
- **Art style**: pixel-art LPC (default, assets available), or other.
- **Language**: UI strings language (the demo ships English).
- **Core loop**: the main entity to care for / interact with, and the 3–5 main
  **actions** (feed/clean/play/ride… or theme equivalents). Keep it close to the
  engine's supported systems (see `ENGINE.md` for the full list of capabilities).
- **Optional systems**: variants, customization, riding+obstacles, breeding, aging,
  shop, decorations, objectives/levels, trail loop. **Default = OFF.** Only enable one
  if the user explicitly wants it in the first version.

If an answer is obvious from the theme, pick a sensible default and say so — don't
over-ask. Bias toward the smallest playable game.

## Step 2 — Author `game.config.js`
Write a new `game.config.js` (the **whole** game) following the schema in **`ENGINE.md`**.
Start from the demo as a template and replace, section by section:
- `meta` (title, icons, save key, theme colours, **audience**, UI strings, language)
- `world` + `camera`, `assets` (images/sheets), `player` + `characters`
- `creature` (label, needs, actions with effects/costs/rewards, variants, customize,
  ride/jump, celebrate, aging, breeding, names, start state) — omit systems not wanted
- `zones`, `stations`, `economy` + `shop`, `decor`
- `environment` (band + arena + trail loop + forest scatter) if used; else drop it
- `objectives.levels` (gamification), `help`
Use a fresh `meta.saveKey` so it doesn't collide with other games' saves.

## Step 3 — Assets
- **Reuse** the generic environment assets already in `assets/` when they fit
  (ground, trees, bushes, fences, buildings).
- **New themed assets**: use **asset-search** → **asset-add** (search + verify +
  slice), respecting the audience's content policy. For abstract/neutral creatures,
  **generate** them procedurally with Pillow (see how the demo's `critter.png` and
  icons were generated) — fully self-contained, no licensing.
- Variants can be **tints** of one base sheet (no new asset needed) — see
  **add-creature-variant**.
- Generate fresh **PWA icons** (`assets/favicon.png` 512, `assets/apple-touch-icon.png`
  180) matching the new theme.

## Step 4 — Theme & shell
- Restyle `style.css` palette (CSS variables at the top) and update titles/ids in
  `index.html` + `manifest.webmanifest` (`name`, `short_name`, `theme_color`,
  `apple-mobile-web-app-title`). Keep the iOS/PWA rules (see **ios-pwa-check**).

## Step 5 — Verify & ship
- **test-debug**: `node --check`, serve, run the harness — 0 page errors, core actions
  work, state correct. Look at the screenshots.
- **map-verify** if the map geometry is custom (walkability empty).
- **release-deploy** when the user wants it live (or hand back for review first).

## Guard-rails
- **Never edit `engine.js`.** If the engine genuinely lacks a capability, say so and
  propose adding it to the engine as a separate, generic feature (not game-specific).
- Keep `game.config.js` the single source of game content.
- Set `GAME.meta.audience` honestly — the asset skills rely on it for content safety.
- One safe, coherent, working game beats a half-wired ambitious one.

## Chaining
**new-game** → asset-search/asset-add (themed assets) → add-* skills → test-debug →
map-verify → release-deploy.
