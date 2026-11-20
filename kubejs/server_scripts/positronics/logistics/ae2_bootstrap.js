// Positronics: make Applied Energistics 2 possible in a world without meteorites or ores.
//  - Inscriber presses (normally found in meteorites) are assembled at LV.
//  - Certus quartz crystals grow from Crystalline Stratum dust in an autoclave.
//  - Nether quartz from its dust (for fluix), AE2 silicon from GT silicon dust.
//  - NCP synthetic diamond: graphite (Carbonic Stratum byproduct) under pressure, so the
//    engineering processor doesn't wait for Seed III gems.

ServerEvents.recipes(event => {
    let VA = GTValues.VA
    let presses = {
        'ae2:silicon_press': 'ae2:silicon',
        'ae2:logic_processor_press': '#forge:plates/gold',
        'ae2:calculation_processor_press': 'ae2:certus_quartz_crystal',
        'ae2:engineering_processor_press': '#forge:gems/diamond'
    }
    Object.keys(presses).forEach(press => {
        event.recipes.gtceu.assembler(`positronics:ae2/${press.split(':')[1]}`)
            .itemInputs('4x #forge:plates/steel', presses[press], '#gtceu:circuits/lv')
            .itemOutputs(press)
            .duration(400)
            .EUt(VA[GTValues.LV])
    })

    event.recipes.gtceu.autoclave('positronics:ae2/certus_crystal')
        .itemInputs('ae2:certus_quartz_dust')
        .inputFluids('minecraft:water 250')
        .itemOutputs('ae2:certus_quartz_crystal')
        .duration(300)
        .EUt(24)

    event.recipes.gtceu.autoclave('positronics:ae2/nether_quartz')
        .itemInputs('gtceu:nether_quartz_dust')
        .inputFluids('minecraft:water 250')
        .itemOutputs('minecraft:quartz')
        .duration(300)
        .EUt(24)

    event.recipes.gtceu.compressor('positronics:ae2/silicon')
        .itemInputs('gtceu:silicon_dust')
        .itemOutputs('ae2:silicon')
        .duration(100)
        .EUt(VA[GTValues.LV])

    event.recipes.gtceu.autoclave('positronics:ae2/synthetic_diamond')
        .itemInputs('8x gtceu:graphite_dust')
        .inputFluids('minecraft:water 1000')
        .itemOutputs('minecraft:diamond')
        .duration(1200)
        .EUt(VA[GTValues.LV])
})
