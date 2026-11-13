// Procedural Ferrero Rocher-style piece for the 3D scenes: crinkled gold foil
// (split into petals so it can unfold), a nutty chocolate shell and a pleated cup.
// Illustrative only: no wordmark, sticker or pack is reproduced.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ---------- small value noise ----------
function hash(i, j, k) {
  let h = (i * 374761393 + j * 668265263 + k * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const fade = t => t * t * (3 - 2 * t);
export function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf), zf) * 2 - 1;
}
export const fbm = (x, y, z, o = 3) => { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * noise3(x * f, y * f, z * f); a *= .5; f *= 2.1; } return s; };

// ---------- renderer + light-room environment ----------
export function makeRenderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.05;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.setSize(1920, 1080, false);
  return r;
}
export function makeEnv(renderer) {
  const pm = new THREE.PMREMGenerator(renderer);
  const env = pm.fromScene(new RoomEnvironment(renderer), 0.03).texture;
  pm.dispose();
  return env;
}
export function addLights(scene) {
  scene.add(new THREE.HemisphereLight(0xfff6e6, 0xd9c09a, 0.9));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
  key.position.set(4, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  key.shadow.radius = 6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe2b0, 1.1);
  rim.position.set(-6, 3, -5);
  scene.add(rim);
  return key;
}

// ---------- materials ----------
export const mats = {
  gold: () => new THREE.MeshPhysicalMaterial({ color: 0xe2b763, metalness: 1, roughness: .26, clearcoat: .35, clearcoatRoughness: .3, side: THREE.DoubleSide }),
  choc: () => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .72, metalness: 0 }),
  cup: () => new THREE.MeshStandardMaterial({ color: 0x3d2414, roughness: .85, side: THREE.DoubleSide }),
};

// ---------- foil ----------
const THETA_BOTTOM = Math.PI * 0.84;
function crinkle(v, R, seed) {
  const d = v.clone().normalize();
  let r = R * (1 + fbm(d.x * 5 + seed, d.y * 5, d.z * 5) * .075 + noise3(d.x * 17, d.y * 17 + seed, d.z * 17) * .022);
  const p = d.multiplyScalar(r);
  // gathered, twisted crown at the top
  const top = Math.max(0, d.y - .8) / .2;
  if (top > 0) {
    const tw = top * top;
    p.x *= 1 - tw * .35; p.z *= 1 - tw * .35;
    p.y += tw * R * (.1 + .14 * noise3(d.x * 13 + seed, d.z * 13, 3.1));
    const a = tw * 1.4, c = Math.cos(a), s = Math.sin(a), x = p.x;
    p.x = x * c - p.z * s; p.z = x * s + p.z * c;
  }
  return p;
}
export function makeFoil(R = 1, petals = 6, seed = Math.random() * 50, phase = 0) {
  const group = new THREE.Group();
  const mat = mats.gold();
  const list = [];
  for (let k = 0; k < petals; k++) {
    const phiStart = phase + k / petals * Math.PI * 2, phiLen = Math.PI * 2 / petals;
    const geo = new THREE.SphereGeometry(R, 30, 44, phiStart, phiLen, 0, THETA_BOTTOM);
    const pos = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      pos.setXYZ(i, ...crinkle(v, R, seed).toArray());
    }
    const mid = phiStart + phiLen / 2;
    const P = new THREE.Vector3(-R * Math.cos(mid) * Math.sin(THETA_BOTTOM), R * Math.cos(THETA_BOTTOM), R * Math.sin(mid) * Math.sin(THETA_BOTTOM));
    geo.translate(-P.x, -P.y, -P.z);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    const pivot = new THREE.Group();
    pivot.position.copy(P);
    pivot.add(mesh);
    const rx = -Math.cos(mid), rz = Math.sin(mid);
    const axis = new THREE.Vector3(rz, 0, -rx).normalize();
    // anchor at the petal's centre, nudged outward, for HTML labels
    const anchor = new THREE.Object3D();
    const th = Math.PI * .42;
    anchor.position.set(-R * 1.25 * Math.cos(mid) * Math.sin(th), R * 1.25 * Math.cos(th), R * 1.25 * Math.sin(mid) * Math.sin(th)).sub(P);
    pivot.add(anchor);
    group.add(pivot);
    list.push({ pivot, axis, anchor, delay: k * .05 });
  }
  group.userData.petals = list;
  return group;
}
export function setBloom(foil, amount, t = 0) {
  for (const p of foil.userData.petals) {
    const a = Math.max(0, Math.min(1, amount * 1.25 - p.delay));
    const e = a < .5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2;
    p.pivot.quaternion.setFromAxisAngle(p.axis, e * 1.42 + Math.sin(t * 1.3 + p.delay * 40) * .03 * e);
  }
}

// ---------- chocolate shell with chopped hazelnut ----------
export function makeShell(R = .94, detail = 5, seed = 1) {
  const geo = new THREE.SphereGeometry(R, 32 * detail, 24 * detail);
  const pos = geo.attributes.position, v = new THREE.Vector3();
  const col = new Float32Array(pos.count * 3);
  const dark = new THREE.Color(0x4a2a14), nut = new THREE.Color(0xa77442), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    const n = fbm(v.x * 7 + seed, v.y * 7, v.z * 7);
    const chunk = Math.max(0, noise3(v.x * 13, v.y * 13 + seed, v.z * 13) - .25) * 1.6;
    const h = n * .05 + chunk * .09;
    pos.setXYZ(i, v.x * R * (1 + h), v.y * R * (1 + h), v.z * R * (1 + h));
    c.copy(dark).lerp(nut, Math.min(1, chunk * 1.6 + Math.max(0, n) * .3));
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mats.choc());
  m.castShadow = true;
  return m;
}

// ---------- pleated paper cup ----------
export function makeCup(R = 1) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    pts.push(new THREE.Vector2(R * (.55 + .42 * Math.pow(t, .7)), -R * 1.0 + t * R * .48));
  }
  const geo = new THREE.LatheGeometry(pts, 120);
  const pos = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const phi = Math.atan2(v.z, v.x), k = 1 + .045 * Math.sin(phi * 30);
    pos.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  geo.computeVertexNormals();
  const base = new THREE.Mesh(new THREE.CircleGeometry(R * .55, 40).rotateX(-Math.PI / 2).translate(0, -R * 1.0, 0), mats.cup());
  const g = new THREE.Group();
  const m = new THREE.Mesh(geo, mats.cup());
  m.castShadow = true;
  g.add(m, base);
  return g;
}

export function makePiece({ R = 1, petals = 6, phase = 0 } = {}) {
  const g = new THREE.Group();
  const foil = makeFoil(R, petals, Math.random() * 40, phase);
  const shell = makeShell(R * .93, 5, Math.random() * 30);
  const cup = makeCup(R);
  g.add(cup, shell, foil);
  g.userData = { foil, shell, cup, bloom: 0, target: 0 };
  return g;
}

export function shadowFloor(y = -1.2, opacity = .16) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  m.receiveShadow = true;
  return m;
}
