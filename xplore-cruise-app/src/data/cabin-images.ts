// ============================================================
// Cabin Images — per cruise line, per cabin category
// Source: official cruise line press/media images
// ============================================================

export interface CabinImageSet {
  interior: string
  ocean_view: string
  balcony: string
  suite: string
}

// Default cabin images (reliable Unsplash images — always load correctly)
const DEFAULT_IMAGES: CabinImageSet = {
  interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
  ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
  balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
  suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
}

// Per cruise line cabin images — using Unsplash to avoid hotlink blocking from cruise line CDNs
export const CABIN_IMAGES: Record<string, Partial<CabinImageSet>> = {
  'MSC Cruises': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Costa Cruises': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Royal Caribbean': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Royal Caribbean Cruise Line': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Norwegian Cruise Line': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Celebrity Cruises': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Princess Cruises': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Holland America Line': {
    interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
    ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
    balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
    suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
  },
  'Viking Ocean Cruises': {
    interior: DEFAULT_IMAGES.interior,
    ocean_view: DEFAULT_IMAGES.ocean_view,
    balcony: DEFAULT_IMAGES.balcony,
    suite: DEFAULT_IMAGES.suite,
  },
  'Viking River Cruises': {
    interior: DEFAULT_IMAGES.interior,
    ocean_view: DEFAULT_IMAGES.ocean_view,
    balcony: DEFAULT_IMAGES.balcony,
    suite: DEFAULT_IMAGES.suite,
  },
}

// ============================================================
// Normalize cabin category from API codes to our 4 keys.
// API returns 400+ codes like BA, GS, OS, IB, 4D, YC1, etc.
// Covers all codes found across 469,831 room entries.
// ============================================================

const CATEGORY_MAP: Record<string, keyof CabinImageSet> = {
  // --- Interior (I-prefix, 4-prefix, 5-prefix, Z-prefix) ---
  I: 'interior', IA: 'interior', IB: 'interior', IC: 'interior', ID: 'interior',
  IE: 'interior', IF: 'interior', IG: 'interior', IH: 'interior', IL: 'interior',
  IL1: 'interior', IM1: 'interior', IM2: 'interior', IN: 'interior', IN1: 'interior',
  IN2: 'interior', IN3: 'interior', IQ: 'interior', IR1: 'interior', IR2: 'interior',
  IS: 'interior', IT: 'interior', IX: 'interior', I1: 'interior', I2: 'interior',
  I3: 'interior', I4: 'interior', I5: 'interior', IGT: 'interior',
  Z: 'interior', ZI: 'interior',
  '4A': 'interior', '4B': 'interior', '4C': 'interior', '4D': 'interior', '4E': 'interior',
  '4F': 'interior', '4G': 'interior', '4H': 'interior', '4I': 'interior', '4J': 'interior',
  '4K': 'interior', '4M': 'interior', '4N': 'interior', '4O': 'interior', '4P': 'interior',
  '4S': 'interior', '4T': 'interior', '4U': 'interior', '4V': 'interior',
  '5D': 'interior', '5N': 'interior', '5V': 'interior',

  // --- Ocean View (O-prefix, E-prefix, 2-prefix, 3-prefix, X-prefix, misc) ---
  O: 'ocean_view', OA: 'ocean_view', OB: 'ocean_view', OC: 'ocean_view', OD: 'ocean_view',
  OE: 'ocean_view', OF: 'ocean_view', OG: 'ocean_view', OK: 'ocean_view', OL: 'ocean_view',
  OL1: 'ocean_view', OL2: 'ocean_view', OL3: 'ocean_view', OM1: 'ocean_view', OM2: 'ocean_view',
  OO: 'ocean_view', OP: 'ocean_view', OR1: 'ocean_view', OR2: 'ocean_view', OS: 'ocean_view',
  OT: 'ocean_view', OV: 'ocean_view', OW: 'ocean_view', OX: 'ocean_view', OY: 'ocean_view',
  OZ: 'ocean_view', O1: 'ocean_view', O2: 'ocean_view', O3: 'ocean_view', O4: 'ocean_view',
  O5: 'ocean_view', O6: 'ocean_view', OGT: 'ocean_view',
  E: 'ocean_view', E1: 'ocean_view', E2: 'ocean_view', E3: 'ocean_view', E4: 'ocean_view',
  E5: 'ocean_view', EA: 'ocean_view', EB: 'ocean_view', EC: 'ocean_view', EE: 'ocean_view',
  EF: 'ocean_view', ES: 'ocean_view', ET1: 'ocean_view', EV: 'ocean_view', EX: 'ocean_view',
  F: 'ocean_view', F1: 'ocean_view', F2: 'ocean_view', F5: 'ocean_view',
  K: 'ocean_view', KS: 'ocean_view', L: 'ocean_view', L1: 'ocean_view', L5: 'ocean_view',
  LS: 'ocean_view', N: 'ocean_view', N1: 'ocean_view', N2: 'ocean_view', N4: 'ocean_view',
  N5: 'ocean_view', U5: 'ocean_view', UC: 'ocean_view', UL: 'ocean_view', UP: 'ocean_view',
  US: 'ocean_view', UV: 'ocean_view', W: 'ocean_view', WG: 'ocean_view',
  X: 'ocean_view', XA: 'ocean_view', XB: 'ocean_view', XBO: 'ocean_view', XC: 'ocean_view',
  XD: 'ocean_view', XI: 'ocean_view', XN: 'ocean_view',
  '2B': 'ocean_view', '2C': 'ocean_view', '2D': 'ocean_view', '2E': 'ocean_view',
  '2G': 'ocean_view', '2H': 'ocean_view', '2I': 'ocean_view', '2J': 'ocean_view',
  '2N': 'ocean_view', '2P': 'ocean_view', '2S': 'ocean_view', '2T': 'ocean_view',
  '2U': 'ocean_view', '2V': 'ocean_view', '2W': 'ocean_view',
  '3B': 'ocean_view', '3C': 'ocean_view', '3D': 'ocean_view', '3M': 'ocean_view',
  '3N': 'ocean_view', '3U': 'ocean_view', '3V': 'ocean_view',
  '5B': 'ocean_view', '5C': 'ocean_view',
  '09': 'ocean_view', '09B': 'ocean_view', '09C': 'ocean_view', '09D': 'ocean_view',
  CLASSIC: 'ocean_view', DELUXE: 'ocean_view', Deluxe: 'ocean_view',
  Standard: 'interior', Twin: 'interior', Promenade: 'ocean_view',

  // --- Balcony (B-prefix, 6-7-8-prefix, C/D/T/V-prefix) ---
  B: 'balcony', BA: 'balcony', BA2: 'balcony', BB: 'balcony', BC: 'balcony',
  BD: 'balcony', BE: 'balcony', BF: 'balcony', BGA: 'balcony', BL: 'balcony',
  BL1: 'balcony', BL2: 'balcony', BL3: 'balcony', BM1: 'balcony', BM2: 'balcony',
  BP: 'balcony', BR1: 'balcony', BR2: 'balcony', BR3: 'balcony', BR4: 'balcony',
  BRS: 'balcony', BS: 'balcony', BS1: 'balcony', BT: 'balcony', BU: 'balcony',
  BV: 'balcony', BW: 'balcony', BX: 'balcony', BY: 'balcony', BZ: 'balcony',
  B1: 'balcony', B2: 'balcony', B3: 'balcony', B4: 'balcony', B5: 'balcony', B6: 'balcony',
  C: 'balcony', C1: 'balcony', C2: 'balcony', C3: 'balcony', C5: 'balcony',
  CA: 'balcony', CB: 'balcony', CC: 'balcony', CI: 'balcony', CO: 'balcony',
  CP: 'balcony', CQ: 'balcony', CS: 'balcony', CS2: 'balcony', CV: 'balcony', CW: 'balcony',
  D: 'balcony', D0: 'balcony', D1: 'balcony', D2: 'balcony', D3: 'balcony',
  D4: 'balcony', D5: 'balcony', DA: 'balcony', DB: 'balcony', DC: 'balcony',
  DD: 'balcony', DE: 'balcony', DF: 'balcony', DG: 'balcony', DH: 'balcony',
  DI: 'balcony', DO: 'balcony', DS: 'balcony', DV: 'balcony', DW: 'balcony',
  FA: 'balcony', FB: 'balcony', FC: 'balcony', FE: 'balcony', FF: 'balcony',
  FJ: 'balcony', FM: 'balcony', FO: 'balcony', FP: 'balcony', FS: 'balcony',
  T1: 'balcony', T2: 'balcony', T5: 'balcony', TA: 'balcony', TE: 'balcony',
  TI: 'balcony', TL: 'balcony', TM: 'balcony', TR: 'balcony', TX: 'balcony',
  V: 'balcony', VA: 'balcony', VB: 'balcony', VC: 'balcony', VD: 'balcony',
  VE: 'balcony', VF: 'balcony', VH: 'balcony', VI: 'balcony', VL1: 'balcony',
  VLA: 'balcony', VO: 'balcony', VP: 'balcony', VQ: 'balcony', VR: 'balcony',
  VS: 'balcony', VS1: 'balcony', VS2: 'balcony', VSS: 'balcony', VT: 'balcony',
  VVB: 'balcony', VGT: 'balcony', V1: 'balcony', V2: 'balcony', V3: 'balcony', V4: 'balcony',
  MB: 'balcony', MC: 'balcony',
  '6A': 'balcony', '6B': 'balcony', '6C': 'balcony', '6D': 'balcony', '6E': 'balcony',
  '6J': 'balcony', '6K': 'balcony', '6L': 'balcony', '6M': 'balcony', '6N': 'balcony',
  '6S': 'balcony', '6T': 'balcony',
  '7A': 'balcony', '7C': 'balcony', '7S': 'balcony', '7X': 'balcony', '7Y': 'balcony',
  '8A': 'balcony', '8B': 'balcony', '8C': 'balcony', '8D': 'balcony', '8E': 'balcony',
  '8F': 'balcony', '8G': 'balcony', '8H': 'balcony', '8J': 'balcony', '8K': 'balcony',
  '8L': 'balcony', '8M': 'balcony', '8N': 'balcony', '8P': 'balcony', '8S': 'balcony',
  '8T': 'balcony', '8V': 'balcony',
  '06': 'balcony', '06B': 'balcony', '07A': 'balcony', '08': 'balcony', '08B': 'balcony', '08C': 'balcony',
  'FRENCH BALCONY': 'balcony', 'SIGNATURE FRENCH BALCONY': 'balcony', 'DELUXE BALCONY': 'balcony',

  // --- Suite (S-prefix, G/H/J/M/P/Q/R/Y/A/9-prefix) ---
  S: 'suite', SA: 'suite', SB: 'suite', SBS: 'suite', SBS1: 'suite',
  SC: 'suite', SD: 'suite', SE: 'suite', SF: 'suite', SG: 'suite',
  SH: 'suite', SI: 'suite', SJ: 'suite', SJA: 'suite', SJB: 'suite', SJC: 'suite',
  SK: 'suite', SL: 'suite', SL1: 'suite', SLJ: 'suite', SLP: 'suite',
  SLS: 'suite', SLT: 'suite', SLW: 'suite', SM: 'suite', SN: 'suite',
  SO: 'suite', SP: 'suite', SPL: 'suite', SQ: 'suite', SR: 'suite',
  SR1: 'suite', SR2: 'suite', SRP: 'suite', SRS: 'suite', SS: 'suite', SS1: 'suite',
  STE: 'suite', SU: 'suite', SV: 'suite', SX: 'suite', SXJ: 'suite', SXT: 'suite',
  SY: 'suite', SZ: 'suite', S0: 'suite', S1: 'suite', S2: 'suite', S3: 'suite',
  S4: 'suite', S5: 'suite', S6: 'suite', S7: 'suite', S8: 'suite', S9: 'suite',
  G: 'suite', GA: 'suite', GB: 'suite', GC: 'suite', GL: 'suite', GP: 'suite',
  GR: 'suite', GS: 'suite', GT: 'suite', GV: 'suite', G1: 'suite', G2: 'suite',
  H: 'suite', H1: 'suite', H2: 'suite', H3: 'suite', H4: 'suite', H5: 'suite',
  H6: 'suite', H7: 'suite', H8: 'suite', HA: 'suite', HB: 'suite', HC: 'suite',
  HD: 'suite', HE: 'suite', HF: 'suite', HG: 'suite', HH: 'suite', HI: 'suite',
  HJ: 'suite', HL: 'suite', HM: 'suite', HS: 'suite', HS1: 'suite', HS2: 'suite', HU: 'suite',
  J: 'suite', J1: 'suite', J3: 'suite', J4: 'suite', JS: 'suite', JT: 'suite', JY: 'suite',
  M: 'suite', M1: 'suite', M2: 'suite', M4: 'suite', M6: 'suite', MA: 'suite',
  MD: 'suite', ME: 'suite', MF: 'suite', MM: 'suite', MS: 'suite', MX: 'suite', MY: 'suite',
  P1: 'suite', P2: 'suite', PA: 'suite', PD1: 'suite', PD2: 'suite', PG: 'suite',
  PH: 'suite', PH1: 'suite', PH2: 'suite', PH3: 'suite', PO: 'suite',
  PR1: 'suite', PR2: 'suite', PR3: 'suite', PS: 'suite', PT: 'suite', PV: 'suite',
  Q1: 'suite', Q2: 'suite', Q3: 'suite', Q4: 'suite', Q5: 'suite', Q6: 'suite', Q7: 'suite',
  R3: 'suite', R4: 'suite', RA: 'suite', RB: 'suite', RF: 'suite', RL: 'suite', RS: 'suite',
  A: 'suite', A1: 'suite', A2: 'suite', A3: 'suite', A4: 'suite', AA: 'suite', AS: 'suite', AX: 'suite',
  WS: 'suite',
  Y: 'suite', Y3: 'suite', Y4: 'suite', YC1: 'suite', YC2: 'suite', YC3: 'suite', YC4: 'suite',
  YCL: 'suite', YCP: 'suite', YCT: 'suite', YCD: 'suite', YD3: 'suite', YIN: 'suite',
  YJD: 'suite', YO: 'suite',
  '1A': 'suite', '1B': 'suite', '1C': 'suite', '1D': 'suite', '1E': 'suite',
  '1I': 'suite', '1J': 'suite', '1K': 'suite', '1L': 'suite', '1M': 'suite',
  '1N': 'suite', '1P': 'suite', '1Q': 'suite', '1R': 'suite', '1U': 'suite', '1V': 'suite',
  '9A': 'suite', '9B': 'suite', '9C': 'suite',
  '10': 'suite', '10A': 'suite', '11': 'suite', '11A': 'suite', '11B': 'suite', '11C': 'suite', '12': 'suite',
  '01C': 'suite', '02A': 'suite', '02B': 'suite', '03A': 'suite', '03B': 'suite', '04': 'suite', '04C': 'suite',
  SUITE: 'suite', 'ROYAL SUITE': 'suite', 'GRAND SUITE': 'suite', 'SIGNATURE SUITE': 'suite',
  'Junior Suite': 'suite', 'Superior H': 'suite', 'Superior G': 'suite',

  // --- Text-based (Romanian) ---
  'cabina interioara': 'interior',
  'cabina exterioara': 'ocean_view',
  'cabina cu balcon': 'balcony',
  suita: 'suite',
  // Lowercase identity mappings
  interior: 'interior', ocean_view: 'ocean_view', balcony: 'balcony', suite: 'suite',
}

export function normalizeCabinCategory(category: string): keyof CabinImageSet {
  if (!category) return 'interior'
  const trimmed = category.trim()

  // Check exact match first
  if (CATEGORY_MAP[trimmed]) return CATEGORY_MAP[trimmed]
  // Check uppercase match
  const upper = trimmed.toUpperCase()
  if (CATEGORY_MAP[upper]) return CATEGORY_MAP[upper]
  // Check lowercase match
  const lower = trimmed.toLowerCase()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]

  // Keyword-based fuzzy matching
  if (lower.includes('suite') || lower.includes('suita') || lower.includes('penthouse') || lower.includes('yacht') || lower.includes('haven')) return 'suite'
  if (lower.includes('balcon') || lower.includes('verand') || lower.includes('terac') || lower.includes('french')) return 'balcony'
  if (lower.includes('ocean') || lower.includes('exterior') || lower.includes('outside') || lower.includes('extern') || lower.includes('view') || lower.includes('porthole')) return 'ocean_view'
  if (lower.includes('interior') || lower.includes('inside') || lower.includes('inner') || lower.includes('intern') || lower.includes('standard')) return 'interior'

  // Default to interior (safest/cheapest assumption)
  return 'interior'
}

export function getCabinImage(cruiseLine: string, category: string): string {
  const normalized = normalizeCabinCategory(category)
  const lineImages = CABIN_IMAGES[cruiseLine]
  if (lineImages && lineImages[normalized]) return lineImages[normalized]!
  return DEFAULT_IMAGES[normalized]
}

export function getCabinCategoryLabel(category: string, locale: 'en' | 'ro'): string {
  const normalized = normalizeCabinCategory(category)
  const labels: Record<keyof CabinImageSet, { en: string; ro: string }> = {
    interior: { en: 'Interior', ro: 'Interior' },
    ocean_view: { en: 'Ocean View', ro: 'Exterior' },
    balcony: { en: 'Balcony', ro: 'Balcon' },
    suite: { en: 'Suite', ro: 'Suită' },
  }
  return labels[normalized][locale]
}

// ============================================================
// Cabin Category Descriptions — shown in the CabinSelector
// ============================================================

const CABIN_DESCRIPTIONS: Record<keyof CabinImageSet, { en: string; ro: string }> = {
  interior: {
    en: 'Comfortable cabin without a window. Ideal for guests who spend most of their time exploring the ship and ports.',
    ro: 'Cabina confortabila fara fereastra. Ideala pentru oaspetii care isi petrec timpul explorind nava si porturile.',
  },
  ocean_view: {
    en: 'Cabin with a window or porthole offering natural light and sea views. A great balance of comfort and value.',
    ro: 'Cabina cu fereastra sau hublou ce ofera lumina naturala si vedere la mare. Un echilibru excelent intre confort si pret.',
  },
  balcony: {
    en: 'Spacious cabin with a private balcony. Enjoy sunrise over the sea and fresh ocean air from your own terrace.',
    ro: 'Cabina spatioasa cu balcon privat. Bucurati-va de rasaritul peste mare si aer proaspat de pe propria terasa.',
  },
  suite: {
    en: 'Premium suite with separate living area, priority boarding, and exclusive amenities. The ultimate cruise experience.',
    ro: 'Suita premium cu zona de zi separata, imbarcare prioritara si facilitati exclusive. Experienta suprema de croaziera.',
  },
}

export function getCabinDescription(category: string, locale: 'en' | 'ro'): string {
  const normalized = normalizeCabinCategory(category)
  return CABIN_DESCRIPTIONS[normalized][locale]
}
