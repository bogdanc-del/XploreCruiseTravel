'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useLocale } from '@/i18n/context'
import { getPortInfo } from '@/data/ports'
import VideoEmbed from './VideoEmbed'
import ExcursionCard from './ExcursionCard'

/** API excursion from enriched data (compact format expanded by route) */
interface ApiExcursion {
  id: number
  name: string
  description?: string
  pdf: string
  image: string
}

interface PortDrawerProps {
  portName: string | null
  onClose: () => void
  /** API excursions for this cruise (optional, merged with hardcoded port excursions) */
  apiExcursions?: ApiExcursion[]
}

/**
 * Slide-out drawer panel for port details.
 * Desktop: slides from right. Mobile: slides from bottom.
 * Contains: photo, description, highlights, YouTube video, excursion cards.
 */
export default function PortDrawer({ portName, onClose, apiExcursions = [] }: PortDrawerProps) {
  const { locale } = useLocale()
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const isOpen = portName !== null
  const portInfo = portName ? getPortInfo(portName) : null

  // Focus trap + Escape to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    },
    [onClose]
  )

  // Save/restore focus, lock body scroll
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)

      // Focus the drawer after animation
      setTimeout(() => {
        const closeBtn = drawerRef.current?.querySelector<HTMLElement>('button')
        closeBtn?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  // If we don't have port info, show a minimal drawer with API excursions if available
  if (!portInfo) {
    return (
      <DrawerShell ref={drawerRef} onClose={onClose}>
        {/* Header — port name only (no image available) */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-navy-800 to-navy-900 flex-shrink-0">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label={locale === 'ro' ? 'Inchide' : 'Close'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
              {portName}
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <p className="text-sm text-navy-500 italic">
            {locale === 'ro'
              ? 'Informatii detaliate despre acest port vor fi disponibile in curand.'
              : 'Detailed information about this port will be available soon.'}
          </p>

          {/* Show API excursions if available */}
          {apiExcursions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-1.5">
                <CompassIcon />
                {locale === 'ro' ? 'Excursii disponibile' : 'Available Excursions'}
              </h3>
              <div className="space-y-3">
                {apiExcursions.map((exc) => (
                  <ApiExcursionItem key={exc.id} excursion={exc} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerShell>
    )
  }

  const description = locale === 'ro' ? portInfo.description_ro : portInfo.description
  const country = locale === 'ro' ? portInfo.country_ro : portInfo.country
  const highlights = locale === 'ro' ? portInfo.highlights_ro : portInfo.highlights

  return (
    <DrawerShell ref={drawerRef} onClose={onClose}>
      {/* Header with port image */}
      <div className="relative h-48 sm:h-56 bg-navy-900 flex-shrink-0">
        <Image
          src={portInfo.image_url}
          alt={portInfo.name}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label={locale === 'ro' ? 'Inchide' : 'Close'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Port name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">
            {portInfo.name}
          </h2>
          <p className="text-sm text-navy-200">{country}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Description */}
        <p className="text-sm text-navy-600 leading-relaxed">{description}</p>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-1.5">
              <StarIcon />
              {locale === 'ro' ? 'Atractii Principale' : 'Top Highlights'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-50 text-gold-700 border border-gold-200"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Video */}
        {portInfo.youtube_video_id && (
          <div>
            <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-1.5">
              <PlayIcon />
              {locale === 'ro' ? 'Video' : 'Video'}
            </h3>
            <VideoEmbed
              videoId={portInfo.youtube_video_id}
              title={`${portInfo.name} - ${locale === 'ro' ? 'Ghid Turistic' : 'Travel Guide'}`}
            />
          </div>
        )}

        {/* Excursions — hardcoded port data */}
        {portInfo.excursions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-1.5">
              <CompassIcon />
              {locale === 'ro' ? 'Excursii Recomandate' : 'Recommended Excursions'}
            </h3>
            <div className="space-y-3">
              {portInfo.excursions.map((exc, i) => (
                <ExcursionCard key={i} excursion={exc} />
              ))}
            </div>
          </div>
        )}

        {/* API Excursions — from cruise-specific enriched data */}
        {apiExcursions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-1.5">
              <CompassIcon />
              {locale === 'ro' ? 'Excursii opționale' : 'Optional Excursions'}
            </h3>
            <div className="space-y-3">
              {apiExcursions.map((exc) => (
                <ApiExcursionItem key={exc.id} excursion={exc} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DrawerShell>
  )
}

// ============================================================
// Drawer Shell (overlay + slide panel)
// ============================================================

import { forwardRef } from 'react'

const DrawerShell = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; onClose: () => void }
>(function DrawerShell({ children, onClose }, ref) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/50 z-[60] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        className="fixed z-[61] bg-white shadow-2xl flex flex-col inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[480px] sm:max-h-none sm:rounded-none sm:rounded-l-2xl animate-slide-in-right"
      >
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-navy-300" />
        </div>
        {children}
      </div>

      {/* Animations — using dangerouslySetInnerHTML to avoid styled-jsx build issues */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-in-right {
          animation: slideInBottom 0.3s ease-out;
        }
        @media (min-width: 640px) {
          .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      ` }} />
    </>
  )
})

// API Excursion Item — compact card for excursions from enriched data
function ApiExcursionItem({ excursion, locale }: { excursion: ApiExcursion; locale: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-navy-200 bg-white p-2.5 hover:shadow-md hover:border-gold-300 transition-all duration-200">
      {excursion.image && (
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-navy-100">
          <Image
            src={excursion.image}
            alt={excursion.name}
            fill
            sizes="80px"
            className="object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <p className="font-semibold text-navy-900 text-sm leading-tight line-clamp-2">
          {excursion.name}
        </p>
        {excursion.pdf && (
          <a
            href={excursion.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-700 font-medium mt-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            {locale === 'ro' ? 'Detalii (PDF)' : 'Details (PDF)'}
          </a>
        )}
      </div>
    </div>
  )
}

// Icons
function StarIcon() {
  return (
    <svg className="w-4 h-4 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg className="w-4 h-4 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.115 5.19.319 1.913A6 6 0 0 0 8.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 0 0 2.288-4.042 1.087 1.087 0 0 0-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 0 1-.98-.314l-.295-.295a1.125 1.125 0 0 1 0-1.591l.13-.132a1.125 1.125 0 0 1 1.3-.21l.603.302a.809.809 0 0 0 1.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 0 0 1.528-1.732l.146-.292M6.115 5.19A9 9 0 1 0 17.18 4.64M6.115 5.19A8.965 8.965 0 0 1 12 3c1.929 0 3.716.607 5.18 1.64" />
    </svg>
  )
}
