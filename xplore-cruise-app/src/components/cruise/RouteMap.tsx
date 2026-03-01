'use client'

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useT } from '@/i18n/context'

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
 */
function buildSeaRoute(
  ports: { name: string; lat: number; lng: number }[],
): [number, number][] {
  if (ports.length < 2) return ports.map(p => [p.lat, p.lng])

  const allPoints: [number, number][] = []
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

    // Interpolate smoothly between each pair in the chain
    for (let j = 0; j < chain.length - 1; j++) {
      const pts = interpolate(chain[j], chain[j + 1], 8)
      // Skip first point to avoid duplicates
      for (let k = 1; k < pts.length; k++) {
        allPoints.push(pts[k])
      }
    }
  }

  return allPoints
}

// ============================================================
// Port coordinates database (lat, lng)
// ============================================================

const PORT_COORDS: Record<string, [number, number]> = {
  // Mediterranean
  'Barcelona': [41.3851, 2.1734],
  'Barcelona, Spain': [41.3851, 2.1734],
  'Marseille': [43.2965, 5.3698],
  'Marsilia': [43.2965, 5.3698],
  'Genoa': [44.4056, 8.9463],
  'Genova': [44.4056, 8.9463],
  'Rome': [41.9028, 12.4964],
  'Roma': [41.9028, 12.4964],
  'Palermo': [38.1157, 13.3615],
  'Valletta': [35.8989, 14.5146],
  // Greek Islands & Turkey
  'Athens (Piraeus), Greece': [37.9474, 23.6432],
  'Athens': [37.9474, 23.6432],
  'Piraeus': [37.9474, 23.6432],
  'Mykonos': [37.4467, 25.3289],
  'Kusadasi': [37.8579, 27.2610],
  'Patmos': [37.3109, 26.5458],
  'Rhodes': [36.4349, 28.2176],
  'Rodos': [36.4349, 28.2176],
  'Santorini': [36.3932, 25.4615],
  // Northern Europe / Fjords
  'Southampton, UK': [50.9097, -1.4044],
  'Southampton': [50.9097, -1.4044],
  'Bergen': [60.3913, 5.3221],
  'Geiranger': [62.1008, 7.2059],
  'Alesund': [62.4722, 6.1549],
  'Stavanger': [58.9700, 5.7331],
  'Flam': [60.8628, 7.1137],
  // Danube River
  'Budapest': [47.4979, 19.0402],
  'Budapest, Hungary': [47.4979, 19.0402],
  'Bratislava': [48.1486, 17.1077],
  'Vienna': [48.2082, 16.3738],
  'Viena': [48.2082, 16.3738],
  'Durnstein': [48.3947, 15.5189],
  'Melk': [48.2274, 15.3320],
  'Passau': [48.5665, 13.4319],
  // Caribbean
  'Miami, FL, USA': [25.7617, -80.1918],
  'Miami': [25.7617, -80.1918],
  'CocoCay': [25.7830, -77.9410],
  'Cozumel': [20.4230, -86.9223],
  'Roatan': [16.3200, -86.5267],
  'Costa Maya': [18.7274, -87.6930],
  // Adriatic
  'Venice': [45.4408, 12.3155],
  'Venice, Italy': [45.4408, 12.3155],
  'Dubrovnik': [42.6507, 18.0944],
  'Kotor': [42.4247, 18.7712],
  'Corfu': [39.6243, 19.9217],
  'Katakolon': [37.6436, 21.3190],
}

interface RouteMapProps {
  departurePort: string
  portsOfCall: string[]
  className?: string
  onPortClick?: (portName: string) => void
}

export default function RouteMap({ departurePort, portsOfCall, className = '', onPortClick }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const t = useT()

  const ports = useMemo(() => {
    const allPortNames = [departurePort, ...portsOfCall]
    return allPortNames
      .map(name => {
        const coords = PORT_COORDS[name]
        if (!coords) return null
        return { name: name.replace(/, [A-Za-z]+$/, '').replace(/ \([^)]+\)/, ''), lat: coords[0], lng: coords[1] }
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

    // Use a clean, nautical-style tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
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

      // Tooltip with port name
      const label = isDeparture ? `🚢 ${port.name} (${t('map_departure_label')})` : `${i}. ${port.name}`
      marker.bindTooltip(label, {
        permanent: false,
        direction: 'top',
        offset: [0, -14],
        className: 'cruise-tooltip',
      })

      // Click handler for port markers
      if (onPortClick && !isDeparture) {
        marker.on('click', () => {
          // Find the original port name from portsOfCall
          const originalName = portsOfCall[i - 1] || port.name
          onPortClick(originalName)
        })
        // Pointer cursor for clickable ports
        marker.getElement()?.style.setProperty('cursor', 'pointer')
      }

      // Show tooltip on hover (permanent labels for small screens would be too cluttered)
      if (isDeparture) {
        marker.bindTooltip(`🚢 ${port.name}`, {
          permanent: true,
          direction: 'right',
          offset: [14, 0],
          className: 'cruise-tooltip-permanent',
        })
      }
    })

    // Build the complete route including return to departure
    const routePorts = [...ports, ports[0]] // close the loop

    // Generate curved sea-route polyline
    const seaRoute = buildSeaRoute(routePorts)
    const routeLatLngs: L.LatLngExpression[] = seaRoute.map(
      ([lat, lng]) => [lat, lng] as L.LatLngExpression
    )

    // Draw subtle shadow line beneath
    L.polyline(routeLatLngs, {
      color: '#0a1628',
      weight: 5,
      opacity: 0.1,
      smoothFactor: 1.5,
    }).addTo(map)

    // Draw main route polyline with dashed style
    const routeLine = L.polyline(routeLatLngs, {
      color: '#c9982a',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 6',
      lineCap: 'round',
      lineJoin: 'round',
      smoothFactor: 1.5,
    }).addTo(map)

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
          <span className="w-6 border-t-2 border-dashed border-gold-400 inline-block" />
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
        .leaflet-container {
          font-family: var(--font-body), system-ui, sans-serif !important;
        }
      `}</style>
    </div>
  )
}
