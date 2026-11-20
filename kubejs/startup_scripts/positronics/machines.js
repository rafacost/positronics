// Positronics: Tier 1 "Foundation" (River Crossing) machines.
// ULV single-block machines that run GregTech's own recipe types, so steam stays optional:
// a ULV machine accepts any recipe up to 8 EU/t (our Seed I recipes use 7 EU/t).
// IDs become gtceu:ulv_<name>.

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
