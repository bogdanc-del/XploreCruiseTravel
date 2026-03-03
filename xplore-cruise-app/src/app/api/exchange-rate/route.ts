import { NextResponse } from 'next/server'
import { getExchangeRate } from '@/lib/bnr-exchange-rate'

// ============================================================
// GET /api/exchange-rate
// Returns current EUR/RON exchange rate from BNR + margin
// Cached for 4 hours server-side, 1 hour on CDN
// ============================================================

export async function GET() {
  try {
    const data = await getExchangeRate()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (err) {
    console.error('[API] Exchange rate error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate' },
      { status: 500 },
    )
  }
}
