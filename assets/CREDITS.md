# Asset credits

The engine ships a minimal demo game, **Nebula Nursery**. **All of its art is generated**
from one parametric SVG art module, `tools/art/nebula.cjs`, rendered to PNG by
`.claude/skills/_shared/render-svg.cjs` (headless Chromium). Everything is original to this
repo — nothing is reused from any other game's art — and dedicated to the public domain
(**CC0**).

| Asset | File | Notes |
| --- | --- | --- |
| Metal deck ground | `assets/img/ground.png` | tileable 512 |
| Nursery mat | `assets/img/pen_floor.png` | the pen's floor (glowing hex mat) |
| Keeper robot (2 colours) | `assets/sheet/keeper.png`, `keeper_amber.png` | 128-px LPC walkcycle (hovering) |
| Keeper thumbnails | `assets/ui/keeper_thumb.png`, `keeper_amber_thumb.png` | menu portraits |
| Alien critters (×5 glows) | `assets/sheet/critter_*.png`, `assets/ui/critter_*.png` | 128-px, 4-frame squash walk |
| Close-ups | `assets/img/critter_closeup_*.png` (+ `_done`) | dusty → happy, per glow colour |
| Dust bunnies, cloth, bubble | `dust.png`, `dust_b.png`, `cloth.png`, `want_dust.png` | polish mini-scene |
| Force-field fence | `assets/sheet/fence.png` | 80-px frames drawn at half size |
| Recharge pod | `assets/img/pod_rest.png` | rest station |
| Scenery & unlocks | `crystal*.png`, `alienplant.png`, `orblamp.png`, `starball.png`, `fountain.png` | |
| UI icons | `assets/ui/icons/*.png` | shared icon kit in the neon palette + critter, keeper, polish mitt |
| Home splash | `assets/img/splash.png` | starfield, ringed planet and floating critters |
| Logo & app icons | `assets/img/logo.png`, `assets/favicon.png`, `assets/apple-touch-icon.png` | the shared `critter()` drawing |

Regenerate: `node .claude/skills/_shared/render-svg.cjs tools/art/nebula.cjs [--only key]`.

## Engine dependencies
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
- **Fredoka** font (latin subset) vendored at `vendor/fonts/fredoka-latin.woff2` —
  SIL Open Font License 1.1, © The Fredoka Project Authors (Milena Brandão).
- Sounds and music are synthesised at runtime (WebAudio) — no audio files.

## Making your own game
Write your own `tools/art/<game>.cjs` (copy the demo's structure) or source external art
(see the **asset-search** / **asset-add** skills) and credit any third-party assets here
with their author + license.
