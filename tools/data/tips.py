# Positronics loading-screen tips (Darkhax "Tips" mod, decided 2026-11-23).
# Quests keep the goal, the lore and what a task needs; shortcuts, rates and tricks live here, shown at random
# on loading and saving screens. Same voice as the memos, every fact exact. "&" colour codes become section signs.
# Each tip carries the number of the memo it came from: "0110" -> "NCP Field Note #0110" (the River Crossing
# Power memo), "S11" -> "NCP Field Manual, Section 11". A memo can have several tips.
# make_tips.py writes one JSON per tip to kubejs/assets/positronics/tips/<key>.json.

TIPS = [
    # ---------------------------------------------------------------- River Crossing (0101-0126)
    ("0102", "hammer_grades", "The stone hammer only finds iron and copper. An iron-grade hammer finds tin, coal and lead in gravel; "
                              "a steel one finds redstone and nickel in sand."),
    ("0106", "firebricks", "Firebricks: mortar clay into clay dust and bricks into brick dust, mix them into fireclay dust, press it "
                           "into compressed fireclay by hand and fire it. Four firebrick make a block."),
    ("0108", "wood_planks", "GregTech wood planks: a hammer and two wood pulp. A cable is a wire and a rubber plate."),
    ("0110", "power_math", "A ULV machine pulls up to 8 EU/t, which is 32 FE/t: two Solar Flux panels per machine while the sun's up, "
                           "more if you want the cell full by dark."),
    ("0110", "converter_amps", "A 1A converter passes one amp, 8 EU/t at ULV. Two machines want two amps: a second converter, or a 4A one."),
    ("0110", "converter_face", "A GregTech energy converter puts EU out of its front face only. Point that face at the cable."),
    ("0110", "furnator", "When the sun quits on you, the Powah Furnator burns coal. Eight carbon atoms make one coal."),
    ("0110", "emergency_solar", "GregTech's ULV solar panel puts 8 EU/t straight onto the cable: no converter, no 4:1 loss. "
                                "It costs a hull per panel."),
    ("0110", "pipez_power", "Panels and energy cells push into whatever touches them. Pipez energy pipes carry FE further."),
    ("0111", "crusher_rate", "One Crusher eats about 8 strata a minute. One Ore Generator makes 30. Do the arithmetic."),
    ("0113", "oregen_star", "Fill the Ore Generator's Klein Star Ein in a Beam Capacitor: Reclaimer atoms in, 50,000 EMC out."),
    ("0114", "rubber_plate", "Rubber plate by hand: mortar two sticky resin into raw rubber dust, then smelt it."),
    ("0114", "rubber_resin", "A rubber tree's own logs bleed resin most of the time. Logs you placed, or logs from a botany pot, never do."),
    ("0116", "biomass", "Mortar + 8 leaves (or 4 saplings, 8 crops, 8 sugar cane) = 1 plant mass. Two plant mass = 1 cellulose."),
    ("0116", "silicon_dioxide", "Mortar + 1 rock dust (sand broken with any hammer) = 1 silicon dioxide. Stone pays less than green things."),
    ("0116", "sugar_cane", "Sugar cane grows in a botany pot, and it's the fastest biomass on the island."),
    ("0116", "shears", "Leaves need shears. Once you have proper tools, the NCP Shop sells a reinforced pair."),
    ("0117", "mortar_grades", "Flint mortars break iron and copper. Iron-grade mortars add tin, lead and carbon; steel adds nickel."),
    ("0117", "atom_ring", "A ring of 8 atoms on the crafting table turns back into 4 nuggets: iron, copper, tin, lead or nickel."),
    ("0118", "reclaimer_rate", "One Atomic Reclaimer keeps up with 12 botany pots of cane, or about 12 strata a minute."),
    ("0118", "cane_rate", "A pot of cane grows 8 a minute, about 5,000 EMC an hour through a Reclaimer."),
    ("0118", "reclaimer_menu", "The Reclaimer eats biomass (16 leaves, 8 saplings, 16 crops or cane, 2 plant mass, 8 wood pulp) "
                               "for 6 carbon, 10 hydrogen and 5 oxygen. Rock dust gives 1 silicon and 2 oxygen."),
    ("0118", "emc_link", "Pipe atoms into a Basic EMC Link (ProjectExpansion) and the EMC lands on your tablet, no hands."),
    ("0118", "lv_gases", "At LV, electrolysis (water) and the centrifuge (air) bring hydrogen, oxygen, nitrogen and argon, paid in EU."),
    ("0119", "capacitor_loop", "Point the Reclaimer's output hopper at a Beam Capacitor with a star inside, and the star fills while you sleep."),
    ("0119", "tablet_star", "In a hurry? A Klein Star in the tablet's input slots fills from your own EMC. "
                            "Not the burn slot: that one eats the star."),
    ("0120", "oregen_rate", "Ore Generator -> 2 Atomic Reclaimers -> Beam Capacitor is about 58,000 EMC an hour, with nobody watching."),
    ("0120", "rubric_crush", "Rubric strata give only their 5 silicon atoms in a Reclaimer. Want the redstone? Crush those instead."),
    ("0121", "core_grids", "Every Positronic Core after the first wants a bigger grid: 5x5 at LV and MV, 7x7 at EV, 9x9 at LuV."),
    ("0123", "array_ladder", "Sifter Array: circuit 1 gives 4 strata a gravel at ULV. An LV energy hatch and circuit 2 make it 16; "
                             "MV and circuit 3, 64."),
    ("0123", "array_honey", "Honey in the Array doubles everything: circuits 11, 12 and 13 instead of 1, 2 and 3. 50 mB a run."),
    ("0126", "dust_lv", "Rock dust in the Array at LV (circuit 2) adds 20% quartzite, the only source for LV emitters and sensors."),
    ("0126", "dust_mv", "Rock dust in the Array at MV (circuit 3) adds certus dust, sky stone dust and glowstone dust: what AE2 wants."),
    ("0126", "rough_diamond", "Two Rough Diamonds and a hammer make a diamond. Quartz makes comparators."),
    # ---------------------------------------------------------------- The Calla (0201-0220)
    ("0208", "panel_compact", "Solar panels compact without loss: eight ULV panels and an LV circuit make two LV panels (64 FE/t each). "
                              "From MV up it's four of the last, that tier's circuit and two plates, in an assembler."),
    ("0211", "tin_alloy", "Molten tin alloy: put tin alloy ingots in an LV extractor and catch the fluid in a bucket from its output tank."),
    ("0214", "hopper_pots", "Hopper botany pots over chests, and the crops harvest themselves."),
    # ---------------------------------------------------------------- Lud (0301-0316)
    ("0310", "keep_mk2", "An upgraded Ore Generator gives Seed II instead of Seed I. Keep one Mk II as it is, for your Seed I."),
    ("0314", "hcl", "Hydrochloric acid: electrolyse salt (Saline Stratum) for chlorine, then burn it with hydrogen."),
    # ---------------------------------------------------------------- Fedic, the Doors
    ("0609", "combiner_card", "Potassium dichromate is eleven atoms: that one's the Combiner's job, not your hands'."),
    ("1008", "oganesson", "Oganesson only comes out of Alchemistry's Fusion Chamber, at LuV."),
    # ---------------------------------------------------------------- Logistics (3001-3022)
    ("3001", "pipe_wrench", "Sneak-right-click a Pipez pipe with the wrench to choose which side extracts."),
    ("3008", "synthetic_diamond", "Eight graphite dust (Carbonic Stratum) and a bucket of water in an LV autoclave make a diamond."),
    ("3009", "nether_quartz", "Nether quartz: autoclave its dust, a Crystalline Stratum byproduct."),
    ("3020", "toms_quartz", "Sifted quartz opens Tom's comparator parts: the level emitter and the filters."),
    ("3021", "wireless_bind", "Shift-click a Tom's wireless terminal on a storage terminal to bind it."),
    # ---------------------------------------------------------------- Calla Kitchen (3101-3111)
    ("3108", "string", "Three cotton, flax, jute, sisal or kenaf make one string. No spiders required."),
    # ---------------------------------------------------------------- Apiary (3501-3513)
    ("3502", "bee_stick", "Whack a hive with a stick to throw a bee out. It loses its trip."),
    ("3506", "array_honey_rate", "A honeyed Array drinks about a bucket every 40 seconds while it works. Keep the bees busy."),
    ("3507", "bee_atoms", "Centrifuge combs before the Reclaimer: wax plus its 100 mB of honey is about 22 atoms; the bare comb is 12."),
    ("3508", "bee_cage_home", "Sneak to let a caged bee go on a hive, and that hive becomes its home."),
    ("3508", "honey_treat", "A honey treat (comb and honey bottle) calms an angry bee and grows a baby faster."),
    ("3508", "bee_upgrades", "An expansion box on an advanced beehive opens its upgrade slots: productivity, speed and range."),
    ("3509", "nest_reset", "Got the wrong bee in a nest? Craft the nest with itself to empty it. Break a nest to carry it, bee and all."),
    ("3510", "feeding_slab", "A Feeding Slab (a smooth stone slab on a chest) holds three blocks for a worker bee to visit."),
    # ---------------------------------------------------------------- Field Manual
    ("S11", "saturation", "Food fills a hidden saturation bar before the one you see. That's why a good meal seems to last forever."),
    ("S12", "heat_thirst", "Heat makes you thirsty: summer, a furnace or lava next to you. Drink before the bar starts moving."),
]


def title(ref):
    if ref.startswith("S"):
        return f"&3NCP Field Manual, Section {ref[1:]}"
    return f"&3NCP Field Note #{ref}"
