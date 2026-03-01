import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politica de Confidentialitate',
  description: 'Politica de confidentialitate XploreCruiseTravel. Aflati cum protejam datele dumneavoastra personale conform GDPR.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
