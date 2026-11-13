// Part dividers — a full-screen sheet of crinkled gold foil with the Part's
// sections pressed into it. It slides over the previous scene, catches the light
// where the cursor is, and on → peels away from a corner like an opened wrapper.
import * as THREE from 'three';
import { SECTIONS } from './content.js';
// only the sections this presentation covers, in the order they are presented
const presented = () => { const ids = [...new Set([...document.querySelectorAll('.scene')].map(s => s.dataset.section))]; return SECTIONS.filter(s => ids.includes(s.id)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)); };
import { noise3 } from './rocher.js';
import { sound } from './sound.js';

const W = 1920, H = 1080, R = 150;
const insts = new Map();
export function create(el, ctx) { if (!insts.has(el)) insts.set(el, build(el, ctx)); return insts.get(el); }

function crinkleNormals(w, h) {
  // crumpled foil = many small flat facets, each tilted a little differently,
  // laid over a few long soft folds (jittered-grid Voronoi, so it stays fast)
  const C = 18, gw = Math.ceil(w / C) + 2, gh = Math.ceil(h / C) + 2;
  const rnd = (i, j, k) => { const v = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return v - Math.floor(v); };
  const site = (i, j) => [(i + rnd(i, j, 1)) * C, (j + rnd(i, j, 2)) * C];
  const c = Object.assign(document.createElement('canvas'), { width: w, height: h }), g = c.getContext('2d');
  const im = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ci = Math.floor(x / C), cj = Math.floor(y / C);
    let best = 1e9, bi = 0, bj = 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const [sx, sy] = site(ci + di, cj + dj), d = (sx - x) ** 2 + (sy - y) ** 2;
      if (d < best) { best = d; bi = ci + di; bj = cj + dj; }
    }
    const u = x / w * 3, v = y / h * 2;
    let nx = (rnd(bi, bj, 3) - .5) * .7 + noise3(u, v, 1.3) * .35;
    let ny = (rnd(bi, bj, 4) - .5) * .7 + noise3(u, v, 5.9) * .35;
    const L = Math.hypot(nx, ny, 1), i = (y * w + x) * 4;
    im.data[i] = (nx / L * .5 + .5) * 255; im.data[i + 1] = (ny / L * .5 + .5) * 255; im.data[i + 2] = (1 / L * .5 + .5) * 255; im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

function pressedType(part) {
  const c = Object.assign(document.createElement('canvas'), { width: 2048, height: 1152 }), g = c.getContext('2d');
  const k = 2048 / W;
  g.scale(k, k);
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(52,28,10,.95)';
  g.textBaseline = 'alphabetic';
  g.font = '400 1000px "DM Serif Display"';
  if (!part) return c;                       // the Content sheet carries no Part number
  g.globalAlpha = .2; g.textAlign = part === 1 ? 'right' : 'left';
  g.fillText(String(part), part === 1 ? 1880 : 40, 990);
  g.globalAlpha = 1;
  return c;
}

function studio() {
  const c = Object.assign(document.createElement('canvas'), { width: 1024, height: 512 }), g = c.getContext('2d');
  const v = g.createLinearGradient(0, 0, 0, 512);
  v.addColorStop(0, '#fff6e2'); v.addColorStop(.45, '#e9d6b4'); v.addColorStop(.7, '#8a6a44'); v.addColorStop(1, '#3a2614');
  g.fillStyle = v; g.fillRect(0, 0, 1024, 512);
  for (const [x, w, a] of [[180, 120, .9], [610, 60, .6], [820, 200, .5]]) {
    const h = g.createLinearGradient(x, 0, x + w, 0);
    h.addColorStop(0, 'rgba(255,252,240,0)'); h.addColorStop(.5, `rgba(255,252,240,${a})`); h.addColorStop(1, 'rgba(255,252,240,0)');
    g.fillStyle = h; g.fillRect(x, 40, w, 250);
  }
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Scene(); s.background = t;
  return s;
}

function build(el, ctx) {
  const part = +el.dataset.part;
  // data-contents: one "Content" sheet listing every section presented, grouped under Part 1 and Part 2
  const contents = 'contents' in el.dataset;
  const list = presented().filter(s => contents ? s.part : s.part === part);
  const label = el.querySelector('.f-copy');
  label.innerHTML = `<p class="f-kick">You Don’t Need an Occasion</p><h2 class="display">${contents ? 'Content' : `Part ${part}`}</h2>
    <ol>${list.map((s, i) => (contents && s.part !== list[i - 1]?.part ? `<li class="grp">Part ${s.part}</li>` : '') + `<li><b>${s.no}</b><span>${s.title}</span></li>`).join('')}</ol>`;
  label.classList.add(part === 1 ? 'left' : 'right');
  label.classList.toggle('contents', contents);
  const canvas = el.querySelector('.f-gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setSize(W, H, false);
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(studio(), .02).texture;
  const camera = new THREE.PerspectiveCamera(30, W / H, 10, 6000);
  camera.position.z = (H / 2) / Math.tan(15 * Math.PI / 180);

  const geo = new THREE.PlaneGeometry(W, H, 160, 90);
  const rest = geo.attributes.position.array.slice();
  const normal = crinkleNormals(1024, 576);
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  let typeTex = null;
  const front = new THREE.MeshPhysicalMaterial({ color: 0xe0ad55, metalness: 1, roughness: .36, clearcoat: .3, clearcoatRoughness: .25, normalMap: normal, normalScale: new THREE.Vector2(.36, .36) });
  const backM = new THREE.MeshPhysicalMaterial({ color: 0xcf9f48, metalness: 1, roughness: .38, normalMap: normal, normalScale: new THREE.Vector2(.36, .36), side: THREE.BackSide });
  const sheet = new THREE.Group();
  sheet.add(new THREE.Mesh(geo, front), new THREE.Mesh(geo, backM));
  scene.add(sheet);
  const light = new THREE.PointLight(0xfff1d6, 1.4, 0, 0);
  light.position.set(0, 0, 900);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xfff4e0, .4));

  // pressed type is drawn once the web fonts are ready
  document.fonts.ready.then(() => {
    typeTex = new THREE.CanvasTexture(pressedType(contents ? 0 : part));
    typeTex.colorSpace = THREE.SRGBColorSpace;
    front.map = typeTex; front.bumpMap = typeTex; front.bumpScale = 2.5;
    front.needsUpdate = true;
  });

  // peel direction: Part 1 lifts from the bottom-right corner, Part 2 from the bottom-left
  const n = new THREE.Vector2(part === 1 ? .8 : -.8, -.6);
  const sMax = 960 * .8 + 540 * .6;
  let raf = 0, peel = -1, peelStart = 0, slide = 1, slideStart = 0, resolvePeel = null;
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

  function deform(s) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = rest[i * 3], y = rest[i * 3 + 1];
      const d = x * n.x + y * n.y - s;
      if (d <= 0) { pos.setXYZ(i, x, y, 0); continue; }
      const fx = x - n.x * d, fy = y - n.y * d;             // foot on the fold line
      if (d < Math.PI * R) {
        const a = d / R;
        pos.setXYZ(i, fx + n.x * R * Math.sin(a), fy + n.y * R * Math.sin(a), R * (1 - Math.cos(a)));
      } else {
        const e = d - Math.PI * R;
        pos.setXYZ(i, fx - n.x * e, fy - n.y * e, 2 * R);
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  const onMove = e => { const p = ctx.toStage(e); ptr.tx = p.x - W / 2; ptr.ty = H / 2 - p.y; };

  function loop(now) {
    raf = requestAnimationFrame(loop);
    ptr.x += (ptr.tx - ptr.x) * .06; ptr.y += (ptr.ty - ptr.y) * .06;
    light.position.set(ptr.x * 1.1, ptr.y * 1.1, 700);
    // slide in from the side, settling with a gentle overshoot-free ease
    if (slide < 1) {
      slide = Math.min(1, (now - slideStart) / 1150);
      const e = 1 - Math.pow(1 - slide, 4);
      sheet.position.x = (part === 1 ? 1 : -1) * W * 1.05 * (1 - e);
      sheet.rotation.z = (part === 1 ? 1 : -1) * .05 * (1 - e);
    }
    label.style.transform = `translateX(${sheet.position.x}px) rotate(${-sheet.rotation.z}rad)`;
    sheet.rotation.x = -ptr.y / 9000; sheet.rotation.y = ptr.x / 14000;
    if (peel >= 0) {
      const t = Math.min(1, (now - peelStart) / 1700);
      const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      deform(sMax - e * (2 * sMax + Math.PI * R * 1.2));
      if (t >= 1 && resolvePeel) { resolvePeel(); resolvePeel = null; }
    }
    renderer.render(scene, camera);
  }

  return {
    enter({ forward } = {}) {
      peel = -1; deform(sMax + 10); label.classList.remove('lift');
      if (forward !== false) sound.crinkle(1.2, .6);
      slide = forward === false ? 1 : 0; slideStart = performance.now();
      if (slide === 1) { sheet.position.x = 0; sheet.rotation.z = 0; }
      el.addEventListener('pointermove', onMove);
      raf = requestAnimationFrame(loop);
    },
    leave() { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); },
    peel() {
      label.classList.add('lift');
      sound.crinkle(1.8, .9);
      return new Promise(r => setTimeout(() => { peel = 0; peelStart = performance.now(); resolvePeel = r; }, 280));
    },
    resize(s) { renderer.setPixelRatio(Math.min(2, devicePixelRatio * s)); renderer.setSize(W, H, false); },
  };
}
