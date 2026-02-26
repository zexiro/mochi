import { TILE as T } from './tiles.js';

// Cloud Kitchen - Bounce pads, crumble blocks, shrimp enemies
// 80 tiles wide × 16 tiles tall
const _ = T.EMPTY;
const S = T.SOLID;
const P = T.PLATFORM;
const B = T.BOUNCE;
const C = T.CRUMBLE;

export default {
  name: 'Cloud Kitchen',
  palette: 3,
  tiles: [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    //Row 5: high platform reachable via bounce pad
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    //Row 7: medium platforms (reachable from row 9)
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_],
    //Row 8: crumble blocks as alternate paths
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,C,C,C,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,C,C,C,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    //Row 9: low platforms (reachable from ground)
    [_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,P,P,P,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    //Row 11: ground with gaps at 11-12, 42-43. Bounce pads at cols 22 and 56
    [S,S,S,S,S,S,S,S,S,S,S,_,_,S,S,S,S,S,S,S,S,S,B,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,_,_,S,S,S,S,S,S,S,S,S,S,S,S,B,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S],
    [S,S,S,S,S,S,S,S,S,S,S,_,_,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,_,_,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S],
    [S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S],
    [S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S],
    [S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S],
  ],
  spawn: { x: 2 * 32 + 5, y: 10 * 32 - 22 },
  entities: {
    enemies: [
      { type: 'shrimp', x: 25 * 32, y: 11 * 32 - 24, hopDelay: 1.8 },
      { type: 'onigiri', x: 36 * 32, y: 11 * 32 - 24, range: 60 },
      { type: 'shrimp', x: 50 * 32, y: 11 * 32 - 24, hopDelay: 2 },
      { type: 'shrimp', x: 70 * 32, y: 11 * 32 - 24, hopDelay: 1.5 },
    ],
    collectibles: [
      // High dango - use bounce pad at col 22 to reach row 5 platform
      { type: 'dango', x: 24 * 32 + 6, y: 4 * 32, id: 'd1' },
      // Medium dango - above row 7 platform at 38-40
      { type: 'dango', x: 39 * 32 + 6, y: 6 * 32, id: 'd2' },
      // Crumble path dango - on crumble blocks at row 8 (62-64), be quick!
      { type: 'dango', x: 63 * 32 + 6, y: 7 * 32, id: 'd3' },
      { type: 'checkpoint', x: 28 * 32, y: 11 * 32 - 20 },
      { type: 'checkpoint', x: 52 * 32, y: 11 * 32 - 20 },
      { type: 'goal', x: 76 * 32, y: 11 * 32 - 48 },
    ],
  },
};
