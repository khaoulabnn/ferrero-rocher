// Khaoula's sections (text from content.js: OPENING, UXP, CAMPAIGN KPIs):
//   challenge  the brand challenge: the problem and the opportunity
//   perf       a. Content Marketing · Performance Evaluation (report KPIs)
//   uxt        e. UX and Personalisation · touchpoints (all BUILT)
//   uxp        e. · campaign page and customer journey (BUILT, live blog)
//   uxs        e. · personalisation (all PROPOSED)
//   uxo        e. · how it supports the objective, and how it will be tested
//   close      thank you: the unsent message is finally sent
import { OPENING, UXP } from './content.js';
import { Cutout } from './areas.js';
import { sound } from './sound.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.scene](el, ctx)); return insts.get(el); }

const life = (el, { onIn, onOut, steps = 0, onStep } = {}) => {
  let step = 0;
  const set = s => { step = s; for (let i = 1; i <= steps; i++) el.classList.toggle('s' + i, s >= i); onStep?.(s); };
  return {
    enter() { set(0); el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); onIn?.(); },
    leave() { el.classList.remove('is-in'); set(0); onOut?.(); },
    next() { if (step < steps) { set(step + 1); return true; } return false; },
    prev() { if (step > 0) { set(step - 1); return true; } return false; },
  };
};
const seal = s => `<span class="seal ${s === 'BUILT' ? 'built' : 'prop'}">${s}</span>`;
const UXEYE = t => `<p class="eyebrow ke-eyebrow">Part 2 · <span class="lc">e.</span> User Experience and Personalisation · ${t}</p>`;

const BUILD = {
  // ---------- the brand challenge ----------
  challenge(el, ctx) {
    const C = OPENING.challenge;
    const q = C.quote.replace('only for special occasions', '<span class="ring">only for special occasions<svg viewBox="0 0 600 120" preserveAspectRatio="none"><path pathLength="1" d="M 30 70 C 40 18, 300 6, 560 26 C 610 40, 600 100, 420 112 C 240 122, 30 112, 24 64"/></svg></span>');
    el.innerHTML = `<div class="grain"></div>
      <p class="eyebrow ke-eyebrow">${C.label}</p>
      <h2 class="display kc-quote">${q}</h2>
      <div class="kc-panel prob"><img class="cut" src="assets/cut/box.png" alt=""><span class="kc-tag hand">special occasions &amp; gifting</span>
        <div><i>${C.problem[0]}</i><b>${C.problem[1]}</b></div></div>
      <span class="kc-arrow"></span>
      <div class="kc-panel opp"><canvas class="kc-people"></canvas>
        <div><i>${C.opportunity[0]}</i><b>${C.opportunity[1]}</b></div></div>`;
    const cut = new Cutout(el.querySelector('.kc-people'), 'assets/people/visit');
    const base = life(el, { onIn() { cut.play(); setTimeout(() => sound.pen(3), 1200); }, onOut() { cut.stop(); } });
    // the title's gold flakes gather into the ring drawn around "only for special occasions"
    base.threadPoints = () => {
      const r = ctx.rect(el.querySelector('.ring'));
      return Array.from({ length: 90 }, (_, i) => { const a = i / 90 * Math.PI * 2; return { x: r.x + r.w / 2 + Math.cos(a) * (r.w / 2 + 18), y: r.y + r.h / 2 + Math.sin(a) * (r.h / 2 + 12) }; });
    };
    return base;
  },

  // ---------- a. Content Marketing · Performance Evaluation ----------
  perf(el) {
    const ROWS = [
      ['Awareness', 'Video views', 'assets/film/first.jpg'],
      ['Interest', 'Blog visits, time on site, organic search traffic', 'blog/img/hero-wide.jpg'],
      ['Action', 'Newsletter clicks, conversion rates', 'newsletter/img/hero.jpg'],
      ['Advocacy', 'Shares and user-generated content (UGC)', 'assets/posters/short.jpg'],
      ['Perception', 'Pre- and post-campaign survey: percentage of people who feel Ferrero Rocher is appropriate to give every day (core objective)', ''],
    ];
    el.innerHTML = `<div class="grain"></div>
      <p class="eyebrow ke-eyebrow">Part 1 · <span class="lc">a.</span> Content Marketing · Performance Evaluation</p>
      <h2 class="display kp-head">Measured against the <em>pre-launch baseline</em></h2>
      <div class="kp-steps">${ROWS.map(([g, k, img], i) => `
        <div class="kp-step${i === 4 ? ' core' : ''}" style="--i:${i}">
          ${img ? `<img src="${img}" alt="">` : '<img class="cut" src="assets/cut/piece.png" alt="">'}
          <i>${g}</i><b>${k}</b></div>`).join('')}</div>
      <p class="kp-src">Group report, Content Marketing: Performance Evaluation</p>`;
    return life(el, { onIn() { [0, 1, 2, 3, 4].forEach(i => setTimeout(() => sound.land(i === 4 ? .7 : .3), 700 + i * 160)); } });
  },

  // ---------- e. touchpoints ----------
  uxt(el) {
    const T = UXP.touch;
    el.innerHTML = `<div class="grain"></div>${UXEYE('Touchpoints')}
      <h2 class="display kt-head">${T.title.replace('a clear next step', '<em>a clear next step</em>')}</h2>
      <div class="kt-def"><p><b>UX</b> ${T.ux.replace('UX ', '')}</p><span></span><p><b>UI</b> ${T.ui.replace('UI ', '')}</p></div>
      <div class="kt-cards">${T.cards.map((c, i) => `
        <div class="kt-card" style="--i:${i}">
          <div class="pic">${c.video ? `<video src="${c.video}" poster="${c.img}" muted loop playsinline></video>` : `<img src="${c.img}" alt="">`}</div>
          <p class="meta"><span class="stage">${c.stage}</span></p>
          <b>${c.name}</b>
          ${c.buttons ? `<p class="btns">${c.buttons.map(x => `<span>${x}</span>`).join('')}</p>` : ''}
          ${(c.lines || [c.note]).map(x => `<p class="ln">${x}</p>`).join('')}
        </div>`).join('')}</div>`;
    const v = el.querySelector('video');
    return life(el, { onIn() { v.play().catch(() => {}); }, onOut() { v.pause(); } });
  },

  // ---------- e. campaign page, journey and personalisation (one slide) ----------
  uxp(el) {
    const P = UXP.page, R = UXP.pers;
    const icons = [
      '<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9.5" r="2.5"/><path d="M2.5 19c.6-3.6 2.8-5.6 5.5-5.6s4.9 2 5.5 5.6M14.2 14.6c2.8-.5 5 1 5.6 4.4"/>',
      '<path d="M3 7l9 6 9-6"/><rect x="3" y="5" width="18" height="14" rx="2"/>',
      '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/><circle cx="12" cy="15" r="1.6" fill="currentColor"/>',
      '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M12 7v6M9.5 10.5h5"/>',
    ];
    el.innerHTML = `<div class="grain"></div>${UXEYE('Campaign page, journey and personalisation')}
      <h2 class="display kj-head">From reading the story <em>to sharing it</em></h2>
      <figure class="kj-dev"><div class="bar"><i></i><i></i><i></i><span>${P.caption}</span></div>
        <iframe src="about:blank" title="${P.caption}"></iframe><figcaption class="kj-w">1440 px</figcaption></figure>
      <ol class="km-steps">${P.steps.map(([k, v], i) => `<li style="--i:${i}"><span>0${i + 1}</span><b>${k}</b><p>${v.replace(/: (.*)$/, (m, x) => ': ' + x.split(', ').map(t => `<em>${t}</em>`).join(' '))}</p></li>`).join('')}</ol>
      <div class="km-pers"><p class="km-h">Make sharing relevant <em>to each person</em> ${seal('PROPOSED')}</p>
        <div class="km-cards">${R.cards.map(([k, v], i) => `<div style="--i:${i}"><svg viewBox="0 0 24 24">${icons[i]}</svg><p><b>${k}</b>${v}</p></div>`).join('')}</div></div>`;
    const dev = el.querySelector('.kj-dev'), frame = dev.querySelector('iframe'), w = dev.querySelector('.kj-w');
    frame.addEventListener('load', () => { try { frame.contentDocument.documentElement.dataset.theme = 'light'; } catch {} });
    return life(el, {
      steps: 1,
      onIn() { if (frame.getAttribute('src') === 'about:blank') frame.src = 'blog/index.html'; w.textContent = '1440 px'; },
      onStep(s) { dev.classList.toggle('phone', s === 1); w.textContent = s === 1 ? '320 px' : '1440 px'; if (s === 1) sound.whoosh(.6, .3); },
    });
  },

  // ---------- thank you ----------
  close(el) {
    el.innerHTML = `<div class="grain"></div>
      <img class="kz-phone" src="assets/people/phone.png" alt="">
      <div class="kz-bubble"><span class="hand kz-typed"></span><i class="kz-sent">Sent ✓</i></div>
      <h2 class="display kz-thanks">Thank <em>you.</em></h2>
      <p class="kz-tag">You don’t need an occasion. <em>Share a little love.</em></p>`;
    const typed = el.querySelector('.kz-typed');
    let timers = [];
    const LINE = 'I just wanted to say thank you…';
    return life(el, {
      onIn() {
        typed.textContent = ''; el.classList.remove('sent');
        [...LINE].forEach((c, i) => timers.push(setTimeout(() => { typed.textContent += c; if (i % 3 === 0) sound.tick(); }, 900 + i * 55)));
        timers.push(setTimeout(() => { el.classList.add('sent'); sound.whoosh(.6, .4); }, 900 + LINE.length * 55 + 600));
      },
      onOut() { timers.forEach(clearTimeout); timers = []; },
    });
  },
};
