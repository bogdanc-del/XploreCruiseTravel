import { readFileSync } from 'fs'
const html = readFileSync('scripts/output/sample-detail.html', 'utf-8')

console.log('Page URL from first detail URL')
console.log('Page size:', (html.length / 1024).toFixed(0), 'KB')

// 1. TITLE - h1
const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
console.log('\n=== TITLE (h1) ===')
if (h1) console.log(h1[1].replace(/<[^>]+>/g, '').trim().substring(0, 200))

// 2. OG Meta
const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
const ogDesc = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i)
const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
console.log('\n=== OG META ===')
if (ogTitle) console.log('OG Title:', ogTitle[1])
if (ogDesc) console.log('OG Desc:', ogDesc[1].substring(0, 200))
if (ogImage) console.log('OG Image:', ogImage[1])

// 3. Cruise info fields
console.log('\n=== FIELD GROUPS ===')
const fieldGroups = html.match(/<div[^>]*class="[^"]*field-group[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi)
if (fieldGroups) {
  fieldGroups.slice(0, 10).forEach((fg, i) => {
    const text = fg.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`Field ${i+1}:`, text.substring(0, 150))
  })
}

// 4. Port / Itinerary section
console.log('\n=== ITINERARY / PORTS ===')
const portHeaders = html.match(/<[^>]*class="[^"]*port-header[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi)
if (portHeaders) {
  console.log('Port headers found:', portHeaders.length)
  portHeaders.slice(0, 10).forEach((ph, i) => {
    const text = ph.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`  Port ${i+1}:`, text.substring(0, 100))
  })
}

const infoPorts = html.match(/<[^>]*class="[^"]*info-port[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi)
if (infoPorts) {
  console.log('Info-port blocks:', infoPorts.length)
  infoPorts.slice(0, 5).forEach((ip, i) => {
    const text = ip.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`  Info ${i+1}:`, text.substring(0, 200))
  })
}

// 5. Cabin section
console.log('\n=== CABINS ===')
const cabinCards = html.match(/<[^>]*class="[^"]*cruise-cabin-card[^"]*"[^>]*>([\s\S]*?)(?=<[^>]*class="[^"]*cruise-cabin-card|<\/div>\s*<\/div>\s*<\/div>)/gi)
if (cabinCards) {
  console.log('Cabin cards found:', cabinCards.length)
  cabinCards.slice(0, 5).forEach((cc, i) => {
    const text = cc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`  Cabin ${i+1}:`, text.substring(0, 200))
  })
}

// Look for cabin prices specifically
const cabinPrices = html.match(/<[^>]*class="[^"]*cabina-price[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/gi)
if (cabinPrices) {
  console.log('Cabin price elements:', cabinPrices.length)
  cabinPrices.slice(0, 8).forEach((cp, i) => {
    const text = cp.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`  Price ${i+1}:`, text.substring(0, 100))
  })
}

// 6. Dates section
console.log('\n=== DEPARTURE DATES ===')
const allDates = html.match(/<[^>]*class="[^"]*all-cruise-dates[^"]*"[^>]*>([\s\S]*?)(?=<\/section|<section|<footer)/i)
if (allDates) {
  const dateText = allDates[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  console.log('Dates section (first 500 chars):', dateText.substring(0, 500))
}

// 7. Price patterns
console.log('\n=== PRICE PATTERNS ===')
const prices = html.match(/class="[^"]*price[^"]*"[^>]*>[^<]*\d/gi)
if (prices) {
  prices.slice(0, 10).forEach((p, i) => {
    // Get surrounding context
    const idx = html.indexOf(p)
    const context = html.substring(idx, idx + 200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    console.log(`  Price ${i+1}:`, context.substring(0, 100))
  })
}

// 8. Header title area
console.log('\n=== HEADER/TITLE AREA ===')
const headerTitle = html.match(/<[^>]*class="[^"]*header-title-cruises[^"]*"[^>]*>([\s\S]*?)(?=<\/div>\s*<\/div>)/i)
if (headerTitle) {
  const text = headerTitle[1].replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n').trim()
  console.log(text.substring(0, 500))
}

// 9. Look for included/excluded
console.log('\n=== INCLUDED / EXCLUDED ===')
const inclMatch = html.match(/(?:includ|include|inclus)([\s\S]{0,2000})/i)
if (inclMatch) {
  const text = inclMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  console.log('Included section (first 300 chars):', text.substring(0, 300))
}

// 10. Ship image
console.log('\n=== IMAGES ===')
const images = html.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi)
if (images) {
  const unique = [...new Set(images.map(i => i.replace(/^src="/, '').replace(/"$/, '')))]
  console.log('Unique image URLs:', unique.length)
  unique.slice(0, 10).forEach(u => console.log('  ', u.substring(0, 120)))
}
