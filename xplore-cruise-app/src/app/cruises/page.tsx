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

// ============================================================
// Demo cruise data (same as homepage, will be replaced by Supabase)
// ============================================================

const demoCruises: Cruise[] = [
  {
    id: '1', slug: 'western-mediterranean-discovery', title: 'Western Mediterranean Discovery', title_ro: 'Descoperirea Mediteranei de Vest',
    cruise_type: 'ocean', nights: 7, price_from: 599, currency: 'EUR', departure_port: 'Barcelona, Spain', departure_port_ro: 'Barcelona, Spania',
    departure_date: '2026-06-15', ports_of_call: ['Marseille', 'Genoa', 'Rome', 'Palermo', 'Valletta'], ports_of_call_ro: ['Marsilia', 'Genova', 'Roma', 'Palermo', 'Valletta'],
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800', gallery_urls: [],
    included: ['Full-board meals', 'Entertainment', 'Pool & spa'], included_ro: ['Masa completa', 'Divertisment', 'Piscina & spa'],
    excluded: ['Shore excursions', 'Premium drinks'], excluded_ro: ['Excursii terestre', 'Bauturi premium'],
    tags: ['popular', 'family'], featured: true, active: true, source: 'manual',
    cruise_line: 'MSC Cruises', ship_name: 'MSC Meraviglia', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
  },
  {
    id: '2', slug: 'greek-islands-turkey-voyage', title: 'Greek Islands & Turkey Voyage', title_ro: 'Insulele Grecesti si Turcia',
    cruise_type: 'ocean', nights: 7, price_from: 649, currency: 'EUR', departure_port: 'Athens (Piraeus), Greece', departure_port_ro: 'Atena (Pireu), Grecia',
    departure_date: '2026-06-10', ports_of_call: ['Mykonos', 'Kusadasi', 'Patmos', 'Rhodes', 'Santorini'], ports_of_call_ro: ['Mykonos', 'Kusadasi', 'Patmos', 'Rodos', 'Santorini'],
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Kids club'], included_ro: ['Toate mesele', 'Divertisment', 'Club copii'],
    excluded: ['Drinks package', 'Excursions'], excluded_ro: ['Pachet bauturi', 'Excursii'],
    tags: ['popular', 'romantic'], featured: true, active: true, source: 'manual',
    cruise_line: 'Costa Cruises', ship_name: 'Costa Toscana', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
  },
  {
    id: '3', slug: 'norwegian-fjords-explorer', title: 'Norwegian Fjords Explorer', title_ro: 'Explorator Fiorduri Norvegiene',
    cruise_type: 'ocean', nights: 10, price_from: 1199, currency: 'EUR', departure_port: 'Southampton, UK', departure_port_ro: 'Southampton, Regatul Unit',
    departure_date: '2026-07-05', ports_of_call: ['Bergen', 'Geiranger', 'Alesund', 'Stavanger', 'Flam'], ports_of_call_ro: ['Bergen', 'Geiranger', 'Alesund', 'Stavanger', 'Flam'],
    image_url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Fitness center'], included_ro: ['Toate mesele', 'Divertisment', 'Sala fitness'],
    excluded: ['Shore excursions', 'Specialty dining'], excluded_ro: ['Excursii terestre', 'Restaurante speciale'],
    tags: ['adventure', 'nature'], featured: true, active: true, source: 'manual',
    cruise_line: 'Norwegian Cruise Line', ship_name: 'Norwegian Getaway', destination: 'Northern Europe', destination_ro: 'Europa de Nord', destination_slug: 'northern-europe',
  },
  {
    id: '4', slug: 'romantic-danube-river-cruise', title: 'Romantic Danube River Cruise', title_ro: 'Croaziera Romantica pe Dunare',
    cruise_type: 'river', nights: 8, price_from: 2299, currency: 'EUR', departure_port: 'Budapest, Hungary', departure_port_ro: 'Budapesta, Ungaria',
    departure_date: '2026-06-20', ports_of_call: ['Bratislava', 'Vienna', 'Durnstein', 'Melk', 'Passau'], ports_of_call_ro: ['Bratislava', 'Viena', 'Durnstein', 'Melk', 'Passau'],
    image_url: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800', gallery_urls: [],
    included: ['All meals', 'Shore excursions', 'Wine tasting'], included_ro: ['Toate mesele', 'Excursii terestre', 'Degustare vin'],
    excluded: ['Premium wines', 'Spa treatments'], excluded_ro: ['Vinuri premium', 'Tratamente spa'],
    tags: ['romantic', 'cultural'], featured: true, active: true, source: 'manual',
    cruise_line: 'Viking River Cruises', ship_name: 'Viking Longship Hild', destination: 'River Cruises', destination_ro: 'Croaziere Fluviale', destination_slug: 'river-cruises',
  },
  {
    id: '5', slug: 'caribbean-perfect-day', title: 'Caribbean & Perfect Day', title_ro: 'Caraibe si Perfect Day',
    cruise_type: 'ocean', nights: 7, price_from: 749, currency: 'EUR', departure_port: 'Miami, FL, USA', departure_port_ro: 'Miami, FL, SUA',
    departure_date: '2026-11-10', ports_of_call: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'], ports_of_call_ro: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'],
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Pool deck'], included_ro: ['Toate mesele', 'Divertisment', 'Punte piscina'],
    excluded: ['Drink packages', 'WiFi'], excluded_ro: ['Pachet bauturi', 'WiFi'],
    tags: ['family', 'tropical'], featured: true, active: true, source: 'manual',
    cruise_line: 'Royal Caribbean', ship_name: 'Harmony of the Seas', destination: 'Caribbean', destination_ro: 'Caraibe', destination_slug: 'caribbean',
  },
  {
    id: '6', slug: 'adriatic-luxury-collection', title: 'Adriatic Luxury Collection', title_ro: 'Colectia de Lux Adriatica',
    cruise_type: 'luxury', nights: 10, price_from: 4999, currency: 'EUR', departure_port: 'Venice, Italy', departure_port_ro: 'Venetia, Italia',
    departure_date: '2026-09-12', ports_of_call: ['Dubrovnik', 'Kotor', 'Corfu', 'Katakolon', 'Mykonos'], ports_of_call_ro: ['Dubrovnik', 'Kotor', 'Corfu', 'Katakolon', 'Mykonos'],
    image_url: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800', gallery_urls: [],
    included: ['Butler service', 'All drinks', 'Shore excursions', 'WiFi'], included_ro: ['Serviciu butler', 'Toate bauturile', 'Excursii terestre', 'WiFi'],
    excluded: ['Premium spa packages'], excluded_ro: ['Pachete spa premium'],
    tags: ['luxury', 'adults-only'], featured: true, active: true, source: 'manual',
    cruise_line: 'Silversea', ship_name: 'Silver Moon', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
  },
]

// ============================================================
// Unique values for filters
// ============================================================

const destinations = Array.from(new Set(demoCruises.map(c => c.destination_slug).filter(Boolean)))
const cruiseTypes = Array.from(new Set(demoCruises.map(c => c.cruise_type)))

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

  // Destination display names
  const destinationNames: Record<string, { en: string; ro: string }> = {
    'mediterranean': { en: 'Mediterranean', ro: 'Mediterana' },
    'northern-europe': { en: 'Northern Europe', ro: 'Europa de Nord' },
    'caribbean': { en: 'Caribbean', ro: 'Caraibe' },
    'river-cruises': { en: 'River Cruises', ro: 'Croaziere Fluviale' },
  }

  // Cruise type display names
  const typeNames: Record<string, { en: string; ro: string }> = {
    'ocean': { en: 'Ocean', ro: 'Ocean' },
    'river': { en: 'River', ro: 'Fluvial' },
    'luxury': { en: 'Luxury', ro: 'Lux' },
    'expedition': { en: 'Expedition', ro: 'Expeditie' },
  }

  // Filtered & sorted cruises
  const filteredCruises = useMemo(() => {
    let result = demoCruises.filter(cruise => {
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
                  <option key={dest} value={dest}>
                    {destinationNames[dest!]?.[locale] || dest}
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
                    {typeNames[type]?.[locale] || type}
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
