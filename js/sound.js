// Quiet, synthesised sound design (no audio files, so it works offline):
// gold-foil crinkle, a soft piece landing, a page turn, a hushed whoosh and a pen
// stroke. Everything runs through one master gain so a single toggle mutes it all.

let ctx = null, master = null, noise = null;
let muted = (() => { try { return localStorage.getItem('occasion-muted') === '1'; } catch { return false; } })();
const listeners = new Set();

function ac() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain();
    master.gain.value = muted ? 0 : .7;
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
// unlock on the first gesture (browsers keep audio closed until then)
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => ac(), { once: true, capture: true }));

function src(t, dur, gain = 1) {
  const s = ctx.createBufferSource(); s.buffer = noise;
  s.start(t, Math.random() * 1.5, dur + .05);
  const g = ctx.createGain(); g.gain.value = gain;
  s.connect(g);
  return g;
}
function env(node, t, a, peak, d) {
  node.gain.setValueAtTime(0, t);
  node.gain.linearRampToValueAtTime(peak, t + a);
  node.gain.exponentialRampToValueAtTime(.0001, t + a + d);
}
const ok = () => !muted && ac() && ctx.state !== 'closed';

export const sound = {
  get muted() { return muted; },
  toggle() {
    muted = !muted;
    try { localStorage.setItem('occasion-muted', muted ? '1' : '0'); } catch {}
    if (ctx) master.gain.setTargetAtTime(muted ? 0 : .7, ctx.currentTime, .05);
    listeners.forEach(f => f(muted));
  },
  onChange(f) { listeners.add(f); },

  // foil: many tiny bright crackles, denser in the middle of the gesture
  crinkle(dur = 1, amt = 1) {
    if (!ok()) return;
    const t0 = ctx.currentTime + .01, hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 1400; hp.connect(master);
    const n = Math.round(dur * 46 * amt);
    for (let i = 0; i < n; i++) {
      const u = Math.random(), t = t0 + dur * (u < .5 ? Math.sqrt(u / 2) : 1 - Math.sqrt((1 - u) / 2));
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.frequency.value = 2200 + Math.random() * 6500; bp.Q.value = .7 + Math.random() * 2.5;
      const len = .004 + Math.random() * .03, g = src(t, len, 1);
      const e = ctx.createGain(); env(e, t, .001, (.05 + Math.random() * .12) * amt, len);
      g.connect(bp).connect(e).connect(hp);
    }
  },
  // a piece settling into its paper cup
  land(vol = 1) {
    if (!ok()) return;
    const t = ctx.currentTime + .01;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + .12);
    const og = ctx.createGain(); env(og, t, .004, .22 * vol, .16);
    o.connect(og).connect(master); o.start(t); o.stop(t + .3);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const ng = ctx.createGain(); env(ng, t, .002, .1 * vol, .06);
    src(t, .08).connect(lp).connect(ng).connect(master);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500;
    const rg = ctx.createGain(); env(rg, t + .02, .01, .025 * vol, .09);
    src(t + .02, .12).connect(hp).connect(rg).connect(master);
  },
  // paper turning: a band of noise sweeping up then down, with a soft flap at the end
  page() {
    if (!ok()) return;
    const t = ctx.currentTime + .01, bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = .9;
    bp.frequency.setValueAtTime(600, t); bp.frequency.linearRampToValueAtTime(2600, t + .35); bp.frequency.linearRampToValueAtTime(900, t + .8);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.13, t + .25); g.gain.exponentialRampToValueAtTime(.0001, t + .85);
    src(t, .9).connect(bp).connect(g).connect(master);
    setTimeout(() => sound.land(.35), 760);
  },
  whoosh(dur = .9, vol = 1) {
    if (!ok()) return;
    const t = ctx.currentTime + .01, lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = .6;
    lp.frequency.setValueAtTime(250, t); lp.frequency.exponentialRampToValueAtTime(1800, t + dur * .45); lp.frequency.exponentialRampToValueAtTime(300, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09 * vol, t + dur * .45); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src(t, dur).connect(lp).connect(g).connect(master);
  },
  // thick chocolate pouring: a low, soft, slowly moving swell (no 'gloop' effects)
  pour(dur = 2.5) {
    if (!ok()) return;
    const t = ctx.currentTime + .01, lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = 1.2;
    lp.frequency.setValueAtTime(180, t); lp.frequency.linearRampToValueAtTime(520, t + dur * .45); lp.frequency.linearRampToValueAtTime(220, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + dur * .35); g.gain.linearRampToValueAtTime(.1, t + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src(t, dur).connect(lp).connect(g).connect(master);
  },
  // a few short graphite strokes
  pen(strokes = 3) {
    if (!ok()) return;
    let t = ctx.currentTime + .02;
    for (let i = 0; i < strokes; i++) {
      const len = .09 + Math.random() * .12, bp = ctx.createBiquadFilter();
      bp.type = 'bandpass'; bp.Q.value = 3; bp.frequency.setValueAtTime(1800 + Math.random() * 900, t); bp.frequency.linearRampToValueAtTime(2600 + Math.random() * 900, t + len);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.035, t + .02); g.gain.linearRampToValueAtTime(0, t + len);
      src(t, len).connect(bp).connect(g).connect(master);
      t += len + .04 + Math.random() * .05;
    }
  },
  tick() {
    if (!ok()) return;
    const t = ctx.currentTime + .005, hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
    const g = ctx.createGain(); env(g, t, .001, .05, .02);
    src(t, .03).connect(hp).connect(g).connect(master);
  },
};
