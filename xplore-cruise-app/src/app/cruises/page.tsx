'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import CruiseCard from '@/components/cruise/CruiseCard'
import ChatWidget from '@/components/chat/ChatWidget'
import type { Cruise } from '@/lib/supabase'
import { FEATURED_CRUISES, getFilterOptions } from '@/data/cruises-database'

// ============================================================
// Derive filter options from the real cruise database
// ============================================================

const filterOptions = getFilterOptions()
const destinations = filterOptions.destinations
const cruiseTypes = filterOptions.cruiseTypes

// ============================================================
// Cruises Listing Page
// ============================================================

export default function CruisesPage() {
  const t = useT()
  const { locale } = useLocale()

  // Filter state
  const [search, setSearch] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [nightsRange, setNightsRange] = useState<[number, number]>([0, 30])
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)

  // Destination display names — derived from real data
  const destinationNamesMap = useMemo(() => {
    const m: Record<string, { en: string; ro: string }> = {}
    for (const d of destinations) m[d.slug] = { en: d.name, ro: d.name_ro }
    return m
  }, [])

  // Cruise type display names
  const typeNames: Record<string, { en: string; ro: string }> = {
    'ocean': { en: 'Ocean', ro: 'Ocean' },
    'river': { en: 'River', ro: 'Fluvial' },
    'luxury': { en: 'Luxury', ro: 'Lux' },
    'expedition': { en: 'Expedition', ro: 'Expediție' },
  }

  // Filtered & sorted cruises
  const filteredCruises = useMemo(() => {
    let result = FEATURED_CRUISES.filter(cruise => {
      // Search filter
      if (search) {
        const q = search.toLowerCase()
        const title = locale === 'ro' && cruise.title_ro ? cruise.title_ro : cruise.title
        const matchesSearch =
          title.toLowerCase().includes(q) ||
          (cruise.cruise_line || '').toLowerCase().includes(q) ||
          (cruise.destination || '').toLowerCase().includes(q) ||
          (cruise.destination_ro || '').toLowerCase().includes(q) ||
          (cruise.ship_name || '').toLowerCase().includes(q) ||
          cruise.departure_port.toLowerCase().includes(q) ||
          (cruise.departure_port_ro || '').toLowerCase().includes(q)
        if (!matchesSearch) return false
      }

      // Destination filter
      if (selectedDestination && cruise.destination_slug !== selectedDestination) return false

      // Type filter
      if (selectedType && cruise.cruise_type !== selectedType) return false

      // Price filter
      if (cruise.price_from < priceRange[0] || cruise.price_from > priceRange[1]) return false

      // Nights filter
      if (cruise.nights < nightsRange[0] || cruise.nights > nightsRange[1]) return false

      return true
    })

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price_from - b.price_from)
        break
      case 'price_desc':
        result.sort((a, b) => b.price_from - a.price_from)
        break
      case 'date':
        result.sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime())
        break
      case 'nights':
        result.sort((a, b) => a.nights - b.nights)
        break
      default:
        // featured first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [search, selectedDestination, selectedType, priceRange, nightsRange, sortBy, locale])

  const clearFilters = () => {
    setSearch('')
    setSelectedDestination('')
    setSelectedType('')
    setPriceRange([0, 10000])
    setNightsRange([0, 30])
    setSortBy('featured')
  }

  const hasActiveFilters = search || selectedDestination || selectedType || priceRange[0] > 0 || priceRange[1] < 10000 || nightsRange[0] > 0 || nightsRange[1] < 30

  return (
    <>
      <Header />
      <main id="main-content">

      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920" alt="" fill sizes="100vw" className="object-cover opacity-15" priority quality={60} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/80" />
        <Container className="relative z-10 text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {locale === 'ro' ? 'Croazierele Noastre' : 'Our Cruises'}
          </h1>
          <p className="text-navy-200 max-w-xl mx-auto">
            {locale === 'ro'
              ? 'Descoperiti intreaga noastra selectie de croaziere premium din intreaga lume.'
              : 'Discover our full selection of premium cruises from around the world.'}
          </p>
        </Container>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-navy-100 sticky top-16 md:top-20 z-30">
        <Container>
          <div className="py-4">
            {/* Search bar + sort + filter toggle */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('filter_search')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
                />
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label={t('filter_sort')}
                className="px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer"
              >
                <option value="featured">{t('filter_sort')}</option>
                <option value="price_asc">{t('filter_sort_price_asc')}</option>
                <option value="price_desc">{t('filter_sort_price_desc')}</option>
                <option value="date">{t('filter_sort_date')}</option>
                <option value="nights">{t('filter_sort_nights')}</option>
              </select>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm text-navy-700 hover:bg-navy-100 transition-colors"
              >
                <FilterIcon className="w-4 h-4" />
                {locale === 'ro' ? 'Filtre' : 'Filters'}
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                )}
              </button>
            </div>

            {/* Filter bar (always visible on desktop, toggleable on mobile) */}
            <div className={`mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              {/* Destination */}
              <select
                value={selectedDestination}
                onChange={e => setSelectedDestination(e.target.value)}
                aria-label={t('filter_destination')}
                className="px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer"
              >
                <option value="">{t('filter_destination')}: {t('filter_all')}</option>
                {destinations.map(dest => (
                  <option key={dest.slug} value={dest.slug}>
                    {locale === 'ro' ? dest.name_ro : dest.name}
                  </option>
                ))}
              </select>

              {/* Cruise Type */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                aria-label={t('filter_type')}
                className="px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer"
              >
                <option value="">{t('filter_type')}: {t('filter_all')}</option>
                {cruiseTypes.map(type => (
                  <option key={type} value={type}>
                    {typeNames[type]?.[locale] ?? type}
                  </option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-navy-500 whitespace-nowrap">{t('filter_price')}:</label>
                <input
                  type="number"
                  value={priceRange[0] || ''}
                  onChange={e => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
                <span className="text-navy-400">-</span>
                <input
                  type="number"
                  value={priceRange[1] === 10000 ? '' : priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
              </div>

              {/* Nights Range */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-navy-500 whitespace-nowrap">{t('filter_nights')}:</label>
                <input
                  type="number"
                  value={nightsRange[0] || ''}
                  onChange={e => setNightsRange([Number(e.target.value) || 0, nightsRange[1]])}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
                <span className="text-navy-400">-</span>
                <input
                  type="number"
                  value={nightsRange[1] === 30 ? '' : nightsRange[1]}
                  onChange={e => setNightsRange([nightsRange[0], Number(e.target.value) || 30])}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
              </div>
            </div>

            {/* Active filters + clear */}
            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-navy-500">
                  {filteredCruises.length} {locale === 'ro' ? 'rezultate' : 'results'}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors"
                >
                  {locale === 'ro' ? 'Sterge filtrele' : 'Clear filters'}
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Cruise Grid */}
      <section className="py-12 bg-navy-50 min-h-[50vh]">
        <Container>
          <h2 className="sr-only">
            {locale === 'ro' ? 'Lista Croaziere' : 'Cruise Listings'}
          </h2>
          {filteredCruises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCruises.map((cruise, i) => (
                <div key={cruise.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <CruiseCard cruise={cruise} locale={locale} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy-100 flex items-center justify-center">
                <SearchIcon className="w-8 h-8 text-navy-400" />
              </div>
              <h3 className="text-xl font-semibold text-navy-700 mb-2">
                {t('filter_no_results')}
              </h3>
              <p className="text-navy-500 mb-6 max-w-md mx-auto">
                {locale === 'ro'
                  ? 'Incercati sa modificati filtrele sau sa cautati altceva.'
                  : 'Try adjusting your filters or searching for something else.'}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-semibold hover:from-gold-600 hover:to-gold-700 transition-all shadow-md"
              >
                {locale === 'ro' ? 'Sterge filtrele' : 'Clear all filters'}
              </button>
            </div>
          )}
        </Container>
      </section>

      <ChatWidget />
      </main>
      <Footer />
    </>
  )
}

// ============================================================
// Inline SVG icons
// ============================================================

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  )
}
