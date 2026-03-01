'use client'

import { useState } from 'react'
import { useLocale } from '@/i18n/context'
import { BEVERAGE_PACKAGES, type CruiseLineBeverageInfo } from '@/data/beverage-packages'

interface BeveragePackageTableProps {
  cruiseLine: string
  className?: string
}

/**
 * Beverage package pricing table for a specific cruise line.
 * Shows all-inclusive banner for lines that include drinks, or package comparison table.
 */
export default function BeveragePackageTable({ cruiseLine, className = '' }: BeveragePackageTableProps) {
  const { locale } = useLocale()
  const [expandedPkg, setExpandedPkg] = useState<number | null>(null)

  const info = BEVERAGE_PACKAGES[cruiseLine]
  if (!info) return null

  // All-inclusive banner
  if (info.all_inclusive && info.packages.length === 0) {
    return (
      <div className={className}>
        <AllInclusiveBanner info={info} locale={locale} />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* All-inclusive note (for lines with included drinks + optional upgrades) */}
      {info.all_inclusive && (
        <AllInclusiveBanner info={info} locale={locale} />
      )}

      {/* Package cards (mobile-first responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {info.packages.map((pkg, i) => {
          const name = locale === 'ro' ? pkg.name_ro : pkg.name
          const note = locale === 'ro' ? pkg.note_ro : pkg.note
          const includes = locale === 'ro' ? pkg.includes_ro : pkg.includes
          const isExpanded = expandedPkg === i

          return (
            <div
              key={i}
              className="rounded-xl border border-navy-200 bg-white overflow-hidden hover:border-gold-300 transition-colors"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-navy-50 border-b border-navy-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-navy-900 text-sm">{name}</h4>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gold-600">
                      {pkg.currency === 'EUR' ? '\u20AC' : '$'}{pkg.price_per_day}
                    </span>
                    <span className="text-xs text-navy-500 ml-1">
                      /{locale === 'ro' ? 'zi' : 'day'}
                    </span>
                  </div>
                </div>
                {pkg.gratuity && (
                  <p className="text-xs text-navy-400 mt-0.5">{pkg.gratuity}</p>
                )}
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <button
                  onClick={() => setExpandedPkg(isExpanded ? null : i)}
                  className="flex items-center gap-1 text-xs text-gold-600 hover:text-gold-700 font-medium mb-2"
                  aria-expanded={isExpanded}
                >
                  <ChevronIcon expanded={isExpanded} />
                  {locale === 'ro' ? 'Ce include' : 'What\'s included'}
                </button>

                {isExpanded && (
                  <ul className="space-y-1.5 animate-fade-in">
                    {includes.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-navy-600">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {note && (
                  <p className="text-xs text-navy-400 mt-2 italic">{note}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-navy-400 italic">
        {locale === 'ro'
          ? 'Preturile pot varia in functie de itinerariu si data rezervarii. Contactati-ne pentru preturi actualizate.'
          : 'Prices may vary by itinerary and booking date. Contact us for updated pricing.'}
      </p>
    </div>
  )
}

function AllInclusiveBanner({ info, locale }: { info: CruiseLineBeverageInfo; locale: string }) {
  const note = locale === 'ro' ? info.all_inclusive_note_ro : info.all_inclusive_note

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <GlassIcon />
      </div>
      <div>
        <h4 className="font-semibold text-emerald-800 text-sm mb-1">
          {locale === 'ro' ? 'Bauturi Incluse' : 'Drinks Included'}
        </h4>
        {note && (
          <p className="text-xs text-emerald-700 leading-relaxed">{note}</p>
        )}
      </div>
    </div>
  )
}

// Icons
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function GlassIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}
