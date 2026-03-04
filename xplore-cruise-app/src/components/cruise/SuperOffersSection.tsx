'use client'

import { useState, useEffect } from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import CruiseCard from '@/components/cruise/CruiseCard'
import type { Cruise } from '@/lib/supabase'

// ============================================================
// Super Oferte / Hot Deals — homepage section
// Fetches promo cruises from the API and displays them
// If no promo cruises exist, the section is hidden entirely
// ============================================================

interface SuperOffersSectionProps {
  locale: Locale
}

export default function SuperOffersSection({ locale }: SuperOffersSectionProps) {
  const [promoCruises, setPromoCruises] = useState<(Cruise & {
    is_promo?: boolean
    is_bestdeal?: boolean
    promo_price?: number | null
  })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // deals=1 → returns best-value cruises (or explicit promos if available from API)
    fetch('/api/cruises?deals=1&limit=6&sort=price_asc')
      .then(res => res.json())
      .then(data => {
        if (data.cruises && data.cruises.length > 0) {
          setPromoCruises(data.cruises)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Don't render anything if no promo cruises or still loading
  if (loading || promoCruises.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      <Container className="relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-700 text-sm font-semibold mb-4">
            🔥 {t('super_offers_title' as 'loading', locale)}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
            {t('super_offers_title' as 'loading', locale)}
          </h2>
          <p className="text-navy-500 max-w-xl mx-auto">
            {t('super_offers_subtitle' as 'loading', locale)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promoCruises.slice(0, 6).map((cruise, i) => (
            <div key={cruise.id || cruise.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <CruiseCard cruise={cruise} locale={locale} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button as="a" href="/cruises?sort=price_asc" variant="primary" size="lg">
            {t('super_offers_see_all' as 'loading', locale)} →
          </Button>
        </div>
      </Container>
    </section>
  )
}
