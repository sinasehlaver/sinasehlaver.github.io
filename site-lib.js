// Shared helpers for the site, the editor and the tests (UMD-ish: window.SiteLib or module.exports).
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SiteLib = api;
})(typeof self !== 'undefined' ? self : this, function () {
  var HEADER = [
    '/*',
    ' * content.js - single source of truth for index.html. Edit through editor.html (or by hand).',
    ' * Plain script (file:// safe, no fetch): defines the global SITE object. Everything after the',
    ' * assignment must stay valid JSON. Rendered by render.js with textContent only.',
    ' * Text fields: `backticks` become <code>. URLs: http(s), mailto, relative paths, #anchors only.',
    ' * Unknown extra keys on items are preserved by the editor (room for sync scripts).',
    ' *',
    ' * SCHEMA (version 1)',
    ' *  version       1',
    ' *  meta          {title, description}',
    ' *  hero          {eyebrow, name:{first, accent}, prefix (plain text before the typed words, default "I build"),',
    ' *                 words:[string | {text, prefix}] (typed line; an object\'s optional prefix',
    ' *                 replaces hero.prefix for that word; max 80 chars, no "|"), lead,',
    ' *                 ctas:[{label, href, style:"primary"|"default"}],',
    ' *                 stats:[{value:number, suffix, decimals:int, label}]}',
    ' *  theme         (optional) {preset:"orange"|"teal"|"violet"|"green"|"rose"|"blue", accent:"" | "#rrggbb" (custom accent, overrides preset)}',
    ' *  langSwitch    (optional) boolean; true = show the TR/EN switch on the site. Absent/false = switch hidden and the site always renders English (set from the editor, Colours & site).',
    ' *  experience    {heading, items:[{role, org, period, sub, bullets:[string]}]}',
    ' *  education     {heading, items:[{title, sub, text}]}',
    ' *  projects      {heading, items:[{name, url, description, source:"manual"|"pinned", live?:{label, href}, image?, imageAlt?}]}',
    ' *                source "pinned" = written by the GitHub pinned-repos sync. A sync may replace',
    ' *                only "pinned" items and must leave "manual" ones alone.',
    ' *  skills        {heading, groups:[{label, items:[string]}], languages}',
    ' *  beyond        {heading, items:[{kind, title, text, image, imageAlt, link:{label, href}}]}',
    ' *                kind: "text"|"music"|"video"|"band"|"photo"|"link"',
    ' *                image: relative path img/<file> (png|jpg|webp, no svg) or "" for none',
    ' *                link: {label:"", href:""} means no link',
    ' *                embed (optional): {provider:"youtube"|"instagram", url}; url "" or absent = none. Strict allowlist:',
    ' *                  youtube https://www.youtube.com/watch?v=ID | https://youtu.be/ID | https://www.youtube.com/embed/ID',
    ' *                  (facade, auto-loaded when scrolled into view -> youtube-nocookie.com) or channel https://www.youtube.com/@handle (cannot be',
    ' *                  iframed: renders an "Open channel" card); instagram https://www.instagram.com/(p|reel)/SHORTCODE/.',
    ' *                  Nothing third-party loads until the embed scrolls into view. YouTube refuses playback from file:// (error 153): works when hosted.',
    ' *  contact       {heading, intro, links:[{label, href, style:"primary"|"default"}]}',
    ' *  Sections experience/education/projects/skills/beyond/contact each take an optional boolean `hidden` (absent = visible; true = not rendered, nav link hidden; set from the editor).',
    ' *  footer        {text}',
    ' *  tr            (optional) Turkish overlay: a PARTIAL copy of the content above, text fields only (meta, hero incl. prefix/words,',
    ' *                headings, experience/education/projects/skills/beyond/contact text, footer). Arrays overlay by index; projects.items',
    ' *                entries may carry `match` (base name or url) so a pinned sync cannot misalign them. Urls, images, embeds, source,',
    ' *                theme always come from the base. A missing/empty value falls back to English. Site: TR/EN button, ?lang=tr|en.',
    ' */'
  ].join('\n');

  var EMBED_PROVIDERS = ['youtube', 'instagram'];
  // Strict allowlist. Returns {provider, type:'video'|'channel'|'post'|'reel', id, src, href} or null.
  // `src` is rebuilt only from the matched id/shortcode, never from the input string.
  function parseEmbed(provider, url) {
    if (typeof url !== 'string') return null;
    var u = url.trim(), m;
    if (provider === 'youtube') {
      if ((m = /^https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$/.exec(u)) || (m = /^https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})$/.exec(u)) || (m = /^https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]{11})$/.exec(u)))
        return { provider: provider, type: 'video', id: m[1], src: 'https://www.youtube-nocookie.com/embed/' + m[1], href: 'https://www.youtube.com/watch?v=' + m[1] };
      if ((m = /^https:\/\/www\.youtube\.com\/@([A-Za-z0-9._-]{3,30})\/?$/.exec(u)))
        return { provider: provider, type: 'channel', id: m[1], src: '', href: 'https://www.youtube.com/@' + m[1] };
      return null;
    }
    if (provider === 'instagram') {
      if ((m = /^https:\/\/www\.instagram\.com\/(p|reel)\/([A-Za-z0-9_-]{5,30})\/?$/.exec(u)))
        return { provider: provider, type: m[1] === 'p' ? 'post' : 'reel', id: m[2], src: 'https://www.instagram.com/' + m[1] + '/' + m[2] + '/embed/', href: 'https://www.instagram.com/' + m[1] + '/' + m[2] + '/' };
    }
    return null;
  }

  var KINDS = ['text', 'music', 'video', 'band', 'photo', 'link'];
  var SOURCES = ['manual', 'pinned'];
  var STYLES = ['primary', 'default'];
  var MAX_IMAGE_BYTES = 2 * 1024 * 1024;
  var IMAGE_TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

  // Returns the trimmed URL if it is http(s), mailto (unless opts.mailto === false), or relative; else null.
  function safeUrl(u, opts) {
    if (typeof u !== 'string') return null;
    u = u.trim();
    if (!u) return null;
    if (/[\u0000- \u007f-\u009f\\]/.test(u)) return null; // controls, whitespace, backslash
    var m = /^([a-z][a-z0-9+.\-]*):/i.exec(u);
    if (m) {
      var s = m[1].toLowerCase();
      if (s === 'http' || s === 'https') return /^https?:\/\/[^\/?#]+/i.test(u) ? u : null;
      if (s === 'mailto' && !(opts && opts.mailto === false)) return u.length > 7 ? u : null;
      return null;
    }
    if (u.slice(0, 2) === '//') return null;
    return u;
  }
  function safeImage(u) { return safeUrl(u, { mailto: false }); }

  // Relative image path under img/ with an allowed extension, else false.
  function isSiteImagePath(p) {
    return typeof p === 'string' && /^img\/[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp)$/.test(p);
  }

  // Sanitized lowercase file name for an upload, or null when type/size is not allowed.
  function imageFileName(name, mime, size) {
    var ext = IMAGE_TYPES[mime];
    if (!ext) return null;
    if (typeof size === 'number' && (size <= 0 || size > MAX_IMAGE_BYTES)) return null;
    var base = String(name || 'image').replace(/\.[^.]*$/, '').normalize('NFKD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'image';
    return base + '.' + ext;
  }

  function serialize(data, header) {
    return (header || HEADER) + '\nwindow.SITE = ' + JSON.stringify(data, null, 2) + ';\n';
  }

  // Extracts {data, prefix} from content.js text.
  function parse(text) {
    var m = /^window\.SITE\s*=\s*/m.exec(text);
    if (!m) throw new Error('No "window.SITE =" assignment found');
    var body = text.slice(m.index + m[0].length).trim().replace(/;\s*$/, '');
    return { data: JSON.parse(body), prefix: text.slice(0, m.index).replace(/\s+$/, '') };
  }

  var THEME_PRESETS = ['orange', 'teal', 'violet', 'green', 'rose', 'blue'];
  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  // Returns a list of human-readable problems (empty = valid).
  function validate(d) {
    var e = [];
    function str(v, path) { if (typeof v !== 'string') e.push(path + ' must be a string'); }
    function arr(v, path) { if (!Array.isArray(v)) { e.push(path + ' must be an array'); return []; } return v; }
    function url(v, path, req, img) {
      if (v === '' || v == null) { if (req) e.push(path + ' is required'); return; }
      if (typeof v !== 'string' || !(img ? safeImage(v) : safeUrl(v))) e.push(path + ' is not an allowed URL (http, https, mailto, relative)');
    }
    if (!isObj(d)) return ['content is not an object'];
    if (d.version !== 1) e.push('version must be 1');
    if (!isObj(d.meta)) e.push('meta missing'); else { str(d.meta.title, 'meta.title'); str(d.meta.description, 'meta.description'); }
    if (d.theme != null) {
      if (!isObj(d.theme)) e.push('theme must be an object');
      else {
        if (d.theme.preset != null && THEME_PRESETS.indexOf(d.theme.preset) < 0) e.push('theme.preset must be one of ' + THEME_PRESETS.join(', '));
        if (d.theme.accent != null && d.theme.accent !== '' && !(typeof d.theme.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(d.theme.accent))) e.push('theme.accent must be empty or #rrggbb');
      }
    }
    if (d.langSwitch != null && typeof d.langSwitch !== 'boolean') e.push('langSwitch must be a boolean');
    var h = d.hero;
    if (!isObj(h)) e.push('hero missing');
    else {
      str(h.eyebrow, 'hero.eyebrow'); str(h.lead, 'hero.lead');
      if (!isObj(h.name)) e.push('hero.name missing'); else { str(h.name.first, 'hero.name.first'); str(h.name.accent, 'hero.name.accent'); }
      if (h.prefix != null) str(h.prefix, 'hero.prefix');
      if (typeof h.prefix === 'string') { if (h.prefix.length > 80) e.push('hero.prefix too long'); if (h.prefix.indexOf('|') >= 0) e.push('hero.prefix must not contain "|"'); }
      arr(h.words, 'hero.words').forEach(function (w, i) {
        var p = 'hero.words[' + i + ']';
        if (isObj(w)) {
          str(w.text, p + '.text'); if (w.prefix != null) str(w.prefix, p + '.prefix');
          [['text', w.text], ['prefix', w.prefix]].forEach(function (kv) {
            if (typeof kv[1] !== 'string') return;
            if (kv[1].length > 80) e.push(p + '.' + kv[0] + ' too long');
            if (kv[1].indexOf('|') >= 0) e.push(p + '.' + kv[0] + ' must not contain "|"');
          });
        } else {
          str(w, p);
          if (typeof w === 'string') { if (w.length > 80) e.push(p + ' too long'); if (w.indexOf('|') >= 0) e.push(p + ' must not contain "|"'); }
        }
      });
      arr(h.ctas, 'hero.ctas').forEach(function (c, i) {
        var p = 'hero.ctas[' + i + ']'; if (!isObj(c)) return e.push(p + ' must be an object');
        str(c.label, p + '.label'); url(c.href, p + '.href', true); if (STYLES.indexOf(c.style) < 0) e.push(p + '.style invalid');
      });
      arr(h.stats, 'hero.stats').forEach(function (s, i) {
        var p = 'hero.stats[' + i + ']'; if (!isObj(s)) return e.push(p + ' must be an object');
        if (typeof s.value !== 'number' || !isFinite(s.value)) e.push(p + '.value must be a number');
        if (!(Number.isInteger(s.decimals) && s.decimals >= 0 && s.decimals <= 4)) e.push(p + '.decimals must be an integer 0-4');
        str(s.suffix, p + '.suffix'); str(s.label, p + '.label');
      });
    }
    function sect(name, listKey, item) {
      var s = d[name];
      if (!isObj(s)) return e.push(name + ' missing');
      if (s.hidden != null && typeof s.hidden !== 'boolean') e.push(name + '.hidden must be a boolean');
      str(s.heading, name + '.heading');
      arr(s[listKey], name + '.' + listKey).forEach(function (it, i) {
        var p = name + '.' + listKey + '[' + i + ']';
        if (!isObj(it)) return e.push(p + ' must be an object');
        item(it, p);
      });
    }
    sect('experience', 'items', function (it, p) {
      str(it.role, p + '.role'); str(it.org, p + '.org'); str(it.period, p + '.period'); str(it.sub, p + '.sub');
      arr(it.bullets, p + '.bullets').forEach(function (b, j) { str(b, p + '.bullets[' + j + ']'); });
    });
    sect('education', 'items', function (it, p) { str(it.title, p + '.title'); str(it.sub, p + '.sub'); str(it.text, p + '.text'); });
    sect('projects', 'items', function (it, p) {
      str(it.name, p + '.name'); str(it.description, p + '.description'); url(it.url, p + '.url', false);
      if (SOURCES.indexOf(it.source) < 0) e.push(p + '.source must be manual|pinned');
      if (it.image !== '' && it.image != null && !(isSiteImagePath(it.image) || safeImage(it.image))) e.push(p + '.image invalid');
      if (it.image && /\.svg(\?|#|$)/i.test(it.image)) e.push(p + '.image must not be svg');
      if (it.live != null) {
        if (!isObj(it.live)) e.push(p + '.live must be an object');
        else { if (it.live.label != null) str(it.live.label, p + '.live.label'); url(it.live.href, p + '.live.href', false); if (it.live.href && !/^https?:\/\//i.test(String(it.live.href))) e.push(p + '.live.href must be http or https'); }
      }
    });
    sect('skills', 'groups', function (it, p) {
      str(it.label, p + '.label');
      arr(it.items, p + '.items').forEach(function (c, j) { str(c, p + '.items[' + j + ']'); });
    });
    if (isObj(d.skills)) str(d.skills.languages, 'skills.languages');
    sect('beyond', 'items', function (it, p) {
      if (KINDS.indexOf(it.kind) < 0) e.push(p + '.kind must be one of ' + KINDS.join('|'));
      str(it.title, p + '.title'); str(it.text, p + '.text');
      if (it.image !== '' && it.image != null && !(isSiteImagePath(it.image) || safeImage(it.image))) e.push(p + '.image invalid');
      if (it.image && /\.svg(\?|#|$)/i.test(it.image)) e.push(p + '.image must not be svg');
      if (it.link != null) { if (!isObj(it.link)) e.push(p + '.link must be an object'); else { str(it.link.label, p + '.link.label'); url(it.link.href, p + '.link.href', false); } }
      if (it.embed != null) {
        if (!isObj(it.embed)) e.push(p + '.embed must be an object');
        else if (EMBED_PROVIDERS.indexOf(it.embed.provider) < 0) e.push(p + '.embed.provider must be youtube|instagram');
        else if (typeof it.embed.url !== 'string') e.push(p + '.embed.url must be a string');
        else if (it.embed.url.trim() && !parseEmbed(it.embed.provider, it.embed.url)) e.push(p + '.embed.url is not an allowed ' + it.embed.provider + ' URL');
      }
    });
    if (isObj(d.contact)) {
      str(d.contact.intro, 'contact.intro');
    }
    sect('contact', 'links', function (it, p) { str(it.label, p + '.label'); url(it.href, p + '.href', true); if (STYLES.indexOf(it.style) < 0) e.push(p + '.style invalid'); });
    if (!isObj(d.footer)) e.push('footer missing'); else str(d.footer.text, 'footer.text');
    if (d.tr != null) { if (!isObj(d.tr)) e.push('tr must be an object'); else checkTr(d, d.tr, 'tr', null, e); }
    return e;
  }

  /* ---- Turkish (or any) text overlay: d.tr is a PARTIAL copy of the base content, text fields only. ----
     Non-text keys (urls, images, embeds, source, theme ...) are never taken from the overlay. Arrays overlay by index;
     projects items may carry `match` (base name or url) so a pinned sync that reorders items cannot misalign them. */
  var NONTEXT = { hidden: 1, langSwitch: 1, href: 1, url: 1, image: 1, embed: 1, source: 1, style: 1, kind: 1, value: 1, decimals: 1, suffix: 1, provider: 1, theme: 1, version: 1, tr: 1, match: 1 };
  var TR_MAX = 2000;
  function trItemFor(baseItem, ovArr, i) {
    ovArr = Array.isArray(ovArr) ? ovArr : [];
    var b = isObj(baseItem) ? baseItem : {};
    for (var k = 0; k < ovArr.length; k++) {
      var m = isObj(ovArr[k]) && typeof ovArr[k].match === 'string' ? ovArr[k].match : '';
      if (m && (m === b.name || (b.url && m === b.url))) return ovArr[k];
    }
    var x = ovArr[i];
    return isObj(x) && !x.match ? x : undefined;
  }
  function wordParts(w) { return typeof w === 'string' ? { t: w, p: '' } : { t: typeof (w && w.text) === 'string' ? w.text : '', p: typeof (w && w.prefix) === 'string' ? w.prefix : '' }; }
  function mergeWord(b, o) {
    if (o == null) return b;
    var bp = wordParts(b), op = wordParts(o);
    var t = op.t || bp.t, p = op.p || bp.p;
    return p ? { text: t, prefix: p } : t;
  }
  function pairs(base, ov, key) {   // [[baseItem, overlayItem], ...] for one array
    return base.map(function (b, i) { return [b, key === 'items' && isObj(b) && ('name' in b) ? trItemFor(b, ov, i) : (Array.isArray(ov) ? ov[i] : undefined)]; });
  }
  function mergeTr(base, ov, key) {
    if (NONTEXT[key] || ov == null) return base;
    if (typeof base === 'string') return typeof ov === 'string' && ov !== '' ? ov : base;
    if (Array.isArray(base)) {
      if (!Array.isArray(ov)) return base;
      return pairs(base, ov, key).map(function (pr) { return key === 'words' ? mergeWord(pr[0], pr[1]) : mergeTr(pr[0], pr[1], key); });
    }
    if (isObj(base)) {
      if (!isObj(ov)) return base;
      var out = {};
      Object.keys(base).forEach(function (k) { out[k] = mergeTr(base[k], ov[k], k); });
      return out;
    }
    return base;
  }
  // Pure: returns content merged with the overlay for `lang` ('tr'); anything else returns the base without `tr`.
  function localize(data, lang) {
    if (!isObj(data)) return data;
    var out = {};
    Object.keys(data).forEach(function (k) {
      if (k === 'tr') return;
      out[k] = lang === 'tr' && isObj(data.tr) ? mergeTr(data[k], data.tr[k], k) : data[k];
    });
    return out;
  }
  function checkTr(base, ov, path, key, e) {
    if (NONTEXT[key] || ov == null) return;
    if (typeof base === 'string') {
      if (typeof ov !== 'string') e.push(path + ' must be a string');
      else if (ov.length > TR_MAX) e.push(path + ' too long');
      return;
    }
    if (Array.isArray(base)) {
      if (!Array.isArray(ov)) { e.push(path + ' must be an array'); return; }
      pairs(base, ov, key).forEach(function (pr, i) {
        var p = path + '[' + i + ']';
        if (pr[1] == null) return;
        if (key === 'words') {
          var o = pr[1];
          if (typeof o !== 'string' && !isObj(o)) { e.push(p + ' must be a string or {text, prefix}'); return; }
          [['', typeof o === 'string' ? o : o.text], ['.prefix', isObj(o) ? o.prefix : null]].forEach(function (kv) {
            if (kv[1] == null) return;
            if (typeof kv[1] !== 'string') e.push(p + kv[0] + ' must be a string');
            else { if (kv[1].length > 80) e.push(p + kv[0] + ' too long'); if (kv[1].indexOf('|') >= 0) e.push(p + kv[0] + ' must not contain "|"'); }
          });
        } else checkTr(pr[0], pr[1], p, key, e);
      });
      return;
    }
    if (isObj(base)) {
      if (!isObj(ov)) { e.push(path + ' must be an object'); return; }
      if (ov.match != null && typeof ov.match !== 'string') e.push(path + '.match must be a string');
      Object.keys(ov).forEach(function (k) {
        if (base[k] === undefined) return;
        if (k === 'prefix' && typeof ov[k] === 'string' && (ov[k].length > 80 || ov[k].indexOf('|') >= 0)) e.push(path + '.prefix invalid');
        checkTr(base[k], ov[k], path + '.' + k, k, e);
      });
    }
  }

  return { HEADER: HEADER, EMBED_PROVIDERS: EMBED_PROVIDERS, parseEmbed: parseEmbed, KINDS: KINDS, SOURCES: SOURCES, STYLES: STYLES, MAX_IMAGE_BYTES: MAX_IMAGE_BYTES, IMAGE_TYPES: IMAGE_TYPES,
    safeUrl: safeUrl, safeImage: safeImage, isSiteImagePath: isSiteImagePath, imageFileName: imageFileName,
    serialize: serialize, parse: parse, validate: validate, localize: localize, trItemFor: trItemFor, wordParts: wordParts, NONTEXT: NONTEXT };
});
