// Input: keyboard flight controls plus mouse steering and touch pads.
export function makeControls() {
  return { pitch: 0, roll: 0, throttle: 0, brake: false };
}

export function bindInput(canvas, state) {
  const keys = new Set();
  let mouseX = 640, mouseY = 360, mouseActive = false;
  window.addEventListener('keydown', (e) => {
    keys.add(e.code);
    if (e.code === 'Enter') state.start();
    if (e.code === 'KeyR') state.restart();
    if (e.code === 'KeyP') state.paused = !state.paused;
    if (e.code === 'KeyM') state.muted = !state.muted;
    if (e.code === 'KeyC') state.cockpit = !state.cockpit;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouseX = (e.clientX - r.left) * 1280 / r.width;
    mouseY = (e.clientY - r.top) * 720 / r.height;
    mouseActive = true;
  });
  canvas.addEventListener('pointerdown', () => state.start());
  return function readControls() {
    const c = makeControls();
    if (keys.has('ArrowUp') || keys.has('KeyW')) c.pitch += 1;
    if (keys.has('ArrowDown') || keys.has('KeyS')) c.pitch -= 1;
    if (keys.has('ArrowLeft') || keys.has('KeyA')) c.roll -= 1;
    if (keys.has('ArrowRight') || keys.has('KeyD')) c.roll += 1;
    if (keys.has('ShiftLeft') || keys.has('ShiftRight') || keys.has('KeyE')) c.throttle += 1;
    if (keys.has('ControlLeft') || keys.has('KeyQ')) c.throttle -= 1;
    if (keys.has('Space')) c.brake = true;
    if (mouseActive && c.pitch === 0 && c.roll === 0) {
      c.roll = Math.max(-1, Math.min(1, (mouseX - 640) / 320));
      c.pitch = Math.max(-1, Math.min(1, (360 - mouseY) / 240));
    }
    return c;
  };
}
