"""Positronics side chapters: guides, side paths and the shop (loaded by quests.py).

Same voice as quests.py: NCP's headers, a tired old hand's words underneath, every fact exact.
"""
import json
import os

GROUPS = ["Field Manual", "Side Paths", "NCP Shop"]
WASTE_LANDS_START = "504F530000001001"  # "The World Has Moved On"
WASTE_LANDS_TIMBER = "504F530000001008"  # "Timber": the first logs and planks
WASTE_LANDS_GLASS = "504F530000001009"  # "Glass and Bottles"


def memo(n, title, *lines):
    return [f"&7[NCP Field Memo #{n}: {title}]", ""] + list(lines)


def guide(n, title, *lines):
    return [f"&7[NCP Field Manual, Section {n}: {title}]", ""] + list(lines)


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
        {"key": "voltage", "title": "Voltage Tiers", "icon": "gtceu:lv_transformer_1a", "tasks": ["check"], "pos": (0, 0), "deps": ["river_crossing:power"],
         "external_deps": [WASTE_LANDS_START],
         "desc": guide("1", "Voltage",
                       "Every machine, cable and generator has a tier, and each tier is four times the voltage of the last:",
                       "&8ULV&r 8 · &7LV&r 32 · &bMV&r 128 · &6HV&r 512 · &5EV&r 2,048 · &9IV&r 8,192",
                       "&dLuV&r 32,768 · &cZPM&r 131,072 · &3UV&r 524,288 · &4UHV&r 2,097,152 EU/t",
                       "&cFeed a machine more voltage than its tier and it explodes.&r Not a fizzle. A bang, and a hole where it was.",
                       "Feed it less and it simply can't run the bigger recipes.",
                       "Transformers step voltage up or down by one tier. Use them. Please.")},
        {"key": "amps", "title": "Amperage", "icon": "gtceu:ulv_battery_buffer_4x", "tasks": ["check"], "pos": (2, 0), "deps": ["voltage"],
         "desc": guide("2", "Amps",
                       "Power travels in packets. Voltage is how big a packet is; amps is how many go by each tick.",
                       "A machine pulls only the amps it needs. Battery buffers and generators push as many amps as they have",
                       "slots or output. Two energy hatches on a multiblock means twice the amps.")},
        {"key": "cables", "title": "Wires and Cables", "icon": "gtceu:tin_single_cable", "tasks": ["check"], "pos": (4, 0), "deps": ["amps"],
         "desc": guide("3", "Cables",
                       "Each material carries a maximum voltage:",
                       "&8ULV&r red alloy / lead · &7LV&r tin · &bMV&r copper · &6HV&r gold · &5EV&r aluminium · &9IV&r platinum",
                       "&dLuV&r niobium-titanium · &cZPM&r vanadium-gallium · &3UV&r yttrium barium cuprate · &4UHV&r europium",
                       "Bare &bwires&r shock you and lose more EU per block. &bCables&r (wire + rubber) are insulated and lose less.",
                       "Thicker cables (2x, 4x, 8x, 16x) carry more amps. Push too many amps through one and it burns.",
                       "&7You'll smell it before you see it.")},
        {"key": "machines", "title": "Machine Tiers and Overclocking", "icon": "gtceu:lv_macerator", "tasks": ["check"], "pos": (6, 0), "deps": ["cables"],
         "desc": guide("4", "Overclocking",
                       "Every recipe has a minimum tier. A machine one tier higher runs it twice as fast for four times the power.",
                       "That's overclocking, and it's how you buy time with electricity.",
                       "Higher-tier machines also get more slots, so some byproducts (chanced outputs) only show up in better machines.")},
        {"key": "multis", "title": "Multiblocks", "icon": "gtceu:electric_blast_furnace", "tasks": ["check"], "pos": (8, 0), "deps": ["river_crossing:pbf"],
         "desc": guide("5", "Multiblocks",
                       "A controller and a structure of casings. Swap casings for &bbuses&r (items), &bhatches&r (fluids, energy)",
                       "and a &bmaintenance hatch&r.",
                       "Right-click the controller with the &bGT Terminal&r to preview the structure, or even build it for you.",
                       "Big machines get tired. Maintenance problems slow them down: fix them with the right tools,",
                       "or fit an auto-maintenance hatch later and stop worrying.")},
        {"key": "tools", "title": "GregTech Tools", "icon": "gtceu:wrought_iron_hammer", "tasks": ["check"], "pos": (0, 2), "deps": ["river_crossing:tools"],
         "desc": guide("6", "Tools",
                       "GregTech tools are crafting ingredients that wear down as you use them: hammer (plates), wrench",
                       "(casings, machines), file, saw, screwdriver, wire cutter, knife and mortar.",
                       "Keep a full set on you. Keep a spare hammer. Trust me on the hammer.")},
        {"key": "circuits", "title": "Programmed Circuits", "icon": "gtceu:programmed_circuit", "tasks": ["check"], "pos": (2, 2), "deps": ["tools", "river_crossing:machines"],
         "desc": guide("7", "Circuit Numbers",
                       "Some recipes want a &bprogrammed circuit&r set to a number. It's never used up;",
                       "it just tells the machine which recipe you mean when two of them start with the same thing.",
                       "Strata enrichment uses them a lot.")},
        {"key": "strata", "title": "Strata, Not Ores", "icon": "positronics:ferrous_stratum", "tasks": ["check"], "pos": (4, 2), "deps": ["river_crossing:trickle"],
         "desc": guide("8", "Strata",
                       "This world has no ores, and the ore blocks you find drop nothing. Whatever was in them is gone.",
                       "Everything comes from &bstrata&r instead: layers of the old world, pressed thin.",
                       "Seed I comes from hammering (cobblestone, gravel and sand each hide different ones), the Sifter,",
                       "the Ore Generator and bees. Seeds II-V come from enrichment (with a Positronic Core),",
                       "from upgraded generators, and from bees of that tier.",
                       "&7The &bStrata Index&7 chapter lists what every stratum gives.")},
        {"key": "memory", "title": "Positronic Memory Rules", "icon": "projecte:transmutation_tablet", "tasks": ["check"], "pos": (6, 2), "deps": ["strata", "river_crossing:memory"],
         "desc": guide("9", "EMC",
                       "&bPositronic Memory&r (EMC) only understands chemistry: &belements&r (ChemLib atoms) and the molecules made of them.",
                       "An atom is worth &b8 EMC&r at Seed I, and eight times more each tier up: 64, 512, 4,096, 32,768.",
                       "A molecule is worth the sum of its atoms (a cellulose is 168).",
                       "Ingots, strata, cards and crafted parts are worth nothing to it. Break them into atoms first.",
                       "There are no collectors or condensers: EMC only comes from burning what you made yourself.",
                       "Stars charged in a Beam Capacitor (Antimatter Relay) are the keys to the Positronic Cores.")},
        {"key": "clearance", "title": "Clearance and Cores", "icon": "positronics:clearance_card_1", "tasks": ["check"], "pos": (8, 2), "deps": ["memory", "river_crossing:core"],
         "desc": guide("10", "Gates",
                       "Each &bClearance Card&r unlocks the next tier's machine hulls: Card 1 for LV, Card 2 for MV, and so on.",
                       "Each card is made at its own tier.",
                       "From Level 3 on, every card also wants a &bchemistry sample&r (see The Periodic Table).",
                       "&bPositronic Cores&r I-V are catalysts for strata enrichment, generator upgrades and cards, and they're never used up.",
                       "One exception, at the very end: the Final Star eats eight Core V.",
                       "Each Core is built one tier before its strata are needed. NCP planned ahead. It just didn't plan for you.")},
        {"key": "thermal", "title": "Thermal Comfort", "icon": "toughasnails:thermometer", "tasks": ["check"], "pos": (0, 4),
         "external_deps": [WASTE_LANDS_START], "rewards": [("pamhc2crops:cottonseeditem", 2)],
         "desc": guide("12", "Temperature",
                       "Your body has a &btemperature&r. Nights, rain and winter pull it down; heat sources push it up.",
                       "Stand near a campfire at night and stay dry. A roof over your head helps more than you'd think.",
                       "&aDress for it:&r cotton (or flax, jute, sisal or kenaf) makes string, string makes wool, wool makes warm armour.",
                       "Your thermometer shows trouble coming before you feel it. Later, a Thermoregulator heats a whole room.",
                       "&7Enclosed: two cotton seeds. Clothes start in a botany pot.")},
        {"key": "seasons", "title": "Four Seasons", "icon": "sereneseasons:calendar", "tasks": ["check"], "pos": (2, 4), "deps": ["thermal"],
         "rewards": ["botanypots:terracotta_botany_pot"],
         "desc": guide("13", "Seasons",
                       "Time passes in &bseasons&r: spring, summer, autumn, winter. Crops in the open only grow in the seasons they like,",
                       "and winter is cold enough to kill you. Store food before it comes, and keep a warm place to stand.",
                       "&aBotany pots don't care about the weather.&r Your calendar shows the season, and how long until the next one.",
                       "&7Enclosed: one more botany pot, for a crop that grows all year.")},
        {"key": "survival", "title": "Staying Alive", "icon": "toughasnails:thermometer", "tasks": ["check"], "pos": (10, 1), "deps": ["clearance", "multis"],
         "desc": guide("11", "Survival",
                       "Drink clean water. Stay warm, or at least dry. Winter comes every year whether you're ready or not,",
                       "and crops keep their own calendar.",
                       "Nothing spawns here. Mob drops come from the Simulation Lab, or not at all.")},
    ],
}


# ------------------------------------------------------------------ STRATA INDEX (generated from strata.json)
def strata_index():
    here = os.path.dirname(os.path.abspath(__file__))
    data = json.load(open(os.path.join(here, "strata.json"), encoding="utf-8"))
    source = {1: "hand hammering (sometimes), the Sifter, the Ore Generator (Tier 1) and resource bees",
              2: "Seed I strata enriched with Positronic Core II, a Tier 2 Ore Generator, or resource bees of that tier",
              3: "Seed II strata enriched with Positronic Core III, a Tier 3 Ore Generator, or resource bees of that tier",
              4: "Seed III strata enriched with Positronic Core IV, a Tier 4 Ore Generator, or resource bees of that tier",
              5: "Seed IV strata enriched with Positronic Core V, a Tier 5 Ore Generator, or resource bees of that tier"}
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
    "title": "Logistics and Automation", "icon": "pipez:item_pipe",
    "quests": [
        {"key": "pipes", "title": "Pipez", "deps": ["river_crossing:steelhammer"], "tasks": [("pipez:item_pipe", 8), "pipez:wrench"],
         "desc": memo("3001", "Pipes",
                      "You can carry things from one box to another for the rest of your life, or you can build a pipe.",
                      "Item pipes pull from a generator and push into a chest. &aSneak-right-click with the wrench&r to choose which side extracts.",
                      "Fluid and energy pipes work the same way. An upgrade in the pipe makes it faster, and lets you filter what goes through.")},
        {"key": "pipes2", "title": "Fluids and Power", "deps": ["pipes", "river_crossing:power"], "tasks": ["pipez:fluid_pipe", "pipez:energy_pipe", "pipez:basic_upgrade"],
         "desc": memo("3002", "Pipes",
                      "Pipe water from the spring and power from your panels.",
                      "GT cables are better for EU. Pipez energy pipes carry FE, and only FE.")},
        {"key": "drawers", "title": "Functional Storage", "external_deps": [WASTE_LANDS_TIMBER], "tasks": [("functionalstorage:oak_1", 4)],
         "desc": memo("3003", "Drawers",
                      "A drawer holds a ridiculous amount of one thing. Cobblestone, gravel, dust: you'll have mountains of all three.",
                      "Give each mountain a drawer.")},
        {"key": "compacting", "title": "Compacting Drawers", "deps": ["drawers", "river_crossing:steelhammer"], "tasks": ["functionalstorage:compacting_drawer"],
         "desc": memo("3004", "Compacting",
                      "Nuggets in, ingots out. Smelted strata give nuggets, so this one turns them into ingots without you counting to nine.")},
        {"key": "controller", "title": "Storage Controller", "deps": ["compacting", "the_calla:seed2"], "tasks": ["functionalstorage:storage_controller", "functionalstorage:pusher_upgrade"],
         "desc": memo("3005", "Controller",
                      "One block that puts things into every drawer around it. Pusher and puller upgrades move items for you.",
                      "&7Your back stops hurting somewhere around the third one.")},
        {"key": "sfm", "title": "Super Factory Manager", "deps": ["pipes2", "the_calla:seed2", "the_calla:dyegen"], "tasks": ["sfm:manager", ("sfm:cable", 16), "sfm:disk"],
         "desc": memo("3006", "Programming",
                      "Write a tiny program on a disk and it moves items between any inventories on the cable.",
                      "NCP approves of scripts. NCP was mostly scripts, at the end.")},
        {"key": "xnet", "title": "XNet", "deps": ["sfm"], "tasks": ["xnet:controller", ("xnet:netcable_blue", 16)],
         "desc": memo("3007", "Networks",
                      "A controller and its cables move items, fluids and energy by channel. Compact, fast, and quiet about it.")},
        {"key": "toms", "title": "Tom's Simple Storage", "deps": ["river_crossing:steelhammer"], "external_deps": [WASTE_LANDS_GLASS],
         "tasks": ["toms_storage:ts.inventory_connector", "toms_storage:ts.storage_terminal"], "pos": (0, 3),
         "desc": memo("3019", "One Window",
                      "Every chest and drawer touching an &bInventory Connector&r shows up in one &bStorage Terminal&r.",
                      "Inventory cables carry the reach further; a cable connector at the far end picks up one more chest.",
                      "Both want planks, chests, an iron ingot and redstone (the terminal also wants glass). The cable connector",
                      "wants tin and a redstone torch. So it starts the day your steel hammer gets redstone out of Rubric.",
                      "&7It doesn't craft for you. It just stops you opening forty chests to find one screw.",
                      "&7This is your network until the end of LV. AE2 takes over at MV.")},
        {"key": "toms_craft", "title": "Crafting Terminal", "deps": ["toms", "river_crossing:dustsift"],
         "tasks": ["toms_storage:ts.crafting_terminal"], "pos": (2, 3),
         "desc": memo("3020", "One Grid",
                      "A storage terminal, four crafting tables and four diamonds (eight Rough Diamonds from the Array).",
                      "The grid pulls straight from the network, and EMI's recipe transfer fills it for you.",
                      "Sifted quartz also opens the comparator parts: the level emitter and the filters.")},
        {"key": "toms_wireless", "title": "Wireless Terminal (Tom's)", "deps": ["toms_craft", "the_calla:hatches"],
         "tasks": ["toms_storage:ts.wireless_terminal"], "pos": (4, 3),
         "desc": memo("3021", "Sixteen Blocks",
                      "Planks, a comparator, a steel plate, an LV circuit, glass and an &bLV emitter&r.",
                      "The emitter needs quartzite, and only the Array on an LV energy hatch (circuit 2) sifts it out of dust.",
                      "Shift-click it on a terminal to bind it. It reaches &b16 blocks&r.")},
        {"key": "toms_adv", "title": "Advanced Wireless Terminal", "deps": ["toms_wireless", "the_calla:seed2"],
         "tasks": ["toms_storage:ts.adv_wireless_terminal"], "pos": (6, 3),
         "desc": memo("3022", "Sixty-Four Blocks",
                      "Six gold plates, an LV circuit and an &bLV sensor&r around the wireless terminal. It reaches &b64 blocks&r.",
                      "&7After that, the network that follows you everywhere is AE2's.")},
        {"key": "ae_presses", "title": "Inscriber Presses", "deps": ["lud:mvhull"], "tasks": ["ae2:inscriber", "ae2:silicon_press", "ae2:logic_processor_press", "ae2:calculation_processor_press", "ae2:engineering_processor_press"],
         "scrip": 6,
         "desc": memo("3008", "AE2",
                      "Somewhere else, people find these presses in meteorites. Nothing falls from the sky here.",
                      "NCP assembles the four presses in an LV assembler: four steel plates, an LV circuit, and one of what",
                      "each press prints (silicon, a gold plate, certus or a diamond).",
                      "Certus quartz crystals grow from certus dust in an autoclave. The Array sifts it out of rock dust on an",
                      "MV energy hatch (circuit 3), with the sky stone dust and glowstone dust AE2 also needs.",
                      "Diamonds: two Rough Diamonds and a hammer, or graphite (Carbonic Stratum) in an autoclave.")},
        {"key": "ae_fluix", "title": "Fluix", "deps": ["ae_presses"], "tasks": ["ae2:charger", ("ae2:fluix_crystal", 8)],
         "desc": memo("3009", "Fluix",
                      "Charge certus in a charger (it takes GT power), then drop it in water with redstone and quartz.",
                      "It fizzes, and comes out purple. That's fluix.",
                      "&7Nether quartz: autoclave its dust (a Crystalline Stratum byproduct).")},
        {"key": "ae_storage", "title": "ME Storage", "deps": ["ae_fluix"], "tasks": ["ae2:drive", ("ae2:item_storage_cell_1k", 4), "ae2:terminal", "ae2:energy_acceptor"],
         "scrip": 6, "desc": memo("3010", "Storage",
                                  "One network, every item, one screen. The energy acceptor takes GT power.",
                                  "&7After this you'll never open a chest again. You'll feel strange about it for a week.")},
        {"key": "ae_autocraft", "title": "AE2 Autocrafting", "deps": ["ae_storage"],
         "tasks": ["ae2:pattern_encoding_terminal", "ae2:pattern_provider", "ae2:molecular_assembler", "ae2:crafting_unit"], "scrip": 10,
         "desc": memo("3011", "Autocrafting",
                      "Encode patterns, hand them to assemblers and machines, and let the crafting CPUs do the rest.",
                      "&bThis is Lud's exam.&r GT machines can be pattern-provided too.")},
        {"key": "ex_ae", "title": "ExtendedAE", "deps": ["ae_autocraft"], "tasks": ["expatternprovider:ex_pattern_provider", "expatternprovider:ex_interface"],
         "desc": memo("3012", "Bigger", "More pattern slots, more sides, less cable. Bigger is better, for once.")},
        {"key": "matrix", "title": "Assembler Matrix", "deps": ["ex_ae"], "tasks": ["expatternprovider:assembler_matrix_frame"],
         "desc": memo("3013", "Matrix", "A molecular assembler the size of a room, doing thousands of crafts at once.")},
        {"key": "mega", "title": "MEGA Cells", "deps": ["ex_ae"], "tasks": ["megacells:cell_component_1m", "megacells:mega_crafting_unit"],
         "desc": memo("3014", "Capacity", "Storage cells and crafting units measured in millions. You'll fill them. Everyone does.")},
        {"key": "emc_ae", "title": "Positronic Memory in ME", "deps": ["ae_autocraft"], "tasks": ["appliede:emc_module", "appliede:transmutation_terminal"],
         "desc": memo("3015", "EMC",
                      "AppliedE lets your ME network read and write Positronic Memory.",
                      "Anything you've taught the tablet becomes craftable straight from EMC. The tablet and the network finally talk.")},
        {"key": "wireless", "title": "Wireless Terminal", "deps": ["ae_autocraft", "simulation_lab:enderman_drops"],
         "tasks": ["ae2:wireless_crafting_terminal"], "pos": (12, 1.5),
         "desc": memo("3017", "Wireless",
                      "A fluix pearl is an ender pearl that learned AE2. Put it in a wireless receiver and your terminal leaves the wall.",
                      "&7Now you can stand in the middle of the factory and order a stack of plates. It feels like cheating. It isn't.")},
        {"key": "pccard", "title": "Programmed Circuit Card", "deps": ["ae_autocraft"],
         "tasks": ["pccard:card_programmed_circuit"], "pos": (12, -1.5),
         "desc": memo("3018", "Circuit Card",
                      "GregTech wants a programmed circuit in the machine; a pattern provider can't put one there.",
                      "This card can. A crafting card and a programmed circuit, and the provider sets the circuit itself.",
                      "&7One card per provider. It's the cheapest fix in this whole book.")},
        {"key": "quantum", "title": "Quantum Computer", "deps": ["mega"], "tasks": ["advanced_ae:quantum_core"],
         "desc": memo("3016", "Late Game", "AdvancedAE's quantum computer: crafting CPUs at a scale even NCP found excessive.")},
    ],
}


# ------------------------------------------------------------------ CALLA KITCHEN (food & survival)
KITCHEN = {
    "id": "calla_kitchen", "filename": "calla_kitchen", "order": 31, "group": "Side Paths", "scrip": 2,
    "title": "The Calla Kitchen", "icon": "pamhc2foodcore:skilletitem",
    "quests": [
        {"key": "tools1", "title": "Kitchen Tools", "deps": ["river_crossing:trickle"],
         "tasks": ["pamhc2foodcore:cuttingboarditem", "pamhc2foodcore:potitem", "pamhc2foodcore:skilletitem"],
         "desc": memo("3101", "Kitchen",
                      "Pam's cooking tools go in the crafting grid and come back out again. Start with a cutting board, a pot and a skillet.",
                      "&7Every kitchen in the Calla started with those three. Most of them still have them.")},
        {"key": "tools2", "title": "A Full Kitchen", "deps": ["tools1"],
         "tasks": ["pamhc2foodcore:saucepanitem", "pamhc2foodcore:bakewareitem", "pamhc2foodcore:mixingbowlitem", "pamhc2foodcore:juiceritem", "pamhc2foodcore:grinderitem"],
         "desc": memo("3102", "Kitchen", "Saucepan, bakeware, mixing bowl, juicer and grinder: everything a Calla kitchen needs, and a few things it brags about.")},
        {"key": "dishes", "title": "First Dishes", "deps": ["tools1"],
         "tasks": ["pamhc2foodcore:toastitem", "pamhc2foodcore:carrotsoupitem", "pamhc2foodcore:mashedpotatoesitem"],
         "desc": memo("3103", "Cooking",
                      "Cooked food keeps you full for longer. A hot meal also reminds you you're a person, which matters more than it should.",
                      "Carrots, potatoes and wheat seeds are sold at the NCP Shop.")},
        {"key": "soups", "title": "Soups and Juice", "deps": ["dishes", "tools2"],
         "tasks": ["pamhc2foodcore:potatosoupitem", "pamhc2foodcore:pumpkinsoupitem", "pamhc2foodcore:applejuiceitem"],
         "desc": memo("3104", "Cooking", "Soups and juices count as new foods for Spice of Life. Your stomach keeps score.")},
        {"key": "variety", "title": "A Varied Diet", "deps": ["dishes"],
         "tasks": ["pamhc2crops:tomatoitem", "pamhc2crops:lettuceitem", "pamhc2crops:onionitem", "pamhc2crops:cornitem", "pamhc2crops:riceitem", "pamhc2crops:beanitem"],
         "desc": memo("3105", "Spice of Life",
                      "Every few new foods you eat grant you a permanent heart. The Food Book shows how far you've got.",
                      "Most of Pam's crops can be eaten raw. Buy new seeds at the NCP Shop and grow them in pots or a Calla Paddy.")},
        {"key": "variety2", "title": "A Gourmet's Diet", "deps": ["variety", "soups"],
         "tasks": ["pamhc2crops:strawberryitem", "pamhc2crops:cucumberitem", "pamhc2crops:bellpepperitem", "pamhc2crops:broccoliitem", "pamhc2crops:spinachitem", "pamhc2crops:grapeitem"],
         "scrip": 5, "desc": memo("3106", "Spice of Life",
                                  "Eat each of these at least once. Strawberries at the end of the world.",
                                  "&7Each one tastes like a summer you don't quite remember.")},
        {"key": "purifier", "title": "Water Purifier", "deps": ["river_crossing:trickle"], "external_deps": [WASTE_LANDS_GLASS], "tasks": ["toughasnails:water_purifier"],
         "desc": memo("3107", "Water",
                      "Much faster than boiling bottles one at a time. It needs copper, so it comes after your first strata.")},
        {"key": "rain", "title": "Rain Collector", "deps": ["field_manual:thermal"], "external_deps": [WASTE_LANDS_TIMBER], "tasks": ["toughasnails:rain_collector"],
         "desc": memo("3108", "Water",
                      "It catches the rain, so the sky finally gives you something for free.",
                      "It needs string: three cotton, flax, jute, sisal or kenaf make one.")},
        {"key": "juices", "title": "Drinks", "deps": ["purifier"], "tasks": ["toughasnails:apple_juice", "toughasnails:melon_juice"],
         "desc": memo("3109", "Thirst", "Juice quenches thirst better than water. Tastes better too, not that anyone's asking.")},
        {"key": "comfort", "title": "Thermal Comfort", "deps": ["rain", "river_crossing:trickle"], "tasks": ["toughasnails:wool_chestplate", "toughasnails:thermoregulator"],
         "desc": memo("3110", "Temperature",
                      "Wool armour for winter (string makes wool). A thermoregulator keeps a whole room comfortable.",
                      "&7Winter out here doesn't care how tough you are.")},
        {"key": "autofood", "title": "Automated Food", "deps": ["variety", "river_crossing:tools"], "tasks": [("botanypots:terracotta_hopper_botany_pot", 4)],
         "desc": memo("3111", "Automation",
                      "Hopper botany pots over chests, or the Calla Paddy multiblock, and you never farm by hand again.",
                      "The Calla would call that cheating. The Calla would also ask you to build them one.")},
    ],
}


# ------------------------------------------------------------------ NCP SHOP (repeatable, spends Scrip)
def shop():
    offers = [
        # key, title, price, reward, count
        ("wheat", "Wheat Seeds", 1, "minecraft:wheat_seeds", 8),
        ("carrot", "Carrots", 2, "minecraft:carrot", 6),
        ("potato", "Potatoes", 2, "minecraft:potato", 6),
        ("pumpkin", "Pumpkin Seeds", 2, "minecraft:pumpkin_seeds", 4),
        ("melon", "Melon Seeds", 2, "minecraft:melon_seeds", 4),
        ("cane", "Sugar Cane", 2, "minecraft:sugar_cane", 6),
        ("cocoa", "Cocoa Beans", 2, "minecraft:cocoa_beans", 4),
        ("apple", "Apples", 1, "minecraft:apple", 4),
        ("oak", "Oak Sapling", 2, "minecraft:oak_sapling", 3),
        ("birch", "Birch Sapling", 2, "minecraft:birch_sapling", 3),
        ("spruce", "Spruce Sapling", 2, "minecraft:spruce_sapling", 3),
        ("rubber", "Rubber Sapling", 3, "gtceu:rubber_sapling", 2),
        ("apple_tree", "Apple Tree Sapling", 4, "pamhc2trees:apple_sapling", 1),
        ("cherry_tree", "Cherry Tree Sapling", 4, "pamhc2trees:cherry_sapling", 1),
        ("bonemeal", "Bone Meal", 2, "minecraft:bone_meal", 16),
        ("dirt", "Dirt", 2, "minecraft:dirt", 8),
        ("pot", "Botany Pot", 3, "botanypots:terracotta_botany_pot", 1),
        ("hopper_pot", "Hopper Botany Pot", 8, "botanypots:terracotta_hopper_botany_pot", 1),
        ("bee", "Honey Bee (egg)", 6, "minecraft:bee_spawn_egg", 1),
        ("ashy_bee", "Ashy Mining Bee (egg)", 8, "productivebees:spawn_egg_ashy_mining_bee", 1),
        ("blue_bee", "Blue Banded Bee (egg)", 8, "productivebees:spawn_egg_blue_banded_bee", 1),
    ]
    # Replacement tools (decided 2026-11-20): the shop sells only what WEARS OUT and is a pain to remake,
    # never what would skip a quest. Each tool unlocks after the quest where you first craft that grade,
    # and is priced high (about 1/7 of the chapter's Scrip for a wrought tool) so crafting stays the norm.
    tool_grades = [("wrought_iron", "Wrought Iron", 10, "river_crossing:tools"),
                   ("steel", "Steel", 15, "river_crossing:steelhammer")]
    tool_kinds = ["hammer", "wrench", "file", "screwdriver", "wire_cutter", "saw", "mortar", "knife"]
    tool_offers = []
    # Hammers are the tool you burn through, so the shop's hammers come reinforced: Unbreaking I (wrought
    # iron), II (steel), III (diamond). The diamond hammer costs 10 more than steel and unlocks with the
    # first diamond you can make (Rock Dust: Rough Diamonds from the Array).
    hammer_unbreaking = {"wrought_iron": 1, "steel": 2, "diamond": 3}
    def tool_reward(mat, kind):
        if kind != "hammer":
            return f"gtceu:{mat}_{kind}"
        return {"id": f"gtceu:{mat}_hammer",
                "tag": {"Enchantments": [{"id": "minecraft:unbreaking", "lvl": hammer_unbreaking[mat]}]}}
    for mat, mat_name, price, unlock in tool_grades:
        for kind in tool_kinds:
            title = f"{mat_name} {kind.replace('_', ' ').title()}" + (f" (Unbreaking {'I' * hammer_unbreaking[mat]})" if kind == "hammer" else "")
            tool_offers.append((f"tool_{mat}_{kind}", title, price, tool_reward(mat, kind), 1, unlock))
    tool_offers.append(("tool_diamond_hammer", "Diamond Hammer (Unbreaking III)", 25,
                        tool_reward("diamond", "hammer"), 1, "river_crossing:dustsift"))
    # Shears wear out and leaves are biomass (Green Atoms). Plain shears are 2 iron; the shop sells a
    # reinforced pair (Unbreaking III, ~4x the uses) so it is worth the Scrip without replacing the recipe.
    tool_offers.append(("shears", "NCP-issue Shears", 8,
                        {"id": "minecraft:shears", "tag": {"Enchantments": [{"id": "minecraft:unbreaking", "lvl": 3}]}},
                        1, "river_crossing:tools"))
    seeds = ["tomato", "lettuce", "onion", "corn", "rice", "bean", "cucumber", "strawberry", "bellpepper", "broccoli",
             "spinach", "grape", "cotton", "flax", "garlic", "peas", "soybean", "papyrus"]
    # Seed counts by product quality: staples and fibres plenty, vegetables fewer, fruit fewest.
    seed_counts = {"cotton": 6, "flax": 6, "papyrus": 6, "rice": 6, "corn": 6, "soybean": 6, "bean": 6, "peas": 6,
                   "tomato": 4, "lettuce": 4, "onion": 4, "cucumber": 4, "bellpepper": 4, "broccoli": 4, "spinach": 4, "garlic": 4,
                   "strawberry": 2, "grape": 2}
    for c in seeds:
        offers.append((f"seed_{c}", f"{nice('x:' + c)} Seeds", 1, f"pamhc2crops:{c}seeditem", seed_counts.get(c, 4)))
    quests = []
    offers = [o + (None,) for o in offers] + tool_offers
    for i, (key, title, price, item, count, unlock) in enumerate(offers):
        quests.append({"key": key, "title": title, "repeat": True, "consume": True, "deps": [unlock] if unlock else [],
                       "tasks": [("positronics:ncp_scrip", price)], "rewards": [(item, count)], "scrip": 0,
                       "icon": item if isinstance(item, str) else item["id"], "pos": ((i % 6) * 1.5, (i // 6) * 1.5),
                       "desc": [f"&7[NCP Shop]", "", f"{count}x {title} for {price} NCP Scrip.",
                                "&7Click 'Submit' on the task to pay. Repeatable. No refunds; there's nobody left to ask."]
                               + (["&7Replacements only: unlocked once you reach that grade of tools. NCP doesn't sell shortcuts."] if unlock else [])})
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
            ("skeleton", "minecraft:bone", 16, "Bones", "Bones grind into bone meal for your crops. Arrows and skulls come along too."),
            ("cow", "minecraft:leather", 8, "Leather", "Leather for canteens, books and armour. Nobody's milked a real cow in a hundred years."),
            ("sheep", "minecraft:white_wool", 8, "Wool", "Wool for warm armour and beds, in every colour, no dye needed."),
            ("chicken", "minecraft:feather", 8, "Feathers", "Feathers for arrows and books, and chicken for dinner. Don't think too hard about where it came from."),
            ("spider", "minecraft:string", 16, "String", "String by the stack, and spider eyes for brewing. The spider isn't real. The eyes are.")]),
        ("lud:arrival", "MV", 6, [
            ("zombie", "minecraft:rotten_flesh", 16, "Rotten Flesh", "Rotten flesh, and now and then iron, carrots and potatoes. Don't ask where it keeps them."),
            ("slime", "minecraft:slime_ball", 16, "Slime", "Slime balls for sticky pistons and GregTech's rubber alternatives."),
            ("creeper", "minecraft:gunpowder", 16, "Gunpowder", "Gunpowder means TNT, and TNT means the implosion compressor. Stand back."),
            ("enderman", "minecraft:ender_pearl", 8, "Ender Pearls", "Ender pearls for GregTech field generators and sensors. Don't look the model in the eye.")]),
        ("the_cradle:arrival", "HV", 6, [
            ("blaze", "minecraft:blaze_rod", 8, "Blaze Rods", "Blaze rods and powder for HV chemistry. The chamber runs warm for a while afterwards."),
            ("witch", "minecraft:glowstone_dust", 16, "Witch's Pantry", "Redstone, glowstone, sugar: a witch's pantry, minus the witch."),
            ("ghast", "minecraft:ghast_tear", 8, "Ghast Tears", "Ghast tears, and more gunpowder. Something in there is crying. It's only data.")]),
        ("the_dogan:arrival", "EV", 54, [
            ("wither_skeleton", "minecraft:wither_skeleton_skull", 3, "Wither Skulls", "Wither skeleton skulls. You know where this is going."),
            ("magma_cube", "minecraft:magma_cream", 16, "Magma Cream", "Magma cream for heat-resistant chemistry."),
            ("guardian", "minecraft:prismarine_crystals", 8, "Prismarine", "Prismarine crystals, and fish from an ocean that isn't there.")]),
        ("fedic:arrival", "IV", 54, [
            ("shulker", "minecraft:shulker_shell", 4, "Shulker Shells", "Shulker shells: portable storage, grown in a box."),
            ("evoker", "minecraft:totem_of_undying", 1, "Totems", "Totems of undying, and emeralds. Death, simulated, gives you a way out of the real thing.")]),
        ("end_world_luv:arrival", "LuV", 54, [
            ("wither", "minecraft:nether_star", 1, "Nether Stars", "A simulated Wither. The star it leaves behind is very real.")]),
    ]
    quests = [{
        "key": "lab", "title": "The Simulation Lab", "deps": ["the_calla:seed2"],
        "tasks": ["hostilenetworks:sim_chamber", "hostilenetworks:loot_fabricator", ("hostilenetworks:prediction_matrix", 16)],
        "rewards": [model("skeleton")], "scrip": 5, "shape": "gear", "size": 1.4, "pos": (0, 0),
        "desc": memo("3200", "Simulations",
                     "Nothing spawns in this world. Not a cow, not a creeper, not a bird. NCP's answer: simulate them.",
                     "A &bSim Chamber&r runs a &bdata model&r on prediction matrices and power;",
                     "a &bLoot Fabricator&r turns the predictions into real drops.",
                     "Every run teaches the model a little more. Basic models get it wrong a lot, but they learn.",
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
                                        "Here's the next model." + (" Advanced grade, this time. It remembers more." if data > 6 else ""))})
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
                      "Everything from HV up is made of things this world doesn't have any more.",
                      "The Moon, Mars, Venus and Mercury still do. Nothing happened to them. They just waited.",
                      "The NASA Workbench needs your Clearance Card (Level 2, it comes back) and an MV hull.")},
        {"key": "suit", "title": "Suit Up", "deps": ["workbench"],
         "tasks": ["ad_astra:space_helmet", "ad_astra:space_suit", "ad_astra:space_pants", "ad_astra:space_boots", "ad_astra:oxygen_loader"],
         "desc": memo("3402", "Life Support",
                      "There's no air out there. Fill your suit with oxygen at an oxygen loader, and check it twice.")},
        {"key": "fuel", "title": "Rocket Fuel", "deps": ["workbench"], "tasks": [("ad_astra:fuel_bucket", 3)],
         "desc": memo("3403", "Fuel", "Distil ethanol (circuit 5) into rocket fuel at MV. Diesel works too, later.")},
        {"key": "rocket1", "title": "Tier 1 Rocket", "deps": ["suit", "fuel"], "tasks": ["ad_astra:tier_1_rocket", "ad_astra:launch_pad"],
         "scrip": 10, "desc": memo("3404", "Launch",
                                   "Build it at the NASA Workbench, set it on a launch pad, fuel it, and go.",
                                   "&7Don't look down. Actually, do look down, once. You'll never forget it.")},
        {"key": "moon", "title": "The Moon", "deps": ["rocket1"], "tasks": [visit("ad_astra:moon")], "shape": "gear", "size": 1.4, "scrip": 15,
         "desc": memo("3405", "The Moon", "Bring a lot of chests. It's quiet up there, quieter than home, and home is very quiet.")},
        {"key": "moon_minerals", "title": "Lunar Regolith", "deps": ["moon"],
         "tasks": [("ad_astra:moon_sand", 64), ("gtceu:chromite_dust", 8)],
         "desc": memo("3406", "Chrome",
                      "Sift moon sand in an MV sifter for &bchromite&r, cobaltite and vanadium magnetite. Moon stone crushes into moon sand.",
                      "Chrome means kanthal and stainless steel: &bthis is what unlocks HV&r.")},
        {"key": "desh", "title": "Desh", "deps": ["moon"], "tasks": [("ad_astra:desh_ingot", 16)],
         "desc": memo("3407", "Desh", "Moon desh ore, the Tier 2 rocket's metal. The Moon kept its ore. There was nobody here to dig it out.")},
        {"key": "rocket2", "title": "Tier 2 Rocket", "deps": ["desh", "the_cradle:hvhull"], "tasks": ["ad_astra:tier_2_rocket"], "scrip": 10,
         "desc": memo("3408", "Launch", "Desh engines and desh tanks, built at HV.")},
        {"key": "mars", "title": "Mars", "deps": ["rocket2"], "tasks": [visit("ad_astra:mars")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3409", "Mars", "Red, cold and full of titanium. The dust gets into everything. Everything.")},
        {"key": "mars_minerals", "title": "Martian Regolith", "deps": ["mars"], "tasks": [("ad_astra:mars_sand", 64), ("gtceu:rutile_dust", 8)],
         "desc": memo("3410", "Titanium",
                      "Sift mars sand at HV for &brutile&r, ilmenite and magnesite.",
                      "Titanium: &bthis is what unlocks EV&r.")},
        {"key": "ostrum", "title": "Ostrum", "deps": ["mars"], "tasks": [("ad_astra:ostrum_ingot", 16)],
         "desc": memo("3411", "Ostrum", "Mars ostrum ore, the Tier 3 rocket's metal. It's darker than it should be, and heavier.")},
        {"key": "rocket3", "title": "Tier 3 Rocket", "deps": ["ostrum", "the_dogan:evhull"], "tasks": ["ad_astra:tier_3_rocket"], "scrip": 10,
         "desc": memo("3412", "Launch", "Ostrum engines, built at EV. Venus and Mercury are both in range.")},
        {"key": "venus", "title": "Venus", "deps": ["rocket3"], "tasks": [visit("ad_astra:venus")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3413", "Venus", "464 degrees at the surface. Bring heat protection. The suit holds. Don't test for how long.")},
        {"key": "venus_minerals", "title": "Venusian Regolith", "deps": ["venus"], "tasks": [("ad_astra:venus_sand", 64), ("gtceu:scheelite_dust", 8)],
         "desc": memo("3414", "Tungsten",
                      "Sift venus sand at EV for &bscheelite&r, tungstate, molybdenite and sulfur.",
                      "Tungsten: &bthis is what unlocks IV&r.")},
        {"key": "mercury", "title": "Mercury", "deps": ["rocket3"], "tasks": [visit("ad_astra:mercury")], "shape": "gear", "size": 1.4, "scrip": 20,
         "desc": memo("3415", "Mercury", "Closest to the sun and richest in platinum. The sun looks enormous from here. It looks hungry.")},
        {"key": "mercury_minerals", "title": "Mercurian Rock", "deps": ["mercury"], "tasks": [("ad_astra:mercury_cobblestone", 64), ("gtceu:cooperite_dust", 8)],
         "desc": memo("3416", "Platinum", "Sift mercury cobblestone at EV for &bcooperite&r (the platinum group), tantalite and pyrochlore.")},
        {"key": "calorite", "title": "Calorite", "deps": ["venus"], "tasks": [("ad_astra:calorite_ingot", 16)],
         "desc": memo("3417", "Calorite", "Venus calorite ore, the Tier 4 rocket's metal. It stays warm long after you bring it home.")},
        {"key": "rocket4", "title": "Tier 4 Rocket", "deps": ["calorite", "fedic:ivhull"], "tasks": ["ad_astra:tier_4_rocket"], "scrip": 15,
         "desc": memo("3418", "Launch", "Calorite engines, built at IV. Proxima Centauri is in range. Another star. Think about that.")},
        {"key": "glacio", "title": "Glacio", "deps": ["rocket4"], "tasks": [visit("ad_astra:glacio")], "shape": "gear", "size": 1.6, "scrip": 30,
         "desc": memo("3419", "Another Star",
                      "A frozen world around another sun. NCP records mention a gate site here.",
                      "NCP got here first. Of course it did.")},
        {"key": "ruin", "title": "The Ruin", "deps": ["glacio"], "tasks": ["sgjourney:classic_stargate", "sgjourney:classic_dhd"],
         "shape": "hexagon", "size": 1.6, "scrip": 40,
         "desc": memo("3420", "The Door",
                      "Somewhere in Glacio's snowy barrens and ice peaks stands a broken ring of naquadah: an NCP gate site.",
                      "The sites are scattered about every four hundred blocks. Under each ring there's a chest:",
                      "&bthe first Stargate&r and its DHD, packed by somebody who expected to come back.",
                      "&aBring them home.&r Ships got you here. From now on, gates take you further.")},
        {"key": "naquadah", "title": "Naquadah", "deps": ["glacio"], "tasks": [("gtceu:naquadah_dust", 8)],
         "desc": memo("3421", "Naquadah",
                      "Sift glacio cobblestone at IV for monazite, pyrochlore, iridium, osmium and a little &bnaquadah&r.",
                      "Raw naquadah from the gate site macerates into GregTech naquadah too. Naquadah: &bthis is what unlocks ZPM&r.")},
        {"key": "abydos", "title": "Through the Gate", "deps": ["ruin"], "tasks": [visit("sgjourney:abydos")], "shape": "gear", "size": 1.8, "scrip": 50,
         "desc": memo("3422", "Abydos",
                      "Set the gate and its DHD up at home, power it, and dial. The first world beyond the ships.",
                      "&7There are more gate worlds out there. NCP's maps of them stop at the edges.")},
    ],
}


# ------------------------------------------------------------------ THE APIARY (Productive Bees)
APIARY = {
    "id": "apiary", "filename": "apiary", "order": 34, "group": "Side Paths", "scrip": 3,
    "title": "The Apiary", "icon": "productivebees:advanced_oak_beehive",
    "quests": [
        {"key": "hive", "title": "A Home for Bees", "deps": ["river_crossing:trickle"], "tasks": ["productivebees:advanced_oak_beehive"],
         "rewards": ["minecraft:bee_spawn_egg"],
         "desc": memo("3501", "Bees",
                      "Nothing spawns here, and that goes for bees too. NCP's agricultural division ships the first one with your hive.",
                      "An advanced beehive keeps the bees working and collects their combs. Flowers nearby keep them happy.",
                      "&7Listen to them for a minute. It's the first thing that's buzzed around here that wasn't a machine.")},
        {"key": "solitary", "title": "Solitary Bees", "deps": ["hive"], "tasks": [("minecraft:honeycomb", 8)],
         "rewards": ["productivebees:spawn_egg_ashy_mining_bee", "productivebees:spawn_egg_blue_banded_bee"],
         "desc": memo("3502", "Breeding Stock",
                      "Two solitary bees for your breeding programme. More eggs are sold at the NCP Shop.",
                      "Productive Bees' own guide (and EMI) shows which pairs and items lead to which bees.")},
        {"key": "processing", "title": "Comb Processing", "deps": ["solitary", "the_calla:machines"], "tasks": ["gtceu:lv_centrifuge", ("productivebees:wax", 8)],
         "desc": memo("3503", "Centrifuge",
                      "Resource combs only open in a &bGregTech centrifuge&r. A metal or gem comb gives the matching",
                      "&bstratum&r (an iron bee gives Ferrous Stratum), plus wax and honey, at that stratum's tier voltage.",
                      "Bees are a whole second strata stream: no Positronic Core needed for the bee's own tier.")},
        {"key": "resource", "title": "Resource Bees", "deps": ["processing"], "tasks": [{"id": "productivebees:configurable_honeycomb", "tag": {"EntityTag": {"type": "productivebees:iron"}}}, {"id": "productivebees:configurable_honeycomb", "tag": {"EntityTag": {"type": "productivebees:copper"}}}],
         "scrip": 6, "desc": memo("3504", "Metal Bees",
                                  "Breed your way to an iron bee and a copper bee, and bring back one comb of each. Centrifuge them into strata.",
                                  "Higher-tier bees give higher-tier strata, but they need a centrifuge of that tier.",
                                  "&7A bee that makes iron. The old world would've called that a miracle. You'll call it a slow week.")},
        {"key": "honey", "title": "Honey Boosters", "deps": ["processing"], "tasks": [("productivebees:honey_bucket", 2)],
         "desc": memo("3505", "Boosters",
                      "Honey is a booster. In the &bSifter Array&r (circuit 11, 12 or 13, 50 mB a run) it doubles the strata.",
                      "In the &bCalla Paddy&r, beside the water, the harvest goes up to 12 crops a cycle (4 plain, 8 with fertiliser).",
                      "&7Every bee you keep is a little more of everything else.")},
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
    quests = [{"key": "lab", "title": "The NCP Chemistry Lab", "deps": ["the_calla:parts"],
               "tasks": ["alchemistry:dissolver", "alchemistry:compactor"], "rewards": ["chemlib:periodic_table", ("chemlib:hydrogen", 8)],
               "scrip": 5, "shape": "gear", "size": 1.4, "pos": (0, 0),
               "desc": memo("3601", "Chemistry",
                            "The &bDissolver&r breaks almost anything solid into its &belements&r (ChemLib). The &bCombiner&r builds compounds;",
                            "the &bAtomizer&r and &bLiquifier&r handle gases and liquids; &bFusion&r and &bFission&r turn one element into another.",
                            "&bPositronic Memory&r learns elements, and the compounds built from them. 16 elements compress into one GregTech dust, one tier late",
                            "(no shortcut past the planets), and GregTech needs them: every Clearance Card from Level 3 asks for a chemistry sample.",
                            "&7Every row of the table you finish earns samples and Scrip. The old world had a name for every one of these.",
                            "&7Now you will too.")}]
    prev = "lab"
    for i, (key, title, elements, gate) in enumerate(PERIODS):
        deps = [prev] + ([gate] if gate and gate != "the_calla:arrival" else [])
        reward_el = PERIODS[i + 1][2][0] if i + 1 < len(PERIODS) else None
        rewards = [(f"chemlib:{reward_el}", 4)] if reward_el else ["chemlib:periodic_table"]
        quests.append({"key": key, "title": title, "deps": deps, "tasks": [f"chemlib:{e}" for e in elements],
                       "rewards": rewards, "scrip": 2 + len(elements) // 3, "pos": (2 + i * 1.6, 0 if i % 2 == 0 else 1.2),
                       "desc": [f"&7[Periodic Table: {title}]", "", "Collect one of each:"]
                               + [", ".join(("Aluminium" if e == "aluminum" else e.capitalize()) for e in elements[k:k + 6]) + ("," if k + 6 < len(elements) else ".")
                                  for k in range(0, len(elements), 6)]
                               + (["&7The heaviest elements only come from Alchemistry fusion (LuV).",
                                   "&7They don't last long. Neither did the people who named them."] if key == "p7b" else
                                  ["&7Dissolve materials, run element bees, or fuse lighter elements."])})
        prev = key
    for j, (key, title, comps, after) in enumerate(COMPOUNDS):
        quests.append({"key": key, "title": title, "deps": [after], "tasks": [f"chemlib:{c}" for c in comps],
                       "scrip": 3, "pos": (2 + j * 2.4, 3.2),
                       "desc": [f"&7[Chemistry: {title}]", "",
                                "Make one of each: " + ", ".join(c.replace('_', ' ').replace('aluminum', 'aluminium') for c in comps) + ".",
                                "Small molecules craft by hand from their atoms (shapeless). Big ones need the &bCombiner&r.",
                                "&7Sulfuric, hydrochloric and nitric acid, ammonia, methane and ethanol extract into GregTech fluids (LV extractor)."]})
    return {"id": "periodic_table", "filename": "periodic_table", "order": 35, "group": "Side Paths", "scrip": 3,
            "title": "The Periodic Table", "icon": "chemlib:periodic_table", "quests": quests}


# ------------------------------------------------------------------ OPERATOR'S KIT (quality of life)
KIT = {
    "id": "operators_kit", "filename": "operators_kit", "order": 36, "group": "Side Paths", "scrip": 2,
    "title": "The Operator's Kit", "icon": "constructionwand:iron_wand",
    "quests": [
        {"key": "trash", "title": "Trash Cans", "external_deps": [WASTE_LANDS_TIMBER], "pos": (0, 0),
         "tasks": ["trashcans:item_trash_can"],
         "desc": memo("3701", "Waste",
                      "Cobblestone, stone and a chest. Whatever goes in doesn't come out.",
                      "&7The void out there took the whole world. It can take your extra gravel.")},
        {"key": "wand", "title": "Construction Wand", "external_deps": [WASTE_LANDS_TIMBER], "pos": (0, 1.5),
         "tasks": ["constructionwand:stone_wand"],
         "desc": memo("3702", "Building",
                      "Point it at a wall and it lays the next row for you, out of whatever's in your pockets.",
                      "A stone one wears out fast. Iron lasts; a diamond one (synthetic, from the Calla's autoclave) lasts longer.")},
        {"key": "wand2", "title": "Iron Wand", "deps": ["wand", "river_crossing:trickle"], "pos": (2, 1.5),
         "tasks": ["constructionwand:iron_wand"],
         "desc": memo("3703", "Building", "Same trick, more rows before it breaks.")},
        {"key": "wand3", "title": "Diamond Wand", "deps": ["wand2", "the_calla:machines"], "pos": (4, 1.5),
         "tasks": ["constructionwand:diamond_wand"],
         "desc": memo("3704", "Building",
                      "Eight graphite dust and a bucket of water in an LV autoclave make a diamond. NCP called it synthetic.",
                      "&7The wand can't tell the difference. Neither can anyone else.")},
        {"key": "packs", "title": "Pack and Belt", "deps": ["simulation_lab:cow_drops"], "pos": (2, 0),
         "tasks": ["backpacked:backpack", "toolbelt:belt"],
         "desc": memo("3705", "Carrying",
                      "Leather, string and iron: a backpack for the things you need, a tool belt for the things you need right now.",
                      "&7There are no cows. The leather comes out of the Simulation Lab. Try not to think about it.")},
        {"key": "terminal", "title": "GregTech Terminal", "deps": ["simulation_lab:cow_drops"], "pos": (4, 0),
         "tasks": ["gtceu:terminal"],
         "desc": memo("3706", "Multiblocks",
                      "A book (paper and leather), wrought iron and red alloy wire. Right-click a controller and it shows,",
                      "or builds, the whole structure from what you carry.")},
        {"key": "angel", "title": "Angel Block", "deps": ["simulation_lab:chicken_drops"], "pos": (6, 0),
         "tasks": ["angelblockrenewed:angel_block"],
         "desc": memo("3707", "Building",
                      "Feathers and sticks: a block you can place in mid-air. On an island over nothing, that's not a toy.")},
    ],
}

SIDE_CHAPTERS = [FIELD_MANUAL, strata_index(), LOGISTICS, KITCHEN, simulation_lab(), SPACE, APIARY, periodic_table(), KIT, shop()]
