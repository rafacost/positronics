// Positronics: tooltips for our items.

ItemEvents.tooltip(event => {
    event.add('positronics:ncp_scrip', [
        Text.gray('Company currency of North Central Positronics.'),
        Text.darkGray('Valid at any NCP Vending Terminal. Non-refundable.')
    ])
})
