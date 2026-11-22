// Positronics: our own items and blocks. IDs use the "positronics" namespace so they can
// move into the Positronics Core companion mod later without renaming.

StartupEvents.registry('item', event => {
    // Quest currency, spent at the (future) NCP Vending Terminal.
    event.create('positronics:ncp_scrip')
        .displayName('NCP Scrip')
        .texture('positronics:item/ncp_scrip')
        .maxStackSize(64)
        .rarity('uncommon')

    // The first tool. A stone-tier pickaxe, so it mines at a normal speed. Breaking PLACED
    // cobblestone, gravel or sand with it crushes them one step down (server_scripts hammering.js).
    // Built on GregTech's own hammer textures (wooden handle + head tinted stone grey).
    event.create('positronics:reclamation_hammer', 'pickaxe')
        .displayName('Reclamation Hammer')
        .texture('layer0', 'gtceu:item/tools/handle_hammer')
        .texture('layer1', 'gtceu:item/tools/hammer')
        .color(1, 0x8f8f8f)
        .tier('stone')

    // Rough Diamond: the Sifter Array's dust-sifting gem. GregTech has no flawed diamond, so this is
    // ours: two of them and a hammer make one minecraft:diamond (multiblocks.js).
    event.create('positronics:rough_diamond')
        .displayName('Rough Diamond')
        .texture('layer0', 'gtceu:item/material_sets/diamond/gem_chipped')
        .texture('layer1', 'gtceu:item/material_sets/diamond/gem_chipped_overlay')
        .color(0, 0xB8E8E4)
        .tooltip('§7Industrial grade. Two of them and a hammer make one.')

    // Simple hand-made meals: no Pam's kitchen tools needed (Spice of Life variety from day one).
    event.create('positronics:garden_salad')
        .displayName('Garden Salad')
        .texture('positronics:item/garden_salad')
        .maxStackSize(16)
        .food(f => f.hunger(6).saturation(0.6).eaten(e => e.player.give('minecraft:bowl')))
    event.create('positronics:vegetable_broth')
        .displayName('Vegetable Broth')
        .texture('positronics:item/vegetable_broth')
        .maxStackSize(16)
        .food(f => f.hunger(7).saturation(0.7).eaten(e => e.player.give('minecraft:bowl')))
    event.create('positronics:garden_sandwich')
        .displayName('Garden Sandwich')
        .texture('positronics:item/garden_sandwich')
        .food(f => f.hunger(8).saturation(0.8))
})

StartupEvents.registry('block', event => {
    // The step after sand: fine dust. Feeds clay now, and the Seed I trickle later.
    event.create('positronics:dust')
        .displayName('Dust')
        .textureAll('positronics:block/dust')
        .soundType('sand')
        .hardness(0.4)
        .resistance(0.4)
        .tagBlock('minecraft:mineable/shovel')
})
