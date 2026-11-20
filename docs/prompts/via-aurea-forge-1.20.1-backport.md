# Agent prompt: Via Aurea backport → Forge 1.20.1

> Paste everything below the line into the coding agent. Run it inside `D:\AI_Projects\usrg_automation\via_aurea`.

---

You are backporting **Via Aurea** 0.6.0 (a Catholic Christian devotional goldsmithing mod by rafacost3d, All Rights Reserved) from **NeoForge 1.21.1** to **Forge 1.20.1**. The repo is at `D:\AI_Projects\usrg_automation\via_aurea`. Read `README.md`, `CHANGELOG.md` and `docs/*.md` first: they define the features and the theological boundaries that must be preserved exactly.

## Target

- Minecraft **1.20.1**, **Forge 47.4.0**, Java 17, ForgeGradle 6, official mappings.
- Dependencies (1.20.1 Forge builds via Curse Maven or the official mavens):
  - **Curios 5.x** (`top.theillusivec4.curios:curios-forge`), required.
  - **Patchouli** for 1.20.1 Forge, required.
  - **JEI 15.x** for 1.20.1 Forge, optional (`compileOnly` API plus `runtimeOnly` for dev).
- The target modpack also runs EMI. JEI plugins show in EMI through its JEI compatibility, so no separate EMI plugin is needed.

## Rules

- Create branch `1.20.1-forge` from `master`. **Do not modify `master`.** The 1.21.1 line stays as it is.
- **Feature parity with 0.6.0:** every item, block, recipe, workstation, Curios slot, effect, HUD state, Scripture quotation, diary entry and config option behaves the same. Don't add features or "improve" text. The devotional wording is intentional.
- Version string: `1.20.1-0.6.0`.

## Known API differences to handle (found by scanning the 33 source files)

| 1.21.1 NeoForge (current) | 1.20.1 Forge (target) |
|---|---|
| `net.neoforged.*` imports (40 uses) | `net.minecraftforge.*` |
| `DeferredHolder`/`DeferredItem`/`DeferredBlock` (≈40 uses) | `RegistryObject` + `DeferredRegister.create(ForgeRegistries.X, MODID)` |
| **Attachments** (`ModAttachments`: `LAST_DAILY_BREAD_PREPARED_DAY`, `LAST_DAILY_BREAD_CONSUMED_DAY`, `GOLDSMITHS_DIARY_RECEIVED`, `PEACE`, `LAST_PEACE_DECAY_DAY` are persistent with `copyOnDeath`; `FOCUS_PROGRESS` is transient) | A player **capability** with NBT serialization, copied in `PlayerEvent.Clone` (including on death) for the persistent ones. `FOCUS_PROGRESS` stays transient. Sync to the client wherever the HUD needs it (Forge `SimpleChannel`). |
| **Data component** `CRAFTSMANSHIP_QUALITY` (`Codec.INT`, network-synced) | An item **NBT tag** (e.g. `via_aurea:craftsmanship_quality` int), with the same read/write helpers in `CraftsmanshipItem` and `CraftsmanshipQuality` |
| `MapCodec` for blocks (6 uses) | Remove; 1.20.1 blocks don't need `codec()` |
| `ResourceLocation.fromNamespaceAndPath` | `new ResourceLocation(ns, path)` |
| Tooltip `TooltipContext` | `appendHoverText(ItemStack, @Nullable Level, List, TooltipFlag)` |
| `Holder<MobEffect>` in effect instances | Plain `MobEffect` / `RegistryObject<MobEffect>` |
| 1.21 `FoodProperties` builder (`alwaysEdible`) | 1.20.1 `FoodProperties.Builder().alwaysEat()` |
| `IMenuTypeExtension` | `IForgeMenuType.create` |
| `NeoForge.EVENT_BUS` | `MinecraftForge.EVENT_BUS` |
| Curios 9 API | Curios 5 API (`ICurioItem`, `CuriosApi.getCuriosInventory(...)` returning `LazyOptional` on 1.20.1), renderer registration via `CuriosRendererRegistry` |
| Data folders `data/*/recipe`, `tags/item` | **`recipes`** and **`tags/items`** (plural) on 1.20.1; `loot_tables` already matches |
| Recipe JSON result format `{"id": ...}` | `{"item": ..., "count": ...}` |
| Patchouli book layout | Patchouli 1.20.1 layout: `book.json` in `data/via_aurea/patchouli_books/goldsmiths_diary/`, contents in `assets/` with `"use_resource_pack": true`. Check the in-book recipe/grid templates still render. |

Check every other file too. This table comes from a scan, not a complete audit.

## Verification

1. `gradlew build` passes on Java 17.
2. Dev client: create a world and confirm:
   - The diary is given once on first login.
   - The Tau Cross shows its quotation when crafted.
   - Daily Bread works once per day, from the offhand Tau Cross or the necklace.
   - The Peace HUD states appear, and Peace and the diary flag survive death and relog.
   - Focus is gained at the bench.
   - Quality tiers appear on crafted items and persist after relog.
   - Both workstation menus and recipes work, and only at their station.
   - Curios: the necklace and ring equip; the necklace renders; the ring gives 4% damage reduction; the Cross of Steadfastness stops damage from interrupting Focus.
   - The JEI categories show.
   - The Patchouli diary opens with all entries.
3. Smoke test alongside the target pack's core (GTCEu 7.5.2, Curios, Patchouli, EMI) if feasible: no crash and no recipe conflicts.
4. Add `docs/releases/1.20.1-0.6.0-forge.md` listing what changed in the port, and any behaviour you could not keep identical (with the reason).

Commit in logical steps on `1.20.1-forge`. **Do not push, tag or publish without asking.** If something forces a behaviour change, stop and ask the author first.
