<script>
  import { gameState } from '../stores/game.svelte.js';
  import { playMenuSelect } from '../audio/sfx.js';

  const levelNames = ['', 'Sakura Meadow', 'Bamboo Grove', 'Cloud Kitchen', 'Lantern Walk', 'Moon Garden'];

  function selectLevel(num) {
    if (!gameState.isUnlocked(num)) return;
    playMenuSelect();
    gameState.startLevel(num);
  }

  function back() {
    playMenuSelect();
    gameState.screen = 'title';
  }
</script>

<div class="select" role="main" aria-label="Level Select">
  <button class="back-btn" onclick={back} aria-label="Back to title">
    &#8592;
  </button>
  <h2 class="heading">Select Level</h2>

  <div class="grid">
    {#each [1,2,3,4,5] as num}
      {@const unlocked = gameState.isUnlocked(num)}
      {@const stars = gameState.getStars(num)}
      <button
        class="level-card"
        class:locked={!unlocked}
        onclick={() => selectLevel(num)}
        disabled={!unlocked}
        aria-label="{levelNames[num]}{unlocked ? '' : ' (locked)'}"
      >
        <span class="level-num">{num}</span>
        <span class="level-name">{levelNames[num]}</span>
        {#if unlocked}
          <span class="stars" aria-label="{stars} of 3 stars">
            {#each [1,2,3] as s}
              <span class="star" class:earned={s <= stars}>&#9733;</span>
            {/each}
          </span>
        {:else}
          <span class="lock" aria-hidden="true">&#128274;</span>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .select {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #87CEEB 0%, #C8E6F0 100%);
    padding: 20px;
    gap: 20px;
  }

  .back-btn {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: rgba(255,255,255,0.3);
    color: #FFF;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }

  .heading {
    font-size: 28px;
    font-weight: 700;
    color: #FFF;
    text-shadow: 0 2px 4px rgba(0,0,0,0.15);
    margin: 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    width: 100%;
    max-width: 500px;
  }

  .level-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 12px;
    border: none;
    border-radius: 16px;
    background: rgba(255,255,255,0.85);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.15s;
    min-height: 100px;
    touch-action: manipulation;
  }

  .level-card:active:not(.locked) {
    transform: scale(0.95);
  }

  .level-card.locked {
    background: rgba(255,255,255,0.4);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .level-num {
    font-size: 28px;
    font-weight: 800;
    color: #FF8C69;
    line-height: 1;
  }

  .locked .level-num {
    color: #AAA;
  }

  .level-name {
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }

  .stars {
    display: flex;
    gap: 2px;
  }

  .star {
    font-size: 18px;
    color: #DDD;
  }

  .star.earned {
    color: #FFD700;
  }

  .lock {
    font-size: 20px;
    opacity: 0.5;
  }
</style>
