import level1 from './level1.js';
import level2 from './level2.js';
import level3 from './level3.js';
import level4 from './level4.js';
import level5 from './level5.js';
import level6 from './level6.js';
import level7 from './level7.js';
import level8 from './level8.js';
import level9 from './level9.js';
import level10 from './level10.js';
import level11 from './level11.js';
import level12 from './level12.js';
import level13 from './level13.js';
import level14 from './level14.js';
import level15 from './level15.js';

const levels = {
  1: level1, 2: level2, 3: level3, 4: level4, 5: level5,
  6: level6, 7: level7, 8: level8, 9: level9, 10: level10,
  11: level11, 12: level12, 13: level13, 14: level14, 15: level15,
};

export function getLevel(num) {
  const raw = levels[num];
  if (!raw) return null;
  return {
    ...raw,
    rows: raw.tiles.length,
    cols: raw.tiles[0].length,
  };
}
