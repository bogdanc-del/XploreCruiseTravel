'use client'

import { useState, useEffect } from 'react'
import { useLocale, useT } from '@/i18n/context'
import Container from '@/components/ui/Container'
import ReviewCard from '@/components/reviews/ReviewCard'

interface ReviewData {
  id: string
  rating: number
  name: string | null
  city: string | null
  cruise_type: string | null
  message: string
  created_at: string
}

interface ReviewsSectionProps {
  /** Filter by cruise type (for detail pages) */
  cruiseType?: string
  /** Max reviews to show */
  limit?: number
  /** Section variant */
  variant?: 'homepage' | 'detail'
}

export default function ReviewsSection({
  cruiseType,
  limit = 6,
  variant = 'homepage',
}: ReviewsSectionProps) {
  const t = useT()
  const { locale } = useLocale()
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('limit', String(limit))
    if (cruiseType) params.set('cruise_type', cruiseType)

    fetch(`/api/reviews?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data.reviews || [])
      })
      .catch(() => {
        setReviews([])
      })
      .finally(() => setLoading(false))
  }, [cruiseType, limit])

  if (loading) {
    return (
      <section className={variant === 'homepage' ? 'py-20 bg-navy-50' : 'mt-12'}>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: variant === 'detail' ? 3 : 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-navy-100 p-5 animate-pulse h-48"
              />
            ))}
          </div>
        </Container>
      </section>
    )
  }

  if (reviews.length === 0) return null

  const heading =
    variant === 'detail'
      ? locale === 'ro'
        ? 'Ce spun clienții'
        : 'What clients say'
      : t('reviews_section_title')

  return (
    <section
      className={variant === 'homepage' ? 'py-20 bg-navy-50' : 'mt-12'}
      aria-label={heading}
    >
      {variant === 'homepage' ? (
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {heading}
            </h2>
            <p className="text-navy-500 max-w-xl mx-auto">
              {t('reviews_section_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </Container>
      ) : (
        <>
          <h3 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-6">
            {heading}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
