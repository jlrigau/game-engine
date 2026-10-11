/*
 * Brand art of the ENGINE itself — "Ludea" (ludus + idea) — NOT game content.
 * Used by the landing page and the design system (landing/design/). One source of truth:
 *   mark()        the logo symbol: a speech bubble (you describe) holding a play button
 *                 (it becomes a game) with a spark (the idea)
 *   guide(pose)   "Lu", the guide character = the same bubble with a face (never drift apart)
 *   icon(name)    the brand's own illustrated icon set (icon-kit style, Ludea palette)
 * Render: node .claude/skills/_shared/render-svg.cjs tools/art/brand.cjs
 * (icons, mark and guide poses come out as WebP; app icons and favicon as PNG).
 */
const K = require("../../.claude/skills/_shared/svg-kit.cjs");
const IK = require("../../.claude/skills/_shared/icon-kit.cjs");

// ---- Design tokens (mirrored in landing/landing.css :root) ----
const C = {
  ink: "#1d1b3a", paper: "#fffaf3", sand: "#f6efe5",
  coral: "#ff5b4f", tangerine: "#ff8a3d", sun: "#ffbe2e", mint: "#19c39a", sky: "#3c8dff", lilac: "#8a6cff", rose: "#ff7aa8",
};

// The bubble outline in a 128 box (tail bottom-left).
const BUBBLE = "M40 12 H88 Q118 12 118 42 V68 Q118 98 88 98 H56 L30 116 Q24 120 26 112 L31 97 Q10 92 10 68 V42 Q10 12 40 12 Z";
const PLAY = "M53 37 L83 55 L53 73 Z";

function mark(id = "lm", o = {}) {
  const defs = K.lin(`${id}g`, [[0, C.tangerine], [1, C.coral]], 0, 0, 0.4, 1);
  const spark = K.star(105, 17, 17, 5.5, 4);
  return { defs, body: `<path d="${BUBBLE}" fill="${o.mono || `url(#${id}g)`}"/>
    <path d="${PLAY}" fill="${o.mono ? C.paper : "#fff"}" stroke="${o.mono ? C.paper : "#fff"}" stroke-width="9" stroke-linejoin="round"/>
    <path d="${spark}" fill="${C.sun}" stroke="${o.ring || C.paper}" stroke-width="4.5" stroke-linejoin="round"/>` };
}

// "Lu", the guide: the logo bubble with a face. 400×400 box. pose: hello | point | idea
function guide(pose = "hello", id = "lu") {
  const ink = C.ink, W = 7;
  const defs = K.lin(`${id}g`, [[0, C.tangerine], [1, C.coral]], 0, 0, 0.4, 1) + K.rad(`${id}c`, [[0, "#fff", 0.35], [1, "#fff", 0]], 0.3, 0.2, 0.6);
  const s = 2.6, ox = 200 - 64 * s, oy = 30;
  const body = `<g transform="translate(${ox},${oy}) scale(${s})"><path d="${BUBBLE}" fill="url(#${id}g)" stroke="${ink}" stroke-width="${W / s}" stroke-linejoin="round"/>
    <path d="${BUBBLE}" fill="url(#${id}c)"/></g>`;
  const cx = 200, ey = 158;
  const eye = (x) => `<ellipse cx="${x}" cy="${ey}" rx="25" ry="29" fill="#fff" stroke="${ink}" stroke-width="5"/><circle cx="${x + 4}" cy="${ey + 5}" r="14" fill="${ink}"/><circle cx="${x + 9}" cy="${ey - 2}" r="5.5" fill="#fff"/>`;
  const face = `${eye(cx - 40)}${eye(cx + 40)}
    <ellipse cx="${cx - 82}" cy="${ey + 38}" rx="16" ry="9" fill="#ff2f6a" opacity=".35"/><ellipse cx="${cx + 82}" cy="${ey + 38}" rx="16" ry="9" fill="#ff2f6a" opacity=".35"/>
    <path d="M${cx - 24},${ey + 40} Q${cx},${ey + 70} ${cx + 24},${ey + 40} Z" fill="#7a1f33" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M${cx - 11},${ey + 54} Q${cx},${ey + 47} ${cx + 11},${ey + 54} Q${cx},${ey + 63} ${cx - 11},${ey + 54} Z" fill="#ff8fa0"/>`;
  const arm = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="${W + 18}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.coral}" stroke-width="18" stroke-linecap="round"/>`;
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="17" fill="${C.tangerine}" stroke="${ink}" stroke-width="${W}"/>`;
  const sp = (x, y, R) => `<path d="${K.star(x, y, R, R * 0.32, 4)}" fill="${C.sun}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>`;
  let arms = "", extra = "";
  if (pose === "hello") { arms = arm("M80,196 Q26,166 34,112") + hand(34, 108) + arm("M322,214 Q374,236 354,272") + hand(352, 274); extra = sp(338, 52, 34) + sp(372, 112, 14); }
  if (pose === "point") { arms = arm("M80,214 Q30,236 44,270") + hand(44, 272) + arm("M322,178 Q372,176 376,148") + hand(376, 144); extra = sp(330, 50, 30); }
  if (pose === "idea") { arms = arm("M80,190 Q22,164 28,108") + hand(28, 104) + arm("M320,190 Q378,164 372,108") + hand(372, 104); extra = sp(200, 34, 26) + sp(132, 40, 11) + sp(270, 42, 12); }
  return { defs, body: `<ellipse cx="200" cy="384" rx="110" ry="12" fill="${ink}" opacity=".12"/>${arms}${body}${face}${extra}` };
}

// ---- Brand icon set (128 box): icon-kit core icons in the Ludea palette + our own ----
const P = Object.assign({}, IK.DEF, { ink: C.ink, gold: C.sun, pink: C.rose, blue: C.sky, green: C.mint, red: C.coral, purple: C.lilac, teal: C.mint, orange: C.tangerine });
const st = (w) => IK.st(P, w);
const OWN = {
  pad: () => { const [d, f] = IK.fill(C.sky); const g = IK.glossy("M30 40 H98 Q120 40 122 66 Q124 98 106 102 Q94 104 86 88 H42 Q34 104 22 102 Q4 98 6 66 Q8 40 30 40 Z", f, P, "M28 52 H52");
    return { defs: d + g.defs, body: g.body + `<path d="M38 56 V80 M26 68 H50" stroke="#fff" stroke-width="9" stroke-linecap="round"/><circle cx="92" cy="60" r="7" fill="${C.sun}" ${st(4)}/><circle cx="104" cy="74" r="7" fill="${C.coral}" ${st(4)}/>` }; },
  shop: () => { const [d, f] = IK.fill("#ffffff"); const [d2, f2] = IK.fill(C.coral);
    return { defs: d + d2, body: `<rect x="20" y="56" width="88" height="58" rx="8" fill="${f}" ${st()}/><rect x="48" y="78" width="32" height="36" rx="4" fill="${C.sky}" ${st(5)}/>
      <path d="M14 36 L24 14 H104 L114 36 Q114 56 98 56 Q86 56 82 46 Q76 56 64 56 Q52 56 46 46 Q42 56 30 56 Q14 56 14 36 Z" fill="${f2}" ${st()}/><path d="M46 18 L42 44 M82 18 L86 44" stroke="#fff" stroke-width="8" opacity=".85"/>` }; },
  speed: () => { const [d, f] = IK.fill(C.sun);
    return { defs: d, body: `<path d="M12 90 A52 52 0 0 1 116 90 Z" fill="${f}" ${st()}/><path d="M28 86 A36 36 0 0 1 100 86" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="3 12" stroke-linecap="round"/><path d="M64 88 L96 50" ${st(9)}/><circle cx="64" cy="88" r="10" fill="${C.coral}" ${st(5)}/>` }; },
  ride: () => { const [d, f] = IK.fill(C.tangerine);
    return { defs: d, body: `<path d="M34 112 Q10 70 26 40 Q42 12 64 12 Q86 12 102 40 Q118 70 94 112 L74 112 Q92 72 84 50 Q76 32 64 32 Q52 32 44 50 Q36 72 54 112 Z" fill="${f}" ${st()}/><g fill="#fff"><circle cx="34" cy="62" r="4"/><circle cx="40" cy="40" r="4"/><circle cx="94" cy="62" r="4"/><circle cx="88" cy="40" r="4"/></g>` }; },
  guide: () => { const m = guide("hello", "gicon"); return { defs: m.defs, body: `<g transform="translate(5,4) scale(0.295)">${m.body}</g>` }; },
  flag: () => ({ defs: "", body: `<path d="M26 14 V118" ${st(9)}/><path d="M28 18 H110 V74 H28 Z" fill="#fff" ${st()}/><g fill="${C.ink}"><rect x="28" y="18" width="20" height="19"/><rect x="68" y="18" width="21" height="19"/><rect x="48" y="37" width="20" height="18"/><rect x="89" y="37" width="21" height="18"/><rect x="28" y="55" width="20" height="19"/><rect x="68" y="55" width="21" height="19"/></g><path d="M28 18 H110 V74 H28 Z" fill="none" ${st()}/>` }),
  seed: () => { const [d, f] = IK.fill(C.mint); const [d2, f2] = IK.fill(C.tangerine);
    return { defs: d + d2, body: `<path d="M64 74 V40" ${st(8)}/><path d="M64 46 Q40 48 26 26 Q52 18 64 46 Z" fill="${f}" ${st(6)}/><path d="M64 40 Q86 40 102 16 Q74 10 64 40 Z" fill="${f}" ${st(6)}/><path d="M30 72 H98 L88 116 H40 Z" fill="${f2}" ${st()}/><rect x="24" y="66" width="80" height="16" rx="5" fill="${f2}" ${st(6)}/>` }; },
  crate: () => { const [d, f] = IK.fill("#e9b07a");
    return { defs: d, body: `<path d="M64 14 L114 38 V92 L64 116 L14 92 V38 Z" fill="${f}" ${st()}/><path d="M14 38 L64 62 L114 38 M64 62 V116" fill="none" ${st(6)}/><path d="M38 26 L88 50 V70" fill="none" stroke="#fff" stroke-width="8" opacity=".7"/>` }; },
  polish: () => { const [d, f] = IK.fill(C.sun);
    return { defs: d, body: `<rect x="20" y="52" width="72" height="54" rx="16" fill="${f}" ${st()}/><g fill="#fff" opacity=".7"><circle cx="40" cy="74" r="5"/><circle cx="62" cy="86" r="4"/><circle cx="74" cy="68" r="5"/></g><g fill="#dff4ff" ${st(5)}><circle cx="96" cy="36" r="16"/><circle cx="70" cy="26" r="10"/><circle cx="110" cy="66" r="9"/></g>` }; },
  creature: () => { const [d, f] = IK.fill(C.rose);
    return { defs: d, body: `<path d="M34 40 L24 12 L52 30 Z M94 40 L104 12 L76 30 Z" fill="${f}" ${st(6)}/><ellipse cx="64" cy="72" rx="50" ry="44" fill="${f}" ${st()}/><circle cx="46" cy="66" r="9" fill="#fff" ${st(4)}/><circle cx="82" cy="66" r="9" fill="#fff" ${st(4)}/><circle cx="48" cy="68" r="4.5" fill="${C.ink}"/><circle cx="84" cy="68" r="4.5" fill="${C.ink}"/><path d="M54 88 Q64 96 74 88" fill="none" ${st(5)}/>` }; },
  timer: () => { const [d, f] = IK.fill(C.sky);
    return { defs: d, body: `<rect x="52" y="8" width="24" height="14" rx="4" fill="${C.ink}"/><circle cx="64" cy="72" r="46" fill="${f}" ${st()}/><circle cx="64" cy="72" r="32" fill="#fff" ${st(5)}/><path d="M64 72 V50 M64 72 L80 82" ${st(7)}/>` }; },
  portal: () => { const [d, f] = IK.fill(C.lilac);
    return { defs: d, body: `<circle cx="64" cy="64" r="52" fill="${f}" ${st()}/><path d="M64 30 A34 34 0 1 1 34 80 M64 46 A18 18 0 1 1 48 72" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="64" cy="64" r="6" fill="#fff"/>` }; },
  siren: () => { const [d, f] = IK.fill(C.coral);
    return { defs: d, body: `<path d="M34 92 V62 Q34 30 64 30 Q94 30 94 62 V92 Z" fill="${f}" ${st()}/><rect x="22" y="90" width="84" height="22" rx="7" fill="#c9cfe6" ${st()}/><path d="M50 60 Q52 46 64 44" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/><path d="M14 30 L26 40 M114 30 L102 40 M64 6 V18" ${st(7)}/>` }; },
};
const CORE = ["star", "heart", "help", "avatar", "goals", "play", "check", "gift", "hand", "sparkle", "moon", "refresh", "arrow", "home", "lock", "palette", "sound", "smile", "trophy"];
function icon(name) { return OWN[name] ? OWN[name]() : IK.ICONS[name](P); }

module.exports = {
  C, BUBBLE, mark, guide, icon, ICON_NAMES: [...CORE, ...Object.keys(OWN)],
  jobs: () => {
    const J = [];
    [...CORE, ...Object.keys(OWN)].forEach((n) => { const r = icon(n); J.push(K.job(`landing/brand/icons/${n}.webp`, 256, 256, `<g transform="scale(2)">${r.body}</g>`, r.defs)); });
    // logo symbol (transparent), 4× for crisp use up to ~128 px
    const m = mark("lmk"); J.push(K.job("landing/brand/mark.webp", 512, 512, `<g transform="translate(16,14) scale(3.75)">${m.body}</g>`, m.defs));
    // app icons: the mark on a paper tile (iOS / Android crop the corners themselves)
    const tile = (file, size, safe) => { const k = (size * safe) / 128, off = (size - 128 * k) / 2, mm = mark("lt" + size);
      J.push(K.job(file, size, size, `<rect width="${size}" height="${size}" fill="${C.paper}"/><g transform="translate(${off},${off + size * 0.01}) scale(${k})">${mm.body}</g>`, mm.defs)); };
    tile("landing/brand/icon-512.png", 512, 0.72); tile("landing/brand/icon-192.png", 192, 0.72); tile("landing/brand/apple-touch-icon.png", 180, 0.72);
    const fv = mark("lfv"); J.push(K.job("landing/brand/favicon.png", 64, 64, `<g transform="translate(1,2) scale(0.48)">${fv.body}</g>`, fv.defs));
    ["hello", "point", "idea"].forEach((p) => { const g = guide(p, "g" + p); J.push(K.job(`landing/brand/guide-${p}.webp`, 800, 800, `<g transform="scale(2)">${g.body}</g>`, g.defs)); });
    return J;
  },
};
