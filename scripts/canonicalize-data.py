#!/usr/bin/env python3
"""Rewrite data/by-type/*.ts in place so every birth/work/death.name uses the
canonical city form (no '(traditional)' / '(Han capital)' / ', Province' tails),
and audit the whole dataset for overlapping/repetitive person entries.
"""
import os, re, sys, json
from collections import defaultdict, Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BY_TYPE_DIR = os.path.join(ROOT, "data", "by-type")

# Mirror data/city-aliases.ts CITY_ALIASES (subset; keys lowercased).
ALIASES = {
    # China
    "khanbaliq":"Beijing","dadu":"Beijing","yanjing":"Beijing","beiping":"Beijing",
    "peking":"Beijing","cambaluc":"Beijing",
    "jinling":"Nanjing","jianye":"Nanjing","jiankang":"Nanjing",
    "bianjing":"Kaifeng","bianliang":"Kaifeng",
    "lin'an":"Hangzhou","linan":"Hangzhou","qiantang":"Hangzhou",
    "xi'an":"Chang'an","xian":"Chang'an","chang an":"Chang'an","chang-an":"Chang'an",
    "gusu":"Suzhou","canton":"Guangzhou","amoy":"Xiamen",
    # Japan / Korea
    "edo":"Tokyo","musashi":"Tokyo","heian-kyo":"Kyoto","heian-kyō":"Kyoto","heian kyo":"Kyoto",
    "hanseong":"Seoul","hanyang":"Seoul",
    # India / South Asia
    "bombay":"Mumbai","madras":"Chennai","calcutta":"Kolkata","bangalore":"Bengaluru",
    "pataliputra":"Patna","kusumapura":"Patna",
    "indraprastha":"Delhi","shahjahanabad":"Delhi",
    "kashi":"Varanasi","banaras":"Varanasi","benares":"Varanasi",
    # SE Asia
    "saigon":"Ho Chi Minh City","batavia":"Jakarta","rangoon":"Yangon",
    # Mediterranean / Middle East
    "byzantium":"Istanbul","constantinople":"Istanbul","konstantinopolis":"Istanbul","tsargrad":"Istanbul",
    "smyrna":"Izmir","antioch":"Antakya","edessa":"Şanlıurfa",
    "nineveh":"Mosul","rhages":"Tehran","ray":"Tehran","rey":"Tehran",
    "afshana":"Bukhara","seleucia-ctesiphon":"Ctesiphon",
    "gundeshapur":"Dezful","thagaste":"Souk Ahras","hippo regius":"Annaba",
    "yerushalayim":"Jerusalem","akko":"Acre",
    # Greece / Italy
    "syrakousai":"Syracuse","neapolis":"Naples","napoli":"Naples","milano":"Milan",
    "padova":"Padua","firenze":"Florence","venezia":"Venice","roma":"Rome",
    # Russia
    "leningrad":"Saint Petersburg","petrograd":"Saint Petersburg",
    "st petersburg":"Saint Petersburg","st. petersburg":"Saint Petersburg",
    "stalingrad":"Volgograd","tsaritsyn":"Volgograd",
    "ekaterinburg":"Yekaterinburg","ekaterinodar":"Krasnodar",
    # France / Germany / Low Countries / Britain
    "lutetia":"Paris","lutetia parisiorum":"Paris","lyons":"Lyon","marseilles":"Marseille",
    "köln":"Cologne","koln":"Cologne","münchen":"Munich","muenchen":"Munich",
    "wien":"Vienna","praha":"Prague","warszawa":"Warsaw","krakow":"Kraków",
    "londinium":"London","eboracum":"York","nuremberg":"Nürnberg",
    # Americas
    "tenochtitlan":"Mexico City","tenochtitlán":"Mexico City",
    "ciudad de méxico":"Mexico City","new amsterdam":"New York City",
}

PAREN_RX = re.compile(r"\s*\([^)]*\)\s*$")


def canonical_city(raw: str) -> str:
    """Match data/city-aliases.ts canonicalCity() exactly."""
    no_paren = PAREN_RX.sub("", raw).strip()
    head = no_paren.split(",")[0].strip()
    lc_head = head.lower()
    lc_full = no_paren.lower()
    return ALIASES.get(lc_head) or ALIASES.get(lc_full) or head


# Match all `name: '...'` / `name: "..."` strings inside birth/work/death blocks.
PLACE_NAME_RX = re.compile(
    r"(birth|work|death)\s*:\s*\{\s*name\s*:\s*(['\"])(.+?)\2",
    re.DOTALL,
)


def canonicalize_file(path: str) -> int:
    src = open(path, encoding="utf-8").read()
    changed = 0

    def repl(m):
        nonlocal changed
        kind, quote, name = m.group(1), m.group(2), m.group(3)
        canon = canonical_city(name)
        if canon != name:
            changed += 1
        # Re-escape any single quotes in the canonical form when using ' quotes
        safe = canon.replace(quote, "\\" + quote)
        return f"{kind}: {{ name: {quote}{safe}{quote}"

    src2 = PLACE_NAME_RX.sub(repl, src)
    if src2 != src:
        open(path, "w", encoding="utf-8").write(src2)
    return changed


# Extract top-level person `name:` fields per file
PERSON_NAME_RX = re.compile(r"^\s{2}\{\s*\n\s+name:\s*['\"](.+?)['\"]", re.M)


def name_key(name: str) -> str:
    particles = {"van","von","de","del","della","di","da","ibn","al","el","the","of"}
    toks = [t for t in re.sub(r"[.,]", "", name.lower()).split() if t not in particles]
    if len(toks) <= 1:
        return "".join(toks)
    return toks[0] + ":" + toks[-1]


def audit(by_type):
    by_name = defaultdict(list)
    by_key  = defaultdict(list)
    for t, names in by_type.items():
        for n in names:
            by_name[n].append(t)
            by_key[name_key(n)].append((t, n))
    print(f"Total entries: {sum(len(v) for v in by_type.values())}")
    print(f"Unique names:  {len(by_name)}")
    print()
    exact = [(n, ts) for n, ts in by_name.items() if len(ts) > 1]
    print(f"Exact-name overlaps across types: {len(exact)}")
    for n, ts in exact:
        print(f"  {n}: {ts}")
    print()
    fuzzy = [(k, vs) for k, vs in by_key.items() if len(vs) > 1 and len({n for _,n in vs}) > 1]
    print(f"Fuzzy-name overlaps (last-name match, different spelling): {len(fuzzy)}")
    for k, vs in fuzzy:
        print(f"  {k}: {vs}")
    print()
    for t, names in by_type.items():
        c = Counter(names)
        dups = [(n, k) for n, k in c.items() if k > 1]
        if dups:
            print(f"Within-file duplicates in {t}.ts: {dups}")


def main():
    files = sorted(f for f in os.listdir(BY_TYPE_DIR) if f.endswith(".ts"))
    print("=== Canonicalizing place names ===")
    total_changes = 0
    for f in files:
        n = canonicalize_file(os.path.join(BY_TYPE_DIR, f))
        if n:
            print(f"  {f}: rewrote {n} place names")
        total_changes += n
    print(f"Total: {total_changes} place names canonicalized")
    print()
    print("=== Auditing for overlaps / repetitiveness ===")
    by_type = {}
    for f in files:
        t = f.replace(".ts", "")
        txt = open(os.path.join(BY_TYPE_DIR, f)).read()
        by_type[t] = PERSON_NAME_RX.findall(txt)
    audit(by_type)


if __name__ == "__main__":
    main()
