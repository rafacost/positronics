// Positronics: mobs only through technology (Hostile Neural Networks).
// Nothing spawns, so data models can't be trained by kills. NCP hands out pre-trained models as
// quest rewards (Simulation Lab chapter); the Sim Chamber improves them with every simulation.
// HNN's own machine recipes need ender pearls, lapis, netherite and diamonds; these use GT parts.

ServerEvents.recipes(event => {
    event.remove({ output: 'hostilenetworks:sim_chamber' })
    event.shaped('hostilenetworks:sim_chamber', [
        ' G ',
        'CHC',
        'PXP'
    ], {
        G: '#forge:glass_panes',
        C: '#gtceu:circuits/lv',
        H: 'gtceu:lv_machine_hull',
        P: '#forge:plates/steel',
        X: 'minecraft:comparator'
    }).id('positronics:mobs/sim_chamber')

    event.remove({ output: 'hostilenetworks:loot_fabricator' })
    event.shaped('hostilenetworks:loot_fabricator', [
        ' R ',
        'CHC',
        'PXP'
    ], {
        R: 'gtceu:lv_robot_arm',
        C: '#gtceu:circuits/lv',
        H: 'gtceu:lv_machine_hull',
        P: '#forge:plates/steel',
        X: '#forge:chests/wooden'
    }).id('positronics:mobs/loot_fabricator')
})
