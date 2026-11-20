// Positronics: Immersive Engineering is used for ONE thing, the Garden Cloche (decided 2026-11-20).
// Every other IE recipe is removed (excavator and mineral veins, coke oven, blast furnace, wires...),
// except the data recipes the cloche itself needs (cloche crops and fertilizers).
// The cloche gets a GregTech recipe at LV, since IE's own components are gone.

ServerEvents.recipes(event => {
    let keepTypes = ['immersiveengineering:cloche', 'immersiveengineering:fertilizer']
    event.remove({ mod: 'immersiveengineering', not: keepTypes.map(t => ({ type: t })) })
    event.remove({ mod: 'ie_pb_processing' })

    event.shaped('immersiveengineering:cloche', [
        'GGG',
        'GCG',
        'PHP'
    ], {
        G: '#forge:glass',
        C: '#gtceu:circuits/lv',
        P: '#forge:plates/steel',
        H: 'gtceu:lv_machine_hull'
    }).id('positronics:integration/garden_cloche')
})
