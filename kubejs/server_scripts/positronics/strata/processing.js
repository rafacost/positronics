// Positronics: Strata processing lines (data-driven, see tools/data/strata.json).
//  - Macerator: stratum -> main dust + chanced byproducts (more output slots on better machines).
//  - Furnace (Seed I only): stratum -> nuggets (slow start before machines).
//  - Enrichment (Seed II-V) in a Mixer: 4 strata of the tier below + solvent, with that tier's
//    Positronic Core as a never-consumed catalyst -> 1 chosen stratum of the new tier.
//  - Sifter (the Waste Lands trickle, automated): gravel -> sand + Seed I strata;
//    sand -> dust + the rarer Seed I strata (lead, nickel).

ServerEvents.recipes(event => {
    let tiers = global.POSITRONICS_STRATA

    tiers.forEach(tier => {
        tier.strata.forEach(s => {
            let r = event.recipes.gtceu.macerator(`positronics:strata/${s.key}_maceration`)
                .itemInputs(s.id)
                .itemOutputs(s.main)
                .duration(100 + 40 * tier.tier)
                .EUt(tier.eut)
            s.by.forEach(b => { r = r.chancedOutput(b[0], Math.round(b[1] * 10000), 0) })

            // 3 nuggets = a third of an ingot: a third of the cooking time (and fuel). See survival/smelt_times.js.
            if (s.nugget) event.smelting(`3x ${s.nugget}`, s.id).xp(0.1).cookingTime(67).id(`positronics:strata/${s.key}_smelt_nuggets`)
            else if (s.smelt) event.smelting(s.smelt, s.id).xp(0.1).id(`positronics:strata/${s.key}_smelt`)
        })
    })

    // Enrichment: each new-tier stratum has one source stratum from the tier below (cycled).
    let solvent = { 2: 'gtceu:sulfuric_acid 250', 3: 'gtceu:hydrochloric_acid 250', 4: 'gtceu:hydrofluoric_acid 250', 5: 'gtceu:aqua_regia 250' }
    tiers.forEach((tier, idx) => {
        if (tier.tier < 2) return
        let below = tiers[idx - 1].strata
        tier.strata.forEach((s, i) => {
            let source = below[i % below.length]
            event.recipes.gtceu.mixer(`positronics:strata/enrich_${s.key}`)
                .itemInputs(`4x ${source.id}`)
                .inputFluids(solvent[tier.tier])
                .notConsumable(`positronics:positronic_core_${tier.tier}`)
                .circuit(Math.floor(i / below.length) + 1)
                .itemOutputs(s.id)
                .duration(300)
                .EUt(tier.eut)
        })
    })

    // The trickle, automated in a sifter (ULV Reclamation Sifter or any GT sifter).
    let trickle = {}
    global.POSITRONICS_TRICKLE.forEach(t => { trickle[t[0]] = t[1] })
    event.remove({ type: 'gtceu:sifter', input: 'minecraft:gravel' })
    let gravel = event.recipes.gtceu.sifter('positronics:strata/sift_gravel')
        .itemInputs('minecraft:gravel')
        .itemOutputs('minecraft:sand')
        .duration(100)
        .EUt(7)
    ;['ferrous', 'cupric', 'stannic', 'carbonic', 'rubric'].forEach(k => {
        let id = `positronics:${k}_stratum`
        gravel = gravel.chancedOutput(id, Math.round(trickle[id] * 10000), 0)
    })
    let sand = event.recipes.gtceu.sifter('positronics:strata/sift_sand')
        .itemInputs('minecraft:sand')
        .itemOutputs('positronics:dust')
        .duration(100)
        .EUt(7)
    ;['plumbic', 'nickelous'].forEach(k => {
        let id = `positronics:${k}_stratum`
        sand = sand.chancedOutput(id, Math.round(trickle[id] * 10000), 0)
    })
})
