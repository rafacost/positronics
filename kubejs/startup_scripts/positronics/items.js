// Positronics: our own items. IDs use the "positronics" namespace so they can move
// into the Positronics Core companion mod later without renaming.

StartupEvents.registry('item', event => {
    // Quest currency, spent at the (future) NCP Vending Terminal.
    event.create('positronics:ncp_scrip')
        .displayName('NCP Scrip')
        .texture('positronics:item/ncp_scrip')
        .maxStackSize(64)
        .rarity('uncommon')

    // The first tool: crushes cobblestone into gravel and gravel into sand, by hand.
    // A crude stone hammer, because there is no iron for a GregTech hammer yet.
    event.create('positronics:reclamation_hammer')
        .displayName('Reclamation Hammer')
        .texture('positronics:item/reclamation_hammer')
        .maxDamage(64)
})
