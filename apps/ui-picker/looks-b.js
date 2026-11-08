// LOOKS.push(...) via look(parent, variant, label, situation, scope, styles). See looks.js for the convention.

look('settings', 'pane', 'Settings pane', 'many settings', 'spn', [
  ['asnow', 'As now', 'Plain list on the left, active item tinted.', ''],
  ['rail', 'Accent bar', 'Active item gets a bar on its edge, no fill.', 'rail'],
  ['pill', 'Filled pills', 'Active item is a solid accent pill, sidebar tinted.', 'pill'],
  ['roomy', 'Roomy, big text', 'Larger rows and type, divider lines between.', 'roomy'],
]);
look('settings', 'popover', 'Gear popover', 'only a few settings', 'spo', [
  ['asnow', 'As now', 'Small menu with switches.', ''],
  ['wide', 'Roomy card', 'Wider, larger rows, big corners and shadow.', 'wide'],
  ['dense', 'Dense and flat', 'Tight rows, square corners, outline only.', 'dense'],
  ['tint', 'Tinted rows', 'Each row is its own tinted tile.', 'tint'],
]);
look('steps', 'numbered', 'Numbered steps', 'setup with a few fixed steps', 'stn', [
  ['asnow', 'As now', 'Small round numbers joined by a line.', ''],
  ['solid', 'Solid badges', 'Big filled accent numbers, bold labels.', 'solid'],
  ['square', 'Square tabs', 'Steps as flat boxes, active one inverted.', 'square'],
  ['bar', 'Underline segments', 'Numbers hidden, thick segment bars under labels.', 'bar'],
]);
look('steps', 'dots', 'Progress dots', 'quick questions, one at a time', 'std', [
  ['asnow', 'As now', 'Small dots, the active one stretches.', ''],
  ['big', 'Big dots', 'Larger round dots, active one filled and ringed.', 'big'],
  ['bars', 'Segment bars', 'Wide flat bars across the top.', 'bars'],
  ['outline', 'Outlined squares', 'Hollow squares, active one solid.', 'outline'],
]);
look('steps', 'vertical', 'Folding steps', 'long tasks and tutorials', 'stv', [
  ['asnow', 'As now', 'Boxed list with round numbers.', ''],
  ['open', 'No box, rail', 'No frame; a vertical rail ties the numbers.', 'open'],
  ['cards', 'Separate cards', 'Each step a floating card, active one raised.', 'cards'],
  ['solid', 'Solid numbers', 'Big filled numbers, bold titles.', 'solid'],
]);
look('onboarding', 'checklist', 'Getting-started checklist', 'apps with setup to do', 'obc', [
  ['asnow', 'As now', 'Plain panel, round ticks, thin bar.', ''],
  ['accent', 'Accent card', 'Tinted card, thick bar, accent ticks.', 'accent'],
  ['flat', 'Flat rows', 'No box; square ticks, row dividers, hairline bar.', 'flat'],
  ['big', 'Big and friendly', 'Large type, big ticks, chunky bar.', 'big'],
]);
look('onboarding', 'coach', 'Tour bubble', 'apps with a few non-obvious controls', 'obk', [
  ['asnow', 'As now', 'Accent bubble with a pointer.', ''],
  ['light', 'Light card', 'Surface-coloured card with an accent border.', 'light'],
  ['dark', 'Inverted', 'Text-coloured bubble, high contrast.', 'dark'],
  ['wide', 'Wide and soft', 'Larger, round, tinted bubble.', 'wide'],
]);
look('onboarding', 'hints', 'Empty-screen hint', 'simple apps', 'obh', [
  ['asnow', 'As now', 'Round tinted icon, centred text.', ''],
  ['dashed', 'Dashed drop zone', 'Dashed outline box around the hint.', 'dashed'],
  ['big', 'Big icon', 'Large square icon, larger heading.', 'big'],
  ['quiet', 'Muted, no icon', 'Icon hidden, small and grey.', 'quiet'],
]);
look('filters', 'pm', 'Search and filter bar', 'lists up to ~50 items', 'fpm', [
  ['asnow', 'As now', 'Field plus two buttons.', ''],
  ['pill', 'Pill search', 'Round search, round buttons.', 'pill'],
  ['filled', 'Filled, borderless', 'Grey-filled controls, no outlines.', 'filled'],
  ['accent', 'Accent badge', 'Filter button tinted with a big badge.', 'accent'],
]);
look('filters', 'facets', 'Facet sidebar', 'lists over ~50 items', 'ffc', [
  ['asnow', 'As now', 'Plain checkbox groups.', ''],
  ['panel', 'Boxed sidebar', 'Sidebar in a card, bold small-caps heading.', 'panel'],
  ['pills', 'Pill options', 'Options as full-width rounded pills.', 'pills'],
  ['spaced', 'Spacious', 'Wider column, big gaps and larger text.', 'spaced'],
]);
look('date', 'calendar', 'Calendar', 'picking a day', 'dcal', [
  ['asnow', 'As now', 'Rounded-square days, accent for the chosen one.', ''],
  ['round', 'Round days', 'Circular days, chosen one solid.', 'round'],
  ['grid', 'Ruled grid', 'Boxed cells with hairlines.', 'grid'],
  ['soft', 'Tinted days', 'Every day a soft tile; chosen one outlined.', 'soft'],
]);
look('date', 'months', 'Month grid', 'picking a month', 'dmon', [
  ['asnow', 'As now', 'Quiet buttons in a grid.', ''],
  ['tiles', 'Outlined tiles', 'Each month a bordered tile.', 'tiles'],
  ['filled', 'Solid pick', 'Chosen month solid accent, others soft grey.', 'filled'],
  ['big', 'Big and bold', 'Taller, larger, bold text.', 'big'],
]);
look('multiselect', 'checks', 'Checkbox column', 'lists and tables', 'mck', [
  ['asnow', 'As now', 'Square ticks, tinted selected row.', ''],
  ['round', 'Round ticks', 'Circular ticks, selected row has an accent edge.', 'round'],
  ['big', 'Big ticks', 'Larger boxes and taller rows.', 'big'],
  ['strong', 'Solid selection', 'Selected row filled with accent colour.', 'strong'],
]);
look('multiselect', 'bandfill', 'Rubber band', 'canvases', 'mbf', [
  ['asnow', 'As now', 'Rectangle items, accent tint when picked.', ''],
  ['round', 'Round items', 'Circles; picked ones solid.', 'round'],
  ['ring', 'Glow ring', 'Picked items get a thick glowing outline.', 'ring'],
  ['dark', 'Dark items', 'Heavy filled tiles on a dotted canvas.', 'dark'],
]);
