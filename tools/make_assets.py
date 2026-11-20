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


def _name(buf, name):
    raw = name.encode("utf-8")
    buf.write(struct.pack(">H", len(raw)))
    buf.write(raw)


def _type(value):
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
    if t == TAG_INT:
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


if __name__ == "__main__":
    nbt_path = os.path.join(ROOT, "config", "skyblockbuilder", "templates", "waste_lands.nbt")
    write_nbt(nbt_path, island())
    png_path = os.path.join(ROOT, "kubejs", "assets", "positronics", "textures", "item", "ncp_scrip.png")
    write_png(png_path, scrip_texture())
    print("wrote", os.path.relpath(nbt_path, ROOT))
    print("wrote", os.path.relpath(png_path, ROOT))
