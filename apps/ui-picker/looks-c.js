// LOOKS.push(...) via look(parent, variant, label, situation, scope, styles). See looks.js for the convention.

// ---------- tabs: Underline (main views) ----------
look('tabs', 'underline', 'Underline tabs', 'main views', 'ctabu', [
  ['asnow', 'As now', 'Thin accent underline, muted labels.', ''],
  ['thick', 'Thick bar, bold', 'Heavy 4px bar, larger bold labels.', 'thick'],
  ['boxed', 'Boxed on a rail', 'The active tab is a tinted box sitting on the line.', 'boxed'],
  ['wide', 'Spread out, caps', 'Roomy gaps, small spaced capitals.', 'wide'],
]);

// ---------- tabs: Segmented (small mode switches) ----------
look('tabs', 'segmented', 'Segmented switch', 'small mode switches inside a view', 'ctabs', [
  ['asnow', 'As now', 'Grey track, raised white thumb.', ''],
  ['solid', 'Solid accent thumb', 'The chosen segment is filled with the accent.', 'solid'],
  ['outline', 'Outlined, square', 'Bordered track with sharp corners, no shadow.', 'outline'],
  ['big', 'Large and bold', 'Taller, heavier labels, fully round.', 'big'],
]);

// ---------- tabs: Underline + counts (views that hold items) ----------
look('tabs', 'counts', 'Tab counts', 'views that hold items', 'ctabc', [
  ['asnow', 'As now', 'Grey count bubble after each label.', ''],
  ['accent', 'Accent count on active', 'The active tab’s count turns solid accent.', 'accent'],
  ['super', 'Small raised number', 'Tiny superscript number, no bubble.', 'super'],
  ['outline', 'Outlined bubble', 'Bordered count, square-ish corners.', 'outline'],
]);

// ---------- panes: Overlay drawer (narrow windows) ----------
look('panes', 'drawer', 'Overlay drawer', 'narrow windows', 'cdraw', [
  ['asnow', 'As now', 'Plain panel with a soft shadow.', ''],
  ['wide', 'Wide, tinted header', 'Wider panel with an accent-tinted header strip.', 'wide'],
  ['card', 'Floating card', 'Inset from the edges with rounded corners.', 'card'],
  ['flat', 'Flat, accent edge', 'No shadow; a thick accent edge on the open side.', 'flat'],
]);

// ---------- panes: Collapse to rail + thick handle (wide windows) ----------
look('panes', 'rail-thick', 'Pane handle', 'wide windows', 'cpane', [
  ['asnow', 'As now', 'Short grey grip that thickens on hover.', ''],
  ['dots', 'Dotted grip', 'Always visible accent-tinted line with a wide hit area.', 'dots'],
  ['bar', 'Full-height bar', 'A visible 3px divider the whole way down.', 'bar'],
  ['tint', 'Tinted panes', 'Panes get a soft grey fill and larger headers.', 'tint'],
]);

// ---------- app-nav: Labelled sidebar (apps with 5+ areas) ----------
look('app-nav', 'sidebar', 'Sidebar', 'apps with 5+ areas', 'cside', [
  ['asnow', 'As now', 'Tinted row for the current area.', ''],
  ['bar', 'Accent edge bar', 'No fill; a thick accent bar on the left of the current row.', 'bar'],
  ['solid', 'Solid pill', 'Current row is a solid accent pill with white text.', 'solid'],
  ['roomy', 'Roomy, bold', 'Taller rows, bigger bold labels, wider sidebar.', 'roomy'],
]);

// ---------- app-nav: Icon rail (wide windows, many areas) ----------
look('app-nav', 'rail', 'Icon rail', 'wide windows with many areas', 'crail', [
  ['asnow', 'As now', 'Small tinted square behind the current icon.', ''],
  ['circle', 'Round, solid', 'Round buttons; the current one is solid accent.', 'circle'],
  ['bar', 'Edge bar', 'No fill; a thick accent bar at the left edge.', 'bar'],
  ['big', 'Big dark rail', 'Wider rail with large icons on a sunken strip.', 'big'],
], { tall: true });

// ---------- app-nav: Bottom tab bar (narrow windows, phones) ----------
look('app-nav', 'bottom', 'Bottom tab bar', 'narrow windows and phones', 'cbtm', [
  ['asnow', 'As now', 'Accent icon and label for the current tab.', ''],
  ['pill', 'Pill behind icon', 'A tinted pill sits behind the current icon.', 'pill'],
  ['topbar', 'Top indicator', 'A short accent line above the current tab.', 'topbar'],
  ['floating', 'Floating bar', 'The bar floats as a rounded card with a shadow.', 'floating'],
]);

// ---------- collapsible: Card accordion (top-level page sections) ----------
look('collapsible', 'cards', 'Card sections', 'top-level page sections', 'ccard', [
  ['asnow', 'As now', 'Bordered cards with a bold title.', ''],
  ['tint', 'Tinted header', 'The header strip has its own accent tint.', 'tint'],
  ['edge', 'Accent edge', 'Flat cards with a thick accent edge on the left.', 'edge'],
  ['bare', 'Borderless, divided', 'No box; just hairlines between sections.', 'bare'],
]);

// ---------- collapsible: Chevron + count (lists inside a panel) ----------
look('collapsible', 'chevron', 'Section header', 'lists inside a panel or card', 'cchev', [
  ['asnow', 'As now', 'Chevron, title, grey count.', ''],
  ['caps', 'Small caps, muted', 'Spaced capitals in muted colour; quiet.', 'caps'],
  ['accent', 'Accent chevron', 'Larger chevron in accent; accent count bubble.', 'accent'],
  ['rule', 'Ruled header', 'A line runs under the header; heavier title.', 'rule'],
]);

// ---------- number: stepper (small counts) ----------
look('number', 'stepper', 'Stepper', 'small counts', 'cstep', [
  ['asnow', 'As now', 'Joined box with − and +.', ''],
  ['round', 'Round buttons', 'Separate round − and + buttons around the value.', 'round'],
  ['accent', 'Accent plus', 'The + is a solid accent button; the box is lighter.', 'accent'],
  ['big', 'Large, bold', 'Bigger touch targets and a bold value.', 'big'],
]);

// ---------- number: slider (levels and volume) ----------
look('number', 'slider', 'Slider', 'levels and volume', 'cslid', [
  ['asnow', 'As now', 'Native slider with a grey readout.', ''],
  ['chip', 'Readout chip', 'The value sits in a tinted accent chip.', 'chip'],
  ['bold', 'Big value, stacked', 'Large bold number above a full-width slider.', 'bold'],
  ['mono', 'Mono readout', 'Boxed monospace readout on the left.', 'mono'],
]);

// ---------- number: scrub (inspectors and pro tools) ----------
look('number', 'scrub', 'Scrub label', 'inspectors and pro tools', 'cscrub', [
  ['asnow', 'As now', 'Dashed-underline label, plain field.', ''],
  ['chip', 'Tinted label chip', 'The draggable label is a filled chip with a grip hint.', 'chip'],
  ['inline', 'Inline in the field', 'Label and value share one bordered box.', 'inline'],
  ['mono', 'Mono, compact', 'Small monospace caps label, tight spacing.', 'mono'],
]);

// ---------- number: unit field (exact values) ----------
look('number', 'unit', 'Unit field', 'exact values with a unit', 'cunit', [
  ['asnow', 'As now', 'Field with the unit as quiet trailing text.', ''],
  ['tag', 'Unit tab', 'The unit sits in a shaded block on the right edge.', 'tag'],
  ['mono', 'Mono, tinted', 'Monospace value on a tinted field, accent unit.', 'mono'],
  ['flat', 'Underline only', 'No box; underline with a large value.', 'flat'],
]);
