import type { Metadata } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Dynamic metadata per cruise slug — reads from JSON database
// ============================================================

// Lazy-loaded cruise map (cached in module scope for build)
let cruiseMap: Map<string, { title: string; destination: string; nights: number; price_from: number; cruise_line: string; ship_name: string; image_url: string }> | null = null

function loadCruiseMap() {
  if (cruiseMap) return cruiseMap
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises.json')
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>[]
    cruiseMap = new Map()
    for (const c of data) {
      cruiseMap.set(c.slug as string, {
        title: c.title as string,
        destination: c.destination as string,
        nights: c.nights as number,
        price_from: c.price_from as number,
        cruise_line: c.cruise_line as string,
        ship_name: c.ship_name as string,
        image_url: c.image_url as string,
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
      title: 'Croaziera Negasita | XploreCruiseTravel',
      description: 'Aceasta croaziera nu a fost gasita. Exploreaza alte oferte de croaziere premium la XploreCruiseTravel.',
      alternates: { canonical: `/cruises/${slug}` },
    }
  }

  const title = `${cruise.title} | XploreCruiseTravel`
  const description = `${cruise.cruise_line} - ${cruise.ship_name}. ${cruise.destination}, ${cruise.nights} nopti. De la €${cruise.price_from}/persoana. Rezerva acum la XploreCruiseTravel.`

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
