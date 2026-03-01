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
import BookingModal from '@/components/booking/BookingModal'
import ChatWidget from '@/components/chat/ChatWidget'
import dynamic from 'next/dynamic'

const RouteMap = dynamic(() => import('@/components/cruise/RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] bg-navy-50 rounded-2xl animate-pulse" />,
})
import { eurToRon } from '@/lib/supabase'
import type { Cruise } from '@/lib/supabase'

// ============================================================
// Demo cruise data (same as homepage/cruises page)
// ============================================================

const demoCruises: Cruise[] = [
  {
    id: '1', slug: 'western-mediterranean-discovery', title: 'Western Mediterranean Discovery', title_ro: 'Descoperirea Mediteranei de Vest',
    cruise_type: 'ocean', nights: 7, price_from: 599, currency: 'EUR', departure_port: 'Barcelona, Spain',
    departure_date: '2026-06-15', ports_of_call: ['Marseille', 'Genoa', 'Rome', 'Palermo', 'Valletta'], ports_of_call_ro: ['Marsilia', 'Genova', 'Roma', 'Palermo', 'Valletta'],
    image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800', gallery_urls: [],
    included: ['Full-board meals', 'Entertainment', 'Pool & spa'], included_ro: ['Masa completa', 'Divertisment', 'Piscina & spa'],
    excluded: ['Shore excursions', 'Premium drinks'], excluded_ro: ['Excursii terestre', 'Bauturi premium'],
    tags: ['popular', 'family'], featured: true, active: true, source: 'manual',
    cruise_line: 'MSC Cruises', ship_name: 'MSC Meraviglia', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
    description: 'Embark on a breathtaking 7-night journey through the heart of the Western Mediterranean. Departing from vibrant Barcelona, this cruise takes you to iconic ports including Marseille, Genoa, Rome, Palermo, and Valletta. Experience world-class cuisine, stunning coastal views, and rich cultural heritage at every stop.',
    description_ro: 'Porniti intr-o calatorie impresionanta de 7 nopti prin inima Mediteranei de Vest. Plecand din vibranta Barcelona, aceasta croaziera va duce in porturi iconice precum Marsilia, Genova, Roma, Palermo si Valletta. Experimentati bucatarie de clasa mondiala, privelisti costiere uimitoare si patrimoniu cultural bogat la fiecare oprire.',
    advisor_note: 'This is one of our most popular itineraries with excellent value for money. Book early for the best cabin selection. The stop in Rome allows enough time for a guided tour to the Colosseum.',
    advisor_note_ro: 'Acesta este unul dintre cele mai populare itinerarii cu un raport calitate-pret excelent. Rezervati din timp pentru cea mai buna selectie de cabine. Oprirea in Roma permite timp suficient pentru un tur ghidat la Colosseum.',
  },
  {
    id: '2', slug: 'greek-islands-turkey-voyage', title: 'Greek Islands & Turkey Voyage', title_ro: 'Insulele Grecesti si Turcia',
    cruise_type: 'ocean', nights: 7, price_from: 649, currency: 'EUR', departure_port: 'Athens (Piraeus), Greece',
    departure_date: '2026-06-10', ports_of_call: ['Mykonos', 'Kusadasi', 'Patmos', 'Rhodes', 'Santorini'], ports_of_call_ro: ['Mykonos', 'Kusadasi', 'Patmos', 'Rodos', 'Santorini'],
    image_url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Kids club'], included_ro: ['Toate mesele', 'Divertisment', 'Club copii'],
    excluded: ['Drinks package', 'Excursions'], excluded_ro: ['Pachet bauturi', 'Excursii'],
    tags: ['popular', 'romantic'], featured: true, active: true, source: 'manual',
    cruise_line: 'Costa Cruises', ship_name: 'Costa Toscana', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
    description: 'Sail through the crystal-clear waters of the Aegean Sea on this enchanting 7-night Greek Islands and Turkey voyage. From the cosmopolitan charm of Mykonos to the ancient ruins of Kusadasi, every port offers a unique experience.',
    description_ro: 'Navigati prin apele cristaline ale Marii Egee in aceasta calatorie fermecatoare de 7 nopti prin Insulele Grecesti si Turcia. De la farmecul cosmopolit al Mykonos pana la ruinele antice ale Kusadasi, fiecare port ofera o experienta unica.',
  },
  {
    id: '3', slug: 'norwegian-fjords-explorer', title: 'Norwegian Fjords Explorer', title_ro: 'Explorator Fiorduri Norvegiene',
    cruise_type: 'ocean', nights: 10, price_from: 1199, currency: 'EUR', departure_port: 'Southampton, UK',
    departure_date: '2026-07-05', ports_of_call: ['Bergen', 'Geiranger', 'Alesund', 'Stavanger', 'Flam'], ports_of_call_ro: ['Bergen', 'Geiranger', 'Alesund', 'Stavanger', 'Flam'],
    image_url: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Fitness center'], included_ro: ['Toate mesele', 'Divertisment', 'Sala fitness'],
    excluded: ['Shore excursions', 'Specialty dining'], excluded_ro: ['Excursii terestre', 'Restaurante speciale'],
    tags: ['adventure', 'nature'], featured: true, active: true, source: 'manual',
    cruise_line: 'Norwegian Cruise Line', ship_name: 'Norwegian Getaway', destination: 'Northern Europe', destination_ro: 'Europa de Nord', destination_slug: 'northern-europe',
    description: 'Discover the majestic beauty of Norway on this 10-night fjords exploration. Sail past dramatic waterfalls, towering cliffs, and picturesque villages. Highlights include the UNESCO-listed Geiranger Fjord and the charming city of Bergen.',
    description_ro: 'Descoperiti frumusetea maiestuoasa a Norvegiei in aceasta explorare de 10 nopti prin fiorduri. Navigati pe langa cascade dramatice, stanci impunatoare si sate pitoresti. Punctele principale includ Fiordul Geiranger, sit UNESCO, si orasul fermecator Bergen.',
  },
  {
    id: '4', slug: 'romantic-danube-river-cruise', title: 'Romantic Danube River Cruise', title_ro: 'Croaziera Romantica pe Dunare',
    cruise_type: 'river', nights: 8, price_from: 2299, currency: 'EUR', departure_port: 'Budapest, Hungary',
    departure_date: '2026-06-20', ports_of_call: ['Bratislava', 'Vienna', 'Durnstein', 'Melk', 'Passau'], ports_of_call_ro: ['Bratislava', 'Viena', 'Durnstein', 'Melk', 'Passau'],
    image_url: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800', gallery_urls: [],
    included: ['All meals', 'Shore excursions', 'Wine tasting'], included_ro: ['Toate mesele', 'Excursii terestre', 'Degustare vin'],
    excluded: ['Premium wines', 'Spa treatments'], excluded_ro: ['Vinuri premium', 'Tratamente spa'],
    tags: ['romantic', 'cultural'], featured: true, active: true, source: 'manual',
    cruise_line: 'Viking River Cruises', ship_name: 'Viking Longship Hild', destination: 'River Cruises', destination_ro: 'Croaziere Fluviale', destination_slug: 'river-cruises',
    description: 'Glide along the legendary Danube on this romantic 8-night river cruise from Budapest to Passau. Enjoy included shore excursions, wine tastings in the Wachau Valley, and visits to imperial cities like Vienna and Bratislava.',
    description_ro: 'Alunecati de-a lungul legendarei Dunari in aceasta croaziera romantica de 8 nopti de la Budapesta la Passau. Bucurati-va de excursii terestre incluse, degustari de vin in Valea Wachau si vizite in orase imperiale precum Viena si Bratislava.',
  },
  {
    id: '5', slug: 'caribbean-perfect-day', title: 'Caribbean & Perfect Day', title_ro: 'Caraibe si Perfect Day',
    cruise_type: 'ocean', nights: 7, price_from: 749, currency: 'EUR', departure_port: 'Miami, FL, USA',
    departure_date: '2026-11-10', ports_of_call: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'], ports_of_call_ro: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'],
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Pool deck'], included_ro: ['Toate mesele', 'Divertisment', 'Punte piscina'],
    excluded: ['Drink packages', 'WiFi'], excluded_ro: ['Pachet bauturi', 'WiFi'],
    tags: ['family', 'tropical'], featured: true, active: true, source: 'manual',
    cruise_line: 'Royal Caribbean', ship_name: 'Harmony of the Seas', destination: 'Caribbean', destination_ro: 'Caraibe', destination_slug: 'caribbean',
    description: 'Escape to paradise on this 7-night Caribbean adventure departing from Miami. Visit Royal Caribbean\'s private island CocoCay, explore Mayan ruins in Cozumel, and dive into the crystal-clear waters of Roatan.',
    description_ro: 'Evadati in paradis in aceasta aventura de 7 nopti in Caraibe cu plecare din Miami. Vizitati insula privata CocoCay a Royal Caribbean, explorati ruinele Maya din Cozumel si scufundati-va in apele cristaline din Roatan.',
  },
  {
    id: '6', slug: 'adriatic-luxury-collection', title: 'Adriatic Luxury Collection', title_ro: 'Colectia de Lux Adriatica',
    cruise_type: 'luxury', nights: 10, price_from: 4999, currency: 'EUR', departure_port: 'Venice, Italy',
    departure_date: '2026-09-12', ports_of_call: ['Dubrovnik', 'Kotor', 'Corfu', 'Katakolon', 'Mykonos'], ports_of_call_ro: ['Dubrovnik', 'Kotor', 'Corfu', 'Katakolon', 'Mykonos'],
    image_url: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800', gallery_urls: [],
    included: ['Butler service', 'All drinks', 'Shore excursions', 'WiFi'], included_ro: ['Serviciu butler', 'Toate bauturile', 'Excursii terestre', 'WiFi'],
    excluded: ['Premium spa packages'], excluded_ro: ['Pachete spa premium'],
    tags: ['luxury', 'adults-only'], featured: true, active: true, source: 'manual',
    cruise_line: 'Silversea', ship_name: 'Silver Moon', destination: 'Mediterranean', destination_ro: 'Mediterana', destination_slug: 'mediterranean',
    description: 'Indulge in the ultimate luxury cruise experience through the Adriatic. From the romance of Venice to the dramatic cliffs of Kotor, this 10-night voyage features butler service, all-inclusive dining, and exclusive shore excursions.',
    description_ro: 'Bucurati-va de experienta suprema de croaziera de lux prin Adriatica. De la romantismul Venetiei pana la stancile dramatice ale Kotorului, aceasta calatorie de 10 nopti include serviciu de butler, dining all-inclusive si excursii terestre exclusive.',
  },
]

// ============================================================
// Cancellation policies by cruise line (source: croaziere.net)
// ============================================================

interface CancellationTier {
  period_en: string
  period_ro: string
  penalty: string
  penalty_en?: string
  penalty_ro?: string
}

const CANCELLATION_POLICIES: Record<string, {
  tiers: CancellationTier[]
  notes_en?: string
  notes_ro?: string
}> = {
  'MSC Cruises': {
    tiers: [
      { period_en: 'More than 60 days before', period_ro: 'Mai mult de 60 zile inainte', penalty: '50 EUR/pers.' },
      { period_en: '59 – 30 days before', period_ro: '59 – 30 zile inainte', penalty: '25%' },
      { period_en: '29 – 22 days before', period_ro: '29 – 22 zile inainte', penalty: '40%' },
      { period_en: '21 – 15 days before', period_ro: '21 – 15 zile inainte', penalty: '60%' },
      { period_en: '14 – 6 days before', period_ro: '14 – 6 zile inainte', penalty: '80%' },
      { period_en: 'Under 6 days / no-show', period_ro: 'Sub 6 zile / neprezentare', penalty: '100%' },
    ],
    notes_en: 'For cruises of 15+ nights the periods start earlier (90 days). Name changes: €50/person.',
    notes_ro: 'Pentru croazierele de 15+ nopti perioadele incep mai devreme (90 zile). Schimbari de nume: 50 EUR/persoana.',
  },
  'Costa Cruises': {
    tiers: [
      { period_en: 'More than 60 days before', period_ro: 'Mai mult de 60 zile inainte', penalty: '100 EUR/pers.' },
      { period_en: '59 – 30 days before', period_ro: '59 – 30 zile inainte', penalty: '20%' },
      { period_en: '29 – 15 days before', period_ro: '29 – 15 zile inainte', penalty: '50%' },
      { period_en: '14 – 8 days before', period_ro: '14 – 8 zile inainte', penalty: '75%' },
      { period_en: '7 – 0 days / no-show', period_ro: '7 – 0 zile / neprezentare', penalty: '100%' },
    ],
    notes_en: 'Long-duration & World cruises have stricter policies (penalties start from 90 days). Last Minute offers: 100% penalty.',
    notes_ro: 'Croazierele lungi si In Jurul Lumii au politici mai stricte (penalitati de la 90 zile). Oferte Last Minute: penalitate 100%.',
  },
  'Norwegian Cruise Line': {
    tiers: [
      { period_en: '29+ days before', period_ro: '29+ zile inainte', penalty: '20%' },
      { period_en: '28 – 15 days before', period_ro: '28 – 15 zile inainte', penalty: '50%' },
      { period_en: '14 – 8 days before', period_ro: '14 – 8 zile inainte', penalty: '75%' },
      { period_en: '7 – 0 days / no-show', period_ro: '7 – 0 zile / neprezentare', penalty: '95%' },
    ],
  },
  'Royal Caribbean': {
    tiers: [
      { period_en: '53+ days before', period_ro: '53+ zile inainte', penalty: 'Deposit (nerambursabil)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
      { period_en: '52 – 34 days before', period_ro: '52 – 34 zile inainte', penalty: '50%' },
      { period_en: '33 – 18 days before', period_ro: '33 – 18 zile inainte', penalty: '75%' },
      { period_en: '17 – 0 days / no-show', period_ro: '17 – 0 zile / neprezentare', penalty: '100%' },
    ],
    notes_en: 'For cruises of 15+ nights, the cancellation periods are stricter (from 123 days).',
    notes_ro: 'Pentru croazierele de 15+ nopti, perioadele sunt mai stricte (de la 123 zile).',
  },
  'Viking River Cruises': {
    tiers: [
      { period_en: '120+ days before', period_ro: '120+ zile inainte', penalty: '250 EUR/pers.' },
      { period_en: '119 – 90 days before', period_ro: '119 – 90 zile inainte', penalty: '25%' },
      { period_en: '89 – 60 days before', period_ro: '89 – 60 zile inainte', penalty: '50%' },
      { period_en: '59 – 30 days before', period_ro: '59 – 30 zile inainte', penalty: '75%' },
      { period_en: 'Under 30 days / no-show', period_ro: 'Sub 30 zile / neprezentare', penalty: '100%' },
    ],
  },
  'Silversea': {
    tiers: [
      { period_en: '120+ days before', period_ro: '120+ zile inainte', penalty: 'Deposit (nerambursabil)', penalty_en: 'Deposit (non-refundable)', penalty_ro: 'Deposit (nerambursabil)' },
      { period_en: '119 – 90 days before', period_ro: '119 – 90 zile inainte', penalty: '25%' },
      { period_en: '89 – 60 days before', period_ro: '89 – 60 zile inainte', penalty: '50%' },
      { period_en: '59 – 31 days before', period_ro: '59 – 31 zile inainte', penalty: '75%' },
      { period_en: '30 – 0 days / no-show', period_ro: '30 – 0 zile / neprezentare', penalty: '100%' },
    ],
    notes_en: 'Luxury cruise cancellation terms may vary. Contact us for specific conditions.',
    notes_ro: 'Termenii de anulare pentru croazierele de lux pot varia. Contactati-ne pentru conditii specifice.',
  },
}

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

function CruiseDetailContent() {
  const t = useT()
  const { locale } = useLocale()
  const params = useParams()
  const slug = params.slug as string

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'included' | 'cancellation'>('overview')
  const [showBooking, setShowBooking] = useState(false)

  // Auto-open booking modal if ?book=1 in URL
  useEffect(() => {
    if (searchParams.get('book') === '1') {
      setShowBooking(true)
    }
  }, [searchParams])

  // Find cruise by slug
  const cruise = demoCruises.find(c => c.slug === slug)

  // Similar cruises (same destination or type, excluding current)
  const similarCruises = cruise
    ? demoCruises
        .filter(c => c.id !== cruise.id && (c.destination_slug === cruise.destination_slug || c.cruise_type === cruise.cruise_type))
        .slice(0, 3)
    : []

  // 404-style fallback
  if (!cruise) {
    return (
      <>
        <Header />
        <main id="main-content">
        <section className="min-h-[60vh] flex items-center justify-center bg-navy-50">
          <Container className="text-center py-20">
            <h1 className="text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {locale === 'ro' ? 'Croaziera nu a fost gasita' : 'Cruise Not Found'}
            </h1>
            <p className="text-navy-500 mb-8">
              {locale === 'ro'
                ? 'Ne pare rau, croaziera pe care o cautati nu exista sau a fost eliminata.'
                : 'Sorry, the cruise you are looking for does not exist or has been removed.'}
            </p>
            <Button as="a" href="/cruises" variant="primary" size="lg">
              {locale === 'ro' ? 'Inapoi la Croaziere' : 'Back to Cruises'}
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

  const tabs = [
    { key: 'overview' as const, label: t('detail_overview') },
    { key: 'itinerary' as const, label: t('detail_itinerary') },
    { key: 'included' as const, label: t('detail_included') },
    { key: 'cancellation' as const, label: t('detail_cancellation') },
  ]

  const cancellationPolicy = cruise.cruise_line ? CANCELLATION_POLICIES[cruise.cruise_line] : undefined

  return (
    <>
      <Header />
      <main id="main-content">

      {/* Hero Image */}
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

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0">
          <Container className="pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {cruise.featured && <Badge variant="gold">{t('cruise_featured')}</Badge>}
              {cruise.cruise_type && (
                <Badge variant="navy">{t(`type_${cruise.cruise_type}` as 'type_ocean')}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-2">
              {title}
            </h1>
            <p className="text-navy-200 text-sm md:text-base">
              {cruise.cruise_line} {cruise.ship_name ? `- ${cruise.ship_name}` : ''}
            </p>
          </Container>
        </div>
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
                      label={locale === 'ro' ? 'Destinatie' : 'Destination'}
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

              {/* Tab Content: Itinerary */}
              {activeTab === 'itinerary' && (
                <div>
                  {/* Route Map */}
                  <RouteMap
                    departurePort={cruise.departure_port}
                    portsOfCall={cruise.ports_of_call}
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

                      {/* Ports */}
                      {ports.map((port, i) => (
                        <div key={i} className="relative flex items-start gap-5 pb-6">
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-navy-300 flex items-center justify-center">
                            <span className="text-xs font-bold text-navy-600">{i + 1}</span>
                          </div>
                          <div className="pt-1">
                            <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-0.5">
                              {locale === 'ro' ? `Ziua ${i + 2}` : `Day ${i + 2}`}
                            </p>
                            <p className="font-semibold text-navy-900">{port}</p>
                          </div>
                        </div>
                      ))}

                      {/* Return */}
                      <div className="relative flex items-start gap-5">
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
                          <AnchorIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="pt-1">
                          <p className="text-xs text-gold-600 font-medium uppercase tracking-wider mb-0.5">
                            {locale === 'ro' ? 'Intoarcere' : 'Return'}
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

              {/* Tab Content: Cancellation Policy */}
              {activeTab === 'cancellation' && cancellationPolicy && (
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
                        {cancellationPolicy.tiers.map((tier, i) => (
                          <tr
                            key={i}
                            className={`${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/50'} ${
                              i === cancellationPolicy.tiers.length - 1 ? '' : 'border-b border-navy-100'
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
                  {(cancellationPolicy.notes_en || cancellationPolicy.notes_ro) && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <InfoCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        {locale === 'ro' ? cancellationPolicy.notes_ro : cancellationPolicy.notes_en}
                      </p>
                    </div>
                  )}

                  {/* Source disclaimer */}
                  <p className="text-xs text-navy-400 italic">
                    {t('detail_cancellation_source')}
                  </p>
                </div>
              )}

              {activeTab === 'cancellation' && !cancellationPolicy && (
                <p className="text-sm text-navy-500">
                  {locale === 'ro'
                    ? 'Politica de anulare nu este disponibila pentru aceasta croaziera. Contactati-ne pentru detalii.'
                    : 'Cancellation policy is not available for this cruise. Contact us for details.'}
                </p>
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

                <Button onClick={() => setShowBooking(true)} variant="primary" size="lg" className="w-full mb-3">
                  {t('cruise_book_now')}
                </Button>
                <Button as="a" href="/contact" variant="secondary" size="md" className="w-full">
                  {t('hero_cta2')}
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
                    ? 'Consultantul nostru de croaziere este disponibil sa te ajute cu rezervarea.'
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

      <BookingModal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        cruiseTitle={title}
        cruiseSlug={cruise.slug}
        cruisePrice={cruise.price_from}
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
