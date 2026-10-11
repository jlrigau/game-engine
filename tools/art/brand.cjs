/*
 * Brand art of the ENGINE itself (landing page, logo, mascot) — NOT game content.
 * Three candidate directions, each with its own mascot ("the game author") drawn by ONE
 * parametric function so the logo, the app icon and the landing illustrations never drift:
 *   fabu()   — Fabulo        : a round little author in a beret, holding a giant pencil
 *   braise() — Ludoforge     : a small dragon who forges games with a hammer
 *   plume()  — Il était un jeu : a storyteller owl in glasses, reading a book that pops a game
 * Each draws in a 400×400 box. Render: node .claude/skills/_shared/render-svg.cjs tools/art/brand.cjs
 */
const K = require("../../.claude/skills/_shared/svg-kit.cjs");

const BRANDS = {
  fabulo: { ink: "#2b2145", bg: "#fff6e6", c1: "#ff5a4e", c2: "#ffc23d", c3: "#18a999", c4: "#ff9fb2" },
  ludoforge: { ink: "#1d1b33", bg: "#fff3e0", c1: "#ff7a1a", c2: "#ffd23f", c3: "#3ee6b0", c4: "#5b4bd6" },
  conte: { ink: "#14213d", bg: "#f4f7ff", c1: "#3d8bff", c2: "#ffd84d", c3: "#ff6f61", c4: "#7fd1ff" },
};

// shared face: big eyes with highlights, cheeks, open smile
function face(P, cx, cy, s = 1, o = {}) {
  const ex = 38 * s, ey = cy, r = 25 * s;
  const eye = (x) => `<ellipse cx="${x}" cy="${ey}" rx="${r}" ry="${r * 1.15}" fill="#fff" stroke="${P.ink}" stroke-width="${5 * s}"/>
    <circle cx="${x + 3 * s}" cy="${ey + 4 * s}" r="${15 * s}" fill="${P.ink}"/>
    <circle cx="${x + 8 * s}" cy="${ey - 3 * s}" r="${5.5 * s}" fill="#fff"/><circle cx="${x - 2 * s}" cy="${ey + 11 * s}" r="${2.6 * s}" fill="#fff"/>`;
  const my = cy + 44 * s;
  return `${eye(cx - ex)}${eye(cx + ex)}
    <ellipse cx="${cx - 66 * s}" cy="${cy + 36 * s}" rx="${17 * s}" ry="${10 * s}" fill="${o.cheek || "#ff7a8a"}" opacity=".55"/>
    <ellipse cx="${cx + 66 * s}" cy="${cy + 36 * s}" rx="${17 * s}" ry="${10 * s}" fill="${o.cheek || "#ff7a8a"}" opacity=".55"/>
    ${o.noMouth ? "" : `<path d="M${cx - 20 * s},${my - 4 * s} Q${cx},${my + 26 * s} ${cx + 20 * s},${my - 4 * s} Z" fill="#7a2a3a" stroke="${P.ink}" stroke-width="${4.5 * s}" stroke-linejoin="round"/>
    <path d="M${cx - 9 * s},${my + 9 * s} Q${cx},${my + 3 * s} ${cx + 9 * s},${my + 9 * s} Q${cx},${my + 17 * s} ${cx - 9 * s},${my + 9 * s} Z" fill="#ff8fa0"/>`}`;
}

// ---------------- Fabulo: the author with a beret and a giant pencil ----------------
function fabu(id = "fa", P = BRANDS.fabulo) {
  const W = 6, ink = P.ink;
  const defs = K.lin(`${id}b`, [[0, K.shade(P.c2, 0.25)], [1, K.shade(P.c2, -0.12)]]) +
    K.lin(`${id}r`, [[0, K.shade(P.c1, 0.15)], [1, K.shade(P.c1, -0.18)]]) +
    K.lin(`${id}p`, [[0, K.shade(P.c3, 0.2)], [1, K.shade(P.c3, -0.15)]], 0, 0, 1, 0);
  const pencil = `<g transform="translate(300,236) rotate(28)">
      <rect x="-15" y="-92" width="30" height="150" rx="4" fill="url(#${id}p)" stroke="${ink}" stroke-width="${W}"/>
      <line x1="0" y1="-88" x2="0" y2="54" stroke="${K.shade(P.c3, -0.25)}" stroke-width="4" opacity=".6"/>
      <rect x="-16" y="-116" width="32" height="26" rx="8" fill="${P.c4}" stroke="${ink}" stroke-width="${W}"/>
      <rect x="-16" y="-96" width="32" height="12" fill="#c9cde0" stroke="${ink}" stroke-width="${W}"/>
      <path d="M-15,58 L0,104 L15,58 Z" fill="#f6cf98" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
      <path d="M-5,88 L0,104 L5,88 Z" fill="${ink}"/>
    </g>`;
  const body = `<ellipse cx="200" cy="372" rx="100" ry="13" fill="${ink}" opacity=".16"/>
    <ellipse cx="160" cy="352" rx="32" ry="17" fill="${K.shade(P.c2, -0.25)}" stroke="${ink}" stroke-width="${W}"/>
    <ellipse cx="240" cy="352" rx="32" ry="17" fill="${K.shade(P.c2, -0.25)}" stroke="${ink}" stroke-width="${W}"/>
    <path d="M96,236 Q60,214 70,176" fill="none" stroke="${ink}" stroke-width="${W + 16}" stroke-linecap="round"/>
    <path d="M96,236 Q60,214 70,176" fill="none" stroke="${K.shade(P.c2, -0.05)}" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="200" cy="244" rx="112" ry="116" fill="url(#${id}b)" stroke="${ink}" stroke-width="${W}"/>
    <ellipse cx="200" cy="300" rx="64" ry="48" fill="${K.shade(P.c2, 0.45)}" opacity=".8"/>
    <ellipse cx="160" cy="168" rx="40" ry="18" fill="#fff" opacity=".35"/>
    ${face(P, 200, 226)}
    <path d="M100,150 Q130,100 210,104 Q300,110 296,150 Q260,170 196,166 Q132,166 100,150 Z" fill="url(#${id}r)" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round" transform="rotate(-8 200 140)"/>
    <path d="M118,144 Q190,160 284,136" fill="none" stroke="${K.shade(P.c1, -0.3)}" stroke-width="4" opacity=".5" transform="rotate(-8 200 140)"/>
    <circle cx="214" cy="96" r="11" fill="${P.c1}" stroke="${ink}" stroke-width="${W}"/>
    ${pencil}
    <circle cx="296" cy="262" r="20" fill="${K.shade(P.c2, -0.05)}" stroke="${ink}" stroke-width="${W}"/>
    <circle cx="66" cy="172" r="19" fill="${K.shade(P.c2, -0.05)}" stroke="${ink}" stroke-width="${W}"/>`;
  return { defs, body };
}

// ---------------- Ludoforge: a little dragon smith with a hammer ----------------
function braise(id = "br", P = BRANDS.ludoforge) {
  const W = 6, ink = P.ink;
  const defs = K.lin(`${id}b`, [[0, K.shade(P.c1, 0.22)], [1, K.shade(P.c1, -0.15)]]) +
    K.lin(`${id}w`, [[0, K.shade(P.c3, 0.2)], [1, K.shade(P.c3, -0.2)]]);
  const wing = (s) => `<g transform="translate(200,0) scale(${s},1) translate(-200,0)">
      <path d="M108,236 Q56,226 30,170 Q58,178 70,166 Q72,190 92,198 Q86,176 98,160 Q112,196 124,214 Z" fill="url(#${id}w)" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/></g>`;
  const star = (x, y, R) => `<path d="${K.star(x, y, R, R * 0.45)}" fill="${P.c2}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
  const hammer = `<g transform="translate(300,250) rotate(-30)">
      <rect x="-8" y="-20" width="16" height="104" rx="7" fill="#b07a4a" stroke="${ink}" stroke-width="${W}"/>
      <rect x="-40" y="-56" width="80" height="42" rx="10" fill="${P.c4}" stroke="${ink}" stroke-width="${W}"/>
      <rect x="-32" y="-50" width="30" height="10" rx="5" fill="#fff" opacity=".35"/>
    </g>`;
  const body = `<ellipse cx="200" cy="372" rx="104" ry="13" fill="${ink}" opacity=".16"/>
    <path d="M286,320 Q356,330 362,276 Q366,248 346,240" fill="none" stroke="${ink}" stroke-width="${W + 22}" stroke-linecap="round"/>
    <path d="M286,320 Q356,330 362,276 Q366,248 346,240" fill="none" stroke="${K.shade(P.c1, -0.05)}" stroke-width="22" stroke-linecap="round"/>
    <path d="M346,240 L330,214 L366,226 Z" fill="${P.c3}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    ${wing(1)}${wing(-1)}
    <ellipse cx="160" cy="352" rx="32" ry="17" fill="${K.shade(P.c1, -0.25)}" stroke="${ink}" stroke-width="${W}"/>
    <ellipse cx="240" cy="352" rx="32" ry="17" fill="${K.shade(P.c1, -0.25)}" stroke="${ink}" stroke-width="${W}"/>
    <path d="M144,156 L132,84 L184,140 Z" fill="${P.c2}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <path d="M256,156 L268,84 L216,140 Z" fill="${P.c2}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <ellipse cx="200" cy="244" rx="112" ry="116" fill="url(#${id}b)" stroke="${ink}" stroke-width="${W}"/>
    <path d="M150,262 Q200,246 250,262 Q264,320 200,348 Q136,320 150,262 Z" fill="#ffe2b8" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M160,290 Q200,280 240,290 M166,316 Q200,308 234,316" fill="none" stroke="${K.shade("#ffe2b8", -0.25)}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="160" cy="160" rx="36" ry="16" fill="#fff" opacity=".3"/>
    ${face(P, 200, 196, 0.95, { cheek: "#ff4f6a" })}
    <path d="M214,238 l6,12 l6,-12 z" fill="#fff" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
    ${hammer}
    <circle cx="300" cy="268" r="19" fill="${K.shade(P.c1, -0.05)}" stroke="${ink}" stroke-width="${W}"/>
    ${star(352, 150, 20)}${star(318, 112, 11)}${star(372, 196, 9)}`;
  return { defs, body };
}

// ---------------- Il était un jeu: a storyteller owl and its pop-up book ----------------
function plume(id = "pl", P = BRANDS.conte) {
  const W = 6, ink = P.ink;
  const defs = K.lin(`${id}b`, [[0, K.shade(P.c1, 0.25)], [1, K.shade(P.c1, -0.15)]]);
  const glasses = `<circle cx="160" cy="196" r="38" fill="none" stroke="${P.c3}" stroke-width="9"/>
    <circle cx="240" cy="196" r="38" fill="none" stroke="${P.c3}" stroke-width="9"/>
    <path d="M190,186 Q200,176 210,186" fill="none" stroke="${P.c3}" stroke-width="8" stroke-linecap="round"/>`;
  const scallops = [0, 1, 2].map((r) => [-1, 0, 1].map((c) => `<path d="M${200 + c * 30 - 14 + (r % 2) * 15},${262 + r * 22} q14,14 28,0" fill="none" stroke="${K.shade(P.c4, -0.2)}" stroke-width="4" stroke-linecap="round"/>`).join("")).join("");
  const book = `<g transform="translate(200,318)">
      <path d="M-96,-6 Q-48,-26 0,-6 Q48,-26 96,-6 L96,34 Q48,16 0,36 Q-48,16 -96,34 Z" fill="${P.c3}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
      <path d="M-86,-14 Q-44,-34 0,-14 L0,26 Q-44,6 -86,26 Z" fill="#fff" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M86,-14 Q44,-34 0,-14 L0,26 Q44,6 86,26 Z" fill="#fff" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-68,-8 q22,-10 50,-2 M-68,6 q22,-10 50,-2 M20,-10 q26,-8 50,2 M20,4 q26,-8 50,2" fill="none" stroke="#c5cbe0" stroke-width="4" stroke-linecap="round"/>
    </g>`;
  const body = `<ellipse cx="200" cy="372" rx="104" ry="13" fill="${ink}" opacity=".16"/>
    <path d="M112,168 L96,80 L164,136 Z" fill="${K.shade(P.c1, -0.1)}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <path d="M288,168 L304,80 L236,136 Z" fill="${K.shade(P.c1, -0.1)}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <ellipse cx="200" cy="236" rx="116" ry="124" fill="url(#${id}b)" stroke="${ink}" stroke-width="${W}"/>
    <ellipse cx="200" cy="292" rx="70" ry="62" fill="${K.shade(P.c4, 0.5)}"/>
    ${scallops}
    <ellipse cx="156" cy="148" rx="36" ry="15" fill="#fff" opacity=".3"/>
    <circle cx="160" cy="196" r="38" fill="#fff"/><circle cx="240" cy="196" r="38" fill="#fff"/>
    <circle cx="164" cy="200" r="17" fill="${ink}"/><circle cx="244" cy="200" r="17" fill="${ink}"/>
    <circle cx="170" cy="192" r="6" fill="#fff"/><circle cx="250" cy="192" r="6" fill="#fff"/>
    ${glasses}
    <path d="M188,232 L212,232 L200,254 Z" fill="${P.c2}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="114" cy="246" rx="16" ry="9" fill="#ff7a8a" opacity=".5"/><ellipse cx="286" cy="246" rx="16" ry="9" fill="#ff7a8a" opacity=".5"/>
    <ellipse cx="160" cy="352" rx="26" ry="14" fill="${P.c2}" stroke="${ink}" stroke-width="${W}"/>
    <ellipse cx="240" cy="352" rx="26" ry="14" fill="${P.c2}" stroke="${ink}" stroke-width="${W}"/>
    ${book}
    <path d="M90,300 Q70,330 108,336" fill="${K.shade(P.c1, -0.15)}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <path d="M310,300 Q330,330 292,336" fill="${K.shade(P.c1, -0.15)}" stroke="${ink}" stroke-width="${W}" stroke-linejoin="round"/>
    <path d="${K.star(318, 96, 26, 11)}" fill="${P.c2}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
    <path d="${K.star(76, 110, 14, 6)}" fill="${P.c2}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="350" cy="150" r="7" fill="${P.c3}" stroke="${ink}" stroke-width="3"/>`;
  return { defs, body };
}

const MASCOTS = { fabulo: fabu, ludoforge: braise, conte: plume };

// app-icon style emblem: rounded square in the brand colour + the mascot
function emblem(key, size = 512, safe = 0.86) {
  const P = BRANDS[key], m = MASCOTS[key](key + "e");
  const bg = { fabulo: [P.c3, K.shade(P.c3, -0.25)], ludoforge: [P.c4, K.shade(P.c4, -0.3)], conte: [P.c2, K.shade(P.c2, -0.18)] }[key];
  const k = (size * safe) / 400, off = (size - 400 * k) / 2;
  const defs = m.defs + K.lin(key + "eg", [[0, bg[0]], [1, bg[1]]]);
  return { defs, body: `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#${key}eg)"/>
    <circle cx="${size * 0.5}" cy="${size * 0.46}" r="${size * 0.36}" fill="#fff" opacity=".14"/>
    <g transform="translate(${off},${off + size * 0.02}) scale(${k})">${m.body}</g>` };
}

module.exports = {
  BRANDS, MASCOTS, emblem, fabu, braise, plume,
  jobs: () => Object.keys(MASCOTS).flatMap((k) => {
    const m = MASCOTS[k](k), e = emblem(k);
    return [K.job(`landing/brand/${k}-mascot.png`, 800, 800, `<g transform="scale(2)">${m.body}</g>`, m.defs),
      K.job(`landing/brand/${k}-icon.png`, 512, 512, e.body, e.defs)];
  }),
};
