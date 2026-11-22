// requires: toms_storage
// Positronics: Tom's Simple Storage is the storage network from early ULV to the end of LV; AE2 takes
// over at MV. The timeline its recipes follow:
//   first redstone (Steel Hammer) : connector, terminal, cables, cable connector (iron, redstone, tin)
//   end of ULV (Sifter Array)     : crafting terminal (Rough Diamonds), comparator parts (sifted quartz)
//   LV (the Calla)                : wireless terminal, 16 blocks (an LV emitter, steel)
//   end of LV (Seed II)           : advanced wireless, 64 blocks (gold, an LV sensor)
// LV emitters and sensors need quartzite, which only the Array's circuit 2 drops (multiblocks.js).
// Untouched defaults already fit: trim, crate, proxy, cable, hopper, filters, level emitter, crafting terminal.

ServerEvents.recipes(event => {
    let tom = id => `toms_storage:ts.${id}`
    let swap = (id, pattern, key) => {
        event.remove({ id: `toms_storage:${id}` })
        event.shaped(tom(id), pattern, key).id(`positronics:toms_storage/${id}`)
    }

    // No comparator, diamond or ender pearl: iron and redstone, so it lands with the first redstone.
    swap('inventory_connector', ['PRP', 'cIc', 'PRP'], {
        P: '#minecraft:planks', R: 'minecraft:redstone', c: '#forge:chests/wooden', I: '#forge:ingots/iron'
    })
    swap('storage_terminal', ['PRP', 'cIg', 'PRP'], {
        P: '#minecraft:planks', R: 'minecraft:redstone', c: '#forge:chests/wooden', I: '#forge:ingots/iron', g: '#forge:glass'
    })
    swap('inventory_cable_connector', [' RP', 'CcE', ' TP'], {
        R: 'minecraft:redstone_torch', P: '#minecraft:planks', C: tom('inventory_cable'),
        c: '#forge:chests/wooden', E: 'minecraft:redstone', T: '#forge:plates/tin'
    })
    // Wireless (16 blocks): an LV emitter where the ender pearl was, steel for the spyglass, an LV circuit for glowstone.
    swap('wireless_terminal', ['PCP', 'sGg', 'PEP'], {
        P: '#minecraft:planks', C: 'minecraft:comparator', s: '#forge:plates/steel',
        G: '#gtceu:circuits/lv', g: '#forge:glass', E: 'gtceu:lv_emitter'
    })
    // Advanced wireless (64 blocks): gold (Seed II) and an LV sensor instead of netherite.
    event.remove({ id: 'toms_storage:adv_wireless_terminal' })
    event.shaped(tom('adv_wireless_terminal'), ['PCP', 'PTP', 'PSP'], {
        P: '#forge:plates/gold', C: '#gtceu:circuits/lv', T: tom('wireless_terminal'), S: 'gtceu:lv_sensor'
    }).id('positronics:toms_storage/adv_wireless_terminal')
    // Tag filter: lapis (sifted) instead of a name tag, which can't be crafted.
    event.remove({ id: 'toms_storage:tag_item_filter' })
    event.shapeless(tom('tag_item_filter'), [tom('item_filter'), 'minecraft:comparator', 'minecraft:lapis_lazuli'])
        .id('positronics:toms_storage/tag_item_filter')
})
