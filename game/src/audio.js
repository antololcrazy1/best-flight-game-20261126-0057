// Sound: a small WebAudio engine hum and mission chimes, all synthesized.
export function makeAudio() {
  let ctx = null, osc = null, gain = null;
  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 70;
    gain.gain.value = 0;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
  }
  function engine(throttle, muted) {
    ensure();
    if (!ctx) return;
    osc.frequency.value = 55 + throttle * 95;
    gain.gain.value = muted ? 0 : 0.025 + throttle * 0.03;
  }
  function chime() {
    ensure();
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.4);
  }
  return { engine, chime };
}
