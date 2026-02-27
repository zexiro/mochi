<script>
  import { onMount } from 'svelte';
  import { gameState } from '../stores/game.svelte.js';
  import { initInput, pollInput, resetInput } from '../engine/input.js';
  import { createGameLoop } from '../engine/loop.js';
  import { createCamera, updateCamera, setViewport, setBounds, snapCamera } from '../engine/camera.js';
  import { updateParticles, renderParticles, clearParticles } from '../engine/particles.js';
  import { createPlayer, updatePlayer, setCheckpoint, killPlayer } from '../entities/player.js';
  import { createEnemy, updateEnemy, checkPlayerEnemyCollision, ENEMY_TYPE } from '../entities/enemy.js';
  import { createCollectible, updateCollectible, checkPlayerCollectible, COLLECTIBLE_TYPE } from '../entities/collectible.js';
  import { getLevel } from '../levels/index.js';
  import { TILE_SIZE } from '../levels/tiles.js';
  import { renderBackground, PALETTES } from '../renderer/background.js';
  import { renderTiles } from '../renderer/world.js';
  import { renderPlayer, renderEnemy, renderCollectible } from '../renderer/entities.js';
  import { resumeAudio } from '../audio/engine.js';
  import { playJump, playLand, playCollect, playCheckpoint, playBounce, playHurt, playGroundPound, playLevelComplete } from '../audio/sfx.js';
  import TouchControls from './TouchControls.svelte';
  import HUD from './HUD.svelte';

  let { paused = false } = $props();

  let canvas = $state(null);
  let dangoCount = $state(0);
  let levelName = $state('');
  let isMobile = $state(false);

  // Non-reactive game state (only used in canvas render loop)
  let ctx = null;
  let loop = null;
  let player = null;
  let camera = null;
  let level = null;
  let enemies = [];
  let collectibles = [];
  let crumbleMap = {};
  let levelTime = 0;
  let dangoIds = [];
  let prevOnGround = false;
  let prevGroundPounding = false;
  let virtualW = 480;
  let virtualH = 320;
  let scale = 1;

  function setupLevel() {
    level = getLevel(gameState.currentLevel);
    if (!level) return;

    levelName = level.name;

    player = createPlayer(level.spawn.x, level.spawn.y);
    setCheckpoint(player, level.spawn.x, level.spawn.y);

    camera = createCamera();
    setBounds(camera, level.cols * TILE_SIZE, level.rows * TILE_SIZE);

    enemies = (level.entities.enemies || []).map(e =>
      createEnemy(e.type, e.x, e.y, e)
    );

    collectibles = (level.entities.collectibles || []).map(c =>
      createCollectible(c.type, c.x, c.y, c.id)
    );

    crumbleMap = {};
    levelTime = 0;
    dangoIds = [];
    dangoCount = 0;
    prevOnGround = false;
    prevGroundPounding = false;
    clearParticles();

    resize();
    snapCamera(camera, player.x + player.w / 2, player.y + player.h / 2);
  }

  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    isMobile = 'ontouchstart' in window || w < 768;

    const minTilesX = 12;
    const minTilesY = 8;
    const minW = minTilesX * TILE_SIZE;
    const minH = minTilesY * TILE_SIZE;

    const sx = w / minW;
    const sy = h / minH;
    scale = Math.min(sx, sy);

    virtualW = Math.ceil(w / scale);
    virtualH = Math.ceil(h / scale);

    canvas.width = virtualW * dpr;
    canvas.height = virtualH * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    if (camera) {
      setViewport(camera, virtualW, virtualH);
    }
  }

  function update(dt) {
    if (paused) return;

    const input = pollInput();

    if (input.pause) {
      gameState.screen = 'paused';
      return;
    }

    levelTime += dt;

    // Update crumble blocks
    for (const key in crumbleMap) {
      const c = crumbleMap[key];
      if (!c.broken) {
        c.timer -= dt;
        if (c.timer <= 0) {
          c.broken = true;
        }
      }
    }

    const wasOnGround = player.onGround;
    const wasGroundPounding = player.groundPounding;

    updatePlayer(player, input, level, crumbleMap, dt);

    // Sound effects
    if (!wasOnGround && player.onGround && !player.dead) {
      playLand();
    }
    if (input.jumpPressed && player.state !== 'respawn') {
      if (!wasOnGround && (player.touchingLeft || player.touchingRight)) {
        playJump();
      } else if (wasOnGround || player.coyoteTimer > 0) {
        playJump();
      }
    }
    if (!wasGroundPounding && player.groundPounding) {
      playGroundPound();
    }
    if (player.onBounce) {
      playBounce();
    }

    // Update enemies
    for (const enemy of enemies) {
      updateEnemy(enemy, level, dt);

      const hit = checkPlayerEnemyCollision(player, enemy);
      if (hit === 'hurt') {
        playHurt();
        killPlayer(player);
      } else if (hit === 'bounce_up') {
        player.vy = -12;
        player.onGround = false;
        player.squashTarget = [0.7, 1.3];
        playBounce();
      }
    }

    // Update collectibles
    for (const col of collectibles) {
      updateCollectible(col, dt);

      if (checkPlayerCollectible(player, col)) {
        if (col.type === COLLECTIBLE_TYPE.DANGO) {
          col.collected = true;
          dangoIds.push(col.id);
          dangoCount = dangoIds.length;
          playCollect();
        } else if (col.type === COLLECTIBLE_TYPE.CHECKPOINT) {
          if (!col.activated) {
            col.activated = true;
            setCheckpoint(player, col.x, col.y - 2);
            playCheckpoint();
          }
        } else if (col.type === COLLECTIBLE_TYPE.GOAL) {
          playLevelComplete();
          gameState.completeLevel(dangoIds, levelTime);
          return;
        }
      }
    }

    updateParticles(dt);
    updateCamera(camera, player.x + player.w / 2, player.y + player.h / 2, player.vx, dt);
  }

  function render(alpha) {
    if (!ctx || !level || !player || !camera) return;

    const palette = PALETTES[level.palette];

    ctx.clearRect(0, 0, virtualW, virtualH);

    renderBackground(ctx, camera, palette, virtualW, virtualH);
    renderTiles(ctx, level, camera, palette, crumbleMap);

    for (const col of collectibles) {
      renderCollectible(ctx, col, camera.x, camera.y);
    }

    for (const enemy of enemies) {
      renderEnemy(ctx, enemy, camera.x, camera.y);
    }

    renderPlayer(ctx, player, camera.x, camera.y);
    renderParticles(ctx, camera.x, camera.y);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    initInput();
    setupLevel();

    loop = createGameLoop(update, render);
    loop.start();

    window.addEventListener('resize', resize);

    const visHandler = () => {
      if (document.hidden && loop?.running) {
        gameState.screen = 'paused';
      }
    };
    document.addEventListener('visibilitychange', visHandler);

    return () => {
      loop?.stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visHandler);
      resetInput();
    };
  });
</script>

<div class="game-container">
  <canvas bind:this={canvas} aria-label="Mochi platformer game"></canvas>

  {#if !paused}
    <HUD dango={dangoCount} levelName={levelName} />
    {#if isMobile}
      <TouchControls />
    {/if}
  {/if}
</div>

<style>
  .game-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
