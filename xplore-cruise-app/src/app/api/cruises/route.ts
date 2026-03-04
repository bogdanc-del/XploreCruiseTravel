import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Cruise Listing API — paginated, filterable, searchable
// GET /api/cruises?page=1&limit=24&destination=caribbean&type=ocean&...
// GET /api/cruises?grouped=1  → collapses repeated routes into single entries
// ============================================================

// Compact index format (short keys to save ~40% JSON size)
interface CompactCruise {
  id: string
  s: string    // slug
  t: string    // title
  ct: string   // cruise_type
  n: number    // nights
  p: number    // price_from
  dp: string   // departure_port
  dd: string | null // departure_date
  img: string  // image_url
  cl: string   // cruise_line
  sn: string   // ship_name
  d: string    // destination
  dr: string   // destination_ro
  ds: string   // destination_slug
  // Price tracking (optional — added by sync)
  pp?: number | null   // previous_price_from
  pca?: string | null  // price_changed_at
  lsa?: string | null  // last_synced_at
  // Promo flags (optional — added by sync from enriched data)
  ip?: boolean         // is_promo
  ib?: boolean         // is_bestdeal
  ppr?: number | null  // promo_price
}

// Expanded format returned to clients
interface CruiseIndex {
  id: string
  slug: string
  title: string
  cruise_type: string
  nights: number
  price_from: number
  currency: string
  departure_port: string
  departure_date: string | null
  image_url: string
  cruise_line: string
  ship_name: string
  destination: string
  destination_ro: string
  destination_slug: string
  // Price tracking
  previous_price_from?: number | null
  price_changed_at?: string | null
  last_synced_at?: string | null
  // Promo flags
  is_promo?: boolean
  is_bestdeal?: boolean
  promo_price?: number | null
}

// Grouped cruise — a representative cruise + group metadata
interface GroupedCruise extends CruiseIndex {
  departure_count: number
  price_min: number
  price_max: number
  next_departures: string[]  // up to 5 nearest future dates
  all_slugs: string[]        // all slugs in this group (for SEO/linking)
}

// Load & expand index once at startup (cached in module scope)
// v2: filtered short cruises + deals mode
let cruiseIndex: CruiseIndex[] | null = null
let filterMeta: {
  destinations: { slug: string; name: string; name_ro: string }[]
  cruiseLines: string[]
  cruiseTypes: string[]
  priceRange: { min: number; max: number }
  nightsRange: { min: number; max: number }
} | null = null

function expand(c: CompactCruise): CruiseIndex {
  return {
    id: c.id,
    slug: c.s,
    title: c.t,
    cruise_type: c.ct,
    nights: c.n,
    price_from: c.p,
    currency: 'EUR',
    departure_port: c.dp,
    departure_date: c.dd,
    image_url: c.img,
    cruise_line: c.cl,
    ship_name: c.sn,
    destination: c.d,
    destination_ro: c.dr,
    destination_slug: c.ds,
    previous_price_from: c.pp || null,
    price_changed_at: c.pca || null,
    last_synced_at: c.lsa || null,
    is_promo: c.ip || false,
    is_bestdeal: c.ib || false,
    promo_price: c.ppr || null,
  }
}

function loadIndex(): CruiseIndex[] {
  if (cruiseIndex) return cruiseIndex
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises-index.json')
    const compact: CompactCruise[] = JSON.parse(readFileSync(filePath, 'utf8'))
    // Filter out short cruises (1-2 nights) — no business value
    cruiseIndex = compact.filter(c => c.n >= 3).map(expand)
    return cruiseIndex!
  } catch {
    console.error('Failed to load cruises-index.json')
    return []
  }
}

function getFilterMeta() {
  if (filterMeta) return filterMeta
  const cruises = loadIndex()

  const destMap = new Map<string, { slug: string; name: string; name_ro: string }>()
  const lines = new Set<string>()
  const types = new Set<string>()
  let minP = Infinity, maxP = 0, minN = Infinity, maxN = 0

  for (const c of cruises) {
    if (c.destination_slug && c.destination) {
      destMap.set(c.destination_slug, {
        slug: c.destination_slug,
        name: c.destination,
        name_ro: c.destination_ro || c.destination,
      })
    }
    if (c.cruise_line) lines.add(c.cruise_line)
    types.add(c.cruise_type)
    if (c.price_from > 0 && c.price_from < minP) minP = c.price_from
    if (c.price_from > maxP) maxP = c.price_from
    if (c.nights > 0 && c.nights < minN) minN = c.nights
    if (c.nights > maxN) maxN = c.nights
  }

  filterMeta = {
    destinations: Array.from(destMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    cruiseLines: Array.from(lines).sort(),
    cruiseTypes: Array.from(types).sort(),
    priceRange: { min: minP, max: maxP },
    nightsRange: { min: minN, max: maxN },
  }
  return filterMeta
}

// ============================================================
// Route grouping — collapses repeated ship+port+nights+line+dest
// ============================================================

function groupRoutes(cruises: CruiseIndex[]): GroupedCruise[] {
  const now = Date.now()
  const groups = new Map<string, CruiseIndex[]>()

  for (const c of cruises) {
    // Group key: ship + departure port + nights + cruise line + destination
    const key = `${c.ship_name}|${c.departure_port}|${c.nights}|${c.cruise_line}|${c.destination_slug}`
    const arr = groups.get(key)
    if (arr) arr.push(c)
    else groups.set(key, [c])
  }

  const result: GroupedCruise[] = []

  for (const members of groups.values()) {
    // Sort group members by price to pick cheapest as representative
    members.sort((a, b) => a.price_from - b.price_from)
    const representative = members[0]

    // Compute group metadata
    const prices = members.map(m => m.price_from)
    const priceMin = Math.min(...prices)
    const priceMax = Math.max(...prices)

    // Collect all departure dates, sort by date, keep future ones first
    const allDates = members
      .map(m => m.departure_date)
      .filter((d): d is string => d !== null && d !== '')
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

    // Get up to 5 nearest future departure dates
    const futureDates = allDates.filter(d => new Date(d).getTime() >= now)
    const nextDepartures = futureDates.slice(0, 5)

    // If no future dates, use the most recent past dates
    const displayDates = nextDepartures.length > 0
      ? nextDepartures
      : allDates.slice(-5)

    // Use the nearest future departure date as the representative date
    const bestDate = futureDates[0] || allDates[0] || representative.departure_date

    result.push({
      ...representative,
      departure_date: bestDate,
      price_from: priceMin,
      departure_count: members.length,
      price_min: priceMin,
      price_max: priceMax,
      next_departures: displayDates,
      all_slugs: members.map(m => m.slug),
    })
  }

  return result
}

// Cache headers for better performance
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // If requesting just filter metadata
  if (searchParams.get('meta') === '1') {
    return NextResponse.json(getFilterMeta(), { headers: CACHE_HEADERS })
  }

  const cruises = loadIndex()
  const isGrouped = searchParams.get('grouped') === '1'

  // Pagination
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24')))

  // Filters
  const search = (searchParams.get('search') || '').toLowerCase().trim()
  const destination = searchParams.get('destination') || ''
  const cruiseType = searchParams.get('type') || ''
  const cruiseLine = searchParams.get('line') || ''
  const minPrice = parseInt(searchParams.get('minPrice') || '0') || 0
  const maxPrice = parseInt(searchParams.get('maxPrice') || '0') || 0
  const minNights = parseInt(searchParams.get('minNights') || '0') || 0
  const maxNights = parseInt(searchParams.get('maxNights') || '0') || 0
  const departureWindow = searchParams.get('departure') || ''
  const sortBy = searchParams.get('sort') || 'featured'
  const promoOnly = searchParams.get('promo') === '1'
  const dealsMode = searchParams.get('deals') === '1' // Best value deals (fallback when no promos)

  // Compute departure date bounds
  let departureMaxDate: number | null = null
  if (departureWindow) {
    const now = Date.now()
    switch (departureWindow) {
      case '3m': departureMaxDate = now + 90 * 86_400_000; break
      case '6m': departureMaxDate = now + 180 * 86_400_000; break
      case 'year': departureMaxDate = now + 365 * 86_400_000; break
    }
  }

  // Apply filters
  let filtered = cruises.filter(c => {
    if (search) {
      const matchesSearch =
        c.title.toLowerCase().includes(search) ||
        c.cruise_line.toLowerCase().includes(search) ||
        c.destination.toLowerCase().includes(search) ||
        c.destination_ro.toLowerCase().includes(search) ||
        c.ship_name.toLowerCase().includes(search) ||
        c.departure_port.toLowerCase().includes(search)
      if (!matchesSearch) return false
    }
    if (destination && c.destination_slug !== destination) return false
    if (cruiseType && c.cruise_type !== cruiseType) return false
    if (cruiseLine && c.cruise_line !== cruiseLine) return false
    if (minPrice > 0 && c.price_from < minPrice) return false
    if (maxPrice > 0 && c.price_from > maxPrice) return false
    if (minNights > 0 && c.nights < minNights) return false
    if (maxNights > 0 && c.nights > maxNights) return false
    if (c.price_from <= 0) return false
    // Promo filter (strict — only API-flagged promos)
    if (promoOnly && !dealsMode && !c.is_promo && !c.is_bestdeal) return false
    // Departure date filter
    if (departureMaxDate && c.departure_date) {
      const depTime = new Date(c.departure_date).getTime()
      if (depTime > departureMaxDate || depTime < Date.now()) return false
    }
    return true
  })

  // Deals mode: return best-value cruises with upcoming departures
  // Prioritizes: API-flagged promos → price drops → cheapest per night
  if (dealsMode || promoOnly) {
    const now = Date.now()
    const sixMonths = now + 180 * 86_400_000

    // Step 1: Try explicit promos first
    const explicitPromos = filtered.filter(c => c.is_promo || c.is_bestdeal)

    if (explicitPromos.length > 0) {
      // We have real promos — use them
      filtered = explicitPromos
    } else if (dealsMode || promoOnly) {
      // No API promos — show best deals: cheapest cruises with upcoming departures
      const withUpcoming = filtered.filter(c => {
        if (!c.departure_date) return true // include if no date data
        const dep = new Date(c.departure_date).getTime()
        return dep >= now && dep <= sixMonths
      })

      // Sort by price per night (best value)
      const source = withUpcoming.length > 20 ? withUpcoming : filtered
      source.sort((a, b) => {
        const ppnA = a.nights > 0 ? a.price_from / a.nights : a.price_from
        const ppnB = b.nights > 0 ? b.price_from / b.nights : b.price_from
        return ppnA - ppnB
      })

      // Take top deals (diverse destinations)
      const seen = new Set<string>()
      const deals: typeof source = []
      for (const c of source) {
        // Diversify by destination
        const key = c.destination_slug
        if (seen.size < 4 && seen.has(key)) continue // limit same-destination in top picks
        seen.add(key)
        deals.push(c)
        if (deals.length >= limit * 2) break // get enough for pagination
      }
      filtered = deals
    }
  }

  // Group routes if requested (BEFORE sorting so sort applies to groups)
  let results: (CruiseIndex | GroupedCruise)[] = isGrouped
    ? groupRoutes(filtered)
    : filtered

  // Sort
  switch (sortBy) {
    case 'price_asc':
      results.sort((a, b) => a.price_from - b.price_from)
      break
    case 'price_desc':
      results.sort((a, b) => b.price_from - a.price_from)
      break
    case 'date':
      results.sort((a, b) => {
        const da = a.departure_date ? new Date(a.departure_date).getTime() : Infinity
        const db = b.departure_date ? new Date(b.departure_date).getTime() : Infinity
        return da - db
      })
      break
    case 'nights_asc':
      results.sort((a, b) => a.nights - b.nights)
      break
    case 'nights_desc':
      results.sort((a, b) => b.nights - a.nights)
      break
    default:
      results.sort((a, b) => a.price_from - b.price_from)
  }

  // Paginate
  const total = results.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const pageData = results.slice(offset, offset + limit)

  return NextResponse.json({
    cruises: pageData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    grouped: isGrouped,
  }, { headers: CACHE_HEADERS })
}
