import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// Contact API — POST /api/contact
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name, email, phone, cruiseInterest, message, gdprConsent, locale,
      // Extended lead context fields
      cruiseSlug, cruiseTitle, cruisePrice, guidedContext, source,
    } = body

    // ----- Validation -----
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!gdprConsent) {
      return NextResponse.json(
        { error: 'GDPR consent is required' },
        { status: 400 }
      )
    }

    // ----- Supabase persistence (if configured) -----
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error: dbError } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        cruise_interest: cruiseInterest || null,
        message: message.trim(),
        gdpr_consent: gdprConsent,
        read: false,
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      })

      if (dbError) {
        console.error('Supabase contact insert error:', dbError)
        // Fall through to still return success
      }
    }

    // Log the contact message
    console.log(`[CONTACT] New message from ${name} (${email}):`, {
      phone,
      cruiseInterest,
      cruiseSlug: cruiseSlug || null,
      cruiseTitle: cruiseTitle || null,
      cruisePrice: cruisePrice || null,
      source: source || 'contact_page',
      hasGuidedContext: !!guidedContext,
      message: message.substring(0, 100),
      locale,
    })

    // Log guided context separately for consultant visibility
    if (guidedContext) {
      console.log(`[CONTACT] Guided context for ${email}:`, guidedContext)
    }

    return NextResponse.json({
      success: true,
      message:
        locale === 'ro'
          ? 'Mesajul a fost trimis cu succes! Revenim in curand.'
          : 'Message sent successfully! We\'ll get back to you soon.',
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
