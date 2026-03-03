import { describe, it, expect, vi, beforeEach } from 'vitest'

// ============================================================
// Unit tests for /api/ab-results route
// ============================================================

// Mock NextRequest / NextResponse
class MockNextRequest {
  url: string
  method: string
  constructor(url: string) {
    this.url = url
    this.method = 'GET'
  }
}

const mockJson = vi.fn((body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
  body,
  status: init?.status || 200,
  headers: init?.headers || {},
}))

vi.mock('next/server', () => ({
  NextRequest: MockNextRequest,
  NextResponse: { json: (body: unknown, init?: Record<string, unknown>) => mockJson(body, init) },
}))

// Ensure Supabase is NOT configured (demo mode)
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '')

let GET: (req: unknown) => Promise<unknown>

beforeEach(async () => {
  vi.clearAllMocks()
  const mod = await import('../src/app/api/ab-results/route')
  GET = mod.GET as unknown as typeof GET
})

describe('/api/ab-results GET', () => {
  it('returns demo results when Supabase not configured', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    expect(mockJson).toHaveBeenCalled()
    const body = mockJson.mock.calls[0][0] as {
      results: unknown[]
      isDemo: boolean
      totalImpressions: number
      totalClicks: number
    }
    expect(body.isDemo).toBe(true)
    expect(body.results).toHaveLength(3)
    expect(body.totalImpressions).toBeGreaterThan(0)
    expect(body.totalClicks).toBeGreaterThan(0)
  })

  it('returns results for all 3 variants', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      results: Array<{ variant: string; impressions: number; clicks: number; conversionRate: number }>
    }
    const variants = body.results.map((r) => r.variant)
    expect(variants).toEqual(['A', 'B', 'C'])
  })

  it('each variant has required fields', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      results: Array<Record<string, unknown>>
    }
    for (const result of body.results) {
      expect(result).toHaveProperty('variant')
      expect(result).toHaveProperty('impressions')
      expect(result).toHaveProperty('clicks')
      expect(result).toHaveProperty('conversionRate')
      expect(result).toHaveProperty('primaryClicks')
      expect(result).toHaveProperty('secondaryClicks')
    }
  })

  it('includes period information', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      period: { from: string; to: string; days: number }
    }
    expect(body.period).toBeDefined()
    expect(body.period.days).toBe(30) // default
    expect(body.period.from).toBeTruthy()
    expect(body.period.to).toBeTruthy()
  })

  it('respects days parameter', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results?days=7')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      period: { days: number }
    }
    expect(body.period.days).toBe(7)
  })

  it('clamps days to max 365', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results?days=999')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      period: { days: number }
    }
    expect(body.period.days).toBe(365)
  })

  it('defaults invalid days to 30', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results?days=abc')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      period: { days: number }
    }
    expect(body.period.days).toBe(30)
  })

  it('has correct overall conversion rate', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      totalImpressions: number
      totalClicks: number
      overallConversionRate: number
    }
    const expectedRate = Math.round((body.totalClicks / body.totalImpressions) * 1000) / 10
    expect(body.overallConversionRate).toBe(expectedRate)
  })

  it('includes cache headers', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const headers = mockJson.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers).toHaveProperty('Cache-Control')
    expect(headers['Cache-Control']).toContain('s-maxage')
  })

  it('demo data scales with days parameter', async () => {
    const req7 = new MockNextRequest('http://localhost:3000/api/ab-results?days=7')
    await GET(req7)
    const body7 = mockJson.mock.calls[0][0] as { totalImpressions: number }

    vi.clearAllMocks()

    const req90 = new MockNextRequest('http://localhost:3000/api/ab-results?days=90')
    await GET(req90)
    const body90 = mockJson.mock.calls[0][0] as { totalImpressions: number }

    // 90-day data should have more impressions than 7-day data
    expect(body90.totalImpressions).toBeGreaterThan(body7.totalImpressions)
  })

  it('all conversion rates are between 0 and 100', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/ab-results')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as {
      results: Array<{ conversionRate: number }>
      overallConversionRate: number
    }
    for (const result of body.results) {
      expect(result.conversionRate).toBeGreaterThanOrEqual(0)
      expect(result.conversionRate).toBeLessThanOrEqual(100)
    }
    expect(body.overallConversionRate).toBeGreaterThanOrEqual(0)
    expect(body.overallConversionRate).toBeLessThanOrEqual(100)
  })
})
