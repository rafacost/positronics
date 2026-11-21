# Study: element EMC = atomic number × tier factor

**Status:** parked (2026-11-21). A possible implementation, to revisit **after the pack has been playtested as it is**.
Model: `tools/studies/emc_atomic_number.py` (run `python -I tools/studies/emc_atomic_number.py`).

## The idea

Today every element is worth a flat value for its tier (`projecte/emc.js`: 8 / 64 / 512 / 4,096 / 32,768).
The idea: an element's EMC is its **atomic number Z**, so the chemistry becomes visible (lead is worth more than
iron, hydrogen is almost free).

## Pure Z (rejected)

- **Manual and ULV become too easy.** Seed I strata go up ×3–10 (lead ×10). Ore Generator + 2 Reclaimers: ~58k → ~224k EMC/h, so Core I takes under an hour.
- **LV and up break.** Z only climbs from 1 to 118, while tier values grow ×8 per tier.
  - Seed II (Al 13, Si 14, Na 11, Cl 17) would be worth *less* per stratum than Seed I (~125 against ~156).
  - The MV+ stars (Omega 51.2M, Magnum Vier 13.1G, Colossal Zwei 3.36T) become hundreds to thousands of times slower.
- **Plants halve.** Cellulose goes from 168 to 86, and lead becomes the currency.

## Z × tier factor (the candidate)

**EMC = Z × F[element tier]**, with F = 1 / 8 / 64 (/ 512 / 4,096), keeping the pack's ×8 step.
Each element keeps its current tier (`POS_ELEMENT_TIER_OVERRIDES`).

Average EMC per stratum. LV route: macerator → Dissolver, 1 dust = 16 atoms, by-products weighted.

| Seed | Now | Z × F | Change | Strata for the tier's core now → with Z × F |
|---|---|---|---|---|
| I (ULV), Klein Zwei 200k | 160 | 701 | ×4.4 | 1,248 → 285 |
| II (LV), Klein Vier 3.2M | 562 | 2,557 | ×4.6 | 5,696 → 1,251 |
| III (MV), Klein Omega 51.2M | 1,537 | 5,663 | ×3.7 | 33,305 → 9,041 |

**Progression is kept.** Tier-to-tier growth is ×3.6 and ×2.2, against ×3.5 and ×2.7 now. It's the same curve, about 4× richer.

### Adjustments it needs

1. **Stars one size up**, to cancel the ×4. Klein Stars grow ×4 per size:

   | Core | Star now | Star with Z × F |
   |---|---|---|
   | I | Zwei | Drei |
   | II | Vier | Sphere |
   | III | Omega | Magnum Ein |
   | IV, V | — | the same one-step shift (check in `gates.js` `POS_CORE_STARS`) |

2. **The Enrichment choice.** Within a tier the spread becomes huge:

   | Seed | Best stratum | Worst stratum | Gap with Z × F | Gap now |
   |---|---|---|---|---|
   | I | lead 1,613 | coal 121 | 13× | 1.2× |
   | II | gold 11,315 | silica 192 | 59× | 10× |
   | III | pitchblende 40,558 | oil sands 62 | 650× | 24× |

   Enrichment lets the player *choose* the new stratum, so gold-only and pitchblende-only farming would win.
   Each source stratum needs a fixed output, a random roll, or a cap.

3. **Non-strata sources.** Relative to strata they lose 4–9×:

   | Source | Now | With Z × F |
   |---|---|---|
   | Cellulose | 168 | 86 |
   | Honey | 192 | 96 |
   | Rock dust | 24 | 30 |
   | Water (2 H + O) | 24 | 10 |
   | Air | 80 | 72 |

   Either accept that plants and bees are early-only, or give light elements a floor (for example H, C, N and O at Z × 2).

### Verdict

Neither harder nor easier. It's today's pace with bigger numbers and much sharper choices within a tier.
Worth doing for the "chemistry you can feel" flavour, if all three adjustments come with it.

## Implementation sketch (when revisited)

- `projecte/emc.js`: add a Z table and set `values[chemlib:el] = Z[el] * F[tier]`. Compounds keep summing their atoms automatically.
- `gates/gates.js`: move `POS_CORE_STARS` up one size; update the quest star names in `tools/data/quests.py`.
- `strata/processing.js`: rework the Enrichment outputs (adjustment 2).
- Re-check the hand rates in quest text: Hands Off, Green Atoms, star quests.
- Not tested yet: how ProjectE handles 1-EMC hydrogen in transmutation (integer EMC, no fractions).
