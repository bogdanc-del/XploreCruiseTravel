import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from 'fs'
import { join } from 'path'
import { validateBatch, parseApiResponse } from '@/lib/sync-validation'

// ============================================================
// POST /api/sync/prices — Secure price sync from croaziere.net API
//
// Auth: requires SYNC_SECRET in Authorization header
// Flow: fetch prices from external API → validate with Zod →
//       update cruises.json + index → write sync log
//
// Returns: { status, updated, skipped, priceChanged, rejected, durationMs }
//
// Security: Never logs PRICE_API_KEY, SYNC_SECRET, or raw payloads.
// ============================================================

const API_KEY = process.env.PRICE_API_KEY || 'e4315add3071b92740bf093748432bfb'
const API_BASE = process.env.PRICE_API_URL || 'https://www.croaziere.net/api/v1.1/'
const SYNC_SECRET = process.env.SYNC_SECRET || ''
const BATCH_SIZE = 50
const DELAY_MS = 500
const MAX_RETRIES = 3

// ============================================================
// Helpers
// ============================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function parseDate(d: string): string {
  const parts = d.split('.')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  return d
}

interface ValidatedCruise {
  id: string
  price: number
  currency?: string
  images: string[]
  departures: string[]
}

async function fetchBatch(ids: string[], retryCount = 0): Promise<ValidatedCruise[]> {
  // Build URL without logging the API key
  const url = `${API_BASE}?api_key=${API_KEY}&section=cruises&output=json&ids=${ids.join(',')}`

  try {
    const res = await fetch(url)

    // Rate limiting / server error — exponential backoff
    if ((res.status === 429 || res.status >= 500) && retryCount < MAX_RETRIES) {
      const delay = DELAY_MS * Math.pow(2, retryCount)
      console.log(`[SYNC] Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms (status ${res.status})`)
      await sleep(delay)
      return fetchBatch(ids, retryCount + 1)
    }

    if (res.status !== 200) {
      throw new Error(`API returned ${res.status}`)
    }

    const data = await res.json()

    // Parse and validate with Zod
    const rawCruises = parseApiResponse(data)
    const { valid, rejected, errors: validationErrors } = validateBatch(rawCruises)

    if (rejected > 0) {
      console.warn(`[SYNC] Batch validation: ${rejected} items rejected`, validationErrors.slice(0, 3))
    }

    return valid.map(v => ({
      id: v.id,
      price: v.price ?? 0,
      currency: v.currency,
      images: v.images ?? [],
      departures: v.departures ?? [],
    }))
  } catch (err: unknown) {
    if (retryCount < MAX_RETRIES) {
      const delay = DELAY_MS * Math.pow(2, retryCount)
      const errMsg = err instanceof Error ? err.message : 'Unknown'
      console.log(`[SYNC] Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms (error: ${errMsg})`)
      await sleep(delay)
      return fetchBatch(ids, retryCount + 1)
    }
    throw err
  }
}

interface CruiseRecord {
  id?: string
  source_id?: string
  slug?: string
  title?: string
  title_ro?: string
  price_from?: number
  previous_price_from?: number | null
  price_changed_at?: string | null
  last_synced_at?: string | null
  currency?: string
  image_url?: string
  departure_date?: string
  departure_dates?: string[]
  cruise_line?: string
  ship_name?: string
  destination?: string
  destination_ro?: string
  destination_slug?: string
  cruise_type?: string
  nights?: number
  departure_port?: string
  [key: string]: unknown
}

// ============================================================
// Sync log writer — never logs sensitive data
// ============================================================

function writeSyncLog(
  logsDir: string,
  entry: Record<string, unknown>,
): void {
  try {
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true })
    const logFile = join(logsDir, 'sync-log.jsonl')
    appendFileSync(logFile, JSON.stringify(entry) + '\n')
  } catch (e) {
    console.error('[SYNC] Failed to write log:', e instanceof Error ? e.message : e)
  }
}

// ============================================================
// Main sync handler
// ============================================================

export async function POST(request: NextRequest) {
  const startedAt = new Date().toISOString()
  const startTime = Date.now()

  // Auth check
  if (!SYNC_SECRET) {
    return NextResponse.json(
      { error: 'SYNC_SECRET not configured on server' },
      { status: 500 },
    )
  }

  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()

  if (token !== SYNC_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    )
  }

  const logsDir = join(process.cwd(), 'logs')

  try {
    const dataDir = join(process.cwd(), 'public', 'data')
    const cruisesPath = join(dataDir, 'cruises.json')
    const indexPath = join(dataDir, 'cruises-index.json')

    // Load existing cruises
    const cruises: CruiseRecord[] = JSON.parse(readFileSync(cruisesPath, 'utf8'))

    // Collect all IDs
    const allIds = [...new Set(cruises.map(c => String(c.source_id || c.id)))]
    const batches: string[][] = []
    for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
      batches.push(allIds.slice(i, i + BATCH_SIZE))
    }

    // Fetch from API with Zod validation
    const apiMap = new Map<string, ValidatedCruise>()
    let fetchErrors = 0
    let totalRejected = 0
    const now = new Date().toISOString()

    for (let i = 0; i < batches.length; i++) {
      try {
        const validCruises = await fetchBatch(batches[i])
        for (const vc of validCruises) {
          apiMap.set(vc.id, vc)
        }
      } catch {
        fetchErrors++
      }
      await sleep(DELAY_MS)
    }

    // Merge — track changes
    let updated = 0
    let skipped = 0
    let priceChanged = 0

    for (const cruise of cruises) {
      const sourceId = String(cruise.source_id || cruise.id)
      const api = apiMap.get(sourceId)

      if (!api) { skipped++; continue }

      const apiPrice = api.price || 0
      const oldPrice = cruise.price_from || 0

      // Track price change — non-deceptive, only when actual change
      if (apiPrice > 0 && apiPrice !== oldPrice) {
        cruise.previous_price_from = oldPrice > 0 ? oldPrice : null
        cruise.price_changed_at = now
        cruise.price_from = apiPrice
        priceChanged++
      }

      // Update currency
      if (api.currency) cruise.currency = api.currency

      // Update image (HD from API)
      if (api.images.length > 0) {
        cruise.image_url = api.images[0]
      }

      // Update departures
      const apiDepartures = api.departures
        .map(parseDate)
        .filter((d: string) => d.match(/^\d{4}-\d{2}-\d{2}$/))
        .sort()

      if (apiDepartures.length > 0) {
        cruise.departure_date = apiDepartures[0]
        cruise.departure_dates = apiDepartures
      }

      // Mark as synced
      cruise.last_synced_at = now
      updated++
    }

    // Clean heavy fields (keep JSON lean)
    for (const cruise of cruises) {
      delete cruise.gallery_urls
      delete cruise.cabin_types
      delete cruise.included_html
      delete cruise.excluded_html
      delete cruise.cancellation_html
    }

    // Write lean cruises.json
    writeFileSync(cruisesPath, JSON.stringify(cruises, null, 0))

    // Rebuild compact index (include price tracking fields)
    const index = cruises
      .filter(c => (c.price_from || 0) > 0)
      .map(c => ({
        id: c.id || c.source_id,
        s: c.slug,
        t: c.title || c.title_ro || '',
        ct: c.cruise_type || 'ocean',
        n: c.nights || 0,
        p: c.price_from || 0,
        dp: c.departure_port || '',
        dd: c.departure_date || null,
        img: c.image_url || '',
        cl: c.cruise_line || '',
        sn: c.ship_name || '',
        d: c.destination || '',
        dr: c.destination_ro || c.destination || '',
        ds: c.destination_slug || '',
        // Price tracking fields for UI freshness labels
        pp: c.previous_price_from || null,   // previous price
        pca: c.price_changed_at || null,      // price changed at
        lsa: c.last_synced_at || null,        // last synced at
      }))
    writeFileSync(indexPath, JSON.stringify(index))

    const finishedAt = new Date().toISOString()
    const durationMs = Date.now() - startTime

    // Write sync log — NEVER log API keys or raw payloads
    writeSyncLog(logsDir, {
      status: 'success',
      started_at: startedAt,
      finished_at: finishedAt,
      durationMs,
      cruises_total: cruises.length,
      cruises_fetched: apiMap.size,
      cruises_updated: updated,
      cruises_skipped: skipped,
      cruises_price_changed: priceChanged,
      cruises_rejected: totalRejected,
      fetch_errors: fetchErrors,
    })

    return NextResponse.json({
      status: 'success',
      updated,
      skipped,
      priceChanged,
      rejected: totalRejected,
      errors: fetchErrors,
      durationMs,
    })
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime
    const errorMsg = err instanceof Error ? err.message : 'Unknown error'

    writeSyncLog(logsDir, {
      status: 'error',
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      durationMs,
      error_message: errorMsg,
    })

    return NextResponse.json(
      { status: 'error', error: errorMsg, durationMs },
      { status: 500 },
    )
  }
}
