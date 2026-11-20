// Positronics: the NCP Space Program (Ad Astra). HV and higher tiers are gated by minerals that
// exist only on other worlds (decided 2026-11-20).
//
// GregTech ores only generate in stone types GT knows, so planets don't carry GT veins. Instead,
// a planet's own ground IS its ore: sift planet sand/cobblestone in GregTech machines for that
// planet's minerals. Ad Astra's native planet ores (desh, ostrum, calorite, planet iron...) are
// allowed too (see no_ores.js whitelist): they only exist off Earth.
//
//   Moon    (tier 1 rocket, built at MV)  chromite, cobaltite, vanadium magnetite  -> stainless steel, HV
//   Mars    (tier 2 rocket, built at HV)  rutile, ilmenite, magnesite              -> titanium, EV
//   Venus   (tier 3 rocket, built at EV)  scheelite, tungstate, molybdenite, sulfur -> tungsten, IV
//   Mercury (tier 3 rocket)               cooperite (platinum), tantalite, pyrochlore -> platinum group, IV
//   Glacio  (tier 4 rocket, built at IV)  monazite, bastnasite, pyrochlore, iridium, osmium, naquadah
//                                          + the first Stargate, in a ruin (worldgen in kubejs/data)

const POS_PLANETS = [
    // [input, EU/t, [[output, chance], ...]]
    ['ad_astra:moon_sand', 120, [['gtceu:chromite_dust', 0.25], ['gtceu:cobaltite_dust', 0.15], ['gtceu:vanadium_magnetite_dust', 0.15], ['gtceu:stone_dust', 0.5]]],
    ['ad_astra:mars_sand', 480, [['gtceu:rutile_dust', 0.25], ['gtceu:ilmenite_dust', 0.20], ['gtceu:magnesite_dust', 0.15], ['gtceu:stone_dust', 0.5]]],
    ['ad_astra:venus_sand', 1920, [['gtceu:scheelite_dust', 0.20], ['gtceu:tungstate_dust', 0.15], ['gtceu:molybdenite_dust', 0.15], ['gtceu:sulfur_dust', 0.20]]],
    ['ad_astra:mercury_cobblestone', 1920, [['gtceu:cooperite_dust', 0.20], ['gtceu:tantalite_dust', 0.10], ['gtceu:pyrochlore_dust', 0.10], ['gtceu:stone_dust', 0.5]]],
    ['ad_astra:glacio_cobblestone', 7680, [['gtceu:monazite_dust', 0.20], ['gtceu:bastnasite_dust', 0.15], ['gtceu:pyrochlore_dust', 0.15], ['gtceu:iridium_dust', 0.04], ['gtceu:osmium_dust', 0.03], ['gtceu:naquadah_dust', 0.05]]]
]

ServerEvents.tags('item', event => {
    // Ad Astra's own steel and rods accept GregTech's.
    event.add('ad_astra:steel_plates', '#forge:plates/steel')
    event.add('ad_astra:steel_ingots', '#forge:ingots/steel')
    event.add('ad_astra:steel_blocks', '#forge:storage_blocks/steel')
    event.add('ad_astra:iron_rods', '#forge:rods/iron')
})

ServerEvents.recipes(event => {
    // Planet regolith: sift the ground you bring home.
    POS_PLANETS.forEach(p => {
        let name = p[0].split(':')[1]
        let r = event.recipes.gtceu.sifter(`positronics:space/sift_${name}`)
            .itemInputs(p[0])
            .duration(200)
            .EUt(p[1])
        p[2].forEach(o => { r = r.chancedOutput(o[0], Math.round(o[1] * 10000), 0) })
    })
    // Planet stone crushes into its sand (Moon, Mars, Venus) for sifting.
    ;[['moon', 120], ['mars', 480], ['venus', 1920]].forEach(p => {
        event.recipes.gtceu.macerator(`positronics:space/${p[0]}_stone_to_sand`)
            .itemInputs(`ad_astra:${p[0]}_stone`)
            .itemOutputs(`ad_astra:${p[0]}_sand`)
            .duration(80)
            .EUt(p[1])
    })

    // Stargate Journey naquadah is GregTech naquadah.
    event.recipes.gtceu.macerator('positronics:space/sgj_raw_naquadah')
        .itemInputs('sgjourney:raw_naquadah')
        .itemOutputs('2x gtceu:naquadah_dust')
        .duration(200)
        .EUt(GTValues.VA[GTValues.LuV])

    // The NASA Workbench needs Clearance Level 2 (kept) and an MV hull: rockets start at MV.
    event.remove({ output: 'ad_astra:nasa_workbench' })
    event.shaped('ad_astra:nasa_workbench', [
        'R#R',
        'THT',
        '#K#'
    ], {
        R: '#forge:rods/iron',
        '#': '#forge:plates/steel',
        T: 'minecraft:redstone_torch',
        H: 'gtceu:mv_machine_hull',
        K: 'positronics:clearance_card_2'
    }).keepIngredient('positronics:clearance_card_2').id('positronics:space/nasa_workbench')

    // Rocket fuel from GregTech chemistry (the first launch happens before any oil exists).
    event.recipes.gtceu.distillery('positronics:space/fuel_from_ethanol')
        .inputFluids('gtceu:ethanol 1000')
        .outputFluids('ad_astra:fuel 500')
        .circuit(5)
        .duration(200)
        .EUt(GTValues.VA[GTValues.MV])
    event.recipes.gtceu.distillery('positronics:space/fuel_from_diesel')
        .inputFluids('gtceu:diesel 500')
        .outputFluids('ad_astra:fuel 500')
        .circuit(5)
        .duration(100)
        .EUt(GTValues.VA[GTValues.MV])
})
