import nipplejs from 'nipplejs';
import { gameState } from './state.js';
import { startGame, respawn } from './game.js';
import { toggleQuitModal } from './ui.js';

export function setupInput() {
  document.addEventListener('keydown', e => {
    gameState.keys[e.code] = true;
    if (e.code === 'Space') {
      e.preventDefault();
      // H-3: Don't auto-start from menu via Space to prevent bypassing selection
      if (gameState.state === 'gameover') startGame(1, true);
      else if (gameState.state === 'dead') respawn();
    }
    if (e.code === 'Escape' && gameState.state === 'playing') {
      e.preventDefault();
      toggleQuitModal();
    }
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') e.preventDefault();
  });
  
  document.addEventListener('keyup', e => { 
    gameState.keys[e.code] = false; 
  });

  // Mobile Joystick
  const joystickZone = document.getElementById('joystick-zone');
  if (joystickZone) {
    const manager = nipplejs.create({
      zone: joystickZone,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: '#00eeff'
    });

    manager.on('move', (evt, data) => {
      gameState.keys['ArrowUp'] = false;
      gameState.keys['ArrowDown'] = false;
      gameState.keys['ArrowLeft'] = false;
      gameState.keys['ArrowRight'] = false;

      if (data.direction) {
        if (data.direction.y === 'up') gameState.keys['ArrowUp'] = true;
        if (data.direction.y === 'down') gameState.keys['ArrowDown'] = true;
        if (data.direction.x === 'left') gameState.keys['ArrowLeft'] = true;
        if (data.direction.x === 'right') gameState.keys['ArrowRight'] = true;
      }
    });

    manager.on('end', () => {
      gameState.keys['ArrowUp'] = false;
      gameState.keys['ArrowDown'] = false;
      gameState.keys['ArrowLeft'] = false;
      gameState.keys['ArrowRight'] = false;
    });
  }

  const btnFire = document.getElementById('btn-fire');
  if (btnFire) {
    btnFire.addEventListener('pointerdown', () => {
      // H-3: Only trigger start/respawn if not in menu (menu has its own buttons)
      if (gameState.state === 'gameover') startGame(1, true);
      else if (gameState.state === 'dead') respawn();
      else if (gameState.state === 'playing') gameState.keys['Space'] = true;
    });
    btnFire.addEventListener('pointerup', () => { gameState.keys['Space'] = false; });
  }
}
