const SAVE_KEY = 'mochi_save';
const TOTAL_LEVELS = 5;

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && data.version === 1) return data;
    }
  } catch (e) {}
  return defaultSave();
}

function defaultSave() {
  return {
    version: 1,
    unlockedLevel: 1,
    stars: {},    // { "1": 2, "2": 3, ... }
    dango: {},    // { "1": ["d1","d2"], ... }
  };
}

function persistSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) {}
}

let screen = $state('title');    // 'title' | 'levelSelect' | 'playing' | 'paused' | 'levelComplete' | 'gameComplete'
let currentLevel = $state(1);
let save = $state(loadSave());
let levelResult = $state(null);  // { dango: [], time: 0 }
let reducedMotion = $state(
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
);

export const gameState = {
  get screen() { return screen; },
  set screen(v) { screen = v; },

  get currentLevel() { return currentLevel; },
  set currentLevel(v) { currentLevel = v; },

  get save() { return save; },

  get levelResult() { return levelResult; },
  set levelResult(v) { levelResult = v; },

  get reducedMotion() { return reducedMotion; },

  get totalLevels() { return TOTAL_LEVELS; },

  startLevel(num) {
    currentLevel = num;
    screen = 'playing';
    levelResult = null;
  },

  completeLevel(dangoCollected, time) {
    const stars = dangoCollected.length;
    const prevStars = save.stars[currentLevel] || 0;
    const prevDango = save.dango[currentLevel] || [];

    // Merge dango (keep all unique collected across attempts)
    const allDango = [...new Set([...prevDango, ...dangoCollected])];
    save.stars[currentLevel] = Math.max(prevStars, stars);
    save.dango[currentLevel] = allDango;

    // Unlock next level
    if (currentLevel < TOTAL_LEVELS) {
      save.unlockedLevel = Math.max(save.unlockedLevel, currentLevel + 1);
    }

    persistSave(save);

    levelResult = { dango: dangoCollected, time, stars: Math.max(prevStars, stars) };

    if (currentLevel >= TOTAL_LEVELS && stars >= 0) {
      screen = 'gameComplete';
    } else {
      screen = 'levelComplete';
    }
  },

  nextLevel() {
    if (currentLevel < TOTAL_LEVELS) {
      currentLevel++;
      screen = 'playing';
      levelResult = null;
    } else {
      screen = 'levelSelect';
    }
  },

  restartLevel() {
    screen = 'playing';
    levelResult = null;
  },

  getStars(levelNum) {
    return save.stars[levelNum] || 0;
  },

  isUnlocked(levelNum) {
    return levelNum <= save.unlockedLevel;
  },

  resetSave() {
    save = defaultSave();
    persistSave(save);
  },
};
