// Fake seat map: hold seats, a simulated second seller every 3 s, sell, cancel a sale. Fake hall, fake show.
DemoKit.mock(function (root, api) {
  'use strict';
  var h = api.h;
  var ROWS = [['A', 120, '#7048e8'], ['B', 120, '#7048e8'], ['C', 90, '#1c7ed6'], ['D', 90, '#1c7ed6'], ['E', 60, '#12b886'], ['F', 60, '#12b886']];
  var PER = 14, SIDE = 7;
  var DAYS = ['Thu 17 Apr 20:00', 'Fri 18 Apr 20:00', 'Sat 19 Apr 18:00'];
  var days = DAYS.map(function (_, d) { return seed(d); });
  var day = 0, cancelMode = false, revenue = [0, 0, 0], log = [];
  var timer = null;

  // Deterministic "already sold" pattern per day, no Math.random so the start state is the same each visit.
  function seed(d) {
    var s = {};
    ROWS.forEach(function (r, ri) {
      for (var n = 1; n <= PER; n++) {
        var x = (n * 7 + ri * 13 + d * 5) % 11;
        s[r[0] + n] = x < (d === 2 ? 6 : 3) ? 'sold' : 'free';
      }
    });
    return s;
  }
  function price(id) { for (var i = 0; i < ROWS.length; i++) if (ROWS[i][0] === id[0]) return ROWS[i][1]; return 0; }
  function count(st) { var c = 0, s = days[day]; for (var k in s) if (s[k] === st) c++; return c; }
  function mine() { var s = days[day]; return Object.keys(s).filter(function (k) { return s[k] === 'mine'; }); }
  function note(t) { log.unshift(t); log = log.slice(0, 6); }

  var tabs = h('div', { class: 'tk-tabs', role: 'group', 'aria-label': 'Show day' });
  var kpis = h('div', { class: 'tk-kpis' });
  var map = h('div', { class: 'tk-map' });
  var legend = h('div', { class: 'tk-legend' },
    h('span', null, h('i'), 'free'), h('span', null, h('i', { class: 'l-mine' }), 'yours'),
    h('span', null, h('i', { class: 'l-other' }), 'held by another seller'), h('span', null, h('i', { class: 'l-sold' }), 'sold'));
  [['l-mine', '#3b5bdb'], ['l-other', '#f08c00'], ['l-sold', '#a61e4d']].forEach(function (p) { legend.querySelector('.' + p[0]).style.background = p[1]; });
  var sel = h('div', { class: 'sel' }), tot = h('div', { class: 'tot' });
  var cancelBtn = h('button', { type: 'button', 'aria-pressed': 'false', 'data-step': 'cancel', onclick: function () { cancelMode = !cancelMode; draw(); if (cancelMode) api.toast('Cancel mode: click a sold seat to refund it.'); } }, 'Cancel a sale');
  var sellBtn = h('button', { type: 'button', class: 'go', 'data-step': 'sell', onclick: sell }, 'Sell');
  var logEl = h('div', { class: 'tk-log', 'aria-live': 'polite' });
  root.appendChild(tabs);
  root.appendChild(kpis);
  root.appendChild(h('div', { class: 'tk-stage-label' }, 'STAGE'));
  root.appendChild(map);
  root.appendChild(legend);
  root.appendChild(h('div', { class: 'tk-bar' }, sel, tot, cancelBtn, sellBtn));
  root.appendChild(logEl);

  function click(id) {
    var s = days[day], st = s[id];
    if (cancelMode) {
      if (st === 'sold') {
        s[id] = 'free'; revenue[day] = Math.max(0, revenue[day] - price(id));
        note('You cancelled ' + id + ' (refund ' + price(id) + ' ₺)');
        cancelMode = false; api.done('cancel');
      } else api.toast('Only sold seats can be cancelled.');
    } else if (st === 'free') { s[id] = 'mine'; if (mine().length >= 2) api.done('hold'); }
    else if (st === 'mine') s[id] = 'free';
    else if (st === 'other') { api.toast('Seller 2 is holding ' + id + '. Holds and sales are single conditional updates, so two sellers can never get the same seat.'); api.done('other'); }
    else api.toast(id + ' is sold. Use "Cancel a sale" to refund it.');
    draw();
  }
  function sell() {
    var m = mine();
    if (!m.length) { api.toast('Pick free seats on the map first.'); return; }
    var sum = 0;
    m.forEach(function (id) { days[day][id] = 'sold'; sum += price(id); });
    revenue[day] += sum;
    note('You sold ' + m.join(', ') + ' for ' + sum + ' ₺');
    api.toast('Sold ' + m.length + ' seat' + (m.length > 1 ? 's' : '') + ' for ' + sum + ' ₺. The log and the per-show report record it.');
    api.done('sell');
    draw();
  }
  // The second seller: every 3 s it either holds a free seat or sells one it holds (polling interval of the real app).
  function tick() {
    var s = days[day], held = Object.keys(s).filter(function (k) { return s[k] === 'other'; });
    if (held.length && (held.length > 2 || Math.random() < 0.4)) {
      var id = held[0]; s[id] = 'sold'; revenue[day] += price(id); note('Seller 2 sold ' + id);
    } else {
      var free = Object.keys(s).filter(function (k) { return s[k] === 'free'; });
      if (!free.length) return;
      var f = free[Math.floor(Math.random() * free.length)]; s[f] = 'other'; note('Seller 2 is holding ' + f);
    }
    draw();
  }

  function draw() {
    while (tabs.firstChild) tabs.removeChild(tabs.firstChild);
    DAYS.forEach(function (d, i) {
      tabs.appendChild(h('button', { type: 'button', 'aria-pressed': String(i === day), onclick: function () {
        mine().forEach(function (id) { days[day][id] = 'free'; });
        day = i; cancelMode = false; draw();
      } }, d));
    });
    while (kpis.firstChild) kpis.removeChild(kpis.firstChild);
    [[count('free'), 'free'], [count('mine'), 'yours'], [count('sold'), 'sold'], [revenue[day].toLocaleString('en') + ' ₺', 'revenue (demo)']].forEach(function (k) {
      kpis.appendChild(h('div', { class: 'tk-kpi' }, h('b', null, String(k[0])), k[1]));
    });
    while (map.firstChild) map.removeChild(map.firstChild);
    map.classList.toggle('tk-cancel', cancelMode);
    var s = days[day], firstOther = true, firstFree = true, firstSold = true;
    ROWS.forEach(function (r) {
      var row = h('div', { class: 'tk-row' }, h('span', { class: 'lab' }, r[0]));
      row.style.setProperty('--tier', r[2]);
      for (var n = 1; n <= PER; n++) {
        if (n === SIDE + 1) row.appendChild(h('span', { class: 'tk-gap' }));
        var id = r[0] + n, st = s[id], step = null;
        if (st === 'free' && firstFree) { step = 'hold'; firstFree = false; }
        if (st === 'other' && firstOther) { step = 'other'; firstOther = false; }
        if (st === 'sold' && firstSold && cancelMode) { step = 'cancel'; firstSold = false; }
        row.appendChild(h('button', { type: 'button', class: 'tk-seat ' + st, 'aria-label': id + ' ' + (st === 'mine' ? 'yours' : st === 'other' ? 'held by another seller' : st) + ', ' + r[1] + ' ₺',
          'data-step': step, onclick: click.bind(null, id) }, String(n)));
      }
      row.appendChild(h('span', { class: 'price' }, r[1] + ' ₺'));
      map.appendChild(row);
    });
    var m = mine(), sum = m.reduce(function (a, id) { return a + price(id); }, 0);
    sel.textContent = m.length ? 'Selected: ' + m.join(', ') : 'Pick seats on the map.';
    tot.textContent = sum + ' ₺';
    sellBtn.disabled = !m.length;
    cancelBtn.setAttribute('aria-pressed', String(cancelMode));
    while (logEl.firstChild) logEl.removeChild(logEl.firstChild);
    log.forEach(function (l) { logEl.appendChild(h('div', null, l)); });
    api.repaint();
  }

  draw();
  timer = setInterval(function () { if (!document.hidden) tick(); }, 3000);
  return function () { clearInterval(timer); };
});
