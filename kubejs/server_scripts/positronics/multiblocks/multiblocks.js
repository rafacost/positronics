// Positronics: recipes for the signature multiblocks (see startup multiblocks.js).

// Every Pam's HarvestCraft 2 crop with a seed item and a crop item (checked against the registry).
const POS_PADDY_CROPS = ["agave", "alfalfa", "aloe", "amaranth", "arrowroot", "artichoke", "asparagus", "barley", "barrelcactus", "bean", "bellpepper", "blackberry", "blueberry", "bokchoy", "broccoli", "brusselsprout", "cabbage", "cactusfruit", "calabash", "candleberry", "canola", "cantaloupe", "cassava", "cattail", "cauliflower", "celery", "chia", "chickpea", "chilipepper", "cloudberry", "coffeebean", "corn", "cotton", "cranberry", "cucumber", "eggplant", "elderberry", "flax", "garlic", "ginger", "grape", "greengrape", "guarana", "huckleberry", "jicama", "juniperberry", "jute", "kale", "kenaf", "kiwi", "kohlrabi", "leek", "lentil", "lettuce", "lotus", "millet", "mulberry", "mustardseeds", "nettles", "nopales", "oats", "okra", "onion", "papyrus", "parsnip", "peanut", "peas", "pineapple", "quinoa", "radish", "raspberry", "rhubarb", "rice", "rutabaga", "rye", "scallion", "sesameseeds", "sisal", "sorghum", "soybean", "spiceleaf", "spinach", "strawberry", "sunchoke", "sweetpotato", "taro", "tealeaf", "tomatillo", "tomato", "truffle", "turnip", "waterchestnut", "whitemushroom", "wintersquash", "wolfberry", "yucca", "zucchini"]

ServerEvents.recipes(event => {
    // Multiblock controllers.
    event.shaped('gtceu:reclamation_sifter_array', [
        'SCS',
        'XHX',
        'SCS'
    ], {
        S: 'gtceu:ulv_reclamation_sifter',
        C: '#gtceu:circuits/ulv',
        X: '#forge:plates/steel',
        H: 'gtceu:ulv_machine_hull'
    }).id('positronics:multiblocks/reclamation_sifter_array')

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
