'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/i18n/context'
import type { Review } from '@/lib/reviews-validation'

// ============================================================
// Admin Reviews Section — list, approve, reject, delete, export
// ============================================================

type Filter = 'all' | 'pending' | 'approved'

export default function AdminReviews() {
  const { locale } = useLocale()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('pending')
  const [siteUrl] = useState(() => {
    if (typeof window !== 'undefined') return window.location.origin
    return 'https://xplorecruisetravel.com'
  })

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (
        !supabaseUrl ||
        !supabaseKey ||
        supabaseUrl.includes('placeholder') ||
        supabaseUrl === 'https://your-project.supabase.co'
      ) {
        // Demo data
        setReviews(getDemoReviews())
        setLoading(false)
        return
      }

      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch reviews:', error)
        setReviews(getDemoReviews())
      } else {
        setReviews((data as Review[]) || [])
      }
    } catch {
      setReviews(getDemoReviews())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const updateApproval = async (id: string, approved: boolean) => {
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved } : r)),
    )

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.from('reviews').update({ approved }).eq('id', id)
      }
    } catch (err) {
      console.error('Failed to update review:', err)
    }
  }

  const deleteReview = async (id: string) => {
    if (!confirm(locale === 'ro' ? 'Sigur dorești să ștergi?' : 'Are you sure you want to delete?')) return

    setReviews((prev) => prev.filter((r) => r.id !== id))

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.from('reviews').delete().eq('id', id)
      }
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Rating', 'Name', 'City', 'Cruise Type', 'Message', 'Approved', 'Source', 'Created At']
    const rows = filteredReviews.map((r) => [
      r.id,
      r.rating,
      r.name || '',
      r.city || '',
      r.cruise_type || '',
      `"${r.message.replace(/"/g, '""')}"`,
      r.approved ? 'Yes' : 'No',
      r.source,
      r.created_at,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.approved
    if (filter === 'approved') return r.approved
    return true
  })

  const pendingCount = reviews.filter((r) => !r.approved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-900">
          {locale === 'ro' ? 'Recenzii' : 'Reviews'}
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
              {pendingCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors"
          >
            {locale === 'ro' ? 'Export CSV' : 'Export CSV'}
          </button>
          <a
            href={`${siteUrl}/review`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gold-500 text-white hover:bg-gold-600 transition-colors"
          >
            {locale === 'ro' ? 'Vezi formularul' : 'View form'}
          </a>
        </div>
      </div>

      {/* QR Downloads */}
      <div className="bg-navy-50 rounded-xl border border-navy-100 p-4">
        <h4 className="text-sm font-semibold text-navy-900 mb-2">
          {locale === 'ro' ? 'Cod QR pentru recenzii' : 'Review QR Code'}
        </h4>
        <p className="text-xs text-navy-500 mb-3">
          {locale === 'ro'
            ? `URL: ${siteUrl}/review — Descarcă codul QR pentru a-l imprima.`
            : `URL: ${siteUrl}/review — Download the QR code for printing.`}
        </p>
        <div className="flex gap-2">
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl + '/review')}&format=png`}
            download="xplore-review-qr.png"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-white transition-colors"
          >
            PNG
          </a>
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(siteUrl + '/review')}&format=svg`}
            download="xplore-review-qr.svg"
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-navy-200 text-navy-600 hover:bg-white transition-colors"
          >
            SVG
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-navy-100 rounded-lg p-1">
        {(
          [
            { key: 'pending', label: locale === 'ro' ? 'În așteptare' : 'Pending' },
            { key: 'approved', label: locale === 'ro' ? 'Aprobate' : 'Approved' },
            { key: 'all', label: locale === 'ro' ? 'Toate' : 'All' },
          ] as { key: Filter; label: string }[]
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              filter === f.key
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-navy-500 hover:text-navy-700'
            }`}
          >
            {f.label}
            {f.key === 'pending' && pendingCount > 0 && (
              <span className="ml-1 text-red-500">({pendingCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-navy-100 p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-navy-400">
          <p>{locale === 'ro' ? 'Nicio recenzie găsită' : 'No reviews found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 transition-all ${
                review.approved
                  ? 'border-emerald-200'
                  : 'border-gold-300 ring-1 ring-gold-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${s <= review.rating ? 'text-gold-500' : 'text-navy-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      review.approved
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {review.approved
                      ? locale === 'ro' ? 'APROBAT' : 'APPROVED'
                      : locale === 'ro' ? 'ÎN AȘTEPTARE' : 'PENDING'}
                  </span>
                  <span className="text-[10px] text-navy-400 bg-navy-50 px-2 py-0.5 rounded-full">
                    {review.source}
                  </span>
                </div>
                <span className="text-xs text-navy-400">
                  {new Date(review.created_at).toLocaleDateString(
                    locale === 'ro' ? 'ro-RO' : 'en-GB',
                    { day: 'numeric', month: 'short', year: 'numeric' },
                  )}
                </span>
              </div>

              <p className="text-sm text-navy-700 leading-relaxed mb-2">
                {review.message}
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-navy-500">
                  {review.name || (locale === 'ro' ? 'Anonim' : 'Anonymous')}
                  {review.city && ` — ${review.city}`}
                  {review.cruise_type && (
                    <span className="ml-2 bg-navy-100 px-1.5 py-0.5 rounded text-navy-500">
                      {review.cruise_type}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!review.approved ? (
                    <button
                      onClick={() => updateApproval(review.id, true)}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {locale === 'ro' ? 'Aproba' : 'Approve'}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateApproval(review.id, false)}
                      className="text-xs font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      {locale === 'ro' ? 'Revoca' : 'Revoke'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    {locale === 'ro' ? 'Sterge' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Demo reviews for when Supabase is not configured
function getDemoReviews(): Review[] {
  return [
    {
      id: 'demo-1', rating: 5, name: 'Maria I.', city: 'București',
      cruise_type: 'ocean', message: 'Experiență fantastică!',
      consent_publish: true, approved: true, source: 'qr',
      created_at: '2026-02-15T10:00:00Z',
    },
    {
      id: 'demo-2', rating: 4, name: 'Alex P.', city: 'Cluj',
      cruise_type: 'river', message: 'Foarte mulțumit de servicii. Recomand!',
      consent_publish: true, approved: false, source: 'direct',
      created_at: '2026-03-01T08:00:00Z',
    },
  ]
}
