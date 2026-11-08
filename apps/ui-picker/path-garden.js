// keyif "path & garden" looks. Loaded after variants-more.js (which declares the four empty categories; sync.mjs reads that file in a
// DOM-less VM, so the demos live here, same pattern as circuits.js). Styling: path-garden.css. Concept: knowledge/atelier/keyif-path-garden.md.
// One scene DOM, two renderings: flat 2.5D vs CSS-3D (tilted ground plane, flowers/companion stand up as billboards).
// Three.js is NOT used here (ui-picker has no deps and file:// blocks module imports); the 3D pick is a look, and the real engine is decided after the pick.
const PG_PTS = [[20, 88], [34, 76], [52, 68], [68, 56], [60, 42], [42, 32], [54, 18]];
const PG_SEED = 7421; // stands in for the per-user seed that drives species, colours and stone shapes
const PG_HUES = [340, 12, 280, 205, 322, 28, 255];
const PG_SIZE = { light: 30, medium: 38, heavy: 48 };
// weight x profile: sq = squash on landing, dust = particles, shake = camera px, stop = hit-stop ms, snd = thud gain, buzz = haptic ms
const PG_PROF = {
  soft: { light: { sq: .06 }, medium: { sq: .1 }, heavy: { sq: .14 } },
  thud: { light: { sq: .1, dust: 3, snd: .3 }, medium: { sq: .16, dust: 6, shake: 1.5, snd: .6 }, heavy: { sq: .22, dust: 10, shake: 3, snd: 1 } },
  quake: { light: { sq: .12, dust: 4, shake: 1, snd: .4 }, medium: { sq: .2, dust: 9, shake: 4, stop: 40, snd: .8 }, heavy: { sq: .3, dust: 16, shake: 9, stop: 90, flash: 1, snd: 1.3, buzz: 30 } },
};
const pgReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pgPos = (mode, i) => { const [x, y] = PG_PTS[i]; return mode === 'solid' ? [14 + x * .72, y] : [x, y]; };
const pgScale = (mode, y) => mode === 'solid' ? 1 : +(.62 + .5 * y / 100).toFixed(3);
const pgSide = i => (i % 2 ? 1 : -1) * 13;
const pgCo = {
  firefly: `<svg viewBox="0 0 40 40"><circle class="glow" cx="20" cy="20" r="15" fill="#fff3a0" opacity=".35"/><circle class="glow" cx="20" cy="20" r="8" fill="#fff3a0" opacity=".55"/><ellipse class="wing" cx="14" cy="17" rx="6" ry="3" fill="#fff" opacity=".75"/><ellipse class="wing" cx="26" cy="17" rx="6" ry="3" fill="#fff" opacity=".75"/><ellipse cx="20" cy="21" rx="3.4" ry="5" fill="#ffd23f"/></svg>`,
  snail: `<svg viewBox="0 0 40 40"><path d="M4 36Q5 29 14 30L32 32Q38 34 33 37L6 37Z" fill="#e4c9a3"/><circle cx="21" cy="23" r="9" fill="#c98b5b"/><path d="M21 23a3 3 0 1 1 3 3a6 6 0 1 1-6-6" fill="none" stroke="#8a5a37" stroke-width="1.6"/><g class="ant"><path d="M8 31L5 22M11 31L10 22" stroke="#9c7b52" stroke-width="1.4" stroke-linecap="round"/></g></svg>`,
  bird: `<svg viewBox="0 0 40 40"><path d="M11 23L2 17L4 27Z" fill="#c9653f"/><ellipse cx="20" cy="24" rx="10" ry="8" fill="#e8805a"/><circle cx="29" cy="15" r="6" fill="#e8805a"/><path d="M34 14L40 16L34 18Z" fill="#f2b84b"/><circle class="eye" cx="31" cy="14" r="1.4" fill="#222"/><ellipse cx="18" cy="25" rx="5.5" ry="3.2" fill="#c9653f"/><path d="M18 31V37M23 31V37" stroke="#8a5a37" stroke-width="1.5"/></svg>`,
};
function pgHtml(mode, { p = 'thud', b = 'unfurl', c = 'firefly', ui = 'w t p s' } = {}) {
  const pos = PG_PTS.map((_, i) => pgPos(mode, i));
  const d = pos.map(([x, y], i) => i === 0 ? `M${x} ${y}` : `Q${pos[i - 1][0]} ${pos[i - 1][1]} ${(x + pos[i - 1][0]) / 2} ${(y + pos[i - 1][1]) / 2}`).join(' ') + ` L${pos.at(-1).join(' ')}`;
  const slots = pos.map(([x, y], i) => `<div class="pg-slot" data-i="${i}" style="--x:${x}%;--y:${y}%;z-index:${Math.round(y)};--s:${pgScale(mode, y)}"><i class="pg-ghost${i < 3 ? ' on' : ''}" style="--sz:${PG_SIZE.medium * pgScale(mode, y)}"></i></div>`).join('');
  const [sx, sy] = pos[0], sc = pgScale(mode, sy);
  const co = c === 'none' ? '' : `<div class="pg-co co-${c}" style="left:${sx + 6}%;top:${sy + 3}%;z-index:99"><div class="pg-bill" style="--s:${sc}">${pgCo[c]}</div></div>`;
  const has = k => ui.split(' ').includes(k);
  return `<div class="pg pg-${mode}" data-pg="${mode}" data-pp="${p}" data-pb="${b}" data-pc="${c}" data-pw="medium">
    <div class="pg-view"><div class="pg-sky"><i class="pg-sun"></i><i class="pg-cloud c1"></i><i class="pg-cloud c2"></i></div>
    <div class="pg-cam"><div class="pg-plane"><div class="pg-grass"></div>
      <svg class="pg-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}"/></svg>${slots}${co}</div></div></div>
    <div class="pg-ui">
      ${has('w') ? `<span class="pg-seg" role="group" aria-label="Next stone weight">${['light', 'medium', 'heavy'].map(w => `<button data-pg-act="wt" data-w="${w}" aria-pressed="${w === 'medium'}">${w}</button>`).join('')}</span>` : ''}
      ${has('t') ? `<button class="btn sm" data-pg-act="task">Finish a task</button>` : ''}
      ${has('p') ? `<button class="btn sm" data-pg-act="plant">Do a pleasure</button>` : ''}
      ${has('s') ? `<button class="btn quiet sm pg-sound" data-pg-act="snd" aria-pressed="false">♪ sound off</button>` : ''}
    </div></div>`;
}

CATEGORIES.find(c => c.id === 'pg-scene').variants.push(
  { id: 'flat', name: 'Flat 2.5D', src: 'Alto, Monument Valley', tall: true, desc: 'A drawn picture: stones are shaded ovals, flowers stand tall in front of a painted hill. Light on battery, plain to build (SVG/CSS, any phone).', html: pgHtml('flat', { ui: 't p w' }) },
  { id: 'solid', name: '3D, tilted world', src: 'Townscaper, Alba', tall: true, desc: 'The ground really tilts away: stones are thick and cast depth, flowers stand up out of the grass, the camera shakes in perspective. Heavier to build (three.js later).', html: pgHtml('solid', { ui: 't p w' }) },
);
CATEGORIES.find(c => c.id === 'pg-weight').variants.push(
  { id: 'soft', name: 'Soft settle', desc: 'Every stone lands with a small squash. No dust, no sound. Weight only changes the stone size. Calmest.', tall: true, html: pgHtml('flat', { p: 'soft', ui: 'w t s', c: 'none' }) },
  { id: 'thud', name: 'Thud and dust', desc: 'Dust puffs and a low thump; heavy stones also nudge the whole scene. Weight changes size, dust and thump.', tall: true, html: pgHtml('flat', { p: 'thud', ui: 'w t s', c: 'none' }) },
  { id: 'quake', name: 'Hit-stop and shake', desc: 'A heavy stone freezes the frame for a beat, then shakes the scene, throws a ring of dust and flashes. Medium has a lighter version. Phone also buzzes. "That was hard, and you did it."', tall: true, html: pgHtml('flat', { p: 'quake', ui: 'w t s', c: 'none' }) },
);
CATEGORIES.find(c => c.id === 'pg-bloom').variants.push(
  { id: 'unfurl', name: 'Unfurl', desc: 'The stem grows, the head rises, the petals open one after another. Unhurried.', tall: true, html: pgHtml('flat', { b: 'unfurl', ui: 'p', c: 'none' }) },
  { id: 'burst', name: 'Pop and spark', desc: 'A bud pops, the petals spring open with an overshoot and sparks fly out. Quick and cheerful.', tall: true, html: pgHtml('flat', { b: 'burst', ui: 'p', c: 'none' }) },
  { id: 'glow', name: 'Light gathers', desc: 'A light gathers on the ground, the flower rises slowly out of it and a few motes drift up. Every 4th flower is a rare gold one with sparks.', tall: true, html: pgHtml('flat', { b: 'glow', ui: 'p', c: 'none' }) },
);
CATEGORIES.find(c => c.id === 'pg-companion').variants.push(
  { id: 'none', name: 'No companion', desc: 'Just the path and the garden.', tall: true, html: pgHtml('flat', { c: 'none', ui: 't p' }) },
  { id: 'firefly', name: 'Firefly', desc: 'A small glow drifts after what you do and pulses when something lands or blooms.', tall: true, html: pgHtml('flat', { c: 'firefly', ui: 't p' }) },
  { id: 'snail', name: 'Snail', desc: 'Slow, in no hurry. Crawls to each new thing and tucks in for a moment. Nothing about it says "faster".', tall: true, html: pgHtml('flat', { c: 'snail', ui: 't p' }) },
  { id: 'bird', name: 'Little bird', desc: 'Hops to each stone and flower, tilts its head, blinks. The most like a pet.', tall: true, html: pgHtml('flat', { c: 'bird', ui: 't p' }) },
);

// ---- behaviour ----
let pgAudio;
function pgSound(kind, g = 1) {
  try {
    pgAudio ||= new AudioContext();
    const t = pgAudio.currentTime, out = pgAudio.destination;
    const tone = (f0, f1, dur, vol, at = 0) => { const o = pgAudio.createOscillator(), a = pgAudio.createGain(); o.frequency.setValueAtTime(f0, t + at); o.frequency.exponentialRampToValueAtTime(f1, t + at + dur);
      a.gain.setValueAtTime(vol, t + at); a.gain.exponentialRampToValueAtTime(.0008, t + at + dur); o.connect(a).connect(out); o.start(t + at); o.stop(t + at + dur + .02); };
    if (kind === 'thud') { tone(130, 42, .28, .45 * g); tone(60, 34, .35, .3 * g); } else { tone(660, 700, .5, .05); tone(990, 1000, .6, .04, .09); }
  } catch { /* no audio */ }
}
const pgMove = (scene, x, y, slow) => {
  const co = scene.querySelector('.pg-co'); if (!co) return;
  const mode = scene.dataset.pg, kind = scene.dataset.pc, mv = (kind === 'snail' ? 2400 : kind === 'bird' ? 650 : 1000);
  co.style.setProperty('--mv', pgReduced() ? '0ms' : mv + 'ms'); co.style.left = x + '%'; co.style.top = y + '%'; co.style.zIndex = 99;
  co.querySelector('.pg-bill').style.setProperty('--s', pgScale(mode, y));
  const react = () => { co.classList.remove('co-react'); void co.offsetWidth; co.classList.add('co-react'); setTimeout(() => co.classList.remove('co-react'), 1000); };
  setTimeout(react, pgReduced() ? 0 : mv * .8);
};
function pgShake(scene, amp, ms = 420) {
  if (!amp || pgReduced()) return;
  const cam = scene.querySelector('.pg-cam'), n = 9;
  cam.animate(Array.from({ length: n + 1 }, (_, i) => { const k = (1 - i / n) * amp; return { translate: i === n ? '0 0' : `${(Math.random() * 2 - 1) * k}px ${(Math.random() * 2 - 1) * k}px` }; }), { duration: ms, easing: 'linear' });
}
function pgDust(slot, n, big) {
  if (pgReduced()) return;
  for (let k = 0; k < n; k++) {
    const d = document.createElement('i'); d.className = 'pg-dust'; slot.append(d);
    const a = (k / n) * Math.PI * 2 + Math.random() * .5, r = (14 + Math.random() * 16) * (big ? 1.5 : 1);
    d.animate([{ translate: '0 0', scale: .5, opacity: .8 }, { translate: `${Math.cos(a) * r}px ${Math.sin(a) * r * .55 - 8}px`, scale: 1.5 + Math.random(), opacity: 0 }], { duration: 600 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => d.remove();
  }
}
function pgTask(scene) {
  const mode = scene.dataset.pg, slots = [...scene.querySelectorAll('.pg-slot')];
  let n = slots.filter(s => s.querySelector('.pg-st')).length;
  if (n >= slots.length) { slots.forEach(s => s.querySelector('.pg-st')?.remove()); n = 0; scene.querySelectorAll('.pg-fl').forEach(f => f.remove()); const [x, y] = pgPos(mode, 0); pgMove(scene, x + 6, y + 3); }
  const w = scene.dataset.pw, prof = PG_PROF[scene.dataset.pp][w], slot = slots[n], s = pgScale(mode, +slot.style.getPropertyValue('--y').slice(0, -1));
  const st = document.createElement('div'); st.className = 'pg-st'; st.dataset.w = w;
  const sz = PG_SIZE[w], r = k => 42 + ((PG_SEED * (n + 3) * (k + 1)) % 17);
  st.style.cssText = `--sz:${sz};--s:${s};--br:${r(0)}% ${r(1)}% ${r(2)}% ${r(3)}% / ${r(4)}% ${r(5)}% ${r(6)}% ${r(7)}%`;
  const layers = w === 'heavy' ? 5 : w === 'medium' ? 4 : 3;
  st.innerHTML = Array.from({ length: layers }, (_, k) => `<i style="--z:${k * 4}"></i>`).join('');
  slot.append(st);
  slot.querySelector('.pg-ghost').classList.remove('on');
  slots.forEach((sl, i) => sl.querySelector('.pg-ghost').classList.toggle('on', i > n && i <= n + 3 - 0 && i < n + 3));
  const base = '-50% -50%', h = 150, fall = { light: 440, medium: 380, heavy: 310 }[w];
  const land = () => {
    pgShake(scene, prof.shake, 150 + 60 * (prof.shake || 0));
    pgDust(slot, prof.dust || 0, w === 'heavy' && scene.dataset.pp === 'quake');
    if (prof.flash && !pgReduced()) { const f = document.createElement('i'); f.className = 'pg-flash'; slot.append(f); f.animate([{ scale: .5, opacity: .9 }, { scale: 6, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => f.remove(); }
    if (!pgReduced()) st.animate([{ scale: `${s * (1 + prof.sq)} ${s * (1 - prof.sq)}` }, { scale: `${s * (1 - prof.sq * .3)} ${s * (1 + prof.sq * .3)}`, offset: .6 }, { scale: `${s} ${s}` }], { duration: 320, easing: 'ease-out' });
    if (scene.dataset.snd === '1' && prof.snd) pgSound('thud', prof.snd);
    if (prof.buzz && navigator.vibrate) navigator.vibrate(prof.buzz);
    const [x, y] = pgPos(mode, n); pgMove(scene, x + 6, y + 3);
  };
  if (pgReduced()) { st.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 }); return land(); }
  st.animate([{ translate: mode === 'solid' ? `${base} 160px` : `-50% calc(-50% - ${h}px)`, opacity: 0 }, { opacity: 1, offset: .15 }, { translate: mode === 'solid' ? `${base} 0px` : `-50% -50%`, opacity: 1 }],
    { duration: fall, easing: 'cubic-bezier(.55,0,.9,.55)' }).onfinish = () => (prof.stop ? setTimeout(land, prof.stop) : land());
}
function pgPlant(scene) {
  const mode = scene.dataset.pg, plane = scene.querySelector('.pg-plane');
  let fls = [...scene.querySelectorAll('.pg-fl')];
  if (fls.length >= PG_PTS.length) { fls.forEach(f => f.remove()); fls = []; }
  const n = fls.length, [px, py] = pgPos(mode, n), x = px + pgSide(n) * (mode === 'solid' ? .72 : 1), y = Math.min(96, py + 3), s = pgScale(mode, y);
  const rare = n % 4 === 3, hue = PG_HUES[(n + PG_SEED) % PG_HUES.length], petals = rare ? 8 : 6;
  const fl = document.createElement('div'); fl.className = `pg-fl b-${scene.dataset.pb}${rare ? ' rare' : ''}`; fl.style.cssText = `left:${x}%;top:${y}%;z-index:${Math.round(y)};--hue:${hue}`;
  fl.innerHTML = `<div class="pg-bill" style="--s:${s * (rare ? 1.3 : 1)}"><i class="pg-halo"></i><i class="pg-stem"></i><i class="pg-leaf"></i><div class="pg-head">${Array.from({ length: petals }, (_, i) => `<i class="pg-pet" style="--i:${i};--r:${(360 / petals) * i}deg"></i>`).join('')}<i class="pg-core"></i></div>
    ${Array.from({ length: 8 }, (_, i) => `<i class="pg-sp" style="--a:${i * 45}deg"></i>`).join('')}${[0, 1, 2].map(i => `<i class="pg-mote" style="--i:${i}"></i>`).join('')}${rare ? '<span class="pg-note">a rare bloom ✦</span>' : ''}</div>`;
  plane.append(fl);
  if (scene.dataset.snd === '1') setTimeout(() => pgSound('chime'), pgReduced() ? 0 : 450);
  pgMove(scene, x + 5, y + 2);
}
document.addEventListener('click', e => {
  const b = e.target.closest?.('[data-pg-act]'); if (!b) return;
  const scene = b.closest('.pg'), act = b.dataset.pgAct;
  if (act === 'wt') { scene.dataset.pw = b.dataset.w; scene.querySelectorAll('[data-pg-act="wt"]').forEach(x => x.setAttribute('aria-pressed', x === b)); }
  else if (act === 'task') pgTask(scene);
  else if (act === 'plant') pgPlant(scene);
  else if (act === 'snd') { const on = scene.dataset.snd !== '1'; scene.dataset.snd = on ? '1' : '0'; b.setAttribute('aria-pressed', on); b.textContent = on ? '♪ sound on' : '♪ sound off'; if (on) pgSound('thud', .5); }
});
