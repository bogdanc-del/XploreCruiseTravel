// ============================================================
// GA4 Analytics Helper
// ============================================================

// Extend window for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Fire a GA4 custom event.
 * Safe to call on server (no-op) and before gtag loads (no-op).
 */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

// ============================================================
// Guided Flow Events
// ============================================================

export function trackGuidedStart(source: 'homepage' | 'listing' | 'nav') {
  trackEvent('guided_start', { source })
}

export function trackGuidedStepComplete(step: number, stepName: string, value: string) {
  trackEvent('guided_step_complete', { step, step_name: stepName, value })
}

export function trackGuidedSkip(step: number) {
  trackEvent('guided_skip', { step })
}

export function trackGuidedOptionalComplete(budget: string, destination: string) {
  trackEvent('guided_optional_complete', {
    budget: budget || 'none',
    destination: destination || 'none',
  })
}

export function trackGuidedComplete(totalResults: number, durationSeconds: number) {
  trackEvent('guided_complete', {
    total_results: totalResults,
    duration_seconds: durationSeconds,
  })
}

export function trackGuidedAbandon(lastStep: number, durationSeconds: number) {
  trackEvent('guided_abandon', {
    last_step: lastStep,
    duration_seconds: durationSeconds,
  })
}

export function trackGuidedResultClick(cruiseSlug: string, position: number, score: number) {
  trackEvent('guided_result_click', {
    cruise_slug: cruiseSlug,
    position,
    score,
  })
}

export function trackGuidedResultOffer(cruiseSlug: string, position: number) {
  trackEvent('guided_result_offer', {
    cruise_slug: cruiseSlug,
    position,
  })
}

// ============================================================
// Browse Events
// ============================================================

export function trackBrowseFilterApply(filterType: string, filterValue: string) {
  trackEvent('browse_filter_apply', {
    filter_type: filterType,
    filter_value: filterValue,
  })
}

export function trackBrowseGuidedFilters(party: string, priority: string, timing: string) {
  trackEvent('browse_guided_filters', { party, priority, timing })
}

// ============================================================
// Lead Form Events
// ============================================================

export function trackLeadFormOpen(
  source: 'detail' | 'guided_result' | 'listing',
  hasGuidedContext: boolean,
  cruiseSlug: string
) {
  trackEvent('lead_form_open', {
    source,
    has_guided_context: hasGuidedContext,
    cruise_slug: cruiseSlug,
  })
}

export function trackLeadFormSubmit(
  source: string,
  hasGuidedContext: boolean,
  cruiseSlug: string
) {
  trackEvent('lead_form_submit', {
    source,
    has_guided_context: hasGuidedContext,
    cruise_slug: cruiseSlug,
  })
}

export function trackLeadFormAbandon(source: string, fieldsFilled: number) {
  trackEvent('lead_form_abandon', {
    source,
    fields_filled: fieldsFilled,
  })
}
