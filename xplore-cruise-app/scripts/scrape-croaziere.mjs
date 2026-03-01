#!/usr/bin/env node
/**
 * Croaziere.net Full Scraper
 * Extracts ALL cruise data from croaziere.net
 *
 * Strategy:
 *   Phase 1: Fetch sitemap.xml → get all cruise detail URLs
 *   Phase 2: Scrape listing pages → basic cruise data (fast)
 *   Phase 3: Scrape detail pages → full itinerary, cabins, prices
 *
 * Usage:
 *   node scripts/scrape-croaziere.mjs [--phase 1|2|3|all] [--concurrency 5] [--resume]
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = join(__dirname, 'output')

// Ensure output dir exists
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

// ============================================================
// Config
// ============================================================

const BASE_URL = 'https://croaziere.net'
const CONCURRENCY = 5
const DELAY_MS = 200 // delay between batches
const RETRY_COUNT = 3
const RETRY_DELAY_MS = 2000

// ============================================================
// Utilities
// ============================================================

async function fetchWithRetry(url, retries = RETRY_COUNT) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30s timeout
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ro-RO,ro;q=0.9,en;q=0.8',
        }
      })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (err) {
      if (attempt === retries) throw err
      console.warn(`  Retry ${attempt}/${retries} for ${url}: ${err.message}`)
      await sleep(RETRY_DELAY_MS * attempt)
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processBatch(urls, processor, concurrency = CONCURRENCY) {
  const results = []
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchResults = await Promise.allSettled(
      batch.map(url => processor(url))
    )
    for (const r of batchResults) {
      if (r.status === 'fulfilled' && r.value) results.push(r.value)
    }
    if (i + concurrency < urls.length) await sleep(DELAY_MS)
    // Progress
    const done = Math.min(i + concurrency, urls.length)
    if (done % 50 === 0 || done === urls.length) {
      console.log(`  Progress: ${done}/${urls.length} (${((done/urls.length)*100).toFixed(1)}%)`)
    }
  }
  return results
}

function saveJSON(filename, data) {
  const path = join(OUTPUT_DIR, filename)
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`Saved ${path} (${(JSON.stringify(data).length / 1024 / 1024).toFixed(2)} MB)`)
}

function loadJSON(filename) {
  const path = join(OUTPUT_DIR, filename)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf-8'))
}

// ============================================================
// Phase 1: Sitemap
// ============================================================

async function phase1_sitemap() {
  console.log('\n=== PHASE 1: Fetching Sitemap ===\n')

  const sitemapUrl = `${BASE_URL}/sitemap.xml`
  console.log(`Fetching ${sitemapUrl}...`)
  const xml = await fetchWithRetry(sitemapUrl)

  // Extract all <loc> URLs that are cruise detail pages
  // Pattern: /croaziere/some-slug-i12345/
  const urlRegex = /<loc>(https?:\/\/croaziere\.net\/croaziere\/[^<]+)<\/loc>/g
  const allUrls = []
  let match
  while ((match = urlRegex.exec(xml)) !== null) {
    allUrls.push(match[1])
  }

  // Separate listing pages from detail pages
  // Detail pages have a slug with -i followed by digits at the end
  const detailUrls = allUrls.filter(u => /-i\d+\/$/.test(u))
  const otherUrls = allUrls.filter(u => !/-i\d+\/$/.test(u))

  // Also extract listing page URLs (paginated)
  const listingRegex = /<loc>(https?:\/\/croaziere\.net\/croaziere\/\d+\/)<\/loc>/g
  const listingUrls = []
  let lMatch
  while ((lMatch = listingRegex.exec(xml)) !== null) {
    listingUrls.push(lMatch[1])
  }

  console.log(`Total URLs in sitemap: ${allUrls.length}`)
  console.log(`Detail page URLs: ${detailUrls.length}`)
  console.log(`Listing page URLs: ${listingUrls.length}`)
  console.log(`Other URLs: ${otherUrls.length}`)

  // Extract IDs from detail URLs
  const detailData = detailUrls.map(url => {
    const idMatch = url.match(/-i(\d+)\/$/)
    const slugMatch = url.match(/\/croaziere\/(.+)\/$/)
    return {
      url,
      id: idMatch ? parseInt(idMatch[1]) : 0,
      slug: slugMatch ? slugMatch[1] : '',
    }
  })

  saveJSON('sitemap-urls.json', {
    total: allUrls.length,
    detail_count: detailUrls.length,
    listing_count: listingUrls.length,
    details: detailData,
    listings: listingUrls,
  })

  return { detailData, listingUrls }
}

// ============================================================
// Phase 2: Listing Pages
// ============================================================

function parseListingPage(html) {
  const cruises = []

  // Each cruise on listing page is in a card/block. Let's find them by patterns.
  // Look for cruise card patterns - typically wrapped in a container

  // Try to find all cruise card links
  // Pattern: <a href="/croaziere/SLUG-iNUM/" ...>
  const cardRegex = /<div[^>]*class="[^"]*cruise[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*cruise[^"]*"|$)/gi

  // Alternative: find individual cruise entries by their links + price
  // Look for structure: title, ship, price, nights, departure
  const blockPattern = /<a[^>]*href="(\/croaziere\/[^"]*-i(\d+)\/)"[^>]*>([\s\S]*?)(?=<a[^>]*href="\/croaziere\/[^"]*-i\d+\/"|<\/main|<footer)/gi

  let blockMatch
  while ((blockMatch = blockPattern.exec(html)) !== null) {
    const [, href, id, content] = blockMatch
    const cruise = { id: parseInt(id), url: BASE_URL + href }

    // Extract title - usually in h2 or h3 or strong
    const titleMatch = content.match(/<h[23][^>]*>([^<]+)<\/h[23]>/i) ||
                       content.match(/<strong[^>]*>([^<]+)<\/strong>/i)
    if (titleMatch) cruise.title = titleMatch[1].trim()

    // Extract price
    const priceMatch = content.match(/(\d[\d.,]+)\s*(?:€|EUR)/i) ||
                       content.match(/de la[^<]*?(\d[\d.,]+)/i)
    if (priceMatch) cruise.price_from = parseFloat(priceMatch[1].replace(/[.,](\d{2})$/, '.$1').replace(/[.,]/g, ''))

    // Extract nights
    const nightsMatch = content.match(/(\d+)\s*nop/i)
    if (nightsMatch) cruise.nights = parseInt(nightsMatch[1])

    // Extract ship name
    const shipMatch = content.match(/vas[^:]*:\s*([^<\n]+)/i) ||
                      content.match(/<span[^>]*class="[^"]*ship[^"]*"[^>]*>([^<]+)/i)
    if (shipMatch) cruise.ship_name = shipMatch[1].trim()

    if (cruise.title || cruise.price_from) cruises.push(cruise)
  }

  return cruises
}

async function phase2_listings(listingUrls) {
  console.log('\n=== PHASE 2: Scraping Listing Pages ===\n')

  // If no listing URLs from sitemap, generate them
  if (!listingUrls || listingUrls.length === 0) {
    console.log('Generating listing page URLs (1-849)...')
    listingUrls = []
    for (let i = 1; i <= 849; i++) {
      listingUrls.push(`${BASE_URL}/croaziere/${i}/`)
    }
  }

  console.log(`Scraping ${listingUrls.length} listing pages...`)

  // Check for resume
  const existing = loadJSON('listings-progress.json')
  const scraped = existing ? new Set(existing.scraped) : new Set()
  const allCruises = existing ? existing.cruises : []

  const toScrape = listingUrls.filter(u => !scraped.has(u))
  console.log(`Remaining to scrape: ${toScrape.length} pages`)

  let processed = 0
  for (let i = 0; i < toScrape.length; i += CONCURRENCY) {
    const batch = toScrape.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map(async url => {
        try {
          const html = await fetchWithRetry(url)
          const cruises = parseListingPage(html)
          return { url, cruises }
        } catch (err) {
          console.warn(`  Failed: ${url} - ${err.message}`)
          return { url, cruises: [] }
        }
      })
    )

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        scraped.add(r.value.url)
        allCruises.push(...r.value.cruises)
      }
    }

    processed += batch.length
    if (processed % 50 === 0 || processed >= toScrape.length) {
      console.log(`  Progress: ${scraped.size}/${listingUrls.length} pages, ${allCruises.length} cruises found`)
      // Save progress
      saveJSON('listings-progress.json', {
        scraped: [...scraped],
        cruises: allCruises,
      })
    }

    await sleep(DELAY_MS)
  }

  // Deduplicate by ID
  const uniqueMap = new Map()
  for (const c of allCruises) {
    if (c.id && !uniqueMap.has(c.id)) uniqueMap.set(c.id, c)
  }
  const unique = [...uniqueMap.values()]
  console.log(`\nTotal unique cruises from listings: ${unique.length}`)

  saveJSON('listings-cruises.json', unique)
  return unique
}

// ============================================================
// Phase 3: Detail Pages
// ============================================================

function parseDetailPage(html, url) {
  const cruise = { source_url: url }

  // Extract ID from URL
  const idMatch = url.match(/-i(\d+)\/$/)
  if (idMatch) cruise.source_id = parseInt(idMatch[1])

  // Title - usually in h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) cruise.title = h1Match[1].replace(/<[^>]+>/g, '').trim()

  // Cruise line - look for "Linie:" or cruise line patterns
  const lineMatch = html.match(/(?:Linie|Companie)[^:]*:\s*<[^>]*>([^<]+)/i) ||
                    html.match(/class="[^"]*cruise-?line[^"]*"[^>]*>([^<]+)/i) ||
                    html.match(/(?:MSC|Costa|Royal Caribbean|Norwegian|Celebrity|Viking|Silversea|Cunard|Princess|Holland America|Carnival|Disney|Regent|Seabourn|Oceania|Ponant|Windstar|Azamara|Hurtigruten|AIDA|P&O|Virgin Voyages|Explora)[^<]*/i)
  if (lineMatch) cruise.cruise_line = (lineMatch[1] || lineMatch[0]).trim()

  // Ship name - look for "Vas:" or ship name patterns
  const shipMatch = html.match(/(?:Vas|Nava|Ship)[^:]*:\s*<[^>]*>([^<]+)/i) ||
                    html.match(/class="[^"]*ship[_-]?name[^"]*"[^>]*>([^<]+)/i)
  if (shipMatch) cruise.ship_name = shipMatch[1].trim()

  // Destination
  const destMatch = html.match(/(?:Destinatie|Destination)[^:]*:\s*<[^>]*>([^<]+)/i)
  if (destMatch) cruise.destination = destMatch[1].trim()

  // Nights / Duration
  const nightsMatch = html.match(/(\d+)\s*(?:nopti|nights|noapte)/i)
  if (nightsMatch) cruise.nights = parseInt(nightsMatch[1])

  // Departure port
  const portMatch = html.match(/(?:Port\s*(?:de\s*)?(?:imbarcare|plecare)|Departure|Embark)[^:]*:\s*<[^>]*>([^<]+)/i) ||
                    html.match(/(?:Port\s*(?:de\s*)?(?:imbarcare|plecare)|Departure|Embark)[^:]*:\s*([^<\n]+)/i)
  if (portMatch) cruise.departure_port = portMatch[1].trim()

  // Price
  const priceMatch = html.match(/(?:de la|from|pret)[^<]*?(\d[\d.,]+)\s*(?:€|EUR)/i) ||
                     html.match(/(\d[\d.,]+)\s*(?:€|EUR)/i)
  if (priceMatch) {
    cruise.price_from = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
    cruise.currency = 'EUR'
  }

  // Main image
  const imgMatch = html.match(/<img[^>]*(?:class="[^"]*(?:main|hero|cover|ship)[^"]*"|id="[^"]*(?:main|hero)[^"]*")[^>]*src="([^"]+)"/i) ||
                   html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                   html.match(/<img[^>]*src="(https?:\/\/[^"]+(?:ship|cruise|vas)[^"]*\.(?:jpg|jpeg|png|webp))"[^>]*/i)
  if (imgMatch) cruise.image_url = imgMatch[1]

  // Itinerary - day by day
  // Look for itinerary table or list
  cruise.itinerary = []
  const itinerarySection = html.match(/(?:itinerar|itinerary)([\s\S]*?)(?=<\/(?:table|section|div[^>]*class="[^"]*(?:cabin|pret|price)))/i)
  if (itinerarySection) {
    // Try table rows: <tr> with day, port, arrival, departure
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    let rowMatch
    while ((rowMatch = rowRegex.exec(itinerarySection[1])) !== null) {
      const cells = []
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
      let cellMatch
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim())
      }
      if (cells.length >= 2) {
        const entry = {
          day: parseInt(cells[0]) || cruise.itinerary.length + 1,
          port: cells[1] || '',
        }
        if (cells[2]) entry.arrival = cells[2]
        if (cells[3]) entry.departure = cells[3]
        if (entry.port) cruise.itinerary.push(entry)
      }
    }
  }

  // If no table itinerary, try list-based
  if (cruise.itinerary.length === 0) {
    const dayRegex = /(?:Ziua|Day)\s*(\d+)[^:]*:\s*([^<\n]+)/gi
    let dayMatch
    while ((dayMatch = dayRegex.exec(html)) !== null) {
      cruise.itinerary.push({
        day: parseInt(dayMatch[1]),
        port: dayMatch[2].trim(),
      })
    }
  }

  // Extract ports of call from itinerary
  if (cruise.itinerary.length > 0) {
    cruise.ports_of_call = cruise.itinerary
      .map(e => e.port)
      .filter(p => p && !p.toLowerCase().includes('navigatie') && !p.toLowerCase().includes('mare'))
  }

  // Cabin types with prices
  cruise.cabin_types = []
  const cabinRegex = /(?:Interior|Exterior|Balcon|Suite|Ocean\s*View|Inside|Outside|Mini\s*Suite|Haven|Club)[^<]*?(\d[\d.,]+)\s*(?:€|EUR)/gi
  let cabinMatch
  while ((cabinMatch = cabinRegex.exec(html)) !== null) {
    const name = cabinMatch[0].replace(/\d[\d.,]+\s*(?:€|EUR).*/i, '').trim()
    const price = parseFloat(cabinMatch[1].replace(/\./g, '').replace(',', '.'))
    if (name && price > 0) {
      cruise.cabin_types.push({ name, price_from: price })
    }
  }

  // Alternative: look for price table
  if (cruise.cabin_types.length === 0) {
    const priceTableMatch = html.match(/(?:cabin|categ|pret|price|tarif)([\s\S]*?)(?=<\/(?:table|section))/i)
    if (priceTableMatch) {
      const priceRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
      let prMatch
      while ((prMatch = priceRowRegex.exec(priceTableMatch[1])) !== null) {
        const cells = []
        const cRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
        let cMatch
        while ((cMatch = cRegex.exec(prMatch[1])) !== null) {
          cells.push(cMatch[1].replace(/<[^>]+>/g, '').trim())
        }
        if (cells.length >= 2) {
          const name = cells[0]
          const priceStr = cells.find(c => /\d/.test(c) && c !== cells[0])
          if (name && priceStr) {
            const price = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
            if (price > 0) cruise.cabin_types.push({ name, price_from: price })
          }
        }
      }
    }
  }

  // Departure dates
  cruise.departure_dates = []
  const dateRegex = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})\s*[-–]?\s*(?:de la\s*)?(\d[\d.,]*)\s*(?:€|EUR)/gi
  let dateMatch
  while ((dateMatch = dateRegex.exec(html)) !== null) {
    cruise.departure_dates.push({
      date: dateMatch[1],
      price: parseFloat(dateMatch[2].replace(/\./g, '').replace(',', '.')),
    })
  }

  // Included / Excluded
  cruise.included = extractBulletList(html, /(?:includ|include)([\s\S]*?)(?=<\/(?:ul|div|section)|(?:nu\s*(?:este\s*)?includ|exclud|not\s*includ))/i)
  cruise.excluded = extractBulletList(html, /(?:nu\s*(?:este\s*)?includ|exclud|not\s*includ)([\s\S]*?)(?=<\/(?:ul|div|section))/i)

  // Description
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
  if (descMatch) cruise.description = descMatch[1]

  return cruise
}

function extractBulletList(html, sectionRegex) {
  const section = html.match(sectionRegex)
  if (!section) return []
  const items = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let liMatch
  while ((liMatch = liRegex.exec(section[1])) !== null) {
    const text = liMatch[1].replace(/<[^>]+>/g, '').trim()
    if (text) items.push(text)
  }
  return items
}

async function phase3_details(detailUrls) {
  console.log('\n=== PHASE 3: Scraping Detail Pages ===\n')
  console.log(`Total detail pages to scrape: ${detailUrls.length}`)

  // Load progress if resuming
  const progressFile = 'details-progress.json'
  const progress = loadJSON(progressFile)
  const scraped = progress ? new Map(progress.scraped.map(c => [c.source_url, c])) : new Map()

  const toScrape = detailUrls.filter(u => !scraped.has(u))
  console.log(`Already scraped: ${scraped.size}`)
  console.log(`Remaining: ${toScrape.length}`)

  let batchNum = 0
  const SAVE_EVERY = 100 // Save progress every 100 pages

  for (let i = 0; i < toScrape.length; i += CONCURRENCY) {
    const batch = toScrape.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map(async url => {
        try {
          const html = await fetchWithRetry(url)
          return parseDetailPage(html, url)
        } catch (err) {
          console.warn(`  Failed: ${url} - ${err.message}`)
          return null
        }
      })
    )

    for (const r of batchResults) {
      if (r.status === 'fulfilled' && r.value) {
        scraped.set(r.value.source_url, r.value)
      }
    }

    batchNum++
    const done = Math.min(i + CONCURRENCY, toScrape.length)

    if (done % 50 === 0 || done >= toScrape.length) {
      console.log(`  Progress: ${scraped.size}/${detailUrls.length} (${((scraped.size/detailUrls.length)*100).toFixed(1)}%) - batch ${batchNum}`)
    }

    // Save progress periodically
    if (done % SAVE_EVERY === 0 || done >= toScrape.length) {
      saveJSON(progressFile, { scraped: [...scraped.values()] })
    }

    await sleep(DELAY_MS)
  }

  const allCruises = [...scraped.values()]
  console.log(`\nTotal cruises scraped: ${allCruises.length}`)

  // Save final result
  saveJSON('cruises-raw.json', allCruises)

  // Stats
  const withItinerary = allCruises.filter(c => c.itinerary && c.itinerary.length > 0)
  const withPrices = allCruises.filter(c => c.price_from > 0)
  const withCabins = allCruises.filter(c => c.cabin_types && c.cabin_types.length > 0)
  const withDates = allCruises.filter(c => c.departure_dates && c.departure_dates.length > 0)

  console.log('\n=== Scraping Statistics ===')
  console.log(`Total cruises: ${allCruises.length}`)
  console.log(`With itinerary: ${withItinerary.length}`)
  console.log(`With prices: ${withPrices.length}`)
  console.log(`With cabin types: ${withCabins.length}`)
  console.log(`With departure dates: ${withDates.length}`)

  // Extract unique ports
  const allPorts = new Set()
  for (const c of allCruises) {
    if (c.ports_of_call) c.ports_of_call.forEach(p => allPorts.add(p))
    if (c.departure_port) allPorts.add(c.departure_port)
  }
  console.log(`Unique ports: ${allPorts.size}`)
  saveJSON('unique-ports.json', [...allPorts].sort())

  // Extract unique cruise lines
  const cruiseLines = new Set()
  for (const c of allCruises) {
    if (c.cruise_line) cruiseLines.add(c.cruise_line)
  }
  console.log(`Unique cruise lines: ${cruiseLines.size}`)
  saveJSON('cruise-lines.json', [...cruiseLines].sort())

  // Extract unique ships
  const ships = new Set()
  for (const c of allCruises) {
    if (c.ship_name) ships.add(c.ship_name)
  }
  console.log(`Unique ships: ${ships.size}`)
  saveJSON('ships.json', [...ships].sort())

  return allCruises
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2)
  const phaseArg = args.find(a => a.startsWith('--phase'))
  const phase = phaseArg ? args[args.indexOf(phaseArg) + 1] : 'all'
  const resume = args.includes('--resume')

  console.log('╔════════════════════════════════════════╗')
  console.log('║  Croaziere.net Full Scraper            ║')
  console.log('║  Extracting ALL cruise data            ║')
  console.log('╚════════════════════════════════════════╝')
  console.log(`Phase: ${phase} | Resume: ${resume}`)
  console.log(`Concurrency: ${CONCURRENCY} | Delay: ${DELAY_MS}ms`)
  console.log()

  const startTime = Date.now()

  try {
    // Phase 1: Sitemap
    let sitemapData
    if (phase === 'all' || phase === '1') {
      sitemapData = await phase1_sitemap()
    } else {
      sitemapData = loadJSON('sitemap-urls.json')
      if (sitemapData) {
        sitemapData = {
          detailData: sitemapData.details,
          listingUrls: sitemapData.listings,
        }
      }
    }

    if (!sitemapData) {
      console.error('No sitemap data. Run phase 1 first.')
      process.exit(1)
    }

    // Phase 2: Listings
    if (phase === 'all' || phase === '2') {
      await phase2_listings(sitemapData.listingUrls)
    }

    // Phase 3: Detail pages
    if (phase === 'all' || phase === '3') {
      const detailUrls = sitemapData.detailData.map(d => d.url)
      await phase3_details(detailUrls)
    }

    const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    console.log(`\n✅ Done in ${elapsed} minutes`)

  } catch (err) {
    console.error('Fatal error:', err)
    process.exit(1)
  }
}

main()
