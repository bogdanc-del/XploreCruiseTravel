import { NextRequest, NextResponse } from 'next/server'

// ============================================================
// Booking API — POST /api/booking
// ============================================================

function generateBookingRef(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `BK-${date}-${code}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      firstName,
      lastName,
      dob,
      email,
      phone,
      cabinPreference,
      passengers,
      specialRequests,
      gdprConsent,
      termsAccepted,
      marketingConsent,
      cruiseTitle,
      cruiseSlug,
      locale,
    } = body

    // ----- Validation -----
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!gdprConsent || !termsAccepted) {
      return NextResponse.json(
        { error: 'GDPR consent and terms acceptance are required' },
        { status: 400 }
      )
    }

    const bookingRef = generateBookingRef()

    // ----- Supabase persistence (if configured) -----
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error: dbError } = await supabase.from('bookings').insert({
        booking_ref: bookingRef,
        cruise_title: cruiseTitle || 'General Inquiry',
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        date_of_birth: dob || null,
        cabin_preference: cabinPreference || null,
        passengers: passengers || 1,
        special_requests: specialRequests || null,
        gdpr_consent: gdprConsent,
        terms_accepted: termsAccepted,
        marketing_consent: marketingConsent || false,
        status: 'pending',
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      })

      if (dbError) {
        console.error('Supabase booking insert error:', dbError)
        // Fall through to still return success — booking ref is generated
      }
    }

    // ----- Email notification (optional — uses a simple fetch to an external service) -----
    // For now we just log. A real implementation could use SendGrid, Resend, etc.
    console.log(`[BOOKING] New booking ${bookingRef}:`, {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      cruise: cruiseTitle,
      cabin: cabinPreference,
      passengers,
      locale,
    })

    return NextResponse.json({
      success: true,
      bookingRef,
      message:
        locale === 'ro'
          ? `Rezervarea ${bookingRef} a fost inregistrata cu succes!`
          : `Booking ${bookingRef} has been registered successfully!`,
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
