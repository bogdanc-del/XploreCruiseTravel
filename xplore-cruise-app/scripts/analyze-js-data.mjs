import { readFileSync } from 'fs'
const html = readFileSync('scripts/output/sample-detail.html', 'utf-8')

// Find all JavaScript variable assignments
console.log('=== JavaScript Data Variables ===\n')

// Look for const/var/let assignments with data
const jsVars = html.match(/(?:const|var|let)\s+\$_?\w+\s*=\s*[\[{]/g)
if (jsVars) {
  console.log('JS variable declarations found:', jsVars.length)
  jsVars.forEach(v => console.log('  ', v))
}

// Extract $_ports
const portsMatch = html.match(/\$_ports\s*=\s*(\[[\s\S]*?\]);/i)
if (portsMatch) {
  try {
    const ports = JSON.parse(portsMatch[1])
    console.log('\n=== $_ports ===')
    console.log('Count:', ports.length)
    console.log('First port:', JSON.stringify(ports[0], null, 2))
    if (ports.length > 1) console.log('Second port:', JSON.stringify(ports[1], null, 2))
  } catch (e) {
    console.log('Failed to parse $_ports:', e.message)
    console.log('Raw (first 500):', portsMatch[1].substring(0, 500))
  }
}

// Extract any other data variables
const patterns = [
  /\$_cabins?\s*=\s*(\[[\s\S]*?\]);/i,
  /\$_dates?\s*=\s*(\[[\s\S]*?\]);/i,
  /\$_prices?\s*=\s*(\[[\s\S]*?\]);/i,
  /\$_ship\s*=\s*({[\s\S]*?});/i,
  /\$_cruise\s*=\s*({[\s\S]*?});/i,
  /\$_itinerary?\s*=\s*(\[[\s\S]*?\]);/i,
  /cruiseData\s*=\s*({[\s\S]*?});/i,
  /var\s+(\w+)\s*=\s*(\[[\s\S]*?\]);/gi,
]

for (const pattern of patterns) {
  const match = html.match(pattern)
  if (match) {
    console.log('\nFound pattern:', pattern.toString().substring(0, 50))
    const data = match[1] || match[2]
    try {
      const parsed = JSON.parse(data)
      console.log('Parsed OK, type:', Array.isArray(parsed) ? `array[${parsed.length}]` : 'object')
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('First item:', JSON.stringify(parsed[0], null, 2).substring(0, 500))
      } else {
        console.log('Data:', JSON.stringify(parsed, null, 2).substring(0, 500))
      }
    } catch (e) {
      console.log('Raw (first 300):', data.substring(0, 300))
    }
  }
}

// Look for all JSON-like structures in script tags
console.log('\n=== All Script Tags with Data ===')
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
if (scripts) {
  console.log('Total script tags:', scripts.length)
  scripts.forEach((s, i) => {
    const content = s.replace(/<\/?script[^>]*>/gi, '').trim()
    if (content.length > 50 && (content.includes('$_') || content.includes('ports') || content.includes('cabin') || content.includes('price') || content.includes('cruise'))) {
      console.log(`\nScript ${i+1} (${content.length} chars):`)
      console.log(content.substring(0, 800))
      console.log('...')
    }
  })
}

// Look for data attributes
console.log('\n=== Data Attributes ===')
const dataAttrs = html.match(/data-(?:cruise|port|cabin|price|date|ship|id)[^=]*="[^"]+"/gi)
if (dataAttrs) {
  const unique = [...new Set(dataAttrs)].slice(0, 20)
  unique.forEach(d => console.log('  ', d))
}
