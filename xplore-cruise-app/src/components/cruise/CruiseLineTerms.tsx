'use client'

import { useState } from 'react'
import { useLocale } from '@/i18n/context'
import { CRUISE_LINE_TERMS } from '@/data/cruise-line-terms'

interface CruiseLineTermsProps {
  cruiseLine: string
  className?: string
}

/**
 * Terms & Conditions per cruise line — collapsible accordion.
 * Shows general terms like deposit, children policy, etc.
 */
export default function CruiseLineTerms({ cruiseLine, className = '' }: CruiseLineTermsProps) {
  const { locale } = useLocale()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const terms = CRUISE_LINE_TERMS[cruiseLine]
  if (!terms || terms.general_terms.length === 0) return null

  return (
    <div className={`space-y-2 ${className}`}>
      {terms.general_terms.map((term, i) => {
        const isOpen = openIndex === i
        const title = locale === 'ro' ? term.title_ro : term.title_en
        const content = locale === 'ro' ? term.content_ro : term.content_en

        return (
          <div
            key={i}
            className="rounded-lg border border-navy-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-navy-50/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-navy-800">{title}</span>
              <ChevronIcon expanded={isOpen} />
            </button>

            {isOpen && (
              <div className="px-4 pb-3 animate-fade-in">
                <p className="text-sm text-navy-600 leading-relaxed">{content}</p>
              </div>
            )}
          </div>
        )
      })}

      {/* General disclaimer */}
      <p className="text-xs text-navy-400 italic mt-2">
        {locale === 'ro'
          ? 'Termenii pot varia. Contactati-ne pentru informatii actualizate si conditii specifice rezervarii dumneavoastra.'
          : 'Terms may vary. Contact us for updated information and conditions specific to your booking.'}
      </p>
    </div>
  )
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-navy-400 transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  )
}
