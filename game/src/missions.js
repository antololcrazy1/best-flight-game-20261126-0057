// Mission flow: ring deliveries in order, then a landing back at the home strip.
export function makeMission() {
  return { stage: 'rings', nextRing: 0, score: 0, time: 180, message: 'Fly through ring 1', flash: 0 };
}

export function updateMission(mission, plane, rings, dt) {
  if (mission.stage === 'done' || mission.stage === 'crashed') return;
  if (plane.crashed) { mission.stage = 'crashed'; mission.message = 'Crashed — press R to retry'; return; }
  if (plane.landed) {
    if (mission.stage === 'land') {
      mission.stage = 'done';
      mission.score += Math.round(plane.fuel * 4 + plane.hull * 3);
      mission.message = 'Delivery complete — press R to fly again';
    } else {
      mission.stage = 'crashed';
      mission.message = 'Landed early — finish the rings first. Press R';
    }
    return;
  }
  mission.time -= dt;
  mission.flash = Math.max(0, mission.flash - dt);
  if (mission.time <= 0) { mission.stage = 'crashed'; mission.message = 'Out of time — press R to retry'; return; }
  if (mission.stage === 'rings') {
    const ring = rings[mission.nextRing];
    if (ring && ring.done) {
      mission.score += 250;
      mission.flash = 1.2;
      mission.nextRing += 1;
      if (mission.nextRing >= rings.length) {
        mission.stage = 'land';
        mission.message = 'All rings done — land gently on the home runway';
      } else {
        mission.message = 'Ring cleared — fly through ring ' + (mission.nextRing + 1);
      }
    }
  }
}
