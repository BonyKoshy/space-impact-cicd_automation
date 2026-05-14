import { PU_TYPES, PU_COLORS, PU_LABELS } from '../config.js';
import { gameState } from '../state.js';

export function spawnPowerup(x, y) {
  if (Math.random() > 0.22) return;
  const type = PU_TYPES[Math.floor(Math.random() * PU_TYPES.length)];
  gameState.powerups.push({ x, y, type, vy: (Math.random() - 0.5) * 0.6, phase: Math.random() * Math.PI * 2 });
}

export function drawPowerup(ctx, p) {
  const x = Math.round(p.x), y = Math.round(p.y);
  const glow = 0.6 + 0.4 * Math.sin(gameState.frame * 0.12 + p.phase);
  ctx.fillStyle = PU_COLORS[p.type];
  ctx.globalAlpha = glow;
  ctx.shadowBlur = 8; ctx.shadowColor = PU_COLORS[p.type];
  ctx.fillRect(x, y, 14, 14);
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#000';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(PU_LABELS[p.type], x + 7, y + 10);
  ctx.textAlign = 'left';
}
