// c. Social Media Marketing — Lina's two slides, kept as she designed them (her layout,
// headings, images and wording from content.js LINA), with motion added. Her approved
// Instagram scene (`social`) sits between them.
//   sm-audit  “From an absent brand to one role per platform”: the audit and her four
//             original platform mock-ups
//   sm-wave   “Each wave turns viewers into sharers”: her rollout figure, all year,
//             integration, engagement and her four proposed KPIs
import { LINA } from './content.js';
import { sound } from './sound.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.scene](el, ctx)); return insts.get(el); }

const life = (el, { onIn, onOut } = {}) => ({
  enter() { el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); onIn?.(); },
  leave() { el.classList.remove('is-in'); onOut?.(); },
});
// her slide header: gold bar, spaced label, brand, title and gold rule
const header = (label, title) => `
  <i class="lv-bar"></i><p class="lv-label">${label}</p><p class="lv-brand">FERRERO ROCHER</p>
  <h2 class="lv-title">${title}</h2><i class="lv-rule"></i>`;
const bold = (t, n) => t.replace(new RegExp(`^(${n})`), '<b>$1</b>');

const BUILD = {
  'sm-audit'(el) {
    const A = LINA.audit, P = LINA.platforms.list;
    const pos = { TikTok: 'tt', Facebook: 'fb', YouTube: 'yt', Instagram: 'ig' };
    el.innerHTML = `<div class="grain"></div><div class="lv">${header('Social media marketing', A.title)}
      <p class="lv-h audit">${A.label}</p>
      <figure class="lv-audit"><img src="${A.shot.src}" alt="${A.shot.alt}"></figure>
      <p class="lv-cap audit">*${A.shot.caption}</p>
      <div class="lv-finds">${A.findings.map((f, i) => `<p style="--i:${i}"><span>${[/^No Malaysian/, /^Facebook/, /^Positioning:/].reduce((t, r) => t.replace(r, m => `<b>${m}</b>`), f)}</span></p>`).join('')}</div>
      <i class="lv-vline"></i>
      <p class="lv-h plat">${LINA.platforms.label}</p>
      ${P.map((p, i) => `<figure class="lv-mock ${pos[p.name]}" style="--i:${i}"><div class="img"><img src="${p.src}" alt="${p.alt}"></div>
        <figcaption><b>${p.name}:</b> ${p.role}</figcaption></figure>`).join('')}
    </div>`;
    let t = [];
    return life(el, {
      onIn() { t = [[700, () => sound.page()], [1500, () => sound.land(.25)], [1650, () => sound.land(.25)], [1800, () => sound.land(.25)], [2300, () => sound.whoosh(.4, .25)]].map(([ms, f]) => setTimeout(f, ms)); },
      onOut() { t.forEach(clearTimeout); },
    });
  },

  'sm-wave'(el) {
    const R = LINA.rollout;
    el.innerHTML = `<div class="grain"></div><div class="lv">${header(R.title, R.lead.join(''))}
      <figure class="lv-roll"><img src="assets/lina/rollout.png" alt="Social media rollout for one campaign wave: tease in week 1, launch in weeks 2 to 4, sustain in weeks 5 to 8"><i class="shine"></i></figure>
      <p class="lv-cap roll">*${R.figure}</p>
      <p class="lv-box year"><span><b>${R.allYear[0]}:</b> ${R.allYear[1]}</span></p>
      <p class="lv-box int"><span><b>${R.integration[0]}: ${R.integration[1]}</b></span></p>
      <p class="lv-h eng">${R.engagement.label}</p>
      <div class="lv-eng"><b>${R.engagement.head}</b><p>${R.engagement.text} ${R.engagement.cite}</p></div>
      <p class="lv-h kpi">Measurement of success</p>
      <div class="lv-kpis">${R.kpis.map((k, i) => `<div style="--i:${i}"><b>0${i + 1}</b><span><strong>${k.split(' ')[0]}</strong>${k.includes(' ') ? '<br>' + k.split(' ').slice(1).join(' ') : ''}</span></div>`).join('')}</div>
      <p class="lv-cap kpi">*${R.kpiNote} ${R.kpiCite}</p>
    </div>`;
    let t = [];
    return life(el, {
      onIn() { t = [[600, () => sound.page()], ...[0, 1, 2, 3].map(i => [1900 + i * 180, () => sound.tick()])].map(([ms, f]) => setTimeout(f, ms)); },
      onOut() { t.forEach(clearTimeout); },
    });
  },
};
