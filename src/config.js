// Game Dimensions
export const W = 480;
export const H = 300;

// Balancing Constants
export const INITIAL_LEVEL_TARGET = 200;
export const LEVEL_SCALING_FACTOR = 1.4;
export const SPAWN_RATE_INITIAL = 80;
export const SPAWN_RATE_MIN = 30;
export const PLAYER_INVINCIBILITY_DURATION = 120; // frames
export const PLAYER_RESPAWN_INVINCIBILITY = 80;   // frames

export const STAR_LAYERS = [
  { count: 60, speed: 0.3, size: 1, alpha: 0.4 },
  { count: 30, speed: 0.7, size: 1.5, alpha: 0.65 },
  { count: 10, speed: 1.2, size: 2, alpha: 0.9 },
];

export const ENEMY_TYPES = [
  { id: 'scout',   w: 18, h: 10, hp: 1, score: 10, speed: 1.8, color: '#ff4466', shootChance: 0.003 },
  { id: 'fighter', w: 22, h: 12, hp: 2, score: 25, speed: 1.3, color: '#ff6633', shootChance: 0.006 },
  { id: 'bomber',  w: 28, h: 16, hp: 4, score: 50, speed: 0.8, color: '#cc2288', shootChance: 0.012 },
  { id: 'cruiser', w: 36, h: 20, hp: 8, score: 100, speed: 0.6, color: '#8800ff', shootChance: 0.015 },
];

export const BOSS_TYPE = { id: 'boss', w: 60, h: 40, hp: 50, score: 500, speed: 0.3, color: '#ff2222', shootChance: 0.05 };

export const PU_TYPES = ['rapid', 'triple', 'shield', 'life'];
export const PU_COLORS = { rapid: '#ffcc00', triple: '#00eeff', shield: '#88ffcc', life: '#ff3366' };
export const PU_LABELS = { rapid: 'R', triple: 'T', shield: 'S', life: '♥' };
