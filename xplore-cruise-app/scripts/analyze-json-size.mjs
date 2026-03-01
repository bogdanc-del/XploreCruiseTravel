/**
 * Analyze what's taking space in the cruise JSON files
 */
import { readFileSync } from 'fs'

const data = JSON.parse(readFileSync('public/data/cruises.json', 'utf8'))

// Measure field sizes
const fields = {}
for (const cruise of data) {
  for (const [key, val] of Object.entries(cruise)) {
    const size = JSON.stringify(val).length
    fields[key] = (fields[key] || 0) + size
  }
}

console.log('=== Field sizes in cruises.json (full) ===')
const sorted = Object.entries(fields).sort((a, b) => b[1] - a[1])
const totalSize = sorted.reduce((sum, [, size]) => sum + size, 0)
for (const [field, size] of sorted) {
  const pct = ((size / totalSize) * 100).toFixed(1)
  const mb = (size / 1024 / 1024).toFixed(2)
  console.log(`  ${mb.padStart(6)} MB (${pct.padStart(5)}%) | ${field}`)
}
console.log(`  ${(totalSize / 1024 / 1024).toFixed(2).padStart(6)} MB | TOTAL`)

// Check average itinerary size
const itin = data.filter(c => c.itinerary.length > 0)
const avgItinSize = itin.reduce((sum, c) => sum + JSON.stringify(c.itinerary).length, 0) / itin.length
console.log(`\nAvg itinerary size: ${(avgItinSize).toFixed(0)} bytes (${itin.length} cruises with itinerary)`)

// Check gallery_urls
const withGallery = data.filter(c => c.gallery_urls.length > 0)
const avgGallery = withGallery.reduce((sum, c) => sum + JSON.stringify(c.gallery_urls).length, 0) / withGallery.length
console.log(`Avg gallery_urls size: ${(avgGallery).toFixed(0)} bytes (${withGallery.length} cruises with gallery)`)

// Check title lengths
const avgTitle = data.reduce((sum, c) => sum + c.title.length, 0) / data.length
console.log(`Avg title length: ${avgTitle.toFixed(0)} chars`)

// Check source_url
const avgSourceUrl = data.reduce((sum, c) => sum + (c.source_url || '').length, 0) / data.length
console.log(`Avg source_url length: ${avgSourceUrl.toFixed(0)} chars`)

// Unique images count
const uniqueImages = new Set(data.map(c => c.image_url))
console.log(`\nUnique image URLs: ${uniqueImages.size} (of ${data.length} cruises)`)

// Slug length
const avgSlug = data.reduce((sum, c) => sum + c.slug.length, 0) / data.length
console.log(`Avg slug length: ${avgSlug.toFixed(0)} chars`)
