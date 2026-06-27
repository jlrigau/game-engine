# Engine reference — `GAME` config schema

The engine (`engine.js`) is **data-driven** and contains no game content. A game is a
single global object `window.GAME` defined in `game.config.js`, plus its assets. This
file documents every field and the engine capabilities they drive. Use `game.config.js`
(the minimal "Nebula Nursery" demo) as a working template. The demo only uses a subset
of the fields below — every system is optional, so start small and add as you iterate.

> Load order in `index.html`: `vendor/phaser.min.js` → `game.config.js` → `engine.js`.

## Capabilities (all optional, config-gated)
- Top-down tiled world, camera follow, adaptive zoom.
- Player avatar: 4-direction LPC walkcycle, tap/click-to-move + keyboard (WASD/ZQSD),
  run on double-tap. Multiple selectable characters + create/change-look screen.
- Creatures: autonomous wandering NPCs with **needs**, mood heart, **actions**
  (effects/costs/rewards/animations), **variants** (tint or dedicated sheet),
  **customization** (rename + restyle), **aging/growth**, **breeding**, a **mount**
  system (ride + fatigue) and **hop/jump** over obstacles.
- Buildings (**stations**): "next day" rest, shop, or custom handlers.
- Economy + **shop**: coins, buyable resources, capacity upgrades, buy creatures,
  buyable **decorations** placed via a ghost-follow system.
- **Collisions** (AABB, with a `jumpable` flag).
- **Environment**: fenced **arena** with obstacles + a **trail loop** of sand paths in
  a forest band, scattered by a single declarative rule (no bare edges/corners).
- **Day/night** cycle with rest-gating; **objectives/levels** gamification.
- **Save** to localStorage with backward-compatible loading; **PWA/iOS** support.

## Top-level shape
```js
window.GAME = {
  meta, world, camera, assets, fence,
  player, characters,
  creature,            // the creature system (optional)
  zones, stations,
  economy, shop, decor,
  environment,         // arena + trail loop (optional)
  scenery,             // [[x,y,sprite,scale], ...]
  objectives, help,
};
```

### `meta`
Identity, theming and **all UI strings** (every label has an engine fallback, so you
can override only what you want).
```
title, titleIcon, shortName, tagline, saveKey, assetVersion: "vN",
audience: { minAge, notes },          // used by the asset skills' content policy
theme: { home, play },                 // iOS theme-color per screen
showCoins,                             // false → hide the coins HUD (no economy)
coinIcon, namePrompt:{label,placeholder}, startName, namePromptYou, avatarPrompt,
createTitle, createOkLabel, startLabel, continueLabel, continueHint, helpTitle,
ageUnit, and, nightMessage, restBlockedHint, neglectMessage, morningMessage,
notEnough, idleHint, placeHint, placeHere, cancel, boughtDecorMessage, placedMessage,
refundMessage, noOnBuilding, noInHome, nameLabel, confirm, nameTaken
```
Strings with `{name}`, `{day}`, `{names}`, `{item}` are interpolated by the engine.

### `world` / `camera`
```
world: { width, height, groundTile, bg, patches:[{x,y,w,h,tile,ox,oy}] }
camera: { fitW, fitH, min, max }       // zoom = clamp(min(w/fitW,h/fitH), min, max)
```

### `assets` / `fence`
```
assets.images: { key: "assets/img/x.png", ... }       // single images
assets.sheets: { key: { path, frameWidth, frameHeight }, ... }   // spritesheets
fence: { sheet, frames:{ post, side, cornerTL, cornerTR } }      // 32×32 fence tiles
```
Everything in `assets` is preloaded automatically (with cache-busting via `av()`).

### `player` / `characters`
```
player: { scale, speed:{walk,run,rideWalk,rideRun}, spawn:{x,y} }
characters: [ { id, name, sheet, thumb } ]   // sheet=64×64 walkcycle, thumb in assets/ui/
```

### `creature` (optional system)
```
label, icon, sheet, origin:{x,y}, walk:{start,end,frameRate}, moodIcon,  // moodIcon = particle shape of the floating mood indicator (default "heart")
youngLabel, adultLabel, variantLabel, customizeTitle, customizedMessage,
moodNeed: "joy",                       // the need that drives celebration & day-mood
moodFrom: ["food","energy","clean","joy"],   // needs averaged into the mood heart
moodDay: { base, lowPenalty, lowAt, highBonus, highAt },   // overnight mood rule
needs: [ { id, icon, start, perDay } ],      // perDay = overnight delta (0..100 bars)
variants: [ { id, name, color, tint? , sheet? } ],
actions: [ {
  id, label, icon,
  cost:{resource,amount}?, require:{need:min}?, effects:{need:+/-}?, reward?,
  anim?, stat?, message?, celebrateMessage?,
  type: "ride"|"jump"|"customize"?,   // special actions (omit for a normal care action)
} ],
customize: { rename, variant },
ride: { adultsOnly, minEnergy, fatigueNeed, sitY, nameY, onMount:{...}, *Message,
        jump:{ distance, cost, minEnergy, tooTired } },
celebrate: { mode:"hop"|"rear", adultsOnly, message, particle, colors:[hex], count },
```

### Theme-driven animations (`action.anim`)
The engine owns the animation **system**; the theme picks the **look** per action.
`anim` is either a legacy preset string (`"eat"`, `"cheer"`, `"sparkle"`) or an object:
```
anim: {
  motion: "nod" | "hop" | "bounce" | "none",   // body movement
  particle: "star" | "heart" | "spark" | "bubble" | "diamond" | "dot",  // built-in shapes
  colors: ["#fff2a8", "#ffd24a", ...],          // tints cycled across particles
  count, fall, spread, y0, riseMin, riseMax, scaleMin, scaleMax,        // all optional
}
```
Particle textures are generated procedurally (white, then tinted), so no assets are
needed. Example: `{ motion:"hop", particle:"star", colors:["#fff2a8","#a8e6ff"], count:7 }`
emits a burst of stars. `celebrate` (mood-maxed) and `moodIcon` use the same shapes.
```
aging: { adultAge, scaleBaby, scaleAdult },
breeding: { enabled, minMood, cooldown, message },
names: [...], startCount, startCreatures:[{name,variant}],
```
Omit `ride`/`breeding`/`aging`/`celebrate`/`customize` to disable those systems.

### `zones` / `stations`
```
zones: [ { id, home, rect:{x,y,w,h}, fence, gates:"both"|"left"|"right",
           gateA, gateB, tint, tintAlpha, label } ]   // home zone = where creatures roam
stations: [ { type, x, y, sprite, label, scale?, box?, action, actionLabel,
              onUse? } ]   // action: "nextDay" | "openShop" | "custom"
```

### `economy` / `shop` / `decor`
```
economy: { startCoins, startResources:{id:n}, startCapacity, dayReward }
shop: { title, resources:[{id,name,desc,icon,price,amount}], capacity:{name,price,boughtMessage},
        decorHeading, buyCreature:{price,heading,hint,label,boughtMessage}, fullMessage }
decor: [ { id, name, sprite, price, scale?, collision:{dx,dy,w,h}?, allowInHome? } ]
```

### `environment` (optional)
```
band,                                  // forest band thickness around the world
arena: { rect, tile, label, fence, obstacleSprite, obstacleScale, obstacleBox, obstacles:[{x,y}] },
forest: { tree, bush, step, hedgeMargin },
path: { width, sand, inset, tile, label, labelY,
        openings:[{x,y,w,h}], logs:{ xs:[...], dec, sprite, scale } },
```
See the **place-scatter** skill for the single-rule vegetation system.

### `objectives` / `help`
```
objectives: { extraStats:["ride","jump","trailVisit"],
              levels:[ { name, goals:[ { id, name, desc, check:(state)=>bool } ] } ] }
help: [ "html string", ... ]
```
`check` is a function receiving the full `state` (`state.coins`, `state.day`,
`state.creatures`, `state.stats`, `state.capacity`, `state.resources`, …).
Action `stat` ids are auto-tracked in `state.stats`; declare extra ones in `extraStats`.

## Making a new game
Use the **new-game** skill (interactive), or copy `game.config.js`, swap the assets,
and rewrite each section. Never edit `engine.js` for game content.
