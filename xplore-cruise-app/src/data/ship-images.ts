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
    year_built: 2022, passengers: 6762, tonnage: 205700, youtube_id: 'UIpnCLViDgA',
  },
  'MSC Meraviglia': {
    description_en: 'MSC Meraviglia offers a spectacular indoor promenade with LED sky, Cirque du Soleil shows, and Mediterranean-inspired design.',
    description_ro: 'MSC Meraviglia ofera o promenada interioara spectaculoasa cu cer LED, spectacole Cirque du Soleil si design inspirat din Mediterana.',
    year_built: 2017, passengers: 5714, tonnage: 171598, youtube_id: '-2bNT_J4tmE',
  },
  'MSC Grandiosa': {
    description_en: 'MSC Grandiosa features a stunning Swarovski crystal staircase, indoor promenade, and diverse entertainment for all ages.',
    description_ro: 'MSC Grandiosa dispune de o scara spectaculoasa din cristal Swarovski, promenada interioara si divertisment divers pentru toate varstele.',
    year_built: 2019, passengers: 6334, tonnage: 181541, youtube_id: 'UsxQk5D89H4',
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
    year_built: 2021, passengers: 6554, tonnage: 185010, youtube_id: 'gRs52MP4n9c',
  },
  'Costa Smeralda': {
    description_en: 'Costa Smeralda is an eco-friendly ship with innovative Italian cuisine, world-class spa, and colorful Murano glass details.',
    description_ro: 'Costa Smeralda este o nava ecologica cu bucatarie italiana inovatoare, spa de clasa mondiala si detalii din sticla Murano.',
    year_built: 2019, passengers: 6554, tonnage: 185010, youtube_id: 'cbM8oZdh_Vc',
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
    year_built: 2024, passengers: 7600, tonnage: 250800, youtube_id: 'QrH39uFhjG0',
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
    year_built: 2022, passengers: 3215, tonnage: 142500, youtube_id: 'CF_GGWdELFk',
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
    year_built: 2022, passengers: 3260, tonnage: 140600, youtube_id: 'UtyzeOVia5k',
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

  // ══════════════════════════════════════════════════════════════
  // Additional ships — auto-generated for full catalog coverage
  // ══════════════════════════════════════════════════════════════

  // ── MSC Cruises (remaining) ──
  'MSC Armonia': {
    description_en: 'MSC Armonia is a mid-size ship offering an intimate Italian cruise experience with refined dining and a serene spa.',
    description_ro: 'MSC Armonia este o nava de dimensiuni medii ce ofera o experienta italiana intima, cu restaurante rafinate si un spa linistit.',
    year_built: 2001, passengers: 2679, tonnage: 65542,
  },
  'MSC Bellissima': {
    description_en: 'MSC Bellissima features a stunning indoor promenade with LED dome, Cirque du Soleil at Sea shows, and elegant Swarovski staircases.',
    description_ro: 'MSC Bellissima are o promenada interioara cu cupola LED, spectacole Cirque du Soleil at Sea si scari elegante din cristal Swarovski.',
    year_built: 2019, passengers: 5686, tonnage: 171598,
  },
  'MSC Divina': {
    description_en: 'MSC Divina pays tribute to Sophia Loren with glamorous Italian design, the exclusive Yacht Club, and a stunning infinity pool.',
    description_ro: 'MSC Divina aduce un omagiu Sophiei Loren cu design italian glamour, exclusivul Yacht Club si o piscina infinity impresionanta.',
    year_built: 2012, passengers: 4345, tonnage: 139072,
  },
  'MSC Euribia': {
    description_en: 'MSC Euribia is an LNG-powered ship with a striking hull art by Alex Filipe, featuring cutting-edge environmental technology and premium dining.',
    description_ro: 'MSC Euribia este o nava alimentata cu GNL, cu o pictura de corp realizata de Alex Filipe, tehnologie de mediu avansata si restaurante premium.',
    year_built: 2023, passengers: 6327, tonnage: 184011,
  },
  'MSC Lirica': {
    description_en: 'MSC Lirica is a classic mid-size ship with warm Italian interiors, a two-deck theater, and panoramic lounge.',
    description_ro: 'MSC Lirica este o nava clasica de dimensiuni medii cu interioare italiene calde, teatru pe doua punti si lounge panoramic.',
    year_built: 2003, passengers: 2199, tonnage: 65591,
  },
  'MSC Musica': {
    description_en: 'MSC Musica features a three-deck waterfall atrium, panoramic elevators, and refined Mediterranean cuisine.',
    description_ro: 'MSC Musica dispune de un atrium cu cascada pe trei punti, lifturi panoramice si bucatarie mediteraneana rafinata.',
    year_built: 2006, passengers: 3223, tonnage: 92409,
  },
  'MSC Orchestra': {
    description_en: 'MSC Orchestra offers a grand two-deck dining room, a cigar lounge, and one of the largest spas in the MSC fleet.',
    description_ro: 'MSC Orchestra ofera un restaurant grandios pe doua punti, un lounge de trabucuri si unul dintre cele mai mari spa-uri din flota MSC.',
    year_built: 2007, passengers: 3223, tonnage: 92409,
  },
  'MSC Poesia': {
    description_en: 'MSC Poesia combines Italian elegance with a panoramic Top Sail lounge, outdoor pool deck, and refined dining venues.',
    description_ro: 'MSC Poesia combina eleganta italiana cu lounge-ul panoramic Top Sail, puntea de piscina si restaurante rafinate.',
    year_built: 2008, passengers: 3223, tonnage: 92409,
  },
  'MSC Preziosa': {
    description_en: 'MSC Preziosa boasts the longest single-rider waterslide at sea, the exclusive Yacht Club, and a lavish Balinese spa.',
    description_ro: 'MSC Preziosa se mandreste cu cel mai lung tobogan acvatic individual pe mare, exclusivul Yacht Club si un spa balinese luxos.',
    year_built: 2013, passengers: 4345, tonnage: 139072,
  },
  'MSC Seascape': {
    description_en: 'MSC Seascape features an outdoor promenade, robotics bartenders, the Yacht Club, and expansive pool areas across multiple decks.',
    description_ro: 'MSC Seascape are o promenada exterioara, barmani robotici, Yacht Club si zone de piscina pe mai multe punti.',
    year_built: 2022, passengers: 5877, tonnage: 169380,
  },
  'MSC Seashore': {
    description_en: 'MSC Seashore offers an extended outdoor promenade, infinity bridge, and one of the widest beachfront pools at sea.',
    description_ro: 'MSC Seashore ofera o promenada exterioara extinsa, un pod infinity si una dintre cele mai late piscine de pe mare.',
    year_built: 2021, passengers: 5877, tonnage: 169380,
  },
  'MSC Seaside': {
    description_en: 'MSC Seaside is designed as a beach condo at sea, with an aqua park, a Miami-inspired waterfront boardwalk, and glass-floor bridge.',
    description_ro: 'MSC Seaside este proiectata ca un condominiu de plaja pe mare, cu aquapark, promenada in stil Miami si pod cu podea de sticla.',
    year_built: 2017, passengers: 5179, tonnage: 153516,
  },
  'MSC Seaview': {
    description_en: 'MSC Seaview maximizes ocean views with panoramic glass elevators, a 360-degree promenade, and a stunning aqua park.',
    description_ro: 'MSC Seaview maximizeaza privelistea la ocean cu lifturi panoramice, promenada 360 grade si un aquapark spectaculos.',
    year_built: 2018, passengers: 5179, tonnage: 153516,
  },
  'MSC Sinfonia': {
    description_en: 'MSC Sinfonia is a cozy mid-size ship with classic Italian decor, ideal for intimate Mediterranean voyages.',
    description_ro: 'MSC Sinfonia este o nava confortabila de dimensiuni medii, cu decor italian clasic, ideala pentru calatorii intime in Mediterana.',
    year_built: 2002, passengers: 2679, tonnage: 65542,
  },
  'MSC Virtuosa': {
    description_en: 'MSC Virtuosa features Rob the humanoid bartender, a two-deck LED promenade, and the exclusive MSC Yacht Club.',
    description_ro: 'MSC Virtuosa prezinta barmanul umanoid Rob, promenada LED pe doua punti si exclusivul MSC Yacht Club.',
    year_built: 2021, passengers: 6334, tonnage: 181541,
  },
  'MSC World America': {
    description_en: 'MSC World America is a World-class mega ship with seven distinct districts, a multi-level dry slide, and world-class dining.',
    description_ro: 'MSC World America este o mega nava de clasa World cu sapte districte distincte, tobogan uscat pe mai multe niveluri si restaurante de top.',
    year_built: 2025, passengers: 6762, tonnage: 215863,
  },
  'MSC World Asia': {
    description_en: 'MSC World Asia is a World-class ship designed for the Asian market, featuring a multi-deck dry slide and diverse global cuisine.',
    description_ro: 'MSC World Asia este o nava de clasa World proiectata pentru piata asiatica, cu tobogan uscat pe mai multe punti si bucatarie globala diversa.',
    year_built: 2026, passengers: 6762, tonnage: 215863,
  },
  'MSC World Atlantic': {
    description_en: 'MSC World Atlantic is an upcoming World-class vessel with innovative neighborhood design and next-generation entertainment.',
    description_ro: 'MSC World Atlantic este o viitoare nava de clasa World cu design inovator pe cartiere si divertisment de ultima generatie.',
    year_built: 2026, passengers: 6762, tonnage: 215863,
  },

  // ── Costa Cruises (remaining) ──
  '7 nopti': {
    description_en: 'A Costa Cruises vacation package offering a week-long Mediterranean cruise experience with Italian hospitality.',
    description_ro: 'Un pachet de vacanta Costa Cruises ce ofera o experienta de croaziera de o saptamana in Mediterana cu ospitalitate italiana.',
    year_built: 2019, passengers: 5000, tonnage: 135000,
  },
  'Costa Cruises': {
    description_en: 'Costa Cruises ship offering authentic Italian cruising with vibrant entertainment, regional cuisine, and Mediterranean flair.',
    description_ro: 'Nava Costa Cruises ce ofera croaziera autentic italiana cu divertisment vibrant, bucatarie regionala si farmec mediteranean.',
    year_built: 2019, passengers: 5000, tonnage: 135000,
  },
  'Costa Deliziosa': {
    description_en: 'Costa Deliziosa is an elegant ship themed around the pleasures of life, with a 4D cinema, golf simulator, and refined Italian dining.',
    description_ro: 'Costa Deliziosa este o nava eleganta tematizata dupa placerile vietii, cu cinema 4D, simulator de golf si bucatarie italiana rafinata.',
    year_built: 2010, passengers: 2826, tonnage: 92720,
  },
  'Costa Fascinosa': {
    description_en: 'Costa Fascinosa celebrates the world of cinema with themed decks, a grand casino, and elegant Italian-style entertainment.',
    description_ro: 'Costa Fascinosa celebreaza lumea cinematografiei cu punti tematice, un cazinou grandios si divertisment elegant in stil italian.',
    year_built: 2012, passengers: 3800, tonnage: 114147,
  },
  'Costa Fortuna': {
    description_en: 'Costa Fortuna pays homage to great Italian ocean liners of the past, with classic decor and a warm Mediterranean atmosphere.',
    description_ro: 'Costa Fortuna aduce un omagiu marilor transatlantice italiene din trecut, cu decor clasic si o atmosfera mediteraneana calda.',
    year_built: 2003, passengers: 3470, tonnage: 102587,
  },

  // ── Royal Caribbean (remaining) ──
  'Adventure of the Seas': {
    description_en: 'Adventure of the Seas is a Voyager-class ship featuring a rock-climbing wall, ice skating rink, and the iconic Royal Promenade.',
    description_ro: 'Adventure of the Seas este o nava din clasa Voyager cu perete de escalada, patinoar si emblematica Royal Promenade.',
    year_built: 2001, passengers: 3807, tonnage: 137276,
  },
  'Allure Of The Seas': {
    description_en: 'Allure Of The Seas is an Oasis-class giant featuring seven neighborhoods, a Broadway theater, zip line, and Central Park at sea.',
    description_ro: 'Allure Of The Seas este un gigant din clasa Oasis cu sapte cartiere, teatru Broadway, tiroliana si Central Park pe mare.',
    year_built: 2010, passengers: 6780, tonnage: 225282,
  },
  'Anthem Of The Seas': {
    description_en: 'Anthem Of The Seas features the North Star observation capsule, bumper cars, a skydiving simulator, and Bionic Bar with robotic bartenders.',
    description_ro: 'Anthem Of The Seas are capsula de observatie North Star, masini tamponoare, simulator de skydiving si Bionic Bar cu barmani robotici.',
    year_built: 2015, passengers: 4905, tonnage: 168666,
  },
  'Brilliance of the Seas': {
    description_en: 'Brilliance of the Seas is a Radiance-class ship with floor-to-ceiling windows, a self-leveling pool table, and a rock-climbing wall.',
    description_ro: 'Brilliance of the Seas este o nava din clasa Radiance cu ferestre de la podea la tavan, masa de biliard autonivelanta si perete de escalada.',
    year_built: 2002, passengers: 2501, tonnage: 90090,
  },
  'Enchantment of the Seas': {
    description_en: 'Enchantment of the Seas is a Vision-class ship offering a classic cruise experience with panoramic views and relaxed ambiance.',
    description_ro: 'Enchantment of the Seas este o nava din clasa Vision ce ofera o experienta clasica de croaziera cu vederi panoramice.',
    year_built: 1997, passengers: 2446, tonnage: 82910,
  },
  'Freedom of the Seas': {
    description_en: 'Freedom of the Seas was the world\'s largest ship at launch, featuring a FlowRider surf simulator, H2O Zone water park, and boxing ring.',
    description_ro: 'Freedom of the Seas a fost cea mai mare nava din lume la lansare, cu simulator de surf FlowRider, parc acvatic H2O Zone si ring de box.',
    year_built: 2006, passengers: 4375, tonnage: 154407,
  },
  'Grandeur of the Seas': {
    description_en: 'Grandeur of the Seas is a Vision-class ship with wraparound glass, an expansive solarium, and classic Royal Caribbean entertainment.',
    description_ro: 'Grandeur of the Seas este o nava din clasa Vision cu sticla panoramica, solarium spatios si divertisment clasic Royal Caribbean.',
    year_built: 1996, passengers: 2446, tonnage: 73817,
  },
  'Harmony of the Seas': {
    description_en: 'Harmony of the Seas is an Oasis-class ship with the Ultimate Abyss slide, seven neighborhoods, and a robot-staffed Bionic Bar.',
    description_ro: 'Harmony of the Seas este o nava din clasa Oasis cu tobogan Ultimate Abyss, sapte cartiere si Bionic Bar cu roboti.',
    year_built: 2016, passengers: 6687, tonnage: 226963,
  },
  'Independence of the Seas': {
    description_en: 'Independence of the Seas is a Freedom-class ship with a FlowRider, rock-climbing wall, and a vibrant pool deck with water slides.',
    description_ro: 'Independence of the Seas este o nava din clasa Freedom cu FlowRider, perete de escalada si puntea de piscina cu tobogane.',
    year_built: 2008, passengers: 4375, tonnage: 154407,
  },
  'Jewel of the Seas': {
    description_en: 'Jewel of the Seas is a Radiance-class ship with panoramic glass elevators, a nine-hole mini-golf course, and serene adults-only Solarium.',
    description_ro: 'Jewel of the Seas este o nava din clasa Radiance cu lifturi panoramice, minigolf cu noua gauri si Solarium linistit doar pentru adulti.',
    year_built: 2004, passengers: 2501, tonnage: 90090,
  },
  'Legend of the Seas': {
    description_en: 'Legend of the Seas is a Vision-class ship offering an 18-hole miniature golf course, an expansive solarium, and signature Royal Caribbean fun.',
    description_ro: 'Legend of the Seas este o nava din clasa Vision cu minigolf cu 18 gauri, solarium spatios si divertisment clasic Royal Caribbean.',
    year_built: 1995, passengers: 2076, tonnage: 69130,
  },
  'Liberty of the Seas': {
    description_en: 'Liberty of the Seas is a Freedom-class ship with a FlowRider surf simulator, an H2O Zone, and a vibrant onboard nightlife scene.',
    description_ro: 'Liberty of the Seas este o nava din clasa Freedom cu simulator de surf FlowRider, zona H2O si viata de noapte vibranta la bord.',
    year_built: 2007, passengers: 4375, tonnage: 154407,
  },
  'Mariner of the Seas': {
    description_en: 'Mariner of the Seas is a Voyager-class ship featuring a Royal Promenade, ice skating rink, and revamped waterslides and laser tag.',
    description_ro: 'Mariner of the Seas este o nava din clasa Voyager cu Royal Promenade, patinoar si tobogane acvatice si laser tag renovate.',
    year_built: 2003, passengers: 3807, tonnage: 138279,
  },
  'Navigator of the Seas': {
    description_en: 'Navigator of the Seas is a Voyager-class ship with an updated waterslide, laser tag arena, and the signature Royal Promenade.',
    description_ro: 'Navigator of the Seas este o nava din clasa Voyager cu tobogan acvatic modernizat, arena laser tag si Royal Promenade.',
    year_built: 2002, passengers: 3807, tonnage: 138279,
  },
  'Oasis Of The Seas': {
    description_en: 'Oasis Of The Seas pioneered the neighborhood concept at sea with Central Park, Boardwalk, and the AquaTheater dive show.',
    description_ro: 'Oasis Of The Seas a fost pionierul conceptului de cartiere pe mare cu Central Park, Boardwalk si spectacolul AquaTheater.',
    year_built: 2009, passengers: 6780, tonnage: 225282,
  },
  'Odyssey of the Seas': {
    description_en: 'Odyssey of the Seas is a Quantum Ultra-class ship with a skydiving simulator, SeaPlex sports complex, and North Star observation pod.',
    description_ro: 'Odyssey of the Seas este o nava din clasa Quantum Ultra cu simulator de skydiving, complexul sportiv SeaPlex si capsula North Star.',
    year_built: 2021, passengers: 4905, tonnage: 169379,
  },
  'Ovation of the Seas': {
    description_en: 'Ovation of the Seas is a Quantum-class ship with the North Star capsule, Two70 entertainment venue, and bumper cars at sea.',
    description_ro: 'Ovation of the Seas este o nava din clasa Quantum cu capsula North Star, sala Two70 si masini tamponoare pe mare.',
    year_built: 2016, passengers: 4905, tonnage: 168666,
  },
  'Quantum of the Seas': {
    description_en: 'Quantum of the Seas revolutionized cruising with the North Star observation capsule, RipCord skydiving, and Bionic Bar robotics.',
    description_ro: 'Quantum of the Seas a revolutionat croazierele cu capsula North Star, RipCord skydiving si robotii Bionic Bar.',
    year_built: 2014, passengers: 4905, tonnage: 168666,
  },
  'Radiance of the Seas': {
    description_en: 'Radiance of the Seas is named for her abundance of glass, offering panoramic ocean views, a rock-climbing wall, and a serene pool deck.',
    description_ro: 'Radiance of the Seas este numita dupa abundenta de sticla, oferind vederi panoramice, perete de escalada si puntea de piscina linistita.',
    year_built: 2001, passengers: 2501, tonnage: 90090,
  },
  'Rhapsody of the Seas': {
    description_en: 'Rhapsody of the Seas is a Vision-class ship with a nine-hole mini-golf course, an adults-only solarium, and intimate dining options.',
    description_ro: 'Rhapsody of the Seas este o nava din clasa Vision cu minigolf cu noua gauri, solarium pentru adulti si restaurante intime.',
    year_built: 1997, passengers: 2435, tonnage: 78491,
  },
  'Serenade of the Seas': {
    description_en: 'Serenade of the Seas is a Radiance-class ship with floor-to-ceiling glass, a relaxing Solarium, and elegant dining experiences.',
    description_ro: 'Serenade of the Seas este o nava din clasa Radiance cu sticla de la podea la tavan, Solarium relaxant si restaurante elegante.',
    year_built: 2003, passengers: 2501, tonnage: 90090,
  },
  'Spectrum of the Seas': {
    description_en: 'Spectrum of the Seas is a Quantum Ultra-class ship tailored for Asia, featuring sky-high North Star views and the SeaPlex entertainment zone.',
    description_ro: 'Spectrum of the Seas este o nava din clasa Quantum Ultra pentru Asia, cu vederi North Star si zona de divertisment SeaPlex.',
    year_built: 2019, passengers: 4905, tonnage: 169379,
  },
  'Star of the Seas': {
    description_en: 'Star of the Seas is an Icon-class mega ship with eight themed neighborhoods, a waterpark, and next-generation sustainability features.',
    description_ro: 'Star of the Seas este o mega nava din clasa Icon cu opt cartiere tematice, parc acvatic si tehnologii de sustenabilitate de ultima generatie.',
    year_built: 2025, passengers: 7600, tonnage: 250800,
  },
  'Symphony of the Seas': {
    description_en: 'Symphony of the Seas is an Oasis-class ship with the Ultimate Abyss slide, a 1,400-seat theater, and the longest lazy river at sea.',
    description_ro: 'Symphony of the Seas este o nava din clasa Oasis cu tobogan Ultimate Abyss, teatru cu 1.400 locuri si cel mai lung rau lenes pe mare.',
    year_built: 2018, passengers: 6680, tonnage: 228081,
  },
  'Utopia of the Seas': {
    description_en: 'Utopia of the Seas is an Oasis-class ship designed for short getaways, featuring seven neighborhoods and the Royal Railway train experience.',
    description_ro: 'Utopia of the Seas este o nava din clasa Oasis pentru escapade scurte, cu sapte cartiere si experienta Royal Railway.',
    year_built: 2024, passengers: 5668, tonnage: 236860,
  },
  'Vision of the Seas': {
    description_en: 'Vision of the Seas is a Vision-class ship with an abundance of glass, providing sweeping ocean views and a relaxed cruising atmosphere.',
    description_ro: 'Vision of the Seas este o nava din clasa Vision cu multa sticla, oferind vederi panoramice si o atmosfera relaxata.',
    year_built: 1998, passengers: 2435, tonnage: 78491,
  },
  'Voyager of the Seas': {
    description_en: 'Voyager of the Seas pioneered the Royal Promenade concept and features an ice rink, rock wall, and the original FlowRider at sea.',
    description_ro: 'Voyager of the Seas a fost pionierul conceptului Royal Promenade cu patinoar, perete de escalada si primul FlowRider pe mare.',
    year_built: 1999, passengers: 3807, tonnage: 137276,
  },
  'Wonder of the Seas': {
    description_en: 'Wonder of the Seas is an Oasis-class ship with eight neighborhoods including Suite Neighborhood, and the tallest slide at sea.',
    description_ro: 'Wonder of the Seas este o nava din clasa Oasis cu opt cartiere, inclusiv Suite Neighborhood, si cel mai inalt tobogan pe mare.',
    year_built: 2022, passengers: 6988, tonnage: 236857,
  },

  // ── Norwegian Cruise Line (remaining) ──
  'Norwegian Aqua': {
    description_en: 'Norwegian Aqua is the first Prima Plus-class ship, featuring an aqua-themed waterfront, expanded go-kart track, and enhanced Mandara Spa.',
    description_ro: 'Norwegian Aqua este prima nava din clasa Prima Plus, cu o zona acvatica tematica, pista de karting extinsa si spa Mandara imbunatatit.',
    year_built: 2025, passengers: 3571, tonnage: 156300,
  },
  'Norwegian Aura': {
    description_en: 'Norwegian Aura is a Prima Plus-class ship with expanded outdoor spaces, thrilling go-kart racing, and innovative dining experiences.',
    description_ro: 'Norwegian Aura este o nava din clasa Prima Plus cu spatii exterioare extinse, curse de karting si restaurante inovatoare.',
    year_built: 2026, passengers: 3571, tonnage: 156300,
  },
  'Norwegian Bliss': {
    description_en: 'Norwegian Bliss features an open-air go-kart track, an observation lounge, and was purpose-built for Alaskan cruising.',
    description_ro: 'Norwegian Bliss are o pista de karting in aer liber, lounge de observatie si a fost construita special pentru croaziere in Alaska.',
    year_built: 2018, passengers: 4004, tonnage: 168028,
  },
  'Norwegian Dawn': {
    description_en: 'Norwegian Dawn is a Dawn-class ship with a diverse array of dining options, a spa, and garden villas with private courtyards.',
    description_ro: 'Norwegian Dawn este o nava din clasa Dawn cu restaurante diverse, spa si vile cu gradina cu curte privata.',
    year_built: 2002, passengers: 2340, tonnage: 92250,
  },
  'Norwegian Encore': {
    description_en: 'Norwegian Encore features the largest go-kart track at sea at launch, a Galaxy Pavilion virtual reality complex, and Broadway shows.',
    description_ro: 'Norwegian Encore are cea mai mare pista de karting pe mare la lansare, complex de realitate virtuala Galaxy Pavilion si spectacole Broadway.',
    year_built: 2019, passengers: 3998, tonnage: 169116,
  },
  'Norwegian Epic': {
    description_en: 'Norwegian Epic introduced studio cabins for solo travelers, a sprawling aqua park, and Cirque Dreams dinner theater.',
    description_ro: 'Norwegian Epic a introdus cabine studio pentru calatori singuri, un aquapark spatios si cina-teatru Cirque Dreams.',
    year_built: 2010, passengers: 4100, tonnage: 155873,
  },
  'Norwegian Escape': {
    description_en: 'Norwegian Escape features a multi-story ropes course, five waterslides, and Jimmy Buffett\'s Margaritaville at sea.',
    description_ro: 'Norwegian Escape are un circuit de franghii pe mai multe etaje, cinci tobogane acvatice si Margaritaville by Jimmy Buffett pe mare.',
    year_built: 2015, passengers: 4266, tonnage: 164600,
  },
  'Norwegian Gem': {
    description_en: 'Norwegian Gem is a Jewel-class ship with the signature Bliss Ultra Lounge, diverse international dining, and a serene spa.',
    description_ro: 'Norwegian Gem este o nava din clasa Jewel cu lounge-ul Bliss Ultra, restaurante internationale diverse si un spa linistit.',
    year_built: 2007, passengers: 2394, tonnage: 93530,
  },
  'Norwegian Getaway': {
    description_en: 'Norwegian Getaway features an Aqua Park with five waterslides, a ropes course, and the Illusionarium dinner show.',
    description_ro: 'Norwegian Getaway are un Aqua Park cu cinci tobogane, circuit de franghii si spectacolul Illusionarium la cina.',
    year_built: 2014, passengers: 3963, tonnage: 145655,
  },
  'Norwegian Jade': {
    description_en: 'Norwegian Jade is a Jewel-class ship with an extensive Asian-themed spa, multiple dining venues, and a lively pool deck.',
    description_ro: 'Norwegian Jade este o nava din clasa Jewel cu un spa asiatic extins, restaurante multiple si o puntea de piscina animata.',
    year_built: 2006, passengers: 2402, tonnage: 93558,
  },
  'Norwegian Jewel': {
    description_en: 'Norwegian Jewel is a mid-size ship with a stunning Garden Villa suite, diverse global cuisine, and a tranquil courtyard pool.',
    description_ro: 'Norwegian Jewel este o nava de dimensiuni medii cu suita Garden Villa, bucatarie globala diversa si piscina de curte linistita.',
    year_built: 2005, passengers: 2376, tonnage: 93502,
  },
  'Norwegian Joy': {
    description_en: 'Norwegian Joy features a go-kart track, Galaxy Pavilion virtual reality complex, and was originally designed for the Chinese market.',
    description_ro: 'Norwegian Joy are pista de karting, complexul de realitate virtuala Galaxy Pavilion si a fost proiectata initial pentru piata chineza.',
    year_built: 2017, passengers: 3883, tonnage: 167725,
  },
  'Norwegian Luna': {
    description_en: 'Norwegian Luna is a Prima-class ship with elegant design, the Indulge Food Hall, and a three-level go-kart track.',
    description_ro: 'Norwegian Luna este o nava din clasa Prima cu design elegant, Indulge Food Hall si pista de karting pe trei niveluri.',
    year_built: 2026, passengers: 3215, tonnage: 142500,
  },
  'Norwegian Pearl': {
    description_en: 'Norwegian Pearl is a Jewel-class ship with a full-size bowling alley, South Beach-themed pool deck, and diverse entertainment.',
    description_ro: 'Norwegian Pearl este o nava din clasa Jewel cu pista de bowling, puntea de piscina in stil South Beach si divertisment divers.',
    year_built: 2006, passengers: 2394, tonnage: 93530,
  },
  'Norwegian Sky': {
    description_en: 'Norwegian Sky is a Sun-class ship known for its all-inclusive bar and short Bahamas cruises from Miami.',
    description_ro: 'Norwegian Sky este o nava din clasa Sun cunoscuta pentru barul all-inclusive si croazierele scurte in Bahamas din Miami.',
    year_built: 1999, passengers: 2004, tonnage: 77104,
  },
  'Norwegian Spirit': {
    description_en: 'Norwegian Spirit is a Leo-class ship with extensive Asian-inspired decor, renovated in 2020 with modern amenities and dining.',
    description_ro: 'Norwegian Spirit este o nava din clasa Leo cu decor de inspiratie asiatica, renovata in 2020 cu facilitati si restaurante moderne.',
    year_built: 1998, passengers: 2018, tonnage: 75338,
  },
  'Norwegian Star': {
    description_en: 'Norwegian Star is a Dawn-class ship with garden villas, a sprawling spa, and multiple specialty dining restaurants.',
    description_ro: 'Norwegian Star este o nava din clasa Dawn cu vile cu gradina, un spa spatios si restaurante de specialitate multiple.',
    year_built: 2001, passengers: 2348, tonnage: 91740,
  },
  'Norwegian Sun': {
    description_en: 'Norwegian Sun is a Sun-class ship ideal for exotic itineraries, with a relaxed atmosphere and comfortable staterooms.',
    description_ro: 'Norwegian Sun este o nava din clasa Sun ideala pentru itinerarii exotice, cu atmosfera relaxata si cabine confortabile.',
    year_built: 2001, passengers: 1936, tonnage: 78309,
  },
  'Norwegian Viva': {
    description_en: 'Norwegian Viva is a Prima-class ship with the Indulge Food Hall, a three-level go-kart track, and The Drop freefall slide.',
    description_ro: 'Norwegian Viva este o nava din clasa Prima cu Indulge Food Hall, pista de karting pe trei niveluri si tobogan The Drop.',
    year_built: 2023, passengers: 3215, tonnage: 142500,
  },
  'Pride of America': {
    description_en: 'Pride of America is the only US-flagged cruise ship, sailing year-round in Hawaii with an Americana-themed interior.',
    description_ro: 'Pride of America este singura nava de croaziera sub pavilion american, navigand tot anul in Hawaii cu interior in stil american.',
    year_built: 2005, passengers: 2186, tonnage: 80439,
  },

  // ── Carnival Cruise Line ──
  'Carnival Breeze': {
    description_en: 'Carnival Breeze is a Dream-class ship with WaterWorks aqua park, a SportSquare open-air fitness area, and Guy\'s Burger Joint.',
    description_ro: 'Carnival Breeze este o nava din clasa Dream cu aquapark WaterWorks, zona de fitness SportSquare si Guy\'s Burger Joint.',
    year_built: 2012, passengers: 3690, tonnage: 130000,
  },
  'Carnival Celebration': {
    description_en: 'Carnival Celebration is an Excel-class ship with BOLT roller coaster, six themed zones, and a stunning three-deck atrium.',
    description_ro: 'Carnival Celebration este o nava din clasa Excel cu roller coaster BOLT, sase zone tematice si un atrium pe trei punti.',
    year_built: 2022, passengers: 5374, tonnage: 183521,
  },
  'Carnival Conquest': {
    description_en: 'Carnival Conquest is a Conquest-class ship themed around Impressionist art, offering a vibrant pool deck and classic Carnival fun.',
    description_ro: 'Carnival Conquest este o nava din clasa Conquest cu tema artei impresioniste, puntea de piscina vibranta si divertisment clasic Carnival.',
    year_built: 2002, passengers: 2974, tonnage: 110000,
  },
  'Carnival Dream': {
    description_en: 'Carnival Dream is the lead ship of the Dream class, featuring WaterWorks aqua park, the Cloud 9 Spa, and Ocean Plaza entertainment.',
    description_ro: 'Carnival Dream este nava emblematica a clasei Dream, cu aquapark WaterWorks, spa Cloud 9 si divertisment Ocean Plaza.',
    year_built: 2009, passengers: 3646, tonnage: 130000,
  },
  'Carnival Elation': {
    description_en: 'Carnival Elation is a Fantasy-class ship offering a classic cruise experience with a water park, spa, and lively nightlife.',
    description_ro: 'Carnival Elation este o nava din clasa Fantasy cu o experienta clasica de croaziera, parc acvatic, spa si viata de noapte animata.',
    year_built: 1998, passengers: 2606, tonnage: 70367,
  },
  'Carnival Firenze': {
    description_en: 'Carnival Firenze is a former Costa ship rebranded for Carnival, blending Italian design with Carnival\'s signature Fun Ship atmosphere.',
    description_ro: 'Carnival Firenze este o fosta nava Costa rebranduita pentru Carnival, imbinand designul italian cu atmosfera Fun Ship a Carnival.',
    year_built: 2009, passengers: 4232, tonnage: 135225,
  },
  'Carnival Freedom': {
    description_en: 'Carnival Freedom is a Conquest-class ship with themed public spaces, WaterWorks splash park, and the RedFrog Rum Bar.',
    description_ro: 'Carnival Freedom este o nava din clasa Conquest cu spatii publice tematice, parcul WaterWorks si barul RedFrog Rum.',
    year_built: 2007, passengers: 2974, tonnage: 110320,
  },
  'Carnival Glory': {
    description_en: 'Carnival Glory is a Conquest-class ship themed after colors of the world, with a lively pool deck and Guy\'s Burger Joint.',
    description_ro: 'Carnival Glory este o nava din clasa Conquest cu tema culorilor lumii, puntea de piscina animata si Guy\'s Burger Joint.',
    year_built: 2003, passengers: 2974, tonnage: 110000,
  },
  'Carnival Horizon': {
    description_en: 'Carnival Horizon is a Vista-class ship with an IMAX theater, SkyRide aerial attraction, and Dr. Seuss WaterWorks.',
    description_ro: 'Carnival Horizon este o nava din clasa Vista cu cinematograf IMAX, atractia aeriana SkyRide si parcul acvatic Dr. Seuss.',
    year_built: 2018, passengers: 3960, tonnage: 133596,
  },
  'Carnival Jubilee': {
    description_en: 'Carnival Jubilee is an Excel-class ship with BOLT roller coaster, The Shores beach zone, and Texas-inspired dining.',
    description_ro: 'Carnival Jubilee este o nava din clasa Excel cu roller coaster BOLT, zona de plaja The Shores si restaurante de inspiratie texana.',
    year_built: 2023, passengers: 5374, tonnage: 183521,
  },
  'Carnival Legend': {
    description_en: 'Carnival Legend is a Spirit-class ship themed after legendary explorers and myths, featuring the Green Thunder waterslide.',
    description_ro: 'Carnival Legend este o nava din clasa Spirit cu tema exploratorilor si miturilor legendare, cu tobogan Green Thunder.',
    year_built: 2002, passengers: 2124, tonnage: 85920,
  },
  'Carnival Liberty': {
    description_en: 'Carnival Liberty is a Conquest-class ship celebrating freedom, with a festive pool deck, multiple dining venues, and a casino.',
    description_ro: 'Carnival Liberty este o nava din clasa Conquest ce celebreaza libertatea, cu puntea de piscina festiva, restaurante si cazinou.',
    year_built: 2005, passengers: 2974, tonnage: 110320,
  },
  'Carnival Luminosa': {
    description_en: 'Carnival Luminosa is a former Costa ship now sailing for Carnival, offering Italian-inspired elegance with Carnival-style fun.',
    description_ro: 'Carnival Luminosa este o fosta nava Costa acum in flota Carnival, oferind eleganta italiana cu divertisment in stil Carnival.',
    year_built: 2009, passengers: 2826, tonnage: 92720,
  },
  'Carnival Magic': {
    description_en: 'Carnival Magic is a Dream-class ship with WaterWorks, the SportsSquare ropes course, and a vibrant RedFrog Pub.',
    description_ro: 'Carnival Magic este o nava din clasa Dream cu WaterWorks, circuitul de franghii SportsSquare si animatul RedFrog Pub.',
    year_built: 2011, passengers: 3690, tonnage: 130000,
  },
  'Carnival Miracle': {
    description_en: 'Carnival Miracle is a Spirit-class ship themed around legends and wonders, with a tranquil spa and diverse entertainment.',
    description_ro: 'Carnival Miracle este o nava din clasa Spirit cu tema legendelor si minunilor, cu spa linistit si divertisment divers.',
    year_built: 2004, passengers: 2124, tonnage: 85920,
  },
  'Carnival Panorama': {
    description_en: 'Carnival Panorama is a Vista-class ship with SkyRide bikes, a panoramic Sky Zone trampoline park, and the Cloud 9 Spa.',
    description_ro: 'Carnival Panorama este o nava din clasa Vista cu biciclete SkyRide, parcul de trambulina Sky Zone si spa-ul Cloud 9.',
    year_built: 2019, passengers: 4008, tonnage: 133596,
  },
  'Carnival Paradise': {
    description_en: 'Carnival Paradise is a Fantasy-class ship offering a budget-friendly cruise experience with classic Carnival entertainment.',
    description_ro: 'Carnival Paradise este o nava din clasa Fantasy ce ofera o experienta accesibila cu divertisment clasic Carnival.',
    year_built: 1998, passengers: 2606, tonnage: 70367,
  },
  'Carnival Pride': {
    description_en: 'Carnival Pride is a Spirit-class ship themed around great artistic masterpieces, featuring David\'s Steakhouse and a tranquil spa.',
    description_ro: 'Carnival Pride este o nava din clasa Spirit cu tema capodoperelor artistice, restaurantul David\'s Steakhouse si un spa linistit.',
    year_built: 2001, passengers: 2124, tonnage: 85920,
  },
  'Carnival Radiance': {
    description_en: 'Carnival Radiance was fully refurbished in 2022, featuring Guy\'s Pig & Anchor Smokehouse, a waterslide, and Carnival\'s newest innovations.',
    description_ro: 'Carnival Radiance a fost complet renovata in 2022, cu Guy\'s Pig & Anchor Smokehouse, tobogan si cele mai noi inovatii Carnival.',
    year_built: 2000, passengers: 2984, tonnage: 101509,
  },
  'Carnival Spirit': {
    description_en: 'Carnival Spirit is the lead ship of the Spirit class, with art-deco-inspired interiors, a two-deck dining room, and waterslide.',
    description_ro: 'Carnival Spirit este nava principala a clasei Spirit, cu interioare art-deco, restaurant pe doua punti si tobogan acvatic.',
    year_built: 2001, passengers: 2124, tonnage: 85920,
  },
  'Carnival Splendor': {
    description_en: 'Carnival Splendor is a Concordia-class ship with cloud-inspired decor, a two-level spa, and the signature Lido Deck.',
    description_ro: 'Carnival Splendor este o nava din clasa Concordia cu decor inspirat de nori, spa pe doua niveluri si emblematica punte Lido.',
    year_built: 2008, passengers: 3006, tonnage: 113323,
  },
  'Carnival Sunrise': {
    description_en: 'Carnival Sunrise was extensively refurbished in 2019, featuring new dining venues, waterslides, and a Cloud 9 Spa.',
    description_ro: 'Carnival Sunrise a fost extensiv renovata in 2019, cu restaurante noi, tobogane acvatice si spa Cloud 9.',
    year_built: 1999, passengers: 2984, tonnage: 101509,
  },
  'Carnival Sunshine': {
    description_en: 'Carnival Sunshine underwent a complete makeover with new WaterWorks, a SportSquare, and Guy\'s Burger Joint added.',
    description_ro: 'Carnival Sunshine a trecut printr-o transformare completa cu noul WaterWorks, SportSquare si Guy\'s Burger Joint.',
    year_built: 1996, passengers: 3006, tonnage: 102853,
  },
  'Carnival Valor': {
    description_en: 'Carnival Valor is a Conquest-class ship honoring bravery, with a lively pool deck, Casino Bar, and classic Carnival dining.',
    description_ro: 'Carnival Valor este o nava din clasa Conquest ce onoreaza curajul, cu puntea de piscina, Casino Bar si restaurante clasice Carnival.',
    year_built: 2004, passengers: 2974, tonnage: 110000,
  },
  'Carnival Venezia': {
    description_en: 'Carnival Venezia is a Costa-built ship rebranded for Carnival, offering an Italian-themed Fun Ship experience from New York.',
    description_ro: 'Carnival Venezia este o nava construita de Costa, rebranduita pentru Carnival, oferind o experienta Fun Ship italiana din New York.',
    year_built: 2019, passengers: 4232, tonnage: 135225,
  },
  'Carnival Vista': {
    description_en: 'Carnival Vista introduced SkyRide aerial cycling, an IMAX theater, and the first brewery at sea, RedFrog Pub & Brewery.',
    description_ro: 'Carnival Vista a introdus ciclismul aerian SkyRide, cinematograf IMAX si prima berarie pe mare, RedFrog Pub & Brewery.',
    year_built: 2016, passengers: 3934, tonnage: 133596,
  },
  'Mardi Gras': {
    description_en: 'Mardi Gras is Carnival\'s Excel-class flagship featuring BOLT, the first roller coaster at sea, and six themed zones.',
    description_ro: 'Mardi Gras este nava amiral din clasa Excel a Carnival, cu BOLT, primul roller coaster pe mare, si sase zone tematice.',
    year_built: 2020, passengers: 5374, tonnage: 183521,
  },

  // ── Celebrity Cruises (remaining) ──
  'Celebrity Apex': {
    description_en: 'Celebrity Apex is an Edge-class ship with the Magic Carpet platform, rooftop garden, and resort-style pool deck.',
    description_ro: 'Celebrity Apex este o nava din clasa Edge cu platforma Magic Carpet, gradina pe acoperis si puntea de piscina in stil resort.',
    year_built: 2020, passengers: 2910, tonnage: 129500,
  },
  'Celebrity Ascent': {
    description_en: 'Celebrity Ascent is the newest Edge-class ship with refined dining, the Magic Carpet, and a stunning Grand Plaza.',
    description_ro: 'Celebrity Ascent este cea mai noua nava din clasa Edge cu restaurante rafinate, Magic Carpet si un Grand Plaza impresionant.',
    year_built: 2023, passengers: 3260, tonnage: 140600,
  },
  'Celebrity Compass': {
    description_en: 'Celebrity Compass is an upcoming Edge-class ship continuing the series with innovative design and premium resort experiences.',
    description_ro: 'Celebrity Compass este o viitoare nava din clasa Edge, continuand seria cu design inovator si experiente premium de resort.',
    year_built: 2025, passengers: 3260, tonnage: 140600,
  },
  'Celebrity Constellation': {
    description_en: 'Celebrity Constellation is a Millennium-class ship with the signature AquaSpa, Murano restaurant, and elegant European-style interiors.',
    description_ro: 'Celebrity Constellation este o nava din clasa Millennium cu AquaSpa, restaurantul Murano si interioare elegante in stil european.',
    year_built: 2002, passengers: 2170, tonnage: 90940,
  },
  'Celebrity Eclipse': {
    description_en: 'Celebrity Eclipse is a Solstice-class ship featuring a real grass lawn, AquaSpa, hot glass-blowing shows, and refined cuisine.',
    description_ro: 'Celebrity Eclipse este o nava din clasa Solstice cu gazon real, AquaSpa, spectacole de sticlarie si bucatarie rafinata.',
    year_built: 2010, passengers: 2852, tonnage: 121878,
  },
  'Celebrity Equinox': {
    description_en: 'Celebrity Equinox is a Solstice-class ship with a real grass lawn, premium dining, and a serene adults-only Solarium.',
    description_ro: 'Celebrity Equinox este o nava din clasa Solstice cu gazon real, restaurante premium si Solarium linistit doar pentru adulti.',
    year_built: 2009, passengers: 2852, tonnage: 121878,
  },
  'Celebrity Flora': {
    description_en: 'Celebrity Flora is purpose-built for the Galapagos Islands, with outward-facing design and naturalist-led expeditions.',
    description_ro: 'Celebrity Flora este construita special pentru Insulele Galapagos, cu design orientat spre exterior si expeditii ghidate de naturalisti.',
    year_built: 2019, passengers: 100, tonnage: 5739,
  },
  'Celebrity Infinity': {
    description_en: 'Celebrity Infinity is a Millennium-class ship with AquaSpa, a two-story dining room, and panoramic glass elevators.',
    description_ro: 'Celebrity Infinity este o nava din clasa Millennium cu AquaSpa, restaurant pe doua etaje si lifturi panoramice din sticla.',
    year_built: 2001, passengers: 2170, tonnage: 90940,
  },
  'Celebrity Millennium': {
    description_en: 'Celebrity Millennium is the lead ship of the Millennium class, with AquaSpa, Olympic-size pool, and elegant modern interiors.',
    description_ro: 'Celebrity Millennium este nava principala a clasei Millennium, cu AquaSpa, piscina de dimensiuni olimpice si interioare moderne elegante.',
    year_built: 2000, passengers: 2158, tonnage: 90940,
  },
  'Celebrity Reflection': {
    description_en: 'Celebrity Reflection is the largest Solstice-class ship with an expanded Lawn Club, AquaSpa, and premium suite accommodations.',
    description_ro: 'Celebrity Reflection este cea mai mare nava din clasa Solstice cu Lawn Club extins, AquaSpa si cazare premium in suite.',
    year_built: 2012, passengers: 3046, tonnage: 126000,
  },
  'Celebrity Silhouette': {
    description_en: 'Celebrity Silhouette is a Solstice-class ship with a Lawn Club, AquaSpa with Persian Garden, and a sophisticated art collection.',
    description_ro: 'Celebrity Silhouette este o nava din clasa Solstice cu Lawn Club, AquaSpa cu Gradina Persana si o colectie de arta sofisticata.',
    year_built: 2011, passengers: 2886, tonnage: 122000,
  },
  'Celebrity Solstice': {
    description_en: 'Celebrity Solstice pioneered the Solstice class with a real grass Lawn Club, glass-blowing studio, and refined modern luxury.',
    description_ro: 'Celebrity Solstice a deschis clasa Solstice cu gazon real Lawn Club, atelier de sticlarie si lux modern rafinat.',
    year_built: 2008, passengers: 2852, tonnage: 121878,
  },
  'Celebrity Summit': {
    description_en: 'Celebrity Summit is a Millennium-class ship with AquaSpa, a two-story dining room, and elegant contemporary decor.',
    description_ro: 'Celebrity Summit este o nava din clasa Millennium cu AquaSpa, restaurant pe doua etaje si decor contemporan elegant.',
    year_built: 2001, passengers: 2158, tonnage: 90940,
  },
  'Celebrity Xcel': {
    description_en: 'Celebrity Xcel is a next-generation Edge-class ship with the Magic Carpet, expanded outdoor terraces, and world-class dining.',
    description_ro: 'Celebrity Xcel este o nava din noua generatie Edge cu Magic Carpet, terase exterioare extinse si restaurante de top mondial.',
    year_built: 2025, passengers: 3260, tonnage: 140600,
  },

  // ── Princess Cruises (remaining) ──
  'Caribbean Princess': {
    description_en: 'Caribbean Princess is a Grand-class ship with Movies Under the Stars, a lavish spa, and the signature Piazza atrium.',
    description_ro: 'Caribbean Princess este o nava din clasa Grand cu cinema sub stele, spa luxos si atriumul emblematic Piazza.',
    year_built: 2004, passengers: 3140, tonnage: 112894,
  },
  'Coral Princess': {
    description_en: 'Coral Princess is a Coral-class ship designed for Panama Canal transits, with an intimate size and diverse dining.',
    description_ro: 'Coral Princess este o nava din clasa Coral proiectata pentru tranzitul Canalului Panama, cu dimensiuni intime si restaurante diverse.',
    year_built: 2003, passengers: 1970, tonnage: 91627,
  },
  'Crown Princess': {
    description_en: 'Crown Princess is a Grand-class ship with Movies Under the Stars, the Lotus Spa, and Sabatini\'s Italian restaurant.',
    description_ro: 'Crown Princess este o nava din clasa Grand cu cinema sub stele, spa-ul Lotus si restaurantul italian Sabatini\'s.',
    year_built: 2006, passengers: 3080, tonnage: 113561,
  },
  'Diamond Princess': {
    description_en: 'Diamond Princess is a Grand-class ship with a Japanese bath onboard, Movies Under the Stars, and premium ocean-view dining.',
    description_ro: 'Diamond Princess este o nava din clasa Grand cu baie japoneza la bord, cinema sub stele si restaurante cu vedere la ocean.',
    year_built: 2004, passengers: 2670, tonnage: 115875,
  },
  'Discovery Princess': {
    description_en: 'Discovery Princess is a Royal-class ship with MedallionClass technology, Sky Suites, and the Princess Arena entertainment venue.',
    description_ro: 'Discovery Princess este o nava din clasa Royal cu tehnologia MedallionClass, Sky Suites si arena de divertisment Princess.',
    year_built: 2022, passengers: 3660, tonnage: 145000,
  },
  'Emerald Princess': {
    description_en: 'Emerald Princess is a Grand-class ship with Movies Under the Stars, the Lotus Spa, and the vibrant Piazza entertainment hub.',
    description_ro: 'Emerald Princess este o nava din clasa Grand cu cinema sub stele, spa-ul Lotus si centrul de divertisment Piazza.',
    year_built: 2007, passengers: 3080, tonnage: 113561,
  },
  'Enchanted Princess': {
    description_en: 'Enchanted Princess is a Royal-class ship with MedallionClass, Sky Suites with private balconies, and the Enclave adults-only spa.',
    description_ro: 'Enchanted Princess este o nava din clasa Royal cu MedallionClass, Sky Suites cu balcoane private si spa-ul Enclave doar pentru adulti.',
    year_built: 2020, passengers: 3660, tonnage: 145000,
  },
  'Grand Princess': {
    description_en: 'Grand Princess is a Grand-class pioneer with Movies Under the Stars, three main dining rooms, and a signature spoiler wing.',
    description_ro: 'Grand Princess este o nava pionier din clasa Grand cu cinema sub stele, trei restaurante principale si aripa emblematica.',
    year_built: 1998, passengers: 2600, tonnage: 107517,
  },
  'Island Princess': {
    description_en: 'Island Princess is a Coral-class ship ideal for exotic destinations, with an intimate size perfect for Panama Canal cruises.',
    description_ro: 'Island Princess este o nava din clasa Coral ideala pentru destinatii exotice, cu dimensiuni intime perfecte pentru Canalul Panama.',
    year_built: 2003, passengers: 1970, tonnage: 91627,
  },
  'Majestic Princess': {
    description_en: 'Majestic Princess is a Royal-class ship originally designed for the Chinese market, with premium dining and MedallionClass.',
    description_ro: 'Majestic Princess este o nava din clasa Royal proiectata initial pentru piata chineza, cu restaurante premium si MedallionClass.',
    year_built: 2017, passengers: 3560, tonnage: 143700,
  },
  'Regal Princess': {
    description_en: 'Regal Princess is a Royal-class ship with the dramatic SeaWalk glass walkway, the Piazza, and Movies Under the Stars.',
    description_ro: 'Regal Princess este o nava din clasa Royal cu pasarela SeaWalk din sticla, Piazza si cinema sub stele.',
    year_built: 2014, passengers: 3560, tonnage: 141000,
  },
  'Royal Princess': {
    description_en: 'Royal Princess is the lead Royal-class ship, featuring the SeaWalk, a dramatic atrium, and MedallionClass technology.',
    description_ro: 'Royal Princess este nava principala din clasa Royal, cu SeaWalk, atrium dramatic si tehnologia MedallionClass.',
    year_built: 2013, passengers: 3560, tonnage: 141000,
  },
  'Ruby Princess': {
    description_en: 'Ruby Princess is a Grand-class ship with Movies Under the Stars, the Lotus Spa, and a vibrant Piazza entertainment area.',
    description_ro: 'Ruby Princess este o nava din clasa Grand cu cinema sub stele, spa-ul Lotus si zona de divertisment Piazza.',
    year_built: 2008, passengers: 3080, tonnage: 113561,
  },
  'Sapphire Princess': {
    description_en: 'Sapphire Princess is a Grand-class ship with a Japanese bath, multiple pools, Movies Under the Stars, and the Lotus Spa.',
    description_ro: 'Sapphire Princess este o nava din clasa Grand cu baie japoneza, piscine multiple, cinema sub stele si spa-ul Lotus.',
    year_built: 2004, passengers: 2670, tonnage: 115875,
  },
  'Sky Princess': {
    description_en: 'Sky Princess is a Royal-class ship with Sky Suites featuring the largest balconies at sea, MedallionClass, and the Princess Theater.',
    description_ro: 'Sky Princess este o nava din clasa Royal cu Sky Suites avand cele mai mari balcoane pe mare, MedallionClass si Princess Theater.',
    year_built: 2019, passengers: 3660, tonnage: 145000,
  },
  'Star Princess': {
    description_en: 'Star Princess is a Sphere-class ship with an expansive Dome entertainment venue, Sphere technology, and elevated dining.',
    description_ro: 'Star Princess este o nava din clasa Sphere cu sala de divertisment Dome, tehnologia Sphere si restaurante elevate.',
    year_built: 2025, passengers: 4300, tonnage: 175500,
  },
  'Sun Princess': {
    description_en: 'Sun Princess is the first Sphere-class ship with the Dome entertainment venue, Piazza, and next-generation MedallionClass.',
    description_ro: 'Sun Princess este prima nava din clasa Sphere cu sala Dome, Piazza si MedallionClass de noua generatie.',
    year_built: 2024, passengers: 4300, tonnage: 175500,
  },

  // ── Holland America Line (remaining) ──
  'Eurodam': {
    description_en: 'Eurodam is a Signature-class ship with the innovative BB King\'s Blues Club, a spa, and elegant Dutch-inspired interiors.',
    description_ro: 'Eurodam este o nava din clasa Signature cu inovatorul club BB King\'s Blues, spa si interioare elegante de inspiratie olandeza.',
    year_built: 2008, passengers: 2104, tonnage: 86273,
  },
  'Koningsdam': {
    description_en: 'Koningsdam is a Pinnacle-class ship with Music Walk entertainment, the Blend wine bar, and Lincoln Center Stage performances.',
    description_ro: 'Koningsdam este o nava din clasa Pinnacle cu divertisment Music Walk, vinul Blend si spectacole Lincoln Center Stage.',
    year_built: 2016, passengers: 2650, tonnage: 99500,
  },
  'Nieuw Amsterdam': {
    description_en: 'Nieuw Amsterdam is a Signature-class ship with Dutch heritage, BB King\'s Blues Club, and premium Pinnacle Grill dining.',
    description_ro: 'Nieuw Amsterdam este o nava din clasa Signature cu mostenire olandeza, BB King\'s Blues Club si restaurantul Pinnacle Grill.',
    year_built: 2010, passengers: 2106, tonnage: 86700,
  },
  'Nieuw Statendam': {
    description_en: 'Nieuw Statendam is a Pinnacle-class ship with a music-themed interior, Rolling Stone Rock Room, and Lincoln Center Stage.',
    description_ro: 'Nieuw Statendam este o nava din clasa Pinnacle cu interior muzical, Rolling Stone Rock Room si Lincoln Center Stage.',
    year_built: 2018, passengers: 2666, tonnage: 99500,
  },
  'Noordam': {
    description_en: 'Noordam is a Vista-class ship with panoramic elevators, art deco interiors, and the Greenhouse Spa & Salon.',
    description_ro: 'Noordam este o nava din clasa Vista cu lifturi panoramice, interioare art deco si spa-ul Greenhouse.',
    year_built: 2006, passengers: 1918, tonnage: 82305,
  },
  'Oosterdam': {
    description_en: 'Oosterdam is a Vista-class ship with elegant Dutch interiors, the Explorations Cafe, and Pinnacle Grill steakhouse.',
    description_ro: 'Oosterdam este o nava din clasa Vista cu interioare elegante olandeze, cafeneaua Explorations si steakhouse-ul Pinnacle Grill.',
    year_built: 2003, passengers: 1916, tonnage: 82305,
  },
  'Rotterdam': {
    description_en: 'Rotterdam is a Pinnacle-class ship and the line\'s flagship, with Music Walk, Rolling Stone Rock Room, and Lincoln Center Stage.',
    description_ro: 'Rotterdam este o nava din clasa Pinnacle si nava amiral, cu Music Walk, Rolling Stone Rock Room si Lincoln Center Stage.',
    year_built: 2021, passengers: 2668, tonnage: 99500,
  },
  'Volendam': {
    description_en: 'Volendam is an R-class ship with art and flower-themed interiors, a Crow\'s Nest observation lounge, and intimate ambiance.',
    description_ro: 'Volendam este o nava din clasa R cu interioare tematizate pe arta si flori, lounge de observatie Crow\'s Nest si ambiant intim.',
    year_built: 1999, passengers: 1432, tonnage: 61214,
  },
  'Westerdam': {
    description_en: 'Westerdam is a Vista-class ship with exterior promenade, the Greenhouse Spa, and fine dining at Pinnacle Grill.',
    description_ro: 'Westerdam este o nava din clasa Vista cu promenada exterioara, spa-ul Greenhouse si restaurant Pinnacle Grill.',
    year_built: 2004, passengers: 1916, tonnage: 82348,
  },
  'Zaandam': {
    description_en: 'Zaandam is an R-class ship with music-themed interiors, original guitars from famous musicians, and a warm Dutch atmosphere.',
    description_ro: 'Zaandam este o nava din clasa R cu interioare muzicale, chitare originale de la muzicieni celebri si atmosfera olandeza calda.',
    year_built: 2000, passengers: 1432, tonnage: 61396,
  },
  'Zuiderdam': {
    description_en: 'Zuiderdam is the lead Vista-class ship with panoramic elevators, art deco-influenced design, and the Pinnacle Grill.',
    description_ro: 'Zuiderdam este nava principala din clasa Vista cu lifturi panoramice, design art deco si restaurantul Pinnacle Grill.',
    year_built: 2002, passengers: 1916, tonnage: 82305,
  },

  // ── Cunard Line ──
  'Queen Anne': {
    description_en: 'Queen Anne is Cunard\'s newest ship, blending modern luxury with timeless ocean liner heritage, featuring the Queens Room ballroom.',
    description_ro: 'Queen Anne este cea mai noua nava Cunard, imbinand luxul modern cu mostenirea transatlantica, cu sala de bal Queens Room.',
    year_built: 2024, passengers: 2996, tonnage: 113000,
  },
  'Queen Elizabeth': {
    description_en: 'Queen Elizabeth is a grand ocean liner with Art Deco elegance, the Royal Court Theatre, and traditional afternoon tea.',
    description_ro: 'Queen Elizabeth este un transatlantic grandios cu eleganta Art Deco, Royal Court Theatre si ceaiul traditional de dupa-amiaza.',
    year_built: 2010, passengers: 2081, tonnage: 90901,
  },
  'Queen Mary 2': {
    description_en: 'Queen Mary 2 is the iconic transatlantic ocean liner with the largest ballroom at sea, a planetarium, and refined British heritage.',
    description_ro: 'Queen Mary 2 este emblematicul transatlantic cu cea mai mare sala de bal pe mare, planetariu si mostenire britanica rafinata.',
    year_built: 2003, passengers: 2691, tonnage: 148528,
  },
  'Queen Victoria': {
    description_en: 'Queen Victoria is a classic ocean liner with a two-deck library, Royal Court Theatre, and elegant British afternoon tea service.',
    description_ro: 'Queen Victoria este un transatlantic clasic cu biblioteca pe doua punti, Royal Court Theatre si serviciu de ceai britanic elegant.',
    year_built: 2007, passengers: 2061, tonnage: 90049,
  },

  // ── Disney Cruise Line ──
  'Disney Dream': {
    description_en: 'Disney Dream features the AquaDuck water coaster, Broadway-quality shows, and immersive Disney-themed entertainment for families.',
    description_ro: 'Disney Dream are aqua-coasterul AquaDuck, spectacole de calitate Broadway si divertisment imersiv Disney pentru familii.',
    year_built: 2011, passengers: 4000, tonnage: 129690,
  },
  'Disney Fantasy': {
    description_en: 'Disney Fantasy offers the AquaDuck water coaster, a Bibbidi Bobbidi Boutique, and world-class Disney storytelling at sea.',
    description_ro: 'Disney Fantasy ofera aqua-coasterul AquaDuck, boutique-ul Bibbidi Bobbidi si povestire Disney de clasa mondiala pe mare.',
    year_built: 2012, passengers: 4000, tonnage: 129690,
  },
  'Disney Magic': {
    description_en: 'Disney Magic is Disney\'s original cruise ship with classic Disney enchantment, AquaDunk waterslide, and Broadway-quality shows.',
    description_ro: 'Disney Magic este nava originala Disney cu farmec clasic, tobogan AquaDunk si spectacole de calitate Broadway.',
    year_built: 1998, passengers: 2713, tonnage: 83969,
  },
  'Disney Treasure': {
    description_en: 'Disney Treasure draws on adventure and exploration themes with immersive dining, AquaMouse water attraction, and world-class entertainment.',
    description_ro: 'Disney Treasure are teme de aventura si explorare cu restaurante imersive, atractia acvatica AquaMouse si divertisment de top.',
    year_built: 2024, passengers: 4000, tonnage: 144000,
  },
  'Disney Wish': {
    description_en: 'Disney Wish features the AquaMouse water attraction, Star Wars lounge, and an enchanted grand hall inspired by Cinderella.',
    description_ro: 'Disney Wish are atractia acvatica AquaMouse, lounge Star Wars si o sala grandioasa inspirata de Cenusareasa.',
    year_built: 2022, passengers: 4000, tonnage: 144000,
  },
  'Disney Wonder': {
    description_en: 'Disney Wonder is a classic Disney ship with Tiana\'s Place restaurant, AquaDunk splash slide, and beloved character experiences.',
    description_ro: 'Disney Wonder este o nava clasica Disney cu restaurantul Tiana\'s Place, tobogan AquaDunk si intalniri cu personaje indragite.',
    year_built: 1999, passengers: 2713, tonnage: 83969,
  },

  // ── Oceania Cruises (remaining) ──
  'Allura': {
    description_en: 'Allura is Oceania\'s newest Allura-class ship offering refined luxury, The Culinary Center, and destination-focused itineraries.',
    description_ro: 'Allura este cea mai noua nava Oceania din clasa Allura, oferind lux rafinat, Centrul Culinar si itinerarii axate pe destinatii.',
    year_built: 2025, passengers: 1200, tonnage: 67000,
  },
  'Insignia': {
    description_en: 'Insignia is an R-class ship offering intimate luxury cruising with world-class cuisine and enriching destination experiences.',
    description_ro: 'Insignia este o nava din clasa R ce ofera croaziere de lux intime cu bucatarie de top si experiente de destinatie.',
    year_built: 1998, passengers: 684, tonnage: 30277,
  },
  'Marina': {
    description_en: 'Marina is an Oceania-class ship with The Culinary Center cooking school, Jacques Pepin dining, and artist loft suites.',
    description_ro: 'Marina este o nava din clasa Oceania cu scoala de gatit The Culinary Center, restaurantul Jacques Pepin si suite loft pentru artisti.',
    year_built: 2011, passengers: 1250, tonnage: 66084,
  },
  'Nautica': {
    description_en: 'Nautica is an intimate R-class ship with exceptional dining, enriching shore excursions, and a refined country club atmosphere.',
    description_ro: 'Nautica este o nava intima din clasa R cu restaurante exceptionale, excursii pe uscat si atmosfera rafinata de club.',
    year_built: 2000, passengers: 684, tonnage: 30277,
  },
  'Regatta': {
    description_en: 'Regatta is an intimate R-class ship with a warm country-club ambiance, gourmet dining, and worldwide itineraries.',
    description_ro: 'Regatta este o nava intima din clasa R cu ambiant cald de club, restaurante gourmet si itinerarii mondiale.',
    year_built: 1998, passengers: 684, tonnage: 30277,
  },
  'Riviera': {
    description_en: 'Riviera is an Oceania-class ship with The Culinary Center, Lalique grand staircase, and Jacques Pepin-inspired cuisine.',
    description_ro: 'Riviera este o nava din clasa Oceania cu Centrul Culinar, scara Lalique si bucatarie inspirata de Jacques Pepin.',
    year_built: 2012, passengers: 1250, tonnage: 66084,
  },
  'Sirena': {
    description_en: 'Sirena is an intimate R-class ship refurbished with modern elegance, offering Tuscan Steak and Red Ginger restaurants.',
    description_ro: 'Sirena este o nava intima din clasa R renovata cu eleganta moderna, oferind restaurantele Tuscan Steak si Red Ginger.',
    year_built: 1999, passengers: 684, tonnage: 30277,
  },
  'Sonata': {
    description_en: 'Sonata is an Allura-class ship with refined design, The Culinary Center, and immersive destination-rich itineraries.',
    description_ro: 'Sonata este o nava din clasa Allura cu design rafinat, Centrul Culinar si itinerarii imersive bogate in destinatii.',
    year_built: 2026, passengers: 1200, tonnage: 67000,
  },
  'Vista': {
    description_en: 'Vista is Oceania\'s Vista-class flagship with The Culinary Center, Aquamar Spa Terrace, and luxurious Penthouse Suites.',
    description_ro: 'Vista este nava amiral din clasa Vista a Oceania cu Centrul Culinar, terasa spa Aquamar si suite Penthouse luxoase.',
    year_built: 2023, passengers: 1200, tonnage: 67000,
  },

  // ── Azamara Club Cruises ──
  'Azamara Journey': {
    description_en: 'Azamara Journey is an intimate boutique ship specializing in longer port stays and immersive destination experiences worldwide.',
    description_ro: 'Azamara Journey este o nava boutique intima, specializata in sejururi mai lungi in port si experiente imersive de destinatie.',
    year_built: 2000, passengers: 690, tonnage: 30277,
  },
  'Azamara Onward': {
    description_en: 'Azamara Onward is the newest addition to Azamara, with upscale amenities, intimate atmosphere, and destination-focused cruising.',
    description_ro: 'Azamara Onward este cea mai noua nava Azamara, cu facilitati de lux, atmosfera intima si croaziere axate pe destinatii.',
    year_built: 1999, passengers: 690, tonnage: 30277,
  },
  'Azamara Pursuit': {
    description_en: 'Azamara Pursuit is a boutique-style ship offering destination immersion with late-night port stays and diverse global itineraries.',
    description_ro: 'Azamara Pursuit este o nava in stil boutique ce ofera imersiune in destinatii cu sejururi nocturne in port si itinerarii globale.',
    year_built: 2001, passengers: 690, tonnage: 30277,
  },
  'Azamara Quest': {
    description_en: 'Azamara Quest is an intimate ship known for longer port visits, night touring, and an inclusive premium experience.',
    description_ro: 'Azamara Quest este o nava intima cunoscuta pentru vizite portuare prelungite, tururi nocturne si o experienta premium all-inclusive.',
    year_built: 2000, passengers: 690, tonnage: 30277,
  },

  // ── Silversea Cruises ──
  'Silver Cloud Expedition': {
    description_en: 'Silver Cloud Expedition is a luxury expedition ship converted for polar voyages, with Zodiac boats and expert-led exploration.',
    description_ro: 'Silver Cloud Expedition este o nava de expeditie de lux convertita pentru calatorii polare, cu barci Zodiac si explorare ghidata.',
    year_built: 1994, passengers: 254, tonnage: 16800,
  },
  'Silver Dawn': {
    description_en: 'Silver Dawn is a Muse-class ultra-luxury ship with butler service, S.A.L.T. culinary program, and eight onboard restaurants.',
    description_ro: 'Silver Dawn este o nava ultra-luxoasa din clasa Muse cu serviciu de majordom, programul culinar S.A.L.T. si opt restaurante la bord.',
    year_built: 2022, passengers: 596, tonnage: 40700,
  },
  'Silver Endeavour': {
    description_en: 'Silver Endeavour is a luxury polar expedition ship with ice-class hull, expert naturalists, and all-suite accommodations.',
    description_ro: 'Silver Endeavour este o nava de expeditie polara de lux cu coca pentru gheata, naturalisti experti si cazare exclusiv in suite.',
    year_built: 2021, passengers: 200, tonnage: 20000,
  },
  'Silver Moon': {
    description_en: 'Silver Moon is a Muse-class ultra-luxury ship featuring the S.A.L.T. culinary program, butler service, and all-suite design.',
    description_ro: 'Silver Moon este o nava ultra-luxoasa din clasa Muse cu programul culinar S.A.L.T., serviciu de majordom si design exclusiv in suite.',
    year_built: 2020, passengers: 596, tonnage: 40700,
  },
  'Silver Muse': {
    description_en: 'Silver Muse is the flagship of Silversea with eight dining venues, butler service, and elegant all-suite accommodations.',
    description_ro: 'Silver Muse este nava amiral Silversea cu opt restaurante, serviciu de majordom si cazare eleganta exclusiv in suite.',
    year_built: 2017, passengers: 596, tonnage: 40700,
  },
  'Silver Nova': {
    description_en: 'Silver Nova is Silversea\'s next-generation ship with asymmetric design, expanded public spaces, and the S.A.L.T. program.',
    description_ro: 'Silver Nova este nava de noua generatie Silversea cu design asimetric, spatii publice extinse si programul S.A.L.T.',
    year_built: 2023, passengers: 728, tonnage: 54700,
  },
  'Silver Origin': {
    description_en: 'Silver Origin is purpose-built for the Galapagos with expert naturalists, Zodiac exploration, and ultra-luxury all-suite cabins.',
    description_ro: 'Silver Origin este construita special pentru Galapagos cu naturalisti experti, explorare Zodiac si cabine ultra-lux in suite.',
    year_built: 2021, passengers: 100, tonnage: 5800,
  },
  'Silver Ray': {
    description_en: 'Silver Ray is a Nova-class ship with asymmetric design, expanded outdoor terraces, and next-generation Silversea luxury.',
    description_ro: 'Silver Ray este o nava din clasa Nova cu design asimetric, terase exterioare extinse si luxul Silversea de noua generatie.',
    year_built: 2024, passengers: 728, tonnage: 54700,
  },
  'Silver Shadow': {
    description_en: 'Silver Shadow is a classic Silversea ship with intimate all-suite accommodations, butler service, and refined Italian heritage.',
    description_ro: 'Silver Shadow este o nava clasica Silversea cu cazare intima in suite, serviciu de majordom si mostenire italiana rafinata.',
    year_built: 2000, passengers: 382, tonnage: 28258,
  },
  'Silver Spirit': {
    description_en: 'Silver Spirit was lengthened in 2018, offering expanded public spaces, eight dining options, and all-suite luxury with butler service.',
    description_ro: 'Silver Spirit a fost extinsa in 2018, oferind spatii publice mai mari, opt restaurante si lux in suite cu serviciu de majordom.',
    year_built: 2009, passengers: 608, tonnage: 39519,
  },
  'Silver Whisper': {
    description_en: 'Silver Whisper is a classic Silversea ultra-luxury ship with all-suite cabins, personalized butler service, and global itineraries.',
    description_ro: 'Silver Whisper este o nava clasica Silversea ultra-lux cu cabine in suite, serviciu personalizat de majordom si itinerarii globale.',
    year_built: 2001, passengers: 382, tonnage: 28258,
  },
  'Silver Wind': {
    description_en: 'Silver Wind is an intimate Silversea ship with all-suite accommodations, open-seating dining, and a warm onboard atmosphere.',
    description_ro: 'Silver Wind este o nava intima Silversea cu cazare in suite, restaurant cu loc liber si atmosfera calda la bord.',
    year_built: 1994, passengers: 296, tonnage: 17400,
  },

  // ── Seabourn ──
  'Seabourn Encore': {
    description_en: 'Seabourn Encore is an ultra-luxury ship with all-suite veranda cabins, The Grill by Thomas Keller, and a serene onboard spa.',
    description_ro: 'Seabourn Encore este o nava ultra-lux cu suite cu veranda, restaurantul The Grill by Thomas Keller si spa linistit la bord.',
    year_built: 2016, passengers: 604, tonnage: 40350,
  },
  'Seabourn Ovation': {
    description_en: 'Seabourn Ovation is an ultra-luxury ship with The Grill by Thomas Keller, all-suite accommodations, and Spa & Wellness with Dr. Andrew Weil.',
    description_ro: 'Seabourn Ovation este o nava ultra-lux cu The Grill by Thomas Keller, cazare in suite si Spa & Wellness cu Dr. Andrew Weil.',
    year_built: 2018, passengers: 604, tonnage: 40350,
  },
  'Seabourn Pursuit': {
    description_en: 'Seabourn Pursuit is an ultra-luxury expedition ship with submarines, Zodiac boats, and expert-led polar and tropical voyages.',
    description_ro: 'Seabourn Pursuit este o nava de expeditie ultra-lux cu submarine, barci Zodiac si calatorii polare si tropicale ghidate de experti.',
    year_built: 2023, passengers: 264, tonnage: 23000,
  },
  'Seabourn Quest': {
    description_en: 'Seabourn Quest is an intimate ultra-luxury ship with all-suite cabins, open-bar service, and refined Thomas Keller cuisine.',
    description_ro: 'Seabourn Quest este o nava ultra-lux intima cu cabine in suite, bar deschis si bucatarie rafinata Thomas Keller.',
    year_built: 2011, passengers: 458, tonnage: 32346,
  },
  'Seabourn Sojourn': {
    description_en: 'Seabourn Sojourn is an ultra-luxury ship with all-suite cabins, complimentary fine wines, and The Grill by Thomas Keller.',
    description_ro: 'Seabourn Sojourn este o nava ultra-lux cu cabine in suite, vinuri fine complementare si The Grill by Thomas Keller.',
    year_built: 2010, passengers: 458, tonnage: 32346,
  },
  'Seabourn Venture': {
    description_en: 'Seabourn Venture is an ultra-luxury expedition ship with custom-built submarines, Zodiacs, and expert naturalist guides.',
    description_ro: 'Seabourn Venture este o nava de expeditie ultra-lux cu submarine personalizate, Zodiac si ghizi naturalisti experti.',
    year_built: 2022, passengers: 264, tonnage: 23000,
  },

  // ── Regent Seven Seas Cruises ──
  'Seven Seas Explorer': {
    description_en: 'Seven Seas Explorer was billed as the most luxurious ship ever built, with a Regent Suite, Culinary Arts Kitchen, and all-inclusive luxury.',
    description_ro: 'Seven Seas Explorer a fost numita cea mai luxoasa nava construita vreodata, cu Regent Suite, bucatarie Culinary Arts si lux all-inclusive.',
    year_built: 2016, passengers: 750, tonnage: 55254,
  },
  'Seven Seas Grandeur': {
    description_en: 'Seven Seas Grandeur is an all-suite, all-balcony ship with curated art collections, five dining venues, and all-inclusive fares.',
    description_ro: 'Seven Seas Grandeur este o nava cu suite si balcoane, colectii de arta curate, cinci restaurante si tarife all-inclusive.',
    year_built: 2023, passengers: 750, tonnage: 55254,
  },
  'Seven Seas Mariner': {
    description_en: 'Seven Seas Mariner was the first all-suite, all-balcony cruise ship, offering intimate luxury with world-class dining.',
    description_ro: 'Seven Seas Mariner a fost prima nava de croaziera cu suite si balcoane, oferind lux intim cu restaurante de top.',
    year_built: 2001, passengers: 700, tonnage: 48075,
  },
  'Seven Seas Navigator': {
    description_en: 'Seven Seas Navigator is a compact luxury ship with all-suite cabins, personalized service, and a refined onboard experience.',
    description_ro: 'Seven Seas Navigator este o nava compacta de lux cu cabine in suite, serviciu personalizat si experienta rafinata la bord.',
    year_built: 1999, passengers: 490, tonnage: 28550,
  },
  'Seven Seas Prestige': {
    description_en: 'Seven Seas Prestige is Regent\'s newest all-suite ship with expanded culinary options, a luxurious spa, and all-inclusive fares.',
    description_ro: 'Seven Seas Prestige este cea mai noua nava Regent cu suite, optiuni culinare extinse, spa luxos si tarife all-inclusive.',
    year_built: 2026, passengers: 850, tonnage: 77000,
  },
  'Seven Seas Splendor': {
    description_en: 'Seven Seas Splendor is an all-inclusive ultra-luxury ship with the Regent Suite, five gourmet restaurants, and Canyon Ranch Spa.',
    description_ro: 'Seven Seas Splendor este o nava ultra-lux all-inclusive cu Regent Suite, cinci restaurante gourmet si Canyon Ranch Spa.',
    year_built: 2020, passengers: 750, tonnage: 55254,
  },
  'Seven Seas Voyager': {
    description_en: 'Seven Seas Voyager is an all-suite, all-balcony ship with intimate luxury, four open-seating restaurants, and world cruises.',
    description_ro: 'Seven Seas Voyager este o nava cu suite si balcoane, lux intim, patru restaurante cu loc liber si croaziere in jurul lumii.',
    year_built: 2003, passengers: 700, tonnage: 42363,
  },

  // ── Crystal Cruises ──
  'Crystal Serenity': {
    description_en: 'Crystal Serenity is a luxury ship with open-seating dining, Crystal Spa, a cinema, and renowned six-star service.',
    description_ro: 'Crystal Serenity este o nava de lux cu restaurante cu loc liber, Crystal Spa, cinema si serviciu renumit de sase stele.',
    year_built: 2003, passengers: 980, tonnage: 68870,
  },
  'Crystal Symphony': {
    description_en: 'Crystal Symphony is an elegant luxury ship known for its spacious design, world-class entertainment, and inclusive fine dining.',
    description_ro: 'Crystal Symphony este o nava de lux eleganta, cunoscuta pentru designul spatios, divertisment de top si restaurante fine inclusive.',
    year_built: 1995, passengers: 848, tonnage: 51044,
  },

  // ── Virgin Voyages ──
  'Brilliant Lady': {
    description_en: 'Brilliant Lady is the fourth Virgin Voyages ship, continuing the adults-only concept with bold design and inclusive dining.',
    description_ro: 'Brilliant Lady este a patra nava Virgin Voyages, continuand conceptul doar pentru adulti cu design indraznet si mese incluse.',
    year_built: 2025, passengers: 2770, tonnage: 110000,
  },
  'Resilient Lady': {
    description_en: 'Resilient Lady is a Virgin Voyages ship with adults-only cruising, The Galley food hall, and a transformative Richard\'s Rooftop.',
    description_ro: 'Resilient Lady este o nava Virgin Voyages doar pentru adulti, cu piata alimentara The Galley si terasa Richard\'s Rooftop.',
    year_built: 2023, passengers: 2770, tonnage: 110000,
  },
  'Scarlet Lady': {
    description_en: 'Scarlet Lady is the inaugural Virgin Voyages ship with adults-only cruising, 20+ dining venues, and a tattoo parlor at sea.',
    description_ro: 'Scarlet Lady este prima nava Virgin Voyages, doar pentru adulti, cu peste 20 restaurante si salon de tatuaje pe mare.',
    year_built: 2021, passengers: 2770, tonnage: 110000,
  },
  'Valiant Lady': {
    description_en: 'Valiant Lady is a Virgin Voyages ship offering adults-only cruising with bold design, diverse dining, and a festival-like atmosphere.',
    description_ro: 'Valiant Lady este o nava Virgin Voyages doar pentru adulti cu design indraznet, restaurante diverse si atmosfera de festival.',
    year_built: 2022, passengers: 2770, tonnage: 110000,
  },

  // ── P&O Cruises ──
  'Arvia': {
    description_en: 'Arvia is P&O Cruises\' newest and largest ship, powered by LNG, with a SkyDome pool and retractable roof entertainment venue.',
    description_ro: 'Arvia este cea mai noua si mare nava P&O Cruises, alimentata cu GNL, cu piscina SkyDome si sala cu acoperis retractabil.',
    year_built: 2022, passengers: 5200, tonnage: 184089,
  },

  // ── Celestyal Cruises ──
  'Celestyal Discovery': {
    description_en: 'Celestyal Discovery is a mid-size ship offering Greek island cruises with authentic Hellenic cuisine and cultural experiences.',
    description_ro: 'Celestyal Discovery este o nava de dimensiuni medii ce ofera croaziere in insulele grecesti cu bucatarie elena autentica.',
    year_built: 1992, passengers: 1260, tonnage: 53000,
  },
  'Celestyal Journey': {
    description_en: 'Celestyal Journey is a refurbished ship offering immersive Greek island itineraries with local food and cultural programs.',
    description_ro: 'Celestyal Journey este o nava renovata ce ofera itinerarii imersive in insulele grecesti cu mancare locala si programe culturale.',
    year_built: 2002, passengers: 1260, tonnage: 55000,
  },

  // ── Explora Journeys ──
  'EXPLORA I': {
    description_en: 'EXPLORA I is the debut luxury ship from Explora Journeys, featuring ocean-front suites, nine dining experiences, and four pools.',
    description_ro: 'EXPLORA I este prima nava de lux de la Explora Journeys, cu suite pe malul oceanului, noua restaurante si patru piscine.',
    year_built: 2023, passengers: 922, tonnage: 63900,
  },
  'EXPLORA II': {
    description_en: 'EXPLORA II continues the Explora Journeys standard with all-suite luxury, diverse dining, and immersive destination experiences.',
    description_ro: 'EXPLORA II continua standardul Explora Journeys cu lux in suite, restaurante diverse si experiente imersive de destinatie.',
    year_built: 2024, passengers: 922, tonnage: 63900,
  },
  'EXPLORA III': {
    description_en: 'EXPLORA III is an upcoming Explora Journeys ship with expanded suite offerings, next-generation design, and destination-rich itineraries.',
    description_ro: 'EXPLORA III este o viitoare nava Explora Journeys cu suite extinse, design de noua generatie si itinerarii bogate in destinatii.',
    year_built: 2026, passengers: 922, tonnage: 63900,
  },

  // ── Four Seasons Yachts ──
  'Four Seasons I': {
    description_en: 'Four Seasons I is the inaugural ultra-luxury yacht from Four Seasons, with all-suite design, 1:1 guest-to-crew ratio, and world-class dining.',
    description_ro: 'Four Seasons I este primul iaht ultra-lux Four Seasons, cu design in suite, raport 1:1 oaspeti-echipaj si restaurante de top.',
    year_built: 2025, passengers: 222, tonnage: 34000,
  },

  // ── AROYA Cruises ──
  'AROYA': {
    description_en: 'AROYA is the first Saudi Arabian cruise ship, offering Red Sea and Arabian Gulf itineraries with regional hospitality and entertainment.',
    description_ro: 'AROYA este prima nava de croaziera din Arabia Saudita, oferind itinerarii in Marea Rosie si Golful Arab cu ospitalitate regionala.',
    year_built: 2001, passengers: 4200, tonnage: 90090,
  },

  // ── Aida Cruises ──
  'AIDAperla': {
    description_en: 'AIDAperla is a Hyperion-class ship featuring a beach club, four-lane water slide, and open-air dining under the stars.',
    description_ro: 'AIDAperla este o nava din clasa Hyperion cu club de plaja, tobogan cu patru benzi si restaurant in aer liber sub stele.',
    year_built: 2017, passengers: 3286, tonnage: 125572,
  },

  // ── SeaDream Yacht Club ──
  'SeaDream I': {
    description_en: 'SeaDream I is a mega-yacht offering an intimate yachting experience with Balinese Dream Beds on deck and all-inclusive luxury.',
    description_ro: 'SeaDream I este un mega-iaht ce ofera o experienta de yachting intima cu paturi Dream balineze pe punte si lux all-inclusive.',
    year_built: 1984, passengers: 112, tonnage: 4253,
  },
  'SeaDream II': {
    description_en: 'SeaDream II is a mega-yacht offering personalized yachting with a watersports marina, Balinese beds on deck, and intimate dining.',
    description_ro: 'SeaDream II este un mega-iaht cu yachting personalizat, marina de sporturi nautice, paturi balineze pe punte si restaurant intim.',
    year_built: 1985, passengers: 112, tonnage: 4253,
  },

  // ── Windstar Cruises ──
  'Star Breeze': {
    description_en: 'Star Breeze is a Star Plus-class yacht with an expanded World Spa, 50% more guest space, and intimate 312-guest capacity.',
    description_ro: 'Star Breeze este un iaht din clasa Star Plus cu World Spa extins, 50% mai mult spatiu si capacitate intima de 312 oaspeti.',
    year_built: 1989, passengers: 312, tonnage: 10700,
  },
  'Star Legend': {
    description_en: 'Star Legend is a Star Plus-class yacht with a watersports platform, World Spa, and refined open-seating dining.',
    description_ro: 'Star Legend este un iaht din clasa Star Plus cu platforma de sporturi nautice, World Spa si restaurant rafinat cu loc liber.',
    year_built: 1992, passengers: 312, tonnage: 10700,
  },
  'Star Pride': {
    description_en: 'Star Pride is a Star Plus-class yacht with intimate luxury, a watersports marina, and all-inclusive upscale dining.',
    description_ro: 'Star Pride este un iaht din clasa Star Plus cu lux intim, marina de sporturi nautice si restaurante de lux all-inclusive.',
    year_built: 1988, passengers: 312, tonnage: 10700,
  },
  'Star Seeker': {
    description_en: 'Star Seeker is Windstar\'s newest purpose-built yacht with modern design, expanded suites, and destination-focused itineraries.',
    description_ro: 'Star Seeker este cel mai nou iaht Windstar construit special, cu design modern, suite extinse si itinerarii de destinatie.',
    year_built: 2025, passengers: 312, tonnage: 10700,
  },
  'Wind Spirit': {
    description_en: 'Wind Spirit is a sleek motor-sailing yacht with four masts, carrying 148 guests for intimate windswept voyages.',
    description_ro: 'Wind Spirit este un iaht motor-velier elegant cu patru catarge, transportand 148 oaspeti in calatorii intime cu vant.',
    year_built: 1988, passengers: 148, tonnage: 5736,
  },
  'Wind Star': {
    description_en: 'Wind Star is a classic four-masted motor-sailing yacht offering an intimate sailing experience with 148 guests and open-air dining.',
    description_ro: 'Wind Star este un iaht clasic motor-velier cu patru catarge, oferind o experienta intima cu 148 oaspeti si restaurant in aer liber.',
    year_built: 1986, passengers: 148, tonnage: 5736,
  },
  'Wind Surf': {
    description_en: 'Wind Surf is the world\'s largest sailing cruise ship with five masts, a watersports platform, and refined French cuisine.',
    description_ro: 'Wind Surf este cea mai mare nava de croaziera cu vele din lume, cu cinci catarge, platforma de sporturi nautice si bucatarie franceza.',
    year_built: 1990, passengers: 342, tonnage: 14745,
  },

  // ── Uniworld River Cruises ──
  'Ganges Voyager II': {
    description_en: 'Ganges Voyager II is a luxury river ship sailing India\'s sacred Ganges River with all-suite cabins and authentic cultural experiences.',
    description_ro: 'Ganges Voyager II este o nava fluviala de lux pe raul sacru Gange din India, cu cabine in suite si experiente culturale autentice.',
    year_built: 2016, passengers: 56,
  },
  'River Duchess': {
    description_en: 'River Duchess is a charming river ship sailing European waterways with elegant interiors and curated shore excursions.',
    description_ro: 'River Duchess este o nava fluviala fermecatoare pe caile navigabile europene, cu interioare elegante si excursii curate.',
    year_built: 2003, passengers: 130,
  },
  'River Tosca': {
    description_en: 'River Tosca is a luxury Nile river ship with all-suite cabins, Egyptian-themed decor, and guided temple excursions.',
    description_ro: 'River Tosca este o nava fluviala de lux pe Nil, cu cabine in suite, decor cu tema egipteana si excursii la temple.',
    year_built: 2005, passengers: 82,
  },
  'S.S. Antoinette': {
    description_en: 'S.S. Antoinette is a luxury Super Ship sailing the Rhine, inspired by Marie Antoinette with opulent French-themed decor.',
    description_ro: 'S.S. Antoinette este o nava de lux Super Ship pe Rin, inspirata de Marie Antoinette cu decor opulent francez.',
    year_built: 2011, passengers: 154,
  },
  'S.S. Beatrice': {
    description_en: 'S.S. Beatrice is a luxury Super Ship sailing the Danube with handcrafted Savoir beds, a heated pool, and butler service.',
    description_ro: 'S.S. Beatrice este o nava de lux Super Ship pe Dunare, cu paturi Savoir, piscina incalzita si serviciu de majordom.',
    year_built: 2009, passengers: 150,
  },
  'S.S. Bon Voyage': {
    description_en: 'S.S. Bon Voyage is a luxury Super Ship sailing the Garonne and Dordogne rivers through the renowned Bordeaux wine region.',
    description_ro: 'S.S. Bon Voyage este o nava de lux Super Ship pe raurile Garonne si Dordogne, prin renumita regiune viticola Bordeaux.',
    year_built: 2019, passengers: 128,
  },
  'S.S. Catherine': {
    description_en: 'S.S. Catherine is a luxury Super Ship sailing the Rhone and Saone rivers through Burgundy and Provence with refined French cuisine.',
    description_ro: 'S.S. Catherine este o nava de lux Super Ship pe Rhone si Saone, prin Burgundia si Provence, cu bucatarie franceza rafinata.',
    year_built: 2014, passengers: 159,
  },
  'S.S. Joie de Vivre': {
    description_en: 'S.S. Joie de Vivre is a luxury Super Ship sailing the Seine through Paris and Normandy with boutique-hotel style.',
    description_ro: 'S.S. Joie de Vivre este o nava de lux Super Ship pe Sena, prin Paris si Normandia, in stil de hotel boutique.',
    year_built: 2017, passengers: 128,
  },
  'S.S. La Venezia': {
    description_en: 'S.S. La Venezia is a luxury Super Ship sailing the Venice lagoon and Po River with Murano glass-inspired decor.',
    description_ro: 'S.S. La Venezia este o nava de lux Super Ship in laguna Venetiei si pe raul Po, cu decor inspirat de sticla Murano.',
    year_built: 2020, passengers: 130,
  },
  'S.S. Maria Theresa': {
    description_en: 'S.S. Maria Theresa is a luxury Super Ship sailing the Rhine, Main, and Danube with Habsburg-inspired opulent design.',
    description_ro: 'S.S. Maria Theresa este o nava de lux Super Ship pe Rin, Main si Dunare, cu design opulent de inspiratie habsburgica.',
    year_built: 2015, passengers: 150,
  },
  'S.S. São Gabriel': {
    description_en: 'S.S. São Gabriel is a luxury Super Ship sailing Portugal\'s Douro River with hand-painted tiles and Portuguese-inspired decor.',
    description_ro: 'S.S. Sao Gabriel este o nava de lux Super Ship pe raul Douro din Portugalia, cu faianta pictata manual si decor portughez.',
    year_built: 2020, passengers: 130,
  },
  'S.S. Victoria': {
    description_en: 'S.S. Victoria is a luxury river ship sailing the Yangtze River in China with contemporary Asian design and cultural excursions.',
    description_ro: 'S.S. Victoria este o nava fluviala de lux pe raul Yangtze din China, cu design asiatic contemporan si excursii culturale.',
    year_built: 2009, passengers: 124,
  },

  // ── A-Rosa Cruises ──
  'A-Rosa Brava': {
    description_en: 'A-Rosa Brava is a premium river cruise ship with all-inclusive concept, spa, and relaxed atmosphere on European rivers.',
    description_ro: 'A-Rosa Brava este o nava fluviala premium cu concept all-inclusive, spa si atmosfera relaxata pe raurile europene.',
    year_built: 2024, passengers: 262,
  },
  'A-Rosa Flora': {
    description_en: 'A-Rosa Flora is a compact river ship with a spa, sundeck pool, and all-inclusive cruising on the Rhine and its tributaries.',
    description_ro: 'A-Rosa Flora este o nava fluviala compacta cu spa, piscina pe terasa si croaziera all-inclusive pe Rin si afluenti.',
    year_built: 2014, passengers: 183,
  },
  'A-Rosa Sena': {
    description_en: 'A-Rosa Sena is A-Rosa\'s newest E-Motion Ship with innovative hybrid technology and modern river cruise amenities.',
    description_ro: 'A-Rosa Sena este cea mai noua nava E-Motion de la A-Rosa cu tehnologie hibrida inovatoare si facilitati moderne de croaziera.',
    year_built: 2022, passengers: 280,
  },
  'A-Rosa Silva': {
    description_en: 'A-Rosa Silva is a premium river ship with an all-inclusive bar, spa, and cruises on the Danube and Rhine.',
    description_ro: 'A-Rosa Silva este o nava fluviala premium cu bar all-inclusive, spa si croaziere pe Dunare si Rin.',
    year_built: 2012, passengers: 186,
  },

  // ── Nicko Cruises ──
  'BOLERO': {
    description_en: 'BOLERO is a charming river cruise ship sailing European rivers with a traditional atmosphere and scenic itineraries.',
    description_ro: 'BOLERO este o nava fluviala fermecatoare pe raurile europene, cu atmosfera traditionala si itinerarii pitoresti.',
    year_built: 2003, passengers: 180,
  },
  'MAXIMA': {
    description_en: 'MAXIMA is a modern river cruise ship with panoramic lounge, sundeck, and cruises on the Danube and Rhine.',
    description_ro: 'MAXIMA este o nava fluviala moderna cu lounge panoramic, terasa si croaziere pe Dunare si Rin.',
    year_built: 2003, passengers: 180,
  },

  // ── Viva Cruises ──
  'VIVA BEYOND': {
    description_en: 'VIVA BEYOND is a modern river cruise ship with a wellness area, panoramic restaurant, and cruises on European waterways.',
    description_ro: 'VIVA BEYOND este o nava fluviala moderna cu zona de wellness, restaurant panoramic si croaziere pe caile navigabile europene.',
    year_built: 2023, passengers: 176,
  },
  'VIVA ENJOY': {
    description_en: 'VIVA ENJOY is a contemporary river ship with a lively atmosphere, sundeck pool, and itineraries across European rivers.',
    description_ro: 'VIVA ENJOY este o nava fluviala contemporana cu atmosfera animata, piscina pe terasa si itinerarii pe raurile europene.',
    year_built: 2023, passengers: 176,
  },
  'VIVA ONE': {
    description_en: 'VIVA ONE is a river cruise ship offering European river journeys with a spa, panoramic lounge, and all-inclusive packages.',
    description_ro: 'VIVA ONE este o nava fluviala ce ofera calatorii pe rauri europene cu spa, lounge panoramic si pachete all-inclusive.',
    year_built: 2000, passengers: 176,
  },

  // ── Crucemundo ──
  'MS Douro Cruiser': {
    description_en: 'MS Douro Cruiser is a river ship sailing Portugal\'s Douro Valley, offering scenic vineyard views and Portuguese cuisine.',
    description_ro: 'MS Douro Cruiser este o nava fluviala pe Valea Douro din Portugalia, oferind privelisti viticole si bucatarie portugheza.',
    year_built: 2007, passengers: 130,
  },
  'MS Leonora': {
    description_en: 'MS Leonora is a river ship offering Danube cruises with traditional European charm, comfortable cabins, and scenic itineraries.',
    description_ro: 'MS Leonora este o nava fluviala ce ofera croaziere pe Dunare cu farmec european traditional, cabine confortabile si itinerarii pitoresti.',
    year_built: 1998, passengers: 140,
  },
  'MS River Sapphire': {
    description_en: 'MS River Sapphire is a river ship sailing European waterways with a sundeck, panoramic restaurant, and comfortable staterooms.',
    description_ro: 'MS River Sapphire este o nava fluviala pe caile navigabile europene cu terasa, restaurant panoramic si cabine confortabile.',
    year_built: 2005, passengers: 140,
  },
  'MS VistaGracia': {
    description_en: 'MS VistaGracia is a river ship offering scenic European river cruises with a cozy atmosphere and attentive crew.',
    description_ro: 'MS VistaGracia este o nava fluviala ce ofera croaziere pitoresiti pe raurile europene cu atmosfera confortabila si echipaj atent.',
    year_built: 2010, passengers: 130,
  },

  // ── AmaWaterways ──
  'Zambezi Queen': {
    description_en: 'Zambezi Queen is a luxury houseboat-style river ship cruising the Chobe River with wildlife viewing and African safari experiences.',
    description_ro: 'Zambezi Queen este o nava fluviala de lux in stil de casa plutitoare pe raul Chobe, cu observare de animale si safari african.',
    year_built: 2009, passengers: 28,
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
