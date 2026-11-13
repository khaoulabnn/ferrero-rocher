// a. Content Marketing · Main campaign video — a dedicated cinema moment. The eight storyboard
// panels assemble on cream, then the camera pushes into panel 1 (automatically
// after a few seconds, or at once on → / the play button), the lights go down
// and the original 62-second film plays full-bleed in 16:9 with sound.

import { sound } from './sound.js';

const IMG = 'assets/img/storyboard.png', IW = 1672, IH = 941;
const COLS = [28, 436, 846, 1257], ROWS = [125, 508], TW = 388, TH = 377;
const K = .86, GAP = 24;
const BW = 4 * TW * K + 3 * GAP, BX = (1920 - BW) / 2, BY = 290;
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

let inst;
export function create(el) { return inst ??= build(el); }

function build(el) {
  const board = el.querySelector('.m-board'), video = el.querySelector('.m-video');
  const dark = el.querySelector('.m-dark'), ctrl = el.querySelector('.m-ctrl');
  const bar = ctrl.querySelector('.m-bar'), fill = bar.querySelector('i');
  const pp = ctrl.querySelector('.m-pp'), snd = ctrl.querySelector('.m-snd'), tEl = ctrl.querySelector('.m-t');
  const toast = el.querySelector('.m-toast'), route = () => document.querySelector('.route');
  let step = 0, armed = 0, hideT = 0, autoT = 0;
  const err = el.querySelector('.m-err');

  board.innerHTML = ROWS.flatMap((y, r) => COLS.map((x, c) => {
    const i = r * 4 + c;
    return `<div class="m-tile" style="left:${c * (TW * K + GAP)}px;top:${r * (TH * K + GAP)}px;width:${TW * K}px;height:${TH * K}px;
      background-image:url(${IMG});background-size:${IW * K}px ${IH * K}px;background-position:${-x * K}px ${-y * K}px;
      --tx:${(Math.random() - .5) * 600}px;--ty:${(Math.random() - .3) * 400}px;--rz:${(Math.random() - .5) * 24}deg;--d:${i * .08}s"></div>`;
  })).join('');
  board.style.left = BX + 'px'; board.style.top = BY + 'px';

  // push into panel 1: its picture area (x 0–387, y 2–248 of the tile) fills the screen
  const S = 1920 / (387 * K);
  const pushTo = `translate(${-BX * 0 }px, ${(1080 - 246 * K * S) / 2 - 2 * K * S}px) scale(${S})`;

  function start() {
    if (step === 1) return;
    clearTimeout(autoT);
    step = 1;
    sound.whoosh(1.4, .8);
    el.classList.add('pushing');
    board.style.transform = `translate(${-BX}px, ${-BY}px) ${pushTo}`;
    route()?.classList.add('hide');
    setTimeout(() => { el.classList.add('cinema'); video.currentTime = 0; video.muted = false; video.play().catch(() => { video.muted = true; video.play(); }); sync(); }, 1250);
  }
  function stop() {
    clearTimeout(autoT);
    step = 0;
    video.pause();
    el.classList.remove('cinema', 'pushing', 'ended');
    board.style.transform = '';
    route()?.classList.remove('hide');
  }
  function sync() {
    pp.textContent = video.paused ? '▶' : '❚❚';
    snd.textContent = video.muted ? 'Sound off' : 'Sound on';
  }
  function wake() {
    ctrl.classList.add('on'); clearTimeout(hideT);
    hideT = setTimeout(() => ctrl.classList.remove('on'), 2400);
  }
  video.addEventListener('timeupdate', () => { fill.style.width = `${video.currentTime / (video.duration || 62) * 100}%`; tEl.textContent = fmt(video.currentTime); });
  video.addEventListener('ended', () => { el.classList.add('ended'); sync(); });
  video.addEventListener('play', sync); video.addEventListener('pause', sync);
  pp.onclick = () => { video.paused ? video.play() : video.pause(); };
  snd.onclick = () => { video.muted = !video.muted; sync(); };
  video.onclick = () => { if (step === 1) video.paused ? video.play() : video.pause(); };
  bar.addEventListener('pointerdown', e => {
    const seek = ev => { const r = bar.getBoundingClientRect(); video.currentTime = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * (video.duration || 62); };
    seek(e); bar.setPointerCapture(e.pointerId);
    bar.onpointermove = ev => ev.buttons && seek(ev);
  });
  el.addEventListener('pointermove', () => step === 1 && wake());
  el.querySelector('.m-play').onclick = start;
  el.querySelector('.m-fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
  video.addEventListener('error', () => { err.hidden = false; });
  video.addEventListener('playing', () => { err.hidden = true; wake(); });

  return {
    get ownsSpace() { return step === 1; },
    enter() {
      stop();
      el.classList.remove('is-in'); void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add('is-in'));
      video.load();
      // the storyboard holds long enough to be read, then leads straight into the film
      autoT = setTimeout(start, 5200);
    },
    leave() { stop(); el.classList.remove('is-in'); },
    next() {
      if (step === 0) { start(); return true; }
      if (el.classList.contains('ended')) return false;
      // a single press never cuts the film short by accident
      if (Date.now() - armed < 2200) return false;
      armed = Date.now();
      toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 2000);
      return true;
    },
    prev() { if (step === 1) { stop(); return true; } return false; },
    key(e) { if (e.key === ' ' && step === 1) { e.preventDefault(); video.paused ? video.play() : video.pause(); wake(); } },
  };
}
