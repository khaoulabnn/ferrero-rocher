// Interaction lab router: scales the 1920x1080 stage, runs one scene at a time,
// lets a scene consume "next"/"prev" for its own builds, and plays a scene-pair
// transition (transitions.js) whenever the presenter moves forward.
import { SECTIONS, byId } from './content.js';
import { TRANSITIONS, depthDissolve, handoff } from './transitions.js';
import { sound } from './sound.js';

const stage = document.getElementById('stage');
const scenes = [...document.querySelectorAll('.scene')];
const dots = document.getElementById('dots');
// the online copy (any address other than this computer) hides the working tools: the lab badge,
// slide counter, key hints and review notes; a short hint shows newcomers how to move on
const SHARED = location.protocol !== 'file:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
document.body.classList.toggle('shared', SHARED);
let shareHint = null;
if (SHARED) {
  shareHint = document.createElement('p');
  shareHint.className = 'share-hint';
  shareHint.innerHTML = '<b>→</b> next · <b>←</b> back · <b>F</b> full screen · <b>M</b> sound';
  document.body.append(shareHint);
  setTimeout(() => shareHint.classList.add('gone'), 12000);
}
const note = document.getElementById('note');
const count = document.getElementById('count');

const NOTES = {
  title: ['Title', 'Khaoula opens', 'ok', 'Real assets only',
    'The cursor-following box is kept, now cut out of your product clip so it floats on the page with a contact shadow that tracks it. A light sweep crosses the foil as it turns. Gold flakes move in two depths, some passing in front of the box. The title is split around the box for depth.'],
  summary: ['Executive summary · Campaign overview', 'Khaoula', 'ok', 'Khaoula’s deck, slide 2', 'The campaign name and tagline, then the four facts (market, primary objective, core message, target audience) as cards, each with a still from the campaign film.'],
  challenge: ['Opening · The brand challenge', 'Khaoula', 'ok', 'Khaoula’s deck, slide 1',
    'The perception, the problem and the opportunity, word for word from Khaoula’s deck. The visit from the film plays as a living cut-out on the opportunity side. The flakes from the title gather into the gold ring around “only for special occasions”. Press → to see the chocolate stream: the piece at the right melts into one glossy ribbon that coils into a ring and opens onto the campaign overview.'],
  perf: ['Part 1 · a. Content Marketing · Performance Evaluation', 'Khaoula · a', 'ok', 'Report: Performance Evaluation',
    'The five goals and KPIs from the report, rising like steps, with the core objective (perception survey) in gold. → leaves through the chocolate stream into Lina’s section.'],
  uxt: ['Part 2 · e. Touchpoints', 'Khaoula · e', 'ok', 'Khaoula’s deck, slide 4',
    'UX and UI defined as in the deck, then the four built touchpoints with the real banner, short video, blog and newsletter, their stages and their actual buttons. Every card is marked BUILT; the legend explains BUILT and PROPOSED.'],
  uxp: ['Part 2 · e. Campaign page, journey and personalisation', 'Khaoula · e', 'ok', 'Khaoula’s deck, slides 5 and 6', 'The live campaign page beside the four journey steps (Find, Land, Share, Any screen), then the four personalisation ideas, marked PROPOSED. → narrows the page to a 320 px phone.'],
  uxs: ['Part 2 · e. Personalisation', 'Khaoula · e', 'ok', 'Khaoula’s deck, slide 6',
    'All four ideas are marked PROPOSED, as in the deck, with dashed outlines so they never read as built. Click Friend, Colleague or Family: friends and family are the campaign’s own characters; there is no colleague scene in the film, so that choice shows the piece only. Privacy line and Tam & Ho (2006) citation as in the deck.'],
  uxo: ['Part 2 · e. Supporting the objective', 'Khaoula · e', 'ok', 'Khaoula’s deck, slide 7',
    'Brand awareness and everyday sharing, each item marked BUILT or PROPOSED exactly as in the deck, then the proposed testing plan and the Part 1 KPIs.'],
  close: ['Closing · Thank you', 'Khaoula', 'ok', 'Storyboard line · campaign tagline',
    'The unsent message from the opening of the film is typed and finally sent, then “Thank you” and the tagline. The chocolate stream from the previous scene ends here and the piece settles at the side.'],
  part1: ['Content', 'Transition', 'ok', 'Presented sections only',
    'A sheet of gold foil slides over the previous scene with the Content pressed into it: every section this presentation covers, in the order presented, under Part 1 and Part 2. Move the cursor: the light follows it across the foil. Press → and the foil peels away from the corner.'],
  calendar: ['a. Content Marketing · Campaign Overview', 'Khaoula · a', 'ok', 'Report: Campaign Overview · storyboard beats',
    'Plays by itself (about 20 seconds) while you talk: four real pieces land on ordinary days, each opening a live moment from your film; every day is then claimed and the concept and audience arrive. → skips to the next beat; once it has finished, → moves on.'],
  formats: ['a. Content Marketing · Content Strategy and Creation', 'Khaoula · a', 'ok', 'Report: Content Strategy and Creation',
    'The pieces from the calendar fly in and land as the six formats, in the report’s order with their journey stages. Hover lifts a piece; click opens its card with the report’s own description and the real asset (the short video plays in its card).'],
  film: ['a. Content Marketing · Main campaign video', 'Khaoula · a', 'ok', 'Campaign Video.MP4 · storyboard',
    'The storyboard panels assemble, then about five seconds later the camera pushes into panel 1 and the full 62-second film plays full-bleed in 16:9 with sound (→ or the play button starts it at once). Controls appear when the mouse moves: play/pause, scrub, sound, full screen. Space pauses. During playback → needs a second press, so the film cannot be skipped by accident.'],
  book: ['a. Content Marketing · Storybook', 'Khaoula · a', 'ok', 'Storybook The Golden Moment.pdf',
    'The film’s last frame folds into the book’s cover. Click the right page or press → to turn.'],
  web: ['a. Content Marketing · Blog and newsletter', 'Khaoula · a', 'ok', 'Drive · blog/ and newsletter/',
    'The real blog and newsletter running live. Note: in the final build Karen’s d. Website Optimisation reuses this window in an x-ray mode instead of repeating the tour.'],
  social: ['c. Social Media Marketing', 'Lina · c', 'wait', 'Strategy and captions from Lina',
    'Reels now open on the 9:16 reel slot (assets/social/reel-main.mp4) shown uncropped, with tap-to-pause, a scrubbable progress bar, sound and double-tap like. The file there is a stand-in from your content package until you send the final reel. The right column shows the section’s required components as designed headings; Lina’s text appears under them once written.'],
  'wo-audit': ['Part 1 · d. Website Optimisation · Website optimisation audit', 'Karen · d', 'ok', 'Karen’s slide 1 and notes',
    'Desktop 91 and mobile 68 as score rings in a laptop and a phone (with 45/100 in Backlinko), beside Karen’s four findings: the 4.1 s load against Google’s 2.5 s threshold drawn as a bar, and 3 of 8 homepage categories marked festive. Deloitte (2020) from her notes underneath. → brings her PageSpeed and Lighthouse screenshots forward, ringed.'],
  'seo-search': ['Part 1 · e. SEO · Keyword research', 'Karen · e', 'ok', 'Karen’s slide 2 and notes',
    'Keyword difficulty (31% brand, 13% bouquet) with her notes, and her keyword table with each search range drawn on a log scale from 100 to 100K. → picks out the three main searches in Malaysia: price, bouquets and small gift ideas (+900% YoY).'],
  'seo-links': ['Part 1 · e. SEO · On-page and off-page', 'Karen · e', 'ok', 'Karen’s slide 2 and notes',
    'The three on-page gaps, domain authority 50 and 177 linking domains with her Moz screenshot ringed. → the next lever from her notes (food bloggers, florists, #ShareALittleLove PR), then on into f. Paid Search through the same chocolate melt as before.'],
  'ps-role': ['Part 1 · f. Paid Search · Search today', 'Hansan · f', 'ok', 'Hansan’s updated slide 1 (5 Nov)',
    '“ferrero rocher” types itself and his three findings unfold: unclaimed brand name, occasion-only demand, growing everyday need (marked as also in e. SEO). → his Bing screenshot, ringed (“a florist, not Ferrero”); → his Google Trends year, Oct 2025 – Oct 2026. Entered through Hansan’s chocolate melt.'],
  'ps-keys': ['Part 1 · f. Paid Search · Google Ads keywords', 'Hansan · f', 'ok', 'Hansan’s updated slide 2',
    'Branded keywords (Simonov et al., 2018) and everyday-gifting keywords (Tunuguntla et al., 2023), the three negative keywords struck through. Beside them, his audience line with the campaign’s real characters: broad, multicultural, remarketing to campaign-video viewers, ads all year.'],
  'ps-ads': ['Part 1 · f. Paid Search · Google Ads examples', 'Hansan · f', 'ok', 'Hansan’s updated slide 2',
    'His two proposed ads in a results page, with live character counts against the 30 and 90 limits (Google, n.d.-a). Sitelinks as on his new slide: Watch the Film, Read the Story, Find a Store.'],
  'ps-bid': ['Part 1 · f. Paid Search · Bidding strategy', 'Hansan · f', 'ok', 'Hansan’s updated slide 3',
    'Brand keywords on Target Impression Share (Google, n.d.-b; Simonov et al., 2018); gifting keywords on Maximize Clicks with a cost cap while testing, then Conversions (video plays and “Find a Store” clicks), top spot not required (Ghose & Yang, 2009). Budget steady all year. → melts into the measurement.'],
  'ps-measure': ['Part 1 · f. Paid Search · Measurement of success', 'Hansan · f', 'ok', 'Hansan’s updated slide 3',
    'A controlled test, not clicks alone: pause ads in selected Malaysian regions and compare (Blake et al., 2015). Three proposed KPIs as medallions: brand impression share, CTR, campaign page visits.'],
  'sm-audit': ['Part 1 · c. Social Media Marketing · Lina’s slide 1', 'Lina · c', 'ok', 'Lina’s slide 1, as she designed it',
    'Her slide as she made it (audit of 28 Oct 2026, Figure 1.3.6, three findings, four original platform mock-ups), with motion: the header draws in, the audit wipes across, the findings slide in, the mock-ups rise one by one. Hover a mock-up to lift it.'],
  'sm-wave': ['Part 1 · c. Social Media Marketing · Lina’s slide 2', 'Lina · c', 'ok', 'Lina’s slide 2, as she designed it',
    'Her slide as she made it (Figure 1.3.5, all year, integration, engagement, four proposed KPIs), with motion: the rollout figure wipes in with a sheen, the boxes slide in, the four KPI boxes drop into place.'],
  'da-reach': ['Part 1 · b. Display Advertising · Why display', 'Hodan · b', 'ok', 'Hodan’s slide 1 and notes',
    'Reach people before they search: her two objectives (reach and awareness; visits to the story, with the real blog page) and her Google Ads screen with Display chosen over the recommended Search.'],
  'da-formats': ['Part 1 · b. Display Advertising · Formats', 'Hodan · b', 'ok', 'Hodan’s slide 2 and notes',
    'Her placement mock-up. → three times: the spotlight moves to the leaderboard (affection), the medium rectangle (happiness) and the mobile banner (reconciliation); click a size to jump to it.'],
  'da-buying': ['Part 1 · b. Display Advertising · Buying', 'Hodan · b', 'ok', 'Hodan’s slide 3',
    'Viewable CPM, network buy and programmatic dayparting (evenings and weekends shown on a week strip), CPC, CPL and CPA struck through, and her Google Ads bidding screen.'],
  'da-target': ['Part 1 · b. Display Advertising · Targeting', 'Hodan · b', 'ok', 'Hodan’s slide 4 and notes',
    'Geo and language, contextual, behavioural, then retargeting; her targeting screens; gift and holiday segments struck through with her reason; what each objective is measured with.'],
  crm: ['Part 1 · g. CRM · Airtable', 'Hodan · g', 'ok', 'Hodan’s slide 5 and notes',
    'The form, the contacts grouped by moment and language, and the sign-up people see. The piece at the side melts into the chocolate stream that opens the final UX and Personalisation section.'],
  p21: ['Part 2 · a. Introduction to Digital Marketing', 'Hansan · 2a', 'wait', 'Text from Hansan',
    'The same real box, printed on one side and on screen on the other. The divider glides to the middle on entry; drag it, or press → to complete the shift. The three required components are the content areas: the paradigm shift above, traditional and digital practices below.'],
  p22: ['Part 2 · b. Aligning Digital Marketing with Business Strategy', 'Hodan · 2b', 'wait', 'Text from Hodan',
    'Five gold wires connect the brand (the real box) to the five required components. The cards drift slightly with the cursor. Hodan’s text appears inside each card once added.'],
  p23: ['Part 2 · c. Challenges and Research in the Digital Landscape', 'Karen · 2c', 'wait', 'Text from Karen',
    'A parallax landscape: a character from the film rises with her phone at the start of the route, and a real piece travels it, reaching each of the four required components in turn. Move the cursor to feel the depth.'],
  p24: ['Part 2 · d. Effective Digital Strategy', 'Lina · 2d', 'wait', 'Text and figures from Lina',
    'A tray with three wells; a real piece settles into each required component. If Lina supplies allocation figures, they can be drawn inside the resource well.'],
  ux: ['Part 2 · e. Five layers, five planes', 'Khaoula · 2e', 'ok', 'Khaoula’s 2e draft · Garrett (2011) · ISO (2019)',
    'Press → five times: each press reveals one Garrett plane, magnifies the matching layer of the real chocolate in the loupe and explains the link. The sixth press shows UI versus UX from Table 4 with the two spans bracketed. The chocolate-to-plane wording is presentation framing for Khaoula to confirm.'],
  pers: ['Part 2 · e. Personalisation', 'Khaoula · 2e', 'ok', 'Khaoula’s 2e draft · Table 5',
    'The seven practices of Table 5 rise as a ladder from customisation (the shaded starting point) to AI-assisted suggestions. The relationship segments people choose cycle on the left with the campaign’s own characters (click a chip to pick one). → brings in the privacy and testing safeguards.'],
};

const SHOW_HANDOFF = false;
let current = -1, active = null, busy = false, lastPresenter = '';
const mods = new Map();

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.setProperty('--s', s);
  ctx.scale = s;
  for (const m of mods.values()) m?.resize?.(s);
}

const ctx = {
  scale: 1,
  stage,
  toStage(e) {
    const r = stage.getBoundingClientRect();
    return { x: (e.clientX - r.left) / ctx.scale, y: (e.clientY - r.top) / ctx.scale };
  },
  // element rectangle in stage coordinates
  rect(el) {
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    return { x: (r.left - s.left) / ctx.scale, y: (r.top - s.top) / ctx.scale, w: r.width / ctx.scale, h: r.height / ctx.scale };
  },
  next: () => next(),
};

scenes.forEach((s, i) => {
  const b = document.createElement('button');
  b.title = s.dataset.scene;
  b.onclick = () => go(i);
  dots.append(b);
});

// ----- the Ferrero Rocher piece resting at the side of Khaoula's scenes -----
const sidePiece = stage.querySelector('.side-piece');
function placePiece(scene) {
  const p = scene.dataset.piece;
  sidePiece.classList.toggle('on', !!p);
  if (p) { const [x, y] = p.split(',').map(Number); sidePiece.style.left = `${x - 56}px`; sidePiece.style.top = `${y - 50}px`; }
}

// ----- structure route along the bottom -----
const routeItems = stage.querySelector('.route-items');
// only the sections this presentation covers, in the order they are presented
const shownIds = [...new Set(scenes.map(s => s.dataset.section))];
const shown = SECTIONS.filter(s => shownIds.includes(s.id)).sort((a, b) => shownIds.indexOf(a.id) - shownIds.indexOf(b.id));
routeItems.innerHTML = shown.map((s, i) => (s.part && s.part !== shown[i - 1]?.part ? `<em class="rpart">Part ${s.part}</em>` : '') + `<span data-id="${s.id}" class="p${s.part}"><b>${s.no || 'Exec'}</b><i>${s.title.replace(' (SEO)', '').replace(' (CRM)', '')}</i></span>`).join('');
const routePiece = stage.querySelector('.route-piece');
function setRoute(id, hidden) {
  stage.querySelector('.route').classList.toggle('hide', hidden);
  routeItems.querySelectorAll('span').forEach(s => s.classList.toggle('on', s.dataset.id === id));
  const on = routeItems.querySelector(`[data-id="${id}"]`);
  if (on) routePiece.style.transform = `translateX(${on.offsetLeft + on.offsetWidth / 2 - 14}px)`;
}

async function load(el) {
  if (mods.has(el)) return mods.get(el);
  const mod = await import(new URL(el.dataset.module, import.meta.url));
  const m = mod.create ? mod.create(el, ctx) : null;
  mods.set(el, m);
  m?.resize?.(ctx.scale);
  return m;
}

async function go(i, { instant = false } = {}) {
  if (busy || i === current || i < 0 || i >= scenes.length) return;
  busy = true;
  const A = scenes[current], B = scenes[i];
  const forward = i > current;
  try {
    const mb = await load(B);
    const ma = A ? mods.get(A) : null;
    B.classList.add('is-active');
    mb?.enter?.({ from: A?.dataset.scene, forward });
    const key = `${A?.dataset.scene}>${B.dataset.scene}`;
    setRoute(B.dataset.section, ['title', 'part1', 'part2', 'summary', 'close'].includes(B.dataset.scene));
    if (!(A && forward && TRANSITIONS[`${A.dataset.scene}>${B.dataset.scene}`]?.name === 'streamMelt')) placePiece(B);
    stage.dataset.on = B.dataset.scene;
    if (A && !instant) {
      const t = forward && TRANSITIONS[key] ? TRANSITIONS[key] : depthDissolve;
      // no on-screen names: every scene already carries its section title, so the speaker-change caption is off
      if (SHOW_HANDOFF && forward && B.dataset.presenter !== lastPresenter && !B.classList.contains('scene--clear')) setTimeout(() => handoff(stage, byId(B.dataset.section), B.dataset.presenter), t.noteDelay || 0);
      await t({ A, B, ma, mb, ctx, stage });
    }
    if (A) { A.classList.remove('is-active'); A.style.zIndex = ''; try { ma?.leave?.(); } catch (e) { console.error(e); } }
    B.style.zIndex = '';
  } catch (e) { console.error(e); }
  current = i;
  placePiece(B);
  if (!B.classList.contains('scene--clear')) lastPresenter = B.dataset.presenter;
  active = mods.get(B);
  [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
  count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}`;
  renderNote(B.dataset.scene);
  history.replaceState(null, '', '#' + B.dataset.scene);
  busy = false;
}

function renderNote(id) {
  const [t, who, st, stText, p] = NOTES[id];
  note.innerHTML = `<h4>${t}</h4><div><b>${who}</b></div><p>${p}</p><div class="row"><span class="chip ${st}">${stText}</span></div>`;
}

function next() { shareHint?.classList.add('gone'); if (busy) return; if (!(active?.next?.())) go(current + 1); }
function prev() { if (busy) return; if (!(active?.prev?.())) go(current - 1); }

addEventListener('keydown', e => {
  if (e.target.closest?.('input,textarea,select')) return;
  if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !active?.ownsSpace)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (!SHARED && (e.key === 'i' || e.key === 'I')) note.classList.toggle('hide');
  else if (e.key === 'm' || e.key === 'M') sound.toggle();
  else if (!SHARED && (e.key === 'e' || e.key === 'E')) stage.classList.toggle('edit');
  else if (e.key === 'f' || e.key === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  else active?.key?.(e);
});
document.getElementById('toggleNote').onclick = () => note.classList.toggle('hide');
addEventListener('resize', fit);
addEventListener('hashchange', () => { const i = scenes.findIndex(s => '#' + s.dataset.scene === location.hash); if (i >= 0 && i !== current) go(i, { instant: true }); });
addEventListener('message', e => { if (e.data === 'lab:next') next(); if (e.data === 'lab:prev') prev(); });

// sound toggle, always reachable; the presentation works the same with sound off
const muteBtn = stage.querySelector('.mute');
const paintMute = m => { muteBtn.classList.toggle('off', m); muteBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/>${m ? '<path d="m17 9 5 6M22 9l-5 6"/>' : '<path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>'}</svg><span>${m ? 'Sound off' : 'Sound on'}</span>`; };
muteBtn.onclick = () => sound.toggle();
sound.onChange(paintMute); paintMute(sound.muted);

fit();
note.classList.add('hide');
const start = Math.max(0, scenes.findIndex(s => '#' + s.dataset.scene === location.hash));
go(start, { instant: true });
