# Positronics loading-screen tips (Darkhax "Tips" mod, decided 2026-11-23).
# Quests keep the goal, the lore and what a task needs; shortcuts, rates and tricks live here, shown at random
# on loading and saving screens. Same voice as the memos, every fact exact. "&" colour codes become section signs.
# make_tips.py writes one JSON per tip to kubejs/assets/positronics/tips/<key>.json.

TITLE = "&3NCP Field Note"

TIPS = {
    # ---------------------------------------------------------------- River Crossing: hand work
    "hammer_grades": "The stone hammer only finds iron and copper. An iron-grade hammer finds tin, coal and lead in gravel; "
                     "a steel one finds redstone and nickel in sand.",
    "mortar_grades": "Flint mortars break iron and copper. Iron-grade mortars add tin, lead and carbon; steel adds nickel.",
    "atom_ring": "A ring of 8 atoms on the crafting table turns back into 4 nuggets: iron, copper, tin, lead or nickel.",
    "firebricks": "Firebricks: mortar clay into clay dust and bricks into brick dust, mix them into fireclay dust, press it "
                  "into compressed fireclay by hand and fire it. Four firebrick make a block.",
    "wood_planks": "GregTech wood planks: a hammer and two wood pulp. A cable is a wire and a rubber plate.",
    "rubber_plate": "Rubber plate by hand: mortar two sticky resin into raw rubber dust, then smelt it.",
    "rubber_resin": "A rubber tree's own logs bleed resin most of the time. Logs you placed, or logs from a botany pot, never do.",
    "biomass": "Mortar + 8 leaves (or 4 saplings, 8 crops, 8 sugar cane) = 1 plant mass. Two plant mass = 1 cellulose.",
    "silicon_dioxide": "Mortar + 1 rock dust (sand broken with any hammer) = 1 silicon dioxide. Stone pays less than green things.",
    "sugar_cane": "Sugar cane grows in a botany pot, and it's the fastest biomass on the island.",
    "shears": "Leaves need shears. Once you have proper tools, the NCP Shop sells a reinforced pair.",
    # ---------------------------------------------------------------- Power
    "power_math": "A ULV machine pulls up to 8 EU/t, which is 32 FE/t: two Solar Flux panels per machine while the sun's up, "
                  "more if you want the cell full by dark.",
    "converter_amps": "A 1A converter passes one amp, 8 EU/t at ULV. Two machines want two amps: a second converter, or a 4A one.",
    "converter_face": "A GregTech energy converter puts EU out of its front face only. Point that face at the cable.",
    "furnator": "When the sun quits on you, the Powah Furnator burns coal. Eight carbon atoms make one coal.",
    "panel_compact": "Solar panels compact without loss: eight ULV panels and an LV circuit make two LV panels.",
    "emergency_solar": "GregTech's ULV solar panel puts 8 EU/t straight onto the cable: no converter, no 4:1 loss. "
                       "It costs a hull per panel.",
    "pipez": "Panels and energy cells push into whatever touches them. Pipez energy pipes carry FE further.",
    # ---------------------------------------------------------------- Reclamation and EMC
    "crusher_rate": "One Crusher eats about 8 strata a minute. One Ore Generator makes 30. Do the arithmetic.",
    "reclaimer_rate": "One Atomic Reclaimer keeps up with 12 botany pots of cane, or about 12 strata a minute.",
    "cane_rate": "A pot of cane grows 8 a minute, about 5,000 EMC an hour through a Reclaimer.",
    "oregen_rate": "Ore Generator -> 2 Atomic Reclaimers -> Beam Capacitor is about 58,000 EMC an hour, with nobody watching.",
    "reclaimer_menu": "The Reclaimer eats biomass (16 leaves, 8 saplings, 16 crops or cane, 2 plant mass, 8 wood pulp) "
                      "for 6 carbon, 10 hydrogen and 5 oxygen. Rock dust gives 1 silicon and 2 oxygen.",
    "rubric_crush": "Rubric strata give only their 5 silicon atoms in a Reclaimer. Want the redstone? Crush those instead.",
    "emc_link": "Pipe atoms into a Basic EMC Link (ProjectExpansion) and the EMC lands on your tablet, no hands.",
    "capacitor_loop": "Point the Reclaimer's output hopper at a Beam Capacitor with a star inside, and the star fills while you sleep.",
    "tablet_star": "In a hurry? A Klein Star in the tablet's input slots fills from your own EMC. "
                   "Not the burn slot: that one eats the star.",
    "lv_gases": "At LV, electrolysis (water) and the centrifuge (air) bring hydrogen, oxygen, nitrogen and argon, paid in EU.",
    "core_grids": "Every Positronic Core after the first wants a bigger grid: 4x4 at LV, 5x5 at MV, 7x7 at EV, 9x9 at LuV.",
    # ---------------------------------------------------------------- The Array
    "array_ladder": "Sifter Array: circuit 1 gives 4 strata a gravel at ULV. An LV energy hatch and circuit 2 make it 16; "
                    "MV and circuit 3, 64.",
    "array_honey": "Honey in the Array doubles everything: circuits 11, 12 and 13 instead of 1, 2 and 3. 50 mB a run.",
    "array_honey_rate": "A honeyed Array drinks about a bucket every 40 seconds while it works. Keep the bees busy.",
    "dust_lv": "Rock dust in the Array at LV (circuit 2) adds 20% quartzite, the only source for LV emitters and sensors.",
    "dust_mv": "Rock dust in the Array at MV (circuit 3) adds certus dust, sky stone dust and glowstone dust: what AE2 wants.",
    "rough_diamond": "Two Rough Diamonds and a hammer make a diamond.",
    # ---------------------------------------------------------------- Bees
    "bee_stick": "Whack a hive with a stick to throw a bee out. It loses its trip.",
    "bee_atoms": "Centrifuge combs before the Reclaimer: wax plus its 100 mB of honey is about 22 atoms; the bare comb is 12.",
    "bee_cage_home": "Sneak to let a caged bee go on a hive, and that hive becomes its home.",
    "honey_treat": "A honey treat (comb and honey bottle) calms an angry bee and grows a baby faster.",
    "nest_reset": "Got the wrong bee in a nest? Craft the nest with itself to empty it. Break a nest to carry it, bee and all.",
    "feeding_slab": "A Feeding Slab (a smooth stone slab on a chest) holds three blocks for a worker bee to visit.",
    "bee_upgrades": "An expansion box on an advanced beehive opens its upgrade slots: productivity, speed and range.",
    # ---------------------------------------------------------------- Survival
    "saturation": "Food fills a hidden saturation bar before the one you see. That's why a good meal seems to last forever.",
    "heat_thirst": "Heat makes you thirsty: summer, a furnace or lava next to you. Drink before the bar starts moving.",
}
