# Agent prompt: USRG right-click output (1.1.1)

> Paste everything below the line into the coding agent. Run it in `D:\AI_Projects\usrg_automation\usrg`, on branch `1.20.1-forge`.

---

**Scope note:** if you're working on Via Aurea right now, commit your work there first (`WIP: …`). Then do this small USRG change and return.

## Problem
In a hardcore skyblock the player has no iron at the start, so no hopper. Today a USRG generator can only be emptied by automation (hoppers, pipes or auto-push), so the very first generator is useless until the player has iron.

## Feature: take the output by hand
In `BaseGenerator#use` (currently it only handles sneak + upgrade item and returns `PASS` otherwise):

1. **Right-click without sneaking** (any held item except a `TierUpgradeItem`): move the generator's whole output buffer into the player's inventory.
   - Use `ItemHandlerHelper.giveItemToPlayer` (or equivalent) per stack. Whatever doesn't fit **stays in the generator**: never drop it on the ground and never delete it.
   - Server side only; return `sidedSuccess`. Play a soft pickup sound (`SoundEvents.ITEM_PICKUP`) when something was moved.
   - An empty buffer is a no-op returning `PASS`, so normal block interactions aren't swallowed.
2. **Sneak + right-click with an upgrade item:** unchanged (the tier upgrade).
3. **Config:** `general.rightClickExtract` (boolean, default **true**). When false, behave exactly like 1.1.0.
4. Works for **all tiers**, and doesn't consume energy or affect progress.
5. Tooltip and JEI info line: "Right-click to collect output."

## Verification
- T1 cobblestone generator with no hopper: wait, then right-click, and the cobblestone lands in the inventory. With a full inventory, the items stay in the generator.
- Sneak + upgrade still upgrades; right-click with an upgrade item but without sneaking collects output (no upgrade).
- `rightClickExtract=false` restores the old behaviour.
- `gradlew build`.

## Deliverables
- Version `1.20.1-1.1.1`, release notes `docs/releases/1.20.1-1.1.1-forge.md`, commit on `1.20.1-forge`.
- **Do not push, tag or publish without asking.**
