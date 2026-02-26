<script>
  import { gameState } from '../stores/game.svelte.js';
  import { playMenuSelect } from '../audio/sfx.js';
  import { toggleMute, isMuted } from '../audio/engine.js';

  let muted = $state(isMuted());

  function resume() {
    playMenuSelect();
    gameState.screen = 'playing';
  }

  function restart() {
    playMenuSelect();
    gameState.restartLevel();
  }

  function levelSelect() {
    playMenuSelect();
    gameState.screen = 'levelSelect';
  }

  function toggleSound() {
    muted = toggleMute();
  }
</script>

<div class="overlay" role="dialog" aria-label="Pause Menu">
  <div class="menu">
    <h2 class="title">Paused</h2>
    <div class="buttons">
      <button class="menu-btn primary" onclick={resume}>Resume</button>
      <button class="menu-btn" onclick={restart}>Restart</button>
      <button class="menu-btn" onclick={toggleSound}>
        Sound: {muted ? 'Off' : 'On'}
      </button>
      <button class="menu-btn" onclick={levelSelect}>Level Select</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 60;
    backdrop-filter: blur(4px);
  }

  .menu {
    background: rgba(255,255,255,0.95);
    border-radius: 20px;
    padding: 32px 24px;
    min-width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }

  .title {
    font-size: 28px;
    font-weight: 800;
    color: #333;
    margin: 0;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .menu-btn {
    width: 100%;
    padding: 14px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    background: #F0F0F0;
    color: #333;
    cursor: pointer;
    min-height: 48px;
    touch-action: manipulation;
    transition: background 0.15s;
  }

  .menu-btn:active {
    background: #E0E0E0;
  }

  .menu-btn.primary {
    background: #FF8C69;
    color: #FFF;
  }

  .menu-btn.primary:active {
    background: #D46B4F;
  }
</style>
