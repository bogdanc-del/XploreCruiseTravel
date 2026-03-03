import { describe, it, expect } from 'vitest'
import { ReviewSubmitSchema } from '../src/lib/reviews-validation'

describe('ReviewSubmitSchema', () => {
  const validReview = {
    rating: 5,
    name: 'Maria I.',
    city: 'București',
    cruise_type: 'ocean',
    message: 'This was an amazing cruise experience!',
    consent_publish: true as const,
    website: '',
  }

  it('accepts a valid review with all fields', () => {
    const result = ReviewSubmitSchema.safeParse(validReview)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rating).toBe(5)
      expect(result.data.name).toBe('Maria I.')
      expect(result.data.message).toBe('This was an amazing cruise experience!')
    }
  })

  it('accepts a minimal review (only required fields)', () => {
    const result = ReviewSubmitSchema.safeParse({
      rating: 3,
      message: 'Good experience overall.',
      consent_publish: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBeNull()
      expect(result.data.city).toBeNull()
      expect(result.data.cruise_type).toBeNull()
    }
  })

  it('trims whitespace from name, city, and message', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      name: '  Maria  ',
      city: '  București  ',
      message: '  Great cruise!  Nice.  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Maria')
      expect(result.data.city).toBe('București')
      expect(result.data.message).toBe('Great cruise!  Nice.')
    }
  })

  it('converts empty name/city to null', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      name: '   ',
      city: '',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBeNull()
      expect(result.data.city).toBeNull()
    }
  })

  // --- Validation failures ---

  it('rejects rating below 1', () => {
    const result = ReviewSubmitSchema.safeParse({ ...validReview, rating: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects rating above 5', () => {
    const result = ReviewSubmitSchema.safeParse({ ...validReview, rating: 6 })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer rating', () => {
    const result = ReviewSubmitSchema.safeParse({ ...validReview, rating: 3.5 })
    expect(result.success).toBe(false)
  })

  it('rejects message shorter than 10 characters', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      message: 'Short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects message longer than 2000 characters', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      message: 'A'.repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it('rejects when consent_publish is false', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      consent_publish: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects when consent_publish is missing', () => {
    const { consent_publish: _, ...noConsent } = validReview
    void _
    const result = ReviewSubmitSchema.safeParse(noConsent)
    expect(result.success).toBe(false)
  })

  it('rejects honeypot field with content (bot detection)', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      website: 'http://spam.com',
    })
    expect(result.success).toBe(false)
  })

  it('rejects name longer than 100 characters', () => {
    const result = ReviewSubmitSchema.safeParse({
      ...validReview,
      name: 'A'.repeat(101),
    })
    expect(result.success).toBe(false)
  })

  it('accepts null for optional fields', () => {
    const result = ReviewSubmitSchema.safeParse({
      rating: 4,
      name: null,
      city: null,
      cruise_type: null,
      message: 'Very nice cruise experience!',
      consent_publish: true,
    })
    expect(result.success).toBe(true)
  })
})
