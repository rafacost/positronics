// Positronics: early-game paths that GregTech's hardcore settings close off.
// GT config keeps hardGlassRecipes and harderCharcoalRecipe ON (hardcore), so:
//  - glass comes from smelting hammered Dust (sand -> dust -> glass), not raw sand;
//  - a rough campfire can be built from logs and sticks (no coal or charcoal needed).

ServerEvents.recipes(event => {
    event.smelting('minecraft:glass', 'positronics:dust')
        .xp(0.1)
        .id('positronics:early/dust_to_glass')

    // Simple meals by hand (Spice of Life variety before any Pam's kitchen tools).
    event.shapeless('positronics:garden_salad', ['minecraft:bowl', 'pamhc2crops:tomatoitem', 'pamhc2crops:lettuceitem'])
        .id('positronics:food/garden_salad')
    event.shapeless('positronics:vegetable_broth', [
        'minecraft:bowl', 'pamhc2crops:tomatoitem', 'pamhc2crops:onionitem', 'toughasnails:purified_water_bottle'
    ]).replaceIngredient('toughasnails:purified_water_bottle', 'minecraft:glass_bottle').id('positronics:food/vegetable_broth')
    event.shapeless('positronics:garden_sandwich', ['minecraft:bread', 'pamhc2crops:tomatoitem', 'pamhc2crops:lettuceitem'])
        .id('positronics:food/garden_sandwich')

    // No spiders, so string comes from fibre crops (Pam's cotton, flax, jute, sisal, kenaf).
    ;['cotton', 'flax', 'jute', 'sisal', 'kenaf'].forEach(c => {
        event.shapeless('minecraft:string', [`3x pamhc2crops:${c}item`]).id(`positronics:early/string_from_${c}`)
    })

    event.shaped('minecraft:campfire', [
        ' S ',
        'SLS',
        'LLL'
    ], {
        S: '#forge:rods/wooden',
        L: '#minecraft:logs'
    }).id('positronics:early/rough_campfire')
})
