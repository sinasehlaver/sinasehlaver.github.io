'use strict';
// Picks: {catId: {variants: [ids], note}}. Autosaved to localStorage; "Save picks" writes picks.json
// (File System Access, then rewritten on every change; download fallback).
const KEY = 'ui-picker.v1';
const ROOT = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const FOUND = CATEGORIES.filter(c => c.attr);
let S = { picks: {}, theme: null };
try { S = { ...S, ...JSON.parse(localStorage.getItem(KEY)) }; } catch {}
let fileHandle = null;

// ---------- render ----------
function render() {
  buildNav();
  $('#cats').innerHTML = CATEGORIES.map(c => `<section class="cat" id="cat-${c.id}">
    <div class="cat-head"><h2>${c.title}</h2><span class="tag">${c.attr ? 'pick one · applies live' : TAG[c.mode]}</span></div>
    ${c.desc ? `<p>${c.desc}</p>` : ''}<div class="combo-slot" data-combo="${c.id}"></div>
    <div class="grid">${c.variants.map((v, i) => `<article class="card" data-cat="${c.id}" data-v="${v.id}">
      <div class="card-top"><span class="letter">${String.fromCharCode(65 + i)}</span><h3>${v.name}</h3>${v.src ? `<span class="src">${v.src}</span>` : ''}</div>
      ${v.desc ? `<p class="desc">${v.desc}</p>` : '<p class="desc"></p>'}${c.when?.[v.id] ? `<p class="when">For ${c.when[v.id]}</p>` : ''}
      <div class="stage${c.attr ? ' scope' : ''}${v.tall ? ' tall' : ''}">${c.attr ? (c.sample ? c.sample() : SAMPLE) : v.html}</div>
      <div class="card-foot"><button class="pick${c.attr || c.mode === 'one' ? '' : ' multi'}" data-a="pick"><span class="box"></span><span class="lbl">Pick</span></button></div>
    </article>`).join('')}</div>
    <div class="cat-foot"><textarea class="note" data-note="${c.id}" rows="1" placeholder="Note (optional): what to change, how to combine…"></textarea>
      <button class="btn quiet sm next" data-a="next">Skip ↓</button></div>
  </section>`).join('');
  $$('.stage').forEach(st => st.insertAdjacentHTML('beforeend', '<div class="toast-host"></div>'));
}
const TAG = { one: 'pick one', combine: 'pick all you want · they work together', context: 'pick one per situation' };
const LBL = { one: ['Pick', 'Picked'], combine: ['Include', 'Included'], context: ['Use', 'Used'] };

// combine with 2+ picks -> live "Together" card; context with 2+ -> "Your rule" line. Re-rendered only when the ids change.
function renderCombo(c) {
  const slot = $(`[data-combo="${c.id}"]`), ids = picked(c.id), key = ids.join();
  if (slot.dataset.key === key) return;
  slot.dataset.key = key;
  if (ids.length < 2 || c.mode === 'one') { slot.innerHTML = ''; return; }
  const vs = ids.map(id => c.variants.find(v => v.id === id));
  if (c.mode === 'context') {
    slot.innerHTML = `<p class="rule"><b>Your rule:</b> ${vs.map(v => `${v.name} → ${c.when?.[v.id] || 'see note'}`).join(' · ')}</p>`;
    return;
  }
  const html = c.combo ? c.combo(ids) : vs.map(v => `<div class="combo-part"><span class="eyebrow">${v.name}</span>${v.html}</div>`).join('');
  slot.innerHTML = `<article class="card combo"><div class="card-top"><span class="letter">+</span><h3>Together: ${vs.map(v => v.name).join(' + ')}</h3></div>
    <p class="desc">Everything you picked, working at once. This is what new apps get.</p><div class="stage tall">${html}<div class="toast-host"></div></div></article>`;
  $$('.seg', slot).forEach(placeThumb);
  updateSel($('.stage', slot));
}

// ---------- nav: "Picked" block above "To pick"; picked items glide up and the nav scrolls them out of view ----------
const GROUPS = [...new Set(CATEGORIES.map(c => c.group))];
const NAV = new Map();
let navKey = '', navTimer, navReady = false;
function navEl(k, make) {
  if (!NAV.has(k)) { const el = make(); el.dataset.k = k; NAV.set(k, el); }
  return NAV.get(k);
}
function buildNav() {
  NAV.clear(); navKey = '';
  const nav = $('#nav');
  nav.replaceChildren();
  CATEGORIES.forEach(c => navEl('a:' + c.id, () => Object.assign(document.createElement('a'),
    { href: `#cat-${c.id}`, innerHTML: `${c.title}<span class="tick">✓</span>` })).dataset.nav = c.id);
}
const mk = (tag, cls, html) => () => Object.assign(document.createElement(tag), { className: cls, innerHTML: html });
function navOrder() {
  const done = CATEGORIES.filter(c => picked(c.id).length), todo = CATEGORIES.filter(c => !picked(c.id).length);
  const block = (b, list) => GROUPS.flatMap(g => {
    const cs = list.filter(c => c.group === g);
    return cs.length ? [navEl(`g:${b}:${g}`, mk('h4', '', g)), ...cs.map(c => NAV.get('a:' + c.id))] : [];
  });
  const hd = (b, label, n) => { const el = navEl('h:' + b, mk('div', 'nav-blk', `${label}<span class="count"></span>`)); $('.count', el).textContent = n; return el; };
  return [
    ...(done.length ? [hd('done', 'Picked', done.length), ...block('done', done)] : []),
    hd('todo', 'To pick', todo.length),
    ...(todo.length ? block('todo', todo) : [navEl('all', mk('p', 'nav-all', 'Everything picked ✓<br><span class="muted small">Save picks to keep them.</span>'))]),
    navEl('pad', mk('div', 'nav-pad', '')),
  ];
}
const ms = name => motionOff() ? 0 : parseFloat(getComputedStyle(ROOT).getPropertyValue(name)) || 0;
const motionOff = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const easing = () => getComputedStyle(ROOT).getPropertyValue('--ease').trim() || 'ease-out';
function arrangeNav(animate) {
  const nav = $('#nav'), order = navOrder(), key = order.map(e => e.dataset.k).join('|');
  if (key === navKey) return;
  navKey = key;
  nav.getAnimations({ subtree: true }).forEach(a => a.finish());
  cancelAnimationFrame(nav._glide);
  const dur = animate ? ms('--t-slow') * 1.0 : 0, s0 = nav.scrollTop;
  const before = new Map([...nav.children].map(el => [el, el.offsetTop - s0]));
  const leaving = [...nav.children].filter(el => !order.includes(el) && el !== HL);
  const pad = NAV.get('pad'), todo = NAV.get('h:todo');
  pad.style.height = '0px';
  nav.replaceChildren(...order, HL);
  pad.style.height = Math.max(0, nav.clientHeight - (nav.scrollHeight - todo.offsetTop) + 8) + 'px';
  const s1 = Math.max(0, todo.offsetTop - 8);
  nav.scrollTop = s1;
  const left = navLock - performance.now();   // a page glide is under way: re-aim nav + highlight at its target
  if (left > 0) { moveHl(navTarget, 0); follow(true, navTarget, left); } else placeHl(false);
  if (dur) flipNav(order, before, leaving, s1, dur);
  if (left <= 0) follow(dur > 0);
}
function flipNav(order, before, leaving, s1, dur) {
  const nav = $('#nav'), pad = NAV.get('pad');
  for (const el of [...order, HL]) {
    if (el === pad) continue;
    const was = before.get(el);
    if (was === undefined) el.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: dur, easing: easing(), delay: dur * .4, fill: 'backwards' });
    else if (was !== el.offsetTop - s1) el.animate([{ transform: `translateY(${was - (el.offsetTop - s1)}px)` }, { transform: 'none' }], { duration: dur, easing: easing() });
  }
  for (const el of leaving) {   // a header that is no longer needed fades where it stood
    if (el === pad || !before.has(el)) continue;
    const g = el.cloneNode(true);
    g.classList.add('nav-ghost');
    g.style.top = before.get(el) + s1 + 'px';
    nav.append(g);
    g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur * .5, easing: easing() }).onfinish = () => g.remove();
  }
}
function scheduleNav() {
  clearTimeout(navTimer);
  if (!navReady) return arrangeNav(false);
  navTimer = setTimeout(() => arrangeNav(true), ms('--t-pop') + 150);   // let the ✓ land first
}
// the nav follows the section you are reading: one highlight glides between titles, the list glides to keep it in view
const HL = Object.assign(document.createElement('div'), { className: 'nav-hl' });
let curId = '';
function placeHl(animate) {
  const a = NAV.get('a:' + curId);
  if (!a?.isConnected) return HL.style.opacity = '0';
  HL.dataset.on = curId; clearTimeout(HL._t);
  HL.style.transition = animate ? '' : 'none';
  Object.assign(HL.style, { opacity: '', top: a.offsetTop + 'px', left: a.offsetLeft + 'px', width: a.offsetWidth + 'px', height: a.offsetHeight + 'px' });
  if (!animate) { HL.offsetTop; HL.style.transition = ''; }
}
function moveHl(id, dur) {   // during a page glide: straight to the target title, on the same in-out curve
  const a = NAV.get('a:' + id);
  if (!a?.isConnected) return;
  HL.dataset.on = id; clearTimeout(HL._t);
  HL.style.transition = ['top', 'height', 'width'].map(p => `${p} ${dur}ms cubic-bezier(.65,0,.35,1)`).join();
  Object.assign(HL.style, { opacity: '', top: a.offsetTop + 'px', left: a.offsetLeft + 'px', width: a.offsetWidth + 'px', height: a.offsetHeight + 'px' });
  HL._t = setTimeout(() => HL.style.transition = '', dur);
}
let navLock = 0, navTarget = '';   // while main glides to a section, the nav glides once to its title, in step
function follow(animate, id, dur) {
  if (!id && performance.now() < navLock) return;
  const nav = $('#nav'), a = NAV.get('a:' + (id || curId));
  if (!a?.isConnected) return;
  const h = nav.clientHeight, top = a.offsetTop, bot = top + a.offsetHeight, pin = NAV.get('h:todo').offsetTop - 8;
  let to;
  if (top >= pin && bot <= pin + h - 24) to = pin;                              // fits under "To pick": keep that pinned
  else if (top >= nav.scrollTop + h * .15 && bot <= nav.scrollTop + h * .7) return;  // comfortably in view
  else to = top - h * .35;
  glide(nav, to, !animate ? 0 : dur || ms('--t-slow') * .9, !dur);
}
function spy() {
  const main = $('main'), y = main.getBoundingClientRect().top + main.clientHeight * .25;
  let id = CATEGORIES[0].id;
  for (const s of $$('section.cat')) { if (s.getBoundingClientRect().top <= y) id = s.id.slice(4); else break; }
  if (main.scrollTop + main.clientHeight >= main.scrollHeight - 2) id = CATEGORIES.at(-1).id;
  const first = !curId, changed = id !== curId;
  if (changed) {
    NAV.get('a:' + curId)?.classList.remove('cur');
    curId = id;
    NAV.get('a:' + id)?.classList.add('cur');
  }
  if (performance.now() < navLock) return;   // goTo is already moving highlight + nav in step
  if (HL.dataset.on !== curId) placeHl(!first);
  if (changed) follow(!first && navReady);
}

// ---------- main: calm glide to the next section still to pick ----------
function glide(el, to, dur, out) {   // out: ease-out only, for follow-glides that restart while moving
  cancelAnimationFrame(el._glide);
  const from = el.scrollTop, d = Math.max(0, Math.min(to, el.scrollHeight - el.clientHeight)) - from;
  el.style.scrollBehavior = 'auto';
  const stop = () => { cancelAnimationFrame(el._glide); el.style.scrollBehavior = ''; STOPS.forEach(ev => el.removeEventListener(ev, stop)); };
  if (!dur || Math.abs(d) < 2) { el.scrollTop = from + d; return stop(); }
  STOPS.forEach(ev => el.addEventListener(ev, stop, { passive: true }));
  const t0 = performance.now();
  const step = now => {
    const p = Math.min(1, (now - t0) / dur), e = out ? 1 - (1 - p) ** 3 : p < .5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
    el.scrollTop = from + d * e;
    if (p < 1) el._glide = requestAnimationFrame(step); else stop();
  };
  el._glide = requestAnimationFrame(step);
}
const STOPS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
function goTo(id) {
  const main = $('main'), sec = $('#cat-' + id);
  const to = sec.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 8;
  const base = ms('--t-slow');
  const dur = base && Math.min(900, base * 1.4 + Math.abs(to - main.scrollTop) / 14);
  glide(main, to, dur);
  navLock = performance.now() + dur; navTarget = id;
  follow(true, id, dur);
  moveHl(id, dur);
  setTimeout(spy, dur + 30);   // settle on whatever is in view once the lock ends
  history.replaceState(null, '', '#cat-' + id);
}
function nextOpen(fromId) {
  const i = CATEGORIES.findIndex(c => c.id === fromId);
  for (let k = 1; k < CATEGORIES.length; k++) { const c = CATEGORIES[(i + k) % CATEGORIES.length]; if (!picked(c.id).length) return c; }
}
let advTimer;
function advanceFrom(id, delay) {
  clearTimeout(advTimer);
  advTimer = setTimeout(() => { const n = nextOpen(id); if (n) goTo(n.id); }, delay);
}
$('main').addEventListener('pointerdown', e => { if (!e.target.closest('[data-a="pick"]')) clearTimeout(advTimer); });

function applyFoundations() {
  for (const c of FOUND) if (c.live !== false) ROOT.dataset[c.attr] = picked(c.id)[0] || c.def;
  ROOT.dataset.theme = S.theme || (picked('theme')[0] === 'light' ? 'light' : picked('theme')[0] === 'system' && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  $$('.stage.scope').forEach(st => {
    for (const c of FOUND) st.dataset[c.attr] = ROOT.dataset[c.attr];
    const card = st.closest('.card'), c = CAT[card.dataset.cat];
    let v = card.dataset.v;
    if (c.attr === 'theme' && v === 'system') v = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    st.dataset[c.attr] = v;
  });
  requestAnimationFrame(() => $$('.seg').forEach(placeThumb));
}

const picked = id => S.picks[id]?.variants || [];
function paint() {
  $$('.card[data-cat]').forEach(card => {
    const on = picked(card.dataset.cat).includes(card.dataset.v);
    card.classList.toggle('picked', on);
    const c = CAT[card.dataset.cat];
    $('.lbl', $('.pick', card)).textContent = (LBL[c.mode] || LBL.one)[on ? 1 : 0];
  });
  CATEGORIES.filter(c => !c.attr).forEach(renderCombo);
  $$('[data-note]').forEach(t => { if (document.activeElement !== t) t.value = S.picks[t.dataset.note]?.note || ''; });
  $$('[data-nav]').forEach(a => a.classList.toggle('done', picked(a.dataset.nav).length > 0));
  $$('section.cat').forEach(s => { const n = picked(s.id.slice(4)).length; s.classList.toggle('has-pick', n > 0); $('.next', s).textContent = n ? 'Next ↓' : 'Skip ↓'; });
  scheduleNav();
  const done = CATEGORIES.filter(c => picked(c.id).length).length;
  $('#prog-n').textContent = `${done} / ${CATEGORIES.length}`;
  $('#prog-bar').style.width = `${(done / CATEGORIES.length) * 100}%`;
  $('#theme-btn').innerHTML = ROOT.dataset.theme === 'dark' ? I.sun : I.moon;
}

let saveTimer;
function changed() {
  S.picks = Object.fromEntries(Object.entries(S.picks).filter(([, p]) => p.variants.length || p.note));
  localStorage.setItem(KEY, JSON.stringify(S));
  paint();
  clearTimeout(saveTimer);
  if (fileHandle) saveTimer = setTimeout(() => writeFile(), 400);
}

function togglePick(card) {
  const c = CAT[card.dataset.cat], v = card.dataset.v;
  const p = S.picks[c.id] ||= { variants: [], note: '' };
  const first = !p.variants.length;
  if (c.attr || c.mode === 'one') p.variants = p.variants[0] === v ? [] : [v];
  else p.variants = p.variants.includes(v) ? p.variants.filter(x => x !== v) : [...p.variants, v];
  if (c.attr) applyFoundations();
  changed();
  // pick-one sections move on by themselves after the first pick; multi-pick sections wait for "Next ↓"
  if (first && p.variants.length && (c.attr || c.mode === 'one')) advanceFrom(c.id, ms('--t-slow') * 0.6 + 200);
}

// ---------- picks.json ----------
const envelope = () => JSON.stringify({ app: 'ui-picker', version: 1, savedAt: new Date().toISOString(),
  picks: Object.fromEntries(CATEGORIES.filter(c => S.picks[c.id]).map(c => [c.id, {
    variants: S.picks[c.id].variants, names: S.picks[c.id].variants.map(v => c.variants.find(x => x.id === v)?.name), note: S.picks[c.id].note }])) }, null, 2);

function fileChip(s, text) { const el = $('#file-chip'); el.dataset.s = s; $('span:last-child', el).textContent = text; }

async function writeFile() {
  fileChip('saving', 'Saving…');
  try {
    const w = await fileHandle.createWritable(); await w.write(envelope()); await w.close();
    fileChip('saved', `Saved to ${fileHandle.name}`);
  } catch (e) { fileChip('error', `Couldn’t save: ${e.message}`); }
}

async function saveAs(btn) {
  if (window.showSaveFilePicker) {
    try { fileHandle = await showSaveFilePicker({ suggestedName: 'picks.json', types: [{ description: 'UI picks', accept: { 'application/json': ['.json'] } }] }); }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  if (fileHandle) return busy(btn, writeFile);
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([envelope()], { type: 'application/json' })), download: 'picks.json' });
  a.click(); URL.revokeObjectURL(a.href);
  fileChip('saved', 'Downloaded picks.json');
}

async function load() {
  let file;
  if (window.showOpenFilePicker) {
    try { [fileHandle] = await showOpenFilePicker({ types: [{ description: 'UI picks', accept: { 'application/json': ['.json'] } }] }); file = await fileHandle.getFile(); }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  if (!file) {
    const inp = Object.assign(document.createElement('input'), { type: 'file', accept: '.json,application/json' });
    file = await new Promise(r => { inp.onchange = () => r(inp.files[0]); inp.click(); });
    if (!file) return;
  }
  try {
    if (file.size > 1e6) throw new Error('file too large');
    const d = JSON.parse(await file.text());
    if (d.app !== 'ui-picker') throw new Error('not a ui-picker file');
    S.picks = Object.fromEntries(Object.entries(d.picks || {}).filter(([k]) => CAT[k])
      .map(([k, p]) => [k, { variants: (p.variants || []).filter(v => CAT[k].variants.some(x => x.id === v)), note: String(p.note || '') }]));
    applyFoundations(); changed();
    fileChip('saved', fileHandle ? `Editing ${fileHandle.name}` : `Loaded ${file.name}`);
  } catch (e) { fileHandle = null; fileChip('error', `Couldn’t load: ${e.message}`); }
}

function resetPicks() {
  const before = structuredClone(S.picks);
  S.picks = {}; applyFoundations(); changed();
  toast(document.body, 'All picks cleared', { undo: () => { S.picks = before; applyFoundations(); changed(); }, host: $('#global-toasts') });
}

async function busy(btn, fn) {
  btn.disabled = true; btn.classList.add('busy');
  try { await fn(); } finally { btn.disabled = false; btn.classList.remove('busy'); }
}

// ---------- demo behaviours ----------
function toast(stage, msg, { undo, kind = 'inverted', host } = {}) {
  host ||= $('.toast-host', stage);
  const pos = { inverted: 'left:50%;bottom:12px;translate:-50%', card: 'right:12px;bottom:12px', pill: 'left:50%;top:12px;translate:-50%', stack: 'left:12px;bottom:12px;flex-direction:column-reverse' };
  if (!host.id) host.style.cssText = pos[kind] || pos.inverted;
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.innerHTML = `<span>${msg}</span>${undo ? '<button>Undo</button>' : ''}`;
  host.append(t);
  const close = () => { t.classList.add('out'); setTimeout(() => t.remove(), 250); };
  if (undo) $('button', t).onclick = () => { undo(); close(); };
  setTimeout(close, 4000);
}

function removeRows(stage, list, kind) {
  list.forEach(r => r.classList.add('gone'));
  setTimeout(() => list.forEach(r => { r.hidden = true; r.classList.remove('gone', 'sel'); }), 220);
  updateSel(stage);
  toast(stage, list.length > 1 ? `Deleted ${list.length} rows` : `Deleted “${$('.name', list[0])?.textContent || $('.cell', list[0])?.value}”`,
    { kind, undo: () => list.forEach(r => { r.hidden = false; }) });
}

function duplicate(row) {
  const copy = row.cloneNode(true);
  copy.classList.remove('sel');
  const n = $('.name', copy); if (n) n.textContent += ' copy';
  row.after(copy);
  copy.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
}

function startEdit(span) {
  const before = span.textContent;
  span.contentEditable = 'true'; span.focus();
  getSelection().selectAllChildren(span);
  const end = (revert) => { if (revert) span.textContent = before; span.contentEditable = 'false'; span.removeEventListener('keydown', key); };
  const key = e => { if (e.key === 'Enter') { e.preventDefault(); span.blur(); } if (e.key === 'Escape') { end(true); } };
  span.addEventListener('keydown', key);
  span.addEventListener('blur', () => end(false), { once: true });
}

function updateSel(stage) {
  const n = $$('.row.sel:not([hidden])', stage).length;
  $$('[data-selcount]', stage).forEach(el => el.textContent = n);
  $('.bulkbar', stage)?.classList.toggle('hide', !n);
  $$('.seltools button', stage).forEach(b => b.disabled = !n);
  $$('.row', stage).forEach(r => $('.cb', r)?.classList.toggle('on', r.classList.contains('sel')));
  const all = $('[data-a="cball"]', stage);
  if (all) all.classList.toggle('on', n > 0 && n === $$('.row:not([hidden])', stage).length);
}

function placeThumb(s) {
  const on = $('button.on', s), th = $('.thumb', s);
  if (on && th) { th.style.left = on.offsetLeft + 'px'; th.style.width = on.offsetWidth + 'px'; }
}

function closePops(except) { $$('.pop.open').forEach(p => { if (p !== except) p.classList.remove('open'); }); }

const ACT = {
  pick: (b) => togglePick(b.closest('.card')),
  pop: (b, st, e) => { const p = b.nextElementSibling; closePops(p); p.classList.toggle('open'); $('[data-filter]', p)?.focus(); e.stopPropagation(); },
  edit: (b) => { closePops(); const row = b.closest('.row') || st_ctxRow; const n = $('.name', row); if (n) startEdit(n); },
  dup: (b) => { closePops(); duplicate(b.closest('.row') || st_ctxRow); },
  del: (b, st) => { closePops(); removeRows(st, [b.closest('.row') || st_ctxRow]); },
  askdel: (b, st) => { st._pending = b.closest('.row'); $('[data-target]', st).textContent = $('.name', st._pending).textContent; $('.scrim', st).classList.add('open'); },
  'scrim-ok': (b, st) => { $('.scrim', st).classList.remove('open'); if (st._pending) { const r = st._pending; r.classList.add('gone'); setTimeout(() => r.hidden = true, 220); } },
  close: (b, st) => (b.closest('.scrim') || $('.scrim', st)).classList.remove('open'),
  modal: (b, st) => (b.nextElementSibling?.classList.contains('scrim') ? b.nextElementSibling : $('.scrim', st)).classList.add('open'),
  twostep: (b, st) => {
    if (b.dataset.armed) return removeRows(st, [b.closest('.row')]);
    b.dataset.armed = 1; b.textContent = 'Sure?'; b.classList.add('danger');
    setTimeout(() => { delete b.dataset.armed; b.textContent = 'Delete'; b.classList.remove('danger'); }, 3000);
  },
  archive: (b, st) => {
    const row = b.closest('.row');
    row.querySelector('.acts').innerHTML = ib('restore', 'restore', 'Restore');
    $('[data-archived]', st).append(row);
    $('[data-acount]', st).textContent = $$('[data-archived] .row', st).length;
    toast(st, 'Archived');
  },
  restore: (b, st) => {
    const row = b.closest('.row');
    row.querySelector('.acts').innerHTML = ib('archive', 'archive', 'Archive');
    $('[data-live]', st).append(row);
    $('[data-acount]', st).textContent = $$('[data-archived] .row', st).length;
  },
  toggle: (b) => b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'),
  seg: (b) => { $$('button', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); placeThumb(b.parentElement); },
  tab: (b) => $$('button', b.parentElement).forEach(x => x.classList.toggle('on', x === b)),
  cb: (b) => b.classList.toggle('on'),
  sw: (b) => b.classList.toggle('on'),
  chipone: (b) => $$('button.btn', b.parentElement).forEach(x => x.classList.toggle('soft', x === b)),
  month: (b) => { $$('[data-a="month"]', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); setLabel(b, `${b.textContent} 2026`); },
  cal: (b) => { $$('[data-a="cal"]', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); setLabel(b, `${b.textContent} Mar 2026`); },
  opt: (b) => { $$('[data-a="opt"]', b.parentElement).forEach(x => x.classList.toggle('on', x === b)); setLabel(b, $('[data-v]', b).textContent); },
  dot: (b) => {
    $$('.dot-c', b.parentElement).forEach(x => x.classList.toggle('on', x === b));
    const anchor = b.closest('.anchor'); if (!anchor) return;
    const c = b.getAttribute('aria-label');
    $('.trig', anchor).style.background = c;
    if ($('[data-hex]', anchor)) { $('[data-hex]', anchor).textContent = c; $('.pop .field', anchor).value = c; }
    closePops();
  },
  addf: (b, st) => {
    closePops();
    const chip = document.createElement('span'); chip.className = 'chip acc';
    chip.innerHTML = `${b.textContent} <button class="ib" style="width:16px;height:16px" data-a="rmf">${I.x}</button>`;
    b.closest('.anchor').before(chip); b.remove(); nOfM(st);
  },
  rmf: (b, st) => { b.closest('.chip').remove(); nOfM(st); },
  pane: (b) => b.closest('.side').classList.toggle('collapsed'),
  drawer: (b) => $('.drawer', b.closest('.panes')).classList.toggle('open'),
  themeicon: (b) => { const dark = b.dataset.dark !== '0'; b.dataset.dark = dark ? '0' : '1'; b.innerHTML = dark ? I.sun : I.moon; },
  up: (b) => { const r = b.closest('.row'); r.previousElementSibling?.before(r); },
  down: (b) => { const r = b.closest('.row'); r.nextElementSibling?.after(r); },
  bulkdel: (b, st) => removeRows(st, $$('.row.sel', st)),
  bulkdup: (b, st) => $$('.row.sel', st).reverse().forEach(duplicate),
  seledit: (b, st) => { const r = $('.row.sel', st); if (r) startEdit($('.name', r)); },
  selnone: (b, st) => { $$('.row.sel', st).forEach(r => r.classList.remove('sel')); updateSel(st); },
  cball: (b, st) => { const on = !b.classList.contains('on'); $$('.row:not([hidden])', st).forEach(r => r.classList.toggle('sel', on)); updateSel(st); },
  cbsel: (b, st) => { b.closest('.row').classList.toggle('sel'); updateSel(st); },
  toast: (b, st) => {
    const kind = b.dataset.kind;
    if (kind === 'chip') { const c = $('[data-statuschip]', st); c.textContent = 'Deleted “Kick drum” · ⌘Z to undo'; c.classList.add('acc'); setTimeout(() => { c.textContent = 'All saved'; c.classList.remove('acc'); }, 3000); return; }
    toast(st, 'Deleted “Kick drum”', { kind, undo: () => {} });
  },
  busy: (b, st) => {
    if (b.disabled) return;
    const kind = b.dataset.kind, lbl = $('.lbl', b), text = lbl.textContent;
    if (kind === 'chip') { const c = $('[data-busychip]', st); c.dataset.s = 'saving'; c.lastElementChild.textContent = 'Saving…'; setTimeout(() => { c.dataset.s = 'saved'; c.lastElementChild.textContent = 'Saved · just now'; }, 1200); return; }
    b.disabled = true; b.classList.add('busy');
    if (kind === 'text' || kind === 'spin') lbl.textContent = kind === 'text' ? 'Saving…' : text;
    setTimeout(() => {
      b.classList.remove('busy'); lbl.textContent = kind === 'bar' ? 'Exported ✓' : 'Saved ✓';
      setTimeout(() => { lbl.textContent = text; b.disabled = false; }, 1000);
    }, 1200);
  },
  // ---- added with variants-more.js ----
  next: (b) => { const n = nextOpen(b.closest('section.cat').id.slice(4)); if (n) goTo(n.id); },
  popx: () => closePops(),
  clearf: (b) => { const i = $('input', b.parentElement); i.value = ''; i.focus(); i.dispatchEvent(new Event('input', { bubbles: true })); },
  expand: (b) => { const x = b.closest('.xsearch'); x.classList.add('open'); $('input', x).focus(); },
  sorth: (b) => {
    const tbl = b.closest('.tbl'), col = +b.dataset.col, dir = tbl.dataset.sortcol === String(col) && tbl.dataset.dir === '1' ? -1 : 1;
    sortTable(tbl, col, dir);
    $$('.th button', tbl).forEach(h => $('.sa', h).textContent = h === b ? (dir > 0 ? ' ↑' : ' ↓') : '');
  },
  flipdir: (b, st) => { const t = $('.tbl', st); b.innerHTML = t.dataset.dir === '-1' ? I.up : I.down; sortTable(t, +(t.dataset.sortcol || 0), t.dataset.dir === '-1' ? 1 : -1); },
  tabpane: (b) => {
    const box = b.closest('[data-tabs]'), btns = $$('[data-a="tabpane"]', box), i = btns.indexOf(b);
    btns.forEach(x => x.classList.toggle('on', x === b));
    $$('[data-p]', box).forEach((p, k) => p.hidden = k !== i);
    requestAnimationFrame(() => $$('.seg', box).forEach(placeThumb));
  },
  wnext: (b) => wizard(b.closest('.wiz'), 1),
  wback: (b) => wizard(b.closest('.wiz'), -1),
  vnext: (b) => {
    const vs = b.closest('.vs'), nx = vs.nextElementSibling;
    vs.classList.remove('on'); vs.classList.add('done');
    if (nx) nx.classList.add('on'); else vs.parentElement.classList.add('all');
  },
  vopen: (b) => {
    const vs = b.closest('.vs'), box = vs.parentElement;
    if (box.classList.contains('all') && vs === box.lastElementChild && vs.classList.contains('done')) { box.classList.remove('all'); $$('.vs', box).forEach((x, i) => x.className = i ? 'vs' : 'vs on'); return; }
    $$('.vs', box).forEach(x => x.classList.toggle('on', x === vs));
  },
  loadmore: (b, st) => {
    const l = $('[data-more]', st), n = l.children.length;
    l.insertAdjacentHTML('beforeend', rows('', { n: 3 }));
    $$('.row', l).slice(n).forEach((r, i) => r.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: ms('--t-pop'), delay: i * 60, easing: easing(), fill: 'backwards' }));
    l.scrollTo({ top: l.scrollHeight, behavior: 'smooth' });
    if (n + 3 >= 9) { b.disabled = true; b.textContent = 'All 9 shown'; }
  },
  page: (b, st) => {
    ACT.tab(b);
    const l = $('[data-pagelist]', st), k = +b.textContent - 1;
    $$('.name', l).forEach((s, i) => s.textContent = NAMES[(i + k * 3) % NAMES.length]);
    l.animate([{ opacity: .3 }, { opacity: 1 }], { duration: ms('--t-pop'), easing: easing() });
  },
  step: (b) => { const i = $('input', b.parentElement); i.value = Math.max(0, (+i.value || 0) + +b.dataset.d); },
  rmchip: (b) => { const c = b.closest('.chip'), f = c.parentElement; c.remove(); $('input', f)?.focus(); },
  tagcb: (b, st) => { $('.cb', b).classList.toggle('on'); const on = $$('.mi', b.parentElement).filter(m => $('.cb.on', m)).map(m => m.textContent.trim()); $('[data-tagsum]', st).textContent = on.join(', ') || 'No tags'; },
  tgchip: (b) => b.classList.toggle('acc'),
  replay: (b, st) => { const r = $('[data-replay]', st); r.replaceWith(r.cloneNode(true)); },
  seen: (b) => b.classList.add('seen'),
  validate: (b, st) => {
    const bad = $$('input[required]', st).filter(i => !i.value.trim() || !i.checkValidity());
    $$('input[required]', st).forEach(i => i.classList.toggle('bad', bad.includes(i)));
    const sum = $('.vsum', st);
    sum.hidden = !bad.length;
    sum.innerHTML = `${I.alert}<span>${bad.length === 1 ? 'Fix 1 field' : `Fix ${bad.length} fields`}: ${bad.map(i => i.closest('label').firstChild.textContent.trim()).join(', ')}</span>`;
    if (bad.length) bad[0].focus(); else toast(st, 'Saved');
  },
  discard: (b, st) => { const box = $('[data-dirtybox]', st); $$('input', box).forEach(i => i.value = i.defaultValue); box.classList.remove('is-dirty'); },
  savebar: (b, st) => { const box = $('[data-dirtybox]', st); $$('input', box).forEach(i => i.defaultValue = i.value); box.classList.remove('is-dirty'); toast(st, 'Saved'); },
  usave: (b, st) => $('[data-unsaved]', st).classList.remove('is-dirty'),
  dismiss: (b) => b.closest('.dzw').classList.add('closed'),
  undismiss: (b, st) => $$('.dzw', st).forEach(d => d.classList.remove('closed')),
  gsdone: (b) => { b.closest('.gs-it').classList.add('closed'); gsCount(b.closest('.gs')); },
  gsreset: (b) => { const g = b.closest('.gs'); $$('.gs-it', g).forEach(i => i.classList.remove('closed')); gsCount(g); },
  coachnext: (b) => coach(b.closest('.coachbox'), 1),
  coachskip: (b) => coach(b.closest('.coachbox'), 99),
  coachreplay: (b) => coach(b.closest('.coachbox'), -99),
  copied: (b, st) => {
    const k = b.dataset.kind;
    if (b._t) return;
    if (k === 'toast') return toast(st, 'Link copied');
    const keep = k === 'icon' ? b.innerHTML : k === 'tip' ? b.dataset.tip : $('.lbl', b).textContent;
    if (k === 'icon') { b.innerHTML = I.check; b.classList.add('ok'); }
    else if (k === 'tip') { b.dataset.tip = 'Copied ✓'; b.classList.add('tip-on'); }
    else $('.lbl', b).textContent = 'Copied ✓';
    b._t = setTimeout(() => {
      b._t = null;
      if (k === 'icon') { b.innerHTML = keep; b.classList.remove('ok'); }
      else if (k === 'tip') { b.dataset.tip = keep; b.classList.remove('tip-on'); }
      else $('.lbl', b).textContent = keep;
    }, 1400);
  },
  sample: (b) => {
    const box = b.closest('[data-samplebox]');
    box._orig = box.innerHTML; box.classList.add('filled');
    box.innerHTML = `<div class="list ld-stg" style="width:100%">${rows('', { n: 4 })}</div><button class="btn quiet sm" data-a="unsample">Clear the sample</button>`;
  },
  unsample: (b) => { const box = b.closest('[data-samplebox]'); box.innerHTML = box._orig; box.classList.remove('filled'); },
};
function sortTable(tbl, col, dir) {
  tbl.dataset.sortcol = col; tbl.dataset.dir = dir;
  const trs = $$('.tr:not(.th)', tbl), num = s => parseFloat(s.replace(/\D+/g, ''));
  const val = r => r.children[col].textContent;
  const sorted = [...trs].sort((a, b) => { const x = val(a), y = val(b); return dir * (isNaN(num(x)) ? x.localeCompare(y) : num(x) - num(y)); });
  flip(trs, () => tbl.append(...sorted));
}
// FLIP: elements glide from where they were to where `mutate` put them
function flip(els, mutate) {
  const r0 = new Map(els.map(e => [e, e.getBoundingClientRect().top]));
  mutate();
  const dur = ms('--t-slow');
  if (dur) els.forEach(e => { const dy = r0.get(e) - e.getBoundingClientRect().top; if (dy) e.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: dur, easing: easing() }); });
}
function wizard(w, d) {
  const t = w.dataset.t.split('|'), last = t.length - 1;
  let i = +w.dataset.step + d;
  if (i > last) i = 0;
  i = Math.max(0, i);
  w.dataset.step = i;
  const body = $('.wbody', w);
  body.textContent = t[i];
  body.animate([{ opacity: 0, transform: `translateX(${d * 10}px)` }, { opacity: 1, transform: 'none' }], { duration: ms('--t-pop'), easing: easing() });
  $$('.ws', w).forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('done', k < i); });
  $('[data-a="wnext"]', w).textContent = i === last ? 'Start over' : i === last - 1 ? 'Finish' : 'Next';
  $('[data-a="wback"]', w).disabled = i === 0 || i === last;
}
function gsCount(g) {
  const all = $$('.gs-it', g), n = all.filter(i => i.classList.contains('closed')).length;
  $('[data-gsn]', g).textContent = `${n} of ${all.length}`;
  $('[data-gsbar]', g).style.width = `${(n / all.length) * 100}%`;
  g.classList.toggle('all', n === all.length);
}
function coach(box, d) {
  const ts = $$('[data-ct]', box), i = d === -99 ? 0 : Math.min(ts.length, +box.dataset.coach + d), bub = $('.coach', box);
  box.dataset.coach = i;
  ts.forEach((t, k) => t.classList.toggle('coach-on', k === i));
  box.classList.toggle('coach-off', i >= ts.length);
  const t = ts[i];
  if (!t) return;
  const [title, text] = t.dataset.ct.split('|');
  $('[data-ctt]', box).textContent = title; $('[data-ctd]', box).textContent = text;
  $('[data-ctn]', box).textContent = `${i + 1} of ${ts.length}`;
  $('[data-a="coachnext"]', box).textContent = i === ts.length - 1 ? 'Done' : 'Next';
  const r = t.getBoundingClientRect(), b = box.getBoundingClientRect();
  const left = Math.max(6, Math.min(r.left - b.left + r.width / 2 - 100, b.width - 206));
  bub.style.left = left + 'px'; bub.style.top = r.bottom - b.top + 10 + 'px';
  bub.style.setProperty('--ax', r.left - b.left + r.width / 2 - left + 'px');
}
let st_ctxRow = null;

function setLabel(b, text) { const a = b.closest('.anchor'); const l = a && $('[data-lbl]', a); if (l) l.textContent = text; closePops(); }
function nOfM(st) { const n = $$('[data-filters] .chip', st).length; $('[data-nofm]', st).textContent = `${Math.max(1, 12 - n * 3)} of 12`; }

document.addEventListener('click', e => {
  const b = e.target.closest('[data-a]');
  if (!b) return;
  const st = b.closest('.stage');
  ACT[b.dataset.a]?.(b, st, e);
  if (b.dataset.a === 'opt' && b.closest('[data-sortmenu]')) { const t = $('.tbl', st); sortTable(t, ['Name', 'Ch', 'Type'].indexOf($('[data-v]', b).textContent), +(t.dataset.dir || 1)); }
});
// nav links glide instead of jumping
$('#nav').addEventListener('click', e => {
  const a = e.target.closest('a[data-nav]');
  if (!a || e.metaKey || e.ctrlKey) return;
  e.preventDefault(); clearTimeout(advTimer); goTo(a.dataset.nav);
});
// expanding search folds back when left empty
document.addEventListener('focusout', e => {
  const x = e.target.closest?.('.xsearch');
  if (x && !e.target.value && !x.contains(e.relatedTarget)) x.classList.remove('open');
});
// demos that react to typing
document.addEventListener('input', e => {
  const t = e.target, st = t.closest('.stage');
  if (!st) return;
  if (t.dataset.rowfilter !== undefined) {
    const q = t.value.trim().toLowerCase(), rs = $$('.list .row', st);
    rs.forEach(r => r.hidden = !$('.name', r).textContent.toLowerCase().includes(q));
    $('[data-matchn]', st).textContent = `${rs.filter(r => !r.hidden).length} of ${rs.length}`;
  }
  if (t.dataset.out !== undefined) t.nextElementSibling.textContent = `${t.value > 0 ? '+' : ''}${t.value} dB`;
  if (t.classList.contains('vlive')) {
    const h = t.nextElementSibling;
    h.textContent = !t.value ? '' : t.checkValidity() ? '✓ Looks good' : 'Keep going: name@domain';
    h.classList.toggle('ok', t.checkValidity() && !!t.value);
  }
  if (t.dataset.autosave !== undefined) {
    const s = $('[data-asv]', t.closest('label'));
    s.textContent = 'Saving…'; s.className = 'asv on';
    clearTimeout(t._as); t._as = setTimeout(() => { s.textContent = '✓ Saved'; s.className = 'asv on ok'; }, 700);
  }
  t.closest('[data-dirtybox]')?.classList.add('is-dirty');
  const u = t.closest('[data-unsaved]');
  if (u) {
    u.classList.add('is-dirty');
    const chip = $('.file-chip', u);
    if (chip && u.dataset.unsaved === 'chip') {
      chip.dataset.s = 'saving'; chip.lastElementChild.textContent = 'Saving…';
      clearTimeout(u._as); u._as = setTimeout(() => { chip.dataset.s = 'saved'; chip.lastElementChild.textContent = 'Saved · just now'; }, 900);
    }
  }
});
document.addEventListener('keydown', e => {
  const t = e.target;
  if (e.key === 'Escape' && t.closest?.('.sfield') && t.value) { t.value = ''; t.dispatchEvent(new Event('input', { bubbles: true })); }
  if (t.dataset?.tagin === undefined) return;
  if (e.key === 'Enter' && t.value.trim()) {
    e.preventDefault();
    const c = document.createElement('span');
    c.className = 'chip acc'; c.innerHTML = `<span></span><button class="ib xs" data-a="rmchip">${I.x}</button>`;
    c.firstChild.textContent = t.value.trim().slice(0, 24);
    t.before(c); t.value = '';
  } else if (e.key === 'Backspace' && !t.value) t.previousElementSibling?.closest('.chip')?.remove();
});
// infinite list: more rows when scrolled near the end
document.addEventListener('scroll', e => {
  const l = e.target;
  if (!(l instanceof Element) || l.dataset.infinite === undefined || l._busy) return;
  const n = $$('.row', l).length;
  if (n >= 20 || l.scrollTop + l.clientHeight < l.scrollHeight - 24) return;
  l._busy = true;
  l.insertAdjacentHTML('beforeend', '<div class="row ldrow"><span class="spin" style="display:inline-block"></span><span class="muted small">Loading…</span></div>');
  setTimeout(() => {
    $('.ldrow', l).remove(); l.insertAdjacentHTML('beforeend', rows('', { n: 5 })); l._busy = false;
    l.closest('.stage').querySelector('[data-loaded]').textContent = `${Math.min(20, n + 5)} of 20 loaded`;
  }, 600);
}, true);
document.addEventListener('pointerdown', e => { if (!e.target.closest('.pop, [data-a="pop"]')) closePops(); });

// selection on .selectable rows
let anchorRow = null;
document.addEventListener('click', e => {
  const row = e.target.closest('.selectable .row');
  if (!row || e.target.closest('button, .cb, input, [contenteditable="true"]')) return;
  const st = row.closest('.stage'), all = $$('.row:not([hidden])', row.parentElement);
  if (e.shiftKey && anchorRow) {
    const [a, z] = [all.indexOf(anchorRow), all.indexOf(row)].sort((x, y) => x - y);
    all.forEach((r, i) => r.classList.toggle('sel', i >= a && i <= z));
  } else if (e.metaKey || e.ctrlKey || row.parentElement.classList.contains('checks')) { row.classList.toggle('sel'); anchorRow = row; }
  else { all.forEach(r => r.classList.toggle('sel', r === row)); anchorRow = row; }
  updateSel(st);
});

// inline edit triggers
document.addEventListener('dblclick', e => { const s = e.target.closest('.edit[data-edit="dbl"]'); if (s) startEdit(s); });
document.addEventListener('click', e => { const s = e.target.closest('.edit[data-edit="click"]'); if (s && s.contentEditable !== 'true') startEdit(s); });

// right-click menu
document.addEventListener('contextmenu', e => {
  const row = e.target.closest('[data-ctx] .row');
  if (!row) return;
  e.preventDefault();
  const st = row.closest('.stage'), pop = $('.pop.ctx', st), r = st.getBoundingClientRect();
  st_ctxRow = row; closePops(pop);
  pop.style.left = Math.min(e.clientX - r.left, r.width - 180) + 'px';
  pop.style.top = Math.min(e.clientY - r.top, r.height - 130) + 'px';
  pop.classList.add('open');
});

// keyboard on rows: Alt+↑/↓ move, F2/Enter rename, ⇧F10 context menu
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePops(); $$('.scrim.open').forEach(s => s.classList.remove('open')); }
  const row = e.target.classList?.contains('row') ? e.target : null;
  if (!row) return;
  if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
    e.preventDefault();
    if (e.key === 'ArrowUp') row.previousElementSibling?.before(row); else row.nextElementSibling?.after(row);
    row.focus();
  } else if (e.key === 'F2' || e.key === 'Enter') { const n = $('.edit', row) || $('.name', row); if (n) { e.preventDefault(); startEdit(n); } }
  else if (e.key === 'F10' && e.shiftKey && row.closest('[data-ctx]')) {
    e.preventDefault(); const r = row.getBoundingClientRect();
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 40, clientY: r.bottom }));
  }
});

// note fields
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.note) { (S.picks[t.dataset.note] ||= { variants: [], note: '' }).note = t.value; changed(); }
  if (t.dataset.filter !== undefined) $$('[data-a="opt"]', t.parentElement).forEach(o => o.hidden = !o.textContent.toLowerCase().includes(t.value.toLowerCase()));
});

// pointer drags: grip reorder, pane resize, rubber band
document.addEventListener('pointerdown', e => {
  const grip = e.target.closest('.reorder .grip');
  if (grip && grip.closest('[data-drop]')) return dropDrag(e, grip);
  const scrub = e.target.closest('[data-scrub]');
  if (scrub) {
    const inp = $('input', scrub.parentElement), x0 = e.clientX, v0 = +inp.value || 0;
    scrub.setPointerCapture(e.pointerId); scrub.classList.add('drag'); e.preventDefault();
    const move = ev => inp.value = Math.max(-24, Math.min(12, v0 + Math.round((ev.clientX - x0) / 4)));
    scrub.addEventListener('pointermove', move);
    scrub.addEventListener('pointerup', () => { scrub.classList.remove('drag'); scrub.removeEventListener('pointermove', move); }, { once: true });
    return;
  }
  if (grip) {
    const row = grip.closest('.row'), list = row.parentElement;
    row.classList.add('dragging'); grip.setPointerCapture(e.pointerId);
    const move = ev => {
      const over = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.row');
      if (!over || over === row || over.parentElement !== list) return;
      const r = over.getBoundingClientRect();
      ev.clientY < r.top + r.height / 2 ? over.before(row) : over.after(row);
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', () => { row.classList.remove('dragging'); grip.removeEventListener('pointermove', move); }, { once: true });
    return;
  }
  const rz = e.target.closest('.rz');
  if (rz) {
    const left = rz.dataset.side === 'left', side = left ? rz.previousElementSibling : rz.nextElementSibling;
    if (side.classList.contains('collapsed')) return;
    const x0 = e.clientX, w0 = side.offsetWidth;
    rz.classList.add('drag'); rz.setPointerCapture(e.pointerId); side.style.transition = 'none';
    const move = ev => side.style.width = Math.max(80, Math.min(200, w0 + (left ? 1 : -1) * (ev.clientX - x0))) + 'px';
    rz.addEventListener('pointermove', move);
    rz.addEventListener('pointerup', () => { rz.classList.remove('drag'); side.style.transition = ''; rz.removeEventListener('pointermove', move); }, { once: true });
    return;
  }
  const area = e.target.closest('.band-area');
  if (area && e.target === area) {
    const r = area.getBoundingClientRect(), x0 = e.clientX - r.left, y0 = e.clientY - r.top;
    const band = document.createElement('div'); band.className = 'band' + (area.dataset.band === 'fill' ? ' fill' : '');
    area.append(band); area.setPointerCapture(e.pointerId);
    $$('.it', area).forEach(i => i.classList.remove('sel'));
    const move = ev => {
      const x = ev.clientX - r.left, y = ev.clientY - r.top;
      const box = { l: Math.min(x, x0), t: Math.min(y, y0), r: Math.max(x, x0), b: Math.max(y, y0) };
      Object.assign(band.style, { left: box.l + 'px', top: box.t + 'px', width: box.r - box.l + 'px', height: box.b - box.t + 'px' });
      $$('.it', area).forEach(i => {
        const ir = { l: i.offsetLeft, t: i.offsetTop, r: i.offsetLeft + i.offsetWidth, b: i.offsetTop + i.offsetHeight };
        i.classList.toggle('sel', ir.l < box.r && ir.r > box.l && ir.t < box.b && ir.b > box.t);
      });
    };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerup', () => { band.remove(); area.removeEventListener('pointermove', move); }, { once: true });
  } else if (e.target.closest('.band-area .it')) e.target.classList.toggle('sel');
});
// drag with a landing line (and optionally a lifted copy); rows only move on drop, then glide into place
function dropDrag(e, grip) {
  const row = grip.closest('.row'), list = row.parentElement, ghost = list.dataset.drop === 'ghost';
  const lr = list.getBoundingClientRect(), rr = row.getBoundingClientRect(), dy0 = e.clientY - rr.top;
  const line = document.createElement('i'); line.className = 'dropline'; list.append(line);
  let g = null, target = null, after = false;
  if (ghost) { g = row.cloneNode(true); g.className = 'row ghostrow'; g.style.width = rr.width + 'px'; list.append(g); }
  row.classList.add('lifted'); grip.setPointerCapture(e.pointerId);
  const move = ev => {
    if (g) g.style.top = ev.clientY - lr.top - dy0 + 'px';
    const rs = $$('.row:not(.ghostrow)', list);
    target = rs.find(r => ev.clientY < r.getBoundingClientRect().bottom) || rs.at(-1);
    const r = target.getBoundingClientRect();
    after = ev.clientY > r.top + r.height / 2;
    line.style.top = (after ? r.bottom : r.top) - lr.top - 1 + 'px';
    line.classList.add('on');
  };
  move(e);
  grip.addEventListener('pointermove', move);
  grip.addEventListener('pointerup', () => {
    grip.removeEventListener('pointermove', move);
    line.remove(); g?.remove(); row.classList.remove('lifted');
    if (target && target !== row) flip($$('.row', list), () => after ? target.after(row) : target.before(row));
  }, { once: true });
}
document.addEventListener('dblclick', e => {
  const rz = e.target.closest('.rz');
  if (rz) (rz.dataset.side === 'left' ? rz.previousElementSibling : rz.nextElementSibling).style.width = '';
});

// ---------- top bar ----------
$('#save-btn').onclick = e => saveAs(e.currentTarget);
$('#load-btn').onclick = load;
$('#reset-btn').onclick = resetPicks;
$('#theme-btn').onclick = () => {
  S.theme = ROOT.dataset.theme === 'dark' ? 'light' : 'dark';
  applyFoundations(); changed();
};
document.addEventListener('keydown', e => {
  // e.code too: Caps Lock / ⇧ / non-Latin layouts don't give key 's'; capture so no demo handler sees it first
  if ((e.metaKey || e.ctrlKey) && !e.altKey && (e.code === 'KeyS' || e.key.toLowerCase() === 's')) {
    e.preventDefault(); if (!e.repeat) fileHandle ? writeFile() : saveAs($('#save-btn'));
  }
}, true);
let spyRaf;
$('main').addEventListener('scroll', () => { cancelAnimationFrame(spyRaf); spyRaf = requestAnimationFrame(spy); }, { passive: true });
STOPS.forEach(ev => $('main').addEventListener(ev, () => { navLock = 0; }, { passive: true }));   // a hand on the page takes over
addEventListener('resize', () => placeHl(false));

render();
applyFoundations();
paint();
spy();
$$('.stage').forEach(updateSel);
document.fonts?.ready.then(() => { $$('.seg').forEach(placeThumb); $$('.coachbox').forEach(b => coach(b, 0)); });
// on open: the nav glides down past what's picked, the page glides to the first section still to pick
navReady = true;
setTimeout(() => {
  const nav = $('#nav'), to = nav.scrollTop;
  nav.scrollTop = 0; glide(nav, to, ms('--t-slow') * 1.4);
  const first = CATEGORIES.find(c => !picked(c.id).length);
  if (first && !location.hash && Object.keys(S.picks).length) goTo(first.id);
}, 350);
