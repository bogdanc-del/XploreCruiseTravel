#!/usr/bin/env node
/**
 * generate-route-maps.mjs
 *
 * Generates static route-map images for every cruise in cruises.json.
 * Uses Puppeteer to render a Leaflet map with the exact same visual style
 * as the live RouteMap.tsx component, then screenshots it to WebP.
 *
 * Usage:
 *   node scripts/generate-route-maps.mjs                   # generate all missing
 *   node scripts/generate-route-maps.mjs --force            # regenerate all
 *   node scripts/generate-route-maps.mjs --slug=alaska-...  # single cruise
 *   node scripts/generate-route-maps.mjs --concurrency=3    # parallel tabs
 *
 * Output:
 *   public/data/route-maps/{slug}.webp   — 800×450 WebP image
 *   Updates cruises.json with route_map_url field
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CRUISES_PATH = path.join(ROOT, 'public/data/cruises.json')
const OUTPUT_DIR = path.join(ROOT, 'public/data/route-maps')

// ============================================================
// CLI args
// ============================================================
const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const SLUG_FILTER = args.find(a => a.startsWith('--slug='))?.split('=')[1] || null
const CONCURRENCY = parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '2', 10)

// ============================================================
// Port coordinates (subset — mirrors port-coordinates.ts)
// Full database loaded from the TS source at runtime
// ============================================================
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// We'll load port coordinates by evaluating the compiled JS
// For now, embed the lookup logic inline
let PORT_COORDS = null

function loadPortCoordinates() {
  // Read the TypeScript source and extract the PORT_COORDS object
  const tsPath = path.join(ROOT, 'src/data/port-coordinates.ts')
  const src = fs.readFileSync(tsPath, 'utf-8')

  // Extract the object literal between `export const PORT_COORDS ... = {` and the closing `}`
  const match = src.match(/export const PORT_COORDS[^=]*=\s*\{/)
  if (!match) throw new Error('Cannot find PORT_COORDS in port-coordinates.ts')

  const startIdx = src.indexOf('{', match.index)
  let depth = 0
  let endIdx = startIdx
  for (let i = startIdx; i < src.length; i++) {
    if (src[i] === '{') depth++
    if (src[i] === '}') depth--
    if (depth === 0) { endIdx = i; break }
  }

  const objStr = src.slice(startIdx, endIdx + 1)
    // Remove TypeScript type annotations
    .replace(/\/\/.*$/gm, '')  // line comments
    .replace(/as const/g, '')

  // Evaluate as JS
  PORT_COORDS = new Function(`return ${objStr}`)()
  console.log(`  Loaded ${Object.keys(PORT_COORDS).length} port coordinates`)
}

// ============================================================
// Port name parsing (mirrors port-name-utils.ts logic)
// ============================================================
const SEA_DAY_PATTERNS = [
  /^pe mare$/i,
  /^at sea$/i,
  /^sea day$/i,
  /^cruising/i,
  /^in mars$/i,
  /^navigatie$/i,
  /^zi de navigatie$/i,
  /^fun day at sea$/i,
  /^ocean cruise$/i,
]

function isSeaDay(name) {
  const clean = name.trim()
  return SEA_DAY_PATTERNS.some(p => p.test(clean))
}

function parsePortName(rawName) {
  let name = rawName.trim()
  // Remove parenthetical notes
  name = name.replace(/\s*\(.*?\)\s*/g, ' ').trim()
  // Strip country suffix after last comma (for display name)
  const parts = name.split(',').map(s => s.trim())
  // Keep "Miami, FL" style but remove "Barcelona, Spania"
  const countryPatterns = /^(Spania|Franta|Italia|Grecia|Turcia|Marea Britanie|Norvegia|Ungaria|Austria|Germania|Malta|Croatia|Muntenegru|Albania|Romania|Irlanda|Portugalia|Olanda|Belgia|Suedia|Danemarca|Finlanda|Islanda|Africa de Sud|Brazilia|Argentina|Australia|Noua Zeelanda|Japonia|China|India|Thailanda|Vietnam|Indonezia|Malaezia|Singapore|Filipine|Mexic|Honduras|Belize|Bahamas|Jamaica|Barbados|Bermuda|Canada|SUA|Egipt|Maroc|Tunisia|Israel|Cipru|Oman|EAU|Emiratele Arabe Unite|Aruba|Bonaire|Curacao|Cayman|Saint|St\.|Antigua|Dominica|Grenada|Martinica|Guadeloupe|Puerto Rico|Republica Dominicana|Haiti|Cuba|Seychelles|Maldive|Sri Lanka|Myanmar|Cambodgia|Fiji|Tahiti|Polinezia|Reunion|Madagascar|Mauritius|Mozambic|Tanzania|Kenya|Namibia|Senegal|Gambia|Capul Verde|Insulele|Guernsey|Jersey|Man|Gibraltar|Monaco|San Marino|Vatican)$/i
  if (parts.length >= 2 && countryPatterns.test(parts[parts.length - 1])) {
    return parts.slice(0, -1).join(', ').trim()
  }
  return name
}

function getPortCoords(rawName) {
  if (isSeaDay(rawName)) return null
  const displayName = parsePortName(rawName)

  // Direct lookup
  if (PORT_COORDS[displayName]) return { coords: PORT_COORDS[displayName], displayName }

  // Try first part before comma
  const firstName = displayName.split(',')[0].trim()
  if (PORT_COORDS[firstName]) return { coords: PORT_COORDS[firstName], displayName: firstName }

  // Fuzzy: case-insensitive search
  const lower = displayName.toLowerCase()
  for (const [key, val] of Object.entries(PORT_COORDS)) {
    if (key.toLowerCase() === lower) return { coords: val, displayName: key }
  }
  const lowerFirst = firstName.toLowerCase()
  for (const [key, val] of Object.entries(PORT_COORDS)) {
    if (key.toLowerCase() === lowerFirst) return { coords: val, displayName: key }
  }

  return null
}

// ============================================================
// SEA_WAYPOINTS (copied from RouteMap.tsx — must stay in sync)
// ============================================================
const SEA_WAYPOINTS = {
  'Barcelona->Marseille':[[42.2,3.8]],'Marseille->Barcelona':[[42.2,3.8]],
  'Marseille->Genoa':[[43.4,7.2]],'Genoa->Marseille':[[43.4,7.2]],
  'Genoa->Rome':[[43.2,9.8],[42.0,11.2]],'Rome->Genoa':[[42.0,11.2],[43.2,9.8]],
  'Rome->Palermo':[[40.5,12.8],[39.2,13.3]],'Palermo->Rome':[[39.2,13.3],[40.5,12.8]],
  'Palermo->Valletta':[[37.0,13.5]],'Valletta->Palermo':[[37.0,13.5]],
  'Valletta->Barcelona':[[37.2,11.0],[38.0,7.0],[39.5,4.0]],'Barcelona->Valletta':[[39.5,4.0],[38.0,7.0],[37.2,11.0]],
  'Athens->Mykonos':[[37.65,24.4]],'Mykonos->Athens':[[37.65,24.4]],
  'Mykonos->Kusadasi':[[37.7,26.3]],'Kusadasi->Mykonos':[[37.7,26.3]],
  'Kusadasi->Patmos':[[37.5,27.0]],'Patmos->Kusadasi':[[37.5,27.0]],
  'Patmos->Rhodes':[[36.8,27.3]],'Rhodes->Patmos':[[36.8,27.3]],
  'Rhodes->Santorini':[[36.2,27.0],[36.0,26.0]],'Santorini->Rhodes':[[36.0,26.0],[36.2,27.0]],
  'Santorini->Athens':[[36.8,24.8],[37.3,24.0]],'Athens->Santorini':[[37.3,24.0],[36.8,24.8]],
  'Southampton->Bergen':[[53.5,0.5],[56.5,2.5],[59.0,4.0]],'Bergen->Southampton':[[59.0,4.0],[56.5,2.5],[53.5,0.5]],
  'Bergen->Geiranger':[[60.8,4.5],[61.5,5.0],[62.0,6.0]],'Geiranger->Bergen':[[62.0,6.0],[61.5,5.0],[60.8,4.5]],
  'Geiranger->Alesund':[[62.2,6.2],[62.4,5.8]],'Alesund->Geiranger':[[62.4,5.8],[62.2,6.2]],
  'Alesund->Stavanger':[[62.0,4.8],[61.0,4.2],[60.0,4.5],[59.3,5.0]],'Stavanger->Alesund':[[59.3,5.0],[60.0,4.5],[61.0,4.2],[62.0,4.8]],
  'Stavanger->Flam':[[59.3,5.0],[59.8,4.8],[60.3,5.2],[60.6,6.0]],'Flam->Stavanger':[[60.6,6.0],[60.3,5.2],[59.8,4.8],[59.3,5.0]],
  'Flam->Southampton':[[60.6,5.5],[60.0,4.5],[58.5,3.5],[55.5,1.5],[52.5,-0.3]],'Southampton->Flam':[[52.5,-0.3],[55.5,1.5],[58.5,3.5],[60.0,4.5],[60.6,5.5]],
  'Budapest->Bratislava':[[47.75,18.2]],'Bratislava->Budapest':[[47.75,18.2]],
  'Bratislava->Vienna':[[48.15,16.8]],'Vienna->Bratislava':[[48.15,16.8]],
  'Vienna->Durnstein':[[48.3,15.9]],'Durnstein->Vienna':[[48.3,15.9]],
  'Durnstein->Melk':[[48.3,15.4]],'Melk->Durnstein':[[48.3,15.4]],
  'Melk->Passau':[[48.3,14.5],[48.45,13.8]],'Passau->Melk':[[48.45,13.8],[48.3,14.5]],
  'Passau->Budapest':[[48.4,14.5],[48.25,15.8],[48.15,17.0],[47.8,18.3]],'Budapest->Passau':[[47.8,18.3],[48.15,17.0],[48.25,15.8],[48.4,14.5]],
  'Miami, FL->CocoCay':[[25.7,-79.0]],'CocoCay->Miami, FL':[[25.7,-79.0]],
  'CocoCay->Cozumel':[[25.3,-79.0],[24.8,-80.5],[24.6,-82.0],[24.5,-83.5],[23.8,-85.2],[21.8,-86.2]],
  'Cozumel->CocoCay':[[21.8,-86.2],[23.8,-85.2],[24.5,-83.5],[24.6,-82.0],[24.8,-80.5],[25.3,-79.0]],
  'Cozumel->Roatan':[[19.0,-86.8],[17.5,-86.8]],'Roatan->Cozumel':[[17.5,-86.8],[19.0,-86.8]],
  'Roatan->Costa Maya':[[17.2,-87.3],[18.0,-87.8]],'Costa Maya->Roatan':[[18.0,-87.8],[17.2,-87.3]],
  'Costa Maya->Miami, FL':[[20.0,-87.0],[21.8,-86.2],[23.8,-85.2],[24.5,-83.5],[24.6,-82.0],[24.8,-80.5],[25.3,-80.2]],
  'Miami, FL->Costa Maya':[[25.3,-80.2],[24.8,-80.5],[24.6,-82.0],[24.5,-83.5],[23.8,-85.2],[21.8,-86.2],[20.0,-87.0]],
  'Vancouver->Victoria':[[48.6,-124.0]],'Victoria->Vancouver':[[48.6,-124.0]],
  'Vancouver->Sitka':[[49.0,-125.0],[49.5,-127.0],[50.5,-130.0],[51.5,-132.0],[52.5,-134.0],[53.5,-135.5],[54.5,-136.5],[55.5,-136.5],[56.5,-136.5]],
  'Sitka->Vancouver':[[56.5,-136.5],[55.5,-136.5],[54.5,-136.5],[53.5,-135.5],[52.5,-134.0],[51.5,-132.0],[50.5,-130.0],[49.5,-127.0],[49.0,-125.0]],
  'Vancouver->Ketchikan':[[49.0,-125.0],[49.5,-127.0],[50.5,-130.0],[51.5,-132.0],[52.5,-134.0],[53.5,-135.0],[54.5,-134.5]],
  'Ketchikan->Vancouver':[[54.5,-134.5],[53.5,-135.0],[52.5,-134.0],[51.5,-132.0],[50.5,-130.0],[49.5,-127.0],[49.0,-125.0]],
  'Victoria->Ketchikan':[[48.0,-125.5],[49.0,-127.5],[50.5,-130.0],[51.5,-132.0],[52.5,-134.0],[53.5,-135.0],[54.5,-134.5]],
  'Ketchikan->Victoria':[[54.5,-134.5],[53.5,-135.0],[52.5,-134.0],[51.5,-132.0],[50.5,-130.0],[49.0,-127.5],[48.0,-125.5]],
  'Ketchikan->Juneau':[[55.0,-133.5],[55.8,-135.5],[56.5,-137.0],[57.3,-137.0],[57.8,-136.0]],
  'Juneau->Ketchikan':[[57.8,-136.0],[57.3,-137.0],[56.5,-137.0],[55.8,-135.5],[55.0,-133.5]],
  'Ketchikan->Sitka':[[55.0,-133.5],[55.8,-135.5],[56.5,-137.0]],'Sitka->Ketchikan':[[56.5,-137.0],[55.8,-135.5],[55.0,-133.5]],
  'Juneau->Skagway':[[58.6,-135.2],[59.0,-135.3]],'Skagway->Juneau':[[59.0,-135.3],[58.6,-135.2]],
  'Juneau->Glacier Bay':[[58.2,-135.5],[58.3,-136.2],[58.5,-136.5]],'Glacier Bay->Juneau':[[58.5,-136.5],[58.3,-136.2],[58.2,-135.5]],
  'Juneau->Sitka':[[58.0,-136.0],[57.5,-137.0],[57.0,-137.0]],'Sitka->Juneau':[[57.0,-137.0],[57.5,-137.0],[58.0,-136.0]],
  'Juneau->Icy Strait Point':[[58.2,-135.2],[58.2,-135.5]],'Icy Strait Point->Juneau':[[58.2,-135.5],[58.2,-135.2]],
  'Sitka->Glacier Bay':[[57.3,-137.0],[57.8,-137.0],[58.3,-136.8]],'Glacier Bay->Sitka':[[58.3,-136.8],[57.8,-137.0],[57.3,-137.0]],
  'Glacier Bay->Skagway':[[58.5,-136.2],[58.3,-135.5],[58.6,-135.2],[59.0,-135.3]],
  'Skagway->Glacier Bay':[[59.0,-135.3],[58.6,-135.2],[58.3,-135.5],[58.5,-136.2]],
  'Icy Strait Point->Sitka':[[58.0,-136.5],[57.5,-137.0]],'Sitka->Icy Strait Point':[[57.5,-137.0],[58.0,-136.5]],
  'Icy Strait Point->Ketchikan':[[57.8,-136.5],[57.0,-137.0],[56.0,-137.0],[55.5,-135.5],[55.0,-133.5]],
  'Ketchikan->Icy Strait Point':[[55.0,-133.5],[55.5,-135.5],[56.0,-137.0],[57.0,-137.0],[57.8,-136.5]],
  'Skagway->Sitka':[[59.0,-135.3],[58.6,-135.2],[58.0,-136.0],[57.5,-137.0],[57.0,-137.0]],
  'Sitka->Skagway':[[57.0,-137.0],[57.5,-137.0],[58.0,-136.0],[58.6,-135.2],[59.0,-135.3]],
  'Skagway->Icy Strait Point':[[59.0,-135.3],[58.6,-135.2],[58.2,-135.5]],
  'Icy Strait Point->Skagway':[[58.2,-135.5],[58.6,-135.2],[59.0,-135.3]],
  'Glacier Bay->Icy Strait Point':[[58.5,-136.2],[58.2,-135.8]],
  'Icy Strait Point->Glacier Bay':[[58.2,-135.8],[58.5,-136.2]],
  'Venice->Dubrovnik':[[44.5,13.5],[43.5,15.0],[43.0,16.5]],'Dubrovnik->Venice':[[43.0,16.5],[43.5,15.0],[44.5,13.5]],
  'Dubrovnik->Kotor':[[42.5,18.5]],'Kotor->Dubrovnik':[[42.5,18.5]],
  'Kotor->Corfu':[[41.5,19.2],[40.5,19.5]],'Corfu->Kotor':[[40.5,19.5],[41.5,19.2]],
  'Corfu->Katakolon':[[38.8,20.3],[38.0,20.8]],'Katakolon->Corfu':[[38.0,20.8],[38.8,20.3]],
  'Katakolon->Mykonos':[[36.8,21.5],[36.3,23.2],[36.5,24.5]],'Mykonos->Katakolon':[[36.5,24.5],[36.3,23.2],[36.8,21.5]],
  'Katakolon->Athens':[[36.8,21.5],[36.5,22.8],[37.2,23.5]],'Athens->Katakolon':[[37.2,23.5],[36.5,22.8],[36.8,21.5]],
  'Mykonos->Venice':[[37.0,24.5],[36.3,23.0],[36.2,21.5],[37.5,20.0],[39.0,19.0],[41.0,17.5],[43.0,15.5],[44.5,13.5]],
  'Venice->Mykonos':[[44.5,13.5],[43.0,15.5],[41.0,17.5],[39.0,19.0],[37.5,20.0],[36.2,21.5],[36.3,23.0],[37.0,24.5]],
  'Athens->Venice':[[37.2,23.0],[36.5,21.5],[37.5,20.0],[39.0,19.0],[41.0,17.5],[43.0,15.5],[44.5,13.5]],
  'Venice->Athens':[[44.5,13.5],[43.0,15.5],[41.0,17.5],[39.0,19.0],[37.5,20.0],[36.5,21.5],[37.2,23.0]],
}

// ============================================================
// Route building logic (mirrors RouteMap.tsx exactly)
// ============================================================
function interpolate(from, to, numPoints = 10) {
  const pts = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    pts.push([from[0] + t * (to[0] - from[0]), from[1] + t * (to[1] - from[1])])
  }
  return pts
}

function bearing(from, to) {
  const toRad = d => (d * Math.PI) / 180
  const toDeg = r => (r * 180) / Math.PI
  const dLng = toRad(to[1] - from[1])
  const lat1 = toRad(from[0])
  const lat2 = toRad(to[0])
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function buildSeaRoute(ports) {
  if (ports.length < 2) return { allPoints: ports.map(p => [p.lat, p.lng]), segments: [] }

  const allPoints = []
  const segments = []
  const prevCloud = []
  allPoints.push([ports[0].lat, ports[0].lng])

  for (let i = 0; i < ports.length - 1; i++) {
    const from = ports[i]
    const to = ports[i + 1]
    const key = `${from.name}->${to.name}`
    const waypoints = SEA_WAYPOINTS[key]

    const chain = [[from.lat, from.lng], ...(waypoints || []), [to.lat, to.lng]]

    const rawPts = [[from.lat, from.lng]]
    for (let j = 0; j < chain.length - 1; j++) {
      const pts = interpolate(chain[j], chain[j + 1], 8)
      for (let k = 1; k < pts.length; k++) rawPts.push(pts[k])
    }

    const PROXIMITY = 0.25
    const OFFSET_MAX = 0.45
    const segPoints = [[from.lat, from.lng]]

    for (let p = 1; p < rawPts.length; p++) {
      let lat = rawPts[p][0]
      let lng = rawPts[p][1]
      const isEndpoint = p === rawPts.length - 1

      if (!isEndpoint && prevCloud.length > 0) {
        const overlaps = prevCloud.some(([pLat, pLng]) =>
          Math.abs(pLat - lat) < PROXIMITY && Math.abs(pLng - lng) < PROXIMITY
        )
        if (overlaps) {
          const prev = rawPts[Math.max(0, p - 1)]
          const next = rawPts[Math.min(rawPts.length - 1, p + 1)]
          const dlat = next[0] - prev[0]
          const dlng = next[1] - prev[1]
          const len = Math.sqrt(dlat * dlat + dlng * dlng)
          if (len > 0) {
            const t = p / (rawPts.length - 1)
            const taper = Math.sin(t * Math.PI)
            const offset = OFFSET_MAX * taper
            lat += (dlng / len) * offset
            lng -= (dlat / len) * offset
          }
        }
      }

      allPoints.push([lat, lng])
      segPoints.push([lat, lng])
    }

    prevCloud.push(...rawPts)
    segments.push(segPoints)
  }

  return { allPoints, segments }
}

// ============================================================
// HTML template for Puppeteer rendering
// ============================================================
function buildMapHTML(ports, routeData) {
  const { allPoints, segments } = routeData

  // Compute arrow data for each segment
  const arrows = []
  const placed = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (seg.length < 2) continue
    const midIdx = Math.floor(seg.length * 0.5)
    const nextIdx = Math.min(seg.length - 1, midIdx + 1)
    let lat = seg[midIdx][0]
    let lng = seg[midIdx][1]
    const tooClose = placed.some(([pLat, pLng]) =>
      Math.abs(pLat - lat) < 0.25 && Math.abs(pLng - lng) < 0.25
    )
    if (tooClose) {
      const altIdx = Math.floor(seg.length * 0.35)
      lat = seg[altIdx][0]
      lng = seg[altIdx][1]
    }
    const angle = bearing(seg[midIdx], seg[nextIdx])
    arrows.push({ lat, lng, angle })
    placed.push([lat, lng])
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 800px; height: 450px; overflow: hidden; }
    #map { width: 800px; height: 450px; }
    .cruise-tooltip-permanent {
      background: rgba(10, 22, 40, 0.85) !important;
      border: none !important;
      border-radius: 6px !important;
      padding: 3px 8px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      color: white !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2) !important;
    }
    .cruise-tooltip-permanent::before {
      border-right-color: rgba(10, 22, 40, 0.85) !important;
    }
    .cruise-port-label {
      background: rgba(255, 255, 255, 0.92) !important;
      backdrop-filter: blur(4px) !important;
      border: 1px solid rgba(10, 22, 40, 0.15) !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      color: #0a1628 !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12) !important;
      white-space: nowrap !important;
    }
    .cruise-port-label::before {
      border-top-color: rgba(255, 255, 255, 0.92) !important;
    }
    .route-arrow { background: none !important; border: none !important; }
    .custom-marker-departure, .custom-marker-port { background: none !important; border: none !important; }
  </style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="map"></div>
  <script>
    const ports = ${JSON.stringify(ports)};
    const allPoints = ${JSON.stringify(allPoints)};
    const arrows = ${JSON.stringify(arrows)};

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
    });

    // ESRI Ocean Basemap
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 13,
    }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 13,
    }).addTo(map);

    // Route polyline — shadow
    L.polyline(allPoints, { color: '#0a1628', weight: 5, opacity: 0.12, smoothFactor: 1.5 }).addTo(map);
    // Route polyline — main
    const routeLine = L.polyline(allPoints, {
      color: '#c9982a', weight: 3, opacity: 0.9,
      lineCap: 'round', lineJoin: 'round', smoothFactor: 1.5,
    }).addTo(map);

    // Arrows
    arrows.forEach(a => {
      const icon = L.divIcon({
        className: 'route-arrow',
        html: '<div style="width:22px;height:22px;display:flex;align-items:center;justify-content:center;transform:rotate(' + (a.angle - 90) + 'deg)"><svg width=\\'18\\' height=\\'18\\' viewBox=\\'0 0 14 14\\' fill=\\'none\\'><path d=\\'M2 1L12 7L2 13L4.5 7L2 1Z\\' fill=\\'#c9982a\\' stroke=\\'#a07820\\' stroke-width=\\'0.6\\'/></svg></div>',
        iconSize: [22, 22], iconAnchor: [11, 11],
      });
      L.marker([a.lat, a.lng], { icon, interactive: false }).addTo(map);
    });

    // Port markers
    ports.forEach((port, i) => {
      const isDeparture = i === 0;
      let icon;
      if (isDeparture) {
        icon = L.divIcon({
          className: 'custom-marker-departure',
          html: '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#c9982a,#b8891e);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px">⚓</div>',
          iconSize: [28, 28], iconAnchor: [14, 14],
        });
      } else {
        icon = L.divIcon({
          className: 'custom-marker-port',
          html: '<div style="width:24px;height:24px;border-radius:50%;background:white;border:2.5px solid #0a1628;box-shadow:0 2px 6px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;color:#0a1628;font-size:11px;font-weight:700;font-family:system-ui,sans-serif">' + i + '</div>',
          iconSize: [24, 24], iconAnchor: [12, 12],
        });
      }

      const marker = L.marker([port.lat, port.lng], { icon, zIndexOffset: isDeparture ? 1000 : 0 }).addTo(map);

      const label = isDeparture ? '🚢 ' + port.name : port.name;
      const dir = isDeparture ? 'right' : 'top';
      const offset = isDeparture ? [14, 0] : [0, -16];
      marker.bindTooltip(label, {
        permanent: true,
        direction: dir,
        offset: offset,
        className: isDeparture ? 'cruise-tooltip-permanent' : 'cruise-port-label',
      });
    });

    // Fit bounds
    map.fitBounds(routeLine.getBounds(), { padding: [35, 35] });

    // Signal ready after tiles load
    let tilesLoaded = 0;
    map.eachLayer(l => {
      if (l._url) {
        l.on('load', () => {
          tilesLoaded++;
          if (tilesLoaded >= 2) window.__MAP_READY = true;
        });
      }
    });

    // Fallback: mark ready after timeout
    setTimeout(() => { window.__MAP_READY = true; }, 8000);
  </script>
</body>
</html>`
}

// ============================================================
// Main execution
// ============================================================
async function main() {
  console.log('🗺️  Route Map Generator')
  console.log('========================')

  // Check for Puppeteer
  let puppeteer
  try {
    puppeteer = (await import('puppeteer')).default
  } catch {
    console.error('❌ Puppeteer not installed. Run: npm install -D puppeteer')
    process.exit(1)
  }

  // Load port coordinates
  console.log('📍 Loading port coordinates...')
  loadPortCoordinates()

  // Load cruises
  console.log('📦 Loading cruises.json...')
  const cruises = JSON.parse(fs.readFileSync(CRUISES_PATH, 'utf-8'))
  console.log(`  ${cruises.length} cruises loaded`)

  // Ensure output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  // Filter cruises to process
  let toProcess = cruises
  if (SLUG_FILTER) {
    toProcess = cruises.filter(c => c.slug === SLUG_FILTER)
    if (toProcess.length === 0) {
      console.error(`❌ No cruise found with slug: ${SLUG_FILTER}`)
      process.exit(1)
    }
  }

  // Determine which need generation
  const needGeneration = []
  for (const cruise of toProcess) {
    const outPath = path.join(OUTPUT_DIR, `${cruise.slug}.webp`)
    if (!FORCE && fs.existsSync(outPath)) continue

    // Resolve ports
    const allPortNames = [cruise.departure_port, ...(cruise.ports_of_call || [])]
    const ports = allPortNames
      .map(name => {
        const result = getPortCoords(name)
        if (!result) return null
        return { name: result.displayName, lat: result.coords[0], lng: result.coords[1] }
      })
      .filter(Boolean)

    // Need at least 2 ports to draw a route
    if (ports.length < 2) continue

    needGeneration.push({ cruise, ports })
  }

  console.log(`\n🎯 ${needGeneration.length} maps to generate (${FORCE ? 'forced' : 'missing only'})`)

  if (needGeneration.length === 0) {
    console.log('✅ All route maps are up to date!')
    process.exit(0)
  }

  // Launch browser
  console.log('🌐 Launching Puppeteer...')
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  let generated = 0
  let failed = 0
  const startTime = Date.now()

  // Process in batches for concurrency
  for (let i = 0; i < needGeneration.length; i += CONCURRENCY) {
    const batch = needGeneration.slice(i, i + CONCURRENCY)
    const promises = batch.map(async ({ cruise, ports }) => {
      const page = await browser.newPage()
      try {
        await page.setViewport({ width: 800, height: 450 })

        // Build route data (server-side)
        const routePorts = [...ports, ports[0]] // close the loop
        const routeData = buildSeaRoute(routePorts)

        // Build HTML
        const html = buildMapHTML(ports, routeData)

        // Load HTML
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 })

        // Wait for map tiles to load
        await page.waitForFunction(() => window.__MAP_READY === true, { timeout: 12000 })

        // Small extra delay for rendering
        await new Promise(r => setTimeout(r, 500))

        // Screenshot as WebP
        const outPath = path.join(OUTPUT_DIR, `${cruise.slug}.webp`)
        await page.screenshot({
          path: outPath,
          type: 'webp',
          quality: 85,
          clip: { x: 0, y: 0, width: 800, height: 450 },
        })

        generated++
        const pct = ((generated + failed) / needGeneration.length * 100).toFixed(0)
        process.stdout.write(`\r  [${pct}%] Generated: ${generated} | Failed: ${failed} | Current: ${cruise.slug.slice(0, 50)}...`)
      } catch (err) {
        failed++
        console.error(`\n  ⚠️  Failed: ${cruise.slug} — ${err.message}`)
      } finally {
        await page.close()
      }
    })

    await Promise.all(promises)
  }

  await browser.close()

  console.log(`\n\n📊 Results:`)
  console.log(`  ✅ Generated: ${generated}`)
  console.log(`  ❌ Failed: ${failed}`)
  console.log(`  ⏱️  Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`)

  // Update cruises.json with route_map_url
  if (generated > 0) {
    console.log('\n📝 Updating cruises.json with route_map_url...')
    let updated = 0
    for (const cruise of cruises) {
      const webpPath = path.join(OUTPUT_DIR, `${cruise.slug}.webp`)
      if (fs.existsSync(webpPath)) {
        cruise.route_map_url = `/data/route-maps/${cruise.slug}.webp`
        updated++
      }
    }
    fs.writeFileSync(CRUISES_PATH, JSON.stringify(cruises, null, 2))
    console.log(`  Updated ${updated} cruises with route_map_url`)
  }

  console.log('\n🎉 Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
