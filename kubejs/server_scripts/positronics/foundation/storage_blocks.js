// Positronics: storage blocks by tier (user's call, 2026-11-24).
//  - ULV: copper, tin, iron, redstone, bronze and steel. All six craft by hand (foundation.js), and the
//    ULV Reclamation Compressor packs them for automation (GregTech's block recipes run at 2 EU/t).
//  - LV: every other ingot or gem block. Only the compressor ran below LV (the mold, extruder and
//    solidifier routes already need LV machines), so its recipes move up to 30 EU/t.
//  - MV: gold, diamond and emerald blocks (drawer upgrades, Ad Astra, Avaritia, ...): every GregTech
//    route into them moves up to 120 EU/t.
// Durations stay; only the voltage moves. Each recipe is rebuilt with GregTech's builder under the
// positronics namespace (same path).

const POS_BLOCK_ULV = ['copper', 'tin', 'iron', 'redstone', 'bronze', 'steel']
const POS_BLOCK_MV_OUT = ['minecraft:gold_block', 'minecraft:diamond_block', 'minecraft:emerald_block']
const POS_BLOCK_LV_EU = 30
const POS_BLOCK_MV_EU = 120

// Rebuild a simple GregTech recipe (item/fluid in, item out; chance 0 = not consumed) at a new voltage.
function posRebuildGT(event, r, eu) {
    let j = JSON.parse(String(r.json))
    let id = String(r.getId())
    // GregTech prefixes the machine type: gtceu:compressor/x becomes positronics:compressor/x.
    let b = event.recipes.gtceu[j.type.split(':')[1]](`positronics:${id.split(':')[1].split('/').slice(1).join('/')}`)
    let ins = []
    ;(j.inputs.item || []).forEach(e => {
        let c = e.content
        let s = c.ingredient.tag ? `#${c.ingredient.tag}` : c.ingredient.item
        let str = c.count > 1 ? `${c.count}x ${s}` : s
        if (e.chance === 0) b.notConsumable(str)
        else ins.push(str)
    })
    if (ins.length) b.itemInputs(ins)
    ;(j.inputs.fluid || []).forEach(e => {
        let v = e.content.value[0]
        let fluid = v.fluid || v.tag.replace(/^forge:/, 'gtceu:')   // GregTech's molten metals: tag forge:x = fluid gtceu:x
        b.inputFluids(`${fluid} ${e.content.amount}`)
    })
    b.itemOutputs(j.outputs.item.map(e => (e.content.count > 1 ? `${e.content.count}x ` : '') + e.content.ingredient.item))
    b.duration(j.duration).EUt(eu)
    event.remove({ id: id })
}

ServerEvents.recipes(event => {
    let lv = []
    let mv = []
    event.forEachRecipe({ type: 'gtceu:compressor', output: '#forge:storage_blocks' }, r => {
        let m = /"tag":"forge:(ingots|gems)\/([a-z_]+)"/.exec(String(r.json))
        if (m == null || POS_BLOCK_ULV.indexOf(m[2]) >= 0) return
        let j = String(r.json)
        if (POS_BLOCK_MV_OUT.some(o => j.indexOf(`"item":"${o}"`) >= 0)) return   // handled below
        lv.push(r)
    })
    POS_BLOCK_MV_OUT.forEach(out => {
        ;['gtceu:compressor', 'gtceu:alloy_smelter', 'gtceu:extruder', 'gtceu:fluid_solidifier'].forEach(ty => {
            event.forEachRecipe({ type: ty, output: out }, r => mv.push(r))
        })
    })
    lv.forEach(r => posRebuildGT(event, r, POS_BLOCK_LV_EU))
    mv.forEach(r => posRebuildGT(event, r, POS_BLOCK_MV_EU))
    console.info(`[Positronics] storage blocks: ${lv.length} compressor recipes to LV, ${mv.length} gold/diamond/emerald recipes to MV`)
})
