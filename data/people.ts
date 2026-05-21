// Historical figures drawn from Civilization V's Great Person name pools.
// Coordinates are [lat, lng]. Years are negative for BCE.

export type GPType =
  | "Scientist"
  | "Engineer"
  | "Merchant"
  | "Artist"
  | "Writer"
  | "Musician"
  | "General"
  | "Admiral"
  | "Prophet";

export type Era =
  | "Ancient"
  | "Classical"
  | "Medieval"
  | "Renaissance"
  | "Industrial"
  | "Modern";

export interface Place {
  name: string;
  coords: [number, number];
}

export interface Person {
  name: string;
  type: GPType;
  civ: string;       // Civ V civilization / nation
  country: string;   // modern country
  era: Era;
  born?: number;     // year (BCE negative)
  died?: number;
  birth?: Place;
  work?: Place;      // primary place of work/career
  death?: Place;
  works: string[];   // notable products / contributions
  blurb: string;
}

export const PEOPLE: Person[] = [
  // ===== SCIENTISTS =====
  {
    name: "Albert Einstein", type: "Scientist", civ: "Germany", country: "Germany/USA",
    era: "Modern", born: 1879, died: 1955,
    birth: { name: "Ulm", coords: [48.4011, 9.9876] },
    work:  { name: "Princeton", coords: [40.3573, -74.6672] },
    death: { name: "Princeton", coords: [40.3573, -74.6672] },
    works: ["Special Relativity (1905)", "General Relativity (1915)", "Photoelectric effect"],
    blurb: "Father of modern physics; Nobel Prize 1921."
  },
  {
    name: "Isaac Newton", type: "Scientist", civ: "England", country: "United Kingdom",
    era: "Renaissance", born: 1643, died: 1727,
    birth: { name: "Woolsthorpe", coords: [52.8090, -0.6280] },
    work:  { name: "Cambridge", coords: [52.2053, 0.1218] },
    death: { name: "Kensington, London", coords: [51.5074, -0.1278] },
    works: ["Principia Mathematica", "Calculus", "Laws of Motion", "Optics"],
    blurb: "Defined classical mechanics and universal gravitation."
  },
  {
    name: "Galileo Galilei", type: "Scientist", civ: "Italy/Venice", country: "Italy",
    era: "Renaissance", born: 1564, died: 1642,
    birth: { name: "Pisa", coords: [43.7228, 10.4017] },
    work:  { name: "Padua", coords: [45.4064, 11.8768] },
    death: { name: "Arcetri, Florence", coords: [43.7541, 11.2455] },
    works: ["Telescope improvements", "Dialogue on Two World Systems", "Laws of motion (kinematics)"],
    blurb: "Father of observational astronomy."
  },
  {
    name: "Marie Curie", type: "Scientist", civ: "Poland/France", country: "Poland/France",
    era: "Modern", born: 1867, died: 1934,
    birth: { name: "Warsaw", coords: [52.2297, 21.0122] },
    work:  { name: "Paris (Sorbonne)", coords: [48.8462, 2.3448] },
    death: { name: "Sancellemoz, France", coords: [46.0667, 6.5667] },
    works: ["Discovery of Polonium & Radium", "Theory of radioactivity"],
    blurb: "First person to win Nobel Prizes in two sciences."
  },
  {
    name: "Charles Darwin", type: "Scientist", civ: "England", country: "United Kingdom",
    era: "Industrial", born: 1809, died: 1882,
    birth: { name: "Shrewsbury", coords: [52.7077, -2.7531] },
    work:  { name: "Down House, Kent", coords: [51.3315, 0.0533] },
    death: { name: "Down House, Kent", coords: [51.3315, 0.0533] },
    works: ["On the Origin of Species", "The Descent of Man"],
    blurb: "Theory of evolution by natural selection."
  },
  {
    name: "Nikola Tesla", type: "Scientist", civ: "Austria/USA", country: "Croatia/USA",
    era: "Modern", born: 1856, died: 1943,
    birth: { name: "Smiljan", coords: [44.5667, 15.3167] },
    work:  { name: "New York City", coords: [40.7128, -74.0060] },
    death: { name: "New York City", coords: [40.7128, -74.0060] },
    works: ["Alternating current motor", "Tesla coil", "Wireless transmission"],
    blurb: "Pioneer of AC electrical systems."
  },
  {
    name: "Archimedes", type: "Scientist", civ: "Greece", country: "Greece (Syracuse)",
    era: "Classical", born: -287, died: -212,
    birth: { name: "Syracuse", coords: [37.0755, 15.2866] },
    work:  { name: "Syracuse", coords: [37.0755, 15.2866] },
    death: { name: "Syracuse", coords: [37.0755, 15.2866] },
    works: ["Archimedes' Principle", "Method of Exhaustion", "War machines of Syracuse"],
    blurb: "Greatest mathematician of antiquity."
  },
  {
    name: "Hypatia", type: "Scientist", civ: "Egypt/Rome", country: "Egypt",
    era: "Classical", born: 350, died: 415,
    birth: { name: "Alexandria", coords: [31.2001, 29.9187] },
    work:  { name: "Alexandria", coords: [31.2001, 29.9187] },
    death: { name: "Alexandria", coords: [31.2001, 29.9187] },
    works: ["Commentaries on Diophantus & Apollonius", "Astronomical tables"],
    blurb: "Neoplatonist philosopher and mathematician of Alexandria."
  },
  {
    name: "Aryabhata", type: "Scientist", civ: "India", country: "India",
    era: "Classical", born: 476, died: 550,
    birth: { name: "Kusumapura (Patna)", coords: [25.5941, 85.1376] },
    work:  { name: "Nalanda", coords: [25.1357, 85.4436] },
    death: { name: "Patna", coords: [25.5941, 85.1376] },
    works: ["Aryabhatiya", "Place-value decimal system", "Approximation of π"],
    blurb: "Pioneering Indian mathematician-astronomer."
  },
  {
    name: "Alan Turing", type: "Scientist", civ: "England", country: "United Kingdom",
    era: "Modern", born: 1912, died: 1954,
    birth: { name: "London", coords: [51.5074, -0.1278] },
    work:  { name: "Bletchley Park", coords: [51.9976, -0.7406] },
    death: { name: "Wilmslow", coords: [53.3266, -2.2310] },
    works: ["Turing machine", "Bombe (Enigma decryption)", "Turing test"],
    blurb: "Founder of theoretical computer science."
  },
  {
    name: "Zhang Heng", type: "Scientist", civ: "China", country: "China",
    era: "Classical", born: 78, died: 139,
    birth: { name: "Nanyang", coords: [33.0007, 112.5283] },
    work:  { name: "Luoyang (Han capital)", coords: [34.6197, 112.4540] },
    death: { name: "Luoyang", coords: [34.6197, 112.4540] },
    works: ["Seismoscope", "Armillary sphere (water-powered)"],
    blurb: "Han polymath; invented the first seismoscope."
  },
  {
    name: "Avicenna (Ibn Sina)", type: "Scientist", civ: "Arabia/Persia", country: "Iran",
    era: "Medieval", born: 980, died: 1037,
    birth: { name: "Afshana, near Bukhara", coords: [39.7747, 64.4286] },
    work:  { name: "Isfahan", coords: [32.6546, 51.6680] },
    death: { name: "Hamadan", coords: [34.7989, 48.5146] },
    works: ["The Canon of Medicine", "The Book of Healing"],
    blurb: "Most influential physician of the Islamic Golden Age."
  },

  // ===== ENGINEERS =====
  {
    name: "Leonardo da Vinci", type: "Engineer", civ: "Italy/Venice", country: "Italy",
    era: "Renaissance", born: 1452, died: 1519,
    birth: { name: "Vinci", coords: [43.7867, 10.9252] },
    work:  { name: "Milan", coords: [45.4642, 9.1900] },
    death: { name: "Château du Clos Lucé, Amboise", coords: [47.4101, 0.9889] },
    works: ["Flying machine designs", "Anatomical studies", "Mona Lisa", "Last Supper"],
    blurb: "Quintessential Renaissance polymath."
  },
  {
    name: "Gustave Eiffel", type: "Engineer", civ: "France", country: "France",
    era: "Industrial", born: 1832, died: 1923,
    birth: { name: "Dijon", coords: [47.3220, 5.0415] },
    work:  { name: "Paris", coords: [48.8566, 2.3522] },
    death: { name: "Paris", coords: [48.8566, 2.3522] },
    works: ["Eiffel Tower", "Statue of Liberty internal structure", "Garabit Viaduct"],
    blurb: "Iron-lattice virtuoso of the late 19th century."
  },
  {
    name: "Isambard Kingdom Brunel", type: "Engineer", civ: "England", country: "United Kingdom",
    era: "Industrial", born: 1806, died: 1859,
    birth: { name: "Portsmouth", coords: [50.8198, -1.0880] },
    work:  { name: "Bristol", coords: [51.4545, -2.5879] },
    death: { name: "London", coords: [51.5074, -0.1278] },
    works: ["Great Western Railway", "SS Great Britain", "Clifton Suspension Bridge"],
    blurb: "Defined Victorian civil and mechanical engineering."
  },
  {
    name: "Imhotep", type: "Engineer", civ: "Egypt", country: "Egypt",
    era: "Ancient", born: -2650, died: -2600,
    birth: { name: "Memphis", coords: [29.8443, 31.2509] },
    work:  { name: "Saqqara", coords: [29.8714, 31.2165] },
    death: { name: "Saqqara", coords: [29.8714, 31.2165] },
    works: ["Step Pyramid of Djoser", "Early medical writings"],
    blurb: "Architect of the first Egyptian pyramid; later deified."
  },
  {
    name: "Filippo Brunelleschi", type: "Engineer", civ: "Italy", country: "Italy",
    era: "Renaissance", born: 1377, died: 1446,
    birth: { name: "Florence", coords: [43.7696, 11.2558] },
    work:  { name: "Florence", coords: [43.7696, 11.2558] },
    death: { name: "Florence", coords: [43.7696, 11.2558] },
    works: ["Dome of Florence Cathedral", "Linear perspective"],
    blurb: "Father of Renaissance architecture."
  },
  {
    name: "James Watt", type: "Engineer", civ: "Scotland/England", country: "United Kingdom",
    era: "Industrial", born: 1736, died: 1819,
    birth: { name: "Greenock", coords: [55.9486, -4.7600] },
    work:  { name: "Birmingham (Soho Foundry)", coords: [52.5083, -1.9817] },
    death: { name: "Handsworth, Birmingham", coords: [52.5083, -1.9817] },
    works: ["Improved steam engine", "Watt governor"],
    blurb: "Made steam power practical and ignited the Industrial Revolution."
  },
  {
    name: "Nikola Tesla (Engineer)", type: "Engineer", civ: "Austria/USA", country: "USA",
    era: "Modern", born: 1856, died: 1943,
    birth: { name: "Smiljan", coords: [44.5667, 15.3167] },
    work:  { name: "Colorado Springs", coords: [38.8339, -104.8214] },
    death: { name: "New York City", coords: [40.7128, -74.0060] },
    works: ["AC induction motor", "Tesla coil", "Wardenclyffe Tower"],
    blurb: "Electrical engineering visionary."
  },
  {
    name: "Sergei Korolev", type: "Engineer", civ: "Russia", country: "USSR",
    era: "Modern", born: 1907, died: 1966,
    birth: { name: "Zhytomyr", coords: [50.2547, 28.6587] },
    work:  { name: "Baikonur Cosmodrome", coords: [45.9646, 63.3052] },
    death: { name: "Moscow", coords: [55.7558, 37.6173] },
    works: ["R-7 rocket", "Sputnik 1", "Vostok program"],
    blurb: "Chief Designer of the Soviet space program."
  },
  {
    name: "Vitruvius", type: "Engineer", civ: "Rome", country: "Roman Italy",
    era: "Classical", born: -80, died: -15,
    birth: { name: "Formia (unconfirmed)", coords: [41.2566, 13.6048] },
    work:  { name: "Rome", coords: [41.9028, 12.4964] },
    death: { name: "Rome", coords: [41.9028, 12.4964] },
    works: ["De Architectura (Ten Books on Architecture)"],
    blurb: "Roman architect whose treatise shaped Renaissance design."
  },

  // ===== MERCHANTS =====
  {
    name: "Marco Polo", type: "Merchant", civ: "Venice", country: "Italy",
    era: "Medieval", born: 1254, died: 1324,
    birth: { name: "Venice", coords: [45.4408, 12.3155] },
    work:  { name: "Khanbaliq (Beijing)", coords: [39.9042, 116.4074] },
    death: { name: "Venice", coords: [45.4408, 12.3155] },
    works: ["The Travels of Marco Polo"],
    blurb: "Linked Europe and Yuan China via the Silk Road."
  },
  {
    name: "Zheng He", type: "Admiral", civ: "China", country: "China",
    era: "Medieval", born: 1371, died: 1433,
    birth: { name: "Kunyang, Yunnan", coords: [24.8801, 102.6004] },
    work:  { name: "Nanjing (treasure fleet base)", coords: [32.0603, 118.7969] },
    death: { name: "At sea, returning from India", coords: [10.0000, 75.0000] },
    works: ["Seven Ming Treasure Voyages", "Indian Ocean diplomacy"],
    blurb: "Commanded the largest wooden fleets of the pre-modern world."
  },
  {
    name: "Ibn Battuta", type: "Merchant", civ: "Arabia/Morocco", country: "Morocco",
    era: "Medieval", born: 1304, died: 1369,
    birth: { name: "Tangier", coords: [35.7595, -5.8340] },
    work:  { name: "Delhi (and beyond)", coords: [28.6139, 77.2090] },
    death: { name: "Marrakesh (likely)", coords: [31.6295, -7.9811] },
    works: ["Rihla (The Travels)"],
    blurb: "Travelled ~120,000 km across Afro-Eurasia."
  },
  {
    name: "Jakob Fugger", type: "Merchant", civ: "Germany/HRE", country: "Germany",
    era: "Renaissance", born: 1459, died: 1525,
    birth: { name: "Augsburg", coords: [48.3705, 10.8978] },
    work:  { name: "Augsburg", coords: [48.3705, 10.8978] },
    death: { name: "Augsburg", coords: [48.3705, 10.8978] },
    works: ["Fugger banking empire", "Financed Habsburg election (1519)"],
    blurb: "Quite possibly the richest man in history."
  },
  {
    name: "Cosimo de' Medici", type: "Merchant", civ: "Italy", country: "Italy",
    era: "Renaissance", born: 1389, died: 1464,
    birth: { name: "Florence", coords: [43.7696, 11.2558] },
    work:  { name: "Florence", coords: [43.7696, 11.2558] },
    death: { name: "Careggi, Florence", coords: [43.8000, 11.2500] },
    works: ["Medici Bank", "Patronage of Donatello, Brunelleschi"],
    blurb: "Banker-statesman who bankrolled the Florentine Renaissance."
  },
  {
    name: "John D. Rockefeller", type: "Merchant", civ: "America", country: "USA",
    era: "Industrial", born: 1839, died: 1937,
    birth: { name: "Richford, NY", coords: [42.3551, -76.1908] },
    work:  { name: "Cleveland / NYC", coords: [41.4993, -81.6944] },
    death: { name: "Ormond Beach, FL", coords: [29.2858, -81.0559] },
    works: ["Standard Oil", "Rockefeller Foundation"],
    blurb: "Defined the American industrial-era trust."
  },
  {
    name: "Hetepheres", type: "Merchant", civ: "Egypt", country: "Egypt",
    era: "Ancient", born: -2600, died: -2550,
    birth: { name: "Memphis", coords: [29.8443, 31.2509] },
    work:  { name: "Giza", coords: [29.9792, 31.1342] },
    death: { name: "Giza", coords: [29.9792, 31.1342] },
    works: ["Royal estate management"],
    blurb: "Old Kingdom queen and steward of pharaonic wealth."
  },
  {
    name: "Sindbad", type: "Merchant", civ: "Arabia", country: "Iraq (Baghdad)",
    era: "Medieval", born: 800, died: 870,
    birth: { name: "Baghdad", coords: [33.3152, 44.3661] },
    work:  { name: "Indian Ocean (Basra base)", coords: [30.5085, 47.7804] },
    death: { name: "Baghdad", coords: [33.3152, 44.3661] },
    works: ["Indian Ocean trade voyages (legendary)"],
    blurb: "Archetype of the Abbasid-era seafaring merchant."
  },

  // ===== ARTISTS =====
  {
    name: "Michelangelo", type: "Artist", civ: "Italy", country: "Italy",
    era: "Renaissance", born: 1475, died: 1564,
    birth: { name: "Caprese", coords: [43.6442, 11.9847] },
    work:  { name: "Rome (Sistine Chapel)", coords: [41.9029, 12.4534] },
    death: { name: "Rome", coords: [41.9028, 12.4964] },
    works: ["David", "Sistine Chapel ceiling", "Pietà"],
    blurb: "Defined High Renaissance sculpture and fresco."
  },
  {
    name: "Vincent van Gogh", type: "Artist", civ: "Netherlands", country: "Netherlands/France",
    era: "Industrial", born: 1853, died: 1890,
    birth: { name: "Zundert", coords: [51.4694, 4.6586] },
    work:  { name: "Arles", coords: [43.6766, 4.6278] },
    death: { name: "Auvers-sur-Oise", coords: [49.0716, 2.1697] },
    works: ["The Starry Night", "Sunflowers", "Wheatfield with Crows"],
    blurb: "Post-Impressionist whose work redefined modern painting."
  },
  {
    name: "Pablo Picasso", type: "Artist", civ: "Spain", country: "Spain/France",
    era: "Modern", born: 1881, died: 1973,
    birth: { name: "Málaga", coords: [36.7213, -4.4214] },
    work:  { name: "Paris", coords: [48.8566, 2.3522] },
    death: { name: "Mougins", coords: [43.5996, 7.0001] },
    works: ["Les Demoiselles d'Avignon", "Guernica"],
    blurb: "Co-founder of Cubism."
  },
  {
    name: "Frida Kahlo", type: "Artist", civ: "Mexico/Aztec", country: "Mexico",
    era: "Modern", born: 1907, died: 1954,
    birth: { name: "Coyoacán, Mexico City", coords: [19.3500, -99.1622] },
    work:  { name: "Mexico City", coords: [19.4326, -99.1332] },
    death: { name: "Coyoacán, Mexico City", coords: [19.3500, -99.1622] },
    works: ["The Two Fridas", "Self-Portrait with Thorn Necklace"],
    blurb: "Defined Mexican surrealism rooted in indigenous identity."
  },
  {
    name: "Rembrandt van Rijn", type: "Artist", civ: "Netherlands", country: "Netherlands",
    era: "Renaissance", born: 1606, died: 1669,
    birth: { name: "Leiden", coords: [52.1601, 4.4970] },
    work:  { name: "Amsterdam", coords: [52.3676, 4.9041] },
    death: { name: "Amsterdam", coords: [52.3676, 4.9041] },
    works: ["The Night Watch", "Self-Portraits"],
    blurb: "Master of Dutch Golden Age painting."
  },
  {
    name: "Hokusai", type: "Artist", civ: "Japan", country: "Japan",
    era: "Industrial", born: 1760, died: 1849,
    birth: { name: "Edo (Tokyo)", coords: [35.6762, 139.6503] },
    work:  { name: "Edo (Tokyo)", coords: [35.6762, 139.6503] },
    death: { name: "Edo (Tokyo)", coords: [35.6762, 139.6503] },
    works: ["The Great Wave off Kanagawa", "Thirty-six Views of Mt Fuji"],
    blurb: "Ukiyo-e master."
  },
  {
    name: "Donatello", type: "Artist", civ: "Italy", country: "Italy",
    era: "Renaissance", born: 1386, died: 1466,
    birth: { name: "Florence", coords: [43.7696, 11.2558] },
    work:  { name: "Florence", coords: [43.7696, 11.2558] },
    death: { name: "Florence", coords: [43.7696, 11.2558] },
    works: ["David (bronze)", "Gattamelata equestrian statue"],
    blurb: "Quattrocento sculptor who revived classical form."
  },

  // ===== WRITERS =====
  {
    name: "William Shakespeare", type: "Writer", civ: "England", country: "United Kingdom",
    era: "Renaissance", born: 1564, died: 1616,
    birth: { name: "Stratford-upon-Avon", coords: [52.1917, -1.7073] },
    work:  { name: "London (Globe Theatre)", coords: [51.5081, -0.0972] },
    death: { name: "Stratford-upon-Avon", coords: [52.1917, -1.7073] },
    works: ["Hamlet", "King Lear", "Macbeth", "Sonnets"],
    blurb: "Most influential playwright in the English language."
  },
  {
    name: "Miguel de Cervantes", type: "Writer", civ: "Spain", country: "Spain",
    era: "Renaissance", born: 1547, died: 1616,
    birth: { name: "Alcalá de Henares", coords: [40.4818, -3.3645] },
    work:  { name: "Madrid", coords: [40.4168, -3.7038] },
    death: { name: "Madrid", coords: [40.4168, -3.7038] },
    works: ["Don Quixote"],
    blurb: "Father of the modern novel."
  },
  {
    name: "Homer", type: "Writer", civ: "Greece", country: "Greece (Ionia)",
    era: "Ancient", born: -800, died: -700,
    birth: { name: "Smyrna (Izmir)", coords: [38.4192, 27.1287] },
    work:  { name: "Chios (traditional)", coords: [38.3680, 26.1357] },
    death: { name: "Ios (traditional)", coords: [36.7333, 25.2833] },
    works: ["The Iliad", "The Odyssey"],
    blurb: "Foundational poet of Western literature."
  },
  {
    name: "Murasaki Shikibu", type: "Writer", civ: "Japan", country: "Japan",
    era: "Medieval", born: 973, died: 1014,
    birth: { name: "Heian-kyō (Kyoto)", coords: [35.0116, 135.7681] },
    work:  { name: "Heian-kyō (Kyoto)", coords: [35.0116, 135.7681] },
    death: { name: "Kyoto", coords: [35.0116, 135.7681] },
    works: ["The Tale of Genji"],
    blurb: "Wrote the world's first psychological novel."
  },
  {
    name: "Leo Tolstoy", type: "Writer", civ: "Russia", country: "Russia",
    era: "Industrial", born: 1828, died: 1910,
    birth: { name: "Yasnaya Polyana", coords: [54.0742, 37.5247] },
    work:  { name: "Yasnaya Polyana", coords: [54.0742, 37.5247] },
    death: { name: "Astapovo (Lev Tolstoy)", coords: [53.2042, 39.4500] },
    works: ["War and Peace", "Anna Karenina"],
    blurb: "Russian realist of unmatched scope."
  },
  {
    name: "Mark Twain", type: "Writer", civ: "America", country: "USA",
    era: "Industrial", born: 1835, died: 1910,
    birth: { name: "Florida, Missouri", coords: [39.4928, -91.7846] },
    work:  { name: "Hartford, CT", coords: [41.7658, -72.6734] },
    death: { name: "Redding, CT", coords: [41.3026, -73.3839] },
    works: ["Adventures of Huckleberry Finn", "Tom Sawyer"],
    blurb: "Defining voice of American letters."
  },
  {
    name: "Li Bai", type: "Writer", civ: "China", country: "China",
    era: "Medieval", born: 701, died: 762,
    birth: { name: "Suyab (modern Kyrgyzstan)", coords: [42.7544, 75.2057] },
    work:  { name: "Chang'an (Xi'an)", coords: [34.3416, 108.9398] },
    death: { name: "Dangtu", coords: [31.5560, 118.4979] },
    works: ["Quiet Night Thought", "Drinking Alone by Moonlight"],
    blurb: "Iconic Tang dynasty poet."
  },
  {
    name: "Goethe", type: "Writer", civ: "Germany", country: "Germany",
    era: "Industrial", born: 1749, died: 1832,
    birth: { name: "Frankfurt am Main", coords: [50.1109, 8.6821] },
    work:  { name: "Weimar", coords: [50.9795, 11.3235] },
    death: { name: "Weimar", coords: [50.9795, 11.3235] },
    works: ["Faust", "The Sorrows of Young Werther"],
    blurb: "Towering figure of German literature."
  },

  // ===== MUSICIANS =====
  {
    name: "Wolfgang Amadeus Mozart", type: "Musician", civ: "Austria", country: "Austria",
    era: "Industrial", born: 1756, died: 1791,
    birth: { name: "Salzburg", coords: [47.8095, 13.0550] },
    work:  { name: "Vienna", coords: [48.2082, 16.3738] },
    death: { name: "Vienna", coords: [48.2082, 16.3738] },
    works: ["The Magic Flute", "Requiem in D minor", "Symphony No. 41"],
    blurb: "Classical-era prodigy."
  },
  {
    name: "Ludwig van Beethoven", type: "Musician", civ: "Germany/Austria", country: "Germany/Austria",
    era: "Industrial", born: 1770, died: 1827,
    birth: { name: "Bonn", coords: [50.7374, 7.0982] },
    work:  { name: "Vienna", coords: [48.2082, 16.3738] },
    death: { name: "Vienna", coords: [48.2082, 16.3738] },
    works: ["Symphony No. 9", "Fifth Symphony", "Moonlight Sonata"],
    blurb: "Bridge from Classical to Romantic music."
  },
  {
    name: "Johann Sebastian Bach", type: "Musician", civ: "Germany", country: "Germany",
    era: "Renaissance", born: 1685, died: 1750,
    birth: { name: "Eisenach", coords: [50.9747, 10.3144] },
    work:  { name: "Leipzig", coords: [51.3397, 12.3731] },
    death: { name: "Leipzig", coords: [51.3397, 12.3731] },
    works: ["Brandenburg Concertos", "Mass in B minor", "Well-Tempered Clavier"],
    blurb: "Apex of Baroque counterpoint."
  },
  {
    name: "Frédéric Chopin", type: "Musician", civ: "Poland/France", country: "Poland/France",
    era: "Industrial", born: 1810, died: 1849,
    birth: { name: "Żelazowa Wola", coords: [52.2604, 20.2528] },
    work:  { name: "Paris", coords: [48.8566, 2.3522] },
    death: { name: "Paris", coords: [48.8566, 2.3522] },
    works: ["Études Op. 10", "Nocturnes", "Ballades"],
    blurb: "Defined the Romantic piano."
  },
  {
    name: "Pyotr Ilyich Tchaikovsky", type: "Musician", civ: "Russia", country: "Russia",
    era: "Industrial", born: 1840, died: 1893,
    birth: { name: "Votkinsk", coords: [57.0512, 54.0048] },
    work:  { name: "Moscow", coords: [55.7558, 37.6173] },
    death: { name: "Saint Petersburg", coords: [59.9311, 30.3609] },
    works: ["Swan Lake", "The Nutcracker", "1812 Overture"],
    blurb: "Russia's most performed Romantic composer."
  },
  {
    name: "Antonio Vivaldi", type: "Musician", civ: "Venice", country: "Italy",
    era: "Renaissance", born: 1678, died: 1741,
    birth: { name: "Venice", coords: [45.4408, 12.3155] },
    work:  { name: "Venice", coords: [45.4408, 12.3155] },
    death: { name: "Vienna", coords: [48.2082, 16.3738] },
    works: ["The Four Seasons", "Gloria"],
    blurb: "Baroque master of the concerto."
  },
  {
    name: "Louis Armstrong", type: "Musician", civ: "America", country: "USA",
    era: "Modern", born: 1901, died: 1971,
    birth: { name: "New Orleans", coords: [29.9511, -90.0715] },
    work:  { name: "New York City", coords: [40.7128, -74.0060] },
    death: { name: "Queens, New York", coords: [40.7282, -73.7949] },
    works: ["What a Wonderful World", "Hot Five recordings"],
    blurb: "Made jazz a soloist's art."
  },

  // ===== GENERALS =====
  {
    name: "Alexander the Great", type: "General", civ: "Greece/Macedon", country: "Greece",
    era: "Classical", born: -356, died: -323,
    birth: { name: "Pella", coords: [40.7574, 22.5247] },
    work:  { name: "Babylon", coords: [32.5364, 44.4209] },
    death: { name: "Babylon", coords: [32.5364, 44.4209] },
    works: ["Conquest of Persia", "Battle of Gaugamela", "Hellenistic world"],
    blurb: "Conquered the known world by age 30."
  },
  {
    name: "Julius Caesar", type: "General", civ: "Rome", country: "Roman Italy",
    era: "Classical", born: -100, died: -44,
    birth: { name: "Rome", coords: [41.9028, 12.4964] },
    work:  { name: "Gaul / Rome", coords: [48.8566, 2.3522] },
    death: { name: "Rome (Curia of Pompey)", coords: [41.8955, 12.4823] },
    works: ["Conquest of Gaul", "Commentarii de Bello Gallico"],
    blurb: "Ended the Roman Republic."
  },
  {
    name: "Hannibal Barca", type: "General", civ: "Carthage", country: "Tunisia",
    era: "Classical", born: -247, died: -183,
    birth: { name: "Carthage", coords: [36.8528, 10.3236] },
    work:  { name: "Italy (Alps crossing)", coords: [45.8326, 6.8652] },
    death: { name: "Libyssa, Bithynia", coords: [40.7674, 29.5121] },
    works: ["Crossing the Alps", "Battle of Cannae"],
    blurb: "Brought Rome to its knees at Cannae."
  },
  {
    name: "Napoleon Bonaparte", type: "General", civ: "France", country: "France",
    era: "Industrial", born: 1769, died: 1821,
    birth: { name: "Ajaccio, Corsica", coords: [41.9192, 8.7386] },
    work:  { name: "Paris", coords: [48.8566, 2.3522] },
    death: { name: "Longwood, Saint Helena", coords: [-15.9650, -5.7089] },
    works: ["Austerlitz", "Napoleonic Code", "Continental System"],
    blurb: "Reshaped Europe's borders and institutions."
  },
  {
    name: "Genghis Khan", type: "General", civ: "Mongolia", country: "Mongolia",
    era: "Medieval", born: 1162, died: 1227,
    birth: { name: "Khentii Mountains", coords: [48.4500, 109.0000] },
    work:  { name: "Karakorum", coords: [47.1833, 102.8333] },
    death: { name: "Yinchuan region", coords: [38.4872, 106.2309] },
    works: ["Mongol Empire", "Yassa code"],
    blurb: "Built the largest contiguous land empire in history."
  },
  {
    name: "Sun Tzu", type: "General", civ: "China", country: "China",
    era: "Classical", born: -544, died: -496,
    birth: { name: "Qi (Shandong)", coords: [36.6512, 117.1201] },
    work:  { name: "Wu (Suzhou)", coords: [31.2989, 120.5853] },
    death: { name: "Wu (Suzhou)", coords: [31.2989, 120.5853] },
    works: ["The Art of War"],
    blurb: "Foundational military theorist."
  },
  {
    name: "Saladin", type: "General", civ: "Arabia", country: "Iraq/Egypt/Syria",
    era: "Medieval", born: 1137, died: 1193,
    birth: { name: "Tikrit", coords: [34.5959, 43.6766] },
    work:  { name: "Cairo / Damascus", coords: [30.0444, 31.2357] },
    death: { name: "Damascus", coords: [33.5138, 36.2765] },
    works: ["Recapture of Jerusalem (1187)", "Ayyubid Sultanate"],
    blurb: "Defeated the Crusaders at Hattin."
  },
  {
    name: "George Washington", type: "General", civ: "America", country: "USA",
    era: "Industrial", born: 1732, died: 1799,
    birth: { name: "Westmoreland County, VA", coords: [38.1845, -76.9230] },
    work:  { name: "Yorktown, VA", coords: [37.2387, -76.5097] },
    death: { name: "Mount Vernon, VA", coords: [38.7293, -77.1075] },
    works: ["Siege of Yorktown", "1st US President"],
    blurb: "Commanded the Continental Army to independence."
  },

  // ===== ADMIRALS =====
  {
    name: "Horatio Nelson", type: "Admiral", civ: "England", country: "United Kingdom",
    era: "Industrial", born: 1758, died: 1805,
    birth: { name: "Burnham Thorpe", coords: [52.9395, 0.7240] },
    work:  { name: "Mediterranean / Atlantic", coords: [36.1408, -5.3536] },
    death: { name: "HMS Victory, off Cape Trafalgar", coords: [36.1833, -6.0333] },
    works: ["Battle of the Nile", "Battle of Trafalgar"],
    blurb: "Ended Napoleon's naval ambitions at Trafalgar."
  },
  {
    name: "Yi Sun-sin", type: "Admiral", civ: "Korea", country: "South Korea",
    era: "Renaissance", born: 1545, died: 1598,
    birth: { name: "Seoul (Hanseong)", coords: [37.5665, 126.9780] },
    work:  { name: "Hansan-do", coords: [34.7833, 128.5167] },
    death: { name: "Noryang Strait", coords: [34.9333, 127.8833] },
    works: ["Turtle ships", "Battle of Myeongnyang", "Battle of Hansan-do"],
    blurb: "Undefeated against the Japanese Imjin invasion."
  },
  {
    name: "Themistocles", type: "Admiral", civ: "Greece", country: "Greece",
    era: "Classical", born: -524, died: -459,
    birth: { name: "Athens", coords: [37.9838, 23.7275] },
    work:  { name: "Salamis", coords: [37.9685, 23.4806] },
    death: { name: "Magnesia on the Maeander", coords: [37.8511, 27.5311] },
    works: ["Athenian fleet", "Battle of Salamis"],
    blurb: "Built the navy that broke the Persian invasion."
  },
  {
    name: "Francis Drake", type: "Admiral", civ: "England", country: "United Kingdom",
    era: "Renaissance", born: 1540, died: 1596,
    birth: { name: "Tavistock", coords: [50.5478, -4.1442] },
    work:  { name: "Plymouth", coords: [50.3755, -4.1427] },
    death: { name: "Off Portobelo, Panama", coords: [9.5500, -79.6500] },
    works: ["Circumnavigation of the globe", "Defeat of Spanish Armada"],
    blurb: "First Englishman to circumnavigate the Earth."
  },
  {
    name: "Chester Nimitz", type: "Admiral", civ: "America", country: "USA",
    era: "Modern", born: 1885, died: 1966,
    birth: { name: "Fredericksburg, TX", coords: [30.2752, -98.8720] },
    work:  { name: "Pearl Harbor, Hawaii", coords: [21.3649, -157.9507] },
    death: { name: "Yerba Buena Island, CA", coords: [37.8083, -122.3650] },
    works: ["Battle of Midway", "Pacific Fleet command"],
    blurb: "Architect of the US Pacific victory."
  },
  {
    name: "Cheng I Sao", type: "Admiral", civ: "China", country: "China",
    era: "Industrial", born: 1775, died: 1844,
    birth: { name: "Guangzhou", coords: [23.1291, 113.2644] },
    work:  { name: "South China Sea", coords: [16.0000, 114.0000] },
    death: { name: "Guangzhou", coords: [23.1291, 113.2644] },
    works: ["Red Flag Fleet", "Pirate code of conduct"],
    blurb: "Commanded ~70,000 pirates; negotiated her own amnesty."
  },

  // ===== PROPHETS =====
  {
    name: "Siddhartha Gautama (Buddha)", type: "Prophet", civ: "India", country: "Nepal/India",
    era: "Classical", born: -563, died: -483,
    birth: { name: "Lumbini", coords: [27.4833, 83.2767] },
    work:  { name: "Bodh Gaya", coords: [24.6963, 84.9870] },
    death: { name: "Kushinagar", coords: [26.7400, 83.8889] },
    works: ["Four Noble Truths", "Noble Eightfold Path"],
    blurb: "Founder of Buddhism."
  },
  {
    name: "Confucius", type: "Prophet", civ: "China", country: "China",
    era: "Classical", born: -551, died: -479,
    birth: { name: "Qufu", coords: [35.5969, 116.9914] },
    work:  { name: "Lu / Qufu", coords: [35.5969, 116.9914] },
    death: { name: "Qufu", coords: [35.5969, 116.9914] },
    works: ["Analects", "Five Classics (compiled tradition)"],
    blurb: "Shaped East Asian ethics and statecraft."
  },
  {
    name: "Jesus of Nazareth", type: "Prophet", civ: "Israel/Rome", country: "Israel",
    era: "Classical", born: -4, died: 33,
    birth: { name: "Bethlehem", coords: [31.7054, 35.2024] },
    work:  { name: "Galilee", coords: [32.8333, 35.5833] },
    death: { name: "Jerusalem (Golgotha)", coords: [31.7785, 35.2298] },
    works: ["Sermon on the Mount", "Parables"],
    blurb: "Central figure of Christianity."
  },
  {
    name: "Muhammad", type: "Prophet", civ: "Arabia", country: "Saudi Arabia",
    era: "Medieval", born: 570, died: 632,
    birth: { name: "Mecca", coords: [21.4225, 39.8262] },
    work:  { name: "Medina", coords: [24.5247, 39.5692] },
    death: { name: "Medina", coords: [24.5247, 39.5692] },
    works: ["Qur'an (recited)", "Constitution of Medina"],
    blurb: "Founder of Islam."
  },
  {
    name: "Moses", type: "Prophet", civ: "Israel/Egypt", country: "Egypt/Levant",
    era: "Ancient", born: -1391, died: -1271,
    birth: { name: "Goshen, Egypt", coords: [30.5333, 31.5000] },
    work:  { name: "Mount Sinai", coords: [28.5392, 33.9750] },
    death: { name: "Mount Nebo", coords: [31.7683, 35.7256] },
    works: ["Ten Commandments", "Exodus"],
    blurb: "Lawgiver of Israel."
  },
  {
    name: "Laozi", type: "Prophet", civ: "China", country: "China",
    era: "Classical", born: -571, died: -471,
    birth: { name: "Chu (Henan)", coords: [33.7400, 115.6675] },
    work:  { name: "Luoyang", coords: [34.6197, 112.4540] },
    death: { name: "Hangu Pass", coords: [34.6500, 110.8167] },
    works: ["Tao Te Ching"],
    blurb: "Founder of philosophical Daoism."
  },
  {
    name: "Zoroaster", type: "Prophet", civ: "Persia", country: "Iran",
    era: "Ancient", born: -1500, died: -1000,
    birth: { name: "Rhages (near Tehran)", coords: [35.5933, 51.4357] },
    work:  { name: "Bactria/Balkh", coords: [36.7581, 66.8978] },
    death: { name: "Balkh (traditional)", coords: [36.7581, 66.8978] },
    works: ["Gathas", "Avesta (tradition)"],
    blurb: "Founder of Zoroastrianism."
  },
  {
    name: "Adi Shankara", type: "Prophet", civ: "India", country: "India",
    era: "Medieval", born: 788, died: 820,
    birth: { name: "Kalady, Kerala", coords: [10.1667, 76.4333] },
    work:  { name: "Sringeri", coords: [13.4189, 75.2533] },
    death: { name: "Kedarnath", coords: [30.7346, 79.0669] },
    works: ["Advaita Vedanta commentaries", "Four mathas"],
    blurb: "Consolidator of Advaita Vedanta."
  },
  {
    name: "Guru Nanak", type: "Prophet", civ: "India", country: "Pakistan/India",
    era: "Renaissance", born: 1469, died: 1539,
    birth: { name: "Nankana Sahib", coords: [31.4492, 73.7011] },
    work:  { name: "Kartarpur", coords: [32.0286, 75.0083] },
    death: { name: "Kartarpur", coords: [32.0286, 75.0083] },
    works: ["Japji Sahib", "Foundation of Sikhism"],
    blurb: "First Sikh Guru."
  }
];
