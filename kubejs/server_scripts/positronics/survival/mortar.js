// Positronics: the mortar breaks early metals into ELEMENTS (ChemLib), so Positronic Memory can learn them
// before the Dissolver (LV). Same rule as the hammers: a harder mortar grinds harder material.
//   flint mortar                      iron, copper
//   iron / wrought iron / bronze...   + tin, lead, carbon
//   steel or better                   + nickel
// EMC balance follows the Dissolver: 1 ingot = 16 elements (and 16 elements compress back into 1 dust).
// A stratum smelts into 3 nuggets (1/3 ingot, about 5.3 elements); by mortar it gives 5 (a small loss).
// Also: wood pulp by hand.

// A crafting recipe has one output; molecules have several elements. The rest of the molecule is
// handed over when the craft is taken (the grid still holds the inputs at that moment).
ItemEvents.crafted(event => {
    let id = String(event.item.id)
    if (id != 'chemlib:silicon' && id != 'chemlib:carbon') return
    let inv = event.inventory
    let player = event.player
    if (!inv || !player) return
    if (id == 'chemlib:silicon' && inv.count(Ingredient.of('positronics:dust')) > 0) {
        player.give('2x chemlib:oxygen')
    } else if (id == 'chemlib:carbon' && inv.count(Ingredient.of('gtceu:plant_ball')) > 0) {
        player.give('10x chemlib:hydrogen')
        player.give('5x chemlib:oxygen')
    }
})

ServerEvents.recipes(event => {
    let mortars = {
        1: ['gtceu:flint_mortar'],
        2: ['gtceu:iron_mortar', 'gtceu:wrought_iron_mortar', 'gtceu:bronze_mortar', 'gtceu:invar_mortar', 'gtceu:cobalt_brass_mortar'],
        3: ['gtceu:steel_mortar', 'gtceu:damascus_steel_mortar']
    }
    // Mortars that grind at least tier n.
    let atLeast = n => {
        let ids = []
        for (let t = n; t <= 3; t++) ids = ids.concat(mortars[t])
        return Ingredient.of(ids)
    }

    // [element, mortar tier, stratum, ingot tag]
    let table = [
        ['iron', 1, 'positronics:ferrous_stratum', '#forge:ingots/iron'],
        ['copper', 1, 'positronics:cupric_stratum', '#forge:ingots/copper'],
        ['tin', 2, 'positronics:stannic_stratum', '#forge:ingots/tin'],
        ['lead', 2, 'positronics:plumbic_stratum', '#forge:ingots/lead'],
        ['carbon', 2, 'positronics:carbonic_stratum', null],
        ['nickel', 3, 'positronics:nickelous_stratum', '#forge:ingots/nickel']
    ]
    table.forEach(row => {
        let el = row[0], tier = row[1], stratum = row[2], ingot = row[3]
        event.shapeless(`5x chemlib:${el}`, [atLeast(tier), stratum])
            .id(`positronics:mortar/stratum_to_${el}`)
        if (ingot) event.shapeless(`16x chemlib:${el}`, [atLeast(tier), ingot])
            .id(`positronics:mortar/ingot_to_${el}`)
    })

    // The way back, by hand, for the basic metals only: 8 atoms -> 4 nuggets (16 atoms = 8 nuggets, a 1/9 loss;
    // the LV compressor's 16 -> 1 dust stays lossless). Lets Positronic Memory pay for early iron and copper
    // without skipping anything: all of these come from the trickle anyway.
    let nuggets = {
        iron: 'minecraft:iron_nugget', copper: 'gtceu:copper_nugget', tin: 'gtceu:tin_nugget',
        lead: 'gtceu:lead_nugget', nickel: 'gtceu:nickel_nugget'
    }
    Object.keys(nuggets).forEach(el => {
        event.shaped(`4x ${nuggets[el]}`, ['EEE', 'E E', 'EEE'], { E: `chemlib:${el}` })
            .id(`positronics:mortar/${el}_atoms_to_nuggets`)
    })

    // Hand EMC (early, manual): the same yields as the Atomic Reclaimer, just slow.
    //   rock dust -> silica: mortar + 1 dust = 1 silicon (+ 2 oxygen, given on craft below)
    //   biomass -> plant mass (GT plant ball) -> cellulose atoms: mortar + 2 plant balls = 6 carbon (+ 10 H, 5 O)
    event.shapeless('chemlib:silicon', [atLeast(1), 'positronics:dust'])
        .id('positronics:mortar/rock_dust_to_silica')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x #minecraft:leaves']).id('positronics:mortar/plant_mass_leaves')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '4x #minecraft:saplings']).id('positronics:mortar/plant_mass_saplings')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x #forge:crops']).id('positronics:mortar/plant_mass_crops')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x minecraft:sugar_cane']).id('positronics:mortar/plant_mass_cane')
    event.shapeless('6x chemlib:carbon', [atLeast(1), '2x gtceu:plant_ball'])
        .id('positronics:mortar/plant_mass_to_cellulose_atoms')

    // Wood pulp (GregTech wood dust): paper, resin boards and more.
    event.shapeless('2x gtceu:wood_dust', [atLeast(1), '#minecraft:logs'])
        .id('positronics:mortar/wood_pulp_from_log')
    event.shapeless('gtceu:wood_dust', [atLeast(1), '#minecraft:planks'])
        .id('positronics:mortar/wood_pulp_from_planks')

    // Wood plank (GT wood plate, the ULV hull's insulation) without the compressor: hammer 2 pulp flat,
    // the same 2:1 hand loss as metal plates. Any GregTech hammer (not the forge hammer machines).
    let hammers = ['iron', 'wrought_iron', 'bronze', 'invar', 'cobalt_brass', 'steel', 'damascus_steel', 'aluminium',
        'stainless_steel', 'titanium', 'tungsten_steel', 'vanadium_steel', 'red_steel', 'blue_steel', 'rose_gold',
        'sterling_silver', 'diamond', 'netherite', 'ultimet', 'hsse', 'tungsten_carbide', 'naquadah_alloy', 'duranium',
        'neutronium'].map(m => `gtceu:${m}_hammer`)
    event.shapeless('gtceu:wood_plate', [Ingredient.of(hammers), '2x gtceu:wood_dust'])
        .id('positronics:mortar/wood_plate_by_hand')
})
