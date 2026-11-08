// Every pickable object. Add a variant = push {id, name, src?, desc, html}; add an object = push a category.
// Categories with `attr` are foundations: picking one sets data-<attr> on <html> and restyles every demo.
const ic = (d, s = 15) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I = {
  trash: ic('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  copy: ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
  edit: ic('<path d="M4 20h4L19 9l-4-4L4 16z"/>'),
  more: ic('<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'),
  plus: ic('<path d="M12 5v14M5 12h14"/>'),
  x: ic('<path d="M6 6l12 12M18 6L6 18"/>', 12),
  sun: ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: ic('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
  undo: ic('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>'),
  redo: ic('<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>'),
  back: ic('<path d="M15 18l-6-6 6-6"/>'),
  side: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'),
  search: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
  up: ic('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  down: ic('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  archive: ic('<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9M10 13h4"/>'),
  restore: ic('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
  filter: ic('<path d="M4 5h16l-6 8v6l-4-2v-4z"/>'),
  gear: ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14.1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9.9 4.6V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.1a2 2 0 1 1 0 4h-.1z"/>'),
  file: ic('<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/>'),
  check: ic('<path d="M5 12l5 5L20 7"/>', 13),
  chev: '<span class="chev">›</span>',
};
const NAMES = ['Kick drum', 'Snare top', 'Overhead L', 'Bass DI', 'Lead vocal'];
const META = ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 7', 'Ch 12'];
const COLORS = ['#5b9dff', '#e8705a', '#9b8cff', '#3cc6b4', '#f0a94e', '#ff6b9a', '#43b85c', '#8b909a'];
const ib = (icon, a, tip, cls = '') => `<button class="ib ${cls}" data-a="${a}" data-tip="${tip}" tabindex="-1">${I[icon]}</button>`;
const GRIP = '<span class="grip" aria-hidden="true">⋮⋮</span>';
const rows = (acts = '', o = {}) => NAMES.slice(0, o.n || 4).map((t, i) =>
  `<div class="row" tabindex="0">${o.pre || ''}${o.grip ? GRIP : ''}${o.cell ? `<input class="field cell" value="${t}">` :
    `<span class="name${o.edit ? ' edit' : ''}"${o.edit ? ` data-edit="${o.edit}"` : ''}>${t}</span>`}<span class="meta">${META[i]}</span>${acts ? `<span class="acts">${acts}</span>` : ''}</div>`).join('');
const ACTS = ib('edit', 'edit', 'Rename  F2') + ib('copy', 'dup', 'Duplicate  ⌘D') + ib('trash', 'del', 'Delete  ⌫', 'del');
const MENU = (pos = 'right:0;top:30px') => `<div class="pop" style="${pos}"><button data-a="edit">${I.edit} Rename <span class="kbd">F2</span></button>
  <button data-a="dup">${I.copy} Duplicate <span class="kbd">⌘D</span></button><hr><button class="danger" data-a="del">${I.trash} Delete <span class="kbd">⌫</span></button></div>`;
const moreBtn = (pos) => `<span class="anchor"><button class="ib" data-a="pop" data-tip="More" tabindex="-1">${I.more}</button>${MENU(pos)}</span>`;
const SCRIM = (inner) => `<div class="scrim">${inner}</div>`;
const DIALOG = (title, text, ok, okCls = 'danger', okAct = 'scrim-ok') => SCRIM(`<div class="dialog" role="dialog"><h4>${title}</h4><div class="muted small">${text}</div>
  <div class="btns"><button class="btn quiet" data-a="close">Cancel</button><button class="btn ${okCls}" data-a="${okAct}">${ok}</button></div></div>`);
const opts = (list, cur) => list.map(([v, d]) => `<button data-a="opt" class="${v === cur ? 'on' : ''}"><span><span data-v>${v}</span>${d ? `<span class="opt-d">${d}</span>` : ''}</span><span class="tickm">${I.check}</span></button>`).join('');
const SIZES = [['Small'], ['Medium'], ['Large'], ['Extra large']];
const swatches = (a = 'dot') => `<div class="swatches">${COLORS.map((c, i) => `<button class="dot-c${i ? '' : ' on'}" data-a="${a}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthGrid = `<div class="hstack" style="justify-content:space-between;padding:4px 6px"><button class="ib">‹</button><b>2026</b><button class="ib">›</button></div>
  <div class="mgrid">${MONTHS.map((m, i) => `<button class="btn quiet sm${i === 2 ? ' on' : ''}" data-a="month">${m}</button>`).join('')}</div>`;
const cal = `<div class="hstack" style="justify-content:space-between;padding:4px 6px"><button class="ib">‹</button><b>March 2026</b><button class="ib">›</button></div>
  <div class="cal">${'MTWTFSS'.split('').map(d => `<span class="h">${d}</span>`).join('')}${'<span></span>'.repeat(6)}${Array.from({ length: 31 }, (_, i) =>
    `<span data-a="cal" class="${i === 11 ? 'on' : ''}" style="cursor:pointer">${i + 1}</span>`).join('')}</div>`;
const tabs = (cls, counts) => `<div class="${cls}">${['Inputs', 'Stage', 'Rider'].map((t, i) =>
  `<button class="${i ? '' : 'on'}" data-a="tab">${t}${counts ? ` <span class="count">${[12, 4, 3][i]}</span>` : ''}</button>`).join('')}</div>`;
const seg = (items, on = 0) => `<div class="seg"><span class="thumb"></span>${items.map((t, i) => `<button class="${i === on ? 'on' : ''}" data-a="seg">${t}</button>`).join('')}</div>`;
const bandItems = Array.from({ length: 12 }, (_, i) => `<div class="it" style="left:${14 + (i % 6) * 54}px;top:${18 + Math.floor(i / 6) * 58}px"></div>`).join('');
const paneSide = (side, label) => `<div class="side ${side}"><div class="ph"><span class="eyebrow">${label}</span><button class="ib" data-a="pane" data-tip="Collapse">${I.side}</button></div><div class="pb"><i></i><i style="width:70%"></i><i></i><i style="width:50%"></i></div></div>`;
const toastBtn = (kind) => `<button class="btn" data-a="toast" data-kind="${kind}">Delete a row</button>`;
const SAMPLE = `<div class="mini-top"><span class="brand">Stage<b>rider</b></span><span class="muted ell">Spring tour</span><span class="dirty"></span><span class="spacer"></span><button class="btn quiet sm">Open</button><button class="btn primary sm">Save</button></div>
  <div class="list hover-acts">${rows(ACTS, { n: 2, grip: true })}</div>
  <div class="hstack"><span class="chip acc">Selected</span><span class="chip">3 items</span><button class="sw on" data-a="sw"></button><span class="spacer"></span><h3 style="font-size:20px">Aa Gig night</h3></div>`;

const CATEGORIES = [
  // ---------- Foundations ----------
  { id: 'palette', group: 'Foundations', title: 'Surfaces & neutrals', attr: 'palette', def: 'midnight',
    desc: 'Background, surface and line colours. Each has a light and a dark side; the page toggle (top right) flips them.',
    variants: [
      { id: 'midnight', name: 'Midnight', src: 'stagerider · pm', desc: 'Near-black, cool greys, dark-first.' },
      { id: 'paper', name: 'Paper', src: 'event-planner', desc: 'Warm off-white with warm greys; dark side is ink-blue.' },
      { id: 'cool', name: 'Cool grey', src: '_starter', desc: 'Neutral blue-grey, light-first, very plain.' },
      { id: 'graphite', name: 'Graphite', src: 'stage-splitter (mac)', desc: 'macOS-like mid greys, softer contrast.' },
    ] },
  { id: 'theme', group: 'Foundations', title: 'Default theme', attr: 'theme', live: false, def: 'dark',
    desc: 'What a fresh app opens in. Every app still gets a System/Light/Dark switch.',
    variants: [
      { id: 'dark', name: 'Dark first', src: 'stagerider', desc: 'Opens dark unless the user switched.' },
      { id: 'light', name: 'Light first', src: 'event-planner · _starter', desc: 'Opens light unless the user switched.' },
      { id: 'system', name: 'Follow system', src: 'stage-splitter', desc: 'Opens in whatever macOS is set to.' },
    ] },
  { id: 'accent', group: 'Foundations', title: 'Accent colour', attr: 'accent', def: 'blue', desc: 'One accent per app: primary buttons, selection, focus, links.',
    variants: [
      { id: 'blue', name: 'Signal blue', src: 'stagerider · pm' }, { id: 'brick', name: 'Brick red', src: 'event-planner' },
      { id: 'violet', name: 'Violet' }, { id: 'teal', name: 'Teal' }, { id: 'amber', name: 'Amber', src: 'pm accent2' },
    ] },
  { id: 'type', group: 'Foundations', title: 'Typography', attr: 'type', def: 'grotesk', desc: 'Body font + display font for headings and the brand.',
    variants: [
      { id: 'grotesk', name: 'Inter + Space Grotesk', src: 'stagerider · pm', desc: 'Geometric display headings, neutral body.' },
      { id: 'system', name: 'SF system', src: 'stage-splitter', desc: 'Native Mac feel, zero font loading.' },
      { id: 'serif', name: 'Serif headings', desc: 'Iowan/Charter headings, system body. Editorial.' },
      { id: 'mono', name: 'Mono headings', desc: 'Monospace headings, system body. Tool-like.' },
    ] },
  { id: 'shape', group: 'Foundations', title: 'Corner shape', attr: 'shape', def: 'round', desc: 'Radius scale for buttons, fields, cards and popovers.',
    variants: [
      { id: 'sharp', name: 'Sharp', desc: '3–8px.' }, { id: 'soft', name: 'Soft', src: 'event-planner · stage-splitter', desc: '6–14px.' },
      { id: 'round', name: 'Round', src: 'stagerider · pm', desc: '8–17px.' }, { id: 'pill', name: 'Pill buttons', desc: 'Round cards, fully rounded buttons.' },
    ] },
  { id: 'density', group: 'Foundations', title: 'Density', attr: 'density', def: 'comfortable', desc: 'Default spacing and row height (apps can still offer a density setting).',
    variants: [
      { id: 'compact', name: 'Compact', src: 'event-planner option', desc: '27px rows, 13px text.' },
      { id: 'comfortable', name: 'Comfortable', src: 'stagerider', desc: '36px rows, 14px text.' },
      { id: 'spacious', name: 'Spacious', desc: '45px rows, 15px text.' },
    ] },
  { id: 'motion', group: 'Foundations', title: 'Motion', attr: 'motion', def: 'smooth', desc: 'Hover, press, popovers, collapse. Try clicking things in other sections after picking.',
    variants: [
      { id: 'snappy', name: 'Snappy', desc: '90–220ms, small lift.' }, { id: 'smooth', name: 'Smooth', src: 'stagerider · _webapp-defaults', desc: '120–300ms ease-out.' },
      { id: 'calm', name: 'Calm', desc: '160–420ms, gentle.' }, { id: 'minimal', name: 'Minimal', desc: 'Almost no motion, no press scale.' },
    ] },

  // ---------- Chrome ----------
  { id: 'topbar', group: 'App chrome', title: 'Top bar', desc: 'The one bar at the top of the app.', variants: [
    { id: 'lcr', name: 'Left · centre · right', src: 'stagerider', desc: 'Brand + doc + dirty dot + Save | view tabs with counts | status, undo/redo, ?, theme.',
      html: `<div class="mini-top tb3"><div><span class="brand">S<b>r</b></span><span class="ell">Spring tour</span><span class="dirty"></span><button class="btn primary sm">Save</button></div>
        <div>${tabs('tabs-p', true)}</div><div><span class="chip"><span class="dot" style="width:6px;height:6px;border-radius:50%;background:#3bb273"></span>Saved</span>${ib('undo', '', 'Undo ⌘Z')}${ib('redo', '', 'Redo ⌘⇧Z')}<button class="ib">?</button>${ib('moon', 'themeicon', 'Theme')}</div></div>` },
    { id: 'backbar', name: 'Back bar', src: 'pm', desc: 'Full width, back top-left, title, actions right. Height fits content.',
      html: `<div class="mini-top">${ib('back', '', 'Back  Esc')}<b>pm</b><span class="muted">/</span><span class="ell">stagerider</span><span class="spacer"></span><button class="btn sm">Resume</button><button class="btn primary sm">${I.plus} Capture</button></div>` },
    { id: 'unified', name: 'Mac unified toolbar', src: 'stage-splitter', desc: 'Sidebar toggle left, centred title + segmented views, search right.',
      html: `<div class="mini-top">${ib('side', '', 'Sidebar')}<span class="spacer"></span><div style="text-align:center"><b>Spring tour</b><div class="muted" style="font-size:11px">Edited</div></div><span class="spacer"></span>${ib('search', '', 'Search ⌘F')}</div><div style="text-align:center">${seg(['List', 'Plot', 'Rider'])}</div>` },
    { id: 'minimal', name: 'No bar, big title', desc: 'Large page title, actions to its right, no chrome strip.',
      html: `<div class="hstack" style="align-items:baseline"><h3 style="font-size:24px">Inputs</h3><span class="muted">12 channels</span><span class="spacer"></span><button class="btn quiet sm">Open</button><button class="btn primary sm">Save</button></div>${tabs('tabs-u')}` },
  ] },
  { id: 'tabs', group: 'App chrome', title: 'Tabs / view switcher', variants: [
    { id: 'underline', name: 'Underline', desc: 'Sliding accent underline.', html: tabs('tabs-u') },
    { id: 'pills', name: 'Tinted pills', src: 'stagerider', html: tabs('tabs-p') },
    { id: 'segmented', name: 'Segmented', src: 'stage-splitter', desc: 'Sliding thumb.', html: `<div>${seg(['Inputs', 'Stage', 'Rider'])}</div>` },
    { id: 'counts', name: 'Underline + counts', desc: 'Each tab shows how many items it holds.', html: tabs('tabs-u', true) },
  ] },
  { id: 'panes', group: 'App chrome', title: 'Side panes', desc: 'Drag the handles, click the pane icons.', variants: [
    { id: 'rail-thick', name: 'Collapse to rail + thick handle', src: 'event-planner · stagerider', desc: 'Handle thickens with accent on hover/drag; double-click resets.',
      html: `<div class="panes">${paneSide('left', 'Layers')}<div class="rz" data-side="left"></div><div class="main">canvas</div><div class="rz" data-side="right"></div>${paneSide('right', 'Inspector')}</div>` },
    { id: 'rail-plain', name: 'Collapse to rail + hairline', desc: 'Same, but the divider stays a thin line.',
      html: `<div class="panes">${paneSide('left', 'Layers')}<div class="rz plain" data-side="left"></div><div class="main">canvas</div><div class="rz plain" data-side="right"></div>${paneSide('right', 'Inspector')}</div>` },
    { id: 'drawer', name: 'Overlay drawer', desc: 'Pane slides over the content; content never shrinks.',
      html: `<div class="panes" style="position:relative"><div class="main" style="display:flex;flex-direction:column;gap:8px"><button class="btn sm" data-a="drawer">${I.side} Layers</button>canvas</div><div class="drawer"><div class="hstack"><span class="eyebrow">Layers</span><span class="spacer"></span><button class="ib" data-a="drawer">${I.x}</button></div></div></div>` },
    { id: 'fixed', name: 'Fixed panes', desc: 'No resize, no collapse. Simplest.',
      html: `<div class="panes">${paneSide('left', 'Layers').replace(/<button.*?<\/button>/, '')}<div class="main">canvas</div>${paneSide('right', 'Inspector').replace(/<button.*?<\/button>/, '')}</div>` },
  ] },
  { id: 'buttons', group: 'App chrome', title: 'Buttons', variants: [
    { id: 'classic', name: 'Solid · outline · quiet', src: 'stagerider · pm', html: `<div class="hstack"><button class="btn primary">Save</button><button class="btn">Open</button><button class="btn quiet">Cancel</button><button class="btn danger">Delete</button></div>` },
    { id: 'soft', name: 'Soft tinted', src: 'stage-splitter SoftButtonStyle', html: `<div class="hstack"><button class="btn primary">Save</button><button class="btn soft">Open</button><button class="btn soft neutral">Cancel</button><button class="btn quiet" style="color:var(--danger)">Delete</button></div>` },
    { id: 'lift', name: 'Lift on hover', desc: 'Rises with a deeper shadow under the pointer.', html: `<div class="hstack"><button class="btn primary lift">Save</button><button class="btn lift">Open</button><button class="btn quiet">Cancel</button><button class="btn danger lift">Delete</button></div>` },
    { id: 'ghost', name: 'Accent outline', html: `<div class="hstack"><button class="btn primary">Save</button><button class="btn ghost">Open</button><button class="btn quiet">Cancel</button><button class="btn ghost" style="border-color:var(--danger);color:var(--danger)">Delete</button></div>` },
  ] },
  { id: 'theme-toggle', group: 'App chrome', title: 'Theme switch', variants: [
    { id: 'icon', name: 'One icon button', src: 'stagerider', desc: 'Sun/moon in the top bar, cycles.', html: `<div class="hstack">${ib('moon', 'themeicon', 'Theme')}<span class="muted small">click it</span></div>` },
    { id: 'seg3', name: 'System · Light · Dark', src: 'stage-splitter · _starter', html: `<div>${seg(['System', 'Light', 'Dark'])}</div>` },
    { id: 'menu', name: 'Inside a settings menu', desc: 'Keeps the bar clean.', html: `<span class="anchor">${ib('gear', 'pop', 'Settings')}<div class="pop" style="top:32px;left:0">${opts([['System'], ['Light'], ['Dark']], 'Dark')}<hr><button>Language · TR</button><button>Density</button></div></span>` },
  ] },
  { id: 'shortcuts', group: 'App chrome', title: 'Shortcut discovery', variants: [
    { id: 'panel', name: '? cheat-sheet panel', src: 'stagerider', html: `<button class="btn" data-a="modal">? Shortcuts</button>${SCRIM(`<div class="sheet-s"><div class="hstack"><b>Shortcuts</b><span class="spacer"></span><button class="ib" data-a="close">${I.x}</button></div>${[['Undo', '⌘Z'], ['Duplicate', '⌘D'], ['Move row', '⌥↑↓'], ['Delete', '⌫'], ['Save', '⌘S']].map(([a, k]) => `<div class="kv"><span>${a}</span><span class="kbd">${k}</span></div>`).join('')}</div>`)}` },
    { id: 'palette', name: '⌘K command palette', src: '_starter', html: `<button class="btn" data-a="modal"><span class="kbd">⌘K</span> Commands</button>${SCRIM(`<div class="dialog" style="padding:8px"><input class="field" style="width:100%" placeholder="Type a command…"><div class="pop open" style="position:static;box-shadow:none;border:0">${[['Add channel', '⏎'], ['Duplicate', '⌘D'], ['Toggle theme', '⌘⇧L'], ['Export PDF', '⌘P']].map(([a, k]) => `<button data-a="close">${a}<span class="kbd">${k}</span></button>`).join('')}</div></div>`)}` },
    { id: 'tips', name: 'In every tooltip', src: 'stagerider shortcuts.ts', desc: 'Hover any button: the tip names the shortcut.', html: `<div class="hstack">${ib('undo', '', 'Undo  ⌘Z')}${ib('redo', '', 'Redo  ⌘⇧Z')}${ib('copy', '', 'Duplicate  ⌘D')}${ib('trash', '', 'Delete  ⌫', 'del')}</div>` },
  ] },

  // ---------- Lists ----------
  { id: 'row-actions', group: 'Lists & rows', title: 'Row actions', desc: 'Where edit / duplicate / delete live on a list item. Pick several to combine.', variants: [
    { id: 'hover', name: 'Icons on hover', src: 'pm', desc: 'Hidden until the row is hovered or focused.', html: `<div class="list hover-acts">${rows(ACTS)}</div>` },
    { id: 'dim', name: 'Always visible, dimmed', src: 'stagerider', desc: 'Icons at 55% that brighten on hover. Discoverable.', html: `<div class="list dim-acts">${rows(ACTS)}</div>` },
    { id: 'menu', name: '⋯ overflow menu', desc: 'One button per row opens a menu with shortcuts.', tall: true, html: `<div class="list">${rows(moreBtn())}</div>` },
    { id: 'context', name: 'Right-click menu', desc: 'Nothing visible on the row; right-click (or ⇧F10) opens the menu.', tall: true,
      html: `<div class="muted small">Right-click a row</div><div class="list" data-ctx>${rows()}</div>${MENU('').replace('class="pop"', 'class="pop ctx"')}` },
    { id: 'hover-more', name: 'Main icon + ⋯ for the rest', desc: 'Most-used action visible on hover, everything else in the menu.', tall: true,
      html: `<div class="list hover-acts">${rows(ib('edit', 'edit', 'Rename  F2') + moreBtn())}</div>` },
    { id: 'toolbar', name: 'Select, then toolbar', desc: 'Rows carry no buttons; selecting enables a toolbar above the list.',
      html: `<div class="hstack"><span class="muted small"><span data-selcount>0</span> selected</span><span class="spacer"></span><span class="seltools hstack">${ib('edit', 'seledit', 'Rename')}${ib('copy', 'bulkdup', 'Duplicate')}${ib('trash', 'bulkdel', 'Delete', 'del')}</span></div><div class="list selectable">${rows()}</div>` },
  ] },
  { id: 'reorder', group: 'Lists & rows', title: 'Reorder', variants: [
    { id: 'grip', name: 'Drag the grip', src: 'stagerider · _starter', desc: 'Grip on the left, rows glide.', html: `<div class="list reorder">${rows('', { grip: true })}</div>` },
    { id: 'arrows', name: 'Up/down on hover', desc: 'Two arrow buttons per row.', html: `<div class="list hover-acts">${rows(ib('up', 'up', 'Move up  ⌥↑') + ib('down', 'down', 'Move down  ⌥↓'))}</div>` },
    { id: 'keys', name: 'Grip + ⌥↑/↓', desc: 'Grip for mouse, Alt+arrows on a focused row.', html: `<div class="muted small">Click a row, then ⌥↑ / ⌥↓</div><div class="list reorder">${rows('', { grip: true })}</div>` },
  ] },
  { id: 'inline-edit', group: 'Lists & rows', title: 'Inline edit', variants: [
    { id: 'dbl', name: 'Double-click / F2', src: '_starter · pm', html: `<div class="list">${rows('', { edit: 'dbl' })}</div>` },
    { id: 'click', name: 'Single click on text', desc: 'Text underlines on hover, one click edits.', html: `<div class="list">${rows('', { edit: 'click' })}</div>` },
    { id: 'cells', name: 'Always a field', src: 'stagerider grid', desc: 'Spreadsheet-like: every cell is an input.', html: `<div class="list">${rows('', { cell: true })}</div>` },
    { id: 'pencil', name: 'Pencil button', html: `<div class="list hover-acts">${rows(ib('edit', 'edit', 'Rename'), { edit: 'btn' })}</div>` },
  ] },
  { id: 'delete', group: 'Lists & rows', title: 'Delete', desc: 'Decided: confirm only what cannot be undone. Pick how each case looks.', variants: [
    { id: 'undo', name: 'Instant + Undo toast', src: '_webapp-defaults', html: `<div class="list hover-acts">${rows(ib('trash', 'del', 'Delete', 'del'))}</div>` },
    { id: 'dialog', name: 'Confirm dialog', src: 'pm dialog.jsx', desc: 'For irreversible deletes (files on disk, other people’s data).', html: `<div class="list hover-acts">${rows(ib('trash', 'askdel', 'Delete', 'del'))}</div>${DIALOG('Delete “<span data-target></span>”?', 'This removes the file from disk. It can’t be undone.', 'Delete')}` },
    { id: 'twostep', name: 'Click twice', desc: 'Button turns red “Sure?” for 3s; no dialog.', html: `<div class="list hover-acts">${rows('<button class="btn quiet sm" data-a="twostep" tabindex="-1">Delete</button>')}</div>` },
    { id: 'archive', name: 'Archive + restore', src: 'pm backlog', desc: 'Nothing is deleted; archived items wait in a collapsed section.', tall: true,
      html: `<div class="list hover-acts" data-live>${rows(ib('archive', 'archive', 'Archive'), { n: 3 })}</div><div><button class="sec-h" aria-expanded="false" data-a="toggle">${I.chev} Archived <span class="count" data-acount>0</span></button><div class="collapse-body"><div><div class="list hover-acts" data-archived></div></div></div></div>` },
  ] },
  { id: 'multiselect', group: 'Lists & rows', title: 'Multi-select', variants: [
    { id: 'clickbar', name: 'Click / ⇧ / ⌘ + floating bar', src: 'stagerider', desc: 'Selection shows a dark action bar at the bottom.', tall: true,
      html: `<div class="muted small">Click, ⇧-click, ⌘-click</div><div class="list selectable">${rows()}</div><div class="bulkbar hide" style="position:absolute;bottom:10px;left:50%;translate:-50%"><span><span data-selcount>0</span> selected</span><button data-a="bulkdup">Duplicate</button><button data-a="bulkdel">Delete</button><button data-a="selnone">✕</button></div>` },
    { id: 'checks', name: 'Checkbox column', desc: 'Header checkbox selects all; inline action bar.',
      html: `<div class="hstack" style="padding-left:12px"><span class="cb" data-a="cball"></span><span class="muted small"><span data-selcount>0</span> selected</span><span class="spacer"></span><span class="seltools"><button class="btn quiet sm" data-a="bulkdel">Delete</button></span></div><div class="list selectable checks">${rows('', { pre: '<span class="cb" data-a="cbsel"></span>' })}</div>` },
    { id: 'band', name: 'Rubber band (outline)', src: 'stagerider canvas', desc: 'Drag on empty space. Outline only.', html: `<div class="band-area" data-band="outline">${bandItems}</div>` },
    { id: 'bandfill', name: 'Rubber band (filled)', desc: 'Drag on empty space. Tinted fill.', html: `<div class="band-area" data-band="fill">${bandItems}</div>` },
  ] },
  { id: 'multiedit', group: 'Lists & rows', title: 'Editing several at once', desc: 'Inspector with 3 items selected whose values differ.', variants: [
    { id: 'mixed', name: '“Mixed” placeholder', src: 'stagerider', html: `<div class="panel ins"><span class="eyebrow">3 selected</span><label>Name <input class="field" placeholder="Mixed"></label><label>Colour <span class="dot-c half"></span></label><label>Stereo <span class="cb" style="background:var(--surface2)">–</span></label></div>` },
    { id: 'count', name: 'Blank + “3 values”', desc: 'Empty field with a chip telling how many different values.', html: `<div class="panel ins"><span class="eyebrow">3 selected</span><label>Name <span class="hstack"><input class="field" style="flex:1"><span class="chip">3 values</span></span></label><label>Colour <span class="hstack"><span class="dot-c" style="background:var(--surface2)"></span><span class="chip">2 values</span></span></label></div>` },
    { id: 'first', name: 'First value, greyed', desc: 'Shows the first item’s value faded, “+2 differ”.', html: `<div class="panel ins"><span class="eyebrow">3 selected</span><label>Name <span class="hstack"><input class="field mixed" style="flex:1" value="Kick drum"><span class="muted small">+2 differ</span></span></label><label>Colour <span class="hstack"><span class="dot-c" style="background:#5b9dff;opacity:.5"></span><span class="muted small">+1 differs</span></span></label></div>` },
  ] },
  { id: 'collapsible', group: 'Lists & rows', title: 'Collapsible sections', desc: 'Decided: collapsed state is remembered and shows a count. Pick the header look.', variants: [
    { id: 'chevron', name: 'Chevron + count', src: 'pm', html: `<div><button class="sec-h" aria-expanded="true" data-a="toggle">${I.chev} Doing <span class="count">2</span></button><div class="collapse-body"><div><div class="list">${rows('', { n: 2 })}</div></div></div></div><div><button class="sec-h" aria-expanded="false" data-a="toggle">${I.chev} Done <span class="count">14</span></button><div class="collapse-body"><div><div class="list">${rows('', { n: 3 })}</div></div></div></div>` },
    { id: 'eyebrow', name: 'Small-caps header, chevron right', src: 'stagerider pane-head', html: `<div><button class="sec-h" aria-expanded="true" data-a="toggle"><span class="eyebrow">Doing</span><span class="count">2</span><span class="spacer"></span>${I.chev}</button><div class="collapse-body"><div><div class="list">${rows('', { n: 2 })}</div></div></div></div><div><button class="sec-h" aria-expanded="false" data-a="toggle"><span class="eyebrow">Done</span><span class="count">14</span><span class="spacer"></span>${I.chev}</button><div class="collapse-body"><div><div class="list">${rows('', { n: 3 })}</div></div></div></div>` },
    { id: 'cards', name: 'Card accordion', src: 'event-planner', html: `<div class="panel"><button class="sec-h" style="padding:10px 12px" aria-expanded="true" data-a="toggle"><b>Doing</b><span class="count">2</span><span class="spacer"></span>${I.chev}</button><div class="collapse-body"><div style="padding:0 8px 8px"><div class="list">${rows('', { n: 2 })}</div></div></div></div><div class="panel"><button class="sec-h" style="padding:10px 12px" aria-expanded="false" data-a="toggle"><b>Done</b><span class="count">14</span><span class="spacer"></span>${I.chev}</button><div class="collapse-body"><div style="padding:0 8px 8px"><div class="list">${rows('', { n: 3 })}</div></div></div></div>` },
    { id: 'more', name: '“Show 3 more”', desc: 'Long lists show the first few, then a link.', html: `<div class="list">${rows('', { n: 2 })}</div><div><button class="btn quiet sm" aria-expanded="false" data-a="toggle">Show 3 more ${I.chev}</button><div class="collapse-body"><div><div class="list">${rows('', { n: 3 })}</div></div></div></div>` },
  ] },

  // ---------- Controls ----------
  { id: 'select', group: 'Controls', title: 'Select / dropdown', desc: 'Never the native popup.', variants: [
    { id: 'listbox', name: 'Listbox with tick', src: 'stagerider · event-planner', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>Medium</span>▾</button><div class="pop" style="top:36px;left:0">${opts(SIZES, 'Medium')}</div></span>` },
    { id: 'search', name: 'Searchable', desc: 'Type to filter; for long lists.', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>Bass DI</span>▾</button><div class="pop" style="top:36px;left:0"><input class="field" data-filter placeholder="Search…" style="width:100%;margin-bottom:4px">${opts(NAMES.map(n => [n]), 'Bass DI')}</div></span>` },
    { id: 'seg', name: 'Segmented (≤4 options)', html: `<div>${seg(['S', 'M', 'L', 'XL'], 1)}</div>` },
    { id: 'desc', name: 'Menu with descriptions', desc: 'Each option explains itself.', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>Auto</span>▾</button><div class="pop" style="top:36px;left:0;width:240px">${opts([['Auto', 'Decide from the file'], ['Mono', 'Fold to one channel'], ['Stereo', 'Keep left/right']], 'Auto')}</div></span>` },
  ] },
  { id: 'colour', group: 'Controls', title: 'Colour picker', variants: [
    { id: 'dot', name: 'One dot → swatches', src: 'pm', tall: true, html: `<span class="anchor"><button class="dot-c trig" data-a="pop" style="background:${COLORS[0]}"></button><div class="pop" style="top:30px;left:0;width:150px;padding:8px">${swatches()}</div></span>` },
    { id: 'row', name: 'Inline swatch row', src: 'stagerider', html: swatches() },
    { id: 'hex', name: 'Swatches + hex field', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span class="hstack"><span class="dot-c trig" style="background:${COLORS[0]};width:16px;height:16px"></span><span data-hex>${COLORS[0]}</span></span>▾</button><div class="pop" style="top:36px;left:0;width:170px;padding:8px">${swatches()}<input class="field" style="width:100%;margin-top:8px" value="${COLORS[0]}"></div></span>` },
  ] },
  { id: 'date', group: 'Controls', title: 'Date / month', variants: [
    { id: 'months', name: 'Month grid', src: 'prova ask', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>Mar 2026</span>▾</button><div class="pop" style="top:36px;left:0;width:230px">${monthGrid}</div></span>` },
    { id: 'calendar', name: 'Calendar popover', tall: true, html: `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>12 Mar 2026</span>▾</button><div class="pop" style="top:36px;left:0;width:240px">${cal}</div></span>` },
    { id: 'quick', name: 'Quick chips + calendar', desc: 'Today / Tomorrow / Next week first.', tall: true, html: `<div class="hstack">${['Today', 'Tomorrow', 'Next week'].map((t, i) => `<button class="btn sm ${i ? '' : 'soft'}" data-a="chipone">${t}</button>`).join('')}<span class="anchor"><button class="btn sm" data-a="pop">Pick…</button><div class="pop" style="top:32px;right:0;width:240px">${cal}</div></span></div>` },
  ] },
  { id: 'checkbox', group: 'Controls', title: 'Checkbox & switch', desc: 'Pick one for “on/off settings” and one for “select items”.', variants: [
    { id: 'square', name: 'Square tick', html: ['Show channel numbers', 'Group by stage', 'Auto-save'].map((t, i) => `<label class="hstack" style="cursor:pointer"><span class="cb${i ? '' : ' on'}" data-a="cb"></span>${t}</label>`).join('') },
    { id: 'round', name: 'Round tick', html: ['Show channel numbers', 'Group by stage', 'Auto-save'].map((t, i) => `<label class="hstack" style="cursor:pointer"><span class="cb round${i ? '' : ' on'}" data-a="cb"></span>${t}</label>`).join('') },
    { id: 'switch', name: 'Switch', src: 'event-planner', html: ['Show channel numbers', 'Group by stage', 'Auto-save'].map((t, i) => `<label class="hstack" style="justify-content:space-between">${t}<button class="sw${i ? '' : ' on'}" data-a="sw"></button></label>`).join('') },
  ] },
  { id: 'filters', group: 'Controls', title: 'Filters', variants: [
    { id: 'chips', name: '+ Add filter chips, “N of M”', src: 'tezgah · parity asks', tall: true, html: `<div class="hstack" data-filters><span class="chip acc">Stage: Main <button class="ib" style="width:16px;height:16px" data-a="rmf">${I.x}</button></span><span class="anchor"><button class="btn quiet sm" data-a="pop">${I.plus} Add filter</button><div class="pop" style="top:30px;left:0">${['Type: Drums', 'Mic: SM57', 'Stereo'].map(f => `<button data-a="addf">${f}</button>`).join('')}</div></span><span class="spacer"></span><span class="muted small" data-nofm>9 of 12</span></div><div class="list">${rows('', { n: 3 })}</div>` },
    { id: 'pm', name: 'Search + sort + filter badge', src: 'pm Home', tall: true, html: `<div class="hstack"><input class="field" style="flex:1" placeholder="Search…"><span class="anchor"><button class="btn sm" data-a="pop">Sort: Recent ▾</button><div class="pop" style="top:32px;right:0">${opts([['Recent'], ['Name'], ['Status']], 'Recent')}</div></span><button class="btn sm">${I.filter}<span class="count" style="background:var(--accent);color:var(--on-accent)">2</span></button></div><div class="list">${rows('', { n: 3 })}</div>` },
    { id: 'facets', name: 'Facet sidebar', desc: 'Checkbox groups beside the list.', html: `<div class="facets"><div><span class="eyebrow">Type</span>${['Drums', 'Bass', 'Vocals'].map((t, i) => `<label><span class="cb${i ? '' : ' on'}" data-a="cb"></span>${t}</label>`).join('')}</div><div class="list">${rows('', { n: 3 })}</div></div>` },
  ] },
  { id: 'busy', group: 'Controls', title: 'Busy button', desc: 'Decided: every async button shows it is working and can’t be double-clicked. Click to see.', variants: [
    { id: 'spin', name: 'Spinner + disabled + ✓', src: 'prova ask', html: `<div><button class="btn primary" data-a="busy" data-kind="spin"><span class="spin"></span><span class="lbl">Save</span></button></div>` },
    { id: 'bar', name: 'Fill bar inside the button', html: `<div><button class="btn primary barbtn" data-a="busy" data-kind="bar"><span class="fill"></span><span class="lbl">Export PDF</span></button></div>` },
    { id: 'text', name: 'Label only: “Saving…”', html: `<div><button class="btn primary" data-a="busy" data-kind="text"><span class="lbl">Save</span></button></div>` },
    { id: 'chip', name: 'Status chip elsewhere', src: 'stagerider autosave', desc: 'Button stays live; a chip in the bar reports progress.', html: `<div class="mini-top"><span class="brand">S<b>r</b></span><span class="spacer"></span><span class="file-chip" data-busychip data-s="saved"><span class="dot"></span><span>Saved</span></span><button class="btn primary sm" data-a="busy" data-kind="chip"><span class="lbl">Save</span></button></div>` },
  ] },

  // ---------- Feedback ----------
  { id: 'toast', group: 'Feedback', title: 'Toasts', variants: [
    { id: 'inverted', name: 'Bottom centre, inverted', src: 'stagerider · _starter', html: toastBtn('inverted') },
    { id: 'card', name: 'Bottom right card', src: 'event-planner', html: toastBtn('card') },
    { id: 'pill', name: 'Top pill', html: toastBtn('pill') },
    { id: 'chip', name: 'No toast, status chip', desc: 'Messages appear in the bar; Undo stays ⌘Z.', html: `<div class="mini-top"><span class="brand">S<b>r</b></span><span class="spacer"></span><span class="chip" data-statuschip>All saved</span></div>${toastBtn('chip')}` },
  ] },
  { id: 'modal', group: 'Feedback', title: 'Dialogs & sheets', variants: [
    { id: 'center', name: 'Centred dialog', src: 'pm dialog.jsx', tall: true, html: `<button class="btn" data-a="modal">Open</button>${DIALOG('Rename project', '<input class="field" style="width:100%;margin-top:8px" value="Spring tour">', 'Rename', 'primary', 'close')}` },
    { id: 'bottom', name: 'Bottom sheet', src: 'pm mobile', tall: true, html: `<button class="btn" data-a="modal">Open</button>${SCRIM(`<div class="sheet-b"><b>Rename project</b><input class="field" style="width:100%;margin:10px 0" value="Spring tour"><div class="hstack" style="justify-content:flex-end"><button class="btn quiet" data-a="close">Cancel</button><button class="btn primary" data-a="close">Rename</button></div></div>`)}` },
    { id: 'side', name: 'Side sheet', tall: true, html: `<button class="btn" data-a="modal">Open</button>${SCRIM(`<div class="sheet-s"><b>Rename project</b><input class="field" style="width:100%;margin:10px 0" value="Spring tour"><div class="hstack"><button class="btn quiet" data-a="close">Cancel</button><button class="btn primary" data-a="close">Rename</button></div></div>`)}` },
  ] },
  { id: 'empty', group: 'Feedback', title: 'Empty state / start', variants: [
    { id: 'icon', name: 'Icon + sentence + action', src: 'stage-splitter EmptyStateView', html: `<div class="empty"><span class="ico">${I.plus}</span><b>No channels yet</b><span class="muted small">Add the first input to start your patch list.</span><button class="btn primary sm">Add channel</button></div>` },
    { id: 'drop', name: 'Big drop zone', desc: 'A button-like zone, never a bare file input.', html: `<button class="zone">${I.file}<div><b>Drop a file</b> or click to open</div><div class="small">.json, .csv</div></button>` },
    { id: 'start', name: 'Start page with recents', src: 'stagerider StartPage', html: `<div class="hstack"><button class="btn primary sm">${I.plus} New</button><button class="btn sm">Open…</button></div><span class="eyebrow">Recent</span><div class="list hover-acts">${['Spring tour.rider', 'Jazz night.rider', 'Festival.rider'].map(n => `<div class="row" tabindex="0">${I.file}<span class="name lnk">${n}</span><span class="meta">2d</span><span class="acts">${ib('x', 'del', 'Forget')}</span></div>`).join('')}</div>` },
  ] },
  { id: 'help', group: 'Feedback', title: 'Inline help', variants: [
    { id: 'tooltip', name: 'Delayed tooltip', desc: 'Hover 300ms; names the action and its key.', html: `<div class="hstack">${ib('undo', '', 'Undo  ⌘Z')}${ib('copy', '', 'Duplicate  ⌘D')}<span class="muted small">hover the icons</span></div>` },
    { id: 'q', name: '? next to a heading', src: 'pm Help', html: `<div class="hstack"><h3>Run selected</h3><button class="help" data-tip="Runs the ticked todos in one session">?</button></div>` },
    { id: 'text', name: 'Helper text under the heading', html: `<div><h3>Run selected</h3><div class="muted small">Runs the ticked todos one after another in a single session.</div></div>` },
  ] },
  { id: 'links', group: 'Feedback', title: 'Clickable text', desc: 'File names, project names, anything that opens something.', variants: [
    { id: 'under', name: 'Always underlined', src: 'sift ask', html: `<div>Report saved to <span class="lnk u">brief-2026-10.md</span></div>` },
    { id: 'hover', name: 'Underline on hover', html: `<div>Report saved to <span class="lnk hu">brief-2026-10.md</span></div>` },
    { id: 'arrow', name: 'Accent + arrow', html: `<div>Report saved. <span class="lnk">Open brief →</span></div>` },
  ] },
  { id: 'overflow', group: 'Feedback', title: 'Long text', desc: 'Decided: text is never cut without a way to read it.', variants: [
    { id: 'ellipsis', name: 'Ellipsis + full-text tooltip', desc: 'Hover the row: the bubble shows the whole text over several lines.', tall: true, html: `<div class="list" style="width:220px"><div class="row tipw" data-tip-b data-tip="Overhead left – Neumann KM184 on the drummer’s side"><span class="name">Overhead left – Neumann KM184 on the drummer’s side</span></div></div>` },
    { id: 'clamp', name: 'Two lines, then ellipsis', html: `<div class="panel" style="width:220px;padding:8px"><div class="clamp2">Overhead left – Neumann KM184 on the drummer’s side, pointing at the snare</div></div>` },
    { id: 'wrap', name: 'Always wrap', html: `<div class="panel" style="width:220px;padding:8px">Overhead left – Neumann KM184 on the drummer’s side, pointing at the snare</div>` },
  ] },
];

// How several picks in one section relate (the 2026-10-20 picks showed "pick one or more" was ambiguous).
// combine: everything picked ships together; a "Together" card shows the mix live (combo(ids), else the demos stacked).
// context: each pick is for a different situation (`when` per variant), summarised as "Your rule". one: alternatives.
const HOW = {
  topbar: { mode: 'combine' }, buttons: { mode: 'combine' }, shortcuts: { mode: 'combine' }, help: { mode: 'combine' },
  'row-actions': { mode: 'combine', combo: ids => {
    const has = x => ids.includes(x), ctx = has('context');
    let acts = has('hover') || has('dim') ? ACTS : has('hover-more') ? ib('edit', 'edit', 'Rename  F2') : '';
    if (has('menu') || has('hover-more')) acts += moreBtn();
    return `<div class="muted small">Hover a row${ctx ? ', or right-click it' : ''}</div><div class="list ${has('hover') ? 'hover-acts' : 'dim-acts'}"${ctx ? ' data-ctx' : ''}>${rows(acts)}</div>${ctx ? MENU('').replace('class="pop"', 'class="pop ctx"') : ''}`;
  } },
  'inline-edit': { mode: 'combine', combo: ids => `<div class="muted small">${ids.includes('click') ? 'Click' : 'Double-click / F2'} the text${ids.includes('pencil') ? ', or the pencil' : ''}</div>
    <div class="list hover-acts">${rows(ids.includes('pencil') ? ib('edit', 'edit', 'Rename  F2') : '', { edit: ids.includes('click') ? 'click' : 'dbl' })}</div>` },
  reorder: { mode: 'combine', combo: ids => `<div class="muted small">Drag the grip${ids.includes('arrows') ? ', use the arrows' : ''}, or ⌥↑ / ⌥↓</div>
    <div class="list reorder hover-acts">${rows(ids.includes('arrows') ? ib('up', 'up', 'Move up  ⌥↑') + ib('down', 'down', 'Move down  ⌥↓') : '', { grip: true })}</div>` },
  select: { mode: 'combine', combo: ids => `<span class="anchor"><button class="field selbtn" data-a="pop"><span data-lbl>Auto</span>▾</button><div class="pop" style="top:36px;left:0;width:250px">${ids.includes('search') ? '<input class="field" data-filter placeholder="Search…" style="width:100%;margin-bottom:4px">' : ''}${opts(ids.includes('desc') ? [['Auto', 'Decide from the file'], ['Mono', 'Fold to one channel'], ['Stereo', 'Keep left/right']] : [['Auto'], ['Mono'], ['Stereo']], 'Auto')}</div></span>` },
  tabs: { mode: 'context', when: { underline: 'main views', pills: 'main views', segmented: 'small mode switches inside a view', counts: 'views that hold items' } },
  panes: { mode: 'context', when: { 'rail-thick': 'wide windows', 'rail-plain': 'wide windows', drawer: 'narrow windows', fixed: 'simple tools' } },
  delete: { mode: 'context', when: { undo: 'rows and anything undoable', dialog: 'irreversible deletes (files on disk, processes)', twostep: 'inline danger buttons', archive: 'things worth keeping' } },
  multiselect: { mode: 'context', when: { clickbar: 'lists', checks: 'lists and tables', band: 'canvases', bandfill: 'canvases' } },
  collapsible: { mode: 'context', when: { cards: 'top-level page sections', chevron: 'lists inside a panel or card', eyebrow: 'pane headers', more: 'long lists' } },
  colour: { mode: 'context', when: { dot: 'everyday colour choice', row: 'a few always-visible colours', hex: 'advanced settings (exact colour)' } },
  date: { mode: 'context', when: { calendar: 'picking a day', months: 'picking a month', quick: 'due dates' } },
  checkbox: { mode: 'context', when: { square: 'selecting items', round: 'selecting items', switch: 'on/off settings' } },
  filters: { mode: 'context', when: { chips: 'short lists', pm: 'lists up to ~50 items', facets: 'lists over ~50 items' } },
  busy: { mode: 'context', when: { spin: 'buttons that run something', bar: 'long jobs with progress', text: 'plain text buttons', chip: 'autosave, no Save button' } },
  empty: { mode: 'context', when: { icon: 'an empty list', drop: 'importing / opening a file', start: 'document apps on launch' } },
};
CATEGORIES.forEach(c => { if (!c.attr) Object.assign(c, { mode: 'one' }, HOW[c.id]); });
// foundation defaults = the user's picks (picks.json 2026-10-20)
[['palette', 'midnight'], ['theme', 'system'], ['accent', 'teal'], ['type', 'serif'], ['shape', 'pill'], ['density', 'comfortable'], ['motion', 'calm']]
  .forEach(([id, v]) => { CATEGORIES.find(c => c.id === id).def = v; });
