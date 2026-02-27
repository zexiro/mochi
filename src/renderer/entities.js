import { STATE } from '../entities/player.js';
import { ENEMY_TYPE } from '../entities/enemy.js';
import { COLLECTIBLE_TYPE } from '../entities/collectible.js';

export function renderPlayer(ctx, player, camX, camY) {
  if (player.state === STATE.RESPAWN) {
    // Blink during respawn
    if (Math.floor(player.respawnTimer * 10) % 2 === 0) return;
  }

  const cx = player.x + player.w / 2 - camX;
  const cy = player.y + player.h / 2 - camY;
  const baseR = 11;

  ctx.save();
  ctx.translate(cx, cy);

  // Apply squash/stretch
  ctx.scale(player.squashX, player.squashY);

  // Lean into movement
  const lean = player.vx * 0.02;
  ctx.rotate(lean);

  // Run bob
  let bobY = 0;
  if (player.state === STATE.RUN) {
    bobY = Math.sin(player.runFrame) * 1.5;
  }
  // Idle breathing
  if (player.state === STATE.IDLE) {
    bobY = Math.sin(player.idleTimer * 2) * 0.8;
  }

  // Body (soft mochi shape)
  ctx.fillStyle = '#FFF5E6';
  ctx.beginPath();
  ctx.ellipse(0, bobY, baseR, baseR - 1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle outline
  ctx.strokeStyle = '#E8D5B7';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Blush
  ctx.fillStyle = 'rgba(255,183,197,0.45)';
  ctx.beginPath();
  ctx.ellipse(-7, 3 + bobY, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(7, 3 + bobY, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = -2 + bobY;
  const blinkCycle = player.idleTimer > 0 ? Math.sin(player.idleTimer * 0.8) : 0;
  const blinking = blinkCycle > 0.97;

  ctx.fillStyle = '#2D2D2D';
  if (blinking) {
    // Blink (horizontal lines)
    ctx.fillRect(-6 + player.eyeOffsetX, eyeY, 4, 1.5);
    ctx.fillRect(2 + player.eyeOffsetX, eyeY, 4, 1.5);
  } else {
    // Normal eyes
    ctx.beginPath();
    ctx.arc(-4 + player.eyeOffsetX, eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(4 + player.eyeOffsetX, eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlights
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(-4.5 + player.eyeOffsetX, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(3.5 + player.eyeOffsetX, eyeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mouth
  ctx.strokeStyle = '#2D2D2D';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (player.state === STATE.FALL || player.state === STATE.GROUND_POUND) {
    // Surprised "o" mouth
    ctx.arc(0 + player.eyeOffsetX * 0.5, 4 + bobY, 2, 0, Math.PI * 2);
    ctx.stroke();
  } else if (player.state === STATE.JUMP) {
    // Happy open mouth
    ctx.arc(0 + player.eyeOffsetX * 0.5, 3 + bobY, 3, 0, Math.PI);
    ctx.stroke();
  } else {
    // Gentle smile
    ctx.moveTo(-3 + player.eyeOffsetX * 0.5, 4 + bobY);
    ctx.quadraticCurveTo(0 + player.eyeOffsetX * 0.5, 7 + bobY, 3 + player.eyeOffsetX * 0.5, 4 + bobY);
    ctx.stroke();
  }

  ctx.restore();
}

export function renderEnemy(ctx, enemy, camX, camY) {
  if (!enemy.active) return;

  const cx = enemy.x + enemy.w / 2 - camX;
  const cy = enemy.y + enemy.h / 2 - camY;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(enemy.squashX * enemy.facing, enemy.squashY);

  switch (enemy.type) {
    case ENEMY_TYPE.ONIGIRI:
      drawOnigiri(ctx);
      break;
    case ENEMY_TYPE.SHRIMP:
      drawShrimp(ctx, enemy.animTimer);
      break;
    case ENEMY_TYPE.WASABI:
      drawWasabi(ctx, enemy.animTimer);
      break;
    case ENEMY_TYPE.TAIYAKI:
      drawTaiyaki(ctx, enemy.animTimer);
      break;
  }

  ctx.restore();
}

function drawOnigiri(ctx) {
  // Rice ball triangle shape
  ctx.fillStyle = '#FFF8F0';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.quadraticCurveTo(14, -4, 12, 10);
  ctx.quadraticCurveTo(0, 14, -12, 10);
  ctx.quadraticCurveTo(-14, -4, 0, -12);
  ctx.fill();
  ctx.strokeStyle = '#E0D0C0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Nori (seaweed band)
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(-8, 2, 16, 8);
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(-8, 2, 16, 3);

  // Eyes
  ctx.fillStyle = '#2D2D2D';
  ctx.beginPath();
  ctx.arc(-3, -2, 1.5, 0, Math.PI * 2);
  ctx.arc(3, -2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = '#2D2D2D';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-6, -5);
  ctx.lineTo(-2, -4);
  ctx.moveTo(6, -5);
  ctx.lineTo(2, -4);
  ctx.stroke();
}

function drawShrimp(ctx, t) {
  // Shrimp body (curved)
  ctx.fillStyle = '#FF8C69';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stripes
  ctx.strokeStyle = '#FF6347';
  ctx.lineWidth = 1.5;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 5, -6);
    ctx.lineTo(i * 5, 6);
    ctx.stroke();
  }

  // Tail
  ctx.fillStyle = '#FF6347';
  ctx.beginPath();
  ctx.moveTo(-10, -3);
  ctx.lineTo(-16, -6);
  ctx.lineTo(-16, 6);
  ctx.lineTo(-10, 3);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#2D2D2D';
  ctx.beginPath();
  ctx.arc(5, -3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(4.5, -3.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Legs (animated)
  ctx.strokeStyle = '#FF8C69';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const lx = -3 + i * 5;
    const legBend = Math.sin(t * 8 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(lx, 7);
    ctx.lineTo(lx + legBend, 12);
    ctx.stroke();
  }
}

function drawWasabi(ctx, t) {
  const wobble = Math.sin(t * 3) * 2;

  // Blob body
  ctx.fillStyle = '#7BC67E';
  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.quadraticCurveTo(-12, -2, -4 + wobble, -10);
  ctx.quadraticCurveTo(0, -14, 4 - wobble, -10);
  ctx.quadraticCurveTo(12, -2, 10, 10);
  ctx.quadraticCurveTo(0, 12, -10, 10);
  ctx.fill();

  // Lighter highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.ellipse(-3 + wobble * 0.5, -4, 4, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (angry/cute)
  ctx.fillStyle = '#2D2D2D';
  ctx.beginPath();
  ctx.arc(-3, 0, 2, 0, Math.PI * 2);
  ctx.arc(3, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // Steam lines
  ctx.strokeStyle = 'rgba(123,198,126,0.5)';
  ctx.lineWidth = 1;
  for (let i = -1; i <= 1; i++) {
    const sx = i * 5;
    ctx.beginPath();
    ctx.moveTo(sx, -12);
    ctx.quadraticCurveTo(sx + Math.sin(t * 2 + i) * 3, -18, sx, -22);
    ctx.stroke();
  }
}

function drawTaiyaki(ctx, t) {
  // Fish-shaped body
  ctx.fillStyle = '#D4903C';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail fin
  ctx.fillStyle = '#C07830';
  ctx.beginPath();
  ctx.moveTo(-10, -2);
  ctx.lineTo(-17, -7);
  ctx.lineTo(-17, 7);
  ctx.lineTo(-10, 2);
  ctx.fill();

  // Red bean filling visible (belly line)
  ctx.fillStyle = '#8B3A3A';
  ctx.beginPath();
  ctx.ellipse(2, 2, 6, 3, 0, 0, Math.PI);
  ctx.fill();

  // Scale pattern
  ctx.strokeStyle = '#B87028';
  ctx.lineWidth = 0.5;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(i * 5, -1, 3, 0, Math.PI);
    ctx.stroke();
  }

  // Eye
  ctx.fillStyle = '#2D2D2D';
  ctx.beginPath();
  ctx.arc(7, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(6.5, -2.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Dorsal fin
  ctx.fillStyle = '#C07830';
  ctx.beginPath();
  ctx.moveTo(-2, -7);
  ctx.quadraticCurveTo(2, -12 + Math.sin(t * 6) * 2, 6, -7);
  ctx.fill();
}

export function renderCollectible(ctx, col, camX, camY) {
  if (col.collected) return;

  const cx = col.x + col.w / 2 - camX;
  const cy = col.y + col.h / 2 - camY;
  const bob = Math.sin(col.animTimer * 3) * 3;

  ctx.save();
  ctx.translate(cx, cy + bob);

  switch (col.type) {
    case COLLECTIBLE_TYPE.DANGO:
      drawDango(ctx, col.animTimer);
      break;
    case COLLECTIBLE_TYPE.CHECKPOINT:
      drawCheckpoint(ctx, col.activated);
      break;
    case COLLECTIBLE_TYPE.GOAL:
      drawGoal(ctx, col.animTimer);
      break;
  }

  ctx.restore();
}

function drawDango(ctx, t) {
  const glow = 0.3 + Math.sin(t * 4) * 0.15;

  // Glow
  ctx.fillStyle = `rgba(255,215,0,${glow})`;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  // Stick
  ctx.strokeStyle = '#C8A951';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(0, 8);
  ctx.stroke();

  // Three dango balls
  const colors = ['#FFB7C5', '#FFF5E6', '#7BC67E'];
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(0, -6 + i * 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

function drawCheckpoint(ctx, activated) {
  // Flag pole
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(0, -12);
  ctx.stroke();

  // Flag
  ctx.fillStyle = activated ? '#FF6B35' : '#AAA';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(12, -8);
  ctx.lineTo(0, -4);
  ctx.fill();

  // Base
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(-4, 10, 8, 4);
}

function drawGoal(ctx, t) {
  const glow = 0.5 + Math.sin(t * 2) * 0.2;

  // Torii gate
  ctx.fillStyle = '#C0392B';

  // Pillars
  ctx.fillRect(-18, -20, 4, 44);
  ctx.fillRect(14, -20, 4, 44);

  // Top beam
  ctx.fillRect(-22, -20, 44, 5);

  // Bottom beam
  ctx.fillRect(-18, -10, 36, 3);

  // Glow effect
  ctx.fillStyle = `rgba(255,215,0,${glow * 0.3})`;
  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fill();
}
