import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import Script from 'next/script'
import '@/styles/globals.css'
import { LocaleProvider } from '@/i18n/context'
import { GuidedFlowProvider } from '@/context/GuidedFlowContext'
import { ExchangeRateProvider } from '@/context/ExchangeRateContext'
import GuidedFlowOverlay from '@/components/guided/GuidedFlowOverlay'
import SkipToContent from '@/components/ui/SkipToContent'

// Google Analytics Measurement ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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
  metadataBase: new URL('https://xplorecruisetravel.com'),
  title: {
    default: 'XploreCruiseTravel — Croaziere Premium | Consultant Autorizat Romania',
    template: '%s | XploreCruiseTravel',
  },
  description:
    'Descopera si rezerva croaziere premium in toata lumea. Croaziere pe ocean, rau, de lux si expeditie selectate de XploreCruiseTravel, consultant autorizat de croaziere in Romania din 2016. Preturi competitive si oferte exclusive.',
  keywords: [
    'croaziere',
    'croaziere premium',
    'croaziere lux',
    'croaziere fluviale',
    'croaziere ocean',
    'croaziere expeditie',
    'XploreCruiseTravel',
    'consultant croaziere Romania',
    'cruise booking',
    'luxury cruise',
  ],
  authors: [{ name: 'XploreCruiseTravel' }],
  openGraph: {
    title: 'XploreCruiseTravel — Croaziere Premium',
    description:
      'Descopera si rezerva croaziere premium in toata lumea. Consultant autorizat de croaziere in Romania din 2016.',
    type: 'website',
    locale: 'ro_RO',
    alternateLocale: 'en_US',
    siteName: 'XploreCruiseTravel',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'XploreCruiseTravel — Croaziere Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XploreCruiseTravel — Croaziere Premium',
    description: 'Descopera si rezerva croaziere premium in toata lumea.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
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
      {/* Google Analytics GA4 */}
      {GA_ID && (
        <head>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </head>
      )}
      <body className="min-h-screen bg-white font-body text-navy-900 antialiased">
        <LocaleProvider>
          <ExchangeRateProvider>
            <GuidedFlowProvider>
              <SkipToContent />
              {children}
              <GuidedFlowOverlay />
            </GuidedFlowProvider>
          </ExchangeRateProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
