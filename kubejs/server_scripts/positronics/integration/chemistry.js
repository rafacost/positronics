// Positronics: chemistry that shines (Alchemistry + ChemLib + GregTech), decided 2026-11-20.
//
// Chemistry is its OWN layer and currency: elements and compounds (ChemLib) come from the
// Dissolver (anything solid), element bees, Fusion and Fission. They can be plentiful because they can
// never skip GregTech or the planets:
//   1. ChemLib's metal forms (ingots, dusts, nuggets, plates, blocks) lose their shared forge tags,
//      so a ChemLib titanium ingot is NOT a GT titanium ingot.
//   2. The Combiner and Compactor only make ChemLib items (their recipes for vanilla/GT items go).
//   3. Elements and compounds have no EMC (Positronic Memory starts empty).
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
})
