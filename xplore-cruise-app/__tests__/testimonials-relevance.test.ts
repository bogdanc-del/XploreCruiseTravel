import { describe, it, expect } from 'vitest'

// ============================================================
// Unit tests for testimonials relevance selection logic
// This mirrors the getRelevantTestimonials from /api/testimonials
// ============================================================

interface Testimonial {
  id: string
  name: string
  city: string | null
  rating: number
  quote: string
  tags: string[]
  active: boolean
  sort_order: number
  created_at: string
}

function getRelevantTestimonials(
  testimonials: Testimonial[],
  searchTags: string[],
  limit: number,
): Testimonial[] {
  const scored = testimonials.map((t) => {
    const overlap = t.tags.filter((tag) =>
      searchTags.some((st) => st.toLowerCase() === tag.toLowerCase()),
    ).length
    return { testimonial: t, score: overlap }
  })

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.testimonial.sort_order !== b.testimonial.sort_order) {
      return a.testimonial.sort_order - b.testimonial.sort_order
    }
    return new Date(b.testimonial.created_at).getTime() - new Date(a.testimonial.created_at).getTime()
  })

  return scored.slice(0, limit).map((s) => s.testimonial)
}

const testimonials: Testimonial[] = [
  {
    id: 't1', name: 'Maria', city: 'București', rating: 5,
    quote: 'Great mediterranean cruise!',
    tags: ['ocean', 'mediterranean', 'romantic', 'couples'],
    active: true, sort_order: 1, created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 't2', name: 'Alex', city: 'Cluj', rating: 5,
    quote: 'Family caribbean trip!',
    tags: ['ocean', 'family', 'caribbean', 'msc-cruises'],
    active: true, sort_order: 2, created_at: '2026-01-10T14:30:00Z',
  },
  {
    id: 't3', name: 'Elena', city: 'Timișoara', rating: 5,
    quote: 'River Danube was amazing!',
    tags: ['river', 'danube', 'europe', 'relaxation'],
    active: true, sort_order: 3, created_at: '2026-01-05T09:15:00Z',
  },
  {
    id: 't4', name: 'Andrei', city: 'Iași', rating: 5,
    quote: 'Mediterranean family trip!',
    tags: ['ocean', 'mediterranean', 'family', 'royal-caribbean'],
    active: true, sort_order: 4, created_at: '2025-12-28T16:45:00Z',
  },
  {
    id: 't5', name: 'Cristina', city: 'Brașov', rating: 5,
    quote: 'Alaska adventure!',
    tags: ['ocean', 'alaska', 'adventure', 'norwegian'],
    active: true, sort_order: 5, created_at: '2025-12-20T11:00:00Z',
  },
  {
    id: 't6', name: 'George', city: 'Constanța', rating: 4,
    quote: 'Budget friendly!',
    tags: ['ocean', 'budget', 'costa-cruises'],
    active: true, sort_order: 6, created_at: '2025-12-15T08:30:00Z',
  },
]

describe('getRelevantTestimonials', () => {
  it('returns all when no tags match', () => {
    const result = getRelevantTestimonials(testimonials, ['non-existent-tag'], 3)
    expect(result).toHaveLength(3)
    // Falls back to sort_order
    expect(result[0].id).toBe('t1')
    expect(result[1].id).toBe('t2')
    expect(result[2].id).toBe('t3')
  })

  it('prioritizes testimonials with matching tags', () => {
    const result = getRelevantTestimonials(testimonials, ['mediterranean'], 3)
    // t1 and t4 both have 'mediterranean', should come first
    expect(result[0].id).toBe('t1') // sort_order=1, 1 match
    expect(result[1].id).toBe('t4') // sort_order=4, 1 match
    // third is next by sort_order with 0 matches
    expect(result[2].id).toBe('t2')
  })

  it('ranks higher overlap above lower overlap', () => {
    const result = getRelevantTestimonials(
      testimonials,
      ['ocean', 'mediterranean', 'family'],
      3,
    )
    // t4 has 3 matching tags (ocean, mediterranean, family)
    // t1 has 2 matching tags (ocean, mediterranean)
    // t2 has 2 matching tags (ocean, family)
    expect(result[0].id).toBe('t4') // 3 matches
    // t1 and t2 both have 2 matches — t1 wins by sort_order
    expect(result[1].id).toBe('t1')
    expect(result[2].id).toBe('t2')
  })

  it('respects limit parameter', () => {
    const result = getRelevantTestimonials(testimonials, ['ocean'], 2)
    expect(result).toHaveLength(2)
  })

  it('handles empty testimonials array', () => {
    const result = getRelevantTestimonials([], ['ocean'], 3)
    expect(result).toHaveLength(0)
  })

  it('handles empty searchTags', () => {
    const result = getRelevantTestimonials(testimonials, [], 3)
    expect(result).toHaveLength(3)
    // Falls back to sort_order
    expect(result[0].id).toBe('t1')
  })

  it('is case-insensitive for tag matching', () => {
    const result = getRelevantTestimonials(testimonials, ['MEDITERRANEAN', 'Ocean'], 3)
    // Should match 'mediterranean' and 'ocean'
    expect(result[0].id).toBe('t1') // ocean+mediterranean = 2 matches
    expect(result[1].id).toBe('t4') // ocean+mediterranean = 2 matches
  })

  it('uses sort_order as secondary sort for equal scores', () => {
    // t1, t2, t5, t6 all have 'ocean' tag
    const result = getRelevantTestimonials(testimonials, ['ocean'], 6)
    // t1 (sort=1), t2 (sort=2), t4 (sort=4), t5 (sort=5), t6 (sort=6) all have ocean
    // They should be ordered by sort_order within the same score
    const oceanResults = result.filter(
      (t) => t.tags.includes('ocean'),
    )
    for (let i = 1; i < oceanResults.length; i++) {
      expect(oceanResults[i].sort_order).toBeGreaterThanOrEqual(
        oceanResults[i - 1].sort_order,
      )
    }
  })

  it('returns river-related testimonials for river cruise', () => {
    const result = getRelevantTestimonials(testimonials, ['river', 'danube'], 3)
    // t3 has both 'river' and 'danube' = 2 matches
    expect(result[0].id).toBe('t3')
  })

  it('returns adventure testimonials for adventure cruise', () => {
    const result = getRelevantTestimonials(testimonials, ['adventure', 'alaska'], 3)
    // t5 has both 'adventure' and 'alaska' = 2 matches
    expect(result[0].id).toBe('t5')
  })
})
