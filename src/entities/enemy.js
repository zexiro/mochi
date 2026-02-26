import { getTile } from '../engine/collision.js';
import { TILE_SIZE, isSolid } from '../levels/tiles.js';

export const ENEMY_TYPE = {
  ONIGIRI: 'onigiri',   // patrols back and forth
  SHRIMP: 'shrimp',     // hops in place periodically
  WASABI: 'wasabi',      // stationary, bounces player up
};

export function createEnemy(type, x, y, config = {}) {
  return {
    type,
    x, y,
    w: 24, h: 24,
    vx: type === ENEMY_TYPE.ONIGIRI ? (config.speed || 1.2) : 0,
    vy: 0,
    startX: x,
    startY: y,
    facing: 1,
    range: config.range || 80,
    active: true,
    // Onigiri
    patrolDir: 1,
    // Shrimp
    hopTimer: config.hopDelay || 2,
    hopInterval: config.hopDelay || 2,
    hopForce: config.hopForce || -7,
    onGround: true,
    // Animation
    animTimer: 0,
    squashX: 1,
    squashY: 1,
  };
}

export function updateEnemy(enemy, level, dt) {
  if (!enemy.active) return;

  enemy.animTimer += dt;

  switch (enemy.type) {
    case ENEMY_TYPE.ONIGIRI:
      updateOnigiri(enemy, level, dt);
      break;
    case ENEMY_TYPE.SHRIMP:
      updateShrimp(enemy, level, dt);
      break;
    case ENEMY_TYPE.WASABI:
      // Stationary, just wobble
      enemy.squashX = 1 + Math.sin(enemy.animTimer * 3) * 0.05;
      enemy.squashY = 1 - Math.sin(enemy.animTimer * 3) * 0.05;
      break;
  }
}

function updateOnigiri(enemy, level, dt) {
  enemy.x += enemy.vx * enemy.patrolDir;
  enemy.facing = enemy.patrolDir;

  // Reverse at range limits
  if (Math.abs(enemy.x - enemy.startX) > enemy.range) {
    enemy.patrolDir *= -1;
    enemy.x = enemy.startX + enemy.range * enemy.patrolDir;
  }

  // Reverse at walls
  const col = Math.floor((enemy.x + (enemy.patrolDir > 0 ? enemy.w : 0)) / TILE_SIZE);
  const row = Math.floor((enemy.y + enemy.h / 2) / TILE_SIZE);
  if (isSolid(getTile(level, col, row))) {
    enemy.patrolDir *= -1;
  }

  // Reverse at edges (don't walk off platforms)
  const edgeCol = Math.floor((enemy.x + (enemy.patrolDir > 0 ? enemy.w : 0)) / TILE_SIZE);
  const belowRow = Math.floor((enemy.y + enemy.h + 2) / TILE_SIZE);
  if (!isSolid(getTile(level, edgeCol, belowRow))) {
    enemy.patrolDir *= -1;
  }

  // Wobble animation
  enemy.squashX = 1 + Math.sin(enemy.animTimer * 6) * 0.08;
  enemy.squashY = 1 - Math.sin(enemy.animTimer * 6) * 0.08;
}

function updateShrimp(enemy, level, dt) {
  // Gravity
  enemy.vy += 0.5;
  enemy.vy = Math.min(enemy.vy, 10);
  enemy.y += enemy.vy;

  // Ground check
  const row = Math.floor((enemy.y + enemy.h) / TILE_SIZE);
  const col = Math.floor((enemy.x + enemy.w / 2) / TILE_SIZE);
  if (isSolid(getTile(level, col, row))) {
    enemy.y = row * TILE_SIZE - enemy.h;
    enemy.vy = 0;
    enemy.onGround = true;
  } else {
    enemy.onGround = false;
  }

  // Hop timer
  if (enemy.onGround) {
    enemy.hopTimer -= dt;
    if (enemy.hopTimer <= 0) {
      enemy.vy = enemy.hopForce;
      enemy.hopTimer = enemy.hopInterval;
      enemy.onGround = false;
      enemy.squashX = 0.7;
      enemy.squashY = 1.3;
    }
  }

  // Squash animation
  enemy.squashX += (1 - enemy.squashX) * 8 * dt;
  enemy.squashY += (1 - enemy.squashY) * 8 * dt;
}

export function checkPlayerEnemyCollision(player, enemy) {
  if (!enemy.active || player.dead) return null;
  if (player.state === 'respawn') return null;

  const px = player.x, py = player.y, pw = player.w, ph = player.h;
  const ex = enemy.x, ey = enemy.y, ew = enemy.w, eh = enemy.h;

  // AABB overlap check
  if (px < ex + ew && px + pw > ex && py < ey + eh && py + ph > ey) {
    if (enemy.type === ENEMY_TYPE.WASABI) {
      return 'bounce_up';
    }
    return 'hurt';
  }
  return null;
}
