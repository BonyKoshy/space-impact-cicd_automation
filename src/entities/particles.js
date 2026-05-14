import { gameState } from '../state.js';
import { playExplosionSound } from '../audio.js';

export function explode(x, y, count, col) {
  playExplosionSound(count > 20);
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 0.5 + Math.random() * 3;
    gameState.particles.push({
      x, y,
      vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
      life: 20 + Math.random() * 20,
      maxLife: 40,
      col: col || '#ff8844',
      size: 1 + Math.random() * 2,
    });
  }
}

export function updateParticles() {
  gameState.particles = gameState.particles.filter(p => p.life > 0);
  gameState.particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.95; p.vy *= 0.95;
    p.life--;
  });
}

export function drawParticles(ctx) {
  gameState.particles.forEach(p => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.col;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  });
  ctx.globalAlpha = 1;
}
