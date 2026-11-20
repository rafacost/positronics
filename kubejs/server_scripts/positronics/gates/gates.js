// Positronics: tier gates.
//  1. Positronic Cores I-V: Extreme Crafting (9x9) with a FULLY charged star in the centre.
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

// Which star each Positronic Core needs (tunable; see docs/seed-chains-draft.md).
// Each Core is built ONE tier before its strata are needed (Seed III chrome is needed for HV
// stainless steel, Seed IV tungsten for IV, Seed V naquadah for ZPM).
const POS_CORE_STARS = {
    1: 'projecte:klein_star_vier',            // built at ULV (River Crossing)
    2: 'projecte:klein_star_omega',           // built at LV  (The Calla)
    3: 'projectexpansion:magnum_star_zwei',   // built at MV  (Lud)
    4: 'projectexpansion:magnum_star_omega',  // built at EV  (The Dogan)
    5: 'projectexpansion:colossal_star_vier'  // built at LuV (End-World I)
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

    // ---- Extreme Crafting Table: available at ULV (it's how Positronic Cores are assembled).
    event.remove({ output: 'avaritia:extreme_crafting_table' })
    event.shaped('avaritia:extreme_crafting_table', [
        'PCP',
        'THT',
        'PCP'
    ], {
        P: '#forge:plates/wrought_iron',
        C: '#gtceu:circuits/ulv',
        T: 'minecraft:crafting_table',
        H: 'gtceu:ulv_machine_hull'
    }).id('positronics:gates/extreme_crafting_table')

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

    // ---- Positronic Cores I-V (Extreme Crafting, 9x9, table tier 4).
    for (let n = 1; n <= 5; n++) {
        let p = POS_CORE_PARTS[n]
        event.custom({
            type: 'avaritia:shaped_table',
            category: 'misc',
            tier: 4,
            pattern: [
                'AABBBBBAA',
                'ACCDDDCCA',
                'BCDDDDDCB',
                'BDDCCCDDB',
                'BDDCSCDDB',
                'BDDCCCDDB',
                'BCDDDDDCB',
                'ACCDDDCCA',
                'AABBBBBAA'
            ],
            key: {
                A: p.A.startsWith('#') ? { tag: p.A.substring(1) } : { item: p.A },
                B: { item: p.B },
                C: p.C.startsWith('#') ? { tag: p.C.substring(1) } : { item: p.C },
                D: { item: p.D },
                S: posFullStar(POS_CORE_STARS[n])
            },
            result: { item: `positronics:positronic_core_${n}` },
            show_notification: true
        }).id(`positronics:gates/positronic_core_${n}`)
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
    let cardCores = { 2: 2, 4: 3, 6: 4, 8: 5 }
    for (let n = 2; n <= 10; n++) {
        let t = POS_TIERS[n - 1]
        let r = event.recipes.gtceu.assembler(`positronics:gates/clearance_card_${n}`)
            .itemInputs(`4x #gtceu:circuits/${t}`, `gtceu:${t}_machine_hull`, 'positronics:clearance_card_' + (n - 1))
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
    event.remove({ output: 'usrg:oregenerator' })
    event.shaped('usrg:oregenerator', [
        'BIB',
        'CGC',
        'BIB'
    ], {
        B: 'minecraft:stone_bricks',
        I: '#forge:storage_blocks/iron',
        C: '#forge:ingots/copper',
        G: 'usrg:cobblegenerator'
    }).id('positronics:gates/ore_generator')

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
