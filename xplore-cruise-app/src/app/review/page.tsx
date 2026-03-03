'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useT } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'

// ============================================================
// /review — Public review submission form (QR landing page)
// ============================================================

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const CRUISE_TYPES = [
  { value: 'ocean', en: 'Ocean Cruise', ro: 'Croazieră Oceanică' },
  { value: 'river', en: 'River Cruise', ro: 'Croazieră Fluvială' },
  { value: 'luxury', en: 'Luxury Cruise', ro: 'Croazieră de Lux' },
  { value: 'expedition', en: 'Expedition Cruise', ro: 'Croazieră Expediție' },
]

function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          className="p-0.5 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded transition-transform hover:scale-110"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
        >
          <svg
            className={`w-8 h-8 transition-colors ${
              star <= (hover || value) ? 'text-gold-500' : 'text-navy-200'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewPage() {
  const t = useT()
  const { locale } = useLocale()

  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [cruiseType, setCruiseType] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // honeypot
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (rating === 0) {
      setErrorMsg(t('review_error_rating'))
      return
    }
    if (message.trim().length < 10) {
      setErrorMsg(t('review_error_message'))
      return
    }
    if (!consent) {
      setErrorMsg(t('review_error_consent'))
      return
    }

    setFormState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          name: name.trim() || null,
          city: city.trim() || null,
          cruise_type: cruiseType || null,
          message: message.trim(),
          consent_publish: consent,
          website, // honeypot
          source: 'qr',
        }),
      })

      if (res.status === 429) {
        setErrorMsg(t('review_error_rate_limit'))
        setFormState('error')
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || t('error'))
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMsg(t('error'))
      setFormState('error')
    }
  }

  // Thank-you state
  if (formState === 'success') {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-[60vh] flex items-center justify-center py-20">
          <Container className="max-w-lg text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
              {t('review_success_title')}
            </h1>
            <p className="text-navy-500 mb-8">
              {t('review_success_message')}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold hover:from-gold-600 hover:to-gold-700 transition-all"
            >
              {locale === 'ro' ? 'Inapoi la pagina principala' : 'Back to homepage'}
            </Link>
          </Container>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-16 text-center">
          <Container>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-3">
              {t('review_page_title')}
            </h1>
            <p className="text-navy-300 max-w-xl mx-auto">
              {t('review_page_subtitle')}
            </p>
          </Container>
        </section>

        {/* Form */}
        <section className="py-16 bg-white">
          <Container className="max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">
                  {t('review_rating_label')} <span className="text-red-500">*</span>
                </label>
                <StarInput value={rating} onChange={setRating} />
              </div>

              {/* Name (optional) */}
              <div>
                <label htmlFor="review-name" className="block text-sm font-medium text-navy-700 mb-1.5">
                  {t('review_name_label')}
                  <span className="text-navy-400 text-xs ml-1">({locale === 'ro' ? 'opțional' : 'optional'})</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  placeholder={locale === 'ro' ? 'ex: Maria I.' : 'e.g. Maria I.'}
                />
              </div>

              {/* City (optional) */}
              <div>
                <label htmlFor="review-city" className="block text-sm font-medium text-navy-700 mb-1.5">
                  {t('review_city_label')}
                  <span className="text-navy-400 text-xs ml-1">({locale === 'ro' ? 'opțional' : 'optional'})</span>
                </label>
                <input
                  id="review-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                  placeholder={locale === 'ro' ? 'ex: București' : 'e.g. Bucharest'}
                />
              </div>

              {/* Cruise Type (optional) */}
              <div>
                <label htmlFor="review-cruise-type" className="block text-sm font-medium text-navy-700 mb-1.5">
                  {t('review_cruise_type_label')}
                  <span className="text-navy-400 text-xs ml-1">({locale === 'ro' ? 'opțional' : 'optional'})</span>
                </label>
                <select
                  id="review-cruise-type"
                  value={cruiseType}
                  onChange={(e) => setCruiseType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400"
                >
                  <option value="">{locale === 'ro' ? '— Selectează —' : '— Select —'}</option>
                  {CRUISE_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {locale === 'ro' ? ct.ro : ct.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message (required) */}
              <div>
                <label htmlFor="review-message" className="block text-sm font-semibold text-navy-800 mb-1.5">
                  {t('review_message_label')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 resize-y"
                  placeholder={t('review_message_placeholder')}
                />
                <p className="text-xs text-navy-400 mt-1">{message.length}/2000</p>
              </div>

              {/* Honeypot (hidden) */}
              <div className="absolute -left-[9999px]" aria-hidden="true" tabIndex={-1}>
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-navy-300 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-sm text-navy-600">
                  {t('review_consent_label')} <span className="text-red-500">*</span>
                </span>
              </label>

              {/* Error */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold text-sm hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formState === 'submitting'
                  ? t('loading')
                  : t('review_submit_button')}
              </button>
            </form>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
