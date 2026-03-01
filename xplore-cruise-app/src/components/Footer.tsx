'use client'

import React from 'react'
import Link from 'next/link'
import { useT, useLocale } from '@/i18n/context'
import Container from '@/components/ui/Container'

// ============================================================
// Footer
// ============================================================

export default function Footer() {
  const t = useT()
  const { locale } = useLocale()

  const quickLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/cruises', label: t('nav_cruises') },
    { href: '/about', label: t('nav_about') },
    { href: '/contact', label: t('nav_contact') },
  ]

  const legalLinks = [
    { href: '/terms', label: t('footer_terms') },
    { href: '/privacy', label: t('footer_privacy') },
    { href: '/cookies', label: t('footer_cookies') },
    { href: '/gdpr', label: t('footer_gdpr') },
  ]

  return (
    <footer role="contentinfo" className="bg-navy-900 text-navy-200">
      {/* Main Footer */}
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-3 inline-block text-xl font-bold">
              <span className="font-heading text-white">Xplore</span>
              <span className="font-heading text-gold-500">CruiseTravel</span>
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-navy-300">
              {t('footer_tagline')}
            </p>
            <p className="text-xs text-gold-400">
              {t('footer_partner')}
            </p>

            {/* Social Media */}
            <div className="mt-5 flex gap-3">
              {[
                { platform: 'facebook', url: 'https://www.facebook.com/xplorecruisetravel', labelRo: 'Pagina noastra de Facebook', labelEn: 'Our Facebook page' },
                { platform: 'instagram', url: 'https://www.instagram.com/xplorecruisetravel', labelRo: 'Pagina noastra de Instagram', labelEn: 'Our Instagram page' },
                { platform: 'twitter', url: 'https://x.com/xplorecruise', labelRo: 'Pagina noastra de X', labelEn: 'Our X page' },
              ].map(({ platform, url, labelRo, labelEn }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 text-navy-300 transition-colors hover:border-gold-500 hover:text-gold-400"
                  aria-label={locale === 'ro' ? labelRo : labelEn}
                >
                  <SocialIcon platform={platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t('footer_legal')}
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-400">
              {t('footer_contact')}
            </h3>
            <ul className="space-y-3 text-sm text-navy-300">
              <li>
                <span className="mb-1 block text-xs font-medium uppercase text-navy-300">
                  {locale === 'ro' ? 'Persoana de Contact' : 'Contact Person'}
                </span>
                Ceausu Daniel Antonina
              </li>
              <li>
                <a
                  href="mailto:xplorecruisetravel@gmail.com"
                  className="transition-colors hover:text-gold-400"
                >
                  xplorecruisetravel@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+40749558572"
                  className="transition-colors hover:text-gold-400"
                >
                  +40 749 558 572
                </a>
              </li>
              <li className="text-navy-300">
                Romania
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-300 sm:flex-row">
            <p>{t('footer_copyright')}</p>
            <p className="text-gold-500">{t('footer_partner')}</p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

// ============================================================
// Social Icons (minimal SVG placeholders)
// ============================================================

function SocialIcon({ platform }: { platform: string }) {
  const size = 16
  switch (platform) {
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    case 'twitter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    default:
      return null
  }
}
