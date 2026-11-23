// Positronics: bee rescue (decided 2026-11-23). On a skyblock a bee that wanders off the island drifts down
// into the void and is gone, egg and all. Instead of refunding eggs, the void never gets them: the moment a
// bee (vanilla or Productive Bees) takes out-of-world damage, the damage is cancelled and the bee is put back
// above its hive. A bee with no hive goes to the nearest player, or to world spawn if nobody is around.

const BEE_RESCUE_LOG = true

function positronicsIsBee(entity) {
    let id = String(entity.getEncodeId() || '')
    return id === 'minecraft:bee' || id.startsWith('productivebees:')
}

EntityEvents.hurt(event => {
    let bee = event.entity
    if (!positronicsIsBee(bee)) return
    let kind = ''
    try { kind = String(event.source.getType()) } catch (e) { kind = String(event.source) }
    if (kind.indexOf('outOfWorld') < 0) return

    let level = bee.level
    let x, y, z, where
    let hive = null
    try { hive = bee.getHivePos() } catch (e) { hive = null }
    if (hive) {
        x = hive.x + 0.5; y = hive.y + 1.2; z = hive.z + 0.5; where = 'its hive'
    } else {
        let player = level.getNearestPlayer(bee, -1)
        if (player) {
            x = player.x; y = player.y + 1; z = player.z; where = `near ${player.username}`
        } else {
            let spawn = level.getSharedSpawnPos()
            x = spawn.x + 0.5; y = spawn.y + 2; z = spawn.z + 0.5; where = 'world spawn'
        }
    }
    bee.setMotion(0, 0, 0)
    bee.resetFallDistance()
    bee.teleportTo(x, y, z)
    if (BEE_RESCUE_LOG) console.info(`[positronics] bee rescue: ${bee.getEncodeId()} pulled out of the void to ${where} (${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)})`)
    event.cancel()   // KubeJS 6: cancel() ends the handler, so it goes last
})
