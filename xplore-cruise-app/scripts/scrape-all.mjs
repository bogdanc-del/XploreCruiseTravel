#!/usr/bin/env node
/**
 * Croaziere.net Optimized Full Scraper
 * Extracts ALL ~8,498 cruise detail pages
 *
 * Key insight: each detail page contains a `const $_ports = [...]` JS variable
 * with structured JSON data including GPS coordinates. Combined with URL slug parsing
 * and HTML price extraction, we can get complete data efficiently.
 *
 * Usage:
 *   node scripts/scrape-all.mjs [--start N] [--limit N] [--concurrency N]
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'output')
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

// ============================================================
// Config
// ============================================================
const CONCURRENCY = 8
const DELAY_BETWEEN_BATCHES = 150
const TIMEOUT = 25000
const SAVE_EVERY = 200
const MAX_RETRIES = 2

// ============================================================
// Args
// ============================================================
const args = process.argv.slice(2)
function getArg(name, def) {
  const idx = args.indexOf(`--${name}`)
  return idx >= 0 ? parseInt(args[idx + 1]) : def
}
const START = getArg('start', 0)
const LIMIT = getArg('limit', 0)
const CONCURRENCY_ARG = getArg('concurrency', CONCURRENCY)

// ============================================================
// Utils
// ============================================================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchPage(url) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'ro-RO,ro;q=0.9',
        },
        redirect: 'follow',
      })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err
      await sleep(1000 * attempt)
    }
  }
}

function saveJSON(filename, data) {
  const path = join(OUTPUT_DIR, filename)
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
  const sizeMB = (Buffer.byteLength(JSON.stringify(data), 'utf-8') / 1024 / 1024).toFixed(2)
  return `${path} (${sizeMB} MB)`
}

function loadJSON(filename) {
  const path = join(OUTPUT_DIR, filename)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf-8'))
}

// ============================================================
// URL Slug Parser
// Extract structured data directly from the URL pattern:
// /croaziere/croaziera-{YEAR}-{DESTINATION}-{PORT}-{CRUISELINE}-{SHIP}-{NIGHTS}-nopti-i{ID}/
// ============================================================
function parseSlug(url) {
  const data = {}

  // Extract ID
  const idMatch = url.match(/-i(\d+)\/?$/)
  if (idMatch) data.source_id = parseInt(idMatch[1])

  // Extract year
  const yearMatch = url.match(/croaziera-(\d{4})-/)
  if (yearMatch) data.year = parseInt(yearMatch[1])

  // Extract nights
  const nightsMatch = url.match(/(\d+)-nopti-i/)
  if (nightsMatch) data.nights = parseInt(nightsMatch[1])

  data.source_url = url
  return data
}

// ============================================================
// Detail Page Parser
// ============================================================
function parseCruisePage(html, url) {
  const cruise = parseSlug(url)

  // 1. TITLE from <h1>
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1) cruise.title = h1[1].replace(/<[^>]+>/g, '').trim()

  // 2. HEADER TITLE area (ship name is separate)
  const headerTitle = html.match(/<[^>]*class="[^"]*header-title-cruises[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (headerTitle) {
    const lines = headerTitle[1].replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(Boolean)
    if (lines[0] && !lines[0].includes('Croaziera')) cruise.ship_name = lines[0]
  }

  // 3. Extract from title: destination, cruise line, ship, port
  if (cruise.title) {
    // Pattern: Croaziera YEAR - DESTINATION (PORT) - CRUISELINE - SHIP - N nopti
    const parts = cruise.title.split(' - ')
    if (parts.length >= 4) {
      // Destination (may include port in parens)
      const destPart = parts[1]?.trim()
      if (destPart) {
        const portInParens = destPart.match(/\(([^)]+)\)/)
        cruise.destination = destPart.replace(/\s*\([^)]+\)/, '').trim()
        if (portInParens) cruise.departure_port = portInParens[1].trim()
      }
      // Cruise line
      cruise.cruise_line = parts[2]?.trim()
      // Ship (may have " - N nopti" at end)
      const shipPart = parts[3]?.trim()
      if (shipPart) cruise.ship_name = shipPart.replace(/\s*-\s*\d+\s*nop.*$/i, '').trim()
    }
  }

  // 4. PORTS from $_ports JavaScript variable
  const portsMatch = html.match(/\$_ports\s*=\s*(\[[\s\S]*?\]);/)
  if (portsMatch) {
    try {
      const decoded = portsMatch[1]
        .replace(/\\u003C/g, '<').replace(/\\u003E/g, '>')
        .replace(/\\\//g, '/')
      cruise.itinerary = JSON.parse(decoded).map(p => ({
        day: p.day,
        port: p.title,
        port_id: p.id_port,
        arrival: p.from_hour || null,
        departure: p.till_hour || null,
        lat: p.map_x,
        lng: p.map_y,
        port_url: p.url,
      }))
      // Extract ports of call (exclude "Pe mare" / "At sea" days)
      cruise.ports_of_call = cruise.itinerary
        .filter(p => p.port && !p.port.toLowerCase().includes('pe mare') && !p.port.toLowerCase().includes('at sea'))
        .map(p => p.port)
      // Set departure port from first itinerary entry if not already set
      if (!cruise.departure_port && cruise.itinerary.length > 0) {
        cruise.departure_port = cruise.itinerary[0].port
      }
    } catch (e) {
      // Silently fail
    }
  }

  // 5. PRICES - cabin types
  cruise.cabin_types = []
  const cabinPriceRegex = /<[^>]*class="[^"]*cabina-price[^"]*"[^>]*>([^<]*\d[\d.,]*[^<]*)<\/[^>]+>/gi
  let cpMatch
  while ((cpMatch = cabinPriceRegex.exec(html)) !== null) {
    const text = cpMatch[1].trim()
    const priceNum = text.match(/([\d.,]+)\s*€/)
    if (priceNum) {
      const price = parseFloat(priceNum[1].replace(/\./g, '').replace(',', '.'))
      cruise.cabin_types.push({ price_from: price })
    }
  }

  // Get cabin names from the cruise-cabin-card structure
  // Look for cabin category names near the prices
  const cabinNameRegex = /class="[^"]*cabin[^"]*card[^"]*"[^>]*>[\s\S]*?<(?:h\d|strong|b|span)[^>]*class="[^"]*(?:title|name)[^"]*"[^>]*>([^<]+)/gi
  const cabinNames = []
  let cnMatch
  while ((cnMatch = cabinNameRegex.exec(html)) !== null) {
    cabinNames.push(cnMatch[1].trim())
  }

  // Try alternate cabin extraction - look for select options
  if (cruise.cabin_types.length === 0) {
    const selectMatch = html.match(/id="select_cabin"[^>]*>([\s\S]*?)<\/select>/i) ||
                        html.match(/name="[^"]*cabin[^"]*"[^>]*>([\s\S]*?)<\/select>/i)
    if (selectMatch) {
      const optRegex = /<option[^>]*value="([^"]*)"[^>]*>([^<]+)/gi
      let optMatch
      while ((optMatch = optRegex.exec(selectMatch[1])) !== null) {
        const name = optMatch[2].trim()
        if (name && name !== 'Tip cabina' && name !== 'Alege') {
          cruise.cabin_types.push({ name, cabin_code: optMatch[1] })
        }
      }
    }
  }

  // 6. MAIN PRICE
  const mainPrice = html.match(/class="[^"]*price[^"]*"[^>]*>[\s]*?([\d.,]+)\s*€/i)
  if (mainPrice) {
    cruise.price_from = parseFloat(mainPrice[1].replace(/\./g, '').replace(',', '.'))
  }
  // Fallback: get lowest cabin price
  if (!cruise.price_from && cruise.cabin_types.length > 0) {
    const prices = cruise.cabin_types.filter(c => c.price_from > 0).map(c => c.price_from)
    if (prices.length > 0) cruise.price_from = Math.min(...prices)
  }
  cruise.currency = 'EUR'

  // 7. DEPARTURE DATES
  cruise.departure_dates = []
  const datesSection = html.match(/<[^>]*class="[^"]*all-cruise-dates[^"]*"[^>]*>([\s\S]*?)(?=<\/div>)/i)
  if (datesSection) {
    const dateRegex = /(\d{1,2}\s+\w+\s+\d{4})/g
    let dMatch
    while ((dMatch = dateRegex.exec(datesSection[1])) !== null) {
      cruise.departure_dates.push(dMatch[1])
    }
  }
  // Also try select_date options
  const dateSelect = html.match(/id="select_date"[^>]*>([\s\S]*?)<\/select>/i)
  if (dateSelect) {
    const dateOptRegex = /<option[^>]*value="([^"]*)"[^>]*>([^<]+)/gi
    let doMatch
    while ((doMatch = dateOptRegex.exec(dateSelect[1])) !== null) {
      const dateStr = doMatch[2].trim()
      if (dateStr && dateStr !== 'Data imbarcare' && dateStr !== 'Alege') {
        if (!cruise.departure_dates.includes(dateStr)) cruise.departure_dates.push(dateStr)
      }
    }
  }

  // 8. IMAGES
  cruise.images = []
  const imgRegex = /src="(https:\/\/www\.croaziere\.net\/uploads\/images\/[^"]+)"/gi
  let imgMatch
  const seenImgs = new Set()
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const imgUrl = imgMatch[1]
    if (!seenImgs.has(imgUrl)) {
      seenImgs.add(imgUrl)
      cruise.images.push(imgUrl)
    }
  }
  if (cruise.images.length > 0) cruise.image_url = cruise.images[0]

  // 9. META DESCRIPTION
  const metaDesc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
  if (metaDesc) cruise.description = metaDesc[1]

  return cruise
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║  Croaziere.net FULL Scraper v2           ║')
  console.log('║  Extracting ALL cruise detail pages      ║')
  console.log('╚══════════════════════════════════════════╝\n')

  // Load URLs from sitemap
  let allUrls = loadJSON('sitemap-detail-urls.json')
  if (!allUrls) {
    console.log('Fetching sitemap.xml...')
    const xml = await fetchPage('https://www.croaziere.net/sitemap.xml')
    allUrls = []
    const locRegex = /<loc>([^<]+)<\/loc>/g
    let m
    while ((m = locRegex.exec(xml)) !== null) {
      if (/-i\d+\//.test(m[1])) allUrls.push(m[1])
    }
    saveJSON('sitemap-detail-urls.json', allUrls)
    console.log(`Found ${allUrls.length} detail URLs`)
  } else {
    console.log(`Loaded ${allUrls.length} detail URLs from cache`)
  }

  // Apply start/limit
  let urls = allUrls
  if (START > 0) urls = urls.slice(START)
  if (LIMIT > 0) urls = urls.slice(0, LIMIT)
  console.log(`Processing ${urls.length} URLs (start: ${START}, limit: ${LIMIT || 'all'})\n`)

  // Resume support
  const progressFile = 'scrape-progress.json'
  const existingProgress = loadJSON(progressFile)
  const scrapedMap = new Map()
  if (existingProgress) {
    for (const c of existingProgress) {
      scrapedMap.set(c.source_url, c)
    }
    console.log(`Resuming: ${scrapedMap.size} already scraped`)
  }

  const remaining = urls.filter(u => !scrapedMap.has(u))
  console.log(`Remaining to scrape: ${remaining.length}`)

  const startTime = Date.now()
  let errors = 0
  let batchCount = 0

  for (let i = 0; i < remaining.length; i += CONCURRENCY_ARG) {
    const batch = remaining.slice(i, i + CONCURRENCY_ARG)

    const results = await Promise.allSettled(
      batch.map(async url => {
        try {
          const html = await fetchPage(url)
          return parseCruisePage(html, url)
        } catch (err) {
          errors++
          return { source_url: url, error: err.message }
        }
      })
    )

    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) {
        scrapedMap.set(r.value.source_url, r.value)
      }
    }

    batchCount++
    const done = Math.min(i + CONCURRENCY_ARG, remaining.length)
    const totalDone = scrapedMap.size
    const elapsed = (Date.now() - startTime) / 1000
    const rate = done / elapsed
    const eta = remaining.length > done ? ((remaining.length - done) / rate / 60).toFixed(1) : 0

    if (done % 50 < CONCURRENCY_ARG || done >= remaining.length) {
      console.log(
        `  [${totalDone}/${urls.length}] ` +
        `${((totalDone / urls.length) * 100).toFixed(1)}% | ` +
        `${rate.toFixed(1)} pages/s | ` +
        `ETA: ${eta}m | ` +
        `Errors: ${errors}`
      )
    }

    // Save progress periodically
    if (done % SAVE_EVERY < CONCURRENCY_ARG || done >= remaining.length) {
      const all = [...scrapedMap.values()]
      saveJSON(progressFile, all)
    }

    if (i + CONCURRENCY_ARG < remaining.length) await sleep(DELAY_BETWEEN_BATCHES)
  }

  // Final save
  const allCruises = [...scrapedMap.values()].filter(c => !c.error)
  const failedCruises = [...scrapedMap.values()].filter(c => c.error)

  console.log('\n═══════════════════════════════════════')
  console.log('              RESULTS')
  console.log('═══════════════════════════════════════')
  console.log(`Total scraped: ${allCruises.length}`)
  console.log(`Failed: ${failedCruises.length}`)
  console.log(`Time: ${((Date.now() - startTime) / 1000 / 60).toFixed(1)} minutes`)

  // Stats
  const withItinerary = allCruises.filter(c => c.itinerary?.length > 0)
  const withPrices = allCruises.filter(c => c.price_from > 0)
  const withImages = allCruises.filter(c => c.images?.length > 0)
  const withDates = allCruises.filter(c => c.departure_dates?.length > 0)

  console.log(`\nWith itinerary: ${withItinerary.length} (${(withItinerary.length/allCruises.length*100).toFixed(0)}%)`)
  console.log(`With prices: ${withPrices.length} (${(withPrices.length/allCruises.length*100).toFixed(0)}%)`)
  console.log(`With images: ${withImages.length} (${(withImages.length/allCruises.length*100).toFixed(0)}%)`)
  console.log(`With dates: ${withDates.length} (${(withDates.length/allCruises.length*100).toFixed(0)}%)`)

  // Unique stats
  const cruiseLines = new Set(allCruises.map(c => c.cruise_line).filter(Boolean))
  const ships = new Set(allCruises.map(c => c.ship_name).filter(Boolean))
  const destinations = new Set(allCruises.map(c => c.destination).filter(Boolean))
  const ports = new Set()
  allCruises.forEach(c => c.ports_of_call?.forEach(p => ports.add(p)))

  console.log(`\nCruise lines: ${cruiseLines.size}`)
  console.log(`Ships: ${ships.size}`)
  console.log(`Destinations: ${destinations.size}`)
  console.log(`Unique ports: ${ports.size}`)

  // Save final files
  const mainFile = saveJSON('cruises-all.json', allCruises)
  console.log(`\nMain output: ${mainFile}`)

  if (failedCruises.length > 0) {
    saveJSON('cruises-failed.json', failedCruises)
  }

  // Save reference data
  saveJSON('ref-cruise-lines.json', [...cruiseLines].sort())
  saveJSON('ref-ships.json', [...ships].sort())
  saveJSON('ref-destinations.json', [...destinations].sort())
  saveJSON('ref-ports.json', [...ports].sort())

  console.log('\n✅ Scraping complete!')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
