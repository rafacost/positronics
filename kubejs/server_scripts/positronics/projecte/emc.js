// Positronics: Positronic Memory starts EMPTY.
// ProjectE gives almost every vanilla item an EMC value by default. Here every item is reset
// to no EMC, and only the values we decide (POSITRONICS_EMC below) are given back.
// Rationale: EMC is earned through processing lines (see docs/seed-chains-draft.md §4),
// never from basic world blocks.

// Raw outputs of the Strata lines (dusts and their ingots), valued per seed tier.
// Generated from tools/data/strata.json (emc_per_tier) by tools/make_strata.py.
const POSITRONICS_EMC = global.POSITRONICS_EMC_VALUES || {}

ProjectEEvents.setEMC(event => {
    let cleared = 0
    Ingredient.all.itemIds.forEach(id => {
        if (POSITRONICS_EMC[id] === undefined) {
            event.setEMCAfter(id, 0)
            cleared++
        }
    })
    Object.keys(POSITRONICS_EMC).forEach(id => event.setEMCAfter(id, POSITRONICS_EMC[id]))
    console.info(`[Positronics] Positronic Memory: cleared EMC from ${cleared} items, set ${Object.keys(POSITRONICS_EMC).length} values.`)
})
