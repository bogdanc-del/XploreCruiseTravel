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

const RouteMap = dynamic(() => import('@/components/cruise/RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] bg-navy-50 rounded-2xl animate-pulse" />,
})
import { eurToRon } from '@/lib/supabase'
import type { Cruise } from '@/lib/supabase'

// Phase 2 imports
import HeroGallery from '@/components/cruise/HeroGallery'
import PortHighlight from '@/components/cruise/PortHighlight'
import PortDrawer from '@/components/cruise/PortDrawer'
import BeveragePackageTable from '@/components/cruise/BeveragePackageTable'
import CruiseLineTerms from '@/components/cruise/CruiseLineTerms'
import { CRUISE_LINE_TERMS } from '@/data/cruise-line-terms'
import { getCruiseBySlugLocal, getSimilarCruises, FEATURED_CRUISES } from '@/data/cruises-database'
import { getBestImageUrl } from '@/data/ship-images'

// ============================================================
// Tab types
// ============================================================

type TabKey = 'overview' | 'itinerary' | 'included' | 'beverages' | 'cancellation' | 'terms'

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
  const INC_OCEAN = ['Full-board meals in main restaurant & buffet', 'Entertainment & shows', 'Pool & fitness center access', 'Kids club (where available)', 'Port taxes & fees']
  const INC_OCEAN_RO = ['Pensiune completă în restaurantul principal și bufet', 'Spectacole și divertisment la bord', 'Acces piscină și centru fitness', 'Club copii (unde este disponibil)', 'Taxe portuare incluse']
  const INC_RIVER = ['All meals on board', 'Wine & beer with lunch and dinner', 'Guided shore excursions', 'Wi-Fi on board', 'Port charges']
  const INC_RIVER_RO = ['Toate mesele la bord', 'Vin și bere la prânz și cină', 'Excursii ghidate la țărm', 'Wi-Fi la bord', 'Taxe portuare']
  const INC_LUXURY = ['All-inclusive beverages', 'Specialty dining at no extra charge', 'Shore excursions in every port', 'Wi-Fi & gratuities included', 'Butler service (suite guests)']
  const INC_LUXURY_RO = ['Băuturi all-inclusive', 'Restaurante de specialitate fără cost suplimentar', 'Excursii în fiecare port', 'Wi-Fi și bacșișuri incluse', 'Serviciu de butler (suite)']
  const EXC_OCEAN = ['Flights to/from embarkation port', 'Shore excursions', 'Specialty dining', 'Beverage packages', 'Spa treatments', 'Travel insurance']
  const EXC_OCEAN_RO = ['Zbor către/de la portul de îmbarcare', 'Excursii la țărm', 'Restaurante de specialitate', 'Pachete de băuturi', 'Tratamente spa', 'Asigurare de călătorie']
  const EXC_RIVER = ['Flights', 'Premium beverages', 'Gratuities', 'Travel insurance']
  const EXC_RIVER_RO = ['Zboruri', 'Băuturi premium', 'Bacșișuri', 'Asigurare de călătorie']
  const EXC_LUXURY = ['Flights', 'Premium spa treatments', 'Travel insurance']
  const EXC_LUXURY_RO = ['Zboruri', 'Tratamente spa premium', 'Asigurare de călătorie']

  const ct = data.cruise_type as string
  const ports = (data.ports_of_call || []) as string[]
  const gallery = (data.gallery_urls || []) as string[]
  const itinerary = (data.itinerary || []) as { day: number; port: string; arrival: string | null; departure: string | null }[]

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
    included: ct === 'river' ? INC_RIVER : ct === 'luxury' ? INC_LUXURY : INC_OCEAN,
    included_ro: ct === 'river' ? INC_RIVER_RO : ct === 'luxury' ? INC_LUXURY_RO : INC_OCEAN_RO,
    excluded: ct === 'river' ? EXC_RIVER : ct === 'luxury' ? EXC_LUXURY : EXC_OCEAN,
    excluded_ro: ct === 'river' ? EXC_RIVER_RO : ct === 'luxury' ? EXC_LUXURY_RO : EXC_OCEAN_RO,
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
    // Store itinerary data for display
    _itinerary: itinerary,
    _cabin_types: (data.cabin_types || []) as { name: string; price_from: number }[],
  } as Cruise & { _itinerary: typeof itinerary; _cabin_types: { name: string; price_from: number }[] }
}

function CruiseDetailContent() {
  const t = useT()
  const { locale } = useLocale()
  const params = useParams()
  const slug = params.slug as string

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [selectedPort, setSelectedPort] = useState<string | null>(null)

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

  // Try FEATURED_CRUISES first (has rich content)
  const featuredCruise = getCruiseBySlugLocal(slug)

  // If not in featured, fetch from API
  useEffect(() => {
    if (featuredCruise || !slug) return
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
  }, [slug, featuredCruise])

  const cruise = featuredCruise || apiCruise

  // Similar cruises — use featured cruises for suggestions
  const similarCruises = cruise ? getSimilarCruises(cruise, 3) : []

  // Loading state
  if (!featuredCruise && apiLoading) {
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
  const ports = locale === 'ro' && cruise.ports_of_call_ro?.length ? cruise.ports_of_call_ro : cruise.ports_of_call
  const portsOriginal = cruise.ports_of_call // Always use original (EN) port names for port data lookup
  const included = locale === 'ro' && cruise.included_ro?.length ? cruise.included_ro : cruise.included
  const excluded = locale === 'ro' && cruise.excluded_ro?.length ? cruise.excluded_ro : cruise.excluded
  const description = locale === 'ro' && cruise.description_ro ? cruise.description_ro : cruise.description
  const advisorNote = locale === 'ro' && cruise.advisor_note_ro ? cruise.advisor_note_ro : cruise.advisor_note

  const nightsLabel = cruise.nights === 1 ? t('cruise_night') : t('cruise_nights')
  const departureDate = cruise.departure_date
    ? new Date(cruise.departure_date).toLocaleDateString(
        locale === 'ro' ? 'ro-RO' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' },
      )
    : ''
  const priceEur = cruise.price_from
  const priceRon = eurToRon(priceEur)

  // Build tabs — only show Beverages/Terms if data exists for this cruise line
  const cruiseLineTerms = cruise.cruise_line ? CRUISE_LINE_TERMS[cruise.cruise_line] : undefined

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t('detail_overview') },
    { key: 'itinerary', label: t('detail_itinerary') },
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
        />
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
        </section>
      )}

      {/* Hero Content Overlay */}
      <section className="relative -mt-24 z-10">
        <Container className="pb-2">
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
      </section>

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
                      value={departureDate}
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
                </div>
              )}

              {/* Tab Content: Itinerary — enhanced with PortHighlight */}
              {activeTab === 'itinerary' && (
                <div>
                  {/* Route Map with clickable ports */}
                  <RouteMap
                    departurePort={cruise.departure_port}
                    portsOfCall={cruise.ports_of_call}
                    onPortClick={handlePortClick}
                    className="mb-8"
                  />

                  <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-6">
                    {t('cruise_ports')}
                  </h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-navy-200" />

                    <div className="space-y-0">
                      {/* Departure */}
                      <div className="relative flex items-start gap-5 pb-6">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
                          <AnchorIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-0.5">
                            {locale === 'ro' ? 'Plecare' : 'Departure'}
                          </p>
                          <p className="font-semibold text-navy-900">{cruise.departure_port}</p>
                          {departureDate && (
                            <p className="text-xs text-navy-500 mt-0.5">{departureDate}</p>
                          )}
                        </div>
                      </div>

                      {/* Ports — interactive PortHighlight components */}
                      {ports.map((port, i) => (
                        <PortHighlight
                          key={i}
                          portName={portsOriginal[i] || port}
                          dayNumber={i + 2}
                          onClick={handlePortClick}
                        />
                      ))}

                      {/* Return */}
                      <div className="relative flex items-start gap-5">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
                          <AnchorIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-0.5">
                            {locale === 'ro' ? 'Întoarcere' : 'Return'}
                          </p>
                          <p className="font-semibold text-navy-900">{cruise.departure_port}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Included/Excluded */}
              {activeTab === 'included' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Included */}
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                      {t('detail_included')}
                    </h3>
                    <ul className="space-y-2.5">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-navy-700">
                          <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                        <XIcon className="w-3.5 h-3.5 text-red-600" />
                      </span>
                      {t('detail_excluded')}
                    </h3>
                    <ul className="space-y-2.5">
                      {excluded.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-navy-500">
                          <XIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
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

              {activeTab === 'cancellation' && !cruiseLineTerms && (
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
                      <img src="/images/daniela-ceausu.jpg" alt="Ceausu Daniel Antonina" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy-800">Ceausu Daniel Antonina</p>
                      <p className="text-xs text-gold-600">{locale === 'ro' ? 'Consultant Croaziere' : 'Cruise Consultant'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (30%) */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="rounded-xl border border-navy-200 bg-white shadow-lg p-6 sticky top-24">
                <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">{t('cruise_from')}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-navy-900">
                    &euro;{priceEur.toLocaleString()}
                  </span>
                  <span className="text-sm text-navy-500">{t('cruise_per_person')}</span>
                </div>
                {locale === 'ro' && (
                  <p className="text-sm text-gold-600 font-medium mb-4">
                    ~{priceRon.toLocaleString()} {t('cruise_lei')}
                  </p>
                )}
                {locale !== 'ro' && <div className="mb-4" />}

                <Button onClick={() => setShowLeadForm(true)} variant="primary" size="lg" className="w-full mb-3">
                  {t('cta_request_offer')}
                </Button>
                <Button onClick={() => setShowLeadForm(true)} variant="secondary" size="md" className="w-full">
                  {t('cta_check_availability')}
                </Button>

                {/* Departure info */}
                <div className="mt-6 pt-6 border-t border-navy-100 space-y-3">
                  <SidebarRow label={t('cruise_departure')} value={departureDate} />
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
      />

      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        cruiseTitle={title}
        cruiseSlug={cruise.slug}
        cruisePrice={cruise.price_from}
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

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-navy-50 p-4 border border-navy-100">
      <div className="flex items-center gap-2 text-gold-500 mb-2">
        {icon}
        <span className="text-xs text-navy-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-navy-900">{value}</p>
    </div>
  )
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-navy-400">{label}</span>
      <span className="text-navy-800 font-medium text-right max-w-[180px]">{value}</span>
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
