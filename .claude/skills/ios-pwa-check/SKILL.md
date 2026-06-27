---
name: ios-pwa-check
description: Check and fix the mobile / PWA layout of a game built on this engine on iPhone (safe areas, fullscreen, status bar, bottom panel, background, home-screen icon). Use for any iOS display problem: top/bottom band or margin, panel overflowing, home shortcut. Triggers: "it overflows on iPhone", "band at the top/bottom", "the panel takes too much room", "the icon name", "fullscreen".
---

# ios-pwa-check

Keep the iPhone layout clean (fullscreen, no band, safe areas).

## Points to respect
- **`index.html`**: `meta viewport ... viewport-fit=cover`, `theme-color`,
  `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`,
  `apple-mobile-web-app-title` (**short**, else truncated), `link rel="manifest"`,
  no-cache metas.
- **`manifest.webmanifest`**: `name`, short `short_name`, `display: standalone`,
  `background_color`, `theme_color`, `icons` (180 + 512).
- **`style.css`**:
  - `html, body` fullscreen; **soft background** with no dark band
    (`background-attachment: fixed`).
  - `#screen-game { position: fixed; inset: 0; }` → covers the whole screen.
  - `.panel` (bottom) `position: fixed; bottom: 0` +
    `padding-bottom: calc(... + env(safe-area-inset-bottom))`, compact.
  - `.top-bar`: `padding-top: calc(... + env(safe-area-inset-top))` (notch).
  - `100dvh` (not just `vh`) for the screens.

## Procedure
1. Reproduce in **screenshots** at iPhone size (Playwright viewport ~390×844,
   `deviceScaleFactor: 2`) via `playtest.cjs --shots` / a probe, then **Read** the PNGs.
2. Fix in `index.html` / `style.css` / `manifest.webmanifest` per the list.
3. **Re-test** visually (panel stuck to the bottom, no band, clean top).
4. **iOS note**: a home-screen shortcut **freezes its name** when added → to update it,
   delete and re-add it (tell the user).
5. **Publish**: **release-deploy** (bump `vN` — css/html changed).

## Guard-rails
- Test a **real phone template** (not just desktop).
- Don't reintroduce the "overflow band" (body background showing): `#screen-game` fixed
  + `.panel` fixed.
- Cache-busting is essential (else iOS keeps the old CSS).

## Chaining
**ios-pwa-check** → release-deploy.
