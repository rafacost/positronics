# Positronics

A tech-only GregTech + ProjectE skyblock modpack for **Minecraft 1.20.1 · Forge 47.4.0**.
*The world has moved on. Rebuild the North Central Positronics network, tier by tier, and open a Door.*

Status: **pre-alpha** (Alpha 0.1 = island → end of LV).

## Layout
| Path | What |
|---|---|
| `docs/` | Design docs: skeleton, seed chains, multiblocks, story and naming, mod list, agent prompts |
| `kubejs/*/positronics/` | Our KubeJS scripts (everything we write lives under a `positronics` folder) |
| `config/`, `defaultconfigs/` | Only the config files we change; generated defaults are not tracked |
| `tools/deploy.ps1` | Repo → test instance (`D:\Minecraft\Instances\Positronics`) |
| `tools/pull.ps1` | Instance → repo for things authored in-game (FTB Quests, Skyblock Builder templates, tweaked configs) |

## Workflow
1. Edit in the repo, run `tools\deploy.ps1`, then **restart the game** (KubeJS recipe/startup changes need a full restart; `/reload` isn't enough in this stack).
2. After editing quests or templates in-game, run `tools\pull.ps1`, review `git diff`, commit.

## Mods
The mod list lives in `docs/alpha-0.1-modlist.md`. Jars are never committed: the CurseForge profile manages them. Our own mods (USRG Forge port, later Via Aurea and Positronics Core) are added to the instance by hand.

## Credits and rules
- Our own content. Inspired by Greg-E's ideas (patterns only, no content reused).
- Names inspired by Stephen King's *Dark Tower* (North Central Positronics). Names and premise only: no quoted text, logos or art.
- No magic content, by design.
