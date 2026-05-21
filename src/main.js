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
  domElements.menuMain = document.getElementById('menu-main');
  domElements.menuControls = document.getElementById('menu-controls');
  domElements.controlsFooter = document.getElementById('controls-footer');
  domElements.mobileControls = document.getElementById('mobile-controls');
  domElements.quitMobileBtn = document.getElementById('btn-quit-mobile');

  domElements.canvas.width = W; 
  domElements.canvas.height = H;

  // H-6: Safe localStorage access at runtime
  try {
    const savedHi = localStorage.getItem('spaceImpactHiScore');
    if (savedHi) {gameState.hiScore = parseInt(savedHi, 10);}
  } catch (e) {
    console.warn('LocalStorage access failed:', e);
  }

  // Sync initial hi-score into HUD immediately
  if (domElements.hiscoreEl) {domElements.hiscoreEl.textContent = gameState.hiScore;}

  // Layout is now handled completely by CSS. No JS resizing needed.

  setupInput();

  // ─── Splash Screen D-pad Navigation ───
  const menuMain = document.getElementById('menu-main');
  const menuControls = document.getElementById('menu-controls');
  const menuCards = Array.from(document.querySelectorAll('.mode-card'));
  let menuCursor = 0; // index of currently highlighted card

  function setMenuCursor(index) {
    menuCursor = (index + menuCards.length) % menuCards.length;
    menuCards.forEach((card, i) => {
      card.classList.toggle('selected', i === menuCursor);
    });
  }

  function confirmMenuSelection() {
    if (gameState.state !== 'menu') return;
    const selected = menuCards[menuCursor];
    if (selected.id === 'card-competitive') {
      startGame(1, true);
    } else if (selected.id === 'card-arcade') {
      // Default to level 1 for arcade via controller
      startGame(1, false);
    }
  }

  // Wire D-pad Up/Down and keyboard arrows to menu cursor when in menu state
  document.addEventListener('keydown', (e) => {
    if (gameState.state !== 'menu') return;
    if (!menuMain.classList.contains('hidden')) {
      if (e.code === 'ArrowUp' || e.code === 'ArrowLeft' || e.code === 'KeyW') {
        e.preventDefault();
        setMenuCursor(menuCursor - 1);
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'KeyS') {
        e.preventDefault();
        setMenuCursor(menuCursor + 1);
      } else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ') {
        e.preventDefault();
        confirmMenuSelection();
      }
    }
  });

  // Wire physical D-pad buttons to menu cursor too
  document.getElementById('d-up')?.addEventListener('pointerdown', (e) => {
    if (gameState.state !== 'menu') return;
    e.preventDefault();
    setMenuCursor(menuCursor - 1);
  });
  document.getElementById('d-down')?.addEventListener('pointerdown', (e) => {
    if (gameState.state !== 'menu') return;
    e.preventDefault();
    setMenuCursor(menuCursor + 1);
  });
  document.getElementById('btn-fire')?.addEventListener('pointerdown', (e) => {
    if (gameState.state !== 'menu') return;
    e.preventDefault();
    confirmMenuSelection();
  }, true); // capture phase so it runs before input.js handler

  setMenuCursor(0); // highlight first card by default

  function showMainMenu() {
    domElements.olTitle.textContent = 'SPACE IMPACT';
    domElements.olScore.style.display = 'none';
    domElements.olBody.innerHTML = '';
    domElements.olPress.textContent = '';
    menuMain.classList.remove('hidden');
    menuControls.classList.add('hidden');
    domElements.overlay.classList.remove('hidden');
    // Hide quit button on menu
    if (domElements.quitMobileBtn) domElements.quitMobileBtn.classList.remove('visible');
    setMenuCursor(0); // reset cursor to first item each time menu opens
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

  // Mobile Quit Button — show during play, trigger pause modal
  const btnQuitMobile = document.getElementById('btn-quit-mobile');
  if (btnQuitMobile) {
    btnQuitMobile.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (gameState.state === 'playing') toggleQuitModal();
    });
  }

  // Show quit button when game starts (game.js calls startGame/respawn)
  // We observe gameState.state changes via a lightweight interval
  setInterval(() => {
    if (!domElements.quitMobileBtn) return;
    const playing = gameState.state === 'playing';
    domElements.quitMobileBtn.classList.toggle('visible', playing);
  }, 200);

  // Quit Modal
  document.getElementById('btn-quit-no').addEventListener('click', () => {
    toggleQuitModal(); // Just resumes (hides modal, unpauses)
  });

  document.getElementById('btn-quit-yes').addEventListener('click', () => {
    const modal = document.getElementById('quit-modal');
    if (modal) {modal.classList.add('hidden');}
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
    let rafId;
    function loop() {
      update();
      draw(domElements.ctx);
      rafId = requestAnimationFrame(loop);
    }
    if (rafId) {cancelAnimationFrame(rafId);}
    loop();
  });
});
