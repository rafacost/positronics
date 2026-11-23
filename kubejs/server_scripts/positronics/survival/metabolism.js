// Positronics: metabolism (decided 2026-11-22, rate raised 2026-11-23). Vanilla hunger only drains on actions
// (sprinting, mining, fighting); a factory player who walks and waits never gets hungry, and AFK costs nothing.
// This adds a steady burn, AFK included:
//   hunger : one full bar (20 points = 80 exhaustion) every 60 minutes. Saturation burns first, as in vanilla.
//   thirst : Tough As Nails copies every food exhaustion into thirst at its own threshold (8.0, hunger's
//            is 4.0), so the same burn drains a full thirst bar in 120 minutes.
//   heat   : TaN temperature (biome, Serene Seasons summer, furnaces, lava) adds thirst on top:
//            WARM another x1 (a bar in 60 min), HOT another x3 (a bar in 30 min). Cold adds nothing.
// The burn is paid for the server ticks that really passed since the last payment, so a missed tick event
// can't slow it down. Every 10 minutes the log gets a line per player with what was paid, to check the rate.
// Creative and spectator players are skipped.

let TanTemperature = null
let TanThirst = null
try {
    TanTemperature = Java.loadClass('toughasnails.api.temperature.TemperatureHelper')
    TanThirst = Java.loadClass('toughasnails.api.thirst.ThirstHelper')
} catch (e) {
    console.warn(`[positronics] metabolism: Tough As Nails API not found, heat thirst is off (${e})`)
}

const METABOLISM_PERIOD = 20                          // pay roughly once a second
const METABOLISM_PER_TICK = 80 / (60 * 60 * 20)       // exhaustion per tick: 80 over 60 minutes
const METABOLISM_MAX_GAP = 200                        // never pay for more than 10 s at once (login, lag spikes)
const METABOLISM_REPORT = 20 * 60 * 10                // log line every 10 minutes
const HEAT_THIRST = { WARM: 1, HOT: 3 }               // extra thirst, in multiples of the base burn

const metabolismState = {}                            // uuid -> { last, paid, since }

PlayerEvents.tick(event => {
    let player = event.player
    let now = event.server.tickCount
    let id = String(player.uuid)
    let st = metabolismState[id]
    if (!st) { metabolismState[id] = { last: now, paid: 0, since: now }; return }
    if (now - st.last < METABOLISM_PERIOD) return
    let gap = Math.min(now - st.last, METABOLISM_MAX_GAP)
    st.last = now
    if (player.isCreative() || player.isSpectator()) return

    let burn = METABOLISM_PER_TICK * gap
    player.causeFoodExhaustion(burn)
    st.paid += burn

    if (now - st.since >= METABOLISM_REPORT) {
        let food = player.foodData
        console.info(`[positronics] metabolism: ${player.username} paid ${st.paid.toFixed(2)} exhaustion over ${now - st.since}` +
            ` ticks (target ${(METABOLISM_PER_TICK * (now - st.since)).toFixed(2)}); food ${food.getFoodLevel()},` +
            ` saturation ${Number(food.getSaturationLevel()).toFixed(1)}`)
        st.paid = 0
        st.since = now
    }

    if (!TanTemperature || !TanThirst) return
    if (!TanTemperature.isTemperatureEnabled() || !TanThirst.isThirstEnabled()) return
    let extra = HEAT_THIRST[TanTemperature.getTemperatureForPlayer(player).name()]
    if (extra) TanThirst.getThirst(player).addExhaustion(burn * extra)
})
