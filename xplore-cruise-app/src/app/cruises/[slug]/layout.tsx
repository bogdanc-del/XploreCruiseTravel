import type { Metadata } from 'next'

// ============================================================
// Cruise metadata lookup — maps slug to RO title + description
// Must match the demo data in page.tsx
// ============================================================

const cruiseMetadata: Record<string, { title_ro: string; description_ro: string }> = {
  'western-mediterranean-discovery': {
    title_ro: 'Descoperirea Mediteranei de Vest — 7 Nopti de la Barcelona',
    description_ro:
      'Croaziera de 7 nopti prin Mediterana de Vest cu MSC Cruises. Barcelona, Marsilia, Genova, Roma, Palermo, Valletta. De la 599€/persoana. Rezerva acum la XploreCruiseTravel.',
  },
  'greek-islands-turkey-voyage': {
    title_ro: 'Insulele Grecesti si Turcia — 7 Nopti de la Atena',
    description_ro:
      'Croaziera de 7 nopti in Insulele Grecesti si Turcia cu Costa Cruises. Mykonos, Kusadasi, Patmos, Rodos, Santorini. De la 649€/persoana. Rezerva la XploreCruiseTravel.',
  },
  'norwegian-fjords-explorer': {
    title_ro: 'Explorator Fiorduri Norvegiene — 10 Nopti de la Southampton',
    description_ro:
      'Croaziera de 10 nopti prin Fiordurile Norvegiene cu Norwegian Cruise Line. Bergen, Geiranger, Alesund, Stavanger, Flam. De la 1.199€/persoana. XploreCruiseTravel.',
  },
  'romantic-danube-river-cruise': {
    title_ro: 'Croaziera Romantica pe Dunare — 8 Nopti de la Budapesta',
    description_ro:
      'Croaziera fluviala de 8 nopti pe Dunare cu Viking River Cruises. Bratislava, Viena, Durnstein, Melk, Passau. De la 2.299€/persoana. Rezerva la XploreCruiseTravel.',
  },
  'caribbean-perfect-day': {
    title_ro: 'Caraibe si Perfect Day — 7 Nopti de la Miami',
    description_ro:
      'Croaziera de 7 nopti in Caraibe cu Royal Caribbean. CocoCay, Cozumel, Roatan, Costa Maya. De la 749€/persoana. Rezerva acum la XploreCruiseTravel.',
  },
  'adriatic-luxury-collection': {
    title_ro: 'Colectia de Lux Adriatica — 10 Nopti de la Venetia',
    description_ro:
      'Croaziera de lux de 10 nopti prin Adriatica cu Silversea. Dubrovnik, Kotor, Corfu, Katakolon, Mykonos. De la 4.999€/persoana. XploreCruiseTravel.',
  },
}

// ============================================================
// Dynamic metadata per cruise slug
// ============================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cruise = cruiseMetadata[slug]

  if (!cruise) {
    return {
      title: 'Croaziera Negasita',
      description: 'Aceasta croaziera nu a fost gasita. Exploreaza alte oferte de croaziere premium la XploreCruiseTravel.',
      alternates: { canonical: `/cruises/${slug}` },
    }
  }

  return {
    title: cruise.title_ro,
    description: cruise.description_ro,
    alternates: { canonical: `/cruises/${slug}` },
    openGraph: {
      title: cruise.title_ro,
      description: cruise.description_ro,
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
