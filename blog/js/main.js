/* "You don't need a special occasion." — blog interactions
   Proposed student campaign concept. No tracking, no network calls, nothing stored.
   Everything here is progressive enhancement: the page reads fine without it. */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     1. Reveal-on-scroll
  ------------------------------------------------------------------ */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------
     2. Gold thread (reading progress), solid header, day rail
  ------------------------------------------------------------------ */
  var thread = $('.thread');
  var header = $('.site-header');
  var hero = $('.hero');
  var rail = $('#rail');
  var railItems = rail ? $$('li', rail) : [];
  var moments = $$('.moment[data-day]');
  var weekCard = $('.week');
  var sunday = $('#sunday');
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.pageYOffset || doc.scrollTop || 0;
    var vh = window.innerHeight;
    var max = Math.max(1, doc.scrollHeight - vh);

    if (thread) thread.style.transform = 'scaleX(' + Math.min(1, Math.max(0, y / max)).toFixed(4) + ')';

    if (header && hero) {
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      header.classList.toggle('is-solid', y > heroBottom - 90);
    }

    if (rail && weekCard && sunday) {
      var start = weekCard.getBoundingClientRect().top;
      var end = sunday.getBoundingClientRect().bottom;
      var inStory = start < vh * 0.5 && end > vh * 0.5;
      rail.classList.toggle('is-off', !inStory);

      var active = -1;
      moments.forEach(function (m) {
        if (m.getBoundingClientRect().top <= vh * 0.55) active = parseInt(m.getAttribute('data-day'), 10);
      });
      railItems.forEach(function (li) {
        li.classList.toggle('on', parseInt(li.getAttribute('data-day'), 10) === active);
      });
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  /* ------------------------------------------------------------------
     3. Week module: show the line for each gold day on hover / focus
  ------------------------------------------------------------------ */
  var tip = $('#weekTip');
  if (tip) {
    var defaultTip = tip.textContent;
    $$('.day.on').forEach(function (d) {
      var text = d.getAttribute('data-tip') || defaultTip;
      var show = function () { tip.textContent = text; };
      var hide = function () { tip.textContent = defaultTip; };
      d.addEventListener('mouseenter', show);
      d.addEventListener('mouseleave', hide);
      d.addEventListener('focusin', show);
      d.addEventListener('focusout', hide);
    });
  }

  /* ------------------------------------------------------------------
     4. Product anatomy: hotspots <-> accordion stay in sync
  ------------------------------------------------------------------ */
  var spots = $$('#anatomy .hs');
  var layerBtns = $$('#layers button');
  function setLayer(i) {
    spots.forEach(function (s, n) { s.setAttribute('aria-pressed', n === i ? 'true' : 'false'); });
    layerBtns.forEach(function (b, n) { b.setAttribute('aria-expanded', n === i ? 'true' : 'false'); });
  }
  spots.forEach(function (s, i) { s.addEventListener('click', function () { setLayer(i); }); });
  layerBtns.forEach(function (b, i) { b.addEventListener('click', function () { setLayer(i); }); });

  /* ------------------------------------------------------------------
     5. Message generator ("Pick a Tuesday")
  ------------------------------------------------------------------ */
  var MESSAGES = {
    friend: {
      Tuesday:   "I'm downstairs :) Not for any reason. I was just nearby and I brought something small and gold.",
      Wednesday: "Midweek check-in: you've been on my mind. I've got something small with your name on it. Free for ten minutes?",
      Thursday:  "Thursday plot twist: I'm coming over with something small. No occasion. Just because you're you.",
      Sunday:    "Teh at mine tonight? I'll bring something small to share. One more story, then we'll call it a night."
    },
    colleague: {
      Tuesday:   "Thanks for covering me yesterday :) There's something small on your desk. No occasion, just thank you.",
      Wednesday: "Thanks for having my back this week. There's something small on your desk. Feel free to share it round.",
      Thursday:  "Almost Friday, and you've earned a little gold. It's on your desk. No reason. Okay, one reason: you're great to work with.",
      Sunday:    "Sunday note, no work talk: thank you for this week. I'll leave something small on your desk tomorrow."
    },
    family: {
      Tuesday:   "I'm coming by after work. Don't cook anything fancy: I'm bringing something small for everyone to share. Not a special day, just a Tuesday.",
      Wednesday: "Just checking in. Have you eaten? I'm dropping by with something small for everyone. No occasion, just a Wednesday.",
      Thursday:  "Thursday surprise: I'm bringing something small home tonight. Save me a seat at the table?",
      Sunday:    "Sunday teh at home later? I'll bring something small for everyone. No occasion, just family time."
    },
    missed: {
      Tuesday:   "It's a random Tuesday and I thought of you. Can I send you something small? It's been too long.",
      Wednesday: "Midweek thought: I miss you. Are you free this weekend? I'd love to bring something small and catch up properly.",
      Thursday:  "I caught myself smiling about something you said last time. Let's catch up soon. I'll bring something small.",
      Sunday:    "Sunday evenings make me think of you. Call tonight? I'll have my teh and something small. Tell me everything."
    }
  };

  var msgEl = $('#msg');
  var statusEl = $('#status');
  var copyBtn = $('#copy');
  var waBtn = $('#wa');
  var current = '';

  function checked(name) {
    var el = $('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }
  function waUrl(text) { return 'https://wa.me/?text=' + encodeURIComponent(text); }

  function render(animate) {
    var who = checked('who') || 'friend';
    var when = checked('when') || 'Tuesday';
    var text = (MESSAGES[who] && MESSAGES[who][when]) || MESSAGES.friend.Tuesday;
    current = text;
    if (waBtn) waBtn.setAttribute('href', waUrl(text));
    if (statusEl) statusEl.textContent = '';
    if (!msgEl) return;
    if (animate && !reduceMotion) {
      msgEl.classList.add('swap');
      window.setTimeout(function () { msgEl.textContent = text; msgEl.classList.remove('swap'); }, 180);
    } else {
      msgEl.textContent = text;
    }
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { onDone(true); }, function () { onDone(legacyCopy(text)); });
    } else {
      onDone(legacyCopy(text));
    }
  }

  $$('input[name="who"], input[name="when"]').forEach(function (r) {
    r.addEventListener('change', function () { render(true); });
  });
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyText(current, function (ok) {
        if (!statusEl) return;
        statusEl.textContent = ok
          ? 'Copied. Send it while it’s still a ' + (checked('when') || 'Tuesday') + '.'
          : 'Couldn’t copy automatically. Select the note above and copy it.';
      });
    });
  }
  render(false);

  /* ------------------------------------------------------------------
     6. Closing share row
  ------------------------------------------------------------------ */
  var copyLink = $('#copylink');
  var status2 = $('#status2');
  var wa2 = $('#wa2');
  var pageUrl = (location.protocol === 'file:') ? '' : location.href.split('#')[0];
  var shareText = 'You don’t need a special occasion. Share a little love.' + (pageUrl ? ' ' + pageUrl : '');
  if (wa2) wa2.setAttribute('href', waUrl(shareText));
  if (copyLink) {
    if (!pageUrl) {
      copyLink.textContent = 'Copy the headline';
    }
    copyLink.addEventListener('click', function () {
      copyText(pageUrl || shareText, function (ok) {
        if (!status2) return;
        status2.textContent = ok ? (pageUrl ? 'Link copied.' : 'Copied.') : 'Couldn’t copy automatically. Select the address bar and copy it.';
      });
    });
  }
})();
