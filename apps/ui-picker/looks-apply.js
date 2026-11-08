// Runs after looks.js + looks-b/c/d.js: turns LOOKS into categories, each right after its parent (after the LAYOUT sort).
for (const l of LOOKS) {
  l.mode = 'one';
  let j = CATEGORIES.findIndex(c => c.id === l.after) + 1;
  if (j < 1) throw new Error('look parent missing: ' + l.after);
  while (CATEGORIES[j] && CATEGORIES[j].after === l.after) j++;
  CATEGORIES.splice(j, 0, l);
}
