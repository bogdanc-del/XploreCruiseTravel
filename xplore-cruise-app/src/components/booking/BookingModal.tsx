'use client'

import { useState, useEffect, useCallback } from 'react'
import { useT, useLocale } from '@/i18n/context'
import Button from '@/components/ui/Button'

// ============================================================
// Types
// ============================================================

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  cruiseTitle?: string
  cruiseSlug?: string
  cruisePrice?: number
}

interface BookingFormData {
  firstName: string
  lastName: string
  dob: string
  email: string
  phone: string
  cabinPreference: string
  passengers: number
  specialRequests: string
  gdprConsent: boolean
  termsAccepted: boolean
  marketingConsent: boolean
}

const initialFormData: BookingFormData = {
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  phone: '',
  cabinPreference: 'interior',
  passengers: 1,
  specialRequests: '',
  gdprConsent: false,
  termsAccepted: false,
  marketingConsent: false,
}

// ============================================================
// Booking Modal Component
// ============================================================

export default function BookingModal({
  isOpen,
  onClose,
  cruiseTitle,
  cruiseSlug,
  cruisePrice,
}: BookingModalProps) {
  const t = useT()
  const { locale } = useLocale()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>(initialFormData)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData(initialFormData)
      setError('')
      setIsSubmitting(false)
      setIsSuccess(false)
      setBookingRef('')
    }
  }, [isOpen])

  // Lock body scroll when open
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

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // ---- Helpers ----

  const updateField = <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  const cabinOptions = [
    { value: 'interior', labelEn: 'Interior', labelRo: 'Interior' },
    { value: 'oceanview', labelEn: 'Ocean View', labelRo: 'Vedere la Ocean' },
    { value: 'balcony', labelEn: 'Balcony', labelRo: 'Balcon' },
    { value: 'suite', labelEn: 'Suite', labelRo: 'Suita' },
  ]

  // ---- Validation ----

  const validateStep1 = (): boolean => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.dob ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError(t('booking_fill_required'))
      return false
    }
    if (!isValidEmail(formData.email)) {
      setError(t('booking_invalid_email'))
      return false
    }
    return true
  }

  const validateStep3 = (): boolean => {
    if (!formData.gdprConsent || !formData.termsAccepted) {
      setError(t('booking_accept_terms'))
      return false
    }
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && !validateStep1()) return
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    setError('')
    if (step > 1) setStep(step - 1)
  }

  // ---- Submit ----

  const handleSubmit = async () => {
    if (!validateStep3()) return
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cruiseTitle: cruiseTitle || '',
          cruiseSlug: cruiseSlug || '',
          locale,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      setBookingRef(data.bookingRef || '')
      setIsSuccess(true)
    } catch {
      // Fallback: open mailto
      const subject = encodeURIComponent(
        `Cruise Booking Request — ${cruiseTitle || 'General'}`
      )
      const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCruise: ${cruiseTitle}\nCabin: ${formData.cabinPreference}\nPassengers: ${formData.passengers}\nRequests: ${formData.specialRequests}`
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

  // ---- Render ----

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-navy-400 hover:text-navy-700 hover:bg-navy-100 transition-colors z-10"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-navy-100">
          <h2 id="booking-modal-title" className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] pr-8">
            {t('booking_title')}
          </h2>
          {cruiseTitle && (
            <p className="text-sm text-navy-500 mt-1 truncate">{cruiseTitle}</p>
          )}

          {/* Step indicator */}
          {!isSuccess && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      s === step
                        ? 'bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-md'
                        : s < step
                          ? 'bg-gold-100 text-gold-600'
                          : 'bg-navy-100 text-navy-400'
                    }`}
                  >
                    {s < step ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      s
                    )}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-0.5 rounded transition-colors duration-300 ${
                        s < step ? 'bg-gold-400' : 'bg-navy-100'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-2">
                {t('booking_success_title')}
              </h3>
              {bookingRef && (
                <p className="text-sm text-gold-600 font-semibold mb-3">
                  Ref: {bookingRef}
                </p>
              )}
              <p className="text-navy-600 text-sm leading-relaxed mb-6">
                {t('booking_success_msg')}
              </p>
              <Button onClick={onClose} variant="primary" size="md">
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

              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-navy-700 mb-2">
                    {t('booking_step1_title')}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldInput
                      label={t('booking_firstname')}
                      name="firstName"
                      value={formData.firstName}
                      onChange={(v) => updateField('firstName', v)}
                      required
                      autoComplete="given-name"
                    />
                    <FieldInput
                      label={t('booking_lastname')}
                      name="lastName"
                      value={formData.lastName}
                      onChange={(v) => updateField('lastName', v)}
                      required
                      autoComplete="family-name"
                    />
                  </div>

                  <FieldInput
                    label={t('booking_dob')}
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(v) => updateField('dob', v)}
                    required
                    autoComplete="bday"
                  />

                  <FieldInput
                    label={t('booking_email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(v) => updateField('email', v)}
                    required
                    autoComplete="email"
                  />

                  <FieldInput
                    label={t('booking_phone')}
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(v) => updateField('phone', v)}
                    required
                    placeholder="+40 7XX XXX XXX"
                    autoComplete="tel"
                  />
                </div>
              )}

              {/* Step 2: Cruise Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-navy-700 mb-2">
                    {t('booking_step2_title')}
                  </p>

                  {cruiseTitle && (
                    <div className="p-3 rounded-lg bg-gold-50 border border-gold-200">
                      <p className="text-xs text-navy-500 mb-1">
                        {locale === 'ro' ? 'Croaziera selectata' : 'Selected Cruise'}
                      </p>
                      <p className="text-sm font-semibold text-navy-900">{cruiseTitle}</p>
                      {cruisePrice && (
                        <p className="text-xs text-gold-600 mt-1">
                          {t('cruise_from')} €{cruisePrice.toLocaleString()}{t('cruise_per_person')}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-navy-600 mb-1.5">
                      {t('booking_cabin_pref')}
                    </label>
                    <select
                      name="cabinPreference"
                      value={formData.cabinPreference}
                      onChange={(e) => updateField('cabinPreference', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                    >
                      {cabinOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {locale === 'ro' ? opt.labelRo : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-navy-600 mb-1.5">
                      {t('booking_passengers')}
                    </label>
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={(e) =>
                        updateField('passengers', parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1
                            ? locale === 'ro' ? 'pasager' : 'passenger'
                            : locale === 'ro' ? 'pasageri' : 'passengers'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-navy-600 mb-1.5">
                      {t('booking_special_requests')}
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        updateField('specialRequests', e.target.value)
                      }
                      rows={3}
                      placeholder={t('booking_requests_placeholder')}
                      className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Review & Consent */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-navy-700 mb-2">
                    {t('booking_step3_title')}
                  </p>

                  {/* Summary */}
                  <div className="p-4 rounded-lg bg-navy-50 border border-navy-100 space-y-2 text-sm">
                    <SummaryRow label={t('booking_firstname')} value={formData.firstName} />
                    <SummaryRow label={t('booking_lastname')} value={formData.lastName} />
                    <SummaryRow label={t('booking_dob')} value={formData.dob} />
                    <SummaryRow label={t('booking_email')} value={formData.email} />
                    <SummaryRow label={t('booking_phone')} value={formData.phone} />
                    {cruiseTitle && (
                      <SummaryRow
                        label={locale === 'ro' ? 'Croaziera' : 'Cruise'}
                        value={cruiseTitle}
                      />
                    )}
                    <SummaryRow
                      label={t('booking_cabin_pref')}
                      value={
                        cabinOptions.find((o) => o.value === formData.cabinPreference)?.[
                          locale === 'ro' ? 'labelRo' : 'labelEn'
                        ] || formData.cabinPreference
                      }
                    />
                    <SummaryRow
                      label={t('booking_passengers')}
                      value={String(formData.passengers)}
                    />
                    {formData.specialRequests && (
                      <SummaryRow
                        label={t('booking_special_requests')}
                        value={formData.specialRequests}
                      />
                    )}
                  </div>

                  {/* GDPR & Terms */}
                  <div className="space-y-3 pt-2">
                    <CheckboxField
                      checked={formData.gdprConsent}
                      onChange={(v) => updateField('gdprConsent', v)}
                      label={t('booking_gdpr_consent')}
                      name="gdprConsent"
                      required
                    />
                    <CheckboxField
                      checked={formData.termsAccepted}
                      onChange={(v) => updateField('termsAccepted', v)}
                      label={t('booking_terms_agree')}
                      name="termsAccepted"
                      required
                    />
                    <CheckboxField
                      checked={formData.marketingConsent}
                      onChange={(v) => updateField('marketingConsent', v)}
                      label={t('booking_marketing_consent')}
                      name="marketingConsent"
                    />
                  </div>
                </div>
              )}

              {/* Footer buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-navy-100">
                {step > 1 && (
                  <Button
                    onClick={handlePrev}
                    variant="ghost"
                    size="md"
                    className="flex-1"
                  >
                    {t('booking_prev')}
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    onClick={handleNext}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    {t('booking_next')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    size="md"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('loading')
                      : t('booking_submit')}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function FieldInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  autoComplete,
}: {
  label: string
  name: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-navy-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-white text-navy-900 text-sm placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
      />
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-navy-500 flex-shrink-0">{label}:</span>
      <span className="text-navy-900 font-medium text-right truncate">{value}</span>
    </div>
  )
}

function CheckboxField({
  checked,
  onChange,
  label,
  name,
  required,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  name?: string
  required?: boolean
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            checked
              ? 'bg-gold-500 border-gold-500'
              : 'border-navy-300 group-hover:border-gold-400'
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-navy-600 leading-relaxed">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
    </label>
  )
}
