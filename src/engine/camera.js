import { lerp, clamp } from '../utils/math.js';

export function createCamera() {
  return {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    viewW: 480,
    viewH: 320,
    levelW: 0,
    levelH: 0,
    smoothing: 0.1,
    lookaheadX: 40,
    deadZoneY: 20,
  };
}

export function updateCamera(cam, playerX, playerY, playerVx, dt) {
  const lookDir = playerVx > 0.5 ? 1 : playerVx < -0.5 ? -1 : 0;
  cam.targetX = playerX - cam.viewW / 2 + lookDir * cam.lookaheadX;

  const dy = playerY - cam.viewH / 2 - cam.y;
  if (Math.abs(dy) > cam.deadZoneY) {
    cam.targetY = playerY - cam.viewH / 2;
  }

  cam.x = lerp(cam.x, cam.targetX, cam.smoothing);
  cam.y = lerp(cam.y, cam.targetY, cam.smoothing);

  cam.x = clamp(cam.x, 0, Math.max(0, cam.levelW - cam.viewW));
  cam.y = clamp(cam.y, 0, Math.max(0, cam.levelH - cam.viewH));
}

export function setViewport(cam, w, h) {
  cam.viewW = w;
  cam.viewH = h;
}

export function setBounds(cam, levelW, levelH) {
  cam.levelW = levelW;
  cam.levelH = levelH;
}

export function snapCamera(cam, playerX, playerY) {
  cam.x = playerX - cam.viewW / 2;
  cam.y = playerY - cam.viewH / 2;
  cam.targetX = cam.x;
  cam.targetY = cam.y;
  cam.x = clamp(cam.x, 0, Math.max(0, cam.levelW - cam.viewW));
  cam.y = clamp(cam.y, 0, Math.max(0, cam.levelH - cam.viewH));
}
