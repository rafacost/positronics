// Positronics: tier gate items.
//  - Positronic Core I-V: the keystone of each seed tier (Extreme Crafting + a FULL star).
//    Used as a never-consumed catalyst for Strata enrichment, USRG tier upgrades and cards.
//  - NCP Clearance Card Level 1-10: 1:1 with GT tiers ULV..UHV. Card N gates tier N+1 hulls.
// Neither has EMC; neither can be learned.

let POSITRONICS_ROMAN = ['I', 'II', 'III', 'IV', 'V']
const POSITRONICS_CORE_COLORS = [0x4fd1c5, 0x63b3ed, 0x9f7aea, 0xed8936, 0xf6e05e]
const POSITRONICS_CARD_TIERS = ['ULV', 'LV', 'MV', 'HV', 'EV', 'IV', 'LuV', 'ZPM', 'UV', 'UHV']
const POSITRONICS_CARD_COLORS = [0x9e9e9e, 0xdcdcdc, 0xff6400, 0xffff1e, 0x808080, 0xf0f0f5, 0xe99797, 0x7ec3c4, 0x7eba3a, 0x4040ff]

StartupEvents.registry('item', event => {
    for (let i = 1; i <= 5; i++) {
        event.create(`positronics:positronic_core_${i}`)
            .displayName(`Positronic Core ${POSITRONICS_ROMAN[i - 1]}`)
            .texture('positronics:item/positronic_core')
            .color(0, POSITRONICS_CORE_COLORS[i - 1])
            .maxStackSize(16)
            .rarity(i >= 4 ? 'epic' : 'rare')
            .glow(true)
            .tag('positronics:positronic_cores')
    }
    for (let i = 1; i <= 10; i++) {
        event.create(`positronics:clearance_card_${i}`)
            .displayName(`NCP Clearance Card: Level ${i}`)
            .texture('positronics:item/clearance_card')
            .color(0, POSITRONICS_CARD_COLORS[i - 1])
            .maxStackSize(1)
            .rarity(i >= 8 ? 'epic' : (i >= 4 ? 'rare' : 'uncommon'))
            .tag('positronics:clearance_cards')
    }
})

global.POSITRONICS_CARD_TIERS = POSITRONICS_CARD_TIERS
