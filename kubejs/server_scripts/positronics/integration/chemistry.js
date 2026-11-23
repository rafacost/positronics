// Positronics: chemistry that shines (Alchemistry + ChemLib + GregTech), decided 2026-11-20.
//
// Chemistry is its OWN layer and currency: elements and compounds (ChemLib) come from the
// Dissolver (metals and chemistry only, see the guard rail below), the Atomic Reclaimer, element bees,
// Fusion and Fission. They can be plentiful because they can
// never skip GregTech or the planets:
//   1. ChemLib's metal forms (ingots, dusts, nuggets, plates, blocks) lose their shared forge tags,
//      so a ChemLib titanium ingot is NOT a GT titanium ingot.
//   2. The Combiner and Compactor only make ChemLib items (their recipes for vanilla/GT items go).
//   3. Positronic Memory (EMC) learns ELEMENTS ONLY (projecte/emc.js): dissolve your production into
//      elements to store it; transmute elements and compress 16 of them into one GregTech dust to get it back.
//      The element -> dust compressor runs one tier AFTER the material is first needed, so the planets
//      and machines still have to be done once by hand (titanium: EV compressor, after Mars).
// Chemistry FEEDS GregTech on purpose:
//   - Clearance Cards 3-10 each need a compound or element sample (gates.js).
//   - Acids, ammonia and organics extract into GT fluids.
//   - The Periodic Table chapter rewards element samples; main quests hand out lab samples.
// Alchemistry machines are GT-tiered: Dissolver/Compactor LV, Combiner/Atomizer/Liquifier MV,
// Fission/Fusion LuV.

ServerEvents.tags('item', event => {
    let cut = 0
    Ingredient.of('@chemlib').itemIds.forEach(id => {
        if (/_(ingot|dust|nugget|plate|block|metal_block)$/.test(String(id))) {
            event.removeAllTagsFrom(id)
            cut++
        }
    })
    console.info(`[Positronics] Chemistry: removed shared material tags from ${cut} ChemLib metal items.`)
})

ServerEvents.recipes(event => {
    // ---- Guard rails: Combiner and Compactor only produce ChemLib items.
    let drop = []
    ;['alchemistry:combiner', 'alchemistry:compactor'].forEach(type => {
        event.forEachRecipe({ type: type }, r => {
            let out = null
            try { out = String(r.json.get('result').getAsJsonObject().get('item').getAsString()) } catch (e) { return }
            if (!out.startsWith('chemlib:')) drop.push(String(r.getId()))
        })
    })
    drop.forEach(id => event.remove({ id: id }))
    console.info(`[Positronics] Chemistry: removed ${drop.length} combiner/compactor recipes that made non-chemistry items.`)

    // ---- Guard rail (decided 2026-11-23, EMC audit): the Dissolver stores production, it doesn't mint atoms.
    // It keeps (a) ChemLib items (compounds split into exactly their atoms) and (b) metal forms at
    // 16 elements per ingot (ingots, dusts, plates, nuggets, blocks; alloys give less than they cost).
    // Everything else goes: Alchemistry's defaults paid 248 EMC per stone (tungsten/dysprosium traces),
    // 360 per sugar cane, 73,856 per ender pearl, an endless EMC and power loop from LV. New atoms come
    // from the Atomic Reclaimer, Electrolyzer and Centrifuge (emc_sources.js), where the pack sets the rate.
    // Quartz blocks (64 barium) and netherite dust (64 tungsten) are metal-form tags that still minted EMC.
    let dissolverCut = []
    let dissolverKept = 0
    event.forEachRecipe({ type: 'alchemistry:dissolver' }, r => {
        let ing = null
        try { ing = r.json.get('input').getAsJsonObject().get('ingredient').getAsJsonObject() } catch (e) { return }
        let item = ing.has('item') ? String(ing.get('item').getAsString()) : ''
        let tag = ing.has('tag') ? String(ing.get('tag').getAsString()) : ''
        let m = /^forge:(ingots|dusts|plates|nuggets|storage_blocks)\/(\w+)$/.exec(tag)
        let keep = item.startsWith('chemlib:') || (m != null && m[2] != 'quartz' && m[2] != 'netherite')
        if (keep) dissolverKept++
        else dissolverCut.push(String(r.getId()))
    })
    dissolverCut.forEach(id => event.remove({ id: id }))
    console.info(`[Positronics] Chemistry: Dissolver keeps ${dissolverKept} recipes (chemistry + metal forms), removed ${dissolverCut.length}.`)

    // ---- Alchemistry machines with GregTech parts, tiered.
    let machine = (out, tier, extra, key) => {
        event.remove({ output: out })
        event.shaped(out, [
            'PXP',
            'CHC',
            'PXP'
        ], {
            P: `#forge:plates/${tier[1]}`,
            X: extra,
            C: `#gtceu:circuits/${tier[0]}`,
            H: `gtceu:${tier[0]}_machine_hull`
        }).id(`positronics:chemistry/${key}`)
    }
    machine('alchemistry:dissolver', ['lv', 'steel'], 'gtceu:lv_electric_motor', 'dissolver')
    machine('alchemistry:compactor', ['lv', 'steel'], 'gtceu:lv_electric_piston', 'compactor')
    machine('alchemistry:combiner', ['mv', 'aluminium'], 'gtceu:mv_robot_arm', 'combiner')
    machine('alchemistry:atomizer', ['mv', 'aluminium'], 'gtceu:mv_electric_pump', 'atomizer')
    machine('alchemistry:liquifier', ['mv', 'aluminium'], 'gtceu:mv_electric_pump', 'liquifier')
    machine('alchemistry:fission_chamber_controller', ['luv', 'rhodium_plated_palladium'], 'gtceu:luv_field_generator', 'fission_controller')
    machine('alchemistry:fusion_chamber_controller', ['luv', 'rhodium_plated_palladium'], 'gtceu:luv_field_generator', 'fusion_controller')

    // ---- Bridges: chemistry -> GregTech fluids (one direction).
    let bridge = (chem, fluid, mb) => event.recipes.gtceu.extractor(`positronics:chemistry/${chem}_to_${fluid.split(':')[1]}`)
        .itemInputs(`chemlib:${chem}`)
        .outputFluids(`${fluid} ${mb}`)
        .duration(40)
        .EUt(GTValues.VA[GTValues.LV])
    bridge('sulfuric_acid', 'gtceu:sulfuric_acid', 250)
    bridge('hydrochloric_acid', 'gtceu:hydrochloric_acid', 250)
    bridge('nitric_acid', 'gtceu:nitric_acid', 250)
    bridge('ammonia', 'gtceu:ammonia', 250)
    bridge('methane', 'gtceu:methane', 250)
    bridge('ethanol', 'gtceu:ethanol', 250)

    // ---- Compounds by hand (decided 2026-11-20): every ChemLib compound whose atoms fit a 3x3 grid is a
    // shapeless craft from exactly those atoms (formulas: tools/make_compounds.py). Same EMC both ways,
    // so it is freedom, not profit. Bigger molecules stay with the Alchemistry Combiner.
    let compounds = global.POSITRONICS_COMPOUNDS || {}
    let byFormula = {}
    let handMade = 0
    Object.keys(compounds).sort().forEach(name => {
        let atoms = compounds[name]
        let els = Object.keys(atoms).sort()
        let total = 0
        els.forEach(el => { total += atoms[el] })
        if (total < 2 || total > 9) return
        if (!Item.exists(`chemlib:${name}`) || els.some(el => !Item.exists(`chemlib:${el}`))) return
        let formula = els.map(el => `${el}${atoms[el]}`).join(' ')
        if (byFormula[formula]) return   // isomers share a formula: the first name keeps the hand recipe
        byFormula[formula] = name
        event.shapeless(`chemlib:${name}`, els.map(el => `${atoms[el]}x chemlib:${el}`))
            .id(`positronics:chemistry/compound/${name}`)
        handMade++
    })
    console.info(`[Positronics] ${handMade} compounds craftable by hand from their atoms`)

    // ---- Isoprene, atom for atom: C5H8 is 13 atoms, too many for 9 slots, so it goes through methane
    // (CH4, one of the hand compounds above): 2 CH4 + 3 C = C5H8, natural rubber's monomer.
    // Breaks the rubber loop (no resin without rubber trees, no saplings without resin) with elements only.
    event.shapeless('2x gtceu:sticky_resin', ['2x chemlib:methane', '3x chemlib:carbon'])
        .id('positronics:chemistry/isoprene_resin')

    // ---- Bridge: element -> GregTech dust (16:1, matching the Dissolver's 16 elements per ingot, so no loop).
    let known = {}
    Ingredient.all.itemIds.forEach(id => { known[String(id)] = true })
    let gtName = { aluminum: 'aluminium', cesium: 'caesium' }
    let tierVoltage = { 1: GTValues.LV, 2: GTValues.MV, 3: GTValues.EV, 4: GTValues.IV, 5: GTValues.LuV }
    let tiers = global.POSITRONICS_ELEMENT_TIERS || {}
    let made = 0
    Object.keys(tiers).forEach(el => {
        let dust = `gtceu:${gtName[el] || el}_dust`
        if (!known[dust] || !known[`chemlib:${el}`]) return
        event.recipes.gtceu.compressor(`positronics:chemistry/element_to_dust/${el}`)
            .itemInputs(`16x chemlib:${el}`)
            .itemOutputs(dust)
            .duration(100)
            .EUt(GTValues.VA[tierVoltage[tiers[el]]])
        made++
    })
    console.info(`[Positronics] Chemistry: ${made} element -> GregTech dust compressor recipes.`)
})
