// Casa Dos: an invented house of two storeys on a level plot, for the direction sketches.
//
// Every solid is a profile drawn in the section plane (x along the section, y up, metres)
// pushed back along the depth axis z, from z0 to z1. The camera looks from +z, the front
// facade is at z = 0 and the back wall at z = -10. A cut at depth zc keeps everything with
// z <= zc, and the fill on the cut is the profile itself.
//
// Levels: L0 kitchen, dining and living ±0.00, L1 bedroom and study +3.10, roof +6.45.
// West (left) is the street and the forecourt, east the terrace, the pool and the garden.

export const pieces = [];
export const floors = [];      // floor rectangles that get a tile grid {x0, x1, z0, z1, y, step}
export const sprites = [];     // entourage {type, x, y, z, h, flip}

const R = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const add = (kind, pts, z0, z1, extra = {}) => pieces.push({ kind, pts, z0, z1, ...extra });
const cut = (pts, z0, z1, extra) => add('cut', pts, z0, z1, extra);
// what a piece is made of, for the colour ending. as('oak', () => {...}) paints everything made inside it
let MAT = null;
const as = (mat, fn) => { const was = MAT; MAT = mat; fn(); MAT = was; };
const furn = (pts, z0, z1, extra) => add('furn', pts, z0, z1, { mat: MAT, ...extra });

const D0 = -10, D1 = 0;               // house depth
const LANE = [-5.2, -3.9];            // the stair runs in this strip, the main cut goes through it
export const L0 = 0, L1 = 3.1, ROOF = 6.45;
const XW = 4.0, XG = 11.3, XE = 18.2; // street wall, the edge of the upper floor, the garden front
const DOOR = [-3.4, -2.2];            // the street door, in front of the stair
const SKY = [8.4, 9.9];               // the rooflight over the top of the flight
const FT = 8.0, FB = 12.6;            // the flight: its top on L1, its foot in the living room

// ---------------------------------------------------------------- the land
// A level plot: the forecourt on the street, the terrace, a pool set into the lawn, then the garden falls away.
const natural = [[-30, -14], [50, -14], [50, -1.6], [40, -0.8], [33, 0], [-30, 0]];
const carved = [[-30, -14], [50, -14], [50, -1.6], [40, -0.8], [33, 0], [30.75, 0], [30.75, -1.75], [24.25, -1.75], [24.25, 0],
  [XE, 0], [XE, -0.35], [XW, -0.35], [XW, 0], [-30, 0]];
add('earth', carved, D0 - 0.3, D1 + 0.3, { ground: true });
add('earth', natural, -40, D0 - 0.3, { ground: true });
add('earth', natural, D1 + 0.3, 8, { ground: true });
// the ground line the hatch fades from, as a function of x (left to right)
export const groundLine = [[-30, 0], [XW, 0], [XW + 0.01, -0.35], [XE, -0.35], [XE + 0.01, 0], [24.25, 0], [24.26, -1.75], [30.75, -1.75], [30.76, 0], [33, 0], [40, -0.8], [50, -1.6]];

// ---------------------------------------------------------------- structure
// strip footings under the two long walls
cut(R(XW - 0.25, -0.95, XW + 0.55, -0.35), D0, D1, { mat: 'stone' });
cut(R(XE - 0.7, -0.95, XE + 0.1, -0.35), D0, D1, { mat: 'stone' });
// the street wall in dark brick, with the door in front of the stair
cut(R(XW, 2.3, XW + 0.3, 5.95), D0, D1, { mat: 'stone' });
cut(R(XW, 0, XW + 0.3, 2.3), D0, DOOR[0], { mat: 'stone' });
cut(R(XW, 0, XW + 0.3, 2.3), DOOR[1], D1, { mat: 'stone' });
// L0 ground slab
cut(R(XW, -0.35, XE, 0), D0, D1);
// L1 slab: it stops at XG, where the living room rises through both storeys, and leaves the stair lane open
cut(R(XW + 0.3, 2.75, XG, L1), D0, LANE[0]);
cut(R(XW + 0.3, 2.75, XG, L1), LANE[1], D1);
cut(R(XW + 0.3, 2.75, FT, L1), LANE[0], LANE[1]);               // the landing at the top of the flight
cut(R(XG - 0.4, 2.35, XG, 2.75), D0, LANE[0]);                  // downstand beam where L1 stops
cut(R(XG - 0.4, 2.35, XG, 2.75), LANE[1], D1);
cut(R(XG - 0.35, 0, XG - 0.05, 2.35), -7.35, -7.05);            // and the two columns that carry it
cut(R(XG - 0.35, 0, XG - 0.05, 2.35), -2.15, -1.85);
// balustrades: along the edge over the living room, and round the void of the stair
add('glass', R(XG - 0.04, L1, XG, L1 + 1.05), D0, LANE[0]);
add('glass', R(XG - 0.04, L1, XG, L1 + 1.05), LANE[1], D1);
add('glass', R(FT, L1, XG, L1 + 1.0), LANE[0] - 0.04, LANE[0]);
add('glass', R(FT, L1, XG, L1 + 1.0), LANE[1], LANE[1] + 0.04);
// the garden front: full height glass between a sill and a deep head
cut(R(XE - 0.45, 5.55, XE, 5.95), D0, D1);
cut(R(XE - 0.45, 0, XE - 0.2, 0.08), D0, D1);
add('glass', R(XE - 0.35, 0.08, XE - 0.31, 5.55), D0, D1);
// flat roof with a rooflight above the stair: structure, build-up, parapets
cut(R(XW - 0.3, 5.95, XE + 0.3, 6.2), D0, LANE[0]);
cut(R(XW - 0.3, 5.95, XE + 0.3, 6.2), LANE[1], D1);
cut(R(XW - 0.3, 5.95, SKY[0], 6.2), LANE[0], LANE[1]);
cut(R(SKY[1], 5.95, XE + 0.3, 6.2), LANE[0], LANE[1]);
add('layer', R(XW, 6.2, XE, ROOF), D0, LANE[0]);
add('layer', R(XW, 6.2, XE, ROOF), LANE[1], D1);
add('layer', R(XW, 6.2, SKY[0] - 0.15, ROOF), LANE[0], LANE[1]);
add('layer', R(SKY[1] + 0.15, 6.2, XE, ROOF), LANE[0], LANE[1]);
cut(R(SKY[0] - 0.15, 6.2, SKY[0], 6.65), LANE[0], LANE[1]);     // rooflight upstands
cut(R(SKY[1], 6.2, SKY[1] + 0.15, 6.65), LANE[0], LANE[1]);
add('glass', [[SKY[0] - 0.15, 6.65], [SKY[1] + 0.15, 6.65], [SKY[1] + 0.15, 6.69], [SKY[0] - 0.15, 6.69]], LANE[0], LANE[1]);
cut(R(XW - 0.3, 6.2, XW, 6.9), D0, D1);
cut(R(XE, 6.2, XE + 0.3, 6.9), D0, D1);
// pool shell and water
cut(R(24.25, -1.75, 24.5, 0), D0 - 0.3, D1 + 0.3);
cut(R(30.5, -1.75, 30.75, 0), D0 - 0.3, D1 + 0.3);
cut(R(24.5, -1.75, 30.5, -1.5), D0 - 0.3, D1 + 0.3);
cut(R(24.5, -1.5, 30.5, 0), D0 - 0.3, D0 - 0.05);
add('water', R(24.5, -1.5, 30.5, -0.12), D0 - 0.05, D1 + 0.3);

// back walls (parallel to the cut, seen beyond it) with their windows cut out as holes
function wall(x0, y0, x1, y1, holes, z0, z1, mat) {
  add('cut', R(x0, y0, x1, y1), z0, z1, { holes: holes.map(h => R(...h)), mat });
  holes.forEach(([a, b, c, d]) => {
    add('furn', R(a, b, c, d), z0 + 0.1, z0 + 0.16, { holes: [R(a + 0.05, b + 0.05, c - 0.05, d - 0.05)], frame: true, mat: 'bronze' });
    add('glass', R(a + 0.05, b + 0.05, c - 0.05, d - 0.05), z0 + 0.12, z0 + 0.14);
  });
}
wall(XW + 0.3, L0, XG, 2.75, [[5.2, 1.1, 8.6, 2.1]], D0, D0 + 0.3);
wall(XW + 0.3, L1, XG, 5.95, [[4.9, 4.1, 6.9, 5.4], [9.1, 4.1, 10.7, 5.4]], D0, D0 + 0.3);
wall(XG, L0, XE - 0.45, 5.95, [[12.4, 3.5, 16.8, 5.5]], D0, D0 + 0.3);
// front walls, only ever seen as ghosts
wall(XW + 0.3, L0, XG, 2.75, [[5.4, 0.9, 8.4, 2.3]], D1 - 0.3, D1, 'stone');
wall(XW + 0.3, L1, XG, 5.95, [[5.2, 4.0, 10.0, 5.5]], D1 - 0.3, D1);
wall(XG, L0, XE - 0.45, 5.95, [[12.2, 0.4, 17.0, 5.4]], D1 - 0.3, D1, 'stone');

// ---------------------------------------------------------------- the stair
// One straight flight in the stair lane, from the landing on L1 down into the living room. Kitchen and dining
// stay in view below its high end.
function flight(xTop, yTop, xBot, yBot, n, z0, z1) {
  const dir = Math.sign(xBot - xTop), run = Math.abs(xBot - xTop) / n, rise = (yTop - yBot) / n;
  const slope = rise / run, wv = 0.2 * Math.hypot(1, slope);
  const X = i => xTop + dir * i * run;
  const pts = [[xTop, yTop]];
  for (let i = 0; i < n; i++) {
    pts.push([X(i), yTop - (i + 1) * rise]);
    if (i < n - 1) pts.push([X(i + 1), yTop - (i + 1) * rise]);
  }
  pts.push([X(n - 1) - dir * wv / slope, yBot]);
  pts.push([xTop, yTop - rise - wv]);
  if (dir < 0) pts.reverse();
  cut(pts, z0, z1);
  return { run, rise, at: x => yTop - Math.floor((x - xTop) * dir / run + 1) * rise };
}
export const flightA = flight(FT, L1, FB, L0, 16, LANE[0], LANE[1]);
// a handrail along the flight, on the far side of the lane
add('furn', [[FT, L1 + 0.9], [FB, L0 + 0.9], [FB, L0 + 0.94], [FT, L1 + 0.94]], LANE[0] + 0.04, LANE[0] + 0.08, { mat: 'metal' });

// ---------------------------------------------------------------- furniture
let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function table(x0, x1, y, z0, z1, h = 0.74, wood = 'oak') { as(wood, () => {
  furn(R(x0, y + h - 0.04, x1, y + h), z0, z1);
  for (const lx of [x0 + 0.06, x1 - 0.1]) for (const lz of [z0 + 0.06, z1 - 0.1]) furn(R(lx, y, lx + 0.04, y + h - 0.04), lz, lz + 0.04);
}); }
function chair(x, y, zc, face, wood = 'oak') { as(wood, () => {   // x is the chair's middle, face +1 looks to +x
  const z0 = zc - 0.22, z1 = zc + 0.22, b = x - face * 0.22;
  furn(R(x - 0.22, y + 0.43, x + 0.22, y + 0.47), z0, z1);
  furn(face > 0 ? R(b, y + 0.47, b + 0.035, y + 0.86) : R(b - 0.035, y + 0.47, b, y + 0.86), z0 + 0.02, z1 - 0.02);
  for (const lx of [x - 0.21, x + 0.18]) for (const lz of [z0 + 0.01, z1 - 0.04]) furn(R(lx, y, lx + 0.03, y + 0.43), lz, lz + 0.03);
}); }
function stool(x, y, zc) {
  furn(R(x - 0.18, y + 0.72, x + 0.18, y + 0.76), zc - 0.18, zc + 0.18, { mat: 'oak' });
  MAT = 'metal';
  furn(R(x - 0.16, y, x - 0.13, y + 0.72), zc - 0.015, zc + 0.015);
  furn(R(x + 0.13, y, x + 0.16, y + 0.72), zc - 0.015, zc + 0.015);
  furn(R(x - 0.15, y + 0.3, x + 0.15, y + 0.32), zc - 0.015, zc + 0.015);
  MAT = null;
}
function pendant(x, yCeil, yShade, zc, r = 0.2) {
  furn(R(x - 0.008, yShade + 0.22, x + 0.008, yCeil), zc - 0.008, zc + 0.008, { mat: 'metal' });
  furn([[x - r, yShade], [x + r, yShade], [x + r * 0.4, yShade + 0.22], [x - r * 0.4, yShade + 0.22]], zc - r, zc + r, { mat: 'brass' });
}
function bed(xHead, y, z0, z1, dir = 1) {       // headboard at xHead, the bed runs to +x
  const X = v => xHead + dir * v, r = (a, b, c, d) => (dir > 0 ? R(X(a), b, X(c), d) : R(X(c), b, X(a), d));
  const o = { mat: 'oak' };
  furn(r(0, y, 0.12, y + 1.1), z0, z1, o);
  furn(r(0.12, y + 0.08, 2.2, y + 0.34), z0 + 0.05, z1 - 0.05, o);
  furn(r(0.14, y, 0.2, y + 0.08), z0 + 0.1, z0 + 0.14, o);
  furn(r(2.1, y, 2.16, y + 0.08), z0 + 0.1, z0 + 0.14, o);
  furn([[X(0.14), y + 0.34], [X(2.18), y + 0.34], [X(2.18), y + 0.56], [X(2.12), y + 0.6], [X(0.2), y + 0.6], [X(0.14), y + 0.56]].map(p => p), z0 + 0.08, z1 - 0.08, { mat: 'linen' });
  furn([[X(0.2), y + 0.6], [X(0.7), y + 0.6], [X(0.72), y + 0.72], [X(0.66), y + 0.78], [X(0.24), y + 0.78], [X(0.18), y + 0.7]], z0 + 0.2, z1 - 0.2, { mat: 'linen2' });
  furn([[X(0.9), y + 0.6], [X(2.24), y + 0.6], [X(2.26), y + 0.3], [X(2.3), y + 0.3], [X(2.28), y + 0.64], [X(2.2), y + 0.68], [X(0.92), y + 0.68]], z0 + 0.02, z1 - 0.02, { mat: 'ochre' });
}
function sofa(xBack, y, z0, z1, dir = 1) { as('fabric', () => {   // back at xBack, the seat faces dir
  const X = v => xBack + dir * v, r = (a, b, c, d) => (dir > 0 ? R(X(a), b, X(c), d) : R(X(c), b, X(a), d));
  furn([[X(0), y + 0.08], [X(0.98), y + 0.08], [X(0.98), y + 0.38], [X(0.22), y + 0.38], [X(0.22), y + 0.8], [X(0), y + 0.8]], z0 + 0.2, z1 - 0.2);
  furn([[X(0.24), y + 0.38], [X(0.96), y + 0.38], [X(0.98), y + 0.48], [X(0.94), y + 0.52], [X(0.26), y + 0.52]], z0 + 0.2, z1 - 0.2);
  furn([[X(0.24), y + 0.52], [X(0.4), y + 0.52], [X(0.44), y + 0.86], [X(0.38), y + 0.9], [X(0.24), y + 0.86]], z0 + 0.22, z1 - 0.22);
  const arm = [[X(0), y + 0.08], [X(0.98), y + 0.08], [X(0.98), y + 0.52], [X(0.95), y + 0.59], [X(0.88), y + 0.62], [X(0.1), y + 0.62], [X(0.03), y + 0.59], [X(0), y + 0.52]];
  const armPts = dir > 0 ? arm : arm.slice().reverse();          // rounded arms, so the sofa is not a stack of boxes
  furn(armPts, z0, z0 + 0.2);
  furn(armPts, z1 - 0.2, z1);
  furn(r(0.04, y, 0.08, y + 0.08), z0 + 0.05, z0 + 0.09);
  furn(r(0.9, y, 0.94, y + 0.08), z0 + 0.05, z0 + 0.09, { mat: 'oak' });
}); }
function lounger(x0, y, z0, z1, dir = 1) { MAT = 'teak';
  const X = v => x0 + dir * v;
  furn([[X(0), y + 0.3], [X(1.4), y + 0.3], [X(1.9), y + 0.82], [X(1.84), y + 0.86], [X(1.36), y + 0.38], [X(0), y + 0.38]], z0, z1);
  furn(dir > 0 ? R(X(0.05), y, X(0.09), y + 0.3) : R(X(0.09), y, X(0.05), y + 0.3), z0 + 0.04, z0 + 0.08);
  furn(dir > 0 ? R(X(1.3), y, X(1.34), y + 0.3) : R(X(1.34), y, X(1.3), y + 0.3), z0 + 0.04, z0 + 0.08);
  MAT = null;
}
function units(x0, x1, y0, y1, n, z0, z1, gap = 0.006) {   // cupboard doors seen face on
  const w = (x1 - x0) / n;
  for (let i = 0; i < n; i++) furn(R(x0 + i * w + gap, y0, x0 + (i + 1) * w - gap, y1), z0, z1);
}
function books(x0, x1, y, z0, z1) {
  let x = x0;
  while (x < x1 - 0.06) {
    if (rnd() < 0.08) { x += 0.12 + rnd() * 0.2; continue; }
    const w = 0.02 + rnd() * 0.035, h = 0.18 + rnd() * 0.14;
    furn(R(x, y, x + w, y + h), z0 + rnd() * 0.04, z1, { light: true, mat: 'book', tone: rnd() });
    x += w + 0.004;
  }
}

// L0, kitchen and dining under the upper floor at ±0.00 (everything behind the stair lane, so the cut shows it)
as('terrazzo', () => {
  furn(R(4.9, L0, 6.2, L0 + 0.1), -8.1, -6.1);
  furn(R(4.8, L0 + 0.1, 6.3, L0 + 0.88), -8.2, -6.0);
  furn(R(4.65, L0 + 0.88, 6.75, L0 + 0.93), -8.3, -5.9, { mat: 'stone' });
});
stool(6.95, L0, -7.8); stool(6.95, L0, -7.0); stool(6.95, L0, -6.2);
pendant(5.55, 2.75, 1.65, -7.6); pendant(5.55, 2.75, 1.65, -6.6);
as('sage', () => {
  units(4.6, 8.4, L0 + 0.1, L0 + 0.88, 6, -9.7, -9.1);
  furn(R(4.55, L0 + 0.88, 8.45, L0 + 0.92), -9.7, -9.05, { mat: 'stone' });
  furn(R(4.6, L0, 8.4, L0 + 0.1), -9.7, -9.15);
  units(8.6, 9.3, L0, L0 + 2.4, 1, -9.7, -9.1);
});
table(8.3, 10.1, L0, -8.3, -6.6);
chair(7.95, L0, -7.9, 1); chair(7.95, L0, -7.0, 1); chair(10.45, L0, -7.9, -1); chair(10.45, L0, -7.0, -1);
pendant(9.2, 2.75, 1.55, -7.45, 0.3);

// L0, the living room, two storeys high
furn(R(12.6, L0, 16.7, L0 + 0.015), -9.0, -5.6, { mat: 'rug' });
sofa(12.9, L0 + 0.015, -8.9, -5.9, 1);
as('oak', () => { furn(R(14.4, L0 + 0.335, 15.6, L0 + 0.395), -8.1, -6.6); furn(R(14.6, L0 + 0.015, 15.4, L0 + 0.335), -7.9, -6.8); });
furn([[17.05, L0 + 0.115], [16.3, L0 + 0.115], [16.25, L0 + 0.435], [16.9, L0 + 0.455], [17.2, L0 + 0.965], [17.3, L0 + 0.935]], -8.3, -7.5, { mat: 'ochre' });
as('oak', () => { furn(R(16.85, L0 + 0.015, 16.9, L0 + 0.115), -8.25, -8.2); furn(R(16.35, L0 + 0.015, 16.4, L0 + 0.115), -8.25, -8.2); });
furn(R(14.3, 3.3, 15.5, 3.36), -7.9, -6.7, { mat: 'brass' });   // the big pendant in the double height
furn(R(14.89, 3.36, 14.91, 5.95), -7.31, -7.29, { mat: 'metal' });
as('oak', () => {
  furn(R(11.7, L0, 17.4, L0 + 0.04), -9.7, -9.35);            // bookshelf on the back wall, under the high window
  for (let i = 0; i <= 5; i++) furn(R(11.7, 0.5 + i * 0.5, 17.4, 0.53 + i * 0.5), -9.7, -9.35);
  for (const sx of [11.7, 13.6, 15.5, 17.36]) furn(R(sx, L0, sx + 0.04, 3.03), -9.7, -9.35);
  for (let i = 0; i < 5; i++) books(11.8, 17.3, 0.53 + i * 0.5, -9.7, -9.42);
  furn(R(11.74, L0 + 0.04, 17.36, L0 + 0.5), -9.7, -9.35);
});

// L1, bedroom and study at +3.10
bed(4.35, L1, -9.6, -7.8);
furn(R(4.35, L1, 4.85, L1 + 0.5), -7.7, -7.25, { mat: 'oak' });
pendant(4.6, 5.95, 4.4, -7.45, 0.12);
as('linen', () => units(7.2, 8.8, L1, L1 + 2.3, 2, -9.7, -9.1));
table(9.2, 10.8, L1, -8.6, -7.9, 0.75);
chair(10.0, L1, -7.55, -1);
furn([[6.9, L1 + 0.4], [7.7, L1 + 0.4], [7.75, L1 + 0.62], [7.05, L1 + 0.62], [6.95, L1 + 1.0], [6.85, L1 + 0.98]], -6.6, -5.8, { mat: 'ochre' });   // a reading chair by the stair
as('oak', () => { furn(R(6.95, L1, 7.0, L1 + 0.4), -6.55, -6.5); furn(R(7.6, L1, 7.65, L1 + 0.4), -6.55, -6.5); });

// terrace and pool
table(19.2, 21.0, L0, -8.6, -7.0, 0.74, 'teak');
chair(18.85, L0, -8.2, 1, 'teak'); chair(18.85, L0, -7.4, 1, 'teak'); chair(21.35, L0, -8.2, -1, 'teak'); chair(21.35, L0, -7.4, -1, 'teak');
lounger(22.2, L0, -6.6, -5.9, 1);
furn(R(18.6, L0, 19.4, L0 + 0.55), -5.95, -5.45, { mat: 'terracotta' });   // a planter by the glass

// ---------------------------------------------------------------- coursing on the brick of the south front
export const coursing = [];
function course(x0, y0, x1, y1, holes) {
  const h = 0.28, z = D1 + 0.004;
  const inHole = (x, y) => holes.some(([a, b, c, d]) => x > a && x < c && y > b && y < d);
  for (let y = y0 + h, row = 0; y < y1 - 0.05; y += h, row++) {          // bed joints, broken by the windows
    let x = x0;
    while (x < x1) {
      const hole = holes.find(([a, b, c, d]) => y > b && y < d && x >= a - 1e-6 && x < c);
      if (hole) { x = hole[2]; continue; }
      const next = Math.min(x1, ...holes.filter(([a, b, c, d]) => y > b && y < d && a > x).map(q => q[0]));
      coursing.push(x, y, z, next, y, z); x = next;
    }
  }
  for (let y = y0, row = 0; y < y1 - 0.05; y += h, row++) {              // head joints, staggered row by row
    let x = x0 + (row % 2 ? 0.35 : 0.7) + rnd() * 0.2;
    while (x < x1 - 0.1) {
      const yt = Math.min(y + h, y1);
      if (!inHole(x, (y + yt) / 2)) coursing.push(x, y, z, x, yt, z);
      x += 0.55 + rnd() * 0.45;
    }
  }
}
course(XW + 0.3, L0, XG, 2.75, [[5.4, 0.9, 8.4, 2.3]]);
course(XG, L0, XE - 0.45, 5.95, [[12.2, 0.4, 17.0, 5.4]]);

// ---------------------------------------------------------------- floors with a tile grid
floors.push({ x0: XW + 0.3, x1: XE - 0.45, z0: D0 + 0.3, z1: D1 - 0.3, y: L0, step: 0.6 });
floors.push({ x0: XW + 0.3, x1: XG, z0: D0 + 0.3, z1: LANE[0], y: L1, step: 0.5 });
floors.push({ x0: XW + 0.3, x1: XG, z0: LANE[1], z1: D1 - 0.3, y: L1, step: 0.5 });
floors.push({ x0: XW + 0.3, x1: FT, z0: LANE[0], z1: LANE[1], y: L1, step: 0.5 });
floors.push({ x0: XE, x1: 24.25, z0: D0 - 0.3, z1: D1 + 0.3, y: L0, step: 0.6 });
floors.push({ x0: -1.4, x1: XW, z0: D0 - 0.3, z1: D1 + 0.3, y: L0, step: 0.6 });

// ---------------------------------------------------------------- entourage
const nat = x => { for (let i = 0; i < natural.length - 1; i++) { const [ax, ay] = natural[i], [bx, by] = natural[i + 1]; if ((x - ax) * (x - bx) <= 0 && ax !== bx && ay > -6 && by > -6) return ay + (by - ay) * (x - ax) / (bx - ax); } return 0; };
sprites.push({ type: 'walk', x: -4.5, y: L0, z: -6.5, h: 1.72 });
sprites.push({ type: 'stand', x: 11.95, y: L0, z: -8.6, h: 1.68, flip: true });           // between the dining table and the sofa
sprites.push({ type: 'stair', x: 10.5, y: flightA.at(10.5), z: -4.62, h: 1.74 });
sprites.push({ type: 'sit', x: 13.35, y: L0 + 0.035, z: -7.4, h: 1.7 });
sprites.push({ type: 'standDress', x: 14.0, y: L0, z: -4.62, h: 1.66 });                  // at the cut for scale
sprites.push({ type: 'sit', x: 7.95, y: L0, z: -7.0, h: 1.68 });
sprites.push({ type: 'stand', x: 10.75, y: L1, z: -6.3, h: 1.74, flip: true });           // at the balustrade, looking down into the living room
sprites.push({ type: 'stand', x: 20.1, y: L0, z: -6.2, h: 1.76, tag: 'terrace' });
sprites.push({ type: 'standDress', x: 23.4, y: L0, z: -8.8, h: 1.64, flip: true, tag: 'terrace' });
sprites.push({ type: 'walk', x: 33.4, y: nat(33.4), z: -6.0, h: 1.7, flip: true });
sprites.push({ type: 'tree', x: 38.5, y: nat(38.5), z: -14, h: 5.0, flip: true });
sprites.push({ type: 'cypress', x: -9.5, y: 0, z: -9.5, h: 6.4 });
sprites.push({ type: 'cypress', x: -18.0, y: 0, z: -18, h: 9.5 });
sprites.push({ type: 'cypress', x: 35.2, y: nat(35.2), z: -19, h: 9.0 });
sprites.push({ type: 'cypress', x: 1.2, y: 0, z: -16, h: 7.5 });
sprites.push({ type: 'tree', x: 21.4, y: 0, z: -16, h: 4.6, flip: true });
sprites.push({ type: 'tree', x: -5.6, y: 0, z: -12, h: 5.4 });
sprites.push({ type: 'plant', x: 17.25, y: L0, z: -9.2, h: 1.5 });
sprites.push({ type: 'plant', x: 10.6, y: L1, z: -9.3, h: 1.2 });

// ---------------------------------------------------------------- drawing notes
export const levels = [
  { y: 0, text: '±0.00', note: 'ERDGESCHOSS' },
  { y: 3.1, text: '+3.10', note: 'OBERGESCHOSS' },
  { y: 6.45, text: '+6.45', note: 'DACH' },
];
export const grid = [['A', 4.15], ['B', 11.1], ['C', 17.87]];
// [name, places to try in order, the depths of cut it belongs to (optional)]
export const labels = [
  ['KÜCHE', [[6.1, 2.4], [4.5, 1.25], [6.2, 1.9]]], ['ESSEN', [[8.2, 2.1], [7.5, 2.4], [9.9, 0.95]]],
  ['SCHLAFEN', [[5.2, 5.65], [4.5, 5.0], [6.0, 5.2]]], ['ARBEITEN', [[9.1, 5.65], [10.0, 5.3], [9.2, 4.6]]],
  ['WOHNEN', [[13.2, 3.05], [15.6, 3.05], [12.0, 5.6]]],
  ['TERRASSE', [[19.6, 1.6], [19.0, 2.2]]],
  ['VORPLATZ', [[-3.4, 0.35], [-6.4, 0.35]]], ['POOL', [[25.0, 0.4], [27.2, 0.4]]],
];
export const LANE_Z = LANE;
