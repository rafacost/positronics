// Positronics: recipes for the signature multiblocks (see startup multiblocks.js).

// Every Pam's HarvestCraft 2 crop with a seed item and a crop item (checked against the registry).
const POS_PADDY_CROPS = ["agave", "alfalfa", "aloe", "amaranth", "arrowroot", "artichoke", "asparagus", "barley", "barrelcactus", "bean", "bellpepper", "blackberry", "blueberry", "bokchoy", "broccoli", "brusselsprout", "cabbage", "cactusfruit", "calabash", "candleberry", "canola", "cantaloupe", "cassava", "cattail", "cauliflower", "celery", "chia", "chickpea", "chilipepper", "cloudberry", "coffeebean", "corn", "cotton", "cranberry", "cucumber", "eggplant", "elderberry", "flax", "garlic", "ginger", "grape", "greengrape", "guarana", "huckleberry", "jicama", "juniperberry", "jute", "kale", "kenaf", "kiwi", "kohlrabi", "leek", "lentil", "lettuce", "lotus", "millet", "mulberry", "mustardseeds", "nettles", "nopales", "oats", "okra", "onion", "papyrus", "parsnip", "peanut", "peas", "pineapple", "quinoa", "radish", "raspberry", "rhubarb", "rice", "rutabaga", "rye", "scallion", "sesameseeds", "sisal", "sorghum", "soybean", "spiceleaf", "spinach", "strawberry", "sunchoke", "sweetpotato", "taro", "tealeaf", "tomatillo", "tomato", "truffle", "turnip", "waterchestnut", "whitemushroom", "wintersquash", "wolfberry", "yucca", "zucchini"]

ServerEvents.recipes(event => {
    // Multiblock controllers. The Array eats four Sifters and a FULL Klein Star Ein: one big buy.
    event.custom({
        type: 'minecraft:crafting_shaped',
        category: 'misc',
        pattern: ['SCS', 'XKX', 'SHS'],
        key: {
            S: { item: 'gtceu:ulv_reclamation_sifter' },
            C: { tag: 'gtceu:circuits/ulv' },
            X: { tag: 'forge:plates/steel' },
            K: global.posFullStar('projecte:klein_star_ein'),
            H: { item: 'gtceu:ulv_machine_hull' }
        },
        result: { item: 'gtceu:reclamation_sifter_array' }
    }).id('positronics:multiblocks/reclamation_sifter_array')

    // Deep sifting (the Array only): one gravel -> Y Seed I strata in the Ore Generator's own mix
    // (config/usrg-common.toml oreGeneratorItemsT1). Y = 4 / 16 / 64 at ULV / LV / MV (circuit 1 / 2 / 3);
    // honey doubles it (circuit 11 / 12 / 13, 50 mB a run). Circuits keep plain and honeyed runs apart.
    // The throttle is downstream: Reclaimers and Crushers to eat it, gravel and honey to feed it.
    let mix = [['ferrous', 0.40], ['cupric', 0.30], ['stannic', 0.22], ['carbonic', 0.25],
               ['plumbic', 0.10], ['nickelous', 0.08], ['rubric', 0.12]]
    let total = mix.reduce((a, m) => a + m[1], 0)
    let sift = (id, circuit, eut, perGravel, honey) => {
        let r = event.recipes.gtceu.reclamation_sifting(`positronics:multiblocks/deep_sift_${id}`)
            .itemInputs('minecraft:gravel')
            .circuit(circuit)
        if (honey) r = r.inputFluids('productivebees:honey 50')
        let fixed = [], chanced = []
        mix.forEach(m => {
            let n = perGravel * m[1] / total
            let whole = Math.floor(n), frac = Math.round((n - whole) * 10000)
            if (whole > 0) fixed.push(`${whole}x positronics:${m[0]}_stratum`)
            if (frac > 0) chanced.push([`positronics:${m[0]}_stratum`, frac])
        })
        if (fixed.length) r = r.itemOutputs(fixed)
        chanced.forEach(c => { r = r.chancedOutput(c[0], c[1], 0) })
        r.duration(40).EUt(eut)
    }
    ;[['ulv', 1, 7, 4], ['lv', 2, 30, 16], ['mv', 3, 120, 64]].forEach(t => {
        sift(t[0], t[1], t[2], t[3], false)
        sift(`${t[0]}_honey`, t[1] + 10, t[2], t[3] * 2, true)
    })

    // Dust sifting (the Array only): rock dust (positronics:dust, from hammered sand and strata
    // processing) -> the early gems other mods need: quartz (comparators, Tom's, AE2), lapis, certus
    // and sky dust (AE2, MEGA cells), rough diamonds. Same circuits, same honey (x2) as deep sifting.
    // Values = expected items per dust; whole counts are fixed, the remainder is a chance.
    let dustYield = {
        ulv: { 'minecraft:quartz': 0.30, 'ae2:certus_quartz_dust': 0.20, 'minecraft:lapis_lazuli': 0.15, 'positronics:rough_diamond': 0.02 },
        lv: { 'minecraft:quartz': 0.50, 'ae2:certus_quartz_dust': 0.40, 'minecraft:lapis_lazuli': 0.30, 'ae2:sky_dust': 0.10, 'positronics:rough_diamond': 0.05 },
        mv: { 'minecraft:quartz': 1.00, 'ae2:certus_quartz_dust': 0.80, 'minecraft:lapis_lazuli': 0.60, 'ae2:sky_dust': 0.25, 'positronics:rough_diamond': 0.10 }
    }
    let dustSift = (tier, circuit, eut, factor, honey) => {
        let r = event.recipes.gtceu.reclamation_sifting(`positronics:multiblocks/dust_sift_${tier}${honey ? '_honey' : ''}`)
            .itemInputs('positronics:dust')
            .circuit(circuit)
        if (honey) r = r.inputFluids('productivebees:honey 50')
        let fixed = [], chanced = []
        Object.keys(dustYield[tier]).forEach(item => {
            let n = dustYield[tier][item] * factor
            let whole = Math.floor(n), frac = Math.round((n - whole) * 10000)
            if (whole > 0) fixed.push(`${whole}x ${item}`)
            if (frac > 0) chanced.push([item, frac])
        })
        if (fixed.length) r = r.itemOutputs(fixed)
        chanced.forEach(c => { r = r.chancedOutput(c[0], c[1], 0) })
        r.duration(40).EUt(eut)
    }
    ;[['ulv', 1, 7], ['lv', 2, 30], ['mv', 3, 120]].forEach(t => {
        dustSift(t[0], t[1], t[2], 1, false)
        dustSift(t[0], t[1] + 10, t[2], 2, true)
    })

    // Two rough diamonds and a hammer: one diamond (the hammer takes the damage).
    event.shapeless('minecraft:diamond', ['2x positronics:rough_diamond', '#gtceu:tools/crafting_hammers'])
        .id('positronics:multiblocks/rough_diamond_to_diamond')

    event.shaped('gtceu:calla_paddy', [
        'PCP',
        'MHM',
        'PCP'
    ], {
        P: 'botanypots:terracotta_botany_pot',
        C: '#gtceu:circuits/lv',
        M: 'gtceu:lv_electric_pump',
        H: 'gtceu:lv_machine_hull'
    }).id('positronics:multiblocks/calla_paddy')

    // Calla Paddy: a seed (never consumed) + water -> a harvest. Fertilizer doubles it.
    POS_PADDY_CROPS.forEach(c => {
        event.recipes.gtceu.calla_paddy(`positronics:paddy/${c}`)
            .notConsumable(`pamhc2crops:${c}seeditem`)
            .inputFluids('minecraft:water 500')
            .itemOutputs(`4x pamhc2crops:${c}item`)
            .duration(600)
            .EUt(16)
        // Honey booster (bee path): honey alongside the water gives the biggest harvest.
        event.recipes.gtceu.calla_paddy(`positronics:paddy/${c}_honeyed`)
            .notConsumable(`pamhc2crops:${c}seeditem`)
            .inputFluids('minecraft:water 500', 'productivebees:honey 250')
            .itemOutputs(`12x pamhc2crops:${c}item`)
            .duration(600)
            .EUt(16)
        event.recipes.gtceu.calla_paddy(`positronics:paddy/${c}_fertilized`)
            .notConsumable(`pamhc2crops:${c}seeditem`)
            .itemInputs('gtceu:fertilizer')
            .inputFluids('minecraft:water 500')
            .itemOutputs(`8x pamhc2crops:${c}item`)
            .duration(600)
            .EUt(16)
    })
})
