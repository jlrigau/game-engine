#!/usr/bin/env node
/*
 * SVG → PNG renderer (headless Chromium via Playwright).
 * Turns vector art written as SVG strings into the PNG sprites / spritesheets /
 * backdrops a game loads. Chromium renders gradients, blur filters (glows) and
 * anti-aliasing far better than hand-drawn Pillow primitives.
 *
 * Usage:
 *   node .claude/skills/_shared/render-svg.cjs tools/art/mygame.cjs [--only key1,key2] [--root .]
 *     → the module exports `jobs` (array) or a function returning one (sync/async):
 *       [{ file: "assets/img/x.png", width, height, svg: "<svg …>…</svg>" }, …]
 *   node .claude/skills/_shared/render-svg.cjs --svg in.svg --out out.png --w 256 --h 256
 *
 * Transparent background (omitBackground). `file` is resolved against --root
 * (default: the current directory). Helpers to write the SVGs: svg-kit.cjs.
 */
const path = require("node:path");
const fs = require("node:fs");

function loadPlaywright() {
  for (const c of ["playwright", "/opt/node22/lib/node_modules/playwright"]) {
    try { return require(c); } catch (_) { /* next */ }
  }
  throw new Error("Playwright not found (npm i -g playwright).");
}
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };

(async () => {
  let jobs = [];
  if (arg("--svg")) {
    jobs = [{ file: arg("--out", "out.png"), width: +arg("--w", 256), height: +arg("--h", 256), svg: fs.readFileSync(arg("--svg"), "utf8") }];
  } else {
    const mod = process.argv[2];
    if (!mod) { console.error("usage: render-svg.cjs <art-module.cjs> [--only a,b]"); process.exit(1); }
    let m = require(path.resolve(mod));
    m = m.jobs || m.default || m;
    jobs = typeof m === "function" ? await m() : m;
  }
  const only = arg("--only", "");
  if (only) { const keys = only.split(","); jobs = jobs.filter((j) => keys.some((k) => j.file.includes(k))); }
  const root = path.resolve(arg("--root", "."));

  const pw = loadPlaywright();
  const browser = await pw.chromium.launch({ args: ["--ignore-certificate-errors"] });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const j of jobs) {
    await page.setViewportSize({ width: Math.ceil(j.width), height: Math.ceil(j.height) });
    await page.setContent(`<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent;overflow:hidden}svg{display:block}</style></head><body>${j.svg}</body></html>`);
    const out = path.resolve(root, j.file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: Math.ceil(j.width), height: Math.ceil(j.height) } });
    console.log("✓", path.relative(root, out), `${j.width}×${j.height}`);
  }
  await browser.close();
})().catch((e) => { console.error("render-svg failed:", e); process.exit(2); });
