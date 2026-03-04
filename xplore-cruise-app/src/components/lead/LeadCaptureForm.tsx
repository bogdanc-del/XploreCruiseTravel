'use client'

import { useState, useEffect, useCallback } from 'react'
import { useT, useLocale } from '@/i18n/context'
import Button from '@/components/ui/Button'
import { trackLeadFormOpen, trackLeadFormSubmit, trackLeadFormAbandon } from '@/lib/analytics'

// ============================================================
// Types
// ============================================================

export interface LeadFormGuidedContext {
  isFirstCruise: boolean | null
  previousCruiseLine: string | null
  travelParty: string | null
  mainPriority: string | null
  travelWindow: string | null
  budgetRange: string | null
  preferredDestination: string | null
}

export interface LeadFormCabinContext {
  name: string
  category: string
  normalizedCategory: string
  price: number
  date: string
}

interface LeadCaptureFormProps {
  isOpen: boolean
  onClose: () => void
  cruiseTitle?: string
  cruiseSlug?: string
  cruisePrice?: number
  guidedContext?: LeadFormGuidedContext | null
  selectedCabin?: LeadFormCabinContext | null
  source?: 'detail' | 'guided_result' | 'listing'
}

interface LeadFormData {
  name: string
  email: string
  phone: string
  message: string
  gdprConsent: boolean
}

// ============================================================
// Helpers
// ============================================================

function buildPrefillMessage(
  ctx: LeadFormGuidedContext | null | undefined,
  cruiseTitle: string | undefined,
  locale: 'en' | 'ro',
  cabin?: LeadFormCabinContext | null
): string {
  if (!ctx || ctx.travelParty === null) return ''

  const partyMap: Record<string, { en: string; ro: string }> = {
    solo: { en: 'solo', ro: 'singur(ă)' },
    couple: { en: 'as a couple', ro: 'în cuplu' },
    family: { en: 'with family', ro: 'cu familia' },
    friends: { en: 'with friends', ro: 'cu prietenii' },
    group: { en: 'in an organized group', ro: 'într-un grup organizat' },
  }

  const priorityMap: Record<string, { en: string; ro: string }> = {
    budget: { en: 'best price', ro: 'cel mai bun preț' },
    luxury: { en: 'premium experience', ro: 'experiență premium' },
    family: { en: 'family activities', ro: 'activități pentru familie' },
    adventure: { en: 'exotic destinations', ro: 'destinații exotice' },
    relaxation: { en: 'relaxation & spa', ro: 'relaxare și spa' },
  }

  const timingMap: Record<string, { en: string; ro: string }> = {
    next_3_months: { en: 'next 3 months', ro: 'următoarele 3 luni' },
    next_6_months: { en: 'next 6 months', ro: 'următoarele 6 luni' },
    next_year: { en: 'next year', ro: 'anul viitor' },
    flexible: { en: 'flexible dates', ro: 'date flexibile' },
  }

  const parts: string[] = []

  if (locale === 'ro') {
    if (cruiseTitle) parts.push(`Sunt interesat(ă) de: ${cruiseTitle}.`)
    if (ctx.isFirstCruise === true) parts.push('Este prima mea croazieră.')
    else if (ctx.isFirstCruise === false && ctx.previousCruiseLine) {
      parts.push(`Am mai călătorit cu ${ctx.previousCruiseLine}.`)
    }
    if (ctx.travelParty) parts.push(`Călătoresc: ${partyMap[ctx.travelParty]?.ro || ctx.travelParty}.`)
    if (ctx.mainPriority) parts.push(`Prioritate: ${priorityMap[ctx.mainPriority]?.ro || ctx.mainPriority}.`)
    if (ctx.travelWindow) parts.push(`Perioada: ${timingMap[ctx.travelWindow]?.ro || ctx.travelWindow}.`)
  } else {
    if (cruiseTitle) parts.push(`I'm interested in: ${cruiseTitle}.`)
    if (ctx.isFirstCruise === true) parts.push('This is my first cruise.')
    else if (ctx.isFirstCruise === false && ctx.previousCruiseLine) {
      parts.push(`I've previously cruised with ${ctx.previousCruiseLine}.`)
    }
    if (ctx.travelParty) parts.push(`Traveling: ${partyMap[ctx.travelParty]?.en || ctx.travelParty}.`)
    if (ctx.mainPriority) parts.push(`Priority: ${priorityMap[ctx.mainPriority]?.en || ctx.mainPriority}.`)
    if (ctx.travelWindow) parts.push(`Timing: ${timingMap[ctx.travelWindow]?.en || ctx.travelWindow}.`)
  }

  // Append cabin preference if selected
  if (cabin) {
    if (locale === 'ro') {
      parts.push(`Cabina preferată: ${cabin.name || cabin.category} — €${cabin.price.toLocaleString()}/persoană.`)
    } else {
      parts.push(`Preferred cabin: ${cabin.name || cabin.category} — €${cabin.price.toLocaleString()}/person.`)
    }
  }

  return parts.join(' ')
}

// ============================================================
// LeadCaptureForm Component
// ============================================================

export default function LeadCaptureForm({
  isOpen,
  onClose,
  cruiseTitle,
  cruiseSlug,
  cruisePrice,
  guidedContext,
  selectedCabin,
  source = 'detail',
}: LeadCaptureFormProps) {
  const t = useT()
  const { locale } = useLocale()
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdprConsent: false,
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Prefill message from guided context on mount
  useEffect(() => {
    if (isOpen) {
      const prefill = buildPrefillMessage(guidedContext, cruiseTitle, locale, selectedCabin)
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: prefill,
        gdprConsent: false,
      })
      setError('')
      setIsSubmitting(false)
      setIsSuccess(false)

      trackLeadFormOpen(source, !!guidedContext?.travelParty, cruiseSlug || '')
    }
  }, [isOpen, guidedContext, cruiseTitle, locale, source, cruiseSlug, selectedCabin])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Helpers
  const updateField = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleClose = () => {
    if (!isSuccess) {
      const fieldsFilled = [formData.name, formData.email, formData.phone, formData.message].filter(
        (f) => f.trim().length > 0
      ).length
      if (fieldsFilled > 0) {
        trackLeadFormAbandon(source, fieldsFilled)
      }
    }
    onClose()
  }

  // Submit
  const handleSubmit = async () => {
    // Validate
    if (!formData.name.trim() || !formData.email.trim()) {
      setError(t('lead_form_fill_required'))
      return
    }
    if (!isValidEmail(formData.email)) {
      setError(t('lead_form_invalid_email'))
      return
    }
    if (!formData.gdprConsent) {
      setError(locale === 'ro' ? 'Consimțământul GDPR este obligatoriu.' : 'GDPR consent is required.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          cruiseInterest: cruiseTitle || null,
          message: formData.message.trim() || `Interested in: ${cruiseTitle || 'cruise information'}`,
          gdprConsent: formData.gdprConsent,
          locale,
          // Extended fields for lead context
          cruiseSlug: cruiseSlug || null,
          cruiseTitle: cruiseTitle || null,
          cruisePrice: cruisePrice || null,
          guidedContext: guidedContext || null,
          selectedCabin: selectedCabin || null,
          source,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      setIsSuccess(true)
      trackLeadFormSubmit(source, !!guidedContext?.travelParty, cruiseSlug || '')
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(
        locale === 'ro'
          ? `Cerere ofertă — ${cruiseTitle || 'Croazieră'}`
          : `Offer Request — ${cruiseTitle || 'Cruise'}`
      )
      const body = encodeURIComponent(
        `${formData.name}\n${formData.email}\n${formData.phone}\n\n${formData.message}`
      )
      window.open(
        `mailto:xplorecruisetravel@gmail.com?subject=${subject}&body=${body}`,
        '_blank'
      )
      setIsSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors z-10"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-navy-100">
          {cruiseTitle ? (
            <>
              <h2
                id="lead-form-title"
                className="text-lg font-bold text-navy-900 font-[family-name:var(--font-heading)] pr-8"
              >
                {t('lead_form_title_for')}
              </h2>
              <div className="mt-2 p-3 rounded-lg bg-gold-50 border border-gold-200">
                <p className="text-sm font-semibold text-navy-900 line-clamp-2">{cruiseTitle}</p>
                {cruisePrice && (
                  <p className="text-xs text-gold-600 mt-0.5">
                    {t('cruise_from')} &euro;{cruisePrice.toLocaleString()}{t('cruise_per_person')}
                  </p>
                )}
              </div>
            </>
          ) : (
            <h2
              id="lead-form-title"
              className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] pr-8"
            >
              {t('lead_form_title')}
            </h2>
          )}
          <p className="text-sm text-navy-500 mt-1">{t('lead_form_subtitle')}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {isSuccess ? (
            /* Warm Success State — builds trust and sets expectations */
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-1">
                {t('lead_form_success_title')}
              </h3>
              <p className="text-navy-500 text-xs mb-4">
                {t('lead_form_success_response' as Parameters<typeof t>[0])}
              </p>

              {/* Next steps */}
              <div className="text-left bg-navy-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-navy-700 mb-2">
                  {t('lead_form_success_detail' as Parameters<typeof t>[0])}
                </p>
                <ol className="space-y-2 text-xs text-navy-600">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
                    {t('lead_form_success_step1' as Parameters<typeof t>[0])}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
                    {t('lead_form_success_step2' as Parameters<typeof t>[0])}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-[10px] font-bold mt-0.5">3</span>
                    {t('lead_form_success_step3' as Parameters<typeof t>[0])}
                  </li>
                </ol>
              </div>

              <Button onClick={handleClose} variant="primary" size="md">
                {t('close')}
              </Button>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1.5">
                    {t('lead_form_name')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1.5">
                    {t('lead_form_email')} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1.5">
                    {t('lead_form_phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    autoComplete="tel"
                    placeholder="+40 7XX XXX XXX"
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                  />
                  <p className="mt-1 text-[10px] text-navy-400">{t('lead_form_phone_helper' as Parameters<typeof t>[0])}</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-navy-600 mb-1.5">
                    {t('lead_form_message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors resize-none"
                  />
                </div>

                {/* GDPR Consent */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      name="gdprConsent"
                      checked={formData.gdprConsent}
                      onChange={(e) => updateField('gdprConsent', e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        formData.gdprConsent
                          ? 'bg-gold-500 border-gold-500'
                          : 'border-navy-300 group-hover:border-gold-400'
                      }`}
                    >
                      {formData.gdprConsent && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-navy-600 leading-relaxed">
                    {t('lead_form_gdpr')} <span className="text-red-400">*</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-navy-100">
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('loading') : t('lead_form_submit')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
