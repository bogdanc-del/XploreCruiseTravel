import { NextRequest, NextResponse } from 'next/server'
import { ReviewSubmitSchema } from '@/lib/reviews-validation'

// ============================================================
// POST /api/reviews — Public review submission
// GET  /api/reviews — Public approved reviews
// ============================================================

// Rate limiter: max 5 submissions per IP per hour
const ipSubmits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipSubmits.get(ip)

  if (!entry || now > entry.resetAt) {
    ipSubmits.set(ip, { count: 1, resetAt: now + 3600_000 }) // 1 hour
    return false
  }

  entry.count++
  return entry.count > 5
}

// --- POST: Submit a review ---
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const parsed = ReviewSubmitSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { website: _honeypot, ...reviewData } = parsed.data

    // Determine source from referer or explicit param
    const source = body.source === 'direct' ? 'direct' : 'qr'

    // Store in Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('placeholder') &&
      supabaseUrl !== 'https://your-project.supabase.co'
    ) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error: dbError } = await supabase.from('reviews').insert({
        rating: reviewData.rating,
        name: reviewData.name,
        city: reviewData.city,
        cruise_type: reviewData.cruise_type,
        message: reviewData.message,
        consent_publish: reviewData.consent_publish,
        approved: false,
        source,
      })

      if (dbError) {
        console.error('[REVIEWS] Supabase insert error:', dbError.message)
      }
    }

    // Log for dev
    console.log(`[REVIEW] New review (${source}): rating=${reviewData.rating}`, {
      name: reviewData.name || 'anonymous',
      city: reviewData.city,
      cruise_type: reviewData.cruise_type,
      messageLength: reviewData.message.length,
    })

    return NextResponse.json(
      { success: true, message: 'Review submitted for moderation' },
      { status: 201 },
    )
  } catch (err) {
    console.error('[REVIEWS] POST error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// --- GET: Approved reviews ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '6', 10),
      20,
    )
    const cruiseType = searchParams.get('cruise_type') || null

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (
      !supabaseUrl ||
      !supabaseKey ||
      supabaseUrl.includes('placeholder') ||
      supabaseUrl === 'https://your-project.supabase.co'
    ) {
      // Return demo reviews when Supabase not configured
      return NextResponse.json(
        { reviews: getDemoReviews(limit, cruiseType) },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        },
      )
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
      .from('reviews')
      .select('id, rating, name, city, cruise_type, message, created_at')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cruiseType) {
      query = query.eq('cruise_type', cruiseType)
    }

    const { data, error } = await query

    if (error) {
      console.error('[REVIEWS] GET error:', error.message)
      return NextResponse.json(
        { reviews: getDemoReviews(limit, cruiseType) },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        },
      )
    }

    return NextResponse.json(
      { reviews: data || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    )
  } catch (err) {
    console.error('[REVIEWS] GET error:', err)
    return NextResponse.json({ reviews: [] }, { status: 500 })
  }
}

// Demo reviews for when Supabase is not configured
function getDemoReviews(limit: number, cruiseType: string | null) {
  const demo = [
    {
      id: 'demo-1',
      rating: 5,
      name: 'Maria I.',
      city: 'București',
      cruise_type: 'ocean',
      message:
        'O experiență extraordinară! Echipa XploreCruiseTravel ne-a ajutat să găsim croaziera perfectă pentru luna noastră de miere.',
      created_at: '2026-02-15T10:00:00Z',
    },
    {
      id: 'demo-2',
      rating: 5,
      name: 'Alexandru P.',
      city: 'Cluj-Napoca',
      cruise_type: 'luxury',
      message:
        'Profesionalism desăvârșit. Consultanța personalizată a făcut diferența. Vom reveni cu siguranță!',
      created_at: '2026-02-10T14:30:00Z',
    },
    {
      id: 'demo-3',
      rating: 4,
      name: 'Elena D.',
      city: 'Timișoara',
      cruise_type: 'river',
      message:
        'Croaziera pe Dunăre a fost minunată. Recomand cu căldură serviciile lor pentru oricine caută o vacanță de vis.',
      created_at: '2026-02-05T09:15:00Z',
    },
    {
      id: 'demo-4',
      rating: 5,
      name: 'Andrei V.',
      city: 'Iași',
      cruise_type: 'ocean',
      message:
        'Am călătorit cu familia în Mediterana. Totul a fost organizat impecabil, de la transfer până la excursii.',
      created_at: '2026-01-28T16:45:00Z',
    },
    {
      id: 'demo-5',
      rating: 5,
      name: 'Cristina M.',
      city: 'Brașov',
      cruise_type: 'expedition',
      message:
        'Experiența din Alaska a depășit toate așteptările. Mulțumim pentru recomandarea perfectă!',
      created_at: '2026-01-20T11:00:00Z',
    },
    {
      id: 'demo-6',
      rating: 4,
      name: 'George S.',
      city: 'Constanța',
      cruise_type: 'ocean',
      message:
        'Serviciu excelent, prețuri competitive. Am economisit semnificativ față de alte agenții.',
      created_at: '2026-01-15T08:30:00Z',
    },
  ]

  let filtered = cruiseType
    ? demo.filter((r) => r.cruise_type === cruiseType)
    : demo

  if (filtered.length === 0) filtered = demo

  return filtered.slice(0, limit)
}
