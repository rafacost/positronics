// Positronics: register every Stratum (seed grit) from the generated data table.
// Data: tools/data/strata.json -> generated/strata_data.js (global.POSITRONICS_STRATA).
// Strata are never transmutable (no EMC) and never ores.

StartupEvents.registry('item', event => {
    global.POSITRONICS_STRATA.forEach(tier => {
        tier.strata.forEach(s => {
            event.create(s.id)
                .displayName(s.name)
                .texture('positronics:item/stratum')
                .color(0, s.color)
                .tag(`positronics:strata/tier${tier.tier}`)
                .tag('positronics:strata')
        })
    })
})
