// Runs in <head> before paint so the saved theme never flashes.
(function () {
  var t;
  try { t = localStorage.getItem('theme'); } catch (e) {}
  if (!t) t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark';
  // Projects side pane: expanded unless the visitor collapsed it.
  var pp;
  try { pp = localStorage.getItem('ppane'); } catch (e) {}
  if (pp === 'collapsed') document.documentElement.dataset.ppane = 'collapsed';
})();
