# Positronics: signature multiblocks

Draft 0.1, 2026-11-19. Each region (chapter) gets at least one **big, memorable multiblock** that is the "landmark" of that tier. Our own designs, built with the **GTCEu KubeJS multiblock API** (`GTCEuStartupEvents.registry('gtceu:machine')` + `FactoryBlockPattern`), the same approach Greg-E uses but none of its machines. Build the structure in a test world, then export it with **Structure to KubeJS Aisles** (already in the pack).

Visual identity: an **NCP casing family** (off-white industrial panels with a teal positronic stripe). Start with tinted GT casings; repaint later.

Rules:
- Every multiblock **speeds up or unlocks** a tier. Most also have a slower single-block path. The exceptions are marked **(gate)**.
- **Size grows with tier**: ~5×5 early → 15×15+ late. Endgame builds should be events that take an evening.
- Each one uses that tier's **Positronic Core** or Clearance Card as a controller ingredient, so the landmark sits right on the tier gate.

---

## Clearance 1 · River Crossing (ULV)
### Reclamation Sifter: 5×5×4
- **What:** processes Strata grits (Seed I) with **4 parallel** and LV-style byproducts **early**, as the reward for the first multiblock.
- **Inputs:** grits + water. **Power:** ULV (2 energy hatches allowed, so 1A LV fits too).
- **Lore:** "River Crossing's first rebuilt machine: it sifts the void-dust that the generators pull in."
- **Teaches:** hatches, buses, and the multiblock preview with the GT terminal.

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
