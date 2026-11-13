// Title — the real box, cut out of the product clip, turns to follow the cursor.
// Each frame = colour JPEG + refined alpha mask; a contact shadow tracks the box's
// real footprint (bbox.json), a light band sweeps the foil as it turns, and gold
// flakes drift in two depths (behind the type, and in front of the box).

const FRAMES = 72;
const BOX = { x: 330, y: 228, w: 1260, h: 709 };          // where the 1280x720 frame is drawn
const color = [], alpha = [];
let bbox = null;
function preload() {
  if (color.length) return;
  for (let i = 0; i < FRAMES; i++) {
    const n = String(i).padStart(3, '0');
    const c = new Image(); c.src = `assets/frames/product/f${n}.jpg`; color.push(c);
    const m = new Image(); m.src = `assets/frames/product/m${n}.png`; alpha.push(m);
  }
  fetch('assets/frames/product/bbox.json').then(r => r.json()).then(j => bbox = j);
}

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  preload();
  const box = el.querySelector('.t-box'), bx = box.getContext('2d');
  const back = el.querySelector('.t-back'), kx = back.getContext('2d');
  const front = el.querySelector('.t-front'), fx = front.getContext('2d');
  const off = Object.assign(document.createElement('canvas'), { width: 1280, height: 720 }), ox = off.getContext('2d');
  const line1 = el.querySelector('.t-line1'), line2 = el.querySelector('.t-line2');
  let raf = 0, t0 = 0, lastMove = -1e9, pos = .5, target = .5;
  const ptr = { x: -999, y: -999, vx: 0, vy: 0, nx: 0, ny: 0 }, par = { x: 0, y: 0 };

  const mk = (z) => ({
    x: Math.random() * 1920, y: Math.random() * 1080, z, s: z > .5 ? 10 + Math.random() * 14 : 4 + Math.random() * 7,
    rot: Math.random() * 6.28, spin: (Math.random() - .5) * .02, flip: Math.random() * 6.28, flipV: .02 + Math.random() * .03,
    vx: (Math.random() - .4) * .25, vy: .18 + Math.random() * .35, sway: Math.random() * 6.28,
    pts: Array.from({ length: 5 }, (_, k) => { const a = k / 5 * 6.28 + Math.random() * .6, r = .55 + Math.random() * .45; return [Math.cos(a) * r, Math.sin(a) * r]; }),
  });
  const backFlakes = Array.from({ length: 80 }, () => mk(Math.random() * .5));
  const frontFlakes = Array.from({ length: 16 }, () => mk(.75 + Math.random() * .25));

  function onMove(e) {
    const p = ctx.toStage(e);
    ptr.vx = p.x - ptr.x; ptr.vy = p.y - ptr.y; ptr.x = p.x; ptr.y = p.y;
    ptr.nx = p.x / 960 - 1; ptr.ny = p.y / 540 - 1;
    target = Math.min(1, Math.max(0, (p.x - 260) / 1400));
    lastMove = performance.now();
  }
  const onLeave = () => { ptr.x = ptr.y = -999; };

  function composite(i) {
    ox.globalCompositeOperation = 'source-over';
    ox.clearRect(0, 0, 1280, 720);
    ox.drawImage(color[i], 0, 0, 1280, 720);
    ox.globalCompositeOperation = 'destination-in';
    ox.drawImage(alpha[i], 0, 0, 1280, 720);
  }

  function drawBox(t) {
    const f = pos * (FRAMES - 1), a = Math.floor(f), b = Math.min(FRAMES - 1, a + 1), k = f - a;
    if (!color[a].complete || !alpha[a].complete) return;
    bx.clearRect(0, 0, 1920, 1080);
    const ox0 = BOX.x - par.x * 18, oy0 = BOX.y - par.y * 10, sc = BOX.w / 1280;

    // contact shadow under the real footprint of the box
    if (bbox) {
      const A = bbox[a], B = bbox[b] || A, lerp = (p, q) => p + (q - p) * k;
      const cx = ox0 + (lerp(A[0], B[0]) + lerp(A[2], B[2]) / 2) * sc;
      const by = oy0 + (lerp(A[1], B[1]) + lerp(A[3], B[3])) * sc;
      const w = lerp(A[2], B[2]) * sc;
      for (const [rx, ry, al, dy] of [[w * .62, 34, .22, -6], [w * .5, 14, .34, -10]]) {
        const g = bx.createRadialGradient(cx, by + dy, 0, cx, by + dy, rx);
        g.addColorStop(0, `rgba(74,44,18,${al})`); g.addColorStop(1, 'rgba(74,44,18,0)');
        bx.save(); bx.translate(cx, by + dy); bx.scale(1, ry / rx); bx.translate(-cx, -(by + dy));
        bx.fillStyle = g; bx.beginPath(); bx.arc(cx, by + dy, rx, 0, 6.283); bx.fill(); bx.restore();
      }
    }
    composite(a);
    // light band travelling across the foil as the box turns
    ox.globalCompositeOperation = 'source-atop';
    const lx = -300 + pos * 1900 + Math.sin(t * .6) * 40;
    const lg = ox.createLinearGradient(lx - 260, 0, lx + 260, 720);
    lg.addColorStop(0, 'rgba(255,248,225,0)'); lg.addColorStop(.5, 'rgba(255,248,225,.28)'); lg.addColorStop(1, 'rgba(255,248,225,0)');
    ox.fillStyle = lg; ox.fillRect(0, 0, 1280, 720);
    bx.drawImage(off, ox0, oy0, BOX.w, BOX.h);
    if (k > .02 && color[b].complete && alpha[b].complete) {
      composite(b);
      bx.globalAlpha = k; bx.drawImage(off, ox0, oy0, BOX.w, BOX.h); bx.globalAlpha = 1;
    }
  }

  function flake(g, f, blur) {
    const sx = Math.cos(f.flip), light = .55 + .45 * Math.abs(sx);
    g.save(); g.translate(f.x, f.y); g.rotate(f.rot); g.scale(f.s * (.25 + .75 * Math.abs(sx)), f.s);
    const gr = g.createLinearGradient(-1, -1, 1, 1);
    gr.addColorStop(0, `rgba(${250 * light | 0},${228 * light | 0},${165 * light | 0},.9)`);
    gr.addColorStop(.55, `rgba(${200 * light | 0},${152 * light | 0},${74 * light | 0},.9)`);
    gr.addColorStop(1, `rgba(${132 * light | 0},${94 * light | 0},${30 * light | 0},.85)`);
    g.fillStyle = gr; g.globalAlpha = blur ? .55 : .35 + f.z;
    g.beginPath(); f.pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill();
    g.restore();
  }
  function stepFlakes(list, g, intro, blur) {
    for (const f of list) {
      f.sway += .01;
      let vx = f.vx + Math.sin(f.sway) * .3, vy = f.vy;
      const dx = f.x - ptr.x, dy = f.y - ptr.y, d2 = dx * dx + dy * dy, R = 200 + f.z * 80;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1, F = (1 - d / R) * 6;
        vx += dx / d * F - dy / d * F * .5 + ptr.vx * .04; vy += dy / d * F + dx / d * F * .5 + ptr.vy * .04;
        f.flipV = Math.min(.22, f.flipV + .01);
      } else f.flipV += (.03 - f.flipV) * .02;
      const sp = .5 + f.z * 1.1;
      f.x += vx * sp; f.y += vy * sp; f.rot += f.spin; f.flip += f.flipV;
      if (f.y > 1110 || f.x < -60 || f.x > 1980) Object.assign(f, { y: -30, x: Math.random() * 1920 });
      // opening: flakes bloom outward from the box
      if (intro < 1) {
        const k = 1 - Math.pow(1 - intro, 3);
        const x = 960 + (f.x - 960) * k, y = 580 + (f.y - 580) * k;
        const ox = f.x, oy = f.y; f.x = x; f.y = y; flake(g, f, blur); f.x = ox; f.y = oy;
      } else flake(g, f, blur);
    }
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const t = (now - t0) / 1000;
    const idle = now - lastMove > 2500;
    if (idle) { target = .5 + .4 * Math.sin(t * .32); ptr.nx *= .98; ptr.ny *= .98; }
    pos += (target - pos) * .075;
    par.x += (ptr.nx - par.x) * .05; par.y += (ptr.ny - par.y) * .05;
    line1.style.transform = `translate(${-par.x * 8}px, ${-par.y * 5}px)`;
    line2.style.transform = `translate(${-par.x * 26}px, ${-par.y * 12}px)`;
    drawBox(t);
    const intro = Math.min(1, t / 1.6);
    kx.clearRect(0, 0, 1920, 1080); stepFlakes(backFlakes, kx, intro, false);
    fx.clearRect(0, 0, 1920, 1080); stepFlakes(frontFlakes, fx, intro, true);
    ptr.vx *= .85; ptr.vy *= .85;
  }

  return {
    enter() {
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      el.classList.remove('is-in'); void el.offsetWidth;
      requestAnimationFrame(() => el.classList.add('is-in'));
      t0 = performance.now(); lastMove = -1e9;
      raf = requestAnimationFrame(loop);
    },
    leave() {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.classList.remove('is-in');
    },
  };
}
