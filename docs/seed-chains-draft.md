# Seed I and Seed II chains: draft 0.1

2026-11-19. All names are placeholders until the theme is chosen. Nothing here reuses Greg-E content.

## 0. The core idea: three layers per seed tier

| Layer | What it is | How you get it | Role |
|---|---|---|---|
| **Stream** | **Grits**: several grit types per tier | USRG Ore Generator (weighted list in config) | Renewable raw material; never transmutable |
| **Line** | GT processing of the grits → dusts, ingots and byproducts | Tier machines | Turns the stream into that tier's resources. Better machines give more byproducts |
| **Keystone** | **Seed Core** (one per tier): an Extreme Crafting recipe with a **fully charged star** in the centre | Mass production plus an EMC "burn" into a star | The hard gate. **Doable only with automation**, in practice |

### The EMC lever: "charge the star"
- ProjectE's **Antimatter Relay** burns items fed into its input into EMC and charges the Klein Star in its slot (`RelayMK1BlockEntity`: `getBurn`, `inputBurnProgress`, item EMC charging). Collectors stay removed, so **all the EMC comes from your own production**.
- Each Seed Core needs a star **filled to 100%**, matched by NBT in the recipe. The core consumes the star, so it's a real **EMC sink**.
- By hand you'd need to feed a relay for hours. With pipes from your generators and lines into the relay, it runs on its own. That's the "only if you automate" pressure.
- The star ladder spans the whole pack: **Klein (ProjectE) → Magnum → Colossal → Gargantuan (ProjectExpansion) → Compact Sun → Final Star** (endgame).

### Rules
- **Grits and Seed Cores have no EMC** (blacklisted from learning). Only the line outputs (dusts and ingots) can be learned.
- GT machine recipes aren't covered by the crafting mapper, so **dust and ingot EMC values are set by hand** in `custom_emc.json` (table in §4).
- The **Relay MK1** comes back (it's removed in Greg-E) as the "star charger", gated at ULV. MK2 and MK3 unlock at later tiers. Collectors and power flowers stay removed.

---

> **Update 2026-11-19:** Steam and ULV are merged into **Tier 1 "Foundation" (ULV)**; steam is optional. Wherever this draft says "Steam machine", read "Tier 1 single-output machine (ULV, or its steam equivalent)". Both must accept the same recipes so the steam route stays a real alternative. Seed I Core must not require steam-only items (the "Steam machine casings" below become ULV casings).

## 1. Bootstrap (island → Tier 1): before any seed

The island has no ores and no Ore Generator yet. The **trickle** gives just enough metal for steam machines, the ULV hull and the tablet:
- USRG **T1 cobble, gravel, sand and dirt generators** are craftable from the start (cheap recipes).
- **Gravel** → Steam Macerator → **Silt**.
- **Silt washing:** 8 Silt + water in a cauldron (KubeJS right-click), or a Steam Forge Hammer → 1 **Trace Grit** (rotating: ferrous, cupric or stannic by programmed circuit in the Steam Alloy Smelter).
- **Design target:** steam machines and the first ULV machines in about **1.5–2 hours**. It's deliberately slow and annoying, so the Ore Generator feels like freedom.

## 2. Seed I: the "first stratum" (Steam → ULV → early LV)

### 2.1 Stream: USRG Ore Generator T1 list

The 1:1 USRG works as-is: only `oreGeneratorItems` changes.

| Grit | Weight | Steam product (macerator, single output) | LV byproducts (ore washer, centrifuge, thermal centrifuge) |
|---|---|---|---|
| Ferrous Grit | 0.40 | Iron dust | Nickel (10%), Manganese (5%) |
| Cupric Grit | 0.30 | Copper dust | Gold (5%), Cobalt (3%) |
| Stannic Grit | 0.20 | Tin dust | Zinc (10%), Antimony (3%) |
| Carbonic Grit | 0.25 | Coal dust | Graphite (5%), Sulfur (8%) |
| Plumbic Grit | 0.10 | Lead dust | Silver (5%) |
| Nickelous Grit | 0.08 | Nickel dust | Cobalt (5%) |
| Redstone Grit | 0.10 | Redstone | Glowstone dust (2%) |

Why it's shaped this way:
- **Steam machines have one output slot**, so each grit gives its main dust there. The byproducts only appear at LV, which rewards electrifying.
- **Every material needed for LV is in Seed I** (iron/steel, copper, tin, bronze, red alloy, cupronickel, lead, coal). So LV can't get stuck on a later seed. Nickel is a direct grit because cupronickel heating coils are needed to build LV machines.
- Tin Alloy (iron + tin) comes from this tier, and the **LV extractor recipe for molten Tin Alloy** (the Greg-E lesson) is included from day 1.

### 2.2 The line
- **Steam:** macerate → smelt. This is 1:1 and slow on purpose.
- **ULV/LV:** grit → macerator → *crushed* → ore washer → *purified* → centrifuge → dust + byproducts. The LV route yields **about 1.5×** plus byproducts.

### 2.3 Keystone: **Seed I Core**

**What it unlocks:** the **USRG Ore Generator recipe** (its KubeJS recipe needs the Seed I Core) and **Key ULV → LV**.
**When:** the ULV era (the tablet and Relay MK1 are available).

**Extreme Crafting 9×9** (`avaritia:shaped_table`). The Extreme Crafting Table itself is re-recipe'd to be craftable at ULV.

```
centre      : Klein Star Sphere, FULL (12.8M EMC), forge:nbt match
inner ring  : 8x Compressed Cobblestone ×4 (6,561 cobble each)
middle ring : 16x Bronze Block, 8x Steel Block, 4x Wrought Iron Block   (placeholders, tune)
outer ring  : 16x ULV Machine Hull, 8x ULV Machine Casing                 (placeholders, tune)
```

Why it's hard: the star needs **12.8M EMC**. Example: a typical 12-generator ULV line gives about 1,000 EMC/s of processed output fed into the relay, which takes **about 3.5 hours** of automated running. By hand it's effectively impossible. The 52k compressed cobble needs automated cobble generators and compressors.

**Chicken and egg check:** the Ore Generator needs the Core, and the Core needs a production line before the Ore Generator exists. The **trickle (§1) plus cobble generators** are that line. So the trickle must give enough EMC to reach 12.8M: ~3–4 h on cobble and silt automation alone, or faster with better trickle machines. ⚠ **This is the main balance knob to test in Alpha 0.1.** If it's too slow, drop to Klein Star Vier (3.2M) for Seed I and keep Sphere for Seed II.

## 3. Seed II: the "deep stratum" (LV → MV)

### 3.1 Stream
In Alpha 0.1, USRG is 1:1 with a single Ore Generator list, so Seed II comes from **enrichment**:
- **LV Chemical Bath** (or Autoclave): 4 Seed I grit (any) + 100 mB *Enrichment Solution* + **Seed II Core as a non-consumed catalyst** → 1 Seed II grit (weighted outputs).
- *Enrichment Solution* is made from the Seed I line: sulfuric acid + redstone + salt water, an early chemistry taste.
- **Later, with tiered USRG:** the T2 Ore Generator gets the Seed II list directly, and its upgrade recipe needs the Seed II Core.

| Grit | Weight | Main product | Byproducts | Unlocks |
|---|---|---|---|---|
| Bauxitic Grit | 0.30 | Bauxite dust → **Aluminium** (EBF) | Gallium (5%), Rutile (3%) | MV hulls |
| Siliceous Grit | 0.25 | Silicon dioxide → **Silicon** (EBF) | Glass dust | MV circuits |
| Semimetal Grit | 0.12 | **Gallium + Arsenic** | — | Diodes, GaAs |
| Precious Grit | 0.12 | **Gold** | Silver (20%) | Good circuits |
| Saline Grit | 0.15 | **Salt** → Sodium/Chlorine | Lithium (5%), Potassium (5%) | Batteries, chemistry |
| Sulfuric Grit | 0.10 | **Sulfur** | Pyrite → Iron | Sulfuric acid |
| Antimonial Grit | 0.06 | **Antimony** | Cobalt | Battery alloy |

### 3.2 Line
LV processing as for Seed I. MV machines add a **chemical bath** path (mercury or sodium persulfate) for doubled byproducts, which is a hook for the chemistry side chapter.

### 3.3 Keystone: **Seed II Core**

**What it unlocks:** Seed II enrichment (as a catalyst), **Key LV → MV**, and later the USRG T2 Ore Generator.
**When:** late LV, aimed at about 1 week of casual play from the start.

```
centre      : Magnum Star Ein, FULL (ProjectExpansion; capacity to verify, ≈ Klein Omega ×4)
inner ring  : 16x Cupronickel Coil Block, 8x LV Electric Motor, 8x LV Robot Arm
middle ring : 32x Steel Block, 16x Red Alloy Block, 16x Tin Alloy Block
outer ring  : 16x LV Machine Hull, 8x Basic Electronic Circuit ×?   (tune)
               + 4x Compressed Cobblestone ×5
```

Why it's hard: the star is roughly 200M EMC (to be verified). That needs an LV processing and crafting line feeding the relay for **~8–10 hours**, plus an **AE2 or Functional Storage** buffer, which naturally teaches the logistics mods.

## 4. EMC table (starting values, tune in Alpha)

| Item | EMC | Note |
|---|---|---|
| Cobblestone / Silt | 1 / 2 | The trickle floor |
| Grits (all) | **0, not learnable** | Keeps generators meaningful |
| Iron / Copper / Tin / Lead / Nickel dust | 128 / 96 / 128 / 160 / 192 | Ingot = dust value |
| Coal dust / Redstone | 64 / 48 | |
| Bronze / Steel / Cupronickel / Red Alloy | via crafting mapper or set by hand | Check for leaks |
| Seed Cores, Keys | **0, not learnable** | Gates must never be transmutable |
| Aluminium / Silicon / Gold / Gallium | 512 / 384 / 2,048 / 1,024 | Seed II |

## 5. Things to verify before building

1. **Relay MK1** burns items and charges stars as described. Its **bonus EMC** (`bonusEMC`, `getBonusToAdd` on MK2/MK3) is a small free trickle: measure it, and remove it if it matters.
2. The **NBT key for stored EMC on stars** in PE 1.0.1, for `forge:nbt` matching. If exact-NBT matching is fragile, the companion mod provides a "full star" ingredient type.
3. **ProjectExpansion star capacities** (Magnum, Colossal, Gargantuan) and what the **Final Star** does by default.
4. Re-Avaritia **`avaritia:shaped_table`** accepts `forge:nbt` ingredients.
5. GT 7.5.2 KubeJS: `notConsumable(...)` for the Seed II Core catalyst in a Chemical Bath recipe.
6. **Tablet and stars (settled 2026-11-23):** a star in the tablet's input slots fills from personal EMC (`SlotInput`: `removeEmc` from the player, `insertEmc` into the star); it moves EMC, never duplicates it. The user is fine with it: the tablet charges stars by hand, the Relay is only the automation.

## 6. Alpha 0.1 test plan for the seeds
- Time from new world → Ore Generator (target 4–6 h), and Ore Generator → Seed II Core (target 10–15 h of active play).
- Watch whether players hit a dead end without automation. That's intended, but the quests must **teach** the relay and pipes before the Core.
- Count the EMC per second of a "normal" ULV and LV setup, and set the star tiers from real numbers, not guesses.
