// "Look" sections: pick-one, purely visual alternatives for ONE variant of a parent section (shape, size, fill, colour,
// weight, spacing, border, icon treatment, never behaviour). Loaded after variants-more.js; looks-b/c/d.js push into the
// same LOOKS array; looks-apply.js (last) inserts each look right after its parent in CATEGORIES.
//
// look(parentId, variantId, label, situation, scope, styles, opts)
//   styles = [[id, name, desc, modClass], ...]  first = current look ("As now", modClass '')
//   html   = the parent variant's own demo (reused, so data-a actions keep working) wrapped in
//            <div class="lk lk-<scope> m-<id>">; override with opts.html (string) or opts.wrap(html, id).
// CSS: scope every rule under `.lk-<scope>.m-<id>` (looks.css / looks-b.css …), never bare selectors.
const LOOKS = [];
const parentVariant = (cid, vid) => CATEGORIES.find(c => c.id === cid).variants.find(v => v.id === vid);
function look(parent, variant, label, situation, scope, styles, o = {}) {
  const p = CATEGORIES.find(c => c.id === parent), pv = parentVariant(parent, variant);
  LOOKS.push({
    id: `${parent}-${variant}-look`, group: p.group, title: `${label} look`, after: parent,
    desc: `For ${situation}. Same behaviour, only the look differs.`,
    variants: styles.map(([id, name, desc, mod]) => ({
      id, name, desc, tall: pv.tall || o.tall,
      html: `<div class="lk lk-${scope} ${mod ? 'm-' + mod : 'm-asnow'}">${o.wrap ? o.wrap(o.html || pv.html, id) : (o.html || pv.html)}</div>`,
    })),
  });
}

// ---------- checkbox: Switch (on/off settings) ----------
look('checkbox', 'switch', 'Switch', 'on/off settings', 'sw', [
  ['asnow', 'As now', 'The standard small pill switch.', ''],
  ['ios', 'Big green', 'Large, phone-style, green when on.', 'ios'],
  ['slab', 'Square slab', 'Sharp corners, small, outlined: tool-like.', 'slab'],
  ['labelled', 'ON / OFF text', 'The state is written inside the track.', 'labelled'],
]);

// ---------- checkbox: Square tick (selecting items) ----------
look('checkbox', 'square', 'Square tick', 'selecting items', 'sq', [
  ['asnow', 'As now', 'Small square with a tick.', ''],
  ['big', 'Big rounded', 'Larger box, soft corners, bold tick.', 'big'],
  ['soft', 'Tinted, no fill', 'Checked = tinted box with an accent tick, rows tint too.', 'soft'],
  ['heavy', 'Heavy outline', 'Thick accent outline, even when empty.', 'heavy'],
]);

// ---------- colour: One dot -> swatches (everyday colour choice) ----------
look('colour', 'dot', 'Colour dot', 'the everyday colour choice', 'dot', [
  ['asnow', 'As now', 'Round dots.', ''],
  ['big', 'Big ringed dots', 'Large dots; the chosen one wears a ring.', 'big'],
  ['tiles', 'Rounded tiles', 'Squarish tiles with a tick on the chosen one.', 'tiles'],
  ['pills', 'Slim pills', 'Long thin colour bars, packed tight.', 'pills'],
]);

// ---------- colour: Swatches + hex (advanced settings) ----------
look('colour', 'hex', 'Hex field', 'advanced settings (exact colour)', 'hex', [
  ['asnow', 'As now', 'Plain field with a small swatch.', ''],
  ['mono', 'Code style', 'Monospace capitals, square swatch, tinted field.', 'mono'],
  ['big', 'Big swatch', 'A large round swatch leads; roomy field.', 'big'],
  ['flat', 'Flat underline', 'No box: just an underlined value.', 'flat'],
]);

// ---------- busy: Spinner button ----------
look('busy', 'spin', 'Spinner button', 'buttons that run something', 'spin', [
  ['asnow', 'As now', 'Solid accent button.', ''],
  ['soft', 'Soft tint', 'Tinted background, accent text; calmer.', 'soft'],
  ['outline', 'Outline, large', 'Bigger, empty inside, accent border.', 'outline'],
  ['block', 'Full-width block', 'Stretches across the form, bold label.', 'block'],
]);

// ---------- busy: Status chip ----------
look('busy', 'chip', 'Status chip', 'autosave, no Save button', 'bchip', [
  ['asnow', 'As now', 'Quiet dot and text.', ''],
  ['badge', 'Coloured badge', 'Green when saved, solid accent while saving.', 'badge'],
  ['outline', 'Outlined pill', 'Bordered pill with a bigger status dot.', 'outline'],
  ['mono', 'Small caps text', 'No dot; spaced capitals, like a status line.', 'mono'],
]);

// ---------- unsaved: "— Edited" ----------
look('unsaved', 'edited', 'Edited marker', 'document apps you save by hand', 'edit', [
  ['asnow', 'As now', 'Grey “— Edited” after the title.', ''],
  ['pill', 'Tinted pill', 'A small accent pill after the title.', 'pill'],
  ['amber', 'Amber warning', 'Amber, bold text, with a left bar on the header.', 'amber'],
  ['bar', 'Accent edge only', 'No text: the header grows an accent edge and the title goes italic.', 'bar'],
], { wrap: h => h.replace('<div data-unsaved', '<div class="is-dirty" data-unsaved') }); // starts edited so the marker is visible; Save clears it

// ---------- unsaved: autosave chip ----------
look('unsaved', 'chip', 'Autosave chip', 'autosaving apps', 'uchip', [
  ['asnow', 'As now', 'Quiet dot and text.', ''],
  ['badge', 'Coloured badge', 'Green when saved, solid accent while saving.', 'badge'],
  ['dot', 'Dot only', 'Just a big dot; the words are gone.', 'dot'],
  ['mono', 'Small caps text', 'No dot; spaced capitals.', 'mono'],
]);
