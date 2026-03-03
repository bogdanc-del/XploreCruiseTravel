'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useT } from '@/i18n/context'
import { getPortCoordinates } from '@/data/port-coordinates'

// ============================================================
// Sea-route generation — keeps all routes over water
// ============================================================

/**
 * Comprehensive sea waypoints for every segment of every cruise.
 * Key: "CleanedFromName->CleanedToName" using the display-name
 * that appears after stripping ", Country" and "(…)" suffixes.
 *
 * The cleaned names for our 6 demo cruises are:
 *   Med:       Barcelona, Marseille, Genoa, Rome, Palermo, Valletta
 *   Greek:     Athens, Mykonos, Kusadasi, Patmos, Rhodes, Santorini
 *   Fjords:    Southampton, Bergen, Geiranger, Alesund, Stavanger, Flam
 *   Danube:    Budapest, Bratislava, Vienna, Durnstein, Melk, Passau
 *   Caribbean: Miami, FL, CocoCay, Cozumel, Roatan, Costa Maya
 *   Adriatic:  Venice, Dubrovnik, Kotor, Corfu, Katakolon, Mykonos
 */
const SEA_WAYPOINTS: Record<string, [number, number][]> = {
  // ── Western Mediterranean ──────────────────────────────────
  // Barcelona → Marseille (Gulf of Lion)
  'Barcelona->Marseille':   [[42.2, 3.8]],
  'Marseille->Barcelona':   [[42.2, 3.8]],
  // Marseille → Genoa (Ligurian Sea, off Côte d'Azur)
  'Marseille->Genoa':       [[43.4, 7.2]],
  'Genoa->Marseille':       [[43.4, 7.2]],
  // Genoa → Rome (down Italian west coast, Ligurian / Tyrrhenian Sea)
  'Genoa->Rome':            [[43.2, 9.8], [42.0, 11.2]],
  'Rome->Genoa':            [[42.0, 11.2], [43.2, 9.8]],
  // Rome → Palermo (Tyrrhenian Sea, past Naples)
  'Rome->Palermo':          [[40.5, 12.8], [39.2, 13.3]],
  'Palermo->Rome':          [[39.2, 13.3], [40.5, 12.8]],
  // Palermo → Valletta (south through Strait of Sicily)
  'Palermo->Valletta':      [[37.0, 13.5]],
  'Valletta->Palermo':      [[37.0, 13.5]],
  // Valletta → Barcelona (long return, south of Sardinia, across western Med)
  'Valletta->Barcelona':    [[37.2, 11.0], [38.0, 7.0], [39.5, 4.0]],
  'Barcelona->Valletta':    [[39.5, 4.0], [38.0, 7.0], [37.2, 11.0]],

  // ── Greek Islands & Turkey ─────────────────────────────────
  // Athens (Piraeus) → Mykonos (through Cyclades channel)
  'Athens->Mykonos':        [[37.65, 24.4]],
  'Mykonos->Athens':        [[37.65, 24.4]],
  // Mykonos → Kusadasi (short hop east to Turkey coast)
  'Mykonos->Kusadasi':      [[37.7, 26.3]],
  'Kusadasi->Mykonos':      [[37.7, 26.3]],
  // Kusadasi → Patmos (south through Dodecanese)
  'Kusadasi->Patmos':       [[37.5, 27.0]],
  'Patmos->Kusadasi':       [[37.5, 27.0]],
  // Patmos → Rhodes (southeast through islands)
  'Patmos->Rhodes':         [[36.8, 27.3]],
  'Rhodes->Patmos':         [[36.8, 27.3]],
  // Rhodes → Santorini (west across southern Aegean)
  'Rhodes->Santorini':      [[36.2, 27.0], [36.0, 26.0]],
  'Santorini->Rhodes':      [[36.0, 26.0], [36.2, 27.0]],
  // Santorini → Athens (northwest through Cyclades, STAY IN SEA)
  'Santorini->Athens':      [[36.8, 24.8], [37.3, 24.0]],
  'Athens->Santorini':      [[37.3, 24.0], [36.8, 24.8]],

  // ── Norwegian Fjords ───────────────────────────────────────
  // Southampton → Bergen (across North Sea)
  'Southampton->Bergen':    [[53.5, 0.5], [56.5, 2.5], [59.0, 4.0]],
  'Bergen->Southampton':    [[59.0, 4.0], [56.5, 2.5], [53.5, 0.5]],
  // Bergen → Geiranger (north along coast, into Storfjorden)
  'Bergen->Geiranger':      [[60.8, 4.5], [61.5, 5.0], [62.0, 6.0]],
  'Geiranger->Bergen':      [[62.0, 6.0], [61.5, 5.0], [60.8, 4.5]],
  // Geiranger → Alesund (out of fjord, short coastal hop)
  'Geiranger->Alesund':     [[62.2, 6.2], [62.4, 5.8]],
  'Alesund->Geiranger':     [[62.4, 5.8], [62.2, 6.2]],
  // Alesund → Stavanger (south along Norwegian coast, STAY AT SEA)
  'Alesund->Stavanger':     [[62.0, 4.8], [61.0, 4.2], [60.0, 4.5], [59.3, 5.0]],
  'Stavanger->Alesund':     [[59.3, 5.0], [60.0, 4.5], [61.0, 4.2], [62.0, 4.8]],
  // Stavanger → Flam (north up coast, into Sognefjord)
  'Stavanger->Flam':        [[59.3, 5.0], [59.8, 4.8], [60.3, 5.2], [60.6, 6.0]],
  'Flam->Stavanger':        [[60.6, 6.0], [60.3, 5.2], [59.8, 4.8], [59.3, 5.0]],
  // Flam → Southampton (exit fjord, south along coast, across North Sea)
  'Flam->Southampton':      [[60.6, 5.5], [60.0, 4.5], [58.5, 3.5], [55.5, 1.5], [52.5, -0.3]],
  'Southampton->Flam':      [[52.5, -0.3], [55.5, 1.5], [58.5, 3.5], [60.0, 4.5], [60.6, 5.5]],

  // ── Danube River Cruise (follow the river roughly) ─────────
  // These are river routes — use gentle waypoints along the Danube valley
  'Budapest->Bratislava':   [[47.75, 18.2]],
  'Bratislava->Budapest':   [[47.75, 18.2]],
  'Bratislava->Vienna':     [[48.15, 16.8]],
  'Vienna->Bratislava':     [[48.15, 16.8]],
  'Vienna->Durnstein':      [[48.3, 15.9]],
  'Durnstein->Vienna':      [[48.3, 15.9]],
  'Durnstein->Melk':        [[48.3, 15.4]],
  'Melk->Durnstein':        [[48.3, 15.4]],
  'Melk->Passau':           [[48.3, 14.5], [48.45, 13.8]],
  'Passau->Melk':           [[48.45, 13.8], [48.3, 14.5]],
  // Return: Passau → Budapest (long, follow Danube valley)
  'Passau->Budapest':       [[48.4, 14.5], [48.25, 15.8], [48.15, 17.0], [47.8, 18.3]],
  'Budapest->Passau':       [[47.8, 18.3], [48.15, 17.0], [48.25, 15.8], [48.4, 14.5]],

  // ── Caribbean ──────────────────────────────────────────────
  // Miami, FL → CocoCay (short hop east to Bahamas)
  'Miami, FL->CocoCay':     [[25.7, -79.0]],
  'CocoCay->Miami, FL':     [[25.7, -79.0]],
  // CocoCay → Cozumel (AVOID CUBA — stay north in Florida Straits lat≥24)
  'CocoCay->Cozumel':       [[25.3, -79.0], [24.8, -80.5], [24.6, -82.0],
                              [24.5, -83.5], [23.8, -85.2], [21.8, -86.2]],
  'Cozumel->CocoCay':       [[21.8, -86.2], [23.8, -85.2], [24.5, -83.5],
                              [24.6, -82.0], [24.8, -80.5], [25.3, -79.0]],
  // Cozumel → Roatan (south through Caribbean Sea)
  'Cozumel->Roatan':        [[19.0, -86.8], [17.5, -86.8]],
  'Roatan->Cozumel':        [[17.5, -86.8], [19.0, -86.8]],
  // Roatan → Costa Maya (north along coast, offshore)
  'Roatan->Costa Maya':     [[17.2, -87.3], [18.0, -87.8]],
  'Costa Maya->Roatan':     [[18.0, -87.8], [17.2, -87.3]],
  // Costa Maya → Miami, FL (return — AVOID CUBA — Yucatan Channel → Florida Straits)
  'Costa Maya->Miami, FL':  [[20.0, -87.0], [21.8, -86.2], [23.8, -85.2],
                              [24.5, -83.5], [24.6, -82.0], [24.8, -80.5],
                              [25.3, -80.2]],
  'Miami, FL->Costa Maya':  [[25.3, -80.2], [24.8, -80.5], [24.6, -82.0],
                              [24.5, -83.5], [23.8, -85.2], [21.8, -86.2],
                              [20.0, -87.0]],

  // ── Alaska (all routes far offshore in deep Pacific) ────
  // Vancouver → Victoria (out into Juan de Fuca Strait)
  'Vancouver->Victoria':        [[48.6, -124.0]],
  'Victoria->Vancouver':        [[48.6, -124.0]],
  // Vancouver → Sitka (far out into Pacific, well west of all islands)
  'Vancouver->Sitka':           [[49.0, -125.0], [49.5, -127.0], [50.5, -130.0],
                                  [51.5, -132.0], [52.5, -134.0], [53.5, -135.5],
                                  [54.5, -136.5], [55.5, -136.5], [56.5, -136.5]],
  'Sitka->Vancouver':           [[56.5, -136.5], [55.5, -136.5], [54.5, -136.5],
                                  [53.5, -135.5], [52.5, -134.0], [51.5, -132.0],
                                  [50.5, -130.0], [49.5, -127.0], [49.0, -125.0]],
  // Vancouver → Ketchikan (far offshore in Pacific)
  'Vancouver->Ketchikan':       [[49.0, -125.0], [49.5, -127.0], [50.5, -130.0],
                                  [51.5, -132.0], [52.5, -134.0], [53.5, -135.0],
                                  [54.5, -134.5]],
  'Ketchikan->Vancouver':       [[54.5, -134.5], [53.5, -135.0], [52.5, -134.0],
                                  [51.5, -132.0], [50.5, -130.0], [49.5, -127.0],
                                  [49.0, -125.0]],
  // Victoria → Ketchikan (out into Pacific, far west)
  'Victoria->Ketchikan':        [[48.0, -125.5], [49.0, -127.5], [50.5, -130.0],
                                  [51.5, -132.0], [52.5, -134.0], [53.5, -135.0],
                                  [54.5, -134.5]],
  'Ketchikan->Victoria':        [[54.5, -134.5], [53.5, -135.0], [52.5, -134.0],
                                  [51.5, -132.0], [50.5, -130.0], [49.0, -127.5],
                                  [48.0, -125.5]],
  // Ketchikan → Juneau (swing far west into Pacific, then approach Juneau)
  'Ketchikan->Juneau':          [[55.0, -133.5], [55.8, -135.5], [56.5, -137.0],
                                  [57.3, -137.0], [57.8, -136.0]],
  'Juneau->Ketchikan':          [[57.8, -136.0], [57.3, -137.0], [56.5, -137.0],
                                  [55.8, -135.5], [55.0, -133.5]],
  // Ketchikan → Sitka (west into Pacific)
  'Ketchikan->Sitka':           [[55.0, -133.5], [55.8, -135.5], [56.5, -137.0]],
  'Sitka->Ketchikan':           [[56.5, -137.0], [55.8, -135.5], [55.0, -133.5]],
  // Juneau → Skagway (north through Lynn Canal — open water channel)
  'Juneau->Skagway':            [[58.6, -135.2], [59.0, -135.3]],
  'Skagway->Juneau':            [[59.0, -135.3], [58.6, -135.2]],
  // Juneau → Glacier Bay (out west through open water)
  'Juneau->Glacier Bay':        [[58.2, -135.5], [58.3, -136.2], [58.5, -136.5]],
  'Glacier Bay->Juneau':        [[58.5, -136.5], [58.3, -136.2], [58.2, -135.5]],
  // Juneau → Sitka (far west offshore around all islands)
  'Juneau->Sitka':              [[58.0, -136.0], [57.5, -137.0], [57.0, -137.0]],
  'Sitka->Juneau':              [[57.0, -137.0], [57.5, -137.0], [58.0, -136.0]],
  // Juneau → Icy Strait Point (west through open water)
  'Juneau->Icy Strait Point':   [[58.2, -135.2], [58.2, -135.5]],
  'Icy Strait Point->Juneau':   [[58.2, -135.5], [58.2, -135.2]],
  // Sitka → Glacier Bay (north far offshore)
  'Sitka->Glacier Bay':         [[57.3, -137.0], [57.8, -137.0], [58.3, -136.8]],
  'Glacier Bay->Sitka':         [[58.3, -136.8], [57.8, -137.0], [57.3, -137.0]],
  // Glacier Bay → Skagway (east then north through Lynn Canal)
  'Glacier Bay->Skagway':       [[58.5, -136.2], [58.3, -135.5], [58.6, -135.2],
                                  [59.0, -135.3]],
  'Skagway->Glacier Bay':       [[59.0, -135.3], [58.6, -135.2], [58.3, -135.5],
                                  [58.5, -136.2]],
  // Icy Strait Point → Sitka (west far offshore)
  'Icy Strait Point->Sitka':    [[58.0, -136.5], [57.5, -137.0]],
  'Sitka->Icy Strait Point':    [[57.5, -137.0], [58.0, -136.5]],
  // Icy Strait Point → Ketchikan (south far offshore in Pacific)
  'Icy Strait Point->Ketchikan':[[57.8, -136.5], [57.0, -137.0], [56.0, -137.0],
                                  [55.5, -135.5], [55.0, -133.5]],
  'Ketchikan->Icy Strait Point':[[55.0, -133.5], [55.5, -135.5], [56.0, -137.0],
                                  [57.0, -137.0], [57.8, -136.5]],
  // Skagway → Sitka (south Lynn Canal, then far west offshore)
  'Skagway->Sitka':             [[59.0, -135.3], [58.6, -135.2], [58.0, -136.0],
                                  [57.5, -137.0], [57.0, -137.0]],
  'Sitka->Skagway':             [[57.0, -137.0], [57.5, -137.0], [58.0, -136.0],
                                  [58.6, -135.2], [59.0, -135.3]],
  // Skagway → Icy Strait Point (south through Lynn Canal)
  'Skagway->Icy Strait Point':  [[59.0, -135.3], [58.6, -135.2], [58.2, -135.5]],
  'Icy Strait Point->Skagway':  [[58.2, -135.5], [58.6, -135.2], [59.0, -135.3]],
  // Glacier Bay → Icy Strait Point
  'Glacier Bay->Icy Strait Point': [[58.5, -136.2], [58.2, -135.8]],
  'Icy Strait Point->Glacier Bay': [[58.2, -135.8], [58.5, -136.2]],

  // ── Adriatic ───────────────────────────────────────────────
  // Venice → Dubrovnik (down the Adriatic Sea)
  'Venice->Dubrovnik':      [[44.5, 13.5], [43.5, 15.0], [43.0, 16.5]],
  'Dubrovnik->Venice':      [[43.0, 16.5], [43.5, 15.0], [44.5, 13.5]],
  // Dubrovnik → Kotor (short coastal hop)
  'Dubrovnik->Kotor':       [[42.5, 18.5]],
  'Kotor->Dubrovnik':       [[42.5, 18.5]],
  // Kotor → Corfu (south along Albanian/Greek coast)
  'Kotor->Corfu':           [[41.5, 19.2], [40.5, 19.5]],
  'Corfu->Kotor':           [[40.5, 19.5], [41.5, 19.2]],
  // Corfu → Katakolon (south along Greek west coast, Ionian Sea)
  'Corfu->Katakolon':       [[38.8, 20.3], [38.0, 20.8]],
  'Katakolon->Corfu':       [[38.0, 20.8], [38.8, 20.3]],
  // Katakolon → Mykonos (AROUND southern Peloponnese, stay at sea!)
  'Katakolon->Mykonos':     [[36.8, 21.5], [36.3, 23.2], [36.5, 24.5]],
  'Mykonos->Katakolon':     [[36.5, 24.5], [36.3, 23.2], [36.8, 21.5]],
  // Katakolon → Athens (around Peloponnese)
  'Katakolon->Athens':      [[36.8, 21.5], [36.5, 22.8], [37.2, 23.5]],
  'Athens->Katakolon':      [[37.2, 23.5], [36.5, 22.8], [36.8, 21.5]],
  // Mykonos → Venice (LONG return — south around Peloponnese, up Adriatic)
  'Mykonos->Venice':        [[37.0, 24.5], [36.3, 23.0], [36.2, 21.5],
                              [37.5, 20.0], [39.0, 19.0], [41.0, 17.5],
                              [43.0, 15.5], [44.5, 13.5]],
  'Venice->Mykonos':        [[44.5, 13.5], [43.0, 15.5], [41.0, 17.5],
                              [39.0, 19.0], [37.5, 20.0], [36.2, 21.5],
                              [36.3, 23.0], [37.0, 24.5]],
  // Athens → Venice (similar long route)
  'Athens->Venice':         [[37.2, 23.0], [36.5, 21.5], [37.5, 20.0],
                              [39.0, 19.0], [41.0, 17.5], [43.0, 15.5],
                              [44.5, 13.5]],
  'Venice->Athens':         [[44.5, 13.5], [43.0, 15.5], [41.0, 17.5],
                              [39.0, 19.0], [37.5, 20.0], [36.5, 21.5],
                              [37.2, 23.0]],
}

/**
 * Calculate bearing angle (degrees) from point A to point B.
 * Used to orient arrow markers along the route.
 */
function bearing(
  from: [number, number],
  to: [number, number],
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const dLng = toRad(to[1] - from[1])
  const lat1 = toRad(from[0])
  const lat2 = toRad(to[0])
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/**
 * Compute the geographic length of a segment (sum of point-to-point distances).
 */
function segmentLength(seg: [number, number][]): number {
  let len = 0
  for (let i = 1; i < seg.length; i++) {
    len += Math.sqrt(
      (seg[i][0] - seg[i - 1][0]) ** 2 +
      (seg[i][1] - seg[i - 1][1]) ** 2,
    )
  }
  return len
}

/**
 * Place an arrowhead at the midpoint of each segment, pointing in the
 * direction of travel. Routes can intersect (cross each other) — we only
 * avoid placing two arrowheads at nearly identical positions.
 */
function addPortArrows(
  map: L.Map,
  _ports: { lat: number; lng: number }[],
  segmentRoutes: [number, number][][],
): void {
  const placed: [number, number][] = [] // track arrow positions to avoid overlap

  for (let i = 0; i < segmentRoutes.length; i++) {
    const seg = segmentRoutes[i]
    if (seg.length < 2) continue

    // Place arrow at the midpoint (50%) of the segment
    const midIdx = Math.floor(seg.length * 0.5)
    const nextIdx = Math.min(seg.length - 1, midIdx + 1)

    let lat = seg[midIdx][0]
    let lng = seg[midIdx][1]

    // Check if another arrow already sits very close to this position
    const tooClose = placed.some(
      ([pLat, pLng]) => Math.abs(pLat - lat) < 0.25 && Math.abs(pLng - lng) < 0.25,
    )
    if (tooClose) {
      // Shift to 35% along segment instead
      const altIdx = Math.floor(seg.length * 0.35)
      lat = seg[altIdx][0]
      lng = seg[altIdx][1]
    }

    const angle = bearing(seg[midIdx], seg[nextIdx])

    const arrowIcon = L.divIcon({
      className: 'route-arrow',
      html: `<div style="
        width: 22px; height: 22px;
        display: flex; align-items: center; justify-content: center;
        transform: rotate(${angle - 90}deg);
      "><svg width="18" height="18" viewBox="0 0 14 14" fill="none">
        <path d="M2 1L12 7L2 13L4.5 7L2 1Z" fill="#c9982a" stroke="#a07820" stroke-width="0.6"/>
      </svg></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    })

    L.marker([lat, lng], { icon: arrowIcon, interactive: false }).addTo(map)
    placed.push([lat, lng])
  }
}

/**
 * Smoothly interpolate between two points using simple linear steps.
 * Creates a visually smooth line without any lateral offset.
 */
function interpolate(
  from: [number, number],
  to: [number, number],
  numPoints = 10,
): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    pts.push([
      from[0] + t * (to[0] - from[0]),
      from[1] + t * (to[1] - from[1]),
    ])
  }
  return pts
}

/**
 * Build a smooth sea-route polyline through all ports.
 * Uses explicit sea waypoints to keep routes over water.
 * Returns both the full route and per-segment routes (for arrow placement).
 *
 * When a later segment overlaps with an earlier one (e.g. outbound and
 * return legs sharing the same Pacific coast), the overlapping portion is
 * pushed sideways with a smooth perpendicular offset so the two paths are
 * visually distinct. They can still intersect at a point — they just don't
 * sit on top of each other.
 */
function buildSeaRoute(
  ports: { name: string; lat: number; lng: number }[],
): { allPoints: [number, number][]; segments: [number, number][][] } {
  if (ports.length < 2) return { allPoints: ports.map(p => [p.lat, p.lng]), segments: [] }

  const allPoints: [number, number][] = []
  const segments: [number, number][][] = []
  const prevCloud: [number, number][] = [] // all points from completed segments
  allPoints.push([ports[0].lat, ports[0].lng])

  for (let i = 0; i < ports.length - 1; i++) {
    const from = ports[i]
    const to = ports[i + 1]

    const key = `${from.name}->${to.name}`
    const waypoints = SEA_WAYPOINTS[key]

    // Build the chain of points for this segment
    const chain: [number, number][] = [
      [from.lat, from.lng],
      ...(waypoints || []),
      [to.lat, to.lng],
    ]

    // First pass — generate raw interpolated points for this segment
    const rawPts: [number, number][] = [[from.lat, from.lng]]
    for (let j = 0; j < chain.length - 1; j++) {
      const pts = interpolate(chain[j], chain[j + 1], 8)
      for (let k = 1; k < pts.length; k++) {
        rawPts.push(pts[k])
      }
    }

    // Second pass — offset any intermediate point that overlaps a prior segment
    const PROXIMITY = 0.25 // degrees — points closer than this are "overlapping"
    const OFFSET_MAX = 0.45 // max perpendicular offset in degrees (~30 km)
    const segPoints: [number, number][] = [[from.lat, from.lng]]

    for (let p = 1; p < rawPts.length; p++) {
      let lat = rawPts[p][0]
      let lng = rawPts[p][1]

      const isEndpoint = p === rawPts.length - 1 // destination port stays fixed

      if (!isEndpoint && prevCloud.length > 0) {
        const overlaps = prevCloud.some(
          ([pLat, pLng]) =>
            Math.abs(pLat - lat) < PROXIMITY && Math.abs(pLng - lng) < PROXIMITY,
        )

        if (overlaps) {
          // Local travel direction from previous to next raw point
          const prev = rawPts[Math.max(0, p - 1)]
          const next = rawPts[Math.min(rawPts.length - 1, p + 1)]
          const dlat = next[0] - prev[0]
          const dlng = next[1] - prev[1]
          const len = Math.sqrt(dlat * dlat + dlng * dlng)

          if (len > 0) {
            // Smooth taper: offset is 0 at endpoints, max at center of segment
            const t = p / (rawPts.length - 1)
            const taper = Math.sin(t * Math.PI)
            const offset = OFFSET_MAX * taper

            // Push perpendicular — right side of travel direction
            lat += (dlng / len) * offset
            lng -= (dlat / len) * offset
          }
        }
      }

      const pt: [number, number] = [lat, lng]
      allPoints.push(pt)
      segPoints.push(pt)
    }

    // Add the raw (un-offset) points to prevCloud so future segments
    // detect overlaps against the original path, not the offset one.
    prevCloud.push(...rawPts)
    segments.push(segPoints)
  }

  return { allPoints, segments }
}

// ============================================================
// Port coordinate lookup — delegated to @/data/port-coordinates
// ============================================================
// 840+ port coordinates, sea-day filtering, fuzzy matching, and
// Romanian-format name parsing are handled by getPortCoordinates().
// SEA_WAYPOINTS above provide manual route curves between port pairs.

interface RouteMapProps {
  departurePort: string
  portsOfCall: string[]
  className?: string
  onPortClick?: (portName: string) => void
  isOneWay?: boolean
}

export default function RouteMap({ departurePort, portsOfCall, className = '', onPortClick, isOneWay = false }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const t = useT()

  const ports = useMemo(() => {
    const allPortNames = [departurePort, ...portsOfCall]
    return allPortNames
      .map(name => {
        const result = getPortCoordinates(name)
        if (!result) return null
        return { name: result.displayName, lat: result.coords[0], lng: result.coords[1] }
      })
      .filter(Boolean) as { name: string; lat: number; lng: number }[]
  }, [departurePort, portsOfCall])

  useEffect(() => {
    if (!mapRef.current || ports.length < 2) return

    // Avoid double-initialization
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Create map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: true,
    })

    mapInstanceRef.current = map

    // ESRI Ocean Basemap — deep blue water with bathymetric depth, nautical look
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, GEBCO, NOAA, National Geographic, DeLorme',
      maxZoom: 13,
    }).addTo(map)

    // Add reference labels on top of the ocean base
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', {
      attribution: '',
      maxZoom: 13,
    }).addTo(map)

    // Create custom icons
    const departureIcon = L.divIcon({
      className: 'custom-marker-departure',
      html: `<div style="
        width: 28px; height: 28px; border-radius: 50%;
        background: linear-gradient(135deg, #c9982a, #b8891e);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
        color: white; font-size: 14px;
      ">⚓</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    const portIcon = (index: number) => L.divIcon({
      className: 'custom-marker-port',
      html: `<div style="
        width: 24px; height: 24px; border-radius: 50%;
        background: white;
        border: 2.5px solid #0a1628;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
        color: #0a1628; font-size: 11px; font-weight: 700;
        font-family: system-ui, sans-serif;
      ">${index}</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })

    // Add markers
    ports.forEach((port, i) => {
      const latLng: L.LatLngExpression = [port.lat, port.lng]

      const isDeparture = i === 0
      const marker = L.marker(latLng, {
        icon: isDeparture ? departureIcon : portIcon(i),
        zIndexOffset: isDeparture ? 1000 : 0,
      }).addTo(map)

      // Permanent port name label on every port
      const portLabel = isDeparture
        ? `🚢 ${port.name}`
        : port.name
      const labelDirection = isDeparture ? 'right' as const : 'top' as const
      const labelOffset: [number, number] = isDeparture ? [14, 0] : [0, -16]
      marker.bindTooltip(portLabel, {
        permanent: true,
        direction: labelDirection,
        offset: labelOffset,
        className: isDeparture ? 'cruise-tooltip-permanent' : 'cruise-port-label',
      })

      // Click handler for port markers
      if (onPortClick && !isDeparture) {
        marker.on('click', () => {
          const originalName = portsOfCall[i - 1] || port.name
          onPortClick(originalName)
        })
        marker.getElement()?.style.setProperty('cursor', 'pointer')
      }
    })

    // Build the complete route — only close the loop for round-trip cruises
    const routePorts = isOneWay ? ports : [...ports, ports[0]]

    // Generate curved sea-route polyline
    const { allPoints: seaRoute, segments } = buildSeaRoute(routePorts)
    const routeLatLngs: L.LatLngExpression[] = seaRoute.map(
      ([lat, lng]) => [lat, lng] as L.LatLngExpression
    )

    // Draw subtle shadow line beneath
    L.polyline(routeLatLngs, {
      color: '#0a1628',
      weight: 5,
      opacity: 0.12,
      smoothFactor: 1.5,
    }).addTo(map)

    // Draw main route polyline — solid line (not dashed)
    const routeLine = L.polyline(routeLatLngs, {
      color: '#c9982a',
      weight: 3,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      smoothFactor: 1.5,
    }).addTo(map)

    // Add directional arrowheads near each destination port
    addPortArrows(map, ports, segments)

    // Fit map to route bounds with padding
    const bounds = routeLine.getBounds()
    map.fitBounds(bounds, { padding: [40, 40] })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ports, onPortClick])

  if (ports.length < 2) return null

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-navy-100 ${className}`}>
      {/* Map title overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-navy-100">
        <span className="text-xs font-semibold text-navy-600 uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          </svg>
          {t('map_title')}
        </span>
      </div>

      {/* Leaflet map container */}
      <div
        ref={mapRef}
        className="w-full"
        style={{ height: '380px' }}
      />

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-white border-t border-navy-100 text-xs text-navy-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gold-500 border-2 border-white shadow inline-block" />
          <span>{t('map_departure')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border-2 border-navy-800 inline-block" />
          <span>{t('map_port')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 border-t-2 border-gold-400 inline-block" />
          <span>{t('map_route')}</span>
        </div>
      </div>

      {/* Custom tooltip styles */}
      <style jsx global>{`
        .cruise-tooltip {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #0a1628 !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }
        .cruise-tooltip::before {
          border-top-color: white !important;
        }
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
        .route-arrow {
          background: none !important;
          border: none !important;
        }
        .leaflet-container {
          font-family: var(--font-body), system-ui, sans-serif !important;
        }
      `}</style>
    </div>
  )
}
