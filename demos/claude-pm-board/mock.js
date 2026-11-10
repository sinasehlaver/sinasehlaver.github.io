// Fake pm board: three made-up projects, add a todo, ▶ runs a simulated session that updates the state file.
DemoKit.mock(function (root, api) {
  'use strict';
  var h = api.h, timers = [];
  var projects = [
    { slug: 'band-site', desc: 'gig dates, press kit + merch page', c: '#12b886', now: 'Publish autumn tour dates', next: 'Merch page with sizes', ago: '2d ago',
      todo: ['Add a press-kit download', 'Merch page with sizes'], done: ['Tour dates page'] },
    { slug: 'budget-tracker', desc: 'monthly spend by category', c: '#be4bdb', now: 'Fix CSV import for two banks', next: 'Category rules editor', ago: '5h ago',
      todo: ['Category rules editor'], done: ['CSV import'] },
    { slug: 'recipe-box', desc: 'family recipes, scaled servings', c: '#f08c00', now: 'Blocked: photo storage choice', next: 'Pick photo storage', ago: '9d ago',
      todo: ['Pick photo storage', 'Print view'], done: [] }
  ];
  var open = null, running = false, state = null, showFile = false;

  function stateMd(p, ranTask) {
    return [
      '# ' + p.slug + ' — state', 'Updated: 2026-11-10', '',
      '## Now', '- ' + (ranTask ? 'Shipped: ' + ranTask : p.now), '',
      '## Next', '- ' + (ranTask ? (p.todo[0] || 'Nothing queued') : p.next), '',
      '## Resume', 'Last result: ' + (ranTask ? 'tests 14/14 pass' : 'tests 12/12 pass'),
      'Re-run: npm test'
    ];
  }

  var list = h('div');
  var cap = h('form', { class: 'pm-cap', onsubmit: function (e) { e.preventDefault(); api.toast('Ideas land in an inbox you can promote to a project later.'); cap.reset(); } },
    h('input', { placeholder: '💡 capture an idea…', 'aria-label': 'Capture an idea' }));
  root.appendChild(cap);
  root.appendChild(h('div', { class: 'pm-tag' }, 'PROJECTS (' + projects.length + ')'));
  root.appendChild(list);

  function draw() {
    while (list.firstChild) list.removeChild(list.firstChild);
    projects.forEach(function (p) {
      var isOpen = open === p.slug;
      var card = h('div', { class: 'pm-card' });
      card.style.setProperty('--c', p.c);
      var head = h('button', { type: 'button', class: 'pm-head', 'aria-expanded': String(isOpen), 'data-step': p.slug === 'band-site' ? 'open' : null,
        onclick: function () { open = isOpen ? null : p.slug; showFile = false; draw(); if (!isOpen && p.slug === 'band-site') api.done('open'); } },
        h('span', { class: 'dot' }),
        h('span', null, h('b', null, p.slug + '/ — ' + p.desc),
          h('span', { class: 'now' }, p.now),
          h('span', { class: 'meta' }, h('span', { class: 'pm-tag' }, 'NEXT'), p.next + ' · ' + p.todo.length + ' open · ' + p.ago)));
      card.appendChild(head);
      if (isOpen) card.appendChild(body(p));
      list.appendChild(card);
    });
    api.repaint();
  }

  function body(p) {
    var b = h('div', { class: 'pm-body' });
    b.appendChild(h('h4', null, 'Todo'));
    p.todo.forEach(function (t, i) {
      b.appendChild(h('div', { class: 'pm-todo' },
        h('span', null, t),
        h('button', { type: 'button', class: 'pm-play', 'aria-label': 'Run: ' + t, disabled: running, 'data-step': i === 0 ? 'run' : null,
          onclick: function () { run(p, t); } }, '▶')));
    });
    var inp = h('input', { placeholder: 'Add a todo, Enter', 'aria-label': 'New todo', maxlength: 120 });
    b.appendChild(h('form', { class: 'pm-add', 'data-step': 'add', onsubmit: function (e) {
      e.preventDefault();
      var v = inp.value.trim();
      if (!v) return;
      p.todo.unshift(v);
      api.done('add');
      draw();
    } }, inp));
    if (p.done.length) {
      b.appendChild(h('h4', null, 'Done'));
      p.done.forEach(function (t) { b.appendChild(h('div', { class: 'pm-todo is-done' }, h('span', null, t))); });
    }
    if (state && state.slug === p.slug) b.appendChild(state.term);
    b.appendChild(h('button', { type: 'button', class: 'pm-file', 'aria-expanded': String(showFile), 'data-step': 'file',
      onclick: function () { showFile = !showFile; draw(); if (showFile && state && state.slug === p.slug && state.finished) api.done('file'); } },
      '.claude/state/' + p.slug + '.md'));
    if (showFile) {
      var md = h('div', { class: 'pm-md' });
      var lines = stateMd(p, state && state.slug === p.slug && state.finished ? state.task : null);
      lines.forEach(function (l, i) {
        var changed = state && state.finished && state.slug === p.slug && (/^- |^Last result/.test(l));
        md.appendChild(changed ? h('span', { class: 'hl' }, l) : document.createTextNode(l));
        if (i < lines.length - 1) md.appendChild(document.createTextNode('\n'));
      });
      if (!(state && state.finished && state.slug === p.slug)) api.toast('Run a todo first, then look again: the session updates this file.');
      b.appendChild(md);
    }
    return b;
  }

  function run(p, task) {
    if (running) return;
    running = true;
    var term = h('div', { class: 'pm-term', role: 'log', 'aria-live': 'polite' });
    state = { slug: p.slug, task: task, term: term, finished: false };
    showFile = false;
    var lines = [
      ['a', '$ claude "Task for ' + p.slug + ': ' + task + '"'],
      ['', 'Reading .claude/state/' + p.slug + '.md and .claude/rules/' + p.slug + '.md …'],
      ['', 'Plan: 1) build it  2) run the tests  3) update state + backlog'],
      ['', 'Editing src/… (3 files)'],
      ['g', '✓ npm test: 14/14 pass'],
      ['', 'Moved "' + task + '" to Done in backlog/' + p.slug + '.md'],
      ['g', '✓ Updated state/' + p.slug + '.md (Now, Next, Resume)']
    ];
    draw();
    var step = api.reduced ? 0 : 650;
    lines.forEach(function (l, i) {
      timers.push(setTimeout(function () {
        term.appendChild(l[0] ? h('span', { class: l[0] }, l[1]) : document.createTextNode(l[1]));
        term.appendChild(document.createTextNode('\n'));
        if (i === lines.length - 1) {
          var k = p.todo.indexOf(task);
          if (k >= 0) p.todo.splice(k, 1);
          p.done.unshift(task);
          p.now = 'Shipped: ' + task;
          p.next = p.todo[0] || 'Nothing queued';
          p.ago = 'just now';
          running = false;
          state.finished = true;
          api.done('run');
          draw();
        }
      }, step * (i + 1)));
    });
  }

  draw();
  return function () { timers.forEach(clearTimeout); };
});
