// ============================================================
// HD Ship & Cruise Line Images
// ============================================================
// Maps ships and cruise lines to high-quality Unsplash images
// Used as fallback/override when scraped images are low quality
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
  'Holland America Line':       'https://images.unsplash.com/photo-1499793983394-e58fc2fce9c2?w=800&q=80',
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
  'MSC Divina':           'https://images.unsplash.com/photo-1499793983394-e58fc2fce9c2?w=800&q=80',
  'MSC Opera':            'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=800&q=80',
  'MSC Sinfonia':         'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'MSC Musica':           'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=800&q=80',
  'MSC Poesia':           'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',

  // ── Costa Cruises ────────────────────────────────────────
  'Costa Toscana':        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
  'Costa Smeralda':       'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Costa Pacifica':       'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
  'Costa Serena':         'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
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
  'Diamond Princess':     'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
  'Sapphire Princess':    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'Royal Princess':       'https://images.unsplash.com/photo-1559599746-8823b38544c6?w=800&q=80',
  'Crown Princess':       'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'Emerald Princess':     'https://images.unsplash.com/photo-1499793983394-e58fc2fce9c2?w=800&q=80',
  'Ruby Princess':        'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80',
  'Caribbean Princess':   'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',

  // ── Holland America Line ─────────────────────────────────
  'Nieuw Statendam':      'https://images.unsplash.com/photo-1499793983394-e58fc2fce9c2?w=800&q=80',
  'Rotterdam':            'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'Zuiderdam':            'https://images.unsplash.com/photo-1515005318787-cc68052b38f3?w=800&q=80',
  'Oosterdam':            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Koningsdam':           'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  'Nieuw Amsterdam':      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',

  // ── Cunard ───────────────────────────────────────────────
  'Queen Elizabeth':       'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=800&q=80',
  'Queen Mary 2':          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  'Queen Anne':            'https://images.unsplash.com/photo-1559599238-308793637427?w=800&q=80',
  'Queen Victoria':        'https://images.unsplash.com/photo-1499793983394-e58fc2fce9c2?w=800&q=80',

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

  // If the image is from croaziere.net (scraped thumbnails = low quality), prefer HD
  if (originalUrl.includes('croaziere.net')) {
    return getHDImage(shipName, cruiseLine) ?? originalUrl
  }

  // Otherwise keep the original (e.g. Unsplash images from featured cruises)
  return originalUrl
}
