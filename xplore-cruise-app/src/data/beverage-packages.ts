// ============================================================
// Beverage Package Data — per Cruise Line
// Source: Official cruise line websites (2025-2026 pricing)
// ============================================================

export interface BeveragePackage {
  name: string
  name_ro: string
  price_per_day: string // Range string like "42-51" or fixed "89"
  currency: 'EUR' | 'USD'
  includes: string[]
  includes_ro: string[]
  gratuity?: string // e.g. "+18% gratuity"
  note?: string
  note_ro?: string
}

export interface CruiseLineBeverageInfo {
  cruise_line: string
  all_inclusive: boolean // true if drinks are included in fare
  all_inclusive_note?: string
  all_inclusive_note_ro?: string
  packages: BeveragePackage[]
}

export const BEVERAGE_PACKAGES: Record<string, CruiseLineBeverageInfo> = {
  'MSC Cruises': {
    cruise_line: 'MSC Cruises',
    all_inclusive: false,
    packages: [
      {
        name: 'Easy Package',
        name_ro: 'Pachet Easy',
        price_per_day: '42-51',
        currency: 'EUR',
        includes: [
          'Unlimited drinks by the glass (beer, wine, cocktails, spirits)',
          'Soft drinks, water, juices',
          'Hot beverages (coffee, tea, hot chocolate)',
        ],
        includes_ro: [
          'Bauturi nelimitate la pahar (bere, vin, cocktailuri, spirtoase)',
          'Bauturi racoritoare, apa, sucuri',
          'Bauturi calde (cafea, ceai, ciocolata calda)',
        ],
        note: 'Drinks up to 8 EUR value per glass',
        note_ro: 'Bauturi pana la 8 EUR valoare per pahar',
      },
      {
        name: 'Premium Extra Package',
        name_ro: 'Pachet Premium Extra',
        price_per_day: '74-83',
        currency: 'EUR',
        includes: [
          'All Easy Package inclusions',
          'Premium spirits and cocktails',
          'Premium wines by the glass',
          'Specialty coffees',
          'Minibar refill (water + soft drinks)',
        ],
        includes_ro: [
          'Toate incluziunile pachetului Easy',
          'Spirtoase si cocktailuri premium',
          'Vinuri premium la pahar',
          'Cafele de specialitate',
          'Reumplere minibar (apa + racoritoare)',
        ],
        note: 'Drinks up to 15 EUR value per glass',
        note_ro: 'Bauturi pana la 15 EUR valoare per pahar',
      },
    ],
  },

  'Costa Cruises': {
    cruise_line: 'Costa Cruises',
    all_inclusive: false,
    packages: [
      {
        name: 'My Drinks',
        name_ro: 'My Drinks',
        price_per_day: '32-35',
        currency: 'EUR',
        includes: [
          'Soft drinks, water, juices',
          'Draft beer',
          'House wine by the glass',
          'Coffee, tea, hot chocolate',
        ],
        includes_ro: [
          'Bauturi racoritoare, apa, sucuri',
          'Bere la draft',
          'Vin de casa la pahar',
          'Cafea, ceai, ciocolata calda',
        ],
      },
      {
        name: 'My Drinks Plus',
        name_ro: 'My Drinks Plus',
        price_per_day: '40-48',
        currency: 'EUR',
        includes: [
          'All My Drinks inclusions',
          'Cocktails and spirits',
          'Selected wines by the glass',
          'Premium coffees',
        ],
        includes_ro: [
          'Toate incluziunile My Drinks',
          'Cocktailuri si spirtoase',
          'Vinuri selectate la pahar',
          'Cafele premium',
        ],
      },
    ],
  },

  'Royal Caribbean': {
    cruise_line: 'Royal Caribbean',
    all_inclusive: false,
    packages: [
      {
        name: 'Refreshment Package',
        name_ro: 'Pachet Racoritoare',
        price_per_day: '29-38',
        currency: 'USD',
        includes: [
          'Coca-Cola fountain beverages',
          'Bottled still and sparkling water',
          'Premium coffees and teas',
          'Fresh-squeezed juices',
        ],
        includes_ro: [
          'Bauturi Coca-Cola la dozator',
          'Apa plata si minerala la sticla',
          'Cafele si ceaiuri premium',
          'Sucuri proaspat stoarse',
        ],
        gratuity: '+18% gratuity',
      },
      {
        name: 'Deluxe Beverage Package',
        name_ro: 'Pachet Bauturi Deluxe',
        price_per_day: '56-120',
        currency: 'USD',
        includes: [
          'Unlimited cocktails, spirits, beer, wine',
          'Premium and top-shelf liquors',
          'Specialty coffees',
          'Bottled water',
          'Fresh-squeezed juices',
          'Non-alcoholic cocktails',
        ],
        includes_ro: [
          'Cocktailuri, spirtoase, bere, vin nelimitate',
          'Bauturi premium si top-shelf',
          'Cafele de specialitate',
          'Apa la sticla',
          'Sucuri proaspat stoarse',
          'Cocktailuri non-alcoolice',
        ],
        gratuity: '+18% gratuity',
        note: 'Covers drinks up to $14 value. Price varies by ship and itinerary.',
        note_ro: 'Acopera bauturi pana la $14 valoare. Pretul variaza in functie de nava si itinerariu.',
      },
    ],
  },

  'Norwegian Cruise Line': {
    cruise_line: 'Norwegian Cruise Line',
    all_inclusive: false,
    packages: [
      {
        name: 'Unlimited Open Bar',
        name_ro: 'Bar Deschis Nelimitat',
        price_per_day: '89-109',
        currency: 'USD',
        includes: [
          'Unlimited cocktails, spirits, beer, wine by the glass',
          'Bottled and draft beer',
          'Premium spirits and cocktails',
          'Wines by the glass',
          'Soft drinks, juices, water',
        ],
        includes_ro: [
          'Cocktailuri, spirtoase, bere, vin la pahar nelimitate',
          'Bere la sticla si la draft',
          'Spirtoase si cocktailuri premium',
          'Vinuri la pahar',
          'Bauturi racoritoare, sucuri, apa',
        ],
        gratuity: '+20% gratuity',
        note: 'Covers drinks up to $15 value. Often included in Free at Sea promotions.',
        note_ro: 'Acopera bauturi pana la $15 valoare. Adesea inclus in promotiile Free at Sea.',
      },
    ],
  },

  'Celebrity Cruises': {
    cruise_line: 'Celebrity Cruises',
    all_inclusive: false,
    packages: [
      {
        name: 'Classic Beverage Package',
        name_ro: 'Pachet Bauturi Classic',
        price_per_day: '89',
        currency: 'USD',
        includes: [
          'Beer, cocktails, spirits, wine by the glass',
          'Specialty coffees and teas',
          'Bottled water',
          'Fresh juices',
        ],
        includes_ro: [
          'Bere, cocktailuri, spirtoase, vin la pahar',
          'Cafele si ceaiuri de specialitate',
          'Apa la sticla',
          'Sucuri proaspete',
        ],
        gratuity: '+20% gratuity',
        note: 'Covers drinks up to $10 value',
        note_ro: 'Acopera bauturi pana la $10 valoare',
      },
      {
        name: 'Premium Beverage Package',
        name_ro: 'Pachet Bauturi Premium',
        price_per_day: '105-110',
        currency: 'USD',
        includes: [
          'All Classic Package inclusions',
          'Premium and top-shelf spirits',
          'Premium wines by the glass',
          'Frozen cocktails',
          'Premium coffees',
        ],
        includes_ro: [
          'Toate incluziunile pachetului Classic',
          'Spirtoase premium si top-shelf',
          'Vinuri premium la pahar',
          'Cocktailuri frozen',
          'Cafele premium',
        ],
        gratuity: '+20% gratuity',
        note: 'Covers drinks up to $17 value',
        note_ro: 'Acopera bauturi pana la $17 valoare',
      },
    ],
  },

  'Viking River Cruises': {
    cruise_line: 'Viking River Cruises',
    all_inclusive: true,
    all_inclusive_note: 'Complimentary wine, beer, and soft drinks during lunch and dinner. Self-serve coffee and tea stations available 24/7.',
    all_inclusive_note_ro: 'Vin, bere si bauturi racoritoare gratuite la pranz si cina. Statii self-service de cafea si ceai disponibile 24/7.',
    packages: [
      {
        name: 'Silver Spirits Beverage Package',
        name_ro: 'Pachet Silver Spirits',
        price_per_day: '19.99',
        currency: 'USD',
        includes: [
          'Unlimited premium spirits and cocktails',
          'Premium wines',
          'Premium beers',
          'Available throughout the day',
        ],
        includes_ro: [
          'Spirtoase si cocktailuri premium nelimitate',
          'Vinuri premium',
          'Beri premium',
          'Disponibil pe parcursul zilei',
        ],
        note: 'Optional upgrade beyond included complimentary drinks',
        note_ro: 'Upgrade optional peste bauturile gratuite incluse',
      },
    ],
  },

  'Silversea': {
    cruise_line: 'Silversea',
    all_inclusive: true,
    all_inclusive_note: 'All beverages are included in the cruise fare: premium wines, champagne, spirits, cocktails, specialty coffees, soft drinks, juices, and water. In-suite minibar stocked daily.',
    all_inclusive_note_ro: 'Toate bauturile sunt incluse in tariful croazierei: vinuri premium, sampanie, spirtoase, cocktailuri, cafele de specialitate, bauturi racoritoare, sucuri si apa. Minibar in suite reaprovizionat zilnic.',
    packages: [],
  },

  'Regent Seven Seas': {
    cruise_line: 'Regent Seven Seas',
    all_inclusive: true,
    all_inclusive_note: 'All beverages included: premium wines, spirits, cocktails, and specialty coffees throughout the ship. In-suite minibar replenished daily.',
    all_inclusive_note_ro: 'Toate bauturile incluse: vinuri premium, spirtoase, cocktailuri si cafele de specialitate pe toata nava. Minibar in suite reaprovizionat zilnic.',
    packages: [],
  },

  'Cunard': {
    cruise_line: 'Cunard',
    all_inclusive: false,
    packages: [
      {
        name: 'Classic Drinks Package',
        name_ro: 'Pachet Bauturi Classic',
        price_per_day: '52-62',
        currency: 'USD',
        includes: [
          'Beer, wine by the glass, house spirits',
          'Cocktails and mixed drinks',
          'Soft drinks and juices',
          'Specialty coffees',
        ],
        includes_ro: [
          'Bere, vin la pahar, spirtoase de casa',
          'Cocktailuri si bauturi mixte',
          'Bauturi racoritoare si sucuri',
          'Cafele de specialitate',
        ],
      },
    ],
  },

  'Holland America Line': {
    cruise_line: 'Holland America Line',
    all_inclusive: false,
    packages: [
      {
        name: 'Signature Beverage Package',
        name_ro: 'Pachet Bauturi Signature',
        price_per_day: '59-79',
        currency: 'USD',
        includes: [
          'Cocktails, spirits, beer, wines by the glass',
          'Specialty coffees and teas',
          'Bottled water',
          'Fresh-squeezed juices',
        ],
        includes_ro: [
          'Cocktailuri, spirtoase, bere, vinuri la pahar',
          'Cafele si ceaiuri de specialitate',
          'Apa la sticla',
          'Sucuri proaspat stoarse',
        ],
        gratuity: '+15% gratuity',
      },
      {
        name: 'Elite Beverage Package',
        name_ro: 'Pachet Bauturi Elite',
        price_per_day: '69-89',
        currency: 'USD',
        includes: [
          'All Signature Package inclusions',
          'Premium spirits and top-shelf cocktails',
          'Premium wines by the bottle at dinner',
          'Smoothies',
        ],
        includes_ro: [
          'Toate incluziunile pachetului Signature',
          'Spirtoase premium si cocktailuri top-shelf',
          'Vinuri premium la sticla la cina',
          'Smoothie-uri',
        ],
        gratuity: '+15% gratuity',
      },
    ],
  },

  'Princess Cruises': {
    cruise_line: 'Princess Cruises',
    all_inclusive: false,
    packages: [
      {
        name: 'Plus Beverage Package',
        name_ro: 'Pachet Bauturi Plus',
        price_per_day: '60-75',
        currency: 'USD',
        includes: [
          'Cocktails, spirits, beer, wines by the glass',
          'Specialty coffees',
          'Bottled water',
          'Fresh juices',
        ],
        includes_ro: [
          'Cocktailuri, spirtoase, bere, vinuri la pahar',
          'Cafele de specialitate',
          'Apa la sticla',
          'Sucuri proaspete',
        ],
        gratuity: '+18% gratuity',
        note: 'Covers drinks up to $15 value. Often included in Princess Plus fare.',
        note_ro: 'Acopera bauturi pana la $15 valoare. Adesea inclus in tariful Princess Plus.',
      },
      {
        name: 'Premier Beverage Package',
        name_ro: 'Pachet Bauturi Premier',
        price_per_day: '75-85',
        currency: 'USD',
        includes: [
          'All Plus Package inclusions',
          'Premium and ultra-premium spirits',
          'Premium wines',
          'No per-drink price limit',
        ],
        includes_ro: [
          'Toate incluziunile pachetului Plus',
          'Spirtoase premium si ultra-premium',
          'Vinuri premium',
          'Fara limita de pret per bautura',
        ],
        gratuity: '+18% gratuity',
      },
    ],
  },

  'Carnival Cruise Line': {
    cruise_line: 'Carnival Cruise Line',
    all_inclusive: false,
    packages: [
      {
        name: 'CHEERS! Beverage Package',
        name_ro: 'Pachet Bauturi CHEERS!',
        price_per_day: '59-89',
        currency: 'USD',
        includes: [
          'Unlimited cocktails, beer, spirits, wines by the glass',
          'Specialty coffees and teas',
          'Bottled water, juices, sodas',
          'Up to 15 alcoholic drinks per day',
        ],
        includes_ro: [
          'Cocktailuri, bere, spirtoase, vinuri la pahar nelimitate',
          'Cafele si ceaiuri de specialitate',
          'Apa la sticla, sucuri, bauturi carbogazoase',
          'Pana la 15 bauturi alcoolice pe zi',
        ],
        gratuity: '+18% gratuity',
        note: 'Covers drinks up to $20 value. Price varies by itinerary.',
        note_ro: 'Acopera bauturi pana la $20 valoare. Pretul variaza in functie de itinerariu.',
      },
    ],
  },
}
