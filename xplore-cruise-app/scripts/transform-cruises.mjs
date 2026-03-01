/**
 * Transform scraped NDJSON cruise data into a clean TypeScript-compatible JSON database.
 *
 * Input:  scripts/output/cruises-all.ndjson (8,498 lines)
 * Output: public/data/cruises.json (clean, typed, with slugs)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { createHash } from 'crypto'

const INPUT = 'scripts/output/cruises-all-fixed.ndjson'
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
  let clean = dest
    .replace(/\s*\([^)]*\)/g, '')  // Remove balanced (...) groups
    .replace(/,\s*[^,]+\)\s*$/g, '') // Remove trailing broken parens like ", Egipt)"
    .replace(/\)\s*$/g, '')           // Remove any remaining trailing )
    .trim()
  return clean
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
  'Insulele Britanice': 'Northern Europe',
  'Insulele Canare': 'Mediterranean',
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
  'Caraibe': 'Caribbean & Central America',
  'Transatlantic si Repozitionari': 'Repositioning & Transatlantic',
  'Repozitionare': 'Repositioning & Transatlantic',
  'Dunare': 'Danube',
  'Rin': 'Rhine',
  'Japonia si Coreea de Sud': 'Asia',
  'Canada si Noua Anglie': 'Canada & New England',
  'Grand Voyage': 'Grand Voyage & Themed',
  'Grand Voyage si Tematice': 'Grand Voyage & Themed',
  'Caraibe si America Centrala': 'Caribbean & Central America',
  'Repozitionari si Transatlantic': 'Repositioning & Transatlantic',
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

    // Skip cruises with no price (confirmed missing on source site)
    if (!raw.price_from || raw.price_from === 0) continue

    const slug = createSlug(raw.title, raw.source_id)
    let destination_ro = normalizeDestination(raw.destination)

    // Fix: some destinations are actually cruise line names (bad scrape)
    const CRUISE_LINE_NAMES = ['Costa Cruises', 'MSC Cruises', 'Royal Caribbean', 'Norwegian Cruise Line', 'Hurtigruten']
    if (CRUISE_LINE_NAMES.includes(destination_ro)) {
      // Try to extract real destination from title
      const titleDestMatch = (raw.title || '').match(/^Croaziera\s+\d{4}\s*[-–—]\s*([^(]+?)(?:\s*\(|$)/)
      if (titleDestMatch) {
        destination_ro = titleDestMatch[1].trim()
      }
    }

    const destination = translateDest(destination_ro)

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

    // Helper: parse a date string or object into ISO format
    const RO_MONTHS = { 'Ian': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr', 'Mai': 'May', 'Iun': 'Jun', 'Iul': 'Jul', 'Aug': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Noi': 'Nov', 'Dec': 'Dec' }
    function parseDate(d) {
      if (!d) return null
      // Handle {date: "27 Aug 2026", value: "..."} objects
      let str = typeof d === 'object' ? (d.date || d.value || '') : String(d)
      if (!str) return null
      // Replace Romanian month names with English
      for (const [ro, en] of Object.entries(RO_MONTHS)) {
        str = str.replace(new RegExp(`\\b${ro}\\b`, 'i'), en)
      }
      try {
        const parsed = new Date(str)
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0]
        }
      } catch {}
      return str // Return as-is if can't parse
    }

    // Parse departure dates
    const departureDates = (raw.departure_dates || []).map(parseDate).filter(Boolean)

    // Get first departure date — try departure_dates first, then raw.departure_date
    let firstDeparture = departureDates.length > 0 ? departureDates[0] : parseDate(raw.departure_date)

    // Fix nights: if 0, try to parse from title "N nopti" or "N noapte"
    let nights = raw.nights || 0
    if (nights === 0) {
      const nightsMatch = (raw.title || '').match(/(\d+)\s*nop[tț]i/i) || (raw.title || '').match(/(\d+)\s*noapte/i)
      if (nightsMatch) nights = parseInt(nightsMatch[1])
    }

    // Determine departure port from itinerary (first port) or raw data or title
    let departurePort = ''
    if (itinerary.length > 0) {
      departurePort = itinerary[0].port
    } else if (uniquePorts.length > 0) {
      departurePort = uniquePorts[0]
    } else if (raw.departure_port) {
      departurePort = raw.departure_port
    } else {
      // Try to extract from title: "Croaziera 2027 - Destination (Port) - Line - Ship - N nopti"
      // Handle nested parens: "Africa (Cairo (Port Said), Egipt)" or
      // "Asia (Orientul Indepartat) (Tokyo (Yokohama), Japonia)"
      const titleStr = raw.title || ''
      const withoutPrefix = titleStr.replace(/^Croaziera\s+\d{4}\s*[-–—]\s*/, '')
      const firstSegment = withoutPrefix.split(/\s+-\s+/)[0]
      if (firstSegment && firstSegment.includes('(')) {
        // Walk backwards to find the last balanced parenthesized group
        let depth = 0
        let end = -1
        for (let i = firstSegment.length - 1; i >= 0; i--) {
          if (firstSegment[i] === ')') {
            if (depth === 0) end = i
            depth++
          } else if (firstSegment[i] === '(') {
            depth--
            if (depth === 0 && end > i) {
              departurePort = firstSegment.slice(i + 1, end).trim()
              break
            }
          }
        }
      }
    }

    // Determine cruise type
    const RIVER_DEST_KEYWORDS = ['Dunarea', 'Dunare', 'Rinul', 'Rin', 'Sena', 'Ronul si Saona', 'Douro', 'Elba', 'Mosela', 'Mekong', 'Nil', 'Main']
    const RIVER_CRUISE_LINES = ['Uniworld', 'AmaWaterways', 'Crucemundo', 'A-Rosa', 'Viva Cruises', 'Nicko Cruises']
    const isRiver = RIVER_DEST_KEYWORDS.some(r => destination_ro.includes(r) || (raw.title || '').toLowerCase().includes(r.toLowerCase()))
      || RIVER_CRUISE_LINES.some(r => (raw.cruise_line || '').includes(r))
    const isLuxury = ['Silversea', 'Regent', 'Crystal', 'Seabourn', 'SeaDream', 'Explora', 'Four Seasons']
      .some(l => (raw.cruise_line || '').includes(l))
    const cruiseType = isRiver ? 'river' : isLuxury ? 'luxury' : 'ocean'

    // Fix cruise_line: some are actually ship names
    let cruiseLine = raw.cruise_line || ''
    if (cruiseLine === 'Costa Pacifica' || cruiseLine === 'Costa Smeralda') {
      cruiseLine = 'Costa Cruises'
    }

    const cruise = {
      id: String(raw.source_id),
      slug,
      title: raw.title,
      cruise_type: cruiseType,
      nights,
      price_from: raw.price_from || 0,
      departure_port: departurePort,
      departure_date: firstDeparture,
      departure_dates: departureDates,
      ports_of_call: uniquePorts,
      itinerary,
      image_url: raw.image_url || (raw.images && raw.images[0]) || '',
      gallery_urls: (raw.images || []).slice(0, 10),
      cabin_types: cabinTypes,
      cruise_line: cruiseLine,
      ship_name: raw.ship_name || '',
      destination,
      destination_ro,
      destination_slug: destSlug(destination),
      source_url: raw.source_url,
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

// Create a lightweight index for the listing page (no itineraries, no gallery, no ports)
const index = cruises.map(c => ({
  id: c.id,
  s: c.slug,                    // slug
  t: c.title,                   // title
  ct: c.cruise_type,            // cruise_type
  n: c.nights,                  // nights
  p: c.price_from,              // price_from
  dp: c.departure_port,         // departure_port
  dd: c.departure_date,         // departure_date
  img: c.image_url,             // image_url
  cl: c.cruise_line,            // cruise_line
  sn: c.ship_name,              // ship_name
  d: c.destination,             // destination
  dr: c.destination_ro,         // destination_ro
  ds: c.destination_slug,       // destination_slug
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
