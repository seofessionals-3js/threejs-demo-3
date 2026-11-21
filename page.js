// The full demos: loader, the hero drawing itself, each direction's journey through the house, the section
// rendered in material and light, then the studio's closing section.
//
//   ?dir=a   Open the lens: the lens opens while the cut keeps its size, then a 3D tour, room by room and depth by depth.
//   ?dir=c   Down the stair: scroll down is down, the camera goes from the upper floor down the stair to the living room and out to the pool.
//
// &p=0.4 freezes the page at 40% of its journey, &skip jumps past the loader (both for stills).
// Every moment below is placed in vh of scroll, so the pacing reads the same as checkpoint 1.

import * as THREE from 'three';
import { createEngine } from './engine.js';
import { visible } from './quality.js';

const Q = new URLSearchParams(location.search);
const DIR = ['a', 'c'].includes(Q.get('dir')) ? Q.get('dir') : 'a';
document.body.dataset.dir = DIR;
document.querySelectorAll('.dirs a').forEach(a => a.classList.toggle('on', a.dataset.dir === DIR));

let dirty = true;                                                  // the picture has to be drawn again
const E = createEngine(document.getElementById('gl'), document.getElementById('ov'), () => { dirty = true; });
const phone = () => E.W < 700;

// ---- camera states. rect: what must show on the cut. at: where its middle sits on screen. ----
// short: the same state on a phone held sideways, where the headline has one line and the drawing sits lower
const HERO = { rect: [-5.6, -4.8, 35.2, 11.6], at: [0.56, 0.52], lens: 1.6, vp: [11.4, 3.1], cut: -4.6, fog: 34, short: { rect: [-5.6, -3.4, 35.2, 9.6], at: [0.5, 0.585] } };
const HERO_P = { rect: [3.0, -2.0, 19.0, 8.6], at: [0.5, 0.6], lens: 1.6, vp: [11.0, 3.1], cut: -4.6, fog: 34 };
const PAN = [-6.2, -7.0, 34.6, 9.4];           // the hero's frame, moved down so the house sits in the middle
const PAN_S = [-6.2, -4.4, 34.6, 9.4];
const at = (rect, lens, vp, fog = 20, cut = -4.6) => ({ rect, lens, vp, cut, fog });
const PH_L = { rect: [2.5, -2.5, 15.5, 9.5], at: [0.5, 0.46], lens: 1.6, vp: [9, 3.1], cut: -4.6, fog: 34 };
const PH_R = { rect: [17.0, -2.5, 32.0, 9.5], at: [0.5, 0.46], lens: 1.6, vp: [24.5, 3.1], cut: -4.6, fog: 34 };

const PLAN = {
  a: {
    total: 1600,
    desk: [HERO, { ...HERO, rect: PAN, lens: 64, short: { rect: PAN_S } },
      at([0.8, -2.6, 21.6, 8.6], 60, [11.4, 2.7], 30),        // the whole house in sectional perspective
      at([5.2, -0.5, 14.8, 7.1], 66, [10.3, 3.3]),             // 01: the stair under its rooflight
      at([3.4, -0.6, 11.9, 3.5], 68, [7.4, 1.6]),              // 02: kitchen and dining
      at([3.4, 2.7, 12.4, 7.1], 68, [7.6, 4.7]),               // 03: the upper floor
      at([10.4, -0.8, 19.0, 7.0], 66, [14.6, 1.6], 22),        // 04: the living room
      at([16.6, -2.6, 32.6, 6.6], 56, [25.0, 1.6], 26),        // 05: the terrace and the pool
      HERO, HERO],
    phone: [HERO_P, { ...HERO_P, at: [0.5, 0.5], lens: 64 },
      at([5.5, -0.5, 16.5, 9.5], 60, [11.0, 3.0], 30),
      at([7.4, -0.5, 13.4, 9.0], 66, [10.3, 3.3]),
      at([4.2, -0.4, 11.4, 3.6], 68, [7.4, 1.6]),
      at([4.2, 2.8, 11.6, 6.9], 68, [7.6, 4.7]),
      at([11.0, -0.6, 18.4, 7.0], 66, [14.6, 1.6], 22),
      at([21.0, -2.4, 31.5, 5.6], 56, [26.0, 1.6], 26),
      PH_L, PH_R],
    // [from vh, to vh, from state, to state]
    track: [[45, 255, 0, 1], [255, 375, 1, 2], [430, 560, 2, 3], [620, 740, 3, 4], [800, 920, 4, 5], [980, 1100, 5, 6], [1160, 1280, 6, 7], [1330, 1440, 7, 8], [1450, 1550, 8, 9]],
    colour: [135, 355], flatAgain: 1400,
    stops: [555, 735, 915, 1095, 1270],
    captions: [[50, 250, 'Das Objektiv öffnet sich. Der Schnitt behält seine Größe.'], [265, 425, 'Material und Licht ziehen in den 3D-Schnitt ein.'], [440, 615, 'Näher heran, an die Treppenachse.'],
      [630, 795, 'Hinunter zu Küche und Esstisch.'], [810, 975, 'Hinauf zur Schlafebene.'], [990, 1155, 'Hinüber in den 5,95 m hohen Wohnraum.'],
      [1170, 1325, 'Hinaus auf die Terrasse und zum Pool.'], [1340, 1445, 'Zurück zur Schnittebene 1:100.'], [1450, 1700, 'Derselbe Schnitt, in Material und Licht gerendert.']],
    rooms: [[470, 615, '01 // SCHNITT A–A · TREPPENACHSE', 'Die Treppe', 'Ein gerader Lauf · 16 Steigungen à 194 mm · oben ein Oberlicht'],
      [660, 795, '02 // EBENE ±0.00M · STRASSENSEITE', 'Küche & Essen', 'Terrazzo-Insel · olivgrüne Fronten · Esstisch für vier unter der Decke'],
      [840, 975, '03 // EBENE +3.10M · OBERGESCHOSS', 'Schlafen & Arbeiten', 'Die Treppe endet hier · Bett an der Straßenwand · Schreibtisch an der Brüstung'],
      [1020, 1155, '04 // EBENE ±0.00M · ZWEIGESCHOSSIG', 'Der Wohnraum', '5,95 m hoch · Bibliothekswand aus Räuchereiche · raumhohes Glas zum Garten'],
      [1200, 1325, '05 // EBENE ±0.00M · TERRASSE', 'Terrasse & Pool', 'Sechs Meter Wasser im Rasen · dahinter fällt der Garten ab']],
  },
  c: {
    total: 1250,
    desk: [HERO, { ...HERO, rect: PAN, lens: 12, short: { rect: PAN_S } },
      at([3.4, 2.5, 12.2, 7.2], 72, [7.4, 4.7], 18),
      at([6.6, -0.2, 14.8, 5.2], 74, [10.6, 2.4], 18),
      at([9.6, -0.9, 19.2, 7.0], 74, [14.4, 1.6], 18),
      at([16.8, -2.4, 31.6, 6.6], 66, [25.0, 1.6], 24),
      HERO, HERO],
    phone: [HERO_P, { ...HERO_P, at: [0.5, 0.5], lens: 12 },
      at([4.4, 2.9, 11.2, 6.6], 70, [7.4, 4.7], 18),
      at([7.6, 0.2, 13.6, 4.8], 72, [10.6, 2.4], 18),
      at([11.4, 0.2, 17.6, 6.9], 72, [14.6, 1.6], 18),
      at([21.5, -2.0, 31.5, 5.0], 66, [26.0, 1.6], 24),
      PH_L, PH_R],
    track: [[40, 90, 0, 1], [90, 200, 1, 2], [280, 440, 2, 3], [520, 680, 3, 4], [760, 880, 4, 5], [940, 1050, 5, 6], [1060, 1160, 6, 7]],
    colour: [60, 200], flatAgain: 1010,
    stops: [155, 240, 480, 720, 905],
    captions: [[45, 200, 'Hinein in die Schlafebene, unter das Oberlicht.'], [285, 520, 'Nach unten scrollen heißt hinab · die Treppe entlang.'], [525, 760, 'Der Wohnraum, zweigeschossig.'],
      [765, 940, 'Über die Terrasse hinaus zum Pool.'], [945, 1055, 'Wieder zurück, zum ganzen Haus.'], [1060, 1400, 'Derselbe Schnitt, in Material und Licht gerendert.']],
    rooms: [[200, 280, 'EBENE +3.10M // OBERGESCHOSS', 'Schlafen & Arbeiten', 'Bett an der Straßenwand · Schreibtisch an der Brüstung · Oberlicht über der Treppe'],
      [440, 520, 'EBENE ±0.00M // TREPPENACHSE', 'Die Treppe hinab', 'Ein gerader Lauf · 16 Steigungen · unten Küche und Esstisch'],
      [680, 760, 'EBENE ±0.00M // WOHNRAUM', 'Der Wohnraum', '5,95 m hoch · Bibliothekswand · Glas zum Garten'],
      [880, 940, 'EBENE ±0.00M // TERRASSE', 'Terrasse & Pool', 'Sechs Meter Wasser im Rasen']],
  },
}[DIR];
const T = PLAN.total;
document.querySelector('.track').style.height = T + 'vh';

const smooth = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function mix(A, B, t) {
  const ta = Math.tan(THREE.MathUtils.degToRad(A.lens / 2)), tb = Math.tan(THREE.MathUtils.degToRad(B.lens / 2));
  return {
    cx: lerp(A.cx, B.cx, t), cy: lerp(A.cy, B.cy, t), frameH: lerp(A.frameH, B.frameH, t),
    vp: A.vp.map((v, i) => lerp(v, B.vp[i], t)),
    lens: THREE.MathUtils.radToDeg(2 * Math.atan(lerp(ta, tb, t))),   // perspective grows evenly, not all at the start
    cut: lerp(A.cut, B.cut, t), fog: lerp(A.fog, B.fog, t),
  };
}
// the camera states only change with the size of the window: resolved once, not on every frame
let listKey = '', list = null;
function stateAt(vh) {
  const key = E.W + 'x' + E.H;
  if (key !== listKey) { listKey = key; list = (phone() ? PLAN.phone : PLAN.desk).map(E.resolve); }
  for (let n = PLAN.track.length - 1; n >= 0; n--) {
    const [v0, v1, i, j] = PLAN.track[n];
    if (vh >= v0) return mix(list[i], list[j], smooth(0, 1, (vh - v0) / (v1 - v0)));
  }
  return list[0];
}
const colourAt = vh => (vh < PLAN.colour[0] ? -1000 : vh > PLAN.colour[1] ? 1000 : lerp(-12, 38.5, ease((vh - PLAN.colour[0]) / (PLAN.colour[1] - PLAN.colour[0]))));

// ---- what the page says as it goes ----
const capEl = document.getElementById('caption'), hudEl = document.getElementById('hud'), roomEl = document.getElementById('room');
const heroEl = document.querySelector('.hero'), fadeEls = document.querySelectorAll('.fade-on-scroll');
const cadKeyEl = document.getElementById('cad-key'), ckVpEl = document.getElementById('ck-vp');
const ckLblEl = document.getElementById('ck-lbl'), ckLensEl = document.getElementById('ck-lens');
const ckBtns = cadKeyEl ? Array.from(cadKeyEl.querySelectorAll('.ck-nav button')) : [];

// Everything below writes to the page only when the value is a different one: a style or a text that is set again
// with what it already holds still costs a recalculation on every frame.
const memo = new WeakMap();
const put = (el, key, v, write) => { let m = memo.get(el); if (!m) memo.set(el, m = {}); if (m[key] !== v) { m[key] = v; write(v); } };
const style = (el, prop, v) => put(el, prop, v, x => { el.style[prop] = x; });
const html = (el, v) => put(el, 'html', v, x => { el.innerHTML = x; });
const text = (el, v) => put(el, 'text', v, x => { el.textContent = x; });
const cls = (el, name, on) => put(el, 'c.' + name, !!on, x => { el.classList.toggle(name, x); });
const stepBack = [capEl, hudEl, roomEl, cadKeyEl, document.querySelector('.dirs')].filter(Boolean);
const fadeOnce = Array.from(fadeEls, el => el.classList.contains('once'));

let capNow = '', roomNow = '';
function words(vh, st, closing) {
  const out = smooth(2, 25, vh);
  style(heroEl, 'opacity', (1 - out).toFixed(3));
  style(heroEl, 'transform', `translateY(${(-24 * out).toFixed(1)}px)`);
  const gone = 1 - smooth(2, 20, vh), back = smooth(PLAN.flatAgain + 20, PLAN.flatAgain + 60, vh) * (1 - closing);
  fadeEls.forEach((el, i) => style(el, 'opacity', (gone + (fadeOnce[i] ? 0 : back)).toFixed(3)));
  const c = PLAN.captions.find(([a, b]) => vh >= a && vh < b);
  const txt = c ? c[2] : '';
  if (txt !== capNow) { capNow = txt; capEl.classList.remove('show'); if (txt) requestAnimationFrame(() => { capEl.textContent = txt; capEl.classList.add('show'); }); }
  const rIdx = PLAN.rooms.findIndex(([a, b]) => vh >= a && vh < b);
  const r = rIdx >= 0 ? PLAN.rooms[rIdx] : null;
  const key = r ? r[3] : '';
  if (key !== roomNow) {
    roomNow = key; roomEl.classList.remove('show');
    if (r) setTimeout(() => { roomEl.innerHTML = `<span class="k mono">${r[2]}</span><b>${r[3]}</b><span class="m mono">${r[4]}</span>`; roomEl.classList.add('show'); }, FREEZE !== null ? 0 : 160);
  }
  const fmt = v => v.toFixed(2);
  const lensTxt = st.lens < 10 ? st.lens.toFixed(1) : Math.round(st.lens);
  if (DIR === 'a') {
    html(hudEl, vh > PLAN.flatAgain + 30
      ? `SEC A–A // <b>1:100 MATERIALSCHNITT</b>`
      : `SEC A–A // OBJEKTIV <b>${lensTxt}°</b> · SCHNITT Z <b>${fmt(st.cut)}M</b>`);
  }
  if (DIR === 'c') {
    let lv = st.vp[1] - 1.6;
    lv = [0, 3.1].find(L => Math.abs(lv - L) < 0.12) ?? lv;
    html(hudEl, vh < 170 || vh > PLAN.flatAgain - 20
      ? (vh > PLAN.flatAgain + 30 ? 'SEC A–A // <b>1:100 MATERIALSCHNITT</b>' : 'SEC A–A // <b>MASSSTAB 1:100</b>')
      : `EBENE <b>${lv > 0.05 ? '+' + fmt(lv) : '±0.00'}M</b> · SCHNITT Z <b>${fmt(st.cut)}M</b>`);
  }
  if (ckLblEl && ckLensEl && !phone()) {
    text(ckLblEl, `SEC A-A // SCHNITT Z ${fmt(st.cut)}M`);
    text(ckLensEl, `OBJEKTIV ${lensTxt}°`);
  }
  if (ckBtns.length) {
    const activeStop = DIR === 'a' ? rIdx : (rIdx >= 0 ? rIdx + 1 : (vh >= 80 && vh < 200 ? 0 : -1));
    ckBtns.forEach((btn, i) => cls(btn, 'on', i === activeStop));
  }
  // the closing section takes over: the drawing's words step back
  for (const el of stepBack) style(el, 'visibility', closing > 0.98 ? 'hidden' : '');
  put(document.body, '--closing', closing.toFixed(3), v => document.body.style.setProperty('--closing', v));
}

// ---- the loop ----
const track = document.querySelector('.track'), closingEl = document.getElementById('closing');
let vTarget = 0, vh = 0, built = false, last = performance.now();
const FREEZE = Q.has('p') ? Number(Q.get('p')) * T : null;
// What the layout says is read when the window changes size, never inside the loop.
let maxScroll = 1, closingTop = 1e9, keyRect = null;
function measure() {
  maxScroll = Math.max(1, track.offsetHeight - E.H);
  closingTop = closingEl.offsetTop;
  keyRect = null;
}
measure();
const readScroll = () => { vTarget = THREE.MathUtils.clamp(scrollY / maxScroll, 0, 1) * T; };
window.__at = v => v / T * maxScroll;                               // scroll position of a moment, for the recorder & radar buttons
addEventListener('scroll', () => { readScroll(); dirty = true; }, { passive: true });
addEventListener('resize', () => { if (E.resize()) { measure(); dirty = true; } readScroll(); }, { passive: true });
document.addEventListener('visibilitychange', () => { last = performance.now(); dirty = true; });

// Interactive 3D radar room buttons
ckBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = Number(btn.dataset.idx);
    const targetVh = PLAN.stops[idx];
    if (typeof targetVh === 'number') {
      window.scrollTo({ top: window.__at(targetVh), behavior: 'smooth' });
      dirty = true;
    }
  });
});

function getRadarKey(vh, closing) {
  if (phone() || !cadKeyEl || !ckVpEl || !built) return null;
  const a = smooth(45, 95, vh) * (1 - smooth(PLAN.flatAgain - 45, PLAN.flatAgain, vh)) * (1 - smooth(0.05, 0.45, closing));
  cls(cadKeyEl, 'show', a > 0.05);
  if (a <= 0.01) return null;
  if (!keyRect) { const r = ckVpEl.getBoundingClientRect(); keyRect = { x: r.left, y: r.top, w: r.width, h: r.height, a: 0 }; }   // a fixed element: where it sits only changes with the window
  keyRect.a = a;
  return keyRect;
}

let build = { reveal: 1000, gridA: 1, sweep: null };
window.__gaps = [];                                                // frames slower than 60 ms, with where on the journey they happened
window.__frames = 0;                                               // frames that were actually drawn, for checking that rest costs nothing
let pending = true, drew = false, closingWas = -1;
function frame(now) {
  requestAnimationFrame(frame);
  if (!visible()) { E.tick(now, false); drew = false; last = now; return; }      // a hidden page or frame draws nothing
  if (built && drew && now - last > 60) window.__gaps.push([Math.round(vh), Math.round(now - last)]);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (FREEZE !== null) vTarget = FREEZE;
  const k = FREEZE !== null ? 1 : 1 - Math.exp(-dt * 5.5);       // weighted: the camera catches up with the scroll
  const moving = Math.abs(vTarget - vh) > 1e-3;
  if (moving) vh += (vTarget - vh) * k; else vh = vTarget;
  const closing = THREE.MathUtils.clamp(1 - (closingTop - scrollY) / innerHeight, 0, 1);
  // Draw only when something changed, and not at all while the closing section lies over the whole picture.
  if (moving || dirty || build.active) pending = true;
  dirty = false;
  const covered = closing >= 1 && !build.active;
  drew = pending && !covered;
  E.tick(now, drew);
  if (drew) {
    pending = false; window.__frames++;
    const st = stateAt(vh), colourX = colourAt(vh);
    E.place({ ...st, reveal: build.reveal, colourX });
    // the drawing's notes belong to the flat drawing: there at the start, and again at the end
    const flat = (1 - smooth(20, 120, vh)) + smooth(PLAN.flatAgain, PLAN.flatAgain + 50, vh);
    const notesA = build.gridA * THREE.MathUtils.clamp(flat, 0, 1);
    const labelsA = notesA * (1 - smooth(-0.3, 0, st.cut));   // never on an elevation
    const pen = vh > PLAN.colour[0] && vh < PLAN.colour[1] ? 1 : 0;
    E.notes({ gridA: notesA, levelsA: notesA, labelsA: build.gridA * labelsA * smooth(23, 25, E.ppm), sweep: build.sweep, colourPen: pen });
    if (vh < 5 || vh > PLAN.flatAgain + 40) put(document.documentElement, '--m', E.ppm.toFixed(2) + 'px', v => document.documentElement.style.setProperty('--m', v));   // one metre on the cut, for the bar scale
    const key = getRadarKey(vh, closing);
    E.render(key);
    if (built) words(vh, st, closing);
  } else if (built && (moving || closing !== closingWas)) words(vh, stateAt(vh), closing);
  closingWas = closing;
}

// ---- loader, then the hero draws itself ----
const loader = document.getElementById('loader'), count = document.getElementById('count'), bar = document.getElementById('bar');
async function start() {
  document.documentElement.classList.add('locked');
  if (Q.has('skip') || FREEZE !== null) document.documentElement.classList.add('instant');
  const t0 = performance.now(), MIN = Q.has('skip') ? 0 : 1700;
  let ready = false;
  (function tick() {
    const u = Math.min(1, (performance.now() - t0) / MIN || 1);
    const lv = 6.45 * ease(u);
    count.textContent = lv < 0.005 ? '±0.00' : '+' + lv.toFixed(2);
    bar.style.transform = `scaleX(${ease(u)})`;
    if (u < 1 || !ready) requestAnimationFrame(tick);
  })();
  await document.fonts.ready;
  E.place({ ...stateAt(0), reveal: 1000, colourX: 1000 });
  E.buildSprites(E.ppm);
  E.place({ ...stateAt(0), reveal: 1000, colourX: 1000 });
  E.precompile();
  E.render();              // one frame with everything on, colour too, behind the loader, so no shader is built later
  E.place({ ...stateAt(0), reveal: 1000, colourX: -1000 });
  ready = true;
  const wait = Math.max(0, MIN - (performance.now() - t0));
  await new Promise(r => setTimeout(r, wait + (Q.has('skip') ? 0 : 250)));
  loader.classList.add('gone');

  if (Q.has('skip') || FREEZE !== null) {
    build = { reveal: 1000, gridA: 1, sweep: null, active: false };
    finish();
  } else {
    build = { reveal: [-12, -12, -12], gridA: 0, sweep: 1, active: true };
    const b0 = performance.now() + 300;
    (function grow(now) {
      const t = (now - b0) / 1000;
      const plot = delay => (t < delay ? -12 : lerp(-12, 38.5, ease(Math.min(1, (t - delay) / 1.7))));
      build.reveal = [plot(0), plot(0.45), plot(0.9)];
      build.sweep = t < 1.7 ? 1 : Math.max(0, 1 - (t - 1.7) / 0.3);
      build.gridA = smooth(1.9, 2.6, t);
      if (t > 2.0) document.body.classList.add('words-in');
      if (t < 2.9) requestAnimationFrame(grow);
      else { build = { reveal: 1000, gridA: 1, sweep: null, active: false }; dirty = true; finish(); }
    })(performance.now());
  }
  requestAnimationFrame(frame);
}
function finish() {
  document.body.classList.add('words-in', 'built');
  document.documentElement.classList.remove('locked');
  built = true; dirty = true;
  E.hold(2500);                                         // the first seconds are loading, not a measure of the machine
  measure(); readScroll();
  if (Q.has('closing')) closingEl.scrollIntoView();     // for stills of the closing section
  window.__built = true;
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
}
start();
