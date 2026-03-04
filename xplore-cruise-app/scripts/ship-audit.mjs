import fs from 'fs'

const cruises = JSON.parse(fs.readFileSync('public/data/cruises.json', 'utf8'))

// Count unique ships
const shipCounts = {}
for (const c of cruises) {
  const ship = c.ship_name || 'Unknown'
  if (!shipCounts[ship]) shipCounts[ship] = { count: 0, line: c.cruise_line || 'Unknown' }
  shipCounts[ship].count++
}

const ships = Object.entries(shipCounts).sort((a, b) => b[1].count - a[1].count)
console.log('=== SHIP AUDIT ===')
console.log('Total unique ships in catalog:', ships.length)

// Read ship-images.ts to find which ships have data
const shipImagesContent = fs.readFileSync('src/data/ship-images.ts', 'utf8')

// Extract ship names from SHIP_INFO object
const shipInfoNames = new Set()
const regex = /^\s+'([^']+)':\s*\{/gm
let match
while ((match = regex.exec(shipImagesContent)) !== null) {
  shipInfoNames.add(match[1])
}

// Also check SHIP_IMAGES for image overrides
const imgRegex = /^\s+'([^']+)':\s*'/gm
while ((match = imgRegex.exec(shipImagesContent)) !== null) {
  // These are image-only entries, not full ship info
}

console.log('Ships with full data in ship-images.ts:', shipInfoNames.size)
console.log('Ships in SHIP_INFO:', [...shipInfoNames].join(', '))

// Find gaps
const shipsWithData = []
const shipsWithoutData = []
for (const [name, data] of ships) {
  if (shipInfoNames.has(name)) {
    shipsWithData.push({ name, ...data })
  } else {
    shipsWithoutData.push({ name, ...data })
  }
}

console.log('\n=== SHIPS WITH FULL DATA (description + video) ===')
console.log('Count:', shipsWithData.length)
shipsWithData.forEach(s => console.log(`  ${s.count.toString().padStart(4)}x | ${s.line.padEnd(28)} | ${s.name}`))

console.log('\n=== SHIPS WITHOUT DATA ===')
console.log('Count:', shipsWithoutData.length)

// Group by cruise line
const byLine = {}
for (const s of shipsWithoutData) {
  if (!byLine[s.line]) byLine[s.line] = []
  byLine[s.line].push(s)
}

let totalCruisesWithoutShipData = 0
for (const [line, items] of Object.entries(byLine).sort((a, b) => b[1].length - a[1].length)) {
  const lineTotal = items.reduce((sum, s) => sum + s.count, 0)
  totalCruisesWithoutShipData += lineTotal
  console.log(`\n  ${line} (${items.length} ships, ${lineTotal} cruises):`)
  items.sort((a, b) => b.count - a.count).forEach(s => {
    console.log(`    ${s.count.toString().padStart(4)}x | ${s.name}`)
  })
}

console.log('\n=== SUMMARY ===')
console.log('Total ships:', ships.length)
console.log('With data:', shipsWithData.length, `(${Math.round(shipsWithData.length / ships.length * 100)}%)`)
console.log('Without data:', shipsWithoutData.length, `(${Math.round(shipsWithoutData.length / ships.length * 100)}%)`)
const totalCruises = cruises.length
const cruisesWithShipData = shipsWithData.reduce((sum, s) => sum + s.count, 0)
console.log('Cruises covered by ship data:', cruisesWithShipData, `of ${totalCruises} (${Math.round(cruisesWithShipData / totalCruises * 100)}%)`)
console.log('Cruises without ship data:', totalCruisesWithoutShipData, `(${Math.round(totalCruisesWithoutShipData / totalCruises * 100)}%)`)
