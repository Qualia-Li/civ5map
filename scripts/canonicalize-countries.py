#!/usr/bin/env python3
"""Rewrite the `country: '...'` field in every by-type file so the ranking
panel doesn't double-count things like 'Turkey' vs 'Türkiye',
'England' vs 'United Kingdom', or 'Ptolemaic Egypt' vs 'Egypt'.

The `civ` field is left untouched — it carries the Civ V / historical civ name
that's useful context in the UI."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BY_TYPE = os.path.join(ROOT, "data", "by-type")

# Map historical/political/abbreviated country names -> modern-border canonical.
ALIASES = {
    # Anglosphere shorthand
    "USA": "United States",
    "U.S.A.": "United States",
    "U.S.": "United States",
    "America": "United States",
    "UK": "United Kingdom",
    "U.K.": "United Kingdom",
    "Great Britain": "United Kingdom",
    "Britain": "United Kingdom",
    "England": "United Kingdom",
    "Scotland": "United Kingdom",
    "Wales": "United Kingdom",
    "Northern Ireland": "United Kingdom",
    "British Empire": "United Kingdom",
    # Turkey: prefer the official modern name
    "Turkey": "Türkiye",
    "Ottoman Empire": "Türkiye",
    "Byzantine Empire": "Türkiye",
    "Byzantium": "Türkiye",
    # Russia
    "Soviet Union": "Russia",
    "USSR": "Russia",
    "U.S.S.R.": "Russia",
    "Russian Empire": "Russia",
    "Russian Federation": "Russia",
    # Strip historical-period adjectives
    "Ancient Greece": "Greece",
    "Classical Greece": "Greece",
    "Hellenistic Greece": "Greece",
    "Mycenaean Greece": "Greece",
    "Ptolemaic Egypt": "Egypt",
    "Hellenistic Egypt": "Egypt",
    "Roman Egypt": "Egypt",
    "Ancient Egypt": "Egypt",
    "Han China": "China",
    "Tang China": "China",
    "Song China": "China",
    "Ming China": "China",
    "Qing China": "China",
    "Yuan China": "China",
    "Sui China": "China",
    "Qin China": "China",
    "Imperial China": "China",
    "Ancient China": "China",
    "Mughal India": "India",
    "Mauryan India": "India",
    "Gupta India": "India",
    "Vedic India": "India",
    "Roman Italy": "Italy",
    "Roman Empire": "Italy",
    "Roman Republic": "Italy",
    "Ancient Rome": "Italy",
    "Carthaginian Empire": "Tunisia",
    "Phoenicia": "Lebanon",
    "Sassanid Persia": "Iran",
    "Achaemenid Persia": "Iran",
    "Safavid Persia": "Iran",
    "Persia": "Iran",
    "Babylonia": "Iraq",
    "Mesopotamia": "Iraq",
    "Sumer": "Iraq",
    "Akkad": "Iraq",
    "Assyria": "Iraq",
    # Misc shorthand
    "USSR/Russia": "Russia",
}

COUNTRY_LINE_RX = re.compile(r"^(\s*country:\s*)(['\"])(.+?)\2", re.M)


def canonicalize(piece: str) -> str:
    p = piece.strip()
    return ALIASES.get(p, p)


def rewrite(path: str) -> int:
    src = open(path, encoding="utf-8").read()
    changed = [0]

    def repl(m):
        indent, quote, raw = m.group(1), m.group(2), m.group(3)
        # The value may be a slash/comma-joined list ("Italy/France") — apply
        # canonicalization per piece and dedupe while preserving order.
        pieces = [s.strip() for s in re.split(r"[/,;]| and ", raw) if s.strip()]
        canon, seen = [], set()
        for p in pieces:
            c = canonicalize(p)
            if c not in seen:
                seen.add(c)
                canon.append(c)
        joined = "/".join(canon)
        if joined != raw:
            changed[0] += 1
        safe = joined.replace(quote, "\\" + quote)
        return f"{indent}{quote}{safe}{quote}"

    src2 = COUNTRY_LINE_RX.sub(repl, src)
    if src2 != src:
        open(path, "w", encoding="utf-8").write(src2)
    return changed[0]


def audit_after():
    counts = {}
    for f in sorted(os.listdir(BY_TYPE)):
        if not f.endswith(".ts"):
            continue
        txt = open(os.path.join(BY_TYPE, f)).read()
        for c in re.findall(r"country:\s*['\"]([^'\"]+)['\"]", txt):
            for piece in re.split(r"[/,;]| and ", c):
                piece = piece.strip()
                if piece:
                    counts[piece] = counts.get(piece, 0) + 1
    print("\n=== Post-rewrite country distribution ===")
    for k, v in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"{v:3d}  {k}")


def main():
    total = 0
    for f in sorted(os.listdir(BY_TYPE)):
        if not f.endswith(".ts"):
            continue
        n = rewrite(os.path.join(BY_TYPE, f))
        if n:
            print(f"  {f}: rewrote {n} country fields")
        total += n
    print(f"Total: {total} country fields rewritten")
    audit_after()


if __name__ == "__main__":
    main()
