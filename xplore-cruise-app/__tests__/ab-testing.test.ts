// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getAssignedVariant,
  getVariantConfig,
  forceVariant,
  clearVariant,
  CTA_VARIANTS,
  type CTAVariant,
} from '../src/lib/ab-testing'

// ============================================================
// Unit tests for A/B testing utility
// ============================================================

// Mock document.cookie
let cookieStore = ''

beforeEach(() => {
  cookieStore = ''
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get: () => cookieStore,
    set: (val: string) => {
      // Parse the cookie assignment
      const [pair] = val.split(';')
      const [name, value] = pair.split('=')
      if (val.includes('max-age=0')) {
        // Delete cookie
        const parts = cookieStore.split('; ').filter((c) => !c.startsWith(`${name}=`))
        cookieStore = parts.join('; ')
      } else {
        // Set cookie
        const parts = cookieStore.split('; ').filter((c) => c && !c.startsWith(`${name}=`))
        parts.push(`${name}=${value}`)
        cookieStore = parts.join('; ')
      }
    },
  })
})

describe('getAssignedVariant', () => {
  it('returns a valid variant (A, B, or C)', () => {
    const variant = getAssignedVariant()
    expect(['A', 'B', 'C']).toContain(variant)
  })

  it('returns the same variant on subsequent calls', () => {
    const v1 = getAssignedVariant()
    const v2 = getAssignedVariant()
    expect(v1).toBe(v2)
  })

  it('persists variant in cookie', () => {
    const variant = getAssignedVariant()
    expect(cookieStore).toContain(`xplore_cta_variant=${variant}`)
  })

  it('distributes among all 3 variants over many assignments', () => {
    const counts = { A: 0, B: 0, C: 0 }
    for (let i = 0; i < 300; i++) {
      clearVariant()
      vi.spyOn(Math, 'random').mockReturnValueOnce(i / 300)
      const v = getAssignedVariant()
      counts[v]++
    }
    vi.restoreAllMocks()
    // Each variant should get roughly 100 (allowing wide margin)
    expect(counts.A).toBeGreaterThan(50)
    expect(counts.B).toBeGreaterThan(50)
    expect(counts.C).toBeGreaterThan(50)
  })
})

describe('forceVariant', () => {
  it('forces variant A', () => {
    forceVariant('A')
    expect(getAssignedVariant()).toBe('A')
  })

  it('forces variant B', () => {
    forceVariant('B')
    expect(getAssignedVariant()).toBe('B')
  })

  it('forces variant C', () => {
    forceVariant('C')
    expect(getAssignedVariant()).toBe('C')
  })

  it('overrides existing variant', () => {
    forceVariant('A')
    expect(getAssignedVariant()).toBe('A')
    forceVariant('C')
    expect(getAssignedVariant()).toBe('C')
  })
})

describe('clearVariant', () => {
  it('clears the variant cookie', () => {
    forceVariant('B')
    expect(getAssignedVariant()).toBe('B')
    clearVariant()
    // After clear, a new variant is assigned (could be any)
    const newVariant = getAssignedVariant()
    expect(['A', 'B', 'C']).toContain(newVariant)
  })
})

describe('getVariantConfig', () => {
  it('returns valid config for assigned variant', () => {
    forceVariant('A')
    const config = getVariantConfig()
    expect(config.id).toBe('A')
    expect(config.primaryKey).toBe('cta_request_offer')
    expect(config.secondaryKey).toBe('cta_check_availability')
  })

  it('returns variant B config', () => {
    forceVariant('B')
    const config = getVariantConfig()
    expect(config.id).toBe('B')
    expect(config.primaryKey).toBe('cta_get_price')
    expect(config.secondaryKey).toBe('cta_limited_spots')
  })

  it('returns variant C config', () => {
    forceVariant('C')
    const config = getVariantConfig()
    expect(config.id).toBe('C')
    expect(config.primaryKey).toBe('cta_talk_expert')
    expect(config.secondaryKey).toBe('cta_free_consultation')
  })
})

describe('CTA_VARIANTS', () => {
  it('has exactly 3 variants', () => {
    expect(Object.keys(CTA_VARIANTS)).toHaveLength(3)
  })

  it('all variants have required properties', () => {
    for (const key of ['A', 'B', 'C'] as CTAVariant[]) {
      const v = CTA_VARIANTS[key]
      expect(v).toHaveProperty('id', key)
      expect(v).toHaveProperty('primaryKey')
      expect(v).toHaveProperty('secondaryKey')
      expect(v).toHaveProperty('primaryStyle')
      expect(v).toHaveProperty('description')
      expect(v.primaryKey).toBeTruthy()
      expect(v.secondaryKey).toBeTruthy()
    }
  })

  it('variant A is the control with original CTA keys', () => {
    expect(CTA_VARIANTS.A.primaryKey).toBe('cta_request_offer')
    expect(CTA_VARIANTS.A.secondaryKey).toBe('cta_check_availability')
  })
})
