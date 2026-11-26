// World layout: terrain height, the home runway, and the courier ring course.
export const RUNWAY = { x: 0, z: -900, heading: 0, length: 700, width: 60 };

export function terrainHeight(x, z) {
  const hills = Math.sin(x * 0.004) * 22 + Math.cos(z * 0.003) * 18 + Math.sin((x + z) * 0.0015) * 12;
  const nearStrip = Math.abs(x - RUNWAY.x) < 160 && Math.abs(z - RUNWAY.z) < 600;
  return nearStrip ? 0 : Math.max(0, hills);
}

export function makeRings() {
  const course = [
    { x: 0, z: 500, alt: 120 },
    { x: 260, z: 1100, alt: 150 },
    { x: -240, z: 1700, alt: 95 },
    { x: -60, z: 2300, alt: 170 },
    { x: 340, z: 2900, alt: 110 },
    { x: 40, z: 3500, alt: 140 },
  ];
  return course.map((r, i) => ({ ...r, id: i + 1, radius: 55, done: false }));
}

export function ringPassed(plane, ring, prevZ) {
  const crossed = (prevZ - ring.z) * (plane.z - ring.z) <= 0 && prevZ !== plane.z;
  if (!crossed) return false;
  const dx = plane.x - ring.x;
  const dy = plane.alt - ring.alt;
  return Math.sqrt(dx * dx + dy * dy) < ring.radius;
}

export function overRunway(plane) {
  const dx = Math.abs(plane.x - RUNWAY.x);
  const dz = Math.abs(plane.z - RUNWAY.z);
  return dx < RUNWAY.width && dz < RUNWAY.length / 2;
}
