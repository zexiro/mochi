import { clamp, approach } from '../utils/math.js';
import { resolveCollisionX, resolveCollisionY, checkSpikeOverlap } from '../engine/collision.js';
import { emit } from '../engine/particles.js';
import { TILE_SIZE } from '../levels/tiles.js';

const GRAVITY = 0.55;
const MAX_FALL = 10;
const MOVE_SPEED = 3.2;
const MOVE_ACCEL = 0.45;
const MOVE_DECEL = 0.55;
const ICE_ACCEL = 0.12;
const ICE_DECEL = 0.08;
const JUMP_FORCE = -9.5;
const JUMP_CUT = 0.45;
const APEX_GRAVITY_MULT = 0.5;
const APEX_THRESHOLD = 2.0;
const WALL_SLIDE_SPEED = 1.5;
const WALL_JUMP_X = 5.5;
const WALL_JUMP_Y = -9;
const COYOTE_TIME = 0.1;
const JUMP_BUFFER = 0.1;
const GROUND_POUND_SPEED = 12;
const GROUND_POUND_BOUNCE = -8;
const BOUNCE_PAD_FORCE = -14;

export const STATE = {
  IDLE: 'idle',
  RUN: 'run',
  JUMP: 'jump',
  FALL: 'fall',
  WALL_SLIDE: 'wallSlide',
  GROUND_POUND: 'groundPound',
  RESPAWN: 'respawn',
};

export function createPlayer(x, y) {
  return {
    x, y,
    w: 22, h: 22,
    vx: 0, vy: 0,
    state: STATE.IDLE,
    facing: 1,
    onGround: false,
    touchingLeft: false,
    touchingRight: false,
    hitCeiling: false,
    onBounce: false,
    onSpike: false,
    onIce: false,
    onCrumble: false,
    coyoteTimer: 0,
    jumpBuffer: 0,
    wallJumpTimer: 0,
    groundPounding: false,
    // Animation
    squashX: 1,
    squashY: 1,
    squashTarget: [1, 1],
    eyeOffsetX: 0,
    runFrame: 0,
    idleTimer: 0,
    // Respawn
    respawnTimer: 0,
    checkpointX: x,
    checkpointY: y,
    dead: false,
    // Stats
    dango: [],
  };
}

export function updatePlayer(player, input, level, crumbleMap, dt) {
  if (player.state === STATE.RESPAWN) {
    player.respawnTimer -= dt;
    if (player.respawnTimer <= 0) {
      player.state = STATE.IDLE;
      player.dead = false;
      player.x = player.checkpointX;
      player.y = player.checkpointY;
      player.vx = 0;
      player.vy = 0;
      player.squashTarget = [1.3, 0.7];
    }
    return;
  }

  const wasOnGround = player.onGround;

  // Horizontal movement
  const accel = player.onIce ? ICE_ACCEL : MOVE_ACCEL;
  const decel = player.onIce ? ICE_DECEL : MOVE_DECEL;

  if (player.wallJumpTimer > 0) {
    player.wallJumpTimer -= dt;
  }

  if (player.wallJumpTimer <= 0) {
    if (input.left) {
      player.vx = approach(player.vx, -MOVE_SPEED, accel);
      player.facing = -1;
    } else if (input.right) {
      player.vx = approach(player.vx, MOVE_SPEED, accel);
      player.facing = 1;
    } else {
      player.vx = approach(player.vx, 0, decel);
    }
  }

  // Ground pound
  if (player.groundPounding) {
    player.vx = 0;
    player.vy = GROUND_POUND_SPEED;
  } else {
    // Gravity with apex slowdown
    let grav = GRAVITY;
    if (Math.abs(player.vy) < APEX_THRESHOLD && !player.onGround) {
      grav *= APEX_GRAVITY_MULT;
    }
    player.vy += grav;
    player.vy = Math.min(player.vy, MAX_FALL);
  }

  // Wall slide
  const touchingWall = player.touchingLeft || player.touchingRight;
  const holdingTowardWall = (player.touchingLeft && input.left) || (player.touchingRight && input.right);

  if (!player.onGround && touchingWall && holdingTowardWall && player.vy > 0 && !player.groundPounding) {
    player.vy = Math.min(player.vy, WALL_SLIDE_SPEED);
    player.state = STATE.WALL_SLIDE;
  }

  // Coyote time
  if (player.onGround) {
    player.coyoteTimer = COYOTE_TIME;
  } else {
    player.coyoteTimer -= dt;
  }

  // Jump buffer
  if (input.jumpPressed) {
    player.jumpBuffer = JUMP_BUFFER;
  } else {
    player.jumpBuffer -= dt;
  }

  // Start ground pound
  if (input.down && !player.onGround && !player.groundPounding && player.vy >= 0) {
    player.groundPounding = true;
    player.vy = 0;
    player.vx = 0;
    player.squashTarget = [0.7, 1.4];
    emit(player.x + player.w / 2, player.y, 4, {
      spreadX: 10, vy: -2, randomVx: 4, randomVy: -1,
      life: 0.3, size: 3, color: '#FFE4B5', gravity: 0,
    });
  }

  // Jump
  if (player.jumpBuffer > 0) {
    // Wall jump
    if (!player.onGround && player.coyoteTimer <= 0 && touchingWall && !player.groundPounding) {
      const dir = player.touchingLeft ? 1 : -1;
      player.vx = WALL_JUMP_X * dir;
      player.vy = WALL_JUMP_Y;
      player.facing = dir;
      player.wallJumpTimer = 0.15;
      player.jumpBuffer = 0;
      player.coyoteTimer = 0;
      player.squashTarget = [0.7, 1.3];
      emit(player.x + (dir < 0 ? player.w : 0), player.y + player.h / 2, 5, {
        vx: -dir * 2, spreadY: 10, randomVx: 1, randomVy: 2,
        life: 0.3, size: 3, color: '#FFF', gravity: 0,
      });
    }
    // Normal jump
    else if (player.coyoteTimer > 0 && !player.groundPounding) {
      player.vy = JUMP_FORCE;
      player.jumpBuffer = 0;
      player.coyoteTimer = 0;
      player.onGround = false;
      player.squashTarget = [0.75, 1.3];
      emit(player.x + player.w / 2, player.y + player.h, 6, {
        spreadX: 14, vy: 1, randomVx: 3, randomVy: 0.5,
        life: 0.35, size: 3, color: '#E8DCC8', gravity: 2,
      });
    }
  }

  // Variable jump height
  if (input.jumpReleased && player.vy < 0 && !player.groundPounding) {
    player.vy *= JUMP_CUT;
  }

  // Move and collide
  player.touchingLeft = false;
  player.touchingRight = false;

  player.x += player.vx;
  resolveCollisionX(player, level);

  player.y += player.vy;
  resolveCollisionY(player, level, crumbleMap);

  // Bounce pad
  if (player.onBounce) {
    player.vy = player.groundPounding ? GROUND_POUND_BOUNCE * 1.5 : BOUNCE_PAD_FORCE;
    player.groundPounding = false;
    player.onGround = false;
    player.squashTarget = [0.6, 1.5];
  }

  // Ground pound landing
  if (player.onGround && player.groundPounding) {
    player.groundPounding = false;
    player.vy = GROUND_POUND_BOUNCE;
    player.onGround = false;
    player.squashTarget = [1.6, 0.5];
    emit(player.x + player.w / 2, player.y + player.h, 10, {
      spreadX: 5, vx: 0, vy: -1, randomVx: 5, randomVy: -2,
      life: 0.4, size: 4, color: '#FFE4B5', gravity: 5,
    });
  }

  // Landing squash
  if (player.onGround && !wasOnGround && !player.groundPounding) {
    player.squashTarget = [1.3, 0.7];
    emit(player.x + player.w / 2, player.y + player.h, 4, {
      spreadX: 8, vy: 0.5, randomVx: 2, randomVy: 0,
      life: 0.25, size: 2, color: '#E8DCC8', gravity: 3,
    });
  }

  // Spike/pit death
  if (player.onSpike || checkSpikeOverlap(player, level) || player.y > level.rows * TILE_SIZE + 64) {
    killPlayer(player);
    return;
  }

  // Clamp to level bounds horizontally
  player.x = clamp(player.x, 0, level.cols * TILE_SIZE - player.w);

  // Update state
  if (player.groundPounding) {
    player.state = STATE.GROUND_POUND;
  } else if (player.state === STATE.WALL_SLIDE) {
    if (player.onGround || !touchingWall || !holdingTowardWall) {
      player.state = player.onGround ? STATE.IDLE : STATE.FALL;
    }
  } else if (player.onGround) {
    player.state = Math.abs(player.vx) > 0.3 ? STATE.RUN : STATE.IDLE;
  } else {
    player.state = player.vy < 0 ? STATE.JUMP : STATE.FALL;
  }

  // Animation
  updateSquash(player, dt);
  player.eyeOffsetX = player.facing * 2;
  if (player.state === STATE.RUN) {
    player.runFrame += Math.abs(player.vx) * dt * 8;
  }
  if (player.state === STATE.IDLE) {
    player.idleTimer += dt;
  } else {
    player.idleTimer = 0;
  }
}

function updateSquash(player, dt) {
  const speed = 12;
  player.squashX += (player.squashTarget[0] - player.squashX) * speed * dt;
  player.squashY += (player.squashTarget[1] - player.squashY) * speed * dt;

  if (Math.abs(player.squashX - player.squashTarget[0]) < 0.02) {
    player.squashTarget = [1, 1];
  }
}

export function killPlayer(player) {
  if (player.dead) return;
  player.dead = true;
  player.state = STATE.RESPAWN;
  player.respawnTimer = 0.5;
  player.vx = 0;
  player.vy = 0;
  emit(player.x + player.w / 2, player.y + player.h / 2, 15, {
    spreadX: 5, spreadY: 5, randomVx: 6, randomVy: 6,
    life: 0.5, size: 4, color: '#FFF5E6', gravity: 3,
  });
}

export function setCheckpoint(player, x, y) {
  player.checkpointX = x;
  player.checkpointY = y;
}
