# Agent prompt: USRG powered tiers (Forge 1.20.1)

> Paste everything below the line into the coding agent. Run it in `D:\AI_Projects\usrg_automation`.

---

## Step 0: housekeeping before anything else

1. **Via Aurea:** don't discard the uncommitted backport work. In `via_aurea`, on branch `1.20.1-forge`, commit it as-is with the message `WIP: Forge 1.20.1 backport (paused)`, then stop. Via Aurea resumes only after USRG tiers are finished and released. `master` stays untouched.
2. **USRG 1:1 port: finish the verification.** The report only said the dev client reached the main menu. In a dev **world** on `1.20.1-forge` (commit `825b1f5`): place a Cobblestone and an Ore generator, confirm they produce, a hopper pulls from them, JEI shows the recipes, and the Ex Nihilo generators stay hidden without Ex Nihilo installed. Fix anything found as its own commit, before the tier work.

## Step 1: the feature

USRG (`usrg`, MIT, by rafacost3d) gets **powered tiers** on branch `1.20.1-forge`. The result is **1.20.1-1.1.0**. USRG stays a **standalone, pack-agnostic mod**: no dependency on GregTech or any pack.

The target pack (Forge 47.4.0) runs GregTech CEu Modern 7.5.2 with `nativeEUToFE: true` (4 FE = 1 EU). GT cables push EU straight into FE blocks, so **Forge Energy is enough**. Costs are aligned to GT voltages so they feel native there.

### Design (decided)

**A. Tier stored in one block, upgraded in-world**
- Each generator type stays **one block** with a `tier` blockstate property (1–5) and a matching block-entity field. No separate block per tier, so there are 21 blocks, not 105.
- Four upgrade items: `usrg:tier_upgrade_2` … `usrg:tier_upgrade_5`. **Sneak + right-click** a generator with the next-tier upgrade to raise it by exactly one tier. Order is enforced: T2 → T3 → T4 → T5. The upgrade is consumed, and stored energy and items are **kept**.
- Breaking a generator **drops it with its tier**: block-entity NBT on the item, a tooltip showing the tier, and it places back at that tier.
- Existing generators in old worlds load as **tier 1**.
- Config `maxTier` per generator type (default 5 for all), so packs can cap a type (e.g. dirt at T3).

**B. T1 is exactly today's behaviour:** free, no energy capability, 40 ticks per item, 1-slot buffer. Nothing changes for current users.

**C. Default tier table** (all values in common config, per tier):

| Tier | GT reference | ticks/cycle | items/cycle | ≈ items/s | FE/t (≈ EU/t) | FE buffer | max FE in/t | output slots | auto-push default |
|---|---|---|---|---|---|---|---|---|---|
| 1 | — | 40 | 1 | 0.5 | 0 | 0 | 0 | 1 | off |
| 2 | LV | 20 | 1 | 1 | 64 (16) | 12,800 | 256 | 1 | on |
| 3 | HV | 10 | 2 | 4 | 512 (128) | 102,400 | 2,048 | 4 | on |
| 4 | IV | 5 | 4 | 16 | 4,096 (1,024) | 819,200 | 16,384 | 9 | on |
| 5 | ZPM | 5 | 16 | 64 | 32,768 (8,192) | 6,553,600 | 131,072 | 27 | on |

- Energy is consumed **per tick while producing**. Production **pauses** if the buffer can't pay for the tick, or if the output is full. No partial cycles; progress is kept while paused.
- **Auto-push:** each cycle, try to insert output into adjacent item handlers (all 6 sides, round-robin). Configurable per tier. Hoppers and pipes keep extracting through `ForgeCapabilities.ITEM_HANDLER` (extract only, never insert).
- **Redstone control:** a redstone signal **pauses** the generator (config `redstoneDisables`, default true). Comparator output = buffer fill level.

**D. Per-tier output lists for the random-output generators.** This is the most important hook for the pack.
- Every generator built on `BaseRandomGeneratorTile` (Ore, plus any other weighted-list generator) gets **one list per tier** in config: `oreGeneratorItemsT1` … `oreGeneratorItemsT5`, in the same `modid:item*probability` format. An **empty list falls back to the T1 list**.
- The pack will set each tier's list to its own per-tier "seed" grit items, so items referenced in the config may come from other mods (KubeJS items). Resolve the IDs **lazily** (at first use or on server start), not at class load. Log a clear warning for unknown IDs and skip them, never crash.

**E. Recipes:** upgrade items get **simple default recipes as data JSON** (e.g. T2: iron + redstone + generator-tier frame; T3: gold and diamond; T4: emerald and obsidian; T5: nether star). Use common Forge tags. **Nothing hard-coded in Java.** The pack will replace them with KubeJS.

**F. Visuals:** one shared **tier overlay** (a frame or corner trim), 4 overlay textures (T2–T5), applied to every generator model through the blockstate `tier` property (multipart overlay). The T1 look is unchanged. Placeholder art is fine; list each new texture in the release notes so the author can repaint it.

**G. Info:**
- Item and block tooltips show tier, items/s, FE/t and the buffer.
- **Jade** provider (soft dependency, only if Jade is present): tier, energy bar, progress, and "paused: no power / output full / redstone".
- JEI: the upgrade recipes plus one info page explaining tiers and power.

### Implementation constraints
- Put tier logic in `BaseGeneratorTile` and `BaseRandomGeneratorTile` (tier field, `EnergyStorage` capability exposed only for tier ≥ 2, config lookup, auto-push, pause states). **Don't copy logic into the 21 subclasses.**
- Register the upgrade items in a loop. One shared overlay model.
- Persist tier, energy, progress and inventory in NBT, and sync the tier to the client via the blockstate.
- Keep the Ex Nihilo generators conditional exactly as now.
- No new hard dependencies. Jade is optional (`compileOnly` plus a guarded plugin).
- Follow the existing code style.

### Verification (dev world)
1. Old world from 1.0.0 → generators load as T1 and behave identically.
2. Each tier matches its config row (time a stack); unpowered T2+ pauses; output-full pauses; redstone pauses; the comparator works.
3. Upgrade in order only; energy and items kept; break and replace keeps the tier; `maxTier` respected.
4. Per-tier ore list: set `oreGeneratorItemsT3=["minecraft:diamond*1.0"]` and confirm only T3 gives diamonds while T1/T2 use the T1 list; an unknown ID logs a warning and doesn't crash.
5. Auto-push into a chest works; a hopper still extracts.
6. Power from a plain FE source. If you can, also smoke-test with GTCEu 7.5.2 and an LV cable to confirm the native EU → FE flow.
7. `gradlew build` passes on Java 17 / Forge 47.4.0.

### Deliverables
- Commits in logical steps on `usrg` `1.20.1-forge`.
- `docs/releases/1.20.1-1.1.0-forge.md`: features, the config reference with defaults, new textures, and migration notes.
- **Do not push, tag or publish without asking.** If a design point above turns out impractical, stop and ask the author; don't change the design yourself.
