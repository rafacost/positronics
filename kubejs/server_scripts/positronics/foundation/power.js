// Positronics: early power (decided 2026-11-20, the Greg-E way).
// GregTech's own ULV solar burns a whole ULV hull for 8 EU/t in daylight, and its battery buffer is useless
// before LV batteries. Instead:
//   - Solar Flux panels make cheap FE. Every tier is half an amp of its GT voltage (config/solarflux/panels.cfg):
//       sp_1 16 FE/t (ULV), sp_2 64 (LV), sp_3 256 (MV), sp_4 1024 (HV), sp_5 4096 (EV), sp_6 16384 (IV),
//       sp_7 65536 (LuV), sp_8 262144 (ZPM). Each tier is 4 of the one below + that tier's circuit + plates,
//       so compacting never gains or loses power: it only saves space.
//   - A GregTech Energy Converter (starts in FE -> EU mode, 4 FE = 1 EU) feeds the machines. Only it needs a hull.
//     It is required: GT machines never accept raw FE (same as Greg-E; nativeEUToFE only lets GT cables feed FE blocks).
//     That keeps GregTech's own solar worth building: 8 EU/t straight onto cable, no converter, no 4:1 loss.
//   - Powah's starter Energy Cell stores the day for the night; the starter Furnator burns coal (carbon) as backup.
//     Powah's own chain (dielectric paste needs lava, capacitors need energized steel) is skipped at ULV,
//     and every Powah generator past the starter Furnator is removed (2026-11-23, see the end of this file).
//   - Methane and ethanol burn at ~140 EU per EMC instead of GregTech's ~700 (2026-11-23, docs/power-design.md).

ServerEvents.recipes(event => {
    // ---- Solar Flux panels
    for (let i = 1; i <= 8; i++) event.remove({ output: `solarflux:sp_${i}` })
    // Solar Flux registers its own recipes through HammerLib (hammerlib:shaped_hl_recipe), which the output
    // filter above never matches: until 0.1.2 every tier had a second, ungated recipe (found 2026-11-25).
    // config/solarflux/recipes.cfg turns them off; removing them by id here is the second lock.
    // Efficiency upgrades multiply output, so they go too; the other upgrades add no power.
    for (let i = 1; i <= 8; i++) event.remove({ id: `solarflux:solar_panel_${i}` })
    for (let i = 1; i <= 6; i++) event.remove({ id: `solarflux:photovoltaic_cell_${i}` })
    ;['solarflux:solar_panels/avaritia/infinity', 'solarflux:solar_panels/avaritia/neutronium',
      'solarflux:efficiency_upgrade'].forEach(id => event.remove({ id: id }))

    // ---- GregTech solar: ULV only (foundation.js, NCP Emergency Solar). GT's LV panel wants LuV circuits and
    // naquadah, MV-UV have no recipe at all, and Solar Flux is the solar line, so the rest go (2026-11-25).
    ;['solar_panel', 'lv_solar_panel', 'mv_solar_panel', 'hv_solar_panel', 'ev_solar_panel', 'iv_solar_panel',
      'luv_solar_panel', 'zpm_solar_panel', 'uv_solar_panel'].forEach(p => event.remove({ output: `gtceu:${p}` }))

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

    // ---- Powah cut (decided 2026-11-23, docs/power-design.md): every generator past the starter Furnator goes.
    // Solar Flux is the solar line, GregTech fuels are the fuel line, so Powah's own panels, furnators, magmators,
    // thermo generators and reactors would only be a second, unpriced path. Cells, cables and the rest stay.
    ;['basic', 'hardened', 'blazing', 'niotic', 'spirited', 'nitro'].forEach(t => event.remove({ output: `powah:furnator_${t}` }))
    ;['starter', 'basic', 'hardened', 'blazing', 'niotic', 'spirited', 'nitro'].forEach(t => {
        ;['solar_panel', 'magmator', 'thermo_generator', 'reactor'].forEach(g => event.remove({ output: `powah:${g}_${t}` }))
    })

    // ---- Fuel priced as spending EMC (decided 2026-11-23, docs/power-design.md). Methane and ethanol can be
    // hand-crafted from atoms and bridged to GregTech fluid (integration/chemistry.js: 250 mB per molecule), and atoms
    // are 8 EMC each. GregTech's own burn values made that ~700 EU per EMC; these make it ~140, so a whole Ore
    // Generator chain (~58,000 EMC/h) burned as fuel runs about one MV amp. The bridge itself is untouched, so
    // rocket fuel (space.js) keeps its cost.
    //   methane : 10 mB -> 7 ticks at 32 EU/t (22.4 EU/mB; 250 mB = 5,600 EU for 40 EMC = 140 EU/EMC)
    //   ethanol :  5 mB -> 6 ticks at 32 EU/t (38.4 EU/mB; 250 mB = 9,600 EU for 72 EMC = 133 EU/EMC)
    event.remove({ id: 'gtceu:gas_turbine/methane' })
    event.recipes.gtceu.gas_turbine('positronics:power/methane')
        .inputFluids('gtceu:methane 10')
        .duration(7)
        .EUt(-GTValues.V[GTValues.LV])
    event.remove({ id: 'gtceu:combustion_generator/ethanol' })
    event.recipes.gtceu.combustion_generator('positronics:power/ethanol')
        .inputFluids('gtceu:ethanol 5')
        .duration(6)
        .EUt(-GTValues.V[GTValues.LV])

})
