# USRG feature draft: per-dimension generator outputs

Draft 2026-11-21, for the USRG maintainer (Codex). Source checked: `D:\AI_Projects\usrg_automation\usrg`
at `7304de2` (USRG 1.1.1). Positronics needs it for the Space Program; nothing in the pack depends on it yet.

## What it does

A generator that stands in a configured dimension makes **that world's ground** instead of its normal output.
A Cobblestone Generator on the Moon makes moon cobblestone; an Ore Generator on Mars makes Martian minerals.
Each entry can require a **minimum generator tier**, so the tier upgrades (which Positronics gates behind
Positronic Cores) also gate the planets. Below that tier, the generator keeps its normal output.

Why: Positronics planets have no GregTech veins (`kubejs/server_scripts/positronics/space/space.js`); their
ground is their ore. This turns each planet into an outpost: a generator, FTB Chunks to keep it loaded, and
an AE2 Quantum Network Bridge to ship the output home. All tech, no quarry mod.

## Config (common)

One new list, so ForgeConfigSpec stays static (no dynamic keys):

```toml
[dimensionOutputs]
	#Per-dimension outputs. Format: generator|dimension|minTier|modid:item*weight
	#generator = the block id path (oregenerator, cobblegenerator, sandgenerator, ...).
	#When a generator stands in a dimension with entries for it, and its tier >= minTier, the entries for
	#that dimension replace its normal output (weighted pick, itemsPerCycle of the chosen item, same as the
	#Ore Generator). Weights use the same parser as oreGeneratorItems.
	entries = []
```

Example (what Positronics would ship; tiers follow the rocket tiers):

```toml
entries = [
  "cobblegenerator|ad_astra:moon|3|ad_astra:moon_cobblestone*1.0",
  "sandgenerator|ad_astra:moon|3|ad_astra:moon_sand*1.0",
  "sandgenerator|ad_astra:mars|3|ad_astra:mars_sand*1.0",
  "sandgenerator|ad_astra:venus|4|ad_astra:venus_sand*1.0",
  "cobblegenerator|ad_astra:mercury|4|ad_astra:mercury_cobblestone*1.0",
  "cobblegenerator|ad_astra:glacio|5|ad_astra:glacio_cobblestone*1.0"
]
```

## Code sketch

1. **`setup/Config.java`**
   - `public static ForgeConfigSpec.ConfigValue<List<? extends String>> DIMENSION_OUTPUTS;` defined in its own
     `push("dimensionOutputs")` block.
   - `public static List<String> getDimensionItems(String generatorId, ResourceLocation dimension, int tier)`:
     split each entry on `|` (exactly 4 parts, otherwise skip it with one `LOGGER.warn`), match generator and
     dimension, keep `item*weight` when `tier >= minTier`. Returns an empty list when nothing matches.
   - Parse the list once into a `Map<String, Map<ResourceLocation, List<Entry>>>`, rebuilt on
     `ModConfigEvent.Loading` / `Reloading`, so the tick path never splits strings.

2. **Move the weighted picker up.** `BaseRandomGeneratorTile` has `parseConfiguredItems`, `WeightedItem` and the
   roll in `getRandomItem`. Move the parser and the roll into a small helper (e.g. `util/WeightedOutputs`), so
   `BaseGeneratorTile` can use them for every generator, not only the Ore and Dye ones.

3. **`blocks/BaseGeneratorTile.java`, the one hook.** Both tick paths (`tickTierOne` and the powered path) call
   `getGenerationStack()`. Wrap it:

   ```java
   protected ItemStack getGenerationStack() {
       ItemStack dim = getDimensionStack();
       return dim.isEmpty() ? getDefaultGenerationStack() : dim;  // today's body becomes getDefaultGenerationStack()
   }

   private ItemStack getDimensionStack() {
       if (level == null) return ItemStack.EMPTY;
       ResourceLocation key = ForgeRegistries.BLOCKS.getKey(getBlockState().getBlock());
       List<WeightedItem> entries = dimensionCache.computeIfAbsent(tier,
           t -> WeightedOutputs.parse(Config.getDimensionItems(key.getPath(), level.dimension().location(), t)));
       Item item = WeightedOutputs.roll(entries, level.random);
       return item == null ? ItemStack.EMPTY : new ItemStack(item, itemsPerGenCycle);
   }
   ```

   `dimensionCache` is a per-tile `Map<Integer, List<WeightedItem>>`, like `resolvedItems`. Clear both on
   config reload and on `upgradeTo`. A block entity never changes dimension, so the tier is the only key.

4. **Tooltip/GUI (nice to have):** when dimension outputs are active, show "Local ground: <dimension>" in the
   generator GUI or the Jade/WTHIT line, so players know why the output changed.

## Edge cases to cover

- An unknown item in an entry: skip it with one warning (same as `parseConfiguredItems` does today).
- Entries for a dimension, but none at this tier: use the normal output, not the coal-ore fallback.
- `generate_dust = true` generators (clay, glowstone...): the dimension output replaces both the block and dust paths.
- The Dye and Ore generators already pick from weighted lists: dimension entries replace their tier list too.

## Test plan

1. Empty `entries`: every generator behaves exactly as 1.1.1 (regression).
2. A `cobblegenerator|minecraft:the_nether|1|minecraft:netherrack*1.0` entry in a dev world: a T1 cobblestone
   generator in the Nether makes netherrack; the same block in the Overworld makes cobblestone.
3. minTier 3: a T2 generator in that dimension keeps its normal output; after `upgradeTo(3)` it switches.
4. `/reload` (or editing the config while the server runs): new entries apply without a restart.
