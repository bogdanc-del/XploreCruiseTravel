'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import ChatWidget from '@/components/chat/ChatWidget'

// ============================================================
// Contact Page
// ============================================================

export default function ContactPage() {
  const t = useT()
  const { locale } = useLocale()

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [cruiseInterest, setCruiseInterest] = useState('')
  const [message, setMessage] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const cruiseInterestOptions = locale === 'ro'
    ? [
        { value: '', label: 'Selecteaza tipul de croaziera...' },
        { value: 'ocean', label: 'Croaziera pe Ocean' },
        { value: 'river', label: 'Croaziera Fluviala' },
        { value: 'luxury', label: 'Croaziera de Lux' },
        { value: 'expedition', label: 'Croaziera de Expeditie' },
        { value: 'mediterranean', label: 'Mediterana' },
        { value: 'caribbean', label: 'Caraibe' },
        { value: 'northern-europe', label: 'Europa de Nord' },
        { value: 'other', label: 'Altele / Nu stiu inca' },
      ]
    : [
        { value: '', label: 'Select cruise type...' },
        { value: 'ocean', label: 'Ocean Cruise' },
        { value: 'river', label: 'River Cruise' },
        { value: 'luxury', label: 'Luxury Cruise' },
        { value: 'expedition', label: 'Expedition Cruise' },
        { value: 'mediterranean', label: 'Mediterranean' },
        { value: 'caribbean', label: 'Caribbean' },
        { value: 'northern-europe', label: 'Northern Europe' },
        { value: 'other', label: 'Other / Not sure yet' },
      ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage('')

    if (!gdprConsent) {
      setSubmitStatus('error')
      setErrorMessage(locale === 'ro'
        ? 'Va rugam sa acceptati prelucrarea datelor personale conform GDPR.'
        : 'Please accept the GDPR data processing consent.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, cruiseInterest, message, gdprConsent, locale }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      setSubmitStatus('success')

      // Clear form
      setName('')
      setEmail('')
      setPhone('')
      setCruiseInterest('')
      setMessage('')
      setGdprConsent(false)
    } catch {
      setSubmitStatus('error')
      setErrorMessage(locale === 'ro'
        ? 'Mesajul nu a putut fi trimis. Va rugam incercati din nou sau contactati-ne direct la xplorecruisetravel@gmail.com.'
        : 'Message could not be sent. Please try again or contact us directly at xplorecruisetravel@gmail.com.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920" alt="" fill sizes="100vw" className="object-cover opacity-15" priority quality={60} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/80" />
        <Container className="relative z-10 text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {t('contact_title')}
          </h1>
          <p className="text-navy-200 max-w-xl mx-auto">
            {t('contact_subtitle')}
          </p>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-6">
                {locale === 'ro' ? 'Trimite-ne un mesaj' : 'Send us a message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-navy-700 mb-1.5">
                    {t('contact_name')} *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
                    placeholder={locale === 'ro' ? 'Numele complet' : 'Full name'}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-navy-700 mb-1.5">
                    {t('contact_email')} *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
                    placeholder={locale === 'ro' ? 'adresa@email.com' : 'your@email.com'}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-navy-700 mb-1.5">
                    {t('contact_phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all"
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>

                {/* Cruise Interest */}
                <div>
                  <label htmlFor="contact-interest" className="block text-sm font-medium text-navy-700 mb-1.5">
                    {t('contact_cruise_interest')}
                  </label>
                  <select
                    id="contact-interest"
                    value={cruiseInterest}
                    onChange={e => setCruiseInterest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 cursor-pointer transition-all"
                  >
                    {cruiseInterestOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-navy-700 mb-1.5">
                    {t('contact_message')} *
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition-all resize-y"
                    placeholder={locale === 'ro'
                      ? 'Spune-ne despre croaziera visurilor tale...'
                      : 'Tell us about your dream cruise...'}
                  />
                </div>

                {/* GDPR Consent */}
                <div className="flex items-start gap-3">
                  <input
                    id="gdpr-consent"
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={e => setGdprConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-navy-300 text-gold-500 focus:ring-gold-400 cursor-pointer"
                  />
                  <label htmlFor="gdpr-consent" className="text-xs text-navy-500 leading-relaxed cursor-pointer">
                    {locale === 'ro'
                      ? 'Consimt la prelucrarea datelor mele personale in scopul procesarii cererii mele, conform reglementarilor GDPR si Politicii noastre de Confidentialitate.'
                      : 'I consent to the processing of my personal data for the purpose of handling my inquiry, in accordance with GDPR regulations and our Privacy Policy.'}
                    {' '}
                    <a href="/privacy" className="text-gold-600 hover:text-gold-700 underline">
                      {locale === 'ro' ? 'Politica de Confidentialitate' : 'Privacy Policy'}
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (locale === 'ro' ? 'Se trimite...' : 'Sending...')
                    : t('contact_send')}
                </Button>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                    {t('contact_success')}
                  </div>
                )}
                {submitStatus === 'error' && errorMessage && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Right: Quick Contact & Map */}
            <div className="space-y-8">
              {/* Quick Contact Card */}
              <div className="rounded-xl bg-navy-900 text-white p-8">
                <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] mb-6 text-gold-400">
                  {t('contact_quick_title')}
                </h3>

                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <EmailIcon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">Email</p>
                      <a
                        href="mailto:xplorecruisetravel@gmail.com"
                        className="text-sm text-navy-200 hover:text-gold-400 transition-colors"
                      >
                        xplorecruisetravel@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <PhoneIcon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
                        {locale === 'ro' ? 'Telefon' : 'Phone'}
                      </p>
                      <a
                        href="tel:+40749558572"
                        className="text-sm text-navy-200 hover:text-gold-400 transition-colors"
                      >
                        +40 749 558 572
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
                        {t('contact_hours')}
                      </p>
                      <p className="text-sm text-navy-200 whitespace-pre-line">
                        {t('contact_hours_value')}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="text-xs text-navy-400 uppercase tracking-wider mb-1">
                        {t('contact_office')}
                      </p>
                      <p className="text-sm text-navy-200">
                        Bucharest, Romania
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact person */}
                <div className="mt-6 pt-6 border-t border-navy-700">
                  <p className="text-xs text-navy-400 uppercase tracking-wider mb-2">
                    {locale === 'ro' ? 'Persoana de contact' : 'Contact Person'}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-400 flex-shrink-0">
                      <img src="/images/daniela-ceausu.jpg" alt="Ceausu Daniel Antonina" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Ceausu Daniel Antonina</p>
                      <p className="text-xs text-gold-400 mt-0.5">CEO & {locale === 'ro' ? 'Consultant Croaziere' : 'Cruise Consultant'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Placeholder */}
              <div className="rounded-xl overflow-hidden border border-navy-200 bg-navy-100">
                <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-navy-100 to-navy-200">
                  <div className="text-center">
                    <MapPinIcon className="w-12 h-12 text-navy-400 mx-auto mb-3" />
                    <p className="text-navy-500 text-sm font-medium">Bucharest, Romania</p>
                    <p className="text-navy-400 text-xs mt-1">
                      {locale === 'ro' ? 'Harta va fi adaugata in curand' : 'Map coming soon'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      <ChatWidget />
      <Footer />
    </>
  )
}

// ============================================================
// Inline SVG Icons
// ============================================================

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
}
