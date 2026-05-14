export const sprites = {};

export function preloadAssets(onComplete) {
  const toLoad = [
    { name: 'player', src: '/assets/player_ship.png' },
    { name: 'scout', src: '/assets/scout.png' },
    { name: 'fighter', src: '/assets/fighter.png' },
    { name: 'cruiser', src: '/assets/cruiser.png' },
    { name: 'boss', src: '/assets/boss.png' }
  ];
  
  let loaded = 0;
  toLoad.forEach(asset => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      if (loaded === toLoad.length) onComplete();
    };
    img.src = asset.src;
    sprites[asset.name] = img;
  });
}
