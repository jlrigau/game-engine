/* =========================================================
   GAME DEFINITION — "Nebula Nursery" (demo game)
   ---------------------------------------------------------
   This file is the ENTIRE game: data + asset references.
   The engine (engine.js) contains no game content; it reads
   this `window.GAME` object. Swap this file + assets to make
   a brand-new game from the same engine.

   This demo is deliberately MINIMAL — a clean starting point.
   The engine supports much more (variants, customization,
   riding, breeding, shop/economy, decorations, objectives,
   trail loops…); you add those by ITERATING on this config.
   See ENGINE.md for the full schema and capabilities.

   Theme: a tiny space nursery where a keeper robot looks
   after glowing alien critters. All textures are generated
   and specific to this universe (CC0).
   ========================================================= */

window.GAME = {
  /* ---- Identity, theming, UI strings ---- */
  meta: {
    title: "Nebula Nursery",
    titleIcon: "👾",
    shortName: "Nebula",
    tagline: "Look after the little glowing critters!",
    saveKey: "nebula-nursery",
    audience: { minAge: 6, notes: "all-ages, gentle, cute, no violence" },
    assetVersion: "v2",
    theme: { home: "#171036", play: "#0e1430" },
    showCoins: false,                 // minimal demo: no economy
    namePrompt: { label: "Name your nursery:", placeholder: "Starlight Bay" },
    startName: "My Nursery",
    namePromptYou: "Your name",
    avatarPrompt: "Pick your keeper",
    createTitle: "🤖 Choose your keeper",
    createOkLabel: "✅ Let's go!",
    startLabel: "▶ New game",
    continueLabel: "📂 Continue",
    continueHint: "A saved game exists: tap “Continue”. 👾",
    helpTitle: "❓ How to play",
    ageUnit: "", and: "and",
    nightMessage: "🌙 The lights dim…",
    restBlockedHint: "You just woke up! Look after a critter first. 👾",
    neglectMessage: "🌅 Cycle {day}. Look after {names}!",
    morningMessage: "🌅 Cycle {day}: everyone rested well. ✨",
    idleHint: "Move around 🚀 and approach a critter to look after it.",
  },

  /* ---- World ---- */
  world: {
    width: 1800, height: 1300, groundTile: "ground", bg: "#0e1430",
    patches: [
      { x: 300, y: 560, w: 320, h: 150, tile: "energy", ox: 0.5, oy: 0.5 },  // path to the pen gate
    ],
  },
  camera: { fitW: 720, fitH: 760, min: 0.5, max: 1.0 },

  /* ---- Assets (all generated, CC0) ---- */
  assets: {
    images: {
      ground: "assets/img/ground.png", energy: "assets/img/energy.png",
      crystal: "assets/img/crystal.png", alienplant: "assets/img/alienplant.png",
      pod_rest: "assets/img/pod_rest.png",
    },
    sheets: {
      keeper: { path: "assets/sheet/keeper.png", frameWidth: 64, frameHeight: 64 },
      keeper_amber: { path: "assets/sheet/keeper_amber.png", frameWidth: 64, frameHeight: 64 },
      critter: { path: "assets/sheet/critter.png", frameWidth: 64, frameHeight: 64 },
      fence: { path: "assets/sheet/fence.png", frameWidth: 32, frameHeight: 32 },
    },
  },
  fence: { sheet: "fence", frames: { post: 0, side: 0, cornerTL: 2, cornerTR: 2 } },

  /* ---- Player (the keeper robot) ---- */
  player: {
    scale: 1.7,
    speed: { walk: 210, run: 380 },
    spawn: { x: 440, y: 660 },
  },
  characters: [
    { id: "aqua", name: "Bolt", sheet: "keeper", thumb: "keeper_thumb" },
    { id: "amber", name: "Sol", sheet: "keeper_amber", thumb: "keeper_amber_thumb" },
  ],

  /* ---- Creature system (minimal: 2 needs, 2 care actions) ---- */
  creature: {
    label: "critters", icon: "👾",
    sheet: "critter",
    scale: 1.0,
    origin: { x: 0.5, y: 0.78 },
    walk: { start: 0, end: 3, frameRate: 6 },
    moodNeed: "joy",
    moodFrom: ["fuel", "joy"],
    moodDay: { base: -8, lowPenalty: -8, lowAt: 25, highBonus: 6, highAt: 60 },
    needs: [
      { id: "fuel", icon: "🔋", start: 70, perDay: -22 },
      { id: "joy", icon: "😊", start: 80 },
    ],
    actions: [
      { id: "feed", label: "Feed", icon: "🔋",
        effects: { fuel: 35, joy: 8 }, stat: "feed",
        // themed particles: little cyan energy sparks float up as it recharges
        anim: { motion: "nod", particle: "spark", colors: ["#9fe8ff", "#6fb7e8", "#ffffff"], count: 6, y0: 38 },
        message: "{name} recharged happily! 🔋" },
      { id: "play", label: "Play", icon: "🎮",
        effects: { joy: 22, fuel: -6 }, stat: "play",
        // themed particles: a burst of STARS instead of hearts
        anim: { motion: "hop", particle: "star", colors: ["#fff2a8", "#ffd24a", "#a8e6ff", "#ff5db1"], count: 7 },
        message: "{name} had fun! 🎮", celebrateMessage: "{name} glows with joy! ✨" },
    ],
    celebrate: { mode: "hop", particle: "star", colors: ["#fff2a8", "#ffd24a", "#a8e6ff"], count: 7 },
    names: ["Zib", "Quor", "Lumi", "Vex", "Orbit", "Pulse", "Nova", "Echo", "Bly", "Pixl"],
    startCount: 3,
    startCreatures: [{ name: "Zib" }, { name: "Lumi" }, { name: "Pulse" }],
  },

  /* ---- Zone (the nursery pen where critters roam) ---- */
  zones: [
    { id: "pen", home: true, rect: { x: 520, y: 340, w: 780, h: 640 },
      fence: true, gates: "left", gateA: 0.38, gateB: 0.62,
      tint: "#1d3a52", tintAlpha: 0.4, label: "Nursery" },
  ],

  /* ---- One station: the recharge pod (rest → next cycle) ---- */
  stations: [
    { type: "rest", x: 300, y: 560, sprite: "pod_rest", scale: 1.0, label: "Recharge Pod",
      box: { dx: -52, dy: -50, w: 104, h: 66 }, action: "nextDay", actionLabel: "🌙 Rest (next cycle)" },
  ],

  /* ---- A little ambient scenery (crystals & alien plants) ---- */
  scenery: [
    [200, 320, "crystal", 1.3, { dx: -14, dy: -10, w: 28, h: 16 }],
    [220, 900, "alienplant", 1.2, false],
    [1480, 360, "crystal", 1.5, { dx: -16, dy: -12, w: 32, h: 18 }],
    [1560, 820, "alienplant", 1.3, false],
    [1400, 1080, "crystal", 1.2, { dx: -14, dy: -10, w: 28, h: 16 }],
    [560, 1120, "alienplant", 1.2, false],
    [980, 1140, "crystal", 1.1, { dx: -12, dy: -10, w: 24, h: 14 }],
  ],

  /* ---- Objectives (kept minimal: one level, a few simple goals) ---- */
  objectives: {
    levels: [
      { name: "Caretaker", goals: [
        { id: "feed1", name: "First charge", desc: "Feed a critter", check: (s) => s.stats.feed >= 1 },
        { id: "play1", name: "Playtime", desc: "Play with a critter", check: (s) => s.stats.play >= 1 },
        { id: "happy", name: "All aglow", desc: "Make a critter fully happy", check: (s) => s.creatures.some((c) => c.joy >= 100) },
      ] },
    ],
  },

  /* ---- Help screen ---- */
  help: [
    "<b>Welcome to your space nursery!</b>",
    "<b>🚀 Move:</b> tap where you want to go (your keeper floats there). You can also tap a critter directly. (Keyboard: arrows or WASD/ZQSD.)",
    "<b>👾 A critter:</b> float up to it, then 🔋 Feed or 🎮 Play. Keep its mood in the green!",
    "<b>🌙 Recharge Pod:</b> rest to reach the next cycle (look after a critter first).",
    "<b>🤖 (top):</b> change your keeper. 💾 The game saves automatically.",
  ],
};
