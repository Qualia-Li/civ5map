# Civ V Great People Atlas

An interactive Next.js + react-leaflet map of the **310 historical figures** that appear in Civilization V's Great Person name pools — grouped by type, era, civilization, and country, with the places they were born, worked, and died pinned on a world map.

## Coverage

All nine Civ V Great Person types:

| Type | Count |
|------|-------|
| Scientist | 54 |
| Engineer | 37 |
| Merchant | 38 |
| Writer | 25 |
| Artist | 21 |
| Musician | 18 |
| General | 54 |
| Admiral | 36 |
| Prophet | 27 |
| **Total** | **310** |

## Data sources

1. **Ground truth** (`data/ground-truth.json`): the canonical Civ V (Vanilla + Gods & Kings + Brave New World) Great Person name pools, scraped from the CivFanatics community list.
2. **Per-type bios** (`data/by-type/*.ts`): each name in the ground truth enriched with civilization, era, birth/work/death coordinates, notable works, and a one-line blurb. Generated in parallel by 9 OpenAI Codex CLI tasks, one per type.
3. **Curated extras** (`data/people.ts`): hand-written entries from before the Codex pass, retained as overrides where they were already present.

## Features

- World map with three markers per person — **birth** (ring), **work / lived** (filled), **died** (dark) — colored by Great Person type.
- Filter by **type**, **era**, **civilization / country**, and free-text search.
- Birth-year **timeline** spanning ~2700 BCE → 2025 CE.
- Detail panel listing each figure's notable works/products.
- Click any marker, list row, or timeline dot to focus and inspect.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Production build: `npm run build && npm start`.

## Notes on accuracy

For legendary or pre-historical figures (Moses, Abraham, Quetzalcoatl, Sun Tzu, etc.) we tag uncertain locations with `(traditional)` and use the most-commonly-cited site. Years before the Common Era are stored as **negative integers** (`born: -551` = 551 BCE).
