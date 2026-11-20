# New mods: integration plan

Added 2026-11-20: **Alchemistry** (+ ChemLib, AlchemyLib, KubeJS Alchemistry, AE2 Alchemistry addon), **Productive Bees**, **Immersive Engineering**, **Ad Astra**, **Stargate Journey**. All load cleanly (test server, 114 mods).

## Decisions (2026-11-20)

| Mod | Decision | Status |
|---|---|---|
| **Immersive Engineering** | **Garden Cloche only.** | ✅ Done: every other IE recipe removed (excavator/veins, coke oven, blast furnace, wires); the cloche has a GT recipe at LV; the IE bee-processing add-on's recipes are removed. |
| **Productive Bees** | Keep resource bees: "if one likes the bee path, it deserves to *bee* rewarded". **Balance instead of removal.** | Proposal below |
| **Ad Astra + Stargate Journey** | **HV and higher are gated by ores found only on other planets.** Ships first, then stargates: a distant planet holds naquadah and the first Stargate, which you bring home. | Proposal below |
| **Alchemistry** | **Make it shine:** elements as quest rewards, crafting with real chemical components, chemistry fully integrated with GregTech. | Proposal below |

## Proposal A: Space gates the high tiers

Ad Astra planets (from the jar): **Moon** (rocket tier 1), **Mars** (tier 2), **Venus and Mercury** (tier 3), **Glacio** (tier 4, a different star system: Proxima Centauri). Stargate Journey adds worlds reachable only by gate: Abydos, Chulak, Lantea, Athos, Tollan, Rima, Cavum Tenebrae, Unitas, Destiny.

GregTech ore veins are added **only in these dimensions** (KubeJS `GTCEuServerEvents.oreVeins`). Our no-ore rule becomes "no ores *on Earth*": the loot strip only applies outside the space and stargate dimensions.

| Gate | Built at | Destination | Ores there (GT veins) | Unlocks |
|---|---|---|---|---|
| Tier 1 rocket | **MV** (Lud) | **Moon** | chromite, cobaltite, vanadium magnetite | chrome → kanthal and **stainless steel → HV** |
| Tier 2 rocket | **HV** (The Cradle) | **Mars** | rutile, ilmenite, magnesite | titanium → **EV** |
| Tier 3 rocket | **EV** (The Dogan) | **Venus / Mercury** | scheelite, tungstate, molybdenite, cooperite (platinum) | tungsten and the platinum group → **IV** |
| Tier 4 rocket | **IV** (Fedic) | **Glacio** (Proxima) | iridium, osmium, monazite, pyrochlore **+ naquadah** + **the first Stargate** (a ruin to find) | LuV, and naquadah → ZPM. Bring the gate home. |
| **Stargate** | **LuV / ZPM** | Abydos, Chulak, Lantea… | naquadah-rich, trinium, rarer elements | ZPM → UHV materials; the Doors endgame |

How this fits what already exists:
- **The Strata stay:** Seed III–V become the **"automate it at home" step after discovery**. Each Positronic Core's recipe needs that planet's material (e.g. Core III needs Moon chrome), so you go to space first, then automate on the island with the Ore Generator and enrichment.
- **Rockets** get GT recipes gated by Clearance. Fuel and oxygen come from GT chemistry.
- **Stargate Journey's naquadah** is unified with GregTech's naquadah. The gate and DHD get GT recipes at ZPM/UV.

Open details for you: planet ore lists are a first pass (we can make the Moon fancier); and is the Glacio Stargate a structure you find (needs a small datapack), or parts you dig up and assemble?

## Proposal B: Bees rewarded, but inside the system
- **Resource bees stay**, but their combs **centrifuge (GT centrifuge only) into Strata of the matching tier**, not raw metals. An iron bee gives Ferrous Stratum; a titanium bee gives Titanic Stratum. Bees become a strong, *alternative* strata stream (no core needed for the bees' own tier), so the bee player is rewarded and the processing lines stay meaningful.
- **Bee tiers follow Clearance:** you can only breed or obtain a resource bee whose tier you've reached (catalyst items or eggs gated by the Clearance Card or Core).
- **Nature bees** (honey, wax, pollen) feed the **booster path**: special honeys as optional inputs that speed up GT machines and the Calla Paddy.
- First bees come from a quest or the shop (nothing spawns).

## Proposal C: Chemistry that shines (Alchemistry + ChemLib + GT)
1. **The Periodic Table chapter** (side path, from LV): every element you obtain completes a quest; completing a row or group rewards **element samples** (ChemLib items) and Scrip. Elements are quest rewards throughout the main chapters too, as "NCP lab samples".
2. **One chemistry, not two:** ChemLib elements and compounds are **unified with GT materials** (tags and conversion recipes), so a ChemLib "Iron" and GT iron dust are interchangeable, and GT fluids map to ChemLib gases.
3. **Real chemistry in GT recipes:** selected GT recipes (circuits, batteries, catalysts, coils) take **ChemLib compounds** as inputs (e.g. silicon dioxide, sodium hydroxide, sulfuric acid), so you build actual molecules to progress.
4. **Alchemistry machines as tiered GT-style machines:**
   - **Dissolver** (LV+): breaks Strata and processed materials into elements, an alternative refining route.
   - **Combiner** (MV+): builds compounds.
   - **Atomizer and Liquifier:** gases.
   - **Fusion and Fission** (LuV+): element transmutation as an endgame route to rare elements.
5. **Guard rails:** dissolving works only on Strata and processed materials (never arbitrary items), and elements and compounds carry no EMC. Fusion and fission are energy-hungry, so they never undercut the planets.

## Next steps
Once you confirm A (planet mapping), B and C, I'll implement in this order:
1. **Locks:** planet ores only off-Earth; bee comb → strata.
2. **Space:** veins, rockets and quests.
3. **Chemistry:** unification, the Periodic Table chapter, then GT recipes using compounds.
4. **Bees:** chapter.
