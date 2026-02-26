let ctx = null;
let masterGain = null;
let muted = false;

export function initAudio() {
  if (ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
  } catch (e) {
    console.warn('Web Audio not available');
  }
}

export function getAudioContext() {
  return ctx;
}

export function getMasterGain() {
  return masterGain;
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

export function setMuted(m) {
  muted = m;
  if (masterGain) {
    masterGain.gain.value = m ? 0 : 0.4;
  }
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  setMuted(!muted);
  return muted;
}
