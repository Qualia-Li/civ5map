#!/usr/bin/env python3
"""Two surgical fixes to data/by-type/general.ts:

1) Remove the 5 entries that are actually Civ V LEADERS (not Great General
   name-pool entries): Alexander the Great, Napoleon Bonaparte, Genghis Khan,
   Saladin, George Washington. I added these by hand to ground-truth.json
   early on, mistaking historical fame for game-data presence.

2) Replace the worst battlefield-as-career `work` fields. Codex picked iconic
   battle sites for many generals, but `work` should be their primary career
   city / HQ — a battle is a one-day event, the question is "where did they
   actually live and command from". Below are the corrections (with the
   battle site moved nowhere — we just swap the coord to the career city).
"""
import re

PATH = "data/by-type/general.ts"

# Generals to delete entirely — they're Civ V civ leaders, not GG names.
DELETE = {"Alexander The Great", "Napoleon Bonaparte", "Genghis Khan",
          "Saladin", "George Washington"}

# (name) -> new (work_name, [lat, lng])
WORK_FIX = {
    "Leonidas":            ("Sparta",          [37.0755, 22.4297]),
    "Lysander":            ("Sparta",          [37.0755, 22.4297]),
    "Scipio Africanus":    ("Rome",            [41.9028, 12.4964]),
    "Hamilcar Barca":      ("Carthage",        [36.8529, 10.3230]),
    "Vercingetorix":       ("Gergovia",        [45.7200,  3.1200]),
    "Cao Cao":             ("Xuchang",         [34.0357, 113.8190]),
    "Zhuge Liang":         ("Chengdu",         [30.5728, 104.0668]),
    "Belisarius":          ("Istanbul",        [41.0082, 28.9784]),
    "Khaled Ibn Al Walid": ("Homs",            [34.7304, 36.7097]),
    "Charles Martel":      ("Aachen",          [50.7753,  6.0839]),
    "William The Conqueror":("Rouen",          [49.4431,  1.0993]),
    "Subutai":             ("Karakorum",       [47.1833, 102.8333]),
    "Pompey":              ("Rome",            [41.9028, 12.4964]),
    "Pyrrhus":             ("Ambracia",        [39.1602, 20.9852]),
    "Winfield Scott":      ("Washington, D.C.",[38.9072, -77.0369]),
    "Sitting Bull":        ("Standing Rock",   [46.0861,-100.6310]),
    "Spartacus":           ("Capua",           [41.0820, 14.2120]),
    "Johann Tserclaes":    ("Munich",          [48.1351, 11.5820]),
    "Wallenstein":         ("Prague",          [50.0755, 14.4378]),
    "Eugene Of Savoy":     ("Vienna",          [48.2082, 16.3738]),
    "Cromwell":            ("London",          [51.5074, -0.1278]),
    "Lord Nelson":         ("Portsmouth",      [50.8198, -1.0880]),
    "Robert E. Lee":       ("Richmond",        [37.5407, -77.4360]),
    "Isoroku Yamamoto":    ("Tokyo",           [35.6762,139.6503]),
    "Bernard Montgomery":  ("London",          [51.5074, -0.1278]),
    "Heinz Guderian":      ("Berlin",          [52.5200, 13.4050]),
    "Erwin Rommel":        ("Berlin",          [52.5200, 13.4050]),
    "Georgy Zhukov":       ("Moscow",          [55.7558, 37.6173]),
    "Epaminondas":         ("Thebes",          [38.3250, 23.3180]),
    "Maurice Of Nassau":   ("The Hague",       [52.0705,  4.3007]),
    "Hannibal Barca":      ("Carthage",        [36.8529, 10.3230]),
    "Julius Caesar":       ("Rome",            [41.9028, 12.4964]),
    "Patton":              ("Washington, D.C.",[38.9072, -77.0369]),  # in case name shorter
    "George S. Patton":    ("Washington, D.C.",[38.9072, -77.0369]),
}

src = open(PATH).read()

# 1. Delete the leader entries. Use a bracket-balanced search instead of
# regex — entries contain nested {…} blocks for birth/work/death.
def delete_entry(src: str, name: str) -> str:
    # Locate the entry block by its `name: '...'` line, then walk back to the
    # opening `  {` and forward to the matching `}` to find its bounds.
    name_pat = re.compile(r"name:\s*['\"]" + re.escape(name) + r"['\"]")
    m = name_pat.search(src)
    if not m:
        print(f"  WARN delete {name!r}: not found")
        return src
    # Walk back to the entry's opening brace
    i = src.rfind("{", 0, m.start())
    if i < 0: return src
    # Walk forward, counting braces, until we close out
    depth = 0
    j = i
    while j < len(src):
        if src[j] == "{": depth += 1
        elif src[j] == "}":
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    # Eat trailing comma + whitespace/newline
    while j < len(src) and src[j] in ",\n\r\t ":
        j += 1
    # Eat leading whitespace before the entry
    k = i
    while k > 0 and src[k-1] in " \t":
        k -= 1
    print(f"  deleted {name!r} ({j-i} chars)")
    return src[:k] + src[j:]

print("=== Deleting leader entries ===")
for n in DELETE:
    src = delete_entry(src, n)

# 2. Patch work fields — find the entry block bounds, then locate its work: { ... }.
def patch_work(src: str, name: str, work_name: str, coords: list) -> str:
    name_pat = re.compile(r"name:\s*['\"]" + re.escape(name) + r"['\"]")
    m = name_pat.search(src)
    if not m:
        print(f"  WARN patch {name!r}: not found")
        return src
    # Bounds of the entry block
    i = src.rfind("{", 0, m.start())
    depth = 0; j = i
    while j < len(src):
        if src[j] == "{": depth += 1
        elif src[j] == "}":
            depth -= 1
            if depth == 0: j += 1; break
        j += 1
    block = src[i:j]
    # Replace the work field's name + coords inside this block
    work_rx = re.compile(
        r"(work:\s*\{\s*name:\s*['\"])([^'\"]+)(['\"]\s*,\s*coords:\s*\[)([^\]]+)(\]\s*\})",
        re.DOTALL,
    )
    new_block, n = work_rx.subn(
        lambda mm: f'{mm.group(1)}{work_name}{mm.group(3)}{coords[0]}, {coords[1]}{mm.group(5)}',
        block, count=1,
    )
    if n == 0:
        print(f"  WARN patch {name!r}: no work field")
        return src
    print(f"  patched {name!r} -> {work_name}")
    return src[:i] + new_block + src[j:]

print("\n=== Patching battlefield-as-career work fields ===")
for n, (w, c) in WORK_FIX.items():
    if n in DELETE:
        continue  # already deleted
    src = patch_work(src, n, w, c)

open(PATH, "w").write(src)
print("\nDone.")
