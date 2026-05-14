import { describe, it, expect, beforeEach } from 'vitest';
import { gameState } from './state.js';

describe('Global Game State', () => {
  beforeEach(() => {
    // Reset state before each test
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.state = 'menu';
  });

  it('should initialize with correct default values', () => {
    expect(gameState.score).toBe(0);
    expect(gameState.lives).toBe(3);
    expect(gameState.level).toBe(1);
    expect(gameState.state).toBe('menu');
  });

  it('should allow updating scores', () => {
    gameState.score += 100;
    expect(gameState.score).toBe(100);
  });

  it('should handle lives correctly', () => {
    gameState.lives--;
    expect(gameState.lives).toBe(2);
    
    gameState.lives = 0;
    expect(gameState.lives).toBe(0);
  });
});
