export const TILE = {
  EMPTY: 0,
  SOLID: 1,
  PLATFORM: 2,    // one-way, pass through from below
  SPIKE: 3,
  CRUMBLE: 4,     // breaks after standing on it briefly
  BOUNCE: 5,      // launches player upward
  ICE: 6,         // slippery
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
