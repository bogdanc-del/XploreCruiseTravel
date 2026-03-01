import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagina nu a fost gasita (404)',
  description: 'Pagina pe care o cautati nu exista sau a fost mutata.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Ship icon */}
        <div className="mb-8">
          <svg className="w-24 h-24 mx-auto text-gold-400 opacity-80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 32l4-4h28l4 4-6 8H12L6 32z" fill="currentColor" />
            <path d="M12 22h24v6H12z" fill="currentColor" opacity="0.6" />
            <rect x="15" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
            <rect x="19" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
            <rect x="23" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
            <rect x="27" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
            <rect x="31" y="24" width="2" height="2" rx="0.5" fill="white" opacity="0.5" />
            <path d="M19 14h4v8h-4z" fill="currentColor" opacity="0.5" />
            <path d="M18 12h6v3h-6z" fill="currentColor" opacity="0.7" />
            <path d="M2 44c5-3 10-3 15 0s10 3 15 0 10-3 15 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          </svg>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-gold-400 font-[family-name:var(--font-heading)] mb-4">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-white font-[family-name:var(--font-heading)] mb-4">
          Pagina nu a fost gasita
        </h2>
        <p className="text-navy-300 mb-8 leading-relaxed">
          Ne pare rau, pagina pe care o cautati nu exista sau a fost mutata.
          Navigati inapoi catre paginile noastre principale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 text-white font-semibold text-sm shadow-lg hover:from-gold-500 hover:to-gold-600 transition-all"
          >
            Acasa
          </Link>
          <Link
            href="/cruises"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Croaziere
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Contact
          </Link>
        </div>

        <p className="mt-12 text-navy-500 text-xs">
          <Link href="/" className="font-heading text-gold-500/70 hover:text-gold-400 transition-colors">
            XploreCruiseTravel
          </Link>
          {' '}— Consultant Autorizat de Croaziere
        </p>
      </div>
    </div>
  )
}
