// ============================================================
// Cruises Database — Data Access Layer
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

// Helper to build a Cruise object concisely
function fc(d: Partial<Cruise> & { id: string; slug: string; title: string; title_ro: string; cruise_type: Cruise['cruise_type']; nights: number; price_from: number; departure_port: string; departure_date: string; ports_of_call: string[]; ports_of_call_ro: string[]; image_url: string; gallery_urls: string[]; tags: string[]; cruise_line: string; ship_name: string; destination: string; destination_ro: string; destination_slug: string; tier: 'ocean' | 'river' | 'luxury' }): Cruise {
  const { tier, ...rest } = d
  return {
    currency: 'EUR', departure_port_ro: d.departure_port, source: 'manual',
    featured: true, active: true,
    included: INC[tier], included_ro: INC[`${tier}_ro` as keyof typeof INC],
    excluded: EXC[tier], excluded_ro: EXC[`${tier}_ro` as keyof typeof EXC],
    ...rest,
  } as Cruise
}

// ------------------------------------------------------------------
// FEATURED_CRUISES — 20 diverse, hand-picked cruises
// ------------------------------------------------------------------
export const FEATURED_CRUISES: Cruise[] = [
  fc({ id: 'feat-001', slug: 'msc-mediterana-de-vest-7-nopti', tier: 'ocean',
    title: 'MSC Mediterana de Vest — 7 Nopți din Barcelona', title_ro: 'MSC Mediterana de Vest — 7 Nopți din Barcelona',
    cruise_type: 'ocean', nights: 7, price_from: 549, departure_port: 'Barcelona', departure_date: '2026-05-10',
    ports_of_call: ['Barcelona', 'Marseille', 'Genoa', 'Naples', 'Palermo', 'Valletta', 'Barcelona'],
    ports_of_call_ro: ['Barcelona', 'Marsilia', 'Genova', 'Napoli', 'Palermo', 'Valletta', 'Barcelona'],
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80', 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80'],
    description: 'Discover the best of the Western Mediterranean aboard MSC World Europa. Visit iconic ports from Barcelona to Malta.',
    description_ro: 'Descoperă cele mai frumoase destinații din Mediterana de Vest la bordul MSC World Europa.',
    tags: ['best-seller', 'families', 'mediterranean'], cruise_line: 'MSC Cruises', cruise_line_category: 'contemporary', ship_name: 'MSC World Europa',
    destination: 'Western Mediterranean', destination_ro: 'Mediterana de Vest', destination_slug: 'western-mediterranean',
  }),
  fc({ id: 'feat-002', slug: 'costa-insulele-grecesti-7-nopti', tier: 'ocean',
    title: 'Costa Insulele Grecești — 7 Nopți din Bari', title_ro: 'Costa Insulele Grecești — 7 Nopți din Bari',
    cruise_type: 'ocean', nights: 7, price_from: 499, departure_port: 'Bari', departure_date: '2026-06-14',
    ports_of_call: ['Bari', 'Corfu', 'Mykonos', 'Santorini', 'Athens (Piraeus)', 'Dubrovnik', 'Bari'],
    ports_of_call_ro: ['Bari', 'Corfu', 'Mykonos', 'Santorini', 'Atena (Pireu)', 'Dubrovnik', 'Bari'],
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'],
    description: 'Sail the Greek Islands aboard Costa Toscana. From Mykonos to Santorini — an unforgettable Aegean journey.',
    description_ro: 'Navighează prin Insulele Grecești la bordul Costa Toscana. De la Mykonos la Santorini — o călătorie de neuitat.',
    advisor_note: 'Book early for balcony cabins — Greek Islands sailings sell out fast in summer.',
    advisor_note_ro: 'Rezervă din timp pentru cabine cu balcon — croazierele în Insulele Grecești se vând rapid vara.',
    tags: ['best-seller', 'greek-islands', 'couples'], cruise_line: 'Costa Cruises', cruise_line_category: 'contemporary', ship_name: 'Costa Toscana',
    destination: 'Greek Islands', destination_ro: 'Insulele Grecești', destination_slug: 'greek-islands',
  }),
  fc({ id: 'feat-003', slug: 'royal-caribbean-caraibe-de-est-7-nopti', tier: 'ocean',
    title: 'Royal Caribbean Caraibe de Est — 7 Nopți din Miami', title_ro: 'Royal Caribbean Caraibe de Est — 7 Nopți din Miami',
    cruise_type: 'ocean', nights: 7, price_from: 799, departure_port: 'Miami', departure_date: '2026-01-17',
    ports_of_call: ['Miami', 'CocoCay', 'St. Thomas', 'St. Maarten', 'Miami'],
    ports_of_call_ro: ['Miami', 'CocoCay', 'St. Thomas', 'St. Maarten', 'Miami'],
    image_url: 'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80'],
    description: 'Experience the Caribbean aboard Icon of the Seas — the world\'s largest cruise ship.',
    description_ro: 'Trăiește experiența Caraibelor la bordul Icon of the Seas — cea mai mare navă de croazieră din lume.',
    tags: ['families', 'caribbean', 'new-ship'], cruise_line: 'Royal Caribbean', cruise_line_category: 'contemporary', ship_name: 'Icon of the Seas',
    destination: 'Caribbean', destination_ro: 'Caraibe', destination_slug: 'caribbean',
  }),
  fc({ id: 'feat-004', slug: 'viking-dunarea-8-nopti-budapesta', tier: 'river',
    title: 'Viking Dunărea — 8 Nopți Budapesta–Regensburg', title_ro: 'Viking Dunărea — 8 Nopți Budapesta–Regensburg',
    cruise_type: 'river', nights: 8, price_from: 1899, departure_port: 'Budapest', departure_port_ro: 'Budapesta', departure_date: '2026-07-05',
    ports_of_call: ['Budapest', 'Bratislava', 'Vienna', 'Dürnstein', 'Linz', 'Passau', 'Regensburg'],
    ports_of_call_ro: ['Budapesta', 'Bratislava', 'Viena', 'Dürnstein', 'Linz', 'Passau', 'Regensburg'],
    image_url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80', 'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&q=80'],
    description: 'Cruise the legendary Danube with Viking. Grand capitals, medieval towns, and vineyard-covered hillsides.',
    description_ro: 'Navighează pe legendara Dunăre cu Viking. Capitale grandioase, orașe medievale și dealuri cu vii.',
    advisor_note: 'Viking includes shore excursions and wine with meals — excellent value.',
    advisor_note_ro: 'Viking include excursii și vin la mese — excelent raport calitate-preț.',
    tags: ['river', 'culture', 'danube'], cruise_line: 'Viking River Cruises', cruise_line_category: 'river', ship_name: 'Viking Longship Hild',
    destination: 'Danube', destination_ro: 'Dunărea', destination_slug: 'danube',
  }),
  fc({ id: 'feat-005', slug: 'norwegian-fiordurile-norvegiei-10-nopti', tier: 'ocean',
    title: 'Norwegian Fiordurile Norvegiei — 10 Nopți', title_ro: 'Norwegian Fiordurile Norvegiei — 10 Nopți din Southampton',
    cruise_type: 'ocean', nights: 10, price_from: 1199, departure_port: 'Southampton', departure_date: '2026-06-20',
    ports_of_call: ['Southampton', 'Bergen', 'Flåm', 'Geiranger', 'Ålesund', 'Stavanger', 'Southampton'],
    ports_of_call_ro: ['Southampton', 'Bergen', 'Flåm', 'Geiranger', 'Ålesund', 'Stavanger', 'Southampton'],
    image_url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80', 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80'],
    description: 'Sail through the majestic Norwegian Fjords aboard Norwegian Prima. Breathtaking scenery from Geiranger to Flåm.',
    description_ro: 'Navighează prin maiestuoasele Fiorduri Norvegiene la bordul Norwegian Prima.',
    tags: ['fjords', 'nature', 'scenic'], cruise_line: 'Norwegian Cruise Line', cruise_line_category: 'contemporary', ship_name: 'Norwegian Prima',
    destination: 'Norwegian Fjords', destination_ro: 'Fiordurile Norvegiei', destination_slug: 'norwegian-fjords',
  }),
  fc({ id: 'feat-006', slug: 'celebrity-mediterana-de-est-10-nopti', tier: 'ocean',
    title: 'Celebrity Mediterana de Est — 10 Nopți din Roma', title_ro: 'Celebrity Mediterana de Est — 10 Nopți din Roma',
    cruise_type: 'ocean', nights: 10, price_from: 1099, departure_port: 'Civitavecchia (Rome)', departure_port_ro: 'Civitavecchia (Roma)', departure_date: '2026-09-06',
    ports_of_call: ['Civitavecchia', 'Naples', 'Santorini', 'Istanbul', 'Ephesus (Kusadasi)', 'Rhodes', 'Athens', 'Civitavecchia'],
    ports_of_call_ro: ['Civitavecchia', 'Napoli', 'Santorini', 'Istanbul', 'Efes (Kusadasi)', 'Rodos', 'Atena', 'Civitavecchia'],
    image_url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'],
    description: 'A premium Eastern Mediterranean voyage with Celebrity Beyond. Rome to Istanbul, Santorini to Rhodes.',
    description_ro: 'O croazieră premium în Mediterana de Est cu Celebrity Beyond. De la Roma la Istanbul, de la Santorini la Rodos.',
    tags: ['premium', 'couples', 'eastern-mediterranean'], cruise_line: 'Celebrity Cruises', cruise_line_category: 'premium', ship_name: 'Celebrity Beyond',
    destination: 'Eastern Mediterranean', destination_ro: 'Mediterana de Est', destination_slug: 'eastern-mediterranean',
  }),
  fc({ id: 'feat-007', slug: 'msc-emiratele-arabe-7-nopti-dubai', tier: 'ocean',
    title: 'MSC Emiratele Arabe — 7 Nopți din Dubai', title_ro: 'MSC Emiratele Arabe — 7 Nopți din Dubai',
    cruise_type: 'ocean', nights: 7, price_from: 599, departure_port: 'Dubai', departure_date: '2026-12-19',
    ports_of_call: ['Dubai', 'Abu Dhabi', 'Sir Bani Yas Island', 'Doha', 'Bahrain', 'Dubai'],
    ports_of_call_ro: ['Dubai', 'Abu Dhabi', 'Insula Sir Bani Yas', 'Doha', 'Bahrain', 'Dubai'],
    image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80', 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&q=80'],
    description: 'Spend the holidays in the Arabian Gulf. Explore Dubai, Abu Dhabi, and Qatar aboard MSC Virtuosa.',
    description_ro: 'Petrece sărbătorile în Golful Arab. Explorează Dubai, Abu Dhabi și Qatar la bordul MSC Virtuosa.',
    tags: ['winter-sun', 'christmas', 'dubai'], cruise_line: 'MSC Cruises', cruise_line_category: 'contemporary', ship_name: 'MSC Virtuosa',
    destination: 'Arabian Gulf', destination_ro: 'Emiratele Arabe', destination_slug: 'arabian-gulf',
  }),
  fc({ id: 'feat-008', slug: 'costa-transatlantic-14-nopti', tier: 'ocean',
    title: 'Costa Transatlantic — 14 Nopți Savona–Santos', title_ro: 'Costa Transatlantic — 14 Nopți Savona–Santos',
    cruise_type: 'ocean', nights: 14, price_from: 699, departure_port: 'Savona', departure_date: '2026-11-15',
    ports_of_call: ['Savona', 'Barcelona', 'Casablanca', 'Santa Cruz de Tenerife', 'Salvador', 'Santos'],
    ports_of_call_ro: ['Savona', 'Barcelona', 'Casablanca', 'Santa Cruz de Tenerife', 'Salvador', 'Santos'],
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80'],
    description: 'Cross the Atlantic from Italy to Brazil. An epic 14-night repositioning cruise at an incredible price.',
    description_ro: 'Traversează Atlanticul din Italia în Brazilia. O croazieră epică de repoziționare de 14 nopți la un preț incredibil.',
    advisor_note: 'Repositioning cruises offer the best value per night. Perfect for retirees or remote workers.',
    advisor_note_ro: 'Croazierele de repoziționare oferă cel mai bun raport calitate-preț pe noapte.',
    tags: ['transatlantic', 'value', 'long-voyage'], cruise_line: 'Costa Cruises', cruise_line_category: 'contemporary', ship_name: 'Costa Smeralda',
    destination: 'Transatlantic', destination_ro: 'Transatlantic', destination_slug: 'transatlantic',
  }),
  fc({ id: 'feat-009', slug: 'silversea-mediterana-luxury-7-nopti', tier: 'luxury',
    title: 'Silversea Mediterana Luxury — 7 Nopți din Monte Carlo', title_ro: 'Silversea Mediterana Luxury — 7 Nopți din Monte Carlo',
    cruise_type: 'luxury', nights: 7, price_from: 4299, departure_port: 'Monte Carlo', departure_date: '2026-08-22',
    ports_of_call: ['Monte Carlo', 'Portofino', 'Bonifacio', 'Porto Cervo', 'Amalfi', 'Capri', 'Rome'],
    ports_of_call_ro: ['Monte Carlo', 'Portofino', 'Bonifacio', 'Porto Cervo', 'Amalfi', 'Capri', 'Roma'],
    image_url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80', 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80', 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80'],
    description: 'Ultra-luxury Mediterranean sailing with Silversea. All-inclusive, butler service — Monte Carlo to the Amalfi Coast.',
    description_ro: 'Croazieră ultra-luxury în Mediterana cu Silversea. All-inclusive, serviciu de butler — de la Monte Carlo la Coasta Amalfi.',
    tags: ['luxury', 'all-inclusive', 'honeymoon'], cruise_line: 'Silversea', cruise_line_category: 'luxury', ship_name: 'Silver Moon',
    destination: 'Western Mediterranean', destination_ro: 'Mediterana de Vest', destination_slug: 'western-mediterranean',
  }),
  fc({ id: 'feat-010', slug: 'msc-balticul-si-fiorduri-11-nopti', tier: 'ocean',
    title: 'MSC Balticul și Fiorduri — 11 Nopți din Kiel', title_ro: 'MSC Balticul și Fiorduri — 11 Nopți din Kiel',
    cruise_type: 'ocean', nights: 11, price_from: 899, departure_port: 'Kiel', departure_date: '2026-07-18',
    ports_of_call: ['Kiel', 'Copenhagen', 'Tallinn', 'St. Petersburg', 'Helsinki', 'Stockholm', 'Kiel'],
    ports_of_call_ro: ['Kiel', 'Copenhaga', 'Tallinn', 'Sankt Petersburg', 'Helsinki', 'Stockholm', 'Kiel'],
    image_url: 'https://images.unsplash.com/photo-1515005318787-cc68052b38f3?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80', 'https://images.unsplash.com/photo-1535090467336-9501f96eef89?w=800&q=80', 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?w=800&q=80'],
    description: 'Explore the Baltic capitals aboard MSC Euribia. St. Petersburg, Stockholm, Copenhagen — history at every stop.',
    description_ro: 'Explorează capitalele Balticii la bordul MSC Euribia. Sankt Petersburg, Stockholm, Copenhaga.',
    tags: ['baltic', 'culture', 'capitals'], cruise_line: 'MSC Cruises', cruise_line_category: 'contemporary', ship_name: 'MSC Euribia',
    destination: 'Baltic', destination_ro: 'Marea Baltică', destination_slug: 'baltic',
  }),
  fc({ id: 'feat-011', slug: 'royal-caribbean-mediterana-5-nopti', tier: 'ocean',
    title: 'Royal Caribbean Mediterana — 5 Nopți din Barcelona', title_ro: 'Royal Caribbean Mediterana — 5 Nopți din Barcelona',
    cruise_type: 'ocean', nights: 5, price_from: 449, departure_port: 'Barcelona', departure_date: '2026-04-25',
    ports_of_call: ['Barcelona', 'Palma de Mallorca', 'Marseille', 'La Spezia', 'Rome (Civitavecchia)'],
    ports_of_call_ro: ['Barcelona', 'Palma de Mallorca', 'Marsilia', 'La Spezia', 'Roma (Civitavecchia)'],
    image_url: 'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80', 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80'],
    description: 'A short Mediterranean getaway perfect for first-time cruisers. Barcelona, Mallorca, and Italy in 5 nights.',
    description_ro: 'O escapadă scurtă în Mediterana, perfectă pentru cei la prima croazieră. 5 nopți cu Barcelona, Mallorca și Italia.',
    tags: ['short-break', 'first-cruise', 'mediterranean'], cruise_line: 'Royal Caribbean', cruise_line_category: 'contemporary', ship_name: 'Allure of the Seas',
    destination: 'Western Mediterranean', destination_ro: 'Mediterana de Vest', destination_slug: 'western-mediterranean',
  }),
  fc({ id: 'feat-012', slug: 'avalon-rinul-romantic-7-nopti', tier: 'river',
    title: 'Avalon Rinul Romantic — 7 Nopți Amsterdam–Basel', title_ro: 'Avalon Rinul Romantic — 7 Nopți Amsterdam–Basel',
    cruise_type: 'river', nights: 7, price_from: 2199, departure_port: 'Amsterdam', departure_date: '2026-09-12',
    ports_of_call: ['Amsterdam', 'Cologne', 'Koblenz', 'Rüdesheim', 'Strasbourg', 'Breisach', 'Basel'],
    ports_of_call_ro: ['Amsterdam', 'Köln', 'Koblenz', 'Rüdesheim', 'Strasbourg', 'Breisach', 'Basel'],
    image_url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80', 'https://images.unsplash.com/photo-1577462041561-a37c1c5a0c22?w=800&q=80', 'https://images.unsplash.com/photo-1543262003-b4464d3fa2e3?w=800&q=80'],
    description: 'Drift along the Romantic Rhine from Amsterdam to Basel. Medieval castles, vineyards, and charming villages.',
    description_ro: 'Navighează pe Rinul Romantic de la Amsterdam la Basel. Castele medievale, vii și sate fermecătoare.',
    tags: ['river', 'wine', 'romantic'], cruise_line: 'Avalon Waterways', cruise_line_category: 'river', ship_name: 'Avalon Panorama',
    destination: 'Rhine', destination_ro: 'Rinul', destination_slug: 'rhine',
  }),
  fc({ id: 'feat-013', slug: 'norwegian-caraibe-de-vest-7-nopti', tier: 'ocean',
    title: 'Norwegian Caraibe de Vest — 7 Nopți din New Orleans', title_ro: 'Norwegian Caraibe de Vest — 7 Nopți din New Orleans',
    cruise_type: 'ocean', nights: 7, price_from: 699, departure_port: 'New Orleans', departure_date: '2026-02-14',
    ports_of_call: ['New Orleans', 'Cozumel', 'George Town', 'Roatán', 'Costa Maya', 'New Orleans'],
    ports_of_call_ro: ['New Orleans', 'Cozumel', 'George Town', 'Roatán', 'Costa Maya', 'New Orleans'],
    image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', 'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800&q=80', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80'],
    description: 'Western Caribbean adventure from New Orleans. Explore Cozumel, Roatán, and the Cayman Islands.',
    description_ro: 'Aventură în Caraibele de Vest din New Orleans. Explorează Cozumel, Roatán și Insulele Cayman.',
    tags: ['caribbean', 'adventure', 'couples'], cruise_line: 'Norwegian Cruise Line', cruise_line_category: 'contemporary', ship_name: 'Norwegian Breakaway',
    destination: 'Caribbean', destination_ro: 'Caraibe', destination_slug: 'caribbean',
  }),
  fc({ id: 'feat-014', slug: 'regent-mediterana-all-inclusive-10-nopti', tier: 'luxury',
    title: 'Regent Mediterana All-Inclusive — 10 Nopți din Atena', title_ro: 'Regent Mediterana All-Inclusive — 10 Nopți din Atena',
    cruise_type: 'luxury', nights: 10, price_from: 5999, departure_port: 'Athens (Piraeus)', departure_port_ro: 'Atena (Pireu)', departure_date: '2026-10-03',
    ports_of_call: ['Athens', 'Santorini', 'Crete (Chania)', 'Malta', 'Sicily (Taormina)', 'Amalfi', 'Rome'],
    ports_of_call_ro: ['Atena', 'Santorini', 'Creta (Chania)', 'Malta', 'Sicilia (Taormina)', 'Amalfi', 'Roma'],
    image_url: 'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80'],
    description: 'The ultimate Mediterranean luxury. Regent Seven Seas includes everything — flights, excursions, premium drinks, Wi-Fi.',
    description_ro: 'Ultimul cuvânt în lux pe Mediterana. Regent Seven Seas include totul — zboruri, excursii, băuturi premium, Wi-Fi.',
    advisor_note: 'Regent is truly all-inclusive: even flights and excursions are included.',
    advisor_note_ro: 'Regent este cu adevărat all-inclusive: chiar și zborurile și excursiile sunt incluse.',
    tags: ['luxury', 'all-inclusive', 'top-rated'], cruise_line: 'Regent Seven Seas', cruise_line_category: 'luxury', ship_name: 'Seven Seas Splendor',
    destination: 'Eastern Mediterranean', destination_ro: 'Mediterana de Est', destination_slug: 'eastern-mediterranean',
  }),
  fc({ id: 'feat-015', slug: 'msc-insulele-canare-7-nopti', tier: 'ocean',
    title: 'MSC Insulele Canare — 7 Nopți din Genova', title_ro: 'MSC Insulele Canare — 7 Nopți din Genova',
    cruise_type: 'ocean', nights: 7, price_from: 479, departure_port: 'Genoa', departure_port_ro: 'Genova', departure_date: '2026-11-07',
    ports_of_call: ['Genoa', 'Málaga', 'Funchal', 'Tenerife', 'Lanzarote', 'Genoa'],
    ports_of_call_ro: ['Genova', 'Málaga', 'Funchal', 'Tenerife', 'Lanzarote', 'Genova'],
    image_url: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'],
    description: 'Escape the European winter with a Canary Islands cruise. Warm weather, volcanic landscapes, and stunning beaches.',
    description_ro: 'Evadează din iarna europeană cu o croazieră în Insulele Canare. Vreme caldă, peisaje vulcanice și plaje superbe.',
    tags: ['winter-sun', 'canary-islands', 'value'], cruise_line: 'MSC Cruises', cruise_line_category: 'contemporary', ship_name: 'MSC Opera',
    destination: 'Canary Islands', destination_ro: 'Insulele Canare', destination_slug: 'canary-islands',
  }),
  fc({ id: 'feat-016', slug: 'costa-japonia-si-coreea-10-nopti', tier: 'ocean',
    title: 'Costa Japonia și Coreea — 10 Nopți din Tokyo', title_ro: 'Costa Japonia și Coreea — 10 Nopți din Tokyo',
    cruise_type: 'ocean', nights: 10, price_from: 1299, departure_port: 'Tokyo (Yokohama)', departure_date: '2026-04-01',
    ports_of_call: ['Tokyo', 'Mt. Fuji (Shimizu)', 'Osaka', 'Jeju Island', 'Busan', 'Nagasaki', 'Tokyo'],
    ports_of_call_ro: ['Tokyo', 'Mt. Fuji (Shimizu)', 'Osaka', 'Insula Jeju', 'Busan', 'Nagasaki', 'Tokyo'],
    image_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=80'],
    description: 'Explore Japan and South Korea during cherry blossom season. Ancient temples, modern cities, world-class cuisine.',
    description_ro: 'Explorează Japonia și Coreea de Sud în sezonul florilor de cireș. Temple antice, orașe moderne și gastronomie.',
    tags: ['asia', 'cherry-blossom', 'culture'], cruise_line: 'Costa Cruises', cruise_line_category: 'contemporary', ship_name: 'Costa Serena',
    destination: 'Asia', destination_ro: 'Asia', destination_slug: 'asia',
  }),
  fc({ id: 'feat-017', slug: 'celebrity-alaska-7-nopti-seattle', tier: 'ocean',
    title: 'Celebrity Alaska — 7 Nopți din Seattle', title_ro: 'Celebrity Alaska — 7 Nopți din Seattle',
    cruise_type: 'ocean', nights: 7, price_from: 999, departure_port: 'Seattle', departure_date: '2026-06-28',
    ports_of_call: ['Seattle', 'Ketchikan', 'Juneau', 'Skagway', 'Victoria', 'Seattle'],
    ports_of_call_ro: ['Seattle', 'Ketchikan', 'Juneau', 'Skagway', 'Victoria', 'Seattle'],
    image_url: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1531176175280-109b653e4e6c?w=800&q=80', 'https://images.unsplash.com/photo-1504884790557-80daa3a0ce86?w=800&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
    description: 'Witness glaciers, whales, and pristine wilderness on a Celebrity Alaska voyage through the Inside Passage.',
    description_ro: 'Descoperă ghețari, balene și sălbăticie nepătrunsă într-o croazieră Celebrity în Alaska prin Inside Passage.',
    tags: ['alaska', 'nature', 'wildlife'], cruise_line: 'Celebrity Cruises', cruise_line_category: 'premium', ship_name: 'Celebrity Edge',
    destination: 'Alaska', destination_ro: 'Alaska', destination_slug: 'alaska',
  }),
  fc({ id: 'feat-018', slug: 'amawaterways-provence-burgundia-7-nopti', tier: 'river',
    title: 'AmaWaterways Provence și Burgundia — 7 Nopți', title_ro: 'AmaWaterways Provence și Burgundia — 7 Nopți Lyon–Avignon',
    cruise_type: 'river', nights: 7, price_from: 2599, departure_port: 'Lyon', departure_date: '2026-09-26',
    ports_of_call: ['Lyon', 'Mâcon', 'Chalon-sur-Saône', 'Tournus', 'Viviers', 'Arles', 'Avignon'],
    ports_of_call_ro: ['Lyon', 'Mâcon', 'Chalon-sur-Saône', 'Tournus', 'Viviers', 'Arles', 'Avignon'],
    image_url: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1499796683658-b659bc751db1?w=800&q=80', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80', 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80'],
    description: 'A gastronomic river cruise through France\'s finest wine regions. Burgundy, Beaujolais, and Provence.',
    description_ro: 'O croazieră gastronomică fluvială prin cele mai renumite regiuni viticole ale Franței.',
    tags: ['river', 'wine', 'gastronomy', 'france'], cruise_line: 'AmaWaterways', cruise_line_category: 'river', ship_name: 'AmaLyra',
    destination: 'Rhône & Provence', destination_ro: 'Ron și Provence', destination_slug: 'rhone-provence',
  }),
  fc({ id: 'feat-019', slug: 'msc-mini-croaziera-mediterana-3-nopti', tier: 'ocean',
    title: 'MSC Mini Croazieră — 3 Nopți din Genova', title_ro: 'MSC Mini Croazieră Mediterana — 3 Nopți din Genova',
    cruise_type: 'ocean', nights: 3, price_from: 199, departure_port: 'Genoa', departure_port_ro: 'Genova', departure_date: '2026-04-03',
    ports_of_call: ['Genoa', 'Marseille', 'Barcelona', 'Genoa'],
    ports_of_call_ro: ['Genova', 'Marsilia', 'Barcelona', 'Genova'],
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80', 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80', 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80'],
    description: 'Try cruising with a short 3-night Mediterranean taster. Perfect for first-timers. From only 199 EUR.',
    description_ro: 'Încearcă o croazieră cu un mini-voiaj de 3 nopți în Mediterana. De la doar 199 EUR.',
    advisor_note: 'Best intro to cruising — great for clients who aren\'t sure they\'ll enjoy it.',
    advisor_note_ro: 'Cea mai bună introducere în lumea croazierelor — ideală pentru clienții nesiguri.',
    tags: ['short-break', 'first-cruise', 'budget'], cruise_line: 'MSC Cruises', cruise_line_category: 'contemporary', ship_name: 'MSC Fantasia',
    destination: 'Western Mediterranean', destination_ro: 'Mediterana de Vest', destination_slug: 'western-mediterranean',
  }),
  fc({ id: 'feat-020', slug: 'ponant-expeditie-arctica-12-nopti', tier: 'luxury',
    title: 'Ponant Expediție Arctică — 12 Nopți Svalbard', title_ro: 'Ponant Expediție Arctică — 12 Nopți Svalbard',
    cruise_type: 'luxury', nights: 12, price_from: 7999, departure_port: 'Longyearbyen', departure_date: '2026-07-15',
    ports_of_call: ['Longyearbyen', 'Ny-Ålesund', 'Magdalenefjorden', 'Smeerenburg', '80° North', 'Alkefjellet', 'Longyearbyen'],
    ports_of_call_ro: ['Longyearbyen', 'Ny-Ålesund', 'Magdalenefjorden', 'Smeerenburg', '80° Nord', 'Alkefjellet', 'Longyearbyen'],
    image_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    gallery_urls: ['https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=800&q=80', 'https://images.unsplash.com/photo-1494564605686-2e931f77a8a2?w=800&q=80', 'https://images.unsplash.com/photo-1517783999520-f068d7431571?w=800&q=80'],
    description: 'An expedition to the High Arctic aboard Ponant\'s Le Commandant Charcot. Polar bears, glaciers, midnight sun at 80°N.',
    description_ro: 'O expediție în Arctica la bordul Le Commandant Charcot de la Ponant. Urși polari, ghețari și soarele de miezul nopții.',
    advisor_note: 'Once-in-a-lifetime expedition. Le Commandant Charcot is the only luxury icebreaker in the world.',
    advisor_note_ro: 'Expediție unică în viață. Le Commandant Charcot este singurul spărgător de gheață de lux din lume.',
    tags: ['expedition', 'luxury', 'arctic', 'wildlife'], cruise_line: 'Ponant', cruise_line_category: 'expedition', ship_name: 'Le Commandant Charcot',
    destination: 'Arctic', destination_ro: 'Arctica', destination_slug: 'arctic',
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
