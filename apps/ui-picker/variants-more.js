'use strict';
// More options (2026-10-21). Loaded after variants.js. Only NEW ids: category/variant ids are the contract with
// picks.json, so existing picks keep working. New categories are pushed onto CATEGORIES and ordered by LAYOUT (end of file).
Object.assign(I, {
  home: ic('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  list: ic('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
  layers: ic('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
  bell: ic('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21h4"/>'),
  folder: ic('<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>', 14),
  info: ic('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  alert: ic('<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>'),
  ok: ic('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>'),
  share: ic('<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"/>'),
  chevR: ic('<path d="M9 6l6 6-6 6"/>', 12),
});


// ---------- helpers for the new demos ----------
const SW = on => `<button class="sw${on ? ' on' : ''}" data-a="sw"></button>`;
const setRow = (label, ctl) => `<div class="kv" style="align-items:center"><span>${label}</span>${ctl}</div>`;
const SETP = [
  setRow('Auto-save', SW(1)) + setRow('Show channel numbers', SW(0)),
  setRow('Theme', seg(['System', 'Light', 'Dark'])) + setRow('Density', seg(['Comfy', 'Compact'])),
  [['Undo', '⌘Z'], ['Save', '⌘S'], ['Search', '⌘F']].map(([a, k]) => `<div class="kv"><span>${a}</span><span class="kbd">${k}</span></div>`).join(''),
];
const SET_T = ['General', 'Appearance', 'Shortcuts'];
const NAV_ITEMS = [['home', 'Home'], ['list', 'Inputs', 12], ['layers', 'Stage'], ['file', 'Rider'], ['gear', 'Settings']];
const TBL = [['Kick drum', 'Ch 1', 'Drums', 'SM91'], ['Snare top', 'Ch 2', 'Drums', 'SM57'], ['Bass DI', 'Ch 7', 'Bass', 'DI box'], ['Lead vocal', 'Ch 12', 'Vocals', 'Beta 58']];
const table = (cls, sortable) => `<div class="tbl ${cls}"><div class="tr th">${['Name', 'Ch', 'Type', 'Mic'].map((h, i) => sortable
  ? `<button data-a="sorth" data-col="${i}">${h}<span class="sa"></span></button>` : `<span>${h}</span>`).join('')}</div>${TBL.map(r => `<div class="tr">${r.map(c => `<span>${c}</span>`).join('')}</div>`).join('')}</div>`;
const node = (t, kids, open = true) => `<div class="tn"><button class="sec-h" aria-expanded="${open}" data-a="toggle">${I.chev}${I.folder}<span>${t}</span><span class="count">${kids.length}</span></button><div class="collapse-body"><div class="tk">${kids.join('')}</div></div></div>`;
const leaf = t => `<div class="tl" tabindex="0">${I.file}<span>${t}</span></div>`;
const TREE = [node('Main stage', [node('Drums', [leaf('Kick drum'), leaf('Snare top')]), node('Bass', [leaf('Bass DI')], false)]), node('Side stage', [leaf('Lead vocal')], false)].join('');
const STATUSES = [['Kick drum', 'ok', 'Ready'], ['Snare top', 'warn', 'Needs mic'], ['Bass DI', 'err', 'No signal'], ['Lead vocal', 'idle', 'Draft']];
const badge = (fmt, k, t) => `<span class="st ${k} ${fmt}">${fmt === 'icon' ? I[{ ok: 'ok', warn: 'alert', err: 'alert', idle: 'info' }[k]] : ''}${t}</span>`;
const statusRows = fmt => `<div class="list">${STATUSES.map(([n, k, t]) => `<div class="row"><span class="name">${n}</span>${badge(fmt, k, t)}</div>`).join('')}</div>`;
const replayBtn = (label = 'Reload') => `<div><button class="btn sm" data-a="replay">${I.restore} ${label}</button></div>`;
const loading = (wait, cls = '') => `${replayBtn()}<div class="ld ${cls}" data-replay><div class="ld-w">${wait}</div><div class="ld-d list">${rows('', { n: 3 })}</div></div>`;
const skRows = `<div class="list">${[46, 34, 52].map(w => `<div class="row"><i class="sk" style="width:${w}%"></i><span class="spacer"></span><i class="sk" style="width:14%"></i></div>`).join('')}</div>`;
const fields = (cls = '') => `<label class="fl">Band name<input class="field ${cls}" value="The Lows"></label><label class="fl">Email<input class="field ${cls}" placeholder="you@band.com"></label>`;
const wiz = (cls, steps) => `<div class="wiz ${cls}" data-step="0" data-t="Name your band and pick the stage size.|Add the inputs: drums, bass, vocals…|Export the rider as a PDF.|All set. Rider exported ✓">${steps}
  <div class="wbody">Name your band and pick the stage size.</div><div class="hstack" style="justify-content:flex-end"><button class="btn quiet sm" data-a="wback">Back</button><button class="btn primary sm" data-a="wnext">Next</button></div></div>`;
const frameMain = (inner = 'content') => `<div class="fm">${inner}</div>`;
const copyDemo = (kind, btn) => `<div class="hstack"><code class="cpy">rider-spring-2026.pdf</code>${btn || `<button class="ib" data-a="copied" data-kind="${kind}" data-tip="Copy link">${I.copy}</button>`}</div>`;
const unsaved = (kind, title, extra = '') => `<div data-unsaved="${kind}" style="display:flex;flex-direction:column;gap:8px"><div class="mini-top"><span class="brand">S<b>r</b></span>${title}<span class="spacer"></span>${extra}</div>
  <input class="field" value="Kick drum" aria-label="Channel name"><div class="muted small">Type in the field</div></div>`;

// a mock rider page for the page-drop demos: cover, Inputs | Outputs pair, plot, notes. `mode` decides where the six zones sit (CSS `.pdm-<mode>`).
const PD_CELLS = [['af', '1+2'], ['al', '1'], ['ar', '2'], ['bl', '3'], ['br', '4'], ['bf', '3+4']];
const pdZones = () => `<div class="pd-z">${PD_CELLS.map(([k, n]) => `<i class="pd-c pd-${k}"><b>${n}</b></i>`).join('')}</div>`;
const pdItem = (t, h, w = '') => `<div class="pd-it ${w}" style="--h:${h}px"><span>${t}</span><i class="pd-ln"></i><i class="pd-ln s"></i>${pdZones()}</div>`;
const pdPage = mode => `<div class="pd pdm-${mode}"><div class="pd-sheet">${mode === 'page' ? pdZones() : ''}
  <div class="pd-row">${pdItem('Cover', 22)}${pdZones()}</div>
  <div class="pd-row pair">${pdItem('Inputs', 58, 'l')}${pdItem('Outputs', 40, 'r')}${pdZones()}</div>
  <div class="pd-row">${pdItem('Stage plot', 46)}${pdZones()}</div>
  <div class="pd-row">${pdItem('Notes', 20)}${pdZones()}</div></div></div>`;

// ---------- new categories ----------
const MORE = [
  { id: 'depth', group: 'Foundations', title: 'Depth', attr: 'depth', def: 'layered', desc: 'How far a card, a menu and a dialog lift off the page: look at the shadows and edges around the three shapes on the striped background.',
    sample: () => `<div class="depthdemo"><div class="dd-card panel"><b>Card</b><span class="muted small">Sits on the page</span></div><div class="pop open dd-menu"><button>${I.edit} Rename</button><button>${I.copy} Duplicate</button></div><div class="dialog dd-dlg"><b>Dialog</b><span class="muted small">Floats highest</span><div class="btns"><span class="btn primary sm">OK</span></div></div></div>`,
    variants: [
      { id: 'layered', name: 'Layered shadows', src: 'stagerider · pm', desc: 'Soft two-part shadows plus hairline borders.' },
      { id: 'flat', name: 'Flat, lines only', desc: 'No shadows, just thin outlines. Calm, like print.' },
      { id: 'deep', name: 'Deep', src: 'macOS', desc: 'Big dark shadows: menus and dialogs clearly hover.' },
    ] },
  { id: 'icons', group: 'Foundations', title: 'Icon weight', attr: 'icons', def: 'regular', desc: 'Stroke width of every line icon.',
    sample: () => `<div class="icbig">${['undo', 'redo', 'copy', 'trash', 'search', 'gear', 'bell', 'share'].map(i => I[i]).join('')}</div><div class="muted small">Same icons, three stroke weights</div>`,
    variants: [
      { id: 'thin', name: 'Thin', desc: 'Hairline strokes: light and precise.' },
      { id: 'regular', name: 'Regular', src: 'stagerider · pm', desc: 'Medium strokes: the everyday weight.' },
      { id: 'bold', name: 'Bold', desc: 'Thick strokes: chunky and high contrast.' },
    ] },

  // ---------- App chrome ----------
  { id: 'search-box', group: 'App chrome', title: 'Search field', desc: 'Type in each of them.', variants: [
    { id: 'icon', name: 'Icon inside + key hint', src: 'pm Home', html: `<span class="sfield">${I.search}<input class="field" placeholder="Search channels"><span class="kbd">⌘F</span></span>` },
    { id: 'clear', name: '× clears it', desc: 'Appears once there is text; Esc clears too.', html: `<span class="sfield sclear">${I.search}<input class="field" placeholder="Type, then clear" value="snare"><button class="ib" data-a="clearf" data-tip="Clear  Esc">${I.x}</button></span>` },
    { id: 'expand', name: 'Magnifier that opens', desc: 'Just an icon until clicked; folds back when left empty.', html: `<div class="mini-top"><b>Inputs</b><span class="spacer"></span><span class="xsearch"><input class="field" placeholder="Search…">${ib('search', 'expand', 'Search  ⌘F')}</span><button class="btn primary sm">${I.plus} Add</button></div>` },
    { id: 'live', name: 'Filters as you type + count', desc: 'The list narrows instantly and says how many match.', tall: true,
      html: `<span class="sfield">${I.search}<input class="field" placeholder="Filter… try “dr”" data-rowfilter></span><div class="muted small" data-matchn>5 of 5</div><div class="list">${rows('', { n: 5 })}</div>` },
  ] },
  { id: 'toolbar', group: 'App chrome', title: 'Toolbar buttons', desc: 'A row of actions above a list or canvas.', variants: [
    { id: 'icons', name: 'Icons + tooltips', src: 'stagerider', desc: 'Compact; hover names the action and its key.', html: `<div class="tbar">${ib('plus', '', 'Add  ⌘N')}${ib('copy', '', 'Duplicate  ⌘D')}${ib('trash', '', 'Delete  ⌫', 'del')}<span class="sep"></span>${ib('undo', '', 'Undo  ⌘Z')}${ib('redo', '', 'Redo  ⌘⇧Z')}<span class="spacer"></span>${ib('search', '', 'Search  ⌘F')}</div>` },
    { id: 'labels', name: 'Icon + label', desc: 'Explains itself; takes more room.', html: `<div class="tbar">${[['plus', 'Add'], ['copy', 'Duplicate'], ['trash', 'Delete']].map(([i, t]) => `<button class="btn quiet sm">${I[i]} ${t}</button>`).join('')}<span class="sep"></span>${ib('undo', '', 'Undo  ⌘Z')}</div>` },
    { id: 'primary', name: 'One labelled, rest icons', desc: 'The main action has a word, the others are icons, extras live in ⋯.', tall: true,
      html: `<div class="tbar"><button class="btn primary sm">${I.plus} Add channel</button><span class="sep"></span>${ib('copy', '', 'Duplicate  ⌘D')}${ib('trash', '', 'Delete  ⌫', 'del')}<span class="spacer"></span><span class="anchor">${ib('more', 'pop', 'More')}<div class="pop" style="right:0;top:32px">${[['share', 'Export…', '⌘E'], ['archive', 'Archive', ''], ['trash', 'Delete all', '']].map(([i, t, k]) => `<button data-a="popx" class="${i === 'trash' ? 'danger' : ''}">${I[i]} ${t}${k ? ` <span class="kbd">${k}</span>` : ''}</button>`).join('')}</div></span></div>` },
    { id: 'text', name: 'Words only', desc: 'Plain text buttons, no icons.', html: `<div class="tbar">${['Add', 'Duplicate', 'Delete', 'Undo'].map(t => `<button class="btn quiet sm">${t}</button>`).join('')}</div>` },
  ] },
  { id: 'statusbar', group: 'App chrome', title: 'Status bar', desc: 'Where “Saved”, counts and small facts live.', variants: [
    { id: 'bottom', name: 'Thin bar at the bottom', src: 'VS Code · Logic', html: `<div class="frame col">${frameMain('canvas')}<div class="sbar">${badge('dot', 'ok', 'Saved')}<span>12 channels</span><span>48 kHz</span><span class="spacer"></span><span>100%</span></div></div>` },
    { id: 'chip', name: 'Chip in the top bar', src: 'stagerider', html: `<div class="frame col"><div class="mini-top flat"><span class="brand">S<b>r</b></span><span class="spacer"></span><span class="file-chip" data-s="saved"><span class="dot"></span><span>Saved · 12 channels</span></span></div>${frameMain('canvas')}</div>` },
    { id: 'float', name: 'Floating pill', desc: 'Sits in a corner over the content.', html: `<div class="frame col">${frameMain(`canvas<span class="fpill">${badge('dot', 'ok', 'Saved')} · 12 channels</span>`)}</div>` },
    { id: 'none', name: 'No status at all', desc: 'Only problems speak up (as a toast). Cleanest.', html: `<div class="frame col"><div class="mini-top flat"><span class="brand">S<b>r</b></span></div>${frameMain('canvas')}</div>` },
  ] },
  { id: 'scrollbars', group: 'App chrome', title: 'Scrollbars', desc: 'Scroll each list.', variants: [
    { id: 'thin', name: 'Thin, always there', desc: 'A slim bar that never hides.', html: `<div class="list scr thin">${rows('', { n: 5 })}${rows('', { n: 4 })}</div>` },
    { id: 'hover', name: 'Hidden until hover', desc: 'No bar at rest. Move the mouse over the list and it fades in.', src: 'macOS', html: `<div class="list scr hov">${rows('', { n: 5 })}${rows('', { n: 4 })}</div>` },
    { id: 'native', name: 'System default', desc: 'Whatever your computer normally draws.', html: `<div class="list scr nat">${rows('', { n: 5 })}${rows('', { n: 4 })}</div>` },
  ] },

  // ---------- Navigation ----------
  { id: 'app-nav', group: 'Navigation', title: 'Main navigation', desc: 'Moving between the big areas of an app. Click around.', variants: [
    { id: 'sidebar', name: 'Labelled sidebar', src: 'Linear · Things', html: `<div class="frame"><div class="nl side-nl">${NAV_ITEMS.map((x, i) => `<button class="${i ? '' : 'on'}" data-a="tab">${I[x[0]]}${x[1]}${x[2] ? `<span class="count">${x[2]}</span>` : ''}</button>`).join('')}</div>${frameMain()}</div>` },
    { id: 'rail', name: 'Icon rail + tooltips', src: 'VS Code · Slack', html: `<div class="frame"><div class="nl rail">${NAV_ITEMS.map((x, i) => `<button class="${i ? '' : 'on'}" data-a="tab" data-tip-r data-tip="${x[1]}">${I[x[0]]}</button>`).join('')}</div>${frameMain()}</div>` },
    { id: 'top', name: 'Tabs in the top bar', src: 'stagerider', html: `<div class="frame col"><div class="mini-top flat"><span class="brand">S<b>r</b></span>${tabs('tabs-u')}</div>${frameMain()}</div>` },
    { id: 'bottom', name: 'Bottom tab bar', src: 'iOS', html: `<div class="frame col" style="width:230px;margin:0 auto">${frameMain()}<div class="btmbar">${NAV_ITEMS.slice(0, 4).map((x, i) => `<button class="${i ? '' : 'on'}" data-a="tab">${I[x[0]]}<span>${x[1]}</span></button>`).join('')}</div></div>` },
  ] },
  { id: 'wayfinding', group: 'Navigation', title: 'Where am I', desc: 'Telling you where you are, and the way back.', variants: [
    { id: 'back', name: '← back + title', src: 'pm · _starter', html: `<div class="mini-top">${ib('back', '', 'Back  Esc')}<b>Kick drum</b><span class="muted small">in Inputs</span></div>` },
    { id: 'crumbs', name: 'Breadcrumb trail', desc: 'Every level is clickable.', html: `<div class="crumbs"><span class="lnk hu">Spring tour</span>${I.chevR}<span class="lnk hu">Inputs</span>${I.chevR}<b>Kick drum</b></div>` },
    { id: 'switcher', name: 'Title switcher ▾', desc: 'Click the title to jump to a sibling.', tall: true, html: `<span class="anchor"><button class="btn quiet" data-a="pop"><b data-lbl>Kick drum</b> ▾</button><div class="pop" style="top:36px;left:0">${opts(NAMES.map(n => [n]), 'Kick drum')}</div></span>` },
  ] },
  { id: 'settings', group: 'Navigation', title: 'Settings screen', variants: [
    { id: 'pane', name: 'Categories left, page right', src: 'macOS System Settings', tall: true,
      html: `<div class="frame" data-tabs><div class="nl side-nl" style="width:104px">${SET_T.map((t, i) => `<button class="${i ? '' : 'on'}" data-a="tabpane">${t}</button>`).join('')}</div><div class="fm setp">${SETP.map((p, i) => `<div data-p${i ? ' hidden' : ''}>${p}</div>`).join('')}</div></div>` },
    { id: 'page', name: 'One scrolling page', src: '_starter Settings', desc: 'Small-caps headers, everything on one page.', tall: true,
      html: `<div class="frame"><div class="fm setp scr thin">${SETP.map((p, i) => `<span class="eyebrow" style="margin-top:6px">${SET_T[i]}</span>${p}`).join('')}</div></div>` },
    { id: 'popover', name: 'Gear popover', desc: 'Only a few settings? A small menu, no screen.', tall: true,
      html: `<span class="anchor">${ib('gear', 'pop', 'Settings')}<div class="pop" style="top:32px;left:0;width:220px">${['Auto-save', 'Channel numbers'].map((t, i) => `<div class="mi">${t}<span class="sw${i ? '' : ' on'}" data-a="sw" style="margin-left:auto"></span></div>`).join('')}<hr>${opts([['System'], ['Light'], ['Dark']], 'System')}</div></span>` },
    { id: 'dialog', name: 'Dialog with tabs', tall: true,
      html: `<button class="btn" data-a="modal">${I.gear} Settings</button>${SCRIM(`<div class="dialog" style="width:min(92%,330px)" data-tabs><div class="hstack"><b>Settings</b><span class="spacer"></span><button class="ib" data-a="close">${I.x}</button></div><div class="tabs-u" style="margin:4px 0 8px">${SET_T.map((t, i) => `<button class="${i ? '' : 'on'}" data-a="tabpane">${t}</button>`).join('')}</div>${SETP.map((p, i) => `<div data-p${i ? ' hidden' : ''}>${p}</div>`).join('')}</div>`)}` },
  ] },
  { id: 'steps', group: 'Navigation', title: 'Multi-step flows', desc: 'Setting something up in a few steps. Press Next.', variants: [
    { id: 'numbered', name: 'Numbered steps on top', html: wiz('', `<div class="wsteps">${['Band', 'Inputs', 'Export'].map((t, i) => `<span class="ws${i ? '' : ' on'}"><i>${i + 1}</i>${t}</span>`).join('<span class="wl"></span>')}</div>`) },
    { id: 'dots', name: 'One question per screen', desc: 'A big single question, progress dots.', html: wiz('q', `<div class="wdots">${[0, 1, 2].map(i => `<span class="ws${i ? '' : ' on'}"></span>`).join('')}</div>`) },
    { id: 'vertical', name: 'Steps that fold up', src: 'tutorials', desc: 'Done steps tick and fold away; the next one opens. Click a done step to reopen it.', tall: true,
      html: `<div class="vsteps">${[['Name the band', 'Give the rider a title.'], ['Add inputs', 'Drums, bass, vocals…'], ['Export', 'Save the rider as a PDF.']].map(([t, d], i) => `<div class="vs${i ? '' : ' on'}"><button class="vs-h" data-a="vopen"><i>${i + 1}</i><b>${t}</b></button><div class="collapse-body"><div><div class="vs-b"><span class="muted small">${d}</span><button class="btn primary sm" data-a="vnext">${i < 2 ? 'Continue' : 'Finish'}</button></div></div></div></div>`).join('')}</div>` },
  ] },

  // ---------- Lists & rows ----------
  { id: 'drop', group: 'Lists & rows', title: 'Drag feedback', desc: 'Drag a row by its grip and watch where it will land.', variants: [
    { id: 'live', name: 'Rows make room as you drag', src: 'stagerider · _starter', html: `<div class="list reorder">${rows('', { grip: true })}</div>` },
    { id: 'line', name: 'Accent line, drop to move', desc: 'Rows stay put; a line shows the landing spot. Rows glide on drop.', html: `<div class="list reorder" data-drop="line">${rows('', { grip: true })}</div>` },
    { id: 'ghost', name: 'Lifted copy under the pointer', desc: 'A tilted copy rides along with the pointer, plus the line.', html: `<div class="list reorder" data-drop="ghost">${rows('', { grip: true })}</div>` },
  ] },
  { id: 'page-drop', group: 'Lists & rows', title: 'Drop zones on a page', desc: 'Dragging a section around a printed page (stagerider PDF). Move the pointer over the page as if you were dragging: the boxes show where it would land. 1+2 = above, full width · 1 / 2 = above, left / right · 3 / 4 = below, left / right · 3+4 = below, full width.', variants: [
    { id: 'item', name: 'Over the nearest section (as now)', desc: 'The six boxes cover only the section you aim at, so a half-width section gets tiny boxes.', src: 'stagerider', tall: true, html: pdPage('item') },
    { id: 'row', name: 'Page width, at the section', desc: 'The boxes span the whole page width at the height of the section you aim at; left/right are the page’s columns. Taller 1+2 / 3+4 bands.', tall: true, html: pdPage('row') },
    { id: 'page', name: 'One guide over the whole page', desc: 'A single six-box guide over the entire page while dragging, whatever section is nearest. Taller full-width bands.', tall: true, html: pdPage('page') },
    { id: 'quiet', name: 'Page width, only the box you are on', desc: 'Like “page width”, but the other boxes stay hidden: just the one under the pointer lights with its number.', tall: true, html: pdPage('quiet') },
  ] },

  // ---------- Data ----------
  { id: 'table', group: 'Data', title: 'Table look', variants: [
    { id: 'lines', name: 'Row lines', src: 'stagerider grid', html: table('lines') },
    { id: 'zebra', name: 'Zebra stripes', html: table('zebra') },
    { id: 'grid', name: 'Full grid', desc: 'Spreadsheet-like cell borders.', html: table('gridl') },
    { id: 'cards', name: 'Each row a card', desc: 'Floating rows, more air.', html: table('cards') },
  ] },
  { id: 'sort', group: 'Data', title: 'Sorting', desc: 'These really sort.', variants: [
    { id: 'header', name: 'Click a column header', desc: 'Again to flip the direction.', html: table('lines', true) },
    { id: 'menu', name: 'Sort menu + direction', src: 'pm Home', tall: true,
      html: `<div class="hstack"><span class="anchor" data-sortmenu><button class="btn sm" data-a="pop">Sort: <span data-lbl>Name</span> ▾</button><div class="pop" style="top:32px;left:0">${opts([['Name'], ['Ch'], ['Type']], 'Name')}</div></span>${ib('up', 'flipdir', 'Ascending / descending')}</div>${table('lines')}` },
    { id: 'manual', name: 'Your own order only', desc: 'No sorting; drag the grip.', html: `<div class="list reorder">${rows('', { grip: true })}</div>` },
  ] },
  { id: 'tree', group: 'Data', title: 'Nested items', desc: 'Things inside things (stages › groups › channels).', variants: [
    { id: 'indent', name: 'Chevrons + indent', src: 'Finder list', html: `<div class="tree">${TREE}</div>` },
    { id: 'guides', name: 'Chevrons + guide lines', src: 'VS Code', html: `<div class="tree guides">${TREE}</div>` },
    { id: 'columns', name: 'Columns', src: 'Finder columns', desc: 'Each level opens a column to the right.',
      html: `<div class="cols">${[['Main stage', 'Side stage'], ['Drums', 'Bass'], ['Kick drum', 'Snare top']].map(col => `<div class="nl">${col.map((t, i) => `<button class="${i ? '' : 'on'}" data-a="tab">${t}<span class="muted">›</span></button>`).join('')}</div>`).join('')}</div>` },
    { id: 'flat', name: 'Flat list with the path', desc: 'No nesting; the path is shown on each row.',
      html: `<div class="list">${[['Kick drum', 'Main › Drums'], ['Snare top', 'Main › Drums'], ['Bass DI', 'Main › Bass'], ['Lead vocal', 'Side']].map(([n, p]) => `<div class="row"><span class="name">${n}</span><span class="meta">${p}</span></div>`).join('')}</div>` },
  ] },
  { id: 'badges', group: 'Data', title: 'Status labels', variants: [
    { id: 'dot', name: 'Dot + word', src: 'Linear', html: statusRows('dot') },
    { id: 'pill', name: 'Tinted pill', src: 'GitHub', html: statusRows('pill') },
    { id: 'outline', name: 'Outlined pill', html: statusRows('outline') },
    { id: 'icon', name: 'Icon + word', html: statusRows('icon') },
  ] },
  { id: 'loading', group: 'Data', title: 'Loading', desc: 'Press Reload to watch it again.', variants: [
    { id: 'skeleton', name: 'Skeleton rows', src: '_starter States', html: loading(skRows) },
    { id: 'spinner', name: 'Spinner + sentence', html: loading(`<div class="ld-c"><span class="spin" style="display:inline-block"></span><span class="muted small">Loading channels…</span></div>`) },
    { id: 'bar', name: 'Thin bar, old content dimmed', desc: 'Stays readable while it refreshes.', html: `${replayBtn()}<div class="ld" data-replay><i class="ld-bar"></i><div class="list ld-stale">${rows('', { n: 3 })}</div></div>` },
    { id: 'stagger', name: 'Rows arrive one by one', html: `${replayBtn()}<div class="ld" data-replay><div class="list ld-stg">${rows('', { n: 4 })}</div></div>` },
  ] },
  { id: 'paging', group: 'Data', title: 'Long lists', variants: [
    { id: 'more', name: '“Show more” button', html: `<div class="list scr" style="height:auto;max-height:150px" data-more>${rows('', { n: 3 })}</div><div><button class="btn quiet sm" data-a="loadmore">Show 3 more ${I.down}</button></div>` },
    { id: 'infinite', name: 'Loads as you scroll', desc: 'Scroll the list to the bottom.', html: `<div class="list scr thin" data-infinite>${rows('', { n: 5 })}</div><div class="muted small" data-loaded>5 of 20 loaded</div>` },
    { id: 'pages', name: 'Page numbers', html: `<div class="list" data-pagelist>${rows('', { n: 3 })}</div><div class="pager">${['1', '2', '3', '4'].map((p, i) => `<button class="${i ? '' : 'on'}" data-a="page">${p}</button>`).join('')}<span class="muted small">of 7</span></div>` },
  ] },

  // ---------- Controls ----------
  { id: 'number', group: 'Controls', title: 'Numbers', desc: 'Entering a value: gain, count, sample rate.', variants: [
    { id: 'stepper', name: '− value +', html: `<div class="stepper"><button data-a="step" data-d="-1">−</button><input class="field" value="4" aria-label="Count"><button data-a="step" data-d="1">+</button></div>` },
    { id: 'slider', name: 'Slider with readout', html: `<label class="sl">Gain <input type="range" min="-24" max="12" value="0" data-out><output>0 dB</output></label>` },
    { id: 'scrub', name: 'Drag the label', src: 'Figma · Logic', desc: 'Drag the word “Gain” left or right.', html: `<label class="scrub-l"><span class="scrub" data-scrub>Gain</span><input class="field" value="0" style="width:64px" aria-label="Gain"><span class="muted small">dB</span></label>` },
    { id: 'unit', name: 'Field with a unit', html: `<span class="unitf"><input class="field" value="48" aria-label="Sample rate"><span>kHz</span></span>` },
  ] },
  { id: 'radio', group: 'Controls', title: 'Choose one of a few', variants: [
    { id: 'list', name: 'Radio list', html: `<div class="radios">${['Mono', 'Stereo', 'Auto'].map((t, i) => `<button class="rad${i === 2 ? ' on' : ''}" data-a="tab"><span class="rd"></span>${t}</button>`).join('')}</div>` },
    { id: 'cards', name: 'Option cards', desc: 'Each option explains itself.', html: `<div class="rcards">${[['Mono', 'Fold to one'], ['Stereo', 'Keep L/R'], ['Auto', 'From the file']].map(([t, d], i) => `<button class="rcard${i === 2 ? ' on' : ''}" data-a="tab"><b>${t}</b><span class="muted small">${d}</span></button>`).join('')}</div>` },
    { id: 'chips', name: 'Chips', html: `<div class="hstack">${['Mono', 'Stereo', 'Auto'].map((t, i) => `<button class="btn sm${i === 2 ? ' soft' : ''}" data-a="chipone">${t}</button>`).join('')}</div>` },
  ] },
  { id: 'tags', group: 'Controls', title: 'Tags', desc: 'Several labels on one item.', variants: [
    { id: 'field', name: 'Chips inside a field', desc: 'Type and press Enter; ⌫ removes the last one.', html: `<div class="tagf">${['Drums', 'Live'].map(t => `<span class="chip acc">${t}<button class="ib xs" data-a="rmchip">${I.x}</button></span>`).join('')}<input placeholder="Add tag…" data-tagin aria-label="Add tag"></div>` },
    { id: 'menu', name: 'Checklist menu', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-tagsum>Drums, Live</span>▾</button><div class="pop" style="top:36px;left:0">${['Drums', 'Live', 'Backline', 'Acoustic'].map((t, i) => `<div class="mi" data-a="tagcb"><span class="cb${i < 2 ? ' on' : ''}"></span><span>${t}</span></div>`).join('')}</div></span>` },
    { id: 'toggle', name: 'Toggle chips', desc: 'All tags shown; click to turn on/off.', html: `<div class="hstack">${['Drums', 'Live', 'Backline', 'Acoustic'].map((t, i) => `<button class="chip tg${i < 2 ? ' acc' : ''}" data-a="tgchip">${t}</button>`).join('')}</div>` },
  ] },
  { id: 'progress', group: 'Controls', title: 'Progress', desc: 'Press Run to watch it.', variants: [
    { id: 'bar', name: 'Bar + percent', html: `${replayBtn('Run')}<div data-replay class="pg"><div class="pgbar"><i></i></div><span class="muted small pgt">Exporting </span></div>` },
    { id: 'ring', name: 'Ring', html: `${replayBtn('Run')}<div data-replay class="hstack"><svg class="ring" viewBox="0 0 36 36" width="40" height="40"><circle cx="18" cy="18" r="15" class="rt"/><circle cx="18" cy="18" r="15" class="rf"/></svg><span class="muted small">Uploading stems</span></div>` },
    { id: 'steps', name: 'Named stages', html: `${replayBtn('Run')}<ol data-replay class="pgsteps">${['Render', 'Mix down', 'Upload'].map((t, i) => `<li style="--d:${i * 0.8}s">${t}</li>`).join('')}</ol>` },
    { id: 'indeterminate', name: 'Sliding bar (unknown length)', html: `<div class="pg"><div class="pgbar ind"><i></i></div><span class="muted small">Contacting the server…</span></div>` },
  ] },

  // ---------- Forms ----------
  { id: 'text-field', group: 'Forms', title: 'Text field style', desc: 'Click into them.', variants: [
    { id: 'outline', name: 'Outlined', src: 'stagerider · pm', html: fields() },
    { id: 'filled', name: 'Filled', desc: 'Tinted, no border until focused.', html: fields('filled') },
    { id: 'underline', name: 'Underline only', html: fields('under') },
    { id: 'floating', name: 'Floating label', src: 'Material', desc: 'The label sits inside, then floats up.', html: `<label class="ffl"><input class="field" placeholder=" " value="The Lows"><span>Band name</span></label><label class="ffl"><input class="field" placeholder=" "><span>Email</span></label>` },
  ] },
  { id: 'labels', group: 'Forms', title: 'Form labels', variants: [
    { id: 'above', name: 'Above the field', src: '_starter', html: fields() },
    { id: 'left', name: 'Left column', html: `<div class="lform"><span>Band name</span><input class="field" value="The Lows"><span>Email</span><input class="field" placeholder="you@band.com"></div>` },
    { id: 'right', name: 'Right-aligned, Mac style', src: 'macOS', html: `<div class="lform r"><span>Band name:</span><input class="field" value="The Lows"><span>Email:</span><input class="field" placeholder="you@band.com"></div>` },
    { id: 'inside', name: 'Placeholder only', desc: 'Compact, but the hint is gone once you type.', html: `<input class="field" placeholder="Band name"><input class="field" placeholder="Email">` },
  ] },
  { id: 'required', group: 'Forms', title: 'Required vs optional', variants: [
    { id: 'star', name: 'Required gets *', html: `<label class="fl">Band name <i class="req">*</i><input class="field"></label><label class="fl">Website<input class="field"></label>` },
    { id: 'optional', name: 'Optional says so', desc: 'Most fields are required, so mark the few that aren’t.', html: `<label class="fl">Band name<input class="field"></label><label class="fl">Website <i class="muted small" style="font-weight:400">(optional)</i><input class="field"></label>` },
    { id: 'none', name: 'No marks', desc: 'The form only complains if you skip something.', html: fields() },
  ] },
  { id: 'validation', group: 'Forms', title: 'Form errors', variants: [
    { id: 'blur', name: 'Under the field, after you leave it', desc: 'Type “me@”, then click away.', html: `<div class="vbox"><label class="fl">Email<input class="field vf" type="email" required placeholder="you@band.com"></label><span class="verr">Enter a full email, like you@band.com</span></div>` },
    { id: 'submit', name: 'On Save, with a summary', desc: 'Press Save with the fields empty.', html: `<div class="vsum" hidden></div><label class="fl">Band name<input class="field" required></label><label class="fl">Email<input class="field" type="email" required></label><div><button class="btn primary sm" data-a="validate">Save</button></div>` },
    { id: 'live', name: 'As you type, ✓ or hint', html: `<label class="fl vl">Email<input class="field vlive" type="email" required placeholder="you@band.com"><span class="vh"></span></label>` },
  ] },
  { id: 'form-save', group: 'Forms', title: 'Saving a form', desc: 'Change a field.', variants: [
    { id: 'footer', name: 'Cancel / Save at the bottom', html: `${fields()}<div class="hstack" style="justify-content:flex-end"><button class="btn quiet sm">Cancel</button><button class="btn primary sm">Save</button></div>` },
    { id: 'auto', name: 'Saves itself, ✓ per field', src: 'stagerider autosave', html: `<label class="fl">Band name <span class="asv" data-asv></span><input class="field" value="The Lows" data-autosave></label><label class="fl">Email <span class="asv" data-asv></span><input class="field" placeholder="you@band.com" data-autosave></label>` },
    { id: 'sticky', name: 'Bar slides up when changed', desc: '“Unsaved changes · Discard · Save”.', html: `<div class="frame col" data-dirtybox><div class="fm setp">${fields()}</div><div class="dbar"><span>Unsaved changes</span><span class="spacer"></span><button class="btn quiet sm" data-a="discard">Discard</button><button class="btn primary sm" data-a="savebar">Save</button></div></div>` },
  ] },
  { id: 'focus', group: 'Forms', title: 'Keyboard focus', desc: 'Click a button, then press Tab a few times.', variants: [
    { id: 'ring', name: 'Ring with a gap', src: '_starter kit.css', html: `<div class="hstack fr-ring"><button class="btn">Open</button><button class="btn primary">Save</button><input class="field" placeholder="Field" style="width:90px"></div>` },
    { id: 'glow', name: 'Soft glow', html: `<div class="hstack fr-glow"><button class="btn">Open</button><button class="btn primary">Save</button><input class="field" placeholder="Field" style="width:90px"></div>` },
    { id: 'outline', name: 'Solid outline', html: `<div class="hstack fr-outline"><button class="btn">Open</button><button class="btn primary">Save</button><input class="field" placeholder="Field" style="width:90px"></div>` },
  ] },

  // ---------- Feedback ----------
  { id: 'banner', group: 'Feedback', title: 'Messages on the page', desc: 'Close them with ×.', variants: [
    { id: 'bar', name: 'Full-width bar', html: `<div class="frame col"><div class="dzw"><div class="collapse-body"><div><div class="bnr">${I.info}<span>A new version is ready.</span><span class="spacer"></span><button class="btn sm">Restart</button><button class="ib" data-a="dismiss" data-tip="Dismiss">${I.x}</button></div></div></div></div>${frameMain('<button class="btn quiet sm" data-a="undismiss">Show again</button>')}</div>` },
    { id: 'callout', name: 'Callout card', html: `<div class="dzw"><div class="collapse-body"><div><div class="callout">${I.info}<div style="flex:1"><b>Tip</b><div class="small muted">Drag rows by the grip to reorder the patch list.</div></div><button class="ib" data-a="dismiss" data-tip="Dismiss">${I.x}</button></div></div></div></div><div><button class="btn quiet sm" data-a="undismiss">Show again</button></div>` },
    { id: 'row', name: 'On the item itself', desc: 'The problem shows right on the row it’s about.', html: `<div class="list"><div class="row"><span class="name">Kick drum</span><span class="meta">Ch 1</span></div><div class="row"><span class="name">Bass DI</span>${badge('pill', 'err', 'No signal')}</div><div class="rowmsg">${I.alert} Check the DI box is powered.</div><div class="row"><span class="name">Lead vocal</span><span class="meta">Ch 12</span></div></div>` },
  ] },
  { id: 'onboarding', group: 'Feedback', title: 'First-run guidance', desc: 'What a brand-new user sees.', variants: [
    { id: 'checklist', name: '“Getting started” checklist', desc: 'Tick a step: it folds away, the bar fills.', tall: true,
      html: `<div class="panel gs"><div class="hstack"><b>Getting started</b><span class="spacer"></span><span class="muted small" data-gsn>0 of 3</span></div><div class="pgbar"><i data-gsbar></i></div>${['Add your first channel', 'Drag a row to reorder', 'Export the rider'].map(t => `<div class="gs-it"><div class="collapse-body"><div><button class="gs-row" data-a="gsdone"><span class="cb round"></span>${t}</button></div></div></div>`).join('')}<div class="gs-done muted small">All done ✓ <button class="lnk hu" data-a="gsreset">Start over</button></div></div>` },
    { id: 'coach', name: 'Tour bubbles', desc: 'A bubble points at one thing at a time.', tall: true,
      html: `<div class="frame col coachbox" data-coach="0"><div class="mini-top flat"><button class="btn primary sm" data-ct="Add a channel|Every row is one input on stage.">${I.plus} Add</button><span class="spacer"></span><button class="ib" data-ct="Search|Find any channel by name. ⌘F">${I.search}</button><button class="ib" data-ct="Export|Save the rider as a PDF.">${I.share}</button></div>${frameMain('<button class="btn quiet sm" data-a="coachreplay">Replay tour</button>')}<div class="coach"><b data-ctt></b><span class="small" data-ctd></span><div class="hstack"><span class="small" style="opacity:.7" data-ctn></span><span class="spacer"></span><button class="btn quiet sm" data-a="coachskip">Skip</button><button class="btn primary sm" data-a="coachnext">Next</button></div></div></div>` },
    { id: 'hints', name: 'Hints in empty screens only', desc: 'No tour; empty views say what to do.', html: `<div class="empty"><span class="ico">${I.list}</span><b>No channels yet</b><span class="muted small">Press <span class="kbd">⌘N</span> or drop a .csv here.</span></div>` },
  ] },
  { id: 'copy', group: 'Feedback', title: 'Copy feedback', desc: 'Click copy.', variants: [
    { id: 'icon', name: 'Icon turns into ✓', html: copyDemo('icon') },
    { id: 'tip', name: 'Tooltip says “Copied”', html: copyDemo('tip') },
    { id: 'toast', name: 'Toast', html: copyDemo('toast') },
    { id: 'label', name: 'Button text changes', html: copyDemo('label', `<button class="btn sm" data-a="copied" data-kind="label"><span class="lbl">Copy</span></button>`) },
  ] },
  { id: 'attention', group: 'Feedback', title: 'Something new', desc: 'Click the icon to mark it seen.', variants: [
    { id: 'dot', name: 'Small dot', html: `<div class="hstack" data-replay><button class="ib nb" data-a="seen" data-tip="Notifications">${I.bell}<i class="nbd"></i></button>${ib('list', '', 'Inputs')}${ib('gear', '', 'Settings')}</div>${replayBtn('Reset')}` },
    { id: 'count', name: 'Count badge', html: `<div class="hstack" data-replay><button class="ib nb" data-a="seen" data-tip="Notifications">${I.bell}<i class="nbc">3</i></button>${ib('list', '', 'Inputs')}${ib('gear', '', 'Settings')}</div>${replayBtn('Reset')}` },
    { id: 'pulse', name: 'Pulsing dot', desc: 'For something that needs action now.', html: `<div class="hstack" data-replay><button class="ib nb" data-a="seen" data-tip="Update ready">${I.bell}<i class="nbd pl"></i></button>${ib('list', '', 'Inputs')}${ib('gear', '', 'Settings')}</div>${replayBtn('Reset')}` },
  ] },
  { id: 'unsaved', group: 'Feedback', title: 'Unsaved changes', variants: [
    { id: 'dot', name: 'Dot by the title + Save', src: 'stagerider', html: unsaved('dot', '<span>Spring tour</span><span class="dirty"></span>', '<button class="btn primary sm" data-a="usave">Save</button>') },
    { id: 'edited', name: '“— Edited” after the title', src: 'macOS', html: unsaved('edited', '<span>Spring tour</span><span class="muted small ued">— Edited</span>', '<button class="btn primary sm" data-a="usave">Save</button>') },
    { id: 'chip', name: 'Autosave chip, no Save button', src: 'stagerider autosave', html: unsaved('chip', '<span>Spring tour</span>', '<span class="file-chip" data-s="saved"><span class="dot"></span><span>Saved</span></span>') },
  ] },
];

// New variants inside existing sections (appended, so letters A, B… of old variants don't move).
const MORE_VARIANTS = {
  palette: [
    { id: 'sand', name: 'Sand', desc: 'Warm beige paper; dark side is warm brown-black.' },
    { id: 'nord', name: 'Nord', desc: 'Blue-tinted greys, soft contrast on both sides.' },
  ],
  accent: [{ id: 'rose', name: 'Rose' }, { id: 'green', name: 'Green' }, { id: 'indigo', name: 'Indigo' }, { id: 'ink', name: 'Ink (no colour)', desc: 'Black/white accent; colour only for status.' }],
  type: [
    { id: 'rounded', name: 'SF Rounded headings', desc: 'Friendly rounded display, system body.' },
    { id: 'humanist', name: 'Avenir Next', desc: 'Humanist sans for both; soft and readable.' },
  ],
  motion: [{ id: 'bouncy', name: 'Bouncy', desc: 'Springy overshoot on pops and switches.' }],
  tabs: [{ id: 'vertical', name: 'Vertical list', src: 'macOS Settings', desc: 'Stacked on the left, for many sections.',
    html: `<div class="nl" style="width:150px">${['General', 'Inputs', 'Stage', 'Rider', 'Export'].map((t, i) => `<button class="${i ? '' : 'on'}" data-a="tab">${t}</button>`).join('')}</div>` }],
  modal: [{ id: 'anchored', name: 'Popover by the button', desc: 'A small form right where you clicked.', tall: true,
    html: `<span class="anchor"><button class="btn" data-a="pop">Rename…</button><div class="pop pform" style="top:38px;left:0;width:230px;padding:10px"><b class="small">Rename project</b><input class="field" style="width:100%;margin:8px 0" value="Spring tour"><div class="hstack" style="justify-content:flex-end"><span class="btn quiet sm" data-a="popx">Cancel</span><span class="btn primary sm" data-a="popx">Rename</span></div></div></span>` }],
  toast: [{ id: 'stack', name: 'Stacked, bottom left', desc: 'Click a few times: they pile up.', html: toastBtn('stack') }],
  help: [{ id: 'learn', name: '“Learn more” opens inline', desc: 'One line of help that opens into a paragraph.',
    html: `<div><h3>Run selected</h3><button class="lnk hu small plain" aria-expanded="false" data-a="toggle">Learn more ${I.chev}</button><div class="collapse-body"><div><p class="muted small" style="margin:6px 0 0">Runs the ticked todos one after another in a single session and stops if one fails.</p></div></div></div>` }],
  empty: [{ id: 'sample', name: 'Try with sample data', desc: 'One click fills the app with an example to explore.',
    html: `<div class="empty" data-samplebox><span class="ico">${I.list}</span><b>No channels yet</b><div class="hstack" style="justify-content:center"><button class="btn primary sm">Add channel</button><button class="btn sm" data-a="sample">Try a sample band</button></div></div>` }],
};

// "Table: everything together": one live table with all the table picks at once (behaviour in table-together.js)
const TT_ROWS = [['Seven Nation Army', 'The White Stripes', 'E', '124', '3:52'], ['Rolling in the Deep', 'Adele', 'C♯m', '105', '3:48'], ['Mr. Brightside', 'The Killers', 'D♭', '148', '3:42'],
  ['Everybody Wants to Rule the World (Extended Live Version)', 'Tears for Fears', 'D', '112', '4:11'], ['Valerie', 'Amy Winehouse', 'F', '106', '3:39'], ['Take Me Out', 'Franz Ferdinand', 'Em', '105', '3:57']];
const ttBtn = (a, icon, tip, cls = '') => `<button class="ib ${cls}" data-tt="${a}" data-tip="${tip}" tabindex="-1">${I[icon]}</button>`;
const ttCell = t => `<span class="tt-w" data-tip="${t}"><span class="tt-t">${t}</span></span>`;
const ttTable = full => `<div class="tt${full ? '' : ' min'}"><div class="tt-top"><div class="tt-bulk hide"><span><span data-tt-n>0</span> selected</span>
  <button data-tt="bulkdup">Duplicate</button><button data-tt="bulkdel">Delete</button><button data-tt="clear">Clear</button></div>
  <button class="tt-reset hide">${I.restore} Back to original order</button></div>
  <div class="tt-tbl"><div class="tt-tr tt-th">${full ? '<span></span>' : ''}<span class="cb"></span>${['Song', 'Artist', 'Key', 'BPM', 'Time'].map((h, i) => `<button data-tt-sort="${i}">${h}<span class="sa"></span></button>`).join('')}</div>
  <div class="tt-body">${TT_ROWS.map(r => `<div class="tt-tr" tabindex="0">${full ? '<span class="tt-grip" data-tip="Drag to reorder" aria-hidden="true">⋮⋮</span>' : ''}<span class="cb"></span>${ttCell(r[0])}${ttCell(r[1])}<span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span>${full ? `<span class="tt-acts">${ttBtn('rename', 'edit', 'Rename')}${ttBtn('dup', 'copy', 'Duplicate')}${ttBtn('del', 'trash', 'Delete', 'del')}</span>` : ''}</div>`).join('')}</div></div>
  <div class="muted small">Click a header to sort. Click, ⇧-click or ⌘-click rows${full ? '. Drag the grip. Right-click a row' : ''}.</div></div>`;
MORE.push({ id: 'table-together', group: 'Data', title: 'Table: everything together', desc: 'Everything you picked for tables, working at once.', variants: [
  { id: 'all', name: 'All together', src: 'Finder + Notion + Linear', tall: true, desc: 'Row lines, sort, checkboxes, bulk bar, grip reorder, hover icons, right-click menu, undo, ellipsis tooltips.',
    html: ttTable(true) + `<div class="pop ctx tt-menu"><button data-tt="rename">${I.edit} Rename</button><button data-tt="dup">${I.copy} Duplicate</button><hr><button class="danger" data-tt="del">${I.trash} Delete</button></div>` },
  { id: 'minimal', name: 'Minimal: sort + checkboxes only', src: 'Linear', tall: true, desc: 'No grip, no row icons, no menu. Header sort and checkbox selection.', html: ttTable(false) },
] });
MORE.push({ id: 'circuit-drawing', group: 'Drawings', title: 'Circuit drawings', desc: 'How wires, batteries, lamps and gates are drawn in explainers. Click the switches: all three show the same circuit.', variants: [] }) // filled by circuits.js;
// keyif's done moment + duty/pleasure styling. Real thing: ../keyif/src/moments.css and sound.js. Behaviour: done-moment.js.
const dmRow = (m, kind, title) => `<div class="dm dm-${m} k-${kind}"><button class="dm-check" role="checkbox" aria-checked="false" aria-label="Finish ${title}"><svg class="dm-tick" viewBox="0 0 20 20" aria-hidden="true"><path pathLength="1" d="M5 10.5l3.5 3.5L15 7"/></svg>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<i class="dm-spark" style="--a:${a}deg"></i>`).join('')}</button><span class="dm-glyph" aria-hidden="true"></span><span class="dm-text">${title}</span></div>`;
const dmDemo = m => `<div class="dm-demo kinds-warm">${dmRow(m, 'duty', 'Faturayı öde')}${dmRow(m, 'joy', 'Bir kahve iç')}<button class="btn quiet sm" data-dm-sound>♪ Try with sound</button></div>`;
const kindsDemo = k => `<div class="dm-demo kinds-${k}">${dmRow('settle', 'duty', 'Faturayı öde')}${dmRow('settle', 'joy', 'Bir kahve iç')}${dmRow('settle', 'joy', 'Sevdiğin bir şarkı')}</div>`;
MORE.push({ id: 'done-moment', group: 'Moments', title: 'Done moment (keyif)', desc: 'What happens when you finish something in keyif. Tap a circle; the row comes back so you can tap again. The feel is the point, so try each a few times.', variants: [
  { id: 'settle', name: 'Calm tick', desc: 'The row takes a small breath as the tick draws, then slips away. The quietest one.', html: dmDemo('settle') },
  { id: 'wash', name: 'Warm wash', desc: 'Warmth spreads across the row from the check, then fades.', html: dmDemo('wash') },
  { id: 'ripple', name: 'Ripple', desc: 'One ring leaves the check, like a drop in water.', html: dmDemo('ripple') },
  { id: 'sparks', name: 'Sparks', desc: 'A small burst from the check. The most festive, still no confetti.', html: dmDemo('sparks') },
  { id: 'strike', name: 'Cross it out', desc: 'A line is drawn through the words, like on paper.', html: dmDemo('strike') },
  { id: 'float', name: 'Float away', desc: 'The row lifts and dissolves upward instead of sliding off.', html: dmDemo('float') },
] });
MORE.push({ id: 'done-sound', group: 'Moments', title: 'Done sound (keyif)', desc: 'Whether finishing makes a sound. With sound on, each moment has its own short synthesised sound; the demo plays the one for your Done moment pick. Reduced motion always stays silent.', variants: [
  { id: 'off', name: 'Silent', desc: 'Only the movement.', html: `<div class="dm-demo">${dmRow('settle', 'duty', 'Faturayı öde')}</div>` },
  { id: 'on', name: 'With sound', desc: 'A quiet sound on every finish.', html: `<div class="dm-demo" data-dm-loud>${dmRow('settle', 'duty', 'Faturayı öde')}</div>` },
] });
MORE.push({ id: 'two-kinds', group: 'Moments', title: 'Duties and pleasures (keyif)', desc: 'How a pleasure reads differently from a duty when they sit side by side. There is always a small mark too, so colour never carries it alone.', variants: [
  { id: 'warm', name: 'Warm colour', desc: 'Pleasures shift from your accent toward a warm hue.', html: kindsDemo('warm') },
  { id: 'tint', name: 'Soft background', desc: 'Same accent, pleasures sit on a faint tint.', html: kindsDemo('tint') },
  { id: 'glyph', name: 'Mark only', desc: 'Same colour and background, only the ✦ mark differs.', html: kindsDemo('glyph') },
] });

MORE.push({ id: 'pg-scene', group: 'Moments', title: 'Path & garden: flat or 3D (keyif)', desc: 'The Yol view: tasks lay stones on a grass road, pleasures plant flowers beside it. Same scene drawn two ways. Use "Finish a task" and "Do a pleasure" on both, with a heavy stone too, and compare how it feels. Filled by path-garden.js.', variants: [] });
MORE.push({ id: 'pg-weight', group: 'Moments', title: 'Stone weight (keyif)', desc: 'A stone feels as heavy as the task was (guessed from how long it sat open, you can override). Pick light, medium and heavy in turn and press Finish. "♪ sound" is off until you turn it on.', variants: [] });
MORE.push({ id: 'pg-bloom', group: 'Moments', title: 'Flower bloom (keyif)', desc: 'What happens when a pleasure is done and its flower is planted. Press "Do a pleasure" four times: the 4th is a rare bloom.', variants: [] });
MORE.push({ id: 'pg-companion', group: 'Moments', title: 'Companion (keyif)', desc: 'A small creature that keeps you company on the path and reacts to what lands. Never needs feeding, never sulks. Press both buttons and watch it.', variants: [] });

// "Alive" group: live elements for new apps (ambient background, entrance, hover touches, idle signal). CSS in alive.css; real use: keyif/src/app.css.
const alStage = (cls, inner) => `<div class="al ${cls}"><div class="al-bg"></div>${inner}</div>`;
const alHead = (h, p) => `<h4>${h}</h4><p>${p}</p>`;
const alRows = `<div class="al-rows"><div class="al-row"><span class="al-dot"></span>Bir kahve iç<span class="al-act">✎ ×</span></div><div class="al-row"><span class="al-dot"></span>Sevdiğin bir şarkı<span class="al-act">✎ ×</span></div></div>`;
MORE.push({ id: 'ambient', group: 'Alive', title: 'Ambient background', desc: 'A slow living backdrop behind the app. Always slower than a breath, always off under reduced motion. Calm apps (keyif) want it; dense tools usually do not.', variants: [
  { id: 'still', name: 'Still', desc: 'Flat colour. No motion at all.', html: alStage('al-still', alHead('Merhaba', 'nothing moves')) },
  { id: 'breathe', name: 'Breathing glow', src: 'keyif, The Quiet Place', desc: 'Two soft accent glows swell and drift on a 14s loop.', html: alStage('al-breathe', alHead('Merhaba', 'two soft glows, breathing')) },
  { id: 'dusk', name: 'Dusk drift', desc: 'A wide gradient slides slowly between accent, violet and amber.', html: alStage('al-dusk', alHead('İyi akşamlar', 'colour slides like the sky')) },
  { id: 'motes', name: 'Rising motes', desc: 'Tiny specks drift upward like dust in sunlight.', html: alStage('al-motes', alHead('Merhaba', 'dust in the light')) },
  { id: 'tide', name: 'Tide', desc: 'A warm swell rises and falls along the bottom edge.', html: alStage('al-tide', alHead('İyi geceler', 'a slow tide')) },
] });
MORE.push({ id: 'entrance', group: 'Alive', title: 'Arrival', desc: 'How a screen shows up. Staggered, so the eye is led from the greeting down to the content. The demo replays on a loop.', variants: [
  { id: 'none', name: 'Instant', desc: 'Everything is there at once.', html: alStage('al-still al-in-none', alHead('Merhaba', 'already here')) },
  { id: 'rise', name: 'Rise', src: 'keyif', desc: 'Each part fades up 10px, one after another.', html: alStage('al-still al-in-rise', alHead('Merhaba', 'one after another')) },
  { id: 'blur', name: 'Focus in', src: 'The Quiet Place', desc: 'Parts start blurred and sharpen as they fade in.', html: alStage('al-still al-in-blur', alHead('Merhaba', 'coming into focus')) },
  { id: 'words', name: 'Word by word', src: 'The Quiet Place', desc: 'The headline arrives a word at a time.', html: alStage('al-still al-in-words', `<h4>${['yavaş','yavaş,','nefes','al'].map((w, i) => `<span style="--i:${i}">${w}</span>`).join('')}</h4><p>one word at a time</p>`) },
] });
MORE.push({ id: 'touch', group: 'Alive', title: 'Hover touches', desc: 'How rows answer the pointer. Quiet answers keep the page calm; the controls only appear when you reach for them.', variants: [
  { id: 'plain', name: 'Plain', desc: 'Nothing changes on hover.', html: alStage('al-still', alRows) },
  { id: 'reveal', name: 'Reveal actions', src: 'keyif, Things', desc: 'A soft pill appears under the row and its actions fade in.', html: alStage('al-still al-hover-reveal', alRows) },
  { id: 'lean', name: 'Lean in', desc: 'The row nudges toward you and takes the accent colour.', html: alStage('al-still al-hover-lean', alRows) },
  { id: 'glow', name: 'Glow', desc: 'A faint accent halo lifts the row.', html: alStage('al-still al-hover-glow', alRows) },
] });
MORE.push({ id: 'idle', group: 'Alive', title: 'Idle signal', desc: 'A small mark that shows the app is alive when nothing is happening (status dot, sync mark, active item).', variants: [
  { id: 'still', name: 'Still dot', desc: 'No motion.', html: alStage('al-still al-idle-still', alRows.replace(/<span class="al-act">.*?<\/span>/g, '')) },
  { id: 'breath', name: 'Breathing dot', desc: 'The dot swells and fades every 4s.', html: alStage('al-still al-idle-breath', alRows.replace(/<span class="al-act">.*?<\/span>/g, '')) },
  { id: 'halo', name: 'Halo', desc: 'A ring leaves the dot, like a heartbeat.', html: alStage('al-still al-idle-glow', alRows.replace(/<span class="al-act">.*?<\/span>/g, '')) },
] });
const MORE_WHEN = { tabs: { vertical: 'settings and long section lists' }, empty: { sample: 'apps that are hard to picture empty' } };

const MORE_HOW = {
  'search-box': { mode: 'combine' }, wayfinding: { mode: 'combine' },
  ambient: { mode: 'one' }, touch: { mode: 'combine' },
  'app-nav': { mode: 'context', when: { sidebar: 'apps with 5+ areas', rail: 'wide windows with many areas', top: 'apps with 2–4 views', bottom: 'narrow windows and phones' } },
  loading: { mode: 'context', when: { skeleton: 'lists and cards', spinner: 'a whole view at once', bar: 'refreshing data already on screen', stagger: 'results that arrive over time' } },
  number: { mode: 'context', when: { stepper: 'small counts', slider: 'levels and volume', scrub: 'inspectors and pro tools', unit: 'exact values with a unit' } },
  progress: { mode: 'context', when: { bar: 'jobs with a known length', ring: 'small spaces, per item', steps: 'jobs with named stages', indeterminate: 'unknown length' } },
  settings: { mode: 'context', when: { pane: 'many settings', page: 'a handful of settings with no categories', popover: 'only a few settings', dialog: 'settings opened from inside a task' } },
  steps: { mode: 'context', when: { numbered: 'setup with a few fixed steps', dots: 'quick questions, one at a time', vertical: 'long tasks and tutorials' } },
  onboarding: { mode: 'context', when: { checklist: 'apps with setup to do', coach: 'apps with a few non-obvious controls', hints: 'simple apps' } },
  unsaved: { mode: 'context', when: { dot: 'document apps you save by hand', edited: 'document apps you save by hand', chip: 'autosaving apps' } },
  banner: { mode: 'context', when: { bar: 'app-wide news (offline, update ready)', callout: 'tips inside one section', row: 'a problem with one item' } },
};

for (const [id, vs] of Object.entries(MORE_VARIANTS)) CATEGORIES.find(c => c.id === id).variants.push(...vs);
for (const [id, w] of Object.entries(MORE_WHEN)) Object.assign(CATEGORIES.find(c => c.id === id).when, w);
MORE.forEach(c => { if (!c.attr) Object.assign(c, { mode: 'one' }, MORE_HOW[c.id]); });
CATEGORIES.push(...MORE);
// Display order = this list (approved grouping). Ids never change; only group + position.
const LAYOUT = {
  'Foundations': ['palette', 'theme', 'accent', 'type', 'shape', 'density', 'motion', 'depth', 'icons', 'scrollbars'],
  'App frame': ['topbar', 'app-nav', 'tabs', 'panes', 'wayfinding', 'statusbar', 'theme-toggle', 'settings', 'steps'],
  'Buttons & actions': ['buttons', 'toolbar', 'busy', 'links', 'copy', 'shortcuts'],
  'Text input': ['text-field', 'search-box', 'labels', 'required', 'help', 'validation', 'focus', 'form-save', 'unsaved'],
  'Pickers': ['select', 'date', 'colour', 'number', 'checkbox', 'radio', 'tags', 'filters'],
  'Lists & tables': ['table', 'sort', 'paging', 'tree', 'collapsible', 'overflow', 'row-actions', 'inline-edit', 'multiselect', 'multiedit', 'reorder', 'drop', 'page-drop', 'delete', 'table-together'],
  'Status & progress': ['badges', 'attention', 'loading', 'progress'],
  'Messages & overlays': ['toast', 'banner', 'modal', 'empty', 'onboarding'],
  'Drawings': ['circuit-drawing'],
  'Moments': ['done-moment', 'done-sound', 'two-kinds', 'pg-scene', 'pg-weight', 'pg-bloom', 'pg-companion'],
  'Alive': ['ambient', 'entrance', 'touch', 'idle'],
};
const LAYOUT_IDS = Object.entries(LAYOUT).flatMap(([g, ids]) => ids.map(id => [g, id]));
LAYOUT_IDS.forEach(([g, id]) => { const c = CATEGORIES.find(c => c.id === id); if (!c) throw new Error('LAYOUT: unknown category ' + id); c.group = g; });
CATEGORIES.sort((a, b) => LAYOUT_IDS.findIndex(x => x[1] === a.id) - LAYOUT_IDS.findIndex(x => x[1] === b.id));
if (CATEGORIES.length !== LAYOUT_IDS.length) throw new Error('LAYOUT: category missing from list');
