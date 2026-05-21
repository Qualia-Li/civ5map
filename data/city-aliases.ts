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
  "new amsterdam":        "New York City",
  "new york":             "New York City",
  "nyc":                  "New York City",
  "philadelphia":         "Philadelphia",
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
