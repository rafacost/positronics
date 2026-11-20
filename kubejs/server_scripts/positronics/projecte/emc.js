// Positronics: Positronic Memory learns ELEMENTS, not ingots (decided 2026-11-20).
// Every item's EMC is cleared; only ChemLib elements (plus a few organic exceptions such as slime)
// get values back. To turn production into EMC, dissolve it into elements (Alchemistry Dissolver);
// to turn EMC back into materials, transmute elements and compress them into GregTech dust
// (chemistry.js). Elements are valued by the tier where the material becomes available.

const POS_EMC_TIER_VALUE = { 1: 8, 2: 64, 3: 512, 4: 4096, 5: 32768 }

// Default tier by period, then per-element overrides that follow the pack's progression.
const POS_ELEMENT_PERIODS = [
    ['hydrogen', 'helium'],
    ['lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon'],
    ['sodium', 'magnesium', 'aluminum', 'silicon', 'phosphorus', 'sulfur', 'chlorine', 'argon'],
    ['potassium', 'calcium', 'scandium', 'titanium', 'vanadium', 'chromium', 'manganese', 'iron', 'cobalt', 'nickel', 'copper', 'zinc', 'gallium', 'germanium', 'arsenic', 'selenium', 'bromine', 'krypton'],
    ['rubidium', 'strontium', 'yttrium', 'zirconium', 'niobium', 'molybdenum', 'technetium', 'ruthenium', 'rhodium', 'palladium', 'silver', 'cadmium', 'indium', 'tin', 'antimony', 'tellurium', 'iodine', 'xenon'],
    ['cesium', 'barium', 'lanthanum', 'cerium', 'praseodymium', 'neodymium', 'promethium', 'samarium', 'europium', 'gadolinium', 'terbium', 'dysprosium', 'holmium', 'erbium', 'thulium', 'ytterbium', 'lutetium', 'hafnium', 'tantalum', 'tungsten', 'rhenium', 'osmium', 'iridium', 'platinum', 'gold', 'mercury', 'thallium', 'lead', 'bismuth', 'polonium', 'astatine', 'radon'],
    ['francium', 'radium', 'actinium', 'thorium', 'protactinium', 'uranium', 'neptunium', 'plutonium', 'americium', 'curium', 'berkelium', 'californium', 'einsteinium', 'fermium', 'mendelevium', 'nobelium', 'lawrencium', 'rutherfordium', 'dubnium', 'seaborgium', 'bohrium', 'hassium', 'meitnerium', 'darmstadtium', 'roentgenium', 'copernicium', 'nihonium', 'flerovium', 'moscovium', 'livermorium', 'tennessine', 'oganesson']
]
const POS_PERIOD_TIER = [1, 1, 1, 2, 3, 4, 5]
const POS_ELEMENT_TIER_OVERRIDES = {
    // Seed I (Waste Lands / River Crossing)
    iron: 1, cobalt: 1, nickel: 1, copper: 1, zinc: 1, manganese: 1, potassium: 1, calcium: 1, tin: 1, lead: 1,
    // Seed II (The Calla)
    aluminum: 2, gold: 2, silver: 2, antimony: 2, lithium: 2,
    // Moon / Mars / Seed III
    titanium: 3, vanadium: 3, chromium: 3, thorium: 3, uranium: 3, mercury: 3, barium: 3, cesium: 3, bismuth: 3, thallium: 3,
    // Venus / Mercury / Glacio / Seed IV
    niobium: 4, molybdenum: 4, ruthenium: 4, rhodium: 4, palladium: 4,
    // Seed V and beyond
    europium: 5
}
// No exceptions: only elements. (Rubber comes from carbon + hydrogen on the crafting table, chemistry.js.)
const POS_EMC_EXCEPTIONS = {}

global.POSITRONICS_ELEMENT_TIERS = {}
POS_ELEMENT_PERIODS.forEach((period, i) => period.forEach(el => {
    global.POSITRONICS_ELEMENT_TIERS[el] = POS_ELEMENT_TIER_OVERRIDES[el] || POS_PERIOD_TIER[i]
}))

ProjectEEvents.setEMC(event => {
    let values = {}
    Object.keys(global.POSITRONICS_ELEMENT_TIERS).forEach(el => {
        values[`chemlib:${el}`] = POS_EMC_TIER_VALUE[global.POSITRONICS_ELEMENT_TIERS[el]]
    })
    Object.keys(POS_EMC_EXCEPTIONS).forEach(id => { values[id] = POS_EMC_EXCEPTIONS[id] })

    let cleared = 0
    Ingredient.all.itemIds.forEach(id => {
        if (values[id] === undefined) {
            event.setEMCAfter(id, 0)
            cleared++
        }
    })
    Object.keys(values).forEach(id => event.setEMCAfter(id, values[id]))
    console.info(`[Positronics] Positronic Memory: cleared EMC from ${cleared} items; ${Object.keys(values).length} learnable (elements + exceptions).`)
})
