// Positronics: early EMC sources (decided 2026-11-20). EMC exists only on elements, so every source is a
// real chemical breakdown. Balance levers: atoms per operation (yield), element EMC (emc.js) and EU cost.
//   ULV  Atomic Reclaimer: biomass (cellulose, 21 atoms), rock dust (SiO2, 3 atoms per dust), honey (glucose, 24),
//        wax (CH2 chains). Planting pays more than cobble; bees pay best per item.
//   LV   Electrolyzer: water -> 2 H + 1 O (endless water, paid in EU).
//   LV   Centrifuge: air -> nitrogen, oxygen, a little argon (endless air, paid in EU).
// Solars are the other endless input; balance them through panel cost, not here.

ServerEvents.recipes(event => {
    let ULV_EU = 7
    let reclaim = (id, input, outputs, ticks) => {
        let r = event.recipes.gtceu.atomic_reclaimer(`positronics:emc/${id}`)
            .itemInputs(input)
            .duration(ticks)
            .EUt(ULV_EU)
        let fixed = outputs.filter(o => typeof o == 'string')
        if (fixed.length) r = r.itemOutputs(fixed)
        outputs.filter(o => typeof o != 'string').forEach(o => { r = r.chancedOutput(o[0], o[1], 0) })
    }
    let cellulose = ['6x chemlib:carbon', '10x chemlib:hydrogen', '5x chemlib:oxygen']

    // Biomass = cellulose (C6H10O5).
    reclaim('biomass_leaves', '16x #minecraft:leaves', cellulose, 200)
    reclaim('biomass_saplings', '8x #minecraft:saplings', cellulose, 200)
    reclaim('biomass_crops', '16x #forge:crops', cellulose, 200)
    reclaim('biomass_sugar_cane', '16x minecraft:sugar_cane', cellulose, 200)
    reclaim('biomass_plant_ball', '2x gtceu:plant_ball', cellulose, 200)
    reclaim('biomass_wood_pulp', '8x gtceu:wood_dust', cellulose, 200)

    // Rock dust = silica (SiO2), now and then a trace of aluminium.
    reclaim('rock_dust', 'positronics:dust', ['chemlib:silicon', '2x chemlib:oxygen', ['chemlib:aluminum', 200]], 100)
    reclaim('stone_dust', 'gtceu:stone_dust', ['chemlib:silicon', '2x chemlib:oxygen', ['chemlib:aluminum', 200]], 100)

    // The compounds themselves (from the hand mortar) split into their atoms, for when you need the elements.
    reclaim('cellulose', 'chemlib:cellulose', cellulose, 100)
    reclaim('silica', 'chemlib:silicon_dioxide', ['chemlib:silicon', '2x chemlib:oxygen'], 60)
    reclaim('methane', 'chemlib:methane', ['chemlib:carbon', '4x chemlib:hydrogen'], 60)

    // Bees: honey = glucose (C6H12O6, the bottle comes back); wax and combs = CH2 chains.
    reclaim('honey', 'minecraft:honey_bottle', ['6x chemlib:carbon', '12x chemlib:hydrogen', '6x chemlib:oxygen', 'minecraft:glass_bottle'], 160)
    reclaim('wax', 'productivebees:wax', ['4x chemlib:carbon', '8x chemlib:hydrogen'], 120)
    reclaim('honeycomb', 'minecraft:honeycomb', ['4x chemlib:carbon', '8x chemlib:hydrogen'], 120)

    // The machine itself.
    let hullRecipe = (tier, circuit, plate, id) => event.shaped(`gtceu:${tier}_atomic_reclaimer`, [
        'PCP',
        'MHM',
        'PCP'
    ], {
        P: `#forge:plates/${plate}`,
        C: `#gtceu:circuits/${circuit}`,
        M: tier == 'ulv' ? 'gtceu:flint_mortar' : `gtceu:${tier}_electric_motor`,
        H: `gtceu:${tier}_machine_hull`
    }).id(`positronics:emc/${id}`)
    hullRecipe('ulv', 'ulv', 'wrought_iron', 'reclaimer_ulv')
    hullRecipe('lv', 'lv', 'steel', 'reclaimer_lv')
    hullRecipe('mv', 'mv', 'aluminium', 'reclaimer_mv')

    // Water electrolysis (LV): H2O -> 2 H + 1 O. Circuit 7 keeps GT's own water recipes apart.
    event.recipes.gtceu.electrolyzer('positronics:emc/water_to_elements')
        .inputFluids('minecraft:water 1000')
        .circuit(7)
        .itemOutputs('2x chemlib:hydrogen', 'chemlib:oxygen')
        .duration(200)
        .EUt(30)

    // Air (LV): ~78% N2, 21% O2, 1% Ar.
    event.recipes.gtceu.centrifuge('positronics:emc/air_to_elements')
        .inputFluids('gtceu:air 1000')
        .circuit(7)
        .itemOutputs('8x chemlib:nitrogen', '2x chemlib:oxygen')
        .chancedOutput('chemlib:argon', 1000, 0)
        .duration(200)
        .EUt(30)
})
