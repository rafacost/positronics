// requires: toms_storage
// Positronics: Tom's Simple Storage, the ULV/LV storage step before AE2 (the Star Technology idea).
// Its own recipes stay where every ingredient exists in River Crossing: planks, chests, trapdoors,
// redstone (Rubric), comparators and diamonds (the Sifter Array's dust sifting). Only the parts made
// from things this world never has are swapped: ender pearls, glowstone, spyglass, netherite, name tags.

ServerEvents.recipes(event => {
    let tom = id => `toms_storage:ts.${id}`
    let swap = (id, pattern, key, count) => {
        event.remove({ id: `toms_storage:${id}` })
        event.shaped(`${count || 1}x ${tom(id)}`, pattern, key).id(`positronics:toms_storage/${id}`)
    }

    // The connector reads every inventory touching it. A ULV circuit stands in for the ender pearl.
    swap('inventory_connector', ['PCP', 'cDc', 'PEP'], {
        P: '#minecraft:planks', C: 'minecraft:comparator', c: '#forge:chests/wooden',
        D: '#forge:gems/diamond', E: '#gtceu:circuits/ulv'
    })
    // Cable connectors: one per remote chest, so no diamond and no pearl. Tin and redstone instead.
    swap('inventory_cable_connector', [' qP', 'CcE', ' DP'], {
        q: 'minecraft:quartz', P: '#minecraft:planks', C: tom('inventory_cable'),
        c: '#forge:chests/wooden', E: 'minecraft:redstone', D: '#forge:plates/tin'
    })
    // The terminal's screen is a vacuum-tube circuit, not glowstone.
    swap('storage_terminal', ['PCP', 'cGg', 'PCP'], {
        P: '#minecraft:planks', C: 'minecraft:comparator', c: '#forge:chests/wooden',
        G: '#gtceu:circuits/ulv', g: '#forge:glass'
    })
    // Wireless (16 blocks): still an ender pearl (the Simulation Lab enderman), an LV circuit and gold.
    swap('wireless_terminal', ['PCP', 'aGg', 'PEP'], {
        P: '#minecraft:planks', C: 'minecraft:comparator', a: '#forge:plates/gold',
        G: '#gtceu:circuits/lv', g: '#forge:glass', E: '#forge:ender_pearls'
    })
    // Advanced wireless (64 blocks): steel and two LV circuits instead of netherite.
    event.remove({ id: 'toms_storage:adv_wireless_terminal' })
    event.shaped(tom('adv_wireless_terminal'), ['PCP', 'PTP', 'PCP'], {
        P: '#forge:plates/steel', C: '#gtceu:circuits/lv', T: tom('wireless_terminal')
    }).id('positronics:toms_storage/adv_wireless_terminal')
    // Tag filter: lapis instead of a name tag (name tags can't be crafted).
    event.remove({ id: 'toms_storage:tag_item_filter' })
    event.shapeless(tom('tag_item_filter'), [tom('item_filter'), 'minecraft:comparator', 'minecraft:lapis_lazuli'])
        .id('positronics:toms_storage/tag_item_filter')
})
