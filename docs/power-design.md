# Positronics power design (decided 2026-11-23)

Three layers, one per stage of the game:

1. **Solar is the backbone** (ULV → ZPM). Free once built, daylight only, and it takes space.
2. **Fuel is spending EMC** (LV → EV, taught at MV). Atoms burn day and night, but every bucket costs EMC that could have bought materials.
3. **The Beam Reactor is the payoff** (UV → UHV). It burns charged ProjectExpansion stars, so the EMC sink becomes the power plant.

Steam stays an optional ULV side chapter. GregTech plasma generators stay available at the end as GT's own route; nothing requires them.

Rules carried over: no Nether or End inputs (no lava, no blaze), no coke ovens or pyrolyse chains, and nothing in
ULV → LV may require steam.

## 1. Solar: the backbone (built)

`kubejs/server_scripts/positronics/foundation/power.js`, `config/solarflux/panels.cfg`.

- **Panels.** Solar Flux panels make FE. Each tier gives half an amp of its GT voltage in daylight:

  | Panel | FE/t | EU/t |
  |---|---|---|
  | sp_1 (ULV) | 16 | 4 |
  | sp_2 (LV) | 64 | 16 |
  | sp_3 (MV) | 256 | 64 |
  | sp_4 (HV) | 1,024 | 256 |
  | sp_5 (EV) | 4,096 | 1,024 |
  | sp_6 (IV) | 16,384 | 4,096 |
  | sp_7 (LuV) | 65,536 | 16,384 |
  | sp_8 (ZPM) | 262,144 | 65,536 |

- **Upgrading panels.** Each tier is 4 panels of the tier below plus that tier's circuit and two plates. Compacting saves space and never gains or loses power.
- **Converter.** A GT Energy Converter turns FE into EU at 4 FE = 1 EU. GT machines never take raw FE.
- **Night storage.**
  - ULV: the Powah starter Energy Cell.
  - LV and up: GT battery buffers.
- **ULV backups.**
  - The Powah starter Furnator, which burns coal (8 carbon atoms).
  - GT's ULV solar panel, which gives 8 EU/t with no converter but costs a hull.
- **Moving FE.** Flux Networks carries FE without cables. It still ends at a converter.

Nothing to change here.

## 2. Fuel: spending EMC (to build)

### The problem: a fuel loop that already exists

Atoms are EMC: carbon, hydrogen and oxygen are worth 8 EMC each, and the tablet sells them back at the same price. So any fuel made from atoms is EMC turned into EU, and the conversion rate is the whole balance question. Today that rate is accidental and far too high.

| Route (live today, from LV) | Cost | Fluid | GT burn value | EU | EU per EMC |
|---|---|---|---|---|---|
| 1 C + 4 H by hand → methane → LV extractor | 40 EMC | 250 mB methane | 2 mB = 7 ticks at 32 EU/t (112 EU/mB) | 28,000 | **700** |
| 2 C + 6 H + 1 O by hand → ethanol → LV extractor | 72 EMC | 250 mB ethanol | 1 mB = 6 ticks at 32 EU/t (192 EU/mB) | 48,000 | **667** |

The burn values come from `gtceu-1.20.1-7.5.3.jar`, `FuelRecipes`. They're raw recipe values, before any machine efficiency.

What that means at today's rate: the Ore Generator → 2 Reclaimers → Beam Capacitor chain makes about 58,000 EMC an hour. Burned as ethanol, that's about **38.7M EU an hour, or 537 EU/t, all day and night**. That's four MV amps from a ULV-era setup, and it makes solar pointless from LV onwards.

### The fix: one exchange rate

- **Target: about 140 EU per EMC.** At that rate, the whole Ore Generator chain burned as fuel gives about 113 EU/t, just under one MV amp. That's comparable to four MV panels averaged over day and night, but it costs every EMC you earn. It's worth it for night power, compact builds or a fast start, and it's a bad deal as a way of life.
- **The lever is the burn value, not the bridge.** Changing the bridge would also change the rocket fuel: `space.js` distils 1,000 mB of ethanol into 500 Ad Astra fuel. So instead, KubeJS removes GT's methane and ethanol fuel recipes and adds new ones:

  | Fuel | GT today | New | Per 250 mB bridged | EU per EMC |
  |---|---|---|---|---|
  | Methane (gas turbine) | 2 mB → 7 t × 32 EU/t | **10 mB → 7 t × 32 EU/t** (22.4 EU/mB) | 5,600 EU | 140 |
  | Ethanol (combustion) | 1 mB → 6 t × 32 EU/t | **5 mB → 6 t × 32 EU/t** (38.4 EU/mB) | 9,600 EU | 133 |

- **Rule for the future.** Any fuel fluid that gets an atom bridge gets its burn value set from this rate. Today only methane and ethanol have bridges. ChemLib also has ethane, ethylene, propane and butane, and ethylene is a GT gas-turbine fuel, so none of these get a bridge unless it's priced by this rule.
- **Coal, in the Furnator and in steam boilers, gets checked against the same rate.** One coal is 8 carbon atoms, 64 EMC. Its EU per EMC still has to be measured in game. If it's above about 140, coal gets the same treatment.

### Where the player meets it

- **Real Power (#0208, The Calla, LV).** Keep the grey line that says turbines and combustion generators exist. Nothing more.
- **New quest in Lud (MV): "The Gas Line".** Task: an MV gas turbine and a bucket of methane.
  - The memo explains the trade in the storyteller voice: "every bucket is EMC you didn't spend on iron".
  - The numbers go in a tip under the same memo number: "A bucket of methane is about 22,000 EU and costs 160 EMC in atoms."
- **Large Gas Turbine (HV/EV).** Optional quest in the Cradle or the Dogan, for players who went the fuel way.

## 3. The Beam Reactor: the payoff (to build, UV)

From `docs/multiblocks.md`: a 15×15×15 multiblock that burns charged ProjectExpansion stars (Magnum → Gargantuan → Compact Sun) for EU.

- **Rate: well above the fuel rate.** The starting proposal is about 1,000 EU per EMC, at least 7× the fuel line. Then burning stars beats burning atoms, and filling stars stays the endgame's purpose. The exact figure is set once the star capacities and UV/UHV loads are measured.
- **The star is consumed.** It's an empty-the-star loop: EMC goes in, EU comes out. Nothing is duplicated.
- **Build:** a GT KubeJS multiblock with stars as input items, run as a generator recipe. The ProjectExpansion star NBT holds the EMC, so each star tier is its own recipe, keyed on a full star.

## 4. What gets cut or left alone

- **Powah past the starter tier.** Its chain needs dielectric paste (lava) and its reactors would be a second fuel line. Confirmed and done: every generator past the starter Furnator is removed. The higher cells stay as Powah ships them (dielectric paste needs lava or blaze powder, so they're out of reach for now); re-recipe them per tier later if night storage needs them.
- **GT steam turbines and boilers.** They stay as GT ships them. Water plus coal is already covered by the coal check above.
- **GT plasma generators (LuV+).** These are endgame, from fusion. Nitrogen plasma is 1 mB → 64 t × 2,048 EU/t, about 131,000 EU/mB. They stay as GT's alternative to the Beam Reactor; check them against the Beam Reactor rate when it's built.

## Build order

1. ~~`power.js`: replace the methane and ethanol fuel recipes (section 2).~~ Done 2026-11-23. The new ids are
   `positronics:gas_turbine/power/methane` and `positronics:combustion_generator/power/ethanol`; both were checked on the
   test server (32 EU/t output, 7 and 6 ticks), and GT's originals are gone.
2. Measure coal in game: the Furnator and an LP solid boiler. Fix it if it's above the rate.
3. Write "The Gas Line" quest and its tip in Lud.
4. ~~Powah cut.~~ Done 2026-11-23: every Powah generator past the starter Furnator (furnators, solar panels, magmators,
   thermo generators, reactors) lost its recipe. Cells, cables, batteries and the rest are untouched for now.
5. Beam Reactor, with the UV chapter.
