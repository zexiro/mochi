export const TILE = {
  EMPTY: 0,
  SOLID: 1,
  PLATFORM: 2,    // one-way, pass through from below
  SPIKE: 3,
  CRUMBLE: 4,     // breaks after standing on it briefly
  BOUNCE: 5,      // launches player upward
  ICE: 6,         // slippery
  CONVEYOR_L: 7,  // pushes player left
  CONVEYOR_R: 8,  // pushes player right
};

export const TILE_SIZE = 32;

export function isSolid(tile) {
  return tile === TILE.SOLID || tile === TILE.ICE;
}

export function isPlatform(tile) {
  return tile === TILE.PLATFORM || tile === TILE.CRUMBLE;
}

export function isSpike(tile) {
  return tile === TILE.SPIKE;
}

export function isBounce(tile) {
  return tile === TILE.BOUNCE;
}

export function isCrumble(tile) {
  return tile === TILE.CRUMBLE;
}

export function isConveyorL(tile) {
  return tile === TILE.CONVEYOR_L;
}

export function isConveyorR(tile) {
  return tile === TILE.CONVEYOR_R;
}

export function isConveyor(tile) {
  return tile === TILE.CONVEYOR_L || tile === TILE.CONVEYOR_R;
}
