// Test bulk cruise fetch from croaziere.net API
const API_KEY = 'e4315add3071b92740bf093748432bfb'
const BASE = 'https://www.croaziere.net/api/v1.1/'

async function test() {
  // Test 1: Fetch first page of cruises
  console.log('=== Test 1: First page of cruises ===')
  const url1 = `${BASE}?api_key=${API_KEY}&section=cruises&output=json&page=1&per_page=5`
  const res1 = await fetch(url1)
  const data1 = await res1.json()
  const resp1 = data1.response || data1
  const cruises1 = resp1.cruises || []
  console.log(`Returned: ${cruises1.length} cruises`)
  if (cruises1.length > 0) {
    console.log(`First: id=${cruises1[0].id} "${cruises1[0].name}"`)
    console.log(`  Images: ${(cruises1[0].images || []).length}`)
    console.log(`  Price: ${cruises1[0].price} ${cruises1[0].currency}`)
    console.log(`  Departures: ${(cruises1[0].departures || []).length}`)
  }
  // Check for pagination metadata
  for (const k of Object.keys(resp1)) {
    if (k !== 'cruises') {
      console.log(`  META ${k}: ${JSON.stringify(resp1[k]).slice(0, 100)}`)
    }
  }

  // Test 2: Fetch all cruise IDs using filters
  console.log('\n=== Test 2: Get total cruise count ===')
  const url2 = `${BASE}?api_key=${API_KEY}&section=filters&output=json`
  const res2 = await fetch(url2)
  const data2 = await res2.json()
  const resp2 = data2.response || data2
  console.log('Filter response keys:', Object.keys(resp2))
  if (resp2.results_found !== undefined) {
    console.log(`Total results found: ${resp2.results_found}`)
  }

  // Test 3: See if we can get all cruise IDs without full data
  console.log('\n=== Test 3: Page 1 with per_page=50 ===')
  const url3 = `${BASE}?api_key=${API_KEY}&section=cruises&output=json&page=1&per_page=50`
  const res3 = await fetch(url3)
  const data3 = await res3.json()
  const resp3 = data3.response || data3
  const cruises3 = resp3.cruises || []
  console.log(`Returned: ${cruises3.length} cruises`)
  // Check total
  for (const k of Object.keys(resp3)) {
    if (k !== 'cruises') {
      console.log(`  META ${k}: ${JSON.stringify(resp3[k]).slice(0, 200)}`)
    }
  }

  // Test 4: Check image from a popular cruise (MSC, Royal Caribbean)
  console.log('\n=== Test 4: Sample cruise images ===')
  // Get a few known cruise IDs from our data
  const { readFileSync } = await import('fs')
  const index = JSON.parse(readFileSync('public/data/cruises-index.json', 'utf8'))
  // Pick first MSC and first Royal Caribbean
  const sampleIds = []
  const lines = new Set()
  for (const c of index) {
    if (!lines.has(c.cl) && sampleIds.length < 5) {
      lines.add(c.cl)
      sampleIds.push(c.id)
    }
  }
  console.log(`Sample IDs: ${sampleIds.join(',')}`)

  const url4 = `${BASE}?api_key=${API_KEY}&section=cruises&output=json&ids=${sampleIds.join(',')}`
  const res4 = await fetch(url4)
  const data4 = await res4.json()
  const resp4 = data4.response || data4
  const cruises4 = resp4.cruises || []
  for (const c of cruises4) {
    const imgs = c.images || []
    console.log(`  ${c.id} (${c.name.slice(0, 60)}...): ${imgs.length} images`)
    if (imgs.length > 0) {
      console.log(`    First: ${imgs[0]}`)
    }
  }
}

test().catch(console.error)
