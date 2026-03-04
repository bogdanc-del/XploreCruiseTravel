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
// Normalize cabin category from API names to our keys
// API returns codes like "OB", "OA", "MB", "Interior", "Balcony", etc.
// ============================================================

const CATEGORY_MAP: Record<string, keyof CabinImageSet> = {
  // English names
  interior: 'interior',
  inside: 'interior',
  inner: 'interior',
  internal: 'interior',
  'ocean view': 'ocean_view',
  oceanview: 'ocean_view',
  'ocean-view': 'ocean_view',
  outside: 'ocean_view',
  exterior: 'ocean_view',
  external: 'ocean_view',
  balcony: 'balcony',
  balcon: 'balcony',
  veranda: 'balcony',
  terrace: 'balcony',
  suite: 'suite',
  'mini suite': 'suite',
  'mini-suite': 'suite',
  penthouse: 'suite',
  'yacht club': 'suite',
  // Common API codes (two-letter)
  ia: 'interior',
  ib: 'interior',
  ic: 'interior',
  id: 'interior',
  ie: 'interior',
  if: 'interior',
  ig: 'interior',
  ih: 'interior',
  ii: 'interior',
  ij: 'interior',
  ir: 'interior',
  oa: 'ocean_view',
  ob: 'ocean_view',
  oc: 'ocean_view',
  od: 'ocean_view',
  oe: 'ocean_view',
  of: 'ocean_view',
  og: 'ocean_view',
  oh: 'ocean_view',
  ba: 'balcony',
  bb: 'balcony',
  bc: 'balcony',
  bd: 'balcony',
  be: 'balcony',
  bf: 'balcony',
  bg: 'balcony',
  bh: 'balcony',
  bp: 'balcony',
  bi: 'balcony',
  bj: 'balcony',
  bl: 'balcony',
  bm: 'balcony',
  mb: 'balcony',
  mc: 'balcony',
  sa: 'suite',
  sb: 'suite',
  sc: 'suite',
  sd: 'suite',
  se: 'suite',
  sf: 'suite',
  sg: 'suite',
  sh: 'suite',
  sr: 'suite',
  ss: 'suite',
  st: 'suite',
  su: 'suite',
  ms: 'suite',
  gs: 'suite',
  rs: 'suite',
  os: 'suite',
  ps: 'suite',
  // Single-letter + number codes (Costa, MSC, etc.)
  s: 'suite',
  i1: 'interior',
  i2: 'interior',
  i3: 'interior',
  i4: 'interior',
  i5: 'interior',
  i6: 'interior',
  e1: 'ocean_view',
  e2: 'ocean_view',
  e3: 'ocean_view',
  e4: 'ocean_view',
  ep: 'ocean_view',
  b1: 'balcony',
  b2: 'balcony',
  b3: 'balcony',
  b4: 'balcony',
  b5: 'balcony',
  b6: 'balcony',
  s1: 'suite',
  s2: 'suite',
  s3: 'suite',
  // Additional single-letter codes
  i: 'interior',
  e: 'ocean_view',
  b: 'balcony',
  o: 'ocean_view',
  // Premium/specialty cabin codes
  yc: 'suite',  // Yacht Club (MSC)
  r: 'suite',   // Royal suite
  // Romanian
  'cabina interioara': 'interior',
  'cabina exterioara': 'ocean_view',
  'cabina cu balcon': 'balcony',
  suita: 'suite',
}

export function normalizeCabinCategory(category: string): keyof CabinImageSet {
  const lower = category.trim().toLowerCase()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]

  // Fuzzy match
  if (lower.includes('suite') || lower.includes('suita') || lower.includes('penthouse') || lower.includes('yacht')) return 'suite'
  if (lower.includes('balcon') || lower.includes('verand') || lower.includes('terac')) return 'balcony'
  if (lower.includes('ocean') || lower.includes('exterior') || lower.includes('outside') || lower.includes('extern')) return 'ocean_view'
  if (lower.includes('interior') || lower.includes('inside') || lower.includes('inner') || lower.includes('intern')) return 'interior'

  // Default to interior
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
