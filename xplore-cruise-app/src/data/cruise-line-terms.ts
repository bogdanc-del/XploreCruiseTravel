// ============================================================
// Cruise Line Terms & Conditions
// Cancellation policies + general terms per cruise line
// Source: croaziere.net + official cruise line websites
// ============================================================

export interface CancellationTier {
  period_en: string
  period_ro: string
  penalty: string
  penalty_en?: string
  penalty_ro?: string
}

export interface CruiseLineTerms {
  cruise_line: string
  cancellation: {
    tiers: CancellationTier[]
    notes_en?: string
    notes_ro?: string
  }
  general_terms: {
    title_en: string
    title_ro: string
    content_en: string
    content_ro: string
  }[]
}

export const CRUISE_LINE_TERMS: Record<string, CruiseLineTerms> = {
  'MSC Cruises': {
    cruise_line: 'MSC Cruises',
    cancellation: {
      tiers: [
        { period_en: 'More than 60 days before', period_ro: 'Mai mult de 60 zile inainte', penalty: '50 EUR/pers.' },
        { period_en: '59 - 30 days before', period_ro: '59 - 30 zile inainte', penalty: '25%' },
        { period_en: '29 - 22 days before', period_ro: '29 - 22 zile inainte', penalty: '40%' },
        { period_en: '21 - 15 days before', period_ro: '21 - 15 zile inainte', penalty: '60%' },
        { period_en: '14 - 6 days before', period_ro: '14 - 6 zile inainte', penalty: '80%' },
        { period_en: 'Under 6 days / no-show', period_ro: 'Sub 6 zile / neprezentare', penalty: '100%' },
      ],
      notes_en: 'For cruises of 15+ nights the periods start earlier (90 days). Name changes: 50 EUR/person.',
      notes_ro: 'Pentru croazierele de 15+ nopti perioadele incep mai devreme (90 zile). Schimbari de nume: 50 EUR/persoana.',
    },
    general_terms: [
      {
        title_en: 'Deposit',
        title_ro: 'Avans',
        content_en: 'A deposit of 150-300 EUR per person is required at booking. Full payment is due 60 days before departure.',
        content_ro: 'Un avans de 150-300 EUR per persoana este necesar la rezervare. Plata integrala este scadenta cu 60 de zile inainte de plecare.',
      },
      {
        title_en: 'Children Policy',
        title_ro: 'Politica pentru Copii',
        content_en: 'Children under 2 travel free (taxes apply). Children 2-11 pay reduced rates when sharing a cabin with 2 adults.',
        content_ro: 'Copiii sub 2 ani calatoresc gratuit (se aplica taxe). Copiii 2-11 ani platesc tarife reduse cand impart cabina cu 2 adulti.',
      },
      {
        title_en: 'Travel Documents',
        title_ro: 'Documente de Calatorie',
        content_en: 'A valid passport is required for all passengers. Some itineraries may require visas. Check specific requirements for your nationality.',
        content_ro: 'Un pasaport valid este necesar pentru toti pasagerii. Unele itinerarii pot necesita vize. Verificati cerintele specifice pentru nationalitatea dumneavoastra.',
      },
    ],
  },

  'Costa Cruises': {
    cruise_line: 'Costa Cruises',
    cancellation: {
      tiers: [
        { period_en: 'More than 60 days before', period_ro: 'Mai mult de 60 zile inainte', penalty: '100 EUR/pers.' },
        { period_en: '59 - 30 days before', period_ro: '59 - 30 zile inainte', penalty: '20%' },
        { period_en: '29 - 15 days before', period_ro: '29 - 15 zile inainte', penalty: '50%' },
        { period_en: '14 - 8 days before', period_ro: '14 - 8 zile inainte', penalty: '75%' },
        { period_en: '7 - 0 days / no-show', period_ro: '7 - 0 zile / neprezentare', penalty: '100%' },
      ],
      notes_en: 'Long-duration & World cruises have stricter policies (penalties start from 90 days). Last Minute offers: 100% penalty.',
      notes_ro: 'Croazierele lungi si In Jurul Lumii au politici mai stricte (penalitati de la 90 zile). Oferte Last Minute: penalitate 100%.',
    },
    general_terms: [
      {
        title_en: 'Deposit',
        title_ro: 'Avans',
        content_en: 'A deposit per person is required at booking. Final payment is due 45-60 days before departure depending on itinerary length.',
        content_ro: 'Un avans per persoana este necesar la rezervare. Plata finala este scadenta cu 45-60 de zile inainte de plecare in functie de durata itinerariului.',
      },
      {
        title_en: 'Children Policy',
        title_ro: 'Politica pentru Copii',
        content_en: 'Children under 18 pay reduced rates when sharing cabin with 2 adults. Infants under 6 months are not accepted on board.',
        content_ro: 'Copiii sub 18 ani platesc tarife reduse cand impart cabina cu 2 adulti. Sugarii sub 6 luni nu sunt acceptati la bord.',
      },
    ],
  },

  'Norwegian Cruise Line': {
    cruise_line: 'Norwegian Cruise Line',
    cancellation: {
      tiers: [
        { period_en: '29+ days before', period_ro: '29+ zile inainte', penalty: '20%' },
        { period_en: '28 - 15 days before', period_ro: '28 - 15 zile inainte', penalty: '50%' },
        { period_en: '14 - 8 days before', period_ro: '14 - 8 zile inainte', penalty: '75%' },
        { period_en: '7 - 0 days / no-show', period_ro: '7 - 0 zile / neprezentare', penalty: '95%' },
      ],
    },
    general_terms: [
      {
        title_en: 'Free at Sea Promotions',
        title_ro: 'Promotii Free at Sea',
        content_en: 'NCL frequently offers Free at Sea packages including free beverage package, specialty dining, shore excursions credits, and WiFi. Check current promotions.',
        content_ro: 'NCL ofera frecvent pachete Free at Sea care includ pachet bauturi gratuit, dining de specialitate, credite excursii si WiFi. Verificati promotiile curente.',
      },
      {
        title_en: 'Freestyle Cruising',
        title_ro: 'Croaziera Freestyle',
        content_en: 'No fixed dining times or seating assignments. Choose from multiple restaurants and dining times at your convenience.',
        content_ro: 'Fara ore fixe de masa sau locuri atribuite. Alegeti din mai multe restaurante si ore de masa dupa convenienta.',
      },
    ],
  },

  'Royal Caribbean': {
    cruise_line: 'Royal Caribbean',
    cancellation: {
      tiers: [
        { period_en: '53+ days before', period_ro: '53+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '52 - 34 days before', period_ro: '52 - 34 zile inainte', penalty: '50%' },
        { period_en: '33 - 18 days before', period_ro: '33 - 18 zile inainte', penalty: '75%' },
        { period_en: '17 - 0 days / no-show', period_ro: '17 - 0 zile / neprezentare', penalty: '100%' },
      ],
      notes_en: 'For cruises of 15+ nights, the cancellation periods are stricter (from 123 days).',
      notes_ro: 'Pentru croazierele de 15+ nopti, perioadele sunt mai stricte (de la 123 zile).',
    },
    general_terms: [
      {
        title_en: 'Deposit',
        title_ro: 'Avans',
        content_en: 'Deposit required at booking varies by cruise length and cabin category. Full payment due 75-90 days before departure.',
        content_ro: 'Avansul necesar la rezervare variaza in functie de durata croazierei si categoria cabinei. Plata integrala scadenta cu 75-90 de zile inainte de plecare.',
      },
    ],
  },

  'Viking River Cruises': {
    cruise_line: 'Viking River Cruises',
    cancellation: {
      tiers: [
        { period_en: '120+ days before', period_ro: '120+ zile inainte', penalty: '250 EUR/pers.' },
        { period_en: '119 - 90 days before', period_ro: '119 - 90 zile inainte', penalty: '25%' },
        { period_en: '89 - 60 days before', period_ro: '89 - 60 zile inainte', penalty: '50%' },
        { period_en: '59 - 30 days before', period_ro: '59 - 30 zile inainte', penalty: '75%' },
        { period_en: 'Under 30 days / no-show', period_ro: 'Sub 30 zile / neprezentare', penalty: '100%' },
      ],
    },
    general_terms: [
      {
        title_en: 'All-Inclusive Value',
        title_ro: 'Valoare All-Inclusive',
        content_en: 'Viking river cruises include: shore excursions in every port, wine/beer/soft drinks at lunch and dinner, WiFi, port charges, and gratuities.',
        content_ro: 'Croazierele fluviale Viking includ: excursii in fiecare port, vin/bere/racoritoare la pranz si cina, WiFi, taxe portuare si bacsis.',
      },
    ],
  },

  'Silversea': {
    cruise_line: 'Silversea',
    cancellation: {
      tiers: [
        { period_en: '120+ days before', period_ro: '120+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '119 - 90 days before', period_ro: '119 - 90 zile inainte', penalty: '25%' },
        { period_en: '89 - 60 days before', period_ro: '89 - 60 zile inainte', penalty: '50%' },
        { period_en: '59 - 31 days before', period_ro: '59 - 31 zile inainte', penalty: '75%' },
        { period_en: '30 - 0 days / no-show', period_ro: '30 - 0 zile / neprezentare', penalty: '100%' },
      ],
      notes_en: 'Luxury cruise cancellation terms may vary. Contact us for specific conditions.',
      notes_ro: 'Termenii de anulare pentru croazierele de lux pot varia. Contactati-ne pentru conditii specifice.',
    },
    general_terms: [
      {
        title_en: 'All-Inclusive Luxury',
        title_ro: 'Lux All-Inclusive',
        content_en: 'Silversea fares include: all beverages (including champagne and premium spirits), butler service in suites, gratuities, shore excursions, WiFi, and specialty dining.',
        content_ro: 'Tarifele Silversea includ: toate bauturile (inclusiv sampanie si spirtoase premium), serviciu de butler in suite, bacsis, excursii, WiFi si dining de specialitate.',
      },
    ],
  },

  'Celebrity Cruises': {
    cruise_line: 'Celebrity Cruises',
    cancellation: {
      tiers: [
        { period_en: '75+ days before', period_ro: '75+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '74 - 57 days before', period_ro: '74 - 57 zile inainte', penalty: '50%' },
        { period_en: '56 - 29 days before', period_ro: '56 - 29 zile inainte', penalty: '75%' },
        { period_en: '28 - 0 days / no-show', period_ro: '28 - 0 zile / neprezentare', penalty: '100%' },
      ],
    },
    general_terms: [
      {
        title_en: 'Always Included',
        title_ro: 'Mereu Inclus',
        content_en: 'Celebrity "Always Included" fares include: classic beverage package, basic WiFi, and gratuities. Upgrade to Elevate or Indulge for premium inclusions.',
        content_ro: 'Tarifele Celebrity "Always Included" includ: pachet bauturi classic, WiFi basic si bacsis. Faceti upgrade la Elevate sau Indulge pentru incluziuni premium.',
      },
    ],
  },

  'Carnival Cruise Line': {
    cruise_line: 'Carnival Cruise Line',
    cancellation: {
      tiers: [
        { period_en: '75+ days before', period_ro: '75+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '74 - 56 days before', period_ro: '74 - 56 zile inainte', penalty: '50%' },
        { period_en: '55 - 30 days before', period_ro: '55 - 30 zile inainte', penalty: '75%' },
        { period_en: '29 - 0 days / no-show', period_ro: '29 - 0 zile / neprezentare', penalty: '100%' },
      ],
    },
    general_terms: [],
  },

  'Holland America Line': {
    cruise_line: 'Holland America Line',
    cancellation: {
      tiers: [
        { period_en: '75+ days before', period_ro: '75+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '74 - 57 days before', period_ro: '74 - 57 zile inainte', penalty: '50%' },
        { period_en: '56 - 29 days before', period_ro: '56 - 29 zile inainte', penalty: '75%' },
        { period_en: '28 - 0 days / no-show', period_ro: '28 - 0 zile / neprezentare', penalty: '100%' },
      ],
    },
    general_terms: [],
  },

  'Princess Cruises': {
    cruise_line: 'Princess Cruises',
    cancellation: {
      tiers: [
        { period_en: '75+ days before', period_ro: '75+ zile inainte', penalty: 'Deposit (non-refundable)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
        { period_en: '74 - 57 days before', period_ro: '74 - 57 zile inainte', penalty: '50%' },
        { period_en: '56 - 29 days before', period_ro: '56 - 29 zile inainte', penalty: '75%' },
        { period_en: '28 - 0 days / no-show', period_ro: '28 - 0 zile / neprezentare', penalty: '100%' },
      ],
    },
    general_terms: [
      {
        title_en: 'Princess Plus & Premier',
        title_ro: 'Princess Plus & Premier',
        content_en: 'Princess Plus includes drinks package, WiFi, and gratuities. Princess Premier adds specialty dining, premium WiFi, and photo package.',
        content_ro: 'Princess Plus include pachet bauturi, WiFi si bacsis. Princess Premier adauga dining de specialitate, WiFi premium si pachet foto.',
      },
    ],
  },
}
