import { writeFileSync } from 'fs'

const res = await fetch('https://croaziere.net/sitemap.xml', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
})
const xml = await res.text()

console.log('Sitemap size:', (xml.length / 1024 / 1024).toFixed(2), 'MB')

// Extract ALL <loc> URLs
const locs = []
const locRegex = /<loc>([^<]+)<\/loc>/g
let m
while ((m = locRegex.exec(xml)) !== null) locs.push(m[1])

console.log('Total URLs:', locs.length)

// Categorize
const cruiseUrls = locs.filter(u => u.includes('/croaziere/'))
const detailPattern = /-i\d+\//
const detailUrls = cruiseUrls.filter(u => detailPattern.test(u))
const categoryUrls = cruiseUrls.filter(u => !detailPattern.test(u))

console.log('\nCruise-related URLs:', cruiseUrls.length)
console.log('Detail pages (-iNNN):', detailUrls.length)
console.log('Category/other:', categoryUrls.length)

console.log('\n=== First 15 detail URLs ===')
detailUrls.slice(0, 15).forEach(u => console.log(u))

console.log('\n=== First 15 category URLs ===')
categoryUrls.slice(0, 15).forEach(u => console.log(u))

// Extract IDs
const ids = detailUrls.map(u => {
  const idMatch = u.match(/-i(\d+)\//)
  return idMatch ? parseInt(idMatch[1]) : 0
}).filter(id => id > 0)

console.log('\n=== ID Stats ===')
console.log('Unique IDs:', new Set(ids).size)
console.log('Min ID:', Math.min(...ids))
console.log('Max ID:', Math.max(...ids))

// Save detail URLs for scraper
writeFileSync('scripts/output/sitemap-detail-urls.json', JSON.stringify(detailUrls, null, 2))
console.log('\nSaved', detailUrls.length, 'detail URLs to scripts/output/sitemap-detail-urls.json')

// Also save the first listing page to understand structure
console.log('\n=== Fetching first listing page to understand structure ===')
const listRes = await fetch('https://www.croaziere.net/croaziere/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
})
const listHtml = await listRes.text()
console.log('Listing page size:', (listHtml.length / 1024).toFixed(0), 'KB')

// Extract cruise cards from listing
const cardLinks = []
const linkRegex = /href="(\/croaziere\/[^"]*-i\d+\/)"/g
let linkMatch
while ((linkMatch = linkRegex.exec(listHtml)) !== null) {
  if (!cardLinks.includes(linkMatch[1])) cardLinks.push(linkMatch[1])
}
console.log('Cruise links on first listing page:', cardLinks.length)
cardLinks.slice(0, 5).forEach(l => console.log('  ', l))

// Save a sample of the listing HTML for analysis
writeFileSync('scripts/output/sample-listing.html', listHtml)
console.log('\nSaved sample listing HTML')

// Fetch one detail page
if (detailUrls.length > 0) {
  console.log('\n=== Fetching sample detail page ===')
  const detailRes = await fetch(detailUrls[0], {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
  })
  const detailHtml = await detailRes.text()
  console.log('Detail page size:', (detailHtml.length / 1024).toFixed(0), 'KB')
  writeFileSync('scripts/output/sample-detail.html', detailHtml)
  console.log('Saved sample detail HTML')
}
