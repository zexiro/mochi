<script>
  import { gameState } from '../stores/game.svelte.js';
  import { playMenuSelect } from '../audio/sfx.js';

  function playAgain() {
    playMenuSelect();
    gameState.screen = 'levelSelect';
  }
</script>

<div class="screen" role="main" aria-label="Congratulations">
  <div class="card">
    <div class="mochi" aria-hidden="true">
      <svg viewBox="0 0 80 80" width="100" height="100">
        <circle cx="40" cy="42" r="30" fill="#FFF5E6" stroke="#E8D5B7" stroke-width="2"/>
        <circle cx="30" cy="37" r="5" fill="#2D2D2D"/>
        <circle cx="50" cy="37" r="5" fill="#2D2D2D"/>
        <circle cx="29" cy="35.5" r="1.8" fill="#FFF"/>
        <circle cx="49" cy="35.5" r="1.8" fill="#FFF"/>
        <ellipse cx="23" cy="47" rx="5" ry="3" fill="#FFB7C5" opacity="0.45"/>
        <ellipse cx="57" cy="47" rx="5" ry="3" fill="#FFB7C5" opacity="0.45"/>
        <path d="M30 50 Q40 60 50 50" fill="none" stroke="#2D2D2D" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>
    <h2 class="heading">You did it!</h2>
    <p class="sub">Mochi found the way home.</p>
    <p class="sub">Thank you for playing!</p>

    <div class="stars-total">
      {#each [1,2,3,4,5] as lvl}
        {@const s = gameState.getStars(lvl)}
        <div class="level-stars">
          <span class="lvl-num">{lvl}</span>
          <span class="mini-stars">
            {#each [1,2,3] as n}
              <span class:earned={n <= s}>&#9733;</span>
            {/each}
          </span>
        </div>
      {/each}
    </div>

    <button class="btn primary" onclick={playAgain}>Play Again</button>
  </div>
</div>

<style>
  .screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #0D1B2A 0%, #1B2838 50%, #E0BBE4 100%);
    padding: 20px;
  }

  .card {
    background: rgba(255,255,255,0.95);
    border-radius: 20px;
    padding: 32px 24px;
    min-width: 280px;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  }

  .mochi {
    animation: celebrate 1.5s ease-in-out infinite;
  }

  .heading {
    font-size: 32px;
    font-weight: 800;
    color: #FF8C69;
    margin: 0;
  }

  .sub {
    font-size: 16px;
    color: #666;
    margin: 0;
    text-align: center;
  }

  .stars-total {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 12px;
    background: #F8F8F8;
    border-radius: 12px;
  }

  .level-stars {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
  }

  .lvl-num {
    font-weight: 700;
    color: #666;
    font-size: 14px;
    width: 20px;
  }

  .mini-stars {
    font-size: 16px;
    color: #DDD;
    letter-spacing: 2px;
  }

  .mini-stars .earned {
    color: #FFD700;
  }

  .btn {
    width: 100%;
    padding: 14px 24px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    min-height: 48px;
    touch-action: manipulation;
  }

  .btn.primary { background: #FF8C69; color: #FFF; }
  .btn.primary:active { background: #D46B4F; }

  @keyframes celebrate {
    0%, 100% { transform: translateY(0) rotate(0); }
    25% { transform: translateY(-8px) rotate(-5deg); }
    75% { transform: translateY(-8px) rotate(5deg); }
  }
</style>
