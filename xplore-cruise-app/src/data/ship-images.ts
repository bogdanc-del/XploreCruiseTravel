// ============================================================
// HD Ship & Cruise Line Images
// ============================================================
// Maps ships and cruise lines to high-quality Unsplash images
// Used as fallback/override when API-sourced images are low quality
// ============================================================

/**
 * HD images per cruise line — used as fallback when no ship-specific image exists.
 * Each line maps to a curated, high-quality Unsplash photo that matches the line's style.
 */
export const CRUISE_LINE_IMAGES: Record<string, string> = {
  // --- Contemporary / Mass Market ---
  'MSC Cruises':                'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'Costa Cruises':              'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'Royal Caribbean Cruise Line':'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Royal Caribbean':            'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Norwegian Cruise Line':      'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&q=80',
  'Carnival Cruise Line':       'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Disney Cruise Line':         'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Aida Cruises':               'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',

  // --- Premium ---
  'Celebrity Cruises':          'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
  'Princess Cruises':           'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Holland America Line':       'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',
  'Cunard Line':                'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'P&O Cruises':                'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'Azamara Club Cruises':       'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Oceania Cruises':            'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
  'Virgin Voyages':             'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80',
  'Celestyal Cruises':          'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
  'Explora Journeys':           'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',

  // --- Luxury ---
  'Silversea Cruises':          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
  'Seabourn':                   'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'Regent Seven Seas Cruises':  'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
  'Crystal Cruises':            'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80',
  'SeaDream Yacht Club':        'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
  'Windstar Cruises':           'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
  'Four Seasons Yachts':        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'AROYA Cruises':              'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',

  // --- River ---
  'Viking River Cruises':       'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
  'AmaWaterways':               'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
  'Avalon Waterways':           'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
  'Uniworld River Cruises':     'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80',
  'A-Rosa Cruises':             'https://images.unsplash.com/photo-1573599852326-2d4da0bbe613?w=800&q=80',
  'Nicko Cruises':              'https://images.unsplash.com/photo-1577462041561-a37c1c5a0c22?w=800&q=80',
  'Viva Cruises':               'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
  'Crucemundo':                 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
}

/**
 * HD images per specific ship — highest priority when available.
 * Covers the top ~60 most popular ships with curated images.
 */
export const SHIP_IMAGES: Record<string, string> = {
  // ── MSC Cruises ──────────────────────────────────────────
  'MSC World Europa':     'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'MSC Meraviglia':       'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'MSC Grandiosa':        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
  'MSC Virtuosa':         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  'MSC Euribia':          'https://images.unsplash.com/photo-1515005318787-cc68052b38f3?w=800&q=80',
  'MSC Seashore':         'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
  'MSC Seaview':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'MSC Fantasia':         'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'MSC Splendida':        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'MSC Magnifica':        'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'MSC Preziosa':         'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'MSC Divina':           'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',
  'MSC Opera':            'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80',
  'MSC Sinfonia':         'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'MSC Musica':           'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80',
  'MSC Poesia':           'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',

  // ── Costa Cruises ────────────────────────────────────────
  'Costa Toscana':        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'Costa Smeralda':       'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Costa Pacifica':       'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Costa Serena':         'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'Costa Favolosa':       'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Costa Fascinosa':      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
  'Costa Diadema':        'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'Costa Deliziosa':      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',

  // ── Royal Caribbean ──────────────────────────────────────
  'Icon of the Seas':           'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
  'Allure of the Seas':         'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Explorer of the Seas':       'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
  'Freedom of the Seas':        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  'Independence of the Seas':   'https://images.unsplash.com/photo-1505881502353-a1986add3762?w=800&q=80',
  'Adventure of the Seas':      'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Brilliance of the Seas':     'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
  'Serenade of the Seas':       'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'Jewel of the Seas':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'Rhapsody of the Seas':       'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80',

  // ── Norwegian Cruise Line ────────────────────────────────
  'Norwegian Prima':      'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800&q=80',
  'Norwegian Breakaway':  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
  'Norwegian Star':       'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80',
  'Norwegian Spirit':     'https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=800&q=80',
  'Norwegian Joy':        'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',

  // ── Celebrity Cruises ────────────────────────────────────
  'Celebrity Beyond':     'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
  'Celebrity Edge':       'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
  'Celebrity Apex':       'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'Celebrity Eclipse':    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'Celebrity Xcel':       'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
  'Celebrity Infinity':   'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Celebrity Summit':     'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',

  // ── Princess Cruises ─────────────────────────────────────
  'Sun Princess':         'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Regal Princess':       'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Sky Princess':         'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
  'Star Princess':        'https://images.unsplash.com/photo-1515005318787-cc68052b38f3?w=800&q=80',
  'Enchanted Princess':   'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'Grand Princess':       'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80',
  'Diamond Princess':     'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Sapphire Princess':    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'Royal Princess':       'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Crown Princess':       'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'Emerald Princess':     'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',
  'Ruby Princess':        'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'Caribbean Princess':   'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',

  // ── Holland America Line ─────────────────────────────────
  'Nieuw Statendam':      'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',
  'Rotterdam':            'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'Zuiderdam':            'https://images.unsplash.com/photo-1515005318787-cc68052b38f3?w=800&q=80',
  'Oosterdam':            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Koningsdam':           'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'Nieuw Amsterdam':      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',

  // ── Cunard ───────────────────────────────────────────────
  'Queen Elizabeth':       'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'Queen Mary 2':          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Queen Anne':            'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Queen Victoria':        'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&q=80',

  // ── Luxury ───────────────────────────────────────────────
  'Silver Moon':           'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
  'Silver Dawn':           'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'Seabourn Ovation':      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'Seabourn Quest':        'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80',
  'Seabourn Encore':       'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800&q=80',
  'Seven Seas Splendor':   'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
  'Seven Seas Grandeur':   'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
  'Seven Seas Mariner':    'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
  'Seven Seas Voyager':    'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80',

  // ── Oceania ──────────────────────────────────────────────
  'Marina':               'https://images.unsplash.com/photo-1601581875309-fafbf2d34b05?w=800&q=80',
  'Riviera':              'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Allura':               'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80',
  'Vista':                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'Sirena':               'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'Insignia':             'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
  'Nautica':              'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',

  // ── Azamara ──────────────────────────────────────────────
  'Azamara Journey':      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Azamara Onward':       'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',

  // ── River Cruise Ships ───────────────────────────────────
  'Viking Longship Hild':  'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
  'Avalon Panorama':       'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
  'AmaLyra':               'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
}

// ============================================================
// Ship Descriptions & Videos — for the Overview tab
// ============================================================

export interface ShipInfo {
  description_en: string
  description_ro: string
  year_built?: number
  passengers?: number
  tonnage?: number
  youtube_id?: string
}

export const SHIP_INFO: Record<string, ShipInfo> = {
  // ── MSC Cruises ──
  'MSC World Europa': {
    description_en: 'MSC World Europa is one of the largest and most innovative cruise ships at sea, featuring 22 decks, world-class dining, and the longest dry slide at sea.',
    description_ro: 'MSC World Europa este una dintre cele mai mari si inovatoare nave de croaziera, cu 22 punti, restaurante de top si cel mai lung tobogan uscat de pe mare.',
    year_built: 2022, passengers: 6762, tonnage: 205700, youtube_id: 'TK4GZiJCQoM',
  },
  'MSC Meraviglia': {
    description_en: 'MSC Meraviglia offers a spectacular indoor promenade with LED sky, Cirque du Soleil shows, and Mediterranean-inspired design.',
    description_ro: 'MSC Meraviglia ofera o promenada interioara spectaculoasa cu cer LED, spectacole Cirque du Soleil si design inspirat din Mediterana.',
    year_built: 2017, passengers: 5714, tonnage: 171598, youtube_id: 'xr-U3E1z83w',
  },
  'MSC Grandiosa': {
    description_en: 'MSC Grandiosa features a stunning Swarovski crystal staircase, indoor promenade, and diverse entertainment for all ages.',
    description_ro: 'MSC Grandiosa dispune de o scara spectaculoasa din cristal Swarovski, promenada interioara si divertisment divers pentru toate varstele.',
    year_built: 2019, passengers: 6334, tonnage: 181541, youtube_id: 'PLmqbbXxWdQ',
  },
  'MSC Fantasia': {
    description_en: 'MSC Fantasia combines elegance with entertainment, featuring the exclusive MSC Yacht Club and a spectacular water park.',
    description_ro: 'MSC Fantasia combina eleganta cu divertismentul, oferind exclusivul MSC Yacht Club si un parc acvatic spectaculos.',
    year_built: 2008, passengers: 3900, tonnage: 137936,
  },
  'MSC Splendida': {
    description_en: 'MSC Splendida is a stunning vessel with Swarovski crystal details, a zen garden, and the Top 18 exclusive sundeck.',
    description_ro: 'MSC Splendida este o nava impresionanta cu detalii din cristal Swarovski, gradina zen si terasa exclusiva Top 18.',
    year_built: 2009, passengers: 3900, tonnage: 137936,
  },
  'MSC Magnifica': {
    description_en: 'MSC Magnifica offers classic Italian elegance, a full-size tennis court, and panoramic top-deck swimming pools.',
    description_ro: 'MSC Magnifica ofera eleganta italiana clasica, un teren de tenis de dimensiuni reale si piscine panoramice.',
    year_built: 2010, passengers: 3223, tonnage: 95128,
  },
  'MSC Opera': {
    description_en: 'MSC Opera is a mid-size ship offering an intimate cruise experience with Italian design and warm hospitality.',
    description_ro: 'MSC Opera este o nava de dimensiuni medii ce ofera o experienta intima de croaziera cu design italian.',
    year_built: 2004, passengers: 2150, tonnage: 65591,
  },
  // ── Costa Cruises ──
  'Costa Toscana': {
    description_en: 'Costa Toscana is powered by LNG, featuring stunning Italian design, over 15 restaurants, and a three-deck atrium.',
    description_ro: 'Costa Toscana functioneaza cu GNL, oferind design italian impresionant, peste 15 restaurante si un atrium pe trei punti.',
    year_built: 2021, passengers: 6554, tonnage: 185010, youtube_id: 'dEH0xtXMmXo',
  },
  'Costa Smeralda': {
    description_en: 'Costa Smeralda is an eco-friendly ship with innovative Italian cuisine, world-class spa, and colorful Murano glass details.',
    description_ro: 'Costa Smeralda este o nava ecologica cu bucatarie italiana inovatoare, spa de clasa mondiala si detalii din sticla Murano.',
    year_built: 2019, passengers: 6554, tonnage: 185010, youtube_id: '2q-1DHHAQ6o',
  },
  'Costa Serena': {
    description_en: 'Costa Serena is inspired by celestial mythology, featuring elegant Italian design, spacious cabins, and a grand central atrium.',
    description_ro: 'Costa Serena este inspirata de mitologia celesta, cu design italian elegant, cabine spatioase si un atrium central grandios.',
    year_built: 2007, passengers: 3780, tonnage: 114147,
  },
  'Costa Pacifica': {
    description_en: 'Costa Pacifica celebrates Italian music with a rich entertainment program, refined cuisine, and a relaxing spa.',
    description_ro: 'Costa Pacifica celebreaza muzica italiana cu un program de divertisment bogat, bucatarie rafinata si un spa relaxant.',
    year_built: 2009, passengers: 3780, tonnage: 114147,
  },
  'Costa Diadema': {
    description_en: 'Costa Diadema is the flagship of Costa Cruises, featuring open-air promenades, infinity pools, and panoramic dining.',
    description_ro: 'Costa Diadema este nava amiral a Costa Cruises, cu promenade in aer liber, piscine infinity si restaurante panoramice.',
    year_built: 2014, passengers: 4947, tonnage: 132500,
  },
  'Costa Favolosa': {
    description_en: 'Costa Favolosa draws inspiration from fairy tales with lavish interiors, a 4D cinema, and extensive entertainment.',
    description_ro: 'Costa Favolosa se inspira din basme cu interioare grandioase, un cinema 4D si divertisment amplu.',
    year_built: 2011, passengers: 3800, tonnage: 114147,
  },
  // ── Royal Caribbean ──
  'Icon of the Seas': {
    description_en: 'Icon of the Seas is the world\'s largest cruise ship, featuring 8 neighborhoods, a waterpark, and an ice-skating rink.',
    description_ro: 'Icon of the Seas este cea mai mare nava de croaziera din lume, cu 8 cartiere tematice, parc acvatic si patinoar.',
    year_built: 2024, passengers: 7600, tonnage: 250800, youtube_id: '6Y4fPWagSik',
  },
  'Allure of the Seas': {
    description_en: 'Allure of the Seas offers world-class entertainment with a Broadway theater, zip line, surf simulator, and Central Park.',
    description_ro: 'Allure of the Seas ofera divertisment de clasa mondiala cu teatru Broadway, tiroliana, simulator de surf si Central Park.',
    year_built: 2010, passengers: 6780, tonnage: 225282,
  },
  'Explorer of the Seas': {
    description_en: 'Explorer of the Seas features a rock climbing wall, ice skating rink, and the signature Royal Promenade.',
    description_ro: 'Explorer of the Seas dispune de perete de escalada, patinoar si emblematica Royal Promenade.',
    year_built: 2000, passengers: 3840, tonnage: 137308,
  },
  // ── Norwegian Cruise Line ──
  'Norwegian Prima': {
    description_en: 'Norwegian Prima features the largest go-kart track at sea, The Drop waterslide, and upscale Mandara Spa.',
    description_ro: 'Norwegian Prima dispune de cea mai mare pista de karting pe mare, tobogan The Drop si spa-ul exclusiv Mandara.',
    year_built: 2022, passengers: 3215, tonnage: 142500, youtube_id: 'P4PgxCOl3kA',
  },
  'Norwegian Breakaway': {
    description_en: 'Norwegian Breakaway offers a vibrant waterfront, extensive dining, and an exhilarating ropes course.',
    description_ro: 'Norwegian Breakaway ofera un waterfront vibrant, restaurante diverse si un circuit de franghii captivant.',
    year_built: 2013, passengers: 3963, tonnage: 145655,
  },
  // ── Celebrity Cruises ──
  'Celebrity Beyond': {
    description_en: 'Celebrity Beyond is a luxury-forward ship with the Magic Carpet platform, rooftop garden, and Michelin-level dining.',
    description_ro: 'Celebrity Beyond este o nava premium cu platforma Magic Carpet, gradina pe acoperis si restaurante de nivel Michelin.',
    year_built: 2022, passengers: 3260, tonnage: 140600, youtube_id: '3kM_9rLGQ5U',
  },
  'Celebrity Edge': {
    description_en: 'Celebrity Edge revolutionized cruise design with the Magic Carpet, Eden garden lounge, and open-air resort deck.',
    description_ro: 'Celebrity Edge a revolutionat designul de croaziera cu Magic Carpet, lounge-ul Eden si puntea resort in aer liber.',
    year_built: 2018, passengers: 2918, tonnage: 129500,
  },
  // ── Viking ──
  'Viking Longship Hild': {
    description_en: 'Viking Longship Hild is an award-winning river cruise ship with all-veranda staterooms and Scandinavian design.',
    description_ro: 'Viking Longship Hild este o nava de croaziera fluviala premiata, cu toate cabinele cu veranda si design scandinav.',
    year_built: 2014, passengers: 190,
  },
}

export function getShipInfo(shipName?: string): ShipInfo | null {
  if (!shipName) return null
  return SHIP_INFO[shipName] || null
}

// ============================================================
// Helper function
// ============================================================

/**
 * Returns the best available HD image for a cruise.
 * Priority: ship-specific → cruise-line fallback → null
 */
export function getHDImage(shipName?: string, cruiseLine?: string): string | null {
  if (shipName && SHIP_IMAGES[shipName]) {
    return SHIP_IMAGES[shipName]
  }
  if (cruiseLine && CRUISE_LINE_IMAGES[cruiseLine]) {
    return CRUISE_LINE_IMAGES[cruiseLine]
  }
  return null
}

/**
 * Returns the best image URL for a cruise card.
 * Uses HD mapping when the original image is from croaziere.net (low quality).
 * Keeps original image if it's already from a quality source (Unsplash, etc.)
 */
export function getBestImageUrl(
  originalUrl: string | undefined,
  shipName?: string,
  cruiseLine?: string,
): string | undefined {
  // If no original URL, try HD mapping
  if (!originalUrl) {
    return getHDImage(shipName, cruiseLine) ?? undefined
  }

  // If the image is from croaziere.net (API thumbnails = low quality), prefer HD
  if (originalUrl.includes('croaziere.net')) {
    return getHDImage(shipName, cruiseLine) ?? originalUrl
  }

  // Otherwise keep the original (e.g. Unsplash images from featured cruises)
  return originalUrl
}
