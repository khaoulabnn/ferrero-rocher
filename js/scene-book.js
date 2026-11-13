// Scene 4 — the real storybook, page-turned in 3D. Each PDF page is an open
// spread, so a turn lifts the right half and lands it as the next left half.

import { sound } from './sound.js';

const PAGES = 12;
const url = i => `url(assets/storybook/p${String(i + 1).padStart(2, '0')}.jpg)`;
for (let i = 0; i < PAGES; i++) new Image().src = `assets/storybook/p${String(i + 1).padStart(2, '0')}.jpg`;

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  const spread = el.querySelector('.k-spread');
  const counter = el.querySelector('.k-n');
  spread.innerHTML = `
    <div class="k-shadow"></div>
    <div class="k-page k-left"></div>
    <div class="k-page k-right"></div>
    <div class="k-leaf" hidden><div class="k-face k-front"><div class="k-shade"></div></div><div class="k-face k-back"><div class="k-shade"></div></div></div>
    <div class="k-gutter"></div>`;
  const left = spread.querySelector('.k-left'), right = spread.querySelector('.k-right');
  const leaf = spread.querySelector('.k-leaf'), front = leaf.querySelector('.k-front'), back = leaf.querySelector('.k-back');
  const gutter = spread.querySelector('.k-gutter'), shadow = spread.querySelector('.k-shadow');
  let i = 0, turning = false;

  function paint() {
    left.style.backgroundImage = url(i);
    right.style.backgroundImage = url(i);
    const closed = i === 0;               // the cover sits alone on the right
    left.style.opacity = closed ? 0 : 1;
    gutter.style.opacity = closed ? 0 : 1;
    shadow.style.left = closed ? 'calc(var(--pw) - 10px)' : '-10px';
    counter.textContent = closed ? 'Cover' : `Spread ${i} of ${PAGES - 1}`;
    spread.classList.toggle('closed', closed);
  }

  function turn(dir) {
    if (turning) return;
    const to = i + dir;
    if (to < 0 || to >= PAGES) return;
    turning = true;
    sound.page();
    const a = dir > 0 ? i : to, b = dir > 0 ? to : i;
    front.style.backgroundImage = url(a);
    back.style.backgroundImage = url(b);
    leaf.style.transition = 'none';
    leaf.style.transform = dir > 0 ? 'rotateY(0deg)' : 'rotateY(-180deg)';
    leaf.hidden = false;
    if (dir > 0) right.style.backgroundImage = url(to);
    else { left.style.backgroundImage = url(to); if (to === 0) left.style.opacity = 0; }
    leaf.getBoundingClientRect();
    leaf.classList.add('turning');
    leaf.style.transition = '';
    leaf.style.transform = dir > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)';
    if (to === 0) { gutter.style.opacity = 0; shadow.style.left = 'calc(var(--pw) - 10px)'; }
    if (i === 0) { gutter.style.opacity = 1; shadow.style.left = '-10px'; spread.classList.remove('closed'); }
    if (to === 0) spread.classList.add('closed');
    setTimeout(() => {
      i = to;
      paint();
      leaf.hidden = true;
      leaf.classList.remove('turning');
      turning = false;
    }, 1180);
  }

  left.addEventListener('click', () => turn(-1));
  right.addEventListener('click', () => turn(1));
  paint();

  return {
    enter() { i = 0; paint(); el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); },
    leave() { el.classList.remove('is-in'); },
    coverRect() { return ctx.rect(right); },
    pageRect() { return ctx.rect(right); },
    pageImage() { return url(i); },
    next() { if (i < PAGES - 1) { turn(1); return true; } return false; },
    prev() { if (i > 0) { turn(-1); return true; } return false; },
  };
}
