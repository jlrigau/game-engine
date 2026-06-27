# Asset credits

This engine ships a demo game ("Critter Cove"). Its assets come from two places.

## Generated (original, CC0)
- **Creatures** (`assets/sheet/critter.png`) — abstract "critter" companions, generated
  procedurally (Pillow). Recoloured at runtime by tint for each variant.
- **Icons** (`assets/favicon.png`, `assets/apple-touch-icon.png`) — generated.

These are original to this repo and dedicated to the public domain (**CC0**).

## Reused pixel-art (LPC — free, attribution required)
Environment, characters and fences reuse pixel-art from the **LPC (Liberated Pixel
Cup)** universe, free under **CC-BY / CC-BY-SA**. Attribution below is **required**.

| Asset (in the demo) | Source | Author(s) | License |
| --- | --- | --- | --- |
| Player characters (animated body) | [\[LPC\] Children walk animation](https://opengameart.org/content/lpc-children-walk-animation) | Nila122, kheftel, Makrohn | CC-BY-SA 3.0 / GPL 3.0 / OGA-BY 3.0 |
| Character clothes & hair | [\[LPC\] Clothes for children](https://opengameart.org/content/lpc-clothes-for-children) | Nila122 | CC-BY-SA 3.0 / GPL 3.0 / OGA-BY 3.0 |
| Ground (grass, dirt), trees, bushes | [LPC Base Assets](https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles) | Lanea Zimmerman (Sharm), Stephen Challener (Redshrike) and contributors | CC-BY-SA 3.0 / CC-BY 3.0 / GPL 3.0 |
| Buildings (cabins), water trough | [\[LPC\] Farm](https://opengameart.org/content/lpc-farm) | bluecarrot16, Wolthera van Hövell tot Westerflier (TheraHedwig), Ivan Voirol | CC-BY 4.0 |
| Fences, hedge/obstacle, logs | [\[LPC\] Medieval Village Decorations](https://opengameart.org/content/lpc-medieval-village-decorations) | bluecarrot16, Lanea Zimmerman (Sharm), Tuomo Untinen (Reemax) and contributors | CC-BY-SA 3.0 / CC-BY-SA 4.0 |

The sprites in `assets/img/` and `assets/ui/` are **crops** of the sheets above, with no
change of style. Spritesheets used at runtime live in `assets/sheet/`.

## Engine dependency
- **Phaser 3** (v3.80.1) is vendored at `vendor/phaser.min.js` — MIT license,
  © Phaser Studio / Richard Davey.
