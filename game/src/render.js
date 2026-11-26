// Rendering: chase view over rolling terrain, runway, rings and the courier plane.
import { RUNWAY, terrainHeight } from './world.js';

function project(plane, wx, wz, walt) {
  const dx = wx - plane.x, dz = wz - plane.z;
  const s = Math.sin(-plane.heading), c = Math.cos(-plane.heading);
  const rx = dx * c - dz * s;
  const rz = dx * s + dz * c;
  if (rz < 8) return null;
  const scale = 620 / rz;
  const sx = 640 + rx * scale;
  const horizon = 330 + plane.pitch * 260;
  const sy = horizon - (walt - plane.alt) * scale * 0.9;
  return { x: sx, y: sy, scale, dist: rz };
}

export function drawScene(ctx, plane, rings, mission, cockpit) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#5aa7e8'); sky.addColorStop(0.55, '#a8d4f5'); sky.addColorStop(1, '#f7d9a0');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1280, 720);
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath(); ctx.arc(1080, 95, 42, 0, Math.PI * 2); ctx.fill();
  const horizon = 330 + plane.pitch * 260;
  ctx.fillStyle = '#6fae5a';
  ctx.beginPath(); ctx.moveTo(0, 720); ctx.lineTo(0, horizon);
  for (let sx = 0; sx <= 1280; sx += 40) {
    const wx = plane.x + (sx - 640) * 2.2;
    const h = terrainHeight(wx, plane.z + 500);
    ctx.lineTo(sx, horizon - h * 0.7);
  }
  ctx.lineTo(1280, 720); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(46,90,40,0.35)'; ctx.lineWidth = 2;
  for (let gx = -2; gx <= 2; gx++) {
    for (let gz = 0; gz < 5; gz++) {
      const wx = Math.round(plane.x / 400) * 400 + gx * 400;
      const wz = Math.round(plane.z / 400) * 400 + gz * 400;
      const c1 = project(plane, wx, wz, 0);
      const c2 = project(plane, wx + 380, wz + 380, 0);
      if (!c1 || !c2) continue;
      ctx.fillStyle = (gx + gz) % 2 === 0 ? 'rgba(240,220,120,0.35)' : 'rgba(40,110,50,0.25)';
      ctx.fillRect(Math.min(c1.x, c2.x), Math.min(c1.y, c2.y), Math.abs(c2.x - c1.x), Math.max(2, Math.abs(c2.y - c1.y)));
    }
  }
  for (let i = 0; i < 9; i++) {
    const gz = plane.z + 120 + i * 160 - (plane.z % 160);
    const a = project(plane, plane.x - 900, gz, 0);
    const b = project(plane, plane.x + 900, gz, 0);
    if (a && b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  }
  const rwA = project(plane, RUNWAY.x - 30, RUNWAY.z - 350, 0);
  const rwB = project(plane, RUNWAY.x + 30, RUNWAY.z + 350, 0);
  if (rwA && rwB) {
    ctx.fillStyle = '#3c4148';
    ctx.beginPath();
    ctx.moveTo(rwA.x - 14 * rwA.scale, rwA.y); ctx.lineTo(rwA.x + 14 * rwA.scale, rwA.y);
    ctx.lineTo(rwB.x + 14 * rwB.scale, rwB.y); ctx.lineTo(rwB.x - 14 * rwB.scale, rwB.y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(rwA.x, rwA.y); ctx.lineTo(rwB.x, rwB.y); ctx.stroke();
  }
  const sorted = [...rings].sort((a, b) => Math.abs(b.z - plane.z) - Math.abs(a.z - plane.z));
  for (const ring of sorted) {
    const p = project(plane, ring.x, ring.z, ring.alt);
    if (!p) continue;
    const active = mission.stage === 'rings' && rings[mission.nextRing] === ring;
    ctx.strokeStyle = ring.done ? '#9be15d' : active ? '#ffd23f' : 'rgba(255,255,255,0.75)';
    ctx.lineWidth = Math.max(3, 7 * p.scale);
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(8, ring.radius * p.scale), 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#123';
    ctx.font = 'bold ' + Math.max(12, 22 * p.scale) + 'px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(String(ring.id), p.x, p.y - Math.max(10, ring.radius * p.scale) - 6);
  }
  if (!cockpit) drawPlane(ctx, plane);
  else drawCockpitFrame(ctx, plane);
}

function drawPlane(ctx, plane) {
  ctx.save();
  ctx.translate(640, 520);
  ctx.rotate(plane.roll * 0.55);
  ctx.fillStyle = '#e4572e';
  ctx.beginPath(); ctx.moveTo(0, -62); ctx.lineTo(16, 28); ctx.lineTo(-16, 28); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(-118, 2, 236, 16);
  ctx.fillStyle = '#c73e1d';
  ctx.fillRect(-118, 2, 236, 5);
  ctx.fillStyle = '#2a9d8f';
  ctx.beginPath(); ctx.ellipse(0, -18, 13, 22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#264653';
  ctx.fillRect(-40, 34, 80, 10);
  ctx.strokeStyle = 'rgba(30,30,30,0.55)'; ctx.lineWidth = 5;
  const px = Math.sin(plane.prop) * 34;
  ctx.beginPath(); ctx.moveTo(-px, -64); ctx.lineTo(px, -64); ctx.stroke();
  ctx.restore();
}

function drawCockpitFrame(ctx, plane) {
  ctx.fillStyle = '#1d2733';
  ctx.fillRect(0, 560, 1280, 160);
  ctx.fillStyle = '#0f1720';
  ctx.fillRect(0, 0, 70, 720); ctx.fillRect(1210, 0, 70, 720);
  ctx.fillStyle = '#ffd23f';
  ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('COCKPIT — press C for chase view', 640, 600);
}
