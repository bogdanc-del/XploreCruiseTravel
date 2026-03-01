'use client'

import Image from 'next/image'
import { getPortInfo } from '@/data/ports'
import { useLocale } from '@/i18n/context'

interface PortHighlightProps {
  portName: string
  dayNumber: number
  arrivalTime?: string | null
  departureTime?: string | null
  onClick?: (portName: string) => void
  className?: string
}

/**
 * Interactive port item in the itinerary timeline.
 * Replaces plain port names with clickable cards that show
 * a thumbnail and "Explore" indicator when port data exists.
 */
export default function PortHighlight({
  portName,
  dayNumber,
  arrivalTime,
  departureTime,
  onClick,
  className = '',
}: PortHighlightProps) {
  const { locale } = useLocale()
  const portInfo = getPortInfo(portName)
  const isInteractive = !!portInfo && !!onClick

  const handleClick = () => {
    if (isInteractive) {
      onClick!(portName)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick!(portName)
    }
  }

  const dayLabel = locale === 'ro' ? `Ziua ${dayNumber}` : `Day ${dayNumber}`
  const exploreLabel = locale === 'ro' ? 'Exploreaza' : 'Explore'

  return (
    <div
      className={`relative flex items-start gap-5 pb-6 ${className}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `${exploreLabel} ${portName}` : undefined}
    >
      {/* Timeline node */}
      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-navy-300 flex items-center justify-center">
        <span className="text-xs font-bold text-navy-600">{dayNumber - 1}</span>
      </div>

      {/* Port content */}
      <div className={`flex-1 pt-0.5 min-w-0 ${isInteractive ? 'group cursor-pointer' : ''}`}>
        <p className="text-xs text-navy-400 font-medium uppercase tracking-wider mb-1">{dayLabel}</p>

        {isInteractive && portInfo ? (
          <div className="flex items-center gap-3 p-2 -m-2 rounded-lg group-hover:bg-gold-50 transition-colors duration-200">
            {/* Port thumbnail */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-navy-200 group-hover:border-gold-300 transition-colors">
              <Image
                src={portInfo.image_url}
                alt={portName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy-900 text-sm group-hover:text-gold-700 transition-colors truncate">
                {portName}
              </p>
              {portInfo.country && (
                <p className="text-xs text-navy-400">
                  {locale === 'ro' ? portInfo.country_ro : portInfo.country}
                </p>
              )}
              {/* Times */}
              {(arrivalTime || departureTime) && (
                <p className="text-xs text-navy-400 mt-0.5">
                  {arrivalTime && `${locale === 'ro' ? 'Sosire' : 'Arrival'}: ${arrivalTime}`}
                  {arrivalTime && departureTime && ' | '}
                  {departureTime && `${locale === 'ro' ? 'Plecare' : 'Departure'}: ${departureTime}`}
                </p>
              )}
            </div>

            {/* Explore arrow */}
            <div className="flex items-center gap-1 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <span className="text-xs font-medium hidden sm:inline">{exploreLabel}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-navy-900">{portName}</p>
            {(arrivalTime || departureTime) && (
              <p className="text-xs text-navy-400 mt-0.5">
                {arrivalTime && `${locale === 'ro' ? 'Sosire' : 'Arrival'}: ${arrivalTime}`}
                {arrivalTime && departureTime && ' | '}
                {departureTime && `${locale === 'ro' ? 'Plecare' : 'Departure'}: ${departureTime}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
