"""Positronics asset generator (stdlib only).

Writes:
  config/skyblockbuilder/templates/waste_lands.nbt   - the start island (structure template)
  kubejs/assets/positronics/textures/item/ncp_scrip.png - placeholder coin texture

Run from anywhere:  python tools/make_assets.py
"""
import gzip
import io
import os
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_VERSION = 3465  # Minecraft 1.20.1

# --------------------------------------------------------------------------- NBT writer
TAG_END, TAG_BYTE, TAG_INT, TAG_STRING, TAG_LIST, TAG_COMPOUND = 0, 1, 3, 8, 9, 10


class Int(int):
    pass


class Byte(int):
    pass


def _name(buf, name):
    raw = name.encode("utf-8")
    buf.write(struct.pack(">H", len(raw)))
    buf.write(raw)


def _type(value):
    if isinstance(value, Byte):
        return TAG_BYTE
    if isinstance(value, Int):
        return TAG_INT
    if isinstance(value, str):
        return TAG_STRING
    if isinstance(value, dict):
        return TAG_COMPOUND
    if isinstance(value, list):
        return TAG_LIST
    raise TypeError(f"unsupported NBT value: {value!r}")


def _payload(buf, value):
    t = _type(value)
    if t == TAG_BYTE:
        buf.write(struct.pack(">b", value))
    elif t == TAG_INT:
        buf.write(struct.pack(">i", value))
    elif t == TAG_STRING:
        _name(buf, value)
    elif t == TAG_COMPOUND:
        for key, child in value.items():
            buf.write(struct.pack(">B", _type(child)))
            _name(buf, key)
            _payload(buf, child)
        buf.write(struct.pack(">B", TAG_END))
    elif t == TAG_LIST:
        elem_type = _type(value[0]) if value else TAG_END
        buf.write(struct.pack(">B", elem_type))
        buf.write(struct.pack(">i", len(value)))
        for child in value:
            _payload(buf, child)


def write_nbt(path, root):
    buf = io.BytesIO()
    buf.write(struct.pack(">B", TAG_COMPOUND))
    _name(buf, "")
    _payload(buf, root)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with gzip.open(path, "wb") as f:
        f.write(buf.getvalue())


# --------------------------------------------------------------------------- the island
def island():
    """The Waste Lands: a 9x5x9 fragment of the old world with a ruined NCP kiosk."""
    blocks = {}  # (x, y, z) -> (name, props)

    def put(x, y, z, name, props=None):
        blocks[(x, y, z)] = (name, props or {})

    # y=0: underside
    for x in range(2, 7):
        for z in range(2, 7):
            corner = x in (2, 6) and z in (2, 6)
            put(x, 0, z, "minecraft:stone" if corner else "minecraft:dirt")

    # y=1: surface (7x7 without corners)
    for x in range(1, 8):
        for z in range(1, 8):
            if x in (1, 7) and z in (1, 7):
                continue
            name = "minecraft:dirt" if (x + z) % 3 == 0 else "minecraft:coarse_dirt"
            put(x, 1, z, name)
    for x, z in [(3, 3), (4, 3), (3, 4), (4, 4)]:
        put(x, 1, z, "minecraft:grass_block", {"snowy": "false"})
    for x, z in [(6, 5), (6, 6), (7, 5)]:
        put(x, 1, z, "minecraft:gravel")
    for x, z in [(1, 4), (4, 7)]:
        put(x, 1, z, "minecraft:stone")
    # a two-block spring (infinite water source)
    for x, z in [(5, 2), (6, 2)]:
        put(x, 1, z, "minecraft:water", {"level": "0"})

    # ruined NCP kiosk
    put(2, 2, 6, "minecraft:stone_bricks")
    put(3, 2, 6, "minecraft:cracked_stone_bricks")
    put(2, 2, 5, "minecraft:cracked_stone_bricks")
    put(2, 3, 6, "minecraft:cracked_stone_bricks")
    put(3, 2, 5, "minecraft:iron_bars",
        {"east": "false", "north": "false", "south": "false", "west": "false", "waterlogged": "false"})
    put(2, 4, 6, "minecraft:lantern", {"hanging": "false", "waterlogged": "false"})
    # the kiosk's old campfire, still burning: warmth, and a way to boil water
    put(4, 2, 6, "minecraft:campfire",
        {"facing": "north", "lit": "true", "signal_fire": "false", "waterlogged": "false"})

    # a dead tree (two logs = your first wood) and a dead bush
    put(5, 2, 5, "minecraft:oak_log", {"axis": "y"})
    put(5, 3, 5, "minecraft:oak_log", {"axis": "y"})
    put(1, 2, 3, "minecraft:dead_bush")

    palette, index, block_list = [], {}, []
    for (x, y, z), (name, props) in sorted(blocks.items()):
        key = (name, tuple(sorted(props.items())))
        if key not in index:
            entry = {"Name": name}
            if props:
                entry["Properties"] = dict(props)
            index[key] = len(palette)
            palette.append(entry)
        block_list.append({"pos": [Int(x), Int(y), Int(z)], "state": Int(index[key])})

    return {
        "DataVersion": Int(DATA_VERSION),
        "size": [Int(9), Int(5), Int(9)],
        "palette": palette,
        "blocks": block_list,
        "entities": [],
    }


def stargate_ruin():
    """A ruined NCP gate site on Glacio: cracked platform, a broken naquadah ring, and a chest
    holding the first Stargate. 11 x 9 x 5 (x, y, z)."""
    blocks = {}

    def put(x, y, z, name, props=None, nbt=None):
        blocks[(x, y, z)] = (name, props or {}, nbt)

    # platform (y=0): cut naquadah with cracked gaps of glacio cobblestone
    for x in range(11):
        for z in range(5):
            name = "sgjourney:cut_naquadah_block" if (x * 7 + z * 3) % 5 else "ad_astra:glacio_cobblestone"
            put(x, 0, z, name)
    # broken ring in the x-y plane at z=2, centre (5, 4), radius 4; about a third is missing
    for x in range(11):
        for y in range(1, 9):
            d = ((x - 5) ** 2 + (y - 4) ** 2) ** 0.5
            if 3.5 <= d <= 4.5 and not (x >= 7 and y >= 4) and not (x == 1 and y == 6):
                put(x, y, 2, "sgjourney:naquadah_block")
    # fallen ring pieces on the platform
    for x, z in [(8, 1), (9, 3), (8, 4)]:
        put(x, 1, z, "sgjourney:naquadah_block")
    # the chest, under the ring
    items = [
        {"Slot": Byte(0), "id": "sgjourney:classic_stargate", "Count": Byte(1)},
        {"Slot": Byte(1), "id": "sgjourney:classic_dhd", "Count": Byte(1)},
        {"Slot": Byte(4), "id": "sgjourney:raw_naquadah", "Count": Byte(16)},
    ]
    put(5, 1, 0, "minecraft:chest", {"facing": "north", "type": "single", "waterlogged": "false"},
        {"id": "minecraft:chest", "Items": items})

    palette, index, block_list = [], {}, []
    for (x, y, z), (name, props, nbt) in sorted(blocks.items()):
        key = (name, tuple(sorted(props.items())))
        if key not in index:
            entry = {"Name": name}
            if props:
                entry["Properties"] = dict(props)
            index[key] = len(palette)
            palette.append(entry)
        entry = {"pos": [Int(x), Int(y), Int(z)], "state": Int(index[key])}
        if nbt:
            entry["nbt"] = nbt
        block_list.append(entry)
    return {"DataVersion": Int(DATA_VERSION), "size": [Int(11), Int(9), Int(5)],
            "palette": palette, "blocks": block_list, "entities": []}


# --------------------------------------------------------------------------- PNG writer
def write_png(path, pixels):
    """pixels: list of rows, each a list of (r, g, b, a)."""
    h, w = len(pixels), len(pixels[0])
    raw = b"".join(b"\x00" + bytes(c for px in row for c in px) for row in pixels)

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)


def scrip_texture():
    """A teal company ticket with a gold stripe. Placeholder until real art."""
    clear = (0, 0, 0, 0)
    edge = (22, 92, 86, 255)
    body = (47, 163, 154, 255)
    light = (120, 214, 204, 255)
    gold = (232, 190, 74, 255)
    px = [[clear] * 16 for _ in range(16)]
    for y in range(4, 12):
        for x in range(1, 15):
            border = y in (4, 11) or x in (1, 14)
            px[y][x] = edge if border else body
    for x in range(2, 14):
        px[7][x] = gold
        px[8][x] = gold
    for x, y in [(3, 5), (4, 5), (3, 6)]:  # highlight
        px[y][x] = light
    for y in (5, 10):  # punched holes
        px[y][12] = edge
    return px


def hammer_texture():
    """A crude stone hammer on a wooden handle. Placeholder until real art."""
    clear = (0, 0, 0, 0)
    stone_d = (88, 88, 92, 255)
    stone = (128, 128, 134, 255)
    stone_l = (168, 168, 174, 255)
    wood_d = (92, 62, 32, 255)
    wood = (138, 98, 54, 255)
    px = [[clear] * 16 for _ in range(16)]
    # head: a block from (7,1) to (14,6)
    for y in range(1, 7):
        for x in range(7, 15):
            edge = y in (1, 6) or x in (7, 14)
            px[y][x] = stone_d if edge else stone
    for x, y in [(8, 2), (9, 2), (8, 3)]:
        px[y][x] = stone_l
    # handle: a diagonal from the head down to the lower left
    for i in range(9):
        x, y = 10 - i, 7 + i
        if 0 <= x < 16 and 0 <= y < 16:
            px[y][x] = wood
            if x + 1 < 16:
                px[y][x + 1] = wood_d
    return px


def dust_texture():
    """Fine pale dust (the step after sand). Deterministic speckle, placeholder art."""
    base = [(214, 204, 178, 255), (200, 190, 162, 255), (226, 218, 194, 255), (188, 178, 150, 255)]
    px = []
    seed = 1234567
    for y in range(16):
        row = []
        for x in range(16):
            seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
            row.append(base[(seed >> 16) % len(base)])
        px.append(row)
    return px


def stratum_texture():
    """Grayscale grit pile; tinted per stratum by KubeJS item color."""
    clear = (0, 0, 0, 0)
    shades = [(150, 150, 150, 255), (190, 190, 190, 255), (225, 225, 225, 255), (120, 120, 120, 255)]
    px = [[clear] * 16 for _ in range(16)]
    seed = 424242
    for y in range(5, 14):
        half = int((y - 4) * 0.9) + 2
        for x in range(8 - half, 8 + half):
            if 0 <= x < 16:
                seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF
                px[y][x] = shades[(seed >> 16) % len(shades)]
    return px


def core_texture():
    """A faceted positronic crystal in a frame; grayscale, tinted per tier."""
    clear = (0, 0, 0, 0)
    frame = (70, 70, 80, 255)
    dark = (140, 140, 150, 255)
    mid = (200, 200, 210, 255)
    light = (250, 250, 255, 255)
    px = [[clear] * 16 for _ in range(16)]
    for y in range(16):
        for x in range(16):
            d = abs(x - 7.5) + abs(y - 7.5)
            if d <= 6.5:
                px[y][x] = mid if d > 3 else light
            if 6.5 < d <= 7.5:
                px[y][x] = frame
    for x, y in [(5, 5), (6, 5), (5, 6), (10, 10), (9, 10)]:
        px[y][x] = dark
    return px


def card_texture():
    """An access card with a chip and a stripe; grayscale, tinted per level."""
    clear = (0, 0, 0, 0)
    edge = (90, 90, 95, 255)
    body = (210, 210, 215, 255)
    stripe = (120, 120, 125, 255)
    chip = (235, 200, 90, 255)
    px = [[clear] * 16 for _ in range(16)]
    for y in range(3, 13):
        for x in range(1, 15):
            px[y][x] = edge if (y in (3, 12) or x in (1, 14)) else body
    for x in range(2, 14):
        px[10][x] = stripe
    for y in range(5, 8):
        for x in range(3, 6):
            px[y][x] = chip
    return px


def bowl_texture(fill_colors):
    """A wooden bowl seen from the side, filled with a soup or salad."""
    clear = (0, 0, 0, 0)
    wood_d = (92, 62, 32, 255)
    wood = (139, 97, 52, 255)
    px = [[clear] * 16 for _ in range(16)]
    # contents: a mound above the rim
    for y in range(6, 10):
        for x in range(3, 13):
            if y == 6 and x in (3, 12):
                continue
            px[y][x] = fill_colors[(x * 3 + y) % len(fill_colors)]
    # bowl body: rim at y=9..10, narrowing to the base
    for y, (a, b) in zip(range(9, 14), [(2, 13), (2, 13), (3, 12), (4, 11), (5, 10)]):
        for x in range(a, b + 1):
            px[y][x] = wood_d if x in (a, b) or y == 13 else wood
    return px


def sandwich_texture():
    """Two slices of bread with greens and tomato between them."""
    clear = (0, 0, 0, 0)
    crust = (156, 98, 42, 255)
    bread = (222, 182, 110, 255)
    green = (92, 168, 64, 255)
    red = (200, 52, 40, 255)
    px = [[clear] * 16 for _ in range(16)]
    for y, row in [(4, crust), (5, bread), (6, bread), (7, green), (8, red), (9, green), (10, bread), (11, bread), (12, crust)]:
        for x in range(2, 14):
            px[y][x] = crust if x in (2, 13) else row
    return px


if __name__ == "__main__":
    ruin = os.path.join(ROOT, "kubejs", "data", "positronics", "structures", "stargate_ruin.nbt")
    write_nbt(ruin, stargate_ruin())
    print("wrote", os.path.relpath(ruin, ROOT))
    tex = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "item")
    write_png(os.path.join(tex, "garden_salad.png"), bowl_texture([(92, 168, 64, 255), (126, 196, 82, 255), (200, 52, 40, 255), (70, 140, 50, 255)]))
    write_png(os.path.join(tex, "vegetable_broth.png"), bowl_texture([(214, 120, 48, 255), (232, 150, 70, 255), (196, 100, 40, 255), (120, 170, 70, 255)]))
    write_png(os.path.join(tex, "garden_sandwich.png"), sandwich_texture())
    print("wrote food textures")
    for name, fn in [("stratum", stratum_texture), ("positronic_core", core_texture), ("clearance_card", card_texture)]:
        write_png(os.path.join(tex, name + ".png"), fn())
        print("wrote", f"kubejs/assets/positronics/textures/item/{name}.png")
    dust_path = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "block", "dust.png")
    write_png(dust_path, dust_texture())
    print("wrote", os.path.relpath(dust_path, ROOT))
    hammer_path = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "item", "reclamation_hammer.png")
    write_png(hammer_path, hammer_texture())
    print("wrote", os.path.relpath(hammer_path, ROOT))
    nbt_path = os.path.join(ROOT, "config", "skyblockbuilder", "templates", "waste_lands.nbt")
    write_nbt(nbt_path, island())
    png_path = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "item", "ncp_scrip.png")
    write_png(png_path, scrip_texture())
    print("wrote", os.path.relpath(nbt_path, ROOT))
    print("wrote", os.path.relpath(png_path, ROOT))
