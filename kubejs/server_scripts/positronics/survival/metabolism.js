// Positronics: metabolism (decided 2026-11-22). Vanilla hunger only drains on actions (sprinting, mining,
// fighting); a factory player who walks and waits never gets hungry, and AFK costs nothing. This adds a
// steady burn, AFK included:
//   hunger : one full bar (20 points = 80 exhaustion) every 120 minutes.
//   thirst : Tough As Nails copies every food exhaustion into thirst at its own threshold (8.0, hunger's
//            is 4.0), so the same burn drains a full thirst bar in 240 minutes.
//   heat   : TaN temperature (biome, Serene Seasons summer, furnaces, lava) adds thirst on top:
//            WARM another x1 (a bar in 120 min), HOT another x3 (a bar in 60 min). Cold adds nothing.
// Creative and spectator players are skipped.

let TanTemperature = null
let TanThirst = null
try {
    TanTemperature = Java.loadClass('toughasnails.api.temperature.TemperatureHelper')
    TanThirst = Java.loadClass('toughasnails.api.thirst.ThirstHelper')
} catch (e) {
    console.warn(`[positronics] metabolism: Tough As Nails API not found, heat thirst is off (${e})`)
}

const METABOLISM_PERIOD = 20                          // ticks between burns (once a second)
const METABOLISM_BURN = 80 / (120 * 60)               // exhaustion per second: 80 over 120 minutes
const HEAT_THIRST = { WARM: 1, HOT: 3 }               // extra thirst, in multiples of the base burn

PlayerEvents.tick(event => {
    let player = event.player
    if (player.tickCount % METABOLISM_PERIOD != 0) return
    if (player.isCreative() || player.isSpectator()) return

    player.causeFoodExhaustion(METABOLISM_BURN)

    if (!TanTemperature || !TanThirst) return
    if (!TanTemperature.isTemperatureEnabled() || !TanThirst.isThirstEnabled()) return
    let extra = HEAT_THIRST[TanTemperature.getTemperatureForPlayer(player).name()]
    if (extra) TanThirst.getThirst(player).addExhaustion(METABOLISM_BURN * extra)
})
