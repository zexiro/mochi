export const COLLECTIBLE_TYPE = {
  DANGO: 'dango',
  CHECKPOINT: 'checkpoint',
  GOAL: 'goal',
};

export function createCollectible(type, x, y, id) {
  return {
    type,
    x, y,
    w: type === COLLECTIBLE_TYPE.GOAL ? 40 : 20,
    h: type === COLLECTIBLE_TYPE.GOAL ? 48 : 20,
    id: id || `${type}_${x}_${y}`,
    collected: false,
    activated: false,
    animTimer: Math.random() * Math.PI * 2,
  };
}

export function updateCollectible(col, dt) {
  col.animTimer += dt;
}

export function checkPlayerCollectible(player, col) {
  if (col.collected) return false;
  if (player.dead || player.state === 'respawn') return false;

  const px = player.x, py = player.y, pw = player.w, ph = player.h;
  const cx = col.x, cy = col.y, cw = col.w, ch = col.h;

  return px < cx + cw && px + pw > cx && py < cy + ch && py + ph > cy;
}
