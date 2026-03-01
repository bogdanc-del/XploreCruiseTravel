'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useT } from '@/i18n/context'
import Container from '@/components/ui/Container'

// ============================================================
// Header
// ============================================================

export default function Header() {
  const { locale, toggleLocale } = useLocale()
  const t = useT()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Glass morphism on scroll
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change (resize as proxy)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/cruises', label: t('nav_cruises') },
    { href: '/about', label: t('nav_about') },
    { href: '/contact', label: t('nav_contact') },
  ]

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-md'
          : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 text-xl font-bold md:text-2xl">
            <span className="font-heading text-navy-900">Xplore</span>
            <span className="font-heading text-gold-500">CruiseTravel</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-gold-500"
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="rounded-md border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-600"
              aria-label={`Switch language to ${locale === 'en' ? 'Romanian' : 'English'}`}
            >
              {t('lang_switch')}
            </button>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLocale}
              className="rounded-md border border-navy-200 px-2.5 py-1 text-xs font-semibold text-navy-700 transition-colors hover:border-gold-400 hover:text-gold-600"
              aria-label={`Switch language to ${locale === 'en' ? 'Romanian' : 'English'}`}
            >
              {t('lang_switch')}
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-md text-navy-700 transition-colors hover:bg-navy-50"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {/* Hamburger / X icon */}
              <span className="flex flex-col items-center justify-center gap-1.5">
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                    mobileOpen ? 'translate-y-2 rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-opacity duration-300 ${
                    mobileOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                    mobileOpen ? '-translate-y-2 -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="glass border-t border-navy-100 md:hidden">
          <Container>
            <div className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-gold-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
