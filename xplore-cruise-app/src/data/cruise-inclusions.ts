/**
 * Cruise-line-specific included/excluded items.
 * Each cruise line has different policies on what's included in the base fare.
 * When the croaziere.net API starts returning HTML content, that will override these fallbacks.
 */

export interface InclusionSet {
  included: string[]
  included_ro: string[]
  excluded: string[]
  excluded_ro: string[]
}

// ============================================================
// Per-cruise-line inclusion policies
// ============================================================

const CRUISE_LINE_INCLUSIONS: Record<string, InclusionSet> = {
  // --- MASS MARKET / CONTEMPORARY ---
  'MSC Cruises': {
    included: [
      'Full-board meals (buffet & main restaurant)',
      'Water, tea & coffee at meals',
      'Entertainment & live shows',
      'Pool, gym & sports facilities',
      'Kids club (ages 3-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (bufet și restaurant principal)',
      'Apă, ceai și cafea la mese',
      'Spectacole și divertisment live',
      'Piscină, sală fitness și facilități sportive',
      'Club copii (3-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants',
      'Beverage packages (alcohol & soft drinks)',
      'Shore excursions',
      'Spa & wellness treatments',
      'Wi-Fi packages',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate',
      'Pachete de băuturi (alcoolice și non-alcoolice)',
      'Excursii la țărm',
      'Tratamente spa și wellness',
      'Pachete Wi-Fi',
      'Asigurare de călătorie',
    ],
  },

  'Costa Cruises': {
    included: [
      'Full-board meals (buffet & main restaurant)',
      'Water at meals',
      'Entertainment & live shows',
      'Pool & fitness center',
      'Squok Club (kids ages 3-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (bufet și restaurant principal)',
      'Apă la mese',
      'Spectacole și divertisment live',
      'Piscină și centru fitness',
      'Squok Club (copii 3-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants',
      'Beverage packages',
      'Shore excursions',
      'Spa treatments',
      'Wi-Fi packages',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate',
      'Pachete de băuturi',
      'Excursii la țărm',
      'Tratamente spa',
      'Pachete Wi-Fi',
      'Asigurare de călătorie',
    ],
  },

  'Carnival Cruise Line': {
    included: [
      'Full-board meals (Lido buffet & main dining room)',
      'Room service (basic items)',
      'Entertainment, comedy clubs & live music',
      'Pools, waterslides & SportsSquare',
      'Camp Ocean kids club (ages 2-17)',
      'Port taxes & gratuities (varies)',
    ],
    included_ro: [
      'Pensiune completă (bufet Lido și restaurant principal)',
      'Room service (articole de bază)',
      'Spectacole, cluburi de comedie și muzică live',
      'Piscine, tobogane și SportsSquare',
      'Camp Ocean — club copii (2-17 ani)',
      'Taxe portuare și bacșișuri (variază)',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty dining (e.g. Fahrenheit 555, JiJi Asian Kitchen)',
      'CHEERS! beverage package',
      'Shore excursions',
      'Cloud 9 Spa treatments',
      'Wi-Fi packages',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Fahrenheit 555, JiJi Asian Kitchen)',
      'Pachet băuturi CHEERS!',
      'Excursii la țărm',
      'Tratamente spa Cloud 9',
      'Pachete Wi-Fi',
      'Asigurare de călătorie',
    ],
  },

  'Royal Caribbean Cruise Line': {
    included: [
      'Full-board meals (Windjammer buffet & main dining room)',
      'Room service (basic, 24h)',
      'Entertainment, ice shows & Broadway-style musicals',
      'Pools, FlowRider & rock climbing wall',
      'Adventure Ocean kids club (ages 3-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (bufet Windjammer și restaurant principal)',
      'Room service (de bază, 24h)',
      'Spectacole, show-uri pe gheață și musical-uri Broadway',
      'Piscine, FlowRider și perete de escaladă',
      'Adventure Ocean — club copii (3-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants (e.g. Izumi, Chops Grille)',
      'Beverage packages (Deluxe or Refreshment)',
      'Shore excursions',
      'Vitality Spa treatments',
      'Wi-Fi (Surf & Stream or VOOM)',
      'Gratuities (auto-added to account)',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Izumi, Chops Grille)',
      'Pachete de băuturi (Deluxe sau Refreshment)',
      'Excursii la țărm',
      'Tratamente spa Vitality',
      'Wi-Fi (Surf & Stream sau VOOM)',
      'Bacșișuri (adăugate automat în cont)',
      'Asigurare de călătorie',
    ],
  },

  'Princess Cruises': {
    included: [
      'Full-board meals (World Fresh Marketplace & main dining)',
      'Room service (24h, basic items)',
      'Movies Under the Stars',
      'Entertainment & live shows',
      'Pool, fitness center & jogging track',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (World Fresh Marketplace și restaurant principal)',
      'Room service (24h, articole de bază)',
      'Movies Under the Stars',
      'Spectacole și divertisment live',
      'Piscină, centru fitness și pistă de alergare',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty dining (e.g. Crown Grill, Sabatini\'s)',
      'Princess Plus / Premier beverage packages',
      'Shore excursions',
      'Lotus Spa treatments',
      'MedallionNet Wi-Fi',
      'Gratuities',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Crown Grill, Sabatini\'s)',
      'Pachete băuturi Princess Plus / Premier',
      'Excursii la țărm',
      'Tratamente spa Lotus',
      'Wi-Fi MedallionNet',
      'Bacșișuri',
      'Asigurare de călătorie',
    ],
  },

  'Norwegian Cruise Line': {
    included: [
      'Full-board meals (Garden Café buffet & main dining rooms)',
      'Basic beverages (water, tea, coffee, juice)',
      'Entertainment & Broadway shows',
      'Pool, waterslides & sports complex',
      'Splash Academy kids club (ages 3-12)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (bufet Garden Café și restaurante principale)',
      'Băuturi de bază (apă, ceai, cafea, suc)',
      'Spectacole și show-uri Broadway',
      'Piscină, tobogane și complex sportiv',
      'Splash Academy — club copii (3-12 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants (e.g. Cagney\'s, Le Bistro, Teppanyaki)',
      'Free at Sea beverage package (often included in promos)',
      'Shore excursions',
      'Mandara Spa treatments',
      'Wi-Fi packages',
      'Gratuities (auto-charged daily)',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Cagney\'s, Le Bistro, Teppanyaki)',
      'Pachet băuturi Free at Sea (adesea inclus în promoții)',
      'Excursii la țărm',
      'Tratamente spa Mandara',
      'Pachete Wi-Fi',
      'Bacșișuri (percepute zilnic automat)',
      'Asigurare de călătorie',
    ],
  },

  'Celebrity Cruises': {
    included: [
      'Full-board meals (Oceanview Café & main restaurant)',
      'Basic beverages (water, tea, coffee)',
      'Entertainment & live performances',
      'Pool, solarium & fitness center',
      'Camp at Sea kids program (ages 3-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (Oceanview Café și restaurant principal)',
      'Băuturi de bază (apă, ceai, cafea)',
      'Spectacole și performanțe live',
      'Piscină, solaiu și centru fitness',
      'Camp at Sea — program copii (3-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants (e.g. Le Petit Chef, Fine Cut)',
      'Always Included beverage package (often bundled)',
      'Shore excursions',
      'The Spa treatments',
      'Wi-Fi (Xcelerate or Surf)',
      'Gratuities (often included with Always Included)',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Le Petit Chef, Fine Cut)',
      'Pachet băuturi Always Included (adesea inclus)',
      'Excursii la țărm',
      'Tratamente spa The Spa',
      'Wi-Fi (Xcelerate sau Surf)',
      'Bacșișuri (adesea incluse cu Always Included)',
      'Asigurare de călătorie',
    ],
  },

  'Holland America Line': {
    included: [
      'Full-board meals (Lido Market buffet & main dining room)',
      'Room service (24h)',
      'Live music (Lincoln Center Stage, B.B. King\'s)',
      'Pool, fitness center & sports courts',
      'Club HAL kids program (ages 3-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (bufet Lido Market și restaurant principal)',
      'Room service (24h)',
      'Muzică live (Lincoln Center Stage, B.B. King\'s)',
      'Piscină, centru fitness și terenuri de sport',
      'Club HAL — program copii (3-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants (e.g. Pinnacle Grill, Tamarind)',
      'Have It All beverage package',
      'Shore excursions',
      'Greenhouse Spa treatments',
      'Wi-Fi packages',
      'Gratuities',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Pinnacle Grill, Tamarind)',
      'Pachet băuturi Have It All',
      'Excursii la țărm',
      'Tratamente spa Greenhouse',
      'Pachete Wi-Fi',
      'Bacșișuri',
      'Asigurare de călătorie',
    ],
  },

  'Disney Cruise Line': {
    included: [
      'Full-board meals (rotational dining & buffet)',
      'Room service (24h)',
      'Character meet & greets',
      'Broadway-style shows & fireworks at sea',
      'Oceaneer Club & Lab (kids ages 3-12)',
      'Pools, AquaDuck waterslide & Castaway Cay activities',
      'Port taxes & gratuities',
    ],
    included_ro: [
      'Pensiune completă (rotational dining și bufet)',
      'Room service (24h)',
      'Întâlniri cu personajele Disney',
      'Spectacole Broadway și artificii pe mare',
      'Oceaneer Club & Lab (copii 3-12 ani)',
      'Piscine, tobogan AquaDuck și activități Castaway Cay',
      'Taxe portuare și bacșișuri',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty dining (e.g. Palo, Remy, Enchanté)',
      'Alcoholic beverages',
      'Shore excursions (except Castaway Cay)',
      'Senses Spa treatments',
      'Wi-Fi packages',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. Palo, Remy, Enchanté)',
      'Băuturi alcoolice',
      'Excursii la țărm (exceptând Castaway Cay)',
      'Tratamente spa Senses',
      'Pachete Wi-Fi',
      'Asigurare de călătorie',
    ],
  },

  'Cunard Line': {
    included: [
      'Full-board dining (Britannia Restaurant & King\'s Court)',
      'Room service (24h)',
      'Afternoon tea service',
      'Royal Court Theatre shows',
      'Pool, gym & sports deck',
      'The Zone kids club (ages 2-17)',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Pensiune completă (Restaurantul Britannia și King\'s Court)',
      'Room service (24h)',
      'Ceai de după-amiază',
      'Spectacole Royal Court Theatre',
      'Piscină, sală fitness și punte de sport',
      'The Zone — club copii (2-17 ani)',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Specialty restaurants (e.g. The Verandah, Steakhouse at The Rudder)',
      'Beverage packages',
      'Shore excursions',
      'Mareel Spa treatments',
      'Wi-Fi packages',
      'Gratuities',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Restaurante de specialitate (ex. The Verandah, Steakhouse at The Rudder)',
      'Pachete de băuturi',
      'Excursii la țărm',
      'Tratamente spa Mareel',
      'Pachete Wi-Fi',
      'Bacșișuri',
      'Asigurare de călătorie',
    ],
  },

  // --- PREMIUM / UPPER PREMIUM ---

  'Oceania Cruises': {
    included: [
      'Gourmet dining in all restaurants (no extra charge)',
      'Specialty coffees, soft drinks, water & juices',
      'Room service (24h, full menu)',
      'Entertainment & enrichment lectures',
      'Pool, fitness center & sports deck',
      'Shuttle buses in select ports',
      'Port taxes & service charges',
    ],
    included_ro: [
      'Dining gourmet în toate restaurantele (fără cost suplimentar)',
      'Cafea de specialitate, sucuri, apă și băuturi non-alcoolice',
      'Room service (24h, meniu complet)',
      'Spectacole și prelegeri',
      'Piscină, centru fitness și punte de sport',
      'Autobuze navete în porturi selectate',
      'Taxe portuare și taxe de serviciu',
    ],
    excluded: [
      'Flights to/from port',
      'Alcoholic beverages (wine & spirits)',
      'Shore excursions',
      'Canyon Ranch Spa treatments',
      'Wi-Fi (often included in promos)',
      'Gratuities (often included in promos)',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Băuturi alcoolice (vin și spirtoase)',
      'Excursii la țărm',
      'Tratamente spa Canyon Ranch',
      'Wi-Fi (adesea inclus în promoții)',
      'Bacșișuri (adesea incluse în promoții)',
      'Asigurare de călătorie',
    ],
  },

  'Azamara Club Cruises': {
    included: [
      'Gourmet dining in all restaurants',
      'Select beverages (wine, beer, spirits)',
      'Specialty coffees & bottled water',
      'AzAmazing Evenings destination events',
      'Self-service laundry',
      'Shuttle buses in select ports',
      'Gratuities',
      'Port taxes',
    ],
    included_ro: [
      'Dining gourmet în toate restaurantele',
      'Băuturi selectate (vin, bere, spirtoase)',
      'Cafea de specialitate și apă îmbuteliată',
      'Evenimente AzAmazing la destinație',
      'Spălătorie self-service',
      'Autobuze navete în porturi selectate',
      'Bacșișuri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights to/from port',
      'Premium beverages & champagne',
      'Shore excursions (beyond AzAmazing)',
      'Sanctum Spa treatments',
      'Wi-Fi (included in some fares)',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Băuturi premium și șampanie',
      'Excursii la țărm (în afara AzAmazing)',
      'Tratamente spa Sanctum',
      'Wi-Fi (inclus în anumite tarife)',
      'Asigurare de călătorie',
    ],
  },

  'Virgin Voyages': {
    included: [
      'All dining (20+ restaurants, no main dining room)',
      'Basic beverages (water, soda, coffee, tea, juice)',
      'Group fitness classes & gym',
      'Entertainment & festivals at sea',
      'Wi-Fi (basic)',
      'Gratuities',
      'Port taxes',
    ],
    included_ro: [
      'Toate restaurantele (20+ opțiuni, fără restaurant principal)',
      'Băuturi de bază (apă, suc, cafea, ceai)',
      'Cursuri de fitness și sală',
      'Spectacole și festivaluri pe mare',
      'Wi-Fi (de bază)',
      'Bacșișuri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights to/from port',
      'Alcoholic beverages',
      'Shore excursions (Shore Things)',
      'Redemption Spa treatments',
      'Premium Wi-Fi',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri către/de la port',
      'Băuturi alcoolice',
      'Excursii la țărm (Shore Things)',
      'Tratamente spa Redemption',
      'Wi-Fi premium',
      'Asigurare de călătorie',
    ],
  },

  // --- LUXURY ---

  'Regent Seven Seas Cruises': {
    included: [
      'All-inclusive beverages (premium wines, spirits, champagne)',
      'All specialty restaurants at no extra charge',
      'Unlimited shore excursions in every port',
      'Pre-cruise hotel night (Concierge+ suites)',
      'Wi-Fi throughout the ship',
      'Gratuities',
      'Laundry & pressing service (suite-dependent)',
      'Business class air (Concierge+ suites)',
      'Port taxes',
    ],
    included_ro: [
      'Băuturi all-inclusive (vinuri premium, spirtoase, șampanie)',
      'Toate restaurantele de specialitate fără cost suplimentar',
      'Excursii nelimitate în fiecare port',
      'Noapte hotel pre-croazieră (suite Concierge+)',
      'Wi-Fi pe tot vasul',
      'Bacșișuri',
      'Spălătorie și călcat (în funcție de suită)',
      'Zbor business class (suite Concierge+)',
      'Taxe portuare',
    ],
    excluded: [
      'Flights (included only for Concierge+ suites)',
      'Premium spa treatments (Canyon Ranch)',
      'Personal shopping',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri (incluse doar pentru suite Concierge+)',
      'Tratamente spa premium (Canyon Ranch)',
      'Cumpărături personale',
      'Asigurare de călătorie',
    ],
  },

  'Silversea Cruises': {
    included: [
      'All-inclusive beverages (premium wines & spirits)',
      'All restaurants (including S.A.L.T. & La Dame)',
      'Butler service (all suites)',
      'Shore excursions (1 per port, Silversea Experiences)',
      'Wi-Fi throughout the ship',
      'Gratuities',
      'Port taxes',
    ],
    included_ro: [
      'Băuturi all-inclusive (vinuri și spirtoase premium)',
      'Toate restaurantele (inclusiv S.A.L.T. și La Dame)',
      'Serviciu de butler (toate suitele)',
      'Excursii la țărm (1 pe port, Silversea Experiences)',
      'Wi-Fi pe tot vasul',
      'Bacșișuri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Additional shore excursions',
      'Premium spa treatments',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Excursii suplimentare la țărm',
      'Tratamente spa premium',
      'Asigurare de călătorie',
    ],
  },

  'Seabourn': {
    included: [
      'All-inclusive beverages (premium wines, spirits & champagne)',
      'All dining venues at no extra charge',
      'Spa & wellness (hydro-pool, sauna, steam)',
      'Marina water sports (kayaks, pedal boards, banana boats)',
      'Shore excursions (Seabourn Conversations, varies)',
      'Wi-Fi',
      'Gratuities',
      'Port taxes',
    ],
    included_ro: [
      'Băuturi all-inclusive (vinuri premium, spirtoase, șampanie)',
      'Toate restaurantele fără cost suplimentar',
      'Spa & wellness (piscină hidro, saună, hammam)',
      'Sporturi nautice Marina (caiac, paddleboard, barcă banana)',
      'Excursii la țărm (Seabourn Conversations, variază)',
      'Wi-Fi',
      'Bacșișuri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Premium spa treatments',
      'Additional shore excursions',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Tratamente spa premium',
      'Excursii suplimentare la țărm',
      'Asigurare de călătorie',
    ],
  },

  'Windstar Cruises': {
    included: [
      'All meals in all restaurants',
      'Non-alcoholic beverages',
      'Water sports platform (kayaks, paddleboards, snorkeling)',
      'Entertainment & enrichment',
      'Wi-Fi',
      'Port taxes',
    ],
    included_ro: [
      'Toate mesele în toate restaurantele',
      'Băuturi non-alcoolice',
      'Platformă sporturi nautice (caiac, paddleboard, snorkeling)',
      'Spectacole și îmbogățire culturală',
      'Wi-Fi',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Alcoholic beverages',
      'Shore excursions',
      'WindSpa treatments',
      'Gratuities',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Băuturi alcoolice',
      'Excursii la țărm',
      'Tratamente WindSpa',
      'Bacșișuri',
      'Asigurare de călătorie',
    ],
  },

  'SeaDream Yacht Club': {
    included: [
      'All-inclusive open bar (premium drinks)',
      'Gourmet dining with no extra charge',
      'Water sports marina (jet skis, kayaks, snorkeling)',
      'Mountain bikes for shore exploration',
      'Wi-Fi',
      'Gratuities',
      'Port taxes',
    ],
    included_ro: [
      'Open bar all-inclusive (băuturi premium)',
      'Dining gourmet fără cost suplimentar',
      'Marina sporturi nautice (jet ski, caiac, snorkeling)',
      'Biciclete de munte pentru explorare',
      'Wi-Fi',
      'Bacșișuri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Spa treatments',
      'Shore excursions',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Tratamente spa',
      'Excursii la țărm',
      'Asigurare de călătorie',
    ],
  },

  'Explora Journeys': {
    included: [
      'All dining (6 restaurants, no extra charge)',
      'Premium beverages (wines, spirits, cocktails)',
      'Shore excursions (curated selection)',
      'Wi-Fi throughout the ship',
      'Gratuities',
      'Fitness, pools & hot tubs',
      'Port taxes',
    ],
    included_ro: [
      'Toate restaurantele (6, fără cost suplimentar)',
      'Băuturi premium (vinuri, spirtoase, cocktailuri)',
      'Excursii la țărm (selecție curatoriată)',
      'Wi-Fi pe tot vasul',
      'Bacșișuri',
      'Fitness, piscine și jacuzzi',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Premium spa treatments',
      'Additional shore excursions',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Tratamente spa premium',
      'Excursii suplimentare la țărm',
      'Asigurare de călătorie',
    ],
  },

  // --- RIVER CRUISES ---

  'Uniworld River Cruises': {
    included: [
      'All meals on board (gourmet cuisine)',
      'Unlimited beverages (premium wines, spirits, beer)',
      'Daily guided shore excursions',
      'Onboard entertainment & lectures',
      'Wi-Fi',
      'Gratuities for crew & excursion guides',
      'Airport transfers (on cruise dates)',
      'Port taxes',
    ],
    included_ro: [
      'Toate mesele la bord (bucătărie gourmet)',
      'Băuturi nelimitate (vinuri premium, spirtoase, bere)',
      'Excursii ghidate zilnice la țărm',
      'Divertisment și prelegeri la bord',
      'Wi-Fi',
      'Bacșișuri pentru echipaj și ghizi',
      'Transferuri aeroport (în datele croazierei)',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Premium spa treatments',
      'Private excursions',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Tratamente spa premium',
      'Excursii private',
      'Asigurare de călătorie',
    ],
  },

  'AmaWaterways': {
    included: [
      'All meals on board with regional cuisine',
      'Wine, beer & soft drinks with lunch and dinner',
      'Daily guided shore excursions (multiple options)',
      'Bicycles for independent exploration',
      'Wi-Fi',
      'Entertainment & lectures',
      'Port taxes',
    ],
    included_ro: [
      'Toate mesele la bord cu bucătărie regională',
      'Vin, bere și băuturi non-alcoolice la prânz și cină',
      'Excursii ghidate zilnice (opțiuni multiple)',
      'Biciclete pentru explorare independentă',
      'Wi-Fi',
      'Divertisment și prelegeri',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Premium beverages (spirits & cocktails)',
      'Gratuities',
      'Spa treatments',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Băuturi premium (spirtoase și cocktailuri)',
      'Bacșișuri',
      'Tratamente spa',
      'Asigurare de călătorie',
    ],
  },

  'Celestyal Cruises': {
    included: [
      'Full-board meals (buffet & main restaurant)',
      'Non-alcoholic beverages with meals',
      'Entertainment & live shows',
      'Pool & fitness facilities',
      'Port taxes',
    ],
    included_ro: [
      'Pensiune completă (bufet și restaurant principal)',
      'Băuturi non-alcoolice la mese',
      'Spectacole și divertisment live',
      'Piscină și facilități fitness',
      'Taxe portuare',
    ],
    excluded: [
      'Flights',
      'Alcoholic beverages',
      'Shore excursions',
      'Spa treatments',
      'Wi-Fi',
      'Gratuities',
      'Travel insurance',
    ],
    excluded_ro: [
      'Zboruri',
      'Băuturi alcoolice',
      'Excursii la țărm',
      'Tratamente spa',
      'Wi-Fi',
      'Bacșișuri',
      'Asigurare de călătorie',
    ],
  },
}

// ============================================================
// Generic fallbacks based on cruise type
// ============================================================

const GENERIC_OCEAN: InclusionSet = {
  included: [
    'Full-board meals (buffet & main restaurant)',
    'Entertainment & live shows',
    'Pool & fitness center access',
    'Kids club (where available)',
    'Port taxes & fees',
  ],
  included_ro: [
    'Pensiune completă (bufet și restaurant principal)',
    'Spectacole și divertisment la bord',
    'Acces piscină și centru fitness',
    'Club copii (unde este disponibil)',
    'Taxe portuare incluse',
  ],
  excluded: [
    'Flights to/from embarkation port',
    'Shore excursions',
    'Specialty dining',
    'Beverage packages',
    'Spa treatments',
    'Travel insurance',
  ],
  excluded_ro: [
    'Zbor către/de la portul de îmbarcare',
    'Excursii la țărm',
    'Restaurante de specialitate',
    'Pachete de băuturi',
    'Tratamente spa',
    'Asigurare de călătorie',
  ],
}

const GENERIC_RIVER: InclusionSet = {
  included: [
    'All meals on board',
    'Wine & beer with lunch and dinner',
    'Guided shore excursions',
    'Wi-Fi on board',
    'Port charges',
  ],
  included_ro: [
    'Toate mesele la bord',
    'Vin și bere la prânz și cină',
    'Excursii ghidate la țărm',
    'Wi-Fi la bord',
    'Taxe portuare',
  ],
  excluded: [
    'Flights',
    'Premium beverages',
    'Gratuities',
    'Travel insurance',
  ],
  excluded_ro: [
    'Zboruri',
    'Băuturi premium',
    'Bacșișuri',
    'Asigurare de călătorie',
  ],
}

const GENERIC_LUXURY: InclusionSet = {
  included: [
    'All-inclusive beverages',
    'Specialty dining at no extra charge',
    'Shore excursions in every port',
    'Wi-Fi & gratuities included',
    'Butler service (suite guests)',
  ],
  included_ro: [
    'Băuturi all-inclusive',
    'Restaurante de specialitate fără cost suplimentar',
    'Excursii în fiecare port',
    'Wi-Fi și bacșișuri incluse',
    'Serviciu de butler (suite)',
  ],
  excluded: [
    'Flights',
    'Premium spa treatments',
    'Travel insurance',
  ],
  excluded_ro: [
    'Zboruri',
    'Tratamente spa premium',
    'Asigurare de călătorie',
  ],
}

// ============================================================
// Lookup function
// ============================================================

/** Luxury cruise lines where most items are included */
const LUXURY_LINES = new Set([
  'Regent Seven Seas Cruises',
  'Silversea Cruises',
  'Seabourn',
  'SeaDream Yacht Club',
  'Explora Journeys',
  'Crystal Cruises',
  'Four Seasons Yachts',
])

/** River cruise lines */
const RIVER_LINES = new Set([
  'Uniworld River Cruises',
  'AmaWaterways',
  'A-Rosa Cruises',
  'Viva Cruises',
  'Nicko Cruises',
])

/**
 * Get included/excluded items for a cruise.
 * Priority: cruise-line-specific > cruise-type generic
 */
export function getCruiseInclusions(
  cruiseLine: string,
  cruiseType: string,
): InclusionSet {
  // 1. Try cruise-line-specific
  const lineData = CRUISE_LINE_INCLUSIONS[cruiseLine]
  if (lineData) return lineData

  // 2. Fall back to cruise type or known line type
  if (cruiseType === 'river' || RIVER_LINES.has(cruiseLine)) return GENERIC_RIVER
  if (cruiseType === 'luxury' || LUXURY_LINES.has(cruiseLine)) return GENERIC_LUXURY

  // 3. Default: ocean
  return GENERIC_OCEAN
}
