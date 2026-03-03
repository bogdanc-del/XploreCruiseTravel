'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useT } from '@/i18n/context'

// Lazy-load the interactive map only when user explicitly clicks
const RouteMapInteractive = dynamic(() => import('@/components/cruise/RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] bg-navy-50 rounded-2xl animate-pulse" />,
})

interface RouteMapStaticProps {
  routeMapUrl?: string | null
  departurePort: string
  portsOfCall: string[]
  className?: string
  onPortClick?: (portName: string) => void
  isOneWay?: boolean
}

/**
 * RouteMapStatic — shows a pre-rendered static image of the route map.
 * If no static image is available, falls back to the interactive Leaflet map.
 * Users can click "Explore interactive map" to switch to the full Leaflet view.
 */
export default function RouteMapStatic({
  routeMapUrl,
  departurePort,
  portsOfCall,
  className = '',
  onPortClick,
  isOneWay = false,
}: RouteMapStaticProps) {
  const [showInteractive, setShowInteractive] = useState(false)
  const t = useT()

  // Fallback to interactive map if no static image
  if (!routeMapUrl || showInteractive) {
    return (
      <div className={className}>
        {showInteractive && routeMapUrl && (
          <button
            onClick={() => setShowInteractive(false)}
            className="mb-2 text-xs text-navy-500 hover:text-navy-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('map_back_to_static') || 'Înapoi la imagine'}
          </button>
        )}
        <RouteMapInteractive
          departurePort={departurePort}
          portsOfCall={portsOfCall}
          onPortClick={onPortClick}
          isOneWay={isOneWay}
          className=""
        />
      </div>
    )
  }

  // Static image view
  return (
    <div className={`relative rounded-2xl overflow-hidden border border-navy-100 group ${className}`}>
      {/* Map title overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-navy-100">
        <span className="text-xs font-semibold text-navy-600 uppercase tracking-wider flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-gold-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          </svg>
          {t('map_title')}
        </span>
      </div>

      {/* Static map image */}
      <div className="relative w-full" style={{ aspectRatio: '800 / 450' }}>
        <Image
          src={routeMapUrl}
          alt={`${t('map_title')} — ${departurePort}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          priority={false}
          quality={90}
        />
      </div>

      {/* Interactive map toggle button */}
      <button
        onClick={() => setShowInteractive(true)}
        className="absolute bottom-14 right-3 z-10 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-navy-100
                   text-xs font-medium text-navy-700 hover:bg-gold-50 hover:border-gold-300 hover:text-navy-900
                   transition-all duration-200 flex items-center gap-1.5
                   opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={t('map_explore_interactive') || 'Explore interactive map'}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
        </svg>
        {t('map_explore_interactive') || 'Hartă interactivă'}
      </button>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-white border-t border-navy-100 text-xs text-navy-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gold-500 border-2 border-white shadow inline-block" />
          <span>{t('map_departure')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border-2 border-navy-800 inline-block" />
          <span>{t('map_port')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 border-t-2 border-gold-400 inline-block" />
          <span>{t('map_route')}</span>
        </div>
      </div>
    </div>
  )
}
