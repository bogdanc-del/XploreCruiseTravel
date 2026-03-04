#!/usr/bin/env node

/**
 * Daily Cruise Sync — fetches updated data from croaziere.net API
 *
 * Updates in cruises.json: price_from, image_url, departure_date, departure_dates
 * Stores enriched data in: cruises-enriched.json (gallery, cabin types, etc.)
 *
 * Runs automatically via GitHub Actions daily at 04:00 UTC (07:00 EET).
 * Can also be run manually: node scripts/sync-cruises-api.mjs
 *
 * Environment variables (optional — has defaults):
 *   PRICE_API_KEY  — croaziere.net API key
 *   PRICE_API_URL  — API base URL
 *   SKIP_ROUTE_MAPS — set to 'true' to skip route map generation
 *
 * Strategy:
 * 1. Load existing cruise IDs from cruises.json
 * 2. Batch-fetch from API (50 IDs per request)
 * 3. Update core fields in cruises.json (price, image, departures)
 * 4. Store enriched data (gallery, rooms, HTML) in separate file
 * 5. Rebuild cruises-index.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const API_KEY = process.env.PRICE_API_KEY || 'e4315add3071b92740bf093748432bfb'
const API_BASE = process.env.PRICE_API_URL || 'https://www.croaziere.net/api/v1.1/'
const BATCH_SIZE = 50
const DELAY_MS = 500
const SKIP_ROUTE_MAPS = process.env.SKIP_ROUTE_MAPS === 'true'
const MIN_NIGHTS = 3  // Skip cruises with fewer than 3 nights (no business value)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function logStep(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

async function fetchBatch(ids) {
  const url = `${API_BASE}?api_key=${API_KEY}&section=cruises&output=json&ids=${ids.join(',')}`
  const res = await fetch(url)
  if (res.status !== 200) throw new Error(`API returned ${res.status}`)
  const data = await res.json()
  const resp = data.response || data
  return resp.cruises || []
}

// Parse DD.MM.YYYY → YYYY-MM-DD
function parseDate(d) {
  const parts = d.split('.')
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  }
  return d
}

async function main() {
  const startTime = Date.now()
  logStep('Starting cruise data sync from croaziere.net API')

  const cruisesPath = join(ROOT, 'public', 'data', 'cruises.json')
  const indexPath = join(ROOT, 'public', 'data', 'cruises-index.json')
  const enrichedPath = join(ROOT, 'public', 'data', 'cruises-enriched.json')

  let cruises = JSON.parse(readFileSync(cruisesPath, 'utf8'))
  logStep(`Loaded ${cruises.length} existing cruises`)

  // Filter out short cruises (1-2 nights) — no business value for repositioning cruises
  const beforeFilter = cruises.length
  cruises = cruises.filter(c => (c.nights || 0) >= MIN_NIGHTS)
  const shortRemoved = beforeFilter - cruises.length
  if (shortRemoved > 0) {
    logStep(`Filtered out ${shortRemoved} cruises with fewer than ${MIN_NIGHTS} nights (${cruises.length} remaining)`)
  }

  // Collect all IDs
  const allIds = [...new Set(cruises.map(c => String(c.source_id || c.id)))]
  const batches = []
  for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
    batches.push(allIds.slice(i, i + BATCH_SIZE))
  }
  logStep(`Fetching ${allIds.length} IDs in ${batches.length} batches`)

  // Fetch all from API
  const apiMap = new Map()
  let errors = 0

  for (let i = 0; i < batches.length; i++) {
    try {
      const apiCruises = await fetchBatch(batches[i])
      for (const ac of apiCruises) apiMap.set(String(ac.id), ac)
      if ((i + 1) % 20 === 0 || i === batches.length - 1) {
        logStep(`[${i + 1}/${batches.length}] ${apiMap.size} cruises fetched`)
      }
    } catch (err) {
      logStep(`[${i + 1}/${batches.length}] ERROR: ${err.message}`)
      errors++
    }
    await sleep(DELAY_MS)
  }

  logStep(`API fetch complete: ${apiMap.size} cruises, ${errors} errors`)

  // Merge into cruises.json — ONLY update lightweight fields
  const changes = { price: 0, image: 0, departures: 0, notFound: 0 }
  const enrichedData = {} // keyed by source_id

  for (const cruise of cruises) {
    const sourceId = String(cruise.source_id || cruise.id)
    const api = apiMap.get(sourceId)

    if (!api) { changes.notFound++; continue }

    // --- Core fields update (stays in cruises.json) ---

    // Price
    const apiPrice = Number(api.price) || 0
    if (apiPrice > 0 && apiPrice !== cruise.price_from) {
      cruise.price_from = apiPrice
      changes.price++
    }
    if (api.currency) cruise.currency = api.currency

    // Image — use first API image (HD)
    const apiImages = api.images || []
    if (apiImages.length > 0 && cruise.image_url !== apiImages[0]) {
      cruise.image_url = apiImages[0]
      changes.image++
    }

    // Departure dates
    const apiDepartures = (api.departures || [])
      .map(parseDate)
      .filter(d => d.match(/^\d{4}-\d{2}-\d{2}$/))
      .sort()

    if (apiDepartures.length > 0) {
      cruise.departure_date = apiDepartures[0]
      cruise.departure_dates = apiDepartures
      changes.departures++
    }

    // --- Enriched data (separate file, loaded on-demand by detail page) ---
    // Uses compact format to keep file under 100 MB:
    //   rooms: [{n, c, dp: [[date, price], ...]}]  (grouped by name+category)
    //   itinerary: [{d, p, a, t}]  (day, port, arrival, till)
    //   gallery: stripped of common URL prefix
    //   excursions: [{id, n, pdf, img}]  (no description, stripped URL prefix)
    const GALLERY_PREFIX = 'https://www.croaziere.net/uploads/images/'
    const EXC_PREFIX = 'https://www.croaziere.net'

    // Strip inline CSS from HTML
    const stripStyles = (html) => {
      if (!html) return ''
      return html
        .replace(/\s*style="[^"]*"/gi, '')
        .replace(/\s*class="[^"]*"/gi, '')
        .replace(/\s*(?:width|height|border|cellspacing|cellpadding|align|valign)="[^"]*"/gi, '')
        .replace(/<\/?font[^>]*>/gi, '')
        .replace(/<span\s*>(.*?)<\/span>/gi, '$1')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/<p\s*>\s*<\/p>/gi, '')
        .replace(/<li\s*>\s*<\/li>/gi, '')
        .trim()
    }

    // Compact rooms: group by name+category
    const roomGroups = new Map()
    for (const r of (api.rooms || [])) {
      const price = Number(r.price) || 0
      if (!r.date || price <= 0) continue
      const gk = `${r.name || ''}|${r.category || ''}`
      if (!roomGroups.has(gk)) roomGroups.set(gk, { n: r.name || '', c: r.category || '', dp: [] })
      roomGroups.get(gk).dp.push([r.date, price])
    }

    // Strip gallery URL prefix
    const compactGallery = apiImages.map(url =>
      url.startsWith(GALLERY_PREFIX) ? url.substring(GALLERY_PREFIX.length) : url
    )

    // Build enriched entry, omit falsy/empty fields to save space
    const entry = {}
    if (compactGallery.length) entry.gallery = compactGallery
    if (roomGroups.size) entry.rooms = Array.from(roomGroups.values())

    const compactItin = (api.itinerary || []).map(it => {
      const ci = { d: it.day, p: it.name || '' }
      if (it.from_hour) ci.a = it.from_hour
      if (it.till_hour) ci.t = it.till_hour
      return ci
    })
    if (compactItin.length) entry.itinerary = compactItin

    if (api.is_promo === 1 || api.is_promo === '1') entry.is_promo = true
    if (api.is_bestdeal === 1 || api.is_bestdeal === '1') entry.is_bestdeal = true
    if (api.price_promo) entry.promo_price = Number(api.price_promo)

    const inclHtml = stripStyles(api.included || '')
    const exclHtml = stripStyles(api.not_included || api.excluded || '')
    const cancelHtml = stripStyles(api.cancelation || api.cancellation || '')
    if (inclHtml) entry.included_html = inclHtml
    if (exclHtml) entry.excluded_html = exclHtml
    if (cancelHtml) entry.cancellation_html = cancelHtml

    const compactExc = (api.excursions || []).filter(ex => ex.name).map(ex => {
      const ce = { id: ex.id }
      if (ex.name) ce.n = ex.name
      const pdf = ex.pdf || ''
      const img = ex.image || ''
      if (pdf) ce.pdf = pdf.startsWith(EXC_PREFIX) ? pdf.substring(EXC_PREFIX.length) : pdf
      if (img) ce.img = img.startsWith(EXC_PREFIX) ? img.substring(EXC_PREFIX.length) : img
      return ce
    })
    if (compactExc.length) entry.excursions = compactExc

    if (api.plane_included === 1 || api.plane_included === '1') entry.plane_included = true

    enrichedData[sourceId] = entry
  }

  logStep('Merge complete:')
  logStep(`  Prices updated: ${changes.price}`)
  logStep(`  Images updated: ${changes.image}`)
  logStep(`  Departures updated: ${changes.departures}`)
  logStep(`  Not found in API: ${changes.notFound}`)

  // Remove cruises that no longer exist in the API (expired/discontinued)
  const beforeCount = cruises.length
  const activeCruises = cruises.filter(c => {
    const sourceId = String(c.source_id || c.id)
    return apiMap.has(sourceId)
  })
  const removedCount = beforeCount - activeCruises.length
  if (removedCount > 0) {
    logStep(`  Removed ${removedCount} expired cruises not found in API`)
    // Replace the cruises array content
    cruises.length = 0
    cruises.push(...activeCruises)
  }

  // Remove heavy fields from cruises.json to keep it lean (<100MB)
  for (const cruise of cruises) {
    delete cruise.gallery_urls
    delete cruise.cabin_types
    delete cruise.included_html
    delete cruise.excluded_html
    delete cruise.cancellation_html
    delete cruise.promo_price
    delete cruise.is_promo
    delete cruise.is_bestdeal
  }

  // Write cruises.json (lean)
  logStep('Writing cruises.json (lean)...')
  writeFileSync(cruisesPath, JSON.stringify(cruises, null, 0))
  const cruiseSize = (readFileSync(cruisesPath).length / 1024 / 1024).toFixed(1)
  logStep(`  cruises.json: ${cruiseSize} MB`)

  // Write enriched data (for detail page)
  logStep('Writing cruises-enriched.json...')
  writeFileSync(enrichedPath, JSON.stringify(enrichedData, null, 0))
  const enrichedSize = (readFileSync(enrichedPath).length / 1024 / 1024).toFixed(1)
  logStep(`  cruises-enriched.json: ${enrichedSize} MB`)

  // Rebuild compact index
  logStep('Rebuilding cruises-index.json...')
  const index = cruises
    .filter(c => c.price_from > 0 && (c.nights || 0) >= MIN_NIGHTS)
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
      // Promo fields (from enriched data)
      ...(enrichedData[String(c.source_id || c.id)]?.is_promo ? { ip: true } : {}),
      ...(enrichedData[String(c.source_id || c.id)]?.is_bestdeal ? { ib: true } : {}),
      ...(enrichedData[String(c.source_id || c.id)]?.promo_price ? { ppr: enrichedData[String(c.source_id || c.id)].promo_price } : {}),
    }))
  writeFileSync(indexPath, JSON.stringify(index))
  const indexSize = (readFileSync(indexPath).length / 1024 / 1024).toFixed(1)
  logStep(`  cruises-index.json: ${indexSize} MB`)

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  logStep(`Sync complete in ${elapsed}s`)

  // Write log
  const logDir = join(ROOT, 'logs')
  if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })
  const logEntry = JSON.stringify({
    timestamp: new Date().toISOString(),
    duration: Number(elapsed),
    cruises: cruises.length,
    fetched: apiMap.size,
    changes,
  }) + '\n'
  const logFile = join(logDir, 'sync-log.jsonl')
  if (existsSync(logFile)) {
    writeFileSync(logFile, readFileSync(logFile, 'utf8') + logEntry)
  } else {
    writeFileSync(logFile, logEntry)
  }
  logStep(`Log written to ${logFile}`)

  // Generate route map images for cruises that don't have one yet
  const hasChanges = changes.price > 0 || changes.image > 0 || changes.departures > 0
  if (hasChanges && !SKIP_ROUTE_MAPS) {
    logStep('Generating route map images for new/updated cruises...')
    try {
      const { execSync } = await import('child_process')
      execSync('node scripts/generate-route-maps.mjs', {
        cwd: ROOT,
        stdio: 'inherit',
        timeout: 600_000, // 10 min max
      })
      logStep('Route map generation complete')
    } catch (err) {
      logStep(`Route map generation failed (non-fatal): ${err.message}`)
    }
  } else if (SKIP_ROUTE_MAPS) {
    logStep('Route map generation skipped (SKIP_ROUTE_MAPS=true)')
  }
}

main().catch(err => { console.error('Sync failed:', err); process.exit(1) })
