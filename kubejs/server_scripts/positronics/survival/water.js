// Positronics: early clean water. Before you have copper for a Tough As Nails
// Water Purifier, you can boil a water bottle on a campfire. Slow, but it works.

ServerEvents.recipes(event => {
    event.custom({
        type: 'minecraft:campfire_cooking',
        ingredient: {
            type: 'forge:nbt',
            item: 'minecraft:potion',
            nbt: '{Potion:"minecraft:water"}'
        },
        result: 'toughasnails:purified_water_bottle',
        experience: 0.1,
        cookingtime: 600 // 30 seconds per bottle (a purifier is much faster)
    }).id('positronics:survival/boil_water_on_campfire')
})
