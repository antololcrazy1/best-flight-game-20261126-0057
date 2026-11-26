// Sky Courier — Ring Run: main loop wiring flight, world, missions and HUD.
import { makePlane, stepFlight } from './flight.js';
import { makeRings, ringPassed, terrainHeight } from './world.js';
import { makeMission, updateMission } from './missions.js';
import { bindInput } from './input.js';
import { makeAudio } from './audio.js';
import { drawScene } from './render.js';
import { drawHud } from './hud.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const audio = makeAudio();

const state = {
  started: false, paused: false, muted: false, cockpit: false,
  plane: makePlane(), rings: makeRings(), mission: makeMission(),
  start() { this.started = true; },
  restart() {
    this.plane = makePlane(); this.rings = makeRings(); this.mission = makeMission();
    this.started = true; this.paused = false;
  },
};
window.__skyCourier = state;

const readControls = bindInput(canvas, state);
let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (state.started && !state.paused) {
    const prevZ = state.plane.z;
    stepFlight(state.plane, readControls(), dt);
    const ground = terrainHeight(state.plane.x, state.plane.z);
    if (state.plane.alt < ground && ground > 0) {
      state.plane.alt = ground;
      state.plane.crashed = true; state.plane.hull = 0;
    }
    const active = state.rings[state.mission.nextRing];
    if (active && ringPassed(state.plane, active, prevZ)) {
      active.done = true;
      audio.chime();
    }
    updateMission(state.mission, state.plane, state.rings, dt);
    audio.engine(state.plane.throttle, state.muted);
  }
  drawScene(ctx, state.plane, state.rings, state.mission, state.cockpit);
  drawHud(ctx, state.plane, state.mission, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
