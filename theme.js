// Runs in <head> before paint so the saved theme never flashes.
(function () {
  var t;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (!t) t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark';
})();
