'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import CruiseCard from '@/components/cruise/CruiseCard'
import GuidedEntryCard from '@/components/guided/GuidedEntryCard'
import { useGuidedFlow } from '@/context/GuidedFlowContext'
import ChatWidget from '@/components/chat/ChatWidget'
import type { Cruise } from '@/lib/supabase'

// ============================================================
// Types for the API response
// ============================================================

interface ApiCruise {
  id: string
  slug: string
  title: string
  cruise_type: string
  nights: number
  price_from: number
  currency: string
  departure_port: string
  departure_date: string | null
  ports_of_call: string[]
  image_url: string
  cruise_line: string
  ship_name: string
  destination: string
  destination_ro: string
  destination_slug: string
  // Grouped route fields (present when API grouped=1)
  departure_count?: number
  price_min?: number
  price_max?: number
  next_departures?: string[]
}

interface FilterMeta {
  destinations: { slug: string; name: string; name_ro: string }[]
  cruiseLines: string[]
  cruiseTypes: string[]
  priceRange: { min: number; max: number }
  nightsRange: { min: number; max: number }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Adapt API cruise to Cruise type for CruiseCard (supports grouped fields)
function apiToCruise(c: ApiCruise): Cruise & {
  departure_count?: number
  price_min?: number
  price_max?: number
  next_departures?: string[]
} {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    title_ro: c.title, // Title is already in Romanian from croaziere.net
    cruise_type: c.cruise_type as Cruise['cruise_type'],
    nights: c.nights,
    price_from: c.price_from,
    currency: c.currency || 'EUR',
    departure_port: c.departure_port,
    departure_port_ro: c.departure_port,
    departure_date: c.departure_date || '',
    ports_of_call: c.ports_of_call || [],
    ports_of_call_ro: c.ports_of_call || [],
    image_url: c.image_url,
    gallery_urls: [],
    included: [],
    included_ro: [],
    excluded: [],
    excluded_ro: [],
    tags: [],
    featured: false,
    active: true,
    source: 'croaziere.net',
    cruise_line: c.cruise_line,
    ship_name: c.ship_name,
    destination: c.destination,
    destination_ro: c.destination_ro || c.destination,
    destination_slug: c.destination_slug,
    // Grouped route metadata (passed through to CruiseCard)
    departure_count: c.departure_count,
    price_min: c.price_min,
    price_max: c.price_max,
    next_departures: c.next_departures,
  } as Cruise & {
    departure_count?: number
    price_min?: number
    price_max?: number
    next_departures?: string[]
  }
}

// ============================================================
// Cruises Listing Page — fetches from API with pagination
// ============================================================

const ITEMS_PER_PAGE = 24

export default function CruisesPage() {
  const t = useT()
  const { locale } = useLocale()
  const { openFlow } = useGuidedFlow()

  // Persistent floating CTA — visible when guided banner scrolls out of view
  const bannerRef = useRef<HTMLDivElement>(null)
  const [showFloatingCta, setShowFloatingCta] = useState(false)

  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingCta(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(banner)
    return () => observer.disconnect()
  }, [])

  // Night range presets
  const NIGHT_RANGES = [
    { label: { en: '1-3 nights', ro: '1-3 nopți' }, min: '1', max: '3' },
    { label: { en: '4-7 nights', ro: '4-7 nopți' }, min: '4', max: '7' },
    { label: { en: '8-14 nights', ro: '8-14 nopți' }, min: '8', max: '14' },
    { label: { en: '15-21 nights', ro: '15-21 nopți' }, min: '15', max: '21' },
    { label: { en: '22+ nights', ro: '22+ nopți' }, min: '22', max: '' },
  ]

  // Filter state
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLine, setSelectedLine] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minNights, setMinNights] = useState('')
  const [maxNights, setMaxNights] = useState('')
  const [sortBy, setSortBy] = useState('price_asc')
  const [showFilters, setShowFilters] = useState(false)

  // API data (Cruise extended with optional grouped fields)
  const [cruises, setCruises] = useState<(Cruise & { departure_count?: number; price_min?: number; price_max?: number; next_departures?: string[] })[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [meta, setMeta] = useState<FilterMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const abortRef = useRef<AbortController | null>(null)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search)
      setPage(1) // Reset to page 1 on search
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [selectedDestination, selectedType, selectedLine, minPrice, maxPrice, minNights, maxNights, sortBy])

  // Load filter metadata once
  useEffect(() => {
    fetch('/api/cruises?meta=1')
      .then(r => r.json())
      .then(data => setMeta(data))
      .catch(() => {})
  }, [])

  // Fetch cruises from API
  const fetchCruises = useCallback(async () => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)

    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(ITEMS_PER_PAGE))
    params.set('grouped', '1')
    if (searchDebounced) params.set('search', searchDebounced)
    if (selectedDestination) params.set('destination', selectedDestination)
    if (selectedType) params.set('type', selectedType)
    if (selectedLine) params.set('line', selectedLine)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minNights) params.set('minNights', minNights)
    if (maxNights) params.set('maxNights', maxNights)
    if (sortBy) params.set('sort', sortBy)

    try {
      const res = await fetch(`/api/cruises?${params}`, { signal: controller.signal })
      const data = await res.json()
      setCruises((data.cruises || []).map(apiToCruise))
      setPagination(data.pagination)
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Failed to fetch cruises:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [page, searchDebounced, selectedDestination, selectedType, selectedLine, minPrice, maxPrice, minNights, maxNights, sortBy])

  useEffect(() => { fetchCruises() }, [fetchCruises])

  const clearFilters = () => {
    setSearch('')
    setSearchDebounced('')
    setSelectedDestination('')
    setSelectedType('')
    setSelectedLine('')
    setMinPrice('')
    setMaxPrice('')
    setMinNights('')
    setMaxNights('')
    setSortBy('price_asc')
    setPage(1)
  }

  const hasActiveFilters = search || selectedDestination || selectedType || selectedLine || minPrice || maxPrice || minNights || maxNights

  // Cruise type display names
  const typeNames: Record<string, { en: string; ro: string }> = {
    'ocean': { en: 'Ocean', ro: 'Ocean' },
    'river': { en: 'River', ro: 'Fluvial' },
    'luxury': { en: 'Luxury', ro: 'Lux' },
    'expedition': { en: 'Expedition', ro: 'Expediție' },
  }

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
              ? 'Peste 8.400 de croaziere din întreaga lume. Filtrați după destinație, preț sau linie de croazieră.'
              : 'Over 8,400 cruises worldwide. Filter by destination, price, or cruise line.'}
          </p>
        </Container>
      </section>

      {/* Guided Recommendation Banner */}
      <section ref={bannerRef} className="bg-navy-50 py-4">
        <Container>
          <GuidedEntryCard variant="banner" onStart={() => openFlow('listing')} locale={locale} />
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
                <option value="price_asc">{t('filter_sort_price_asc')}</option>
                <option value="price_desc">{t('filter_sort_price_desc')}</option>
                <option value="date">{t('filter_sort_date')}</option>
                <option value="nights_asc">{t('filter_sort_nights')}</option>
              </select>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm text-navy-700 hover:bg-navy-100 transition-colors"
              >
                <FilterIcon className="w-4 h-4" />
                {locale === 'ro' ? 'Filtre' : 'Filters'}
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                )}
              </button>
            </div>

            {/* Filter bar (always visible on desktop, toggleable on mobile) */}
            <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ${showFilters ? '' : 'hidden'}`}>
              {/* Destination */}
              <select
                value={selectedDestination}
                onChange={e => setSelectedDestination(e.target.value)}
                aria-label={t('filter_destination')}
                className="px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer"
              >
                <option value="">{t('filter_destination')}: {t('filter_all')}</option>
                {meta?.destinations.map(dest => (
                  <option key={dest.slug} value={dest.slug}>
                    {locale === 'ro' ? dest.name_ro : dest.name}
                  </option>
                ))}
              </select>

              {/* Cruise Line */}
              <select
                value={selectedLine}
                onChange={e => setSelectedLine(e.target.value)}
                aria-label={locale === 'ro' ? 'Linia de croazieră' : 'Cruise Line'}
                className="px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer"
              >
                <option value="">{locale === 'ro' ? 'Linia' : 'Cruise Line'}: {t('filter_all')}</option>
                {meta?.cruiseLines.map(line => (
                  <option key={line} value={line}>{line}</option>
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
                {meta?.cruiseTypes.map(type => (
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
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="Min €"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
                <span className="text-navy-400">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="Max €"
                  className="w-full px-3 py-2.5 rounded-lg border border-navy-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
                />
              </div>

              {/* Nights Range — quick-select buttons */}
              <div className="flex flex-col gap-1.5 lg:col-span-2">
                <label className="text-xs text-navy-500 whitespace-nowrap">{t('filter_nights')}:</label>
                <div className="flex flex-wrap gap-1.5">
                  {NIGHT_RANGES.map(range => {
                    const isActive = minNights === range.min && maxNights === range.max
                    return (
                      <button
                        key={range.min + '-' + range.max}
                        onClick={() => {
                          if (isActive) {
                            setMinNights('')
                            setMaxNights('')
                          } else {
                            setMinNights(range.min)
                            setMaxNights(range.max)
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white border-gold-500 shadow-sm'
                            : 'bg-white text-navy-600 border-navy-200 hover:border-gold-400 hover:text-gold-700'
                        }`}
                      >
                        {locale === 'ro' ? range.label.ro : range.label.en}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Active filters + clear + result count */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-navy-500">
                {pagination ? (
                  <>
                    {pagination.total.toLocaleString()} {locale === 'ro' ? 'rute unice' : 'unique routes'}
                    {pagination.totalPages > 1 && (
                      <> — {locale === 'ro' ? 'pagina' : 'page'} {pagination.page}/{pagination.totalPages}</>
                    )}
                  </>
                ) : (
                  loading ? (locale === 'ro' ? 'Se încarcă...' : 'Loading...') : ''
                )}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gold-600 hover:text-gold-700 font-medium transition-colors"
                >
                  {locale === 'ro' ? 'Șterge filtrele' : 'Clear filters'}
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Cruise Grid */}
      <section className="py-12 bg-navy-50 min-h-[50vh]">
        <Container>
          <h2 className="sr-only">
            {locale === 'ro' ? 'Lista Croaziere' : 'Cruise Listings'}
          </h2>

          {/* Loading state */}
          {loading && cruises.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-48 bg-navy-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-navy-100 rounded w-3/4" />
                    <div className="h-3 bg-navy-100 rounded w-1/2" />
                    <div className="h-3 bg-navy-100 rounded w-2/3" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-navy-100 rounded w-20" />
                      <div className="h-8 bg-navy-100 rounded w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {cruises.length > 0 ? (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${loading ? 'opacity-60' : ''}`}>
                {cruises.map((cruise, i) => (
                  <div key={cruise.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <CruiseCard cruise={cruise} locale={locale} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ← {locale === 'ro' ? 'Anterior' : 'Previous'}
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers(pagination.page, pagination.totalPages).map((p, i) => (
                      p === '...' ? (
                        <span key={`dots-${i}`} className="px-2 text-navy-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => { setPage(Number(p)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            Number(p) === pagination.page
                              ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md'
                              : 'border border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => { setPage(p => Math.min(pagination.totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }) }}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 rounded-lg border border-navy-200 bg-white text-sm text-navy-700 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {locale === 'ro' ? 'Următor' : 'Next'} →
                  </button>
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy-100 flex items-center justify-center">
                <SearchIcon className="w-8 h-8 text-navy-400" />
              </div>
              <h3 className="text-xl font-semibold text-navy-700 mb-2">
                {t('filter_no_results')}
              </h3>
              <p className="text-navy-500 mb-6 max-w-md mx-auto">
                {locale === 'ro'
                  ? 'Încercați să modificați filtrele sau să căutați altceva.'
                  : 'Try adjusting your filters or searching for something else.'}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-semibold hover:from-gold-600 hover:to-gold-700 transition-all shadow-md"
              >
                {locale === 'ro' ? 'Șterge filtrele' : 'Clear all filters'}
              </button>
            </div>
          ) : null}
        </Container>
      </section>

      {/* Persistent floating guided CTA pill — bottom-right, above chat widget */}
      <div
        className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ${
          showFloatingCta
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => openFlow('listing')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-semibold shadow-lg hover:from-gold-600 hover:to-gold-700 hover:shadow-xl transition-all duration-200"
          aria-label={t('guided_persistent_cta')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          {t('guided_persistent_cta')}
        </button>
      </div>

      <ChatWidget />
      </main>
      <Footer />
    </>
  )
}

// ============================================================
// Pagination helper — smart page numbers with ellipsis
// ============================================================

function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | string)[] = []
  pages.push(1)

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)
  return pages
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
