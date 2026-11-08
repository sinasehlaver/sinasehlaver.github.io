"use strict";
// Plain canvas viewer. Data: window.MAP (public/map.js, written by scripts/build.mjs).
const A = MAP.artists, byId = new Map(A.map((a) => [a.id, a])), byCell = new Map(A.map((a) => [a.q + "," + a.r, a]));
const $ = (id) => document.getElementById(id), cv = $("c"), ctx = cv.getContext("2d");
const S3 = Math.sqrt(3), SIZE = 1; // world units: hex centre-to-corner = 1
const world = (q, r) => ({ x: S3 * (q + r / 2), y: 1.5 * r });
for (const a of A) Object.assign(a, world(a.q, a.r));

// colour by top tag: stable hue from the tag name
const hue = (t) => { let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const dark = () => document.documentElement.dataset.theme === "dark";
const fill = (a) => `hsl(${hue(a.tag)} ${dark() ? 45 : 55}% ${dark() ? 38 : 62}%)`;

let W, H, dpr, v = { x: 0, y: 0, k: 24 }; // view: world centre + px per world unit
let sel = null, hover = null, anim = null;
function resize() { dpr = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; draw(); }
const toScreen = (x, y) => [(x - v.x) * v.k + W / 2, (y - v.y) * v.k + H / 2];
const toWorld = (sx, sy) => [(sx - W / 2) / v.k + v.x, (sy - H / 2) / v.k + v.y];
function fit() { const xs = A.map((a) => a.x), ys = A.map((a) => a.y); v.x = (Math.min(...xs) + Math.max(...xs)) / 2; v.y = (Math.min(...ys) + Math.max(...ys)) / 2; v.k = Math.max(4, Math.min(W / (Math.max(...xs) - Math.min(...xs) + 4), H / (Math.max(...ys) - Math.min(...ys) + 4))); }

const corners = [...Array(6)].map((_, i) => [Math.cos(Math.PI / 6 + (i * Math.PI) / 3), Math.sin(Math.PI / 6 + (i * Math.PI) / 3)]);
function hexPath(cx, cy, s) { ctx.beginPath(); corners.forEach(([dx, dy], i) => ctx[i ? "lineTo" : "moveTo"](cx + dx * s, cy + dy * s)); ctx.closePath(); }
function draw() {
  const css = getComputedStyle(document.documentElement);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const s = v.k * SIZE * 0.94, near = new Set(sel ? sel.sim.map(([id]) => id) : []);
  for (const a of A) {
    const [x, y] = toScreen(a.x, a.y); if (x < -s || y < -s || x > W + s || y > H + s) continue;
    hexPath(x, y, s); ctx.fillStyle = fill(a); ctx.globalAlpha = sel && a !== sel && !near.has(a.id) ? 0.35 : 1; ctx.fill(); ctx.globalAlpha = 1;
    if (near.has(a.id) || a === sel || a === hover) { ctx.lineWidth = a === sel ? 3 : 2; ctx.strokeStyle = a === sel ? css.getPropertyValue("--text") : css.getPropertyValue("--accent"); ctx.stroke(); }
  }
  if (v.k >= 26) { // labels from mid zoom
    ctx.font = `${Math.min(14, v.k * 0.42)}px ${css.getPropertyValue("--font-text")}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
    for (const a of A) { const [x, y] = toScreen(a.x, a.y); if (x < -s || y < -s || x > W + s || y > H + s) continue; wrap(a.name, x, y, s * 1.6); }
  }
}
function wrap(text, x, y, maxW) { // two-line max, ellipsis; full name is in the hover tooltip
  const words = text.split(" "); let lines = [""];
  for (const w of words) { const t = (lines.at(-1) + " " + w).trim(); if (ctx.measureText(t).width > maxW && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; }
  lines = lines.slice(0, 2).map((l) => { while (ctx.measureText(l).width > maxW && l.length > 1) l = l.slice(0, -2) + "…"; return l; });
  const lh = parseFloat(ctx.font) * 1.15; lines.forEach((l, i) => ctx.fillText(l, x, y + (i - (lines.length - 1) / 2) * lh));
}

// ---- interaction
function pick(sx, sy) { const [wx, wy] = toWorld(sx, sy); let b = null, bd = 0.9 ** 2; for (const a of A) { const d = (a.x - wx) ** 2 + (a.y - wy) ** 2; if (d < bd) { bd = d; b = a; } } return b; }
function glide(to) { // ease the view to `to` over ~320ms
  const from = { ...v }, t0 = performance.now(), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, id = (anim = {});
  (function step(t) { if (anim !== id) return; const p = reduce ? 1 : Math.min(1, (t - t0) / 320), e = 1 - (1 - p) ** 3;
    for (const k of ["x", "y", "k"]) v[k] = from[k] + (to[k] - from[k]) * e; draw(); if (p < 1) requestAnimationFrame(step); })(t0);
}
function select(a, recentre = true) {
  sel = a; if (!a) { $("panel").hidden = true; return draw(); }
  if (recentre) glide({ x: a.x, y: a.y, k: Math.max(v.k, 34) }); else draw();
  $("pn").textContent = a.name; $("pt").replaceChildren(...a.tags.map((t) => Object.assign(document.createElement("span"), { textContent: t, style: `background:hsl(${hue(t)} 45% 38%)` })));
  $("pl").replaceChildren(...a.sim.map(([id, w]) => { const n = byId.get(id), li = document.createElement("li"), l = document.createElement("a");
    l.textContent = n.name; l.tabIndex = 0; l.onclick = () => select(n); l.onkeydown = (e) => e.key === "Enter" && select(n);
    const sm = document.createElement("small"); sm.textContent = Math.round(w * 100) + "%"; l.append(sm); li.append(l); return li; }));
  $("panel").hidden = false; location.hash = a.id;
}
let drag = null;
cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); anim = null; drag = { x: e.clientX, y: e.clientY, vx: v.x, vy: v.y, moved: false }; cv.classList.add("drag"); cv.focus(); });
cv.addEventListener("pointermove", (e) => {
  if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 3) drag.moved = true; v.x = drag.vx - dx / v.k; v.y = drag.vy - dy / v.k; draw(); return; }
  const r = cv.getBoundingClientRect(), a = pick(e.clientX - r.left, e.clientY - r.top);
  if (a !== hover) { hover = a; draw(); preview(a); }
  const t = $("tip"); t.hidden = !a; if (a) { t.textContent = a.name; t.style.left = e.clientX - r.left + 14 + "px"; t.style.top = e.clientY - r.top + 14 + "px"; }
});
cv.addEventListener("pointerup", (e) => { cv.classList.remove("drag"); if (drag && !drag.moved) { const r = cv.getBoundingClientRect(); select(pick(e.clientX - r.left, e.clientY - r.top)); } drag = null; });
cv.addEventListener("pointerleave", () => { hover = null; $("tip").hidden = true; preview(null); draw(); });
cv.addEventListener("wheel", (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(), sx = e.clientX - r.left, sy = e.clientY - r.top, [wx, wy] = toWorld(sx, sy);
  v.k = Math.max(3, Math.min(120, v.k * Math.exp(-e.deltaY * 0.0015))); v.x = wx - (sx - W / 2) / v.k; v.y = wy - (sy - H / 2) / v.k; draw(); }, { passive: false });
// arrows: among the 6 neighbour cells that hold an artist, take the one best aligned with the arrow
const DIR = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
cv.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return select(null);
  const d = DIR[e.key]; if (!d) return; e.preventDefault();
  if (!sel) return select(A[Math.floor(A.length / 2)]);
  let best = null, bs = 0.3;
  for (const [dq, dr] of [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]) { const n = byCell.get(sel.q + dq + "," + (sel.r + dr)); if (!n) continue;
    const sc = ((n.x - sel.x) * d[0] + (n.y - sel.y) * d[1]) / Math.hypot(n.x - sel.x, n.y - sel.y); if (sc > bs) { bs = sc; best = n; } }
  if (best) select(best);
});
$("close").onclick = () => select(null);

// ---- search
const hits = $("hits"); let hi = 0;
function search() { const q = $("q").value.trim().toLowerCase(), m = q ? A.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 8) : [];
  hits.replaceChildren(...m.map((a, i) => Object.assign(document.createElement("li"), { textContent: a.name, className: i === hi ? "on" : "", onmousedown: () => go(a) }))); hits.hidden = !m.length; hits._m = m; }
function go(a) { hits.hidden = true; $("q").value = ""; select(a); cv.focus(); }
$("q").addEventListener("input", () => { hi = 0; search(); });
$("q").addEventListener("blur", () => (hits.hidden = true));
$("q").addEventListener("keydown", (e) => { const m = hits._m ?? [];
  if (e.key === "Enter" && m[hi]) go(m[hi]); else if (e.key === "ArrowDown") { hi = Math.min(hi + 1, m.length - 1); search(); e.preventDefault(); } else if (e.key === "ArrowUp") { hi = Math.max(0, hi - 1); search(); e.preventDefault(); } else if (e.key === "Escape") { hits.hidden = true; cv.focus(); } });
addEventListener("keydown", (e) => { if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement !== $("q")) { e.preventDefault(); $("q").focus(); } });

// ---- theme (system -> light -> dark)
const pref = () => localStorage.getItem("musicmap:theme") || "system";
function applyTheme() { const p = pref(); document.documentElement.dataset.theme = p === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : p; $("themeBtn").textContent = "Theme: " + p; draw(); }
$("themeBtn").onclick = () => { localStorage.setItem("musicmap:theme", { system: "light", light: "dark", dark: "system" }[pref()]); applyTheme(); };
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

// ---- Deezer hover preview (muted by default; JSONP because api.deezer.com sends no CORS headers; fails silently)
let muted = true, timer, audio = new Audio(), cache = new Map(), seq = 0;
$("mute").onclick = () => { muted = !muted; $("mute").setAttribute("aria-pressed", muted); $("mute").textContent = "Preview: " + (muted ? "off" : "on"); if (muted) audio.pause(); };
function jsonp(url) { return new Promise((res, rej) => { const cb = "dz" + ++seq, s = document.createElement("script"), done = (x) => { delete window[cb]; s.remove(); x ? res(x) : rej(); };
  window[cb] = done; s.onerror = () => done(null); s.src = url + (url.includes("?") ? "&" : "?") + "output=jsonp&callback=" + cb; document.head.append(s); setTimeout(() => window[cb] && done(null), 5000); }); }
async function previewUrl(a) { if (cache.has(a.id)) return cache.get(a.id);
  const p = (async () => { const s = await jsonp("https://api.deezer.com/search/artist?limit=1&q=" + encodeURIComponent(a.name)); const id = s.data?.[0]?.id; if (!id) return null;
    return (await jsonp(`https://api.deezer.com/artist/${id}/top?limit=1`)).data?.[0]?.preview ?? null; })().catch(() => null);
  cache.set(a.id, p); return p; }
function preview(a) { clearTimeout(timer); audio.pause(); if (muted || !a) return;
  timer = setTimeout(async () => { const u = await previewUrl(a); if (u && hover === a && !muted) { audio.src = u; audio.play().catch(() => {}); } }, 300); }

addEventListener("resize", resize);
resize(); fit(); draw();
const h = decodeURIComponent(location.hash.slice(1)); if (byId.has(h)) select(byId.get(h));
window.__musicmap = { select, byId, get view() { return v; } }; // test hook for the smoke check
