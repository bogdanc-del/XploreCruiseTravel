#!/usr/bin/env node

/**
 * Daily Cruise Sync — fetches updated data from croaziere.net API
 *
 * Updates in cruises.json: price_from, image_url, departure_date, departure_dates
 * Stores enriched data in: cruises-enriched.json (gallery, cabin types, etc.)
 *
 * Run daily via cron: 0 4 * * * node scripts/sync-cruises-api.mjs
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

const API_KEY = 'e4315add3071b92740bf093748432bfb'
const API_BASE = 'https://www.croaziere.net/api/v1.1/'
const BATCH_SIZE = 50
const DELAY_MS = 500

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

  const cruises = JSON.parse(readFileSync(cruisesPath, 'utf8'))
  logStep(`Loaded ${cruises.length} existing cruises`)

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
    enrichedData[sourceId] = {
      gallery: apiImages,
      rooms: (api.rooms || []).map(r => ({
        name: r.name || '',
        category: r.category || '',
        date: r.date || '',
        price: Number(r.price) || 0,
      })),
      itinerary: (api.itinerary || []).map(it => ({
        id: it.id,
        name: it.name,
        day: it.day,
        from_hour: it.from_hour || '',
        till_hour: it.till_hour || '',
      })),
      is_promo: api.is_promo === 1 || api.is_promo === '1',
      is_bestdeal: api.is_bestdeal === 1 || api.is_bestdeal === '1',
      promo_price: api.price_promo ? Number(api.price_promo) : null,
    }
  }

  logStep('Merge complete:')
  logStep(`  Prices updated: ${changes.price}`)
  logStep(`  Images updated: ${changes.image}`)
  logStep(`  Departures updated: ${changes.departures}`)
  logStep(`  Not found: ${changes.notFound}`)

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
    .filter(c => c.price_from > 0)
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
}

main().catch(err => { console.error('Sync failed:', err); process.exit(1) })
