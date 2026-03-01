'use client'

import { useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'

export default function GdprPage() {
  const { locale } = useLocale()
  const isRo = locale === 'ro'

  return (
    <>
      <Header />
      <main id="main-content">
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <Container className="text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            GDPR
          </h1>
          <p className="text-navy-300 text-sm">
            {isRo ? 'Regulamentul General privind Protectia Datelor' : 'General Data Protection Regulation'}
          </p>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container className="max-w-3xl">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? 'Angajamentul Nostru' : 'Our Commitment'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'XPLORE CRUISE TRAVEL SRL se angajeaza sa protejeze datele personale ale clientilor sai in conformitate cu Regulamentul (UE) 2016/679 (GDPR). Respectam principiile de transparenta, limitare a scopului, minimizare a datelor, exactitate, limitare a stocarii, integritate si confidentialitate.'
                  : 'XPLORE CRUISE TRAVEL SRL is committed to protecting the personal data of its clients in accordance with Regulation (EU) 2016/679 (GDPR). We respect the principles of transparency, purpose limitation, data minimization, accuracy, storage limitation, integrity, and confidentiality.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? 'Baza Legala a Prelucrarii' : 'Legal Basis for Processing'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-navy-600 text-sm leading-relaxed">
                <li>
                  {isRo
                    ? 'Consimtamantul explicit al persoanei vizate (Art. 6(1)(a) GDPR)'
                    : 'Explicit consent of the data subject (Art. 6(1)(a) GDPR)'}
                </li>
                <li>
                  {isRo
                    ? 'Executarea unui contract (Art. 6(1)(b) GDPR) — pentru procesarea rezervarilor'
                    : 'Performance of a contract (Art. 6(1)(b) GDPR) — for booking processing'}
                </li>
                <li>
                  {isRo
                    ? 'Obligatii legale (Art. 6(1)(c) GDPR) — evidenta fiscala si contabila'
                    : 'Legal obligations (Art. 6(1)(c) GDPR) — fiscal and accounting records'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? 'Drepturile Dumneavoastra' : 'Your Rights Under GDPR'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { ro: 'Dreptul de acces', en: 'Right of access' },
                  { ro: 'Dreptul la rectificare', en: 'Right to rectification' },
                  { ro: 'Dreptul la stergere', en: 'Right to erasure' },
                  { ro: 'Dreptul la restrictionarea prelucrarii', en: 'Right to restrict processing' },
                  { ro: 'Dreptul la portabilitatea datelor', en: 'Right to data portability' },
                  { ro: 'Dreptul la opozitie', en: 'Right to object' },
                ].map((right, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-navy-50 border border-navy-100">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                    <span className="text-sm text-navy-700">{isRo ? right.ro : right.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? 'Exercitarea Drepturilor' : 'Exercising Your Rights'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Puteti exercita oricare dintre drepturile de mai sus prin trimiterea unei cereri la xplorecruisetravel@gmail.com. Vom raspunde in termen de 30 de zile. Aveti de asemenea dreptul de a depune o plangere la Autoritatea Nationala de Supraveghere a Prelucrarii Datelor cu Caracter Personal (ANSPDCP).'
                  : 'You can exercise any of the above rights by sending a request to xplorecruisetravel@gmail.com. We will respond within 30 days. You also have the right to file a complaint with the National Supervisory Authority for Personal Data Processing (ANSPDCP).'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gold-50 border border-gold-200">
              <h3 className="font-bold text-navy-900 text-sm mb-2">
                {isRo ? 'Contact Responsabil Protectia Datelor' : 'Data Protection Officer Contact'}
              </h3>
              <p className="text-navy-600 text-sm">
                XPLORE CRUISE TRAVEL SRL<br />
                Email: xplorecruisetravel@gmail.com<br />
                {isRo ? 'Telefon' : 'Phone'}: +40 749 558 572<br />
                {isRo ? 'Adresa' : 'Address'}: Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100
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
