'use client'

import Image from 'next/image'
import { useLocale } from '@/i18n/context'
import type { PortExcursion } from '@/data/ports'

interface ExcursionCardProps {
  excursion: PortExcursion
  className?: string
}

/**
 * Shore excursion recommendation card.
 * Horizontal layout with image, info, and external booking link.
 */
export default function ExcursionCard({ excursion, className = '' }: ExcursionCardProps) {
  const { locale } = useLocale()

  const name = locale === 'ro' ? excursion.name_ro : excursion.name
  const description = locale === 'ro' ? excursion.description_ro : excursion.description
  const bookLabel = locale === 'ro' ? 'Rezerva pe' : 'Book on'

  return (
    <div className={`group flex flex-col sm:flex-row gap-4 rounded-xl border border-navy-200 bg-white p-3 hover:shadow-md hover:border-gold-300 transition-all duration-200 ${className}`}>
      {/* Image */}
      <div className="relative w-full sm:w-36 h-28 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden bg-navy-100">
        <Image
          src={excursion.image_url}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 144px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-semibold text-navy-900 text-sm leading-tight mb-1 line-clamp-2">
            {name}
          </h4>
          <p className="text-xs text-navy-500 leading-relaxed line-clamp-2 mb-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Duration & Price */}
          <div className="flex items-center gap-3 text-xs text-navy-500">
            <span className="flex items-center gap-1">
              <ClockIcon />
              {excursion.duration}
            </span>
            <span className="font-semibold text-navy-800">
              {locale === 'ro' ? 'de la' : 'from'} {excursion.price_from}
            </span>
          </div>

          {/* Book CTA */}
          <a
            href={excursion.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors whitespace-nowrap"
          >
            {bookLabel} {excursion.provider}
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  )
}
