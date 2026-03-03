import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// GET /api/stats  — public homepage trust metrics
// PUT /api/stats  — admin update stat values
// ============================================================

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
}

// Demo stats when Supabase is not configured
const DEMO_STATS = [
  { id: 'demo-1', stat_key: 'cruises', stat_value: 150, label_en: 'Cruise Offers', label_ro: 'Oferte Croaziere', suffix: '+', sort_order: 1, active: true, updated_at: '2026-01-01T00:00:00Z' },
  { id: 'demo-2', stat_key: 'destinations', stat_value: 25, label_en: 'Destinations', label_ro: 'Destinatii', suffix: '+', sort_order: 2, active: true, updated_at: '2026-01-01T00:00:00Z' },
  { id: 'demo-3', stat_key: 'clients', stat_value: 500, label_en: 'Happy Clients', label_ro: 'Clienti Multumiti', suffix: '+', sort_order: 3, active: true, updated_at: '2026-01-01T00:00:00Z' },
  { id: 'demo-4', stat_key: 'years', stat_value: 10, label_en: 'Years Experience', label_ro: 'Ani Experienta', suffix: '+', sort_order: 4, active: true, updated_at: '2026-01-01T00:00:00Z' },
]

interface SiteStat {
  id: string
  stat_key: string
  stat_value: number
  label_en: string
  label_ro: string
  suffix: string
  sort_order: number
  active: boolean
  updated_at: string
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return false
  if (url.includes('placeholder') || url === 'https://your-project.supabase.co') return false
  return true
}

async function getSupabaseClient() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// ============================================================
// GET /api/stats
// Returns active site stats sorted by sort_order
// Query params:
//   all=1  — return all stats (including inactive) for admin
// ============================================================
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const showAll = searchParams.get('all') === '1'

  if (!isSupabaseConfigured()) {
    const stats = showAll
      ? DEMO_STATS
      : DEMO_STATS.filter((s) => s.active)
    return NextResponse.json({ stats }, { headers: CACHE_HEADERS })
  }

  try {
    const supabase = await getSupabaseClient()
    let query = supabase
      .from('site_stats')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!showAll) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase stats error:', error)
      return NextResponse.json({ stats: DEMO_STATS }, { headers: CACHE_HEADERS })
    }

    return NextResponse.json(
      { stats: (data as SiteStat[]) || DEMO_STATS },
      { headers: CACHE_HEADERS },
    )
  } catch (err) {
    console.error('Stats GET error:', err)
    return NextResponse.json({ stats: DEMO_STATS }, { headers: CACHE_HEADERS })
  }
}

// ============================================================
// PUT /api/stats
// Admin: update stat value, labels, active status
// Body: { id, stat_value?, label_en?, label_ro?, suffix?, sort_order?, active? }
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing stat id' },
        { status: 400 },
      )
    }

    // Validate stat_value is a positive integer if provided
    if (updates.stat_value !== undefined) {
      const val = Number(updates.stat_value)
      if (!Number.isFinite(val) || val < 0) {
        return NextResponse.json(
          { error: 'stat_value must be a non-negative number' },
          { status: 400 },
        )
      }
      updates.stat_value = Math.round(val)
    }

    if (!isSupabaseConfigured()) {
      // Demo mode — return success with merged data
      const existing = DEMO_STATS.find((s) => s.id === id)
      if (!existing) {
        return NextResponse.json({ error: 'Stat not found' }, { status: 404 })
      }
      return NextResponse.json({
        stat: { ...existing, ...updates, updated_at: new Date().toISOString() },
      })
    }

    const supabase = await getSupabaseClient()

    // Only allow safe fields
    const safeUpdates: Record<string, unknown> = {}
    const allowedFields = ['stat_value', 'label_en', 'label_ro', 'suffix', 'sort_order', 'active']
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key]
      }
    }

    const { data, error } = await supabase
      .from('site_stats')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Stats update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ stat: data })
  } catch (err) {
    console.error('Stats PUT error:', err)
    return NextResponse.json(
      { error: 'Failed to update stat' },
      { status: 500 },
    )
  }
}

// ============================================================
// POST /api/stats
// Admin: create a new stat
// Body: { stat_key, stat_value, label_en, label_ro, suffix?, sort_order? }
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.stat_key || !body.label_en || !body.label_ro) {
      return NextResponse.json(
        { error: 'Missing required fields: stat_key, label_en, label_ro' },
        { status: 400 },
      )
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        stat: {
          id: `demo-${Date.now()}`,
          stat_key: body.stat_key,
          stat_value: Number(body.stat_value) || 0,
          label_en: body.label_en,
          label_ro: body.label_ro,
          suffix: body.suffix || '+',
          sort_order: Number(body.sort_order) || 99,
          active: true,
          updated_at: new Date().toISOString(),
        },
      })
    }

    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from('site_stats')
      .insert({
        stat_key: body.stat_key,
        stat_value: Number(body.stat_value) || 0,
        label_en: body.label_en,
        label_ro: body.label_ro,
        suffix: body.suffix || '+',
        sort_order: Number(body.sort_order) || 99,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Stats create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ stat: data }, { status: 201 })
  } catch (err) {
    console.error('Stats POST error:', err)
    return NextResponse.json(
      { error: 'Failed to create stat' },
      { status: 500 },
    )
  }
}

// ============================================================
// DELETE /api/stats?id=xxx
// Admin: delete a stat
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true })
  }

  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase
      .from('site_stats')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Stats delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Stats DELETE error:', err)
    return NextResponse.json(
      { error: 'Failed to delete stat' },
      { status: 500 },
    )
  }
}
