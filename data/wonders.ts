// The wonders of Civilization V (Vanilla + Gods & Kings + Brave New World),
// scraped from the CivFanatics/Fandom wonder lists, pinned to the real-world
// place that inspired each one.
//
//   World    — 48 great mega-buildings (one per game), e.g. the Pyramids.
//   National — 13 player-built civic buildings; only the ones with a clear
//              real-world namesake are given coordinates (the rest are
//              generic abstractions: National College, the Palace, etc.).
//   Natural  — 17 map features based on real geography (Mt. Fuji, Uluru, …).
//
// `status` records the fate of the real inspiration:
//   original      — still standing essentially as built  (Pyramids)
//   ruined        — survives only as ruins / destroyed    (Temple of Artemis)
//   reconstructed — rebuilt in modern times               (Porcelain Tower)
//   mythical      — never verifiably existed / legendary  (Hanging Gardens)
//
// A few wonders have no place a visitor can stand: orbital telescopes and
// virtual infrastructure. Those carry `note` and no `location`.

import type { Place } from "./people-types";

export type WonderCategory = "World" | "National" | "Natural" | "Unused";

export type WonderStatus = "original" | "ruined" | "reconstructed" | "mythical";

export type WonderEra =
  | "Ancient" | "Classical" | "Medieval" | "Renaissance"
  | "Industrial" | "Modern" | "Atomic" | "Information" | "Other";

export interface Wonder {
  name: string;
  category: WonderCategory;
  era?: WonderEra;          // World wonders are tiered by era
  civ?: string;             // real-world country the inspiration sits in
  status: WonderStatus;
  location?: Place;         // real-world inspiration; omitted if generic/unvisitable
  note?: string;            // why there is no location, when there isn't one
  visited?: boolean;        // the owner has stood at the real-world site
  blurb: string;
}

export const WONDER_CATEGORY_COLORS: Record<WonderCategory, string> = {
  World:    "#d4a85a", // gold
  National: "#5fbcd3", // teal
  Natural:  "#5fae6a", // green
  Unused:   "#8a8f9c", // slate — cut from the game
};

const RAW_WONDERS: Wonder[] = [
  // ───────────────────────── World Wonders ─────────────────────────
  {
    name: "Great Library", category: "World", era: "Ancient", civ: "Egypt", status: "ruined",
    location: { name: "Alexandria", coords: [31.2001, 29.9187] },
    blurb: "The legendary library of Alexandria, lost to fire and decline; its exact site is still debated.",
  },
  {
    name: "Mausoleum of Halicarnassus", category: "World", era: "Ancient", civ: "Turkey", status: "ruined",
    location: { name: "Bodrum", coords: [37.0379, 27.4241] },
    blurb: "Tomb of Mausolus and one of the Seven Wonders; toppled by medieval earthquakes, now a foundation.",
  },
  {
    name: "Pyramids", category: "World", era: "Ancient", civ: "Egypt", status: "original",
    location: { name: "Giza", coords: [29.9792, 31.1342] },
    blurb: "The Giza pyramid complex, the only ancient wonder still substantially intact after ~4,500 years.",
  },
  {
    name: "Statue of Zeus", category: "World", era: "Ancient", civ: "Greece", status: "ruined",
    location: { name: "Olympia", coords: [37.6383, 21.6300] },
    blurb: "Phidias' gold-and-ivory colossus of Zeus; lost in antiquity, only its workshop site survives.",
  },
  {
    name: "Stonehenge", category: "World", era: "Ancient", civ: "United Kingdom", status: "original",
    location: { name: "Amesbury", coords: [51.1789, -1.8262] },
    blurb: "The Neolithic standing-stone circle on Salisbury Plain, raised ~3000–2000 BCE.",
  },
  {
    name: "Temple of Artemis", category: "World", era: "Ancient", civ: "Turkey", status: "ruined",
    location: { name: "Ephesus", coords: [37.9497, 27.3639] },
    blurb: "The great Ionic temple at Ephesus; burned, rebuilt, and finally ruined — a single column remains.",
  },
  {
    name: "Colossus", category: "World", era: "Classical", civ: "Greece", status: "ruined",
    location: { name: "Rhodes", coords: [36.4510, 28.2278] },
    blurb: "A giant bronze Helios over the harbour of Rhodes, felled by an earthquake after just 54 years.",
  },
  {
    name: "Great Lighthouse", category: "World", era: "Classical", civ: "Egypt", status: "ruined",
    location: { name: "Alexandria (Pharos)", coords: [31.2139, 29.8856] },
    blurb: "The Pharos of Alexandria; for centuries the tallest structure on earth, destroyed by quakes.",
  },
  {
    name: "Great Wall", category: "World", era: "Classical", civ: "China", status: "original",
    location: { name: "Badaling", coords: [40.3587, 116.0169] },
    blurb: "The fortified frontier of China; its best-preserved Ming sections still snake across the hills.",
  },
  {
    name: "Hanging Gardens", category: "World", era: "Classical", civ: "Iraq", status: "mythical",
    location: { name: "Babylon", coords: [32.5364, 44.4209] },
    blurb: "The terraced gardens of Babylon — never archaeologically confirmed, possibly literary myth.",
  },
  {
    name: "Oracle", category: "World", era: "Classical", civ: "Greece", status: "ruined",
    location: { name: "Delphi", coords: [38.4824, 22.5010] },
    blurb: "The sanctuary of Apollo at Delphi, where the Pythia prophesied; now an excavated ruin.",
  },
  {
    name: "Parthenon", category: "World", era: "Classical", civ: "Greece", status: "original",
    location: { name: "Athens", coords: [37.9715, 23.7267] },
    blurb: "The 5th-century-BCE temple of Athena atop the Acropolis; the original still crowns the hill.",
  },
  {
    name: "Petra", category: "World", era: "Classical", civ: "Jordan", status: "original",
    location: { name: "Petra", coords: [30.3285, 35.4444] },
    blurb: "The Nabataean rock-cut city in southern Jordan, its facades carved straight into the cliffs.",
  },
  {
    name: "Terracotta Army", category: "World", era: "Classical", civ: "China", status: "original",
    location: { name: "Xi'an", coords: [34.3853, 109.2785] },
    blurb: "Thousands of clay soldiers guarding Qin Shi Huang's tomb, excavated near Xi'an from 1974.",
  },
  {
    name: "Alhambra", category: "World", era: "Medieval", civ: "Spain", status: "original",
    location: { name: "Granada", coords: [37.1761, -3.5881] },
    blurb: "The Nasrid palace-fortress above Granada, the high-water mark of Moorish Iberian architecture.",
  },
  {
    name: "Angkor Wat", category: "World", era: "Medieval", civ: "Cambodia", status: "original",
    location: { name: "Angkor", coords: [13.4125, 103.8670] },
    blurb: "The largest religious monument on earth, built by the Khmer Empire in the 12th century.",
  },
  {
    name: "Borobudur", category: "World", era: "Medieval", civ: "Indonesia", status: "original",
    location: { name: "Magelang", coords: [-7.6079, 110.2038] },
    blurb: "The 9th-century Mahayana Buddhist stupa-mountain in central Java, restored by UNESCO.",
  },
  {
    name: "Chichen Itza", category: "World", era: "Medieval", civ: "Mexico", status: "original",
    location: { name: "Yucatán", coords: [20.6843, -88.5678] },
    blurb: "The Maya-Toltec city dominated by the pyramid of El Castillo, in the Yucatán.",
  },
  {
    name: "Great Mosque of Djenne", category: "World", era: "Medieval", civ: "Mali", status: "reconstructed",
    location: { name: "Djenné", coords: [13.9054, -4.5552] },
    blurb: "The world's largest mud-brick building; the present structure was rebuilt in 1907.",
  },
  {
    name: "Hagia Sophia", category: "World", era: "Medieval", civ: "Turkey", status: "original",
    location: { name: "Istanbul", coords: [41.0086, 28.9802] },
    blurb: "Justinian's 6th-century domed basilica in Constantinople; later mosque, museum, and mosque again.",
  },
  {
    name: "Machu Picchu", category: "World", era: "Medieval", civ: "Peru", status: "original",
    location: { name: "Machu Picchu", coords: [-13.1631, -72.5450] },
    blurb: "The 15th-century Inca citadel on a ridge above the Urubamba, never found by the conquistadors.",
  },
  {
    name: "Notre Dame", category: "World", era: "Medieval", civ: "France", status: "original",
    location: { name: "Paris", coords: [48.8530, 2.3499] },
    blurb: "The Gothic cathedral on the Île de la Cité; its fire-lost spire was reconstructed by 2024.",
  },
  {
    name: "Forbidden Palace", category: "World", era: "Renaissance", civ: "China", status: "original",
    location: { name: "Beijing", coords: [39.9163, 116.3972] },
    blurb: "The Forbidden City, imperial palace of the Ming and Qing dynasties at the heart of Beijing.",
  },
  {
    name: "Globe Theatre", category: "World", era: "Renaissance", civ: "United Kingdom", status: "reconstructed",
    location: { name: "London", coords: [51.5081, -0.0972] },
    blurb: "Shakespeare's playhouse; the original burned in 1613, the riverside reconstruction opened in 1997.",
  },
  {
    name: "Himeji Castle", category: "World", era: "Renaissance", civ: "Japan", status: "original",
    location: { name: "Himeji", coords: [34.8394, 134.6939] },
    blurb: "The 'White Heron' castle, Japan's finest surviving original feudal-era fortress.",
  },
  {
    name: "Leaning Tower of Pisa", category: "World", era: "Renaissance", civ: "Italy", status: "original",
    location: { name: "Pisa", coords: [43.7230, 10.3966] },
    blurb: "The freestanding campanile of Pisa cathedral, tilting since construction began in 1173.",
  },
  {
    name: "Porcelain Tower", category: "World", era: "Renaissance", civ: "China", status: "reconstructed",
    location: { name: "Nanjing", coords: [32.0070, 118.7790] },
    blurb: "A Ming-dynasty porcelain pagoda destroyed in the 1850s and rebuilt nearby in 2015.",
  },
  {
    name: "Red Fort", category: "World", era: "Renaissance", civ: "India", status: "original",
    location: { name: "Delhi", coords: [28.6562, 77.2410] },
    blurb: "The Mughal sandstone citadel in Old Delhi, seat of emperors from Shah Jahan onward.",
  },
  {
    name: "Sistine Chapel", category: "World", era: "Renaissance", civ: "Vatican City", status: "original",
    location: { name: "Vatican City", coords: [41.9029, 12.4545] },
    blurb: "The papal chapel whose ceiling and Last Judgment were painted by Michelangelo.",
  },
  {
    name: "Taj Mahal", category: "World", era: "Renaissance", civ: "India", status: "original",
    location: { name: "Agra", coords: [27.1751, 78.0421] },
    blurb: "The white-marble mausoleum Shah Jahan raised for Mumtaz Mahal on the Yamuna.",
  },
  {
    name: "Uffizi", category: "World", era: "Renaissance", civ: "Italy", status: "original",
    location: { name: "Florence", coords: [43.7678, 11.2553] },
    blurb: "The Medici gallery in Florence, one of the oldest and greatest art museums in the world.",
  },
  {
    name: "Big Ben", category: "World", era: "Industrial", civ: "United Kingdom", status: "original",
    location: { name: "London", coords: [51.5007, -0.1246] },
    blurb: "The Elizabeth Tower clock of the Palace of Westminster, completed in 1859.",
  },
  {
    name: "Brandenburg Gate", category: "World", era: "Industrial", civ: "Germany", status: "original",
    location: { name: "Berlin", coords: [52.5163, 13.3777] },
    blurb: "Berlin's neoclassical triumphal gate of 1791; war-damaged and restored, now a symbol of reunion.",
  },
  {
    name: "Louvre", category: "World", era: "Industrial", civ: "France", status: "original",
    location: { name: "Paris", coords: [48.8606, 2.3376] },
    blurb: "The former royal palace on the Seine, the world's most-visited art museum since 1793.",
  },
  {
    name: "Broadway", category: "World", era: "Modern", civ: "United States", status: "original",
    location: { name: "New York City", coords: [40.7590, -73.9845] },
    blurb: "Manhattan's Theater District around Times Square, the home of American musical theatre.",
  },
  {
    name: "Eiffel Tower", category: "World", era: "Modern", civ: "France", status: "original",
    location: { name: "Paris", coords: [48.8584, 2.2945] },
    blurb: "Gustave Eiffel's wrought-iron tower for the 1889 World's Fair, now the icon of Paris.",
  },
  {
    name: "Kremlin", category: "World", era: "Modern", civ: "Russia", status: "original",
    location: { name: "Moscow", coords: [55.7520, 37.6175] },
    blurb: "The fortified complex at the heart of Moscow, seat of Russian power for over five centuries.",
  },
  {
    name: "Neuschwanstein", category: "World", era: "Modern", civ: "Germany", status: "original",
    location: { name: "Schwangau", coords: [47.5576, 10.7498] },
    blurb: "Ludwig II's fairytale castle in the Bavarian Alps, the model for Disney's storybook castle.",
  },
  {
    name: "Prora", category: "World", era: "Modern", civ: "Germany", status: "original",
    location: { name: "Rügen", coords: [54.4419, 13.5803] },
    blurb: "A 4.5-km Nazi-era seaside resort block on Rügen, never finished, now partly converted to flats.",
  },
  {
    name: "Statue of Liberty", category: "World", era: "Modern", civ: "United States", status: "original",
    location: { name: "New York City", coords: [40.6892, -74.0445] },
    blurb: "France's 1886 gift to the United States, standing on Liberty Island in New York Harbor.",
  },
  {
    name: "Cristo Redentor", category: "World", era: "Modern", civ: "Brazil", status: "original",
    location: { name: "Rio de Janeiro", coords: [-22.9519, -43.2105] },
    blurb: "The Art Deco statue of Christ the Redeemer atop Corcovado, completed in 1931.",
  },
  {
    name: "Great Firewall", category: "World", era: "Atomic", civ: "China", status: "original",
    note: "Virtual censorship infrastructure — no single physical site to visit.",
    blurb: "China's nationwide internet-filtering apparatus; a system of policy and hardware, not a building.",
  },
  {
    name: "Pentagon", category: "World", era: "Atomic", civ: "United States", status: "original",
    location: { name: "Arlington, VA", coords: [38.8719, -77.0563] },
    blurb: "The five-sided headquarters of the U.S. Department of Defense, completed in 1943.",
  },
  {
    name: "Sydney Opera House", category: "World", era: "Atomic", civ: "Australia", status: "original",
    location: { name: "Sydney", coords: [-33.8568, 151.2153] },
    blurb: "Jørn Utzon's shell-roofed performing-arts centre on Sydney Harbour, opened in 1973.",
  },
  {
    name: "CN Tower", category: "World", era: "Information", civ: "Canada", status: "original",
    location: { name: "Toronto", coords: [43.6426, -79.3871] },
    blurb: "Toronto's 553-m concrete communications tower, the tallest free-standing structure 1975–2007.",
  },
  {
    name: "Hubble Space Telescope", category: "World", era: "Information", civ: "United States", status: "original",
    note: "In low Earth orbit (~540 km up) — no visitable ground location. Launched from Kennedy Space Center.",
    blurb: "The orbiting optical telescope launched in 1990 that reshaped modern astronomy.",
  },
  {
    name: "International Space Station", category: "World", era: "Other", civ: "International", status: "original",
    note: "In low Earth orbit (~400 km up) — no visitable ground location. Core launched from Baikonur.",
    blurb: "The crewed multinational laboratory orbiting Earth roughly every 90 minutes since 1998.",
  },
  {
    name: "United Nations", category: "World", era: "Modern", civ: "United States", status: "original",
    location: { name: "New York City", coords: [40.7489, -73.9680] },
    blurb: "The UN Headquarters complex on Manhattan's East River, opened in 1952 on international territory.",
  },

  // ─────────────────────── National Wonders ───────────────────────
  // Only the ones with a clear real-world namesake are placed. The rest
  // (National College, National Epic, National Treasury, Heroic Epic,
  // Grand Temple, Ironworks, Palace) are generic civic abstractions.
  {
    name: "Circus Maximus", category: "National", civ: "Italy", status: "ruined",
    location: { name: "Rome", coords: [41.8859, 12.4847] },
    blurb: "Ancient Rome's vast chariot-racing arena between the Aventine and Palatine — now a grassy hollow.",
  },
  {
    name: "East India Company", category: "National", civ: "Netherlands", status: "original",
    location: { name: "Amsterdam", coords: [52.3719, 4.9010] },
    blurb: "Modelled on the Dutch VOC; its Oost-Indisch Huis still stands in Amsterdam (now a university).",
  },
  {
    name: "Hermitage", category: "National", civ: "Russia", status: "original",
    location: { name: "Saint Petersburg", coords: [59.9398, 30.3146] },
    blurb: "The State Hermitage in the Winter Palace, one of the largest art museums in the world.",
  },
  {
    name: "National Intelligence Agency", category: "National", civ: "United States", status: "original",
    location: { name: "Langley, VA", coords: [38.9517, -77.1467] },
    blurb: "Echoes the real intelligence headquarters such as the CIA at Langley, Virginia.",
  },
  {
    name: "National Visitor Center", category: "National", civ: "United States", status: "original",
    location: { name: "Washington, D.C.", coords: [38.8977, -77.0065] },
    blurb: "The original National Visitor Center opened in Washington's Union Station for the 1976 Bicentennial.",
  },
  {
    name: "Oxford University", category: "National", civ: "United Kingdom", status: "original",
    location: { name: "Oxford", coords: [51.7548, -1.2544] },
    blurb: "The oldest university in the English-speaking world, teaching since at least 1096.",
  },
  {
    name: "Grand Temple", category: "National", status: "original",
    note: "A generic religious capital — no single real-world building inspired it.",
    blurb: "The seat of a civilization's faith in its Holy City; an abstraction rather than a real temple.",
  },
  {
    name: "Heroic Epic", category: "National", status: "mythical",
    note: "An abstract martial monument — no real-world site.",
    blurb: "A national war memorial that hardens new troops; represents a culture's heroic literature.",
  },
  {
    name: "Ironworks", category: "National", status: "original",
    note: "A generic industrial foundry — no single real-world site.",
    blurb: "A super-productive forge complex; the abstract heart of a civilization's heavy industry.",
  },
  {
    name: "National College", category: "National", status: "original",
    note: "A generic centre of learning — no single real-world site.",
    blurb: "A nationwide academy boosting research; an abstraction of a country's higher-education system.",
  },
  {
    name: "National Epic", category: "National", status: "mythical",
    note: "An abstract cultural monument — no real-world site.",
    blurb: "A wonder celebrating a civilization's defining poem or saga; purely representational.",
  },
  {
    name: "National Treasury", category: "National", status: "original",
    note: "A generic state treasury — no single real-world site.",
    blurb: "The central vault of a civilization's wealth; an abstraction of national finance.",
  },
  {
    name: "Palace", category: "National", status: "original",
    note: "Wherever the player's capital is — no fixed real-world site.",
    blurb: "The seat of government in a civilization's capital city; placed by the player, not history.",
  },

  // ──────────────────────── Natural Wonders ────────────────────────
  {
    name: "Cerro de Potosi", category: "Natural", civ: "Bolivia", status: "original",
    location: { name: "Potosí", coords: [-19.6206, -65.7536] },
    blurb: "The silver mountain above Potosí that bankrolled the Spanish Empire — the 'Rich Hill'.",
  },
  {
    name: "El Dorado", category: "Natural", civ: "Colombia", status: "mythical",
    location: { name: "Lake Guatavita", coords: [4.9786, -73.7772] },
    blurb: "The legendary city of gold; the myth grew from a gilded-king ritual at Lake Guatavita.",
  },
  {
    name: "Fountain of Youth", category: "Natural", civ: "United States", status: "mythical",
    location: { name: "St. Augustine, FL", coords: [29.8975, -81.3137] },
    blurb: "The legendary restorative spring Ponce de León supposedly sought in Florida.",
  },
  {
    name: "King Solomon's Mines", category: "Natural", civ: "Israel", status: "mythical",
    location: { name: "Timna Valley", coords: [29.7833, 34.9833] },
    blurb: "The fabled source of Solomon's wealth; popularly tied to the ancient copper works at Timna.",
  },
  {
    name: "Krakatoa", category: "Natural", civ: "Indonesia", status: "original",
    location: { name: "Sunda Strait", coords: [-6.1020, 105.4230] },
    blurb: "The volcanic island whose cataclysmic 1883 eruption was heard thousands of kilometres away.",
  },
  {
    name: "Lake Victoria", category: "Natural", civ: "Tanzania", status: "original",
    location: { name: "Lake Victoria", coords: [-1.0000, 33.0000] },
    blurb: "Africa's largest lake and a chief source of the Nile, shared by Tanzania, Uganda, and Kenya.",
  },
  {
    name: "Mt. Fuji", category: "Natural", civ: "Japan", status: "original",
    location: { name: "Mt. Fuji", coords: [35.3606, 138.7274] },
    blurb: "Japan's sacred, near-symmetrical volcano, an enduring subject of art and pilgrimage.",
  },
  {
    name: "Mt. Kailash", category: "Natural", civ: "China", status: "original",
    location: { name: "Mt. Kailash", coords: [31.0668, 81.3119] },
    blurb: "The Tibetan peak holy to four religions; left unclimbed out of reverence.",
  },
  {
    name: "Mt. Kilimanjaro", category: "Natural", civ: "Tanzania", status: "original",
    location: { name: "Mt. Kilimanjaro", coords: [-3.0674, 37.3556] },
    blurb: "Africa's highest mountain, a snow-capped free-standing volcano rising from the Tanzanian plain.",
  },
  {
    name: "Mt. Sinai", category: "Natural", civ: "Egypt", status: "original",
    location: { name: "Mt. Sinai", coords: [28.5392, 33.9750] },
    blurb: "The peak in the Sinai where tradition holds Moses received the Ten Commandments.",
  },
  {
    name: "Old Faithful", category: "Natural", civ: "United States", status: "original",
    location: { name: "Yellowstone", coords: [44.4605, -110.8281] },
    blurb: "The famously regular geyser in Yellowstone, erupting every 60–90 minutes.",
  },
  {
    name: "Rock of Gibraltar", category: "Natural", civ: "United Kingdom", status: "original",
    location: { name: "Gibraltar", coords: [36.1408, -5.3536] },
    blurb: "The monolithic limestone headland guarding the western mouth of the Mediterranean.",
  },
  {
    name: "Sri Pada", category: "Natural", civ: "Sri Lanka", status: "original",
    location: { name: "Adam's Peak", coords: [6.8096, 80.4994] },
    blurb: "Adam's Peak, a conical Sri Lankan mountain whose summit 'footprint' draws pilgrims of many faiths.",
  },
  {
    name: "The Barringer Crater", category: "Natural", civ: "United States", status: "original",
    location: { name: "Arizona", coords: [35.0275, -111.0225] },
    blurb: "A 1.2-km meteor crater in the Arizona desert, one of the best-preserved on Earth.",
  },
  {
    name: "The Grand Mesa", category: "Natural", civ: "United States", status: "original",
    location: { name: "Colorado", coords: [39.0486, -108.0456] },
    blurb: "One of the world's largest flat-topped mountains, dotted with hundreds of lakes, in Colorado.",
  },
  {
    name: "The Great Barrier Reef", category: "Natural", civ: "Australia", status: "original",
    location: { name: "Queensland coast", coords: [-18.2871, 147.6992] },
    blurb: "The world's largest coral-reef system, stretching ~2,300 km off northeastern Australia.",
  },
  {
    name: "Uluru", category: "Natural", civ: "Australia", status: "original",
    location: { name: "Uluru", coords: [-25.3444, 131.0369] },
    blurb: "The great sandstone monolith sacred to the Anangu, rising from the central Australian desert.",
  },

  // ──────────────────────── Unused Wonders ─────────────────────────
  // Cut from the final game — only paintings, icons, or music survive in the
  // files. Each is still pinned to the real place it would have represented.
  {
    name: "Panama Canal", category: "Unused", era: "Modern", civ: "Panama", status: "original",
    location: { name: "Panama Canal", coords: [9.0800, -79.6800] },
    blurb: "Cut world wonder; its loading-screen painting survives. The real ship canal opened in 1914.",
  },
  {
    name: "Three Gorges Dam", category: "Unused", era: "Information", civ: "China", status: "original",
    location: { name: "Yichang", coords: [30.8230, 111.0030] },
    blurb: "Cut wonder — likely too tile-dependent to place. The real Yangtze dam is the world's largest power station.",
  },
  {
    name: "Large Hadron Collider", category: "Unused", era: "Information", civ: "Switzerland", status: "original",
    location: { name: "CERN, Geneva", coords: [46.2340, 6.0550] },
    blurb: "Cut wonder; a placeholder image and music file remain. The real 27-km collider straddles the France–Swiss border.",
  },
  {
    name: "Motherland Calls", category: "Unused", era: "Atomic", civ: "Russia", status: "original",
    location: { name: "Volgograd", coords: [48.7420, 44.5370] },
    blurb: "Cut from Brave New World over copyright; the colossal Volgograd war statue it depicts still stands.",
  },
];

// Wonders the owner has personally visited. The source of truth is this flat
// list of names — it was originally gathered by country (everything in Italy,
// India, China, Canada, and the USA) plus a handful of named extras, but those
// rules are resolved here into explicit names so the data stands on its own.
export const VISITED_WONDER_NAMES = new Set<string>([
  // World
  "Pyramids", "Great Wall", "Terracotta Army", "Angkor Wat", "Hagia Sophia",
  "Machu Picchu", "Forbidden Palace", "Leaning Tower of Pisa", "Porcelain Tower",
  "Red Fort", "Sistine Chapel", "Taj Mahal", "Uffizi", "Broadway",
  "Neuschwanstein", "Statue of Liberty", "Pentagon", "CN Tower", "United Nations",
  // National
  "Circus Maximus", "East India Company", "National Intelligence Agency",
  "National Visitor Center",
  // Natural
  "Fountain of Youth", "Mt. Kailash", "Mt. Fuji", "Old Faithful",
  "The Barringer Crater", "The Grand Mesa",
]);

export const WONDERS: Wonder[] = RAW_WONDERS.map((w) => ({
  ...w,
  visited: VISITED_WONDER_NAMES.has(w.name),
}));
