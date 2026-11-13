// f. Paid Search Campaigns (Hansan) — five scenes, each with its own idea, all reading
// Hansan's wording from content.js (PAID; his updated slides of 5 Nov):
//   ps-role     search today: a query types itself, his three findings unfold;
//               → the Bing evidence, → the Google Trends year
//   ps-keys     branded + everyday-gifting keywords beside the audience (the campaign's real characters)
//   ps-ads      the two proposed search ads, with live character counts against the limits
//   ps-bid      the bidding strategy as lanes across the campaign
//   ps-measure  a controlled test and three gold medallions, entered through melted chocolate
import { PAID } from './content.js';
import { sound } from './sound.js';
import { Cutout } from './areas.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.scene](el, ctx)); return insts.get(el); }

const eyebrow = t => `<div class="grain"></div><p class="eyebrow pd-eyebrow">Part 1 · <span class="lc">f.</span> Paid Search Campaigns · ${t}</p>`;
// `steps` → builds; the current one is in data-step
const life = (el, { onIn, onOut, onStep, steps = 0 } = {}) => {
  let step = 0;
  const set = s => { step = s; el.dataset.step = s; onStep?.(s); };
  return {
    enter() { el.classList.remove('is-in'); set(0); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); onIn?.(); },
    leave() { el.classList.remove('is-in'); set(0); onOut?.(); },
    next() { if (step < steps) { set(step + 1); return true; } return false; },
    prev() { if (step > 0) { set(step - 1); return true; } return false; },
  };
};
const ad = (a, opts = {}) => `
  <div class="pd-ad${opts.big ? ' big' : ''}">
    <p class="pd-sp"><b>Sponsored</b><img src="assets/cut/piece.png" alt=""><span>Ferrero Rocher · ${a.url}</span></p>
    <h5>${a.headlines.map((h, i) => `<span class="hl" style="--d:${i * .25}s">${h}${opts.count ? `<i class="cnt">${h.length}/30</i>` : ''}</span>`).join('<em> | </em>')}</h5>
    <p class="pd-desc">${a.description}${opts.count ? ` <i class="cnt d">${a.description.length}/90</i>` : ''}</p>
    ${a.sitelinks ? `<p class="pd-sl">${a.sitelinks.map(s => `<span>${s}</span>`).join('')}</p>` : ''}
  </div>`;

const BUILD = {
  // ---------- search today ----------
  'ps-role'(el, ctx) {
    const S = PAID.search;
    el.innerHTML = eyebrow(S.title) + `
      <img class="pd-float a" src="assets/cut/piece.png" alt=""><img class="pd-float b" src="assets/cut/piece.png" alt="">
      <h2 class="display pd-role-head">${S.lead.replace(' and ', '<br>and ')}</h2>
      <div class="pd-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg><span class="q"></span><i class="caret"></i></div>
      <div class="pd-sheet">
        ${S.findings.map(([k, v], i) => `<div class="pd-row" style="--d:${.25 + i * .2}s"><span class="no">0${i + 1}</span><b>${k}</b><p>${v}${i === 2 ? ' <i class="pd-also">also in Part 1 · e. SEO</i>' : ''}</p></div>`).join('')}
      </div>
      <figure class="pd-print pd-ev1"><img src="${S.shot.src}" alt="${S.shot.caption}"><figcaption>${S.shot.caption}</figcaption>
        <svg class="pd-ring" viewBox="0 0 1417 802" preserveAspectRatio="none"><path pathLength="1" d="M 130 250 C 400 214, 820 222, 870 300 C 900 380, 620 418, 300 410 C 140 404, 96 330, 150 262"/></svg>
        <span class="pd-note hand">a florist, not Ferrero</span></figure>
      <figure class="pd-print pd-ev2"><img src="${S.chart.src}" alt="${S.chart.caption}: ${S.findings[1][1]}"><figcaption>${S.chart.caption}</figcaption>
        <span class="pd-note hand">occasion-only demand</span></figure>`;
    const q = el.querySelector('.q'), floats = [...el.querySelectorAll('.pd-float')];
    let timers = [], raf = 0; const par = { x: 0, y: 0, tx: 0, ty: 0 };
    const type = (text, at) => [...text].forEach((c, i) => timers.push(setTimeout(() => { q.textContent += c; if (i % 2 === 0) sound.tick(); }, at + i * 70)));
    const onMove = e => { const p = ctx.toStage(e); par.tx = p.x / 960 - 1; par.ty = p.y / 540 - 1; };
    const loop = () => { raf = requestAnimationFrame(loop); par.x += (par.tx - par.x) * .04; par.y += (par.ty - par.y) * .04;
      floats.forEach((f, i) => f.style.translate = `${par.x * (i ? 40 : -30)}px ${par.y * (i ? 24 : -18)}px`); };
    const query = PAID.keywords.branded.list[0];
    return life(el, {
      steps: 2,
      onIn() {
        q.textContent = ''; el.classList.remove('open');
        type(query, 900);
        timers.push(setTimeout(() => { el.classList.add('open'); sound.whoosh(.7, .35); }, 900 + query.length * 70 + 350));
        el.addEventListener('pointermove', onMove); raf = requestAnimationFrame(loop);
      },
      onOut() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); },
      onStep(s) { if (s) { el.classList.add('open'); sound.page(); setTimeout(() => sound.pen(3), 800); } },
    });
  },

  // ---------- keywords and audience ----------
  'ps-keys'(el) {
    const K = PAID.keywords, A = PAID.audience;
    const chips = (list, cls, d0) => list.map((w, i) => `<span class="chip ${cls}" style="--d:${d0 + i * .12}s">${w}${cls === 'neg' ? '<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path pathLength="1" d="M2 12 C 30 6, 70 15, 98 8"/></svg>' : ''}</span>`).join('');
    const icons = {
      Audience: '<circle cx="9" cy="8" r="3.2"/><circle cx="16.5" cy="9.5" r="2.6"/><path d="M3.5 19c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2M14.6 14.4c2.6-.4 4.8 1 5.4 4.6"/>',
      Remarketing: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
      Timing: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    };
    el.innerHTML = eyebrow(K.title) + `
      <div class="pd-aud2">
        <p class="lbl">${A.title}</p>
        <div class="pd-people"><canvas class="pp f"></canvas><img class="pp m" src="assets/people/family.png" alt=""><img class="pp n" src="assets/people/neighbour.png" alt=""></div>
        <div class="pd-facts2">${A.points.map(([k, v], i) => `<div style="--i:${i}"><svg viewBox="0 0 24 24">${icons[k]}</svg><p><b>${k}:</b> ${v}</p></div>`).join('')}</div>
      </div>
      <div class="pd-col kw">
        <p class="lbl gsa">Google Search Ads</p>
        <h2 class="display">Branded + <em>everyday-gifting</em> keywords</h2>
        <div class="grp"><p class="lbl">Branded keywords</p>${chips(K.branded.list, 'brand', .5)}<p class="why">${K.branded.why} <span class="pd-cite">${K.branded.cite}</span></p></div>
        <div class="grp"><p class="lbl">Everyday-gifting keywords</p>${chips(K.everyday.list, 'gift', 1)}<p class="why">${K.everyday.why} <span class="pd-cite">${K.everyday.cite}</span></p></div>
        <div class="grp"><p class="lbl">Negative keywords</p>${chips(K.negative, 'neg', 1.6)}</div>
      </div>`;
    const friends = new Cutout(el.querySelector('.pp.f'), 'assets/people/friends');
    return life(el, { onIn() { friends.play(); setTimeout(() => sound.pen(3), 2200); }, onOut() { friends.stop(); } });
  },

  // ---------- ad copy ----------
  'ps-ads'(el) {
    const A = PAID.ads;
    const bars = A.list.flatMap(a => a.headlines.map(h => [h, 30])).concat(A.list.map(a => [a.description, 90]));
    el.innerHTML = eyebrow(A.title) + `
      <div class="pd-serp">
        <div class="pd-mini"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>${PAID.keywords.branded.list[0]}</div>
        ${A.list.map((a, i) => `<div class="pd-adwrap" style="--d:${.4 + i * .5}s"><span class="pill">${a.label}</span>${ad(a, { count: true, big: true })}</div>`).join('')}
      </div>
      <div class="pd-col limits">
        <h2 class="display">Google Ads <em>examples</em></h2>
        <p class="lead">${A.lead} <span class="pd-cite">${A.cite}</span></p>
        <div class="meters">${bars.map(([t, max], i) => `
          <div class="m" style="--d:${.8 + i * .12}s;--w:${t.length / max}"><p><span>${t.length > 40 ? t.slice(0, 38) + '…' : t}</span><b>${t.length}/${max}</b></p><i><u></u></i></div>`).join('')}</div>
      </div>`;
    return life(el);
  },

  // ---------- bidding ----------
  'ps-bid'(el) {
    const B = PAID.bidding, br = B.brand, gf = B.gifting;
    el.innerHTML = eyebrow(B.title) + `
      <h2 class="display pd-bid-head">${B.lead.replace('the awareness', '<em>the awareness')}</em></h2>
      <div class="pd-lanes">
        <div class="lane"><p class="who">${br.who}</p><div class="bseg gold full" style="--d:.5s"><b>${br.strategy}</b><p>${br.why} <span class="pd-cite">${br.cite}</span></p></div><img class="top-piece" src="assets/cut/piece.png" alt=""></div>
        <div class="lane"><p class="who">${gf.who}</p><div class="bseg cream" style="--d:1s"><b>${gf.first[0]}</b><p>${gf.first[1]}</p></div><span class="arrow"></span><div class="bseg gold" style="--d:1.5s"><b>${gf.then[0]}</b><p>${gf.then[1]}</p></div>
          <div class="goals"><img src="assets/film/first.jpg" alt=""><img src="assets/cut/box.png" alt=""></div></div>
        <p class="pd-gnote">${gf.note} <span class="pd-cite">${gf.cite}</span></p>
      </div>
      <div class="pd-budget"><div class="line">${Array.from({ length: 12 }, (_, i) => `<img src="assets/cut/piece.png" alt="" style="--d:${2 + i * .06}s">`).join('')}</div><p>${B.budget}</p></div>`;
    let t = [];
    return life(el, { onIn() { t = [500, 1000, 1500].map(ms => setTimeout(() => sound.land(.4), ms + 300)); }, onOut() { t.forEach(clearTimeout); } });
  },

  // ---------- measurement ----------
  'ps-measure'(el) {
    const M = PAID.measure;
    el.innerHTML = eyebrow(M.title) + `
      <h2 class="display pd-m-head">${M.test.head.replace(', ', ', <em>')}</em></h2>
      <p class="pd-m-test">${M.test.text} <span class="pd-cite">${M.test.cite}</span></p>
      <div class="pd-medals three">${M.list.map(([k, v], i) => `<div class="medal" style="--d:${.4 + i * .18}s"><div class="disc"><em>0${i + 1}</em><b>${k}</b><span>${v}</span></div></div>`).join('')}</div>
      <p class="pd-m-note">${M.note}<svg viewBox="0 0 520 16" preserveAspectRatio="none"><path pathLength="1" d="M4 10 C 140 4, 360 14, 516 6"/></svg></p>`;
    return life(el, { onIn() { setTimeout(() => sound.pen(2), 1500); } });
  },
};
