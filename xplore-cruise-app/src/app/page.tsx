'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import CruiseCard from '@/components/cruise/CruiseCard'
import ChatWidget from '@/components/chat/ChatWidget'
import { eurToRon } from '@/lib/supabase'
import type { Cruise } from '@/lib/supabase'

// Demo cruise data (will be replaced by Supabase once connected)
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
  },
  {
    id: '4', slug: 'romantic-danube-river-cruise', title: 'Romantic Danube River Cruise', title_ro: 'Croaziera Romantica pe Dunare',
    cruise_type: 'river', nights: 8, price_from: 2299, currency: 'EUR', departure_port: 'Budapest, Hungary',
    departure_date: '2026-06-20', ports_of_call: ['Bratislava', 'Vienna', 'Durnstein', 'Melk', 'Passau'], ports_of_call_ro: ['Bratislava', 'Viena', 'Durnstein', 'Melk', 'Passau'],
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', gallery_urls: [],
    included: ['All meals', 'Shore excursions', 'Wine tasting'], included_ro: ['Toate mesele', 'Excursii terestre', 'Degustare vin'],
    excluded: ['Premium wines', 'Spa treatments'], excluded_ro: ['Vinuri premium', 'Tratamente spa'],
    tags: ['romantic', 'cultural'], featured: true, active: true, source: 'manual',
    cruise_line: 'Viking River Cruises', ship_name: 'Viking Longship Hild', destination: 'River Cruises', destination_ro: 'Croaziere Fluviale', destination_slug: 'river-cruises',
  },
  {
    id: '5', slug: 'caribbean-perfect-day', title: 'Caribbean & Perfect Day', title_ro: 'Caraibe si Perfect Day',
    cruise_type: 'ocean', nights: 7, price_from: 749, currency: 'EUR', departure_port: 'Miami, FL, USA',
    departure_date: '2026-11-10', ports_of_call: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'], ports_of_call_ro: ['CocoCay', 'Cozumel', 'Roatan', 'Costa Maya'],
    image_url: 'https://images.unsplash.com/photo-1580541631950-7282082b03fe?w=800', gallery_urls: [],
    included: ['All meals', 'Entertainment', 'Pool deck'], included_ro: ['Toate mesele', 'Divertisment', 'Punte piscina'],
    excluded: ['Drink packages', 'WiFi'], excluded_ro: ['Pachet bauturi', 'WiFi'],
    tags: ['family', 'tropical'], featured: true, active: true, source: 'manual',
    cruise_line: 'Royal Caribbean', ship_name: 'Harmony of the Seas', destination: 'Caribbean', destination_ro: 'Caraibe', destination_slug: 'caribbean',
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
  },
]

// Stats counter component
function StatCounter({ target, suffix = '', label }: { target: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const duration = 2000
        const start = Date.now()
        const animate = () => {
          const elapsed = Date.now() - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient-gold font-[family-name:var(--font-heading)]">
        {count}{suffix}
      </div>
      <div className="mt-2 text-navy-300 text-sm uppercase tracking-wider">{label}</div>
    </div>
  )
}

// Particle component for hero
function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle-float ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
            ['--tx' as string]: `${(Math.random() - 0.5) * 200}px`,
            ['--ty' as string]: `${-100 - Math.random() * 200}px`,
            ['--tr' as string]: `${Math.random() * 360}deg`,
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const t = useT()
  const { locale } = useLocale()

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 overflow-hidden">
        <HeroParticles />
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/50 via-transparent to-navy-950/80" />

        <Container className="relative z-10 text-center py-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              {locale === 'ro' ? 'Tour Operator Autorizat din 2016' : 'Licensed Tour Operator since 2016'}
            </div>
          </div>

          <h1 className="animate-fade-in-up delay-100 text-4xl md:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-heading)] leading-tight mb-6">
            {t('hero_title').split(' ').map((word, i) => (
              <span key={i}>
                {i >= t('hero_title').split(' ').length - 2 ? (
                  <span className="text-gradient-gold">{word} </span>
                ) : (
                  <>{word} </>
                )}
              </span>
            ))}
          </h1>

          <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-navy-200 max-w-2xl mx-auto mb-10">
            {t('hero_subtitle')}
          </p>

          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Button as="a" href="/cruises" size="lg" variant="primary" className="animate-pulse-gold">
              {t('hero_cta')}
            </Button>
            <Button as="a" href="/contact" size="lg" variant="secondary" className="!border-white/30 !text-white hover:!bg-white/10">
              {t('hero_cta2')}
            </Button>
          </div>
        </Container>

        {/* Wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,100 L0,100 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-navy-900 -mt-1">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={150} suffix="+" label={t('stats_cruises')} />
            <StatCounter target={25} suffix="+" label={t('stats_destinations')} />
            <StatCounter target={500} suffix="+" label={t('stats_clients')} />
            <StatCounter target={8} suffix="+" label={t('stats_years')} />
          </div>
        </Container>
      </section>

      {/* Featured Cruises */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {locale === 'ro' ? 'Croaziere Recomandate' : 'Featured Cruises'}
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              {locale === 'ro'
                ? 'Descoperiti selectia noastra de croaziere premium, alese cu grija pentru experiente de neuitat.'
                : 'Discover our handpicked selection of premium cruises, curated for unforgettable experiences.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoCruises.map((cruise, i) => (
              <div key={cruise.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <CruiseCard cruise={cruise} locale={locale} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button as="a" href="/cruises" variant="secondary" size="lg">
              {t('see_all')} →
            </Button>
          </div>
        </Container>
      </section>

      {/* Destinations Section */}
      <section className="py-20 bg-navy-50">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {locale === 'ro' ? 'Destinatii Populare' : 'Popular Destinations'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Mediterranean', nameRo: 'Mediterana', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400', count: 45 },
              { name: 'Caribbean', nameRo: 'Caraibe', img: 'https://images.unsplash.com/photo-1580541631950-7282082b03fe?w=400', count: 32 },
              { name: 'Northern Europe', nameRo: 'Europa de Nord', img: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?w=400', count: 18 },
              { name: 'River Cruises', nameRo: 'Croaziere Fluviale', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', count: 24 },
            ].map((dest, i) => (
              <Link
                key={dest.name}
                href={`/cruises?destination=${dest.name.toLowerCase().replace(/\s/g, '-')}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Image
                  src={dest.img}
                  alt={locale === 'ro' ? dest.nameRo : dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-lg font-[family-name:var(--font-heading)]">
                    {locale === 'ro' ? dest.nameRo : dest.name}
                  </h3>
                  <p className="text-gold-400 text-sm mt-1">
                    {dest.count} {locale === 'ro' ? 'croaziere' : 'cruises'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1920')] bg-cover bg-center" />
        </div>
        <Container className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-6">
            {locale === 'ro' ? 'Pregatit pentru Aventura?' : 'Ready for Your Adventure?'}
          </h2>
          <p className="text-navy-200 max-w-xl mx-auto mb-8">
            {locale === 'ro'
              ? 'Contacteaza-ne astazi si primesti o oferta personalizata pentru croaziera visurilor tale.'
              : 'Contact us today and receive a personalized offer for your dream cruise.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as="a" href="/contact" size="lg" variant="primary">
              {t('hero_cta2')}
            </Button>
            <Button as="a" href="tel:+40749558572" size="lg" variant="secondary" className="!border-white/30 !text-white hover:!bg-white/10">
              📞 +40 749 558 572
            </Button>
          </div>
        </Container>
      </section>

      {/* Chat Widget */}
      <ChatWidget />

      <Footer />
    </>
  )
}
