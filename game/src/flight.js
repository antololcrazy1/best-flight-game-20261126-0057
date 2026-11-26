// Flight model: throttle, pitch, roll, stall, fuel and hull for the courier plane.
export function makePlane() {
  return {
    x: 0, z: 0, alt: 120,
    heading: 0, pitch: 0, roll: 0,
    speed: 42, throttle: 0.62,
    fuel: 100, hull: 100,
    prop: 0, crashed: false, landed: false,
    verticalSpeed: 0, stall: false,
  };
}

export function stepFlight(plane, controls, dt) {
  if (plane.crashed || plane.landed) return;
  const targetRoll = controls.roll * 0.85;
  plane.roll += (targetRoll - plane.roll) * Math.min(1, dt * 5);
  const targetPitch = controls.pitch * 0.42;
  plane.pitch += (targetPitch - plane.pitch) * Math.min(1, dt * 4);
  plane.heading += plane.roll * dt * 0.85 * (plane.speed / 55);
  plane.throttle = Math.max(0, Math.min(1, plane.throttle + controls.throttle * dt * 0.55));
  const thrust = plane.throttle * 46;
  const drag = plane.speed * 0.22 + Math.abs(plane.pitch) * 10;
  const gravityPull = plane.pitch * 26;
  plane.speed += (thrust - drag - gravityPull) * dt;
  if (controls.brake) plane.speed -= 18 * dt;
  plane.speed = Math.max(0, Math.min(120, plane.speed));
  plane.stall = plane.speed < 24 && plane.alt > 4;
  const lift = plane.stall ? -14 : plane.pitch * plane.speed * 0.55;
  const sink = plane.speed < 45 ? 1.7 : 0.5;
  plane.verticalSpeed = lift - sink - (plane.speed < 30 ? (30 - plane.speed) * 0.25 : 0);
  plane.alt += plane.verticalSpeed * dt;
  const rad = plane.heading;
  plane.x += Math.sin(rad) * plane.speed * dt;
  plane.z += Math.cos(rad) * plane.speed * dt;
  plane.prop += dt * (6 + plane.throttle * 40);
  plane.fuel = Math.max(0, plane.fuel - dt * (0.55 + plane.throttle * 1.15));
  if (plane.fuel <= 0) plane.throttle = 0;
  if (plane.alt <= 0) {
    plane.alt = 0;
    const gentle = plane.verticalSpeed > -6 && plane.speed < 58 && Math.abs(plane.roll) < 0.35;
    if (gentle) plane.landed = true;
    else { plane.crashed = true; plane.hull = 0; }
  }
}

export function headingDegrees(plane) {
  let d = Math.round((plane.heading * 180 / Math.PI) % 360);
  if (d < 0) d += 360;
  return d;
}
