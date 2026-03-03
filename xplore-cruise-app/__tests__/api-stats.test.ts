import { describe, it, expect, vi, beforeEach } from 'vitest'

// ============================================================
// Unit tests for /api/stats route
// ============================================================

// Mock NextRequest / NextResponse
class MockNextRequest {
  url: string
  method: string
  private _body: unknown
  constructor(url: string, init?: { method?: string; body?: string }) {
    this.url = url
    this.method = init?.method || 'GET'
    this._body = init?.body ? JSON.parse(init.body) : null
  }
  async json() { return this._body }
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
let PUT: (req: unknown) => Promise<unknown>
let POST: (req: unknown) => Promise<unknown>
let DELETE: (req: unknown) => Promise<unknown>

beforeEach(async () => {
  vi.clearAllMocks()
  const mod = await import('../src/app/api/stats/route')
  GET = mod.GET as unknown as typeof GET
  PUT = mod.PUT as unknown as typeof PUT
  POST = mod.POST as unknown as typeof POST
  DELETE = mod.DELETE as unknown as typeof DELETE
})

describe('/api/stats GET', () => {
  it('returns demo stats when Supabase not configured', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats')
    await GET(req)

    expect(mockJson).toHaveBeenCalled()
    const call = mockJson.mock.calls[0]
    const body = call[0] as { stats: unknown[] }
    expect(body.stats).toHaveLength(4)
    expect(body.stats[0]).toHaveProperty('stat_key', 'cruises')
    expect(body.stats[0]).toHaveProperty('stat_value', 150)
  })

  it('returns stats with correct fields', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as { stats: Array<Record<string, unknown>> }
    const stat = body.stats[0]
    expect(stat).toHaveProperty('id')
    expect(stat).toHaveProperty('stat_key')
    expect(stat).toHaveProperty('stat_value')
    expect(stat).toHaveProperty('label_en')
    expect(stat).toHaveProperty('label_ro')
    expect(stat).toHaveProperty('suffix')
    expect(stat).toHaveProperty('sort_order')
    expect(stat).toHaveProperty('active')
  })

  it('returns all 4 default stats in correct order', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats')
    await GET(req)

    const body = mockJson.mock.calls[0][0] as { stats: Array<{ stat_key: string }> }
    const keys = body.stats.map((s) => s.stat_key)
    expect(keys).toEqual(['cruises', 'destinations', 'clients', 'years'])
  })

  it('includes cache headers', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats')
    await GET(req)

    const headers = mockJson.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers).toHaveProperty('Cache-Control')
    expect(headers['Cache-Control']).toContain('s-maxage')
  })
})

describe('/api/stats PUT', () => {
  it('rejects missing id', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'PUT',
      body: JSON.stringify({ stat_value: 200 }),
    })
    await PUT(req)

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Missing stat id' }),
      expect.objectContaining({ status: 400 }),
    )
  })

  it('updates stat in demo mode', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'PUT',
      body: JSON.stringify({ id: 'demo-1', stat_value: 200 }),
    })
    await PUT(req)

    const body = mockJson.mock.calls[0][0] as { stat: { stat_value: number } }
    expect(body.stat.stat_value).toBe(200)
  })

  it('returns 404 for non-existent demo id', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'PUT',
      body: JSON.stringify({ id: 'nonexistent', stat_value: 200 }),
    })
    await PUT(req)

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Stat not found' }),
      expect.objectContaining({ status: 404 }),
    )
  })

  it('rejects negative stat values', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'PUT',
      body: JSON.stringify({ id: 'demo-1', stat_value: -5 }),
    })
    await PUT(req)

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('non-negative') }),
      expect.objectContaining({ status: 400 }),
    )
  })
})

describe('/api/stats POST', () => {
  it('rejects missing required fields', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'POST',
      body: JSON.stringify({ stat_key: 'test' }),
    })
    await POST(req)

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('Missing required') }),
      expect.objectContaining({ status: 400 }),
    )
  })

  it('creates stat in demo mode', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        stat_key: 'ships',
        stat_value: 50,
        label_en: 'Ships',
        label_ro: 'Nave',
        suffix: '+',
      }),
    })
    await POST(req)

    const body = mockJson.mock.calls[0][0] as { stat: { stat_key: string; stat_value: number } }
    expect(body.stat.stat_key).toBe('ships')
    expect(body.stat.stat_value).toBe(50)
  })
})

describe('/api/stats DELETE', () => {
  it('rejects missing id parameter', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats')
    await DELETE(req)

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Missing id parameter' }),
      expect.objectContaining({ status: 400 }),
    )
  })

  it('succeeds in demo mode', async () => {
    const req = new MockNextRequest('http://localhost:3000/api/stats?id=demo-1')
    await DELETE(req)

    const body = mockJson.mock.calls[0][0] as { success: boolean }
    expect(body.success).toBe(true)
  })
})
