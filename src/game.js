import { W, H, PU_COLORS } from './config.js';
import { gameState, domElements } from './state.js';
import { makePlayer, drawPlayer } from './entities/player.js';
import { spawnEnemy, spawnBoss, drawEnemy } from './entities/enemies.js';
import { drawBullets, shoot } from './entities/bullets.js';
import { spawnPowerup, drawPowerup } from './entities/powerups.js';
import { explode, updateParticles, drawParticles } from './entities/particles.js';
import { updateStars, drawStars } from './entities/stars.js';
import { playStartSound, playLevelUpSound, playPowerupSound } from './audio.js';
import { rectsOverlap } from './utils.js';

export function updateHUD() {
  if (domElements.scoreEl) domElements.scoreEl.textContent = gameState.score;
  if (domElements.levelEl) domElements.levelEl.textContent = gameState.level;
  if (domElements.livesEl) domElements.livesEl.innerHTML = '♥'.repeat(gameState.lives) || '—';
  if (domElements.hiscoreEl) domElements.hiscoreEl.textContent = gameState.hiScore;
}

export function startGame(startLevel = 1, competitive = true) {
  gameState.competitiveMode = competitive;
  gameState.score = 0; 
  gameState.lives = 3; 
  gameState.level = startLevel;
  gameState.levelScore = 0;
  // Scale levelTarget for where we are starting
  gameState.levelTarget = Math.round(200 * Math.pow(1.4, startLevel - 1));
  gameState.player = makePlayer();
  gameState.enemies = []; 
  gameState.bullets = []; 
  gameState.enemyBullets = [];
  gameState.powerups = []; 
  gameState.particles = [];
  gameState.spawnTimer = 0; 
  gameState.spawnRate = 80; 
  gameState.frame = 0;
  gameState.bossActive = false;
  gameState.state = 'playing';
  
  if (domElements.overlay) domElements.overlay.classList.add('hidden');
  updateHUD();
  playStartSound();
}

export function respawn() {
  gameState.player = makePlayer();
  gameState.player.invincible = 120;
  gameState.enemies = []; 
  gameState.bullets = []; 
  gameState.enemyBullets = [];
  gameState.powerups = [];
  gameState.state = 'playing';
  
  if (domElements.overlay) domElements.overlay.classList.add('hidden');
}

export function playerDied() {
  gameState.shake = 15;
  explode(gameState.player.x + gameState.player.w / 2, gameState.player.y + gameState.player.h / 2, 40, '#00eeff');
  gameState.lives--;
  updateHUD();
  
  if (gameState.lives <= 0) {
    if (gameState.competitiveMode && gameState.score > gameState.hiScore) {
      gameState.hiScore = gameState.score;
      localStorage.setItem('spaceImpactHiScore', gameState.hiScore);
    }
    gameState.state = 'gameover';
    domElements.overlay.classList.remove('hidden');
    domElements.olTitle.textContent = 'GAME OVER';
    domElements.olScore.style.display = 'block';
    const modeTag = gameState.competitiveMode ? '' : ' (Practice)';
    domElements.olScore.textContent = `SCORE: ${gameState.score}${modeTag}  HI: ${gameState.hiScore}`;
    domElements.olBody.innerHTML = '';
    domElements.olPress.textContent = '';
    // Re-show the main menu so player can choose mode/level
    const menuMain = document.getElementById('menu-main');
    const menuControls = document.getElementById('menu-controls');
    const controlsFooter = document.getElementById('controls-footer');
    if (menuMain) menuMain.classList.remove('hidden');
    if (menuControls) menuControls.classList.add('hidden');
    if (controlsFooter) controlsFooter.classList.remove('hidden');
  } else {
    gameState.state = 'dead';
    domElements.overlay.classList.remove('hidden');
    domElements.olTitle.textContent = 'SHIP LOST';
    domElements.olScore.style.display = 'block';
    domElements.olScore.textContent = `LIVES: ${'♥'.repeat(gameState.lives)}`;
    domElements.olBody.innerHTML = '';
    domElements.olPress.textContent = 'PRESS SPACE TO CONTINUE';
    // Hide the mode selection — this is mid-game, not the main menu
    const menuMain = document.getElementById('menu-main');
    const controlsFooter = document.getElementById('controls-footer');
    if (menuMain) menuMain.classList.add('hidden');
    if (controlsFooter) controlsFooter.classList.add('hidden');
  }
}

export function update() {
  gameState.frame++;
  updateStars();

  if (gameState.state !== 'playing') return;
  if (gameState.paused) return; // Frozen while quit modal is open

  const p = gameState.player;
  if (gameState.keys['ArrowUp'] || gameState.keys['KeyW']) p.y -= p.speed;
  if (gameState.keys['ArrowDown'] || gameState.keys['KeyS']) p.y += p.speed;
  if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) p.x -= p.speed * 0.7;
  if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) p.x += p.speed * 0.7;
  p.x = Math.max(0, Math.min(W - p.w, p.x));
  p.y = Math.max(0, Math.min(H - p.h, p.y));

  if (p.shootCooldown > 0) p.shootCooldown--;
  if (gameState.keys['Space'] || gameState.keys['KeyZ']) shoot();

  if (p.invincible > 0) p.invincible--;
  if (p.rapidFire > 0) p.rapidFire--;
  if (p.triShot > 0) p.triShot--;
  if (p.shield > 0) p.shield--;

  // Bullets
  gameState.bullets = gameState.bullets.filter(b => b.x < W + 10);
  gameState.bullets.forEach(b => { b.x += 7; b.y += b.vy; });

  gameState.enemyBullets = gameState.enemyBullets.filter(b => b.x > -10 && b.y > -10 && b.y < H + 10);
  gameState.enemyBullets.forEach(b => { b.x += b.vx; b.y += b.vy; });

  // Spawn enemies
  if (!gameState.bossActive) {
    gameState.spawnTimer++;
    const sr = Math.max(30, gameState.spawnRate - gameState.level * 6);
    if (gameState.spawnTimer >= sr) { gameState.spawnTimer = 0; spawnEnemy(); }
  }

  // Update enemies
  gameState.enemies = gameState.enemies.filter(e => e.x > -50);
  gameState.enemies.forEach(e => {
    if (e.isBoss) {
      if (e.x > W - e.w - 10) e.x += e.vx; // Move into view
      else {
        e.y += e.vy;
        if (e.y <= 0 || e.y + e.h >= H) e.vy *= -1; // Bounce
      }
    } else {
      e.x += e.vx;
      if (e.wave) e.y = e.startY + Math.sin(gameState.frame * 0.04 + e.phase) * 30;
      else e.y += e.vy;
      e.y = Math.max(2, Math.min(H - e.h - 2, e.y));
      if (e.startY !== undefined && !e.wave) e.startY = e.y;
    }

    // Enemy shooting
    if (e.x > p.x && Math.random() < e.shootChance * (1 + (gameState.level - 1) * 0.3)) {
      const dx = p.x - e.x, dy = (p.y + p.h / 2) - (e.y + e.h / 2);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const spd = 2.5 + gameState.level * 0.2;
      gameState.enemyBullets.push({
        x: e.x, y: e.y + e.h / 2,
        vx: dx / dist * spd, vy: dy / dist * spd,
        w: 5, h: 2
      });
    }
  });

  // Power-ups
  gameState.powerups = gameState.powerups.filter(pu => pu.x > -20);
  gameState.powerups.forEach(pu => { pu.x -= 1.2; pu.y += pu.vy; pu.y = Math.max(2, Math.min(H - 16, pu.y)); });

  // Bullet vs enemy
  gameState.bullets.forEach(b => {
    gameState.enemies.forEach(e => {
      if (rectsOverlap(b, e)) {
        b.dead = true;
        e.hp--;
        e.hitFlash = 6;
        if (e.hp <= 0) {
          e.dead = true;
          gameState.score += e.score;
          gameState.levelScore += e.score;
          updateHUD();
          explode(e.x + e.w / 2, e.y + e.h / 2, 15 + e.maxHp * 3, e.color);
          
          if (e.isBoss) {
            gameState.shake = 20;
            gameState.bossActive = false;
            spawnPowerup(e.x, e.y); spawnPowerup(e.x + 20, e.y); spawnPowerup(e.x + 40, e.y);
          } else {
            spawnPowerup(e.x, e.y + e.h / 2);
          }
        }
      }
    });
  });
  gameState.bullets = gameState.bullets.filter(b => !b.dead);
  gameState.enemies = gameState.enemies.filter(e => !e.dead);

  // Enemy bullet vs player
  if (p.invincible <= 0) {
    gameState.enemyBullets.forEach(b => {
      if (rectsOverlap(b, { x: p.x + 4, y: p.y + 2, w: p.w - 6, h: p.h - 4 })) {
        b.dead = true;
        if (p.shield > 0) {
          p.shield = 0;
          explode(b.x, b.y, 6, '#88ffcc');
        } else {
          p.invincible = 80;
          playerDied();
        }
      }
    });
    gameState.enemyBullets = gameState.enemyBullets.filter(b => !b.dead);

    // Enemy vs player collision
    if (gameState.state === 'playing') {
      gameState.enemies.forEach(e => {
        if (rectsOverlap({ x: p.x + 4, y: p.y + 2, w: p.w - 8, h: p.h - 4 }, e)) {
          e.dead = true;
          if (p.shield > 0) { p.shield = 0; explode(e.x, e.y, 10, '#88ffcc'); }
          else { p.invincible = 80; playerDied(); }
        }
      });
      gameState.enemies = gameState.enemies.filter(e => !e.dead);
    }
  }

  // Player vs powerup
  gameState.powerups.forEach(pu => {
    if (rectsOverlap(p, { x: pu.x, y: pu.y, w: 14, h: 14 })) {
      pu.dead = true;
      if (pu.type === 'rapid') p.rapidFire = 300;
      else if (pu.type === 'triple') p.triShot = 300;
      else if (pu.type === 'shield') p.shield = 400;
      else if (pu.type === 'life' && gameState.lives < 5) { gameState.lives++; updateHUD(); }
      playPowerupSound();
      explode(pu.x + 7, pu.y + 7, 10, PU_COLORS[pu.type]);
    }
  });
  gameState.powerups = gameState.powerups.filter(pu => !pu.dead);

  updateParticles();

  // Level up
  if (gameState.levelScore >= gameState.levelTarget && !gameState.bossActive) {
    gameState.levelScore = 0;
    gameState.level++;
    gameState.levelTarget = Math.round(gameState.levelTarget * 1.4);
    updateHUD();
    playLevelUpSound();
    for (let i = 0; i < 30; i++) {
      setTimeout(() => explode(Math.random() * W, Math.random() * H, 6, '#ffcc00'), i * 60);
    }
    if (gameState.level % 5 === 0) {
      spawnBoss();
    }
  }
}

export function draw(ctx) {
  ctx.save();
  if (gameState.shake > 0) {
    const dx = (Math.random() - 0.5) * gameState.shake;
    const dy = (Math.random() - 0.5) * gameState.shake;
    ctx.translate(dx, dy);
    gameState.shake *= 0.9;
    if (gameState.shake < 0.5) gameState.shake = 0;
  }

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#000008';
  ctx.fillRect(0, 0, W, H);

  drawStars(ctx);
  drawParticles(ctx);

  gameState.powerups.forEach(p => drawPowerup(ctx, p));
  gameState.enemies.forEach(e => drawEnemy(ctx, e));

  if (gameState.state === 'playing' || gameState.state === 'dead' || gameState.state === 'gameover') {
    drawBullets(ctx);
    if (gameState.state === 'playing') drawPlayer(ctx);
  }

  // Power-up status bar
  if (gameState.state === 'playing') {
    const p = gameState.player;
    let px = 4, py = H - 6;
    const drawStatus = (label, time, col) => {
      if (time <= 0) return;
      ctx.fillStyle = col;
      ctx.font = '6px monospace';
      ctx.fillText(`${label}:${Math.ceil(time / 60)}s`, px, py);
      px += 50;
    };
    drawStatus('RAPID', p.rapidFire, '#ffcc00');
    drawStatus('TRI', p.triShot, '#00eeff');
    drawStatus('SHIELD', p.shield, '#88ffcc');
  }

  ctx.restore();
}
