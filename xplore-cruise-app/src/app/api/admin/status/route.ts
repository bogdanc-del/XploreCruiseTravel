import { NextResponse } from 'next/server'
import { isEmailConfigured } from '@/lib/email'

// ============================================================
// Admin Status API — returns integration status
// GET /api/admin/status
//
// Used by the admin dashboard to show live integration health.
// ============================================================

export async function GET() {
  return NextResponse.json({
    integrations: {
      supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'),
      claude: !!process.env.ANTHROPIC_API_KEY,
      email: isEmailConfigured(),
      analytics: !!process.env.NEXT_PUBLIC_GA_ID,
    },
  })
}
