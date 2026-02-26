<script>
  import { gameState } from '../stores/game.svelte.js';
  import { playMenuSelect } from '../audio/sfx.js';

  let { dango = 0, levelName = '' } = $props();

  function pause() {
    playMenuSelect();
    gameState.screen = 'paused';
  }
</script>

<div class="hud">
  <div class="hud-left">
    <span class="dango-count" aria-label="{dango} of 3 dango collected">
      <span class="dango-icon" aria-hidden="true">&#127841;</span>
      {dango} / 3
    </span>
  </div>

  <div class="hud-center">
    <span class="level-name">{levelName}</span>
  </div>

  <div class="hud-right">
    <button class="pause-btn" onclick={pause} aria-label="Pause game">
      &#10074;&#10074;
    </button>
  </div>
</div>

<style>
  .hud {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    z-index: 40;
    pointer-events: none;
  }

  .hud-left, .hud-center, .hud-right {
    display: flex;
    align-items: center;
  }

  .dango-count {
    font-size: 16px;
    font-weight: 700;
    color: #FFF;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dango-icon {
    font-size: 20px;
  }

  .level-name {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    font-weight: 500;
  }

  .pause-btn {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: rgba(0,0,0,0.2);
    color: #FFF;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    touch-action: manipulation;
    letter-spacing: 2px;
  }
</style>
