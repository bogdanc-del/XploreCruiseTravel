import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { LocaleProvider } from '@/i18n/context'

// ============================================================
// Google Fonts
// ============================================================

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

// ============================================================
// Metadata
// ============================================================

export const metadata: Metadata = {
  title: 'XploreCruiseTravel - Premium Cruise Experiences',
  description:
    'Discover and book premium cruise experiences worldwide. Ocean, river, luxury and expedition cruises curated by XploreCruiseTravel, licensed cruise consultant in Romania since 2016. Best prices guaranteed.',
  keywords: [
    'cruise',
    'cruise booking',
    'luxury cruise',
    'river cruise',
    'ocean cruise',
    'expedition cruise',
    'croaziere',
    'XploreCruiseTravel',
    'cruise consultant Romania',
  ],
  authors: [{ name: 'XploreCruiseTravel' }],
  openGraph: {
    title: 'XploreCruiseTravel - Premium Cruise Experiences',
    description:
      'Discover and book premium cruise experiences worldwide. Licensed cruise consultant in Romania since 2016.',
    type: 'website',
    locale: 'ro_RO',
    alternateLocale: 'en_US',
  },
}

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white font-body text-navy-900 antialiased">
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
