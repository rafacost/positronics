"""Write the loading-screen tips (tools/data/tips.py) as Darkhax Tips JSON files.

Output: kubejs/assets/positronics/tips/<key>.json, one per tip. Old files that are no longer in tips.py are removed.
Run: python -I tools/make_tips.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from data.tips import TIPS, TITLE  # noqa: E402

OUT = os.path.join(ROOT, "kubejs", "assets", "positronics", "tips")


def text(s):
    return {"text": s.replace("&", "§")}


def main():
    os.makedirs(OUT, exist_ok=True)
    keep = set()
    for key, tip in TIPS.items():
        name = f"{key}.json"
        keep.add(name)
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as f:
            json.dump({"title": text(TITLE), "tip": text(tip)}, f, ensure_ascii=False, indent=2)
            f.write("\n")
    for name in os.listdir(OUT):
        if name.endswith(".json") and name not in keep:
            os.remove(os.path.join(OUT, name))
    print(f"wrote {len(TIPS)} tips to {OUT}")


if __name__ == "__main__":
    main()
