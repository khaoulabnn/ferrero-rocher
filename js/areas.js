// Content areas for sections still being written. Each area is one required
// component from the assignment (content.js). Empty: a designed heading only.
// Filled: the heading plus the member's text (a string, or an array of points).
// Press E in rehearsal to outline the areas that are still empty.

export function area(name, text, i, extra = '') {
  const empty = !text || (Array.isArray(text) && !text.length);
  const body = empty ? '' : Array.isArray(text) ? `<ul>${text.map(t => `<li>${t}</li>`).join('')}</ul>` : `<p>${text}</p>`;
  return `<div class="ca${empty ? ' empty' : ''}" data-k="${name}" ${extra}>
    <span class="ca-no">0${i + 1}</span><h4>${name}</h4><div class="ca-body">${body}</div></div>`;
}

export function areas(section, opts = {}) {
  return Object.entries(section.components).map(([k, v], i) => area(k, v, i, opts.attr?.(k, i) || '')).join('');
}

// small animated cut-out of real people from the campaign footage:
// colour JPEG + alpha PNG per frame, played forwards and back so the loop never jumps
export class Cutout {
  constructor(canvas, dir, { frames = 48, fps = 12, w = 960, h = 540 } = {}) {
    Object.assign(this, { canvas, g: canvas.getContext('2d'), frames, fps, w, h, i: 0, d: 1, raf: 0, last: 0 });
    canvas.width = w; canvas.height = h;
    this.off = Object.assign(document.createElement('canvas'), { width: w, height: h });
    this.o = this.off.getContext('2d');
    this.c = []; this.m = [];
    for (let k = 0; k < frames; k++) {
      const n = String(k).padStart(3, '0');
      const a = new Image(); a.src = `${dir}/f${n}.jpg`; this.c.push(a);
      const b = new Image(); b.src = `${dir}/m${n}.png`; this.m.push(b);
    }
  }
  draw() {
    const { o, g, w, h } = this, a = this.c[this.i], b = this.m[this.i];
    if (!a.complete || !b.complete) return;
    o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, w, h); o.drawImage(a, 0, 0, w, h);
    o.globalCompositeOperation = 'destination-in'; o.drawImage(b, 0, 0, w, h);
    g.clearRect(0, 0, w, h); g.drawImage(this.off, 0, 0);
  }
  play() {
    const tick = now => {
      this.raf = requestAnimationFrame(tick);
      if (now - this.last < 1000 / this.fps) return;
      this.last = now;
      this.i += this.d;
      if (this.i >= this.frames - 1 || this.i <= 0) this.d *= -1;
      this.draw();
    };
    cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(tick);
  }
  stop() { cancelAnimationFrame(this.raf); }
}
