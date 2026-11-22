# Positronics: Alpha 0.1 mod list

Target: **Minecraft 1.20.1 · Forge 47.4.0**. Alpha 0.1 scope = island → end of LV (see `pack-skeleton.md` §6).

Versions marked **(Greg-E)** are the exact files Greg-E runs together on Forge 47.4.0, so they're a known-good set. For **new** mods, take the latest 1.20.1 Forge file.

## How to set it up (CurseForge app)

1. CurseForge → Minecraft → **Create Custom Profile** → name `Positronics Alpha`, version **1.20.1**, loader **Forge 47.4.0**.
2. Add the mods below with **Add Content** (pick the file matching the version). CurseForge pulls required libraries automatically. The "Libraries" list is just for checking they're there.
3. **Manual:** copy `D:\AI_Projects\usrg_automation\usrg\build\libs\usrg-1.20.1-1.0.0.jar` (Forge port, commit `825b1f5`) into the profile's `mods` folder.
4. Launch once to the main menu, then tell me the instance path. I'll add the KubeJS scripts and configs (global rules, ProjectE lockdown, EMI cheat mode off).

> Why the CurseForge app and not copied jars: a CF-managed profile can later be **exported as a real CurseForge modpack** (a manifest of project IDs). Hand-copied third-party jars can't be published. Only our own mods (USRG, later Via Aurea and the companion mod) go in by hand.

---

## Core
| Mod (CurseForge name) | Version |
|---|---|
| GregTech CEu Modern | 1.20.1-7.5.2 (Greg-E) |
| GTM Utils (gtmutils) | 2.8.0 (Greg-E) |
| GregTech Terminals | 6.8.5-fix (Greg-E) |
| ProjectE | 1.20.1-PE1.0.1 (Greg-E) |
| Project Expansion | 1.20.1-1.1.3 (Greg-E) |
| ProjectExtended | 1.20.1-1.5.0 (Greg-E), for its `blacklist_learning` tag |
| Team ProjectE | 1.20.1-1.1.4 (Greg-E) |
| KubeJS ProjectE (kjsprojecte) | 1.20.1-1.0 (Greg-E) |
| Re-Avaritia (forge) | 1.20.1-1.3.9.8 (Greg-E), Extreme Crafting for Seed Cores |
| KubeJS | 2001.6.5-build.16 (Greg-E) |
| ProbeJS | 6.0.1 (Greg-E) |
| LootJS | 1.20.1-2.13.1 (Greg-E) |
| MoreJS | 1.20.1-0.10.1 (Greg-E) |
| Structure to KubeJS Aisles | 1.0.6 (Greg-E), a dev helper for multiblocks |
| FTB Quests / Teams / Chunks / Ultimine / Essentials | 2001.4.18 / 2001.3.2 / 2001.3.6 / 2001.1.7 / 2001.2.4 (Greg-E) |
| FTB XMod Compat | 2.1.3 (Greg-E) |
| **USRG (our Forge port)** | **manual jar**, 1.20.1-1.0.0 |

## World
| Mod | Version |
|---|---|
| **Skyblock Builder** (MelanX) | **new**: latest 1.20.1 Forge (needs LibX) |
| Forgiving Void | 1.20.1-10.0.3 (Greg-E) |
| Default World Type | 1.20.1-4.0.5 (Greg-E), to default new worlds to the skyblock type (check whether Skyblock Builder already covers this) |

## Storage and logistics
| Mod | Version |
|---|---|
| Applied Energistics 2 | 15.4.10 (Greg-E) |
| AE2 Wireless Terminals (ae2wtlib) | 15.3.3 (Greg-E) |
| ExtendedAE | 1.20-1.4.14 (Greg-E) |
| AdvancedAE | 1.3.4 (Greg-E) |
| AE2 Things | 1.2.1 (Greg-E) |
| MEGA Cells | 2.4.6 (Greg-E) |
| AppliedE | 0.14.3 (Greg-E) |
| Programmed Circuit Card | 1.20.1-1.2.9 (Greg-E) |
| Functional Storage | 1.20.1-1.2.10 (Greg-E) |
| Tom's Simple Storage | 1.20-1.7.1 (ULV/LV storage before AE2, as in Star Technology) |
| XNet | 1.20-6.1.7 (Greg-E) |
| Pipez | 1.20.1-1.2.26 (Greg-E) |
| Super Factory Manager | 4.32.0 (Greg-E) |
| Trash Cans | 1.0.18b (Greg-E) |

## Power (Tier 1 starter power)
| Mod | Version |
|---|---|
| Solar Flux Reborn | 1.20.1-20.1.11 (Greg-E) |
| Powah | 5.0.11 (Greg-E) + KubeJS Powah 1.2.1 |
| Flux Networks | 1.20.1-7.2.1.15 (Greg-E) |

## Mobs (tech only)
| Mod | Version |
|---|---|
| Hostile Neural Networks | 1.20.1-5.3.3 (Greg-E) |

## Food and survival
| Mod | Version |
|---|---|
| **Pam's HarvestCraft 2: Food Core** | **new**: latest 1.20.1 Forge |
| **Pam's HarvestCraft 2: Crops** | **new**: latest 1.20.1 Forge (check one exists) |
| **Pam's HarvestCraft 2: Trees** | **new**: 1.20.1-1.0.2 or later |
| **Spice of Life: Carrot Edition** | **new**: latest 1.20.1 Forge |
| **Tough As Nails** + **Serene Seasons** (+ GlitchCore) | 9.2.0.171 / 9.1.0.3. **In from day 1** (decided 2026-11-19); quests teach thirst, temperature and seasons |
| **Botany Pots** | 13.0.43. **In from day 1** |

## Instance fixes applied on the first launch (2026-11-19)
- Copied in from Greg-E (CurseForge didn't install them): LDLib 1.0.49 and Configuration 3.1.0 (**hard GTCEu deps**), GTM Utils 2.8.0, Structure to KubeJS Aisles, KubeJS Powah, FastLeafDecay, XL Packets 1.20.1. Plus our `usrg-1.20.1-1.0.0.jar`.
- Disabled `appliedenergistics2-forge-15.4.12` (duplicate; ae2wtlib 15.4.1 needs `15.5.9-uelm`).
- Removed JMI (needs JourneyMap 5.x; JourneyMap here is 6.0.7).
- Disabled `snoopy_apothecary_craft` (pulled in by mistake).
- Polymorph 0.49.11 needs JEI ≥ 15.57.0.207 → disabled it and used 0.49.10 from Greg-E. **Better fix later:** update JEI in the CurseForge app, then re-enable 0.49.11.
- JourneyMap 6.0.7 crashes GTCEu 7.5.3 (`NoClassDefFoundError: journeymap/client/api/display/Displayable`, because JM 6 changed its API) → disabled it and used **JourneyMap 5.10.3** from Greg-E. **Pin JourneyMap to 5.x in CurseForge.**
- The `gravestonecurioscompat.mixins.json does not specify "minVersion"` error line is harmless (a log warning only).
- ⚠ Hand-copied jars aren't CurseForge-managed. Before export, replace each through CurseForge or keep them as allowed overrides.

## QoL and client
| Mod | Version |
|---|---|
| EMI | 1.1.22+1.20.1 (Greg-E) |
| JEI | 15.20.0.129 (Greg-E) |
| Jade | 11.13.2 (Greg-E) |
| JourneyMap + JMI | 5.10.3 + 0.14-48 (Greg-E) |
| Mouse Tweaks | 2.25.1 (Greg-E) |
| AppleSkin | 2.5.1 (Greg-E) |
| Controlling + Searchables | 12.0.2 + 1.0.3 (Greg-E) |
| FastSuite | 5.1.2 (Greg-E) |
| Clumps | 12.0.0.4 (Greg-E) |
| Embeddium | 0.3.31 (Greg-E) |
| FastLeafDecay | 32 (Greg-E) |
| Polymorph | 0.49.10 (Greg-E) |
| Crafting Tweaks | 18.2.8 (Greg-E) |
| Trash Slot | 15.1.3 (Greg-E) |
| Toast Control | 8.0.3 (Greg-E) |
| Legendary Tooltips + Great Scrollable Tooltips | 1.4.5 + 15.5.0 (Greg-E) |
| Angel Block Renewed | 1.3 (Greg-E), place a block in mid-air (skyblock start) |
| Construction Wand | 2.11 (Greg-E) |
| Connected Glass | 1.1.14 (Greg-E) |
| CTM | 1.1.10 (Greg-E) |
| Tool Belt | 1.20.03 (Greg-E) |
| Backpacked | 3.0.9 (Greg-E) |
| Waystones | 14.1.20 (Greg-E), open decision, fine for alpha |
| Gravestone + Curios compat | 1.0.35 + 3.0.0 (Greg-E) |
| Right Click Harvest | 4.6.1 (Greg-E) |
| Simple Backups | 3.1.18 (Greg-E) |
| Default Options | 18.0.5 (Greg-E) |
| Hide Experimental Warning | 1.2 (Greg-E) |
| AllTheLeaks, Packet Fixer, XL Packets | 1.1.1 / 3.3.1 / 1.0.5 (Greg-E) |

## Libraries (CurseForge should add these; check they're present)
LDLib 1.0.49 · Rhino 2001.2.3-build.10 · Architectury 9.2.14 · FTB Library 2001.2.12 · Item Filters 2001.1.0-build.59 · Glodium 1.20-1.5 · GuideME 20.1.14 · Titanium 3.8.32 · RFToolsBase 5.0.7 · McJtyLib 8.0.10 · HammerLib 20.1.50 · Placebo 8.6.3 · Apothic Attributes 1.3.7 · Curios 5.14.1 · Patchouli 84.1 · Kotlin for Forge 4.12.0 · Cloth Config 11.1.136 · Bookshelf 20.2.15 · Balm 7.3.38 · Configuration 3.1.0 · Framework 0.8.0 · Fusion 1.3.8 · SuperMartijn642 Core/Config Lib 1.1.20 / 1.1.8 · Iceberg 1.1.25 · Prism 1.0.5 · Resourceful Lib/Config 2.1.29 / 2.1.3 · Botarium 2.3.4 · Jamlib 1.3.5 · Cucumber 7.0.16 · LibX (for Skyblock Builder)

## Deliberately not in Alpha 0.1
Productive Bees, Alchemistry/ChemLib, Immersive Engineering, Thermal, Ad Astra + Ad Extendra, Stargate Journey, Ender IO, Just Dire Things, PackagedAuto, Via Aurea, the companion mod. **Never:** magic mods, Mekanism, Create, Garden of Glass, CobbleForDays (USRG covers it).
