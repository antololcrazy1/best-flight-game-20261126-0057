[![make.fun](https://make.fun/badge/best-flight-game-20261126-0057.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)
[![rank](https://make.fun/badge/best-flight-game-20261126-0057/antololcrazy1/best-flight-game-20261126-0057/rank.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)
[![reward](https://make.fun/badge/best-flight-game-20261126-0057/antololcrazy1/best-flight-game-20261126-0057/reward.svg)](https://make.fun/bounty/best-flight-game-20261126-0057)

# Sky Courier — Ring Run

A complete, original flight game built for the
[make.fun "Make the best flight game" bounty](https://make.fun/bounty/best-flight-game-20261126-0057).
You pilot a courier plane in chase view over rolling terrain: fly through
six delivery rings in order, watch throttle, stall, fuel and hull on lit
instruments, then come home and land gently on the runway before time runs out.

## How to play

- **Fly:** arrow keys / WASD, or steer with the mouse.
- **Throttle:** Shift or E to add power, Q to ease off. Space brakes.
- **Camera:** C toggles chase / cockpit view. P pauses, M mutes, R restarts.
- Rings must be flown through in order; the active ring glows gold.
- Fly too slow and the plane stalls. Fuel drains with throttle, so a heavy
  hand early can leave you gliding at the end.
- After ring 6, turn back and land slowly and level on the home runway.

## Run it

Serve `game/` with any static HTTP server and open `game/index.html` in a
desktop browser — no build step, no network requests, every asset is drawn
in code. For example:

```sh
cd game && python3 -m http.server 8080
```

## Layout

- `game/` — the playable game (`index.html` plus `src/` modules: flight
  model, world, missions, input, audio, rendering, HUD).
- `screenshots/` — four real in-game screenshots; the first is the cover.
- `main.ts` — the hand-in program; copies `game/` and `screenshots/` to the
  output folder and writes `dossier.json` with `vendor/makefun-game.ts`.
