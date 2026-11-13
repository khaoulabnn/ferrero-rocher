// Scene 5 — the real blog and newsletter running live inside the stage.
// Device buttons change the real viewport width, so the page's own responsive
// CSS reflows; tour buttons scroll the real page to its key moments.

const BLOG_TOUR = [
  ['top', 'Opening', 'Hero and the argument'],
  ['week-h', 'The Gold Dot Week', 'Pick a gold day'],
  ['anatomy', 'The golden gesture', 'Product, layer by layer'],
  ['turn', 'Pick a Tuesday', 'The interactive message tool'],
];
const MAIL_TOUR = [[0, 'Opening', 'Subject and hero'], [.35, 'The story', 'Three ordinary moments'], [.75, 'Call to action', 'Share a little love']];

let inst;
export function create(el, ctx) { return inst ??= build(el, ctx); }

function build(el, ctx) {
  const win = el.querySelector('.w-win'), frame = el.querySelector('.w-frame');
  const tour = el.querySelector('.w-tour'), title = el.querySelector('.w-title');
  let mode = 'blog';

  function setMode(m) {
    mode = m;
    el.classList.toggle('mail', m === 'mail');
    el.querySelectorAll('.w-mode button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
    frame.src = m === 'blog' ? 'blog/index.html' : 'newsletter/ferrero-rocher-newsletter.html';
    title.textContent = m === 'blog' ? 'You Don’t Need a Special Occasion to Make Someone Feel Special' : 'A Little Love, Just Because';
    const items = m === 'blog' ? BLOG_TOUR : MAIL_TOUR;
    tour.innerHTML = `<p>Guided tour</p>` + items.map(([k, h, s]) => `<button data-k="${k}">${h}<small>${s}</small></button>`).join('');
    tour.querySelectorAll('button').forEach(b => b.onclick = () => go(b));
  }
  function go(b) {
    tour.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    const w = frame.contentWindow, d = frame.contentDocument;
    if (!w || !d) return;
    const k = b.dataset.k;
    if (mode === 'blog') {
      const t = d.getElementById(k);
      if (t) w.scrollTo({ top: k === 'top' ? 0 : t.getBoundingClientRect().top + w.scrollY - 70, behavior: 'smooth' });
    } else {
      w.scrollTo({ top: (d.documentElement.scrollHeight - w.innerHeight) * +k, behavior: 'smooth' });
    }
  }
  function setDev(dv) {
    win.classList.remove('tablet', 'mobile');
    if (dv !== 'desktop') win.classList.add(dv);
    el.querySelectorAll('.w-dev button').forEach(b => b.classList.toggle('on', b.dataset.dev === dv));
  }
  // keep the presenter's arrow keys working while the page has focus
  frame.addEventListener('load', () => {
    try {
      // the blog supports a light/dark switch; pin its own light theme so a laptop in dark mode can't flip it
      frame.contentDocument.documentElement.dataset.theme = 'light';
      frame.contentWindow.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') parent.postMessage('lab:next', '*');
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') parent.postMessage('lab:prev', '*');
      });
    } catch { /* cross-origin: not the case for local files */ }
  });

  el.querySelectorAll('.w-mode button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  el.querySelectorAll('.w-dev button').forEach(b => b.onclick = () => setDev(b.dataset.dev));
  el.querySelector('.w-mail').onclick = () => frame.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' });

  return {
    enter() { if (frame.getAttribute('src') === 'about:blank') setMode('blog'); },
    leave() {},
    windowRect() { return ctx.rect(win); },
  };
}
