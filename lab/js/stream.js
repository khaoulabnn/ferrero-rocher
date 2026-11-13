// Single-stream chocolate transition (plain WebGL, works offline).
// Modelled on Khaoula's reference video: one thick, glossy ribbon of melted
// chocolate leaves the Ferrero Rocher piece at the side of the slide, falls and
// twists, then coils into a ring. The ring is the edge of the reveal: inside it
// the next slide appears, outside it the current slide stays visible. The ring
// widens off-screen, the stream thins away and the piece returns to its place.
// Never a full-screen overlay: only the ribbon itself is drawn.

const VS = `
attribute vec2 pos; attribute vec2 perp; attribute float across; attribute float along; attribute float phi; attribute float ribbon;
uniform vec2 res;
varying vec2 vPerp; varying float vAcross; varying float vAlong; varying float vPhi; varying float vFlat;
void main(){ vPerp = perp; vAcross = across; vAlong = along; vPhi = phi; vFlat = ribbon;
  gl_Position = vec4(pos.x / res.x * 2. - 1., 1. - pos.y / res.y * 2., 0., 1.); }`;
const FS = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec2 vPerp; varying float vAcross; varying float vAlong; varying float vPhi; varying float vFlat;
uniform float time, alpha;
void main(){
  float a = vAcross;
  float aa = fwidth(a) * 1.3 + .002;
  float cover = 1. - smoothstep(1. - aa, 1. + aa * .2, abs(a));
  // a twisting ribbon: the highlight drifts across the tube as it flows
  float tw = sin(vAlong * .045 - time * 7.) * .35;
  float s = clamp(a + tw * (1. - a * a), -1., 1.);
  vec3 nTube = normalize(vec3(vPerp * s, sqrt(max(0., 1. - s * s)) + .05));
  // the falling part is a flat ribbon turning about its own length, like the reference:
  // its face tilts with phi, and it bulges a little across its width
  float c = cos(vPhi), sn = sin(vPhi);
  vec3 nRib = normalize(vec3(vPerp * (sn + a * .55), abs(c) + .08));
  vec3 n = normalize(mix(nTube, nRib, vFlat));
  float back = vFlat * step(c, 0.);                           // the underside of the ribbon is a shade darker
  vec3 L = normalize(vec3(-.45, -.7, .62)), V = vec3(0., 0., 1.), H = normalize(L + V);
  float body = 1. - a * a;
  vec3 deep = vec3(.19, .085, .035), warm = vec3(.56, .3, .13);
  vec3 col = mix(deep, warm, pow(body, .8));
  col *= .45 + .7 * max(dot(n, L), 0.);
  col *= .72 + .28 * body;                                    // the tube darkens towards its edges
  float nh = max(dot(n, H), 0.);
  float spec = pow(nh, 60.) * 1.35 + pow(nh, 9.) * .22;
  // a second, softer streak lower on the tube, like light caught by wet chocolate
  vec3 L2 = normalize(vec3(.5, .55, .7));
  float spec2 = pow(max(dot(n, normalize(L2 + V)), 0.), 40.) * .45;
  float flow = .5 + .5 * sin(vAlong * .09 - time * 10.);
  col += vec3(1., .91, .78) * (spec * (.7 + .4 * flow) + spec2);
  col += vec3(.9, .62, .36) * pow(abs(a), 5.) * .22;          // warm rim light
  col *= 1. - back * .22;
  gl_FragColor = vec4(col, cover * alpha);
}`;

function setup(cv) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true });
  if (!gl) return null;
  gl.getExtension('OES_standard_derivatives');
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  const F = 4 * 8;
  const at = (n, size, off) => { const l = gl.getAttribLocation(pr, n); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, F, off * 4); };
  at('pos', 2, 0); at('perp', 2, 2); at('across', 1, 4); at('along', 1, 5); at('phi', 1, 6); at('ribbon', 1, 7);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  return { gl, U: n => gl.getUniformLocation(pr, n) };
}

const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const easeIn = k => k * k * k;
const clamp01 = k => Math.max(0, Math.min(1, k));
const bez = (p0, p1, p2, p3, t) => { const m = 1 - t; return [m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]; };

// the centre line for progress u: fall + twist from the piece, then a coil around C
function centreLine(u, P0, C, R, span, time) {
  // it enters the ring on the side nearest the piece and coils anticlockwise,
  // so the stream never crosses the opening it reveals
  const th0 = Math.PI * .12;
  const E = [C[0] + R * Math.cos(th0), C[1] + R * Math.sin(th0)];
  const tan = [Math.sin(th0), -Math.cos(th0)];                // direction of travel around the ring
  const c1 = [P0[0] - 40, P0[1] + 230], c2 = [E[0] - tan[0] * 260, E[1] - tan[1] * 260];
  const pts = [];
  const NB = 70;
  for (let i = 0; i <= NB; i++) {
    const t = i / NB, p = bez(P0, c1, c2, E, t);
    // a gentle helix-like sway along the falling stream, fading near both ends
    const sway = Math.sin(t * Math.PI * 3 - time * 5) * 16 * Math.sin(t * Math.PI);
    const q = bez(P0, c1, c2, E, Math.min(1, t + .01)), d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    pts.push([p[0] - (q[1] - p[1]) / d * sway, p[1] + (q[0] - p[0]) / d * sway]);
  }
  const NA = Math.max(2, Math.round(110 * span / (Math.PI * 2)));
  for (let i = 1; i <= NA; i++) {
    const th = th0 - span * i / NA;
    const wob = Math.sin(th * 5 + time * 3) * 4;
    pts.push([C[0] + (R + wob) * Math.cos(th), C[1] + (R + wob) * Math.sin(th)]);
  }
  return pts;
}

export function chocolateStream(layer, { from, centre = [880, 560], onReveal, duration = 2800, W = 62, pieceEl, still } = {}) {
  const cv = document.createElement('canvas');
  cv.className = 'tx-canvas stream';
  layer.append(cv);
  const S = setup(cv);
  const scale = Math.min(2, devicePixelRatio * (layer.getBoundingClientRect().width / 1920 || 1));
  cv.width = Math.round(1920 * scale); cv.height = Math.round(1080 * scale);
  if (!S) { onReveal?.(9999); cv.remove(); return Promise.resolve(); }
  const { gl, U } = S;
  gl.viewport(0, 0, cv.width, cv.height);
  gl.uniform2f(U('res'), 1920, 1080);
  const C = centre, Rmax = Math.max(...[[0, 0], [1920, 0], [0, 1080], [1920, 1080]].map(p => Math.hypot(p[0] - C[0], p[1] - C[1]))) + W * 2;
  const R0 = 170;

  function frame(u, time) {
    // timings (fractions of the whole transition)
    const pour = clamp01((u - .08) / .34);                     // head travels down and around
    const grow = easeIn(clamp01((u - .46) / .38));             // ring widens off-screen
    const thin = clamp01((u - .8) / .2);                       // stream thins away
    const R = R0 + (Rmax - R0) * grow;
    const span = Math.PI * 2 * clamp01((pour - .45) / .55) + .25 * grow;
    const pts = centreLine(u, from, C, R, Math.max(.05, span), time);
    // trim to the head position along the length
    const seg = []; let L = 0;
    for (let i = 0; i < pts.length; i++) { if (i) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(L); }
    const head = L * Math.min(1, pour * 1.15 + .02);
    const data = [];
    const ringStart = seg[70] || L;                           // where the fall ends and the coil begins
    let last = 0;
    for (let i = 0; i < pts.length && seg[i] <= head; i++) last = i;
    for (let i = 0; i <= last; i++) {
      const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
      let tx = q[0] - o[0], ty = q[1] - o[1]; const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d;
      const px = -ty, py = tx;
      const toHead = head - seg[i];
      let w = W * (.86 + .14 * Math.sin(seg[i] * .05 - time * 6));
      w *= Math.sqrt(clamp01(toHead / 46)) * .9 + .1;           // rounded, drop-like head
      w *= 1 + .45 * Math.exp(-seg[i] / 40);                      // the melting piece feeds a thicker start
      // twist: the ribbon turns as it falls, seen face-on it is wide, edge-on narrow
      const flat = clamp01((ringStart - seg[i]) / 260) * (1 - grow);
      const phi = seg[i] * .016 - time * 4.2;
      w *= 1 - flat * (1 - (.36 + .64 * Math.abs(Math.cos(phi))));
      w *= 1 - thin;
      const h = w / 2;
      data.push(p[0] + px * h, p[1] + py * h, px, py, 1, seg[i], phi, flat, p[0] - px * h, p[1] - py * h, px, py, -1, seg[i], phi, flat);
    }
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    if (data.length >= 32) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
      gl.uniform1f(U('time'), time); gl.uniform1f(U('alpha'), 1 - thin * .6);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, data.length / 8);
    }
    // the reveal is the inside of the ring, once the coil has closed
    const closed = clamp01((pour - .55) / .45);
    onReveal?.(closed * (R - W * .45), C);
  }

  if (still != null) { frame(still, still * duration / 1000); return Promise.resolve(cv); }

  // the piece softens and sinks as it melts, then returns at the end
  pieceEl?.animate([
    { transform: 'none', opacity: 1, filter: 'none' },
    { transform: 'scale(1.1, .78) translateY(14px)', opacity: 1, filter: 'brightness(1.08) saturate(1.1)', offset: .1 },
    { transform: 'scale(.7, .32) translateY(60px)', opacity: 0, filter: 'brightness(1.1) blur(1px)', offset: .3 },
    { transform: 'scale(.7, .32) translateY(60px)', opacity: 0, offset: .84 },
    { transform: 'scale(1.06)', opacity: 1, filter: 'none', offset: .95 },
    { transform: 'none', opacity: 1, filter: 'none' },
  ], { duration, easing: 'cubic-bezier(.4,0,.2,1)' });

  const t0 = performance.now();
  return new Promise(res => {
    let done = false;
    const finish = () => { if (done) return; done = true; onReveal?.(9999, C); cv.remove(); res(); };
    // frames pause while the window is hidden; the slide change must still complete
    setTimeout(finish, duration + 800);
    (function f(now) {
      if (done) return;
      const t = now - t0, u = Math.min(1, t / duration);
      frame(u, t / 1000);
      if (u < 1) requestAnimationFrame(f); else finish();
    })(t0);
  });
}
