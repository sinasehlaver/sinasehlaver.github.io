// Renders index.html from window.SITE (content.js). Must load after content.js + site-lib.js and before script.js.
// All content goes in through textContent / createElement; hrefs and img srcs pass SiteLib.safeUrl first.
(function (root, factory) {
  var api = factory(root.SiteLib || (typeof require === 'function' ? require('./site-lib.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.SiteRender = api; api.boot(root); }
})(typeof self !== 'undefined' ? self : this, function (Lib) {
  // Static UI strings (not in content.js). English is the key; `tr` is the Turkish table.
  var TR_UI = {
    'I build': 'İşim gücüm:', 'Repo ↗': 'Kod ↗', 'Collapse projects': 'Projeleri daralt', 'Expand projects': 'Projeleri aç', 'Projects': 'Projeler', 'Previous': 'Önceki', 'Next': 'Sonraki', 'Live': 'Canlı', 'Play': 'Oynat', 'Watch on Instagram': 'Instagram\'da izle',
    'Open channel': 'Kanalı aç', 'Open on {n}': '{n} üzerinde aç', 'Opens {n} in a new page': '{n} yeni sekmede açılır',
    'Play {n}': '{n} oynat', 'Play {n} {k}': '{n} {k} oynat', 'reel': 'reel', 'post': 'gönderi', 'video': 'video',
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
    var h = el(doc, 'h2', 'reveal', s(data.heading));
    sec.appendChild(h);
  }
  function setHidden(n, on) {
    if (on) n.setAttribute('hidden', '');
    else if (n.removeAttribute) n.removeAttribute('hidden');
  }
  function navHide(doc, href, off) {
    Array.prototype.forEach.call(doc.querySelectorAll ? doc.querySelectorAll('.nav-links a[href="' + href + '"]') : [], function (l) { setHidden(l, off); });
  }
  // #education shell: created right after #experience when an older index.html lacks it; else falls back to #experience.
  function sectionShell(doc, id, after) {
    var n = q(doc, '#' + id);
    if (n || !after || !after.parentNode || !after.parentNode.insertBefore) return n || after;
    n = doc.createElement('section'); n.id = id;
    after.parentNode.insertBefore(n, after.nextSibling);
    return n;
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
    if (x.hidden === true) return;
    heading(doc, sec, 3, x);
    var ol = el(doc, 'ol', 'timeline compact');
    a(x.items).forEach(function (it) {
      it = o(it);
      var li = el(doc, 'li', 'reveal'), row = el(doc, 'div', 'row');
      row.appendChild(el(doc, 'h3', '', s(it.role) + (it.org ? ' · ' + s(it.org) : '')));
      row.appendChild(el(doc, 'time', '', s(it.period)));
      li.appendChild(row);
      if (it.sub) li.appendChild(el(doc, 'p', 'sub', s(it.sub)));
      if (a(it.bullets).length) {
        var ul = el(doc, 'ul', 'bullets');
        a(it.bullets).forEach(function (b) { ul.appendChild(inline(doc, el(doc, 'li'), b)); });
        li.appendChild(ul);
      }
      entrySkills(doc, li, it.skills);
      ol.appendChild(li);
    });
    sec.appendChild(ol);
  }
  function entrySkills(doc, li, list) {
    var items = a(list).map(s).filter(function (x) { return x.trim(); });
    if (!items.length) return;
    var row = el(doc, 'div', 'chips entry-skills');
    items.forEach(function (x) { row.appendChild(el(doc, 'span', '', x)); });
    li.appendChild(row);
  }
  function education(doc, d, sec, opts, under) {   // under = legacy: rendered inside #experience
    var e = o(d.education);
    if (e.hidden === true) return;
    sec.appendChild(el(doc, 'h2', under ? 'edu-h reveal' : 'reveal', s(e.heading)));
    var eul = el(doc, 'ul', 'edu-list');
    a(e.items).forEach(function (it) {
      it = o(it);
      var li = el(doc, 'li', 'reveal');
      li.appendChild(el(doc, 'h4', '', s(it.title)));
      if (it.sub) li.appendChild(el(doc, 'p', 'sub', s(it.sub)));
      if (it.text) li.appendChild(el(doc, 'p', 'edu-text', s(it.text)));
      entrySkills(doc, li, it.skills);
      eul.appendChild(li);
    });
    sec.appendChild(slider(doc, sec, eul, under ? '' : Lib.layoutOf(d, 'education'), s(e.heading) || 'Education'));
    thesis(doc, e.thesis, sec);
  }

  function thesis(doc, th, sec) {
    th = o(th);
    if (!s(th.title) && !s(th.text)) return;
    var card = el(doc, 'article', 'thesis reveal');
    if (s(th.label)) card.appendChild(el(doc, 'p', 'thesis-label', s(th.label)));
    card.appendChild(el(doc, 'h3', 'thesis-title', s(th.title)));
    var body = el(doc, 'div', 'thesis-body');
    if (s(th.text)) body.appendChild(inline(doc, el(doc, 'p', 'thesis-text'), th.text));
    var pts = a(th.points).filter(function (x) { return s(x); });
    if (pts.length) {
      var ul = el(doc, 'ul', 'thesis-points');
      pts.forEach(function (x) { ul.appendChild(el(doc, 'li', '', s(x))); });
      body.appendChild(ul);
    }
    card.appendChild(body);
    var figs = a(th.figures).slice(0, 3).filter(function (f) { f = o(f); var src = Lib.safeImage(f.image); return src && !/\.svg(\?|#|$)/i.test(src); });
    if (figs.length) {
      var strip = el(doc, 'div', 'thesis-figs');
      figs.forEach(function (f) {
        f = o(f);
        var fig = el(doc, 'figure', 'thesis-fig');
        var im = el(doc, 'img', 'thesis-img');
        im.setAttribute('src', Lib.safeImage(f.image)); im.setAttribute('alt', s(f.alt)); im.setAttribute('loading', 'lazy'); im.setAttribute('decoding', 'async');
        fig.appendChild(im);
        if (s(f.caption)) fig.appendChild(el(doc, 'figcaption', '', s(f.caption)));
        strip.appendChild(fig);
      });
      card.appendChild(strip);
    }
    var lk = o(th.link);
    if (lk.href && Lib.safeUrl(lk.href)) {
      var l = anchor(doc, 'btn small thesis-link', lk.href); l.textContent = (s(lk.label) || 'Read it') + ' ↗';
      card.appendChild(l);
    }
    sec.appendChild(card);
  }

  function projects(doc, d, sec) {
    var p = o(d.projects);
    heading(doc, sec, 1, p);
    var lay = Lib.layoutOf(d, 'projects');
    if (lay === 'pane') paneToggle(doc, sec, p);
    var grid = el(doc, 'div', 'grid projects-grid');
    a(p.items).forEach(function (it) { grid.appendChild(projectCard(doc, it)); });
    sec.appendChild(slider(doc, sec, grid, lay, s(p.heading) || ui(LANG, 'Projects')));
  }
  // layout "slider": the card grid becomes one horizontal, keyboard-scrollable row with ‹ › buttons (script.js scrolls it),
  // wrapped in a .slide-stage that casts a soft shadow at a cut edge (CSS + script.js cut-start/cut-end). Returns the node to append.
  function slider(doc, sec, track, lay, name) {
    if (lay !== 'slider') return track;
    track.className += ' slide-track';
    track.setAttribute('tabindex', '0'); track.setAttribute('role', 'region'); track.setAttribute('aria-label', name);
    var nav = el(doc, 'div', 'slide-nav');
    [['prev', 'Previous', '‹'], ['next', 'Next', '›']].forEach(function (b) {
      var bt = el(doc, 'button', 'slide-btn slide-' + b[0], b[2]);
      bt.setAttribute('type', 'button'); bt.setAttribute('data-dir', b[0] === 'prev' ? '-1' : '1');
      bt.setAttribute('aria-label', ui(LANG, b[1])); bt.setAttribute('title', ui(LANG, b[1]));
      nav.appendChild(bt);
    });
    sec.appendChild(nav);
    var stage = el(doc, 'div', 'slide-stage');
    stage.appendChild(track);
    return stage;
  }
  function paneToggle(doc, sec, p) {
    // Right-side pane toggle (wide screens only; CSS hides it below 1200px). script.js owns the state.
    var tg = el(doc, 'button', 'ppane-toggle');
    tg.setAttribute('type', 'button'); tg.setAttribute('aria-controls', 'projects'); tg.setAttribute('aria-expanded', 'true');
    tg.setAttribute('data-l-close', ui(LANG, 'Collapse projects')); tg.setAttribute('data-l-open', ui(LANG, 'Expand projects'));
    tg.setAttribute('aria-label', ui(LANG, 'Collapse projects')); tg.setAttribute('title', ui(LANG, 'Collapse projects'));
    tg.appendChild(el(doc, 'span', 'ppane-label', s(p.heading) || ui(LANG, 'Projects')));
    sec.appendChild(tg);
  }
  function projectCard(doc, it) {
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
      return c;
  }

  function skills(doc, d, sec) {
    var k = o(d.skills);
    heading(doc, sec, 4, k);
    a(k.groups).map(o).filter(function (g) { return g.label !== 'Languages'; }).forEach(function (g) {
      var row = el(doc, 'div', 'chips reveal');
      row.appendChild(el(doc, 'b', '', s(g.label)));
      a(g.items).forEach(function (t) { row.appendChild(el(doc, 'span', '', s(t))); });
      sec.appendChild(row);
    });
    if (k.languages) sec.appendChild(el(doc, 'p', 'sub reveal', s(k.languages)));
  }

  // Thumbnail + play button (a real <button>): nothing third-party loads until the visitor clicks it; script.js then swaps in the iframe (DOM APIs, EMBED_OK allowlist).
  // Thumbnails are self-hosted (CSP img-src 'self'): YouTube and Instagram default to img/thumb-<id>.jpg (scripts/fetch-thumbs.mjs); script.js hides a missing image and the gradient placeholder shows.
  function embed(doc, card, act, e, title) {
    e = o(e);
    var p = Lib.parseEmbed(e.provider, e.url);
    if (!p) {
      var lk = Lib.embedLink(e.provider, e.url);
      if (lk) { var ol = anchor(doc, 'btn small embed-btn embed-link', lk.href); ol.textContent = ui(LANG, 'Open on {n}', { n: lk.provider === 'youtube' ? 'YouTube' : 'Instagram' }) + ' \u2197'; act.appendChild(ol); }
      return;
    }
    var name = p.provider === 'youtube' ? 'YouTube' : 'Instagram';
    if (p.type === 'channel') {
      var ch = anchor(doc, 'btn small embed-btn embed-channel', p.href);
      ch.textContent = ui(LANG, 'Open channel') + ' \u2197';
      act.appendChild(ch);
      return;
    }
    var thumb = Lib.isSiteImagePath(e.thumb) ? e.thumb : (p.id && /^[\w-]+$/.test(p.id) ? 'img/thumb-' + p.id + '.jpg' : '');
    var fig = el(doc, 'div', 'vframe vframe-' + p.provider + (thumb ? '' : ' no-thumb'));
    var b = el(doc, 'button', 'vplay embed-btn embed-' + p.provider);
    b.setAttribute('type', 'button');
    b.setAttribute('data-embed-src', p.src);
    b.setAttribute('data-embed-provider', p.provider);
    b.setAttribute('aria-label', ui(LANG, 'Play {n}', { n: s(title) || name }));
    if (thumb) {
      var im = el(doc, 'img', 'vthumb');
      im.setAttribute('src', thumb);
      im.setAttribute('alt', s(e.thumbAlt));
      im.setAttribute('loading', 'lazy');
      im.setAttribute('decoding', 'async');
      b.appendChild(im);
    }
    b.appendChild(el(doc, 'span', 'vbadge', name));
    var pl = el(doc, 'span', 'vicon');
    pl.setAttribute('aria-hidden', 'true');
    b.appendChild(pl);
    fig.appendChild(b);
    card.appendChild(fig);
  }

  function beyond(doc, d, sec) {
    var b = o(d.beyond);
    heading(doc, sec, 2, b);
    // Fixed rows: wide cards take a full row, the rest pair up 2 per row (CSS stacks them below 760px; never 3 per row).
    var grid = el(doc, 'div', 'grid beyond-grid');
    a(b.items).forEach(function (it) {
      it = o(it);
      var kind = Lib.KINDS.indexOf(it.kind) >= 0 ? it.kind : 'text';
      var c = el(doc, 'div', 'card reveal kind-' + kind + (kind === 'text' || it.wide === true ? ' wide' : ''));
      c.appendChild(el(doc, 'h3', '', s(it.title)));
      c.appendChild(inline(doc, el(doc, 'p'), it.text));
      if (Lib.isSiteImagePath(it.image)) {
        var ph = el(doc, 'img', 'bphoto');
        ph.setAttribute('src', it.image); ph.setAttribute('alt', s(it.imageAlt)); ph.setAttribute('loading', 'lazy'); ph.setAttribute('decoding', 'async');
        c.appendChild(ph);
      }
      var lk = o(it.link);
      var act = el(doc, 'div', 'cta card-actions');
      if (lk.label && Lib.safeUrl(lk.href)) { var btn = anchor(doc, 'btn small', lk.href); btn.textContent = s(lk.label); act.appendChild(btn); }
      embed(doc, c, act, it.embed, it.title);
      var ems = a(it.embeds).map(o).filter(function (e) { return Lib.parseEmbed(e.provider, e.url) || Lib.embedLink(e.provider, e.url) || (o(e.link).label && Lib.safeUrl(o(e.link).href)); });
      if (ems.length) {
        var row = el(doc, 'div', 'media-row media-' + Math.min(ems.length, 2));
        ems.forEach(function (e) {
          var col = el(doc, 'div', 'media'), cact = el(doc, 'div', 'cta card-actions');
          embed(doc, col, cact, e, it.title);
          var el2 = o(e.link);
          if (el2.label && Lib.safeUrl(el2.href)) { var cb = anchor(doc, 'btn small', el2.href); cb.textContent = s(el2.label); cact.appendChild(cb); }
          if (cact.firstChild) col.appendChild(cact);
          row.appendChild(col);
        });
        c.appendChild(row);
      }
      if (act.firstChild) c.appendChild(act);
      grid.appendChild(c);
    });
    sec.appendChild(slider(doc, sec, grid, Lib.layoutOf(d, 'beyond'), s(b.heading) || ui(LANG, 'Beyond')));
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
  var FONT_SLUGS = (Lib.FONTS || []).map(function (f) { return f.slug; });
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
    // fonts: theme.fontDisplay/fontText slug -> --font-display/--font-text ("F-<slug>" families are declared in fonts/fonts.css); unset = built-in stack from style.css.
    var known = function (v) { return typeof v === 'string' && FONT_SLUGS.indexOf(v) >= 0 ? v : ''; };
    [['--font-display', known(t.fontDisplay), '"Space Grotesk","Avenir Next","Segoe UI",system-ui,sans-serif'], ['--font-text', known(t.fontText), 'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif']].forEach(function (f) {
      var attr = f[0] === '--font-display' ? 'fd' : 'ft';
      if (f[1]) { root.style.setProperty(f[0], '"F-' + f[1] + '",' + f[2]); root.dataset[attr] = f[1]; } else { root.style.removeProperty(f[0]); delete root.dataset[attr]; }
    });
    // mat: data-mat=tinted|green (absent = off) + --mat-op line strength; mat.js draws the SVG into div.mat.
    var mt = o(t.mat), mode = mt.mode === 'tinted' || mt.mode === 'green' ? mt.mode : '';
    var lines = typeof mt.lines === 'number' && mt.lines >= 10 && mt.lines <= 100 ? Math.round(mt.lines) : 60;
    var blur = typeof mt.blur === 'number' && mt.blur >= 0 && mt.blur <= 12 ? mt.blur : 2;
    var aura = mt.aura === 'behind' || mt.aura === 'over' ? mt.aura : '';
    if (mode) {
      root.dataset.mat = mode; root.style.setProperty('--mat-op', String(lines / 100)); root.style.setProperty('--mat-blur', blur + 'px'); root.style.setProperty('--mat-b', String(blur));
      if (aura) root.dataset.matAura = aura; else delete root.dataset.matAura;
    } else { delete root.dataset.mat; delete root.dataset.matAura; root.style.removeProperty('--mat-op'); root.style.removeProperty('--mat-blur'); root.style.removeProperty('--mat-b'); }
    if (doc.body && doc.querySelector) {
      var mel = doc.querySelector('.mat');
      if (mode && !mel) { mel = doc.createElement('div'); mel.className = 'mat'; mel.setAttribute('aria-hidden', 'true'); doc.body.insertBefore(mel, doc.body.firstChild); }
      else if (!mode && mel && mel.parentNode) mel.parentNode.removeChild(mel);
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
    var lsw = q(doc, '.lang'); if (lsw) { if (d.langSwitch === true) lsw.removeAttribute('hidden'); else lsw.setAttribute('hidden', ''); }
    var m = o(d.meta);
    if (m.title) doc.title = s(m.title);
    var md = q(doc, 'meta[name=description]');
    if (md) md.setAttribute('content', s(m.description));
    var hn = q(doc, '#top'); if (hn) hero(doc, d, hn);
    var fns = { projects: projects, beyond: beyond, experience: experience, education: education, skills: skills, contact: contact };
    var order = Lib.sectionOrder(d), xp = q(doc, '#experience'), ed = sectionShell(doc, 'education', xp);
    var legacy = ed === xp;   // older shell without #education (and no parent to add one): degrees go under the timeline
    order.forEach(function (id) {
      if (legacy && id === 'education') return;
      var n = q(doc, '#' + id); if (!n) return;
      var off = o(d[id]).hidden === true && !(legacy && id === 'experience' && o(d.education).hidden !== true);
      clear(n);
      setHidden(n, off);
      if (Lib.LAYOUTS[id] && n.setAttribute) n.setAttribute('data-layout', Lib.layoutOf(d, id));
      navHide(doc, '#' + id, off);
      if (!off) fns[id](doc, d, n, opts);
      if (!off && legacy && id === 'experience') education(doc, d, n, opts, true);
    });
    // Page + nav follow `order`: re-append each section (and its nav link) in turn.
    var main = xp && xp.parentNode;
    if (main && main.appendChild) order.forEach(function (id) { var n = q(doc, '#' + id); if (n && n.parentNode === main) main.appendChild(n); });
    var nav = q(doc, '.nav-links');
    if (nav && nav.querySelector) order.forEach(function (id) { var l = nav.querySelector('a[href="#' + id + '"]'); if (l) nav.appendChild(l); });
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
    var lang = preview || win.SITE.langSwitch !== true ? 'en' : pickLang(win);
    renderAll(doc, win.SITE, { lang: lang });
    // Editor preview: same page inside a sandboxed iframe, driven by postMessage (content is still rendered safely).
    if (win.parent !== win && /[?&]preview(=|&|$)/.test(win.location.search)) {
      doc.documentElement.classList.add('preview');
      doc.addEventListener('click', function (e) {   // keep the preview on this page; only in-page anchors work
        var l = e.target && e.target.closest && e.target.closest('a');
        if (l && (l.getAttribute('href') || '').charAt(0) !== '#') e.preventDefault();
      });
      doc.addEventListener('keydown', function (e) {   // Esc inside the frame leaves the editor's full-page preview
        if (e.key === 'Escape' && win.parent) win.parent.postMessage({ type: 'site:esc' }, '*');
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
