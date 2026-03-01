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
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <Container className="text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {isRo ? 'Politica de Confidentialitate' : 'Privacy Policy'}
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
                  ? 'XPLORE CRUISE TRAVEL SRL, CUI 36785800, cu sediul in Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100, este operatorul datelor dumneavoastra personale in conformitate cu Regulamentul General privind Protectia Datelor (GDPR).'
                  : 'XPLORE CRUISE TRAVEL SRL, CUI 36785800, registered at Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100, Romania, is the controller of your personal data under the General Data Protection Regulation (GDPR).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '2. Date Colectate' : '2. Data We Collect'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Colectam urmatoarele date personale: nume si prenume, adresa de email, numar de telefon, data nasterii (pentru rezervari), preferinte de calatorie si orice informatii furnizate voluntar prin formularele de pe site.'
                  : 'We collect the following personal data: first and last name, email address, phone number, date of birth (for bookings), travel preferences, and any information voluntarily provided through website forms.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '3. Scopul Prelucrarii' : '3. Purpose of Processing'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Datele dumneavoastra sunt prelucrate pentru: procesarea rezervarilor, comunicarea cu dumneavoastra referitoare la servicii, trimiterea de oferte promotionale (doar cu consimtamantul explicit) si respectarea obligatiilor legale.'
                  : 'Your data is processed for: booking processing, communication regarding our services, sending promotional offers (only with explicit consent), and compliance with legal obligations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '4. Drepturile Dumneavoastra' : '4. Your Rights'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Aveti dreptul la: acces la datele personale, rectificarea datelor inexacte, stergerea datelor (dreptul de a fi uitat), restrictionarea prelucrarii, portabilitatea datelor si opozitie la prelucrare. Puteti exercita aceste drepturi contactandu-ne la xplorecruisetravel@gmail.com.'
                  : 'You have the right to: access your personal data, rectify inaccurate data, erasure (right to be forgotten), restrict processing, data portability, and object to processing. You can exercise these rights by contacting us at xplorecruisetravel@gmail.com.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '5. Pastrarea Datelor' : '5. Data Retention'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Datele personale sunt pastrate pe durata necesara indeplinirii scopurilor pentru care au fost colectate si conform cerintelor legale aplicabile (de regula, 5 ani pentru documentele fiscale).'
                  : 'Personal data is retained for the period necessary to fulfill the purposes for which it was collected and in accordance with applicable legal requirements (generally 5 years for fiscal documents).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '6. Contact DPO' : '6. DPO Contact'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Pentru orice intrebari legate de protectia datelor, va rugam contactati-ne la: xplorecruisetravel@gmail.com sau +40 749 558 572.'
                  : 'For any data protection inquiries, please contact us at: xplorecruisetravel@gmail.com or +40 749 558 572.'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
