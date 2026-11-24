// Positronics: milk without cows. There are no mobs, so Pam's Fresh Milk (renamed "Soy Milk" in
// kubejs/assets/pamhc2foodcore/lang) is pressed from soybeans, almonds or coconuts. Fresh Milk carries
// forge:milk, so it feeds every Pam's dairy recipe (butter, cheese, cream, yogurt, ice cream, ...).
// Plant milk is not an element, so it has no EMC.

ServerEvents.tags('item', event => {
    event.add('positronics:milk_base', ['pamhc2crops:soybeanitem', 'pamhc2trees:almonditem', 'pamhc2trees:coconutitem'])
})

ServerEvents.recipes(event => {
    // By hand: two beans and a bottle of clean water make two milk; the bottle comes back.
    event.shapeless('2x pamhc2foodcore:freshmilkitem', [
        '2x #positronics:milk_base', 'toughasnails:purified_water_bottle'
    ]).replaceIngredient('toughasnails:purified_water_bottle', 'minecraft:glass_bottle').id('positronics:food/soy_milk')

    // LV Mixer: the bulk route, twice the milk per bean.
    event.recipes.gtceu.mixer('positronics:food/soy_milk_mixer')
        .itemInputs('2x #positronics:milk_base')
        .inputFluids('minecraft:water 250')
        .itemOutputs('4x pamhc2foodcore:freshmilkitem')
        .duration(100)
        .EUt(16)

    // A milk bucket, for cake and anything else that wants the vanilla bucket (drinking it clears effects).
    event.recipes.gtceu.mixer('positronics:food/soy_milk_bucket')
        .itemInputs('minecraft:bucket', '4x #positronics:milk_base')
        .inputFluids('minecraft:water 1000')
        .itemOutputs('minecraft:milk_bucket')
        .duration(200)
        .EUt(16)
})
