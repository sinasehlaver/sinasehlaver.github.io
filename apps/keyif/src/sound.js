// Done-moment sounds, synthesised so there are no asset files. No import/export: keyif imports it for the side effect and
// ui-picker loads the same file with a plain <script>, so both play the same thing. Call keyifSound(momentId) from a tap.
(() => {
  let ctx;
  const tone = (freq, at, len, { type = "sine", gain = 0.12, to } = {}) => {
    const t0 = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + len);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    o.connect(g).connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + len + 0.02);
  };
  const swish = () => {
    const len = 0.28;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / d.length);
    const s = ctx.createBufferSource();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    s.buffer = buf;
    f.type = "bandpass";
    f.frequency.setValueAtTime(1400, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + len);
    g.gain.value = 0.1;
    s.connect(f).connect(g).connect(ctx.destination);
    s.start();
  };
  const SOUNDS = {
    settle: () => tone(660, 0, 0.14, { to: 520, gain: 0.1 }),
    wash: () => { tone(392, 0, 0.5, { gain: 0.08 }); tone(587, 0.12, 0.6, { gain: 0.08 }); },
    ripple: () => { tone(784, 0, 0.3, { gain: 0.1 }); tone(1568, 0, 0.12, { gain: 0.03 }); },
    sparks: () => { tone(659, 0, 0.18); tone(880, 0.09, 0.18); tone(1319, 0.18, 0.3, { gain: 0.08 }); },
    strike: swish,
    float: () => { tone(294, 0, 0.9, { gain: 0.1 }); tone(589, 0, 0.5, { gain: 0.03 }); },
  };
  globalThis.keyifSound = (id) => {
    const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctx) return;
    ctx ??= new Ctx();
    ctx.resume?.();
    (SOUNDS[id] ?? SOUNDS.settle)();
  };
})();
