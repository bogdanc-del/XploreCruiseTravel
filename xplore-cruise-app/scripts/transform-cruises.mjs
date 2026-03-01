/**
 * Transform scraped NDJSON cruise data into a clean TypeScript-compatible JSON database.
 *
 * Input:  scripts/output/cruises-all.ndjson (8,498 lines)
 * Output: public/data/cruises.json (clean, typed, with slugs)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { createHash } from 'crypto'

const INPUT = 'scripts/output/cruises-all.ndjson'
const OUTPUT = 'public/data/cruises.json'
const INDEX_OUTPUT = 'public/data/cruises-index.json'

// Helper: create slug from title
function createSlug(title, sourceId) {
  const clean = title
    .toLowerCase()
    .replace(/croaziera \d{4} - /i, '')
    .replace(/\([^)]+\)/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
  return `${clean}-${sourceId}`
}

// Helper: normalize destination name (remove parenthetical port info)
function normalizeDestination(dest) {
  if (!dest) return ''
  return dest.replace(/\s*\([^)]+\)/g, '').trim()
}

// Helper: create destination slug
function destSlug(dest) {
  return normalizeDestination(dest)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Map Romanian destination names to English
const DEST_TRANSLATIONS = {
  'Mediterana': 'Mediterranean',
  'Caraibe si America Centrala': 'Caribbean & Central America',
  'Europa de Nord': 'Northern Europe',
  'Alaska': 'Alaska',
  'Repozitionari si Transoceanic': 'Repositioning & Transatlantic',
  'America de Sud': 'South America',
  'Orientul Mijlociu': 'Middle East',
  'Grand Voyage si Tematice': 'Grand Voyage & Themed',
  'California si Riviera Mexicana': 'California & Mexican Riviera',
  'Tahiti si Pacificul de Sud': 'Tahiti & South Pacific',
  'Asia': 'Asia',
  'Africa': 'Africa',
  'Australia si Noua Zeelanda': 'Australia & New Zealand',
  'Hawaii': 'Hawaii',
  'Bermuda': 'Bermuda',
  'Canada si New England': 'Canada & New England',
  'Insulele Britanice': 'British Isles',
  'Insulele Canare': 'Canary Islands',
  'Islanda si Groenlanda': 'Iceland & Greenland',
  'In Jurul Lumii': 'Around the World',
  'Dunarea': 'Danube',
  'Rinul': 'Rhine',
  'Sena': 'Seine',
  'Ronul si Saona': 'Rhone & Saone',
  'Douro': 'Douro',
  'Elba': 'Elbe',
  'Mosela': 'Moselle',
  'Mekong': 'Mekong',
  'Nil': 'Nile',
  'Main': 'Main',
}

function translateDest(ro) {
  const normalized = normalizeDestination(ro)
  // Try exact match first
  if (DEST_TRANSLATIONS[normalized]) return DEST_TRANSLATIONS[normalized]
  // Try partial match
  for (const [key, val] of Object.entries(DEST_TRANSLATIONS)) {
    if (normalized.startsWith(key)) return val
  }
  return normalized // fallback to original
}

console.log('Reading NDJSON...')
const lines = readFileSync(INPUT, 'utf8').split('\n').filter(l => l.trim())
console.log(`Parsed ${lines.length} cruises`)

const cruises = []
const seen = new Set()

for (const line of lines) {
  try {
    const raw = JSON.parse(line)

    // Skip duplicates by source_id
    if (seen.has(raw.source_id)) continue
    seen.add(raw.source_id)

    const slug = createSlug(raw.title, raw.source_id)
    const destination_ro = normalizeDestination(raw.destination)
    const destination = translateDest(raw.destination)

    // Build clean port list from itinerary (unique, in order, no sea days)
    const portsFromItinerary = raw.itinerary
      ? raw.itinerary
          .filter(p => p.port && !p.port.toLowerCase().includes('navigatie'))
          .map(p => p.port)
      : raw.ports_of_call || []

    // Unique ports preserving order
    const uniquePorts = []
    const seenPorts = new Set()
    for (const p of portsFromItinerary) {
      if (!seenPorts.has(p)) {
        seenPorts.add(p)
        uniquePorts.push(p)
      }
    }

    // Build itinerary with arrival/departure times
    const itinerary = raw.itinerary
      ? raw.itinerary.map(p => ({
          day: p.day,
          port: p.port,
          arrival: p.arrival || null,
          departure: p.departure || null,
        }))
      : []

    // Cabin types
    const cabinTypes = raw.cabin_types
      ? raw.cabin_types.map((c, i) => ({
          name: `Cabin Type ${i + 1}`,
          price_from: c.price_from,
        }))
      : []

    // Parse departure dates
    const departureDates = (raw.departure_dates || []).map(d => {
      // Parse "27 Aug 2026" format
      try {
        const parsed = new Date(d)
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0]
        }
      } catch {}
      return d
    })

    // Get first departure date
    const firstDeparture = departureDates.length > 0 ? departureDates[0] : null

    // Determine departure port from itinerary (first port) or raw data
    let departurePort = ''
    if (itinerary.length > 0) {
      departurePort = itinerary[0].port
    } else if (uniquePorts.length > 0) {
      departurePort = uniquePorts[0]
    }

    // Determine cruise type
    const isRiver = ['Dunarea', 'Rinul', 'Sena', 'Ronul', 'Douro', 'Elba', 'Mosela', 'Mekong', 'Nil', 'Main']
      .some(r => destination_ro.includes(r) || (raw.title || '').toLowerCase().includes(r.toLowerCase()))
    const isLuxury = ['Silversea', 'Regent', 'Crystal', 'Seabourn', 'SeaDream', 'Explora', 'Four Seasons']
      .some(l => (raw.cruise_line || '').includes(l))
    const cruiseType = isRiver ? 'river' : isLuxury ? 'luxury' : 'ocean'

    const cruise = {
      id: String(raw.source_id),
      slug,
      title: raw.title,
      cruise_type: cruiseType,
      nights: raw.nights || 0,
      price_from: raw.price_from || 0,
      currency: 'EUR',
      departure_port: departurePort,
      departure_date: firstDeparture,
      departure_dates: departureDates,
      ports_of_call: uniquePorts,
      itinerary,
      image_url: raw.image_url || (raw.images && raw.images[0]) || '',
      gallery_urls: (raw.images || []).slice(0, 10),
      cabin_types: cabinTypes,
      cruise_line: raw.cruise_line || '',
      ship_name: raw.ship_name || '',
      destination,
      destination_ro,
      destination_slug: destSlug(raw.destination),
      source: 'croaziere.net',
      source_url: raw.source_url,
      active: true,
    }

    cruises.push(cruise)
  } catch (err) {
    // Skip malformed lines
  }
}

console.log(`Transformed ${cruises.length} cruises (${lines.length - cruises.length} duplicates/errors skipped)`)

// Sort: by destination, then by price
cruises.sort((a, b) => a.destination.localeCompare(b.destination) || a.price_from - b.price_from)

// Create output directory
mkdirSync('public/data', { recursive: true })

// Write full database
writeFileSync(OUTPUT, JSON.stringify(cruises))
const sizeKB = Math.round(readFileSync(OUTPUT).length / 1024)
console.log(`Wrote ${OUTPUT} (${sizeKB} KB)`)

// Create a lightweight index for the listing page (no itineraries, no gallery)
const index = cruises.map(c => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  cruise_type: c.cruise_type,
  nights: c.nights,
  price_from: c.price_from,
  currency: c.currency,
  departure_port: c.departure_port,
  departure_date: c.departure_date,
  ports_of_call: c.ports_of_call,
  image_url: c.image_url,
  cruise_line: c.cruise_line,
  ship_name: c.ship_name,
  destination: c.destination,
  destination_ro: c.destination_ro,
  destination_slug: c.destination_slug,
}))

writeFileSync(INDEX_OUTPUT, JSON.stringify(index))
const indexSizeKB = Math.round(readFileSync(INDEX_OUTPUT).length / 1024)
console.log(`Wrote ${INDEX_OUTPUT} (${indexSizeKB} KB)`)

// Stats
const stats = {
  total: cruises.length,
  withItinerary: cruises.filter(c => c.itinerary.length > 0).length,
  withCabins: cruises.filter(c => c.cabin_types.length > 0).length,
  withImages: cruises.filter(c => c.gallery_urls.length > 0).length,
  cruiseLines: [...new Set(cruises.map(c => c.cruise_line))].sort(),
  destinations: [...new Set(cruises.map(c => c.destination))].sort(),
  priceRange: {
    min: Math.min(...cruises.filter(c => c.price_from > 0).map(c => c.price_from)),
    max: Math.max(...cruises.map(c => c.price_from)),
  },
  nightsRange: {
    min: Math.min(...cruises.filter(c => c.nights > 0).map(c => c.nights)),
    max: Math.max(...cruises.map(c => c.nights)),
  },
}

console.log('\n=== Database Stats ===')
console.log(`Total cruises: ${stats.total}`)
console.log(`With itinerary: ${stats.withItinerary}`)
console.log(`With cabin prices: ${stats.withCabins}`)
console.log(`With images: ${stats.withImages}`)
console.log(`Cruise lines: ${stats.cruiseLines.length}`)
console.log(`Destinations: ${stats.destinations.length}`)
console.log(`Price range: €${stats.priceRange.min} - €${stats.priceRange.max}`)
console.log(`Nights range: ${stats.nightsRange.min} - ${stats.nightsRange.max}`)
console.log('\nDone!')
