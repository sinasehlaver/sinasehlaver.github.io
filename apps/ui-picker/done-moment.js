// Demo behaviour for the Moments group. Styling and sounds are keyif's own files, so the demo is the real thing.
// Timings mirror MOMENT_MS in keyif/src/logic/pick.js; here the row returns afterwards so it can be tried again.
const dmReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const dmPlay = (row, sound) => {
  if (row.hasAttribute('data-playing')) return;
  const id = [...row.classList].find(c => c.startsWith('dm-'))?.slice(3);
  if (sound && !dmReduced()) keyifSound(row.closest('[data-dm-loud]') ? (picked('done-moment')[0] || id) : id);
  row.setAttribute('data-playing', 'true');
  setTimeout(() => {
    row.removeAttribute('data-playing');
    row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: dmReduced() ? 0 : 320, delay: 200, fill: 'backwards' });
  }, dmReduced() ? 200 : 900);
};
document.addEventListener('click', e => {
  const check = e.target.closest('.dm-demo .dm-check');
  if (check) return dmPlay(check.closest('.dm'), !!check.closest('[data-dm-loud]'));
  const btn = e.target.closest('[data-dm-sound]');
  if (btn) dmPlay(btn.closest('.dm-demo').querySelector('.dm'), true);
});
// Sections are rendered by JS, so a link like index.html#cat-done-moment needs its jump done here, after the opening glide.
const dmCat = CATEGORIES.find(c => `#cat-${c.id}` === location.hash);
if (dmCat) setTimeout(() => goTo(dmCat.id), 400);
