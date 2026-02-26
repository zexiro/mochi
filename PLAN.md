# Mochi — A Squishy Platformer for Kids

## Overview

Mochi is a mobile-first side-scrolling platformer where you play as a little rice cake creature bouncing through colorful worlds. The game's identity comes from its squish physics — Mochi visually stretches and compresses with every action, creating satisfying, tactile movement that feels alive.

**Audience:** Kids ages 5–12 (and adults who like cute things)
**Why it's worth building:** Browser platformers are everywhere, but almost none are mobile-first, genuinely forgiving, and built with the level of polish that makes them feel like a "real game." Mochi fills that gap — a complete platformer with hand-crafted levels, procedural animation, synthesized audio, and zero dependencies, playable on any device.

## Features & Interactions

### Screens / States

1. **Title Screen** — Mochi bounces gently in place. "Tap to Start" / "Press Space." Simple, warm, inviting.
2. **Level Select** — Grid of 5 levels. Locked levels are grayed with a padlock. Completed levels show star count (0–3). Unlocked by beating the previous level.
3. **Playing** — The main game. Canvas fills the screen. Touch controls overlay on mobile. HUD shows dango count and current level name.
4. **Paused** — Overlay with Resume / Level Select / Restart options. Triggered by pause button (top-right) or Escape key.
5. **Level Complete** — Shows stars earned (animated), time taken, dango collected. "Next Level" / "Replay" / "Level Select" buttons.
6. **Game Complete** — After beating level 5. Celebratory animation with Mochi and collected dango. "Play Again" button.

### Controls (Mobile-First)

**Touch (primary):**
- Left side of screen: left/right movement buttons (semi-transparent, bottom-left)
- Right side of screen: jump button (semi-transparent, bottom-right)
- Hold jump for higher jumps
- Swipe down on right side: ground pound (while airborne)

**Keyboard (secondary):**
- Arrow keys or WASD: move
- Space or Up: jump (hold for higher)
- Down arrow or S: ground pound (while airborne)

**Gamepad (stretch goal):** D-pad + A button

### Player Mechanics

- **Move:** Horizontal movement with acceleration/deceleration. Short ramp to max speed for snappy feel.
- **Jump:** Variable height based on hold duration. Coyote time (6 frames after leaving edge). Jump buffering (6 frames before landing). Slowed apex for more air control.
- **Wall Slide:** Touching a wall while airborne slides slowly. Press jump to wall-jump (kick off at angle).
- **Ground Pound:** While airborne, press down to slam. Breaks crumble blocks. Bounces back up slightly on impact. Screen shake (subtle).

### Enemies & Hazards

- **Onigiri (rice ball):** Patrols back and forth on platforms. Touching it bounces Mochi backward (no death).
- **Shrimp Tempura:** Hops in place periodically. Timing hazard.
- **Wasabi Blob:** Stationary. Touching it sends Mochi flying upward (can be used strategically).
- **Spikes:** Instant respawn to last checkpoint.
- **Pits:** Falling off-screen respawns at last checkpoint.

### Collectibles & Progression

- **Dango (rice balls on sticks):** 3 per level, placed in tricky spots. Determines star rating.
- **Checkpoints:** Flags that save your respawn position. Touching one activates it with a satisfying chime.
- **Goal Gate:** End of level. Torii-gate styled. Reaching it completes the level.

### Death & Respawn

No death counter. No game over. Touching hazards or falling into pits respawns Mochi at the last checkpoint with a gentle "poof" animation. Extremely forgiving — this is for kids.

## Information Architecture

```
App.svelte
├── TitleScreen.svelte
├── LevelSelect.svelte
├── Game.svelte (canvas + HUD + touch controls)
│   ├── Canvas (game world rendering)
│   ├── HUD overlay (dango count, level name, pause button)
│   └── TouchControls overlay (mobile d-pad + jump)
├── PauseMenu.svelte
├── LevelComplete.svelte
└── GameComplete.svelte
```

### Data Flow

- `gameState` store: current screen, selected level, save data (unlocked levels, stars, dango per level)
- `input` module: unified input from keyboard + touch, polled each frame
- `engine` module: game loop, physics, collision — reads input, updates world, renders to canvas
- Save data persisted to localStorage

## Visual Design

### Art Direction

Soft, rounded, procedurally drawn. No pixel art — smooth shapes rendered directly on Canvas. Everything has rounded corners and gentle gradients. The aesthetic is "cute Japanese confectionery meets watercolor storybook."

### Mochi (Character)

- Base shape: soft white/cream circle-ish blob (~28x28 px at rest in a 32px grid)
- Two large round eyes (black, slightly offset — left eye slightly higher for personality)
- Small curved smile
- Subtle pink blush spots on cheeks
- **Squash & stretch:** Compressed on landing (wider, shorter), stretched when jumping (taller, narrower), leaning into movement direction, wobble when idle
- Trail of small sparkle particles when moving fast

### Color Palettes (per world)

1. **Sakura Meadow:** #A8D8A8 (soft green), #FFE4B5 (warm cream), #FFB7C5 (sakura pink), #87CEEB (sky blue)
2. **Bamboo Grove:** #2D5016 (deep green), #C8A951 (gold bamboo), #8B6914 (warm brown), #E8DCC8 (cream)
3. **Cloud Kitchen:** #F0F0FF (cloud white), #FFD1DC (soft pink), #C0C0C0 (steam gray), #FFF8DC (warm steam)
4. **Lantern Walk:** #1A1A2E (night blue), #FF6B35 (lantern orange), #FFD700 (warm gold), #4A0E4E (deep purple)
5. **Moon Garden:** #0D1B2A (deep night), #C0C0C0 (moonlight), #E0BBE4 (wisteria), #7EC8E3 (cool glow)

### Typography

System sans-serif stack for UI. Game title uses a custom-drawn rounded font rendered on canvas.

### Layout

- Game canvas fills viewport (100vw × 100vh on mobile, centered with max-width on desktop)
- Touch controls: semi-transparent overlays pinned to bottom corners
- HUD: minimal, top of screen, fades after 2 seconds of no collection
- Menus: centered cards with large touch targets (min 48px)

### Animations

- **Mochi squash/stretch:** Procedural based on velocity. 0.2s spring-based interpolation.
- **Enemy patrol:** Simple sine-wave or linear ping-pong.
- **Collectible bob:** Gentle float up/down with glow pulse.
- **Particle effects:** Landing dust, jump sparkles, checkpoint activation burst, dango collection shimmer.
- **Screen transitions:** Quick fade (200ms). No elaborate transitions — keep it snappy.

## Technical Architecture

### Stack

- **Svelte 5** + **Vite** (consistent with other Claude's Corner projects)
- **Canvas 2D** for game rendering
- **Web Audio API** for synthesized sound effects and music
- **Zero dependencies**

### File Structure

```
mochi/
├── index.html
├── package.json
├── vite.config.js
├── svelte.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js
│   ├── App.svelte
│   ├── components/
│   │   ├── TitleScreen.svelte
│   │   ├── LevelSelect.svelte
│   │   ├── Game.svelte
│   │   ├── PauseMenu.svelte
│   │   ├── LevelComplete.svelte
│   │   ├── GameComplete.svelte
│   │   ├── TouchControls.svelte
│   │   └── HUD.svelte
│   ├── engine/
│   │   ├── loop.js          — requestAnimationFrame with fixed timestep
│   │   ├── input.js          — unified keyboard + touch input
│   │   ├── physics.js        — gravity, velocity, acceleration
│   │   ├── collision.js      — AABB tile collision + entity collision
│   │   ├── camera.js         — follow player, level bounds, smoothing
│   │   └── particles.js      — lightweight particle emitter
│   ├── entities/
│   │   ├── player.js         — Mochi: movement, states, animation
│   │   ├── enemy.js          — enemy behaviors (patrol, hop)
│   │   └── collectible.js    — dango, checkpoints, goal gate
│   ├── renderer/
│   │   ├── world.js          — tile rendering, backgrounds
│   │   ├── entities.js       — draw Mochi, enemies, collectibles
│   │   ├── background.js     — parallax layers
│   │   ├── hud.js            — on-canvas HUD elements
│   │   └── effects.js        — particles, screen shake
│   ├── levels/
│   │   ├── level1.js         — Sakura Meadow
│   │   ├── level2.js         — Bamboo Grove
│   │   ├── level3.js         — Cloud Kitchen
│   │   ├── level4.js         — Lantern Walk
│   │   ├── level5.js         — Moon Garden
│   │   └── tiles.js          — tile type definitions
│   ├── audio/
│   │   ├── engine.js         — Web Audio context + master bus
│   │   ├── sfx.js            — sound effect synthesis
│   │   └── music.js          — background music loops
│   ├── stores/
│   │   └── game.svelte.js    — game state, save data, preferences
│   ├── styles/
│   │   └── global.css        — base styles, touch-action, viewport
│   └── utils/
│       └── math.js           — lerp, clamp, easing functions
```

### Game Loop (Fixed Timestep)

```
TARGET_DT = 1/60
accumulator = 0

function frame(timestamp):
  dt = timestamp - lastTime
  accumulator += dt

  while accumulator >= TARGET_DT:
    update(TARGET_DT)    // physics, input, entities
    accumulator -= TARGET_DT

  alpha = accumulator / TARGET_DT
  render(alpha)          // interpolated rendering
  requestAnimationFrame(frame)
```

### Physics Constants

```
GRAVITY = 0.6
MAX_FALL_SPEED = 12
MOVE_SPEED = 3.5
MOVE_ACCEL = 0.5
MOVE_DECEL = 0.7
JUMP_FORCE = -11
JUMP_CUT_MULTIPLIER = 0.4   (release jump early = lower jump)
WALL_SLIDE_SPEED = 1.5
WALL_JUMP_FORCE_X = 6
WALL_JUMP_FORCE_Y = -10
COYOTE_FRAMES = 6
JUMP_BUFFER_FRAMES = 6
```

### Tile System

- 32×32 pixel tiles
- Tile types: EMPTY, SOLID, PLATFORM (one-way), SPIKE, CRUMBLE, BOUNCE, ICE
- Levels are 2D arrays of tile IDs
- Collision: AABB check against neighboring tiles in player's bounding box

### Collision Detection

1. Move player on X axis
2. Check tile collisions on X, resolve by pushing out
3. Move player on Y axis
4. Check tile collisions on Y, resolve by pushing out
5. Check entity collisions (enemies, collectibles) with AABB overlap

### Camera

- Follows player with smoothing (lerp factor 0.1)
- Clamped to level bounds
- Slight lookahead in movement direction
- Vertical dead zone (don't move camera for small vertical changes)

## Audio Systems

### Sound Effects (Web Audio Synthesis)

- **Jump:** Short ascending sine sweep (200→600Hz, 100ms)
- **Land:** Low thump (80Hz sine, 50ms, quick decay)
- **Wall slide:** Gentle continuous friction noise (filtered white noise)
- **Collect dango:** Bright pentatonic chime (triangle wave, 400→800Hz arpeggio)
- **Checkpoint:** Warm ascending chord (3 notes, 200ms each)
- **Enemy bounce:** Springy "boing" (sine with pitch bend, 300→150Hz)
- **Ground pound:** Impact thud + rising whoosh
- **Respawn:** Soft "poof" (filtered noise burst)
- **Level complete:** Celebratory ascending arpeggio (5 notes)

### Music

Simple looping melodies per world, synthesized with Web Audio. Pentatonic scale, gentle tempo. Can be toggled off. Very simple — 4-8 bar loops with 2-3 voices (sine/triangle).

## Accessibility Plan

- **Keyboard navigation:** Full game playable with keyboard. All menus navigable with Tab/Enter/Escape.
- **Screen reader:** Menu screens have proper ARIA labels. Game canvas has aria-label describing current state.
- **Reduced motion:** Respect `prefers-reduced-motion`. Disable particles, reduce squash/stretch, disable screen shake.
- **Color:** No gameplay information conveyed by color alone. All tile types have distinct shapes.
- **Touch targets:** Minimum 48×48px for all interactive elements. Touch control buttons are large and well-spaced.
- **Contrast:** All text meets WCAG AA contrast ratios. HUD text has drop shadow for readability over any background.
- **Pause:** Game can always be paused. No time pressure except optional star ratings.

## Responsive Strategy (Mobile-First)

### Mobile (< 768px) — Primary

- Canvas fills 100vw × 100vh
- Touch controls visible: left/right buttons (bottom-left), jump button (bottom-right)
- HUD compact: small dango counter top-left, pause button top-right
- Game world scales to fill viewport width; vertical space accommodates touch controls
- `touch-action: none` on canvas to prevent scrolling
- Safe area insets for notched phones

### Tablet (768px–1024px)

- Same as mobile but with more breathing room
- Touch controls slightly larger
- Consider landscape orientation primarily

### Desktop (> 1024px)

- Canvas centered with max-height, maintains aspect ratio
- Touch controls hidden (keyboard instructions shown briefly on first visit)
- Slight letterboxing if aspect ratio doesn't match

### Scaling

- Internal game resolution: 480×320 (15×10 tiles at 32px)
- Canvas scaled up to fill viewport using CSS (image-rendering: pixelated for crisp edges, or smooth for soft look)
- Actually, since we're doing smooth procedural rendering, we'll render at the actual display resolution for sharpness, using a virtual coordinate system of 480×320

## Edge Cases

- **Browser tab hidden:** Pause game loop (use `document.visibilitychange`)
- **Window resize:** Recalculate canvas size, maintain game state
- **Touch + keyboard simultaneous:** Input system merges both, no conflicts
- **Audio autoplay policy:** Create AudioContext on first user interaction (tap/click)
- **Save data corruption:** Validate localStorage data, reset to defaults if invalid
- **Level data bounds:** Camera and physics clamped to level boundaries
- **Low-end devices:** Reduce particle count, simplify rendering
- **Orientation change:** Handle gracefully with resize event
- **No localStorage:** Game works without saving (just can't persist progress)

## Performance Budget

- **Bundle size:** < 50KB gzipped (no dependencies, just Svelte + game code)
- **Frame rate:** Solid 60fps on mid-range phones (2020+)
- **Memory:** < 30MB at runtime
- **Canvas operations:** Batch similar draw calls, minimize state changes
- **Particles:** Pool and recycle, cap at 50 active particles
- **Level loading:** Instant (data is inline JS, no fetch)

## Levels

### Level 1: Sakura Meadow (Tutorial)

- **Theme:** Gentle green meadows with cherry blossom trees
- **Mechanics introduced:** Move, jump, collect dango, checkpoint, goal
- **Layout:** Mostly flat with gentle platforms. Short level (~60 tiles wide).
- **Enemies:** None
- **Dango:** 1 easy (on path), 1 medium (requires small detour), 1 tricky (requires precise jump)

### Level 2: Bamboo Grove

- **Theme:** Tall bamboo stalks, golden light filtering through
- **Mechanics introduced:** Moving platforms, enemies (Onigiri patrols)
- **Layout:** Mix of horizontal and vertical sections (~80 tiles wide). Some verticality.
- **Enemies:** 3-4 Onigiri
- **Dango:** Hidden in vertical alcoves, behind enemy patrol routes

### Level 3: Cloud Kitchen

- **Theme:** Floating platforms in a steamy kitchen sky
- **Mechanics introduced:** Bounce pads (steam vents), crumble blocks
- **Layout:** More vertical, lots of floating platforms (~80 tiles wide, taller)
- **Enemies:** Shrimp Tempura (hoppers)
- **Dango:** On crumble block sequences, above bounce pad chains

### Level 4: Lantern Walk

- **Theme:** Night scene with glowing lanterns
- **Mechanics introduced:** Moving platforms with patterns, tighter timing
- **Layout:** Longer level (~100 tiles wide), mix of everything learned
- **Enemies:** Mix of Onigiri and Shrimp Tempura
- **Dango:** Require combining multiple mechanics to reach

### Level 5: Moon Garden

- **Theme:** Ethereal moonlit garden with glowing flowers
- **Mechanics introduced:** Wall jumping required, Wasabi blobs (strategic hazard/boost)
- **Layout:** Complex (~100 tiles wide), uses all mechanics
- **Enemies:** All types
- **Dango:** The trickiest placements, reward mastery
- **Ending:** Reaching the goal triggers the Game Complete screen with a moon rising animation
