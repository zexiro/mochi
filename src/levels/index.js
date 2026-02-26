import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';

const levels = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

export function getLevel(num) {
  const raw = levels[num];
  if (!raw) return null;
  return {
    ...raw,
    rows: raw.tiles.length,
    cols: raw.tiles[0].length,
  };
}
