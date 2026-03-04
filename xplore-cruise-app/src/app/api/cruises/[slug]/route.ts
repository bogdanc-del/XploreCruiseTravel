import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Cruise Detail API — look up full cruise data by slug
// GET /api/cruises/[slug]
//
// Merges base cruise data (cruises.json) with enriched data
// (cruises-enriched.json) to include per-departure-date room
// pricing. This allows the detail page to show accurate prices
// when users select different departure dates.
// ============================================================

// Lazy-loaded full cruise database (cached in module scope)
let cruisesMap: Map<string, Record<string, unknown>> | null = null
let enrichedMap: Record<string, Record<string, unknown>> | null = null

function loadCruisesMap(): Map<string, Record<string, unknown>> {
  if (cruisesMap) return cruisesMap
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises.json')
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>[]
    cruisesMap = new Map()
    for (const c of data) {
      cruisesMap.set(c.slug as string, c)
    }
    return cruisesMap
  } catch {
    console.error('Failed to load cruises.json')
    return new Map()
  }
}

function loadEnrichedMap(): Record<string, Record<string, unknown>> {
  if (enrichedMap) return enrichedMap
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises-enriched.json')
    enrichedMap = JSON.parse(readFileSync(filePath, 'utf8'))
    return enrichedMap!
  } catch {
    console.error('Failed to load cruises-enriched.json')
    enrichedMap = {}
    return enrichedMap
  }
}

// Compute per-date minimum prices from room data
// Compact format: {n: name, c: category, dp: [[date, price], ...]}
interface CompactRoom { n: string; c: string; dp: [string, number][] }
interface RoomEntry { name: string; category: string; date: string; price: number }
interface DatePrice { date: string; price_from: number; cabin_count: number }

// URL prefixes stripped during optimization — reconstruct at serve-time
const GALLERY_PREFIX = 'https://www.croaziere.net/uploads/images/'
const EXC_PREFIX = 'https://www.croaziere.net'

function expandCompactRooms(rooms: CompactRoom[]): RoomEntry[] {
  const result: RoomEntry[] = []
  for (const r of rooms) {
    for (const [date, price] of r.dp) {
      result.push({ name: r.n, category: r.c, date, price })
    }
  }
  return result
}

function computeDatePrices(rooms: RoomEntry[]): DatePrice[] {
  const byDate = new Map<string, { min: number; count: number }>()
  for (const r of rooms) {
    if (!r.date || !r.price || r.price <= 0) continue
    const existing = byDate.get(r.date)
    if (!existing) {
      byDate.set(r.date, { min: r.price, count: 1 })
    } else {
      if (r.price < existing.min) existing.min = r.price
      existing.count++
    }
  }
  return Array.from(byDate.entries())
    .map(([date, { min, count }]) => ({ date, price_from: min, cabin_count: count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const map = loadCruisesMap()
  const cruise = map.get(slug)

  if (!cruise) {
    return NextResponse.json(
      { error: 'Cruise not found' },
      { status: 404 }
    )
  }

  // Look up enriched data (rooms with per-date pricing)
  const enriched = loadEnrichedMap()
  const sourceId = String(cruise.id || '')
  const enrichedEntry = enriched[sourceId]

  // Expand compact rooms to full format and compute per-date prices
  let expandedRooms: RoomEntry[] = []
  let date_prices: DatePrice[] = []
  if (enrichedEntry?.rooms) {
    const rawRooms = enrichedEntry.rooms as CompactRoom[] | RoomEntry[]
    // Handle both compact and legacy format
    if (rawRooms.length > 0 && 'dp' in rawRooms[0]) {
      expandedRooms = expandCompactRooms(rawRooms as CompactRoom[])
    } else {
      expandedRooms = rawRooms as RoomEntry[]
    }
    date_prices = computeDatePrices(expandedRooms)
  }

  // Merge enriched gallery — reconstruct full URLs from stripped prefixes
  let gallery: string[] = (cruise.gallery_urls as string[])?.length
    ? (cruise.gallery_urls as string[])
    : []
  if (!gallery.length && enrichedEntry?.gallery) {
    gallery = (enrichedEntry.gallery as string[]).map(url =>
      url.startsWith('http') ? url : GALLERY_PREFIX + url
    )
  }

  // Promo fields from enriched data
  const _is_promo = enrichedEntry?.is_promo === true
  const _is_bestdeal = enrichedEntry?.is_bestdeal === true
  const _promo_price = enrichedEntry?.promo_price ? Number(enrichedEntry.promo_price) : null

  // Rooms array (expanded) for cabin selector
  const _rooms = expandedRooms

  // Enriched itinerary — expand compact format {d, p, a, t} → full format
  const rawItinerary = (enrichedEntry?.itinerary || []) as Record<string, unknown>[]
  const _itinerary_enriched = rawItinerary.map(it => {
    // Handle compact format (d/p/a/t) and legacy format (day/port/from_hour/till_hour)
    if ('d' in it) {
      return {
        day: it.d as number,
        port: (it.p || '') as string,
        from_hour: (it.a || '') as string,
        till_hour: (it.t || '') as string,
      }
    }
    return {
      day: (it.day || 0) as number,
      port: (it.port || it.name || '') as string,
      from_hour: (it.from_hour || '') as string,
      till_hour: (it.till_hour || '') as string,
    }
  })

  // API-sourced HTML for terms (included/excluded specifics, cancellation policy)
  const _included_html = (enrichedEntry?.included_html as string) || ''
  const _excluded_html = (enrichedEntry?.excluded_html as string) || ''
  const _cancellation_html = (enrichedEntry?.cancellation_html as string) || ''

  // Port excursions — expand compact format {id, n, pdf, img} → full format
  const rawExcursions = (enrichedEntry?.excursions || []) as Record<string, unknown>[]
  const _excursions = rawExcursions.map(ex => {
    if ('n' in ex) {
      // Compact format
      const img = (ex.img || '') as string
      const pdf = (ex.pdf || '') as string
      return {
        id: (ex.id || 0) as number,
        name: (ex.n || '') as string,
        description: '',
        pdf: pdf.startsWith('http') ? pdf : pdf ? EXC_PREFIX + pdf : '',
        image: img.startsWith('http') ? img : img ? EXC_PREFIX + img : '',
      }
    }
    return {
      id: (ex.id || 0) as number,
      name: (ex.name || '') as string,
      description: (ex.description || '') as string,
      pdf: (ex.pdf || '') as string,
      image: (ex.image || '') as string,
    }
  })

  // Flight included flag
  const _plane_included = enrichedEntry?.plane_included === true

  // Add back constant fields for client compatibility
  return NextResponse.json(
    {
      ...cruise,
      currency: 'EUR',
      active: true,
      gallery_urls: gallery,
      date_prices,
      _is_promo,
      _is_bestdeal,
      _promo_price,
      _rooms,
      _itinerary_enriched,
      _included_html,
      _excluded_html,
      _cancellation_html,
      _excursions,
      _plane_included,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  )
}
