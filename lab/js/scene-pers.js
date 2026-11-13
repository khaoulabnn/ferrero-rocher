// Part 2 e. (ii) — Personalisation. Khaoula's ladder (Figure 3 / Table 5) rises from
// customisation to AI-assisted suggestions; the relationship segments people
// choose are shown with the campaign's own characters. → brings in the privacy
// and testing safeguards from the draft.
import { Cutout } from './areas.js';
import { sound } from './sound.js';

const STEPS = [
  ['Segmentation', 'The relationship people choose: family, friends, colleagues, self'],
  ['Behavioural tracking', 'Stories read and relationships chosen reorder the next prompts'],
  ['Personalised email', '“The Today Note” matches subject and lead story to the segment'],
  ['Personalised video', 'Each segment sees its matching cutdown first'],
  ['Dynamic content', 'Site hero and card starters follow the chosen relationship'],
  ['Social media personalisation', 'Replies follow the commenter’s chosen story'],
  ['AI assistant', '“Say it for me”: three starters in the chosen tone, labelled as AI'],
];
const SEGMENTS = [
  { k: 'Family', clip: 'assets/people/visit' },
  { k: 'Friends', clip: 'assets/people/friends' },
  { k: 'Colleagues' },
  { k: 'Self' },
];

let inst;
export function create(el) { return inst ??= build(el); }

function build(el) {
  el.innerHTML = `<div class="grain"></div>
    <p class="eyebrow pe-eyebrow">Part 2 · <span class="lc">e.</span> User Experience and Personalisation</p>
    <h2 class="display pe-head">Tailoring follows relationships and intentions, <em>never birthdays.</em></h2>
    <p class="pe-sub">Customisation lets people shape the experience; personalisation tailors it using data (Sundar &amp; Marathe, 2010). The campaign starts with customisation and adds personalisation as consent grows.</p>
    <div class="pe-left">
      <p class="pe-q hand">Who is it for?</p>
      <div class="pe-chips">${SEGMENTS.map((s, i) => `<button data-i="${i}">${s.k}</button>`).join('')}</div>
      <div class="pe-stage">
        ${SEGMENTS.map((s, i) => s.clip ? `<canvas class="pe-cut" data-i="${i}"></canvas>` : `<div class="pe-solo" data-i="${i}"><img class="cut" src="assets/cut/piece.png" alt=""><span class="hand">${s.k}</span></div>`).join('')}
      </div>
      <p class="pe-note">Self-declared at sign-up; changeable at any time · never age, religion, ethnicity or occasion</p>
      <div class="pe-safe">
        <div><b>Privacy by design</b><p>The personalisation–privacy paradox (Awad &amp; Krishnan, 2006): collect the minimum, ask plain-language consent and follow the PDPA 2010 and its 2024 amendment (Deloitte, 2024). AI can scale tailoring (Kumar et al., 2019), but people own the tone.</p></div>
        <div><b>Tested, not assumed</b><p>Personalised and generic versions run as A/B tests on click-through, card sends, opt-in and where-to-buy clicks.</p></div>
      </div>
    </div>
    <div class="pe-ladder">
      <span class="pe-end top hand">AI-assisted suggestions</span>
      ${STEPS.map(([n, t], i) => `<div class="pe-step${i === 0 ? ' start' : ''}" style="--i:${i}"><img class="cut" src="assets/cut/piece.png" alt=""><div><b>${n}</b><p>${t}</p></div>${i === 0 ? '<em>Starting point</em>' : ''}</div>`).join('')}
      <span class="pe-end bottom hand">Customisation</span>
    </div>
    <p class="pe-src">Group report, User Experience and Personalisation draft · Figure 3 and Table 5</p>`;

  const cuts = [...el.querySelectorAll('.pe-cut')].map(c => new Cutout(c, SEGMENTS[+c.dataset.i].clip));
  const chips = [...el.querySelectorAll('.pe-chips button')];
  const views = [...el.querySelectorAll('.pe-stage > *')];
  let seg = 0, cycle = 0, step = 0, timers = [];

  function choose(i, user) {
    seg = i;
    chips.forEach((c, j) => c.classList.toggle('on', j === i));
    views.forEach((v, j) => v.classList.toggle('on', j === i));
    cuts.forEach(c => c.stop());
    const k = el.querySelector(`.pe-cut[data-i="${i}"]`);
    if (k) cuts[[...el.querySelectorAll('.pe-cut')].indexOf(k)].play();
    if (user) { clearInterval(cycle); sound.tick(); }
  }
  el.querySelector('.pe-chips').addEventListener('click', e => { const b = e.target.closest('button'); if (b) choose(+b.dataset.i, true); });

  const set = s => { step = s; el.classList.toggle('safe', s === 1); if (s === 1) sound.whoosh(.7, .4); };

  return {
    enter() {
      set(0); choose(0);
      el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in'));
      clearInterval(cycle); cycle = setInterval(() => choose((seg + 1) % SEGMENTS.length), 4500);
      timers = STEPS.map((_, i) => setTimeout(() => sound.land(i === 0 ? .8 : .3), 900 + i * 260));
    },
    leave() { clearInterval(cycle); timers.forEach(clearTimeout); cuts.forEach(c => c.stop()); el.classList.remove('is-in'); set(0); },
    next() { if (step < 1) { set(1); return true; } return false; },
    prev() { if (step > 0) { set(0); return true; } return false; },
  };
}
