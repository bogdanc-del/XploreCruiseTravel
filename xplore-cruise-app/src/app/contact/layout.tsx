import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Planifica Croaziera Visurilor Tale',
  description:
    'Contacteaza XploreCruiseTravel pentru consultanta gratuita si personalizata privind croaziere. Email: xplorecruisetravel@gmail.com, Telefon: +40 749 558 572.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — XploreCruiseTravel',
    description: 'Contacteaza-ne pentru consultanta gratuita privind croaziere premium.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
