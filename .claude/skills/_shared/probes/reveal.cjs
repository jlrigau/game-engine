/*
 * reveal — films short animations so their QUALITY can be judged (a flicker or a pop
 * is invisible in a single screenshot), and checks the close-up HUD at its worst case.
 *   1. unlock reveal: centres the camera on the first unlock, triggers it, screenshots
 *      a frame every 80 ms → reveal-00..NN.png (+ reveal-strip.png if Python/PIL).
 *   2. close-up at the MAX spot count: the progress bar must not overlap the close
 *      button (asserted with bounding boxes) → closeup-max.png.
 *   [REVEAL=<unlock id>] OUT=/tmp/rev node .claude/skills/_shared/playtest.cjs --viewport 390x844 \
 *       --probe .claude/skills/_shared/probes/reveal.cjs
 */
const { wait, shot } = require("./lib.cjs");

module.exports = async (page) => {
  const r = { errors: [] };
  const check = (ok, msg) => { if (!ok) r.errors.push(msg); };
  await page.waitForFunction(() => typeof sc !== "undefined" && sc && player, { timeout: 15000 });
  await wait(page, 800);

  // 1. unlock reveal filmstrip
  const u = await page.evaluate((want) => {
    const list = GAME.unlocks || [];
    const ok = (x) => x.when && x.when.stat;
    let i = want ? list.findIndex((x) => x.id === want) : -1;            // REVEAL=<unlock id>
    if (i < 0) i = list.findIndex((x) => ok(x) && !(x.scenery || x).ground && (x.scenery || x).anim);
    if (i < 0) i = list.findIndex(ok);
    if (i < 0) return null;
    const x = list[i], s = x.scenery || x;
    const cam = sc.cameras.main; cam.stopFollow(); cam.centerOn(s.x, s.y - 40);
    state.stats[x.when.stat] = Math.max(state.stats[x.when.stat] || 0, x.when.atLeast);
    checkUnlocks();
    cam.preRender && cam.preRender();
    const z = cam.zoom, sx = (s.x - cam.worldView.x) * z, sy = (s.y - cam.worldView.y) * z;
    const rc = document.querySelector("#world canvas").getBoundingClientRect();
    return { id: x.id || "u" + i, sprite: s.sprite, screen: [Math.round(rc.left + sx), Math.round(rc.top + sy)] };
  }, process.env.REVEAL || "");
  if (u) {
    r.revealed = u;
    for (let k = 0; k < 24; k++) { await shot(page, "reveal-" + String(k).padStart(2, "0")); await wait(page, 80); }
    await wait(page, 1500); await shot(page, "reveal-end");
  }

  // 2. close-up at max spots: progress bar vs close button
  const opened = await page.evaluate(() => {
    const acts = (GAME.creature && GAME.creature.actions) || [];
    const a = acts.find((x) => x.type === "closeup"); const c = state.creatures && state.creatures[0];
    if (!a || !c) return false;
    if (a.stat) state.stats[a.stat] = 999;
    openCloseup(c, a); return true;
  });
  if (opened) {
    await wait(page, 900);
    const box = await page.evaluate(() => {
      const b = (id) => { const e = document.getElementById(id) || document.querySelector("." + id); if (!e) return null; const q = e.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom]; };
      return { prog: b("cu-progress"), close: b("closeup-close"), stars: document.querySelectorAll("#cu-progress i").length };
    });
    r.closeup = box;
    if (box.prog && box.close) check(box.prog[2] <= box.close[0] - 4 || box.prog[3] <= box.close[1], `close-up progress bar (${box.stars} stars) overlaps the close button`);
    await shot(page, "closeup-max");
  }
  return r;
};
