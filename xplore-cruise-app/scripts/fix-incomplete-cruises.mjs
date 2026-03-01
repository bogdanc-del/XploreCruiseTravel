/**
 * Fix 3,498 incomplete cruises by parsing fields from their titles.
 * Title format: "Croaziera {year} - {destination} ({port}) - {cruise_line} - {ship_name} - {nights} nopti"
 *
 * Reads: scripts/output/cruises-all.ndjson
 * Writes: scripts/output/cruises-all-fixed.ndjson (same format, patched fields)
 * Then re-runs transform to regenerate public/data/*.json
 */

import { readFileSync, writeFileSync } from 'fs'

const INPUT = 'scripts/output/cruises-all.ndjson'
const OUTPUT = 'scripts/output/cruises-all-fixed.ndjson'

console.log('Reading NDJSON...')
const lines = readFileSync(INPUT, 'utf8').split('\n').filter(l => l.trim())
console.log(`Total lines: ${lines.length}`)

let fixed = 0
let alreadyOk = 0
let failedParse = 0

const outputLines = []

for (const line of lines) {
  const cruise = JSON.parse(line)

  // If cruise already has cruise_line, skip
  if (cruise.cruise_line && cruise.destination && cruise.ship_name) {
    alreadyOk++
    outputLines.push(line)
    continue
  }

  // Parse from title: "Croaziera {year} - {destination} ({port}) - {cruise_line} - {ship_name} - {nights} nopti"
  const title = cruise.title || ''

  // Remove "Croaziera {year} - " prefix
  const withoutPrefix = title.replace(/^Croaziera\s+\d{4}\s*-\s*/i, '')

  // Split by " - " to get segments
  const segments = withoutPrefix.split(/\s+-\s+/).map(s => s.trim())

  if (segments.length >= 4) {
    // segments[0] = destination (possibly with port in parens)
    // segments[1] = cruise_line
    // segments[2] = ship_name
    // segments[3] = "N nopti"

    // Extract destination and departure port
    const destMatch = segments[0].match(/^(.+?)\s*\(([^)]+)\)\s*$/)
    const destination = destMatch ? destMatch[1].trim() : segments[0]
    const departurePort = destMatch ? destMatch[2].trim() : ''

    const cruiseLine = segments[1]
    const shipName = segments[2]

    // Only fill in missing fields
    if (!cruise.cruise_line) cruise.cruise_line = cruiseLine
    if (!cruise.ship_name) cruise.ship_name = shipName
    if (!cruise.destination) cruise.destination = destination
    if (!cruise.departure_port && departurePort) cruise.departure_port = departurePort

    // Also try to parse price from title if missing (usually from listing)
    // Price is typically already present from listing page scrape

    fixed++
  } else if (segments.length === 3) {
    // Sometimes ship name is missing: "destination (port) - cruise_line - N nopti"
    const destMatch = segments[0].match(/^(.+?)\s*\(([^)]+)\)\s*$/)
    const destination = destMatch ? destMatch[1].trim() : segments[0]
    const departurePort = destMatch ? destMatch[2].trim() : ''
    const cruiseLine = segments[1]

    if (!cruise.cruise_line) cruise.cruise_line = cruiseLine
    if (!cruise.destination) cruise.destination = destination
    if (!cruise.departure_port && departurePort) cruise.departure_port = departurePort

    fixed++
  } else {
    failedParse++
    console.log(`Could not parse (${segments.length} segments): ${title.substring(0, 100)}`)
  }

  outputLines.push(JSON.stringify(cruise))
}

console.log(`\n=== Results ===`)
console.log(`Already OK: ${alreadyOk}`)
console.log(`Fixed: ${fixed}`)
console.log(`Failed to parse: ${failedParse}`)

writeFileSync(OUTPUT, outputLines.join('\n') + '\n')
console.log(`\nWrote ${OUTPUT}`)
