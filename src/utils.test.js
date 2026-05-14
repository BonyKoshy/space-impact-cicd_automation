import { describe, it, expect } from 'vitest';
import { rectsOverlap } from './utils.js';

describe('Collision Detection (rectsOverlap)', () => {
  it('should return true when two rectangles overlap', () => {
    const rect1 = { x: 0, y: 0, w: 10, h: 10 };
    const rect2 = { x: 5, y: 5, w: 10, h: 10 };
    expect(rectsOverlap(rect1, rect2)).toBe(true);
  });

  it('should return false when two rectangles are side by side', () => {
    const rect1 = { x: 0, y: 0, w: 10, h: 10 };
    const rect2 = { x: 10, y: 0, w: 10, h: 10 };
    // At x=10, they just touch edge to edge, which our logic considers false (requires < and >)
    expect(rectsOverlap(rect1, rect2)).toBe(false);
  });

  it('should return false when two rectangles are far apart', () => {
    const rect1 = { x: 0, y: 0, w: 10, h: 10 };
    const rect2 = { x: 50, y: 50, w: 10, h: 10 };
    expect(rectsOverlap(rect1, rect2)).toBe(false);
  });

  it('should return true when one rectangle is inside another', () => {
    const rect1 = { x: 0, y: 0, w: 50, h: 50 };
    const rect2 = { x: 10, y: 10, w: 10, h: 10 };
    expect(rectsOverlap(rect1, rect2)).toBe(true);
  });
});
