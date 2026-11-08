// LOOKS.push(...) via look(parent, variant, label, situation, scope, styles). See looks.js for the convention.

// ---------- delete: Confirm dialog (irreversible deletes) ----------
look('delete', 'dialog', 'Confirm dialog', 'irreversible deletes (files on disk, processes)', 'ddlg', [
  ['asnow', 'As now', 'Rounded card, buttons bottom right.', ''],
  ['danger', 'Red edge', 'Sharp card with a red top edge and a red title.', 'danger'],
  ['stack', 'Centred, stacked', 'Centred text; full-width buttons one above the other.', 'stack'],
  ['sheet', 'Flat sheet', 'Square corners, hairline border, no shadow, divider above the buttons.', 'sheet'],
]);

// ---------- delete: Instant + Undo toast (rows and anything undoable) ----------
look('delete', 'undo', 'Undo toast', 'rows and anything undoable', 'dundo', [
  ['asnow', 'As now', 'Dark inverted toast.', ''],
  ['card', 'Light card', 'Surface card with an accent edge.', 'card'],
  ['pill', 'Accent pill', 'Round, solid accent, white text.', 'pill'],
  ['mono', 'Small outlined', 'Small, transparent-looking, hairline border, spaced capitals.', 'mono'],
]);

// ---------- loading: Skeleton rows (lists and cards) ----------
look('loading', 'skeleton', 'Skeleton', 'lists and cards', 'dsk', [
  ['asnow', 'As now', 'Soft grey rounded lines.', ''],
  ['blocks', 'Chunky blocks', 'Taller, squarer grey blocks.', 'blocks'],
  ['tint', 'Accent tint', 'Lines in a faint accent colour.', 'tint'],
  ['faint', 'Hairline', 'Very thin, very faint lines; barely there.', 'faint'],
]);

// ---------- loading: Thin bar (refreshing data already on screen) ----------
look('loading', 'bar', 'Loading bar', 'refreshing data already on screen', 'dlbar', [
  ['asnow', 'As now', 'Thin 2px accent line.', ''],
  ['thick', 'Thick, rounded', 'A chunky 5px rounded bar.', 'thick'],
  ['glow', 'Glowing line', 'Thin line with an accent glow.', 'glow'],
  ['band', 'Tinted band', 'The bar sits on a full-width faint accent strip.', 'band'],
]);

// ---------- loading: Rows arrive one by one (results that arrive over time) ----------
look('loading', 'stagger', 'Arriving rows', 'results that arrive over time', 'dstg', [
  ['asnow', 'As now', 'Plain list rows.', ''],
  ['cards', 'Separate cards', 'Each row is its own bordered card with gaps.', 'cards'],
  ['edge', 'Accent edge', 'A bold accent bar on the left of every row.', 'edge'],
  ['dense', 'Dense', 'Tight rows, smaller text, hairline dividers.', 'dense'],
]);

// ---------- progress: Bar (jobs with a known length) ----------
look('progress', 'bar', 'Progress bar', 'jobs with a known length', 'dpbar', [
  ['asnow', 'As now', 'Slim rounded bar.', ''],
  ['thick', 'Thick', 'A tall bar, nearly a button in size.', 'thick'],
  ['hair', 'Hairline', 'Only 2px high, flat ends.', 'hair'],
  ['blocks', 'Segmented', 'Cut into small blocks.', 'blocks'],
]);

// ---------- progress: Ring (small spaces, per item) ----------
look('progress', 'ring', 'Progress ring', 'small spaces, per item', 'dring', [
  ['asnow', 'As now', 'Medium ring, round ends.', ''],
  ['big', 'Big and heavy', 'A large ring with a thick stroke.', 'big'],
  ['thin', 'Thin and small', 'A small, delicate ring.', 'thin'],
  ['flat', 'Flat ends, no track', 'Square-cut stroke, the track disappears.', 'flat'],
]);

// ---------- progress: Named stages (jobs with named stages) ----------
look('progress', 'steps', 'Stage list', 'jobs with named stages', 'dpst', [
  ['asnow', 'As now', 'Round dots and grey text.', ''],
  ['square', 'Square markers', 'Small rounded-square markers.', 'square'],
  ['cards', 'Stage cards', 'Every stage is its own bordered row.', 'cards'],
  ['large', 'Large and bold', 'Bigger markers and heavier text.', 'large'],
]);

// ---------- progress: Sliding bar (unknown length) ----------
look('progress', 'indeterminate', 'Sliding bar', 'unknown length', 'dind', [
  ['asnow', 'As now', 'Slim rounded bar.', ''],
  ['thick', 'Thick', 'A tall bar with a tinted track.', 'thick'],
  ['hair', 'Hairline', '2px, flat.', 'hair'],
  ['blocks', 'Segmented', 'Cut into small blocks.', 'blocks'],
]);

// ---------- empty: Icon + sentence + action (an empty list) ----------
look('empty', 'icon', 'Empty list', 'an empty list', 'dei', [
  ['asnow', 'As now', 'Round tinted icon, centred text.', ''],
  ['tile', 'Square tile', 'Rounded-square, solid accent icon.', 'tile'],
  ['dashed', 'Dashed card', 'The whole message sits in a dashed card.', 'dashed'],
  ['big', 'Big and bold', 'Large icon, large heading.', 'big'],
]);

// ---------- empty: Big drop zone (importing / opening a file) ----------
look('empty', 'drop', 'Drop zone', 'importing / opening a file', 'ddz', [
  ['asnow', 'As now', 'Thin dashed border.', ''],
  ['solid', 'Filled, no border', 'A tinted block without any outline.', 'solid'],
  ['heavy', 'Heavy accent dashes', 'Thick accent dashes and a taller zone.', 'heavy'],
  ['compact', 'Slim strip', 'Small, left-aligned, one line.', 'compact'],
]);

// ---------- empty: Start page with recents (document apps on launch) ----------
look('empty', 'start', 'Start page', 'document apps on launch', 'dsp', [
  ['asnow', 'As now', 'Buttons, then a plain list.', ''],
  ['cards', 'Recent cards', 'Each recent file is a bordered card.', 'cards'],
  ['big', 'Big buttons', 'Larger buttons and a bigger heading.', 'big'],
  ['quiet', 'Quiet text', 'No fills: text buttons and a bare list.', 'quiet'],
]);

// ---------- banner: Full-width bar (app-wide news) ----------
look('banner', 'bar', 'Banner bar', 'app-wide news (offline, update ready)', 'dbb', [
  ['asnow', 'As now', 'Faint accent strip.', ''],
  ['solid', 'Solid accent', 'Full accent colour with white text.', 'solid'],
  ['dark', 'Dark strip', 'Inverted: dark in light mode, light in dark mode.', 'dark'],
  ['edge', 'Tall with edge', 'Taller, neutral, with a thick accent left edge.', 'edge'],
]);

// ---------- banner: Callout card (tips inside one section) ----------
look('banner', 'callout', 'Callout', 'tips inside one section', 'dco', [
  ['asnow', 'As now', 'Card with an accent left edge.', ''],
  ['tint', 'Tinted fill', 'Accent tint, no border.', 'tint'],
  ['dashed', 'Dashed outline', 'Transparent with a dashed border.', 'dashed'],
  ['top', 'Top rule', 'Bold accent line across the top.', 'top'],
]);

// ---------- banner: On the item itself (a problem with one item) ----------
look('banner', 'row', 'Item message', 'a problem with one item', 'dbr', [
  ['asnow', 'As now', 'Red text under the row.', ''],
  ['band', 'Red band', 'A red-tinted strip with a bold left edge.', 'band'],
  ['bold', 'Bold', 'Larger, bold red text.', 'bold'],
  ['boxed', 'Boxed', 'Inset rounded box with a red border.', 'boxed'],
]);
