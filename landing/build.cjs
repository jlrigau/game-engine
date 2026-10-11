#!/usr/bin/env node
/*
 * Builds the landing page in both languages from ONE source (landing/src/index.html):
 *   landing/index.html     English (default)
 *   landing/fr/index.html  French
 * Bilingual text in the source is written [[English||Français]] (may span lines).
 *   node landing/build.cjs
 */
const fs = require("node:fs"), path = require("node:path");
const dir = __dirname, src = fs.readFileSync(path.join(dir, "src/index.html"), "utf8");
const LANGS = [
  { lang: "en", out: "index.html", R: "../", H: "" },
  { lang: "fr", out: "fr/index.html", R: "../../", H: "../" },
];
for (const L of LANGS) {
  let html = src.replace(/<!--\s*SOURCE[\s\S]*?-->\n?/, "<!-- Generated from landing/src/index.html by landing/build.cjs — do not edit. -->\n");
  html = html.replace(/\[\[([\s\S]*?)\|\|([\s\S]*?)\]\]/g, (_, en, fr) => (L.lang === "en" ? en : fr));
  if (/\[\[|\]\]|\|\|/.test(html.replace(/<pre>[\s\S]*?<\/pre>/g, ""))) throw new Error(`unbalanced [[…||…]] marker left in ${L.out}`);
  html = html.replace(/\{\{LANG\}\}/g, L.lang).replace(/\{\{R\}\}/g, L.R).replace(/\{\{H\}\}/g, L.H)
    .replace(/\{\{ON_EN\}\}/g, L.lang === "en" ? "on" : "").replace(/\{\{ON_FR\}\}/g, L.lang === "fr" ? "on" : "");
  if (/\{\{\w+\}\}/.test(html)) throw new Error(`unknown {{placeholder}} left in ${L.out}`);
  const f = path.join(dir, L.out);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  console.log("✓", path.relative(process.cwd(), f));
}
require("./design.cjs");
