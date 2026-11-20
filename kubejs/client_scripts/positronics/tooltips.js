// Positronics: tooltips for our items.

ItemEvents.tooltip(event => {
    event.add('positronics:ncp_scrip', [
        Text.gray('Company currency of North Central Positronics.'),
        Text.darkGray('Valid at any NCP Vending Terminal. Non-refundable.')
    ])
    event.add('positronics:reclamation_hammer', [
        Text.gray('Place a block and break it with this hammer:'),
        Text.gray('cobblestone > gravel > sand > dust.'),
        Text.darkGray('NCP-approved. Barely.')
    ])
    event.add('positronics:dust', [
        Text.gray('2 dust + a water bottle = clay.')
    ])
})
