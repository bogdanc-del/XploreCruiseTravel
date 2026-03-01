'use client'

import { useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'

export default function TermsPage() {
  const { locale } = useLocale()
  const isRo = locale === 'ro'

  return (
    <>
      <Header />
      <main id="main-content">
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <Container className="text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {isRo ? 'Termeni si Conditii' : 'Terms & Conditions'}
          </h1>
          <p className="text-navy-300 text-sm">
            {isRo ? 'Ultima actualizare: 1 Martie 2026' : 'Last updated: March 1, 2026'}
          </p>
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container className="max-w-3xl">
          <div className="prose prose-navy max-w-none space-y-8">
            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '1. Informatii Generale' : '1. General Information'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Acesti termeni si conditii reglementeaza utilizarea site-ului xplorecruisetravel.com si serviciile oferite de XPLORE CRUISE TRAVEL SRL, CUI 36785800, J03/1962/2016, CAEN 7912, cu sediul in Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100.'
                  : 'These terms and conditions govern the use of xplorecruisetravel.com and services provided by XPLORE CRUISE TRAVEL SRL, CUI 36785800, J03/1962/2016, CAEN 7912, registered at Str. Col. Ion Alexandrescu 19, Campulung, Arges, 115100, Romania.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '2. Rezervari si Plati' : '2. Bookings & Payments'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Rezervarile sunt considerate confirmate dupa primirea platii integrale sau a avansului specificat. Preturile afisate sunt orientative si pot fi modificate de companiile de croaziere fara notificare prealabila. Pretul final va fi confirmat de consultantul nostru la momentul rezervarii.'
                  : 'Bookings are considered confirmed upon receipt of full payment or the specified deposit. Displayed prices are indicative and may be modified by cruise companies without prior notice. The final price will be confirmed by our consultant at the time of booking.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '3. Anulari si Rambursari' : '3. Cancellations & Refunds'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Politicile de anulare variaza in functie de compania de croaziere si tipul de rezervare. In general, anularile efectuate cu cel putin 90 de zile inainte de plecare sunt eligibile pentru rambursare integrala minus taxa de procesare. Detaliile exacte vor fi comunicate la confirmarea rezervarii.'
                  : 'Cancellation policies vary depending on the cruise company and booking type. Generally, cancellations made at least 90 days before departure are eligible for a full refund minus a processing fee. Exact details will be communicated at booking confirmation.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '4. Responsabilitate' : '4. Liability'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'XPLORE CRUISE TRAVEL SRL actioneaza ca intermediar intre client si compania de croaziere. Nu ne asumam responsabilitatea pentru modificarile de itinerariu, intarzieri sau anulari cauzate de companiile de croaziere, conditii meteorologice sau situatii de forta majora.'
                  : 'XPLORE CRUISE TRAVEL SRL acts as an intermediary between the client and the cruise company. We are not responsible for itinerary changes, delays, or cancellations caused by cruise companies, weather conditions, or force majeure situations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '5. Contact' : '5. Contact'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Pentru intrebari legate de acesti termeni, va rugam sa ne contactati la xplorecruisetravel@gmail.com sau +40 749 558 572.'
                  : 'For questions regarding these terms, please contact us at xplorecruisetravel@gmail.com or +40 749 558 572.'}
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
