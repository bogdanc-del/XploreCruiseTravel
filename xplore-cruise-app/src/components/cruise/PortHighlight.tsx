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
  /** If set, renders as embark/disembark port with gold accent node */
  isEmbarkDisembark?: 'embark' | 'disembark'
  /** Custom label for embark/disembark (e.g., "Departure", "Arrival", "Return") */
  embarkLabel?: string
  /** Date label shown under the port name for embark ports */
  dateLabel?: string
}

/**
 * Interactive port item in the itinerary timeline.
 * Replaces plain port names with clickable cards that show
 * a thumbnail and "Explore" indicator when port data exists.
 * Now also supports embark/disembark ports with gold accent.
 */
export default function PortHighlight({
  portName,
  dayNumber,
  arrivalTime,
  departureTime,
  onClick,
  className = '',
  isEmbarkDisembark,
  embarkLabel,
  dateLabel,
}: PortHighlightProps) {
  const { locale } = useLocale()
  const portInfo = getPortInfo(portName)
  const isInteractive = !!portInfo && !!onClick
  const isEndpoint = !!isEmbarkDisembark

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

  // Determine the last item style (no bottom padding for disembark)
  const pbClass = isEmbarkDisembark === 'disembark' ? '' : 'pb-6'

  return (
    <div
      className={`relative flex items-start gap-5 ${pbClass} ${className}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? `${exploreLabel} ${portName}` : undefined}
    >
      {/* Timeline node — gold for embark/disembark, white for regular ports */}
      {isEndpoint ? (
        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.692-.8 1.258l.108.646c.11.656.054 1.33-.17 1.957l-.007.02a9 9 0 0 1-7.011-4.692" />
          </svg>
        </div>
      ) : (
        <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-navy-300 flex items-center justify-center">
          <span className="text-xs font-bold text-navy-600">{dayNumber - 1}</span>
        </div>
      )}

      {/* Port content */}
      <div className={`flex-1 pt-0.5 min-w-0 ${isInteractive ? 'group cursor-pointer active:scale-[0.98] transition-transform' : ''}`}>
        {/* Label: Day X for regular, or custom embark/disembark label */}
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isEndpoint ? 'text-gold-600' : 'text-navy-400'}`}>
          {isEndpoint && embarkLabel ? embarkLabel : dayLabel}
        </p>

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
              {/* Date label for embark */}
              {dateLabel && (
                <p className="text-xs text-navy-500 mt-0.5">{dateLabel}</p>
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

            {/* Explore arrow — always visible on mobile (touch), hover-reveal on desktop */}
            <div className="flex items-center gap-1 text-gold-500 opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <span className="text-xs font-medium">{exploreLabel}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-navy-900">{portName}</p>
            {/* Date label for embark */}
            {dateLabel && (
              <p className="text-xs text-navy-500 mt-0.5">{dateLabel}</p>
            )}
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
