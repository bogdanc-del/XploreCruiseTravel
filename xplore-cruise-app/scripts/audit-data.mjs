/**
 * Comprehensive data quality audit for all cruise data
 */
import { readFileSync } from 'fs'

const data = JSON.parse(readFileSync('public/data/cruises.json', 'utf8'))
console.log(`\n========================================`)
console.log(`  CRUISE DATA QUALITY AUDIT`)
console.log(`  Total cruises: ${data.length}`)
console.log(`========================================\n`)

// 1. Missing fields
const checks = [
  { field: 'id', check: c => !c.id },
  { field: 'slug', check: c => !c.slug },
  { field: 'title', check: c => !c.title },
  { field: 'cruise_line', check: c => !c.cruise_line },
  { field: 'ship_name', check: c => !c.ship_name },
  { field: 'destination', check: c => !c.destination },
  { field: 'destination_ro', check: c => !c.destination_ro },
  { field: 'departure_port', check: c => !c.departure_port },
  { field: 'departure_date', check: c => !c.departure_date },
  { field: 'image_url', check: c => !c.image_url },
  { field: 'source_url', check: c => !c.source_url },
  { field: 'nights (=0)', check: c => !c.nights || c.nights === 0 },
  { field: 'price_from (=0)', check: c => !c.price_from || c.price_from === 0 },
]

console.log('--- MISSING/EMPTY FIELDS ---')
for (const { field, check } of checks) {
  const missing = data.filter(check)
  const pct = ((missing.length / data.length) * 100).toFixed(1)
  const status = missing.length === 0 ? '✅' : missing.length < 50 ? '⚠️' : '❌'
  console.log(`${status} ${field}: ${missing.length} missing (${pct}%)`)
  if (missing.length > 0 && missing.length <= 5) {
    missing.forEach(c => console.log(`   → id=${c.id} title="${c.title?.slice(0, 80)}"...`))
  } else if (missing.length > 0 && missing.length <= 20) {
    missing.slice(0, 5).forEach(c => console.log(`   → id=${c.id} title="${c.title?.slice(0, 80)}"...`))
    console.log(`   ... and ${missing.length - 5} more`)
  }
}

// 2. Data ranges
console.log('\n--- DATA RANGES ---')
const validPrices = data.filter(c => c.price_from > 0)
console.log(`Price range: €${Math.min(...validPrices.map(c => c.price_from))} - €${Math.max(...validPrices.map(c => c.price_from))}`)
const validNights = data.filter(c => c.nights > 0)
console.log(`Nights range: ${Math.min(...validNights.map(c => c.nights))} - ${Math.max(...validNights.map(c => c.nights))}`)

// Suspicious values
const tooExpensive = data.filter(c => c.price_from > 50000)
console.log(`Cruises over €50,000: ${tooExpensive.length}`)
tooExpensive.forEach(c => console.log(`   → id=${c.id} €${c.price_from} "${c.title?.slice(0, 80)}"`))

const tooLong = data.filter(c => c.nights > 100)
console.log(`Cruises over 100 nights: ${tooLong.length}`)
tooLong.forEach(c => console.log(`   → id=${c.id} ${c.nights}n "${c.title?.slice(0, 80)}"`))

const veryShort = data.filter(c => c.nights === 1)
console.log(`1-night cruises: ${veryShort.length}`)
veryShort.slice(0, 3).forEach(c => console.log(`   → id=${c.id} "${c.title?.slice(0, 80)}"`))

// 3. Cruise lines
console.log('\n--- CRUISE LINES ---')
const lineCount = {}
data.forEach(c => { lineCount[c.cruise_line] = (lineCount[c.cruise_line] || 0) + 1 })
const sortedLines = Object.entries(lineCount).sort((a, b) => b[1] - a[1])
sortedLines.forEach(([line, count]) => console.log(`  ${count.toString().padStart(5)} | ${line}`))

// 4. Destinations
console.log('\n--- DESTINATIONS ---')
const destCount = {}
data.forEach(c => { destCount[c.destination] = (destCount[c.destination] || 0) + 1 })
const sortedDest = Object.entries(destCount).sort((a, b) => b[1] - a[1])
sortedDest.forEach(([dest, count]) => console.log(`  ${count.toString().padStart(5)} | ${dest}`))

// 5. Date validation
console.log('\n--- DATE VALIDATION ---')
const invalidDates = data.filter(c => {
  if (!c.departure_date) return false
  const d = new Date(c.departure_date)
  return isNaN(d.getTime())
})
console.log(`Invalid departure_date format: ${invalidDates.length}`)
invalidDates.slice(0, 5).forEach(c => console.log(`   → id=${c.id} date="${c.departure_date}"`))

const pastDates = data.filter(c => {
  if (!c.departure_date) return false
  return new Date(c.departure_date) < new Date('2025-01-01')
})
console.log(`Departure before 2025: ${pastDates.length}`)
pastDates.slice(0, 5).forEach(c => console.log(`   → id=${c.id} date="${c.departure_date}" "${c.title?.slice(0, 60)}"`))

const farFuture = data.filter(c => {
  if (!c.departure_date) return false
  return new Date(c.departure_date) > new Date('2030-01-01')
})
console.log(`Departure after 2030: ${farFuture.length}`)
farFuture.slice(0, 5).forEach(c => console.log(`   → id=${c.id} date="${c.departure_date}" "${c.title?.slice(0, 60)}"`))

// 6. Duplicate check
console.log('\n--- DUPLICATES ---')
const slugs = new Map()
let duplicateSlugs = 0
data.forEach(c => {
  if (slugs.has(c.slug)) {
    duplicateSlugs++
    if (duplicateSlugs <= 3) {
      console.log(`  Duplicate slug: "${c.slug}"`)
      console.log(`    → id=${c.id} vs id=${slugs.get(c.slug)}`)
    }
  }
  slugs.set(c.slug, c.id)
})
console.log(`Total duplicate slugs: ${duplicateSlugs}`)

const ids = new Set()
let duplicateIds = 0
data.forEach(c => {
  if (ids.has(c.id)) duplicateIds++
  ids.add(c.id)
})
console.log(`Total duplicate IDs: ${duplicateIds}`)

// 7. Image URL validation
console.log('\n--- IMAGE URLS ---')
const brokenUrls = data.filter(c => c.image_url && !c.image_url.startsWith('http'))
console.log(`Non-HTTP image URLs: ${brokenUrls.length}`)
brokenUrls.slice(0, 3).forEach(c => console.log(`   → id=${c.id} url="${c.image_url?.slice(0, 60)}"`))

// 8. Itinerary/Cabin data richness
console.log('\n--- DATA RICHNESS ---')
const withItinerary = data.filter(c => c.itinerary.length > 0)
const withCabins = data.filter(c => c.cabin_types.length > 0)
const withGallery = data.filter(c => c.gallery_urls.length > 0)
const withMultipleDates = data.filter(c => c.departure_dates.length > 1)
const withPorts = data.filter(c => c.ports_of_call.length > 0)
console.log(`With itinerary: ${withItinerary.length} (${((withItinerary.length/data.length)*100).toFixed(1)}%)`)
console.log(`With cabin prices: ${withCabins.length} (${((withCabins.length/data.length)*100).toFixed(1)}%)`)
console.log(`With gallery: ${withGallery.length} (${((withGallery.length/data.length)*100).toFixed(1)}%)`)
console.log(`With multiple departure dates: ${withMultipleDates.length} (${((withMultipleDates.length/data.length)*100).toFixed(1)}%)`)
console.log(`With ports of call: ${withPorts.length} (${((withPorts.length/data.length)*100).toFixed(1)}%)`)

// 9. Cruise types
console.log('\n--- CRUISE TYPES ---')
const typeCount = {}
data.forEach(c => { typeCount[c.cruise_type] = (typeCount[c.cruise_type] || 0) + 1 })
Object.entries(typeCount).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
  console.log(`  ${count.toString().padStart(5)} | ${type}`)
})

console.log('\n========================================')
console.log('  AUDIT COMPLETE')
console.log('========================================')
