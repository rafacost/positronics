// Positronics: strata smelt into nuggets, so nine nuggets must make an ingot by hand.
// (GregTech leaves nugget packing to machines; at the start you have none.)

ServerEvents.recipes(event => {
    let ingots = {
        iron: 'minecraft:iron_ingot', copper: 'minecraft:copper_ingot', gold: 'minecraft:gold_ingot',
        wrought_iron: 'gtceu:wrought_iron_ingot', tin: 'gtceu:tin_ingot', lead: 'gtceu:lead_ingot',
        nickel: 'gtceu:nickel_ingot', zinc: 'gtceu:zinc_ingot', silver: 'gtceu:silver_ingot',
        bronze: 'gtceu:bronze_ingot', steel: 'gtceu:steel_ingot', red_alloy: 'gtceu:red_alloy_ingot',
        tin_alloy: 'gtceu:tin_alloy_ingot', invar: 'gtceu:invar_ingot', brass: 'gtceu:brass_ingot',
        cupronickel: 'gtceu:cupronickel_ingot', electrum: 'gtceu:electrum_ingot', aluminium: 'gtceu:aluminium_ingot'
    }
    Object.keys(ingots).forEach(m => {
        event.shaped(ingots[m], ['NNN', 'NNN', 'NNN'], { N: `#forge:nuggets/${m}` })
            .id(`positronics:survival/nuggets_to_ingot/${m}`)
    })
})
