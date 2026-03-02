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
// Port coordinates database (lat, lng) — comprehensive
// ============================================================

const PORT_COORDS: Record<string, [number, number]> = {
  // ── Western Mediterranean ──────────────────────────────
  'Barcelona': [41.3851, 2.1734],
  'Marseille': [43.2965, 5.3698],
  'Marsilia': [43.2965, 5.3698],
  'Genoa': [44.4056, 8.9463],
  'Genova': [44.4056, 8.9463],
  'Rome': [42.0932, 11.7968],
  'Roma': [42.0932, 11.7968],
  'Civitavecchia': [42.0932, 11.7968],
  'Palermo': [38.1157, 13.3615],
  'Valletta': [35.8989, 14.5146],
  'Savona': [44.3091, 8.4772],
  'La Spezia': [44.1024, 9.8244],
  'Livorno': [43.5485, 10.3106],
  'Florenta': [43.5485, 10.3106],
  'Florence': [43.5485, 10.3106],
  'Nice': [43.7102, 7.2620],
  'Villefranche': [43.7040, 7.3098],
  'Cannes': [43.5528, 7.0174],
  'Monte Carlo': [43.7384, 7.4246],
  'Monaco': [43.7384, 7.4246],
  'Toulon': [43.1242, 5.9280],
  'Portofino': [44.3033, 9.2086],
  'Napoli': [40.8518, 14.2681],
  'Naples': [40.8518, 14.2681],
  'Amalfi': [40.6340, 13.5719],
  'Sorrento': [40.6263, 14.3756],
  'Positano': [40.6281, 14.4849],
  'Salerno': [40.6824, 14.7681],
  'Capri': [40.5534, 14.2225],
  'Cagliari': [39.2238, 9.1217],
  'Olbia': [40.9234, 9.5019],
  'Porto Cervo': [41.1310, 9.5318],
  'Alghero': [40.5584, 8.3190],
  'Messina': [38.1937, 15.5540],
  'Catania': [37.5079, 15.0830],
  'Siracusa': [37.0755, 15.2866],
  'Syracuse': [37.0755, 15.2866],
  'Taormina': [37.8522, 15.2866],
  'Trapani': [38.0174, 12.5141],
  'Lipari': [38.4672, 14.9539],
  'Stromboli': [38.7893, 15.2136],
  'Brindisi': [40.6327, 17.9413],
  'Bari': [41.1171, 16.8719],
  'Ancona': [43.6158, 13.5184],
  'Ravenna': [44.4184, 12.2035],
  'Trieste': [45.6495, 13.7768],
  'Piombino': [42.9262, 10.5261],
  'Porto Torres': [40.8416, 8.4027],
  'Porto Santo Stefano': [42.4373, 11.1175],
  'Portoferraio': [42.8158, 10.3303],
  'Porto Vecchio': [41.5910, 9.2801],
  'Portul Vecchio': [41.5910, 9.2801],

  // ── Corsica ────────────────────────────────────────────
  'Ajaccio': [41.9267, 8.7369],
  'Bastia': [42.6970, 9.4504],
  'Bonifacio': [41.3875, 9.1592],
  'Calvi': [42.5677, 8.7570],

  // ── France — Atlantic & Channel ────────────────────────
  'Bordeaux': [44.8378, -0.5792],
  'La Rochelle': [46.1591, -1.1520],
  'Le Havre': [49.4944, 0.1079],
  'Honfleur': [49.4186, 0.2332],
  'Rouen': [49.4432, 1.0993],
  'St. Malo': [48.6493, -2.0065],
  'Saint Malo': [48.6493, -2.0065],
  'St. Tropez': [43.2727, 6.6393],
  'Biarritz': [43.4832, -1.5586],
  'St. Jean de Luz': [43.3883, -1.6603],
  'Paris': [48.8566, 2.3522],

  // ── Spain ──────────────────────────────────────────────
  'Palma de Mallorca': [39.5696, 2.6502],
  'Ibiza': [38.9067, 1.4206],
  'Malaga': [36.7213, -4.4214],
  'Cadiz': [36.5271, -6.2886],
  'Valencia': [39.4699, -0.3763],
  'Alicante': [38.3452, -0.4810],
  'Cartagena': [37.6005, -0.9816],
  'Vigo': [42.2406, -8.7207],
  'La Coruna': [43.3623, -8.4115],
  'Bilbao': [43.2627, -2.9253],
  'Santander': [43.4623, -3.8100],
  'Gijon': [43.5322, -5.6611],
  'Algeciras': [36.1408, -5.4505],
  'Motril': [36.7230, -3.5175],
  'Almeria': [36.8340, -2.4637],
  'Tarragona': [41.1189, 1.2445],
  'Roses': [42.2615, 3.1762],
  'Palamos': [41.8504, 3.1280],
  'Castellon': [39.9864, -0.0513],
  'Sevilla': [37.3891, -5.9845],
  'Seville': [37.3891, -5.9845],

  // ── Portugal & Atlantic islands ────────────────────────
  'Lisbon': [38.7223, -9.1393],
  'Lisabona': [38.7223, -9.1393],
  'Leixoes': [41.1837, -8.7029],
  'Porto': [41.1579, -8.6291],
  'Oporto': [41.1579, -8.6291],
  'Portimao': [37.1300, -8.5369],
  'Funchal': [32.6669, -16.9241],
  'Madeira': [32.6669, -16.9241],
  'Ponta Delgada': [37.7483, -25.6666],

  // ── Canary Islands ─────────────────────────────────────
  'Santa Cruz de Tenerife': [28.4636, -16.2518],
  'Tenerife': [28.4636, -16.2518],
  'Las Palmas': [28.1235, -15.4363],
  'Gran Canaria': [28.1235, -15.4363],
  'Arrecife': [28.9630, -13.5477],
  'Lanzarote': [28.9630, -13.5477],
  'Puerto del Rosario': [28.5004, -13.8627],
  'La Gomera': [28.0916, -17.1133],
  'San Sebastian de la Gomera': [28.0916, -17.1133],
  'La Palma': [28.6835, -17.7642],
  'Santa Cruz de la Palma': [28.6835, -17.7642],

  // ── Greece ─────────────────────────────────────────────
  'Athens': [37.9474, 23.6432],
  'Atena': [37.9474, 23.6432],
  'Piraeus': [37.9474, 23.6432],
  'Mykonos': [37.4467, 25.3289],
  'Santorini': [36.3932, 25.4615],
  'Rhodes': [36.4349, 28.2176],
  'Rodos': [36.4349, 28.2176],
  'Corfu': [39.6243, 19.9217],
  'Katakolon': [37.6436, 21.3190],
  'Olympia': [37.6436, 21.3190],
  'Kusadasi': [37.8579, 27.2610],
  'Ephesus': [37.8579, 27.2610],
  'Patmos': [37.3109, 26.5458],
  'Heraklion': [35.3387, 25.1442],
  'Creta': [35.3387, 25.1442],
  'Chania': [35.5138, 24.0180],
  'Thessaloniki': [40.6401, 22.9444],
  'Nafplion': [37.5673, 22.8013],
  'Volos': [39.3666, 22.9427],
  'Zakynthos': [37.7872, 20.8979],
  'Kefalonia': [38.1753, 20.4891],
  'Argostoli': [38.1753, 20.4891],
  'Syros': [37.4443, 24.9417],
  'Paros': [37.0853, 25.1521],
  'Ios': [36.7231, 25.2822],
  'Hydra': [37.3483, 23.4627],
  'Monemvasia': [36.6884, 23.0580],
  'Gythion': [36.7583, 22.5623],
  'Delphi': [38.4824, 22.5008],
  'Itea': [38.4313, 22.4217],
  'Aghios Nikolaos': [35.1920, 25.7168],

  // ── Turkey ─────────────────────────────────────────────
  'Istanbul': [41.0082, 28.9784],
  'Bodrum': [37.0344, 27.4305],
  'Marmaris': [36.8510, 28.2738],
  'Antalya': [36.8969, 30.7133],
  'Izmir': [38.4237, 27.1428],
  'Cesme': [38.3221, 26.3036],

  // ── Adriatic & Croatia ─────────────────────────────────
  'Venice': [45.4408, 12.3155],
  'Venetia': [45.4408, 12.3155],
  'Dubrovnik': [42.6507, 18.0944],
  'Kotor': [42.4247, 18.7712],
  'Split': [43.5081, 16.4402],
  'Hvar': [43.1726, 16.4422],
  'Korcula': [42.9596, 17.1355],
  'Zadar': [44.1194, 15.2314],
  'Rovinj': [45.0812, 13.6387],
  'Pula': [44.8666, 13.8496],
  'Rijeka': [45.3271, 14.4422],
  'Sibenik': [43.7350, 15.8952],
  'Vodice': [43.7612, 15.7752],
  'Koper': [45.5469, 13.7295],
  'Piran': [45.5283, 13.5681],
  'Opatija': [45.3372, 14.3067],
  'Vis': [43.0609, 16.1835],

  // ── Albania & Montenegro ───────────────────────────────
  'Durres': [41.3233, 19.4417],
  'Sarande': [39.8661, 20.0050],
  'Bar': [42.0936, 19.1000],
  'Igoumenitsa': [39.5043, 20.2651],

  // ── Northern Europe / Fjords ───────────────────────────
  'Southampton': [50.9097, -1.4044],
  'Bergen': [60.3913, 5.3221],
  'Geiranger': [62.1008, 7.2059],
  'Alesund': [62.4722, 6.1549],
  'Stavanger': [58.9700, 5.7331],
  'Flam': [60.8628, 7.1137],
  'Tromso': [69.6496, 18.9560],
  'Trondheim': [63.4305, 10.3951],
  'Honningsvag': [70.9827, 25.9709],
  'Svolvaer': [68.2343, 14.5689],
  'Bronnoysund': [65.4736, 12.2125],
  'Loen': [61.8621, 6.8543],
  'Nordfjord': [61.9000, 6.0000],
  'Oslo': [59.9139, 10.7522],
  'Copenhagen': [55.6761, 12.5683],
  'Copenhaga': [55.6761, 12.5683],

  // ── Baltic ─────────────────────────────────────────────
  'Stockholm': [59.3293, 18.0686],
  'Nynashamn': [58.9020, 17.9452],
  'Helsinki': [60.1699, 24.9384],
  'Tallinn': [59.4370, 24.7536],
  'Riga': [56.9496, 24.1052],
  'Klaipeda': [55.7033, 21.1443],
  'Gdansk': [54.3520, 18.6466],
  'Gdynia': [54.5189, 18.5305],
  'Visby': [57.6348, 18.2948],
  'Warnemunde': [54.1700, 12.0900],
  'Berlin': [54.1700, 12.0900],
  'Skagen': [57.7197, 10.5833],
  'Gothenburg': [57.7089, 11.9746],

  // ── UK & Ireland ───────────────────────────────────────
  'Dover': [51.1279, 1.3134],
  'Londra': [51.5074, -0.1278],
  'London': [51.5074, -0.1278],
  'Plymouth': [50.3755, -4.1427],
  'Falmouth UK': [50.1536, -5.0711],
  'Portsmouth': [50.8198, -1.0880],
  'Portland': [50.5470, -2.4434],

  // ── Belgium & Netherlands ──────────────────────────────
  'Amsterdam': [52.3676, 4.9041],
  'Rotterdam': [51.9244, 4.4777],
  'Bruges': [51.3533, 3.2044],
  'Zeebrugge': [51.3533, 3.2044],

  // ── Germany ────────────────────────────────────────────
  'Hamburg': [53.5511, 9.9937],
  'Kiel': [54.3233, 10.1228],

  // ── Morocco & North Africa ─────────────────────────────
  'Tangier': [35.7595, -5.8340],
  'Casablanca': [33.5731, -7.5898],
  'Agadir': [30.4278, -9.5981],
  'La Goulette': [36.8195, 10.3050],
  'Tunis': [36.8065, 10.1815],
  'Alexandria': [31.2001, 29.9187],

  // ── Gibraltar & Ceuta ──────────────────────────────────
  'Gibraltar': [36.1408, -5.3536],
  'Ceuta': [35.8894, -5.3213],

  // ── Cyprus & Middle East ───────────────────────────────
  'Limassol': [34.7071, 33.0226],
  'Doha': [25.2854, 51.5310],

  // ── Cape Verde ─────────────────────────────────────────
  'Mindelo': [16.8862, -24.9879],
  'Praia': [14.9331, -23.5133],

  // ── Danube River ───────────────────────────────────────
  'Budapest': [47.4979, 19.0402],
  'Bratislava': [48.1486, 17.1077],
  'Vienna': [48.2082, 16.3738],
  'Viena': [48.2082, 16.3738],
  'Durnstein': [48.3947, 15.5189],
  'Melk': [48.2274, 15.3320],
  'Passau': [48.5665, 13.4319],

  // ── Caribbean ──────────────────────────────────────────
  'Miami': [25.7617, -80.1918],
  'Fort Lauderdale': [26.1003, -80.1398],
  'CocoCay': [25.7830, -77.9410],
  'Cozumel': [20.4230, -86.9223],
  'Roatan': [16.3200, -86.5267],
  'Costa Maya': [18.7274, -87.6930],
  'Nassau': [25.0480, -77.3554],
  'Bridgetown': [13.0975, -59.6185],
  'Barbados': [13.0975, -59.6185],
  'St. Maarten': [18.0425, -63.0548],
  'St. Lucia': [14.0101, -60.9870],
  'Castries': [14.0101, -60.9870],
  'Trois Ilets': [14.5389, -61.0475],
  'Martinica': [14.6415, -61.0242],
  'Antigua': [17.1274, -61.8468],
  'San Juan': [18.4655, -66.1057],
  'Port Canaveral': [28.4084, -80.6101],
  'Bermuda': [32.3078, -64.7505],
  'King s Wharf': [32.3281, -64.8340],

  // ── South America ──────────────────────────────────────
  'Rio de Janeiro': [22.9068, -43.1729],
  'Salvador De Bahia': [12.9714, -38.5124],
  'Recife': [-8.0476, -34.8770],
  'Natal': [-5.7945, -35.2110],
  'Buenos Aires': [-34.6037, -58.3816],

  // ── Africa ─────────────────────────────────────────────
  'Cape Town': [-33.9249, 18.4241],
  'Golful Walvis': [-22.9576, 14.5054],
  'Walvis Bay': [-22.9576, 14.5054],

  // ── Slovenia ───────────────────────────────────────────
  'Ljubljana': [46.0569, 14.5058],

  // ── Malta ──────────────────────────────────────────────
  'Gozo': [36.0444, 14.2511],

  // ── Jersey / Channel Islands ───────────────────────────
  'St. Helier': [49.1880, -2.1063],

  // ── Algeria ────────────────────────────────────────────
  'Algiers': [36.7538, 3.0588],

  // ── UK & Ireland — extended ────────────────────────────
  'Belfast': [54.5973, -5.9301],
  'Dublin': [53.3498, -6.2603],
  'Edinburgh': [55.9533, -3.1883],
  'Leith': [55.9810, -3.1717],
  'Glasgow': [55.8642, -4.2518],
  'Greenock': [55.9497, -4.7650],
  'Liverpool': [53.4084, -2.9916],
  'Cobh': [51.8504, -8.2966],
  'Galway': [53.2707, -9.0568],
  'Waterford': [52.2567, -7.1114],
  'Donegal': [54.6539, -8.1101],
  'Killybegs': [54.6349, -8.4418],
  'Fowey': [50.3361, -4.6365],
  'Oban': [56.4133, -5.4747],
  'Kirkwall': [58.9811, -2.9596],
  'Lerwick': [60.1536, -1.1497],
  'Stornoway': [58.2093, -6.3854],
  'Invergordon': [57.6880, -4.1768],
  'Inverness': [57.4778, -4.2247],
  'Scrabster': [58.6108, -3.5467],
  'Tobermory': [56.6234, -6.0661],
  'Portree': [57.4112, -6.1967],
  'Insula Skye': [57.4112, -6.1967],
  'Holyhead': [53.3100, -4.6302],
  'Queensferry': [55.9900, -3.3900],
  'Dundee': [56.4620, -2.9707],
  'Ullapool': [57.8957, -5.1600],
  'Newcastle-Tyne': [54.9783, -1.6178],
  'Dun Laoghaire': [53.2947, -6.1358],
  'Portrush': [55.2064, -6.6547],
  'Londonderry': [55.0067, -7.3186],
  'Foynes': [52.6114, -9.1000],
  'Greencastle': [55.2000, -6.9833],
  'Ringaskiddy': [51.8300, -8.3200],
  'Bantry Irlanda': [51.6819, -9.4520],
  'Isle Of Man': [54.2361, -4.5481],
  'Douglas': [54.1466, -4.4819],
  'St. Peter Port': [49.4560, -2.5370],
  'Guernsey': [49.4560, -2.5370],

  // ── Scandinavia — extended ─────────────────────────────
  'Eidfjord': [60.4636, 6.9920],
  'Hellesylt': [62.0851, 6.8667],
  'Olden': [61.8308, 6.8131],
  'Haugesund': [59.4138, 5.2681],
  'Kristiansand': [58.1599, 7.9956],
  'Molde': [62.7371, 7.1593],
  'Skjolden': [61.4889, 7.5928],
  'Flaam': [60.8628, 7.1137],
  'Ulvik': [60.5666, 6.9122],
  'Vik': [61.0877, 6.5783],
  'Maloy': [61.9340, 5.1139],
  'Mandal': [58.0279, 7.4597],
  'Sandnes': [58.8527, 5.7341],
  'Lyngdal': [58.1385, 7.0725],
  'Nordfjordeid': [61.9069, 5.9884],
  'Elnesvagen': [62.8333, 7.1500],
  'Helsingborg': [56.0465, 12.6945],
  'Karlskrona': [56.1612, 15.5869],
  'Ystad': [55.4298, 13.8200],
  'Mariehamn': [60.0969, 19.9348],
  'Turku': [60.4518, 22.2666],
  'Ronne': [55.0996, 14.7067],
  'Bornholm': [55.0996, 14.7067],
  'Kalundborg': [55.6796, 11.0887],
  'Fredericia': [55.5659, 9.7528],

  // ── Iceland & Greenland ────────────────────────────────
  'Reykjavik': [64.1466, -21.9426],
  'Isafjordur': [66.0706, -23.1331],
  'Husavik': [66.0451, -17.3382],
  'Djupivogur': [64.6510, -14.2612],
  'Seydisfjordur': [65.2609, -14.0028],
  'Heimaey': [63.4393, -20.2688],
  'Grundarfjordur': [64.9219, -23.2536],
  'Nuuk': [64.1748, -51.7386],
  'Qaqortoq': [60.7166, -46.0342],
  'Narsaq': [60.9139, -46.0497],
  'Paamiut': [62.0000, -49.6667],
  'Prins Christian Sund': [60.0333, -43.1667],

  // ── France — extended ──────────────────────────────────
  'Cherbourg': [49.6337, -1.6163],
  'Dunkerque': [51.0341, 2.3770],
  'Dunkirk': [51.0341, 2.3770],
  'Brest': [48.3904, -4.4861],
  'Les Andelys': [49.2461, 1.4192],
  'Caudebec en Caux': [49.5250, 0.7260],
  'Vernon': [49.0932, 1.4869],
  'Versailles': [48.8014, 2.1301],
  'Arles': [43.6767, 4.6278],
  'Blaye': [45.1273, -0.6620],
  'Cadillac': [44.6375, -0.3189],
  'Pauillac': [45.1980, -0.7504],
  'Bourg - Libourne': [45.0396, -0.5567],
  'Lyon': [45.7640, 4.8357],
  'Strasbourg': [48.5734, 7.7521],
  'Collioure': [42.5273, 3.0833],
  'Port-Vendres': [42.5188, 3.1044],
  'Carcassonne': [43.2130, 2.3491],
  'La Seyne-sur-Mer': [43.1000, 5.8833],
  'Sanary-Sur-Mer': [43.1191, 5.8000],
  'Saint-Cyr-Sur-Mer': [43.1860, 5.7000],
  'Le Verdon sur Mer': [45.5476, -1.0641],
  'Pont-Aven': [47.8541, -3.7510],
  'Pranzac': [45.6372, 0.2064],
  'La Joliette': [43.2965, 5.3698],

  // ── Germany — Rhine & Main ─────────────────────────────
  'Cologne': [50.9375, 6.9603],
  'Koln': [50.9375, 6.9603],
  'Koblenz': [50.3569, 7.5890],
  'Mainz': [49.9929, 8.2473],
  'Frankfurt': [50.1109, 8.6821],
  'Nuremberg': [49.4521, 11.0767],
  'Mannheim': [49.4875, 8.4660],
  'Speyer': [49.3173, 8.4312],
  'Rudesheim': [49.9773, 7.9237],
  'Bernkastel': [49.9167, 7.0750],
  'Cochem': [50.1468, 7.1663],
  'Boppard': [50.2312, 7.5891],
  'Trier': [49.7497, 6.6372],
  'Breisach': [48.0281, 7.5830],
  'Regensburg': [49.0134, 12.1016],
  'Deggendorf': [48.8329, 12.9612],
  'Germersheim': [49.2217, 8.3649],
  'Andernach': [50.4394, 7.4044],
  'Loreley': [50.1447, 7.7325],
  'Wismar': [53.8926, 11.4650],
  'Dusseldorf': [51.2277, 6.7735],
  'Düsseldorf': [51.2277, 6.7735],

  // ── Netherlands — extended ─────────────────────────────
  'Dordrecht': [51.8133, 4.6901],
  'Nijmegen': [51.8126, 5.8372],
  'Schoonhoven': [51.9489, 4.8510],
  'Lelystad': [52.5185, 5.4714],
  'Maastricht': [50.8514, 5.6909],
  'Zaandam': [52.4378, 4.8290],
  'Doesburg': [52.0142, 6.1414],
  'Utrecht': [52.0907, 5.1214],

  // ── Belgium — extended ─────────────────────────────────
  'Antwerp': [51.2194, 4.4025],
  'Bruxelles': [50.8503, 4.3517],

  // ── Austria — Danube ───────────────────────────────────
  'Linz': [48.3069, 14.2858],
  'Engelhartszell': [48.5000, 13.7333],
  'Wachau': [48.3500, 15.4500],

  // ── Hungary — Danube ───────────────────────────────────
  'Budapesta': [47.4979, 19.0402],
  'Vac': [47.7756, 19.1314],
  'Kalocsa': [46.5296, 18.9854],

  // ── Serbia & Danube ────────────────────────────────────
  'Belgrad': [44.7866, 20.4489],
  'Novi Sad': [45.2671, 19.8335],
  'Vukovar': [45.3481, 18.9973],
  'Golubac': [44.6558, 21.6328],
  'Ilok': [45.2218, 19.3776],

  // ── Bulgaria & Romania Danube ──────────────────────────
  'Ruse': [43.8485, 25.9549],
  'Vidin': [43.9900, 22.8817],
  'Bucuresti': [44.4268, 26.1025],

  // ── Czech Republic ─────────────────────────────────────
  'Praga': [50.0755, 14.4378],

  // ── Switzerland ────────────────────────────────────────
  'Basel': [47.5596, 7.5886],
  'Lucerne': [47.0502, 8.3093],

  // ── Italy — extended ───────────────────────────────────
  'Crotone': [39.0804, 17.1271],
  'Gallipoli': [40.0553, 17.9929],
  'Otranto': [40.1469, 18.4907],
  'Giardini Naxos': [37.8285, 15.2691],
  'Chioggia': [45.2183, 12.2791],
  'Ponza': [40.8954, 12.9681],
  'Santa Margherita': [44.3355, 9.2122],
  'Portovenere': [44.0511, 9.8362],
  'Golfo Aranci': [40.9898, 9.6138],
  'Portul Empedocle': [37.2899, 13.5289],
  'Portul Ercole': [42.3972, 11.1958],
  'Portul Banus': [36.4854, -4.9528],
  'Taranto': [40.4644, 17.2470],

  // ── Portugal — extended ────────────────────────────────
  'Regua': [41.1644, -7.7889],
  'Salamanca': [40.9688, -5.6633],
  'Pocinho': [41.0833, -7.1167],

  // ── Spain — extended ───────────────────────────────────
  'Ferrol': [43.4843, -8.2328],
  'Pasajes': [43.3200, -1.9217],
  'Melilla': [35.2923, -2.9381],
  'Port Mahon': [39.8857, 4.2662],

  // ── USA — extended ─────────────────────────────────────
  'New York': [40.6892, -74.0445],
  'Brooklyn': [40.6892, -74.0445],
  'Boston': [42.3601, -71.0589],
  'Baltimore': [39.2866, -76.6167],
  'Philadelphia': [39.9526, -75.1652],
  'Norfolk': [36.8508, -76.2859],
  'Jacksonville': [30.3322, -81.6557],
  'Tampa': [27.9506, -82.4572],
  'Galveston': [29.3013, -94.7977],
  'New Orleans': [29.9511, -90.0715],
  'Mobile': [30.6954, -88.0399],
  'San Diego': [32.7157, -117.1611],
  'Los Angeles': [33.7406, -118.2676],
  'Long Beach': [33.7676, -118.1956],
  'San Francisco': [37.8199, -122.4783],
  'Seattle': [47.6062, -122.3321],
  'Honolulu': [21.3069, -157.8583],
  'Hilo': [19.7297, -155.0900],
  'Kahului': [20.8986, -156.4750],
  'Kailua-Kona': [19.6400, -155.9969],
  'Kona': [19.6400, -155.9969],
  'Nawiliwili': [21.9547, -159.3557],
  'Key West': [24.5551, -81.7800],
  'Palm Beach': [26.7056, -80.0364],
  'Cape Liberty': [40.6631, -74.0565],
  'Paulsboro': [39.8268, -75.2407],
  'Astoria': [46.1879, -123.8313],
  'Avalon': [33.3428, -118.3247],
  'Eastport': [44.9042, -66.9856],
  'Santa Barbara': [34.4208, -119.6982],

  // ── Alaska ─────────────────────────────────────────────
  'Juneau': [58.3005, -134.4197],
  'Ketchikan': [55.3422, -131.6461],
  'Skagway': [59.4583, -135.3139],
  'Sitka': [57.0531, -135.3346],
  'Seward': [60.1042, -149.4422],
  'Anchorage': [61.2181, -149.9003],
  'Kodiak': [57.7900, -152.4072],
  'Dutch Harbor': [53.8891, -166.5422],
  'Valdez': [61.1309, -146.3483],
  'Haines': [59.2361, -135.4456],
  'Wrangell': [56.4711, -132.3767],
  'Klawock': [55.5536, -133.0975],
  'Prince Rupert': [54.3150, -130.3208],

  // ── Canada ─────────────────────────────────────────────
  'Vancouver': [49.2827, -123.1207],
  'Montreal': [45.5017, -73.5673],
  'Orasul Quebec': [46.8139, -71.2080],
  'Halifax': [44.6488, -63.5752],
  'Charlottetown': [46.2382, -63.1311],
  'Corner Brook': [48.9510, -57.9526],
  'Sydney': [-33.8688, 151.2093],
  'Nanaimo': [49.1660, -123.9401],
  'Victoria': [48.4284, -123.3656],
  'Sept Iles': [50.2120, -66.3826],
  'Saguenay': [48.4279, -71.0548],
  'Havre St.Pierre': [50.2389, -63.6013],
  'Baie-Comeau': [49.2217, -68.1478],
  'Gaspesie': [48.8331, -64.4818],
  'Cap-aux-Meules': [47.3764, -61.8590],
  'St. Anthony': [51.3647, -55.5888],
  'St. John\'s': [47.5615, -52.7126],
  'L-anse Aux Meadows': [51.5959, -55.5336],
  'Saint John': [45.2733, -66.0633],
  'Banff': [51.1784, -115.5708],

  // ── Caribbean & Central America — extended ─────────────
  'George Town': [19.2951, -81.3815],
  'Grand Cayman': [19.2951, -81.3815],
  'Grand Turk': [21.4613, -71.1357],
  'Montego Bay': [18.4762, -77.8939],
  'Ocho Rios': [18.4113, -77.1013],
  'Falmouth': [18.4942, -77.6564],
  'Port Antonio': [18.1786, -76.4505],
  'Amber Cove': [19.7983, -70.6978],
  'La Romana': [18.4274, -68.9728],
  'Samana': [19.2049, -69.3381],
  'Santo Domingo': [18.4861, -69.9312],
  'Cabo Rojo': [18.0908, -67.1458],
  'Puerto Plata': [19.7931, -70.6881],
  'Catalina Island': [18.3833, -68.9667],
  'Punta Cana': [18.5601, -68.3725],
  'Charlotte Amalie': [18.3358, -64.9307],
  'St. Thomas': [18.3358, -64.9307],
  'St. Croix': [17.7468, -64.7028],
  'Frederiksted': [17.7128, -64.8819],
  'Road Town': [18.4269, -64.6176],
  'Tortola': [18.4269, -64.6176],
  'Virgin Gorda': [18.4486, -64.3973],
  'Jost Van Dyke': [18.4442, -64.7536],
  'Philipsburg': [18.0425, -63.0548],
  'Marigot': [18.0731, -63.0827],
  'Basseterre': [17.2948, -62.7261],
  'Charlestown': [17.1380, -62.6197],
  'Nevis': [17.1380, -62.6197],
  'St. Johns Antigua': [17.1274, -61.8468],
  'English Harbour': [17.0031, -61.7642],
  'Pointe-a-Pitre': [16.2411, -61.5331],
  'Les Saints': [15.8667, -61.6167],
  'Terre-de-Haut': [15.8572, -61.5836],
  'Fort-de-France': [14.6037, -61.0092],
  'Anse Mitan': [14.5500, -61.0667],
  'Soufriere': [13.8569, -61.0564],
  'Kingstown': [13.1561, -61.2268],
  'St. Vincent': [13.1561, -61.2268],
  'Bequia': [13.0125, -61.2383],
  'Mayreau': [12.6403, -61.3944],
  'St. George\'s': [12.0564, -61.7485],
  'Scarborough': [11.1828, -60.7333],
  'Charlotteville': [11.3208, -60.5561],
  'Port of Spain': [10.6549, -61.5019],
  'Trinidad': [10.6549, -61.5019],
  'Roseau': [15.3010, -61.3870],
  'Dominica': [15.3010, -61.3870],
  'St. Barthelemy': [17.8968, -62.8505],
  'Willemstad': [12.1696, -68.9900],
  'Oranjestad': [12.5092, -70.0086],
  'Kralendijk': [12.1488, -68.2655],
  'Bonaire': [12.1488, -68.2655],
  'Labadee': [19.7826, -72.2467],
  'Half Moon Cay': [23.6783, -75.9017],
  'Princess Cays': [23.9500, -76.3167],
  'Great Stirrup Cay': [25.8333, -77.9167],
  'Reciful de corali Great Stirrup': [25.8333, -77.9167],
  'Perfect Day At Cococay': [25.7830, -77.9410],
  'Celebration Key': [25.7500, -79.2500],
  'Ocean Cay MSC Marine Reserve': [25.3836, -79.2250],
  'Harvest Caye': [16.4833, -88.4333],
  'Insula Grand Bahama': [26.6333, -78.7500],
  'Colon': [9.3547, -79.9019],
  'Balboa': [8.9514, -79.5620],
  'Panama City': [8.9824, -79.5199],
  'Orasul Panama': [8.9824, -79.5199],
  'Fuerte Amador': [8.9355, -79.5339],
  'Orasul Belize': [17.5046, -88.1962],
  'Bocas Del Toro': [9.3370, -82.2409],
  'Progreso': [21.2826, -89.6636],
  'Progresso': [21.2826, -89.6636],
  'Ensenada': [31.8667, -116.5964],
  'Cabo San Lucas': [22.8905, -109.9167],
  'Acapulco': [16.8531, -99.8237],
  'Huatulco': [15.7692, -96.1264],
  'Puerto Ayora': [-0.7439, -90.3122],
  'Puntarenas': [9.9769, -84.8382],
  'Quepos': [9.4341, -84.1597],
  'Golfito': [8.6393, -83.1617],
  'Curu': [9.7750, -84.9167],
  'Playa Flamingo': [10.4353, -85.8003],
  'Portul Caldera': [10.0000, -84.7167],
  'Punta Leona': [9.6667, -84.6667],
  'San Jose': [9.9281, -84.0907],
  'Santo Tomas de Castilla': [15.7000, -88.6167],
  'Portul Quetzal': [13.9333, -90.7833],

  // ── South America — extended ───────────────────────────
  'Santos': [-23.9618, -46.3322],
  'Sao Paolo': [-23.5505, -46.6333],
  'Buzios': [-22.7469, -41.8817],
  'Copacabana': [-22.9711, -43.1822],
  'Parati': [-23.2178, -44.7131],
  'Ilhabela': [-23.7762, -45.3573],
  'Ilha Grande': [-23.1073, -44.2309],
  'Florianopolis': [-27.5954, -48.5480],
  'Itajai': [-26.9078, -48.6616],
  'Camboriu': [-26.9906, -48.6348],
  'Porto Belo': [-27.1519, -48.5548],
  'Sao Francisco do Sol': [-26.2433, -48.6378],
  'Paranagua': [-25.5208, -48.5075],
  'Rio Grande': [-32.0350, -52.0986],
  'Fortaleza': [-3.7319, -38.5267],
  'Maceio': [-9.6658, -35.7353],
  'Ilheus': [-14.7889, -39.0406],
  'Belem': [-1.4558, -48.5024],
  'Manaus': [-3.1190, -60.0217],
  'Raul Amazon': [-3.1190, -60.0217],
  'Santarem': [-2.4388, -54.7028],
  'Parintins': [-2.6281, -56.7356],
  'Alter do Chao': [-2.5014, -54.9486],
  'Boca da Valeria': [-3.3333, -58.6667],
  'Montevideo': [-34.9011, -56.1645],
  'Punta del Este': [-34.9621, -54.9436],
  'Ushuaia': [-54.8019, -68.3030],
  'Punta Arenas': [-53.1548, -70.9220],
  'Portul Chacabuco': [-45.4667, -72.8333],
  'Puerto Montt': [-41.4693, -72.9424],
  'Santiago': [-33.4489, -70.6693],
  'Portul Stanley': [-51.7013, -57.8494],
  'Portul Williams': [-54.9333, -67.6167],
  'Lima': [-12.0464, -77.0428],
  'Salaverry': [-8.2225, -78.9911],
  'Guayaquil': [-2.1894, -79.8891],
  'Manta': [-0.9500, -80.7333],
  'Puerto Bolivar': [-3.2672, -80.0000],
  'Baltra': [-0.4384, -90.2878],
  'San Cristobal': [-0.8961, -89.6089],

  // ── Africa — extended ──────────────────────────────────
  'Dakar': [14.6928, -17.4467],
  'Banjul': [13.4549, -16.5790],
  'Abidjan': [5.3600, -4.0083],
  'Lome': [6.1375, 1.2123],
  'Cotonou': [6.3654, 2.4183],
  'Accra': [5.6037, -0.1870],
  'Takoradi': [4.8847, -1.7554],
  'Sekondi-Takoradi': [4.9346, -1.7136],
  'Luanda': [-8.8390, 13.2894],
  'Luderitz': [-26.6476, 15.1594],
  'Durban': [-29.8587, 31.0218],
  'Port Elizabeth': [-33.9180, 25.5701],
  'Mossel Bay': [-34.1821, 22.1450],
  'Johannesburg': [-26.2041, 28.0473],
  'Dar es Salaam': [-6.7924, 39.2083],
  'Maputo': [-25.9692, 32.5732],
  'Nosy Be': [-13.3289, 48.2542],
  'Antsiranana': [-12.2783, 49.2917],
  'Tolanaro': [-25.0333, 46.9833],
  'Toliara': [-23.3500, 43.6667],
  'Mayotte': [-12.7872, 45.1544],
  'La Possession': [-20.9283, 55.3356],
  'Pointe des Galets': [-20.9333, 55.2833],
  'Port Louis': [-20.1609, 57.5012],
  'Mahe': [-4.6796, 55.4920],
  'La Digue': [-4.3592, 55.8289],
  'Victoria Seychelles': [-4.6191, 55.4513],
  'Pomene': [-22.9167, 35.5667],
  'St. Helena': [-15.9650, -5.7089],
  'Sao Tome & Principe': [0.1864, 6.6131],

  // ── Middle East ────────────────────────────────────────
  'Dubai': [25.2048, 55.2708],
  'Abu Dhabi': [24.4539, 54.3773],
  'Jeddah': [21.5169, 39.2192],
  'Dammam': [26.4207, 50.0888],
  'Mumbai': [18.9388, 72.8354],
  'Bombay': [18.9388, 72.8354],
  'Delhi': [28.6139, 77.2090],
  'Hambantota': [6.1240, 81.1185],

  // ── Asia ───────────────────────────────────────────────
  'Singapore': [1.2644, 103.8222],
  'Hong Kong': [22.3193, 114.1694],
  'Shanghai': [31.2304, 121.4737],
  'Taipei': [25.1304, 121.7403],
  'Kaohsiung': [22.6273, 120.3014],
  'Seoul': [37.5665, 126.9780],
  'Incheon': [37.4563, 126.7052],
  'Busan': [35.1796, 129.0756],
  'Jeju': [33.4996, 126.5312],
  'Gangjeong': [33.2506, 126.4143],
  'Sokcho': [38.2070, 128.5918],
  'Yeosu': [34.7604, 127.6622],
  'Tokyo': [35.6522, 139.8394],
  'Yokohama': [35.4437, 139.6380],
  'Osaka': [34.6937, 135.5023],
  'Kyoto': [34.6937, 135.5023],
  'Kobe': [34.6901, 135.1955],
  'Nagasaki': [32.7503, 129.8779],
  'Fukuoka': [33.5932, 130.4017],
  'Kagoshima': [31.5966, 130.5571],
  'Nagoya': [35.0846, 136.8813],
  'Aomori': [40.8244, 140.7400],
  'Beppu': [33.2846, 131.4914],
  'Kanazawa': [36.5944, 136.6256],
  'Shimizu': [35.0133, 138.4891],
  'Kochi': [33.5597, 133.5311],
  'Kumamoto': [32.8032, 130.7079],
  'Matsuyama': [33.8396, 132.7655],
  'Okinawa': [26.3344, 127.8056],
  'Kushiro': [42.9849, 144.3820],
  'Otaru': [43.1907, 141.0131],
  'Muroran': [42.3150, 140.9738],
  'Sendai': [38.2682, 140.8694],
  'Hitachinaka': [36.3966, 140.5347],
  'Sasebo': [33.1603, 129.7193],
  'Kitakyushu': [33.8835, 130.8751],
  'Maizuro': [35.4622, 135.3883],
  'Sakaiminato': [35.5420, 133.2318],
  'Sakata': [38.9147, 139.8362],
  'Hamada': [34.8987, 132.0805],
  'Miyazaki': [31.9111, 131.4239],
  'Toba': [34.4819, 136.8436],
  'Ishigaki': [24.3449, 124.1569],
  'Insulele Ryukyu': [24.3449, 124.1569],
  'Miyakojima': [24.7915, 125.2814],
  'Miyako': [24.7915, 125.2814],
  'Tsuruga': [35.6500, 136.0667],
  'Kumano': [33.8886, 136.1028],
  'Omaezaki': [34.5964, 138.2303],
  'Oarai': [36.3167, 140.5833],
  'Tokushima': [34.0658, 134.5592],
  'Wakayama': [34.2260, 135.1675],
  'Yatsushiro': [32.5072, 130.6008],
  'Shimonoseki': [33.9614, 130.9408],
  'Bangkok': [13.1081, 100.9028],
  'Ko Samui': [9.5120, 100.0137],
  'Ko Kood': [11.6569, 102.5569],
  'Phuket': [7.8804, 98.3923],
  'Sihanoukville': [10.6268, 103.5221],
  'Phu My': [10.5461, 107.0014],
  'Vung Tau': [10.3460, 107.0843],
  'Cam Ranh': [11.9211, 109.1590],
  'Manila': [14.5995, 120.9842],
  'Coron': [11.9986, 120.2043],
  'Portul Princesa': [9.7393, 118.7355],
  'Penang': [5.4141, 100.3288],
  'Langkawi': [6.3500, 99.8000],
  'Kuala Lumpur': [2.9864, 101.6826],
  'Port Klang': [3.0006, 101.3847],
  'Malacca': [2.1896, 102.2501],
  'Kota Kinabalu': [5.9804, 116.0735],
  'Muara': [5.0333, 115.0667],
  'Benoa': [-8.7467, 115.2108],

  // ── Oceania ────────────────────────────────────────────
  'Auckland': [-36.8485, 174.7633],
  'Bay of Islands': [-35.2627, 174.1007],
  'Tauranga': [-37.6878, 176.1651],
  'Napier': [-39.4928, 176.9120],
  'Christchurch': [-43.5321, 172.6362],
  'Dunedin': [-45.8788, 170.5028],
  'Picton': [-41.2906, 174.0010],
  'Melbourne': [-37.8136, 144.9631],
  'Brisbane': [-27.4705, 153.0260],
  'Adelaide': [-34.9285, 138.6007],
  'Fremantle': [-32.0569, 115.7439],
  'Perth': [-31.9505, 115.8605],
  'Darwin': [-12.4634, 130.8456],
  'Papeete': [-17.5355, -149.5693],
  'Moorea': [-17.5267, -149.8505],
  'Bora Bora': [-16.5004, -151.7415],
  'Huahine': [-16.7333, -151.0333],
  'Raiatea': [-16.8333, -151.4333],
  'Rangiroa': [-15.1333, -147.6500],
  'Fakarava': [-16.0500, -145.6500],
  'Lautoka': [-17.6065, 177.4534],
  'Noumea': [-22.2763, 166.4572],
  'Lifou': [-20.9167, 167.2500],
  'Rarotonga': [-21.2367, -159.7767],
  'Nuku Hiva': [-8.8667, -140.1000],
  'Atuona': [-9.8000, -139.0333],
  'Taiohae': [-8.9167, -140.1000],
  'Luganville': [-15.5333, 167.1667],
  'Vila': [-17.7334, 168.3221],
  'Alotau': [-10.3075, 150.4515],
  'Conflict Islands': [-10.7500, 151.7667],
  'Agats': [-5.5500, 138.1333],

  // ── Polynesia misc ─────────────────────────────────────
  'Tahaa/Motu Mahana': [-16.6333, -151.5000],
  'Omoa': [-10.4500, -138.6833],

  // ── Galapagos misc ─────────────────────────────────────
  'Fernandina': [-0.3729, -91.5529],
  'North Seymour': [-0.3833, -90.2833],
  'Insula Seymour Norte': [-0.3833, -90.2833],
  'Daphne Island': [-0.4167, -90.3833],
  'Elizabeth Bay': [-0.9833, -91.0833],
  'Bahia Darwin': [-0.3333, -90.5333],
  'Bahia Gardner': [-1.3500, -89.6500],
  'Bahia Sullivan': [-0.2833, -90.5667],
  'Las Blachas': [-0.7000, -90.3500],
  'Cerro Brujo': [-0.7667, -89.5333],
  'Punta Pitt': [-0.7000, -89.2500],
  'Punta Suarez': [-1.3833, -89.7500],
  'Punta Moreno': [-0.6667, -91.2167],
  'El Barranco': [-0.3167, -90.0500],
  'Los Gemelos': [-0.6250, -90.3528],
  'Rabida': [-0.3917, -90.7083],
  'Puerto Egas': [-0.2500, -90.8333],
  'Portul Baquerizo': [-0.8960, -89.6130],
  'Tagus Cove': [-0.2667, -91.3667],
  'Roca Leon Dormido': [-0.7500, -89.5167],

  // ── Torshavn & Faroe Islands ───────────────────────────
  'Torshavn': [62.0107, -6.7716],
  'Runavik': [62.1053, -6.7714],

  // ── Caribbean private/misc ─────────────────────────────
  'Carambola Beach': [17.7500, -64.8667],
  'Pitons Bay': [13.8300, -61.0700],
  'Insula Pigeon': [14.0100, -60.9700],
  'Golful Rodney': [14.0764, -60.9553],
  'Golful Mahogany': [16.2000, -86.0000],

  // ── Misc worldwide ─────────────────────────────────────
  'Atlantis Crest Oeste': [28.0000, -15.5000],
  'El punto más oscuro del mar de las Islas Canarias': [28.0000, -17.0000],
  'Golful Tunis': [36.8195, 10.3050],

  // ── Remaining unmatched ports (final coverage push) ────
  'Alert Bay': [50.5900, -126.9319],
  'Athena': [37.9838, 23.7275],
  'Cairo': [30.0444, 31.2357],
  'Castellón': [39.9864, -0.0513],
  'Cefalonia': [38.1750, 20.4895],
  'Chios': [38.3707, 26.1355],
  'Fiskardon': [38.4569, 20.5772],
  'Golfo Dulce': [8.4500, -83.1500],
  'Golful Fundy': [45.0000, -65.5000],
  'Golful St. Lawrence': [48.5000, -62.0000],
  'Golful Sullivan': [48.8400, -123.1500],
  'Gothenborg': [57.7089, 11.9746],
  'Great Harbour': [18.4333, -64.6167],
  'Horta': [38.5329, -28.6300],
  'Ile Royale': [5.2841, -52.5928],
  'Ilha Do Maia': [38.7167, -27.1500],
  'Innvikfjord': [61.7833, 6.6167],
  'Insula Ambrym': [-16.2500, 168.1167],
  'Insula Catalina': [33.3494, -118.3267],
  'Insula Devils': [-20.4333, 164.3167],
  'Insula Mystery': [-17.4333, 168.2833],
  'Insula Parida': [8.0500, -82.3500],
  'Insula Pentecost': [-15.7833, 168.1833],
  'Insulele Baleare': [39.5696, 2.6502],
  'Insulele San Blas': [9.5500, -78.8500],
  'La Paz': [24.1426, -110.3128],
  'Liepaja': [56.5047, 21.0108],
  'Lorient': [47.7483, -3.3667],
  'Lustrafjorden': [61.3833, 7.1167],
  'Male': [4.1755, 73.5093],
  'Monemvassia': [36.6853, 23.0406],
  'Montserrat': [16.7425, -62.1874],
  'Mylos': [36.7300, 24.4400],
  'New Haven': [41.3083, -72.9279],
  'Nydri': [38.7333, 20.7167],
  'Platis Gialos': [36.7250, 24.7206],
  'Port Allen': [21.9000, -159.5950],
  'Port Moller': [55.9833, -160.5667],
  'Portul Grande': [37.7400, 26.9750],
  'Pylos': [36.9119, 21.6967],
  'Queen Charlotte Sound': [-41.1667, 174.2500],
  'Road Bay': [18.2167, -63.0500],

  // ── Romanian special names ────────────────────────────
  'Charles Darwin Research Station': [-0.7393, -90.3033],
  'Ghetarul Hubbard': [60.0200, -139.4700],
  'Hubbard Glacier': [60.0200, -139.4700],
  'Muntele Kilauea': [19.4069, -155.2834],
  'Princess Royal Channel': [52.8333, -128.7000],
  'Lavrion': [37.7139, 24.0536],
}

// ============================================================
// Fuzzy port name lookup — handles "City, Country" format
// ============================================================

/** Ports we should skip (sea days, not real ports) */
const SEA_DAY_NAMES = ['pe mare', 'at sea', 'en mer', 'cruising', 'cruise', 'navigare', 'navigatie']

/** Additional Romanian name → PORT_COORDS key mappings for fuzzy matching */
const COORD_ALIASES: Record<string, string> = {
  'athena': 'Athens',
  'gothenborg': 'Gothenburg',
  'canal corinth': 'Corinth',
  'panama canal': 'Panama City',
  'tranzitarea ghetarului hubbard': 'Hubbard Glacier',
  'ins. portuguese': 'Maputo',
  'ins. inhaca': 'Maputo',
  'portul grande': 'Samos',
  // Disambiguation aliases — cruise data context
  'victoria, seychelles': 'Victoria Seychelles',
  'victoria, mahe': 'Victoria Seychelles',
  'falmouth, jamaica': 'Falmouth',
  'falmouth, anglia': 'Falmouth UK',
  'falmouth, uk': 'Falmouth UK',
  "st. john's, antigua": 'St. Johns Antigua',
  "st. john's, newfoundland": "St. John's",
}

function getPortCoords(rawName: string): { coords: [number, number]; cleanName: string } | null {
  const lower = rawName.toLowerCase().trim()

  // Skip sea days
  if (SEA_DAY_NAMES.some(s => lower.startsWith(s))) return null
  // Skip entries that are navigation notes (but NOT canal cities like "Panama Canal" which we alias)
  if (lower.includes('stramtoarea') || lower.includes('strait')) return null
  if (lower.includes('cruising')) return null

  // 0. Check COORD_ALIASES first (Romanian names, special patterns)
  for (const [alias, target] of Object.entries(COORD_ALIASES)) {
    if (lower.includes(alias) && PORT_COORDS[target]) {
      return { coords: PORT_COORDS[target], cleanName: target }
    }
  }

  // 1. Exact match
  if (PORT_COORDS[rawName]) {
    const cleanName = rawName.replace(/,.*$/, '').replace(/\s*\(.*\)/, '').trim()
    return { coords: PORT_COORDS[rawName], cleanName }
  }

  // 2. Extract city name (strip ", Country" and "(Parenthetical)")
  const cityName = rawName.replace(/,.*$/, '').replace(/\s*\(.*\)/, '').trim()
  if (PORT_COORDS[cityName]) {
    return { coords: PORT_COORDS[cityName], cleanName: cityName }
  }

  // 3. Handle "City / AltName (Port), Country" patterns (e.g., "Florenta / Pisa (Livorno), Italia")
  const slashParts = cityName.split('/').map(s => s.trim())
  for (const part of slashParts) {
    const clean = part.replace(/\s*\(.*\)/, '').trim()
    if (PORT_COORDS[clean]) return { coords: PORT_COORDS[clean], cleanName: clean }
    // Check parenthetical too (e.g., extract "Livorno" from "Pisa (Livorno)")
    const parenMatch = part.match(/\(([^)]+)\)/)
    if (parenMatch && PORT_COORDS[parenMatch[1]]) {
      return { coords: PORT_COORDS[parenMatch[1]], cleanName: parenMatch[1] }
    }
  }

  // 4. Case-insensitive match on city name
  const cityLower = cityName.toLowerCase()
  for (const [key, coords] of Object.entries(PORT_COORDS)) {
    if (key.toLowerCase() === cityLower) return { coords, cleanName: key }
  }

  // 5. Partial match — city name starts with or contains a known port
  for (const [key, coords] of Object.entries(PORT_COORDS)) {
    if (cityLower.startsWith(key.toLowerCase()) || key.toLowerCase().startsWith(cityLower)) {
      return { coords, cleanName: key }
    }
  }

  return null
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
        const result = getPortCoords(name)
        if (!result) return null
        return { name: result.cleanName, lat: result.coords[0], lng: result.coords[1] }
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
