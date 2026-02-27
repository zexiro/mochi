import { TILE, TILE_SIZE, isSolid } from '../levels/tiles.js';
import { getTile } from '../engine/collision.js';

export function renderTiles(ctx, level, cam, palette, crumbleMap) {
  const startCol = Math.max(0, Math.floor(cam.x / TILE_SIZE) - 1);
  const endCol = Math.min(level.cols - 1, Math.floor((cam.x + cam.viewW) / TILE_SIZE) + 1);
  const startRow = Math.max(0, Math.floor(cam.y / TILE_SIZE) - 1);
  const endRow = Math.min(level.rows - 1, Math.floor((cam.y + cam.viewH) / TILE_SIZE) + 1);

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const tile = level.tiles[row][col];
      if (tile === TILE.EMPTY) continue;

      const x = col * TILE_SIZE - cam.x;
      const y = row * TILE_SIZE - cam.y;

      switch (tile) {
        case TILE.SOLID:
          drawSolidTile(ctx, x, y, level, col, row, palette);
          break;
        case TILE.PLATFORM:
          drawPlatform(ctx, x, y, palette);
          break;
        case TILE.SPIKE:
          drawSpike(ctx, x, y, palette);
          break;
        case TILE.CRUMBLE:
          drawCrumble(ctx, x, y, palette, crumbleMap, col, row);
          break;
        case TILE.BOUNCE:
          drawBounce(ctx, x, y, palette);
          break;
        case TILE.ICE:
          drawIce(ctx, x, y, level, col, row);
          break;
        case TILE.CONVEYOR_L:
          drawConveyor(ctx, x, y, palette, -1);
          break;
        case TILE.CONVEYOR_R:
          drawConveyor(ctx, x, y, palette, 1);
          break;
      }
    }
  }
}

function drawSolidTile(ctx, x, y, level, col, row, palette) {
  const above = getTile(level, col, row - 1);
  const isTop = !isSolid(above) && above !== TILE.ICE;

  ctx.fillStyle = isTop ? palette.groundTop : palette.ground;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  if (isTop) {
    // Grass tuft top
    ctx.fillStyle = palette.groundTop;
    roundedRect(ctx, x, y, TILE_SIZE, TILE_SIZE, 4, true);

    // Subtle grass blades
    ctx.fillStyle = palette.accent;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      const bx = x + 6 + i * 10;
      ctx.fillRect(bx, y - 2, 2, 4);
    }
    ctx.globalAlpha = 1;
  } else {
    // Inner texture
    ctx.fillStyle = palette.groundDark;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    ctx.globalAlpha = 1;
  }
}

function drawPlatform(ctx, x, y, palette) {
  const h = 10;
  ctx.fillStyle = palette.platformColor;
  roundedRect(ctx, x + 2, y, TILE_SIZE - 4, h, 3);
  ctx.fillStyle = palette.platformTop;
  ctx.fillRect(x + 2, y, TILE_SIZE - 4, 3);
}

function drawSpike(ctx, x, y, palette) {
  ctx.fillStyle = '#C0392B';
  const s = TILE_SIZE;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + s);
  ctx.lineTo(x + s / 4, y + 6);
  ctx.lineTo(x + s / 2 - 2, y + s);
  ctx.moveTo(x + s / 2 + 2, y + s);
  ctx.lineTo(x + s * 3 / 4, y + 6);
  ctx.lineTo(x + s - 4, y + s);
  ctx.fill();

  ctx.fillStyle = '#E74C3C';
  ctx.beginPath();
  ctx.moveTo(x + s / 4, y + 6);
  ctx.lineTo(x + s / 4 + 2, y + 10);
  ctx.lineTo(x + s / 4 - 2, y + 10);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + s * 3 / 4, y + 6);
  ctx.lineTo(x + s * 3 / 4 + 2, y + 10);
  ctx.lineTo(x + s * 3 / 4 - 2, y + 10);
  ctx.closePath();
  ctx.fill();
}

function drawCrumble(ctx, x, y, palette, crumbleMap, col, row) {
  const key = `${col},${row}`;
  const crumble = crumbleMap && crumbleMap[key];

  if (crumble && crumble.broken) return;

  let alpha = 1;
  if (crumble) {
    alpha = crumble.timer / 0.5;
    const shake = (1 - alpha) * 3;
    x += (Math.random() - 0.5) * shake;
    y += (Math.random() - 0.5) * shake;
  }

  ctx.globalAlpha = alpha;
  ctx.fillStyle = palette.platformColor;
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = palette.groundDark;
  ctx.lineWidth = 1;

  roundedRect(ctx, x + 2, y, TILE_SIZE - 4, 10, 3);
  ctx.strokeRect(x + 2, y, TILE_SIZE - 4, 10);

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

function drawBounce(ctx, x, y, palette) {
  const s = TILE_SIZE;
  // Spring base
  ctx.fillStyle = '#FFD700';
  roundedRect(ctx, x + 4, y + s - 10, s - 8, 10, 3);

  // Spring coil
  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const coilY = y + s - 10;
  for (let i = 0; i < 3; i++) {
    const cy = coilY - 4 - i * 5;
    ctx.moveTo(x + 8, cy);
    ctx.quadraticCurveTo(x + s / 2, cy - 4, x + s - 8, cy);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawIce(ctx, x, y, level, col, row) {
  const above = getTile(level, col, row - 1);
  const isTop = !isSolid(above);

  ctx.fillStyle = isTop ? '#B8E0F0' : '#90C8E0';
  roundedRect(ctx, x, y, TILE_SIZE, TILE_SIZE, isTop ? 4 : 0);

  // Shine
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x + 4, y + 4, 6, 3);
  ctx.fillRect(x + 14, y + 8, 4, 2);
}

function drawConveyor(ctx, x, y, palette, dir) {
  const s = TILE_SIZE;

  // Belt base
  ctx.fillStyle = '#606060';
  ctx.fillRect(x, y, s, s);

  // Belt surface
  ctx.fillStyle = '#808080';
  roundedRect(ctx, x + 1, y + 1, s - 2, s - 2, 3);

  // Animated arrows
  const t = (Date.now() / 300) % s;
  ctx.fillStyle = '#FFD700';
  ctx.globalAlpha = 0.6;
  for (let i = -1; i < 3; i++) {
    const ax = dir > 0
      ? x + ((i * 12 + t) % s)
      : x + s - ((i * 12 + t) % s);
    const ay = y + s / 2;
    ctx.beginPath();
    ctx.moveTo(ax + dir * 4, ay);
    ctx.lineTo(ax - dir * 2, ay - 4);
    ctx.lineTo(ax - dir * 2, ay + 4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Edge lines
  ctx.fillStyle = '#505050';
  ctx.fillRect(x, y, s, 2);
  ctx.fillRect(x, y + s - 2, s, 2);
}

function roundedRect(ctx, x, y, w, h, r, topOnly = false) {
  ctx.beginPath();
  if (topOnly) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.arcTo(x, y, x + w, y, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
  }
  ctx.closePath();
  ctx.fill();
}
