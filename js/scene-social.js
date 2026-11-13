// 1.3 Social Media Marketing — a navigable Instagram-style prototype on a
// realistic phone. Reels open on the campaign's 9:16 reel (replaceable file,
// shown uncropped) with tap-to-pause, scrubbing, sound and double-tap like.
// Everything in CONTENT comes from existing campaign material; Lina's sample
// posts, captions and handle replace it.
import { byId } from './content.js';
import { sound } from './sound.js';

const V = n => ({ type: 'video', src: `assets/clips/${n}.mp4`, poster: `assets/posters/${n}.jpg` });
const P = (n, half) => ({ type: 'page', src: `assets/storybook/p${String(n).padStart(2, '0')}.jpg`, half });

const CONTENT = {
  name: 'Ferrero Rocher Malaysia',
  handle: 'ferrerorocher_my',                                   // EDIT (Lina): account handle
  bio: ['You don’t need an occasion.', 'Share a little love.'],
  link: 'Watch the story',
  // the lead reel: the group's social media video (received 7 Nov, 16:9, shown whole over a soft blur);
  // the earlier 9:16 reel follows it as the first post below
  reel: { type: 'video', src: 'assets/social/social-media-video.mp4', poster: 'assets/social/social-media-video.jpg', cap: 'You don’t need an occasion. Share a little love.' },
  highlights: [
    { title: 'Unsent', cover: V('Woman_hesitating_to_send_message'), slides: [
      { m: V('Woman_hesitating_to_send_message'), text: 'I just wanted to say thank you…', hand: true },
      { m: V('Woman_knocking_on_door'), text: 'The visit' },
      { m: V('Ferrero_Rocher_chocolate_commerc'), text: 'You don’t need an occasion.\nShare a little love.' },
    ] },
    { title: 'Golden Moment', cover: P(1, 'R'), slides: [{ m: P(1, 'R') }, { m: P(2, 'L') }, { m: P(2, 'R') }, { m: P(12, 'L') }, { m: P(12, 'R') }] },
    { title: 'Moments', cover: V('Men_sharing_chocolate_in_caf'), slides: [
      { m: V('Men_sharing_chocolate_in_caf'), text: 'The friend who notices' },
      { m: V('Mother_giving_chocolate_to_son'), text: 'A surprise from Mom' },
      { m: V('Women_sharing_chocolate_in_home'), text: 'The visit' },
    ] },
  ],
  posts: [
    { m: { type: 'video', src: 'assets/social/reel-main.mp4', poster: 'assets/social/reel-main.jpg', vertical: true }, cap: 'You don’t need an occasion. Share a little love.' },
    { m: V('short'), cap: 'You don’t need an occasion. Share a little love.' },
    { m: V('Ferrero_Rocher_campaign_montage'), cap: 'Share a little love.' },
    { m: P(12, 'L'), cap: 'An ordinary Tuesday becomes a cherished golden memory.' },
    { m: V('Woman_hesitating_to_send_message'), cap: 'The unsent message' },
    { m: V('Women_sharing_chocolate_in_home'), cap: 'The visit' },
    { m: V('Men_sharing_chocolate_in_caf'), cap: 'The friend who notices' },
    { m: P(1, 'R'), cap: 'The Golden Moment' },
    { m: V('Woman_knocking_on_door'), cap: 'A small thank you' },
    { m: V('Mother_giving_chocolate_to_son'), cap: 'A surprise from Mom' },
    { m: V('Boy_smiling_at_mother'), cap: 'Open the box' },
    { m: V('Ferrero_Rocher_chocolate_commerc_2'), cap: 'The chocolate, inside out' },
    { m: V('Ferrero_Rocher_product_clip_crea'), cap: 'Share a little love' },
  ],
};

const I = {
  home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  add: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
  reels: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8h18M8 3l3 5M14 3l3 5"/><path d="m10 11.5 4.5 2.6-4.5 2.6z" fill="currentColor"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-8.6C1.2 8 3.2 4.5 6.6 4.5c2 0 3.4 1.2 4.4 2.6 1-1.4 2.4-2.6 4.4-2.6 3.4 0 5.4 3.5 3.8 6.9C19 15.6 12 20 12 20z"/>',
  comment: '<path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2A8.5 8.5 0 1 1 20.5 11.5z"/>',
  send: '<path d="M21 3 3 10.5l7 2.5 2.5 7z"/><path d="m10 13 4.5-4.5"/>',
  save: '<path d="M6 3h12v18l-6-4.5L6 21z"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  back: '<path d="M15 4 7 12l8 8"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>',
  sound: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  mute: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/>',
};
const icon = (k, cls = '') => `<svg class="ig-i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
function media(m, { play = false, cls = '' } = {}) {
  if (m.type === 'video') return `<video class="ig-m ${cls}" src="${m.src}" poster="${m.poster}" muted playsinline loop preload="${play ? 'auto' : 'none'}" ${play ? 'autoplay' : ''}></video>`;
  return `<div class="ig-m ig-page ${cls}" style="background-image:url(${m.src});background-position:${m.half === 'L' ? '0%' : '100%'} 50%"></div>`;
}
const thumb = m => m.type === 'video' ? `<div class="ig-m" style="background-image:url(${m.poster})"></div>` : media(m);
const avatar = (size = 34, ring = false) => `<span class="ig-av ${ring ? 'ring' : ''}" style="--z:${size}px"><img src="assets/cut/piece.png" alt=""></span>`;

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  const screen = el.querySelector('.s-screen');
  let view = 'profile', story = null, timer = 0;
  const reels = [{ ...CONTENT.reel, i: -1 }, ...CONTENT.posts.map((p, i) => ({ ...p.m, cap: p.cap, i })).filter(p => p.type === 'video')];

  // the section's required components, as designed headings for Lina's text
  const sec = byId('1.3');
  el.querySelector('.s-right').innerHTML = `<p class="s-kicker">In this section</p>` +
    Object.entries(sec.components).map(([k, v], i) => `<div class="s-comp"><span>0${i + 1}</span><b>${k}</b>${v ? `<p>${v}</p>` : ''}</div>`).join('');

  screen.innerHTML = `
    <div class="ig-status"><span>9:41</span><span class="ig-bat"></span></div>
    <div class="ig-views">
      <section class="ig-view" data-v="profile">${profileHTML()}</section>
      <section class="ig-view" data-v="home">${homeHTML()}</section>
      <section class="ig-view ig-reels" data-v="reels">${reels.map(reelHTML).join('')}</section>
    </div>
    <nav class="ig-tabs">
      <button data-tab="home">${icon('home')}</button><button data-tab="search" disabled>${icon('search')}</button>
      <button data-tab="add" disabled>${icon('add')}</button><button data-tab="reels">${icon('reels')}</button>
      <button data-tab="profile">${avatar(26)}</button>
    </nav>
    <div class="ig-post" hidden></div>
    <div class="ig-story" hidden></div>`;

  function profileHTML() {
    return `<header class="ig-top"><b>${CONTENT.handle}</b><span class="ig-top-r">${icon('add')}${icon('more')}</span></header>
      <div class="ig-prof">${avatar(86, true)}<div class="ig-stats"><div><b>${CONTENT.posts.length + 1}</b><span>posts</span></div></div></div>
      <div class="ig-bio"><b>${CONTENT.name}</b>${CONTENT.bio.map(l => `<p>${l}</p>`).join('')}<a>${CONTENT.link}</a></div>
      <div class="ig-btns"><button class="pri">Follow</button><button>Message</button></div>
      <div class="ig-hl">${CONTENT.highlights.map((h, i) => `<button data-story="${i}"><span class="ig-hl-c">${thumb(h.cover)}</span><span>${h.title}</span></button>`).join('')}</div>
      <div class="ig-ptabs"><span class="on">${icon('grid')}</span><span>${icon('reels')}</span></div>
      <div class="ig-grid"><button data-reel="0"><div class="ig-m" style="background-image:url(${CONTENT.reel.poster})"></div><i class="ig-badge">${icon('reels')}</i></button>${CONTENT.posts.map((p, i) => `<button data-post="${i}">${thumb(p.m)}${p.m.type === 'video' ? `<i class="ig-badge">${icon('reels')}</i>` : ''}</button>`).join('')}</div>`;
  }
  function homeHTML() {
    return `<header class="ig-top ig-top--home"><b class="ig-word">${CONTENT.name}</b><span class="ig-top-r">${icon('heart')}${icon('send')}</span></header>
      <div class="ig-tray">${CONTENT.highlights.map((h, i) => `<button data-story="${i}"><span class="ig-ring">${thumb(h.cover)}</span><span>${h.title}</span></button>`).join('')}</div>
      ${CONTENT.posts.slice(0, 6).map((p, i) => feedPost(p, i)).join('')}`;
  }
  function feedPost(p, i) {
    return `<article class="ig-fp"><header>${avatar(32, true)}<b>${CONTENT.handle}</b>${icon('more')}</header>
      <div class="ig-fm" data-post="${i}">${media(p.m)}</div>
      <div class="ig-act">${icon('heart', 'like')}${icon('comment')}${icon('send')}<span></span>${icon('save')}</div>
      <p class="ig-cap"><b>${CONTENT.handle}</b> ${p.cap}</p></article>`;
  }
  function reelHTML(r, k) {
    return `<div class="ig-reel ${r.vertical ? 'vert' : ''}" data-k="${k}">
      ${r.vertical ? '' : `<div class="ig-blur" style="background-image:url(${r.poster})"></div>`}
      <video class="ig-m" src="${r.src}" poster="${r.poster}" muted playsinline loop preload="${k === 0 ? 'auto' : 'none'}"></video>
      <div class="ig-reel-ui">
        <div class="ig-reel-side">${icon('heart', 'like')}${icon('comment')}${icon('send')}${icon('more')}</div>
        <div class="ig-reel-cap"><div>${avatar(30, true)}<b>${CONTENT.handle}</b><span class="ig-follow">Follow</span></div><p>${r.cap}</p></div>
        <button class="ig-snd">${icon('mute')}</button>
        <div class="ig-prog"><i></i></div>
        <span class="ig-flash"></span><span class="ig-burst">${icon('heart')}</span>
      </div></div>`;
  }

  // ----- navigation -----
  const views = screen.querySelector('.ig-views'), reelsBox = screen.querySelector('.ig-reels');
  function show(v) {
    view = v;
    screen.querySelectorAll('.ig-view').forEach(s => s.classList.toggle('on', s.dataset.v === v));
    screen.querySelectorAll('.ig-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === v));
    screen.classList.toggle('dark', v === 'reels');
    el.querySelectorAll('.s-jump button').forEach(b => b.classList.toggle('on', b.dataset.go === v));
    closePost(); playVisible();
  }
  function openReel(k) { show('reels'); reelsBox.scrollTop = k * reelsBox.clientHeight; playVisible(); }
  function openPost(i, from) {
    const p = CONTENT.posts[i];
    if (p.m.type === 'video') return openReel(reels.findIndex(r => r.i === i));
    const box = screen.querySelector('.ig-post');
    box.innerHTML = `<header class="ig-top"><button class="ig-back">${icon('back')}</button><b>Posts</b><span></span></header>${feedPost(p, i)}`;
    box.hidden = false;
    box.querySelector('.ig-back').onclick = closePost;
    // the post grows out of the tile that was tapped
    if (from) {
      const a = from.getBoundingClientRect(), fm = box.querySelector('.ig-fm'), b = fm.getBoundingClientRect();
      fm.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})` }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
      box.animate([{ backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: '#fff' }], { duration: 300 });
    }
  }
  function closePost() { const b = screen.querySelector('.ig-post'); b.hidden = true; b.innerHTML = ''; }

  // ----- stories (with the cube turn between accounts' highlight sets) -----
  const storyBox = screen.querySelector('.ig-story');
  function openStory(h, s = 0) { story = { h, s }; storyBox.hidden = false; renderStory(); jumpOn('story'); }
  function faceHTML() {
    const hl = CONTENT.highlights[story.h], sl = hl.slides[story.s];
    return `<div class="ig-face">
      <div class="ig-bars">${hl.slides.map((_, i) => `<i class="${i < story.s ? 'done' : i === story.s ? 'now' : ''}"><b></b></i>`).join('')}</div>
      <header>${avatar(30)}<b>${CONTENT.handle}</b><span class="ig-hl-t">${hl.title}</span><button class="ig-x">${icon('close')}</button></header>
      ${media(sl.m, { play: true, cls: 'ig-story-m' })}
      ${sl.text ? `<p class="ig-story-t ${sl.hand ? 'hand' : ''}">${sl.text.replace('\n', '<br>')}</p>` : ''}
      <button class="ig-tap l" aria-label="Previous"></button><button class="ig-tap r" aria-label="Next"></button>
      <div class="ig-reply"><span>Send message</span>${icon('heart')}${icon('send')}</div></div>`;
  }
  function renderStory(cube = 0) {
    clearTimeout(timer);
    const old = storyBox.querySelector('.ig-face');
    storyBox.insertAdjacentHTML('beforeend', faceHTML());
    const face = storyBox.lastElementChild;
    if (old && cube) {
      sound.whoosh(.55, .45);
      const o = cube > 0 ? ['100% 50%', '0% 50%'] : ['0% 50%', '100% 50%'];
      old.style.transformOrigin = o[0]; face.style.transformOrigin = o[1];
      old.animate([{ transform: 'rotateY(0deg)' }, { transform: `rotateY(${-90 * cube}deg)`, filter: 'brightness(.4)' }], { duration: 600, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' }).finished.then(() => old.remove());
      face.animate([{ transform: `rotateY(${90 * cube}deg)`, filter: 'brightness(.4)' }, { transform: 'rotateY(0deg)', filter: 'brightness(1)' }], { duration: 600, easing: 'cubic-bezier(.45,0,.2,1)' });
    } else old?.remove();
    const sl = CONTENT.highlights[story.h].slides[story.s];
    const dur = sl.m.type === 'video' ? 6000 : 4500, bar = face.querySelector('.now b');
    bar.style.transition = `width ${dur}ms linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = '100%'));
    timer = setTimeout(() => storyStep(1), dur);
    face.querySelector('.ig-x').onclick = closeStory;
    face.querySelector('.ig-tap.l').onclick = () => storyStep(-1);
    face.querySelector('.ig-tap.r').onclick = () => storyStep(1);
  }
  function storyStep(d) {
    if (!story) return;
    const n = CONTENT.highlights[story.h].slides.length;
    let { h, s } = story; s += d;
    let cube = 0;
    if (s >= n) { h++; s = 0; cube = 1; }
    if (s < 0) { h--; cube = -1; s = h >= 0 ? CONTENT.highlights[h].slides.length - 1 : 0; }
    if (h < 0) { h = 0; s = 0; cube = 0; }
    if (h >= CONTENT.highlights.length) return closeStory();
    story = { h, s };
    renderStory(cube);
  }
  function closeStory() { clearTimeout(timer); story = null; storyBox.hidden = true; storyBox.innerHTML = ''; jumpOn(view); }
  const jumpOn = g => el.querySelectorAll('.s-jump button').forEach(b => b.classList.toggle('on', b.dataset.go === g));

  // ----- reels: play what's on screen; tap, scrub, sound, double-tap -----
  function playVisible() {
    screen.querySelectorAll('.ig-view video').forEach(v => {
      const r = v.getBoundingClientRect(), box = views.getBoundingClientRect();
      const on = v.closest('.ig-view').classList.contains('on') && r.top < box.bottom - r.height * .4 && r.bottom > box.top + r.height * .4;
      if (on) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    });
  }
  screen.querySelectorAll('.ig-view').forEach(v => v.addEventListener('scroll', () => requestAnimationFrame(playVisible), { passive: true }));
  reelsBox.querySelectorAll('.ig-reel').forEach(reel => {
    const v = reel.querySelector('video'), prog = reel.querySelector('.ig-prog'), fill = prog.querySelector('i');
    v.addEventListener('timeupdate', () => fill.style.width = `${v.currentTime / (v.duration || 1) * 100}%`);
    prog.addEventListener('pointerdown', e => {
      e.stopPropagation();
      const seek = ev => { const r = prog.getBoundingClientRect(); v.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (v.duration || 0); };
      seek(e); prog.setPointerCapture(e.pointerId); prog.onpointermove = ev => ev.buttons && seek(ev);
    });
    let tapT = 0;
    reel.querySelector('.ig-reel-ui').addEventListener('click', e => {
      if (e.target.closest('button,.ig-prog,.like,.ig-reel-side')) return;
      if (Date.now() - tapT < 280) {                          // double tap: like
        clearTimeout(reel._t); tapT = 0;
        reel.querySelector('.like').classList.add('liked');
        const b = reel.querySelector('.ig-burst'); b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
        return;
      }
      tapT = Date.now();
      reel._t = setTimeout(() => {
        v.paused ? v.play() : v.pause();
        sound.tick();
        const f = reel.querySelector('.ig-flash'); f.innerHTML = icon(v.paused ? 'pause' : 'play');
        f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
      }, 280);
    });
  });
  function reelStep(d) {
    const h = reelsBox.clientHeight, i = Math.round(reelsBox.scrollTop / h) + d;
    if (i < 0 || i >= reelsBox.children.length) return false;
    reelsBox.scrollTo({ top: i * h, behavior: 'smooth' });
    return true;
  }

  screen.addEventListener('click', e => {
    const t = e.target.closest('button,[data-post],.like');
    if (!t) return;
    if (t.matches('.like')) { t.classList.toggle('liked'); return; }
    if (t.dataset.tab) return show(t.dataset.tab);
    if (t.dataset.story) return openStory(+t.dataset.story);
    if (t.dataset.reel) return openReel(+t.dataset.reel);
    if (t.dataset.post) return openPost(+t.dataset.post, t);
    if (t.matches('.ig-snd')) {
      const v = t.closest('.ig-reel').querySelector('video');
      v.muted = !v.muted; t.innerHTML = icon(v.muted ? 'mute' : 'sound');
    }
  });
  el.querySelectorAll('.s-jump button').forEach(b => b.onclick = () => {
    const g = b.dataset.go;
    if (g === 'story') { show('home'); openStory(0); }
    else if (g === 'reels') { closeStory(); openReel(0); }
    else { closeStory(); show(g); }
  });

  show('profile');

  return {
    enter() { closeStory(); show('profile'); el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); },
    leave() { closeStory(); screen.querySelectorAll('video').forEach(v => v.pause()); el.classList.remove('is-in'); },
    phoneRect() { return ctx.rect(el.querySelector('.s-phone')); },
    next() { if (story) { storyStep(1); return true; } if (view === 'reels') return reelStep(1); return false; },
    prev() { if (story) { storyStep(-1); return true; } if (view === 'reels') return reelStep(-1); return false; },
  };
}
