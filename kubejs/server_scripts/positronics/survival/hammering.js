// Positronics: hammering in the world (no crafting grid).
// Place the block, break it with a hammer, and it drops the next step:
//   cobblestone -> gravel -> sand -> dust
// Any hammer converts blocks (sand for glass, dust for clay). STRATA only pop when the hammer is good
// enough for that step (tools/data/strata.json -> trickle.stages):
//   tier 1  Reclamation Hammer (stone)        cobble -> gravel : ferrous, cupric
//   tier 2  iron / wrought iron / bronze...   gravel -> sand   : stannic, carbonic, plumbic
//   tier 3  steel or better                   sand   -> dust   : rubric (redstone), nickelous
// After that, strata come only from powered machines (sifters, ore generators, bees).

let POSITRONICS_HAMMER = 'positronics:reclamation_hammer'
const POSITRONICS_HAMMER_STEPS = {
    'minecraft:cobblestone': 'minecraft:gravel',
    'minecraft:gravel': 'minecraft:sand',
    'minecraft:sand': 'positronics:dust'
}
const POSITRONICS_STEEL_HAMMERS = /(steel|titanium|tungsten|diamond|netherite|hsse|naquadah|neutronium|duranium|ultimet|damascus)/

global.positronicsHammerTier = id => {
    if (id == POSITRONICS_HAMMER) return 1
    let m = /^gtceu:(.+?)_(mining_)?hammer$/.exec(id)
    if (!m || /forge/.test(id)) return 0
    return POSITRONICS_STEEL_HAMMERS.test(m[1]) ? 3 : 2
}

BlockEvents.broken(event => {
    let { block, player } = event
    if (!player || player.isCreative()) return
    let held = player.mainHandItem
    let tier = global.positronicsHammerTier(String(held.id))
    if (tier == 0) return

    let next = POSITRONICS_HAMMER_STEPS[block.id]
    if (!next) return

    block.set('minecraft:air')
    block.popItem(Item.of(next))
    // Crushing gravel sometimes leaves a flint (the first flint: for GregTech's flint mortar).
    if (next == 'minecraft:sand' && Math.random() < 0.15) block.popItem(Item.of('minecraft:flint'))
    // The trickle: strata, only for a good enough hammer.
    let stage = global.POSITRONICS_TRICKLE_STAGES[block.id]
    if (stage && tier >= stage.hammer_tier) {
        stage.chances.forEach(t => {
            if (Math.random() < t[1]) block.popItem(Item.of(t[0]))
        })
    }
    if (held.id == POSITRONICS_HAMMER) held.damage(1, player)
    else held.hurtAndBreak(1, player, p => {})
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

    // Dust + water (dirty is fine) = clay. The bottle comes back.
    event.shapeless('minecraft:clay_ball', ['2x positronics:dust', 'toughasnails:dirty_water_bottle'])
        .replaceIngredient('toughasnails:dirty_water_bottle', 'minecraft:glass_bottle')
        .id('positronics:hammering/dust_to_clay')
    event.shapeless('minecraft:clay_ball', [
        '2x positronics:dust',
        Ingredient.of(Item.of('minecraft:potion', '{Potion:"minecraft:water"}').strongNBT())
    ]).replaceIngredient('minecraft:potion', 'minecraft:glass_bottle')
        .id('positronics:hammering/dust_to_clay_water')
})
