// Positronics: Tier 1 "Foundation" (River Crossing) machines.
// ULV single-block machines that run GregTech's own recipe types, so steam stays optional:
// a ULV machine accepts any recipe up to 8 EU/t (our Seed I recipes use 7 EU/t).
// IDs become gtceu:ulv_<name>.

// Atomic Reclaimer: breaks simple matter (biomass, rock dust, honey, wax) into its ChemLib elements:
// the early, automatable feed for Positronic Memory (EMC = elements only). Yield follows the formula's
// atom count, so richer molecules pay more (cellulose C6H10O5 = 21 atoms; stone SiO2 = 3).
GTCEuStartupEvents.registry('gtceu:recipe_type', event => {
    event.create('atomic_reclaimer')
        .category('electric')
        .setEUIO('in')
        .setMaxIOSize(1, 4, 0, 0)
        .setSlotOverlay(false, false, GuiTextures.DUST_OVERLAY)
        .setProgressBar(GuiTextures.PROGRESS_BAR_EXTRACT, FillDirection.LEFT_TO_RIGHT)
        .setSound(GTSoundEntries.CHEMICAL)
})

GTCEuStartupEvents.registry('gtceu:machine', event => {
    event.create('atomic_reclaimer', 'simple')
        .tiers(GTValues.ULV, GTValues.LV, GTValues.MV)
        .definition((tier, builder) => builder
            .recipeType('atomic_reclaimer')
            .workableTieredHullModel('gtceu:block/machines/electrolyzer'))
})

GTCEuStartupEvents.registry('gtceu:machine', event => {
    let machines = [
        ['reclamation_crusher', 'macerator', 'macerator'],
        ['reclamation_smelter', 'alloy_smelter', 'alloy_smelter'],
        ['reclamation_furnace', 'electric_furnace', 'electric_furnace'],
        ['reclamation_compressor', 'compressor', 'compressor'],
        ['reclamation_extractor', 'extractor', 'extractor'],
        ['reclamation_forge_hammer', 'forge_hammer', 'forge_hammer'],
        ['reclamation_sifter', 'sifter', 'sifter']
    ]
    machines.forEach(m => {
        event.create(m[0], 'simple')
            .tiers(GTValues.ULV)
            .definition((tier, builder) => builder
                .recipeType(m[1])
                .workableTieredHullModel(`gtceu:block/machines/${m[2]}`))
    })
})
