const TARGET_DT = 1000 / 60;
const MAX_DT = 200;

export function createGameLoop(update, render) {
  let lastTime = 0;
  let accumulator = 0;
  let running = false;
  let rafId = 0;

  function frame(time) {
    if (!running) return;

    const rawDt = time - lastTime;
    const dt = Math.min(rawDt, MAX_DT);
    lastTime = time;
    accumulator += dt;

    let steps = 0;
    while (accumulator >= TARGET_DT && steps < 4) {
      update(TARGET_DT / 1000);
      accumulator -= TARGET_DT;
      steps++;
    }

    if (steps >= 4) accumulator = 0;

    render(accumulator / TARGET_DT);
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      accumulator = 0;
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    },
    get running() { return running; }
  };
}
