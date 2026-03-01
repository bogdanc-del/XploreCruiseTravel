import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Despre Noi — Consultant Autorizat de Croaziere din 2016',
  description:
    'Descopera povestea XploreCruiseTravel: consultant autorizat de croaziere in Romania din 2016. Oferim consultanta personalizata, preturi competitive si suport 24/7.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Despre XploreCruiseTravel',
    description: 'Consultant autorizat de croaziere in Romania din 2016.',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
