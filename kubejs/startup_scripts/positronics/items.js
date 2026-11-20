// Positronics: our own items. IDs use the "positronics" namespace so they can move
// into the Positronics Core companion mod later without renaming.

StartupEvents.registry('item', event => {
    // Quest currency, spent at the (future) NCP Vending Terminal.
    event.create('positronics:ncp_scrip')
        .displayName('NCP Scrip')
        .texture('positronics:item/ncp_scrip')
        .maxStackSize(64)
        .rarity('uncommon')
})
