'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useT, useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import ChatWidget from '@/components/chat/ChatWidget'

// ============================================================
// About Page
// ============================================================

export default function AboutPage() {
  const t = useT()
  const { locale } = useLocale()

  const whyChooseUs = [
    {
      icon: <ShieldIcon />,
      text: t('about_why_1'),
    },
    {
      icon: <UserIcon />,
      text: t('about_why_2'),
    },
    {
      icon: <TagIcon />,
      text: t('about_why_3'),
    },
    {
      icon: <LockIcon />,
      text: t('about_why_4'),
    },
    {
      icon: <HeadsetIcon />,
      text: t('about_why_5'),
    },
  ]

  return (
    <>
      <Header />
      <main id="main-content">

      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=1920" alt="" fill sizes="100vw" className="object-cover opacity-15" priority quality={60} />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/80" />
        <Container className="relative z-10 text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {t('about_title')}
          </h1>
          <p className="text-navy-200 max-w-xl mx-auto">
            {t('about_subtitle')}
          </p>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-600 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              {locale === 'ro' ? 'CAEN 7912 — Consilier de Croaziere' : 'CAEN 7912 — Cruise Consultant'}
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-6">
              {t('about_mission_title')}
            </h2>
            <p className="text-navy-600 text-lg leading-relaxed">
              {t('about_mission')}
            </p>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy-50">
        <Container>
          <h2 className="text-2xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-14">
            {t('about_why_title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-xl bg-white shadow-sm border border-navy-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <p className="text-navy-700 text-sm leading-relaxed pt-1">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <Container>
          <h2 className="text-2xl md:text-4xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-4">
            {locale === 'ro' ? 'Echipa Noastră' : 'Our Team'}
          </h2>
          <p className="text-navy-500 text-center max-w-xl mx-auto mb-14">
            {locale === 'ro'
              ? 'Dedicați să vă oferim cele mai bune experiențe de croazieră.'
              : 'Dedicated to bringing you the finest cruise experiences.'}
          </p>

          <div className="max-w-sm mx-auto">
            <div className="text-center group">
              {/* Daniela Ceausu photo */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gold-400 shadow-lg group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <img
                  src="/images/daniela-ceausu.jpg"
                  alt="Ceausu Daniel Antonina"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)]">
                Ceausu Daniel Antonina
              </h3>
              <p className="text-gold-600 font-medium text-sm mt-1">
                CEO & {locale === 'ro' ? 'Consultant Croaziere' : 'Cruise Consultant'}
              </p>
              <p className="text-navy-500 text-sm mt-3 max-w-xs mx-auto">
                {locale === 'ro'
                  ? 'Cu pasiune pentru călătorii și ani de experiență în industria croazierelor, vă ghidează către vacanța perfectă pe ape.'
                  : 'With a passion for travel and years of experience in the cruise industry, guiding you to your perfect voyage.'}
              </p>

              {/* Contact info */}
              <div className="mt-4 flex justify-center gap-4">
                <a
                  href="mailto:xplorecruisetravel@gmail.com"
                  className="text-navy-400 hover:text-gold-500 transition-colors"
                  aria-label="Email"
                >
                  <EmailIcon />
                </a>
                <a
                  href="tel:+40749558572"
                  className="text-navy-400 hover:text-gold-500 transition-colors"
                  aria-label="Phone"
                >
                  <PhoneIcon />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Company Details Section */}
      <section className="py-16 bg-navy-900">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
              {locale === 'ro' ? 'Date Firmă' : 'Company Details'}
            </h2>
            <p className="text-navy-300 leading-relaxed mb-8">
              {locale === 'ro'
                ? 'XPLORE CRUISE TRAVEL SRL este un operator autorizat de croaziere, înregistrat în România din 2016, specializat în organizarea și vânzarea de croaziere premium.'
                : 'XPLORE CRUISE TRAVEL SRL is a licensed cruise consultant registered in Romania since 2016, specializing in organizing and selling premium cruise experiences.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-1">
                  {locale === 'ro' ? 'Denumire' : 'Company Name'}
                </p>
                <p className="text-white font-semibold text-sm">XPLORE CRUISE TRAVEL SRL</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-1">CUI</p>
                <p className="text-white font-semibold text-sm">36785800</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-1">
                  {locale === 'ro' ? 'Nr. Reg. Com.' : 'Trade Register'}
                </p>
                <p className="text-white font-semibold text-sm">J03/1962/2016</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-1">CAEN</p>
                <p className="text-white font-semibold text-sm">7912 — Organizare Croaziere</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 sm:col-span-2">
                <p className="text-navy-300 text-xs uppercase tracking-wider mb-1">
                  {locale === 'ro' ? 'Sediu Social' : 'Registered Office'}
                </p>
                <p className="text-white font-semibold text-sm">
                  Str. Col. Ion Alexandrescu 19, Câmpulung, Argeș, 115100
                </p>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              {locale === 'ro' ? 'Consilier de Croaziere din 2016' : 'Licensed Cruise Consultant Since 2016'}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1920" alt="" fill sizes="100vw" className="object-cover" loading="lazy" quality={50} />
        </div>
        <Container className="relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-heading)] mb-6">
            {locale === 'ro' ? 'Pregătit Să Navighezi?' : 'Ready to Set Sail?'}
          </h2>
          <p className="text-navy-200 max-w-xl mx-auto mb-8">
            {locale === 'ro'
              ? 'Contactează-ne astăzi și lasă-ne să planificăm vacanța ta perfectă pe ape.'
              : 'Get in touch today and let us plan your perfect vacation on the water.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as="a" href="/cruises" size="lg" variant="primary">
              {t('hero_cta')}
            </Button>
            <Button as="a" href="/contact" size="lg" variant="secondary" className="!border-white/30 !text-white hover:!bg-white/10">
              {t('hero_cta2')}
            </Button>
          </div>
        </Container>
      </section>

      <ChatWidget />
      </main>
      <Footer />
    </>
  )
}

// ============================================================
// Inline SVG Icons
// ============================================================

function ShieldIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )
}

function HeadsetIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  )
}
