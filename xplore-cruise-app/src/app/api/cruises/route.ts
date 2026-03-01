import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Cruise Listing API — paginated, filterable, searchable
// GET /api/cruises?page=1&limit=24&destination=caribbean&type=ocean&...
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
}

// Load & expand index once at startup (cached in module scope)
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
  }
}

function loadIndex(): CruiseIndex[] {
  if (cruiseIndex) return cruiseIndex
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises-index.json')
    const compact: CompactCruise[] = JSON.parse(readFileSync(filePath, 'utf8'))
    cruiseIndex = compact.map(expand)
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
  const sortBy = searchParams.get('sort') || 'featured'

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
    return true
  })

  // Sort
  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price_from - b.price_from)
      break
    case 'price_desc':
      filtered.sort((a, b) => b.price_from - a.price_from)
      break
    case 'date':
      filtered.sort((a, b) => {
        const da = a.departure_date ? new Date(a.departure_date).getTime() : Infinity
        const db = b.departure_date ? new Date(b.departure_date).getTime() : Infinity
        return da - db
      })
      break
    case 'nights_asc':
      filtered.sort((a, b) => a.nights - b.nights)
      break
    case 'nights_desc':
      filtered.sort((a, b) => b.nights - a.nights)
      break
    default:
      filtered.sort((a, b) => a.price_from - b.price_from)
  }

  // Paginate
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const pageData = filtered.slice(offset, offset + limit)

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
  }, { headers: CACHE_HEADERS })
}
