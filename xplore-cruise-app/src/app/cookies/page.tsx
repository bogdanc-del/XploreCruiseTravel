'use client'

import { useLocale } from '@/i18n/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'

export default function CookiesPage() {
  const { locale } = useLocale()
  const isRo = locale === 'ro'

  return (
    <>
      <Header />
      <section className="pt-20 pb-16 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800">
        <Container className="text-center py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-[family-name:var(--font-heading)] mb-4">
            {isRo ? 'Politica Cookie' : 'Cookie Policy'}
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
                {isRo ? '1. Ce sunt cookie-urile?' : '1. What are cookies?'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Cookie-urile sunt fisiere text mici stocate pe dispozitivul dumneavoastra de catre browser-ul web. Acestea sunt utilizate pe scara larga pentru a permite functionarea corespunzatoare a site-urilor web, pentru a oferi rapoarte si a personaliza experienta.'
                  : 'Cookies are small text files stored on your device by your web browser. They are widely used to enable websites to function properly, provide reporting, and personalize the experience.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '2. Cookie-uri utilizate' : '2. Cookies we use'}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-navy-200 rounded-lg overflow-hidden">
                  <thead className="bg-navy-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-navy-700 font-semibold">Cookie</th>
                      <th className="text-left px-4 py-2 text-navy-700 font-semibold">{isRo ? 'Scop' : 'Purpose'}</th>
                      <th className="text-left px-4 py-2 text-navy-700 font-semibold">{isRo ? 'Durata' : 'Duration'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    <tr>
                      <td className="px-4 py-2 text-navy-600 font-mono text-xs">xct_locale</td>
                      <td className="px-4 py-2 text-navy-600">{isRo ? 'Preferinta de limba' : 'Language preference'}</td>
                      <td className="px-4 py-2 text-navy-600">1 {isRo ? 'an' : 'year'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-navy-600 font-mono text-xs">xct_cookie_consent</td>
                      <td className="px-4 py-2 text-navy-600">{isRo ? 'Consimtamant cookie' : 'Cookie consent'}</td>
                      <td className="px-4 py-2 text-navy-600">1 {isRo ? 'an' : 'year'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '3. Controlul cookie-urilor' : '3. Controlling cookies'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Puteti controla si sterge cookie-urile prin setarile browser-ului. Dezactivarea cookie-urilor poate afecta functionarea corespunzatoare a anumitor parti ale site-ului.'
                  : 'You can control and delete cookies through your browser settings. Disabling cookies may affect the proper functioning of certain parts of the website.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-navy-900 font-[family-name:var(--font-heading)] mb-3">
                {isRo ? '4. Contact' : '4. Contact'}
              </h2>
              <p className="text-navy-600 text-sm leading-relaxed">
                {isRo
                  ? 'Pentru intrebari referitoare la politica de cookie-uri, va rugam contactati-ne la xplorecruisetravel@gmail.com.'
                  : 'For questions regarding our cookie policy, please contact us at xplorecruisetravel@gmail.com.'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}
