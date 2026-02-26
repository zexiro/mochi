const keys = {};
const touch = { left: false, right: false, jump: false, down: false };
let touchJumpPressed = false;
let touchJumpReleased = false;

const state = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false,
  jumpReleased: false,
  down: false,
  pause: false,
};

let pausePressed = false;

export function initInput() {
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    keys[e.code] = true;
    if (e.code === 'Escape') pausePressed = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  window.addEventListener('blur', () => {
    Object.keys(keys).forEach(k => keys[k] = false);
  });
}

export function setTouch(action, pressed) {
  touch[action] = pressed;
  if (action === 'jump') {
    if (pressed) touchJumpPressed = true;
    else touchJumpReleased = true;
  }
}

export function pollInput() {
  const prevJump = state.jump;

  state.left = keys['ArrowLeft'] || keys['KeyA'] || touch.left;
  state.right = keys['ArrowRight'] || keys['KeyD'] || touch.right;
  state.down = keys['ArrowDown'] || keys['KeyS'] || touch.down;

  const kbJump = keys['Space'] || keys['ArrowUp'] || keys['KeyW'];
  state.jump = kbJump || touch.jump;

  state.jumpPressed = (!prevJump && state.jump) || touchJumpPressed;
  state.jumpReleased = (prevJump && !state.jump) || touchJumpReleased;

  state.pause = pausePressed;
  pausePressed = false;
  touchJumpPressed = false;
  touchJumpReleased = false;

  return state;
}

export function resetInput() {
  Object.keys(keys).forEach(k => keys[k] = false);
  touch.left = false;
  touch.right = false;
  touch.jump = false;
  touch.down = false;
}
