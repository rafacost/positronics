"""USRG tier upgrade icons as NCP work-order cards (decided 2026-11-23).

The clearance card's shape, painted solid in USRG's own order (redstone red, gold, emerald green, nether-star
violet), an up-arrow where the clearance card has its chip, and one pip per upgrade step on the stripe.
Colours are baked into the PNGs: USRG's items can't be tinted from KubeJS.

Writes (and nothing else):
  kubejs/assets/positronics/textures/item/usrg_upgrade_<2..5>.png
  kubejs/assets/usrg/models/item/tier_upgrade_<2..5>.json   (overrides USRG's vanilla-icon models)
Run: python -I tools/make_upgrade_icons.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from make_assets import write_png  # noqa: E402

COLORS = {2: (178, 34, 34), 3: (214, 164, 32), 4: (40, 160, 90), 5: (128, 72, 196)}


def upgrade_texture(rgb, step):
    clear = (0, 0, 0, 0)

    def shade(f):
        return tuple(min(255, int(c * f)) for c in rgb) + (255,)

    edge, body, stripe, light = shade(0.45), shade(1.0), shade(0.7), shade(1.35)
    mark = (245, 245, 240, 255)
    px = [[clear] * 16 for _ in range(16)]
    for y in range(3, 13):
        for x in range(1, 15):
            px[y][x] = edge if (y in (3, 12) or x in (1, 14)) else body
    for x in range(2, 14):
        px[4][x] = light if x < 8 else body
        px[10][x] = stripe
    # up-arrow: a solid head over a stem
    for x, y in [(5, 5), (4, 6), (5, 6), (6, 6), (3, 7), (4, 7), (5, 7), (6, 7), (7, 7), (5, 8), (5, 9)]:
        px[y][x] = mark
    # one pip per step (upgrade 2..5 -> 1..4 pips), right side of the stripe
    for k in range(step - 1):
        px[10][12 - 2 * k] = mark
    return px


def main():
    tex = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "item")
    models = os.path.join(ROOT, "kubejs", "assets", "usrg", "models", "item")
    os.makedirs(models, exist_ok=True)
    for step, rgb in COLORS.items():
        write_png(os.path.join(tex, f"usrg_upgrade_{step}.png"), upgrade_texture(rgb, step))
        with open(os.path.join(models, f"tier_upgrade_{step}.json"), "w", encoding="utf-8", newline="\n") as f:
            f.write('{\n  "parent": "minecraft:item/generated",\n'
                    f'  "textures": {{ "layer0": "positronics:item/usrg_upgrade_{step}" }}\n}}\n')
    print("wrote 4 USRG tier upgrade icons and model overrides")


if __name__ == "__main__":
    main()
