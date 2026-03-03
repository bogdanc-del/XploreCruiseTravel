import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// POST /api/events — Privacy-safe analytics event collector
//
// Stores events in Supabase `analytics_events` table.
// If Supabase is not configured, logs to console (dev mode).
// Returns 201 on success. No PII stored.
// ============================================================

// Rate limiter: simple in-memory counter per IP (max 100 events/min)
const ipCounts = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipCounts.get(ip)

  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  entry.count++
  return entry.count > 100
}

// Allowed event names (whitelist)
const ALLOWED_EVENTS = new Set([
  'cruises_list_view',
  'cruise_detail_view',
  'cta_click',
  'lead_submit_success',
  'contact_submit_success',
  'guided_start',
  'guided_step_complete',
  'guided_skip',
  'guided_optional_complete',
  'guided_complete',
  'guided_abandon',
  'guided_result_click',
  'guided_result_offer',
  'browse_filter_apply',
  'browse_guided_filters',
  'lead_form_open',
  'lead_form_submit',
  'lead_form_abandon',
])

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }

    const body = await request.json()

    // Validate event name
    const eventName = typeof body.event === 'string' ? body.event : ''
    if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
      return NextResponse.json(
        { error: 'Invalid event name' },
        { status: 400 },
      )
    }

    // Extract allowed fields (strip any PII that might have slipped through)
    const eventData: Record<string, unknown> = {
      event_name: eventName,
      timestamp: body.timestamp || new Date().toISOString(),
      url: typeof body.url === 'string' ? body.url.slice(0, 500) : null,
      locale: typeof body.locale === 'string' ? body.locale.slice(0, 5) : null,
      page: typeof body.page === 'string' ? body.page.slice(0, 200) : null,
      cruise_slug: typeof body.cruise_slug === 'string' ? body.cruise_slug.slice(0, 200) : null,
    }

    // Add safe extra params (no PII fields)
    const piiFields = new Set([
      'name', 'email', 'phone', 'address', 'password',
      'token', 'secret', 'api_key', 'ip', 'user_agent',
    ])
    const metadata: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(body)) {
      if (['event', 'timestamp', 'url', 'locale', 'page', 'cruise_slug'].includes(key)) continue
      if (piiFields.has(key.toLowerCase())) continue
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        metadata[key] = typeof value === 'string' ? value.slice(0, 200) : value
      }
    }
    eventData.metadata = metadata

    // Store in Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase.from('analytics_events').insert({
        event_name: eventData.event_name,
        url: eventData.url,
        locale: eventData.locale,
        page: eventData.page,
        cruise_slug: eventData.cruise_slug,
        metadata: eventData.metadata,
      })

      if (error) {
        // Log error but don't fail — table might not exist yet
        console.error('[EVENTS] Supabase insert error:', error.message)
      }
    } else {
      // Dev mode: log to console
      console.log(`[EVENT] ${eventName}`, metadata)
    }

    return NextResponse.json({ status: 'ok' }, { status: 201 })
  } catch (err) {
    console.error('[EVENTS] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
