# 🎮 Generic 2D Game Engine

A small, **data-driven** top-down 2D game engine (Phaser 3, 100% static, no build).
The engine (`engine.js`) contains **no game content**: a whole game is described by a
single config file (`game.config.js`) plus its assets. Swap the config + assets — or
run the **`new-game`** skill — to generate a completely different game from the same
engine and the same skills.

It ships with a neutral demo game, **Critter Cove**, where you care for cute abstract
critters in a meadow.

## ▶️ Play / run

No installation: open `index.html` in a browser, or serve the folder:

```bash
bash .claude/skills/_shared/serve.sh 8099   # then open http://localhost:8099/
```

Phaser is **vendored locally** (`vendor/phaser.min.js`) — no CDN, no dependency.

## 🧩 Architecture

```
index.html            page shell (loads phaser → game.config.js → engine.js)
style.css             theme (CSS variables at the top)
engine.js             the generic engine — never holds game content
game.config.js        THE GAME: data + asset references (window.GAME)
vendor/phaser.min.js  vendored engine dependency (MIT)
assets/               img/ (single sprites) · sheet/ (spritesheets) · ui/ (thumbnails)
ENGINE.md             full GAME config schema + capabilities reference
.claude/skills/       reusable Claude Code skills (see below)
.github/workflows/    GitHub Pages deploy
```

A game = **engine + config + assets**. See **[ENGINE.md](ENGINE.md)** for the complete
config schema and the list of engine capabilities (movement, creatures with
needs/actions/variants, riding & obstacles, shop & economy, decoration placement,
collisions, scattered environment, day/night, objectives/levels, save, PWA…).

## 🆕 Make a new game

Use the **`new-game`** skill: it interviews you for the theme, target audience/age, art
style, language and core loop, then writes a fresh `game.config.js`, sources/generates
the assets, themes the shell, tests it, and (optionally) deploys — **without ever
editing `engine.js`**.

Or do it by hand: copy `game.config.js`, replace each section per `ENGINE.md`, swap the
assets, restyle `style.css`.

## 🛠️ Skills (Claude Code)

Reusable, game-agnostic skills in `.claude/skills/` that operate on the config and
assets. Shared tooling in `_shared/` (`serve.sh`, `bump-version.mjs`, `playtest.cjs`).

| Skill | Purpose |
| --- | --- |
| **new-game** | Scaffold a brand-new game from the engine (interactive). |
| **feedback-session** | Non-technical "playtester" mode — drives changes from plain-language feedback, silently. |
| add-character | Add a playable avatar (`GAME.characters`). |
| add-creature-variant | Add a creature colour/skin (tint or sheet). |
| add-decor-item | Add a buyable, placeable decoration (`GAME.decor`). |
| add-collision | Add/tune an AABB collision (with `jumpable`). |
| place-scatter | Edit the trail forest via the single declarative rule. |
| asset-search / asset-add | Find (with content-policy + license checks) and integrate assets. |
| state-migration | Evolve the saved state backward-compatibly. |
| test-debug / map-verify | Prove a feature works / validate map placement (headless, with proof). |
| ios-pwa-check | Keep the iPhone/PWA layout clean. |
| release-deploy | Cache-bust, push to `main`, verify the Pages deploy. |

## 🌐 Deploy (GitHub Pages)

Pushing to `main` runs `.github/workflows/deploy.yml`, which publishes the static site.
Enable it once: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
Cache-busting (`?v=vN`) is handled by `bump-version.mjs` / the **release-deploy** skill.

## 🎨 Credits

Demo creatures and icons are generated (CC0). Environment/character/fence sprites reuse
free **LPC** pixel-art (CC-BY / CC-BY-SA) — see [`assets/CREDITS.md`](assets/CREDITS.md).
Phaser 3 is MIT.
