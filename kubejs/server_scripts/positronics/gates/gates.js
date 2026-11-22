// Positronics: tier gates.
//  1. Positronic Cores I-V: a FULLY charged star in the centre of a grid that grows with the tier
//     (decided 2026-11-20): Core I 3x3 (crafting table, ULV), II 4x4 and III 5x5 (Nether Crafting Table,
//     LV/MV), IV 7x7 (End Crafting Table, EV), V 9x9 (Extreme Crafting Table, LuV). Avaritia tables only
//     come in 3/5/7/9, and a smaller pattern fits a bigger table.
//     Stars are charged by the Antimatter Relay ("Beam Capacitor") burning your own production.
//  2. NCP Clearance Cards 1-10: card N is made at tier N; it gates tier N+1 machine hulls.
//  3. USRG tier upgrades need that tier's Positronic Core as a catalyst.
// Star capacities: global.POSITRONICS_STAR_CAPS (measured on the test server), with a x4 fallback.

let POS_STAR_STEPS = ['ein', 'zwei', 'drei', 'vier', 'sphere', 'omega']

function posStarCap(id) {
    let caps = global.POSITRONICS_STAR_CAPS || {}
    if (caps[id] && !String(caps[id]).startsWith('error')) return String(caps[id])
    // Fallback: Klein Ein = 50,000 and every step x4 (ProjectE / ProjectExpansion convention).
    let order = []
    POS_STAR_STEPS.forEach(s => order.push('projecte:klein_star_' + s))
    ;['magnum', 'colossal', 'gargantuan'].forEach(k => POS_STAR_STEPS.forEach(s => order.push(`projectexpansion:${k}_star_${s}`)))
    let idx = order.indexOf(id)
    let BigInteger = Java.loadClass('java.math.BigInteger')
    let v = BigInteger.valueOf(50000)
    for (let i = 0; i < idx; i++) v = v.multiply(BigInteger.valueOf(4))
    return v.toString()
}

// A star that must be completely full.
function posFullStar(id) {
    return { type: 'forge:partial_nbt', item: id, nbt: `{StoredEMC:${posStarCap(id)}L}` }
}
global.posFullStar = posFullStar // multiblocks.js (the Sifter Array controller) uses it too

// Which star each Positronic Core needs (tunable; see docs/seed-chains-draft.md).
// Each Core is built ONE tier before its strata are needed (Seed III chrome is needed for HV
// stainless steel, Seed IV tungsten for IV, Seed V naquadah for ZPM).
// Rebalanced 2026-11-20: every star one size down (/16). Measured ULV rate: one Ore Generator (30 strata/min)
// into two Atomic Reclaimers is ~58k EMC/h, so Core I's 200k is an evening, not 3.2M (55 hours).
// Each step after is x16 per tier: element value x8 per tier (emc.js) and about x2 throughput.
const POS_CORE_STARS = {
    1: 'projecte:klein_star_zwei',            // built at ULV (River Crossing)      200,000
    2: 'projecte:klein_star_vier',            // built at LV  (The Calla)         3,200,000
    3: 'projecte:klein_star_omega',           // built at MV  (Lud)              51,200,000
    4: 'projectexpansion:magnum_star_vier',   // built at EV  (The Dogan)    13,107,200,000
    5: 'projectexpansion:colossal_star_zwei'  // built at LuV (End-World I) 3,355,443,200,000
}

// Grid per core: [table tier (0 = vanilla crafting table), pattern]. A, B, C, D = POS_CORE_PARTS, S = the star.
const POS_CORE_GRIDS = {
    1: [0, ['ADA', 'BSB', 'ADA']],
    2: [2, ['ABBA', 'CSDC', 'CDDC', 'ABBA']],
    3: [2, ['ABBBA', 'BCDCB', 'BDSDB', 'BCDCB', 'ABBBA']],
    4: [3, ['AABBBAA', 'ACCDCCA', 'BCDDDCB', 'BDDSDDB', 'BCDDDCB', 'ACCDCCA', 'AABBBAA']],
    5: [4, ['AABBBBBAA', 'ACCDDDCCA', 'BCDDDDDCB', 'BDDCCCDDB', 'BDDCSCDDB', 'BDDCCCDDB', 'BCDDDDDCB', 'ACCDDDCCA', 'AABBBBBAA']]
}

// Mass ingredients around each core: the materials of the tier where it is built.
const POS_CORE_PARTS = {
    1: { A: '#forge:storage_blocks/bronze', B: 'gtceu:ulv_machine_hull', C: '#forge:storage_blocks/steel', D: 'gtceu:vacuum_tube' },
    2: { A: '#forge:storage_blocks/steel', B: 'gtceu:lv_machine_hull', C: 'gtceu:cupronickel_coil_block', D: 'gtceu:lv_robot_arm' },
    3: { A: '#forge:storage_blocks/aluminium', B: 'gtceu:mv_machine_hull', C: 'gtceu:kanthal_coil_block', D: 'gtceu:mv_robot_arm' },
    4: { A: '#forge:storage_blocks/titanium', B: 'gtceu:ev_machine_hull', C: 'gtceu:nichrome_coil_block', D: 'gtceu:ev_robot_arm' },
    5: { A: '#forge:storage_blocks/rhodium_plated_palladium', B: 'gtceu:luv_machine_hull', C: 'gtceu:hssg_coil_block', D: 'gtceu:luv_robot_arm' }
}

// GT voltage per tier index (0 = ULV).
const POS_TIERS = ['ulv', 'lv', 'mv', 'hv', 'ev', 'iv', 'luv', 'zpm', 'uv', 'uhv']
const POS_CABLES = ['lead', 'tin', 'copper', 'gold', 'aluminium', 'platinum', 'niobium_titanium', 'vanadium_gallium', 'yttrium_barium_cuprate', 'europium']

ServerEvents.recipes(event => {
    let VA = GTValues.VA

    // ---- Avaritia tables, one per size step, each from the one before (vanilla's need the Nether and the End).
    let tables = [
        ['avaritia:nether_crafting_table', 'minecraft:crafting_table', 'lv', 'steel'],             // 5x5 for Cores II-III
        ['avaritia:end_crafting_table', 'avaritia:nether_crafting_table', 'ev', 'titanium'],     // 7x7 for Core IV
        ['avaritia:extreme_crafting_table', 'avaritia:end_crafting_table', 'luv', 'rhodium_plated_palladium'] // 9x9 for Core V
    ]
    tables.forEach(t => {
        event.remove({ output: t[0] })
        event.shaped(t[0], [
            'PCP',
            'THT',
            'PCP'
        ], {
            P: `#forge:plates/${t[3]}`,
            C: `#gtceu:circuits/${t[2]}`,
            T: t[1],
            H: `gtceu:${t[2]}_machine_hull`
        }).id(`positronics:gates/${t[0].split(':')[1]}`)
    })

    // ---- Klein Star Ein (ProjectE's recipe needs Mobius Fuel, which needs the removed stone).
    event.remove({ output: 'projecte:klein_star_ein' })
    event.shaped('projecte:klein_star_ein', [
        'GRG',
        'RCR',
        'GRG'
    ], {
        G: '#forge:glass',
        R: '#forge:dusts/redstone',
        C: '#gtceu:circuits/ulv'
    }).id('positronics:gates/klein_star_ein')

    // ---- Antimatter Relay MK1 = the "Beam Capacitor": burns items into a Klein Star.
    event.remove({ output: 'projecte:relay_mk1' })
    event.shaped('projecte:relay_mk1', [
        'PGP',
        'GHG',
        'PCP'
    ], {
        P: '#forge:plates/wrought_iron',
        G: '#forge:glass',
        H: 'gtceu:ulv_machine_hull',
        C: '#gtceu:circuits/ulv'
    }).id('positronics:gates/beam_capacitor')

    // ---- Positronic Cores I-V (grid grows with the tier, see POS_CORE_GRIDS).
    let ing = v => v.startsWith('#') ? { tag: v.substring(1) } : { item: v }
    for (let n = 1; n <= 5; n++) {
        let p = POS_CORE_PARTS[n]
        let grid = POS_CORE_GRIDS[n]
        let all = { A: ing(p.A), B: ing(p.B), C: ing(p.C), D: ing(p.D), S: posFullStar(POS_CORE_STARS[n]) }
        let key = {}  // only the symbols the pattern uses (vanilla rejects unused keys)
        Object.keys(all).forEach(k => { if (grid[1].join('').indexOf(k) >= 0) key[k] = all[k] })
        let recipe = {
            type: grid[0] == 0 ? 'minecraft:crafting_shaped' : 'avaritia:shaped_table',
            category: 'misc',
            pattern: grid[1],
            key: key,
            result: { item: `positronics:positronic_core_${n}` },
            show_notification: true
        }
        if (grid[0] > 0) recipe.tier = grid[0]
        event.custom(recipe).id(`positronics:gates/positronic_core_${n}`)
    }

    // ---- Clearance Card 1 (ULV): hand-crafted around Positronic Core I (the core is kept).
    event.shaped('positronics:clearance_card_1', [
        'PCP',
        'CKC',
        'PCP'
    ], {
        P: 'minecraft:paper',
        C: '#gtceu:circuits/ulv',
        K: 'positronics:positronic_core_1'
    }).keepIngredient('positronics:positronic_core_1').id('positronics:gates/clearance_card_1')

    // ---- Clearance Cards 2-10 (assembler at their own tier). Cores are catalysts.
    // From card 3 on, each card also needs a chemistry sample (Alchemistry/ChemLib layer).
    let cardCores = { 2: 2, 4: 3, 6: 4, 8: 5 }
    let cardChemistry = {
        3: '4x chemlib:silicon_dioxide', 4: '4x chemlib:sodium_hydroxide', 5: '4x chemlib:titanium_oxide',
        6: '4x chemlib:potassium_dichromate', 7: '8x chemlib:iridium', 8: '8x chemlib:europium',
        9: '8x chemlib:americium', 10: '16x chemlib:oganesson'
    }
    for (let n = 2; n <= 10; n++) {
        let t = POS_TIERS[n - 1]
        let inputs = [`4x #gtceu:circuits/${t}`, `gtceu:${t}_machine_hull`, 'positronics:clearance_card_' + (n - 1)]
        if (cardChemistry[n]) inputs.push(cardChemistry[n])
        let r = event.recipes.gtceu.assembler(`positronics:gates/clearance_card_${n}`)
            .itemInputs(inputs)
            .itemOutputs(`positronics:clearance_card_${n}`)
            .duration(400)
            .EUt(VA[n - 1])
        if (cardCores[n]) r = r.notConsumable(`positronics:positronic_core_${cardCores[n]}`)
        if (n == 10) r = r.notConsumable('projectexpansion:final_star')
    }

    // ---- Hull gates: tier N+1 machine hulls need Clearance Card N.
    for (let n = 1; n <= 9; n++) {
        let t = POS_TIERS[n]
        let hull = `gtceu:${t}_machine_hull`
        let casing = `gtceu:${t}_machine_casing`
        let cable = `2x gtceu:${POS_CABLES[n]}_single_cable`
        event.remove({ output: hull })
        event.recipes.gtceu.assembler(`positronics:gates/${t}_hull`)
            .itemInputs(casing, cable)
            .notConsumable(`positronics:clearance_card_${n}`)
            .itemOutputs(hull)
            .duration(50)
            .EUt(VA[n - 1])
    }
    // LV hulls must be hand-craftable (no LV assembler exists before the first LV hull).
    event.shaped('gtceu:lv_machine_hull', [
        ' K ',
        'CMC'
    ], {
        K: 'positronics:clearance_card_1',
        C: 'gtceu:tin_single_cable',
        M: 'gtceu:lv_machine_casing'
    }).keepIngredient('positronics:clearance_card_1').id('positronics:gates/lv_hull_by_hand')

    // ---- USRG tier upgrades: assembled at their tier, with that tier's core as catalyst.
    let usrg = {
        2: { tier: 1, core: 2, parts: ['4x #gtceu:circuits/lv', '2x gtceu:lv_electric_motor', 'gtceu:lv_machine_hull'] },
        3: { tier: 3, core: 3, parts: ['4x #gtceu:circuits/hv', '2x gtceu:hv_electric_motor', 'gtceu:hv_machine_hull', 'usrg:tier_upgrade_2'] },
        4: { tier: 5, core: 4, parts: ['4x #gtceu:circuits/iv', '2x gtceu:iv_electric_motor', 'gtceu:iv_machine_hull', 'usrg:tier_upgrade_3'] },
        5: { tier: 7, core: 5, parts: ['4x #gtceu:circuits/zpm', '2x gtceu:zpm_electric_motor', 'gtceu:zpm_machine_hull', 'usrg:tier_upgrade_4'] }
    }
    Object.keys(usrg).forEach(k => {
        let u = usrg[k]
        event.remove({ output: `usrg:tier_upgrade_${k}` })
        event.recipes.gtceu.assembler(`positronics:gates/usrg_tier_upgrade_${k}`)
            .itemInputs(u.parts)
            .notConsumable(`positronics:positronic_core_${u.core}`)
            .itemOutputs(`usrg:tier_upgrade_${k}`)
            .duration(600)
            .EUt(VA[u.tier])
    })

    // ---- USRG Ore Generator: the first real reclamation unit (Seed I stream).
    // A FULL Klein Star Ein in the centre, not the cobblestone generator: the Mk I from the kit stays
    // running and Ore Generators can be built again and again.
    event.remove({ output: 'usrg:oregenerator' })
    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'misc',
        pattern: ['BIB', 'CSC', 'BIB'],
        key: {
            B: { item: 'minecraft:stone_bricks' },
            I: { tag: 'forge:storage_blocks/iron' },
            C: { tag: 'forge:ingots/steel' },
            S: posFullStar('projecte:klein_star_ein')
        },
        result: { item: 'usrg:oregenerator' }
    }).id('positronics:gates/ore_generator')

    // ---- The other USRG generators (decided 2026-11-21): no water, no lava. Every copy eats a FULL
    // Klein star, the rank by chapter: Ein = River Crossing (ULV), Zwei = the Calla (LV), Drei = Lud (MV).
    // Stone bricks, that rank's metal block, two of the thing it makes, glass. The Mk I (cobblestone)
    // still comes in the kit; these are the copies. Planet generators come with USRG's per-dimension
    // output lists (docs/usrg-dimension-outputs.md), at Vier and up.
    let genRanks = {
        ein: { block: 'forge:storage_blocks/iron', gens: {
            cobblegenerator: { item: 'minecraft:cobblestone' },
            gravelgenerator: { item: 'minecraft:gravel' },
            sandgenerator: { tag: 'forge:sand/colorless' },
            dirtgenerator: { item: 'minecraft:dirt' } } },
        zwei: { block: 'forge:storage_blocks/steel', gens: {
            claygenerator: { item: 'minecraft:clay_ball' },
            grassgenerator: { item: 'minecraft:dirt' },
            fungusgenerator: { tag: 'forge:mushrooms' },
            dyegenerator: { tag: 'forge:dyes' } } },
        drei: { block: 'forge:storage_blocks/aluminium', gens: {
            snowgenerator: { item: 'minecraft:snowball' },
            icegenerator: { item: 'minecraft:snow_block' },
            // No lava, so no obsidian to start one: the star is the heat, the ice is the water.
            obsidiangenerator: { item: 'minecraft:ice' } } }
    }
    Object.keys(genRanks).forEach(rank => {
        let r = genRanks[rank]
        Object.keys(r.gens).forEach(gen => {
            event.remove({ output: `usrg:${gen}` })
            event.custom({
                type: 'minecraft:crafting_shaped',
                category: 'misc',
                pattern: ['STS', 'IKI', 'SGS'],
                key: {
                    S: { item: 'minecraft:stone_bricks' },
                    T: { tag: r.block },
                    I: r.gens[gen],
                    K: posFullStar(`projecte:klein_star_${rank}`),
                    G: { tag: 'forge:glass/colorless' }
                },
                result: { item: `usrg:${gen}` }
            }).id(`positronics:gates/generator_${gen}`)
        })
    })
    // Off-theme or progression-breaking: Redstone skips Rubric, the Nether and End ones belong to
    // worlds this pack doesn't have, Dust needs Ex Nihilo. No recipe at all.
    ;['redstonegenerator', 'quartzgenerator', 'glowstonegenerator', 'nethergenerator', 'soulgenerator',
      'endgenerator', 'endcrushedgenerator', 'nethercrushedgenerator', 'dustgenerator', 'cleangenerator']
        .forEach(g => event.remove({ output: `usrg:${g}` }))

    // ---- The Final Star (endgame): replaces ProjectExpansion's power-flower recipe.
    event.remove({ output: 'projectexpansion:final_star' })
    event.custom({
        type: 'avaritia:shaped_table',
        category: 'misc',
        tier: 4,
        pattern: [
            'NNNNNNNNN',
            'NUUUUUUUN',
            'NUFFFFFUN',
            'NUFGGGFUN',
            'NUFGSGFUN',
            'NUFGGGFUN',
            'NUFFFFFUN',
            'NUUUUUUUN',
            'NNNNNNNNN'
        ],
        key: {
            N: { tag: 'forge:storage_blocks/neutronium' },
            U: { item: 'gtceu:uhv_machine_hull' },
            F: { item: 'gtceu:uv_field_generator' },
            G: { item: 'positronics:positronic_core_5' },
            S: posFullStar('projectexpansion:gargantuan_star_omega')
        },
        result: { item: 'projectexpansion:final_star' },
        show_notification: true
    }).id('positronics:gates/final_star')
})
