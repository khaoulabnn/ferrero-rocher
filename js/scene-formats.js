// a. Content Marketing · Content Strategy and Creation — six real pieces on a gold thread, one per
// format, in the report's order and with its journey stage. Click a piece to open
// its card: the report's own description and the real asset.

import { sound } from './sound.js';

const FORMATS = [
  { name: 'Main campaign video', stage: 'Awareness', text: 'The emotional story, showing ordinary moments of sharing between family and friends.',
    asset: `<img src="assets/film/first.jpg" alt=""><span class="o-play">▶</span><em class="o-hint">Plays in full next</em>` },
  { name: 'Short social media video', stage: 'Awareness', text: 'Created with the intent to capture the attention quickly and be shared via the social media … the song’s repeatable hook builds recall. The original song also creates a unique audio identity for the campaign.',
    asset: `<video src="assets/clips/short.mp4" poster="assets/posters/short.jpg" playsinline controls></video>` },
  { name: 'Storybook', stage: 'Consideration', text: '“The Unsent Message” placing the product in everyday situations; stories make the message easier to remember (Pulizzi, 2012).',
    asset: `<div class="o-page" style="background-image:url(assets/storybook/p01.jpg)"></div>` },
  { name: 'Blog article', stage: 'Interest', text: 'Builds search visibility (SEO) for non-occasions topics, and drives people to the brand.',
    asset: `<img src="blog/img/hero-wide.jpg" alt="">` },
  { name: 'Email newsletter', stage: 'Retention', text: 'Addresses people who are already familiar with Ferrero Rocher and motivates unplanned purchase and sharing.',
    asset: `<img src="newsletter/img/hero.jpg" alt="">` },
  { name: 'Display banners', stage: 'Awareness', text: 'Three standard sizes repeat the slogan and send viewers to the story.',
    asset: `<div class="o-banners"><img src="assets/img/ferrero-rocher-banner-728x90@2x.png" alt=""><img src="assets/img/ferrero-rocher-banner-300x250@2x.png" alt=""><img src="assets/img/ferrero-rocher-banner-320x50@2x.png" alt=""></div>` },
];
const X = i => 300 + i * 264, Y = i => 520 + (i - 2.5) ** 2 * 13;

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  const shelf = el.querySelector('.o-shelf'), card = el.querySelector('.o-card');
  shelf.innerHTML = `<svg class="o-thread" viewBox="0 0 1920 1080"><path pathLength="1" d="M 110 ${Y(0) + 205} C 640 ${Y(2) + 150}, 1280 ${Y(3) + 150}, 1810 ${Y(5) + 205}"/></svg>` +
    FORMATS.map((f, i) => `
    <button class="o-item" data-i="${i}" style="left:${X(i)}px;top:${Y(i)}px;--d:${i * .09}s">
      <span class="o-shadow"></span><img class="o-piece cut" src="assets/cut/piece.png" alt="">
      <span class="o-no">0${i + 1}</span><b>${f.name}</b><i>${f.stage}</i>
    </button>`).join('');
  const items = [...shelf.querySelectorAll('.o-item')];
  let open = -1, raf = 0;
  const par = { x: 0, y: 0, tx: 0, ty: 0 };

  function openCard(i) {
    if (open === i) return closeCard();
    open = i;
    sound.land(.45);
    const f = FORMATS[i];
    card.innerHTML = `<div class="o-asset">${f.asset}</div><div class="o-txt"><span class="o-no">0${i + 1}</span><h3 class="display">${f.name}</h3><i class="o-stage">${f.stage}</i><p>${f.text}</p><small>Group report, Content Marketing: Content Strategy and Creation</small></div>`;
    el.classList.add('carded');
    items.forEach((it, j) => it.classList.toggle('sel', j === i));
    const v = card.querySelector('video'); if (v) v.play().catch(() => {});
  }
  function closeCard() {
    open = -1; el.classList.remove('carded');
    items.forEach(it => it.classList.remove('sel'));
    card.querySelector('video')?.pause();
  }
  shelf.addEventListener('click', e => { const b = e.target.closest('.o-item'); if (b) openCard(+b.dataset.i); });
  card.addEventListener('click', e => { if (!e.target.closest('video')) closeCard(); });

  const onMove = e => { const p = ctx.toStage(e); par.tx = p.x / 960 - 1; par.ty = p.y / 540 - 1; };
  function loop(now) {
    raf = requestAnimationFrame(loop);
    par.x += (par.tx - par.x) * .05; par.y += (par.ty - par.y) * .05;
    items.forEach((it, i) => {
      const depth = 1 - Math.abs(i - 2.5) / 5;
      it.style.translate = `${-par.x * 18 * depth}px ${-par.y * 10 * depth + Math.sin(now / 900 + i) * 4}px`;
    });
  }

  return {
    enter({ from } = {}) {
      closeCard();
      el.classList.remove('is-in', 'landed'); void el.offsetWidth;
      // arriving from the calendar, the pieces are flown in by the transition
      if (from !== 'calendar') el.classList.add('landed');
      requestAnimationFrame(() => el.classList.add('is-in'));
      el.addEventListener('pointermove', onMove);
      raf = requestAnimationFrame(loop);
    },
    leave() { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); closeCard(); el.classList.remove('is-in'); },
    slots() { return items.map(it => ctx.rect(it.querySelector('.o-piece'))); },
    land() { el.classList.add('landed'); },
    next() { if (open >= 0) { closeCard(); return true; } return false; },
    key(e) { if (e.key === 'Escape') closeCard(); },
  };
}
