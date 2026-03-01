'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'

interface HeroGalleryProps {
  mainImage: string
  gallery: string[]
  alt: string
  className?: string
}

/**
 * Enhanced hero with gallery thumbnails and full-screen lightbox.
 * Shows the main hero image with a thumbnail strip below.
 * Click any image → full-screen lightbox with prev/next navigation.
 */
export default function HeroGallery({ mainImage, gallery, alt, className = '' }: HeroGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Combine main + gallery images
  const allImages = [mainImage, ...gallery].filter(Boolean)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : null)
  }, [allImages.length])

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null)
  }, [allImages.length])

  // Keyboard nav
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  return (
    <>
      <div className={className}>
        {/* Main hero image */}
        <div
          className="relative h-[60vh] min-h-[400px] bg-navy-900 cursor-pointer group"
          onClick={() => openLightbox(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(0) }}
          aria-label="View full image gallery"
        >
          <Image
            src={mainImage.replace('w=800', 'w=1920')}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />

          {/* Zoom icon on hover */}
          {allImages.length > 1 && (
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIcon />
            </div>
          )}
        </div>

        {/* Gallery thumbnails strip */}
        {allImages.length > 1 && (
          <div className="bg-navy-900 px-4 py-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 max-w-7xl mx-auto">
              {allImages.slice(0, 8).map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === 0 ? 'border-gold-400' : 'border-transparent hover:border-gold-400/50'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={img.replace('w=1920', 'w=200').replace('w=800', 'w=200')}
                    alt={`${alt} ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
              {allImages.length > 8 && (
                <button
                  onClick={() => openLightbox(8)}
                  className="w-16 h-12 md:w-20 md:h-14 rounded-lg bg-navy-700 flex items-center justify-center text-white text-xs font-medium flex-shrink-0 hover:bg-navy-600 transition-colors"
                >
                  +{allImages.length - 8}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-navy-950/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/70 text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          {/* Main image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[lightboxIndex].replace('w=800', 'w=1920')}
              alt={`${alt} ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              quality={85}
            />
          </div>

          {/* Prev button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}

function ZoomIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
    </svg>
  )
}
