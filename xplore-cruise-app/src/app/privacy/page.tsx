'use client'

import { useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'

export default function PrivacyPage() {
  const { locale } = useLocale()
  const isRo = locale === 'ro'

  return (
    <>
      <Header />
      <main id="main-content">
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <Container className="text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {isRo ? 'Politica de Confidențialitate' : 'Privacy Policy'}
          </h1>
          <p className="text-navy-300 text-sm">
            {isRo ? 'Ultima actualizare: 1 Martie 2026' : 'Last updated: March 1, 2026'}
          </p>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container className="max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '1. Operator de Date' : '1. Data Controller'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'XPLORE CRUISE TRAVEL SRL, CUI 36785800, cu sediul în Str. Col. Ion Alexandrescu 19, Câmpulung, Argeș, 115100, este operatorul datelor dumneavoastră personale în conformitate cu Regulamentul General privind Protecția Datelor (GDPR).'
                  : 'XPLORE CRUISE TRAVEL SRL, CUI 36785800, registered at Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100, Romania, is the controller of your personal data under the General Data Protection Regulation (GDPR).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '2. Date Colectate' : '2. Data We Collect'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Colectăm următoarele date personale: nume și prenume, adresă de email, număr de telefon, data nașterii (pentru rezervări), preferințe de călătorie și orice informații furnizate voluntar prin formularele de pe site.'
                  : 'We collect the following personal data: first and last name, email address, phone number, date of birth (for bookings), travel preferences, and any information voluntarily provided through website forms.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '3. Scopul Prelucrării' : '3. Purpose of Processing'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Datele dumneavoastră sunt prelucrate pentru: procesarea rezervărilor, comunicarea cu dumneavoastră referitoare la servicii, trimiterea de oferte promoționale (doar cu consimțământul explicit) și respectarea obligațiilor legale.'
                  : 'Your data is processed for: booking processing, communication regarding our services, sending promotional offers (only with explicit consent), and compliance with legal obligations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '4. Drepturile Dumneavoastră' : '4. Your Rights'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Aveți dreptul la: acces la datele personale, rectificarea datelor inexacte, ștergerea datelor (dreptul de a fi uitat), restricționarea prelucrării, portabilitatea datelor și opoziție la prelucrare. Puteți exercita aceste drepturi contactându-ne la xplorecruisetravel@gmail.com.'
                  : 'You have the right to: access your personal data, rectify inaccurate data, erasure (right to be forgotten), restrict processing, data portability, and object to processing. You can exercise these rights by contacting us at xplorecruisetravel@gmail.com.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '5. Păstrarea Datelor' : '5. Data Retention'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Datele personale sunt păstrate pe durata necesară îndeplinirii scopurilor pentru care au fost colectate și conform cerințelor legale aplicabile (de regulă, 5 ani pentru documentele fiscale).'
                  : 'Personal data is retained for the period necessary to fulfill the purposes for which it was collected and in accordance with applicable legal requirements (generally 5 years for fiscal documents).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '6. Contact DPO' : '6. DPO Contact'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Pentru orice întrebări legate de protecția datelor, vă rugăm contactați-ne la: xplorecruisetravel@gmail.com sau +40 749 558 572.'
                  : 'For any data protection inquiries, please contact us at: xplorecruisetravel@gmail.com or +40 749 558 572.'}
              </p>
            </div>
          </div>
        </Container>
      </section>
      </main>

      <Footer />
    </>
  )
}
