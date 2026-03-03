'use client'

import { useState, useEffect } from 'react'
import { useLocale, useT } from '@/i18n/context'
import Container from '@/components/ui/Container'
import TestimonialCard from '@/components/testimonials/TestimonialCard'
import type { TestimonialData } from '@/components/testimonials/TestimonialCard'

interface TestimonialsSectionProps {
  /** Tags for relevance matching (e.g. ['ocean','mediterranean','msc-cruises']) */
  tags?: string[]
  /** Max testimonials to show */
  limit?: number
  /** Section variant */
  variant?: 'homepage' | 'detail'
}

export default function TestimonialsSection({
  tags,
  limit = 6,
  variant = 'homepage',
}: TestimonialsSectionProps) {
  const t = useT()
  const { locale } = useLocale()
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('limit', String(limit))
    if (tags && tags.length > 0) params.set('tags', tags.join(','))

    fetch(`/api/testimonials?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || [])
      })
      .catch(() => {
        setTestimonials([])
      })
      .finally(() => setLoading(false))
  }, [tags, limit])

  if (loading) {
    const skeletonCount = variant === 'detail' ? 3 : 6
    return (
      <section className={variant === 'homepage' ? 'py-20 bg-white' : 'mt-12'}>
        <Container>
          {variant === 'homepage' && (
            <div className="text-center mb-14">
              <div className="h-9 bg-navy-100 rounded w-64 mx-auto animate-pulse mb-4" />
              <div className="h-5 bg-navy-100 rounded w-96 mx-auto animate-pulse" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-navy-100 p-6 animate-pulse h-52"
              />
            ))}
          </div>
        </Container>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  const heading =
    variant === 'detail'
      ? locale === 'ro'
        ? 'Ce spun clientii despre aceasta destinatie'
        : 'What clients say about this destination'
      : t('testimonials_section_title')

  const subtitle = variant === 'homepage' ? t('testimonials_section_subtitle') : null

  return (
    <section
      className={variant === 'homepage' ? 'py-20 bg-white' : 'mt-12'}
      aria-label={heading}
    >
      {variant === 'homepage' ? (
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-4">
              {heading}
            </h2>
            {subtitle && (
              <p className="text-navy-500 max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <TestimonialCard testimonial={testimonial} />
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
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
