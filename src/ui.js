import { gameState } from './state.js';

// Standalone module breaks the circular import between input.js and main.js
export function toggleQuitModal() {
  const modal = document.getElementById('quit-modal');
  if (!modal) return;
  const isVisible = !modal.classList.contains('hidden');
  if (isVisible) {
    modal.classList.add('hidden');
    gameState.paused = false;
  } else {
    modal.classList.remove('hidden');
    gameState.paused = true;
  }
}
