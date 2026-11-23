# Positronics: mod list and tier skeleton

Draft 0.1, 2026-11-19. Target: **Minecraft 1.20.1 · Forge 47.4.0 · Java 17**.
Pillars: tech-only GregTech skyblock · ProjectE as a knowledge bank (learn and transmute, never generate) · no magic · no natural mob spawns · survival pressure from food and water, not combat.

Status legend: ✅ verified on 1.20.1 Forge (running in Greg-E or confirmed online) · 🔎 still to verify · 🛠 our own mod

---

## 1. Mod list

### Core
| Mod | Role | Status |
|---|---|---|
| GregTech CEu Modern 7.5.2 + gtmutils, expandedgt, gregtechterminals | The progression spine | ✅ |
| ProjectE + TeamProjectE + kjsprojecte | EMC knowledge bank (generators removed) | ✅ |
| ProjectExpansion | **Stars only**: Magnum, Colossal, Gargantuan, Compact Sun, Final Star. Collectors, power flowers and relays removed | ✅ |
| KubeJS 2001 + ProbeJS + LootJS + MoreJS | Recipes, gates, pack logic | ✅ |
| FTB Quests, Teams, Library, Chunks, Ultimine, XMod Compat | Quests, coins, teams | ✅ |
| **USRG** (Forge port) | Resource generators, later tiered and powered | 🛠 port in progress (1:1 first) |
| **Companion mod** (name TBD) | Gates and progression logic that KubeJS can't do cleanly | 🛠 later |

### World and rules
| Mod | Role | Status |
|---|---|---|
| Skyblock Builder (MelanX) + LibX | Custom start island from a structure file | 🔎 1.20.1 Forge file |
| Forgiving Void | Fall into the void → land on the island | ✅ |
| In Control! (McJty) | Backup for spawn rules if a mod ignores game rules | 🔎 optional |

### Logistics and storage
AE2 + AdvancedAE, ExtendedAE, AE2-Things, MEGA Cells, ae2wtlib, AppliedE (EMC in ME, gated) · Functional Storage · XNet · Pipez · Super Factory Manager · PackagedAuto: all ✅ (Greg-E stack).

### Power
Powah · Solar Flux Reborn · Flux Networks: ✅. **Superseded 2026-11-23 by `docs/power-design.md`:** solar is the backbone, fuel from atoms is priced as spending EMC, and the Beam Reactor is the endgame.

### Side-tech (pinpoint use only)
| Mod | Where it fits | Status |
|---|---|---|
| Immersive Engineering | Pinpoint: Garden Cloche (crop growing on an island), wire and fence aesthetics, maybe its excavator **disabled** | 🔎 |
| Thermal Series | Pinpoint: Phytogenic Insolator for crops, or specific dynamos. Ore processing **disabled** | 🔎 |
| Hostile Neural Networks | All mob drops come from simulation | ✅ |
| Ad Astra + Ad Extendra | Space progression (planets as resource tiers) | ✅ |
| Stargate Journey | Endgame goal | ✅ (officially supports 1.20.1 Forge) |
| Avaritia (Re-Avaritia) | Extreme Crafting for star amalgamation; tech-themed, keep if needed | ✅ optional |

### Bees (optional booster path)
| Mod | Role | Status |
|---|---|---|
| Productive Bees | Special honeys and combs become **machine boosters**: lubricants, catalysts and coolants that GT recipes accept as optional inputs for speed or yield | 🔎 version; remove magic-themed bees by data pack |

### Chemistry
| Mod | Role | Status |
|---|---|---|
| GregTech chemistry | Main chemistry content (already huge) | ✅ |
| Alchemistry + ChemLib | Dissolver/Combiner/Fission/Fusion as a side chapter. **Must be fenced off from EMC**, or it becomes a second free replicator | 🔎 |

### Food and survival
| Mod | Role | Status |
|---|---|---|
| Pam's HarvestCraft 2: Food Core, Crops, Trees | Food variety. Seeds come from the shop, EMC or a generator, since a skyblock has no garden bushes | ✅ Core/Trees; 🔎 Crops file; 🔎 Food Extended (listed 1.20–1.20.4) |
| Spice of Life: Carrot Edition | Rewards variety with permanent hearts | ✅ |
| Tough As Nails + Serene Seasons (or Homeostatic) | Thirst and temperature. **Clean water comes from tech** (GT distilled water, purifiers) | ✅ TAN 9.2.0.171 (development may have stopped); Homeostatic is the maintained alternative |
| Botany Pots | Compact crop growing on a skyblock | 🔎 |

### Optional devotional layer (after USRG is done)
| Mod | Role | Status |
|---|---|---|
| **Via Aurea** (Forge backport) | Hand-craft era before steam; goldsmith tools; later the beekeeping line (§4) | 🛠 after USRG |
| Curios, Patchouli | Via Aurea dependencies | ✅ |

### QoL and client
EMI (cheat mode **off** in `config/emi.css`), JEI, Jade, JourneyMap + JMI, Mouse Tweaks, AppleSkin, Controlling, Searchables, FastSuite, Clumps, Embeddium, ModernFix (🔎), Waystones (🔎: keep or gate?), backpacks (🔎).

### Explicitly out
All magic or occult mods (Botania family, Blood Magic, Sanguine Neural Networks, Enchanted, Enchanting Infuser, Relics, Simply Swords runic), Garden of Glass, Mekanism, Create, Galacticraft (no Forge 1.20.1 build).

---

## 2. Global rules (KubeJS and config, from day 1)

1. **No ores:** no GT ore veins; ore blocks give nothing; GT miners and drilling rigs removed. Resources come only from generators, processing and EMC.
2. **No natural mobs:** game rules `doMobSpawning`, `doPatrolSpawning`, `doTraderSpawning`, `doWardenSpawning` and `doInsomnia` set to false once per world. Villager trading off. Mobs exist only through tech (powered spawner, a companion-mod machine, or HNN simulation).
3. **ProjectE lockdown:** remove every collector, relay, condenser, power flower and alchemical chest recipe. The transmutation tablet is gated behind a ULV circuit, and EMC links and AE2-EMC behind GT circuit tiers. Smithing, fallback and vanilla recipe mappers off. Hide the unused items in EMI.
4. **No EMC leaks:** use mod-native compacting instead of reversible crafting recipes. Avaritia/Extreme and chemistry outputs are kept out of the EMC mapper.
5. **Coins and shop:** quests reward coins; the vending machine is tech-crafted.

---

## 3. Tier skeleton

> **Implementation update (2026-11-20):** each Positronic Core is now built **one tier before** its strata are needed: Core III at MV, IV at EV, V at LuV (HV hulls need Seed III chrome, IV needs Seed IV tungsten, ZPM needs Seed V naquadah). The implemented progression is described in `docs/overnight-report-2026-11-20.md`; the table below is the original plan.

Placeholder names (**Seed I–V**, **Key LV**, …) get renamed once the theme and book are chosen. Nothing here reuses Greg-E content.

| Era / GT tier | USRG | Seed material | Tier key (gates the next tier) | Side mod unlocked | Survival / food | EMC |
|---|---|---|---|---|---|---|
| **0. Island start** | **T1** (free, as today): cobble, dirt, sand, gravel, clay | — | — | (Via Aurea hand-craft, optional) | Pam's Trees and basic crops; rainwater or boiled water | Tablet not yet available |
| **1. Foundation (ULV)**, *steam optional* | T1 | **Seed I** (from the Ore Generator, T1 list) | Key ULV | ProjectE tablet (learn only) · **Optional Steam chapter** | Botany Pots · purified water machine | Learn and transmute opens; Relay MK1 |
| **LV** | **T2** (FE-powered) | **Seed II** | Key LV | Bees (Productive Bees basics: honeys as boosters) · HNN basics | Spice of Life progression | AE2 storage |
| **MV** | T2 | Seed II | Key MV | AE2 autocrafting · Alchemistry basics | IE Garden Cloche (pinpoint) | AppliedE EMC module |
| **HV** | **T3** | **Seed III** | Key HV | Ad Astra (Moon, Mars) · Thermal insolator (pinpoint) | Advanced food chains | EMC links (low tiers) |
| **EV** | T3 | Seed III | Key EV | Advanced bees (catalyst honeys) | — | Magnum Stars craftable |
| **IV** | **T4** | **Seed IV** | Key IV | Ad Astra outer planets · advanced chemistry | — | Colossal Stars |
| **LuV** | T4 | Seed IV | Key LuV | Powered mob spawner (tech-only mobs) | — | — |
| **ZPM** | **T5** | **Seed V** | Key ZPM | Stargate Journey parts begin | — | Gargantuan Stars |
| **UV** | T5 | Seed V | Key UV | Stargate assembly | — | **Compact Sun** |
| **UHV / Endgame** | T5 | — | Final key | **Stellar Reactor** (stars → EU) · **Stargate activation** | — | **Final Star** (verify its default behaviour first) |

### Tier 1 "Foundation": ULV first, steam optional (decided 2026-11-19)
- **Power without steam:** a starter FE source (Solar Flux tier 1 and/or Powah starter generators) → **ULV FE→EU converter** (re-recipe'd to be cheap) → ULV machines.
- **ULV machine set:** our own simple machines (smelter, crusher, press; single output like steam machines) plus a few stock GT ULV parts.
- **Steel without coke:** a ULV smelter recipe makes iron + carbon → steel, slow but hands-off. **No coke oven or primitive blast furnace in the required path.**
- **Steam = an optional side chapter** for players who enjoy it. GT steam machines and boilers stay craftable. The incentive is a **cheaper bootstrap** (no circuits or redstone needed) and coin rewards, **never a required item**.
- **Immersive Engineering stays pinpoint only.** Its coke oven and blast furnace are never required.
- **Design check:** nothing in ULV → LV may require a steam-only or IE-only item.

Rules of thumb:
- Each USRG tier unlocks at a GT tier, and its upgrade recipe needs that tier's key.
- Each tier's Ore Generator list = that tier's seed material, which feeds the processing line for that tier's resources.
- **Every side mod is optional to the main line, except where the tier key needs one product from it.** Bees, chemistry and food stay boosters and choices, never hard walls (exceptions decided deliberately).

---

## 4. Via Aurea ideas for later (after USRG)

Same boundaries as Via Aurea itself: prayer and craftsmanship, never spells; Christ-centred; no occult.
- **Beekeeping line with a patron saint:** St. Ambrose is the patron saint of beekeepers. Possible items: "Ambrosian" hive tools, apiary craftsmanship quality affecting honey yield.
- **Beeswax candles:** liturgical candles are traditionally beeswax, and the Easter *Exsultet* praises "the work of bees". A natural bee → wax → candle chain in the devotional workstation.
- **Blessed products (candles, honey)** as optional quality boosters in the bee booster path. They improve output the way the Craftsmanship Quality system does, not through supernatural effects.

---

## 5. Companion mod: what it should own

Use KubeJS first; the companion mod covers only what KubeJS can't do cleanly:
- Tier and stage gating API (stages linked to quest completion and the tier keys), readable by KubeJS.
- **Stellar Reactor** (stars → EU), unless a GT KubeJS multiblock covers it.
- Tech-only mob spawner, if Ender IO or other options don't fit.
- The vending machine block and its shop UI (tech-crafted).
- A bee-booster hook, if GT recipe modifiers can't express "optional honey input → bonus".

---

## 6. Alpha 0.1 scope (first testable build)

Goal: play from the island to **LV complete** and judge the feel.
- **Mods:** Core + World + Logistics (storage only) + QoL + USRG 1:1 port + Pam's Core/Trees + Spice of Life.
- **Global rules §2** in KubeJS.
- **Seed I and Seed II** placeholder chains (the USRG T1 Ore Generator list plus GT processing).
- **Quests:** Island, Steam, ULV, LV chapters (short), coins, a shop with ~10 entries.
- **Explicit LV checks**, learned from Greg-E: a molten Tin Alloy source for Cupronickel coils; an early Glue source for buses and hatches; EMI cheat mode off.
- **Out of Alpha 0.1:** tiered USRG, bees, chemistry, Via Aurea, space, stars.

## 7. Open decisions

1. The book and theme (Stephen King) → names for the seeds, keys and chapters.
2. TAN or Homeostatic, or no thirst at all in the alpha.
3. Keep Waystones, backpacks and Avaritia?
4. Whether IE and Thermal are in at all, or replaced by companion-mod machines.
5. The seed material design for Seed I and II (the first real content task).
