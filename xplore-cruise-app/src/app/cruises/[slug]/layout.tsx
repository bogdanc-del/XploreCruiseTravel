import type { Metadata } from 'next'

// Static JSON import — bundled at build time (guaranteed available on Vercel)
const cruiseIndex: { s: string; t: string; d: string; n: number; p: number; cl: string; sn: string; img: string }[] =
  require('../../../../public/data/cruises-index.json') // eslint-disable-line

// ============================================================
// Dynamic metadata per cruise slug
// ============================================================

// Build the lookup map once (module-level, cached)
const cruiseMap = new Map<string, { title: string; destination: string; nights: number; price_from: number; cruise_line: string; ship_name: string; image_url: string }>()
for (const c of cruiseIndex) {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cruise = cruiseMap.get(slug)

  if (!cruise) {
    return {
      title: 'Croazieră Negăsită | XploreCruiseTravel',
      description: 'Această croazieră nu a fost găsită. Explorează alte oferte de croaziere premium la XploreCruiseTravel.',
      alternates: { canonical: `/cruises/${slug}` },
    }
  }

  const title = `${cruise.title} | XploreCruiseTravel`
  const description = `${cruise.cruise_line} - ${cruise.ship_name}. ${cruise.destination}, ${cruise.nights} nopți. De la €${cruise.price_from}/persoană. Solicită ofertă la XploreCruiseTravel.`

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
