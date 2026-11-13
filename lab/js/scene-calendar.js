// a. Content Marketing · Campaign Overview — "Every day, unwrapped".
// The festive occasions already hold the gold; the month of ordinary days is empty
// ("ordinary days unclaimed", report, Campaign Overview). The presenter places real Ferrero
// Rocher on ordinary days, each opening a moment from the film; then every day is
// claimed, and the creative concept and audience arrive.
import { OPENING } from './content.js';
import { sound } from './sound.js';

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const OCCASIONS = ['Hari Raya', 'Chinese New Year', 'Deepavali'];
// storyboard beats 2–5 and the Google Flow scene that shows each
const MOMENTS = [
  { beat: 2, title: 'The visit', clip: 'Women_sharing_chocolate_in_home', cell: 8 },
  { beat: 3, title: 'The friend who notices', clip: 'Men_sharing_chocolate_in_caf', cell: 17 },
  { beat: 4, title: 'A small thank you', clip: 'Woman_knocking_on_door', cell: 23 },
  { beat: 5, title: 'A surprise from Mom', clip: 'Mother_giving_chocolate_to_son', cell: 13 },
];

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  const tags = el.querySelector('.c-tags'), cal = el.querySelector('.c-cal');
  const grid = el.querySelector('.c-grid'), ann = el.querySelector('.c-ann'), moment = el.querySelector('.c-moment');
  const concept = el.querySelector('.c-concept');

  tags.innerHTML = OCCASIONS.map((o, i) => `<div class="c-tag" style="--r:${[-5, 3, -2][i]}deg"><i class="c-hole"></i><img class="cut" src="assets/cut/piece.png" alt=""><span class="hand">${o}</span></div>`).join('');
  el.querySelector('.c-dow').innerHTML = DOW.map(d => `<span>${d}</span>`).join('');
  grid.innerHTML = Array.from({ length: 35 }, (_, i) => `<button class="c-cell${i >= 31 ? ' off' : ''}" data-i="${i}"><b>${i < 31 ? i + 1 : ''}</b></button>`).join('');
  ann.innerHTML = `
    <g class="a1"><text x="178" y="322">festive and milestone gifting</text><path d="M 300 334 C 312 348, 306 356, 296 366"/><path d="M 289 356 L 296 367 L 305 359"/></g>
    <g class="a2"><text x="1300" y="290">ordinary days <tspan class="un">unclaimed</tspan></text>
      <path d="M 1622 296 C 1662 300, 1690 318, 1690 346"/><path d="M 1681 337 L 1690 349 L 1698 336"/>
      <path class="strike" d="M 1466 282 C 1500 277, 1560 287, 1600 280"/><text class="claimed" x="1478" y="252">claimed</text></g>`;
  concept.innerHTML = `
    <div class="c-note"><p class="hand">I just wanted to say thank you…</p><span>Storyboard beat 1 · The unsent message</span></div>
    <div class="c-def">
      <p class="eyebrow">${OPENING.intro.label}</p>
      <p class="c-pos">${OPENING.intro.position}</p>
      <div class="c-fromto"><div><i>From</i><b>${OPENING.intro.from}</b></div><span class="c-arrow"></span><div class="to"><i>To</i><b>${OPENING.intro.to}</b></div></div>
      <p class="c-share hand">${OPENING.intro.share}</p>
    </div>`;

  const cells = [...grid.children];
  let placed = [], step = 0, raf = 0;
  const par = { x: 0, y: 0, tx: 0, ty: 0 };

  function drop(cell, delay = 0, big = true) {
    if (cell.querySelector('img')) return;
    const im = new Image();
    im.src = 'assets/cut/piece.png'; im.className = 'c-piece cut';
    im.style.animationDelay = `${delay}ms`;
    if (!big) im.classList.add('small');
    cell.append(im);
    cell.classList.add('has');
    if (big) setTimeout(() => sound.land(1), delay + 420);
    else if (placed.length % 4 === 0) setTimeout(() => sound.land(.22), delay + 420);
    placed.push(im);
  }
  function showMoment(cell, m) {
    const r = cell.getBoundingClientRect(), s = ctx.stage.getBoundingClientRect();
    const cx = (r.left + r.width / 2 - s.left) / ctx.scale, cy = (r.top - s.top) / ctx.scale;
    moment.innerHTML = `<figure class="c-polar" style="left:${Math.min(1560, Math.max(380, cx))}px;top:${Math.max(250, cy - 330)}px">
      <video src="assets/clips/${m.clip}.mp4" poster="assets/posters/${m.clip}.jpg" muted autoplay loop playsinline></video><figcaption><span class="hand">${m.title}</span><small>Storyboard beat ${m.beat}</small></figcaption></figure>`;
    const cap = document.createElement('span');
    cap.className = 'c-cap hand'; cap.textContent = m.title;
    cell.append(cap);
  }
  function place(cell) {
    const k = cells.filter(c => c.classList.contains('moment')).length;
    if (k >= MOMENTS.length || cell.classList.contains('off') || cell.classList.contains('has')) return false;
    cell.classList.add('moment');
    drop(cell);
    showMoment(cell, MOMENTS[k]);
    return true;
  }
  function gild() {
    moment.innerHTML = '';
    const free = cells.filter(c => !c.classList.contains('off') && !c.classList.contains('has'));
    free.forEach((c, i) => drop(c, 120 + (+c.dataset.i % 7) * 70 + Math.floor(+c.dataset.i / 7) * 110, false));
    el.classList.add('gilded');
    setTimeout(() => sound.pen(2), 1450);
  }
  function setStep(s) {
    step = s;
    if (s <= 4) {
      const k = cells.filter(c => c.classList.contains('moment')).length;
      if (k < s) place(cells[MOMENTS[k].cell]);
    }
    if (s === 5) gild();
    el.classList.toggle('concept', s === 6);
    if (s === 6) sound.whoosh(.9, .7);
  }

  // timed beats: four moments, the gilding, then the concept
  const BEATS = [1400, 4700, 8000, 11300, 14800, 19300];
  let timers = [], t0 = 0;
  function schedule(from) {
    timers.forEach(clearTimeout); timers = [];
    const now = performance.now();
    BEATS.forEach((ms, i) => { if (i >= from) timers.push(setTimeout(() => { if (step === i) setStep(i + 1); }, Math.max(0, t0 + ms - now))); });
  }

  grid.addEventListener('click', e => {
    const c = e.target.closest('.c-cell');
    if (c && step < 4 && place(c)) { step++; t0 = performance.now() - BEATS[step - 1]; schedule(step); }
  });
  const onMove = e => { const p = ctx.toStage(e); par.tx = p.x / 960 - 1; par.ty = p.y / 540 - 1; };
  function loop() {
    raf = requestAnimationFrame(loop);
    par.x += (par.tx - par.x) * .05; par.y += (par.ty - par.y) * .05;
    cal.style.transform = `perspective(2200px) rotateX(${9 - par.y * 2.5}deg) rotateY(${par.x * 3}deg)`;
    tags.style.transform = `translate(${par.x * -14}px, ${par.y * -8}px)`;
  }

  function reset() {
    placed.forEach(p => p.remove()); placed = [];
    cells.forEach(c => { c.classList.remove('has', 'moment'); c.querySelector('.c-cap')?.remove(); });
    moment.innerHTML = '';
    el.classList.remove('gilded', 'concept', 'is-in');
    step = 0;
    timers.forEach(clearTimeout); timers = [];
  }

  return {
    enter() {
      reset(); void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add('is-in'));
      el.addEventListener('pointermove', onMove);
      raf = requestAnimationFrame(loop);
      t0 = performance.now(); schedule(0);
    },
    leave() { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); reset(); },
    // → jumps to the next beat (the rest keep their rhythm); after the last beat, move on
    next() {
      if (step < 6) { setStep(step + 1); t0 = performance.now() - BEATS[step - 1]; schedule(step); return true; }
      return false;
    },
    prev() { return false; },
    // six placed pieces (moments first) for the flight into Content Strategy and Creation
    flyFrom(n) {
      const order = [...cells.filter(c => c.classList.contains('moment')), ...cells.filter(c => c.classList.contains('has') && !c.classList.contains('moment'))];
      return order.slice(0, n).map(c => { const im = c.querySelector('img'); const r = ctx.rect(im); im.style.visibility = 'hidden'; return r; });
    },
  };
}
