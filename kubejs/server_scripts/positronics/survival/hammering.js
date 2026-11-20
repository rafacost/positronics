// Positronics: hammering in the world (no crafting grid).
// Place the block, break it with the Reclamation Hammer, and it drops the next step:
//   cobblestone -> gravel -> sand -> dust
// Dust + a water bottle makes clay (for terracotta and botany pots).

let POSITRONICS_HAMMER = 'positronics:reclamation_hammer'
const POSITRONICS_HAMMER_STEPS = {
    'minecraft:cobblestone': 'minecraft:gravel',
    'minecraft:gravel': 'minecraft:sand',
    'minecraft:sand': 'positronics:dust'
}

BlockEvents.broken(event => {
    let { block, player } = event
    if (!player || player.isCreative()) return
    let held = player.mainHandItem
    if (held.id != POSITRONICS_HAMMER) return

    let next = POSITRONICS_HAMMER_STEPS[block.id]
    if (!next) return

    block.set('minecraft:air')
    block.popItem(Item.of(next))
    // Crushing gravel sometimes leaves a flint (the first flint: for GregTech's flint mortar).
    if (next == 'minecraft:sand' && Math.random() < 0.15) block.popItem(Item.of('minecraft:flint'))
    // The Waste Lands trickle: crushing gravel sometimes turns up a Seed I stratum.
    if (next == 'minecraft:sand') {
        global.POSITRONICS_TRICKLE.forEach(t => {
            if (Math.random() < t[1]) block.popItem(Item.of(t[0]))
        })
    }
    held.damage(1, player)
    event.cancel()
})

ServerEvents.recipes(event => {
    // The tool itself: a stone head on two sticks.
    event.shaped(POSITRONICS_HAMMER, [
        'CCC',
        'CSC',
        ' S '
    ], {
        C: 'minecraft:cobblestone',
        S: '#forge:rods/wooden'
    }).id('positronics:tools/reclamation_hammer')

    // Dust + water = clay. The bottle comes back.
    event.shapeless('minecraft:clay_ball', [
        '2x positronics:dust',
        Ingredient.of(Item.of('minecraft:potion', '{Potion:"minecraft:water"}').strongNBT())
    ]).replaceIngredient('minecraft:potion', 'minecraft:glass_bottle')
        .id('positronics:hammering/dust_to_clay')
})
