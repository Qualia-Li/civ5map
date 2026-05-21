// Maps historical city names to a canonical (usually modern) name so the
// ranking panel aggregates them. Keys are matched case-insensitively after
// stripping parenthetical qualifiers like "(traditional)" / "(Han capital)".
//
// Where a historical name is famous in its own right (e.g. Chang'an, Babylon,
// Carthage), we keep it as the canonical name even though there's a modern
// settlement nearby — anything else uses the modern name.

export const CITY_ALIASES: Record<string, string> = {
  // ---- China ----
  "khanbaliq":            "Beijing",
  "dadu":                 "Beijing",
  "yanjing":              "Beijing",
  "beiping":              "Beijing",
  "peking":               "Beijing",
  "cambaluc":             "Beijing",
  "jinling":              "Nanjing",
  "jianye":               "Nanjing",
  "jiankang":             "Nanjing",
  "bianjing":             "Kaifeng",
  "bianliang":            "Kaifeng",
  "lin'an":               "Hangzhou",
  "jiangning":            "Nanjing",  // Qing-era prefecture name for Nanjing
  "mochou":               "Nanjing",
  "moling":               "Nanjing",
  "linan":                "Hangzhou",
  "qiantang":             "Hangzhou",
  "qufu":                 "Qufu",
  // Keep Chang'an as canonical — it's the famous Tang/Han capital name.
  "xi'an":                "Chang'an",
  "xian":                 "Chang'an",
  "chang an":             "Chang'an",
  "chang-an":             "Chang'an",
  "luoyang, han capital": "Luoyang",
  "luoyang han capital":  "Luoyang",
  "gusu":                 "Suzhou",
  "wu":                   "Suzhou",
  "guangzhou (canton)":   "Guangzhou",
  "canton":               "Guangzhou",
  "amoy":                 "Xiamen",

  // ---- Japan / Korea ----
  "edo":                  "Tokyo",
  "musashi":              "Tokyo",
  "ikegami":              "Tokyo",
  "kominato":             "Kominato",
  "heian-kyo":            "Kyoto",
  "heian-kyō":            "Kyoto",
  "heian kyo":            "Kyoto",
  "hanseong":             "Seoul",
  "hanyang":              "Seoul",

  // ---- India / South Asia ----
  "bombay":               "Mumbai",
  "madras":               "Chennai",
  "calcutta":             "Kolkata",
  "bangalore":             "Bengaluru",
  "pataliputra":          "Patna",
  "kusumapura":           "Patna",
  "kusumapura, patna":    "Patna",
  "kusumapura (patna)":   "Patna",
  "indraprastha":         "Delhi",
  "shahjahanabad":        "Delhi",
  "kapilavastu":          "Kapilavastu",
  "vaishali":             "Vaishali",
  "kundagrama":           "Kundagrama",
  "nalanda":              "Nalanda",
  "rajgir":               "Rajgir",
  "kashi":                "Varanasi",
  "banaras":              "Varanasi",
  "benares":              "Varanasi",

  // ---- SE Asia ----
  "saigon":               "Ho Chi Minh City",
  "batavia":              "Jakarta",
  "rangoon":              "Yangon",

  // ---- Middle East / Mesopotamia ----
  "byzantium":            "Istanbul",
  "constantinople":       "Istanbul",
  "konstantinopolis":     "Istanbul",
  "tsargrad":             "Istanbul",
  "smyrna":               "Izmir",
  "smyrna izmir":         "Izmir",
  "smyrna (izmir)":       "Izmir",
  "antioch":              "Antakya",
  "antakya":              "Antakya",
  "edessa":               "Şanlıurfa",
  "ur":                   "Ur",
  "babylon":              "Babylon",
  "ctesiphon":            "Ctesiphon",
  "seleucia-ctesiphon":   "Ctesiphon",
  "nineveh":              "Mosul",
  "rhages":               "Tehran",
  "ray":                  "Tehran",
  "rey":                  "Tehran",
  "balkh":                "Balkh",
  "samarra":              "Samarra",
  "basra":                "Basra",
  "hamadan":              "Hamadan",
  "isfahan":              "Isfahan",
  "afshana":              "Bukhara",
  "afshana, near bukhara":"Bukhara",
  "bukhara":              "Bukhara",
  "khiva":                "Khiva",
  "gundeshapur":          "Dezful",
  "thagaste":             "Souk Ahras",
  "hippo regius":         "Annaba",
  "carthage":             "Carthage",
  "memphis":              "Memphis (Egypt)",
  "alexandria":           "Alexandria",
  "thebes":               "Luxor",
  "elephantine":          "Aswan",
  "tikrit":               "Tikrit",
  "mecca":                "Mecca",
  "medina":               "Medina",
  "jerusalem":            "Jerusalem",
  "yerushalayim":         "Jerusalem",
  "tarsus":               "Tarsus",
  "kufa":                 "Kufa",
  "ctesiphon-seleucia":   "Ctesiphon",
  "acre":                 "Acre",
  "akko":                 "Acre",
  "tyre":                 "Tyre",
  "sidon":                "Sidon",
  "tarsus tarsus":        "Tarsus",
  "harran":               "Harran",
  "hattusa":              "Hattusa",
  "nuremberg":            "Nürnberg",

  // ---- Greece / Italy / Mediterranean ----
  "athens":               "Athens",
  "sparta":               "Sparta",
  "syracuse":             "Syracuse",
  "syrakousai":           "Syracuse",
  "neapolis":             "Naples",
  "napoli":               "Naples",
  "stagira":              "Stagira",
  "chios":                "Chios",
  "ios":                  "Ios",
  "milan":                "Milan",
  "milano":               "Milan",
  "padua":                "Padua",
  "padova":               "Padua",
  "florence":             "Florence",
  "firenze":              "Florence",
  "arcetri":              "Florence",   // hillside quarter of southern Florence
  "arcetri, florence":    "Florence",
  "careggi":              "Florence",
  "fiesole":              "Florence",   // hilltop town fully absorbed into Greater Florence
  "vinci":                "Florence",   // Leonardo's birthplace — comune of Metro Florence
  "anchiano":             "Florence",   // hamlet near Vinci where Leonardo was actually born
  "caprese":              "Florence",   // Michelangelo's birth village, Metro Florence
  "caprese michelangelo": "Florence",
  "venice":               "Venice",
  "venezia":              "Venice",
  "rome":                 "Rome",
  "roma":                 "Rome",
  "pisa":                 "Pisa",
  "ravenna":              "Ravenna",
  "bologna":              "Bologna",
  "verona":               "Verona",
  "constanople":          "Istanbul",
  "leningrad":            "Saint Petersburg",
  "petrograd":            "Saint Petersburg",
  "saint petersburg":     "Saint Petersburg",
  "st petersburg":        "Saint Petersburg",
  "st. petersburg":       "Saint Petersburg",
  "stalingrad":           "Volgograd",
  "tsaritsyn":            "Volgograd",
  "ekaterinburg":         "Yekaterinburg",
  "ekaterinodar":         "Krasnodar",

  // ---- France / Germany / Low Countries ----
  "lutetia":              "Paris",
  "lutetia parisiorum":   "Paris",
  "paris":                "Paris",
  "lyon":                 "Lyon",
  "lyons":                "Lyon",
  "marseille":            "Marseille",
  "marseilles":           "Marseille",
  "köln":                 "Cologne",
  "koln":                 "Cologne",
  "münchen":              "Munich",
  "muenchen":             "Munich",
  "wien":                 "Vienna",
  "vienna":               "Vienna",
  "praha":                "Prague",
  "warszawa":             "Warsaw",
  "warsaw":               "Warsaw",
  "krakow":               "Kraków",

  // ---- Britain ----
  "londinium":            "London",
  "london":               "London",
  "eboracum":             "York",
  "york":                 "York",

  // ---- Americas ----
  "tenochtitlan":         "Mexico City",
  "tenochtitlán":         "Mexico City",
  "ciudad de méxico":     "Mexico City",
  "coyoacan":             "Mexico City",   // alcaldía of CDMX (Frida Kahlo)
  "coyoacán":             "Mexico City",
  "tlatelolco":           "Mexico City",
  "xochimilco":           "Mexico City",
  // Boston: merge Medford (immediate suburb). Cambridge MA stays separate —
  // it has its own intellectual identity the way Berkeley/Palo Alto do vs SF.
  "medford":              "Boston",
  "medford, ma":          "Boston",
  "somerville":           "Boston",
  "brookline":            "Boston",
  // Washington DC: normalize name forms
  "washington":           "Washington, D.C.",
  "washington dc":        "Washington, D.C.",
  "washington, dc":       "Washington, D.C.",
  // Lyon
  "oullins":              "Lyon",
  "villeurbanne":         "Lyon",
  // Frankfurt — both names point to the same city
  "frankfurt am main":    "Frankfurt",
  "new amsterdam":        "New York City",
  "new york":             "New York City",
  "nyc":                  "New York City",
  "manhattan":            "New York City",
  "brooklyn":             "New York City",
  "queens":               "New York City",
  "the bronx":            "New York City",
  "bronx":                "New York City",
  "staten island":        "New York City",
  "greenwich village":    "New York City",
  "harlem":               "New York City",
  "murray hill":          "New York City",
  "philadelphia":         "Philadelphia",

  // ---- Greater London (boroughs inside Greater London proper only) ----
  // Cambridge, Bletchley, Hastings, Down House, Crowborough, Chelmsford,
  // Firle, Medway etc. are NOT part of London — they're distinct towns and
  // stay separate.
  "westminster":          "London",
  "kensington":           "London",
  "highgate":             "London",
  "hampstead":            "London",
  "chelsea":              "London",
  "southwark":            "London",
  "lambeth":              "London",
  "greenwich":            "London",
  "deptford":             "London",   // LB of Lewisham
  "east india house":     "London",   // City of London
  "the strand":           "London",   // street in central London
  "kennington":           "London",   // LB of Lambeth
  "leyton":               "London",   // LB of Waltham Forest
  "hampton court":        "London",   // LB of Richmond
  "wapping":              "London",
  "shoreditch":           "London",
  "islington":            "London",
  "marylebone":           "London",
  "soho":                 "London",
  "bloomsbury":           "London",

  // ---- Greater Paris ----
  // Auvers-sur-Oise (Van Gogh's death), Versailles, Noyon, Quierzy stay separate —
  // they're distinct historical/political sites, not Paris-of-the-metro.
  "versailles":           "Versailles", // keep separate — distinct historical site
  "neuilly-sur-seine":    "Paris",
  "saint-denis":          "Paris",
  "passy":                "Paris",
  "montmartre":           "Paris",
  "arcueil":              "Paris",
  "marnes-la-coquette":   "Paris",  // Pasteur's death, 11km from Paris center
  "cormeilles-en-parisis":"Paris",  // Val-d'Oise commune ~17km NW
  "bry-sur-marne":        "Paris",  // Val-de-Marne commune ~14km E
  "saint-cloud":          "Paris",
  "issy-les-moulineaux":  "Paris",
  "courbevoie":           "Paris",
  "puteaux":              "Paris",
  "levallois-perret":     "Paris",
  "boulogne-billancourt": "Paris",
  "vincennes":            "Paris",
  "montparnasse":         "Paris",
  "le marais":            "Paris",
  "belleville":           "Paris",
  "saint-germain":        "Paris",

  // ---- Greater Los Angeles ----
  "san gabriel":          "Los Angeles",
  "santa monica":         "Los Angeles",
  "beverly hills":        "Los Angeles",
  "pasadena":             "Los Angeles",
  "hollywood":            "Los Angeles",
  "west hollywood":       "Los Angeles",
  "burbank":              "Los Angeles",
  "glendale":             "Los Angeles",
  "culver city":          "Los Angeles",
  "inglewood":            "Los Angeles",
  "compton":              "Los Angeles",
  "brentwood":            "Los Angeles",
  "malibu":               "Los Angeles",
  "pacific palisades":    "Los Angeles",

  // ---- San Francisco proper ----
  // Only places literally inside SF's city limits — Oakland / Berkeley /
  // Palo Alto / Cupertino are distinct cities and stay separate.
  "yerba buena island":   "San Francisco",
  "yerba buena":          "San Francisco",
  "treasure island":      "San Francisco",
  "presidio":             "San Francisco",

  // ---- Greater Tokyo (wards inside Tokyo prefecture) ----
  // Kominato (Chiba, ~70km), Yokohama (Kanagawa) stay separate.
  "asakusa":              "Tokyo",
  "katsushika":           "Tokyo",
  "edo bay":              "Tokyo",
  "shinjuku":             "Tokyo",
  "shibuya":              "Tokyo",
  "ginza":                "Tokyo",
  "ueno":                 "Tokyo",

  // ---- Chicago metro (Oak Park = Wright/Hemingway, just outside city line) ----
  "oak park":             "Chicago",   // Hemingway birthplace + Wright studio
  "oak park, illinois":   "Chicago",
  "evanston":             "Chicago",
  "cicero":               "Chicago",

  // ---- Moscow (former villages now within city) ----
  "kolomenskoye":         "Moscow",    // former village, now Moscow district
  "moscow kremlin":       "Moscow",
  "the kremlin":          "Moscow",
  "ostankino":            "Moscow",

  // ---- Berlin / Vienna boroughs (kept conservative; only obvious in-city districts) ----
  "charlottenburg":       "Berlin",
  "kreuzberg":             "Berlin",
  "mitte":                 "Berlin",
  "potsdamer platz":      "Berlin",
  "schöneberg":           "Berlin",
  "döbling":              "Vienna",
  "leopoldstadt":         "Vienna",
  "hietzing":             "Vienna",
  "favoriten":            "Vienna",

  // ---- Amsterdam (Delft, Leiden, The Hague stay separate — they are distinct Dutch cities) ----
  // No district aliases needed here; the dataset has Amsterdam districts only if they match
  // the city name directly.
};

const stripParen = (s: string) => s.replace(/\s*\([^)]*\)\s*$/, "").trim();
// Drop appended ", Country" or ", State" comma clauses for lookup only.
const stripComma  = (s: string) => s.split(",")[0].trim();

export function canonicalCity(raw: string): string {
  const noParen = stripParen(raw);
  const head    = stripComma(noParen);
  const lcHead  = head.toLowerCase();
  const lcFull  = noParen.toLowerCase();
  // 1) alias on the bare head ("rhages" -> "Tehran")
  // 2) alias on the whole stripped name ("seleucia-ctesiphon" -> "Ctesiphon")
  // 3) otherwise drop trailing ", X" qualifier so "Chenggu, Shaanxi (traditional)"
  //    displays as just "Chenggu" — keep parentheticals only when they're an
  //    informative modern name (handled by the explicit alias map above).
  return CITY_ALIASES[lcHead] ?? CITY_ALIASES[lcFull] ?? head;
}
