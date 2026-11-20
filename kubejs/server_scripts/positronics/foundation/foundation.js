// Positronics: Tier 1 "Foundation" (River Crossing) recipes.
// - Our ULV machines (gtceu:ulv_reclamation_*), built from a ULV hull.
// - ULV-voltage alloys so the first metals don't need LV (GT's stock alloy recipes are 16 EU/t).
// - Wrought iron from iron in a furnace, steel from iron + carbon in the ULV smelter (no coke oven).

ServerEvents.recipes(event => {
    let machineParts = {
        reclamation_crusher: 'minecraft:flint',
        reclamation_smelter: 'minecraft:furnace',
        reclamation_furnace: 'minecraft:furnace',
        reclamation_compressor: 'minecraft:piston',
        reclamation_extractor: 'minecraft:glass_bottle',
        reclamation_forge_hammer: '#forge:storage_blocks/iron',
        reclamation_sifter: 'minecraft:iron_bars'
    }
    Object.keys(machineParts).forEach(name => {
        event.shaped(`gtceu:ulv_${name}`, [
            'WCW',
            'XHX',
            'WCW'
        ], {
            W: '#forge:plates/wrought_iron',
            C: '#gtceu:circuits/ulv',
            X: machineParts[name],
            H: 'gtceu:ulv_machine_hull'
        }).id(`positronics:foundation/${name}`)
    })

    // ULV alloys (7 EU/t) in any alloy smelter. GT's own 16 EU/t versions of bronze and
    // tin alloy have the same inputs, so they are replaced (otherwise ours never register).
    event.remove({ type: 'gtceu:alloy_smelter', output: 'gtceu:bronze_ingot' })
    event.remove({ type: 'gtceu:alloy_smelter', output: 'gtceu:tin_alloy_ingot' })
    let alloy = (id, a, b, out, ticks) => event.recipes.gtceu.alloy_smelter(`positronics:foundation/${id}`)
        .itemInputs(a, b).itemOutputs(out).duration(ticks).EUt(7)
    alloy('bronze', '3x #forge:ingots/copper', '#forge:ingots/tin', '4x gtceu:bronze_ingot', 200)
    alloy('bronze_dust', '3x #forge:dusts/copper', '#forge:dusts/tin', '4x gtceu:bronze_ingot', 200)
    alloy('tin_alloy_dust', '#forge:dusts/iron', '#forge:dusts/tin', '2x gtceu:tin_alloy_ingot', 200)
    alloy('red_alloy', '#forge:ingots/copper', '4x #forge:dusts/redstone', 'gtceu:red_alloy_ingot', 150)
    alloy('steel', '#forge:ingots/iron', '2x #forge:dusts/coal', 'gtceu:steel_ingot', 600)
    alloy('tin_alloy', '#forge:ingots/iron', '#forge:ingots/tin', '2x gtceu:tin_alloy_ingot', 200)
    alloy('cupronickel', '#forge:ingots/copper', '#forge:ingots/nickel', '2x gtceu:cupronickel_ingot', 200)

    // ---- ULV deadlock fixes (found by tools/server-test.ps1 recipe watch):
    // 1. GT's ULV solar panel needs HV circuits and Solar Flux tier 1 has no recipe here, so there was no
    //    ULV power source without steam. NCP Emergency Solar: a cheap ULV panel.
    event.remove({ output: 'gtceu:ulv_solar_panel' })
    event.shaped('gtceu:ulv_solar_panel', [
        'GGG',
        'PCP',
        'WHW'
    ], {
        G: '#forge:glass_panes',
        P: '#forge:plates/wrought_iron',
        C: '#forge:dusts/redstone',
        W: 'gtceu:red_alloy_single_wire',
        H: 'gtceu:ulv_machine_hull'
    }).id('positronics:foundation/emergency_solar')

    // 2. Glass tubes only had 16+ EU/t recipes, but ULV machines run 8 V: the ULV circuit was locked.
    event.shaped('2x gtceu:glass_tube', [
        'P P',
        'P P',
        ' P '
    ], {
        P: '#forge:glass_panes'
    }).id('positronics:foundation/glass_tube_by_hand')
    event.recipes.gtceu.alloy_smelter('positronics:foundation/glass_tube_ulv')
        .itemInputs('gtceu:glass_dust')
        .notConsumable('gtceu:ball_casting_mold')
        .itemOutputs('gtceu:glass_tube')
        .duration(160)
        .EUt(7)

    // 3. The hand resistor needed carbon dust (LV centrifuge). Coal dust from the Carbonic Stratum works too.
    event.shaped('2x gtceu:resistor', [
        'SPS',
        'WCW',
        ' P '
    ], {
        S: 'gtceu:sticky_resin',
        P: 'minecraft:paper',
        W: '#forge:fine_wires/copper',
        C: '#forge:dusts/coal'
    }).id('positronics:foundation/resistor_coal')

    // 4. Steel without power: the Primitive Blast Furnace (iron + coal). Its firebricks needed a powered
    //    compressor for compressed fireclay; pack it by hand instead. Chain: clay + bricks (mortar) ->
    //    fireclay dust -> compressed fireclay -> furnace -> firebrick -> firebricks.
    // GregTech removes the vanilla 4 clay balls -> clay block; the mortar needs the block for clay dust.
    event.shaped('minecraft:clay', ['CC', 'CC'], { C: 'minecraft:clay_ball' })
        .id('positronics:foundation/clay_block_by_hand')
    event.shapeless('gtceu:compressed_fireclay', ['gtceu:fireclay_dust'])
        .id('positronics:foundation/compressed_fireclay_by_hand')

    // Wrought iron: just cook the iron again.
    event.smelting('gtceu:wrought_iron_ingot', '#forge:ingots/iron').xp(0.1).id('positronics:foundation/wrought_iron')

    // Molten Tin Alloy for Cupronickel coils (lesson from Greg-E: otherwise only the EV ABS makes it).
    event.recipes.gtceu.extractor('positronics:foundation/tin_alloy_fluid')
        .itemInputs('gtceu:tin_alloy_ingot')
        .outputFluids('gtceu:tin_alloy 144')
        .duration(80)
        .EUt(30)
})
