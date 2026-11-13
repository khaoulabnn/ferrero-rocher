// d. Website Optimisation and e. SEO (Karen) — three scenes, all reading Karen's
// wording from content.js (KAREN):
//   wo-audit    desktop and phone gauges (91 vs 68) beside her four findings;
//               → brings the PageSpeed and Lighthouse evidence forward
//   seo-search  keyword difficulty, and the keyword table as search ranges on a log scale;
//               → picks out the three main searches in Malaysia
//   seo-links   on-page gaps and off-page authority with the Moz evidence;
//               → the next lever (backlinks), handing over to f. Paid Search
import { KAREN } from './content.js';
import { sound } from './sound.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.scene](el, ctx)); return insts.get(el); }

const eyebrow = (no, sec, t) => `<div class="grain"></div><p class="eyebrow kr-eyebrow">Part 1 · <span class="lc">${no}</span> ${sec} · ${t}</p>`;
// a scene with one → build: step 0 on entry, step 1 adds the class `more`
const life = (el, { onIn, onOut, onStep } = {}) => {
  let step = 0;
  const set = s => { step = s; el.classList.toggle('more', s === 1); onStep?.(s); };
  return {
    enter() { el.classList.remove('is-in'); set(0); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); onIn?.(); },
    leave() { el.classList.remove('is-in'); set(0); onOut?.(); },
    next() { if (step < 1) { set(1); return true; } return false; },
    prev() { if (step > 0) { set(0); return true; } return false; },
  };
};
const ring = (d, vb) => `<svg class="kr-ring" viewBox="${vb}" preserveAspectRatio="none"><path pathLength="1" d="${d}"/></svg>`;
const gauge = g => `<svg class="kr-gauge" viewBox="0 0 200 200"><circle class="bg" cx="100" cy="100" r="84"/><circle class="fg" cx="100" cy="100" r="84" pathLength="100" style="--v:${g.score}"/></svg>
  <p class="kr-score"><b data-to="${g.score}">0</b><small>/100</small></p>`;
const strong = (t, words) => words.reduce((s, w) => s.replace(w, `<b>${w}</b>`), t);

const BUILD = {
  // ---------- d. the audit ----------
  'wo-audit'(el) {
    const A = KAREN.audit;
    const [f1, f2, f3, f4] = A.findings;
    el.innerHTML = eyebrow('d.', 'Website Optimisation', A.title) + `
      <h2 class="display kr-head">${A.lead[0]}<em>${A.lead[1]}</em></h2>
      <div class="kr-devices">
        <figure class="kr-laptop"><div class="scr">${gauge(A.desktop)}</div><i class="base"></i>
          <figcaption><span>${A.desktop.label}</span><small>${A.desktop.sub}</small></figcaption></figure>
        <figure class="kr-phone"><div class="scr">${gauge(A.mobile)}</div>
          <figcaption><span>${A.mobile.label}</span><small>${A.mobile.sub}</small></figcaption></figure>
      </div>
      <ol class="kr-find">
        <li style="--i:0"><span class="no">01</span><p>${strong(f1, ['pass for real users', 'much weaker'])}</p></li>
        <li style="--i:1"><span class="no">02</span><div><p>${strong(f2, ['4.1 s', '2.5 s'])}</p>
          <div class="kr-time"><i class="fill"></i><i class="th"></i><span class="t0">0 s</span><span class="t1">2.5 s</span><span class="t2">4.1 s</span></div></div></li>
        <li style="--i:2"><span class="no">03</span><p>${strong(f3, ['Render-blocking code', 'about 2.28 s'])}</p></li>
        <li style="--i:3"><span class="no">04</span><div><p>${strong(f4, ['3 of 8'])}</p>
          <div class="kr-nav">${Array.from({ length: 8 }, (_, i) => `<i class="${i < 3 ? 'fest' : ''}" style="--j:${i}"></i>`).join('')}</div>
          <p class="why">${A.why}</p></div></li>
      </ol>
      <p class="kr-cite">${A.cite}</p>
      <figure class="kr-print ps"><img src="${A.shots[0].src}" alt="${A.shots[0].caption}"><figcaption>${A.shots[0].caption}</figcaption>
        ${ring('M 380 316 C 520 296, 760 300, 790 340 C 812 380, 640 392, 470 386 C 380 382, 330 360, 372 322', '0 0 1137 702')}
        <span class="kr-note hand n1">pass for real users</span></figure>
      <figure class="kr-print lh"><div class="crop"><img src="${A.shots[1].src}" alt="${A.shots[1].caption}"></div><figcaption>${A.shots[1].caption}</figcaption>
        ${ring('M 620 1262 C 800 1240, 1080 1250, 1092 1300 C 1100 1352, 900 1372, 700 1366 C 600 1362, 586 1300, 640 1268', '0 0 1192 1480')}
        <span class="kr-note hand n2">4.1 s, above 2.5 s</span></figure>`;
    const nums = [...el.querySelectorAll('.kr-score b')];
    let timers = [];
    const count = () => nums.forEach(b => { const to = +b.dataset.to; for (let k = 0; k <= 20; k++) timers.push(setTimeout(() => { b.textContent = Math.round(to * k / 20); if (k % 4 === 0) sound.tick(); }, 500 + k * 45)); });
    return life(el, {
      onIn() { nums.forEach(b => b.textContent = '0'); count(); },
      onOut() { timers.forEach(clearTimeout); timers = []; },
      onStep(s) { if (s === 1) { sound.page(); setTimeout(() => sound.pen(3), 800); } },
    });
  },

  // ---------- e. keyword research ----------
  'seo-search'(el) {
    const S = KAREN.search;
    // searches are given as ranges; drawn on a log scale from 100 to 100K
    const num = t => { const m = t.match(/([\d.]+)(K?)/); return m ? parseFloat(m[1]) * (m[2] ? 1000 : 1) : 0; };
    const span = t => { const parts = t.replace(/\(.*\)/, '').split('–').map(s => num(s.trim())); return [parts[0], parts[1] || parts[0]]; };
    const X = v => (Math.log10(v) - 2) / 3 * 100;
    el.innerHTML = eyebrow('e.', 'Search Engine Optimisation (SEO)', `${S.title} · Keyword research`) + `
      <h2 class="display kr-head">${S.lead[0]}<em>${S.lead[1]}</em></h2>
      <div class="kr-kd">${S.kd.map((k, i) => `
        <div class="kr-tile" style="--i:${i}"><p class="lbl">${k.label}</p>
          <div class="row"><svg class="kr-gauge sm" viewBox="0 0 200 200"><circle class="bg" cx="100" cy="100" r="84"/><circle class="fg" cx="100" cy="100" r="84" pathLength="100" style="--v:${parseFloat(k.value)}"/></svg>
          <b>${k.value}</b></div><p class="sub">${k.sub}</p><p class="note">${k.note}</p></div>`).join('')}</div>
      <div class="kr-chart">
        <div class="hd"><span>Keyword</span><span class="kr-axis"><i style="left:0">100</i><i style="left:33.33%">1K</i><i style="left:66.66%">10K</i><i style="left:100%">100K</i></span><span>Searches (MY)</span><span>Comp. / KD</span></div>
        ${S.table.map(([kw, vol, comp, tag], i) => { const [lo, hi] = span(vol); return `
        <div class="kr-kw${tag ? ' main ' + tag : ''}" style="--i:${i}">
          <b>${kw}</b>
          <span class="band"><i class="${lo === hi ? 'dot' : 'bar'}" style="left:${X(lo)}%;width:${X(hi) - X(lo)}%"></i></span>
          <span class="vol">${vol.replace(/\s*\(.*\)/, '')}${/\((.*)\)/.test(vol) ? ` <em>${vol.match(/\((.*)\)/)[1]}</em>` : ''}</span>
          <span class="comp">${comp}</span></div>`; }).join('')}
      </div>
      <div class="kr-main"><p class="lbl">${S.main.label}</p>${S.main.items.map(([t, l], i) => `<span class="chip ${t}" style="--i:${i}">${l}</span>`).join('')}</div>
      <p class="kr-src">${S.sources}</p>`;
    return life(el, { onIn() { setTimeout(() => sound.page(), 400); }, onStep(s) { if (s === 1) [0, 1, 2].forEach(i => setTimeout(() => sound.land(.35), 300 + i * 180)); } });
  },

  // ---------- e. on-page and off-page ----------
  'seo-links'(el) {
    const L = KAREN.links;
    const icons = [
      '<svg viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="30" rx="4"/><circle cx="17" cy="19" r="4"/><path d="m8 36 11-11 8 8 5-5 10 10"/><path class="x" d="M4 44 44 4"/></svg>',
      '<svg viewBox="0 0 48 48"><path d="M8 14h32M8 22h32M8 30h14"/><path class="x" d="M28 30h12" stroke-dasharray="2 4"/></svg>',
      '<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="32" rx="5" stroke-dasharray="4 4"/><path d="M6 28h36M12 34h18"/></svg>',
    ];
    el.innerHTML = eyebrow('e.', 'Search Engine Optimisation (SEO)', `${KAREN.search.title} · On-page and off-page`) + `
      <h2 class="display kr-head">On-page <em>and</em> off-page</h2>
      <div class="kr-on"><p class="lbl">${L.onpage.label}</p>
        ${L.onpage.items.map((t, i) => `<div class="gap" style="--i:${i}">${icons[i]}<p>${t.replace(/^(\d+[-\w]*|no)/, '<b>$1</b>')}</p></div>`).join('')}
        <p class="why">${L.onpage.why}</p></div>
      <div class="kr-off">
        <div class="tiles">${L.offpage.map((o, i) => `<div class="kr-tile" style="--i:${i}"><p class="lbl">${o.label}</p><b>${o.value}</b><p class="sub">${o.sub}</p></div>`).join('')}</div>
        <figure class="kr-print moz"><img src="${L.shot.src}" alt="${L.shot.caption}"><figcaption>${L.shot.caption}</figcaption>
          ${ring('M 278 254 C 380 240, 470 250, 474 300 C 478 350, 380 352, 300 346 C 250 342, 240 280, 290 258', '0 0 1379 586')}
          ${ring('M 548 252 C 700 236, 830 246, 836 320 C 842 392, 700 396, 580 390 C 520 386, 520 280, 560 258', '0 0 1379 586')}
          <span class="kr-note hand n3">little growth</span></figure>
      </div>
      <div class="kr-lever"><p>${L.lever.line}</p><div>${L.lever.who.map((w, i) => `<span class="chip" style="--i:${i}">${w}</span>`).join('')}</div></div>
      <p class="kr-src">${L.sources}</p>`;
    return life(el, {
      onIn() { setTimeout(() => sound.pen(3), 1400); },
      onStep(s) { if (s === 1) { sound.whoosh(.5, .3); [0, 1, 2].forEach(i => setTimeout(() => sound.land(.35), 450 + i * 180)); } },
    });
  },
};
