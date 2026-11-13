// b. Display Advertising and g. CRM — Hodan's scenes. All wording comes from content.js (HODAN):
//   da-reach    why display: reach people before they search; her two objectives and the
//               Display campaign she chose in Google Ads
//   da-formats  her placement mock-up; → steps through the three sizes and their moments
//   da-buying   pay to be seen: viewable CPM, network buy, dayparting; the models not used
//   da-target   new people first, then a reminder; her Google Ads targeting and measures
//   crm         the CRM built in Airtable: the form, the contacts, the sign-up people see
import { HODAN } from './content.js';
import { sound } from './sound.js';

const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, BUILD[el.dataset.scene](el, ctx)); return insts.get(el); }

const eyebrow = (no, sec, t) => `<div class="grain"></div><p class="eyebrow hd-eyebrow">Part 1 · <span class="lc">${no}</span> ${sec}${t ? ' · ' + t : ''}</p>`;
const head = l => `<h2 class="display hd-head">${l[0]}<em>${l[1]}</em></h2>`;
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
const print = (s, cls, extra = '') => `<figure class="hd-print ${cls}"><img src="${s.src}" alt="${s.alt}">${s.caption ? `<figcaption>${s.caption}</figcaption>` : ''}${extra}</figure>`;

const BUILD = {
  // ---------- why display ----------
  'da-reach'(el) {
    const R = HODAN.reach;
    el.innerHTML = eyebrow('b.', 'Display Advertising') + head(R.lead) + `
      <p class="hd-why">${R.why}</p>
      <div class="hd-obj">
        <div class="o" style="--i:0"><span class="no">01</span><div class="viz rings"><i></i><i></i><i></i><img src="assets/cut/piece.png" alt=""></div><b>${R.objectives[0][0]}</b><p>${R.objectives[0][1]}</p></div>
        <div class="o" style="--i:1"><span class="no">02</span><div class="viz page"><img src="blog/img/hero-wide.jpg" alt="The campaign blog page"></div><b>${R.objectives[1][0]}</b><p>${R.objectives[1][1]}</p></div>
      </div>
      ${print(R.shot, 'camp', `<span class="hd-note hand n-camp">Display, not the recommended Search</span>`)}
      <p class="hd-campname">${R.campaign}</p>`;
    return life(el, { onIn() { setTimeout(() => sound.pen(3), 1700); } });
  },

  // ---------- three sizes, three moments ----------
  'da-formats'(el) {
    const F = HODAN.formats;
    // regions of the three banners in her mock-up, in the image's pixels (3240 × 1714)
    const R = [[211, 752, 1458, 181], [1866, 732, 502, 418], [2524, 1377, 541, 84]];
    el.innerHTML = eyebrow('b.', 'Display Advertising', F.title) + head(F.lead) + `
      <div class="hd-mock"><div class="fr"><div class="in">
        <img src="${F.shot.src}" alt="${F.shot.alt}">
        <svg viewBox="0 0 3240 1714"><defs><mask id="hd-spot"><rect width="3240" height="1714" fill="#fff"/><rect class="hole" rx="22" fill="#000"/></mask></defs>
          <rect class="dim" width="3240" height="1714" mask="url(#hd-spot)"/><rect class="ring" rx="22"/></svg>
      </div></div></div>
      <ol class="hd-sizes">${F.sizes.map((s, i) => `<li data-i="${i + 1}"><span class="sz">${s.size}</span><b>${s.name}</b><small>${s.where}</small><em>Moment: ${s.moment.toLowerCase()}</em></li>`).join('')}</ol>
      <p class="hd-same">${F.same}</p>
      <p class="hd-src">${F.why} ${F.source}</p>`;
    const inner = el.querySelector('.hd-mock .in'), hole = el.querySelector('.hole'), ring = el.querySelector('.ring');
    // geometry set as CSS properties so the spotlight glides from one banner to the next
    const place = (r) => [hole, ring].forEach(n => Object.assign(n.style, { x: `${r[0] - 18}px`, y: `${r[1] - 18}px`, width: `${r[2] + 36}px`, height: `${r[3] + 36}px` }));
    const focus = s => {
      el.querySelectorAll('.hd-sizes li').forEach(li => li.classList.toggle('on', +li.dataset.i === s));
      el.classList.toggle('spot', s > 0);
      if (s > 0) {
        const r = R[s - 1]; place(r);
        inner.style.transformOrigin = `${(r[0] + r[2] / 2) / 32.4}% ${(r[1] + r[3] / 2) / 17.14}%`;
        inner.style.transform = `scale(${s === 2 ? 1.25 : 1.4})`;
        sound.tick();
      } else inner.style.transform = '';
    };
    // clicking a size in the list jumps to it as well
    el.querySelectorAll('.hd-sizes li').forEach(li => li.addEventListener('click', () => focus(+li.dataset.i)));
    return life(el, { steps: 3, onStep: focus });
  },

  // ---------- buying ----------
  'da-buying'(el) {
    const B = HODAN.buying;
    const icons = [
      '<svg viewBox="0 0 48 48"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z"/><circle cx="24" cy="24" r="6"/></svg>',
      '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="5"/><circle cx="8" cy="10" r="4"/><circle cx="40" cy="10" r="4"/><circle cx="8" cy="38" r="4"/><circle cx="40" cy="38" r="4"/><path d="M12 13l8 7M36 13l-8 7M12 35l8-7M36 35l-8-7"/></svg>',
      '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"/><path d="M24 13v11l8 5"/></svg>',
    ];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    el.innerHTML = eyebrow('b.', 'Display Advertising', B.title) + head(B.lead) + `
      <div class="hd-buy">${B.list.map(([k, v], i) => `
        <div class="row" style="--i:${i}">${icons[i]}<div><b>${k}</b><p>${v}</p>
          ${i === 2 ? `<div class="week">${days.map((d, j) => `<span class="${j > 4 ? 'all' : ''}"><i class="day"></i><i class="eve"></i><small>${d}</small></span>`).join('')}</div>` : ''}</div></div>`).join('')}
      </div>
      <div class="hd-not"><p class="lbl">Not used</p><div class="chips">${B.notUsed.map((m, i) => `<span style="--i:${i}">${m}<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path pathLength="1" d="M2 12 C 30 6, 70 15, 98 8"/></svg></span>`).join('')}</div><p>${B.notUsedWhy}</p></div>
      ${print(B.shot, 'vcpm')}`;
    return life(el, { onIn() { setTimeout(() => sound.pen(2), 1900); } });
  },

  // ---------- targeting ----------
  'da-target'(el) {
    const T = HODAN.targeting;
    el.innerHTML = eyebrow('b.', 'Display Advertising', T.title) + head(T.lead) + `
      <div class="hd-steps">${T.steps.map(([k, v], i) => `<div class="st${i === 3 ? ' again' : ''}" style="--i:${i}"><b>${k}</b><p>${v}</p></div>`).join('<i class="arr"></i>')}</div>
      ${print(T.shot, 'tgt')}
      <div class="hd-out"><p class="lbl">Left out on purpose</p><div class="chips"><span>Gift<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path pathLength="1" d="M2 12 C 30 6, 70 15, 98 8"/></svg></span><span>Holiday<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path pathLength="1" d="M2 12 C 30 6, 70 15, 98 8"/></svg></span></div><p>${T.leftOut}</p></div>
      <div class="hd-meas"><p class="lbl">Measured with</p>${T.measured.map(([g, list]) => `<div class="g"><span>${g}</span><p>${list.join(' · ')}</p></div>`).join('')}</div>`;
    return life(el, { onIn() { setTimeout(() => sound.pen(2), 2200); } });
  },

  // ---------- CRM ----------
  'crm'(el) {
    const C = HODAN.crm;
    el.innerHTML = `<div class="grain"></div><p class="eyebrow hd-eyebrow">Part 1 · <span class="lc">g.</span> ${C.title}</p>` + head(C.lead) + `
      <div class="hd-crm">${C.parts.map((p, i) => `
        <figure class="part p${i}" style="--i:${i}"><p class="tag">${p.tag}</p><div class="shot"><img src="${p.src}" alt="${p.alt}"></div>
          <figcaption>${p.lines.map(l => `<p>${l}</p>`).join('')}</figcaption></figure>`).join('')}
      </div>
      <p class="hd-base">${C.base}</p>`;
    return life(el, { onIn() { [0, 1, 2].forEach(i => setTimeout(() => sound.land(.3), 500 + i * 300)); } });
  },
};
