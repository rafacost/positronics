// Positronics: hand-hammering. Cobblestone -> gravel -> sand, one block at a time.
// Works with our stone Reclamation Hammer (loses durability) and with any GregTech
// hammer later (GT tools take their own crafting damage).

ServerEvents.tags('item', event => {
    event.add('positronics:hand_hammers', 'positronics:reclamation_hammer')
    event.add('positronics:hand_hammers', '#forge:tools/hammers')
})

ServerEvents.recipes(event => {
    // The tool itself: a stone head on two sticks.
    event.shaped('positronics:reclamation_hammer', [
        'CCC',
        'CSC',
        ' S '
    ], {
        C: 'minecraft:cobblestone',
        S: '#forge:rods/wooden'
    }).id('positronics:tools/reclamation_hammer')

    const hammer = '#positronics:hand_hammers'

    event.shapeless('minecraft:gravel', ['minecraft:cobblestone', hammer])
        .damageIngredient('positronics:reclamation_hammer')
        .id('positronics:hammering/cobblestone_to_gravel')

    event.shapeless('minecraft:sand', ['minecraft:gravel', hammer])
        .damageIngredient('positronics:reclamation_hammer')
        .id('positronics:hammering/gravel_to_sand')
})
