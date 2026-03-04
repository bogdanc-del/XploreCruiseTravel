'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import CruiseCard from '@/components/cruise/CruiseCard'
import LeadCaptureForm from '@/components/lead/LeadCaptureForm'
import ChatWidget from '@/components/chat/ChatWidget'
import dynamic from 'next/dynamic'

import RouteMapStatic from '@/components/cruise/RouteMapStatic'
import type { Cruise } from '@/lib/supabase'
import { useExchangeRate } from '@/context/ExchangeRateContext'
import { timeAgo, isPriceRecentlyChanged } from '@/lib/time-ago'
import { trackCruiseDetailView, trackCtaClick, trackCtaImpression } from '@/lib/analytics'
import { getAssignedVariant, CTA_VARIANTS, type CTAVariant } from '@/lib/ab-testing'

// Phase 2 imports
import HeroGallery from '@/components/cruise/HeroGallery'
import PortHighlight from '@/components/cruise/PortHighlight'
import PortDrawer from '@/components/cruise/PortDrawer'
import BeveragePackageTable from '@/components/cruise/BeveragePackageTable'
import CruiseLineTerms from '@/components/cruise/CruiseLineTerms'
import CabinSelector from '@/components/cruise/CabinSelector'
import type { SelectedCabin } from '@/components/cruise/CabinSelector'
import VideoEmbed from '@/components/cruise/VideoEmbed'
import { CRUISE_LINE_TERMS } from '@/data/cruise-line-terms'
import { getShipInfo } from '@/data/ship-images'
import { getCruiseBySlugLocal, getSimilarCruises, FEATURED_CRUISES } from '@/data/cruises-database'
import { getBestImageUrl } from '@/data/ship-images'
import { getCruiseInclusions } from '@/data/cruise-inclusions'

// ============================================================
// Tab types
// ============================================================

type TabKey = 'overview' | 'itinerary' | 'cabins' | 'included' | 'beverages' | 'cancellation' | 'terms'

// ============================================================
// Cruise Detail Page
// ============================================================

export default function CruiseDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-50" />}>
      <CruiseDetailContent />
    </Suspense>
  )
}

// Helper: adapt API cruise data to Cruise type
function apiToCruise(data: Record<string, unknown>): Cruise {
  const ct = data.cruise_type as string
  const cruiseLine = data.cruise_line as string || ''
  const ports = (data.ports_of_call || []) as string[]
  const gallery = (data.gallery_urls || []) as string[]
  const itinerary = (data.itinerary || []) as { day: number; port: string; arrival: string | null; departure: string | null }[]

  // Get cruise-line-specific included/excluded (falls back to generic by cruise type)
  const inclusions = getCruiseInclusions(cruiseLine, ct)

  return {
    id: data.id as string,
    slug: data.slug as string,
    title: data.title as string,
    title_ro: data.title as string,
    cruise_type: ct as Cruise['cruise_type'],
    nights: data.nights as number,
    price_from: data.price_from as number,
    currency: (data.currency as string) || 'EUR',
    departure_port: data.departure_port as string || '',
    departure_port_ro: data.departure_port as string || '',
    departure_date: data.departure_date as string || '',
    ports_of_call: ports,
    ports_of_call_ro: ports,
    image_url: getBestImageUrl(data.image_url as string, data.ship_name as string, data.cruise_line as string) || data.image_url as string || '',
    gallery_urls: gallery,
    included: inclusions.included,
    included_ro: inclusions.included_ro,
    excluded: inclusions.excluded,
    excluded_ro: inclusions.excluded_ro,
    tags: [],
    featured: false,
    active: true,
    source: 'croaziere.net',
    booking_url: data.source_url as string || '',
    cruise_line: data.cruise_line as string || '',
    ship_name: data.ship_name as string || '',
    destination: data.destination as string || '',
    destination_ro: data.destination_ro as string || data.destination as string || '',
    destination_slug: data.destination_slug as string || '',
    departure_dates: (data.departure_dates || []) as string[],
    // Price tracking fields from sync
    previous_price_from: (data.previous_price_from as number) || null,
    price_changed_at: (data.price_changed_at as string) || null,
    last_synced_at: (data.last_synced_at as string) || null,
    // Store itinerary data for display
    _itinerary: itinerary,
    _cabin_types: (data.cabin_types || []) as { name: string; price_from: number }[],
    _disembarkation_port: (data.disembarkation_port as string) || '',
    _date_prices: (data.date_prices || []) as { date: string; price_from: number; cabin_count: number }[],
    // Promo fields
    _is_promo: data._is_promo === true,
    _is_bestdeal: data._is_bestdeal === true,
    _promo_price: data._promo_price ? Number(data._promo_price) : null,
    // Rooms (for cabin selector)
    _rooms: (data._rooms || []) as { name: string; category: string; date: string; price: number }[],
    // Enriched itinerary with arrival/departure times
    _itinerary_enriched: (data._itinerary_enriched || []) as { id: string | number; name: string; day: number; from_hour: string; till_hour: string }[],
    // Port excursions from API
    _excursions: (data._excursions || []) as { id: number; name: string; description: string; pdf: string; image: string }[],
    // Flight included flag
    _plane_included: data._plane_included === true,
  } as Cruise & {
    _itinerary: typeof itinerary
    _cabin_types: { name: string; price_from: number }[]
    _disembarkation_port: string
    _date_prices: { date: string; price_from: number; cabin_count: number }[]
    _is_promo: boolean
    _is_bestdeal: boolean
    _promo_price: number | null
    _rooms: { name: string; category: string; date: string; price: number }[]
    _itinerary_enriched: { id: string | number; name: string; day: number; from_hour: string; till_hour: string }[]
    _excursions: { id: number; name: string; description: string; pdf: string; image: string }[]
    _plane_included: boolean
  }
}

function CruiseDetailContent() {
  const t = useT()
  const { locale } = useLocale()
  const { rateWithMargin } = useExchangeRate()
  const params = useParams()
  const slug = params.slug as string

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [selectedPort, setSelectedPort] = useState<string | null>(null)
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [ctaVariant, setCtaVariant] = useState<CTAVariant>('A')
  const [selectedCabin, setSelectedCabin] = useState<SelectedCabin | null>(null)

  // State for API-loaded cruise
  const [apiCruise, setApiCruise] = useState<Cruise | null>(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(false)

  // Auto-open lead form if ?offer=1 in URL
  useEffect(() => {
    if (searchParams.get('offer') === '1') {
      setShowLeadForm(true)
    }
  }, [searchParams])

  // Get enrichment data from featured cruises (descriptions, tags, advisor notes)
  const featuredEnrichment = getCruiseBySlugLocal(slug)

  // ALWAYS fetch from API (even if we have featured enrichment)
  useEffect(() => {
    if (!slug) return
    setApiLoading(true)
    fetch(`/api/cruises/${encodeURIComponent(slug)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => {
        setApiCruise(apiToCruise(data))
        setApiLoading(false)
      })
      .catch(() => {
        setApiError(true)
        setApiLoading(false)
      })
  }, [slug])

  // API data is the BASE, featured enrichment overlays on top
  const cruise = apiCruise
    ? {
        ...apiCruise,
        // Overlay featured enrichment if available
        ...(featuredEnrichment?.description ? { description: featuredEnrichment.description } : {}),
        ...(featuredEnrichment?.description_ro ? { description_ro: featuredEnrichment.description_ro } : {}),
        ...(featuredEnrichment?.advisor_note ? { advisor_note: featuredEnrichment.advisor_note } : {}),
        ...(featuredEnrichment?.advisor_note_ro ? { advisor_note_ro: featuredEnrichment.advisor_note_ro } : {}),
        ...(featuredEnrichment?.tags?.length ? { tags: featuredEnrichment.tags } : {}),
        featured: !!featuredEnrichment,
      }
    : null

  // Track detail page view + assign CTA variant once cruise is loaded
  useEffect(() => {
    if (cruise) {
      trackCruiseDetailView(locale, cruise.slug)
      // A/B test: assign and track CTA variant
      const variant = getAssignedVariant()
      setCtaVariant(variant)
      trackCtaImpression(locale, cruise.slug, variant)
      // Set proper document title once cruise data is loaded
      const cruiseTitle = locale === 'ro' && cruise.title_ro ? cruise.title_ro : cruise.title
      document.title = `${cruiseTitle} | XploreCruiseTravel`
    }
  }, [cruise?.slug, locale]) // eslint-disable-line react-hooks/exhaustive-deps

  // Similar cruises — use featured cruises for suggestions
  const similarCruises = cruise ? getSimilarCruises(cruise, 3) : []

  // Set document title during loading to avoid "Croazieră Negăsită" flash
  useEffect(() => {
    if (apiLoading) {
      document.title = locale === 'ro'
        ? 'Se încarcă croaziera... | XploreCruiseTravel'
        : 'Loading cruise... | XploreCruiseTravel'
    }
  }, [apiLoading, locale])

  // Loading state
  if (apiLoading) {
    return (
      <>
        <Header />
        <main id="main-content">
        <section className="min-h-[60vh] flex items-center justify-center bg-navy-50">
          <Container className="text-center py-20">
            <div className="w-12 h-12 mx-auto mb-6 rounded-full border-4 border-gold-500 border-t-transparent animate-spin" />
            <p className="text-navy-500">{locale === 'ro' ? 'Se încarcă...' : 'Loading...'}</p>
          </Container>
        </section>
        </main>
        <Footer />
      </>
    )
  }

  // 404-style fallback
  if (!cruise || apiError) {
    return (
      <>
        <Header />
        <main id="main-content">
        <section className="min-h-[60vh] flex items-center justify-center bg-navy-50">
          <Container className="text-center py-20">
            <h1 className="text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {locale === 'ro' ? 'Croaziera nu a fost găsită' : 'Cruise Not Found'}
            </h1>
            <p className="text-navy-500 mb-8">
              {locale === 'ro'
                ? 'Ne pare rău, croaziera pe care o căutați nu există sau a fost eliminată.'
                : 'Sorry, the cruise you are looking for does not exist or has been removed.'}
            </p>
            <Button as="a" href="/cruises" variant="primary" size="lg">
              {locale === 'ro' ? 'Înapoi la Croaziere' : 'Back to Cruises'}
            </Button>
          </Container>
        </section>
        </main>
        <Footer />
      </>
    )
  }

  const title = locale === 'ro' && cruise.title_ro ? cruise.title_ro : cruise.title
  const destination = locale === 'ro' && cruise.destination_ro ? cruise.destination_ro : cruise.destination || ''
  const rawPorts = locale === 'ro' && cruise.ports_of_call_ro?.length ? cruise.ports_of_call_ro : cruise.ports_of_call
  const rawPortsOriginal = cruise.ports_of_call // Always use original (EN) port names for port data lookup

  // Deduplicate: if first port of call matches departure_port, skip it to avoid showing it twice
  const depNorm = (cruise.departure_port || '').trim().toLowerCase()
  const firstPortNorm = (rawPorts[0] || '').trim().toLowerCase()
  const skipFirst = rawPorts.length > 0 && depNorm === firstPortNorm

  // Determine arrival/disembarkation port for one-way cruises
  const disembarkPort = (cruise as Cruise & { _disembarkation_port?: string })._disembarkation_port || ''
  const isOneWay = !!(disembarkPort && disembarkPort.trim().toLowerCase() !== depNorm)
  const arrivalPort = isOneWay ? disembarkPort : cruise.departure_port

  // Deduplicate: if last port of call matches arrival/disembarkation port, skip it too
  const arrivalNorm = (arrivalPort || '').trim().toLowerCase()
  const trimmedFromStart = skipFirst ? rawPorts.slice(1) : rawPorts
  const trimmedFromStartOriginal = skipFirst ? rawPortsOriginal.slice(1) : rawPortsOriginal
  const lastPortNorm = trimmedFromStart.length > 0 ? (trimmedFromStart[trimmedFromStart.length - 1] || '').trim().toLowerCase() : ''
  const skipLast = trimmedFromStart.length > 0 && lastPortNorm === arrivalNorm
  const ports = skipLast ? trimmedFromStart.slice(0, -1) : trimmedFromStart
  const portsOriginal = skipLast ? trimmedFromStartOriginal.slice(0, -1) : trimmedFromStartOriginal
  const included = locale === 'ro' && cruise.included_ro?.length ? cruise.included_ro : cruise.included
  const excluded = locale === 'ro' && cruise.excluded_ro?.length ? cruise.excluded_ro : cruise.excluded
  const description = locale === 'ro' && cruise.description_ro ? cruise.description_ro : cruise.description
  const advisorNote = locale === 'ro' && cruise.advisor_note_ro ? cruise.advisor_note_ro : cruise.advisor_note

  const nightsLabel = cruise.nights === 1 ? t('cruise_night') : t('cruise_nights')
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(
      locale === 'ro' ? 'ro-RO' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' },
    )
  const departureDate = cruise.departure_date ? formatDate(cruise.departure_date) : ''

  // All available departure dates (sorted, deduplicated, future only)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const allDepartureDates = (cruise.departure_dates || [])
    .filter(d => new Date(d) >= now)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const hasMultipleDates = allDepartureDates.length > 1

  // Per-date pricing from enriched API data
  const datePrices = ((cruise as Cruise & { _date_prices?: { date: string; price_from: number; cabin_count: number }[] })._date_prices || [])
  const datePriceMap = new Map(datePrices.map(dp => [dp.date, dp]))

  // Find cheapest date for "best price" badge
  const cheapestDatePrice = datePrices.length > 0
    ? datePrices.reduce((min, dp) => dp.price_from < min.price_from ? dp : min, datePrices[0])
    : null

  // Compute dynamic price based on selected departure date
  const selectedDate = allDepartureDates[selectedDateIdx] || ''
  const selectedDatePriceData = selectedDate ? datePriceMap.get(selectedDate) : null
  const priceEur = selectedDatePriceData?.price_from || cruise.price_from
  const priceRon = Math.round(priceEur * rateWithMargin)
  const basePriceEur = cruise.price_from
  const priceIsForSelectedDate = !!selectedDatePriceData

  // Price tracking computed values
  const syncedAgo = timeAgo(cruise.last_synced_at, locale as 'en' | 'ro')
  const priceChanged = isPriceRecentlyChanged(cruise.price_changed_at)
  const previousPrice = cruise.previous_price_from
  const priceDecreased = priceChanged && previousPrice && previousPrice > priceEur
  const priceIncreased = priceChanged && previousPrice && previousPrice < priceEur

  // Build tabs — only show Beverages/Terms if data exists for this cruise line
  const cruiseLineTerms = cruise.cruise_line ? CRUISE_LINE_TERMS[cruise.cruise_line] : undefined

  // Extract enriched data from cruise
  const cruiseExt = cruise as Cruise & {
    _is_promo?: boolean; _is_bestdeal?: boolean; _promo_price?: number | null
    _rooms?: { name: string; category: string; date: string; price: number }[]
    _itinerary_enriched?: { id: string | number; name: string; day: number; from_hour: string; till_hour: string }[]
    _included_html?: string; _excluded_html?: string; _cancellation_html?: string
    _excursions?: { id: number; name: string; description: string; pdf: string; image: string }[]
    _plane_included?: boolean
  }
  const isPromo = cruiseExt._is_promo || false
  const isBestDeal = cruiseExt._is_bestdeal || false
  const promoPrice = cruiseExt._promo_price || null
  const rooms = cruiseExt._rooms || []
  const itineraryEnriched = cruiseExt._itinerary_enriched || []
  const includedHtml = cruiseExt._included_html || ''
  const excludedHtml = cruiseExt._excluded_html || ''
  const cancellationHtml = cruiseExt._cancellation_html || ''
  const excursions = cruiseExt._excursions || []
  const planeIncluded = cruiseExt._plane_included || false

  // Ship info (description, specs, video)
  const shipInfo = getShipInfo(cruise.ship_name)

  // Only show Cabins tab when rooms data is available
  const hasCabinData = rooms.length > 0
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t('detail_overview') },
    { key: 'itinerary', label: t('detail_itinerary') },
    ...(hasCabinData ? [{ key: 'cabins' as TabKey, label: t('cabin_select_title' as 'detail_cabins') }] : []),
    { key: 'included', label: t('detail_included') },
    { key: 'beverages', label: t('detail_beverages') },
    { key: 'cancellation', label: t('detail_cancellation') },
    { key: 'terms', label: t('detail_terms') },
  ]

  // Port click handler — opens the PortDrawer
  const handlePortClick = (portName: string) => {
    setSelectedPort(portName)
  }

  return (
    <>
      <Header />
      <main id="main-content">

      {/* Hero — use HeroGallery when gallery images exist, otherwise fallback */}
      {cruise.image_url && cruise.gallery_urls && cruise.gallery_urls.length > 0 ? (
        <HeroGallery
          mainImage={cruise.image_url}
          gallery={cruise.gallery_urls}
          alt={title}
        >
          {/* Title/badges rendered inside hero gradient — guaranteed contrast, no overlap with thumbnails */}
          <Container className="pb-8 pt-16">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {cruise.featured && <Badge variant="gold">{t('cruise_featured')}</Badge>}
              {cruise.cruise_type && (
                <Badge variant="navy">{t(`type_${cruise.cruise_type}` as 'type_ocean')}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-2 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-navy-200 text-sm md:text-base drop-shadow">
              {cruise.cruise_line} {cruise.ship_name ? `- ${cruise.ship_name}` : ''}
            </p>
          </Container>
        </HeroGallery>
      ) : (
        <section className="relative h-[60vh] min-h-[400px] bg-navy-900">
          {cruise.image_url && (
            <Image
              src={cruise.image_url.replace('w=800', 'w=1920')}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={75}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
          {/* Title/badges inside gradient — consistent with HeroGallery path */}
          <div className="absolute bottom-0 left-0 right-0">
            <Container className="pb-8 pt-16">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {cruise.featured && <Badge variant="gold">{t('cruise_featured')}</Badge>}
                {cruise.cruise_type && (
                  <Badge variant="navy">{t(`type_${cruise.cruise_type}` as 'type_ocean')}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-2 drop-shadow-lg">
                {title}
              </h1>
              <p className="text-navy-200 text-sm md:text-base drop-shadow">
                {cruise.cruise_line} {cruise.ship_name ? `- ${cruise.ship_name}` : ''}
              </p>
            </Container>
          </div>
        </section>
      )}

      {/* Breadcrumb */}
      <section className="bg-navy-50 border-b border-navy-100">
        <Container>
          <nav className="py-3 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-navy-500">
              <li>
                <Link href="/" className="hover:text-gold-600 transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li><ChevronIcon /></li>
              <li>
                <Link href="/cruises" className="hover:text-gold-600 transition-colors">
                  {t('nav_cruises')}
                </Link>
              </li>
              <li><ChevronIcon /></li>
              <li className="text-navy-800 font-medium truncate max-w-[200px]">{title}</li>
            </ol>
          </nav>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-12">

            {/* Main Content Area (70%) */}
            <div>
              {/* Tabs */}
              <div className="border-b border-navy-200 mb-8 overflow-x-auto scrollbar-hide">
                <div className="flex gap-0 min-w-max">
                  {tabs.map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.key
                          ? 'border-gold-500 text-gold-600'
                          : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick info row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <InfoCard
                      icon={<MapPinIcon />}
                      label={locale === 'ro' ? 'Destinație' : 'Destination'}
                      value={destination}
                    />
                    <InfoCard
                      icon={<MoonIcon />}
                      label={locale === 'ro' ? 'Durata' : 'Duration'}
                      value={`${cruise.nights} ${nightsLabel}`}
                    />
                    <InfoCard
                      icon={<CalendarIcon />}
                      label={t('cruise_departure')}
                      value={hasMultipleDates ? formatDate(allDepartureDates[selectedDateIdx]) : departureDate}
                      suffix={hasMultipleDates ? `+${allDepartureDates.length - 1}` : undefined}
                    />
                    <InfoCard
                      icon={<AnchorIcon />}
                      label={locale === 'ro' ? 'Port plecare' : 'Departure Port'}
                      value={cruise.departure_port}
                    />
                  </div>

                  {/* Description */}
                  {description && (
                    <div className="prose prose-navy max-w-none">
                      <p className="text-navy-600 leading-relaxed">{description}</p>
                    </div>
                  )}

                  {/* Ship Info — description, specs, and video */}
                  {shipInfo && cruise.ship_name && (
                    <div className="rounded-xl border border-navy-200 overflow-hidden">
                      <div className="p-5">
                        <h3 className="text-base font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                          </span>
                          {t('ship_about' as 'loading')} — {cruise.ship_name}
                        </h3>
                        <p className="text-sm text-navy-600 leading-relaxed mb-4">
                          {locale === 'ro' ? shipInfo.description_ro : shipInfo.description_en}
                        </p>

                        {/* Ship specs */}
                        {(shipInfo.year_built || shipInfo.passengers || shipInfo.tonnage) && (
                          <div className="flex flex-wrap gap-4 text-xs">
                            {shipInfo.year_built && (
                              <div className="flex items-center gap-1.5 bg-navy-50 rounded-lg px-3 py-1.5">
                                <span className="text-navy-400">{t('ship_year' as 'loading')}:</span>
                                <span className="font-semibold text-navy-700">{shipInfo.year_built}</span>
                              </div>
                            )}
                            {shipInfo.passengers && (
                              <div className="flex items-center gap-1.5 bg-navy-50 rounded-lg px-3 py-1.5">
                                <span className="text-navy-400">{t('ship_passengers' as 'loading')}:</span>
                                <span className="font-semibold text-navy-700">{shipInfo.passengers.toLocaleString()}</span>
                              </div>
                            )}
                            {shipInfo.tonnage && shipInfo.tonnage > 0 && (
                              <div className="flex items-center gap-1.5 bg-navy-50 rounded-lg px-3 py-1.5">
                                <span className="text-navy-400">{t('ship_tonnage' as 'loading')}:</span>
                                <span className="font-semibold text-navy-700">{shipInfo.tonnage.toLocaleString()} GT</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* YouTube video embed — uses lazy-load VideoEmbed component */}
                      {shipInfo.youtube_id && (
                        <div className="border-t border-navy-200">
                          <div className="p-4">
                            <p className="text-xs font-medium text-navy-500 uppercase tracking-wider mb-3">
                              {t('ship_video' as 'loading')}
                            </p>
                            <VideoEmbed
                              videoId={shipInfo.youtube_id}
                              title={`${cruise.ship_name} — ${locale === 'ro' ? 'Tur Virtual' : 'Ship Tour'}`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: Itinerary — uses enriched itinerary as primary source */}
              {activeTab === 'itinerary' && (
                <div>
                  {/* 2-column layout: ports timeline left, route map right on desktop */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                    {/* Left: Ports Timeline */}
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-6">
                        {t('itinerary_ports_title' as 'cruise_ports')}
                      </h3>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-navy-200" />

                        <div className="space-y-0">
                          {itineraryEnriched.length > 0 ? (
                            /* ===== Enriched itinerary: precise day numbers, times, sea days ===== */
                            (() => {
                              const totalEntries = itineraryEnriched.length
                              return itineraryEnriched.map((entry, idx) => {
                                const isFirst = idx === 0
                                const isLast = idx === totalEntries - 1
                                const isSeaDay = entry.id === 0 || entry.id === '0' || entry.name === 'Pe mare' || entry.name === 'At Sea'

                                // First entry = embarkation port
                                if (isFirst) {
                                  return (
                                    <PortHighlight
                                      key={`itin-${idx}`}
                                      portName={entry.name || cruise.departure_port}
                                      dayNumber={entry.day}
                                      departureTime={entry.till_hour || null}
                                      onClick={handlePortClick}
                                      isEmbarkDisembark="embark"
                                      embarkLabel={locale === 'ro' ? 'Plecare' : 'Departure'}
                                      dateLabel={hasMultipleDates ? formatDate(allDepartureDates[selectedDateIdx]) : departureDate}
                                    />
                                  )
                                }

                                // Last entry = disembarkation port
                                if (isLast) {
                                  const lastPortName = entry.name || arrivalPort || cruise.departure_port
                                  return (
                                    <PortHighlight
                                      key={`itin-${idx}`}
                                      portName={lastPortName}
                                      dayNumber={entry.day}
                                      arrivalTime={entry.from_hour || null}
                                      onClick={handlePortClick}
                                      isEmbarkDisembark="disembark"
                                      embarkLabel={isOneWay
                                        ? (locale === 'ro' ? 'Sosire' : 'Arrival')
                                        : (locale === 'ro' ? 'Întoarcere' : 'Return')}
                                    />
                                  )
                                }

                                // Sea day — special styling, not clickable
                                if (isSeaDay) {
                                  return (
                                    <div
                                      key={`itin-${idx}`}
                                      className="relative flex items-start gap-5 pb-6"
                                    >
                                      {/* Sea day node — blue wave */}
                                      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
                                        </svg>
                                      </div>
                                      <div className="flex-1 pt-0.5">
                                        <p className="text-xs font-medium uppercase tracking-wider mb-1 text-sky-500">
                                          {locale === 'ro' ? `Ziua ${entry.day}` : `Day ${entry.day}`}
                                        </p>
                                        <p className="font-semibold text-navy-400 italic">
                                          {locale === 'ro' ? '🌊 Zi pe mare' : '🌊 At Sea'}
                                        </p>
                                        <p className="text-xs text-navy-300 mt-0.5">
                                          {locale === 'ro'
                                            ? 'Relaxare la bord — piscină, spa, spectacole'
                                            : 'Relax on board — pool, spa, entertainment'}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                }

                                // Regular port stop — clickable with times
                                return (
                                  <PortHighlight
                                    key={`itin-${idx}`}
                                    portName={entry.name}
                                    dayNumber={entry.day}
                                    arrivalTime={entry.from_hour || null}
                                    departureTime={entry.till_hour || null}
                                    onClick={handlePortClick}
                                  />
                                )
                              })
                            })()
                          ) : (
                            /* ===== Fallback: use ports_of_call (no enriched data) ===== */
                            <>
                              {/* Departure port */}
                              <PortHighlight
                                portName={cruise.departure_port}
                                dayNumber={1}
                                onClick={handlePortClick}
                                isEmbarkDisembark="embark"
                                embarkLabel={locale === 'ro' ? 'Plecare' : 'Departure'}
                                dateLabel={hasMultipleDates ? formatDate(allDepartureDates[selectedDateIdx]) : departureDate}
                              />

                              {/* Middle ports */}
                              {ports.map((port, i) => (
                                <PortHighlight
                                  key={i}
                                  portName={portsOriginal[i] || port}
                                  dayNumber={i + 2}
                                  onClick={handlePortClick}
                                />
                              ))}

                              {/* Arrival / Return port */}
                              <PortHighlight
                                portName={arrivalPort || cruise.departure_port}
                                dayNumber={ports.length + 2}
                                onClick={handlePortClick}
                                isEmbarkDisembark="disembark"
                                embarkLabel={isOneWay
                                  ? (locale === 'ro' ? 'Sosire' : 'Arrival')
                                  : (locale === 'ro' ? 'Întoarcere' : 'Return')}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Route Map — sticky on desktop, shown above on mobile */}
                    <div className="order-first lg:order-last">
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 hidden lg:block">
                        {t('itinerary_route_title' as 'map_title')}
                      </h3>
                      <div className="lg:sticky lg:top-28">
                        <RouteMapStatic
                          routeMapUrl={cruise.route_map_url}
                          departurePort={cruise.departure_port}
                          portsOfCall={cruise.ports_of_call}
                          onPortClick={handlePortClick}
                          isOneWay={isOneWay}
                          className="mb-4 lg:mb-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Port Excursions — from API */}
                  {excursions.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </span>
                        {locale === 'ro' ? 'Excursii opționale disponibile' : 'Optional excursions available'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {excursions.map((exc) => (
                          <div key={exc.id} className="rounded-xl border border-navy-200 overflow-hidden hover:shadow-md transition-shadow">
                            {exc.image && (
                              <div className="relative h-28 overflow-hidden">
                                <Image
                                  src={exc.image}
                                  alt={exc.name}
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm font-semibold text-navy-800 mb-1">{exc.name}</p>
                              {exc.pdf && (
                                <a
                                  href={exc.pdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-medium"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                  </svg>
                                  {locale === 'ro' ? 'Vezi detalii (PDF)' : 'View details (PDF)'}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: Cabins */}
              {activeTab === 'cabins' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)]">
                        {t('cabin_select_title' as 'detail_cabins')}
                      </h3>
                      {cruise.cruise_line && (
                        <p className="text-xs text-navy-400">{cruise.cruise_line}</p>
                      )}
                    </div>
                  </div>

                  <CabinSelector
                    rooms={rooms}
                    selectedDate={selectedDate}
                    cruiseLine={cruise.cruise_line || ''}
                    locale={locale}
                    onSelect={setSelectedCabin}
                  />

                  {/* Show selected cabin info + CTA to proceed */}
                  {selectedCabin && (
                    <div className="mt-4 p-4 rounded-lg bg-gold-50 border border-gold-200">
                      <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-1">
                        {t('cabin_selected' as 'loading')}
                      </p>
                      <p className="text-sm font-semibold text-navy-900 mb-3">
                        {selectedCabin.name || selectedCabin.category} — &euro;{selectedCabin.price.toLocaleString()}{t('cruise_per_person')}
                      </p>
                      <button
                        onClick={() => setShowLeadForm(true)}
                        className="w-full py-2.5 rounded-lg bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 active:scale-[0.98] transition-all"
                      >
                        {locale === 'ro' ? 'Solicită ofertă pentru această cabină' : 'Request offer for this cabin'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: Included/Excluded */}
              {activeTab === 'included' && (
                <div className="space-y-6">
                  {/* Cruise-line header */}
                  {cruise.cruise_line && (
                    <p className="text-xs text-navy-400">
                      {locale === 'ro'
                        ? `Politica standard ${cruise.cruise_line} — poate varia în funcție de itinerar și categorie.`
                        : `Standard ${cruise.cruise_line} policy — may vary by itinerary and cabin category.`}
                    </p>
                  )}

                  {/* Flight included banner */}
                  {planeIncluded && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">
                          {locale === 'ro' ? 'Zbor inclus în preț!' : 'Flight included in price!'}
                        </p>
                        <p className="text-xs text-blue-600">
                          {locale === 'ro'
                            ? 'Această croazieră include transportul aerian.'
                            : 'This cruise includes air transportation.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* API-sourced HTML (cruise-specific from croaziere.net) — when available, show first */}
                  {includedHtml && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 overflow-hidden">
                      <div className="px-4 py-3 bg-emerald-100/50 border-b border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                          <CheckIcon className="w-4 h-4" />
                          {locale === 'ro' ? 'Inclus (specific acestei croaziere)' : 'Included (cruise-specific)'}
                        </h4>
                      </div>
                      <div
                        className="px-4 py-3 text-sm text-navy-700 leading-relaxed [&_br]:block [&_b]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1 [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: includedHtml }}
                      />
                    </div>
                  )}
                  {excludedHtml && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 overflow-hidden">
                      <div className="px-4 py-3 bg-amber-100/50 border-b border-amber-200">
                        <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                          <XIcon className="w-4 h-4" />
                          {locale === 'ro' ? 'Nu este inclus (specific acestei croaziere)' : 'Not Included (cruise-specific)'}
                        </h4>
                      </div>
                      <div
                        className="px-4 py-3 text-sm text-navy-700 leading-relaxed [&_br]:block [&_b]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1 [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: excludedHtml }}
                      />
                    </div>
                  )}

                  {/* Standard included/excluded lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Included */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
                      <h3 className="text-base font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-emerald-600" />
                        </span>
                        {t('detail_included')}
                      </h3>
                      <ul className="space-y-2.5">
                        {included.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-navy-700">
                            <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Excluded */}
                    <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
                      <h3 className="text-base font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                          <XIcon className="w-4 h-4 text-red-600" />
                        </span>
                        {t('detail_excluded')}
                      </h3>
                      <ul className="space-y-2.5">
                        {excluded.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-navy-500">
                            <XIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Source note */}
                  <p className="text-[10px] text-navy-300 text-center italic">
                    {locale === 'ro'
                      ? 'Informațiile sunt orientative. Consultantul vă va confirma detaliile exacte pentru croaziera selectată.'
                      : 'Information is indicative. Your consultant will confirm exact details for the selected cruise.'}
                  </p>
                </div>
              )}

              {/* Tab Content: Beverage Packages */}
              {activeTab === 'beverages' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <GlassIcon className="w-4 h-4 text-purple-600" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)]">
                        {t('beverages_title')}
                      </h3>
                      {cruise.cruise_line && (
                        <p className="text-xs text-navy-400">{cruise.cruise_line}</p>
                      )}
                    </div>
                  </div>

                  {cruise.cruise_line ? (
                    <BeveragePackageTable cruiseLine={cruise.cruise_line} />
                  ) : (
                    <p className="text-sm text-navy-500">
                      {locale === 'ro'
                        ? 'Informații despre pachetele de băuturi nu sunt disponibile. Contactați-ne pentru detalii.'
                        : 'Beverage package information is not available. Contact us for details.'}
                    </p>
                  )}
                </div>
              )}

              {/* Tab Content: Cancellation Policy */}
              {activeTab === 'cancellation' && cruiseLineTerms && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <ShieldIcon className="w-4 h-4 text-amber-600" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)]">
                        {t('detail_cancellation')}
                      </h3>
                      <p className="text-xs text-navy-400">{cruise.cruise_line}</p>
                    </div>
                  </div>

                  {/* Policy Table */}
                  <div className="overflow-hidden rounded-xl border border-navy-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-navy-50">
                          <th className="text-left py-3 px-4 font-semibold text-navy-700 border-b border-navy-200">
                            {t('detail_cancellation_period')}
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-navy-700 border-b border-navy-200">
                            {t('detail_cancellation_penalty')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cruiseLineTerms.cancellation.tiers.map((tier, i) => (
                          <tr
                            key={i}
                            className={`${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/50'} ${
                              i === cruiseLineTerms.cancellation.tiers.length - 1 ? '' : 'border-b border-navy-100'
                            }`}
                          >
                            <td className="py-3 px-4 text-navy-600">
                              {locale === 'ro' ? tier.period_ro : tier.period_en}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-navy-800">
                              {(() => {
                                const penaltyText = locale === 'ro' && tier.penalty_ro ? tier.penalty_ro : tier.penalty_en ? tier.penalty_en : tier.penalty
                                return (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    tier.penalty === '100%'
                                      ? 'bg-red-100 text-red-700'
                                      : tier.penalty.includes('75%') || tier.penalty.includes('80%') || tier.penalty.includes('95%')
                                        ? 'bg-orange-100 text-orange-700'
                                        : tier.penalty.includes('50%') || tier.penalty.includes('40%') || tier.penalty.includes('60%')
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {penaltyText}
                                  </span>
                                )
                              })()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Notes */}
                  {(cruiseLineTerms.cancellation.notes_en || cruiseLineTerms.cancellation.notes_ro) && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <InfoCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        {locale === 'ro' ? cruiseLineTerms.cancellation.notes_ro : cruiseLineTerms.cancellation.notes_en}
                      </p>
                    </div>
                  )}

                  {/* Source disclaimer */}
                  <p className="text-xs text-navy-400 italic">
                    {t('detail_cancellation_source')}
                  </p>
                </div>
              )}

              {/* API-sourced cancellation policy (cruise-specific, detailed HTML table) */}
              {activeTab === 'cancellation' && cancellationHtml && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 overflow-hidden">
                  <div className="px-4 py-3 bg-amber-100/50 border-b border-amber-200">
                    <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                      <ShieldIcon className="w-4 h-4" />
                      {locale === 'ro' ? 'Politica de anulare detaliată (specific acestei croaziere)' : 'Detailed cancellation policy (cruise-specific)'}
                    </h4>
                  </div>
                  <div
                    className="px-4 py-3 text-sm text-navy-700 leading-relaxed overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:px-2 [&_td]:py-1.5 [&_td]:border [&_td]:border-navy-200 [&_th]:px-2 [&_th]:py-1.5 [&_th]:border [&_th]:border-navy-200 [&_th]:bg-navy-50 [&_br]:block [&_b]:font-semibold [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1 [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: cancellationHtml }}
                  />
                </div>
              )}

              {activeTab === 'cancellation' && !cruiseLineTerms && !cancellationHtml && (
                <p className="text-sm text-navy-500">
                  {locale === 'ro'
                    ? 'Politica de anulare nu este disponibilă pentru această croazieră. Contactați-ne pentru detalii.'
                    : 'Cancellation policy is not available for this cruise. Contact us for details.'}
                </p>
              )}

              {/* Tab Content: Terms & Conditions */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <DocumentIcon className="w-4 h-4 text-blue-600" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)]">
                        {t('terms_general')}
                      </h3>
                      {cruise.cruise_line && (
                        <p className="text-xs text-navy-400">{cruise.cruise_line}</p>
                      )}
                    </div>
                  </div>

                  {cruise.cruise_line ? (
                    <CruiseLineTerms cruiseLine={cruise.cruise_line} />
                  ) : (
                    <p className="text-sm text-navy-500">
                      {locale === 'ro'
                        ? 'Termenii și condițiile nu sunt disponibile. Contactați-ne pentru detalii.'
                        : 'Terms and conditions are not available. Contact us for details.'}
                    </p>
                  )}

                  {/* GDPR / Data Protection Section */}
                  <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50/50 overflow-hidden">
                    <div className="px-4 py-3 bg-blue-100/50 border-b border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        {t('gdpr_section_title' as 'loading')}
                      </h4>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-navy-600 leading-relaxed mb-3">
                        {t('gdpr_commitment' as 'loading')}
                      </p>
                      <p className="text-xs font-semibold text-navy-700 mb-2">
                        {t('gdpr_rights_title' as 'loading')}:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {(['gdpr_right_access', 'gdpr_right_rectification', 'gdpr_right_erasure', 'gdpr_right_restrict', 'gdpr_right_portability', 'gdpr_right_object'] as const).map((key) => (
                          <div key={key} className="flex items-center gap-1.5 text-xs text-navy-600">
                            <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            {t(key as 'loading')}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-navy-500 mb-2">
                        {t('gdpr_contact' as 'loading')}
                      </p>
                      <Link
                        href="/gdpr"
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {t('gdpr_full_policy' as 'loading')}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Advisor Note */}
              {advisorNote && (
                <div className="mt-10 p-6 rounded-xl bg-gold-50 border border-gold-200">
                  <h3 className="text-base font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-2 flex items-center gap-2">
                    <span className="text-gold-500">
                      <LightbulbIcon />
                    </span>
                    {t('detail_advisor')}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed">{advisorNote}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gold-200">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400 flex-shrink-0">
                      <img src="/images/daniela-ceausu.jpg" alt="Ceausu Daniela Antonina" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-800">Ceausu Daniela Antonina</p>
                      <p className="text-xs text-gold-600">{locale === 'ro' ? 'Consultant Croaziere' : 'Cruise Consultant'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (30%) */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className={`rounded-xl border ${isPromo || isBestDeal ? 'border-red-300 ring-1 ring-red-200' : 'border-navy-200'} bg-white shadow-lg p-6 sticky top-24`}>
                {/* Promo badge */}
                {isPromo && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-full mb-3">
                    🔥 {t('promo_badge' as 'cruise_featured')}
                  </span>
                )}
                {isBestDeal && !isPromo && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-amber-500 px-3 py-1 rounded-full mb-3">
                    ⭐ {t('bestdeal_badge' as 'cruise_featured')}
                  </span>
                )}
                {/* Urgency badge */}
                {syncedAgo?.isToday && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    {t('price_updated_today')}
                  </span>
                )}
                {priceDecreased && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    {t('price_decreased')}
                  </span>
                )}
                {priceIncreased && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    {t('price_increased')}
                  </span>
                )}

                <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
                  {priceIsForSelectedDate
                    ? (locale === 'ro' ? 'Preț pentru data selectată' : 'Price for selected date')
                    : t('cruise_from')}
                </p>
                {/* Promo: strikethrough original + promo price */}
                {promoPrice && promoPrice < priceEur ? (
                  <>
                    <p className="text-sm text-navy-400 line-through mb-0.5">
                      &euro;{priceEur.toLocaleString()}
                    </p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-red-600 tabular-nums transition-all duration-300">
                        &euro;{promoPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-navy-500">{t('cruise_per_person')}</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium mb-1">
                      {t('promo_save' as 'cruise_from')} &euro;{(priceEur - promoPrice).toLocaleString()} (-{Math.round(((priceEur - promoPrice) / priceEur) * 100)}%)
                    </p>
                  </>
                ) : (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-navy-900 tabular-nums transition-all duration-300">
                      &euro;{priceEur.toLocaleString()}
                    </span>
                    <span className="text-sm text-navy-500">{t('cruise_per_person')}</span>
                  </div>
                )}

                {/* Show base price reference when viewing a date-specific price */}
                {priceIsForSelectedDate && priceEur !== basePriceEur && (
                  <p className="text-xs text-navy-400 mb-0.5">
                    {locale === 'ro' ? 'Preț general de la' : 'General price from'}{' '}
                    <span className={priceEur < basePriceEur ? 'line-through' : ''}>&euro;{basePriceEur.toLocaleString()}</span>
                    {priceEur < basePriceEur && (
                      <span className="text-emerald-600 font-medium ml-1">
                        -{Math.round(((basePriceEur - priceEur) / basePriceEur) * 100)}%
                      </span>
                    )}
                  </p>
                )}

                {/* Previous price strikethrough (from sync) */}
                {!priceIsForSelectedDate && previousPrice && previousPrice !== priceEur && priceChanged && (
                  <p className="text-xs text-navy-400 mb-0.5">
                    {t('price_was')} <span className="line-through">&euro;{previousPrice.toLocaleString()}</span>
                  </p>
                )}

                {locale === 'ro' && (
                  <p className="text-sm text-gold-600 font-medium mb-1">
                    ~{priceRon.toLocaleString()} {t('cruise_lei')}
                  </p>
                )}

                {/* Price freshness label */}
                {syncedAgo && (
                  <p className="text-[10px] text-navy-400 mb-3">
                    {t('price_updated')} {syncedAgo.label}
                  </p>
                )}
                {!syncedAgo && locale === 'ro' && <div className="mb-3" />}
                {!syncedAgo && locale !== 'ro' && <div className="mb-3" />}

                {/* A/B tested CTA buttons — variant: {ctaVariant} */}
                <Button
                  onClick={() => {
                    setShowLeadForm(true)
                    trackCtaClick(locale, cruise.slug, CTA_VARIANTS[ctaVariant].primaryKey, ctaVariant)
                  }}
                  variant={CTA_VARIANTS[ctaVariant].primaryStyle}
                  size="lg"
                  className="w-full mb-3"
                >
                  {t(CTA_VARIANTS[ctaVariant].primaryKey as Parameters<typeof t>[0])}
                </Button>
                <Button
                  onClick={() => {
                    setShowLeadForm(true)
                    trackCtaClick(locale, cruise.slug, CTA_VARIANTS[ctaVariant].secondaryKey, ctaVariant)
                  }}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  {t(CTA_VARIANTS[ctaVariant].secondaryKey as Parameters<typeof t>[0])}
                </Button>

                {/* Departure info */}
                <div className="mt-6 pt-6 border-t border-navy-100 space-y-3">
                  {hasMultipleDates ? (
                    <DepartureDatePicker
                      dates={allDepartureDates}
                      datePriceMap={datePriceMap}
                      cheapestDate={cheapestDatePrice?.date || null}
                      selectedIdx={selectedDateIdx}
                      onSelect={setSelectedDateIdx}
                      formatDate={formatDate}
                      locale={locale}
                    />
                  ) : (
                    <SidebarRow label={t('cruise_departure')} value={departureDate} />
                  )}
                  <SidebarRow
                    label={locale === 'ro' ? 'Port plecare' : 'Departure Port'}
                    value={cruise.departure_port}
                  />
                  <SidebarRow
                    label={locale === 'ro' ? 'Durata' : 'Duration'}
                    value={`${cruise.nights} ${nightsLabel}`}
                  />
                  {cruise.cruise_line && (
                    <SidebarRow
                      label={locale === 'ro' ? 'Companie' : 'Cruise Line'}
                      value={cruise.cruise_line}
                    />
                  )}
                  {cruise.ship_name && (
                    <SidebarRow
                      label={locale === 'ro' ? 'Nava' : 'Ship'}
                      value={cruise.ship_name}
                    />
                  )}
                </div>
              </div>

              {/* Need help card */}
              <div className="rounded-xl bg-navy-900 text-white p-6">
                <h3 className="font-bold font-[family-name:var(--font-heading)] text-gold-400 mb-2">
                  {locale === 'ro' ? 'Ai nevoie de ajutor?' : 'Need Help?'}
                </h3>
                <p className="text-sm text-navy-300 mb-4">
                  {locale === 'ro'
                    ? 'Consultantul nostru de croaziere este disponibil să te ajute cu rezervarea.'
                    : 'Our cruise consultant is available to help you with your booking.'}
                </p>
                <div className="space-y-2 text-sm">
                  <a href="tel:+40749558572" className="flex items-center gap-2 text-navy-200 hover:text-gold-400 transition-colors">
                    <PhoneIcon className="w-4 h-4" />
                    +40 749 558 572
                  </a>
                  <a href="mailto:xplorecruisetravel@gmail.com" className="flex items-center gap-2 text-navy-200 hover:text-gold-400 transition-colors">
                    <EmailIcon className="w-4 h-4" />
                    xplorecruisetravel@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Similar Cruises */}
      {similarCruises.length > 0 && (
        <section className="py-16 bg-navy-50">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-10">
              {t('detail_similar')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarCruises.map((c, i) => (
                <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <CruiseCard cruise={c} locale={locale} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Port Drawer — slides out when a port is clicked */}
      <PortDrawer
        portName={selectedPort}
        onClose={() => setSelectedPort(null)}
        apiExcursions={excursions}
      />

      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        cruiseTitle={title}
        cruiseSlug={cruise.slug}
        cruisePrice={promoPrice && promoPrice < priceEur ? promoPrice : priceEur}
        selectedCabin={selectedCabin ? {
          name: selectedCabin.name,
          category: selectedCabin.category,
          normalizedCategory: selectedCabin.normalizedCategory,
          price: selectedCabin.price,
          date: selectedCabin.date,
        } : null}
        source="detail"
      />
      <ChatWidget />
      </main>
      <Footer />
    </>
  )
}

// ============================================================
// Sub-components
// ============================================================

function InfoCard({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-lg bg-navy-50 p-4 border border-navy-100">
      <div className="flex items-center gap-2 text-gold-500 mb-2">
        {icon}
        <span className="text-xs text-navy-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-semibold text-navy-900">{value}</p>
        {suffix && (
          <span className="text-[10px] font-semibold bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded-full">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-navy-400 flex-shrink-0">{label}</span>
      <span className="text-navy-800 font-medium text-right break-words min-w-0">{value}</span>
    </div>
  )
}

// ============================================================
// Departure Date Picker — beautiful per-date pricing display
// ============================================================

interface DatePriceInfo { date: string; price_from: number; cabin_count: number }

function DepartureDatePicker({
  dates,
  datePriceMap,
  cheapestDate,
  selectedIdx,
  onSelect,
  formatDate,
  locale,
}: {
  dates: string[]
  datePriceMap: Map<string, DatePriceInfo>
  cheapestDate: string | null
  selectedIdx: number
  onSelect: (idx: number) => void
  formatDate: (d: string) => string
  locale: string
}) {
  const [expanded, setExpanded] = useState(false)
  const COLLAPSED_COUNT = 4
  const showExpand = dates.length > COLLAPSED_COUNT
  const visibleDates = expanded ? dates : dates.slice(0, COLLAPSED_COUNT)

  // Group dates by month for compact display
  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr)
    return {
      day: d.getDate(),
      month: d.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', { month: 'short' }),
      year: d.getFullYear(),
      weekday: d.toLocaleDateString(locale === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'short' }),
      full: formatDate(dateStr),
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-navy-700 uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
          </svg>
          {locale === 'ro' ? 'Date de plecare' : 'Departure Dates'}
        </p>
        <span className="text-[10px] text-navy-400 bg-navy-50 px-2 py-0.5 rounded-full">
          {dates.length} {locale === 'ro' ? 'opțiuni' : 'options'}
        </span>
      </div>

      <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-0.5 scrollbar-thin">
        {visibleDates.map((d, i) => {
          // Compute actual index in full dates array
          const actualIdx = expanded ? i : i
          const dateInfo = formatDateShort(d)
          const priceData = datePriceMap.get(d)
          const isCheapest = cheapestDate === d && dates.length > 1
          const isSelected = actualIdx === selectedIdx

          return (
            <button
              key={d}
              onClick={() => onSelect(actualIdx)}
              className={`w-full text-left rounded-lg border transition-all duration-200 group ${
                isSelected
                  ? 'bg-navy-800 border-navy-700 text-white shadow-md ring-1 ring-navy-600'
                  : 'bg-white border-navy-100 hover:border-navy-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                {/* Date info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Date badge */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex flex-col items-center justify-center text-center leading-none ${
                    isSelected
                      ? 'bg-gold-500 text-navy-900'
                      : 'bg-navy-50 text-navy-700 group-hover:bg-navy-100'
                  }`}>
                    <span className="text-sm font-bold">{dateInfo.day}</span>
                    <span className="text-[9px] uppercase font-medium">{dateInfo.month}</span>
                  </div>
                  {/* Date details */}
                  <div className="min-w-0">
                    <p className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-navy-800'}`}>
                      {dateInfo.full}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isCheapest && (
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {locale === 'ro' ? '✦ Cel mai bun preț' : '✦ Best price'}
                        </span>
                      )}
                      {priceData && priceData.cabin_count > 0 && (
                        <span className={`text-[9px] ${isSelected ? 'text-navy-300' : 'text-navy-400'}`}>
                          {priceData.cabin_count} {locale === 'ro' ? 'cabine' : 'cabins'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Price */}
                {priceData ? (
                  <div className="flex-shrink-0 text-right ml-2">
                    <p className={`text-sm font-bold tabular-nums ${
                      isSelected
                        ? 'text-gold-400'
                        : isCheapest ? 'text-emerald-600' : 'text-navy-800'
                    }`}>
                      &euro;{priceData.price_from.toLocaleString()}
                    </p>
                    <p className={`text-[9px] ${isSelected ? 'text-navy-400' : 'text-navy-400'}`}>
                      {locale === 'ro' ? '/pers.' : '/pp'}
                    </p>
                  </div>
                ) : (
                  <div className="flex-shrink-0">
                    <svg className={`w-4 h-4 ${isSelected ? 'text-gold-400' : 'text-navy-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Expand/collapse button */}
      {showExpand && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 text-center text-xs text-gold-600 hover:text-gold-700 font-medium py-1.5 rounded-md hover:bg-gold-50 transition-colors"
        >
          {expanded
            ? (locale === 'ro' ? `↑ Arată mai puțin` : `↑ Show less`)
            : (locale === 'ro' ? `+ Arată toate ${dates.length} datele` : `+ Show all ${dates.length} dates`)
          }
        </button>
      )}
    </div>
  )
}

// ============================================================
// Inline SVG Icons
// ============================================================

function ChevronIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  )
}

function AnchorIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3Zm0 6v13m0 0c-4.97 0-9-2.69-9-6h3m6 6c4.97 0 9-2.69 9-6h-3" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function InfoCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  )
}

function GlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}
