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

// ---- Bee Recall (NCP Shop, 2 Scrip; decided 2026-11-23). The shop quest runs
// `execute as <player> at <player> run positronics_recallbees`. Every loaded bee in the player's dimension that is more than 24 blocks from its hive is put back
// above it; a bee whose hive is gone (or never had one) and is more than 8 blocks away comes to the player.
// Bees in unloaded chunks aren't ticking and can't be found. The Scrip always goes back.
const BEE_RECALL_HOME = 24
const BEE_RECALL_TO_PLAYER = 8
const BEE_RECALL_PRICE = 1   // paid by the quest and always handed back: free for now (2026-11-23)

function positronicsDist2(e, x, y, z) {
    let dx = e.x - x, dy = e.y - y, dz = e.z - z
    return dx * dx + dy * dy + dz * dz
}

function positronicsRecallBeesAt(level, px, py, pz) {
    let home = 0, toYou = 0
    level.getEntities().forEach(bee => {
        if (!positronicsIsBee(bee) || !bee.isAlive()) return
        let hive = null
        try { hive = bee.getHivePos() } catch (e) { hive = null }
        if (hive && level.getBlockEntity(hive) == null) hive = null   // the hive was broken
        if (hive) {
            let hx = hive.x + 0.5, hy = hive.y + 1.2, hz = hive.z + 0.5
            if (positronicsDist2(bee, hx, hy, hz) <= BEE_RECALL_HOME * BEE_RECALL_HOME) return
            bee.setMotion(0, 0, 0)
            bee.teleportTo(hx, hy, hz)
            home++
        } else {
            if (positronicsDist2(bee, px, py, pz) <= BEE_RECALL_TO_PLAYER * BEE_RECALL_TO_PLAYER) return
            bee.setMotion(0, 0, 0)
            bee.teleportTo(px, py + 1, pz)
            toYou++
        }
    })
    return { home: home, toYou: toYou }
}

function positronicsRecallBees(player) {
    let r = positronicsRecallBeesAt(player.level, player.x, player.y, player.z)
    player.give(Item.of('positronics:ncp_scrip', BEE_RECALL_PRICE))
    if (r.home + r.toYou === 0) {
        player.tell(Text.gray(`[NCP] Every bee within earshot is already home. Scrip returned.`))
    } else {
        player.tell(Text.gold(`[NCP] Recall: ${r.home} bee(s) sent back to their hives, ${r.toYou} homeless bee(s) brought to you. Scrip returned.`))
    }
    console.info(`[positronics] bee recall for ${player.username}: home=${r.home} toPlayer=${r.toYou}`)
    return r.home + r.toYou
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event
    event.register(Commands.literal('positronics_recallbees')
        .requires(src => src.hasPermission(2))
        .executes(ctx => {
            let player = ctx.source.getPlayer()
            if (!player) {
                console.info('[positronics] bee recall: run it as a player (execute as <player> run positronics_recallbees)')
                return 0
            }
            return positronicsRecallBees(player)
        }))
})
