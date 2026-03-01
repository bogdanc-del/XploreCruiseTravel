import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica Cookie',
  description: 'Politica de utilizare a cookie-urilor pe site-ul XploreCruiseTravel. Aflati ce cookie-uri folosim si cum le puteti gestiona.',
  alternates: { canonical: '/cookies' },
}

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
