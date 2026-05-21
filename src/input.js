import { gameState } from './state.js';
import { startGame, respawn } from './game.js';
import { toggleQuitModal } from './ui.js';

export function setupInput() {
  document.addEventListener('keydown', e => {
    gameState.keys[e.code] = true;
    if (e.code === 'Space') {
      e.preventDefault();
      // H-3: Don't auto-start from menu via Space to prevent bypassing selection
      if (gameState.state === 'gameover') {startGame(1, true);}
      else if (gameState.state === 'dead') {respawn();}
    }
    if (e.code === 'Escape' && gameState.state === 'playing') {
      e.preventDefault();
      toggleQuitModal();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {e.preventDefault();}
  });
  
  document.addEventListener('keyup', e => { 
    gameState.keys[e.code] = false; 
  });

  // Mobile Controller (D-pad + XYAB)
  const dpadMapping = {
    'd-up': 'ArrowUp',
    'd-down': 'ArrowDown',
    'd-left': 'ArrowLeft',
    'd-right': 'ArrowRight'
  };

  Object.entries(dpadMapping).forEach(([id, key]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        gameState.keys[key] = true;
      });
      btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        gameState.keys[key] = false;
      });
      btn.addEventListener('pointerleave', (e) => {
        e.preventDefault();
        gameState.keys[key] = false;
      });
    }
  });

  const actionButtons = ['btn-fire'];
  actionButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        // Trigger fire or start game
        if (gameState.state === 'gameover') { startGame(1, true); }
        else if (gameState.state === 'dead') { respawn(); }
        else if (gameState.state === 'playing') { gameState.keys['Space'] = true; }
      });
      btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        gameState.keys['Space'] = false;
      });
      btn.addEventListener('pointerleave', (e) => {
        e.preventDefault();
        gameState.keys['Space'] = false;
      });
    }
  });
}
