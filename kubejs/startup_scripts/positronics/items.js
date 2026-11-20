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
    event.create('positronics:reclamation_hammer', 'pickaxe')
        .displayName('Reclamation Hammer')
        .texture('positronics:item/reclamation_hammer')
        .tier('stone')
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
