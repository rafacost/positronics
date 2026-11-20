// Positronics: the water chain. Glass bottle -> DIRTY water (the island is in plains, which we add to
// Tough As Nails' dirty-water biomes) -> purified water.
//  - Campfire: boil a dirty (or plain) water bottle into purified water. Slow, but it works.
//  - Tough As Nails' Water Purifier also accepts dirty water bottles.
//  - Glass bottles are made by hand from glass (GT's hard glass settings left no recipe).

ServerEvents.recipes(event => {
    event.custom({
        type: 'minecraft:campfire_cooking',
        ingredient: { item: 'toughasnails:dirty_water_bottle' },
        result: 'toughasnails:purified_water_bottle',
        experience: 0.1,
        cookingtime: 600 // 30 seconds per bottle (a purifier is much faster)
    }).id('positronics:survival/boil_dirty_water_on_campfire')

    event.custom({
        type: 'minecraft:campfire_cooking',
        ingredient: {
            type: 'forge:nbt',
            item: 'minecraft:potion',
            nbt: '{Potion:"minecraft:water"}'
        },
        result: 'toughasnails:purified_water_bottle',
        experience: 0.1,
        cookingtime: 600
    }).id('positronics:survival/boil_water_on_campfire')

    event.custom({
        type: 'toughasnails:water_purifying',
        input: { item: 'toughasnails:dirty_water_bottle' },
        purifytime: 200,
        result: { Count: 1, id: 'toughasnails:purified_water_bottle' }
    }).id('positronics:survival/purify_dirty_water')

    event.shaped('3x minecraft:glass_bottle', [
        'G G',
        ' G '
    ], {
        G: '#forge:glass'
    }).id('positronics:survival/glass_bottles')
})
