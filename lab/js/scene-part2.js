// Part 2, sections a–d (report 2.1–2.4). Each scene has its own visual idea built from real
// campaign assets, and content areas named after the components the assignment
// requires (content.js). No academic content is written here: the presenters'
// text appears in the areas once added.
import { byId } from './content.js';
import { area } from './areas.js';
import { sound } from './sound.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.section](el, ctx)); return insts.get(el); }

const head = (s) => `<div class="grain"></div><p class="eyebrow p2-eyebrow">Part 2 · <span class="lc">${s.no}</span></p><h2 class="display p2-head">${s.title}</h2>`;
const comps = s => Object.entries(s.components);
const inOut = el => ({ in() { el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); }, out() { el.classList.remove('is-in'); } });

const BUILD = {
  // 2.1 — the same box, printed and on screen; a divider the presenter drags (or → moves)
  '2.1'(el, ctx) {
    const s = byId('2.1'), [shift, trad, digi] = comps(s);
    el.innerHTML = head(s) + `
      <div class="p21-top">${area(shift[0], shift[1], 0)}</div>
      <div class="p21-split" style="--p:.5">
        <div class="p21-side then"><img class="p21-box print" src="assets/cut/box.png" alt=""><i class="p21-dots"></i><span class="p21-cap">Print</span></div>
        <div class="p21-side now"><img class="p21-box" src="assets/cut/box.png" alt=""><span class="p21-cap">Screen</span></div>
        <div class="p21-handle"><i></i><img src="assets/cut/piece.png" alt=""></div>
      </div>
      <div class="p21-low">${area(trad[0], trad[1], 1)}${area(digi[0], digi[1], 2)}</div>`;
    const split = el.querySelector('.p21-split');
    let p = .5, step = 0, drag = false;
    const set = (v, anim) => {
      p = Math.max(.08, Math.min(.92, v));
      split.style.transition = anim ? '--p 1.2s' : 'none';
      split.style.setProperty('--p', p);
    };
    const move = e => { if (!drag) return; const r = ctx.rect(split), x = ctx.toStage(e).x; set((x - r.x) / r.w); };
    split.addEventListener('pointerdown', e => { drag = true; split.setPointerCapture(e.pointerId); move(e); sound.tick(); });
    split.addEventListener('pointermove', move);
    split.addEventListener('pointerup', () => drag = false);
    // the divider glides on its own (a CSS custom property can't transition, so tween it)
    let tw = 0;
    const glide = to => { cancelAnimationFrame(tw); const from = p, t0 = performance.now(); sound.whoosh(1, .4);
      const f = now => { const k = Math.min(1, (now - t0) / 1300), e = k < .5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2; set(from + (to - from) * e); if (k < 1) tw = requestAnimationFrame(f); }; tw = requestAnimationFrame(f); };
    const io = inOut(el);
    return {
      enter() { step = 0; set(.86); io.in(); setTimeout(() => step === 0 && glide(.5), 900); },
      leave() { io.out(); cancelAnimationFrame(tw); },
      next() { if (step < 1) { step++; glide(.14); return true; } return false; },
      prev() { if (step > 0) { step--; glide(.5); return true; } return false; },
    };
  },

  // 2.2 — everything connects back to the brand: five components wired to the real box
  '2.2'(el, ctx) {
    const s = byId('2.2');
    const POS = [[440, 365], [1480, 365], [330, 640], [1590, 640], [960, 862]];
    const C = [960, 610];
    el.innerHTML = head(s) + `
      <div class="p22-halo"></div><img class="p22-box cut" src="assets/cut/box.png" alt="">
      <svg class="p22-wires" viewBox="0 0 1920 1080">${POS.map(([x, y], i) => {
        const sx = C[0] + (x - C[0]) * .22, sy = C[1] + (y - C[1]) * .3;
        return `<path pathLength="1" style="--d:${.3 + i * .18}s" d="M ${sx} ${sy} C ${sx + (x - sx) * .4} ${sy - 60}, ${x - (x - sx) * .3} ${y + (y < C[1] ? 70 : -40)}, ${x} ${y}"/><circle style="--d:${.3 + i * .18}s" cx="${x}" cy="${y}" r="6"/>`;
      }).join('')}</svg>
      ${comps(s).map(([k, v], i) => `<div class="p22-card" style="left:${POS[i][0]}px;top:${POS[i][1]}px;--d:${.7 + i * .18}s">${area(k, v, i)}</div>`).join('')}`;
    const cards = [...el.querySelectorAll('.p22-card')];
    let raf = 0; const par = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = e => { const p = ctx.toStage(e); par.tx = p.x / 960 - 1; par.ty = p.y / 540 - 1; };
    const loop = () => { raf = requestAnimationFrame(loop); par.x += (par.tx - par.x) * .05; par.y += (par.ty - par.y) * .05;
      cards.forEach((c, i) => c.style.translate = `${par.x * (8 + i * 3)}px ${par.y * (6 + i * 2)}px`);
      el.querySelector('.p22-box').style.translate = `${-par.x * 10}px ${-par.y * 6}px`; };
    const io = inOut(el);
    return {
      enter() { io.in(); el.addEventListener('pointermove', onMove); raf = requestAnimationFrame(loop); setTimeout(() => sound.pen(4), 400); },
      leave() { io.out(); cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); },
    };
  },

  // 2.3 — a parallax landscape; the journey starts on a phone and a piece travels the route
  '2.3'(el, ctx) {
    const s = byId('2.3');
    const D = 'M 150 830 C 420 760, 520 640, 760 680 S 1080 820, 1260 700 S 1560 480, 1790 520';
    el.innerHTML = head(s) + `
      <svg class="p23-land" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <path class="h3" d="M0 640 C 300 560, 600 610, 900 570 S 1500 520, 1920 560 V1080 H0Z"/>
        <path class="h2" d="M0 760 C 380 690, 700 760, 1000 700 S 1600 650, 1920 700 V1080 H0Z"/>
      </svg>
      <svg class="p23-path" viewBox="0 0 1920 1080"><path d="${D}"/></svg>
      <img class="p23-phone" src="assets/people/phone.png" alt="A campaign character holding a phone with an unsent thank-you">
      <svg class="p23-front" viewBox="0 0 1920 1080" preserveAspectRatio="none"><path d="M0 900 C 400 840, 760 920, 1100 870 S 1640 830, 1920 880 V1080 H0Z"/></svg>
      <img class="p23-traveller" src="assets/cut/piece.png" alt="" style="offset-path:path('${D}')">
      <div class="p23-stops"></div>`;
    const path = el.querySelector('.p23-path path'), L = path.getTotalLength();
    const AT = [.2, .44, .68, .93];
    el.querySelector('.p23-stops').innerHTML = comps(s).map(([k, v], i) => {
      const p = path.getPointAtLength(L * AT[i]);
      return `<div class="p23-stop" style="left:${p.x}px;top:${p.y}px;--d:${.9 + AT[i] * 3.2}s"><i></i><div class="p23-card">${area(k, v, i)}</div></div>`;
    }).join('');
    const layers = [...el.querySelectorAll('.p23-land, .p23-front, .p23-phone')];
    let raf = 0; const par = { x: 0, tx: 0 };
    const onMove = e => { par.tx = ctx.toStage(e).x / 960 - 1; };
    const loop = () => { raf = requestAnimationFrame(loop); par.x += (par.tx - par.x) * .05;
      layers.forEach((l, i) => l.style.translate = `${-par.x * [8, 26, 16][i]}px 0`); };
    const io = inOut(el);
    return {
      enter() { io.in(); el.addEventListener('pointermove', onMove); raf = requestAnimationFrame(loop); setTimeout(() => sound.whoosh(1.6, .35), 800); },
      leave() { io.out(); cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); },
    };
  },

  // 2.4 — a tray with three wells, a real piece settling into each component
  '2.4'(el, ctx) {
    const s = byId('2.4');
    el.innerHTML = head(s) + `<div class="p24-tray">${comps(s).map(([k, v], i) => `
      <div class="p24-well" style="--d:${.5 + i * .35}s"><img class="p24-piece cut" src="assets/cut/piece.png" alt="">${area(k, v, i)}</div>`).join('')}</div>`;
    const io = inOut(el);
    let t = [];
    return {
      enter() { io.in(); t = [0, 1, 2].map(i => setTimeout(() => sound.land(.8), 1250 + i * 350)); },
      leave() { io.out(); t.forEach(clearTimeout); },
      pieceRect() { const p = el.querySelectorAll('.p24-piece')[1]; p.style.visibility = 'hidden'; setTimeout(() => p.style.visibility = '', 1600); return ctx.rect(p); },
    };
  },
};
