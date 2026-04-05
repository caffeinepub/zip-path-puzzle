# ZIP Path Puzzle

## Current State
- Hint button sets 30s cooldown, shows 2 cells, countdown shown on button the whole time
- Unlimited mode has no backward navigation
- Easy/Medium/Hard modes have prev/next stepper but it only advances (already works both directions via modulo)
- No explicit "skip" without completion in unlimited mode

## Requested Changes (Diff)

### Add
- Two-phase hint timer: phase 1 = 10s countdown visible on button (hint cells visible), phase 2 = silent wait until 30s total, then unlock (hint cells cleared)
- Unlimited mode: backward navigation (prev puzzle button)
- All modes: next/prev puzzle navigation works without needing to complete current puzzle (already true for easy/medium/hard; need to add for unlimited)

### Modify
- Hint cooldown: change from single 30s countdown to two-phase (10s shown + 20s silent = 30s total)
- Unlimited stepper section: add prev button alongside next, allow going back in the stream (floor at 0)
- Hint cells should clear after the 10s visible phase ends

### Remove
- Nothing removed

## Implementation Plan
1. In `handleHint`: set hintCooldown to 30, start interval, but only show countdown number while > 20 (i.e. 30→21 shows 30-10 countdown). When ≤ 20, button shows locked but no number (or a lock icon). Hint cells cleared when countdown hits 20.
2. Add `unlimitedIndex` prev button: decrement by 1, floor at 0, reset puzzle state.
3. Unlimited mode stepper: render prev/next buttons always visible (not gated by isComplete).
4. All easy/medium/hard prev/next already work without completion gate -- verify and keep.
