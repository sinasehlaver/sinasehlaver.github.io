(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // theme toggle
  $('.theme').addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // language switch: store the choice, drop any ?lang= override, reload (render.js renders in that language)
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang') === 'tr' ? 'tr' : 'en';
      try { localStorage.setItem('lang', l); } catch (e) {}
      location.href = location.pathname + location.hash;
    });
  });

  // scroll progress + nav state
  var bar = $('.progress'), nav = $('.nav');
  function onScroll() {
    var h = document.documentElement;
    var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    bar.style.transform = 'scaleX(' + p + ')';
    nav.classList.toggle('scrolled', h.scrollTop > 8);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // scroll reveal (staggered by sibling index)
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = ((i % 4) * 70) + 'ms';
    if (reduce) el.classList.add('in'); else io.observe(el);
  });

  // count-up stats
  function count(el) {
    var to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    var t0 = performance.now(), d = 1400;
    (function step(t) {
      var k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      el.textContent = (to * e).toFixed(dec) + (k === 1 ? suf : '');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
  });
  $$('.count').forEach(function (el) { cio.observe(el); });

  // typed role line
  var typed = $('.typed'), words = typed.dataset.words.split('|');
  var pre = $('.role .pre'), prefixes = (typed.dataset.prefixes || '').split('|');
  function setPre(i) { if (pre && prefixes[i]) pre.textContent = prefixes[i] + ' '; }
  if (reduce) { typed.textContent = words[0]; setPre(0); }
  else {
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      c += del ? -1 : 1;
      typed.textContent = word.slice(0, c);
      var wait = del ? 28 : 65;
      if (!del && c === word.length) { del = true; wait = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; setPre(w); wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  // embeds: the thumbnail's play button is swapped in place for the player (click only, nothing third-party loads before), only for the two allowed hosts
  var EMBED_OK = /^https:\/\/(www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}|www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]{5,30}\/embed\/)$/;
  function load(b) {
    if (!b.isConnected) return;
    var src = b.getAttribute('data-embed-src') || '';
    if (!EMBED_OK.test(src)) return;
    var frame = b.closest('.vframe');
    if (!frame || frame.querySelector('iframe')) return;
    var ig = b.getAttribute('data-embed-provider') === 'instagram';
    var f = document.createElement('iframe');
    f.className = 'embed-frame';
    // the click is the visitor's play: YouTube autoplays (Instagram's embed has no such switch)
    f.setAttribute('src', ig ? src : src + '?autoplay=1&rel=0');
    f.setAttribute('title', b.getAttribute('aria-label') || 'Embedded content');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('allow', ig ? 'encrypted-media; fullscreen' : 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    frame.classList.add('playing');
    frame.replaceChildren(f);
  }
  // a missing self-hosted thumbnail falls back to the gradient placeholder
  function noThumb(im) { var fr = im.closest('.vframe'); if (fr) fr.classList.add('no-thumb'); im.parentNode.removeChild(im); }
  document.addEventListener('error', function (e) { var t = e.target; if (t && t.classList && t.classList.contains('vthumb')) noThumb(t); }, true);
  $$('img.vthumb').forEach(function (im) { if (im.complete && !im.naturalWidth) noThumb(im); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.embed-btn');
    if (b) load(b);
  });

  // cursor spotlight on cards
  $$('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
