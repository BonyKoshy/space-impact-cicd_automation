import { W, H, ENEMY_TYPES, BOSS_TYPE } from '../config.js';
import { gameState } from '../state.js';
import { sprites } from '../assets.js';

export function spawnBoss() {
  gameState.bossActive = true;
  const t = { ...BOSS_TYPE };
  const y = H / 2 - t.h / 2;
  gameState.enemies.push({
    ...t,
    x: W + 10, y,
    startY: y,
    vx: -0.5,
    vy: 1,
    phase: 0,
    wave: false,
    hp: t.hp + (gameState.level * 5),
    maxHp: t.hp + (gameState.level * 5),
    hitFlash: 0,
    isBoss: true
  });
}

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
  
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  
  if (flash) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, e.w, e.h);
  } else {
    let sprite = sprites.scout;
    if (e.isBoss) sprite = sprites.boss;
    else if (e.id === 'cruiser') sprite = sprites.cruiser;
    else if (e.id === 'fighter') sprite = sprites.fighter;

    const scale = e.isBoss ? 2.0 : 1.5;
    const sw = e.w * scale;
    const sh = e.h * scale;
    const sx = x - (sw - e.w) / 2;
    const sy = y - (sh - e.h) / 2;
    
    ctx.drawImage(sprite, sx, sy, sw, sh);
  }

  if (e.isBoss) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#440000';
    ctx.fillRect(W / 2 - 50, 10, 100, 6);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(W / 2 - 50, 10, 100 * (e.hp / e.maxHp), 6);
  } else if (e.maxHp > 1) {
    ctx.globalCompositeOperation = 'source-over';
    const bw = e.w, bh = 3;
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y - 5, bw, bh);
    ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#44ff44' : e.hp / e.maxHp > 0.25 ? '#ffaa00' : '#ff2222';
    ctx.fillRect(x, y - 5, Math.round(bw * e.hp / e.maxHp), bh);
  }
  
  ctx.restore();
  
  if (e.hitFlash > 0) e.hitFlash--;
}
