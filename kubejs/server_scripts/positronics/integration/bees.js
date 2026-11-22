// Positronics: Productive Bees (revised 2026-11-22). Bees make honey (the Array/Paddy booster),
// atoms (Reclaimer) and worker-bee utility. They are never a metal or ore source: every resource
// comb (metals, gems, alloys, GregTech materials) centrifuges into wax and honey only, in a GregTech
// centrifuge. Those bees all trace back to a Crystalline bee, which nests only in the Nether, and the
// pack treats the Nether and the End as out of scope.
// Element (chemlib) bees are left alone here: they belong to the chemistry layer.

// Recipe folders (and single ids) that hold resource combs.
const POS_BEE_RESOURCE_FOLDERS = ['/raw_materials/', '/gems/', '/gtceu/', '/alloys/', '/dusts/', '/ad_astra/',
    '/ae2/', '/powah/', '/immersiveengineering/', '/mekanism/', '/thermal/', 'honeycomb_fossilised']

ServerEvents.recipes(event => {
    let replace = []
    event.forEachRecipe({ type: 'productivebees:centrifuge' }, r => {
        let id = String(r.getId())
        if (!POS_BEE_RESOURCE_FOLDERS.some(f => id.indexOf(f) >= 0)) return
        let beeType = null
        try {
            beeType = String(r.json.get('ingredient').getAsJsonObject().get('nbt').getAsJsonObject()
                .get('EntityTag').getAsJsonObject().get('type').getAsString())
        } catch (e) { return }
        replace.push([id, beeType])
    })

    let added = {}
    replace.forEach(x => {
        let id = x[0], beeType = x[1]
        event.remove({ id: id })
        if (added[beeType]) return
        added[beeType] = true
        let comb = Item.of('productivebees:configurable_honeycomb', `{EntityTag:{type:"${beeType}"}}`).strongNBT()
        event.recipes.gtceu.centrifuge(`positronics:bees/${beeType.split(':')[1]}_comb`)
            .itemInputs(comb)
            .itemOutputs('productivebees:wax')
            .outputFluids('productivebees:honey 50')
            .duration(200)
            .EUt(GTValues.VA[GTValues.LV])
    })
    console.info(`[Positronics] Bees: ${replace.length} resource combs now give only wax and honey (GT centrifuge).`)
})
