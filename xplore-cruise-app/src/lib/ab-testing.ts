// ============================================================
// A/B Testing Utility — cookie-based variant assignment
// ============================================================

export type CTAVariant = 'A' | 'B' | 'C'

const COOKIE_NAME = 'xplore_cta_variant'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

// ---- Variant definitions ----
export interface VariantConfig {
  id: CTAVariant
  /** Primary CTA key (i18n) */
  primaryKey: string
  /** Secondary CTA key (i18n) */
  secondaryKey: string
  /** Primary button variant */
  primaryStyle: 'primary' | 'secondary' | 'ghost'
  /** Visual description for admin dashboard */
  description: string
}

export const CTA_VARIANTS: Record<CTAVariant, VariantConfig> = {
  A: {
    id: 'A',
    primaryKey: 'cta_request_offer',
    secondaryKey: 'cta_check_availability',
    primaryStyle: 'primary',
    description: 'Control: "Solicita oferta" gold button',
  },
  B: {
    id: 'B',
    primaryKey: 'cta_get_price',
    secondaryKey: 'cta_limited_spots',
    primaryStyle: 'primary',
    description: 'Value: "Obtine pret personalizat" + urgency text',
  },
  C: {
    id: 'C',
    primaryKey: 'cta_talk_expert',
    secondaryKey: 'cta_free_consultation',
    primaryStyle: 'primary',
    description: 'Expert: "Vorbeste cu un expert" + free consultation',
  },
}

// ---- Cookie helpers ----

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`
}

// ---- Assignment logic ----

/**
 * Get or assign a CTA variant for the current user.
 * Assignment is sticky (persisted in a 30-day cookie).
 * Distribution: equal 33.3% per variant.
 */
export function getAssignedVariant(): CTAVariant {
  // Check existing assignment
  const existing = getCookie(COOKIE_NAME)
  if (existing === 'A' || existing === 'B' || existing === 'C') {
    return existing
  }

  // New assignment — random with equal distribution
  const rand = Math.random()
  let variant: CTAVariant
  if (rand < 1 / 3) variant = 'A'
  else if (rand < 2 / 3) variant = 'B'
  else variant = 'C'

  setCookie(COOKIE_NAME, variant, COOKIE_MAX_AGE)
  return variant
}

/**
 * Get the variant config for the current user.
 */
export function getVariantConfig(): VariantConfig {
  return CTA_VARIANTS[getAssignedVariant()]
}

/**
 * Force a specific variant (for testing/admin preview).
 */
export function forceVariant(variant: CTAVariant): void {
  setCookie(COOKIE_NAME, variant, COOKIE_MAX_AGE)
}

/**
 * Clear variant assignment (for testing).
 */
export function clearVariant(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`
}
