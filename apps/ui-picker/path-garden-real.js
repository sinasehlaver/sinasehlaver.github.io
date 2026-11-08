// keyif path & garden, round 2: three "realistic" skins over the same scene DOM/behaviour as path-garden.js (kept: flat + solid stay in pg-scene).
// Loaded after path-garden.js. Layers: far/mid hills + trees (SVG), grain, light, tilt-shift blur, front grass blades. Styling: path-garden-real.css.
const PGR_RND = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function pgrScenery(skin) {
  const r = PGR_RND(PG_SEED + skin.length * 31);
  const ridge = (base, amp, n, seedShift) => { let d = `M0 120 L0 ${base}`; for (let i = 1; i <= n; i++) d += ` Q${(i - .5) * 400 / n} ${base - amp * (.3 + r() * .9)} ${i * 400 / n} ${base - amp * (r() - .5) * .5}`; return d + ' L400 120Z'; };
  const trees = Array.from({ length: 26 }, (_, i) => { const x = 8 + i * 15 + r() * 8, h = 12 + r() * 16, w = 7 + r() * 6, y = 86 - r() * 6;
    return `<g class="t" style="--d:${(r() * 6).toFixed(1)}s"><rect x="${x - .8}" y="${y - 3}" width="1.6" height="6" fill="var(--trunk)"/><ellipse cx="${x}" cy="${y - h * .55}" rx="${w / 2}" ry="${h / 2}" fill="var(--tree)"/><ellipse cx="${x - w * .15}" cy="${y - h * .7}" rx="${w / 3.2}" ry="${h / 3.2}" fill="var(--tree-l)" opacity=".7"/></g>`; }).join('');
  const blades = Array.from({ length: 150 }, () => { const x = r() * 400, h = 10 + r() * 22, l = (r() - .5) * 8;
    return `<path d="M${x.toFixed(1)} 40Q${(x + l / 2).toFixed(1)} ${40 - h * .6} ${(x + l).toFixed(1)} ${(40 - h).toFixed(1)}" style="--d:${(r() * 4).toFixed(1)}s" stroke="hsl(${95 + r() * 40} ${35 + r() * 25}% ${22 + r() * 22}%)"/>`; }).join('');
  return `<svg class="pgr-far" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true"><path d="${ridge(70, 40, 5)}" fill="var(--far)"/><path d="${ridge(84, 26, 7)}" fill="var(--mid)"/></svg>
    <svg class="pgr-trees" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">${trees}</svg>`
    + `<template data-front><svg class="pgr-front" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">${blades}</svg></template>`;
}
function pgrHtml(skin, mode, opts) {
  let h = pgHtml(mode, opts);
  const sc = pgrScenery(skin), front = sc.match(/<template data-front>([\s\S]*?)<\/template>/)[1];
  h = h.replace(`class="pg pg-${mode}"`, `class="pg pg-${mode} pgr pgr-${skin}"`);
  h = h.replace('<div class="pg-cam">', `<div class="pgr-scenery">${sc.replace(/<template[\s\S]*<\/template>/, '')}</div><div class="pgr-rays"></div><div class="pg-cam">`);
  // after the camera: front grass, warm light, grain, tilt-shift bands, vignette
  h = h.replace(/(<div class="pg-ui">)/, `<div class="pgr-fx">${front}<i class="pgr-light"></i><i class="pgr-grain"></i><i class="pgr-tilt t"></i><i class="pgr-tilt b"></i><i class="pgr-vig"></i></div>$1`);
  // the fx layer must sit inside .pg-view: move the closing tag
  return h.replace(/<\/div>\s*<div class="pgr-fx">([\s\S]*?)<\/div>(\s*<div class="pg-ui">)/, '<div class="pgr-fx">$1</div></div>$2');
}
CATEGORIES.find(c => c.id === 'pg-scene').variants.push(
  { id: 'golden', name: 'Golden hour meadow (painted)', src: 'Alto, Journey, Ghibli backgrounds', tall: true, desc: 'A painted valley: hazy blue ridges, a tree line, warm low sun, grain, and long grass swaying in front. Stones have a rock texture and soft cast shadows. Still SVG/CSS, so it runs on any phone.', html: pgrHtml('golden', 'flat', { ui: 't p w' }) },
  { id: 'diorama', name: 'Tilt-shift diorama', src: 'Townscaper, Monument Valley, miniature photography', tall: true, desc: 'The tilted ground seen like a miniature: blurred near and far edges (depth of field), textured rock stones with thick sides and contact shadows, soft vignette. The most "real object" feel; the real build would use three.js for true shadows.', html: pgrHtml('diorama', 'solid', { ui: 't p w' }) },
  { id: 'mist', name: 'Misty dawn', src: 'Firewatch, Alto\'s Odyssey, Ori', tall: true, desc: 'Cool blue morning: layered fog between ridges, light rays through the trees, dew-green grass and a pale pink sky. Quietest of the three; flowers glow against the haze.', html: pgrHtml('mist', 'flat', { ui: 't p w' }) },
);
