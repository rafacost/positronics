"""Positronics side chapters: guides, side paths and the shop (loaded by quests.py)."""
import json
import os

GROUPS = ["Field Manual", "Side Paths", "NCP Shop"]
WASTE_LANDS_START = "504F530000001001"  # "The World Has Moved On"


def memo(n, title, *lines):
    return [f"&7[NCP Field Memo #{n}: {title}]", ""] + list(lines)


def guide(n, title, *lines):
    return [f"&7[NCP Field Manual §{n}: {title}]", ""] + list(lines)


def nice(item_id):
    name = item_id.split(":")[1]
    for suffix in ("_dust", "item"):
        if name.endswith(suffix):
            name = name[: -len(suffix)]
    return name.replace("_", " ").title()


# ------------------------------------------------------------------ FIELD MANUAL (explanations)
FIELD_MANUAL = {
    "id": "field_manual", "filename": "field_manual", "order": 20, "group": "Field Manual", "scrip": 1,
    "title": "NCP Field Manual", "icon": "gtceu:terminal",
    "quests": [
        {"key": "voltage", "title": "Voltage Tiers", "icon": "gtceu:lv_transformer_1a", "tasks": ["check"], "pos": (0, 0),
         "external_deps": [WASTE_LANDS_START],
         "desc": guide("1", "Voltage",
                       "Every machine, cable and generator has a tier. Each tier is 4x the voltage of the last:",
                       "&7ULV&r 8 · &fLV&r 32 · &6MV&r 128 · &eHV&r 512 · &8EV&r 2,048 · &fIV&r 8,192",
                       "&dLuV&r 32,768 · &bZPM&r 131,072 · &aUV&r 524,288 · &9UHV&r 2,097,152 EU/t",
                       "&cA machine fed more voltage than its tier explodes.&r Feed it less and it simply can't run higher recipes.",
                       "Transformers step voltage up or down by one tier.")},
        {"key": "amps", "title": "Amperage", "icon": "gtceu:ulv_battery_buffer_4x", "tasks": ["check"], "pos": (2, 0), "deps": ["voltage"],
         "desc": guide("2", "Amps",
                       "Power travels in packets: voltage is the size of a packet, amps is how many per tick.",
                       "A machine pulls only the amps it needs. Battery buffers and generators push as many amps as they have slots or output.",
                       "Two energy hatches on a multiblock = twice the amps.")},
        {"key": "cables", "title": "Wires and Cables", "icon": "gtceu:tin_single_cable", "tasks": ["check"], "pos": (4, 0), "deps": ["amps"],
         "desc": guide("3", "Cables",
                       "Each material carries a maximum voltage:",
                       "&7ULV&r red alloy / lead · &fLV&r tin · &6MV&r copper · &eHV&r gold · &8EV&r aluminium · &fIV&r platinum",
                       "&dLuV&r niobium-titanium · &bZPM&r vanadium-gallium · &aUV&r yttrium barium cuprate · &9UHV&r europium",
                       "Bare &bwires&r shock you and lose more EU per block; &bcables&r (wire + rubber) are insulated and lose less.",
                       "Thicker cables (2x, 4x, 8x, 16x) carry more amps. Too many amps and a cable burns.")},
        {"key": "machines", "title": "Machine Tiers and Overclocking", "icon": "gtceu:lv_macerator", "tasks": ["check"], "pos": (6, 0), "deps": ["cables"],
         "desc": guide("4", "Overclocking",
                       "A recipe has a minimum tier. A machine one tier higher runs it twice as fast for four times the power (overclocking).",
                       "Higher-tier machines also get more slots, so byproducts (chanced outputs) appear only in better machines.")},
        {"key": "multis", "title": "Multiblocks", "icon": "gtceu:electric_blast_furnace", "tasks": ["check"], "pos": (8, 0), "deps": ["machines"],
         "desc": guide("5", "Multiblocks",
                       "A controller plus a structure of casings. Replace casings with &bbuses&r (items), &bhatches&r (fluids, energy) and a &bmaintenance hatch&r.",
                       "Right-click the controller with the &bGT Terminal&r to preview and even auto-build the structure.",
                       "Maintenance problems slow a multiblock: fix them with the right tools, or use an auto-maintenance hatch later.")},
        {"key": "tools", "title": "GregTech Tools", "icon": "gtceu:wrought_iron_hammer", "tasks": ["check"], "pos": (0, 2), "deps": ["voltage"],
         "desc": guide("6", "Tools",
                       "Tools are crafting ingredients that lose durability: hammer (plates), wrench (casings, machines), file, saw,",
                       "screwdriver, wire cutter, knife and mortar. Keep a full set in your toolbelt.")},
        {"key": "circuits", "title": "Programmed Circuits", "icon": "gtceu:programmed_circuit", "tasks": ["check"], "pos": (2, 2), "deps": ["tools"],
         "desc": guide("7", "Circuit Numbers",
                       "Some recipes need a &bprogrammed circuit&r set to a number. It is never consumed; it just tells the machine which recipe you want.",
                       "Strata enrichment uses them when two recipes share the same input.")},
        {"key": "strata", "title": "Strata, Not Ores", "icon": "positronics:ferrous_stratum", "tasks": ["check"], "pos": (4, 2), "deps": ["circuits"],
         "desc": guide("8", "Strata",
                       "This world has no ores, and ore blocks drop nothing. Everything comes from &bStrata&r: layers of the old world.",
                       "Seed I comes from hammering gravel and the Ore Generator. Seed II-V come from enrichment (Positronic Cores) and upgraded generators.",
                       "See the &bStrata Index&r chapter for what every stratum gives.")},
        {"key": "memory", "title": "Positronic Memory Rules", "icon": "projecte:transmutation_tablet", "tasks": ["check"], "pos": (6, 2), "deps": ["strata"],
         "desc": guide("9", "EMC",
                       "Only processed raw materials (dusts and their ingots) have EMC, valued by seed tier. Strata, gates and crafted parts have none.",
                       "There are no collectors or condensers: EMC comes only from burning your own production.",
                       "Stars charged in a Beam Capacitor (Antimatter Relay) are the keys to the Positronic Cores.")},
        {"key": "clearance", "title": "Clearance and Cores", "icon": "positronics:clearance_card_1", "tasks": ["check"], "pos": (8, 2), "deps": ["memory"],
         "desc": guide("10", "Gates",
                       "&bClearance Card N&r is needed to assemble machine hulls of tier N+1. Cards are made at their own tier.",
                       "From Level 3 on, each card also needs a &bchemistry sample&r (see The Periodic Table).",
                       "&bPositronic Cores&r I-V are never consumed: they catalyse strata enrichment, generator upgrades and some cards.",
                       "Each Core is built one tier before its strata are needed.")},
        {"key": "survival", "title": "Staying Alive", "icon": "toughasnails:thermometer", "tasks": ["check"], "pos": (10, 1), "deps": ["clearance", "multis"],
         "desc": guide("11", "Survival",
                       "Thirst: drink purified water. Temperature: heat sources, armour, shade. Seasons: winter is cold, crops follow seasons.",
                       "Variety: every few new foods grant a heart. Nothing spawns: mob drops come from technology.")},
    ],
}


# ------------------------------------------------------------------ STRATA INDEX (generated from strata.json)
def strata_index():
    here = os.path.dirname(os.path.abspath(__file__))
    data = json.load(open(os.path.join(here, "strata.json"), encoding="utf-8"))
    source = {1: "hammered gravel (sometimes), the Sifter, and the Ore Generator (Tier 1)",
              2: "Seed I strata enriched with Positronic Core II, or a Tier 2 Ore Generator",
              3: "Seed II strata enriched with Positronic Core III, or a Tier 3 Ore Generator",
              4: "Seed III strata enriched with Positronic Core IV, or a Tier 4 Ore Generator",
              5: "Seed IV strata enriched with Positronic Core V, or a Tier 5 Ore Generator"}
    quests = []
    for tier in data["tiers"]:
        t = tier["tier"]
        for i, s in enumerate(tier["strata"]):
            item = f"positronics:{s['id']}_stratum"
            by = ", ".join(f"{nice(b)} ({int(c * 100)}%)" for b, c in s.get("by", [])) or "none"
            lines = [f"&7[Strata Index: {tier['seed']}]", "",
                     f"&bMain:&r {nice(s['main'])}", f"&bByproducts:&r {by}",
                     f"&bSource:&r {source[t]}."]
            if "nugget" in s:
                lines.append(f"&7Furnace: 3 {nice(s['nugget'])}s. Crusher: one whole dust.")
            quests.append({"key": s["id"], "title": s["name"], "tasks": [item], "scrip": 1, "pos": ((t - 1) * 2.5, i * 1.5),
                           "desc": lines})
    return {"id": "strata_index", "filename": "strata_index", "order": 21, "group": "Field Manual",
            "title": "Strata Index", "icon": "positronics:cupric_stratum", "quests": quests}


# ------------------------------------------------------------------ LOGISTICS & AUTOMATION
LOGISTICS = {
    "id": "logistics", "filename": "logistics", "order": 30, "group": "Side Paths", "scrip": 2,
    "title": "Logistics & Automation", "icon": "pipez:item_pipe",
    "quests": [
        {"key": "pipes", "title": "Pipez", "external_deps": [WASTE_LANDS_START], "tasks": [("pipez:item_pipe", 8), "pipez:wrench"],
         "desc": memo("3001", "Pipes", "Item pipes pull from a generator and push into a chest. Shift-right-click with the wrench to set which side extracts.",
                      "Fluid and energy pipes work the same way. Upgrades make them faster and add filters.")},
        {"key": "pipes2", "title": "Fluids and Power", "deps": ["pipes"], "tasks": ["pipez:fluid_pipe", "pipez:energy_pipe", "pipez:basic_upgrade"],
         "desc": memo("3002", "Pipes", "Pipe water from the spring, power from your panels. GT cables are better for EU; Pipez energy pipes carry FE.")},
        {"key": "drawers", "title": "Functional Storage", "external_deps": [WASTE_LANDS_START], "tasks": [("functionalstorage:oak_1", 4)],
         "desc": memo("3003", "Drawers", "Drawers hold huge amounts of one item. Perfect for cobblestone, gravel and dust.")},
        {"key": "compacting", "title": "Compacting Drawers", "deps": ["drawers"], "tasks": ["functionalstorage:compacting_drawer"],
         "desc": memo("3004", "Compacting", "Put nuggets in, take ingots out. Smelted strata give nuggets: this turns them into ingots automatically.")},
        {"key": "controller", "title": "Storage Controller", "deps": ["compacting"], "tasks": ["functionalstorage:storage_controller", "functionalstorage:pusher_upgrade"],
         "desc": memo("3005", "Controller", "One block that inserts into every drawer around it. Pusher and puller upgrades move items for you.")},
        {"key": "sfm", "title": "Super Factory Manager", "deps": ["pipes2"], "tasks": ["sfm:manager", ("sfm:cable", 16), "sfm:disk"],
         "desc": memo("3006", "Programming", "Write a tiny program on a disk to move items between any inventories on the cable. NCP approves of scripts.")},
        {"key": "xnet", "title": "XNet", "deps": ["sfm"], "tasks": ["xnet:controller", ("xnet:netcable_blue", 16)],
         "desc": memo("3007", "Networks", "A controller and cables move items, fluids and energy by channel. Compact and fast.")},
        {"key": "ae_presses", "title": "Inscriber Presses", "deps": ["controller"], "tasks": ["ae2:inscriber", "ae2:silicon_press", "ae2:logic_processor_press", "ae2:calculation_processor_press", "ae2:engineering_processor_press"],
         "scrip": 6,
         "desc": memo("3008", "AE2", "There are no meteorites here: NCP assembles the four presses in an LV assembler from steel and a sample.",
                      "Certus quartz crystals grow from Crystalline Stratum dust in an autoclave. Diamonds can be synthesised from graphite (Carbonic Stratum).")},
        {"key": "ae_fluix", "title": "Fluix", "deps": ["ae_presses"], "tasks": ["ae2:charger", ("ae2:fluix_crystal", 8)],
         "desc": memo("3009", "Fluix", "Charge certus in a charger (it takes GT power), drop it in water with redstone and quartz: fluix.")},
        {"key": "ae_storage", "title": "ME Storage", "deps": ["ae_fluix"], "tasks": ["ae2:drive", ("ae2:item_storage_cell_1k", 4), "ae2:terminal", "ae2:energy_acceptor"],
         "scrip": 6, "desc": memo("3010", "Storage", "One network, every item. The energy acceptor takes GT power.")},
        {"key": "ae_autocraft", "title": "AE2 Autocrafting", "deps": ["ae_storage"],
         "tasks": ["ae2:pattern_encoding_terminal", "ae2:pattern_provider", "ae2:molecular_assembler", "ae2:crafting_unit"], "scrip": 10,
         "desc": memo("3011", "Autocrafting", "Encode patterns, provide them to assemblers and machines, and let crafting CPUs do the rest.",
                      "&bThis is Lud's exam.&r GT machines can be pattern-provided too.")},
        {"key": "ex_ae", "title": "ExtendedAE", "deps": ["ae_autocraft"], "tasks": ["expatternprovider:ex_pattern_provider", "expatternprovider:ex_interface"],
         "desc": memo("3012", "Bigger", "More pattern slots, more sides, less cable.")},
        {"key": "matrix", "title": "Assembler Matrix", "deps": ["ex_ae"], "tasks": ["expatternprovider:assembler_matrix_frame"],
         "desc": memo("3013", "Matrix", "A multiblock molecular assembler for thousands of crafts at once.")},
        {"key": "mega", "title": "MEGA Cells", "deps": ["ex_ae"], "tasks": ["megacells:cell_component_1m", "megacells:mega_crafting_unit"],
         "desc": memo("3014", "Capacity", "Storage cells and crafting units measured in millions.")},
        {"key": "emc_ae", "title": "Positronic Memory in ME", "deps": ["ae_autocraft"], "tasks": ["appliede:emc_module", "appliede:transmutation_terminal"],
         "desc": memo("3015", "EMC", "AppliedE lets your ME network read and write Positronic Memory: learned items become craftable from EMC.")},
        {"key": "quantum", "title": "Quantum Computer", "deps": ["mega"], "tasks": ["advanced_ae:quantum_core"],
         "desc": memo("3016", "Late Game", "AdvancedAE's quantum computer: crafting CPUs at a scale even NCP finds excessive.")},
    ],
}


# ------------------------------------------------------------------ CALLA KITCHEN (food & survival)
KITCHEN = {
    "id": "calla_kitchen", "filename": "calla_kitchen", "order": 31, "group": "Side Paths", "scrip": 2,
    "title": "The Calla Kitchen", "icon": "pamhc2foodcore:skilletitem",
    "quests": [
        {"key": "tools1", "title": "Kitchen Tools", "external_deps": [WASTE_LANDS_START],
         "tasks": ["pamhc2foodcore:cuttingboarditem", "pamhc2foodcore:potitem", "pamhc2foodcore:skilletitem"],
         "desc": memo("3101", "Kitchen", "Pam's cooking tools are reusable crafting ingredients. Start with a cutting board, a pot and a skillet.")},
        {"key": "tools2", "title": "A Full Kitchen", "deps": ["tools1"],
         "tasks": ["pamhc2foodcore:saucepanitem", "pamhc2foodcore:bakewareitem", "pamhc2foodcore:mixingbowlitem", "pamhc2foodcore:juiceritem", "pamhc2foodcore:grinderitem"],
         "desc": memo("3102", "Kitchen", "Saucepan, bakeware, mixing bowl, juicer and grinder: everything a Calla kitchen needs.")},
        {"key": "dishes", "title": "First Dishes", "deps": ["tools1"],
         "tasks": ["pamhc2foodcore:toastitem", "pamhc2foodcore:carrotsoupitem", "pamhc2foodcore:mashedpotatoesitem"],
         "desc": memo("3103", "Cooking", "Cooked food fills you up for longer. Carrots, potatoes and wheat seeds are sold at the NCP Shop.")},
        {"key": "soups", "title": "Soups and Juice", "deps": ["dishes", "tools2"],
         "tasks": ["pamhc2foodcore:potatosoupitem", "pamhc2foodcore:pumpkinsoupitem", "pamhc2foodcore:applejuiceitem"],
         "desc": memo("3104", "Cooking", "Soups and juices also count as new foods for Spice of Life.")},
        {"key": "variety", "title": "A Varied Diet", "deps": ["dishes"],
         "tasks": ["pamhc2crops:tomatoitem", "pamhc2crops:lettuceitem", "pamhc2crops:onionitem", "pamhc2crops:cornitem", "pamhc2crops:riceitem", "pamhc2crops:beanitem"],
         "desc": memo("3105", "Spice of Life", "Every few new foods you eat grant a permanent heart (the Food Book shows your progress).",
                      "Most Pam's crops can be eaten raw. Buy new seeds at the NCP Shop and grow them in pots or a Calla Paddy.")},
        {"key": "variety2", "title": "A Gourmet's Diet", "deps": ["variety", "soups"],
         "tasks": ["pamhc2crops:strawberryitem", "pamhc2crops:cucumberitem", "pamhc2crops:bellpepperitem", "pamhc2crops:broccoliitem", "pamhc2crops:spinachitem", "pamhc2crops:grapeitem"],
         "scrip": 5, "desc": memo("3106", "Spice of Life", "Eat each of these at least once. Your hearts will thank you.")},
        {"key": "purifier", "title": "Water Purifier", "deps": ["tools1"], "tasks": ["toughasnails:water_purifier"],
         "desc": memo("3107", "Water", "Much faster than boiling bottles. It needs copper, so it comes after your first strata.")},
        {"key": "rain", "title": "Rain Collector", "deps": ["purifier"], "tasks": ["toughasnails:rain_collector"],
         "desc": memo("3108", "Water", "Collects rain water. It needs string: three cotton, flax, jute, sisal or kenaf make one string.")},
        {"key": "juices", "title": "Drinks", "deps": ["purifier"], "tasks": ["toughasnails:apple_juice", "toughasnails:melon_juice"],
         "desc": memo("3109", "Thirst", "Juices quench thirst better than water.")},
        {"key": "comfort", "title": "Thermal Comfort", "deps": ["rain"], "tasks": ["toughasnails:wool_chestplate", "toughasnails:thermoregulator"],
         "desc": memo("3110", "Temperature", "Wool armour for winter (string makes wool). A thermoregulator keeps a whole room comfortable.")},
        {"key": "autofood", "title": "Automated Food", "deps": ["variety"], "tasks": [("botanypots:terracotta_hopper_botany_pot", 4)],
         "desc": memo("3111", "Automation", "Hopper botany pots over chests, or the Calla Paddy multiblock, mean you never farm by hand again.")},
    ],
}


# ------------------------------------------------------------------ NCP SHOP (repeatable, spends Scrip)
def shop():
    offers = [
        # key, title, price, reward, count
        ("wheat", "Wheat Seeds", 1, "minecraft:wheat_seeds", 2),
        ("carrot", "Carrots", 2, "minecraft:carrot", 2),
        ("potato", "Potatoes", 2, "minecraft:potato", 2),
        ("pumpkin", "Pumpkin Seeds", 2, "minecraft:pumpkin_seeds", 2),
        ("melon", "Melon Seeds", 2, "minecraft:melon_seeds", 2),
        ("cane", "Sugar Cane", 2, "minecraft:sugar_cane", 2),
        ("cocoa", "Cocoa Beans", 2, "minecraft:cocoa_beans", 2),
        ("apple", "Apples", 1, "minecraft:apple", 4),
        ("oak", "Oak Sapling", 2, "minecraft:oak_sapling", 1),
        ("birch", "Birch Sapling", 2, "minecraft:birch_sapling", 1),
        ("spruce", "Spruce Sapling", 2, "minecraft:spruce_sapling", 1),
        ("rubber", "Rubber Sapling", 3, "gtceu:rubber_sapling", 1),
        ("apple_tree", "Apple Tree Sapling", 4, "pamhc2trees:apple_sapling", 1),
        ("cherry_tree", "Cherry Tree Sapling", 4, "pamhc2trees:cherry_sapling", 1),
        ("bonemeal", "Bone Meal", 2, "minecraft:bone_meal", 8),
        ("dirt", "Dirt", 2, "minecraft:dirt", 4),
        ("pot", "Botany Pot", 3, "botanypots:terracotta_botany_pot", 1),
        ("hopper_pot", "Hopper Botany Pot", 8, "botanypots:terracotta_hopper_botany_pot", 1),
        ("bee", "Honey Bee (egg)", 6, "minecraft:bee_spawn_egg", 1),
        ("ashy_bee", "Ashy Mining Bee (egg)", 8, "productivebees:spawn_egg_ashy_mining_bee", 1),
        ("blue_bee", "Blue Banded Bee (egg)", 8, "productivebees:spawn_egg_blue_banded_bee", 1),
    ]
    seeds = ["tomato", "lettuce", "onion", "corn", "rice", "bean", "cucumber", "strawberry", "bellpepper", "broccoli",
             "spinach", "grape", "cotton", "flax", "garlic", "peas", "soybean", "papyrus"]
    for c in seeds:
        offers.append((f"seed_{c}", f"{nice('x:' + c)} Seeds", 1, f"pamhc2crops:{c}seeditem", 1))
    quests = []
    for i, (key, title, price, item, count) in enumerate(offers):
        quests.append({"key": key, "title": title, "repeat": True, "consume": True,
                       "tasks": [("positronics:ncp_scrip", price)], "rewards": [(item, count)], "scrip": 0,
                       "icon": item, "pos": ((i % 6) * 1.5, (i // 6) * 1.5),
                       "desc": [f"&7[NCP Shop]", "", f"{count}x {title} for {price} NCP Scrip.",
                                "&7Click 'Submit' on the task to pay. Repeatable."]})
    return {"id": "ncp_shop", "filename": "ncp_shop", "order": 40, "group": "NCP Shop",
            "title": "NCP Shop", "icon": "positronics:ncp_scrip", "quests": quests}


# ------------------------------------------------------------------ SIMULATION LAB (Hostile Neural Networks)
def model(mob, data=6):
    """A pre-trained data model: 6 data = Basic tier, 54 = Advanced (HNN model_tiers)."""
    return {"id": "hostilenetworks:data_model", "tag": {"data_model": {"id": f"hostilenetworks:{mob}", "data": data}}}


def simulation_lab():
    # (tier gate quest, [(mob, task item, count, title, memo text)...], model data)
    tiers = [
        ("the_calla:lvhull", "LV", 6, [
            ("skeleton", "minecraft:bone", 16, "Bones", "Bones become bone meal: your crops will thank you. Arrows and skulls too."),
            ("cow", "minecraft:leather", 8, "Leather", "Leather means canteens, books and leather armour."),
            ("sheep", "minecraft:white_wool", 8, "Wool", "Wool for warm armour and beds. Every colour, no dye needed."),
            ("chicken", "minecraft:feather", 8, "Feathers", "Feathers for arrows and books; chicken for dinner."),
            ("spider", "minecraft:string", 16, "String", "String by the stack, and spider eyes for brewing.")]),
        ("lud:arrival", "MV", 6, [
            ("zombie", "minecraft:rotten_flesh", 16, "Rotten Flesh", "Rotten flesh, and occasionally iron, carrots and potatoes."),
            ("slime", "minecraft:slime_ball", 16, "Slime", "Slime balls for sticky pistons and GT's rubber alternatives."),
            ("creeper", "minecraft:gunpowder", 16, "Gunpowder", "Gunpowder means TNT, and TNT means the implosion compressor."),
            ("enderman", "minecraft:ender_pearl", 8, "Ender Pearls", "Ender pearls for GregTech field generators and sensors.")]),
        ("the_cradle:arrival", "HV", 6, [
            ("blaze", "minecraft:blaze_rod", 8, "Blaze Rods", "Blaze rods and powder for HV chemistry."),
            ("witch", "minecraft:glowstone_dust", 16, "Witch's Pantry", "Redstone, glowstone, sugar: a witch's pantry, minus the witch."),
            ("ghast", "minecraft:ghast_tear", 8, "Ghast Tears", "Ghast tears, and more gunpowder.")]),
        ("the_dogan:arrival", "EV", 54, [
            ("wither_skeleton", "minecraft:wither_skeleton_skull", 3, "Wither Skulls", "Wither skeleton skulls. You know where this is going."),
            ("magma_cube", "minecraft:magma_cream", 16, "Magma Cream", "Magma cream for heat-resistant chemistry."),
            ("guardian", "minecraft:prismarine_crystals", 8, "Prismarine", "Prismarine crystals and fish.")]),
        ("fedic:arrival", "IV", 54, [
            ("shulker", "minecraft:shulker_shell", 4, "Shulker Shells", "Shulker shells: portable storage."),
            ("evoker", "minecraft:totem_of_undying", 1, "Totems", "Totems of undying, and emeralds.")]),
        ("end_world_luv:arrival", "LuV", 54, [
            ("wither", "minecraft:nether_star", 1, "Nether Stars", "A simulated Wither. The star it leaves is very real.")]),
    ]
    quests = [{
        "key": "lab", "title": "The Simulation Lab", "deps": ["the_calla:lvhull"],
        "tasks": ["hostilenetworks:sim_chamber", "hostilenetworks:loot_fabricator", ("hostilenetworks:prediction_matrix", 16)],
        "rewards": [model("skeleton")], "scrip": 5, "shape": "gear", "size": 1.4, "pos": (0, 0),
        "desc": memo("3201", "Andy Units",
                     "Nothing spawns in this world. NCP's answer: simulate it. A &bSim Chamber&r runs a &bdata model&r on prediction matrices",
                     "and power; a &bLoot Fabricator&r turns the predictions into real drops.",
                     "Every simulation teaches the model a little more: Basic models are inaccurate, but they improve with use.",
                     "&7Here is your first model. NCP hands out trained models as you earn clearance: never the best, always useful.")}]
    prev = "lab"
    for ti, (gate, tier_name, data, mobs) in enumerate(tiers):
        x = ti * 2.5
        if ti > 0:
            gate_key = f"tier_{tier_name.lower()}"
            quests.append({"key": gate_key, "title": f"{tier_name} Simulations", "deps": [gate, prev], "tasks": ["check"],
                           "check_title": "Requisition models", "rewards": [model(mobs[0][0], data)], "scrip": 3,
                           "shape": "hexagon", "pos": (x, 0),
                           "desc": memo(f"32{ti}0", "Requisition", f"Your clearance now covers {tier_name}-grade simulations.",
                                        "Here is the next model." + (" Advanced grade, this time." if data > 6 else ""))})
            prev = gate_key
        for mi, (mob, item, count, title, text) in enumerate(mobs):
            reward = [model(mobs[mi + 1][0], data)] if mi + 1 < len(mobs) else []
            key = f"{mob}_drops"
            quests.append({"key": key, "title": title, "deps": [prev], "tasks": [(item, count)], "rewards": reward,
                           "pos": (x, 1.5 * (mi + 1)),
                           "desc": memo(f"32{ti}{mi + 1}", title, f"Run the {mob.replace('_', ' ')} model and fabricate its drops.", text,
                                        ("&7Reward: the next data model." if reward else "&7That's every model at this grade."))})
            prev = key
    return {"id": "simulation_lab", "filename": "simulation_lab", "order": 32, "group": "Side Paths", "scrip": 3,
            "title": "Simulation Lab", "icon": "hostilenetworks:sim_chamber", "quests": quests}


# ------------------------------------------------------------------ NCP SPACE PROGRAM (Ad Astra + Stargate Journey)
def visit(dim):
    return {"dimension": dim}


SPACE = {
    "id": "space_program", "filename": "space_program", "order": 33, "group": "Side Paths", "scrip": 5,
    "title": "NCP Space Program", "icon": "ad_astra:tier_1_rocket",
    "quests": [
        {"key": "workbench", "title": "Look Up", "deps": ["lud:mvhull"], "tasks": ["ad_astra:nasa_workbench"],
         "desc": memo("3401", "Space",
                      "Everything above HV is made of things this world no longer has. The Moon, Mars, Venus and Mercury still do.",
                      "The NASA Workbench needs your Clearance Card (Level 2, kept) and an MV hull.")},
        {"key": "suit", "title": "Suit Up", "deps": ["workbench"],
         "tasks": ["ad_astra:space_helmet", "ad_astra:space_suit", "ad_astra:space_pants", "ad_astra:space_boots", "ad_astra:oxygen_loader"],
         "desc": memo("3402", "Life Support", "No air out there. Fill your suit with oxygen at an oxygen loader.")},
        {"key": "fuel", "title": "Rocket Fuel", "deps": ["workbench"], "tasks": [("ad_astra:fuel_bucket", 3)],
         "desc": memo("3403", "Fuel", "Distil ethanol (circuit 5) into rocket fuel at MV. Diesel works too, later.")},
        {"key": "rocket1", "title": "Tier 1 Rocket", "deps": ["suit", "fuel"], "tasks": ["ad_astra:tier_1_rocket", "ad_astra:launch_pad"],
         "scrip": 10, "desc": memo("3404", "Launch", "Build it at the NASA Workbench, place it on a launch pad, fuel it, and go.")},
        {"key": "moon", "title": "The Moon", "deps": ["rocket1"], "tasks": [visit("ad_astra:moon")], "shape": "gear", "size": 1.4, "scrip": 15,
         "desc": memo("3405", "The Moon", "One small step. Bring a lot of chests.")},
        {"key": "moon_minerals", "title": "Lunar Regolith", "deps": ["moon"],
         "tasks": [("ad_astra:moon_sand", 64), ("gtceu:chromite_dust", 8)],
         "desc": memo("3406", "Chrome", "Sift moon sand in an MV sifter: &bchromite&r, cobaltite and vanadium magnetite.",
                      "Chrome means kanthal and stainless steel: &bthis unlocks HV&r. Moon stone crushes into moon sand.")},
        {"key": "desh", "title": "Desh", "deps": ["moon"], "tasks": [("ad_astra:desh_ingot", 16)],
         "desc": memo("3407", "Desh", "Moon desh ore: the metal of the tier 2 rocket.")},
        {"key": "rocket2", "title": "Tier 2 Rocket", "deps": ["desh", "the_cradle:hvhull"], "tasks": ["ad_astra:tier_2_rocket"], "scrip": 10,
         "desc": memo("3408", "Launch", "Desh engines and tanks, built at HV.")},
        {"key": "mars", "title": "Mars", "deps": ["rocket2"], "tasks": [visit("ad_astra:mars")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3409", "Mars", "Red, cold and full of titanium.")},
        {"key": "mars_minerals", "title": "Martian Regolith", "deps": ["mars"], "tasks": [("ad_astra:mars_sand", 64), ("gtceu:rutile_dust", 8)],
         "desc": memo("3410", "Titanium", "Sift mars sand at HV: &brutile&r, ilmenite, magnesite. Titanium: &bthis unlocks EV&r.")},
        {"key": "ostrum", "title": "Ostrum", "deps": ["mars"], "tasks": [("ad_astra:ostrum_ingot", 16)],
         "desc": memo("3411", "Ostrum", "Mars ostrum ore: the metal of the tier 3 rocket.")},
        {"key": "rocket3", "title": "Tier 3 Rocket", "deps": ["ostrum", "the_dogan:evhull"], "tasks": ["ad_astra:tier_3_rocket"], "scrip": 10,
         "desc": memo("3412", "Launch", "Ostrum engines, built at EV. Venus and Mercury are both in range.")},
        {"key": "venus", "title": "Venus", "deps": ["rocket3"], "tasks": [visit("ad_astra:venus")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3413", "Venus", "464 degrees. Bring heat protection.")},
        {"key": "venus_minerals", "title": "Venusian Regolith", "deps": ["venus"], "tasks": [("ad_astra:venus_sand", 64), ("gtceu:scheelite_dust", 8)],
         "desc": memo("3414", "Tungsten", "Sift venus sand at EV: &bscheelite&r, tungstate, molybdenite, sulfur. Tungsten: &bthis unlocks IV&r.")},
        {"key": "mercury", "title": "Mercury", "deps": ["rocket3"], "tasks": [visit("ad_astra:mercury")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3415", "Mercury", "Closest to the sun, richest in platinum.")},
        {"key": "mercury_minerals", "title": "Mercurian Rock", "deps": ["mercury"], "tasks": [("ad_astra:mercury_cobblestone", 64), ("gtceu:cooperite_dust", 8)],
         "desc": memo("3416", "Platinum", "Sift mercury cobblestone at EV: &bcooperite&r (the platinum group), tantalite, pyrochlore.")},
        {"key": "calorite", "title": "Calorite", "deps": ["venus"], "tasks": [("ad_astra:calorite_ingot", 16)],
         "desc": memo("3417", "Calorite", "Venus calorite ore: the metal of the tier 4 rocket.")},
        {"key": "rocket4", "title": "Tier 4 Rocket", "deps": ["calorite", "fedic:ivhull"], "tasks": ["ad_astra:tier_4_rocket"], "scrip": 15,
         "desc": memo("3418", "Launch", "Calorite engines, built at IV. Proxima Centauri is in range.")},
        {"key": "glacio", "title": "Glacio", "deps": ["rocket4"], "tasks": [visit("ad_astra:glacio")], "shape": "gear", "size": 1.6, "scrip": 30,
         "desc": memo("3419", "Another Star", "A frozen world around another star. NCP records mention a gate site here.")},
        {"key": "ruin", "title": "The Ruin", "deps": ["glacio"], "tasks": ["sgjourney:classic_stargate", "sgjourney:classic_dhd"],
         "shape": "hexagon", "size": 1.6, "scrip": 40,
         "desc": memo("3420", "The Door",
                      "Somewhere in Glacio's snowy barrens and ice peaks stands a broken ring of naquadah: an NCP gate site.",
                      "Sites are scattered about every four hundred blocks. Under the ring, a chest: &bthe first Stargate&r and its DHD.",
                      "&aBring them home.&r Ships got you here; from now on, gates take you further.")},
        {"key": "naquadah", "title": "Naquadah", "deps": ["glacio"], "tasks": [("gtceu:naquadah_dust", 8)],
         "desc": memo("3421", "Naquadah", "Sift glacio cobblestone at IV for monazite, pyrochlore, iridium, osmium and a little &bnaquadah&r.",
                      "Raw naquadah from the gate site macerates into GregTech naquadah too. Naquadah: &bthis unlocks ZPM&r.")},
        {"key": "abydos", "title": "Through the Gate", "deps": ["ruin"], "tasks": [visit("sgjourney:abydos")], "shape": "gear", "size": 1.8, "scrip": 50,
         "desc": memo("3422", "Abydos", "Set up the gate and its DHD at home, power it, and dial. The first world beyond the ships.",
                      "&7Further gate worlds (Chulak, Lantea, Athos...) become the resource regions of the last tiers.")},
    ],
}


# ------------------------------------------------------------------ THE APIARY (Productive Bees)
APIARY = {
    "id": "apiary", "filename": "apiary", "order": 34, "group": "Side Paths", "scrip": 3,
    "title": "The Apiary", "icon": "productivebees:advanced_oak_beehive",
    "quests": [
        {"key": "hive", "title": "A Home for Bees", "deps": ["the_calla:arrival"], "tasks": ["productivebees:advanced_oak_beehive"],
         "rewards": ["minecraft:bee_spawn_egg"],
         "desc": memo("3501", "Bees", "Nothing spawns here, bees included. NCP's agricultural division ships the first one with your hive.",
                      "An advanced beehive keeps bees working and collects their combs. Flowers nearby keep them happy.")},
        {"key": "solitary", "title": "Solitary Bees", "deps": ["hive"], "tasks": [("minecraft:honeycomb", 8)],
         "rewards": ["productivebees:spawn_egg_ashy_mining_bee", "productivebees:spawn_egg_blue_banded_bee"],
         "desc": memo("3502", "Breeding Stock", "Two solitary bees for your breeding programme. More eggs are sold at the NCP Shop.",
                      "Productive Bees' own guide (and EMI) shows which pairs and items lead to which bees.")},
        {"key": "processing", "title": "Comb Processing", "deps": ["solitary"], "tasks": ["gtceu:lv_centrifuge", ("productivebees:wax", 8)],
         "desc": memo("3503", "Centrifuge", "Resource combs are processed only in a &bGregTech centrifuge&r. A metal or gem comb gives",
                      "the matching &bStratum&r (iron bee: Ferrous Stratum), plus wax and honey, at that stratum's tier voltage.",
                      "Bees are a full alternative strata stream: no Positronic Core needed for the bee's own tier.")},
        {"key": "resource", "title": "Resource Bees", "deps": ["processing"], "tasks": ["positronics:ferrous_stratum", "positronics:cupric_stratum"],
         "scrip": 6, "desc": memo("3504", "Metal Bees", "Breed your way to an iron and a copper bee, and centrifuge their combs into strata.",
                                  "Higher-tier bees give higher-tier strata, but need a centrifuge of that tier.")},
        {"key": "honey", "title": "Honey Boosters", "deps": ["processing", "the_calla:paddy"], "tasks": [("productivebees:honey_bucket", 2)],
         "desc": memo("3505", "Boosters", "Honey is a booster: the &bCalla Paddy&r with honey piped in beside the water gives a 12x harvest",
                      "(4x plain, 8x with fertilizer). More honey boosters for GregTech machines will follow.")},
    ],
}


# ------------------------------------------------------------------ THE PERIODIC TABLE (Alchemistry + ChemLib)
PERIODS = [
    ("p1", "Period 1", ["hydrogen", "helium"], "the_calla:arrival"),
    ("p2", "Period 2", ["lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon"], None),
    ("p3", "Period 3", ["sodium", "magnesium", "aluminum", "silicon", "phosphorus", "sulfur", "chlorine", "argon"], None),
    ("p4a", "Period 4: Light Metals", ["potassium", "calcium", "scandium", "titanium", "vanadium", "chromium", "manganese", "iron", "cobalt"], "lud:arrival"),
    ("p4b", "Period 4: The Rest", ["nickel", "copper", "zinc", "gallium", "germanium", "arsenic", "selenium", "bromine", "krypton"], None),
    ("p5a", "Period 5: Transition", ["rubidium", "strontium", "yttrium", "zirconium", "niobium", "molybdenum", "technetium", "ruthenium", "rhodium"], "the_cradle:arrival"),
    ("p5b", "Period 5: The Rest", ["palladium", "silver", "cadmium", "indium", "tin", "antimony", "tellurium", "iodine", "xenon"], None),
    ("p6a", "The Lanthanides", ["lanthanum", "cerium", "praseodymium", "neodymium", "promethium", "samarium", "europium", "gadolinium",
                                "terbium", "dysprosium", "holmium", "erbium", "thulium", "ytterbium", "lutetium"], "the_dogan:arrival"),
    ("p6b", "Period 6: Heavy Metals", ["cesium", "barium", "hafnium", "tantalum", "tungsten", "rhenium", "osmium", "iridium", "platinum",
                                       "gold", "mercury", "thallium", "lead", "bismuth", "polonium", "astatine", "radon"], None),
    ("p7a", "The Actinides", ["francium", "radium", "actinium", "thorium", "protactinium", "uranium", "neptunium", "plutonium", "americium",
                              "curium", "berkelium", "californium", "einsteinium", "fermium", "mendelevium", "nobelium", "lawrencium"], "fedic:arrival"),
    ("p7b", "The Superheavies", ["rutherfordium", "dubnium", "seaborgium", "bohrium", "hassium", "meitnerium", "darmstadtium", "roentgenium",
                                 "copernicium", "nihonium", "flerovium", "moscovium", "livermorium", "tennessine", "oganesson"], "end_world_luv:arrival"),
]
COMPOUNDS = [
    ("c_basic", "Everyday Compounds", ["water", "carbon_dioxide", "sodium_chloride", "silicon_dioxide", "calcium_carbonate"], "p2"),
    ("c_acids", "Acids", ["sulfuric_acid", "hydrochloric_acid", "nitric_acid", "phosphoric_acid"], "p3"),
    ("c_bases", "Bases", ["sodium_hydroxide", "potassium_hydroxide", "calcium_hydroxide", "ammonia"], "p3"),
    ("c_organic", "Organic Chemistry", ["methane", "ethanol", "cellulose", "sucrose", "starch"], "p2"),
    ("c_oxides", "Metal Oxides and Salts", ["titanium_oxide", "aluminum_oxide", "iron_oxide", "potassium_dichromate", "barium_sulfate"], "p4a"),
]


def periodic_table():
    quests = [{"key": "lab", "title": "The NCP Chemistry Lab", "deps": ["the_calla:arrival"],
               "tasks": ["alchemistry:dissolver", "alchemistry:compactor"], "rewards": ["chemlib:periodic_table", ("chemlib:hydrogen", 8)],
               "scrip": 5, "shape": "gear", "size": 1.4, "pos": (0, 0),
               "desc": memo("3601", "Chemistry",
                            "The &bDissolver&r breaks almost anything solid into its &belements&r (ChemLib). The &bCombiner&r builds compounds;",
                            "the &bAtomizer&r and &bLiquifier&r handle gases and liquids; &bFusion&r and &bFission&r transmute elements.",
                            "Chemistry is its own currency: elements never turn into GregTech metals (no shortcuts past the planets),",
                            "but GregTech needs them: every Clearance Card from Level 3 asks for a chemistry sample.",
                            "&7Every row of the table you complete earns samples and Scrip.")}]
    prev = "lab"
    for i, (key, title, elements, gate) in enumerate(PERIODS):
        deps = [prev] + ([gate] if gate and gate != "the_calla:arrival" else [])
        reward_el = PERIODS[i + 1][2][0] if i + 1 < len(PERIODS) else None
        rewards = [(f"chemlib:{reward_el}", 4)] if reward_el else ["chemlib:periodic_table"]
        quests.append({"key": key, "title": title, "deps": deps, "tasks": [f"chemlib:{e}" for e in elements],
                       "rewards": rewards, "scrip": 2 + len(elements) // 3, "pos": (2 + i * 1.6, 0 if i % 2 == 0 else 1.2),
                       "desc": [f"&7[Periodic Table: {title}]", "",
                                "Collect one of each: " + ", ".join(e.capitalize() for e in elements) + ".",
                                ("&7The heaviest elements come from Alchemistry fusion (LuV)." if key == "p7b" else
                                 "&7Dissolve materials, run element bees, or fuse lighter elements.")]})
        prev = key
    for j, (key, title, comps, after) in enumerate(COMPOUNDS):
        quests.append({"key": key, "title": title, "deps": [after], "tasks": [f"chemlib:{c}" for c in comps],
                       "scrip": 3, "pos": (2 + j * 2.4, 3.2),
                       "desc": [f"&7[Chemistry: {title}]", "",
                                "Build them in the &bCombiner&r: " + ", ".join(c.replace('_', ' ') for c in comps) + ".",
                                "&7Acids, ammonia, methane and ethanol extract into GregTech fluids (LV extractor)."]})
    return {"id": "periodic_table", "filename": "periodic_table", "order": 35, "group": "Side Paths", "scrip": 3,
            "title": "The Periodic Table", "icon": "chemlib:periodic_table", "quests": quests}


SIDE_CHAPTERS = [FIELD_MANUAL, strata_index(), LOGISTICS, KITCHEN, simulation_lab(), SPACE, APIARY, periodic_table(), shop()]
