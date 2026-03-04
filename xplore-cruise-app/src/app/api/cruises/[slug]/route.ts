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
interface RoomEntry { name: string; category: string; date: string; price: number }
interface DatePrice { date: string; price_from: number; cabin_count: number }

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

  // Compute per-date minimum prices
  let date_prices: DatePrice[] = []
  if (enrichedEntry?.rooms) {
    date_prices = computeDatePrices(enrichedEntry.rooms as RoomEntry[])
  }

  // Merge enriched gallery if available and base has no gallery
  const gallery = (cruise.gallery_urls as string[])?.length
    ? cruise.gallery_urls
    : enrichedEntry?.gallery || []

  // Promo fields from enriched data
  const _is_promo = enrichedEntry?.is_promo === true
  const _is_bestdeal = enrichedEntry?.is_bestdeal === true
  const _promo_price = enrichedEntry?.promo_price ? Number(enrichedEntry.promo_price) : null

  // Rooms array from enriched data (for cabin selector)
  const _rooms = (enrichedEntry?.rooms || []) as RoomEntry[]

  // Enriched itinerary with arrival/departure times (prefer over base)
  const _itinerary_enriched = (enrichedEntry?.itinerary || []) as {
    id: string | number; name: string; day: number; from_hour: string; till_hour: string
  }[]

  // API-sourced HTML for terms (included/excluded specifics, cancellation policy)
  const _included_html = (enrichedEntry?.included_html as string) || ''
  const _excluded_html = (enrichedEntry?.excluded_html as string) || ''
  const _cancellation_html = (enrichedEntry?.cancellation_html as string) || ''

  // Port excursions from API
  const _excursions = (enrichedEntry?.excursions || []) as {
    id: number; name: string; description: string; pdf: string; image: string
  }[]

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
