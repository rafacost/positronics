# New mods: integration plan (for discussion)

Added 2026-11-20: **Alchemistry** (+ ChemLib, AlchemyLib, KubeJS Alchemistry, AE2 Alchemistry addon), **Productive Bees**, **Immersive Engineering** (+ IE Productive Bees processing), **Ad Astra**, **Stargate Journey**. All load cleanly with the pack (test server, 114 mods).

Each of them can **bypass the pack's core rules** (no ores, EMC only from processing, strata as the only resource source) if left at defaults. So each entry below has three parts: **where** it enters, **what it's for**, and **what we lock**.

| Mod | Enters at | Role in Positronics | Must lock / change |
|---|---|---|---|
| **Productive Bees** | The Calla (LV) | **Optional booster path.** Bees make special honeys and waxes that GT machines and the Calla Paddy accept as optional inputs for speed or yield. Bee products also make lubricant, glue and fertilizer. | **Remove all resource bees** (iron, gold, ore and gem bees, anything producing a metal or gem): they'd bypass strata. Keep "nature" bees (honey, wax, plant and food). **No natural bee spawning** fits our no-spawn rule: the first bees come from a quest or the shop (a bee in a cage). |
| **Immersive Engineering** | The Calla to Lud, **pinpoint only** | Garden Cloche (crops), wires and wire coils (decorative power), Kinetic Dynamo or Windmill as an optional early FE source, Fermenter/Squeezer for bio-ethanol (polyethylene path), and the **bee-product processing** add-on. | **Disable the excavator and mineral veins** (a virtual ore source). Remove or ignore IE's coke oven, blast furnace and arc furnace from progression (never required). IE ore worldgen is irrelevant (void world) but disable it anyway. |
| **Alchemistry** | The Dogan (EV), as the "Dogan Chemistry" side chapter | The **chemistry mod**: Dissolver, Combiner, Atomizer, Liquifier, Fusion/Fission. Elements from ChemLib become a late **alternative refining route** for rare elements. | **Fence the Dissolver:** only allow dissolving our own Strata and selected GT intermediates (KubeJS Alchemistry can remove recipes), never arbitrary items. **No EMC** on ChemLib elements or compounds (already true: everything starts at 0). Fusion/Fission produce only from elements, never from ordinary items. |
| **Ad Astra** | The Cradle (HV): Moon, Mars; The Dogan → Fedic: outer planets | Space travel. Planets are **new resource regions**: their ores are the *only* mineable ores in the pack, by design (whitelisted in `no_ores.js` per dimension). That makes space a real reason to go. | Gate rockets by Clearance (rocket recipes need the tier's hull or card). Decide which planet ores are allowed and whether they overlap strata (suggestion: planets give a bonus *alternative* source of Seed III and IV materials). Oxygen and fuel from GT chemistry. |
| **Stargate Journey** | The Doors (UHV) | The **endgame Door**. The Stargate is assembled at Clearance 10 from UHV parts, and the final quest dials the first gate. | Re-recipe all gate, DHD and naquadah parts with GT UHV materials (Stargate Journey has its own naquadah: unify with GT's). Disable natural Stargate structure generation (void world: probably irrelevant). |

## Questions for you
1. **Bees:** OK to remove *all* resource bees and keep bees as boosters only? Or allow a few late-game resource bees (e.g. ZPM+) as an alternative strata source?
2. **Space ores:** should Ad Astra planets have mineable ores (the one exception to "no ores"), or only planet-specific blocks and fluids?
3. **Alchemistry:** a late alternative refining route (my suggestion), or mainly flavour (elements as ingredients for a few special items)?
4. **IE:** keep the Garden Cloche, wires and bee processing only, or also allow its windmill and dynamo as an early power option alongside the Emergency Solar?

Once these are answered I'll write the KubeJS locks first (so nothing leaks while you play), then a chapter for each.
