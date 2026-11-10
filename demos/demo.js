// Shared demo/tutorial page. Each demos/<slug>/ has: index.html (shell), tour.js (window.DEMO data),
// mock.js (DemoKit.mock(fn): an interactive fake of the app with fake data). Load order:
// ../../theme.js (head), tour.js, ../demo.js, mock.js. Renders on DOMContentLoaded. DOM APIs only (CSP; no HTML strings).
(function () {
  'use strict';
  var D = window.DEMO || {};
  var mockFn = null;

  function h(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : String(v));
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  // Only https GitHub links and relative paths are linked.
  function safeHref(u) {
    u = String(u || '');
    if (/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(u)) return u;
    if (/^(\.\.\/|\.\/)?[\w./-]*$/.test(u) && u.indexOf('//') < 0) return u;
    return null;
  }
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = h('div', { class: 'd-toast', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  }

  window.DemoKit = { h: h, toast: toast, reduced: reduced, mock: function (fn) { mockFn = fn; } };

  function render() {
    var root = document.getElementById('demo');
    if (!root) return;
    var repo = safeHref(D.repo);
    var tasks = Array.isArray(D.tasks) ? D.tasks : [];
    document.title = (D.name || 'Demo') + ' · demo';

    // nav
    var nav = document.querySelector('.d-nav');
    if (nav && repo) nav.insertBefore(h('a', { href: repo, rel: 'noopener' }, 'GitHub ↗'), nav.querySelector('.theme'));
    var themeBtn = document.querySelector('.theme');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });

    // hero
    root.appendChild(h('header', { class: 'd-hero' },
      h('div', { class: 'd-eyebrow' }, 'Interactive demo'),
      h('h1', null, D.name || ''),
      h('p', { class: 'tag' }, D.tagline || ''),
      D.intro ? h('p', { class: 'intro' }, D.intro) : null,
      h('div', { class: 'd-ctas' },
        h('a', { class: 'btn primary', href: '#try' }, 'Try it here'),
        repo ? h('a', { class: 'btn', href: repo, rel: 'noopener' }, 'View on GitHub ↗') : null)));

    // tutorial
    var done = {};
    var items = tasks.map(function (t, i) {
      return h('li', { 'data-id': t.id },
        h('span', { class: 'n' }, String(i + 1)),
        h('div', null, h('div', null, t.text), t.hint ? h('div', { class: 'hint' }, t.hint) : null));
    });
    var count = h('small'), bar = h('i'), finish = h('div', { class: 'd-finish', hidden: true },
      D.finish || 'That is the whole loop.', h('br'),
      repo ? h('a', { class: 'btn primary small', href: repo, rel: 'noopener' }, 'Get it on GitHub ↗') : null);
    var stageBody = h('div', { class: 'd-mock' });
    var api = {
      done: function (id) {
        if (done[id] || !tasks.some(function (t) { return t.id === id; })) return;
        done[id] = true;
        var t = tasks.filter(function (x) { return x.id === id; })[0];
        if (t.ok) toast(t.ok);
        paint();
      },
      isDone: function (id) { return !!done[id]; },
      current: function () { var t = tasks.filter(function (x) { return !done[x.id]; })[0]; return t ? t.id : null; },
      toast: toast, h: h, reduced: reduced
    };
    var cleanup = null;
    function mount() {
      if (typeof cleanup === 'function') cleanup();
      while (stageBody.firstChild) stageBody.removeChild(stageBody.firstChild);
      cleanup = mockFn ? mockFn(stageBody, api) : null;
    }
    function paint() {
      var n = 0, cur = api.current();
      items.forEach(function (li) {
        var id = li.getAttribute('data-id');
        li.classList.toggle('done', !!done[id]);
        li.classList.toggle('cur', id === cur);
        if (done[id]) n++;
      });
      count.textContent = n + ' / ' + tasks.length;
      bar.style.width = (tasks.length ? 100 * n / tasks.length : 0) + '%';
      finish.hidden = !(tasks.length && n === tasks.length);
      var hot = stageBody.querySelectorAll('.d-pulse');
      for (var i = 0; i < hot.length; i++) hot[i].classList.remove('d-pulse');
      var target = cur && stageBody.querySelector('[data-step~="' + cur + '"]');
      if (target) target.classList.add('d-pulse');
    }
    api.repaint = paint;
    var reset = h('button', { type: 'button', class: 'd-reset', onclick: function () { done = {}; mount(); paint(); toast('Demo reset.'); } }, 'Start over');
    root.appendChild(h('section', { class: 'd-sec', id: 'try' },
      h('h2', null, D.tryTitle || 'Try it'),
      h('p', { class: 'lede' }, D.tryLede || 'A mock with fake data, running only in your browser. Nothing is saved or sent.'),
      h('div', { class: 'd-try' },
        h('aside', { class: 'd-steps', 'aria-label': 'Tutorial steps' },
          h('h3', null, 'Tutorial', count), h('div', { class: 'd-bar' }, bar), h('ol', null, items), finish, reset),
        h('div', { class: 'd-stage' },
          h('div', { class: 'd-stage-bar', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'), h('span', null, D.stageTitle || D.name || '')),
          stageBody))));
    mount();
    paint();

    // how it works
    if (Array.isArray(D.how) && D.how.length) {
      root.appendChild(h('section', { class: 'd-sec', id: 'how' },
        h('h2', null, 'How it works'),
        D.howLede ? h('p', { class: 'lede' }, D.howLede) : null,
        h('div', { class: 'd-how' }, D.how.map(function (c, i) {
          return h('div', { class: 'card' }, h('div', { class: 'n' }, String(i + 1).padStart(2, '0')), h('h3', null, c.title), h('p', null, c.text));
        }))));
    }
    // real screenshot
    if (D.shot && /^(\.\.\/)*img\/[\w.-]+\.png$/.test(D.shot.src || '')) {
      root.appendChild(h('section', { class: 'd-sec', id: 'real' },
        h('h2', null, 'The real thing'),
        h('figure', { class: 'd-shot' },
          h('img', { src: D.shot.src, alt: D.shot.alt || '', width: 960, height: 540, loading: 'lazy' }),
          D.shot.caption ? h('figcaption', null, D.shot.caption) : null)));
    }
    root.appendChild(h('section', { class: 'd-end' },
      h('h2', null, D.endTitle || 'Run it yourself'),
      D.endText ? h('p', null, D.endText) : null,
      h('div', { class: 'd-ctas' },
        repo ? h('a', { class: 'btn primary', href: repo, rel: 'noopener' }, 'View on GitHub ↗') : null,
        h('a', { class: 'btn', href: '../../index.html#projects' }, '← More projects'))));
    var ctas = root.querySelector('.d-end .d-ctas');
    if (ctas) ctas.style.justifyContent = 'center';
    root.appendChild(h('footer', { class: 'd-foot' }, '© 2026 Sina Şehlaver · Built with Claude Code'));
  }
  document.addEventListener('DOMContentLoaded', render);
})();
