#!/usr/bin/env python3
"""Rewrite data/by-type/*.ts in place so every birth/work/death.name uses the
canonical city form (no '(traditional)' / '(Han capital)' / ', Province' tails),
and audit the whole dataset for overlapping/repetitive person entries.
"""
import os, re, sys, json
from collections import defaultdict, Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BY_TYPE_DIR = os.path.join(ROOT, "data", "by-type")

# MANUALLY MIRRORED from data/city-aliases.ts CITY_ALIASES (subset; keys lowercased).
# IMPORTANT: this is a hand-maintained subset, NOT a complete clone. The TS file
# is the source of truth used at runtime; this Python copy only needs entries
# that you want applied as one-time rewrites to the .ts data files. If a city
# alias is only here for runtime aggregation (and never appears in the raw
# data) it doesn't need to be added below.
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
    "new york":"New York City","nyc":"New York City",
    "manhattan":"New York City","brooklyn":"New York City",
    "queens":"New York City","bronx":"New York City","the bronx":"New York City",
    "staten island":"New York City","greenwich village":"New York City",
    "harlem":"New York City","murray hill":"New York City",
    # Greater London / Paris
    "westminster":"London","kensington":"London","highgate":"London",
    "hampstead":"London","chelsea":"London","southwark":"London",
    "lambeth":"London","greenwich":"London",
    "neuilly-sur-seine":"Paris","saint-denis":"Paris","passy":"Paris",
    "montmartre":"Paris","arcueil":"Paris",
}

PAREN_RX = re.compile(r"\s*\([^)]*\)\s*$")

# When a place name canonicalizes to one of these (i.e. we've folded multiple
# sub-locations into a single city), also snap its [lat, lng] to the city
# centroid so map buckets/halos collapse to ONE spot instead of one per
# original borough/suburb. Skip this for cities that aren't aggregation
# targets — we don't want to move precise coords around unnecessarily.
CITY_CENTROIDS = {
    "New York City":   [40.7128, -74.0060],
    "London":          [51.5074, -0.1278],
    "Paris":           [48.8566,   2.3522],
    "Tokyo":           [35.6762, 139.6503],
    "Kyoto":           [35.0116, 135.7681],
    "Seoul":           [37.5665, 126.9780],
    "Beijing":         [39.9042, 116.4074],
    "Nanjing":         [32.0603, 118.7969],
    "Chang'an":        [34.3416, 108.9398],
    "Suzhou":          [31.2989, 120.5853],
    "Kaifeng":         [34.7973, 114.3076],
    "Hangzhou":        [30.2741, 120.1551],
    "Guangzhou":       [23.1291, 113.2644],
    "Mumbai":          [19.0760,  72.8777],
    "Chennai":         [13.0827,  80.2707],
    "Kolkata":         [22.5726,  88.3639],
    "Bengaluru":       [12.9716,  77.5946],
    "Delhi":           [28.6139,  77.2090],
    "Patna":           [25.5941,  85.1376],
    "Varanasi":        [25.3176,  82.9739],
    "Istanbul":        [41.0082,  28.9784],
    "Izmir":           [38.4192,  27.1287],
    "Antakya":         [36.2021,  36.1600],
    "Mexico City":     [19.4326, -99.1332],
    "Tehran":          [35.6892,  51.3890],
    "Bukhara":         [39.7747,  64.4286],
    "Ctesiphon":       [33.0858,  44.5803],
    "Saint Petersburg":[59.9311,  30.3609],
    "Volgograd":       [48.7080,  44.5133],
    "Yekaterinburg":   [56.8389,  60.6057],
    "Krasnodar":       [45.0355,  38.9753],
}



def canonical_city(raw: str) -> str:
    """Match data/city-aliases.ts canonicalCity() exactly."""
    no_paren = PAREN_RX.sub("", raw).strip()
    head = no_paren.split(",")[0].strip()
    lc_head = head.lower()
    lc_full = no_paren.lower()
    return ALIASES.get(lc_head) or ALIASES.get(lc_full) or head


# Match the whole `birth/work/death: { name: '...', coords: [..,..] }` block
# so we can rewrite both `name` and `coords` together.
PLACE_BLOCK_RX = re.compile(
    r"(birth|work|death)\s*:\s*\{\s*name\s*:\s*(['\"])(.+?)\2\s*,\s*coords\s*:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*\}",
    re.DOTALL,
)


def canonicalize_file(path: str) -> int:
    src = open(path, encoding="utf-8").read()
    changed = 0

    def repl(m):
        nonlocal changed
        kind, quote, name, lat, lng = m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)
        canon = canonical_city(name)
        new_coords = CITY_CENTROIDS.get(canon)
        new_lat = f"{new_coords[0]}" if new_coords else lat
        new_lng = f"{new_coords[1]}" if new_coords else lng
        if canon != name or new_lat != lat or new_lng != lng:
            changed += 1
        safe = canon.replace(quote, "\\" + quote)
        return f"{kind}: {{ name: {quote}{safe}{quote}, coords: [{new_lat}, {new_lng}] }}"

    src2 = PLACE_BLOCK_RX.sub(repl, src)
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
