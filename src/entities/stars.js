import { W, H, STAR_LAYERS } from '../config.js';

let stars = [];

export function initStars() {
  stars = [];
  STAR_LAYERS.forEach(layer => {
    for (let i = 0; i < layer.count; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, layer });
    }
  });
}

export function updateStars() {
  stars.forEach(s => {
    s.x -= s.layer.speed;
    if (s.x < 0) {
      s.x = W;
      s.y = Math.random() * H;
    }
  });
}

export function drawStars(ctx) {
  stars.forEach(s => {
    ctx.globalAlpha = s.layer.alpha;
    ctx.fillStyle = '#fff';
    ctx.fillRect(Math.round(s.x), Math.round(s.y), s.layer.size, s.layer.size);
  });
  ctx.globalAlpha = 1;
}
