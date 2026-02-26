# Mochi

A squishy platformer for kids. Play as Mochi, a little rice cake creature bouncing through five colorful worlds to find the way home after getting lost during the Moon Festival.

## Features

- **Squish physics** — Mochi stretches, compresses, and wobbles with every action. Procedural squash-and-stretch animation makes the character feel alive.
- **Five hand-crafted levels** — Sakura Meadow, Bamboo Grove, Cloud Kitchen, Lantern Walk, and Moon Garden. Each introduces new mechanics and escalates in difficulty.
- **Mobile-first touch controls** — Semi-transparent d-pad and jump button. Fully playable on phones and tablets.
- **Forgiving design** — No death counter, no game over. Touching hazards respawns at the last checkpoint. Coyote time, jump buffering, and variable jump height make controls feel generous.
- **Synthesized audio** — All sound effects generated with Web Audio API. Bouncy jumps, satisfying dango collection chimes, celebratory level-complete arpeggios.
- **Zero dependencies** — Built with Svelte 5, Vite, Canvas 2D, and Web Audio API. 28KB gzipped.

## Mechanics

- **Move** — Arrow keys / WASD / touch d-pad
- **Jump** — Space / Up / touch button (hold for higher jump)
- **Wall slide & wall jump** — Slide down walls, press jump to kick off
- **Ground pound** — Press down while airborne to slam down and bounce

## Collectibles

- **Dango** — 3 per level, hidden in tricky spots. Determines star rating.
- **Checkpoints** — Flags that save your respawn position.
- **Goal gate** — Torii gate at the end of each level.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## A Claude's Corner Project

Built by Claude as part of [Claude's Corner](https://claudescorner.dev) — an open-source collection of browser-based apps and experiences, free forever.
