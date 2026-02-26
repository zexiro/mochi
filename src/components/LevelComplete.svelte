<script>
  import { gameState } from '../stores/game.svelte.js';
  import { playMenuSelect } from '../audio/sfx.js';

  const result = $derived(gameState.levelResult);
  const stars = $derived(result?.stars || 0);
  const time = $derived(result?.time || 0);

  function formatTime(t) {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function next() {
    playMenuSelect();
    gameState.nextLevel();
  }

  function replay() {
    playMenuSelect();
    gameState.restartLevel();
  }

  function levelSelect() {
    playMenuSelect();
    gameState.screen = 'levelSelect';
  }
</script>

<div class="screen" role="main" aria-label="Level Complete">
  <div class="card">
    <h2 class="heading">Level Complete!</h2>

    <div class="stars" aria-label="{stars} of 3 stars">
      {#each [1,2,3] as s}
        <span class="star" class:earned={s <= stars}>&#9733;</span>
      {/each}
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-label">Dango</span>
        <span class="stat-value">{result?.dango?.length || 0} / 3</span>
      </div>
      <div class="stat">
        <span class="stat-label">Time</span>
        <span class="stat-value">{formatTime(time)}</span>
      </div>
    </div>

    <div class="buttons">
      {#if gameState.currentLevel < gameState.totalLevels}
        <button class="btn primary" onclick={next}>Next Level</button>
      {/if}
      <button class="btn" onclick={replay}>Replay</button>
      <button class="btn" onclick={levelSelect}>Level Select</button>
    </div>
  </div>
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #87CEEB 0%, #A8D8A8 100%);
    padding: 20px;
  }

  .card {
    background: rgba(255,255,255,0.95);
    border-radius: 20px;
    padding: 32px 24px;
    min-width: 280px;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }

  .heading {
    font-size: 28px;
    font-weight: 800;
    color: #FF8C69;
    margin: 0;
  }

  .stars {
    display: flex;
    gap: 8px;
  }

  .star {
    font-size: 40px;
    color: #DDD;
    transition: color 0.3s;
  }

  .star.earned {
    color: #FFD700;
  }

  .stats {
    display: flex;
    gap: 32px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    font-weight: 600;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .btn {
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
  }

  .btn:active { background: #E0E0E0; }
  .btn.primary { background: #FF8C69; color: #FFF; }
  .btn.primary:active { background: #D46B4F; }
</style>
