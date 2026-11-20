// Positronics: the world has no ores. Every resource comes from reclamation (USRG),
// processing lines, or Positronic Memory (EMC).

// No GregTech ore veins anywhere.
GTCEuServerEvents.oreVeins(event => {
    event.removeAll()
})

// Safety net: any ore block that still exists (structures, other mods) drops nothing.
// Dimensions that are meant to have ores later (e.g. space) can be whitelisted here.
const POSITRONICS_ORE_WHITELIST_MODS = []

LootJS.modifiers(event => {
    Ingredient.of('#forge:ores').itemIds.forEach(id => {
        const modId = String(id).split(':')[0]
        if (POSITRONICS_ORE_WHITELIST_MODS.includes(modId)) return
        event.addBlockLootModifier(id).removeLoot(Ingredient.all)
    })
})
