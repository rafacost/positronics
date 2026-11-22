# Positronics: signature multiblocks

Draft 0.1, 2026-11-19. Each region (chapter) gets at least one **big, memorable multiblock** that is the "landmark" of that tier. Our own designs, built with the **GTCEu KubeJS multiblock API** (`GTCEuStartupEvents.registry('gtceu:machine')` + `FactoryBlockPattern`), the same approach Greg-E uses but none of its machines. Build the structure in a test world, then export it with **Structure to KubeJS Aisles** (already in the pack).

Visual identity: an **NCP casing family** (off-white industrial panels with a teal positronic stripe). Start with tinted GT casings; repaint later.

Rules:
- Every multiblock **speeds up or unlocks** a tier. Most also have a slower single-block path. The exceptions are marked **(gate)**.
- **Size grows with tier**: ~5×5 early → 15×15+ late. Endgame builds should be events that take an evening.
- Each one uses that tier's **Positronic Core** or Clearance Card as a controller ingredient, so the landmark sits right on the tier gate.

---

## Clearance 1 · River Crossing (ULV)
### Reclamation Sifter Array: 3×3×3 (built, 2026-11-21)
- **Why build it:** a multiblock must beat copying single machines. It costs a one-shot unique item (a **full Klein Star Ein**, plus 4 ULV Sifters) and gives an **exponential return**.
- **Deep sifting** (its own recipe type, `gtceu:reclamation_sifting`): 1 gravel → Seed I strata in the Ore Generator's own mix, 40 ticks a run.

  | Circuit | Energy | Strata per gravel | With honey (circuit +10, 50 mB) |
  |---|---|---|---|
  | 1 | ULV (7 EU/t) | 4 | 8 |
  | 2 | LV (30 EU/t) | 16 | 32 |
  | 3 | MV (120 EU/t) | 64 | 128 |

- **Dust sifting** (built 2026-11-22): rock dust (`positronics:dust`) on the same circuits and honey. Each circuit drops what that era's mod needs, so the circuit is the gate. Tom's Simple Storage runs from early ULV (the first redstone) to the end of LV; AE2 starts at MV. Expected items per dust, honey doubles every row:

  | Circuit | Quartz | Lapis | Rough Diamond | Quartzite | Certus dust | Sky dust | Glowstone dust |
  |---|---|---|---|---|---|---|---|
  | 1 (ULV, Tom's) | 0.30 | 0.15 | 0.02 | none | none | none | none |
  | 2 (LV, Tom's wireless) | 0.50 | 0.30 | 0.05 | 0.20 | none | none | none |
  | 3 (MV, AE2) | 1.00 | 0.60 | 0.10 | 0.40 | 0.80 | 0.25 | 0.20 |

  Quartzite is the only source for LV emitters and sensors; glowstone dust is the only source for AE2 terminals and blank patterns (GT makes it only from ores). Two Rough Diamonds and a hammer make one diamond. None of these items has EMC.
- **Feed:** the USRG **Gravel Generator** (a full Ein star). Generators are the raw stream (USRG tiers: 30 / 60 / 240 / 960 / 3,840 items a minute); the Array is the yield multiplier. The two multiply.
- **Throttle:** downstream. Reclaimers (12 strata a minute each at ULV) and Crushers (about 8) have to eat it, and bees have to make the honey.
- **Hatches:** up to 8 output buses (seven strata, and a ULV bus holds one stack), 2 fluid inputs, 2 item inputs, 1–2 energy hatches. A basic working build is 15 casings, 1 input bus, 7 output buses, 1 maintenance hatch and 1 ULV energy hatch. All of these are hand-craftable at ULV (`foundation.js`): GregTech only makes ULV buses and the ULV voltage coil in the LV assembler, and puts its maintenance hatch on an LV hull.
- **Teaches:** hatches, buses, circuits, the GT terminal preview. Then it teaches that the bottleneck moves.

### The booster ladder (plan; build each with its tier)
The Array, and later multiblocks, take one optional booster fluid. Plain honey works at every tier (×2); each tier's own booster replaces it (×4).

| Tier | Array sifts | Booster | Source |
|---|---|---|---|
| ULV | gravel → Seed I | honey ×2 (built) | `productivebees:honey` |
| LV | gravel → Seed I | **Strata Honey** ×4 | source to decide (resource bees were shut off 2026-11-22) |
| MV | gravel → Seed I | **Royal Honey** ×4 | the Calla Apiary Hall |
| HV | moon sand | **Lunar Lubricant** ×4 | GT lubricant + moon dust, mixer |
| EV | mars sand | **Martian Lubricant** ×4 | GT lubricant + mars dust |
| IV | venus sand, mercury cobblestone | **Venusian / Mercurial Lubricant** ×4 | the same, per planet |
| LuV | glacio cobblestone | **Glacian Lubricant** ×4 | the same, iridium/osmium-laced |

- Planet rows: the Array gets regolith recipes at 4× the single sifter (`space.js`), ×16 with the planet's lube. Seed II–V stay gated by the Cores and the Ore Generator tiers.
- Planet regolith comes from **USRG generators placed on the planet** (per-dimension outputs, `docs/usrg-dimension-outputs.md`), with FTB Chunks and an AE2 Quantum Network Bridge home. No quarry mod.

### USRG generators (built, 2026-11-21)
No water, no lava: every copy eats a full Klein star, by chapter. Ein (River Crossing): Cobblestone, Gravel, Sand, Dirt and the Ore Generator. Zwei (the Calla): Clay, Grass, Fungus, Dye. Drei (Lud): Snow, Ice, Obsidian. Planets: dimension outputs, gated by generator tier. Off: Redstone (it skips Rubric), Quartz, Glowstone, Nether, Soul, End, the Crushed ones, Dust, Clean.

## Clearance 2 · The Calla (LV)
### Calla Paddy: 9×9×3 (flat field)
- **What:** a big farm block: water channels and soil around a controller. It grows Pam's crops and rice from seeds plus water plus fertilizer, **with no world farmland needed**.
- **Bee hook:** an optional honey input (from the bee path) gives **+50% yield**. A Via Aurea "blessed" honey later gives +100% through craftsmanship quality.
- **Lore:** the Calla were farmers, so the factory grows food first.
### Calla Apiary Hall: 7×7×5 (MV, optional)
- **What:** houses bee combs from Productive Bees, processes them into **special honeys** (lubricant, coolant, catalyst), which other multiblocks accept as optional boosters. The whole bee path stays optional.

## Clearance 3 · Lud (MV)
### Lud Salvage Works: 11×11×7 **(gate)**
- **What:** the tier's **automation exam**. It takes bulk Seed II products plus scrap and outputs **salvaged components** (motors, pistons, circuits) at a discount. It's **needed for Clearance 3** because the card recipe takes 64 salvaged components, which forces the player into AE2 autocrafting.
- **Lore:** Lud is a ruined city full of machines; reclaim them.
### Seed Enrichment Vat: 5×5×5
- The **Seed II** enrichment (Seed I grits → Seed II grits, with the Positronic Core II as catalyst) at 8 parallel. The LV Chemical Bath stays as the slow path.

## Clearance 4 · The Cradle (HV)
### Cradle Power Station: 13×9×9
- **What:** a large combustion and gas turbine hall styled as a monorail station, with high efficiency. The first "real" power plant.
- **Lore:** the Cradle of Lud was the great station where the monorails slept.
### Launch Gantry: 9×9×21 (tall)
- **What:** assembles Ad Astra rocket parts (tiers 1–2) at a discount. A launch-pad landmark for the first space trips.

## Clearance 5 · The Dogan (EV)
### Dogan Control Station: 9×9×6
- **What:** a big chemical complex (a large chemical reactor with **16 parallel**). It also runs the **Alchemistry fence**: element dissolving happens here at a fixed EMC cost, so chemistry can't become a free replicator.
- **Lore:** Dogans were NCP's control bunkers, full of screens and old procedures.
### Dogan Archive: 7×7×7
- **What:** research and data (GT data sticks and orbs) for the assembly-line research of later tiers. Flavour: it reads old NCP manuals.

## Clearance 6 · Fedic (IV)
### Fedic Fabrication Plant: 15×9×11
- **What:** mass assembly of GT components (motors, pumps, robot arms, emitters, sensors), with high parallel. It's the mid-game "make everything faster" machine.

## Clearance 7–8 · End-World (LuV–ZPM)
### Strata Deep Drill: 11×11×25 (very tall)
- **What:** drills Strata **IV–V** straight out of the void beneath the island, as a fluid "deep slurry" that a processing chain turns into rare grits. A USRG T4/T5 alternative with higher yield for a huge build.
- **Catalyst:** Positronic Core IV/V (not consumed).
### Andy Unit Fabricator: 9×9×7
- **What:** **tech-only mobs**. It fabricates mob drops with Hostile Neural Network data models at high parallel, or spawns a mob in a sealed chamber (decide later). This is the only way mobs exist in the pack.

## Clearance 9–10 · The Beams (UV–UHV)
### Beam Reactor: 15×15×15
- **What:** burns **charged ProjectExpansion stars** (Magnum → Gargantuan → Compact Sun) for enormous EU. EMC in, EU out, so the sink becomes power.
### Beam Restoration Arrays ×6: 21×21×9 each **(gate)**
- **What:** six endgame megaprojects, **one per Beam**. Each consumes huge amounts of tier materials, a Final-tier star and a lot of time, and outputs a **Beam Key**. Six Beam Keys unlock **Clearance 10 → The Doors**.
- They're built one by one over the endgame, as the pack's "wonders". Quests celebrate each one.

## The Doors (endgame)
### Door Foundry: 13×13×13
- **What:** assembles **Stargate Journey** parts (gate ring segments, DHD components) from UHV materials. The final quest is to **activate the first Door** and travel.

---

## Build order (implementation)
1. **Alpha 0.1:** Reclamation Sifter and Calla Paddy (both small, test the API and the pattern workflow).
2. **Alpha 0.2:** Lud Salvage Works and Seed Enrichment Vat (the MV automation exam).
3. Later tiers as each region's content is written.

## Open
- The NCP casing textures (who paints them; placeholders until then).
- Andy Unit Fabricator: drops only, or sealed-chamber spawning?
- Are the 6 Beams named (e.g. by their old guardians), or just Beam I–VI? The guardian names mix robot and mythic. Shardik is an NCP cyborg bear, which fits; the others lean mythic, so maybe skip them.
