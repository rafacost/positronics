// Positronics: ProjectE is "Positronic Memory": learn and transmute, never generate.
// Every passive EMC source and every EMC-free conversion is removed.

ServerEvents.recipes(event => {
    // Passive EMC generation and storage that bypasses production.
    let removedOutputs = [
        'projecte:collector_mk1', 'projecte:collector_mk2', 'projecte:collector_mk3',
        'projecte:condenser_mk1', 'projecte:condenser_mk2',
        'projecte:alchemical_chest',
        'projecte:philosophers_stone',          // in-world and crafting conversions without EMC
        'projecte:transmutation_table',         // replaced by the tablet recipe below
        'projectextended:alchemical_barrel',
        'projectexpansion:infinite_fuel',
        'projectexpansion:infinite_steak'
    ]
    removedOutputs.forEach(id => event.remove({ output: id }))

    // ProjectExpansion generators: collectors, compressed collectors, power flowers, relays, advanced chests.
    event.remove({ output: /^projectexpansion:.*_(collector|compressed_collector|power_flower|relay)$/ })
    event.remove({ output: /^projectexpansion:.*_advanced_alchemical_chest$/ })

    // NOTE: ProjectE Relay MK1 is kept on purpose: it is the "Beam Capacitor" that burns
    // your own production into a Klein Star for the Positronic Cores (see seed-chains-draft.md).
    // Gate it behind Clearance 1 once the ULV content exists.

    // Transmutation Tablet: introduced with the first iron ingot (River Crossing). Iron, glass and
    // an NCP Scrip (your employee ID) to log in to Positronic Memory.
    event.remove({ output: 'projecte:transmutation_tablet' })
    event.shaped('projecte:transmutation_tablet', [
        'IGI',
        'GSG',
        'IGI'
    ], {
        I: 'minecraft:iron_ingot',
        G: '#forge:glass',
        S: 'positronics:ncp_scrip'
    }).id('positronics:projecte/transmutation_tablet')
})
