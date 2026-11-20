// Positronics: early-game paths that GregTech's hardcore settings close off.
// GT config keeps hardGlassRecipes and harderCharcoalRecipe ON (hardcore), so:
//  - glass comes from smelting hammered Dust (sand -> dust -> glass), not raw sand;
//  - a rough campfire can be built from logs and sticks (no coal or charcoal needed).

ServerEvents.recipes(event => {
    event.smelting('minecraft:glass', 'positronics:dust')
        .xp(0.1)
        .id('positronics:early/dust_to_glass')

    event.shaped('minecraft:campfire', [
        ' S ',
        'SLS',
        'LLL'
    ], {
        S: '#forge:rods/wooden',
        L: '#minecraft:logs'
    }).id('positronics:early/rough_campfire')
})
