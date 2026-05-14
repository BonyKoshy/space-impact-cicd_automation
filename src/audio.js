const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type, freq, freq2, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (freq2) {
    osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + duration);
  }
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playShootSound() {
  playSound('square', 400, 100, 0.1, 0.05);
}

export function playExplosionSound(large = false) {
  playSound('sawtooth', 100, 20, large ? 0.4 : 0.15, 0.1);
}

export function playPowerupSound() {
  playSound('sine', 600, 1200, 0.2, 0.1);
}

export function playStartSound() {
  playSound('square', 300, 800, 0.3, 0.1);
}

export function playLevelUpSound() {
  playSound('square', 400, 600, 0.1, 0.1);
  setTimeout(() => playSound('square', 600, 800, 0.2, 0.1), 100);
}
