"""Positronics quest generator.

Reads the chapter definitions in tools/data/quests.py and writes one FTB Quests chapter file per
chapter into config/ftbquests/quests/chapters/. Every task/reward item is validated against
tools/data/known_items.json (the registry dump from tools/server-test.ps1); unknown items are
reported and the run fails, so a quest can never point at an item that doesn't exist.

Quest IDs are stable hashes of chapter + quest key, so regenerating keeps player progress.
Layout: x = dependency depth, y = spread within the same depth (main line first).

Run:  python -I tools/make_quests.py
"""
import hashlib
import importlib.util
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "config", "ftbquests", "quests", "chapters")


def qid(*parts):
    return hashlib.sha1("/".join(parts).encode()).hexdigest()[:16].upper()


def s(text):
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def load_data():
    spec = importlib.util.spec_from_file_location("quests", os.path.join(ROOT, "tools", "data", "quests.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    data = load_data()
    known = set(json.load(open(os.path.join(ROOT, "tools", "data", "known_items.json"), encoding="utf-8"))["items"])
    unknown = []

    def check(item, where):
        if item not in known:
            unknown.append(f"{where}: {item}")

    for ci, ch in enumerate(data.CHAPTERS):
        cid = ch["id"]
        quests = ch["quests"]
        keys = {q["key"] for q in quests}

        # depth layout
        depth = {}

        def d(k):
            if k in depth:
                return depth[k]
            q = next(q for q in quests if q["key"] == k)
            local = [x for x in q.get("deps", []) if x in keys]
            depth[k] = 0 if not local else 1 + max(d(x) for x in local)
            return depth[k]

        for q in quests:
            d(q["key"])
        rows = {}
        pos = {}
        for q in quests:
            col = depth[q["key"]]
            n = rows.get(col, 0)
            rows[col] = n + 1
            y = (n + 1) // 2 * (1 if n % 2 else -1) * 1.5  # 0, +1.5, -1.5, +3, -3 ...
            pos[q["key"]] = (col * 2.0, y)

        lines = ["{", "\tdefault_hide_dependency_lines: false", '\tdefault_quest_shape: ""',
                 f"\tfilename: {s(ch['filename'])}", '\tgroup: ""', f"\ticon: {s(ch['icon'])}",
                 f"\tid: {s(qid(cid))}", f"\torder_index: {ch['order']}", "\tquest_links: [ ]", "\tquests: ["]
        check(ch["icon"], f"{cid} icon")
        for q in quests:
            k = q["key"]
            deps = [qid(cid, x) for x in q.get("deps", []) if x in keys]
            deps += [qid(*x.split(":")) for x in q.get("deps", []) if ":" in x]  # cross-chapter "chapter:key"
            deps += list(q.get("external_deps", []))
            lines.append("\t\t{")
            if deps:
                lines.append("\t\t\tdependencies: [" + " ".join(s(x) for x in deps) + "]")
            lines.append("\t\t\tdescription: [")
            for line in q.get("desc", []):
                lines.append("\t\t\t\t" + s(line))
            lines.append("\t\t\t]")
            if q.get("icon"):
                check(q["icon"], f"{cid}/{k} icon")
                lines.append(f"\t\t\ticon: {s(q['icon'])}")
            lines.append(f"\t\t\tid: {s(qid(cid, k))}")
            rewards = []
            scrip = q.get("scrip", ch.get("scrip", 2))
            if scrip:
                rewards.append(("positronics:ncp_scrip", scrip))
            rewards += [(r, 1) if isinstance(r, str) else tuple(r) for r in q.get("rewards", [])]
            if rewards:
                lines.append("\t\t\trewards: [")
                for i, (item, count) in enumerate(rewards):
                    check(item, f"{cid}/{k} reward")
                    lines.append("\t\t\t\t{")
                    if count > 1:
                        lines.append(f"\t\t\t\t\tcount: {count}")
                    lines.append(f"\t\t\t\t\tid: {s(qid(cid, k, 'reward', str(i)))}")
                    lines.append(f"\t\t\t\t\titem: {s(item)}")
                    lines.append('\t\t\t\t\ttype: "item"')
                    lines.append("\t\t\t\t}")
                lines.append("\t\t\t]")
            if q.get("shape"):
                lines.append(f"\t\t\tshape: {s(q['shape'])}")
            if q.get("size"):
                lines.append(f"\t\t\tsize: {q['size']:.1f}d")
            if q.get("subtitle"):
                lines.append(f"\t\t\tsubtitle: {s(q['subtitle'])}")
            lines.append("\t\t\ttasks: [")
            for i, t in enumerate(q["tasks"]):
                lines.append("\t\t\t\t{")
                tid = s(qid(cid, k, "task", str(i)))
                if t == "check":
                    lines.append(f"\t\t\t\t\tid: {tid}")
                    lines.append(f"\t\t\t\t\ttitle: {s(q.get('check_title', 'Understood'))}")
                    lines.append('\t\t\t\t\ttype: "checkmark"')
                else:
                    item, count = (t, 1) if isinstance(t, str) else t
                    check(item, f"{cid}/{k} task")
                    if count > 1:
                        lines.append(f"\t\t\t\t\tcount: {count}L")
                    lines.append(f"\t\t\t\t\tid: {tid}")
                    lines.append(f"\t\t\t\t\titem: {s(item)}")
                    lines.append('\t\t\t\t\ttype: "item"')
                lines.append("\t\t\t\t}")
            lines.append("\t\t\t]")
            lines.append(f"\t\t\ttitle: {s(q['title'])}")
            x, y = pos[k]
            lines.append(f"\t\t\tx: {x:.1f}d")
            lines.append(f"\t\t\ty: {y:.1f}d")
            lines.append("\t\t}")
        lines += ["\t]", f"\ttitle: {s(ch['title'])}", "}", ""]

        path = os.path.join(OUT, ch["filename"] + ".snbt")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write("\n".join(lines))
        print(f"wrote {ch['filename']}.snbt: {len(quests)} quests")

    if unknown:
        print(f"\n{len(unknown)} UNKNOWN ITEMS:")
        for u in unknown:
            print("  ", u)
        return 1
    print("all quest items valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
