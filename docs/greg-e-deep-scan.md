# Greg-E deep scan: reference for a tech-only skyblock pack

Scanned 2026-11-19 from `D:\AI_Projects\Greg-E` (cu5tmtp/Greg-E main) and the installed instance `D:\Minecraft\Instances\Greg-E` (205 jars, Forge 47.4.0, MC 1.20.1).

**Ground rule:** Greg-E has no license (all rights reserved). This document records *patterns and lessons* only. None of its content (Common Earth, specks, dusts, alloys, quests, textures, `gregecore` mod) is to be copied. Our pack starts from scratch.

---

## 1. What Greg-E actually is (structure)

| Layer | What's there | Size |
|---|---|---|
| World | Botania **Garden of Glass** skyblock preset (`config/defaultworldtype/client-config.toml`) + Forgiving Void | — |
| Core loop | GregTech CEu 7.5.2 + ProjectE (learn-and-transmute only) | — |
| Custom content | KubeJS startup: ~50 GT material "lines", ~60 custom multiblocks, items/fluids/blocks, circuits | 120+ startup files |
| Recipes | KubeJS server scripts, organized **by voltage tier** (`gregTech/ULVchanges` … `UHVchanges`, `AVARITIA`, `euclid`, `VOID`) + `otherMods/<mod>` | ~280 files |
| Quests | FTB Quests, one chapter per GT tier + one per side mod | 35 chapters, ~1,000 quests (progression 119, insane voltage 75, LuV 63 …) |
| Pack-author mod | `gregecore` (coils, infusion altar, multis) | **not reusable** |

Tier chain in quests: welcome → steam → ULV → LV → MV → HV → EV → IV → LuV → ZPM → UV → UHV → "insane" → Avaritia → Euclid → Void.

## 2. Patterns worth adopting (re-implemented our own way)

### 2.1 "No ores" skyblock rule set
`kubejs/server_scripts/logicScripts/noMining.js` and `global/recipes/globalRemoves.js`:
- Breaking any `#forge:ores` block deletes it with a message; ore loot is stripped via LootJS. Exceptions are whitelisted dimensions (Ad Astra, Undergarden).
- `GTCEuServerEvents.oreVeins(e => e.removeAll())`: no GT ore generation at all.
- All GT miners, large miners and fluid drilling rigs are removed.
- Villager trades removed, trader spawning and weather off.

→ **Adopt.** It forces every resource through processing lines, which is the heart of a GT skyblock. The world preset needs a separate skyblock world mod (e.g. Skyblock Builder); USRG is a resource-generator mod, not a world generator (see §8).

### 2.2 Bootstrapping resources without ores
Greg-E: a mixer recipe makes a seed dust from basic dusts; centrifuge lines split it into many "specks"; 9 specks → pile → resource; resources can then be *learned* into EMC. Every tier has its own seed (common → deepslate → …).

→ **Adopt the shape, not the content.** We need our own original "seed material" chain per tier. USRG world generation could supply the tier-1 seed natively (e.g. a generator output), so the opening hour feels like *our* pack.

### 2.3 Taming ProjectE into a "knowledge bank"
This is the most valuable lesson. Greg-E keeps EMC as **learn + transmute**, never as **generate**:
- **Removed recipes:** all ProjectE collectors, relays, condensers, alchemical chests, philosopher's stone, and *all* ProjectExpansion power flowers, collectors, relays and advanced alchemical chests (`globalRemoves.js`). Also infinite steak/fuel and the alchemical barrel (`otherMods/projectE/removeRecipes.js`).
- **Hidden in EMI:** ~280 entries (`client_scripts/addInfoAndTooltip/jeiRemove.js`): DM/RM gear, fuels, matter tiers, Klein stars, **all ProjectExpansion stars**, compact sun, final star.
- **Re-gated recipes:** the Transmutation Tablet needs a ULV circuit; every `emc_link` tier swaps its matter ingredient for the matching GT circuit tier (ULV → UHV); AE2 EMC integration (appliede, ExtendedAE, MEGA) is gated behind GT hulls and circuits.
- **Mapper config** (`config/ProjectE/mapping.toml`): CraftingMapper on, but Smithing/Fallback/Vanilla recipe types and Avaritia off. `custom_emc.json` is ~10 KB of hand values.
- **Known pitfall:** with CraftingMapper on, any reversible crafting recipe can leak EMC. Use mod-native compacting (Functional Storage `custom_compacting`) instead of crafting reverses.

→ **Adopt wholesale**, and keep EMC generators blocked as you want.

### 2.4 Tier keys
Each tier has a custom alloy (`lvalloy` … `uhvalloy`) and circuit-slurry fluids (`lvcas` …). These act as "keys" that gate side mods and the next tier.
→ **Adopt the idea:** one signature item per tier, produced by that tier's line.

### 2.5 Economy: quest coins + shop
Most quests reward a coin (`kubejs:cc`) that is spent at a Vending Machine (FTB Quests `shop` chapter, 15 entries).
→ **Adopt**, but the shop block must be **tech-crafted**. In Greg-E it's made on the magic Infusion Altar, which is what started this discussion.

### 2.6 "One accompanying mod per tier"
The design rule from `quest.grege.lv15` is that every tier unlocks a side mod that gives an upgrade.
→ **Keep the rule, swap the mods** for tech ones (see §4).

### 2.7 Repo organization
Organizing scripts by tier and putting each other mod in its own folder made this scan easy. Reuse that layout.

## 3. Magic dependencies in Greg-E (what we must *not* inherit)

| Tier | Magic dependency |
|---|---|
| Start | Garden of Glass (Botania skyblock) world preset |
| LV | Botania unlock; Manasteel (Accelerated EBF, bender); petals (mixer); Conjuration Catalyst (vanilla line); Infusion Altar (needs a petal) → Vending Machine and 18 other items |
| MV/HV | Mana infusion; Conjuration Catalyst (Mars bacteria); Botania blocks in gtCUBES |
| EV | Offering Altar (Runic Altar + runes) |
| IV–UV | Conjuration Catalyst (vile heart, hephaestium, sedna lines); pixie dust line |
| ZPM | Blood Magic altar in assembly line; Tartarus Tower soul gems; Hellforged line |
| UHV+ | Botania, Blood Magic and Draconic items across Avaritia, Euclid and Void |

**Magic or occult mods in the jar list (drop these):** Botania, BotanicalMachinery, botanicalextramachinery, Applied Botanics, MythicBotany, Garden of Glass, kubejs_botania, Blood Magic, Sanguine Neural Networks, Enchanted (witchcraft), Enchanting Infuser, Relics, Simply Swords (runic).
**Your call:** Draconic Evolution (sci-fi energy, but dragon/chaos themed), Twilight Forest, Undergarden, L'Ender's Cataclysm (fantasy adventure, not magic systems), Artifacts.

## 4. Tech-side mods already in Greg-E (candidates to keep)

- **Core:** GTCEu + addons (gtmutils, expandedgt, gtexolegs, gregtechterminals), ProjectE + teamprojecte, KubeJS stack (kjsprojecte, morejs, lootjs, probejs), FTB suite.
- **Logistics/storage:** AE2 + addons (AdvancedAE, ExtendedAE, AE2-Things, MEGA Cells, ae2wtlib, appliede), Functional Storage, XNet, Pipez, Super Factory Manager, Modular Routers, PackagedAuto.
- **Power:** Powah, Solar Flux Reborn, Flux Networks.
- **Progression and side content:** Ad Astra + Extendra (space), Hostile Neural Networks (mob data, tech-flavoured), Avaritia (Extreme Crafting, neutronium), Just Dire Things, CobbleForDays (cobble generators).
- **Note:** Industrial Foregoing is installed but all its recipes are removed, and Ender IO's alloy smelting and SAG mill are removed. Greg-E keeps these mods only for parts.

## 5. "Extreme stars": candidate found

**ProjectExpansion** (`projectexpansion-1.20.1-1.1.3.jar`, already in Greg-E) contains:
- Star tiers: `magnum_star_*`, `colossal_star_*`, `gargantuan_star_*` (ein → zwei → drei → vier → sphere → omega), on top of ProjectE's Klein stars.
- `compact_sun`, `final_star_shard`, `final_star`.

Greg-E hides all of them and uses none of them, so they're free to take on the role you described:
- **EMC sink:** amalgamation recipes (Avaritia Extreme Crafting or a GT assembly line) that consume huge amounts of EMC-dense items into star tiers.
- **Endgame energy:** a custom GT multiblock (a "stellar reactor") that burns a charged star or Compact Sun for EU. EMC in, EU out, with no free generation, because the star must be filled from transmuted resources.

Before designing around it, verify in-game what `compact_sun` and `final_star` do by default (e.g. whether the Final Star gives infinite EMC; if so it would need gating or removal). If you find the mod you remember in another pack, compare against this.

## 6. Lessons from contributing to Greg-E

- **LV Tin Alloy gap:** GTCEu 7.5.2 Cupronickel coils need molten Tin Alloy, which only the EV Alloy Blast Smelter made. We added an LV extractor recipe (PR cu5tmtp/Greg-E#10). **Lesson:** audit every fluid input of early multiblock parts against GTCEu 7.x, because it changed several recipes.
- **Bus/hatch glue:** LV buses and hatches need Glue. Greg-E solves it with the Mechanical Sap Tap, which makes free glue with no power. **Lesson:** we'll need our own early Glue source.
- **`/reload` doesn't apply** KubeJS recipe changes in this stack; test with a full restart.
- **EMI cheat mode** ships on in `config/emi.css`; turn it off for players.

## 8. Our own mods and the version decision (added 2026-11-19)

**USRG** (`D:\AI_Projects\usrg_automation\usrg`, MIT): 18 vanilla-resource generator blocks plus 3 optional Ex Nihilo ones. They need no power and share one global speed (`BLOCK_PER_TICK`). The Random Ore generator's output list and weights come from config (`ORE_GENERATOR_ITEMS`). Builds: 1.21.1 NeoForge (master) and 1.20.1 NeoForge (branch). The 1.20.1 notes say "Tiered generators are not included in this release."
→ Tie-in: add **tiered, EU-powered generators** (USRG feature or companion mod). Point the Ore generator's list at **our own per-tier seed materials** in place of vanilla ores. This replaces Greg-E's Common Earth idea with our own mechanic, and it stays compatible with the no-ore rule.

**Via Aurea** (`…\via_aurea`, All Rights Reserved, **1.21.1 NeoForge only**, v0.6.0): devotional goldsmithing. It has the Goldsmith's Bench and Devotional Workstation, hand tools (hammer, pliers, drawplate, lapidary file), a plate → strip → wire → ring chain, Peace/Focus mechanics that drive Craftsmanship Quality, and Curios jewelry. It requires Patchouli and Curios.
→ Natural fit as the **pre-steam "hand-craft" era**: its manual metalworking mirrors GT's hand-tool stage. It's optional and light, with no impact on the GT balance.

**Version:** both of the user's mods are NeoForge. Via Aurea exists only for 1.21.1. Key mods with 1.21.1 NeoForge builds found 2026-11-19 (verify the exact latest files): GTCEu Modern (7.0.x line, July 2025, and possibly newer), Productive Bees (13.13.x), Stargate Journey (0.6.4x+), Skyblock Builder (21.1.x), ProjectExpansion (1.0.5/1.0.6), Alchemistry (2.4.5) + ChemLib community ports. Not yet confirmed: ProjectE itself on 1.21.1, Thermal, HNN, the AE2 add-ons.

### 8.1 Version check results (2026-11-19)

| Mod | 1.21.1 NeoForge | 1.20.1 Forge |
|---|---|---|
| **GTCEu Modern** | **7.0.2, Alpha only** (Jul 2025); stable line still ends there. A third-party fork ("GregTech Modern Reborn" 8.x) exists. | **7.5.2 stable** (what Greg-E runs) |
| ProjectE | PE1.1.0 (Jun 2025) | PE1.0.1 (in Greg-E) |
| ProjectExpansion | 1.0.5/1.0.6 | 1.1.3 (in Greg-E) |
| AppliedE | 1.0.5-beta (Apr 2025, possibly stale) | in Greg-E |
| AE2 / MEGA / ExtendedAE / AdvancedAE | 19.2.x / 4.11 / 2.0.1 / 1.0.0 | all in Greg-E |
| Hostile Neural Networks | 6.4.x | in Greg-E |
| Immersive Engineering | 12.4.2 | yes |
| Thermal Series | **unconfirmed**; CoFH Core is listed, Thermal not found | yes (ATM9-era) |
| Productive Bees | 13.13.x | yes |
| Stargate Journey | 0.6.4x+ | yes (officially supports 1.20.1 Forge) |
| Skyblock Builder | 21.1.x | yes |
| Alchemistry + ChemLib | 2.4.5 + community ChemLib forks | yes |
| USRG | master | 1.20.1 NeoForge 47.1 branch (uses `mods.toml`; should load on Forge 47 but needs testing) |
| Via Aurea | **only target** | would need a backport |

**Conclusion:** everything exists on 1.20.1 Forge except Via Aurea. On 1.21.1, the core mod (GTCEu) is alpha-only and Thermal is unconfirmed.

## 9. Direction decided so far

- No magic content. Keep coins and shop, the tier keys, and HNN for mob drops.
- **No natural mob spawning**: game rules plus tech-only spawning.
- **Bees as an optional booster path, not a requirement**: special honeys act as lubricants and catalysts that speed up or boost GT machines.
- **Chemistry flavour**: GTCEu chemistry plus possibly Alchemistry/ChemLib.
- Thermal and Immersive Engineering only at pinpoint places. No Mekanism, no Create.
- Companion mod for gates and progression. ProjectExpansion stars as EMC sinks and endgame power. Stargate as an endgame goal.

## 7. Suggested next steps

1. Confirm the star mod (ProjectExpansion, or the one you remember).
2. Decide on the borderline mods in §3.
3. Write the pack skeleton: USRG world preset, no-ore rules, ProjectE lockdown (§2.3), tier-key list, tech mod per tier.
4. Design our own tier-1 seed-material chain and the early glue and coil path, avoiding the two LV gaps above.
