import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// GET  /api/testimonials — Public active testimonials
// POST /api/testimonials — Admin create testimonial
// PUT  /api/testimonials — Admin update testimonial
// ============================================================

export interface Testimonial {
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

// --- GET: Active testimonials (public) ---
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '6', 10), 20)
    const tags = searchParams.get('tags') // comma-separated tags for relevance
    const includeInactive = searchParams.get('all') === '1' // admin mode

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
      // Return demo testimonials when Supabase not configured
      const demos = getDemoTestimonials()
      const result = tags
        ? getRelevantTestimonials(demos, tags.split(','), limit)
        : demos.slice(0, limit)

      return NextResponse.json(
        { testimonials: result },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
          },
        },
      )
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!includeInactive) {
      query = query.eq('active', true)
    }

    // If tags provided, get more than needed so we can filter by relevance
    const fetchLimit = tags ? Math.min(limit * 3, 50) : limit
    query = query.limit(fetchLimit)

    const { data, error } = await query

    if (error) {
      console.error('[TESTIMONIALS] GET error:', error.message)
      return NextResponse.json(
        { testimonials: getDemoTestimonials().slice(0, limit) },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          },
        },
      )
    }

    let result = (data as Testimonial[]) || []

    // Filter by tag relevance if tags provided
    if (tags && result.length > 0) {
      result = getRelevantTestimonials(result, tags.split(','), limit)
    } else {
      result = result.slice(0, limit)
    }

    return NextResponse.json(
      { testimonials: result },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      },
    )
  } catch (err) {
    console.error('[TESTIMONIALS] GET error:', err)
    return NextResponse.json({ testimonials: [] }, { status: 500 })
  }
}

// --- POST: Admin create testimonial ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.quote || !body.rating) {
      return NextResponse.json(
        { error: 'name, quote, and rating are required' },
        { status: 400 },
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      )
    }

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
      // Demo mode — pretend success
      return NextResponse.json(
        {
          success: true,
          testimonial: {
            id: `demo-${Date.now()}`,
            name: body.name,
            city: body.city || null,
            rating: body.rating,
            quote: body.quote,
            tags: body.tags || [],
            active: body.active !== false,
            sort_order: body.sort_order || 0,
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 },
      )
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        name: body.name.trim(),
        city: body.city?.trim() || null,
        rating: body.rating,
        quote: body.quote.trim(),
        tags: body.tags || [],
        active: body.active !== false,
        sort_order: body.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[TESTIMONIALS] POST error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, testimonial: data }, { status: 201 })
  } catch (err) {
    console.error('[TESTIMONIALS] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// --- PUT: Admin update testimonial ---
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

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
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const updateFields: Record<string, unknown> = {}
    if (body.name !== undefined) updateFields.name = body.name.trim()
    if (body.city !== undefined) updateFields.city = body.city?.trim() || null
    if (body.rating !== undefined) updateFields.rating = body.rating
    if (body.quote !== undefined) updateFields.quote = body.quote.trim()
    if (body.tags !== undefined) updateFields.tags = body.tags
    if (body.active !== undefined) updateFields.active = body.active
    if (body.sort_order !== undefined) updateFields.sort_order = body.sort_order

    const { error } = await supabase
      .from('testimonials')
      .update(updateFields)
      .eq('id', body.id)

    if (error) {
      console.error('[TESTIMONIALS] PUT error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[TESTIMONIALS] PUT error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// --- DELETE: Admin delete testimonial ---
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

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
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('testimonials').delete().eq('id', id)

    if (error) {
      console.error('[TESTIMONIALS] DELETE error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[TESTIMONIALS] DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ============================================================
// Relevance-based selection (for cruise detail pages)
// ============================================================

function getRelevantTestimonials(
  testimonials: Testimonial[],
  searchTags: string[],
  limit: number,
): Testimonial[] {
  // Score each testimonial by tag overlap
  const scored = testimonials.map((t) => {
    const overlap = t.tags.filter((tag) =>
      searchTags.some((st) => st.toLowerCase() === tag.toLowerCase()),
    ).length
    return { testimonial: t, score: overlap }
  })

  // Sort: most relevant first, then by sort_order, then by date
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.testimonial.sort_order !== b.testimonial.sort_order) {
      return a.testimonial.sort_order - b.testimonial.sort_order
    }
    return new Date(b.testimonial.created_at).getTime() - new Date(a.testimonial.created_at).getTime()
  })

  return scored.slice(0, limit).map((s) => s.testimonial)
}

// ============================================================
// Demo testimonials
// ============================================================

function getDemoTestimonials(): Testimonial[] {
  return [
    {
      id: 'demo-t1',
      name: 'Maria Ionescu',
      city: 'București',
      rating: 5,
      quote: 'O experienta extraordinara! Echipa XploreCruiseTravel ne-a ajutat sa gasim croaziera perfecta pentru luna noastra de miere. Serviciul a fost impecabil de la inceput pana la sfarsit.',
      tags: ['ocean', 'mediterranean', 'romantic', 'couples'],
      active: true,
      sort_order: 1,
      created_at: '2026-01-15T10:00:00Z',
    },
    {
      id: 'demo-t2',
      name: 'Alexandru Popescu',
      city: 'Cluj-Napoca',
      rating: 5,
      quote: 'Profesionalism desavarsit. Consultanta personalizata a facut diferenta. Au gasit cea mai buna oferta pentru familia noastra cu doi copii.',
      tags: ['ocean', 'family', 'caribbean', 'msc-cruises'],
      active: true,
      sort_order: 2,
      created_at: '2026-01-10T14:30:00Z',
    },
    {
      id: 'demo-t3',
      name: 'Elena Dragomir',
      city: 'Timisoara',
      rating: 5,
      quote: 'Croaziera pe Dunare a fost minunata. Echipa XploreCruiseTravel a organizat totul perfect, inclusiv transferurile si excursiile optionale.',
      tags: ['river', 'danube', 'europe', 'relaxation'],
      active: true,
      sort_order: 3,
      created_at: '2026-01-05T09:15:00Z',
    },
    {
      id: 'demo-t4',
      name: 'Andrei Voicu',
      city: 'Iasi',
      rating: 5,
      quote: 'Am calatorit cu familia in Mediterana. Totul a fost organizat impecabil, de la transfer pana la excursii. Copiii au fost incantati!',
      tags: ['ocean', 'mediterranean', 'family', 'royal-caribbean'],
      active: true,
      sort_order: 4,
      created_at: '2025-12-28T16:45:00Z',
    },
    {
      id: 'demo-t5',
      name: 'Cristina Manole',
      city: 'Brasov',
      rating: 5,
      quote: 'Experienta din Alaska a depasit toate asteptarile. Peisajele sunt spectaculoase, iar croaziera a fost de vis. Multumim pentru recomandarea perfecta!',
      tags: ['ocean', 'alaska', 'adventure', 'norwegian'],
      active: true,
      sort_order: 5,
      created_at: '2025-12-20T11:00:00Z',
    },
    {
      id: 'demo-t6',
      name: 'George Stefan',
      city: 'Constanta',
      rating: 4,
      quote: 'Serviciu excelent si preturi competitive. Am economisit semnificativ fata de alte agentii. Recomand cu caldura!',
      tags: ['ocean', 'budget', 'costa-cruises'],
      active: true,
      sort_order: 6,
      created_at: '2025-12-15T08:30:00Z',
    },
    {
      id: 'demo-t7',
      name: 'Ioana Radu',
      city: 'Sibiu',
      rating: 5,
      quote: 'A doua croaziera rezervata prin XploreCruiseTravel. De fiecare data, echipa a fost receptiva si profesionista. Vom reveni cu siguranta!',
      tags: ['luxury', 'mediterranean', 'returning-client'],
      active: true,
      sort_order: 7,
      created_at: '2025-12-10T13:20:00Z',
    },
    {
      id: 'demo-t8',
      name: 'Dan Mihai',
      city: 'Bucuresti',
      rating: 5,
      quote: 'Croaziera prin Fiordurile Norvegiene a fost o experienta unica. Natura spectaculoasa si serviciul de prima clasa au facut vacanta perfecta.',
      tags: ['ocean', 'norwegian-fjords', 'adventure', 'nature'],
      active: true,
      sort_order: 8,
      created_at: '2025-12-05T10:00:00Z',
    },
  ]
}
