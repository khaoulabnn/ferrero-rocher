// Part 2 e. (i) — Five layers, five planes. A real Ferrero Rocher, wrapped and cut open.
// Each → reveals one of Garrett's (2011) planes: a loupe magnifies the matching
// chocolate layer and a hand-drawn line carries it to the plane, with a short
// explanation. Then the UI/UX distinction from Khaoula's Table 4.
import { sound } from './sound.js';

const HX = 300, HY = 370, HW = 760, K = HW / 1167;        // halves.png placement
const PX = 90, PY = 548, PW = 260, PK = PW / 369;          // piece.png placement
const LAYERS = [
  { plane: 'Surface', part: 'Gold foil', color: 'linear-gradient(135deg,#F3D58E,#C5A059 55%,#8A6420)',
    text: 'Visual design: colour, type and imagery. Like the foil, it is the first thing people see and touch, but it is not the chocolate.',
    img: 'piece', at: [180, 112] },
  { plane: 'Skeleton', part: 'Chocolate and chopped hazelnut', color: '#5E3B20',
    text: 'Interface, navigation and information design: where each button and piece of content sits, as the coating gives the piece its form in the hand.',
    img: 'halves', at: [1128, 205] },
  { plane: 'Structure', part: 'Crisp wafer shell', color: '#D9B07A',
    text: 'Interaction design and information architecture: the hidden framework that holds every step together, as the wafer holds the filling.',
    img: 'halves', at: [1082, 318] },
  { plane: 'Scope', part: 'Hazelnut cream', color: '#8A5631',
    text: 'Functional specifications and content requirements: what the experience contains, as the cream fills the shell.',
    img: 'halves', at: [1000, 395] },
  { plane: 'Strategy', part: 'Whole hazelnut', color: '#C9A173',
    text: 'User needs and business objectives: the core that everything else is built around.',
    img: 'halves', at: [880, 250] },
];
const IMGS = { piece: { src: 'assets/cut/piece.png', w: 369, h: 335, x: PX, y: PY, k: PK }, halves: { src: 'assets/cut/halves.png', w: 1167, h: 551, x: HX, y: HY, k: K } };
const stagePt = L => { const m = IMGS[L.img]; return [m.x + L.at[0] * m.k, m.y + L.at[1] * m.k]; };
const LENS = { x: 760, y: 868, r: 112, z: 2.4 };
const TOP = 300, SLAB = 78, GAP = 10;

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  el.innerHTML = `<div class="grain"></div>
    <p class="eyebrow ux-eyebrow">Part 2 · <span class="lc">e.</span> User Experience and Personalisation</p>
    <h2 class="display ux-head">Five layers, <em>five planes.</em></h2>
    <p class="ux-def">“User experience is the perceptions and responses that result from using, or expecting to use, a product or service” <span>(International Organization for Standardization, 2019)</span></p>
    <div class="ux-art">
      <span class="ux-shadow" style="left:${HX + 40}px;top:${HY + 551 * K - 24}px;width:${HW - 80}px"></span>
      <div class="ux-half l" style="left:${HX}px;top:${HY}px;width:${583 * K}px;height:${551 * K}px;background-size:${HW}px auto;background-position:0 0"></div>
      <div class="ux-half r" style="left:${HX + 583 * K}px;top:${HY}px;width:${584 * K}px;height:${551 * K}px;background-size:${HW}px auto;background-position:${-583 * K}px 0"></div>
      <span class="ux-shadow" style="left:${PX + 20}px;top:${PY + 335 * PK - 20}px;width:${PW - 40}px"></span>
      <img class="ux-piece" src="assets/cut/piece.png" alt="Ferrero Rocher in gold foil" style="left:${PX}px;top:${PY}px;width:${PW}px">
      <div class="ux-lens" style="left:${LENS.x - LENS.r}px;top:${LENS.y - LENS.r}px;width:${LENS.r * 2}px;height:${LENS.r * 2}px"><i></i></div>
      <span class="ux-lens-cap hand" style="left:${LENS.x + LENS.r + 18}px;top:${LENS.y - 22}px"></span>
    </div>
    <svg class="ux-ann" viewBox="0 0 1920 1080"><path class="dot-line"/><path class="lead" pathLength="1"/><circle class="a" r="7"/><circle class="ring" r="16"/>
      <path class="br ui" pathLength="1"/><path class="br ux" pathLength="1"/></svg>
    <div class="ux-stack">${LAYERS.map((L, i) => `
      <div class="ux-slab" data-i="${i}"><span class="sw" style="background:${L.color}"></span>
        <div><i>${L.plane}</i><b>${L.part}</b><p>${L.text}</p></div></div>`).join('')}</div>
    <span class="ux-tag ui">UI</span><span class="ux-tag ux">UX</span>
    <div class="ux-table">
      <p class="ux-lead">“The UI is the medium through which people act; the UX is what they feel and achieve through it.”</p>
      <div class="ux-grid">
        <span></span><b class="ui">User interface (UI)</b><b class="ux">User experience (UX)</b>
        <i>What it is</i><p>The visible, interactive layer: layouts, buttons, type, colour and imagery</p><p>The whole experience before, during and after use: goals, effort, emotion and outcome</p>
        <i>Garrett’s planes</i><p>Mainly skeleton and surface</p><p>All five: strategy, scope, structure, skeleton and surface</p>
        <i>How it is judged</i><p>Legibility, visual consistency, accessibility checks</p><p>Task completion, time to send, drop-off, satisfaction, repeat use</p>
      </div>
      <p class="ux-src">Group report, User Experience and Personalisation draft, Table 4 · Garrett (2011)</p>
    </div>`;

  const slabs = [...el.querySelectorAll('.ux-slab')];
  const lens = el.querySelector('.ux-lens'), lensCap = el.querySelector('.ux-lens-cap');
  const svg = el.querySelector('.ux-ann'), lead = svg.querySelector('.lead'), dotLine = svg.querySelector('.dot-line');
  const dot = svg.querySelector('.a'), ring = svg.querySelector('.ring');
  let step = 0;

  function slabTop(i, active) {
    // collapsed slabs above the active one, the active one tall, the rest below
    let y = TOP;
    for (let j = 0; j < i; j++) y += SLAB + GAP;
    return y;
  }
  function focus(i) {
    const L = LAYERS[i], [ax, ay] = stagePt(L), m = IMGS[L.img];
    // loupe: the anchor point sits in the middle of the lens
    lens.firstElementChild.style.cssText = `background-image:url(${m.src});background-size:${m.w * m.k * LENS.z}px auto;background-position:${LENS.r - (ax - m.x) * LENS.z}px ${LENS.r - (ay - m.y) * LENS.z}px`;
    lensCap.textContent = L.part.toLowerCase();
    dot.setAttribute('cx', ax); dot.setAttribute('cy', ay); ring.setAttribute('cx', ax); ring.setAttribute('cy', ay);
    dotLine.setAttribute('d', `M ${ax} ${ay} L ${LENS.x} ${LENS.y}`);
    const ty = slabTop(i) + 46, tx = 1110;
    lead.setAttribute('d', `M ${LENS.x + LENS.r * .75} ${LENS.y - LENS.r * .65} C ${LENS.x + 230} ${LENS.y - 200}, ${tx - 170} ${ty + (i % 2 ? 30 : -10)}, ${tx - 8} ${ty}`);
    lead.style.transition = 'none'; lead.style.strokeDashoffset = 1; void lead.getBoundingClientRect();
    lead.style.transition = ''; lead.style.strokeDashoffset = 0;
    sound.pen(2);
  }
  function braces() {
    const x = 1092, y0 = TOP - 6, y1 = TOP + 2 * (SLAB + GAP) - GAP + 6, y4 = TOP + 5 * (SLAB + GAP) - GAP + 6;
    svg.querySelector('.ui').setAttribute('d', `M ${x} ${y0} q -18 4 -18 26 v ${y1 - y0 - 52} q 0 22 18 26`);
    svg.querySelector('.ux').setAttribute('d', `M ${x - 26} ${y0 - 6} q -18 4 -18 26 v ${y4 - y0 - 40} q 0 22 18 26`);
    el.querySelector('.ux-tag.ui').style.cssText = `left:${x - 74}px;top:${(y0 + y1) / 2}px`;
    el.querySelector('.ux-tag.ux').style.cssText = `left:${x - 100}px;top:${(y0 + y4) / 2 + 60}px`;
  }
  function set(s) {
    step = s;
    slabs.forEach((sl, i) => { sl.classList.toggle('shown', i < s); sl.classList.toggle('active', i === s - 1 && s <= 5); });
    el.classList.toggle('focused', s >= 1 && s <= 5);
    el.classList.toggle('compare', s === 6);
    if (s >= 1 && s <= 5) focus(s - 1);
    if (s === 6) { braces(); sound.pen(3); }
  }
  braces();

  return {
    enter() { set(0); el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); },
    leave() { set(0); el.classList.remove('is-in'); },
    pieceRect() { return ctx.rect(el.querySelector('.ux-piece')); },
    next() { if (step < 6) { set(step + 1); return true; } return false; },
    prev() { if (step > 0) { set(step - 1); return true; } return false; },
  };
}
