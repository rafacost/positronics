"""Pull in-game quest-editor changes for a generated chapter back into the repo.

The generated chapters (make_quests.py) give every quest a hashed id. When a quest is re-created in the
in-game editor it gets a new id, and the world's progress follows that new id. This tool reads the
instance's saved chapter and records, per quest key (matched by title):
  - ids (quest, tasks, rewards) that differ from the hash  -> tools/data/quest_overrides.json "ids"
  - the quest's position                                  -> tools/data/quest_overrides.json "pos"
and prints dependency differences, which belong in tools/data/quests.py ("deps").

Usage: python tools/pull_quests.py <chapter_id> [instance_dir]
"""
import importlib.util
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OVR = os.path.join(ROOT, "tools", "data", "quest_overrides.json")
sys.path.insert(0, os.path.join(ROOT, "tools"))
import make_quests  # noqa: E402


def blocks(text, start_token):
    """Top-level {...} blocks inside the list that starts at start_token."""
    i = text.index(start_token) + len(start_token)
    depth, start, out = 0, None, []
    for m in re.finditer(r'"(?:[^"\\]|\\.)*"|[{}\[\]]', text[i:]):
        c = m.group()
        if c.startswith('"'):
            continue
        if c in "{[":
            if depth == 0 and c == "{":
                start = m.start()
            depth += 1
        else:
            depth -= 1
            if depth < 0:
                break
            if depth == 0 and c == "}" and start is not None:
                out.append(text[i + start:i + m.end()])
                start = None
    return out


def field(block, key, tabs):
    m = re.search(r"^" + "\t" * tabs + key + r": (.+)$", block, re.M)
    return m.group(1) if m else None


def sub_ids(block, key):
    """ids of the entries in a quest's tasks/rewards list, in order."""
    if f"\t\t\t{key}: [" not in block:
        return []
    return [re.search(r'\bid: "([0-9A-F]+)"', b).group(1) for b in blocks(block, f"\t\t\t{key}: [")]


def unquote(v):
    return json.loads(v) if v and v.startswith('"') else v


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    ids_only = "--ids-only" in sys.argv   # keep the generator's auto-layout (chapters nobody moved by hand)
    cid = args[0]
    inst = args[1] if len(args) > 1 else r"D:\Minecraft\Instances\Positronics Dev"
    data = make_quests.load_data()
    ch = next(c for c in data.CHAPTERS if c["id"] == cid)
    path = os.path.join(inst, "config", "ftbquests", "quests", "chapters", ch["filename"] + ".snbt")
    text = open(path, encoding="utf-8").read().replace("\r", "")
    saved = {}
    for b in blocks(text, "\tquests: ["):
        saved[unquote(field(b, "title", 3))] = b

    ovr = json.load(open(OVR, encoding="utf-8")) if os.path.exists(OVR) else {"ids": {}, "pos": {}}
    chapter_id = unquote(field(text, "id", 1))
    if chapter_id != make_quests.hash_id(cid):
        ovr["ids"][cid] = chapter_id
    else:
        ovr["ids"].pop(cid, None)
    by_id = {}
    for q in ch["quests"]:
        b = saved.get(q["title"])
        if b:
            by_id[unquote(field(b, "id", 3))] = q["key"]
    for q in ch["quests"]:
        k, b = q["key"], saved.get(q["title"])
        if not b:
            print(f"not in saved chapter: {k} ({q['title']})")
            continue
        base = f"{cid}/{k}"
        found = {base: unquote(field(b, "id", 3))}
        for i, t in enumerate(sub_ids(b, "tasks")):
            found[f"{base}/task/{i}"] = t
        for i, r in enumerate(sub_ids(b, "rewards")):
            found[f"{base}/reward/{i}"] = r
        for key, val in found.items():
            if val != make_quests.hash_id(*key.split("/")):
                ovr["ids"][key] = val
            else:
                ovr["ids"].pop(key, None)
        if not ids_only:
            ovr["pos"][base] = [float(field(b, "x", 3).rstrip("d")), float(field(b, "y", 3).rstrip("d"))]
        m = re.search(r"^			dependencies: \[(.*?)\]", b, re.M | re.S)
        deps_line = m.group(1) if m else ""
        deps = sorted(by_id.get(x, x) for x in re.findall(r'"([0-9A-F]+)"', deps_line))
        want = sorted(x for x in q.get("deps", []) if ":" not in x)
        ext = sorted(q.get("external_deps", []))
        if deps != sorted(want + ext) and not ids_only:
            print(f"deps {k}: quests.py {want + ext} -> saved {deps}")
    with open(OVR, "w", encoding="utf-8", newline="\n") as f:
        json.dump(ovr, f, indent=1, sort_keys=True)
        f.write("\n")
    print(f"updated {OVR}")


if __name__ == "__main__":
    main()
