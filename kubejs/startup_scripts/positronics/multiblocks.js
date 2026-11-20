// Positronics: signature multiblocks (docs/multiblocks.md). EXPERIMENTAL in Alpha 0.1:
// registration is verified on the test server; structures still need an in-game check.
//
// 1. Reclamation Sifter Array (River Crossing, ULV+): a 3x3x3 steel box that runs sifter recipes
//    with hatches and overclocking; the strata trickle at scale.
// 2. Calla Paddy (The Calla, LV+): a 5x5 glasshouse over dirt that grows Pam's crops from a seed
//    that is never consumed, plus water. Its own recipe type: positronics calla_paddy.

GTCEuStartupEvents.registry('gtceu:recipe_type', event => {
    event.create('calla_paddy')
        .category('multiblock')
        .setEUIO('in')
        .setMaxIOSize(3, 3, 2, 0)
        .setSlotOverlay(false, false, GuiTextures.BOX_OVERLAY)
        .setProgressBar(GuiTextures.PROGRESS_BAR_ARROW, FillDirection.LEFT_TO_RIGHT)
        .setSound(GTSoundEntries.CHEMICAL)
})

GTCEuStartupEvents.registry('gtceu:machine', event => {
    let hatches = () => Predicates.blocks('gtceu:solid_machine_casing')
        .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setMaxGlobalLimited(2).setPreviewCount(1))
        .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setMaxGlobalLimited(1).setPreviewCount(1))
        .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setMaxGlobalLimited(2).setPreviewCount(1))
        .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1).setPreviewCount(1))
        .or(Predicates.abilities(PartAbility.INPUT_ENERGY).setMinGlobalLimited(1).setMaxGlobalLimited(2).setPreviewCount(1))

    event.create('reclamation_sifter_array', 'multiblock')
        .rotationState(RotationState.NON_Y_AXIS)
        .recipeType('sifter')
        .appearanceBlock(GTBlocks.CASING_STEEL_SOLID)
        .recipeModifiers([GTRecipeModifiers.PARALLEL_HATCH, GTRecipeModifiers.OC_NON_PERFECT])
        .pattern(definition => FactoryBlockPattern.start()
            .aisle('CCC', 'CCC', 'CCC')
            .aisle('CCC', 'C#C', 'CCC')
            .aisle('CSC', 'CCC', 'CCC')
            .where('S', Predicates.controller(Predicates.blocks(definition.get())))
            .where('C', hatches())
            .where('#', Predicates.air())
            .build())
        .workableCasingModel('gtceu:block/casings/solid/machine_casing_solid_steel', 'gtceu:block/machines/sifter')

    event.create('calla_paddy', 'multiblock')
        .rotationState(RotationState.NON_Y_AXIS)
        .recipeType('calla_paddy')
        .appearanceBlock(GTBlocks.CASING_STEEL_SOLID)
        .recipeModifiers([GTRecipeModifiers.PARALLEL_HATCH, GTRecipeModifiers.OC_NON_PERFECT])
        .pattern(definition => FactoryBlockPattern.start()
            .aisle('CCCCC', 'GGGGG', 'GGGGG')
            .aisle('CDDDC', 'G###G', 'GGGGG')
            .aisle('CDDDC', 'G###G', 'GGGGG')
            .aisle('CDDDC', 'G###G', 'GGGGG')
            .aisle('CCSCC', 'GGGGG', 'GGGGG')
            .where('S', Predicates.controller(Predicates.blocks(definition.get())))
            .where('C', hatches())
            .where('D', Predicates.blocks('minecraft:dirt').or(Predicates.blocks('minecraft:grass_block')).or(Predicates.blocks('minecraft:farmland')))
            .where('G', Predicates.blocks('minecraft:glass'))
            .where('#', Predicates.air())
            .build())
        .workableCasingModel('gtceu:block/casings/solid/machine_casing_solid_steel', 'gtceu:block/multiblock/implosion_compressor')
})
