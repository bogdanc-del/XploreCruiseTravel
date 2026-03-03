'use client'

import { useLocale } from '@/i18n/context'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    name: string | null
    city: string | null
    cruise_type: string | null
    message: string
    created_at: string
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-gold-500' : 'text-navy-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { locale } = useLocale()

  const displayName = review.name || (locale === 'ro' ? 'Anonim' : 'Anonymous')
  const dateStr = new Date(review.created_at).toLocaleDateString(
    locale === 'ro' ? 'ro-RO' : 'en-GB',
    { month: 'short', year: 'numeric' },
  )

  return (
    <div className="bg-white rounded-xl border border-navy-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Stars + Date */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={review.rating} />
        <span className="text-xs text-navy-400">{dateStr}</span>
      </div>

      {/* Message */}
      <p className="text-sm text-navy-700 leading-relaxed line-clamp-4 mb-4">
        &ldquo;{review.message}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white text-xs font-bold">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-900">{displayName}</p>
          {review.city && (
            <p className="text-xs text-navy-400">{review.city}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { StarRating }
