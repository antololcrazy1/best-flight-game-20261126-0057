// HUD: lit instruments for altitude, speed, heading, throttle, fuel and mission.
import { headingDegrees } from './flight.js';

function gauge(ctx, x, y, label, value, frac, color) {
  ctx.fillStyle = 'rgba(10,20,32,0.82)';
  ctx.fillRect(x, y, 170, 62);
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.strokeRect(x, y, 170, 62);
  ctx.fillStyle = '#cfe8ff'; ctx.font = '13px system-ui'; ctx.textAlign = 'left';
  ctx.fillText(label, x + 10, y + 20);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 24px system-ui';
  ctx.fillText(value, x + 10, y + 48);
  ctx.fillStyle = color; ctx.fillRect(x + 10, y + 53, 150 * Math.max(0, Math.min(1, frac)), 5);
}

export function drawHud(ctx, plane, mission, state) {
  gauge(ctx, 24, 24, 'ALTITUDE', Math.round(plane.alt) + ' m', plane.alt / 300, '#4cc9f0');
  gauge(ctx, 24, 98, 'SPEED', Math.round(plane.speed * 3.6) + ' km/h', plane.speed / 120, '#ffd23f');
  gauge(ctx, 1086, 24, 'HEADING', headingDegrees(plane) + '°', headingDegrees(plane) / 360, '#9be15d');
  gauge(ctx, 1086, 98, 'THROTTLE', Math.round(plane.throttle * 100) + '%', plane.throttle, '#ff8c42');
  gauge(ctx, 24, 628, 'FUEL', Math.round(plane.fuel) + '%', plane.fuel / 100, plane.fuel < 25 ? '#ef476f' : '#06d6a0');
  gauge(ctx, 1086, 628, 'HULL', Math.round(plane.hull) + '%', plane.hull / 100, '#ef476f');
  ctx.fillStyle = 'rgba(10,20,32,0.85)';
  ctx.fillRect(390, 24, 500, 74);
  ctx.strokeStyle = '#ffd23f'; ctx.strokeRect(390, 24, 500, 74);
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center';
  ctx.fillText(mission.message, 640, 54);
  ctx.font = '16px system-ui'; ctx.fillStyle = '#cfe8ff';
  ctx.fillText('Score ' + mission.score + '   Time ' + Math.max(0, Math.ceil(mission.time)) + 's   Rings ' + mission.nextRing + '/6', 640, 82);
  if (plane.stall) {
    ctx.fillStyle = '#ef476f'; ctx.font = 'bold 30px system-ui';
    ctx.fillText('STALL — add throttle', 640, 140);
  }
  if (mission.flash > 0) {
    ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 34px system-ui';
    ctx.fillText('+250 RING CLEARED', 640, 180);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = '14px system-ui';
  ctx.fillText('Arrows/WASD fly · Shift/Q throttle · Space brake · C camera · P pause · M mute', 640, 705);
  if (!state.started) {
    ctx.fillStyle = 'rgba(5,12,22,0.72)'; ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = '#ffd23f'; ctx.font = 'bold 58px system-ui';
    ctx.fillText('SKY COURIER', 640, 250);
    ctx.fillStyle = '#ffffff'; ctx.font = '24px system-ui';
    ctx.fillText('Ring Run — deliver through 6 rings, then land home', 640, 300);
    ctx.font = '19px system-ui'; ctx.fillStyle = '#cfe8ff';
    ctx.fillText('Fly with arrows, WASD or mouse. Watch fuel, speed and stall.', 640, 350);
    ctx.fillText('Press Enter or click to take off', 640, 395);
  }
  if (state.paused) {
    ctx.fillStyle = 'rgba(5,12,22,0.6)'; ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 42px system-ui';
    ctx.fillText('PAUSED', 640, 360);
  }
}
