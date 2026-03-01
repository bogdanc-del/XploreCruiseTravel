#!/usr/bin/env node
/**
 * scrape-resume.mjs — Memory-efficient scraper that resumes from progress
 *
 * Reads the existing 5000 scraped cruises from scrape-progress.json,
 * writes them to an NDJSON file, then continues scraping the remaining ~3500.
 * Uses streaming writes to avoid OOM.
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'fs'

const BASE_DIR = 'scripts/output'
const PROGRESS_FILE = `${BASE_DIR}/scrape-progress.json`
const OUTPUT_FILE = `${BASE_DIR}/cruises-all.ndjson`
const URLS_FILE = `${BASE_DIR}/sitemap-detail-urls.json`

// ── Step 1: Load already-scraped IDs ──────────────────────────
console.log('Loading existing progress...')
const existing = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
console.log(`Found ${existing.length} already-scraped cruises`)

// Write existing data to NDJSON
writeFileSync(OUTPUT_FILE, '')
for (const cruise of existing) {
  appendFileSync(OUTPUT_FILE, JSON.stringify(cruise) + '\n')
}
console.log(`Wrote ${existing.length} cruises to ${OUTPUT_FILE}`)

// Build set of already-scraped URLs
const scrapedUrls = new Set(existing.map(c => c.source_url))

// Free memory
existing.length = 0

// ── Step 2: Load all URLs and find remaining ──────────────────
const allUrls = JSON.parse(readFileSync(URLS_FILE, 'utf-8'))
const remaining = allUrls.filter(u => !scrapedUrls.has(u))
console.log(`Remaining to scrape: ${remaining.length}`)

if (remaining.length === 0) {
  console.log('All cruises already scraped!')
  process.exit(0)
}

// ── Step 3: Scraping functions ────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms))

function parseUrlSlug(url) {
  const result = { source_url: url, source_id: 0, year: 0, nights: 0 }
  const idMatch = url.match(/-i(\d+)\//)
  if (idMatch) result.source_id = parseInt(idMatch[1])
  const yearMatch = url.match(/croaziera-(\d{4})/)
  if (yearMatch) result.year = parseInt(yearMatch[1])
  const nightsMatch = url.match(/(\d+)-nopti/)
  if (nightsMatch) result.nights = parseInt(nightsMatch[1])
  return result
}

function parseDetailPage(html, meta) {
  const cruise = { ...meta }

  // Title from <h1>
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1) cruise.title = h1[1].replace(/<[^>]+>/g, '').trim()

  // OG image
  const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
  if (ogImage) cruise.image_url = ogImage[1]

  // Cruise line & ship from title slug
  const slugParts = meta.source_url
    .replace(/.*croaziere\//, '')
    .replace(/-i\d+\/$/, '')
    .split('-')

  // Parse $_ports JavaScript variable (itinerary with GPS)
  const portsMatch = html.match(/\$_ports\s*=\s*(\[[\s\S]*?\]);/)
  if (portsMatch) {
    try {
      const ports = JSON.parse(portsMatch[1])
      cruise.itinerary = ports.map(p => ({
        day: p.day || p.zi,
        port: (p.title || p.name || '').trim(),
        port_id: p.id_port,
        arrival: p.from_hour || null,
        departure: p.till_hour || null,
        lat: p.map_x || null,
        lng: p.map_y || null,
      }))
    } catch (e) {}
  }

  // Cabin prices from HTML
  const cabinMatches = [...html.matchAll(/class="[^"]*cabina-price[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*cabina-price|<\/section)/gi)]
  if (cabinMatches.length > 0) {
    cruise.cabin_types = []
    for (const m of cabinMatches) {
      const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const nameMatch = text.match(/^([^€$\d]+?)(?:\s+(?:de la|from))?\s+/i)
      const priceMatch = text.match(/(\d[\d.,]+)\s*(?:€|EUR)/i)
      if (priceMatch) {
        cruise.cabin_types.push({
          name: nameMatch ? nameMatch[1].trim() : 'Standard',
          price_from: parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')),
        })
      }
    }
  }

  // Alternative cabin extraction
  if (!cruise.cabin_types || cruise.cabin_types.length === 0) {
    const cabinCards = [...html.matchAll(/class="[^"]*cruise-cabin-card[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*cruise-cabin-card|<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/gi)]
    if (cabinCards.length > 0) {
      cruise.cabin_types = []
      for (const card of cabinCards) {
        const text = card[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        const priceMatch = text.match(/(\d[\d.,]+)\s*(?:€|EUR)/i)
        const nameWords = text.split(/\s+/).slice(0, 4).join(' ')
        if (priceMatch) {
          cruise.cabin_types.push({
            name: nameWords.replace(/\d.*$/, '').trim() || 'Standard',
            price_from: parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')),
          })
        }
      }
    }
  }

  // Departure dates from select
  const dateSelect = html.match(/<select[^>]*id="[^"]*date[^"]*"[^>]*>([\s\S]*?)<\/select>/i)
  if (dateSelect) {
    const options = [...dateSelect[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)/gi)]
    cruise.departure_dates = options
      .filter(o => o[1] && o[1].length > 0)
      .map(o => ({ date: o[2].trim(), value: o[1] }))
  }

  // Ship image from uploads
  const shipImg = html.match(/src="(https?:\/\/[^"]*uploads[^"]*\.(?:jpg|jpeg|png|webp)[^"]*)"/i)
  if (shipImg && !cruise.image_url) cruise.image_url = shipImg[1]

  // Price from
  const priceMatch = html.match(/(?:de la|from)\s*(\d[\d.,]+)\s*(?:€|EUR)/i)
  if (priceMatch) {
    cruise.price_from = parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.'))
  }

  // Destination & cruise line from structured breadcrumb/meta
  const destMatch = html.match(/class="[^"]*breadcrumb[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>\s*<\/li>\s*<li/i)

  return cruise
}

async function fetchPage(url, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Accept-Encoding': 'gzip' },
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      return text
    } catch (e) {
      if (attempt < retries - 1) await delay(2000 * (attempt + 1))
      else return null
    }
  }
  return null
}

// ── Step 4: Scrape remaining with streaming writes ────────────
const CONCURRENCY = 6
const BATCH_DELAY = 200
let scraped = 0
let errors = 0
const startTime = Date.now()

async function scrapeUrl(url) {
  const meta = parseUrlSlug(url)
  const html = await fetchPage(url)
  if (!html) { errors++; return }
  const cruise = parseDetailPage(html, meta)
  // Append directly to file (streaming, no memory accumulation)
  appendFileSync(OUTPUT_FILE, JSON.stringify(cruise) + '\n')
  scraped++
}

// Process in batches
for (let i = 0; i < remaining.length; i += CONCURRENCY) {
  const batch = remaining.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(url => scrapeUrl(url)))

  const total = scraped + errors
  if (total % 50 === 0 || i + CONCURRENCY >= remaining.length) {
    const elapsed = (Date.now() - startTime) / 1000
    const rate = (total / elapsed).toFixed(1)
    const eta = ((remaining.length - total) / (total / elapsed) / 60).toFixed(1)
    console.log(`  [${total}/${remaining.length}] ${(total / remaining.length * 100).toFixed(1)}% | ${rate} pages/s | ETA: ${eta}m | Errors: ${errors}`)
  }

  await delay(BATCH_DELAY)
}

console.log(`\nDone! Scraped ${scraped} new cruises (${errors} errors)`)
console.log(`Total cruises in ${OUTPUT_FILE}: ${5000 + scraped}`)

// ── Step 5: Count total lines ─────────────────────────────────
const totalLines = readFileSync(OUTPUT_FILE, 'utf-8').split('\n').filter(l => l.trim()).length
console.log(`Verified: ${totalLines} total cruises in NDJSON file`)
