// Positronics: Productive Bees, rewarded but inside the system (decided 2026-11-20).
// Resource bees stay. Their combs no longer give raw metals or gems: a GregTech centrifuge turns
// each comb into the matching STRATUM (plus wax and honey), at that stratum's tier voltage.
// A bee player gets a strong alternative strata stream; the processing lines stay meaningful.
// Resource combs without a matching stratum give only wax and honey.
// Element (chemlib) bees are left alone here: they belong to the chemistry layer.

// bee name (without namespace) -> stratum key (see tools/data/strata.json)
const POS_BEE_STRATA = {
    iron: 'ferrous', steel: 'ferrous', invar: 'ferrous',
    copper: 'cupric', bronze: 'cupric', brass: 'cupric',
    tin: 'stannic', zinc: 'stannic',
    lead: 'plumbic', silver: 'plumbic', galena: 'plumbic',
    nickel: 'nickelous', constantan: 'nickelous', cobaltite: 'nickelous',
    coal: 'carbonic', graphite: 'carbonic',
    redstone: 'rubric', electrotine: 'rubric',
    gold: 'precious', electrum: 'precious',
    aluminum: 'bauxitic', bauxite: 'bauxitic',
    crystalline: 'crystalline', quartz: 'crystalline', fluix: 'crystalline',
    sulfur: 'sulfuric', realgar: 'sulfuric', pyrolusite: 'sulfuric',
    salty: 'saline', niter: 'saline', barite: 'saline',
    stibnite: 'antimonial', tetrahedrite: 'antimonial',
    lepidolite: 'lithic',
    diamond: 'lustrous', emerald: 'lustrous', ruby: 'lustrous', sapphire: 'lustrous', green_sapphire: 'lustrous', topaz: 'lustrous',
    titanium: 'titanic', ilmenite: 'titanic',
    chromite: 'chromic',
    vanadium_magnetite: 'vanadic',
    oilsands: 'bituminous',
    radioactive: 'uranic',
    tungsten: 'tungstic', scheelite: 'tungstic', tungstate: 'tungstic',
    molybdenum: 'molybdic',
    platinum: 'platinic', palladium: 'platinic', sheldonite: 'platinic',
    neodymium: 'lanthanic', bastnasite: 'lanthanic',
    pyrochlore: 'niobic', tantalite: 'niobic',
    sphalerite: 'indic',
    osmium: 'osmic', iridium: 'osmic',
    naquadah: 'naquadic',
    neutronium: 'neutronic'
}
// Recipe folders that hold resource combs (anything here without a stratum gives wax only).
const POS_BEE_RESOURCE_FOLDERS = ['/raw_materials/', '/gems/', '/gtceu/', '/alloys/', '/dusts/', '/ad_astra/']

ServerEvents.recipes(event => {
    // stratum key -> [item id, EU/t]
    let strata = {}
    global.POSITRONICS_STRATA.forEach(t => t.strata.forEach(s => { strata[s.key] = [s.id, t.eut] }))

    let replace = []
    event.forEachRecipe({ type: 'productivebees:centrifuge' }, r => {
        let id = String(r.getId())
        let beeType = null
        try {
            beeType = String(r.json.get('ingredient').getAsJsonObject().get('nbt').getAsJsonObject()
                .get('EntityTag').getAsJsonObject().get('type').getAsString())
        } catch (e) { return }
        let name = beeType.split(':')[1]
        let stratum = POS_BEE_STRATA[name]
        let isResource = POS_BEE_RESOURCE_FOLDERS.some(f => id.indexOf(f) >= 0)
        if (stratum || isResource) replace.push([id, beeType, name, stratum])
    })

    let added = {}
    replace.forEach(x => {
        let id = x[0], beeType = x[1], name = x[2], stratum = x[3]
        event.remove({ id: id })
        if (added[beeType]) return
        added[beeType] = true
        let comb = Item.of('productivebees:configurable_honeycomb', `{EntityTag:{type:"${beeType}"}}`).strongNBT()
        let r = event.recipes.gtceu.centrifuge(`positronics:bees/${name}_comb`)
            .itemInputs(comb)
            .itemOutputs('productivebees:wax')
            .outputFluids('productivebees:honey 50')
            .duration(200)
        if (stratum && strata[stratum]) {
            r.chancedOutput(strata[stratum][0], 10000, 0)
                .chancedOutput(strata[stratum][0], 2500, 0)
                .EUt(strata[stratum][1])
        } else {
            r.EUt(GTValues.VA[GTValues.LV])
        }
    })
    console.info(`[Positronics] Bees: ${replace.length} resource combs now centrifuge into strata (GT centrifuge only).`)
})
