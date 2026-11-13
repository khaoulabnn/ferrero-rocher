// Scene-to-scene transitions. Each one carries something from scene A into
// scene B (flakes, foil, pieces, a frame, a window) so the cut is part of the story.

import { sound } from './sound.js';
import { chocolateMelt } from './melt.js';
import { chocolateStream } from './stream.js';

const EASE = 'cubic-bezier(.22,1,.36,1)';
const IN_OUT = 'cubic-bezier(.65,0,.35,1)';
const wait = ms => new Promise(r => setTimeout(r, ms));
const done = a => a.finished.catch(() => {});

function layer(stage) { return stage.querySelector('.tx'); }

// default: A recedes into depth, B settles forward
export async function depthDissolve({ A, B }) {
  B.style.zIndex = 2;
  const a = A.animate([{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }, { opacity: 0, transform: 'scale(.965)', filter: 'blur(8px)' }], { duration: 750, easing: EASE, fill: 'forwards' });
  const b = B.animate([{ opacity: 0, transform: 'scale(1.035)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 950, delay: 150, easing: EASE, fill: 'backwards' });
  await Promise.all([done(a), done(b)]);
  a.cancel();
}

// a short handwritten caption naming the section when the speaker changes (titles only, no names)
export function handoff(stage, section, presenter) {
  if (!section) return;
  const n = document.createElement('div');
  n.className = 'tx-note';
  setTimeout(() => sound.pen(3), 380);
  n.innerHTML = `<span class="hand">${section.title}</span>${section.no ? `<small>${section.no}</small>` : ''}<svg viewBox="0 0 300 20"><path d="M4 12 C 70 4, 150 18, 296 8"/></svg>`;
  stage.append(n);
  n.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }], { duration: 900, delay: 350, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' });
  n.animate([{ opacity: 1 }, { opacity: 0, transform: 'translate(-50%, -8px)' }], { duration: 700, delay: 2600, easing: EASE, fill: 'forwards' }).finished.then(() => n.remove());
}

// title → summary: the gold flakes gather into the line that maps the whole project
async function flakesToThread({ A, B, mb, ctx, stage }) {
  B.style.zIndex = 2;
  const cv = document.createElement('canvas');
  cv.width = 1920; cv.height = 1080; cv.className = 'tx-canvas';
  layer(stage).append(cv);
  const g = cv.getContext('2d');
  const pts = mb?.threadPoints?.() || Array.from({ length: 60 }, (_, i) => ({ x: 160 + i * 27, y: 860 }));
  const flakes = Array.from({ length: 170 }, (_, i) => {
    const t = pts[i % pts.length];
    return { x0: 700 + Math.random() * 520, y0: 380 + Math.random() * 360, x1: t.x + (Math.random() - .5) * 8, y1: t.y + (Math.random() - .5) * 6,
      d: Math.random() * 380, s: 4 + Math.random() * 9, r: Math.random() * 6, ph: Math.random() * 6 };
  });
  sound.crinkle(1.5, .35);
  const a = A.animate([{ opacity: 1, transform: 'scale(1)', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(.93)', filter: 'blur(10px)' }], { duration: 1000, easing: EASE, fill: 'forwards' });
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 650, easing: EASE, fill: 'backwards' });
  const T = 1500, t0 = performance.now();
  await new Promise(res => {
    (function f(now) {
      const t = now - t0;
      g.clearRect(0, 0, 1920, 1080);
      for (const p of flakes) {
        let k = Math.min(1, Math.max(0, (t - p.d) / (T - 380)));
        k = 1 - Math.pow(1 - k, 3);
        const sw = Math.sin(k * Math.PI) * 120;
        const x = p.x0 + (p.x1 - p.x0) * k + Math.cos(p.ph) * sw, y = p.y0 + (p.y1 - p.y0) * k - sw * .6;
        const sz = p.s * (1 - k * .75), flip = Math.cos(p.ph + t / 120);
        g.save(); g.translate(x, y); g.rotate(p.r + t / 400); g.scale(Math.max(.2, Math.abs(flip)), 1);
        g.fillStyle = `rgba(${200 + 40 * Math.abs(flip) | 0},${150 + 50 * Math.abs(flip) | 0},${70 + 40 * Math.abs(flip) | 0},${.9 - k * .5})`;
        g.fillRect(-sz / 2, -sz / 2, sz, sz * .8);
        g.restore();
      }
      if (t < T + 200) requestAnimationFrame(f); else res();
    })(t0);
  });
  await Promise.all([done(a), done(b)]);
  cv.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => cv.remove());
  a.cancel();
}

// → a divider: the foil sheet slides over the previous scene (the divider animates itself)
async function foilOver({ A, B }) {
  B.style.zIndex = 3; A.style.zIndex = 1;
  await wait(1250);
}
// divider → next: the foil peels away from a corner, revealing B underneath
async function foilPeel({ A, B, ma }) {
  A.style.zIndex = 3; B.style.zIndex = 1;
  await ma?.peel?.();
}

// calendar → formats: six of the placed pieces lift off the calendar and land as the six formats
async function piecesFly({ A, B, ma, mb, ctx, stage }) {
  B.style.zIndex = 2;
  const from = ma?.flyFrom?.(6) || [];
  const to = mb?.slots?.() || [];
  const L = layer(stage);
  const a = A.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 150, easing: EASE, fill: 'forwards' });
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 350, easing: EASE, fill: 'backwards' });
  sound.whoosh(1.3, .7);
  setTimeout(() => sound.land(.7), 1350);
  const flights = to.map((t, i) => {
    const f = from[i] || { x: t.x, y: 1100, w: t.w * .6, h: t.h * .6 };
    const im = document.createElement('img');
    im.src = 'assets/cut/piece.png'; im.className = 'tx-piece';
    Object.assign(im.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' });
    L.append(im);
    const dx = t.x - f.x, dy = t.y - f.y, s = t.w / f.w;
    return im.animate([
      { transform: 'translate(0,0) scale(1) rotate(0deg)' },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 220}px) scale(${1 + (s - 1) * .6}) rotate(${(i - 2.5) * 6}deg)`, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)` },
    ], { duration: 1300, delay: i * 70, easing: IN_OUT, fill: 'forwards' });
  });
  await Promise.all([...flights.map(done), done(a), done(b)]);
  mb?.land?.();
  L.querySelectorAll('.tx-piece').forEach(n => n.remove());
  a.cancel();
}

// film → storybook: the film's last frame folds down into the book's cover
async function frameToCover({ A, B, mb, stage }) {
  B.style.zIndex = 1; A.style.zIndex = 0;
  const t = mb?.coverRect?.();
  const im = document.createElement('img');
  im.src = 'assets/film/last.jpg'; im.className = 'tx-frame';
  sound.whoosh(1.2, .6);
  layer(stage).append(im);
  A.style.opacity = 0;
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 250, easing: EASE, fill: 'backwards' });
  const sx = t.w / 1920, sy = t.h / 1080;
  const f = im.animate([
    { transform: 'translate(0,0) scale(1,1)', borderRadius: '0px', filter: 'brightness(.85)' },
    { transform: `translate(${t.x}px, ${t.y}px) scale(${sx}, ${sy})`, borderRadius: '40px', filter: 'brightness(1)' },
  ], { duration: 1200, easing: IN_OUT, fill: 'forwards' });
  await done(f);
  await done(im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
  im.remove(); A.style.opacity = '';
  await done(b);
}

// storybook → web: the open page lifts and becomes the browser window
async function pageToWindow({ A, B, ma, mb, ctx, stage }) {
  B.style.zIndex = 2;
  const f = ma?.pageRect?.(), t = mb?.windowRect?.();
  if (!f || !t) return depthDissolve({ A, B });
  const card = document.createElement('div');
  card.className = 'tx-card';
  card.style.backgroundImage = ma.pageImage();
  sound.page();
  Object.assign(card.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' });
  layer(stage).append(card);
  const a = A.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: EASE, fill: 'forwards' });
  const m = card.animate([
    { transform: 'translate(0,0) scale(1) rotateY(0deg)', opacity: 1 },
    { transform: `translate(${(t.x - f.x) * .5}px, ${(t.y - f.y) * .5 - 40}px) scale(${(t.w / f.w + 1) / 2}, ${(t.h / f.h + 1) / 2}) rotateY(-10deg)`, opacity: 1, offset: .55 },
    { transform: `translate(${t.x - f.x}px, ${t.y - f.y}px) scale(${t.w / f.w}, ${t.h / f.h})`, opacity: 1 },
  ], { duration: 1150, easing: IN_OUT, fill: 'forwards' });
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 900, easing: EASE, fill: 'backwards' });
  await Promise.all([done(a), done(m), done(b)]);
  await done(card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' }));
  card.remove(); a.cancel();
}

// web → social: the desktop window narrows into the phone
async function windowToPhone({ A, B, ma, mb, stage }) {
  B.style.zIndex = 2;
  const f = ma?.windowRect?.(), t = mb?.phoneRect?.();
  if (!f || !t) return depthDissolve({ A, B });
  const card = document.createElement('div');
  card.className = 'tx-glass';
  sound.whoosh(1.1, .5);
  Object.assign(card.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' });
  layer(stage).append(card);
  const a = A.animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(6px)' }], { duration: 600, easing: EASE, fill: 'forwards' });
  const m = card.animate([
    { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px', borderRadius: '18px' },
    { left: t.x + 'px', top: t.y + 'px', width: t.w + 'px', height: t.h + 'px', borderRadius: '64px' },
  ], { duration: 1100, easing: IN_OUT, fill: 'forwards' });
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 750, easing: EASE, fill: 'backwards' });
  await Promise.all([done(a), done(m), done(b)]);
  await done(card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
  card.remove(); a.cancel();
}

// 2.4 → 2.5: one piece is lifted from the tray and carried to the cross-section
async function pieceHandoff({ A, B, ma, mb, stage }) {
  B.style.zIndex = 2;
  const f = ma?.pieceRect?.(), t = mb?.pieceRect?.();
  if (!f || !t) return depthDissolve({ A, B });
  const im = document.createElement('img');
  im.src = 'assets/cut/piece.png'; im.className = 'tx-piece';
  Object.assign(im.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' });
  layer(stage).append(im);
  sound.whoosh(1.2, .5);
  const a = A.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 100, easing: EASE, fill: 'forwards' });
  const b = B.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 700, easing: EASE, fill: 'backwards' });
  const dx = t.x - f.x, dy = t.y - f.y, s = t.w / f.w;
  const m = im.animate([{ transform: 'none' }, { transform: `translate(${dx * .5}px, ${dy * .5 - 200}px) scale(${(1 + s) / 2}) rotate(-8deg)`, offset: .5 }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }], { duration: 1400, easing: IN_OUT, fill: 'forwards' });
  await Promise.all([done(a), done(b), done(m)]);
  sound.land(.6);
  await done(im.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
  im.remove(); a.cancel();
}

// melted chocolate pours over A, B is swapped in while it is fully covered,
// then the chocolate drains away downwards to reveal B
async function meltPour({ A, B, stage }, dir = 1) {
  A.style.zIndex = 2; B.style.zIndex = 1;
  B.style.opacity = 0;
  sound.pour(2.6);
  await chocolateMelt(layer(stage), { dir, duration: 2700, onCovered: () => { A.style.opacity = 0; B.style.opacity = ''; } });
  A.style.opacity = '';
}
const meltIn = c => meltPour(c, 1);
meltIn.noteDelay = 2000;
const meltOut = c => meltPour(c, -1);

// one stream of melted chocolate leaves the piece at the side of the slide, coils
// into a ring and the ring opens onto B; the rest of A stays visible around it
async function streamMelt({ A, B, stage }) {
  const piece = stage.querySelector('.side-piece');
  const [px, py] = (A.dataset.piece || '1812,560').split(',').map(Number);
  A.style.zIndex = 1; B.style.zIndex = 2;
  const reveal = (r, C) => { B.style.clipPath = `circle(${Math.max(0, r)}px at ${C[0]}px ${C[1]}px)`; };
  reveal(0, [880, 560]);
  sound.pour(2.4);
  setTimeout(() => sound.land(.5), 2500);
  await chocolateStream(layer(stage), { from: [px, py + 30], pieceEl: piece, onReveal: reveal, duration: 3000 });
  B.style.clipPath = '';
}

export const TRANSITIONS = {
  'title>summary': flakesToThread,
  'title>challenge': flakesToThread,
  'challenge>summary': streamMelt,
  'summary>calendar': streamMelt,
  'calendar>part1': foilOver,
  'part1>formats': foilPeel,
  'perf>social': streamMelt,
  'perf>wo-audit': streamMelt,        // final order: Content Marketing hands over to Website Optimisation
  'crm>uxt': streamMelt,              // and CRM hands over to the final UX and Personalisation section
  'uxt>uxp': streamMelt,
  'uxp>uxs': streamMelt,
  'uxs>uxo': streamMelt,
  'uxo>close': streamMelt,
  'uxp>close': streamMelt,          // the merged campaign-page slide leads into the thank-you
  'summary>part1': foilOver,
  'part1>calendar': foilPeel,
  'calendar>formats': piecesFly,
  'film>book': frameToCover,
  'book>web': pageToWindow,
  'web>social': windowToPhone,
  'social>part2': foilOver,
  'ps-measure>part2': foilOver,
  'part2>p21': foilPeel,
  'social>ps-role': meltIn,
  'sm-wave>ps-role': meltIn,         // f. Paid Search still opens through Hansan's melt, after Social Media
  'seo-links>ps-role': meltIn,      // f. Paid Search still opens through the melt, now after Karen's e.
  'ps-bid>ps-measure': meltOut,
  'p24>ux': pieceHandoff,
};
