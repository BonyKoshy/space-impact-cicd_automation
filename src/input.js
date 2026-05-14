import { gameState } from './state.js';
import { startGame, respawn } from './game.js';

export function setupInput() {
  document.addEventListener('keydown', e => {
    gameState.keys[e.code] = true;
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState.state === 'menu' || gameState.state === 'gameover') startGame();
      else if (gameState.state === 'dead') respawn();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') e.preventDefault();
  });
  
  document.addEventListener('keyup', e => { 
    gameState.keys[e.code] = false; 
  });

  // Mobile
  function mobileBtn(id, code) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('pointerdown', () => { gameState.keys[code] = true; });
    btn.addEventListener('pointerup', () => { gameState.keys[code] = false; });
    btn.addEventListener('pointercancel', () => { gameState.keys[code] = false; });
  }

  mobileBtn('btn-up', 'ArrowUp');
  mobileBtn('btn-down', 'ArrowDown');
  mobileBtn('btn-left', 'ArrowLeft');
  mobileBtn('btn-right', 'ArrowRight');

  const btnFire = document.getElementById('btn-fire');
  if (btnFire) {
    btnFire.addEventListener('pointerdown', () => {
      if (gameState.state === 'menu' || gameState.state === 'gameover') startGame();
      else if (gameState.state === 'dead') respawn();
      else gameState.keys['Space'] = true;
    });
    btnFire.addEventListener('pointerup', () => { gameState.keys['Space'] = false; });
  }
}
