# Changelog

All notable changes to Positronics. The current version is in [`VERSION`](VERSION).
Versions follow `MAJOR.MINOR.PATCH-stage`. During the beta, a MINOR bump may need a new world; a PATCH bump never does.

## 0.1.0-beta (unreleased)

The first public beta. The whole pack is playable, ULV to UHV. So far it has been played through to the end of
River Crossing (ULV); from The Calla (LV) on, expect rough edges and please report them. Single player only. Minecraft 1.20.1, Forge 47.4.0.

### The world
- A skyblock island in a dead world. No ores, no natural mobs, no villager trading.
- The Nether and the End are closed: portals never light, and nothing can travel there.
- Survival that matters: Tough As Nails thirst and temperature, Serene Seasons, and a steady hunger burn
  (about one bar an hour, AFK included). Spice of Life rewards eating a variety.

### Progression
- Ten quest chapters, ULV to UHV, written as North Central Positronics memos.
- Resources come from Strata: USRG Ore Generators, hammering, mortars and the Reclamation Sifter Array.
- Positronic Memory (ProjectE) learns elements only. Atoms come from the Atomic Reclaimer, and EMC fills Klein Stars,
  which power the generators and the Positronic Cores that open each tier.
- Power: Solar Flux panels through GregTech energy converters. Methane and ethanol burn too, priced as spending
  EMC. Powah is limited to its starter Energy Cell and Furnator.

### Side paths
- Field Manual, Strata Index, Logistics and Automation (Pipez, Functional Storage, Tom's Simple Storage, then AE2),
  Calla Kitchen, the Apiary (Productive Bees), the Periodic Table (Alchemistry), the Simulation Lab
  (Hostile Neural Networks), the NCP Space Program (Ad Astra and Stargate Journey) and the Operator's Kit.
- The NCP Shop sells seeds, saplings, botany pots and replacement tools for NCP Scrip earned from quests.

### Quality of life
- Loading-screen tips, each numbered after the quest memo it belongs to.
- Bees can't be lost: a bee falling into the void is put back over its hive. They don't wander, and the
  NCP Shop's Bee Recall (free for now) calls strays home.
- JourneyMap removes a death point once you reach it.

### Known gaps
- Untested past ULV. LV and later chapters may have missing recipes or impossible steps.
- Not built yet: the Gas Line quest (fuel power at MV) and the Beam Reactor (endgame power from stars).
- Not tested in multiplayer.

Report problems at https://github.com/rafacost/positronics/issues with the version, what you did, and your
`logs/latest.log` and `logs/kubejs/server.log`.
