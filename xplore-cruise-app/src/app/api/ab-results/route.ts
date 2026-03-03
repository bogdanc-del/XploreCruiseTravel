import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// GET /api/ab-results — A/B test results aggregation
//
// Returns impression/click counts per variant with conversion rates.
// When Supabase is configured, queries analytics_events table.
// Otherwise returns demo data for development.
//
// Query params:
//   days=7|30|90 (default 30) — lookback window
// ============================================================

interface VariantResult {
  variant: string
  impressions: number
  clicks: number
  conversionRate: number
  primaryClicks: number
  secondaryClicks: number
}

interface ABResultsResponse {
  results: VariantResult[]
  period: { from: string; to: string; days: number }
  totalImpressions: number
  totalClicks: number
  overallConversionRate: number
  isDemo: boolean
}

// Demo data for development when Supabase is not configured
function getDemoResults(days: number): ABResultsResponse {
  const to = new Date()
  const from = new Date(to.getTime() - days * 86400000)

  // Realistic-looking demo data with Variant A winning slightly
  const results: VariantResult[] = [
    {
      variant: 'A',
      impressions: Math.round(120 * (days / 30)),
      clicks: Math.round(18 * (days / 30)),
      conversionRate: 15.0,
      primaryClicks: Math.round(14 * (days / 30)),
      secondaryClicks: Math.round(4 * (days / 30)),
    },
    {
      variant: 'B',
      impressions: Math.round(115 * (days / 30)),
      clicks: Math.round(21 * (days / 30)),
      conversionRate: 18.3,
      primaryClicks: Math.round(17 * (days / 30)),
      secondaryClicks: Math.round(4 * (days / 30)),
    },
    {
      variant: 'C',
      impressions: Math.round(110 * (days / 30)),
      clicks: Math.round(14 * (days / 30)),
      conversionRate: 12.7,
      primaryClicks: Math.round(11 * (days / 30)),
      secondaryClicks: Math.round(3 * (days / 30)),
    },
  ]

  const totalImpressions = results.reduce((s, r) => s + r.impressions, 0)
  const totalClicks = results.reduce((s, r) => s + r.clicks, 0)

  return {
    results,
    period: {
      from: from.toISOString(),
      to: to.toISOString(),
      days,
    },
    totalImpressions,
    totalClicks,
    overallConversionRate: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0,
    isDemo: true,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days')
    const days = daysParam ? Math.min(Math.max(parseInt(daysParam, 10) || 30, 1), 365) : 30

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Return demo data if Supabase not configured
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json(getDemoResults(days), {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      })
    }

    // Query Supabase for real data
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const since = new Date(Date.now() - days * 86400000).toISOString()

    // Fetch impressions
    const { data: impressionRows, error: impError } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_name', 'cta_impression')
      .gte('created_at', since)

    if (impError) {
      console.error('[AB-RESULTS] Impressions query error:', impError.message)
      return NextResponse.json(getDemoResults(days))
    }

    // Fetch clicks
    const { data: clickRows, error: clickError } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_name', 'cta_click')
      .gte('created_at', since)

    if (clickError) {
      console.error('[AB-RESULTS] Clicks query error:', clickError.message)
      return NextResponse.json(getDemoResults(days))
    }

    // Aggregate by variant
    const variants = ['A', 'B', 'C']
    const impressionCounts: Record<string, number> = { A: 0, B: 0, C: 0 }
    const clickCounts: Record<string, number> = { A: 0, B: 0, C: 0 }
    const primaryClickCounts: Record<string, number> = { A: 0, B: 0, C: 0 }
    const secondaryClickCounts: Record<string, number> = { A: 0, B: 0, C: 0 }

    for (const row of impressionRows || []) {
      const variant = (row.metadata as Record<string, unknown>)?.variant
      if (typeof variant === 'string' && variants.includes(variant)) {
        impressionCounts[variant]++
      }
    }

    for (const row of clickRows || []) {
      const meta = row.metadata as Record<string, unknown>
      const variant = meta?.variant
      const ctaType = meta?.cta_type as string | undefined
      if (typeof variant === 'string' && variants.includes(variant)) {
        clickCounts[variant]++
        // Determine if primary or secondary based on cta_type
        if (ctaType && (ctaType.includes('offer') || ctaType.includes('price') || ctaType.includes('expert'))) {
          primaryClickCounts[variant]++
        } else {
          secondaryClickCounts[variant]++
        }
      }
    }

    const results: VariantResult[] = variants.map((v) => ({
      variant: v,
      impressions: impressionCounts[v],
      clicks: clickCounts[v],
      conversionRate:
        impressionCounts[v] > 0
          ? Math.round((clickCounts[v] / impressionCounts[v]) * 1000) / 10
          : 0,
      primaryClicks: primaryClickCounts[v],
      secondaryClicks: secondaryClickCounts[v],
    }))

    const totalImpressions = results.reduce((s, r) => s + r.impressions, 0)
    const totalClicks = results.reduce((s, r) => s + r.clicks, 0)

    const response: ABResultsResponse = {
      results,
      period: {
        from: since,
        to: new Date().toISOString(),
        days,
      },
      totalImpressions,
      totalClicks,
      overallConversionRate:
        totalImpressions > 0
          ? Math.round((totalClicks / totalImpressions) * 1000) / 10
          : 0,
      isDemo: false,
    }

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('[AB-RESULTS] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
