'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Cruise } from '@/lib/supabase'
import type { Locale } from '@/i18n/translations'
import { useExchangeRate } from '@/context/ExchangeRateContext'
import { t } from '@/i18n/translations'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getBestImageUrl } from '@/data/ship-images'
import { timeAgo, isPriceRecentlyChanged } from '@/lib/time-ago'

// ============================================================
// CruiseCard — supports grouped routes + price freshness labels
// ============================================================

interface CruiseCardProps {
  cruise: Cruise & {
    departure_count?: number
    price_min?: number
    price_max?: number
    next_departures?: string[]
    // Promo fields from index
    is_promo?: boolean
    is_bestdeal?: boolean
    promo_price?: number | null
  }
  locale: Locale
}

export default function CruiseCard({ cruise, locale }: CruiseCardProps) {
  const { rateWithMargin } = useExchangeRate()
  const title = locale === 'ro' && cruise.title_ro ? cruise.title_ro : cruise.title
  const destination =
    locale === 'ro' && cruise.destination_ro
      ? cruise.destination_ro
      : cruise.destination || ''
  const departurePort =
    locale === 'ro' && cruise.departure_port_ro
      ? cruise.departure_port_ro
      : cruise.departure_port || ''
  const nightsLabel =
    cruise.nights === 1 ? t('cruise_night', locale) : t('cruise_nights', locale)

  // Grouped route metadata
  const isGrouped = (cruise.departure_count || 0) > 1
  const departureCount = cruise.departure_count || 1
  const priceMin = cruise.price_min || cruise.price_from
  const priceMax = cruise.price_max || cruise.price_from
  const hasPriceRange = isGrouped && priceMax > priceMin

  // For grouped cards, show the nearest future departure
  const departureDate = cruise.departure_date
    ? new Date(cruise.departure_date).toLocaleDateString(
        locale === 'ro' ? 'ro-RO' : 'en-GB',
        { day: 'numeric', month: 'short', year: 'numeric' },
      )
    : ''

  const priceEur = priceMin
  const priceRon = Math.round(priceEur * rateWithMargin)

  // Use HD image mapping — upgrades low-quality API thumbnails
  const imageUrl = getBestImageUrl(cruise.image_url, cruise.ship_name, cruise.cruise_line)

  // Price freshness & urgency
  const syncedAgo = timeAgo(cruise.last_synced_at, locale)
  const priceChanged = isPriceRecentlyChanged(cruise.price_changed_at, 7)
  const previousPrice = cruise.previous_price_from
  const priceDecreased = previousPrice && previousPrice > cruise.price_from
  const priceIncreased = previousPrice && previousPrice < cruise.price_from

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image — clickable, navigates to cruise detail */}
      <Link href={`/cruises/${cruise.slug}`} className="relative block aspect-[4/3] overflow-hidden cursor-pointer">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div')
                fallback.className = 'img-fallback flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200'
                fallback.innerHTML = '<svg class="h-12 w-12 text-navy-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>'
                parent.appendChild(fallback)
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200">
            <svg
              className="h-12 w-12 text-navy-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Featured + Promo badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {cruise.featured && (
            <Badge variant="gold">{t('cruise_featured', locale)}</Badge>
          )}
          {cruise.is_promo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-semibold backdrop-blur-sm">
              🔥 {t('promo_badge' as 'cruise_featured', locale)}
            </span>
          )}
          {cruise.is_bestdeal && !cruise.is_promo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold backdrop-blur-sm">
              ⭐ {t('bestdeal_badge' as 'cruise_featured', locale)}
            </span>
          )}
        </div>

        {/* Cruise type badge */}
        {cruise.cruise_type && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="navy">
              {t(`type_${cruise.cruise_type}` as 'type_ocean', locale)}
            </Badge>
          </div>
        )}

        {/* Urgency badges — bottom-right overlay */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1">
          {syncedAgo?.isToday && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-semibold backdrop-blur-sm">
              <RefreshIcon />
              {t('price_updated_today', locale)}
            </span>
          )}
          {priceChanged && priceDecreased && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-semibold backdrop-blur-sm">
              <ArrowDownIcon />
              {t('price_decreased', locale)}
            </span>
          )}
          {priceChanged && priceIncreased && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600/90 text-white text-[10px] font-semibold backdrop-blur-sm">
              <ArrowUpIcon />
              {t('price_increased', locale)}
            </span>
          )}
        </div>

        {/* Departure count badge — bottom-left overlay on image */}
        {isGrouped && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-900/80 text-white text-xs font-semibold backdrop-blur-sm">
              <CalendarMultiIcon />
              {departureCount} {locale === 'ro' ? 'plecări' : 'departures'}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Cruise Line + Ship */}
        {(cruise.cruise_line || cruise.ship_name) && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gold-600">
            {cruise.cruise_line}
            {cruise.ship_name ? ` - ${cruise.ship_name}` : ''}
          </p>
        )}

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-semibold text-navy-900">
          <Link
            href={`/cruises/${cruise.slug}`}
            className="transition-colors hover:text-gold-600"
          >
            {title}
          </Link>
        </h3>

        {/* Info Row */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-500">
          {destination && (
            <span className="flex items-center gap-1">
              <MapPinIcon />
              {destination}
            </span>
          )}
          {departurePort && (
            <span className="flex items-center gap-1">
              <AnchorIcon />
              {departurePort}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MoonIcon />
            {cruise.nights} {nightsLabel}
          </span>
          {departureDate && (
            <span className="flex items-center gap-1">
              <CalendarIcon />
              {isGrouped
                ? (locale === 'ro' ? 'de la ' : 'from ') + departureDate
                : departureDate
              }
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + Actions */}
        <div className="flex items-end justify-between gap-3 border-t border-navy-100 pt-4">
          <div>
            <p className="text-xs text-navy-400">{t('cruise_from', locale)}</p>
            {/* Promo price display — strikethrough original + promo in red */}
            {cruise.promo_price && cruise.promo_price < priceEur ? (
              <>
                <p className="text-sm text-navy-400 line-through">
                  &euro;{priceEur.toLocaleString()}
                </p>
                <p className="text-xl font-bold text-red-600">
                  &euro;{cruise.promo_price.toLocaleString()}
                  <span className="text-xs font-normal text-navy-400">
                    {t('cruise_per_person', locale)}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-xl font-bold text-navy-900">
                &euro;{priceEur.toLocaleString()}
                <span className="text-xs font-normal text-navy-400">
                  {t('cruise_per_person', locale)}
                </span>
              </p>
            )}
            {/* Previous price (strikethrough) when price changed */}
            {!cruise.promo_price && priceChanged && previousPrice && previousPrice !== cruise.price_from && (
              <p className="text-[10px] text-navy-400 line-through">
                {t('price_was', locale)} &euro;{previousPrice.toLocaleString()}
              </p>
            )}
            {hasPriceRange && (
              <p className="text-[10px] text-navy-400">
                {locale === 'ro' ? 'până la' : 'up to'} &euro;{priceMax.toLocaleString()}
              </p>
            )}
            {locale === 'ro' && (
              <p className="text-xs text-gold-600">
                ~{priceRon.toLocaleString()} {t('cruise_lei', locale)}
              </p>
            )}
            {/* Price freshness label */}
            {syncedAgo && (
              <p className="mt-0.5 text-[10px] text-navy-300" title={cruise.last_synced_at || ''}>
                {t('price_updated', locale)} {syncedAgo.label}
              </p>
            )}
          </div>

          <Button
            as="a"
            href={`/cruises/${cruise.slug}`}
            variant="primary"
            size="sm"
          >
            {t('cruise_view_details', locale)}
            <svg className="ml-1 h-3.5 w-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
      </div>
    </article>
  )
}

// ============================================================
// Inline SVG icons (small, avoids extra deps)
// ============================================================

function MapPinIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function AnchorIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 100 6 3 3 0 000-6zm0 6v14m-7-4c0 3.866 3.134 4 7 4s7-.134 7-4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function CalendarMultiIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.016 4.649v4.992" />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  )
}
