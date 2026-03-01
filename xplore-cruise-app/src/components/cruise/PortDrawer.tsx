'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useLocale } from '@/i18n/context'
import { getPortInfo } from '@/data/ports'
import VideoEmbed from './VideoEmbed'
import ExcursionCard from './ExcursionCard'

interface PortDrawerProps {
  portName: string | null
  onClose: () => void
}

/**
 * Slide-out drawer panel for port details.
 * Desktop: slides from right. Mobile: slides from bottom.
 * Contains: photo, description, highlights, YouTube video, excursion cards.
 */
export default function PortDrawer({ portName, onClose }: PortDrawerProps) {
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

  // If we don't have port info, show a minimal drawer
  if (!portInfo) {
    return (
      <DrawerShell ref={drawerRef} onClose={onClose}>
        <div className="p-6 text-center">
          <p className="text-navy-500">
            {locale === 'ro'
              ? `Informatii despre ${portName} vor fi disponibile in curand.`
              : `Information about ${portName} will be available soon.`}
          </p>
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

        {/* Excursions */}
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
