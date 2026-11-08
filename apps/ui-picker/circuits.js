// "Circuit drawings" category: one geometry drawn three ways, so the only difference between cards is the look.
// Top = battery, switch, lamp. Bottom = two switches, AND gate, lamp. Loaded after variants-more.js (sync.mjs reads that file without a DOM, so the variants live here); behaviour is self-contained.
const CD_SYM = {
  a: {
    battery: () => `<g class="on"><line class="sym" x1="24" y1="60" x2="56" y2="60"/><line class="sym" x1="32" y1="72" x2="48" y2="72"/></g><text x="66" y="56">+</text><text x="60" y="76">−</text>`,
    lamp: (x, y) => `<circle class="glow" cx="${x}" cy="${y}" r="26"/><circle class="sym" cx="${x}" cy="${y}" r="17"/><path class="sym" d="M${x - 12} ${y - 12}l24 24m0-24l-24 24"/>`,
    lever: (x, y) => `<line class="sym" x1="${x}" y1="${y}" x2="${x + 40}" y2="${y}"/>`,
    posts: (x, y) => `<circle class="sym" cx="${x}" cy="${y}" r="2.5"/><circle class="sym" cx="${x + 40}" cy="${y}" r="2.5"/>`,
    gate: () => `<path class="sym" d="M130 150H155A35 35 0 0 1 155 220H130Z"/><text x="157" y="185">AND</text>`,
  },
  b: {
    battery: () => `<rect class="cap" x="33" y="42" width="14" height="7" rx="2"/><rect class="body" x="24" y="48" width="32" height="46" rx="4"/><rect class="band" x="24" y="48" width="32" height="13" rx="4"/><text class="onb" x="40" y="78" style="font-size:14px">1.5V</text>`,
    lamp: (x, y) => `<circle class="glow" cx="${x}" cy="${y}" r="26"/><circle class="bulb" cx="${x}" cy="${y}" r="17"/><path class="fil" d="M${x - 8} ${y + 8}l3-13 3 7 2-7 2 7 3-7 3 13"/>`,
    lever: (x, y) => `<line x1="${x}" y1="${y}" x2="${x + 38}" y2="${y}"/><circle cx="${x + 38}" cy="${y}" r="5.5"/>`,
    posts: (x, y) => `<circle class="post" cx="${x}" cy="${y}" r="6"/><circle class="post" cx="${x + 40}" cy="${y}" r="6"/>`,
    gate: () => `${[160, 182, 204].flatMap(y => [`<rect class="pin" x="122" y="${y}" width="9" height="6"/>`, `<rect class="pin" x="189" y="${y}" width="9" height="6"/>`]).join('')}<rect class="body" x="130" y="150" width="60" height="70" rx="5"/><circle class="cap" cx="142" cy="161" r="3"/><text class="onb" x="160" y="186">AND</text>`,
  },
  c: {
    battery: () => `<g class="on"><line class="sym" x1="22" y1="60" x2="58" y2="60"/><line class="sym" x1="32" y1="72" x2="48" y2="72"/></g><text x="68" y="56">+</text><text x="62" y="76">−</text>`,
    lamp: (x, y) => `<circle class="glow" cx="${x}" cy="${y}" r="24"/><circle class="orb" cx="${x}" cy="${y}" r="15"/>`,
    lever: (x, y) => `<line class="sym" x1="${x}" y1="${y}" x2="${x + 40}" y2="${y}"/>`,
    posts: () => '',
    gate: () => `<rect class="block" x="130" y="150" width="60" height="70" rx="12"/><text x="160" y="185">AND</text>`,
  },
};
const cdSvg = k => {
  const s = CD_SYM[k];
  const wire = (d, attrs = '') => `<g class="wire"${attrs}><path class="w" d="${d}"/><path class="f" d="${d}"/></g>`;
  // a switch is a 44px-ish hit area around its lever; data-sw names the signal it drives
  const sw = (id, x, y, closed, label) => `<g class="sw${closed ? ' closed' : ''}" data-sw="${id}" role="switch" tabindex="0" aria-checked="${closed}" aria-label="${label}">
    <rect class="hit" x="${x - 8}" y="${y - 24}" width="56" height="36" rx="6"/>${s.posts(x, y)}<g class="lever" style="transform-origin:${x}px ${y}px">${s.lever(x, y)}</g></g>`;
  return `<svg class="cd cd-${k}" data-cd viewBox="0 0 320 232" role="img" aria-label="A battery, switch and lamp, then two switches through an AND gate to a lamp">
    ${k === 'c' ? '<rect class="panel" width="320" height="232" rx="10"/>' : ''}
    <g data-out="loop" class="on">
      ${wire('M40 60V24H128')}${wire('M168 24H280V50')}${wire('M280 84V110H40V72')}
      <g class="lampg">${s.lamp(280, 67)}</g>
    </g>
    ${s.battery()}${sw('loop', 128, 24, true, 'Battery switch')}
    <text x="16" y="165">A</text><text x="16" y="205">B</text>
    <g data-out="a" class="on">${wire('M26 165H52')}${wire('M92 165H130')}</g>
    <g data-out="b">${wire('M26 205H52')}${wire('M92 205H130')}</g>
    <g data-out="y">${wire('M190 185H263')}<g class="lampg">${s.lamp(280, 185)}</g></g>
    ${s.gate()}${sw('a', 52, 165, true, 'Input A')}${sw('b', 52, 205, false, 'Input B')}
  </svg>`;
};
CATEGORIES.find(c => c.id === 'circuit-drawing').variants.push(
  { id: 'schematic', name: 'Textbook schematic', src: 'Ben Eater', tall: true, desc: 'Standard symbols and thin lines on the page. Follows your theme; current is a line of moving dots.', html: cdSvg('a') },
  { id: 'workbench', name: 'Workbench', src: 'Exploratorium kits', tall: true, desc: 'Thick wires, a real battery, a bulb with a filament, gates as chips. Looks like objects you could hold.', html: cdSvg('b') },
  { id: 'glow', name: 'Glow on dark', src: 'Turing Complete', tall: true, desc: 'A dark panel even in the light theme. Electricity is light travelling along thin tubes.', html: cdSvg('c') },
);
document.addEventListener('click', e => cdToggle(e.target.closest?.('[data-cd] .sw')));
document.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { const sw = e.target.closest?.('[data-cd] .sw'); if (sw) { e.preventDefault(); cdToggle(sw); } } });
function cdToggle(sw) {
  if (!sw) return;
  const on = !sw.classList.contains('closed');
  sw.classList.toggle('closed', on); sw.setAttribute('aria-checked', on);
  const svg = sw.closest('[data-cd]'), out = n => svg.querySelector(`[data-out="${n}"]`);
  out(sw.dataset.sw).classList.toggle('on', on);
  out('y').classList.toggle('on', out('a').classList.contains('on') && out('b').classList.contains('on'));
}
