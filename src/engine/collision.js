import { TILE_SIZE, isSolid, isPlatform, isSpike, isBounce, isCrumble } from '../levels/tiles.js';
import { clamp } from '../utils/math.js';

export function getTile(level, col, row) {
  if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) return 0;
  return level.tiles[row][col];
}

export function resolveCollisionX(entity, level) {
  const top = Math.floor(entity.y / TILE_SIZE);
  const bottom = Math.floor((entity.y + entity.h - 1) / TILE_SIZE);
  const margin = 1;

  if (entity.vx > 0) {
    const col = Math.floor((entity.x + entity.w) / TILE_SIZE);
    for (let row = top; row <= bottom; row++) {
      const tile = getTile(level, col, row);
      if (isSolid(tile)) {
        entity.x = col * TILE_SIZE - entity.w;
        entity.vx = 0;
        entity.touchingRight = true;
        return;
      }
    }
  } else if (entity.vx < 0) {
    const col = Math.floor(entity.x / TILE_SIZE);
    for (let row = top; row <= bottom; row++) {
      const tile = getTile(level, col, row);
      if (isSolid(tile)) {
        entity.x = (col + 1) * TILE_SIZE;
        entity.vx = 0;
        entity.touchingLeft = true;
        return;
      }
    }
  }
}

export function resolveCollisionY(entity, level, crumbleMap) {
  const left = Math.floor((entity.x + 2) / TILE_SIZE);
  const right = Math.floor((entity.x + entity.w - 3) / TILE_SIZE);

  entity.onGround = false;
  entity.hitCeiling = false;
  entity.onBounce = false;
  entity.onSpike = false;
  entity.onIce = false;
  entity.onCrumble = false;

  if (entity.vy > 0) {
    const row = Math.floor((entity.y + entity.h) / TILE_SIZE);
    for (let col = left; col <= right; col++) {
      const tile = getTile(level, col, row);
      if (isSolid(tile) || (isPlatform(tile) && entity.y + entity.h - entity.vy <= row * TILE_SIZE + 1)) {
        if (isCrumble(tile)) {
          const key = `${col},${row}`;
          if (crumbleMap && crumbleMap[key] && crumbleMap[key].broken) continue;
          entity.onCrumble = true;
          if (crumbleMap && !crumbleMap[key]) {
            crumbleMap[key] = { timer: 0.5, broken: false, col, row };
          }
        }
        if (isBounce(tile)) {
          entity.onBounce = true;
        }
        if (isSpike(tile)) {
          entity.onSpike = true;
          return;
        }
        entity.y = row * TILE_SIZE - entity.h;
        entity.vy = 0;
        entity.onGround = true;
        if (tile === 6) entity.onIce = true;
        return;
      }
    }
  } else if (entity.vy < 0) {
    const row = Math.floor(entity.y / TILE_SIZE);
    for (let col = left; col <= right; col++) {
      const tile = getTile(level, col, row);
      if (isSolid(tile)) {
        entity.y = (row + 1) * TILE_SIZE;
        entity.vy = 0;
        entity.hitCeiling = true;
        return;
      }
    }
  }

  // Check spike tiles at feet when standing
  if (entity.onGround) {
    const row = Math.floor((entity.y + entity.h + 1) / TILE_SIZE);
    for (let col = left; col <= right; col++) {
      if (isSpike(getTile(level, col, row))) {
        entity.onSpike = true;
      }
    }
  }
}

// Check for spike tiles the entity overlaps with
export function checkSpikeOverlap(entity, level) {
  const left = Math.floor(entity.x / TILE_SIZE);
  const right = Math.floor((entity.x + entity.w - 1) / TILE_SIZE);
  const top = Math.floor(entity.y / TILE_SIZE);
  const bottom = Math.floor((entity.y + entity.h - 1) / TILE_SIZE);

  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      if (isSpike(getTile(level, col, row))) return true;
    }
  }
  return false;
}
