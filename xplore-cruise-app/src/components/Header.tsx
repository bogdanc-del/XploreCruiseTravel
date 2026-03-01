'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useT } from '@/i18n/context'
import Container from '@/components/ui/Container'

// ============================================================
// Logo Icon Variants — Cruise-themed SVGs
// ============================================================

function LogoVariant1({ className }: { className?: string }) {
  // Elegant cruise ship with waves — modern minimal
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ship hull */}
      <path d="M8 30h32l-4 10H12L8 30z" fill="currentColor" />
      {/* Deck / cabin */}
      <path d="M14 24h20v6H14z" fill="currentColor" opacity="0.7" />
      {/* Funnel / smokestack */}
      <path d="M22 16h4v8h-4z" fill="currentColor" opacity="0.5" />
      {/* Funnel top stripe */}
      <rect x="21" y="14" width="6" height="3" rx="1" fill="currentColor" opacity="0.8" />
      {/* Waves beneath */}
      <path d="M4 42c4-3 8-3 12 0s8 3 12 0 8-3 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

function LogoVariant2({ className }: { className?: string }) {
  // Sailing ship / yacht with sails — adventurous
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main sail */}
      <path d="M24 6L36 30H24V6z" fill="currentColor" opacity="0.7" />
      {/* Front sail / jib */}
      <path d="M24 12L14 30h10V12z" fill="currentColor" opacity="0.5" />
      {/* Mast */}
      <rect x="23" y="6" width="2" height="28" fill="currentColor" opacity="0.8" />
      {/* Hull */}
      <path d="M10 32h28l-3 8H13l-3-8z" fill="currentColor" />
      {/* Water line */}
      <path d="M6 44c4-2 8-2 12 0s8 2 12 0 8-2 12 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}

function LogoVariant3({ className }: { className?: string }) {
  // Compass + anchor hybrid — nautical luxury
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle outline — compass ring */}
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      {/* Anchor shaft */}
      <rect x="22.5" y="10" width="3" height="24" rx="1.5" fill="currentColor" opacity="0.7" />
      {/* Anchor cross bar */}
      <rect x="16" y="16" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
      {/* Anchor ring at top */}
      <circle cx="24" cy="9" r="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
      {/* Anchor flukes */}
      <path d="M15 34c0-5 4-8 9-8s9 3 9 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Small fluke tips */}
      <path d="M15 34l-3-3M33 34l3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LogoVariant4({ className }: { className?: string }) {
  // Modern cruise ship — detailed and premium
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main hull */}
      <path d="M6 32l4-4h28l4 4-6 8H12L6 32z" fill="currentColor" />
      {/* Upper deck */}
      <path d="M12 22h24v6H12z" fill="currentColor" opacity="0.6" />
      {/* Windows on deck */}
      <rect x="15" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
      <rect x="19" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
      <rect x="23" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
      <rect x="27" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
      <rect x="31" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
      {/* Funnel 1 */}
      <path d="M19 14h4v8h-4z" fill="currentColor" opacity="0.5" />
      <path d="M18 12h6v3h-6z" fill="currentColor" opacity="0.7" />
      {/* Funnel 2 */}
      <path d="M27 16h3v6h-3z" fill="currentColor" opacity="0.4" />
      <path d="M26.5 14.5h4v2h-4z" fill="currentColor" opacity="0.6" />
      {/* Waves */}
      <path d="M2 44c5-3 10-3 15 0s10 3 15 0 10-3 15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

// Currently active logo
const ActiveLogo = LogoVariant4

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

  // Dynamic color classes based on scroll state
  const textColor = scrolled ? 'text-navy-700' : 'text-white'
  const textColorMuted = scrolled ? 'text-navy-600' : 'text-white/80'
  const borderColor = scrolled ? 'border-navy-200' : 'border-white/30'
  const hoverBg = scrolled ? 'hover:bg-navy-50' : 'hover:bg-white/10'

  return (
    <header
      role="banner"
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-md'
          : 'bg-transparent'
      }`}
    >
      <Container>
        <nav aria-label="Main navigation" className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold md:text-2xl">
            <ActiveLogo
              className={`h-9 w-9 md:h-10 md:w-10 transition-colors duration-300 ${
                scrolled ? 'text-gold-500' : 'text-gold-400'
              }`}
            />
            <span className="flex items-baseline gap-0.5">
              <span className={`font-heading transition-colors duration-300 ${
                scrolled ? 'text-navy-900' : 'text-white'
              }`}>Xplore</span>
              <span className="font-heading text-gold-500">Cruise</span>
              <span className={`font-heading transition-colors duration-300 ${
                scrolled ? 'text-navy-700' : 'text-white/80'
              }`}>Travel</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-gold-400 ${textColor}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 hover:border-gold-400 hover:text-gold-400 ${textColorMuted} ${borderColor}`}
              aria-label={locale === 'en' ? 'Schimba limba in romana' : 'Switch language to English'}
            >
              {t('lang_switch')}
            </button>
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLocale}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors duration-300 hover:border-gold-400 hover:text-gold-400 ${textColorMuted} ${borderColor}`}
              aria-label={locale === 'en' ? 'Schimba limba in romana' : 'Switch language to English'}
            >
              {t('lang_switch')}
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-300 ${textColor} ${hoverBg}`}
              aria-label={mobileOpen ? (locale === 'ro' ? 'Inchide meniul' : 'Close menu') : (locale === 'ro' ? 'Deschide meniul' : 'Open menu')}
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">{mobileOpen ? (locale === 'ro' ? 'Inchide meniul' : 'Close menu') : (locale === 'ro' ? 'Deschide meniul' : 'Open menu')}</span>
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
        <div className="border-t border-navy-100 bg-white/95 backdrop-blur-xl shadow-lg md:hidden">
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
