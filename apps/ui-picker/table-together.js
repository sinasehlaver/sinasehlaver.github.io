// "Table: everything together" demo behaviour (category table-together). Self-contained: no data-a, no .row,
// so none of the generic list handlers in picker.js touch it. Loaded after picker.js (uses its toast/closePops/startEdit/flip).
(() => {
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const vis = t => qa('.tt-tr:not(.tt-th):not([hidden])', t);
  const secs = s => { const [m, x] = s.split(':'); return +m * 60 + +x; };
  const COLS = [t => t, t => t, t => t, t => +t, t => secs(t)];   // song, artist, key, bpm, length
  let anchor = null, ctxRow = null;

  function sync(t) {
    const rs = vis(t), sel = rs.filter(r => r.classList.contains('sel'));
    rs.forEach(r => q('.cb', r).classList.toggle('on', r.classList.contains('sel')));
    const all = q('.tt-th .cb', t);
    all.classList.toggle('on', sel.length > 0 && sel.length === rs.length);
    all.classList.toggle('part', sel.length > 0 && sel.length < rs.length);
    q('[data-tt-n]', t).textContent = sel.length;
    q('.tt-bulk', t).classList.toggle('hide', !sel.length);
    const sorted = !!t._sort;
    q('.tt-reset', t).classList.toggle('hide', !sorted);
    t.classList.toggle('sorted', sorted);
    qa('.tt-grip', t).forEach(g => g.dataset.tip = sorted ? 'Go back to the original order to reorder' : 'Drag to reorder');
    qa('.tt-th button', t).forEach(b => {
      const on = t._sort && +b.dataset.ttSort === t._sort.col;
      q('.sa', b).textContent = on ? (t._sort.dir > 0 ? '▲' : '▼') : '';
    });
  }

  function order(t, list) {
    const body = q('.tt-body', t);
    flip(qa('.tt-tr:not(.tt-th)', t), () => body.append(...list));
  }

  function sortBy(t, col) {
    const body = q('.tt-body', t);
    if (!t._sort) t._snap = qa('.tt-tr', body);                       // remember the order to come back to
    const s = t._sort;
    if (!s || s.col !== col) t._sort = { col, dir: 1 };
    else if (s.dir === 1) t._sort = { col, dir: -1 };
    else { restore(t); return; }
    const { dir } = t._sort, f = COLS[col];
    const val = r => f(r.children[r.querySelector('.tt-grip') ? col + 2 : col + 1].textContent);
    order(t, qa('.tt-tr', body).sort((a, b) => { const x = val(a), y = val(b); return dir * (typeof x === 'number' ? x - y : x.localeCompare(y)); }));
    sync(t);
  }

  function restore(t) {
    const cur = qa('.tt-tr', q('.tt-body', t)), base = t._snap.filter(r => cur.includes(r));
    cur.filter(r => !base.includes(r)).forEach(r => base.splice(base.indexOf(r._src) + 1, 0, r));   // copies stay after their source
    t._sort = null; order(t, base); sync(t);
  }

  function dup(t, row) {
    const c = row.cloneNode(true);
    c.classList.remove('sel'); c._src = row;
    qa('.tt-t', c)[0].textContent += ' copy'; q('.tt-w', c).dataset.tip += ' copy';
    row.after(c);
    if (t._snap) t._snap.splice(t._snap.indexOf(row) + 1, 0, c);
    c.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  }

  function del(t, list) {
    list.forEach(r => r.classList.add('gone'));
    setTimeout(() => { list.forEach(r => { r.hidden = true; r.classList.remove('gone', 'sel'); }); sync(t); }, 220);
    const name = q('.tt-t', list[0]).textContent;
    toast(t.closest('.stage'), list.length > 1 ? `Deleted ${list.length} songs` : `Deleted “${name}”`, { undo: () => { list.forEach(r => r.hidden = false); sync(t); } });
  }

  function select(t, row, e) {
    const all = vis(t);
    if (e.shiftKey && anchor && all.includes(anchor)) {
      const [a, z] = [all.indexOf(anchor), all.indexOf(row)].sort((x, y) => x - y);
      all.forEach((r, i) => r.classList.toggle('sel', i >= a && i <= z));
    } else if (e.metaKey || e.ctrlKey) { row.classList.toggle('sel'); anchor = row; }
    else { all.forEach(r => r.classList.toggle('sel', r === row)); anchor = row; }
    sync(t);
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('.tt');
    if (!t) return;
    const row = e.target.closest('.tt-body .tt-tr'), act = e.target.closest('[data-tt]');
    if (e.target.closest('[data-tt-sort]')) return sortBy(t, +e.target.closest('[data-tt-sort]').dataset.ttSort);
    if (e.target.closest('.tt-reset')) return restore(t);
    if (e.target.closest('.tt-th .cb')) {
      const on = !q('.tt-th .cb', t).classList.contains('on');
      vis(t).forEach(r => r.classList.toggle('sel', on)); return sync(t);
    }
    if (act) {
      const a = act.dataset.tt, r = act.closest('.tt-tr') || ctxRow;
      closePops();
      if (a === 'rename') { const s = q('.tt-t', r); startEdit(s); s.addEventListener('blur', () => { q('.tt-w', r).dataset.tip = s.textContent; }, { once: true }); }
      if (a === 'dup') dup(t, r);
      if (a === 'del') del(t, [r]);
      if (a === 'bulkdup') vis(t).filter(x => x.classList.contains('sel')).reverse().forEach(x => dup(t, x));
      if (a === 'bulkdel') del(t, vis(t).filter(x => x.classList.contains('sel')));
      if (a === 'clear') vis(t).forEach(x => x.classList.remove('sel'));
      return sync(t);
    }
    if (!row || e.target.closest('.tt-grip, [contenteditable="true"]')) return;
    if (e.target.closest('.cb')) { e.shiftKey ? select(t, row, e) : (row.classList.toggle('sel'), anchor = row, sync(t)); }
    else select(t, row, e);
  });

  document.addEventListener('contextmenu', e => {
    const row = e.target.closest('.tt-body .tt-tr'), t = row?.closest('.tt');
    const pop = t && q('.tt-menu', t.closest('.stage'));
    if (!pop) return;
    e.preventDefault();
    const st = t.closest('.stage'), r = st.getBoundingClientRect();
    ctxRow = row; closePops(pop);
    pop.style.left = Math.min(e.clientX - r.left, r.width - 180) + 'px';
    pop.style.top = Math.min(e.clientY - r.top, r.height - 130) + 'px';
    pop.classList.add('open');
  });

  // grip drag: rows stay put, an accent line shows the landing spot, a tilted copy rides the pointer
  document.addEventListener('pointerdown', e => {
    const grip = e.target.closest('.tt-grip'), t = grip?.closest('.tt');
    if (!t || t._sort) return;
    const row = grip.closest('.tt-tr'), body = row.parentElement;
    const lr = body.getBoundingClientRect(), rr = row.getBoundingClientRect(), dy0 = e.clientY - rr.top;
    const line = document.createElement('i'); line.className = 'dropline'; body.append(line);
    const g = row.cloneNode(true); g.classList.add('tt-ghost'); g.style.width = rr.width + 'px'; body.append(g);
    let target = null, after = false;
    row.classList.add('lifted'); grip.setPointerCapture(e.pointerId);
    const move = ev => {
      g.style.top = ev.clientY - lr.top - dy0 + 'px';
      const rs = vis(t).filter(r => !r.classList.contains('tt-ghost'));
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
      line.remove(); g.remove(); row.classList.remove('lifted');
      if (target && target !== row) flip(qa('.tt-tr', body), () => after ? target.after(row) : target.before(row));
    }, { once: true });
  });
})();
