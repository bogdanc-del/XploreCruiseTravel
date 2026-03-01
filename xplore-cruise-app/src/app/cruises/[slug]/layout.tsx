import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Dynamic metadata per cruise slug — reads from JSON database
// ============================================================

// Compact index entry (from cruises-index.json — 4 MB vs 23 MB full JSON)
interface CompactCruise {
  s: string   // slug
  t: string   // title
  d: string   // destination
  n: number   // nights
  p: number   // price_from
  cl: string  // cruise_line
  sn: string  // ship_name
  img: string // image_url
}

// Lazy-loaded cruise map (cached in module scope for build)
let cruiseMap: Map<string, { title: string; destination: string; nights: number; price_from: number; cruise_line: string; ship_name: string; image_url: string }> | null = null

function loadCruiseMap() {
  if (cruiseMap) return cruiseMap
  try {
    // Use compact index (4 MB) instead of full cruises.json (23 MB)
    // to avoid serverless memory/timeout issues on Vercel
    const filePath = join(process.cwd(), 'public', 'data', 'cruises-index.json')
    const data: CompactCruise[] = JSON.parse(readFileSync(filePath, 'utf8'))
    cruiseMap = new Map()
    for (const c of data) {
      cruiseMap.set(c.s, {
        title: c.t,
        destination: c.d,
        nights: c.n,
        price_from: c.p,
        cruise_line: c.cl,
        ship_name: c.sn,
        image_url: c.img,
      })
    }
    return cruiseMap
  } catch {
    return new Map()
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const map = loadCruiseMap()
  const cruise = map.get(slug)

  if (!cruise) {
    return {
      title: 'Croazieră Negăsită | XploreCruiseTravel',
      description: 'Această croazieră nu a fost găsită. Explorează alte oferte de croaziere premium la XploreCruiseTravel.',
      alternates: { canonical: `/cruises/${slug}` },
    }
  }

  const title = `${cruise.title} | XploreCruiseTravel`
  const description = `${cruise.cruise_line} - ${cruise.ship_name}. ${cruise.destination}, ${cruise.nights} nopți. De la €${cruise.price_from}/persoană. Rezervă acum la XploreCruiseTravel.`

  return {
    title,
    description,
    alternates: { canonical: `/cruises/${slug}` },
    openGraph: {
      title,
      description,
      ...(cruise.image_url ? { images: [{ url: cruise.image_url }] } : {}),
    },
  }
}

// ============================================================
// Layout — pass-through
// ============================================================

export default function CruiseDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
