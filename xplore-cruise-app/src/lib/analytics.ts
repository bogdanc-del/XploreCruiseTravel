// ============================================================
// analytics.ts — Privacy-safe funnel tracking for XploreCruiseTravel
//
// Two tracking channels:
// 1. GA4 (window.gtag) — if loaded
// 2. POST /api/events → Supabase analytics_events table
//
// Payload ALWAYS excludes PII: name, email, phone, etc.
// Includes: locale, page, cruise_slug, timestamp only.
// ============================================================

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export interface AnalyticsPayload {
  locale?: string
  page?: string | number
  cruise_slug?: string
  [key: string]: string | number | boolean | null | undefined
}

// PII field names we must NEVER send to analytics
const PII_FIELDS = new Set([
  'name', 'first_name', 'last_name', 'firstname', 'lastname',
  'email', 'phone', 'telephone', 'mobile',
  'address', 'street', 'city', 'zip', 'postal',
  'ssn', 'passport', 'dob', 'date_of_birth', 'birthday',
  'credit_card', 'card_number', 'cvv', 'expiry',
  'password', 'secret', 'token', 'api_key',
  'ip', 'ip_address', 'user_agent',
])

/**
 * Remove PII fields and sanitize values.
 * Exported for unit testing.
 */
export function sanitizePayload(
  payload: AnalyticsPayload,
): Record<string, string | number | boolean | null> {
  const result: Record<string, string | number | boolean | null> = {}

  for (const [key, value] of Object.entries(payload)) {
    const lowerKey = key.toLowerCase()
    if (PII_FIELDS.has(lowerKey)) continue
    if (value === undefined) continue
    if (typeof value === 'string' && value.length > 200) {
      result[key] = value.slice(0, 200)
    } else {
      result[key] = value as string | number | boolean | null
    }
  }

  return result
}

/**
 * Track an analytics event. Fire-and-forget — never blocks the UI.
 *
 * @param eventName  - e.g. 'cruises_list_view', 'cta_click'
 * @param payload    - Additional context (no PII!)
 */
export function track(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return

  const sanitized = sanitizePayload(payload)

  // 1. Send to our own /api/events endpoint
  const body = {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...sanitized,
  }

  try {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => { /* silent */ })
  } catch {
    /* silent */
  }

  // 2. Forward to GA4 if present
  if (window.gtag) {
    window.gtag('event', eventName, sanitized)
  }
}

/**
 * Legacy alias — GA4 only. Prefer `track()` for dual-channel.
 */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
) {
  track(name, params)
}

// ============================================================
// Funnel Events — privacy-safe, typed helpers
// ============================================================

export function trackCruisesListView(locale: string, page: number, total: number) {
  track('cruises_list_view', { locale, page, total_results: total })
}

export function trackCruiseDetailView(locale: string, cruiseSlug: string) {
  track('cruise_detail_view', { locale, cruise_slug: cruiseSlug })
}

export function trackCtaClick(locale: string, cruiseSlug: string, ctaType: string) {
  track('cta_click', { locale, cruise_slug: cruiseSlug, cta_type: ctaType })
}

export function trackLeadSubmitSuccess(locale: string, cruiseSlug: string, source: string) {
  track('lead_submit_success', { locale, cruise_slug: cruiseSlug, source })
}

export function trackContactSubmitSuccess(locale: string) {
  track('contact_submit_success', { locale })
}

// ============================================================
// Guided Flow Events (existing, now dual-channel)
// ============================================================

export function trackGuidedStart(source: 'homepage' | 'listing' | 'nav') {
  track('guided_start', { source })
}

export function trackGuidedStepComplete(step: number, stepName: string, value: string) {
  track('guided_step_complete', { step, step_name: stepName, value })
}

export function trackGuidedSkip(step: number) {
  track('guided_skip', { step })
}

export function trackGuidedOptionalComplete(budget: string, destination: string) {
  track('guided_optional_complete', {
    budget: budget || 'none',
    destination: destination || 'none',
  })
}

export function trackGuidedComplete(totalResults: number, durationSeconds: number) {
  track('guided_complete', {
    total_results: totalResults,
    duration_seconds: durationSeconds,
  })
}

export function trackGuidedAbandon(lastStep: number, durationSeconds: number) {
  track('guided_abandon', {
    last_step: lastStep,
    duration_seconds: durationSeconds,
  })
}

export function trackGuidedResultClick(cruiseSlug: string, position: number, score: number) {
  track('guided_result_click', { cruise_slug: cruiseSlug, position, score })
}

export function trackGuidedResultOffer(cruiseSlug: string, position: number) {
  track('guided_result_offer', { cruise_slug: cruiseSlug, position })
}

// ============================================================
// Browse Events
// ============================================================

export function trackBrowseFilterApply(filterType: string, filterValue: string) {
  track('browse_filter_apply', { filter_type: filterType, filter_value: filterValue })
}

export function trackBrowseGuidedFilters(party: string, priority: string, timing: string) {
  track('browse_guided_filters', { party, priority, timing })
}

// ============================================================
// Lead Form Events
// ============================================================

export function trackLeadFormOpen(
  source: 'detail' | 'guided_result' | 'listing',
  hasGuidedContext: boolean,
  cruiseSlug: string,
) {
  track('lead_form_open', { source, has_guided_context: hasGuidedContext, cruise_slug: cruiseSlug })
}

export function trackLeadFormSubmit(
  source: string,
  hasGuidedContext: boolean,
  cruiseSlug: string,
) {
  track('lead_form_submit', { source, has_guided_context: hasGuidedContext, cruise_slug: cruiseSlug })
}

export function trackLeadFormAbandon(source: string, fieldsFilled: number) {
  track('lead_form_abandon', { source, fields_filled: fieldsFilled })
}
