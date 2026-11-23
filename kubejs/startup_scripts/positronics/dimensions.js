// Positronics: no Nether, no End (decided 2026-11-23, before the first beta). The pack counts both as magic and
// they would skip the economy (blaze rods, quartz, ender pearls). Two Forge events close them:
//   - a Nether portal frame never lights (BlockEvent.PortalSpawnEvent is cancelled);
//   - nothing (player, item or mob) can travel into either dimension (EntityTravelToDimensionEvent is cancelled).
// Ad Astra planets and Stargate Journey worlds are untouched. Operators can still /execute in or /tp there.

const POS_CLOSED_DIMENSIONS = ['minecraft:the_nether', 'minecraft:the_end']
const PosComponent = Java.loadClass('net.minecraft.network.chat.Component')

ForgeEvents.onEvent('net.minecraftforge.event.level.BlockEvent$PortalSpawnEvent', event => {
    event.setCanceled(true)
})

ForgeEvents.onEvent('net.minecraftforge.event.entity.EntityTravelToDimensionEvent', event => {
    let dim = String(event.getDimension().location())
    if (POS_CLOSED_DIMENSIONS.indexOf(dim) < 0) return
    event.setCanceled(true)
    let entity = event.getEntity()
    console.info(`[positronics] dimensions: ${entity.getEncodeId() || 'player'} turned back from ${dim}`)
    if (entity.isPlayer && entity.isPlayer()) {
        entity.displayClientMessage(PosComponent.literal('[NCP] That way is closed. There is nothing out there but the island.'), true)
    }
})
