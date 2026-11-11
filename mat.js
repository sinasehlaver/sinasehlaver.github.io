// Cutting-mat background: builds the SVG into the .mat div that render.js applyTheme creates when theme.mat.mode is not "off".
// DOM APIs only (createElementNS, no markup strings, no style attributes); line strength is the --mat-op CSS var set by render.js.
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg', root = document.documentElement, timer = 0;
  function svg(tag, attrs, text) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, String(attrs[k])); });
    if (text != null) e.textContent = String(text);
    return e;
  }
  function path(cls, d, extra) { var a = { class: cls, d: d }; if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; }); return svg('path', a); }

  function build() {
    var mat = document.querySelector('.mat');
    if (!mat) return;
    while (mat.firstChild) mat.removeChild(mat.firstChild);
    if (!root.dataset.mat) return;
    var W = root.clientWidth, H = window.innerHeight, R = 28, U = 48;
    var mn = '', mj = '', hv = '', tk5 = '', tk9 = '', tk14 = '', texts = [], i, x, y, t;
    for (i = 0; R + i * U / 2 <= W; i++) { x = R + i * U / 2; t = 'M' + x + ' ' + R + 'V' + H; if (i % 10 === 0) hv += t; else if (i % 2 === 0) mj += t; else mn += t; }
    for (i = 0; R + i * U / 2 <= H; i++) { y = R + i * U / 2; t = 'M' + R + ' ' + y + 'H' + W; if (i % 10 === 0) hv += t; else if (i % 2 === 0) mj += t; else mn += t; }
    var mm = U / 10;
    for (i = 0; R + i * mm <= W; i++) {
      x = (R + i * mm).toFixed(1);
      if (i % 10 === 0) { tk14 += 'M' + x + ' ' + R + 'V' + (R - 14); texts.push(svg('text', { class: 'tx', x: +x + 2, y: 11 }, i / 10)); }
      else if (i % 5 === 0) tk9 += 'M' + x + ' ' + R + 'V' + (R - 9); else tk5 += 'M' + x + ' ' + R + 'V' + (R - 5);
    }
    for (i = 0; R + i * mm <= H; i++) {
      y = (R + i * mm).toFixed(1);
      if (i % 10 === 0) { tk14 += 'M' + R + ' ' + y + 'H' + (R - 14); if (i) texts.push(svg('text', { class: 'tx', x: 2, y: +y + 3 }, i / 10)); }
      else if (i % 5 === 0) tk9 += 'M' + R + ' ' + y + 'H' + (R - 9); else tk5 += 'M' + R + ' ' + y + 'H' + (R - 5);
    }
    var ox = Math.max(R + 262, Math.round(W * 0.18)), oy = H - 16, rad = 240, L = Math.hypot(W, H), k;
    function pol(r, d) { var a = d * Math.PI / 180; return [ox + r * Math.cos(a), oy - r * Math.sin(a)]; }
    var g = [];
    [30, 45, 60, 90, 120, 135, 150].forEach(function (d) {
      var p = pol(L, d), q = pol(150, d);
      g.push(path('an', 'M' + ox + ' ' + oy + 'L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1), d % 30 === 0 && d % 90 ? { 'stroke-dasharray': '7 5' } : null));
      g.push(svg('text', { class: 'ptx', x: q[0].toFixed(1), y: q[1].toFixed(1) }, d + '°'));
    });
    var pt = 'M' + (ox - rad) + ' ' + oy + 'A' + rad + ' ' + rad + ' 0 0 1 ' + (ox + rad) + ' ' + oy + 'M' + (ox - rad + 24) + ' ' + oy + 'A' + (rad - 24) + ' ' + (rad - 24) + ' 0 0 1 ' + (ox + rad - 24) + ' ' + oy;
    for (k = 0; k <= 180; k++) { var a1 = pol(rad, k), a2 = pol(rad - (k % 10 === 0 ? 14 : k % 5 === 0 ? 9 : 5), k); pt += 'M' + a1[0].toFixed(1) + ' ' + a1[1].toFixed(1) + 'L' + a2[0].toFixed(1) + ' ' + a2[1].toFixed(1); }
    for (k = 0; k <= 180; k += 10) { if (k % 30 === 0 || k === 45 || k === 135) continue; var lp = pol(rad - 20, k); g.push(svg('text', { class: 'ptx sm', x: lp[0].toFixed(1), y: lp[1].toFixed(1) }, k)); }
    var s = svg('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H });
    s.appendChild(path('mn', mn)); s.appendChild(path('mj', mj)); s.appendChild(path('hv', hv));
    [60, 120, 180, 360].forEach(function (r) { s.appendChild(svg('circle', Object.assign({ class: 'ci', cx: ox, cy: oy, r: r }, r === 120 ? { 'stroke-dasharray': '3 4' } : {}))); });
    s.appendChild(path('pt', pt));
    g.forEach(function (n) { s.appendChild(n); });
    [[R + 18, R + 18], [W - 18, R + 18], [R + 18, H - 18], [W - 18, H - 18]].forEach(function (c) {
      s.appendChild(path('rg', 'M' + (c[0] - 8) + ' ' + c[1] + 'H' + (c[0] + 8) + 'M' + c[0] + ' ' + (c[1] - 8) + 'V' + (c[1] + 8)));
      s.appendChild(svg('circle', { class: 'rg', cx: c[0], cy: c[1], r: 4 }));
    });
    s.appendChild(svg('rect', { class: 'rs', x: 0, y: 0, width: W, height: R })); s.appendChild(svg('rect', { class: 'rs', x: 0, y: 0, width: R, height: H }));
    s.appendChild(path('tk', tk5 + tk9 + tk14));
    texts.forEach(function (n) { s.appendChild(n); });
    mat.appendChild(s);
  }

  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(build, 120); });
  new MutationObserver(build).observe(root, { attributes: true, attributeFilter: ['data-mat'] });
  build();
  window.addEventListener('load', build);
})();
