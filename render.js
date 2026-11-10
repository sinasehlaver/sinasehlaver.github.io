// Renders index.html from window.SITE (content.js). Must load after content.js + site-lib.js and before script.js.
// All content goes in through textContent / createElement; hrefs and img srcs pass SiteLib.safeUrl first.
(function (root, factory) {
  var api = factory(root.SiteLib || (typeof require === 'function' ? require('./site-lib.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.SiteRender = api; api.boot(root); }
})(typeof self !== 'undefined' ? self : this, function (Lib) {
  // Static UI strings (not in content.js). English is the key; `tr` is the Turkish table.
  var TR_UI = {
    'I build': 'İşim gücüm:', 'Repo ↗': 'Kod ↗', 'Live': 'Canlı', 'Details': 'Ayrıntılar',
    'Open channel': 'Kanalı aç', 'Opens {n} in a new page': '{n} yeni sekmede açılır',
    'Loads content from {n}': 'İçerik {n} üzerinden yüklenir', 'Loading {n}…': '{n} yükleniyor…',
    'Play {n} {k}': '{n} {k} oynat', 'reel': 'reel', 'post': 'gönderi', 'video': 'video',
    'Projects': 'Projeler', 'Beyond': 'İş Dışında', 'Experience': 'Deneyim', 'Tools': 'Araçlar', 'Contact': 'İletişim',
    'Primary': 'Ana gezinme', 'Toggle light/dark theme': 'Açık/koyu temayı değiştir', 'Language': 'Dil'
  };
  var LANG = 'en';
  function ui(lang, key, vars) {
    var t = lang === 'tr' && Object.prototype.hasOwnProperty.call(TR_UI, key) ? TR_UI[key] : key;
    return t.replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; });
  }
  function s(v) { return typeof v === 'string' ? v : (v == null ? '' : String(v)); }
  function a(v) { return Array.isArray(v) ? v : []; }
  function o(v) { return v && typeof v === 'object' ? v : {}; }

  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }
  // `code` spans -> <code>; everything else literal text.
  function inline(doc, parent, text) {
    s(text).split('`').forEach(function (part, i) {
      if (i % 2 === 1) { parent.appendChild(el(doc, 'code', '', part)); return; }
      // Line breaks (Enter in the editor) -> <br>; DOM APIs only.
      part.split(/\r?\n/).forEach(function (line, j) {
        if (j > 0) parent.appendChild(doc.createElement('br'));
        if (line) parent.appendChild(doc.createTextNode(line));
      });
    });
    return parent;
  }
  function anchor(doc, cls, href, external) {
    var safe = Lib.safeUrl(href);
    var n = el(doc, safe ? 'a' : 'span', cls);
    if (safe) { n.setAttribute('href', safe); if (/^https?:/i.test(safe)) n.setAttribute('rel', 'noopener'); }
    return n;
  }
  function heading(doc, sec, n, data) {
    var h = el(doc, 'h2', 'reveal'), em = el(doc, 'em', '', (n < 10 ? '0' : '') + n);
    h.appendChild(em); h.appendChild(doc.createTextNode(' ' + s(data.heading)));
    sec.appendChild(h);
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function q(doc, sel) { return doc.querySelector(sel); }

  function hero(doc, d, node) {
    clear(node);
    var h = o(d.hero), nm = o(h.name);
    var ey = el(doc, 'p', 'eyebrow reveal');
    ey.appendChild(el(doc, 'span', 'pulse')); ey.appendChild(doc.createTextNode(' ' + s(h.eyebrow)));
    node.appendChild(ey);
    var h1 = el(doc, 'h1', 'reveal');
    h1.appendChild(doc.createTextNode(s(nm.first) + ' '));
    h1.appendChild(el(doc, 'span', 'grad', s(nm.accent)));
    node.appendChild(h1);
    var role = el(doc, 'p', 'role reveal');
    var base = s(h.prefix).trim() || ui(LANG, 'I build');
    var ws = a(h.words).map(function (w) {
      var t = typeof w === 'string' ? w : s(o(w).text), p = typeof w === 'string' ? '' : s(o(w).prefix);
      return { t: t.trim(), p: p.trim() || base };
    }).filter(function (w) { return w.t; });
    var pre = el(doc, 'span', 'pre', (ws.length ? ws[0].p : base) + ' ');
    role.appendChild(pre);
    var typed = el(doc, 'span', 'typed');
    typed.setAttribute('data-words', ws.map(function (w) { return w.t; }).join('|') || ' ');
    typed.setAttribute('data-prefixes', ws.map(function (w) { return w.p; }).join('|') || base);
    role.appendChild(typed); role.appendChild(el(doc, 'span', 'caret'));
    node.appendChild(role);
    node.appendChild(inline(doc, el(doc, 'p', 'lead reveal'), h.lead));
    var cta = el(doc, 'div', 'cta reveal');
    a(h.ctas).forEach(function (c) {
      c = o(c);
      var b = anchor(doc, 'btn' + (c.style === 'primary' ? ' primary' : ''), c.href);
      b.textContent = s(c.label); cta.appendChild(b);
    });
    node.appendChild(cta);
    var dl = el(doc, 'dl', 'stats reveal');
    a(h.stats).forEach(function (st) {
      st = o(st);
      var box = el(doc, 'div'), dt = el(doc, 'dt'), c = el(doc, 'span', 'count', '0');
      var dec = Math.max(0, Math.min(4, parseInt(st.decimals, 10) || 0));
      c.setAttribute('data-to', String(Number(st.value) || 0));
      c.setAttribute('data-suffix', s(st.suffix));
      if (dec) c.setAttribute('data-dec', String(dec));
      dt.appendChild(c); box.appendChild(dt); box.appendChild(el(doc, 'dd', '', s(st.label)));
      dl.appendChild(box);
    });
    node.appendChild(dl);
  }

  function experience(doc, d, sec) {
    var x = o(d.experience);
    heading(doc, sec, 3, x);
    var ol = el(doc, 'ol', 'timeline compact');
    a(x.items).forEach(function (it) {
      it = o(it);
      var li = el(doc, 'li', 'reveal'), row = el(doc, 'div', 'row');
      row.appendChild(el(doc, 'h3', '', s(it.role) + (it.org ? ' · ' + s(it.org) : '')));
      row.appendChild(el(doc, 'time', '', s(it.period)));
      li.appendChild(row);
      if (it.sub) li.appendChild(el(doc, 'p', 'sub', s(it.sub)));
      var ul = el(doc, 'ul');
      a(it.bullets).forEach(function (b) { ul.appendChild(inline(doc, el(doc, 'li'), b)); });
      if (a(it.bullets).length) {
        var det = el(doc, 'details', 'more');
        det.appendChild(el(doc, 'summary', '', ui(LANG, 'Details')));
        det.appendChild(ul); li.appendChild(det);
      }
      ol.appendChild(li);
    });
    sec.appendChild(ol);
    var e = o(d.education);
    var ed = el(doc, 'p', 'edu reveal');
    ed.appendChild(el(doc, 'b', '', s(e.heading) + ': '));
    ed.appendChild(doc.createTextNode(a(e.items).map(function (it) { it = o(it); return s(it.title) + (it.sub ? ' (' + s(it.sub) + ')' : ''); }).join(' · ')));
    sec.appendChild(ed);
  }

  function projects(doc, d, sec) {
    var p = o(d.projects);
    heading(doc, sec, 1, p);
    var grid = el(doc, 'div', 'grid projects-grid');
    a(p.items).forEach(function (it) {
      it = o(it);
      var lv = o(it.live);
      var liveOk = /^https?:\/\//i.test(String(lv.href || '')) && Lib.safeUrl(lv.href);
      var c = liveOk ? el(doc, 'div', 'card reveal project') : anchor(doc, 'card link reveal project', it.url);
      if (c.tagName === 'SPAN') c = el(doc, 'div', 'card reveal project');
      var h = el(doc, 'h3', '', s(it.name));
      if (!liveOk && Lib.safeUrl(it.url)) { h.appendChild(doc.createTextNode(' ')); h.appendChild(el(doc, 'span', 'arrow', '↗')); }
      var psrc = Lib.safeImage(it.image);
      if (psrc && !/\.svg(\?|#|$)/i.test(psrc)) {
        var pim = el(doc, 'img', 'thumb');
        pim.setAttribute('src', psrc); pim.setAttribute('alt', s(it.imageAlt)); pim.setAttribute('loading', 'lazy');
        pim.setAttribute('width', '640'); pim.setAttribute('height', '360'); pim.setAttribute('decoding', 'async');
        c.className += ' has-thumb'; c.appendChild(pim);
      }
      c.appendChild(h);
      c.appendChild(inline(doc, el(doc, 'p'), it.description));
      if (liveOk) {
        var row = el(doc, 'div', 'cta');
        if (Lib.safeUrl(it.url)) { var rb = anchor(doc, 'btn small', it.url); rb.textContent = ui(LANG, 'Repo ↗'); row.appendChild(rb); }
        var lb = anchor(doc, 'btn small primary', lv.href); lb.textContent = (s(lv.label) || ui(LANG, 'Live')) + ' ↗'; row.appendChild(lb);
        c.appendChild(row);
      }
      grid.appendChild(c);
    });
    sec.appendChild(grid);
  }

  function skills(doc, d, sec) {
    var k = o(d.skills);
    heading(doc, sec, 4, k);
    var parts = a(k.groups).map(o).filter(function (g) { return g.label !== 'Languages'; })
      .reduce(function (acc, g) { return acc.concat(a(g.items).map(s)); }, []);
    sec.appendChild(el(doc, 'p', 'tools-line reveal', parts.join(' · ')));
    if (k.languages) sec.appendChild(el(doc, 'p', 'sub reveal', s(k.languages)));
  }

  // Facade only: nothing third-party loads until script.js turns the button into an iframe (when scrolled near the viewport; click is the fallback).
  function embed(doc, card, e) {
    e = o(e);
    var p = Lib.parseEmbed(e.provider, e.url);
    if (!p) return;
    var name = p.provider === 'youtube' ? 'YouTube' : 'Instagram';
    if (p.type === 'channel') {
      var ch = anchor(doc, 'embed-facade embed-' + p.provider + ' embed-channel', p.href);
      ch.appendChild(el(doc, 'span', 'embed-play', '\u2197'));
      ch.appendChild(el(doc, 'span', 'embed-label', ui(LANG, 'Open channel')));
      ch.appendChild(el(doc, 'small', 'embed-note', ui(LANG, 'Opens {n} in a new page', { n: name })));
      card.appendChild(ch);
      return;
    }
    var b = el(doc, 'button', 'embed-facade embed-' + p.provider + ' embed-' + p.type);
    b.setAttribute('type', 'button');
    b.setAttribute('data-embed-src', p.src);
    b.setAttribute('data-embed-provider', p.provider);
    b.setAttribute('aria-label', ui(LANG, 'Play {n} {k}', { n: name, k: ui(LANG, p.type === 'reel' ? 'reel' : p.type === 'post' ? 'post' : 'video') }));
    b.appendChild(el(doc, 'span', 'embed-play', '\u25B6'));
    b.appendChild(el(doc, 'span', 'embed-label', ui(LANG, 'Loading {n}…', { n: name })));
    b.appendChild(el(doc, 'small', 'embed-note', ui(LANG, 'Loads content from {n}', { n: p.provider === 'youtube' ? 'youtube-nocookie.com' : 'instagram.com' })));
    card.appendChild(b);
  }

  function beyond(doc, d, sec, opts) {
    var b = o(d.beyond);
    heading(doc, sec, 2, b);
    var grid = el(doc, 'div', 'grid');
    a(b.items).forEach(function (it) {
      it = o(it);
      var kind = Lib.KINDS.indexOf(it.kind) >= 0 ? it.kind : 'text';
      var c = el(doc, 'div', 'card reveal kind-' + kind + (kind === 'text' ? ' wide' : ''));
      var src = Lib.safeImage(it.image);
      var ov = opts && opts.imageOverrides;
      if (ov && typeof it.image === 'string' && Object.prototype.hasOwnProperty.call(ov, it.image) && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+\/=]+$/.test(ov[it.image])) src = ov[it.image];
      if (src && !/\.svg(\?|#|$)/i.test(src)) {
        var img = el(doc, 'img', 'thumb');
        img.setAttribute('src', src); img.setAttribute('alt', s(it.imageAlt)); img.setAttribute('loading', 'lazy');
        img.setAttribute('width', '640'); img.setAttribute('height', '360'); img.setAttribute('decoding', 'async');
        c.className += ' has-thumb';
        c.appendChild(img);
      }
      c.appendChild(el(doc, 'h3', '', s(it.title)));
      c.appendChild(inline(doc, el(doc, 'p'), it.text));
      var lk = o(it.link);
      if (lk.label && Lib.safeUrl(lk.href)) { var btn = anchor(doc, 'btn small', lk.href); btn.textContent = s(lk.label); c.appendChild(btn); }
      embed(doc, c, it.embed);
      grid.appendChild(c);
    });
    sec.appendChild(grid);
  }

  function contact(doc, d, sec) {
    var c = o(d.contact);
    heading(doc, sec, 5, c);
    var box = el(doc, 'div', 'contact reveal');
    box.appendChild(inline(doc, el(doc, 'p'), c.intro));
    var cta = el(doc, 'div', 'cta');
    a(c.links).forEach(function (l) {
      l = o(l);
      var b = anchor(doc, 'btn' + (l.style === 'primary' ? ' primary' : ''), l.href);
      b.textContent = s(l.label); cta.appendChild(b);
    });
    box.appendChild(cta); sec.appendChild(box);
  }

  // Render everything into `doc`. opts.imageOverrides: {"img/x.png": "data:image/png;base64,..."} (editor preview only).
  var PRESETS = ['orange', 'teal', 'violet', 'green', 'rose', 'blue'];
  function lum(hex) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(hex.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function inkFor(hex) { return lum(hex) > 0.35 ? '#111111' : '#ffffff'; }
  function darken(hex, k) { return '#' + [1, 3, 5].map(function (i) { var v = Math.round(parseInt(hex.substr(i, 2), 16) * k).toString(16); return v.length < 2 ? '0' + v : v; }).join(''); }
  // theme.preset -> data-accent (CSS blocks in style.css); theme.accent (#rrggbb) -> data-accent=custom + --accent-c vars (CSS derives the rest, so the light/dark toggle needs no re-apply).
  function applyTheme(doc, t) {
    var root = doc.documentElement; if (!root || !root.dataset) return;
    t = o(t);
    var custom = typeof t.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(t.accent) ? t.accent.toLowerCase() : '';
    var p = PRESETS.indexOf(t.preset) > 0 ? t.preset : '';
    var props = ['--accent-c', '--accent-ink-c', '--accent-ink-lc'];
    if (custom) {
      root.dataset.accent = 'custom';
      root.style.setProperty('--accent-c', custom);
      root.style.setProperty('--accent-ink-c', inkFor(custom));
      root.style.setProperty('--accent-ink-lc', inkFor(darken(custom, 0.78)));
    } else {
      props.forEach(function (k) { root.style.removeProperty(k); });
      if (p) root.dataset.accent = p; else delete root.dataset.accent;
    }
  }

  // Static shell strings: <html lang>, nav labels, aria-labels, language buttons.
  function chrome(doc, lang) {
    var root = doc.documentElement; if (root && root.setAttribute) root.setAttribute('lang', lang);
    var nav = q(doc, '.nav'); if (nav) nav.setAttribute('aria-label', ui(lang, 'Primary'));
    Array.prototype.forEach.call(doc.querySelectorAll ? doc.querySelectorAll('.nav-links a') : [], function (n) {
      var en = n.getAttribute('data-en') || n.textContent; n.setAttribute('data-en', en); n.textContent = ui(lang, en);
    });
    var th = q(doc, '.theme'); if (th) th.setAttribute('aria-label', ui(lang, 'Toggle light/dark theme'));
    var lg = q(doc, '.lang'); if (lg) lg.setAttribute('aria-label', ui(lang, 'Language'));
    Array.prototype.forEach.call(doc.querySelectorAll ? doc.querySelectorAll('.lang button') : [], function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
  }

  function renderAll(doc, d, opts) {
    LANG = opts && opts.lang === 'tr' ? 'tr' : 'en';
    d = Lib.localize(o(d), LANG);
    chrome(doc, LANG);
    applyTheme(doc, d.theme);
    var m = o(d.meta);
    if (m.title) doc.title = s(m.title);
    var md = q(doc, 'meta[name=description]');
    if (md) md.setAttribute('content', s(m.description));
    var map = [['#top', hero], ['#projects', projects], ['#beyond', beyond], ['#experience', experience], ['#skills', skills], ['#contact', contact]];
    map.forEach(function (r) {
      var n = q(doc, r[0]); if (!n) return;
      if (r[1] === hero) return hero(doc, d, n);
      clear(n); r[1](doc, d, n, opts);
    });
    var f = q(doc, 'footer');
    if (f) { clear(f); f.appendChild(el(doc, 'p', '', s(o(d.footer).text))); }
  }

  // Skip animations: used after live re-render in editor preview.
  function settle(doc) {
    Array.prototype.forEach.call(doc.querySelectorAll('.reveal'), function (n) { n.classList.add('in'); });
    Array.prototype.forEach.call(doc.querySelectorAll('.count'), function (n) {
      var dec = +(n.getAttribute('data-dec') || 0);
      n.textContent = (parseFloat(n.getAttribute('data-to')) || 0).toFixed(dec) + (n.getAttribute('data-suffix') || '');
    });
    var t = q(doc, '.typed');
    if (t) t.textContent = (t.getAttribute('data-words') || '').split('|')[0];
    Array.prototype.forEach.call(doc.querySelectorAll('.card'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px'); card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // ?lang=tr|en wins, then the saved choice, then English.
  function pickLang(win) {
    var m = /[?&]lang=(tr|en)(&|#|$)/.exec(win.location.search || ''), v = m ? m[1] : '';
    if (!v) { try { v = win.localStorage.getItem('lang'); } catch (e) { v = ''; } }
    return v === 'tr' ? 'tr' : 'en';
  }

  function boot(win) {
    var doc = win.document;
    if (!doc || !win.SITE) return;
    var preview = win.parent !== win && /[?&]preview(=|&|$)/.test(win.location.search);
    var lang = preview ? 'en' : pickLang(win);
    renderAll(doc, win.SITE, { lang: lang });
    // Editor preview: same page inside a sandboxed iframe, driven by postMessage (content is still rendered safely).
    if (win.parent !== win && /[?&]preview(=|&|$)/.test(win.location.search)) {
      doc.documentElement.classList.add('preview');
      doc.addEventListener('click', function (e) {   // keep the preview on this page; only in-page anchors work
        var l = e.target && e.target.closest && e.target.closest('a');
        if (l && (l.getAttribute('href') || '').charAt(0) !== '#') e.preventDefault();
      });
      win.addEventListener('message', function (ev) {
        var m = ev.data;
        if (!m || typeof m !== 'object') return;
        if (m.type === 'site:update' && m.data && typeof m.data === 'object') {
          var y = win.scrollY;
          renderAll(doc, m.data, { imageOverrides: m.images, lang: m.lang === 'tr' ? 'tr' : 'en' });
          settle(doc);
          win.scrollTo(0, y);
        } else if (m.type === 'site:theme') {
          doc.documentElement.dataset.theme = m.theme === 'light' ? 'light' : 'dark';
        } else if (m.type === 'site:scroll' && typeof m.id === 'string' && /^[a-z]+$/.test(m.id)) {
          var t = doc.getElementById(m.id); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      if (win.parent) win.parent.postMessage({ type: 'site:ready' }, '*');
    }
  }

  return { renderAll: renderAll, ui: ui, pickLang: pickLang, settle: settle, boot: boot, inline: inline };
});
