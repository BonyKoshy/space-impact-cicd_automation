import { H } from '../config.js';
import { gameState } from '../state.js';

export function makePlayer() {
  return {
    x: 60, y: H / 2 - 8,
    w: 28, h: 14,
    speed: 3.2,
    shootCooldown: 0,
    shootRate: 16,
    invincible: 0,
    shield: 0,
    rapidFire: 0,
    triShot: 0,
  };
}

export function drawPlayer(ctx) {
  const p = gameState.player;
  if (!p) return;
  if (p.invincible > 0 && Math.floor(gameState.frame / 4) % 2 === 0) return;

  const x = Math.round(p.x), y = Math.round(p.y);

  // Shield ring
  if (p.shield > 0) {
    ctx.strokeStyle = '#88ffcc';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(gameState.frame * 0.15);
    ctx.beginPath();
    ctx.ellipse(x + p.w / 2, y + p.h / 2, p.w * 0.9, p.h * 1.1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Body
  ctx.fillStyle = '#44ddff';
  ctx.fillRect(x + 6, y + 4, 16, 6);
  ctx.fillRect(x + 14, y + 2, 10, 10);

  // Cockpit
  ctx.fillStyle = '#003344';
  ctx.fillRect(x + 18, y + 4, 5, 6);

  // Top wing
  ctx.fillStyle = '#2299bb';
  ctx.fillRect(x, y, 14, 4);
  ctx.fillRect(x + 2, y - 2, 6, 2);

  // Bottom wing
  ctx.fillRect(x, y + 10, 14, 4);
  ctx.fillRect(x + 2, y + 14, 6, 2);

  // Engine glow
  const glowAmt = 0.6 + 0.4 * Math.sin(gameState.frame * 0.3);
  ctx.fillStyle = `rgba(0,255,200,${glowAmt})`;
  ctx.fillRect(x + 4, y + 5, 4, 4);
  ctx.fillStyle = `rgba(255,255,100,${glowAmt * 0.7})`;
  ctx.fillRect(x + 2, y + 6, 3, 2);
}
