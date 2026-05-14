import { W, H, ENEMY_TYPES } from '../config.js';
import { gameState } from '../state.js';

export function spawnEnemy() {
  const lvl = Math.min(gameState.level, 4);
  const pool = ENEMY_TYPES.slice(0, lvl);
  const weights = [4, 3, 2, 1].slice(0, lvl);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  let type = pool[0];
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) { type = pool[i]; break; }
  }
  const t = { ...type };
  const pattern = Math.random();
  let vy = 0, phase = Math.random() * Math.PI * 2;
  if (pattern < 0.3) vy = (Math.random() - 0.5) * 1.5; // diagonal
  const y = Math.random() * (H - t.h - 10) + 5;
  gameState.enemies.push({
    ...t,
    x: W + 10, y,
    startY: y,
    vx: -(t.speed + (gameState.level - 1) * 0.15),
    vy, phase,
    wave: pattern > 0.5,
    hp: t.hp + Math.floor((gameState.level - 1) * 0.5),
    maxHp: t.hp + Math.floor((gameState.level - 1) * 0.5),
    hitFlash: 0,
  });
}

export function drawEnemy(ctx, e) {
  const x = Math.round(e.x), y = Math.round(e.y);
  const flash = e.hitFlash > 0;
  const col = flash ? '#ffffff' : e.color;

  ctx.fillStyle = col;
  if (e.id === 'scout') {
    ctx.fillRect(x, y + 3, 14, 4);
    ctx.fillRect(x + 6, y, 8, 10);
    ctx.fillRect(x + 12, y + 2, 6, 6);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 0, y + 3, 4, 4);
  } else if (e.id === 'fighter') {
    ctx.fillRect(x, y + 4, 18, 4);
    ctx.fillRect(x + 6, y + 1, 12, 10);
    ctx.fillRect(x + 14, y + 3, 8, 6);
    ctx.fillRect(x, y, 8, 3);
    ctx.fillRect(x, y + 9, 8, 3);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(x, y + 4, 3, 4);
  } else if (e.id === 'bomber') {
    ctx.fillRect(x + 2, y + 6, 22, 4);
    ctx.fillRect(x + 8, y + 2, 16, 12);
    ctx.fillRect(x + 18, y + 4, 10, 8);
    ctx.fillRect(x, y + 4, 10, 3);
    ctx.fillRect(x, y + 9, 10, 3);
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(x + 2, y + 5, 4, 6);
  } else {
    ctx.fillRect(x + 4, y + 8, 28, 4);
    ctx.fillRect(x + 12, y + 3, 20, 14);
    ctx.fillRect(x + 24, y + 5, 12, 10);
    ctx.fillRect(x, y + 5, 16, 4);
    ctx.fillRect(x, y + 11, 16, 4);
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(x + 4, y + 7, 6, 6);
  }

  // HP bar
  if (e.maxHp > 1) {
    const bw = e.w, bh = 3;
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y - 5, bw, bh);
    ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#44ff44' : e.hp / e.maxHp > 0.25 ? '#ffaa00' : '#ff2222';
    ctx.fillRect(x, y - 5, Math.round(bw * e.hp / e.maxHp), bh);
  }

  if (e.hitFlash > 0) e.hitFlash--;
}
