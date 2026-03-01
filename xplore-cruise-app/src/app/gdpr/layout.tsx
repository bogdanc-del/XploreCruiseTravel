import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GDPR — Protectia Datelor Personale',
  description: 'Informatii despre conformitatea GDPR a XploreCruiseTravel. Drepturile dumneavoastra privind datele personale.',
  alternates: { canonical: '/gdpr' },
}

export default function GdprLayout({ children }: { children: React.ReactNode }) {
  return children
}
