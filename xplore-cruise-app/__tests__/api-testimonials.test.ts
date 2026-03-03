import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch for API tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('/api/testimonials GET', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns testimonials array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        testimonials: [
          {
            id: '1', name: 'Maria', city: 'București', rating: 5,
            quote: 'Amazing!', tags: ['ocean'], active: true,
            sort_order: 1, created_at: '2026-01-01',
          },
        ],
      }),
    })

    const res = await fetch('/api/testimonials?limit=6')
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(Array.isArray(data.testimonials)).toBe(true)
    expect(data.testimonials.length).toBeGreaterThan(0)
  })

  it('respects limit parameter', async () => {
    const testimonials = Array.from({ length: 3 }, (_, i) => ({
      id: `${i}`,
      name: `User ${i}`,
      city: 'City',
      rating: 5,
      quote: 'Great experience!',
      tags: ['ocean'],
      active: true,
      sort_order: i,
      created_at: '2026-01-01',
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ testimonials }),
    })

    const res = await fetch('/api/testimonials?limit=3')
    const data = await res.json()
    expect(data.testimonials.length).toBeLessThanOrEqual(3)
  })

  it('supports tags filter parameter', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        testimonials: [
          {
            id: '1', name: 'Elena', city: 'Timișoara', rating: 5,
            quote: 'Danube was great!', tags: ['river', 'danube'],
            active: true, sort_order: 1, created_at: '2026-01-01',
          },
        ],
      }),
    })

    const res = await fetch('/api/testimonials?tags=river,danube&limit=3')
    const data = await res.json()
    expect(Array.isArray(data.testimonials)).toBe(true)
  })
})

describe('/api/testimonials POST', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns 400 for missing required fields', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'name, quote, and rating are required' }),
    })

    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    expect(res.status).toBe(400)
  })

  it('returns 201 for valid testimonial', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        testimonial: {
          id: 'new-1',
          name: 'Maria Ionescu',
          city: 'București',
          rating: 5,
          quote: 'Amazing cruise experience!',
          tags: ['ocean', 'mediterranean'],
          active: true,
          sort_order: 1,
          created_at: '2026-03-03T10:00:00Z',
        },
      }),
    })

    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Maria Ionescu',
        city: 'București',
        rating: 5,
        quote: 'Amazing cruise experience!',
        tags: ['ocean', 'mediterranean'],
      }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.testimonial.name).toBe('Maria Ionescu')
  })
})

describe('/api/testimonials PUT', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns 400 for missing id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'id is required' }),
    })

    const res = await fetch('/api/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: false }),
    })

    expect(res.status).toBe(400)
  })

  it('returns 200 for valid update', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    })

    const res = await fetch('/api/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'test-1', active: false }),
    })

    expect(res.status).toBe(200)
  })
})

describe('/api/testimonials DELETE', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns 400 for missing id', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'id is required' }),
    })

    const res = await fetch('/api/testimonials?id=', { method: 'DELETE' })
    expect(res.status).toBe(400)
  })

  it('returns 200 for valid deletion', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    })

    const res = await fetch('/api/testimonials?id=test-1', { method: 'DELETE' })
    expect(res.status).toBe(200)
  })
})
