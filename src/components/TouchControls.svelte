<script>
  import { setTouch } from '../engine/input.js';
  import { resumeAudio } from '../audio/engine.js';

  function handleTouch(action, pressed) {
    return (e) => {
      e.preventDefault();
      resumeAudio();
      setTouch(action, pressed);
    };
  }
</script>

<div class="touch-controls" aria-hidden="true">
  <div class="dpad">
    <button
      class="touch-btn left-btn"
      aria-label="Move left"
      ontouchstart={handleTouch('left', true)}
      ontouchend={handleTouch('left', false)}
      ontouchcancel={handleTouch('left', false)}
      onmousedown={handleTouch('left', true)}
      onmouseup={handleTouch('left', false)}
    >
      <svg viewBox="0 0 40 40" width="40" height="40"><path d="M28 8 L12 20 L28 32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button
      class="touch-btn right-btn"
      aria-label="Move right"
      ontouchstart={handleTouch('right', true)}
      ontouchend={handleTouch('right', false)}
      ontouchcancel={handleTouch('right', false)}
      onmousedown={handleTouch('right', true)}
      onmouseup={handleTouch('right', false)}
    >
      <svg viewBox="0 0 40 40" width="40" height="40"><path d="M12 8 L28 20 L12 32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>

  <div class="action-btns">
    <button
      class="touch-btn down-btn"
      aria-label="Ground pound"
      ontouchstart={handleTouch('down', true)}
      ontouchend={handleTouch('down', false)}
      ontouchcancel={handleTouch('down', false)}
      onmousedown={handleTouch('down', true)}
      onmouseup={handleTouch('down', false)}
    >
      <svg viewBox="0 0 40 40" width="40" height="40"><path d="M8 14 L20 28 L32 14" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button
      class="touch-btn jump-btn"
      aria-label="Jump"
      ontouchstart={handleTouch('jump', true)}
      ontouchend={handleTouch('jump', false)}
      ontouchcancel={handleTouch('jump', false)}
      onmousedown={handleTouch('jump', true)}
      onmouseup={handleTouch('jump', false)}
    >
      <svg viewBox="0 0 50 50" width="50" height="50"><path d="M14 32 L25 12 L36 32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>
</div>

<style>
  .touch-controls {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 16px 24px;
    pointer-events: none;
    z-index: 50;
  }

  .dpad {
    display: flex;
    gap: 8px;
    pointer-events: auto;
  }

  .action-btns {
    display: flex;
    gap: 8px;
    pointer-events: auto;
    align-items: flex-end;
  }

  .touch-btn {
    width: 64px;
    height: 64px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
  }

  .touch-btn:active {
    background: rgba(255,255,255,0.25);
    border-color: rgba(255,255,255,0.5);
  }

  .jump-btn {
    width: 80px;
    height: 80px;
  }

  .down-btn {
    width: 56px;
    height: 56px;
  }
</style>
