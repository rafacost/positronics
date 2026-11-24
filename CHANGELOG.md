# Changelog

All notable changes to Positronics. The current version is in [`VERSION`](VERSION).
Versions follow `MAJOR.MINOR.PATCH-stage`. During the beta, a MINOR bump may need a new world; a PATCH bump never does.

## 0.1.1-beta (2026-11-24)

- **Soy Milk.** Pam's Fresh Milk is now Soy Milk, made from soybeans, almonds or coconuts: 2 beans and a purified
  water bottle by hand (you keep the bottle), or twice as much in an LV Mixer. The Mixer also fills a milk bucket
  (empty bucket, 4 beans, 1,000 mB water). It counts as milk in every Pam's dairy recipe. New Kitchen quest, memo 3112.
- **Pam's Market**, a new chapter next to the NCP Shop, sells every Pam's seed (97, 1 Scrip a packet) and sapling
  (50, 4 Scrip each). The Pam's seeds and saplings moved there from the NCP Shop.
- **Storage blocks by tier.** Copper, tin and redstone blocks now craft by hand, like iron, bronze and steel; the ULV
  Reclamation Compressor packs all six. Every other ingot or gem block needs LV (compressor at 30 EU/t), and gold,
  diamond and emerald blocks need MV (120 EU/t on every GregTech route).
- **Dedicated server fix:** joining a server kicked every player (null item in the recipe list). Our Water Purifier
  recipe had the wrong input format; it now works as the memo says (dirty water to purified, 10 s) and replaces
  Tough As Nails' two-step dirty-to-plain-water recipe.
- **Server pack:** a dedicated-server zip for each release (`tools/make_server_pack.ps1`); tested with one player.
- The Apiary memo (3501) now says where a simulated hive looks for its flower: in front of the hive and one block
  lower. EMI shows the Sifter Array's recipes as "Reclamation Sifting" instead of a raw key.
- The first Tom's Simple Storage quest now rewards a Paint Kit, because dyes are scarce early on.
- **Cheaper honey in the Array:** 16 mB a run instead of 50, so a bucket boosts about a stack of gravel (62.5 runs;
  the remainder stays in the hatch). Same for dust and every tier.
- The Productive Bees honey bucket is gold again (it rendered as a grey, almost empty bucket).

## 0.1.0-beta (2026-11-23)

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
- The Alchemistry Dissolver breaks down metals and chemistry items only. New atoms come from the Atomic Reclaimer,
  Electrolyzer and Centrifuge.
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
- Alchemistry Fusion and Fission (LuV) can still turn cheap elements into valuable ones. Their energy and time
  costs will be rebalanced.
- Not tested in multiplayer.

Report problems at https://github.com/rafacost/positronics/issues with the version, what you did, and your
`logs/latest.log` and `logs/kubejs/server.log`.
