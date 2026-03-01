import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Croaziere Premium — Ocean, Fluviale, Lux, Expeditie',
  description:
    'Exploreaza toate ofertele de croaziere premium: Mediterana, Caraibe, Europa de Nord, Dunare si multe altele. Preturi de la 599€. Consultant autorizat XploreCruiseTravel.',
  alternates: { canonical: '/cruises' },
  openGraph: {
    title: 'Croaziere Premium — Ocean, Fluviale, Lux, Expeditie',
    description: 'Exploreaza toate ofertele de croaziere premium. Preturi de la 599€.',
  },
}

export default function CruisesLayout({ children }: { children: React.ReactNode }) {
  return children
}
