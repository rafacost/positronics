// Positronics: the first hive can't need honeycomb (no bees exist until a hive does).
// Beehives and advanced beehives take string (from fibre crops) where they took honeycomb.

// FTB Quests only compares NBT for items in this tag: combs differ only by NBT (bee type).
ServerEvents.tags('item', event => {
    event.add('ftbquests:check_nbt', 'productivebees:configurable_honeycomb')
})

ServerEvents.recipes(event => {
    event.replaceInput({ output: 'minecraft:beehive', type: 'minecraft:crafting_shaped' }, 'minecraft:honeycomb', 'minecraft:string')
    event.replaceInput({ output: 'minecraft:beehive', type: 'minecraft:crafting_shaped' }, '#forge:honeycombs', 'minecraft:string')
    event.replaceInput({ output: /^productivebees:advanced_.*_beehive$/, type: 'minecraft:crafting_shaped' }, '#forge:honeycombs', 'minecraft:string')
})
