// Positronics: the mortar breaks early metals into ELEMENTS (ChemLib), so Positronic Memory can learn them
// before the Dissolver (LV). Same rule as the hammers: a harder mortar grinds harder material.
//   flint mortar                      iron, copper
//   iron / wrought iron / bronze...   + tin, lead, carbon
//   steel or better                   + nickel
// EMC balance follows the Dissolver: 1 ingot = 16 elements (and 16 elements compress back into 1 dust).
// A stratum smelts into 3 nuggets (1/3 ingot, about 5.3 elements); by mortar it gives 5 (a small loss).
// Also: wood pulp by hand.

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

    // Hand EMC (early, manual): the mortar makes the real ChemLib compounds, which Positronic Memory values
    // at the sum of their atoms (projecte/emc.js). The Atomic Reclaimer splits them into elements.
    //   rock dust -> silicon dioxide (SiO2)
    //   biomass -> plant mass (GT plant ball) -> cellulose (C6H10O5)
    event.shapeless('chemlib:silicon_dioxide', [atLeast(1), 'positronics:dust'])
        .id('positronics:mortar/rock_dust_to_silica')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x #minecraft:leaves']).id('positronics:mortar/plant_mass_leaves')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '4x #minecraft:saplings']).id('positronics:mortar/plant_mass_saplings')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x #forge:crops']).id('positronics:mortar/plant_mass_crops')
    event.shapeless('gtceu:plant_ball', [atLeast(1), '8x minecraft:sugar_cane']).id('positronics:mortar/plant_mass_cane')
    event.shapeless('chemlib:cellulose', [atLeast(1), '2x gtceu:plant_ball'])
        .id('positronics:mortar/plant_mass_to_cellulose')

    // Rubber by hand (the ULV hull's cables need a rubber plate; GT only makes those in machines).
    // Same resin cost as the machine route (extractor 1 resin = 3 raw rubber; 3 raw + sulfur = 1 ingot;
    // 2 ingots = 1 plate), no sulfur, just slower.
    event.shapeless('gtceu:raw_rubber_dust', [atLeast(1), '2x gtceu:sticky_resin'])
        .id('positronics:mortar/raw_rubber_by_hand')
    event.smelting('gtceu:rubber_plate', 'gtceu:raw_rubber_dust').xp(0.1)
        .id('positronics:mortar/rubber_sheet_by_hand')

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
