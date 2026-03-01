'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import { eurToRon } from '@/lib/supabase'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getBestImageUrl } from '@/data/ship-images'
import type { CruiseIndex } from '@/lib/recommendation-engine'

// ============================================================
// GuidedResultCard — enhanced card with "why recommended" badge
// ============================================================

interface GuidedResultCardProps {
  cruise: CruiseIndex & { _score: number }
  reason: string
  position: number
  locale: Locale
  onRequestOffer: () => void
  onCardClick: () => void
}

export default function GuidedResultCard({
  cruise,
  reason,
  position,
  locale,
  onRequestOffer,
  onCardClick,
}: GuidedResultCardProps) {
  const title = locale === 'ro' ? cruise.t : cruise.t
  const destination = locale === 'ro' ? cruise.dr : cruise.d
  const nightsLabel = cruise.n === 1
    ? t('cruise_night', locale)
    : t('cruise_nights', locale)
  const departureDate = cruise.dd
    ? new Date(cruise.dd).toLocaleDateString(
        locale === 'ro' ? 'ro-RO' : 'en-GB',
        { day: 'numeric', month: 'short', year: 'numeric' },
      )
    : ''
  const priceEur = cruise.p
  const priceRon = eurToRon(priceEur)
  const imageUrl = getBestImageUrl(cruise.img, cruise.sn, cruise.cl)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Recommendation badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge variant="gold">
          #{position + 1} — {reason}
        </Badge>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200">
            <svg className="h-12 w-12 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Cruise Line + Ship */}
        {(cruise.cl || cruise.sn) && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold-600">
            {cruise.cl}
            {cruise.sn ? ` — ${cruise.sn}` : ''}
          </p>
        )}

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-semibold text-navy-900">
          <Link
            href={`/cruises/${cruise.s}`}
            onClick={onCardClick}
            className="transition-colors hover:text-gold-600"
          >
            {title}
          </Link>
        </h3>

        {/* Info Row */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-500">
          {destination && (
            <span className="flex items-center gap-1">
              📍 {destination}
            </span>
          )}
          <span className="flex items-center gap-1">
            🌙 {cruise.n} {nightsLabel}
          </span>
          {departureDate && (
            <span className="flex items-center gap-1">
              📅 {departureDate}
            </span>
          )}
          {cruise.dp && (
            <span className="flex items-center gap-1">
              ⚓ {cruise.dp}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3 border-t border-navy-100 pt-4">
          <div>
            <p className="text-xs text-navy-400">{t('cruise_from', locale)}</p>
            <p className="text-xl font-bold text-navy-900">
              &euro;{priceEur.toLocaleString()}
              <span className="text-xs font-normal text-navy-400">
                {t('cruise_per_person', locale)}
              </span>
            </p>
            {locale === 'ro' && (
              <p className="text-xs text-gold-600">
                ~{priceRon.toLocaleString()} {t('cruise_lei', locale)}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              as="a"
              href={`/cruises/${cruise.s}`}
              variant="secondary"
              size="sm"
              onClick={onCardClick}
            >
              {t('cruise_view_details', locale)}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestOffer}
            >
              {t('cta_request_offer', locale)}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
