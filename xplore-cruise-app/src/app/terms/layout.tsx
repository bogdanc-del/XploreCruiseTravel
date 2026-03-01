import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termeni si Conditii',
  description: 'Termenii si conditiile de utilizare a serviciilor XploreCruiseTravel. Informati-va despre drepturile si obligatiile dumneavoastra.',
  alternates: { canonical: '/terms' },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
