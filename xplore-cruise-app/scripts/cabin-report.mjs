import fs from 'fs'

const enriched = JSON.parse(fs.readFileSync('public/data/cruises-enriched.json', 'utf8'))
const enrichedIdSet = new Set(Object.keys(enriched))
const cruises = JSON.parse(fs.readFileSync('public/data/cruises.json', 'utf8'))

const missing = cruises.filter(c => {
  const hasEnriched = enrichedIdSet.has(String(c.id))
  return !hasEnriched
})

console.log('=== CABIN DATA REPORT ===')
console.log('Total cruises:', cruises.length)
console.log('Enriched entries:', Object.keys(enriched).length)
console.log('')

// Coverage stats
let withRooms = 0
for (const key of Object.keys(enriched)) {
  if (enriched[key].rooms && enriched[key].rooms.length > 0) withRooms++
}
console.log('Enriched with rooms (cabin) data:', withRooms, '(' + Math.round(withRooms / Object.keys(enriched).length * 100) + '%)')
console.log('Cruises WITHOUT enriched data:', missing.length)

// Group missing by cruise line
const byLine = {}
for (const c of missing) {
  const line = c.cruise_line || 'Unknown'
  if (!byLine[line]) byLine[line] = []
  byLine[line].push({ id: c.id, title: (c.title || '').substring(0, 70), nights: c.nights, slug: c.slug })
}

console.log('\n=== MISSING CRUISES BY CRUISE LINE ===')
for (const [line, items] of Object.entries(byLine).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${line} (${items.length}):`)
  items.slice(0, 8).forEach(c => console.log(`  ${c.id} | ${c.nights}n | ${c.title}`))
  if (items.length > 8) console.log(`  ... +${items.length - 8} more`)
}

// MSC Armonia 1-night
const armonia1 = cruises.filter(c => c.ship_name === 'MSC Armonia' && c.nights === 1)
if (armonia1.length > 0) {
  console.log('\n=== MSC Armonia 1-night cruises ===')
  for (const c of armonia1) {
    const e = enriched[String(c.id)]
    console.log(`ID: ${c.id} | Slug: ${c.slug}`)
    console.log(`  Title: ${c.title}`)
    console.log(`  Enriched: ${e ? 'YES' : 'NO'}`)
    if (e) console.log(`  Rooms: ${e.rooms?.length || 0} | Gallery: ${e.gallery?.length || 0}`)
  }
}

// Also check: how does the detail API route serve rooms?
console.log('\n=== HOW CABIN DATA IS SERVED ===')
console.log('1. cruises.json (static) has NO cabin_types/rooms/date_prices')
console.log('2. cruises-enriched.json (keyed by cruise ID) has rooms for 8329/8330 entries')
console.log('3. The detail API /api/cruises/[slug] merges enriched rooms into _rooms field')
console.log('4. CabinSelector displays rooms grouped by category for the selected departure date')
console.log('5. 153 cruises have NO enriched data at all (likely scraping failures)')
