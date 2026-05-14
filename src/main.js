import './style.css';
import { W, H } from './config.js';
import { domElements, gameState } from './state.js';
import { setupInput } from './input.js';
import { initStars } from './entities/stars.js';
import { update, draw, startGame } from './game.js';
import { preloadAssets } from './assets.js';

import { toggleQuitModal } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  domElements.canvas = document.getElementById('c');
  domElements.ctx = domElements.canvas.getContext('2d');
  domElements.overlay = document.getElementById('overlay');
  domElements.olTitle = document.getElementById('ol-title');
  domElements.olBody = document.getElementById('ol-body');
  domElements.olScore = document.getElementById('ol-score');
  domElements.olPress = document.getElementById('ol-press');
  domElements.scoreEl = document.getElementById('score-display');
  domElements.levelEl = document.getElementById('level-display');
  domElements.livesEl = document.getElementById('lives-display');
  domElements.hiscoreEl = document.getElementById('hiscore-display');

  domElements.canvas.width = W; 
  domElements.canvas.height = H;

  // Sync initial hi-score into HUD immediately
  if (domElements.hiscoreEl) domElements.hiscoreEl.textContent = gameState.hiScore;

  function resize() {
    const wrapper = document.getElementById('game-wrapper');
    wrapper.style.transform = 'none';
    const rect = wrapper.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    const scale = Math.min(scaleX, scaleY) * 0.98;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
  }
  resize();
  window.addEventListener('resize', resize);

  setupInput();

  // ─── Splash Screen Navigation ───
  const menuMain = document.getElementById('menu-main');
  const menuControls = document.getElementById('menu-controls');

  function showMainMenu() {
    domElements.olTitle.textContent = 'SPACE IMPACT';
    domElements.olScore.style.display = 'none';
    domElements.olBody.innerHTML = '';
    domElements.olPress.textContent = '';
    menuMain.classList.remove('hidden');
    menuControls.classList.add('hidden');
    domElements.overlay.classList.remove('hidden');
  }

  // Competitive Mode — starts at Level 1, tracks hi-score
  document.getElementById('btn-competitive').addEventListener('click', () => {
    startGame(1, true);
  });

  // Level Select (1–5) — no hi-score tracking
  [1, 2, 3, 4, 5].forEach(lvl => {
    document.getElementById(`btn-lvl-${lvl}`).addEventListener('click', () => {
      startGame(lvl, false);
    });
  });

  // Controls screen toggle
  document.getElementById('btn-controls-open').addEventListener('click', () => {
    menuMain.classList.add('hidden');
    menuControls.classList.remove('hidden');
  });

  document.getElementById('btn-controls-back').addEventListener('click', () => {
    menuControls.classList.add('hidden');
    menuMain.classList.remove('hidden');
  });

  // Quit Modal
  document.getElementById('btn-quit-no').addEventListener('click', () => {
    toggleQuitModal(); // Just resumes (hides modal, unpauses)
  });

  document.getElementById('btn-quit-yes').addEventListener('click', () => {
    const modal = document.getElementById('quit-modal');
    if (modal) modal.classList.add('hidden');
    gameState.paused = false;
    gameState.state = 'menu';
    // Reset core state so the background game is clean
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.enemyBullets = [];
    gameState.powerups = [];
    gameState.particles = [];
    gameState.player = null;
    gameState.bossActive = false;
    showMainMenu();
  });

  // ─── Init ───
  initStars();
  domElements.olTitle.textContent = 'LOADING...';
  domElements.olBody.innerHTML = 'Preloading retro assets...';
  menuMain.classList.add('hidden');

  preloadAssets(() => {
    showMainMenu();
    function loop() {
      update();
      draw(domElements.ctx);
      requestAnimationFrame(loop);
    }
    loop();
  });
});
