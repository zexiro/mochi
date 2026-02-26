<script>
  import { gameState } from '../stores/game.svelte.js';
  import { initAudio, resumeAudio } from '../audio/engine.js';
  import { playMenuSelect } from '../audio/sfx.js';

  function start() {
    initAudio();
    resumeAudio();
    playMenuSelect();
    gameState.screen = 'levelSelect';
  }
</script>

<div class="title" role="main" aria-label="Mochi - A Squishy Platformer">
  <div class="sky"></div>
  <div class="content">
    <div class="mochi-icon" aria-hidden="true">
      <svg viewBox="0 0 80 80" width="80" height="80">
        <circle cx="40" cy="42" r="30" fill="#FFF5E6" stroke="#E8D5B7" stroke-width="2"/>
        <circle cx="30" cy="37" r="5" fill="#2D2D2D"/>
        <circle cx="50" cy="37" r="5" fill="#2D2D2D"/>
        <circle cx="29" cy="35.5" r="1.8" fill="#FFF"/>
        <circle cx="49" cy="35.5" r="1.8" fill="#FFF"/>
        <ellipse cx="23" cy="47" rx="5" ry="3" fill="#FFB7C5" opacity="0.45"/>
        <ellipse cx="57" cy="47" rx="5" ry="3" fill="#FFB7C5" opacity="0.45"/>
        <path d="M33 50 Q40 57 47 50" fill="none" stroke="#2D2D2D" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <h1 class="title-text">Mochi</h1>
    <p class="subtitle">A squishy platformer</p>
    <button class="start-btn" onclick={start}>
      Tap to Start
    </button>
  </div>
  <div class="ground"></div>
</div>

<style>
  .title {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(180deg, #87CEEB 0%, #C8E6F0 60%, #A8D8A8 100%);
  }

  .sky {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
  }

  .ground {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 15%;
    background: linear-gradient(180deg, #7DAF7D 0%, #6B8E23 100%);
    border-radius: 50% 50% 0 0 / 20px 20px 0 0;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .mochi-icon {
    animation: bounce 2s ease-in-out infinite;
  }

  .title-text {
    font-size: 48px;
    font-weight: 800;
    color: #FFF5E6;
    text-shadow: 0 3px 0 #E8D5B7, 0 6px 12px rgba(0,0,0,0.15);
    letter-spacing: 4px;
    margin: 0;
  }

  .subtitle {
    font-size: 16px;
    color: rgba(255,255,255,0.8);
    margin: 0;
    font-weight: 400;
    letter-spacing: 2px;
  }

  .start-btn {
    margin-top: 24px;
    padding: 14px 36px;
    font-size: 18px;
    font-weight: 600;
    color: #FFF5E6;
    background: #FF8C69;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    box-shadow: 0 4px 0 #D46B4F, 0 6px 12px rgba(0,0,0,0.15);
    transition: transform 0.1s, box-shadow 0.1s;
    min-width: 200px;
    min-height: 48px;
    touch-action: manipulation;
  }

  .start-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #D46B4F, 0 3px 8px rgba(0,0,0,0.15);
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
