import './style.css';
import { W, H } from './config.js';
import { domElements } from './state.js';
import { setupInput } from './input.js';
import { initStars } from './entities/stars.js';
import { update, draw } from './game.js';
import { preloadAssets } from './assets.js';

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

  domElements.canvas.width = W; 
  domElements.canvas.height = H;

  function resize() {
    const wrapper = document.getElementById('game-wrapper');
    wrapper.style.transform = 'none';
    const rect = wrapper.getBoundingClientRect();
    const scaleX = window.innerWidth / rect.width;
    const scaleY = window.innerHeight / rect.height;
    // For retro games, we want to scale to fit the screen without stretching
    const scale = Math.min(scaleX, scaleY) * 0.98; // 98% to leave a tiny margin
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
  }
  resize();
  window.addEventListener('resize', resize);

  setupInput();

  function showMenu() {
    domElements.olTitle.textContent = 'SPACE IMPACT';
    domElements.olScore.style.display = 'none';
    domElements.olBody.innerHTML = 'ARROW KEYS — move<br>SPACE — fire<br><br>Collect power-ups!<br>Survive as long as you can!';
    domElements.olPress.textContent = 'PRESS SPACE TO START';
  }

  initStars();
  
  domElements.olTitle.textContent = 'LOADING...';
  domElements.olBody.innerHTML = 'Preloading retro assets';

  preloadAssets(() => {
    showMenu();
    function loop() {
      update();
      draw(domElements.ctx);
      requestAnimationFrame(loop);
    }
    loop();
  });
});
