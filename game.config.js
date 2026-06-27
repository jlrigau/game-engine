/* =========================================================
   GAME DEFINITION — "Critter Cove" (demo game)
   ---------------------------------------------------------
   This file is the ENTIRE game: data + assets references.
   The engine (engine.js) contains no game content; it reads
   this `window.GAME` object. Swap this file + assets to make
   a brand-new game from the same engine. See ENGINE.md.

   Theme: a cozy meadow sanctuary where you care for cute
   abstract "critters". Neutral demo — nothing tied to any
   specific real-world subject.
   ========================================================= */

window.GAME = {
  /* ---- Identity, theming, UI strings (all overridable) ---- */
  meta: {
    title: "Critter Cove",
    titleIcon: "🐾",
    shortName: "Critters",
    tagline: "Care for your cute critters in a cozy meadow!",
    saveKey: "critter-cove",
    audience: { minAge: 6, notes: "all-ages, gentle, cute, no violence" },
    assetVersion: "v1",
    theme: { home: "#ffce8f", play: "#5a8f4f" },
    coinIcon: "💰",
    namePrompt: { label: "Name your sanctuary:", placeholder: "Meadow Haven" },
    startName: "My Sanctuary",
    namePromptYou: "Your name",
    avatarPrompt: "Pick your character",
    createTitle: "🎨 Choose your character",
    createOkLabel: "✅ Let's go!",
    startLabel: "▶ New game",
    continueLabel: "📂 Continue",
    continueHint: "A saved game exists: tap “Continue”. 🐾",
    helpTitle: "❓ How to play",
    ageUnit: "d", and: "and",
    nightMessage: "🌙 Night falls…",
    restBlockedHint: "You just woke up! Take care of a critter first. 🐾",
    neglectMessage: "🌅 Day {day}. Take care of {names}!",
    morningMessage: "🌅 Day {day}: everyone slept well. 🐾 (+5 💰)",
    notEnough: "Not enough 💰!",
    idleHint: "Walk around 🚶 and approach a critter or a building to act.",
    placeHint: "Walk anywhere, then place {item}.",
    placeHere: "Place here", cancel: "Cancel",
    boughtDecorMessage: "{name} bought! Walk around and tap “✅ Place here”.",
    placedMessage: "{name} placed! ✨",
    refundMessage: "Placement cancelled, you're refunded. 💰",
    noOnBuilding: "🏠 Not on a building!",
    noInHome: "🐾 Trees and bushes get in the critters' way in the pen!",
    nameLabel: "Name:", confirm: "Confirm",
    nameTaken: "Another critter is already called {name}! Pick another name.",
  },

  /* ---- World ---- */
  world: {
    width: 2800, height: 2100, groundTile: "grass", bg: "#6fae4f",
    // dirt paths in front of the buildings
    patches: [
      { x: 370, y: 775, w: 200, h: 620, tile: "dirt", ox: 0.5, oy: 0.5 },
      { x: 370, y: 860, w: 430, h: 200, tile: "dirt", ox: 0, oy: 0.5 },
    ],
  },
  camera: { fitW: 780, fitH: 820, min: 0.5, max: 0.9 },

  /* ---- Assets ---- */
  assets: {
    images: {
      grass: "assets/img/grass.png", dirt: "assets/img/dirt.png",
      tree: "assets/img/tree.png", bush: "assets/img/bush.png",
      water: "assets/img/water.png", house: "assets/img/house.png",
      shop: "assets/img/shop.png", hedge: "assets/img/hedge.png",
      logs: "assets/img/logs.png",
    },
    sheets: {
      char_a: { path: "assets/sheet/char_a.png", frameWidth: 64, frameHeight: 64 },
      char_b: { path: "assets/sheet/char_b.png", frameWidth: 64, frameHeight: 64 },
      critter: { path: "assets/sheet/critter.png", frameWidth: 64, frameHeight: 64 },
      fence: { path: "assets/sheet/fence.png", frameWidth: 32, frameHeight: 32 },
    },
  },
  fence: { sheet: "fence", frames: { post: 1, side: 17, cornerTL: 32, cornerTR: 34 } },

  /* ---- Player ---- */
  player: {
    scale: 1.7,
    speed: { walk: 200, run: 370, rideWalk: 340, rideRun: 560 },
    spawn: { x: 560, y: 860 },
  },
  characters: [
    { id: "a", name: "Robin", sheet: "char_a", thumb: "char_a_thumb" },
    { id: "b", name: "Sam", sheet: "char_b", thumb: "char_b_thumb" },
  ],

  /* ---- Creature system ---- */
  creature: {
    label: "critters", icon: "🐾",
    sheet: "critter",
    origin: { x: 0.5, y: 0.78 },
    walk: { start: 0, end: 3, frameRate: 6 },
    youngLabel: "🐣 Baby", adultLabel: "Grown", ageUnit: "d",
    variantLabel: "Colour", customizeTitle: "🎨 Style",
    customizedMessage: "{name} got a new look! 🎨",
    moodNeed: "joy",
    moodFrom: ["food", "energy", "clean", "joy"],
    moodDay: { base: -12, lowPenalty: -10, lowAt: 25, highBonus: 8, highAt: 60 },
    needs: [
      { id: "food", icon: "🍎", start: 70, perDay: -25 },
      { id: "energy", icon: "⚡", start: 80, perDay: 40 },
      { id: "clean", icon: "🫧", start: 75, perDay: -16 },
      { id: "joy", icon: "😊", start: 80 },
    ],
    variants: [
      { id: "sun", name: "Sunny", color: "#f4cd57", tint: "#f4cd57" },
      { id: "sky", name: "Sky", color: "#6fb7e8", tint: "#6fb7e8" },
      { id: "mint", name: "Mint", color: "#8fd4a0", tint: "#8fd4a0" },
      { id: "rose", name: "Rosy", color: "#f0a0c0", tint: "#f0a0c0" },
      { id: "plum", name: "Plum", color: "#b79be0", tint: "#b79be0" },
    ],
    actions: [
      { id: "feed", label: "Feed", icon: "🍎", cost: { resource: "food", amount: 1 },
        effects: { food: 35, joy: 6 }, reward: 2, anim: "eat", stat: "feed",
        message: "{name} had a tasty snack! 🍎", outOfStock: "🍎 Out of food! Visit the shop." },
      { id: "clean", label: "Clean", icon: "🫧",
        effects: { clean: 40, joy: 12 }, reward: 2, anim: "sparkle", stat: "clean",
        message: "{name} is sparkly clean! ✨" },
      { id: "play", label: "Play", icon: "🎾", require: { energy: 15 },
        effects: { joy: 22, energy: -16, food: -8 }, reward: 3, anim: "cheer", stat: "play",
        message: "{name} had fun! 🎾", celebrateMessage: "{name} is overjoyed and bounces with glee! 🎉",
        tooLow: "{name} is too tired to play. 😴" },
      { id: "ride", type: "ride", label: "Ride", icon: "🛹", dismountLabel: "Get off" },
      { id: "jump", type: "jump", label: "Hop", icon: "🦘" },
      { id: "style", type: "customize", label: "Style", icon: "🎨" },
    ],
    customize: { rename: true, variant: true },
    ride: {
      adultsOnly: true, minEnergy: 20, fatigueNeed: "energy",
      sitY: -58, nameY: -138, onMount: { joy: 12, energy: -6 },
      mountMessage: "Hop on {name}! 🐾", dismountMessage: "You hop off {name}. 🙂",
      exhaustedMessage: "{name} is worn out, let it rest! 😴",
      tooYoung: "{name} is a baby, too small to ride. 🐣",
      tooTired: "{name} is too tired to carry you. 😴",
      jump: { distance: 165, cost: 8, minEnergy: 10, tooTired: "{name} is too tired to hop! 😴" },
    },
    celebrate: { mode: "hop", adultsOnly: true },
    aging: { adultAge: 5, scaleBaby: 0.6, scaleAdult: 1.0 },
    breeding: { enabled: true, minMood: 80, cooldown: 3, message: "🐣 Good news! A baby critter was born: {name}! 💕" },
    names: ["Pip", "Bibo", "Mango", "Pixel", "Coco", "Bloop", "Tato", "Nimbus", "Pebble", "Fizz", "Momo", "Yuzu"],
    startCount: 1,
    startCreatures: [{ name: "Pip", variant: "sun" }],
  },

  /* ---- Zones (the pen where critters roam) ---- */
  zones: [
    { id: "pen", home: true, rect: { x: 800, y: 480, w: 820, h: 760 },
      fence: true, gates: "both", gateA: 0.34, gateB: 0.66,
      tint: "#86c25a", tintAlpha: 0.55, label: "Pen" },
  ],

  /* ---- Stations (buildings) ---- */
  stations: [
    { type: "lodge", x: 450, y: 540, sprite: "house", label: "Lodge", action: "nextDay", actionLabel: "🌙 Rest (next day)" },
    { type: "shop", x: 450, y: 1010, sprite: "shop", label: "Shop", action: "openShop", actionLabel: "🛒 Enter the shop" },
  ],

  /* ---- Economy & shop ---- */
  economy: { startCoins: 40, startResources: { food: 6 }, startCapacity: 4, dayReward: 5 },
  shop: {
    title: "🛒 Shop",
    resources: [
      { id: "food", name: "Food crate", desc: "To feed your critters.", icon: "🍎", price: 4, amount: 1 },
    ],
    capacity: { name: "🏚️ Bigger pen (+1)", price: 80, boughtMessage: "🏚️ Pen expanded!" },
    decorHeading: "🎨 Decorations",
    buyCreature: { price: 45, heading: "🐾 Adopt a critter", hint: "Adopt one, then style it with 🎨 in the pen.",
      label: "🛒 Adopt a critter", boughtMessage: "Welcome, {name}! 🎉 Style it in the pen." },
    fullMessage: "Your pen is full! Expand it first.",
  },

  /* ---- Buyable decorations ---- */
  decor: [
    { id: "tree", name: "Pine", sprite: "tree", price: 28, collision: { dx: -16, dy: -22, w: 32, h: 24 } },
    { id: "bush", name: "Bush", sprite: "bush", price: 16, collision: { dx: -28, dy: -16, w: 56, h: 20 } },
    { id: "water", name: "Water trough", sprite: "water", price: 20, allowInHome: true },
  ],

  /* ---- Environment: arena + trail loop in a forest band ---- */
  environment: {
    band: 440,
    arena: {
      rect: { x: 1700, y: 540, w: 620, h: 640 }, tile: "dirt", label: "Arena", fence: true,
      obstacleSprite: "hedge", obstacleScale: 1.0,
      obstacleBox: { dx: -33, dy: -18, w: 66, h: 30 },
      obstacles: [
        { x: 1830, y: 770 }, { x: 2020, y: 770 }, { x: 2210, y: 770 },
        { x: 1830, y: 980 }, { x: 2020, y: 980 }, { x: 2210, y: 980 },
      ],
    },
    forest: { tree: "tree", bush: "bush", step: 44, hedgeMargin: 80 },
    path: {
      width: 240, sand: 46, inset: 90, tile: "dirt", label: "Trail course", labelY: 300,
      openings: [
        { x: 200, y: 1320, w: 430, h: 220 },
        { x: 2170, y: 1320, w: 430, h: 220 },
      ],
      logs: { xs: [520, 820, 1120, 1700, 2000, 2300], dec: 14, sprite: "logs", scale: 1.3 },
    },
  },

  /* ---- Interior scenery: [x, y, sprite, scale] ---- */
  scenery: [
    [700, 1240, "bush", 1.4], [950, 1260, "tree", 1.7], [1480, 1240, "tree", 1.7],
    [1720, 1260, "bush", 1.4], [1980, 1240, "tree", 1.7], [2240, 1260, "bush", 1.4], [2440, 1250, "tree", 1.7],
  ],

  /* ---- Objectives (gamification by levels) ---- */
  objectives: {
    extraStats: ["trailVisit", "ride", "jump"],
    levels: [
      { name: "Beginner", goals: [
        { id: "feed1", name: "First snack", desc: "Feed a critter", check: (s) => s.stats.feed >= 1 },
        { id: "clean1", name: "All clean", desc: "Clean a critter", check: (s) => s.stats.clean >= 1 },
        { id: "play1", name: "Playtime", desc: "Play with a critter", check: (s) => s.stats.play >= 1 },
        { id: "decor1", name: "Decorator", desc: "Place a decoration", check: (s) => s.stats.decor >= 1 },
      ] },
      { name: "Rider", goals: [
        { id: "ride1", name: "Hop on!", desc: "Ride a critter", check: (s) => s.stats.ride >= 1 },
        { id: "trail", name: "On the trail", desc: "Step onto the trail course", check: (s) => s.stats.trailVisit >= 1 },
        { id: "jump1", name: "Over the hedge", desc: "Hop over an obstacle", check: (s) => s.stats.jump >= 1 },
        { id: "happy", name: "Very happy", desc: "A critter at max joy", check: (s) => s.creatures.some((c) => c.joy >= 100) },
      ] },
      { name: "Keeper", goals: [
        { id: "herd3", name: "Three critters", desc: "Have 3 critters", check: (s) => s.creatures.length >= 3 },
        { id: "family", name: "A baby!", desc: "A baby is born", check: (s) => s.stats.births >= 1 },
        { id: "jump5", name: "Trail pro", desc: "Hop 5 obstacles", check: (s) => s.stats.jump >= 5 },
        { id: "rich150", name: "Small fortune", desc: "Reach 150 coins", check: (s) => s.coins >= 150 },
      ] },
      { name: "Champion", goals: [
        { id: "jump15", name: "Hop king", desc: "Hop 15 obstacles", check: (s) => s.stats.jump >= 15 },
        { id: "herd5", name: "Big sanctuary", desc: "Have 5 critters", check: (s) => s.creatures.length >= 5 },
        { id: "twoBabies", name: "Big family", desc: "Two babies born", check: (s) => s.stats.births >= 2 },
        { id: "rich300", name: "Great fortune", desc: "Reach 300 coins", check: (s) => s.coins >= 300 },
      ] },
    ],
  },

  /* ---- Help screen ---- */
  help: [
    "<b>Welcome to your critter sanctuary!</b>",
    "<b>🚶 Move:</b> tap where you want to go (your character walks there). You can also tap a critter or a building directly. (Keyboard: arrows or WASD/ZQSD.)",
    "<b>🐾 A critter:</b> approach it, then 🍎 Feed, 🫧 Clean, 🎾 Play, 🛹 Ride, or 🎨 Style (colour, name). Keep its needs in the green!",
    "<b>🛹 Ride:</b> hop on and stroll around. Tap “Get off” to stop. On the trail, tap 🦘 Hop to clear obstacles.",
    "<b>🏪 Shop:</b> food, decorations, adopt new critters. After buying a decoration, walk anywhere then tap “✅ Place here”.",
    "<b>🏡 Lodge:</b> rest to reach the next day (take care of a critter first). <b>🧍 (top):</b> change your character.",
    "💰 You earn coins by caring for your critters. 💾 The game saves automatically.",
  ],
};
