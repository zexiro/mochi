export function renderBackground(ctx, cam, palette, viewW, viewH) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, viewH);
  grad.addColorStop(0, palette.skyTop);
  grad.addColorStop(1, palette.skyBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, viewW, viewH);

  // Far hills (slow parallax)
  renderHills(ctx, cam.x * 0.1, viewH, palette.hillFar, 0.6, 120, 200);

  // Near hills (medium parallax)
  renderHills(ctx, cam.x * 0.3, viewH, palette.hillNear, 0.8, 80, 150);

  // Decorative elements
  if (palette.clouds) {
    renderClouds(ctx, cam.x * 0.15, viewW, palette.cloudColor);
  }
}

function renderHills(ctx, scrollX, viewH, color, heightFactor, period, amplitude) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, viewH);

  const baseY = viewH * heightFactor;
  for (let x = -20; x <= ctx.canvas.width / (ctx.canvas.width > 0 ? 1 : 1) + 20; x += 10) {
    const worldX = x + scrollX;
    const y = baseY
      - Math.sin(worldX / period) * amplitude * 0.5
      - Math.sin(worldX / (period * 0.6)) * amplitude * 0.3
      - Math.cos(worldX / (period * 1.7)) * amplitude * 0.2;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(ctx.canvas.width + 20, viewH);
  ctx.closePath();
  ctx.fill();
}

function renderClouds(ctx, scrollX, viewW, color) {
  ctx.fillStyle = color;
  const clouds = [
    { x: 100, y: 40, r: 25 },
    { x: 300, y: 60, r: 20 },
    { x: 550, y: 35, r: 30 },
    { x: 800, y: 55, r: 22 },
    { x: 1100, y: 45, r: 28 },
    { x: 1400, y: 65, r: 18 },
  ];

  for (const c of clouds) {
    const sx = ((c.x - scrollX) % (viewW + 200)) - 100;
    ctx.beginPath();
    ctx.arc(sx, c.y, c.r, 0, Math.PI * 2);
    ctx.arc(sx - c.r * 0.6, c.y + 4, c.r * 0.7, 0, Math.PI * 2);
    ctx.arc(sx + c.r * 0.7, c.y + 3, c.r * 0.65, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Palettes per level
export const PALETTES = {
  1: {
    skyTop: '#87CEEB',
    skyBottom: '#C8E6F0',
    hillFar: '#8FBC8F',
    hillNear: '#7DAF7D',
    cloudColor: 'rgba(255,255,255,0.6)',
    clouds: true,
    ground: '#6B8E23',
    groundTop: '#7DAF7D',
    groundDark: '#556B2F',
    accent: '#FFB7C5',
    platformColor: '#8FBC8F',
    platformTop: '#A8D8A8',
  },
  2: {
    skyTop: '#5F9EA0',
    skyBottom: '#8FBC8F',
    hillFar: '#2D5016',
    hillNear: '#3A6B1E',
    cloudColor: 'rgba(200,220,180,0.4)',
    clouds: true,
    ground: '#5D4E37',
    groundTop: '#7A6B52',
    groundDark: '#3E3428',
    accent: '#C8A951',
    platformColor: '#6B8E23',
    platformTop: '#7DAF7D',
  },
  3: {
    skyTop: '#E8E0F0',
    skyBottom: '#F5F0FF',
    hillFar: '#D8D0E8',
    hillNear: '#C8C0D8',
    cloudColor: 'rgba(255,255,255,0.8)',
    clouds: true,
    ground: '#B0A0C0',
    groundTop: '#C8B8D8',
    groundDark: '#9888A8',
    accent: '#FFD1DC',
    platformColor: '#C8B8D8',
    platformTop: '#E0D0F0',
  },
  4: {
    skyTop: '#0D1B2A',
    skyBottom: '#1A1A2E',
    hillFar: '#16213E',
    hillNear: '#1A1A3E',
    cloudColor: 'rgba(100,80,140,0.3)',
    clouds: false,
    ground: '#2A1A3E',
    groundTop: '#3A2A4E',
    groundDark: '#1A0A2E',
    accent: '#FF6B35',
    platformColor: '#2A2A4E',
    platformTop: '#3A3A5E',
  },
  5: {
    skyTop: '#0D1B2A',
    skyBottom: '#1B2838',
    hillFar: '#162232',
    hillNear: '#1B2838',
    cloudColor: 'rgba(180,200,230,0.2)',
    clouds: true,
    ground: '#2A3040',
    groundTop: '#3A4050',
    groundDark: '#1A2030',
    accent: '#E0BBE4',
    platformColor: '#2A3050',
    platformTop: '#3A4060',
  },
  6: {
    skyTop: '#B0D4E8',
    skyBottom: '#D4E8F0',
    hillFar: '#8AB8D0',
    hillNear: '#78A8C0',
    cloudColor: 'rgba(220,240,255,0.7)',
    clouds: true,
    ground: '#90B8D0',
    groundTop: '#A8D0E0',
    groundDark: '#6898B0',
    accent: '#E0F0FF',
    platformColor: '#A0C8E0',
    platformTop: '#B8D8F0',
  },
  7: {
    skyTop: '#E8C050',
    skyBottom: '#F5E0A0',
    hillFar: '#D4A840',
    hillNear: '#C09030',
    cloudColor: 'rgba(255,240,200,0.5)',
    clouds: true,
    ground: '#C0A060',
    groundTop: '#D4B870',
    groundDark: '#A08040',
    accent: '#FFD070',
    platformColor: '#B89850',
    platformTop: '#D0B068',
  },
  8: {
    skyTop: '#F5D0A0',
    skyBottom: '#F8E0C0',
    hillFar: '#D0A070',
    hillNear: '#C09060',
    cloudColor: 'rgba(255,230,200,0.5)',
    clouds: true,
    ground: '#8B6040',
    groundTop: '#A07050',
    groundDark: '#6B4830',
    accent: '#FFB060',
    platformColor: '#907050',
    platformTop: '#A88060',
  },
  9: {
    skyTop: '#FF8050',
    skyBottom: '#FFB080',
    hillFar: '#305870',
    hillNear: '#406880',
    cloudColor: 'rgba(255,200,150,0.4)',
    clouds: true,
    ground: '#406080',
    groundTop: '#507090',
    groundDark: '#305060',
    accent: '#FF9060',
    platformColor: '#486878',
    platformTop: '#587888',
  },
  10: {
    skyTop: '#FFD700',
    skyBottom: '#FFF0C0',
    hillFar: '#C08020',
    hillNear: '#A06818',
    cloudColor: 'rgba(255,245,200,0.6)',
    clouds: true,
    ground: '#8B4513',
    groundTop: '#A05A20',
    groundDark: '#6B3010',
    accent: '#FFD700',
    platformColor: '#8B5525',
    platformTop: '#A06835',
  },
};
