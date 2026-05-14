import { gameState } from '../state.js';
import { playShootSound } from '../audio.js';

export function shoot() {
  const p = gameState.player;
  if (!p || p.shootCooldown > 0) {
    return;
  }
  
  playShootSound();
  
  const rate = p.rapidFire > 0 ? 7 : p.shootRate;
  p.shootCooldown = rate;

  const cy = p.y + p.h / 2 - 1;
  if (p.triShot > 0) {
    gameState.bullets.push({ x: p.x + p.w, y: cy - 4, vy: -0.8, w: 7, h: 2 });
    gameState.bullets.push({ x: p.x + p.w, y: cy, vy: 0, w: 7, h: 2 });
    gameState.bullets.push({ x: p.x + p.w, y: cy + 4, vy: 0.8, w: 7, h: 2 });
  } else {
    gameState.bullets.push({ x: p.x + p.w, y: cy, vy: 0, w: 7, h: 2 });
  }
}

export function drawBullets(ctx) {
  gameState.bullets.forEach(b => {
    ctx.fillStyle = '#00ffcc';
    ctx.shadowBlur = 4; ctx.shadowColor = '#00ffcc';
    ctx.fillRect(Math.round(b.x), Math.round(b.y), b.w, b.h);
  });
  gameState.enemyBullets.forEach(b => {
    ctx.fillStyle = '#ff8800';
    ctx.shadowBlur = 4; ctx.shadowColor = '#ff8800';
    ctx.fillRect(Math.round(b.x), Math.round(b.y), b.w, b.h);
  });
  ctx.shadowBlur = 0;
}
