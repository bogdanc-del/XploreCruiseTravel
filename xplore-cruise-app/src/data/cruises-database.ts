// ============================================================
// Cruises Database — Data Access Layer
// ============================================================
// All 20 featured cruises use REAL data from the croaziere.net API.
// Enrichment (description, tags, tier) is added on top — no invented products.
// ============================================================
import type { Cruise } from '@/lib/supabase'

// --- ScrapedCruise: raw shape from the croaziere.net API data ---
export interface ScrapedCruise {
  id: string; slug: string; title: string
  cruise_type: 'ocean' | 'river' | 'luxury'
  nights: number; price_from: number; currency: string
  departure_port: string; departure_date: string | null; departure_dates: string[]
  ports_of_call: string[]
  itinerary: { day: number; port: string; arrival: string | null; departure: string | null }[]
  image_url: string; gallery_urls: string[]
  cabin_types: { name: string; price_from: number }[]
  cruise_line: string; ship_name: string
  destination: string; destination_ro: string; destination_slug: string
  source: string; source_url: string; active: boolean
}

// --- Shared included / excluded lists ---
const INC = {
  ocean: ['Full-board meals in main restaurant & buffet', 'Entertainment & shows', 'Pool & fitness center access', 'Kids club (where available)', 'Port taxes & fees'],
  ocean_ro: ['Pensiune completă în restaurantul principal și bufet', 'Spectacole și divertisment la bord', 'Acces piscină și centru fitness', 'Club copii (unde este disponibil)', 'Taxe portuare incluse'],
  river: ['All meals on board', 'Wine & beer with lunch and dinner', 'Guided shore excursions', 'Wi-Fi on board', 'Port charges'],
  river_ro: ['Toate mesele la bord', 'Vin și bere la prânz și cină', 'Excursii ghidate la țărm', 'Wi-Fi la bord', 'Taxe portuare'],
  luxury: ['All-inclusive beverages', 'Specialty dining at no extra charge', 'Shore excursions in every port', 'Wi-Fi & gratuities included', 'Butler service (suite guests)'],
  luxury_ro: ['Băuturi all-inclusive', 'Restaurante de specialitate fără cost suplimentar', 'Excursii în fiecare port', 'Wi-Fi și bacșișuri incluse', 'Serviciu de butler (suite)'],
}
const EXC = {
  ocean: ['Flights to/from embarkation port', 'Shore excursions', 'Specialty dining', 'Beverage packages', 'Spa treatments', 'Travel insurance'],
  ocean_ro: ['Zbor către/de la portul de îmbarcare', 'Excursii la țărm', 'Restaurante de specialitate', 'Pachete de băuturi', 'Tratamente spa', 'Asigurare de călătorie'],
  river: ['Flights', 'Premium beverages', 'Gratuities', 'Travel insurance'],
  river_ro: ['Zboruri', 'Băuturi premium', 'Bacșișuri', 'Asigurare de călătorie'],
  luxury: ['Flights', 'Premium spa treatments', 'Travel insurance'],
  luxury_ro: ['Zboruri', 'Tratamente spa premium', 'Asigurare de călătorie'],
}

// Helper to build a Cruise object from real API data + enrichment fields
function fc(d: Partial<Cruise> & {
  id: string; slug: string; title: string; title_ro: string;
  cruise_type: Cruise['cruise_type']; nights: number; price_from: number;
  departure_port: string; departure_date: string;
  ports_of_call: string[]; ports_of_call_ro: string[];
  image_url: string; gallery_urls: string[]; tags: string[];
  cruise_line: string; ship_name: string;
  destination: string; destination_ro: string; destination_slug: string;
  tier: 'ocean' | 'river' | 'luxury';
}): Cruise {
  const { tier, ...rest } = d
  return {
    currency: 'EUR', source: 'croaziere.net',
    featured: true, active: true,
    included: INC[tier], included_ro: INC[`${tier}_ro` as keyof typeof INC],
    excluded: EXC[tier], excluded_ro: EXC[`${tier}_ro` as keyof typeof EXC],
    ...rest,
  } as Cruise
}

// ------------------------------------------------------------------
// FEATURED_CRUISES — 20 real API cruises, enriched with descriptions & tags
// ------------------------------------------------------------------
export const FEATURED_CRUISES: Cruise[] = [
  // ── 1. MSC Sinfonia 7n Genova — Western Med ──
  fc({
    id: '88571', slug: 'mediterana-msc-cruises-msc-sinfonia-7-nopti-88571', tier: 'ocean',
    title: 'MSC Sinfonia — 7 Nights from Genova', title_ro: 'MSC Sinfonia — 7 Nopți din Genova',
    cruise_type: 'ocean', nights: 7, price_from: 633,
    departure_port: 'Genova, Italia', departure_port_ro: 'Genova, Italia', departure_date: '2026-11-10',
    disembarkation_port: 'Genova, Italia', disembarkation_port_ro: 'Genova, Italia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2019/5/3/big-msc15003645-npxf.jpg',
    gallery_urls: [],
    description: 'Classic Western Mediterranean voyage from Genova aboard MSC Sinfonia. Sun-kissed Italian and French Riviera ports.',
    description_ro: 'Croazieră clasică în Mediterana de Vest din Genova la bordul MSC Sinfonia. Porturi pe Riviera italiană și franceză.',
    tags: ['mediterranean', 'value', 'families'],
    cruise_line: 'MSC Cruises', ship_name: 'MSC Sinfonia',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 2. Costa Pacifica 7n Savona — Western Med ──
  fc({
    id: '86724', slug: 'mediterana-costa-cruises-costa-pacifica-7-nopti-86724', tier: 'ocean',
    title: 'Costa Pacifica — 7 Nights from Savona', title_ro: 'Costa Pacifica — 7 Nopți din Savona',
    cruise_type: 'ocean', nights: 7, price_from: 639,
    departure_port: 'Savona, Italia', departure_port_ro: 'Savona, Italia', departure_date: '2026-05-17',
    disembarkation_port: 'Savona, Italia', disembarkation_port_ro: 'Savona, Italia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2018/12/28/big-1-x1w5.jpg',
    gallery_urls: [],
    description: 'Explore the Western Mediterranean from Savona aboard Costa Pacifica. Italian elegance meets Mediterranean charm.',
    description_ro: 'Explorează Mediterana de Vest din Savona la bordul Costa Pacifica. Eleganță italiană și farmec mediteranean.',
    tags: ['mediterranean', 'value', 'italian-style'],
    cruise_line: 'Costa Cruises', ship_name: 'Costa Pacifica',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 3. MSC World Europa 7n Barcelona — Western Med ──
  fc({
    id: '61375', slug: 'mediterana-msc-cruises-msc-world-europa-7-nopti-61375', tier: 'ocean',
    title: 'MSC World Europa — 7 Nights from Barcelona', title_ro: 'MSC World Europa — 7 Nopți din Barcelona',
    cruise_type: 'ocean', nights: 7, price_from: 713,
    departure_port: 'Barcelona, Spania', departure_port_ro: 'Barcelona, Spania', departure_date: '2026-03-13',
    disembarkation_port: 'Barcelona, Spania', disembarkation_port_ro: 'Barcelona, Spania',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2025/8/12/big-msc22013756-mkkz-cswv.jpg',
    gallery_urls: [],
    description: 'Sail the Western Mediterranean aboard MSC World Europa, one of the newest and most innovative mega-ships afloat.',
    description_ro: 'Navighează în Mediterana de Vest la bordul MSC World Europa, una dintre cele mai noi și inovatoare nave din lume.',
    advisor_note: 'MSC World Europa features the longest dry slide at sea and 13 dining venues — ideal for families.',
    advisor_note_ro: 'MSC World Europa are cel mai lung tobogan uscat pe mare și 13 restaurante — ideal pentru familii.',
    tags: ['best-seller', 'families', 'new-ship', 'mediterranean'],
    cruise_line: 'MSC Cruises', ship_name: 'MSC World Europa',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 4. MSC Orchestra 7n Genova — Western Med ──
  fc({
    id: '76784', slug: 'mediterana-msc-cruises-msc-orchestra-7-nopti-76784', tier: 'ocean',
    title: 'MSC Orchestra — 7 Nights from Genova', title_ro: 'MSC Orchestra — 7 Nopți din Genova',
    cruise_type: 'ocean', nights: 7, price_from: 643,
    departure_port: 'Genova, Italia', departure_port_ro: 'Genova, Italia', departure_date: '2026-04-29',
    disembarkation_port: 'Genova, Italia', disembarkation_port_ro: 'Genova, Italia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2019/5/3/big-msc13014113-had9.jpg',
    gallery_urls: [],
    description: 'Discover Mediterranean highlights from Genova aboard MSC Orchestra. A well-priced gateway to Italy, France and Spain.',
    description_ro: 'Descoperă atracțiile Mediteranei din Genova la bordul MSC Orchestra. Preț excelent pentru Italia, Franța și Spania.',
    tags: ['mediterranean', 'value', 'couples'],
    cruise_line: 'MSC Cruises', ship_name: 'MSC Orchestra',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 5. MSC Divina 7n Napoli — Eastern Med / Greek ──
  fc({
    id: '83485', slug: 'mediterana-msc-cruises-msc-divina-7-nopti-83485', tier: 'ocean',
    title: 'MSC Divina — 7 Nights from Napoli', title_ro: 'MSC Divina — 7 Nopți din Napoli',
    cruise_type: 'ocean', nights: 7, price_from: 733,
    departure_port: 'Napoli, Italia', departure_port_ro: 'Napoli, Italia', departure_date: '2026-04-30',
    disembarkation_port: 'Napoli, Italia', disembarkation_port_ro: 'Napoli, Italia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2023/2/21/big-msc13011801-ti0s-1-y7mp.jpg',
    gallery_urls: [],
    description: 'Greek Islands and Eastern Mediterranean from Naples aboard MSC Divina. Iconic Sophia Loren-inspired interiors.',
    description_ro: 'Insulele Grecești și Mediterana de Est din Napoli la bordul MSC Divina. Interioare inspirate de Sophia Loren.',
    tags: ['greek-islands', 'mediterranean', 'couples'],
    cruise_line: 'MSC Cruises', ship_name: 'MSC Divina',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 6. Costa Fascinosa 7n Athens — Eastern Med / Greek ──
  fc({
    id: '79499', slug: 'mediterana-grecia-costa-cruises-costa-fascinosa-7-nopti-79499', tier: 'ocean',
    title: 'Costa Fascinosa — 7 Nights from Athens', title_ro: 'Costa Fascinosa — 7 Nopți din Atena',
    cruise_type: 'ocean', nights: 7, price_from: 789,
    departure_port: 'Atena (Piraeus), Grecia', departure_port_ro: 'Atena (Piraeus), Grecia', departure_date: '2026-06-10',
    disembarkation_port: 'Atena (Piraeus), Grecia', disembarkation_port_ro: 'Atena (Piraeus), Grecia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2018/12/12/big-00016701-temy.jpg',
    gallery_urls: [],
    description: 'Explore the Greek Islands from Athens aboard Costa Fascinosa. Mykonos, Santorini, and Aegean sunshine await.',
    description_ro: 'Explorează Insulele Grecești din Atena la bordul Costa Fascinosa. Mykonos, Santorini și soare egeean.',
    advisor_note: 'Book early for summer Greek Islands sailings — balcony cabins sell out fast.',
    advisor_note_ro: 'Rezervă din timp pentru croazierele de vară în Insulele Grecești — cabinele cu balcon se epuizează rapid.',
    tags: ['greek-islands', 'best-seller', 'couples'],
    cruise_line: 'Costa Cruises', ship_name: 'Costa Fascinosa',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 7. Brilliance of the Seas 7n Ravenna — Eastern Med / Greek ──
  fc({
    id: '87455', slug: 'mediterana-royal-caribbean-cruise-line-brilliance-of-the-seas-7-nopti-87455', tier: 'ocean',
    title: 'Brilliance of the Seas — 7 Nights from Ravenna', title_ro: 'Brilliance of the Seas — 7 Nopți din Ravenna',
    cruise_type: 'ocean', nights: 7, price_from: 948,
    departure_port: 'Ravenna, Italia', departure_port_ro: 'Ravenna, Italia', departure_date: '2027-05-15',
    disembarkation_port: 'Ravenna, Italia', disembarkation_port_ro: 'Ravenna, Italia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/10/24/big-bos-at-valetta-121410-mvde.jpg',
    gallery_urls: [],
    description: 'Royal Caribbean\'s Brilliance of the Seas sails the Greek Islands from Ravenna. A premium Mediterranean experience.',
    description_ro: 'Brilliance of the Seas de la Royal Caribbean navighează prin Insulele Grecești din Ravenna.',
    tags: ['greek-islands', 'mediterranean', 'premium'],
    cruise_line: 'Royal Caribbean Cruise Line', ship_name: 'Brilliance of the Seas',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 8. Carnival Vista 7n Port Canaveral — Caribbean ──
  fc({
    id: '86555', slug: 'caraibe-si-america-centrala-carnival-cruise-line-carnival-vista-7-nopti-86555', tier: 'ocean',
    title: 'Carnival Vista — 7 Nights from Port Canaveral', title_ro: 'Carnival Vista — 7 Nopți din Port Canaveral',
    cruise_type: 'ocean', nights: 7, price_from: 468,
    departure_port: 'Port Canaveral, FL', departure_port_ro: 'Port Canaveral, FL', departure_date: '2027-05-09',
    disembarkation_port: 'Port Canaveral, FL', disembarkation_port_ro: 'Port Canaveral, FL',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/9/4/big-carnival-vista-fq3h.jpg',
    gallery_urls: [],
    description: 'Fun-filled Caribbean adventure from Port Canaveral aboard Carnival Vista. Great value with an iconic SkyRide and IMAX.',
    description_ro: 'Aventură în Caraibe din Port Canaveral la bordul Carnival Vista. Valoare excelentă cu SkyRide și IMAX la bord.',
    tags: ['caribbean', 'families', 'value'],
    cruise_line: 'Carnival Cruise Line', ship_name: 'Carnival Vista',
    destination: 'Caribbean & Central America', destination_ro: 'Caraibe și America Centrala', destination_slug: 'caribbean-central-america',
  }),

  // ── 9. Rhapsody of the Seas 7n San Juan — Caribbean ──
  fc({
    id: '86758', slug: 'caraibe-si-america-centrala-royal-caribbean-cruise-line-rhapsody-of-the-seas-7-n-86758', tier: 'ocean',
    title: 'Rhapsody of the Seas — 7 Nights from San Juan', title_ro: 'Rhapsody of the Seas — 7 Nopți din San Juan',
    cruise_type: 'ocean', nights: 7, price_from: 480,
    departure_port: 'San Juan, Puerto Rico', departure_port_ro: 'San Juan, Puerto Rico', departure_date: '2026-04-25',
    disembarkation_port: 'San Juan, Puerto Rico', disembarkation_port_ro: 'San Juan, Puerto Rico',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/10/8/big-rots-and-opera-house1-aisy.jpg',
    gallery_urls: [],
    description: 'Southern Caribbean exploration from San Juan aboard Rhapsody of the Seas. Turquoise waters and tropical islands.',
    description_ro: 'Explorare în Caraibele de Sud din San Juan la bordul Rhapsody of the Seas. Ape turcoaz și insule tropicale.',
    tags: ['caribbean', 'adventure', 'couples'],
    cruise_line: 'Royal Caribbean Cruise Line', ship_name: 'Rhapsody of the Seas',
    destination: 'Caribbean & Central America', destination_ro: 'Caraibe și America Centrala', destination_slug: 'caribbean-central-america',
  }),

  // ── 10. Costa Diadema 7n Kiel — Baltic ──
  fc({
    id: '81095', slug: 'europa-de-nord-costa-cruises-costa-diadema-7-nopti-81095', tier: 'ocean',
    title: 'Costa Diadema — 7 Nights from Kiel', title_ro: 'Costa Diadema — 7 Nopți din Kiel',
    cruise_type: 'ocean', nights: 7, price_from: 999,
    departure_port: 'Kiel, Germania', departure_port_ro: 'Kiel, Germania', departure_date: '2026-06-19',
    disembarkation_port: 'Kiel, Germania', disembarkation_port_ro: 'Kiel, Germania',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2018/12/11/big-00017871-8lno.jpg',
    gallery_urls: [],
    description: 'Discover Northern Europe and Baltic capitals from Kiel aboard Costa Diadema. Copenhagen, Stockholm, and more.',
    description_ro: 'Descoperă Europa de Nord și capitalele Balticii din Kiel la bordul Costa Diadema. Copenhaga, Stockholm și altele.',
    tags: ['baltic', 'culture', 'capitals'],
    cruise_line: 'Costa Cruises', ship_name: 'Costa Diadema',
    destination: 'Northern Europe', destination_ro: 'Europa de Nord', destination_slug: 'northern-europe',
  }),

  // ── 11. Rotterdam 7n Rotterdam — Norwegian Fjords ──
  fc({
    id: '74490', slug: 'europa-de-nord-holland-america-line-rotterdam-7-nopti-74490', tier: 'ocean',
    title: 'Rotterdam — 7 Nights from Rotterdam', title_ro: 'Rotterdam — 7 Nopți din Rotterdam',
    cruise_type: 'ocean', nights: 7, price_from: 1709,
    departure_port: 'Rotterdam, Olanda', departure_port_ro: 'Rotterdam, Olanda', departure_date: '2026-07-05',
    disembarkation_port: 'Rotterdam, Olanda', disembarkation_port_ro: 'Rotterdam, Olanda',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2023/2/16/big-rotterdam-vinardi-cf014481-ccr-1-ykvv.jpg',
    gallery_urls: [],
    description: 'Premium Norwegian Fjords voyage from Rotterdam aboard Holland America\'s flagship. Majestic scenery and refined service.',
    description_ro: 'Croazieră premium prin Fiordurile Norvegiene din Rotterdam la bordul navei amiral Holland America.',
    advisor_note: 'Holland America offers a refined, adult-oriented experience — perfect for couples and culture lovers.',
    advisor_note_ro: 'Holland America oferă o experiență rafinată pentru adulți — perfectă pentru cupluri și iubitori de cultură.',
    tags: ['fjords', 'premium', 'nature', 'scenic'],
    cruise_line: 'Holland America Line', ship_name: 'Rotterdam',
    destination: 'Northern Europe', destination_ro: 'Europa de Nord', destination_slug: 'northern-europe',
  }),

  // ── 12. Celebrity Infinity 12n Barcelona — Canary Islands ──
  fc({
    id: '72598', slug: 'mediterana-celebrity-cruises-celebrity-infinity-12-nopti-72598', tier: 'ocean',
    title: 'Celebrity Infinity — 12 Nights from Barcelona', title_ro: 'Celebrity Infinity — 12 Nopți din Barcelona',
    cruise_type: 'ocean', nights: 12, price_from: 957,
    departure_port: 'Barcelona, Spania', departure_port_ro: 'Barcelona, Spania', departure_date: '2026-11-14',
    disembarkation_port: 'Barcelona, Spania', disembarkation_port_ro: 'Barcelona, Spania',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/9/9/big-celebrity-infinity-ship-2001-002-phvg.jpg',
    gallery_urls: [],
    description: 'Escape to the Canary Islands aboard Celebrity Infinity. 12 nights of warm-weather cruising from Barcelona.',
    description_ro: 'Evadează în Insulele Canare la bordul Celebrity Infinity. 12 nopți de croazieră cu vreme caldă din Barcelona.',
    tags: ['canary-islands', 'winter-sun', 'premium'],
    cruise_line: 'Celebrity Cruises', ship_name: 'Celebrity Infinity',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 13. Costa Smeralda 7n Dubai — Emirates ──
  fc({
    id: '70141', slug: 'orientul-mijlociu-costa-cruises-costa-smeralda-7-nopti-70141', tier: 'ocean',
    title: 'Costa Smeralda — 7 Nights from Dubai', title_ro: 'Costa Smeralda — 7 Nopți din Dubai',
    cruise_type: 'ocean', nights: 7, price_from: 679,
    departure_port: 'Dubai, Emiratele Arabe Unite', departure_port_ro: 'Dubai, Emiratele Arabe Unite', departure_date: '2027-01-03',
    disembarkation_port: 'Dubai, Emiratele Arabe Unite', disembarkation_port_ro: 'Dubai, Emiratele Arabe Unite',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2020/2/19/big-00019202-mupz.jpg',
    gallery_urls: [],
    description: 'Winter sun in the Arabian Gulf aboard Costa Smeralda from Dubai. Abu Dhabi, Doha, and desert sunsets.',
    description_ro: 'Soare de iarnă în Golful Arab la bordul Costa Smeralda din Dubai. Abu Dhabi, Doha și apusuri deșertice.',
    tags: ['winter-sun', 'dubai', 'families'],
    cruise_line: 'Costa Cruises', ship_name: 'Costa Smeralda',
    destination: 'Middle East', destination_ro: 'Orientul Mijlociu', destination_slug: 'middle-east',
  }),

  // ── 14. Carnival Freedom 13n Barcelona — Transatlantic ──
  fc({
    id: '77028', slug: 'repozitionari-si-transoceanic-carnival-cruise-line-carnival-freedom-13-nopti-77028', tier: 'ocean',
    title: 'Carnival Freedom — 13 Nights Transatlantic from Barcelona', title_ro: 'Carnival Freedom — 13 Nopți Transatlantic din Barcelona',
    cruise_type: 'ocean', nights: 13, price_from: 532,
    departure_port: 'Barcelona, Spania', departure_port_ro: 'Barcelona, Spania', departure_date: '2026-10-17',
    disembarkation_port: 'Port Canaveral, FL', disembarkation_port_ro: 'Port Canaveral, FL',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/9/7/big-freedomcozumel1-1k4t.jpg',
    gallery_urls: [],
    description: 'Cross the Atlantic from Barcelona to Florida aboard Carnival Freedom. 13 nights at an incredible per-night price.',
    description_ro: 'Traversează Atlanticul din Barcelona în Florida la bordul Carnival Freedom. 13 nopți la un preț incredibil pe noapte.',
    advisor_note: 'Repositioning cruises offer the best value per night. Perfect for remote workers or retirees.',
    advisor_note_ro: 'Croazierele de repoziționare oferă cel mai bun preț pe noapte. Perfecte pentru lucrul la distanță sau pensionari.',
    tags: ['transatlantic', 'value', 'long-voyage'],
    cruise_line: 'Carnival Cruise Line', ship_name: 'Carnival Freedom',
    destination: 'Repositioning & Transatlantic', destination_ro: 'Repoziționări și Transoceanic', destination_slug: 'repositioning-transatlantic',
  }),

  // ── 15. Island Princess 7n Vancouver — Alaska ──
  fc({
    id: '68477', slug: 'alaska-princess-cruises-island-princess-7-nopti-68477', tier: 'ocean',
    title: 'Island Princess — 7 Nights from Vancouver', title_ro: 'Island Princess — 7 Nopți din Vancouver',
    cruise_type: 'river' as Cruise['cruise_type'], nights: 7, price_from: 504,
    departure_port: 'Vancouver, Canada', departure_port_ro: 'Vancouver, Canada', departure_date: '2026-05-13',
    disembarkation_port: 'Anchorage (Whittier), AK', disembarkation_port_ro: 'Anchorage (Whittier), AK',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2016/2/23/big-island-princess1-uwjr.jpg',
    gallery_urls: [],
    description: 'Witness glaciers, whales, and pristine Alaskan wilderness aboard Princess Cruises\' Island Princess from Vancouver.',
    description_ro: 'Descoperă ghețari, balene și sălbăticia din Alaska la bordul Island Princess din Vancouver.',
    tags: ['alaska', 'nature', 'wildlife', 'scenic'],
    cruise_line: 'Princess Cruises', ship_name: 'Island Princess',
    destination: 'Alaska', destination_ro: 'Alaska', destination_slug: 'alaska',
  }),

  // ── 16. Celebrity Millennium 12n Tokyo — Asia ──
  fc({
    id: '69254', slug: 'asia-japonia-celebrity-cruises-celebrity-millennium-12-nopti-69254', tier: 'ocean',
    title: 'Celebrity Millennium — 12 Nights from Tokyo', title_ro: 'Celebrity Millennium — 12 Nopți din Tokyo',
    cruise_type: 'ocean', nights: 12, price_from: 1986,
    departure_port: 'Tokyo (Yokohama), Japonia', departure_port_ro: 'Tokyo (Yokohama), Japonia', departure_date: '2026-06-07',
    disembarkation_port: 'Tokyo (Yokohama), Japonia', disembarkation_port_ro: 'Tokyo (Yokohama), Japonia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2015/9/9/big-freshcruiser-celebrity-millennium-ship-rkne.jpg',
    gallery_urls: [],
    description: 'Explore Japan and Asia aboard Celebrity Millennium from Tokyo. Ancient temples, modern cities, and world-class cuisine.',
    description_ro: 'Explorează Japonia și Asia la bordul Celebrity Millennium din Tokyo. Temple antice, orașe moderne și bucătărie de clasă mondială.',
    tags: ['asia', 'culture', 'premium'],
    cruise_line: 'Celebrity Cruises', ship_name: 'Celebrity Millennium',
    destination: 'Asia', destination_ro: 'Asia', destination_slug: 'asia',
  }),

  // ── 17. VIVA ENJOY 7n Vienna — River Danube ──
  fc({
    id: '91218', slug: 'dunare-viva-cruises-viva-enjoy-7-nopti-91218', tier: 'river',
    title: 'VIVA ENJOY — 7 Nights from Vienna', title_ro: 'VIVA ENJOY — 7 Nopți din Viena',
    cruise_type: 'river', nights: 7, price_from: 1695,
    departure_port: 'Viena, Austria', departure_port_ro: 'Viena, Austria', departure_date: '2026-07-29',
    disembarkation_port: 'Viena, Austria', disembarkation_port_ro: 'Viena, Austria',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2025/6/23/big-image-18913781-qtud.jpg',
    gallery_urls: [],
    description: 'Danube river cruise from Vienna aboard VIVA ENJOY. Grand capitals, vineyards, and medieval towns along the way.',
    description_ro: 'Croazieră pe Dunăre din Viena la bordul VIVA ENJOY. Capitale grandioase, vii și orașe medievale.',
    tags: ['river', 'danube', 'culture'],
    cruise_line: 'Viva Cruises', ship_name: 'VIVA ENJOY',
    destination: 'Danube', destination_ro: 'Dunăre', destination_slug: 'danube',
  }),

  // ── 18. MS VistaGracia 7n Cologne — River Rhine ──
  fc({
    id: '85963', slug: 'rin-crucemundo-ms-vistagracia-7-nopti-85963', tier: 'river',
    title: 'MS VistaGracia — 7 Nights from Cologne', title_ro: 'MS VistaGracia — 7 Nopți din Koln',
    cruise_type: 'river', nights: 7, price_from: 1270,
    departure_port: 'Koln,Germania', departure_port_ro: 'Koln, Germania', departure_date: '2026-04-22',
    disembarkation_port: 'Koln,Germania', disembarkation_port_ro: 'Koln, Germania',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2025/9/19/big-1avista-reisen-ms-vistagracia-5867-20250310-0-lowa.webp',
    gallery_urls: [],
    description: 'Romantic Rhine river cruise from Cologne aboard MS VistaGracia. Medieval castles, vineyards, and charming villages.',
    description_ro: 'Croazieră pe Rinul Romantic din Koln la bordul MS VistaGracia. Castele medievale, vii și sate fermecătoare.',
    tags: ['river', 'rhine', 'wine', 'romantic'],
    cruise_line: 'Crucemundo', ship_name: 'MS VistaGracia',
    destination: 'Rhine', destination_ro: 'Rin', destination_slug: 'rhine',
  }),

  // ── 19. Celestyal Discovery 3n Athens — Mini Cruise ──
  fc({
    id: '61712', slug: 'mediterana-grecia-celestyal-cruises-celestyal-discovery-3-nopti-61712', tier: 'ocean',
    title: 'Celestyal Discovery — 3 Nights from Athens', title_ro: 'Celestyal Discovery — 3 Nopți din Atena',
    cruise_type: 'ocean', nights: 3, price_from: 349,
    departure_port: 'Athena (Lavrion), Grecia', departure_port_ro: 'Athena (Lavrion), Grecia', departure_date: '2026-03-20',
    disembarkation_port: 'Athena (Lavrion), Grecia', disembarkation_port_ro: 'Athena (Lavrion), Grecia',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2024/2/20/big-ezgif-1-8334154761-23cd.jpg',
    gallery_urls: [],
    description: 'A short Greek Islands taster cruise from Athens. Ideal for first-time cruisers wanting a taste of the Aegean.',
    description_ro: 'Mini-croazieră în Insulele Grecești din Atena. Ideală pentru cei la prima croazieră care vor să descopere Egeea.',
    advisor_note: 'Best intro to cruising — only 3 nights, perfect for clients unsure about cruise holidays.',
    advisor_note_ro: 'Cea mai bună introducere în lumea croazierelor — doar 3 nopți, ideală pentru clienții nesiguri.',
    tags: ['short-break', 'first-cruise', 'greek-islands', 'budget'],
    cruise_line: 'Celestyal Cruises', ship_name: 'Celestyal Discovery',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),

  // ── 20. Harmony of the Seas 3n Barcelona — Mini Cruise ──
  fc({
    id: '70075', slug: 'mediterana-royal-caribbean-cruise-line-harmony-of-the-seas-3-nopti-70075', tier: 'ocean',
    title: 'Harmony of the Seas — 3 Nights from Barcelona', title_ro: 'Harmony of the Seas — 3 Nopți din Barcelona',
    cruise_type: 'ocean', nights: 3, price_from: 457,
    departure_port: 'Barcelona, Spania', departure_port_ro: 'Barcelona, Spania', departure_date: '2026-05-21',
    disembarkation_port: 'Barcelona, Spania', disembarkation_port_ro: 'Barcelona, Spania',
    ports_of_call: [], ports_of_call_ro: [],
    image_url: 'https://www.croaziere.net/uploads/images/2018/12/11/big-rci-hm-aerials-june2016-498r-eesw.jpg',
    gallery_urls: [],
    description: 'Quick Mediterranean getaway aboard Harmony of the Seas from Barcelona. One of the world\'s largest cruise ships in just 3 nights.',
    description_ro: 'Escapadă rapidă în Mediterana la bordul Harmony of the Seas din Barcelona. Una dintre cele mai mari nave în doar 3 nopți.',
    tags: ['short-break', 'families', 'new-ship', 'mediterranean'],
    cruise_line: 'Royal Caribbean Cruise Line', ship_name: 'Harmony of the Seas',
    destination: 'Mediterranean', destination_ro: 'Mediterană', destination_slug: 'mediterranean',
  }),
]

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

/** Look up a cruise by slug — checks FEATURED_CRUISES first */
export function getCruiseBySlugLocal(slug: string): Cruise | undefined {
  return FEATURED_CRUISES.find((c) => c.slug === slug)
}

/** Return the full featured-cruises list */
export function getFeaturedCruisesLocal(): Cruise[] {
  return FEATURED_CRUISES
}

/** Return cruises similar to the given one, scored by destination / line / type / price proximity.
 *  Searches the FEATURED_CRUISES for best matches (they have rich content for cards). */
export function getSimilarCruises(cruise: Cruise, limit = 4): Cruise[] {
  const candidates = FEATURED_CRUISES.filter((c) => c.id !== cruise.id)
  if (candidates.length === 0) return []

  return candidates
    .map((c) => {
      let score = 0
      if (c.destination_slug === cruise.destination_slug) score += 3
      if (c.cruise_type === cruise.cruise_type) score += 2
      if (c.cruise_line === cruise.cruise_line) score += 2
      if (Math.abs(c.price_from - cruise.price_from) < 300) score += 1
      if (Math.abs(c.nights - cruise.nights) <= 2) score += 1
      return { cruise: c, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((e) => e.cruise)
}

/** Derive filter options from the featured-cruises catalogue */
export function getFilterOptions() {
  const destMap = new Map<string, { slug: string; name: string; name_ro: string }>()
  const lines = new Set<string>()
  let minP = Infinity, maxP = 0

  for (const c of FEATURED_CRUISES) {
    if (c.destination_slug && c.destination) {
      destMap.set(c.destination_slug, { slug: c.destination_slug, name: c.destination, name_ro: c.destination_ro ?? c.destination })
    }
    if (c.cruise_line) lines.add(c.cruise_line)
    if (c.price_from < minP) minP = c.price_from
    if (c.price_from > maxP) maxP = c.price_from
  }

  return {
    destinations: Array.from(destMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    cruiseLines: Array.from(lines).sort(),
    priceRange: { min: minP, max: maxP },
    cruiseTypes: ['ocean', 'river', 'luxury', 'expedition'] as const,
    nightsRange: {
      min: Math.min(...FEATURED_CRUISES.map((c) => c.nights)),
      max: Math.max(...FEATURED_CRUISES.map((c) => c.nights)),
    },
  }
}
