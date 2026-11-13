// Melted-chocolate transition (plain WebGL, no library, works offline).
// A glossy chocolate front pours down from the top edge with uneven drips, covers
// the screen, and — while it hides everything — the next scene is swapped in
// underneath. Then the chocolate slides away downwards, leaving streaks that
// thin out and reveal the new scene. Thickness drives the shading: a warm
// subsurface tone, soft diffuse light, a tight specular glint and a cream sheen.

const VS = `attribute vec2 p; varying vec2 uv; void main(){ uv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`;
const FS = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
varying vec2 uv;
uniform vec2 res;
uniform float pour, drain, time, seed, dir;
float h1(float n){ return fract(sin(n) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = h1(i.x + i.y * 57.), b = h1(i.x + 1. + i.y * 57.), c = h1(i.x + (i.y + 1.) * 57.), d = h1(i.x + 1. + (i.y + 1.) * 57.);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); }
// hanging drips: rounded tongues (flat-ish width, round end), blended into the
// sheet with a smooth maximum so each one swells out of the edge like real chocolate
float smax(float a, float b, float k){ float h = clamp(.5 + .5 * (a - b) / k, 0., 1.); return mix(b, a, h) + k * h * (1. - h); }
float drips(float x, float grow, float s){
  float d = 0.;
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float c = h1(fi * 3.17 + s), w = .011 + .026 * h1(fi * 7.71 + s), L = (.05 + .24 * h1(fi * 1.37 + s)) * grow;
    float u = clamp(abs(x - c) / w, 0., 1.);
    float tongue = L * pow(1. - u * u, .35) * (.8 + .2 * sin(time * 1.1 + fi));
    d = smax(d, tongue, .025);
  }
  return d;
}
float frontY(float x){ return pour * 1.55 - .35 + drips(x, .4 + pour, seed) + .018 * (n2(vec2(x * 9., time * .7)) - .5); }
float topY(float x){ return drain * 2.25 - .45 - drips(x, .2 + drain * 1.4, seed + 11.) * 1.3 + .02 * (n2(vec2(x * 7., time * .5 + 3.)) - .5); }
float thick(vec2 q){
  float a = frontY(q.x) - q.y, b = q.y - topY(q.x);
  float t = smoothstep(0., .05, a) * smoothstep(0., .07, b);
  // slow flowing swells inside the sheet
  float flow = n2(vec2(q.x * 5., q.y * 2.2 - time * 1.1)) * .45 + n2(vec2(q.x * 13., q.y * 5. - time * 1.8)) * .14;
  return t * (.62 + flow) + smoothstep(.012, 0., abs(a)) * .18;
}
void main(){
  vec2 q = vec2(dir > 0. ? uv.x : 1. - uv.x, uv.y);
  float a = frontY(q.x) - q.y, b = q.y - topY(q.x);
  float fa = fwidth(a) * .9 + .0004, fb = fwidth(b) * .9 + .0004;
  float cover = smoothstep(-fa, fa, a) * smoothstep(-fb, fb, b);
  // soft contact shadow just below the pouring edge
  float shade = (1. - smoothstep(0., .045, -a)) * step(a, 0.) * (1. - drain) * .28;
  if (cover < .002) { gl_FragColor = vec4(.12, .06, .02, shade); return; }
  float e = 2. / res.y;
  float h = thick(q);
  float k = .022 / (2. * e);
  vec3 n = normalize(vec3((thick(q - vec2(e, 0.)) - thick(q + vec2(e, 0.))) * k, (thick(q - vec2(0., e)) - thick(q + vec2(0., e))) * k, 1.));
  vec3 L = normalize(vec3(-.45, -.62, .65)), V = vec3(0., 0., 1.), H = normalize(L + V);
  vec3 deep = vec3(.17, .075, .03), warm = vec3(.42, .2, .085);
  vec3 col = mix(deep, warm, clamp(h * .9, 0., 1.));
  col *= .55 + .55 * max(dot(n, L), 0.);
  float spec = pow(max(dot(n, H), 0.), 90.) * 1.1 + pow(max(dot(n, H), 0.), 14.) * .14;
  float fres = pow(1. - max(n.z, 0.), 2.5);
  col += vec3(1., .9, .76) * spec + vec3(.96, .82, .62) * fres * .35;
  // broad studio sheen sliding across the surface
  float band = exp(-pow((q.x * .8 + q.y * .55 - .45 - time * .05) * 5., 2.));
  col += vec3(.95, .78, .55) * band * (.07 + .1 * h) * (.6 + .4 * n.z);
  gl_FragColor = vec4(col, cover);
}`;

export function chocolateMelt(layer, opts = {}) {
  const { onCovered, duration = 2600, dir = 1 } = opts;
  const cv = document.createElement('canvas');
  cv.className = 'tx-canvas melt';
  layer.append(cv);
  const gl = cv.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: true });
  if (!gl) { onCovered?.(); cv.remove(); return Promise.resolve(); }
  gl.getExtension('OES_standard_derivatives');
  const W = Math.round(1920 * Math.min(1, devicePixelRatio * .75)), H = Math.round(W * 1080 / 1920);
  cv.width = W; cv.height = H;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  gl.uniform2f(U('res'), W, H); gl.uniform1f(U('seed'), Math.random() * 50); gl.uniform1f(U('dir'), dir);
  gl.viewport(0, 0, W, H);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  if (opts.still) {
    const { pour, drain, time } = opts.still;
    gl.uniform1f(U('pour'), pour); gl.uniform1f(U('drain'), drain); gl.uniform1f(U('time'), time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return Promise.resolve(cv);
  }
  const t0 = performance.now(), POUR = duration * .46, HOLD = duration * .06;
  let swapped = false;
  const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  return new Promise(res => {
    (function f(now) {
      const t = now - t0;
      const pour = ease(Math.min(1, t / POUR));
      const drain = ease(Math.max(0, Math.min(1, (t - POUR - HOLD) / (duration - POUR - HOLD))));
      if (!swapped && t >= POUR) { swapped = true; onCovered?.(); }
      gl.uniform1f(U('pour'), pour); gl.uniform1f(U('drain'), drain); gl.uniform1f(U('time'), t / 1000);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (t < duration) requestAnimationFrame(f);
      else { cv.remove(); res(); }
    })(t0);
  });
}
