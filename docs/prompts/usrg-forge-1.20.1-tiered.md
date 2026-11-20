# Agent prompt: USRG → Forge 1.20.1 + tiered generators

> Paste everything below the line into the coding agent. Run it inside `D:\AI_Projects\usrg_automation\usrg`.

---

You are working on **Ultimate Skyblock Resource Generator (USRG)**, an MIT-licensed Minecraft mod by rafacost3d. The repo is at `D:\AI_Projects\usrg_automation\usrg`.

## Context

- Branch `1.20.1-neoforge` targets **NeoForge 1.20.1 (47.1.79)** with `net.neoforged.gradle` 6.0.21 and the artifact `net.neoforged:forge:1.20.1-47.1.79`. Its sources already use `net.minecraftforge.*` packages (`RegistryObject`, `ForgeRegistries`, `ForgeCapabilities`, `ForgeConfigSpec`, `LazyOptional`, `ItemStackHandler`).
- `master` is the 1.21.1 NeoForge line. **Do not touch master.**
- The mod has 21 generator blocks (18 vanilla plus 3 conditional Ex Nihilo: Sequentia). Each block has a `*Generator` and a `*GeneratorTile` class. All tiles extend `BaseGeneratorTile` (fixed-interval output into a 1-slot `ItemStackHandler`). The ore and random generators extend `BaseRandomGeneratorTile` (weighted list from config `oreGeneratorItems`, format `modid:item*probability`).
- Config (`setup/Config.java`): `generate_dust`, `blocks_per_tick` (default 40), `oreGeneratorEnable`, `dyeGeneratorEnable`, `oreGeneratorItems`.
- The target modpack runs **Forge 47.4.0, Java 17, MC 1.20.1** with GregTech CEu Modern 7.5.2, KubeJS 2001, EMI and JEI.

## Part 1: Forge 1.20.1 port (do this first, ship it separately)

1. Create branch `1.20.1-forge` from `1.20.1-neoforge`.
2. Switch the build to **ForgeGradle 6** with `net.minecraftforge:forge:1.20.1-47.4.0` and official mappings, Java 17 toolchain. Update `gradle.properties` (`forge_version`, `forge_version_range=[47,)`, `loader_version_range=[47,)`) and `META-INF/mods.toml` (`modLoader="javafml"`, dependency `forge`, not `neoforge`).
3. Keep JEI (1.20.1 Forge), Ex Nihilo: Sequentia and NovaCore as runtime-only dev dependencies through Curse Maven, and use matching Forge 1.20.1 file IDs.
4. Change only what Forge requires. Behaviour must stay identical to the 1.20.1 NeoForge release.
5. Verify: `gradlew build` passes; a dev client reaches the main menu and a world; place a Cobblestone and an Ore generator and confirm output and hopper extraction; the JEI recipes show. Write release notes in `docs/releases/1.20.1-1.0.0-forge.md`, in the same style as the existing release docs.
6. Commit on the branch. **Do not push or publish without asking.**

## Part 2: Tiered generators (new feature, on top of `1.20.1-forge`)

**Goal:** the generators become a progression system that a modpack can gate per tier, while USRG stays a standalone, pack-agnostic mod.

### Requirements

- **Tiers:** 5 tiers by default. **Tier 1 = the current generators, unchanged** (free, no power, current speed), so existing worlds and packs don't break. Tiers 2–5 are new blocks per generator type, with IDs like `usrg:cobblestone_generator_t2`.
- **Power:** tiers 2+ consume **Forge Energy (FE)** through a standard `ForgeCapabilities.ENERGY` storage. They stop when unpowered and show that state (a blockstate `powered` or a texture overlay). Stay generic FE; the pack converts GregTech EU to FE with GT's own converters. **Do not depend on GregTech.**
- **Config per tier** (common config, defaults below as a starting point):

  | Tier | ticks per cycle | items per cycle | FE/t | buffer FE |
  |---|---|---|---|---|
  | 1 | 40 | 1 | 0 | 0 |
  | 2 | 20 | 1 | 32 | 32,000 |
  | 3 | 10 | 2 | 128 | 128,000 |
  | 4 | 5 | 4 | 512 | 512,000 |
  | 5 | 1 | 8 | 2048 | 2,048,000 |

- **Ore and random generators per tier:** each tier gets its own weighted output list (`oreGeneratorItemsT1` … `oreGeneratorItemsT5`). An empty list falls back to the tier-1 list. This is the key hook: the modpack sets each tier's list to its own per-tier "seed" materials instead of vanilla ores.
- **Upgrades:** a tier N+1 generator is crafted from a tier N generator of the same type plus tier materials. Ship **simple default recipes in data JSON** using common tags (`forge:ingots/iron`, `forge:storage_blocks/gold`, `forge:gems/diamond`, `minecraft:nether_star` …) so packs can replace them with KubeJS. **No hard-coded recipes in Java.**
- **Inventory:** an output buffer of at least 1 slot. A per-tier config option auto-pushes output into an adjacent inventory (default off for T1, on for T2+). Hoppers and pipes keep working through `ForgeCapabilities.ITEM_HANDLER` (output only, no insertion).
- **Tooltips:** show tier, speed, items per cycle and FE/t.
- **Visuals:** reuse the existing models with a per-tier overlay or tint (e.g. a coloured frame). Placeholder textures are fine; list every texture you add in the release notes so the author can replace them.
- **Jade/WAILA:** optional. Skip unless it's trivial.
- **Recipe viewer:** JEI shows the upgrade recipes automatically. Also add an info page per tier explaining power use.
- **Ex Nihilo tiers:** they follow the same conditional loading as the existing Ex Nihilo generators.

### Design constraints

- Put the tier logic in `BaseGeneratorTile` and `BaseRandomGeneratorTile` (tier field, energy storage, config lookup) rather than duplicating it across 21 tile classes. Generate the per-tier block and item registration in a loop.
- Save the energy and tier in NBT. Generators must survive chunk reloads with no loss.
- Add no new hard dependencies.
- Keep the code style of the repo.

### Open questions: ask the author before deciding

1. Should T1 also accept optional FE for a small speed boost, or stay strictly free?
2. A separate block per tier, or one block per type with a `tier` blockstate and an upgrade item used in-world? The default plan is separate blocks; confirm.
3. Should tier upgrades keep the stored energy and items?

### Verification

- `gradlew build` passes.
- In a dev world: each tier's speed and output match the config, unpowered T2+ stops, T1 is unchanged, per-tier ore lists work (test with `minecraft:diamond*1.0` on T3 only), auto-push works, hoppers extract.
- Release notes: `docs/releases/1.20.1-1.1.0-forge.md`.

Commit in logical steps on `1.20.1-forge`. **Do not push, tag or publish without asking.**
