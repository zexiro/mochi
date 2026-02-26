const MAX_PARTICLES = 80;

const pool = [];
let active = 0;

function getParticle() {
  if (active < MAX_PARTICLES) {
    if (active >= pool.length) {
      pool.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: '', type: 'circle', gravity: 0 });
    }
    return pool[active++];
  }
  return null;
}

export function emit(x, y, count, config) {
  for (let i = 0; i < count; i++) {
    const p = getParticle();
    if (!p) return;
    p.x = x + (config.spreadX || 0) * (Math.random() - 0.5);
    p.y = y + (config.spreadY || 0) * (Math.random() - 0.5);
    p.vx = (config.vx || 0) + (config.randomVx || 0) * (Math.random() - 0.5);
    p.vy = (config.vy || 0) + (config.randomVy || 0) * (Math.random() - 0.5);
    p.life = config.life || 0.5;
    p.maxLife = p.life;
    p.size = config.size || 3;
    p.color = config.color || '#FFF';
    p.type = config.type || 'circle';
    p.gravity = config.gravity || 0;
  }
}

export function updateParticles(dt) {
  for (let i = active - 1; i >= 0; i--) {
    const p = pool[i];
    p.life -= dt;
    if (p.life <= 0) {
      active--;
      if (i < active) {
        const temp = pool[i];
        pool[i] = pool[active];
        pool[active] = temp;
      }
      continue;
    }
    p.vy += p.gravity * dt;
    p.x += p.vx * dt * 60;
    p.y += p.vy * dt * 60;
  }
}

export function renderParticles(ctx, camX, camY) {
  for (let i = 0; i < active; i++) {
    const p = pool[i];
    const alpha = p.life / p.maxLife;
    const sz = p.size * alpha;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.type === 'circle') {
      ctx.beginPath();
      ctx.arc(p.x - camX, p.y - camY, sz, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(p.x - camX - sz / 2, p.y - camY - sz / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1;
}

export function clearParticles() {
  active = 0;
}
