#!/usr/bin/env node
/*
 * ios-standalone-check — reproduces the iOS home-screen ("standalone") viewport bug in
 * WebKit and checks that the layout reaches the REAL bottom of the screen.
 *
 *   node .claude/skills/_shared/ios-standalone-check.cjs [port]   (serve.sh first)
 *
 * Bug: launched from the home screen with a black-translucent status bar, iOS reports a
 * viewport shorter than the screen by the status-bar height (59 pt on Dynamic Island
 * phones) → 100dvh / position:fixed inset:0 stop short and a plain band shows at the
 * bottom. The engine measures the gap (--vp-gap) and engine.css stretches the layers.
 * Simulation: 390×785 viewport + navigator.standalone + screen 390×844. Every value
 * printed must be 844 (sheet/panel: 844 minus their margin), same as the normal run.
 */
const pw = (() => { for (const c of ["playwright", "/opt/node22/lib/node_modules/playwright"]) { try { return require(c); } catch (_) {} } throw new Error("Playwright not found"); })();
(async () => {
  const port = process.argv[2] || 8099;
  const b = await pw.webkit.launch();
  for (const standalone of [true, false]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: standalone ? 785 : 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    if (standalone) await ctx.addInitScript(() => {
      Object.defineProperty(navigator, "standalone", { get: () => true });
      Object.defineProperty(screen, "height", { get: () => 844 }); Object.defineProperty(screen, "width", { get: () => 390 });
    });
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(`http://localhost:${port}/index.html`); await p.waitForTimeout(800);
    const r = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const q = e.getBoundingClientRect(); return Math.round(q.bottom); }, sel);
    const out = { standalone, gap: await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--vp-gap")), home: await r("#screen-home"), sheet: await r(".home-sheet") };
    await p.evaluate(() => { const b = document.querySelector("#btn-new, .btn-giant"); b && b.click(); });
    await p.waitForTimeout(600);
    await p.evaluate(() => { const b = [...document.querySelectorAll("#screen-create .btn-giant, #screen-create .btn-primary")].pop(); b && b.click(); });
    await p.waitForTimeout(2500);
    Object.assign(out, { game: await r("#screen-game"), canvas: await r("#world canvas"), panel: await r(".panel:not(.hidden)"), errs });
    console.log(JSON.stringify(out));
    await ctx.close();
  }
  await b.close();
})();
