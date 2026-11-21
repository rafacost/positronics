// Positronics: early power (decided 2026-11-20, the Greg-E way).
// GregTech's own ULV solar burns a whole ULV hull for 8 EU/t in daylight, and its battery buffer is useless
// before LV batteries. Instead:
//   - Solar Flux panels make cheap FE. Every tier is half an amp of its GT voltage (config/solarflux/panels.cfg):
//       sp_1 16 FE/t (ULV), sp_2 64 (LV), sp_3 256 (MV), sp_4 1024 (HV), sp_5 4096 (EV), sp_6 16384 (IV),
//       sp_7 65536 (LuV), sp_8 262144 (ZPM). Each tier is 4 of the one below + that tier's circuit + plates,
//       so compacting never gains or loses power: it only saves space.
//   - A GregTech Energy Converter (starts in FE -> EU mode, 4 FE = 1 EU) feeds the machines. Only it needs a hull.
//     It is required: config/gtceu.yaml nativeEUToFE is false, so GT machines and cables refuse raw FE.
//     That keeps GregTech's own solar worth building: 8 EU/t straight onto cable, no converter, no 4:1 loss.
//   - Powah's starter Energy Cell stores the day for the night; the starter Furnator burns coal (carbon) as backup.
//     Powah's own chain (dielectric paste needs lava, capacitors need energized steel) is skipped at ULV.

ServerEvents.recipes(event => {
    // ---- Solar Flux panels
    for (let i = 1; i <= 8; i++) event.remove({ output: `solarflux:sp_${i}` })

    event.shaped('solarflux:sp_1', [
        'GGG',
        'WRW',
        'PPP'
    ], {
        G: '#forge:glass_panes',
        W: 'gtceu:copper_single_wire',
        R: '#forge:dusts/redstone',
        P: '#forge:plates/iron'
    }).id('positronics:power/solar_1')

    // LV by hand (8 panels + an LV circuit = 2 panels: 128 FE/t either way).
    event.shaped('2x solarflux:sp_2', [
        'SSS',
        'SCS',
        'SSS'
    ], {
        S: 'solarflux:sp_1',
        C: '#gtceu:circuits/lv'
    }).id('positronics:power/solar_2')

    // MV and up in the assembler at their own voltage.
    let up = [
        [3, 'mv', 'aluminium'],
        [4, 'hv', 'stainless_steel'],
        [5, 'ev', 'titanium'],
        [6, 'iv', 'tungsten_steel'],
        [7, 'luv', 'rhodium_plated_palladium'],
        [8, 'zpm', 'naquadah_alloy']
    ]
    up.forEach(u => {
        let n = u[0], tier = u[1], plate = u[2]
        event.recipes.gtceu.assembler(`positronics:power/solar_${n}`)
            .itemInputs(`4x solarflux:sp_${n - 1}`, `#gtceu:circuits/${tier}`, `2x #forge:plates/${plate}`)
            .itemOutputs(`solarflux:sp_${n}`)
            .duration(200)
            .EUt(GTValues.VA[n - 1])
    })

    // ---- ULV energy converter: one per solar bank, so it is the only part that costs a hull.
    event.remove({ output: 'gtceu:ulv_1a_energy_converter' })
    event.shaped('gtceu:ulv_1a_energy_converter', [
        'PRP',
        'WHW',
        'PRP'
    ], {
        P: '#forge:plates/wrought_iron',
        R: '#forge:dusts/redstone',
        W: 'gtceu:red_alloy_single_wire',
        H: 'gtceu:ulv_machine_hull'
    }).id('positronics:power/ulv_converter')

    // ---- Powah starter storage and fuel generator, from ULV materials.
    event.remove({ output: 'powah:energy_cell_starter' })
    event.shaped('powah:energy_cell_starter', [
        'LRL',
        'RBR',
        'LRL'
    ], {
        L: '#forge:plates/lead',
        R: '#forge:dusts/redstone',
        B: '#forge:storage_blocks/iron'
    }).id('positronics:power/energy_cell_starter')

    event.remove({ output: 'powah:furnator_starter' })
    event.shaped('powah:furnator_starter', [
        'PPP',
        'WFW',
        'PRP'
    ], {
        P: '#forge:plates/wrought_iron',
        W: 'gtceu:copper_single_wire',
        F: 'minecraft:furnace',
        R: '#forge:dusts/redstone'
    }).id('positronics:power/furnator_starter')
})
