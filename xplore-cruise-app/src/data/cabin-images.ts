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

// Default cabin images (generic cruise cabin photos from Unsplash)
const DEFAULT_IMAGES: CabinImageSet = {
  interior: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80',
  ocean_view: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&q=80',
  balcony: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
  suite: 'https://images.unsplash.com/photo-1590490360182-c33d7dc94402?w=600&q=80',
}

// Per cruise line cabin images
export const CABIN_IMAGES: Record<string, Partial<CabinImageSet>> = {
  'MSC Cruises': {
    interior: 'https://www.msccruises.com/-/media/global-contents/ship/msc-world-europa/cabin/deluxe-balcony/msc-world-europa-cabins-deluxe-inside-16to9.jpg?w=600',
    ocean_view: 'https://www.msccruises.com/-/media/global-contents/ship/msc-world-europa/cabin/ocean-view/msc-world-europa-cabins-oceanview-16to9.jpg?w=600',
    balcony: 'https://www.msccruises.com/-/media/global-contents/ship/msc-world-europa/cabin/deluxe-balcony/msc-world-europa-cabins-deluxe-balcony-16to9.jpg?w=600',
    suite: 'https://www.msccruises.com/-/media/global-contents/ship/msc-world-europa/cabin/msc-yacht-club/msc-world-europa-cabins-yacht-club-royal-suite-16to9.jpg?w=600',
  },
  'Costa Cruises': {
    interior: 'https://www.costacruises.com/content/dam/costa/costa-magazine/articles-stories/cabins/costa-cabin-internal-16x9.jpg',
    ocean_view: 'https://www.costacruises.com/content/dam/costa/costa-magazine/articles-stories/cabins/costa-cabin-ocean-view-16x9.jpg',
    balcony: 'https://www.costacruises.com/content/dam/costa/costa-magazine/articles-stories/cabins/costa-cabin-balcony-16x9.jpg',
    suite: 'https://www.costacruises.com/content/dam/costa/costa-magazine/articles-stories/cabins/costa-cabin-suite-16x9.jpg',
  },
  'Royal Caribbean': {
    interior: 'https://www.royalcaribbean.com/content/dam/royal/rooms/interior/interior-stateroom-background.jpg',
    ocean_view: 'https://www.royalcaribbean.com/content/dam/royal/rooms/ocean-view/ocean-view-stateroom-background.jpg',
    balcony: 'https://www.royalcaribbean.com/content/dam/royal/rooms/balcony/balcony-stateroom-background.jpg',
    suite: 'https://www.royalcaribbean.com/content/dam/royal/rooms/suites/suite-background.jpg',
  },
  'Norwegian Cruise Line': {
    interior: 'https://www.ncl.com/sites/default/files/prima_inside.jpg',
    ocean_view: 'https://www.ncl.com/sites/default/files/prima_oceanview.jpg',
    balcony: 'https://www.ncl.com/sites/default/files/prima_balcony.jpg',
    suite: 'https://www.ncl.com/sites/default/files/prima_penthouse.jpg',
  },
  'Celebrity Cruises': {
    interior: 'https://www.celebritycruises.com/content/dam/celebrity/new-images/staterooms/inside/celebrity-stateroom-inside-hero.jpg',
    ocean_view: 'https://www.celebritycruises.com/content/dam/celebrity/new-images/staterooms/ocean-view/celebrity-stateroom-ocean-view-hero.jpg',
    balcony: 'https://www.celebritycruises.com/content/dam/celebrity/new-images/staterooms/veranda/celebrity-stateroom-veranda-hero.jpg',
    suite: 'https://www.celebritycruises.com/content/dam/celebrity/new-images/staterooms/suite/celebrity-stateroom-suite-hero.jpg',
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
  // Common API codes
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
