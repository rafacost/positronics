// Positronics: tooltips for our items.

ItemEvents.tooltip(event => {
    event.add('positronics:ncp_scrip', [
        Text.gray('Company currency of North Central Positronics.'),
        Text.darkGray('Valid at any NCP Vending Terminal. Non-refundable.')
    ])
    event.add('positronics:reclamation_hammer', [
        Text.gray('Craft with cobblestone to get gravel,'),
        Text.gray('or with gravel to get sand.'),
        Text.darkGray('NCP-approved. Barely.')
    ])
})
