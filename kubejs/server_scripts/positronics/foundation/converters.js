// Positronics: GregTech energy converters are placed in FE -> EU mode (GT's default is EU -> FE).
// Same trick as Greg-E (credit: StarT). A Soft Mallet still flips the mode by hand.
BlockEvents.placed(event => {
    let block = event.getBlock()
    if (/^gtceu:.*energy_converter$/.test(block.getId())) {
        block.mergeEntityData({ energyContainer: { feToEu: true } })
    }
})
