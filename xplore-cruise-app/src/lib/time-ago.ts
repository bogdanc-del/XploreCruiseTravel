// ============================================================
// time-ago — Lightweight, SSR-safe, bilingual time-ago utility
// No external dependencies. Handles EN + RO.
// ============================================================

import type { Locale } from '@/i18n/translations'

interface TimeAgoResult {
  /** Human-readable time-ago string, e.g. "2 hours ago" / "acum 2 ore" */
  label: string
  /** Whether the date is within the last 24 hours */
  isToday: boolean
  /** Whether the date is within the last 7 days */
  isRecent: boolean
  /** Raw difference in milliseconds */
  diffMs: number
}

const MINUTE = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

/**
 * Format a date as a human-readable "time ago" string.
 * Timezone-safe: always compares ISO timestamps in UTC.
 *
 * @param isoDate - ISO 8601 timestamp (e.g. "2026-03-03T10:00:00.000Z")
 * @param locale  - 'en' | 'ro'
 * @param now     - Optional "current time" for testing (defaults to Date.now())
 */
export function timeAgo(
  isoDate: string | null | undefined,
  locale: Locale = 'en',
  now?: number,
): TimeAgoResult | null {
  if (!isoDate) return null

  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return null

  const currentTime = now ?? Date.now()
  const diffMs = currentTime - date.getTime()

  // Future dates — shouldn't happen but handle gracefully
  if (diffMs < 0) {
    return {
      label: locale === 'ro' ? 'tocmai acum' : 'just now',
      isToday: true,
      isRecent: true,
      diffMs: 0,
    }
  }

  const isToday = diffMs < DAY
  const isRecent = diffMs < 7 * DAY

  let label: string

  if (diffMs < MINUTE) {
    label = locale === 'ro' ? 'tocmai acum' : 'just now'
  } else if (diffMs < HOUR) {
    const mins = Math.floor(diffMs / MINUTE)
    if (locale === 'ro') {
      label = mins === 1 ? 'acum 1 minut' : `acum ${mins} minute`
    } else {
      label = mins === 1 ? '1 minute ago' : `${mins} minutes ago`
    }
  } else if (diffMs < DAY) {
    const hours = Math.floor(diffMs / HOUR)
    if (locale === 'ro') {
      label = hours === 1 ? 'acum 1 oră' : `acum ${hours} ore`
    } else {
      label = hours === 1 ? '1 hour ago' : `${hours} hours ago`
    }
  } else if (diffMs < 7 * DAY) {
    const days = Math.floor(diffMs / DAY)
    if (locale === 'ro') {
      label = days === 1 ? 'acum 1 zi' : `acum ${days} zile`
    } else {
      label = days === 1 ? '1 day ago' : `${days} days ago`
    }
  } else if (diffMs < 30 * DAY) {
    const weeks = Math.floor(diffMs / (7 * DAY))
    if (locale === 'ro') {
      label = weeks === 1 ? 'acum 1 săptămână' : `acum ${weeks} săptămâni`
    } else {
      label = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    }
  } else {
    const months = Math.floor(diffMs / (30 * DAY))
    if (locale === 'ro') {
      label = months === 1 ? 'acum 1 lună' : `acum ${months} luni`
    } else {
      label = months === 1 ? '1 month ago' : `${months} months ago`
    }
  }

  return { label, isToday, isRecent, diffMs }
}

/**
 * Check if a price change happened within the last N days.
 */
export function isPriceRecentlyChanged(
  priceChangedAt: string | null | undefined,
  withinDays = 7,
  now?: number,
): boolean {
  if (!priceChangedAt) return false
  const date = new Date(priceChangedAt)
  if (isNaN(date.getTime())) return false
  const currentTime = now ?? Date.now()
  return (currentTime - date.getTime()) < withinDays * DAY
}
