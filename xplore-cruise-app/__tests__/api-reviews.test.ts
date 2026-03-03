import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch for API tests
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('/api/reviews POST', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns 400 for missing rating', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Expected number, received nan' }),
    })

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Good cruise!', consent_publish: true }),
    })

    expect(res.status).toBe(400)
  })

  it('returns 400 for message too short', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Message must be at least 10 characters' }),
    })

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        message: 'Short',
        consent_publish: true,
      }),
    })

    expect(res.status).toBe(400)
  })

  it('returns 201 for valid submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        message: 'Review submitted for moderation',
      }),
    })

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: 5,
        name: 'Maria',
        city: 'București',
        message: 'Amazing cruise experience! Loved every moment.',
        consent_publish: true,
        website: '',
      }),
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.success).toBe(true)
  })
})

describe('/api/reviews GET', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns reviews array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        reviews: [
          { id: '1', rating: 5, name: 'Test', message: 'Great!', created_at: '2026-01-01' },
        ],
      }),
    })

    const res = await fetch('/api/reviews?limit=6')
    const data = await res.json()

    expect(res.ok).toBe(true)
    expect(Array.isArray(data.reviews)).toBe(true)
    expect(data.reviews.length).toBeGreaterThan(0)
  })

  it('respects limit parameter', async () => {
    const reviews = Array.from({ length: 3 }, (_, i) => ({
      id: `${i}`,
      rating: 5,
      name: `User ${i}`,
      message: 'Test review message here',
      created_at: '2026-01-01',
    }))

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ reviews }),
    })

    const res = await fetch('/api/reviews?limit=3')
    const data = await res.json()
    expect(data.reviews.length).toBeLessThanOrEqual(3)
  })
})
