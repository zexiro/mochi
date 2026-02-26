<script>
  import { gameState } from './stores/game.svelte.js';
  import TitleScreen from './components/TitleScreen.svelte';
  import LevelSelect from './components/LevelSelect.svelte';
  import Game from './components/Game.svelte';
  import PauseMenu from './components/PauseMenu.svelte';
  import LevelComplete from './components/LevelComplete.svelte';
  import GameComplete from './components/GameComplete.svelte';
</script>

<div class="app">
  {#if gameState.screen === 'title'}
    <TitleScreen />
  {:else if gameState.screen === 'levelSelect'}
    <LevelSelect />
  {:else if gameState.screen === 'playing'}
    <Game />
  {:else if gameState.screen === 'paused'}
    <Game paused={true} />
    <PauseMenu />
  {:else if gameState.screen === 'levelComplete'}
    <LevelComplete />
  {:else if gameState.screen === 'gameComplete'}
    <GameComplete />
  {/if}

  <footer class="footer">
    <a href="https://www.codehawks.co.uk" target="_blank" rel="noopener">A CodeHawks project</a>
  </footer>
</div>

<style>
  .app {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .footer {
    position: fixed;
    bottom: 6px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 100;
    pointer-events: none;
  }

  .footer a {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.25);
    text-decoration: none;
    pointer-events: auto;
    letter-spacing: 0.5px;
  }

  .footer a:hover {
    color: rgba(255, 255, 255, 0.45);
  }
</style>
