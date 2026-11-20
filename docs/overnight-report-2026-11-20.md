# Overnight report: 2026-11-20

Autonomous session while you slept. Everything below is committed in `D:\AI_Projects\Positronics` and deployed to the instance. **To test: close the game fully, start it, make a NEW world** (startup scripts, new items and USRG config only load on a full restart).

## How I tested without the client
`tools/server-test.ps1` boots a **dedicated Forge server** (in the scratchpad) with the instance's mods (minus client-only ones) and this repo's files. It creates a fresh skyblock world and dumps:
- the full **item registry** (12,355 items): every quest and strata item is validated against it;
- the exact **capacity of every star tier**: the Positronic Core recipes match a full star to the exact EMC value;
- the real **recipes** of critical early items, which is how I found the ULV deadlocks below.

Final state: **7/7 startup scripts and 12/12 server scripts, 0 errors, 0 warnings, no recipe conflicts**, server reaches "Done" and generates the Waste Lands island.

## What's new (commits c5249dc → b0187de)

### 1. Fixes from your playtest
- **Glass:** GT's `hardGlassRecipes` blocks sand → glass. Hammered **dust** now smelts into glass (sand → dust → glass).
- **Campfire:** GT's `harderCharcoalRecipe` makes the vanilla campfire uncraftable. New **rough campfire** from logs and sticks.
- **USRG 1.1.1** installed (right-click a stack, left-click one item). **Hopper removed** from the kit.
- **String** from Pam's fibre crops (3 cotton, flax, jute, sisal or kenaf → 1 string): no spiders needed.

### 2. A playable path past the Waste Lands
- **Strata (seed grits): 37 of them across Seed I–V**, from one data file (`tools/data/strata.json` → `tools/make_strata.py`). It generates the items, the processing recipes, the USRG Ore Generator lists for each tier and the EMC whitelist.
  - Macerator: stratum → its dust, plus byproducts on better machines. Furnace (Seed I): stratum → 3 nuggets.
  - **The trickle:** hammering gravel in the world now sometimes pops a Seed I stratum. A sifter automates it.
  - **Enrichment:** in a Mixer, 4 strata from the tier below + acid, with the next Positronic Core as a catalyst that is never used up, give 1 *chosen* next-tier stratum.
  - USRG: **Ore Generator re-enabled**. T1 list = Seed I … T5 = Seed V. Its recipe needs an iron block + copper + your cobblestone generator.
- **Tier 1 "Foundation" machines (ULV, steam optional):** Reclamation Crusher, Smelter, Furnace, Compressor, Extractor, Forge Hammer and Sifter (`gtceu:ulv_reclamation_*`). They run GT's own recipe types up to 8 EU/t.
  - **ULV alloys** at 7 EU/t: bronze, red alloy, tin alloy, cupronickel, and **steel from iron + coal dust (no coke oven)**. Wrought iron by re-smelting iron. Molten tin alloy in an LV extractor (the Greg-E lesson).
- **Three ULV deadlocks fixed** (GT's stock recipes assume ores and LV machines):
  1. GT's ULV solar panel needs HV circuits, and Solar Flux tier 1 has **no recipe** in this pack → **NCP Emergency Solar**, a cheap ULV panel.
  2. Glass tubes (needed for vacuum tubes, the ULV circuit) only had ≥16 EU/t recipes → hand recipe from glass panes, plus a 7 EU/t alloy-smelter recipe from dust.
  3. The hand resistor needed carbon dust (LV) → a coal-dust variant.
- **Gates:**
  - **Positronic Cores I–V:** 9×9 Extreme Crafting with a **completely full** star in the centre (exact `StoredEMC` match). The Extreme Crafting Table is craftable at ULV.
  - Stars per Core:

    | Core | Star | EMC |
    |---|---|---|
    | I | Klein Vier | 3.2M |
    | II | Klein Omega | 51.2M |
    | III | Magnum Zwei | 819M |
    | IV | Magnum Omega | 209.7B |
    | V | Colossal Vier | 53.7T |

  - **Beam Capacitor** = Antimatter Relay MK1, re-recipe'd for ULV. It burns your production into a Klein Star (collectors stay removed). **Klein Star Ein** re-recipe'd too (its stock recipe needs Mobius fuel from the removed philosopher's stone).
  - **Clearance Cards 1–10:** card 1 by hand around Core I (the core is kept); cards 2–10 in an assembler at their own tier (Cores 2/3/4/5 as catalysts for cards 2/4/6/8; the **Final Star** for card 10).
  - **Hull gates:** every LV → UHV machine hull needs the previous Clearance Card as a catalyst. LV hulls are hand-craftable with card 1.
  - **USRG tier upgrades** are assembled at their tier with that tier's Core as catalyst.
  - **Final Star:** a new endgame recipe (full Gargantuan Omega + Core V + UHV parts); the power-flower recipe is removed.
- **Positronic Memory:** EMC exists only on the raw outputs of strata lines (dusts and their ingots), valued per seed tier (128 / 1,024 / 8,192 / 65,536 / 524,288). Everything else stays at 0.

### 3. Ten quest chapters, ULV to endgame
`tools/data/quests.py` → `tools/make_quests.py`. **130 quests + the 11 Waste Lands quests.** Every task and reward item is validated against the registry, IDs are stable hashes (regenerating keeps progress), and quests are laid out automatically by dependency depth.

| # | Chapter | Tier / Card | Highlights |
|---|---|---|---|
| 1 | River Crossing | ULV / 1 | trickle, wrought iron, GT tools, ULV hull, vacuum tubes, solar, Reclamation machines, alloys, Ore Generator, rubber, Positronic Memory, Beam Capacitor, Core I, **Reclamation Sifter Array**, optional steam |
| 2 | The Calla | LV / 2 | LV hull and circuits, components, workshop, chemistry, sulfuric acid, buses and hatches, cupronickel coils, **EBF**, farms, **Calla Paddy**, Core II, Seed II |
| 3 | Lud | MV / 3 | aluminium, silicon, polyethylene, chips, integrated circuits, **AE2 + autocrafting**, USRG Tier 2, kanthal, Core III, Seed III |
| 4 | The Cradle | HV / 4 | stainless steel, cleanroom, PVC, microprocessors, USRG Tier 3 |
| 5 | The Dogan | EV / 5 | titanium, nichrome, distillation, vacuum freezer, SBR, LCR, nanoprocessors, Core IV, Seed IV |
| 6 | Fedic | IV / 6 | tungstensteel, RTM, PTFE, platinum group, quantum processors, USRG Tier 4 |
| 7 | End-World I | LuV / 7 | LuV hull, HSS-G, **assembly line**, large machines, ruridit, quantum mainframe, Core V, Seed V |
| 8 | End-World II | ZPM / 8 | fusion Mk I, naquadah, crystal processors, computation, USRG Tier 5 |
| 9 | The Beams | UV / 9 | fusion Mk II, tritanium, darmstadtium, wetware |
| 10 | The Doors | UHV / 10 | fusion Mk III, neutronium, the last superconductor, full Gargantuan Omega, **Final Star**, **Open a Door** |

### 4. First signature multiblocks (EXPERIMENTAL)
- **Reclamation Sifter Array** (ULV): a 3×3×3 box of solid steel casings, hollow centre, controller in the middle of the front face. It runs sifter recipes with hatches and overclocking.
- **Calla Paddy** (LV): a 5×5 glasshouse (casing ring around 3×3 dirt, glass walls and roof). It has its own recipe type: **97 Pam's crops** from a seed that is never consumed + water (fertilizer doubles the harvest).
- Registration is verified on the server; **whether the structures form needs your in-game check** (use the GT terminal preview).

## Decisions I made that you should review
1. **Each Core is built one tier before its strata are needed.** Seed III's chrome is needed for HV stainless steel, Seed IV's tungsten for IV, Seed V's naquadah for ZPM. So Core III is built at MV, IV at EV, V at LuV. My first draft had them at HV, IV and ZPM, which was a deadlock.
2. **Star sizes and EMC values are first guesses.** Example: Core I = 3.2M EMC ≈ 25,000 Seed I dusts ≈ 40 minutes of ~20 T1 Ore Generators feeding a capacitor. Tune in `gates.js` (`POS_CORE_STARS`) and `strata.json` (`emc_per_tier`).
3. **Enrichment is deterministic.** Each new stratum has one source stratum from the tier below (cycled; a programmed circuit tells them apart), so players choose what they make.
4. **Field generators are kept out of the Core recipes.** They need ender pearls and eyes, and there are no mobs.
5. **The companion mod isn't needed yet:** everything so far fits in KubeJS. It becomes worth it for the Beam Reactor, the vending terminal UI and tech mob fabrication.

## Known gaps / next steps
- **Mob items (ender pearls, leather, wool, bones, slime):** Hostile Neural Networks needs kills to train its data models, and nothing spawns. Plan: quest rewards that give **pre-trained data models** (NBT), or an NCP "Andy Unit" fabricator. Ender pearls are also needed for GT field generators (LV+).
- **Not in the mod list yet:** Productive Bees, Alchemistry, Ad Astra, Stargate Journey. The quests mention them only as "coming later" (the Door quest is a checkmark).
- **Still to write:** the remaining multiblocks from `multiblocks.md`, the Beam Reactor, the NCP Vending Terminal plus a shop chapter (Scrip is already earned).
- **Placeholder art:** strata, cores, cards, hammer, scrip and dust textures are generated pixel art (`tools/make_assets.py`).
- **Upper tiers are drawn, not yet balanced:** stock GT recipes beyond LV may still hide skyblock-specific gaps (things GT expects from ores or mobs). Use the recipe-watch list in `server-test.ps1` to audit each tier as you reach it.
- **Before publishing, add through CurseForge** the jars I hand-copied into the instance: LDLib, Configuration, GTM Utils, StructureToKubeJS, KubeJS Powah, FastLeafDecay, XL Packets, SquatGrow, Polymorph 0.49.10, JourneyMap 5.10.3.

## Test checklist for the morning
1. New world → Waste Lands quests; hammer **gravel** → sometimes a stratum pops out.
2. Smelt a stratum → nuggets. Craft wrought iron → GT tools → ULV hull.
3. Glass panes → glass tubes → vacuum tube by hand. NCP Emergency Solar → power a Reclamation Crusher.
4. Build the Ore Generator → it produces Seed I strata; right-click to collect.
5. Look up Positronic Core I in EMI: the star in the centre should show "full" (3,200,000 EMC).
6. Build the Reclamation Sifter Array and the Calla Paddy: do the structures form?
7. Open the quest book: 11 chapters, and the arrows between chapters work.
