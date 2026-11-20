// Positronics: world rules applied once per world.
// No natural mob spawning of any kind: mobs only ever come from tech.

ServerEvents.loaded(event => {
    const data = event.server.persistentData
    if (data.getBoolean('positronics_rules_v1')) return

    const rules = event.server.gameRules
    rules.set('doMobSpawning', false)     // no natural spawns (hostile or passive)
    rules.set('doPatrolSpawning', false)  // no pillager patrols
    rules.set('doTraderSpawning', false)  // no wandering traders
    rules.set('doWardenSpawning', false)  // no wardens
    rules.set('doInsomnia', false)        // no phantoms

    data.putBoolean('positronics_rules_v1', true)
    console.info('[Positronics] World rules applied: natural mob spawning disabled.')
})
