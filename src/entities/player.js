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

import { sprites } from '../assets.js';

export function drawPlayer(ctx) {
  const p = gameState.player;
  if (!p) {return;}
  if (p.invincible > 0 && Math.floor(gameState.frame / 4) % 2 === 0) {return;}

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

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  
  const sw = 40, sh = 40;
  ctx.drawImage(sprites.player, x - (sw - p.w)/2, y - (sh - p.h)/2, sw, sh);
  
  ctx.restore();
}
