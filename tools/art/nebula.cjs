/*
 * Nebula Nursery — all game art as parametric SVG (rendered to PNG).
 *   node .claude/skills/_shared/render-svg.cjs tools/art/nebula.cjs [--only keeper,critter]
 * One source of truth: the critter drawn in the world, in the close-up, in the
 * customize preview and on the app icon all come from the same `critter()` function,
 * so they never drift apart.
 */
const K = require("../../.claude/skills/_shared/svg-kit.cjs");
const IK = require("../../.claude/skills/_shared/icon-kit.cjs");
const { svg, sheet, job, shade, mix, lin, rad, glow, blur, rng, star } = K;

const INK = "#1d2147";                 // outline colour (deep navy)
const VARIANTS = {                       // critter variants: [main colour]
  rose: "#ff5db1", amber: "#ffb43a", aqua: "#3fe0e8", lime: "#86e55a", violet: "#a97bff",
};

/* ---------------- Critter ---------------- */
// A round, glowing alien blob with one big eye, two antennae and three stubby feet.
// opts: { c (variant colour), eye:"open"|"happy", feet: -1|0|1 (walk), sq (squash), look (-1..1), uid,
//         turn (0..1): the whole face turns towards the LEFT (3/4 view) — walk sheets, flipped by the engine for right }
function critter(o) {
  const c = o.c, u = o.uid || "c";
  const body = mix("#ffffff", c, 0.28), bodyD = mix("#c9d6ff", c, 0.35);
  const sq = o.sq || 0, look = o.look != null ? o.look : -0.25;
  const rx = 40 * (1 + sq), ry = 36 * (1 - sq), cy = 66 + sq * 18;
  const defs = rad(`${u}b`, [[0, "#ffffff"], [0.55, body], [1, bodyD]], 0.42, 0.32, 0.75) +
    rad(`${u}g`, [[0, c, 0.55], [1, c, 0]], 0.5, 0.5, 0.5) +
    rad(`${u}e`, [[0, "#3a4590"], [0.7, "#1b1f4a"], [1, "#0e1030"]], 0.45, 0.4, 0.6) +
    rad(`${u}t`, [[0, "#ffffff"], [0.35, shade(c, 0.3)], [1, c]], 0.4, 0.35, 0.6) + glow(`${u}gl`, 3);
  const f = o.feet || 0;
  const foot = (x, lift) => `<ellipse cx="${x}" cy="${103 - lift}" rx="8.5" ry="6" fill="${bodyD}" stroke="${INK}" stroke-width="3"/>`;
  const tn = o.turn || 0, ft = -15 * tn;             // face shift for the 3/4 turn
  const eyeX = 64 + look * 7 + ft, eyeY = cy - 4;
  const eye = o.eye === "happy"
    ? `<path d="M${eyeX - 15} ${eyeY + 3} Q${eyeX} ${eyeY - 13} ${eyeX + 15} ${eyeY + 3}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`
    : `<circle cx="${eyeX}" cy="${eyeY}" r="17" fill="#ffffff" stroke="${INK}" stroke-width="3"/>
       <circle cx="${eyeX + look * 4}" cy="${eyeY + 1}" r="11.5" fill="url(#${u}e)"/>
       <circle cx="${eyeX + look * 4 - 4}" cy="${eyeY - 4}" r="4.2" fill="#ffffff"/>
       <circle cx="${eyeX + look * 4 + 4}" cy="${eyeY + 4}" r="1.8" fill="#ffffff" opacity=".8"/>`;
  const ant = (x0, x1, y1) => `<path d="M${x0} ${cy - ry + 8} Q${(x0 + x1) / 2} ${y1 + 8} ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="${x1}" cy="${y1}" r="7.5" fill="url(#${u}t)" stroke="${INK}" stroke-width="2.5" filter="url(#${u}gl)"/>`;
  return { defs, body: `
    <ellipse cx="64" cy="${cy}" rx="${rx + 16}" ry="${ry + 14}" fill="url(#${u}g)"/>
    ${foot(44, f > 0 ? 5 : 0)}${foot(84, f < 0 ? 5 : 0)}${foot(64, 0)}
    ${ant(52 + tn * 4, 38 - sq * 6 + tn * 8, cy - ry - 18 + sq * 10)}${ant(76 + tn * 4, 90 + sq * 6 + tn * 8, cy - ry - 18 + sq * 10)}
    <ellipse cx="64" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}b)" stroke="${INK}" stroke-width="3.5"/>
    <ellipse cx="${64 - rx * 0.42}" cy="${cy - ry * 0.5}" rx="${rx * 0.22}" ry="${ry * 0.14}" fill="#ffffff" opacity=".85" transform="rotate(-25 ${64 - rx * 0.42} ${cy - ry * 0.5})"/>
    ${eye}
    <ellipse cx="${46 + look * 4 + ft * 0.75}" cy="${cy + 13}" rx="${6 - tn * 1.5}" ry="3.6" fill="${c}" opacity=".45"/>
    <ellipse cx="${82 + look * 4 + ft * 0.8}" cy="${cy + 13}" rx="6" ry="3.6" fill="${c}" opacity=".45"/>
    <path d="M${57 + look * 5 + ft} ${cy + 17} Q${64 + look * 5 + ft} ${cy + 23} ${71 + look * 5 + ft} ${cy + 17}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` };
}
function critterSheet(v, happy) {
  const c = VARIANTS[v];
  // 4-frame walk: squash ↔ stretch with alternating feet (the engine adds the hop)
  const params = [{ sq: 0.0, feet: 1 }, { sq: -0.05, feet: 0 }, { sq: 0.0, feet: -1 }, { sq: 0.05, feet: 0 }];
  let defs = "";
  const frames = params.map((p, i) => { const r = critter({ c, uid: `k${i}`, sq: p.sq, feet: p.feet, eye: happy ? "happy" : "open", look: -0.8, turn: 0.65 }); defs += r.defs; return `<g transform="translate(64 109) scale(0.88) translate(-64 -109)">${r.body}</g>`; });
  return job(`assets/sheet/critter_${happy ? "happy_" : ""}${v}.png`, 512, 128, sheet(frames, 128, 128, 4), defs);
}
function critterThumb(v) {
  const r = critter({ c: VARIANTS[v], uid: "t" });
  return job(`assets/ui/critter_${v}.png`, 128, 128, r.body, r.defs);
}

/* ---------------- Keeper robot (LPC layout: 9 cols × 4 rows: up, left, down, right) ---------------- */
// opt.seated: riding pose — no hover glow / thruster, arms reaching forward, little legs
// bent at the knee dangling forward (side views) — see robotSeated().
function robot(dir, phase, moving, pal, u, opt) {
  const seated = !!(opt && opt.seated);
  const bob = moving ? Math.sin(phase * 2) * 2.4 : 0;
  const tilt = moving ? (dir === "left" ? -5 : dir === "right" ? 5 : Math.sin(phase) * 2) : 0;
  const swing = moving ? Math.sin(phase) * 22 : 0;
  const B = pal.body, BD = shade(pal.body, -0.18), A = pal.accent;
  const defs = rad(`${u}h`, [[0, "#ffffff"], [0.6, B], [1, BD]], 0.38, 0.3, 0.8) +
    lin(`${u}v`, [[0, "#2b3370"], [1, "#11153a"]]) +
    rad(`${u}j`, [[0, A, 0.9], [1, A, 0]], 0.5, 0.5, 0.5) + glow(`${u}gl`, 2.5) + blur(`${u}bl`, 4);
  const side = dir === "left" || dir === "right";
  const flip = dir === "right" ? `translate(128,0) scale(-1,1)` : "";
  const armL = (x, y, ang, front) => `<g transform="rotate(${ang} ${x} ${y})"><rect x="${x - 6}" y="${y - 3}" width="12" height="26" rx="6" fill="${front ? B : BD}" stroke="${INK}" stroke-width="3"/><circle cx="${x}" cy="${y + 25}" r="6.5" fill="${A}" stroke="${INK}" stroke-width="2.5"/></g>`;
  let g = "";
  // hover glow + thruster
  if (!seated) g += `<ellipse cx="64" cy="118" rx="${22 - bob}" ry="6" fill="url(#${u}j)" filter="url(#${u}bl)"/>`;
  g += `<g transform="translate(0 ${bob}) rotate(${tilt} 64 96)">`;
  if (dir === "up") {
    g += armL(36, 70, 10 - swing * 0.6, true) + armL(92, 70, -10 + swing * 0.6, true);
  } else if (!side) {
    g += armL(36, 70, 12 + swing * 0.6, false) + armL(92, 70, -12 - swing * 0.6, false);
  } else {
    g += armL(70, 70, seated ? 44 : -swing, false);   // far arm (behind)
  }
  // seated legs (side view): thigh forward, shin down, foot pointing forward. Far leg first.
  const leg = (dx, dy, c) => `<path d="M${66 + dx} ${99 + dy} L${45 + dx} ${101 + dy} L${43 + dx} ${112 + dy}" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${66 + dx} ${99 + dy} L${45 + dx} ${101 + dy} L${43 + dx} ${112 + dy}" fill="none" stroke="${c}" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<ellipse cx="${38 + dx}" cy="${116 + dy}" rx="9" ry="5" fill="${shade(A, -0.25)}" stroke="${INK}" stroke-width="3"/>`;
  if (seated && side) g += leg(9, -2, shade(BD, -0.12));
  if (!seated) {
    g += `<path d="M50 104 L78 104 L73 113 L55 113 Z" fill="${shade(A, -0.25)}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    g += `<ellipse cx="64" cy="114" rx="8" ry="3" fill="${A}" filter="url(#${u}gl)"/>`;
  }
  // body
  g += `<path d="M42 66 Q40 104 64 106 Q88 104 86 66 Z" fill="url(#${u}h)" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if (dir === "down") {
    g += `<rect x="54" y="78" width="20" height="14" rx="5" fill="#1a1f4a" stroke="${INK}" stroke-width="2.5"/><circle cx="60" cy="85" r="2.8" fill="${A}" filter="url(#${u}gl)"/><circle cx="68" cy="85" r="2.8" fill="#ff7ab8"/>`;
  } else if (dir === "up") {
    g += `<path d="M52 80 L76 80 M52 88 L76 88" stroke="${BD}" stroke-width="3" stroke-linecap="round"/>`;
  } else {
    g += `<circle cx="52" cy="85" r="4" fill="${A}" filter="url(#${u}gl)"/>`;
  }
  if (seated && side) g += leg(0, 0, B);
  // head
  if (dir === "up") g += keeperBackCollar(BD);
  g += `<line x1="64" y1="22" x2="64" y2="9" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  g += `<circle cx="64" cy="8" r="6.5" fill="${A}" stroke="${INK}" stroke-width="2.5" filter="url(#${u}gl)"/>`;
  g += `<ellipse cx="64" cy="46" rx="33" ry="27" fill="url(#${u}h)" stroke="${INK}" stroke-width="3.5"/>`;
  g += `<ellipse cx="52" cy="32" rx="9" ry="5" fill="#ffffff" opacity=".9" transform="rotate(-20 52 32)"/>`;
  if (dir === "down") {
    g += `<rect x="38" y="40" width="52" height="22" rx="11" fill="url(#${u}v)" stroke="${INK}" stroke-width="3"/>`;
    g += `<ellipse cx="53" cy="51" rx="6" ry="7" fill="${A}" filter="url(#${u}gl)"/><ellipse cx="75" cy="51" rx="6" ry="7" fill="${A}" filter="url(#${u}gl)"/>`;
    g += `<circle cx="51" cy="48" r="2" fill="#fff"/><circle cx="73" cy="48" r="2" fill="#fff"/>`;
    g += `<ellipse cx="38" cy="58" rx="5" ry="3" fill="#ff8fc4" opacity=".55"/><ellipse cx="90" cy="58" rx="5" ry="3" fill="#ff8fc4" opacity=".55"/>`;
  } else if (side) {
    g += `<g transform="${flip}"><rect x="30" y="40" width="30" height="22" rx="11" fill="url(#${u}v)" stroke="${INK}" stroke-width="3"/>`;
    g += `<ellipse cx="42" cy="51" rx="5.5" ry="7" fill="${A}" filter="url(#${u}gl)"/><circle cx="40" cy="48" r="2" fill="#fff"/>`;
    g += `<circle cx="80" cy="48" r="7" fill="${BD}" stroke="${INK}" stroke-width="2.5"/></g>`;
  } else {   // back of the head: battery hatch with vertical vents (see keeperBackHatch)
    g += keeperBackHatch(B, BD);
  }
  if (dir === "up") { /* arms already behind */ } else if (side) {
    g += `<g transform="${flip}">${armL(58, 70, seated ? 54 : swing, true)}</g>`;
  }
  g += `</g>`;
  return { defs, body: dir === "left" ? g : g };
}
// Back of the keeper's head (local 128 px): a collar ring under the head + a small battery hatch with
// vertical vents. No status dot below horizontal lines: that read as a sleepy FACE at phone size.
function keeperBackCollar(BD) { return `<ellipse cx="64" cy="73" rx="15" ry="4.5" fill="${BD}" stroke="${INK}" stroke-width="3"/>`; }
function keeperBackHatch(B, BD) {   // small, low on the head, low contrast (it must never read as a mouth)
  return `<rect x="57" y="54" width="14" height="10" rx="3.5" fill="${shade(B, -0.07)}"/>` +
    `<path d="M61 57 V61 M64 57 V61 M67 57 V61" stroke="${BD}" stroke-width="2" stroke-linecap="round"/>`;
}
function keeperSheet(name, pal) {
  const dirs = ["up", "left", "down", "right"];
  let defs = "", frames = [];
  dirs.forEach((d, r) => {
    for (let i = 0; i < 9; i++) {
      const u = `r${r}${i}`;
      const res = robot(d, i === 0 ? 0 : ((i - 1) / 8) * Math.PI * 2, i > 0, pal, u);
      defs += res.defs; frames.push(`<g transform="translate(64 124) scale(0.9) translate(-64 -124)">${res.body}</g>`);
    }
  });
  return job(`assets/sheet/${name}.png`, 128 * 9, 128 * 4, sheet(frames, 128, 128, 9), defs);
}
function keeperThumb(name, pal) {
  const r = robot("down", 0, false, pal, "t");
  return job(`assets/ui/${name}_thumb.png`, 128, 128, r.body, r.defs);
}
const KEEPERS = { keeper: { body: "#eef2ff", accent: "#3fe0e8" }, keeper_amber: { body: "#fff1df", accent: "#ffad3b" } };

/* ---------------- Ground: metal deck panels (tileable 512) ---------------- */
function ground() {
  const R = rng(7), S = 512, P = 128;
  let g = `<rect width="${S}" height="${S}" fill="#141c43"/>`;
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const v = R(), col = mix("#172150", "#1b2658", v);
    g += `<rect x="${x * P + 2}" y="${y * P + 2}" width="${P - 4}" height="${P - 4}" rx="10" fill="${col}"/>`;
    g += `<rect x="${x * P + 2}" y="${y * P + 2}" width="${P - 4}" height="${P - 4}" rx="10" fill="none" stroke="#24316b" stroke-width="2" opacity=".7"/>`;
    g += `<path d="M${x * P + 10} ${y * P + P - 4} L${x * P + P - 10} ${y * P + P - 4}" stroke="#0c1233" stroke-width="3" opacity=".8"/>`;
    [[12, 12], [P - 12, 12], [12, P - 12], [P - 12, P - 12]].forEach(([a, b]) => { g += `<circle cx="${x * P + a}" cy="${y * P + b}" r="3" fill="#2a3876"/><circle cx="${x * P + a - 0.8}" cy="${y * P + b - 0.8}" r="1.2" fill="#3c4d96"/>`; });
    const k = R();
    if (k < 0.18) g += `<g opacity=".8">${[0, 1, 2, 3].map((i) => `<rect x="${x * P + 40}" y="${y * P + 44 + i * 11}" width="48" height="5" rx="2.5" fill="#0e1538"/>`).join("")}</g>`;
    else if (k < 0.3) g += `<circle cx="${x * P + 64}" cy="${y * P + 64}" r="9" fill="#0f1640"/><circle cx="${x * P + 64}" cy="${y * P + 64}" r="4" fill="#3fe0e8" opacity=".55"/>`;
    else if (k < 0.4) g += `<path d="M${x * P + 30} ${y * P + 64} H${x * P + 98}" stroke="#22306a" stroke-width="4" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 40; i++) { const x = R() * S, y = R() * S, r = R() * 1.3 + 0.3; g += `<circle cx="${x}" cy="${y}" r="${r}" fill="#9fb3ff" opacity="${0.15 + R() * 0.3}"/>`; }
  return job("assets/img/ground.png", S, S, g);
}

/* ---------------- Nursery mat (zone floor, drawn at 1.5× the zone rect) ---------------- */
function penFloor(w, h) {
  const W = w * 1.5, H = h * 1.5, r = 60;
  const defs = rad("pf", [[0, "#2d5f8f"], [0.6, "#21477a"], [1, "#1a3463"]], 0.5, 0.45, 0.75) + glow("pg", 8) +
    `<pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse"><path d="M15 0 L45 0 L60 26 L45 52 L15 52 L0 26 Z" fill="none" stroke="#5fd8ff" stroke-width="1.6" opacity=".16"/></pattern>` +
    rad("spot", [[0, "#7ff3ff", 0.22], [1, "#7ff3ff", 0]]);
  let g = `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="${r}" fill="url(#pf)"/>`;
  g += `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="${r}" fill="url(#hex)"/>`;
  [[0.3, 0.35], [0.7, 0.6], [0.45, 0.78]].forEach(([a, b]) => { g += `<ellipse cx="${W * a}" cy="${H * b}" rx="${W * 0.2}" ry="${H * 0.16}" fill="url(#spot)"/>`; });
  g += `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="${r}" fill="none" stroke="#3fe0e8" stroke-width="7" opacity=".55" filter="url(#pg)"/>`;
  g += `<rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="${r - 10}" fill="none" stroke="#a8f6ff" stroke-width="2" opacity=".35" stroke-dasharray="14 12"/>`;
  return job("assets/img/pen_floor.png", W, H, g, defs);
}

/* ---------------- Force-field fence (3 frames of 80×80, drawn at scale .5) ---------------- */
function fence() {
  const defs = glow("fg", 3) + lin("fp", [[0, "#cfd8ff"], [1, "#6c78b8"]], 0, 0, 1, 0);
  const pylon = (x, y, big) => `<rect x="${x - (big ? 8 : 6)}" y="${y - (big ? 34 : 26)}" width="${big ? 16 : 12}" height="${big ? 36 : 28}" rx="${big ? 7 : 6}" fill="url(#fp)" stroke="${INK}" stroke-width="3"/>
    <circle cx="${x}" cy="${y - (big ? 34 : 26)}" r="${big ? 7 : 5.5}" fill="#3fe0e8" stroke="${INK}" stroke-width="2.5" filter="url(#fg)"/>`;
  const beamH = `<rect x="0" y="46" width="80" height="6" rx="3" fill="#3fe0e8" opacity=".45" filter="url(#fg)"/><rect x="0" y="47.5" width="80" height="3" fill="#c8fbff" opacity=".9"/>`;
  const beamV = `<rect x="37" y="0" width="6" height="80" rx="3" fill="#3fe0e8" opacity=".4" filter="url(#fg)"/><rect x="38.5" y="0" width="3" height="80" fill="#c8fbff" opacity=".8"/>`;
  const f0 = beamH + pylon(40, 58);
  const f1 = beamV + pylon(40, 58);
  const f2 = pylon(40, 60, true);
  return job("assets/sheet/fence.png", 240, 80, sheet([f0, f1, f2], 80, 80, 3), defs);
}

/* ---------------- Recharge pod (station) ---------------- */
function pod() {
  const W = 240, H = 210;
  const defs = lin("pm", [[0, "#5a67a8"], [1, "#2a3270"]]) + rad("pd", [[0, "#ffffff", 0.75], [0.5, "#b8f6ff", 0.35], [1, "#57d6ff", 0.25]], 0.4, 0.3, 0.8) +
    rad("pc", [[0, "#ffd6f0"], [1, "#d58ac9"]], 0.5, 0.35, 0.7) + glow("pg2", 4) + rad("halo", [[0, "#3fe0e8", 0.45], [1, "#3fe0e8", 0]]);
  let g = `<ellipse cx="120" cy="178" rx="112" ry="30" fill="url(#halo)"/>`;
  g += `<ellipse cx="120" cy="170" rx="98" ry="26" fill="#1c2257" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M22 152 Q22 176 120 182 Q218 176 218 152 L218 140 L22 140 Z" fill="url(#pm)" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  g += `<ellipse cx="120" cy="140" rx="98" ry="26" fill="#3a4790" stroke="${INK}" stroke-width="4"/>`;
  g += `<ellipse cx="120" cy="140" rx="84" ry="19" fill="none" stroke="#3fe0e8" stroke-width="4" filter="url(#pg2)"/>`;
  g += `<ellipse cx="120" cy="134" rx="62" ry="15" fill="url(#pc)" stroke="${INK}" stroke-width="3"/>`;
  g += `<ellipse cx="90" cy="128" rx="16" ry="7" fill="#fff" opacity=".9"/>`;
  g += `<path d="M30 140 Q30 40 120 34 Q210 40 210 140" fill="url(#pd)" stroke="#c9f8ff" stroke-width="3" opacity=".95"/>`;
  g += `<path d="M30 140 Q30 40 120 34 Q210 40 210 140" fill="none" stroke="${INK}" stroke-width="4" opacity=".9"/>`;
  g += `<path d="M58 110 Q60 60 110 50" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity=".75"/>`;
  g += `<path d="M126 74 a20 20 0 1 0 22 22 a16 16 0 1 1 -22 -22 Z" fill="#fff4b8" stroke="${INK}" stroke-width="2.5" filter="url(#pg2)"/>`;
  [[166, 70], [152, 104], [84, 92]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - i, 2.8 - i * 0.4, 4)}" fill="#fff6c8"/>`; });
  [60, 120, 180].forEach((x) => { g += `<circle cx="${x}" cy="${168 + (x === 120 ? 4 : 0)}" r="4" fill="#3fe0e8" filter="url(#pg2)"/>`; });
  return job("assets/img/pod_rest.png", W, H, g, defs);
}

/* ---------------- Scenery ---------------- */
function crystal(file, c1, c2) {
  const W = 170, H = 190;
  const defs = lin("cA", [[0, shade(c1, 0.55)], [0.5, c1], [1, shade(c2, -0.2)]], 0, 0, 1, 1) + lin("cB", [[0, shade(c2, 0.4)], [1, shade(c2, -0.35)]], 1, 0, 0, 1) +
    rad("cH", [[0, c1, 0.55], [1, c1, 0]]) + glow("cg", 4);
  const shard = (x, base, h, w, lean, fill) => {
    const tx = x + lean, top = base - h;
    return `<path d="M${x - w} ${base} L${x - w * 0.9} ${top + h * 0.28} L${tx} ${top} L${x + w * 0.9} ${top + h * 0.28} L${x + w} ${base} Z" fill="${fill}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M${tx} ${top} L${x - w * 0.15} ${base}" stroke="#ffffff" stroke-width="2" opacity=".5"/>
      <path d="M${x - w * 0.9} ${top + h * 0.28} L${tx} ${top} L${x + w * 0.1} ${top + h * 0.3} Z" fill="#ffffff" opacity=".35"/>`;
  };
  let g = `<ellipse cx="85" cy="150" rx="78" ry="44" fill="url(#cH)"/>`;
  g += `<ellipse cx="85" cy="176" rx="58" ry="10" fill="#0b1030" opacity=".45"/>`;
  g += `<path d="M30 176 Q40 160 85 158 Q130 160 140 176 Z" fill="#3a4790" stroke="${INK}" stroke-width="3.5"/>`;
  g += shard(52, 172, 70, 15, -10, "url(#cB)") + shard(120, 172, 80, 16, 12, "url(#cB)");
  g += shard(86, 174, 132, 24, 2, "url(#cA)");
  g += shard(66, 176, 44, 11, -4, "url(#cA)") + shard(104, 176, 50, 12, 6, "url(#cA)");
  [[60, 40], [128, 70], [40, 100]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 8 - i * 2, 3 - i * 0.6, 4)}" fill="#ffffff" filter="url(#cg)"/>`; });
  return job(`assets/img/${file}.png`, W, H, g, defs);
}
function alienPlant() {
  const W = 170, H = 210, c = "#7cf0c0", bulb = "#ff7ad9";
  const defs = rad("bb", [[0, "#ffffff"], [0.4, shade(bulb, 0.3)], [1, bulb]], 0.4, 0.35, 0.7) + glow("bg", 4) +
    lin("st", [[0, "#5fd6a8"], [1, "#2f8f7a"]]) + rad("bh", [[0, bulb, 0.45], [1, bulb, 0]]);
  let g = `<ellipse cx="85" cy="90" rx="80" ry="80" fill="url(#bh)"/>`;
  g += `<ellipse cx="85" cy="194" rx="46" ry="8" fill="#0b1030" opacity=".45"/>`;
  const stem = (x0, x1, y1) => `<path d="M${x0} 192 Q${(x0 + x1) / 2 + (x1 - x0) * 0.3} ${(192 + y1) / 2} ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x0} 192 Q${(x0 + x1) / 2 + (x1 - x0) * 0.3} ${(192 + y1) / 2} ${x1} ${y1}" fill="none" stroke="url(#st)" stroke-width="6.5" stroke-linecap="round"/>`;
  const b = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#bb)" stroke="${INK}" stroke-width="3.5" filter="url(#bg)"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#fff" opacity=".9"/>`;
  g += stem(80, 40, 88) + stem(88, 128, 70) + stem(84, 86, 40);
  g += `<path d="M60 192 Q40 150 22 160 Q40 172 60 192 Z M110 192 Q130 150 150 158 Q130 172 110 192 Z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  g += b(40, 82, 15) + b(128, 64, 17) + b(86, 34, 20);
  return job("assets/img/alienplant.png", W, H, g, defs);
}
function orbLamp() {
  const W = 140, H = 190;
  const defs = rad("ol", [[0, "#ffffff"], [0.45, "#fff3a8"], [1, "#ffb84a"]], 0.4, 0.35, 0.7) + glow("og", 6) + lin("op", [[0, "#8592d6"], [1, "#3b4588"]], 0, 0, 1, 0);
  let g = `<ellipse cx="70" cy="180" rx="34" ry="7" fill="#0b1030" opacity=".45"/>`;
  g += `<path d="M48 178 Q70 166 92 178 Z" fill="url(#op)" stroke="${INK}" stroke-width="3.5"/>`;
  g += `<rect x="64" y="70" width="12" height="104" rx="6" fill="url(#op)" stroke="${INK}" stroke-width="3.5"/>`;
  g += `<circle cx="70" cy="52" r="34" fill="url(#ol)" stroke="${INK}" stroke-width="3.5" filter="url(#og)"/>`;
  g += `<path d="M50 40 Q56 26 70 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  return job("assets/img/orblamp.png", W, H, g, defs);
}
function starBall() {
  const W = 100, H = 100;
  const defs = rad("sb", [[0, "#ffffff"], [0.5, "#a8e6ff"], [1, "#5b7cff"]], 0.38, 0.32, 0.75);
  let g = `<ellipse cx="50" cy="90" rx="30" ry="6" fill="#0b1030" opacity=".45"/>`;
  g += `<circle cx="50" cy="54" r="34" fill="url(#sb)" stroke="${INK}" stroke-width="3.5"/>`;
  g += `<path d="${star(50, 56, 17, 7)}" fill="#ffd24a" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  g += `<path d="M24 46 Q30 30 44 26" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  return job("assets/img/starball.png", W, H, g, defs);
}
function fountain() {
  const W = 220, H = 210;
  const defs = lin("fb", [[0, "#6c79c2"], [1, "#2c3577"]]) + rad("fw", [[0, "#ffffff"], [0.5, "#9ff7ff"], [1, "#3fb5e8"]], 0.5, 0.4, 0.7) + glow("fgl", 5) + rad("fh", [[0, "#ff5db1", 0.35], [1, "#ff5db1", 0]]);
  let g = `<ellipse cx="110" cy="120" rx="108" ry="90" fill="url(#fh)"/>`;
  g += `<ellipse cx="110" cy="196" rx="84" ry="10" fill="#0b1030" opacity=".45"/>`;
  g += `<path d="M30 160 Q30 194 110 196 Q190 194 190 160 Z" fill="url(#fb)" stroke="${INK}" stroke-width="4"/>`;
  g += `<ellipse cx="110" cy="160" rx="80" ry="22" fill="#3a4790" stroke="${INK}" stroke-width="4"/>`;
  g += `<ellipse cx="110" cy="160" rx="66" ry="15" fill="url(#fw)" opacity=".9"/>`;
  g += `<rect x="102" y="100" width="16" height="60" rx="6" fill="url(#fb)" stroke="${INK}" stroke-width="3.5"/>`;
  g += `<path d="M110 104 Q70 70 56 150 M110 104 Q150 70 164 150 M110 104 Q110 40 110 30" fill="none" stroke="#9ff7ff" stroke-width="7" stroke-linecap="round" opacity=".85" filter="url(#fgl)"/>`;
  g += `<circle cx="110" cy="30" r="13" fill="#ff8fd0" stroke="${INK}" stroke-width="3" filter="url(#fgl)"/>`;
  [[70, 60], [150, 52], [134, 120], [82, 122]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - (i % 2) * 2, 2.6, 4)}" fill="#fff6c8" filter="url(#fgl)"/>`; });
  return job("assets/img/fountain.png", W, H, g, defs);
}

/* ---------------- Close-up: a big critter face on a starfield ---------------- */
function starfield(W, H, seed, n = 160) {
  const R = rng(seed);
  let g = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  g += `<ellipse cx="${W * 0.2}" cy="${H * 0.18}" rx="${W * 0.5}" ry="${H * 0.2}" fill="url(#neb1)"/>`;
  g += `<ellipse cx="${W * 0.85}" cy="${H * 0.85}" rx="${W * 0.55}" ry="${H * 0.22}" fill="url(#neb2)"/>`;
  for (let i = 0; i < n; i++) { const x = R() * W, y = R() * H, r = R() * 2.2 + 0.4; g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(0.3 + R() * 0.7).toFixed(2)}"/>`; }
  for (let i = 0; i < Math.round(n / 16); i++) { const x = R() * W, y = R() * H; g += `<path d="${star(x, y, 9 + R() * 6, 2.5, 4)}" fill="#fff" opacity=".85"/>`; }
  return g;
}
function skyDefs() {
  return lin("sky", [[0, "#1b1150"], [0.5, "#121a48"], [1, "#0b1029"]]) +
    rad("neb1", [[0, "#7a3fc0", 0.55], [1, "#7a3fc0", 0]]) + rad("neb2", [[0, "#1f8fb0", 0.5], [1, "#1f8fb0", 0]]);
}
// Close-up geometry: where the 128-px critter() is drawn (scale s, translate tx/ty) in each backdrop.
// Portrait 900x1300 (the original); WIDE 1600x900 for landscape phones: the same face, centred,
// as big as the height allows without clipping (solid art spans local y 3..111, x 22..106;
// its glow halo, 112 local px wide, fills the middle ~55% of the width).
const CLOSEUP = {
  tall: (() => { const W = 900, H = 1300, s = 7.2; return { W, H, s, tx: W / 2 - 64 * s, ty: H * 0.56 - 66 * s }; })(),
  // wide: fits between y 0.17 (antenna balls, below the progress bar of a 2.16:1 phone) and 0.88 (feet)
  wide: (() => { const W = 1600, H = 900, s = 5.9; return { W, H, s, tx: W / 2 - 64 * s, ty: H * 0.525 - 56.875 * s }; })(),
};
// The polish spot areas of the PORTRAIT backdrop (copy of game.config.js, action "polish",
// closeup.spots.area): left cheek, right cheek, forehead, chin — around the big eye.
const TALL_AREAS = [{ x: 0.25, y: 0.45, w: 0.1, h: 0.2 }, { x: 0.65, y: 0.45, w: 0.1, h: 0.2 },
  { x: 0.40, y: 0.385, w: 0.2, h: 0.02 }, { x: 0.40, y: 0.70, w: 0.2, h: 0.03 }];
// The same 4 areas (same order) as fractions of the WIDE backdrop → closeup.wide.area.
function wideAreas() {
  const T = CLOSEUP.tall, Wd = CLOSEUP.wide, r4 = (n) => Math.round(n * 10000) / 10000;
  return TALL_AREAS.map((a) => {
    const lx = (a.x * T.W - T.tx) / T.s, ly = (a.y * T.H - T.ty) / T.s;   // portrait fraction -> critter-local px
    return { x: r4((Wd.tx + lx * Wd.s) / Wd.W), y: r4((Wd.ty + ly * Wd.s) / Wd.H),
      w: r4(a.w * T.W / T.s * Wd.s / Wd.W), h: r4(a.h * T.H / T.s * Wd.s / Wd.H) };
  });
}
// Station details for the wide backdrop's side wings (kept outside the critter's middle band):
// a ringed planet + a distant ring station in the sky, and two curved deck rims with lights.
function stationWings(W, H) {
  let g = "";
  // ringed planet, top-left: back half of the ring, planet, then the front half over it
  const ringArc = (front) => `<path d="M80 215 A150 34 0 0 ${front ? 0 : 1} 380 215" fill="none" stroke="${INK}" stroke-width="15" opacity="${front ? 0.9 : 0.6}"/><path d="M80 215 A150 34 0 0 ${front ? 0 : 1} 380 215" fill="none" stroke="#d9c4ff" stroke-width="8" opacity="${front ? 0.95 : 0.6}"/>`;
  g += `<g transform="rotate(-16 230 215)">${ringArc(false)}</g>`;
  g += `<circle cx="230" cy="215" r="74" fill="url(#wplanet)" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M168 196 Q230 176 292 200" fill="none" stroke="#ffffff" stroke-width="6" opacity=".18"/><path d="M164 236 Q230 222 296 240" fill="none" stroke="${INK}" stroke-width="5" opacity=".18"/>`;
  g += `<circle cx="196" cy="186" r="14" fill="#ffffff" opacity=".35"/>`;
  g += `<g transform="rotate(-16 230 215)">${ringArc(true)}</g>`;
  // distant ring station, top-right: hub on a spoke, the ring's front half passes in front of it
  const sArc = (front, col, w) => `<path d="M-96 0 A96 30 0 0 ${front ? 0 : 1} 96 0" fill="none" stroke="${col}" stroke-width="${w}"/>`;
  g += `<g transform="translate(1390 190)">${sArc(false, INK, 15)}${sArc(false, "#6f7fd0", 8)}`;
  g += `<rect x="-7" y="-30" width="14" height="60" rx="5" fill="#5a67a8" stroke="${INK}" stroke-width="4"/>`;
  g += `<circle r="20" fill="url(#wpm)" stroke="${INK}" stroke-width="4.5"/>`;
  g += `${sArc(true, INK, 15)}${sArc(true, "#6f7fd0", 8)}`;
  [-70, -35, 35, 70].forEach((x) => { g += `<circle cx="${x}" cy="${Math.sqrt(1 - (x / 96) ** 2) * 30}" r="4.5" fill="#3fe0e8" filter="url(#wlg)"/>`; });
  g += `<circle cx="0" cy="-36" r="5" fill="#ff8fd0" filter="url(#wlg)"/></g>`;
  // curved deck rims rising from the bottom corners (mirrored), with panel seams and lights
  const rim = (m) => {
    const X = (x) => (m ? W - x : x), d = `M${X(-12)} ${H * 0.62 - 3} Q${X(190)} ${H * 0.7} ${X(434)} ${H + 12} L${X(-12)} ${H + 12} Z`;
    let r = `<path d="${d}" fill="url(#wdeck)" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
    r += `<path d="M${X(0)} ${H * 0.62 + 26} Q${X(176)} ${H * 0.7 + 24} ${X(398)} ${H}" fill="none" stroke="#3fe0e8" stroke-width="5" opacity=".8" filter="url(#wlg)"/>`;
    [[60, 0.72], [150, 0.8], [240, 0.9]].forEach(([x, y]) => { r += `<path d="M${X(x)} ${H * y} L${X(x - 40)} ${H}" stroke="${INK}" stroke-width="3" opacity=".45"/>`; });
    [[34, 0.68], [126, 0.74], [214, 0.82], [296, 0.93]].forEach(([x, y], i) => { r += `<circle cx="${X(x)}" cy="${H * y + 4}" r="${i % 2 ? 6 : 7.5}" fill="${i % 2 ? "#ff8fd0" : "#ffd24a"}" stroke="${INK}" stroke-width="2.5" filter="url(#wlg)"/>`; });
    return r;
  };
  g += rim(false) + rim(true);
  return g;
}
function stationWingDefs() {
  return rad("wplanet", [[0, "#ffc4e6"], [0.55, "#c27ad9"], [1, "#5b3a9e"]], 0.38, 0.32, 0.8) +
    rad("wpm", [[0, "#ffffff"], [0.6, "#a9b6ff"], [1, "#5a67a8"]], 0.4, 0.35, 0.7) +
    lin("wdeck", [[0, "#4a58a8"], [1, "#1f275e"]]) + glow("wlg", 4);
}
function closeup(v, done, wide) {
  const G = wide ? CLOSEUP.wide : CLOSEUP.tall, { W, H, s, tx, ty } = G, c = VARIANTS[v];
  const r = critter({ c, uid: "z", eye: done ? "happy" : "open", look: 0 });
  let g = starfield(W, H, 11, wide ? 230 : 160);
  if (wide) g += stationWings(W, H);
  const gcx = tx + 64 * s, gcy = ty + 56.875 * s;   // wide: glow on the critter centre
  if (done) g += `<circle cx="${gcx}" cy="${wide ? gcy : H * 0.55}" r="${wide ? H * 0.6 : W * 0.62}" fill="url(#doneglow)"/>`;
  g += `<g transform="translate(${tx} ${ty}) scale(${s})">${r.body}</g>`;
  const sparkles = wide ? [[0.31, 0.27], [0.69, 0.25], [0.28, 0.74], [0.72, 0.76], [0.16, 0.52], [0.84, 0.5]]
    : [[0.2, 0.3], [0.8, 0.26], [0.16, 0.7], [0.84, 0.72], [0.5, 0.12]];
  if (done) sparkles.forEach(([a, b], i) => { g += `<path d="${star(W * a, H * b, 34 - (i % 5) * 3, 11, 4)}" fill="#fff6c8" filter="url(#sg)"/>`; });
  const defs = skyDefs() + r.defs + glow("sg", 6) + rad("doneglow", [[0, c, 0.5], [1, c, 0]]) + (wide ? stationWingDefs() : "");
  return job(`assets/img/critter_closeup_${v}${wide ? "_wide" : ""}${done ? "_done" : ""}.png`, W, H, g, defs);
}
// a fluffy cosmic dust bunny (two variants), the polishing sponge, and the "polish me" bubble
function dust(file, col) {
  const R = rng(file.length * 7);
  const defs = rad("dd", [[0, shade(col, 0.35)], [1, shade(col, -0.25)]], 0.4, 0.35, 0.7);
  let g = `<path d="${K.blob(64, 66, 46, 42, 11, 0.16, R)}" fill="url(#dd)" stroke="${shade(col, -0.5)}" stroke-width="4"/>`;
  for (let i = 0; i < 9; i++) { const a = R() * 6.28, d = R() * 28; g += `<circle cx="${64 + Math.cos(a) * d}" cy="${66 + Math.sin(a) * d}" r="${2 + R() * 3}" fill="${shade(col, -0.45)}" opacity=".6"/>`; }
  g += `<circle cx="52" cy="62" r="6" fill="${INK}"/><circle cx="76" cy="62" r="6" fill="${INK}"/><circle cx="50" cy="60" r="2" fill="#fff"/><circle cx="74" cy="60" r="2" fill="#fff"/>`;
  g += `<path d="M56 80 Q64 74 72 80" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
  return job(`assets/img/${file}.png`, 128, 128, g, defs);
}
function cloth() {
  const defs = lin("cl", [[0, "#ffd0ec"], [1, "#ff7ac0"]]) + glow("clg", 3);
  let g = `<g transform="rotate(-18 64 64)"><rect x="22" y="24" width="84" height="64" rx="26" fill="url(#cl)" stroke="${INK}" stroke-width="4"/>`;
  g += `<path d="M30 50 Q64 38 98 50" fill="none" stroke="#fff" stroke-width="5" opacity=".55" stroke-linecap="round"/>`;
  for (let i = 0; i < 6; i++) g += `<circle cx="${36 + i * 11}" cy="${70 + (i % 2) * 6}" r="3" fill="#fff" opacity=".6"/>`;
  g += `<rect x="52" y="86" width="24" height="34" rx="10" fill="#7b86d6" stroke="${INK}" stroke-width="4"/></g>`;
  g += `<path d="${star(100, 22, 12, 4, 4)}" fill="#fff6c8" filter="url(#clg)"/>`;
  return job("assets/img/cloth.png", 128, 128, g, defs);
}
function wantBubble() {
  const defs = glow("wg", 2);
  let g = `<path d="M14 12 H114 Q122 12 122 20 V82 Q122 90 114 90 H74 L64 106 L54 90 H14 Q6 90 6 82 V20 Q6 12 14 12 Z" fill="#ffffff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  const R = rng(3);
  g += `<path d="${K.blob(64, 52, 26, 22, 9, 0.18, R)}" fill="#a49bb8" stroke="#5b5270" stroke-width="3.5"/>`;
  g += `<circle cx="56" cy="50" r="4" fill="${INK}"/><circle cx="72" cy="50" r="4" fill="${INK}"/><path d="M58 62 Q64 58 70 62" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  g += `<path d="${star(102, 28, 10, 3.6, 4)}" fill="#ffd24a" filter="url(#wg)"/>`;
  return job("assets/img/want_dust.png", 128, 112, g, defs);
}

/* ---------------- Icons & logo (same critter as in the game) ---------------- */
// App icon (home screen): drawn on a 512 grid, rendered at any size. `safe` < 1 shrinks the
// subject into the central safe zone for Android "maskable" icons (cropped to a circle).
function icon(file, size, safe = 1) {
  const S = 512, r = critter({ c: VARIANTS.aqua, uid: "i", look: 0 });
  const defs = skyDefs() + r.defs + rad("ih", [[0, "#3fe0e8", 0.55], [1, "#3fe0e8", 0]]) + glow("ig", 8) + rad("pl", [[0, "#ff9ed8"], [1, "#b2479a"]], 0.35, 0.3, 0.8);
  let g = `<rect width="${S}" height="${S}" fill="url(#sky)"/>`;
  g += `<ellipse cx="120" cy="90" rx="330" ry="170" fill="url(#neb1)"/><ellipse cx="420" cy="460" rx="300" ry="160" fill="url(#neb2)"/>`;
  const R = rng(5); for (let i = 0; i < 40; i++) g += `<circle cx="${R() * S}" cy="${R() * S}" r="${R() * 2.4 + 0.8}" fill="#fff" opacity="${0.4 + R() * 0.6}"/>`;
  g += `<g transform="translate(400 112) scale(${safe})"><circle r="44" fill="url(#pl)"/><ellipse rx="78" ry="16" fill="none" stroke="#ffd6ef" stroke-width="7" opacity=".85" transform="rotate(-20)"/></g>`;
  g += `<circle cx="256" cy="282" r="${190 * safe}" fill="url(#ih)"/>`;
  // the critter spans x 14..114, y 4..112 of its 128 box: fit it inside ~74% of the icon
  const s = 3.4 * safe;
  g += `<g transform="translate(256 290) scale(${s}) translate(-64 -60)">${r.body}</g>`;
  [[88, 140, 22], [440, 300, 16], [110, 420, 14]].forEach(([x, y, q]) => { g += `<path d="${star(x, y, q * safe, q * 0.33 * safe, 4)}" fill="#fff6c8" filter="url(#ig)"/>`; });
  return Object.assign(job(file, S, S, g, defs), { scale: size / S });
}
function logo() {
  const W = 420, H = 300;
  const a = critter({ c: VARIANTS.aqua, uid: "la", look: 0.3 }), b = critter({ c: VARIANTS.rose, uid: "lb", look: -0.4, sq: 0.06 }), c = critter({ c: VARIANTS.lime, uid: "lc", look: -0.2, sq: -0.04 });
  const defs = a.defs + b.defs + c.defs + glow("lg", 5) + rad("lh", [[0, "#3fe0e8", 0.35], [1, "#3fe0e8", 0]]);
  let g = `<ellipse cx="210" cy="170" rx="200" ry="130" fill="url(#lh)"/>`;
  g += `<g transform="translate(36 70) scale(1.25)">${b.body}</g>`;
  g += `<g transform="translate(224 76) scale(1.2)">${c.body}</g>`;
  g += `<g transform="translate(110 40) scale(1.55)">${a.body}</g>`;
  [[40, 40], [380, 60], [350, 250], [60, 250], [210, 18]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 13 - i, 4, 4)}" fill="#fff6c8" filter="url(#lg)"/>`; });
  return job("assets/img/logo.png", W, H, g, defs);
}


/* ---------------- UI icons (shared kit, Nebula palette) + game icons ---------------- */
const PAL = { ink: "#1d2147", blue: "#3fb8ff", teal: "#3fe0e8", pink: "#ff5db1", purple: "#a97bff", gold: "#ffc93c", green: "#6ee08a" };
function critterIcon() {   // the creature icon: the same critter, framed as an icon
  const r = critter({ c: VARIANTS.aqua, uid: "ci", look: 0 });
  return IK.job("assets/ui/icons/critter.png", `<g transform="translate(64 70) scale(1.05) translate(-64 -66)">${r.body}</g>`, r.defs);
}
function robotIcon() {
  const r = robot("down", 0, false, KEEPERS.keeper, "ri");
  return IK.job("assets/ui/icons/keeper.png", `<g transform="translate(64 64) scale(1.0) translate(-64 -62)">${r.body}</g>`, r.defs);
}
function polishIcon() {   // the polish mitt with a sparkle
  const defs = lin("pm", [[0, "#ffd0ec"], [1, "#ff7ac0"]]);
  let g = `<g transform="rotate(-18 64 70)"><rect x="20" y="30" width="88" height="64" rx="28" fill="url(#pm)" stroke="${INK}" stroke-width="7"/><path d="M32 52 Q64 40 96 52" fill="none" stroke="#fff" stroke-width="6" opacity=".6" stroke-linecap="round"/><rect x="50" y="90" width="28" height="30" rx="10" fill="#7b86d6" stroke="${INK}" stroke-width="7"/></g>`;
  g += `<path d="${star(102, 24, 18, 6, 4)}" fill="#ffd24a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  return IK.job("assets/ui/icons/polish.png", g, defs);
}

/* ---------------- Home splash (portrait, behind the logo + bottom sheet) ---------------- */
function splash() {
  const W = 900, H = 1600, R = rng(77);
  const crit = (v, x, y, s, look, uid, sq) => { const r = critter({ c: VARIANTS[v], uid, look, sq }); return { d: r.defs, g: `<g transform="translate(${x} ${y}) scale(${s}) translate(-64 -66)">${r.body}</g>` }; };
  let defs = skyDefs() + rad("pl", [[0, "#5a4bd0"], [0.6, "#2e2a86"], [1, "#171a52"]], 0.4, 0.2, 0.8) + rad("plh", [[0, "#7ff3ff", 0.5], [1, "#7ff3ff", 0]]) + glow("sg", 6) + rad("ring", [[0, "#ff9ed8", 0.0], [0.85, "#ff9ed8", 0.0], [0.92, "#ff9ed8", 0.45], [1, "#ff9ed8", 0]]);
  let g = starfield(W, H, 3);
  g += `<circle cx="760" cy="300" r="110" fill="#ff8fd0" opacity=".9"/><circle cx="740" cy="280" r="110" fill="url(#pl)" opacity=".35"/><ellipse cx="760" cy="300" rx="190" ry="40" fill="none" stroke="#ffd6ef" stroke-width="10" opacity=".7" transform="rotate(-18 760 300)"/>`;
  g += `<ellipse cx="450" cy="${H + 420}" rx="900" ry="760" fill="url(#plh)"/>`;
  g += `<ellipse cx="450" cy="${H + 440}" rx="820" ry="700" fill="url(#pl)"/>`;
  for (let i = 0; i < 12; i++) g += `<ellipse cx="${80 + R() * 740}" cy="${H - 300 + R() * 260}" rx="${30 + R() * 60}" ry="${8 + R() * 14}" fill="#1a1d5a" opacity=".55"/>`;
  [[120, 520, 1], [800, 760, 0.8], [240, 900, 0.7], [680, 470, 0.6]].forEach(([x, y, s]) => { g += `<path d="${star(x, y, 18 * s, 6 * s, 4)}" fill="#fff6c8" filter="url(#sg)"/>`; });
  const cs = [crit("violet", 560, 760, 0.95, -0.2, "s3", 0.0), crit("amber", 330, 800, 0.9, 0.3, "s4", 0.04), crit("rose", 215, 900, 1.3, 0.4, "s1", 0.05), crit("lime", 690, 880, 1.2, -0.4, "s2", -0.03)];   // in the visible band between title and sheet
  cs.forEach((c) => { defs += c.d; g += c.g; });
  return K.job("assets/img/splash.png", W, H, g, defs);
}

/* ====================================================================================
 * Showcase art: riding, race, environment, stations, missions, chase, race props, icons
 * ==================================================================================== */
const stk = (w) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const f2 = (n) => (+n).toFixed(2);
// draw fn(ox, oy) at the 9 wrap offsets so a tile is seamless (elements crossing an edge reappear opposite)
function wrapAll(W, H, fn) { let g = ""; for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) g += fn(ox, oy); return g; }
// faceted crystal shard (same geometry as crystal())
function shardPath(x, base, h, w, lean, fill, sw = 3.5) {
  const tx = x + lean, top = base - h;
  return `<path d="M${x - w} ${base} L${x - w * 0.9} ${top + h * 0.28} L${tx} ${top} L${x + w * 0.9} ${top + h * 0.28} L${x + w} ${base} Z" fill="${fill}" ${stk(sw)}/>
    <path d="M${tx} ${top} L${x - w * 0.15} ${base}" stroke="#ffffff" stroke-width="2" opacity=".5"/>
    <path d="M${x - w * 0.9} ${top + h * 0.28} L${tx} ${top} L${x + w * 0.1} ${top + h * 0.3} Z" fill="#ffffff" opacity=".35"/>`;
}

/* ---------------- 1. Keeper seated (riding pose), one 128 frame ---------------- */
function robotSeated(pal, u) { return robot("left", 0, false, pal, u, { seated: true }); }
function keeperRide(name, pal) {
  const r = robotSeated(pal, "rs");
  return job(`assets/sheet/${name}_ride.png`, 128, 128, `<g transform="translate(64 124) scale(0.74) translate(-64 -124)">${r.body}</g>`, r.defs);
}

/* ---------------- 3. Critter seen from behind, keeper on its back (race sprite) ---------------- */
// Race rear view: the critter alone (critterBack) + the keeper seen from behind (riderBack), two layers
// in the SAME 200x170 frame — the engine draws character.raceRider over raceSprite. Reference pose: a kid
// on a SPACE HOPPER seen from behind/above: a round pod sitting on top of the ball, elbows out and down,
// fists on the two "horns" (the critter's antennae), legs hanging down the ball. Both layers read the
// antenna geometry from cbAntenna() and the rider joints from RB, so they always line up.
const CB = { W: 200, H: 170, cx: 100, cy: 106, rx: 54, ry: 52 };   // narrow "pony barrel": room for jockey legs
const RB = {   // rider joints, frame px (left side; mirrored about x 100)
  head: { cx: 100, cy: 36, rx: 26, ry: 21 }, shoulder: [84, 60], elbow: [68, 76], fist: [58, 68],
  hip: [71, 85], knee: [46, 102], shin: [[45, 104], [44, 128]], foot: [44, 134],   // thigh ~30 px at 35 deg   // horse-rider seat: thighs over the back, shins hug the flanks
};
function cbAntenna(m) {    // m = -1 left, +1 right: root hidden behind the rider's pod → through the fist → up/out to the tip
  const X = (x) => (m < 0 ? x : 200 - x);
  // ONE smooth quadratic: root (behind the pod) → through the fist at t = 0.4 → tip; ctl solved from the 3 points
  const t = 0.4, root = [X(88), 64], grip = [X(RB.fist[0]), RB.fist[1]], tip = [X(44), 19];
  const ctl = [0, 1].map((k) => (grip[k] - (1 - t) ** 2 * root[k] - t * t * tip[k]) / (2 * t * (1 - t)));
  const tan = [0, 1].map((k) => 2 * (1 - t) * (ctl[k] - root[k]) + 2 * t * (tip[k] - ctl[k]));
  return { root, grip, ctl, tip, tan, d: `M${root[0]} ${root[1]} Q${ctl[0].toFixed(1)} ${ctl[1].toFixed(1)} ${tip[0]} ${tip[1]}` };
}
function critterBack(v) {
  const c = VARIANTS[v], u = "cb", { W, H, cx, cy, rx, ry } = CB;
  const body = mix("#ffffff", c, 0.42), bodyD = mix("#c9d6ff", c, 0.5);   // richer than the walk sheet: pale mounts must differ
  const defs = rad(`${u}b`, [[0, "#ffffff"], [0.5, body], [1, bodyD]], 0.5, 0.28, 0.78) +
    rad(`${u}th`, [[0, "#ffffff"], [0.35, "#fff3b0"], [1, mix("#ffd24a", c, 0.5), 0]]) +
    rad(`${u}g`, [[0, c, 0.5], [1, c, 0]]) + rad(`${u}t`, [[0, "#ffffff"], [0.35, shade(c, 0.3)], [1, c]], 0.4, 0.35, 0.6) +
    rad(`${u}l`, [[0, "#ffffff"], [0.35, "#fff3b0"], [1, "#ffd24a", 0]]) + glow(`${u}gl`, 3) + blur(`${u}bl`, 3);
  let g = `<ellipse cx="${cx}" cy="${cy}" rx="84" ry="60" fill="url(#${u}g)"/>`;   // halo stays inside the frame
  g += `<ellipse cx="${cx}" cy="164" rx="52" ry="3.5" fill="#0b1030" opacity=".45" filter="url(#${u}bl)"/>`;
  const foot = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="9" fill="${bodyD}" ${stk(3.5)}/>`;
  g += `<ellipse cx="${cx}" cy="161" rx="13" ry="7" fill="${shade(bodyD, -0.12)}" ${stk(3.5)}/>`;   // third foot, behind the body
  g += foot(68, 158) + foot(132, 158);
  g += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}b)" ${stk(4)}/>`;
  // antennae = the hopper's handle horns: an outward V from roots on the back (hidden by the rider's
  // forearms), light core so the stalk reads against the dark race sky, glowing ball on top
  [-1, 1].forEach((m) => { const a = cbAntenna(m);
    g += `<path d="${a.d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="${a.d}" fill="none" stroke="${bodyD}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<circle cx="${a.tip[0]}" cy="${a.tip[1]}" r="8.5" fill="url(#${u}t)" ${stk(3)} filter="url(#${u}gl)"/>`; });
  // soft back shading (lower half) + rim light — no spots (they read as a face from behind)
  g += `<path d="M${cx - rx + 8} ${cy + 14} Q${cx} ${cy + 44} ${cx + rx - 8} ${cy + 14} Q${cx + rx - 14} ${cy + ry - 6} ${cx} ${cy + ry - 3} Q${cx - rx + 14} ${cy + ry - 6} ${cx - rx + 8} ${cy + 14} Z" fill="${c}" opacity=".3"/>`;
  g += `<path d="M55 108 Q55 87 64 73" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>`;
  return job(`assets/img/critter_back_${v}.png`, W, H, g, defs);
}
// The keeper seen from BEHIND sitting on the critter like a kid on a space hopper, drawn in frame px with
// the keeper's own shapes + palette (head = robot()'s 33x27 head scaled 0.79, torso = its pod scaled 0.8,
// back of the head/pod = the walk sheet's back row: grey vents + a small status light). Accent colour only
// on the fists, the boot bands and the head-antenna ball. Shadows are clipped TO the critter's body.
function keeperBackSeated(pal, u, stripe) {
  const B = pal.body, BD = shade(pal.body, -0.18), A = pal.accent, H = RB.head;
  const L = (x) => x, R = (x) => 200 - x;
  const { cx, cy, rx, ry } = CB;
  const defs = rad(`${u}h`, [[0, "#ffffff"], [0.6, B], [1, BD]], 0.38, 0.3, 0.8) + glow(`${u}gl`, 2) +
    // the shins hug the flanks like a horse rider's: only what is tucked behind the flank is hidden
    `<mask id="${u}out" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="170"><rect width="200" height="170" fill="#fff"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - 4}" ry="${ry - 4}" fill="#000"/></mask>` +
    `<clipPath id="${u}hc"><ellipse cx="64" cy="46" rx="33" ry="27"/></clipPath>`;
  let g = "";
  const SEAT = "#6a52b8";
  // shins hug the flanks (only the part tucked behind the flank is masked), heel-view boots
  let shins = "";
  [L, R].forEach((X) => {
    const [[ax, ay], [bx, by]] = RB.shin, d = `M${X(ax)} ${ay} L${X(bx)} ${by}`;
    shins += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${BD}" stroke-width="7.5" stroke-linecap="round"/>`;
  });
  g += shins;   // drawn over the flank edge: the shin hugs the barrel
  [[L, 1], [R, -1]].forEach(([X, m]) => {
    const [fx, fy] = RB.foot, x = X(fx);
    g += `<g transform="rotate(${m * 8} ${x} ${fy})"><path d="M${x - 7} ${fy - 6} L${x + 7} ${fy - 6} Q${x + 10} ${fy + 1} ${x + 10} ${fy + 5} Q${x} ${fy + 8} ${x - 10} ${fy + 5} Q${x - 10} ${fy + 1} ${x - 7} ${fy - 6} Z" fill="#2b3370" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
      `<path d="M${x - 6} ${fy - 3} Q${x} ${fy - 4.5} ${x + 6} ${fy - 3}" fill="none" stroke="#8592d6" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` +
      `<path d="M${x - 8.5} ${fy + 4.5} Q${x} ${fy + 7} ${x + 8.5} ${fy + 4.5}" fill="none" stroke="${A}" stroke-width="1.4" stroke-linecap="round"/></g>`;
  });
  g += `<ellipse cx="100" cy="86" rx="26" ry="7" fill="${SEAT}" stroke="${INK}" stroke-width="2.5"/>`;
  // the pod (torso) with wider hips, grey vent lines on the back
  g += `<path d="M82.4 52 Q76.5 84 100 85 Q123.5 84 117.6 52 Z" fill="url(#${u}h)" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/>`;
  g += `<path d="M90.4 63 H109.6 M90.4 69.5 H109.6" stroke="${BD}" stroke-width="2.4" stroke-linecap="round"/>`;
  // thighs ON TOP of the critter's back outline (hip → knee on the flank), then the cantle over the pod's bottom
  [L, R].forEach((X) => {
    const [hx, hy] = RB.hip, [kx, ky] = RB.knee, d = `M${X(hx)} ${hy} L${X(kx)} ${ky}`;
    g += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${B}" stroke-width="5.5" stroke-linecap="round"/>`;
  });
  // seat + two flaps draping down the flanks over the inner thighs (the outer thigh + knee stay visible)
    [L, R].forEach((X) => {
    g += `<path d="M${X(74)} 83 Q${X(62)} 90 ${X(59)} 104 L${X(70)} 106 Q${X(71)} 95 ${X(80)} 87 Z" fill="${SEAT}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    g += `<path d="M${X(72.5)} 88 Q${X(65)} 95 ${X(63)} 103" fill="none" stroke="${shade(SEAT, 0.4)}" stroke-width="1" stroke-dasharray="2 2"/>`;
  });
  g += `<path d="M78 80 Q100 88 122 80 Q124 85 121 88.5 Q100 96 79 88.5 Q76 85 78 80 Z" fill="${SEAT}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  g += `<path d="M81 82.5 Q100 89.5 119 82.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".5"/>`;
  [L, R].forEach((X) => { const [kx, ky] = RB.knee; g += `<circle cx="${X(kx)}" cy="${ky}" r="5" fill="${BD}" stroke="${INK}" stroke-width="2.2"/><circle cx="${X(kx)}" cy="${ky}" r="1.8" fill="${A}"/>`; });
  // head: the keeper's head (local 128 px space, scaled), collar ring, battery hatch, rival stripe, antenna
  g += `<line x1="100" y1="16" x2="100" y2="11" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`;
  g += `<circle cx="100" cy="9" r="4.5" fill="${A}" stroke="${INK}" stroke-width="2"/>`;
  let hd = keeperBackCollar(BD) + `<ellipse cx="64" cy="46" rx="33" ry="27" fill="url(#${u}h)" stroke="${INK}" stroke-width="3.5"/>`;
  hd += `<ellipse cx="52" cy="32" rx="9" ry="5" fill="#ffffff" opacity=".9" transform="rotate(-20 52 32)"/>`;
  if (stripe) hd += `<g clip-path="url(#${u}hc)"><rect x="57" y="10" width="14" height="32" fill="${A}"/><rect x="57" y="10" width="14" height="32" fill="none" stroke="${shade(A, -0.3)}" stroke-width="1.5"/></g><ellipse cx="64" cy="46" rx="33" ry="27" fill="none" stroke="${INK}" stroke-width="3.5"/>`;
  hd += keeperBackHatch(B, BD);
  g += `<g transform="translate(${H.cx} ${H.cy}) scale(${H.rx / 33} ${H.ry / 27}) translate(-64 -46)">${hd}</g>`;
  // arms: shoulder ball under the head, elbow out and back (below the fist), forearm up to the fist on the horn
  [[L, -1], [R, 1]].forEach(([X, m]) => {
    const a = cbAntenna(m), [sx, sy] = RB.shoulder, [ex, ey] = RB.elbow, [gx, gy] = a.grip;
    const d = `M${X(sx)} ${sy} L${X(ex)} ${ey} L${gx} ${gy}`;
    g += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${B}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<circle cx="${X(sx)}" cy="${sy}" r="4.8" fill="${BD}" stroke="${INK}" stroke-width="2.2"/>`;
    const ang = Math.atan2(a.tan[1], a.tan[0]) * 180 / Math.PI + 90;   // mitt across the horn
    g += `<g transform="translate(${gx} ${gy}) rotate(${ang})"><rect x="-6" y="-5" width="12" height="10" rx="5" fill="${A}" stroke="${INK}" stroke-width="2.4"/>` +
      `<path d="M${3 * m} -3 V3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/><circle cx="${-2.5 * m}" cy="-2" r="1.3" fill="#fff" opacity=".75"/></g>`;
  });
  return { defs, body: g };
}
function riderBack(id, pal, stripe) {
  const { W, H, cx, cy, rx, ry } = CB, u = `rb${id}`;
  const kr = keeperBackSeated(pal, u, stripe);
  const defs = kr.defs + blur(`${u}sb`, 3) +
    `<clipPath id="${u}on"><ellipse cx="${cx}" cy="${cy}" rx="${rx - 2}" ry="${ry - 2}"/></clipPath>` +
    `<filter id="${u}ds" x="-20%" y="-20%" width="140%" height="140%"><feOffset in="SourceAlpha" dy="4" result="o"/><feGaussianBlur in="o" stdDeviation="2.5" result="b"/>` +
    `<feFlood flood-color="#1a1440" flood-opacity=".25"/><feComposite in2="b" operator="in"/></filter>`;
  // contact shadow + the rider's drop shadow on the critter (clipped to the body)
  let g = `<g clip-path="url(#${u}on)"><ellipse cx="${cx}" cy="89" rx="26" ry="6" fill="#1a1440" opacity=".3" filter="url(#${u}sb)"/>` +
    `<g filter="url(#${u}ds)">${kr.body}</g></g>`;
  g += kr.body;
  return job(`assets/img/rider_${id}.png`, W, H, g, defs);
}
// Rival riders: the same keeper with other accent palettes (white head kept) + a coloured helmet stripe
// across the crown (one big accent mass, readable at 80 px) — real colours, not a tint.
const RIVALS = [["#ff8a3d"], ["#5fd36a"], ["#a06bff"], ["#ff5db1"], ["#ffd24a"]];
/* ---------------- 4. Environment ---------------- */
function pathTile() {   // moon-dust path, seamless 256 tile
  const S = 256, R = rng(21);
  const defs = blur("pdb", 7) + glow("pds", 1.5);
  let blobs = "", dots = "", craters = "", sparks = "";
  for (let i = 0; i < 16; i++) blobs += `<ellipse cx="${f2(R() * S)}" cy="${f2(R() * S)}" rx="${f2(18 + R() * 34)}" ry="${f2(10 + R() * 20)}" fill="${R() < 0.5 ? "#b3add6" : "#7d77a8"}" opacity=".45"/>`;
  for (let i = 0; i < 300; i++) { const l = R() < 0.4; dots += `<circle cx="${f2(R() * S)}" cy="${f2(R() * S)}" r="${f2(0.5 + R() * 1.3)}" fill="${l ? "#dcd8f2" : "#6c6694"}" opacity="${f2(0.4 + R() * 0.45)}"/>`; }
  for (let i = 0; i < 6; i++) {
    const x = R() * S, y = R() * S, r = 6 + R() * 10;
    craters += `<ellipse cx="${f2(x)}" cy="${f2(y + 1.5)}" rx="${f2(r + 2)}" ry="${f2(r * 0.62 + 1.5)}" fill="#c9c4e6" opacity=".7"/>` +
      `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(r)}" ry="${f2(r * 0.62)}" fill="#7a74a3"/>` +
      `<ellipse cx="${f2(x + r * 0.15)}" cy="${f2(y + r * 0.14)}" rx="${f2(r * 0.72)}" ry="${f2(r * 0.4)}" fill="#8f89b8"/>`;
  }
  for (let i = 0; i < 7; i++) sparks += `<path d="${star(R() * S, R() * S, 3.5 + R() * 3, 1.1, 4)}" fill="#ffffff" opacity="${f2(0.55 + R() * 0.4)}"/>`;
  let g = `<rect width="${S}" height="${S}" fill="#9893bf"/>`;
  g += `<g filter="url(#pdb)">${wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${blobs}</g>`)}</g>`;
  g += wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${craters}${dots}${sparks}</g>`);
  return job("assets/img/path.png", S, S, g, defs);
}
function arenaFloor() {  // glowing training-court floor, seamless 256 tile
  const S = 256, P = 128, R = rng(5), hh = S / 7, s = 64 / 3;
  const defs = rad("afp", [[0, "#3a2c80"], [1, "#261c5a"]], 0.5, 0.5, 0.75) + glow("afg", 3) +
    `<pattern id="afhex" width="64" height="${f2(hh)}" patternUnits="userSpaceOnUse"><path d="M0 ${f2(hh / 2)} L${f2(s / 2)} 0 L${f2(s * 1.5)} 0 L${f2(s * 2)} ${f2(hh / 2)} L${f2(s * 1.5)} ${f2(hh)} L${f2(s / 2)} ${f2(hh)} Z M${f2(s * 2)} ${f2(hh / 2)} H64" fill="none" stroke="#b9a2ff" stroke-width="1.4" opacity=".16"/></pattern>`;
  let g = `<rect width="${S}" height="${S}" fill="#1c1544"/>`;
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
    g += `<rect x="${x * P + 4}" y="${y * P + 4}" width="${P - 8}" height="${P - 8}" rx="12" fill="url(#afp)" opacity="${f2(0.85 + R() * 0.15)}"/>`;
    g += `<rect x="${x * P + 4}" y="${y * P + 4}" width="${P - 8}" height="${P - 8}" rx="12" fill="none" stroke="#5a46b8" stroke-width="2" opacity=".6"/>`;
  }
  g += `<rect width="${S}" height="${S}" fill="url(#afhex)"/>`;
  // glowing seams on the panel grid (lines at 0 and S are halves of the same seam)
  [0, P, S].forEach((v) => {
    g += `<path d="M${v} 0 V${S} M0 ${v} H${S}" stroke="#8a6cff" stroke-width="3" opacity=".45" filter="url(#afg)"/>`;
    g += `<path d="M${v} 0 V${S} M0 ${v} H${S}" stroke="#d8ccff" stroke-width="1" opacity=".5"/>`;
  });
  [0, P, S].forEach((x) => [0, P, S].forEach((y) => { g += `<circle cx="${x}" cy="${y}" r="5" fill="#3fe0e8" opacity=".85" filter="url(#afg)"/><circle cx="${x}" cy="${y}" r="2" fill="#e6fdff"/>`; }));
  [[64, 64], [192, 192]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="16" fill="none" stroke="#ff5db1" stroke-width="2" opacity=".28"/>`; });
  return job("assets/img/arena_floor.png", S, S, g, defs);
}
function spire() {   // forest "tree": crystal spire cluster on a rocky base (origin bottom-centre, base y≈192)
  const W = 120, H = 200;
  const defs = lin("spA", [[0, "#c8fbff"], [0.45, "#3fe0e8"], [1, "#7a5cff"]], 0, 0, 1, 1) + lin("spB", [[0, "#d7c4ff"], [1, "#5a3fc0"]], 1, 0, 0, 1) +
    lin("spR", [[0, "#6a70b4"], [1, "#2e3372"]]) + rad("spH", [[0, "#3fe0e8", 0.5], [1, "#3fe0e8", 0]]) + glow("spg", 3);
  let g = `<ellipse cx="60" cy="112" rx="58" ry="86" fill="url(#spH)"/>`;
  g += `<ellipse cx="60" cy="191" rx="46" ry="7" fill="#0b1030" opacity=".45"/>`;
  g += shardPath(36, 176, 92, 11, -8, "url(#spB)") + shardPath(86, 176, 108, 12, 8, "url(#spB)");
  g += shardPath(60, 174, 160, 17, 2, "url(#spA)");
  g += shardPath(48, 182, 48, 9, -4, "url(#spA)") + shardPath(74, 182, 56, 9, 5, "url(#spA)");
  g += `<path d="M10 192 Q8 176 24 172 Q30 160 46 166 Q60 156 76 166 Q92 160 100 172 Q114 176 110 192 Z" fill="url(#spR)" ${stk(3.5)}/>`;
  g += `<path d="M24 176 Q30 170 38 172 M78 170 Q88 166 96 174" fill="none" stroke="#9aa2e0" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`;
  [[18, 186, 6], [102, 187, 5]].forEach(([x, y, r]) => { g += `<ellipse cx="${x}" cy="${y}" rx="${r + 2}" ry="${r}" fill="#4a5094" ${stk(3)}/>`; });
  [[30, 60], [92, 44], [98, 110]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - i * 1.5, 2.4, 4)}" fill="#ffffff" filter="url(#spg)"/>`; });
  return job("assets/img/spire.png", W, H, g, defs);
}
function shrub() {   // low round glowing alien hedge (base y≈84)
  const W = 110, H = 90;
  const lobes = [[30, 46, 19], [55, 34, 23], [80, 46, 19], [18, 60, 15], [41, 56, 19], [69, 56, 19], [92, 60, 15]];
  const defs = `<linearGradient id="shL" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="82"><stop offset="0" stop-color="#b8ffd9"/><stop offset=".45" stop-color="#5fe0b0"/><stop offset="1" stop-color="#23847a"/></linearGradient>` +
    rad("shH", [[0, "#7cf0c0", 0.4], [1, "#7cf0c0", 0]]) + glow("shg", 2.5);
  const shape = (attr) => lobes.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" ${attr}/>`).join("") + `<rect x="6" y="56" width="98" height="24" rx="10" ${attr}/>`;
  let g = `<ellipse cx="55" cy="50" rx="54" ry="40" fill="url(#shH)"/>`;
  g += `<ellipse cx="55" cy="83" rx="48" ry="6" fill="#0b1030" opacity=".45"/>`;
  g += `<g transform="translate(55 82) scale(0.9) translate(-55 -82)">` + shape(`fill="${INK}" stroke="${INK}" stroke-width="7.8"`) + shape(`fill="url(#shL)"`);
  g += `<path d="M22 70 q6 -6 12 0 M48 68 q6 -6 12 0 M74 70 q6 -6 12 0 M36 46 q5 -5 10 0 M64 44 q5 -5 10 0" fill="none" stroke="#1f6f66" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`;
  g += `<path d="M38 28 Q48 16 62 16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".75"/>`;
  [[30, 40, "#ff7ad9"], [70, 30, "#ffd24a"], [86, 54, "#ff7ad9"], [52, 60, "#ffd24a"], [20, 64, "#a97bff"]].forEach(([x, y, c]) => { g += `<circle cx="${x}" cy="${y}" r="4.2" fill="${c}" stroke="${INK}" stroke-width="2" filter="url(#shg)"/><circle cx="${x - 1.2}" cy="${y - 1.2}" r="1.3" fill="#fff"/>`; });
  g += `</g>`;
  return job("assets/img/shrub.png", W, H, g, defs);
}
function pylon(cx, top, base, w, orb, c, u) {   // small lilac pylon with a glowing orb cap and a foot plate
  return `<ellipse cx="${cx}" cy="${base}" rx="${w * 0.66}" ry="${w * 0.2}" fill="#3a4790" ${stk(3)}/>` +
    `<rect x="${cx - w / 2}" y="${top}" width="${w}" height="${base - top}" rx="${w * 0.34}" fill="url(#${u}p)" ${stk(3.5)}/>` +
    `<path d="M${cx - w * 0.22} ${top + 6} V${base - 6}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>` +
    `<rect x="${cx - w / 2 + 3}" y="${base - (base - top) * 0.45}" width="${w - 6}" height="4" rx="2" fill="${c}" opacity=".9"/>` +
    `<circle cx="${cx}" cy="${top - orb * 0.4}" r="${orb}" fill="${c}" ${stk(2.8)} filter="url(#${u}g)"/><circle cx="${cx - orb * 0.3}" cy="${top - orb * 0.7}" r="${orb * 0.3}" fill="#fff"/>`;
}
function beamV() {   // jump obstacle laid ACROSS a left↔right run: far pylon top, near pylon bottom, energy bar between
  const W = 90, H = 200, cx = 45, u = "bv";
  const defs = lin(`${u}p`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0) + glow(`${u}g`, 3) + blur(`${u}b`, 3);
  let g = `<rect x="31" y="34" width="28" height="160" rx="14" fill="#0b1030" opacity=".28" filter="url(#${u}b)"/>`;
  g += `<rect x="38" y="40" width="14" height="140" rx="7" fill="#ff5db1" opacity=".18" filter="url(#${u}b)"/>`;
  g += pylon(cx, 22, 50, 20, 6, "#3fe0e8", u);                        // far pylon (smaller)
  // energy bar (long axis vertical on screen)
  g += `<rect x="${cx - 7}" y="16" width="14" height="128" rx="7" fill="#ff5db1" opacity=".55" filter="url(#${u}g)"/>`;
  g += `<rect x="${cx - 4.5}" y="16" width="9" height="128" rx="4.5" fill="#ff5db1" ${stk(2.5)}/>`;
  g += `<rect x="${cx - 1.6}" y="20" width="3.2" height="120" rx="1.6" fill="#ffe1f2"/>`;
  [44, 76, 108].forEach((y) => { g += `<path d="${star(cx, y, 7, 1.8, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  g += pylon(cx, 140, 186, 28, 8.5, "#3fe0e8", u);                    // near pylon in front
  return job("assets/img/beam_v.png", W, H, g, defs);
}
function cometRock() {   // jumpable barrier of space-rocks ACROSS the whole Star Ring road (placed with origin 0.5,0.5;
  // as long as the road is wide: road 160 + sand 2×12 → rocks span y 14..206 of 220)
  const W = 96, H = 220, u = "cr";
  const defs = rad(`${u}r`, [[0, "#d3cff2"], [0.55, "#8f8bc6"], [1, "#4c4f8c"]], 0.38, 0.3, 0.8) + glow(`${u}g`, 3) + blur(`${u}b`, 3) +
    lin(`${u}t`, [[0, "#ffd24a", 0], [0.6, "#ffb0dc", 0.7], [1, "#fff6c8", 1]], 1, 0, 0, 1);
  let g = `<ellipse cx="48" cy="206" rx="34" ry="8" fill="#0b1030" opacity=".4" filter="url(#${u}b)"/><rect x="24" y="14" width="48" height="190" rx="24" fill="#0b1030" opacity=".18" filter="url(#${u}b)"/>`;
  const rock = (x, y, r, seed) => {
    const R = rng(seed);
    let s = `<path d="${K.blob(x, y, r, r * 0.86, 9, 0.12, R)}" fill="url(#${u}r)" ${stk(3.5)}/>`;
    s += `<ellipse cx="${x + r * 0.25}" cy="${y + r * 0.15}" rx="${r * 0.26}" ry="${r * 0.17}" fill="#5c5f9e" opacity=".8"/><ellipse cx="${x - r * 0.35}" cy="${y + r * 0.35}" rx="${r * 0.15}" ry="${r * 0.1}" fill="#5c5f9e" opacity=".8"/>`;
    s += `<path d="M${x - r * 0.6} ${y - r * 0.2} Q${x - r * 0.45} ${y - r * 0.6} ${x - r * 0.05} ${y - r * 0.68}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    return s;
  };
  // far (top) rocks first so the nearer ones overlap them
  [[48, 30, 19, 3], [44, 62, 22, 8], [50, 96, 21, 13], [45, 129, 22, 21], [50, 161, 21, 34], [46, 191, 19, 55]].forEach(([x, y, r, k]) => { g += rock(x, y, r, k); });
  // comet streak landing on the second rock
  g += `<path d="M88 6 Q78 30 60 48 L56 44 Q76 24 84 4 Z" fill="url(#${u}t)" opacity=".9" filter="url(#${u}g)"/>`;
  g += `<circle cx="58" cy="47" r="6.5" fill="#fff6c8" filter="url(#${u}g)"/><circle cx="57" cy="46" r="3" fill="#fff"/>`;
  [[18, 24], [78, 110], [20, 170]].forEach(([x, y]) => { g += `<path d="${star(x, y, 5, 1.6, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/comet_rock.png", W, H, g, defs);
}

/* ---------------- 5. Buildings (stations): 240×210 family of pod_rest ---------------- */
// round plinth: top ellipse (cx,cy,rx,ry), side wall h; bottom at cy+h+ry
function plinth(cx, cy, rx, ry, h, accent, u) {
  return `<ellipse cx="${cx}" cy="${cy + h + 6}" rx="${rx + 14}" ry="${ry + 12}" fill="url(#${u}halo)"/>` +
    `<path d="M${cx - rx} ${cy} V${cy + h} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h} V${cy} Z" fill="url(#${u}pm)" ${stk(4)}/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3a4790" ${stk(4)}/>` +
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 14}" ry="${ry - 7}" fill="none" stroke="${accent}" stroke-width="3.5" opacity=".85" filter="url(#${u}gl)"/>` +
    [-0.6, 0, 0.6].map((t) => `<circle cx="${cx + t * rx}" cy="${cy + h * 0.5 + ry * Math.sqrt(1 - t * t)}" r="3.5" fill="${accent}" filter="url(#${u}gl)"/>`).join("");
}
const plinthDefs = (u, accent) => lin(`${u}pm`, [[0, "#5a67a8"], [1, "#2a3270"]]) + rad(`${u}halo`, [[0, accent, 0.42], [1, accent, 0]]) + glow(`${u}gl`, 4);
function jar(x, base, c, u) {   // little glowing nectar jar
  return `<rect x="${x - 9}" y="${base - 22}" width="18" height="22" rx="6" fill="#eef4ff" ${stk(2.8)}/>` +
    `<rect x="${x - 6.5}" y="${base - 14}" width="13" height="11.5" rx="4" fill="${c}" filter="url(#${u}gl)"/>` +
    `<rect x="${x - 10}" y="${base - 27}" width="20" height="7" rx="3" fill="#ffd24a" ${stk(2.5)}/>` +
    `<path d="M${x - 4.5} ${base - 18} V${base - 8}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;
}
function gem(x, base, h, c) {   // star shard gem standing on a counter
  return `<path d="M${x} ${base - h} L${x + h * 0.36} ${base - h * 0.45} L${x} ${base} L${x - h * 0.36} ${base - h * 0.45} Z" fill="${c}" ${stk(2.6)}/>` +
    `<path d="M${x} ${base - h} L${x - h * 0.08} ${base - h * 0.45} L${x} ${base} M${x - h * 0.36} ${base - h * 0.45} H${x + h * 0.36}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".6"/>`;
}
function market() {   // Star Market: dome shop with a striped awning and a counter of goods
  const W = 240, H = 210, u = "mk";
  const defs = plinthDefs(u, "#ffd24a") + lin(`${u}d`, [[0, "#b3a4ff"], [0.5, "#8170e0"], [1, "#4a3d9e"]]) +
    lin(`${u}w`, [[0, "#141a44"], [1, "#2b2f6e"]]) + rad(`${u}in`, [[0, "#ffd24a", 0.55], [1, "#ffd24a", 0]]) +
    lin(`${u}c`, [[0, "#5866b4"], [1, "#2c3577"]]) + `<clipPath id="${u}aw"><path id="${u}awp" d="AWNING"/></clipPath>`;
  let aw = "M46 72 H194 L190 94"; for (let k = 7; k >= 1; k--) { const x0 = 50 + k * 20; aw += ` Q${x0 - 10} 106 ${x0 - 20} 94`; } aw += " Z";
  let g = plinth(120, 160, 100, 24, 10, "#ffd24a", u);
  g += `<path d="M40 162 V112 Q40 42 120 38 Q200 42 200 112 V162 Q120 178 40 162 Z" fill="url(#${u}d)" ${stk(4)}/>`;
  g += `<path d="M58 100 Q60 62 104 52" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
  [[150, 60], [176, 86]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="6" fill="#ffd24a" opacity=".85" filter="url(#${u}gl)"/>`; });
  g += `<rect x="58" y="86" width="124" height="44" rx="12" fill="url(#${u}w)" ${stk(3.5)}/><ellipse cx="120" cy="112" rx="60" ry="22" fill="url(#${u}in)"/>`;
  // striped awning (scalloped)
  g += `<g clip-path="url(#${u}aw)"><rect x="40" y="66" width="160" height="44" fill="#fff4fb"/>${[0, 1, 2, 3, 4, 5, 6].filter((k) => k % 2 === 0).map((k) => `<rect x="${50 + k * 20}" y="66" width="20" height="44" fill="#ff5db1"/>`).join("")}<path d="M46 78 H194" stroke="#fff" stroke-width="3" opacity=".6"/></g>`;
  g += `<path d="${aw}" fill="none" ${stk(3.5)}/>`;
  // counter + goods
  g += `<rect x="46" y="126" width="148" height="30" rx="9" fill="url(#${u}c)" ${stk(3.5)}/><rect x="46" y="122" width="148" height="10" rx="5" fill="#c4bcf4" ${stk(3)}/>`;
  g += `<path d="${star(120, 142, 8, 3.4)}" fill="#ffd24a" ${stk(2)}/>`;
  g += jar(66, 122, "#ff5db1", u) + jar(90, 122, "#ff8fd0", u);
  g += gem(152, 122, 24, "#ffd24a") + gem(172, 122, 18, "#3fe0e8");
  // star finial on the dome
  g += `<rect x="117" y="24" width="6" height="16" rx="3" fill="#8592d6" ${stk(2.5)}/><path d="${star(120, 22, 15, 6.5)}" fill="#ffd24a" ${stk(3)} filter="url(#${u}gl)"/>`;
  [[30, 40], [210, 50]].forEach(([x, y]) => { g += `<path d="${star(x, y, 7, 2.4, 4)}" fill="#fff6c8" filter="url(#${u}gl)"/>`; });
  return job("assets/img/market.png", W, H, g, defs.replace("AWNING", aw));
}
function salon() {   // Glow Salon: rounded booth with a big mirror ring and glowing paint nozzles
  const W = 240, H = 210, u = "sl";
  const defs = plinthDefs(u, "#ff5db1") + lin(`${u}b`, [[0, "#ffc6e8"], [0.5, "#e07cc4"], [1, "#9a4a9e"]]) +
    lin(`${u}f`, [[0, "#fff1b0"], [0.5, "#ffd24a"], [1, "#d99a1e"]]) + rad(`${u}m`, [[0, "#ffffff"], [0.5, "#c9f6ff"], [1, "#8a9cf0"]], 0.4, 0.35, 0.75) +
    lin(`${u}n`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0);
  let g = plinth(120, 160, 100, 24, 10, "#ff5db1", u);
  // nozzle arms (behind the booth)
  const arm = (x0, y0, x1, y1, c) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${y1 - 18} ${x1} ${y1}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${y1 - 18} ${x1} ${y1}" fill="none" stroke="url(#${u}n)" stroke-width="5" stroke-linecap="round"/>` +
    `<rect x="${x1 - 9}" y="${y1 - 2}" width="18" height="16" rx="5" fill="#5866b4" ${stk(3)}/><circle cx="${x1}" cy="${y1 + 22}" r="6.5" fill="${c}" ${stk(2.5)} filter="url(#${u}gl)"/><circle cx="${x1}" cy="${y1 + 36}" r="4" fill="${c}" filter="url(#${u}gl)"/>`;
  g += arm(60, 110, 26, 72, "#3fe0e8") + arm(180, 110, 214, 72, "#ffd24a");
  g += `<path d="M50 162 V100 Q50 62 88 62 H152 Q190 62 190 100 V162 Q120 178 50 162 Z" fill="url(#${u}b)" ${stk(4)}/>`;
  g += `<path d="M62 150 V104 Q62 80 80 74" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>`;
  // big mirror ring with bulbs
  g += `<circle cx="120" cy="86" r="47" fill="url(#${u}f)" ${stk(4)}/><circle cx="120" cy="86" r="35" fill="url(#${u}m)" ${stk(3.5)}/>`;
  g += `<path d="M98 82 Q100 64 116 58 M104 96 L126 66" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; g += `<circle cx="${f2(120 + Math.cos(a) * 41)}" cy="${f2(86 + Math.sin(a) * 41)}" r="3.6" fill="${i % 2 ? "#ffffff" : "#ff9ed8"}" stroke="${INK}" stroke-width="1.6" filter="url(#${u}gl)"/>`; }
  // palette shelf with glowing colour blobs
  g += `<rect x="62" y="138" width="116" height="16" rx="8" fill="#5866b4" ${stk(3)}/>`;
  ["#ff5db1", "#ffd24a", "#3fe0e8", "#86e55a", "#a97bff"].forEach((c, i) => { const x = 76 + i * 22; g += `<path d="${K.blob(x, 136, 8.5, 6.5, 7, 0.12, rng(i + 3))}" fill="${c}" ${stk(2.4)} filter="url(#${u}gl)"/><circle cx="${x - 3}" cy="133" r="2" fill="#fff" opacity=".85"/>`; });
  [[36, 140], [204, 140]].forEach(([x, y]) => { g += `<path d="${star(x, y, 6, 2.2, 4)}" fill="#fff6c8" filter="url(#${u}gl)"/>`; });
  return job("assets/img/salon.png", W, H, g, defs);
}
// 3/4 star-crate: front-bottom-left corner at (x,y), scale s, outline sw (screen px)
function starCrate(x, y, s, sw, u) {
  const w = sw / s;
  return `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M0 0 V-40 H44 V0 Z" fill="url(#${u}cf)" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>` +
    `<path d="M0 -40 L14 -52 H58 L44 -40 Z" fill="url(#${u}ct)" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>` +
    `<path d="M44 0 V-40 L58 -52 V-12 Z" fill="url(#${u}cs)" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>` +
    `<path d="M4 -36 H40 M4 -4 H40" stroke="#ffd24a" stroke-width="${3.4}" opacity=".9"/>` +
    `<path d="M24 -40 L38 -52" stroke="#ffd24a" stroke-width="5"/><path d="M51 -6 V-46" stroke="#ffd24a" stroke-width="4" opacity=".8"/>` +
    `<path d="${star(22, -20, 11, 4.6)}" fill="#ffd24a" stroke="${INK}" stroke-width="${w * 0.7}" stroke-linejoin="round" filter="url(#${u}cg)"/>` +
    `<path d="M6 -32 V-10" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".55"/></g>`;
}
const crateDefs = (u) => lin(`${u}cf`, [[0, "#b9a8ff"], [1, "#6a54d8"]]) + lin(`${u}ct`, [[0, "#e4dcff"], [1, "#b7a6ff"]]) + lin(`${u}cs`, [[0, "#6a54d8"], [1, "#43349e"]]) + glow(`${u}cg`, 2);
function dock() {   // Delivery Dock: small hangar + stacked glowing crates + landing light
  const W = 240, H = 210, u = "dk";
  const defs = plinthDefs(u, "#3fe0e8") + crateDefs(u) + lin(`${u}h`, [[0, "#a7b2ee"], [0.5, "#6d7bc6"], [1, "#3a4590"]]) +
    lin(`${u}i`, [[0, "#0f1438"], [1, "#24306e"]]) + rad(`${u}il`, [[0, "#3fe0e8", 0.6], [1, "#3fe0e8", 0]]) + rad(`${u}bc`, [[0, "#ffd24a", 0.7], [1, "#ffd24a", 0]]);
  let g = plinth(120, 160, 104, 24, 10, "#3fe0e8", u);
  g += `<ellipse cx="120" cy="160" rx="70" ry="13" fill="none" stroke="#ffd24a" stroke-width="3" stroke-dasharray="10 9" opacity=".7"/>`;
  // landing-light mast (left)
  g += `<rect x="20" y="68" width="9" height="96" rx="4" fill="#8592d6" ${stk(3)}/><ellipse cx="24.5" cy="62" rx="16" ry="16" fill="url(#${u}bc)"/><circle cx="24.5" cy="62" r="8" fill="#ffd24a" ${stk(2.8)} filter="url(#${u}gl)"/><circle cx="22" cy="59.5" r="2.4" fill="#fff"/>`;
  // hangar
  g += `<path d="M42 162 V100 Q42 48 112 46 Q182 48 182 100 V162 Q112 176 42 162 Z" fill="url(#${u}h)" ${stk(4)}/>`;
  [70, 154].forEach((x) => { g += `<path d="M${x} ${x < 112 ? 62 : 62} Q${x + (x < 112 ? -14 : 14)} 100 ${x + (x < 112 ? -12 : 12)} 164" fill="none" stroke="#2f3a80" stroke-width="2.5" opacity=".6"/>`; });
  g += `<path d="M58 96 Q62 62 98 54" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  g += `<path d="M74 168 V114 Q74 86 112 84 Q150 86 150 114 V168 Q112 174 74 168 Z" fill="url(#${u}i)" ${stk(3.5)}/>`;
  g += `<ellipse cx="112" cy="146" rx="34" ry="22" fill="url(#${u}il)"/>`;
  g += starCrate(94, 166, 0.62, 3, u);
  g += `<rect x="80.5" y="92.5" width="63" height="3" rx="1.5" fill="#3fe0e8" opacity=".7" filter="url(#${u}gl)"/>`;   // a rect: a filtered H/V path has a 0-size bbox → no glow
  [[96, 40], [128, 40]].forEach(([x]) => { g += `<circle cx="${x}" cy="50" r="3.5" fill="#3fe0e8" filter="url(#${u}gl)"/>`; });
  // stacked crates (right)
  g += starCrate(160, 178, 0.68, 3.2, u) + starCrate(196, 172, 0.56, 3, u) + starCrate(170, 150, 0.6, 3, u);
  return job("assets/img/dock.png", W, H, g, defs);
}
function eggPath(cx, b, w, h) {   // egg standing on its base point (cx,b), half-width w, height h
  const t = b - h;
  return `M${f2(cx)} ${f2(t)} C${f2(cx + w * 0.72)} ${f2(t)} ${f2(cx + w)} ${f2(t + h * 0.5)} ${f2(cx + w)} ${f2(t + h * 0.66)} C${f2(cx + w)} ${f2(t + h * 0.92)} ${f2(cx + w * 0.55)} ${f2(b)} ${f2(cx)} ${f2(b)} C${f2(cx - w * 0.55)} ${f2(b)} ${f2(cx - w)} ${f2(t + h * 0.92)} ${f2(cx - w)} ${f2(t + h * 0.66)} C${f2(cx - w)} ${f2(t + h * 0.5)} ${f2(cx - w * 0.72)} ${f2(t)} ${f2(cx)} ${f2(t)} Z`;
}
function egg(cx, b, w, h, c, sw, gid) {
  let s = `<path d="${eggPath(cx, b, w, h)}" fill="url(#${gid})" ${stk(sw)}/>`;
  [[-0.35, 0.55, 0.22], [0.4, 0.4, 0.17], [0.15, 0.8, 0.2], [-0.1, 0.25, 0.12]].forEach(([dx, dy, r]) => { s += `<ellipse cx="${f2(cx + dx * w)}" cy="${f2(b - h + dy * h)}" rx="${f2(r * w * 1.3)}" ry="${f2(r * w)}" fill="${shade(c, -0.12)}" opacity=".75"/>`; });
  s += `<path d="M${f2(cx - w * 0.55)} ${f2(b - h * 0.55)} Q${f2(cx - w * 0.5)} ${f2(b - h * 0.85)} ${f2(cx - w * 0.15)} ${f2(b - h * 0.93)}" fill="none" stroke="#fff" stroke-width="${f2(sw * 1.1)}" stroke-linecap="round" opacity=".8"/>`;
  return s;
}
const eggDef = (id, c) => rad(id, [[0, "#ffffff"], [0.5, shade(c, 0.45)], [1, c]], 0.38, 0.3, 0.8);
function hatchery() {   // glass incubator dome with three colourful eggs
  const W = 240, H = 210, u = "ht";
  const defs = plinthDefs(u, "#ffd24a") + rad(`${u}gd`, [[0, "#ffffff", 0.55], [0.5, "#b8f6ff", 0.3], [1, "#57d6ff", 0.22]], 0.4, 0.3, 0.8) +
    rad(`${u}w`, [[0, "#ffd24a", 0.55], [1, "#ffd24a", 0]]) + eggDef(`${u}e1`, "#ff8fd0") + eggDef(`${u}e2`, "#5fe8ee") + eggDef(`${u}e3`, "#ffd24a") +
    rad(`${u}n`, [[0, "#ffe9c4"], [1, "#d39a6a"]], 0.5, 0.35, 0.7);
  let g = plinth(120, 156, 100, 26, 12, "#ffd24a", u);
  g += `<ellipse cx="120" cy="138" rx="78" ry="44" fill="url(#${u}w)"/>`;
  g += `<ellipse cx="120" cy="152" rx="62" ry="15" fill="url(#${u}n)" ${stk(3)}/>`;
  g += egg(90, 150, 17, 46, "#ff8fd0", 3, `${u}e1`) + egg(150, 150, 17, 46, "#5fe8ee", 3, `${u}e2`) + egg(120, 158, 20, 54, "#ffd24a", 3.2, `${u}e3`);
  g += `<path d="M34 156 Q32 50 120 42 Q208 50 206 156" fill="url(#${u}gd)" stroke="#c9f8ff" stroke-width="3" opacity=".9"/>`;
  g += `<path d="M34 156 Q32 50 120 42 Q208 50 206 156" fill="none" ${stk(4)} opacity=".9"/>`;
  g += `<path d="M56 124 Q58 74 104 58" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>`;
  g += `<path d="M34 156 A86 18 0 0 0 206 156" fill="none" stroke="#ffd24a" stroke-width="4" opacity=".8" filter="url(#${u}gl)"/>`;
  g += `<rect x="108" y="30" width="24" height="14" rx="6" fill="#8592d6" ${stk(3)}/><circle cx="120" cy="26" r="7" fill="#ffd24a" ${stk(2.5)} filter="url(#${u}gl)"/>`;
  [[170, 74], [70, 96], [158, 112]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - i, 2.4, 4)}" fill="#fff6c8" filter="url(#${u}gl)"/>`; });
  return job("assets/img/hatchery.png", W, H, g, defs);
}
function energyPad() {   // flat round charging platform with a lightning ring + a small pylon (240×150)
  const W = 240, H = 150, u = "ep", cx = 120, cy = 92;
  const defs = plinthDefs(u, "#ffd24a") + rad(`${u}c`, [[0, "#fff6c8", 0.9], [0.5, "#ffd24a", 0.45], [1, "#3fe0e8", 0.15]]) +
    lin(`${u}p`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0) + glow(`${u}g`, 3);
  let g = `<ellipse cx="${cx}" cy="106" rx="118" ry="42" fill="url(#${u}halo)"/>`;
  g += `<path d="M20 ${cy} V${cy + 14} A100 30 0 0 0 220 ${cy + 14} V${cy} Z" fill="url(#${u}pm)" ${stk(4)}/>`;
  g += `<ellipse cx="${cx}" cy="${cy}" rx="100" ry="30" fill="#2e3a80" ${stk(4)}/>`;
  g += `<ellipse cx="${cx}" cy="${cy}" rx="64" ry="18" fill="url(#${u}c)"/>`;
  // lightning ring: a zigzag loop
  let z = ""; const n = 40;
  for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2, r = i % 2 ? 1 : 0.9; z += (i ? "L" : "M") + f2(cx + Math.cos(a) * 80 * r) + " " + f2(cy + Math.sin(a) * 23 * r); }
  g += `<path d="${z}" fill="none" stroke="#ffd24a" stroke-width="4" stroke-linejoin="round" filter="url(#${u}gl)"/>`;
  g += `<path d="${z}" fill="none" stroke="#fff6c8" stroke-width="1.5" stroke-linejoin="round"/>`;
  // flat bolt glyph painted in the middle
  g += `<g transform="translate(${cx} ${cy}) scale(1 0.42)"><path d="M6 -34 L-18 4 H-2 L-8 34 L18 -6 H2 Z" fill="#ffd24a" ${stk(3)} filter="url(#${u}gl)"/></g>`;
  [-0.55, 0, 0.55].forEach((t) => { g += `<circle cx="${cx + t * 100}" cy="${f2(cy + 7 + 30 * Math.sqrt(1 - t * t))}" r="3.5" fill="#ffd24a" filter="url(#${u}gl)"/>`; });
  // small pylon at the back-right with a spark arc to the pad
  g += `<ellipse cx="190" cy="76" rx="14" ry="5" fill="#3a4790" ${stk(3)}/><rect x="182" y="26" width="16" height="50" rx="6" fill="url(#${u}p)" ${stk(3.5)}/><path d="M186 32 V70" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`;
  g += `<circle cx="190" cy="20" r="9" fill="#ffd24a" ${stk(2.8)} filter="url(#${u}gl)"/><circle cx="187" cy="17" r="2.6" fill="#fff"/>`;
  g += `<path d="M180 24 L168 36 L174 40 L160 54" fill="none" stroke="#fff6c8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#${u}gl)"/>`;
  return job("assets/img/energy_pad.png", W, H, g, defs);
}
function spiral(cx, cy, r0, r1, a0, turns, steps) {
  let d = "";
  for (let i = 0; i <= steps; i++) { const t = i / steps, r = r0 + (r1 - r0) * t, a = a0 + t * turns * Math.PI * 2; d += (i ? "L" : "M") + f2(cx + Math.cos(a) * r) + " " + f2(cy + Math.sin(a) * r); }
  return d;
}
function portal() {   // Wormhole: ring arch on a base with a swirling vortex
  const W = 240, H = 230, u = "pt", cx = 120, cy = 104, R = 86, r = 64;
  const defs = plinthDefs(u, "#a97bff") + rad(`${u}v`, [[0, "#ffffff"], [0.18, "#bff8ff"], [0.5, "#3fb8e8"], [0.8, "#6a3fc0"], [1, "#24124f"]]) +
    lin(`${u}r`, [[0, "#d7c4ff"], [0.5, "#8a6cf0"], [1, "#4a3a9e"]]) + `<clipPath id="${u}cl"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` + glow(`${u}g`, 3);
  let g = plinth(cx, 186, 92, 20, 10, "#a97bff", u);
  // struts
  g += `<path d="M48 186 L58 140 L76 146 L72 190 Z M192 186 L182 140 L164 146 L168 190 Z" fill="url(#${u}pm)" ${stk(3.5)}/>`;
  // vortex
  g += `<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="url(#${u}v)"/>`;
  g += `<g clip-path="url(#${u}cl)">${[0, 1, 2, 3].map((k) => `<path d="${spiral(cx, cy, 4, r + 6, k * Math.PI / 2, 0.9, 40)}" fill="none" stroke="${k % 2 ? "#ffffff" : "#c9a8ff"}" stroke-width="${k % 2 ? 4 : 6}" stroke-linecap="round" opacity="${k % 2 ? 0.7 : 0.55}"/>`).join("")}<circle cx="${cx}" cy="${cy}" r="10" fill="#fff" opacity=".9" filter="url(#${u}g)"/></g>`;
  // ring
  g += `<path d="M${cx - R} ${cy} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z M${cx - r} ${cy} a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 ${-2 * r} 0 Z" fill="url(#${u}r)" fill-rule="evenodd" ${stk(4)}/>`;
  g += `<path d="M${cx - 76} ${cy - 18} A78 78 0 0 1 ${cx - 30} ${cy - 72}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`;
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; g += `<circle cx="${f2(cx + Math.cos(a) * 75)}" cy="${f2(cy + Math.sin(a) * 75)}" r="4.2" fill="${i % 2 ? "#3fe0e8" : "#ff5db1"}" stroke="${INK}" stroke-width="1.8" filter="url(#${u}g)"/>`; }
  g += `<path d="M${cx} 4 L${cx + 13} 18 L${cx} 32 L${cx - 13} 18 Z" fill="#ffd24a" ${stk(3)} filter="url(#${u}g)"/>`;
  [[24, 60], [216, 80], [206, 30], [34, 140]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - (i % 2) * 2, 2.4, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/portal.png", W, H, g, defs);
}

/* ---------------- 6. Missions ---------------- */
function crateMarker() {   // floating glowing star-crate (bobs above the pickup point)
  const W = 110, H = 110, u = "cm";
  const defs = crateDefs(u) + rad(`${u}h`, [[0, "#ffd24a", 0.5], [1, "#ffd24a", 0]]) + glow(`${u}g`, 3);
  let g = `<circle cx="55" cy="56" r="52" fill="url(#${u}h)"/>`;
  g += starCrate(18, 94, 1.3, 4, u);
  [[14, 20], [96, 26], [94, 96]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - i, 2.2, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/crate.png", W, H, g, defs);
}
function target() {   // flat landing-target decal (top-down ellipse)
  const W = 220, H = 130, cx = 110, cy = 65, ry = 0.55, u = "tg";
  const defs = glow(`${u}g`, 3) + rad(`${u}o`, [[0, "#3fe0e8", 0.3], [0.7, "#3fe0e8", 0.12], [1, "#3fe0e8", 0]]);
  let g = `<ellipse cx="${cx}" cy="${cy}" rx="108" ry="${108 * ry}" fill="url(#${u}o)"/>`;
  [[90, "#3fe0e8", 6], [68, "#ff5db1", 6], [46, "#e8fdff", 4.5], [26, "#3fe0e8", 6]].forEach(([r, c, w]) => { g += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${f2(r * ry)}" fill="none" stroke="${c}" stroke-width="${w}" opacity=".95" filter="url(#${u}g)"/>`; });
  g += `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="${f2(12 * ry)}" fill="#ff5db1" filter="url(#${u}g)"/><ellipse cx="${cx - 3}" cy="${cy - 2}" rx="4" ry="2" fill="#fff" opacity=".8"/>`;
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => {
    const px = cx + dx * 79, py = cy + dy * 79 * ry, s = 8;
    const P = (a, b) => dx ? `${f2(px - dx * a * s)} ${f2(py + b * s * ry * 1.4)}` : `${f2(px + b * s)} ${f2(py - dy * a * s * ry)}`;
    g += `<path d="M${P(1, -1.2)} L${P(-0.6, 0)} L${P(1, 1.2)}" fill="none" stroke="#ffd24a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#${u}g)"/>`;
  });
  return job("assets/img/target.png", W, H, g, defs);
}

/* ---------------- 7. Chase: snatcher drone (dirSheet: up,left,down,right × blink 2) ---------------- */
// opts: { sw (outline), shadow (bool) }
function drone(dir, blink, u, o) {
  o = o || {};
  const sw = o.sw || 3.5, on = blink ? "#3fe0e8" : "#ff5db1";
  const defs = rad(`${u}b`, [[0, "#ffffff"], [0.5, "#cdbfff"], [1, "#7a62d6"]], 0.42, 0.3, 0.8) + lin(`${u}v`, [[0, "#2b3370"], [1, "#11153a"]]) +
    rad(`${u}l`, [[0, on, 0.75], [1, on, 0]]) + rad(`${u}pr`, [[0, "#ff4d6d", 0.7], [1, "#ff4d6d", 0]]) + rad(`${u}pb`, [[0, "#4d8bff", 0.7], [1, "#4d8bff", 0]]) +
    lin(`${u}cr`, [[0, "#ff4d6d", 0], [1, "#ff4d6d", 0.35]], 0, 0, 0, 1) + lin(`${u}cb`, [[0, "#4d8bff", 0], [1, "#4d8bff", 0.35]], 0, 0, 0, 1) + glow(`${u}gl`, 2.5) + blur(`${u}bl`, 3) + rad(`${u}e`, [[0, "#ffffff"], [0.45, "#bff8ff"], [1, "#3fb8e8"]], 0.4, 0.35, 0.7);
  const side = dir === "left" || dir === "right";
  let g = "";
  if (o.shadow !== false) g += `<ellipse cx="64" cy="117" rx="24" ry="6" fill="#0b1030" opacity=".45" filter="url(#${u}bl)"/>`;
  g += `<ellipse cx="64" cy="100" rx="13" ry="4" fill="#3fe0e8" opacity=".5" filter="url(#${u}bl)"/>`;
  // grabber claw
  const kx = side ? 56 : 64;
  g += `<path d="M64 84 L${kx} 97" stroke="${INK}" stroke-width="${sw + 5}" stroke-linecap="round"/><path d="M64 84 L${kx} 97" stroke="#c9d0e0" stroke-width="5" stroke-linecap="round"/>`;
  g += `<path d="M${kx - 8} 96 Q${kx - 11} 106 ${kx - 4} 109 M${kx + 8} 96 Q${kx + 11} 106 ${kx + 4} 109" fill="none" stroke="${INK}" stroke-width="${sw + 4}" stroke-linecap="round"/><path d="M${kx - 8} 96 Q${kx - 11} 106 ${kx - 4} 109 M${kx + 8} 96 Q${kx + 11} 106 ${kx + 4} 109" fill="none" stroke="#e4e8ff" stroke-width="3.5" stroke-linecap="round"/>`;
  g += `<circle cx="${kx}" cy="96" r="5" fill="#8592d6" stroke="${INK}" stroke-width="${sw * 0.75}"/>`;
  // propeller ring: back half, blur disc
  const rr = o.police ? 15 : 11;   // police (race) views: ring tilted forward ~9 deg → a rounder ellipse
  const ring = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw + 4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#e4e8ff" stroke-width="3.5" stroke-linecap="round"/>`;
  g += `<ellipse cx="64" cy="38" rx="44" ry="${rr}" fill="#e8f6ff" opacity=".22"/>`;
  g += ring(`M20 38 A44 ${rr} 0 0 1 108 38`);
  g += `<path d="M28 44 L38 52 M100 44 L90 52" stroke="${INK}" stroke-width="${sw + 2}" stroke-linecap="round"/>`;
  // body
  g += `<ellipse cx="64" cy="62" rx="32" ry="28" fill="url(#${u}b)" stroke="${INK}" stroke-width="${sw}"/>`;
  g += `<path d="M42 50 Q46 40 58 37" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
  // siren light on top (blinks pink / cyan between frames)
  if (o.police) {   // red / blue split siren (race chase view); front: dome x1.4 + two light cones
    g += `<circle cx="56" cy="27" r="23" fill="url(#${u}pr)"/><circle cx="72" cy="27" r="23" fill="url(#${u}pb)"/>`;
    if (dir === "down") g += `<path d="M60 24 L34 4 L50 2 Z" fill="url(#${u}cr)" filter="url(#${u}bl)"/><path d="M68 24 L94 4 L78 2 Z" fill="url(#${u}cb)" filter="url(#${u}bl)"/><g transform="translate(64 34) scale(1.4) translate(-64 -34)">`;
    g += `<rect x="54" y="31" width="20" height="6" rx="2.5" fill="#5866b4" stroke="${INK}" stroke-width="${sw * 0.75}"/>`;
    g += `<path d="M64 32 V21 Q56 21 56 32 Z" fill="#ff4d6d" filter="url(#${u}gl)"/><path d="M64 32 V21 Q72 21 72 32 Z" fill="#4d8bff" filter="url(#${u}gl)"/>`;
    g += `<path d="M56 32 Q56 21 64 21 Q72 21 72 32 Z M64 21 V32" fill="none" stroke="${INK}" stroke-width="${sw * 0.75}" stroke-linejoin="round"/><circle cx="59.5" cy="26" r="2" fill="#fff"/>`;
    if (dir === "down") g += `</g>`;
  } else {
    g += `<circle cx="64" cy="28" r="15" fill="url(#${u}l)"/>`;
    g += `<rect x="56" y="31" width="16" height="6" rx="2.5" fill="#5866b4" stroke="${INK}" stroke-width="${sw * 0.75}"/>`;
    g += `<path d="M57 32 Q57 21 64 21 Q71 21 71 32 Z" fill="${on}" stroke="${INK}" stroke-width="${sw * 0.75}" stroke-linejoin="round" filter="url(#${u}gl)"/><circle cx="61.5" cy="26" r="2" fill="#fff"/>`;
  }
  // face
  if (dir === "down") {
    g += `<rect x="40" y="50" width="48" height="26" rx="13" fill="url(#${u}v)" stroke="${INK}" stroke-width="${sw * 0.85}"/>`;
    g += `<circle cx="64" cy="63" r="9.5" fill="url(#${u}e)" filter="url(#${u}gl)"/><circle cx="67" cy="60" r="3" fill="#fff"/>`;
    if (o.police) {   // pursuer: a flat determined lid (angled down toward the centre) + a small straight mouth
      g += `<path d="M50 55 L64 59 L78 55 L78 51 L50 51 Z" fill="#1b1f4a"/><path d="M50 56 L64 60 L78 56" fill="none" stroke="#7a62d6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
      g += `<path d="M58 82 H70" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    } else {
      g += `<path d="M52 54 Q64 50 76 56" fill="none" stroke="#7a62d6" stroke-width="3" stroke-linecap="round"/>`;   // cheeky raised lid
      g += `<path d="M55 81 Q64 87 74 79" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      g += `<ellipse cx="44" cy="80" rx="5" ry="3" fill="#ff8fc4" opacity=".6"/><ellipse cx="84" cy="80" rx="5" ry="3" fill="#ff8fc4" opacity=".6"/>`;
    }
  } else if (side) {
    let f = `<rect x="30" y="50" width="30" height="26" rx="13" fill="url(#${u}v)" stroke="${INK}" stroke-width="${sw * 0.85}"/>`;
    f += `<ellipse cx="41" cy="63" rx="6.5" ry="9" fill="url(#${u}e)" filter="url(#${u}gl)"/><circle cx="39.5" cy="60" r="2.4" fill="#fff"/>`;
    f += `<path d="M35 81 Q41 86 49 80" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><ellipse cx="54" cy="80" rx="4.5" ry="2.8" fill="#ff8fc4" opacity=".6"/>`;
    f += `<circle cx="80" cy="62" r="7" fill="#9d8ce6" stroke="${INK}" stroke-width="${sw * 0.7}"/><circle cx="80" cy="62" r="2.5" fill="#5866b4"/>`;
    g += dir === "right" ? `<g transform="translate(128 0) scale(-1 1)">${f}</g>` : f;
  } else if (o.police) {   // back, chase view: an exhaust grille + two red rear lights (stern, not a face)
    g += `<rect x="44" y="50" width="40" height="20" rx="8" fill="url(#${u}v)" stroke="${INK}" stroke-width="${sw * 0.8}"/>`;
    g += `<path d="M52 54 V66 M58 54 V66 M64 54 V66 M70 54 V66 M76 54 V66" stroke="#5866b4" stroke-width="2.5" stroke-linecap="round"/>`;
    [38, 90].forEach((x) => { g += `<ellipse cx="${x}" cy="60" rx="7" ry="4.5" fill="#ff3b5c" opacity=".35" filter="url(#${u}bl)"/><rect x="${x - 4.5}" y="57.5" width="9" height="5" rx="2.5" fill="#ff3b5c" stroke="${INK}" stroke-width="1.8" filter="url(#${u}gl)"/>`; });   // pill tail-lights level with the grille
  } else {   // back: vents + status light
    g += `<path d="M50 56 H78 M52 64 H76 M56 72 H72" stroke="#7a62d6" stroke-width="3.5" stroke-linecap="round"/><circle cx="64" cy="82" r="3" fill="${on}" filter="url(#${u}gl)"/>`;
  }
  // propeller ring: front half
  g += ring(`M20 38 A44 ${rr} 0 0 0 108 38`);
  [[20, 38], [108, 38]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="4.5" fill="#8592d6" stroke="${INK}" stroke-width="${sw * 0.7}"/>`; });
  return { defs, body: g };
}
// The security drone seen from BEHIND (dir "up" of the same drone()), red/blue siren on top: the race
// sprite of the drone that catches up and passes the player in the chase race. 200x170 like critter_back.
function droneBack() {
  const r = drone("up", 0, "db", { police: true }), s = 1.3;
  return job("assets/img/drone_back.png", 200, 170, `<g transform="translate(${100 - 64 * s} 0) scale(${s})">${r.body}</g>`, r.defs);
}
// The same drone seen from the FRONT (dir "down": glowing eye, cheeky face), red/blue siren on top —
// the pursuer shown in the chase race's rear-view holo-screen. 200x170, shadow base at y ~160.
function droneFront() {
  const r = drone("down", 0, "df", { police: true }), s = 1.3;
  return job("assets/img/drone_front.png", 200, 170, `<g transform="translate(${100 - 64 * s} 0) scale(${s})">${r.body}</g>`, r.defs);
}
function droneSheet() {
  let defs = ""; const frames = [];
  ["up", "left", "down", "right"].forEach((d, r) => [0, 1].forEach((b) => { const res = drone(d, b, `dr${r}${b}`); defs += res.defs; frames.push(res.body); }));
  return job("assets/sheet/drone.png", 256, 512, sheet(frames, 128, 128, 2), defs);
}

// Comet Race START gate (race overlay, seen from behind/above, spans the road): two glowing pylons at the
// edges + a holographic chequered band across the top; the middle/bottom stay transparent. 400x220.
function startGate() {
  const W = 400, H = 220, u = "sg";
  const defs = lin(`${u}p`, [[0, "#6c79c2"], [0.5, "#3a4790"], [1, "#222a66"]], 0, 0, 1, 0) + lin(`${u}b`, [[0, "#ff5db1", 0.35], [0.5, "#a97bff", 0.28], [1, "#3fe0e8", 0.35]], 0, 0, 1, 0) +
    rad(`${u}h`, [[0, "#3fe0e8", 0.5], [1, "#3fe0e8", 0]]) + rad(`${u}k`, [[0, "#ff5db1", 0.5], [1, "#ff5db1", 0]]) + glow(`${u}gl`, 3) + blur(`${u}bl`, 4);
  let g = "";
  // pylons (base on y 215), glowing strip + caps
  [[26, "#3fe0e8", `${u}h`], [374, "#ff5db1", `${u}k`]].forEach(([x, c, halo]) => {
    g += `<ellipse cx="${x}" cy="213" rx="16" ry="4" fill="#0b1030" opacity=".45" filter="url(#${u}bl)"/>`;
    g += `<ellipse cx="${x}" cy="120" rx="22" ry="100" fill="url(#${halo})"/>`;
    g += `<path d="M${x - 10} 215 L${x - 8} 30 Q${x} 22 ${x + 8} 30 L${x + 10} 215 Z" fill="url(#${u}p)" ${stk(3.5)}/>`;
    g += `<path d="M${x + 5} 213 L${x + 4.5} 31 Q${x + 7} 31 ${x + 8} 33 L${x + 9.5} 213 Z" fill="#141a45" opacity=".55"/>`;   // darker side face
    g += `<rect x="${x - 2}" y="38" width="4" height="169" rx="2" fill="${c}" filter="url(#${u}gl)"/>`;   // rect, not a V path: filters need a non-empty bbox
    g += `<rect x="${x - 14}" y="203" width="28" height="12" rx="4" fill="#2c3577" ${stk(3)}/>`;
    g += `<circle cx="${x}" cy="24" r="8" fill="${c}" ${stk(3)} filter="url(#${u}gl)"/><circle cx="${x - 2.5}" cy="21.5" r="2.5" fill="#fff" opacity=".9"/>`;
  });
  // holographic band (y 15..60): translucent glow, chequered light strip, edge rails, orbiting lights
  const x0 = 34, x1 = 366, y0 = 18, y1 = 58;
  g += `<rect x="${x0}" y="${y0 - 3}" width="${x1 - x0}" height="${y1 - y0 + 6}" rx="8" fill="url(#${u}b)" filter="url(#${u}bl)"/>`;
  g += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="6" fill="#1b1f4a" opacity=".55"/>`;
  const n = 16, cw = (x1 - x0 - 16) / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2 === 0)
    g += `<rect x="${(x0 + 8 + i * cw).toFixed(1)}" y="${26 + j * 12}" width="${cw.toFixed(1)}" height="12" fill="#ffffff" opacity=".85"/>`;
  g += `<rect x="${x0 + 8}" y="26" width="${x1 - x0 - 16}" height="24" fill="none" stroke="#ffffff" stroke-width="1.5" opacity=".6"/>`;
  [[y0, "#ff5db1"], [y1, "#3fe0e8"]].forEach(([y, c]) => { g += `<rect x="${x0 - 3.75}" y="${y - 3.75}" width="${x1 - x0 + 7.5}" height="7.5" rx="3.75" fill="${INK}"/><rect x="${x0 - 2.25}" y="${y - 2.25}" width="${x1 - x0 + 4.5}" height="4.5" rx="2.25" fill="${c}" filter="url(#${u}gl)"/>`; });
  for (let i = 0; i < 9; i++) { const x = x0 + 18 + i * ((x1 - x0 - 36) / 8), y = i % 2 ? y0 - 1 : y1 + 1, c = i % 2 ? "#ff8fd0" : "#9ff7ff";
    g += `<circle cx="${x.toFixed(1)}" cy="${y}" r="3.5" fill="${c}" filter="url(#${u}gl)"/><circle cx="${x.toFixed(1)}" cy="${y}" r="1.4" fill="#fff"/>`; }
  [[60, 24], [200, 52], [340, 22]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 6 - i % 2, 2.2, 4)}" fill="#fff6c8" filter="url(#${u}gl)"/>`; });
  return job("assets/img/start_gate.png", W, H, g, defs);
}
/* ---------------- 8. Race props (upright billboards) ---------------- */
function asteroid() {
  const W = 140, H = 120, u = "as";
  const defs = rad(`${u}r`, [[0, "#e0dcff"], [0.5, "#9a95cf"], [1, "#4c4f8c"]], 0.35, 0.3, 0.85) + rad(`${u}h`, [[0, "#a97bff", 0.45], [1, "#a97bff", 0]]) + blur(`${u}b`, 3);
  let g = `<ellipse cx="70" cy="60" rx="70" ry="60" fill="url(#${u}h)"/>`;
  g += `<ellipse cx="70" cy="110" rx="44" ry="6" fill="#0b1030" opacity=".4" filter="url(#${u}b)"/>`;
  g += `<path d="${K.blob(70, 58, 54, 46, 11, 0.1, rng(9))}" fill="url(#${u}r)" ${stk(4)}/>`;
  [[48, 52, 11], [86, 40, 8], [84, 76, 13], [56, 84, 6]].forEach(([x, y, r]) => {
    g += `<ellipse cx="${x}" cy="${y + 1.5}" rx="${r + 1.5}" ry="${r * 0.75 + 1.5}" fill="#d6d2f2" opacity=".7"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.75}" fill="#5c5f9e"/><ellipse cx="${x + r * 0.2}" cy="${y + r * 0.2}" rx="${r * 0.6}" ry="${r * 0.4}" fill="#6e72b0"/>`;
  });
  g += `<path d="M30 46 Q38 24 62 18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
  return job("assets/img/asteroid.png", W, H, g, defs);
}
function beacon() {   // glowing traffic beacon (space buoy cone)
  const W = 90, H = 130, u = "bc";
  const defs = lin(`${u}c`, [[0, "#ffffff"], [0.5, "#ffd6ef"], [1, "#e58ac4"]], 0, 0, 1, 0) + rad(`${u}h`, [[0, "#ffd24a", 0.6], [1, "#ffd24a", 0]]) + glow(`${u}g`, 3) + blur(`${u}b`, 2.5) +
    `<clipPath id="${u}cl"><path d="M39 24 Q45 16 51 24 L70 104 H20 Z"/></clipPath>`;
  let g = `<ellipse cx="45" cy="121" rx="32" ry="5" fill="#0b1030" opacity=".45" filter="url(#${u}b)"/>`;
  g += `<circle cx="45" cy="18" r="20" fill="url(#${u}h)"/>`;
  g += `<path d="M39 24 Q45 16 51 24 L70 104 H20 Z" fill="url(#${u}c)"/>`;
  g += `<g clip-path="url(#${u}cl)"><rect x="0" y="44" width="90" height="14" fill="#ff5db1"/><rect x="0" y="74" width="90" height="14" fill="#ff5db1"/><path d="M36 30 L28 100" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></g>`;
  g += `<path d="M39 24 Q45 16 51 24 L70 104 H20 Z" fill="none" ${stk(3.5)}/>`;
  g += `<rect x="10" y="100" width="70" height="16" rx="7" fill="#5866b4" ${stk(3.5)}/><path d="M18 105 H72" stroke="#9aa6e6" stroke-width="2.5" stroke-linecap="round"/>`;
  [24, 45, 66].forEach((x) => { g += `<circle cx="${x}" cy="110" r="2.6" fill="#3fe0e8" filter="url(#${u}g)"/>`; });
  g += `<circle cx="45" cy="16" r="8.5" fill="#ffd24a" ${stk(2.8)} filter="url(#${u}g)"/><circle cx="42.5" cy="13.5" r="2.5" fill="#fff"/>`;
  return job("assets/img/beacon.png", W, H, g, defs);
}

/* ---------------- 10. Space-station world (void, road, districts, city props) ---------------- */
// Seamless tiles: every element is drawn at the 9 wrap offsets (wrapAll) or kept on the
// tile grid, and nothing is directional (tiles are laid in horizontal AND vertical strips).
function voidTile() {   // deep space around the station (512, darker than the deck `ground`)
  const S = 512, R = rng(41);
  const defs = blur("vdb", 26) + glow("vdg", 1.6);
  let wisps = "", stars = "", twinkles = "";
  [["#6a3fc0", 0.24], ["#1f8fb0", 0.18], ["#6a3fc0", 0.15], ["#2a5fd0", 0.15], ["#1f8fb0", 0.12], ["#a97bff", 0.1]].forEach(([c, o]) => {
    const x = R() * S, y = R() * S, rx = 60 + R() * 90, ry = 26 + R() * 46, a = f2(R() * 180);
    wisps += `<ellipse cx="0" cy="0" rx="${f2(rx)}" ry="${f2(ry)}" fill="${c}" opacity="${o}" transform="translate(${f2(x)} ${f2(y)}) rotate(${a})"/>`;
  });
  for (let i = 0; i < 260; i++) {
    const big = R() < 0.12, r = big ? 1.2 + R() * 0.9 : 0.35 + R() * 0.8;
    const col = R() < 0.2 ? "#bff6ff" : R() < 0.15 ? "#ffd6f0" : "#ffffff";
    stars += `<circle cx="${f2(R() * S)}" cy="${f2(R() * S)}" r="${f2(r)}" fill="${col}" opacity="${f2(big ? 0.75 + R() * 0.25 : 0.25 + R() * 0.5)}"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const x = R() * S, y = R() * S, s = 5 + R() * 4;
    twinkles += `<path d="${star(x, y, s, 1.1, 4)}" fill="#ffffff" opacity=".9" filter="url(#vdg)"/><circle cx="${f2(x)}" cy="${f2(y)}" r="1.5" fill="#fff"/>`;
  }
  let g = `<rect width="${S}" height="${S}" fill="#0a0e29"/>`;
  g += `<g filter="url(#vdb)">${wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${wisps}</g>`)}</g>`;
  g += wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${stars}${twinkles}</g>`);
  return job("assets/img/void.png", S, S, g, defs);
}
function roadTile() {   // glowing space highway: hex paving with cyan seams (256, 8 hex columns × 7 rows)
  const S = 256, R = rng(57), cw = 32, hh = S / 7, rr = cw / 1.5;   // column step, row height, hex radius
  const defs = glow("rdg", 2.2) + lin("rdh", [[0, "#2c3478"], [1, "#1f2559"]]) + glow("rds", 1.2);
  const hex = (x, y, k) => { const a = rr * k, b = (hh / 2) * k;
    return `M${f2(x - a)} ${f2(y)} L${f2(x - a / 2)} ${f2(y - b)} L${f2(x + a / 2)} ${f2(y - b)} L${f2(x + a)} ${f2(y)} L${f2(x + a / 2)} ${f2(y + b)} L${f2(x - a / 2)} ${f2(y + b)} Z`; };
  let seams = "", cells = "", sparks = "";
  const cols = ["#262d6a", "#232a63", "#20275c", "#2a3170"];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 7; j++) {
    const x = i * cw, y = j * hh + (i % 2 ? hh / 2 : 0), c = cols[Math.floor(R() * cols.length)];
    seams += `<path d="${hex(x, y, 1)}" fill="none" stroke="#3fe0e8" stroke-width="2.2" opacity=".42"/>`;
    cells += `<path d="${hex(x, y, 0.86)}" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="${hex(x, y, 0.62)}" fill="#ffffff" opacity=".035"/>`;
  }
  for (let i = 0; i < 9; i++) sparks += `<path d="${star(R() * S, R() * S, 2.6 + R() * 1.8, 0.8, 4)}" fill="#dffcff" opacity="${f2(0.55 + R() * 0.4)}" filter="url(#rds)"/>`;
  let g = `<rect width="${S}" height="${S}" fill="#141a48"/>`;
  g += `<g filter="url(#rdg)">${wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${seams}</g>`)}</g>`;
  g += wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})">${cells}</g>`);
  g += wrapAll(S, S, (ox, oy) => `<g transform="translate(${ox} ${oy})"><g opacity=".9">${seams.replace(/stroke-width="2.2" opacity=".42"/g, 'stroke-width="0.8" opacity=".35"').replace(/#3fe0e8/g, "#d8fdff")}</g>${sparks}</g>`);
  return job("assets/img/road.png", S, S, g, defs);
}
function plazaTile() {   // warm-lit plaza floor: 2×2 big rounded panels, gold inlay, light studs at the corners
  const S = 256, P = 128;
  const defs = rad("plp", [[0, "#3f6a8c"], [0.7, "#365a80"], [1, "#344672"]], 0.5, 0.5, 0.75) +
    rad("plw", [[0, "#ffc86a", 0.2], [1, "#ffd24a", 0]]) + glow("plg", 2.5);
  let g = `<rect width="${S}" height="${S}" fill="#1a2350"/>`;
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
    const X = x * P, Y = y * P;
    g += `<rect x="${X + 5}" y="${Y + 5}" width="${P - 10}" height="${P - 10}" rx="20" fill="url(#plp)"/>`;
    g += `<rect x="${X + 5}" y="${Y + 5}" width="${P - 10}" height="${P - 10}" rx="20" fill="url(#plw)"/>`;
    g += `<rect x="${X + 5}" y="${Y + 5}" width="${P - 10}" height="${P - 10}" rx="20" fill="none" stroke="#5a78b4" stroke-width="2" opacity=".55"/>`;
    g += `<rect x="${X + 18}" y="${Y + 18}" width="${P - 36}" height="${P - 36}" rx="12" fill="none" stroke="#ffd24a" stroke-width="1.6" opacity=".55"/>`;
    g += `<path d="${star(X + 64, Y + 64, 10, 3.6, 4)}" fill="none" stroke="#ffd24a" stroke-width="1.4" opacity=".5"/>`;
    [[18, 64], [110, 64], [64, 18], [64, 110]].forEach(([a, b]) => { g += `<circle cx="${X + a}" cy="${Y + b}" r="2" fill="#ffd24a" opacity=".6"/>`; });
  }
  // round light studs where four panels meet (0 and S are halves of the same stud)
  [0, P, S].forEach((x) => [0, P, S].forEach((y) => {
    g += `<circle cx="${x}" cy="${y}" r="7" fill="#141a44"/><circle cx="${x}" cy="${y}" r="4.2" fill="#ffe69a" filter="url(#plg)"/><circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`;
  }));
  return job("assets/img/plaza.png", S, S, g, defs);
}
function walkwayTile() {   // light walkway: pale lilac-grey panels with a dotted grip pattern (128)
  const S = 128, P = 64;
  const defs = lin("wwp", [[0, "#7d8cc8"], [1, "#6b7ab8"]], 0, 0, 1, 1);
  let g = `<rect width="${S}" height="${S}" fill="#4a5795"/>`;
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
    const X = x * P, Y = y * P;
    g += `<rect x="${X + 2}" y="${Y + 2}" width="${P - 4}" height="${P - 4}" rx="7" fill="${(x + y) % 2 ? "#7383c0" : "#6f7fbc"}"/>`;
    g += `<rect x="${X + 2.5}" y="${Y + 2.5}" width="${P - 5}" height="${P - 5}" rx="6.5" fill="none" stroke="#97a5dc" stroke-width="1.2" opacity=".6"/>`;
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      const cx = X + 12 + i * 8, cy = Y + 12 + j * 8;
      g += `<circle cx="${cx}" cy="${cy + 0.6}" r="1.6" fill="#9eacdf" opacity=".7"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="#56639f"/>`;
    }
  }
  return job("assets/img/walkway.png", S, S, g, defs);
}
function rimTile() {   // glowing teal metal trim (64): symmetric cells so it reads the same in H and V strips
  const S = 64, P = 32;
  const defs = rad("rmh", [[0, "#8ef0f6"], [0.55, "#3fcdd8"], [1, "#2a9fb0"]], 0.5, 0.5, 0.72);
  let g = `<rect width="${S}" height="${S}" fill="#1e8f9e"/>`;
  for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
    const X = x * P, Y = y * P;
    g += `<rect x="${X + 1}" y="${Y + 1}" width="${P - 2}" height="${P - 2}" rx="4" fill="url(#rmh)"/>`;
    g += `<circle cx="${X + 16}" cy="${Y + 16}" r="3.2" fill="#167a88"/><circle cx="${X + 16}" cy="${Y + 16}" r="2.3" fill="#9cf2f6"/><circle cx="${X + 15.3}" cy="${Y + 15.3}" r="0.9" fill="#ffffff"/>`;
  }
  return job("assets/img/rim.png", S, S, g, defs);
}
function rail() {   // road guard-rail segment: two chunky posts + a glowing bar, amber lights on the caps (base y≈64)
  const W = 110, H = 72, u = "rl";
  const defs = lin(`${u}p`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0) + lin(`${u}b`, [[0, "#c8fbff"], [0.5, "#3fe0e8"], [1, "#1f9fb0"]]) +
    glow(`${u}g`, 2.5) + blur(`${u}s`, 2.5) + rad(`${u}a`, [[0, "#ffd24a", 0.7], [1, "#ffd24a", 0]]);
  let g = `<ellipse cx="55" cy="63" rx="50" ry="5" fill="#0b1030" opacity=".45" filter="url(#${u}s)"/>`;
  g += `<rect x="16" y="34" width="78" height="14" rx="7" fill="#3fe0e8" opacity=".5" filter="url(#${u}g)"/>`;
  const post = (x) => `<ellipse cx="${x}" cy="61" rx="12" ry="4.5" fill="#3a4790" ${stk(3)}/>` +
    `<rect x="${x - 8}" y="22" width="16" height="39" rx="6" fill="url(#${u}p)" ${stk(3)}/>` +
    `<path d="M${x - 3.5} 28 V55" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>` +
    `<circle cx="${x}" cy="20" r="11" fill="url(#${u}a)"/><circle cx="${x}" cy="20" r="6" fill="#ffb43a" ${stk(2.6)} filter="url(#${u}g)"/><circle cx="${x - 1.8}" cy="18.2" r="1.8" fill="#fff6c8"/>`;
  g += post(18) + post(92);
  g += `<rect x="20" y="33" width="70" height="13" rx="6.5" fill="url(#${u}b)" ${stk(3)}/>`;
  g += `<path d="M26 37.5 H84" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>`;
  [38, 55, 72].forEach((x) => { g += `<circle cx="${x}" cy="42" r="1.6" fill="#0f6b78" opacity=".7"/>`; });
  return job("assets/img/rail.png", W, H, g, defs);
}
function bollard() {   // road-edge light post, the same in every direction (hedge along the road; base y≈64)
  const W = 48, H = 72, u = "bo";
  const defs = lin(`${u}p`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0) + glow(`${u}g`, 2.5) + blur(`${u}s`, 2.5) +
    rad(`${u}a`, [[0, "#ffd24a", 0.7], [1, "#ffd24a", 0]]) + rad(`${u}r`, [[0, "#3fe0e8", 0.55], [1, "#3fe0e8", 0]]);
  let g = `<ellipse cx="24" cy="62" rx="22" ry="7" fill="url(#${u}r)"/>`;
  g += `<ellipse cx="24" cy="61" rx="13" ry="4.5" fill="#3a4790" ${stk(3)}/>`;
  g += `<rect x="16" y="24" width="16" height="37" rx="6" fill="url(#${u}p)" ${stk(3)}/>`;
  g += `<rect x="16" y="40" width="16" height="6" fill="#3fe0e8" opacity=".85"/><rect x="16" y="24" width="16" height="37" rx="6" fill="none" ${stk(3)}/>`;
  g += `<path d="M20.5 29 V55" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`;
  g += `<circle cx="24" cy="20" r="12" fill="url(#${u}a)"/><circle cx="24" cy="20" r="6.5" fill="#ffb43a" ${stk(2.6)} filter="url(#${u}g)"/><circle cx="22" cy="18" r="2" fill="#fff6c8"/>`;
  return job("assets/img/bollard.png", W, H, g, defs);
}
function rock() {   // floating asteroid cluster with a teal rim light and a glow under it (base y≈100)
  const W = 130, H = 110, u = "rk";
  const defs = rad(`${u}r`, [[0, "#c9c3ee"], [0.5, "#8a84c2"], [1, "#4b4c8a"]], 0.4, 0.32, 0.85) +
    rad(`${u}h`, [[0, "#3fe0e8", 0.38], [0.6, "#a97bff", 0.14], [1, "#a97bff", 0]]) + blur(`${u}b`, 3);
  let g = `<ellipse cx="64" cy="98" rx="54" ry="10" fill="url(#${u}h)"/>`;
  g += `<ellipse cx="64" cy="98" rx="30" ry="4" fill="#3fe0e8" opacity=".25" filter="url(#${u}b)"/>`;
  const one = (x, y, rx, ry, seed, k) => {
    const d = K.blob(x, y, rx, ry, 9, 0.11, rng(seed)), id = `${u}c${k}`;
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">`;
    s += `<path d="${d}" fill="#7ff3ff"/><path d="${d}" fill="url(#${u}r)" transform="translate(${f2(-rx * 0.13)} ${f2(ry * 0.13)})"/>`;
    const Rc = rng(seed + 5);
    [[-0.3, 0.05, 0.28], [0.25, 0.35, 0.2], [0.05, -0.35, 0.16]].forEach(([a, b, r]) => {
      const cx = x + a * rx, cy = y + b * ry, cr = r * rx * (0.85 + Rc() * 0.3);
      s += `<ellipse cx="${f2(cx)}" cy="${f2(cy + 1.2)}" rx="${f2(cr + 1.2)}" ry="${f2(cr * 0.72 + 1.2)}" fill="#d6d2f2" opacity=".55"/><ellipse cx="${f2(cx)}" cy="${f2(cy)}" rx="${f2(cr)}" ry="${f2(cr * 0.72)}" fill="#55578f"/><ellipse cx="${f2(cx + cr * 0.2)}" cy="${f2(cy + cr * 0.2)}" rx="${f2(cr * 0.6)}" ry="${f2(cr * 0.4)}" fill="#66689f"/>`;
    });
    s += `</g><path d="${d}" fill="none" ${stk(3.5)}/>`;
    s += `<path d="M${f2(x - rx * 0.62)} ${f2(y - ry * 0.12)} Q${f2(x - rx * 0.5)} ${f2(y - ry * 0.62)} ${f2(x - rx * 0.05)} ${f2(y - ry * 0.7)}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
    return s;
  };
  g += one(100, 46, 15, 13, 31, 1) + one(58, 52, 36, 31, 17, 0) + one(26, 74, 14, 12, 23, 2);
  [[112, 18], [14, 40]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 5 - i, 1.5, 4)}" fill="#dffcff" opacity=".9"/>`; });
  return job("assets/img/rock.png", W, H, g, defs);
}
// 3/4 box: front face (x..x+w, bottom y, height h), oblique top/side of depth d
function cargoBox(x, y, w, h, d, c, u, k, logo) {
  const cD = shade(c, -0.25), cL = shade(c, 0.35), id = `${u}f${k}`;
  let s = `<path d="M${x + w} ${y} V${y - h} L${x + w + d} ${y - h - d} V${y - d} Z" fill="${cD}" ${stk(3.2)}/>`;
  s += `<path d="M${x} ${y - h} L${x + d} ${y - h - d} H${x + w + d} L${x + w} ${y - h} Z" fill="${cL}" ${stk(3.2)}/>`;
  s += `<clipPath id="${id}"><rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="5"/></clipPath>`;
  s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="5" fill="${c}"/>`;
  s += `<g clip-path="url(#${id})">`;
  for (let rx = x + 9; rx < x + w - 4; rx += 9) s += `<path d="M${rx} ${y - h + 5} V${y - 5}" stroke="${cD}" stroke-width="2.6" stroke-linecap="round" opacity=".55"/><path d="M${rx + 2.2} ${y - h + 6} V${y - 6}" stroke="${cL}" stroke-width="1.2" opacity=".6"/>`;
  // hazard stripes along the bottom-left
  s += `<rect x="${x}" y="${y - 9}" width="${Math.min(30, w * 0.4)}" height="9" fill="#ffd24a"/>`;
  for (let i = -1; i < 6; i++) s += `<path d="M${x + i * 7} ${y} L${x + i * 7 + 9} ${y - 9} L${x + i * 7 + 12.5} ${y - 9} L${x + i * 7 + 3.5} ${y} Z" fill="${INK}" opacity=".85"/>`;
  s += `<rect x="${x + Math.min(30, w * 0.4)}" y="${y - 10}" width="${w}" height="10" fill="${c}"/>`;
  for (let rx = x + 9; rx < x + w - 4; rx += 9) if (rx > x + Math.min(30, w * 0.4)) s += `<path d="M${rx} ${y - 10} V${y - 5}" stroke="${cD}" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>`;
  s += `<rect x="${x}" y="${y - h}" width="${w}" height="5" fill="${cL}" opacity=".5"/></g>`;
  s += `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" rx="5" fill="none" ${stk(3.2)}/>`;
  if (logo) { const lx = x + w * 0.62, ly = y - h * 0.52;
    s += `<circle cx="${lx}" cy="${ly}" r="${h * 0.26}" fill="#fff8ec" ${stk(2.6)}/><path d="${star(lx, ly, h * 0.19, h * 0.08)}" fill="${logo}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round" filter="url(#${u}g)"/>`; }
  return s;
}
function container() {   // stack of three cargo containers (base y≈164, H 176 keeps the soft shadow inside)
  const W = 200, H = 176, u = "ct";
  const defs = glow(`${u}g`, 2.2) + blur(`${u}s`, 3);
  let g = `<ellipse cx="100" cy="161" rx="94" ry="9" fill="#0b1030" opacity=".45" filter="url(#${u}s)"/>`;
  g += cargoBox(10, 158, 112, 44, 14, "#ff5db1", u, 0, "#ffd24a");
  g += cargoBox(28, 107, 86, 40, 14, "#3fe0e8", u, 1, "#ff5db1");
  g += cargoBox(126, 163, 54, 38, 13, "#ffc23a", u, 2, "#3fe0e8");
  [[176, 70], [16, 40]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 7 - i * 2, 2.3, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/container.png", W, H, g, defs);
}
function neonSign() {   // holographic sign on a post showing the critter mascot (base y≈204)
  const W = 140, H = 210, u = "ns";
  const c = critter({ c: "#3fe0e8", uid: `${u}c`, look: 0 });
  const defs = c.defs + glow(`${u}g`, 3.5) + glow(`${u}g2`, 2) + lin(`${u}p`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0) +
    rad(`${u}h`, [[0, "#ff5db1", 0.35], [1, "#ff5db1", 0]]) + lin(`${u}f`, [[0, "#1d2458"], [1, "#11163e"]]) + blur(`${u}s`, 2.5) +
    `<clipPath id="${u}cl"><rect x="18" y="18" width="104" height="102" rx="20"/></clipPath>`;
  let g = `<ellipse cx="70" cy="70" rx="70" ry="68" fill="url(#${u}h)"/>`;
  g += `<ellipse cx="70" cy="201" rx="28" ry="5" fill="#0b1030" opacity=".45" filter="url(#${u}s)"/>`;
  g += `<ellipse cx="70" cy="199" rx="20" ry="6" fill="#3a4790" ${stk(3)}/>`;
  g += `<rect x="62" y="120" width="16" height="80" rx="6" fill="url(#${u}p)" ${stk(3)}/><path d="M66 128 V192" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>`;
  [140, 160, 180].forEach((y) => { g += `<circle cx="70" cy="${y}" r="2.6" fill="#ff5db1" filter="url(#${u}g2)"/>`; });
  // frame: dark screen, pink neon tube, teal inner tube
  g += `<rect x="12" y="12" width="116" height="114" rx="24" fill="url(#${u}f)" ${stk(4)}/>`;
  g += `<g clip-path="url(#${u}cl)"><ellipse cx="70" cy="74" rx="46" ry="42" fill="#3fe0e8" opacity=".18" filter="url(#${u}g)"/>`;
  g += `<g opacity=".92" transform="translate(70 72) scale(0.66) translate(-64 -60)">${c.body}</g>`;
  for (let y = 22; y < 122; y += 5) g += `<path d="M18 ${y} H122" stroke="#bff6ff" stroke-width="1" opacity=".1"/>`;
  g += `<path d="M28 34 Q34 24 48 22" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".35"/></g>`;
  g += `<rect x="18" y="18" width="104" height="102" rx="20" fill="none" stroke="#ff5db1" stroke-width="5" filter="url(#${u}g)"/>`;
  g += `<rect x="18" y="18" width="104" height="102" rx="20" fill="none" stroke="#ffd6ef" stroke-width="1.8"/>`;
  g += `<rect x="25" y="25" width="90" height="88" rx="15" fill="none" stroke="#3fe0e8" stroke-width="1.6" opacity=".6" stroke-dasharray="6 6"/>`;
  g += `<rect x="54" y="118" width="32" height="12" rx="5" fill="#3a4790" ${stk(3)}/>`;   // bracket frame → post
  return job("assets/img/neon_sign.png", W, H, g, defs);
}
function antenna() {   // satellite dish on a lattice mast with a blinking tip light (base y≈212)
  const W = 150, H = 224, u = "an";
  const defs = lin(`${u}d`, [[0, "#ffffff"], [0.6, "#d4dcff"], [1, "#8d98d6"]], 0, 0, 1, 1) + lin(`${u}b`, [[0, "#5a67a8"], [1, "#2a3270"]]) +
    glow(`${u}g`, 3) + blur(`${u}s`, 3) + rad(`${u}t`, [[0, "#ff5db1", 0.75], [1, "#ff5db1", 0]]);
  let g = `<ellipse cx="75" cy="210" rx="46" ry="7" fill="#0b1030" opacity=".45" filter="url(#${u}s)"/>`;
  // base block
  g += `<path d="M40 196 V206 A35 8 0 0 0 110 206 V196 Z" fill="url(#${u}b)" ${stk(3)}/><ellipse cx="75" cy="196" rx="35" ry="8" fill="#3a4790" ${stk(3)}/>`;
  g += `<circle cx="58" cy="205" r="2.4" fill="#3fe0e8" filter="url(#${u}g)"/><circle cx="92" cy="205" r="2.4" fill="#3fe0e8" filter="url(#${u}g)"/>`;
  // lattice mast (tapering), bars drawn ink-then-colour so the joints read as one frame
  const L = 54, Rr = 96, Lt = 66, Rt = 84, yb = 196, yt = 104, n = 4;
  let bars = `M${L} ${yb} L${Lt} ${yt} M${Rr} ${yb} L${Rt} ${yt}`;
  for (let i = 0; i <= n; i++) {
    const t = i / n, y = yb + (yt - yb) * t, xl = L + (Lt - L) * t, xr = Rr + (Rt - Rr) * t;
    bars += ` M${f2(xl)} ${f2(y)} L${f2(xr)} ${f2(y)}`;
    if (i < n) { const t2 = (i + 1) / n, y2 = yb + (yt - yb) * t2, xl2 = L + (Lt - L) * t2, xr2 = Rr + (Rt - Rr) * t2;
      bars += ` M${f2(xl)} ${f2(y)} L${f2(xr2)} ${f2(y2)} M${f2(xr)} ${f2(y)} L${f2(xl2)} ${f2(y2)}`; }
  }
  g += `<path d="${bars}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${bars}" fill="none" stroke="#9aa6e6" stroke-width="3" stroke-linecap="round"/>`;
  // mount + dish (tilted to the upper left)
  g += `<rect x="66" y="88" width="18" height="22" rx="5" fill="url(#${u}b)" ${stk(3)}/>`;
  g += `<g transform="translate(75 68) rotate(-24)">`;
  g += `<ellipse cx="0" cy="6" rx="52" ry="28" fill="#6d79bd" ${stk(3.5)}/>`;
  g += `<ellipse cx="0" cy="0" rx="52" ry="28" fill="url(#${u}d)" ${stk(3.5)}/>`;
  g += `<ellipse cx="0" cy="0" rx="38" ry="19" fill="none" stroke="#b4bfef" stroke-width="2"/><ellipse cx="0" cy="0" rx="22" ry="10" fill="none" stroke="#b4bfef" stroke-width="2"/>`;
  g += `<path d="M-30 -10 Q-16 -20 6 -22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>`;
  g += `<path d="M0 0 L4 -40 M-26 8 L4 -40 M26 8 L4 -40" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
  g += `<circle cx="4" cy="-40" r="12" fill="url(#${u}t)"/><circle cx="4" cy="-40" r="6" fill="#ff5db1" ${stk(2.4)} filter="url(#${u}g)"/><circle cx="2.4" cy="-41.6" r="1.8" fill="#fff"/>`;
  g += `<circle cx="0" cy="0" r="5" fill="#3fe0e8" ${stk(2.2)}/></g>`;
  [[20, 30], [132, 120]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 6 - i, 2, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/antenna.png", W, H, g, defs);
}
function shuttle() {   // cute parked space van, 3/4 top-down, nose to the right (base y≈160)
  const W = 240, H = 174, u = "sh";
  const defs = lin(`${u}b`, [[0, "#ffffff"], [0.45, "#eef3ff"], [1, "#a9b6e6"]]) + lin(`${u}w`, [[0, "#c8fbff"], [0.5, "#3fb8e8"], [1, "#24306e"]], 0, 0, 1, 1) +
    rad(`${u}p`, [[0, "#bff8ff"], [0.6, "#3fb8e8"], [1, "#24306e"]], 0.35, 0.3, 0.8) + glow(`${u}g`, 3) + blur(`${u}s`, 3.5) +
    rad(`${u}j`, [[0, "#3fe0e8", 0.8], [1, "#3fe0e8", 0]]) + lin(`${u}l`, [[0, "#e4e8ff"], [1, "#7480c4"]], 0, 0, 1, 0);
  const body = "M30 92 Q28 48 84 44 H160 Q214 46 220 96 Q222 136 186 138 H58 Q30 136 30 92 Z";
  let g = `<ellipse cx="124" cy="156" rx="102" ry="10" fill="#0b1030" opacity=".45" filter="url(#${u}s)"/>`;
  g += `<ellipse cx="124" cy="152" rx="70" ry="9" fill="#3fe0e8" opacity=".18" filter="url(#${u}s)"/>`;
  // far legs (behind the body)
  const leg = (x0, x1, c) => `<path d="M${x0} 128 L${x1} 150" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x0} 128 L${x1} 150" stroke="${c}" stroke-width="4" stroke-linecap="round"/><ellipse cx="${x1}" cy="152" rx="10" ry="4.5" fill="#3a4790" ${stk(2.8)}/>`;
  g += leg(80, 74, "#8d98d6") + leg(170, 176, "#8d98d6");
  // rear thruster
  g += `<ellipse cx="18" cy="96" rx="14" ry="18" fill="url(#${u}j)"/><rect x="16" y="78" width="22" height="36" rx="9" fill="#3a4790" ${stk(3)}/><ellipse cx="20" cy="96" rx="4" ry="11" fill="#bff8ff" filter="url(#${u}g)"/>`;
  // body + side band
  g += `<clipPath id="${u}cl"><path d="${body}"/></clipPath>`;
  g += `<path d="${body}" fill="url(#${u}b)"/>`;
  g += `<g clip-path="url(#${u}cl)"><path d="M20 98 Q120 108 230 98 V150 H20 Z" fill="#cfd8f6"/><path d="M20 98 Q120 108 230 98" fill="none" stroke="#9aa6e0" stroke-width="2.5"/>`;
  g += `<path d="M20 118 Q120 128 230 116 V128 Q120 140 20 130 Z" fill="#ff5db1"/><path d="M20 118 Q120 128 230 116" fill="none" stroke="#ffd6ef" stroke-width="1.6"/>`;
  g += `<path d="M20 134 Q120 144 230 132 V150 H20 Z" fill="#3fe0e8"/></g>`;
  g += `<path d="${body}" fill="none" ${stk(4)}/>`;
  // roof: hatch + beacon, highlight
  g += `<path d="M58 66 Q60 52 84 50 H128" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".95"/>`;
  g += `<rect x="86" y="58" width="56" height="24" rx="10" fill="#e3e9fb" ${stk(2.8)}/><path d="M94 66 H134" stroke="#b4bfef" stroke-width="2.5" stroke-linecap="round"/>`;
  g += `<rect x="108" y="38" width="16" height="10" rx="4" fill="#3a4790" ${stk(2.5)}/><ellipse cx="116" cy="36" rx="9" ry="7" fill="#ffd24a" ${stk(2.5)} filter="url(#${u}g)"/><circle cx="113.5" cy="34" r="2" fill="#fff"/>`;
  // windshield (nose, right)
  g += `<path d="M164 54 Q206 58 212 96 H176 Q174 72 160 58 Z" fill="url(#${u}w)" ${stk(3.2)}/><path d="M172 62 Q190 66 196 80" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".85"/>`;
  // portholes
  [66, 104, 142].forEach((x) => { g += `<circle cx="${x}" cy="103" r="11" fill="#eef3ff" ${stk(3)}/><circle cx="${x}" cy="103" r="7" fill="url(#${u}p)"/><circle cx="${x - 2.4}" cy="100.6" r="2.2" fill="#fff"/>`; });
  // headlight + tail light
  g += `<ellipse cx="214" cy="112" rx="5" ry="7" fill="#fff6c8" ${stk(2.4)} filter="url(#${u}g)"/><circle cx="34" cy="116" r="4" fill="#ff5db1" ${stk(2.2)}/>`;
  // near legs (front)
  g += leg(62, 52, "#c4ccf4") + leg(190, 202, "#c4ccf4");
  [[10, 30], [228, 36]].forEach(([x, y], i) => { g += `<path d="${star(x, y, 6 - i, 2, 4)}" fill="#fff6c8" filter="url(#${u}g)"/>`; });
  return job("assets/img/shuttle.png", W, H, g, defs);
}
function landingPad() {   // flat top-down landing-pad decal: rings, chevron lights, gold centre (260×160)
  const W = 260, H = 160, cx = 130, cy = 80, ry = 0.56, u = "lp";
  const defs = glow(`${u}g`, 2.6) + rad(`${u}d`, [[0, "#2c3878"], [0.75, "#1d2660"], [1, "#161d4e"]]) + rad(`${u}o`, [[0, "#3fe0e8", 0], [0.8, "#3fe0e8", 0.08], [1, "#3fe0e8", 0]]) +
    rad(`${u}c`, [[0, "#fff1a8"], [0.6, "#ffd24a"], [1, "#e0a020"]], 0.45, 0.4, 0.7);
  const E = (r, a) => `cx="${cx}" cy="${cy}" rx="${r}" ry="${f2(r * ry)}" ${a}`;
  let g = `<ellipse ${E(128, `fill="url(#${u}o)"`)}/>`;
  g += `<ellipse ${E(118, `fill="url(#${u}d)" ${stk(4)}`)}/>`;
  g += `<ellipse ${E(108, `fill="none" stroke="#3fe0e8" stroke-width="4" opacity=".9" filter="url(#${u}g)"`)}/>`;
  g += `<ellipse ${E(86, `fill="none" stroke="#8fa0e6" stroke-width="2.5" stroke-dasharray="12 9" opacity=".7"`)}/>`;
  g += `<ellipse ${E(62, `fill="none" stroke="#ff5db1" stroke-width="3.5" opacity=".85" filter="url(#${u}g)"`)}/>`;
  // chevrons pointing to the centre (8 directions, on the ring between 62 and 108)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, rr = 97, s = 7;
    const ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux;   // radial / tangent (circle space)
    const P = (r, t) => `${f2(cx + (ux * r + px * t))} ${f2(cy + (uy * r + py * t) * ry)}`;
    g += `<path d="M${P(rr + s * 0.6, -s)} L${P(rr - s * 0.6, 0)} L${P(rr + s * 0.6, s)}" fill="none" stroke="#ffd24a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#${u}g)"/>`;
  }
  // edge lights
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + Math.PI / 16; g += `<circle cx="${f2(cx + Math.cos(a) * 113)}" cy="${f2(cy + Math.sin(a) * 113 * ry)}" r="2.2" fill="${i % 2 ? "#ff5db1" : "#bff8ff"}" filter="url(#${u}g)"/>`; }
  // gold centre
  g += `<ellipse ${E(34, `fill="url(#${u}c)" ${stk(3.5)}`)}/>`;
  g += `<ellipse ${E(24, `fill="none" stroke="#fff6c8" stroke-width="2.4" opacity=".9"`)}/>`;
  g += `<g transform="translate(${cx} ${cy}) scale(1 ${ry})"><path d="${star(0, 0, 14, 6)}" fill="#fff6c8" stroke="#b07a10" stroke-width="2" stroke-linejoin="round"/></g>`;
  return job("assets/img/landing_pad.png", W, H, g, defs);
}

/* ---------------- 9. Game icons (128 grid, bold outline, glossy) ---------------- */
const IP = Object.assign({}, IK.DEF, PAL);
const ist = (w) => IK.st(IP, w);
function checkerFlag(x, y, w, h, sw, wave) {   // waving checkered flag, top-left (x,y), attached on the left
  const cols = 4, rows = 3;
  const P = (a, b) => [x + a * w, y + b * h + Math.sin(a * Math.PI * 1.6) * wave];
  let g = "";
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const a = P(i / cols, j / rows), b = P((i + 1) / cols, j / rows), c = P((i + 1) / cols, (j + 1) / rows), d = P(i / cols, (j + 1) / rows);
    g += `<path d="M${f2(a[0])} ${f2(a[1])} L${f2(b[0])} ${f2(b[1])} L${f2(c[0])} ${f2(c[1])} L${f2(d[0])} ${f2(d[1])} Z" fill="${(i + j) % 2 ? INK : "#f4f6ff"}"/>`;
  }
  const pts = []; for (let i = 0; i <= 12; i++) pts.push(P(i / 12, 0)); for (let i = 12; i >= 0; i--) pts.push(P(i / 12, 1));
  return g + `<path d="M${pts.map((p) => f2(p[0]) + " " + f2(p[1])).join(" L")} Z" fill="none" ${ist(sw)}/>`;
}
const fenceSeg = (y, sw) => `<rect x="14" y="${y}" width="96" height="12" rx="6" fill="#3fe0e8" ${ist(sw - 1)}/><rect x="20" y="${y + 3}" width="84" height="3.5" rx="1.7" fill="#d8fcff"/>`;
const GAME_ICONS = {
  shard: () => { const [d1, f1] = IK.fill(IP.gold), [d2, f2t] = IK.fill(IP.teal);
    const main = IK.glossy("M52 8 L88 52 L58 120 L22 56 Z", f1, IP, "M38 54 L50 28", 7);
    let b = `<path d="M84 24 L110 50 L94 100 L72 54 Z" fill="${f2t}" ${ist(6)}/>` + main.body;
    b += `<path d="M52 8 L56 58 L58 120 M22 56 L56 58 L88 52" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" opacity=".45"/>`;
    b += `<path d="${star(24, 22, 13, 4, 4)}" fill="#fff" ${ist(4)}/>`;
    return { defs: d1 + d2 + main.defs, body: b }; },
  nectar: () => { const [d, f] = IK.fill(IP.pink), [d2, fg] = IK.fill(IP.gold);
    const J = "M34 46 Q30 46 30 56 V98 Q30 116 48 116 H80 Q98 116 98 98 V56 Q98 46 94 46 Z";
    let b = `<clipPath id="nj"><path d="${J}"/></clipPath><path d="${J}" fill="#eef4ff"/><g clip-path="url(#nj)"><rect x="20" y="66" width="90" height="60" fill="${f}"/><path d="M20 68 Q46 60 64 68 Q84 76 110 66" fill="none" stroke="#ffd6ef" stroke-width="5"/>${IK.shine("M42 58 V100")}<circle cx="76" cy="90" r="5" fill="#fff" opacity=".6"/><circle cx="62" cy="102" r="3" fill="#fff" opacity=".6"/></g><path d="${J}" fill="none" ${ist(7)}/>`;
    b += `<rect x="38" y="22" width="52" height="24" rx="8" fill="${fg}" ${ist(6)}/><path d="${star(64, 84, 12, 5)}" fill="#fff6c8" ${ist(3.5)}/>`;
    return { defs: d + d2, body: b }; },
  shop: () => { const [d, f] = IK.fill(IP.purple), [d2, fg] = IK.fill(IP.gold);
    let aw = "M16 60 H112 L110 80"; for (let k = 4; k >= 1; k--) { const x0 = 16 + k * 24; aw += ` Q${x0 - 12} 94 ${x0 - 24} 80`; } aw += " Z";
    let b = `<path d="M24 66 Q24 20 64 18 Q104 20 104 66 Z" fill="${f}" ${ist(7)}/><rect x="22" y="78" width="84" height="38" rx="8" fill="#c4bcf4" ${ist(7)}/><rect x="40" y="88" width="48" height="28" rx="5" fill="#2b3370" ${ist(5)}/>`;
    b += `<clipPath id="sa"><path d="${aw}"/></clipPath><g clip-path="url(#sa)"><rect x="10" y="56" width="110" height="40" fill="#fff"/>${[0, 2].map((k) => `<rect x="${16 + k * 24}" y="56" width="24" height="40" fill="${IP.pink}"/>`).join("")}</g><path d="${aw}" fill="none" ${ist(7)}/>`;
    b += `<path d="${star(64, 16, 13, 5.5)}" fill="${fg}" ${ist(4.5)}/>${IK.shine("M38 52 Q40 36 54 30")}`;
    return { defs: d + d2, body: b }; },
  crate: () => ({ defs: crateDefs("ic"), body: starCrate(12, 112, 1.68, 6.5, "ic") }),
  drone: () => { const r = drone("down", 0, "id", { sw: 5.5, shadow: false }); return { defs: r.defs, body: `<g transform="translate(64 66) scale(1.12) translate(-64 -66)">${r.body}</g>` }; },
  flag: () => ({ defs: "", body: `<rect x="16" y="12" width="12" height="106" rx="5" fill="#c9cde2" ${ist(6)}/><circle cx="22" cy="12" r="8" fill="${IP.gold}" ${ist(5)}/>` + checkerFlag(28, 20, 86, 62, 7, 8) }),
  timer: () => { const [d, f] = IK.fill(IP.teal);
    let b = `<rect x="54" y="6" width="20" height="16" rx="4" fill="#8d93b8" ${ist(6)}/><path d="M98 30 L106 22" ${ist(12)}/><path d="M98 30 L106 22" stroke="#8d93b8" stroke-width="5" stroke-linecap="round"/>`;
    b += `<circle cx="64" cy="70" r="48" fill="${f}" ${ist(7)}/><circle cx="64" cy="70" r="36" fill="#fff" ${ist(5)}/>`;
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; b += `<path d="M${f2(64 + Math.cos(a) * 29)} ${f2(70 + Math.sin(a) * 29)} L${f2(64 + Math.cos(a) * 34)} ${f2(70 + Math.sin(a) * 34)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; }
    b += `<path d="M64 70 L64 44" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M64 70 L82 80" stroke="${IP.pink}" stroke-width="6" stroke-linecap="round"/><circle cx="64" cy="70" r="5" fill="${INK}"/>`;
    return { defs: d, body: b }; },
  distance: () => { const [d, f] = IK.fill(IP.pink);
    let b = `<path d="M30 120 L52 42 H76 L98 120 Z" fill="#3a4790" ${ist(7)}/><path d="M64 48 V58 M64 72 V86 M64 100 V114" stroke="${IP.gold}" stroke-width="6" stroke-linecap="round"/>`;
    b += `<path d="M64 76 Q40 50 40 34 Q40 10 64 10 Q88 10 88 34 Q88 50 64 76 Z" fill="${f}" ${ist(7)}/><circle cx="64" cy="34" r="10" fill="#fff" ${ist(5)}/>${IK.shine("M50 30 Q52 20 60 18")}`;
    return { defs: d, body: b }; },
  speed: () => { const [d, f] = IK.fill(IP.purple);
    let b = `<path d="M18 98 A50 50 0 1 1 110 98 Z" fill="${f}" ${ist(7)}/><path d="M28 92 A38 38 0 1 1 100 92" fill="none" stroke="#fff" stroke-width="12" opacity=".95"/>`;
    b += `<path d="M28 92 A38 38 0 0 1 40 46" fill="none" stroke="${IP.green}" stroke-width="10"/><path d="M50 37 A38 38 0 0 1 82 37" fill="none" stroke="${IP.gold}" stroke-width="10"/><path d="M92 48 A38 38 0 0 1 100 92" fill="none" stroke="${IP.pink}" stroke-width="10"/>`;
    b += `<path d="M64 80 L94 50" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M64 80 L94 50" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="64" cy="80" r="10" fill="${IP.teal}" ${ist(5)}/>`;
    b += `<rect x="40" y="96" width="48" height="18" rx="7" fill="#3a4790" ${ist(6)}/>`;
    return { defs: d, body: b }; },
  quit: () => { const [d, f] = IK.fill(IP.purple), [d2, fp] = IK.fill(IP.pink);
    let b = `<rect x="16" y="12" width="58" height="104" rx="8" fill="#2b3370" ${ist(7)}/><path d="M24 20 L62 28 V112 L24 108 Z" fill="${f}" ${ist(6)}/><circle cx="52" cy="70" r="5" fill="${IP.gold}" ${ist(3)}/>`;
    b += `<path d="M64 54 H86 V36 L118 66 L86 96 V78 H64 Z" fill="${fp}" ${ist(7)}/>${IK.shine("M72 62 H90")}`;
    return { defs: d + d2, body: b }; },
  left: () => { const [d, f] = IK.fill(IP.teal); return { defs: d, body: `<path d="M12 64 L58 18 V44 H112 V84 H58 V110 Z" fill="${f}" ${ist(8)}/>${IK.shine("M64 54 H100")}` }; },
  right: () => { const [d, f] = IK.fill(IP.teal); return { defs: d, body: `<path d="M116 64 L70 18 V44 H16 V84 H70 V110 Z" fill="${f}" ${ist(8)}/>${IK.shine("M28 54 H64")}` }; },
  grip: () => { const [d, f] = IK.fill("#c9b8ff");
    let b = `<path d="M18 96 H110 M26 112 H102" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M18 96 H110 M26 112 H102" stroke="${IP.gold}" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 9"/>`;
    b += `<ellipse cx="64" cy="58" rx="40" ry="28" fill="${f}" ${ist(7)}/>`;
    [[36, 36], [64, 26], [92, 36]].forEach(([x, y]) => { b += `<circle cx="${x}" cy="${y}" r="12" fill="${f}" ${ist(6)}/>`; });
    b += `<ellipse cx="64" cy="64" rx="18" ry="11" fill="${IP.pink}" opacity=".85"/>${IK.shine("M36 58 Q40 46 50 42")}`;
    return { defs: d, body: b }; },
  range: () => { const [d, f] = IK.fill(IP.green);
    let b = `<rect x="10" y="34" width="96" height="60" rx="14" fill="#fff" ${ist(7)}/><rect x="104" y="52" width="14" height="24" rx="4" fill="${INK}"/><rect x="20" y="44" width="64" height="40" rx="7" fill="${f}"/>`;
    b += `<path d="M30 64 H62 V52 L80 64 L62 76 V64" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`;
    b += `<path d="M84 104 Q84 82 108 80 Q110 104 84 104 Z" fill="${IP.teal}" ${ist(5)}/><path d="M88 100 L102 86" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    return { defs: d, body: b }; },
  egg: () => ({ defs: eggDef("ieg", "#5fe8ee"), body: egg(64, 118, 42, 106, "#5fe8ee", 7, "ieg") + `<circle cx="78" cy="56" r="8" fill="${IP.pink}" opacity=".85"/><circle cx="50" cy="88" r="9" fill="${IP.pink}" opacity=".85"/><circle cx="84" cy="96" r="6" fill="${IP.pink}" opacity=".85"/><path d="${eggPath(64, 118, 42, 106)}" fill="none" ${ist(7)}/>` }),
  ride: () => { const c = critter({ c: VARIANTS.aqua, uid: "irc", look: 0 }), k = robot("down", 0, false, KEEPERS.keeper, "irk", { seated: true });
    return { defs: c.defs + k.defs, body: `<g transform="translate(64 121) scale(0.8) translate(-64 -109)">${c.body}</g><g transform="translate(64 68) scale(0.44) translate(-64 -106)">${k.body}</g>` }; },
  jump: () => { const c = critter({ c: VARIANTS.rose, uid: "ijc", look: 0.3, eye: "happy", sq: -0.06 });
    // motion trail rising from the left, landing arrow on the right
    let b = `<path d="M14 104 Q20 50 44 30" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 11" opacity=".9"/>`;
    b += `<path d="M86 30 Q106 44 110 86" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M86 30 Q106 44 110 86" fill="none" stroke="${IP.gold}" stroke-width="6" stroke-linecap="round"/>`;
    b += `<path d="M98 84 L111 106 L122 82 Z" fill="${IP.gold}" ${ist(5)}/>`;
    b += `<rect x="38" y="70" width="12" height="44" rx="5" fill="#c4bcf4" ${ist(5)}/><rect x="78" y="70" width="12" height="44" rx="5" fill="#c4bcf4" ${ist(5)}/><rect x="30" y="80" width="68" height="12" rx="6" fill="${IP.pink}" ${ist(5)}/>`;
    b += `<g transform="translate(64 46) scale(0.54) rotate(10) translate(-64 -66)">${c.body}</g>`;
    return { defs: c.defs, body: b }; },
  pad: () => { const [d, f] = IK.fill(IP.gold);
    let b = `<circle cx="64" cy="64" r="52" fill="#2b3370" ${ist(7)}/><circle cx="64" cy="64" r="40" fill="none" stroke="${IP.teal}" stroke-width="7" stroke-dasharray="12 7"/>`;
    const g = IK.glossy("M72 18 L36 70 H60 L52 110 L92 54 H68 Z", f, IP, "M66 32 L52 54", 7);
    return { defs: d + g.defs, body: b + g.body }; },
  portal: () => { const [d, f] = IK.fill(IP.purple);
    let b = `<circle cx="64" cy="64" r="44" fill="#3fb8e8"/>`;
    [0, 1, 2].forEach((k) => { b += `<path d="${spiral(64, 64, 4, 46, k * 2.094, 0.85, 30)}" fill="none" stroke="${k % 2 ? "#fff" : "#d7c4ff"}" stroke-width="7" stroke-linecap="round"/>`; });
    b += `<path d="M10 64 a54 54 0 1 0 108 0 a54 54 0 1 0 -108 0 Z M24 64 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0 Z" fill="${f}" fill-rule="evenodd" ${ist(7)}/><circle cx="64" cy="64" r="8" fill="#fff"/>${IK.shine("M22 46 Q30 26 48 18")}`;
    return { defs: d, body: b }; },
  stall: () => { const [d, f] = IK.fill(IP.green);
    let b = `<rect x="18" y="38" width="16" height="78" rx="7" fill="#c4bcf4" ${ist(6)}/><rect x="72" y="38" width="16" height="78" rx="7" fill="#c4bcf4" ${ist(6)}/>`;
    b += `<rect x="10" y="58" width="88" height="12" rx="6" fill="${IP.teal}" ${ist(5)}/><rect x="10" y="86" width="88" height="12" rx="6" fill="${IP.teal}" ${ist(5)}/>`;
    b += `<circle cx="26" cy="34" r="7" fill="${IP.teal}" ${ist(4)}/><circle cx="80" cy="34" r="7" fill="${IP.teal}" ${ist(4)}/>`;
    b += `<circle cx="96" cy="34" r="26" fill="${f}" ${ist(7)}/><path d="M96 20 V48 M82 34 H110" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`;
    return { defs: d, body: b }; },
};
function gameIcons() { return Object.entries(GAME_ICONS).map(([n, fn]) => { const r = fn(); return IK.job(`assets/ui/icons/${n}.png`, r.body, r.defs); }); }

module.exports = () => {
  const jobs = [];
  return K.hidpi(build(jobs), HIDPI);
};
// Resolution per family of images (see svg-kit.hidpi): world sprites x2 (config `res: 2`),
// menu thumbnails x3, icons x2, full-screen backdrops x2 as JPEG, close-up props x3.
const HIDPI = [
  [/favicon|apple-touch|icon-192|icon-maskable/, { keep: true }],          // PWA icons: PNG at their own scale
  [/closeup|splash/, { scale: 2, type: "webp", ext: ".webp" }],
  [/logo/, { scale: 2.5, type: "webp", ext: ".webp" }],
  [/ui\/icons\//, { scale: 2, type: "webp", ext: ".webp" }],
  [/assets\/ui\//, { scale: 6, type: "webp", ext: ".webp" }],
  [/dust|cloth/, { scale: 3, type: "webp", ext: ".webp" }],
  [/pen_floor/, { scale: 1.4, type: "webp", ext: ".webp" }],
  [/assets\/(img|sheet)\//, { scale: 2, type: "webp", ext: ".webp" }],
];
function build(jobs) {
  Object.keys(VARIANTS).forEach((v) => { jobs.push(critterSheet(v), critterThumb(v), closeup(v, false), closeup(v, true), closeup(v, false, true), closeup(v, true, true)); });
  Object.keys(VARIANTS).forEach((v) => { jobs.push(critterSheet(v, true), critterBack(v)); });
  jobs.push(riderBack("back_aqua", KEEPERS.keeper), riderBack("back_amber", KEEPERS.keeper_amber));
  RIVALS.forEach(([a], i) => jobs.push(riderBack(`rival_${i + 1}`, { body: "#eef2ff", accent: a }, true)));
  Object.entries(KEEPERS).forEach(([n, p]) => jobs.push(keeperSheet(n, p), keeperThumb(n, p), keeperRide(n, p)));
  jobs.push(arenaFloor(), spire(), beamV(), cometRock(),
    market(), salon(), dock(), hatchery(), energyPad(), portal(),
    crateMarker(), target(), droneSheet(), droneBack(), droneFront(), startGate(), asteroid(), beacon(), ...gameIcons());
  jobs.push(voidTile(), roadTile(), plazaTile(), walkwayTile(), rimTile(),
    bollard(), rock(), container(), neonSign(), antenna(), shuttle(), landingPad());
  jobs.push(ground(), penFloor(600, 470), fence(), pod(),
    crystal("crystal", "#ff8fd8", "#a45bff"), crystal("crystal_b", "#8ff6ff", "#3a7cff"),
    alienPlant(), orbLamp(), starBall(), fountain(),
    dust("dust", "#b7a9cf"), dust("dust_b", "#9fb0d8"), cloth(), wantBubble(),
    icon("assets/favicon.png", 512), icon("assets/apple-touch-icon.png", 180), icon("assets/icon-192.png", 192), icon("assets/icon-maskable.png", 512, 0.78), logo(), splash(),
    critterIcon(), robotIcon(), polishIcon(),
    ...IK.jobs(PAL, ["star", "heart", "heartEmpty", "sound", "soundOff", "help", "avatar", "goals", "close", "play", "resume", "check", "calendar", "gift", "hand", "sparkle", "moon", "refresh", "arrow", "trophy", "palette", "ball", "battery", "smile", "meh", "sad", "joy", "home", "lock"]));
  return jobs;
};

// `node tools/art/nebula.cjs` prints the wide close-up spot areas (paste into closeup.wide.area).
if (require.main === module) console.log("closeup.wide.area =", JSON.stringify(wideAreas()));
