// Positronics: a furnace burns fuel per tick, so cooking time is the fuel bill. Smelting a nugget took as long
// as an ingot (200 ticks). Every furnace recipe that makes nuggets now takes 200 x (nuggets / 9) ticks,
// at least 20: a nugget costs a ninth of an ingot, a stratum (3 nuggets) a third.
// (Our own strata recipes set the same time in strata/processing.js.)

ServerEvents.recipes(event => {
    event.forEachRecipe({ type: 'minecraft:smelting' }, r => {
        let json = r.json
        let res = json.get('result')
        if (!res) return
        let id, count = 1
        if (res.isJsonPrimitive()) id = String(res.getAsString())
        else {
            id = String(res.get('item').getAsString())
            if (res.has('count')) count = res.get('count').getAsInt()
        }
        if (!/nugget/.test(id)) return
        let ticks = Math.max(20, Math.round(200 * count / 9))
        try { r.cookingTime(ticks) } catch (e) { console.warn(`[smelt_times] ${r.getId()}: ${e}`) }
    })

    // Red alloy by hand: the mixer's own ratio (1 copper dust + 4 redstone = 1 red alloy dust), no machine.
    // The dust smelts into an ingot in any furnace.
    event.shapeless('gtceu:red_alloy_dust', ['#forge:dusts/copper', '4x #forge:dusts/redstone'])
        .id('positronics:survival/red_alloy_dust_by_hand')
})
